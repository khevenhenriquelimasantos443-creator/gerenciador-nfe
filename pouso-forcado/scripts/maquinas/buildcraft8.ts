import { Block, BlockCustomComponent, BlockPermutation, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import type { Acao } from "../missoes/lista.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { entrada, entregar, gastarCE } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";
import { gerar } from "../util/rede.js";

/*
 * 1.43.0: BuildCraft 8 (números do código do mod, em MJ; 1 MJ = 10 RF; 1 E = 4.000 RF; o gasto é em cE = 40 RF).
 * - Motor de Redstone (TileEngineRedstone_BC8): com redstone, 0,05 MJ/t.
 * - Motor Stirling (TileEngineStone_BC8): com redstone, queima o combustível do forno (o tempo de queima do jogo) a
 *   1 MJ/t.
 * - Poço de Mineração (TileMiningWell + BlockUtil.computeBlockBreakPower): 16 × (dureza + 1) × 2 MJ por bloco, um por
 *   segundo, para baixo em linha reta; os itens vão para o baú de cima.
 * - Comporta: um balde por segundo enche o buraco mais fundo embaixo dela (busca até 64 blocos).
 * - Enchedor: a área entre os Marcos (até 64 blocos); até 8 blocos por segundo; quebrar custa como minerar, pôr custa
 *   distância × 10 MJ (SnapshotBuilder).
 */
const MJ_CE = 10 / 40; // 1 MJ = 10 RF = 0,25 cE
const QUEIMA: Readonly<Record<string, number>> = {
  "minecraft:coal": 1600, "minecraft:charcoal": 1600, "minecraft:coal_block": 16000, "minecraft:blaze_rod": 2400, "minecraft:lava_bucket": 20000,
  "minecraft:stick": 100, "minecraft:dried_kelp_block": 4001, "cl:coque": 3200, "cl:bloco_coque": 32000,
  ...Object.fromEntries(["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry"].flatMap((m) => [[`minecraft:${m}_log`, 300], [`minecraft:${m}_planks`, 300]])),
};
// Dureza dos blocos mais comuns (o script não lê a dureza do jogo); o resto conta como pedra.
const DUREZA: Readonly<Record<string, number>> = {
  "minecraft:dirt": 0.5, "minecraft:grass_block": 0.6, "minecraft:sand": 0.5, "minecraft:red_sand": 0.5, "minecraft:gravel": 0.6, "minecraft:clay": 0.6,
  "minecraft:sandstone": 0.8, "minecraft:red_sandstone": 0.8, "minecraft:netherrack": 0.4, "minecraft:deepslate": 3, "minecraft:cobbled_deepslate": 3.5,
  "minecraft:tuff": 1.5, "minecraft:obsidian": 50, "minecraft:end_stone": 3,
};
const dureza = (id: string) => DUREZA[id] ?? (id.includes("ore") ? 3 : 1.5);
const custoQuebrar = (id: string) => 16 * (dureza(id) + 1) * 2; // MJ
const INQUEBRAVEIS = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:end_portal_frame", "minecraft:command_block", "minecraft:structure_block", "cl:painel_nave", "cl:bau_tesouro"]);

function ligado(b: Block): boolean {
  if ((b.getRedstonePower() ?? 0) > 0) return true;
  return [b.above(), b.below(), b.north(), b.south(), b.east(), b.west()].some((v) => (v?.getRedstonePower() ?? 0) > 0);
}
function avisar(b: Block, acao: Acao): void {
  try {
    for (const j of b.dimension.getPlayers({ location: { x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 }, maxDistance: 16 })) registrarAcao(j, acao);
  } catch {
    // descarregado
  }
}

// ---------- Motores ----------
export const motorRedstone: BlockCustomComponent = {
  onTick({ block: b }) {
    if (ligado(b)) gerar(b, (0.05 * 20 * 10) / 4000);
  },
};
export const motorStirling: BlockCustomComponent = {
  onTick({ block: b }) {
    if (!ligado(b)) return;
    let queima = ler<number>("bc_queima", b, 0);
    if (queima <= 0) {
      const c = entrada(b);
      if (!c) return;
      for (let s = 0; s < c.size && queima <= 0; s++) {
        const it = c.getItem(s);
        const t = it && QUEIMA[it.typeId];
        if (!it || !t) continue;
        if (it.amount > 1) {
          it.amount--;
          c.setItem(s, it);
        } else c.setItem(s, undefined);
        if (it.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
        queima = t;
      }
      if (queima <= 0) return;
    }
    const t = Math.min(20, queima);
    if (gerar(b, (1 * t * 10) / 4000) <= 0) return gravar("bc_queima", b, queima);
    gravar("bc_queima", b, queima - t);
    avisar(b, "bc8_motor");
  },
};

// ---------- Poço de Mineração ----------
export const pocoMineracao: BlockCustomComponent = {
  onTick({ block: b }) {
    const prof = ler<number>("bc_prof", b, 1);
    const alvo = b.dimension.getBlock({ x: b.x, y: b.y - prof, z: b.z });
    if (!alvo || alvo.y <= b.dimension.heightRange.min) return;
    if (alvo.isAir || alvo.isLiquid) return gravar("bc_prof", b, prof + 1);
    if (INQUEBRAVEIS.has(alvo.typeId)) return;
    if (!gastarCE(b, custoQuebrar(alvo.typeId) * MJ_CE)) return;
    const onde = { x: alvo.x + 0.5, y: alvo.y + 0.5, z: alvo.z + 0.5 };
    b.dimension.runCommand(`setblock ${alvo.x} ${alvo.y} ${alvo.z} air destroy`);
    gravar("bc_prof", b, prof + 1);
    const { dimension, x, y, z } = b;
    system.runTimeout(() => {
      const bloco = dimension.getBlock({ x, y, z });
      if (!bloco) return;
      for (const e of dimension.getEntities({ type: "minecraft:item", location: onde, maxDistance: 1.5 })) {
        const it = e.getComponent("minecraft:item")?.itemStack;
        if (!it) continue;
        const sobra = entrada(bloco)?.addItem(it);
        if (sobra === undefined) e.remove();
        else e.teleport({ x: x + 0.5, y: y + 1.2, z: z + 0.5 });
      }
    }, 2);
    const conta = ler<number>("bc_cavados", b, 0) + 1;
    gravar("bc_cavados", b, conta);
    avisar(b, "bc8_poco");
  },
};

// ---------- Comporta ----------
const BALDES: Readonly<Record<string, string>> = { "minecraft:water_bucket": "minecraft:water", "minecraft:lava_bucket": "minecraft:lava" };
function buracoMaisFundo(b: Block): Block | undefined {
  const inicio = b.below();
  if (!inicio?.isAir) return undefined;
  const visto = new Set<string>();
  const fila: Block[] = [inicio];
  let melhor = inicio;
  while (fila.length && visto.size < 256) {
    const atual = fila.shift()!;
    const k = `${atual.x},${atual.y},${atual.z}`;
    if (visto.has(k)) continue;
    visto.add(k);
    if (atual.y < melhor.y) melhor = atual;
    for (const v of [atual.below(), atual.north(), atual.south(), atual.east(), atual.west()]) {
      if (!v || !v.isAir || v.y >= b.y) continue;
      if (Math.abs(v.x - b.x) > 64 || Math.abs(v.z - b.z) > 64) continue;
      fila.push(v);
    }
  }
  return melhor;
}
export const comporta: BlockCustomComponent = {
  onTick({ block: b }) {
    const c = entrada(b);
    if (!c) return;
    for (let s = 0; s < c.size; s++) {
      const it = c.getItem(s);
      const fluido = it && BALDES[it.typeId];
      if (!it || !fluido) continue;
      const alvo = buracoMaisFundo(b);
      if (!alvo) return;
      alvo.setType(fluido);
      c.setItem(s, new ItemStack("minecraft:bucket", 1));
      avisar(b, "bc8_comporta");
      return;
    }
  },
};

// ---------- Enchedor e Marcos ----------
type Padrao = "limpar" | "encher" | "caixa" | "piramide";
type Obra = { p: Padrao; a: [number, number, number]; z: [number, number, number]; i: number };
const PADROES: Padrao[] = ["limpar", "encher", "caixa", "piramide"];
// Os Marcos ficam numa lista do mundo (são poucos): o Enchedor não precisa varrer a área atrás deles.
const LISTA_MARCOS = "cl:bc_marcos";
type Marco = { d: string; x: number; y: number; z: number };
let marcos: Marco[] | undefined;
function listaMarcos(): Marco[] {
  if (!marcos)
    try {
      marcos = JSON.parse((world.getDynamicProperty(LISTA_MARCOS) as string | undefined) ?? "[]") as Marco[];
    } catch {
      marcos = [];
    }
  return marcos;
}
const salvarMarcos = () => world.setDynamicProperty(LISTA_MARCOS, JSON.stringify(listaMarcos()));
export const marcoComp: BlockCustomComponent = {
  onPlace({ block }) {
    const m = { d: block.dimension.id, x: block.x, y: block.y, z: block.z };
    if (!listaMarcos().some((k) => k.d === m.d && k.x === m.x && k.y === m.y && k.z === m.z)) {
      listaMarcos().push(m);
      salvarMarcos();
    }
  },
  onPlayerBreak({ block }) {
    marcos = listaMarcos().filter((k) => !(k.d === block.dimension.id && k.x === block.x && k.y === block.y && k.z === block.z));
    salvarMarcos();
  },
};
function area(b: Block): [Vector3, Vector3] | undefined {
  const perto = listaMarcos()
    .filter((m) => m.d === b.dimension.id && Math.abs(m.x - b.x) <= 64 && Math.abs(m.y - b.y) <= 64 && Math.abs(m.z - b.z) <= 64)
    .filter((m) => b.dimension.getBlock(m)?.typeId === "cl:marco")
    .sort((p, q) => Math.hypot(p.x - b.x, p.y - b.y, p.z - b.z) - Math.hypot(q.x - b.x, q.y - b.y, q.z - b.z));
  if (perto.length < 2) return undefined;
  const [m1, m2] = perto;
  return [{ x: Math.min(m1.x, m2.x), y: Math.min(m1.y, m2.y), z: Math.min(m1.z, m2.z) }, { x: Math.max(m1.x, m2.x), y: Math.max(m1.y, m2.y), z: Math.max(m1.z, m2.z) }];
}
/** A posição número i da obra (ou undefined: fora do padrão), e o total. */
function posicao(o: Obra, i: number): { p?: Vector3; total: number } {
  const [ax, ay, az] = o.a, [zx, zy, zz] = o.z;
  const lx = zx - ax + 1, ly = zy - ay + 1, lz = zz - az + 1;
  const total = lx * ly * lz;
  if (i >= total) return { total };
  // Limpar: de cima para baixo; o resto, de baixo para cima.
  const camada = Math.floor(i / (lx * lz));
  const y = o.p === "limpar" ? zy - camada : ay + camada;
  const x = ax + (i % lx), z = az + (Math.floor(i / lx) % lz);
  if (o.p === "caixa" && !(x === ax || x === zx || z === az || z === zz || y === ay || y === zy)) return { total };
  if (o.p === "piramide") {
    const k = y - ay;
    if (x < ax + k || x > zx - k || z < az + k || z > zz - k) return { total };
  }
  return { p: { x, y, z }, total };
}
function blocoDoBau(b: Block): [number, BlockPermutation] | undefined {
  const c = entrada(b);
  if (!c) return undefined;
  for (let s = 0; s < c.size; s++) {
    const it = c.getItem(s);
    if (!it) continue;
    try {
      return [s, BlockPermutation.resolve(it.typeId)];
    } catch {
      // não é bloco
    }
  }
  return undefined;
}
export const enchedor: BlockCustomComponent = {
  onTick({ block: b }) {
    const o = ler<Obra | undefined>("bc_obra", b, undefined);
    if (!o) return;
    let feitos = 0;
    for (let passos = 0; passos < 64 && feitos < 8; passos++) {
      const { p, total } = posicao(o, o.i);
      if (o.i >= total) {
        gravar("bc_obra", b, undefined);
        avisar(b, "bc8_enchedor");
        return;
      }
      if (!p) {
        o.i++;
        continue;
      }
      const alvo = b.dimension.getBlock(p);
      if (!alvo) break;
      if (o.p === "limpar") {
        if (!alvo.isAir && !INQUEBRAVEIS.has(alvo.typeId) && !(alvo.x === b.x && alvo.y === b.y && alvo.z === b.z)) {
          if (!gastarCE(b, custoQuebrar(alvo.typeId) * MJ_CE)) break;
          alvo.setType("minecraft:air");
          feitos++;
        }
      } else if (alvo.isAir || alvo.isLiquid) {
        const bloco = blocoDoBau(b);
        if (!bloco) break;
        const dist = Math.hypot(p.x - b.x, p.y - b.y, p.z - b.z);
        if (!gastarCE(b, dist * 10 * MJ_CE)) break;
        alvo.setPermutation(bloco[1]);
        const c = entrada(b)!;
        const it = c.getItem(bloco[0])!;
        if (it.amount > 1) {
          it.amount--;
          c.setItem(bloco[0], it);
        } else c.setItem(bloco[0], undefined);
        feitos++;
      }
      o.i++;
    }
    gravar("bc_obra", b, o);
  },
  onPlayerInteract({ block, player }) {
    if (!player) return;
    abrirUmMenu(player, async () => {
      const f = new ActionFormData().title({ translate: "cl.bc8.enchedor_titulo" }).body({ translate: "cl.bc8.enchedor_corpo" });
      for (const p of PADROES) f.button({ translate: `cl.bc8.${p}` });
      f.button({ translate: "cl.bc8.parar" });
      const r = await f.show(player);
      if (r.canceled || r.selection === undefined || !block.isValid) return;
      if (r.selection >= PADROES.length) return gravar("bc_obra", block, undefined);
      comecarObra(player, block, PADROES[r.selection]);
    });
  },
};
export function comecarObra(j: Player | undefined, b: Block, p: Padrao): boolean {
  const a = area(b);
  if (!a) {
    if (j) aviso(j, "cl.bc8.sem_marcos", 3);
    return false;
  }
  gravar("bc_obra", b, { p, a: [a[0].x, a[0].y, a[0].z], z: [a[1].x, a[1].y, a[1].z], i: 0 } as Obra);
  return true;
}

export function registrarBuildcraft8(): void {
  registrarDetalhe("cl:motor_stirling", (b) => ({ translate: "cl.bc8.motor", with: [String(ler<number>("bc_queima", b, 0))] }));
  registrarDetalhe("cl:poco_mineracao", (b) => ({ translate: "cl.bc8.poco", with: [String(ler<number>("bc_prof", b, 1))] }));
  registrarDetalhe("cl:enchedor", (b) => {
    const o = ler<Obra | undefined>("bc_obra", b, undefined);
    if (!o) return undefined;
    const { total } = posicao(o, 0);
    return { translate: "cl.bc8.trabalhando", with: { rawtext: [{ translate: `cl.bc8.${o.p}` }, { text: String(Math.round((100 * o.i) / total)) }] } };
  });
  // Teste no servidor: scriptevent cl:teste_bc8 <obra padrão|ver> x y z.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_bc8" || !(j instanceof Player)) return;
    const [acao, a, x, y, z] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (!b) return;
    if (acao === "obra") console.warn(`[teste_bc8] obra ${comecarObra(j, b, a as Padrao)}`);
    else console.warn(`[teste_bc8] ${b.typeId} queima=${ler("bc_queima", b, 0)} prof=${ler("bc_prof", b, 1)} cavados=${ler("bc_cavados", b, 0)} obra=${JSON.stringify(ler("bc_obra", b, null))}`);
  });
}

import { Block, BlockCustomComponent, EntityDamageCause, GameMode, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DADOS_F69 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { codigoDoItem, guardarNoItem, lerCodigo } from "../util/item_guarda.js";
import { entrada, gastarCE, tirar } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";
import { registrarLigacao } from "./condutos.js";
import { ehLiquidoMk, nomeQuimico, registrarPonta } from "./mekanism_quimica.js";
import { darCalor, laserEm, recebeCalor } from "./mekanism_multiblocos.js";
import { RADIOATIVO, soltarQuimicos } from "./mekanism_radiacao.js";
import { feito } from "./thermal.js";

/*
 * Máquinas da parte 4 (1.52.0), números do Mekanism 10.7.19 (1 cE = 100 J):
 * - Aquecedor Resistivo: energia → calor 1:1 (J/t escolhido); Aquecedor a Lenha: 400 J/t enquanto queima combustível de
 *   fornalha (o tempo de fornalha do item). O calor vai para a Caldeira/Planta de Evaporação encostada ou pelos Condutores
 *   Termodinâmicos (até 64 condutores).
 * - Laser: 10.000 J/t para a frente (64 blocos): carrega Amplificadores/Feixe Trator, acende a fusão pela Matriz de Foco,
 *   quebra blocos (100.000 J por ponto de dureza) e fere (2.500 J por meio coração). Amplificador: guarda até 5 GJ e dispara
 *   tudo quando passa do limite. Feixe Trator: como o amplificador, mas o que ele quebra vai para o baú de cima.
 * - Estabilizador Dimensional: mantém o chunk carregado (5.000 J/t). Barril de Resíduos Radioativos: 512.000 mB de um
 *   químico radioativo, que decai 1 mB por segundo; quebrado, leva o conteúdo.
 */
const ce = (j: number) => j / 100;
const COND = DADOS_F69.condutores as unknown as Record<string, number>;
const ehCondutor = (id: string) => COND[id] !== undefined;
const LADOS: ReadonlyArray<Vector3> = [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }];
const viz = (b: Block): Block[] => {
  const r: Block[] = [];
  for (const d of LADOS) {
    try {
      const v = b.offset(d);
      if (v) r.push(v);
    } catch {
      // chunk descarregado
    }
  }
  return r;
};
const AQUECEDORES = new Set(["cl:aquecedor_resistivo", "cl:aquecedor_lenha"]);

/** Entrega calor à primeira estrutura encostada (ou pelos condutores). */
function aquecer(b: Block, jPorTique: number): boolean {
  const vistos = new Set([`${b.x},${b.y},${b.z}`]);
  const fila = [b];
  let n = 0;
  while (fila.length && n < 64) {
    const at = fila.shift()!;
    for (const v of viz(at)) {
      const k = `${v.x},${v.y},${v.z}`;
      if (vistos.has(k)) continue;
      vistos.add(k);
      if (darCalor(v, jPorTique)) return true;
      if (ehCondutor(v.typeId)) {
        n++;
        fila.push(v);
      }
    }
  }
  return false;
}

// ---------- Aquecedores ----------
function resistivo(b: Block): void {
  const jt = ler<number>("mkah", b, 1000);
  if (!gastarCE(b, Math.max(1, Math.round(ce(jt * 20))))) return;
  if (aquecer(b, jt)) feito(b, "");
}
function lenha(b: Block): void {
  let resta = ler<number>("mkal", b, 0);
  if (resta <= 0) {
    const c = entrada(b);
    if (!c) return;
    for (let s = 0; s < c.size; s++) {
      const it = c.getItem(s);
      const t = it ? QUEIMA[it.typeId] : undefined;
      if (!it || !t) continue;
      tirar(c, it.typeId);
      resta = t;
      break;
    }
    if (resta <= 0) return;
  }
  resta -= 20;
  gravar("mkal", b, Math.max(0, resta));
  if (aquecer(b, 400)) feito(b, "");
}
const QUEIMA: Readonly<Record<string, number>> = {
  "minecraft:coal": 1600, "minecraft:charcoal": 1600, "minecraft:coal_block": 16000, "minecraft:blaze_rod": 2400, "minecraft:lava_bucket": 20000,
  "minecraft:stick": 100, "minecraft:dried_kelp_block": 4000, "cl:biocombustivel": 200, "cl:bloco_biocombustivel": 2000,
  ...Object.fromEntries(["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry"].flatMap((w) => [[`minecraft:${w}_log`, 300], [`minecraft:${w}_planks`, 300]])),
};

// ---------- Laser, Amplificador e Feixe Trator ----------
const DIRS: Readonly<Record<string, Vector3>> = { north: { x: 0, y: 0, z: -1 }, south: { x: 0, y: 0, z: 1 }, east: { x: 1, y: 0, z: 0 }, west: { x: -1, y: 0, z: 0 } };
function frente(b: Block): Vector3 {
  try {
    return DIRS[b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string] ?? DIRS.north;
  } catch {
    return DIRS.north;
  }
}
const RECEBEM = new Set(["cl:amplificador_laser", "cl:feixe_trator_laser"]);
const CAP_AMP = 5000000000;
const DUREZA: Readonly<Record<string, number>> = { "minecraft:obsidian": 50, "minecraft:crying_obsidian": 50, "minecraft:ancient_debris": 30, "minecraft:deepslate": 3,
  "minecraft:dirt": 0.5, "minecraft:grass_block": 0.6, "minecraft:sand": 0.5, "minecraft:gravel": 0.6, "minecraft:netherrack": 0.4 };
const NAO_QUEBRA = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:end_portal_frame", "minecraft:reinforced_deepslate"]);
/** Um feixe com `joules` saindo de `b` para a frente. Devolve o que sobrou (não usado). */
function feixe(b: Block, joules: number, coleta?: Block): void {
  const d = frente(b), dim = b.dimension;
  const centro = (p: Vector3) => ({ x: p.x + 0.5, y: p.y + 0.5, z: p.z + 0.5 });
  for (let k = 1; k <= 64; k++) {
    const p = { x: b.x + d.x * k, y: b.y, z: b.z + d.z * k };
    let alvo: Block | undefined;
    try {
      alvo = dim.getBlock(p);
    } catch {
      return;
    }
    if (!alvo) return;
    // Quem está no caminho leva dano (2.500 J por meio coração, até 20 por disparo).
    for (const e of dim.getEntities({ location: centro(p), maxDistance: 0.9 })) {
      if (e.typeId === "minecraft:item") continue;
      try {
        e.applyDamage(Math.min(20, Math.floor(joules / 2500)), { cause: EntityDamageCause.fire });
      } catch {
        // sem vida
      }
    }
    if (k % 4 === 0) dim.spawnParticle("minecraft:basic_flame_particle", centro(p));
    if (alvo.isAir || alvo.isLiquid || alvo.typeId.includes("glass")) continue;
    if (RECEBEM.has(alvo.typeId)) {
      gravar("mkla", alvo, Math.min(CAP_AMP, ler<number>("mkla", alvo, 0) + joules));
      return;
    }
    if (laserEm(alvo, joules)) return;
    if (NAO_QUEBRA.has(alvo.typeId)) return;
    const acumulado = ler<number>("mklq", alvo, 0) + joules;
    const precisa = (DUREZA[alvo.typeId] ?? 2) * 100000;
    if (acumulado < precisa) {
      gravar("mklq", alvo, acumulado);
      return;
    }
    gravar("mklq", alvo, undefined);
    if (coleta) {
      const c = entrada(coleta);
      const it = alvo.getItemStack(1, false);
      alvo.setType("minecraft:air");
      if (it) {
        const sobra = c?.addItem(it) ?? it;
        if (sobra) dim.spawnItem(sobra, coleta.center());
      }
    } else dim.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
    return;
  }
}
function laser(b: Block): void {
  if (!gastarCE(b, ce(10000 * 20))) return;
  feixe(b, 10000 * 20);
}
function amplificador(b: Block, coleta: boolean): void {
  const tem = ler<number>("mkla", b, 0);
  const limite = ler<number>("mklt", b, 400000000);
  if (tem <= 0 || tem < limite) return;
  gravar("mkla", b, 0);
  feixe(b, tem, coleta ? b : undefined);
  b.dimension.playSound("beacon.activate", b.center(), { volume: 0.6 });
}

// ---------- Estabilizador Dimensional ----------
const area = (b: Vector3) => `mkest_${b.x}_${b.y}_${b.z}`.replace(/-/g, "m");
function estabilizador(b: Block): void {
  const ligado = ler<boolean>("mkes", b, false);
  const tem = gastarCE(b, ce(5000 * 100)); // ciclo de 100 tiques
  if (tem && !ligado) {
    try {
      b.dimension.runCommand(`tickingarea add circle ${b.x} ${b.y} ${b.z} 0 ${area(b)}`);
      gravar("mkes", b, true);
    } catch {
      // já tem 10 áreas
    }
  } else if (!tem && ligado) {
    try {
      b.dimension.runCommand(`tickingarea remove ${area(b)}`);
    } catch {
      // não existia
    }
    gravar("mkes", b, false);
  }
}

// ---------- Barril de Resíduos Radioativos ----------
type Br = { q?: string; mb: number };
const CAP_BARRIL = 512000;
function barril(b: Block): void {
  const t = ler<Br>("mkbr", b, { mb: 0 });
  if (!(t.mb > 0)) return;
  t.mb = Math.max(0, t.mb - 1);
  if (!t.mb) delete t.q;
  gravar("mkbr", b, t);
}
registrarPonta(["cl:barril_residuos_radioativos"], (b) => {
  const t = ler<Br>("mkbr", b, { mb: 0 });
  return {
    oferece: () => (t.q && t.mb > 0 ? [[t.q, t.mb]] : []),
    aceita: (q) => (RADIOATIVO[q] && !ehLiquidoMk(q) && (!t.q || t.mb <= 0 || t.q === q) ? CAP_BARRIL - t.mb : 0),
    mexer: (q, mb) => {
      t.mb = Math.max(0, t.mb + mb);
      t.q = t.mb > 0 ? q : undefined;
    },
    gravar: () => gravar("mkbr", b, t),
  };
});

const TICK: Readonly<Record<string, (b: Block) => void>> = {
  "cl:aquecedor_resistivo": resistivo, "cl:aquecedor_lenha": lenha, "cl:laser_mk": laser, "cl:amplificador_laser": (b) => amplificador(b, false),
  "cl:feixe_trator_laser": (b) => amplificador(b, true), "cl:estabilizador_dimensional": estabilizador, "cl:barril_residuos_radioativos": barril,
};
const J = (j: number) => (j >= 1e9 ? `${(j / 1e9).toFixed(2)} GJ` : j >= 1e6 ? `${(j / 1e6).toFixed(1)} MJ` : `${Math.round(j / 1000)} kJ`);
const texto = (b: Block): RawMessage | undefined => {
  switch (b.typeId) {
    case "cl:aquecedor_resistivo":
      return { translate: "cl.mkn.aquecedor", with: [ler<number>("mkah", b, 1000).toLocaleString("pt-BR")] };
    case "cl:aquecedor_lenha":
      return { translate: "cl.mkn.lenha", with: [ler<number>("mkal", b, 0) > 0 ? "🔥" : "—"] };
    case "cl:laser_mk":
      return { translate: "cl.mkn.laser" };
    case "cl:amplificador_laser":
    case "cl:feixe_trator_laser":
      return { translate: "cl.mkn.amplificador", with: [J(ler<number>("mkla", b, 0)), J(ler<number>("mklt", b, 400000000))] };
    case "cl:estabilizador_dimensional":
      return { translate: "cl.mkn.estabilizador", with: { rawtext: [{ translate: ler<boolean>("mkes", b, false) ? "cl.mkn.ligado" : "cl.mkn.desligado" }] } };
    case "cl:barril_residuos_radioativos": {
      const t = ler<Br>("mkbr", b, { mb: 0 });
      return { translate: "cl.mkn.barril", with: { rawtext: [t.q && t.mb > 0 ? { rawtext: [{ text: `${t.mb.toLocaleString("pt-BR")} mB ` }, nomeQuimico(t.q)] } : { translate: "cl.mkq.vazio" }] } };
    }
  }
  return undefined;
};
async function menuNumero(j: Player, b: Block, chave: string, titulo: string, rotulo: string, padrao: number, escala: number): Promise<void> {
  const atual = ler<number>(chave, b, padrao) / escala;
  const r = await new ModalFormData().title({ translate: titulo }).textField({ translate: rotulo }, String(padrao / escala), { defaultValue: String(atual) }).show(j);
  if (r.canceled || !r.formValues || !b.isValid) return;
  const v = Number(String(r.formValues.find((x) => x !== undefined)).replace(",", "."));
  if (v >= 0) gravar(chave, b, Math.round(v * escala));
}
export const nuclearComp: BlockCustomComponent = {
  onTick({ block: b }) {
    TICK[b.typeId]?.(b);
  },
  onPlayerInteract({ block: b, player: j }) {
    if (!j) return;
    if (j.isSneaking && b.typeId === "cl:aquecedor_resistivo")
      return abrirUmMenu(j, () => menuNumero(j, b, "mkah", "cl.mkn.aquecedor.titulo", "cl.mkn.aquecedor.taxa", 1000, 1));
    if (j.isSneaking && RECEBEM.has(b.typeId))
      return abrirUmMenu(j, () => menuNumero(j, b, "mklt", `tile.${b.typeId}.name`, "cl.mkn.amplificador.limite", 400000000, 1000000));
    const t = texto(b);
    if (t) aviso(j, t, 6);
  },
};

const pendente = new Map<string, { cod?: string; tick: number }>();
export function registrarNuclear(): void {
  registrarDetalhe(Object.keys(TICK), (b) => texto(b));
  // Condutores Termodinâmicos ligam em condutores, aquecedores e nos multiblocos que recebem calor.
  registrarLigacao(Object.keys(COND), (_b, v) => ehCondutor(v.typeId) || AQUECEDORES.has(v.typeId) || recebeCalor(v));
  // Barril quebrado leva o conteúdo; posto, devolve. Máquinas químicas quebradas soltam o que tinham de radioativo.
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id === "cl:barril_residuos_radioativos") {
      const t = lerEm<Br>("mkbr", block.dimension, block.location, { mb: 0 });
      gravarEm("mkbr", block.dimension, block.location, undefined);
      if (player.getGameMode() === GameMode.Creative) return;
      const item = new ItemStack(id, 1);
      if (t.q && t.mb > 0) guardarNoItem(item, t, `§7${t.mb.toLocaleString("pt-BR")} mB`);
      block.dimension.spawnItem(item, block.center());
      return;
    }
    const q = lerEm<{ t?: Record<string, number> } | undefined>("mkq", block.dimension, block.location, undefined);
    if (q?.t) {
      soltarQuimicos(block.dimension, block.location, q.t);
      gravarEm("mkq", block.dimension, block.location, undefined);
    }
    if (id === "cl:estabilizador_dimensional") {
      try {
        block.dimension.runCommand(`tickingarea remove ${area(block.location)}`);
      } catch {
        // não existia
      }
    }
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId === "cl:barril_residuos_radioativos") pendente.set(ev.player.id, { cod: codigoDoItem(ev.itemStack), tick: system.currentTick });
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId !== "cl:barril_residuos_radioativos") return;
    const p = pendente.get(player.id);
    pendente.delete(player.id);
    const t = p && system.currentTick - p.tick <= 3 ? lerCodigo<Br>(p.cod) : undefined;
    if (t) gravar("mkbr", block, t);
  });
  // Teste: scriptevent cl:teste_nuc <ver|carregar <J>|limite <J>> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_nuc" || !(j instanceof Player)) return;
    const p = message.split(" ");
    const [x, y, z] = p.slice(-3).map(Number);
    const b = j.dimension.getBlock({ x, y, z });
    if (!b) return;
    if (p[0] === "carregar") gravar("mkla", b, Number(p[1]));
    if (p[0] === "limite") gravar("mklt", b, Number(p[1]));
    if (p[0] === "calor") gravar("mkah", b, Number(p[1]));
    if (p[0] === "aquecer") console.warn(`[teste_nuc] aquecer=${aquecer(b, 1000)} energia=${gastarCE(b, 1)}`);
    console.warn(`[teste_nuc] ${b.typeId} amp=${ler<number>("mkla", b, 0)} barril=${JSON.stringify(ler<Br>("mkbr", b, { mb: 0 }))}`);
  });
}

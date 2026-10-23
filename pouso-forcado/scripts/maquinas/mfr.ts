import { Block, BlockCustomComponent, BlockTypes, Container, Dimension, Entity, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { FOME, MFR, PLANTACAO } from "../config.js";
import { CULTURAS } from "../harvest/gerado.js";
import { creditar } from "../blocos/energia.js";
import { crescerPlantacao } from "../blocos/plantacao.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado, vizinhos } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";
import { toqueNovo } from "../util/toque.js";
import { cabe, contar, entrada, entregar, gastarCE, inv, primeiro, saida, tirar } from "../util/maquina.js";

/*
 * MineFactory Reloaded (Fase 19). Máquinas com tick de 5 s (a esteira, de 1 s), entrada no baú em cima,
 * saída no baú embaixo e energia da rede. A área de trabalho é um quadrado na FRENTE da máquina (o lado
 * com a tela), de lado 2 × alcance + 1; o Upgrade de Alcance (toque com ele) aumenta até MFR.alcanceMax.
 * Plantas e árvores são quebradas com "setblock ... destroy" e o que cai é recolhido para o baú embaixo.
 * Custo: no máximo MFR.colherPorCiclo blocos e uma busca de entidades por máquina a cada 5 s.
 */
type Dados = { alcance?: number; esgoto?: number; mortes?: number };
const T = "mfr";
const SEMENTES: Readonly<Record<string, string>> = { ...MFR.sementes, ...Object.fromEntries(CULTURAS.map((c) => [c.semente, c.planta])) };
const PLANTAS_HC = new Map(CULTURAS.map((c) => [c.planta, c.produto]));
const OPOSTO: Readonly<Record<string, [number, number]>> = { north: [0, 1], south: [0, -1], east: [-1, 0], west: [1, 0] };
const ultimo = new Map<string, string>();
const chave = (b: Block) => `${b.dimension.id}:${b.x},${b.y},${b.z}`;

const frente = (b: Block): [number, number] => OPOSTO[lerEstado<string>(b, "minecraft:cardinal_direction")] ?? [0, 1];
const alcance = (b: Block) => Math.min(MFR.alcanceMax, MFR.alcanceBase + (ler<Dados>(T, b, {}).alcance ?? 0));

/** Posições (no nível da máquina) da área na frente. */
function area(b: Block, centrada = false): { pos: Vector3[]; canto: Vector3; lado: number } {
  const r = alcance(b);
  const [dx, dz] = centrada ? [0, 0] : frente(b);
  const cx = b.x + dx * (r + 1), cz = b.z + dz * (r + 1);
  const pos: Vector3[] = [];
  for (let a = -r; a <= r; a++) for (let c = -r; c <= r; c++) pos.push({ x: cx + a, y: b.y, z: cz + c });
  return { pos, canto: { x: cx - r, y: b.y - 1, z: cz - r }, lado: 2 * r + 1 };
}

function bloco(dim: Dimension, p: Vector3): Block | undefined {
  try {
    return dim.getBlock(p);
  } catch {
    return undefined;
  }
}

/** Recolhe os itens soltos na área para o baú da máquina (um pouco depois, para dar tempo de cair). */
function recolher(b: Block, canto: Vector3, lado: number, altura = 4): void {
  system.runTimeout(() => {
    if (!b.isValid) return;
    const destino = saida(b);
    for (const e of b.dimension.getEntities({ type: "minecraft:item", location: canto, volume: { x: lado, y: altura, z: lado } })) {
      const p = e.getComponent("minecraft:item")?.itemStack;
      if (!p) continue;
      e.remove();
      entregar(b, [p], destino);
    }
  }, 4);
}

function quebrar(dim: Dimension, p: Vector3): void {
  dim.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
}

function maquina(id: string, processar: (b: Block) => "ok" | "parada" | "sem_energia"): BlockCustomComponent {
  return {
    onTick(e) {
      ultimo.set(chave(e.block), processar(e.block));
    },
    onPlayerInteract(e) {
      const j = e.player;
      if (!j) return;
      const mao = itemNaMao(j)?.typeId ?? "";
      const up = /^cl:upgrade_alcance_(\d)$/.exec(mao);
      if (up) return instalarUpgrade(j, e.block, Number(up[1]));
      const lado = String(2 * alcance(e.block) + 1);
      const s = ultimo.get(chave(e.block)) ?? "parada";
      const estado: RawMessage = { translate: `cl.mf.${s === "ok" ? "ok" : s === "sem_energia" ? "sem_energia" : "parada"}` };
      aviso(j, { rawtext: [{ translate: "cl.mf.estado", with: { rawtext: [{ translate: e.block.localizationKey }, { text: lado }, { text: lado }, estado] } }, { text: "\n" }, { translate: `cl.mf.dica.${id}` }] }, 6);
    },
  };
}

function instalarUpgrade(j: Player, b: Block, n: number): void {
  const d = ler<Dados>(T, b, {});
  if (d.alcance) b.dimension.spawnItem(new ItemStack(`cl:upgrade_alcance_${d.alcance}`, 1), b.center());
  d.alcance = n;
  gravar(T, b, d);
  gastarDaMao(j);
  const lado = String(2 * alcance(b) + 1);
  aviso(j, { translate: "cl.mf.upgrade", with: [String(n), lado, lado] });
  registrarAcao(j, "alcance");
}

function credito(b: Block, acao: "mf_plantar" | "mf_colher" | "mf_triturar" | "mf_fertilizante", n = 1): void {
  for (let i = 0; i < n; i++) creditar(b, acao);
}

// ---------- Plantadeira ----------
export const plantadeira = maquina("cl:plantadeira", (b) => {
  const ent = entrada(b);
  if (!ent) return "parada";
  let n = 0;
  for (const p of area(b).pos) {
    if (n >= MFR.plantarPorCiclo) break;
    const alvo = bloco(b.dimension, p), chao = bloco(b.dimension, { x: p.x, y: p.y - 1, z: p.z });
    if (!alvo?.isAir || !chao) continue;
    const terra = chao.typeId === "minecraft:farmland";
    const solo = chao.typeId === "minecraft:dirt" || chao.typeId === "minecraft:grass_block";
    const s = primeiro(ent, (id) => (terra && SEMENTES[id] !== undefined) || (solo && (MFR.mudas as readonly string[]).includes(id)));
    if (!s) continue;
    if (!gastarCE(b, MFR.plantarCE)) return n ? "ok" : "sem_energia";
    tirar(ent, s.typeId);
    alvo.setType(SEMENTES[s.typeId] ?? s.typeId);
    n++;
  }
  if (!n) return "parada";
  credito(b, "mf_plantar", n);
  return "ok";
});

// ---------- Colheitadeira ----------
function madura(a: Block): boolean {
  if ((MFR.maduras as readonly string[]).includes(a.typeId)) return lerEstado<number>(a, "growth") >= 7;
  if ((MFR.inteiras as readonly string[]).includes(a.typeId)) return true;
  if (PLANTAS_HC.has(a.typeId)) return lerEstado<number>(a, "cl:estagio") >= 2;
  return false;
}
const tora = (id: string) => id.endsWith("_log") || id.endsWith("_wood");

export const colheitadeira = maquina("cl:colheitadeira", (b) => {
  if (!cabe(b)) return "parada";
  const { pos, canto, lado } = area(b);
  let n = 0;
  const destino = saida(b);
  const extra: ItemStack[] = [];
  for (const p of pos) {
    if (n >= MFR.colherPorCiclo) break;
    const a = bloco(b.dimension, p);
    if (!a || a.isAir) continue;
    // Cana e cacto: colhe de cima para baixo, deixando a base.
    if (a.typeId === "minecraft:reeds" || a.typeId === "minecraft:cactus") {
      for (let y = p.y + 2; y >= p.y + 1; y--) {
        const c = bloco(b.dimension, { x: p.x, y, z: p.z });
        if (c?.typeId !== a.typeId || !gastarCE(b, MFR.colherCE)) continue;
        if (a.typeId === "minecraft:cactus" && Math.random() < MFR.resinaColheita) extra.push(new ItemStack("cl:resina", 1));
        quebrar(b.dimension, c.location);
        n++;
      }
      continue;
    }
    if (tora(a.typeId)) {
      // Árvore: as toras ligadas (até MFR.arvoreMax).
      const fila = [a.location], vistos = new Set<string>();
      while (fila.length && n < MFR.arvoreMax) {
        const q = fila.shift()!;
        const k = `${q.x},${q.y},${q.z}`;
        if (vistos.has(k)) continue;
        vistos.add(k);
        const t = bloco(b.dimension, q);
        if (!t || !tora(t.typeId)) continue;
        if (!gastarCE(b, MFR.colherCE)) break;
        quebrar(b.dimension, q);
        if (Math.random() < MFR.resinaColheita) extra.push(new ItemStack("cl:resina", 1));
        n++;
        for (const [dx, dy, dz] of [[0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1], [1, 1, 0], [-1, 1, 0], [0, 1, 1], [0, 1, -1]]) fila.push({ x: q.x + dx, y: q.y + dy, z: q.z + dz });
      }
      continue;
    }
    if (!madura(a)) continue;
    if (!gastarCE(b, MFR.colherCE)) return n ? "ok" : "sem_energia";
    const produto = PLANTAS_HC.get(a.typeId);
    if (produto) {
      // HarvestCraft: colhe como na mão e volta ao broto.
      const [min, max] = PLANTACAO.colheita;
      extra.push(new ItemStack(produto, min + Math.floor(Math.random() * (max - min + 1))));
      definirEstado(a, "cl:estagio", 0);
    } else quebrar(b.dimension, p);
    n++;
  }
  if (!n) return "parada";
  entregar(b, extra, destino);
  recolher(b, canto, lado, 12);
  credito(b, "mf_colher", n);
  return "ok";
});

// ---------- Fertilizadora (e o fertilizante na mão) ----------
function adubar(a: Block): boolean {
  if (crescerPlantacao(a, 1)) return true;
  const g = (() => {
    try {
      return lerEstado<number>(a, "growth") as number | undefined;
    } catch {
      return undefined;
    }
  })();
  if (g !== undefined && g < 7) {
    definirEstado(a, "growth", Math.min(7, g + 2 + Math.floor(Math.random() * 3)));
    return true;
  }
  if (a.typeId.endsWith("_sapling") && lerEstado<boolean>(a, "age_bit") === false) {
    definirEstado(a, "age_bit", true);
    return true;
  }
  return false;
}

export const fertilizadora = maquina("cl:fertilizadora", (b) => {
  const ent = entrada(b);
  if (!ent || (contar(ent, "cl:fertilizante") === 0 && contar(ent, "minecraft:bone_meal") === 0)) return "parada";
  const candidatas = area(b).pos.map((p) => bloco(b.dimension, p)).filter((a): a is Block => !!a && !a.isAir);
  for (const a of candidatas.sort(() => Math.random() - 0.5)) {
    if (!gastarCE(b, MFR.adubarCE)) return "sem_energia";
    if (!adubar(a)) continue;
    if (!tirar(ent, "cl:fertilizante")) tirar(ent, "minecraft:bone_meal");
    b.dimension.spawnParticle("minecraft:crop_growth_emitter", a.center());
    return "ok";
  }
  return "parada";
});

// ---------- Rancheiro ----------
export const rancheiro = maquina("cl:rancheiro", (b) => {
  const ent = entrada(b);
  if (!ent || contar(ent, "minecraft:bucket") === 0 || !cabe(b)) return "parada";
  const { canto, lado } = area(b);
  for (const vaca of b.dimension.getEntities({ type: "minecraft:cow", location: canto, volume: { x: lado, y: 3, z: lado } })) {
    if (vaca.getComponent("minecraft:is_baby")) continue;
    const ultimaVez = vaca.getDynamicProperty("cl:ordenha");
    if (typeof ultimaVez === "number" && system.currentTick - ultimaVez < FOME.leiteTicks) continue;
    if (!gastarCE(b, MFR.ordenharCE)) return "sem_energia";
    tirar(ent, "minecraft:bucket");
    vaca.setDynamicProperty("cl:ordenha", system.currentTick);
    entregar(b, [new ItemStack("minecraft:milk_bucket", 1)]);
    return "ok";
  }
  return "parada";
});

// ---------- Triturador de Monstros ----------
export const triturador = maquina("cl:triturador_monstros", (b) => {
  const { canto, lado } = area(b);
  const alvos = b.dimension.getEntities({ families: ["monster"], location: canto, volume: { x: lado, y: 4, z: lado } }).filter((e) => !e.nameTag && !e.getComponent("minecraft:is_baby"));
  if (alvos.length === 0) return "parada";
  const d = ler<Dados>(T, b, {});
  let mortes = 0, bateu = 0;
  for (const e of alvos.slice(0, MFR.triturarMax)) {
    if (!gastarCE(b, MFR.triturarCE)) break;
    const vida = e.getComponent("minecraft:health")?.currentValue ?? 0;
    e.applyDamage(MFR.triturarDano);
    bateu++;
    if (vida <= MFR.triturarDano) mortes++;
  }
  if (!bateu) return "sem_energia";
  if (mortes) {
    d.mortes = (d.mortes ?? 0) + mortes;
    const garrafas = Math.floor(d.mortes / MFR.xpACada);
    d.mortes %= MFR.xpACada;
    gravar(T, b, d);
    if (garrafas) entregar(b, [new ItemStack("minecraft:experience_bottle", garrafas)]);
    credito(b, "mf_triturar", mortes);
    recolher(b, canto, lado);
  }
  return "ok";
});

// ---------- Esgoto e Compostadora ----------
export const esgoto = maquina("cl:esgoto", (b) => {
  const { canto, lado } = area(b, true);
  const animais = b.dimension.getEntities({ families: ["mob"], excludeFamilies: ["monster"], location: { x: canto.x, y: b.y, z: canto.z }, volume: { x: lado, y: 3, z: lado } }).filter((e: Entity) => e.typeId !== "minecraft:player");
  if (animais.length === 0) return "parada";
  const d = ler<Dados>(T, b, {});
  d.esgoto = Math.min(MFR.esgotoMax, (d.esgoto ?? 0) + animais.length * MFR.esgotoPorAnimal);
  gravar(T, b, d);
  return "ok";
});

export const compostadora = maquina("cl:compostadora", (b) => {
  const fonte = vizinhos(b).find((v) => v.typeId === "cl:esgoto");
  if (!fonte || !cabe(b)) return "parada";
  const d = ler<Dados>(T, fonte, {});
  if ((d.esgoto ?? 0) < MFR.esgotoPorFertilizante) return "parada";
  if (!gastarCE(b, MFR.compostarCE)) return "sem_energia";
  d.esgoto! -= MFR.esgotoPorFertilizante;
  gravar(T, fonte, d);
  entregar(b, [new ItemStack("cl:fertilizante", 1)]);
  creditar(b, "mf_fertilizante");
  return "ok";
});

// ---------- Quebrador, Colocador e Esteira ----------
const naFrente = (b: Block): Vector3 => {
  const [dx, dz] = frente(b);
  return { x: b.x + dx, y: b.y, z: b.z + dz };
};
const INQUEBRAVEIS = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:structure_block"]);

export const quebrador = maquina("cl:quebrador_blocos", (b) => {
  const p = naFrente(b);
  const a = bloco(b.dimension, p);
  if (!a || a.isAir || a.isLiquid || INQUEBRAVEIS.has(a.typeId) || !cabe(b)) return "parada";
  if (!gastarCE(b, MFR.quebrarCE)) return "sem_energia";
  quebrar(b.dimension, p);
  recolher(b, { x: p.x - 1, y: p.y - 1, z: p.z - 1 }, 3);
  return "ok";
});

export const colocador = maquina("cl:colocador_blocos", (b) => {
  const ent = entrada(b);
  const a = bloco(b.dimension, naFrente(b));
  if (!ent || !a?.isAir) return "parada";
  const p = primeiro(ent, (id) => BlockTypes.get(id) !== undefined);
  if (!p) return "parada";
  if (!gastarCE(b, MFR.colocarCE)) return "sem_energia";
  tirar(ent, p.typeId);
  a.setType(p.typeId);
  return "ok";
});

export const esteira = maquina("cl:esteira", (b) => {
  const [dx, dz] = frente(b);
  const de = inv(bloco(b.dimension, { x: b.x - dx, y: b.y, z: b.z - dz }));
  const para = inv(bloco(b.dimension, { x: b.x + dx, y: b.y, z: b.z + dz }));
  if (!de || !para) return "parada";
  return mover(de, para) ? "ok" : "parada";
});

function mover(de: Container, para: Container): boolean {
  for (let s = 0; s < de.size; s++) {
    const p = de.getItem(s);
    if (!p) continue;
    const sobra = para.addItem(p);
    if (sobra && sobra.amount === p.amount) continue;
    de.setItem(s, sobra);
    return true;
  }
  return false;
}

export function registrarMFR(): void {
  // Fertilizante na mão funciona como farinha de osso (também nas plantações do HarvestCraft).
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "cl:fertilizante" || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player, block } = ev;
    system.run(() => {
      if (adubar(block)) {
        gastarDaMao(player);
        block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
      }
    });
  });
  // Resina: quebrando tora ou cacto à mão, às vezes.
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if ((tora(id) || id === "minecraft:cactus") && Math.random() < MFR.resinaMao) block.dimension.spawnItem(new ItemStack("cl:resina", 1), block.center());
    if (!id.startsWith("cl:")) return;
    const d = lerEm<Dados>(T, block.dimension, block.location, {});
    if (d.alcance) block.dimension.spawnItem(new ItemStack(`cl:upgrade_alcance_${d.alcance}`, 1), block.center());
    if (Object.keys(d).length) gravarEm(T, block.dimension, block.location, undefined);
  });
  registrarDetalhe("cl:esgoto", (b) => ({ translate: "cl.mf.esgoto", with: [String(ler<Dados>(T, b, {}).esgoto ?? 0), String(MFR.esgotoMax)] }));
  registrarNoCatalogo(() => [
    {
      maquina: { translate: "tile.cl:compostadora.name" }, maquinaId: "cl:compostadora", entradas: [], saidas: [{ item: "cl:fertilizante", qtd: 1 }],
      nota: { translate: "cl.mf.dica.cl:compostadora" },
    },
    {
      maquina: { translate: "tile.cl:colheitadeira.name" }, maquinaId: "cl:colheitadeira", entradas: [{ item: "minecraft:oak_log", qtd: 1 }], saidas: [{ item: "cl:resina", qtd: 1, chance: MFR.resinaColheita }],
      nota: { translate: "cl.mf.dica.cl:colheitadeira" },
    },
  ]);
}

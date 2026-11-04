import {
  Block, BlockCustomComponent, BlockPermutation, Difficulty, Direction, Entity, EntityInitializationCause, GameMode, ItemStack, Player, system, Vector3, world,
} from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";

/*
 * 1.37.0: Quark 4.1 (o mais novo). Os números são os dos módulos do mod:
 * - Corindo: cresce aglomerados (1 em 5 dos ticks aleatórios, e 1 em 3 de pegar) em cima ou embaixo, nas cavernas.
 * - Lâmpada de Cristal: acende (luz 15) com redstone.
 * - Banquinho: tocar senta (um assento invisível que some quando você levanta).
 * - Caixa de Monstros (MonsterBoxModule): um jogador a 2,5 blocos faz ela rosnar e, 40 ticks depois, soltar 5 a 8
 *   monstros (zumbi 7, aranha das cavernas 2, bruxa 1); quem morre para um jogador solta 1 sorteio do saque extra.
 * - Calha: tira 1 item a cada 8 ticks do baú/funil de cima e deixa cair embaixo (se embaixo estiver livre).
 * - Cocho (FeedingTroughModule): guarda comida; a cada 30 ticks, 1 em 3 de dois bichos que comem aquilo (a até 10
 *   blocos, no máximo 32 em volta) procriarem; cada bicho espera 5 minutos para procriar de novo.
 * - Barra de Ferro: o pistão que empurra a barra quebra o bloco da frente dela.
 * - Colher de Pedreiro: põe um bloco ao acaso da barra de itens. Bolsa de Sementes: guarda 640 sementes de um tipo; no
 *   ar guarda as do inventário; na terra arada planta (agachado, 3×3). Ábaco: marca um bloco e mede a distância
 *   (Manhattan, até 48) até o bloco que você olha. Nuvem Engarrafada: garrafa vazia entre y 191 e 196; usar põe uma
 *   nuvem por 10 s. Slime no Balde: balde num slime pequeno.
 * - Ajustes: enxada colhe capim e flores em 3×3 (5×5 de diamante e netherita); vidro quebrado sem toque de seda dá 2 a 4
 *   cacos; ferramenta que quebra é trocada por outra igual do inventário; porcos têm 2 a 3 filhotes; voar de élitro
 *   sobre uma fogueira acesa com feno embaixo dá impulso para cima (0,5, até 1); vexes somem com o evocador; escada na
 *   escada estende para baixo; agachado e de mão vazia, carinho no cachorro.
 */

const FACE: Record<string, Vector3> = {
  [Direction.Up]: { x: 0, y: 1, z: 0 }, [Direction.Down]: { x: 0, y: -1, z: 0 }, [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 }, [Direction.East]: { x: 1, y: 0, z: 0 }, [Direction.West]: { x: -1, y: 0, z: 0 },
};
const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;
const centro = (b: Block) => ({ x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 });
const livre = (b: Block | undefined) => !!b && (b.isAir || b.typeId === "minecraft:short_grass" || b.typeId === "minecraft:snow_layer");
function maoDe(j: Player): ItemStack | undefined {
  return j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
}
function porNaMao(j: Player, item: ItemStack | undefined): void {
  j.getComponent("minecraft:inventory")?.container?.setItem(j.selectedSlotIndex, item);
}
/** Gasta 1 da mão e devolve (ou dá) outro item no lugar. */
function trocarUm(j: Player, novo?: ItemStack): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !i) return;
  if (!criativo(j)) {
    if (i.amount > 1) {
      i.amount--;
      inv.setItem(j.selectedSlotIndex, i);
    } else inv.setItem(j.selectedSlotIndex, undefined);
  }
  if (novo) {
    const sobra = inv.addItem(novo);
    if (sobra) j.dimension.spawnItem(sobra, j.location);
  }
}
function perto(b: Block, raio: number): Player[] {
  try {
    return b.dimension.getPlayers({ location: centro(b), maxDistance: raio });
  } catch {
    return [];
  }
}

// ---------- Corindo e Lâmpada de Cristal ----------
export const corindoComp: BlockCustomComponent = {
  onRandomTick({ block }) {
    if (block.y > 60 || Math.random() >= 1 / 5 || Math.random() >= 1 / 3) return;
    const alvo = Math.random() < 0.5 ? block.above() : block.below();
    if (alvo?.isAir) alvo.setType(block.typeId.replace("cl:corindo_", "cl:aglomerado_corindo_"));
  },
};
export const lampadaCristalComp: BlockCustomComponent = {
  onTick({ block }) {
    let acesa = (block.getRedstonePower() ?? 0) > 0;
    for (const v of acesa ? [] : [block.above(), block.below(), block.north(), block.south(), block.east(), block.west()])
      if ((v?.getRedstonePower() ?? 0) > 0) {
        acesa = true;
        break;
      }
    if (block.permutation.getState("cl:acesa" as never) === acesa) return;
    block.setPermutation(block.permutation.withState("cl:acesa" as never, acesa as never));
    if (acesa) for (const j of perto(block, 8)) registrarAcao(j, "qk4_lampada");
  },
};

// ---------- Banquinho ----------
const assentos = new Set<string>();
function sentar(j: Player, b: Block): boolean {
  if (j.getComponent("minecraft:riding")) return false;
  const e = b.dimension.spawnEntity("cl:assento", { x: b.x + 0.5, y: b.y + 0.35, z: b.z + 0.5 });
  assentos.add(e.id);
  const ok = e.getComponent("minecraft:rideable")?.addRider(j) ?? false;
  if (!ok) {
    assentos.delete(e.id);
    e.remove();
    return false;
  }
  registrarAcao(j, "qk4_banquinho");
  return true;
}
function limparAssentos(): void {
  for (const id of assentos) {
    const e = world.getEntity(id);
    if (!e) {
      assentos.delete(id);
      continue;
    }
    const embaixo = e.dimension.getBlock({ x: e.location.x, y: e.location.y - 0.1, z: e.location.z });
    if (!e.getComponent("minecraft:rideable")?.getRiders().length || !embaixo?.typeId.startsWith("cl:banquinho_")) {
      assentos.delete(id);
      e.remove();
    }
  }
}
export const banquinhoComp: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    if (player && !player.isSneaking) sentar(player, block);
  },
};

// ---------- Batatinha ----------
export const batatinhaComp: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    block.dimension.spawnParticle("minecraft:heart_particle", { x: block.x + 0.5, y: block.y + 0.6, z: block.z + 0.5 });
    block.dimension.playSound("random.pop", centro(block), { pitch: 1.6 });
    if (player) {
      aviso(player, "cl.qk4.batatinha", 2);
      registrarAcao(player, "qk4_batatinha");
    }
  },
};

// ---------- Caixa de Monstros ----------
const MONSTROS: [string, number][] = [["minecraft:zombie", 7], ["minecraft:cave_spider", 2], ["minecraft:witch", 1]];
const acordadas = new Set<string>();
function sortear(): string {
  let r = Math.random() * 10;
  for (const [id, p] of MONSTROS) if ((r -= p) < 0) return id;
  return MONSTROS[0][0];
}
function abrirCaixa(b: Block): void {
  const k = `${b.dimension.id}|${b.x},${b.y},${b.z}`;
  if (acordadas.has(k)) return;
  acordadas.add(k);
  b.dimension.playSound("mob.zombie.say", centro(b), { pitch: 0.5, volume: 0.5 });
  for (const j of perto(b, 6)) {
    aviso(j, "cl.qk4.caixa", 2);
    registrarAcao(j, "qk4_caixa");
  }
  const { dimension, x, y, z } = b;
  system.runTimeout(() => {
    acordadas.delete(k);
    const caixa = dimension.getBlock({ x, y, z });
    if (caixa?.typeId !== "cl:caixa_monstros") return;
    const n = 5 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++)
      try {
        const m = dimension.spawnEntity(sortear(), { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
        m.addTag("cl:caixa_monstros");
        m.addTag("cl:do_addon");
        m.applyImpulse({ x: (Math.random() - 0.5) * 0.4, y: (Math.random() - 0.5) * 0.4, z: (Math.random() - 0.5) * 0.4 });
      } catch {
        // sem espaço
      }
    dimension.spawnParticle("minecraft:large_explosion", { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
    caixa.setType("minecraft:air");
  }, 40);
}
export const caixaMonstrosComp: BlockCustomComponent = {
  onTick({ block }) {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    if (perto(block, 2.5).some((j) => j.getGameMode() !== GameMode.Spectator)) abrirCaixa(block);
  },
};

// ---------- Calha e Nuvem ----------
export const calhaComp: BlockCustomComponent = {
  onTick({ block }) {
    const baixo = block.below();
    if (!baixo || !(baixo.isAir || baixo.typeId === "cl:grade")) return;
    const c = block.above()?.getComponent("minecraft:inventory")?.container;
    if (!c || c.emptySlotsCount === c.size) return;
    for (let i = 0; i < c.size; i++) {
      const it = c.getItem(i);
      if (!it) continue;
      const um = it.clone();
      um.amount = 1;
      if (it.amount > 1) {
        it.amount--;
        c.setItem(i, it);
      } else c.setItem(i, undefined);
      const e = block.dimension.spawnItem(um, { x: block.x + 0.5, y: block.y - 0.4, z: block.z + 0.5 });
      e.clearVelocity();
      return;
    }
  },
};
export const nuvemComp: BlockCustomComponent = {
  onTick({ block }) {
    block.setType("minecraft:air");
  },
};

// ---------- Cocho ----------
const COMIDA: Readonly<Record<string, string[]>> = {
  "minecraft:wheat": ["minecraft:cow", "minecraft:sheep", "minecraft:goat", "minecraft:mooshroom"],
  "minecraft:carrot": ["minecraft:pig", "minecraft:rabbit"], "minecraft:potato": ["minecraft:pig"], "minecraft:beetroot": ["minecraft:pig"],
  "minecraft:wheat_seeds": ["minecraft:chicken"], "minecraft:beetroot_seeds": ["minecraft:chicken"], "minecraft:melon_seeds": ["minecraft:chicken"],
  "minecraft:pumpkin_seeds": ["minecraft:chicken"], "minecraft:golden_carrot": ["minecraft:horse", "minecraft:donkey", "minecraft:rabbit"],
  "minecraft:hay_block": ["minecraft:llama"], "minecraft:cactus": ["minecraft:camel"], "minecraft:sweet_berries": ["minecraft:fox"],
  "minecraft:seagrass": ["minecraft:turtle"], "minecraft:dandelion": ["minecraft:rabbit"],
};
const CAPACIDADE = 9 * 64;
const ESPERA = 6000; // 5 minutos, como procriar à mão
const esperando = new Map<string, number>();
type Cocho = { id: string; n: number };
function encherCocho(j: Player, b: Block): void {
  const d = ler<Cocho | undefined>("cocho", b, undefined);
  const mao = maoDe(j);
  if (!mao) {
    if (!d?.n) return;
    const n = Math.min(64, d.n);
    j.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack(d.id, n));
    gravar("cocho", b, d.n - n > 0 ? { id: d.id, n: d.n - n } : undefined);
    return;
  }
  if (!COMIDA[mao.typeId] || (d && d.n > 0 && d.id !== mao.typeId)) return;
  const tem = d?.n ?? 0;
  const poe = Math.min(mao.amount, CAPACIDADE - tem);
  if (poe <= 0) return;
  gravar("cocho", b, { id: mao.typeId, n: tem + poe });
  if (!criativo(j)) {
    if (mao.amount > poe) {
      mao.amount -= poe;
      porNaMao(j, mao);
    } else porNaMao(j, undefined);
  }
  b.dimension.playSound("dig.grass", centro(b));
}
function cicloCocho(b: Block): boolean {
  const d = ler<Cocho | undefined>("cocho", b, undefined);
  if (!d || d.n < 2 || Math.random() >= 1 / 3) return false;
  const tipos = COMIDA[d.id] ?? [];
  const agora = system.currentTick;
  let bichos: Entity[];
  try {
    bichos = b.dimension.getEntities({ location: centro(b), maxDistance: 10, excludeTypes: ["minecraft:item", "minecraft:player"] });
  } catch {
    return false;
  }
  if (bichos.length > 32) return false;
  for (const tipo of tipos) {
    const prontos = bichos.filter((e) => e.typeId === tipo && !e.getComponent("minecraft:is_baby") && (esperando.get(e.id) ?? -ESPERA) + ESPERA <= agora);
    if (prontos.length < 2) continue;
    const [a, c] = prontos;
    esperando.set(a.id, agora);
    esperando.set(c.id, agora);
    gravar("cocho", b, d.n - 2 > 0 ? { id: d.id, n: d.n - 2 } : undefined);
    const meio = { x: (a.location.x + c.location.x) / 2, y: Math.max(a.location.y, c.location.y), z: (a.location.z + c.location.z) / 2 };
    b.dimension.spawnEntity(tipo, meio, { spawnEvent: "minecraft:entity_born" });
    b.dimension.spawnParticle("minecraft:heart_particle", { x: meio.x, y: meio.y + 1, z: meio.z });
    for (const j of perto(b, 16)) registrarAcao(j, "qk4_cocho");
    return true;
  }
  return false;
}
export const cochoComp: BlockCustomComponent = {
  onTick({ block }) {
    cicloCocho(block);
  },
  onPlayerInteract({ block, player }) {
    if (player) encherCocho(player, block);
  },
  onPlayerBreak({ block, dimension }) {
    const d = ler<Cocho | undefined>("cocho", block, undefined);
    gravar("cocho", block, undefined);
    for (let n = d?.n ?? 0; n > 0; n -= 64) dimension.spawnItem(new ItemStack(d!.id, Math.min(64, n)), centro(block));
  },
};

// ---------- Barra de Ferro ----------
const IMUNES = new Set(["minecraft:bedrock", "minecraft:obsidian", "minecraft:crying_obsidian", "minecraft:barrier", "minecraft:end_portal_frame",
  "minecraft:reinforced_deepslate", "minecraft:command_block", "minecraft:structure_block", "minecraft:respawn_anchor", "cl:painel_nave", "cl:bau_tesouro"]);
// No evento os blocos já estão "em movimento": 3 ticks depois, com a barra uma casa à frente, quebra o que ela empurrou.
function barraEmpurrada(piston: Block, empurrados: Vector3[], esperar = 3): void {
  const { dimension } = piston;
  for (const p of empurrados) {
    const d = { x: p.x - piston.x, y: p.y - piston.y, z: p.z - piston.z };
    if (Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z) !== 1) continue;
    system.runTimeout(() => {
      try {
        const barra = dimension.getBlock({ x: p.x + d.x, y: p.y + d.y, z: p.z + d.z });
        if (barra?.typeId !== "cl:barra_ferro") return;
        const alvo = dimension.getBlock({ x: barra.x + d.x, y: barra.y + d.y, z: barra.z + d.z });
        if (!alvo || alvo.isAir || alvo.isLiquid || IMUNES.has(alvo.typeId)) return;
        dimension.runCommand(`setblock ${alvo.x} ${alvo.y} ${alvo.z} air destroy`);
        for (const j of perto(barra, 16)) registrarAcao(j, "qk4_barra");
      } catch {
        // descarregou
      }
    }, esperar);
    return;
  }
}

// ---------- Colher de Pedreiro ----------
const ehBloco = new Map<string, BlockPermutation | null>();
function permDe(id: string): BlockPermutation | undefined {
  if (!ehBloco.has(id))
    try {
      ehBloco.set(id, BlockPermutation.resolve(id));
    } catch {
      ehBloco.set(id, null);
    }
  return ehBloco.get(id) ?? undefined;
}
function colher(j: Player, b: Block, face: Direction): boolean {
  const off = FACE[face];
  const alvo = b.dimension.getBlock({ x: b.x + off.x, y: b.y + off.y, z: b.z + off.z });
  if (!livre(alvo) || !alvo) return false;
  const pe = { x: Math.floor(j.location.x), y: Math.floor(j.location.y), z: Math.floor(j.location.z) };
  if (alvo.x === pe.x && alvo.z === pe.z && (alvo.y === pe.y || alvo.y === pe.y + 1)) return false;
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return false;
  const opcoes: number[] = [];
  for (let s = 0; s < 9; s++) {
    const it = inv.getItem(s);
    if (it && it.typeId !== "cl:colher_pedreiro" && permDe(it.typeId)) opcoes.push(s);
  }
  if (!opcoes.length) return false;
  const s = opcoes[Math.floor(Math.random() * opcoes.length)];
  const it = inv.getItem(s)!;
  alvo.setPermutation(permDe(it.typeId)!);
  if (!criativo(j)) {
    if (it.amount > 1) {
      it.amount--;
      inv.setItem(s, it);
    } else inv.setItem(s, undefined);
  }
  b.dimension.playSound("use.stone", centro(alvo));
  registrarAcao(j, "qk4_colher");
  return true;
}

// ---------- Bolsa de Sementes ----------
const SEMENTES: Readonly<Record<string, string>> = {
  "minecraft:wheat_seeds": "minecraft:wheat", "minecraft:carrot": "minecraft:carrots", "minecraft:potato": "minecraft:potatoes",
  "minecraft:beetroot_seeds": "minecraft:beetroot", "minecraft:melon_seeds": "minecraft:melon_stem", "minecraft:pumpkin_seeds": "minecraft:pumpkin_stem",
  "minecraft:torchflower_seeds": "minecraft:torchflower_crop", "minecraft:pitcher_pod": "minecraft:pitcher_crop", "minecraft:nether_wart": "minecraft:nether_wart",
};
const MAX_BOLSA = 640;
type Bolsa = { id: string; n: number };
function lerBolsa(i: ItemStack): Bolsa | undefined {
  try {
    return JSON.parse((i.getDynamicProperty("cl:bolsa") as string | undefined) ?? "null") ?? undefined;
  } catch {
    return undefined;
  }
}
function gravarBolsa(i: ItemStack, d: Bolsa | undefined): void {
  i.setDynamicProperty("cl:bolsa", d && d.n > 0 ? JSON.stringify(d) : undefined);
  i.setLore(d && d.n > 0 ? [`§7${d.n} × ${d.id.replace("minecraft:", "")} (/${MAX_BOLSA})`] : []);
}
function encherBolsa(j: Player): number {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const bolsa = inv?.getItem(j.selectedSlotIndex);
  if (!inv || bolsa?.typeId !== "cl:bolsa_sementes") return 0;
  const d = lerBolsa(bolsa) ?? { id: "", n: 0 };
  let guardou = 0;
  for (let s = 0; s < inv.size && d.n < MAX_BOLSA; s++) {
    const it = inv.getItem(s);
    if (!it || !SEMENTES[it.typeId] || (d.id && d.id !== it.typeId)) continue;
    d.id = it.typeId;
    const n = Math.min(it.amount, MAX_BOLSA - d.n);
    d.n += n;
    guardou += n;
    if (it.amount > n) {
      it.amount -= n;
      inv.setItem(s, it);
    } else inv.setItem(s, undefined);
  }
  gravarBolsa(bolsa, d);
  inv.setItem(j.selectedSlotIndex, bolsa);
  aviso(j, guardou ? { translate: "cl.qk4.bolsa_cheia", with: [String(guardou)] } : "cl.qk4.bolsa_vazia", 2);
  return guardou;
}
function plantarBolsa(j: Player, b: Block): number {
  const bolsa = maoDe(j);
  if (bolsa?.typeId !== "cl:bolsa_sementes") return 0;
  const d = lerBolsa(bolsa);
  if (!d?.n) return 0;
  const base = b.typeId === "minecraft:farmland" || b.typeId === "minecraft:soul_sand" ? b : b.below();
  if (!base) return 0;
  const chao = d.id === "minecraft:nether_wart" ? "minecraft:soul_sand" : "minecraft:farmland";
  const raio = j.isSneaking ? 1 : 0; // shiftRange 3: 3×3
  let plantou = 0;
  for (let dx = -raio; dx <= raio && d.n > 0; dx++)
    for (let dz = -raio; dz <= raio && d.n > 0; dz++) {
      const c = b.dimension.getBlock({ x: base.x + dx, y: base.y, z: base.z + dz });
      const cima = c?.above();
      if (c?.typeId !== chao || !cima?.isAir) continue;
      cima.setType(SEMENTES[d.id]);
      d.n--;
      plantou++;
    }
  if (!plantou) return 0;
  if (!criativo(j)) gravarBolsa(bolsa, d);
  porNaMao(j, bolsa);
  b.dimension.playSound("dig.grass", centro(base));
  for (let i = 0; i < plantou; i++) registrarAcao(j, "qk4_bolsa");
  return plantou;
}

// ---------- Ábaco ----------
function marcarAbaco(j: Player, b: Block): void {
  const i = maoDe(j);
  if (i?.typeId !== "cl:abaco") return;
  i.setDynamicProperty("cl:abaco", j.isSneaking ? undefined : `${b.dimension.id}|${b.x}|${b.y}|${b.z}`);
  porNaMao(j, i);
  if (!j.isSneaking) aviso(j, "cl.qk4.abaco_marcou", 2);
}
function mostrarAbacos(): void {
  for (const j of world.getPlayers()) {
    const i = maoDe(j);
    if (i?.typeId !== "cl:abaco") continue;
    const m = i.getDynamicProperty("cl:abaco") as string | undefined;
    if (!m) continue;
    const [dim, x, y, z] = m.split("|");
    if (dim !== j.dimension.id) continue;
    const b = j.getBlockFromViewDirection({ maxDistance: 32 })?.block;
    if (!b) continue;
    const dist = Math.abs(b.x - Number(x)) + Math.abs(b.y - Number(y)) + Math.abs(b.z - Number(z));
    j.onScreenDisplay.setActionBar(dist > 48 ? { translate: "cl.qk4.abaco_longe" } : { translate: "cl.qk4.abaco", with: [String(dist + 1)] });
  }
}

// ---------- Nuvem Engarrafada e Slime no Balde ----------
function usarNuvem(j: Player): boolean {
  const vista = j.getBlockFromViewDirection({ maxDistance: 5 });
  let alvo: Block | undefined;
  if (vista) {
    const o = FACE[vista.face];
    alvo = j.dimension.getBlock({ x: vista.block.x + o.x, y: vista.block.y + o.y, z: vista.block.z + o.z });
  } else {
    const c = j.getHeadLocation();
    const v = j.getViewDirection();
    alvo = j.dimension.getBlock({ x: c.x + v.x * 2.5, y: c.y + v.y * 2.5, z: c.z + v.z * 2.5 });
  }
  if (!alvo?.isAir) return false;
  alvo.setType("cl:nuvem");
  trocarUm(j, new ItemStack("minecraft:glass_bottle", 1));
  return true;
}
function pegarNuvem(j: Player): boolean {
  const y = j.location.y;
  if (y < 191 || y > 196) {
    if (y > 150) aviso(j, "cl.qk4.nuvem_alto", 2);
    return false;
  }
  trocarUm(j, new ItemStack("cl:nuvem_engarrafada", 1));
  j.playSound("bottle.fill");
  registrarAcao(j, "qk4_nuvem");
  return true;
}
function pegarSlime(j: Player, e: Entity): boolean {
  if (e.typeId !== "minecraft:slime" || (e.getComponent("minecraft:variant")?.value ?? 1) !== 1) return false;
  e.remove();
  trocarUm(j, new ItemStack("cl:slime_balde", 1));
  j.playSound("bucket.fill_fish");
  return true;
}
function soltarSlime(j: Player, b: Block, face: Direction): void {
  const o = FACE[face];
  b.dimension.spawnEntity("minecraft:slime", { x: b.x + o.x + 0.5, y: b.y + o.y, z: b.z + o.z + 0.5 }, { spawnEvent: "spawn_small" });
  if (!criativo(j)) porNaMao(j, new ItemStack("minecraft:bucket", 1));
}

// ---------- Ajustes ----------
const CAPIM = new Set(["minecraft:short_grass", "minecraft:tall_grass", "minecraft:fern", "minecraft:large_fern", "minecraft:deadbush", "minecraft:dead_bush",
  "minecraft:dandelion", "minecraft:poppy", "minecraft:blue_orchid", "minecraft:allium", "minecraft:azure_bluet", "minecraft:red_tulip", "minecraft:orange_tulip",
  "minecraft:white_tulip", "minecraft:pink_tulip", "minecraft:oxeye_daisy", "minecraft:cornflower", "minecraft:lily_of_the_valley", "minecraft:short_dry_grass",
  "minecraft:tall_dry_grass", "minecraft:bush", "minecraft:seagrass"]);
function enxada(b: Block, ferramenta: string): void {
  const r = ferramenta.includes("diamond") || ferramenta.includes("netherite") ? 3 : 2;
  for (let i = 1 - r; i < r; i++)
    for (let k = 1 - r; k < r; k++) {
      if (!i && !k) continue;
      const v = b.dimension.getBlock({ x: b.x + i, y: b.y, z: b.z + k });
      if (v && CAPIM.has(v.typeId)) b.dimension.runCommand(`setblock ${v.x} ${v.y} ${v.z} air destroy`);
    }
}
const TIPO_FERRAMENTA = ["_pickaxe", "_axe", "_shovel", "_hoe", "_sword", "shears", "_picareta", "_machado", "_pa", "_espada", "_paxel"];
function repor(j: Player, antes: ItemStack): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv || inv.getItem(j.selectedSlotIndex)) return;
  const fim = TIPO_FERRAMENTA.find((t) => antes.typeId.endsWith(t));
  let achou = -1;
  for (let s = 0; s < inv.size; s++) {
    if (s === j.selectedSlotIndex) continue;
    const it = inv.getItem(s);
    if (!it?.getComponent("minecraft:durability")) continue;
    if (it.typeId === antes.typeId) {
      achou = s;
      break;
    }
    if (achou < 0 && fim && it.typeId.endsWith(fim)) achou = s;
  }
  if (achou < 0) return;
  inv.setItem(j.selectedSlotIndex, inv.getItem(achou));
  inv.setItem(achou, undefined);
}
function cacos(b: Block, ferramenta: ItemStack | undefined): void {
  if (ferramenta?.getComponent("minecraft:enchantable")?.hasEnchantment("silk_touch")) return;
  const fortuna = ferramenta?.getComponent("minecraft:enchantable")?.getEnchantment("fortune")?.level ?? 0;
  const n = Math.min(4, 2 + Math.floor(Math.random() * 3) + Math.floor(Math.random() * (fortuna + 1)));
  b.dimension.spawnItem(new ItemStack("cl:caco_vidro", n), centro(b));
}
function escada(j: Player, b: Block): boolean {
  let fim: Block | undefined = b;
  while (fim?.typeId === "minecraft:ladder") fim = fim.below();
  if (!fim?.isAir) return false;
  const perm = b.permutation;
  // A escada precisa de parede atrás (facing_direction 2 norte, 3 sul, 4 oeste, 5 leste).
  const atras: Record<number, Vector3> = { 2: { x: 0, y: 0, z: 1 }, 3: { x: 0, y: 0, z: -1 }, 4: { x: 1, y: 0, z: 0 }, 5: { x: -1, y: 0, z: 0 } };
  const o = atras[perm.getState("facing_direction") as number];
  const parede = o && fim.dimension.getBlock({ x: fim.x + o.x, y: fim.y, z: fim.z + o.z });
  if (!parede || parede.isAir || parede.isLiquid) return false;
  fim.setPermutation(perm);
  if (!criativo(j)) trocarUm(j);
  return true;
}
function fogueiras(): void {
  for (const j of world.getPlayers()) {
    if (!j.isGliding) continue;
    const v = j.getVelocity();
    if (v.y >= 1) continue;
    let b = j.dimension.getBlock(j.location);
    let passos = 0;
    while (b && (b.isAir || b.typeId === "cl:grade") && passos < 20) {
      b = b.below();
      passos++;
    }
    if (!b || (b.typeId !== "minecraft:campfire" && b.typeId !== "minecraft:soul_campfire") || b.permutation.getState("extinguished")) continue;
    if (b.below()?.typeId !== "minecraft:hay_block") continue; // fogueira de sinal (fumaça alta)
    const forca = passos > 16 ? 0.5 * (20 - passos) / 4 : 0.5;
    j.applyKnockback({ x: v.x, z: v.z }, Math.min(1, v.y + forca));
  }
}

export function registrarQuark4(): void {
  intervalo("quark4: ábaco", mostrarAbacos, 10);
  intervalo("quark4: assentos", () => assentos.size && limparAssentos(), 40);
  intervalo("quark4: élitro", fogueiras, 4);
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === "cl:assento" && !assentos.has(entity.id)) entity.remove();
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    const { block: b, player: j, blockFace } = ev;
    if (id === "cl:colher_pedreiro" || id === "cl:bolsa_sementes" || id === "cl:abaco" || id === "cl:slime_balde" || (id === "minecraft:ladder" && b.typeId === "minecraft:ladder" && !j.isSneaking)) {
      ev.cancel = true;
      if (!toqueNovo(ev)) return;
      system.run(() => {
        if (id === "cl:colher_pedreiro") colher(j, b, blockFace);
        else if (id === "cl:bolsa_sementes") plantarBolsa(j, b);
        else if (id === "cl:abaco") marcarAbaco(j, b);
        else if (id === "cl:slime_balde") soltarSlime(j, b, blockFace);
        else escada(j, b);
      });
    }
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source: j }) => {
    if (itemStack.typeId === "cl:bolsa_sementes" && !j.getBlockFromViewDirection({ maxDistance: 6 })) encherBolsa(j);
    else if (itemStack.typeId === "cl:nuvem_engarrafada") usarNuvem(j);
    else if (itemStack.typeId === "minecraft:glass_bottle" && j.location.y > 150) pegarNuvem(j);
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const { player: j, target, itemStack } = ev;
    if (itemStack?.typeId === "minecraft:bucket" && target.typeId === "minecraft:slime") {
      ev.cancel = true;
      system.run(() => pegarSlime(j, target));
    } else if (!itemStack && j.isSneaking && target.typeId === "minecraft:wolf" && target.getComponent("minecraft:is_tamed"))
      system.run(() => target.dimension.spawnParticle("minecraft:heart_particle", { x: target.location.x, y: target.location.y + 1, z: target.location.z }));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation, itemStackBeforeBreak: antes, itemStackAfterBreak: depois, player }) => {
    const id = brokenBlockPermutation.type.id;
    if (id.startsWith("cl:corindo_")) registrarAcao(player, "qk4_corindo");
    if (id === "minecraft:glass" && !criativo(player)) cacos(block, antes);
    if (antes?.typeId.endsWith("_hoe") && CAPIM.has(id)) enxada(block, antes.typeId);
    if (antes?.getComponent("minecraft:durability") && !depois) system.run(() => repor(player, antes));
  });
  // Ninhadas de porco (2 a 3) e os vexes que somem com o evocador.
  let filhotes = false;
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (filhotes || cause !== EntityInitializationCause.Born || entity.typeId !== "minecraft:pig") return;
    filhotes = true;
    try {
      const extra = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < extra; i++) entity.dimension.spawnEntity("minecraft:pig", entity.location, { spawnEvent: "minecraft:entity_born" });
    } finally {
      filhotes = false;
    }
  });
  world.afterEvents.entityDie.subscribe(({ deadEntity: e, damageSource }) => {
    try {
      if (e.typeId === "minecraft:evoker") for (const v of e.dimension.getEntities({ type: "minecraft:vex", location: e.location, maxDistance: 32 })) v.kill();
      else if (e.hasTag("cl:caixa_monstros") && damageSource.damagingEntity instanceof Player) {
        const p = e.location;
        e.dimension.runCommand(`loot spawn ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${p.z.toFixed(2)} loot "cl/quark/caixa_monstros"`);
      }
    } catch {
      // saiu do mundo
    }
  });
  world.afterEvents.pistonActivate.subscribe(({ block, piston, isExpanding }) => {
    if (isExpanding) barraEmpurrada(block, piston.getAttachedBlocksLocations());
  });
  registrarDetalhe("cl:cocho", (b) => {
    const d = ler<Cocho | undefined>("cocho", b, undefined);
    return d?.n ? { translate: "cl.qk4.cocho", with: [String(d.n), d.id.replace("minecraft:", "")] } : { translate: "cl.qk4.cocho_vazio" };
  });
  // Teste no servidor: scriptevent cl:teste_qk4 <colher|bolsa|plantar|cocho|caixa|nuvem|sentar> x y z.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_qk4" || !(j instanceof Player)) return;
    const [acao, x, y, z] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    let r: unknown = "?";
    if (acao === "colher" && b) r = colher(j, b, Direction.Up);
    if (acao === "bolsa") r = encherBolsa(j);
    if (acao === "plantar" && b) r = plantarBolsa(j, b);
    if (acao === "cocho" && b) {
      let n = 0;
      for (let i = 0; i < 40 && !n; i++) n = cicloCocho(b) ? 1 : 0;
      r = n;
    }
    if (acao === "caixa" && b) {
      abrirCaixa(b);
      r = "aberta";
    }
    if (acao === "nuvem") r = usarNuvem(j);
    if (acao === "sentar" && b) r = sentar(j, b);
    console.warn(`[teste_qk4] ${acao} ${JSON.stringify(r)} mao=${maoDe(j)?.typeId}:${maoDe(j)?.amount} ${maoDe(j)?.getDynamicProperty("cl:bolsa") ?? ""}`);
  });
}

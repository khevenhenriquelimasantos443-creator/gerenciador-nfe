import { Block, BlockCustomComponent, Direction, Entity, EntityDamageCause, EntityInitializationCause, GameMode, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { DADOS_F59 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { registrarDetalhe } from "../util/dados.js";
import { toqueNovo } from "../util/toque.js";

/*
 * 1.40.0: Extra Utilities 2 (números das páginas do mod no wiki do FTB).
 * - Espinhos: a cada 0,5 s (tick de 10) ferem quem está em cima: madeira 1 (não mata), ferro 4, ouro 2 (quem morre
 *   solta XP), diamante 8 (o golpe conta como do jogador mais perto, para sair o saque de jogador).
 * - Lírio Ender: relógio de 1 minuto; no end stone ~2,3 h para madurar (1 em 20 por minuto em cada um dos 7 passos),
 *   em outro chão 4× mais devagar (1 em 80). Farinha de osso faz voltar um estágio. Madura: tocar colhe 1 pérola e
 *   replanta; quebrar dá a semente (e a pérola se madura; no end stone 2% de outra semente).
 * - Orquídea Vermelha: só em cima do minério de redstone; ticks aleatórios (1 em 3) e farinha de osso (+1 a +2); madura:
 *   tocar dá 1 redstone (10% de outra orquídea) e replanta.
 * - Laços: dourado guarda bichos pacíficos (aldeões não), amaldiçoado guarda monstros (chefes não).
 * - Tocha Magnum (64 de raio, 32 de altura) e Candelabro (16): nenhum monstro nasce sozinho por perto.
 */
const DANO = DADOS_F59.espinhos as Readonly<Record<string, number>>;
const LIRIO = "cl:lirio_ender_planta";
const ORQUIDEA = "cl:orquidea_planta";
const FACE: Record<string, Vector3> = {
  [Direction.Up]: { x: 0, y: 1, z: 0 }, [Direction.Down]: { x: 0, y: -1, z: 0 }, [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 }, [Direction.East]: { x: 1, y: 0, z: 0 }, [Direction.West]: { x: -1, y: 0, z: 0 },
};
const centro = (b: Block) => ({ x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 });
const estagio = (b: Block) => (b.permutation.getState("cl:estagio" as never) as number | undefined) ?? 0;
const definir = (b: Block, n: number) => b.setPermutation(b.permutation.withState("cl:estagio" as never, n as never));
const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;
function gastarMao(j: Player): void {
  if (criativo(j)) return;
  const c = j.getComponent("minecraft:inventory")?.container;
  const i = c?.getItem(j.selectedSlotIndex);
  if (!c || !i) return;
  if (i.amount > 1) {
    i.amount--;
    c.setItem(j.selectedSlotIndex, i);
  } else c.setItem(j.selectedSlotIndex, undefined);
}

// ---------- Espinhos ----------
export const espinhoComp: BlockCustomComponent = {
  onTick({ block }) {
    const dano = DANO[block.typeId];
    const cima = block.above();
    if (!dano || !cima) return;
    let alvos: Entity[];
    try {
      alvos = block.dimension.getEntitiesAtBlockLocation(cima);
    } catch {
      return;
    }
    for (const e of alvos) {
      const vida = e.getComponent("minecraft:health");
      if (!vida || e.typeId === "minecraft:item") continue;
      if (e instanceof Player && criativo(e)) continue;
      const atual = vida.currentValue;
      if (block.typeId === "cl:espinho_madeira") {
        if (atual > 1) e.applyDamage(Math.min(dano, atual - 1), { cause: EntityDamageCause.contact });
        continue;
      }
      const jogador = block.typeId === "cl:espinho_diamante" ? block.dimension.getPlayers({ location: centro(block), maxDistance: 32, closest: 1 })[0] : undefined;
      if (jogador && !(e instanceof Player)) e.applyDamage(dano, { cause: EntityDamageCause.entityAttack, damagingEntity: jogador });
      else e.applyDamage(dano, { cause: EntityDamageCause.contact });
      if (atual - dano > 0 || e instanceof Player) continue;
      if (block.typeId === "cl:espinho_ouro")
        for (let k = 0; k < 1 + Math.floor(Math.random() * 3); k++) block.dimension.spawnEntity("minecraft:xp_orb", { x: cima.x + 0.5, y: cima.y + 0.3, z: cima.z + 0.5 });
      if (e.matches({ families: ["monster"] })) for (const j of block.dimension.getPlayers({ location: centro(block), maxDistance: 24 })) registrarAcao(j, "xu2_espinho");
    }
  },
};

// ---------- Lírio Ender e Orquídea Vermelha ----------
export const lirioComp: BlockCustomComponent = {
  onTick({ block }) {
    const n = estagio(block);
    if (n >= 7) return;
    const noEnd = block.below()?.typeId === "minecraft:end_stone";
    if (Math.random() < (noEnd ? 1 / 20 : 1 / 80)) definir(block, n + 1);
  },
  onPlayerInteract({ block, player }) {
    if (estagio(block) < 7) {
      if (player) aviso(player, { translate: "cl.xu2.lirio", with: [String(estagio(block) + 1)] }, 2);
      return;
    }
    block.dimension.spawnItem(new ItemStack("minecraft:ender_pearl", 1), centro(block));
    definir(block, 0);
    if (player) registrarAcao(player, "xu2_lirio");
  },
  onPlayerBreak({ block, brokenBlockPermutation, dimension }) {
    const n = (brokenBlockPermutation.getState("cl:estagio" as never) as number | undefined) ?? 0;
    const p = centro(block);
    dimension.spawnItem(new ItemStack("cl:semente_lirio_ender", 1), p);
    if (n >= 7) {
      dimension.spawnItem(new ItemStack("minecraft:ender_pearl", 1), p);
      if (block.below()?.typeId === "minecraft:end_stone" && Math.random() < 0.02) dimension.spawnItem(new ItemStack("cl:semente_lirio_ender", 1), p);
    }
  },
};
export const orquideaComp: BlockCustomComponent = {
  onRandomTick({ block }) {
    const n = estagio(block);
    if (n < 6 && Math.random() < 1 / 3) definir(block, n + 1);
  },
  onPlayerInteract({ block, player }) {
    if (estagio(block) < 6) return;
    block.dimension.spawnItem(new ItemStack("minecraft:redstone", 1), centro(block));
    if (Math.random() < 0.1) block.dimension.spawnItem(new ItemStack("cl:orquidea_vermelha", 1), centro(block));
    definir(block, 0);
    if (player) registrarAcao(player, "xu2_orquidea");
  },
  onPlayerBreak({ block, brokenBlockPermutation, dimension }) {
    dimension.spawnItem(new ItemStack("cl:orquidea_vermelha", 1), centro(block));
    if (((brokenBlockPermutation.getState("cl:estagio" as never) as number | undefined) ?? 0) >= 6) dimension.spawnItem(new ItemStack("minecraft:redstone", 1), centro(block));
  },
};
const MINERIO_REDSTONE = new Set(["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore", "minecraft:lit_redstone_ore", "minecraft:lit_deepslate_redstone_ore"]);
export function plantar(j: Player, b: Block, face: Direction, item: string): boolean {
  if (face !== Direction.Up) return false;
  const cima = b.above();
  if (!cima?.isAir) return false;
  if (item === "cl:orquidea_vermelha" && !MINERIO_REDSTONE.has(b.typeId)) return false;
  if (item === "cl:semente_lirio_ender" && (b.isAir || b.isLiquid)) return false;
  cima.setType(item === "cl:orquidea_vermelha" ? ORQUIDEA : LIRIO);
  gastarMao(j);
  return true;
}
function farinha(j: Player, b: Block): boolean {
  if (b.typeId === LIRIO) {
    // O Lírio Ender volta um estágio (e come a farinha).
    definir(b, Math.max(0, estagio(b) - 1));
  } else if (b.typeId === ORQUIDEA) {
    definir(b, Math.min(6, estagio(b) + 1 + Math.floor(Math.random() * 2)));
    b.dimension.spawnParticle("minecraft:crop_growth_emitter", centro(b));
  } else return false;
  gastarMao(j);
  return true;
}

// ---------- Laços ----------
const CHEFES = new Set(["minecraft:wither", "minecraft:ender_dragon", "minecraft:warden", "minecraft:elder_guardian"]);
type Guardado = { t: string; n?: string; bebe?: boolean };
function lerLaco(i: ItemStack): Guardado | undefined {
  try {
    return JSON.parse((i.getDynamicProperty("cl:laco") as string | undefined) ?? "null") ?? undefined;
  } catch {
    return undefined;
  }
}
export function pegarComLaco(j: Player, e: Entity): boolean {
  const c = j.getComponent("minecraft:inventory")?.container;
  const laco = c?.getItem(j.selectedSlotIndex);
  if (!c || !laco || lerLaco(laco)) return false;
  const monstro = e.matches({ families: ["monster"] });
  const serve = laco.typeId === "cl:laco_dourado"
    ? !monstro && !(e instanceof Player) && !e.typeId.includes("villager") && !e.matches({ families: ["inanimate"] }) && !!e.getComponent("minecraft:health")
    : monstro && !CHEFES.has(e.typeId);
  if (!serve || !e.typeId.startsWith("minecraft:")) {
    aviso(j, "cl.xu2.laco_nao", 2);
    return false;
  }
  const g: Guardado = { t: e.typeId, n: e.nameTag || undefined, bebe: !!e.getComponent("minecraft:is_baby") };
  laco.setDynamicProperty("cl:laco", JSON.stringify(g));
  laco.setLore([`§7${g.n ?? e.typeId.replace("minecraft:", "")}`]);
  c.setItem(j.selectedSlotIndex, laco);
  e.remove();
  j.playSound("mob.chicken.plop");
  registrarAcao(j, "xu2_laco");
  return true;
}
export function soltarDoLaco(j: Player, b: Block, face: Direction): boolean {
  const c = j.getComponent("minecraft:inventory")?.container;
  const laco = c?.getItem(j.selectedSlotIndex);
  const g = laco && lerLaco(laco);
  if (!c || !laco || !g) return false;
  const o = FACE[face];
  const e = b.dimension.spawnEntity(g.t, { x: b.x + o.x + 0.5, y: b.y + o.y, z: b.z + o.z + 0.5 }, g.bebe ? { spawnEvent: "minecraft:entity_born" } : undefined);
  if (g.n) e.nameTag = g.n;
  laco.setDynamicProperty("cl:laco", undefined);
  laco.setLore([]);
  c.setItem(j.selectedSlotIndex, laco);
  return true;
}

// ---------- Tocha Magnum e Candelabro ----------
const LISTA = "cl:xu2_tochas";
type Tocha = { d: string; x: number; y: number; z: number; h: number; v: number };
let tochas: Tocha[] | undefined;
function lista(): Tocha[] {
  if (!tochas)
    try {
      tochas = JSON.parse((world.getDynamicProperty(LISTA) as string | undefined) ?? "[]") as Tocha[];
    } catch {
      tochas = [];
    }
  return tochas;
}
const salvar = () => world.setDynamicProperty(LISTA, JSON.stringify(lista()));
const mesma = (t: Tocha, b: Block) => t.d === b.dimension.id && t.x === b.x && t.y === b.y && t.z === b.z;
export function protegidoXu(d: string, p: Vector3): boolean {
  for (const t of lista()) {
    if (t.d !== d) continue;
    const dx = p.x - t.x, dy = p.y - t.y, dz = p.z - t.z;
    if (t.h === t.v ? dx * dx + dy * dy + dz * dz <= t.h * t.h : dx * dx + dz * dz <= t.h * t.h && Math.abs(dy) <= t.v) return true;
  }
  return false;
}
const protetor = (h: number, v: number, texto: string): BlockCustomComponent => ({
  onPlace({ block }) {
    if (!lista().some((t) => mesma(t, block))) {
      lista().push({ d: block.dimension.id, x: block.x, y: block.y, z: block.z, h, v });
      salvar();
    }
  },
  onPlayerInteract({ player }) {
    if (player) aviso(player, texto, 3);
  },
  onPlayerBreak({ block }) {
    tochas = lista().filter((t) => !mesma(t, block));
    salvar();
  },
});
export const tochaMagnumComp = protetor(64, 32, "cl.xu2.magnum");
export const candelabroComp = protetor(16, 16, "cl.xu2.candelabro");

export function registrarXu2(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    const { block: b, player: j, blockFace } = ev;
    const ehFarinha = id === "minecraft:bone_meal" && (b.typeId === LIRIO || b.typeId === ORQUIDEA);
    const ehPlantar = id === "cl:semente_lirio_ender" || id === "cl:orquidea_vermelha";
    const ehLaco = (id === "cl:laco_dourado" || id === "cl:laco_amaldicoado") && ev.itemStack && lerLaco(ev.itemStack);
    if (!ehFarinha && !ehPlantar && !ehLaco) return;
    ev.cancel = true;
    if (!toqueNovo(ev)) return;
    system.run(() => {
      if (ehFarinha) farinha(j, b);
      else if (ehPlantar) plantar(j, b, blockFace, id!);
      else soltarDoLaco(j, b, blockFace);
    });
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    if (id !== "cl:laco_dourado" && id !== "cl:laco_amaldicoado") return;
    ev.cancel = true;
    const { player: j, target } = ev;
    system.run(() => pegarComLaco(j, target));
  });
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== EntityInitializationCause.Spawned || !lista().length) return;
    try {
      if (entity.matches({ families: ["monster"] }) && entity.typeId.startsWith("minecraft:") && protegidoXu(entity.dimension.id, entity.location)) entity.remove();
    } catch {
      // já saiu
    }
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId === "cl:tocha_magnum") registrarAcao(player, "xu2_magnum");
  });
  registrarDetalhe([LIRIO, ORQUIDEA], (b) => ({ text: `${estagio(b) + 1}/${b.typeId === LIRIO ? 8 : 7}` }));
  // Teste no servidor: scriptevent cl:teste_xu2 <plantar item|pegar|soltar|estagio n> x y z.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_xu2" || !(j instanceof Player)) return;
    const [acao, a, x, y, z] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    let r: unknown = "?";
    if (acao === "plantar" && b) r = plantar(j, b, Direction.Up, a);
    if (acao === "estagio" && b) {
      definir(b, Number(a));
      r = estagio(b);
    }
    if (acao === "farinha" && b) r = farinha(j, b);
    if (acao === "pegar") {
      const e = j.dimension.getEntities({ type: a, location: j.location, maxDistance: 8, closest: 1 })[0];
      r = e ? pegarComLaco(j, e) : "sem bicho";
    }
    if (acao === "soltar" && b) r = soltarDoLaco(j, b, Direction.Up);
    if (acao === "protegido") r = protegidoXu(j.dimension.id, { x: Number(x), y: Number(y), z: Number(z) });
    console.warn(`[teste_xu2] ${acao} ${JSON.stringify(r)}`);
  });
}

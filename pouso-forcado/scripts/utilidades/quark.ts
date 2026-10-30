import { Block, BlockPermutation, Entity, EntityDamageCause, GameMode, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarDaMao } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";

/*
 * Quark (1.12.0):
 * - Picarango: arremessado vai até 20 blocos, quebra o primeiro bloco que acerta (nível de diamante) ou fere o primeiro
 *   bicho (2 de dano) e volta trazendo os itens; gasta 1 de durabilidade por arremesso.
 * - Colheita com toque: trigo, cenoura, batata e beterraba maduros colhem e replantam ao tocar.
 * - Portas duplas: abrir uma porta de madeira abre a vizinha espelhada.
 * - Corda: pulando dentro dela, sobe; parado, desce devagar. Tocar uma corda com outra corda a estende para baixo.
 */
const PICARANGO = "cl:picarango";
const ALCANCE = 20;
const VELOCIDADE = 0.8;
const INQUEBRAVEIS = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:end_portal_frame", "minecraft:command_block", "minecraft:structure_block", "cl:bau_tesouro", "cl:painel_nave"]);
type Voo = { dono: Player; item: ItemStack; dir: Vector3; andou: number; volta: boolean; onde?: Vector3 };
const voos = new Map<string, Voo>();
const soma = (a: Vector3, b: Vector3, k = 1) => ({ x: a.x + b.x * k, y: a.y + b.y * k, z: a.z + b.z * k });

function lancar(j: Player): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const item = inv?.getItem(j.selectedSlotIndex);
  if (!inv || item?.typeId !== PICARANGO) return;
  inv.setItem(j.selectedSlotIndex, undefined);
  const dir = j.getViewDirection();
  const e = j.dimension.spawnEntity("cl:picarango_voando", soma(j.getHeadLocation(), dir, 1));
  voos.set(e.id, { dono: j, item, dir, andou: 0, volta: false });
  j.playSound("random.bow", { pitch: 0.8 });
}

function devolver(e: Entity, v: Voo): void {
  voos.delete(e.id);
  const dur = v.item.getComponent("minecraft:durability");
  let item: ItemStack | undefined = v.item;
  if (dur && v.dono.getGameMode() !== GameMode.Creative) {
    if (dur.damage + 1 >= dur.maxDurability) item = undefined;
    else dur.damage++;
  }
  // Os itens do bloco quebrado vêm junto.
  if (v.onde && v.dono.isValid) for (const it of e.dimension.getEntities({ type: "minecraft:item", location: v.onde, maxDistance: 2.5 })) it.teleport(v.dono.location, { dimension: v.dono.dimension });
  if (item && v.dono.isValid) {
    const sobra = v.dono.getComponent("minecraft:inventory")?.container?.addItem(item);
    if (sobra) v.dono.dimension.spawnItem(sobra, v.dono.location);
  } else if (item) e.dimension.spawnItem(item, e.location);
  if (e.isValid) e.remove();
}

function voar(): void {
  for (const [id, v] of voos) {
    const e = world.getEntity(id);
    if (!e) {
      // Saiu da área carregada: o item volta direto para o dono.
      if (v.dono.isValid) v.dono.getComponent("minecraft:inventory")?.container?.addItem(v.item);
      voos.delete(id);
      continue;
    }
    if (!v.dono.isValid || v.dono.dimension.id !== e.dimension.id) {
      e.dimension.spawnItem(v.item, e.location);
      voos.delete(id);
      e.remove();
      continue;
    }
    if (v.volta) {
      const alvo = v.dono.getHeadLocation();
      const d = { x: alvo.x - e.location.x, y: alvo.y - e.location.y, z: alvo.z - e.location.z };
      const n = Math.hypot(d.x, d.y, d.z);
      if (n < 1.5) {
        devolver(e, v);
        continue;
      }
      e.teleport(soma(e.location, d, Math.min(1, VELOCIDADE * 1.4 / n)));
      continue;
    }
    const prox = soma(e.location, v.dir, VELOCIDADE);
    v.andou += VELOCIDADE;
    const b = e.dimension.getBlock(prox);
    if (b && !b.isAir && !b.isLiquid) {
      if (!INQUEBRAVEIS.has(b.typeId) && b.typeId !== "minecraft:obsidian") {
        e.dimension.runCommand(`setblock ${b.x} ${b.y} ${b.z} air destroy`);
        v.onde = b.center();
        registrarAcao(v.dono, "picarango");
      }
      v.volta = true;
      continue;
    }
    const alvo = e.dimension.getEntities({ location: prox, maxDistance: 1, excludeTypes: ["minecraft:item", "cl:picarango_voando"], excludeFamilies: ["inanimate"] }).find((x) => x.id !== v.dono.id);
    if (alvo) {
      alvo.applyDamage(2, { cause: EntityDamageCause.entityAttack, damagingEntity: v.dono });
      v.volta = true;
      continue;
    }
    e.teleport(prox);
    if (v.andou >= ALCANCE) v.volta = true;
  }
}

// ---------- Colheita com toque ----------
const PLANTAS: Readonly<Record<string, number>> = { "minecraft:wheat": 7, "minecraft:carrots": 7, "minecraft:potatoes": 7, "minecraft:beetroot": 7 };
function colher(j: Player, b: Block): void {
  const tipo = b.typeId;
  const p = { x: b.x, y: b.y, z: b.z };
  b.dimension.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
  b.dimension.getBlock(p)?.setPermutation(BlockPermutation.resolve(tipo, { growth: 0 }));
  registrarAcao(j, "colher");
}

// ---------- Portas duplas ----------
function portaDupla(b: Block): void {
  const baixo = b.permutation.getState("upper_block_bit") ? b.below() : b;
  if (!baixo) return;
  const aberta = baixo.permutation.getState("open_bit");
  const dobradica = baixo.permutation.getState("door_hinge_bit");
  for (const v of [baixo.north(), baixo.south(), baixo.east(), baixo.west()]) {
    if (!v || v.typeId !== baixo.typeId) continue;
    const pv = v.permutation;
    if (pv.getState("upper_block_bit") || pv.getState("door_hinge_bit") === dobradica || pv.getState("direction") !== baixo.permutation.getState("direction")) continue;
    if (pv.getState("open_bit") === aberta) continue;
    v.setPermutation(pv.withState("open_bit", aberta as boolean));
    const cima = v.above();
    if (cima?.typeId === v.typeId) cima.setPermutation(cima.permutation.withState("open_bit", aberta as boolean));
  }
}

// ---------- Corda ----------
const subiu = new Set<string>();
function corda(): void {
  for (const j of world.getPlayers()) {
    const pe = j.dimension.getBlock(j.location);
    const cabeca = j.dimension.getBlock(j.getHeadLocation());
    if (pe?.typeId !== "cl:corda" && cabeca?.typeId !== "cl:corda") continue;
    if (j.isJumping) {
      j.addEffect("levitation", 4, { amplifier: 3, showParticles: false });
      if (!subiu.has(j.id)) {
        subiu.add(j.id);
        registrarAcao(j, "corda");
      }
    } else j.addEffect("slow_falling", 4, { amplifier: 0, showParticles: false });
  }
}

export function registrarQuark(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === PICARANGO) lancar(source);
  });
  intervalo("picarango", () => voos.size && voar(), 1);
  intervalo("corda", corda, 2);
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block: b, player: j } = ev;
    const item = ev.itemStack?.typeId;
    const madura = PLANTAS[b.typeId] !== undefined && item !== "minecraft:bone_meal" && b.permutation.getState("growth" as never) === PLANTAS[b.typeId];
    const estende = b.typeId === "cl:corda" && item === "cl:corda";
    if ((!madura && !estende) || !toqueNovo(ev)) return;
    if (madura) {
      ev.cancel = true;
      system.run(() => colher(j, b));
    } else {
      ev.cancel = true;
      system.run(() => {
        let fim: Block | undefined = b;
        while (fim?.typeId === "cl:corda") fim = fim.below();
        if (!fim?.isAir) return;
        fim.setType("cl:corda");
        if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      });
    }
  });
  world.afterEvents.playerInteractWithBlock.subscribe(({ block }) => {
    if (block.typeId.endsWith("_door") && block.typeId !== "minecraft:iron_door") system.run(() => portaDupla(block));
  });
  // Picarangos que ficaram no ar (mundo fechado no meio do voo): somem e voltam como item.
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === "cl:picarango_voando" && !voos.has(entity.id)) {
      entity.dimension.spawnItem(new ItemStack(PICARANGO, 1), entity.location);
      entity.remove();
    }
  });
}

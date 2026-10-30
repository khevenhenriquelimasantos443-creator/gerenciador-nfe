import { BlockCustomComponent, Entity, GameMode, system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarDaMao } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";

/*
 * Mekanism Additions (1.11.0):
 * - Balão: usado no ar, prende em quem usou (cai devagar por 60 s); usado num bicho, levanta o bicho por 10 s.
 *   Bater no balão estoura. O balão segue o dono por script (um teleporte a cada 2 ticks, só enquanto houver balão).
 * - TNT de Obsidiana: acende com isqueiro ou carga de fogo; 100 ticks de pavio e explosão de raio 12 (a entidade
 *   cl:tnt_obsidiana_acesa).
 * - Estrada de Plástico: quem anda em cima ganha Velocidade II (conferido a cada 10 ticks).
 * - Filhotes: 1 em 3 creepers, esqueletos, esqueletos errantes e endermen nasce bebê (peso 0,5 do adulto).
 */
const CORES = ["branco", "laranja", "magenta", "azul_claro", "amarelo", "lima", "rosa", "cinza", "cinza_claro", "ciano", "roxo", "azul", "marrom", "verde", "vermelho", "preto"];
const BALAO = "cl:balao";
type Preso = { dono: Entity; ate: number; mob: boolean };
const presos = new Map<string, Preso>(); // id do balão -> em quem está preso

function soltarBalao(alvo: Entity, item: string, mob: boolean): void {
  const n = CORES.indexOf(item.replace("cl:balao_", ""));
  const b = alvo.dimension.spawnEntity(BALAO, { x: alvo.location.x, y: alvo.location.y + 2, z: alvo.location.z });
  b.triggerEvent(`cl:cor_${Math.max(0, n)}`);
  presos.set(b.id, { dono: alvo, ate: system.currentTick + (mob ? 200 : 1200), mob });
}

function estourar(b: Entity): void {
  presos.delete(b.id);
  if (!b.isValid) return;
  b.dimension.playSound("random.pop", b.location, { pitch: 0.7 });
  b.remove();
}

export const tntObsidiana: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    const mao = j?.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
    if (!j || (mao?.typeId !== "minecraft:flint_and_steel" && mao?.typeId !== "minecraft:fire_charge")) return;
    const b = e.block;
    const centro = { x: b.x + 0.5, y: b.y, z: b.z + 0.5 };
    b.setType("minecraft:air");
    b.dimension.spawnEntity("cl:tnt_obsidiana_acesa", centro);
    b.dimension.playSound("random.fuse", centro);
    if (mao.typeId === "minecraft:fire_charge" && j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
  },
};

const BEBES: Readonly<Record<string, string>> = {
  "minecraft:creeper": "cl:creeper_bebe", "minecraft:skeleton": "cl:esqueleto_bebe",
  "minecraft:stray": "cl:esqueleto_errante_bebe", "minecraft:enderman": "cl:enderman_bebe",
};

export function registrarMekanismAdditions(): void {
  // Balão no ar: preso em quem usou.
  world.afterEvents.itemUse.subscribe(({ itemStack, source: j }) => {
    if (!itemStack.typeId.startsWith("cl:balao_")) return;
    soltarBalao(j, itemStack.typeId, false);
    if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
    aviso(j, "cl.ad.balao", 4);
    registrarAcao(j, "balao");
  });
  // Balão num bicho: levanta o bicho.
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const item = ev.itemStack?.typeId;
    if (!item?.startsWith("cl:balao_") || ev.target.typeId === BALAO) return;
    ev.cancel = true;
    const { player: j, target: alvo } = ev;
    system.run(() => {
      soltarBalao(alvo, item, true);
      if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      aviso(j, "cl.ad.balao_mob", 3);
      registrarAcao(j, "balao");
    });
  });
  world.afterEvents.entityHitEntity.subscribe(({ hitEntity }) => {
    if (hitEntity.typeId === BALAO) estourar(hitEntity);
  });
  intervalo("balões", () => {
    for (const [id, p] of presos) {
      const b = world.getEntity(id);
      if (!b || !p.dono.isValid || system.currentTick > p.ate) {
        if (b) estourar(b);
        else presos.delete(id);
        continue;
      }
      const d = p.dono;
      b.teleport({ x: d.location.x, y: d.location.y + 2, z: d.location.z }, { dimension: d.dimension });
      if (system.currentTick % 20 === 0) d.addEffect(p.mob ? "levitation" : "slow_falling", 30, { amplifier: 0, showParticles: false });
    }
  }, 2);
  // Balões soltos de antes (o mundo foi fechado): estouram.
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === BALAO && !presos.has(entity.id)) system.runTimeout(() => entity.isValid && !presos.has(entity.id) && estourar(entity), 40);
  });
  intervalo("estrada de plástico", () => {
    for (const j of world.getPlayers()) {
      const baixo = j.dimension.getBlock({ x: j.location.x, y: j.location.y - 0.5, z: j.location.z });
      if (baixo?.typeId.startsWith("cl:estrada_plastico_")) j.addEffect("speed", 15, { amplifier: 1, showParticles: false });
    }
  }, 10);
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    const bebe = BEBES[entity.typeId];
    if (!bebe || cause !== "Spawned" || entity.dimension.id !== "minecraft:overworld" || Math.random() >= 1 / 3) return;
    const { location: p, dimension: d } = entity;
    system.run(() => {
      if (!entity.isValid) return;
      entity.remove();
      d.spawnEntity(bebe, p);
    });
  });
}

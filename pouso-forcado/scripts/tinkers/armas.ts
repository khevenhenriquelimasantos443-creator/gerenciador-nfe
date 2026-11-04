import { Entity, EntityDamageCause, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { DADOS_F47 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { intervalo } from "../util/perfil.js";

/*
 * Armaduras, escudos, arcos e arremessáveis do Tinkers' Construct 3 (1.28.0, Tinkers completo parte 3).
 * - Escudo (Viajante ou Placa) na mão secundária: agachado, Resistência I (Viajante) ou II (Placa); cada golpe tomado
 *   assim gasta o escudo.
 * - Botas de Slime: caindo rápido, Resistência total até tocar o chão (sem dano de queda) e quica de volta.
 * - Slimélitros: caindo (sem agachar), plana para a frente devagar.
 * - Arco Longo e Besta: a flecha que acerta leva o dano a mais da velocidade do braço do arco (TC3); o jogo gasta o arco.
 * - Shuriken, Machado de Arremesso e Dardo: o dano do material da cabeça; o machado e o dardo caem no chão para pegar.
 * Custo: só quem usa (laço de 2 ticks só para quem está de Botas de Slime ou Slimélitros; o resto, eventos).
 */
const ARCOS = DADOS_F47.arcos as unknown as Readonly<Record<string, { vel: number; tier: number }>>;
const ARREM = DADOS_F47.arremessos as unknown as Readonly<Record<string, { dano: number }>>;
const equip = (j: Player, s: EquipmentSlot) => j.getComponent("minecraft:equippable")?.getEquipment(s);

function gastar(j: Player, slot: EquipmentSlot, n = 1): void {
  const eq = j.getComponent("minecraft:equippable");
  const i = eq?.getEquipment(slot);
  const d = i?.getComponent("minecraft:durability");
  if (!eq || !i || !d) return;
  if (d.damage + n >= d.maxDurability) {
    eq.setEquipment(slot, undefined);
    j.playSound("random.break");
    return;
  }
  d.damage += n;
  eq.setEquipment(slot, i);
}

/** "cl:arco_longo_ferro" -> ["arco_longo", "ferro"]. */
function arcoDe(id: string | undefined): [string, string] | undefined {
  for (const t of ["arco_longo", "besta"]) if (id?.startsWith(`cl:${t}_`)) return [t, id.slice(t.length + 4)];
  return undefined;
}
function arremessoDe(id: string | undefined): [string, string] | undefined {
  for (const t of ["machado_arremesso", "shuriken", "dardo"]) if (id?.startsWith(`cl:${t}_`)) return [t, id.slice(t.length + 4)];
  return undefined;
}

// Quem acabou de arremessar o quê (o projétil nasce logo depois do uso).
const lancou = new Map<string, { id: string; tick: number }>();
// Quem está de Botas de Slime / Slimélitros (refeito a cada 1 s).
const comBotas = new Set<string>(), comAsas = new Set<string>();
const velAntes = new Map<string, number>();

export function registrarArmas(): void {
  intervalo("tc_armas", () => {
    comBotas.clear();
    comAsas.clear();
    for (const j of world.getPlayers()) {
      if (equip(j, EquipmentSlot.Feet)?.typeId === "cl:botas_slime") comBotas.add(j.id);
      if (equip(j, EquipmentSlot.Chest)?.typeId === "cl:slimelitros") comAsas.add(j.id);
      // Escudo na mão secundária, agachado.
      const esc = equip(j, EquipmentSlot.Offhand)?.typeId;
      if (esc?.startsWith("cl:escudo_") && j.isSneaking) j.addEffect("resistance", 30, { amplifier: esc === "cl:escudo_viajante" ? 0 : 1, showParticles: false });
    }
  }, 20);
  intervalo("tc_slime_armadura", () => {
    if (!comBotas.size && !comAsas.size) return;
    for (const j of world.getPlayers()) {
      if (!comBotas.has(j.id) && !comAsas.has(j.id)) continue;
      const v = j.getVelocity();
      if (comBotas.has(j.id)) {
        const antes = velAntes.get(j.id) ?? 0;
        if (v.y < -0.6) j.addEffect("resistance", 10, { amplifier: 4, showParticles: false });
        if (j.isOnGround && antes < -0.6 && !j.isSneaking) {
          j.applyKnockback({ x: v.x, z: v.z }, Math.min(1.4, -antes * 0.8));
          j.playSound("mob.slime.big", { volume: 0.6 });
          registrarAcao(j, "tc_quicar");
        }
        velAntes.set(j.id, v.y);
      }
      if (comAsas.has(j.id) && !j.isOnGround && v.y < -0.15 && !j.isSneaking) {
        const d = j.getViewDirection();
        j.addEffect("slow_falling", 10, { amplifier: 0, showParticles: false });
        j.applyKnockback({ x: d.x * 0.7, z: d.z * 0.7 }, -0.05);
      }
    }
  }, 2);
  // Escudo: o golpe tomado agachado gasta o escudo.
  world.afterEvents.entityHurt.subscribe(({ hurtEntity, damageSource }) => {
    if (!(hurtEntity instanceof Player) || !hurtEntity.isSneaking || damageSource.cause === EntityDamageCause.fall) return;
    if (equip(hurtEntity, EquipmentSlot.Offhand)?.typeId.startsWith("cl:escudo_")) gastar(hurtEntity, EquipmentSlot.Offhand);
  });
  // Arremesso: guarda o que foi lançado; o projétil leva o material.
  world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
    if (arremessoDe(itemStack.typeId)) lancou.set(source.id, { id: itemStack.typeId, tick: system.currentTick });
  });
  world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (!entity.typeId.endsWith("_proj") || !entity.typeId.startsWith("cl:")) return;
    try {
      const dono = entity.getComponent("minecraft:projectile")?.owner;
      const l = dono && lancou.get(dono.id);
      if (l && system.currentTick - l.tick <= 5) entity.setDynamicProperty("cl:item", l.id);
    } catch {
      // já sumiu
    }
  });
  world.afterEvents.projectileHitEntity.subscribe((ev) => {
    const alvo = ev.getEntityHit().entity;
    const j = ev.source;
    if (!alvo || !(j instanceof Player)) return;
    let extra = 0;
    const p = ev.projectile;
    if (p.typeId === "minecraft:arrow") {
      const a = arcoDe(equip(j, EquipmentSlot.Mainhand)?.typeId);
      const d = a && ARCOS[a[1]];
      if (d) extra = Math.max(0, Math.round(6 * d.vel + d.tier * 0.5 + (a![0] === "besta" ? 2 : 0)));
    } else {
      const item = p.isValid ? (p.getDynamicProperty("cl:item") as string | undefined) : undefined;
      const r = arremessoDe(item);
      if (r) {
        extra = Math.round((ARREM[r[1]]?.dano ?? 1) * (r[0] === "shuriken" ? 1 : 1.5));
        if (r[0] === "shuriken") registrarAcao(j, "tc_shuriken");
        devolver(p, item!);
      }
    }
    if (extra > 0 && alvo.isValid) alvo.applyDamage(extra, { cause: EntityDamageCause.projectile, damagingEntity: j });
  });
  world.afterEvents.projectileHitBlock.subscribe((ev) => {
    const p = ev.projectile;
    const item = p.isValid ? (p.getDynamicProperty("cl:item") as string | undefined) : undefined;
    if (item) devolver(p, item, ev.location, ev.dimension);
  });
}

/** Machado de arremesso e dardo caem no chão para pegar de volta; o shuriken, metade das vezes. */
function devolver(p: Entity, item: string, onde = p.location, dim = p.dimension): void {
  const r = arremessoDe(item);
  if (!r || (r[0] === "shuriken" && Math.random() < 0.5)) return;
  system.run(() => {
    try {
      dim.spawnItem(new ItemStack(item, 1), onde);
      if (p.isValid) p.remove();
    } catch {
      // fora do mundo carregado
    }
  });
}

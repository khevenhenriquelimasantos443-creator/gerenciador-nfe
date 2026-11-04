import { EntityDamageCause, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconeDe, nomeDe } from "../catalogo/catalogo.js";
import { THERMAL, TINKERS } from "../config.js";
import { DADOS_F50 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { abrirUmMenu } from "../util/menus.js";
import { ajustarDrops } from "../tinkers/tracos.js";

/*
 * 1.31.0: os artefatos do mod Artifacts 15.1.3 (MIT), com os números do ItemConfigs.java do mod. O Bedrock não tem os
 * espaços do Curios: a Tela de Artefatos guarda no jogador os 7 espaços do mod (cabeça, rosto, pescoço, cinto, 2 de
 * mãos e pés). Usar o artefato equipa; usar agachado ou o Estojo de Artefatos abre a tela.
 * Para o celular: os efeitos vêm dos eventos (golpe, dano, quebrar, comer) e de um laço de 1 s só para quem tem
 * artefato; o laço de 2 ticks (pulo duplo, flamingo, guarda-chuva, tênis aquático) só roda para quem usa um desses.
 */
const ESPACO = DADOS_F50.artefatos as Readonly<Record<string, string>>;
const ESPACOS = ["cabeca", "rosto", "pescoco", "cinto", "maos1", "maos2", "pes"] as const;
type Espaco = (typeof ESPACOS)[number];
type Equipados = Partial<Record<Espaco, string>>;
const PROP = "cl:artefatos";
const cl = (id: string) => `cl:${id}`;

const cache = new Map<string, Set<string>>();
function lerEquip(j: Player): Equipados {
  try {
    const v = j.getDynamicProperty(PROP);
    return typeof v === "string" ? (JSON.parse(v) as Equipados) : {};
  } catch {
    return {};
  }
}
function gravarEquip(j: Player, e: Equipados): void {
  j.setDynamicProperty(PROP, Object.keys(e).length ? JSON.stringify(e) : undefined);
  cache.set(j.id, new Set(Object.values(e).filter((x): x is string => !!x)));
}
/** Os artefatos que o jogador tem postos (IDs sem "cl:"). */
function tem(j: Player): Set<string> {
  let s = cache.get(j.id);
  if (!s) {
    s = new Set(Object.values(lerEquip(j)).filter((x): x is string => !!x));
    cache.set(j.id, s);
  }
  return s;
}
const usa = (j: Player, id: string) => tem(j).has(id);

// ---------- Equipar e a Tela de Artefatos ----------
function equipar(j: Player, id: string): void {
  const esp = ESPACO[id];
  if (!esp) return;
  const e = lerEquip(j);
  const alvo: Espaco = esp === "maos" ? (!e.maos1 ? "maos1" : !e.maos2 ? "maos2" : "maos1") : (esp as Espaco);
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  if (!inv || mao?.typeId !== cl(id)) return;
  if (mao.amount > 1) {
    mao.amount--;
    inv.setItem(j.selectedSlotIndex, mao);
  } else inv.setItem(j.selectedSlotIndex, undefined);
  const velho = e[alvo];
  e[alvo] = id;
  gravarEquip(j, e);
  if (velho) {
    const sobra = inv.addItem(new ItemStack(cl(velho), 1));
    if (sobra) j.dimension.spawnItem(sobra, j.location);
  }
  j.playSound("armor.equip_generic");
  aviso(j, { translate: "cl.art.equipou", with: { rawtext: [nomeDe(cl(id))] } }, 3);
  registrarAcao(j, "art_equipar");
  const n = Object.values(e).filter(Boolean).length;
  if (n >= ESPACOS.length) registrarAcao(j, "art_cheio");
  vistos(j, id);
}
/** Diferentes já equipados (para a missão Colecionador). */
function vistos(j: Player, id: string): void {
  let v: string[] = [];
  try {
    v = JSON.parse((j.getDynamicProperty("cl:artefatos_vistos") as string | undefined) ?? "[]") as string[];
  } catch {
    v = [];
  }
  if (v.includes(id)) return;
  v.push(id);
  j.setDynamicProperty("cl:artefatos_vistos", JSON.stringify(v));
  registrarAcao(j, "art_diferente");
}
async function tela(j: Player): Promise<void> {
  const e = lerEquip(j);
  const f = new ActionFormData().title({ translate: "cl.art.titulo" }).body({ translate: "cl.art.corpo" });
  for (const esp of ESPACOS) {
    const id = e[esp];
    const nomeEsp = { translate: `cl.art.espaco.${esp.startsWith("maos") ? "maos" : esp}` };
    f.button(
      id
        ? { rawtext: [{ text: "§8" }, nomeEsp, { text: "§r\n" }, nomeDe(cl(id))] }
        : { rawtext: [{ text: "§8" }, nomeEsp, { text: "§r\n" }, { translate: "cl.art.vazio" }] },
      id ? iconeDe(cl(id)) : undefined,
    );
  }
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const esp = ESPACOS[r.selection];
  const agora = lerEquip(j);
  const id = agora[esp];
  if (!id) return;
  delete agora[esp];
  gravarEquip(j, agora);
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack(cl(id), 1));
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  j.playSound("armor.equip_generic");
  aviso(j, { translate: "cl.art.tirou", with: { rawtext: [nomeDe(cl(id))] } }, 3);
  return tela(j);
}

// ---------- Efeitos ----------
/** Mantém um efeito sem piscar (a Visão Noturna pisca com menos de 10 s). */
function manter(j: Player, efeito: string, amp = 0, ticks = 400): void {
  try {
    const e = j.getEffect(efeito);
    if (e && e.amplifier === amp && e.duration > ticks / 2 + 20) return;
    j.addEffect(efeito, ticks, { amplifier: amp, showParticles: false });
  } catch {
    // efeito com outro nome nesta versão
  }
}
const RUINS = new Set(["poison", "wither", "nausea", "blindness", "hunger", "slowness", "weakness", "mining_fatigue", "darkness", "bad_omen", "infested", "oozing", "weaving", "wind_charged"]);
const NEVE = /^minecraft:(snow|snow_layer|powder_snow|snow_block)$/;
const MOVIMENTO = ["nuvem_garrafa", "flamingo_helio", "pantufas_coelho", "tenis_aquatico", "sapatos_lavagante"];
const snorkel = new Set<string>();
const contagem = new Map<string, number>();
const espera = new Map<string, number>();
const pronto = (j: Player, k: string, ticks: number) => {
  const c = `${j.id}|${k}`;
  if (system.currentTick < (espera.get(c) ?? 0)) return false;
  espera.set(c, system.currentTick + ticks);
  return true;
};
const emBaixo = (j: Player) => {
  try {
    return j.dimension.getBlock({ x: Math.floor(j.location.x), y: Math.floor(j.location.y - 0.2), z: Math.floor(j.location.z) });
  } catch {
    return undefined;
  }
};
const naMao = (j: Player, id: string) => {
  const eq = j.getComponent("minecraft:equippable");
  return eq?.getEquipment(EquipmentSlot.Mainhand)?.typeId === id || eq?.getEquipment(EquipmentSlot.Offhand)?.typeId === id;
};

function porSegundo(j: Player, s: Set<string>): void {
  if (s.has("frasco_antidoto"))
    for (const e of j.getEffects()) {
      const tipo = e.typeId.replace("minecraft:", "");
      if (!RUINS.has(tipo) || e.duration <= 100) continue;
      const amp = e.amplifier;
      j.removeEffect(tipo);
      j.addEffect(tipo, 100, { amplifier: amp }); // no máximo 5 s
    }
  if (s.has("oculos_visao_noturna")) manter(j, "night_vision");
  if (s.has("cachecol_invisibilidade")) manter(j, "invisibility");
  if (s.has("chapeu_aldeao")) manter(j, "village_hero");
  if (s.has("coracao_cristal")) manter(j, "health_boost", 1, 600);
  if (s.has("luva_forca")) manter(j, "strength");
  const garras = (s.has("garras_cavar") ? 1 : 0) + (s.has("garras_ferozes") ? 1 : 0);
  if (garras) manter(j, "haste", garras - 1);
  if (s.has("pantufas_coelho")) manter(j, "jump_boost", 1);
  const agua = j.isInWater;
  if (agua && s.has("nadadeiras")) manter(j, "dolphins_grace", 0, 60);
  if (agua && s.has("amuleto_afundar")) manter(j, "conduit_power", 0, 60);
  if (s.has("snorkel")) {
    if (agua && !snorkel.has(j.id)) {
      j.addEffect("water_breathing", 600, { amplifier: 0, showParticles: false }); // 30 s por mergulho
      snorkel.add(j.id);
    } else if (!agua) snorkel.delete(j.id);
  }
  if (s.has("tenis_corrida") && j.isSprinting) manter(j, "speed", 1, 40);
  const pe = emBaixo(j);
  if (s.has("raquetes_neve") && pe && NEVE.test(pe.typeId)) manter(j, "speed", 0, 40);
  if (s.has("sapatos_lavagante") && (pe?.typeId === "minecraft:magma" || pe?.typeId === "minecraft:lava" || j.dimension.getBlock(j.location)?.typeId === "minecraft:lava")) manter(j, "fire_resistance", 0, 60);
  if (s.has("chapeu_vaqueiro")) {
    const m = j.getComponent("minecraft:riding")?.entityRidingOn;
    if (m) m.addEffect("speed", 40, { amplifier: 1, showParticles: false });
  }
  if (s.has("atrator_universal"))
    for (const e of j.dimension.getEntities({ type: "minecraft:item", location: j.location, maxDistance: 6 })) e.teleport(j.location);
  if (s.has("botas_raizes") && pe && /grass_block|moss_block|mycelium|podzol/.test(pe.typeId)) {
    const n = (contagem.get(j.id) ?? 0) + 1;
    contagem.set(j.id, n % 10);
    if (n >= 10) j.addEffect("saturation", 1, { amplifier: 0, showParticles: false }); // 1 de fome a cada 10 s
  }
  if (s.has("pantufas_gatinho")) {
    // Creepers e phantoms fogem: são empurrados para longe.
    for (const e of j.dimension.getEntities({ location: j.location, maxDistance: 7, families: ["creeper"] }).concat(j.dimension.getEntities({ location: j.location, maxDistance: 10, type: "minecraft:phantom" }))) {
      const v = { x: e.location.x - j.location.x, z: e.location.z - j.location.z };
      const n = Math.hypot(v.x, v.z) || 1;
      try {
        e.applyKnockback({ x: (v.x / n) * 0.8, z: (v.z / n) * 0.8 }, 0.25);
      } catch {
        // sem física
      }
    }
  }
}

type Mov = { pulo: boolean; extra: boolean; voo: number; carrega: number };
const mov = new Map<string, Mov>();
function aCada2(j: Player, s: Set<string>): void {
  const m = mov.get(j.id) ?? { pulo: false, extra: true, voo: 0, carrega: 0 };
  const v = j.getVelocity();
  const chao = j.isOnGround;
  const pulo = j.isJumping;
  if (chao) m.extra = true;
  if (s.has("nuvem_garrafa") && !chao && pulo && !m.pulo && m.extra && !j.isInWater) {
    // Pulo duplo (TC: 0,25 a mais correndo).
    m.extra = false;
    const k = j.isSprinting ? 1.25 : 1;
    j.applyKnockback({ x: v.x * k, z: v.z * k }, 0.55 + (j.isSprinting ? 0.1 : 0));
    j.playSound("mob.horse.breathe", { volume: 0.5 });
  }
  if (s.has("flamingo_helio")) {
    if (chao) {
      if (m.voo > 0 && !m.carrega) m.carrega = system.currentTick + 300; // recarrega em 15 s
      if (m.carrega && system.currentTick >= m.carrega) (m.voo = 0), (m.carrega = 0);
    } else if (pulo && m.voo < 160 && !m.carrega) {
      // "Nada" no ar por até 8 s.
      const d = j.getViewDirection();
      j.applyKnockback({ x: d.x * 0.45, z: d.z * 0.45 }, Math.max(0.05, d.y * 0.4 + 0.12));
      m.voo += 2;
    }
  }
  if (s.has("pantufas_coelho") && v.y < -0.6) j.addEffect("resistance", 6, { amplifier: 4, showParticles: false });
  if (naMao(j, "cl:guarda_chuva") && !chao && v.y < -0.15) j.addEffect("slow_falling", 6, { amplifier: 0, showParticles: false });
  if (s.has("tenis_aquatico") && j.isSprinting && !j.isInWater) {
    // Correndo sobre a água: o bloco de água embaixo e o da frente viram gelo que derrete.
    const d = j.getViewDirection();
    for (const k of [0, 1]) {
      try {
        const b = j.dimension.getBlock({ x: Math.floor(j.location.x + d.x * k), y: Math.floor(j.location.y - 0.5), z: Math.floor(j.location.z + d.z * k) });
        if (b?.typeId === "minecraft:water" && b.permutation.getState("liquid_depth" as never) === 0 && b.above()?.isAir) b.setType("minecraft:frosted_ice");
      } catch {
        // fora do mundo
      }
    }
  }
  if (s.has("sapatos_lavagante") && j.isSneaking) {
    // Agachado, fica em pé na lava (TC: como o lavagante).
    const b = emBaixo(j);
    if (b?.typeId === "minecraft:lava" && v.y < 0) j.applyKnockback({ x: v.x, z: v.z }, 0.05);
  }
  m.pulo = pulo;
  mov.set(j.id, m);
}

// ---------- Registro ----------
const ultimoDano = new Map<string, number>();
const perola = new Map<string, number>();
export function registrarArtefatos(): void {
  world.afterEvents.itemUse.subscribe(({ source: j, itemStack: i }) => {
    const id = i.typeId.startsWith("cl:") ? i.typeId.slice(3) : "";
    if (id === "estojo_artefatos" || (ESPACO[id] && j.isSneaking)) return abrirUmMenu(j, () => tela(j));
    if (ESPACO[id]) return system.run(() => equipar(j, id));
    if (id === "almofada_pum") return j.dimension.playSound("random.burp", j.location, { pitch: 0.5 });
    // Motor de Dobra: a pérola não gasta; custa 2 de fome.
    if (i.typeId === "minecraft:ender_pearl" && usa(j, "motor_dobra"))
      system.run(() => {
        const fome = j.getComponent("minecraft:player.hunger");
        if (fome && fome.currentValue >= 2) {
          fome.setCurrentValue(fome.currentValue - 2);
          j.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack("minecraft:ender_pearl", 1));
        }
      });
  });
  world.afterEvents.projectileHitBlock.subscribe(({ projectile, source }) => {
    if (source instanceof Player && projectile.typeId === "minecraft:ender_pearl") perola.set(source.id, system.currentTick);
  });
  world.afterEvents.playerSpawn.subscribe(({ player }) => cache.delete(player.id));
  world.afterEvents.playerLeave.subscribe(({ playerId }) => (cache.delete(playerId), mov.delete(playerId)));
  // Dano tomado: cancelar ou diminuir antes de acontecer.
  world.beforeEvents.entityHurt.subscribe(
    (ev) => {
      const j = ev.hurtEntity as Player;
      const s = tem(j);
      if (!s.size) return;
      const causa = ev.damageSource.cause;
      if (causa === EntityDamageCause.fall) {
        if (s.has("pantufas_coelho")) return void (ev.cancel = true); // sem dano de queda
        if (s.has("motor_dobra") && system.currentTick - (perola.get(j.id) ?? -99) <= 3) return void (ev.cancel = true);
        if (s.has("nuvem_garrafa")) ev.damage = Math.max(0, ev.damage - 3); // +3 blocos de queda segura
        if (ev.damage <= 0) return void (ev.cancel = true);
      }
      if (causa === EntityDamageCause.lightning && s.has("pingente_choque")) return void (ev.cancel = true);
      if (causa === EntityDamageCause.magma && s.has("sapatos_lavagante")) return void (ev.cancel = true);
      // Colar de Cruz: +20 ticks de invencibilidade (10 do jogo + 20).
      if (s.has("colar_cruz") && system.currentTick - (ultimoDano.get(j.id) ?? -99) < 30 && system.currentTick - (ultimoDano.get(j.id) ?? -99) >= 10) return void (ev.cancel = true);
      // Totem de Coro: o golpe fatal teleporta e cura 9.
      const vida = j.getComponent("minecraft:health");
      if (s.has("totem_coro") && vida && ev.damage >= vida.currentValue && pronto(j, "totem", 2400)) {
        ev.cancel = true;
        system.run(() => {
          const l = j.location;
          for (let t = 0; t < 16; t++) {
            const alvo = { x: l.x + (Math.random() - 0.5) * 16, y: l.y, z: l.z + (Math.random() - 0.5) * 16 };
            try {
              const b = j.dimension.getTopmostBlock({ x: alvo.x, z: alvo.z });
              if (!b || b.isLiquid || Math.abs(b.y - l.y) > 8) continue;
              j.teleport({ x: alvo.x, y: b.y + 1, z: alvo.z });
              break;
            } catch {
              // chunk descarregado
            }
          }
          j.getComponent("minecraft:health")?.setCurrentValue(Math.max(9, j.getComponent("minecraft:health")!.currentValue));
          j.playSound("mob.endermen.portal");
          aviso(j, "cl.art.totem", 3);
        });
        return;
      }
      ultimoDano.set(j.id, system.currentTick);
    },
    { entityFilter: { type: "minecraft:player" } },
  );
  // Efeitos ruins: o Frasco de Antídoto corta para 5 s.
  world.beforeEvents.effectAdd.subscribe((ev) => {
    if (ev.entity.typeId !== "minecraft:player" || ev.duration <= 100 || !RUINS.has(ev.effectType.replace("minecraft:", ""))) return;
    if (usa(ev.entity as Player, "frasco_antidoto")) ev.duration = 100;
  });
  // Depois do dano: os pingentes revidam; o colar dá velocidade; a caveira, resistência ao fogo.
  world.afterEvents.entityHurt.subscribe(({ hurtEntity, damageSource, damage }) => {
    const atk = damageSource.damagingEntity;
    // Golpe dado por quem tem artefato de mão.
    if (atk instanceof Player && damageSource.cause === EntityDamageCause.entityAttack && hurtEntity.isValid) {
      const s = tem(atk);
      if (s.size) {
        if (s.has("manopla_fogo")) hurtEntity.setOnFire(8, true);
        if (s.has("pistao_bolso")) {
          const v = { x: hurtEntity.location.x - atk.location.x, z: hurtEntity.location.z - atk.location.z };
          const n = Math.hypot(v.x, v.z) || 1;
          try {
            hurtEntity.applyKnockback({ x: (v.x / n) * 0.9, z: (v.z / n) * 0.9 }, 0.35);
          } catch {
            // sem física
          }
        }
        if (s.has("luva_vampirica")) {
          const h = atk.getComponent("minecraft:health");
          if (h) h.setCurrentValue(Math.min(h.effectiveMax, h.currentValue + Math.min(6, damage * 0.2)));
        }
        if (s.has("pulseira_murcha") && Math.random() < 0.3) hurtEntity.addEffect("wither", 160, { amplifier: 1 });
      }
    }
    if (!(hurtEntity instanceof Player)) return;
    const j = hurtEntity;
    const s = tem(j);
    if (!s.size) return;
    if (s.has("colar_panico")) j.addEffect("speed", 160, { amplifier: 0, showParticles: false });
    const fogo = [EntityDamageCause.fire, EntityDamageCause.fireTick, EntityDamageCause.lava, EntityDamageCause.magma, EntityDamageCause.campfire, EntityDamageCause.soulCampfire];
    if (s.has("caveira_obsidiana") && fogo.includes(damageSource.cause) && pronto(j, "caveira", 1200)) j.addEffect("fire_resistance", 600, { amplifier: 0 });
    if (!atk || atk.id === j.id || !atk.isValid) return;
    if (s.has("pingente_choque") && Math.random() < 0.25) {
      atk.applyDamage(5, { cause: EntityDamageCause.lightning });
      j.dimension.playSound("ambient.weather.thunder", atk.location, { volume: 0.4 });
    }
    if (s.has("pingente_chama") && Math.random() < 0.4) {
      atk.setOnFire(10, true);
      j.addEffect("fire_resistance", 200, { amplifier: 0, showParticles: false });
    }
    if (s.has("pingente_espinhos") && Math.random() < 0.5) atk.applyDamage(2 + Math.floor(Math.random() * 5), { cause: EntityDamageCause.magic, damagingEntity: j });
    if (s.has("cravos_firmes")) system.run(() => j.isValid && j.applyKnockback({ x: 0, z: 0 }, 0)); // sem empurrão
  });
  // Abates: Anzol Dourado (+50% de XP), Chapéu Supersticioso (Saque +1), Carne Infinita das vacas (1/500).
  world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    const j = damageSource.damagingEntity;
    const dim = deadEntity.dimension, onde = deadEntity.location;
    if (deadEntity.typeId === "minecraft:cow" && Math.random() < 1 / 500) dim.spawnItem(new ItemStack("cl:carne_infinita", 1), onde);
    if (deadEntity instanceof Player) return soltarAoMorrer(deadEntity);
    if (!(j instanceof Player)) return;
    const s = tem(j);
    if (!s.size) return;
    if (s.has("anzol_dourado") && deadEntity.matches({ families: ["mob"] })) for (let k = 0; k < 2; k++) dim.spawnEntity("minecraft:xp_orb", onde);
    if (s.has("chapeu_supersticioso"))
      system.runTimeout(() => {
        try {
          const itens = dim.getEntities({ type: "minecraft:item", location: onde, maxDistance: 2 });
          const um = itens[Math.floor(Math.random() * itens.length)];
          const it = um?.getComponent("minecraft:item")?.itemStack;
          if (it && Math.random() < 0.5) dim.spawnItem(new ItemStack(it.typeId, 1), onde);
        } catch {
          // descarregou
        }
      }, 2);
  });
  // Minérios: Cachecol da Sorte (Fortuna +1) e Aquecedor de Picareta (fundidos).
  world.afterEvents.playerBreakBlock.subscribe(({ player: j, block, brokenBlockPermutation }) => {
    const s = tem(j);
    if (!s.size) return;
    const id = brokenBlockPermutation.type.id;
    const extra = TINKERS.fortuna[id];
    if (extra && s.has("cachecol_sorte") && Math.random() < 1 / 3) block.dimension.spawnItem(new ItemStack(extra, 1), { x: block.x + 0.5, y: block.y + 0.5, z: block.z + 0.5 });
    if (s.has("aquecedor_picareta") && id.endsWith("_ore")) ajustarDrops(block.dimension, block.location, id, new Map([["autosmelt", 1]]), THERMAL.fornalha as Readonly<Record<string, string>>);
  });
  // Anel de Cebola: comer dá Pressa II (6 s por ponto de fome).
  world.afterEvents.itemCompleteUse.subscribe(({ source: j, itemStack: i }) => {
    if (!usa(j, "anel_cebola")) return;
    const fome = i.getComponent("minecraft:food")?.nutrition ?? 0;
    if (fome > 0) j.addEffect("haste", fome * 120, { amplifier: 1 });
  });
  system.runInterval(() => {
    for (const j of world.getPlayers()) {
      const s = tem(j);
      if (s.size)
        try {
          porSegundo(j, s);
        } catch {
          // jogador saindo
        }
    }
  }, 20);
  system.runInterval(() => {
    for (const j of world.getPlayers()) {
      const s = tem(j);
      if ((s.size && MOVIMENTO.some((x) => s.has(x))) || naMao(j, "cl:guarda_chuva"))
        try {
          aCada2(j, s);
        } catch {
          // jogador saindo
        }
    }
  }, 2);
  // Guarda-chuva na mão secundária, agachado: escudo.
  system.runInterval(() => {
    for (const j of world.getPlayers())
      if (j.isSneaking && j.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Offhand)?.typeId === "cl:guarda_chuva")
        j.addEffect("resistance", 30, { amplifier: 1, showParticles: false });
  }, 20);
  // Teste no servidor (o jogador simulado não usa o item fora do slot): scriptevent cl:teste_artefato <id>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_artefato" || !(j instanceof Player)) return;
    if (message === "lista") return console.warn(`[teste_artefato] ${JSON.stringify(lerEquip(j))}`);
    equipar(j, message);
  });
}

/** Morrer solta os artefatos (como o Curios), a não ser com "manter inventário". */
function soltarAoMorrer(j: Player): void {
  if (world.gameRules.keepInventory) return;
  const e = lerEquip(j);
  const ids = Object.values(e).filter((x): x is string => !!x);
  if (!ids.length) return;
  for (const id of ids) j.dimension.spawnItem(new ItemStack(cl(id), 1), j.location);
  gravarEquip(j, {});
}

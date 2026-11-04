import { EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { DADOS_F52 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { cargaItem, definirCarga, registrarItemComEnergia } from "../maquinas/enderio9.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * 1.33.0: Iron Jetpacks 26.1 (os números do ModJetpacks.java). Vestido no peito: segure o pulo para subir (acelera até
 * a velocidade do tier; correndo, mais rápido e gasta mais); no ar, sem pular, ele paira (desce devagar; agachado,
 * desce mais rápido). Agache duas vezes no ar para ligar/desligar o pairar. Gasta RF por tick enquanto empurra;
 * carrega nos Carregadores do Ender IO. Para o celular: o laço de todo tick só roda para quem tem jetpack vestido
 * (a lista é refeita a cada segundo) e a carga só é gravada no item uma vez por segundo.
 */
type Tier = { tier: number; cap: number; gasto: number; sobe: number; acel: number; lado: number; ps: number; pd: number; pv: number; corr: number; corrSobe: number; corrGasto: number };
const TIERS = DADOS_F52.jetpacks as unknown as Readonly<Record<string, Tier>>;
const CRIATIVO = "cl:jetpack_criativo";
type Estado = { id: string; rf: number; mudou: boolean; usou: number; pairar: boolean; agachou: boolean; ultimoAgacha: number };
const voando = new Map<string, Estado>();
const forcado = new Map<string, number>(); // teste: "pulo" segurado até este tick

function peito(j: Player): ItemStack | undefined {
  return j.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Chest);
}
function gravar(j: Player, e: Estado): void {
  if (!e.mudou || e.id === CRIATIVO) return;
  const i = peito(j);
  if (i?.typeId !== e.id) return;
  definirCarga(i, e.rf);
  j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Chest, i);
  e.mudou = false;
}

function tick(j: Player, e: Estado): void {
  const t = TIERS[e.id];
  if (!t) return;
  const criativo = e.id === CRIATIVO || j.getGameMode() === GameMode.Creative;
  const v = j.getVelocity();
  const pulo = j.isJumping || (forcado.get(j.id) ?? 0) > system.currentTick;
  const chao = j.isOnGround;
  // Agachar duas vezes no ar troca o pairar.
  if (j.isSneaking && !e.agachou && !chao) {
    if (system.currentTick - e.ultimoAgacha <= 8) {
      e.pairar = !e.pairar;
      aviso(j, e.pairar ? "cl.jet.pairar_on" : "cl.jet.pairar_off", 2);
    }
    e.ultimoAgacha = system.currentTick;
  }
  e.agachou = j.isSneaking;
  if (!pulo && (chao || !e.pairar)) return;
  if (!criativo && e.rf <= 0) {
    if (pulo && system.currentTick % 40 === 0) aviso(j, "cl.jet.sem_energia", 2);
    return;
  }
  const correndo = j.isSprinting;
  let vy: number;
  if (pulo) vy = Math.min(v.y + t.acel, t.sobe * (correndo ? t.corrSobe : 1));
  else vy = j.isSneaking ? -t.pd : -t.pv;
  // De lado: soma a velocidade do tier na direção em que já anda.
  const h = Math.hypot(v.x, v.z);
  const k = h > 0.03 ? 1 + (t.lado * (correndo ? t.corr : 1)) / Math.max(h, 0.15) : 1;
  try {
    j.applyKnockback({ x: v.x * Math.min(k, 2.5), z: v.z * Math.min(k, 2.5) }, vy);
  } catch {
    return;
  }
  e.usou = system.currentTick;
  if (!criativo) {
    e.rf = Math.max(0, e.rf - Math.round(t.gasto * (correndo && pulo ? t.corrGasto : 1)));
    e.mudou = true;
  }
}

export function registrarJetpacks(): void {
  for (const [id, t] of Object.entries(TIERS)) if (t.cap > 0) registrarItemComEnergia(id, t.cap);
  // A cada segundo: quem está de jetpack (e grava a carga no item).
  system.runInterval(() => {
    for (const j of world.getPlayers()) {
      const i = peito(j);
      const e = voando.get(j.id);
      if (!i || !TIERS[i.typeId]) {
        if (e) voando.delete(j.id);
        continue;
      }
      if (!e || e.id !== i.typeId) {
        voando.set(j.id, { id: i.typeId, rf: cargaItem(i), mudou: false, usou: 0, pairar: e?.pairar ?? true, agachou: false, ultimoAgacha: -99 });
        continue;
      }
      if (!e.mudou && e.id !== CRIATIVO) e.rf = cargaItem(i); // carregou no carregador
      gravar(j, e);
      if (system.currentTick - e.usou < 25 && !j.isOnGround) registrarAcao(j, "ij_voar");
    }
  }, 20);
  system.runInterval(() => {
    if (!voando.size) return;
    for (const j of world.getPlayers()) {
      const e = voando.get(j.id);
      if (e)
        try {
          tick(j, e);
        } catch {
          // jogador saindo
        }
    }
  }, 1);
  // Pousar depois de voar não machuca.
  world.beforeEvents.entityHurt.subscribe(
    (ev) => {
      if (ev.damageSource.cause !== EntityDamageCause.fall) return;
      const e = voando.get(ev.hurtEntity.id);
      if (e && system.currentTick - e.usou < 60) ev.cancel = true;
    },
    { entityFilter: { type: "minecraft:player" } },
  );
  world.afterEvents.playerLeave.subscribe(({ playerId }) => voando.delete(playerId));
  // Teste no servidor: scriptevent cl:teste_jetpack <carregar|voar N|carga>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_jetpack" || !(j instanceof Player)) return;
    const [acao, n] = message.split(" ");
    const i = peito(j);
    if (acao === "carregar" && i && TIERS[i.typeId]) {
      definirCarga(i, TIERS[i.typeId].cap);
      j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Chest, i);
      voando.delete(j.id);
    }
    if (acao === "voar") forcado.set(j.id, system.currentTick + Number(n ?? 20));
    console.warn(`[teste_jetpack] ${i?.typeId} rf=${i ? cargaItem(i) : 0} estado=${JSON.stringify(voando.get(j.id) ?? null)}`);
  });
}

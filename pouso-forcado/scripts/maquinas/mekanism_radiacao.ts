import { Dimension, EntityDamageCause, EquipmentSlot, Player, system, Vector3, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravarGrande, lerGrande } from "../util/dados.js";

/*
 * Radiação do Mekanism (1.52.0), com as escalas do mod (RadiationManager): o nível do lugar em Sv/h, por chunk, e a dose de
 * cada jogador em Sv. Soltar químico radioativo no mundo (máquina ou reator quebrado, derretimento) põe mB × radioatividade
 * Sv/h no chunk. Quem está no chunk recebe o nível por hora (1 s de jogo = 1 s); a roupa Hazmat corta 25% por peça.
 * O nível e a dose decaem 1% por segundo (0,9995 por tique no mod). Efeitos: a partir de 1 Sv, fome e fraqueza; a partir de
 * 3 Sv, náusea; a partir de 10 Sv, dano. Contador Geiger mostra o nível; Dosímetro mostra a dose.
 */
export const RADIOATIVO: Readonly<Record<string, number>> = {
  nuclear_waste: 0.01, spent_nuclear_waste: 0.01, plutonium: 0.02, polonium: 0.05, uranium_hexafluoride: 0.001, fissile_fuel: 0.001,
};
const PROP = "cl:mk_rad";
const BASE = 0.0000001; // 100 nSv/h
let niveis: Record<string, number> | undefined;
const mapa = (): Record<string, number> => {
  if (!niveis) {
    niveis = lerGrande<Record<string, number>>(PROP, {});
  }
  return niveis;
};
const chunk = (dim: Dimension | string, p: Vector3) => `${typeof dim === "string" ? dim : dim.id}|${Math.floor(p.x / 16)},${Math.floor(p.z / 16)}`;
let mudou = false;

/** Solta radiação no chunk (Sv/h). */
export function radiar(dim: Dimension, p: Vector3, svh: number): void {
  if (svh <= 0) return;
  const k = chunk(dim, p);
  mapa()[k] = (mapa()[k] ?? 0) + svh;
  mudou = true;
}
/** Solta o que tiver de radioativo numa lista de químicos (q → mB). */
export function soltarQuimicos(dim: Dimension, p: Vector3, t: Readonly<Record<string, number>>, mult = 1): void {
  let sv = 0;
  for (const [q, mb] of Object.entries(t)) sv += (RADIOATIVO[q] ?? 0) * mb;
  radiar(dim, p, sv * mult);
}
export const nivelEm = (dim: Dimension, p: Vector3): number => Math.max(BASE, mapa()[chunk(dim, p)] ?? 0);

const DOSE = "cl:mk_dose";
export const doseDe = (j: Player): number => (j.getDynamicProperty(DOSE) as number | undefined) ?? 0;
export function formatarSv(v: number): string {
  if (v >= 1) return `${v.toFixed(2)} Sv`;
  if (v >= 0.001) return `${(v * 1000).toFixed(2)} mSv`;
  if (v >= 0.000001) return `${(v * 1e6).toFixed(2)} μSv`;
  return `${Math.round(v * 1e9)} nSv`;
}
const HAZMAT = ["cl:mascara_hazmat", "cl:jaleco_hazmat", "cl:calca_hazmat", "cl:botas_hazmat"];
// A parte 5 (MekaSuit com o módulo de blindagem) soma aqui.
const protecaoExtra: Array<(j: Player) => number> = [];
export function registrarProtecao(fn: (j: Player) => number): void {
  protecaoExtra.push(fn);
}
function protecao(j: Player): number {
  const eq = j.getComponent("minecraft:equippable");
  let p = 0;
  for (const slot of [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet]) if (HAZMAT.includes(eq?.getEquipment(slot)?.typeId ?? "")) p += 0.25;
  for (const f of protecaoExtra) p += f(j);
  return Math.min(1, p);
}

export function registrarRadiacao(): void {
  let passo = 0;
  system.runInterval(() => {
    passo++;
    // Decaimento do lugar (1% por segundo) e limpeza do que voltou ao normal.
    const m = mapa();
    for (const k of Object.keys(m)) {
      m[k] *= 0.99;
      if (m[k] < 0.00001) delete m[k];
      mudou = true;
    }
    for (const j of world.getAllPlayers()) {
      const prot = protecao(j);
      if (prot >= 1 && passo % 5 === 0) registrarAcao(j, "mk_hazmat");
      const nivel = nivelEm(j.dimension, j.location);
      let dose = doseDe(j) * 0.99 + (nivel > 0.00001 ? (nivel * (1 - prot)) / 3600 : 0);
      if (dose < 0.0000001) dose = 0;
      j.setDynamicProperty(DOSE, dose || undefined);
      if (nivel > 0.1 && prot < 1 && passo % 10 === 0) aviso(j, "cl.mkn.radiacao.alta", 3);
      if (passo % 5 !== 0) continue;
      if (dose >= 1) {
        j.addEffect("hunger", 120, { amplifier: 0, showParticles: false });
        j.addEffect("weakness", 120, { amplifier: dose >= 3 ? 1 : 0, showParticles: false });
        if (passo % 30 === 0) aviso(j, { translate: "cl.mkn.radiacao.doente", with: [formatarSv(dose)] }, 4);
      }
      if (dose >= 3) j.addEffect("nausea", 200, { amplifier: 0, showParticles: false });
      if (dose >= 10) j.applyDamage(Math.min(8, Math.floor(dose / 5)), { cause: EntityDamageCause.magic });
    }
    if (mudou && passo % 10 === 0) {
      mudou = false;
      gravarGrande(PROP, mapa());
    }
  }, 20);
  // Contador Geiger e Dosímetro.
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    if (i.typeId === "cl:contador_geiger") {
      const n = nivelEm(j.dimension, j.location);
      aviso(j, { translate: "cl.mkn.geiger", with: [`${formatarSv(n)}/h`] }, 4);
      j.playSound(n > 0.001 ? "random.click" : "random.pop", { volume: 0.5 });
    } else if (i.typeId === "cl:dosimetro") aviso(j, { translate: "cl.mkn.dosimetro", with: [formatarSv(doseDe(j))] }, 4);
  });
  // Teste: scriptevent cl:teste_rad <svh> (solta no chunk do jogador e mostra nível e dose).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_rad" || !(j instanceof Player)) return;
    const v = Number(message);
    if (v > 0) radiar(j.dimension, j.location, v);
    console.warn(`[teste_rad] nivel=${nivelEm(j.dimension, j.location)} dose=${doseDe(j)} prot=${protecao(j)}`);
  });
}

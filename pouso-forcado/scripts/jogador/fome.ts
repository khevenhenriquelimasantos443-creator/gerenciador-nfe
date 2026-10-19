import { Difficulty, Entity, GameMode, Player, system, world } from "@minecraft/server";
import { FOME, PROPS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { intervalo } from "../util/perfil.js";

/*
 * Hunger Overhaul (iguanaman), com os valores padrão da versão do Crash Landing:
 * - comida do jogo vale como no HO (FOME.comidas; crua 1 / 0,05): ao terminar de comer, a fome e a
 *   saturação ficam "antes + valor do HO" no lugar do valor do jogo; não dá para comer com o efeito Fome;
 * - "Bem Alimentado": comer dá (fome×100)^1,2 ticks (se ≥ 30) que somam; regenera 25% mais rápido;
 * - regeneração própria (a do jogo é desligada): só com fome ≥ 7, sem gastar fome, 1 de vida a cada
 *   80 × dif × bem alimentado × (1 + vida faltando × 0,05 × dif)^1,5 ticks; levar dano zera o contador;
 * - gasto constante de 0,02 de exaustão por segundo; ao renascer, fome 16 (Normal) ou 12 (Difícil);
 * - efeitos com pouca fome ou pouca vida (lentidão, fadiga, fraqueza, náusea), mais fortes no Difícil;
 * - animais: cruzar 4× mais devagar (20 min), ovos 4× mais raros, a vaca só dá leite a cada 20 min.
 * Custo: um laço de 1 s por jogador (fome, vida e efeitos) e eventos ao comer e ao usar itens em animais.
 */

const dificuldade = (): "facil" | "normal" | "dificil" => {
  const d = world.getDifficulty();
  return d === Difficulty.Hard ? "dificil" : d === Difficulty.Easy || d === Difficulty.Peaceful ? "facil" : "normal";
};

const fomeDe = (j: Player) => j.getComponent("minecraft:player.hunger");
const saturacaoDe = (j: Player) => j.getComponent("minecraft:player.saturation");

/** Rótulo de fome/vida para o painel ("Faminto", "Ferido"...), como o HUD do HO. */
export function rotuloFome(j: Player): string | undefined {
  const fome = fomeDe(j)?.currentValue ?? 20;
  const vida = j.getComponent("minecraft:health");
  const pv = vida ? vida.currentValue / vida.effectiveMax : 1;
  if (pv <= 0.15) return "cl.fome.morrendo";
  if (fome <= 6) return "cl.fome.faminto";
  if (pv <= 0.3) return "cl.fome.machucado";
  if (fome <= 10) return "cl.fome.com_fome";
  if (pv < 0.5) return "cl.fome.ferido";
  return undefined;
}

// ---------- comer ----------
const antesDeComer = new Map<string, { fome: number; sat: number }>();

function aplicarValorDoHO(j: Player, id: string): void {
  const v = FOME.comidas[id];
  const antes = antesDeComer.get(j.id);
  antesDeComer.delete(j.id);
  if (!v || !antes) return;
  const [n, mod] = v;
  const fome = fomeDe(j), sat = saturacaoDe(j);
  if (!fome || !sat) return;
  const novaFome = Math.min(fome.effectiveMax, antes.fome + n);
  fome.setCurrentValue(novaFome);
  sat.setCurrentValue(Math.min(novaFome, antes.sat + n * mod * 2));
  const ef = FOME.efeitos[id];
  if (ef && Math.random() < ef.chance) j.addEffect(ef.id, ef.segundos * 20, { amplifier: ef.nivel ?? 0 });
  // Bem Alimentado: (fome × 100)^1,2 ticks, só se der ≥ 30; soma com o que já tinha.
  const ticks = Math.round((n * 100) ** 1.2);
  if (ticks >= 30) {
    const ate = Math.max(system.currentTick, (j.getDynamicProperty(PROPS.bemAlimentado) as number | undefined) ?? 0) + ticks;
    j.setDynamicProperty(PROPS.bemAlimentado, ate);
    registrarAcao(j, "bem_alimentado");
  }
}

// ---------- regeneração e efeitos ----------
const contadorRegen = new Map<string, number>();

function regenerar(j: Player): void {
  const vida = j.getComponent("minecraft:health");
  const fome = fomeDe(j)?.currentValue ?? 0;
  if (!vida || vida.currentValue >= vida.effectiveMax || fome < FOME.regenFomeMin) {
    contadorRegen.set(j.id, 0);
    return;
  }
  const dif = FOME.dificuldade[dificuldade()];
  const bem = ((j.getDynamicProperty(PROPS.bemAlimentado) as number | undefined) ?? 0) > system.currentTick ? FOME.bemAlimentadoMult : 1;
  const faltando = vida.effectiveMax - vida.currentValue;
  const precisa = FOME.regenBase * dif * bem * (1 + faltando * 0.05 * dif) ** 1.5;
  const t = (contadorRegen.get(j.id) ?? 0) + 20;
  if (t < precisa) return void contadorRegen.set(j.id, t);
  contadorRegen.set(j.id, 0);
  vida.setCurrentValue(Math.min(vida.effectiveMax, vida.currentValue + 1));
}

function efeitosDeStatusBaixo(j: Player): void {
  const fome = fomeDe(j)?.currentValue ?? 20;
  const vida = j.getComponent("minecraft:health");
  const pv = vida ? vida.currentValue / vida.effectiveMax : 1;
  const m = FOME.modificador[dificuldade()];
  const ef = (id: string, nivel: number) => j.addEffect(id, 30, { amplifier: nivel, showParticles: false });
  if (fome <= 1 || pv <= 0.05) {
    ef("slowness", 1 + m);
    ef("mining_fatigue", 3);
    if (m >= 1) ef("weakness", m - 1);
    ef("nausea", 0);
  } else if (fome <= 2 || pv <= 0.1) {
    ef("slowness", 2);
    ef("mining_fatigue", 2);
    if (m >= 2) ef("weakness", 0);
  } else if (fome <= 3 || pv <= 0.15) {
    ef("slowness", 1);
    ef("mining_fatigue", 1);
    if (m >= 3) ef("weakness", 0);
  } else if (fome <= 4 || pv <= 0.2) {
    if (m >= 2) ef("slowness", 0);
    ef("mining_fatigue", 0);
  } else if ((fome <= 5 || pv <= 0.25) && m >= 3) ef("slowness", 0);
}

// ---------- animais ----------
function tempoDesde(e: Entity, chave: string): number {
  const v = e.getDynamicProperty(chave);
  return typeof v === "number" ? system.currentTick - v : Infinity;
}

export function registrarFome(): void {
  // Regeneração natural do jogo desligada (a do HO entra no lugar). Feito uma vez por mundo.
  system.run(() => {
    if (world.getDynamicProperty(PROPS.regraRegen)) return;
    world.gameRules.naturalRegeneration = false;
    world.setDynamicProperty(PROPS.regraRegen, true);
  });

  world.afterEvents.itemStartUse.subscribe(({ itemStack, source }) => {
    if (!itemStack || !FOME.comidas[itemStack.typeId]) return;
    antesDeComer.set(source.id, { fome: fomeDe(source)?.currentValue ?? 20, sat: saturacaoDe(source)?.currentValue ?? 0 });
  });
  // No tick seguinte, para garantir que o jogo já somou o valor dele (o HO troca pelo dele).
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    const id = itemStack.typeId;
    system.run(() => source.isValid && aplicarValorDoHO(source, id));
  });
  // Com o efeito Fome não dá para comer (HO).
  world.beforeEvents.itemUse.subscribe((ev) => {
    if (FOME.comidas[ev.itemStack.typeId] && ev.source.getEffect("hunger")) ev.cancel = true;
  });

  world.afterEvents.entityHurt.subscribe(({ hurtEntity }) => {
    if (hurtEntity.typeId === "minecraft:player") contadorRegen.set(hurtEntity.id, 0);
  });

  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) return;
    system.runTimeout(() => fomeDe(player)?.setCurrentValue(FOME.renascer[dificuldade()]), 2);
  });

  intervalo("fome", () => {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    for (const j of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      const ex = j.getComponent("minecraft:player.exhaustion");
      if (ex) ex.setCurrentValue(Math.min(ex.effectiveMax, ex.currentValue + FOME.exaustaoPorSegundo));
      regenerar(j);
      efeitosDeStatusBaixo(j);
    }
  }, 20);

  // Cruzar 4× mais devagar e leite a cada 20 min.
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const { target, itemStack } = ev;
    const item = itemStack?.typeId ?? "";
    if (target.typeId === "minecraft:cow" && item === "minecraft:bucket") {
      if (tempoDesde(target, "cl:ordenha") < FOME.leiteTicks) {
        ev.cancel = true;
        system.run(() => ev.player.sendMessage({ translate: "cl.fome.vaca_sem_leite" }));
      } else system.run(() => target.isValid && target.setDynamicProperty("cl:ordenha", system.currentTick));
      return;
    }
    if (!FOME.comidaDeCruza[target.typeId]?.includes(item) || target.getComponent("minecraft:is_baby")) return;
    if (tempoDesde(target, "cl:cruzou") < FOME.cruzaTicks) {
      ev.cancel = true;
      return;
    }
    system.run(() => target.isValid && target.setDynamicProperty("cl:cruzou", system.currentTick));
  });

  // Ovos 4× mais raros: ovo que aparece colado numa galinha some 3 vezes em 4.
  world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (entity.typeId !== "minecraft:item") return;
    try {
      if (entity.getComponent("minecraft:item")?.itemStack.typeId !== "minecraft:egg") return;
      const galinha = entity.dimension.getEntities({ type: "minecraft:chicken", location: entity.location, maxDistance: 1.2 }).length > 0;
      if (galinha && Math.random() >= FOME.chanceOvo) entity.remove();
    } catch {
      // entidade já sumiu
    }
  });
}

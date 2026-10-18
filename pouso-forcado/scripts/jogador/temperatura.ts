import { BlockVolume, Difficulty, EntityDamageCause, EquipmentSlot, GameMode, Player, system, world } from "@minecraft/server";
import { MUNDO_PLANO, PROPS, TEMPERATURA } from "../config.js";

/*
 * Temperatura do corpo: deserto é forno de dia e geladeira à noite.
 * A cada segundo calcula o alvo (ambiente) e o corpo anda 1 ponto até ele a cada
 * TEMPERATURA.segundosPorPonto:
 * - sol aberto queima (pico ao meio-dia); noite ao relento congela;
 * - sombra/abrigo (tem bloco acima da cabeça) amortece os dois; subsolo é fresco;
 * - fogo por perto (fogueira, fogo, lava, magma, fornalha acesa) esquenta; água esfria;
 * - correr esquenta; capacete protege do sol; roupas de couro protegem do frio;
 * - beber água esfria na hora (aguas.ts).
 * Efeitos: quente → sede 2× mais rápida (sede.ts); frio → lentidão;
 * extremos (TEMPERATURA.danoAcima/danoAbaixo) → dano.
 * Custo: por jogador por segundo, 1 getTopmostBlock e 1 containsBlock (busca de fogo).
 */
const contador = new Map<string, number>();
const FONTES_CALOR = ["minecraft:campfire", "minecraft:fire", "minecraft:lava", "minecraft:magma", "minecraft:lit_furnace", "minecraft:lit_blast_furnace", "minecraft:lit_smoker"];
const COURO = ["minecraft:leather_helmet", "minecraft:leather_chestplate", "minecraft:leather_leggings", "minecraft:leather_boots"];

export function lerTemperatura(jogador: Player): number {
  const v = jogador.getDynamicProperty(PROPS.temperatura);
  return typeof v === "number" ? v : 0;
}

export const celsius = (t: number): number => 36.5 + t * 0.3;

export function mudarTemperatura(jogador: Player, delta: number): void {
  const t = Math.max(TEMPERATURA.min, Math.min(TEMPERATURA.max, lerTemperatura(jogador) + delta));
  jogador.setDynamicProperty(PROPS.temperatura, t);
}

/** Força do sol (0 a 1, pico ao meio-dia) e da noite (0 a 1). */
function ceu(): { sol: number; noite: number } {
  const t = world.getTimeOfDay();
  const sol = t < 12000 ? Math.sin((Math.PI * t) / 12000) : 0;
  const noite = t >= 13000 && t <= 23000 ? Math.min(1, (t - 13000) / 1000, (23000 - t) / 1000) : 0;
  return { sol, noite };
}

function alvo(jogador: Player): number {
  const { x, y, z } = jogador.location;
  const dim = jogador.dimension;
  const { sol, noite } = ceu();
  const topo = dim.getTopmostBlock({ x, z });
  const aoCeu = !topo || topo.y < Math.floor(y + 1);
  const T = TEMPERATURA;
  let a: number;
  if (aoCeu) a = T.solAberto * sol + T.noiteAberta * noite;
  else if (y < MUNDO_PLANO.superficieY - 4) a = T.subsolo;
  else a = T.solSombra * sol + T.noiteAbrigo * noite;

  const perto = new BlockVolume({ x: x - 3, y: y - 2, z: z - 3 }, { x: x + 3, y: y + 2, z: z + 3 });
  if (dim.containsBlock(perto, { includeTypes: FONTES_CALOR })) a += T.fogo;
  if (jogador.isInWater) a += T.agua;
  if (jogador.isSprinting) a += T.correndo;

  const roupa = jogador.getComponent("minecraft:equippable");
  if (a > 0 && roupa?.getEquipment(EquipmentSlot.Head)) a = Math.max(0, a + T.capacete);
  if (a < 0 && roupa) {
    const couro = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet].filter((s) =>
      COURO.includes(roupa.getEquipment(s)?.typeId ?? ""),
    ).length;
    a *= 1 - T.couroPorPeca * couro;
  }
  return Math.max(T.min, Math.min(T.max, a));
}

export function registrarTemperatura(): void {
  system.runInterval(() => {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    for (const jogador of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      const s = (contador.get(jogador.id) ?? 0) + 1;
      contador.set(jogador.id, s);
      let t = lerTemperatura(jogador);
      if (s % TEMPERATURA.segundosPorPonto === 0) {
        try {
          const a = alvo(jogador);
          if (Math.abs(a - t) >= 1) mudarTemperatura(jogador, a > t ? 1 : -1);
          t = lerTemperatura(jogador);
        } catch {
          // chunk em volta ainda carregando
        }
      }
      if (t <= TEMPERATURA.frio) jogador.addEffect("slowness", 40, { amplifier: 0, showParticles: false });
      if (s % TEMPERATURA.danoACadaSegundos === 0 && (t >= TEMPERATURA.danoAcima || t <= TEMPERATURA.danoAbaixo)) {
        jogador.applyDamage(1, { cause: EntityDamageCause.temperature });
        jogador.sendMessage({ translate: t > 0 ? "cl.temp.insolacao" : "cl.temp.hipotermia" });
      }
    }
  }, 20);

  // Renascer volta ao normal. (Beber água esfria: aguas.ts.)
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) player.setDynamicProperty(PROPS.temperatura, 0);
  });
}

/** Calor faz a sede cair mais rápido (usado por sede.ts). */
export const multiplicadorSede = (jogador: Player): number => (lerTemperatura(jogador) >= TEMPERATURA.quente ? 2 : 1);

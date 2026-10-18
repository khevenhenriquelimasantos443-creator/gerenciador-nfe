import { Difficulty, GameMode, Player, system, world } from "@minecraft/server";
import { HORDA } from "../config.js";

/*
 * Reforço noturno: além do spawn normal (já reforçado em BP/spawn_rules),
 * a cada HORDA.intervaloTicks, à noite, nasce um pequeno grupo de monstros
 * perto de cada jogador que estiver com poucos monstros em volta.
 * Custo: uma contagem de entidades por jogador a cada 10 s, e só à noite.
 */
const NOITE_INICIO = 13000;
const NOITE_FIM = 23000;

function ehNoite(): boolean {
  const t = world.getTimeOfDay();
  return t >= NOITE_INICIO && t <= NOITE_FIM;
}

function tentarNascer(jogador: Player): void {
  const dimensao = jogador.dimension;
  const angulo = Math.random() * Math.PI * 2;
  const distancia = HORDA.distanciaMin + Math.random() * (HORDA.distanciaMax - HORDA.distanciaMin);
  const x = Math.floor(jogador.location.x + Math.cos(angulo) * distancia);
  const z = Math.floor(jogador.location.z + Math.sin(angulo) * distancia);
  if (!dimensao.isChunkLoaded({ x, y: jogador.location.y, z })) return;

  const chao = dimensao.getTopmostBlock({ x, z });
  if (!chao || chao.isLiquid || chao.isAir) return;
  const acima = chao.above();
  if (!acima?.isAir || !acima.above()?.isAir) return;

  const mob = HORDA.mobs[Math.floor(Math.random() * HORDA.mobs.length)];
  dimensao.spawnEntity(mob, { x: x + 0.5, y: acima.y, z: z + 0.5 });
}

export function registrarHordaNoturna(): void {
  system.runInterval(() => {
    if (world.getDifficulty() === Difficulty.Peaceful || !ehNoite()) return;
    for (const jogador of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      const perto = jogador.dimension.getEntities({
        location: jogador.location,
        maxDistance: HORDA.raioContagem,
        families: ["monster"],
      }).length;
      if (perto >= HORDA.limitePerto) continue;
      for (let i = 0; i < HORDA.porVez; i++) {
        try {
          tentarNascer(jogador);
        } catch {
          // posição inválida no limite do mundo carregado: tenta de novo no próximo ciclo
        }
      }
    }
  }, HORDA.intervaloTicks);
}

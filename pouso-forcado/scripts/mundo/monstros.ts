import { GameMode, ItemStack, Player, world } from "@minecraft/server";
import { GOLEM_AREIA, MONSTROS_CL } from "../config.js";
import { avisarErro } from "../util/erros.js";
import { tempestadeAtiva } from "./tempestade.js";
import { intervalo } from "../util/perfil.js";

/*
 * Golem de Areia: nasce perto de quem está ao ar livre durante a tempestade de areia
 * (GOLEM_AREIA.chancePorCiclo a cada 2 s, no máximo GOLEM_AREIA.maxPerto por perto) e desmorona
 * em areia quando a tempestade acaba. O sol não o queima (família cl_resiste_sol).
 * A múmia e o escorpião nascem sozinhos à noite (BP/spawn_rules) e entram na horda e nos
 * Geradores de Monstros (listas em config.ts).
 * Custo: a cada 2 s, uma busca de golens por jogador durante a tempestade; fora dela, uma busca
 * de golens no Overworld.
 */
function aoCeu(jogador: Player): boolean {
  const { x, y, z } = jogador.location;
  const topo = jogador.dimension.getTopmostBlock({ x, z });
  return !topo || topo.y < Math.floor(y + 1);
}

function nascerGolem(jogador: Player): void {
  const dimensao = jogador.dimension;
  for (let tentativa = 0; tentativa < 4; tentativa++) {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = GOLEM_AREIA.distanciaMin + Math.random() * (GOLEM_AREIA.distanciaMax - GOLEM_AREIA.distanciaMin);
    const x = Math.floor(jogador.location.x + Math.cos(angulo) * distancia);
    const z = Math.floor(jogador.location.z + Math.sin(angulo) * distancia);
    if (!dimensao.isChunkLoaded({ x, y: jogador.location.y, z })) continue;
    const chao = dimensao.getTopmostBlock({ x, z });
    if (!chao || chao.isLiquid || chao.isAir) continue;
    const pe = chao.above();
    if (!pe?.isAir || !pe.above()?.isAir || !pe.above(2)?.isAir) continue; // ele tem 3 blocos de altura
    const local = { x: x + 0.5, y: pe.y, z: z + 0.5 };
    dimensao.spawnEntity(MONSTROS_CL.golem, local);
    try {
      dimensao.spawnParticle("minecraft:large_explosion", { x: local.x, y: local.y + 1, z: local.z });
    } catch {
      // enfeite
    }
    return;
  }
}

function desmoronarGolens(): void {
  const dimensao = world.getDimension("minecraft:overworld");
  for (const golem of dimensao.getEntities({ type: MONSTROS_CL.golem })) {
    try {
      const local = golem.location;
      const [min, max] = GOLEM_AREIA.areiaAoDesmoronar;
      dimensao.spawnItem(new ItemStack("minecraft:sand", min + Math.floor(Math.random() * (max - min + 1))), local);
      dimensao.spawnParticle("minecraft:large_explosion", { x: local.x, y: local.y + 1, z: local.z });
      golem.remove();
    } catch {
      // golem no limite do mundo carregado
    }
  }
}

export function registrarMonstros(): void {
  intervalo("monstros", () => {
    if (!tempestadeAtiva()) {
      desmoronarGolens();
      return;
    }
    for (const jogador of world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
      if (jogador.dimension.id !== "minecraft:overworld" || !aoCeu(jogador)) continue;
      if (Math.random() >= GOLEM_AREIA.chancePorCiclo) continue;
      const perto = jogador.dimension.getEntities({ type: MONSTROS_CL.golem, location: jogador.location, maxDistance: 48 }).length;
      try {
        if (perto < GOLEM_AREIA.maxPerto) nascerGolem(jogador);
      } catch (erro) {
        avisarErro("golem não nasceu", erro);
      }
    }
  }, 40);
}

import { Difficulty, Entity, EntityInitializationCause, GameMode, Player, system, world } from "@minecraft/server";
import { FAMILIA_RESISTE_SOL, HORDA, MUNDO_PLANO, PROPS } from "../config.js";
import { DO_ADDON } from "../util/nascer.js";
import { intervalo } from "../util/perfil.js";

/*
 * Noite e dia no deserto:
 * - À noite, a cada HORDA.intervaloTicks nascem monstros extras perto de cada jogador
 *   (se houver menos de HORDA.limitePerto em volta).
 * - A horda vem só a cada HORDA.onda.aCadaDias noites (a 10ª, a 20ª...), com aviso no fim da tarde.
 *   Nessa noite, em cada hora de HORDA.onda.horas chega uma onda: aviso na tela, corneta e
 *   monstros em volta de cada jogador, mais a cada dia que passa.
 * - De dia (manhã e tarde), nenhum monstro na superfície (1.3.7): os que sobraram da noite se enterram
 *   na areia (somem numa nuvem de areia, sem fogo) e o que nascer some na hora, até à sombra. Ficam os
 *   postos pelo add-on (marca DO_ADDON) e o Golem de Areia da tempestade (família cl_resiste_sol).
 *   Nas cavernas, abaixo da superfície, segue como no jogo. Animais não nascem sozinhos (BP/spawn_rules):
 *   só das cápsulas e das crias.
 * Custo: uma busca de entidades por jogador a cada 10 s à noite; de dia, uma busca de
 * monstros no Overworld a cada HORDA.sol.intervaloTicks.
 */
const NOITE_INICIO = 13000;
const NOITE_FIM = 23000;
const SOL_FIM = 12000; // de 0 a 12000 é dia: nenhum monstro na superfície

// Erros aparecem uma vez por sessão no chat (no celular não dá para ver o log de conteúdo).
const errosAvisados = new Set<string>();
function registrarErro(onde: string, erro: unknown): void {
  if (errosAvisados.has(onde)) return;
  errosAvisados.add(onde);
  console.warn(`[Pouso Forçado] horda (${onde}): ${erro}`);
  world.sendMessage(`§c[Pouso Forçado] erro na horda (${onde}): ${erro}`);
}

const hora = (): number => world.getTimeOfDay();
const ehNoite = (): boolean => hora() >= NOITE_INICIO && hora() <= NOITE_FIM;
const solAlto = (): boolean => hora() < SOL_FIM;

function jogadoresNoDeserto(): Player[] {
  return world
    .getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })
    .filter((j) => j.dimension.id === "minecraft:overworld");
}

/** Tenta pôr um monstro no chão, entre min e max blocos do jogador (algumas tentativas). */
function nascerPerto(jogador: Player, min: number, max: number): void {
  for (let tentativa = 0; tentativa < 4; tentativa++) if (tentarNascer(jogador, min, max)) return;
}

function tentarNascer(jogador: Player, min: number, max: number): boolean {
  const dimensao = jogador.dimension;
  const angulo = Math.random() * Math.PI * 2;
  const distancia = min + Math.random() * (max - min);
  const x = Math.floor(jogador.location.x + Math.cos(angulo) * distancia);
  const z = Math.floor(jogador.location.z + Math.sin(angulo) * distancia);
  if (!dimensao.isChunkLoaded({ x, y: jogador.location.y, z })) return false;

  const chao = dimensao.getTopmostBlock({ x, z });
  if (!chao || chao.isLiquid || chao.isAir) return false;
  const acima = chao.above();
  if (!acima?.isAir || !acima.above()?.isAir) return false;

  const mob = HORDA.mobs[Math.floor(Math.random() * HORDA.mobs.length)];
  dimensao.spawnEntity(mob, { x: x + 0.5, y: acima.y, z: z + 0.5 });
  return true;
}

function reforcoNoturno(): void {
  for (const jogador of jogadoresNoDeserto()) {
    const perto = jogador.dimension.getEntities({
      location: jogador.location,
      maxDistance: HORDA.raioContagem,
      families: ["monster"],
    }).length;
    if (perto >= HORDA.limitePerto) continue;
    for (let i = 0; i < HORDA.porVez; i++) {
      try {
        nascerPerto(jogador, HORDA.distanciaMin, HORDA.distanciaMax);
      } catch (erro) {
        registrarErro("reforço", erro);
      }
    }
  }
}

function soltarOnda(numero: number, dia: number): void {
  const { onda } = HORDA;
  const tamanho = Math.min(onda.max, onda.base + onda.porDia * dia);
  for (const jogador of jogadoresNoDeserto()) {
    jogador.onScreenDisplay.setTitle(
      { translate: "cl.horda.titulo" },
      {
        subtitle: { translate: "cl.horda.subtitulo", with: [String(numero), String(onda.horas.length), String(tamanho)] },
        fadeInDuration: 10,
        stayDuration: 60,
        fadeOutDuration: 20,
      },
    );
    jogador.playSound("raid.horn");
    // Espalha a onda em alguns segundos para não pesar num tick só.
    for (let i = 0; i < tamanho; i++) {
      system.runTimeout(() => {
        try {
          if (jogador.isValid) nascerPerto(jogador, onda.distanciaMin, onda.distanciaMax);
        } catch (erro) {
          registrarErro("onda", erro);
        }
      }, 20 + i * 3);
    }
  }
}

/** A noite deste dia é noite de horda? (a 10ª, a 20ª... contando a primeira noite como 1) */
export const noiteDeHorda = (dia: number = world.getDay()): boolean => (dia + 1) % HORDA.onda.aCadaDias === 0;

let avisadoNoDia = -1;
function avisoDeHorda(): void {
  const dia = world.getDay();
  if (avisadoNoDia === dia || !noiteDeHorda(dia) || hora() < HORDA.onda.avisoHora || hora() >= NOITE_INICIO) return;
  avisadoNoDia = dia;
  for (const j of jogadoresNoDeserto()) {
    j.onScreenDisplay.setTitle({ translate: "cl.horda.aviso" }, { subtitle: { translate: "cl.horda.aviso_sub" }, fadeInDuration: 10, stayDuration: 80, fadeOutDuration: 20 });
    j.playSound("raid.horn", { volume: 0.5, pitch: 0.8 });
  }
}

function talvezOnda(): void {
  const dia = world.getDay();
  if (!noiteDeHorda(dia)) return;
  const feita = world.getDynamicProperty(PROPS.ondaFeita);
  const [diaFeito, kFeito] = typeof feita === "string" ? feita.split(":").map(Number) : [-1, -1];
  // A onda mais recente cuja hora já passou nesta noite.
  let k = -1;
  HORDA.onda.horas.forEach((h, idx) => {
    if (hora() >= h) k = idx;
  });
  if (k < 0 || (diaFeito === dia && kFeito >= k)) return;
  world.setDynamicProperty(PROPS.ondaFeita, `${dia}:${k}`);
  soltarOnda(k + 1, dia);
}

// De dia (1.3.7) não fica monstro na superfície: os que sobram da noite se enterram na areia (somem numa nuvem
// de areia, sem pegar fogo) e nenhum nasce. Cavernas (abaixo da superfície) seguem como no jogo. Os mobs
// postos pelo add-on (marca DO_ADDON: cidades, faraó, golem da tempestade...) ficam.
const naSuperficie = (y: number): boolean => y >= MUNDO_PLANO.superficieY - HORDA.sol.profundidade;
const deDia = (e: Entity): boolean =>
  !e.hasTag(DO_ADDON) && naSuperficie(e.location.y) &&
  (e.matches({ families: ["monster"], excludeFamilies: [FAMILIA_RESISTE_SOL] }) || e.matches({ families: ["undead"], excludeFamilies: [FAMILIA_RESISTE_SOL] }));

function enterrarNaAreia(): void {
  const dimensao = world.getDimension("minecraft:overworld");
  const vistos = new Set<string>();
  for (const familia of ["monster", "undead"]) {
    for (const mob of dimensao.getEntities({ families: [familia], excludeFamilies: [FAMILIA_RESISTE_SOL] })) {
      if (vistos.has(mob.id)) continue;
      vistos.add(mob.id);
      try {
        if (!deDia(mob)) continue;
        const { x, y, z } = mob.location;
        dimensao.spawnParticle("minecraft:falling_dust_sand_particle", { x, y: y + 0.5, z });
        dimensao.spawnParticle("minecraft:falling_dust_sand_particle", { x, y: y + 1.2, z });
        mob.remove();
      } catch {
        // mob no limite do mundo carregado
      }
    }
  }
}

export function registrarHordaNoturna(): void {
  intervalo("horda", () => {
    if (world.getDifficulty() === Difficulty.Peaceful) return;
    avisoDeHorda();
    if (!ehNoite()) return;
    try {
      talvezOnda();
    } catch (erro) {
      registrarErro("ondas", erro);
    }
    try {
      reforcoNoturno();
    } catch (erro) {
      registrarErro("reforço", erro);
    }
  }, HORDA.intervaloTicks);

  intervalo("horda", () => {
    if (solAlto()) enterrarNaAreia();
  }, HORDA.sol.intervaloTicks);

  // De dia, monstro que nasce na superfície some na hora (a marca DO_ADDON é posta logo depois do spawnEntity:
  // por isso a conferência fica para o tick seguinte).
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== EntityInitializationCause.Spawned || !solAlto()) return;
    if (entity.typeId === "minecraft:item" || entity.typeId === "minecraft:xp_orb" || entity.dimension.id !== "minecraft:overworld") return;
    system.run(() => {
      try {
        if (entity.isValid && deDia(entity)) entity.remove();
      } catch {
        // entidade já saiu do mundo
      }
    });
  });
}

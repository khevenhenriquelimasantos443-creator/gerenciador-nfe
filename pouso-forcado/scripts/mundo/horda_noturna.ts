import { Difficulty, GameMode, Player, system, world } from "@minecraft/server";
import { HORDA, PROPS } from "../config.js";

/*
 * Noite e dia no deserto:
 * - À noite, a cada HORDA.intervaloTicks nascem monstros extras perto de cada jogador
 *   (se houver menos de HORDA.limitePerto em volta).
 * - Uma vez por noite, à meia-noite, chega a HORDA: aviso na tela, corneta e uma onda
 *   de monstros em volta de cada jogador, maior a cada dia que passa.
 * - De dia, o sol do planeta incendeia todo monstro exposto ao céu (até husks, aranhas
 *   e creepers, que no jogo normal não queimam). Quem está na sombra ou no subsolo escapa.
 * Custo: uma busca de entidades por jogador a cada 10 s à noite; de dia, uma busca de
 * monstros no Overworld a cada HORDA.sol.intervaloTicks.
 */
const NOITE_INICIO = 13000;
const NOITE_FIM = 23000;
const SOL_FIM = 12000; // de 0 a 12000 o sol está alto o bastante para queimar

let avisouErro = false;
function registrarErro(onde: string, erro: unknown): void {
  if (avisouErro) return;
  avisouErro = true;
  console.warn(`[Pouso Forçado] horda (${onde}): ${erro}`);
}

const hora = (): number => world.getTimeOfDay();
const ehNoite = (): boolean => hora() >= NOITE_INICIO && hora() <= NOITE_FIM;
const solAlto = (): boolean => hora() < SOL_FIM;

function jogadoresNoDeserto(): Player[] {
  return world
    .getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] })
    .filter((j) => j.dimension.id === "minecraft:overworld");
}

/** Tenta pôr um monstro no chão, entre min e max blocos do jogador. */
function nascerPerto(jogador: Player, min: number, max: number): void {
  const dimensao = jogador.dimension;
  const angulo = Math.random() * Math.PI * 2;
  const distancia = min + Math.random() * (max - min);
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

function talvezOnda(): void {
  const { onda } = HORDA;
  if (hora() < onda.hora || hora() > NOITE_FIM) return;
  const dia = world.getDay();
  if (world.getDynamicProperty(PROPS.ondaDia) === dia) return; // já veio nesta noite
  world.setDynamicProperty(PROPS.ondaDia, dia);

  const tamanho = Math.min(onda.max, onda.base + onda.porDia * dia);
  for (const jogador of jogadoresNoDeserto()) {
    jogador.onScreenDisplay.setTitle(
      { translate: "cl.horda.titulo" },
      { subtitle: { translate: "cl.horda.subtitulo" }, fadeInDuration: 10, stayDuration: 60, fadeOutDuration: 20 },
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
      }, 20 + i * 5);
    }
  }
}

function solQueima(): void {
  const dimensao = world.getDimension("minecraft:overworld");
  for (const mob of dimensao.getEntities({ families: ["monster"] })) {
    try {
      const { x, y, z } = mob.location;
      const topo = dimensao.getTopmostBlock({ x, z });
      // Exposto ao céu: nada acima da cabeça (o bloco mais alto da coluna está embaixo do mob).
      if (!topo || Math.floor(y) > topo.y) mob.setOnFire(HORDA.sol.segundosFogo, true);
    } catch {
      // mob no limite do mundo carregado
    }
  }
}

export function registrarHordaNoturna(): void {
  system.runInterval(() => {
    if (!ehNoite() || world.getDifficulty() === Difficulty.Peaceful) return;
    reforcoNoturno();
    talvezOnda();
  }, HORDA.intervaloTicks);

  system.runInterval(() => {
    if (solAlto()) solQueima();
  }, HORDA.sol.intervaloTicks);
}

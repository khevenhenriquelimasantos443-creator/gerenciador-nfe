import { GameMode, Player, system, world } from "@minecraft/server";
import { PROPS, TEMPESTADE } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * Tempestade de areia: no máximo uma por dia (TEMPESTADE.chancePorDia), de dia.
 * - Névoa amarela grossa (RP/fogs/tempestade.json, aplicada com /fog), aviso na tela e vento.
 * - Quem está ao ar livre fica lento; a sede cai mais rápido (sede.ts usa tempestadeAtiva()).
 * - Quando acaba, todos os jogadores no Overworld ganham o progresso da missão.
 * Custo: uma checagem a cada 2 s; o /fog roda só ao começar/acabar (ou para quem entrar no meio).
 */
const ID_NEVOA = "cl_tempestade";
const comNevoa = new Set<string>();

export function tempestadeAtiva(): boolean {
  const ate = world.getDynamicProperty(PROPS.tempestadeAte);
  return typeof ate === "number" && world.getAbsoluteTime() < ate;
}

function aoCeu(jogador: Player): boolean {
  const { x, y, z } = jogador.location;
  const topo = jogador.dimension.getTopmostBlock({ x, z });
  return !topo || topo.y < Math.floor(y + 1);
}

function comando(jogador: Player, cmd: string): void {
  try {
    jogador.runCommand(cmd);
  } catch {
    // sem permissão para comandos neste mundo: fica só sem a névoa
  }
}

function terminar(): void {
  world.setDynamicProperty(PROPS.tempestadeAte, 0);
  for (const jogador of world.getPlayers()) {
    comando(jogador, `fog @s remove ${ID_NEVOA}`);
    if (jogador.dimension.id !== "minecraft:overworld") continue;
    jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.tempestade.fim" }] });
    registrarAcao(jogador, "tempestade");
  }
  comNevoa.clear();
}

export function comecarTempestade(): void {
  world.setDynamicProperty(PROPS.tempestadeAte, world.getAbsoluteTime() + TEMPESTADE.duracaoTicks);
  for (const jogador of world.getPlayers()) {
    jogador.onScreenDisplay.setTitle({ translate: "cl.tempestade.titulo" }, {
      subtitle: { translate: "cl.tempestade.subtitulo" },
      fadeInDuration: 10,
      stayDuration: 60,
      fadeOutDuration: 20,
    });
    jogador.playSound("ambient.weather.thunder");
  }
}

export function registrarTempestade(): void {
  let estavaAtiva = tempestadeAtiva();
  system.runInterval(() => {
    const ativa = tempestadeAtiva();
    if (estavaAtiva && !ativa) terminar();
    estavaAtiva = ativa;

    if (!ativa) {
      const t = world.getTimeOfDay(), dia = world.getDay();
      if (t < TEMPESTADE.horaMin || t > TEMPESTADE.horaMax || world.getDynamicProperty(PROPS.tempestadeDia) === dia) return;
      world.setDynamicProperty(PROPS.tempestadeDia, dia);
      if (Math.random() < TEMPESTADE.chancePorDia) {
        comecarTempestade();
        estavaAtiva = true;
      }
      return;
    }
    for (const jogador of world.getPlayers({ excludeGameModes: [GameMode.Spectator] })) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      if (!comNevoa.has(jogador.id)) {
        comNevoa.add(jogador.id);
        comando(jogador, `fog @s push cl:tempestade ${ID_NEVOA}`);
      }
      if (aoCeu(jogador)) {
        jogador.addEffect("slowness", 50, { amplifier: 0, showParticles: false });
        jogador.playSound("ambient.weather.rain", { volume: 0.3, pitch: 0.5 });
      }
    }
  }, 40);

  system.afterEvents.scriptEventReceive.subscribe(({ id }) => {
    if (id === "cl:tempestade") comecarTempestade();
  });
}

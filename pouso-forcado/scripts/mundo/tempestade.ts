import { GameMode, Player, system, world } from "@minecraft/server";
import { PROPS, TEMPESTADE } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * Tempestade de areia: começa a qualquer hora, ao acaso (TEMPESTADE.chancePorMinuto), com
 * uma pausa mínima depois de cada uma (TEMPESTADE.pausaMinutos), e dura TEMPESTADE.duracaoTicks.
 * - Névoa amarela grossa (RP/fogs/tempestade.json, aplicada com /fog), aviso na tela e vento.
 * - Quem está ao ar livre fica lento; a sede cai mais rápido (sede.ts usa tempestadeAtiva()).
 * - Quando acaba, todos os jogadores no Overworld ganham o progresso da missão.
 * Custo: uma checagem a cada 2 s; o /fog roda só ao começar/acabar (ou para quem entrar no meio).
 * Com trapaças: /scriptevent cl:tempestade começa uma; /scriptevent cl:tempestade_fim acaba.
 */
const ID_NEVOA = "cl_tempestade";
const comNevoa = new Set<string>();

/** Ticks que faltam para a tempestade acabar (0 = sem tempestade). */
export function tempestadeRestante(): number {
  const ate = world.getDynamicProperty(PROPS.tempestadeAte);
  return typeof ate === "number" ? Math.max(0, ate - world.getAbsoluteTime()) : 0;
}

export const tempestadeAtiva = (): boolean => tempestadeRestante() > 0;

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
  world.setDynamicProperty(PROPS.tempestadeFim, world.getAbsoluteTime());
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

function sortearInicio(): boolean {
  const fim = world.getDynamicProperty(PROPS.tempestadeFim);
  const pausa = TEMPESTADE.pausaMinutos * 60 * 20;
  if (typeof fim === "number" && world.getAbsoluteTime() - fim < pausa) return false;
  return Math.random() < TEMPESTADE.chancePorMinuto / 30; // checagem a cada 2 s = 30 por minuto
}

export function registrarTempestade(): void {
  // undefined até a primeira volta: o mundo não pode ser lido enquanto o script carrega.
  let estavaAtiva: boolean | undefined;
  system.runInterval(() => {
    const ativa = tempestadeAtiva();
    if (estavaAtiva && !ativa) terminar();
    estavaAtiva = ativa;

    if (!ativa) {
      if (sortearInicio()) {
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

  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity }) => {
    if (id === "cl:tempestade") {
      comecarTempestade();
      if (sourceEntity instanceof Player) sourceEntity.sendMessage("§7[Pouso Forçado] Tempestade de areia começou (25 min).");
    } else if (id === "cl:tempestade_fim" && tempestadeAtiva()) {
      world.setDynamicProperty(PROPS.tempestadeAte, world.getAbsoluteTime()); // a próxima volta encerra
    }
  });
}

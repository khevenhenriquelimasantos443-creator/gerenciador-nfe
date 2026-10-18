import { Player, system, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { garantirNave } from "../mundo/nave.js";

function darBoasVindas(jogador: Player): void {
  if (!jogador.isValid) return;
  garantirNave(jogador);

  if (jogador.getDynamicProperty(PROPS.boasVindasVista)) return;
  jogador.setDynamicProperty(PROPS.boasVindasVista, true);
  jogador.onScreenDisplay.setTitle(
    { translate: "cl.boas_vindas.titulo" },
    { subtitle: { translate: "cl.boas_vindas.subtitulo" }, fadeInDuration: 10, stayDuration: 80, fadeOutDuration: 20 },
  );
  jogador.sendMessage({ translate: "cl.boas_vindas.mensagem" });
}

export function registrarBoasVindas(): void {
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    // Espera ~2 s para a tela de carregamento sumir e os chunks em volta carregarem.
    system.runTimeout(() => darBoasVindas(player), 40);
  });
}

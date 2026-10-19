import { Player, system, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { entregarDiario } from "../missoes/diario.js";
import { mostrarDiagnostico } from "../mundo/diagnostico.js";
import { garantirNave } from "../mundo/nave.js";
import { mostrarTitulo } from "./minimapa.js";

function darBoasVindas(jogador: Player): void {
  if (!jogador.isValid) return;
  garantirNave(jogador);
  mostrarDiagnostico(jogador);
  entregarDiario(jogador); // à parte das boas-vindas: quem já jogou a 0.4.0 também recebe

  if (jogador.getDynamicProperty(PROPS.boasVindasVista)) return;
  jogador.setDynamicProperty(PROPS.boasVindasVista, true);
  mostrarTitulo(jogador,
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

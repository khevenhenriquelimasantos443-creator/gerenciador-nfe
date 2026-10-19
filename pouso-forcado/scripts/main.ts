// Ponto de entrada do Behavior Pack. Cada fase registra seus módulos aqui.
import { system } from "@minecraft/server";
import { compostor } from "./blocos/compostor.js";
import { condensadorAgua, condensadorAvancado } from "./blocos/condensador.js";
import { bateria, gerador, moinho, painelSolar, peneiraAutomatica } from "./blocos/energia.js";
import { estufa } from "./blocos/estufa.js";
import { geradorMonstros, registrarGeradorMonstros } from "./blocos/gerador_monstros.js";
import { peneira } from "./blocos/peneira.js";
import { IDS } from "./config.js";
import { registrarBoasVindas } from "./jogador/boas_vindas.js";
import { registrarAguas } from "./jogador/aguas.js";
import { registrarComandos } from "./jogador/comandos.js";
import { registrarHud } from "./jogador/hud.js";
import { registrarSede } from "./jogador/sede.js";
import { registrarTemperatura } from "./jogador/temperatura.js";
import { registrarCapsulas } from "./mundo/capsulas.js";
import { registrarPontos } from "./mundo/pontos.js";
import { registrarTempestade } from "./mundo/tempestade.js";
import { registrarMissoes } from "./missoes/diario.js";
import { registrarHordaNoturna } from "./mundo/horda_noturna.js";
import { registrarRelevo } from "./mundo/relevo.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry, customCommandRegistry }) => {
  registrarComandos(customCommandRegistry);
  // O nome do componente é o mesmo ID do bloco (ver "cl:..." em BP/blocks/*.json).
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAgua, condensadorAgua);
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAvancado, condensadorAvancado);
  blockComponentRegistry.registerCustomComponent(IDS.peneira, peneira);
  blockComponentRegistry.registerCustomComponent(IDS.compostor, compostor);
  blockComponentRegistry.registerCustomComponent(IDS.estufa, estufa);
  blockComponentRegistry.registerCustomComponent(IDS.painelSolar, painelSolar);
  blockComponentRegistry.registerCustomComponent(IDS.gerador, gerador);
  blockComponentRegistry.registerCustomComponent(IDS.bateria, bateria);
  blockComponentRegistry.registerCustomComponent(IDS.peneiraAutomatica, peneiraAutomatica);
  blockComponentRegistry.registerCustomComponent(IDS.moinho, moinho);
  blockComponentRegistry.registerCustomComponent(IDS.geradorMonstros, geradorMonstros);
});

registrarBoasVindas();
registrarHordaNoturna();
registrarRelevo();
registrarMissoes();
registrarSede();
registrarTemperatura();
registrarHud();
registrarAguas();
registrarGeradorMonstros();
registrarPontos();
registrarTempestade();
registrarCapsulas();

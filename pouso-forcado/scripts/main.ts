// Ponto de entrada do Behavior Pack. Cada fase registra seus módulos aqui.
import { system } from "@minecraft/server";
import { compostor } from "./blocos/compostor.js";
import { condensadorAgua, condensadorAvancado } from "./blocos/condensador.js";
import { estufa } from "./blocos/estufa.js";
import { peneira } from "./blocos/peneira.js";
import { IDS } from "./config.js";
import { registrarBoasVindas } from "./jogador/boas_vindas.js";
import { registrarSede } from "./jogador/sede.js";
import { registrarCapsulas } from "./mundo/capsulas.js";
import { registrarMissoes } from "./missoes/diario.js";
import { registrarHordaNoturna } from "./mundo/horda_noturna.js";
import { registrarRelevo } from "./mundo/relevo.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  // O nome do componente é o mesmo ID do bloco (ver "cl:..." em BP/blocks/*.json).
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAgua, condensadorAgua);
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAvancado, condensadorAvancado);
  blockComponentRegistry.registerCustomComponent(IDS.peneira, peneira);
  blockComponentRegistry.registerCustomComponent(IDS.compostor, compostor);
  blockComponentRegistry.registerCustomComponent(IDS.estufa, estufa);
});

registrarBoasVindas();
registrarHordaNoturna();
registrarRelevo();
registrarMissoes();
registrarSede();
registrarCapsulas();

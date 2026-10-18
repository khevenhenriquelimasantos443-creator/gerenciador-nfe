// Ponto de entrada do Behavior Pack. Cada fase registra seus módulos aqui.
import { system } from "@minecraft/server";
import { ID_COMPONENTE_CONDENSADOR, condensadorAgua } from "./blocos/condensador.js";
import { registrarBoasVindas } from "./jogador/boas_vindas.js";
import { registrarMissoes } from "./missoes/diario.js";
import { registrarHordaNoturna } from "./mundo/horda_noturna.js";
import { registrarRelevo } from "./mundo/relevo.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent(ID_COMPONENTE_CONDENSADOR, condensadorAgua);
});

registrarBoasVindas();
registrarHordaNoturna();
registrarRelevo();
registrarMissoes();

// Ponto de entrada do Behavior Pack. Cada fase registra seus módulos aqui.
import { system } from "@minecraft/server";
import { registrarCabos } from "./blocos/cabo.js";
import { compostor } from "./blocos/compostor.js";
import { condensadorAgua, condensadorAvancado } from "./blocos/condensador.js";
import { bateria, gerador, moinho, painelSolar, peneiraAutomatica } from "./blocos/energia.js";
import { estufa } from "./blocos/estufa.js";
import { geradorMonstros, registrarGeradorMonstros } from "./blocos/gerador_monstros.js";
import { barril } from "./blocos/barril.js";
import { cadinho } from "./blocos/cadinho.js";
import { montadora } from "./blocos/montadora.js";
import { folhaInfestada, registrarNihilo } from "./blocos/nihilo.js";
import { planta, registrarPlantacao } from "./blocos/plantacao.js";
import { registrarFerramentas } from "./tinkers/ferramenta.js";
import { construtorPecasComp, estacaoFerramentasComp, mesaMoldesComp } from "./tinkers/mesas.js";
import { registrarVaral, varal } from "./tinkers/varal.js";
import { celulaEnergia, dinamo, extrusora, fornalhaRedstone, fundidoraInducao, precipitador, pulverizador, registrarThermal, serraria } from "./maquinas/thermal.js";
import { barrilArmazenamento, registrarJabba } from "./armazenamento/jabba.js";
import { bauMe, driveMe, pontoAcesso, registrarAE } from "./armazenamento/ae.js";
import { empacotador, registrarEmpacotador } from "./maquinas/empacotador.js";
import { compressor, interfaceCamara, registrarPneumatic, valvula } from "./maquinas/pneumatic.js";
import { armazemCorpos, construtorCorpos, registrarSync } from "./maquinas/sync.js";
import { cabide, carregador, estante, guardaItens, luminaria, registrarDecoracao } from "./maquinas/decoracao.js";
import { barraControle, controladorReator, portaAcesso, portaRefrigeracao, registrarReator, reprocessador, tomada } from "./maquinas/reator.js";
import { colheitadeira, colocador, compostadora, esgoto, esteira, fertilizadora, plantadeira, quebrador, rancheiro, registrarMFR, triturador } from "./maquinas/mfr.js";
import { baciaComp, fundicaoComp, mesaComp, registrarFundicao, tanqueComp, torneiraComp } from "./tinkers/fundicao.js";
import { peneira } from "./blocos/peneira.js";
import { terminal } from "./blocos/terminal.js";
import { registrarCatalogo } from "./catalogo/catalogo.js";
import { IDS } from "./config.js";
import { registrarBoasVindas } from "./jogador/boas_vindas.js";
import { registrarAguas } from "./jogador/aguas.js";
import { registrarAmbiente } from "./jogador/ambiente.js";
import { registrarFome } from "./jogador/fome.js";
import { registrarComandos } from "./jogador/comandos.js";
import { registrarHud } from "./jogador/hud.js";
import { registrarOrganizador } from "./jogador/organizador.js";
import { registrarSede } from "./jogador/sede.js";
import { registrarTemperatura } from "./jogador/temperatura.js";
import { registrarCapsulas } from "./mundo/capsulas.js";
import { idoloAmaldicoado, registrarFarao } from "./mundo/farao.js";
import { registrarMonstros } from "./mundo/monstros.js";
import { registrarPontos } from "./mundo/pontos.js";
import { painelNave } from "./mundo/reparo.js";
import { registrarDecolagem } from "./mundo/decolagem.js";
import { registrarSemNether } from "./mundo/nether.js";
import { registrarEnergiaExtra, tesseract, torreDefesa } from "./maquinas/energia_extra.js";
import { montadorMolecular, registrarAutocraft } from "./armazenamento/autocraft.js";
import { cachoTamaras, mudaTamareira, registrarTamareira } from "./harvest/tamareira.js";
import { caixaEntrega, registrarEntrega } from "./missoes/entrega.js";
import { registrarVariedade } from "./jogador/variedade.js";
import { registrarCaldeirao } from "./jogador/caldeirao.js";
import { registrarExtras } from "./mundo/extras.js";
import { bomba, motor, pedreira, refinaria, registrarBuildcraft } from "./maquinas/buildcraft.js";
import { registrarOpenBlocks, tumulo } from "./jogador/openblocks.js";
import { camaraInjecao, camaraPurificacao, evaporador, infusorMetalurgico, infusorQuimico, registrarMekanism, separador } from "./maquinas/mekanism.js";
import { registrarTempestade } from "./mundo/tempestade.js";
import { registrarMissoes } from "./missoes/diario.js";
import { registrarHordaNoturna } from "./mundo/horda_noturna.js";
import { registrarRelevo } from "./mundo/relevo.js";
import { comPerfil, registrarPerfil } from "./util/perfil.js";
import { bancadaNasa, carregador as carregadorCombustivel, coletor, compressor as compressorGC, compressorEletrico, compressorOxigenio, distribuidor, fabricador, registrarMaquinasGC } from "./galacticraft/maquinas.js";
import { registrarDimensaoLua, registrarLua } from "./galacticraft/lua.js";
import { registrarOxigenio } from "./galacticraft/oxigenio.js";
import { registrarFoguete } from "./galacticraft/foguete.js";
import { bauTesouro, registrarBase } from "./galacticraft/base.js";

system.beforeEvents.startup.subscribe(({ blockComponentRegistry, customCommandRegistry, dimensionRegistry }) => {
  registrarComandos(customCommandRegistry);
  registrarDimensaoLua(dimensionRegistry); // 1.6.0: a Lua do Galacticraft
  // O nome do componente é o mesmo ID do bloco (ver "cl:..." em BP/blocks/*.json).
  // comPerfil: o tick de cada máquina entra no /cl:diagnostico.
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAgua, comPerfil(IDS.condensadorAgua, condensadorAgua));
  blockComponentRegistry.registerCustomComponent(IDS.condensadorAvancado, comPerfil(IDS.condensadorAvancado, condensadorAvancado));
  blockComponentRegistry.registerCustomComponent(IDS.peneira, comPerfil(IDS.peneira, peneira));
  blockComponentRegistry.registerCustomComponent(IDS.compostor, comPerfil(IDS.compostor, compostor));
  blockComponentRegistry.registerCustomComponent(IDS.estufa, comPerfil(IDS.estufa, estufa));
  blockComponentRegistry.registerCustomComponent(IDS.painelSolar, comPerfil(IDS.painelSolar, painelSolar));
  blockComponentRegistry.registerCustomComponent(IDS.gerador, comPerfil(IDS.gerador, gerador));
  blockComponentRegistry.registerCustomComponent(IDS.bateria, comPerfil(IDS.bateria, bateria));
  blockComponentRegistry.registerCustomComponent(IDS.peneiraAutomatica, comPerfil(IDS.peneiraAutomatica, peneiraAutomatica));
  blockComponentRegistry.registerCustomComponent(IDS.moinho, comPerfil(IDS.moinho, moinho));
  blockComponentRegistry.registerCustomComponent(IDS.geradorMonstros, comPerfil(IDS.geradorMonstros, geradorMonstros));
  blockComponentRegistry.registerCustomComponent(IDS.idolo, comPerfil(IDS.idolo, idoloAmaldicoado));
  blockComponentRegistry.registerCustomComponent(IDS.montadora, comPerfil(IDS.montadora, montadora));
  blockComponentRegistry.registerCustomComponent(IDS.painelNave, comPerfil(IDS.painelNave, painelNave));
  blockComponentRegistry.registerCustomComponent(IDS.terminal, comPerfil(IDS.terminal, terminal));
  blockComponentRegistry.registerCustomComponent(IDS.barrilMadeira, comPerfil(IDS.barrilMadeira, barril));
  blockComponentRegistry.registerCustomComponent(IDS.barrilPedra, comPerfil(IDS.barrilPedra, barril));
  blockComponentRegistry.registerCustomComponent(IDS.cadinho, comPerfil(IDS.cadinho, cadinho));
  blockComponentRegistry.registerCustomComponent(IDS.folhaInfestada, comPerfil(IDS.folhaInfestada, folhaInfestada));
  blockComponentRegistry.registerCustomComponent("cl:planta", comPerfil("plantação", planta));
  blockComponentRegistry.registerCustomComponent("cl:mesa_moldes", mesaMoldesComp);
  blockComponentRegistry.registerCustomComponent("cl:construtor_pecas", construtorPecasComp);
  blockComponentRegistry.registerCustomComponent("cl:estacao_ferramentas", estacaoFerramentasComp);
  blockComponentRegistry.registerCustomComponent("cl:varal", varal);
  blockComponentRegistry.registerCustomComponent("cl:tesseract", tesseract);
  blockComponentRegistry.registerCustomComponent("cl:montador_molecular", montadorMolecular);
  blockComponentRegistry.registerCustomComponent("cl:muda_tamareira", mudaTamareira);
  blockComponentRegistry.registerCustomComponent("cl:cacho_tamaras", cachoTamaras);
  blockComponentRegistry.registerCustomComponent("cl:caixa_entrega", caixaEntrega);
  for (const [id, comp] of Object.entries({
    "cl:separador_eletrolitico": separador, "cl:evaporador": evaporador, "cl:infusor_quimico": infusorQuimico,
    "cl:camara_purificacao": camaraPurificacao, "cl:camara_injecao": camaraInjecao, "cl:infusor_metalurgico": infusorMetalurgico,
    "cl:bomba": bomba, "cl:refinaria": refinaria, "cl:motor_combustao": motor, "cl:pedreira": pedreira,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  blockComponentRegistry.registerCustomComponent("cl:tumulo", tumulo);
  blockComponentRegistry.registerCustomComponent("cl:torre_defesa", comPerfil("cl:torre_defesa", torreDefesa));
  blockComponentRegistry.registerCustomComponent("cl:fundicao", comPerfil("cl:fundicao", fundicaoComp));
  blockComponentRegistry.registerCustomComponent("cl:tanque_refratario", tanqueComp);
  blockComponentRegistry.registerCustomComponent("cl:torneira", torneiraComp);
  blockComponentRegistry.registerCustomComponent("cl:mesa_fundicao", mesaComp);
  blockComponentRegistry.registerCustomComponent("cl:bacia_fundicao", baciaComp);
  for (const [id, comp] of Object.entries({
    "cl:pulverizador": pulverizador, "cl:fornalha_redstone": fornalhaRedstone, "cl:fundidora_inducao": fundidoraInducao, "cl:serraria": serraria,
    "cl:extrusora_ignea": extrusora, "cl:precipitador_glacial": precipitador, "cl:dinamo_redstone": dinamo,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  blockComponentRegistry.registerCustomComponent("cl:celula_energia", celulaEnergia);
  blockComponentRegistry.registerCustomComponent("cl:barril_armazenamento", comPerfil("cl:barril_armazenamento", barrilArmazenamento));
  blockComponentRegistry.registerCustomComponent("cl:empacotador", comPerfil("cl:empacotador", empacotador));
  blockComponentRegistry.registerCustomComponent("cl:drive_me", driveMe);
  blockComponentRegistry.registerCustomComponent("cl:bau_me", bauMe);
  blockComponentRegistry.registerCustomComponent("cl:ponto_acesso", pontoAcesso);
  blockComponentRegistry.registerCustomComponent("cl:compressor_ar", comPerfil("cl:compressor_ar", compressor));
  blockComponentRegistry.registerCustomComponent("cl:valvula_camara", comPerfil("cl:valvula_camara", valvula));
  blockComponentRegistry.registerCustomComponent("cl:interface_camara", comPerfil("cl:interface_camara", interfaceCamara));
  blockComponentRegistry.registerCustomComponent("cl:construtor_corpos", comPerfil("cl:construtor_corpos", construtorCorpos));
  blockComponentRegistry.registerCustomComponent("cl:armazem_corpos", armazemCorpos);
  blockComponentRegistry.registerCustomComponent("cl:controlador_reator", comPerfil("cl:controlador_reator", controladorReator));
  blockComponentRegistry.registerCustomComponent("cl:barra_controle", barraControle);
  blockComponentRegistry.registerCustomComponent("cl:porta_acesso_reator", portaAcesso);
  blockComponentRegistry.registerCustomComponent("cl:porta_refrigeracao", portaRefrigeracao);
  blockComponentRegistry.registerCustomComponent("cl:tomada_energia", tomada);
  blockComponentRegistry.registerCustomComponent("cl:reprocessador_cianita", comPerfil("cl:reprocessador_cianita", reprocessador));
  blockComponentRegistry.registerCustomComponent("cl:estante", estante);
  blockComponentRegistry.registerCustomComponent("cl:guarda_itens", guardaItens);
  blockComponentRegistry.registerCustomComponent("cl:cabide", cabide);
  blockComponentRegistry.registerCustomComponent("cl:luminaria", luminaria);
  blockComponentRegistry.registerCustomComponent("cl:carregador_chunks", carregador);
  for (const [id, comp] of Object.entries({
    "cl:plantadeira": plantadeira, "cl:colheitadeira": colheitadeira, "cl:fertilizadora": fertilizadora, "cl:rancheiro": rancheiro,
    "cl:triturador_monstros": triturador, "cl:esgoto": esgoto, "cl:compostadora": compostadora, "cl:quebrador_blocos": quebrador,
    "cl:colocador_blocos": colocador, "cl:esteira": esteira,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  for (const [id, comp] of Object.entries({
    "cl:compressor": compressorGC, "cl:compressor_eletrico": compressorEletrico, "cl:fabricador_circuitos": fabricador,
    "cl:coletor_oxigenio": coletor, "cl:compressor_oxigenio": compressorOxigenio, "cl:carregador_combustivel": carregadorCombustivel,
    "cl:distribuidor_oxigenio": distribuidor,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  blockComponentRegistry.registerCustomComponent("cl:bancada_nasa", bancadaNasa);
  blockComponentRegistry.registerCustomComponent("cl:bau_tesouro", bauTesouro);
});

registrarPerfil();
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
registrarCabos();
registrarMonstros();
registrarFarao();
registrarCatalogo();
registrarOrganizador();
registrarNihilo();
registrarPlantacao();
registrarFerramentas();
registrarVaral();
registrarFundicao();
registrarThermal();
registrarJabba();
registrarAE();
registrarEmpacotador();
registrarMFR();
registrarPneumatic();
registrarSync();
registrarReator();
registrarDecoracao();
registrarDecolagem();
registrarSemNether();
registrarEnergiaExtra();
registrarAutocraft();
registrarTamareira();
registrarEntrega();
registrarVariedade();
registrarCaldeirao();
registrarExtras();
registrarMekanism();
registrarBuildcraft();
registrarOpenBlocks();
registrarAmbiente();
registrarFome();
registrarMaquinasGC();
registrarOxigenio();
registrarLua();
registrarFoguete();
registrarBase();

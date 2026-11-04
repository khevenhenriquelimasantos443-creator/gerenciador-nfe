// Ponto de entrada do Behavior Pack. Cada fase registra seus módulos aqui.
import { system, world } from "@minecraft/server";
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
import { bigornaComp, construtorPecasComp, estacaoFerramentasComp, mesaModificadoresComp, mesaMoldesComp, registrarTesteModificadores } from "./tinkers/mesas.js";
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
import { aquecedorComp, baciaComp, fundicaoComp, fusorComp, ligadorComp, mesaComp, registrarFundicao, tanqueComp, torneiraComp } from "./tinkers/fundicao.js";
import { peneira } from "./blocos/peneira.js";
import { terminal } from "./blocos/terminal.js";
import { registrarCatalogo } from "./catalogo/catalogo.js";
import { IDS, VERSAO } from "./config.js";
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
import { marcoPonto, registrarPontos } from "./mundo/pontos.js";
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
import { componenteElevador, registrarOpenBlocks, tumulo } from "./jogador/openblocks.js";
import { evaporador, infusorQuimico, registrarMekanism, separador } from "./maquinas/mekanism.js";
import { COMPONENTES_MK10, infusor10, injecao10, purificacao10, registrarMekanism10, triturador10 } from "./maquinas/mekanism10.js";
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
import { ancora, fundidora, moinhoSag, painel as painelFotovoltaico, registrarEnderIO, stirling } from "./maquinas/enderio.js";
import { COMPONENTES_EIO9, registrarEnderIO9 } from "./maquinas/enderio9.js";
import { cristalBrotandoComp, mudaSlimeComp, slimeCongeladoComp } from "./tinkers/slime.js";
import { registrarArmas } from "./tinkers/armas.js";
import { registrarArtefatos } from "./utilidades/artefatos.js";
import { bauGrandeComp, registrarBausGrandes } from "./utilidades/baus_grandes.js";
import { gavetaComp, registrarGavetas } from "./utilidades/gavetas.js";
import { bauTcComp, punjiComp, registrarExtrasTC } from "./tinkers/extras_tc.js";
import { carregador as carregadorAe, inscritor, registrarAE2 } from "./armazenamento/ae2.js";
import { controlador as controladorVelocidade, fonteGenerica as fonteCinetica, furadeira, manivela, misturador, mo, prensa, registrarCreate, rodas as rodasTrituradoras, ventilador } from "./maquinas/create.js";
import { pedraCaminho, registrarWaystones } from "./utilidades/waystones.js";
import { registrarMochila } from "./utilidades/mochila.js";
import { registrarRobo } from "./utilidades/robo.js";
import { lixeira, registrarExtraUtils } from "./utilidades/extrautils.js";
import { registrarRedemoinho } from "./mundo/redemoinho.js";
import { registrarMekanismAdditions, tntObsidiana } from "./maquinas/mekanism_additions.js";
import { condutoItem, registrarCondutos } from "./maquinas/condutos.js";
import { fogao, panela, registrarFarmers, tabua } from "./maquinas/farmers.js";
import { registrarQuark } from "./utilidades/quark.js";
import { altoForno, dinamoCinetico, fornoCoque, moinhoVento, registrarImmersive, rodaHidraulica } from "./maquinas/immersive.js";
import { registrarAeronaves } from "./utilidades/aeronaves.js";
import { registrarMelhoriasMochila } from "./utilidades/melhorias_mochila.js";
import { registrarTemploYung } from "./mundo/templo_yung.js";
import { registrarFerramentasVanilla } from "./jogador/ferramentas_vanilla.js";
import { registrarJogadores } from "./util/jogadores.js";
import { descarregador as descarregadorPw, ender as enderPw, funil as funilPw, furnator as furnatorPw, magmator as magmatorPw, orbe as orbePw, painelSolar as painelSolarPw, reator as reatorPw, registrarPowah, registrarPowahCompleto, termogerador as termogeradorPw, transmissor as transmissorPw } from "./maquinas/powah.js";
import { geradorBio, geradorCalor, geradorEolico, geradorGas, geradorSolar, geradorSolarAvancado, registrarMekanismExtra } from "./maquinas/mekanism_extra.js";

// 1.16.2: se outra cópia do Pouso Forçado (outra versão) estiver ligada no mesmo mundo, os comandos já existem:
// avisa o jogador ao entrar, em vez de rodar tudo em dobro sem ninguém saber.
let outraCopia = false;
world.afterEvents.playerSpawn.subscribe(({ player }) => {
  if (outraCopia) player.sendMessage({ translate: "cl.duas_versoes", with: [VERSAO] });
});
system.beforeEvents.startup.subscribe(({ blockComponentRegistry, customCommandRegistry, dimensionRegistry }) => {
  try {
    registrarComandos(customCommandRegistry);
  } catch (e) {
    if (!String(e).includes("already registered")) throw e;
    outraCopia = true;
    console.warn(`[Pouso Forçado ${VERSAO}] outra versão do add-on está ligada neste mundo`);
    return;
  }
  registrarDimensaoLua(dimensionRegistry); // 1.6.0: a Lua do Galacticraft
  blockComponentRegistry.registerCustomComponent("cl:elevador", componenteElevador); // 1.16.4: onStepOn
  // 1.18.0: Powah!
  blockComponentRegistry.registerCustomComponent("cl:pw_furnator", comPerfil("powah: furnator", furnatorPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_magmator", comPerfil("powah: magmator", magmatorPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_termogerador", comPerfil("powah: termogerador", termogeradorPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_solar", comPerfil("powah: solar", painelSolarPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_orbe", comPerfil("powah: orbe", orbePw));
  blockComponentRegistry.registerCustomComponent("cl:pw_reator", comPerfil("powah: reator", reatorPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_ender", enderPw);
  blockComponentRegistry.registerCustomComponent("cl:pw_descarregador", comPerfil("powah: descarregador", descarregadorPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_funil", comPerfil("powah: funil", funilPw));
  blockComponentRegistry.registerCustomComponent("cl:pw_transmissor", comPerfil("powah: transmissor", transmissorPw));
  // 1.20.0: Ender IO 9
  for (const [id, c] of Object.entries(COMPONENTES_EIO9)) blockComponentRegistry.registerCustomComponent(id, comPerfil(`eio: ${id.slice(7)}`, c));
  // 1.27.0: mundo dos slimes do Tinkers 3.
  blockComponentRegistry.registerCustomComponent("cl:muda_slime", mudaSlimeComp);
  blockComponentRegistry.registerCustomComponent("cl:cristal_brotando", cristalBrotandoComp);
  blockComponentRegistry.registerCustomComponent("cl:slime_congelado", slimeCongeladoComp);
  // 1.30.0: Tinkers 3 parte 5.
  blockComponentRegistry.registerCustomComponent("cl:bigorna", bigornaComp);
  blockComponentRegistry.registerCustomComponent("cl:mesa_modificadores", mesaModificadoresComp);
  blockComponentRegistry.registerCustomComponent("cl:bau_tc", bauTcComp);
  blockComponentRegistry.registerCustomComponent("cl:punji", punjiComp);
  // 1.32.0: Iron Chests e Storage Drawers.
  blockComponentRegistry.registerCustomComponent("cl:bau_grande", bauGrandeComp);
  blockComponentRegistry.registerCustomComponent("cl:gaveta", gavetaComp);
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
    "cl:camara_purificacao": purificacao10, "cl:camara_injecao": injecao10, "cl:infusor_metalurgico": infusor10, // 1.21.0: Mekanism 10
    ...COMPONENTES_MK10,
    "cl:ae2_inscritor": inscritor, "cl:ae2_carregador_ae": carregadorAe, // 1.22.0: AE2
    "cl:bomba": bomba, "cl:refinaria": refinaria, "cl:motor_combustao": motor, "cl:pedreira": pedreira,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  blockComponentRegistry.registerCustomComponent("cl:tumulo", tumulo);
  blockComponentRegistry.registerCustomComponent("cl:torre_defesa", comPerfil("cl:torre_defesa", torreDefesa));
  blockComponentRegistry.registerCustomComponent("cl:fundicao", comPerfil("cl:fundicao", fundicaoComp));
  blockComponentRegistry.registerCustomComponent("cl:tanque_refratario", tanqueComp);
  blockComponentRegistry.registerCustomComponent("cl:torneira", torneiraComp);
  blockComponentRegistry.registerCustomComponent("cl:mesa_fundicao", mesaComp);
  blockComponentRegistry.registerCustomComponent("cl:bacia_fundicao", baciaComp);
  // 1.29.0: Fusor, Aquecedor e Ligador do Tinkers 3.
  blockComponentRegistry.registerCustomComponent("cl:aquecedor", aquecedorComp);
  blockComponentRegistry.registerCustomComponent("cl:fusor", comPerfil("cl:fusor", fusorComp));
  blockComponentRegistry.registerCustomComponent("cl:ligador", comPerfil("cl:ligador", ligadorComp));
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
  for (const [id, comp] of Object.entries({
    "cl:triturador_mk": triturador10, "cl:gerador_calor": geradorCalor, "cl:gerador_solar_mk": geradorSolar, "cl:gerador_solar_avancado": geradorSolarAvancado,
    "cl:gerador_bio": geradorBio, "cl:gerador_gas": geradorGas, "cl:gerador_eolico": geradorEolico,
    "cl:fundidora_ligas": fundidora, "cl:moinho_sag": moinhoSag, "cl:gerador_stirling": stirling,
    "cl:painel_fotovoltaico": painelFotovoltaico, "cl:painel_fotovoltaico_avancado": painelFotovoltaico, "cl:painel_fotovoltaico_vibrante": painelFotovoltaico,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  for (const [id, comp] of Object.entries({
    "cl:mo": mo, "cl:rodas_trituradoras": rodasTrituradoras, "cl:prensa_mecanica": prensa, "cl:misturador_mecanico": misturador,
    "cl:ventilador": ventilador, "cl:furadeira": furadeira, "cl:roda_dagua": fonteCinetica, "cl:rolamento_moinho": fonteCinetica,
  })) blockComponentRegistry.registerCustomComponent(id, comPerfil(id, comp));
  blockComponentRegistry.registerCustomComponent("cl:manivela", manivela);
  blockComponentRegistry.registerCustomComponent("cl:controlador_velocidade", controladorVelocidade);
  blockComponentRegistry.registerCustomComponent("cl:ancora_viagem", ancora);
  blockComponentRegistry.registerCustomComponent("cl:pedra_caminho", pedraCaminho);
  blockComponentRegistry.registerCustomComponent("cl:conduto_item", comPerfil("cl:conduto_item", condutoItem));
  blockComponentRegistry.registerCustomComponent("cl:tnt_obsidiana", tntObsidiana);
  blockComponentRegistry.registerCustomComponent("cl:panela_cozinha", comPerfil("cl:panela_cozinha", panela));
  blockComponentRegistry.registerCustomComponent("cl:marco_ponto", marcoPonto);
  for (const [id, c] of [["cl:forno_coque", fornoCoque], ["cl:alto_forno", altoForno], ["cl:moinho_vento", moinhoVento], ["cl:roda_hidraulica", rodaHidraulica], ["cl:dinamo_cinetico", dinamoCinetico]] as const)
    blockComponentRegistry.registerCustomComponent(id, comPerfil(id, c));
  blockComponentRegistry.registerCustomComponent("cl:fogao", comPerfil("cl:fogao", fogao));
  blockComponentRegistry.registerCustomComponent("cl:tabua_cortar", tabua);
  blockComponentRegistry.registerCustomComponent("cl:lixeira", comPerfil("cl:lixeira", lixeira));
  blockComponentRegistry.registerCustomComponent("cl:bancada_nasa", bancadaNasa);
  blockComponentRegistry.registerCustomComponent("cl:bau_tesouro", bauTesouro);
});

registrarPerfil();
registrarBoasVindas();
registrarFerramentasVanilla();
registrarJogadores();
registrarPowah();
registrarPowahCompleto();
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
registrarMekanismExtra();
registrarEnderIO();
registrarEnderIO9();
registrarArmas(); // 1.28.0: armaduras, escudos, arcos e arremessáveis do Tinkers 3
registrarTesteModificadores();
registrarArtefatos(); // 1.31.0: Artifacts (Tela de Artefatos)
registrarBausGrandes(); // 1.32.0: Iron Chests
registrarGavetas(); // 1.32.0: Storage Drawers
registrarExtrasTC(); // 1.30.0: livros, ferramentas antigas, cajados, geringonças e baús do Tinkers 3
registrarMekanism10();
registrarAE2();
registrarCreate();
registrarWaystones();
registrarMochila();
registrarRobo();
registrarExtraUtils();
registrarRedemoinho();
registrarMekanismAdditions();
registrarCondutos();
registrarFarmers();
registrarQuark();
registrarImmersive();
registrarAeronaves();
registrarMelhoriasMochila();
registrarTemploYung();

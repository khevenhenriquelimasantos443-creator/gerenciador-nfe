// Fase 68 (1.51.0): Mekanism completo, parte 3: armazenamento, logística e utilidades (Mekanism 10.7.19, MIT;
// tools/importar-mekanism-completo.py grava mekanism_p3.json com os modelos 3D, a arte e as receitas do mod).
// - Caixas (Bins): um item só, 4.096 / 8.192 / 32.768 / 262.144 (scripts/utilidades/gavetas.ts, como as gavetas).
// - Transmissores: Cabo Universal (energia, entra na rede do pack), Cano Mecânico (fluidos), Tubo Pressurizado
//   (químicos) e Transportador Logístico (itens), 4 níveis com a vazão do mod; tocar troca "tira"/"recebe".
// - Bomba Elétrica, Plenificador Fluídico, Minerador Digital, Carregador de Chão, Entrelaçador Quântico, Classificador
//   Logístico, Vibrador Sísmico (+ Leitor), Alarme Industrial e o Teletransportador (moldura, frequência, portátil).
// - Chumbo: minério normal e profundo, bruto, lingote, pepita, pó e blocos; o processamento ×2 a ×5 sai do Mekanism.
// Scripts em scripts/maquinas/mekanism_utilidades.ts.
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("mekanism_p3.json", import.meta.url), "utf8"));
const MK = { mod: "Mekanism" };
const mat = (tex) => ({ texture: tex, render_method: "alpha_test" });
const modelo = (m) => ({
  "minecraft:geometry": m.geometria,
  "minecraft:material_instances": { "*": mat(Object.values(m.materiais)[0]), ...Object.fromEntries(Object.entries(m.materiais).map(([k, v]) => [k, mat(v)])) },
  "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0,
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });
const LIGA = { "cl:n": "norte", "cl:s": "sul", "cl:l": "leste", "cl:o": "oeste", "cl:cima": "cima", "cl:baixo": "baixo" };
const transmissor = (t) => {
  const tira = t.tipo !== "cabo_universal";
  const estados = Object.fromEntries([...Object.keys(LIGA), ...(tira ? ["cl:extrai"] : [])].map((e) => [e, [false, true]]));
  return {
    id: t.id, pt: t.pt, en: t.en, tipo: "cubo", cor: "#3a8a3a", dureza: 1, girar: false, estados, ...MK,
    ...(tira ? { comp: "cl:mk_transmissor", tick: t.tipo === "transportador_logistico" ? 10 : 20 } : {}),
    extra: {
      "minecraft:geometry": { identifier: `geometry.cl.mk_transmissor_${t.modelo}`, bone_visibility: Object.fromEntries(Object.entries(LIGA).map(([e, o]) => [o, `q.block_state('${e}')`])) },
      "minecraft:material_instances": {
        "*": mat(`clc_mkt_${t.id}_lado`), lado: mat(`clc_mkt_${t.id}_lado`),
        // Tirando: o miolo com a arte do modo "puxar" do mod (o laranja dos condutos).
        centro: mat(`clc_mkt_${t.id}_centro`),
      },
      "minecraft:collision_box": t.caixa, "minecraft:selection_box": t.caixa, "minecraft:light_dampening": 0,
    },
    ...(tira ? { permutacoes: [{ condition: "q.block_state('cl:extrai')", components: { "minecraft:material_instances": {
      "*": mat(`clc_mkt_${t.id}_lado`), lado: mat(`clc_mkt_${t.id}_lado`), centro: mat("clc_conduto_item_extrai") } } }] } : {}),
  };
};
const LUZ = { bomba_eletrica: "azul", plenificador_fluidico: "azul", minerador_digital: "verde", carregador_chao: "amarelo", entrelacador_quantico: "violeta",
  classificador_logistico: "verde", vibrador_sismico: "laranja", alarme_industrial: "vermelho", teletransportador: "violeta", moldura_teletransportador: "violeta" };
const TICK = { bomba_eletrica: 20, plenificador_fluidico: 20, minerador_digital: 20, carregador_chao: 10, entrelacador_quantico: 20, classificador_logistico: 10,
  vibrador_sismico: 20, alarme_industrial: 28, teletransportador: 10 }; // o som do alarme dura 1,4 s
// Nomes do chumbo como os outros metais do pack.
const PT = { lingote_chumbo: "Lingote de Chumbo", chumbo_bruto: "Chumbo Bruto", minerio_chumbo: "Minério de Chumbo", minerio_chumbo_profundo: "Minério de Chumbo Profundo" };
const NIVEL = { basico: "Básico", avancado: "Avançado", elite: "Elite", definitivo: "Definitivo" };

export default {
  fase: 68,
  mod: "Mekanism",
  itens: D.itens.map((i) => ({
    id: i.id, pt: PT[i.id] ?? i.pt, en: i.en, icone: "chip:#3a8a3a", ...MK,
    ...(["teletransportador_portatil", "leitor_sismico"].includes(i.id) ? { pilha: 1 } : {}),
  })),
  blocos: [
    ...D.caixas.map((c) => ({ id: c.id, pt: c.pt, en: c.en, tipo: "cubo", cor: "#5a6a5a", dureza: 3, comp: "cl:gaveta", ...MK })),
    ...D.transmissores.map(transmissor),
    ...D.maquinas.map((m) => ({
      id: m.id, pt: m.pt, en: m.en, tipo: m.id === "moldura_teletransportador" ? "cubo" : "maquina", luz: LUZ[m.id], glifo: "engrenagem", ...MK,
      ...(TICK[m.id] ? { comp: "cl:mk_util", tick: TICK[m.id] } : {}), ...(m.id === "moldura_teletransportador" ? { girar: false, luzEmite: 4 } : {}),
      extra: modelo(m.modelo),
    })),
    { id: "minerio_chumbo", pt: PT.minerio_chumbo, en: "Lead Ore", tipo: "cubo", cor: "#7a7a80", dureza: 3, girar: false, loot: "loot_tables/cl/mk/minerio_chumbo.json", ...MK },
    { id: "minerio_chumbo_profundo", pt: PT.minerio_chumbo_profundo, en: "Deepslate Lead Ore", tipo: "cubo", cor: "#45454c", dureza: 4.5, girar: false, loot: "loot_tables/cl/mk/minerio_chumbo.json", ...MK },
    { id: "bloco_chumbo", pt: "Bloco de Chumbo", en: "Block of Lead", tipo: "cubo", cor: "#3a404a", dureza: 5, girar: false, ...MK },
    { id: "bloco_chumbo_bruto", pt: "Bloco de Chumbo Bruto", en: "Block of Raw Lead", tipo: "cubo", cor: "#4a4f58", dureza: 5, girar: false, ...MK },
  ],
  receitas: [
    ...D.receitas,
    ...Object.entries(D.fornalha).map(([de, para], k) => ({ id: `mk_chumbo_forno_${k}`, tipo: "furnace", entrada: de, resultado: para })),
  ],
  textos: {
    // Transmissores
    "cl.mkl.modo": ["%s: agora %s.", "%s: now %s."],
    "cl.mkl.tira": ["TIRA (puxa das máquinas, tanques e baús encostados)", "PULLS (from touching machines, tanks and chests)"],
    "cl.mkl.recebe": ["RECEBE (entrega no que estiver encostado)", "RECEIVES (delivers to what is touching it)"],
    "cl.mkl.taxa": ["%s · %s", "%s · %s"],
    // Bomba e Plenificador
    "cl.mkl.bomba": ["Bomba Elétrica: tira fluido de baixo (até 80 blocos ligados); a água não acaba (fonte infinita), a lava sim. Baldes vazios no baú de cima voltam cheios; um Cano em modo TIRA leva o fluido. Agora: %s.", "Electric Pump: pulls fluid from below (up to 80 connected blocks); water never runs out (infinite source), lava does. Empty buckets in the chest above come back full; a Pipe in PULL mode carries the fluid. Now: %s."],
    "cl.mkl.plenificador": ["Plenificador Fluídico: espalha o fluido em volta e embaixo (de baixo para cima). Baldes cheios no baú de cima, ou um Cano chegando. Agora: %s.", "Fluidic Plenisher: spreads the fluid around and below (bottom first). Full buckets in the chest above, or a Pipe coming in. Now: %s."],
    // Minerador Digital
    "cl.mkl.minerador.titulo": ["Minerador Digital", "Digital Miner"],
    "cl.mkl.minerador.ligado": ["Ligado", "Running"],
    "cl.mkl.minerador.raio": ["Raio", "Radius"],
    "cl.mkl.minerador.ymin": ["Altura mínima", "Min Y"],
    "cl.mkl.minerador.ymax": ["Altura máxima", "Max Y"],
    "cl.mkl.minerador.suave": ["Toque Suave (×12 energia)", "Silk Touch (×12 energy)"],
    "cl.mkl.minerador.inverso": ["Inverso (minera tudo, menos os filtros)", "Inverse (mines everything except the filters)"],
    "cl.mkl.minerador.filtros": ["Filtros (ids de bloco separados por vírgula; #minerios = todos os minérios)", "Filters (block ids separated by commas; #minerios = all ores)"],
    "cl.mkl.minerador.mao": ["Adicionar o bloco da mão aos filtros", "Add the held block to the filters"],
    "cl.mkl.minerador.corpo": ["Minera o quadrado de lado %s em volta, da altura máxima para a mínima, e guarda no baú de cima. Sem filtros, só minera no modo Inverso. Energia por bloco: %s. Faltam olhar %s posições.", "Mines the square of side %s around it, from max height to min, and stores in the chest above. With no filters it only mines in Inverse mode. Energy per block: %s. %s positions left to check."],
    "cl.mkl.minerador.estado": ["%s · raio %s · y %s a %s · %s filtro(s)%s", "%s · radius %s · y %s to %s · %s filter(s)%s"],
    "cl.mkl.minerador.cheio": ["O baú de cima está cheio.", "The chest above is full."],
    "cl.mkl.minerador.terminou": ["terminou", "finished"],
    "cl.mkl.desligado": ["desligado", "off"],
    // Carregador de Chão e Entrelaçador
    "cl.mkl.carregador": ["Carregador de Chão: fique em cima e os itens com energia da mochila carregam (puxa da rede).", "Chargepad: stand on it and the energy items in your inventory charge (draws from the grid)."],
    "cl.mkl.freq.titulo": ["Frequência", "Frequency"],
    "cl.mkl.freq.nome": ["Nome da frequência (vazio = desligado)", "Frequency name (empty = off)"],
    "cl.mkl.freq.privada": ["Privada (só você)", "Private (only you)"],
    "cl.mkl.freq.ok": ["Frequência: %s (%s ligados).", "Frequency: %s (%s linked)."],
    "cl.mkl.freq.nenhuma": ["sem frequência", "no frequency"],
    "cl.mkl.qe.corpo": ["Entrelaçador Quântico: tudo da mesma frequência é um lugar só, em qualquer distância ou dimensão: 1 espaço de item (baú de cima entra, baú de baixo sai), energia (a de um Cubo Definitivo, pela rede), fluido e químico (Canos e Tubos).", "Quantum Entangloporter: everything on the same frequency is one place, at any distance or dimension: 1 item slot (chest above in, chest below out), energy (an Ultimate Cube's worth, via the grid), fluid and chemical (Pipes and Tubes)."],
    "cl.mkl.qe.estado": ["%s · item: %s · %s E · fluido: %s · químico: %s", "%s · item: %s · %s E · fluid: %s · chemical: %s"],
    // Classificador
    "cl.mkl.classificador.titulo": ["Classificador Logístico", "Logistical Sorter"],
    "cl.mkl.classificador.corpo": ["Puxa do inventário de trás e manda pela frente (baú ou Transportador Logístico). Só os itens dos filtros saem, a não ser que o Padrão esteja ligado.", "Pulls from the inventory behind and sends out the front (chest or Logistical Transporter). Only filtered items leave, unless Default is on."],
    "cl.mkl.classificador.filtros": ["Filtros (ids de item separados por vírgula)", "Filters (item ids separated by commas)"],
    "cl.mkl.classificador.padrao": ["Padrão: mandar também o que não está nos filtros", "Default: also send what is not filtered"],
    "cl.mkl.classificador.um": ["Um item por vez", "Single item"],
    "cl.mkl.classificador.mao": ["Adicionar o item da mão aos filtros", "Add the held item to the filters"],
    "cl.mkl.classificador.estado": ["%s filtro(s) · padrão %s", "%s filter(s) · default %s"],
    // Sísmico e alarme
    "cl.mkl.vibrador": ["Vibrador Sísmico: ligado na energia, deixa o Leitor Sísmico ler o subsolo no mesmo chunk. Agora: %s.", "Seismic Vibrator: when powered, lets the Seismic Reader read the ground in the same chunk. Now: %s."],
    "cl.mkl.vibrando": ["vibrando", "vibrating"],
    "cl.mkl.leitor.sem_vibrador": ["Precisa de um Vibrador Sísmico ligado neste chunk.", "Needs a powered Seismic Vibrator in this chunk."],
    "cl.mkl.leitor.sem_carga": ["Leitor sem carga (carregue num carregador).", "Reader out of charge (charge it in a charger)."],
    "cl.mkl.leitor.titulo": ["Leitor Sísmico (x %s, z %s)", "Seismic Reader (x %s, z %s)"],
    "cl.mkl.leitor.total": ["Do seu pé até o fundo:", "From your feet to the bottom:"],
    "cl.mkl.leitor.minerios": ["Minérios por altura:", "Ores by height:"],
    "cl.mkl.alarme": ["Alarme Industrial: toca enquanto recebe sinal de redstone.", "Industrial Alarm: sounds while it receives a redstone signal."],
    // Teletransporte
    "cl.mkl.tp.corpo": ["Teletransportador: monte a moldura (3 de largura, 4 de altura, o Teletransportador no meio de baixo, 2 de vão por dentro) e ponha uma frequência. Quem entrar no vão vai para o Teletransportador mais perto da mesma frequência (energia: 1.000 J + 10 J por bloco; outra dimensão +10.000 J). Moldura: %s.", "Teleporter: build the frame (3 wide, 4 tall, the Teleporter in the bottom middle, a 2-block gap inside) and set a frequency. Whoever steps in goes to the nearest Teleporter on the same frequency (energy: 1,000 J + 10 J per block; another dimension +10,000 J). Frame: %s."],
    "cl.mkl.tp.moldura_ok": ["completa", "complete"],
    "cl.mkl.tp.moldura_falta": ["incompleta", "incomplete"],
    "cl.mkl.tp.sem_destino": ["Nenhum outro Teletransportador nessa frequência.", "No other Teleporter on this frequency."],
    "cl.mkl.tp.sem_energia": ["Falta energia para o teletransporte (%s).", "Not enough energy to teleport (%s)."],
    "cl.mkl.tp.portatil": ["Teletransportador Portátil", "Portable Teleporter"],
    "cl.mkl.tp.escolha": ["Para qual frequência? (carga: %s)", "To which frequency? (charge: %s)"],
    "cl.mkl.tp.nenhuma": ["Nenhum Teletransportador com frequência que você possa usar.", "No Teleporter with a frequency you can use."],
    // Missões
    ...missao("mk_chumbo", "Chumbo", "Lead", "Junte 8 Lingotes de Chumbo (o minério fica abaixo da altura 64, mais comum perto de -12).", "Collect 8 Lead Ingots (the ore is below height 64, most common near -12)."),
    ...missao("mk_caixa", "Caixa do Mekanism", "Mekanism Bin", "Coloque uma Caixa Básica: 4.096 de um item só.", "Place a Basic Bin: 4,096 of a single item."),
    ...missao("mk_cabo", "Cabo Universal", "Universal Cable", "Coloque um Cabo Universal Básico (leva energia como os outros cabos).", "Place a Basic Universal Cable (carries energy like the other cables)."),
    ...missao("mk_cano", "Canos e Tubos", "Pipes and Tubes", "Leve fluido ou químico de uma máquina a um tanque com um Cano Mecânico ou Tubo Pressurizado no modo TIRA.", "Move fluid or chemical from a machine to a tank with a Mechanical Pipe or Pressurized Tube in PULL mode."),
    ...missao("mk_transportador", "Transportador Logístico", "Logistical Transporter", "Leve itens de um baú a outro com Transportadores Logísticos.", "Move items between chests with Logistical Transporters."),
    ...missao("mk_minerador", "Minerador Digital", "Digital Miner", "Minere 64 blocos com o Minerador Digital.", "Mine 64 blocks with the Digital Miner."),
    ...missao("mk_teletransporte", "Teletransporte", "Teleportation", "Use um Teletransportador com a moldura (ou o Portátil).", "Use a framed Teleporter (or the Portable one)."),
    ...missao("mk_entrelacador", "Entrelaçamento Quântico", "Quantum Entanglement", "Coloque um Entrelaçador Quântico.", "Place a Quantum Entangloporter."),
    ...missao("mk_sismico", "Leitura Sísmica", "Seismic Reading", "Leia o subsolo com o Leitor Sísmico perto de um Vibrador ligado.", "Read the ground with the Seismic Reader near a powered Vibrator."),
  },
  dados: {
    caixas: Object.fromEntries(D.caixas.map((c) => [c.id, [1, 0, c.cap]])),
    cabos: D.transmissores.filter((t) => t.tipo === "cabo_universal").map((t) => `cl:${t.id}`),
    transmissores: Object.fromEntries(D.transmissores.filter((t) => t.tipo !== "cabo_universal").map((t) => [`cl:${t.id}`, [t.tipo, t.taxa]])),
    niveis: Object.fromEntries(D.transmissores.map((t) => [`cl:${t.id}`, NIVEL[t.nivel]])),
    energia: D.energia,
  },
};

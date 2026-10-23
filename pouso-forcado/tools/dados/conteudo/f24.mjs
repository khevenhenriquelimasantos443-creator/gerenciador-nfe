// Fase 24 (1.3.0): Mekanism leve. Sem rede de gás nem reatores: o gás anda em cilindros (itens).
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 100, ...extra });
const CILINDROS = [
  ["vazio", "Cilindro de Gás Vazio", "Empty Gas Tank", "#9aa3ab"],
  ["hidrogenio", "Cilindro de Hidrogênio", "Hydrogen Tank", "#e8f2ff"],
  ["oxigenio", "Cilindro de Oxigênio", "Oxygen Tank", "#6fb7ff"],
  ["cloro", "Cilindro de Cloro", "Chlorine Tank", "#c8e86a"],
  ["acido", "Cilindro de Ácido Clorídrico", "Hydrogen Chloride Tank", "#a7e0a0"],
];
const CUBOS = [
  ["basico", "Básico", "Basic", "cinza", 200],
  ["avancado", "Avançado", "Advanced", "vermelho", 800],
  ["elite", "de Elite", "Elite", "azul", 3200],
  ["definitivo", "Definitivo", "Ultimate", "violeta", 12800],
];
const cor = { cinza: "branco" };

export default {
  fase: 24,
  mod: "Mekanism",
  itens: [
    ...CILINDROS.map(([id, pt, en, c]) => ({ id: `cilindro_${id}`, pt, en, icone: `garrafa:${c}`, pilha: 16 })),
    { id: "balde_salmoura", pt: "Balde de Salmoura", en: "Brine Bucket", icone: "gota:#d8e8c8", pilha: 1 },
    { id: "po_litio", pt: "Pó de Lítio", en: "Lithium Dust", icone: "po:#e6e6f0" },
    { id: "liga_enriquecida", pt: "Liga Enriquecida", en: "Enriched Alloy", icone: "placa:#e05050" },
    { id: "liga_reforcada", pt: "Liga Reforçada", en: "Reinforced Alloy", icone: "placa:#5ad0e0" },
    { id: "liga_atomica", pt: "Liga Atômica", en: "Atomic Alloy", icone: "placa:#b45ae0" },
    { id: "jetpack", pt: "Jetpack", en: "Jetpack", icone: "tablet:#c0c6cc", pilha: 1, comp: { "minecraft:wearable": { slot: "slot.armor.chest", protection: 2 } } },
  ],
  blocos: [
    maq("separador_eletrolitico", "Separador Eletrolítico", "Electrolytic Separator", "azul", "gota"),
    maq("evaporador", "Evaporador Térmico", "Thermal Evaporation Controller", "amarelo", "floco", { tick: 200 }),
    maq("infusor_quimico", "Infusor Químico", "Chemical Infuser", "verde", "circulo"),
    maq("camara_purificacao", "Câmara de Purificação", "Purification Chamber", "azul", "cristal"),
    maq("camara_injecao", "Câmara de Injeção Química", "Chemical Injection Chamber", "verde", "cristal"),
    maq("infusor_metalurgico", "Infusor Metalúrgico", "Metallurgic Infuser", "vermelho", "engrenagem"),
    ...CUBOS.map(([id, pt, en, luz]) => ({ id: `cubo_energia_${id}`, pt: `Cubo de Energia ${pt}`, en: `${en} Energy Cube`, tipo: "maquina", luz: cor[luz] ?? luz, glifo: "raio", comp: "cl:celula_energia", girar: false, loot: "loot_tables/cl/vazio.json" })),
  ],
  receitas: [
    { id: "cilindro_vazio", tipo: "shaped", padrao: [" F ", "FVF", " F "], chave: { F: "minecraft:iron_ingot", V: "minecraft:glass" }, resultado: "cl:cilindro_vazio", qtd: 4 },
    { id: "separador_eletrolitico", tipo: "shaped", padrao: ["RFR", "CEC", "RFR"], chave: { R: "minecraft:redstone", F: "minecraft:iron_ingot", C: "cl:cilindro_vazio", E: "cl:estrutura_maquina" }, resultado: "cl:separador_eletrolitico" },
    { id: "evaporador", tipo: "shaped", padrao: ["VVV", "CEC", "AAA"], chave: { V: "minecraft:glass", C: "minecraft:copper_ingot", E: "cl:estrutura_maquina", A: "cl:lingote_aco" }, resultado: "cl:evaporador" },
    { id: "infusor_quimico", tipo: "shaped", padrao: ["CLC", "AEA", "CLC"], chave: { C: "cl:cilindro_vazio", L: "cl:liga_enriquecida", A: "cl:lingote_aco", E: "cl:estrutura_maquina" }, resultado: "cl:infusor_quimico" },
    { id: "camara_purificacao", tipo: "shaped", padrao: ["LCL", "OEO", "LCL"], chave: { L: "cl:liga_enriquecida", C: "cl:cilindro_vazio", O: "minecraft:gold_ingot", E: "cl:pulverizador" }, resultado: "cl:camara_purificacao" },
    { id: "camara_injecao", tipo: "shaped", padrao: ["RCR", "OEO", "RCR"], chave: { R: "cl:liga_reforcada", C: "cl:cilindro_vazio", O: "minecraft:gold_ingot", E: "cl:camara_purificacao" }, resultado: "cl:camara_injecao" },
    { id: "infusor_metalurgico", tipo: "shaped", padrao: ["AFA", "RER", "AFA"], chave: { A: "cl:lingote_aco", F: "minecraft:furnace", R: "minecraft:redstone", E: "cl:estrutura_maquina" }, resultado: "cl:infusor_metalurgico" },
    { id: "cubo_energia_basico", tipo: "shaped", padrao: ["RAR", "CEC", "RAR"], chave: { R: "minecraft:redstone", A: "cl:lingote_aco", C: "cl:bateria", E: "cl:estrutura_maquina" }, resultado: "cl:cubo_energia_basico" },
    ...[["avancado", "basico", "liga_enriquecida"], ["elite", "avancado", "liga_reforcada"], ["definitivo", "elite", "liga_atomica"]].map(([de, base, liga]) => ({
      id: `cubo_energia_${de}`, tipo: "shaped", padrao: ["LAL", "ACA", "LAL"], chave: { L: `cl:${liga}`, A: "cl:lingote_aco", C: `cl:cubo_energia_${base}` }, resultado: `cl:cubo_energia_${de}`,
    })),
    { id: "jetpack", tipo: "shaped", padrao: ["AHA", "LCL", "A A"], chave: { A: "cl:lingote_aco", H: "cl:cilindro_hidrogenio", L: "cl:liga_enriquecida", C: "minecraft:iron_chestplate" }, resultado: "cl:jetpack" },
  ],
  textos: {
    "cl.mk.separador": ["Separador Eletrolítico: água (balde ou garrafa) ou salmoura + 2 cilindros vazios no baú de cima = hidrogênio + oxigênio (ou cloro, da salmoura) embaixo. 1 E.", "Electrolytic Separator: water (bucket or bottle) or brine + 2 empty tanks in the chest above = hydrogen + oxygen (or chlorine, from brine) below. 1 E."],
    "cl.mk.evaporador": ["Evaporador Térmico: só de dia e com céu aberto. Balde de água em cima vira Balde de Salmoura (e às vezes sal); salmoura vira Pó de Lítio.", "Thermal Evaporator: only by day under open sky. A water bucket above becomes a Brine Bucket (and sometimes salt); brine becomes Lithium Dust."],
    "cl.mk.infusor_quimico": ["Infusor Químico: hidrogênio + cloro = ácido clorídrico (devolve 1 cilindro vazio). 0,5 E.", "Chemical Infuser: hydrogen + chlorine = hydrogen chloride (returns 1 empty tank). 0.5 E."],
    "cl.mk.purificacao": ["Câmara de Purificação: minério + oxigênio = 3 pós (cada cilindro dá 4 minérios). 1 E.", "Purification Chamber: ore + oxygen = 3 dusts (each tank does 4 ores). 1 E."],
    "cl.mk.injecao": ["Câmara de Injeção: minério + ácido clorídrico = 4 pós (cada cilindro dá 4 minérios). 2 E.", "Injection Chamber: ore + hydrogen chloride = 4 dusts (each tank does 4 ores). 2 E."],
    "cl.mk.infusor_metalurgico": ["Infusor Metalúrgico: ferro + redstone = Liga Enriquecida; + diamante = Reforçada; + obsidiana = Atômica; ferro + 2 carvões = aço. 0,5 E.", "Metallurgic Infuser: iron + redstone = Enriched Alloy; + diamond = Reinforced; + obsidian = Atomic; iron + 2 coal = steel. 0.5 E."],
    "cl.mk.gas": ["Gás guardado: %s", "Stored gas: %s"],
    "cl.mk.jetpack": ["Jetpack: %s/%s de hidrogênio", "Jetpack: %s/%s hydrogen"],
    "cl.mk.jetpack_vazio": ["O jetpack está sem hidrogênio. Com ele vestido, use um Cilindro de Hidrogênio para encher.", "The jetpack is out of hydrogen. Wearing it, use a Hydrogen Tank to refill."],
    "cl.mk.jetpack_cheio": ["Jetpack abastecido: %s/%s.", "Jetpack refueled: %s/%s."],
    "cl.capitulo.mekanism.nome": ["Mekanism", "Mekanism"],
    "cl.capitulo.mekanism.desc": ["Gás em cilindros, minério em 3 e 4 vezes, ligas, cubos de energia e o jetpack.", "Gas in tanks, ore tripling and quadrupling, alloys, energy cubes and the jetpack."],
    "cl.missao.me_separador.titulo": ["Eletrólise", "Electrolysis"], "cl.missao.me_separador.desc": ["Separe a água em hidrogênio e oxigênio 4 vezes no Separador Eletrolítico.", "Split water into hydrogen and oxygen 4 times in the Electrolytic Separator."],
    "cl.missao.me_salmoura.titulo": ["Salmoura", "Brine"], "cl.missao.me_salmoura.desc": ["Faça um Balde de Salmoura no Evaporador Térmico.", "Make a Brine Bucket in the Thermal Evaporator."],
    "cl.missao.me_purificar.titulo": ["Minério ×3", "Ore ×3"], "cl.missao.me_purificar.desc": ["Purifique 8 minérios na Câmara de Purificação.", "Purify 8 ores in the Purification Chamber."],
    "cl.missao.me_injetar.titulo": ["Minério ×4", "Ore ×4"], "cl.missao.me_injetar.desc": ["Processe 8 minérios na Câmara de Injeção Química.", "Process 8 ores in the Chemical Injection Chamber."],
    "cl.missao.me_cubo.titulo": ["Cubo de Energia", "Energy Cube"], "cl.missao.me_cubo.desc": ["Coloque um Cubo de Energia Básico na rede.", "Place a Basic Energy Cube on the network."],
    "cl.missao.me_jetpack.titulo": ["Voando", "Flying"], "cl.missao.me_jetpack.desc": ["Vista o Jetpack, encha de hidrogênio e voe (segure pular).", "Wear the Jetpack, fill it with hydrogen and fly (hold jump)."],
  },
  dados: {
    cubos: Object.fromEntries(CUBOS.map(([id, , , , cap]) => [`cl:cubo_energia_${id}`, cap])),
  },
};

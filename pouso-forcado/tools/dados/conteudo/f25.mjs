// Fase 25 (1.3.0): BuildCraft (petróleo, bomba, refinaria, motor e pedreira) e OpenBlocks (asa-delta,
// túmulo e elevador). Scripts em scripts/maquinas/buildcraft.ts e scripts/jogador/openblocks.ts.
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 100, ...extra });
const ENGRENAGENS = [
  ["madeira", "de Madeira", "Wooden", "#a07c48"],
  ["pedra", "de Pedra", "Stone", "#8c8c8c"],
  ["ferro", "de Ferro", "Iron", "#d6d9dc"],
  ["ouro", "de Ouro", "Gold", "#f2c94c"],
  ["diamante", "de Diamante", "Diamond", "#6fe3e0"],
];
const OB = { mod: "OpenBlocks" };

export default {
  fase: 25,
  mod: "BuildCraft",
  itens: [
    ...ENGRENAGENS.map(([id, pt, en, cor]) => ({ id: `engrenagem_${id}`, pt: `Engrenagem ${pt}`, en: `${en} Gear`, icone: `engrenagem:${cor}` })),
    { id: "balde_petroleo", pt: "Balde de Petróleo", en: "Oil Bucket", icone: "gota:#1a1410", pilha: 1 },
    { id: "balde_combustivel", pt: "Balde de Combustível", en: "Fuel Bucket", icone: "gota:#e8d040", pilha: 1 },
    { id: "asa_delta", pt: "Asa-Delta", en: "Hang Glider", icone: "folha:#c08a50", pilha: 1, ...OB },
  ],
  blocos: [
    { id: "petroleo", pt: "Petróleo", en: "Oil", tipo: "cubo", cor: "#16110d", padrao: "polido", dureza: 1, loot: "loot_tables/cl/vazio.json", menu: "none" },
    maq("bomba", "Bomba", "Pump", "laranja", "gota"),
    maq("refinaria", "Refinaria", "Refinery", "amarelo", "chama"),
    maq("motor_combustao", "Motor a Combustão", "Combustion Engine", "laranja", "engrenagem"),
    maq("pedreira", "Pedreira", "Quarry", "amarelo", "serra", { tick: 40 }),
    {
      id: "tumulo", pt: "Túmulo", en: "Grave", tipo: "cubo", cor: "#8c8c8c", padrao: "rachado", comp: "cl:tumulo", dureza: 2, resistencia: 1200, loot: "loot_tables/cl/vazio.json", menu: "none", ...OB,
      geometria: { ossos: { tumulo: [[[-6, 0, -6], [12, 2, 12]], [[-4, 2, 2], [8, 10, 2]]] } },
      extra: { "minecraft:collision_box": { origin: [-6, 0, -6], size: [12, 12, 12] }, "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 12, 12] } },
    },
    { id: "elevador", pt: "Elevador", en: "Elevator", tipo: "cubo", cor: "#e6eaee", padrao: "ladrilho", topo: "polido", dureza: 1, ...OB },
  ],
  receitas: [
    { id: "engrenagem_madeira", tipo: "shaped", padrao: [" S ", "S S", " S "], chave: { S: "minecraft:stick" }, resultado: "cl:engrenagem_madeira" },
    ...[["pedra", "minecraft:cobblestone", "madeira"], ["ferro", "minecraft:iron_ingot", "pedra"], ["ouro", "minecraft:gold_ingot", "ferro"], ["diamante", "minecraft:diamond", "ouro"]].map(([id, mat, antes]) => ({
      id: `engrenagem_${id}`, tipo: "shaped", padrao: [" M ", "MGM", " M "], chave: { M: mat, G: `cl:engrenagem_${antes}` }, resultado: `cl:engrenagem_${id}`,
    })),
    { id: "bomba", tipo: "shaped", padrao: ["FGF", "FEF", "FBF"], chave: { F: "minecraft:iron_ingot", G: "cl:engrenagem_ferro", E: "cl:estrutura_maquina", B: "minecraft:bucket" }, resultado: "cl:bomba" },
    { id: "refinaria", tipo: "shaped", padrao: ["VGV", "CEC", "VGV"], chave: { V: "minecraft:glass", G: "cl:engrenagem_ouro", C: "minecraft:copper_ingot", E: "cl:estrutura_maquina" }, resultado: "cl:refinaria" },
    { id: "motor_combustao", tipo: "shaped", padrao: ["AAA", " V ", "GPG"], chave: { A: "cl:lingote_aco", V: "minecraft:glass", G: "cl:engrenagem_ferro", P: "minecraft:piston" }, resultado: "cl:motor_combustao" },
    { id: "pedreira", tipo: "shaped", padrao: ["FRF", "GDG", "DPD"], chave: { F: "minecraft:iron_ingot", R: "minecraft:redstone", G: "cl:engrenagem_ouro", D: "cl:engrenagem_diamante", P: "minecraft:diamond_pickaxe" }, resultado: "cl:pedreira" },
    { id: "asa_delta", tipo: "shaped", padrao: ["SLS", "LLL", " S "], chave: { S: "minecraft:stick", L: "minecraft:leather" }, resultado: "cl:asa_delta" },
    { id: "elevador", tipo: "shaped", padrao: ["CCC", "CPC", "CCC"], chave: { C: "minecraft:smooth_sandstone", P: "minecraft:ender_pearl" }, resultado: "cl:elevador", qtd: 2 },
  ],
  textos: {
    "cl.bc2.bomba": ["Bomba: puxa o petróleo do chão embaixo dela e enche os baldes vazios de um baú encostado do lado. 1 E por balde.", "Pump: pulls oil from the ground below and fills the empty buckets of a chest on its side. 1 E per bucket."],
    "cl.bc2.refinaria": ["Refinaria: Balde de Petróleo no baú de cima = Balde de Combustível no de baixo. 1 E.", "Refinery: Oil Bucket in the chest above = Fuel Bucket in the one below. 1 E."],
    "cl.bc2.motor": ["Motor a Combustão: queima combustível (60 E por balde) ou petróleo (20 E) do baú de cima, 2 E a cada 5 s. Guardado: %s", "Combustion Engine: burns fuel (60 E per bucket) or oil (20 E) from the chest above, 2 E every 5 s. Stored: %s"],
    "cl.bc2.pedreira": ["Pedreira: cava uma área de 9x9 atrás dela, camada por camada, até o fundo. Os blocos vão para o baú de cima. 0,25 E por bloco. Camada atual: y %s", "Quarry: digs a 9x9 area behind it, layer by layer, down to the bottom. Blocks go to the chest above. 0.25 E per block. Current layer: y %s"],
    "cl.bc2.pedreira_fim": ["Pedreira: terminou de cavar.", "Quarry: finished digging."],
    "cl.bc2.petroleo": ["Petróleo: pegue com um balde vazio ou use uma Bomba em cima.", "Oil: take it with an empty bucket or put a Pump on top."],
    "cl.ob.tumulo": ["Túmulo de %s: %s itens. Toque para pegar tudo.", "%s's grave: %s items. Tap to take everything."],
    "cl.ob.tumulo_criado": ["§7Seus itens ficaram num túmulo em X %s, Y %s, Z %s.", "§7Your items were left in a grave at X %s, Y %s, Z %s."],
    "cl.capitulo.buildcraft.nome": ["BuildCraft", "BuildCraft"],
    "cl.capitulo.buildcraft.desc": ["Petróleo do deserto, refinaria, motor a combustão e a pedreira.", "Desert oil, refinery, combustion engine and the quarry."],
    "cl.missao.bc_petroleo.titulo": ["Ouro negro", "Black gold"], "cl.missao.bc_petroleo.desc": ["Ache um poço de petróleo (manchas pretas no chão do deserto) e encha um balde.", "Find an oil well (black patches on the desert floor) and fill a bucket."],
    "cl.missao.bc_combustivel.titulo": ["Refino", "Refining"], "cl.missao.bc_combustivel.desc": ["Faça um Balde de Combustível na Refinaria.", "Make a Fuel Bucket in the Refinery."],
    "cl.missao.bc_motor.titulo": ["Motor", "Engine"], "cl.missao.bc_motor.desc": ["Gere energia com o Motor a Combustão.", "Make power with the Combustion Engine."],
    "cl.missao.bc_pedreira.titulo": ["Pedreira", "Quarry"], "cl.missao.bc_pedreira.desc": ["Deixe a Pedreira cavar 256 blocos.", "Let the Quarry dig 256 blocks."],
    "cl.missao.ob_asa.titulo": ["Voo livre", "Free flight"], "cl.missao.ob_asa.desc": ["Pule de um lugar alto segurando a Asa-Delta (3 couros, 3 gravetos).", "Jump from a high place holding the Hang Glider (3 leather, 3 sticks)."],
    "cl.missao.ob_elevador.titulo": ["Sobe e desce", "Up and down"], "cl.missao.ob_elevador.desc": ["Faça 2 Elevadores, um em cima do outro: pule para subir, agache para descer.", "Make 2 Elevators, one above the other: jump to go up, sneak to go down."],
    "cl.missao.ob_tumulo.titulo": ["De volta", "Back again"], "cl.missao.ob_tumulo.desc": ["Pegue seus itens de volta num Túmulo (ele aparece onde você morre).", "Get your items back from a Grave (it appears where you die)."],
  },
};

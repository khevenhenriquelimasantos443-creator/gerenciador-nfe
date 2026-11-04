// Fase 52 (1.33.0): Iron Jetpacks 26.1 (BlakeBr0; MIT, inclusive a arte), TorchMaster 21.9 (xalcon; MIT, inclusive a
// arte) (o Túmulo já existe desde a 1.3.0, do OpenBlocks). Arte por tools/importar-jetpacks-tochas.py; scripts em
// scripts/utilidades/jetpacks.ts e tochas.ts.
// - Jetpacks: os tiers do mod com os números do ModJetpacks.java (capacidade e gasto em RF, velocidades de subida, de
//   lado e de pairar) e as receitas geradas pelo mod (célula, propulsor, capacitor, jetpack, bobinas e alça). Carregam
//   nos Carregadores do Ender IO (com fio ou sem fio, até vestido).
// - Mega Tocha: nenhum monstro nasce sozinho num cubo de 64 blocos para cada lado. Lanterna Sinalizadora (Feral Flare):
//   acende o escuro num raio de 24 blocos com luzes invisíveis.
const IJ = { mod: "Iron Jetpacks" };
const TM = { mod: "TorchMaster" };
// [id, pt, en, tier, cor, armadura, material, capacidade, gasto, subida, aceleração, lado, pairarSobe, pairarDesce, pairarDevagar, corrida, corridaSubida, corridaGasto]
export const JETPACKS = [
  ["madeira", "Madeira", "Wood", 0, "#83663c", 1, "#minecraft:planks", 20000, 32, 0.18, 0.10, 0.06, 0.16, 0.25, 0.14, 1.0, 1.0, 1.0],
  ["pedra", "Pedra", "Stone", 1, "#7f7f7f", 2, "minecraft:cobblestone", 100000, 70, 0.25, 0.11, 0.08, 0.18, 0.25, 0.1, 1.0, 1.0, 1.0],
  ["cobre", "Cobre", "Copper", 1, "#ee825b", 2, "minecraft:copper_ingot", 250000, 85, 0.29, 0.11, 0.1, 0.23, 0.25, 0.092, 1.05, 1.025, 1.4],
  ["ferro", "Ferro", "Iron", 2, "#d8d8d8", 3, "minecraft:iron_ingot", 800000, 120, 0.41, 0.12, 0.14, 0.27, 0.25, 0.075, 1.1, 1.05, 2.1],
  ["bronze", "Bronze", "Bronze", 2, "#da9839", 3, "cl:lingote_bronze", 800000, 120, 0.41, 0.12, 0.14, 0.27, 0.25, 0.075, 1.1, 1.05, 2.1],
  ["ouro", "Ouro", "Gold", 3, "#f9eb59", 2, "minecraft:gold_ingot", 10000000, 300, 0.61, 0.13, 0.15, 0.34, 0.25, 0.03, 1.5, 1.25, 3.2],
  ["aco", "Aço", "Steel", 3, "#565656", 3, "cl:lingote_aco", 12000000, 350, 0.67, 0.135, 0.155, 0.35, 0.25, 0.025, 1.5, 1.25, 3.2],
  ["diamante", "Diamante", "Diamond", 4, "#4cf4e0", 4, "minecraft:diamond", 30000000, 650, 0.90, 0.15, 0.19, 0.41, 0.25, 0.005, 1.8, 1.4, 3.8],
  ["esmeralda", "Esmeralda", "Emerald", 5, "#4dd979", 4, "minecraft:emerald", 48000000, 880, 1.03, 0.17, 0.21, 0.45, 0.25, 0.0, 2.0, 1.5, 4.0],
  ["criativo", "Criativo", "Creative", 6, "#cf1ae9", 8, null, 0, 0, 1.03, 0.17, 0.21, 0.45, 0.25, 0.0, 2.0, 1.5, 0.0],
];
// As bobinas por tier (JetpackRegistry.getCoilForTier: a fração do tier entre os 6 tiers do mod).
const BOBINA = { 0: "bobina_basica", 1: "bobina_basica", 2: "bobina_avancada", 3: "bobina_avancada", 4: "bobina_elite", 5: "bobina_suprema" };
const ANTERIOR = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
const jet = (id) => `jetpack_${id}`;

export default {
  fase: 52,
  mod: "Iron Jetpacks",
  itens: [
    { id: "alca_jetpack", pt: "Alça de Jetpack", en: "Strap", icone: "bola:#8a5a2a", ...IJ },
    ...[["bobina_basica", "Bobina Básica", "Basic Coil"], ["bobina_avancada", "Bobina Avançada", "Advanced Coil"], ["bobina_elite", "Bobina de Elite", "Elite Coil"], ["bobina_suprema", "Bobina Suprema", "Ultimate Coil"]]
      .map(([id, pt, en]) => ({ id, pt, en, icone: "bola:#c84a3a", ...IJ })),
    ...JETPACKS.filter((x) => x[0] !== "criativo").flatMap(([id, pt, en, , cor]) => [
      { id: `celula_${id}`, pt: `Célula de ${pt}`, en: `${en} Cell`, icone: `bola:${cor}`, ...IJ },
      { id: `propulsor_${id}`, pt: `Propulsor de ${pt}`, en: `${en} Thruster`, icone: `bola:${cor}`, ...IJ },
      { id: `capacitor_${id}`, pt: `Capacitor de ${pt}`, en: `${en} Capacitor`, icone: `bola:${cor}`, ...IJ },
    ]),
    ...JETPACKS.map(([id, pt, en, tier, cor, prot]) => ({
      id: jet(id), pt: `Jetpack de ${pt}`, en: `${en} Jetpack`, icone: `bola:${cor}`, pilha: 1, cat: "equipment", ...IJ,
      comp: { "minecraft:wearable": { slot: "slot.armor.chest", protection: prot }, "minecraft:tags": { tags: ["cl:jetpack", `cl:jetpack_t${tier}`] } },
    })),
  ],
  blocos: [
    {
      id: "tocha_mega", pt: "Mega Tocha", en: "Mega Torch", tipo: "cubo", cor: "#f2a53a", dureza: 1, luzEmite: 15, comp: "cl:tocha_mega", ...TM,
      geometria: { ossos: { tocha: [[[-2, 0, -2], [4, 16, 4]]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_tocha_mega", render_method: "alpha_test" } }, "minecraft:collision_box": { origin: [-2, 0, -2], size: [4, 16, 4] }, "minecraft:selection_box": { origin: [-2, 0, -2], size: [4, 16, 4] } },
    },
    {
      id: "lanterna_feral", pt: "Lanterna Sinalizadora", en: "Feral Flare Lantern", tipo: "cubo", cor: "#f2c84b", dureza: 1, luzEmite: 15, comp: "cl:lanterna_feral", ...TM,
      geometria: { ossos: { lanterna: [[[-3, 0, -3], [6, 6, 6]]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_lanterna_feral", render_method: "alpha_test" } }, "minecraft:collision_box": { origin: [-3, 0, -3], size: [6, 6, 6] }, "minecraft:selection_box": { origin: [-3, 0, -3], size: [6, 6, 6] } },
    },
  ],
  receitas: [
    { id: "alca_jetpack", tipo: "shaped", padrao: [" I ", "LLL", " I "], chave: { L: "minecraft:leather", I: "minecraft:iron_nugget" }, resultado: "cl:alca_jetpack" },
    ...[["bobina_basica", "minecraft:iron_ingot"], ["bobina_avancada", "minecraft:gold_ingot"], ["bobina_elite", "minecraft:diamond"], ["bobina_suprema", "minecraft:emerald"]]
      .map(([id, d]) => ({ id, tipo: "shaped", padrao: [" DR", "DSD", "RD "], chave: { R: "minecraft:redstone", D: d, S: "minecraft:stick" }, resultado: `cl:${id}` })),
    ...JETPACKS.filter((x) => x[0] !== "criativo").flatMap(([id, , , tier, , , mat]) => {
      const C = `cl:${BOBINA[tier]}`;
      return [
        { id: `celula_${id}`, tipo: "shaped", padrao: [" R ", "MCM", " R "], chave: { R: "minecraft:redstone", M: mat, C }, resultado: `cl:celula_${id}` },
        { id: `propulsor_${id}`, tipo: "shaped", padrao: ["MCM", "CEC", "MFM"], chave: { M: mat, C, E: `cl:celula_${id}`, F: "minecraft:furnace" }, resultado: `cl:propulsor_${id}` },
        { id: `capacitor_${id}`, tipo: "shaped", padrao: ["MEM", "MEM", "MEM"], chave: { M: mat, E: `cl:celula_${id}` }, resultado: `cl:capacitor_${id}` },
        tier === 0
          ? { id: jet(id), tipo: "shaped", padrao: ["MCM", "MSM", "T T"], chave: { M: mat, C: `cl:capacitor_${id}`, S: "cl:alca_jetpack", T: `cl:propulsor_${id}` }, resultado: `cl:${jet(id)}` }
          : { id: jet(id), tipo: "shaped", padrao: ["MCM", "MJM", "T T"], chave: { M: mat, C: `cl:capacitor_${id}`, J: `#cl:jetpack_t${ANTERIOR[tier]}`, T: `cl:propulsor_${id}` }, resultado: `cl:${jet(id)}` },
      ];
    }),
    { id: "tocha_mega", tipo: "shaped", padrao: ["TTT", "WDW", "GLG"], chave: { T: "minecraft:torch", W: "#minecraft:logs", D: "minecraft:diamond_block", G: "minecraft:gold_block", L: "#minecraft:logs" }, resultado: "cl:tocha_mega" },
    { id: "lanterna_feral", tipo: "shaped", padrao: [" G ", "GLG", " O "], chave: { G: "minecraft:gold_ingot", L: "minecraft:glowstone", O: "minecraft:obsidian" }, resultado: "cl:lanterna_feral" },
  ],
  textos: {
    "cl.jet.carga": ["§7%s / %s RF", "§7%s / %s RF"],
    "cl.jet.sem_energia": ["Jetpack sem energia: carregue num Carregador do Ender IO.", "Jetpack out of energy: charge it in an Ender IO Charger."],
    "cl.jet.pairar_on": ["Jetpack: pairar ligado (agache duas vezes no ar para trocar).", "Jetpack: hover on (sneak twice in the air to toggle)."],
    "cl.jet.pairar_off": ["Jetpack: pairar desligado.", "Jetpack: hover off."],
    "cl.tm.mega": ["Mega Tocha: nenhum monstro nasce sozinho a 64 blocos daqui.", "Mega Torch: no monster spawns naturally within 64 blocks."],
    "cl.tm.lanterna": ["Lanterna Sinalizadora: acendendo o escuro num raio de 24 blocos.", "Feral Flare Lantern: lighting up the dark within 24 blocks."],
    "cl.capitulo.jetpacks.nome": ["Jetpacks, Tochas e Túmulo", "Jetpacks, Torches and Grave"],
    "cl.capitulo.jetpacks.curto": ["Jetpacks", "Jetpacks"],
    "cl.capitulo.jetpacks.desc": ["Os jetpacks do Iron Jetpacks (de madeira a esmeralda) com energia RF: segure o pulo para subir; no ar, sem pular, ele paira. A Mega Tocha segura os monstros longe e a Lanterna Sinalizadora acende o escuro. Morrer deixa um Túmulo com tudo (OpenBlocks).", "The Iron Jetpacks jetpacks (wood to emerald) with RF energy: hold jump to rise; in the air, without jumping, it hovers. The Mega Torch keeps monsters away and the Feral Flare Lantern lights the dark. Dying leaves a Grave with everything (OpenBlocks)."],
    "cl.missao.ij_jetpack.titulo": ["Primeiro voo", "First flight"], "cl.missao.ij_jetpack.desc": ["Voe com um jetpack (carregado no Carregador do Ender IO).", "Fly with a jetpack (charged in an Ender IO Charger)."],
    "cl.missao.ij_diamante.titulo": ["Jetpack de Diamante", "Diamond Jetpack"], "cl.missao.ij_diamante.desc": ["Tenha um Jetpack de Diamante.", "Have a Diamond Jetpack."],
    "cl.missao.tm_mega.titulo": ["Mega Tocha", "Mega Torch"], "cl.missao.tm_mega.desc": ["Ponha uma Mega Tocha na base: monstros não nascem a 64 blocos.", "Place a Mega Torch at your base: monsters won't spawn within 64 blocks."],
    "cl.missao.tm_lanterna.titulo": ["Lanterna Sinalizadora", "Feral Flare Lantern"], "cl.missao.tm_lanterna.desc": ["Ponha uma Lanterna Sinalizadora numa caverna.", "Place a Feral Flare Lantern in a cave."],
  },
  dados: {
    jetpacks: Object.fromEntries(JETPACKS.map(([id, , , tier, , , , cap, gasto, sobe, acel, lado, ps, pd, pv, corr, corrSobe, corrGasto]) => [`cl:${jet(id)}`, { tier, cap, gasto, sobe, acel, lado, ps, pd, pv, corr, corrSobe, corrGasto }])),
  },
};

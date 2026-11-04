// Fase 46 (1.27.0): Tinkers' Construct 3 completo, parte 2 — o mundo dos slimes (SlimeKnights, MIT, inclusive a arte,
// copiada por tools/importar-slime-tc3.py). Terra, grama, folhas, capim, mudas e trepadeiras de slime nas cores do mod
// (terra, céu, icor, ender e sangue), os troncos e tábuas (Coração-Verde, Raízes-do-Céu, Cogumelo Sangrento,
// Casca-Ender), slime congelado (amortece a queda), blocos de slime, os geodos (cristal que cresce na drusa), bolas de
// slime e cristais. As ilhas, os geodos e os slimes novos: tools/importar-slime-tc3.py, tools/gerar-geracao.py,
// BP/entities e scripts/tinkers/slime.ts.
const TC = { mod: "Tinkers' Construct" };
const TIPOS = [
  ["terra", "Slime-da-Terra", "Earthslime", "#8cd782"], ["ceu", "Slime-do-Céu", "Skyslime", "#00f4da"], ["icor", "Icor", "Ichor", "#d09800"],
  ["ender", "Slime-do-Ender", "Enderslime", "#a92dff"], ["sangue", "Sangue", "Blood", "#b80000"],
];
const MADEIRAS = [
  ["verdecoracao", "Coração-Verde", "Greenheart", "#4f7a3a"], ["raizceu", "Raízes-do-Céu", "Skyroot", "#4fa0a0"],
  ["cogusangue", "Cogumelo Sangrento", "Bloodshroom", "#8a2a2a"], ["cascaender", "Casca-Ender", "Enderbark", "#3a2a4a"],
];
const lt = (id) => `loot_tables/cl/tc3/${id}.json`;
const planta = (id, pt, en, cor, extra = {}) => ({
  id, pt, en, tipo: "cubo", cor, dureza: 0, ...TC,
  extra: {
    "minecraft:geometry": "geometry.cl.planta",
    "minecraft:material_instances": { "*": { texture: `clc_${id}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
    "minecraft:collision_box": false,
    "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 13, 12] },
    "minecraft:light_dampening": 0,
    ...extra,
  },
});
const comTopo = (id, extraMats = {}) => ({
  "minecraft:material_instances": { "*": { texture: `clc_${id}`, render_method: "opaque" }, up: { texture: `clc_${id}_topo`, render_method: "opaque" }, down: { texture: `clc_${id}_baixo`, render_method: "opaque" }, ...extraMats },
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 46,
  mod: "Tinkers' Construct",
  itens: [
    ...TIPOS.filter(([t]) => t !== "terra").map(([t, pt, en, cor]) => ({ id: `bola_slime_${t}`, pt: t === "sangue" ? "Bola de Sangue" : `Bola de ${pt}`, en: t === "sangue" ? "Blood Ball" : `${en} Ball`, icone: `bola:${cor}`, ...TC })),
    ...TIPOS.filter(([t]) => t !== "sangue").map(([t, pt, en, cor]) => ({ id: `cristal_slime_${t}`, pt: `Cristal de ${pt}`, en: `${en} Crystal`, icone: `cristal:${cor}`, ...TC })),
  ],
  blocos: [
    ...TIPOS.filter(([t]) => t !== "sangue").map(([t, pt, en, cor]) => ({ id: `terra_slime_${t}`, pt: `Terra de ${pt}`, en: `${en} Dirt`, tipo: "cubo", cor, padrao: "pintas", dureza: 0.6, ...TC })),
    ...TIPOS.map(([t, pt, en, cor]) => ({
      id: `grama_slime_${t}`, pt: `Grama de ${pt}`, en: `${en} Grass`, tipo: "cubo", cor, padrao: "pintas", dureza: 0.7, loot: lt(`grama_slime_${t}`), ...TC,
      materiais: { topo: { cor, padrao: "liso" }, baixo: { cor: "#6a5a3a", padrao: "pintas" } },
      extra: comTopo(`grama_slime_${t}`),
    })),
    ...MADEIRAS.flatMap(([m, pt, en, cor]) => [
      { id: `tronco_${m}`, pt: `Tronco de ${pt}`, en: `${en} Log`, tipo: "cubo", cor, padrao: "pintas", topo: "liso", eixo: true, dureza: 2, ...TC },
      { id: `tabuas_${m}`, pt: `Tábuas de ${pt}`, en: `${en} Planks`, tipo: "cubo", cor, padrao: "liso", dureza: 2, ...TC },
    ]),
    ...TIPOS.map(([t, pt, en, cor]) => ({
      id: `folhas_slime_${t}`, pt: t === "sangue" || t === "icor" ? `Verrugas de ${pt}` : `Folhas de ${pt}`, en: `${en} Leaves`, tipo: "cubo", cor, dureza: 0.2, loot: lt(`folhas_slime_${t}`), ...TC,
      extra: { "minecraft:material_instances": { "*": { texture: `clc_folhas_slime_${t}`, render_method: "alpha_test" } }, "minecraft:light_dampening": 1 },
    })),
    ...TIPOS.map(([t, pt, en, cor]) => planta(`capim_slime_${t}`, `Capim de ${pt}`, `${en} Tall Grass`, cor, { "minecraft:loot": lt(`capim_slime_${t}`) })),
    ...TIPOS.map(([t, pt, en, cor]) => ({ ...planta(`muda_slime_${t}`, `Muda de ${pt}`, `${en} Sapling`, cor), comp: "cl:muda_slime", tick: [600, 1800] })),
    planta("trepadeira_slime_ceu", "Trepadeira de Slime-do-Céu", "Skyslime Vine", "#00f4da"),
    planta("trepadeira_slime_ender", "Trepadeira de Slime-do-Ender", "Enderslime Vine", "#a92dff"),
    ...TIPOS.map(([t, pt, en, cor]) => ({ id: `slime_congelado_${t}`, pt: `${pt} Congelado`, en: `Congealed ${en}`, tipo: "cubo", cor, padrao: "liso", dureza: 0.5, comp: "cl:slime_congelado", extra: { "minecraft:entity_fall_on": { min_fall_distance: 1 } }, ...TC })),
    ...TIPOS.filter(([t]) => t !== "terra").map(([t, pt, en, cor]) => ({
      id: `bloco_slime_${t}`, pt: t === "sangue" ? "Bloco de Sangue" : `Bloco de ${pt}`, en: `${en} Block`, tipo: "cubo", cor, padrao: "liso", dureza: 0, comp: "cl:slime_congelado", ...TC,
      extra: { "minecraft:material_instances": { "*": { texture: `clc_bloco_slime_${t}`, render_method: "blend" } }, "minecraft:light_dampening": 0, "minecraft:entity_fall_on": { min_fall_distance: 1 } },
    })),
    ...TIPOS.filter(([t]) => t !== "sangue").flatMap(([t, pt, en, cor]) => [
      { id: `bloco_cristal_slime_${t}`, pt: `Bloco de Cristal de ${pt}`, en: `${en} Crystal Block`, tipo: "cubo", cor, padrao: "liso", dureza: 1.5, ...TC },
      { id: `cristal_slime_brotando_${t}`, pt: `Drusa de Cristal de ${pt}`, en: `Budding ${en} Crystal`, tipo: "cubo", cor, padrao: "pintas", dureza: 1.5, comp: "cl:cristal_brotando", tick: [600, 1800], loot: "loot_tables/cl/vazio.json", ...TC },
      { ...planta(`cacho_cristal_slime_${t}`, `Aglomerado de Cristal de ${pt}`, `${en} Crystal Cluster`, cor, { "minecraft:loot": lt(`cacho_cristal_slime_${t}`), "minecraft:light_emission": 5 }), dureza: 1.5 },
    ]),
  ],
  receitas: [
    ...MADEIRAS.map(([m]) => ({ id: `tabuas_${m}`, tipo: "shapeless", ingredientes: [`cl:tronco_${m}`], resultado: `cl:tabuas_${m}`, qtd: 4 })),
    ...TIPOS.filter(([t]) => t !== "terra").flatMap(([t]) => [
      { id: `bloco_slime_${t}`, tipo: "shapeless", ingredientes: Array(9).fill(`cl:bola_slime_${t}`), resultado: `cl:bloco_slime_${t}` },
      { id: `bolas_slime_${t}`, tipo: "shapeless", ingredientes: [`cl:bloco_slime_${t}`], resultado: `cl:bola_slime_${t}`, qtd: 9 },
      { id: `slime_congelado_${t}`, tipo: "shaped", padrao: ["SS", "SS"], chave: { S: `cl:bola_slime_${t}` }, resultado: `cl:slime_congelado_${t}` },
    ]),
    { id: "slime_congelado_terra", tipo: "shaped", padrao: ["SS", "SS"], chave: { S: "minecraft:slime_ball" }, resultado: "cl:slime_congelado_terra" },
    ...TIPOS.filter(([t]) => t !== "sangue").map(([t]) => ({ id: `bloco_cristal_slime_${t}`, tipo: "shaped", padrao: ["CC", "CC"], chave: { C: `cl:cristal_slime_${t}` }, resultado: `cl:bloco_cristal_slime_${t}` })),
  ],
  dados: {
    // Muda -> árvore (tronco, folhas, altura base + aleatória: worldgen/configured_feature do TC3).
    arvores: {
      "cl:muda_slime_terra": ["cl:tronco_verdecoracao", "cl:folhas_slime_terra", 4, 3, ""],
      "cl:muda_slime_ceu": ["cl:tronco_raizceu", "cl:folhas_slime_ceu", 5, 4, "cl:trepadeira_slime_ceu"],
      "cl:muda_slime_ender": ["cl:tronco_cascaender", "cl:folhas_slime_ender", 5, 3, "cl:trepadeira_slime_ender"],
      "cl:muda_slime_sangue": ["cl:tronco_cogusangue", "cl:folhas_slime_sangue", 4, 3, ""],
      "cl:muda_slime_icor": ["cl:tronco_cogusangue", "cl:folhas_slime_icor", 4, 3, ""],
    },
    // Drusa -> aglomerado em volta (chance por tique aleatório, como a ametista: 1 em 5).
    cristais: { "cl:cristal_slime_brotando_terra": "cl:cacho_cristal_slime_terra", "cl:cristal_slime_brotando_ceu": "cl:cacho_cristal_slime_ceu", "cl:cristal_slime_brotando_icor": "cl:cacho_cristal_slime_icor", "cl:cristal_slime_brotando_ender": "cl:cacho_cristal_slime_ender" },
    // O que derrete na Fundição (smeltery/melting/slime do TC3).
    derrete: {
      "minecraft:slime_ball": ["slime", 250], "minecraft:slime": ["slime", 2250], "cl:slime_congelado_terra": ["slime", 1000], "cl:cristal_slime_terra": ["slime", 250],
      "cl:bola_slime_ceu": ["slime_ceu", 250], "cl:bloco_slime_ceu": ["slime_ceu", 2250], "cl:slime_congelado_ceu": ["slime_ceu", 1000], "cl:cristal_slime_ceu": ["slime_ceu", 250],
      "cl:bola_slime_ender": ["slime_ender", 250], "cl:bloco_slime_ender": ["slime_ender", 2250], "cl:slime_congelado_ender": ["slime_ender", 1000], "cl:cristal_slime_ender": ["slime_ender", 250],
      "cl:bola_slime_icor": ["icor", 250], "cl:bloco_slime_icor": ["icor", 2250], "cl:slime_congelado_icor": ["icor", 1000], "cl:cristal_slime_icor": ["icor", 250],
      "cl:bola_slime_sangue": ["sangue_blaze", 50], "cl:bloco_slime_sangue": ["sangue_blaze", 450], "cl:slime_congelado_sangue": ["sangue_blaze", 200],
    },
  },
  textos: {
    "entity.cl:slime_ceu.name": ["Slime-do-Céu", "Sky Slime"], "entity.cl:slime_ender.name": ["Slime-do-Ender", "Ender Slime"], "entity.cl:terracubo.name": ["Terracubo", "Terracube"],
    "item.spawn_egg.entity.cl:slime_ceu.name": ["Ovo de Slime-do-Céu", "Sky Slime Spawn Egg"], "item.spawn_egg.entity.cl:slime_ender.name": ["Ovo de Slime-do-Ender", "Ender Slime Spawn Egg"],
    "item.spawn_egg.entity.cl:terracubo.name": ["Ovo de Terracubo", "Terracube Spawn Egg"],
    ...missao("tc3_ilha", "Ilha de slime", "Slime island", "Ache uma ilha de slime flutuando no céu (ou no mar de lava do Nether, ou no End) e pegue Terra de Slime.", "Find a slime island floating in the sky (or on the Nether lava sea, or in the End) and get Slime Dirt."),
    ...missao("tc3_slime_ceu", "Slime do céu", "Sky slime", "Pegue 8 Bolas de Slime-do-Céu (dos Slimes-do-Céu das ilhas).", "Get 8 Skyslime Balls (from the Sky Slimes on the islands)."),
    ...missao("tc3_aco_slime", "Aço de Slime", "Slimesteel", "Faça Aço de Slime: ferro + slime do céu + pedra carbonizada na Fundição.", "Make Slimesteel: iron + sky slime + seared stone in the Smeltery."),
    ...missao("tc3_geodo", "Geodo de slime", "Slime geode", "Pegue 4 cristais de slime de um geodo (eles crescem nas drusas).", "Get 4 slime crystals from a geode (they grow on the budding blocks)."),
    ...missao("tc3_muda", "Árvore de slime", "Slime tree", "Plante uma muda de slime e deixe crescer.", "Plant a slime sapling and let it grow."),
  },
};

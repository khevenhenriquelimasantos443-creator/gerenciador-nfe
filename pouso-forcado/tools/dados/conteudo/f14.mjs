// Fase 14 (extra da 1.2.0): tamareira do HarvestCraft, com o cacho pendurado (scripts/harvest/tamareira.ts).
export default {
  fase: 14,
  mod: "Pam's HarvestCraft",
  itens: [
    { id: "tamara", pt: "Tâmara", en: "Date", icone: "bola:#7a4a2e", comp: { "minecraft:food": { nutrition: 1, saturation_modifier: 0.1 }, "minecraft:use_animation": "eat", "minecraft:use_modifiers": { use_duration: 0.8, movement_modifier: 0.35 } } },
  ],
  blocos: [
    {
      id: "muda_tamareira", pt: "Muda de Tamareira", en: "Date Palm Sapling", tipo: "cubo", cor: "#5b8a3a", padrao: "mosaico", comp: "cl:muda_tamareira", tick: [1200, 2400], dureza: 0.1, menu: "nature",
      materiais: { tronco: { cor: "#8a6a3e", padrao: "pilar" } },
      geometria: { ossos: { muda: [[[-1, 0, -1], [2, 6, 2], "tronco"], [[-4, 5, -4], [8, 4, 8]]] } },
      extra: { "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-4, 0, -4], size: [8, 9, 8] } },
    },
    {
      id: "cacho_tamaras", pt: "Cacho de Tâmaras", en: "Date Bunch", tipo: "cubo", cor: "#c9a046", padrao: "mosaico", comp: "cl:cacho_tamaras", tick: [2400, 3600], dureza: 0.3, menu: "none", loot: "loot_tables/cl/vazio.json",
      estados: { "cl:maduro": [0, 1, 2] },
      materiais: { madura: { cor: "#7a4a2e", padrao: "mosaico" } },
      geometria: {
        ossos: { verde: [[[-3, 7, -3], [6, 9, 6]]], madura: [[[-3, 7, -3], [6, 9, 6], "madura"]] },
        visivel: { verde: "q.block_state('cl:maduro') < 2", madura: "q.block_state('cl:maduro') == 2" },
      },
      extra: { "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-3, 7, -3], size: [6, 9, 6] } },
    },
  ],
  receitas: [],
  textos: {
    "cl.hc.cacho": ["Cacho de tâmaras: %s. Toque quando estiver maduro (marrom).", "Date bunch: %s. Tap when ripe (brown)."],
    "cl.hc.cacho.0": ["verde", "green"], "cl.hc.cacho.1": ["amadurecendo", "ripening"], "cl.hc.cacho.2": ["maduro", "ripe"],
    "cl.hc.muda": ["Muda de tamareira: cresce sozinha em uns 10 a 20 minutos, na areia ou terra, com céu aberto e 8 blocos livres em cima.", "Date palm sapling: grows by itself in about 10 to 20 minutes, on sand or dirt, with open sky and 8 free blocks above."],
    "cl.missao.hc_tamara.titulo": ["Oásis", "Oasis"], "cl.missao.hc_tamara.desc": ["Plante uma Muda de Tamareira (vem da peneira de areia) e colha 8 Tâmaras.", "Plant a Date Palm Sapling (from the sand sieve) and harvest 8 Dates."],
    "cl.missao.em_caldeirao.titulo": ["Água fervida", "Boiled water"], "cl.missao.em_caldeirao.desc": ["Ponha fogo, lava ou fogueira embaixo de um caldeirão com água e pegue 4 Águas Boas com a garrafa.", "Put fire, lava or a campfire under a cauldron of water and take 4 Good Waters with a bottle."],
    "cl.missao.em_variedade.titulo": ["Paladar", "Palate"], "cl.missao.em_variedade.desc": ["Prove 10 comidas diferentes. Repetir a mesma comida rende cada vez menos.", "Taste 10 different foods. Eating the same food over and over fills less each time."],
    "cl.var.enjoado": ["Enjoado de %s: rendeu só %s. Varie a comida.", "Tired of %s: only %s as filling. Vary your food."],
  },
};

// Fase 33 (1.12.0): Farmer's Delight (vectorwing, MIT): facas, Tábua de Cortar, Panela de Cozinha, Fogão, palha e lona,
// caixotes e as comidas com os números de FoodValues.java e as receitas do código público (branch 1.20).
// Reaproveita o que o pack já tem do HarvestCraft: tomate, cebola, arroz, repolho (plantação nova), massa e ovo frito.
// Efeitos: Nutrição (a fome não baixa) e Conforto (tira lentidão, fraqueza e fome) por script (scripts/maquinas/farmers.ts).
// Durações do Farmer's Delight: breve 600, curta 1.200, média 3.600 e longa 6.000 ticks.
const BREVE = 600, CURTA = 1200, MEDIA = 3600, LONGA = 6000;
const tigela = { using_converts_to: "minecraft:bowl" };
// [id, pt, en, fome, saturação, rápido?, extra do minecraft:food]
const comida = (id, pt, en, fome, sat, opc = {}) => ({
  id, pt, en, icone: opc.icone ?? "bola:#c08850", pilha: opc.tigela ? 16 : 64,
  comp: {
    "minecraft:use_animation": opc.bebida ? "drink" : "eat",
    "minecraft:use_modifiers": { use_duration: opc.rapido ? 0.8 : 1.6, movement_modifier: 0.35 },
    "minecraft:food": { nutrition: fome, saturation_modifier: sat, ...(opc.tigela ? tigela : {}), ...(opc.sempre ? { can_always_eat: true } : {}) },
  },
});
const T = { tigela: true };
const faca = (id, pt, en, usos, dano, mat) => ({
  id: `faca_${id}`, pt: `Faca de ${pt}`, en: `${en} Knife`, icone: "faca:#c8ccd0", pilha: 1,
  comp: { "minecraft:durability": { max_durability: usos }, "minecraft:damage": dano, "minecraft:hand_equipped": true, "minecraft:tags": { tags: ["cl:faca"] }, "minecraft:repairable": { repair_items: [{ items: [mat], repair_amount: Math.ceil(usos / 4) }] } },
});
const caixote = (id, pt, en, item, cor) => ({ id, pt, en, tipo: "cubo", cor, padrao: "tijolos", dureza: 2, girar: false, item });

export const CAIXOTES = [
  caixote("caixote_repolho", "Caixote de Repolho", "Cabbage Crate", "cl:repolho", "#7fbf4a"),
  caixote("caixote_tomate", "Caixote de Tomate", "Tomato Crate", "cl:tomate", "#e0402f"),
  caixote("caixote_cebola", "Caixote de Cebola", "Onion Crate", "cl:cebola", "#c9934f"),
  caixote("caixote_cenoura", "Caixote de Cenoura", "Carrot Crate", "minecraft:carrot", "#f08a24"),
  caixote("caixote_batata", "Caixote de Batata", "Potato Crate", "minecraft:potato", "#c8a24e"),
  caixote("caixote_beterraba", "Caixote de Beterraba", "Beetroot Crate", "minecraft:beetroot", "#a3232b"),
  caixote("saco_arroz", "Saco de Arroz", "Rice Bag", "cl:arroz", "#e8e0c8"),
  caixote("fardo_palha", "Fardo de Palha", "Straw Bale", "cl:palha", "#d8c06a"),
];

export default {
  fase: 33,
  mod: "Farmer's Delight",
  itens: [
    faca("silex", "Sílex", "Flint", 131, 3, "minecraft:flint"),
    faca("ferro", "Ferro", "Iron", 250, 4, "minecraft:iron_ingot"),
    faca("ouro", "Ouro", "Golden", 32, 3, "minecraft:gold_ingot"),
    faca("diamante", "Diamante", "Diamond", 1561, 5, "minecraft:diamond"),
    { id: "palha", pt: "Palha", en: "Straw", icone: "folha:#d8c06a" },
    { id: "lona", pt: "Lona", en: "Canvas", icone: "placa:#e8dcb5" },
    // ingredientes
    comida("folha_repolho", "Folha de Repolho", "Cabbage Leaf", 1, 0.4, { rapido: true, icone: "folha:#8fcf5a" }),
    comida("carne_moida", "Carne Moída", "Minced Beef", 2, 0.3, { rapido: true }),
    comida("hamburguer_carne", "Hambúrguer de Carne", "Beef Patty", 4, 0.8, { rapido: true }),
    comida("pedacos_frango", "Pedaços de Frango", "Chicken Cuts", 1, 0.3, { rapido: true }),
    comida("pedacos_frango_cozidos", "Pedaços de Frango Cozidos", "Cooked Chicken Cuts", 3, 0.6, { rapido: true }),
    comida("bacon", "Bacon", "Bacon", 2, 0.3, { rapido: true }),
    comida("bacon_cozido", "Bacon Cozido", "Cooked Bacon", 4, 0.8, { rapido: true }),
    comida("fatia_bacalhau", "Fatia de Bacalhau", "Cod Slice", 1, 0.1, { rapido: true }),
    comida("fatia_bacalhau_cozida", "Fatia de Bacalhau Cozida", "Cooked Cod Slice", 3, 0.5, { rapido: true }),
    comida("fatia_salmao", "Fatia de Salmão", "Salmon Slice", 1, 0.1, { rapido: true }),
    comida("fatia_salmao_cozida", "Fatia de Salmão Cozida", "Cooked Salmon Slice", 3, 0.8, { rapido: true }),
    comida("costeleta_carneiro", "Costeleta de Carneiro", "Mutton Chops", 1, 0.3, { rapido: true }),
    comida("costeleta_carneiro_cozida", "Costeleta de Carneiro Cozida", "Cooked Mutton Chops", 3, 0.8, { rapido: true }),
    comida("fatia_abobora", "Fatia de Abóbora", "Pumpkin Slice", 3, 0.3),
    comida("macarrao_cru", "Macarrão Cru", "Raw Pasta", 2, 0.3),
    comida("molho_tomate", "Molho de Tomate", "Tomato Sauce", 4, 0.4, T),
    comida("arroz_cozido", "Arroz Cozido", "Cooked Rice", 6, 0.4, T),
    // pratos da Panela
    comida("caldo_osso", "Caldo de Osso", "Bone Broth", 8, 0.7, { ...T, bebida: true }),
    comida("ensopado_carne", "Ensopado de Carne", "Beef Stew", 12, 0.8, T),
    comida("sopa_frango", "Sopa de Frango", "Chicken Soup", 12, 0.8, T),
    comida("ensopado_peixe", "Ensopado de Peixe", "Fish Stew", 12, 0.8, T),
    comida("sopa_cebola", "Sopa de Cebola", "Onion Soup", 12, 0.8, T),
    comida("sopa_abobora", "Sopa de Abóbora", "Pumpkin Soup", 14, 0.75, T),
    comida("ensopado_bacalhau", "Ensopado de Bacalhau Assado", "Baked Cod Stew", 14, 0.75, T),
    comida("sopa_macarrao", "Sopa de Macarrão", "Noodle Soup", 14, 0.75, T),
    comida("macarrao_almondegas", "Macarrão com Almôndegas", "Pasta with Meatballs", 12, 0.8, T),
    comida("macarrao_carneiro", "Macarrão com Costeleta", "Pasta with Mutton Chop", 12, 0.8, T),
    comida("ratatouille", "Ratatouille", "Ratatouille", 10, 0.6, T),
    comida("arroz_cogumelos", "Arroz com Cogumelos", "Mushroom Rice", 12, 0.8, T),
    comida("macarrao_tinta_lula", "Macarrão com Tinta de Lula", "Squid Ink Pasta", 14, 0.75, T),
    comida("macarrao_legumes", "Macarrão de Legumes", "Vegetable Noodles", 14, 0.75, T),
    comida("rolinhos_repolho", "Rolinhos de Repolho", "Cabbage Rolls", 5, 0.5),
    comida("bolinhos", "Bolinhos", "Dumplings", 8, 0.8),
    // pratos da bancada
    comida("salada_mista", "Salada Mista", "Mixed Salad", 6, 0.6, T),
    comida("salada_frutas", "Salada de Frutas", "Fruit Salad", 6, 0.6, T),
    comida("espetinho", "Espetinho", "Barbecue on a Stick", 8, 0.9),
    comida("sanduiche_ovo", "Sanduíche de Ovo", "Egg Sandwich", 8, 0.8),
    comida("sanduiche_frango", "Sanduíche de Frango", "Chicken Sandwich", 10, 0.8),
    comida("sanduiche_bacon", "Sanduíche de Bacon", "Bacon Sandwich", 10, 0.8),
    comida("wrap_carneiro", "Wrap de Carneiro", "Mutton Wrap", 10, 0.8),
    comida("bife_batatas", "Bife com Batatas", "Steak and Potatoes", 12, 0.8, T),
    comida("bacon_ovos", "Bacon com Ovos", "Bacon and Eggs", 10, 0.6, T),
    comida("batata_recheada", "Batata Recheada", "Stuffed Potato", 10, 0.7),
    comida("salmao_grelhado", "Salmão Grelhado", "Grilled Salmon", 14, 0.75, T),
    comida("costeletas_assadas", "Costeletas Assadas", "Roasted Mutton Chops", 14, 0.75, T),
  ],
  blocos: [
    { id: "panela_cozinha", pt: "Panela de Cozinha", en: "Cooking Pot", tipo: "maquina", luz: "laranja", glifo: "chama", comp: "cl:panela_cozinha", tick: 20, girar: false },
    { id: "tabua_cortar", pt: "Tábua de Cortar", en: "Cutting Board", tipo: "cubo", cor: "#a07c48", padrao: "liso", dureza: 1, girar: false, comp: "cl:tabua_cortar",
      geometria: { ossos: { tabua: [[[-7, 0, -6], [14, 1, 12]]] } }, extra: { "minecraft:collision_box": { origin: [-7, 0, -6], size: [14, 1, 12] }, "minecraft:selection_box": { origin: [-7, 0, -6], size: [14, 2, 12] } } },
    { id: "fogao", pt: "Fogão", en: "Stove", tipo: "maquina", luz: "laranja", glifo: "chama", comp: "cl:fogao", tick: 20, luzEmite: 13 },
    ...CAIXOTES.map(({ item, ...b }) => b),
    // Corda: pendurada, sem colisão; tocar uma corda com outra a estende para baixo; dá para subir (quark.ts).
    { id: "corda", pt: "Corda", en: "Rope", tipo: "cubo", cor: "#b08850", padrao: "liso", dureza: 0.3, girar: false,
      geometria: { ossos: { corda: [[[-1, 0, -1], [2, 16, 2]]] } }, extra: { "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-2, 0, -2], size: [4, 16, 4] } } },
  ],
  receitas: [
    ...[["silex", "minecraft:flint"], ["ferro", "minecraft:iron_ingot"], ["ouro", "minecraft:gold_ingot"], ["diamante", "minecraft:diamond"]].map(([m, mat]) =>
      ({ id: `faca_${m}`, tipo: "shaped", padrao: ["m", "s"], chave: { m: mat, s: "minecraft:stick" }, resultado: `cl:faca_${m}` })),
    { id: "corda", tipo: "shaped", padrao: ["s", "s"], chave: { s: "cl:palha" }, resultado: "cl:corda", qtd: 4 },
    { id: "lona", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:palha" }, resultado: "cl:lona" },
    { id: "fogao", tipo: "shaped", padrao: ["iii", "B B", "BCB"], chave: { B: "minecraft:brick_block", C: "minecraft:campfire", i: "minecraft:iron_ingot" }, resultado: "cl:fogao" },
    { id: "panela_cozinha", tipo: "shaped", padrao: ["bSb", "iWi", "iii"], chave: { S: "minecraft:wooden_shovel", W: "minecraft:water_bucket", b: "minecraft:brick", i: "minecraft:iron_ingot" }, resultado: "cl:panela_cozinha" },
    { id: "tabua_cortar", tipo: "shaped", padrao: ["/##", "/##"], chave: { "#": "#minecraft:planks", "/": "minecraft:stick" }, resultado: "cl:tabua_cortar" },
    ...CAIXOTES.flatMap(({ id, item }) => [
      { id, tipo: "shaped", padrao: ["###", "###", "###"], chave: { "#": item }, resultado: `cl:${id}` },
      { id: `${id}_desfazer`, tipo: "shapeless", ingredientes: [`cl:${id}`], resultado: item, qtd: 9 },
    ]),
    { id: "repolho_de_folhas", tipo: "shapeless", ingredientes: ["cl:folha_repolho", "cl:folha_repolho"], resultado: "cl:repolho" },
    // forno
    ...[["carne_moida", "hamburguer_carne"], ["pedacos_frango", "pedacos_frango_cozidos"], ["bacon", "bacon_cozido"], ["fatia_bacalhau", "fatia_bacalhau_cozida"],
      ["fatia_salmao", "fatia_salmao_cozida"], ["costeleta_carneiro", "costeleta_carneiro_cozida"]].map(([de, para]) => ({ id: `forno_${para}`, tipo: "furnace", entrada: `cl:${de}`, resultado: `cl:${para}` })),
    // bancada (receitas do Farmer's Delight; "ingrediente de salada" = repolho, "ovo cozido" = ovo frito)
    { id: "salada_mista", tipo: "shapeless", ingredientes: ["cl:repolho", "cl:tomate", "minecraft:beetroot", "minecraft:bowl"], resultado: "cl:salada_mista" },
    { id: "salada_frutas", tipo: "shapeless", ingredientes: ["minecraft:apple", "minecraft:melon_slice", "minecraft:melon_slice", "minecraft:sweet_berries", "minecraft:sweet_berries", "cl:fatia_abobora", "minecraft:bowl"], resultado: "cl:salada_frutas" },
    { id: "espetinho", tipo: "shapeless", ingredientes: ["cl:tomate", "cl:cebola", "minecraft:cooked_beef", "minecraft:stick"], resultado: "cl:espetinho" },
    { id: "sanduiche_ovo", tipo: "shapeless", ingredientes: ["minecraft:bread", "cl:ovo_frito", "cl:ovo_frito"], resultado: "cl:sanduiche_ovo" },
    { id: "sanduiche_frango", tipo: "shapeless", ingredientes: ["minecraft:bread", "minecraft:cooked_chicken", "cl:repolho", "minecraft:carrot"], resultado: "cl:sanduiche_frango" },
    { id: "sanduiche_bacon", tipo: "shapeless", ingredientes: ["minecraft:bread", "cl:bacon_cozido", "cl:repolho", "cl:tomate"], resultado: "cl:sanduiche_bacon" },
    { id: "wrap_carneiro", tipo: "shapeless", ingredientes: ["minecraft:bread", "minecraft:cooked_mutton", "cl:repolho", "cl:cebola"], resultado: "cl:wrap_carneiro" },
    { id: "bife_batatas", tipo: "shapeless", ingredientes: ["minecraft:baked_potato", "minecraft:cooked_beef", "minecraft:bowl", "cl:cebola", "cl:arroz_cozido"], resultado: "cl:bife_batatas" },
    { id: "bacon_ovos", tipo: "shapeless", ingredientes: ["cl:bacon_cozido", "cl:bacon_cozido", "minecraft:bowl", "cl:ovo_frito", "cl:ovo_frito"], resultado: "cl:bacon_ovos" },
    { id: "batata_recheada", tipo: "shapeless", ingredientes: ["minecraft:baked_potato", "minecraft:cooked_beef", "minecraft:milk_bucket"], resultado: "cl:batata_recheada" },
    { id: "salmao_grelhado", tipo: "shapeless", ingredientes: ["minecraft:cooked_salmon", "minecraft:sweet_berries", "minecraft:bowl", "cl:repolho", "cl:cebola"], resultado: "cl:salmao_grelhado" },
    { id: "costeletas_assadas", tipo: "shapeless", ingredientes: ["cl:costeleta_carneiro_cozida", "minecraft:beetroot", "minecraft:bowl", "cl:arroz_cozido", "cl:tomate"], resultado: "cl:costeletas_assadas" },
  ],
  dados: {
    // Panela: ingredientes (cada um é uma lista de itens que servem), tempo em ticks, resultado, quantas porções.
    panela: [
      { sai: "cl:molho_tomate", ingr: [["cl:tomate"], ["cl:tomate"]], tempo: 100 },
      { sai: "cl:arroz_cozido", ingr: [["cl:arroz"]], tempo: 100 },
      { sai: "cl:caldo_osso", ingr: [["minecraft:bone"], ["minecraft:glow_berries"]], tempo: 200 },
      { sai: "cl:ensopado_carne", ingr: [["minecraft:beef"], ["minecraft:carrot"], ["minecraft:potato"]], tempo: 200 },
      { sai: "cl:sopa_frango", ingr: [["minecraft:chicken", "cl:pedacos_frango"], ["minecraft:carrot"], ["cl:repolho", "cl:folha_repolho"], ["minecraft:potato", "minecraft:beetroot", "cl:tomate", "cl:cebola"]], tempo: 200 },
      { sai: "cl:ensopado_peixe", ingr: [["minecraft:cod", "minecraft:salmon", "cl:fatia_bacalhau", "cl:fatia_salmao"], ["cl:molho_tomate"], ["cl:cebola"]], tempo: 200 },
      { sai: "cl:sopa_cebola", ingr: [["cl:cebola"], ["cl:cebola"], ["minecraft:bread"], ["minecraft:milk_bucket"]], tempo: 200 },
      { sai: "cl:sopa_abobora", ingr: [["cl:fatia_abobora"], ["cl:repolho", "cl:folha_repolho"], ["minecraft:porkchop", "cl:bacon"], ["minecraft:milk_bucket"]], tempo: 200 },
      { sai: "cl:ensopado_bacalhau", ingr: [["minecraft:cod", "cl:fatia_bacalhau"], ["minecraft:potato"], ["minecraft:egg"], ["cl:tomate"]], tempo: 200 },
      { sai: "cl:sopa_macarrao", ingr: [["cl:macarrao_cru"], ["minecraft:egg"], ["minecraft:dried_kelp"], ["minecraft:porkchop", "cl:bacon"]], tempo: 200 },
      { sai: "cl:macarrao_almondegas", ingr: [["cl:carne_moida"], ["cl:macarrao_cru"], ["cl:molho_tomate"]], tempo: 200 },
      { sai: "cl:macarrao_carneiro", ingr: [["minecraft:mutton", "cl:costeleta_carneiro"], ["cl:macarrao_cru"], ["cl:molho_tomate"]], tempo: 200 },
      { sai: "cl:ratatouille", ingr: [["cl:tomate"], ["cl:cebola"], ["minecraft:beetroot"], ["minecraft:carrot", "minecraft:potato", "cl:repolho"]], tempo: 200 },
      { sai: "cl:arroz_cogumelos", ingr: [["minecraft:brown_mushroom"], ["minecraft:red_mushroom"], ["cl:arroz"], ["minecraft:carrot"]], tempo: 200 },
      { sai: "cl:macarrao_tinta_lula", ingr: [["minecraft:cod", "minecraft:salmon", "cl:fatia_bacalhau", "cl:fatia_salmao"], ["cl:macarrao_cru"], ["cl:tomate"], ["minecraft:ink_sac"]], tempo: 200 },
      { sai: "cl:macarrao_legumes", ingr: [["minecraft:carrot"], ["minecraft:brown_mushroom", "minecraft:red_mushroom"], ["cl:macarrao_cru"], ["cl:repolho", "cl:folha_repolho"], ["minecraft:potato", "minecraft:beetroot", "cl:tomate", "cl:cebola"]], tempo: 200 },
      { sai: "cl:rolinhos_repolho", ingr: [["cl:repolho"], ["minecraft:beef", "minecraft:porkchop", "minecraft:chicken", "minecraft:mutton", "cl:carne_moida", "cl:bacon"]], tempo: 100 },
      { sai: "cl:bolinhos", n: 2, ingr: [["cl:massa"], ["cl:repolho"], ["cl:cebola"], ["minecraft:chicken", "cl:pedacos_frango"]], tempo: 200 },
    ],
    // Tábua de Cortar (com faca): entrada -> [[item, qtd, chance]]
    corte: {
      "cl:repolho": [["cl:folha_repolho", 2, 1]], "minecraft:beef": [["cl:carne_moida", 2, 1]], "minecraft:chicken": [["cl:pedacos_frango", 2, 1], ["minecraft:bone_meal", 1, 1]],
      "minecraft:cooked_chicken": [["cl:pedacos_frango_cozidos", 2, 1], ["minecraft:bone_meal", 1, 1]], "minecraft:porkchop": [["cl:bacon", 2, 1]],
      "minecraft:cod": [["cl:fatia_bacalhau", 2, 1], ["minecraft:bone_meal", 1, 1]], "minecraft:salmon": [["cl:fatia_salmao", 2, 1], ["minecraft:bone_meal", 1, 1]],
      "minecraft:mutton": [["cl:costeleta_carneiro", 2, 1]], "minecraft:pumpkin": [["cl:fatia_abobora", 4, 1]], "cl:massa": [["cl:macarrao_cru", 1, 1]],
      "minecraft:wheat": [["cl:palha", 1, 1], ["minecraft:wheat_seeds", 1, 0.2]], "cl:arroz": [["cl:palha", 1, 0.5]],
    },
    // Efeitos: Nutrição e Conforto (ticks).
    efeitos: {
      "cl:arroz_cozido": [BREVE, 0], "cl:caldo_osso": [CURTA, CURTA], "cl:ensopado_carne": [MEDIA, MEDIA], "cl:sopa_frango": [MEDIA, MEDIA], "cl:ensopado_peixe": [MEDIA, MEDIA],
      "cl:sopa_cebola": [MEDIA, MEDIA], "cl:sopa_abobora": [LONGA, LONGA], "cl:ensopado_bacalhau": [LONGA, LONGA], "cl:sopa_macarrao": [LONGA, LONGA],
      "cl:macarrao_almondegas": [MEDIA, 0], "cl:macarrao_carneiro": [MEDIA, 0], "cl:ratatouille": [CURTA, 0], "cl:arroz_cogumelos": [MEDIA, 0],
      "cl:macarrao_tinta_lula": [LONGA, 0], "cl:macarrao_legumes": [LONGA, 0], "cl:bife_batatas": [MEDIA, 0], "cl:bacon_ovos": [CURTA, 0],
      "cl:salmao_grelhado": [MEDIA, 0], "cl:costeletas_assadas": [LONGA, 0],
    },
    regenera: ["cl:salada_mista", "cl:salada_frutas"],
  },
  textos: {
    "cl.fd.panela": ["Panela: %s/6 ingredientes. %s", "Cooking Pot: %s/6 ingredients. %s"],
    "cl.fd.cozinhando": ["Cozinhando %s (%s%%).", "Cooking %s (%s%%)."],
    "cl.fd.sem_fogo": ["Ponha fogo, fogueira, lava, magma ou um Fogão embaixo.", "Put fire, a campfire, lava, magma or a Stove underneath."],
    "cl.fd.sem_receita": ["Nenhuma receita com esses ingredientes (agache e toque para esvaziar).", "No recipe with these ingredients (sneak and tap to empty)."],
    "cl.fd.pronto": ["Pronto: %s× %s. Toque com uma tigela para servir.", "Done: %s× %s. Tap with a bowl to serve."],
    "cl.fd.pronto_mao": ["Pronto: %s× %s. Toque para pegar.", "Done: %s× %s. Tap to take."],
    "cl.fd.tabua": ["Tábua de Cortar: %s. Toque com uma faca para cortar.", "Cutting Board: %s. Tap with a knife to cut."],
    "cl.fd.tabua_vazia": ["Ponha um ingrediente na tábua e corte com uma faca.", "Put an ingredient on the board and cut it with a knife."],
    "cl.fd.fogao": ["Fogão: %s/6 cozinhando em cima.", "Stove: %s/6 cooking on top."],
    "cl.fd.nutricao": ["§6Nutrição: a fome não baixa por %s s.", "§6Nourishment: no hunger for %s s."],
    "cl.fd.conforto": ["§6Conforto: sem lentidão, fraqueza nem fome por %s s.", "§6Comfort: no slowness, weakness or hunger for %s s."],
    "cl.capitulo.farmers.nome": ["Farmer's Delight", "Farmer's Delight"],
    "cl.capitulo.farmers.curto": ["Farmer's Delight", "Farmer's Delight"],
    "cl.capitulo.farmers.desc": ["Facas, Tábua de Cortar, Panela de Cozinha, Fogão e as comidas que dão Nutrição e Conforto.", "Knives, Cutting Board, Cooking Pot, Stove and the meals that give Nourishment and Comfort."],
    "cl.missao.fd_faca.titulo": ["Faca", "Knife"], "cl.missao.fd_faca.desc": ["Faça uma Faca de Sílex.", "Make a Flint Knife."],
    "cl.missao.fd_cortar.titulo": ["Na tábua", "On the board"], "cl.missao.fd_cortar.desc": ["Corte 8 ingredientes na Tábua de Cortar.", "Cut 8 ingredients on the Cutting Board."],
    "cl.missao.fd_panela.titulo": ["Panela no fogo", "Pot on the fire"], "cl.missao.fd_panela.desc": ["Cozinhe um prato na Panela de Cozinha.", "Cook a meal in the Cooking Pot."],
    "cl.missao.fd_nutricao.titulo": ["Bem alimentado", "Well fed"], "cl.missao.fd_nutricao.desc": ["Coma um prato que dá Nutrição.", "Eat a meal that gives Nourishment."],
    "cl.missao.fd_caixote.titulo": ["Despensa", "Pantry"], "cl.missao.fd_caixote.desc": ["Coloque 4 caixotes de comida.", "Place 4 food crates."],
  },
};

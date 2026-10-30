// Fase 34 (1.12.0): Quark (Vazkii e equipe, arte CC BY-NC-SA 3.0): o que cabe no Bedrock e combina com o deserto.
// - Blocos: caixotes e sacos de armazenamento, blocos de carvão vegetal, cana, cacto e gravetos; jaspe e xisto (com polido,
//   tijolos, entalhado e pilar), vidro emoldurado, placa de ferro (e enferrujada), grade, palha trançada, lanterna de papel
//   e lâmpada de pedra.
// - Picarango (Pickarang): picareta de arremesso que vai até 20 blocos, quebra o que acerta e volta (800 usos).
// - Ajustes do Quark (script): colheita com toque (planta madura colhe e replanta), portas duplas abrem juntas e a Corda
//   (Farmer's Delight) dá para subir e descer.
// Scripts em scripts/utilidades/quark.ts.
const bloco = (id, pt, en, cor, padrao = "liso", extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao, dureza: 1.5, girar: false, ...extra });
const ARMAZENS = [
  ["caixote_maca", "Caixote de Maçã", "Apple Crate", "minecraft:apple", "#c0392b"],
  ["saco_bagas", "Saco de Bagas", "Berry Sack", "minecraft:sweet_berries", "#a3232b"],
  ["saco_polvora", "Saco de Pólvora", "Gunpowder Sack", "minecraft:gunpowder", "#6b6b6b"],
  ["saco_cacau", "Saco de Cacau", "Cocoa Beans Sack", "minecraft:cocoa_beans", "#6b3e1f"],
  ["bloco_carvao_vegetal", "Bloco de Carvão Vegetal", "Charcoal Block", "minecraft:charcoal", "#2b2b2b"],
  ["bloco_cana", "Bloco de Cana-de-Açúcar", "Sugar Cane Block", "minecraft:sugar_cane", "#8fbf4a"],
  ["bloco_cacto", "Bloco de Cacto", "Cactus Block", "minecraft:cactus", "#4f8f3a"],
  ["bloco_gravetos", "Bloco de Gravetos", "Stick Block", "minecraft:stick", "#a07c48"],
];
const PEDRAS = [["jaspe", "Jaspe", "Jasper", "#a2513f", "minecraft:red_dye"], ["xisto", "Xisto", "Shale", "#6e7a83", "minecraft:gray_dye"]];
const VARIANTES = [["", "", ""], ["_polido", " Polido", "Polished "], ["_tijolos", " (Tijolos)", " Bricks"], ["_entalhado", " Entalhado", "Chiseled "], ["_pilar", " (Pilar)", " Pillar"]];

export default {
  fase: 34,
  mod: "Quark",
  itens: [
    { id: "picarango", pt: "Picarango", en: "Pickarang", icone: "barra:#5ff3ff", pilha: 1, comp: { "minecraft:durability": { max_durability: 800 }, "minecraft:hand_equipped": true } },
  ],
  blocos: [
    ...ARMAZENS.map(([id, pt, en, , cor]) => bloco(id, pt, en, cor, "tijolos")),
    ...PEDRAS.flatMap(([id, pt, en, cor]) => VARIANTES.map(([suf, spt, sen]) =>
      bloco(`${id}${suf}`, `${pt}${spt}`, suf === "_polido" || suf === "_entalhado" ? `${sen}${en}` : `${en}${sen}`, cor, suf ? { _polido: "polido", _tijolos: "tijolos", _entalhado: "entalhado", _pilar: "pilar" }[suf] : "rachado"))),
    bloco("vidro_emoldurado", "Vidro Emoldurado", "Framed Glass", "#d8e8f0", "liso", { tipo: "vidro" }),
    bloco("bloco_placa_ferro", "Placa de Ferro", "Iron Plate", "#a8acb0", "rebitado", { dureza: 5 }),
    bloco("bloco_placa_ferro_enferrujada", "Placa de Ferro Enferrujada", "Rusty Iron Plate", "#9a6a4a", "rebitado", { dureza: 5 }),
    bloco("grade", "Grade", "Grate", "#7a7e84", "metal", { tipo: "vidro", dureza: 5 }),
    bloco("palha_trancada", "Palha Trançada", "Thatch", "#c9a84a", "liso", { dureza: 0.5 }),
    bloco("lanterna_papel", "Lanterna de Papel", "Paper Lantern", "#efe2c0", "liso", { luzEmite: 15, dureza: 0.5 }),
    bloco("lampada_pedra", "Lâmpada de Pedra", "Stone Lamp", "#9a9a9a", "tijolos", { luzEmite: 15 }),
  ],
  receitas: [
    ...ARMAZENS.flatMap(([id, , , item]) => [
      { id, tipo: "shaped", padrao: ["###", "###", "###"], chave: { "#": item }, resultado: `cl:${id}` },
      { id: `${id}_desfazer`, tipo: "shapeless", ingredientes: [`cl:${id}`], resultado: item, qtd: 9 },
    ]),
    // Jaspe e xisto nascem no mundo no Quark; aqui vêm de 8 pedregulhos com o corante da cor.
    ...PEDRAS.flatMap(([id, , , , tinta]) => [
      { id, tipo: "shaped", padrao: ["###", "#D#", "###"], chave: { "#": "minecraft:cobblestone", D: tinta }, resultado: `cl:${id}`, qtd: 8 },
      { id: `${id}_polido`, tipo: "shaped", padrao: ["##", "##"], chave: { "#": `cl:${id}` }, resultado: `cl:${id}_polido`, qtd: 4 },
      { id: `${id}_tijolos`, tipo: "shaped", padrao: ["##", "##"], chave: { "#": `cl:${id}_polido` }, resultado: `cl:${id}_tijolos`, qtd: 4 },
      { id: `${id}_entalhado`, tipo: "shaped", padrao: ["#", "#"], chave: { "#": `cl:${id}_tijolos` }, resultado: `cl:${id}_entalhado` },
      { id: `${id}_pilar`, tipo: "shaped", padrao: ["#", "#"], chave: { "#": `cl:${id}_polido` }, resultado: `cl:${id}_pilar`, qtd: 2 },
    ]),
    { id: "vidro_emoldurado", tipo: "shaped", padrao: ["IGI", "GIG", "IGI"], chave: { I: "minecraft:iron_nugget", G: "minecraft:glass" }, resultado: "cl:vidro_emoldurado", qtd: 4 },
    { id: "bloco_placa_ferro", tipo: "shaped", padrao: ["I", "I", "I"], chave: { I: "minecraft:iron_ingot" }, resultado: "cl:bloco_placa_ferro", qtd: 8 },
    { id: "bloco_placa_ferro_enferrujada", tipo: "shapeless", ingredientes: ["cl:bloco_placa_ferro", "minecraft:water_bucket"], resultado: "cl:bloco_placa_ferro_enferrujada" },
    { id: "grade", tipo: "shaped", padrao: ["II", "II"], chave: { I: "minecraft:iron_bars" }, resultado: "cl:grade" },
    { id: "palha_trancada", tipo: "shaped", padrao: ["WW", "WW"], chave: { W: "minecraft:wheat" }, resultado: "cl:palha_trancada" },
    { id: "lanterna_papel", tipo: "shaped", padrao: ["PPP", "PTP", "PPP"], chave: { P: "minecraft:paper", T: "minecraft:torch" }, resultado: "cl:lanterna_papel" },
    { id: "lampada_pedra", tipo: "shaped", padrao: ["SSS", "SCS", "SSS"], chave: { S: "minecraft:stone", C: "minecraft:coal" }, resultado: "cl:lampada_pedra", qtd: 4 },
    { id: "picarango", tipo: "shaped", padrao: [" DI", "D D", "ID "], chave: { D: "minecraft:diamond", I: "minecraft:iron_ingot" }, resultado: "cl:picarango" },
  ],
  textos: {
    "cl.capitulo.quark.nome": ["Quark", "Quark"],
    "cl.capitulo.quark.curto": ["Quark", "Quark"],
    "cl.capitulo.quark.desc": ["Blocos de construção e armazenamento, o Picarango e os ajustes do Quark (colher com toque, portas duplas, corda).", "Building and storage blocks, the Pickarang and Quark tweaks (tap to harvest, double doors, rope)."],
    "cl.missao.qk_jaspe.titulo": ["Jaspe", "Jasper"], "cl.missao.qk_jaspe.desc": ["Faça 16 blocos de Jaspe.", "Make 16 Jasper blocks."],
    "cl.missao.qk_colher.titulo": ["Colheita com toque", "Tap to harvest"], "cl.missao.qk_colher.desc": ["Colha 16 plantas maduras tocando nelas (elas replantam sozinhas).", "Harvest 16 ripe crops by tapping them (they replant themselves)."],
    "cl.missao.qk_picarango.titulo": ["Picarango", "Pickarang"], "cl.missao.qk_picarango.desc": ["Quebre um bloco com o Picarango.", "Break a block with the Pickarang."],
    "cl.missao.qk_corda.titulo": ["Corda", "Rope"], "cl.missao.qk_corda.desc": ["Suba por uma corda.", "Climb a rope."],
    "cl.missao.qk_armazem.titulo": ["Armazém", "Storage"], "cl.missao.qk_armazem.desc": ["Coloque 4 blocos de armazenamento do Quark.", "Place 4 Quark storage blocks."],
  },
};

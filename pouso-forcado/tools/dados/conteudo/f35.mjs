// Fase 35 (1.13.0): Immersive Engineering (BluSunrize, código GPLv3; a arte pede permissão, então é própria).
// Receitas e números do código público (branch 1.20.1): Forno de Coque e Alto-Forno montados com o Martelo de Engenheiro
// numa estrutura 3×3×3, creosoto e madeira tratada, cânhamo (a semente sai da peneira) e o Dínamo Cinético com o Moinho
// de Vento ou a Roda d'Água. Os fios de cobre do IE (prensa e alicate) viram a Bobina de Fio de Cobre feita direto do
// lingote. Scripts em scripts/maquinas/immersive.ts.
const IE = { mod: "Immersive Engineering" };
const tijolo = (id, pt, en, cor) => ({ id, pt, en, tipo: "cubo", cor, padrao: "tijolos", dureza: 2, girar: false, resistencia: 10, ...IE });
// O controlador fica no lugar do tijolo do meio da frente, com a boca do forno virada para fora.
const boca = (id, pt, en, cor, cBoca, comp) => ({
  id, pt, en, tipo: "cubo", cor, padrao: "tijolos", dureza: 2, girar: true, resistencia: 10, comp, tick: 20, luzEmite: 6,
  materiais: { north: { cor: cBoca, padrao: "entalhado" } }, loot: "loot_tables/empty.json", ...IE,
});

export default {
  fase: 35,
  mod: "Immersive Engineering",
  itens: [
    { id: "martelo_engenheiro", pt: "Martelo de Engenheiro", en: "Engineer's Hammer", icone: "chave:#9aa0a6", pilha: 1, comp: { "minecraft:durability": { max_durability: 100 }, "minecraft:hand_equipped": true } },
    { id: "coque", pt: "Coque", en: "Coal Coke", icone: "pepita:#3a3533" },
    { id: "escoria", pt: "Escória", en: "Slag", icone: "po:#b8b0a0" },
    { id: "balde_creosoto", pt: "Balde de Creosoto", en: "Creosote Bucket", icone: "gota:#5a4a1c", pilha: 1 },
    { id: "graveto_tratado", pt: "Graveto de Madeira Tratada", en: "Treated Stick", icone: "barra:#7a5230" },
    { id: "fibra_canhamo", pt: "Fibra de Cânhamo", en: "Industrial Hemp Fiber", icone: "folha:#8fae5a" },
    { id: "tecido_canhamo", pt: "Tecido de Cânhamo", en: "Hemp Fabric", icone: "placa:#c8b88a" },
    { id: "vela_lona", pt: "Vela de Moinho", en: "Windmill Sail", icone: "placa:#e2d6b8" },
    { id: "pa_moinho", pt: "Pá de Moinho", en: "Windmill Blade", icone: "barra:#7a5230" },
    { id: "segmento_roda", pt: "Segmento de Roda d'Água", en: "Waterwheel Segment", icone: "engrenagem:#7a5230" },
    { id: "componente_ferro", pt: "Componente de Ferro", en: "Iron Mechanical Component", icone: "engrenagem:#c8ccd0" },
    { id: "bobina_fio_cobre", pt: "Bobina de Fio de Cobre", en: "LV Wire Coil", icone: "bola:#d8823c" },
    { id: "bobina_bt", pt: "Bobina de Baixa Tensão", en: "LV Coil Block Item", icone: "celula:#d8823c" },
  ],
  blocos: [
    tijolo("tijolo_coque", "Tijolo de Coque", "Coke Brick", "#8a5a3c"),
    tijolo("tijolo_alto_forno", "Tijolo de Alto-Forno", "Blast Brick", "#7a3324"),
    { id: "bloco_coque", pt: "Bloco de Coque", en: "Block of Coal Coke", tipo: "cubo", cor: "#2e2a28", padrao: "pintas", dureza: 2, girar: false, ...IE },
    { id: "tabuas_tratadas", pt: "Tábuas Tratadas", en: "Treated Wood", tipo: "cubo", cor: "#6e4a2a", padrao: "ladrilho", dureza: 2, girar: false, ...IE },
    boca("forno_coque", "Forno de Coque", "Coke Oven", "#8a5a3c", "#2a1a12", "cl:forno_coque"),
    boca("alto_forno", "Alto-Forno", "Blast Furnace", "#7a3324", "#2a120c", "cl:alto_forno"),
    { id: "dinamo_cinetico", pt: "Dínamo Cinético", en: "Kinetic Dynamo", tipo: "maquina", luz: "laranja", glifo: "raio", comp: "cl:dinamo_cinetico", tick: 100, ...IE },
    // Moinho e Roda: o cubo do eixo; as pás são uma entidade que gira (cl:pas_moinho, cl:roda_agua_giro).
    { id: "moinho_vento", pt: "Moinho de Vento", en: "Windmill", tipo: "cubo", cor: "#6e4a2a", padrao: "ladrilho", dureza: 2, girar: false, comp: "cl:moinho_vento", tick: 100,
      geometria: { ossos: { eixo: [[[-4, 4, -4], [8, 8, 8]]] } }, extra: { "minecraft:collision_box": { origin: [-4, 4, -4], size: [8, 8, 8] }, "minecraft:selection_box": { origin: [-4, 4, -4], size: [8, 8, 8] } }, ...IE },
    { id: "roda_hidraulica", pt: "Roda d'Água", en: "Water Wheel", tipo: "cubo", cor: "#6e4a2a", padrao: "ladrilho", dureza: 2, girar: false, comp: "cl:roda_hidraulica", tick: 100,
      geometria: { ossos: { eixo: [[[-4, 4, -4], [8, 8, 8]]] } }, extra: { "minecraft:collision_box": { origin: [-4, 4, -4], size: [8, 8, 8] }, "minecraft:selection_box": { origin: [-4, 4, -4], size: [8, 8, 8] } }, ...IE },
  ],
  receitas: [
    { id: "martelo_engenheiro", tipo: "shaped", padrao: [" if", " si", "s  "], chave: { f: "minecraft:string", i: "minecraft:iron_ingot", s: "minecraft:stick" }, resultado: "cl:martelo_engenheiro" },
    { id: "tijolo_coque", tipo: "shaped", padrao: ["csc", "sms", "csc"], chave: { c: "minecraft:clay_ball", s: "minecraft:brick", m: "minecraft:sandstone" }, resultado: "cl:tijolo_coque", qtd: 3 },
    { id: "tijolo_alto_forno", tipo: "shaped", padrao: ["csc", "sms", "csc"], chave: { c: "minecraft:netherbrick", s: "minecraft:brick", m: "minecraft:magma" }, resultado: "cl:tijolo_alto_forno", qtd: 3 },
    { id: "bloco_coque", tipo: "shaped", padrao: ["###", "###", "###"], chave: { "#": "cl:coque" }, resultado: "cl:bloco_coque" },
    { id: "bloco_coque_desfazer", tipo: "shapeless", ingredientes: ["cl:bloco_coque"], resultado: "cl:coque", qtd: 9 },
    // A receita do IE é com fluido (o balde volta vazio).
    { id: "tabuas_tratadas", tipo: "shaped", padrao: ["www", "wbw", "www"], chave: { w: "#minecraft:planks", b: "cl:balde_creosoto" }, resultado: "cl:tabuas_tratadas", qtd: 8, devolve: ["minecraft:bucket"] },
    { id: "graveto_tratado", tipo: "shaped", padrao: ["w", "w"], chave: { w: "cl:tabuas_tratadas" }, resultado: "cl:graveto_tratado", qtd: 4 },
    { id: "tecido_canhamo", tipo: "shaped", padrao: ["fff", "fsf", "fff"], chave: { f: "cl:fibra_canhamo", s: "minecraft:stick" }, resultado: "cl:tecido_canhamo" },
    { id: "vela_lona", tipo: "shaped", padrao: [" cc", "ccc", " c "], chave: { c: "cl:tecido_canhamo" }, resultado: "cl:vela_lona" },
    { id: "pa_moinho", tipo: "shaped", padrao: ["bb ", "ssb", "ss "], chave: { b: "cl:tabuas_tratadas", s: "cl:graveto_tratado" }, resultado: "cl:pa_moinho" },
    { id: "moinho_vento", tipo: "shaped", padrao: ["ppp", "pip", "ppp"], chave: { p: "cl:pa_moinho", i: "minecraft:iron_ingot" }, resultado: "cl:moinho_vento" },
    { id: "segmento_roda", tipo: "shaped", padrao: [" s ", "sbs", "bsb"], chave: { b: "cl:tabuas_tratadas", s: "cl:graveto_tratado" }, resultado: "cl:segmento_roda" },
    { id: "roda_hidraulica", tipo: "shaped", padrao: [" p ", "pip", " p "], chave: { p: "cl:segmento_roda", i: "cl:lingote_aco" }, resultado: "cl:roda_hidraulica" },
    { id: "componente_ferro", tipo: "shaped", padrao: ["i i", " c ", "i i"], chave: { i: "cl:placa_ferro", c: "minecraft:copper_ingot" }, resultado: "cl:componente_ferro" },
    { id: "bobina_fio_cobre", tipo: "shaped", padrao: [" w ", "wsw", " w "], chave: { w: "minecraft:copper_ingot", s: "minecraft:stick" }, resultado: "cl:bobina_fio_cobre", qtd: 4 },
    { id: "bobina_bt", tipo: "shaped", padrao: ["www", "wiw", "www"], chave: { w: "cl:bobina_fio_cobre", i: "minecraft:iron_ingot" }, resultado: "cl:bobina_bt" },
    { id: "dinamo_cinetico", tipo: "shaped", padrao: ["rcr", "ili"], chave: { r: "minecraft:redstone", c: "cl:componente_ferro", i: "minecraft:iron_ingot", l: "cl:bobina_bt" }, resultado: "cl:dinamo_cinetico" },
  ],
  dados: {
    // Forno de Coque: entrada -> [saída, ticks, mB de creosoto]. Toras viram carvão vegetal.
    coque: {
      "minecraft:coal": ["cl:coque", 1800, 500], "minecraft:coal_block": ["cl:bloco_coque", 16200, 5000],
      ...Object.fromEntries(["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry", "pale_oak"].map((m) => [`minecraft:${m}_log`, ["minecraft:charcoal", 900, 250]])),
    },
    tanqueCoque: 12000, // mB
    // Alto-Forno: entrada -> [saída, ticks, escórias]; combustível -> ticks.
    altoForno: { "minecraft:iron_ingot": ["cl:lingote_aco", 1200, 1], "minecraft:iron_block": ["cl:bloco_aco", 10800, 9] },
    combustivelAlto: { "cl:coque": 1200, "cl:bloco_coque": 12000, "minecraft:charcoal": 300, "cl:bloco_carvao_vegetal": 3000 },
  },
  textos: {
    "cl.ie.formado": ["§a%s montado!", "§a%s formed!"],
    "cl.ie.estrutura": ["Bata com o Martelo no tijolo do meio de um lado de um cubo 3×3×3 de %s.", "Hit the middle brick of one side of a 3×3×3 cube of %s with the Hammer."],
    "cl.ie.coque": ["Forno de Coque: %s → %s (%s%%). Creosoto: %s mB. Toque com carvão ou toras para pôr; com balde para tirar creosoto; de mão vazia para pegar.", "Coke Oven: %s → %s (%s%%). Creosote: %s mB. Tap with coal or logs to load, with a bucket to drain creosote, empty-handed to collect."],
    "cl.ie.alto": ["Alto-Forno: %s → %s (%s%%). Combustível: %s. Toque com ferro ou combustível (coque, carvão vegetal) para pôr; de mão vazia para pegar.", "Blast Furnace: %s → %s (%s%%). Fuel: %s. Tap with iron or fuel (coke, charcoal) to load, empty-handed to collect."],
    "cl.ie.vazio": ["vazio", "empty"],
    "cl.ie.sem_creosoto": ["Precisa de 1.000 mB de creosoto para encher o balde.", "Needs 1,000 mB of creosote to fill the bucket."],
    "cl.ie.moinho": ["Moinho de Vento: %s RF/t (%s velas). Precisa de um disco livre de 9 blocos e ar na frente; chuva e tempestade ajudam. Toque com uma Vela para pôr (até 8).", "Windmill: %s RF/t (%s sails). Needs a clear 9-block disc and open air in front; rain and storms help. Tap with a Sail to add one (up to 8)."],
    "cl.ie.roda": ["Roda d'Água: %s RF/t. A água corrente passa por cima ou cai num dos lados (até 3 rodas em fila no mesmo dínamo).", "Water Wheel: %s RF/t. Running water flows over the top or falls on one side (up to 3 wheels in a row on one dynamo)."],
    "cl.ie.sem_dinamo": ["Encoste num Dínamo Cinético (o moinho ou a roda vira para o lado oposto).", "Place it against a Kinetic Dynamo (the mill faces away from it)."],
    "cl.ie.dinamo": ["Dínamo Cinético: 3 RF por rotação do moinho ou da roda encostados. Agora: %s.", "Kinetic Dynamo: 3 RF per rotation of the attached mill or wheel. Now: %s."],
    "cl.capitulo.ie.nome": ["Immersive Engineering", "Immersive Engineering"],
    "cl.capitulo.ie.curto": ["Immersive Eng.", "Immersive Eng."],
    "cl.capitulo.ie.desc": ["Forno de Coque, creosoto e madeira tratada, Alto-Forno para o aço e energia do vento e da água.", "Coke Oven, creosote and treated wood, Blast Furnace for steel and power from wind and water."],
    "cl.missao.ie_martelo.titulo": ["Martelo na mão", "Hammer time"], "cl.missao.ie_martelo.desc": ["Faça o Martelo de Engenheiro.", "Make an Engineer's Hammer."],
    "cl.missao.ie_coque.titulo": ["Forno de Coque", "Coke Oven"], "cl.missao.ie_coque.desc": ["Monte um Forno de Coque (27 Tijolos de Coque e o Martelo).", "Form a Coke Oven (27 Coke Bricks and the Hammer)."],
    "cl.missao.ie_creosoto.titulo": ["Creosoto", "Creosote"], "cl.missao.ie_creosoto.desc": ["Tire um Balde de Creosoto do forno.", "Drain a Creosote Bucket from the oven."],
    "cl.missao.ie_tratada.titulo": ["Madeira tratada", "Treated wood"], "cl.missao.ie_tratada.desc": ["Faça 16 Tábuas Tratadas.", "Make 16 Treated Wood."],
    "cl.missao.ie_alto.titulo": ["Aço do jeito antigo", "Old-school steel"], "cl.missao.ie_alto.desc": ["Monte um Alto-Forno e faça um Lingote de Aço nele.", "Form a Blast Furnace and make a Steel Ingot in it."],
    "cl.missao.ie_vento.titulo": ["Força do vento", "Wind power"], "cl.missao.ie_vento.desc": ["Gere energia com um Moinho de Vento num Dínamo Cinético.", "Generate power with a Windmill on a Kinetic Dynamo."],
  },
};

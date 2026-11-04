// Fase 55 (1.36.0): Extreme Reactors 2.4 (o mais novo; ZeroNoRyouki, sem licença publicada para a arte: ideias e
// números do código, arte própria). O que o Big Reactors de antes não tinha:
// - Turbina multibloco: o vapor do reator (refrigeração ativa: a Porta de Refrigeração encostada numa Porta de Fluido
//   da turbina) gira o rotor; as pás dão a vazão (25 mB/t cada) e as bobinas (blocos de metal em volta do eixo) a
//   eficiência, com os números de TurbineGameData.java (ferro 1,0; cobre 1,2; bronze 1,4; aço 1,5; ouro 2,0;
//   netherita 2,2; manyullyn 3,5; ludicrita 5,23; ridiculita 7,47; inanita 9,76).
// - Moderadores novos no reator (moderação de ReactorGameData.java: ferro 1,40, ouro 1,45, diamante e esmeralda 1,50,
//   netherita 1,65, cobre 1,40, vidro 1,10, chumbo 1,75...).
// - Ligas raras no Reprocessador (2 lingotes + 1 cianita): blutônio → ludicrita → ridiculita → inanita.
// Scripts em scripts/maquinas/turbina.ts e reator.ts.
const ER = { mod: "Extreme Reactors" };
const CASCO = "#5a6070";
const parte = (id, pt, en, extra = {}) => ({ id, pt, en, tipo: "cubo", cor: CASCO, padrao: "rebitado", dureza: 3, resistencia: 15, comp: "cl:turbina_parte", ...ER, ...extra });
const LIGAS = [
  ["ludicrita", "Ludicrita", "Ludicrite", "#e070f0", "minecraft:end_crystal"],
  ["ridiculita", "Ridiculita", "Ridiculite", "#f08ab0", "minecraft:nether_star"],
  ["inanita", "Inanita", "Inanite", "#d8f0f8", "minecraft:netherite_block"],
];

export default {
  fase: 55,
  mod: "Extreme Reactors",
  itens: LIGAS.map(([id, pt, en, cor]) => ({ id: `lingote_${id}`, pt: `Lingote de ${pt}`, en: `${en} Ingot`, icone: `lingote:${cor}`, ...ER })),
  blocos: [
    ...LIGAS.map(([id, pt, en, cor]) => ({ id: `bloco_${id}`, pt: `Bloco de ${pt}`, en: `${en} Block`, tipo: "cubo", cor, padrao: "metal", dureza: 5, ...ER })),
    parte("carcaca_turbina", "Carcaça da Turbina", "Turbine Housing"),
    parte("vidro_turbina", "Vidro da Turbina", "Turbine Glass", { tipo: "vidro", cor: "#a8c0d0", padrao: "vidro" }),
    { id: "controlador_turbina", pt: "Controlador da Turbina", en: "Turbine Controller", tipo: "maquina", luz: "azul", glifo: "engrenagem", comp: "cl:turbina", tick: 100, dureza: 3, resistencia: 15, ...ER },
    parte("mancal_rotor", "Mancal do Rotor", "Rotor Bearing", { padrao: "entalhado" }),
    parte("eixo_rotor", "Eixo do Rotor", "Rotor Shaft", { padrao: "pilar", cor: "#9aa0a8" }),
    parte("pa_rotor", "Pá do Rotor", "Rotor Blade", { padrao: "metal", cor: "#c8ccd4" }),
    parte("tomada_turbina", "Tomada de Energia da Turbina", "Turbine Power Tap", { padrao: "ladrilho", cor: "#c0392b" }),
    parte("porta_fluido_turbina", "Porta de Fluido da Turbina", "Turbine Fluid Port", { padrao: "ladrilho", cor: "#3a6ab8" }),
  ],
  receitas: [
    ...LIGAS.map(([id, , , , centro]) => ({ id: `bloco_${id}`, tipo: "shaped", padrao: ["III", "ISI", "III"], chave: { I: `cl:lingote_${id}`, S: centro }, resultado: `cl:bloco_${id}` })),
    { id: "carcaca_turbina", tipo: "shaped", padrao: ["IGI", "GCG", "IGI"], chave: { I: "minecraft:iron_ingot", G: "cl:lingote_cianita", C: "minecraft:redstone_block" }, resultado: "cl:carcaca_turbina", qtd: 4 },
    { id: "vidro_turbina", tipo: "shaped", padrao: ["GCG"], chave: { G: "minecraft:glass", C: "cl:carcaca_turbina" }, resultado: "cl:vidro_turbina" },
    { id: "controlador_turbina", tipo: "shaped", padrao: ["CXC", "YDY", "CRC"], chave: { C: "cl:carcaca_turbina", X: "minecraft:comparator", Y: "cl:lingote_cianita", D: "minecraft:diamond", R: "minecraft:redstone" }, resultado: "cl:controlador_turbina" },
    { id: "mancal_rotor", tipo: "shaped", padrao: ["IRI", "B B", "IRI"], chave: { I: "minecraft:iron_ingot", R: "minecraft:redstone_block", B: "minecraft:iron_block" }, resultado: "cl:mancal_rotor" },
    { id: "eixo_rotor", tipo: "shaped", padrao: [" I ", "ICI", " I "], chave: { I: "minecraft:iron_ingot", C: "cl:lingote_cianita" }, resultado: "cl:eixo_rotor" },
    { id: "pa_rotor", tipo: "shaped", padrao: ["ICI"], chave: { I: "minecraft:iron_ingot", C: "cl:lingote_cianita" }, resultado: "cl:pa_rotor" },
    { id: "tomada_turbina", tipo: "shaped", padrao: ["CSC", "SBS", "CSC"], chave: { C: "cl:carcaca_turbina", S: "minecraft:redstone", B: "minecraft:redstone_block" }, resultado: "cl:tomada_turbina" },
    { id: "porta_fluido_turbina", tipo: "shaped", padrao: ["CSC", "SBS", "CSC"], chave: { C: "cl:carcaca_turbina", S: "minecraft:water_bucket", B: "minecraft:lava_bucket" }, resultado: "cl:porta_fluido_turbina" },
  ],
  textos: {
    "cl.tb.titulo": ["Turbina", "Turbine"],
    "cl.tb.ok": ["Turbina %s×%s×%s: %s pás (vazão até %s mB/t), %s bobinas (eficiência %s).", "Turbine %sx%sx%s: %s blades (up to %s mB/t), %s coils (efficiency %s)."],
    "cl.tb.estado": ["Vapor: %s mB. Último ciclo: %s.", "Steam: %s mB. Last cycle: %s."],
    "cl.tb.invalida": ["A turbina não está montada: %s", "The turbine isn't assembled: %s"],
    "cl.tb.erro.tamanho": ["a caixa precisa ter de 3 a 9 blocos de lado.", "the box needs 3 to 9 blocks per side."],
    "cl.tb.erro.bordas": ["as arestas têm que ser Carcaça da Turbina.", "the edges must be Turbine Housing."],
    "cl.tb.erro.faces": ["as faces só aceitam carcaça, vidro, controlador, mancal, tomada e porta de fluido.", "the faces only take housing, glass, controller, bearing, tap and fluid port."],
    "cl.tb.erro.dentro": ["dentro, só eixo, pás, bobinas (blocos de metal) e ar.", "inside, only shaft, blades, coils (metal blocks) and air."],
    "cl.tb.erro.rotor": ["precisa de um Mancal numa face com o Eixo saindo dele para dentro, pás encostadas no eixo e bobinas.", "it needs a Bearing on a face with the Shaft going inward, blades touching the shaft and coils."],
    "cl.tb.parte": ["Parte da Turbina: monte a caixa e toque no Controlador.", "Turbine part: build the box and tap the Controller."],
    "cl.capitulo.extreme.nome": ["Extreme Reactors", "Extreme Reactors"], "cl.capitulo.extreme.curto": ["Turbina", "Turbine"],
    "cl.capitulo.extreme.desc": ["O Extreme Reactors mais novo: a turbina que transforma o vapor do reator em muito mais energia, moderadores novos e as ligas raras do reprocessador.", "The newest Extreme Reactors: the turbine that turns the reactor's steam into much more power, new moderators and the reprocessor's rare alloys."],
    "cl.missao.er_turbina.titulo": ["Turbina montada", "Turbine assembled"], "cl.missao.er_turbina.desc": ["Monte uma turbina com mancal, eixo, pás e bobinas.", "Assemble a turbine with bearing, shaft, blades and coils."],
    "cl.missao.er_vapor.titulo": ["Refrigeração ativa", "Active cooling"], "cl.missao.er_vapor.desc": ["Gere energia na turbina com o vapor do reator.", "Generate power in the turbine with the reactor's steam."],
    "cl.missao.er_ludicrita.titulo": ["Ludicrita", "Ludicrite"], "cl.missao.er_ludicrita.desc": ["Faça um Lingote de Ludicrita no Reprocessador (2 blutônio + 1 cianita).", "Make a Ludicrite Ingot in the Reprocessor (2 blutonium + 1 cyanite)."],
  },
};

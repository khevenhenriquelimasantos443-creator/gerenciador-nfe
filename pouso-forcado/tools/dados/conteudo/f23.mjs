// Fase 23: Chisel (cinzel e variantes), BiblioCraft (móveis que guardam itens) e ChickenChunks (chunks carregados).
const FAMILIAS = [
  ["arenito", "Arenito", "Sandstone", "#d8c38a", "minecraft:sandstone"],
  ["pedra", "Pedra", "Stone", "#8c8c8c", "minecraft:stone"],
  ["marmore", "Mármore", "Marble", "#ece9e2", "cl:marmore"],
  ["calcario", "Calcário", "Limestone", "#d9cfae", "cl:calcario"],
  ["casco_nave", "Casco da Nave", "Hull", "#e6eaee", "cl:placa_casco"],
  ["vidro", "Vidro", "Glass", "#cfe9f2", "minecraft:glass"],
];
const VARIANTES = [
  ["liso", "Liso", "Smooth"],
  ["polido", "Polido", "Polished"],
  ["tijolos", "Tijolos", "Bricks"],
  ["tijolos_pequenos", "Tijolinhos", "Small Bricks"],
  ["ladrilho", "Ladrilho", "Tiles"],
  ["pilar", "Pilar", "Pillar"],
  ["entalhado", "Entalhado", "Carved"],
  ["mosaico", "Mosaico", "Mosaic"],
];
const madeira = (id, pt, en, comp, padrao, topo, extra = {}) => ({ id, pt, en, tipo: "cubo", cor: "#8a6a3e", padrao, topo, comp, dureza: 1.5, mod: "BiblioCraft", ...extra });
const CORES = [
  ["vermelha", "Vermelha", "Red", "#e04848", "red"], ["laranja", "Laranja", "Orange", "#f08a2a", "orange"],
  ["amarela", "Amarela", "Yellow", "#f2d03a", "yellow"], ["verde", "Verde", "Green", "#5bbf4a", "lime"],
  ["ciano", "Ciano", "Cyan", "#3ac9d6", "cyan"], ["azul", "Azul", "Blue", "#3a6bd5", "blue"],
  ["roxa", "Roxa", "Purple", "#9a4ad6", "purple"], ["rosa", "Rosa", "Pink", "#f08ab8", "pink"],
];
const luz = (id, pt, en, cor) => ({
  id, pt, en, tipo: "cubo", cor, padrao: "polido", comp: "cl:luminaria", dureza: 0.5, mod: "BiblioCraft",
  estados: { "cl:aceso": [false, true] },
  permutacoes: [{ condition: "q.block_state('cl:aceso') == true", components: { "minecraft:light_emission": 15 } }],
});

export default {
  fase: 23,
  mod: "Chisel",
  itens: [{ id: "cinzel", pt: "Cinzel", en: "Chisel", icone: "cinzel", pilha: 1, comp: { "minecraft:durability": { max_durability: 500 }, "minecraft:hand_equipped": true } }],
  blocos: [
    { id: "marmore", pt: "Mármore", en: "Marble", tipo: "cubo", cor: "#ece9e2", padrao: "liso", dureza: 1.5 },
    { id: "calcario", pt: "Calcário", en: "Limestone", tipo: "cubo", cor: "#d9cfae", padrao: "liso", dureza: 1.5 },
    ...FAMILIAS.flatMap(([f, fpt, fen, cor]) =>
      VARIANTES.map(([v, vpt, ven]) => ({
        id: `${f}_${v}`, pt: `${fpt} ${vpt}`, en: `${ven} ${fen}`, tipo: f === "vidro" ? "vidro" : "cubo", cor, padrao: v, menu: "construction", dureza: f === "vidro" ? 0.4 : 1.5,
      })),
    ),
    madeira("estante", "Estante", "Bookcase", "cl:estante", "livros", "polido"),
    madeira("prateleira", "Prateleira", "Shelf", "cl:guarda_itens", "ladrilho", "polido"),
    madeira("suporte_ferramentas", "Suporte de Ferramentas", "Tool Rack", "cl:guarda_itens", "pilar", "polido"),
    madeira("expositor", "Expositor", "Display Case", "cl:guarda_itens", "entalhado", "polido"),
    madeira("cabide_armadura", "Cabide de Armadura", "Armor Stand", "cl:cabide", "pilar", "entalhado"),
    luz("lanterna", "Lanterna", "Fancy Lantern", "#f2c94c"),
    luz("lampada", "Lâmpada", "Fancy Lamp", "#f7e3a0"),
    // 1.2.0: luminárias coloridas do BiblioCraft (a luz do jogo é sempre branca; a cor fica no vidro).
    ...CORES.map(([c, pt, en, cor]) => ({ ...luz(`lampada_${c}`, `Lâmpada ${pt}`, `${en} Fancy Lamp`, cor), menu: "construction" })),
    { id: "carregador_chunks", pt: "Carregador de Chunks", en: "Chunk Loader", tipo: "maquina", luz: "verde", glifo: "cristal", comp: "cl:carregador_chunks", girar: false, mod: "ChickenChunks", estados: { "cl:ligado": [false, true] } },
    { id: "carregador_pontual", pt: "Carregador Pontual", en: "Spot Loader", tipo: "maquina", luz: "verde", glifo: "circulo", comp: "cl:carregador_chunks", girar: false, mod: "ChickenChunks", estados: { "cl:ligado": [false, true] } },
  ],
  receitas: [
    { id: "cinzel", tipo: "shaped", padrao: [" F", "S "], chave: { F: "minecraft:iron_ingot", S: "minecraft:stick" }, resultado: "cl:cinzel" },
    // A bancada só faz a primeira variante de cada família; as outras saem do cinzel.
    ...FAMILIAS.map(([f, , , , base]) => ({ id: `${f}_liso`, tipo: "shaped", padrao: ["BB", "BB"], chave: { B: base }, resultado: `cl:${f}_liso`, qtd: 4 })),
    { id: "estante", tipo: "shaped", padrao: ["PSP", "P P", "PSP"], chave: { P: "#minecraft:planks", S: "minecraft:oak_slab" }, resultado: "cl:estante" },
    { id: "prateleira", tipo: "shaped", padrao: ["SSS", "P P", "SSS"], chave: { P: "#minecraft:planks", S: "minecraft:oak_slab" }, resultado: "cl:prateleira" },
    { id: "suporte_ferramentas", tipo: "shaped", padrao: ["SSS", "SFS", "SSS"], chave: { S: "minecraft:oak_slab", F: "minecraft:iron_ingot" }, resultado: "cl:suporte_ferramentas" },
    { id: "expositor", tipo: "shaped", padrao: ["VVV", "V V", "PPP"], chave: { V: "minecraft:glass", P: "#minecraft:planks" }, resultado: "cl:expositor" },
    { id: "cabide_armadura", tipo: "shaped", padrao: [" S ", " S ", "PPP"], chave: { S: "minecraft:stick", P: "minecraft:oak_slab" }, resultado: "cl:cabide_armadura" },
    { id: "lanterna", tipo: "shaped", padrao: ["FFF", "VTV", "FFF"], chave: { F: "minecraft:iron_nugget", V: "minecraft:glass", T: "minecraft:torch" }, resultado: "cl:lanterna" },
    { id: "lampada", tipo: "shaped", padrao: ["VVV", "VGV", " F "], chave: { V: "minecraft:glass", G: "minecraft:glowstone", F: "minecraft:iron_ingot" }, resultado: "cl:lampada" },
    ...CORES.map(([c, , , , corante]) => ({ id: `lampada_${c}`, tipo: "shapeless", ingredientes: ["cl:lampada", `minecraft:${corante}_dye`], resultado: `cl:lampada_${c}` })),
    { id: "carregador_chunks", tipo: "shaped", padrao: [" P ", "OEO", "OCO"], chave: { P: "minecraft:ender_pearl", O: "minecraft:gold_ingot", E: "minecraft:enchanting_table", C: "cl:circuito" }, resultado: "cl:carregador_chunks" },
    { id: "carregador_pontual", tipo: "shaped", padrao: ["PPP", "PCP", "PPP"], chave: { P: "minecraft:ender_pearl", C: "cl:carregador_chunks" }, resultado: "cl:carregador_pontual", qtd: 10 },
  ],
  textos: {
    "cl.ch.titulo": ["Cinzel", "Chisel"],
    "cl.ch.corpo": ["Agachado: escolha um bloco da mochila e a variante; a pilha inteira muda (sem gastar o cinzel). Em pé: toque num bloco para trocar a variante.", "Sneaking: choose a block from your inventory and the variant; the whole stack changes (no chisel wear). Standing: tap a block to change its variant."],
    "cl.ch.nada": ["Nada para cinzelar na mochila (arenito, pedra, mármore, calcário, placas do casco, vidro e as variantes).", "Nothing to chisel in your inventory (sandstone, stone, marble, limestone, hull plates, glass and their variants)."],
    "cl.ch.variante": ["Variante de %s", "Variant of %s"],
    "cl.bc.estante": ["Estante: %s/16 livros. Toque com um livro para guardar; com a mão vazia, tira o último.", "Bookcase: %s/16 books. Tap with a book to store; with an empty hand, take the last one."],
    "cl.bc.guarda": ["%s: %s/%s. Toque com um item para pôr; com a mão vazia, tira o último.", "%s: %s/%s. Tap with an item to put it; with an empty hand, take the last one."],
    "cl.bc.so_ferramenta": ["O suporte só aceita ferramentas e armas.", "The rack only takes tools and weapons."],
    "cl.bc.so_livro": ["A estante só aceita livros.", "The bookcase only takes books."],
    "cl.bc.cheio": ["Está cheio.", "It's full."],
    "cl.bc.cabide": ["Cabide: toque para trocar a sua armadura pela que está nele.", "Armor stand: tap to swap your armor with the one on it."],
    "cl.bc.conteudo": ["Guarda: %s", "Holds: %s"],
    "cl.cc.ligado": ["Carregador ligado: %s fica carregado mesmo longe.", "Loader on: %s stays loaded even when you're far away."],
    "cl.cc.desligado": ["Carregador desligado (toque para ligar).", "Loader off (tap to turn on)."],
    "cl.cc.area_3x3": ["a área de 3x3 chunks", "the 3x3 chunk area"],
    "cl.cc.area_1": ["este chunk", "this chunk"],
    "cl.cc.limite": ["O jogo só aceita 10 áreas carregadas por mundo: desligue outra antes.", "The game only allows 10 loaded areas per world: turn another one off first."],
    "cl.capitulo.decoracao.nome": ["Decoração (Chisel e BiblioCraft)", "Decoration (Chisel and BiblioCraft)"],
    "cl.capitulo.decoracao.desc": ["Cinzel e variantes de bloco, móveis que guardam coisas e carregadores de chunk.", "Chisel and block variants, furniture that holds things and chunk loaders."],
    "cl.missao.dc_cinzel.titulo": ["Cinzel", "Chisel"], "cl.missao.dc_cinzel.desc": ["Faça um Cinzel e mude 32 blocos de variante.", "Craft a Chisel and change the variant of 32 blocks."],
    "cl.missao.dc_marmore.titulo": ["Mármore", "Marble"], "cl.missao.dc_marmore.desc": ["Junte 32 Mármores (veios na pedra, entre y 4 e 40).", "Gather 32 Marble (veins in stone, between y 4 and 40)."],
    "cl.missao.dc_estante.titulo": ["Biblioteca", "Library"], "cl.missao.dc_estante.desc": ["Guarde 8 livros numa Estante.", "Store 8 books in a Bookcase."],
    "cl.missao.dc_cabide.titulo": ["Cabide", "Armor stand"], "cl.missao.dc_cabide.desc": ["Troque de armadura num Cabide de Armadura.", "Swap armor on an Armor Stand."],
    "cl.missao.dc_lampada.titulo": ["Cores", "Colors"], "cl.missao.dc_lampada.desc": ["Faça uma Lâmpada colorida (lâmpada + corante) e coloque.", "Craft a colored Fancy Lamp (lamp + dye) and place it."],
    "cl.missao.dc_carregador.titulo": ["Sempre ligado", "Always on"], "cl.missao.dc_carregador.desc": ["Ligue um Carregador de Chunks perto das suas máquinas.", "Turn on a Chunk Loader near your machines."],
  },
  dados: {
    familias: Object.fromEntries(FAMILIAS.map(([f, , , , base]) => [f, [base, ...VARIANTES.map(([v]) => `cl:${f}_${v}`)]])),
  },
};

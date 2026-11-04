// Fase 51 (1.32.0): Iron Chests (progwml6; GPL-3, inclusive a arte) e Storage Drawers 13.2 (jaquadro; MIT, inclusive a
// arte), os mais novos. Arte por tools/importar-baus-gavetas.py; scripts em scripts/utilidades/baus_grandes.ts e
// gavetas.ts.
// - Baús: Cobre 45, Ferro 54, Ouro 81, Diamante 108, Cristal 108, Obsidiana 108 (aguenta explosão) e Terra 9000 (1);
//   a tela de baú do Bedrock tem 27 espaços, então o baú grande tem páginas de 27 (agachado + tocar troca de página).
//   Melhorias do mod para trocar o baú sem tirar nada (inclusive o baú normal do jogo).
// - Gavetas: 1×1 (32 pilhas), 1×2 (2 × 16), 2×2 (4 × 8) e a Compactadora (3 formas do mesmo material: bloco, lingote,
//   pepita); Controlador (guarda nas gavetas em volta); melhorias de armazenamento I a VII (×2, ×4, ×8, ×16, ×64,
//   ×256, ×2048, somadas como no mod), de Vazio (o que sobra some) e a Chave (trava o item da gaveta).
const IC = { mod: "Iron Chests" };
const SD = { mod: "Storage Drawers" };
// [id, pt, en, espaços, cor, dureza, resistência]
export const BAUS = [
  ["bau_cobre", "Baú de Cobre", "Copper Chest", 45, "#c8703c", 3, 6],
  ["bau_ferro", "Baú de Ferro", "Iron Chest", 54, "#c8c8c8", 5, 6],
  ["bau_ouro", "Baú de Ouro", "Gold Chest", 81, "#f2c84b", 3, 6],
  ["bau_diamante", "Baú de Diamante", "Diamond Chest", 108, "#5ff3e8", 5, 6],
  ["bau_cristal", "Baú de Cristal", "Crystal Chest", 108, "#e6f8ff", 3, 6],
  ["bau_obsidiana", "Baú de Obsidiana", "Obsidian Chest", 108, "#3b2754", 50, 1200],
  ["bau_terra", "Baú de Terra 9000!", "DirtChest 9000!", 1, "#7a5a3a", 0.6, 3],
];
// [id, de, para, pt, en, material, miolo]
const MELHORIAS_BAU = [
  ["melhoria_bau_madeira_cobre", "minecraft:chest", "cl:bau_cobre", "Melhoria de Baú: Madeira → Cobre", "Wood to Copper Chest Upgrade", "minecraft:copper_ingot", "#minecraft:planks"],
  ["melhoria_bau_madeira_ferro", "minecraft:chest", "cl:bau_ferro", "Melhoria de Baú: Madeira → Ferro", "Wood to Iron Chest Upgrade", "minecraft:iron_ingot", "#minecraft:planks"],
  ["melhoria_bau_cobre_ferro", "cl:bau_cobre", "cl:bau_ferro", "Melhoria de Baú: Cobre → Ferro", "Copper to Iron Chest Upgrade", "minecraft:iron_ingot", "minecraft:copper_ingot"],
  ["melhoria_bau_ferro_ouro", "cl:bau_ferro", "cl:bau_ouro", "Melhoria de Baú: Ferro → Ouro", "Iron to Gold Chest Upgrade", "minecraft:gold_ingot", "minecraft:iron_ingot"],
  ["melhoria_bau_ouro_diamante", "cl:bau_ouro", "cl:bau_diamante", "Melhoria de Baú: Ouro → Diamante", "Gold to Diamond Chest Upgrade", "minecraft:glass", "minecraft:diamond"],
  ["melhoria_bau_diamante_cristal", "cl:bau_diamante", "cl:bau_cristal", "Melhoria de Baú: Diamante → Cristal", "Diamond to Crystal Chest Upgrade", "minecraft:glass", "minecraft:obsidian"],
  ["melhoria_bau_diamante_obsidiana", "cl:bau_diamante", "cl:bau_obsidiana", "Melhoria de Baú: Diamante → Obsidiana", "Diamond to Obsidian Chest Upgrade", "minecraft:obsidian", "minecraft:glass"],
];
// [id, pt, en, multiplicador, material]
const MELHORIAS_GAVETA = [
  ["melhoria_gaveta_1", "Melhoria de Armazenamento (I)", "Storage Upgrade (I)", 2, "minecraft:obsidian"],
  ["melhoria_gaveta_2", "Melhoria de Armazenamento (II)", "Storage Upgrade (II)", 4, "minecraft:copper_ingot"],
  ["melhoria_gaveta_3", "Melhoria de Armazenamento (III)", "Storage Upgrade (III)", 8, "minecraft:iron_ingot"],
  ["melhoria_gaveta_4", "Melhoria de Armazenamento (IV)", "Storage Upgrade (IV)", 16, "minecraft:gold_ingot"],
  ["melhoria_gaveta_5", "Melhoria de Armazenamento (V)", "Storage Upgrade (V)", 64, "minecraft:emerald"],
  ["melhoria_gaveta_6", "Melhoria de Armazenamento (VI)", "Storage Upgrade (VI)", 256, "minecraft:diamond"],
  ["melhoria_gaveta_7", "Melhoria de Armazenamento (VII)", "Storage Upgrade (VII)", 2048, "minecraft:netherite_ingot"],
];
// [id, pt, en, espaços, pilhas por espaço]
const GAVETAS = [
  ["gaveta", "Gaveta", "Drawer", 1, 32],
  ["gaveta_2", "Gaveta 1×2", "Drawers 1x2", 2, 16],
  ["gaveta_4", "Gaveta 2×2", "Drawers 2x2", 4, 8],
  ["gaveta_compactadora", "Gaveta Compactadora", "Compacting Drawers", 3, 32],
];

export default {
  fase: 51,
  mod: "Storage Drawers",
  itens: [
    ...MELHORIAS_BAU.map(([id, , , pt, en]) => ({ id, pt, en, icone: "bola:#c8c8c8", ...IC })),
    ...MELHORIAS_GAVETA.map(([id, pt, en]) => ({ id, pt, en, icone: "bola:#8a6a3e", ...SD })),
    { id: "melhoria_gaveta_base", pt: "Modelo de Melhoria", en: "Upgrade Template", icone: "bola:#8a6a3e", ...SD },
    { id: "melhoria_gaveta_vazio", pt: "Melhoria de Vazio", en: "Void Upgrade", icone: "bola:#1a1a1a", ...SD },
    { id: "chave_gaveta", pt: "Chave de Gaveta", en: "Drawer Key", icone: "bola:#f2c84b", pilha: 1, ...SD },
  ],
  blocos: [
    ...BAUS.map(([id, pt, en, , cor, dureza, resistencia]) => ({ id, pt, en, tipo: "cubo", cor, padrao: "liso", dureza, resistencia, comp: "cl:bau_grande", ...IC })),
    ...GAVETAS.map(([id, pt, en]) => ({ id, pt, en, tipo: "cubo", cor: "#8a6a3e", padrao: "liso", dureza: 3, comp: "cl:gaveta", ...SD })),
    { id: "controlador_gavetas", pt: "Controlador de Gavetas", en: "Drawer Controller", tipo: "cubo", cor: "#8a8a8a", padrao: "liso", dureza: 3.5, comp: "cl:gaveta", ...SD },
    { id: "acabamento_gaveta", pt: "Acabamento de Gaveta", en: "Drawer Trim", tipo: "cubo", cor: "#8a6a3e", padrao: "liso", dureza: 2, ...SD },
  ],
  receitas: [
    { id: "bau_cobre", tipo: "shaped", padrao: ["CGC", "CBC", "CCC"], chave: { C: "minecraft:copper_ingot", G: "minecraft:glass", B: "minecraft:chest" }, resultado: "cl:bau_cobre" }, // o 8 cobre + baú é o Baú de Cobre do jogo
    { id: "bau_ferro", tipo: "shaped", padrao: ["III", "IBI", "III"], chave: { I: "minecraft:iron_ingot", B: "minecraft:chest" }, resultado: "cl:bau_ferro" },
    { id: "bau_ferro_cobre", tipo: "shaped", padrao: ["IGI", "GBG", "IGI"], chave: { I: "minecraft:iron_ingot", G: "minecraft:glass", B: "cl:bau_cobre" }, resultado: "cl:bau_ferro" },
    { id: "bau_ouro", tipo: "shaped", padrao: ["GGG", "GBG", "GGG"], chave: { G: "minecraft:gold_ingot", B: "cl:bau_ferro" }, resultado: "cl:bau_ouro" },
    { id: "bau_diamante", tipo: "shaped", padrao: ["GGG", "DBD", "GGG"], chave: { G: "minecraft:glass", D: "minecraft:diamond", B: "cl:bau_ouro" }, resultado: "cl:bau_diamante" },
    { id: "bau_cristal", tipo: "shaped", padrao: ["GGG", "GBG", "GGG"], chave: { G: "minecraft:glass", B: "cl:bau_diamante" }, resultado: "cl:bau_cristal" },
    { id: "bau_obsidiana", tipo: "shaped", padrao: ["OOO", "OBO", "OOO"], chave: { O: "minecraft:obsidian", B: "cl:bau_diamante" }, resultado: "cl:bau_obsidiana" },
    { id: "bau_terra", tipo: "shaped", padrao: ["DDD", "DBD", "DDD"], chave: { D: "minecraft:dirt", B: "minecraft:chest" }, resultado: "cl:bau_terra" },
    ...MELHORIAS_BAU.map(([id, , , , , mat, miolo]) => ({ id, tipo: "shaped", padrao: ["MMM", "MXM", "MMM"], chave: { M: mat, X: miolo }, resultado: `cl:${id}` })),
    { id: "gaveta", tipo: "shaped", padrao: ["PPP", "PBP", "PSP"], chave: { P: "#minecraft:planks", B: "minecraft:chest", S: "minecraft:stick" }, resultado: "cl:gaveta" },
    { id: "gaveta_2", tipo: "shaped", padrao: ["PBP", "PPP", "PBP"], chave: { P: "#minecraft:planks", B: "minecraft:chest" }, resultado: "cl:gaveta_2", qtd: 2 },
    { id: "gaveta_4", tipo: "shaped", padrao: ["BPB", "PPP", "BPB"], chave: { P: "#minecraft:planks", B: "minecraft:chest" }, resultado: "cl:gaveta_4", qtd: 4 },
    { id: "gaveta_compactadora", tipo: "shaped", padrao: ["SSS", "PGP", "SIS"], chave: { S: "minecraft:stone", P: "minecraft:piston", G: "cl:gaveta", I: "minecraft:iron_ingot" }, resultado: "cl:gaveta_compactadora" },
    { id: "controlador_gavetas", tipo: "shaped", padrao: ["SSS", "CGC", "SDS"], chave: { S: "minecraft:stone", C: "minecraft:comparator", G: "cl:gaveta", D: "minecraft:diamond" }, resultado: "cl:controlador_gavetas" },
    { id: "acabamento_gaveta", tipo: "shaped", padrao: ["SPS", "PPP", "SPS"], chave: { S: "minecraft:stick", P: "#minecraft:planks" }, resultado: "cl:acabamento_gaveta", qtd: 4 },
    { id: "melhoria_gaveta_base", tipo: "shaped", padrao: ["SSS", "SGS", "SSS"], chave: { S: "minecraft:stick", G: "cl:gaveta" }, resultado: "cl:melhoria_gaveta_base", qtd: 2 },
    ...MELHORIAS_GAVETA.map(([id, , , , mat]) => ({ id, tipo: "shaped", padrao: ["SMS", "MBM", "SMS"], chave: { S: "minecraft:stick", M: mat, B: "cl:melhoria_gaveta_base" }, resultado: `cl:${id}` })),
    { id: "melhoria_gaveta_vazio", tipo: "shaped", padrao: ["OOO", "OBO", "OOO"], chave: { O: "minecraft:obsidian", B: "cl:melhoria_gaveta_base" }, resultado: "cl:melhoria_gaveta_vazio" },
    { id: "chave_gaveta", tipo: "shaped", padrao: [" G ", "GBG", " G "], chave: { G: "minecraft:gold_nugget", B: "cl:melhoria_gaveta_base" }, resultado: "cl:chave_gaveta" },
  ],
  textos: {
    "entity.cl:bau_grande.name": ["Baú", "Chest"],
    "cl.bau.pagina": ["Página %s de %s", "Page %s of %s"],
    "cl.bau.dica": ["Baú grande: agachado e tocando troca de página; bater guarda o baú com tudo dentro (como uma caixa de shulker).", "Big chest: sneak and tap to change page; hit it to pick it up with everything inside (like a shulker box)."],
    "cl.bau.melhorou": ["O baú virou %s, sem perder nada.", "The chest became %s, keeping everything."],
    "cl.bau.duplo": ["Separe o baú duplo antes de melhorar.", "Split the double chest before upgrading."],
    "cl.bau.errado": ["Esta melhoria é para %s.", "This upgrade is for %s."],
    "cl.bau.conteudo": ["§7%s itens guardados", "§7%s items stored"],
    "cl.gaveta.vazia": ["Gaveta vazia", "Empty drawer"],
    "cl.gaveta.linha": ["%s: %s / %s", "%s: %s / %s"],
    "cl.gaveta.melhorias": ["§7Melhorias: %s/7 (×%s)", "§7Upgrades: %s/7 (x%s)"],
    "cl.gaveta.titulo": ["Gaveta", "Drawer"],
    "cl.gaveta.corpo": ["Toque com um item para guardar (dois toques: tudo daquele item da mochila). Bata para tirar uma pilha (agachado: um). Agachado e de mão vazia: este menu. Quebrada, a gaveta guarda tudo no item.", "Tap with an item to store (double tap: all of that item from your inventory). Hit to take a stack (sneaking: one). Sneak with an empty hand: this menu. When broken, the drawer keeps everything in the item."],
    "cl.gaveta.tirar_melhoria": ["Tirar: %s", "Remove: %s"],
    "cl.gaveta.cheia": ["A gaveta está cheia.", "The drawer is full."], "cl.gaveta.outro": ["Esta gaveta guarda outro item.", "This drawer holds another item."],
    "cl.gaveta.max_melhorias": ["A gaveta já tem 7 melhorias.", "The drawer already has 7 upgrades."],
    "cl.gaveta.travada": ["Gaveta travada no item (chave de novo destrava).", "Drawer locked to its item (use the key again to unlock)."], "cl.gaveta.destravada": ["Gaveta destravada.", "Drawer unlocked."],
    "cl.gaveta.nao_compacta": ["A Compactadora só guarda o que vira bloco (ferro, ouro, diamante, carvão, redstone...).", "The Compacting Drawer only takes items that compact (iron, gold, diamond, coal, redstone...)."],
    "cl.gaveta.controlador": ["Controlador: guardou %s itens nas gavetas em volta.", "Controller: stored %s items in the nearby drawers."],
    "cl.gaveta.especial": ["Itens com nome, encanto ou desgaste não vão na gaveta.", "Named, enchanted or damaged items don't go in drawers."],
    "cl.capitulo.armazenamento.nome": ["Baús e Gavetas (Iron Chests, Storage Drawers)", "Chests and Drawers"],
    "cl.capitulo.armazenamento.curto": ["Baús+", "Chests+"],
    "cl.capitulo.armazenamento.desc": ["Baús maiores (Cobre 45, Ferro 54, Ouro 81, Diamante, Cristal e Obsidiana 108) com páginas, e as gavetas que guardam muito de um item só: toque para guardar, bata para tirar. Melhorias multiplicam o que cabe.", "Bigger chests (Copper 45, Iron 54, Gold 81, Diamond, Crystal and Obsidian 108) with pages, and drawers that hold lots of a single item: tap to store, hit to take. Upgrades multiply the capacity."],
    "cl.missao.ic_cobre.titulo": ["Baú de Cobre", "Copper Chest"], "cl.missao.ic_cobre.desc": ["Faça um Baú de Cobre (45 espaços).", "Make a Copper Chest (45 slots)."],
    "cl.missao.ic_melhoria.titulo": ["Melhorar sem esvaziar", "Upgrade in place"], "cl.missao.ic_melhoria.desc": ["Use uma melhoria de baú num baú cheio de coisas.", "Use a chest upgrade on a chest full of stuff."],
    "cl.missao.ic_diamante.titulo": ["Baú de Diamante", "Diamond Chest"], "cl.missao.ic_diamante.desc": ["Tenha um Baú de Diamante (108 espaços).", "Have a Diamond Chest (108 slots)."],
    "cl.missao.sd_gaveta.titulo": ["Gaveta", "Drawer"], "cl.missao.sd_gaveta.desc": ["Guarde 1000 itens em gavetas.", "Store 1000 items in drawers."],
    "cl.missao.sd_compacta.titulo": ["Compactadora", "Compacting"], "cl.missao.sd_compacta.desc": ["Faça a Gaveta Compactadora: põe pepita, tira bloco.", "Make the Compacting Drawer: put nuggets in, take blocks out."],
    "cl.missao.sd_controlador.titulo": ["Controlador", "Controller"], "cl.missao.sd_controlador.desc": ["Guarde pelo Controlador de Gavetas.", "Store through the Drawer Controller."],
    "cl.missao.sd_melhoria.titulo": ["Gaveta melhorada", "Upgraded drawer"], "cl.missao.sd_melhoria.desc": ["Ponha uma melhoria de armazenamento numa gaveta.", "Put a storage upgrade in a drawer."],
  },
  dados: {
    baus: Object.fromEntries(BAUS.map(([id, , , n]) => [id, n])),
    melhoriasBau: Object.fromEntries(MELHORIAS_BAU.map(([id, de, para]) => [id, [de, para]])),
    gavetas: Object.fromEntries(GAVETAS.map(([id, , , n, pilhas]) => [id, [n, pilhas]])),
    melhoriasGaveta: Object.fromEntries(MELHORIAS_GAVETA.map(([id, , , mult]) => [id, mult])),
  },
};

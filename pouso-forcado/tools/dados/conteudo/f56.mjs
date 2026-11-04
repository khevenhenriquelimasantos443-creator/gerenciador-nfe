// Fase 56 (1.37.0): Quark 4.1 (o mais novo, 1.21.1; Vazkii e equipe, arte CC BY-NC-SA 3.0). Arte e modelos 3D do mod por
// tools/importar-quark4.py (tools/dados/quark4.json); scripts em scripts/utilidades/quark4.ts. Os números são os do
// código do mod (módulos e loot tables). O calcário do Quark já existe no pack (o do Chisel), então fica de fora.
// - Construção: tijolos de arenito (normal, vermelho e de almas), arenito de almas, tijolos de metal bruto, banquinhos
//   (dá para sentar), barras de ouro, toras ocas e postes de madeira.
// - Corindo (9 cores): cristais que brilham (luz 11) nas cavernas e crescem aglomerados; Lâmpadas de Cristal (luz 15,
//   acendem com redstone).
// - Caixa de Monstros (cavernas fundas): perto dela (2,5 blocos) ela rosna e solta 5 a 8 monstros, que deixam o saque
//   extra do mod ao morrer.
// - Automação: Calha (derruba os itens do baú/funil de cima), Cocho (bichos por perto comem e procriam sozinhos) e Barra
//   de Ferro (o pistão que a empurra quebra o bloco da frente).
// - Ferramentas: Colher de Pedreiro (põe um bloco ao acaso da barra), Bolsa de Sementes (640 sementes; agachado planta
//   3×3), Ábaco (mede a distância), Nuvem Engarrafada (bloco no ar por 10 s; garrafa vazia na altura das nuvens),
//   Slime no Balde e Cacos de Vidro.
// - Batatinha (Tiny Potato).
import { readFileSync } from "node:fs";

const QK = { mod: "Quark" };
const M = JSON.parse(readFileSync(new URL("../quark4.json", import.meta.url), "utf8"));
// Bloco com o modelo 3D do mod (geometria, materiais e caixa do importador).
const modelo = (id, mais = {}) => {
  const m = M[id];
  return {
    "minecraft:geometry": m.geometria, "minecraft:material_instances": { "*": Object.values(m.materiais)[0], ...m.materiais },
    "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0, ...mais,
  };
};
export const CORES = [
  ["vermelho", "Vermelho", "Red", "#c43a35", "minecraft:red_dye"], ["laranja", "Laranja", "Orange", "#e0832d", "minecraft:orange_dye"],
  ["amarelo", "Amarelo", "Yellow", "#e8cf3a", "minecraft:yellow_dye"], ["verde", "Verde", "Green", "#58b33e", "minecraft:lime_dye"],
  ["azul", "Azul", "Blue", "#3d7fd9", "minecraft:light_blue_dye"], ["anil", "Anil", "Indigo", "#4a43b8", "minecraft:blue_dye"],
  ["violeta", "Violeta", "Violet", "#9b45c9", "minecraft:purple_dye"], ["branco", "Branco", "White", "#e9eef2", "minecraft:white_dye"],
  ["preto", "Preto", "Black", "#2a2a33", "minecraft:black_dye"],
];
const LAS = [
  ["branco", "Branco", "White", "white"], ["laranja", "Laranja", "Orange", "orange"], ["magenta", "Magenta", "Magenta", "magenta"],
  ["azul_claro", "Azul-Claro", "Light Blue", "light_blue"], ["amarelo", "Amarelo", "Yellow", "yellow"], ["lima", "Lima", "Lime", "lime"],
  ["rosa", "Rosa", "Pink", "pink"], ["cinza", "Cinza", "Gray", "gray"], ["cinza_claro", "Cinza-Claro", "Light Gray", "light_gray"],
  ["ciano", "Ciano", "Cyan", "cyan"], ["roxo", "Roxo", "Purple", "purple"], ["azul", "Azul", "Blue", "blue"], ["marrom", "Marrom", "Brown", "brown"],
  ["verde", "Verde", "Green", "green"], ["vermelho", "Vermelho", "Red", "red"], ["preto", "Preto", "Black", "black"],
];
const MADEIRAS = [
  ["carvalho", "Carvalho", "Oak", "oak"], ["pinheiro", "Pinheiro", "Spruce", "spruce"], ["betula", "Bétula", "Birch", "birch"],
  ["selva", "Selva", "Jungle", "jungle"], ["acacia", "Acácia", "Acacia", "acacia"], ["carvalho_escuro", "Carvalho Escuro", "Dark Oak", "dark_oak"],
];
const cubo = (id, pt, en, cor, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao: "tijolos", dureza: 1.5, girar: false, ...QK, ...extra });
const lampada = (cor) => `lampada_cristal_${cor}`;

export default {
  fase: 56,
  mod: "Quark",
  itens: [
    { id: "colher_pedreiro", pt: "Colher de Pedreiro", en: "Trowel", icone: "barra:#b8b8b8", pilha: 1, ...QK, comp: { "minecraft:hand_equipped": true } },
    { id: "bolsa_sementes", pt: "Bolsa de Sementes", en: "Seed Pouch", icone: "saco:#8a5a2a", pilha: 1, ...QK },
    { id: "abaco", pt: "Ábaco", en: "Abacus", icone: "barra:#a07c48", pilha: 1, ...QK },
    { id: "nuvem_engarrafada", pt: "Nuvem Engarrafada", en: "Bottled Cloud", icone: "bola:#eef4fb", ...QK },
    { id: "slime_balde", pt: "Slime no Balde", en: "Slime in a Bucket", icone: "bola:#7bc95f", pilha: 1, ...QK },
    { id: "caco_vidro", pt: "Caco de Vidro", en: "Glass Shard", icone: "bola:#cfe8ee", ...QK },
  ],
  blocos: [
    cubo("tijolos_arenito", "Tijolos de Arenito", "Sandstone Bricks", "#d8cb8f"),
    cubo("tijolos_arenito_vermelho", "Tijolos de Arenito Vermelho", "Red Sandstone Bricks", "#b65b25"),
    cubo("arenito_almas", "Arenito de Almas", "Soul Sandstone", "#5a4636"),
    cubo("arenito_almas_cortado", "Arenito de Almas Cortado", "Cut Soul Sandstone", "#5a4636"),
    cubo("arenito_almas_entalhado", "Arenito de Almas Entalhado", "Chiseled Soul Sandstone", "#5a4636"),
    cubo("tijolos_arenito_almas", "Tijolos de Arenito de Almas", "Soul Sandstone Bricks", "#5a4636"),
    cubo("tijolos_ferro_bruto", "Tijolos de Ferro Bruto", "Raw Iron Bricks", "#a58a74", { dureza: 3 }),
    cubo("tijolos_ouro_bruto", "Tijolos de Ouro Bruto", "Raw Gold Bricks", "#d9a334", { dureza: 3 }),
    cubo("tijolos_cobre_bruto", "Tijolos de Cobre Bruto", "Raw Copper Bricks", "#a35a3e", { dureza: 3 }),
    // Corindo: luz 11 (CorundumBlock), translúcido; cresce aglomerados (scripts/utilidades/quark4.ts).
    ...CORES.flatMap(([c, pt, en, cor]) => [
      { id: `corindo_${c}`, pt: `Corindo ${pt}`, en: `${en} Corundum`, tipo: "vidro", cor, dureza: 1.5, luzEmite: 11, comp: "cl:corindo", girar: false, ...QK },
      {
        id: `aglomerado_corindo_${c}`, pt: `Aglomerado de Corindo ${pt}`, en: `${en} Corundum Cluster`, tipo: "cubo", cor, dureza: 1.5, luzEmite: 4, girar: false, ...QK,
        extra: {
          "minecraft:geometry": "geometry.cl.planta", "minecraft:material_instances": { "*": { texture: `clc_aglomerado_corindo_${c}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
          "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-5, 0, -5], size: [10, 12, 10] }, "minecraft:light_dampening": 0,
        },
      },
      // Lâmpada de Cristal (RainbowLamps): luz 15 quando recebe redstone.
      {
        id: lampada(c), pt: `Lâmpada de Cristal ${pt}`, en: `${en} Crystal Lamp`, tipo: "cubo", cor, dureza: 0.3, girar: false, comp: "cl:lampada_cristal", tick: [10, 10], ...QK,
        estados: { "cl:acesa": [false, true] },
        permutacoes: [{
          condition: "q.block_state('cl:acesa')",
          components: { "minecraft:light_emission": 15, "minecraft:material_instances": { "*": { texture: `clc_${lampada(c)}_acesa`, render_method: "opaque", ambient_occlusion: 0, face_dimming: false } } },
        }],
      },
    ]),
    ...LAS.map(([c, pt, en]) => ({
      id: `banquinho_${c}`, pt: `Banquinho ${pt}`, en: `${en} Stool`, tipo: "cubo", cor: "#a07c48", dureza: 0.5, girar: false, comp: "cl:banquinho", ...QK,
      extra: modelo(`banquinho_${c}`),
    })),
    { id: "batatinha", pt: "Batatinha", en: "Tiny Potato", tipo: "cubo", cor: "#c9a061", dureza: 0.3, girar: true, comp: "cl:batatinha", ...QK, extra: modelo("batatinha") },
    { id: "calha_itens", pt: "Calha", en: "Chute", tipo: "cubo", cor: "#9a7a4a", dureza: 1.5, girar: false, comp: "cl:calha_itens", tick: [8, 8], ...QK, extra: modelo("calha_itens") },
    { id: "cocho", pt: "Cocho", en: "Feeding Trough", tipo: "cubo", cor: "#9a7a4a", dureza: 0.6, girar: false, comp: "cl:cocho", tick: [30, 30], ...QK, extra: modelo("cocho") },
    { id: "barra_ferro", pt: "Barra de Ferro", en: "Iron Rod", tipo: "cubo", cor: "#c8c8c8", dureza: 3, eixo: true, ...QK, extra: modelo("barra_ferro") },
    { id: "barras_ouro", pt: "Barras de Ouro", en: "Gold Bars", tipo: "cubo", cor: "#f2c84b", dureza: 3, girar: false, ...QK, extra: modelo("barras_ouro") },
    ...MADEIRAS.flatMap(([m, pt, en]) => [
      { id: `tora_oca_${m}`, pt: `Tora Oca de ${pt}`, en: `Hollow ${en} Log`, tipo: "cubo", cor: "#7a5a33", dureza: 2, eixo: true, ...QK, extra: modelo(`tora_oca_${m}`) },
      { id: `poste_${m}`, pt: `Poste de ${pt}`, en: `${en} Post`, tipo: "cubo", cor: "#7a5a33", dureza: 2, eixo: true, ...QK, extra: modelo(`poste_${m}`) },
    ]),
    // Caixa de Monstros (MonsterBoxModule): dureza alta, só sai pelo susto.
    { id: "caixa_monstros", pt: "Caixa de Monstros", en: "Monster Box", tipo: "cubo", cor: "#3a3a3a", dureza: 25, resistencia: 1200, girar: false, comp: "cl:caixa_monstros", tick: [10, 10], loot: "loot_tables/empty.json", ...QK },
    // A nuvem da Nuvem Engarrafada (CloudBlockEntity: 200 ticks).
    {
      id: "nuvem", pt: "Nuvem", en: "Cloud", tipo: "vidro", cor: "#f4f8fc", dureza: 0, girar: false, comp: "cl:nuvem", tick: [200, 200], loot: "loot_tables/empty.json", ...QK,
      extra: { "minecraft:material_instances": { "*": { texture: "clc_nuvem", render_method: "blend", ambient_occlusion: 0 } } },
    },
  ],
  receitas: [
    { id: "tijolos_arenito", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "minecraft:cut_sandstone" }, resultado: "cl:tijolos_arenito", qtd: 4 },
    { id: "tijolos_arenito_vermelho", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "minecraft:cut_red_sandstone" }, resultado: "cl:tijolos_arenito_vermelho", qtd: 4 },
    { id: "arenito_almas", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "minecraft:soul_sand" }, resultado: "cl:arenito_almas" },
    { id: "arenito_almas_cortado", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:arenito_almas" }, resultado: "cl:arenito_almas_cortado", qtd: 4 },
    { id: "arenito_almas_entalhado", tipo: "shaped", padrao: ["#", "#"], chave: { "#": "cl:arenito_almas_cortado" }, resultado: "cl:arenito_almas_entalhado" },
    { id: "tijolos_arenito_almas", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:arenito_almas_cortado" }, resultado: "cl:tijolos_arenito_almas", qtd: 4 },
    ...[["ferro", "iron"], ["ouro", "gold"], ["cobre", "copper"]].map(([pt, en]) => (
      { id: `tijolos_${pt}_bruto`, tipo: "shaped", padrao: ["##", "##"], chave: { "#": `minecraft:raw_${en}_block` }, resultado: `cl:tijolos_${pt}_bruto`, qtd: 4 })),
    ...CORES.map(([c]) => ({ id: lampada(c), tipo: "shaped", padrao: [" R ", "RCR", " R "], chave: { R: "minecraft:redstone", C: `cl:corindo_${c}` }, resultado: `cl:${lampada(c)}` })),
    ...LAS.map(([c, , , en]) => ({ id: `banquinho_${c}`, tipo: "shaped", padrao: ["###", "WWW"], chave: { "#": `minecraft:${en}_wool`, W: "#minecraft:wooden_slabs" }, resultado: `cl:banquinho_${c}`, qtd: 4 })),
    { id: "batatinha", tipo: "shaped", padrao: ["D", "P"], chave: { D: "minecraft:diamond", P: "minecraft:potato" }, resultado: "cl:batatinha" },
    { id: "batatinha_esmeralda", tipo: "shaped", padrao: ["D", "P"], chave: { D: "minecraft:emerald", P: "minecraft:potato" }, resultado: "cl:batatinha" },
    { id: "calha_itens", tipo: "shaped", padrao: ["WWW", "SWS", " S "], chave: { W: "#minecraft:planks", S: "minecraft:stick" }, resultado: "cl:calha_itens" },
    { id: "cocho", tipo: "shaped", padrao: ["#W#", "###"], chave: { "#": "#minecraft:planks", W: "minecraft:wheat" }, resultado: "cl:cocho" },
    { id: "barra_ferro", tipo: "shaped", padrao: ["I", "I", "R"], chave: { I: "minecraft:iron_ingot", R: "minecraft:end_rod" }, resultado: "cl:barra_ferro" },
    { id: "barras_ouro", tipo: "shaped", padrao: ["###", "###"], chave: { "#": "minecraft:gold_ingot" }, resultado: "cl:barras_ouro", qtd: 16 },
    ...MADEIRAS.flatMap(([m, , , en]) => [
      { id: `tora_oca_${m}`, tipo: "shaped", padrao: [" L ", "L L", " L "], chave: { L: `minecraft:${en}_log` }, resultado: `cl:tora_oca_${m}`, qtd: 4 },
      { id: `poste_${m}`, tipo: "shaped", padrao: ["F", "F", "F"], chave: { F: `minecraft:${en}_wood` }, resultado: `cl:poste_${m}`, qtd: 8 },
    ]),
    { id: "colher_pedreiro", tipo: "shaped", padrao: ["S  ", " II"], chave: { S: "minecraft:stick", I: "minecraft:iron_ingot" }, resultado: "cl:colher_pedreiro" },
    { id: "bolsa_sementes", tipo: "shaped", padrao: [" S ", "HXH", " H "], chave: { S: "minecraft:string", H: "minecraft:leather", X: "minecraft:wheat_seeds" }, resultado: "cl:bolsa_sementes" },
    { id: "abaco", tipo: "shaped", padrao: ["WSW", "WIW", "WSW"], chave: { W: "#minecraft:planks", S: "minecraft:stick", I: "minecraft:iron_ingot" }, resultado: "cl:abaco" },
    { id: "vidro_cacos", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:caco_vidro" }, resultado: "minecraft:glass" },
  ],
  textos: {
    "cl.qk4.bolsa": ["§7Bolsa: %s × %s (de 640)", "§7Pouch: %s × %s (of 640)"],
    "cl.qk4.bolsa_vazia": ["§7Bolsa vazia: use no ar para guardar as sementes do inventário.", "§7Empty pouch: use it in the air to store the seeds in your inventory."],
    "cl.qk4.bolsa_cheia": ["Bolsa de Sementes: %s guardadas.", "Seed Pouch: %s stored."],
    "cl.qk4.abaco_marcou": ["Ábaco: ponto marcado. Olhe para outro bloco para medir (agachado limpa).", "Abacus: point set. Look at another block to measure (sneak to clear)."],
    "cl.qk4.abaco": ["Ábaco: %s blocos", "Abacus: %s blocks"],
    "cl.qk4.abaco_longe": ["Ábaco: mais de 48 blocos", "Abacus: over 48 blocks"],
    "cl.qk4.nuvem_alto": ["A garrafa só pega nuvem na altura das nuvens (y 191 a 196).", "The bottle only catches a cloud at cloud height (y 191 to 196)."],
    "cl.qk4.cocho": ["§7Cocho: %s × %s", "§7Trough: %s × %s"],
    "cl.qk4.cocho_vazio": ["§7Cocho vazio: ponha comida de bicho (trigo, cenoura, sementes...).", "§7Empty trough: add animal food (wheat, carrots, seeds...)."],
    "cl.qk4.batatinha": ["A batatinha ficou feliz! ♥", "The tiny potato is happy! ♥"],
    "cl.qk4.caixa": ["Algo se mexe dentro da caixa...", "Something stirs inside the box..."],
    "cl.capitulo.quark4.nome": ["Quark 4.1", "Quark 4.1"],
    "cl.capitulo.quark4.curto": ["Quark 4.1", "Quark 4.1"],
    "cl.capitulo.quark4.desc": ["As novidades do Quark mais novo: cristais de corindo nas cavernas, caixas de monstros, banquinhos, cocho, calha, barra de ferro e ferramentas pequenas que ajudam muito.", "What's new in the latest Quark: corundum crystals in caves, monster boxes, stools, feeding trough, chute, iron rod and handy little tools."],
    "cl.missao.qk4_corindo.titulo": ["Cristal na caverna", "Cave crystal"], "cl.missao.qk4_corindo.desc": ["Quebre um cristal de Corindo numa caverna.", "Break a Corundum crystal in a cave."],
    "cl.missao.qk4_lampada.titulo": ["Lâmpada de Cristal", "Crystal Lamp"], "cl.missao.qk4_lampada.desc": ["Acenda uma Lâmpada de Cristal com redstone.", "Light a Crystal Lamp with redstone."],
    "cl.missao.qk4_caixa.titulo": ["Caixa de Monstros", "Monster Box"], "cl.missao.qk4_caixa.desc": ["Chegue perto de uma Caixa de Monstros nas cavernas fundas.", "Get close to a Monster Box in the deep caves."],
    "cl.missao.qk4_banquinho.titulo": ["Senta aí", "Have a seat"], "cl.missao.qk4_banquinho.desc": ["Sente num Banquinho.", "Sit on a Stool."],
    "cl.missao.qk4_colher.titulo": ["Colher de Pedreiro", "Trowel"], "cl.missao.qk4_colher.desc": ["Ponha 16 blocos com a Colher de Pedreiro.", "Place 16 blocks with the Trowel."],
    "cl.missao.qk4_bolsa.titulo": ["Bolsa de Sementes", "Seed Pouch"], "cl.missao.qk4_bolsa.desc": ["Plante 32 sementes com a Bolsa de Sementes.", "Plant 32 seeds with the Seed Pouch."],
    "cl.missao.qk4_cocho.titulo": ["Cocho", "Feeding Trough"], "cl.missao.qk4_cocho.desc": ["Deixe os bichos procriarem sozinhos num Cocho.", "Let animals breed by themselves at a Feeding Trough."],
    "cl.missao.qk4_barra.titulo": ["Barra de Ferro", "Iron Rod"], "cl.missao.qk4_barra.desc": ["Quebre um bloco com um pistão empurrando uma Barra de Ferro.", "Break a block with a piston pushing an Iron Rod."],
    "cl.missao.qk4_nuvem.titulo": ["Nuvem Engarrafada", "Bottled Cloud"], "cl.missao.qk4_nuvem.desc": ["Pegue uma nuvem com uma garrafa vazia lá no alto.", "Catch a cloud with an empty bottle up high."],
    "cl.missao.qk4_batatinha.titulo": ["Batatinha", "Tiny Potato"], "cl.missao.qk4_batatinha.desc": ["Faça carinho na Batatinha.", "Pet the Tiny Potato."],
  },
  dados: {
    cores: CORES.map(([c]) => c),
  },
};

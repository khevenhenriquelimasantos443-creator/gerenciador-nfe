// Fase 54 (1.35.0): Waystones 26.3 (o mais novo; BlayTheNinth, todos os direitos reservados: só as ideias e os
// números, arte própria). Variantes da Pedra do Caminho; Pedras de Partilha de 8 cores (toda pedra da mesma cor leva
// a qualquer outra, sem ativar); Pedras-Porto (abrem a lista, mas não recebem viagem); Pedras de Viagem coloridas
// (a rede da cor); Placa de Dobra ligada por Fragmentos; Pergaminho em Branco que se vincula a uma pedra. Viagem por
// pedra ou Pedra de Viagem custa XP (0,01 ponto por bloco, até 27; outra dimensão 27) e a Pedra de Viagem tem 10.000
// de durabilidade (80 por viagem), como no WaystonesConfig do mod. Scripts em scripts/utilidades/waystones.ts.
const W = { mod: "Waystones" };
// [id, pt, en, cor, padrão, material da receita]
export const VARIANTES = [
  ["musgo", "Musgosa", "Mossy", "#6a8a5a", "rachado", "minecraft:mossy_stone_bricks"],
  ["arenito", "de Arenito", "Sandy", "#d8c38a", "entalhado", "minecraft:chiseled_sandstone"],
  ["negra", "Negra", "Black", "#2a2a30", "entalhado", "minecraft:polished_blackstone_bricks"],
  ["ardosia", "de Ardósia", "Deepslate", "#4a4a52", "entalhado", "minecraft:deepslate_bricks"],
  ["ender", "do Ender", "Ender", "#e8e8b0", "entalhado", "minecraft:end_bricks"],
  ["nether", "do Nether", "Nether", "#6a1a1a", "tijolos", "minecraft:red_nether_brick"],
  ["purpura", "Púrpura", "Purpur", "#a878a8", "pilar", "minecraft:purpur_block"],
  ["prismarinho", "de Prismarinho", "Prismarine", "#5aa898", "entalhado", "minecraft:prismarine_bricks"],
  ["lama", "de Lama", "Muddy", "#8a6a50", "tijolos", "minecraft:mud_bricks"],
];
// [cor, pt, en, cor hex, material]
export const CORES = [
  ["cobre", "Cobre", "Copper", "#d4743c", "minecraft:copper_ingot"],
  ["prismarinho", "Prismarinho", "Prismarine", "#5aa898", "minecraft:prismarine_crystals"],
  ["ouro", "Ouro", "Gold", "#f2c94c", "minecraft:gold_ingot"],
  ["diamante", "Diamante", "Diamond", "#5ff3e8", "minecraft:diamond"],
  ["ametista", "Ametista", "Amethyst", "#a070e0", "minecraft:amethyst_shard"],
  ["lapis", "Lápis", "Lapis", "#3050c0", "minecraft:lapis_lazuli"],
  ["esmeralda", "Esmeralda", "Emerald", "#3cb878", "minecraft:emerald"],
  ["redstone", "Redstone", "Redstone", "#c0392b", "minecraft:redstone"],
];

export default {
  fase: 54,
  mod: "Waystones",
  itens: [
    ...CORES.map(([c, pt, en, cor]) => ({ id: `pedra_viagem_${c}`, pt: `Pedra de Viagem de ${pt}`, en: `${en} Warp Stone`, icone: `cristal:${cor}`, pilha: 1, ...W,
      comp: { "minecraft:durability": { max_durability: 10000 } } })),
    { id: "fragmento_dormente", pt: "Fragmento Dormente", en: "Dormant Shard", icone: "cristal:#8a70a8", pilha: 4, ...W },
    { id: "fragmento_sintonizado", pt: "Fragmento Sintonizado", en: "Attuned Shard", icone: "cristal:#d0a0ff", pilha: 1, ...W },
    { id: "pergaminho_vazio", pt: "Pergaminho em Branco", en: "Unbound Scroll", icone: "placa:#e9dfc0", pilha: 16, ...W },
    { id: "pergaminho_vinculado", pt: "Pergaminho Vinculado", en: "Bound Scroll", icone: "placa:#c9a8f0", pilha: 1, ...W },
  ],
  blocos: [
    ...VARIANTES.map(([v, pt, en, cor, padrao]) => ({ id: `pedra_caminho_${v}`, pt: `Pedra do Caminho ${pt}`, en: `${en} Waystone`, tipo: "cubo", cor, padrao,
      dureza: 5, girar: false, luzEmite: 5, comp: "cl:pedra_caminho", ...W })),
    ...CORES.map(([c, pt, en, cor]) => ({ id: `pedra_partilha_${c}`, pt: `Pedra de Partilha de ${pt}`, en: `${en} Sharestone`, tipo: "cubo", cor, padrao: "entalhado",
      dureza: 5, girar: false, luzEmite: 7, comp: "cl:pedra_partilha", ...W })),
    { id: "pedra_porto", pt: "Pedra-Porto", en: "Portstone", tipo: "cubo", cor: "#8a8a92", padrao: "pilar", dureza: 4, girar: false, luzEmite: 4, comp: "cl:pedra_porto", ...W },
    ...CORES.map(([c, pt, en, cor]) => ({ id: `pedra_porto_${c}`, pt: `Pedra-Porto de ${pt}`, en: `${en} Portstone`, tipo: "cubo", cor, padrao: "pilar",
      dureza: 4, girar: false, luzEmite: 4, comp: "cl:pedra_porto", ...W })),
    {
      id: "placa_dobra", pt: "Placa de Dobra", en: "Warp Plate", tipo: "cubo", cor: "#9a8ab8", padrao: "mosaico", dureza: 3, girar: false, luzEmite: 6, comp: "cl:placa_dobra", ...W,
      geometria: { ossos: { placa: [[[-8, 0, -8], [16, 2, 16]]] } },
      extra: { "minecraft:collision_box": { origin: [-8, 0, -8], size: [16, 2, 16] }, "minecraft:selection_box": { origin: [-8, 0, -8], size: [16, 2, 16] }, "minecraft:light_dampening": 0 },
    },
  ],
  receitas: [
    ...VARIANTES.map(([v, , , , , mat]) => ({ id: `pedra_caminho_${v}`, tipo: "shaped", padrao: [" S ", "SWS", "SSS"], chave: { S: mat, W: "cl:pedra_viagem" }, resultado: `cl:pedra_caminho_${v}` })),
    ...CORES.flatMap(([c, , , , mat]) => [
      { id: `pedra_partilha_${c}`, tipo: "shaped", padrao: ["SSS", "DWD", "SSS"], chave: { S: "minecraft:stone_bricks", D: mat, W: "cl:pedra_viagem" }, resultado: `cl:pedra_partilha_${c}` },
      { id: `pedra_porto_${c}`, tipo: "shaped", padrao: ["DSD", "SWS", "BBB"], chave: { B: "minecraft:stone_bricks", D: mat, S: "minecraft:stone_brick_slab", W: "cl:pedra_viagem" }, resultado: `cl:pedra_porto_${c}` },
      { id: `pedra_viagem_${c}`, tipo: "shaped", padrao: [" M ", "MWM", " M "], chave: { M: mat, W: "cl:pedra_viagem" }, resultado: `cl:pedra_viagem_${c}` },
    ]),
    { id: "pedra_porto", tipo: "shaped", padrao: [" S ", "SWS", "BBB"], chave: { B: "minecraft:stone_bricks", S: "minecraft:stone_brick_slab", W: "cl:pedra_viagem" }, resultado: "cl:pedra_porto" },
    { id: "placa_dobra", tipo: "shaped", padrao: ["SAS", "AFA", "SAS"], chave: { A: "minecraft:amethyst_shard", F: "minecraft:flint", S: "minecraft:stone_bricks" }, resultado: "cl:placa_dobra" },
    { id: "fragmento_dormente", tipo: "shaped", padrao: [" A ", "AFA", " A "], chave: { A: "minecraft:amethyst_shard", F: "minecraft:flint" }, resultado: "cl:fragmento_dormente" },
    { id: "pergaminho_vazio", tipo: "shaped", padrao: ["GFG", "PPP"], chave: { G: "minecraft:gold_nugget", F: "minecraft:feather", P: "minecraft:paper" }, resultado: "cl:pergaminho_vazio" },
  ],
  textos: {
    "cl.wy.xp": ["A viagem custa %s de experiência (você tem %s).", "The trip costs %s experience (you have %s)."],
    "cl.wy.partilha_vazia": ["Nenhuma outra Pedra de Partilha desta cor.", "No other Sharestone of this color."],
    "cl.wy.partilha": ["Pedras de Partilha (%s)", "Sharestones (%s)"],
    "cl.wy.placa": ["Placa de Dobra: toque com um Fragmento Dormente para sintonizar; leve o fragmento a outra placa para ligar as duas. Fique em cima para viajar.", "Warp Plate: tap with a Dormant Shard to attune it; bring the shard to another plate to link both. Stand on it to travel."],
    "cl.wy.placa_sintonizada": ["Fragmento sintonizado com esta placa. Leve-o a outra Placa de Dobra.", "Shard attuned to this plate. Bring it to another Warp Plate."],
    "cl.wy.placa_ligada": ["Placas ligadas! Fique em cima de uma para ir à outra.", "Plates linked! Stand on one to go to the other."],
    "cl.wy.placa_indo": ["Dobrando...", "Warping..."],
    "cl.wy.vinculado": ["Pergaminho vinculado a %s.", "Scroll bound to %s."],
    "cl.capitulo.waystones2.nome": ["Waystones 26", "Waystones 26"], "cl.capitulo.waystones2.curto": ["Viagens+", "Travel+"],
    "cl.capitulo.waystones2.desc": ["O Waystones mais novo: pedras de partilha coloridas (todas da mesma cor se ligam), pedras-porto, placas de dobra com fragmentos e pergaminhos vinculados. Viajar por pedra custa um pouco de experiência.", "The newest Waystones: colored sharestones (all of a color are linked), portstones, warp plates with shards and bound scrolls. Traveling by waystone costs a bit of experience."],
    "cl.missao.wy2_partilha.titulo": ["Pedras de Partilha", "Sharestones"], "cl.missao.wy2_partilha.desc": ["Viaje entre duas Pedras de Partilha da mesma cor.", "Travel between two Sharestones of the same color."],
    "cl.missao.wy2_placa.titulo": ["Placa de Dobra", "Warp Plate"], "cl.missao.wy2_placa.desc": ["Ligue duas Placas de Dobra com um fragmento e viaje.", "Link two Warp Plates with a shard and travel."],
    "cl.missao.wy2_pergaminho.titulo": ["Pergaminho vinculado", "Bound scroll"], "cl.missao.wy2_pergaminho.desc": ["Vincule um Pergaminho em Branco a uma Pedra do Caminho.", "Bind an Unbound Scroll to a Waystone."],
  },
  dados: {
    pedras: ["cl:pedra_caminho", ...VARIANTES.map(([v]) => `cl:pedra_caminho_${v}`)],
    cores: CORES.map(([c]) => c),
  },
};

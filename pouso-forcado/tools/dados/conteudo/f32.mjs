// Fase 32 (1.11.0): Mekanism Additions e os condutos do Ender IO.
// - Mekanism Additions (receitas do código público, mekanism/Mekanism 1.20): plástico nas 16 cores (bloco, liso, brilhante,
//   reforçado e estrada), Painéis Brilhantes, Balões, TNT de Obsidiana (100 ticks, raio 12) e os filhotes de monstros
//   (creeper, esqueleto, esqueleto errante e enderman; peso 0,5 do adulto, então 1 em 3).
//   A Folha HDPE do Mekanism é a Folha de Plástico que o pack já tem (MineFactory Reloaded).
// - Ender IO: Conduto de Energia (entra na rede de cabos) e Conduto de Itens (4 itens por segundo).
// Scripts em scripts/maquinas/mekanism_additions.ts e scripts/maquinas/condutos.ts.
export const CORES = [
  ["branco", "Branco", "White", "white", "#f9fffe"], ["laranja", "Laranja", "Orange", "orange", "#f9801d"],
  ["magenta", "Magenta", "Magenta", "magenta", "#c74ebd"], ["azul_claro", "Azul-Claro", "Light Blue", "light_blue", "#3ab3da"],
  ["amarelo", "Amarelo", "Yellow", "yellow", "#fed83d"], ["lima", "Lima", "Lime", "lime", "#80c71f"],
  ["rosa", "Rosa", "Pink", "pink", "#f38baa"], ["cinza", "Cinza", "Gray", "gray", "#474f52"],
  ["cinza_claro", "Cinza-Claro", "Light Gray", "light_gray", "#9d9d97"], ["ciano", "Ciano", "Cyan", "cyan", "#169c9c"],
  ["roxo", "Roxo", "Purple", "purple", "#8932b8"], ["azul", "Azul", "Blue", "blue", "#3c44aa"],
  ["marrom", "Marrom", "Brown", "brown", "#835432"], ["verde", "Verde", "Green", "green", "#5e7c16"],
  ["vermelho", "Vermelho", "Red", "red", "#b02e26"], ["preto", "Preto", "Black", "black", "#1d1d21"],
];
// [prefixo do id, nome pt, nome en, padrão, extra]
export const PLASTICOS = [
  ["plastico", "Plástico", "Plastic Block", "liso", {}],
  ["plastico_liso", "Plástico Liso", "Slick Plastic Block", "polido", { "minecraft:friction": 0.02 }],
  ["plastico_brilhante", "Plástico Brilhante", "Glow Plastic Block", "liso", {}, 15],
  ["plastico_reforcado", "Plástico Reforçado", "Reinforced Plastic Block", "rebitado", { "minecraft:destructible_by_explosion": { explosion_resistance: 60 } }],
  ["estrada_plastico", "Estrada de Plástico", "Plastic Road", "ladrilho", {}],
];
const tinta = (en) => `minecraft:${en}_dye`;
// Painel Brilhante: 2 px encostado na face onde foi posto (um osso e uma caixa para cada face).
const PAINEL = { chao: [[-8, 0, -8], [16, 2, 16]], teto: [[-8, 14, -8], [16, 2, 16]], norte: [[-8, 0, -8], [16, 16, 2]], sul: [[-8, 0, 6], [16, 16, 2]], oeste: [[-8, 0, -8], [2, 16, 16]], leste: [[6, 0, -8], [2, 16, 16]] };
// Face do bloco onde se tocou -> osso do painel (posto em cima de um bloco = no chão; embaixo = no teto; no lado norte
// de um bloco = encostado na face sul do espaço novo, e assim por diante).
const FACE_OSSO = { up: "chao", down: "teto", north: "sul", south: "norte", east: "oeste", west: "leste" };
const caixa = ([o, t]) => ({ "minecraft:collision_box": { origin: o, size: t }, "minecraft:selection_box": { origin: o, size: t } });
const CONDUTO = {
  centro: [[[-3, 5, -3], [6, 6, 6]]], norte: [[[-2, 6, -8], [4, 4, 5]]], sul: [[[-2, 6, 3], [4, 4, 5]]], leste: [[[3, 6, -2], [5, 4, 4]]],
  oeste: [[[-8, 6, -2], [5, 4, 4]]], cima: [[[-2, 11, -2], [4, 5, 4]]], baixo: [[[-2, 0, -2], [4, 5, 4]]],
};
const LIGACOES = { norte: "cl:n", sul: "cl:s", leste: "cl:l", oeste: "cl:o", cima: "cl:cima", baixo: "cl:baixo" };
const conduto = (id, pt, en, cor, extra = {}) => ({
  id, pt, en, tipo: "cubo", cor, padrao: "metal", dureza: 0.5, girar: false, mod: "Ender IO",
  estados: Object.fromEntries(Object.values(LIGACOES).map((e) => [e, [false, true]])),
  geometria: { ossos: CONDUTO, visivel: Object.fromEntries(Object.entries(LIGACOES).map(([o, e]) => [o, `q.block_state('${e}')`])) },
  extra: caixa([[-3, 5, -3], [6, 6, 6]]), ...extra,
});

export default {
  fase: 32,
  mod: "Mekanism Additions",
  itens: [
    ...CORES.map(([c, pt, en, , cor]) => ({ id: `balao_${c}`, pt: `Balão ${pt}`, en: `${en} Balloon`, icone: `bola:${cor}` })),
  ],
  blocos: [
    ...PLASTICOS.flatMap(([pre, pt, en, padrao, extra, luz]) =>
      CORES.map(([c, cpt, cen, , cor]) => ({
        id: `${pre}_${c}`, pt: `${pt} ${cpt}`, en: `${cen} ${en}`, tipo: "cubo", cor, padrao, dureza: pre === "plastico_reforcado" ? 10 : 2, girar: false,
        ...(luz ? { luzEmite: luz } : {}), extra,
      })),
    ),
    ...CORES.map(([c, pt, en, , cor]) => ({
      id: `painel_brilhante_${c}`, pt: `Painel Brilhante ${pt}`, en: `${en} Glow Panel`, tipo: "cubo", cor, padrao: "liso", dureza: 1, girar: false, luzEmite: 15, face: true,
      geometria: {
        ossos: Object.fromEntries(Object.entries(PAINEL).map(([o, cubo]) => [o, [cubo]])),
        visivel: Object.fromEntries(Object.entries(FACE_OSSO).map(([f, o]) => [o, `q.block_state('minecraft:block_face') == '${f}'`])),
      },
      extra: caixa(PAINEL.chao),
      permutacoes: Object.entries(FACE_OSSO).filter(([, o]) => o !== "chao").map(([f, o]) => ({ condition: `q.block_state('minecraft:block_face') == '${f}'`, components: caixa(PAINEL[o]) })),
    })),
    { id: "tnt_obsidiana", pt: "TNT de Obsidiana", en: "Obsidian TNT", tipo: "cubo", cor: "#3d2c5e", padrao: "tijolos", dureza: 0.5, girar: false, comp: "cl:tnt_obsidiana" },
    conduto("conduto_energia", "Conduto de Energia", "Energy Conduit", "#b8433f"),
    conduto("conduto_item", "Conduto de Itens", "Item Conduit", "#6fa8c9", {
      comp: "cl:conduto_item", tick: 20,
      estados: { ...Object.fromEntries(Object.values(LIGACOES).map((e) => [e, [false, true]])), "cl:extrai": [false, true] },
      materiais: { extrai: { cor: "#e0a030", padrao: "metal" } },
      geometria: {
        ossos: { ...CONDUTO, centro_extrai: [[[-3.1, 4.9, -3.1], [6.2, 6.2, 6.2], "extrai"]] },
        visivel: { ...Object.fromEntries(Object.entries(LIGACOES).map(([o, e]) => [o, `q.block_state('${e}')`])), centro_extrai: "q.block_state('cl:extrai')" },
      },
    }),
  ],
  receitas: [
    ...CORES.flatMap(([c, , , en]) => [
      { id: `plastico_${c}`, tipo: "shaped", padrao: [" # ", "#D#", " # "], chave: { "#": "cl:folha_plastico", D: tinta(en) }, resultado: `cl:plastico_${c}`, qtd: 4 },
      { id: `plastico_brilhante_${c}`, tipo: "shapeless", ingredientes: [`cl:plastico_${c}`, `cl:plastico_${c}`, `cl:plastico_${c}`, "minecraft:glowstone_dust"], resultado: `cl:plastico_brilhante_${c}`, qtd: 3 },
      { id: `plastico_liso_${c}`, tipo: "shaped", padrao: [" # ", "#S#", " # "], chave: { "#": `cl:plastico_${c}`, S: "minecraft:slime_ball" }, resultado: `cl:plastico_liso_${c}`, qtd: 4 },
      { id: `estrada_plastico_${c}`, tipo: "shaped", padrao: ["SSS", "###", "SSS"], chave: { "#": `cl:plastico_liso_${c}`, S: "minecraft:sand" }, resultado: `cl:estrada_plastico_${c}`, qtd: 3 },
      { id: `plastico_reforcado_${c}`, tipo: "shaped", padrao: [" # ", "#O#", " # "], chave: { "#": `cl:plastico_${c}`, O: "cl:po_osmio" }, resultado: `cl:plastico_reforcado_${c}`, qtd: 4 },
      { id: `painel_brilhante_${c}`, tipo: "shaped", padrao: ["PHP", "HDH", "GHG"], chave: { P: "minecraft:glass_pane", H: "cl:folha_plastico", D: tinta(en), G: "minecraft:glowstone_dust" }, resultado: `cl:painel_brilhante_${c}`, qtd: 2 },
      { id: `balao_${c}`, tipo: "shapeless", ingredientes: ["minecraft:leather", "minecraft:string", tinta(en)], resultado: `cl:balao_${c}`, qtd: 2 },
    ]),
    { id: "tnt_obsidiana", tipo: "shaped", padrao: ["OOO", "TTT", "OOO"], chave: { O: "minecraft:obsidian", T: "minecraft:tnt" }, resultado: "cl:tnt_obsidiana" },
    { id: "conduto_energia", tipo: "shaped", padrao: ["BBB", "III", "BBB"], chave: { B: "cl:aglutinante_conduite", I: "cl:ferro_condutor" }, resultado: "cl:conduto_energia", qtd: 8 },
    { id: "conduto_item", tipo: "shaped", padrao: ["BBB", "III", "BBB"], chave: { B: "cl:aglutinante_conduite", I: "cl:ferro_pulsante" }, resultado: "cl:conduto_item", qtd: 8 },
  ],
  textos: {
    "entity.cl:balao.name": ["Balão", "Balloon"],
    "entity.cl:tnt_obsidiana_acesa.name": ["TNT de Obsidiana", "Obsidian TNT"],
    "entity.cl:creeper_bebe.name": ["Creeper Bebê", "Baby Creeper"],
    "entity.cl:esqueleto_bebe.name": ["Esqueleto Bebê", "Baby Skeleton"],
    "entity.cl:esqueleto_errante_bebe.name": ["Esqueleto Errante Bebê", "Baby Stray"],
    "entity.cl:enderman_bebe.name": ["Enderman Bebê", "Baby Enderman"],
    "cl.ad.balao": ["Balão preso: cai devagar por 60 s (bata no balão para estourar).", "Balloon tied: slow falling for 60 s (hit the balloon to pop it)."],
    "cl.ad.balao_mob": ["O balão levanta o bicho por 10 s.", "The balloon lifts the mob for 10 s."],
    "cl.co.modo": ["Conduto de Itens: %s.", "Item Conduit: %s."],
    "cl.co.extrai": ["tira dos baús encostados (4 itens/s)", "extracts from touching chests (4 items/s)"],
    "cl.co.insere": ["põe nos baús encostados", "inserts into touching chests"],
    "cl.capitulo.additions.nome": ["Mekanism Additions", "Mekanism Additions"],
    "cl.capitulo.additions.curto": ["Additions", "Additions"],
    "cl.capitulo.additions.desc": ["Plástico colorido, painéis brilhantes, balões e TNT de obsidiana; e os condutos do Ender IO.", "Colored plastic, glow panels, balloons and obsidian TNT; and the Ender IO conduits."],
    "cl.missao.ad_plastico.titulo": ["Plástico", "Plastic"], "cl.missao.ad_plastico.desc": ["Faça 16 blocos de Plástico de qualquer cor.", "Make 16 Plastic Blocks of any color."],
    "cl.missao.ad_painel.titulo": ["Luz de painel", "Panel light"], "cl.missao.ad_painel.desc": ["Coloque um Painel Brilhante.", "Place a Glow Panel."],
    "cl.missao.ad_estrada.titulo": ["Estrada", "Road"], "cl.missao.ad_estrada.desc": ["Coloque 8 Estradas de Plástico (correm mais rápido em cima).", "Place 8 Plastic Roads (you run faster on them)."],
    "cl.missao.ad_balao.titulo": ["Balão", "Balloon"], "cl.missao.ad_balao.desc": ["Prenda um balão em você ou num bicho.", "Tie a balloon to yourself or to a mob."],
    "cl.missao.ad_tnt.titulo": ["Explosão de obsidiana", "Obsidian blast"], "cl.missao.ad_tnt.desc": ["Faça uma TNT de Obsidiana.", "Make an Obsidian TNT."],
    "cl.missao.ad_conduto.titulo": ["Condutos", "Conduits"], "cl.missao.ad_conduto.desc": ["Mova itens de um baú para outro com Condutos de Itens.", "Move items from one chest to another with Item Conduits."],
  },
};

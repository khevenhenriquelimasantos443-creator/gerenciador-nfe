// Fase 48 (1.29.0): Tinkers' Construct 3 completo, parte 4 — a Fundição inteira (SlimeKnights, MIT, inclusive a arte,
// copiada por tools/importar-tinkers3-fundicao.py). Os blocos refratários de construção (pedra, pedregulho, pavimento,
// tijolos rachados, finos, pequenos, triangulares, de creeper, ladrilho, estrada, lanterna, vidros de alma e fumê) e os
// chamuscados (tijolo chamuscado da argamassa do Nether), o Aquecedor + Fusor (fundição de um bloco), o Ligador, a
// Fundição Fantástica (chamuscada: não faz liga, dá subprodutos), Calhas (o baú encostado alimenta a fundição), Canal
// (a torneira enche várias mesas), mesa e bacia chamuscadas, tanque e dreno chamuscados e os moldes de areia (usam uma
// vez). Scripts em scripts/tinkers/fundicao.ts.
import { PECAS } from "./tinkers.mjs";

const TC = { mod: "Tinkers' Construct" };
const REF = "#555a63", CHA = "#4a3a30";
const cubo = (id, pt, en, cor, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao: "tijolos", dureza: 2.5, resistencia: 10, ...TC, ...extra });
const corte = (de, para, qtd = 1) => ({ id: `corte_${para}`, tipo: "shapeless", tags: ["stonecutter"], ingredientes: [`cl:${de}`], resultado: `cl:${para}`, qtd });
const REFRATARIOS = [
  ["pedra_refrataria_bloco", "Pedra Refratária", "Seared Stone"], ["pedregulho_refratario", "Pedregulho Refratário", "Seared Cobblestone"],
  ["pavimento_refratario", "Pavimento Refratário", "Seared Paver"], ["tijolos_refratarios_rachados", "Tijolos Refratários Rachados", "Cracked Seared Bricks"],
  ["tijolos_refratarios_finos", "Tijolos Refratários Finos", "Fancy Seared Bricks"], ["tijolos_refratarios_triangulo", "Tijolos Refratários Triangulares", "Triangle Seared Bricks"],
  ["tijolos_refratarios_pequenos", "Tijolos Refratários Pequenos", "Small Seared Bricks"], ["tijolos_refratarios_creeper", "Tijolos Refratários de Creeper", "Creeper Seared Bricks"],
  ["ladrilho_refratario", "Ladrilho Refratário", "Seared Tiles"], ["estrada_refrataria", "Estrada Refratária", "Seared Road"],
];
const CHAMUSCADOS = [
  ["pedra_chamuscada_bloco", "Pedra Chamuscada", "Scorched Stone"], ["estrada_chamuscada", "Estrada Chamuscada", "Scorched Road"],
  ["pedra_chamuscada_polida", "Pedra Chamuscada Polida", "Polished Scorched Stone"], ["pedra_chamuscada_entalhada", "Pedra Chamuscada Entalhada", "Chiseled Scorched Stone"],
];
const maq = (id, pt, en, cor, comp, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao: "rebitado", dureza: 2.5, resistencia: 10, comp, ...TC, ...extra });
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 48,
  mod: "Tinkers' Construct",
  itens: [
    { id: "argamassa_nether", pt: "Argamassa do Nether", en: "Nether Grout", icone: "bola:#6a4a3a", ...TC },
    { id: "molde_areia_lingote", pt: "Molde de Areia: Lingote", en: "Ingot Sand Cast", icone: "molde:lingote", pilha: 16, ...TC },
    ...Object.entries(PECAS).map(([p, d]) => ({ id: `molde_areia_${p}`, pt: `Molde de Areia: ${d.pt}`, en: `${d.en} Sand Cast`, icone: `molde:${p}`, pilha: 16, ...TC })),
  ],
  blocos: [
    ...REFRATARIOS.map(([id, pt, en]) => cubo(id, pt, en, REF)),
    cubo("lanterna_refrataria", "Lanterna Refratária", "Seared Lantern", "#c98a3a", { luzEmite: 15 }),
    { id: "vidro_alma_refratario", pt: "Vidro de Alma Refratário", en: "Seared Soul Glass", tipo: "vidro", cor: "#6a5a4a", dureza: 2, resistencia: 10, ...TC },
    { id: "vidro_fume_refratario", pt: "Vidro Fumê Refratário", en: "Seared Tinted Glass", tipo: "vidro", cor: "#3a3a44", dureza: 2, resistencia: 10, ...TC },
    cubo("tijolos_chamuscados", "Tijolos Chamuscados", "Scorched Bricks", CHA),
    ...CHAMUSCADOS.map(([id, pt, en]) => cubo(id, pt, en, CHA, id === "pedra_chamuscada_polida" || id === "pedra_chamuscada_bloco" ? { topo: "liso" } : {})),
    cubo("lanterna_chamuscada", "Lanterna Chamuscada", "Scorched Lantern", "#c98a3a", { luzEmite: 15 }),
    { id: "vidro_chamuscado", pt: "Vidro Chamuscado", en: "Scorched Glass", tipo: "vidro", cor: "#5a4a3a", dureza: 2, resistencia: 10, ...TC },
    maq("aquecedor", "Aquecedor Refratário", "Seared Heater", REF, "cl:aquecedor"),
    maq("fusor", "Fusor Refratário", "Seared Melter", REF, "cl:fusor", { tick: 20 }),
    maq("ligador", "Ligador Chamuscado", "Scorched Alloyer", CHA, "cl:ligador", { tick: 20 }),
    { id: "controlador_fundicao_fantastica", pt: "Controlador da Fundição Fantástica", en: "Foundry Controller", tipo: "maquina", luz: "laranja", glifo: "chama", comp: "cl:fundicao", tick: 20, dureza: 3, resistencia: 12, ...TC },
    cubo("dreno_chamuscado", "Dreno Chamuscado", "Scorched Drain", CHA, { padrao: "entalhado" }),
    cubo("calha_refrataria", "Calha Refratária", "Seared Chute", REF, { padrao: "entalhado" }),
    cubo("calha_chamuscada", "Calha Chamuscada", "Scorched Chute", CHA, { padrao: "entalhado" }),
    cubo("tanque_chamuscado", "Tanque Chamuscado", "Scorched Tank", CHA, { padrao: "rebitado", comp: "cl:tanque_refratario", estados: { "cl:nivel": { values: { min: 0, max: 4 } } } }),
    cubo("mesa_fundicao_chamuscada", "Mesa de Fundição Chamuscada", "Scorched Casting Table", CHA, { padrao: "pilar", topo: "ladrilho", comp: "cl:mesa_fundicao" }),
    cubo("bacia_fundicao_chamuscada", "Bacia de Fundição Chamuscada", "Scorched Casting Basin", CHA, { padrao: "pilar", topo: "entalhado", comp: "cl:bacia_fundicao" }),
    {
      id: "canal", pt: "Canal Refratário", en: "Seared Channel", tipo: "cubo", cor: REF, padrao: "tijolos", dureza: 2, ...TC,
      geometria: { ossos: { canal: [[[-8, 0, -8], [16, 2, 16]], [[-8, 2, -8], [16, 4, 2]], [[-8, 2, 6], [16, 4, 2]], [[-8, 2, -6], [2, 4, 12]], [[6, 2, -6], [2, 4, 12]]] } },
      extra: { "minecraft:collision_box": { origin: [-8, 0, -8], size: [16, 6, 16] }, "minecraft:selection_box": { origin: [-8, 0, -8], size: [16, 6, 16] } },
    },
  ],
  receitas: [
    { id: "argamassa_nether", tipo: "shapeless", ingredientes: ["minecraft:soul_sand", "minecraft:magma_cream", "minecraft:gravel"], resultado: "cl:argamassa_nether", qtd: 2 },
    { id: "tijolo_chamuscado", tipo: "furnace", entrada: "cl:argamassa_nether", resultado: "cl:tijolo_chamuscado" },
    { id: "tijolos_chamuscados", tipo: "shaped", padrao: ["TT", "TT"], chave: { T: "cl:tijolo_chamuscado" }, resultado: "cl:tijolos_chamuscados" },
    ...REFRATARIOS.map(([id]) => corte("tijolos_refratarios", id)),
    corte("tijolos_refratarios", "lanterna_refrataria"),
    ...CHAMUSCADOS.map(([id]) => corte("tijolos_chamuscados", id)),
    corte("tijolos_chamuscados", "lanterna_chamuscada"),
    { id: "vidro_alma_refratario", tipo: "shaped", padrao: [" T ", "TST", " T "], chave: { T: "cl:tijolo_refratario", S: "minecraft:soul_sand" }, resultado: "cl:vidro_alma_refratario" },
    { id: "vidro_fume_refratario", tipo: "shaped", padrao: [" T ", "TGT", " T "], chave: { T: "cl:tijolo_refratario", G: "minecraft:tinted_glass" }, resultado: "cl:vidro_fume_refratario" },
    { id: "vidro_chamuscado", tipo: "shaped", padrao: [" T ", "TGT", " T "], chave: { T: "cl:tijolo_chamuscado", G: "minecraft:glass" }, resultado: "cl:vidro_chamuscado" },
    { id: "aquecedor", tipo: "shaped", padrao: ["TTT", "TFT", "TTT"], chave: { T: "cl:tijolo_refratario", F: "minecraft:furnace" }, resultado: "cl:aquecedor" },
    { id: "fusor", tipo: "shaped", padrao: ["TGT", "T T", "TTT"], chave: { T: "cl:tijolo_refratario", G: "minecraft:glass" }, resultado: "cl:fusor" },
    { id: "ligador", tipo: "shaped", padrao: ["TGT", "TMT", "TTT"], chave: { T: "cl:tijolo_chamuscado", G: "minecraft:glass", M: "cl:fusor" }, resultado: "cl:ligador" },
    { id: "controlador_fundicao_fantastica", tipo: "shaped", padrao: ["TTT", "TOT", "TTT"], chave: { T: "cl:tijolo_chamuscado", O: "minecraft:obsidian" }, resultado: "cl:controlador_fundicao_fantastica" },
    { id: "dreno_chamuscado", tipo: "shaped", padrao: ["T T", "T T", "T T"], chave: { T: "cl:tijolo_chamuscado" }, resultado: "cl:dreno_chamuscado" },
    { id: "calha_refrataria", tipo: "shaped", padrao: ["T T", " T ", "T T"], chave: { T: "cl:tijolo_refratario" }, resultado: "cl:calha_refrataria" },
    { id: "calha_chamuscada", tipo: "shaped", padrao: ["T T", " T ", "T T"], chave: { T: "cl:tijolo_chamuscado" }, resultado: "cl:calha_chamuscada" },
    { id: "tanque_chamuscado", tipo: "shaped", padrao: ["TTT", "TGT", "TTT"], chave: { T: "cl:tijolo_chamuscado", G: "minecraft:glass" }, resultado: "cl:tanque_chamuscado" },
    { id: "mesa_fundicao_chamuscada", tipo: "shaped", padrao: ["TTT", "T T", "T T"], chave: { T: "cl:tijolo_chamuscado" }, resultado: "cl:mesa_fundicao_chamuscada" },
    { id: "bacia_fundicao_chamuscada", tipo: "shaped", padrao: ["T T", "T T", "TTT"], chave: { T: "cl:tijolo_chamuscado" }, resultado: "cl:bacia_fundicao_chamuscada" },
    { id: "canal", tipo: "shaped", padrao: ["T T", "TTT"], chave: { T: "cl:tijolo_refratario" }, resultado: "cl:canal", qtd: 3 },
  ],
  textos: {
    "cl.fun.aquecedor": ["Aquecedor: %s s de fogo. Toque com carvão, bloco de carvão, vara de blaze ou balde de lava.", "Heater: %s s of fire. Tap with coal, coal block, blaze rod or lava bucket."],
    "cl.fun.fusor": ["Fusor: %s na fila. Líquido: %s. Ponha itens no baú de cima ou toque com eles; Aquecedor embaixo; torneira do lado.", "Melter: %s queued. Fluid: %s. Put items in the chest above or tap with them; Heater below; faucet on the side."],
    "cl.fun.ligador": ["Ligador: %s. Puxa os líquidos dos Fusores encostados e faz as ligas; torneira do lado.", "Alloyer: %s. Pulls fluids from adjacent Melters and makes alloys; faucet on the side."],
    "cl.fun.nada": ["vazio", "empty"],
    "cl.capitulo.fundicao2.nome": ["Fundição do Tinkers 3", "Tinkers 3 Smeltery"], "cl.capitulo.fundicao2.curto": ["Fundição+", "Smeltery+"],
    "cl.capitulo.fundicao2.desc": ["Fusor e Aquecedor (fundição de um bloco), Ligador, Fundição Fantástica (sem liga, com subprodutos), calhas, canais, moldes de areia e os blocos refratários e chamuscados.", "Melter and Heater (one-block smeltery), Alloyer, Foundry (no alloys, with byproducts), chutes, channels, sand casts and the seared and scorched blocks."],
    ...missao("tc3_fusor", "Fusor", "Melter", "Monte um Aquecedor com um Fusor em cima e derreta algo.", "Build a Heater with a Melter on top and melt something."),
    ...missao("tc3_fantastica", "Fundição Fantástica", "Foundry", "Faça o Controlador da Fundição Fantástica (tijolos chamuscados da argamassa do Nether + obsidiana).", "Make the Foundry Controller (scorched bricks from nether grout + obsidian)."),
    ...missao("tc3_molde_areia", "Molde de areia", "Sand cast", "Ponha areia na Mesa de Fundição e toque com uma peça: sai um molde de areia (usa uma vez).", "Put sand on the Casting Table and tap with a part: you get a sand cast (single use)."),
  },
};

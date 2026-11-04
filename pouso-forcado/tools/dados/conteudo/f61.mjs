// Fase 61 (1.42.0): Thermal Expansion 11 (o mais novo, 1.20.x; CoFH; arte "todos os direitos reservados", então
// própria). Números do mod por tools/importar-thermal11.py (tools/dados/thermal11.json); script em
// scripts/maquinas/thermal11.ts. Combustível ou entrada no baú de cima, saída no de baixo, energia pela rede.
// - Dínamos (40 RF/t, basePower dos gerenciadores de combustível): Stirling (carvão 24.000 RF, bloco 240.000, coque
//   40.000, pó de blaze 12.000), Magmático (balde de lava 100.000), Lapidário (diamante 500.000, esmeralda e safira
//   125.000, lápis, quartzo, ametista e prismarinho 40.000), Gourmand (comida: fome × 1.600; bolo 25.600) e
//   Desencantamento (os encantamentos do item viram energia; frasco de experiência 32.000).
// - Insolador Fitogênico: sementes, mudas e flores multiplicam com água encostada (20.000 RF por colheita, mudas 3×).
// - Pirolisador: toras → carvão vegetal + 125 mB de creosoto; carvão → coque + 250 mB (2.000 RF).
// As máquinas do Thermal trabalham a 20 RF/t: a operação leva energia ÷ 20 ticks.
import { readFileSync } from "node:fs";

const TE = { mod: "Thermal Expansion" };
const D = JSON.parse(readFileSync(new URL("../thermal11.json", import.meta.url), "utf8"));
const maq = (id, pt, en, luz, glifo) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 20, ...TE });
const DINAMOS = [
  ["dinamo_stirling", "Dínamo Stirling", "Stirling Dynamo", "laranja", "chama", "minecraft:furnace"],
  ["dinamo_magmatico", "Dínamo Magmático", "Magmatic Dynamo", "vermelho", "gota", "minecraft:magma"],
  ["dinamo_lapidario", "Dínamo Lapidário", "Lapidary Dynamo", "ciano", "cristal", "minecraft:diamond"],
  ["dinamo_gourmand", "Dínamo Gourmand", "Gourmand Dynamo", "amarelo", "folha", "minecraft:smoker"],
  ["dinamo_desencantamento", "Dínamo de Desencantamento", "Disenchantment Dynamo", "violeta", "raio", "minecraft:book"],
];

export default {
  fase: 61,
  mod: "Thermal Expansion",
  itens: [],
  blocos: [
    ...DINAMOS.map(([id, pt, en, luz, glifo]) => maq(id, pt, en, luz, glifo)),
    maq("insolador", "Insolador Fitogênico", "Phytogenic Insolator", "verde", "folha"),
    maq("pirolisador", "Pirolisador", "Pyrolyzer", "vermelho", "chama"),
  ],
  receitas: [
    ...DINAMOS.map(([id, , , , , g]) => ({ id, tipo: "shaped", padrao: [" C ", "IGI", "IRI"], chave: { C: "cl:bobina_fio_cobre", I: "minecraft:iron_ingot", G: g, R: "minecraft:redstone" }, resultado: `cl:${id}` })),
    { id: "insolador", tipo: "shaped", padrao: ["GDG", "GFG", "CRC"], chave: { G: "minecraft:glass", D: "minecraft:dirt", F: "cl:estrutura_maquina", C: "minecraft:copper_ingot", R: "minecraft:redstone" }, resultado: "cl:insolador" },
    { id: "pirolisador", tipo: "shaped", padrao: [" B ", "NFN", "CRC"], chave: { B: "minecraft:blaze_powder", N: "minecraft:nether_brick", F: "cl:estrutura_maquina", C: "minecraft:copper_ingot", R: "minecraft:redstone" }, resultado: "cl:pirolisador" },
  ],
  textos: {
    "cl.th11.dinamo": ["Dínamo: %s RF guardados para queimar (40 RF/t)", "Dynamo: %s RF left to burn (40 RF/t)"],
    "cl.th11.progresso": ["%s%% (%s RF de %s)", "%s%% (%s of %s RF)"],
    "cl.th11.creosoto": ["Creosoto: %s mB (baldes vazios no baú de cima saem cheios)", "Creosote: %s mB (empty buckets in the chest above come out full)"],
    "cl.capitulo.thermal11.nome": ["Thermal 11", "Thermal 11"],
    "cl.capitulo.thermal11.curto": ["Thermal 11", "Thermal 11"],
    "cl.capitulo.thermal11.desc": ["Os dínamos do Thermal mais novo (Stirling, Magmático, Lapidário, Gourmand e Desencantamento), o Insolador Fitogênico e o Pirolisador.", "The dynamos of the latest Thermal (Stirling, Magmatic, Lapidary, Gourmand and Disenchantment), the Phytogenic Insolator and the Pyrolyzer."],
    "cl.missao.th11_dinamo.titulo": ["Dínamo", "Dynamo"], "cl.missao.th11_dinamo.desc": ["Gere energia com um dínamo do Thermal.", "Make power with a Thermal dynamo."],
    "cl.missao.th11_lapidario.titulo": ["Gemas viram energia", "Gems into power"], "cl.missao.th11_lapidario.desc": ["Queime uma gema no Dínamo Lapidário.", "Burn a gem in the Lapidary Dynamo."],
    "cl.missao.th11_insolador.titulo": ["Insolador", "Insolator"], "cl.missao.th11_insolador.desc": ["Colha no Insolador Fitogênico.", "Harvest in the Phytogenic Insolator."],
    "cl.missao.th11_pirolisador.titulo": ["Pirolisador", "Pyrolyzer"], "cl.missao.th11_pirolisador.desc": ["Faça coque no Pirolisador.", "Make coal coke in the Pyrolyzer."],
  },
  dados: D,
};

// Fase 64 (1.45.0): Chisel 1.18 (o mais novo, branch 1.18/dev; Chisel Team, GPLv2, inclusive a arte, por
// tools/importar-chisel18.py). Script em scripts/maquinas/decoracao.ts.
// - Cinzéis do mod: o de ferro passa a 512 usos; Cinzel de Diamante (5.056) e Cinzel Hi-Tech (10.048) com os modos do
//   mod: um bloco, painel 3×3, coluna 3×1 e linha 1×3; o Hi-Tech também cinzela os blocos iguais ligados (até 10 de
//   distância).
// - Cinzel Automático: os blocos do baú de cima viram a variante escolhida (toque com o bloco) no de baixo.
// - Variantes novas com a arte do Chisel: arenito e arenito vermelho (8 cada), templo, fábrica e laboratório (8 cada).
import { readFileSync } from "node:fs";

const CH = { mod: "Chisel" };
const D = JSON.parse(readFileSync(new URL("../chisel18.json", import.meta.url), "utf8"));
const BASE = { arenito: "minecraft:sandstone", arenito_vermelho: "minecraft:red_sandstone" };
const COR = { arenito: "#d8c38a", arenito_vermelho: "#b8642a", templo: "#3a8a8a", fabrica: "#7a6a5a", laboratorio: "#c8ccd0" };
const cinzel = (id, pt, en, usos, icone) => ({ id, pt, en, icone, pilha: 1, ...CH, comp: { "minecraft:durability": { max_durability: usos }, "minecraft:hand_equipped": true } });
const cerca = (id, centro, borda) => ({ id, tipo: "shaped", padrao: ["###", "#C#", "###"], chave: { "#": borda, C: centro }, resultado: `cl:${id}`, qtd: 8 });

export default {
  fase: 64,
  mod: "Chisel",
  itens: [cinzel("cinzel_diamante", "Cinzel de Diamante", "Diamond Chisel", 5056, "cinzel"), cinzel("cinzel_hitech", "Cinzel Hi-Tech", "iChisel", 10048, "cinzel")],
  blocos: [
    ...Object.entries(D.familias).flatMap(([f, lista]) => lista.map(([id, pt, en]) => ({ id, pt, en, tipo: "cubo", cor: COR[f], padrao: "tijolos", dureza: 1.5, girar: false, ...CH }))),
    { id: "cinzel_automatico", pt: "Cinzel Automático", en: "Auto Chisel", tipo: "maquina", luz: "branco", glifo: "engrenagem", comp: "cl:cinzel_automatico", tick: 20, ...CH },
  ],
  receitas: [
    { id: "cinzel_diamante", tipo: "shaped", padrao: [" D", "S "], chave: { D: "minecraft:diamond", S: "minecraft:stick" }, resultado: "cl:cinzel_diamante" },
    { id: "cinzel_hitech", tipo: "shapeless", ingredientes: ["cl:cinzel_diamante", "minecraft:redstone", "minecraft:gold_ingot"], resultado: "cl:cinzel_hitech" },
    { id: "cinzel_automatico", tipo: "shaped", padrao: ["GGG", "GCG", "III"], chave: { G: "minecraft:glass", C: "cl:cinzel", I: "minecraft:iron_ingot" }, resultado: "cl:cinzel_automatico" },
    // A bancada só faz a primeira variante de cada família nova; as outras saem do cinzel.
    cerca("templo_tijolos", "minecraft:cyan_dye", "minecraft:stone_bricks"),
    cerca("fabrica_chapeado", "minecraft:iron_ingot", "minecraft:stone"),
    cerca("laboratorio_ladrilho_grande", "minecraft:quartz", "minecraft:stone"),
  ],
  textos: {
    "cl.ch.modo": ["Modo do cinzel", "Chisel mode"],
    "cl.ch.modo.um": ["Um bloco", "Single block"], "cl.ch.modo.painel": ["Painel 3×3", "3×3 panel"], "cl.ch.modo.coluna": ["Coluna 3×1", "3×1 column"],
    "cl.ch.modo.linha": ["Linha 1×3", "1×3 row"], "cl.ch.modo.contiguo": ["Blocos iguais ligados (até 10)", "Connected alike blocks (up to 10)"],
    "cl.ch.modo_atual": ["Cinzel: %s", "Chisel: %s"],
    "cl.ch.auto_alvo": ["Cinzel Automático: os blocos do baú de cima viram %s.", "Auto Chisel: blocks from the chest above become %s."],
    "cl.ch.auto_sem": ["Toque com o bloco que você quer que saia (de uma família do cinzel).", "Tap with the block you want out (from a chisel family)."],
    "cl.missao.ch18_diamante.titulo": ["Cinzel de Diamante", "Diamond Chisel"], "cl.missao.ch18_diamante.desc": ["Faça um Cinzel de Diamante (painel 3×3).", "Craft a Diamond Chisel (3×3 panel)."],
    "cl.missao.ch18_auto.titulo": ["Cinzel Automático", "Auto Chisel"], "cl.missao.ch18_auto.desc": ["Deixe o Cinzel Automático trocar 16 blocos.", "Let the Auto Chisel convert 16 blocks."],
    "cl.missao.ch18_templo.titulo": ["Templo no deserto", "Desert temple"], "cl.missao.ch18_templo.desc": ["Construa com 16 blocos de templo.", "Build with 16 temple blocks."],
  },
  dados: {
    familias: Object.fromEntries(Object.entries(D.familias).map(([f, lista]) => [f, [...(BASE[f] ? [BASE[f]] : []), ...lista.map(([id]) => `cl:${id}`)]])),
  },
};

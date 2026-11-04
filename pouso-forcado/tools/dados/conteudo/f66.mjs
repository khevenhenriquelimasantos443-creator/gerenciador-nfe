// Fase 66 (1.49.0): Mekanism completo, parte 1: minério ×5 e a química (Mekanism 10.7.19, MIT; tools/importar-mekanism-completo.py
// lê o mod e grava mekanism_p1.json, com os modelos 3D e a arte originais). Scripts em scripts/maquinas/mekanism_quimica.ts.
// - Minério ×5: Câmara de Dissolução Química (minério + ácido sulfúrico = pasta suja), Lavador Químico (pasta suja + água =
//   pasta limpa), Cristalizador Químico (pasta limpa = cristal); o cristal vai à Câmara de Injeção (estilhaço) e segue o ×4.
// - Ácido sulfúrico: Oxidador Químico (pó de enxofre = dióxido de enxofre), Infusor Químico (dióxido + oxigênio = trióxido;
//   trióxido + vapor d'água = ácido) e Condensentrador Rotativo (água ⇄ vapor d'água). Enxofre: pólvora na Injeção ou
//   carvão na Câmara de Reação Pressurizada (que também faz substrato, eteno e PEAD, o plástico do Mekanism).
// - Tanques de Químico e de Fluido (4 níveis, as capacidades do mod; guardam o conteúdo quando quebrados), Tanque Dinâmico
//   (por enquanto só o bloco), Barril Pessoal (54 espaços, só o dono abre) e o minério de fluorita.
// O gás anda em cilindros de 1.000 mB, como no pack; a água e a salmoura em balde.
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("mekanism_p1.json", import.meta.url), "utf8"));
const MK = { mod: "Mekanism" };
const mat = (tex) => ({ texture: tex, render_method: "alpha_test" });
const modelo = (m) => ({
  "minecraft:geometry": m.geometria,
  "minecraft:material_instances": { "*": mat(Object.values(m.materiais)[0]), ...Object.fromEntries(Object.entries(m.materiais).map(([k, v]) => [k, mat(v)])) },
  "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0,
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });
const CORES_LUZ = { oxidador_quimico: "amarelo", camara_dissolucao: "verde", lavador_quimico: "azul", cristalizador_quimico: "ciano",
  condensentrador_rotativo: "azul", camara_reacao_pressurizada: "violeta", infusor_quimico: "verde" };

export default {
  fase: 66,
  mod: "Mekanism",
  itens: [
    ...D.itens.map((i) => ({ id: i.id, pt: i.pt, en: i.en, icone: "cristal:#9aa3ab", ...MK })),
    ...D.cilindros.map((c) => ({ id: c.id, pt: c.pt, en: c.en, icone: `garrafa:${c.cor}`, pilha: 16, ...MK })),
  ],
  blocos: [
    ...D.maquinas.map((m) => ({ id: m.id, pt: m.pt, en: m.en, tipo: "maquina", luz: CORES_LUZ[m.id], glifo: "gota", comp: "cl:mk_quimica", tick: 100, ...MK, extra: modelo(m.modelo) })),
    ...D.tanques.map((t) => ({ id: t.id, pt: t.pt, en: t.en, tipo: "cubo", cor: "#9aa3ab", dureza: 2, girar: false, comp: "cl:mk_tanque", tick: 20,
      loot: "loot_tables/empty.json", ...MK, extra: modelo(t.modelo) })),
    { id: "tanque_dinamico", pt: D.blocos[0].pt, en: D.blocos[0].en, tipo: "cubo", cor: "#7a8a96", dureza: 3.5, girar: false, ...MK },
    { id: "minerio_fluorita", pt: D.blocos[1].pt, en: D.blocos[1].en, tipo: "cubo", cor: "#8a8a8a", dureza: 3, girar: false, loot: "loot_tables/cl/mk/minerio_fluorita.json", ...MK },
    { id: "minerio_fluorita_profundo", pt: D.blocos[2].pt, en: D.blocos[2].en, tipo: "cubo", cor: "#4a4a50", dureza: 4.5, girar: false, loot: "loot_tables/cl/mk/minerio_fluorita.json", ...MK },
    { id: "bloco_fluorita", pt: D.blocos[3].pt, en: D.blocos[3].en, tipo: "cubo", cor: "#e8b8a0", dureza: 5, girar: false, ...MK },
    { id: "barril_pessoal", pt: D.blocos[4].pt, en: D.blocos[4].en, tipo: "cubo", cor: "#6a5040", dureza: 2.5, comp: "cl:bau_grande", ...MK },
  ],
  receitas: D.receitas,
  textos: {
    "cl.mkq.dica": ["Mekanism: itens e cilindros (ou baldes d'água) no baú de cima; o que sai vai para o de baixo. A máquina guarda os cilindros vazios e enche um quando junta 1.000 mB. As receitas estão no Catálogo.", "Mekanism: items and tanks (or water buckets) in the chest above; output goes to the chest below. The machine keeps the empty tanks and fills one when it has 1,000 mB. Recipes are in the Catalog."],
    "cl.mkq.tanque": ["%s: %s mB de %s", "%s: %s mB of %s"],
    "cl.mkq.vazio": ["vazio", "empty"],
    "cl.mkq.rotativo.gas": ["Condensentrador: líquido → gás (água em vapor). Toque agachado para inverter.", "Condensentrator: liquid → gas (water to vapor). Sneak-tap to reverse."],
    "cl.mkq.rotativo.liquido": ["Condensentrador: gás → líquido (vapor em água). Toque agachado para inverter.", "Condensentrator: gas → liquid (vapor to water). Sneak-tap to reverse."],
    "cl.mkq.pessoal": ["Esse barril é de outro jogador.", "This barrel belongs to another player."],
    "cl.mkq.tanque.dica": ["Tanque: cilindros (ou baldes) cheios no baú de cima esvaziam aqui; vazios no baú de cima saem cheios embaixo. Quebrado, leva o que tem dentro.", "Tank: full tanks (or buckets) in the chest above empty here; empty ones in the chest above come out full below. Broken, it keeps its contents."],
    "cl.mkq.q.water": ["Água", "Water"], "cl.mkq.q.lava": ["Lava", "Lava"], "cl.mkq.q.brine": ["Salmoura", "Brine"],
    "cl.mkq.q.oxygen": ["Oxigênio", "Oxygen"], "cl.mkq.q.hydrogen": ["Hidrogênio", "Hydrogen"], "cl.mkq.q.chlorine": ["Cloro", "Chlorine"],
    "cl.mkq.q.hydrogen_chloride": ["Cloreto de Hidrogênio", "Hydrogen Chloride"],
    ...Object.fromEntries(D.cilindros.map((c) => [`cl.mkq.q.${c.q}`, [c.pt.replace(/^Cilindro de /, ""), c.en.replace(/ Tank$/, "")]])),
    ...missao("mkq_oxidador", "Oxidador Químico", "Chemical Oxidizer", "Coloque um Oxidador Químico (pó de enxofre vira dióxido de enxofre).", "Place a Chemical Oxidizer (sulfur dust becomes sulfur dioxide)."),
    ...missao("mkq_acido", "Ácido Sulfúrico", "Sulfuric Acid", "Tenha um Cilindro de Ácido Sulfúrico (trióxido de enxofre + vapor d'água no Infusor Químico).", "Have a Sulfuric Acid Tank (sulfur trioxide + water vapor in the Chemical Infuser)."),
    ...missao("mkq_cristal", "Minério ×5", "Ore ×5", "Faça 5 Cristais de Ferro no Cristalizador Químico.", "Make 5 Iron Crystals in the Chemical Crystallizer."),
    ...missao("mkq_pead", "Plástico do Mekanism", "Mekanism Plastic", "Faça um Pellet de PEAD na Câmara de Reação Pressurizada.", "Make an HDPE Pellet in the Pressurized Reaction Chamber."),
  },
  dados: {
    processos: D.processos,
    ce: D.ce,
    cilindroDe: D.cilindroDe,
    tanques: Object.fromEntries(D.tanques.map((t) => [`cl:${t.id}`, [t.tipo, t.cap]])),
    baus: { barril_pessoal: 54 },
  },
};

// Fase 41 (1.21.0): Mekanism 10.7, a versão mais nova (aidancbrady e equipe, MIT; ramo release/1.21.x).
// O processamento de minério do Mekanism de hoje: Câmara de Enriquecimento (×2), Câmara de Purificação com oxigênio
// (×3, em aglomerados), Câmara de Injeção Química com cloreto de hidrogênio (×4, em estilhaços), Triturador (aglomerado
// → pó sujo) e de novo a Enriquecimento (pó sujo → pó). Também o Combinador, a Serraria de Precisão, a Fundição
// Energizada, o Compressor de Ósmio, o Infusor Metalúrgico com os tipos de infusão do mod e os circuitos Elite e
// Ultimate. Gás continua em cilindros (1 cilindro = 1.000 mB). Receitas, nomes e números: mekanism.json, lido do código
// do mod por tools/importar-mekanism.py, que também copia a arte original. Scripts em scripts/maquinas/mekanism10.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "mekanism.json"), "utf8"));
const MK = { mod: "Mekanism" };
const COR = { ferro: "#d8d8d8", ouro: "#f2d64b", cobre: "#e07b4a", estanho: "#c8d0d8", osmio: "#a8c8e0" };
function icone(id) {
  const cor = Object.entries(COR).find(([k]) => id.endsWith(k))?.[1] ?? "#9aa3ab";
  if (id.startsWith("torrao_")) return `pepita:${cor}`;
  if (id.startsWith("fragmento_")) return `cristal:${cor}`;
  if (id.startsWith("po_")) return `po:${cor}`;
  if (id.startsWith("circuito_")) return "chip:#3a8a3a";
  return `bola:${cor}`;
}
const LUZ = { camara_enriquecimento: "azul", compressor_osmio: "violeta", combinador: "vermelho", fundidor_energizado: "laranja", serraria_precisao: "amarelo" };
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 41,
  mod: "Mekanism",
  itens: D.itens.map((i) => ({ id: i.id, pt: i.pt, en: i.en, icone: icone(i.id), ...MK })),
  blocos: D.maquinas.map((m) => ({ id: m.id, pt: m.pt, en: m.en, tipo: "maquina", luz: LUZ[m.id] ?? "azul", glifo: "engrenagem", comp: `cl:mk10_${m.id}`, tick: 100, ...MK })),
  receitas: D.receitas,
  dados: {
    processos: D.processos,
    infusao: D.infusao,
    ce: D.ce,
  },
  textos: {
    "cl.mk10.dica": ["Mekanism: itens no baú de cima, o resultado vai para o de baixo. Gás e infusão vão no mesmo baú: cilindro de oxigênio ou sílex (Purificação), cilindro de ácido (Injeção), lingote de ósmio (Compressor), carvão, redstone, pó de diamante, de ouro, de estanho ou de obsidiana refinada (Infusor). As receitas estão no Catálogo.", "Mekanism: items in the chest above, the result goes to the chest below. Gas and infusion go in the same chest: oxygen tank or flint (Purification), acid tank (Injection), osmium ingot (Compressor), coal, redstone, diamond, gold, tin or refined obsidian dust (Infuser). Recipes are in the Catalog."],
    ...missao("mk10_enriquecer", "Enriquecer", "Enriching", "Coloque uma Câmara de Enriquecimento: ela dobra o minério.", "Place an Enrichment Chamber: it doubles ore."),
    ...missao("mk10_aglomerado", "Aglomerados", "Clumps", "Faça 6 Aglomerados de Ferro na Câmara de Purificação (minério ×3).", "Make 6 Iron Clumps in the Purification Chamber (ore ×3)."),
    ...missao("mk10_estilhaco", "Estilhaços", "Shards", "Faça 8 Estilhaços na Câmara de Injeção Química (minério ×4).", "Make 8 Shards in the Chemical Injection Chamber (ore ×4)."),
    ...missao("mk10_circuito", "Circuito Elite", "Elite Circuit", "Faça um Circuito de Controle Elite no Infusor Metalúrgico.", "Make an Elite Control Circuit in the Metallurgic Infuser."),
    ...missao("mk10_serraria", "Serraria de Precisão", "Precision Sawmill", "Coloque uma Serraria de Precisão (toras dão 6 tábuas e serragem).", "Place a Precision Sawmill (logs give 6 planks and sawdust)."),
  },
};

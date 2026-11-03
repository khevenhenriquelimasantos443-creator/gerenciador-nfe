// Fase 43 (1.23.0): Create 6.0.11, a versão mais nova (simibubi e equipe, código MIT; ramo mc1.21.1/dev). As receitas
// da Mó, das Rodas Trituradoras, da Prensa, do Misturador e do Ventilador (lavar e assombrar com fogo das almas) e as
// de bancada das peças, lidas do código do mod por tools/importar-create.py (create.json). A arte do Create é "todos os
// direitos reservados": fica a do pack. Itens novos: Pepita de Experiência (das Rodas Trituradoras; use para ganhar XP)
// e Farinha de Netherrack. Scripts em scripts/maquinas/create.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "create.json"), "utf8"));
const ICONE = { pepita_experiencia: "pepita:#c8f04a", farinha_cinzas: "po:#8a3a3a" };
export default {
  fase: 43,
  mod: "Create",
  itens: D.itens.map((i) => ({ id: i.id, pt: i.pt, en: i.en, icone: ICONE[i.id] ?? "po:#999999", mod: "Create" })),
  blocos: [],
  receitas: D.receitas,
  dados: { processos: D.processos },
  textos: {
    "cl.cr.assombrar": ["Ventilador: soprando por fogo das almas (ou fogueira das almas), assombra os itens.", "Fan: blowing through soul fire (or a soul campfire), haunts the items."],
  },
};

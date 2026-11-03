// Fase 42 (1.22.0): Applied Energistics 2 de hoje (ramo main, Minecraft 26.3; código LGPL-3.0, arte CC BY-NC-SA 3.0).
// A progressão do AE2 atual: as quatro Prensas Inscritoras vêm dos meteoritos (num baú no meio da cratera); o Inscritor
// copia as prensas (bloco de ferro), imprime os circuitos e monta os processadores Lógico, de Cálculo e de Engenharia;
// o Carregador carrega o Quartzo Certus; Fluix se faz jogando Certus Carregado, redstone e quartzo na água. E mais:
// Vidro de Quartzo, Pedra do Céu Lisa, Cabo ME Fluix, Fibra de Quartzo, Receptor Sem Fio, núcleos de Aniquilação e de
// Formação, Pérola de Fluix, Células de Energia e a célula de armazenamento 256k. Dados: ae2.json
// (tools/importar-ae2.py). Scripts em scripts/armazenamento/ae2.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "ae2.json"), "utf8"));
const AE = { mod: "Applied Energistics" };
const icone = (id) => (id.startsWith("prensa_") ? "placa:#9aa3ab" : id.includes("impresso") ? "chip:#c8c8c8" : id.startsWith("processador") ? "chip:#3a7bd5"
  : id.startsWith("cristal") ? "cristal:#bfe6ff" : id.startsWith("componente") ? "chip:#c0392b" : id.startsWith("celula") ? "celula:#c0392b" : "bola:#b26bff");
const UM = new Set(["celula_me_256k", "prensa_silicio", "prensa_logica", "prensa_calculo", "prensa_engenharia"]);
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 42,
  mod: "Applied Energistics",
  itens: D.itens.map((i) => ({ id: i.id, pt: i.pt.replace("Inscitora", "Inscritora"), en: i.en, icone: icone(i.id), ...(UM.has(i.id) ? { pilha: i.id.startsWith("celula") ? 1 : 64 } : {}), ...AE })),
  blocos: [
    ...D.blocos.map((b) => {
      const vidro = b.id === "vidro_quartzo";
      const energia = b.id.startsWith("celula_energia_ae");
      return { id: b.id, pt: b.pt, en: b.en, tipo: vidro ? "vidro" : energia ? "maquina" : "cubo", cor: vidro ? "#e0f0ff" : "#3a3f4a", padrao: "liso", dureza: 2, girar: false,
        ...(energia ? { luz: "violeta", glifo: "raio", comp: "cl:celula_energia", loot: "loot_tables/cl/vazio.json" } : {}), ...(b.id === "bloco_fluix" ? { luzEmite: 4 } : {}), ...AE };
    }),
    ...D.maquinas.map((m) => ({ id: m.id, pt: m.pt, en: m.en, tipo: "maquina", luz: "violeta", glifo: "engrenagem", comp: `cl:ae2_${m.id}`, tick: 100, ...AE })),
  ],
  receitas: D.receitas,
  dados: {
    inscritor: D.inscritor,
    carregar: D.carregar,
    agua: D.agua,
    // Células de energia do AE2: 200.000 e 1.600.000 AE (1 AE = 2 RF; 1 E = 4.000 RF).
    celulas: { "cl:celula_energia_ae": 100, "cl:celula_energia_ae_densa": 800 },
    prensas: ["cl:prensa_silicio", "cl:prensa_logica", "cl:prensa_calculo", "cl:prensa_engenharia"],
  },
  textos: {
    "cl.ae2.inscritor": ["Inscritor: a prensa (ou o circuito de cima), o item do meio e o de baixo no baú de cima. Prensa + bloco de ferro = cópia da prensa; prensa + item = circuito impresso; circuito + redstone + silício impresso = processador.", "Inscriber: the press (or top circuit), the middle and the bottom item in the chest above. Press + iron block = press copy; press + item = printed circuit; circuit + redstone + printed silicon = processor."],
    "cl.ae2.carregador": ["Carregador: Quartzo Certus no baú de cima vira Certus Carregado (gasta energia da rede).", "Charger: Certus Quartz in the chest above becomes Charged Certus (uses network energy)."],
    "cl.ae2.fluix": ["Fluix!", "Fluix!"],
    "cl.ae2.prensa_meteoro": ["Há um baú no meio da cratera do meteoro.", "There's a chest in the middle of the meteor crater."],
    ...missao("ae2_prensa", "Prensas do céu", "Presses from the sky", "Coloque um Inscritor. As Prensas Inscritoras vêm do baú no meio dos meteoros.", "Place an Inscriber. Inscriber Presses come from the chest at the middle of meteors."),
    ...missao("ae2_logico", "Processador Lógico", "Logic Processor", "Faça um Processador Lógico no Inscritor.", "Make a Logic Processor in the Inscriber."),
    ...missao("ae2_fluix", "Fluix na água", "Fluix in water", "Jogue Certus Carregado, redstone e quartzo juntos na água.", "Throw Charged Certus, redstone and quartz together in water."),
    ...missao("ae2_256k", "256k", "256k", "Faça uma Célula de Armazenamento 256k.", "Make a 256k Storage Cell."),
  },
};

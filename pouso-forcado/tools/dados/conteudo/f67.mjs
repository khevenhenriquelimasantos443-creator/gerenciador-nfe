// Fase 67 (1.50.0): Mekanism completo, parte 2: fábricas, melhorias e instaladores de nível (Mekanism 10.7.19, MIT;
// tools/importar-mekanism-completo.py grava mekanism_p2.json com os modelos 3D, a arte e as receitas do mod).
// Scripts em scripts/maquinas/mekanism_upgrades.ts (melhorias, níveis) e mekanism10.ts (as fábricas rodam a operação
// da máquina 3, 5, 7 ou 9 vezes por ciclo).
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("mekanism_p2.json", import.meta.url), "utf8"));
const MK = { mod: "Mekanism" };
const mat = (tex) => ({ texture: tex, render_method: "alpha_test" });
const modelo = (m) => ({
  "minecraft:geometry": m.geometria,
  "minecraft:material_instances": { "*": mat(Object.values(m.materiais)[0]), ...Object.fromEntries(Object.entries(m.materiais).map(([k, v]) => [k, mat(v)])) },
  "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0,
});
// Nomes iguais em todas (o pt_br do mod mistura "Ultimate", "Serração" e minúsculas).
const TIPO = { fundicao: "Fundição", enriquecimento: "Enriquecimento", trituracao: "Trituração", compressao: "Compressão", combinacao: "Combinação",
  purificacao: "Purificação", injecao: "Injeção", infusao: "Infusão", serragem: "Serragem" };
const NIVEL = ["Básica", "Avançada", "Elite", "Definitiva"];
const nomeFabrica = (f) => `Fábrica de ${TIPO[f.id.split("_")[1]]} ${NIVEL[f.nivel]}`;
const PT = { melhoria_quimica: "Melhoria Química", melhoria_silenciador: "Melhoria de Silenciador", melhoria_gerador_pedra: "Melhoria de Gerador de Pedra",
  instalador_nivel_definitivo: "Instalador de Nível Definitivo" };
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 67,
  mod: "Mekanism",
  itens: D.itens.map((i) => ({ id: i.id, pt: PT[i.id] ?? i.pt, en: i.en, icone: "chip:#3a8a3a", pilha: i.id.startsWith("melhoria_") ? 8 : 64, ...MK })),
  blocos: D.fabricas.map((f) => ({ id: f.id, pt: nomeFabrica(f), en: f.en, tipo: "maquina", luz: "azul", glifo: "engrenagem", comp: "cl:mk_fabrica", tick: 100, ...MK, extra: modelo(f.modelo) })),
  receitas: D.receitas,
  textos: {
    "cl.mku.instalou": ["%s instalada (%s).", "%s installed (%s)."],
    "cl.mku.cheia": ["Já tem o máximo de %s.", "Already has the most %s."],
    "cl.mku.nao_aceita": ["Essa máquina não aceita essa melhoria.", "This machine does not accept this upgrade."],
    "cl.mku.ancora_cheia": ["Não deu: o mundo já tem 10 áreas carregadas.", "Could not: the world already has 10 loaded areas."],
    "cl.mku.nivel_errado": ["Instalador de outro nível: máquina → Básico, Básica → Avançado, Avançada → Elite, Elite → Definitivo.", "Wrong tier installer: machine → Basic, Basic → Advanced, Advanced → Elite, Elite → Ultimate."],
    "cl.mku.subiu": ["Agora é %s (nada se perdeu).", "Now it is %s (nothing lost)."],
    "cl.mku.fabrica": ["Fábrica: %s operações por ciclo, com as receitas da máquina de origem. Baú de cima = entrada, baú de baixo = saída.", "Factory: %s operations per cycle, with the base machine's recipes. Chest above = input, chest below = output."],
    ...missao("mk_melhoria", "Melhorias", "Upgrades", "Instale uma melhoria numa máquina do Mekanism (Velocidade: 8 deixam 10× mais rápida; Energia: gasta menos).", "Install an upgrade on a Mekanism machine (Speed: 8 make it 10× faster; Energy: uses less)."),
    ...missao("mk_fabrica", "Fábricas", "Factories", "Transforme uma máquina numa Fábrica Básica com o Instalador de Nível (3 operações de uma vez).", "Turn a machine into a Basic Factory with the Tier Installer (3 operations at once)."),
  },
  dados: {
    fabricas: Object.fromEntries(D.fabricas.map((f) => [`cl:${f.id}`, [`cl:${f.base}`, f.processos, f.nivel]])),
  },
};

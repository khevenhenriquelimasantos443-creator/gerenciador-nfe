// Fase 65 (1.46.0): Ex Nihilo: Sequentia (o mais novo, 1.21; NovaMachina, CC BY-NC-SA 4.0, inclusive a arte, por
// tools/importar-ens.py). As malhas da peneira e a tabela do mod por malha (tools/dados/ens.json); script em
// scripts/blocos/peneira.ts.
// - Toque na peneira com uma malha para colocá-la (agachado de mão vazia tira). Com malha, a peneira usa a tabela do
//   Sequentia: cada achado sai com a chance da melhor malha até a que está na peneira (ex.: diamante e esmeralda no
//   cascalho só com malha de ferro, 0,8%, ou de diamante, 1,6%). Sem malha, a tabela de antes (a do Crash Landing).
// - Peneiras em grupo (como no mod): tocar uma peneira também peneira as carregadas até 2 blocos dela.
import { readFileSync } from "node:fs";

const EX = { mod: "Ex Nihilo" };
const D = JSON.parse(readFileSync(new URL("../ens.json", import.meta.url), "utf8"));
const MALHAS = [
  ["barbante", "Barbante", "String", "#e8e8e0"], ["silex", "Sílex", "Flint", "#5a5a5a"], ["ferro", "Ferro", "Iron", "#c8c8c8"],
  ["diamante", "Diamante", "Diamond", "#4ae0d8"], ["esmeralda", "Esmeralda", "Emerald", "#40c060"], ["netherita", "Netherita", "Netherite", "#4a3a3a"],
];
const MATERIAL = { silex: "minecraft:flint", ferro: "minecraft:iron_ingot", diamante: "minecraft:diamond", esmeralda: "minecraft:emerald" };

export default {
  fase: 65,
  mod: "Ex Nihilo",
  itens: MALHAS.map(([id, pt, en, cor]) => ({ id: `malha_${id}`, pt: `Malha de ${pt}`, en: `${en} Mesh`, icone: `placa:${cor}`, pilha: 1, ...EX })),
  blocos: [],
  receitas: [
    { id: "malha_barbante", tipo: "shaped", padrao: ["SSS", "SSS", "SSS"], chave: { S: "minecraft:string" }, resultado: "cl:malha_barbante" },
    ...MALHAS.slice(1, 5).map(([id], k) => ({ id: `malha_${id}`, tipo: "shaped", padrao: ["I I", "IMI", "I I"], chave: { I: MATERIAL[id], M: `cl:malha_${MALHAS[k][0]}` }, resultado: `cl:malha_${id}` })),
    // No mod é na mesa de ferraria; o Bedrock só faz isso com armadura e ferramenta, então é na bancada (gasta o molde).
    { id: "malha_netherita", tipo: "shapeless", ingredientes: ["cl:malha_esmeralda", "minecraft:netherite_ingot", "minecraft:netherite_upgrade_smithing_template"], resultado: "cl:malha_netherita" },
  ],
  textos: {
    "cl.peneira.malha": ["Peneira com %s.", "Sieve with %s."],
    "cl.peneira.sem_malha": ["Peneira sem malha (tabela antiga). Toque com uma malha para trocar.", "Sieve without a mesh (old table). Tap with a mesh to change."],
    "cl.missao.ens_malha.titulo": ["Malha de Ferro", "Iron Mesh"], "cl.missao.ens_malha.desc": ["Ponha uma Malha de Ferro numa peneira.", "Put an Iron Mesh in a sieve."],
    "cl.missao.ens_diamante.titulo": ["Diamante da peneira", "Sieved diamond"], "cl.missao.ens_diamante.desc": ["Ache um diamante peneirando cascalho com malha.", "Find a diamond sifting gravel with a mesh."],
  },
  dados: D,
};

import { IDS } from "../config.js";
import { Pilha } from "../util/inventario.js";

/*
 * Missões do Diário de Bordo, em ordem. Cada jogador faz uma de cada vez.
 * Textos: cl.missao.<id>.titulo e cl.missao.<id>.desc em RP/texts/*.lang.
 * Novas fases acrescentam missões no fim da lista (nunca mudar a ordem das antigas:
 * o progresso salvo é o índice da missão atual).
 */

export type Objetivo =
  | { tipo: "colocar"; bloco: string; qtd: number } // colocar blocos
  | { tipo: "quebrar"; bloco: string; qtd: number } // quebrar blocos
  | { tipo: "ter"; item: string; qtd: number } // ter no inventário (não consome)
  | { tipo: "matar"; familia: string; qtd: number } // matar mobs dessa família
  | { tipo: "noites"; qtd: number } // sobreviver a tantas noites desde o início da missão
  | { tipo: "acao"; acao: Acao; qtd: number }; // usar uma máquina (contado pelo script da máquina)

export type Acao = "peneirar" | "compostar";

export type Missao = { id: string; objetivo: Objetivo; recompensa: ReadonlyArray<Pilha> };

export const MISSOES: ReadonlyArray<Missao> = [
  // Fase 2: os primeiros dias
  { id: "condensador", objetivo: { tipo: "colocar", bloco: IDS.condensadorAgua, qtd: 1 }, recompensa: [{ item: "minecraft:dirt", quantidade: 2 }] },
  { id: "agua", objetivo: { tipo: "ter", item: "minecraft:water_bucket", qtd: 1 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 3 }] },
  {
    id: "muda",
    objetivo: { tipo: "colocar", bloco: "minecraft:oak_sapling", qtd: 1 },
    recompensa: [{ item: "minecraft:oak_sapling", quantidade: 1 }, { item: "minecraft:bone_meal", quantidade: 2 }],
  },
  { id: "lenha", objetivo: { tipo: "quebrar", bloco: "minecraft:oak_log", qtd: 4 }, recompensa: [{ item: "minecraft:wheat_seeds", quantidade: 4 }] },
  { id: "bancada", objetivo: { tipo: "colocar", bloco: "minecraft:crafting_table", qtd: 1 }, recompensa: [{ item: "minecraft:dirt", quantidade: 2 }] },
  { id: "picareta", objetivo: { tipo: "ter", item: "minecraft:stone_pickaxe", qtd: 1 }, recompensa: [{ item: "minecraft:torch", quantidade: 4 }] },
  { id: "forno", objetivo: { tipo: "colocar", bloco: "minecraft:furnace", qtd: 1 }, recompensa: [{ item: "minecraft:coal", quantidade: 4 }] },
  { id: "ferro", objetivo: { tipo: "ter", item: "minecraft:iron_ingot", qtd: 3 }, recompensa: [{ item: "minecraft:bucket", quantidade: 1 }] },
  { id: "noite", objetivo: { tipo: "noites", qtd: 1 }, recompensa: [{ item: "minecraft:bread", quantidade: 4 }] },
  { id: "cacador", objetivo: { tipo: "matar", familia: "monster", qtd: 5 }, recompensa: [{ item: "minecraft:sugar_cane", quantidade: 2 }] },
  {
    id: "trigo",
    objetivo: { tipo: "ter", item: "minecraft:wheat", qtd: 3 },
    recompensa: [{ item: "minecraft:dirt", quantidade: 2 }, { item: "minecraft:bone_meal", quantidade: 4 }],
  },
  { id: "papel", objetivo: { tipo: "ter", item: "minecraft:paper", qtd: 3 }, recompensa: [{ item: "minecraft:pumpkin_seeds", quantidade: 2 }] },

  // Fase 3: máquinas
  { id: "peneira", objetivo: { tipo: "colocar", bloco: IDS.peneira, qtd: 1 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 4 }] },
  { id: "garimpo", objetivo: { tipo: "acao", acao: "peneirar", qtd: 20 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }] },
  { id: "argila", objetivo: { tipo: "ter", item: "minecraft:clay_ball", qtd: 8 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 6 }] },
  { id: "compostor", objetivo: { tipo: "colocar", bloco: IDS.compostor, qtd: 1 }, recompensa: [{ item: "minecraft:rotten_flesh", quantidade: 8 }] },
  { id: "adubo", objetivo: { tipo: "acao", acao: "compostar", qtd: 3 }, recompensa: [{ item: "minecraft:oak_sapling", quantidade: 2 }] },
  {
    id: "condensador_avancado",
    objetivo: { tipo: "colocar", bloco: IDS.condensadorAvancado, qtd: 1 },
    recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }],
  },
  {
    id: "estufa",
    objetivo: { tipo: "colocar", bloco: IDS.estufa, qtd: 1 },
    recompensa: [{ item: "minecraft:carrot", quantidade: 2 }, { item: "minecraft:potato", quantidade: 2 }],
  },
  { id: "fazenda", objetivo: { tipo: "ter", item: "minecraft:wheat", qtd: 32 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 4 }] },
];

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
  | { tipo: "noites"; qtd: number }; // sobreviver a tantas noites desde o início da missão

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
];

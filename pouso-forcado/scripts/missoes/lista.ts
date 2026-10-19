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

export type Acao =
  | "peneirar"
  | "compostar"
  | "capsula"
  | "procriar"
  | "turbo"
  | "cidade"
  | "spawner"
  | "masmorra"
  | "masmorra_funda"
  | "destrocos"
  | "tempestade"
  | "reparo_casco"
  | "reparo_computador"
  | "reparo_combustivel"
  | "reparo_motor";

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

  // Fase 4: comida e vida
  { id: "capsula", objetivo: { tipo: "acao", acao: "capsula", qtd: 1 }, recompensa: [{ item: "minecraft:glass_bottle", quantidade: 4 }] },
  { id: "garrafa", objetivo: { tipo: "ter", item: IDS.aguaBoa, qtd: 3 }, recompensa: [{ item: "minecraft:bread", quantidade: 4 }] },
  { id: "fruta", objetivo: { tipo: "ter", item: IDS.frutaCacto, qtd: 3 }, recompensa: [{ item: "minecraft:melon_seeds", quantidade: 2 }] },
  { id: "rebanho", objetivo: { tipo: "acao", acao: "procriar", qtd: 1 }, recompensa: [{ item: "minecraft:lead", quantidade: 2 }] },
  { id: "couro", objetivo: { tipo: "ter", item: "minecraft:leather", qtd: 3 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }] },
  { id: "despensa", objetivo: { tipo: "ter", item: "minecraft:bread", qtd: 10 }, recompensa: [{ item: "minecraft:sweet_berries", quantidade: 4 }] },
  { id: "criador", objetivo: { tipo: "acao", acao: "procriar", qtd: 5 }, recompensa: [{ item: "minecraft:name_tag", quantidade: 1 }] },
  { id: "sinais", objetivo: { tipo: "acao", acao: "capsula", qtd: 3 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },

  // Fase 5: energia
  { id: "painel", objetivo: { tipo: "colocar", bloco: IDS.painelSolar, qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 4 }] },
  { id: "bateria", objetivo: { tipo: "colocar", bloco: IDS.bateria, qtd: 1 }, recompensa: [{ item: "minecraft:copper_ingot", quantidade: 4 }] },
  { id: "cabos", objetivo: { tipo: "colocar", bloco: IDS.cabo, qtd: 8 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }] },
  { id: "gerador", objetivo: { tipo: "colocar", bloco: IDS.gerador, qtd: 1 }, recompensa: [{ item: "minecraft:coal", quantidade: 8 }] },
  { id: "moinho", objetivo: { tipo: "colocar", bloco: IDS.moinho, qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 6 }] },
  {
    id: "peneira_automatica",
    objetivo: { tipo: "colocar", bloco: IDS.peneiraAutomatica, qtd: 1 },
    recompensa: [{ item: "minecraft:iron_ingot", quantidade: 4 }],
  },
  { id: "automacao", objetivo: { tipo: "acao", acao: "peneirar", qtd: 64 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
  { id: "turbo", objetivo: { tipo: "acao", acao: "turbo", qtd: 10 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },

  // Fase 6: exploração e perigos
  { id: "cidade", objetivo: { tipo: "acao", acao: "cidade", qtd: 1 }, recompensa: [{ item: "minecraft:torch", quantidade: 16 }] },
  { id: "spawner", objetivo: { tipo: "acao", acao: "spawner", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 4 }] },
  { id: "masmorra", objetivo: { tipo: "acao", acao: "masmorra", qtd: 1 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
  { id: "destrocos", objetivo: { tipo: "acao", acao: "destrocos", qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 4 }] },
  { id: "tempestade", objetivo: { tipo: "acao", acao: "tempestade", qtd: 1 }, recompensa: [{ item: IDS.aguaBoa, quantidade: 4 }] },
  { id: "exterminador", objetivo: { tipo: "acao", acao: "spawner", qtd: 5 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },
  {
    id: "profundezas",
    objetivo: { tipo: "acao", acao: "masmorra_funda", qtd: 1 },
    recompensa: [{ item: "minecraft:golden_apple", quantidade: 1 }],
  },

  // Fase 7: perigos do deserto
  { id: "mumias", objetivo: { tipo: "matar", familia: "mumia", qtd: 5 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
  { id: "escorpioes", objetivo: { tipo: "matar", familia: "escorpiao", qtd: 5 }, recompensa: [{ item: IDS.aguaBoa, quantidade: 3 }] },
  { id: "golem", objetivo: { tipo: "matar", familia: "golem_areia", qtd: 1 }, recompensa: [{ item: "minecraft:glass", quantidade: 8 }] },
  { id: "faixas", objetivo: { tipo: "ter", item: IDS.faixaMumia, qtd: 4 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
  { id: "idolo", objetivo: { tipo: "colocar", bloco: IDS.idolo, qtd: 1 }, recompensa: [{ item: "minecraft:golden_apple", quantidade: 2 }] },
  { id: "farao", objetivo: { tipo: "matar", familia: "farao", qtd: 1 }, recompensa: [{ item: "minecraft:diamond", quantidade: 3 }] },

  // Fase 8: consertar a nave
  { id: "montadora", objetivo: { tipo: "colocar", bloco: IDS.montadora, qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 8 }] },
  { id: "terminal", objetivo: { tipo: "colocar", bloco: IDS.terminal, qtd: 1 }, recompensa: [{ item: "minecraft:chest", quantidade: 4 }] },
  { id: "placas", objetivo: { tipo: "ter", item: IDS.placaCasco, qtd: 4 }, recompensa: [{ item: "minecraft:copper_ingot", quantidade: 6 }] },
  { id: "casco", objetivo: { tipo: "acao", acao: "reparo_casco", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 8 }] },
  { id: "circuitos", objetivo: { tipo: "ter", item: IDS.circuito, qtd: 4 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 3 }] },
  { id: "computador", objetivo: { tipo: "acao", acao: "reparo_computador", qtd: 1 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },
  { id: "combustivel", objetivo: { tipo: "acao", acao: "reparo_combustivel", qtd: 1 }, recompensa: [{ item: IDS.aguaExcelente, quantidade: 4 }] },
  { id: "motor", objetivo: { tipo: "acao", acao: "reparo_motor", qtd: 1 }, recompensa: [{ item: "minecraft:golden_apple", quantidade: 2 }] },
];

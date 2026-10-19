import { IDS } from "../config.js";
import { Pilha } from "../util/inventario.js";

/*
 * Missões do Diário de Bordo, em capítulos (como os "conjuntos" do Hardcore Questing Mode).
 * Textos: cl.missao.<id>.titulo/.desc e cl.capitulo.<id>.nome/.desc em RP/texts/*.lang.
 * - Cada missão exige as de "requer"; sem "requer", exige a anterior do mesmo capítulo, e a
 *   primeira do capítulo exige as "requer" do capítulo. Várias missões ficam abertas ao mesmo tempo.
 * - "recompensa" é entregue ao concluir; "escolha" é uma lista da qual o jogador escolhe UM item.
 * - O progresso é salvo pelo id da missão: nunca mude um id (ver progresso.ts).
 */

export type Objetivo =
  | { tipo: "colocar"; bloco: string; qtd: number } // colocar blocos
  | { tipo: "quebrar"; bloco: string; qtd: number } // quebrar blocos
  | { tipo: "ter"; item: string; qtd: number } // ter no inventário (não consome)
  | { tipo: "entregar"; item: string; qtd: number } // botão "Entregar" no Diário: os itens são tirados
  | { tipo: "consumir"; item: string; qtd: number } // comer ou beber
  | { tipo: "matar"; familia: string; qtd: number } // matar mobs dessa família
  | { tipo: "noites"; qtd: number } // sobreviver a tantas noites desde que a missão abriu
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
  | "reparo_motor"
  | "organizar"
  | "sacola"
  | "martelar"
  | "barril_terra"
  | "barril_argila"
  | "barril_obsidiana"
  | "cadinho_lava"
  | "camel_encher"
  | "bem_alimentado"
  | "colher";

type MissaoBase = {
  id: string;
  objetivo: Objetivo;
  recompensa: ReadonlyArray<Pilha>;
  escolha?: ReadonlyArray<Pilha>;
  requer?: ReadonlyArray<string>;
};
export type Missao = MissaoBase & { cap: string; requer: ReadonlyArray<string> };
export type Capitulo = { id: string; icone: string; requer: ReadonlyArray<string>; missoes: ReadonlyArray<MissaoBase> };

export const CAPITULOS: ReadonlyArray<Capitulo> = [
  {
    id: "chegada", // Fase 2: os primeiros dias
    icone: IDS.diarioBordo,
    requer: [],
    missoes: [
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
      {
        id: "papel",
        objetivo: { tipo: "ter", item: "minecraft:paper", qtd: 3 },
        recompensa: [{ item: "minecraft:pumpkin_seeds", quantidade: 2 }],
        escolha: [{ item: "minecraft:bread", quantidade: 4 }, { item: IDS.aguaBoa, quantidade: 2 }, { item: IDS.sacolaComum, quantidade: 1 }],
      },
    ],
  },
  {
    id: "maquinas", // Fase 3: máquinas
    icone: IDS.peneira,
    requer: ["bancada"],
    missoes: [
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
      {
        id: "fazenda",
        objetivo: { tipo: "ter", item: "minecraft:wheat", qtd: 32 },
        recompensa: [{ item: "minecraft:iron_ingot", quantidade: 4 }],
        escolha: [{ item: IDS.sacolaBoa, quantidade: 1 }, { item: "minecraft:copper_ingot", quantidade: 8 }, { item: "minecraft:bone_meal", quantidade: 16 }],
      },
    ],
  },
  {
    id: "nihilo", // Fase 12: Ex Nihilo + Ex Aliquo
    icone: "cl:martelo_madeira",
    requer: ["bancada"],
    missoes: [
      { id: "en_martelo", objetivo: { tipo: "acao", acao: "martelar", qtd: 16 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 4 }] },
      { id: "en_poeira", requer: ["en_martelo"], objetivo: { tipo: "ter", item: IDS.poeira, qtd: 8 }, recompensa: [{ item: "minecraft:string", quantidade: 4 }] },
      { id: "en_pedrinhas", requer: ["en_martelo"], objetivo: { tipo: "ter", item: IDS.pedrinha, qtd: 8 }, recompensa: [{ item: "minecraft:dirt", quantidade: 4 }] },
      { id: "en_minerio", requer: ["en_poeira"], objetivo: { tipo: "ter", item: "minecraft:raw_iron", qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      { id: "en_barril", requer: ["en_martelo"], objetivo: { tipo: "colocar", bloco: IDS.barrilMadeira, qtd: 1 }, recompensa: [{ item: "minecraft:oak_sapling", quantidade: 2 }] },
      { id: "en_composto", requer: ["en_barril"], objetivo: { tipo: "acao", acao: "barril_terra", qtd: 1 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 6 }] },
      { id: "en_argila", requer: ["en_barril", "en_poeira"], objetivo: { tipo: "acao", acao: "barril_argila", qtd: 1 }, recompensa: [{ item: "minecraft:clay_ball", quantidade: 4 }] },
      { id: "en_cadinho", requer: ["en_argila"], objetivo: { tipo: "colocar", bloco: IDS.cadinho, qtd: 1 }, recompensa: [{ item: "minecraft:torch", quantidade: 8 }] },
      {
        id: "en_lava",
        requer: ["en_cadinho"],
        objetivo: { tipo: "acao", acao: "cadinho_lava", qtd: 1 },
        recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }],
        escolha: [{ item: "minecraft:iron_ingot", quantidade: 4 }, { item: "minecraft:smooth_stone_slab", quantidade: 6 }],
      },
      { id: "en_obsidiana", requer: ["en_lava"], objetivo: { tipo: "acao", acao: "barril_obsidiana", qtd: 1 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },
      { id: "en_cajado", requer: ["en_barril"], objetivo: { tipo: "ter", item: IDS.cajado, qtd: 1 }, recompensa: [{ item: "minecraft:oak_sapling", quantidade: 2 }] },
      { id: "en_bicho", requer: ["en_cajado"], objetivo: { tipo: "ter", item: IDS.bichoSeda, qtd: 1 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 8 }] },
      { id: "en_linha", requer: ["en_bicho"], objetivo: { tipo: "entregar", item: "minecraft:string", qtd: 16 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
    ],
  },
  {
    id: "enviromine", // Fase 13: EnviroMine + Hunger Overhaul
    icone: IDS.camelPack,
    requer: ["agua"],
    missoes: [
      { id: "em_camel", objetivo: { tipo: "ter", item: IDS.camelPack, qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      { id: "em_encher", objetivo: { tipo: "acao", acao: "camel_encher", qtd: 1 }, recompensa: [{ item: IDS.aguaBoa, quantidade: 2 }] },
      { id: "ho_comer", requer: ["agua"], objetivo: { tipo: "acao", acao: "bem_alimentado", qtd: 5 }, recompensa: [{ item: "minecraft:bread", quantidade: 3 }] },
      { id: "em_filtros", requer: ["ferro"], objetivo: { tipo: "ter", item: IDS.filtro, qtd: 4 }, recompensa: [{ item: "minecraft:charcoal", quantidade: 4 }] },
      {
        id: "em_mascara",
        objetivo: { tipo: "ter", item: IDS.mascara, qtd: 1 },
        recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }],
        escolha: [{ item: IDS.filtro, quantidade: 4 }, { item: IDS.aguaExcelente, quantidade: 2 }],
      },
    ],
  },
  {
    id: "harvestcraft", // Fase 14: Pam's HarvestCraft
    icone: "cl:milho",
    requer: ["peneira"],
    missoes: [
      { id: "hc_colher", objetivo: { tipo: "acao", acao: "colher", qtd: 1 }, recompensa: [{ item: "minecraft:bone_meal", quantidade: 4 }] },
      { id: "hc_colheita", requer: ["hc_colher"], objetivo: { tipo: "acao", acao: "colher", qtd: 10 }, recompensa: [{ item: "cl:semente_tomate", quantidade: 2 }, { item: "cl:semente_cebola", quantidade: 2 }] },
      { id: "hc_panela", objetivo: { tipo: "colocar", bloco: "cl:panela", qtd: 1 }, recompensa: [{ item: "minecraft:brick", quantidade: 4 }] },
      { id: "hc_sal", requer: ["hc_panela"], objetivo: { tipo: "ter", item: "cl:sal", qtd: 4 }, recompensa: [{ item: IDS.aguaBoa, quantidade: 2 }] },
      { id: "hc_caldo", requer: ["hc_panela"], objetivo: { tipo: "ter", item: "cl:caldo", qtd: 1 }, recompensa: [{ item: "minecraft:bone", quantidade: 4 }] },
      { id: "hc_pilao", requer: ["hc_colher"], objetivo: { tipo: "ter", item: "cl:fuba", qtd: 2 }, recompensa: [{ item: "cl:semente_milho", quantidade: 2 }] },
      { id: "hc_tortilha", requer: ["hc_pilao"], objetivo: { tipo: "ter", item: "cl:tortilha", qtd: 2 }, recompensa: [{ item: "cl:semente_feijao", quantidade: 2 }] },
      { id: "hc_suco", objetivo: { tipo: "consumir", item: "cl:suco_cacto", qtd: 1 }, recompensa: [{ item: "cl:semente_fruta_cacto", quantidade: 2 }] },
      { id: "hc_sopa", requer: ["hc_caldo"], objetivo: { tipo: "consumir", item: "cl:sopa_tomate", qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      {
        id: "hc_burrito",
        requer: ["hc_tortilha", "hc_sal"],
        objetivo: { tipo: "consumir", item: "cl:burrito", qtd: 1 },
        recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }],
        escolha: [{ item: "cl:semente_arroz", quantidade: 3 }, { item: "cl:semente_pimenta", quantidade: 3 }, { item: "cl:semente_amendoim", quantidade: 3 }],
      },
    ],
  },
  {
    id: "comida", // Fase 4: comida e vida
    icone: IDS.frutaCacto,
    requer: ["noite"],
    missoes: [
      { id: "capsula", objetivo: { tipo: "acao", acao: "capsula", qtd: 1 }, recompensa: [{ item: "minecraft:glass_bottle", quantidade: 4 }] },
      { id: "garrafa", objetivo: { tipo: "ter", item: IDS.aguaBoa, qtd: 3 }, recompensa: [{ item: "minecraft:bread", quantidade: 4 }] },
      { id: "fruta", objetivo: { tipo: "ter", item: IDS.frutaCacto, qtd: 3 }, recompensa: [{ item: "minecraft:melon_seeds", quantidade: 2 }] },
      { id: "rebanho", objetivo: { tipo: "acao", acao: "procriar", qtd: 1 }, recompensa: [{ item: "minecraft:lead", quantidade: 2 }] },
      { id: "couro", objetivo: { tipo: "ter", item: "minecraft:leather", qtd: 3 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }] },
      { id: "despensa", objetivo: { tipo: "ter", item: "minecraft:bread", qtd: 10 }, recompensa: [{ item: "minecraft:sweet_berries", quantidade: 4 }] },
      { id: "criador", objetivo: { tipo: "acao", acao: "procriar", qtd: 5 }, recompensa: [{ item: "minecraft:name_tag", quantidade: 1 }] },
      {
        id: "sinais",
        objetivo: { tipo: "acao", acao: "capsula", qtd: 3 },
        recompensa: [{ item: "minecraft:diamond", quantidade: 1 }],
        escolha: [{ item: IDS.sacolaBoa, quantidade: 1 }, { item: IDS.aguaExcelente, quantidade: 2 }],
      },
      { id: "hidratado", objetivo: { tipo: "consumir", item: IDS.aguaBoa, qtd: 5 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
    ],
  },
  {
    id: "energia", // Fase 5: energia
    icone: IDS.bateria,
    requer: ["ferro"],
    missoes: [
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
      {
        id: "turbo",
        objetivo: { tipo: "acao", acao: "turbo", qtd: 10 },
        recompensa: [{ item: "minecraft:diamond", quantidade: 1 }],
        escolha: [{ item: IDS.sacolaOtima, quantidade: 1 }, { item: "minecraft:redstone", quantidade: 16 }],
      },
    ],
  },
  {
    id: "exploracao", // Fase 6: exploração e perigos
    icone: IDS.geradorMonstros,
    requer: ["noite"],
    missoes: [
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
        escolha: [{ item: IDS.sacolaOtima, quantidade: 1 }, { item: "minecraft:gold_ingot", quantidade: 6 }],
      },
    ],
  },
  {
    id: "deserto", // Fase 7: perigos do deserto
    icone: IDS.coracaoFarao,
    requer: ["cacador"],
    missoes: [
      { id: "mumias", objetivo: { tipo: "matar", familia: "mumia", qtd: 5 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
      { id: "escorpioes", objetivo: { tipo: "matar", familia: "escorpiao", qtd: 5 }, recompensa: [{ item: IDS.aguaBoa, quantidade: 3 }] },
      { id: "golem", objetivo: { tipo: "matar", familia: "golem_areia", qtd: 1 }, recompensa: [{ item: "minecraft:glass", quantidade: 8 }] },
      { id: "faixas", objetivo: { tipo: "ter", item: IDS.faixaMumia, qtd: 4 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
      { id: "idolo", objetivo: { tipo: "colocar", bloco: IDS.idolo, qtd: 1 }, recompensa: [{ item: "minecraft:golden_apple", quantidade: 2 }] },
      {
        id: "farao",
        objetivo: { tipo: "matar", familia: "farao", qtd: 1 },
        recompensa: [{ item: "minecraft:diamond", quantidade: 3 }],
        escolha: [{ item: IDS.sacolaEpica, quantidade: 1 }, { item: "minecraft:iron_block", quantidade: 4 }],
      },
    ],
  },
  {
    id: "nave", // Fase 8: consertar a nave
    icone: IDS.motorNave,
    requer: ["painel"],
    missoes: [
      { id: "montadora", objetivo: { tipo: "colocar", bloco: IDS.montadora, qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 8 }] },
      { id: "terminal", objetivo: { tipo: "colocar", bloco: IDS.terminal, qtd: 1 }, recompensa: [{ item: "minecraft:chest", quantidade: 4 }] },
      { id: "placas", objetivo: { tipo: "ter", item: IDS.placaCasco, qtd: 4 }, recompensa: [{ item: "minecraft:copper_ingot", quantidade: 6 }] },
      { id: "casco", objetivo: { tipo: "acao", acao: "reparo_casco", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 8 }] },
      { id: "circuitos", objetivo: { tipo: "ter", item: IDS.circuito, qtd: 4 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 3 }] },
      { id: "computador", objetivo: { tipo: "acao", acao: "reparo_computador", qtd: 1 }, recompensa: [{ item: "minecraft:diamond", quantidade: 1 }] },
      { id: "combustivel", objetivo: { tipo: "acao", acao: "reparo_combustivel", qtd: 1 }, recompensa: [{ item: IDS.aguaExcelente, quantidade: 4 }] },
      {
        id: "motor",
        objetivo: { tipo: "acao", acao: "reparo_motor", qtd: 1 },
        recompensa: [{ item: "minecraft:golden_apple", quantidade: 2 }],
        escolha: [{ item: IDS.sacolaLendaria, quantidade: 1 }, { item: "minecraft:diamond", quantidade: 8 }],
      },
    ],
  },
  {
    id: "equipamento", // Fase 11: Diário 2.0, Catálogo e organizador
    icone: IDS.catalogo,
    requer: [],
    missoes: [
      { id: "catalogo", objetivo: { tipo: "ter", item: IDS.catalogo, qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      { id: "organizar", objetivo: { tipo: "acao", acao: "organizar", qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      {
        id: "sacolas",
        objetivo: { tipo: "acao", acao: "sacola", qtd: 3 },
        recompensa: [],
        escolha: [{ item: "minecraft:iron_ingot", quantidade: 4 }, { item: "minecraft:copper_ingot", quantidade: 8 }, { item: IDS.aguaBoa, quantidade: 3 }],
      },
      { id: "sucata", objetivo: { tipo: "entregar", item: "minecraft:iron_nugget", qtd: 18 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
    ],
  },
];

export const MISSOES: ReadonlyArray<Missao> = CAPITULOS.flatMap((c) =>
  c.missoes.map((m, k) => ({ ...m, cap: c.id, requer: m.requer ?? (k === 0 ? c.requer : [c.missoes[k - 1].id]) })),
);
export const MISSAO_POR_ID: ReadonlyMap<string, Missao> = new Map(MISSOES.map((m) => [m.id, m]));

// Ordem da lista única das versões até a 0.16 (o progresso era o índice nela): só para migrar.
export const ORDEM_V1: ReadonlyArray<string> = [
  "condensador", "agua", "muda", "lenha", "bancada", "picareta", "forno", "ferro", "noite", "cacador", "trigo", "papel",
  "peneira", "garimpo", "argila", "compostor", "adubo", "condensador_avancado", "estufa", "fazenda", "capsula", "garrafa",
  "fruta", "rebanho", "couro", "despensa", "criador", "sinais", "painel", "bateria", "cabos", "gerador", "moinho",
  "peneira_automatica", "automacao", "turbo", "cidade", "spawner", "masmorra", "destrocos", "tempestade", "exterminador",
  "profundezas", "mumias", "escorpioes", "golem", "faixas", "idolo", "farao", "montadora", "terminal", "placas", "casco",
  "circuitos", "computador", "combustivel", "motor",
];

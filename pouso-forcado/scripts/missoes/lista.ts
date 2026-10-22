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
  | "colher"
  | "padrao"
  | "peca"
  | "montar_ferramenta"
  | "consertar"
  | "ferramenta_nivel"
  | "modificar"
  | "derreter"
  | "fundicao"
  | "molde"
  | "bronze"
  | "te_operacao"
  | "pulverizar"
  | "dinamo"
  | "barril_mil"
  | "barril_upgrade"
  | "carrinho"
  | "empacotar"
  | "celula_me"
  | "sem_fio"
  | "mf_plantar"
  | "mf_colher"
  | "mf_triturar"
  | "mf_fertilizante"
  | "alcance"
  | "pressao2"
  | "camara"
  | "ferro_comprimido"
  | "diamante_carvao"
  | "eletronica"
  | "corpo_criado"
  | "trocar_corpo"
  | "reviver_corpo"
  | "reator"
  | "reator_10e"
  | "blutonio"
  | "cinzelar"
  | "estante"
  | "cabide"
  | "carregador"
  | "decolar";

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
    id: "tinkers", // Fase 15: Tinkers' Construct + Iguana Tweaks
    icone: "cl:picareta_silex",
    requer: ["peneira"],
    missoes: [
      { id: "tc_padrao", objetivo: { tipo: "acao", acao: "padrao", qtd: 1 }, recompensa: [{ item: "minecraft:flint", quantidade: 4 }] },
      { id: "tc_peca", requer: ["tc_padrao"], objetivo: { tipo: "acao", acao: "peca", qtd: 3 }, recompensa: [{ item: "minecraft:bone", quantidade: 4 }] },
      { id: "tc_picareta", requer: ["tc_peca"], objetivo: { tipo: "ter", item: "cl:picareta_silex", qtd: 1 }, recompensa: [{ item: IDS.sacolaComum, quantidade: 1 }] },
      { id: "tc_montar", requer: ["tc_picareta"], objetivo: { tipo: "acao", acao: "montar_ferramenta", qtd: 3 }, recompensa: [{ item: "minecraft:flint", quantidade: 8 }] },
      { id: "tc_nivel", requer: ["tc_picareta"], objetivo: { tipo: "acao", acao: "ferramenta_nivel", qtd: 1 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "tc_consertar", requer: ["tc_picareta"], objetivo: { tipo: "acao", acao: "consertar", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 2 }] },
      {
        id: "tc_obsidiana",
        requer: ["tc_nivel"],
        objetivo: { tipo: "ter", item: "cl:picareta_obsidiana", qtd: 1 },
        recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }],
        escolha: [{ item: "minecraft:diamond", quantidade: 1 }, { item: "minecraft:obsidian", quantidade: 6 }],
      },
    ],
  },
  {
    id: "fundicao", // Fase 16: fundição do Tinkers' Construct
    icone: "cl:controlador_fundicao",
    requer: ["tinkers"],
    missoes: [
      { id: "fu_tijolos", objetivo: { tipo: "ter", item: "cl:tijolo_refratario", qtd: 32 }, recompensa: [{ item: "minecraft:lava_bucket", quantidade: 1 }] },
      { id: "fu_controlador", requer: ["fu_tijolos"], objetivo: { tipo: "acao", acao: "fundicao", qtd: 1 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "fu_derreter", requer: ["fu_controlador"], objetivo: { tipo: "acao", acao: "derreter", qtd: 16 }, recompensa: [{ item: "minecraft:raw_copper", quantidade: 4 }] },
      { id: "fu_molde", requer: ["fu_controlador"], objetivo: { tipo: "acao", acao: "molde", qtd: 1 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 2 }] },
      { id: "fu_bronze", requer: ["fu_derreter"], objetivo: { tipo: "acao", acao: "bronze", qtd: 1 }, recompensa: [{ item: "minecraft:gold_ingot", quantidade: 4 }] },
      {
        id: "fu_picareta",
        requer: ["fu_bronze", "fu_molde"],
        objetivo: { tipo: "ter", item: "cl:picareta_bronze", qtd: 1 },
        recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }],
        escolha: [{ item: "minecraft:diamond", quantidade: 1 }, { item: "minecraft:emerald", quantidade: 2 }],
      },
      { id: "fu_modificar", requer: ["fu_controlador"], objetivo: { tipo: "acao", acao: "modificar", qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 16 }] },
    ],
  },
  {
    id: "thermal", // Fase 17: Thermal Expansion
    icone: "cl:pulverizador",
    requer: ["fundicao"],
    missoes: [
      { id: "te_estrutura", objetivo: { tipo: "ter", item: "cl:estrutura_maquina", qtd: 1 }, recompensa: [{ item: "minecraft:redstone", quantidade: 8 }] },
      { id: "te_celula", requer: ["te_estrutura"], objetivo: { tipo: "colocar", bloco: "cl:celula_energia_basica", qtd: 1 }, recompensa: [{ item: "minecraft:copper_ingot", quantidade: 8 }] },
      { id: "te_pulverizar", requer: ["te_estrutura"], objetivo: { tipo: "acao", acao: "pulverizar", qtd: 8 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "te_dinamo", requer: ["te_estrutura"], objetivo: { tipo: "acao", acao: "dinamo", qtd: 1 }, recompensa: [{ item: "minecraft:redstone_block", quantidade: 2 }] },
      { id: "te_maquinas", requer: ["te_pulverizar"], objetivo: { tipo: "acao", acao: "te_operacao", qtd: 64 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      {
        id: "te_ressonante",
        requer: ["te_celula", "te_maquinas"],
        objetivo: { tipo: "ter", item: "cl:celula_energia_ressonante", qtd: 1 },
        recompensa: [{ item: IDS.sacolaEpica, quantidade: 1 }],
        escolha: [{ item: "minecraft:diamond", quantidade: 3 }, { item: "minecraft:emerald", quantidade: 4 }],
      },
    ],
  },
  {
    id: "armazenamento", // Fase 18: JABBA, AutoPackager, Applied Energistics
    icone: "cl:barril_armazenamento",
    requer: ["thermal"],
    missoes: [
      { id: "ar_barril", objetivo: { tipo: "acao", acao: "barril_mil", qtd: 1 }, recompensa: [{ item: "cl:upgrade_armazenamento", quantidade: 1 }] },
      { id: "ar_upgrade", requer: ["ar_barril"], objetivo: { tipo: "acao", acao: "barril_upgrade", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 8 }] },
      { id: "ar_carrinho", requer: ["ar_barril"], objetivo: { tipo: "acao", acao: "carrinho", qtd: 1 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "ar_empacotar", requer: ["ar_barril"], objetivo: { tipo: "acao", acao: "empacotar", qtd: 64 }, recompensa: [{ item: "minecraft:redstone", quantidade: 16 }] },
      { id: "ar_certus", objetivo: { tipo: "ter", item: "cl:cristal_certus", qtd: 4 }, recompensa: [{ item: "minecraft:lapis_lazuli", quantidade: 8 }] },
      { id: "ar_celula", requer: ["ar_certus"], objetivo: { tipo: "acao", acao: "celula_me", qtd: 1 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      {
        id: "ar_sem_fio",
        requer: ["ar_celula"],
        objetivo: { tipo: "acao", acao: "sem_fio", qtd: 1 },
        recompensa: [{ item: IDS.sacolaEpica, quantidade: 1 }],
        escolha: [{ item: "cl:celula_me_4k", quantidade: 1 }, { item: "minecraft:diamond", quantidade: 3 }],
      },
    ],
  },
  {
    id: "mfr", // Fase 19: MineFactory Reloaded
    icone: "cl:colheitadeira",
    requer: ["thermal"],
    missoes: [
      { id: "mf_resina", objetivo: { tipo: "ter", item: "cl:resina", qtd: 8 }, recompensa: [{ item: "minecraft:coal", quantidade: 8 }] },
      { id: "mf_plastico", requer: ["mf_resina"], objetivo: { tipo: "ter", item: "cl:folha_plastico", qtd: 8 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "mf_plantar", requer: ["mf_plastico"], objetivo: { tipo: "acao", acao: "mf_plantar", qtd: 32 }, recompensa: [{ item: "cl:fertilizante", quantidade: 8 }] },
      { id: "mf_colher", requer: ["mf_plastico"], objetivo: { tipo: "acao", acao: "mf_colher", qtd: 64 }, recompensa: [{ item: "cl:semente_arroz", quantidade: 4 }] },
      { id: "mf_triturar", requer: ["mf_plastico"], objetivo: { tipo: "acao", acao: "mf_triturar", qtd: 10 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      { id: "mf_fertilizante", requer: ["mf_plastico"], objetivo: { tipo: "acao", acao: "mf_fertilizante", qtd: 8 }, recompensa: [{ item: "minecraft:bone_block", quantidade: 4 }] },
      { id: "mf_alcance", requer: ["mf_plantar"], objetivo: { tipo: "acao", acao: "alcance", qtd: 1 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
    ],
  },
  {
    id: "pneumatic", // Fase 20: PneumaticCraft
    icone: "cl:compressor_ar",
    requer: ["thermal"],
    missoes: [
      { id: "pn_compressor", objetivo: { tipo: "acao", acao: "pressao2", qtd: 1 }, recompensa: [{ item: "minecraft:coal_block", quantidade: 2 }] },
      { id: "pn_camara", requer: ["pn_compressor"], objetivo: { tipo: "acao", acao: "camara", qtd: 1 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "pn_ferro", requer: ["pn_camara"], objetivo: { tipo: "acao", acao: "ferro_comprimido", qtd: 8 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 8 }] },
      { id: "pn_eletronica", requer: ["pn_ferro"], objetivo: { tipo: "acao", acao: "eletronica", qtd: 2 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      {
        id: "pn_diamante",
        requer: ["pn_camara"],
        objetivo: { tipo: "acao", acao: "diamante_carvao", qtd: 1 },
        recompensa: [{ item: IDS.sacolaEpica, quantidade: 1 }],
        escolha: [{ item: "minecraft:coal_block", quantidade: 8 }, { item: "cl:tubo_pressao_avancado", quantidade: 8 }],
      },
    ],
  },
  {
    id: "sync", // Fase 21: Sync
    icone: "cl:armazem_corpos",
    requer: ["pneumatic"],
    missoes: [
      { id: "sy_nucleo", objetivo: { tipo: "ter", item: "cl:nucleo_sync", qtd: 1 }, recompensa: [{ item: "minecraft:golden_apple", quantidade: 1 }] },
      { id: "sy_corpo", requer: ["sy_nucleo"], objetivo: { tipo: "acao", acao: "corpo_criado", qtd: 1 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      { id: "sy_trocar", requer: ["sy_corpo"], objetivo: { tipo: "acao", acao: "trocar_corpo", qtd: 1 }, recompensa: [{ item: "minecraft:ender_pearl", quantidade: 2 }] },
      { id: "sy_reviver", requer: ["sy_corpo"], objetivo: { tipo: "acao", acao: "reviver_corpo", qtd: 1 }, recompensa: [{ item: IDS.sacolaEpica, quantidade: 1 }] },
    ],
  },
  {
    id: "reator", // Fase 22: Big Reactors
    icone: "cl:controlador_reator",
    requer: ["thermal"],
    missoes: [
      { id: "br_yellorium", objetivo: { tipo: "ter", item: "cl:lingote_yellorium", qtd: 16 }, recompensa: [{ item: "cl:barra_grafite", quantidade: 8 }] },
      { id: "br_controlador", objetivo: { tipo: "ter", item: "cl:controlador_reator", qtd: 1 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "br_reator", requer: ["br_yellorium", "br_controlador"], objetivo: { tipo: "acao", acao: "reator", qtd: 1 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
      { id: "br_energia", requer: ["br_reator"], objetivo: { tipo: "acao", acao: "reator_10e", qtd: 100 }, recompensa: [{ item: "cl:celula_energia_redstone", quantidade: 1 }] },
      {
        id: "br_blutonio",
        requer: ["br_reator"],
        objetivo: { tipo: "acao", acao: "blutonio", qtd: 1 },
        recompensa: [{ item: IDS.sacolaLendaria, quantidade: 1 }],
        escolha: [{ item: "cl:bloco_grafite", quantidade: 8 }, { item: "cl:lingote_yellorium", quantidade: 8 }],
      },
    ],
  },
  {
    id: "decoracao", // Fase 23: Chisel, BiblioCraft e ChickenChunks
    icone: "cl:cinzel",
    requer: ["tinkers"],
    missoes: [
      { id: "dc_cinzel", objetivo: { tipo: "acao", acao: "cinzelar", qtd: 32 }, recompensa: [{ item: "cl:marmore_liso", quantidade: 16 }] },
      { id: "dc_marmore", objetivo: { tipo: "ter", item: "cl:marmore", qtd: 32 }, recompensa: [{ item: IDS.sacolaBoa, quantidade: 1 }] },
      { id: "dc_estante", objetivo: { tipo: "acao", acao: "estante", qtd: 1 }, recompensa: [{ item: "minecraft:book", quantidade: 4 }, { item: "minecraft:experience_bottle", quantidade: 8 }] },
      { id: "dc_cabide", objetivo: { tipo: "acao", acao: "cabide", qtd: 1 }, recompensa: [{ item: "minecraft:iron_ingot", quantidade: 8 }] },
      { id: "dc_carregador", requer: ["dc_cinzel"], objetivo: { tipo: "acao", acao: "carregador", qtd: 1 }, recompensa: [{ item: IDS.sacolaOtima, quantidade: 1 }] },
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
    id: "final", // Fase 10: a decolagem e o modo infinito
    icone: IDS.painelNave,
    requer: ["nave"],
    missoes: [
      {
        id: "fn_decolar",
        objetivo: { tipo: "acao", acao: "decolar", qtd: 1 },
        recompensa: [{ item: IDS.sacolaLendaria, quantidade: 1 }],
        escolha: [{ item: "minecraft:diamond_block", quantidade: 2 }, { item: "minecraft:enchanted_golden_apple", quantidade: 1 }],
      },
      { id: "fn_noites", requer: ["fn_decolar"], objetivo: { tipo: "noites", qtd: 30 }, recompensa: [{ item: IDS.sacolaLendaria, quantidade: 1 }] },
      { id: "fn_reator", requer: ["fn_decolar"], objetivo: { tipo: "acao", acao: "reator_10e", qtd: 1000 }, recompensa: [{ item: "cl:bloco_yellorium", quantidade: 4 }] },
      { id: "fn_me", requer: ["fn_decolar"], objetivo: { tipo: "ter", item: "cl:celula_me_64k", qtd: 1 }, recompensa: [{ item: IDS.sacolaEpica, quantidade: 2 }] },
      { id: "fn_corpos", requer: ["fn_decolar"], objetivo: { tipo: "acao", acao: "corpo_criado", qtd: 3 }, recompensa: [{ item: IDS.sacolaEpica, quantidade: 1 }] },
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

// Fase 37 (1.14.0): melhorias do Sophisticated Backpacks (P3pp3rF1y; arte com todos os direitos reservados, então os
// ícones são próprios) para a Mochila do pack, com receitas e números do código (Config.java: a mochila de couro tem
// 27 espaços e 1 espaço de melhoria; ímã de raio 3). E o templo do deserto do YUNG's Better Desert Temples (LGPLv3),
// montado das peças originais por tools/gerar-templo-yung.py. Scripts em scripts/utilidades/melhorias_mochila.ts e
// scripts/mundo/templo_yung.ts.
const SB = { mod: "Sophisticated Backpacks", pilha: 1 };
// 1.33.0: o cartão leva o símbolo de cada melhoria.
const SIMBOLO = { coleta: "seta", ima: "ima", alimentacao: "comida", compactacao: "compactar", compactacao_avancada: "compactar", deposito: "deposito", reabastecer: "ciclo", ima_avancada: "ima", alimentacao_avancada: "comida", fornalha: "chama", fundicao_auto: "chama", recarga: "ciclo" };
const melhoria = (id, pt, en, cor) => ({ id: `melhoria_${id}`, pt: `Melhoria: ${pt}`, en: `${en} Upgrade`, icone: `upgrade:${cor}:${SIMBOLO[id] ?? "seta"}`, ...SB });
const BASE = "cl:melhoria_base";

export default {
  fase: 37,
  mod: "Sophisticated Backpacks",
  itens: [
    { id: "melhoria_base", pt: "Base de Melhoria", en: "Upgrade Base", icone: "upgrade:#8b5a2b:vazio", mod: "Sophisticated Backpacks", pilha: 16 },
    melhoria("coleta", "Coleta", "Pickup", "#7fbf4a"),
    melhoria("ima", "Ímã", "Magnet", "#c0392b"),
    melhoria("alimentacao", "Alimentação", "Feeding", "#e8a33c"),
    melhoria("compactacao", "Compactação", "Compacting", "#9aa0a6"),
    melhoria("compactacao_avancada", "Compactação Avançada", "Advanced Compacting", "#5ff3ff"),
    melhoria("deposito", "Depósito", "Deposit", "#3c7fd8"),
    melhoria("reabastecer", "Reabastecer", "Restock", "#8e44ad"),
  ],
  receitas: [
    { id: "melhoria_base", tipo: "shaped", padrao: ["SIS", "ILI", "SIS"], chave: { S: "minecraft:string", I: "minecraft:iron_ingot", L: "minecraft:leather" }, resultado: BASE },
    { id: "melhoria_coleta", tipo: "shaped", padrao: [" P ", "SBS", "RRR"], chave: { P: "minecraft:sticky_piston", S: "minecraft:string", B: BASE, R: "minecraft:redstone" }, resultado: "cl:melhoria_coleta" },
    { id: "melhoria_ima", tipo: "shaped", padrao: ["EIE", "IPI", "R L"], chave: { E: "minecraft:ender_pearl", I: "minecraft:iron_ingot", P: "cl:melhoria_coleta", R: "minecraft:redstone", L: "minecraft:lapis_lazuli" }, resultado: "cl:melhoria_ima" },
    { id: "melhoria_alimentacao", tipo: "shaped", padrao: [" C ", "ABM", " E "], chave: { C: "minecraft:golden_carrot", A: "minecraft:golden_apple", B: BASE, M: "minecraft:glistering_melon_slice", E: "minecraft:ender_pearl" }, resultado: "cl:melhoria_alimentacao" },
    { id: "melhoria_compactacao", tipo: "shaped", padrao: ["IPI", "PBP", "RPR"], chave: { I: "minecraft:iron_ingot", P: "minecraft:piston", B: BASE, R: "minecraft:redstone" }, resultado: "cl:melhoria_compactacao" },
    { id: "melhoria_compactacao_avancada", tipo: "shaped", padrao: [" D ", "GCG", "RRR"], chave: { D: "minecraft:diamond", G: "minecraft:gold_ingot", C: "cl:melhoria_compactacao", R: "minecraft:redstone" }, resultado: "cl:melhoria_compactacao_avancada" },
    { id: "melhoria_deposito", tipo: "shaped", padrao: [" P ", "IBI", "RCR"], chave: { P: "minecraft:piston", I: "minecraft:iron_ingot", B: BASE, R: "minecraft:redstone", C: "minecraft:chest" }, resultado: "cl:melhoria_deposito" },
    { id: "melhoria_reabastecer", tipo: "shaped", padrao: [" P ", "IBI", "RCR"], chave: { P: "minecraft:sticky_piston", I: "minecraft:iron_ingot", B: BASE, R: "minecraft:redstone", C: "minecraft:chest" }, resultado: "cl:melhoria_reabastecer" },
  ],
  dados: {
    // Compactação: 2×2 (básica) e 3×3 (avançada) das receitas do jogo e do pack.
    compactar2: {
      "minecraft:quartz": "minecraft:quartz_block", "minecraft:clay_ball": "minecraft:clay", "minecraft:snowball": "minecraft:snow", "minecraft:glowstone_dust": "minecraft:glowstone",
      "minecraft:amethyst_shard": "minecraft:amethyst_block", "minecraft:honeycomb": "minecraft:honeycomb_block", "minecraft:sand": "minecraft:sandstone", "minecraft:brick": "minecraft:brick_block",
    },
    compactar3: {
      "minecraft:iron_nugget": "minecraft:iron_ingot", "minecraft:gold_nugget": "minecraft:gold_ingot", "minecraft:iron_ingot": "minecraft:iron_block", "minecraft:gold_ingot": "minecraft:gold_block",
      "minecraft:copper_ingot": "minecraft:copper_block", "minecraft:redstone": "minecraft:redstone_block", "minecraft:lapis_lazuli": "minecraft:lapis_block", "minecraft:coal": "minecraft:coal_block",
      "minecraft:diamond": "minecraft:diamond_block", "minecraft:emerald": "minecraft:emerald_block", "minecraft:wheat": "minecraft:hay_block", "minecraft:bone_meal": "minecraft:bone_block",
      "minecraft:slime_ball": "minecraft:slime", "minecraft:dried_kelp": "minecraft:dried_kelp_block", "minecraft:raw_iron": "minecraft:raw_iron_block", "minecraft:raw_gold": "minecraft:raw_gold_block",
      "minecraft:raw_copper": "minecraft:raw_copper_block", "cl:coque": "cl:bloco_coque", "minecraft:cobblestone": "cl:pedregulho_comprimido_1",
    },
    raioIma: 3,
  },
  textos: {
    "cl.sb.ativa": ["§7Melhoria: %s", "§7Upgrade: %s"],
    "cl.sb.depositou": ["Mochila: %s itens guardados no baú.", "Backpack: %s items deposited into the chest."],
    "cl.sb.reabasteceu": ["Mochila: %s itens tirados do baú.", "Backpack: %s items restocked from the chest."],
    "cl.sb.comeu": ["Mochila: comeu %s.", "Backpack: ate %s."],
    "cl.comando.piramide": ["A pirâmide do deserto", "The desert pyramid"],
    "cl.capitulo.mochilas.nome": ["Melhorias da Mochila", "Backpack Upgrades"],
    "cl.capitulo.mochilas.curto": ["Mochila+", "Backpack+"],
    "cl.capitulo.mochilas.desc": ["Ponha uma melhoria dentro da mochila (1 por mochila): coleta, ímã, alimentação, compactação, depósito ou reabastecer. E a grande pirâmide do deserto.", "Put one upgrade inside the backpack (1 per backpack): pickup, magnet, feeding, compacting, deposit or restock. And the great desert pyramid."],
    "cl.missao.sb_base.titulo": ["Base de melhoria", "Upgrade base"], "cl.missao.sb_base.desc": ["Faça uma Base de Melhoria.", "Make an Upgrade Base."],
    "cl.missao.sb_ima.titulo": ["Atração", "Attraction"], "cl.missao.sb_ima.desc": ["Use a Melhoria de Ímã numa mochila (ela puxa os itens até você).", "Use a Magnet Upgrade in a backpack (it pulls items to you)."],
    "cl.missao.sb_comer.titulo": ["Lanche automático", "Auto snack"], "cl.missao.sb_comer.desc": ["Coma da mochila com a Melhoria de Alimentação.", "Eat from the backpack with a Feeding Upgrade."],
    "cl.missao.sb_deposito.titulo": ["Descarregar", "Unload"], "cl.missao.sb_deposito.desc": ["Agache e toque num baú com a mochila de Depósito.", "Sneak and tap a chest with a Deposit backpack."],
    "cl.missao.yung_piramide.titulo": ["A grande pirâmide", "The great pyramid"], "cl.missao.yung_piramide.desc": ["Entre na pirâmide do deserto (/cl:piramide mostra onde fica).", "Enter the desert pyramid (/cl:piramide shows where it is)."],
  },
};

// Fase 44 (1.25.0): Sophisticated Backpacks 3.26.19, a versão mais nova (P3pp3rF1y; código e arte com todos os direitos
// reservados desde 2025, então só as ideias e os números: código e ícones são próprios). Os níveis de mochila do mod com os números do Config.java (Couro 27
// espaços e 1 melhoria, Cobre 45 e 1, Ferro 54 e 2, Ouro 81 e 3, Diamante 108 e 5, Netherita 120 e 7) e as melhorias
// que dá para fazer sem a tela do mod: Ímã Avançado (raio 5), Alimentação Avançada, Fornalha, Fornalha Automática e
// Reposição, com as receitas do mod. No Bedrock a receita perderia o que está dentro, então a mochila sobe de nível
// tocando a mochila aberta com o material na mão (8 lingotes de cobre, 4 de ferro, 8 de ouro, 8 diamantes, 1 lingote
// de netherita). Scripts em scripts/utilidades/mochila.ts, mochila_niveis.ts e melhorias_mochila.ts.
const SB = { mod: "Sophisticated Backpacks", pilha: 1 };
const mochila = (id, pt, en, cor) => ({ id: `mochila_${id}`, pt, en, icone: `saco:${cor}`, ...SB });
const melhoria = (id, pt, en, cor) => ({ id: `melhoria_${id}`, pt: `Melhoria: ${pt}`, en: `${en} Upgrade`, icone: `upgrade:${cor}`, ...SB });
const BASE = "cl:melhoria_base";
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 44,
  mod: "Sophisticated Backpacks",
  itens: [
    mochila("cobre", "Mochila de Cobre", "Copper Backpack", "#c8703c"),
    mochila("ferro", "Mochila de Ferro", "Iron Backpack", "#c8c8c8"),
    mochila("ouro", "Mochila de Ouro", "Gold Backpack", "#f2c84b"),
    mochila("diamante", "Mochila de Diamante", "Diamond Backpack", "#5ff3e8"),
    mochila("netherite", "Mochila de Netherita", "Netherite Backpack", "#4a3a44"),
    melhoria("ima_avancada", "Ímã Avançado", "Advanced Magnet", "#ff5a4a"),
    melhoria("alimentacao_avancada", "Alimentação Avançada", "Advanced Feeding", "#ffc85a"),
    melhoria("fornalha", "Fornalha", "Smelting", "#6a6a6a"),
    melhoria("fundicao_auto", "Fornalha Automática", "Auto-Smelting", "#e85a2a"),
    melhoria("recarga", "Reposição", "Refill", "#3cb878"),
  ],
  receitas: [
    { id: "melhoria_ima_avancada", tipo: "shaped", padrao: [" D ", "GMG", "RRR"], chave: { D: "minecraft:diamond", G: "minecraft:gold_ingot", M: "cl:melhoria_ima", R: "minecraft:redstone" }, resultado: "cl:melhoria_ima_avancada" },
    { id: "melhoria_alimentacao_avancada", tipo: "shaped", padrao: [" D ", "GVG", "RRR"], chave: { D: "minecraft:diamond", G: "minecraft:gold_ingot", V: "cl:melhoria_alimentacao", R: "minecraft:redstone" }, resultado: "cl:melhoria_alimentacao_avancada" },
    { id: "melhoria_fornalha", tipo: "shaped", padrao: ["RIR", "IBI", "RFR"], chave: { R: "minecraft:redstone", I: "minecraft:iron_ingot", B: BASE, F: "minecraft:furnace" }, resultado: "cl:melhoria_fornalha" },
    { id: "melhoria_fundicao_auto", tipo: "shaped", padrao: ["DHD", "RSH", "GHG"], chave: { D: "minecraft:diamond", H: "minecraft:hopper", R: "minecraft:redstone", S: "cl:melhoria_fornalha", G: "minecraft:gold_ingot" }, resultado: "cl:melhoria_fundicao_auto" },
    { id: "melhoria_recarga", tipo: "shaped", padrao: [" E ", "IBI", "RCR"], chave: { E: "minecraft:ender_pearl", I: "minecraft:iron_ingot", B: BASE, R: "minecraft:redstone", C: "minecraft:chest" }, resultado: "cl:melhoria_recarga" },
  ],
  dados: {
    // SB: ímã avançado de raio 5; fornalha com a velocidade de uma fornalha (200 ticks por item) e o combustível dela.
    raioImaAvancado: 5,
    ticksPorItem: 200,
    combustivel: { "minecraft:coal": 8, "minecraft:charcoal": 8, "minecraft:coal_block": 80, "minecraft:blaze_rod": 12, "cl:coque": 16, "cl:bloco_coque": 160, "minecraft:dried_kelp_block": 20 },
  },
  textos: {
    "cl.mochila.dica": ["Mochila no chão: botão Abrir para mexer nela; agachado e tocando troca de página; tocando com o material sobe de nível; bater guarda de volta.", "Backpack on the ground: Open button to use it; sneak and tap to change page; tap with the material to upgrade; hit to pick it back up."],
    "cl.sb.pagina": ["Mochila: página %s de %s", "Backpack: page %s of %s"],
    "cl.sb.nivel_falta": ["Para melhorar a mochila: %s do material na mão.", "To upgrade the backpack: %s of the material in hand."],
    "cl.sb.nivel_subiu": ["Mochila melhorada: %s (%s espaços).", "Backpack upgraded: %s (%s slots)."],
    "cl.sb.nivel_outro": ["Esta mochila sobe de nível com %s × %s.", "This backpack upgrades with %s × %s."],
    "cl.sb.nivel_max": ["A Mochila de Netherita já é o nível mais alto.", "The Netherite Backpack is already the highest tier."],
    "cl.mochila.botao_melhorar": ["Melhorar", "Upgrade"],
    "cl.mochila.botao_pagina": ["Página", "Page"],
    "cl.mochila.cat": ["Mochila no chão (tocar com o material)", "Backpack on the ground (tap with the material)"],
    "cl.mochila.cat_nota": ["%s espaços, %s melhorias. Nada do que está dentro se perde.", "%s slots, %s upgrades. Nothing inside is lost."],
    "cl.sb.ativas": ["§7Melhorias: %s", "§7Upgrades: %s"],
    "cl.sb.fundiu": ["Mochila: fundiu %s.", "Backpack: smelted %s."],
    "cl.mochila.niveis": ["Mochila aberta no chão: toque com 8 lingotes de cobre (Cobre), 4 de ferro (Ferro), 8 de ouro (Ouro), 8 diamantes (Diamante) ou 1 lingote de netherita (Netherita) para subir de nível sem perder nada. Agachado e tocando, troca de página (27 espaços por página). Cada nível tem mais espaços de melhoria: 1, 1, 2, 3, 5, 7.", "Backpack open on the ground: tap it with 8 copper ingots (Copper), 4 iron (Iron), 8 gold (Gold), 8 diamonds (Diamond) or 1 netherite ingot (Netherite) to upgrade it without losing anything. Sneak and tap to change page (27 slots per page). Each tier has more upgrade slots: 1, 1, 2, 3, 5, 7."],
    "cl.capitulo.mochilas.desc": ["Melhore a mochila de couro até a de netherita (toque nela aberta com o material) e ponha melhorias dentro: coleta, ímã, alimentação, compactação, fornalha, reposição, depósito ou reabastecer. Quanto melhor a mochila, mais melhorias valem ao mesmo tempo. E a grande pirâmide do deserto.", "Upgrade the leather backpack up to netherite (tap it open with the material) and put upgrades inside: pickup, magnet, feeding, compacting, smelting, refill, deposit or restock. The better the backpack, the more upgrades work at once. And the great desert pyramid."],
    ...missao("sb_cobre", "Mochila de Cobre", "Copper Backpack", "Toque na mochila aberta com 8 lingotes de cobre: 45 espaços.", "Tap the open backpack with 8 copper ingots: 45 slots."),
    ...missao("sb_ouro", "Mochila de Ouro", "Gold Backpack", "Chegue à Mochila de Ouro: 81 espaços e 3 melhorias de uma vez.", "Reach the Gold Backpack: 81 slots and 3 upgrades at once."),
    ...missao("sb_netherite", "Mochila de Netherita", "Netherite Backpack", "Chegue à Mochila de Netherita: 120 espaços e 7 melhorias.", "Reach the Netherite Backpack: 120 slots and 7 upgrades."),
    ...missao("sb_fornalha", "Fornalha de bolso", "Pocket furnace", "Funda um minério dentro da mochila com a Melhoria: Fornalha (e carvão dentro).", "Smelt an ore inside the backpack with the Smelting Upgrade (and coal inside)."),
    ...missao("sb_recarga", "Reposição", "Refill", "Deixe a Melhoria: Reposição completar uma pilha da barra com o que está na mochila.", "Let the Refill Upgrade top up a hotbar stack from the backpack."),
  },
};

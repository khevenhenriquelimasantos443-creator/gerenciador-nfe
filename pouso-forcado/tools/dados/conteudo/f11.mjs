// Fase 11 (extra da 1.2.0): Caixa de Entrega do Hardcore Questing Mode (scripts/missoes/entrega.ts).
export default {
  fase: 11,
  mod: "Hardcore Questing Mode",
  blocos: [{ id: "caixa_entrega", pt: "Caixa de Entrega", en: "Quest Delivery System", tipo: "maquina", luz: "amarelo", glifo: "caixa", comp: "cl:caixa_entrega", tick: 100, girar: false }],
  receitas: [{ id: "caixa_entrega", tipo: "shaped", padrao: ["III", "ICI", "IRI"], chave: { I: "minecraft:iron_ingot", C: "minecraft:chest", R: "minecraft:redstone" }, resultado: "cl:caixa_entrega" }],
  textos: {
    "cl.qds.dono": ["Caixa de Entrega de %s: a cada 5 s, os baús encostados nela entregam as missões \"entregar\" abertas e contam para as missões \"ter\".", "%s's Quest Delivery System: every 5 s, the chests touching it deliver open \"deliver\" quests and count for \"have\" quests."],
    "cl.qds.entregou": ["§6[Caixa de Entrega]§r entregou: %s", "§6[Delivery]§r delivered: %s"],
  },
};

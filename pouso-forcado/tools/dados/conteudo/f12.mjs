// Fase 12 (extra da 1.2.0): cajados melhores do Ex Nihilo (scripts/blocos/nihilo.ts, CAJADOS em config.ts).
export default {
  fase: 12,
  mod: "Ex Nihilo",
  itens: [
    { id: "cajado_osso", pt: "Cajado de Osso", en: "Bone Crook", icone: "barra:#e8e2d0", pilha: 1, comp: { "minecraft:durability": { max_durability: 256 }, "minecraft:hand_equipped": true } },
    { id: "cajado_ouro", pt: "Cajado de Ouro", en: "Golden Crook", icone: "barra:#f2c94c", pilha: 1, comp: { "minecraft:durability": { max_durability: 32 }, "minecraft:hand_equipped": true }, mod: "Ex Aliquo" },
  ],
  blocos: [{ id: "cascalho_nether", pt: "Cascalho do Nether", en: "Nether Gravel", tipo: "cubo", cor: "#7a2e2e", padrao: "rachado", dureza: 0.6, menu: "nature" }],
  receitas: [
    { id: "cajado_osso", tipo: "shaped", padrao: ["OO", " O", " O"], chave: { O: "minecraft:bone" }, resultado: "cl:cajado_osso" },
    { id: "cajado_ouro", tipo: "shaped", padrao: ["GG", " G", " G"], chave: { G: "minecraft:gold_ingot" }, resultado: "cl:cajado_ouro" },
  ],
  textos: {
    "cl.missao.en_quartzo.titulo": ["Quartzo sem Nether", "Quartz without the Nether"], "cl.missao.en_quartzo.desc": ["Faça netherrack no barril (lava + redstone), martele em Cascalho do Nether e peneire 8 quartzos.", "Make netherrack in the barrel (lava + redstone), hammer it into Nether Gravel and sift 8 quartz."],
    "cl.missao.en_cajado_osso.titulo": ["Cajado de osso", "Bone crook"], "cl.missao.en_cajado_osso.desc": ["Faça um Cajado de Osso (dura 4 vezes mais). O de Ouro acha o dobro de bichos-da-seda, mas quebra rápido.", "Craft a Bone Crook (lasts 4 times longer). The Golden one finds twice the silkworms but breaks fast."],
  },
};

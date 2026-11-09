// Fase 60 (1.41.0): Galacticraft 5 (o mais novo, 1.21.1; Team Galacticraft, licença MIT, inclusive a arte). A arte do
// Galacticraft do pack passa a ser a original (tools/importar-gc5.py) e entram os blocos novos da Lua do GC5: basalto
// lunar, ardósia lunar (lunaslate), a família da rocha lunar (pedregulho, polida, tijolos, rachados, entalhados e pilar),
// vidro lunar e a safira lunar (minério, gema e bloco). O basalto, a ardósia e a safira aparecem na geração da Lua
// (scripts/galacticraft/lua.ts).
const GC = { mod: "Galacticraft" };
const pedra = (id, pt, en, cor, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao: "liso", dureza: 2, girar: false, ...GC, ...extra });

export default {
  fase: 60,
  mod: "Galacticraft",
  itens: [{ id: "safira_lunar", pt: "Safira Lunar", en: "Lunar Sapphire", icone: "cristal:#4a7ad8", ...GC }],
  blocos: [
    pedra("basalto_lunar", "Basalto Lunar", "Moon Basalt", "#3a3a40"),
    pedra("tijolos_basalto_lunar", "Tijolos de Basalto Lunar", "Moon Basalt Bricks", "#3a3a40"),
    pedra("tijolos_basalto_lunar_rachados", "Tijolos de Basalto Lunar Rachados", "Cracked Moon Basalt Bricks", "#3a3a40"),
    pedra("pedregulho_lunar", "Pedregulho Lunar", "Cobbled Moon Rock", "#8a8a8a"),
    pedra("rocha_lunar_polida", "Rocha Lunar Polida", "Polished Moon Rock", "#9a9a9a"),
    pedra("tijolos_rocha_lunar", "Tijolos de Rocha Lunar", "Moon Rock Bricks", "#9a9a9a"),
    pedra("tijolos_rocha_lunar_rachados", "Tijolos de Rocha Lunar Rachados", "Cracked Moon Rock Bricks", "#9a9a9a"),
    pedra("tijolos_rocha_lunar_entalhados", "Tijolos de Rocha Lunar Entalhados", "Chiseled Moon Rock Bricks", "#9a9a9a"),
    pedra("pilar_rocha_lunar", "Pilar de Rocha Lunar", "Moon Rock Pillar", "#9a9a9a"),
    pedra("ardosia_lunar", "Ardósia Lunar", "Lunaslate", "#4a4a52", { dureza: 3 }),
    pedra("ardosia_lunar_pedregulho", "Pedregulho de Ardósia Lunar", "Cobbled Lunaslate", "#4a4a52", { dureza: 3 }),
    pedra("minerio_safira_lunar", "Minério de Safira Lunar", "Lunar Sapphire Ore", "#4a7ad8", { dureza: 3, loot: "loot_tables/cl/minerio_safira_lunar.json" }),
    pedra("bloco_safira_lunar", "Bloco de Safira Lunar", "Lunar Sapphire Block", "#4a7ad8", { dureza: 4 }),
    { id: "vidro_lunar", pt: "Vidro Lunar", en: "Moon Glass", tipo: "vidro", cor: "#b8c0c8", dureza: 0.3, girar: false, loot: "loot_tables/empty.json", ...GC },
  ],
  receitas: [
    { id: "pedregulho_lunar", tipo: "shapeless", ingredientes: ["cl:rocha_lunar"], resultado: "cl:pedregulho_lunar" },
    { id: "pedregulho_lunar_rocha", tipo: "furnace", entrada: "cl:pedregulho_lunar", resultado: "cl:rocha_lunar" },
    { id: "rocha_lunar_polida", tipo: "shaped", padrao: ["##"], chave: { "#": "cl:rocha_lunar" }, resultado: "cl:rocha_lunar_polida", qtd: 2 },
    { id: "tijolos_rocha_lunar", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:rocha_lunar_polida" }, resultado: "cl:tijolos_rocha_lunar", qtd: 4 },
    { id: "tijolos_rocha_lunar_rachados", tipo: "furnace", entrada: "cl:tijolos_rocha_lunar", resultado: "cl:tijolos_rocha_lunar_rachados" },
    { id: "tijolos_rocha_lunar_entalhados", tipo: "shaped", padrao: ["#", "#"], chave: { "#": "cl:tijolos_rocha_lunar" }, resultado: "cl:tijolos_rocha_lunar_entalhados" },
    { id: "pilar_rocha_lunar", tipo: "shaped", padrao: ["#", "#"], chave: { "#": "cl:rocha_lunar_polida" }, resultado: "cl:pilar_rocha_lunar", qtd: 2 },
    { id: "tijolos_basalto_lunar", tipo: "shaped", padrao: ["##", "##"], chave: { "#": "cl:basalto_lunar" }, resultado: "cl:tijolos_basalto_lunar", qtd: 4 },
    { id: "tijolos_basalto_lunar_rachados", tipo: "furnace", entrada: "cl:tijolos_basalto_lunar", resultado: "cl:tijolos_basalto_lunar_rachados" },
    { id: "ardosia_lunar_pedregulho", tipo: "shapeless", ingredientes: ["cl:ardosia_lunar"], resultado: "cl:ardosia_lunar_pedregulho" },
    { id: "ardosia_lunar_forno", tipo: "furnace", entrada: "cl:ardosia_lunar_pedregulho", resultado: "cl:ardosia_lunar" },
    { id: "vidro_lunar", tipo: "furnace", entrada: "cl:terra_lunar", resultado: "cl:vidro_lunar" },
    { id: "bloco_safira_lunar", tipo: "shaped", padrao: ["###", "###", "###"], chave: { "#": "cl:safira_lunar" }, resultado: "cl:bloco_safira_lunar" },
    { id: "safira_lunar_desfazer", tipo: "shapeless", ingredientes: ["cl:bloco_safira_lunar"], resultado: "cl:safira_lunar", qtd: 9 },
  ],
  textos: {
    "cl.missao.gc5_safira.titulo": ["Safira Lunar", "Lunar Sapphire"], "cl.missao.gc5_safira.desc": ["Ache 3 safiras lunares no fundo da Lua.", "Find 3 lunar sapphires deep in the Moon."],
    "cl.missao.gc5_basalto.titulo": ["Basalto Lunar", "Moon Basalt"], "cl.missao.gc5_basalto.desc": ["Construa com 8 Tijolos de Basalto Lunar.", "Build with 8 Moon Basalt Bricks."],
  },
};

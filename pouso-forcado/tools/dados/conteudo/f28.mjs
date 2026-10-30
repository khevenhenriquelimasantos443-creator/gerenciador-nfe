// Fase 28 (1.7.0): os add-ons do Mekanism da época do Crash Landing (1.6.4): Mekanism Generators e Mekanism Tools,
// com o que eles pedem do Mekanism (ósmio, circuitos de controle, tablet de energia, núcleo eletrolítico, revestimento
// de aço, biocombustível e o Triturador). Números do código do Mekanism (MekanismGenerators, MekanismTools e
// Mekanism.java): em J/t do Mekanism, 100 J/t = 1 E a cada 5 s (2,5 J = 1 RF). Scripts em scripts/maquinas/mekanism_extra.ts.
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 100, ...extra });
const GEN = { mod: "Mekanism Generators" };
const TOOLS = { mod: "Mekanism Tools" };

// Mekanism Tools: [id, nome pt, en, lingote, cor, nível, usos, eficiência, dano, encantabilidade,
//   paxel [usos, eficiência, dano, encant.], armadura [durabilidade, [cabeça, peito, pernas, pés], encant.]]
export const MATERIAIS = [
  ["obsidiana", "de Obsidiana Refinada", "Refined Obsidian", "cl:lingote_obsidiana_refinada", "#6b4f9e", 3, 2500, 20, 10, 40, [3000, 25, 10, 50], [50, [5, 12, 8, 5], 40]],
  ["lapis", "de Lápis-Lazúli", "Lapis Lazuli", "minecraft:lapis_lazuli", "#2f5fc4", 2, 200, 5, 2, 8, [250, 6, 4, 10], [13, [2, 5, 6, 2], 8]],
  ["osmio", "de Ósmio", "Osmium", "cl:lingote_osmio", "#9db7c9", 2, 500, 10, 4, 12, [700, 12, 5, 16], [30, [3, 5, 6, 3], 12]],
  ["bronze", "de Bronze", "Bronze", "cl:lingote_bronze", "#c8913a", 2, 800, 14, 6, 10, [1100, 16, 10, 14], [35, [3, 6, 5, 2], 10]],
  ["glowstone", "de Glowstone Refinada", "Refined Glowstone", "cl:lingote_glowstone_refinado", "#f5d76e", 2, 300, 14, 5, 18, [450, 18, 5, 22], [18, [3, 7, 6, 3], 18]],
  ["aco", "de Aço", "Steel", "cl:lingote_aco", "#8797a6", 3, 850, 14, 4, 10, [1250, 18, 8, 14], [40, [3, 7, 6, 3], 10]],
];
// Ferramentas: [id, pt, en, ícone, dano base (Java: espada 4, machado 3, picareta 2, pá 1), slot de encantamento, tag]
const FERRAMENTAS = [
  ["picareta", "Picareta", "Pickaxe", "picareta", 2, "pickaxe", "minecraft:is_pickaxe"],
  ["machado", "Machado", "Axe", "machadinha", 3, "axe", "minecraft:is_axe"],
  ["pa", "Pá", "Shovel", "pa", 1, "shovel", "minecraft:is_shovel"],
  ["enxada", "Enxada", "Hoe", "enxada", 0, "hoe", "minecraft:is_hoe"],
  ["espada", "Espada", "Sword", "espada_larga", 4, "sword", "minecraft:is_sword"],
];
const BLOCOS_DE = {
  pickaxe: "'stone', 'metal', 'rail', 'minecraft:is_pickaxe_item_destructible'",
  axe: "'wood', 'log', 'pumpkin', 'plant', 'minecraft:is_axe_item_destructible'",
  shovel: "'dirt', 'sand', 'gravel', 'grass', 'snow', 'minecraft:is_shovel_item_destructible'",
  hoe: "'minecraft:is_hoe_item_destructible', 'crop'",
  sword: "'minecraft:is_sword_item_destructible'",
};
const digger = (slots, eff) => ({
  use_efficiency: true,
  destroy_speeds: slots.map((s) => ({ block: { tags: `query.any_tag(${BLOCOS_DE[s]})` }, speed: eff })),
});
const tier = (nivel) => (nivel >= 3 ? "minecraft:diamond_tier" : "minecraft:iron_tier");
// Armaduras: [id, pt, en, ícone, slot, slot de encantamento, multiplicador de durabilidade do Java]
const PECAS = [
  ["capacete", "Capacete", "Helmet", "capacete", "slot.armor.head", "armor_head", 11],
  ["peitoral", "Peitoral", "Chestplate", "peitoral", "slot.armor.chest", "armor_torso", 16],
  ["calcas", "Calças", "Leggings", "calcas", "slot.armor.legs", "armor_legs", 15],
  ["botas", "Botas", "Boots", "botas", "slot.armor.feet", "armor_feet", 13],
];
const VANILLA_PAXEL = [
  ["madeira", "de Madeira", "Wooden", "wooden", "#a07c48", 0, 59, 2, 1, 15],
  ["pedra", "de Pedra", "Stone", "stone", "#8c8c8c", 1, 131, 4, 2, 5],
  ["ferro", "de Ferro", "Iron", "iron", "#d6d9dc", 2, 250, 6, 3, 14],
  ["ouro", "de Ouro", "Golden", "golden", "#f2c94c", 0, 32, 12, 1, 22],
  ["diamante", "de Diamante", "Diamond", "diamond", "#6fe3e0", 3, 1561, 8, 4, 10],
];
const paxel = (id, pt, en, cor, nivel, usos, eff, dano, ench, extra = {}) => ({
  id: `mk_paxel_${id}`, pt: `Paxel ${pt}`, en: `${en} Paxel`, icone: `ferramenta:paxel:${cor}`, pilha: 1, cat: "equipment", ...TOOLS,
  comp: {
    "minecraft:hand_equipped": true,
    "minecraft:durability": { max_durability: usos },
    "minecraft:damage": { value: dano + 3 },
    "minecraft:enchantable": { slot: "pickaxe", value: ench },
    "minecraft:digger": digger(["pickaxe", "axe", "shovel"], eff),
    "minecraft:tags": { tags: ["minecraft:is_pickaxe", "minecraft:is_axe", "minecraft:is_shovel", "minecraft:is_tool", tier(nivel), "cl:mk_ferramenta"] },
  },
  ...extra,
});

export default {
  fase: 28,
  mod: "Mekanism",
  itens: [
    ...["quebrado", "triturado", "po"].map((e, k) => ({
      id: `osmio_${e}`, pt: ["Pedaço Quebrado de Ósmio", "Pedaço Triturado de Ósmio", "Pó de Minério de Ósmio"][k],
      en: ["Broken Osmium Ore", "Crushed Osmium Ore", "Powdered Osmium Ore"][k], icone: k ? `po:${["", "#8aa4b6", "#b9cfdd"][k]}` : "pepita:#9db7c9", mod: "Ex Aliquo",
    })),
    { id: "lingote_osmio", pt: "Lingote de Ósmio", en: "Osmium Ingot", icone: "lingote:#9db7c9" },
    { id: "po_osmio", pt: "Pó de Ósmio", en: "Osmium Dust", icone: "po:#9db7c9" },
    { id: "lingote_obsidiana_refinada", pt: "Lingote de Obsidiana Refinada", en: "Refined Obsidian Ingot", icone: "lingote:#6b4f9e" },
    { id: "lingote_glowstone_refinado", pt: "Lingote de Glowstone Refinada", en: "Refined Glowstone Ingot", icone: "lingote:#f5d76e" },
    { id: "circuito_controle_basico", pt: "Circuito de Controle Básico", en: "Basic Control Circuit", icone: "chip:#7dffa8" },
    { id: "circuito_controle_avancado", pt: "Circuito de Controle Avançado", en: "Advanced Control Circuit", icone: "chip:#ff5a5a" },
    { id: "tablet_energia", pt: "Tablet de Energia", en: "Energy Tablet", icone: "tablet:#58b4ff" },
    { id: "nucleo_eletrolitico", pt: "Núcleo Eletrolítico", en: "Electrolytic Core", icone: "nucleo:#9db7c9" },
    { id: "biocombustivel", pt: "Biocombustível", en: "Bio Fuel", icone: "po:#7dbb4a" },
    { id: "painel_solar_mk", pt: "Painel Solar (Mekanism)", en: "Solar Panel", icone: "placa:#2a4f8a", ...GEN },
    // Mekanism Tools
    ...MATERIAIS.flatMap(([m, pt, en, , cor, nivel, usos, eff, dano, ench, [pu, pe, pd, pen], [dur, prot, aen]]) => [
      ...FERRAMENTAS.map(([f, fpt, fen, ic, base, slot, tag]) => ({
        id: `mk_${f}_${m}`, pt: `${fpt} ${pt}`, en: `${en} ${fen}`, icone: `ferramenta:${ic}:${cor}`, pilha: 1, cat: "equipment", ...TOOLS,
        comp: {
          "minecraft:hand_equipped": true,
          "minecraft:durability": { max_durability: usos },
          "minecraft:damage": { value: dano + base },
          "minecraft:enchantable": { slot, value: ench },
          "minecraft:digger": digger([slot], f === "espada" ? 15 : eff),
          "minecraft:tags": { tags: [tag, ...(f === "espada" ? [] : ["minecraft:is_tool"]), tier(nivel), "cl:mk_ferramenta"] },
        },
      })),
      paxel(m, pt, en, cor, 3, pu, pe, pd, pen),
      ...PECAS.map(([p, ppt, pen2, ic, slot, eslot, mult], k) => ({
        id: `mk_${p}_${m}`, pt: `${ppt} ${pt}`, en: `${en} ${pen2}`, icone: `${ic}:${cor}`, pilha: 1, cat: "equipment", ...TOOLS,
        comp: {
          "minecraft:wearable": { slot, protection: prot[k] },
          "minecraft:durability": { max_durability: dur * mult },
          "minecraft:enchantable": { slot: eslot, value: aen },
          "minecraft:tags": { tags: ["minecraft:is_armor", "cl:mk_armadura"] },
        },
      })),
    ]),
    ...VANILLA_PAXEL.map(([id, pt, en, , cor, nivel, usos, eff, dano, ench]) => paxel(id, pt, en, cor, nivel, usos, eff, dano, ench)),
  ],
  blocos: [
    { id: "revestimento_aco", pt: "Revestimento de Aço", en: "Steel Casing", tipo: "cubo", cor: "#6f7a86", padrao: "rebitado", dureza: 3 },
    maq("triturador_mk", "Triturador", "Crusher", "vermelho", "serra", { tick: 200 }),
    // Mekanism Generators
    maq("gerador_calor", "Gerador a Calor", "Heat Generator", "laranja", "chama", GEN),
    maq("gerador_solar_mk", "Gerador Solar", "Solar Generator", "amarelo", "floco", GEN),
    maq("gerador_solar_avancado", "Gerador Solar Avançado", "Advanced Solar Generator", "amarelo", "grade", GEN),
    maq("gerador_bio", "Biogerador", "Bio-Generator", "verde", "folha", GEN),
    maq("gerador_gas", "Gerador a Gás", "Gas-Burning Generator", "azul", "gota", GEN),
    maq("gerador_eolico", "Turbina Eólica", "Wind Generator", "branco", "seta", GEN),
  ],
  receitas: [
    ...["quebrado", "triturado", "po"].map((e) => ({ id: `osmio_de_${e}`, tipo: "shapeless", ingredientes: Array(4).fill(`cl:osmio_${e}`), resultado: "cl:lingote_osmio" })),
    { id: "osmio_po", tipo: "furnace", entrada: "cl:po_osmio", resultado: "cl:lingote_osmio" },
    { id: "circuito_controle_avancado", tipo: "shaped", padrao: ["ECE"], chave: { E: "cl:liga_enriquecida", C: "cl:circuito_controle_basico" }, resultado: "cl:circuito_controle_avancado" },
    { id: "tablet_energia", tipo: "shaped", padrao: ["RCR", "ECE", "RCR"], chave: { R: "minecraft:redstone", C: "minecraft:gold_ingot", E: "cl:liga_enriquecida" }, resultado: "cl:tablet_energia" },
    { id: "nucleo_eletrolitico", tipo: "shaped", padrao: ["EPE", "IEG", "EPE"], chave: { E: "cl:liga_enriquecida", P: "cl:po_osmio", I: "cl:po_ferro", G: "cl:po_ouro" }, resultado: "cl:nucleo_eletrolitico" },
    { id: "revestimento_aco", tipo: "shaped", padrao: ["SGS", "GPG", "SGS"], chave: { S: "cl:lingote_aco", G: "minecraft:glass", P: "cl:lingote_osmio" }, resultado: "cl:revestimento_aco" },
    { id: "triturador_mk", tipo: "shaped", padrao: ["RCR", "LIL", "RCR"], chave: { R: "minecraft:redstone", L: "minecraft:lava_bucket", C: "cl:circuito_controle_basico", I: "cl:revestimento_aco" }, resultado: "cl:triturador_mk" },
    { id: "painel_solar_mk", tipo: "shaped", padrao: ["GGG", "RAR", "PPP"], chave: { G: "minecraft:glass_pane", R: "minecraft:redstone", A: "cl:liga_enriquecida", P: "cl:lingote_osmio" }, resultado: "cl:painel_solar_mk" },
    { id: "gerador_calor", tipo: "shaped", padrao: ["III", "WOW", "CFC"], chave: { I: "minecraft:iron_ingot", W: "minecraft:oak_planks", O: "cl:lingote_osmio", C: "minecraft:copper_ingot", F: "minecraft:furnace" }, resultado: "cl:gerador_calor" },
    { id: "gerador_solar_mk", tipo: "shaped", padrao: ["SSS", "AIA", "PEP"], chave: { S: "cl:painel_solar_mk", A: "cl:liga_enriquecida", I: "minecraft:iron_ingot", P: "cl:po_osmio", E: "cl:tablet_energia" }, resultado: "cl:gerador_solar_mk" },
    { id: "gerador_solar_avancado", tipo: "shaped", padrao: ["SES", "SES", "III"], chave: { S: "cl:gerador_solar_mk", E: "cl:liga_enriquecida", I: "minecraft:iron_ingot" }, resultado: "cl:gerador_solar_avancado" },
    { id: "gerador_bio", tipo: "shaped", padrao: ["RER", "BCB", "NEN"], chave: { R: "minecraft:redstone", E: "cl:liga_enriquecida", B: "cl:biocombustivel", C: "cl:circuito_controle_basico", N: "minecraft:iron_ingot" }, resultado: "cl:gerador_bio" },
    { id: "gerador_gas", tipo: "shaped", padrao: ["PEP", "ICI", "PEP"], chave: { P: "cl:lingote_osmio", E: "cl:liga_enriquecida", I: "cl:revestimento_aco", C: "cl:nucleo_eletrolitico" }, resultado: "cl:gerador_gas" },
    { id: "gerador_eolico", tipo: "shaped", padrao: [" O ", "OAO", "ECE"], chave: { O: "cl:lingote_osmio", A: "cl:liga_enriquecida", E: "cl:tablet_energia", C: "cl:circuito_controle_basico" }, resultado: "cl:gerador_eolico" },
    // Mekanism Tools: as formas de sempre com o lingote do material (o aço usa cabo de ferro, como no mod).
    ...MATERIAIS.flatMap(([m, , , lingote]) => {
      const cabo = m === "aco" ? "minecraft:iron_ingot" : "minecraft:stick";
      const r = (f, padrao) => ({ id: `mk_${f}_${m}`, tipo: "shaped", padrao, chave: { X: lingote, T: cabo }, resultado: `cl:mk_${f}_${m}` });
      return [
        r("picareta", ["XXX", " T ", " T "]), r("machado", ["XX", "XT", " T"]), r("pa", ["X", "T", "T"]), r("enxada", ["XX", " T", " T"]),
        r("espada", ["X", "X", "T"]), r("capacete", ["XXX", "X X"]), r("peitoral", ["X X", "XXX", "XXX"]), r("calcas", ["XXX", "X X", "X X"]), r("botas", ["X X", "X X"]),
        { id: `mk_paxel_${m}`, tipo: "shaped", padrao: ["AFP", " T ", " T "], chave: { A: `cl:mk_machado_${m}`, F: `cl:mk_picareta_${m}`, P: `cl:mk_pa_${m}`, T: cabo }, resultado: `cl:mk_paxel_${m}` },
      ];
    }),
    ...VANILLA_PAXEL.map(([id, , , v]) => ({
      id: `mk_paxel_${id}`, tipo: "shaped", padrao: ["AFP", " T ", " T "],
      chave: { A: `minecraft:${v}_axe`, F: `minecraft:${v}_pickaxe`, P: `minecraft:${v}_shovel`, T: "minecraft:stick" }, resultado: `cl:mk_paxel_${id}`,
    })),
  ],
  textos: {
    "cl.mk.triturador": ["Triturador: plantas viram Biocombustível (sementes e cana 2; trigo, maçã, batata, cenoura e pão 4); lingotes viram pó; pedregulho vira cascalho, cascalho vira areia. 0,5 E.", "Crusher: plants become Bio Fuel (seeds and sugar cane 2; wheat, apple, potato, carrot and bread 4); ingots become dust; cobblestone becomes gravel, gravel becomes sand. 0.5 E."],
    "cl.mk.gerador_calor": ["Gerador a Calor: combustível de fornalha no baú de cima (1 carvão = 12 E); 1,5 E a cada 5 s, mais um pouco por lava encostada. Agora: %s.", "Heat Generator: furnace fuel in the chest above (1 coal = 12 E); 1.5 E every 5 s, plus a little per touching lava. Now: %s."],
    "cl.mk.gerador_solar": ["Gerador Solar: de dia e com céu aberto, %s. Agora: %s.", "Solar Generator: by day under open sky, %s. Now: %s."],
    "cl.mk.gerador_bio": ["Biogerador: Biocombustível no baú de cima (cada um dura 10 s e dá 7 E). Agora: %s.", "Bio-Generator: Bio Fuel in the chest above (each lasts 10 s and gives 7 E). Now: %s."],
    "cl.mk.gerador_gas": ["Gerador a Gás: Cilindros de Hidrogênio no baú de cima, 1 E por cilindro (o mesmo que a eletrólise gastou: guarda energia, não cria). Agora: %s.", "Gas-Burning Generator: Hydrogen Tanks in the chest above, 1 E per tank (the same the electrolysis used: it stores power, it does not create it). Now: %s."],
    "cl.mk.gerador_eolico": ["Turbina Eólica: mais alto venta mais (y 24 = 0,6 E, y 255 = 4,8 E a cada 5 s). Na Lua não há vento. Agora: %s.", "Wind Generator: higher is windier (y 24 = 0.6 E, y 255 = 4.8 E every 5 s). There is no wind on the Moon. Now: %s."],
    "cl.mk.parado": ["parado", "idle"],
    "cl.capitulo.mekanism_extra.nome": ["Mekanism: Geradores e Ferramentas", "Mekanism: Generators and Tools"],
    "cl.capitulo.mekanism_extra.curto": ["Mek. Extras", "Mek. Extras"],
    "cl.capitulo.mekanism_extra.desc": ["Os add-ons do Mekanism: Generators (calor, sol, bio, gás e vento) e Tools (ferramentas, paxels e armaduras).", "The Mekanism add-ons: Generators (heat, sun, bio, gas and wind) and Tools (tools, paxels and armor)."],
    "cl.missao.mx_osmio.titulo": ["Ósmio", "Osmium"], "cl.missao.mx_osmio.desc": ["Junte 8 Lingotes de Ósmio (os pedaços saem da peneira).", "Collect 8 Osmium Ingots (the pieces come from the sieve)."],
    "cl.missao.mx_circuito.titulo": ["Circuito de controle", "Control circuit"], "cl.missao.mx_circuito.desc": ["Faça um Circuito de Controle Básico no Infusor Metalúrgico (ósmio + redstone).", "Make a Basic Control Circuit in the Metallurgic Infuser (osmium + redstone)."],
    "cl.missao.mx_calor.titulo": ["Calor", "Heat"], "cl.missao.mx_calor.desc": ["Coloque um Gerador a Calor.", "Place a Heat Generator."],
    "cl.missao.mx_bio.titulo": ["Bio", "Bio"], "cl.missao.mx_bio.desc": ["Junte 16 Biocombustíveis no Triturador.", "Collect 16 Bio Fuel from the Crusher."],
    "cl.missao.mx_sol.titulo": ["Sol forte", "Strong sun"], "cl.missao.mx_sol.desc": ["Coloque um Gerador Solar Avançado.", "Place an Advanced Solar Generator."],
    "cl.missao.mx_vento.titulo": ["Vento", "Wind"], "cl.missao.mx_vento.desc": ["Coloque uma Turbina Eólica.", "Place a Wind Generator."],
    "cl.missao.mx_paxel.titulo": ["Paxel", "Paxel"], "cl.missao.mx_paxel.desc": ["Tenha um Paxel de Ósmio (picareta, machado e pá numa ferramenta só).", "Have an Osmium Paxel (pickaxe, axe and shovel in one tool)."],
    "cl.missao.mx_armadura.titulo": ["Armadura de aço", "Steel armor"], "cl.missao.mx_armadura.desc": ["Tenha o Peitoral de Aço.", "Have the Steel Chestplate."],
    "cl.missao.mx_obsidiana.titulo": ["Obsidiana refinada", "Refined obsidian"], "cl.missao.mx_obsidiana.desc": ["Faça uma Espada de Obsidiana Refinada.", "Make a Refined Obsidian Sword."],
  },
};

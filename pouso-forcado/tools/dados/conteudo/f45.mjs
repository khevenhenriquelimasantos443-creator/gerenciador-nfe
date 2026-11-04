// Fase 45 (1.26.0): Tinkers' Construct 3.12.1 completo, parte 1 (SlimeKnights, MIT, inclusive a arte). Os materiais, as
// peças e as ferramentas de mão novas saem das tabelas de tinkers.mjs (Fases 15 e 16). Aqui: o cobalto (minério no
// Nether, cobalto bruto e lingote), os lingotes das ligas do TC3 (Ferro-Porco, Hepatizão, Manyullyn, Slime da Rainha e
// os de slime), os ossos (necrótico, de blaze, venenoso), o Nahuatl, os blocos de metal e os traços (nomes e descrições
// do mod). As ligas e os "materiais compostos" (peça mergulhada num líquido na Mesa de Fundição vira outro material)
// ficam em dados para scripts/tinkers/fundicao.ts, com os números do TC3 (metal em 144 mB por lingote; o resto como no mod).
import { TRACOS } from "./tinkers.mjs";

const TC = { mod: "Tinkers' Construct" };
const lingote = (id, pt, en, cor) => ({ id: `lingote_${id}`, pt: `Lingote de ${pt}`, en: `${en} Ingot`, icone: `lingote:${cor}`, ...TC });
const bloco = (id, pt, en, cor) => ({ id: `bloco_${id}`, pt: `Bloco de ${pt}`, en: `Block of ${en}`, tipo: "cubo", cor, padrao: "metal", dureza: 5, resistencia: 6, ...TC });
const METAIS = [
  ["cobalto", "Cobalto", "Cobalt", "#2376dd"], ["ferro_porco", "Ferro-Porco", "Pig Iron", "#f0a8a4"], ["hepatizon", "Hepatizão", "Hepatizon", "#60496b"],
  ["manyullyn", "Manyullyn", "Manyullyn", "#9261cc"], ["slime_rainha", "Slime da Rainha", "Queen's Slime", "#809912"], ["aco_slime", "Aço de Slime", "Slimesteel", "#46ecd3"],
  ["slime_brasa", "Slime de Brasa", "Cinderslime", "#cf7337"], ["slime_cavaleiro", "Slime-Cavaleiro", "Knightslime", "#c472ff"],
];
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 45,
  mod: "Tinkers' Construct",
  itens: [
    ...METAIS.map(([id, pt, en, cor]) => lingote(id, pt, en, cor)),
    { id: "cobalto_bruto", pt: "Cobalto Bruto", en: "Raw Cobalt", icone: "pepita:#2376dd", ...TC },
    { id: "pepita_cobalto", pt: "Pepita de Cobalto", en: "Cobalt Nugget", icone: "pepita:#2376dd", ...TC },
    { id: "osso_necrotico", pt: "Osso Necrótico", en: "Necrotic Bone", icone: "bola:#3a3a3a", ...TC },
    { id: "osso_blaze", pt: "Osso de Blaze", en: "Blazing Bone", icone: "bola:#e8a33c", ...TC },
    { id: "osso_venenoso", pt: "Osso Venenoso", en: "Venombone", icone: "bola:#7a9a3a", ...TC },
    { id: "tijolo_chamuscado", pt: "Tijolo Chamuscado", en: "Scorched Brick", icone: "tijolo:#4a3a30", ...TC },
  ],
  blocos: [
    { id: "minerio_cobalto", pt: "Minério de Cobalto", en: "Cobalt Ore", tipo: "cubo", cor: "#2376dd", padrao: "pintas", dureza: 3, resistencia: 3, loot: "loot_tables/cl/minerio_cobalto.json", ...TC },
    ...METAIS.map(([id, pt, en, cor]) => bloco(id, pt, en, cor)),
    { id: "bloco_cobalto_bruto", pt: "Bloco de Cobalto Bruto", en: "Block of Raw Cobalt", tipo: "cubo", cor: "#2376dd", padrao: "pintas", dureza: 5, ...TC },
    { id: "nahuatl", pt: "Nahuatl", en: "Nahuatl", tipo: "cubo", cor: "#3b2754", padrao: "liso", dureza: 25, resistencia: 400, ...TC },
  ],
  receitas: [
    ...METAIS.flatMap(([id]) => [
      { id: `bloco_${id}`, tipo: "shapeless", ingredientes: Array(9).fill(`cl:lingote_${id}`), resultado: `cl:bloco_${id}` },
      { id: `lingote_${id}_do_bloco`, tipo: "shapeless", ingredientes: [`cl:bloco_${id}`], resultado: `cl:lingote_${id}`, qtd: 9 },
    ]),
    { id: "lingote_cobalto_pepitas", tipo: "shapeless", ingredientes: Array(9).fill("cl:pepita_cobalto"), resultado: "cl:lingote_cobalto" },
    { id: "pepitas_cobalto", tipo: "shapeless", ingredientes: ["cl:lingote_cobalto"], resultado: "cl:pepita_cobalto", qtd: 9 },
    { id: "bloco_cobalto_bruto", tipo: "shapeless", ingredientes: Array(9).fill("cl:cobalto_bruto"), resultado: "cl:bloco_cobalto_bruto" },
    { id: "cobalto_bruto_do_bloco", tipo: "shapeless", ingredientes: ["cl:bloco_cobalto_bruto"], resultado: "cl:cobalto_bruto", qtd: 9 },
  ],
  dados: {
    // Ligas do TC3 (smeltery/alloys): metal em mB do pack (144 por lingote = 90 do mod × 1,6); o resto como no mod.
    ligas: [
      { entra: { ferro: 144, sopa_carne: 500, mel: 250 }, sai: ["ferro_porco", 288] },
      { entra: { cobre: 288, cobalto: 144, quartzo: 100 }, sai: ["hepatizon", 288] },
      { entra: { cobalto: 432, detrito: 144 }, sai: ["manyullyn", 576] },
      { entra: { cobalto: 144, ouro: 144, magma: 250 }, sai: ["slime_rainha", 288] },
      { entra: { ferro: 144, slime_ceu: 250, pedra_refrataria: 250 }, sai: ["aco_slime", 288] },
      { entra: { ouro: 144, icor: 250, pedra_chamuscada: 250 }, sai: ["slime_brasa", 288] },
      { entra: { cobalto: 144, slime_ender: 250, obsidiana: 250 }, sai: ["slime_cavaleiro", 288] },
      { entra: { agua: 250, lava: 100 }, sai: ["obsidiana", 100] },
    ],
    // O que derrete (item -> [líquido, mB]); os metais novos entram no mesmo esquema dos de antes.
    derrete: {
      "cl:lingote_cobalto": ["cobalto", 144], "cl:pepita_cobalto": ["cobalto", 16], "cl:cobalto_bruto": ["cobalto", 288], "cl:minerio_cobalto": ["cobalto", 288],
      "cl:bloco_cobalto": ["cobalto", 1296], "cl:bloco_cobalto_bruto": ["cobalto", 2592],
      ...Object.fromEntries(["ferro_porco", "hepatizon", "manyullyn", "slime_rainha", "aco_slime", "slime_brasa", "slime_cavaleiro"].flatMap((m) => [[`cl:lingote_${m}`, [m, 144]], [`cl:bloco_${m}`, [m, 1296]]])),
      "cl:lingote_osmio": ["osmio", 144], "cl:lingote_aluminio": ["aluminio", 144], "cl:lingote_zinco": ["zinco", 144], "cl:lingote_latao": ["latao", 144],
      "minecraft:netherite_scrap": ["detrito", 144], "minecraft:ancient_debris": ["detrito", 288],
      "minecraft:quartz": ["quartzo", 100], "minecraft:quartz_block": ["quartzo", 400],
      "minecraft:clay_ball": ["argila", 250], "minecraft:clay": ["argila", 1000], "minecraft:brick": ["argila", 250],
      "minecraft:obsidian": ["obsidiana", 1000], "minecraft:magma_cream": ["magma", 250], "minecraft:magma": ["magma", 1000],
      "minecraft:honey_bottle": ["mel", 250], "minecraft:honey_block": ["mel", 1000],
      "minecraft:spider_eye": ["veneno", 250], "minecraft:fermented_spider_eye": ["veneno", 500],
      "cl:tijolo_refratario": ["pedra_refrataria", 250], "cl:tijolo_chamuscado": ["pedra_chamuscada", 250],
    },
    // Derreter bicho (entity_melting): animais de fazenda no interior da Fundição viram sopa de carne (50 mB por golpe).
    bichos: { "minecraft:cow": "sopa_carne", "minecraft:pig": "sopa_carne", "minecraft:sheep": "sopa_carne", "minecraft:chicken": "sopa_carne", "minecraft:rabbit": "sopa_carne", "minecraft:mooshroom": "sopa_carne", "minecraft:goat": "sopa_carne" },
    sopaPorGolpe: 50,
    // Materiais compostos do TC3 (tools/materials/composite): peça de `de` na Mesa de Fundição + líquido (por unidade de
    // material da peça) -> a mesma peça de `vira`.
    compostos: [
      { de: "pedra", liquido: "argila", mb: 125, vira: "pedra_refrataria" },
      { de: "silex", liquido: "magma", mb: 125, vira: "pedra_chamuscada" },
      { de: "madeira", liquido: "obsidiana", mb: 250, vira: "nahuatl" },
      { de: "pedra", liquido: "estanho", mb: 144, vira: "pedra_branca" },
      { de: "pedra", liquido: "aluminio", mb: 144, vira: "pedra_branca" },
      { de: "pedra", liquido: "zinco", mb: 144, vira: "pedra_branca" },
      { de: "osso", liquido: "veneno", mb: 250, vira: "osso_venenoso" },
      { de: "corda", liquido: "obsidiana", mb: 250, vira: "linha_negra" },
      { de: "corda", liquido: "ouro_rosa", mb: 144, vira: "ouro_rosa" },
      { de: "osso_necrotico", liquido: "sangue_blaze", mb: 200, vira: "osso_blaze" },
      { de: "madeira", liquido: "slime", mb: 250, vira: "madeira_slime" },
      { de: "madeira_slime", liquido: "latao", mb: 144, vira: "madeira_slime_revestida" },
    ],
    // Bacia: tábua + 250 mB de obsidiana = Nahuatl (casting/obsidian/nahuatl).
    bacia: [{ base: "planks", liquido: "obsidiana", mb: 250, vira: "cl:nahuatl" }],
    // Esqueleto Wither: os ossos viram Osso Necrótico (loot_modifiers/wither_bone).
    ossoWither: "cl:osso_necrotico",
  },
  textos: {
    ...Object.fromEntries(Object.entries(TRACOS).map(([id, t]) => [`cl.tc.traco.${id}`, [t.pt, t.en]])),
    ...Object.fromEntries(Object.entries(TRACOS).map(([id, t]) => [`cl.tc.tracodesc.${id}`, [t.dpt || t.den, t.den]])),
    "cl.tc.traco_linha": ["§d%s%s", "§d%s%s"],
    "cl.tc.slime": ["§aSlime extra: %s/%s", "§aOverslime: %s/%s"],
    "cl.tc.escudo": ["§7Escudo de pedra: %s", "§7Stoneshield: %s"],
    "cl.tc.mordida": ["Uma mordida na ferramenta (Saboroso).", "A bite of the tool (Tasty)."],
    "cl.tc.tracos": ["Traços desta ferramenta", "This tool's traits"],
    "cl.tc.tracos_corpo": ["Os traços vêm do material da cabeça, do da ligação e do tipo da ferramenta (como no Tinkers' Construct 3).", "Traits come from the head material, the binding material and the tool type (as in Tinkers' Construct 3)."],
    "cl.tc.sem_pecas": ["Sem peças para montar. Picareta: cabeça de picareta + cabo + ligamento; Espada: lâmina pequena + 2 cabos; Machado de Mão: cabeça de machado pequeno + cabo + ligamento; as grandes (Marreta, Martelo de Mineração, Escavadeira, Machado Grande, Foice, Espadão) usam cabos resistentes, colares resistentes e placas grandes. Veja no Catálogo.", "No parts to build with. Pickaxe: pick head + handle + binding; Sword: small blade + 2 handles; Hand Axe: small axe head + handle + binding; the big ones (Sledge Hammer, Vein Hammer, Excavator, Broad Axe, Scythe, Cleaver) use tough handles, tough collars and large plates. See the Catalog."],
    "cl.tc.pecas_falta": ["Falta material: precisa de %s de um material que faça esta peça (metal só na Fundição).", "Not enough material: needs %s of a material that makes this part (metal only at the Smeltery)."],
    "cl.fun.composto": ["%s virou %s.", "%s became %s."],
    "cl.fun.metal.sopa_carne": ["Sopa de Carne", "Meat Soup"], "cl.fun.metal.mel": ["Mel", "Honey"], "cl.fun.metal.quartzo": ["Quartzo Derretido", "Molten Quartz"],
    "cl.fun.metal.detrito": ["Detrito Derretido", "Molten Debris"], "cl.fun.metal.argila": ["Argila Derretida", "Molten Clay"], "cl.fun.metal.obsidiana": ["Obsidiana Derretida", "Molten Obsidian"],
    "cl.fun.metal.magma": ["Magma", "Magma"], "cl.fun.metal.veneno": ["Veneno", "Venom"], "cl.fun.metal.pedra_refrataria": ["Pedra Carbonizada Derretida", "Molten Seared Stone"],
    "cl.fun.metal.pedra_chamuscada": ["Pedra Chamuscada Derretida", "Molten Scorched Stone"], "cl.fun.metal.slime_ceu": ["Slime do Céu", "Sky Slime"],
    "cl.fun.metal.slime_ender": ["Slime do Ender", "Ender Slime"], "cl.fun.metal.icor": ["Icor", "Ichor"], "cl.fun.metal.sangue_blaze": ["Sangue de Blaze", "Blazing Blood"],
    "cl.fun.metal.slime": ["Slime", "Slime"], "cl.fun.metal.agua": ["Água", "Water"], "cl.fun.metal.lava": ["Lava", "Lava"],
    ...Object.fromEntries(METAIS.map(([id, pt, en]) => [`cl.fun.metal.${id}`, [pt, en]])),
    "cl.fun.metal.osmio": ["Ósmio", "Osmium"], "cl.fun.metal.aluminio": ["Alumínio", "Aluminum"], "cl.fun.metal.zinco": ["Zinco", "Zinc"], "cl.fun.metal.latao": ["Latão", "Brass"],
    "cl.fun.cat_liga": ["Liga do Tinkers 3 (os líquidos se juntam sozinhos na Fundição)", "Tinkers 3 alloy (the fluids combine by themselves in the Smeltery)"],
    "cl.fun.cat_composto_n": ["Material composto: peça na Mesa de Fundição + %s mB de %s", "Composite material: part on the Casting Table + %s mB of %s"],
    "cl.fun.cat_liga_sopa": ["Liga do Tinkers 3. Sopa de carne: 500 mB, de animais de fazenda dentro da Fundição (50 mB por golpe)", "Tinkers 3 alloy. Meat soup: 500 mB, from farm animals inside the Smeltery (50 mB per hit)"],
    "cl.fun.cat_composto": ["Material composto: peça na Mesa de Fundição + o líquido (por unidade de material da peça)", "Composite material: part on the Casting Table + the fluid (per material unit of the part)"],
    "cl.capitulo.tinkers3.nome": ["Tinkers' Construct 3", "Tinkers' Construct 3"],
    "cl.capitulo.tinkers3.curto": ["Tinkers 3", "Tinkers 3"],
    "cl.capitulo.tinkers3.desc": ["O Tinkers de hoje: 30 materiais com traços, ferramentas novas (Martelo de Mineração, Chibanca, Picarenxó, Kama, Foice, Adaga, Espadão), cobalto no Nether e as ligas fortes (Ferro-Porco, Hepatizão, Manyullyn, Slime da Rainha).", "Today's Tinkers: 30 materials with traits, new tools (Vein Hammer, Mattock, Pickadze, Kama, Scythe, Dagger, Cleaver), cobalt in the Nether and the strong alloys (Pig Iron, Hepatizon, Manyullyn, Queen's Slime)."],
    ...missao("tc3_colher", "Colheita", "Harvest", "Colha 8 plantas maduras tocando nelas com uma Kama ou Foice (replanta sozinha).", "Harvest 8 mature crops by tapping them with a Kama or Scythe (it replants)."),
    ...missao("tc3_composto", "Material composto", "Composite material", "Ponha uma peça na Mesa de Fundição e derrame um líquido: peça de pedra + argila vira pedra carbonizada, de madeira + obsidiana vira nahuatl...", "Put a part on the Casting Table and pour a fluid: stone part + clay becomes seared stone, wood + obsidian becomes nahuatl..."),
    ...missao("tc3_ferro_porco", "Ferro-Porco", "Pig Iron", "Faça Ferro-Porco: ferro + sopa de carne (animais na Fundição) + mel. Ferramentas dele são Saborosas.", "Make Pig Iron: iron + meat soup (animals in the Smeltery) + honey. Its tools are Tasty."),
    ...missao("tc3_cobalto", "Cobalto", "Cobalt", "Ache Minério de Cobalto no Nether (picareta de ferro) e faça 4 lingotes.", "Find Cobalt Ore in the Nether (iron pickaxe) and make 4 ingots."),
    ...missao("tc3_manyullyn", "Manyullyn", "Manyullyn", "Faça Manyullyn: 3 de cobalto + 1 de detrito antigo na Fundição.", "Make Manyullyn: 3 cobalt + 1 ancient debris in the Smeltery."),
    ...missao("tc3_cabeca", "Decapitação", "Severing", "Tire a cabeça de um monstro com o Espadão.", "Get a mob's head with the Cleaver."),
  },
};

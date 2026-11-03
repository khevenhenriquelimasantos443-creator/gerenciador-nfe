// Fase 29 (1.8.0): Ender IO. Números do Ender IO 5.2 (o código público, de 1.12: as receitas da Fundidora de Ligas
// e do Moinho SAG em alloying.xml/sagmill.xml, os bancos de capacitores em CapBankConfig, os painéis em SolarConfig,
// o Aço Negro em EquipmentData). Onde a receita de 1.12 pedia algo que não existe aqui (Pó do Infinito, que nasce de
// fogo em rocha matriz, e os corantes de máquina), vale a receita do Ender IO de 1.7.10 (chassi com capacitor).
// Energia: 1 E = 4.000 RF. Scripts em scripts/maquinas/enderio.ts.
// 1.20.0: atualizado para o Ender IO 9 (o mais novo): os nomes (Aço Sombrio, Liga Condutiva...), as receitas, os
// painéis e os bancos vêm de enderio.json (tools/importar-enderio.py); aqui ficam só os itens de antes e o que o
// Ender IO 9 não tem (Aço Elétrico, ferramentas e armadura de Aço Sombrio).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const EIO9 = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "enderio.json"), "utf8"));
const NOVAS = new Set(EIO9.receitas.map((r) => r.resultado));
const renomeado = (x) => {
  const n = EIO9.renomear[x.id];
  return n ? { ...x, pt: n[0], en: n[1] } : x;
};
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 100, ...extra });
const LIGAS = [
  ["aco_eletrico", "Aço Elétrico", "Electrical Steel", "#b9bec4"],
  ["liga_energetica", "Liga Energética", "Energetic Alloy", "#f0a23a"],
  ["liga_vibrante", "Liga Vibrante", "Vibrant Alloy", "#a8e04a"],
  ["liga_redstone", "Liga de Redstone", "Redstone Alloy", "#c43a3a"],
  ["ferro_condutor", "Ferro Condutor", "Conductive Iron", "#d9a0a0"],
  ["ferro_pulsante", "Ferro Pulsante", "Pulsating Iron", "#6fd6a8"],
  ["aco_negro", "Aço Sombrio", "Dark Steel", "#3c3f44"],
];
const BANCOS = [
  ["basico", "Básico", "Basic", "branco", 250],
  ["", "", "", "vermelho", 1250],
  ["vibrante", "Vibrante", "Vibrant", "verde", 6250],
];
const PAINEIS = [
  ["", "", "", "amarelo", 10],
  ["avancado", "Avançado", "Advanced", "laranja", 40],
  ["vibrante", "Vibrante", "Vibrant", "verde", 160],
];
const sufixo = (s) => (s ? `_${s}` : "");
// Aço Negro (EquipmentData do Ender IO): nível 3, 2.000 usos, eficiência 8, dano 3, encantabilidade 25;
// armadura com durabilidade 35 e proteção 2/6/5/2 (cabeça, peito, pernas, pés), encantabilidade 15.
const DIGGER = {
  pickaxe: "'stone', 'metal', 'rail', 'minecraft:is_pickaxe_item_destructible'",
  axe: "'wood', 'log', 'pumpkin', 'plant', 'minecraft:is_axe_item_destructible'",
  sword: "'minecraft:is_sword_item_destructible'",
};
const ferramenta = (id, pt, en, ic, base, slot, tag) => ({
  id: `eio_${id}_aco_negro`, pt: `${pt} de Aço Sombrio`, en: `Dark Steel ${en}`, icone: `ferramenta:${ic}:#3c3f44`, pilha: 1, cat: "equipment",
  comp: {
    "minecraft:hand_equipped": true,
    "minecraft:durability": { max_durability: 2000 },
    "minecraft:damage": { value: 3 + base },
    "minecraft:enchantable": { slot, value: 25 },
    "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: { tags: `query.any_tag(${DIGGER[slot]})` }, speed: slot === "sword" ? 15 : 8 }] },
    "minecraft:tags": { tags: [tag, ...(slot === "sword" ? [] : ["minecraft:is_tool"]), "minecraft:diamond_tier", "cl:mk_ferramenta"] },
  },
});
const armadura = (id, pt, en, ic, slot, eslot, mult, prot) => ({
  id: `eio_${id}_aco_negro`, pt: `${pt} de Aço Sombrio`, en: `Dark Steel ${en}`, icone: `${ic}:#3c3f44`, pilha: 1, cat: "equipment",
  comp: {
    "minecraft:wearable": { slot, protection: prot },
    "minecraft:durability": { max_durability: 35 * mult },
    "minecraft:enchantable": { slot: eslot, value: 15 },
    "minecraft:tags": { tags: ["minecraft:is_armor", "cl:mk_armadura"] },
  },
});

const F29 = {
  fase: 29,
  mod: "Ender IO",
  itens: [
    { id: "po_carvao", pt: "Carvão Pulverizado", en: "Pulverized Coal", icone: "po:#2b2b2b" },
    ...LIGAS.map(([id, pt, en, cor]) => ({ id, pt: `Lingote de ${pt}`, en: `${en} Ingot`, icone: `lingote:${cor}` })),
    { id: "cristal_pulsante", pt: "Cristal Pulsante", en: "Pulsating Crystal", icone: "cristal:#6fd6a8" },
    { id: "composto_aglutinante", pt: "Composto Aglutinante", en: "Binder Composite", icone: "po:#a89b84" },
    { id: "aglutinante_conduite", pt: "Aglutinante de Conduíte", en: "Conduit Binder", icone: "tijolo:#b8a88c" },
    { id: "capacitor_basico", pt: "Capacitor Básico", en: "Basic Capacitor", icone: "celula:#7dffa8" },
    { id: "capacitor_duplo", pt: "Capacitor de Camada Dupla", en: "Double-Layer Capacitor", icone: "celula:#ffa142" },
    { id: "capacitor_octadico", pt: "Capacitor Octádico", en: "Octadic Capacitor", icone: "celula:#c08cff" },
    { id: "engrenagem_aco_negro", pt: "Engrenagem de Aço Negro", en: "Dark Bimetal Gear", icone: "engrenagem:#3c3f44" },
    { id: "placa_fotovoltaica", pt: "Placa Fotovoltaica", en: "Photovoltaic Plate", icone: "placa:#2a3f6a" },
    ferramenta("picareta", "Picareta", "Pickaxe", "picareta", 2, "pickaxe", "minecraft:is_pickaxe"),
    ferramenta("machado", "Machado", "Axe", "machadinha", 3, "axe", "minecraft:is_axe"),
    ferramenta("espada", "Espada", "Sword", "espada_larga", 4, "sword", "minecraft:is_sword"),
    armadura("capacete", "Capacete", "Helmet", "capacete", "slot.armor.head", "armor_head", 11, 2),
    armadura("peitoral", "Peitoral", "Chestplate", "peitoral", "slot.armor.chest", "armor_torso", 16, 6),
    armadura("calcas", "Calças", "Leggings", "calcas", "slot.armor.legs", "armor_legs", 15, 5),
    armadura("botas", "Botas", "Boots", "botas", "slot.armor.feet", "armor_feet", 13, 2),
  ],
  blocos: [
    { id: "chassi_maquina", pt: "Chassi de Máquina", en: "Machine Chassis", tipo: "maquina", luz: "branco", glifo: "grade", girar: false },
    maq("fundidora_ligas", "Fundidora de Ligas", "Alloy Smelter", "laranja", "chama"),
    maq("moinho_sag", "Moinho SAG", "SAG Mill", "vermelho", "engrenagem"),
    maq("gerador_stirling", "Gerador Stirling", "Stirling Generator", "laranja", "chama"),
    ...PAINEIS.map(([id, pt, en, luz]) => maq(`painel_fotovoltaico${sufixo(id)}`, `Painel Fotovoltaico${pt ? ` ${pt}` : ""}`, `${en ? `${en} ` : ""}Photovoltaic Cell`, luz, "floco")),
    ...BANCOS.map(([id, pt, en, luz]) => ({
      id: `banco_capacitores${sufixo(id)}`, pt: `Banco de Capacitores${pt ? ` ${pt}` : ""}`, en: `${en ? `${en} ` : ""}Capacitor Bank`,
      tipo: "maquina", luz, glifo: "raio", comp: "cl:celula_energia", girar: false, loot: "loot_tables/cl/vazio.json",
    })),
    { id: "ancora_viagem", pt: "Âncora de Viagem", en: "Travel Anchor", tipo: "maquina", luz: "violeta", glifo: "circulo", comp: "cl:ancora_viagem", girar: false },
  ],
  receitas: [
    { id: "composto_aglutinante", tipo: "shaped", padrao: ["GCG", "SGS", "GCG"], chave: { G: "minecraft:gravel", C: "minecraft:clay_ball", S: "minecraft:sand" }, resultado: "cl:composto_aglutinante", qtd: 8 },
    { id: "aglutinante_conduite", tipo: "furnace", entrada: "cl:composto_aglutinante", resultado: "cl:aglutinante_conduite" },
    { id: "capacitor_basico", tipo: "shaped", padrao: [" N ", "NCN", "R R"], chave: { N: "minecraft:gold_nugget", C: "minecraft:copper_ingot", R: "minecraft:redstone" }, resultado: "cl:capacitor_basico" },
    { id: "capacitor_duplo", tipo: "shaped", padrao: [" E ", "CPC", " E "], chave: { E: "cl:liga_energetica", C: "cl:capacitor_basico", P: "cl:po_carvao" }, resultado: "cl:capacitor_duplo" },
    { id: "capacitor_octadico", tipo: "shaped", padrao: [" V ", "CGC", " V "], chave: { V: "cl:liga_vibrante", C: "cl:capacitor_duplo", G: "minecraft:glowstone" }, resultado: "cl:capacitor_octadico" },
    { id: "cristal_pulsante", tipo: "shaped", padrao: [" P ", "PDP", " P "], chave: { P: "cl:ferro_pulsante", D: "minecraft:diamond" }, resultado: "cl:cristal_pulsante" },
    { id: "engrenagem_aco_negro", tipo: "shaped", padrao: [" X ", "XIX", " X "], chave: { X: "cl:aco_negro", I: "cl:engrenagem_ferro" }, resultado: "cl:engrenagem_aco_negro" },
    { id: "chassi_maquina", tipo: "shaped", padrao: ["BIB", "ICI", "BIB"], chave: { B: "minecraft:iron_bars", I: "minecraft:iron_ingot", C: "cl:capacitor_basico" }, resultado: "cl:chassi_maquina" },
    { id: "fundidora_ligas", tipo: "shaped", padrao: ["IFI", "FCF", "GKG"], chave: { I: "minecraft:iron_ingot", F: "minecraft:furnace", C: "cl:chassi_maquina", G: "cl:engrenagem_pedra", K: "minecraft:cauldron" }, resultado: "cl:fundidora_ligas" },
    { id: "moinho_sag", tipo: "shaped", padrao: ["FFF", "ICI", "GPG"], chave: { F: "minecraft:flint", I: "minecraft:iron_ingot", C: "cl:chassi_maquina", G: "cl:engrenagem_pedra", P: "minecraft:piston" }, resultado: "cl:moinho_sag" },
    { id: "gerador_stirling", tipo: "shaped", padrao: ["SFS", "DCD", "GPG"], chave: { S: "minecraft:stone_bricks", F: "minecraft:furnace", D: "cl:aco_negro", C: "cl:chassi_maquina", G: "cl:engrenagem_aco_negro", P: "minecraft:piston" }, resultado: "cl:gerador_stirling" },
    { id: "painel_fotovoltaico", tipo: "shaped", padrao: ["EGE", "PPP", "CDC"], chave: { E: "cl:aco_eletrico", G: "minecraft:glass", P: "cl:placa_fotovoltaica", C: "cl:capacitor_basico", D: "minecraft:daylight_detector" }, resultado: "cl:painel_fotovoltaico" },
    { id: "painel_fotovoltaico_avancado", tipo: "shaped", padrao: ["EQE", "PSP", "CDC"], chave: { E: "cl:liga_energetica", Q: "minecraft:quartz_block", P: "cl:placa_fotovoltaica", S: "cl:painel_fotovoltaico", C: "cl:capacitor_duplo", D: "minecraft:daylight_detector" }, resultado: "cl:painel_fotovoltaico_avancado" },
    { id: "painel_fotovoltaico_vibrante", tipo: "shaped", padrao: ["VQV", "PSP", "CDC"], chave: { V: "cl:liga_vibrante", Q: "minecraft:glowstone", P: "cl:placa_fotovoltaica", S: "cl:painel_fotovoltaico_avancado", C: "cl:capacitor_octadico", D: "minecraft:daylight_detector" }, resultado: "cl:painel_fotovoltaico_vibrante" },
    { id: "banco_capacitores_basico", tipo: "shaped", padrao: ["ICI", "CRC", "ICI"], chave: { I: "minecraft:iron_ingot", C: "cl:capacitor_basico", R: "minecraft:redstone_block" }, resultado: "cl:banco_capacitores_basico" },
    { id: "banco_capacitores", tipo: "shaped", padrao: ["ICI", "CBC", "ICI"], chave: { I: "minecraft:iron_ingot", C: "cl:capacitor_duplo", B: "cl:banco_capacitores_basico" }, resultado: "cl:banco_capacitores" },
    { id: "banco_capacitores_vibrante", tipo: "shaped", padrao: ["VCV", "CBC", "VCV"], chave: { V: "cl:liga_vibrante", C: "cl:capacitor_octadico", B: "cl:banco_capacitores" }, resultado: "cl:banco_capacitores_vibrante" },
    { id: "ancora_viagem", tipo: "shaped", padrao: ["IBI", "BCB", "IBI"], chave: { I: "minecraft:iron_ingot", B: "cl:aglutinante_conduite", C: "cl:cristal_pulsante" }, resultado: "cl:ancora_viagem" },
    ...[["picareta", ["XXX", " T ", " T "]], ["machado", ["XX", "XT", " T"]], ["espada", ["X", "X", "T"]], ["capacete", ["XXX", "X X"]], ["peitoral", ["X X", "XXX", "XXX"]], ["calcas", ["XXX", "X X", "X X"]], ["botas", ["X X", "X X"]]].map(([p, padrao]) => ({
      id: `eio_${p}_aco_negro`, tipo: "shaped", padrao, chave: { X: "cl:aco_negro", T: "minecraft:stick" }, resultado: `cl:eio_${p}_aco_negro`,
    })),
  ],
  textos: {
    "cl.eio.fundidora": ["Fundição de Ligas: os ingredientes no baú de cima e a liga sai embaixo (as receitas do Ender IO 9 estão no Catálogo: Liga Condutiva = ferro + cobre; de Redstone = redstone + cobre; Energética = redstone + Liga Condutiva + glowstone; Vibrante = Energética + pérola + Grãos do Infinito; Pulsante = ferro + pérola; Aço Sombrio = ferro + pó de carvão + obsidiana; Almário = areia das almas + ouro; Aço do End = pedra do End + Aço Sombrio + obsidiana).", "Alloy Smelter: ingredients in the chest above, the alloy comes out below (the Ender IO 9 recipes are in the Catalog: Conductive = iron + copper; Redstone = redstone + copper; Energetic = redstone + Conductive + glowstone; Vibrant = Energetic + pearl + Grains of Infinity; Pulsating = iron + pearl; Dark Steel = iron + coal dust + obsidian; Soularium = soul sand + gold; End Steel = end stone + Dark Steel + obsidian)."],
    "cl.eio.moinho": ["Triturador SAG: minério vira minério bruto extra e pó, carvão vira pó de carvão, pedregulho vira cascalho, flores viram corante... Uma Esfera de Trituração no baú de cima aumenta a saída e gasta menos energia.", "SAG Mill: ore gives extra raw ore and dust, coal becomes coal dust, cobblestone becomes gravel, flowers become dye... A Grinding Ball in the chest above raises the output and uses less power."],
    "cl.eio.stirling": ["Gerador Stirling: combustível de fornalha no baú de cima, 40 RF/t (o carvão dura 480 ticks). Agora: %s.", "Stirling Generator: furnace fuel in the chest above, 40 RF/t (coal lasts 480 ticks). Now: %s."],
    "cl.eio.painel": ["Módulo Fotovoltaico: de dia e com céu aberto, %s. Agora: %s.", "Photovoltaic Module: by day under open sky, %s. Now: %s."],
    "cl.eio.ancora.titulo": ["Âncora de Viagem", "Travel Anchor"],
    "cl.eio.ancora.corpo": ["Escolha outra âncora a até 96 blocos para viajar até ela.", "Pick another anchor within 96 blocks to travel to it."],
    "cl.eio.ancora.nenhuma": ["Nenhuma outra Âncora de Viagem a até 96 blocos.", "No other Travel Anchor within 96 blocks."],
    "cl.eio.ancora.item": ["Âncora em %s, %s, %s (%s m)", "Anchor at %s, %s, %s (%s m)"],
    "cl.capitulo.enderio.nome": ["Ender IO", "Ender IO"],
    "cl.capitulo.enderio.curto": ["Ender IO", "Ender IO"],
    "cl.capitulo.enderio.desc": ["Ender IO 9: ligas na Fundição de Ligas, o Triturador SAG, geradores, módulos fotovoltaicos, bancos de capacitores, máquinas de almas, o Crisol de Fermentação, obeliscos, a Estação Agrícola, Âncoras e Cajado de Viagem.", "Ender IO 9: alloys in the Alloy Smelter, the SAG Mill, generators, photovoltaic modules, capacitor banks, soul machines, the VAT, obelisks, the Farming Station, Travel Anchors and the Staff of Travelling."],
    "cl.missao.eio_capacitor.titulo": ["Capacitor", "Capacitor"], "cl.missao.eio_capacitor.desc": ["Faça um Capacitor Básico.", "Make a Basic Capacitor."],
    "cl.missao.eio_fundidora.titulo": ["Fundição de Ligas", "Alloy Smelter"], "cl.missao.eio_fundidora.desc": ["Coloque uma Fundição de Ligas.", "Place an Alloy Smelter."],
    "cl.missao.eio_aco_eletrico.titulo": ["Liga Condutiva", "Conductive Alloy"], "cl.missao.eio_aco_eletrico.desc": ["Junte 8 Lingotes de Liga Condutiva (ferro + cobre na Fundição de Ligas).", "Collect 8 Conductive Alloy Ingots (iron + copper in the Alloy Smelter)."],
    "cl.missao.eio_aco_negro.titulo": ["Aço Sombrio", "Dark Steel"], "cl.missao.eio_aco_negro.desc": ["Junte 8 Lingotes de Aço Sombrio.", "Collect 8 Dark Steel Ingots."],
    "cl.missao.eio_vibrante.titulo": ["Liga Vibrante", "Vibrant Alloy"], "cl.missao.eio_vibrante.desc": ["Faça 4 Lingotes de Liga Vibrante.", "Make 4 Vibrant Alloy Ingots."],
    "cl.missao.eio_banco.titulo": ["Banco de Capacitores", "Capacitor Bank"], "cl.missao.eio_banco.desc": ["Coloque um Banco de Capacitores Básico.", "Place a Basic Capacitor Bank."],
    "cl.missao.eio_ancora.titulo": ["Viajante", "Traveler"], "cl.missao.eio_ancora.desc": ["Viaje entre duas Âncoras de Viagem.", "Travel between two Travel Anchors."],
    "cl.missao.eio_painel.titulo": ["Sol vibrante", "Vibrant sun"], "cl.missao.eio_painel.desc": ["Coloque um Módulo Fotovoltaico Vibrante.", "Place a Vibrant Photovoltaic Module."],
  },
};
export default {
  ...F29,
  itens: F29.itens.map(renomeado),
  blocos: F29.blocos.map(renomeado),
  // As receitas do Ender IO 9 (f40) tomam o lugar das de antes; ficam o Aço Elétrico e as ferramentas de Aço Sombrio.
  receitas: F29.receitas.filter((r) => !NOVAS.has(r.resultado)),
  dados: {
    // Ender IO 9 (EnergyConfig): bancos de 500.000, 2.000.000 e 4.000.000 RF; módulos de 4, 16 e 64 RF/t.
    bancos: Object.fromEntries(Object.entries(EIO9.numeros.bancos).map(([id, rf]) => [`cl:${id}`, rf / 4000])),
    paineis: Object.fromEntries(Object.entries(EIO9.numeros.solar).map(([id, rft]) => [`cl:${id}`, rft])),
  },
};

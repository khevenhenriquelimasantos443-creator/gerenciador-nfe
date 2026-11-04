// Fase 47 (1.28.0): Tinkers' Construct 3 completo, parte 3 — armaduras, escudos, arcos e arremessáveis (SlimeKnights,
// MIT, inclusive a arte; números e arte por tools/importar-tinkers3-armas.py em tinkers3_armas.json).
// No TC3 a armadura e o arco se montam com peças na Bigorna; aqui saem na bancada com o material (o Bedrock não deixa
// a peça carregar o material numa receita), com os números de cada material do mod: proteção e durabilidade de cada
// placa, durabilidade, força e velocidade de puxar de cada braço de arco. Escudo: na mão secundária, agachado, segura o
// golpe (Viajante: Resistência I; Placa: Resistência II). Traje de Slime: as botas quicam e não deixam se machucar na
// queda; as Slimélitros planam. Scripts em scripts/tinkers/armas.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "tinkers3_armas.json"), "utf8"));
const TC = { mod: "Tinkers' Construct" };
const PECAS = [
  ["capacete", "Capacete", "Helmet", "slot.armor.head", "armor_head", ["MMM", "MLM"]],
  ["peitoral", "Peitoral", "Chestplate", "slot.armor.chest", "armor_torso", ["MLM", "MMM", "MMM"]],
  ["calcas", "Calças", "Leggings", "slot.armor.legs", "armor_legs", ["MMM", "MLM", "M M"]],
  ["botas", "Botas", "Boots", "slot.armor.feet", "armor_feet", ["MLM", "M M"]],
];
const armadura = (id, pt, en, slot, eslot, prot, dur, icone) => ({
  id, pt, en, icone, pilha: 1, cat: "equipment", ...TC,
  comp: { "minecraft:wearable": { slot, protection: prot }, "minecraft:durability": { max_durability: dur }, "minecraft:enchantable": { slot: eslot, value: 12 }, "minecraft:tags": { tags: ["minecraft:is_armor", "cl:tc_armadura"] } },
});
const escudo = (id, pt, en, dur, icone) => ({
  id, pt, en, icone, pilha: 1, cat: "equipment", ...TC,
  comp: { "minecraft:allow_off_hand": true, "minecraft:durability": { max_durability: dur }, "minecraft:tags": { tags: ["cl:tc_escudo"] } },
});
const r2 = (v) => Math.round(v * 100) / 100;
const arco = (id, pt, en, dur, saque, icone, besta) => ({
  id, pt, en, icone, pilha: 1, cat: "equipment", ...TC,
  comp: {
    "minecraft:hand_equipped": true,
    "minecraft:use_animation": "bow",
    "minecraft:use_modifiers": { use_duration: 3600, movement_modifier: 0.35 },
    "minecraft:shooter": { ammunition: [{ item: "minecraft:arrow", use_offhand: true, search_inventory: true, use_in_creative: true }], max_draw_duration: r2((besta ? 1.25 : 1) / Math.max(0.5, 1 + saque)), scale_power_by_draw_duration: true, charge_on_draw: false },
    "minecraft:durability": { max_durability: dur },
    "minecraft:enchantable": { slot: besta ? "crossbow" : "bow", value: 1 },
    "minecraft:tags": { tags: ["cl:tc_arco"] },
  },
});
const arremesso = (id, pt, en, proj, pilha, icone) => ({
  id, pt, en, icone, pilha, ...TC,
  comp: { "minecraft:throwable": { do_swing_animation: true, launch_power_scale: 1.0, max_launch_power: 1.6 }, "minecraft:projectile": { projectile_entity: proj, minimum_critical_power: 1.0 }, "minecraft:tags": { tags: ["cl:tc_arremesso"] } },
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

const itens = [
  { id: "malha", pt: "Malha", en: "Maille", icone: "pepita:#c8c8c8", ...TC },
  ...Object.entries(D.placa).flatMap(([m, d]) => [
    ...PECAS.map(([p, pt, en, slot, eslot]) => armadura(`${p}_placa_${m}`, `${pt} de Placa de ${d.pt}`, `${d.en} Plate ${en}`, slot, eslot, Math.max(1, Math.round(d[p][0])), d[p][1], `${p}:#999999`)),
    escudo(`escudo_placa_${m}`, `Escudo de Placa de ${d.pt}`, `${d.en} Plate Shield`, d.escudo, "bola:#999999"),
  ]),
  ...PECAS.map(([p, , en, slot, eslot], k) => armadura(`${p}_viajante`, ["Óculos de Viajante", "Colete de Viajante", "Calças de Viajante", "Botas de Viajante"][k], `Traveler's ${["Goggles", "Vest", "Pants", "Boots"][k]}`, slot, eslot, [1, 3, 2, 1][k], [124, 180, 169, 146][k], `${p}:#8b5a2b`)),
  escudo("escudo_viajante", "Escudo de Viajante", "Traveler's Shield", 200, "bola:#8b5a2b"),
  ...PECAS.map(([p, , en, slot, eslot], k) => armadura(`${p}_slime`, ["Crânio de Slime", "Peitoral de Slime", "Calças de Slime", "Botas de Slime"][k], `Slime${["skull", "suit Chestplate", "suit Leggings", " Boots"][k]}`, slot, eslot, [1, 3, 2, 1][k], [220, 320, 300, 260][k], `${p}:#00f4da`)),
  armadura("slimelitros", "Slimélitros", "Slimelytra", "slot.armor.chest", "armor_torso", 1, 222, "bola:#00f4da"),
  ...Object.entries(D.arco).flatMap(([m, d]) => [
    arco(`arco_longo_${m}`, `Arco Longo de ${d.pt}`, `${d.en} Longbow`, Math.round((120 + d.dur * 2) * 1.5), d.saque, "bola:#999999", false),
    arco(`besta_${m}`, `Besta de ${d.pt}`, `${d.en} Crossbow`, Math.round(d.dur * 2), d.saque, "bola:#999999", true),
  ]),
  ...Object.entries(D.arremesso).flatMap(([m, d]) => [
    arremesso(`shuriken_${m}`, `Shuriken de ${d.pt}`, `${d.en} Shuriken`, "cl:shuriken_proj", 16, "bola:#999999"),
    arremesso(`machado_arremesso_${m}`, `Machado de Arremesso de ${d.pt}`, `${d.en} Throwing Axe`, "cl:machado_arremesso_proj", 8, "bola:#999999"),
    arremesso(`dardo_${m}`, `Dardo de ${d.pt}`, `${d.en} Javelin`, "cl:dardo_proj", 1, "bola:#999999"),
  ]),
];

export default {
  fase: 47,
  mod: "Tinkers' Construct",
  itens,
  receitas: [
    { id: "malha", tipo: "shaped", padrao: [" C ", "C C", " C "], chave: { C: "minecraft:chain" }, resultado: "cl:malha" },
    ...Object.entries(D.placa).flatMap(([m, d]) => [
      ...PECAS.map(([p, , , , , padrao]) => ({ id: `${p}_placa_${m}`, tipo: "shaped", padrao, chave: { M: d.item, L: "cl:malha" }, resultado: `cl:${p}_placa_${m}` })),
      { id: `escudo_placa_${m}`, tipo: "shaped", padrao: ["MPM", "MPM", " M "], chave: { M: d.item, P: "#minecraft:planks" }, resultado: `cl:escudo_placa_${m}` },
    ]),
    { id: "capacete_viajante", tipo: "shaped", padrao: ["LCL", "G G"], chave: { L: "minecraft:leather", C: "minecraft:copper_ingot", G: "minecraft:glass" }, resultado: "cl:capacete_viajante" },
    { id: "peitoral_viajante", tipo: "shaped", padrao: ["L L", "LCL", "LLL"], chave: { L: "minecraft:leather", C: "minecraft:copper_ingot" }, resultado: "cl:peitoral_viajante" },
    { id: "calcas_viajante", tipo: "shaped", padrao: ["LCL", "L L", "L L"], chave: { L: "minecraft:leather", C: "minecraft:copper_ingot" }, resultado: "cl:calcas_viajante" },
    { id: "botas_viajante", tipo: "shaped", padrao: ["L L", "C C"], chave: { L: "minecraft:leather", C: "minecraft:copper_ingot" }, resultado: "cl:botas_viajante" },
    { id: "escudo_viajante", tipo: "shaped", padrao: ["LCL", "PPP", " P "], chave: { L: "minecraft:leather", C: "minecraft:copper_ingot", P: "#minecraft:planks" }, resultado: "cl:escudo_viajante" },
    { id: "capacete_slime", tipo: "shaped", padrao: ["SSS", "SBS"], chave: { S: "cl:slime_congelado_ceu", B: "minecraft:bone" }, resultado: "cl:capacete_slime" },
    { id: "peitoral_slime", tipo: "shaped", padrao: ["S S", "SSS", "SSS"], chave: { S: "cl:slime_congelado_ceu" }, resultado: "cl:peitoral_slime" },
    { id: "calcas_slime", tipo: "shaped", padrao: ["SSS", "S S", "S S"], chave: { S: "cl:slime_congelado_ceu" }, resultado: "cl:calcas_slime" },
    { id: "botas_slime", tipo: "shaped", padrao: ["S S", "S S"], chave: { S: "cl:slime_congelado_ceu" }, resultado: "cl:botas_slime" },
    { id: "slimelitros", tipo: "shaped", padrao: ["SMS", "S S"], chave: { S: "cl:slime_congelado_ender", M: "minecraft:phantom_membrane" }, resultado: "cl:slimelitros" },
    ...Object.entries(D.arco).flatMap(([m, d]) => [
      { id: `arco_longo_${m}`, tipo: "shaped", padrao: [" MS", "G S", " MS"], chave: { M: d.item, S: "minecraft:string", G: "minecraft:stick" }, resultado: `cl:arco_longo_${m}` },
      { id: `besta_${m}`, tipo: "shaped", padrao: ["MSM", "STS", " G "], chave: { M: d.item, S: "minecraft:string", T: "minecraft:tripwire_hook", G: "minecraft:stick" }, resultado: `cl:besta_${m}` },
    ]),
    ...Object.entries(D.arremesso).flatMap(([m, d]) => [
      { id: `shuriken_${m}`, tipo: "shaped", padrao: [" M ", "M M", " M "], chave: { M: d.item }, resultado: `cl:shuriken_${m}`, qtd: 4 },
      // Sem formato (as de formato batiam com o machado e a lança do jogo).
      { id: `machado_arremesso_${m}`, tipo: "shapeless", ingredientes: [d.item, d.item, "minecraft:stick", "minecraft:string"], resultado: `cl:machado_arremesso_${m}`, qtd: 2 },
      { id: `dardo_${m}`, tipo: "shapeless", ingredientes: [d.item, "minecraft:stick", "minecraft:stick", "minecraft:feather"], resultado: `cl:dardo_${m}` },
    ]),
  ],
  dados: {
    arcos: Object.fromEntries(Object.entries(D.arco).map(([m, d]) => [m, { vel: d.vel, tier: d.tier }])),
    arremessos: Object.fromEntries(Object.entries(D.arremesso).map(([m, d]) => [m, { dano: d.dano }])),
  },
  textos: {
    "entity.cl:shuriken_proj.name": ["Shuriken", "Shuriken"], "entity.cl:machado_arremesso_proj.name": ["Machado de Arremesso", "Throwing Axe"], "entity.cl:dardo_proj.name": ["Dardo", "Javelin"],
    "cl.tc.escudo_dica": ["Escudo: na mão secundária, agache para segurar os golpes.", "Shield: in the offhand, sneak to block hits."],
    ...missao("tc3_placa", "Armadura de Placa", "Plate Armor", "Faça uma Malha (4 correntes): com ela e o material saem as peças da Armadura de Placa.", "Make a Maille (4 chains): with it and the material you make the Plate Armor pieces."),
    ...missao("tc3_arco", "Arco Longo", "Longbow", "Faça um Arco Longo: o material do braço muda a força e a durabilidade.", "Make a Longbow: the limb material changes power and durability."),
    ...missao("tc3_slime_botas", "Quicar", "Bounce", "Faça as Botas de Slime: caia de qualquer altura sem se machucar.", "Make Slime Boots: fall from any height without getting hurt."),
    ...missao("tc3_shuriken", "Shuriken", "Shuriken", "Acerte um monstro com um Shuriken.", "Hit a mob with a Shuriken."),
  },
};

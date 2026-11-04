// Fase 53 (1.34.0): Farmer's Delight 1.3.0 (o mais novo, MC 26.1; vectorwing, MIT, inclusive a arte). O que o pack
// ainda não tinha: tortas e banquetes em bloco (servidos aos pedaços), bebidas, biscoitos, rolinhos, presunto, ração,
// Solo Rico e Composto Orgânico, colônias de cogumelo, Rede de Segurança, Tatame, Tapete de Lona, Fardo de Arroz,
// armários (a tela de baú do jogo, como os baús grandes), cestos, a Faca de Netherita, a casca de árvore (toras na
// tábua com machado) e as plantas selvagens no mundo. Números de FoodValues.java e receitas do mod, lidos por
// tools/importar-farmers.py (farmers26.json). Scripts em scripts/maquinas/farmers_novo.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "farmers26.json"), "utf8"));
const FD = { mod: "Farmer's Delight" };
const BREVE = 600, CURTA = 1200, MEDIA = 3600, LONGA = 6000;
const nome = (id) => D.nomes[id];
const comida = (id, opc = {}) => {
  const [fome, sat] = D.comidas[id] ?? opc.valores ?? [2, 0.3];
  return {
    id: id.slice(3), pt: nome(id)[0], en: nome(id)[1], icone: "bola:#c08850", pilha: opc.tigela ? 16 : opc.pilha ?? 64, ...FD,
    comp: {
      "minecraft:use_animation": opc.bebida ? "drink" : "eat",
      "minecraft:use_modifiers": { use_duration: opc.rapido ? 0.8 : opc.lento ? 2.4 : 1.6, movement_modifier: 0.35 },
      "minecraft:food": { nutrition: fome, saturation_modifier: sat, ...(opc.sempre ? { can_always_eat: true } : {}), ...(opc.tigela ? { using_converts_to: "minecraft:bowl" } : opc.bebida ? { using_converts_to: "minecraft:glass_bottle" } : {}) },
    },
  };
};
const item = (id, extra = {}) => ({ id: id.slice(3), pt: nome(id)[0], en: nome(id)[1], icone: "bola:#c08850", ...FD, ...extra });
// Blocos de comida: [id, porção, quantas porções, precisa de tigela, textura do topo, textura do lado, modelo]
const TORTAS = [["cl:torta_maca", "cl:fatia_torta_maca", "torta_maca_topo"], ["cl:cheesecake", "cl:fatia_cheesecake", "cheesecake_topo"], ["cl:torta_chocolate", "cl:fatia_torta_chocolate", "torta_chocolate_topo"]];
const BANQUETES = [
  ["cl:frango_assado", "cl:prato_frango_assado", 4, "frango_assado", [[-4, 1, -4], [8, 6, 8]]],
  ["cl:abobora_recheada", "cl:tigela_abobora_recheada", 4, "abobora_recheada", [[-6, 1, -6], [12, 10, 12]]],
  ["cl:presunto_mel", "cl:prato_presunto_mel", 4, "presunto_mel", [[-5, 1, -4], [10, 6, 8]]],
  ["cl:torta_pastor", "cl:prato_torta_pastor", 4, "torta_pastor", [[-6, 1, -6], [12, 5, 12]]],
  ["cl:salada_brilhante", "cl:tigela_salada_brilhante", 4, "salada_brilhante", [[-6, 1, -6], [12, 3, 12]]],
  ["cl:travessa_rolinhos", "cl:fatia_rolo_alga", 8, "travessa_rolinhos", [[-6, 1, -6], [12, 3, 12]]],
];
const MADEIRAS = ["carvalho", "betula", "pinheiro", "selva", "acacia", "carvalho_escuro", "mangue", "cerejeira", "bambu", "carmesim", "distorcido"];
const SELVAGENS = ["repolho_selvagem", "tomateiro_selvagem", "cebola_selvagem", "cenoura_selvagem", "batata_selvagem", "beterraba_marinha", "arroz_selvagem", "arbusto_arenoso"];
const planta = (id, extra = {}) => ({
  id, pt: nome(`cl:${id}`)[0], en: nome(`cl:${id}`)[1], tipo: "cubo", cor: "#6a9a3a", dureza: 0, loot: `loot_tables/cl/fd/${id}.json`, ...FD, ...extra,
  extra: {
    "minecraft:geometry": "geometry.cl.planta", "minecraft:material_instances": { "*": { texture: `clc_${id}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
    "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 10, 12] }, "minecraft:light_dampening": 0, ...(extra.extra ?? {}),
  },
});

export default {
  fase: 53,
  mod: "Farmer's Delight",
  itens: [
    comida("cl:presunto"), comida("cl:presunto_defumado"), comida("cl:massa_torta"),
    comida("cl:garrafa_leite", { bebida: true, sempre: true, valores: [0, 0], pilha: 16 }), comida("cl:chocolate_quente", { bebida: true, sempre: true, valores: [0, 0], pilha: 16 }),
    comida("cl:sidra_maca", { bebida: true, sempre: true, valores: [0, 0], pilha: 16 }), comida("cl:suco_melancia", { bebida: true, sempre: true, valores: [0, 0], pilha: 16 }),
    comida("cl:fatia_bolo", { rapido: true, valores: [2, 0.1] }), comida("cl:fatia_torta_maca", { rapido: true, valores: [3, 0.3] }),
    comida("cl:fatia_cheesecake", { rapido: true, valores: [3, 0.3] }), comida("cl:fatia_torta_chocolate", { rapido: true, valores: [3, 0.3] }),
    comida("cl:fatia_torta_abobora", { rapido: true, valores: [3, 0.3] }),
    comida("cl:biscoito_frutas", { rapido: true }), comida("cl:biscoito_mel", { rapido: true }), comida("cl:picole_melancia", { rapido: true, sempre: true }),
    comida("cl:creme_baga_brilhante", { bebida: true, sempre: true, pilha: 16 }),
    comida("cl:rolinho_salmao", { rapido: true }), comida("cl:rolinho_bacalhau", { rapido: true }), comida("cl:rolo_alga", { lento: true }), comida("cl:fatia_rolo_alga", { rapido: true }),
    comida("cl:salada_nether", { tigela: true }),
    comida("cl:prato_frango_assado", { tigela: true }), comida("cl:tigela_abobora_recheada", { tigela: true }), comida("cl:prato_presunto_mel", { tigela: true }),
    comida("cl:prato_torta_pastor", { tigela: true }), comida("cl:tigela_salada_brilhante", { tigela: true }),
    item("cl:racao_cachorro", { pilha: 16 }), item("cl:racao_cavalo", { pilha: 16 }), item("cl:casca_arvore"),
    item("cl:faca_netherita", { pilha: 1, comp: { "minecraft:durability": { max_durability: 2031 }, "minecraft:damage": 6, "minecraft:hand_equipped": true, "minecraft:tags": { tags: ["cl:faca"] } } }),
  ],
  blocos: [
    ...TORTAS.map(([id, , topo]) => ({
      id: id.slice(3), pt: nome(id)[0], en: nome(id)[1], tipo: "cubo", cor: "#c08850", dureza: 0.5, comp: "cl:fd_porcoes", loot: "loot_tables/empty.json", ...FD,
      geometria: { ossos: { torta: [[[-7, 0, -7], [14, 4, 14], "lado"], [[-7, 3.99, -7], [14, 0.02, 14], "topo"]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_fd_torta_lado", render_method: "alpha_test" }, lado: { texture: "clc_fd_torta_lado", render_method: "alpha_test" }, topo: { texture: `clc_${topo}`, render_method: "alpha_test" } },
        "minecraft:collision_box": { origin: [-7, 0, -7], size: [14, 4, 14] }, "minecraft:selection_box": { origin: [-7, 0, -7], size: [14, 4, 14] } },
    })),
    ...BANQUETES.map(([id, , , tex, comida_]) => ({
      id: id.slice(3), pt: nome(id)[0], en: nome(id)[1], tipo: "cubo", cor: "#c08850", dureza: 0.5, comp: "cl:fd_porcoes", loot: "loot_tables/empty.json", ...FD,
      geometria: { ossos: { banquete: [[[-7, 0, -7], [14, 1, 14], "travessa"], [...comida_, "comida"]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_fd_travessa", render_method: "alpha_test" }, travessa: { texture: "clc_fd_travessa", render_method: "alpha_test" }, comida: { texture: `clc_${tex}`, render_method: "alpha_test" } },
        "minecraft:collision_box": { origin: [-7, 0, -7], size: [14, 8, 14] }, "minecraft:selection_box": { origin: [-7, 0, -7], size: [14, 8, 14] } },
    })),
    { id: "composto_organico", pt: nome("cl:composto_organico")[0], en: nome("cl:composto_organico")[1], tipo: "cubo", cor: "#5a3a22", padrao: "pintas", dureza: 1, comp: "cl:fd_solo", tick: [400, 900], ...FD },
    { id: "solo_rico", pt: nome("cl:solo_rico")[0], en: nome("cl:solo_rico")[1], tipo: "cubo", cor: "#3a2a18", padrao: "pintas", dureza: 0.6, comp: "cl:fd_solo", tick: [300, 700], ...FD },
    { id: "rede_seguranca", pt: nome("cl:rede_seguranca")[0], en: nome("cl:rede_seguranca")[1], tipo: "cubo", cor: "#d8c070", dureza: 0.3, comp: "cl:fd_rede", ...FD,
      geometria: { ossos: { rede: [[[-8, 7, -8], [16, 1, 16]]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_rede_seguranca", render_method: "alpha_test" } }, "minecraft:collision_box": { origin: [-8, 7, -8], size: [16, 1, 16] }, "minecraft:selection_box": { origin: [-8, 7, -8], size: [16, 1, 16] }, "minecraft:entity_fall_on": { min_fall_distance: 1 }, "minecraft:light_dampening": 0 } },
    { id: "tapete_lona", pt: nome("cl:tapete_lona")[0], en: nome("cl:tapete_lona")[1], tipo: "cubo", cor: "#e8dcb5", dureza: 0.2, ...FD,
      geometria: { ossos: { tapete: [[[-8, 0, -8], [16, 1, 16]]] } },
      extra: { "minecraft:material_instances": { "*": { texture: "clc_tapete_lona", render_method: "alpha_test" } }, "minecraft:collision_box": { origin: [-8, 0, -8], size: [16, 1, 16] }, "minecraft:selection_box": { origin: [-8, 0, -8], size: [16, 1, 16] }, "minecraft:light_dampening": 0 } },
    { id: "tatame", pt: nome("cl:tatame")[0], en: nome("cl:tatame")[1], tipo: "cubo", cor: "#c8b878", padrao: "liso", dureza: 0.5, ...FD },
    { id: "fardo_arroz", pt: nome("cl:fardo_arroz")[0], en: nome("cl:fardo_arroz")[1], tipo: "cubo", cor: "#d8c06a", padrao: "liso", dureza: 0.5, ...FD },
    { id: "cesto", pt: nome("cl:cesto")[0], en: nome("cl:cesto")[1], tipo: "cubo", cor: "#a07c48", padrao: "liso", dureza: 1.5, comp: "cl:fd_cesto", tick: [20, 20], girar: false, ...FD },
    { id: "cesto_bambu", pt: nome("cl:cesto_bambu")[0], en: nome("cl:cesto_bambu")[1], tipo: "cubo", cor: "#c8b05a", padrao: "liso", dureza: 1.5, comp: "cl:fd_cesto", tick: [20, 20], girar: false, ...FD },
    ...MADEIRAS.map((m) => ({ id: `armario_${m}`, pt: nome(`cl:armario_${m}`)[0], en: nome(`cl:armario_${m}`)[1], tipo: "cubo", cor: "#a07c48", padrao: "liso", dureza: 2.5, comp: "cl:bau_grande", ...FD })),
    ...SELVAGENS.map((id) => planta(id)),
    planta("colonia_cogumelo_marrom"), planta("colonia_cogumelo_vermelho"),
  ],
  receitas: [
    ...D.receitas,
    { id: "presunto_defumado", tipo: "furnace", entrada: "cl:presunto", resultado: "cl:presunto_defumado" },
    { id: "faca_netherita", tipo: "shapeless", ingredientes: ["cl:faca_diamante", "minecraft:netherite_ingot"], resultado: "cl:faca_netherita" },
  ],
  textos: {
    "cl.fd.porcoes": ["%s: %s porções. Toque para servir%s.", "%s: %s servings. Tap to serve%s."],
    "cl.fd.com_tigela": [" (com uma tigela na mão)", " (with a bowl in hand)"],
    "cl.fd.solo": ["Solo Rico: plantas e cogumelos em cima e as plantações encostadas crescem mais rápido; cogumelo em cima vira colônia.", "Rich Soil: plants and mushrooms on top and the crops next to it grow faster; a mushroom on top becomes a colony."],
    "cl.fd.composto": ["Composto Orgânico: vira Solo Rico com o tempo (mais rápido com água ou cogumelo perto).", "Organic Compost: turns into Rich Soil over time (faster with water or mushrooms nearby)."],
    "cl.fd.cesto": ["Cesto: %s pilhas. Ele junta o que cair em cima; toque para tirar.", "Basket: %s stacks. It collects what falls on top; tap to take."],
    "cl.fd.racao": ["%s comeu e ficou forte!", "%s ate and got stronger!"],
    "cl.capitulo.farmers2.nome": ["Farmer's Delight 1.3", "Farmer's Delight 1.3"], "cl.capitulo.farmers2.curto": ["Banquetes", "Feasts"],
    "cl.capitulo.farmers2.desc": ["O que veio no Farmer's Delight mais novo: tortas e banquetes servidos em pedaços, bebidas, Solo Rico, colônias de cogumelo, armários e cestos, e plantas selvagens pelo mundo.", "What the newest Farmer's Delight added: pies and feasts served in pieces, drinks, Rich Soil, mushroom colonies, cabinets and baskets, and wild crops around the world."],
    "cl.missao.fd2_torta.titulo": ["Torta de Maçã", "Apple Pie"], "cl.missao.fd2_torta.desc": ["Faça uma Torta de Maçã e sirva uma fatia.", "Make an Apple Pie and serve a slice."],
    "cl.missao.fd2_banquete.titulo": ["Banquete", "Feast"], "cl.missao.fd2_banquete.desc": ["Sirva um prato de um banquete (Frango Assado, Presunto com Mel, Torta do Pastor...).", "Serve a plate from a feast (Roast Chicken, Honey Glazed Ham, Shepherd's Pie...)."],
    "cl.missao.fd2_solo.titulo": ["Solo Rico", "Rich Soil"], "cl.missao.fd2_solo.desc": ["Deixe o Composto Orgânico virar Solo Rico.", "Let Organic Compost turn into Rich Soil."],
    "cl.missao.fd2_selvagem.titulo": ["Planta selvagem", "Wild crop"], "cl.missao.fd2_selvagem.desc": ["Ache uma planta selvagem (repolho, tomate, cebola, cenoura, batata, beterraba marinha ou arroz).", "Find a wild crop (cabbage, tomato, onion, carrot, potato, sea beet or rice)."],
  },
  dados: {
    porcoes: Object.fromEntries([...TORTAS.map(([id, p]) => [id, [p, 4, false]]), ...BANQUETES.map(([id, p, n]) => [id, [p, n, id !== "cl:travessa_rolinhos"]])]),
    // Recipientes do FD: as bebidas em garrafa, a ração em tigela, a abóbora recheada servida na própria abóbora.
    panela: [
      ...D.panela.map((r) => ({ ...r, recipiente: { "cl:sidra_maca": "minecraft:glass_bottle", "cl:creme_baga_brilhante": "minecraft:glass_bottle", "cl:chocolate_quente": "minecraft:glass_bottle", "cl:racao_cachorro": "minecraft:bowl" }[r.sai] ?? null })),
      { sai: "cl:abobora_recheada", ingr: [["cl:arroz"], ["cl:cebola"], ["minecraft:brown_mushroom"], ["minecraft:potato"], ["minecraft:sweet_berries"], ["minecraft:carrot", "minecraft:beetroot", "cl:repolho", "cl:tomate"]], tempo: 400, recipiente: "minecraft:pumpkin" },
    ],
    corte: { ...D.corte, "minecraft:pumpkin_pie": [["cl:fatia_torta_abobora", 4, 1]], "minecraft:cake": [["cl:fatia_bolo", 7, 1]] },
    efeitos: {
      "cl:prato_frango_assado": [LONGA, 0], "cl:tigela_abobora_recheada": [LONGA, 0], "cl:prato_presunto_mel": [LONGA, 0], "cl:prato_torta_pastor": [LONGA, 0],
      "cl:tigela_salada_brilhante": [LONGA, 0], "cl:rolo_alga": [0, 0],
    },
    regenera: [],
    selvagens: SELVAGENS.map((x) => `cl:${x}`),
    armarios: Object.fromEntries(MADEIRAS.map((m) => [`armario_${m}`, 27])),
  },
};

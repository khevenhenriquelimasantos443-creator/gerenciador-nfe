// Fase 59 (1.40.0): Extra Utilities 2 (RWTema; o mais novo, 1.12.2; código e arte fechados, então arte própria em
// tools/desenhar-xu2.py e números das páginas do mod no wiki do FTB). Scripts em scripts/utilidades/xu2.ts.
// - Espinhos: a cada 0,5 s ferem quem está em cima: madeira 1 (não mata), ferro 4, ouro 2 (quem morre solta XP) e
//   diamante 8 (morre como se fosse por um jogador, com o saque de jogador).
// - Lírio Ender: 8 estágios num relógio (não com ticks aleatórios); no end stone madura em ~2,3 h, em outro chão 4×
//   mais devagar; farinha de osso faz voltar um estágio. Madura: 1 pérola do Ender (colher replanta). As sementes vêm das
//   masmorras e o lírio nasce no End.
// - Orquídea Vermelha: só no minério de redstone, 7 estágios, aceita farinha de osso; madura dá 1 redstone (às vezes
//   outra orquídea). Nasce nas cavernas abaixo de y 16, em cima do minério de redstone.
// - Laço Dourado (bichos pacíficos) e Laço Amaldiçoado (monstros): toque para guardar, toque num bloco para soltar.
// - Tocha Magnum: nenhum monstro nasce sozinho num raio de 64 (32 de altura). Candelabro: raio de 16.
const XU = { mod: "Extra Utilities" };
export const ESPINHOS = [
  ["madeira", "Madeira", "Wooden", "#9a6e3c", "minecraft:wooden_sword", "#minecraft:planks", 1],
  ["ferro", "Ferro", "Iron", "#9a9aa0", "minecraft:iron_sword", "minecraft:iron_ingot", 4],
  ["ouro", "Ouro", "Golden", "#d0a030", "minecraft:golden_sword", "minecraft:gold_ingot", 2],
  ["diamante", "Diamante", "Diamond", "#30b0a8", "minecraft:diamond_sword", "minecraft:diamond", 8],
];
const planta = (id, pt, en, cor, estagios, comp, extra = {}) => ({
  id, pt, en, tipo: "cubo", cor, dureza: 0, girar: false, comp: `cl:${comp}`, loot: "loot_tables/empty.json", ...XU, ...extra,
  estados: { "cl:estagio": [...Array(estagios).keys()] },
  extra: {
    "minecraft:geometry": "geometry.cl.planta", "minecraft:material_instances": { "*": { texture: `clc_${id}_0`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
    "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-5, 0, -5], size: [10, 12, 10] }, "minecraft:light_dampening": 0,
  },
  // Cada visual serve dois estágios.
  permutacoes: [1, 2, 3].map((v) => ({
    condition: `q.block_state('cl:estagio') >= ${v * 2}`,
    components: { "minecraft:material_instances": { "*": { texture: `clc_${id}_${v}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } } },
  })),
});
const enfeite = (id, pt, en, cor, comp, caixa) => ({
  id, pt, en, tipo: "cubo", cor, dureza: 1, girar: false, luzEmite: 15, comp: `cl:${comp}`, ...XU,
  extra: {
    "minecraft:geometry": "geometry.cl.planta", "minecraft:material_instances": { "*": { texture: `clc_${id}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
    "minecraft:collision_box": caixa, "minecraft:selection_box": caixa, "minecraft:light_dampening": 0,
  },
});

export default {
  fase: 59,
  mod: "Extra Utilities",
  itens: [
    { id: "semente_lirio_ender", pt: "Sementes de Lírio Ender", en: "Ender-Lily Seeds", icone: "po:#7a3ca8", ...XU },
    { id: "orquidea_vermelha", pt: "Orquídea Vermelha", en: "Red Orchid", icone: "folha:#c81e24", ...XU },
    { id: "laco_dourado", pt: "Laço Dourado", en: "Golden Lasso", icone: "bola:#f0c83c", pilha: 1, ...XU },
    { id: "laco_amaldicoado", pt: "Laço Amaldiçoado", en: "Cursed Lasso", icone: "bola:#96283c", pilha: 1, ...XU },
  ],
  blocos: [
    ...ESPINHOS.map(([m, pt, en, cor]) => ({
      id: `espinho_${m}`, pt: `Espinhos de ${pt}`, en: `${en} Spikes`, tipo: "cubo", cor, dureza: 2, girar: false, comp: "cl:espinho", tick: [10, 10], ...XU,
      extra: { "minecraft:material_instances": { "*": { texture: `clc_espinho_${m}`, render_method: "alpha_test" } }, "minecraft:light_dampening": 0 },
    })),
    planta("lirio_ender_planta", "Lírio Ender", "Ender Lily", "#7a3ca8", 8, "lirio_ender", { tick: [1200, 1200] }),
    planta("orquidea_planta", "Orquídea Vermelha", "Red Orchid", "#c81e24", 7, "orquidea"),
    enfeite("tocha_magnum", "Tocha Magnum", "Magnum Torch", "#6e5032", "tocha_magnum", { origin: [-3, 0, -3], size: [6, 16, 6] }),
    enfeite("candelabro", "Candelabro", "Chandelier", "#dcb43c", "candelabro", { origin: [-6, 6, -6], size: [12, 10, 12] }),
  ],
  receitas: [
    ...ESPINHOS.map(([m, , , , espada, mat]) => ({ id: `espinho_${m}`, tipo: "shaped", padrao: [" S ", "SMS", "MMM"], chave: { S: espada, M: mat }, resultado: `cl:espinho_${m}`, qtd: 4 })),
    { id: "laco_dourado", tipo: "shaped", padrao: ["GSG", "SES", "GSG"], chave: { G: "minecraft:gold_ingot", S: "minecraft:string", E: "minecraft:ender_pearl" }, resultado: "cl:laco_dourado" },
    { id: "laco_amaldicoado", tipo: "shaped", padrao: ["FBF", "BLB", "FBF"], chave: { F: "minecraft:fermented_spider_eye", B: "minecraft:blaze_powder", L: "cl:laco_dourado" }, resultado: "cl:laco_amaldicoado" },
    { id: "candelabro", tipo: "shaped", padrao: [" T ", "TGT", "GGG"], chave: { T: "minecraft:torch", G: "minecraft:gold_ingot" }, resultado: "cl:candelabro" },
    { id: "tocha_magnum", tipo: "shaped", padrao: ["CDC", "CLC", "LLL"], chave: { C: "cl:candelabro", D: "minecraft:diamond", L: "#minecraft:logs" }, resultado: "cl:tocha_magnum" },
  ],
  textos: {
    "cl.xu2.laco_cheio": ["§7Guardado: %s", "§7Holding: %s"],
    "cl.xu2.laco_nao": ["Este laço não pega esse bicho (dourado: pacíficos; amaldiçoado: monstros).", "This lasso can't take that creature (golden: passive; cursed: hostile)."],
    "cl.xu2.magnum": ["Tocha Magnum: nenhum monstro nasce sozinho a 64 blocos daqui (32 de altura).", "Magnum Torch: no monster spawns naturally within 64 blocks (32 high)."],
    "cl.xu2.candelabro": ["Candelabro: nenhum monstro nasce sozinho a 16 blocos daqui.", "Chandelier: no monster spawns naturally within 16 blocks."],
    "cl.xu2.lirio": ["Lírio Ender: estágio %s de 8 (no end stone cresce 4× mais rápido).", "Ender Lily: stage %s of 8 (grows 4× faster on end stone)."],
    "cl.capitulo.xu2.nome": ["Extra Utilities 2", "Extra Utilities 2"],
    "cl.capitulo.xu2.curto": ["XU 2", "XU 2"],
    "cl.capitulo.xu2.desc": ["Do Extra Utilities 2: espinhos para fazendas de monstros, Lírio Ender e Orquídea Vermelha, os laços para levar bichos e a Tocha Magnum.", "From Extra Utilities 2: spikes for mob farms, the Ender Lily and Red Orchid, lassos to carry creatures and the Magnum Torch."],
    "cl.missao.xu2_espinho.titulo": ["Fazenda de espinhos", "Spike farm"], "cl.missao.xu2_espinho.desc": ["Deixe os espinhos derrubarem um monstro.", "Let the spikes take down a monster."],
    "cl.missao.xu2_lirio.titulo": ["Pérola que nasce", "Growing pearls"], "cl.missao.xu2_lirio.desc": ["Colha uma pérola de um Lírio Ender maduro.", "Harvest a pearl from a mature Ender Lily."],
    "cl.missao.xu2_orquidea.titulo": ["Orquídea Vermelha", "Red Orchid"], "cl.missao.xu2_orquidea.desc": ["Colha redstone de uma Orquídea Vermelha.", "Harvest redstone from a Red Orchid."],
    "cl.missao.xu2_laco.titulo": ["No laço", "Lassoed"], "cl.missao.xu2_laco.desc": ["Pegue um bicho com o Laço Dourado.", "Catch a creature with the Golden Lasso."],
    "cl.missao.xu2_magnum.titulo": ["Tocha Magnum", "Magnum Torch"], "cl.missao.xu2_magnum.desc": ["Ponha uma Tocha Magnum na base.", "Place a Magnum Torch at your base."],
  },
  dados: { espinhos: Object.fromEntries(ESPINHOS.map(([m, , , , , , dano]) => [`cl:espinho_${m}`, dano])) },
};

// Fase 36 (1.13.0): Immersive Aircraft (Luke100000, GPLv3): Biplano, Dirigível, Girocóptero e Quadricóptero com os
// modelos, as texturas e os ícones originais (tools/gerar-aeronaves.py e tools/importar-originais.py) e a física de
// voo do código do mod (stats de data/immersive_aircraft/aircraft/*.json). Script em scripts/utilidades/aeronaves.ts.
const IA = { mod: "Immersive Aircraft" };
const veiculo = (id, pt, en) => ({ id, pt, en, icone: "carrinho:#c8a070", pilha: 1, ...IA });

export default {
  fase: 36,
  mod: "Immersive Aircraft",
  itens: [
    { id: "casco_aeronave", pt: "Casco", en: "Hull", icone: "placa:#a07c48", ...IA },
    { id: "motor_aeronave", pt: "Motor", en: "Engine", icone: "engrenagem:#6b6b6b", ...IA },
    { id: "vela_aeronave", pt: "Vela", en: "Sail", icone: "placa:#e8e8e8", ...IA },
    { id: "helice_aviao", pt: "Hélice de Avião", en: "Propeller", icone: "engrenagem:#c8ccd0", ...IA },
    { id: "caldeira", pt: "Caldeira", en: "Boiler", icone: "celula:#d8823c", ...IA },
    veiculo("biplano", "Biplano", "Biplane"),
    veiculo("dirigivel", "Dirigível", "Airship"),
    veiculo("girocoptero", "Girocóptero", "Gyrodyne"),
    veiculo("quadricoptero", "Quadricóptero", "Quadrocopter"),
  ],
  receitas: [
    { id: "casco_aeronave", tipo: "shaped", padrao: ["LLL", "III", "LLL"], chave: { L: "#minecraft:logs", I: "minecraft:iron_ingot" }, resultado: "cl:casco_aeronave" },
    { id: "caldeira", tipo: "shaped", padrao: ["CCC", "C C", "CFC"], chave: { C: "minecraft:copper_ingot", F: "minecraft:furnace" }, resultado: "cl:caldeira" },
    { id: "motor_aeronave", tipo: "shaped", padrao: [" C ", "PFP", "CIC"], chave: { F: "minecraft:blast_furnace", C: "minecraft:cobblestone", I: "cl:caldeira", P: "minecraft:piston" }, resultado: "cl:motor_aeronave" },
    { id: "vela_aeronave", tipo: "shaped", padrao: ["CCS", "CCS", "CCS"], chave: { S: "minecraft:string", C: "minecraft:white_carpet" }, resultado: "cl:vela_aeronave" },
    { id: "helice_aviao", tipo: "shaped", padrao: ["II ", " I ", " II"], chave: { I: "minecraft:iron_ingot" }, resultado: "cl:helice_aviao" },
    { id: "biplano", tipo: "shaped", padrao: [" H ", "HEP", " H "], chave: { H: "cl:casco_aeronave", E: "cl:motor_aeronave", P: "cl:helice_aviao" }, resultado: "cl:biplano" },
    { id: "dirigivel", tipo: "shaped", padrao: ["SSS", "SSS", "HHE"], chave: { S: "cl:vela_aeronave", H: "cl:casco_aeronave", E: "cl:motor_aeronave" }, resultado: "cl:dirigivel" },
    { id: "girocoptero", tipo: "shaped", padrao: [" S ", "HPH", " S "], chave: { S: "cl:vela_aeronave", H: "cl:casco_aeronave", P: "cl:helice_aviao" }, resultado: "cl:girocoptero" },
    { id: "quadricoptero", tipo: "shaped", padrao: ["PBP", "BEB", "PBP"], chave: { E: "cl:motor_aeronave", B: "minecraft:bamboo", P: "cl:helice_aviao" }, resultado: "cl:quadricoptero" },
  ],
  dados: {
    // Stats de cada aeronave (data/immersive_aircraft/aircraft/*.json; o que falta é o padrão do VehicleStat.java).
    tipos: {
      "cl:biplano": { tipo: "aviao", combustivel: 1.25, yawSpeed: 5, pitchSpeed: 4, engineSpeed: 0.03, pushSpeed: 0.025, glideFactor: 0.05, lift: 0.15, rollFactor: 45, groundPitch: 4, wind: 0.025, mass: 1, groundFriction: 0.95, horizontalDecay: 0.97, verticalDecay: 0.97, stabilizer: 0, reacao: 20 },
      "cl:dirigivel": { tipo: "dirigivel", combustivel: 1, yawSpeed: 5, engineSpeed: 0.02, verticalSpeed: 0.025, lift: 0.1, rollFactor: 5, wind: 0.05, mass: 3, groundFriction: 0.5, horizontalDecay: 0.97, verticalDecay: 0.925, stabilizer: 0.1, reacao: 50 },
      "cl:girocoptero": { tipo: "girocoptero", combustivel: 0, yawSpeed: 5, pitchSpeed: 5, engineSpeed: 0.3, pushSpeed: 0.3, verticalSpeed: 0.04, lift: 0.1, rollFactor: 30, wind: 0.05, mass: 4, groundFriction: 0.8, horizontalDecay: 0.925, verticalDecay: 0.9, stabilizer: 0.3, reacao: 20 },
      "cl:quadricoptero": { tipo: "quadricoptero", combustivel: 0.5, yawSpeed: 0.15, pitchSpeed: 1.5, engineSpeed: 0.0325, verticalSpeed: 0.0325, lift: 0.1, rollFactor: 15, wind: 0.0125, mass: 1, groundFriction: 0.25, horizontalDecay: 0.9, verticalDecay: 0.8, stabilizer: 0.1, reacao: 20 },
    },
    // Tempo de fornalha (ticks) dos combustíveis que entram na caldeira.
    queima: {
      "minecraft:coal": 1600, "minecraft:charcoal": 1600, "minecraft:coal_block": 16000, "minecraft:blaze_rod": 2400, "minecraft:lava_bucket": 20000,
      "minecraft:dried_kelp_block": 4000, "cl:coque": 3200, "cl:bloco_coque": 32000, "cl:bloco_carvao_vegetal": 16000, "cl:biocombustivel": 200,
      "minecraft:oak_log": 300, "minecraft:spruce_log": 300, "minecraft:birch_log": 300, "minecraft:jungle_log": 300, "minecraft:acacia_log": 300,
      "minecraft:dark_oak_log": 300, "minecraft:oak_planks": 300, "minecraft:stick": 100,
    },
  },
  textos: {
    "cl.ia.combustivel": ["%s: caldeira com %s× %s (%s s de voo no máximo). Toque com carvão, coque ou outro combustível para pôr.", "%s: boiler holds %s× %s (%s s at full throttle). Tap with coal, coke or another fuel to load."],
    "cl.ia.sem_combustivel": ["%s: caldeira vazia. Toque com carvão, coque ou outro combustível.", "%s: empty boiler. Tap with coal, coke or another fuel."],
    "cl.ia.acabou": ["§cO combustível acabou!", "§cOut of fuel!"],
    "cl.ia.motor": ["Motor %s%%", "Engine %s%%"],
    "cl.ia.pedalar": ["Pedale para frente para dar corda: %s%%", "Pedal forward to wind up: %s%%"],
    "cl.ia.controles_aviao": ["Biplano: pule para acelerar; o joystick inclina (frente desce o nariz) e vira; no chão, para trás freia.", "Biplane: jump to throttle up; the stick pitches (forward = nose down) and turns; on the ground, back brakes."],
    "cl.ia.controles_rotor": ["%s: pule para subir, olhe bem para baixo para descer; o joystick anda e vira.", "%s: jump to go up, look straight down to descend; the stick moves and turns."],
    "cl.ia.recolher": ["Bata mais %s vez(es) para recolher.", "Hit %s more time(s) to pick it up."],
    "cl.capitulo.aircraft.nome": ["Immersive Aircraft", "Immersive Aircraft"],
    "cl.capitulo.aircraft.curto": ["Aeronaves", "Aircraft"],
    "cl.capitulo.aircraft.desc": ["Casco, motor e caldeira: Biplano, Dirigível, Girocóptero e Quadricóptero para atravessar o deserto voando.", "Hull, engine and boiler: Biplane, Airship, Gyrodyne and Quadrocopter to cross the desert by air."],
    "cl.missao.ia_motor.titulo": ["Motor a vapor", "Steam engine"], "cl.missao.ia_motor.desc": ["Faça um Motor (com uma Caldeira).", "Make an Engine (with a Boiler)."],
    "cl.missao.ia_giro.titulo": ["Na força das pernas", "Leg power"], "cl.missao.ia_giro.desc": ["Voe de Girocóptero.", "Fly a Gyrodyne."],
    "cl.missao.ia_biplano.titulo": ["De novo no céu", "Back in the sky"], "cl.missao.ia_biplano.desc": ["Voe de Biplano a 30 blocos do chão.", "Fly a Biplane 30 blocks above the ground."],
    "cl.missao.ia_dirigivel.titulo": ["Devagar e sempre", "Slow and steady"], "cl.missao.ia_dirigivel.desc": ["Voe 500 blocos de Dirigível ou Quadricóptero.", "Fly 500 blocks by Airship or Quadrocopter."],
  },
};

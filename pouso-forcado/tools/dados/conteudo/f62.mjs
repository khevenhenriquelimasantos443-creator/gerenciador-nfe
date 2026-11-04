// Fase 62 (1.43.0): BuildCraft 8 (o mais novo publicado, 1.12.2; licença MMPL, inclusive a arte, por
// tools/importar-bc8.py). Números do código do mod (MJ; 1 MJ = 10 RF); script em scripts/maquinas/buildcraft8.ts.
// - Motor de Redstone: com sinal de redstone, 0,05 MJ/t (o "free power" do mod).
// - Motor Stirling: com sinal de redstone, queima o combustível do forno (carvão 1.600 ticks...) a 1 MJ/t.
// - Poço de Mineração: cava em linha reta para baixo; cada bloco custa 16 × (dureza + 1) × 2 MJ (pedra: 80 MJ).
// - Comporta (Flood Gate): baldes de água ou lava no baú de cima enchem os buracos embaixo dela (até 64 blocos).
// - Enchedor (Filler) e Marcos: dois marcos nos cantos opostos (até 64 blocos do enchedor) marcam a área; padrões
//   Limpar, Encher, Caixa e Pirâmide. Quebrar custa como minerar; pôr custa distância × 10 MJ (SnapshotBuilder).
const BC = { mod: "BuildCraft" };
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 20, ...BC, ...extra });

export default {
  fase: 62,
  mod: "BuildCraft",
  itens: [],
  blocos: [
    maq("motor_redstone", "Motor de Redstone", "Redstone Engine", "vermelho", "engrenagem"),
    maq("motor_stirling", "Motor Stirling", "Stirling Engine", "laranja", "chama"),
    maq("poco_mineracao", "Poço de Mineração", "Mining Well", "amarelo", "seta"),
    maq("comporta", "Comporta", "Flood Gate", "azul", "gota"),
    maq("enchedor", "Enchedor", "Filler", "amarelo", "caixa"),
    {
      id: "marco", pt: "Marco", en: "Land Mark", tipo: "cubo", cor: "#3a5ad8", dureza: 0, girar: false, luzEmite: 7, comp: "cl:marco", ...BC,
      extra: {
        "minecraft:geometry": "geometry.cl.planta", "minecraft:material_instances": { "*": { texture: "clc_marco", render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
        "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-2, 0, -2], size: [4, 10, 4] }, "minecraft:light_dampening": 0,
      },
    },
  ],
  receitas: [
    { id: "motor_redstone", tipo: "shaped", padrao: ["WWW", " G ", "EPE"], chave: { W: "#minecraft:planks", G: "minecraft:glass", E: "cl:engrenagem_madeira", P: "minecraft:piston" }, resultado: "cl:motor_redstone" },
    { id: "motor_stirling", tipo: "shaped", padrao: ["CCC", " G ", "EPE"], chave: { C: "minecraft:cobblestone", G: "minecraft:glass", E: "cl:engrenagem_pedra", P: "minecraft:piston" }, resultado: "cl:motor_stirling" },
    { id: "poco_mineracao", tipo: "shaped", padrao: ["IRI", "IGI", "IPI"], chave: { I: "minecraft:iron_ingot", R: "minecraft:redstone", G: "cl:engrenagem_ferro", P: "minecraft:iron_pickaxe" }, resultado: "cl:poco_mineracao" },
    { id: "comporta", tipo: "shaped", padrao: ["IGI", "BTB", "IBI"], chave: { I: "minecraft:iron_ingot", G: "cl:engrenagem_ferro", B: "minecraft:iron_bars", T: "minecraft:bucket" }, resultado: "cl:comporta" },
    { id: "enchedor", tipo: "shaped", padrao: ["DMD", "YGY", "OCO"], chave: { D: "minecraft:black_dye", M: "cl:marco", Y: "minecraft:yellow_dye", G: "cl:engrenagem_ouro", O: "minecraft:gold_ingot", C: "minecraft:chest" }, resultado: "cl:enchedor" },
    { id: "marco", tipo: "shaped", padrao: ["L", "T"], chave: { L: "minecraft:lapis_lazuli", T: "minecraft:redstone_torch" }, resultado: "cl:marco" },
  ],
  textos: {
    "cl.bc8.motor": ["Motor: %s ticks de queima (precisa de sinal de redstone)", "Engine: %s burn ticks (needs a redstone signal)"],
    "cl.bc8.poco": ["Poço de Mineração: profundidade %s", "Mining Well: depth %s"],
    "cl.bc8.enchedor_titulo": ["Enchedor", "Filler"],
    "cl.bc8.enchedor_corpo": ["Ponha dois Marcos nos cantos opostos da área (até 64 blocos daqui) e blocos no baú de cima. Padrão:", "Place two Land Marks on opposite corners of the area (up to 64 blocks away) and blocks in the chest above. Pattern:"],
    "cl.bc8.limpar": ["Limpar (apaga os blocos)", "Clear (removes blocks)"], "cl.bc8.encher": ["Encher", "Fill"], "cl.bc8.caixa": ["Caixa (só as paredes)", "Box (walls only)"],
    "cl.bc8.piramide": ["Pirâmide", "Pyramid"], "cl.bc8.parar": ["Parar", "Stop"],
    "cl.bc8.sem_marcos": ["O Enchedor precisa de dois Marcos a até 64 blocos.", "The Filler needs two Land Marks within 64 blocks."],
    "cl.bc8.trabalhando": ["Enchedor: %s (%s%%)", "Filler: %s (%s%%)"],
    "cl.capitulo.bc8.nome": ["BuildCraft 8", "BuildCraft 8"],
    "cl.capitulo.bc8.curto": ["BC 8", "BC 8"],
    "cl.capitulo.bc8.desc": ["Do BuildCraft mais novo: motores de Redstone e Stirling, o Poço de Mineração, a Comporta e o Enchedor com Marcos para construir e limpar áreas.", "From the latest BuildCraft: Redstone and Stirling engines, the Mining Well, the Flood Gate and the Filler with Land Marks to build and clear areas."],
    "cl.missao.bc8_motor.titulo": ["Motor Stirling", "Stirling Engine"], "cl.missao.bc8_motor.desc": ["Ligue um Motor Stirling com redstone e carvão.", "Run a Stirling Engine with redstone and coal."],
    "cl.missao.bc8_poco.titulo": ["Poço de Mineração", "Mining Well"], "cl.missao.bc8_poco.desc": ["Cave 32 blocos com o Poço de Mineração.", "Dig 32 blocks with the Mining Well."],
    "cl.missao.bc8_enchedor.titulo": ["Enchedor", "Filler"], "cl.missao.bc8_enchedor.desc": ["Termine uma área com o Enchedor.", "Finish an area with the Filler."],
    "cl.missao.bc8_comporta.titulo": ["Comporta", "Flood Gate"], "cl.missao.bc8_comporta.desc": ["Encha um buraco com a Comporta.", "Fill a hole with the Flood Gate."],
  },
};

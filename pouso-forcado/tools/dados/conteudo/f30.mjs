// Fase 30 (1.9.0): Create. Rotação e estresse com os números do Create (AllBlocks/CStress do código público): a
// capacidade é em SU por RPM (Manivela 8 a 32 RPM, Roda d'Água 32 a 8 RPM, Rolamento de Moinho 512 por RPM com 1 RPM a
// cada 8 velas) e o impacto também (Prensa e Rodas Trituradoras 8, Mó, Misturador e Furadeira 4, Ventilador 2).
// Eixos e engrenagens ligam tudo; o Controlador de Velocidade muda o RPM da rede (o estresse total é em SU).
// Scripts em scripts/maquinas/create.ts.
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 20, ...extra });
const ANDESITA = "#a7a99f";
// Peças que giram: o estado cl:girando troca a textura pela do rotor animado (clv_rotor, de tools/gerar-visual.mjs).
const gira = {
  estados: { "cl:girando": [false, true] },
  permutacoes: [{ condition: "q.block_state('cl:girando')", components: { "minecraft:material_instances": { "*": { texture: "clv_rotor", render_method: "opaque" } } } }],
};
const peca = (id, pt, en, ossos, extra = {}) => ({
  id, pt, en, tipo: "cubo", cor: ANDESITA, padrao: "metal", dureza: 1, girar: false, ...gira, geometria: { ossos }, ...extra,
});
const caixa = (o, t) => ({ "minecraft:collision_box": { origin: o, size: t }, "minecraft:selection_box": { origin: o, size: t } });
const METAIS = [["ferro", "de Ferro", "Iron", "#d6d9dc", "minecraft:iron_ingot"], ["cobre", "de Cobre", "Copper", "#d4743c", "minecraft:copper_ingot"], ["ouro", "de Ouro", "Golden", "#f2c94c", "minecraft:gold_ingot"], ["latao", "de Latão", "Brass", "#e2b23f", "cl:lingote_latao"]];
const TRITURADOS = [["ferro", "Ferro", "Iron", "#c9b8a8"], ["ouro", "Ouro", "Gold", "#e8c860"], ["cobre", "Cobre", "Copper", "#c7865a"], ["zinco", "Zinco", "Zinc", "#9fc7b5"]];

export default {
  fase: 30,
  mod: "Create",
  itens: [
    { id: "liga_andesita", pt: "Liga de Andesita", en: "Andesite Alloy", icone: "lingote:#a7a99f" },
    ...["quebrado", "triturado", "po"].map((e, k) => ({
      id: `zinco_${e}`, pt: ["Pedaço Quebrado de Zinco", "Pedaço Triturado de Zinco", "Pó de Minério de Zinco"][k],
      en: ["Broken Zinc Ore", "Crushed Zinc Ore Piece", "Powdered Zinc Ore"][k], icone: k ? `po:${["", "#8fb8a6", "#c3ddd2"][k]}` : "pepita:#9fc7b5", mod: "Ex Aliquo",
    })),
    { id: "lingote_zinco", pt: "Lingote de Zinco", en: "Zinc Ingot", icone: "lingote:#9fc7b5" },
    { id: "lingote_latao", pt: "Lingote de Latão", en: "Brass Ingot", icone: "lingote:#e2b23f" },
    ...METAIS.map(([id, pt, en, cor]) => ({ id: `chapa_${id}`, pt: `Chapa ${pt}`, en: `${en} Sheet`, icone: `placa:${cor}` })),
    ...TRITURADOS.map(([id, pt, en, cor]) => ({ id: `triturado_${id}`, pt: `${pt} Bruto Triturado`, en: `Crushed Raw ${en}`, icone: `po:${cor}` })),
    { id: "helice", pt: "Hélice", en: "Propeller", icone: "engrenagem:#d6d9dc" },
    { id: "batedor", pt: "Batedor", en: "Whisk", icone: "garrafa:#d6d9dc" },
  ],
  blocos: [
    peca("eixo", "Eixo", "Shaft", { eixo: [[[-2, 0, -2], [4, 16, 4]]] }, { eixo: true, extra: caixa([-2, 0, -2], [4, 16, 4]) }),
    peca("engrenagem", "Engrenagem", "Cogwheel", { eixo: [[[-2, 0, -2], [4, 16, 4]]], roda: [[[-6, 6, -6], [12, 4, 12]]] }, { eixo: true, extra: caixa([-6, 0, -6], [12, 16, 12]) }),
    peca("engrenagem_grande", "Engrenagem Grande", "Large Cogwheel", { eixo: [[[-2, 0, -2], [4, 16, 4]]], roda: [[[-8, 6, -8], [16, 4, 16]]] }, { eixo: true }),
    { id: "caixa_engrenagens", pt: "Caixa de Engrenagens", en: "Gearbox", tipo: "cubo", cor: ANDESITA, padrao: "rebitado", dureza: 1.5, girar: false, ...gira },
    { id: "revestimento_andesita", pt: "Revestimento de Andesita", en: "Andesite Casing", tipo: "cubo", cor: "#9b9c92", padrao: "rebitado", dureza: 1.5 },
    maq("manivela", "Manivela", "Hand Crank", "amarelo", "engrenagem", { tick: 0 }),
    maq("roda_dagua", "Roda d'Água", "Water Wheel", "azul", "gota"),
    maq("rolamento_moinho", "Rolamento de Moinho", "Windmill Bearing", "branco", "seta"),
    { id: "vela_moinho", pt: "Vela de Moinho", en: "Sail", tipo: "cubo", cor: "#e9e4d6", padrao: "liso", dureza: 0.5, girar: false, geometria: { ossos: { vela: [[[-8, 7, -8], [16, 2, 16]]] } }, extra: caixa([-8, 7, -8], [16, 2, 16]) },
    maq("controlador_velocidade", "Controlador de Velocidade", "Rotation Speed Controller", "violeta", "circulo", { tick: 0 }),
    maq("mo", "Mó", "Millstone", "branco", "circulo"),
    maq("rodas_trituradoras", "Rodas Trituradoras", "Crushing Wheels", "vermelho", "serra"),
    maq("prensa_mecanica", "Prensa Mecânica", "Mechanical Press", "laranja", "seta"),
    maq("misturador_mecanico", "Misturador Mecânico", "Mechanical Mixer", "verde", "floco"),
    maq("ventilador", "Ventilador Revestido", "Encased Fan", "ciano", "floco"),
    maq("furadeira", "Furadeira Mecânica", "Mechanical Drill", "vermelho", "x"),
  ],
  receitas: [
    { id: "liga_andesita", tipo: "shaped", padrao: ["AN", "NA"], chave: { A: "minecraft:andesite", N: "minecraft:iron_nugget" }, resultado: "cl:liga_andesita" },
    ...["quebrado", "triturado", "po"].map((e) => ({ id: `zinco_de_${e}`, tipo: "shapeless", ingredientes: Array(4).fill(`cl:zinco_${e}`), resultado: "cl:lingote_zinco" })),
    ...TRITURADOS.map(([id]) => ({ id: `triturado_${id}`, tipo: "furnace", entrada: `cl:triturado_${id}`, resultado: id === "zinco" ? "cl:lingote_zinco" : `minecraft:${id === "ferro" ? "iron" : id === "ouro" ? "gold" : "copper"}_ingot` })),
    { id: "eixo", tipo: "shaped", padrao: ["A", "A"], chave: { A: "cl:liga_andesita" }, resultado: "cl:eixo", qtd: 8 },
    { id: "engrenagem", tipo: "shapeless", ingredientes: ["cl:eixo", "#minecraft:planks"], resultado: "cl:engrenagem" },
    { id: "engrenagem_grande", tipo: "shapeless", ingredientes: ["cl:eixo", "#minecraft:planks", "#minecraft:planks"], resultado: "cl:engrenagem_grande" },
    { id: "revestimento_andesita", tipo: "shapeless", ingredientes: ["cl:liga_andesita", "#minecraft:logs"], resultado: "cl:revestimento_andesita" },
    { id: "caixa_engrenagens", tipo: "shaped", padrao: [" E ", "ERE", " E "], chave: { E: "cl:engrenagem", R: "cl:revestimento_andesita" }, resultado: "cl:caixa_engrenagens" },
    { id: "manivela", tipo: "shaped", padrao: ["PPP", "  A"], chave: { P: "#minecraft:planks", A: "cl:liga_andesita" }, resultado: "cl:manivela" },
    { id: "roda_dagua", tipo: "shaped", padrao: ["PPP", "PEP", "PPP"], chave: { P: "#minecraft:planks", E: "cl:eixo" }, resultado: "cl:roda_dagua" },
    { id: "rolamento_moinho", tipo: "shaped", padrao: ["S", "R", "E"], chave: { S: "minecraft:oak_slab", R: "cl:revestimento_andesita", E: "cl:eixo" }, resultado: "cl:rolamento_moinho" },
    { id: "vela_moinho", tipo: "shaped", padrao: ["T T", "AWA", "T T"], chave: { T: "minecraft:stick", A: "cl:liga_andesita", W: "minecraft:white_wool" }, resultado: "cl:vela_moinho", qtd: 4 },
    { id: "controlador_velocidade", tipo: "shaped", padrao: [" L ", "ERE"], chave: { L: "cl:chapa_latao", E: "cl:engrenagem", R: "cl:revestimento_andesita" }, resultado: "cl:controlador_velocidade" },
    { id: "mo", tipo: "shaped", padrao: ["E", "R", "S"], chave: { E: "cl:engrenagem", R: "cl:revestimento_andesita", S: "minecraft:stone" }, resultado: "cl:mo" },
    { id: "rodas_trituradoras", tipo: "shaped", padrao: [" A ", "ASA", " A "], chave: { A: "cl:liga_andesita", S: "minecraft:stone" }, resultado: "cl:rodas_trituradoras" },
    { id: "prensa_mecanica", tipo: "shaped", padrao: ["E", "R", "I"], chave: { E: "cl:eixo", R: "cl:revestimento_andesita", I: "minecraft:iron_block" }, resultado: "cl:prensa_mecanica" },
    { id: "batedor", tipo: "shaped", padrao: [" A ", "CAC", "CCC"], chave: { A: "cl:liga_andesita", C: "cl:chapa_ferro" }, resultado: "cl:batedor" },
    { id: "misturador_mecanico", tipo: "shaped", padrao: ["E", "R", "B"], chave: { E: "cl:engrenagem", R: "cl:revestimento_andesita", B: "cl:batedor" }, resultado: "cl:misturador_mecanico" },
    { id: "helice", tipo: "shaped", padrao: [" C ", "CAC", " C "], chave: { A: "cl:liga_andesita", C: "cl:chapa_ferro" }, resultado: "cl:helice" },
    { id: "ventilador", tipo: "shaped", padrao: ["E", "R", "H"], chave: { E: "cl:eixo", R: "cl:revestimento_andesita", H: "cl:helice" }, resultado: "cl:ventilador" },
    { id: "furadeira", tipo: "shaped", padrao: [" A ", "AIA", " R "], chave: { A: "cl:liga_andesita", I: "minecraft:iron_ingot", R: "cl:revestimento_andesita" }, resultado: "cl:furadeira" },
  ],
  textos: {
    "cl.cr.rede": ["Rede: %s RPM, estresse %s/%s SU.", "Network: %s RPM, stress %s/%s SU."],
    "cl.cr.sobrecarga": ["§cSobrecarga: %s/%s SU. Ponha mais fontes ou tire máquinas.", "§cOverstressed: %s/%s SU. Add sources or remove machines."],
    "cl.cr.parada": ["Sem rotação: ligue uma Manivela, Roda d'Água ou Rolamento de Moinho por eixos e engrenagens.", "No rotation: connect a Hand Crank, Water Wheel or Windmill Bearing with shafts and cogwheels."],
    "cl.cr.manivela": ["Manivela: girando por 2 s (32 RPM, 256 SU).", "Hand Crank: spinning for 2 s (32 RPM, 256 SU)."],
    "cl.cr.velocidade": ["Controlador de Velocidade: %s RPM (toque para trocar).", "Rotation Speed Controller: %s RPM (tap to change)."],
    "cl.cr.moinho": ["Rolamento de Moinho: %s velas por perto = %s RPM (1 RPM a cada 8 velas), %s SU.", "Windmill Bearing: %s sails nearby = %s RPM (1 RPM per 8 sails), %s SU."],
    "cl.capitulo.create.nome": ["Create", "Create"],
    "cl.capitulo.create.curto": ["Create", "Create"],
    "cl.capitulo.create.desc": ["Rotação e estresse: manivela, roda d'água e moinho de vento; mó, rodas trituradoras, prensa, misturador, ventilador e furadeira.", "Rotation and stress: hand crank, water wheel and windmill; millstone, crushing wheels, press, mixer, fan and drill."],
    "cl.missao.cr_andesita.titulo": ["Liga de Andesita", "Andesite Alloy"], "cl.missao.cr_andesita.desc": ["Faça 8 Ligas de Andesita (andesita + pepita de ferro).", "Make 8 Andesite Alloys (andesite + iron nugget)."],
    "cl.missao.cr_manivela.titulo": ["Girando", "Spinning"], "cl.missao.cr_manivela.desc": ["Gire uma Manivela ligada a uma máquina.", "Turn a Hand Crank connected to a machine."],
    "cl.missao.cr_mo.titulo": ["Farinha", "Flour"], "cl.missao.cr_mo.desc": ["Faça 8 Farinhas na Mó.", "Make 8 Flour in the Millstone."],
    "cl.missao.cr_prensa.titulo": ["Chapas", "Sheets"], "cl.missao.cr_prensa.desc": ["Faça 8 Chapas de Ferro na Prensa Mecânica.", "Make 8 Iron Sheets in the Mechanical Press."],
    "cl.missao.cr_latao.titulo": ["Latão", "Brass"], "cl.missao.cr_latao.desc": ["Faça 4 Lingotes de Latão no Misturador (cobre + zinco).", "Make 4 Brass Ingots in the Mixer (copper + zinc)."],
    "cl.missao.cr_moinho.titulo": ["Moinho de vento", "Windmill"], "cl.missao.cr_moinho.desc": ["Coloque um Rolamento de Moinho com 16 velas.", "Place a Windmill Bearing with 16 sails."],
    "cl.missao.cr_lavar.titulo": ["Lavagem", "Washing"], "cl.missao.cr_lavar.desc": ["Lave 8 itens com o Ventilador soprando por água.", "Wash 8 items with a Fan blowing through water."],
  },
};

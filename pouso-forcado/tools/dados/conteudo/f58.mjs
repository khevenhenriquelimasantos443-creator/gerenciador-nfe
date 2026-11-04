// Fase 58 (1.39.0): CC: Tweaked 1.121 (o mais novo, mc-1.21.x; arte CCPL e MPL-2.0, tools/importar-cct.py). Sem Lua no
// Bedrock, as peças do mod viram blocos de usar na hora; scripts em scripts/utilidades/robo.ts e cctweaked.ts.
// - Robô: ferramentas trocáveis como os upgrades das turtles (toque o robô com uma picareta, machado, enxada ou espada):
//   picareta cava (túnel e escavar), machado corta árvores e replanta, enxada colhe e replanta a plantação, espada guarda
//   a área. Combustível até 20.000 (turtleFuelLimit) e o Robô Avançado até 100.000 (advancedTurtleFuelLimit).
// - Monitor: mostra um texto grande na frente. Impressora: papel + tinta (corante preto ou bolsa de tinta) → Página
//   Impressa com título e texto; 2 a 16 páginas + couro → Livro Impresso. Alto-falante: toque toca a nota (agachado
//   troca o instrumento); com redstone, toca sozinho.
const CC = { mod: "ComputerCraft" };
export const INSTRUMENTOS = [
  ["harp", "Harpa", "Harp"], ["bass", "Baixo", "Bass"], ["bd", "Bumbo", "Bass Drum"], ["snare", "Caixa", "Snare"], ["hat", "Chimbal", "Hat"],
  ["guitar", "Violão", "Guitar"], ["flute", "Flauta", "Flute"], ["bell", "Sino", "Bell"], ["chime", "Carrilhão", "Chime"],
  ["xylophone", "Xilofone", "Xylophone"], ["iron_xylophone", "Vibrafone", "Iron Xylophone"], ["cow_bell", "Sino de Vaca", "Cow Bell"],
  ["didgeridoo", "Didjeridu", "Didgeridoo"], ["bit", "Bit", "Bit"], ["banjo", "Banjo", "Banjo"], ["pling", "Piano Elétrico", "Pling"],
];
const caixa = (id, pt, en, cor, comp, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, dureza: 2, comp: `cl:${comp}`, ...CC, ...extra });

export default {
  fase: 58,
  mod: "ComputerCraft",
  itens: [
    { id: "robo_avancado", pt: "Robô Minerador Avançado", en: "Advanced Mining Turtle", icone: "bloco:#e0b84a", pilha: 1, ...CC },
    { id: "pagina_impressa", pt: "Página Impressa", en: "Printed Page", icone: "placa:#f2efe6", pilha: 1, ...CC },
    { id: "livro_impresso", pt: "Livro Impresso", en: "Printed Book", icone: "placa:#8a5a2a", pilha: 1, ...CC },
  ],
  blocos: [
    caixa("monitor", "Monitor", "Monitor", "#3a3a3a", "monitor"),
    caixa("impressora", "Impressora", "Printer", "#b8b8b8", "impressora"),
    caixa("alto_falante", "Alto-falante", "Speaker", "#7a7a7a", "alto_falante", { tick: [4, 4] }),
  ],
  receitas: [
    { id: "robo_avancado", tipo: "shaped", padrao: ["GPG", "GCG", "GBG"], chave: { G: "minecraft:gold_ingot", P: "minecraft:diamond_pickaxe", C: "cl:computador", B: "minecraft:chest" }, resultado: "cl:robo_avancado" },
    { id: "monitor", tipo: "shaped", padrao: ["SSS", "SGS", "SSS"], chave: { S: "minecraft:stone", G: "minecraft:glass_pane" }, resultado: "cl:monitor" },
    { id: "impressora", tipo: "shaped", padrao: ["SSS", "SRS", "SDS"], chave: { S: "minecraft:stone", R: "minecraft:redstone", D: "minecraft:ink_sac" }, resultado: "cl:impressora" },
    { id: "alto_falante", tipo: "shaped", padrao: ["SSS", "SNS", "SRS"], chave: { S: "minecraft:stone", N: "minecraft:noteblock", R: "minecraft:redstone" }, resultado: "cl:alto_falante" },
  ],
  textos: {
    "entity.cl:texto_monitor.name": ["Texto", "Text"],
    "cl.cc.ferramenta": ["Robô: ferramenta trocada (%s).", "Turtle: tool swapped (%s)."],
    "cl.cc.picareta": ["picareta", "pickaxe"], "cl.cc.machado": ["machado", "axe"], "cl.cc.enxada": ["enxada", "hoe"], "cl.cc.espada": ["espada", "sword"],
    "cl.cc.lenhador": ["Cortar árvores numa linha de %s (replanta as mudas)", "Chop trees along a line of %s (replants saplings)"],
    "cl.cc.agricultor": ["Colher e replantar a plantação %s×%s à frente", "Harvest and replant the %s×%s field ahead"],
    "cl.cc.guarda": ["Guardar a área (ataca monstros a 3 blocos)", "Guard the area (attacks monsters within 3 blocks)"],
    "cl.cc.limite": ["Combustível no limite (%s).", "Fuel at the limit (%s)."],
    "cl.cc.monitor_titulo": ["Monitor", "Monitor"], "cl.cc.monitor_texto": ["Texto (use | para quebrar a linha)", "Text (use | for a line break)"],
    "cl.cc.impressora_titulo": ["Impressora", "Printer"], "cl.cc.impressora_nome": ["Título", "Title"], "cl.cc.impressora_texto": ["Texto (use | para quebrar a linha)", "Text (use | for a line break)"],
    "cl.cc.sem_papel": ["A impressora precisa de papel e tinta (corante preto ou bolsa de tinta) no seu inventário.", "The printer needs paper and ink (black dye or ink sac) in your inventory."],
    "cl.cc.nota": ["Alto-falante: %s, nota %s", "Speaker: %s, note %s"],
    ...Object.fromEntries(INSTRUMENTOS.map(([id, pt, en]) => [`cl.cc.inst.${id}`, [pt, en]])),
    "cl.capitulo.cct.nome": ["CC: Tweaked", "CC: Tweaked"],
    "cl.capitulo.cct.curto": ["CC: Tweaked", "CC: Tweaked"],
    "cl.capitulo.cct.desc": ["O robô com ferramentas trocáveis (cavar, cortar árvores, colher, guardar), o Robô Avançado, o Monitor, a Impressora e o Alto-falante.", "The turtle with swappable tools (dig, chop trees, farm, guard), the Advanced Turtle, the Monitor, the Printer and the Speaker."],
    "cl.missao.cct_lenhador.titulo": ["Robô lenhador", "Felling turtle"], "cl.missao.cct_lenhador.desc": ["Dê um machado ao robô e mande cortar árvores.", "Give the turtle an axe and have it chop trees."],
    "cl.missao.cct_agricultor.titulo": ["Robô agricultor", "Farming turtle"], "cl.missao.cct_agricultor.desc": ["Dê uma enxada ao robô e mande colher a plantação.", "Give the turtle a hoe and have it harvest the field."],
    "cl.missao.cct_guarda.titulo": ["Robô guarda", "Melee turtle"], "cl.missao.cct_guarda.desc": ["Dê uma espada ao robô e deixe ele derrubar um monstro.", "Give the turtle a sword and let it take down a monster."],
    "cl.missao.cct_avancado.titulo": ["Robô Avançado", "Advanced Turtle"], "cl.missao.cct_avancado.desc": ["Tenha um Robô Minerador Avançado (100.000 de combustível).", "Have an Advanced Mining Turtle (100,000 fuel)."],
    "cl.missao.cct_monitor.titulo": ["Monitor", "Monitor"], "cl.missao.cct_monitor.desc": ["Escreva um texto num Monitor.", "Write a text on a Monitor."],
    "cl.missao.cct_impressora.titulo": ["Impressora", "Printer"], "cl.missao.cct_impressora.desc": ["Imprima uma página.", "Print a page."],
  },
  dados: { instrumentos: INSTRUMENTOS.map(([id]) => id) },
};

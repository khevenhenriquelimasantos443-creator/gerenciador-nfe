// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

import { BEBIDAS_HC, COMIDAS_HC, ITENS_HC, TEMPERATURA_HC } from "./harvest/gerado.js";

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.20.1";

// Variantes do bioma de deserto (ver README: "Por que dois arquivos de bioma").
export const BIOMAS_DESERTO = [`${NS}:deserto_seco`, `${NS}:deserto_seco_ns`] as const;

export const IDS = {
  condensadorAgua: `${NS}:condensador_agua`,
  condensadorAvancado: `${NS}:condensador_avancado`,
  peneira: `${NS}:peneira`,
  compostor: `${NS}:compostor`,
  estufa: `${NS}:estufa`,
  painelSolar: `${NS}:painel_solar`,
  gerador: `${NS}:gerador`,
  bateria: `${NS}:bateria`,
  cabo: `${NS}:cabo`,
  peneiraAutomatica: `${NS}:peneira_automatica`,
  moinho: `${NS}:moinho`,
  geradorMonstros: `${NS}:gerador_monstros`,
  diarioBordo: `${NS}:diario_bordo`,
  frutaCacto: `${NS}:fruta_cacto`,
  aguaExcelente: `${NS}:agua_excelente`,
  aguaBoa: `${NS}:agua_boa`,
  aguaSuja: `${NS}:agua_suja`,
  aguaMuitoSuja: `${NS}:agua_muito_suja`,
  aguaImpropria: `${NS}:agua_impropria`,
  idolo: `${NS}:idolo_amaldicoado`,
  faixaMumia: `${NS}:faixa_mumia`,
  coracaoFarao: `${NS}:coracao_farao`,
  montadora: `${NS}:montadora`,
  painelNave: `${NS}:painel_nave`,
  terminal: `${NS}:terminal`,
  placaCasco: `${NS}:placa_casco`,
  circuito: `${NS}:circuito`,
  celulaCombustivel: `${NS}:celula_combustivel`,
  motorNave: `${NS}:motor_nave`,
  computadorBordo: `${NS}:computador_bordo`,
  catalogo: `${NS}:catalogo`,
  organizador: `${NS}:organizador`,
  sacolaComum: `${NS}:sacola_comum`,
  sacolaBoa: `${NS}:sacola_boa`,
  sacolaOtima: `${NS}:sacola_otima`,
  sacolaEpica: `${NS}:sacola_epica`,
  sacolaLendaria: `${NS}:sacola_lendaria`,
  // Fase 12: Ex Nihilo + Ex Aliquo
  poeira: `${NS}:poeira`,
  pedrinha: `${NS}:pedrinha`,
  barrilMadeira: `${NS}:barril_madeira`,
  barrilPedra: `${NS}:barril_pedra`,
  cadinho: `${NS}:cadinho`,
  cadinhoCru: `${NS}:cadinho_cru`,
  porcelana: `${NS}:porcelana`,
  cajado: `${NS}:cajado`,
  bichoSeda: `${NS}:bicho_seda`,
  bichoSedaCozido: `${NS}:bicho_seda_cozido`,
  folhaInfestada: `${NS}:folha_infestada`,
  // Fase 13: EnviroMine
  camelPack: `${NS}:camel_pack`,
  mascara: `${NS}:mascara`,
  filtro: `${NS}:filtro`,
} as const;

// Monstros do deserto (Fase 7). Os comportamentos estão em BP/entities/*.json.
export const MONSTROS_CL = {
  mumia: `${NS}:mumia`,
  escorpiao: `${NS}:escorpiao`,
  golem: `${NS}:golem_areia`,
  farao: `${NS}:farao`,
} as const;

// Família dos monstros que o sol não queima nem apaga (golem da tempestade e o faraó).
export const FAMILIA_RESISTE_SOL = "cl_resiste_sol";

// Chaves de dynamic properties (salvas no mundo/jogador).
export const PROPS = {
  boasVindasVista: `${NS}:boas_vindas_vista`, // jogador
  naveColocada: `${NS}:nave_colocada`, // mundo
  naveChunk: `${NS}:nave_chunk`, // mundo: "cx,cz" do chunk da nave
  sementeRelevo: `${NS}:semente_relevo`, // mundo
  tipoMundo: `${NS}:tipo_mundo`, // mundo: "plano" (o do add-on) ou "normal" (relevo desligado)
  pontos: `${NS}:pontos`, // mundo: JSON com masmorras e destroços já gerados (para as missões)
  visitados: `${NS}:visitados`, // jogador: JSON com os lugares que ele já achou
  tempestadeAte: `${NS}:tempestade_ate`, // mundo: tempo absoluto em que a tempestade acaba
  tempestadeFim: `${NS}:tempestade_fim`, // mundo: tempo absoluto em que a última tempestade acabou
  reparos: `${NS}:reparos`, // mundo: sistemas da nave já consertados, separados por vírgula
  diarioRecebido: `${NS}:diario_recebido`, // jogador
  missoes: `${NS}:missoes`, // jogador: JSON com o progresso (scripts/missoes/progresso.ts)
  ondaFeita: `${NS}:onda_feita`, // mundo: "dia:k" da última onda da horda
  sede: `${NS}:sede`, // jogador (até a 0.18): água de 0 a 20; migrada para "hidratacao"
  temperatura: `${NS}:temperatura`, // jogador (até a 0.18): -20 a 20; migrada para "corpo"
  hidratacao: `${NS}:hidratacao`, // jogador: hidratação do EnviroMine (0 a 100)
  corpo: `${NS}:corpo`, // jogador: temperatura do corpo em °C
  ar: `${NS}:ar`, // jogador: qualidade do ar (0 a 100)
  desidrata: `${NS}:desidrata`, // jogador: atualizações que faltam do efeito Desidratação (água salgada)
  congelamento: `${NS}:congelamento`, // jogador: nível de congelamento (0, 1, 2) e tempo no frio "nivel:tempo"
  bemAlimentado: `${NS}:bem_alimentado`, // jogador: tick absoluto até quando dura o Bem Alimentado
  regraRegen: `${NS}:regra_regen`, // mundo: regeneração natural já desligada (Hunger Overhaul)
  capsulaDia: `${NS}:capsula_dia`, // mundo: dia da última cápsula de carga
  capsulas: `${NS}:capsulas`, // mundo: JSON com as cápsulas ainda não encontradas
  olharDesligado: `${NS}:olhar_desligado`, // jogador: esconde o "o que estou olhando" da barra de ação
  reabastecerDesligado: `${NS}:reabastecer_desligado`, // jogador: não repõe o item da mão sozinho
} as const;

// Nave caída: estrutura em BP/structures/cl/nave_caida.mcstructure.
// A origem fica 2 blocos abaixo do chão, ao lado do primeiro jogador que entrar.
export const NAVE = {
  estrutura: `${NS}:nave_caida`,
  deslocamento: { x: -6, y: -2, z: 3 }, // em relação ao jogador
  bau: { x: 6, y: 2, z: 8 }, // dentro da estrutura (igual ao BAU de tools/gerar-nave.mjs)
} as const;

// O que sobrou da carga. Vai no baú da nave (ou direto para o jogador, se a nave falhar).
export const SUPRIMENTOS: ReadonlyArray<{ item: string; quantidade: number }> = [
  { item: IDS.condensadorAgua, quantidade: 1 },
  { item: "minecraft:bucket", quantidade: 1 },
  { item: "minecraft:bread", quantidade: 6 },
  { item: "minecraft:torch", quantidade: 8 },
  { item: "minecraft:dirt", quantidade: 4 },
  { item: "minecraft:oak_sapling", quantidade: 2 },
];

// Noite e dia (scripts/mundo/horda_noturna.ts).
export const HORDA = {
  intervaloTicks: 100, // a cada 5 s, à noite
  porVez: 4, // monstros extras por jogador por ciclo
  limitePerto: 60, // não reforça se já houver tantos monstros por perto
  raioContagem: 48,
  distanciaMin: 12, // longe o bastante para não nascer na cara do jogador
  distanciaMax: 28,
  mobs: [
    "minecraft:husk", "minecraft:husk", "minecraft:zombie", "minecraft:skeleton", "minecraft:skeleton",
    "minecraft:spider", "minecraft:creeper", "cl:mumia", "cl:mumia", "cl:escorpiao", "cl:escorpiao",
  ],
  // As ondas da horda: em cada uma dessas horas da noite, uma onda em volta de cada jogador.
  // Tamanho = base + porDia × dia do mundo (até max).
  onda: { horas: [14000, 17000, 20000], base: 12, porDia: 3, max: 40, distanciaMin: 8, distanciaMax: 20 },
  // De dia, monstros expostos ao céu pegam fogo.
  sol: { intervaloTicks: 100, segundosFogo: 8 },
} as const;

// Mundo plano do .mcworld. Tem que bater com tools/gerar-mundo.mjs.
export const MUNDO_PLANO = {
  superficieY: 45, // primeiro bloco de ar acima da areia
  // Marca de "chunk já decorado": um bloco na 1ª camada de ardósia, no canto do chunk.
  // Deepslate reforçado não quebra no sobrevivência, então a marca não some.
  marcadorY: -63,
  marcador: "minecraft:reinforced_deepslate",
  // Como é o mundo plano em y = -63 (onde fica a marca de "chunk ainda não decorado").
  pedraEsperada: "minecraft:deepslate",
  // Assinatura do mundo plano: estas camadas exatas, na coluna do canto do chunk. O mundo normal
  // também tem ardósia em y = -63, então só ela não basta para saber se o mundo é o plano.
  assinatura: [
    { y: 0, bloco: "minecraft:deepslate" },
    { y: 1, bloco: "minecraft:stone" },
    { y: 32, bloco: "minecraft:stone" },
    { y: 33, bloco: "minecraft:sandstone" },
    { y: 39, bloco: "minecraft:sandstone" },
  ],
} as const;

// Minérios espalhados por script em cada chunk do mundo plano (scripts/mundo/minerios.ts).
// veios = quantos por chunk; tamanho = blocos por veio (aprox.); y = faixa de altura.
// Só substituem pedra e ardósia; abaixo de y = 0 sai a versão de ardósia do minério.
export const MINERIOS: ReadonlyArray<{ minerio: string; veios: number; tamanho: number; yMin: number; yMax: number }> = [
  { minerio: "coal", veios: 10, tamanho: 9, yMin: 0, yMax: 32 },
  { minerio: "copper", veios: 5, tamanho: 8, yMin: -16, yMax: 32 },
  { minerio: "iron", veios: 9, tamanho: 7, yMin: -60, yMax: 32 },
  { minerio: "gold", veios: 3, tamanho: 6, yMin: -60, yMax: -10 },
  { minerio: "redstone", veios: 4, tamanho: 6, yMin: -60, yMax: -40 },
  { minerio: "lapis", veios: 2, tamanho: 5, yMin: -60, yMax: 0 },
  { minerio: "diamond", veios: 1, tamanho: 4, yMin: -60, yMax: -50 },
];

// Relevo espalhado por script conforme o jogador explora (scripts/mundo/relevo.ts).
// chance = probabilidade por chunk; tamanho = área no chão; deslocY = quanto fica enterrado.
export const RELEVO = {
  intervaloTicks: 10, // a cada 0,5 s
  raioChunks: 12, // prepara o relevo até esta distância (em chunks), carregando chunks à frente
  maxPorCiclo: 3, // chunks decorados por ciclo (6 por segundo): limita o peso
  areaLado: 4, // ticking area de 4×4 chunks para carregar os chunks distantes
  areaEsperaTicks: 200, // desiste de uma ticking area que não carregou em 10 s
  distanciaNave: 3, // chunks sem estruturas em volta da nave
  arbustoSeco: 0.3, // chance de 1 a 3 arbustos secos (gravetos) no chunk
  cacto: { chance: 0.35, maxPorChunk: 3 }, // chance de ter cactos no chunk; até quantos
  pecas: [
    // Peças pequenas, sorteadas chunk a chunk, só nas planícies (onde não há duna).
    { estrutura: `${NS}:morro`, chance: 0.06, tamanho: 17, deslocY: 0, girar: true },
    { estrutura: `${NS}:mesa`, chance: 0.04, tamanho: 13, deslocY: 0, girar: true },
    { estrutura: `${NS}:rochas`, chance: 0.1, tamanho: 9, deslocY: 0, girar: true },
  ],
} as const;

// Estruturas raras (scripts/mundo/raras.ts): o mapa é dividido em quadrados de "celula" chunks
// e cada quadrado tem no máximo UMA, num chunk sorteado lá dentro (com "chance" de existir).
// Assim ficam espalhadas ao acaso, sem amontoar. O chão em volta fica plano (sem dunas).
// 242 chunks = 3.872 blocos: 15 de cada tipo a cada 15.000 × 15.000 blocos.
// Para achar: /cl:templo e /cl:destrocos (scripts/jogador/comandos.ts).
export const RARAS = [
  {
    tipo: "templo",
    estrutura: `${NS}:templo_soterrado`,
    celula: 242,
    chance: 1,
    tamanho: 15,
    deslocY: -3,
    bau: { x: 7, y: 1, z: 7 },
    saque: "templo",
  },
  {
    tipo: "destrocos",
    estrutura: `${NS}:nave_caida`, // a mesma estrutura da sua nave, com outro saque
    celula: 242,
    chance: 1,
    tamanho: 17, // a nave tem 13×17
    deslocY: -2,
    bau: { x: 6, y: 2, z: 8 },
    saque: "destrocos",
    ponto: "destrocos",
  },
] as const;
export const RARAS_BORDA_PLANA = 20; // blocos sem duna em volta de cada estrutura rara

// Dunas por ruído contínuo (scripts/mundo/dunas.ts). Escalas em blocos.
export const DUNAS = {
  escalaCampo: 260, // tamanho dos campos de dunas e das planícies entre eles
  campoMin: -0.15, // abaixo disso: planície lisa
  campoMax: 0.25, // acima disso: campo de dunas completo
  escalaCrista: 34, // distância entre cristas (na direção do vento)
  comprimentoCrista: 110, // comprimento das cristas
  alturaMin: 3,
  alturaMax: 10,
  planoNave: 40, // raio plano em volta da nave (blocos); as dunas sobem nos 40 seguintes
} as const;

// Saque do baú do templo soterrado: cada linha entra com a chance indicada.
export const TEMPLO_SAQUE: ReadonlyArray<{ item: string; min: number; max: number; chance: number }> = [
  { item: "minecraft:bone", min: 2, max: 5, chance: 0.9 },
  { item: "minecraft:stick", min: 2, max: 6, chance: 0.7 },
  { item: "minecraft:rotten_flesh", min: 1, max: 4, chance: 0.6 },
  { item: "minecraft:string", min: 1, max: 3, chance: 0.5 },
  { item: "minecraft:iron_nugget", min: 1, max: 5, chance: 0.35 },
  { item: "minecraft:bread", min: 1, max: 2, chance: 0.3 },
  { item: "minecraft:dirt", min: 1, max: 3, chance: 0.25 },
  { item: "minecraft:oak_sapling", min: 1, max: 1, chance: 0.15 },
  { item: "minecraft:bucket", min: 1, max: 1, chance: 0.08 },
];

// O intervalo do condensador é definido no JSON do bloco (minecraft:tick, 600 ticks = 30 s).
// Mantido aqui só como referência para textos e testes.
export const CONDENSADOR_SEGUNDOS = 30;

// ---- Fase 3: máquinas (scripts/blocos/) ----

// Peneira (scripts/blocos/peneira.ts): carrega 1 bloco e, depois de PENEIRA_TOQUES toques, sorteia cada linha da tabela.
export type Achado = { item: string; chance: number; max?: number };
// Fase 12: as tabelas do Ex Nihilo (chance = 1/raridade; cada linha é sorteada à parte e solta 1 item).
// Terra, cascalho, areia e poeira, como no Ex Nihilo 1.29 (Crash Landing). Os pedaços de minério
// (quebrado/triturado/em pó) têm a mesma raridade nos três: ferro 1/5, ouro 1/32, cobre 1/18.
const pedacos = (estagio: string): Achado[] => [
  { item: `${NS}:ferro_${estagio}`, chance: 1 / 5 },
  { item: `${NS}:ouro_${estagio}`, chance: 1 / 32 },
  { item: `${NS}:cobre_${estagio}`, chance: 1 / 18 },
];
export const PENEIRA: Readonly<Record<string, ReadonlyArray<Achado>>> = {
  "minecraft:dirt": [
    { item: `${NS}:pedrinha`, chance: 1 },
    { item: `${NS}:pedrinha`, chance: 1 },
    { item: `${NS}:pedrinha`, chance: 1 / 2 },
    { item: `${NS}:pedrinha`, chance: 1 / 2 },
    { item: `${NS}:pedrinha`, chance: 1 / 3 },
    { item: `${NS}:pedrinha`, chance: 1 / 3 },
    // Fase 14: sementes do HarvestCraft no lugar das do jogo (como no Crash Landing).
    { item: `${NS}:semente_milho`, chance: 1 / 15 },
    { item: `${NS}:semente_tomate`, chance: 1 / 15 },
    { item: "minecraft:short_grass", chance: 1 / 15 },
    { item: `${NS}:semente_cebola`, chance: 1 / 32 },
    { item: `${NS}:semente_alho`, chance: 1 / 32 },
    { item: `${NS}:semente_feijao`, chance: 1 / 32 },
    { item: "minecraft:sugar_cane", chance: 1 / 32 },
    { item: `${NS}:semente_pimenta`, chance: 1 / 64 },
    { item: `${NS}:semente_pimentao`, chance: 1 / 64 },
    { item: `${NS}:semente_arroz`, chance: 1 / 64 },
    { item: `${NS}:semente_amendoim`, chance: 1 / 64 },
    { item: "minecraft:oak_sapling", chance: 1 / 64 },
    { item: "minecraft:spruce_sapling", chance: 1 / 90 },
    { item: "minecraft:birch_sapling", chance: 1 / 90 },
    { item: "minecraft:acacia_sapling", chance: 1 / 90 },
  ],
  "minecraft:gravel": [
    { item: "minecraft:flint", chance: 1 / 4 },
    { item: "minecraft:coal", chance: 1 / 8 },
    { item: "minecraft:lapis_lazuli", chance: 1 / 20 },
    { item: "minecraft:diamond", chance: 1 / 128 },
    { item: "minecraft:emerald", chance: 1 / 150 },
    ...pedacos("quebrado"),
  ],
  "minecraft:sand": [
    { item: "minecraft:cocoa_beans", chance: 1 / 32 },
    { item: "minecraft:cactus", chance: 1 / 32 },
    { item: `${NS}:semente_fruta_cacto`, chance: 1 / 32 },
    { item: "minecraft:jungle_sapling", chance: 1 / 64 },
    { item: "minecraft:brown_mushroom", chance: 1 / 128 }, // no Ex Nihilo: esporos
    ...pedacos("triturado"),
  ],
  [`${NS}:poeira`]: [
    { item: "minecraft:bone_meal", chance: 1 / 5 },
    { item: "minecraft:redstone", chance: 1 / 8 },
    { item: "minecraft:gunpowder", chance: 1 / 15 },
    { item: "minecraft:glowstone_dust", chance: 1 / 16 },
    { item: "minecraft:blaze_powder", chance: 1 / 20 },
    ...pedacos("po"),
  ],
};
// Toques para peneirar um bloco: no Ex Nihilo cada clique soma 0,075 (14 cliques), no máximo
// 1 a cada 4 ticks. Segurar o dedo na peneira conta como vários toques.
export const PENEIRA_TOQUES = 14;

// Compostor de terra: restos valem pontos; com 8 pontos ele decompõe por COMPOSTOR_SEGUNDOS
// (minecraft:tick no JSON) e vira 1 terra.
export const COMPOSTOR_PONTOS: Readonly<Record<string, number>> = {
  "minecraft:rotten_flesh": 2,
  "minecraft:wheat": 2,
  "minecraft:apple": 2,
  "minecraft:bread": 3,
  "minecraft:carrot": 1,
  "minecraft:potato": 1,
  "minecraft:beetroot": 1,
  "minecraft:melon_slice": 1,
  "minecraft:pumpkin": 4,
  "minecraft:wheat_seeds": 1,
  "minecraft:beetroot_seeds": 1,
  "minecraft:pumpkin_seeds": 1,
  "minecraft:melon_seeds": 1,
  "minecraft:oak_leaves": 1,
  "minecraft:birch_leaves": 1,
  "minecraft:acacia_leaves": 1,
  "minecraft:oak_sapling": 1,
  "minecraft:birch_sapling": 1,
  "minecraft:acacia_sapling": 1,
  "minecraft:cactus": 1,
  "minecraft:sugar_cane": 1,
  "minecraft:deadbush": 1,
  "minecraft:stick": 1,
};
export const COMPOSTOR_CHEIO = 8;
export const COMPOSTOR_SEGUNDOS = 20;

// Condensador Avançado: 1 balde a cada 10 s, guarda até 4.
export const CONDENSADOR_AVANCADO = { capacidade: 4, segundos: 10 } as const;

// Estufa: a cada 10 s (minecraft:tick no JSON) molha a terra arada e acelera plantas em volta.
export const ESTUFA = {
  raio: 4, // blocos para cada lado (área 9×9)
  yAbaixo: 1, // da camada abaixo da estufa...
  yAcima: 2, // ...até 2 acima
  chanceCrescer: 0.5, // por planta, por ciclo
} as const;

// Fase 14: plantações do HarvestCraft (scripts/blocos/plantacao.ts). A cada minecraft:tick (30 a 60 s)
// a planta sobe 1 estágio (0 → 2) com chance = base × HO × bioma × água; com luz menor que luzMin não cresce.
export const PLANTACAO = {
  chance: 0.5,
  hungerOverhaul: 0.25, // HO: plantações crescem 4× mais devagar
  biomaErrado: 0.5, // fora do deserto para a fruta do cacto; no deserto para as outras
  terraSeca: 0.5, // terra arada sem água
  luzMin: 9,
  colheita: [1, 3], // HO: colheita menor (na colheita com a mão e ao quebrar madura)
  farinhaOsso: 1 / 3, // chance de subir 1 estágio (no Difícil não funciona, como no HO)
} as const;

// ---- Fase 4: comida e vida ----

// Sede = hidratação do EnviroMine (scripts/jogador/sede.ts): 0 a 100, conferida a cada 30 ticks.
// O mundo todo é deserto: conta sempre como bioma seco (e "seco de dia").
export const SEDE = {
  max: 100,
  porAtualizacao: { base: 0.05, seco: 0.05, secoDia: 0.05, suor: 0.1, correndo: 0.05, efeitoFome: 0.1 },
  fracaAbaixoDe: 10, // fraqueza, fadiga e lentidão
  danoEmZero: 4, // por atualização (1,5 s)
  // Comidas que também mexem na hidratação (EnviroMine): as águas ficam em AGUAS.
  bebidas: {
    "minecraft:milk_bucket": 10,
    "minecraft:honey_bottle": 10,
    [`${NS}:fruta_cacto`]: 10, // fruta suculenta do deserto (valor de projeto, entre a maçã e o leite)
    "minecraft:melon_slice": 5,
    "minecraft:sweet_berries": 5,
    ...BEBIDAS_HC, // sopas e sucos do HarvestCraft
    "minecraft:apple": 5,
    "minecraft:carrot": 5,
    "minecraft:golden_carrot": 5,
    "minecraft:mushroom_stew": 5,
    "minecraft:beetroot_soup": 5,
    "minecraft:rabbit_stew": 5,
    "minecraft:pumpkin_pie": 5,
    "minecraft:golden_apple": 10,
    "minecraft:rotten_flesh": -5,
    "minecraft:spider_eye": -5,
    "minecraft:poisonous_potato": -5,
  } as Readonly<Record<string, number>>,
} as const;

// Fruta do cacto: chance de cair ao quebrar um cacto.
export const FRUTA_CACTO_CHANCE = 0.3;

// Cápsulas de carga (scripts/mundo/capsulas.ts): uma por dia, de manhã, a partir do dia 1,
// perto de um jogador. Trazem um casal de animais e um barril com o que está abaixo.
export const CAPSULA = {
  horaMin: 1000, // entre estas horas do dia
  horaMax: 9000,
  primeiroDia: 1,
  distanciaMin: 20,
  distanciaMax: 48,
  achouRaio: 5, // chegar a tantos blocos dela conta como "encontrada"
  animais: ["minecraft:cow", "minecraft:sheep", "minecraft:chicken", "minecraft:pig"],
  saque: [
    { item: "minecraft:glass_bottle", min: 2, max: 4, chance: 0.9 },
    { item: "cl:agua_boa", min: 1, max: 3, chance: 0.6 },
    { item: "cl:agua_excelente", min: 1, max: 1, chance: 0.15 },
    { item: "minecraft:bread", min: 2, max: 4, chance: 0.7 },
    { item: "minecraft:carrot", min: 1, max: 3, chance: 0.45 },
    { item: "minecraft:potato", min: 1, max: 3, chance: 0.45 },
    { item: "minecraft:sweet_berries", min: 2, max: 4, chance: 0.35 },
    { item: "minecraft:melon_seeds", min: 1, max: 2, chance: 0.35 },
    { item: "minecraft:pumpkin_seeds", min: 1, max: 2, chance: 0.3 },
    { item: "minecraft:beetroot_seeds", min: 2, max: 4, chance: 0.35 },
    { item: "minecraft:egg", min: 2, max: 4, chance: 0.3 },
    { item: "minecraft:apple", min: 1, max: 3, chance: 0.3 },
    { item: "minecraft:birch_sapling", min: 1, max: 2, chance: 0.25 },
    { item: "minecraft:string", min: 2, max: 5, chance: 0.4 },
    { item: "minecraft:lead", min: 1, max: 2, chance: 0.4 },
    { item: "minecraft:iron_ingot", min: 1, max: 3, chance: 0.3 },
    { item: "minecraft:copper_ingot", min: 2, max: 5, chance: 0.3 },
    { item: "minecraft:name_tag", min: 1, max: 1, chance: 0.05 },
    { item: "minecraft:diamond", min: 1, max: 1, chance: 0.03 },
  ],
} as const;

// Temperatura do corpo do EnviroMine (scripts/jogador/temperatura.ts), em °C. A cada 30 ticks o corpo
// anda em direção à temperatura do ar com passo velocidade × (|corpo − ar| / 10, se a diferença > 10).
export const TEMPERATURA = {
  normal: 37,
  ar: { dia: 65, noiteDivisor: 9, sombra: -2.5, agua: -5, dormindo: 5, correndo: 2, chamasMin: 75 },
  velocidade: { subida: 0.001, subidaSeco: 0.005, descida: 0.001, descidaAgua: 0.01, correndoMin: 0.01, chamas: 0.1, fonteForte: 5 },
  suor: { aPartirDe: 38.02, hidratacaoMin: 75, esfria: 0.01 },
  // Fontes de calor (pega a maior; cai com a distância: t × (1 − d²/75)). Fonte mais quente que o ar:
  // ar = (ar + fonte)/2; passando de ar + 5, o corpo esquenta 5× mais rápido.
  fontes: {
    "minecraft:lava": 200, "minecraft:flowing_lava": 200, "minecraft:fire": 100, "minecraft:soul_fire": 100,
    "minecraft:campfire": 100, "minecraft:soul_campfire": 100, "minecraft:torch": 75, "minecraft:lit_furnace": 75,
    "minecraft:lit_blast_furnace": 75, "minecraft:lit_smoker": 75, "minecraft:netherrack": 50, "minecraft:magma": 75,
    [`${NS}:gerador`]: 75,
  } as Readonly<Record<string, number>>,
  raioFontes: { h: 4, v: 2 },
  quedaDistancia: 75,
  // Calor da terra (abaixo de 16 blocos da superfície): o EnviroMine soma 20 × (1 − Y/48) em biomas quentes.
  geotermico: 20,
  // Armadura por peça: soma (°C) e multiplicador; ferro esquenta ao sol, diamante refresca.
  armadura: {
    leather: { soma: [1, 1, 1], mult: [1, 1, 1] },
    iron: { soma: [-0.5, 0, 2.5], mult: [1, 1, 1.1] },
    golden: { soma: [0, 0, 0], mult: [1, 1, 1.2] },
    diamond: { soma: [0, 0, 0], mult: [1.1, 1, 0.9] },
  } as Readonly<Record<string, { soma: readonly [number, number, number]; mult: readonly [number, number, number] }>>, // [noite, sombra, sol]
  insolacao: [39, 41, 43],
  hipotermia: [35, 32, 30],
  danoExtremo: 4, // no nível III, com 50% de chance por atualização
  congelamento: { arMax: 10, corpoMax: 35, corpoSempre: 30, nivel1: 120, nivel2: 240, chanceSoltar: 1 / 20 },
  // Comida e bebida (°C): sopa/torta/carne cozida/batata assada esquentam; frutas refrescam.
  comida: {
    "minecraft:mushroom_stew": 0.05, "minecraft:beetroot_soup": 0.05, "minecraft:rabbit_stew": 0.05, "minecraft:pumpkin_pie": 0.05,
    "minecraft:cooked_beef": 0.05, "minecraft:cooked_porkchop": 0.05, "minecraft:cooked_chicken": 0.05, "minecraft:cooked_mutton": 0.05,
    "minecraft:baked_potato": 0.05, "minecraft:melon_slice": -0.01, "minecraft:carrot": -0.01, "minecraft:apple": -0.01, "minecraft:golden_carrot": -0.01,
    ...TEMPERATURA_HC,
  } as Readonly<Record<string, number>>,
  comidaTeto: 40,
} as const;

// Qualidades de água (scripts/jogador/aguas.ts), com os números do EnviroMine (hidratação 0 a 100):
//   excelente = água fria (+25, esfria 0,1 °C até 30,1); boa = limpa (+25, esfria 0,05 até 37,05);
//   suja = suja (+25, Fome e Veneno 25%); muito suja = pior que a suja (valor de projeto);
//   imprópria = SALGADA (+10 e depois Desidratação: −1 por atualização por 30 s, ≈ −20).
// "direto" = beber direto do condensador ou da poça (EnviroMine: +10, salgada +5).
// A garrafa de água do jogo (minecraft:potion) vem de fonte de água: no Crash Landing toda fonte é salgada.
export type Efeito = { id: string; segundos: number; chance: number; nivel?: number };
export type Agua = { agua: number; direto: number; esfria: number; piso: number; efeitos: ReadonlyArray<Efeito>; desidrata?: number };
const SALGADA: Agua = { agua: 10, direto: 5, esfria: 0, piso: 37, efeitos: [], desidrata: 20 };
export const AGUAS: Readonly<Record<string, Agua>> = {
  [`${NS}:agua_excelente`]: { agua: 25, direto: 10, esfria: 0.1, piso: 30.1, efeitos: [{ id: "regeneration", segundos: 5, chance: 1 }] },
  [`${NS}:agua_boa`]: { agua: 25, direto: 10, esfria: 0.05, piso: 37.05, efeitos: [] },
  [`${NS}:agua_suja`]: { agua: 25, direto: 10, esfria: 0, piso: 37, efeitos: [{ id: "hunger", segundos: 30, chance: 0.25 }, { id: "poison", segundos: 10, chance: 0.25 }] },
  [`${NS}:agua_muito_suja`]: {
    agua: 15, direto: 5, esfria: 0, piso: 37,
    efeitos: [{ id: "nausea", segundos: 10, chance: 0.8 }, { id: "poison", segundos: 10, chance: 0.5 }, { id: "hunger", segundos: 30, chance: 0.5 }],
  },
  [`${NS}:agua_impropria`]: SALGADA,
  "minecraft:potion": SALGADA,
};

// Beber direto de uma poça/fonte de água (agachado dentro da água, 1 gole a cada 2 s): é salgada.
export const POCA = SALGADA;

// Husks e zumbis carregam cantis velhos: chance de soltar água ruim ao morrer.
export const AGUA_DOS_MONSTROS: ReadonlyArray<{ item: string; chance: number }> = [
  { item: "cl:agua_muito_suja", chance: 0.06 },
  { item: "cl:agua_impropria", chance: 0.05 },
];

// ---- Fase 5: energia (scripts/util/rede.ts e scripts/blocos/energia.ts) ----
// Unidades de energia ("E") ficam guardadas nas baterias. Geradores mandam para a bateria
// mais próxima que tenha espaço; máquinas puxam da mais próxima que tenha carga.
// "Próxima" = encostada ou ligada por cabos (até rede.maxBlocos blocos de cabo).
export const ENERGIA = {
  // Na tela a energia aparece em RF (Redstone Flux, como no Thermal Expansion). Por dentro, a bateria
  // guarda "unidades" de 4.000 RF: o ciclo das máquinas é de 100 ticks, então 1 unidade por ciclo
  // = 40 RF/t (um painel solar), 2 = 80 RF/t (o gerador, igual ao Steam Dynamo), e o carvão (4 ciclos
  // de 2) dá 32.000 RF, como no Thermal Expansion 3.
  rfPorUnidade: 4000,
  ticksPorCiclo: 100,
  bateriaMax: 15, // E por bateria (o jogo aceita no máximo 16 valores por estado de bloco: 0 a 15)
  painelPorCiclo: 1, // E a cada 5 s, de dia, com céu aberto em cima do painel
  geradorPorCiclo: 2, // E a cada 5 s, gastando 1 de combustível
  // Moinho de vento: dia e noite, se os 4 lados estiverem livres (ar). Mais alto = mais vento.
  moinho: [
    { yMin: 75, porCiclo: 3 },
    { yMin: 60, porCiclo: 2 },
    { yMin: 50, porCiclo: 1 },
  ],
  geradorMax: 15, // combustível guardado no gerador (mesmo limite de 16 valores: 0 a 15)
  combustivel: {
    "minecraft:coal": 4,
    "minecraft:charcoal": 4,
    "minecraft:coal_block": 15,
    "minecraft:oak_log": 2,
    "minecraft:birch_log": 2,
    "minecraft:acacia_log": 2,
    "minecraft:oak_planks": 1,
    "minecraft:birch_planks": 1,
    "minecraft:acacia_planks": 1,
    "minecraft:stick": 1,
    "minecraft:dried_kelp_block": 8,
  } as Readonly<Record<string, number>>,
  peneiraPorE: 2, // a peneira automática peneira 2 blocos por E (a cada 5 s)
  rede: { maxBlocos: 64 },
  avisoRaio: 24, // jogador a até tantos blocos de uma máquina automática ganha o progresso das missões
} as const;

// ---- Fase 6: exploração e perigos ----

export type LinhaSaque = { item: string; min: number; max: number; chance: number };

// Cidades abandonadas (scripts/mundo/cidade.ts). O mapa é dividido em células de
// "celula" × "celula" chunks; cada célula tem uma cidade (menos a da nave) de
// (2·raio+1)² chunks, cada chunk um quarteirão: prédio, ruína ou, no centro, a torre de rádio.
export const CIDADE = {
  celula: 40, // chunks (640 blocos)
  raio: 3, // chunks em volta do centro (cidade de 7×7 chunks, 112×112 blocos)
  margem: 6, // a cidade fica inteira dentro da célula
  distanciaNave: 18, // nenhuma cidade a menos de tantos chunks da nave
  bordaPlana: 32, // blocos sem dunas em volta da cidade
  andaresMin: 2,
  andaresMax: 9, // perto do centro; diminui para as bordas
  chanceRuina: 0.2, // quarteirão só com escombros
  chanceBauPorAndar: 0.4,
  chanceMoveis: 0.6, // andar com móveis largados
  parede: "minecraft:cracked_stone_bricks",
  piso: "minecraft:stone_bricks",
  remendos: ["minecraft:stone_bricks", "minecraft:mossy_stone_bricks", "minecraft:cobblestone", "minecraft:andesite"],
  entulho: ["minecraft:cobblestone", "minecraft:gravel", "minecraft:cracked_stone_bricks", "minecraft:stone_brick_slab"],
  carpetes: ["minecraft:brown_carpet", "minecraft:gray_carpet", "minecraft:light_gray_carpet", "minecraft:red_carpet", "minecraft:white_carpet"],
  // Chão: o resto é areia.
  chao: {
    arenito: 0.35,
    pedra: 0.1,
    blocosArenito: ["minecraft:sandstone", "minecraft:smooth_sandstone", "minecraft:cut_sandstone"],
    blocosPedra: ["minecraft:polished_andesite", "minecraft:cracked_stone_bricks", "minecraft:cobblestone"],
  },
} as const;

export const CIDADE_SAQUE: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:iron_ingot", min: 1, max: 4, chance: 0.5 },
  { item: "minecraft:copper_ingot", min: 2, max: 6, chance: 0.5 },
  { item: "minecraft:redstone", min: 2, max: 6, chance: 0.4 },
  { item: "minecraft:glass_bottle", min: 1, max: 3, chance: 0.4 },
  { item: "cl:agua_boa", min: 1, max: 2, chance: 0.4 },
  { item: "cl:agua_suja", min: 1, max: 3, chance: 0.3 },
  { item: "minecraft:bread", min: 1, max: 3, chance: 0.35 },
  { item: "minecraft:paper", min: 2, max: 6, chance: 0.3 },
  { item: "cl:circuito", min: 1, max: 1, chance: 0.12 },
  { item: "minecraft:book", min: 1, max: 2, chance: 0.15 },
  { item: "minecraft:torch", min: 4, max: 10, chance: 0.35 },
  { item: "minecraft:leather_helmet", min: 1, max: 1, chance: 0.1 },
  { item: "minecraft:iron_pickaxe", min: 1, max: 1, chance: 0.05 },
  { item: "minecraft:gold_ingot", min: 1, max: 2, chance: 0.1 },
  { item: "minecraft:diamond", min: 1, max: 1, chance: 0.03 },
];
export const TORRE_SAQUE: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:diamond", min: 1, max: 3, chance: 1 },
  { item: "minecraft:iron_ingot", min: 4, max: 8, chance: 1 },
  { item: "minecraft:redstone", min: 8, max: 16, chance: 1 },
  { item: "minecraft:golden_apple", min: 1, max: 1, chance: 0.5 },
  { item: "cl:agua_excelente", min: 2, max: 3, chance: 1 },
];

// Masmorras (scripts/mundo/masmorra.ts): salas escondidas no subsolo com gerador de monstros.
export const MASMORRA = {
  chance: 0.04, // por chunk (fora das cidades)
  chanceFunda: 0.35, // das masmorras, quantas ficam na ardósia (mais perigosas e mais ricas)
  chancePoco: 0.5, // das comuns, quantas têm um poço até a superfície (anel de arenito entalhado)
  yComum: [12, 26],
  yFunda: [-45, -25],
} as const;
export const MASMORRA_SAQUE: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:bone", min: 2, max: 6, chance: 0.8 },
  { item: "minecraft:iron_ingot", min: 2, max: 5, chance: 0.6 },
  { item: "minecraft:gold_ingot", min: 1, max: 3, chance: 0.35 },
  { item: "minecraft:redstone", min: 2, max: 6, chance: 0.4 },
  { item: "minecraft:saddle", min: 1, max: 1, chance: 0.15 },
  { item: "minecraft:name_tag", min: 1, max: 1, chance: 0.1 },
  { item: "minecraft:melon_seeds", min: 2, max: 4, chance: 0.25 },
  { item: "cl:agua_boa", min: 1, max: 2, chance: 0.4 },
  { item: "minecraft:diamond", min: 1, max: 2, chance: 0.08 },
];
export const MASMORRA_FUNDA_SAQUE: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:diamond", min: 1, max: 3, chance: 0.6 },
  { item: "minecraft:gold_ingot", min: 2, max: 6, chance: 0.7 },
  { item: "minecraft:iron_ingot", min: 4, max: 8, chance: 0.8 },
  { item: "minecraft:emerald", min: 1, max: 3, chance: 0.4 },
  { item: "minecraft:golden_apple", min: 1, max: 1, chance: 0.3 },
  { item: "minecraft:enchanted_golden_apple", min: 1, max: 1, chance: 0.02 },
  { item: "cl:agua_excelente", min: 1, max: 2, chance: 0.5 },
];

// Destroços de outras naves (peça do relevo com saque "destrocos").
export const DESTROCOS_SAQUE: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:iron_ingot", min: 2, max: 6, chance: 0.8 },
  { item: "minecraft:copper_ingot", min: 3, max: 8, chance: 0.7 },
  { item: "minecraft:redstone", min: 3, max: 8, chance: 0.6 },
  { item: "minecraft:glass", min: 2, max: 6, chance: 0.5 },
  { item: "cl:agua_boa", min: 1, max: 3, chance: 0.6 },
  { item: "minecraft:bucket", min: 1, max: 1, chance: 0.25 },
  { item: "minecraft:gold_ingot", min: 1, max: 2, chance: 0.2 },
  { item: "cl:circuito", min: 1, max: 2, chance: 0.5 }, // placas de outra nave
  { item: "cl:placa_casco", min: 1, max: 3, chance: 0.4 },
];

// Gerador de Monstros (scripts/blocos/gerador_monstros.ts): bloco das cidades e masmorras.
export const GERADOR_MONSTROS = {
  raioJogador: 20, // só funciona com jogador a até tantos blocos
  limitePerto: 5, // não põe mais se já houver tantos monstros a até 10 blocos
  porVez: [1, 2],
  mobs: ["minecraft:husk", "cl:mumia", "cl:mumia", "minecraft:skeleton", "cl:escorpiao", "minecraft:spider"],
  mobsFundo: ["minecraft:skeleton", "minecraft:stray", "minecraft:cave_spider", "minecraft:creeper", "cl:escorpiao", "cl:mumia"], // abaixo de y = 0
  saque: [
    { item: "minecraft:iron_ingot", min: 1, max: 3, chance: 1 },
    { item: "minecraft:gold_nugget", min: 2, max: 6, chance: 0.8 },
    { item: "minecraft:redstone", min: 2, max: 4, chance: 0.6 },
  ] as ReadonlyArray<LinhaSaque>,
} as const;

// Golem de Areia (scripts/mundo/monstros.ts): só existe durante a tempestade de areia.
export const GOLEM_AREIA = {
  chancePorCiclo: 0.12, // a cada 2 s, por jogador ao ar livre na tempestade
  maxPerto: 2, // golens a até 48 blocos do jogador
  distanciaMin: 14,
  distanciaMax: 26,
  areiaAoDesmoronar: [2, 5], // blocos de areia que caem quando ele desmorona no fim da tempestade
} as const;

// Faraó Amaldiçoado, o chefe (scripts/mundo/farao.ts). Acorda ao tocar no Ídolo Amaldiçoado à noite.
export const FARAO = {
  raioAlvo: 28, // só age com jogador a até tantos blocos
  invocarCadaTicks: 240, // chama múmias e escorpiões
  invocarQtd: 3,
  maxServos: 8, // não chama mais se já houver tantos servos a até 20 blocos
  rajadaCadaTicks: 140, // rajada de areia: empurra, cega e fere quem está perto
  rajadaRaio: 7,
  rajadaDano: 5,
  tempestadeAbaixoDe: 0.5, // fração da vida: abaixo disso ele chama uma tempestade de areia (uma vez)
  noiteInicio: 13000,
  noiteFim: 23000,
} as const;

// Montadora (scripts/blocos/montadora.ts): máquina de energia que faz as peças da nave.
// Puxa os ingredientes do baú/funil EM CIMA e põe a peça no baú/funil EMBAIXO (ou solta do lado).
// Gasta 1 E a cada 5 s até juntar "energia" E; a primeira receita completa da lista é a que sai.
export type ReceitaMontadora = { resultado: string; quantidade: number; energia: number; ingredientes: ReadonlyArray<{ item: string; qtd: number }> };
export const MONTADORA: ReadonlyArray<ReceitaMontadora> = [
  {
    resultado: IDS.motorNave, quantidade: 1, energia: 15,
    ingredientes: [{ item: IDS.coracaoFarao, qtd: 1 }, { item: "minecraft:iron_block", qtd: 4 }, { item: IDS.circuito, qtd: 4 }, { item: IDS.bateria, qtd: 1 }],
  },
  {
    resultado: IDS.computadorBordo, quantidade: 1, energia: 12,
    ingredientes: [{ item: IDS.circuito, qtd: 6 }, { item: "minecraft:diamond", qtd: 1 }, { item: "minecraft:glass", qtd: 4 }, { item: "minecraft:gold_ingot", qtd: 4 }],
  },
  {
    resultado: IDS.celulaCombustivel, quantidade: 1, energia: 3,
    ingredientes: [{ item: "minecraft:coal", qtd: 4 }, { item: IDS.aguaBoa, qtd: 1 }, { item: "minecraft:iron_ingot", qtd: 1 }],
  },
  {
    resultado: IDS.circuito, quantidade: 1, energia: 2,
    ingredientes: [{ item: "minecraft:redstone", qtd: 2 }, { item: "minecraft:gold_ingot", qtd: 1 }, { item: "minecraft:copper_ingot", qtd: 1 }],
  },
  {
    resultado: IDS.placaCasco, quantidade: 1, energia: 2,
    ingredientes: [{ item: "minecraft:iron_ingot", qtd: 3 }, { item: "minecraft:copper_ingot", qtd: 2 }],
  },
];

// Os 4 sistemas da nave (scripts/mundo/reparo.ts), consertados no Painel da Nave.
export const SISTEMAS_NAVE: ReadonlyArray<{ id: string; pecas: ReadonlyArray<{ item: string; qtd: number }> }> = [
  { id: "casco", pecas: [{ item: IDS.placaCasco, qtd: 12 }, { item: "minecraft:glass", qtd: 8 }] },
  { id: "computador", pecas: [{ item: IDS.computadorBordo, qtd: 1 }] },
  { id: "combustivel", pecas: [{ item: IDS.celulaCombustivel, qtd: 8 }] },
  { id: "motor", pecas: [{ item: IDS.motorNave, qtd: 1 }] },
];

// Terminal de Armazenamento (scripts/blocos/terminal.ts): rede de baús tipo Applied Energistics.
export const ARMAZENAMENTO = {
  conteineres: ["minecraft:chest", "minecraft:trapped_chest", "minecraft:barrel"], // o que entra na rede
  maxConteineres: 48,
  maxBlocos: 160, // cabos/blocos de energia percorridos na busca
  energiaPorUso: 1, // E gasto ao abrir o terminal
  porPagina: 40, // itens por página na lista
} as const;

// Tempestade de areia (scripts/mundo/tempestade.ts).
export const TEMPESTADE = {
  chancePorMinuto: 1 / 45, // a qualquer hora (dia ou noite): em média uma a cada ~45 min de jogo
  pausaMinutos: 15, // depois de uma tempestade, pelo menos tanto tempo sem outra
  duracaoTicks: 25 * 60 * 20, // 25 minutos
  sedeMultiplicador: 1.5, // a água do corpo cai mais rápido durante a tempestade
} as const;

// ---- Fase 11: Diário 2.0, Catálogo, organizador ----

// Sacolas de recompensa (como no Hardcore Questing Mode): ao abrir, sorteia um grupo pelo peso do
// nível do grupo naquele tipo de sacola e entrega todos os itens do grupo.
// Pesos por nível de grupo (colunas: comum, boa, ótima, épica, lendária), iguais aos do HQM.
export const SACOLAS = [IDS.sacolaComum, IDS.sacolaBoa, IDS.sacolaOtima, IDS.sacolaEpica, IDS.sacolaLendaria] as const;
export const SACOLA_PESOS: Readonly<Record<string, readonly [number, number, number, number, number]>> = {
  lixo: [50, 50, 50, 5, 0],
  simples: [50, 50, 50, 30, 10],
  comum: [20, 30, 40, 30, 20],
  incomum: [5, 10, 15, 20, 25],
  raro: [3, 6, 12, 18, 21],
  unico: [1, 2, 3, 4, 30],
};
export const SACOLA_GRUPOS: ReadonlyArray<{ nivel: keyof typeof SACOLA_PESOS; itens: ReadonlyArray<{ item: string; quantidade: number }> }> = [
  { nivel: "lixo", itens: [{ item: "minecraft:rotten_flesh", quantidade: 4 }, { item: "minecraft:stick", quantidade: 8 }] },
  { nivel: "lixo", itens: [{ item: "minecraft:deadbush", quantidade: 2 }, { item: "minecraft:sand", quantidade: 16 }] },
  { nivel: "lixo", itens: [{ item: "minecraft:bone", quantidade: 3 }, { item: "minecraft:string", quantidade: 2 }] },
  { nivel: "simples", itens: [{ item: "minecraft:bread", quantidade: 4 }, { item: IDS.aguaSuja, quantidade: 3 }] },
  { nivel: "simples", itens: [{ item: "minecraft:torch", quantidade: 16 }, { item: "minecraft:coal", quantidade: 4 }] },
  { nivel: "simples", itens: [{ item: "minecraft:glass_bottle", quantidade: 4 }, { item: IDS.aguaBoa, quantidade: 2 }] },
  { nivel: "comum", itens: [{ item: "minecraft:iron_ingot", quantidade: 4 }, { item: "minecraft:copper_ingot", quantidade: 6 }] },
  { nivel: "comum", itens: [{ item: IDS.aguaBoa, quantidade: 4 }, { item: "minecraft:bread", quantidade: 6 }] },
  { nivel: "comum", itens: [{ item: "minecraft:redstone", quantidade: 8 }, { item: "minecraft:gold_nugget", quantidade: 6 }] },
  { nivel: "incomum", itens: [{ item: "minecraft:gold_ingot", quantidade: 4 }, { item: "minecraft:redstone", quantidade: 12 }] },
  { nivel: "incomum", itens: [{ item: IDS.circuito, quantidade: 2 }, { item: IDS.placaCasco, quantidade: 2 }] },
  { nivel: "incomum", itens: [{ item: IDS.aguaExcelente, quantidade: 2 }, { item: "minecraft:golden_apple", quantidade: 1 }] },
  { nivel: "raro", itens: [{ item: "minecraft:diamond", quantidade: 2 }, { item: "minecraft:iron_block", quantidade: 1 }] },
  { nivel: "raro", itens: [{ item: IDS.circuito, quantidade: 4 }, { item: IDS.celulaCombustivel, quantidade: 1 }] },
  { nivel: "raro", itens: [{ item: "minecraft:emerald", quantidade: 3 }, { item: "minecraft:name_tag", quantidade: 1 }] },
  { nivel: "unico", itens: [{ item: "minecraft:diamond", quantidade: 5 }, { item: "minecraft:enchanted_golden_apple", quantidade: 1 }] },
  { nivel: "unico", itens: [{ item: "minecraft:iron_block", quantidade: 4 }, { item: IDS.computadorBordo, quantidade: 1 }] },
];

// Catálogo (estilo JEI): de que "mod" vem cada item, para o filtro "@" da busca.
// Os itens do add-on sem entrada aqui são "Pouso Forçado"; os "minecraft:" são "Minecraft".
// As próximas fases (Ex Nihilo, Tinkers...) põem os seus itens aqui.
export const ORIGEM_MOD: Record<string, string> = {};
export const CATALOGO = { porPagina: 24 } as const;

// "O que estou olhando" (estilo WAILA), na barra de ação, junto com o painel de água e temperatura.
export const OLHAR = { distanciaBloco: 6, distanciaEntidade: 8 } as const;

// ---- Fase 12: Ex Nihilo + Ex Aliquo (scripts/blocos/barril.ts, cadinho.ts, nihilo.ts) ----

export const METAIS_NIHILO = ["ferro", "ouro", "cobre"] as const;
export const ESTAGIOS_NIHILO = ["quebrado", "triturado", "po"] as const;
export const BRUTO_DO_METAL: Readonly<Record<string, string>> = { ferro: "minecraft:raw_iron", ouro: "minecraft:raw_gold", cobre: "minecraft:raw_copper" };

// Martelo: quebra o bloco e dá o próximo da cadeia pedra -> cascalho -> areia -> poeira.
// Durabilidade igual à das ferramentas do mesmo material (cobre: Ex Aliquo).
export const MARTELOS: Readonly<Record<string, number>> = {
  [`${NS}:martelo_madeira`]: 59,
  [`${NS}:martelo_pedra`]: 131,
  [`${NS}:martelo_cobre`]: 190,
  [`${NS}:martelo_ferro`]: 250,
  [`${NS}:martelo_ouro`]: 32,
  [`${NS}:martelo_diamante`]: 1561,
};
export const MARTELO: Readonly<Record<string, ReadonlyArray<Achado>>> = {
  "minecraft:cobblestone": [{ item: "minecraft:gravel", chance: 1 }],
  "minecraft:gravel": [{ item: "minecraft:sand", chance: 1 }],
  "minecraft:sand": [{ item: `${NS}:poeira`, chance: 1 }],
  "minecraft:red_sand": [{ item: `${NS}:poeira`, chance: 1 }],
  "minecraft:sandstone": [{ item: "minecraft:sand", chance: 1 }],
  "minecraft:stone": [1, 0.75, 0.75, 0.5, 0.25, 0.05].map((chance) => ({ item: `${NS}:pedrinha`, chance })),
};

// Barril (madeira ou pedra): compostagem e "receitas" com 1.000 mB de água ou lava.
// Valores de compostagem do Ex Nihilo: o barril enche de 0 a 1; cheio, vira terra em 1.000 ticks.
const valores = (v: number, ids: string[]) => Object.fromEntries(ids.map((id) => [id.includes(":") ? id : `minecraft:${id}`, v]));
export const BARRIL_COMPOSTO: Readonly<Record<string, number>> = {
  ...valores(0.125, ["oak_sapling", "spruce_sapling", "birch_sapling", "jungle_sapling", "acacia_sapling", "dark_oak_sapling", "cherry_sapling",
    "oak_leaves", "spruce_leaves", "birch_leaves", "jungle_leaves", "acacia_leaves", "dark_oak_leaves"]),
  ...valores(0.1, ["rotten_flesh", "dandelion", "poppy", "brown_mushroom", "red_mushroom", "apple", "cactus", "waterlily", "vine", `${NS}:fruta_cacto`, "deadbush"]),
  ...valores(0.08, ["spider_eye", "wheat", "carrot", "potato", "baked_potato", "poisonous_potato", "short_grass", "egg", "sugar_cane"]),
  ...valores(0.16, ["bread", "pumpkin_pie"]),
  ...valores(0.2, ["porkchop", "cooked_porkchop", "beef", "cooked_beef", "chicken", "cooked_chicken", "mutton", "cooked_mutton"]),
  ...valores(0.15, ["cod", "salmon", "cooked_cod", "cooked_salmon"]),
  ...valores(1 / 6, ["melon_block", "pumpkin", "lit_pumpkin"]),
  ...valores(0.04, ["melon_slice", "string", `${NS}:bicho_seda`, `${NS}:bicho_seda_cozido`]),
};
export const BARRIL = {
  compostoTicks: 1000, // cheio -> terra
  leiteTicks: 1000, // água + leite -> slime pronto; mais 1000 e nasce um slime
  // Item na mão com o barril cheio de água/lava: vira o bloco na hora.
  receitas: [
    { fluido: "agua", item: `${NS}:poeira`, vira: "minecraft:clay" },
    { fluido: "lava", item: "minecraft:redstone", vira: "minecraft:netherrack" },
    { fluido: "lava", item: "minecraft:glowstone_dust", vira: "minecraft:end_stone" },
  ],
  // Barril cheio com um bloco de fluido em cima.
  encontro: [
    { fluido: "lava", acima: ["minecraft:water", "minecraft:flowing_water"], vira: "minecraft:obsidian" },
    { fluido: "agua", acima: ["minecraft:lava", "minecraft:flowing_lava"], vira: "minecraft:cobblestone" },
  ],
} as const;

// Cadinho (porcelana): derrete pedra em lava e gelo/neve/folhas em água. Capacidade 10.000 entre
// o sólido na fila e o líquido; não mistura fluidos. Calor = bloco logo abaixo, em mB por tick.
export const CADINHO = {
  capacidade: 10000,
  entradas: {
    "minecraft:cobblestone": { fluido: "lava", rende: 250, ocupa: 2000 },
    "minecraft:stone": { fluido: "lava", rende: 250, ocupa: 2000 },
    "minecraft:gravel": { fluido: "lava", rende: 250, ocupa: 2000 },
    "minecraft:netherrack": { fluido: "lava", rende: 1000, ocupa: 2000 },
    "minecraft:snow": { fluido: "agua", rende: 500, ocupa: 2000 },
    "minecraft:ice": { fluido: "agua", rende: 1000, ocupa: 2000 },
    // Crash Landing: folhas viram água (valor do pack não encontrado; 8 folhas = 1 balde).
    "minecraft:oak_leaves": { fluido: "agua", rende: 125, ocupa: 1000 },
    "minecraft:birch_leaves": { fluido: "agua", rende: 125, ocupa: 1000 },
    "minecraft:acacia_leaves": { fluido: "agua", rende: 125, ocupa: 1000 },
    "minecraft:spruce_leaves": { fluido: "agua", rende: 125, ocupa: 1000 },
    "minecraft:jungle_leaves": { fluido: "agua", rende: 125, ocupa: 1000 },
  } as Readonly<Record<string, { fluido: "lava" | "agua"; rende: number; ocupa: number }>>,
  calor: {
    "minecraft:torch": 0.1,
    "minecraft:lava": 0.2,
    "minecraft:flowing_lava": 0.1,
    "minecraft:lit_furnace": 0.15,
    "minecraft:fire": 0.3,
    "minecraft:soul_fire": 0.3,
    "minecraft:campfire": 0.2, // não existia no 1.6.4: entre a lava e o fogo
    "minecraft:magma": 0.1,
    [`${NS}:gerador`]: 0.15, // como as fontes de calor do Ex Aliquo: o gerador aceso
  } as Readonly<Record<string, number>>,
} as const;

// Cajado e bicho-da-seda: folhas com o cajado soltam bicho 1/100 (folha infestada: 1/15). O bicho
// infesta a folha em 2.000 ticks; passou de 60%, espalha para uma folha vizinha a cada ~100 ticks.
// Quebrar a folha infestada dá linha (chance = infestação × 0,4, e mais uma com × 0,1).
export const SEDA = { chanceFolha: 1 / 100, chanceInfestada: 1 / 15, linha1: 0.4, linha2: 0.1, espalhaAPartir: 6, durabilidadeCajado: 64 } as const;
export const FOLHAS: ReadonlyArray<string> = ["oak_leaves", "spruce_leaves", "birch_leaves", "jungle_leaves", "acacia_leaves", "dark_oak_leaves", "cherry_leaves", "azalea_leaves"].map((n) => `minecraft:${n}`);

for (const id of [
  IDS.poeira, IDS.pedrinha, IDS.barrilMadeira, IDS.barrilPedra, IDS.cadinho, IDS.cadinhoCru, IDS.porcelana, IDS.cajado, IDS.bichoSeda,
  IDS.bichoSedaCozido, IDS.folhaInfestada, ...Object.keys(MARTELOS).filter((m) => !m.endsWith("cobre")),
  ...METAIS_NIHILO.flatMap((m) => ESTAGIOS_NIHILO.map((e) => `${NS}:${m}_${e}`)),
]) ORIGEM_MOD[id] = "Ex Nihilo";
ORIGEM_MOD[`${NS}:martelo_cobre`] = "Ex Aliquo";

// ---- Fase 13: EnviroMine + Hunger Overhaul ----

// Qualidade do ar (scripts/jogador/ar.ts), 0 a 100. Com céu, perto da superfície: +2 por atualização.
// No subsolo sem céu: o pior entre lava −1, fogo −0,5, tocha/fornalha acesa −0,25 (num raio pequeno);
// folhas por perto +0,1 cada. Durante a tempestade de areia, ao ar livre, o ar também cai (extensão).
export const AR = {
  regen: 2,
  fontes: { "minecraft:lava": -1, "minecraft:flowing_lava": -1, "minecraft:fire": -0.5, "minecraft:soul_fire": -0.5, "minecraft:campfire": -0.5, "minecraft:torch": -0.25, "minecraft:lit_furnace": -0.25 } as Readonly<Record<string, number>>,
  folha: 0.1,
  fracaoSolida: 0.8, // o EnviroMine multiplica a perda pela fração de blocos sólidos em volta
  tempestade: -0.5, // valor de projeto: areia no ar (≈ 5 min ao ar livre até zerar; abrigado, volta)
  lento: 25,
  muitoLento: 10,
  danoEmZero: 4,
  // Máscara de gás e filtros (EnviroMine 1.7): carga 1000; cada filtro +500; gasta 100 − ar.
  mascaraCarga: 1000,
  filtroCarga: 500,
} as const;

// Camel Pack (EnviroMine): vestido no peito, guarda 100 de água limpa (4 garrafas de 25) e dá +1 de
// hidratação por atualização quando ela passa de 1 abaixo do máximo (e −0,1 °C se o corpo ≥ 37,1).
export const CAMEL = { capacidade: 100, porGarrafa: 25, porAtualizacao: 1, esfria: 0.1 } as const;

// Hunger Overhaul (scripts/jogador/fome.ts).
export const FOME = {
  // Comida do jogo com os valores do HO (fome / modificador de saturação; saturação = fome × mod × 2).
  comidas: {
    "minecraft:apple": [1, 0.05], "minecraft:bread": [3, 0.2], "minecraft:porkchop": [1, 0.05], "minecraft:cooked_porkchop": [2, 0.15],
    "minecraft:cod": [1, 0.05], "minecraft:salmon": [1, 0.05], "minecraft:cooked_cod": [2, 0.1], "minecraft:cooked_salmon": [2, 0.1],
    "minecraft:cookie": [1, 0.05], "minecraft:melon_slice": [1, 0.05], "minecraft:beef": [1, 0.05], "minecraft:cooked_beef": [2, 0.15],
    "minecraft:chicken": [1, 0.05], "minecraft:cooked_chicken": [2, 0.15], "minecraft:rotten_flesh": [1, 0.05], "minecraft:baked_potato": [2, 0.15],
    "minecraft:poisonous_potato": [1, 0.05], "minecraft:pumpkin_pie": [3, 0.15], "minecraft:mushroom_stew": [2, 0.1], "minecraft:carrot": [1, 0.05],
    "minecraft:potato": [1, 0.05], "minecraft:mutton": [1, 0.05], "minecraft:cooked_mutton": [2, 0.15], "minecraft:rabbit": [1, 0.05],
    "minecraft:cooked_rabbit": [2, 0.15], "minecraft:beetroot": [1, 0.05], "minecraft:beetroot_soup": [2, 0.1], "minecraft:rabbit_stew": [3, 0.15],
    "minecraft:sweet_berries": [1, 0.05],
    ...COMIDAS_HC, // HarvestCraft: max(fome da 1.12 / 4, 1), saturação 0,1
  } as Readonly<Record<string, readonly [number, number]>>,
  efeitos: {
    "minecraft:chicken": { id: "hunger", segundos: 30, chance: 0.15 },
    "minecraft:poisonous_potato": { id: "poison", segundos: 5, chance: 0.3 },
  } as Readonly<Record<string, Efeito>>,
  // Regeneração: só com fome ≥ 7, sem gastar fome; 1 de vida a cada
  // 80 × dif × bemAlimentado × (1 + vidaFaltando × 0,05 × dif)^1,5 ticks. Levar dano zera o contador.
  regenFomeMin: 7,
  regenBase: 80,
  dificuldade: { facil: 0.75, normal: 1, dificil: 1.5 },
  bemAlimentadoMult: 0.75,
  // Gasto constante: +0,01 de exaustão a cada 10 ticks.
  exaustaoPorSegundo: 0.02,
  // Fome ao renascer: 20 − (dif − 1) × 4 (Normal 16, Difícil 12).
  renascer: { facil: 20, normal: 16, dificil: 12 },
  // Efeitos de status baixo (modificador m: Fácil 1, Normal 2, Difícil 3).
  modificador: { facil: 1, normal: 2, dificil: 3 },
  // Animais: cruzar e ovos 4× mais lentos; a vaca só dá leite de novo depois de 20 min.
  cruzaTicks: 4 * 5 * 60 * 20,
  leiteTicks: 20 * 60 * 20,
  chanceOvo: 0.25,
  comidaDeCruza: {
    "minecraft:cow": ["minecraft:wheat"], "minecraft:sheep": ["minecraft:wheat"], "minecraft:mooshroom": ["minecraft:wheat"],
    "minecraft:pig": ["minecraft:carrot", "minecraft:potato", "minecraft:beetroot"],
    "minecraft:chicken": ["minecraft:wheat_seeds", "minecraft:pumpkin_seeds", "minecraft:melon_seeds", "minecraft:beetroot_seeds"],
  } as Readonly<Record<string, ReadonlyArray<string>>>,
} as const;

for (const id of [IDS.camelPack, IDS.mascara, IDS.filtro]) ORIGEM_MOD[id] = "EnviroMine";
for (const id of ITENS_HC) ORIGEM_MOD[id] = "Pam's HarvestCraft";

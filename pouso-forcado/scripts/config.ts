// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.13.2";

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
} as const;

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
  diarioRecebido: `${NS}:diario_recebido`, // jogador
  missoes: `${NS}:missoes`, // jogador: JSON com o progresso (scripts/missoes/progresso.ts)
  ondaFeita: `${NS}:onda_feita`, // mundo: "dia:k" da última onda da horda
  sede: `${NS}:sede`, // jogador: água no corpo (0 a SEDE.max)
  temperatura: `${NS}:temperatura`, // jogador: temperatura do corpo (TEMPERATURA.min a max; 0 = normal)
  capsulaDia: `${NS}:capsula_dia`, // mundo: dia da última cápsula de carga
  capsulas: `${NS}:capsulas`, // mundo: JSON com as cápsulas ainda não encontradas
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
    "minecraft:husk", "minecraft:husk", "minecraft:husk", "minecraft:zombie", "minecraft:skeleton",
    "minecraft:skeleton", "minecraft:spider", "minecraft:spider", "minecraft:creeper",
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
export const RARAS = [
  {
    tipo: "templo",
    estrutura: `${NS}:templo_soterrado`,
    celula: 24, // 384×384 blocos
    chance: 0.6,
    tamanho: 15,
    deslocY: -3,
    bau: { x: 7, y: 1, z: 7 },
    saque: "templo",
  },
  {
    tipo: "destrocos",
    estrutura: `${NS}:nave_caida`, // a mesma estrutura da sua nave, com outro saque
    celula: 28, // 448×448 blocos
    chance: 0.6,
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

// Peneira: cada toque com areia/cascalho na mão gasta 1 bloco e sorteia cada linha da tabela.
export type Achado = { item: string; chance: number; max?: number };
export const PENEIRA: Readonly<Record<string, ReadonlyArray<Achado>>> = {
  "minecraft:sand": [
    { item: "minecraft:clay_ball", chance: 0.14, max: 2 },
    { item: "minecraft:wheat_seeds", chance: 0.08 },
    { item: "minecraft:beetroot_seeds", chance: 0.05 },
    { item: "minecraft:pumpkin_seeds", chance: 0.03 },
    { item: "minecraft:melon_seeds", chance: 0.03 },
    { item: "minecraft:bone_meal", chance: 0.06 },
    { item: "minecraft:iron_nugget", chance: 0.06, max: 2 },
    { item: "minecraft:gold_nugget", chance: 0.03 },
    { item: "minecraft:flint", chance: 0.03 },
    { item: "minecraft:cactus", chance: 0.02 },
    { item: "minecraft:sugar_cane", chance: 0.015 },
    { item: "minecraft:oak_sapling", chance: 0.015 },
    { item: "minecraft:birch_sapling", chance: 0.01 },
    { item: "minecraft:acacia_sapling", chance: 0.01 },
  ],
  "minecraft:gravel": [
    { item: "minecraft:flint", chance: 0.25 },
    { item: "minecraft:iron_nugget", chance: 0.15, max: 3 },
    { item: "minecraft:gold_nugget", chance: 0.06, max: 2 },
    { item: "minecraft:raw_copper", chance: 0.05 },
    { item: "minecraft:coal", chance: 0.06 },
    { item: "minecraft:redstone", chance: 0.04, max: 2 },
    { item: "minecraft:lapis_lazuli", chance: 0.03 },
    { item: "minecraft:diamond", chance: 0.003 },
  ],
};

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

// ---- Fase 4: comida e vida ----

// Sede (scripts/jogador/sede.ts). A água cai 1 ponto a cada "segundosDia" de dia (sol) e
// "segundosNoite" à noite. Com pouca água, lentidão; com zero, dano.
export const SEDE = {
  max: 20,
  segundosDia: 30,
  segundosNoite: 50,
  lentidaoAbaixoDe: 5,
  danoACadaSegundos: 4,
  // Comidas que também matam a sede ao terminar de comer/beber. As águas ficam em AGUAS.
  bebidas: {
    "minecraft:milk_bucket": 6,
    "minecraft:honey_bottle": 4,
    "cl:fruta_cacto": 4,
    "minecraft:melon_slice": 2,
    "minecraft:sweet_berries": 1,
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

// Temperatura do corpo (scripts/jogador/temperatura.ts). Escala de -20 (congelando) a +20
// (insolação), 0 = normal; na tela aparece em °C (36,5 + 0,3 por ponto).
// A cada segundo o script calcula a temperatura "do ambiente" (alvo) e o corpo anda
// 1 ponto na direção dela a cada "segundosPorPonto".
export const TEMPERATURA = {
  min: -20,
  max: 20,
  segundosPorPonto: 4,
  // Alvos (somados): sol aberto ao meio-dia / noite ao relento / na sombra / sombra à noite.
  solAberto: 17,
  noiteAberta: -17,
  solSombra: 6,
  noiteAbrigo: -7,
  subsolo: 0, // abaixo de y = superfície - 4 e sem céu: fresco e estável
  fogo: 14, // fogueira, fogo, lava, magma ou fornalha acesa a até 3 blocos
  agua: -8, // dentro da água
  correndo: 3,
  capacete: -4, // qualquer capacete protege do sol (só quando está quente)
  couroPorPeca: 0.15, // cada peça de couro corta 15% do frio
  // Efeitos
  quente: 12, // a partir daqui: sede cai 2× mais rápido
  frio: -12, // a partir daqui: lentidão
  danoAcima: 16, // insolação: 1 de dano a cada "danoACadaSegundos"
  danoAbaixo: -16, // hipotermia: idem
  danoACadaSegundos: 3,
} as const;

// Qualidades de água (scripts/jogador/aguas.ts). agua = pontos de sede; esfria = pontos de
// temperatura a menos (se estiver quente); efeitos sorteados ao beber.
// A garrafa de água do jogo (minecraft:potion) conta como água boa.
// "Água imprópria" não se bebe: ferva na fornalha ou fogueira.
export type Efeito = { id: string; segundos: number; chance: number; nivel?: number };
export const AGUAS: Readonly<Record<string, { agua: number; esfria: number; efeitos: ReadonlyArray<Efeito> }>> = {
  "cl:agua_excelente": { agua: 10, esfria: 5, efeitos: [{ id: "regeneration", segundos: 5, chance: 1 }] },
  "cl:agua_boa": { agua: 7, esfria: 3, efeitos: [] },
  "minecraft:potion": { agua: 7, esfria: 3, efeitos: [] },
  "cl:agua_suja": {
    agua: 5,
    esfria: 2,
    efeitos: [{ id: "nausea", segundos: 8, chance: 0.4 }, { id: "hunger", segundos: 15, chance: 0.25 }],
  },
  "cl:agua_muito_suja": {
    agua: 3,
    esfria: 1,
    efeitos: [
      { id: "nausea", segundos: 10, chance: 0.8 },
      { id: "poison", segundos: 4, chance: 0.5 },
      { id: "hunger", segundos: 20, chance: 0.4 },
    ],
  },
};

// Beber direto de uma poça/fonte de água: agachado dentro da água, 1 gole a cada 2 s.
export const POCA = { aguaPorGole: 1, chanceEnjoo: 0.15 } as const;

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
  materiais: [
    "minecraft:light_gray_concrete",
    "minecraft:white_concrete",
    "minecraft:gray_concrete",
    "minecraft:stone_bricks",
    "minecraft:cut_sandstone",
    "minecraft:smooth_sandstone",
    "minecraft:white_terracotta",
  ],
  rua: "minecraft:polished_andesite",
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
];

// Gerador de Monstros (scripts/blocos/gerador_monstros.ts): bloco das cidades e masmorras.
export const GERADOR_MONSTROS = {
  raioJogador: 20, // só funciona com jogador a até tantos blocos
  limitePerto: 5, // não põe mais se já houver tantos monstros a até 10 blocos
  porVez: [1, 2],
  mobs: ["minecraft:husk", "minecraft:husk", "minecraft:zombie", "minecraft:skeleton", "minecraft:spider"],
  mobsFundo: ["minecraft:skeleton", "minecraft:stray", "minecraft:cave_spider", "minecraft:creeper", "minecraft:zombie"], // abaixo de y = 0
  saque: [
    { item: "minecraft:iron_ingot", min: 1, max: 3, chance: 1 },
    { item: "minecraft:gold_nugget", min: 2, max: 6, chance: 0.8 },
    { item: "minecraft:redstone", min: 2, max: 4, chance: 0.6 },
  ] as ReadonlyArray<LinhaSaque>,
} as const;

// Tempestade de areia (scripts/mundo/tempestade.ts).
export const TEMPESTADE = {
  chancePorMinuto: 1 / 45, // a qualquer hora (dia ou noite): em média uma a cada ~45 min de jogo
  pausaMinutos: 15, // depois de uma tempestade, pelo menos tanto tempo sem outra
  duracaoTicks: 25 * 60 * 20, // 25 minutos
  sedeMultiplicador: 1.5, // a água do corpo cai mais rápido durante a tempestade
} as const;

// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.17.0";

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
  sede: `${NS}:sede`, // jogador: água no corpo (0 a SEDE.max)
  temperatura: `${NS}:temperatura`, // jogador: temperatura do corpo (TEMPERATURA.min a max; 0 = normal)
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
export const ORIGEM_MOD: Readonly<Record<string, string>> = {};
export const CATALOGO = { porPagina: 24 } as const;

// "O que estou olhando" (estilo WAILA), na barra de ação, junto com o painel de água e temperatura.
export const OLHAR = { distanciaBloco: 6, distanciaEntidade: 8 } as const;

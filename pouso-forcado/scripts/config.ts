// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.9.0";

// Variantes do bioma de deserto (ver README: "Por que dois arquivos de bioma").
export const BIOMAS_DESERTO = [`${NS}:deserto_seco`, `${NS}:deserto_seco_ns`] as const;

export const IDS = {
  condensadorAgua: `${NS}:condensador_agua`,
  condensadorAvancado: `${NS}:condensador_avancado`,
  peneira: `${NS}:peneira`,
  compostor: `${NS}:compostor`,
  estufa: `${NS}:estufa`,
  diarioBordo: `${NS}:diario_bordo`,
} as const;

// Chaves de dynamic properties (salvas no mundo/jogador).
export const PROPS = {
  boasVindasVista: `${NS}:boas_vindas_vista`, // jogador
  naveColocada: `${NS}:nave_colocada`, // mundo
  naveChunk: `${NS}:nave_chunk`, // mundo: "cx,cz" do chunk da nave
  sementeRelevo: `${NS}:semente_relevo`, // mundo
  diarioRecebido: `${NS}:diario_recebido`, // jogador
  missoes: `${NS}:missoes`, // jogador: JSON com o progresso (scripts/missoes/progresso.ts)
  ondaFeita: `${NS}:onda_feita`, // mundo: "dia:k" da última onda da horda
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
  // Como é o mundo plano em y = -63. Em mundo normal (ou no mundo plano antigo, de pedra) não
  // bate, e nada é gerado.
  pedraEsperada: "minecraft:deepslate",
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
    // Só nas planícies (onde não há duna). Templo mais comum que antes porque metade do mapa é duna.
    { estrutura: `${NS}:templo_soterrado`, chance: 0.025, tamanho: 15, deslocY: -3, girar: false, bau: { x: 7, y: 1, z: 7 } },
    { estrutura: `${NS}:morro`, chance: 0.06, tamanho: 17, deslocY: 0, girar: true },
    { estrutura: `${NS}:mesa`, chance: 0.04, tamanho: 13, deslocY: 0, girar: true },
    { estrutura: `${NS}:rochas`, chance: 0.1, tamanho: 9, deslocY: 0, girar: true },
  ],
} as const;

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

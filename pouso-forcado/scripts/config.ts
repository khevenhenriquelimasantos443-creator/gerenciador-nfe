// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.4.0";

// Variantes do bioma de deserto (ver README: "Por que dois arquivos de bioma").
export const BIOMAS_DESERTO = [`${NS}:deserto_seco`, `${NS}:deserto_seco_ns`] as const;

export const IDS = {
  condensadorAgua: `${NS}:condensador_agua`,
} as const;

// Chaves de dynamic properties (salvas no mundo/jogador).
export const PROPS = {
  boasVindasVista: `${NS}:boas_vindas_vista`, // jogador
  naveColocada: `${NS}:nave_colocada`, // mundo
  naveChunk: `${NS}:nave_chunk`, // mundo: "cx,cz" do chunk da nave
  sementeRelevo: `${NS}:semente_relevo`, // mundo
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

// Reforço de monstros à noite (scripts/mundo/horda_noturna.ts).
export const HORDA = {
  intervaloTicks: 200, // a cada 10 s
  porVez: 2, // monstros extras por jogador por ciclo
  limitePerto: 14, // não reforça se já houver tantos monstros por perto
  raioContagem: 48,
  distanciaMin: 24, // longe o bastante para não nascer na cara do jogador
  distanciaMax: 40,
  mobs: ["minecraft:husk", "minecraft:husk", "minecraft:zombie", "minecraft:skeleton", "minecraft:spider"],
} as const;

// Mundo plano do modelo (.mctemplate). Tem que bater com tools/gerar-mundo.mjs.
export const MUNDO_PLANO = {
  superficieY: -52, // primeiro bloco de ar acima da areia
  // Marca de "chunk já decorado": um bloco na 1ª camada de pedra, no canto do chunk.
  // Deepslate reforçado não quebra no sobrevivência, então a marca não some.
  marcadorY: -63,
  marcador: "minecraft:reinforced_deepslate",
  pedraEsperada: "minecraft:stone", // como é o mundo plano em y = -63 (em mundo normal não bate, e nada é gerado)
} as const;

// Relevo espalhado por script conforme o jogador explora (scripts/mundo/relevo.ts).
// chance = probabilidade por chunk; tamanho = área no chão; deslocY = quanto fica enterrado.
export const RELEVO = {
  intervaloTicks: 20,
  raioChunks: 4,
  maxPorCiclo: 3, // limita o trabalho por segundo (voando rápido não trava)
  distanciaNave: 3, // chunks sem relevo em volta da nave
  arbustoSeco: 0.3, // chance de 1 a 3 arbustos secos (gravetos) no chunk
  pecas: [
    { estrutura: `${NS}:templo_soterrado`, chance: 0.012, tamanho: 15, deslocY: -3, girar: false, bau: { x: 7, y: 1, z: 7 } },
    { estrutura: `${NS}:morro`, chance: 0.04, tamanho: 17, deslocY: 0, girar: true },
    { estrutura: `${NS}:mesa`, chance: 0.02, tamanho: 13, deslocY: 0, girar: true },
    { estrutura: `${NS}:duna_media`, chance: 0.15, tamanho: 19, deslocY: 0, girar: true },
    { estrutura: `${NS}:duna_pequena`, chance: 0.2, tamanho: 11, deslocY: 0, girar: true },
    { estrutura: `${NS}:rochas`, chance: 0.07, tamanho: 9, deslocY: 0, girar: true },
  ],
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

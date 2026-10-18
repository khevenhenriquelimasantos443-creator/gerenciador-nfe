// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

// Mesma versão dos manifests (mostrada no diagnóstico do chat).
export const VERSAO = "0.3.0";

// Variantes do bioma de deserto (ver README: "Por que dois arquivos de bioma").
export const BIOMAS_DESERTO = [`${NS}:deserto_seco`, `${NS}:deserto_seco_ns`] as const;

export const IDS = {
  condensadorAgua: `${NS}:condensador_agua`,
} as const;

// Chaves de dynamic properties (salvas no mundo/jogador).
export const PROPS = {
  boasVindasVista: `${NS}:boas_vindas_vista`, // jogador
  naveColocada: `${NS}:nave_colocada`, // mundo
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

// O intervalo do condensador é definido no JSON do bloco (minecraft:tick, 600 ticks = 30 s).
// Mantido aqui só como referência para textos e testes.
export const CONDENSADOR_SEGUNDOS = 30;

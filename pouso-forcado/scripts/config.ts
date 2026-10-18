// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

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

// O intervalo do condensador é definido no JSON do bloco (minecraft:tick, 600 ticks = 30 s).
// Mantido aqui só como referência para textos e testes.
export const CONDENSADOR_SEGUNDOS = 30;

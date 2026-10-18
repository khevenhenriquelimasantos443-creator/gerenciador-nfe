// Configuração central do add-on. Tudo que for "número de balanceamento" fica aqui.

export const NS = "cl";

export const IDS = {
  condensadorAgua: `${NS}:condensador_agua`,
} as const;

// Chaves de dynamic properties (salvas no mundo/jogador).
export const PROPS = {
  kitRecebido: `${NS}:kit_recebido`,
} as const;

// Kit entregue na primeira entrada do jogador no mundo.
export const KIT_INICIAL: ReadonlyArray<{ item: string; quantidade: number }> = [
  { item: IDS.condensadorAgua, quantidade: 1 },
  { item: "minecraft:bucket", quantidade: 1 },
  { item: "minecraft:bread", quantidade: 6 },
  { item: "minecraft:torch", quantidade: 8 },
];

// O intervalo do condensador é definido no JSON do bloco (minecraft:tick, 600 ticks = 30 s).
// Mantido aqui só como referência para textos e testes.
export const CONDENSADOR_SEGUNDOS = 30;

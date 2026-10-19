import { Block, world } from "@minecraft/server";
import { ARMAZENAMENTO, IDS } from "../config.js";

/*
 * Visual dos cabos (Fase 9): o modelo tem um braço para cada lado (RP/models/blocks/cl_cabo.geo.json)
 * e o bloco tem 6 estados (cl:n, cl:s, cl:l, cl:o, cl:cima, cl:baixo). Quando um bloco é posto ou
 * quebrado do lado de um cabo, o cabo liga o braço daquele lado se o vizinho for parte da rede
 * (outro cabo, bloco de energia, máquina que usa energia ou baú do Terminal).
 * Custo: só nos eventos de pôr/quebrar bloco, e só quando há cabo por perto.
 */
const LIGA = new Set<string>([
  IDS.cabo, IDS.bateria, IDS.painelSolar, IDS.gerador, IDS.moinho, IDS.peneiraAutomatica, IDS.montadora,
  IDS.terminal, IDS.estufa, IDS.condensadorAvancado, ...ARMAZENAMENTO.conteineres,
]);
const LADOS: ReadonlyArray<[string, (b: Block) => Block | undefined]> = [
  ["cl:n", (b) => b.north()], ["cl:s", (b) => b.south()], ["cl:l", (b) => b.east()],
  ["cl:o", (b) => b.west()], ["cl:cima", (b) => b.above()], ["cl:baixo", (b) => b.below()],
];

function vizinho(b: Block, passo: (b: Block) => Block | undefined): Block | undefined {
  try {
    return passo(b);
  } catch {
    return undefined; // chunk do lado descarregado
  }
}

export function atualizarCabo(b: Block | undefined): void {
  if (!b || b.typeId !== IDS.cabo) return;
  let p = b.permutation;
  for (const [estado, passo] of LADOS) {
    const v = vizinho(b, passo);
    p = p.withState(estado as never, (!!v && LIGA.has(v.typeId)) as never);
  }
  b.setPermutation(p);
}

function emVolta(b: Block): void {
  for (const [, passo] of LADOS) atualizarCabo(vizinho(b, passo));
}

export function registrarCabos(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    atualizarCabo(block);
    emVolta(block);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block }) => emVolta(block));
}

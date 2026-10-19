import { BlockComponentPlayerInteractEvent, BlockCustomComponent, system } from "@minecraft/server";
import { IDS, PENEIRA, PENEIRA_TOQUES } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao, soltarEmCima } from "../util/inventario.js";

/*
 * Peneira (como a do Ex Nihilo): toque nela com terra, cascalho, areia ou poeira na mão para
 * carregar 1 bloco; depois cada toque peneira um pouco (PENEIRA_TOQUES toques, no máximo 1 a cada
 * 4 ticks: segurar o dedo conta como vários). No fim, cada linha da tabela PENEIRA (config.ts) é
 * sorteada à parte e o que sair pula em cima da peneira.
 * Estados: cl:carga = o que está na malha (0 = nada; ver CARGAS); cl:progresso = toques dados.
 * Sem tick: só custa alguma coisa quando o jogador toca.
 */
export const CARGAS = ["", "minecraft:dirt", "minecraft:gravel", "minecraft:sand", IDS.poeira] as const;
const SOM: Readonly<Record<string, string>> = { "minecraft:dirt": "dig.grass", "minecraft:gravel": "dig.gravel" };
const ultimoToque = new Map<string, number>(); // no máximo 1 toque a cada 4 ticks por jogador

/** Sorteia a tabela de um bloco e solta em cima da peneira. Retorna se saiu alguma coisa. */
export function peneirar(bloco: string, soltar: (item: string, qtd: number) => void): boolean {
  let achou = false;
  for (const { item, chance, max = 1 } of PENEIRA[bloco] ?? []) {
    if (Math.random() >= chance) continue;
    soltar(item, 1 + Math.floor(Math.random() * max));
    achou = true;
  }
  return achou;
}

export const peneira: BlockCustomComponent = {
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const agora = system.currentTick;
    if (agora - (ultimoToque.get(jogador.id) ?? -10) < 4) return;
    ultimoToque.set(jogador.id, agora);

    const carga = lerEstado<number>(e.block, "cl:carga");
    if (carga === 0) {
      const mao = itemNaMao(jogador);
      const k = mao ? CARGAS.indexOf(mao.typeId as (typeof CARGAS)[number]) : -1;
      if (k <= 0) {
        aviso(jogador, "cl.peneira.como");
        return;
      }
      gastarDaMao(jogador);
      definirEstado(e.block, "cl:carga", k);
      definirEstado(e.block, "cl:progresso", 0);
      e.dimension.playSound(SOM[CARGAS[k]] ?? "dig.sand", e.block.center());
      return;
    }
    const progresso = lerEstado<number>(e.block, "cl:progresso") + 1;
    const bloco = CARGAS[carga];
    e.dimension.playSound(SOM[bloco] ?? "dig.sand", e.block.center(), { volume: 0.5, pitch: 1.2 });
    if (progresso < PENEIRA_TOQUES) {
      definirEstado(e.block, "cl:progresso", progresso);
      return;
    }
    definirEstado(e.block, "cl:carga", 0);
    definirEstado(e.block, "cl:progresso", 0);
    const achou = peneirar(bloco, (item, qtd) => soltarEmCima(e.dimension, e.block.location, item, qtd));
    if (!achou) aviso(jogador, "cl.peneira.nada");
    registrarAcao(jogador, "peneirar");
  },
};

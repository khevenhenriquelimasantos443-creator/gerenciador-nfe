import { BlockComponentPlayerInteractEvent, BlockCustomComponent, system } from "@minecraft/server";
import { PENEIRA } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarDaMao, itemNaMao, soltarEmCima } from "../util/inventario.js";

/*
 * Peneira: toque nela com areia ou cascalho na mão. Gasta 1 bloco e cada linha da tabela
 * PENEIRA (config.ts) é sorteada; o que sair pula em cima da peneira.
 * Sem tick: só custa alguma coisa quando o jogador toca.
 */
const ultimoToque = new Map<string, number>(); // evita dois toques no mesmo instante (toque duplo no celular)

export const peneira: BlockCustomComponent = {
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const agora = system.currentTick;
    if (agora - (ultimoToque.get(jogador.id) ?? -10) < 4) return;
    ultimoToque.set(jogador.id, agora);

    const mao = itemNaMao(jogador);
    const tabela = mao ? PENEIRA[mao.typeId] : undefined;
    if (!tabela) {
      aviso(jogador, "cl.peneira.como");
      return;
    }
    gastarDaMao(jogador);
    e.dimension.playSound("dig.sand", e.block.center());
    let achou = false;
    for (const { item, chance, max = 1 } of tabela) {
      if (Math.random() >= chance) continue;
      soltarEmCima(e.dimension, e.block.location, item, 1 + Math.floor(Math.random() * max));
      achou = true;
    }
    if (!achou) aviso(jogador, "cl.peneira.nada");
    registrarAcao(jogador, "peneirar");
  },
};

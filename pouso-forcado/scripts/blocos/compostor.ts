import { BlockComponentPlayerInteractEvent, BlockCustomComponent } from "@minecraft/server";
import { COMPOSTOR_CHEIO, COMPOSTOR_PONTOS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao, soltarEmCima } from "../util/inventario.js";

/*
 * Compostor de Terra: toque com restos (carne podre, sementes, folhas, colheitas...) na mão.
 * Cada resto soma pontos (COMPOSTOR_PONTOS) no estado cl:nivel. Cheio (8), ele decompõe:
 * o próximo minecraft:tick (20 s) liga cl:pronto. Toque de novo para tirar 1 terra.
 * Custo: um tick a cada 20 s por compostor, que só olha o próprio estado.
 */
const NIVEL = "cl:nivel";
const PRONTO = "cl:pronto";

export const compostor: BlockCustomComponent = {
  onTick(e) {
    if (lerEstado<number>(e.block, NIVEL) >= COMPOSTOR_CHEIO && !lerEstado<boolean>(e.block, PRONTO)) {
      definirEstado(e.block, PRONTO, true);
    }
  },

  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const bloco = e.block;

    if (lerEstado<boolean>(bloco, PRONTO)) {
      soltarEmCima(e.dimension, bloco.location, "minecraft:dirt", 1);
      bloco.setPermutation(bloco.permutation.withState(NIVEL as never, 0 as never).withState(PRONTO as never, false as never));
      e.dimension.playSound("block.composter.ready", bloco.center());
      registrarAcao(jogador, "compostar");
      return;
    }

    const nivel = lerEstado<number>(bloco, NIVEL);
    if (nivel >= COMPOSTOR_CHEIO) {
      aviso(jogador, "cl.compostor.decompondo");
      return;
    }
    const mao = itemNaMao(jogador);
    const pontos = mao ? COMPOSTOR_PONTOS[mao.typeId] : undefined;
    if (!pontos) {
      aviso(jogador, "cl.compostor.como");
      return;
    }
    gastarDaMao(jogador);
    definirEstado(bloco, NIVEL, Math.min(COMPOSTOR_CHEIO, nivel + pontos));
    e.dimension.playSound("block.composter.fill_success", bloco.center());
  },
};

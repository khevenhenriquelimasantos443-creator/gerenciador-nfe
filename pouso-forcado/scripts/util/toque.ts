import { Block, Player, system } from "@minecraft/server";

/*
 * Toque novo num bloco (para os eventos de interação que repetem enquanto o dedo fica no bloco).
 * Vale o primeiro evento do jogo (isFirstEvent) ou um toque que não seja repetição do anterior no mesmo
 * bloco em até 8 ticks: há casos (jogador simulado dos testes e, por segurança, o celular) em que o
 * primeiro toque chega com isFirstEvent = false.
 */
const ultimo = new Map<string, { k: string; t: number }>();
export function toqueNovo(ev: { player: Player; block: Block; isFirstEvent: boolean }): boolean {
  const k = `${ev.block.dimension.id}|${ev.block.x},${ev.block.y},${ev.block.z}`;
  const u = ultimo.get(ev.player.id);
  const repetido = u !== undefined && u.k === k && system.currentTick - u.t <= 8;
  ultimo.set(ev.player.id, { k, t: system.currentTick });
  return ev.isFirstEvent || !repetido;
}

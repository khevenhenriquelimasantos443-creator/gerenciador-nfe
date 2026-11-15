import { GameMode, Player, PlayerBreakBlockAfterEvent, world } from "@minecraft/server";

/*
 * Bloco que guarda dados (itens, líquidos, frequências, melhorias) tem de soltar tudo e limpar o que guardou também quando
 * quebra por explosão (Creeper, TNT) ou comando: nesses casos o jogo manda blockExplode e não playerBreakBlock, e o conteúdo
 * se perdia (os dados ficavam órfãos no mundo). `quebrado(fn)` roda a mesma função nos dois casos; na explosão não há jogador,
 * então `player` é um falso (sempre em Sobrevivência, e os avisos e missões o ignoram).
 */
export const ID_FALSO = "explosao";
const FALSO = new Proxy(
  {},
  {
    get: (_, p) => (p === "id" ? ID_FALSO : p === "getGameMode" ? () => GameMode.Survival : p === "isSneaking" ? false : () => undefined),
  },
) as unknown as Player;
type Fn = (ev: PlayerBreakBlockAfterEvent) => void;
const lista: Fn[] = [];
let ligado = false;
export function quebrado(fn: Fn): void {
  world.afterEvents.playerBreakBlock.subscribe(fn);
  lista.push(fn);
  if (ligado) return;
  ligado = true;
  world.afterEvents.blockExplode.subscribe((ev) => {
    // Uma explosão grande chama isto uma vez por bloco: bloco do jogo base nunca interessa aos tratadores (todos são de blocos cl:).
    if (!ev.explodedBlockPermutation.type.id.startsWith("cl:")) return;
    const falso = {
      player: FALSO, block: ev.block, dimension: ev.dimension, brokenBlockPermutation: ev.explodedBlockPermutation,
      itemStackBeforeBreak: undefined, itemStackAfterBreak: undefined,
    } as unknown as PlayerBreakBlockAfterEvent;
    for (const f of lista) {
      try {
        f(falso);
      } catch {
        // um tratador que dependia do jogador não pode derrubar os outros
      }
    }
  });
}

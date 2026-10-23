import { system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";

/*
 * Sem Nether (como no Crash Landing): o portal não acende. Acender fogo na obsidiana com isqueiro ou
 * bola de fogo é cancelado; se o portal acender de outro jeito e alguém atravessar, ele volta para onde
 * estava e o portal é apagado.
 */
const ACENDEDORES = new Set(["minecraft:flint_and_steel", "minecraft:fire_charge"]);

export function registrarSemNether(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (!ev.itemStack || !ACENDEDORES.has(ev.itemStack.typeId)) return;
    if (ev.block.typeId !== "minecraft:obsidian" && ev.block.typeId !== "minecraft:crying_obsidian") return;
    ev.cancel = true;
    const j = ev.player;
    system.run(() => aviso(j, "cl.nether.bloqueado", 4));
  });
  world.afterEvents.playerDimensionChange.subscribe(({ player, toDimension, fromDimension, fromLocation }) => {
    if (toDimension.id !== "minecraft:nether") return;
    system.run(() => {
      try {
        const { x, y, z } = fromLocation;
        fromDimension.runCommand(`fill ${Math.floor(x) - 3} ${Math.floor(y) - 3} ${Math.floor(z) - 3} ${Math.floor(x) + 3} ${Math.floor(y) + 3} ${Math.floor(z) + 3} air replace portal`);
      } catch {
        // sem portal por perto
      }
      player.teleport(fromLocation, { dimension: fromDimension });
      aviso(player, "cl.nether.bloqueado", 5);
    });
  });
}

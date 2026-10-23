import { BlockPermutation, system, world } from "@minecraft/server";
import { IDS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { toqueNovo } from "../util/toque.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";

/*
 * Purificar água no caldeirão (EnviroMine, 1.2.0): caldeirão com água e calor embaixo (fogo, fogueira
 * acesa, lava, magma). Pegar água dele com a garrafa de vidro dá Água Boa (fervida) no lugar da garrafa
 * de água salgada do jogo. Sem calor, o caldeirão continua dando a água salgada normal.
 */
const CALOR = new Set(["minecraft:fire", "minecraft:soul_fire", "minecraft:lava", "minecraft:flowing_lava", "minecraft:magma", "minecraft:campfire", "minecraft:soul_campfire"]);

export function registrarCaldeirao(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "minecraft:glass_bottle" || ev.block.typeId !== "minecraft:cauldron" || !toqueNovo(ev)) return;
    const p = ev.block.permutation;
    const nivel = p.getState("fill_level" as never) as unknown as number;
    const liquido = p.getState("cauldron_liquid" as never) as unknown as string;
    if (liquido !== "water" || !(nivel >= 2)) return;
    const baixo = ev.block.below();
    if (!baixo || !CALOR.has(baixo.typeId)) return;
    if (baixo.typeId.endsWith("campfire") && baixo.permutation.getState("extinguished" as never)) return;
    ev.cancel = true;
    const j = ev.player, bloco = ev.block;
    system.run(() => {
      try {
        bloco.setPermutation(BlockPermutation.resolve("minecraft:cauldron", { fill_level: nivel - 2, cauldron_liquid: "water" } as never));
      } catch {
        return;
      }
      gastarDaMao(j);
      darAoJogador(j, IDS.aguaBoa, 1);
      j.playSound("bucket.fill_water");
      registrarAcao(j, "caldeirao");
    });
  });
}

import { BlockCustomComponent, ItemStack, system, world } from "@minecraft/server";
import { GERADOR_MONSTROS, IDS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { escolher, sortearSaque } from "../util/aleatorio.js";

/*
 * Gerador de Monstros: o bloco das cidades e masmorras.
 * - minecraft:tick de 200 (10 s): se houver jogador a até GERADOR_MONSTROS.raioJogador blocos e
 *   menos de GERADOR_MONSTROS.limitePerto monstros a até 10 blocos, põe 1 ou 2 monstros em volta
 *   (abaixo de y = 0, os do fundo: esqueletos, errantes, aranhas das cavernas, creepers).
 * - Quebrar dá saque e conta para as missões. Não cai como item (loot vazio no JSON).
 * Custo: uma busca de jogadores a cada 10 s por gerador, só em chunk carregado.
 */
export const geradorMonstros: BlockCustomComponent = {
  onTick(e) {
    const centro = e.block.center();
    if (e.dimension.getPlayers({ location: centro, maxDistance: GERADOR_MONSTROS.raioJogador }).length === 0) return;
    if (e.dimension.getEntities({ location: centro, maxDistance: 10, families: ["monster"] }).length >= GERADOR_MONSTROS.limitePerto) return;
    const [min, max] = GERADOR_MONSTROS.porVez;
    const quantos = min + Math.floor(Math.random() * (max - min + 1));
    // 1.3.0: o Gerador de Blazes (topo da torre de rádio das cidades) só põe blazes.
    const lista = e.block.typeId === "cl:gerador_blaze" ? GERADOR_MONSTROS.blazes : e.block.y < 0 ? GERADOR_MONSTROS.mobsFundo : GERADOR_MONSTROS.mobs;
    for (let i = 0, tentativas = 0; i < quantos && tentativas < 10; tentativas++) {
      const x = e.block.x + Math.floor(Math.random() * 7) - 3;
      const z = e.block.z + Math.floor(Math.random() * 7) - 3;
      for (const dy of [0, 1, -1]) {
        const pe = e.dimension.getBlock({ x, y: e.block.y + dy, z });
        if (!pe?.isAir || !pe.above()?.isAir || pe.below()?.isAir) continue;
        e.dimension.spawnEntity(escolher(lista), { x: x + 0.5, y: pe.y, z: z + 0.5 });
        try {
          e.dimension.spawnParticle("minecraft:basic_flame_particle", { x: x + 0.5, y: pe.y + 0.5, z: z + 0.5 });
        } catch {
          // enfeite
        }
        i++;
        break;
      }
    }
  },
};

export function registrarGeradorMonstros(): void {
  world.afterEvents.playerBreakBlock.subscribe(({ player, brokenBlockPermutation, block, dimension }) => {
    if (brokenBlockPermutation.type.id !== IDS.geradorMonstros) return;
    registrarAcao(player, "spawner");
    const local = block.center();
    system.run(() => {
      for (const { item, quantidade } of sortearSaque(GERADOR_MONSTROS.saque)) dimension.spawnItem(new ItemStack(item, quantidade), local);
      for (let i = 0; i < 4; i++) dimension.spawnEntity("minecraft:xp_orb", local);
    });
  });
}

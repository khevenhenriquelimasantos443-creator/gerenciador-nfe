import { Dimension, Vector3, world } from "@minecraft/server";

/*
 * Gerador de monstros do próprio Minecraft (1.15.1): um spawner com o mob escolhido, posto como uma estrutura de um
 * bloco (BP/structures/cl/spawner_<mob>.mcstructure, de tools/gerar-geracao.py), porque o script não escolhe o mob
 * de um spawner. Usado nas cidades e nas masmorras.
 */
export const estruturaDoSpawner = (mob: string): string => `cl:spawner_${mob.replace(":", "_")}`;

export function porSpawner(dim: Dimension, p: Vector3, mob: string): void {
  try {
    world.structureManager.place(estruturaDoSpawner(mob), dim, p);
  } catch (erro) {
    console.warn(`[Pouso Forçado] spawner de ${mob}: ${erro}`);
  }
}

import { Dimension, Entity, Vector3 } from "@minecraft/server";

/**
 * Mobs que o próprio add-on põe no mundo (cápsulas, Geradores de Monstros, Faraó e múmias, Golem de Areia,
 * slime do barril) levam esta marca: a regra do dia (scripts/mundo/horda_noturna.ts) não mexe neles.
 * Os monstros da horda não levam: de manhã eles vão embora como os outros.
 */
export const DO_ADDON = "cl:do_addon";

export function nascerDoAddon(dimensao: Dimension, id: string, local: Vector3): Entity {
  const e = dimensao.spawnEntity(id, local);
  e.addTag(DO_ADDON);
  return e;
}

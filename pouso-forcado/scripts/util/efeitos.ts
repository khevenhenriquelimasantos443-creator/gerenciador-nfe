import { Dimension, Vector3 } from "@minecraft/server";

/** Partícula de enfeite (RP/particles/*.json); se falhar (chunk descarregado etc.), só ignora. */
export function particula(dimensao: Dimension, id: string, local: Vector3): void {
  try {
    dimensao.spawnParticle(id, local);
  } catch {
    // enfeite
  }
}

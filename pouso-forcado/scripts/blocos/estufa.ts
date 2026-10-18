import { Block, BlockCustomComponent } from "@minecraft/server";
import { ESTUFA } from "../config.js";

/*
 * Estufa: a cada minecraft:tick (10 s) olha a área em volta (ESTUFA.raio, de yAbaixo a yAcima):
 * - terra arada fica sempre molhada (dá para plantar longe da água);
 * - plantações (trigo, cenoura, batata, beterraba, caules de abóbora e melancia) crescem um
 *   estágio, com chance ESTUFA.chanceCrescer;
 * - mudas ficam prontas para virar árvore no próximo tick aleatório do jogo.
 * Custo: até 9×9×4 = 324 blocos lidos a cada 10 s por estufa, só em chunks carregados.
 */
const CRESCIMENTO: Readonly<Record<string, number>> = {
  "minecraft:wheat": 7,
  "minecraft:carrots": 7,
  "minecraft:potatoes": 7,
  "minecraft:beetroot": 7,
  "minecraft:pumpkin_stem": 7,
  "minecraft:melon_stem": 7,
};

function cuidar(bloco: Block): void {
  const id = bloco.typeId;
  const p = bloco.permutation;
  if (id === "minecraft:farmland") {
    if (p.getState("moisturized_amount") !== 7) bloco.setPermutation(p.withState("moisturized_amount", 7));
    return;
  }
  const maximo = CRESCIMENTO[id];
  if (maximo !== undefined) {
    const g = p.getState("growth") as number;
    if (g < maximo && Math.random() < ESTUFA.chanceCrescer) bloco.setPermutation(p.withState("growth", g + 1));
    return;
  }
  if (id.endsWith("_sapling") && p.getState("age_bit") === false) {
    if (Math.random() < ESTUFA.chanceCrescer) bloco.setPermutation(p.withState("age_bit", true));
  }
}

export const estufa: BlockCustomComponent = {
  onTick(e) {
    const { x, y, z } = e.block.location;
    const r = ESTUFA.raio;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        for (let dy = -ESTUFA.yAbaixo; dy <= ESTUFA.yAcima; dy++) {
          try {
            const bloco = e.dimension.getBlock({ x: x + dx, y: y + dy, z: z + dz });
            if (bloco && !bloco.isAir) cuidar(bloco);
          } catch {
            // fora do mundo carregado ou estado que não existe nessa versão
          }
        }
      }
    }
  },
};

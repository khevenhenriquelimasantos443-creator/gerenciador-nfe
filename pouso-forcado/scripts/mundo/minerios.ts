import { Dimension } from "@minecraft/server";
import { MINERIOS, PETROLEO } from "../config.js";

/*
 * Minérios do mundo plano: o jogo não gera minérios em mundo plano, então cada chunk
 * recebe seus veios uma única vez, junto com o relevo (scripts/mundo/relevo.ts).
 * Cada veio é uma caminhada aleatória curta dentro do chunk que troca só pedra e ardósia.
 * Custo: ~250 blocos por chunk novo, no máximo RELEVO.maxPorCiclo chunks por segundo.
 */

const PEDRA = "minecraft:stone";
const ARDOSIA = "minecraft:deepslate";
const PASSOS = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
] as const;

export function porMinerios(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  for (const { minerio, bloco: proprio, veios, tamanho, yMin, yMax } of MINERIOS) {
    for (let v = 0; v < veios; v++) {
      let x = Math.floor(sorte() * 16);
      let y = yMin + Math.floor(sorte() * (yMax - yMin + 1));
      let z = Math.floor(sorte() * 16);
      for (let i = 0; i < tamanho; i++) {
        const bloco = dimensao.getBlock({ x: x0 + x, y, z: z0 + z });
        if (proprio) {
          if (bloco?.typeId === PEDRA) bloco.setType(proprio); // mármore e calcário só na pedra
        } else if (bloco?.typeId === PEDRA) bloco.setType(`minecraft:${minerio}_ore`);
        else if (bloco?.typeId === ARDOSIA) bloco.setType(`minecraft:deepslate_${minerio}_ore`);
        const [dx, dy, dz] = PASSOS[Math.floor(sorte() * PASSOS.length)];
        // Fica dentro do chunk e da faixa de altura.
        x = Math.min(15, Math.max(0, x + dx));
        y = Math.min(yMax, Math.max(yMin, y + dy));
        z = Math.min(15, Math.max(0, z + dz));
      }
    }
  }
  porPetroleo(dimensao, x0, z0, sorte);
}

// Poço de petróleo (BuildCraft): bolsão redondo no subsolo, coluna até a superfície e mancha no chão.
const OLEO = "cl:petroleo";
const TROCA = new Set([PEDRA, ARDOSIA, "minecraft:sandstone", "minecraft:sand", "minecraft:red_sand", "minecraft:dirt", "minecraft:gravel"]);
function porPetroleo(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  if (sorte() >= PETROLEO.chance) return;
  const r = PETROLEO.raio;
  const cx = x0 + r + Math.floor(sorte() * (16 - 2 * r)), cz = z0 + r + Math.floor(sorte() * (16 - 2 * r));
  const cy = PETROLEO.yMin + Math.floor(sorte() * (PETROLEO.yMax - PETROLEO.yMin + 1));
  const trocar = (x: number, y: number, z: number) => {
    const b = dimensao.getBlock({ x, y, z });
    if (b && TROCA.has(b.typeId)) b.setType(OLEO);
  };
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++) if (dx * dx + dy * dy + dz * dz <= r * r + 1) trocar(cx + dx, cy + dy, cz + dz);
  const topo = dimensao.getTopmostBlock({ x: cx, z: cz });
  if (!topo) return;
  for (let y = cy + r; y <= topo.y; y++) trocar(cx, y, cz);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) trocar(cx + dx, topo.y, cz + dz);
}

import { Dimension, ListBlockVolume, Vector3 } from "@minecraft/server";
import { MINERIOS, PETROLEO } from "../config.js";

/*
 * Minérios do mundo plano: o jogo não gera minérios em mundo plano, então cada chunk
 * recebe seus veios uma única vez, junto com o relevo (scripts/mundo/relevo.ts).
 * Cada veio é uma caminhada aleatória curta dentro do chunk que troca só pedra e ardósia.
 * Custo: um fillBlocks por minério por chunk novo (só troca pedra e ardósia).
 */

const PEDRA = "minecraft:stone";
const ARDOSIA = "minecraft:deepslate";
const PASSOS = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
] as const;

export function porMinerios(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  // 1.15.1: a caminhada do veio só calcula as posições; cada minério é um fillBlocks numa lista, que só troca a pedra
  // (ou a ardósia) — antes eram ~250 getBlock + setType por chunk (~9 ms).
  for (const { minerio, bloco: proprio, veios, tamanho, yMin, yMax } of MINERIOS) {
    const lista: Vector3[] = [];
    for (let v = 0; v < veios; v++) {
      let x = Math.floor(sorte() * 16);
      let y = yMin + Math.floor(sorte() * (yMax - yMin + 1));
      let z = Math.floor(sorte() * 16);
      for (let i = 0; i < tamanho; i++) {
        lista.push({ x: x0 + x, y, z: z0 + z });
        const [dx, dy, dz] = PASSOS[Math.floor(sorte() * PASSOS.length)];
        // Fica dentro do chunk e da faixa de altura.
        x = Math.min(15, Math.max(0, x + dx));
        y = Math.min(yMax, Math.max(yMin, y + dy));
        z = Math.min(15, Math.max(0, z + dz));
      }
    }
    if (!lista.length) continue;
    const volume = new ListBlockVolume(lista);
    if (proprio) dimensao.fillBlocks(volume, proprio, { blockFilter: { includeTypes: [PEDRA] } }); // mármore e calcário só na pedra
    else {
      dimensao.fillBlocks(volume, `minecraft:${minerio}_ore`, { blockFilter: { includeTypes: [PEDRA] } });
      dimensao.fillBlocks(volume, `minecraft:deepslate_${minerio}_ore`, { blockFilter: { includeTypes: [ARDOSIA] } });
    }
  }
  porPetroleo(dimensao, x0, z0, sorte);
}

// Bolsão de petróleo (BuildCraft): redondo, bem abaixo da areia, sem nada que apareça na superfície.
const OLEO = "cl:petroleo";
const TROCA = new Set([PEDRA, ARDOSIA, "minecraft:tuff", "minecraft:gravel", "minecraft:dirt"]);
function porPetroleo(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  if (sorte() >= PETROLEO.chance) return;
  const r = PETROLEO.raio;
  const cx = x0 + r + Math.floor(sorte() * (16 - 2 * r)), cz = z0 + r + Math.floor(sorte() * (16 - 2 * r));
  const cy = PETROLEO.yMin + Math.floor(sorte() * (PETROLEO.yMax - PETROLEO.yMin + 1));
  const lista: Vector3[] = [];
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++) if (dx * dx + dy * dy + dz * dz <= r * r + 1) lista.push({ x: cx + dx, y: cy + dy, z: cz + dz });
  dimensao.fillBlocks(new ListBlockVolume(lista), OLEO, { blockFilter: { includeTypes: [...TROCA] } });
}

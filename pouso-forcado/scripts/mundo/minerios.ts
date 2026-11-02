import { Dimension, ListBlockVolume, Vector3 } from "@minecraft/server";
import { MINERIOS, PETROLEO } from "../config.js";

/*
 * Veios do mundo plano: o jogo não gera minérios em mundo plano, então cada chunk recebe seus veios uma única vez,
 * junto com o relevo (scripts/mundo/relevo.ts). Desde a 1.16.0 não há minério do Minecraft (só da peneira): ficam o
 * mármore e o calcário do Chisel e os bolsões de petróleo.
 * Cada veio é uma caminhada aleatória curta dentro do chunk que troca só pedra e arenito.
 * Custo: um fillBlocks por veio por chunk novo.
 */

const PEDRA = "minecraft:stone";
const ARDOSIA = "minecraft:deepslate";
const ARENITO = "minecraft:sandstone";
const PASSOS = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
] as const;

export function porMinerios(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  // 1.15.1: a caminhada do veio só calcula as posições; cada veio é um fillBlocks numa lista, que só troca a pedra
  // (ou o arenito) — antes eram ~250 getBlock + setType por chunk (~9 ms).
  for (const { bloco, veios, tamanho, yMin, yMax } of MINERIOS) {
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
    dimensao.fillBlocks(new ListBlockVolume(lista), bloco, { blockFilter: { includeTypes: [PEDRA, ARENITO] } });
  }
  porPetroleo(dimensao, x0, z0, sorte);
}

// Bolsão de petróleo (BuildCraft): redondo, bem abaixo da areia, sem nada que apareça na superfície.
const OLEO = "cl:petroleo";
const TROCA = new Set([PEDRA, ARDOSIA, ARENITO, "minecraft:tuff", "minecraft:gravel", "minecraft:dirt"]);
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

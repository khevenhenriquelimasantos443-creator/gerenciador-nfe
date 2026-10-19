import { RARAS } from "../config.js";
import { rng, sementeDe } from "../util/aleatorio.js";
import { cidadeDoChunk } from "./cidade.js";

/*
 * Estruturas raras (templo soterrado, destroços de nave): cada tipo divide o mapa em quadrados
 * de RARAS[i].celula chunks; cada quadrado tem no máximo uma, num chunk sorteado pela semente.
 * Nada é guardado: qualquer chunk sabe calcular se é o escolhido do seu quadrado.
 * Não nascem perto da nave nem dentro (ou do lado) de cidades.
 */
export type Rara = (typeof RARAS)[number];
const cache = new Map<string, [number, number] | null>();
const DIST_NAVE = 4; // chunks

/** Chunk escolhido da estrutura `i` na célula (ou null se esta célula não tem). */
function escolhido(i: number, celX: number, celZ: number, semente: number, nave: [number, number]): [number, number] | null {
  const chave = `${i}:${semente}:${celX},${celZ}`;
  const guardado = cache.get(chave);
  if (guardado !== undefined) return guardado;
  const r = RARAS[i];
  const sorte = rng(sementeDe(semente, celX, celZ, 101 + i));
  let pos: [number, number] | null = null;
  if (sorte() < r.chance) {
    // Longe da borda da célula, para a estrutura (até 17 blocos) ficar dentro dela.
    const cx = celX * r.celula + 1 + Math.floor(sorte() * (r.celula - 3));
    const cz = celZ * r.celula + 1 + Math.floor(sorte() * (r.celula - 3));
    const pertoDaNave = Math.max(Math.abs(cx - nave[0]), Math.abs(cz - nave[1])) < DIST_NAVE;
    const naCidade = [[0, 0], [2, 0], [0, 2], [2, 2], [-2, 0], [0, -2]].some(([dx, dz]) => cidadeDoChunk(cx + dx, cz + dz, semente, nave));
    if (!pertoDaNave && !naCidade) pos = [cx, cz];
  }
  cache.set(chave, pos);
  return pos;
}

/** A estrutura rara cujo canto fica neste chunk (ela começa em x0, z0 do chunk). */
export function raraDoChunk(cx: number, cz: number, semente: number, nave: [number, number]): Rara | undefined {
  return RARAS.find((r, i) => {
    const e = escolhido(i, Math.floor(cx / r.celula), Math.floor(cz / r.celula), semente, nave);
    return e !== null && e[0] === cx && e[1] === cz;
  });
}

/** Quantos blocos a coluna x, z está fora da estrutura rara mais perto (Infinity se nenhuma). */
export function foraDasRaras(x: number, z: number, semente: number, nave: [number, number]): number {
  let menor = Infinity;
  RARAS.forEach((r, i) => {
    const e = escolhido(i, Math.floor(Math.floor(x / 16) / r.celula), Math.floor(Math.floor(z / 16) / r.celula), semente, nave);
    if (!e) return;
    const x1 = e[0] * 16, z1 = e[1] * 16;
    const dx = Math.max(x1 - x, 0, x - (x1 + r.tamanho - 1));
    const dz = Math.max(z1 - z, 0, z - (z1 + r.tamanho - 1));
    menor = Math.min(menor, Math.max(dx, dz));
  });
  return menor;
}

/** A estrutura rara do tipo mais perto da posição (olha o quadrado da posição e os 8 em volta). */
export function raraMaisProxima(tipo: Rara["tipo"], x: number, z: number, semente: number, nave: [number, number]) {
  const i = RARAS.findIndex((r) => r.tipo === tipo);
  const r = RARAS[i];
  const celX = Math.floor(Math.floor(x / 16) / r.celula), celZ = Math.floor(Math.floor(z / 16) / r.celula);
  let melhor: { x: number; z: number; distancia: number } | undefined;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const e = escolhido(i, celX + dx, celZ + dz, semente, nave);
      if (!e) continue;
      const ex = e[0] * 16 + Math.floor(r.tamanho / 2), ez = e[1] * 16 + Math.floor(r.tamanho / 2);
      const d = Math.hypot(x - ex, z - ez);
      if (!melhor || d < melhor.distancia) melhor = { x: ex, z: ez, distancia: d };
    }
  }
  return melhor;
}

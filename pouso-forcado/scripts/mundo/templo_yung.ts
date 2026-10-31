import { Dimension, ItemStack, system, world } from "@minecraft/server";
import { MUNDO_PLANO, TEMPLO_SAQUE, TEMPLO_YUNG_MUNDO } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { chunkDaNave, rng, sementeDe, sementeDoMundo, sortearSaque } from "../util/aleatorio.js";
import { cidadeDoChunk } from "./cidade.js";
import { TEMPLO_YUNG } from "./templo_yung_dados.js";

/*
 * Templo do Deserto do YUNG's Better Desert Temples (1.14.0): a pirâmide de 83×83 montada das peças do mod por
 * tools/gerar-templo-yung.py, em pedaços de 64×64. Como as raras (raras.ts), o mapa é dividido em quadrados de
 * TEMPLO_YUNG_MUNDO.celula chunks com no máximo um templo, num chunk sorteado pela semente (longe da nave e das cidades).
 * Cada pedaço é posto pelo relevo quando o chunk do canto dele é decorado e a área de 64×64 está carregada; os baús
 * do pedaço ganham o saque do templo e o pedaço do meio ganha o Faraó. A pirâmide fica com o centro ~14 blocos abaixo
 * da areia (no mod: 4 a 24).
 */
type Templo = { v: number; cx: number; cz: number };
const cache = new Map<string, Templo | null>();
const PEDACO = 64;
const variante = (v: number) => TEMPLO_YUNG.variantes[v];

function temploDaCelula(celX: number, celZ: number, semente: number, nave: [number, number]): Templo | null {
  const chave = `${semente}:${celX},${celZ}`;
  const g = cache.get(chave);
  if (g !== undefined) return g;
  const c = TEMPLO_YUNG_MUNDO.celula;
  const sorte = rng(sementeDe(semente, celX, celZ, 151));
  let t: Templo | null = null;
  if (sorte() < TEMPLO_YUNG_MUNDO.chance) {
    const cx = celX * c + 2 + Math.floor(sorte() * (c - 10));
    const cz = celZ * c + 2 + Math.floor(sorte() * (c - 10));
    const v = Math.floor(sorte() * TEMPLO_YUNG.variantes.length);
    const longe = Math.max(Math.abs(cx - nave[0]), Math.abs(cz - nave[1])) >= TEMPLO_YUNG_MUNDO.distNave;
    let cidade = false;
    for (let dx = -1; dx <= 6 && !cidade; dx++) for (let dz = -1; dz <= 6 && !cidade; dz++) cidade = !!cidadeDoChunk(cx + dx, cz + dz, semente, nave);
    if (longe && !cidade) t = { v, cx, cz };
  }
  cache.set(chave, t);
  return t;
}
function temploPerto(x: number, z: number, semente: number, nave: [number, number]): Templo | null {
  const c = TEMPLO_YUNG_MUNDO.celula;
  return temploDaCelula(Math.floor(Math.floor(x / 16) / c), Math.floor(Math.floor(z / 16) / c), semente, nave);
}

/** Quantos blocos (x, z) está fora da pirâmide (0 dentro); as dunas ficam planas em volta. */
export function foraDoYung(x: number, z: number, semente: number, nave: [number, number]): number {
  const t = temploPerto(x, z, semente, nave);
  if (!t) return Infinity;
  const [X, , Z] = variante(t.v).tam;
  const x1 = t.cx * 16, z1 = t.cz * 16;
  return Math.max(Math.max(x1 - x, 0, x - (x1 + X - 1)), Math.max(z1 - z, 0, z - (z1 + Z - 1)));
}

/** O pedaço do templo cujo canto é este chunk. */
export function pedacoDoChunk(cx: number, cz: number, semente: number, nave: [number, number]): { t: Templo; i: number; k: number } | undefined {
  const t = temploPerto(cx * 16, cz * 16, semente, nave);
  if (!t) return undefined;
  const di = cx - t.cx, dk = cz - t.cz;
  if (di < 0 || dk < 0 || di % 4 || dk % 4) return undefined;
  const i = di / 4, k = dk / 4;
  return variante(t.v).tiles.some(([a, b]) => a === i && b === k) ? { t, i, k } : undefined;
}

export function porPedaco(dim: Dimension, p: { t: Templo; i: number; k: number }, sorte: () => number): void {
  const v = variante(p.t.v);
  const ox = p.t.cx * 16, oz = p.t.cz * 16;
  const y0 = MUNDO_PLANO.superficieY - TEMPLO_YUNG_MUNDO.profundidade - v.ancora[1];
  world.structureManager.place(`cl:templo_yung_${p.t.v}_${p.i}_${p.k}`, dim, { x: ox + p.i * PEDACO, y: y0, z: oz + p.k * PEDACO });
  const dentro = (q: readonly number[]) => Math.floor(q[0] / PEDACO) === p.i && Math.floor(q[2] / PEDACO) === p.k;
  for (const b of v.baus) {
    if (!dentro(b)) continue;
    const c = dim.getBlock({ x: ox + b[0], y: y0 + b[1], z: oz + b[2] })?.getComponent("minecraft:inventory")?.container;
    if (!c) continue;
    for (const { item, quantidade } of sortearSaque(TEMPLO_SAQUE, sorte)) {
      try {
        c.addItem(new ItemStack(item, Math.min(quantidade, new ItemStack(item, 1).maxAmount)));
      } catch {
        // item de outro pack
      }
    }
  }
  if (dentro(v.ancora)) {
    try {
      dim.spawnEntity("cl:farao", { x: ox + v.ancora[0] + 0.5, y: y0 + v.ancora[1] + 1, z: oz + v.ancora[2] + 0.5 });
    } catch {
      // sem faraó
    }
  }
}

export function registrarTemploYung(): void {
  // Missão: entrar na pirâmide (abaixo da areia, dentro dela).
  system.runInterval(() => {
    const nave = chunkDaNave();
    if (!nave) return;
    const semente = sementeDoMundo();
    for (const j of world.getPlayers()) {
      if (j.dimension.id !== "minecraft:overworld" || j.location.y > MUNDO_PLANO.superficieY - 3) continue;
      if (foraDoYung(Math.floor(j.location.x), Math.floor(j.location.z), semente, nave) === 0) registrarAcao(j, "templo_yung");
    }
  }, 60);
}

/** O templo mais perto (para o comando /cl:templo e a bússola). */
export function temploYungMaisProximo(x: number, z: number, semente: number, nave: [number, number]) {
  const c = TEMPLO_YUNG_MUNDO.celula;
  const celX = Math.floor(Math.floor(x / 16) / c), celZ = Math.floor(Math.floor(z / 16) / c);
  let melhor: { x: number; z: number; distancia: number } | undefined;
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const t = temploDaCelula(celX + dx, celZ + dz, semente, nave);
      if (!t) continue;
      const [X, , Z] = variante(t.v).tam;
      const ex = t.cx * 16 + Math.floor(X / 2), ez = t.cz * 16 + Math.floor(Z / 2);
      const d = Math.hypot(x - ex, z - ez);
      if (!melhor || d < melhor.distancia) melhor = { x: ex, z: ez, distancia: d };
    }
  return melhor;
}

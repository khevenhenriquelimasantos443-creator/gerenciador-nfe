import { Dimension, system, world } from "@minecraft/server";
import { MUNDO_PLANO, NATIVO, PROPS, TEMPLO_YUNG_MUNDO } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { chunkDaNave, rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { cidadeDoChunk } from "./cidade.js";
import { naPiramideNativa, piramideMaisProxima } from "./nativo.js";
import { tipoDoMundo } from "./relevo.js";
import { TEMPLO_YUNG } from "./templo_yung_dados.js";
import { mundoPlano } from "./tipo.js";
import { intervalo } from "../util/perfil.js";

/*
 * Templo do Deserto do YUNG's Better Desert Temples (1.14.0): a pirâmide de 83×83 montada das peças do mod por
 * tools/gerar-templo-yung.py, em pedaços de 64×64. Como as raras (raras.ts), o mapa é dividido em quadrados de
 * TEMPLO_YUNG_MUNDO.celula chunks com no máximo um templo, num chunk sorteado pela semente (longe da nave e das cidades).
 * Cada pedaço é posto pelo relevo quando o chunk do canto dele é decorado e a área de 64×64 está carregada; os baús
 * enchem com o saque do templo ao abrir e o pedaço do meio ganha o Faraó. No mundo normal (1.15.0) quem põe a
 * pirâmide inteira é a geração natural do jogo (scripts/mundo/nativo.ts). A pirâmide fica com o centro ~14 blocos abaixo
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

export function porPedaco(dim: Dimension, p: { t: Templo; i: number; k: number }): void {
  const v = variante(p.t.v);
  const ox = p.t.cx * 16, oz = p.t.cz * 16;
  const y0 = MUNDO_PLANO.superficieY - TEMPLO_YUNG_MUNDO.profundidade - v.ancora[1];
  world.structureManager.place(`cl:templo_yung_${p.t.v}_${p.i}_${p.k}`, dim, { x: ox + p.i * PEDACO, y: y0, z: oz + p.k * PEDACO });
  // Os baús já vêm com a tabela de saque (loot_tables/chests/cl_piramide.json): enchem ao abrir.
  const dentro = (q: readonly number[]) => Math.floor(q[0] / PEDACO) === p.i && Math.floor(q[2] / PEDACO) === p.k;
  if (dentro(v.ancora)) {
    try {
      dim.spawnEntity("cl:farao", { x: ox + v.ancora[0] + 0.5, y: y0 + v.ancora[1] + 1, z: oz + v.ancora[2] + 0.5 });
    } catch {
      // sem faraó
    }
  }
}

// ---------- Mundo normal (1.15.0): a pirâmide da grade, posta uma vez quando alguém chega perto ----------
const postas = (): string[] => {
  try {
    return JSON.parse((world.getDynamicProperty(PROPS.piramidesPostas) as string) ?? "[]") as string[];
  } catch {
    return [];
  }
};
let pendente = false; // uma pirâmide carregando de cada vez
function porPiramide(dim: Dimension, p: { v: number; x0: number; z0: number }): void {
  const v = variante(p.v);
  const [X, , Z] = v.tam;
  const meio = dim.getTopmostBlock({ x: p.x0 + Math.floor(X / 2), z: p.z0 + Math.floor(Z / 2) });
  const y0 = (meio ? meio.y + 1 : 64) - TEMPLO_YUNG_MUNDO.profundidade - v.ancora[1];
  for (const [i, k] of v.tiles) world.structureManager.place(`cl:templo_yung_${p.v}_${i}_${k}`, dim, { x: p.x0 + i * PEDACO, y: y0, z: p.z0 + k * PEDACO });
  try {
    dim.spawnEntity("cl:farao", { x: p.x0 + v.ancora[0] + 0.5, y: y0 + v.ancora[1] + 1, z: p.z0 + v.ancora[2] + 0.5 });
  } catch {
    // sem faraó
  }
}
function piramideNoMundoNormal(): void {
  if (pendente) return;
  const feitas = postas();
  for (const j of world.getPlayers()) {
    if (j.dimension.id !== "minecraft:overworld") continue;
    const p = piramideMaisProxima(j.location.x, j.location.z);
    if (!p || p.distancia > NATIVO.pertoPiramide) continue;
    const chave = `${p.x0},${p.z0}`;
    if (feitas.includes(chave)) continue;
    const dim = j.dimension;
    const [X, , Z] = variante(p.v).tam;
    // Carrega a área (6×6 chunks), põe os pedaços e solta a área. Só uma vez por pirâmide.
    const opcoes = { dimension: dim, from: { x: p.x0, y: -64, z: p.z0 }, to: { x: p.x0 + X - 1, y: 100, z: p.z0 + Z - 1 } };
    const gerente = world.tickingAreaManager;
    if (!gerente.hasCapacity(opcoes)) return;
    pendente = true;
    const fim = () => {
      pendente = false;
      try {
        gerente.removeTickingArea("cl_piramide");
      } catch {
        // já saiu
      }
    };
    gerente
      .createTickingArea("cl_piramide", opcoes)
      .then(() => {
        const lista = postas();
        if (!lista.includes(chave)) {
          porPiramide(dim, p);
          lista.push(chave);
          world.setDynamicProperty(PROPS.piramidesPostas, JSON.stringify(lista.slice(-200)));
        }
        fim();
      })
      .catch(fim);
    return;
  }
}

export function registrarTemploYung(): void {
  intervalo("templo", () => {
    if (tipoDoMundo() === "normal") piramideNoMundoNormal();
  }, 40);
  // Missão: entrar na pirâmide (abaixo da areia, dentro dela).
  intervalo("templo", () => {
    const nave = chunkDaNave();
    if (!nave) return;
    const semente = sementeDoMundo();
    const plano = mundoPlano();
    for (const j of world.getPlayers()) {
      if (j.dimension.id !== "minecraft:overworld") continue;
      if (!plano) {
        // Mundo normal: a pirâmide da geração natural, com teto por cima da cabeça.
        const { x, y, z } = j.location;
        if (naPiramideNativa(x, z) && (j.dimension.getTopmostBlock({ x, z })?.y ?? 0) > y + 2) registrarAcao(j, "templo_yung");
        continue;
      }
      if (j.location.y > MUNDO_PLANO.superficieY - 3) continue;
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

import { BlockVolume, Dimension, DimensionRegistry, world } from "@minecraft/server";
import { rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { intervalo } from "../util/perfil.js";
import { LUA } from "./oxigenio.js";

/*
 * A Lua do Galacticraft como dimensão própria (Bedrock 26.30: dimensionRegistry, gerador vazio). O terreno sai
 * daqui, chunk a chunk, perto de quem está lá, com as regras do ChunkProviderMoon do Galacticraft:
 * - altura 63 + desvio de três ruídos (frequências 0,0125 / 0,015 / 0,01; amplitudes 8 e 24, misturadas pelo
 *   terceiro), Solo Lunar em cima, 3 de Terra Lunar e Rocha Lunar até o fundo (rocha matriz em y = 0);
 * - crateras de 4 tamanhos (raio 8-12, 13-17, 18-25, 26-30, com pesos 14, 8, 2 e 1), fundo de até 5 blocos com o
 *   perfil 5 − 6·r⁴; crateras que se cruzam somam a profundidade, como no original;
 * - veios de minério de cobre, estanho e queijo na rocha.
 * A marca de "chunk pronto" é a rocha matriz no canto (x0, 0, z0), que não quebra no sobrevivência.
 * Custo: no máximo LUA_GERACAO.maxPorCiclo chunks a cada 10 ticks, só com alguém na Lua; cada chunk é um fill da
 * base e alguns fills por faixa de colunas da mesma altura.
 */
export const LUA_GERACAO = { raioChunks: 4, maxPorCiclo: 2, base: 63, terra: 3 } as const;
const CRATERAS: ReadonlyArray<[number, number, number]> = [[8, 12, 14], [13, 17, 8], [18, 25, 2], [26, 30, 1]];
const CHANCE_CRATERA = 0.22; // por chunk
const VEIOS: ReadonlyArray<[string, number, number, number]> = [
  // bloco, veios por chunk, tamanho, y máximo
  ["cl:minerio_cobre_lunar", 6, 6, 60],
  ["cl:minerio_estanho_lunar", 6, 6, 60],
  ["cl:minerio_queijo", 8, 5, 64],
];
const ROCHA = "cl:rocha_lunar", TERRA = "cl:terra_lunar", SOLO = "cl:solo_lunar", MATRIZ = "minecraft:bedrock";

export function registrarDimensaoLua(registro: DimensionRegistry): void {
  try {
    registro.registerCustomDimension(LUA);
  } catch (erro) {
    console.warn(`[Pouso Forçado] dimensão da Lua: ${erro}`);
  }
}
export const dimensaoLua = (): Dimension => world.getDimension(LUA);

// ---------- Ruído de Perlin 2D (semente própria da Lua) ----------
let perm: Uint8Array | undefined;
function preparar(semente: number): Uint8Array {
  if (perm) return perm;
  const sorte = rng(semente ^ 0x4c554131);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(sorte() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}
const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h: number, x: number, z: number) => ((h & 1 ? -x : x) + (h & 2 ? -z : z)) * (h & 4 ? 0.5 : 1);
function ruido(p: Uint8Array, x: number, z: number, deslocamento: number): number {
  x += deslocamento * 31.7;
  z += deslocamento * 17.3;
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const X = xi & 255, Z = zi & 255, u = suave(xf), v = suave(zf);
  const a = p[p[X] + Z], b = p[p[X + 1] + Z], c = p[p[X] + Z + 1], d = p[p[X + 1] + Z + 1];
  const l1 = grad(a, xf, zf) + (grad(b, xf - 1, zf) - grad(a, xf, zf)) * u;
  const l2 = grad(c, xf, zf - 1) + (grad(d, xf - 1, zf - 1) - grad(c, xf, zf - 1)) * u;
  return l1 + (l2 - l1) * v;
}

/** Altura do chão (o bloco de Solo Lunar) antes das crateras. */
function alturaBase(p: Uint8Array, x: number, z: number): number {
  const d = ruido(p, x * 0.0125, z * 0.0125, 1) * 8;
  const d2 = ruido(p, x * 0.015, z * 0.015, 2) * 24;
  const d3 = (ruido(p, x * 0.01, z * 0.01, 3) - 0.1) * 4;
  const desvio = d3 < 0 ? d : d3 > 1 ? d2 : d + (d2 - d) * d3;
  return Math.floor(LUA_GERACAO.base + desvio);
}

type Cratera = { x: number; z: number; r: number };
function crateraDoChunk(semente: number, cx: number, cz: number): Cratera | undefined {
  const sorte = rng(sementeDe(semente, cx, cz, 0x6372));
  if (sorte() >= CHANCE_CRATERA) return undefined;
  let peso = sorte() * CRATERAS.reduce((s, [, , w]) => s + w, 0);
  const [min, max] = CRATERAS.find(([, , w]) => (peso -= w) < 0) ?? CRATERAS[0];
  return { x: cx * 16 + Math.floor(sorte() * 16), z: cz * 16 + Math.floor(sorte() * 16), r: min + Math.floor(sorte() * (max - min)) };
}

/** Blocos tirados do topo pelas crateras na coluna (somando as que se cruzam). */
function fundoCratera(crateras: ReadonlyArray<Cratera>, x: number, z: number): number {
  let n = 0;
  for (const c of crateras) {
    const dx = (c.x - x) / c.r, dz = (c.z - z) / c.r;
    const r2 = dx * dx + dz * dz;
    if (r2 >= 1) continue;
    const prof = 5 - r2 * r2 * 6;
    if (prof >= 0) n += Math.floor(prof) + 1;
  }
  return n;
}

const preenche = (dim: Dimension, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, bloco: string) => {
  if (y2 < y1) return;
  dim.fillBlocks(new BlockVolume({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }), bloco);
};

export const chunkPronto = (dim: Dimension, x: number, z: number): boolean => {
  const p = { x: Math.floor(x / 16) * 16, y: 0, z: Math.floor(z / 16) * 16 };
  return dim.isChunkLoaded(p) && dim.getBlock(p)?.typeId === MATRIZ;
};

function gerarChunk(dim: Dimension, cx: number, cz: number, semente: number): boolean {
  const x0 = cx * 16, z0 = cz * 16;
  if (!dim.isChunkLoaded({ x: x0, y: 0, z: z0 }) || !dim.isChunkLoaded({ x: x0 + 15, y: 0, z: z0 + 15 })) return false;
  if (dim.getBlock({ x: x0, y: 0, z: z0 })?.typeId === MATRIZ) return true;
  const p = preparar(semente);
  const crateras: Cratera[] = [];
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
    const c = crateraDoChunk(semente, cx + dx, cz + dz);
    if (c) crateras.push(c);
  }
  const topo: number[] = new Array(256);
  let menor = Infinity;
  for (let z = 0; z < 16; z++) for (let x = 0; x < 16; x++) {
    const t = alturaBase(p, x0 + x, z0 + z) - fundoCratera(crateras, x0 + x, z0 + z);
    topo[z * 16 + x] = t;
    menor = Math.min(menor, t);
  }
  const T = LUA_GERACAO.terra;
  // Rocha do fundo até abaixo da coluna mais baixa: um fill só.
  preenche(dim, x0, 1, z0, x0 + 15, menor - T - 1, z0 + 15, ROCHA);
  // Faixas de colunas vizinhas com a mesma altura: rocha que falta, terra e solo.
  for (let z = 0; z < 16; z++) {
    let x = 0;
    while (x < 16) {
      const t = topo[z * 16 + x];
      let fim = x;
      while (fim + 1 < 16 && topo[z * 16 + fim + 1] === t) fim++;
      preenche(dim, x0 + x, menor - T, z0 + z, x0 + fim, t - T - 1, z0 + z, ROCHA);
      preenche(dim, x0 + x, t - T, z0 + z, x0 + fim, t - 1, z0 + z, TERRA);
      preenche(dim, x0 + x, t, z0 + z, x0 + fim, t, z0 + z, SOLO);
      x = fim + 1;
    }
  }
  // Veios de minério (passeio aleatório dentro da rocha).
  const sorte = rng(sementeDe(semente, cx, cz, 0x6f72));
  for (const [bloco, veios, tamanho, yMax] of VEIOS) {
    for (let v = 0; v < veios; v++) {
      let x = x0 + 1 + Math.floor(sorte() * 14), z = z0 + 1 + Math.floor(sorte() * 14), y = 4 + Math.floor(sorte() * (yMax - 4));
      for (let k = 0; k < tamanho; k++) {
        if (x >= x0 && x < x0 + 16 && z >= z0 && z < z0 + 16) {
          const b = dim.getBlock({ x, y, z });
          if (b?.typeId === ROCHA) b.setType(bloco);
        }
        const passo = Math.floor(sorte() * 6);
        if (passo === 0) x++;
        else if (passo === 1) x--;
        else if (passo === 2) z++;
        else if (passo === 3) z--;
        else if (passo === 4) y++;
        else y--;
      }
    }
  }
  // Rocha matriz por último: é a marca de que o chunk ficou pronto.
  preenche(dim, x0, 0, z0, x0 + 15, 0, z0 + 15, MATRIZ);
  return true;
}

const OFFSETS: ReadonlyArray<[number, number]> = (() => {
  const r = LUA_GERACAO.raioChunks;
  const l: Array<[number, number]> = [];
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.hypot(dx, dz) <= r + 0.5) l.push([dx, dz]);
  return l.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
})();
const prontos = new Set<string>();

export function registrarLua(): void {
  intervalo("lua (terreno)", () => {
    const naLua = world.getPlayers().filter((j) => j.dimension.id === LUA);
    if (naLua.length === 0) return;
    const dim = dimensaoLua();
    const semente = sementeDoMundo();
    let orcamento = LUA_GERACAO.maxPorCiclo;
    for (const j of naLua) {
      const pcx = Math.floor(j.location.x / 16), pcz = Math.floor(j.location.z / 16);
      for (const [dx, dz] of OFFSETS) {
        if (orcamento <= 0) return;
        const cx = pcx + dx, cz = pcz + dz, chave = `${cx},${cz}`;
        if (prontos.has(chave)) continue;
        try {
          if (!dim.isChunkLoaded({ x: cx * 16, y: 0, z: cz * 16 })) continue;
          const ja = dim.getBlock({ x: cx * 16, y: 0, z: cz * 16 })?.typeId === MATRIZ;
          if (ja || gerarChunk(dim, cx, cz, semente)) {
            prontos.add(chave);
            if (!ja) orcamento--;
          }
        } catch (erro) {
          console.warn(`[Pouso Forçado] Lua, chunk ${chave}: ${erro}`);
          prontos.add(chave);
          orcamento--;
        }
      }
    }
  }, 10);
}

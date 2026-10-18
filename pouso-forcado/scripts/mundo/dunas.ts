import { BlockVolume, Dimension } from "@minecraft/server";
import { CIDADE, DUNAS, MUNDO_PLANO } from "../config.js";
import { foraDaCidade } from "./cidade.js";

/*
 * Dunas por ruído contínuo: a altura de cada coluna vem de uma função do mundo inteiro
 * (coordenadas globais + semente), então as dunas atravessam os chunks sem emenda.
 * - "campo": ruído bem largo que separa campos de dunas de planícies lisas;
 * - "crista": ruído esticado na direção do vento, com o valor absoluto invertido, que
 *   forma cristas compridas (dunas transversais);
 * - "altura máxima": outro ruído largo, para dunas de 3 a 10 blocos variarem pelo mapa.
 * Em volta da nave e das cidades o chão fica plano.
 * Custo: 1 fillBlocks por coluna com duna (no máximo 256 por chunk).
 */

let perm: Uint8Array | undefined;
let sementeAtual = NaN;
let vento = { c: 1, s: 0 };

function preparar(semente: number): void {
  if (semente === sementeAtual && perm) return;
  sementeAtual = semente;
  // Permutação de 0..255 embaralhada pela semente (xorshift).
  let s = semente >>> 0 || 1;
  const aleatorio = () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const angulo = aleatorio() * Math.PI;
  vento = { c: Math.cos(angulo), s: Math.sin(angulo) };
}

const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const misturar = (a: number, b: number, t: number) => a + (b - a) * t;
function grad(h: number, x: number, z: number): number {
  switch (h & 7) {
    case 0: return x + z;
    case 1: return x - z;
    case 2: return -x + z;
    case 3: return -x - z;
    case 4: return x;
    case 5: return -x;
    case 6: return z;
    default: return -z;
  }
}

/** Ruído de Perlin 2D, aproximadamente entre -1 e 1. */
function ruido(x: number, z: number): number {
  const p = perm!;
  const xi = Math.floor(x), zi = Math.floor(z);
  const xf = x - xi, zf = z - zi;
  const X = xi & 255, Z = zi & 255;
  const u = suave(xf), v = suave(zf);
  const aa = p[p[X] + Z], ab = p[p[X] + Z + 1], ba = p[p[X + 1] + Z], bb = p[p[X + 1] + Z + 1];
  return misturar(
    misturar(grad(aa, xf, zf), grad(ba, xf - 1, zf), u),
    misturar(grad(ab, xf, zf - 1), grad(bb, xf - 1, zf - 1), u),
    v,
  );
}

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
function degrau(a: number, b: number, v: number): number {
  const t = limitar((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Altura da duna (em blocos acima do chão plano) na coluna x, z. */
export function alturaDuna(x: number, z: number, semente: number, nave: { x: number; z: number }): number {
  preparar(semente);
  const d = DUNAS;
  const regiao = ruido(x / d.escalaCampo, z / d.escalaCampo) + 0.5 * ruido(x / (d.escalaCampo / 2) + 31, z / (d.escalaCampo / 2) - 17);
  const campo = degrau(d.campoMin, d.campoMax, regiao);
  if (campo <= 0) return 0;

  // Coordenadas giradas: u na direção do vento, w ao longo das cristas.
  const u = x * vento.c + z * vento.s;
  const w = -x * vento.s + z * vento.c;
  const n = ruido(u / d.escalaCrista, w / d.comprimentoCrista) + 0.35 * ruido(u / (d.escalaCrista / 2.2) + 50, w / (d.comprimentoCrista / 2.7) + 50);
  const crista = Math.pow(1 - Math.min(1, Math.abs(n)), 2.2);
  const hMax = d.alturaMin + (d.alturaMax - d.alturaMin) * (0.5 + 0.5 * ruido(x / 150 + 100, z / 150 - 50));
  const ondulacao = 1.2 * ruido(x / 23 + 7, z / 23 + 7);

  const distNave = Math.hypot(x - nave.x, z - nave.z);
  const pouso = degrau(d.planoNave, d.planoNave + 40, distNave);
  // Cidades ficam numa planície: as dunas só começam CIDADE.bordaPlana blocos depois da borda.
  const chunkNave: [number, number] = [Math.floor(nave.x / 16), Math.floor(nave.z / 16)];
  const urbano = degrau(0, CIDADE.bordaPlana, foraDaCidade(x, z, semente, chunkNave));
  return Math.round(limitar(campo * pouso * urbano * (hMax * crista + ondulacao), 0, d.alturaMax + 2));
}

/** Enche as colunas do chunk com areia até a altura da duna. Devolve a maior altura posta. */
export function porDunas(dimensao: Dimension, x0: number, z0: number, semente: number, nave: { x: number; z: number }): number {
  const y = MUNDO_PLANO.superficieY;
  let maior = 0;
  for (let dx = 0; dx < 16; dx++) {
    for (let dz = 0; dz < 16; dz++) {
      const h = alturaDuna(x0 + dx, z0 + dz, semente, nave);
      if (h <= 0) continue;
      maior = Math.max(maior, h);
      const p = { x: x0 + dx, y, z: z0 + dz };
      dimensao.fillBlocks(new BlockVolume(p, { ...p, y: y + h - 1 }), "minecraft:sand");
    }
  }
  return maior;
}

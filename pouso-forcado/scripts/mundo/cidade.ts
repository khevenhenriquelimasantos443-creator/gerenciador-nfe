import { BlockVolume, Dimension } from "@minecraft/server";
import { CIDADE, CIDADE_SAQUE, IDS, MUNDO_PLANO, TORRE_SAQUE } from "../config.js";
import { chunkDaNave, escolher, rng, sementeDe, sementeDoMundo, sortearSaque } from "../util/aleatorio.js";
import { criarBauCom } from "../util/inventario.js";

/*
 * Cidades abandonadas. O mapa é dividido em células de CIDADE.celula chunks; cada célula
 * (menos as perto da nave) tem uma cidade num lugar sorteado pela semente do mundo, então
 * não é preciso guardar nada: qualquer chunk sabe calcular se faz parte de uma cidade.
 * Cada chunk da cidade é um quarteirão, construído quando o relevo decora o chunk:
 * - centro: praça com a torre de rádio (escada de andaime até o topo e um baú bom lá em cima);
 * - em volta: prédios de 2 a 9 andares (mais altos perto do centro), ocos, escuros, com
 *   janelas quebradas, topo desmoronado, andaime para subir, baús e Geradores de Monstros;
 * - às vezes só escombros. Ruas de andesito com areia por cima.
 * Custo: ~300 a 600 blocos mexidos por quarteirão (fillBlocks para paredes e pisos).
 */

const Y = MUNDO_PLANO.superficieY; // primeiro bloco de ar acima do chão
const cache = new Map<string, [number, number] | null>();

/** Chunk do centro da cidade da célula (ou null se a célula não tem cidade). */
function centroDaCelula(celX: number, celZ: number, semente: number, nave: [number, number]): [number, number] | null {
  const chave = `${semente}:${celX},${celZ}`;
  const guardado = cache.get(chave);
  if (guardado !== undefined) return guardado;
  const sorte = rng(sementeDe(semente, celX, celZ, 7));
  const vao = CIDADE.celula - 2 * CIDADE.margem;
  const cx = celX * CIDADE.celula + CIDADE.margem + Math.floor(sorte() * vao);
  const cz = celZ * CIDADE.celula + CIDADE.margem + Math.floor(sorte() * vao);
  const longe = Math.max(Math.abs(cx - nave[0]), Math.abs(cz - nave[1])) >= CIDADE.distanciaNave;
  const centro: [number, number] | null = longe ? [cx, cz] : null;
  cache.set(chave, centro);
  return centro;
}

const celulaDe = (c: number) => Math.floor(c / CIDADE.celula);

/** Se o chunk faz parte de uma cidade, devolve o centro e a distância (em chunks) até ele. */
export function cidadeDoChunk(cx: number, cz: number, semente: number, nave: [number, number]) {
  const centro = centroDaCelula(celulaDe(cx), celulaDe(cz), semente, nave);
  if (!centro) return undefined;
  const dist = Math.max(Math.abs(cx - centro[0]), Math.abs(cz - centro[1]));
  return dist <= CIDADE.raio ? { centro, dist } : undefined;
}

/** Quantos blocos a coluna x, z está fora da borda da cidade da sua célula (0 = dentro). */
export function foraDaCidade(x: number, z: number, semente: number, nave: [number, number]): number {
  const centro = centroDaCelula(celulaDe(Math.floor(x / 16)), celulaDe(Math.floor(z / 16)), semente, nave);
  if (!centro) return Infinity;
  const meio = (CIDADE.raio + 0.5) * 16;
  const dx = Math.abs(x - (centro[0] * 16 + 8)) - meio;
  const dz = Math.abs(z - (centro[1] * 16 + 8)) - meio;
  return Math.max(0, dx, dz);
}

/** A cidade mais perto da posição (olha a célula do jogador e as 8 em volta). */
export function cidadeMaisProxima(x: number, z: number) {
  const nave = chunkDaNave();
  if (!nave) return undefined;
  const semente = sementeDoMundo();
  const celX = celulaDe(Math.floor(x / 16)), celZ = celulaDe(Math.floor(z / 16));
  let melhor: { x: number; z: number; distancia: number; raioBlocos: number } | undefined;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const c = centroDaCelula(celX + dx, celZ + dz, semente, nave);
      if (!c) continue;
      const cx = c[0] * 16 + 8, cz = c[1] * 16 + 8;
      const d = Math.hypot(x - cx, z - cz);
      if (!melhor || d < melhor.distancia) melhor = { x: cx, z: cz, distancia: d, raioBlocos: (CIDADE.raio + 0.5) * 16 };
    }
  }
  return melhor;
}

function encher(dim: Dimension, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, bloco: string): void {
  dim.fillBlocks(new BlockVolume({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }), bloco);
}

function por(dim: Dimension, x: number, y: number, z: number, bloco: string): void {
  dim.getBlock({ x, y, z })?.setType(bloco);
}

function ruaEAreia(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  encher(dim, x0, Y - 1, z0, x0 + 15, Y - 1, z0 + 15, CIDADE.rua);
  for (let i = 0; i < 40; i++) {
    const x = x0 + Math.floor(sorte() * 16), z = z0 + Math.floor(sorte() * 16);
    por(dim, x, Y - 1, z, "minecraft:sand");
    if (sorte() < 0.3) por(dim, x, Y, z, "minecraft:sand");
  }
}

function torre(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  const altura = 34;
  const ax = x0 + 6, az = z0 + 6; // torre 3×3 de x0+6 a x0+8
  encher(dim, x0, Y - 1, z0, x0 + 15, Y - 1, z0 + 15, "minecraft:smooth_stone");
  encher(dim, ax, Y, az, ax + 2, Y + altura - 1, az + 2, "minecraft:stone_bricks");
  encher(dim, ax + 1, Y, az + 1, ax + 1, Y + altura, az + 1, "minecraft:scaffolding");
  encher(dim, ax + 1, Y, az + 2, ax + 1, Y + 1, az + 2, "minecraft:air"); // porta ao sul
  // Plataforma 5×5 no topo, antena e o baú bom.
  const topo = Y + altura;
  encher(dim, ax - 1, topo, az - 1, ax + 3, topo, az + 3, "minecraft:smooth_stone");
  por(dim, ax + 1, topo, az + 1, "minecraft:scaffolding");
  encher(dim, ax + 2, topo + 1, az + 2, ax + 2, topo + 7, az + 2, "minecraft:iron_bars");
  por(dim, ax + 2, topo + 8, az + 2, "minecraft:lightning_rod");
  criarBauCom(dim, { x: ax - 1, y: topo + 1, z: az - 1 }, sortearSaque(TORRE_SAQUE, sorte));
  por(dim, ax + 3, topo + 1, az + 3, IDS.geradorMonstros);
}

function escombros(dim: Dimension, x0: number, z0: number, material: string, sorte: () => number): void {
  for (let i = 0; i < 6; i++) {
    const x = x0 + 2 + Math.floor(sorte() * 10), z = z0 + 2 + Math.floor(sorte() * 10);
    const comp = 2 + Math.floor(sorte() * 5), alt = 1 + Math.floor(sorte() * 3);
    if (sorte() < 0.5) encher(dim, x, Y, z, Math.min(x0 + 13, x + comp), Y + alt - 1, z, material);
    else encher(dim, x, Y, z, x, Y + alt - 1, Math.min(z0 + 13, z + comp), material);
  }
}

function predio(dim: Dimension, x0: number, z0: number, dist: number, material: string, sorte: () => number): void {
  const andares = Math.max(
    CIDADE.andaresMin,
    Math.round(CIDADE.andaresMax * (1 - dist / (CIDADE.raio + 1))) + Math.floor(sorte() * 3) - 1,
  );
  const x1 = x0 + 3, x2 = x0 + 12, z1 = z0 + 3, z2 = z0 + 12;
  const topo = Y + andares * 4; // laje do teto
  encher(dim, x1, Y - 1, z1, x2, topo, z2, material);
  encher(dim, x1 + 1, Y, z1 + 1, x2 - 1, topo - 1, z2 - 1, "minecraft:air");
  for (let f = 1; f < andares; f++) encher(dim, x1 + 1, Y - 1 + f * 4, z1 + 1, x2 - 1, Y - 1 + f * 4, z2 - 1, "minecraft:smooth_stone");
  // Andaime para subir, do térreo até o teto (vazando o teto).
  encher(dim, x1 + 1, Y, z1 + 1, x1 + 1, topo, z1 + 1, "minecraft:scaffolding");
  // Janelas (metade quebrada) em todas as paredes de todos os andares.
  for (let f = 0; f < andares; f++) {
    const y = Y + f * 4 + 1;
    for (const p of [2, 5, 8]) {
      for (const [x, z] of [[x1 + p, z1], [x1 + p, z2], [x1, z1 + p], [x2, z1 + p]]) {
        const vidro = sorte() < 0.5 ? "minecraft:glass_pane" : "minecraft:air";
        por(dim, x, y, z, vidro);
        por(dim, x, y + 1, z, vidro);
      }
    }
  }
  encher(dim, x1 + 4, Y, z2, x1 + 5, Y + 1, z2, "minecraft:air"); // porta ao sul
  // Topo desmoronado: buracos e, às vezes, um canto caído.
  for (let i = 0; i < 25; i++) {
    const x = x1 + Math.floor(sorte() * 10), z = z1 + Math.floor(sorte() * 10);
    por(dim, x, topo - Math.floor(sorte() * 4), z, "minecraft:air");
  }
  if (andares > 3 && sorte() < 0.4) {
    const cx = sorte() < 0.5 ? x1 : x2 - 3, cz = sorte() < 0.5 ? z1 : z2 - 3;
    encher(dim, cx, topo - 4 - Math.floor(sorte() * 4), cz, cx + 3, topo, cz + 3, "minecraft:air");
  }
  // Areia acumulada encostada nas paredes.
  for (let i = 0; i < 12; i++) {
    const lado = Math.floor(sorte() * 4), p = Math.floor(sorte() * 10);
    const [x, z] = [[x1 + p, z1 - 1], [x1 + p, z2 + 1], [x1 - 1, z1 + p], [x2 + 1, z1 + p]][lado];
    por(dim, x, Y, z, "minecraft:sand");
  }
  // Baús e geradores de monstros nos andares (lugares livres, longe do andaime).
  const geradores = 1 + (andares > 5 ? 1 : 0);
  const andaresComGerador = new Set<number>();
  while (andaresComGerador.size < geradores) andaresComGerador.add(Math.floor(sorte() * andares));
  for (let f = 0; f < andares; f++) {
    const y = Y + f * 4;
    if (sorte() < CIDADE.chanceBauPorAndar) {
      criarBauCom(dim, { x: x2 - 1, y, z: z1 + 1 + Math.floor(sorte() * 8) }, sortearSaque(CIDADE_SAQUE, sorte));
    }
    if (andaresComGerador.has(f)) por(dim, x1 + 3 + Math.floor(sorte() * 5), y, z1 + 3 + Math.floor(sorte() * 5), IDS.geradorMonstros);
  }
}

/** Constrói o quarteirão do chunk (cx, cz) da cidade. */
export function construirQuarteirao(dim: Dimension, cx: number, cz: number, dist: number, semente: number): void {
  const sorte = rng(sementeDe(semente, cx, cz, 11));
  const x0 = cx * 16, z0 = cz * 16;
  if (dist === 0) {
    torre(dim, x0, z0, sorte);
    return;
  }
  ruaEAreia(dim, x0, z0, sorte);
  const material = escolher(CIDADE.materiais, sorte);
  if (sorte() < CIDADE.chanceRuina) escombros(dim, x0, z0, material, sorte);
  else predio(dim, x0, z0, dist, material, sorte);
}

import { BlockPermutation, BlockVolume, Dimension } from "@minecraft/server";
import { CIDADE, CIDADE_SAQUE, IDS, MUNDO_PLANO, TORRE_SAQUE } from "../config.js";
import { chunkDaNave, escolher, rng, sementeDe, sementeDoMundo, sortearSaque } from "../util/aleatorio.js";
import { criarBauCom } from "../util/inventario.js";

/*
 * Cidades abandonadas. O mapa é dividido em células de CIDADE.celula chunks; cada célula
 * (menos as perto da nave) tem uma cidade num lugar sorteado pela semente do mundo, então
 * não é preciso guardar nada: qualquer chunk sabe calcular se faz parte de uma cidade.
 * Cada chunk da cidade é um quarteirão, construído quando o relevo decora o chunk:
 * - centro: praça com a torre de rádio (escada de andaime até o topo e um baú bom lá em cima);
 * - em volta: prédios de 2 a 9 andares (mais altos perto do centro) de tijolos de pedra
 *   rachados, bem quebrados (buracos nas paredes e pisos, cantos desabados, ferragens tortas),
 *   escuros, com escadas de tijolo de pedra entre os andares, móveis largados (carpete, mesas,
 *   cadeiras, estantes, teias), baús e Geradores de Monstros;
 * - às vezes só escombros. O chão é quase todo areia e arenito, com pedaços de calçada.
 * Custo: ~500 a 1500 blocos mexidos por quarteirão (fillBlocks para paredes e pisos).
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

/** Põe um bloco com estados (escada virada, etc.); se o jogo recusar os estados, põe o bloco simples. */
function porCom(dim: Dimension, x: number, y: number, z: number, bloco: string, estados: Record<string, boolean | number | string>): void {
  const alvo = dim.getBlock({ x, y, z });
  if (!alvo) return;
  try {
    alvo.setPermutation(BlockPermutation.resolve(bloco, estados as never));
  } catch {
    alvo.setType(bloco);
  }
}

const ehAr = (dim: Dimension, x: number, y: number, z: number) => dim.getBlock({ x, y, z })?.isAir ?? false;

/** Chão de cidade enterrada: quase tudo areia e arenito, com pedaços de calçada aparecendo. */
function chaoDeAreia(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  encher(dim, x0, Y - 1, z0, x0 + 15, Y - 1, z0 + 15, "minecraft:sand");
  for (let dx = 0; dx < 16; dx++) {
    for (let dz = 0; dz < 16; dz++) {
      const r = sorte();
      if (r < CIDADE.chao.arenito) por(dim, x0 + dx, Y - 1, z0 + dz, escolher(CIDADE.chao.blocosArenito, sorte));
      else if (r < CIDADE.chao.arenito + CIDADE.chao.pedra) por(dim, x0 + dx, Y - 1, z0 + dz, escolher(CIDADE.chao.blocosPedra, sorte));
    }
  }
  // Montinhos de areia por cima.
  for (let i = 0; i < 18; i++) por(dim, x0 + Math.floor(sorte() * 16), Y, z0 + Math.floor(sorte() * 16), "minecraft:sand");
}

/** Barras de ferro tortas saindo de um ponto quebrado (zigue-zague para cima e para o lado). */
function ferragem(dim: Dimension, x: number, y: number, z: number, sorte: () => number): void {
  const n = 2 + Math.floor(sorte() * 3);
  for (let i = 0; i < n; i++) {
    if (!ehAr(dim, x, y, z)) break;
    por(dim, x, y, z, "minecraft:iron_bars");
    y++;
    if (sorte() < 0.5) x += sorte() < 0.5 ? 1 : -1;
    else z += sorte() < 0.5 ? 1 : -1;
  }
}

function torre(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  const altura = 34;
  const ax = x0 + 6, az = z0 + 6; // torre 3×3 de x0+6 a x0+8
  chaoDeAreia(dim, x0, z0, sorte);
  encher(dim, ax, Y, az, ax + 2, Y + altura - 1, az + 2, CIDADE.parede);
  encher(dim, ax + 1, Y, az + 1, ax + 1, Y + altura, az + 1, "minecraft:scaffolding");
  encher(dim, ax + 1, Y, az + 2, ax + 1, Y + 1, az + 2, "minecraft:air"); // porta ao sul
  // Plataforma 5×5 no topo, antena e o baú bom.
  const topo = Y + altura;
  encher(dim, ax - 1, topo, az - 1, ax + 3, topo, az + 3, "minecraft:stone_brick_slab");
  por(dim, ax + 1, topo, az + 1, "minecraft:scaffolding");
  encher(dim, ax + 2, topo + 1, az + 2, ax + 2, topo + 7, az + 2, "minecraft:iron_bars");
  por(dim, ax + 2, topo + 8, az + 2, "minecraft:lightning_rod");
  criarBauCom(dim, { x: ax - 1, y: topo + 1, z: az - 1 }, sortearSaque(TORRE_SAQUE, sorte));
  // 1.3.0: no alto da torre, um Gerador de Blazes (vara de blaze → pó de blaze, sem o Nether).
  por(dim, ax + 3, topo + 1, az + 3, "cl:gerador_blaze");
  ferragem(dim, ax - 1, topo + 1, az + 3, sorte);
}

function escombros(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  chaoDeAreia(dim, x0, z0, sorte);
  // Restos de paredes baixas e montes de entulho.
  for (let i = 0; i < 7; i++) {
    const x = x0 + 2 + Math.floor(sorte() * 10), z = z0 + 2 + Math.floor(sorte() * 10);
    const comp = 2 + Math.floor(sorte() * 5), alt = 1 + Math.floor(sorte() * 4);
    if (sorte() < 0.5) encher(dim, x, Y, z, Math.min(x0 + 13, x + comp), Y + alt - 1, z, CIDADE.parede);
    else encher(dim, x, Y, z, x, Y + alt - 1, Math.min(z0 + 13, z + comp), CIDADE.parede);
    if (sorte() < 0.5) ferragem(dim, x, Y + alt, z, sorte);
  }
  for (let i = 0; i < 25; i++) por(dim, x0 + 1 + Math.floor(sorte() * 14), Y, z0 + 1 + Math.floor(sorte() * 14), escolher(CIDADE.entulho, sorte));
}

/** Uma mesa (cerca + placa de pressão) com cadeiras (escadas viradas para ela). */
function mesaComCadeiras(dim: Dimension, x: number, y: number, z: number, sorte: () => number): void {
  por(dim, x, y, z, "minecraft:oak_fence");
  por(dim, x, y + 1, z, "minecraft:oak_pressure_plate");
  // Cadeira a oeste olhando para leste e a leste olhando para oeste (weirdo_direction: 0 leste, 1 oeste).
  if (sorte() < 0.8) porCom(dim, x - 1, y, z, "minecraft:oak_stairs", { weirdo_direction: 1, upside_down_bit: false });
  if (sorte() < 0.6) porCom(dim, x + 1, y, z, "minecraft:oak_stairs", { weirdo_direction: 0, upside_down_bit: false });
}

/** Móveis largados num andar: carpete gasto, mesas, cadeiras, estantes, vasos, teias. */
function mobiliar(dim: Dimension, x1: number, z1: number, x2: number, z2: number, y: number, sorte: () => number): void {
  // Área livre: longe das paredes e da escada (que fica junto da parede sul).
  const ax = x1 + 2, bx = x2 - 2, az = z1 + 2, bz = z2 - 4;
  const livre = (x: number, z: number) => ehAr(dim, x, y, z) && !ehAr(dim, x, y - 1, z);
  if (sorte() < 0.7) {
    const cor = escolher(CIDADE.carpetes, sorte);
    for (let x = ax; x <= bx; x++) for (let z = az; z <= bz; z++) if (sorte() < 0.55 && livre(x, z)) por(dim, x, y, z, cor);
  }
  const mesas = Math.floor(sorte() * 3);
  for (let i = 0; i < mesas; i++) {
    const x = ax + 1 + Math.floor(sorte() * (bx - ax - 1)), z = az + Math.floor(sorte() * (bz - az + 1));
    mesaComCadeiras(dim, x, y, z, sorte);
  }
  if (sorte() < 0.4) for (let dz = 0; dz < 3; dz++) por(dim, x1 + 1, y, z1 + 1 + dz, sorte() < 0.7 ? "minecraft:bookshelf" : "minecraft:air");
  if (sorte() < 0.4) por(dim, bx, y, az, "minecraft:flower_pot");
  // Teias de aranha nos cantos do teto.
  for (const [x, z] of [[x1 + 1, z1 + 1], [x2 - 1, z1 + 1], [x1 + 1, z2 - 3], [x2 - 1, z2 - 3]]) {
    if (sorte() < 0.35 && ehAr(dim, x, y + 2, z)) por(dim, x, y + 2, z, "minecraft:web");
  }
}

/** Escada de tijolos de pedra (2 de largura, junto da parede sul) de um piso ao de cima. */
function escada(dim: Dimension, x1: number, z2: number, yPiso: number): void {
  for (const z of [z2 - 1, z2 - 2]) {
    // Abre o teto em cima dos degraus do meio para caber a cabeça.
    por(dim, x1 + 2, yPiso + 3, z, "minecraft:air");
    por(dim, x1 + 3, yPiso + 3, z, "minecraft:air");
    for (let i = 0; i < 4; i++) porCom(dim, x1 + 1 + i, yPiso + i, z, "minecraft:stone_brick_stairs", { weirdo_direction: 0, upside_down_bit: false });
  }
}

function predio(dim: Dimension, x0: number, z0: number, dist: number, sorte: () => number): void {
  const andares = Math.max(
    CIDADE.andaresMin,
    Math.round(CIDADE.andaresMax * (1 - dist / (CIDADE.raio + 1))) + Math.floor(sorte() * 3) - 1,
  );
  const x1 = x0 + 3, x2 = x0 + 12, z1 = z0 + 3, z2 = z0 + 12;
  const topo = Y - 1 + andares * 4; // laje do telhado (no mesmo ritmo dos pisos: 3 de pé-direito)
  chaoDeAreia(dim, x0, z0, sorte);
  encher(dim, x1, Y - 1, z1, x2, topo, z2, CIDADE.parede);
  encher(dim, x1 + 1, Y, z1 + 1, x2 - 1, topo - 1, z2 - 1, "minecraft:air");
  for (let f = 1; f < andares; f++) encher(dim, x1 + 1, Y - 1 + f * 4, z1 + 1, x2 - 1, Y - 1 + f * 4, z2 - 1, CIDADE.piso);
  // Remendos: tijolo inteiro, com musgo e pedregulho no meio dos rachados.
  for (let i = 0; i < andares * 14; i++) {
    const lado = Math.floor(sorte() * 4), p = Math.floor(sorte() * 10), y = Y + Math.floor(sorte() * andares * 4);
    const [x, z] = [[x1 + p, z1], [x1 + p, z2], [x1, z1 + p], [x2, z1 + p]][lado];
    if (!ehAr(dim, x, y, z)) por(dim, x, y, z, escolher(CIDADE.remendos, sorte));
  }
  // Escadas de tijolo de pedra em todos os andares (a última sai no telhado).
  for (let f = 0; f < andares; f++) escada(dim, x1, z2, Y + f * 4);
  // Janelas: quase todas quebradas; algumas com grade.
  for (let f = 0; f < andares; f++) {
    const y = Y + f * 4 + 1;
    for (const p of [2, 5, 8]) {
      for (const [x, z] of [[x1 + p, z1], [x1 + p, z2], [x1, z1 + p], [x2, z1 + p]]) {
        const r = sorte();
        const janela = r < 0.6 ? "minecraft:air" : r < 0.8 ? "minecraft:glass_pane" : "minecraft:iron_bars";
        por(dim, x, y, z, janela);
        por(dim, x, y + 1, z, sorte() < 0.7 ? "minecraft:air" : janela);
      }
    }
  }
  encher(dim, x1 + 6, Y, z2, x1 + 7, Y + 1, z2, "minecraft:air"); // porta ao sul
  // Buracos nas paredes em todos os andares e nos pisos.
  for (let i = 0; i < andares * 10; i++) {
    const lado = Math.floor(sorte() * 4), p = Math.floor(sorte() * 10), y = Y + Math.floor(sorte() * andares * 4);
    const [x, z] = [[x1 + p, z1], [x1 + p, z2], [x1, z1 + p], [x2, z1 + p]][lado];
    const tam = sorte() < 0.3 ? 2 : 1;
    encher(dim, x, y, z, Math.min(x2, x + (lado >= 2 ? 0 : tam - 1)), y + tam - 1, Math.min(z2, z + (lado >= 2 ? tam - 1 : 0)), "minecraft:air");
  }
  for (let f = 1; f < andares; f++) {
    if (sorte() < 0.5) {
      const x = x1 + 3 + Math.floor(sorte() * 4), z = z1 + 2 + Math.floor(sorte() * 3);
      encher(dim, x, Y - 1 + f * 4, z, x + 1, Y - 1 + f * 4, z + 1, "minecraft:air");
    }
  }
  // Topo desmoronado: buracos, um ou dois cantos caídos e ferragens tortas aparecendo.
  for (let i = 0; i < 40; i++) {
    const x = x1 + Math.floor(sorte() * 10), z = z1 + Math.floor(sorte() * 10);
    por(dim, x, topo - Math.floor(sorte() * 5), z, "minecraft:air");
  }
  const cantos = andares > 3 ? 1 + (sorte() < 0.5 ? 1 : 0) : sorte() < 0.5 ? 1 : 0;
  for (let c = 0; c < cantos; c++) {
    const cx = sorte() < 0.5 ? x1 : x2 - 4, cz = sorte() < 0.5 ? z1 : z2 - 5;
    const fundo = topo - 4 - Math.floor(sorte() * 6);
    encher(dim, cx, fundo, cz, cx + 4, topo, cz + 4, "minecraft:air");
    for (let k = 0; k < 3; k++) ferragem(dim, cx + Math.floor(sorte() * 5), fundo, cz + Math.floor(sorte() * 5), sorte);
  }
  for (let k = 0; k < 4; k++) {
    const [x, z] = [[x1, z1 + Math.floor(sorte() * 10)], [x2, z1 + Math.floor(sorte() * 10)], [x1 + Math.floor(sorte() * 10), z1], [x1 + Math.floor(sorte() * 10), z2]][k];
    ferragem(dim, x, topo + 1, z, sorte);
  }
  // Entulho e areia encostados nas paredes, por fora.
  for (let i = 0; i < 20; i++) {
    const lado = Math.floor(sorte() * 4), p = Math.floor(sorte() * 10);
    const [x, z] = [[x1 + p, z1 - 1], [x1 + p, z2 + 1], [x1 - 1, z1 + p], [x2 + 1, z1 + p]][lado];
    por(dim, x, Y, z, sorte() < 0.5 ? "minecraft:sand" : escolher(CIDADE.entulho, sorte));
  }
  // Móveis, baús e geradores de monstros nos andares.
  const geradores = 1 + (andares > 5 ? 1 : 0);
  const andaresComGerador = new Set<number>();
  while (andaresComGerador.size < geradores) andaresComGerador.add(Math.floor(sorte() * andares));
  for (let f = 0; f < andares; f++) {
    const y = Y + f * 4;
    if (sorte() < CIDADE.chanceMoveis) mobiliar(dim, x1, z1, x2, z2, y, sorte);
    if (sorte() < CIDADE.chanceBauPorAndar) {
      criarBauCom(dim, { x: x2 - 1, y, z: z1 + 1 + Math.floor(sorte() * 6) }, sortearSaque(CIDADE_SAQUE, sorte));
    }
    if (andaresComGerador.has(f)) por(dim, x1 + 3 + Math.floor(sorte() * 5), y, z1 + 3 + Math.floor(sorte() * 4), IDS.geradorMonstros);
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
  if (sorte() < CIDADE.chanceRuina) escombros(dim, x0, z0, sorte);
  else predio(dim, x0, z0, dist, sorte);
}

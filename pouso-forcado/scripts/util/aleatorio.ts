import { world } from "@minecraft/server";
import { LinhaSaque, PROPS } from "../config.js";
import { Pilha } from "./inventario.js";

// Gerador pseudoaleatório determinístico (mulberry32): mesma semente, mesma sequência.
export function rng(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Semente fixa por chunk (ou por qualquer par de inteiros), a partir da semente do mundo. */
export const sementeDe = (semente: number, a: number, b: number, sal = 0): number =>
  semente ^ Math.imul(a, 73856093) ^ Math.imul(b, 83492791) ^ Math.imul(sal, 19349663);

/** Semente do relevo deste mundo (sorteada uma vez e guardada). */
export function sementeDoMundo(): number {
  let s = world.getDynamicProperty(PROPS.sementeRelevo);
  if (typeof s !== "number") {
    s = Math.floor(Math.random() * 2 ** 31);
    world.setDynamicProperty(PROPS.sementeRelevo, s);
  }
  return s;
}

/** Chunk da nave ("cx,cz"), ou undefined se ela ainda não foi posta. */
export function chunkDaNave(): [number, number] | undefined {
  const valor = world.getDynamicProperty(PROPS.naveChunk);
  if (typeof valor !== "string") return undefined;
  const [cx, cz] = valor.split(",").map(Number);
  return [cx, cz];
}

/** Sorteia uma tabela de saque: cada linha entra com sua chance. */
export function sortearSaque(tabela: ReadonlyArray<LinhaSaque>, sorte: () => number = Math.random): Pilha[] {
  return tabela
    .filter((l) => sorte() < l.chance)
    .map((l) => ({ item: l.item, quantidade: l.min + Math.floor(sorte() * (l.max - l.min + 1)) }));
}

export const escolher = <T>(lista: ReadonlyArray<T>, sorte: () => number = Math.random): T =>
  lista[Math.floor(sorte() * lista.length)];

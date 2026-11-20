import { Block, Container, ItemStack } from "@minecraft/server";
import { espacosDe } from "../maquinas/espacos.js";
import { vizinhos } from "./blocos.js";
import { gravar, ler } from "./dados.js";
import { consumir } from "./rede.js";

/*
 * Ajudas das máquinas das Fases 17+ (Thermal Expansion, MineFactory, AutoPackager...):
 * entrada = inventário em cima, saída = inventário embaixo (se não houver, solta ao lado);
 * energia em "centésimos de E" (cE): a máquina guarda o troco de 1 E tirado da rede, para
 * operações que custam menos de 1 E (ex.: 25 cE = 1.000 RF).
 */
// 1.57.0: sem baú em cima (ou embaixo), os espaços da tela da máquina (maquinas/espacos.ts), como no Java.
export const entrada = (b: Block): Container | undefined => inv(b.above()) ?? (espacosDe(b)?.entrada as unknown as Container | undefined);
export const saida = (b: Block): Container | undefined => inv(b.below()) ?? (espacosDe(b)?.saida as unknown as Container | undefined);
export function inv(b: Block | undefined): Container | undefined {
  try {
    return b?.getComponent("minecraft:inventory")?.container;
  } catch {
    return undefined;
  }
}
/** O primeiro inventário encostado (qualquer lado). */
export function inventarioVizinho(b: Block): Container | undefined {
  for (const v of vizinhos(b)) {
    const c = inv(v);
    if (c) return c;
  }
  return undefined;
}

/** Quantos itens `id` há no inventário. */
export function contar(c: Container, id: string): number {
  let n = 0;
  for (let s = 0; s < c.size; s++) {
    const p = c.getItem(s);
    if (p?.typeId === id) n += p.amount;
  }
  return n;
}

/** Tira `qtd` de `id` (só se houver tudo). */
export function tirar(c: Container, id: string, qtd = 1): boolean {
  if (contar(c, id) < qtd) return false;
  for (let s = 0; s < c.size && qtd > 0; s++) {
    const p = c.getItem(s);
    if (p?.typeId !== id) continue;
    const n = Math.min(qtd, p.amount);
    qtd -= n;
    if (n === p.amount) c.setItem(s, undefined);
    else {
      p.amount -= n;
      c.setItem(s, p);
    }
  }
  return true;
}

/** O primeiro item do inventário que satisfaz `serve`. */
export function primeiro(c: Container, serve: (id: string) => boolean): ItemStack | undefined {
  for (let s = 0; s < c.size; s++) {
    const p = c.getItem(s);
    if (p && serve(p.typeId)) return p;
  }
  return undefined;
}

/** Põe na saída; o que não couber é solto ao lado da máquina. */
export function entregar(b: Block, pilhas: ItemStack[], destino: Container | undefined = saida(b)): void {
  for (const p of pilhas) {
    const sobra = destino ? destino.addItem(p) : p;
    if (sobra) b.dimension.spawnItem(sobra, { x: b.x + 0.5, y: b.y + 1.1, z: b.z + 0.5 });
  }
}

/** Cabe na saída? (sem saída sempre cabe: solta no chão) */
export function cabe(b: Block, destino: Container | undefined = saida(b)): boolean {
  return !destino || destino.emptySlotsCount > 0;
}

/** Gasta `ce` centésimos de E (tira 1 E da rede quando o troco acaba). */
export function gastarCE(b: Block, ce: number): boolean {
  let troco = ler<number>("ce", b, 0);
  while (troco < ce) {
    if (!consumir(b)) {
      gravar("ce", b, troco);
      return false;
    }
    troco += 100;
  }
  gravar("ce", b, troco - ce);
  return true;
}

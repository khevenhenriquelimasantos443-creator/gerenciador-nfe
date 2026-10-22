import { Block, ItemStack } from "@minecraft/server";

/*
 * Inventários "virtuais" (Fase 18): o barril do JABBA e as células ME guardam um mapa item -> quantidade
 * (numa propriedade do mundo), não um inventário do jogo. Para o Terminal, eles aparecem como um
 * inventário comum (com pilhas de até 64), pela mesma interface do baú.
 * Só guardam itens "simples": empilháveis, sem nome, sem texto e sem dados próprios.
 */
export interface Inventario {
  readonly size: number;
  getItem(slot: number): ItemStack | undefined;
  setItem(slot: number, item?: ItemStack): void;
  addItem(item: ItemStack): ItemStack | undefined;
}

export type Mapa = Record<string, number>;

export function simples(p: ItemStack): boolean {
  try {
    return p.maxAmount > 1 && !p.nameTag && p.getLore().length === 0 && p.getDynamicPropertyIds().length === 0;
  } catch {
    return false;
  }
}

const maxDe = new Map<string, number>();
function pilhaMax(id: string): number {
  let m = maxDe.get(id);
  if (m === undefined) {
    try {
      m = new ItemStack(id, 1).maxAmount;
    } catch {
      m = 64;
    }
    maxDe.set(id, m);
  }
  return m;
}

/**
 * Inventário sobre um mapa. `cabe(mapa, id)` diz quantos itens `id` ainda cabem; `gravar` salva o mapa.
 * As "pilhas" são montadas na criação (o Terminal cria um novo a cada uso).
 */
export class InventarioMapa implements Inventario {
  private pilhas: [string, number][] = [];
  constructor(
    private mapa: Mapa,
    private readonly cabe: (mapa: Mapa, id: string) => number,
    private readonly gravar: (mapa: Mapa) => void,
  ) {
    for (const [id, qtd] of Object.entries(mapa)) {
      const max = pilhaMax(id);
      for (let resto = qtd; resto > 0; resto -= max) this.pilhas.push([id, Math.min(max, resto)]);
    }
  }
  get size(): number {
    return this.pilhas.length;
  }
  getItem(slot: number): ItemStack | undefined {
    const p = this.pilhas[slot];
    return p && p[1] > 0 ? new ItemStack(p[0], p[1]) : undefined;
  }
  setItem(slot: number, item?: ItemStack): void {
    const p = this.pilhas[slot];
    if (!p) return;
    const novo = item && item.typeId === p[0] ? item.amount : 0;
    this.mapa[p[0]] = (this.mapa[p[0]] ?? 0) - (p[1] - novo);
    if (this.mapa[p[0]] <= 0) delete this.mapa[p[0]];
    p[1] = novo;
    this.gravar(this.mapa);
  }
  addItem(item: ItemStack): ItemStack | undefined {
    if (!simples(item)) return item;
    const n = Math.min(item.amount, this.cabe(this.mapa, item.typeId));
    if (n <= 0) return item;
    this.mapa[item.typeId] = (this.mapa[item.typeId] ?? 0) + n;
    this.gravar(this.mapa);
    if (n === item.amount) return undefined;
    const sobra = item.clone();
    sobra.amount = item.amount - n;
    return sobra;
  }
}

const fontes = new Map<string, (b: Block) => Inventario[]>();
/** Registra como um tipo de bloco aparece para o Terminal. */
export function registrarInventario(id: string, fn: (b: Block) => Inventario[]): void {
  fontes.set(id, fn);
}
export const tiposVirtuais = (): string[] => [...fontes.keys()];
export const inventariosDe = (b: Block): Inventario[] => fontes.get(b.typeId)?.(b) ?? [];

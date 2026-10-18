import { Container, Dimension, ItemStack, Vector3 } from "@minecraft/server";

const BALDE = "minecraft:bucket";
const BALDE_AGUA = "minecraft:water_bucket";

/**
 * Troca UM balde vazio do container por um balde de água.
 * Tenta primeiro o slot preferido (ex.: item na mão do jogador).
 * Retorna true se a troca aconteceu.
 */
export function encherUmBalde(container: Container | undefined, slotPreferido?: number): boolean {
  if (!container || !container.isValid) return false;

  const slot = acharBalde(container, slotPreferido);
  if (slot === undefined) return false;

  const pilha = container.getItem(slot)!;
  if (pilha.amount === 1) {
    container.setItem(slot, new ItemStack(BALDE_AGUA, 1));
    return true;
  }

  // Pilha com vários baldes: precisa de um slot livre para o balde de água.
  if (container.emptySlotsCount === 0) return false;
  pilha.amount -= 1;
  container.setItem(slot, pilha);
  container.addItem(new ItemStack(BALDE_AGUA, 1));
  return true;
}

function acharBalde(container: Container, slotPreferido?: number): number | undefined {
  if (slotPreferido !== undefined && container.getItem(slotPreferido)?.typeId === BALDE) {
    return slotPreferido;
  }
  for (let i = 0; i < container.size; i++) {
    if (container.getItem(i)?.typeId === BALDE) return i;
  }
  return undefined;
}

export type Pilha = { item: string; quantidade: number };

/** Coloca um baú na posição e guarda os itens. Lança erro se não conseguir. */
export function criarBauCom(dimensao: Dimension, posicao: Vector3, itens: ReadonlyArray<Pilha>): void {
  const bloco = dimensao.getBlock(posicao);
  if (!bloco) throw new Error("bloco do baú fora do mundo carregado");
  bloco.setType("minecraft:chest");
  const container = bloco.getComponent("minecraft:inventory")?.container;
  if (!container) throw new Error("baú sem inventário");
  for (const { item, quantidade } of itens) container.addItem(new ItemStack(item, quantidade));
}

import { Container, Dimension, GameMode, ItemStack, Player, Vector3 } from "@minecraft/server";

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

/** Coloca um baú (ou barril) na posição e guarda os itens. Lança erro se não conseguir. */
export function criarBauCom(dimensao: Dimension, posicao: Vector3, itens: ReadonlyArray<Pilha>, tipo = "minecraft:chest"): void {
  const bloco = dimensao.getBlock(posicao);
  if (!bloco) throw new Error("bloco do baú fora do mundo carregado");
  bloco.setType(tipo);
  const container = bloco.getComponent("minecraft:inventory")?.container;
  if (!container) throw new Error("baú sem inventário");
  for (const { item, quantidade } of itens) container.addItem(new ItemStack(item, quantidade));
}

/** Gasta `quantidade` do item na mão do jogador (no criativo não gasta). */
export function gastarDaMao(jogador: Player, quantidade = 1): void {
  if (jogador.getGameMode() === GameMode.Creative) return;
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  if (!inv || !pilha) return;
  if (pilha.amount <= quantidade) inv.setItem(jogador.selectedSlotIndex, undefined);
  else {
    pilha.amount -= quantidade;
    inv.setItem(jogador.selectedSlotIndex, pilha);
  }
}

export function itemNaMao(jogador: Player): ItemStack | undefined {
  return jogador.getComponent("minecraft:inventory")?.container?.getItem(jogador.selectedSlotIndex);
}

/** Solta itens em cima do bloco, como se tivessem saído da máquina. */
export function soltarEmCima(dimensao: Dimension, bloco: Vector3, item: string, quantidade: number): void {
  dimensao.spawnItem(new ItemStack(item, quantidade), { x: bloco.x + 0.5, y: bloco.y + 1.1, z: bloco.z + 0.5 });
}

/** Enche até `max` garrafas de vidro da mão com água. Retorna true se encheu alguma. */
export function encherGarrafasDaMao(jogador: Player, max = 3): boolean {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  if (!inv || pilha?.typeId !== "minecraft:glass_bottle") return false;
  const n = Math.min(max, pilha.amount);
  if (pilha.amount === n) inv.setItem(jogador.selectedSlotIndex, new ItemStack("minecraft:potion", n));
  else {
    pilha.amount -= n;
    inv.setItem(jogador.selectedSlotIndex, pilha);
    const sobra = inv.addItem(new ItemStack("minecraft:potion", n));
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
  return true;
}

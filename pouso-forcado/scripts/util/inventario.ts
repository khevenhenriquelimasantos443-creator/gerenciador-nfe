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

/** Troca até `max` itens `de` da mão por `para` (ex.: garrafa vazia → garrafa de água). Retorna true se trocou. */
export function trocarDaMao(jogador: Player, de: string, para: string, max = 3): boolean {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  if (!inv || pilha?.typeId !== de) return false;
  const n = Math.min(max, pilha.amount);
  if (pilha.amount === n) inv.setItem(jogador.selectedSlotIndex, new ItemStack(para, n));
  else {
    pilha.amount -= n;
    inv.setItem(jogador.selectedSlotIndex, pilha);
    const sobra = inv.addItem(new ItemStack(para, n));
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
  return true;
}

/** Troca o item da mão por outro (ex.: balde de água -> balde vazio). No criativo não troca. */
export function trocarMao(jogador: Player, para: string): void {
  if (jogador.getGameMode() === GameMode.Creative) return;
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  if (!inv || !pilha) return;
  if (pilha.amount === 1) inv.setItem(jogador.selectedSlotIndex, new ItemStack(para, 1));
  else {
    pilha.amount--;
    inv.setItem(jogador.selectedSlotIndex, pilha);
    const sobra = inv.addItem(new ItemStack(para, 1));
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
}

/** Gasta durabilidade da ferramenta na mão; quebra se acabar. No criativo não gasta. */
export function gastarFerramenta(jogador: Player, pontos = 1): void {
  if (jogador.getGameMode() === GameMode.Creative) return;
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  const dur = pilha?.getComponent("minecraft:durability");
  if (!inv || !pilha || !dur) return;
  if (dur.damage + pontos >= dur.maxDurability) {
    inv.setItem(jogador.selectedSlotIndex, undefined);
    jogador.playSound("random.break");
    return;
  }
  dur.damage += pontos;
  inv.setItem(jogador.selectedSlotIndex, pilha);
}

/** Dá um item ao jogador (ou solta aos pés, se a mochila estiver cheia). */
export function darAoJogador(jogador: Player, item: string, quantidade = 1): void {
  const sobra = jogador.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack(item, quantidade)) ?? new ItemStack(item, quantidade);
  if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
}

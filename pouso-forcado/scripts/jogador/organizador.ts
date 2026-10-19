import { BlockTypes, Container, ItemStack, Player, system, world } from "@minecraft/server";
import { AGUAS, IDS, SEDE } from "../config.js";
import { aviso } from "./hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { reabastecerLigado } from "./opcoes.js";

/*
 * Organizador e reabastecimento (no estilo do Inventory Tweaks).
 * - Organizador: usar no ar arruma a mochila (junta pilhas e ordena, sem mexer na barra rápida);
 *   usar num baú/barril arruma o baú (e não abre). Ordem: ferramentas, armaduras, comida e
 *   bebida, itens do add-on, blocos, o resto; dentro de cada grupo, pelo ID.
 * - Reabastecer (liga/desliga nas Opções do Diário): quando a pilha da mão acaba ao colocar um
 *   bloco ou ao comer/beber, ou a ferramenta quebra, puxa outra igual da mochila para a mão.
 * Custo: só nos eventos (colocar, comer, quebrar), lendo o inventário de um jogador.
 */

const FERRAMENTAS = ["_pickaxe", "_axe", "_shovel", "_hoe", "_sword", "bow", "crossbow", "trident", "shears", "flint_and_steel", "fishing_rod", "mace"];
const ARMADURAS = ["_helmet", "_chestplate", "_leggings", "_boots", "elytra", "shield"];
const COMIDAS = new Set([
  ...Object.keys(AGUAS), ...Object.keys(SEDE.bebidas), "minecraft:bread", "minecraft:apple", "minecraft:golden_apple",
  "minecraft:enchanted_golden_apple", "minecraft:carrot", "minecraft:potato", "minecraft:baked_potato", "minecraft:beetroot",
  "minecraft:cooked_beef", "minecraft:beef", "minecraft:cooked_chicken", "minecraft:chicken", "minecraft:cooked_porkchop",
  "minecraft:porkchop", "minecraft:cooked_mutton", "minecraft:mutton", "minecraft:cookie", "minecraft:pumpkin_pie",
  "minecraft:rotten_flesh", "minecraft:mushroom_stew", "minecraft:beetroot_soup", "minecraft:rabbit_stew",
]);

function grupo(id: string): number {
  if (FERRAMENTAS.some((f) => id.endsWith(f))) return 0;
  if (ARMADURAS.some((f) => id.endsWith(f))) return 1;
  if (COMIDAS.has(id)) return 2;
  if (id.startsWith("cl:") && !BlockTypes.get(id)) return 3;
  if (BlockTypes.get(id)) return 4;
  return 5;
}

/** Junta pilhas iguais e ordena os slots [de, ate) do container. */
export function ordenar(c: Container, de: number, ate: number): void {
  const pilhas: ItemStack[] = [];
  for (let s = de; s < ate; s++) {
    const p = c.getItem(s);
    if (!p) continue;
    let resto = p.amount;
    for (const q of pilhas) {
      if (resto === 0) break;
      if (q.amount >= q.maxAmount || !q.isStackableWith(p)) continue;
      const n = Math.min(resto, q.maxAmount - q.amount);
      q.amount += n;
      resto -= n;
    }
    if (resto > 0) {
      const nova = p.clone();
      nova.amount = resto;
      pilhas.push(nova);
    }
  }
  pilhas.sort((a, b) => grupo(a.typeId) - grupo(b.typeId) || a.typeId.localeCompare(b.typeId) || b.amount - a.amount);
  for (let s = de; s < ate; s++) c.setItem(s, pilhas[s - de]);
}

const recemOrdenado = new Map<string, number>(); // não arrumar a mochila no mesmo toque que arrumou um baú

function organizarMochila(jogador: Player): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  ordenar(inv, 9, inv.size); // 0 a 8 = barra rápida: fica como está
  jogador.playSound("random.pop");
  aviso(jogador, "cl.organizador.mochila");
  registrarAcao(jogador, "organizar");
}

// ---------- reabastecer ----------
const naMao = new Map<string, { slot: number; id: string; ultimo: boolean }>();

/** Põe na mão (slot `slot`) uma pilha do mesmo item, tirada do resto do inventário. */
function repor(jogador: Player, slot: number, quer: (id: string) => boolean): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!inv || inv.getItem(slot)) return;
  // Primeiro a mochila (9 a 35), depois o resto da barra rápida.
  const ordem = [...Array.from({ length: inv.size - 9 }, (_, k) => k + 9), ...Array.from({ length: 9 }, (_, k) => k)];
  for (const s of ordem) {
    if (s === slot) continue;
    const p = inv.getItem(s);
    if (!p || !quer(p.typeId)) continue;
    inv.moveItem(s, slot, inv);
    jogador.playSound("random.pop", { volume: 0.4 });
    return;
  }
}

/** Mesmo tipo de ferramenta (picareta de outro material serve). */
function mesmaClasse(id: string): (outro: string) => boolean {
  const sufixo = FERRAMENTAS.find((f) => f.startsWith("_") && id.endsWith(f));
  return (outro) => outro === id || (!!sufixo && outro.endsWith(sufixo));
}

export function registrarOrganizador(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== IDS.organizador) return;
    if (system.currentTick - (recemOrdenado.get(source.id) ?? -100) < 10) return;
    organizarMochila(source);
  });

  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player, block, itemStack, isFirstEvent } = ev;
    if (itemStack?.typeId === IDS.organizador) {
      if (!block.getComponent("minecraft:inventory")) return;
      ev.cancel = true; // arruma em vez de abrir
      if (!isFirstEvent) return;
      recemOrdenado.set(player.id, system.currentTick);
      system.run(() => {
        const c = block.getComponent("minecraft:inventory")?.container;
        if (!c) return;
        ordenar(c, 0, c.size);
        player.playSound("random.pop");
        aviso(player, "cl.organizador.bau");
        registrarAcao(player, "organizar");
      });
      return;
    }
    // Guarda o que estava na mão antes de colocar um bloco (o evento de colocar não diz o item).
    if (itemStack) naMao.set(player.id, { slot: player.selectedSlotIndex, id: itemStack.typeId, ultimo: itemStack.amount === 1 });
  });

  world.afterEvents.playerPlaceBlock.subscribe(({ player }) => {
    const antes = naMao.get(player.id);
    naMao.delete(player.id);
    if (!antes?.ultimo || !reabastecerLigado(player)) return;
    system.run(() => repor(player, antes.slot, (id) => id === antes.id));
  });

  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    if (!reabastecerLigado(source)) return;
    const slot = source.selectedSlotIndex;
    const id = itemStack.typeId;
    system.run(() => repor(source, slot, (outro) => outro === id));
  });

  world.afterEvents.playerBreakBlock.subscribe(({ player, itemStackBeforeBreak, itemStackAfterBreak }) => {
    if (!itemStackBeforeBreak || itemStackAfterBreak || !reabastecerLigado(player)) return;
    if (!itemStackBeforeBreak.getComponent("minecraft:durability")) return; // não era ferramenta
    const slot = player.selectedSlotIndex;
    system.run(() => repor(player, slot, mesmaClasse(itemStackBeforeBreak.typeId)));
  });
}

import { GameMode, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { SACOLAS, SACOLA_GRUPOS, SACOLA_PESOS } from "../config.js";
import { Pilha } from "../util/inventario.js";
import { darItens, registrarAcao, textoPilhas } from "./progresso.js";

/*
 * Sacolas de recompensa (como no Hardcore Questing Mode): comum, boa, ótima, épica e lendária.
 * Usar a sacola sorteia um grupo de SACOLA_GRUPOS pelo peso do nível do grupo naquele tipo de
 * sacola (SACOLA_PESOS) e entrega todos os itens do grupo; um menu mostra o que saiu.
 */

/** Sorteia o grupo de uma sacola. Exportado para o Catálogo e os testes. */
export function sortearGrupo(tipo: number, sorte = Math.random()): ReadonlyArray<Pilha> {
  const pesos = SACOLA_GRUPOS.map((g) => SACOLA_PESOS[g.nivel][tipo]);
  let alvo = sorte * pesos.reduce((a, b) => a + b, 0);
  for (let k = 0; k < SACOLA_GRUPOS.length; k++) {
    alvo -= pesos[k];
    if (alvo < 0) return SACOLA_GRUPOS[k].itens;
  }
  return SACOLA_GRUPOS[SACOLA_GRUPOS.length - 1].itens;
}

/** Chance (0 a 1) de cada grupo numa sacola, para o Catálogo. */
export function chancesDaSacola(tipo: number): Array<{ itens: ReadonlyArray<Pilha>; chance: number }> {
  const pesos = SACOLA_GRUPOS.map((g) => SACOLA_PESOS[g.nivel][tipo]);
  const total = pesos.reduce((a, b) => a + b, 0);
  return SACOLA_GRUPOS.map((g, k) => ({ itens: g.itens, chance: pesos[k] / total })).filter((g) => g.chance > 0);
}

function gastarUma(jogador: Player, id: string): boolean {
  if (jogador.getGameMode() === GameMode.Creative) return true;
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const pilha = inv?.getItem(jogador.selectedSlotIndex);
  if (!inv || pilha?.typeId !== id) return false;
  if (pilha.amount === 1) inv.setItem(jogador.selectedSlotIndex, undefined);
  else {
    pilha.amount--;
    inv.setItem(jogador.selectedSlotIndex, pilha);
  }
  return true;
}

export function registrarSacolas(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    const tipo = (SACOLAS as ReadonlyArray<string>).indexOf(itemStack.typeId);
    if (tipo < 0 || !gastarUma(source, itemStack.typeId)) return;
    const itens = sortearGrupo(tipo);
    darItens(source, itens);
    source.playSound("random.orb");
    registrarAcao(source, "sacola");
    const corpo: RawMessage = { rawtext: [{ translate: "cl.sacola.saiu" }, { text: "\n\n§e" }, textoPilhas(itens)] };
    system.run(() => {
      new ActionFormData()
        .title({ translate: `item.${itemStack.typeId}.name` })
        .body(corpo)
        .button({ translate: "cl.diario.fechar" })
        .show(source)
        .catch(() => {
          // menu fechado no meio
        });
    });
  });
}

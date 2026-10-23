import { ItemStack, Player, system, world } from "@minecraft/server";
import { AGUAS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { aviso } from "./hud.js";

/*
 * Variedade na comida (o "Spice of Life" que o Crash Landing usava, 1.2.0): o jogo lembra as últimas
 * HISTORICO comidas. A que já apareceu 2 vezes rende 75%, 3 vezes 50% e 4 ou mais 25% da fome que daria.
 * Roda depois do Hunger Overhaul (scripts/jogador/fome.ts), cortando só o que a comida acabou de somar.
 * Águas não contam. Cada comida nova provada conta para a missão "Paladar".
 */
const HISTORICO = 12;
const RENDE = [1, 1, 0.75, 0.5, 0.25];
const fome = (j: Player) => j.getComponent("minecraft:player.hunger");

function lista(j: Player, chave: string): string[] {
  try {
    return JSON.parse((j.getDynamicProperty(chave) as string) ?? "[]") as string[];
  } catch {
    return [];
  }
}
const ehComida = (i: ItemStack) => !AGUAS[i.typeId] && i.getComponent("minecraft:food") !== undefined;

const antes = new Map<string, number>();

export function registrarVariedade(): void {
  world.afterEvents.itemStartUse.subscribe(({ itemStack, source }) => {
    if (itemStack && ehComida(itemStack)) antes.set(source.id, fome(source)?.currentValue ?? 20);
  });
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: j }) => {
    if (!ehComida(itemStack)) return;
    const id = itemStack.typeId;
    const hist = lista(j, "cl:refeicoes");
    const vezes = hist.filter((x) => x === id).length;
    j.setDynamicProperty("cl:refeicoes", JSON.stringify([...hist, id].slice(-HISTORICO)));
    const provadas = lista(j, "cl:provadas");
    if (!provadas.includes(id)) {
      j.setDynamicProperty("cl:provadas", JSON.stringify([...provadas, id]));
      registrarAcao(j, "comida_nova");
    }
    const rende = RENDE[Math.min(vezes, RENDE.length - 1)];
    const inicio = antes.get(j.id);
    antes.delete(j.id);
    if (rende >= 1 || inicio === undefined) return;
    // Dois ticks depois: o jogo e o HO já somaram a comida.
    system.runTimeout(() => {
      const f = fome(j);
      if (!j.isValid || !f) return;
      const ganhou = f.currentValue - inicio;
      if (ganhou <= 0) return;
      f.setCurrentValue(Math.max(inicio, f.currentValue - Math.round(ganhou * (1 - rende))));
      aviso(j, { translate: "cl.var.enjoado", with: { rawtext: [{ translate: itemStack.localizationKey }, { text: `${Math.round(rende * 100)}%` }] } }, 4);
    }, 2);
  });
}

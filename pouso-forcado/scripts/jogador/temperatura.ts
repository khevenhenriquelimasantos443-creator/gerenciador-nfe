import { Player, world } from "@minecraft/server";
import { PROPS, TEMPERATURA } from "../config.js";

/*
 * Temperatura do corpo do EnviroMine, em °C (dynamic property PROPS.corpo). O cálculo do ar e o passo
 * do corpo ficam em ambiente.ts; aqui ficam o valor, a comida que esquenta ou refresca
 * (TEMPERATURA.comida) e o renascer (volta a 37 °C).
 * Até a 0.18 a temperatura era uma escala de -20 a 20 (PROPS.temperatura): vira °C (36,5 + 0,3 por ponto).
 */
export function lerTemperatura(jogador: Player): number {
  const v = jogador.getDynamicProperty(PROPS.corpo);
  if (typeof v === "number") return v;
  const velha = jogador.getDynamicProperty(PROPS.temperatura);
  const c = typeof velha === "number" ? 36.5 + velha * 0.3 : TEMPERATURA.normal;
  jogador.setDynamicProperty(PROPS.corpo, c);
  jogador.setDynamicProperty(PROPS.temperatura, undefined);
  return c;
}

/** Muda o corpo em `delta` °C; `piso`/`teto` limitam até onde a mudança leva (ex.: água comum não esfria abaixo de 37,05). */
export function mudarTemperatura(jogador: Player, delta: number, piso = -Infinity, teto = Infinity): void {
  const c = lerTemperatura(jogador);
  let n = c + delta;
  if (delta < 0) n = Math.max(n, Math.min(c, piso));
  if (delta > 0) n = Math.min(n, Math.max(c, teto));
  jogador.setDynamicProperty(PROPS.corpo, Math.round(n * 10000) / 10000);
}

export function registrarTemperatura(): void {
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    const d = TEMPERATURA.comida[itemStack.typeId];
    if (d) mudarTemperatura(source, d, -Infinity, TEMPERATURA.comidaTeto);
  });
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) {
      player.setDynamicProperty(PROPS.corpo, TEMPERATURA.normal);
      player.setDynamicProperty(PROPS.congelamento, undefined);
    }
  });
}

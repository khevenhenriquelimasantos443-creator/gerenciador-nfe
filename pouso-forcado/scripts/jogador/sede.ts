import { ItemStack, Player, system, world } from "@minecraft/server";
import { FRUTA_CACTO_CHANCE, IDS, PROPS, SEDE } from "../config.js";

/*
 * Sede = hidratação do EnviroMine: 0 a 100 por jogador (dynamic property PROPS.hidratacao).
 * A perda e os efeitos são calculados a cada 30 ticks em ambiente.ts (que junta sede, temperatura
 * e ar, como o tracker do EnviroMine). Aqui ficam o valor, as comidas que mexem na sede
 * (SEDE.bebidas) e a fruta do cacto (FRUTA_CACTO_CHANCE ao quebrar um cacto).
 * Até a 0.18 a sede ia de 0 a 20 (PROPS.sede): é convertida (×5) na primeira leitura.
 */
export function lerSede(jogador: Player): number {
  const v = jogador.getDynamicProperty(PROPS.hidratacao);
  if (typeof v === "number") return v;
  const velha = jogador.getDynamicProperty(PROPS.sede);
  const nova = typeof velha === "number" ? Math.min(SEDE.max, velha * 5) : SEDE.max;
  jogador.setDynamicProperty(PROPS.hidratacao, nova);
  jogador.setDynamicProperty(PROPS.sede, undefined);
  return nova;
}

export function mudarSede(jogador: Player, delta: number): void {
  const depois = Math.max(0, Math.min(SEDE.max, lerSede(jogador) + delta));
  jogador.setDynamicProperty(PROPS.hidratacao, Math.round(depois * 1000) / 1000);
}

/** Desidratação (água salgada): atualizações que faltam; cada uma tira 1 de hidratação. */
export const desidratacao = (j: Player): number => (j.getDynamicProperty(PROPS.desidrata) as number | undefined) ?? 0;
export function desidratar(j: Player, atualizacoes: number): void {
  j.setDynamicProperty(PROPS.desidrata, Math.max(desidratacao(j), atualizacoes));
}

export function registrarSede(): void {
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    const pontos = SEDE.bebidas[itemStack.typeId];
    if (pontos) mudarSede(source, pontos);
  });

  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (initialSpawn) return;
    player.setDynamicProperty(PROPS.hidratacao, SEDE.max);
    player.setDynamicProperty(PROPS.desidrata, undefined);
  });

  // Fruta do cacto: às vezes cai ao quebrar um cacto.
  world.afterEvents.playerBreakBlock.subscribe(({ brokenBlockPermutation, block, dimension }) => {
    if (brokenBlockPermutation.type.id !== "minecraft:cactus") return;
    if (Math.random() >= FRUTA_CACTO_CHANCE) return;
    system.run(() => dimension.spawnItem(new ItemStack(IDS.frutaCacto, 1), block.center()));
  });
}

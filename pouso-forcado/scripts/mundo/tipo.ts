import { world } from "@minecraft/server";
import { MUNDO_PLANO, PROPS } from "../config.js";

/*
 * Tipo do mundo, descoberto uma vez pelo relevo (scripts/mundo/relevo.ts) e guardado no mundo: "plano" (os mundos
 * do add-on até a 1.14, com o relevo por script) ou "normal" (a partir da 1.15.0: infinito, com a geração natural do
 * jogo; scripts/mundo/nativo.ts).
 */
export const mundoPlano = (): boolean => world.getDynamicProperty(PROPS.tipoMundo) === "plano";
/** Altura da areia (o primeiro bloco de ar): 45 no plano; no normal, o nível do mar. */
export const alturaDaSuperficie = (): number => (mundoPlano() ? MUNDO_PLANO.superficieY : 63);

import { ENERGIA } from "../config.js";

/*
 * A energia aparece em RF na tela. Por dentro as baterias guardam "unidades" de
 * ENERGIA.rfPorUnidade (4.000 RF); ver ENERGIA em config.ts.
 */
const milhar = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** "8.000 RF" para 2 unidades. */
export const rf = (unidades: number): string => `${milhar(unidades * ENERGIA.rfPorUnidade)} RF`;

/** "80 RF/t" para quem gera 2 unidades por ciclo de 5 s. */
export const rfPorTick = (unidadesPorCiclo: number): string => `${milhar((unidadesPorCiclo * ENERGIA.rfPorUnidade) / ENERGIA.ticksPorCiclo)} RF/t`;

import { NATIVO } from "../config.js";
import { TEMPLO_YUNG } from "./templo_yung_dados.js";

/*
 * As estruturas raras da geração natural (1.15.0, mundo normal): o jogo as põe pelas features
 * (tools/gerar-geracao.py) no chunk do canto de cada célula de uma grade fixa (NATIVO em config.ts). Aqui é a mesma
 * conta, para os comandos (/cl:templo, /cl:destrocos, /cl:piramide), as missões e para as cidades não nascerem em
 * cima delas. O jogo gira a estrutura em volta do meio, então o meio é o que se sabe. As pirâmides (grandes demais para
 * a feature) o script põe na mesma grade, sem girar (scripts/mundo/templo_yung.ts).
 */
type Grade = { celula: number; desloc: readonly number[]; tamanho: number };
const GRADES: Readonly<Record<"templo" | "destrocos" | "piramide", ReadonlyArray<Grade>>> = {
  templo: [NATIVO.templo],
  destrocos: [NATIVO.destrocos],
  piramide: NATIVO.piramides.map((p, v) => ({ ...p, tamanho: TEMPLO_YUNG.variantes[v].tam[0] })),
};

/** O meio (em blocos) da estrutura da grade mais perto de (x, z). */
function maisPerto(g: Grade, x: number, z: number): { x: number; z: number; distancia: number } {
  const c = g.celula * 16, m = Math.floor(g.tamanho / 2);
  const kx = Math.round((x - g.desloc[0] * 16 - m) / c), kz = Math.round((z - g.desloc[1] * 16 - m) / c);
  const px = kx * c + g.desloc[0] * 16 + m, pz = kz * c + g.desloc[1] * 16 + m;
  return { x: px, z: pz, distancia: Math.hypot(x - px, z - pz) };
}

/** A pirâmide da grade mais perto: a variante e o canto (em blocos). */
export function piramideMaisProxima(x: number, z: number): { v: number; x0: number; z0: number; distancia: number } | undefined {
  let melhor: { v: number; x0: number; z0: number; distancia: number } | undefined;
  GRADES.piramide.forEach((g, v) => {
    const p = maisPerto(g, x, z);
    const m = Math.floor(g.tamanho / 2);
    if (!melhor || p.distancia < melhor.distancia) melhor = { v, x0: p.x - m, z0: p.z - m, distancia: p.distancia };
  });
  return melhor;
}

export function nativoMaisProximo(tipo: keyof typeof GRADES, x: number, z: number) {
  let melhor: { x: number; z: number; distancia: number } | undefined;
  for (const g of GRADES[tipo]) {
    const p = maisPerto(g, x, z);
    if (!melhor || p.distancia < melhor.distancia) melhor = p;
  }
  return melhor;
}

/** Dentro da pirâmide (de lado, a pirâmide girada ainda cabe no quadrado em volta do meio)? */
export function naPiramideNativa(x: number, z: number): boolean {
  const p = nativoMaisProximo("piramide", x, z);
  return !!p && Math.max(Math.abs(x - p.x), Math.abs(z - p.z)) <= 40;
}

/** O chunk fica a menos de `raio` chunks de alguma estrutura rara nativa? */
export function pertoDeRaraNativa(cx: number, cz: number, raio: number): boolean {
  const x = cx * 16 + 8, z = cz * 16 + 8;
  return (Object.keys(GRADES) as Array<keyof typeof GRADES>).some((t) => {
    const p = nativoMaisProximo(t, x, z);
    return !!p && Math.max(Math.abs(x - p.x), Math.abs(z - p.z)) < raio * 16 + 48;
  });
}

import { Block } from "@minecraft/server";
import { ENERGIA, IDS } from "../config.js";
import { definirEstado, lerEstado, vizinhos } from "./blocos.js";

/*
 * Rede de energia sem estado guardado: quem precisa (gerador ou máquina) faz uma busca em
 * largura a partir de si, andando pelos cabos e blocos de energia, até achar uma bateria que sirva.
 * A carga fica no estado cl:carga de cada bateria.
 * Custo: no máximo ENERGIA.rede.maxBlocos cabos/blocos de energia (×6 vizinhos) por busca; cada máquina busca uma vez
 * por ciclo (5 s).
 */
const CARGA = "cl:carga";
// Por onde a energia passa: cabos e os próprios blocos de energia (máquinas não conduzem).
const CONDUTORES = new Set<string>([IDS.cabo, IDS.bateria, IDS.painelSolar, IDS.gerador, IDS.moinho]);

const chave = (b: Block) => `${b.x},${b.y},${b.z}`;

/** Primeiro bloco da rede (vizinhos e o que estiver ligado por cabos) que satisfaz `quer`. */
export function procurarNaRede(origem: Block, quer: (b: Block) => boolean): Block | undefined {
  const vistos = new Set<string>([chave(origem)]);
  const fila = [...vizinhos(origem)];
  let condutores = 0; // só cabos e blocos de energia contam para o limite (o ar em volta não)
  while (fila.length > 0) {
    const b = fila.shift()!;
    if (vistos.has(chave(b))) continue;
    vistos.add(chave(b));
    if (quer(b)) return b;
    if (!CONDUTORES.has(b.typeId)) continue;
    if (++condutores > ENERGIA.rede.maxBlocos) break;
    fila.push(...vizinhos(b));
  }
  return undefined;
}

export const cargaDe = (bateria: Block): number => lerEstado<number>(bateria, CARGA);

/** Manda até `unidades` para baterias com espaço. Retorna quantas foram guardadas. */
export function gerar(origem: Block, unidades: number): number {
  let guardadas = 0;
  for (let u = 0; u < unidades; u++) {
    const bat = procurarNaRede(origem, (b) => b.typeId === IDS.bateria && cargaDe(b) < ENERGIA.bateriaMax);
    if (!bat) break;
    definirEstado(bat, CARGA, cargaDe(bat) + 1);
    guardadas++;
  }
  return guardadas;
}

/** Tira 1 unidade de uma bateria com carga. Retorna true se conseguiu. */
export function consumir(origem: Block): boolean {
  const bat = procurarNaRede(origem, (b) => b.typeId === IDS.bateria && cargaDe(b) > 0);
  if (!bat) return false;
  definirEstado(bat, CARGA, cargaDe(bat) - 1);
  return true;
}

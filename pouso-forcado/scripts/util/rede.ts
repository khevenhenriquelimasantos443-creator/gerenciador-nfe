import { Block } from "@minecraft/server";
import { ENERGIA, IDS } from "../config.js";
import { DADOS_F17, DADOS_F24, DADOS_F29 } from "../conteudo/gerado.js";
import { definirEstado, lerEstado, vizinhos } from "./blocos.js";
import { gravar, ler } from "./dados.js";

/*
 * Rede de energia sem estado guardado: quem precisa (gerador ou máquina) faz uma busca em
 * largura a partir de si, andando pelos cabos e blocos de energia, até achar uma bateria que sirva.
 * A carga fica no estado cl:carga de cada bateria; nas Células de Energia (Fase 17, Thermal Expansion),
 * que guardam muito mais, fica numa propriedade do mundo (util/dados.ts) e se perde se a célula for quebrada.
 * Custo: no máximo ENERGIA.rede.maxBlocos cabos/blocos de energia (×6 vizinhos) por busca; cada máquina busca uma vez
 * por ciclo (5 s).
 */
const CARGA = "cl:carga";
// Por onde a energia passa: cabos e os próprios blocos de energia (máquinas não conduzem).
// Células de Energia (Thermal, Fase 17) e Cubos de Energia (Mekanism, 1.3.0): capacidade em E.
// e Bancos de Capacitores (Ender IO, 1.8.0).
export const CELULAS: Readonly<Record<string, number>> = { ...DADOS_F17.celulas, ...DADOS_F24.cubos, ...DADOS_F29.bancos };
const CONDUTORES = new Set<string>([IDS.cabo, IDS.bateria, IDS.painelSolar, IDS.gerador, IDS.moinho, "cl:dinamo_redstone", "cl:tesseract", ...Object.keys(CELULAS)]);

// Tesseract (1.2.0): a busca também pula para os outros Tesseracts da mesma frequência (scripts/maquinas/energia_extra.ts).
let paresDe: (b: Block) => Block[] = () => [];
export function definirPares(fn: (b: Block) => Block[]): void {
  paresDe = fn;
}
const proximos = (b: Block): Block[] => (b.typeId === "cl:tesseract" ? [...vizinhos(b), ...paresDe(b)] : vizinhos(b));

const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;

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
    fila.push(...proximos(b));
  }
  return undefined;
}

/** Todos os blocos da rede que satisfazem `quer` (até `max`), andando por até `maxBlocos` condutores. */
export function coletarNaRede(origem: Block, quer: (b: Block) => boolean, max: number, maxBlocos: number): Block[] {
  const achados: Block[] = [];
  const vistos = new Set<string>([chave(origem)]);
  const fila = [...vizinhos(origem)];
  let condutores = 0;
  while (fila.length > 0 && achados.length < max) {
    const b = fila.shift()!;
    if (vistos.has(chave(b))) continue;
    vistos.add(chave(b));
    if (quer(b)) {
      achados.push(b);
      continue;
    }
    if (!CONDUTORES.has(b.typeId)) continue;
    if (++condutores > maxBlocos) break;
    fila.push(...proximos(b));
  }
  return achados;
}

export const capacidadeDe = (b: Block): number => (b.typeId === IDS.bateria ? ENERGIA.bateriaMax : CELULAS[b.typeId] ?? 0);
export const cargaDe = (b: Block): number => (b.typeId === IDS.bateria ? lerEstado<number>(b, CARGA) : CELULAS[b.typeId] ? ler<number>("celula", b, 0) : 0);
function mudarCarga(b: Block, delta: number): void {
  if (b.typeId === IDS.bateria) definirEstado(b, CARGA, cargaDe(b) + delta);
  else gravar("celula", b, cargaDe(b) + delta);
}
const guarda = (b: Block) => b.typeId === IDS.bateria || CELULAS[b.typeId] !== undefined;

/** Manda até `unidades` para baterias/células com espaço. Retorna quantas foram guardadas. */
export function gerar(origem: Block, unidades: number): number {
  let guardadas = 0;
  while (guardadas < unidades) {
    const alvo = procurarNaRede(origem, (b) => guarda(b) && cargaDe(b) < capacidadeDe(b));
    if (!alvo) break;
    const n = Math.min(unidades - guardadas, capacidadeDe(alvo) - cargaDe(alvo));
    mudarCarga(alvo, n);
    guardadas += n;
  }
  return guardadas;
}

/** Tira `unidades` (1 por padrão) de baterias/células com carga. Retorna true se conseguiu tudo. */
export function consumir(origem: Block, unidades = 1): boolean {
  let falta = unidades;
  while (falta > 0) {
    const fonte = procurarNaRede(origem, (b) => guarda(b) && cargaDe(b) > 0);
    if (!fonte) return false;
    const n = Math.min(falta, cargaDe(fonte));
    mudarCarga(fonte, -n);
    falta -= n;
  }
  return true;
}

import { Block, Dimension, RawMessage, Vector3, world } from "@minecraft/server";

/*
 * Dados guardados por bloco (Fases 15+): um JSON numa propriedade do mundo com chave
 * "cl:<tipo>:<dimensão>:x,y,z". Apagar o bloco deve apagar a chave (esquecer()).
 * E um registro de "detalhes" para a linha do "o que estou olhando" (jogador/olhar.ts).
 */
export const chaveDe = (tipo: string, b: { x: number; y: number; z: number; dimension: Dimension }) =>
  `cl:${tipo}:${b.dimension.id}:${b.x},${b.y},${b.z}`;

export function ler<T>(tipo: string, b: Block, padrao: T): T {
  const v = world.getDynamicProperty(chaveDe(tipo, b));
  if (typeof v !== "string") return padrao;
  try {
    return JSON.parse(v) as T;
  } catch {
    return padrao;
  }
}

export function gravar<T>(tipo: string, b: Block, d: T | undefined): void {
  world.setDynamicProperty(chaveDe(tipo, b), d === undefined ? undefined : JSON.stringify(d));
}

/** Lê pela posição (para blocos que não estão carregados ou já foram quebrados). */
export function lerEm<T>(tipo: string, dim: Dimension, p: Vector3, padrao: T): T {
  const v = world.getDynamicProperty(`cl:${tipo}:${dim.id}:${p.x},${p.y},${p.z}`);
  if (typeof v !== "string") return padrao;
  try {
    return JSON.parse(v) as T;
  } catch {
    return padrao;
  }
}

export function gravarEm<T>(tipo: string, dim: Dimension, p: Vector3, d: T | undefined): void {
  world.setDynamicProperty(`cl:${tipo}:${dim.id}:${p.x},${p.y},${p.z}`, d === undefined ? undefined : JSON.stringify(d));
}

const detalhes = new Map<string, (b: Block) => RawMessage | undefined>();
/** Registra o detalhe mostrado no "o que estou olhando" para um tipo de bloco. */
export function registrarDetalhe(ids: string | string[], fn: (b: Block) => RawMessage | undefined): void {
  for (const id of Array.isArray(ids) ? ids : [ids]) detalhes.set(id, fn);
}
export const detalheRegistrado = (b: Block) => detalhes.get(b.typeId)?.(b);

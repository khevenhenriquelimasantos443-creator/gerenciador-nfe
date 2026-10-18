import { Block } from "@minecraft/server";

// Os tipos do @minecraft/server só conhecem estados vanilla; estes helpers
// fazem o cast para estados próprios ("cl:...") num lugar só.
type Estado = boolean | number | string;

export function lerEstado<T extends Estado>(bloco: Block, nome: string): T {
  return bloco.permutation.getState(nome as never) as unknown as T;
}

export function definirEstado(bloco: Block, nome: string, valor: Estado): void {
  bloco.setPermutation(bloco.permutation.withState(nome as never, valor as never));
}

/** Os 6 vizinhos do bloco. Ignora posições fora do mundo/chunk não carregado. */
export function vizinhos(bloco: Block): Block[] {
  const lista: Block[] = [];
  const passos = [() => bloco.above(), () => bloco.below(), () => bloco.north(), () => bloco.south(), () => bloco.east(), () => bloco.west()];
  for (const passo of passos) {
    try {
      const b = passo();
      if (b) lista.push(b);
    } catch {
      // chunk vizinho descarregado: só ignora
    }
  }
  return lista;
}

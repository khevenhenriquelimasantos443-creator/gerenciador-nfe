import { BlockCustomComponent, system } from "@minecraft/server";

/*
 * Medição de custo para o /cl:diagnostico: quanto tempo de script cada sistema gastou no último
 * minuto e quantos blocos de cada máquina estão ativos (rodaram o tick nesse minuto).
 * Date.now() só tem precisão de 1 ms; somado num minuto inteiro, dá uma boa ideia do peso.
 */
type Conta = { ms: number; vezes: number; blocos: Set<string> };
const JANELA = 1200; // 1 minuto
let atual = new Map<string, Conta>();
let anterior: Map<string, Conta> | undefined;
let inicio = 0;

function conta(nome: string): Conta {
  let c = atual.get(nome);
  if (!c) atual.set(nome, (c = { ms: 0, vezes: 0, blocos: new Set() }));
  return c;
}

export function medir<T>(nome: string, fn: () => T, bloco?: string): T {
  const t = Date.now();
  try {
    return fn();
  } finally {
    const c = conta(nome);
    c.ms += Date.now() - t;
    c.vezes++;
    if (bloco) c.blocos.add(bloco);
  }
}

/** system.runInterval que entra na medição. */
export const intervalo = (nome: string, fn: () => void, ticks: number): number => system.runInterval(() => medir(nome, fn), ticks);

/** Componente de bloco cujo onTick entra na medição (com a contagem de blocos ativos). */
export function comPerfil(nome: string, comp: BlockCustomComponent): BlockCustomComponent {
  const onTick = comp.onTick;
  if (!onTick) return comp;
  return { ...comp, onTick: (e, p) => medir(nome, () => onTick(e, p), `${e.block.x},${e.block.y},${e.block.z}`) };
}

/** Linhas do relatório: do minuto passado (ou do atual, se ainda não fechou um). */
export function relatorio(): string[] {
  const dados = anterior ?? atual;
  const seg = anterior ? 60 : Math.max(1, (system.currentTick - inicio) / 20);
  const linhas = [...dados].sort(([, a], [, b]) => b.ms - a.ms);
  const total = linhas.reduce((s, [, c]) => s + c.ms, 0);
  const saida = [`§7tempo de script: §f${(total / seg).toFixed(1)} ms/s §7(${Math.round(seg)} s medidos)`];
  for (const [nome, c] of linhas) {
    const blocos = c.blocos.size ? `, ${c.blocos.size} blocos ativos` : "";
    saida.push(`§7- ${nome}: §f${(c.ms / seg).toFixed(2)} ms/s §7(${c.vezes}x${blocos})`);
  }
  return saida;
}

export function registrarPerfil(): void {
  inicio = system.currentTick;
  system.runInterval(() => {
    anterior = atual;
    atual = new Map();
    inicio = system.currentTick;
  }, JANELA);
}

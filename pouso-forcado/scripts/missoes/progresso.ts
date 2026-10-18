import { ItemStack, Player, RawMessage, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { Acao, MISSOES, Missao, Objetivo } from "./lista.js";

/*
 * Progresso das missões, salvo por jogador numa dynamic property (JSON):
 *   i = índice da missão atual em MISSOES; n = contador da missão atual;
 *   d = dia do mundo em que a missão começou (para "noites"); p = índices pulados.
 */

export type Estado = { i: number; n: number; d: number; p: number[] };

const PREFIXO = "§6[Diário de Bordo]§r ";

export function lerEstado(jogador: Player): Estado {
  const bruto = jogador.getDynamicProperty(PROPS.missoes);
  if (typeof bruto === "string") {
    try {
      const e = JSON.parse(bruto) as Partial<Estado>;
      return { i: e.i ?? 0, n: e.n ?? 0, d: e.d ?? world.getDay(), p: e.p ?? [] };
    } catch {
      // progresso corrompido: recomeça
    }
  }
  const novo: Estado = { i: 0, n: 0, d: world.getDay(), p: [] };
  salvar(jogador, novo);
  return novo;
}

function salvar(jogador: Player, e: Estado): void {
  jogador.setDynamicProperty(PROPS.missoes, JSON.stringify(e));
}

export function missaoAtual(e: Estado): Missao | undefined {
  return MISSOES[e.i];
}

export const nomeItem = (id: string): RawMessage => ({ translate: new ItemStack(id).localizationKey });

export function textoPilhas(pilhas: ReadonlyArray<{ item: string; quantidade: number }>): RawMessage {
  const rawtext: RawMessage[] = [];
  pilhas.forEach(({ item, quantidade }, k) => {
    if (k > 0) rawtext.push({ text: ", " });
    rawtext.push(nomeItem(item), { text: ` x${quantidade}` });
  });
  return { rawtext };
}

function contarNoInventario(jogador: Player, item: string): number {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!inv) return 0;
  let total = 0;
  for (let s = 0; s < inv.size; s++) {
    const pilha = inv.getItem(s);
    if (pilha?.typeId === item) total += pilha.amount;
  }
  return total;
}

/** Quanto da missão atual já foi feito (para mostrar no Diário). */
export function feitoAtual(jogador: Player, e: Estado, obj: Objetivo): number {
  if (obj.tipo === "ter") return Math.min(obj.qtd, contarNoInventario(jogador, obj.item));
  if (obj.tipo === "noites") return Math.min(obj.qtd, Math.max(0, world.getDay() - e.d));
  return Math.min(obj.qtd, e.n);
}

export function darItens(jogador: Player, pilhas: ReadonlyArray<{ item: string; quantidade: number }>): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  for (const { item, quantidade } of pilhas) {
    const sobra = inv ? inv.addItem(new ItemStack(item, quantidade)) : new ItemStack(item, quantidade);
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location); // inventário cheio: cai no chão
  }
}

function anunciarNova(jogador: Player, e: Estado): void {
  const m = missaoAtual(e);
  if (!m) {
    jogador.sendMessage({ rawtext: [{ text: PREFIXO }, { translate: "cl.diario.todas" }] });
    return;
  }
  jogador.sendMessage({
    rawtext: [{ text: PREFIXO }, { translate: "cl.diario.nova" }, { text: " §e" }, { translate: `cl.missao.${m.id}.titulo` }],
  });
}

/** Conclui (ou pula) a missão atual e passa para a próxima. */
export function avancar(jogador: Player, pulou = false): void {
  const e = lerEstado(jogador);
  const m = missaoAtual(e);
  if (!m) return;
  if (pulou) {
    e.p.push(e.i);
  } else {
    darItens(jogador, m.recompensa);
    jogador.playSound("random.levelup");
    jogador.onScreenDisplay.setActionBar({ rawtext: [{ translate: "cl.diario.concluida_curta" }, { text: " " }, { translate: `cl.missao.${m.id}.titulo` }] });
    jogador.sendMessage({
      rawtext: [
        { text: PREFIXO },
        { translate: "cl.diario.concluida" },
        { text: " §a" },
        { translate: `cl.missao.${m.id}.titulo` },
        { text: "§r. " },
        { translate: "cl.diario.recompensa" },
        { text: " " },
        textoPilhas(m.recompensa),
      ],
    });
  }
  e.i++;
  e.n = 0;
  e.d = world.getDay();
  salvar(jogador, e);
  anunciarNova(jogador, e);
}

/** Soma progresso de eventos (colocar, quebrar, matar, usar máquina). */
export function contar(jogador: Player, tipo: "colocar" | "quebrar" | "matar" | "acao", combina: (obj: Objetivo) => boolean): void {
  const e = lerEstado(jogador);
  const m = missaoAtual(e);
  if (!m || m.objetivo.tipo !== tipo || !combina(m.objetivo)) return;
  e.n++;
  salvar(jogador, e);
  if (e.n >= m.objetivo.qtd) avancar(jogador);
}

/** Missões que dependem de estado (ter item, noites): conferidas de tempos em tempos. */
export function conferir(jogador: Player): void {
  const e = lerEstado(jogador);
  const m = missaoAtual(e);
  if (!m || (m.objetivo.tipo !== "ter" && m.objetivo.tipo !== "noites")) return;
  if (feitoAtual(jogador, e, m.objetivo) >= m.objetivo.qtd) avancar(jogador);
}

/** Chamado pelas máquinas quando o jogador usa uma (peneirar, compostar...). */
export function registrarAcao(jogador: Player, acao: Acao): void {
  contar(jogador, "acao", (o) => o.tipo === "acao" && o.acao === acao);
}

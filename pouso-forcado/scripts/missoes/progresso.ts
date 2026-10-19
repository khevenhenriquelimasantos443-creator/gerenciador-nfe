import { ItemStack, Player, RawMessage, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { Pilha } from "../util/inventario.js";
import { Acao, MISSAO_POR_ID, MISSOES, Missao, ORDEM_V1, Objetivo } from "./lista.js";

/*
 * Progresso das missões, salvo por jogador numa dynamic property (JSON, versão 2):
 *   f = ids concluídos; pl = ids pulados (contam como concluídos para as dependências);
 *   c = contador de cada missão aberta; d = dia do mundo em que cada missão abriu (para "noites");
 *   e = ids concluídos com recompensa "escolha 1" ainda não escolhida.
 * Até a 0.16 o formato era {i, n, d, p} (índice numa lista única): é migrado na primeira leitura.
 */
export type Estado = { v: 2; f: string[]; pl: string[]; c: Record<string, number>; d: Record<string, number>; e: string[] };

const PREFIXO = "§6[Diário de Bordo]§r ";

type EstadoV1 = { i?: number; n?: number; d?: number; p?: number[] };

function migrarV1(velho: EstadoV1): Estado {
  const e: Estado = { v: 2, f: [], pl: [], c: {}, d: {}, e: [] };
  const i = velho.i ?? 0;
  ORDEM_V1.slice(0, i).forEach((id, k) => (velho.p?.includes(k) ? e.pl : e.f).push(id));
  const atual = ORDEM_V1[i];
  if (atual) {
    e.c[atual] = velho.n ?? 0;
    e.d[atual] = velho.d ?? world.getDay();
  }
  return e;
}

export function lerEstado(jogador: Player): Estado {
  const bruto = jogador.getDynamicProperty(PROPS.missoes);
  if (typeof bruto === "string") {
    try {
      const j = JSON.parse(bruto) as Partial<Estado> & EstadoV1;
      if (j.v === 2) return { v: 2, f: j.f ?? [], pl: j.pl ?? [], c: j.c ?? {}, d: (j.d as Record<string, number>) ?? {}, e: j.e ?? [] };
      const migrado = migrarV1(j);
      salvar(jogador, migrado);
      return migrado;
    } catch {
      // progresso corrompido: recomeça
    }
  }
  const novo: Estado = { v: 2, f: [], pl: [], c: {}, d: {}, e: [] };
  salvar(jogador, novo);
  return novo;
}

function salvar(jogador: Player, e: Estado): void {
  jogador.setDynamicProperty(PROPS.missoes, JSON.stringify(e));
}

export const feita = (e: Estado, id: string): boolean => e.f.includes(id) || e.pl.includes(id);
export const desbloqueada = (e: Estado, m: Missao): boolean => m.requer.every((r) => feita(e, r));
/** Missões abertas agora: liberadas e ainda não feitas. */
export const abertas = (e: Estado): Missao[] => MISSOES.filter((m) => !feita(e, m.id) && desbloqueada(e, m));

export const nomeItem = (id: string): RawMessage => ({ translate: new ItemStack(id).localizationKey });

export function textoPilhas(pilhas: ReadonlyArray<Pilha>): RawMessage {
  const rawtext: RawMessage[] = [];
  pilhas.forEach(({ item, quantidade }, k) => {
    if (k > 0) rawtext.push({ text: ", " });
    rawtext.push(nomeItem(item), { text: ` x${quantidade}` });
  });
  return { rawtext };
}

export function contarNoInventario(jogador: Player, item: string): number {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!inv) return 0;
  let total = 0;
  for (let s = 0; s < inv.size; s++) {
    const pilha = inv.getItem(s);
    if (pilha?.typeId === item) total += pilha.amount;
  }
  return total;
}

/** Quanto da missão já foi feito (para mostrar no Diário). */
export function feitoDe(jogador: Player, e: Estado, m: Missao): number {
  const obj: Objetivo = m.objetivo;
  if (feita(e, m.id)) return obj.qtd;
  if (obj.tipo === "ter" || obj.tipo === "entregar") return Math.min(obj.qtd, contarNoInventario(jogador, obj.item));
  if (obj.tipo === "noites") return Math.min(obj.qtd, Math.max(0, world.getDay() - (e.d[m.id] ?? world.getDay())));
  return Math.min(obj.qtd, e.c[m.id] ?? 0);
}

export function darItens(jogador: Player, pilhas: ReadonlyArray<Pilha>): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  for (const { item, quantidade } of pilhas) {
    const sobra = inv ? inv.addItem(new ItemStack(item, quantidade)) : new ItemStack(item, quantidade);
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location); // inventário cheio: cai no chão
  }
}

/** Tira `qtd` do item do inventário do jogador (já conferido que tem). */
export function tirarDoInventario(jogador: Player, item: string, qtd: number): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  let falta = qtd;
  for (let s = 0; s < inv.size && falta > 0; s++) {
    const p = inv.getItem(s);
    if (p?.typeId !== item) continue;
    const n = Math.min(falta, p.amount);
    if (n === p.amount) inv.setItem(s, undefined);
    else {
      p.amount -= n;
      inv.setItem(s, p);
    }
    falta -= n;
  }
}

/** Anota o dia em que cada missão nova abriu e avisa o jogador. */
function abrirNovas(jogador: Player, e: Estado, antes: ReadonlySet<string>, avisar: boolean): void {
  const hoje = world.getDay();
  for (const m of abertas(e)) {
    if (e.d[m.id] === undefined) e.d[m.id] = hoje;
    if (avisar && !antes.has(m.id)) {
      jogador.sendMessage({ rawtext: [{ text: PREFIXO }, { translate: "cl.diario.nova" }, { text: " §e" }, { translate: `cl.missao.${m.id}.titulo` }] });
    }
  }
}

/** Conclui (ou pula) uma missão aberta. */
export function concluir(jogador: Player, id: string, pulou = false): void {
  const e = lerEstado(jogador);
  const m = MISSAO_POR_ID.get(id);
  if (!m || feita(e, id) || !desbloqueada(e, m)) return;
  const antes = new Set(abertas(e).map((x) => x.id));
  if (pulou) e.pl.push(id);
  else {
    e.f.push(id);
    darItens(jogador, m.recompensa);
    if (m.escolha?.length) e.e.push(id);
    jogador.playSound("random.levelup");
    aviso(jogador, { rawtext: [{ translate: "cl.diario.concluida_curta" }, { text: " " }, { translate: `cl.missao.${m.id}.titulo` }] }, 4);
    const msg: RawMessage[] = [{ text: PREFIXO }, { translate: "cl.diario.concluida" }, { text: " §a" }, { translate: `cl.missao.${m.id}.titulo` }, { text: "§r." }];
    if (m.recompensa.length) msg.push({ text: " " }, { translate: "cl.diario.recompensa" }, { text: " " }, textoPilhas(m.recompensa));
    if (m.escolha?.length) msg.push({ text: " §6" }, { translate: "cl.diario.escolha_pendente" });
    jogador.sendMessage({ rawtext: msg });
  }
  delete e.c[id];
  delete e.d[id];
  abrirNovas(jogador, e, antes, true);
  salvar(jogador, e);
  if (abertas(e).length === 0 && e.f.length + e.pl.length === MISSOES.length) {
    jogador.sendMessage({ rawtext: [{ text: PREFIXO }, { translate: "cl.diario.todas" }] });
  }
}

/** Dá o item escolhido de uma recompensa "escolha 1". */
export function escolher(jogador: Player, id: string, k: number): void {
  const e = lerEstado(jogador);
  const m = MISSAO_POR_ID.get(id);
  const item = m?.escolha?.[k];
  if (!item || !e.e.includes(id)) return;
  e.e = e.e.filter((x) => x !== id);
  salvar(jogador, e);
  darItens(jogador, [item]);
  jogador.playSound("random.orb");
}

/** Entrega os itens de uma missão "entregar" (botão do Diário). Retorna true se concluiu. */
export function entregar(jogador: Player, id: string): boolean {
  const m = MISSAO_POR_ID.get(id);
  if (m?.objetivo.tipo !== "entregar") return false;
  const { item, qtd } = m.objetivo;
  if (contarNoInventario(jogador, item) < qtd) return false;
  tirarDoInventario(jogador, item, qtd);
  concluir(jogador, id);
  return true;
}

/** Soma progresso de eventos (colocar, quebrar, matar, consumir, usar máquina) em todas as missões abertas. */
export function contar(jogador: Player, tipo: "colocar" | "quebrar" | "matar" | "acao" | "consumir", combina: (obj: Objetivo) => boolean): void {
  const e = lerEstado(jogador);
  const alvos = abertas(e).filter((m) => m.objetivo.tipo === tipo && combina(m.objetivo));
  if (alvos.length === 0) return;
  const prontas: string[] = [];
  for (const m of alvos) {
    e.c[m.id] = (e.c[m.id] ?? 0) + 1;
    if (e.c[m.id] >= m.objetivo.qtd) prontas.push(m.id);
  }
  salvar(jogador, e);
  for (const id of prontas) concluir(jogador, id);
}

/** Missões que dependem de estado (ter item, noites): conferidas de tempos em tempos. */
export function conferir(jogador: Player): void {
  const e = lerEstado(jogador);
  const lista = abertas(e);
  if (lista.some((m) => e.d[m.id] === undefined)) {
    abrirNovas(jogador, e, new Set(lista.map((m) => m.id)), false);
    salvar(jogador, e);
  }
  for (const m of lista) {
    if (m.objetivo.tipo !== "ter" && m.objetivo.tipo !== "noites") continue;
    if (feitoDe(jogador, e, m) >= m.objetivo.qtd) concluir(jogador, m.id);
  }
}

/** Chamado pelas máquinas quando o jogador usa uma (peneirar, compostar...). */
export function registrarAcao(jogador: Player, acao: Acao): void {
  contar(jogador, "acao", (o) => o.tipo === "acao" && o.acao === acao);
}

import { BlockCustomComponent, ItemStack, Player, RawMessage } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { TINKERS } from "../config.js";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { contarNoInventario, registrarAcao, tirarDoInventario } from "../missoes/progresso.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { Mat, Mods, Tipo, TIPOS, consertar, criarFerramenta, durabilidade, ferramentaDe, modsDe, recalcular } from "./ferramenta.js";

/*
 * As três mesas do Tinkers' Construct (Fase 15). Tudo pelo toque com o item na mão + menus:
 * - Mesa de Moldes: Padrão em Branco na mão -> escolhe o padrão de peça.
 * - Construtor de Peças: padrão de peça na mão -> escolhe o material que está na mochila
 *   (madeira, pedra, sílex, cacto, osso, obsidiana; metal só na fundição) e paga o custo da peça.
 * - Estação de Ferramentas: mão vazia ou qualquer item -> montar ferramenta com as peças da mochila;
 *   com uma ferramenta na mão -> consertar (com o material da cabeça) e modificar (Fase 16).
 */
const PECAS = DADOS_F15.pecas as Readonly<Record<string, { custo: number }>>;
const FERR = DADOS_F15.ferramentas as Readonly<Record<string, { pecas: readonly string[] }>>;
const MATS = Object.keys(DADOS_F15.materiais) as Mat[];
const nome = (id: string): RawMessage => ({ translate: `item.${id}.name` });

/** Os itens da mochila que servem de material, por material. */
function materiaisNaMochila(j: Player): Map<Mat, { id: string; qtd: number }[]> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const achados = new Map<Mat, { id: string; qtd: number }[]>();
  if (!inv) return achados;
  const somas = new Map<string, number>();
  for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p) somas.set(p.typeId, (somas.get(p.typeId) ?? 0) + p.amount);
  }
  for (const [id, qtd] of somas) {
    const mat = materialDoItem(id);
    if (!mat) continue;
    const lista = achados.get(mat) ?? [];
    lista.push({ id, qtd });
    achados.set(mat, lista);
  }
  return achados;
}

export function materialDoItem(id: string): Mat | undefined {
  if (id.endsWith("_planks")) return "madeira";
  return TINKERS.materialDeItem[id] as Mat | undefined;
}

function tirar(j: Player, fontes: { id: string; qtd: number }[], qtd: number): void {
  let falta = qtd;
  for (const f of fontes) {
    const n = Math.min(falta, f.qtd);
    if (n > 0) tirarDoInventario(j, f.id, n);
    falta -= n;
    if (falta <= 0) return;
  }
}

// ---------- Mesa de Moldes ----------
async function mesaMoldes(j: Player): Promise<void> {
  const pecas = Object.keys(PECAS);
  const form = new ActionFormData().title({ translate: "cl.tc.moldes_titulo" }).body({ translate: "cl.tc.moldes_corpo" });
  for (const p of pecas) form.button(nome(`cl:padrao_${p}`));
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined || itemNaMao(j)?.typeId !== "cl:padrao_branco") return;
  gastarDaMao(j);
  darAoJogador(j, new ItemStack(`cl:padrao_${pecas[r.selection]}`, 1));
  j.playSound("dig.wood");
  registrarAcao(j, "padrao");
}

export const mesaMoldesComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    if (itemNaMao(j)?.typeId !== "cl:padrao_branco") return aviso(j, "cl.tc.moldes_como");
    abrirUmMenu(j, () => mesaMoldes(j));
  },
};

// ---------- Construtor de Peças ----------
async function construtor(j: Player, peca: string): Promise<void> {
  const custo = PECAS[peca].custo;
  const tem = materiaisNaMochila(j);
  const opcoes = MATS.filter((m) => !(TINKERS.metais as readonly string[]).includes(m) && (tem.get(m) ?? []).reduce((s, f) => s + f.qtd, 0) >= custo);
  if (opcoes.length === 0) {
    const temMetal = MATS.some((m) => (TINKERS.metais as readonly string[]).includes(m) && tem.has(m));
    return aviso(j, temMetal ? "cl.tc.pecas_metal" : { translate: "cl.tc.pecas_falta", with: [String(custo)] }, 5);
  }
  const form = new ActionFormData()
    .title({ translate: "cl.tc.pecas_titulo" })
    .body({ translate: "cl.tc.pecas_corpo", with: { rawtext: [{ translate: `cl.tc.peca.${peca}` }, { text: String(custo) }] } });
  for (const m of opcoes) form.button(nome(`cl:peca_${peca}_${m}`));
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  const mat = opcoes[r.selection];
  const fontes = materiaisNaMochila(j).get(mat) ?? [];
  if (fontes.reduce((s, f) => s + f.qtd, 0) < custo) return;
  tirar(j, fontes, custo);
  darAoJogador(j, new ItemStack(`cl:peca_${peca}_${mat}`, 1));
  j.playSound("dig.stone", { pitch: 1.4 });
  aviso(j, { translate: "cl.tc.pecas_feita", with: { rawtext: [nome(`cl:peca_${peca}_${mat}`)] } });
  registrarAcao(j, "peca");
}

export const construtorPecasComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const id = itemNaMao(j)?.typeId ?? "";
    const peca = id.startsWith("cl:padrao_") ? id.slice("cl:padrao_".length) : "";
    if (!PECAS[peca]) return aviso(j, "cl.tc.pecas_como");
    abrirUmMenu(j, () => construtor(j, peca));
  },
};

// ---------- Estação de Ferramentas ----------
/** Materiais das peças `peca` que estão na mochila. */
function pecasNaMochila(j: Player, peca: string): Mat[] {
  return MATS.filter((m) => contarNoInventario(j, `cl:peca_${peca}_${m}`) > 0);
}

async function escolherMat(j: Player, peca: string, opcoes: Mat[]): Promise<Mat | undefined> {
  if (opcoes.length === 1) return opcoes[0];
  const form = new ActionFormData().title({ translate: "cl.tc.estacao_titulo" }).body({ translate: "cl.tc.escolher", with: { rawtext: [{ translate: `cl.tc.peca.${peca}` }] } });
  for (const m of opcoes) form.button(nome(`cl:peca_${peca}_${m}`));
  const r = await form.show(j);
  return r.canceled || r.selection === undefined ? undefined : opcoes[r.selection];
}

async function montar(j: Player): Promise<void> {
  const possiveis = TIPOS.filter((t) => FERR[t].pecas.every((p) => pecasNaMochila(j, p).length > 0));
  if (possiveis.length === 0) return aviso(j, "cl.tc.sem_pecas", 6);
  const form = new ActionFormData().title({ translate: "cl.tc.estacao_titulo" }).body({ translate: "cl.tc.montar_corpo" });
  for (const t of possiveis) form.button({ translate: `cl.tc.ferr.${t}` });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  const tipo: Tipo = possiveis[r.selection];
  const escolhidos: Mat[] = [];
  for (const p of FERR[tipo].pecas) {
    const m = await escolherMat(j, p, pecasNaMochila(j, p));
    if (!m) return;
    escolhidos.push(m);
  }
  const pecas = FERR[tipo].pecas;
  if (!pecas.every((p, k) => contarNoInventario(j, `cl:peca_${p}_${escolhidos[k]}`) > 0)) return;
  pecas.forEach((p, k) => tirarDoInventario(j, `cl:peca_${p}_${escolhidos[k]}`, 1));
  // Ordem das peças: cabeça, (ligação ou guarda), cabo.
  const cabeca = escolhidos[0], cabo = escolhidos[escolhidos.length - 1];
  const lig = pecas.length === 3 ? escolhidos[1] : undefined;
  const ferramenta = criarFerramenta(tipo, cabeca, cabo, lig);
  darAoJogador(j, ferramenta);
  j.playSound("random.anvil_use", { volume: 0.6 });
  aviso(j, { translate: "cl.tc.montou", with: { rawtext: [nome(ferramenta.typeId)] } });
  registrarAcao(j, "montar_ferramenta");
}

/** Item que conserta a ferramenta: o mesmo material da cabeça. */
function itemDeConserto(mat: Mat): string {
  return mat === "madeira" ? "minecraft:oak_planks" : TINKERS.consertoCom[mat];
}

async function estacao(j: Player): Promise<void> {
  const mao = itemNaMao(j);
  const f = ferramentaDe(mao?.typeId);
  if (!mao || !f) return montar(j);
  const reparo = itemDeConserto(f.mat);
  const form = new ActionFormData()
    .title({ translate: "cl.tc.estacao_titulo" })
    .button({ translate: "cl.tc.consertar", with: { rawtext: [nome(reparo)] } })
    .button({ translate: "cl.tc.modificar" })
    .button({ translate: "cl.tc.montar" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection === 2) return montar(j);
  if (r.selection === 1) return modificar(j);
  // Consertar: cada item do material devolve TINKERS.consertoPorItem do máximo.
  const atual = itemNaMao(j);
  if (!atual || atual.typeId !== mao.typeId) return;
  const { dur, max } = durabilidade(atual);
  if (dur >= max) return aviso(j, "cl.tc.cheia");
  const porItem = Math.max(1, Math.round(max * TINKERS.consertoPorItem));
  const precisa = Math.ceil((max - dur) / porItem);
  const tem = f.mat === "madeira" ? planksNaMochila(j) : contarNoInventario(j, reparo);
  const usa = Math.min(precisa, tem);
  if (usa <= 0) return aviso(j, { translate: "cl.tc.sem_material", with: { rawtext: [nome(reparo)] } });
  if (f.mat === "madeira") tirarPlanks(j, usa);
  else tirarDoInventario(j, reparo, usa);
  const ganho = consertar(atual, usa * porItem);
  trocarMao(j, atual);
  j.playSound("random.anvil_use", { volume: 0.6 });
  aviso(j, { translate: "cl.tc.consertou", with: [String(ganho)] });
  registrarAcao(j, "consertar");
}

function planksNaMochila(j: Player): number {
  const inv = j.getComponent("minecraft:inventory")?.container;
  let n = 0;
  if (inv) for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p?.typeId.endsWith("_planks")) n += p.amount;
  }
  return n;
}

function tirarPlanks(j: Player, qtd: number): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  for (let s = 0; s < inv.size && qtd > 0; s++) {
    const p = inv.getItem(s);
    if (!p?.typeId.endsWith("_planks")) continue;
    const n = Math.min(qtd, p.amount);
    qtd -= n;
    if (n === p.amount) inv.setItem(s, undefined);
    else {
      p.amount -= n;
      inv.setItem(s, p);
    }
  }
}

function trocarMao(j: Player, i: ItemStack): void {
  j.getComponent("minecraft:inventory")?.container?.setItem(j.selectedSlotIndex, i);
}

// ---------- Modificadores (Fase 16) ----------
type Modificador = { item: string; qtd: number; max: number };
async function modificar(j: Player): Promise<void> {
  const mao = itemNaMao(j);
  if (!mao || !ferramentaDe(mao.typeId)) return;
  const espacos = (mao.getDynamicProperty("tc:esp") as number | undefined) ?? 0;
  const mods: Mods = modsDe(mao);
  const lista = Object.entries(TINKERS.modificadores as Readonly<Record<string, Modificador>>);
  const form = new ActionFormData()
    .title({ translate: "cl.tc.modificar" })
    .body({ translate: "cl.tc.mod_corpo", with: [String(espacos)] });
  for (const [m, d] of lista)
    form.button({ rawtext: [{ translate: `cl.tc.mod.${m}` }, { text: ` §8(${d.qtd}x ` }, nome(d.item), { text: `, ${mods[m] ?? 0}/${d.max})` }] });
  form.button({ translate: "cl.tc.voltar" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined || r.selection >= lista.length) return;
  const [m, d] = lista[r.selection];
  const atual = itemNaMao(j);
  if (!atual || atual.typeId !== mao.typeId) return;
  if ((mods[m] ?? 0) >= d.max) return aviso(j, "cl.tc.mod_max");
  if (espacos <= 0) return aviso(j, "cl.tc.mod_sem_espaco");
  if (contarNoInventario(j, d.item) < d.qtd) return aviso(j, { translate: "cl.tc.sem_material", with: { rawtext: [nome(d.item)] } });
  tirarDoInventario(j, d.item, d.qtd);
  mods[m] = (mods[m] ?? 0) + 1;
  atual.setDynamicProperty("tc:mods", JSON.stringify(mods));
  atual.setDynamicProperty("tc:esp", espacos - 1);
  recalcular(atual);
  trocarMao(j, atual);
  j.playSound("random.orb");
  aviso(j, { translate: "cl.tc.mod_feito", with: { rawtext: [{ translate: `cl.tc.mod.${m}` }] } });
  registrarAcao(j, "modificar");
}

export const estacaoFerramentasComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) abrirUmMenu(j, () => estacao(j));
  },
};

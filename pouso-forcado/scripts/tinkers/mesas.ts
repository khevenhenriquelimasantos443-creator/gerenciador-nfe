import { BlockCustomComponent, ItemStack, Player, RawMessage, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { TINKERS } from "../config.js";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { contarNoInventario, registrarAcao, tirarDoInventario } from "../missoes/progresso.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { Mat, Mods, Tipo, TIPOS, consertar, criarFerramenta, durabilidade, ferramentaDe, habDe, modsDe, recalcular } from "./ferramenta.js";
import { slimeMax, tracosDe } from "./tracos.js";

/*
 * As três mesas do Tinkers' Construct (Fase 15). Tudo pelo toque com o item na mão + menus:
 * - Mesa de Moldes: Padrão em Branco na mão -> escolhe o padrão de peça.
 * - Construtor de Peças, Estação de Ferramentas e Bigorna: desde a 1.56.0 têm tela de espaços (telas_tc.ts); os menus
 *   daqui (montar com as peças da mochila, consertar, modificar, traços) abrem com agachado + tocar na Estação/Bigorna.
 */
export const PECAS = DADOS_F15.pecas as Readonly<Record<string, { custo: number; stat: string }>>;
export const FERR = DADOS_F15.ferramentas as unknown as Readonly<Record<string, { pecas: readonly string[] }>>;
// 1.26.0: que materiais fazem cada peça (Tinkers 3), quem é metal e os traços (para a tela de traços).
export const PECA_MATS = DADOS_F15.pecaMats as unknown as Readonly<Record<string, readonly string[]>>;
const MATS = Object.keys(DADOS_F15.materiais) as Mat[];
export const METAL = (m: string) => !!(DADOS_F15.materiais as unknown as Readonly<Record<string, { metal?: boolean }>>)[m]?.metal;
// Itens que valem menos de uma unidade de material (TC3: 4 linhas = 1, 2 peles de coelho = 1).
export const UNIDADE: Readonly<Record<string, number>> = { "minecraft:string": 0.25, "minecraft:rabbit_hide": 0.5 };
const nome = (id: string): RawMessage => ({ translate: `item.${id}.name` });

export function materialDoItem(id: string): Mat | undefined {
  if (id.endsWith("_planks")) return "madeira";
  return TINKERS.materialDeItem[id] as Mat | undefined;
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

async function montar(j: Player, naBigorna = false): Promise<void> {
  const todas = TIPOS.filter((t) => FERR[t].pecas.every((p) => pecasNaMochila(j, p).length > 0));
  // 1.30.0 (TC3): a Estação de Ferramentas monta até 3 peças; as de 4 peças só na Bigorna do Tinker.
  const possiveis = naBigorna ? todas : todas.filter((t) => FERR[t].pecas.length <= 3);
  if (possiveis.length === 0) return aviso(j, todas.length ? "cl.tc.precisa_bigorna" : "cl.tc.sem_pecas", 6);
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
  // 1.26.0 (TC3): a cabeça é a primeira peça; o cabo, a primeira peça de cabo; a ligação, a primeira de ligação.
  const cabeca = escolhidos[0];
  const kCabo = pecas.findIndex((p) => PECAS[p]?.stat === "handle");
  const kLig = pecas.findIndex((p, k) => k > 0 && PECAS[p]?.stat === "binding");
  const cabo = kCabo >= 0 ? escolhidos[kCabo] : escolhidos[escolhidos.length - 1];
  const lig = kLig >= 0 ? escolhidos[kLig] : undefined;
  const ferramenta = criarFerramenta(tipo, cabeca, cabo, lig);
  darAoJogador(j, ferramenta);
  j.playSound("random.anvil_use", { volume: 0.6 });
  aviso(j, { translate: "cl.tc.montou", with: { rawtext: [nome(ferramenta.typeId)] } });
  registrarAcao(j, "montar_ferramenta");
}

/** Item que conserta a ferramenta: o mesmo material da cabeça. */
export function itemDeConserto(mat: Mat): string {
  return mat === "madeira" ? "minecraft:oak_planks" : TINKERS.consertoCom[mat];
}

export async function estacao(j: Player): Promise<void> {
  const mao = itemNaMao(j);
  const f = ferramentaDe(mao?.typeId);
  if (!mao || !f) return montar(j);
  const reparo = itemDeConserto(f.mat);
  const form = new ActionFormData()
    .title({ translate: "cl.tc.estacao_titulo" })
    .button({ translate: "cl.tc.consertar", with: { rawtext: [nome(reparo)] } })
    .button({ translate: "cl.tc.modificar" })
    .button({ translate: "cl.tc.montar" })
    .button({ translate: "cl.tc.tracos" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection === 3) return verTracos(j, mao, f.tipo, f.mat);
  if (r.selection === 2) return montar(j);
  if (r.selection === 1) return modificar(j);
  // Consertar: cada item do material devolve TINKERS.consertoPorItem do máximo.
  const atual = itemNaMao(j);
  if (!atual || atual.typeId !== mao.typeId) return;
  const { dur, max } = durabilidade(atual);
  if (dur >= max) return aviso(j, "cl.tc.cheia");
  const porItem = porItemConserto(atual, f.tipo, f.mat);
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

/** Quanto cada item do material da cabeça conserta. Cultivado (madeira) e Preservado (madeira tratada): 50% a mais. */
export function porItemConserto(i: ItemStack, tipo: Tipo, mat: Mat): number {
  const bonus = ["cultivated", "preserved"].some((t) => tracosDe(i, tipo, mat).has(t)) ? 1.5 : 1;
  return Math.max(1, Math.round(durabilidade(i).max * TINKERS.consertoPorItem * bonus));
}

/** 1.26.0: os traços da ferramenta com a descrição do Tinkers' Construct 3. */
async function verTracos(j: Player, i: ItemStack, tipo: string, mat: string): Promise<void> {
  const t = tracosDe(i, tipo, mat);
  const corpo: RawMessage[] = [{ translate: "cl.tc.tracos_corpo" }, { text: "\n" }];
  for (const [nome, n] of t) corpo.push({ text: "\n§d" }, { translate: `cl.tc.traco.${nome}` }, { text: n > 1 ? ` ${"I".repeat(n)}` : "" }, { text: "§r: " }, { translate: `cl.tc.tracodesc.${nome}` });
  await new ActionFormData().title({ translate: "cl.tc.tracos" }).body({ rawtext: corpo }).button({ translate: "cl.tc.voltar" }).show(j);
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

// ---------- Modificadores (Fase 16; 1.30.0 com os do TC3) ----------
export type Modificador = {
  item: string; qtd: number; max: number; tipo?: "habilidade" | "livre";
  itens?: readonly (readonly [string, number])[]; niveis?: readonly (readonly (readonly [string, number])[])[];
};
export const MODS = TINKERS.modificadores as unknown as Readonly<Record<string, Modificador>>;
/** O que o próximo nível pede. */
export function receitaDe(d: Modificador, nivel: number): readonly (readonly [string, number])[] {
  if (d.niveis) return d.niveis[Math.min(nivel, d.niveis.length - 1)];
  return d.itens ?? [[d.item, d.qtd]];
}
const ingrediente = (r: readonly (readonly [string, number])[]): RawMessage[] =>
  r.flatMap(([id, n], k) => [{ text: `${k ? ", " : ""}${n}x ` }, nome(id)]);

async function modificar(j: Player, naBigorna = false): Promise<void> {
  const mao = itemNaMao(j);
  const f = ferramentaDe(mao?.typeId);
  if (!mao || !f) return;
  const espacos = (mao.getDynamicProperty("tc:esp") as number | undefined) ?? 0;
  const hab = habDe(mao, f.tipo);
  const mods: Mods = modsDe(mao);
  const lista = Object.entries(MODS);
  const form = new ActionFormData()
    .title({ translate: naBigorna ? "cl.tc.bigorna_titulo" : "cl.tc.modificar" })
    .body({ rawtext: [{ translate: "cl.tc.mod_corpo", with: [String(espacos)] }, { text: "\n" }, { translate: "cl.tc.habilidades", with: [String(hab)] }] });
  for (const [m, d] of lista) {
    const r = receitaDe(d, mods[m] ?? 0);
    form.button({
      rawtext: [
        { translate: `cl.tc.mod.${m}` }, ...(d.tipo === "habilidade" ? [{ text: " " }, { translate: "cl.tc.mod_habilidade" }] : []),
        { text: "\n§7" }, ...ingrediente(r), { text: ` §8${mods[m] ?? 0}/${d.max}` },
        ...(!naBigorna && r.length > 3 ? [{ text: " " }, { translate: "cl.tc.mod_bigorna" }] : []),
      ],
    });
  }
  form.button({ translate: "cl.tc.voltar" });
  const res = await form.show(j);
  if (res.canceled || res.selection === undefined || res.selection >= lista.length) return;
  const atual = itemNaMao(j);
  if (!atual || atual.typeId !== mao.typeId) return;
  aplicarModificador(j, atual, lista[res.selection][0], naBigorna);
}

export type Gasto = (readonly [string, number])[];
/**
 * Aplica o modificador `m` em `atual` (mexe no item), se `tem(id)` cobre a receita. Devolve o que gastar ou o erro.
 * Usado pela tela da Estação/Bigorna (1.56.0) e pelo menu antigo.
 */
export function modificarItem(atual: ItemStack, m: string, naBigorna: boolean, tem: (id: string) => number): { gasto: Gasto } | { erro: RawMessage | string } {
  const f = ferramentaDe(atual.typeId);
  const d = MODS[m];
  if (!f || !d) return { erro: "cl.tc.mod_max" };
  durabilidade(atual); // completa a ferramenta feita na bancada
  const espacos = (atual.getDynamicProperty("tc:esp") as number | undefined) ?? 0;
  const hab = habDe(atual, f.tipo);
  const mods: Mods = modsDe(atual);
  const nivel = mods[m] ?? 0;
  const r = receitaDe(d, nivel);
  // TC3: a Estação tem 3 espaços de item; receita maior só na Bigorna.
  if (!naBigorna && r.length > 3) return { erro: "cl.tc.precisa_bigorna" };
  // Slime extra (livre): cada bola dá 25 de slime, sem gastar espaço.
  if (m === "slime") {
    if (tem(d.item) < 1) return { erro: { translate: "cl.tc.sem_material", with: { rawtext: [nome(d.item)] } } };
    mods.slime = 1;
    atual.setDynamicProperty("tc:mods", JSON.stringify(mods));
    const max = slimeMax(atual, tracosDe(atual, f.tipo, f.mat));
    const agora = (atual.getDynamicProperty("tc:slime") as number | undefined) ?? 0;
    if (agora >= max) return { erro: "cl.tc.mod_max" };
    const bolas = Math.min(tem(d.item), Math.ceil((max - agora) / 25));
    atual.setDynamicProperty("tc:slime", Math.min(max, agora + 25 * bolas));
    recalcular(atual);
    return { gasto: [[d.item, bolas]] };
  }
  if (nivel >= d.max) return { erro: "cl.tc.mod_max" };
  if (d.tipo === "habilidade" && hab <= 0) return { erro: "cl.tc.mod_sem_habilidade" };
  if (d.tipo !== "habilidade" && espacos <= 0) return { erro: "cl.tc.mod_sem_espaco" };
  const falta = r.find(([id, n]) => tem(id) < n);
  if (falta) return { erro: { translate: "cl.tc.sem_material", with: { rawtext: [nome(falta[0])] } } };
  mods[m] = nivel + 1;
  atual.setDynamicProperty("tc:mods", JSON.stringify(mods));
  if (d.tipo === "habilidade") atual.setDynamicProperty("tc:hab", hab - 1);
  else atual.setDynamicProperty("tc:esp", espacos - 1);
  recalcular(atual);
  return { gasto: r.map(([id, n]) => [id, n] as const) };
}

/** Aplica o modificador `m` na ferramenta `atual` (a da mão), pagando com a mochila. Devolve se aplicou. */
export function aplicarModificador(j: Player, atual: ItemStack, m: string, naBigorna: boolean): boolean {
  const res = modificarItem(atual, m, naBigorna, (id) => contarNoInventario(j, id));
  if ("erro" in res) {
    aviso(j, res.erro);
    return false;
  }
  for (const [id, n] of res.gasto) tirarDoInventario(j, id, n);
  if (MODS[m]?.tipo === "habilidade") registrarAcao(j, "tc3_habilidade");
  concluir(j, atual, m, MODS[m]);
  return true;
}
function concluir(j: Player, atual: ItemStack, m: string, _d: Modificador): void {
  recalcular(atual);
  trocarMao(j, atual);
  j.playSound("random.orb");
  aviso(j, { translate: "cl.tc.mod_feito", with: { rawtext: [{ translate: `cl.tc.mod.${m}` }] } });
  registrarAcao(j, "modificar");
}

/** 1.30.0: Bigorna do Tinker: tudo da Estação, mais as ferramentas de 4 peças e os modificadores grandes. */
export async function bigorna(j: Player): Promise<void> {
  const mao = itemNaMao(j);
  const f = ferramentaDe(mao?.typeId);
  if (!mao || !f) return montar(j, true);
  const form = new ActionFormData()
    .title({ translate: "cl.tc.bigorna_titulo" })
    .button({ translate: "cl.tc.modificar" })
    .button({ translate: "cl.tc.montar" })
    .button({ translate: "cl.tc.tracos" })
    .button({ translate: "cl.tc.consertar_estacao" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection === 0) return modificar(j, true);
  if (r.selection === 1) return montar(j, true);
  if (r.selection === 2) return verTracos(j, mao, f.tipo, f.mat);
  return estacao(j);
}
/** 1.30.0: Mesa de Modificadores (TC3 Modifier Worktable): tira um modificador com uma esponja molhada; o espaço volta. */
async function mesaModificadores(j: Player): Promise<void> {
  const mao = itemNaMao(j);
  const f = ferramentaDe(mao?.typeId);
  if (!mao || !f) return aviso(j, "cl.tc.sem_ferramenta");
  const mods = modsDe(mao);
  const lista = Object.entries(mods).filter(([, n]) => n > 0);
  if (!lista.length) return aviso(j, "cl.tc.sem_modificadores");
  const form = new ActionFormData().title({ translate: "tile.cl:mesa_modificadores.name" }).body({ translate: "cl.tc.remover" });
  for (const [m, n] of lista) form.button({ rawtext: [{ translate: `cl.tc.mod.${m}` }, { text: ` §8${n}` }] });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  const [m, n] = lista[r.selection];
  const atual = itemNaMao(j);
  if (!atual || atual.typeId !== mao.typeId) return;
  if (contarNoInventario(j, "minecraft:wet_sponge") < 1) return aviso(j, "cl.tc.sem_esponja");
  tirarDoInventario(j, "minecraft:wet_sponge", 1);
  darAoJogador(j, new ItemStack("minecraft:sponge", 1));
  const novo = { ...modsDe(atual) };
  delete novo[m];
  atual.setDynamicProperty("tc:mods", JSON.stringify(novo));
  const d = MODS[m];
  if (m === "slime") atual.setDynamicProperty("tc:slime", 0);
  else if (d?.tipo === "habilidade") atual.setDynamicProperty("tc:hab", habDe(atual, f.tipo) + n);
  else if (d) atual.setDynamicProperty("tc:esp", ((atual.getDynamicProperty("tc:esp") as number | undefined) ?? 0) + n);
  recalcular(atual);
  trocarMao(j, atual);
  j.playSound("random.anvil_use", { volume: 0.5 });
  aviso(j, { translate: "cl.tc.removeu", with: { rawtext: [{ translate: `cl.tc.mod.${m}` }] } });
}
/** Teste no servidor (o jogador simulado não responde menu): scriptevent cl:teste_tc_mod <mod>[,<mod>...] [bigorna]. */
export function registrarTesteModificadores(): void {
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_tc_mod" || !(j instanceof Player)) return;
    const [lista, onde] = message.split(" ");
    const i = itemNaMao(j);
    if (!i) return;
    const res = lista.split(",").map((m) => `${m}=${aplicarModificador(j, i, m, onde === "bigorna")}`);
    console.warn(`[teste_tc_mod] ${res.join(" ")} mods=${i.getDynamicProperty("tc:mods")} hab=${i.getDynamicProperty("tc:hab")} esp=${i.getDynamicProperty("tc:esp")}`);
  });
}

export const mesaModificadoresComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) abrirUmMenu(j, () => mesaModificadores(j));
  },
};

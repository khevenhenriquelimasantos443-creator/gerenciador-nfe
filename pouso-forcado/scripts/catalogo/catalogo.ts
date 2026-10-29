import { ItemStack, Player, RawMessage, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import {
  AGUAS, BARRIL, BARRIL_COMPOSTO, CADINHO, CAPSULA, CATALOGO, FOLHAS, FOME, MARTELO, MARTELOS, SEDA, CIDADE_SAQUE, COMPOSTOR_CHEIO, COMPOSTOR_PONTOS, CONDENSADOR_AVANCADO, CONDENSADOR_SEGUNDOS,
  DESTROCOS_SAQUE, ENERGIA, GERADOR_MONSTROS, IDS, JUNTA_MODS, LinhaSaque, MASMORRA_FUNDA_SAQUE, MASMORRA_SAQUE, MODS, MONTADORA, ORIGEM_MOD,
  PENEIRA, SACOLAS, SEDE, SISTEMAS_NAVE, TEMPLO_SAQUE, TORRE_SAQUE,
} from "../config.js";
import { chancesDaSacola } from "../missoes/sacolas.js";
import { rf } from "../util/energia.js";
import { abrirUmMenu } from "../util/menus.js";
import { DROPS, ITENS, RECEITAS_JSON } from "./gerado.js";

/*
 * Catálogo (no estilo do JEI): começa pelos mods (como as abas do JEI), cada um com a lista dos seus itens;
 * busca por nome (ou "@mod") em todos. Para cada
 * item as receitas ("como fazer") e os usos ("onde usar"). Tocar num ingrediente abre o dele.
 * Fontes: receitas de bancada e fornalha e drops dos monstros (gerado.ts, feito no build) e as
 * tabelas das máquinas do config.ts (peneira, compostor, montadora, gerador, saques, sacolas...).
 * O índice é montado só na primeira vez que alguém abre o Catálogo.
 * Atalhos: usar o Catálogo agachado mostra o bloco que você está olhando (ou o último item que
 * você segurou). A bancada do jogo já preenche a grade sozinha pelo livro de receitas.
 */

type Linha = { item: string; qtd: number; chance?: number; max?: number };
export type Receita = {
  maquina: RawMessage;
  maquinaId?: string; // item/bloco que faz a receita (o "uso" dele)
  entradas: Linha[];
  saidas: Linha[];
  grade?: { linhas: ReadonlyArray<string>; chaves: Readonly<Record<string, string>> };
  nota?: RawMessage;
};

// Grupos de itens das receitas ("qualquer tábua"): exemplo para ícone e navegação.
const GRUPOS: Readonly<Record<string, { exemplo: string; nome: string }>> = {
  "#minecraft:planks": { exemplo: "minecraft:oak_planks", nome: "cl.catalogo.qualquer_tabua" },
  "#minecraft:stone_crafting_materials": { exemplo: "minecraft:cobblestone", nome: "cl.catalogo.qualquer_pedra" },
};
const real = (id: string): string => GRUPOS[id]?.exemplo ?? id;

export function nomeDe(id: string): RawMessage {
  const g = GRUPOS[id];
  if (g) return { translate: g.nome };
  try {
    return { translate: new ItemStack(id).localizationKey };
  } catch {
    return { text: ITENS[id]?.pt ?? id };
  }
}

export const iconeDe = (id: string): string | undefined => ITENS[real(id)]?.icone;
export const origemDe = (id: string): string => ORIGEM_MOD[id] ?? (id.startsWith("minecraft:") ? "Minecraft" : "Pouso Forçado");
/** O mod em que o item aparece no Catálogo e no inventário criativo (os pequenos entram no maior). */
const modDe = (id: string): string => JUNTA_MODS[origemDe(id)] ?? origemDe(id);

// ---------- índice ----------
let todas: Receita[] | undefined;
const usosExtras: Array<[string, string]> = []; // [item, máquina]: o item também mostra os usos da máquina (todos os martelos)
const comoFazer = new Map<string, Receita[]>();
const usos = new Map<string, Receita[]>();

function saque(chave: string, tabela: ReadonlyArray<LinhaSaque>): Receita {
  return { maquina: { translate: chave }, entradas: [], saidas: tabela.map((l) => ({ item: l.item, qtd: l.min, max: l.max, chance: l.chance })) };
}

function montar(): Receita[] {
  const r: Receita[] = [];
  const BANCADA = "minecraft:crafting_table";
  for (const j of RECEITAS_JSON) {
    const saidas = [{ item: j.resultado, qtd: j.qtd }];
    // Utensílios do HarvestCraft: a receita com a tag "cl_panela" sai na Panela (bloco cl:panela).
    const tagCl = j.estacoes.find((t) => t.startsWith("cl_"));
    const estacao = tagCl ? `cl:${tagCl.slice(3)}` : BANCADA;
    if (j.tipo === "fornalha") {
      r.push({
        maquina: { rawtext: j.estacoes.map((t, k) => ({ rawtext: [{ text: k ? " / " : "" }, nomeDe(`minecraft:${t}`)] })) },
        maquinaId: "minecraft:furnace",
        entradas: [...(j.ingredientes ?? [])],
        saidas,
      });
    } else if (j.grade && j.chaves) {
      const conta = new Map<string, number>();
      for (const linha of j.grade) for (const ch of linha) if (ch !== " ") conta.set(j.chaves[ch], (conta.get(j.chaves[ch]) ?? 0) + 1);
      r.push({ maquina: nomeDe(estacao), maquinaId: estacao, entradas: [...conta].map(([item, qtd]) => ({ item, qtd })), saidas, grade: { linhas: j.grade, chaves: j.chaves } });
    } else {
      r.push({ maquina: nomeDe(estacao), maquinaId: estacao, entradas: [...(j.ingredientes ?? [])], saidas, nota: { translate: "cl.catalogo.sem_forma" } });
    }
  }
  for (const [bloco, tabela] of Object.entries(PENEIRA)) {
    r.push({
      maquina: nomeDe(IDS.peneira), maquinaId: IDS.peneira,
      entradas: [{ item: bloco, qtd: 1 }],
      saidas: tabela.map((a) => ({ item: a.item, qtd: 1, max: a.max, chance: a.chance })),
      nota: { translate: "cl.catalogo.peneira_nota", with: { rawtext: [nomeDe(IDS.peneiraAutomatica)] } },
    });
  }
  for (const [item, pontos] of Object.entries(COMPOSTOR_PONTOS)) {
    r.push({
      maquina: nomeDe(IDS.compostor), maquinaId: IDS.compostor,
      entradas: [{ item, qtd: 1 }], saidas: [{ item: "minecraft:dirt", qtd: 1 }],
      nota: { translate: "cl.catalogo.compostor_nota", with: [String(pontos), String(COMPOSTOR_CHEIO)] },
    });
  }
  for (const m of MONTADORA) {
    r.push({
      maquina: nomeDe(IDS.montadora), maquinaId: IDS.montadora,
      entradas: m.ingredientes.map(({ item, qtd }) => ({ item, qtd })), saidas: [{ item: m.resultado, qtd: m.quantidade }],
      nota: { translate: "cl.catalogo.energia", with: [rf(m.energia)] },
    });
  }
  for (const [item, ciclos] of Object.entries(ENERGIA.combustivel)) {
    r.push({
      maquina: nomeDe(IDS.gerador), maquinaId: IDS.gerador, entradas: [{ item, qtd: 1 }], saidas: [],
      nota: { translate: "cl.catalogo.combustivel", with: [rf(ciclos * ENERGIA.geradorPorCiclo)] },
    });
  }
  r.push({
    maquina: nomeDe(IDS.condensadorAgua), maquinaId: IDS.condensadorAgua,
    entradas: [{ item: "minecraft:bucket", qtd: 1 }], saidas: [{ item: "minecraft:water_bucket", qtd: 1 }],
    nota: { translate: "cl.catalogo.condensador", with: [String(CONDENSADOR_SEGUNDOS)] },
  });
  r.push({
    maquina: nomeDe(IDS.condensadorAvancado), maquinaId: IDS.condensadorAvancado,
    entradas: [{ item: "minecraft:bucket", qtd: 1 }], saidas: [{ item: "minecraft:water_bucket", qtd: 1 }],
    nota: { translate: "cl.catalogo.condensador_avancado", with: [String(CONDENSADOR_AVANCADO.segundos), String(CONDENSADOR_AVANCADO.capacidade)] },
  });
  for (const sis of SISTEMAS_NAVE) {
    r.push({
      maquina: nomeDe(IDS.painelNave), maquinaId: IDS.painelNave,
      entradas: sis.pecas.map(({ item, qtd }) => ({ item, qtd })), saidas: [],
      nota: { rawtext: [{ translate: "cl.nave.consertar" }, { text: " " }, { translate: `cl.nave.sistema.${sis.id}` }] },
    });
  }
  for (const d of DROPS) {
    const ja = r.find((x) => x.maquinaId === d.fonte);
    const linha = { item: d.item, qtd: d.min, max: d.max, chance: d.chance };
    if (ja) ja.saidas.push(linha);
    else r.push({ maquina: { translate: `entity.${d.fonte}.name` }, maquinaId: d.fonte, entradas: [], saidas: [linha], nota: { translate: "cl.catalogo.drop" } });
  }
  SACOLAS.forEach((sacola, tipo) => r.push(receitaSacola(sacola, tipo)));
  r.push(saque("cl.catalogo.saque_cidade", CIDADE_SAQUE), saque("cl.catalogo.saque_torre", TORRE_SAQUE));
  r.push(saque("cl.catalogo.saque_masmorra", MASMORRA_SAQUE), saque("cl.catalogo.saque_masmorra_funda", MASMORRA_FUNDA_SAQUE));
  r.push(saque("cl.catalogo.saque_destrocos", DESTROCOS_SAQUE), saque("cl.catalogo.saque_templo", TEMPLO_SAQUE));
  r.push(saque("cl.catalogo.saque_capsula", CAPSULA.saque), saque("cl.catalogo.saque_gerador", GERADOR_MONSTROS.saque));
  // Ex Nihilo: martelo, barril, cadinho, cajado e seda.
  for (const [bloco, tabela] of Object.entries(MARTELO)) {
    r.push({
      maquina: { translate: "cl.catalogo.martelo" }, maquinaId: "cl:martelo_madeira",
      entradas: [{ item: bloco, qtd: 1 }], saidas: tabela.map((a) => ({ item: a.item, qtd: 1, chance: a.chance })),
      nota: { translate: "cl.catalogo.martelo_nota" },
    });
  }
  for (const m of Object.keys(MARTELOS)) usosExtras.push([m, "cl:martelo_madeira"]);
  for (const [item, valor] of Object.entries(BARRIL_COMPOSTO)) {
    r.push({
      maquina: nomeDe(IDS.barrilMadeira), maquinaId: IDS.barrilMadeira, entradas: [{ item, qtd: 1 }], saidas: [{ item: "minecraft:dirt", qtd: 1 }],
      nota: { translate: "cl.catalogo.barril_composto", with: [`${String(Math.round(valor * 1000) / 10).replace(".", ",")}%`, String(BARRIL.compostoTicks / 20)] },
    });
  }
  const balde = { agua: "minecraft:water_bucket", lava: "minecraft:lava_bucket" } as const;
  for (const x of BARRIL.receitas) {
    r.push({ maquina: nomeDe(x.fluido === "lava" ? IDS.barrilPedra : IDS.barrilMadeira), maquinaId: IDS.barrilMadeira, entradas: [{ item: balde[x.fluido], qtd: 1 }, { item: x.item, qtd: 1 }], saidas: [{ item: x.vira, qtd: 1 }], nota: { translate: "cl.catalogo.barril_receita" } });
  }
  for (const x of BARRIL.encontro) {
    r.push({ maquina: nomeDe(IDS.barrilPedra), maquinaId: IDS.barrilPedra, entradas: [{ item: balde[x.fluido], qtd: 1 }], saidas: [{ item: x.vira, qtd: 1 }], nota: { translate: `cl.catalogo.barril_encontro_${x.fluido}` } });
  }
  r.push({
    maquina: nomeDe(IDS.barrilMadeira), maquinaId: IDS.barrilMadeira, entradas: [{ item: "minecraft:water_bucket", qtd: 1 }, { item: "minecraft:milk_bucket", qtd: 1 }],
    saidas: [{ item: "minecraft:slime_ball", qtd: 1, max: 4 }], nota: { translate: "cl.catalogo.barril_slime", with: [String(BARRIL.leiteTicks / 20)] },
  });
  for (const [item, x] of Object.entries(CADINHO.entradas)) {
    r.push({
      maquina: nomeDe(IDS.cadinho), maquinaId: IDS.cadinho, entradas: [{ item, qtd: 1 }], saidas: [{ item: balde[x.fluido], qtd: 1 }],
      nota: { translate: "cl.catalogo.cadinho", with: [String(x.rende), x.fluido === "lava" ? "lava" : "água", String(x.ocupa)] },
    });
  }
  for (const folha of FOLHAS.slice(0, 5)) {
    r.push({ maquina: nomeDe(IDS.cajado), maquinaId: IDS.cajado, entradas: [{ item: folha, qtd: 1 }], saidas: [{ item: IDS.bichoSeda, qtd: 1, chance: SEDA.chanceFolha }], nota: { translate: "cl.catalogo.cajado" } });
  }
  r.push({
    maquina: nomeDe(IDS.folhaInfestada), maquinaId: IDS.bichoSeda, entradas: [{ item: IDS.bichoSeda, qtd: 1 }],
    saidas: [{ item: "minecraft:string", qtd: 1, max: 2, chance: SEDA.linha1 }, { item: IDS.bichoSeda, qtd: 1, chance: SEDA.chanceInfestada }],
    nota: { translate: "cl.catalogo.seda" },
  });
  const bebidas: Record<string, number> = { ...SEDE.bebidas };
  for (const [item, a] of Object.entries(AGUAS)) bebidas[item] = a.agua;
  for (const [item, [fome, mod]] of Object.entries(FOME.comidas)) {
    r.push({ maquina: { translate: "cl.catalogo.comer" }, entradas: [{ item, qtd: 1 }], saidas: [], nota: { translate: "cl.catalogo.fome", with: [String(fome), String(Math.round(fome * mod * 20) / 10).replace(".", ",")] } });
  }
  for (const [item, agua] of Object.entries(bebidas)) {
    r.push({ maquina: { translate: "cl.catalogo.beber" }, entradas: [{ item, qtd: 1 }], saidas: [], nota: { translate: "cl.catalogo.agua", with: [String(agua)] } });
  }
  return r;
}

function receitaSacola(sacola: string, tipo: number): Receita {
  const saidas: Linha[] = [];
  for (const g of chancesDaSacola(tipo)) for (const p of g.itens) saidas.push({ item: p.item, qtd: p.quantidade, chance: g.chance });
  return { maquina: nomeDe(sacola), maquinaId: sacola, entradas: [{ item: sacola, qtd: 1 }], saidas, nota: { translate: "cl.catalogo.sacola" } };
}

// Receitas das máquinas das Fases 15+ (cada módulo registra as suas ao carregar).
const extras: (() => Receita[])[] = [];
export function registrarNoCatalogo(fn: () => Receita[]): void {
  extras.push(fn);
}

function indice(): Receita[] {
  if (todas) return todas;
  todas = [...montar(), ...extras.flatMap((f) => f())];
  const add = (mapa: Map<string, Receita[]>, id: string, r: Receita) => {
    const lista = mapa.get(id) ?? [];
    if (!lista.includes(r)) lista.push(r);
    mapa.set(id, lista);
  };
  for (const r of todas) {
    for (const s of r.saidas) add(comoFazer, s.item, r);
    for (const e of r.entradas) add(usos, real(e.item), r);
    if (r.maquinaId) add(usos, r.maquinaId, r);
  }
  for (const [item, maquina] of usosExtras) for (const r of usos.get(maquina) ?? []) if (r.maquinaId === maquina) add(usos, item, r);
  return todas;
}

// ---------- telas ----------
const pct = (c: number) => (c >= 0.1 ? `${Math.round(c * 100)}%` : `${(c * 100).toFixed(1).replace(".", ",")}%`);

function textoLinha(l: Linha): RawMessage {
  const qtd = l.max && l.max > l.qtd ? `${l.qtd}-${l.max}` : String(l.qtd);
  const partes: RawMessage[] = [{ text: `${qtd}x ` }, nomeDe(l.item)];
  if (l.chance !== undefined && l.chance < 1) partes.push({ text: ` §7(${pct(l.chance)})§r` });
  return { rawtext: partes };
}

function corpoReceita(r: Receita, k: number, n: number): RawMessage {
  const t: RawMessage[] = [{ text: "§l" }, r.maquina, { text: `§r  §7(${k + 1}/${n})§r\n\n` }];
  if (r.grade) {
    for (const linha of r.grade.linhas) {
      t.push({ text: `§7[${[...linha.padEnd(3)].map((c) => (c === " " ? "  " : `§e${c}§7`)).join("][")}]§r\n` });
    }
    t.push({ text: "\n" });
    for (const [ch, item] of Object.entries(r.grade.chaves)) t.push({ text: `§e${ch}§r = ` }, nomeDe(item), { text: "\n" });
  } else if (r.entradas.length) {
    t.push({ translate: "cl.catalogo.entra" }, { text: "\n" });
    for (const e of r.entradas) t.push({ text: "  " }, textoLinha(e), { text: "\n" });
  }
  if (r.saidas.length) {
    t.push({ text: "\n" }, { translate: "cl.catalogo.sai" }, { text: "\n" });
    for (const s of r.saidas) t.push({ text: "  " }, textoLinha(s), { text: "\n" });
  }
  if (r.nota) t.push({ text: "\n§7" }, r.nota);
  return { rawtext: t };
}

async function verReceitas(jogador: Player, lista: Receita[], titulo: RawMessage, k = 0): Promise<void> {
  const r = lista[k];
  const ids = [...new Set([...(r.maquinaId ? [r.maquinaId] : []), ...r.entradas.map((e) => real(e.item)), ...r.saidas.map((s) => s.item)])];
  const acoes: Array<() => Promise<void>> = [];
  const form = new ActionFormData().title(titulo).body(corpoReceita(r, k, lista.length));
  if (k + 1 < lista.length) {
    form.button({ translate: "cl.catalogo.proxima" });
    acoes.push(() => verReceitas(jogador, lista, titulo, k + 1));
  }
  if (k > 0) {
    form.button({ translate: "cl.catalogo.anterior" });
    acoes.push(() => verReceitas(jogador, lista, titulo, k - 1));
  }
  for (const id of ids) {
    form.button(nomeDe(id), iconeDe(id));
    acoes.push(() => verItem(jogador, id));
  }
  form.button({ translate: "cl.diario.voltar" });
  const resp = await form.show(jogador);
  if (resp.selection === undefined || resp.selection >= acoes.length) return;
  await acoes[resp.selection]();
  // Voltar de um ingrediente ou de outra página traz de volta a esta receita.
  if (resp.selection >= (k + 1 < lista.length ? 1 : 0) + (k > 0 ? 1 : 0)) return verReceitas(jogador, lista, titulo, k);
}

export async function verItem(jogador: Player, id: string): Promise<void> {
  indice();
  const fazer = comoFazer.get(id) ?? [];
  const usar = usos.get(id) ?? [];
  const corpo: RawMessage = {
    rawtext: [
      { text: "§l" }, nomeDe(id), { text: `§r\n§9§o${origemDe(id)}§r\n§7${id}§r\n\n` },
      { translate: "cl.catalogo.resumo_item", with: [String(fazer.length), String(usar.length)] },
    ],
  };
  const acoes: Array<() => Promise<void>> = [];
  const form = new ActionFormData().title({ translate: "cl.catalogo.titulo" }).body(corpo);
  if (fazer.length) {
    form.button({ translate: "cl.catalogo.como_fazer", with: [String(fazer.length)] }, iconeDe("minecraft:crafting_table"));
    acoes.push(() => verReceitas(jogador, fazer, { translate: "cl.catalogo.como_fazer", with: [String(fazer.length)] }));
  }
  if (usar.length) {
    form.button({ translate: "cl.catalogo.onde_usar", with: [String(usar.length)] }, iconeDe(id));
    acoes.push(() => verReceitas(jogador, usar, { translate: "cl.catalogo.onde_usar", with: [String(usar.length)] }));
  }
  form.button({ translate: "cl.diario.voltar" });
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= acoes.length) return;
  await acoes[r.selection]();
  return verItem(jogador, id);
}

// ---------- lista e busca ----------
const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function listaOrdenada(filtro = "", mod?: string): string[] {
  const f = semAcento(filtro.trim());
  const ids = Object.keys(ITENS).filter((id) => {
    if (mod && modDe(id) !== mod) return false;
    if (!f) return true;
    if (f.startsWith("@")) return semAcento(origemDe(id)).startsWith(f.slice(1).trim());
    const i = ITENS[id];
    return semAcento(i.pt).includes(f) || semAcento(i.en).includes(f) || id.includes(f);
  });
  // Primeiro os do add-on, depois os do jogo; dentro de cada um, por nome.
  return ids.sort((a, b) => Number(a.startsWith("minecraft:")) - Number(b.startsWith("minecraft:")) || ITENS[a].pt.localeCompare(ITENS[b].pt));
}

async function procurar(jogador: Player): Promise<void> {
  const r = await new ModalFormData()
    .title({ translate: "cl.catalogo.procurar" })
    .textField({ translate: "cl.catalogo.procurar_rotulo" }, { translate: "cl.catalogo.procurar_exemplo" })
    .show(jogador);
  if (r.canceled || !r.formValues) return;
  const texto = String(r.formValues[0] ?? "");
  return listar(jogador, texto, 0);
}

async function barraRapida(jogador: Player): Promise<void> {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  const ids: string[] = [];
  for (let s = 0; s < 9; s++) {
    const p = inv?.getItem(s);
    if (p && !ids.includes(p.typeId)) ids.push(p.typeId);
  }
  const form = new ActionFormData().title({ translate: "cl.catalogo.barra" }).body({ translate: "cl.catalogo.barra_corpo" });
  for (const id of ids) form.button(nomeDe(id), iconeDe(id));
  form.button({ translate: "cl.diario.voltar" });
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= ids.length) return;
  await verItem(jogador, ids[r.selection]);
  return barraRapida(jogador);
}

async function listar(jogador: Player, filtro: string, pagina: number, mod?: string): Promise<void> {
  const ids = listaOrdenada(filtro, mod);
  const por = CATALOGO.porPagina;
  const paginas = Math.max(1, Math.ceil(ids.length / por));
  const p = Math.min(pagina, paginas - 1);
  const daPagina = ids.slice(p * por, p * por + por);
  const acoes: Array<() => Promise<void>> = [];
  const corpo: RawMessage = filtro
    ? { translate: "cl.catalogo.resultado", with: [filtro, String(ids.length)] }
    : { translate: "cl.catalogo.do_mod", with: [String(ids.length)] };
  const titulo = mod ? { text: `${mod}${paginas > 1 ? ` ${p + 1}/${paginas}` : ""}` } : { rawtext: [{ translate: "cl.catalogo.titulo" }, { text: ` ${p + 1}/${paginas}` }] };
  const form = new ActionFormData().title(titulo).body(corpo);
  if (p > 0) {
    form.button({ translate: "cl.catalogo.anterior" }, "textures/ui/arrow_dark_left_stretch");
    acoes.push(() => listar(jogador, filtro, p - 1, mod));
  }
  if (p + 1 < paginas) {
    form.button({ translate: "cl.catalogo.proxima" }, "textures/ui/arrow_dark_right_stretch");
    acoes.push(() => listar(jogador, filtro, p + 1, mod));
  }
  const fixos = acoes.length;
  for (const id of daPagina) {
    form.button(nomeDe(id), iconeDe(id));
    acoes.push(() => verItem(jogador, id));
  }
  form.button({ translate: "cl.diario.voltar" });
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= acoes.length) return;
  await acoes[r.selection]();
  // Páginas e buscas já abriram a tela seguinte; voltar de um item reabre esta página.
  if (r.selection >= fixos) return listar(jogador, filtro, p);
}

// Tela inicial: procurar, o que está na barra e um botão por mod (com quantos itens ele tem).
let contagem: Map<string, number> | undefined;
function itensPorMod(): Map<string, number> {
  if (contagem) return contagem;
  contagem = new Map();
  for (const id of Object.keys(ITENS)) contagem.set(modDe(id), (contagem.get(modDe(id)) ?? 0) + 1);
  return contagem;
}
export async function abrirCatalogo(jogador: Player): Promise<void> {
  const n = itensPorMod();
  const mods = [...MODS.map((m) => m.mod).filter((m) => n.has(m)), "Minecraft"];
  const form = new ActionFormData().title({ translate: "cl.catalogo.titulo" }).body({ translate: "cl.catalogo.inicio" });
  form.button({ translate: "cl.catalogo.procurar" }, "textures/ui/magnifyingGlass");
  form.button({ translate: "cl.catalogo.barra" }, iconeDe(IDS.organizador));
  for (const m of mods) {
    const icone = m === "Minecraft" ? iconeDe("minecraft:crafting_table") : MODS.find((x) => x.mod === m)?.icones.map(iconeDe).find(Boolean);
    form.button({ rawtext: [{ text: `${m}\n§7` }, { translate: "cl.catalogo.n_itens", with: [String(n.get(m) ?? 0)] }] }, icone);
  }
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection > mods.length + 1) return;
  if (r.selection === 0) await procurar(jogador);
  else if (r.selection === 1) await barraRapida(jogador);
  else await listar(jogador, "", 0, mods[r.selection - 2]);
  return abrirCatalogo(jogador);
}

const ultimoSegurado = new Map<string, string>();

/** Agachado: o bloco que o jogador está olhando, senão o último item que ele segurou. */
function atalho(jogador: Player): string | undefined {
  try {
    const bloco = jogador.getBlockFromViewDirection({ maxDistance: 6 })?.block;
    if (bloco && !bloco.isAir) return bloco.typeId;
  } catch {
    // fora do mundo carregado
  }
  return ultimoSegurado.get(jogador.id);
}

export function registrarCatalogo(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== IDS.catalogo) return;
    const alvo = source.isSneaking ? atalho(source) : undefined;
    abrirUmMenu(source, () => (alvo ? verItem(source, alvo) : abrirCatalogo(source)));
  });
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player, itemStack }) => {
    if (itemStack && itemStack.typeId !== IDS.catalogo && itemStack.typeId !== IDS.diarioBordo) ultimoSegurado.set(player.id, itemStack.typeId);
  });
}

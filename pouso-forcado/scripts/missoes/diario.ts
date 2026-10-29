import { Player, RawMessage, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { IDS, PROPS } from "../config.js";
import { abrirCatalogo, iconeDe } from "../catalogo/catalogo.js";
import { abrirOpcoes } from "../jogador/opcoes.js";
import { cidadeMaisProxima } from "../mundo/cidade.js";
import { CAPITULOS, Capitulo, MISSAO_POR_ID, MISSOES, Missao } from "./lista.js";
import {
  abertas, concluir, conferir, contar, darItens, desbloqueada, entregar, escolher, feita, feitoDe, lerEstado, nomeItem,
  textoPilhas, Estado,
} from "./progresso.js";
import { registrarSacolas } from "./sacolas.js";
import { abrirUmMenu } from "../util/menus.js";
import { intervalo } from "../util/perfil.js";

/*
 * Diário de Bordo 2.0 (no estilo do Hardcore Questing Mode): item que abre o livro de missões.
 * Menu: capítulos → missões do capítulo (feitas, abertas, bloqueadas) → detalhe da missão, com
 * "Entregar", "Escolher recompensa" e "Pular". Também abre o Catálogo e as Opções.
 * Cada jogador recebe um ao entrar pela primeira vez; se perder, faz outro (graveto + areia).
 * Custo: eventos de colocar/quebrar/matar/consumir só leem uma dynamic property; a cada 2 s, um
 * olhar no inventário de cada jogador para as missões "ter" abertas.
 */

// Monstros comuns, para o caso de a entidade já não responder a matches() depois de morrer.
const MONSTROS = new Set([
  "minecraft:zombie", "minecraft:husk", "minecraft:zombie_villager_v2", "minecraft:drowned", "minecraft:skeleton",
  "minecraft:stray", "minecraft:bogged", "minecraft:spider", "minecraft:cave_spider", "minecraft:creeper",
  "minecraft:slime", "minecraft:witch", "minecraft:enderman", "minecraft:phantom", "minecraft:silverfish",
  "cl:mumia", "cl:escorpiao", "cl:golem_areia", "cl:farao",
]);

const titulo = (id: string): RawMessage => ({ translate: `cl.missao.${id}.titulo` });

// Visual do Diário (1.3.7): RP/ui/server_form.json desenha o painel de console da nave (barra laranja com
// faixa de alerta, visor escuro e botões de metal em 2 colunas) para os formulários cujo título começa com
// este marcador invisível. Sem o pacote de recursos, aparece a tela normal do jogo.
const MARCA = "§p§f§r";
const tela = (t: RawMessage): RawMessage => ({ rawtext: [{ text: MARCA }, t] });
const ICONE_FEITA = "textures/ui/check";
const ICONE_BLOQUEADA = "textures/ui/achievement_locked_icon";
/** Barra de 10 traços: verde o que foi feito. */
const barra = (n: number, total: number): string => {
  const k = total ? Math.round((n / total) * 10) : 0;
  return `§a${"|".repeat(k)}§7${"|".repeat(10 - k)}`;
};

export function entregarDiario(jogador: Player): void {
  if (jogador.getDynamicProperty(PROPS.diarioRecebido)) return;
  jogador.setDynamicProperty(PROPS.diarioRecebido, true);
  darItens(jogador, [{ item: IDS.diarioBordo, quantidade: 1 }]);
  jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.diario.recebido" }] });
}

/** Botão da missão: ícone (feita, bloqueada ou o item do objetivo) e a situação embaixo do nome. */
function botaoMissao(jogador: Player, e: Estado, m: Missao, c: Capitulo): [RawMessage, string | undefined] {
  const o = m.objetivo;
  const alvo = "item" in o ? o.item : "bloco" in o ? o.bloco : undefined;
  if (e.pl.includes(m.id)) return [{ rawtext: [{ text: "§7" }, titulo(m.id), { text: "\n§7" }, { translate: "cl.diario.st_pulada" }] }, ICONE_FEITA];
  if (e.f.includes(m.id)) {
    const situacao = e.e.includes(m.id) ? { translate: "cl.diario.st_escolher" } : { translate: "cl.diario.st_feita" };
    return [{ rawtext: [{ text: "§a" }, titulo(m.id), { text: "\n" }, situacao] }, ICONE_FEITA];
  }
  if (!desbloqueada(e, m)) return [{ rawtext: [{ text: "§7" }, titulo(m.id), { text: "\n§8" }, { translate: "cl.diario.st_bloqueada" }] }, ICONE_BLOQUEADA];
  const feito = Math.min(feitoDe(jogador, e, m), o.qtd);
  return [{ rawtext: [{ text: "§f" }, titulo(m.id), { text: `\n${barra(feito, o.qtd)} §e${feito}/${o.qtd}` }] }, (alvo && iconeDe(alvo)) || iconeDe(c.icone)];
}

const missoesDe = (c: Capitulo): Missao[] => MISSOES.filter((m) => m.cap === c.id);
const VOLTAR: RawMessage = { rawtext: [{ text: "§7« " }, { translate: "cl.diario.voltar" }] };

/** Missões de achar cidade: mostra onde está o sinal mais próximo. */
function dicaDaMissao(jogador: Player, id: string): RawMessage[] {
  if (id !== "cidade") return [];
  const c = cidadeMaisProxima(jogador.location.x, jogador.location.z);
  if (!c) return [];
  return [{ text: "\n\n" }, { translate: "cl.diario.sinal_cidade", with: [String(Math.round(c.x)), String(Math.round(c.z)), String(Math.round(c.distancia))] }];
}

function corpoMissao(jogador: Player, e: Estado, m: Missao): RawMessage {
  const linhas: RawMessage[] = [
    { text: "§l§6" }, titulo(m.id), { text: "§r\n" },
    { translate: `cl.missao.${m.id}.desc` }, { text: "\n\n" },
    { translate: "cl.diario.progresso", with: [String(feitoDe(jogador, e, m)), String(m.objetivo.qtd)] },
    { text: ` ${barra(Math.min(feitoDe(jogador, e, m), m.objetivo.qtd), m.objetivo.qtd)}` },
  ];
  if (m.recompensa.length) linhas.push({ text: "\n§b" }, { translate: "cl.diario.recompensa" }, { text: "§r " }, textoPilhas(m.recompensa));
  if (m.escolha?.length) linhas.push({ text: "\n§b" }, { translate: "cl.diario.escolha" }, { text: "§r " }, textoPilhas(m.escolha));
  const faltam = m.requer.filter((r) => !feita(e, r));
  if (faltam.length) {
    linhas.push({ text: "\n\n§c" }, { translate: "cl.diario.requer" }, { text: "§r " });
    faltam.forEach((r, k) => linhas.push(...(k ? [{ text: ", " }] : []), titulo(r)));
  }
  linhas.push(...dicaDaMissao(jogador, m.id));
  return { rawtext: linhas };
}

async function escolherRecompensa(jogador: Player, m: Missao): Promise<void> {
  const opcoes = m.escolha ?? [];
  const form = new ActionFormData()
    .title(tela({ translate: "cl.diario.escolha_titulo" }))
    .body({ rawtext: [{ text: "§6" }, titulo(m.id), { text: "§r\n" }, { translate: "cl.diario.escolha_corpo" }] });
  for (const { item, quantidade } of opcoes) form.button({ rawtext: [nomeItem(item), { text: ` x${quantidade}` }] }, iconeDe(item));
  form.button(VOLTAR);
  const r = await form.show(jogador);
  if (r.selection !== undefined && r.selection < opcoes.length) escolher(jogador, m.id, r.selection);
}

async function confirmarPulo(jogador: Player, m: Missao): Promise<void> {
  const r = await new MessageFormData()
    .title({ translate: "cl.diario.pular" })
    .body({ translate: "cl.diario.pular_aviso" })
    .button1({ translate: "cl.diario.pular_sim" })
    .button2({ translate: "cl.diario.voltar" })
    .show(jogador);
  if (r.selection === 0) concluir(jogador, m.id, true);
}

async function verMissao(jogador: Player, id: string): Promise<void> {
  const m = MISSAO_POR_ID.get(id)!;
  const e = lerEstado(jogador);
  const aberta = !feita(e, id) && desbloqueada(e, m);
  const botoes: Array<[RawMessage, () => Promise<unknown> | void, string?]> = [];
  if (aberta && m.objetivo.tipo === "entregar") {
    botoes.push([{ translate: "cl.diario.entregar" }, () => {
      if (!entregar(jogador, id)) jogador.sendMessage({ translate: "cl.diario.entregar_falta" });
    }, iconeDe(m.objetivo.item)]);
  }
  if (e.e.includes(id)) botoes.push([{ translate: "cl.diario.escolher_um" }, () => escolherRecompensa(jogador, m), iconeDe(IDS.sacolaBoa)]);
  if (aberta) botoes.push([{ rawtext: [{ text: "§7" }, { translate: "cl.diario.pular" }] }, () => confirmarPulo(jogador, m)]);
  const form = new ActionFormData().title(tela({ translate: `cl.capitulo.${m.cap}.nome` })).body(corpoMissao(jogador, e, m));
  for (const [texto, , icone] of botoes) form.button(texto, icone);
  form.button(VOLTAR);
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= botoes.length) return;
  await botoes[r.selection][1]();
  return verMissao(jogador, id);
}

async function verCapitulo(jogador: Player, c: Capitulo): Promise<void> {
  const e = lerEstado(jogador);
  const lista = missoesDe(c);
  const n = lista.filter((m) => feita(e, m.id)).length;
  const form = new ActionFormData()
    .title(tela({ translate: `cl.capitulo.${c.id}.nome` }))
    .body({ rawtext: [{ translate: `cl.capitulo.${c.id}.desc` }, { text: `\n\n${barra(n, lista.length)} §e${n}/${lista.length}` }] });
  for (const m of lista) form.button(...botaoMissao(jogador, e, m, c));
  form.button(VOLTAR);
  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= lista.length) return;
  await verMissao(jogador, lista[r.selection].id);
  return verCapitulo(jogador, c);
}

async function pendentes(jogador: Player): Promise<void> {
  const e = lerEstado(jogador);
  const lista = e.e.map((id) => MISSAO_POR_ID.get(id)).filter((m): m is Missao => !!m);
  if (lista.length === 0) return;
  if (lista.length === 1) return escolherRecompensa(jogador, lista[0]);
  const form = new ActionFormData().title(tela({ translate: "cl.diario.escolha_titulo" })).body({ translate: "cl.diario.escolha_corpo" });
  for (const m of lista) form.button(titulo(m.id), iconeDe(IDS.sacolaBoa));
  form.button(VOLTAR);
  const r = await form.show(jogador);
  if (r.selection !== undefined && r.selection < lista.length) await escolherRecompensa(jogador, lista[r.selection]);
}

async function abrirDiario(jogador: Player): Promise<void> {
  conferir(jogador); // se já cumpriu uma missão "ter", conclui antes de mostrar
  const e = lerEstado(jogador);
  const feitas = e.f.length + e.pl.length;
  const acoes: Array<() => Promise<void>> = [];
  const form = new ActionFormData()
    .title(tela({ translate: "cl.diario.titulo" }))
    .body({ rawtext: [{ translate: "cl.diario.resumo", with: [String(feitas), String(MISSOES.length), String(abertas(e).length)] }, { text: `\n${barra(feitas, MISSOES.length)}\n\n§7` }, { translate: "cl.diario.resumo2" }] });
  if (e.e.length) {
    form.button({ rawtext: [{ text: "§6" }, { translate: "cl.diario.escolher", with: [String(e.e.length)] }] }, iconeDe(IDS.sacolaBoa));
    acoes.push(() => pendentes(jogador));
  }
  for (const c of CAPITULOS) {
    const lista = missoesDe(c);
    const n = lista.filter((m) => feita(e, m.id)).length;
    const liberado = lista.some((m) => feita(e, m.id) || desbloqueada(e, m));
    const cor = n === lista.length ? "§a" : liberado ? "§f" : "§7";
    const linha2 = liberado ? `${barra(n, lista.length)} §e${n}/${lista.length}` : "§8";
    form.button(
      { rawtext: [{ text: cor }, { translate: `cl.capitulo.${c.id}.nome` }, { text: `\n${linha2}` }, ...(liberado ? [] : [{ translate: "cl.diario.st_bloqueada" }])] },
      liberado ? iconeDe(c.icone) : ICONE_BLOQUEADA,
    );
    acoes.push(() => verCapitulo(jogador, c));
  }
  form.button({ translate: "cl.catalogo.titulo" }, iconeDe(IDS.catalogo));
  acoes.push(() => abrirCatalogo(jogador));
  form.button({ translate: "cl.opcoes.titulo" }, iconeDe(IDS.organizador));
  acoes.push(() => abrirOpcoes(jogador));
  form.button({ rawtext: [{ text: "§7" }, { translate: "cl.diario.fechar" }] });

  const r = await form.show(jogador);
  if (r.selection === undefined || r.selection >= acoes.length) return;
  await acoes[r.selection]();
  return abrirDiario(jogador);
}

export function registrarMissoes(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === IDS.diarioBordo) abrirUmMenu(source, () => abrirDiario(source));
  });

  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const id = block.typeId;
    contar(player, "colocar", (o) => o.tipo === "colocar" && o.bloco === id);
  });

  world.afterEvents.playerBreakBlock.subscribe(({ player, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    contar(player, "quebrar", (o) => o.tipo === "quebrar" && o.bloco === id);
  });

  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => {
    const id = itemStack.typeId;
    contar(source, "consumir", (o) => o.tipo === "consumir" && o.item === id);
  });

  world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    const matador = damageSource.damagingEntity;
    if (!(matador instanceof Player)) return;
    const tipo = deadEntity.typeId;
    let ehDaFamilia = (familia: string): boolean => familia === "monster" && MONSTROS.has(tipo);
    try {
      const familiaOk = (familia: string) => deadEntity.matches({ families: [familia] });
      familiaOk("monster"); // testa se a entidade ainda responde
      ehDaFamilia = familiaOk;
    } catch {
      // usa a lista fixa
    }
    contar(matador, "matar", (o) => o.tipo === "matar" && ehDaFamilia(o.familia));
  });

  registrarSacolas();

  intervalo("diário", () => {
    for (const jogador of world.getPlayers()) conferir(jogador);
  }, 40);
}

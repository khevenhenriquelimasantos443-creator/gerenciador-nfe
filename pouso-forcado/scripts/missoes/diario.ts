import { Player, RawMessage, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { IDS, PROPS, SISTEMAS_NAVE } from "../config.js";
import { abrirCatalogo, iconeDe } from "../catalogo/catalogo.js";
import { abrirOpcoes } from "../jogador/opcoes.js";
import { cidadeMaisProxima } from "../mundo/cidade.js";
import { consertados } from "../mundo/reparo.js";
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
 * Tela de painel (1.5.0): capítulos sempre na coluna da esquerda; à direita, a visão geral, as missões do
 * capítulo ou o detalhe da missão, com "Verificar progresso", "Entregar", "Escolher recompensa" e "Pular".
 * Também abre a história, o Catálogo e as Opções.
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

// Todas as telas do add-on têm o visual de painel da nave (RP/ui/server_form.json): fundo escuro, então as
// cores dos textos são as que se leem bem nele (nada de §0 e §8).
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
  if (!desbloqueada(e, m)) return [{ rawtext: [{ text: "§7" }, titulo(m.id), { text: "\n§7" }, { translate: "cl.diario.st_bloqueada" }] }, ICONE_BLOQUEADA];
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

async function escolherRecompensa(jogador: Player, m: Missao): Promise<void> {
  const opcoes = m.escolha ?? [];
  const form = new ActionFormData()
    .title({ translate: "cl.diario.escolha_titulo" })
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

async function pendentes(jogador: Player): Promise<void> {
  const e = lerEstado(jogador);
  const lista = e.e.map((id) => MISSAO_POR_ID.get(id)).filter((m): m is Missao => !!m);
  if (lista.length === 0) return;
  if (lista.length === 1) return escolherRecompensa(jogador, lista[0]);
  const form = new ActionFormData().title({ translate: "cl.diario.escolha_titulo" }).body({ translate: "cl.diario.escolha_corpo" });
  for (const m of lista) form.button(titulo(m.id), iconeDe(IDS.sacolaBoa));
  form.button(VOLTAR);
  const r = await form.show(jogador);
  if (r.selection !== undefined && r.selection < lista.length) await escolherRecompensa(jogador, lista[r.selection]);
}

/** Barra de progresso do painel (RP/textures/ui/cl/painel/progresso_0..10). */
const texturaProgresso = (n: number, total: number): string => `textures/ui/cl/painel/progresso_${total ? Math.round((Math.min(n, total) / total) * 10) : 0}`;

/** Nome de item ou bloco; se o jogo não tiver item para o id, mostra o id. */
function nomeSeguro(id: string): RawMessage {
  try {
    return nomeItem(id);
  } catch {
    return { text: id };
  }
}

const NOME_FAMILIA: Record<string, string> = {
  blaze: "entity.blaze.name", husk: "entity.husk.name", farao: "entity.cl:farao.name", mumia: "entity.cl:mumia.name", golem_areia: "entity.cl:golem_areia.name",
};

/** O que a missão pede, numa linha (a caixinha do objetivo no painel). */
function textoObjetivo(m: Missao): RawMessage {
  const o = m.objetivo;
  const com = (chave: string, id: string): RawMessage => ({ translate: chave, with: { rawtext: [nomeSeguro(id)] } });
  switch (o.tipo) {
    case "colocar": return com("cl.obj.colocar", o.bloco);
    case "quebrar": return com("cl.obj.quebrar", o.bloco);
    case "ter": return com("cl.obj.ter", o.item);
    case "entregar": return com("cl.obj.entregar", o.item);
    case "consumir": return com("cl.obj.consumir", o.item);
    case "matar": return NOME_FAMILIA[o.familia] ? { translate: "cl.obj.matar", with: { rawtext: [{ translate: NOME_FAMILIA[o.familia] }] } } : { translate: "cl.obj.monstros" };
    case "noites": return { translate: "cl.obj.noites" };
    case "acao": return { translate: "cl.obj.acao" };
  }
}

/*
 * Layout de painel (1.5.0, desenho do ChatGPT; RP/ui/server_form.json): o título leva o marcador §v§p§r e cada
 * botão começa com o marcador da zona onde aparece. A tela separa os botões pelo marcador:
 * §u capítulos (coluna da esquerda), §t coluna da direita, §s barra de ações, §q rodapé (sistemas da nave),
 * §n estado da nave no cabeçalho. Só os capítulos, as linhas (§t§6) e as ações são botões de tocar; o resto é
 * só para ver. Os marcadores são códigos de cor seguidos de §r: se algum escapar, não aparece.
 */
const M = {
  painel: "§v§p§r",
  capitulo: "§u§1§r", capituloEscolhido: "§u§2§r", capituloBloqueado: "§u§3§r",
  cabeca: "§t§1§r", objetivoFeito: "§t§2§r", objetivo: "§t§3§r", progresso: "§t§4§r", item: "§t§5§r", linha: "§t§6§r", aviso: "§t§7§r", rotulo: "§t§8§r",
  acao: "§s§1§r", acaoSecundaria: "§s§2§r",
  sistemaOk: "§q§1§r", sistemaQuebrado: "§q§2§r", reparados: "§q§3§r",
  estado: ["§n§1§r", "§n§2§r", "§n§3§r"],
} as const;

type Tela = { tipo: "inicio" } | { tipo: "capitulo"; c: Capitulo } | { tipo: "missao"; id: string } | { tipo: "historia"; k: number };
type Proxima = Tela | null | undefined; // undefined: mostra de novo a mesma tela
type Botao = { marca: string; texto: RawMessage; icone?: string; acao?: () => Promise<Proxima> | Proxima };

const marcado = (marca: string, texto: RawMessage): RawMessage => ({ rawtext: [{ text: marca }, texto] });

/** Monta o painel (cabeçalho, capítulos, a coluna da direita, ações e rodapé) e espera o toque. */
async function painel(jogador: Player, e: Estado, tela: Tela, corpo: RawMessage, direita: Botao[], acoes: Botao[]): Promise<Proxima> {
  const botoes: Botao[] = [];
  const sistemas = consertados();
  const n = SISTEMAS_NAVE.filter((s) => sistemas.has(s.id)).length;
  const estado = n === SISTEMAS_NAVE.length ? 2 : n > 0 ? 1 : 0;
  botoes.push({ marca: M.estado[estado], texto: { translate: `cl.painel.estado${estado}` } });
  const escolhido = tela.tipo === "capitulo" ? tela.c.id : tela.tipo === "missao" ? MISSAO_POR_ID.get(tela.id)?.cap : undefined;
  for (const c of CAPITULOS) {
    const lista = missoesDe(c);
    const liberado = lista.some((m) => feita(e, m.id) || desbloqueada(e, m));
    const completo = lista.every((m) => feita(e, m.id));
    const marca = c.id === escolhido ? M.capituloEscolhido : liberado ? M.capitulo : M.capituloBloqueado;
    const cor = !liberado ? "§7" : completo ? "§a" : "§f";
    botoes.push({ marca, texto: { rawtext: [{ text: cor }, { translate: `cl.capitulo.${c.id}.curto` }] }, icone: iconeDe(c.icone), acao: () => ({ tipo: "capitulo", c }) });
  }
  botoes.push(...direita, ...acoes);
  for (const s of SISTEMAS_NAVE) {
    botoes.push({ marca: sistemas.has(s.id) ? M.sistemaOk : M.sistemaQuebrado, texto: { text: "" }, icone: `textures/ui/cl/painel/sistema_${s.id}` });
  }
  botoes.push({ marca: M.reparados, texto: { translate: "cl.painel.reparados", with: [String(n)] } });

  const form = new ActionFormData().title(marcado(M.painel, { translate: "cl.diario.titulo" })).body(corpo);
  for (const b of botoes) form.button(marcado(b.marca, b.texto), b.icone);
  const r = await form.show(jogador);
  if (r.selection === undefined) return null;
  const acao = botoes[r.selection]?.acao;
  return acao ? acao() : undefined;
}

const rotulo = (chave: string): Botao => ({ marca: M.rotulo, texto: { translate: chave } });
const progresso = (n: number, total: number): Botao => ({ marca: M.progresso, texto: { text: `§e${Math.min(n, total)}/${total}` }, icone: texturaProgresso(n, total) });
const pilhas = (lista: ReadonlyArray<{ item: string; quantidade: number }>): Botao[] =>
  lista.map(({ item, quantidade }) => ({ marca: M.item, texto: { rawtext: [nomeSeguro(item), { text: ` §7x${quantidade}` }] }, icone: iconeDe(item) }));

async function telaInicio(jogador: Player, e: Estado): Promise<Proxima> {
  const feitas = e.f.length + e.pl.length;
  const corpo: RawMessage = { rawtext: [{ translate: "cl.diario.resumo", with: [String(feitas), String(MISSOES.length), String(abertas(e).length)] }, { text: "\n§7" }, { translate: "cl.diario.resumo2" }] };
  const direita: Botao[] = [
    { marca: M.cabeca, texto: { translate: "cl.painel.visao" }, icone: iconeDe(IDS.painelNave) },
    rotulo("cl.painel.progresso"),
    progresso(feitas, MISSOES.length),
  ];
  if (e.e.length) {
    direita.push({ marca: M.linha, texto: { rawtext: [{ text: "§6" }, { translate: "cl.diario.escolher", with: [String(e.e.length)] }] }, icone: iconeDe(IDS.sacolaBoa), acao: async () => { await pendentes(jogador); return undefined; } });
  }
  const lista = abertas(e).slice(0, 8);
  if (lista.length) direita.push(rotulo("cl.painel.abertas"));
  for (const m of lista) {
    const c = CAPITULOS.find((x) => x.id === m.cap)!;
    const [texto, icone] = botaoMissao(jogador, e, m, c);
    direita.push({ marca: M.linha, texto, icone, acao: () => ({ tipo: "missao", id: m.id }) });
  }
  return painel(jogador, e, { tipo: "inicio" }, corpo, direita, [
    { marca: M.acao, texto: { translate: "cl.painel.ler" }, acao: () => ({ tipo: "historia", k: 0 }) },
    { marca: M.acaoSecundaria, texto: { translate: "cl.painel.catalogo" }, acao: async () => { await abrirCatalogo(jogador); return undefined; } },
    { marca: M.acaoSecundaria, texto: { translate: "cl.painel.opcoes" }, acao: async () => { await abrirOpcoes(jogador); return undefined; } },
  ]);
}

async function telaCapitulo(jogador: Player, e: Estado, c: Capitulo): Promise<Proxima> {
  const lista = missoesDe(c);
  const n = lista.filter((m) => feita(e, m.id)).length;
  const direita: Botao[] = [
    { marca: M.cabeca, texto: { translate: `cl.capitulo.${c.id}.nome` }, icone: iconeDe(c.icone) },
    rotulo("cl.painel.progresso"),
    progresso(n, lista.length),
    rotulo("cl.painel.missoes"),
  ];
  for (const m of lista) {
    const [texto, icone] = botaoMissao(jogador, e, m, c);
    direita.push({ marca: M.linha, texto, icone, acao: () => ({ tipo: "missao", id: m.id }) });
  }
  const acoes: Botao[] = [];
  const proxima = lista.find((m) => !feita(e, m.id) && desbloqueada(e, m));
  if (proxima) acoes.push({ marca: M.acao, texto: { translate: "cl.painel.proxima" }, acao: () => ({ tipo: "missao", id: proxima.id }) });
  acoes.push({ marca: M.acaoSecundaria, texto: { translate: "cl.painel.inicio" }, acao: () => ({ tipo: "inicio" }) });
  return painel(jogador, e, { tipo: "capitulo", c }, { translate: `cl.capitulo.${c.id}.desc` }, direita, acoes);
}

async function telaMissao(jogador: Player, e: Estado, id: string): Promise<Proxima> {
  const m = MISSAO_POR_ID.get(id)!;
  const c = CAPITULOS.find((x) => x.id === m.cap)!;
  const o = m.objetivo;
  const alvo = "item" in o ? o.item : "bloco" in o ? o.bloco : undefined;
  const aberta = !feita(e, id) && desbloqueada(e, m);
  const feito = feita(e, id) ? o.qtd : Math.min(feitoDe(jogador, e, m), o.qtd);
  const direita: Botao[] = [
    { marca: M.cabeca, texto: titulo(id), icone: (alvo && iconeDe(alvo)) || iconeDe(c.icone) },
    { marca: feita(e, id) ? M.objetivoFeito : M.objetivo, texto: { rawtext: [textoObjetivo(m), { text: `  §e${feito}/${o.qtd}` }] } },
    rotulo("cl.painel.progresso"),
    progresso(feito, o.qtd),
  ];
  const faltam = m.requer.filter((r) => !feita(e, r));
  if (faltam.length) {
    const texto: RawMessage[] = [{ text: "§c" }, { translate: "cl.diario.requer" }, { text: "§r " }];
    faltam.forEach((r, k) => texto.push(...(k ? [{ text: ", " }] : []), titulo(r)));
    direita.push({ marca: M.aviso, texto: { rawtext: texto } });
  }
  if (m.recompensa.length) direita.push(rotulo("cl.painel.recompensa"), ...pilhas(m.recompensa));
  if (m.escolha?.length) direita.push(rotulo("cl.painel.escolha"), ...pilhas(m.escolha));

  const acoes: Botao[] = [];
  if (e.e.includes(id)) acoes.push({ marca: M.acao, texto: { translate: "cl.painel.escolher" }, acao: async () => { await escolherRecompensa(jogador, m); return undefined; } });
  else if (aberta && o.tipo === "entregar") {
    acoes.push({ marca: M.acao, texto: { translate: "cl.painel.entregar" }, acao: () => {
      if (!entregar(jogador, id)) jogador.sendMessage({ translate: "cl.diario.entregar_falta" });
      return undefined;
    } });
  } else if (aberta) acoes.push({ marca: M.acao, texto: { translate: "cl.painel.verificar" }, acao: () => { conferir(jogador); return undefined; } });
  if (aberta) acoes.push({ marca: M.acaoSecundaria, texto: { translate: "cl.painel.pular" }, acao: async () => { await confirmarPulo(jogador, m); return undefined; } });
  acoes.push({ marca: M.acaoSecundaria, texto: { translate: "cl.painel.voltar" }, acao: () => ({ tipo: "capitulo", c }) });
  const corpo: RawMessage = { rawtext: [{ translate: `cl.missao.${id}.desc` }, ...dicaDaMissao(jogador, id)] };
  return painel(jogador, e, { tipo: "missao", id }, corpo, direita, acoes);
}

// História e guia (1.4.0): o que aconteceu e como sobreviver, em páginas curtas. Abre sozinha na primeira
// vez que o jogador abre o Diário; depois, pelo botão "Leia primeiro". Textos: cl.historia.<página>.<parágrafo>.
const HISTORIA: ReadonlyArray<number> = [2, 3, 2, 3, 3, 2]; // parágrafos de cada página
async function telaHistoria(jogador: Player, e: Estado, k: number): Promise<Proxima> {
  const corpo: RawMessage[] = [];
  for (let i = 0; i < HISTORIA[k]; i++) corpo.push({ text: i ? "\n\n" : "" }, { translate: `cl.historia.${k}.${i}` });
  corpo.push({ text: "\n\n§7" }, { translate: "cl.historia.pagina", with: [String(k + 1), String(HISTORIA.length)] });
  const acoes: Botao[] = [];
  if (k + 1 < HISTORIA.length) acoes.push({ marca: M.acao, texto: { translate: "cl.painel.historia_prox" }, acao: () => ({ tipo: "historia", k: k + 1 }) });
  else acoes.push({ marca: M.acao, texto: { translate: "cl.painel.historia_fim" }, acao: () => ({ tipo: "inicio" }) });
  if (k > 0) acoes.push({ marca: M.acaoSecundaria, texto: { translate: "cl.painel.historia_ant" }, acao: () => ({ tipo: "historia", k: k - 1 }) });
  acoes.push({ marca: M.acaoSecundaria, texto: { translate: "cl.painel.inicio" }, acao: () => ({ tipo: "inicio" }) });
  const direita: Botao[] = [{ marca: M.cabeca, texto: { translate: `cl.historia.${k}.titulo` }, icone: iconeDe(IDS.diarioBordo) }];
  return painel(jogador, e, { tipo: "historia", k }, { rawtext: corpo }, direita, acoes);
}

/** Abre o Diário e segue de tela em tela até o jogador fechar. */
async function abrirDiario(jogador: Player): Promise<void> {
  let tela: Tela | null = { tipo: "inicio" };
  if (!jogador.getDynamicProperty(PROPS.historiaLida)) {
    jogador.setDynamicProperty(PROPS.historiaLida, true);
    tela = { tipo: "historia", k: 0 };
  }
  while (tela) {
    conferir(jogador); // se já cumpriu uma missão "ter", conclui antes de mostrar
    const e = lerEstado(jogador);
    const atual = tela as Tela;
    const proxima: Proxima =
      atual.tipo === "inicio" ? await telaInicio(jogador, e)
      : atual.tipo === "capitulo" ? await telaCapitulo(jogador, e, atual.c)
      : atual.tipo === "missao" ? await telaMissao(jogador, e, atual.id)
      : await telaHistoria(jogador, e, atual.k);
    if (proxima !== undefined) tela = proxima;
  }
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

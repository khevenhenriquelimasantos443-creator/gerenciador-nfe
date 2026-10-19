import { Block, BlockCustomComponent, Container, GameMode, ItemStack, Player, RawMessage, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { ARMAZENAMENTO, IDS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { particula } from "../util/efeitos.js";
import { coletarNaRede, consumir } from "../util/rede.js";

/*
 * Terminal de Armazenamento: uma rede de baús no estilo Applied Energistics.
 * - Todo baú, baú com armadilha ou barril encostado num cabo (ou no próprio terminal, ou em
 *   outro bloco de energia) ligado ao terminal entra na rede (até ARMAZENAMENTO.maxConteineres).
 * - Tocar no terminal gasta ARMAZENAMENTO.energiaPorUso E de uma bateria da rede e abre um menu:
 *   tudo o que está guardado, somado; procurar pelo nome em inglês (ex.: "iron"); tirar 1, 16,
 *   64 ou tudo de um item; guardar a mochila inteira (menos a barra rápida e o Diário).
 * Custo: só quando alguém usa o terminal (uma busca na rede e uma leitura dos baús).
 */
type Linha = { id: string; total: number; nome: RawMessage };

const chave = (b: Block) => `${b.x},${b.y},${b.z}`;

/** Os inventários da rede. Baú duplo conta uma vez só (as duas metades dão o mesmo inventário). */
function conteineres(terminal: Block): Container[] {
  const tipos: ReadonlyArray<string> = ARMAZENAMENTO.conteineres;
  const blocos = coletarNaRede(terminal, (b) => tipos.includes(b.typeId), ARMAZENAMENTO.maxConteineres, ARMAZENAMENTO.maxBlocos);
  const vistos = new Set(blocos.map(chave));
  const lista: Container[] = [];
  for (const b of blocos) {
    const inv = b.getComponent("minecraft:inventory")?.container;
    if (!inv) continue;
    if (inv.size > 27) {
      // Metade de um baú duplo: só a metade de menor (x, z) entra.
      const par = [b.north(), b.south(), b.east(), b.west()].find(
        (v) => v?.typeId === b.typeId && (v.getComponent("minecraft:inventory")?.container?.size ?? 0) > 27,
      );
      if (par && vistos.has(chave(par)) && (par.x < b.x || (par.x === b.x && par.z < b.z))) continue;
    }
    lista.push(inv);
  }
  return lista;
}

function estoque(lista: Container[]): Linha[] {
  const porId = new Map<string, Linha>();
  for (const inv of lista) {
    for (let s = 0; s < inv.size; s++) {
      const p = inv.getItem(s);
      if (!p) continue;
      const linha = porId.get(p.typeId);
      if (linha) linha.total += p.amount;
      else porId.set(p.typeId, { id: p.typeId, total: p.amount, nome: { translate: p.localizationKey } });
    }
  }
  return [...porId.values()].sort((a, b) => b.total - a.total);
}

/** Tira até `qtd` do item da rede para o jogador. Retorna quantos passou. */
function retirar(jogador: Player, lista: Container[], id: string, qtd: number): number {
  const mochila = jogador.getComponent("minecraft:inventory")?.container;
  if (!mochila) return 0;
  let falta = qtd;
  for (const inv of lista) {
    for (let s = 0; s < inv.size && falta > 0; s++) {
      const p = inv.getItem(s);
      if (p?.typeId !== id) continue;
      const parte = p.clone();
      parte.amount = Math.min(falta, p.amount);
      const sobra = mochila.addItem(parte);
      const passou = parte.amount - (sobra?.amount ?? 0);
      if (passou >= p.amount) inv.setItem(s, undefined);
      else if (passou > 0) {
        p.amount -= passou;
        inv.setItem(s, p);
      }
      falta -= passou;
      if (sobra) return qtd - falta; // mochila cheia
    }
  }
  return qtd - falta;
}

/** Guarda a mochila (espaços 9 a 35) na rede. Retorna quantos itens guardou. */
function guardarMochila(jogador: Player, lista: Container[]): number {
  const mochila = jogador.getComponent("minecraft:inventory")?.container;
  if (!mochila) return 0;
  let guardados = 0;
  for (let s = 9; s < mochila.size; s++) {
    let p: ItemStack | undefined = mochila.getItem(s);
    if (!p || p.typeId === IDS.diarioBordo) continue;
    const antes = p.amount;
    for (const inv of lista) {
      p = inv.addItem(p);
      if (!p) break;
    }
    mochila.setItem(s, p);
    guardados += antes - (p?.amount ?? 0);
  }
  return guardados;
}

async function escolherQuantidade(jogador: Player, terminal: Block, linha: Linha): Promise<void> {
  const opcoes = [1, 16, 64].filter((n) => n < linha.total);
  const form = new ActionFormData()
    .title(linha.nome)
    .body({ translate: "cl.terminal.quanto", with: [String(linha.total)] });
  for (const n of opcoes) form.button(String(n));
  form.button({ translate: "cl.terminal.tudo", with: [String(linha.total)] });
  form.button({ translate: "cl.terminal.voltar" });
  const r = await form.show(jogador);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection > opcoes.length) return abrir(jogador, terminal, "", 0, false);
  const qtd = r.selection < opcoes.length ? opcoes[r.selection] : linha.total;
  const passou = retirar(jogador, conteineres(terminal), linha.id, qtd);
  aviso(jogador, { translate: passou < qtd ? "cl.terminal.mochila_cheia" : "cl.terminal.retirado", with: { rawtext: [{ text: String(passou) }, linha.nome] } });
  return abrir(jogador, terminal, "", 0, false);
}

async function procurar(jogador: Player, terminal: Block): Promise<void> {
  const r = await new ModalFormData()
    .title({ translate: "cl.terminal.procurar" })
    .textField({ translate: "cl.terminal.procurar_dica" }, "iron")
    .show(jogador);
  if (r.canceled || !r.formValues) return;
  const texto = String(r.formValues[0] ?? "").trim().toLowerCase();
  return abrir(jogador, terminal, texto, 0, false);
}

async function abrir(jogador: Player, terminal: Block, filtro: string, pagina: number, cobrar: boolean): Promise<void> {
  if (!terminal.isValid || terminal.typeId !== IDS.terminal) return;
  const lista = conteineres(terminal);
  if (lista.length === 0) {
    aviso(jogador, "cl.terminal.sem_baus", 5);
    return;
  }
  if (cobrar && jogador.getGameMode() !== GameMode.Creative) {
    for (let i = 0; i < ARMAZENAMENTO.energiaPorUso; i++) {
      if (!consumir(terminal)) {
        aviso(jogador, "cl.terminal.sem_energia", 5);
        return;
      }
    }
  }
  if (cobrar) {
    particula(terminal.dimension, "cl:energia", { x: terminal.x + 0.5, y: terminal.y + 1, z: terminal.z + 0.5 });
    jogador.playSound("beacon.activate", { volume: 0.4, pitch: 1.6 });
  }
  const todas = estoque(lista);
  const linhas = filtro ? todas.filter((l) => l.id.replace("minecraft:", "").replace("cl:", "").includes(filtro)) : todas;
  const inicio = pagina * ARMAZENAMENTO.porPagina;
  const nestaPagina = linhas.slice(inicio, inicio + ARMAZENAMENTO.porPagina);
  const temMais = inicio + ARMAZENAMENTO.porPagina < linhas.length;
  const totalItens = todas.reduce((s, l) => s + l.total, 0);

  const form = new ActionFormData()
    .title({ translate: "cl.terminal.titulo" })
    .body({
      rawtext: [
        { translate: "cl.terminal.resumo", with: [String(lista.length), String(todas.length), String(totalItens)] },
        ...(filtro ? [{ text: "\n" }, { translate: "cl.terminal.filtro", with: [filtro] }] : []),
      ],
    })
    .button({ translate: "cl.terminal.guardar" })
    .button({ translate: filtro ? "cl.terminal.limpar" : "cl.terminal.procurar" });
  for (const l of nestaPagina) form.button({ rawtext: [l.nome, { text: ` §8x${l.total}` }] });
  if (temMais) form.button({ translate: "cl.terminal.mais" });

  const r = await form.show(jogador);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection === 0) {
    const n = guardarMochila(jogador, lista);
    aviso(jogador, { translate: "cl.terminal.guardado", with: [String(n)] });
    return abrir(jogador, terminal, filtro, 0, false);
  }
  if (r.selection === 1) return filtro ? abrir(jogador, terminal, "", 0, false) : procurar(jogador, terminal);
  const k = r.selection - 2;
  if (k < nestaPagina.length) return escolherQuantidade(jogador, terminal, nestaPagina[k]);
  return abrir(jogador, terminal, filtro, pagina + 1, false);
}

export const terminal: BlockCustomComponent = {
  onPlayerInteract(e) {
    const jogador = e.player;
    if (!jogador) return;
    const bloco = e.block;
    system.run(() => {
      abrir(jogador, bloco, "", 0, true).catch(() => {
        // menu fechado no meio (jogador saiu)
      });
    });
  },
};

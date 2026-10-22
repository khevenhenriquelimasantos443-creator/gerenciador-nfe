import { Block, BlockCustomComponent, GameMode, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PROPS, SISTEMAS_NAVE } from "../config.js";
import { nomeItem, receitasDaMontadora } from "../blocos/montadora.js";
import { registrarAcao } from "../missoes/progresso.js";
import { Acao } from "../missoes/lista.js";
import { particula } from "../util/efeitos.js";
import { confirmarDecolagem, jaDecolou } from "./decolagem.js";

/*
 * Conserto da nave (Fase 8): o Painel da Nave fica dentro da nave caída (posto junto com o baú
 * de suprimentos; também tem receita). Tocar nele abre o menu dos 4 sistemas (SISTEMAS_NAVE):
 * casco, computador de bordo, combustível e motor. Com as peças na mochila, "Instalar" gasta
 * as peças e marca o sistema como consertado (vale para o mundo todo).
 * As peças saem da Montadora (scripts/blocos/montadora.ts). Com os 4 consertados, a nave está
 * pronta para a decolagem (Fase 10).
 */
type Sistema = (typeof SISTEMAS_NAVE)[number];

export function consertados(): Set<string> {
  const v = world.getDynamicProperty(PROPS.reparos);
  return new Set(typeof v === "string" && v ? v.split(",") : []);
}

export const naveConsertada = (): boolean => SISTEMAS_NAVE.every((s) => consertados().has(s.id));

function quantos(jogador: Player, item: string): number {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  let n = 0;
  if (!inv) return 0;
  for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p?.typeId === item) n += p.amount;
  }
  return n;
}

function gastar(jogador: Player, item: string, qtd: number): void {
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  let falta = qtd;
  for (let s = 0; inv && s < inv.size && falta > 0; s++) {
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

const criativo = (jogador: Player) => jogador.getGameMode() === GameMode.Creative;
const temTudo = (jogador: Player, sis: Sistema) => criativo(jogador) || sis.pecas.every(({ item, qtd }) => quantos(jogador, item) >= qtd);

function instalar(jogador: Player, sis: Sistema): void {
  if (!criativo(jogador)) for (const { item, qtd } of sis.pecas) gastar(jogador, item, qtd);
  const feitos = consertados();
  feitos.add(sis.id);
  world.setDynamicProperty(PROPS.reparos, [...feitos].join(","));
  registrarAcao(jogador, `reparo_${sis.id}` as Acao);
  jogador.playSound("random.anvil_use");
  jogador.playSound("beacon.power", { volume: 0.6 });
  particula(jogador.dimension, "cl:faisca", { x: jogador.location.x, y: jogador.location.y + 1.2, z: jogador.location.z });
  jogador.dimension.playSound("random.levelup", jogador.location);
  const pronta = naveConsertada();
  for (const j of world.getPlayers()) {
    j.sendMessage({
      rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.nave.instalado", with: { rawtext: [{ translate: `cl.nave.sistema.${sis.id}` }, { text: `${feitos.size}/${SISTEMAS_NAVE.length}` }] } }],
    });
    if (pronta) {
      j.onScreenDisplay.setTitle({ translate: "cl.nave.pronta_titulo" }, { subtitle: { translate: "cl.nave.pronta_subtitulo" }, fadeInDuration: 10, stayDuration: 100, fadeOutDuration: 20 });
    }
  }
}

async function telaSistema(jogador: Player, sis: Sistema): Promise<void> {
  const linhas: RawMessage[] = [{ translate: `cl.nave.desc.${sis.id}` }, { text: "\n\n" }, { translate: "cl.nave.precisa" }, { text: "\n" }];
  for (const { item, qtd } of sis.pecas) {
    const tem = quantos(jogador, item);
    linhas.push({ text: `${tem >= qtd ? "§a" : "§c"}${Math.min(tem, qtd)}/${qtd}§r ` }, { translate: nomeItem(item) }, { text: "\n" });
  }
  const pode = temTudo(jogador, sis);
  const form = new ActionFormData().title({ translate: `cl.nave.sistema.${sis.id}` }).body({ rawtext: linhas });
  if (pode) form.button({ translate: "cl.nave.instalar" });
  form.button({ translate: "cl.diario.voltar" });
  const r = await form.show(jogador);
  if (r.canceled || r.selection === undefined) return;
  if (pode && r.selection === 0) {
    if (temTudo(jogador, sis) && !consertados().has(sis.id)) instalar(jogador, sis);
    return;
  }
  return abrirPainel(jogador);
}

async function telaReceitas(jogador: Player): Promise<void> {
  await new ActionFormData()
    .title({ translate: "cl.montadora.titulo" })
    .body({ rawtext: [{ translate: "cl.montadora.como" }, { text: "\n\n" }, receitasDaMontadora()] })
    .button({ translate: "cl.diario.voltar" })
    .show(jogador);
  return abrirPainel(jogador);
}

async function abrirPainel(jogador: Player, painel?: Block): Promise<void> {
  const feitos = consertados();
  const corpo: RawMessage[] = [{ translate: naveConsertada() ? "cl.nave.status_pronta" : "cl.nave.status" }, { text: "\n\n" }];
  for (const sis of SISTEMAS_NAVE) {
    corpo.push({ text: feitos.has(sis.id) ? "§a[OK] §r" : "§c[--] §r" }, { translate: `cl.nave.sistema.${sis.id}` }, { text: "\n" });
  }
  const pendentes = SISTEMAS_NAVE.filter((s) => !feitos.has(s.id));
  if (jaDecolou()) corpo.push({ text: "\n" }, { translate: "cl.fim.painel_depois" });
  const form = new ActionFormData().title({ translate: "cl.nave.titulo" }).body({ rawtext: corpo });
  // Fase 10: com tudo consertado, o primeiro botão é a decolagem.
  const podeDecolar = !pendentes.length && painel !== undefined;
  if (podeDecolar) form.button({ translate: jaDecolou() ? "cl.fim.botao_rever" : "cl.fim.botao" });
  for (const sis of pendentes) form.button({ rawtext: [{ translate: "cl.nave.consertar" }, { text: " " }, { translate: `cl.nave.sistema.${sis.id}` }] });
  form.button({ translate: "cl.nave.receitas" });
  form.button({ translate: "cl.diario.fechar" });
  const r = await form.show(jogador);
  if (r.canceled || r.selection === undefined) return;
  let sel = r.selection;
  if (podeDecolar) {
    if (sel === 0) return confirmarDecolagem(jogador, painel);
    sel--;
  }
  if (sel < pendentes.length) return telaSistema(jogador, pendentes[sel]);
  if (sel === pendentes.length) return telaReceitas(jogador);
}

export const painelNave: BlockCustomComponent = {
  onPlayerInteract(e) {
    const jogador = e.player;
    if (!jogador) return;
    system.run(() => {
      abrirPainel(jogador, e.block).catch(() => {
        // menu fechado no meio
      });
    });
  },
};

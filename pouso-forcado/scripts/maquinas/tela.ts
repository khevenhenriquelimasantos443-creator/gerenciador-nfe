import { Block, Container, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { verItem } from "../catalogo/catalogo.js";
import { BLOCOS_ENERGIA } from "../conteudo/energia.js";
import { MAQUINAS_CONTEUDO } from "../conteudo/gerado.js";
import { detalheRegistrado } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { entrada, saida } from "../util/maquina.js";
import { registrarAcao } from "../missoes/progresso.js";
import { abrirUmMenu } from "../util/menus.js";
import { energiaDaRede } from "../util/rede.js";
import { estadoMaquina } from "./thermal.js";

/*
 * 1.55.0: a tela da máquina, para toda máquina que tem tela no mod de origem (as que gastam, geram ou guardam
 * energia e as máquinas do conteúdo). Toque com a mão vazia (sem agachar): mostra o estado do último ciclo, a energia
 * da rede (baterias e células ligadas por cabo), o detalhe da máquina (o mesmo do "o que estou olhando"), a entrada
 * (o baú em cima) e a saída (o baú embaixo), com botões para pôr itens na entrada, pegar a saída e ver a máquina no
 * Catálogo. Quem já tem tela própria (QIO, teletransportador, células Ender, Tesseract...) abre a dela: esta espera
 * 2 ticks e não abre se outra já abriu.
 * Custo: só no toque.
 */
// Blocos do conteúdo que são baú, barril ou enfeite: abrem o próprio inventário, não a tela da máquina.
const FORA = new Set<string>(["cl:caixa_entrega", "cl:estrutura_maquina", "cl:barril_armazenamento", "cl:bau_me", "cl:drive_me"]);
const COM_TELA = new Set<string>([...BLOCOS_ENERGIA, ...MAQUINAS_CONTEUDO].filter((id) => !FORA.has(id)));
export const temTela = (id: string): boolean => COM_TELA.has(id);
const ENERGIA_SET = new Set(BLOCOS_ENERGIA);

const nome = (id: string): RawMessage => {
  try {
    return { translate: new ItemStack(id).localizationKey };
  } catch {
    return { text: id };
  }
};
function itens(c: Container | undefined, max = 6): RawMessage[] {
  if (!c) return [];
  const soma = new Map<string, number>();
  for (let i = 0; i < c.size; i++) {
    const p = c.getItem(i);
    if (p) soma.set(p.typeId, (soma.get(p.typeId) ?? 0) + p.amount);
  }
  const l: RawMessage[] = [];
  for (const [id, n] of [...soma].slice(0, max)) l.push({ text: `\n §7• §f${n}× ` }, nome(id));
  if (soma.size > max) l.push({ text: `\n §7… +${soma.size - max}` });
  if (!soma.size) l.push({ text: "\n §8" }, { translate: "cl.tela.vazio" });
  return l;
}

/** O texto da tela (também usado pelo teste no servidor). */
export function textoTela(b: Block): RawMessage {
  const r: RawMessage[] = [];
  const est = estadoMaquina(b);
  if (est) r.push({ translate: est === "ok" ? "cl.tela.trabalhando" : est === "sem_energia" ? "cl.tela.sem_energia" : "cl.tela.parada" }, { text: "\n" });
  if (ENERGIA_SET.has(b.typeId)) {
    const e = energiaDaRede(b);
    r.push(e.armazens ? { translate: "cl.tela.energia", with: [rf(e.carga), rf(e.capacidade)] } : { translate: "cl.tela.sem_rede" }, { text: "\n" });
  }
  const d = detalheRegistrado(b);
  if (d) r.push(d, { text: "\n" });
  const ent = entrada(b), sai = saida(b);
  r.push({ text: "\n§l" }, { translate: "cl.tela.entrada" }, { text: "§r" });
  if (ent) r.push(...itens(ent));
  else r.push({ text: "\n §8" }, { translate: "cl.tela.sem_entrada" });
  r.push({ text: "\n§l" }, { translate: "cl.tela.saida" }, { text: "§r" });
  if (sai) r.push(...itens(sai));
  else r.push({ text: "\n §8" }, { translate: "cl.tela.sem_saida" });
  return { rawtext: r };
}

async function porNaEntrada(j: Player, b: Block): Promise<void> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const ent = entrada(b);
  if (!inv || !ent) return;
  const slots: number[] = [];
  const f = new ActionFormData().title({ translate: "cl.tela.por" }).body({ translate: "cl.tela.escolher" });
  for (let i = 0; i < inv.size && slots.length < 24; i++) {
    const p = inv.getItem(i);
    if (!p) continue;
    slots.push(i);
    f.button({ rawtext: [{ text: `${p.amount}× ` }, nome(p.typeId)] });
  }
  if (!slots.length) return;
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const i = slots[r.selection];
  const p = inv.getItem(i);
  if (!p || !b.isValid) return;
  const resto = ent.addItem(p);
  inv.setItem(i, resto);
  j.playSound("random.pop", { volume: 0.5 });
}

function pegarSaida(j: Player, b: Block): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const sai = saida(b);
  if (!inv || !sai) return;
  for (let i = 0; i < sai.size; i++) {
    const p = sai.getItem(i);
    if (!p) continue;
    sai.setItem(i, inv.addItem(p));
  }
  j.playSound("random.pop", { volume: 0.5 });
}

export function abrirTelaMaquina(j: Player, b: Block): void {
  abrirUmMenu(j, async () => {
    const ent = entrada(b), sai = saida(b);
    const botoes: Array<"por" | "pegar" | "catalogo"> = [];
    const f = new ActionFormData().title({ translate: b.localizationKey }).body(textoTela(b));
    if (ent) {
      botoes.push("por");
      f.button({ translate: "cl.tela.por" });
    }
    if (sai) {
      botoes.push("pegar");
      f.button({ translate: "cl.tela.pegar" });
    }
    botoes.push("catalogo");
    f.button({ translate: "cl.tela.catalogo" });
    registrarAcao(j, "tela_maquina");
    const r = await f.show(j);
    if (r.canceled || r.selection === undefined) return;
    const o = botoes[r.selection];
    if (o === "por") await porNaEntrada(j, b);
    else if (o === "pegar") pegarSaida(j, b);
    else await verItem(j, b.typeId);
  });
}

export function registrarTelas(): void {
  world.afterEvents.playerInteractWithBlock.subscribe(({ player: j, block: b, itemStack, isFirstEvent }) => {
    if (!isFirstEvent || itemStack || j.isSneaking || !COM_TELA.has(b.typeId)) return;
    // Espera a tela própria do bloco (se ele tiver) abrir primeiro; se abriu, esta não abre (abrirUmMenu).
    system.runTimeout(() => {
      if (j.isValid && b.isValid && COM_TELA.has(b.typeId)) abrirTelaMaquina(j, b);
    }, 2);
  });
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_tela x y z escreve o texto da tela no log.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity }) => {
    if (id !== "cl:teste_tela" || !sourceEntity) return;
    const [x, y, z] = message.split(" ").map(Number);
    const b = sourceEntity.dimension.getBlock({ x, y, z });
    if (!b) return;
    const t = textoTela(b);
    const plano = (t.rawtext ?? []).map((m) => m.text ?? m.translate ?? "").join("");
    console.warn(`[TELA] ${b.typeId} tem_tela=${COM_TELA.has(b.typeId)}: ${plano.replace(/\n/g, " | ")}`);
  });
}

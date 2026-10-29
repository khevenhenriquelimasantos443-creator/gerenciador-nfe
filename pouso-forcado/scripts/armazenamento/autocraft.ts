import { Block, BlockCustomComponent, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { nomeDe } from "../catalogo/catalogo.js";
import { ITENS, RECEITAS_JSON, ReceitaJson } from "../catalogo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { coletarNaRede, consumir } from "../util/rede.js";
import { Inventario } from "./virtual.js";

/*
 * Fabricação automática do Applied Energistics (1.2.0), num bloco só: o Montador Molecular guarda até 9
 * padrões (receitas de bancada do jogo e do add-on, gravados gastando um Padrão ME em Branco). Ligado à
 * rede do Terminal por cabos, o Terminal ganha o botão "Fabricar": tira os ingredientes dos baús, barris
 * e células da rede, gasta 1 E por fabricação e entrega o resultado. Se faltar um ingrediente que outro
 * padrão da rede faz, fabrica ele antes (até 4 níveis).
 */
const MAX_PADROES = 9;
export const RECEITA = new Map(RECEITAS_JSON.filter((r) => r.tipo !== "fornalha" && r.estacoes.includes("crafting_table")).map((r) => [r.id, r]));
const padroesDe = (b: Block): string[] => ler<string[]>("padroes", b, []).filter((id) => RECEITA.has(id));

/** Ingredientes por fabricação: chave ("minecraft:x" ou "#tag") → quantidade. */
function ingredientes(r: ReceitaJson): Map<string, number> {
  const m = new Map<string, number>();
  if (r.grade && r.chaves) {
    for (const linha of r.grade) for (const c of linha) if (c !== " " && r.chaves[c]) m.set(r.chaves[c], (m.get(r.chaves[c]) ?? 0) + 1);
  } else for (const i of r.ingredientes ?? []) m.set(i.item, (m.get(i.item) ?? 0) + i.qtd);
  return m;
}
const serve = (chave: string, p: ItemStack) => (chave.startsWith("#") ? p.hasTag(chave.slice(1)) : p.typeId === chave);

function contar(lista: Inventario[], chave: string): number {
  let n = 0;
  for (const inv of lista) for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p && serve(chave, p)) n += p.amount;
  }
  return n;
}
function tirar(lista: Inventario[], chave: string, qtd: number): void {
  let falta = qtd;
  for (const inv of lista) for (let s = 0; s < inv.size && falta > 0; s++) {
    const p = inv.getItem(s);
    if (!p || !serve(chave, p)) continue;
    const n = Math.min(falta, p.amount);
    if (n === p.amount) inv.setItem(s, undefined);
    else {
      p.amount -= n;
      inv.setItem(s, p);
    }
    falta -= n;
  }
}
function guardar(lista: Inventario[], j: Player, id: string, qtd: number): void {
  let resto: ItemStack | undefined = new ItemStack(id, qtd);
  for (const inv of lista) {
    if (!resto) break;
    resto = inv.addItem(resto);
  }
  if (resto) darAoJogador(j, resto);
}

/** Os padrões de todos os Montadores da rede. */
function padroesDaRede(terminal: Block): ReceitaJson[] {
  const ids = new Set<string>();
  for (const m of coletarNaRede(terminal, (b) => b.typeId === "cl:montador_molecular", 8, 160)) for (const id of padroesDe(m)) ids.add(id);
  return [...ids].map((id) => RECEITA.get(id)!);
}

/**
 * Fabrica `vezes` a receita tirando da rede; ingredientes que faltam e têm padrão são fabricados antes.
 * Retorna a lista do que falta (vazia = deu certo). Com `simular`, só confere.
 */
export function fabricar(terminal: Block, lista: Inventario[], padroes: ReceitaJson[], r: ReceitaJson, vezes: number, j: Player, nivel = 0, faltas: string[] = []): string[] {
  for (const [chave, qtd] of ingredientes(r)) {
    const precisa = qtd * vezes;
    const tem = contar(lista, chave);
    if (tem >= precisa) continue;
    const sub = nivel < 4 && !chave.startsWith("#") ? padroes.find((p) => p.resultado === chave) : undefined;
    if (sub) fabricar(terminal, lista, padroes, sub, Math.ceil((precisa - tem) / sub.qtd), j, nivel + 1, faltas);
    const agora = contar(lista, chave);
    if (agora < precisa) faltas.push(`${precisa - agora}x ${chave.replace("minecraft:", "").replace("cl:", "")}`);
  }
  if (faltas.length) return faltas;
  if (j.getGameMode() !== GameMode.Creative) {
    for (let k = 0; k < vezes; k++) if (!consumir(terminal)) return ["energia"];
  }
  for (const [chave, qtd] of ingredientes(r)) tirar(lista, chave, qtd * vezes);
  guardar(lista, j, r.resultado, r.qtd * vezes);
  return [];
}

export const temMontador = (terminal: Block): boolean => coletarNaRede(terminal, (b) => b.typeId === "cl:montador_molecular", 1, 160).length > 0;

/** Menu "Fabricar" do Terminal. */
export async function menuFabricar(j: Player, terminal: Block, lista: () => Inventario[]): Promise<void> {
  const padroes = padroesDaRede(terminal);
  const f = new ActionFormData().title({ translate: "cl.ac.titulo" });
  for (const p of padroes) f.button({ rawtext: [nomeDe(p.resultado), { text: ` §7x${p.qtd}` }] });
  if (!padroes.length) f.body({ translate: "cl.ac.corpo", with: ["0"] });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || !padroes[r.selection]) return;
  const receita = padroes[r.selection];
  const vezes = [1, 4, 16, 64];
  const q = new ActionFormData().title({ translate: "cl.ac.quanto", with: { rawtext: [nomeDe(receita.resultado)] } });
  for (const v of vezes) q.button({ translate: "cl.ac.vezes", with: [String(v), String(v * receita.qtd)] });
  const rq = await q.show(j);
  if (rq.canceled || rq.selection === undefined) return;
  const n = vezes[rq.selection];
  const faltas = fabricar(terminal, lista(), padroes, receita, n, j);
  if (faltas[0] === "energia") return aviso(j, "cl.ac.sem_energia", 5);
  if (faltas.length) return aviso(j, { translate: "cl.ac.falta", with: [faltas.slice(0, 4).join(", ")] }, 6);
  j.playSound("random.anvil_use", { pitch: 1.5, volume: 0.6 });
  aviso(j, { translate: "cl.ac.feito", with: { rawtext: [nomeDe(receita.resultado), { text: String(n * receita.qtd) }] } }, 5);
  registrarAcao(j, "autocraft");
}

// ---------- o bloco ----------
function nomeReceita(r: ReceitaJson): RawMessage {
  return { rawtext: [nomeDe(r.resultado), { text: r.qtd > 1 ? ` §7x${r.qtd}` : "" }] };
}

async function gravarPadrao(j: Player, b: Block): Promise<void> {
  const atuais = padroesDe(b);
  if (atuais.length >= MAX_PADROES) return aviso(j, "cl.ac.cheio");
  const inv = j.getComponent("minecraft:inventory")?.container;
  const criativo = j.getGameMode() === GameMode.Creative;
  let slotVazio = -1;
  for (let s = 0; inv && s < inv.size; s++) if (inv.getItem(s)?.typeId === "cl:padrao_me_vazio") slotVazio = s;
  if (!criativo && slotVazio < 0) return aviso(j, "cl.ac.sem_padrao", 5);
  const rp = await new ModalFormData().title({ translate: "cl.ac.titulo" }).textField({ translate: "cl.ac.procurar" }, "").show(j);
  if (rp.canceled || !rp.formValues) return;
  const filtro = String(rp.formValues[0] ?? "").trim().toLowerCase();
  if (!filtro) return;
  const achadas = [...RECEITA.values()]
    .filter((r) => {
      const info = ITENS[r.resultado];
      return r.resultado.toLowerCase().includes(filtro) || info?.pt.toLowerCase().includes(filtro) || info?.en.toLowerCase().includes(filtro);
    })
    .slice(0, 24);
  if (!achadas.length) return aviso(j, "cl.ac.nenhuma", 5);
  const f = new ActionFormData().title({ translate: "cl.ac.titulo" });
  for (const r of achadas) f.button(nomeReceita(r));
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || !b.isValid) return;
  const escolhida = achadas[r.selection];
  if (!criativo && inv) {
    const p = inv.getItem(slotVazio);
    if (p?.typeId !== "cl:padrao_me_vazio") return aviso(j, "cl.ac.sem_padrao", 5);
    if (p.amount > 1) {
      p.amount--;
      inv.setItem(slotVazio, p);
    } else inv.setItem(slotVazio, undefined);
  }
  gravar("padroes", b, [...padroesDe(b), escolhida.id]);
  aviso(j, { translate: "cl.ac.gravado", with: { rawtext: [nomeDe(escolhida.resultado)] } }, 5);
}

async function menuMontador(j: Player, b: Block): Promise<void> {
  const atuais = padroesDe(b);
  const f = new ActionFormData().title({ translate: "cl.ac.titulo" }).body({ translate: "cl.ac.corpo", with: [String(atuais.length)] });
  f.button({ translate: "cl.ac.gravar" });
  for (const id of atuais) f.button(nomeReceita(RECEITA.get(id)!));
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || !b.isValid) return;
  if (r.selection === 0) return gravarPadrao(j, b);
  const resto = atuais.filter((_, i) => i !== r.selection! - 1);
  gravar("padroes", b, resto.length ? resto : undefined);
  // O padrão apagado volta como Padrão em Branco.
  if (j.getGameMode() !== GameMode.Creative) darAoJogador(j, "cl:padrao_me_vazio", 1);
  return menuMontador(j, b);
}

export const montadorMolecular: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) system.run(() => abrirUmMenu(j, () => menuMontador(j, e.block)));
  },
};

export function registrarAutocraft(): void {
  // Quebrado, o montador devolve os padrões como Padrões em Branco.
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== "cl:montador_molecular") return;
    const n = lerEm<string[]>("padroes", block.dimension, block.location, []).length;
    gravarEm("padroes", block.dimension, block.location, undefined);
    if (n) block.dimension.spawnItem(new ItemStack("cl:padrao_me_vazio", n), block.center());
  });
}

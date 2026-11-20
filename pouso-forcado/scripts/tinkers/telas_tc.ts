import { Block, BlockCustomComponent, Container, Entity, GameMode, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { abrirUmMenu } from "../util/menus.js";
import { intervalo } from "../util/perfil.js";
import { Mat, TIPOS, Tipo, consertar, criarFerramenta, durabilidade, ferramentaDe, modsDe } from "./ferramenta.js";
import { FERR, Gasto, METAL, MODS, PECAS, PECA_MATS, UNIDADE, bigorna, estacao, itemDeConserto, materialDoItem, modificarItem, porItemConserto, receitaDe } from "./mesas.js";

/*
 * 1.56.0: as mesas do Tinkers' Construct com tela de espaços, como no Java (TC3). Um bloco não tem tela própria no
 * Bedrock: em cima da mesa fica uma entidade invisível com a tela de baú do jogo (27 espaços), e os espaços que não
 * são de usar ficam tapados (cl:gui_*: enfeite, setas e rótulos, que somem se saírem da tela).
 * - Construtor de Peças: Padrão em Branco + material à esquerda; à direita aparecem as peças que dá para fazer.
 *   Pegar uma peça gasta 1 padrão em branco (como no TC3; um padrão de peça da Mesa de Moldes não se gasta) e o custo
 *   em material.
 * - Estação de Ferramentas (3 peças) e Bigorna do Tinker (4): peças no meio -> a ferramenta aparece à direita; com a
 *   ferramenta à esquerda, o material da cabeça conserta e os itens de um modificador modificam. Pegar o resultado
 *   gasta as entradas. Agachado + tocar abre o menu antigo (traços, montar com as peças da mochila).
 * O que está à direita é só a prévia: o script vê (a cada 2 ticks) que ela saiu do espaço e então cobra as entradas;
 * se as entradas sumiram na mesma hora, a prévia é tirada de volta do jogador.
 * Custo: só as mesas com alguém a até 8 blocos (a lista é refeita a cada segundo).
 */
type Tela = "pecas" | "estacao" | "bigorna";
const ENT: Readonly<Record<Tela, string>> = { pecas: "cl:mesa_tc_pecas", estacao: "cl:mesa_tc_estacao", bigorna: "cl:mesa_tc_bigorna" };
const TELA_DE_ENT = new Map<string, Tela>(Object.entries(ENT).map(([t, e]) => [e, t as Tela]));
const TELA_DO_BLOCO: Readonly<Record<string, Tela>> = {
  "cl:construtor_pecas": "pecas", "cl:estacao_ferramentas": "estacao", "cl:bigorna": "bigorna", "cl:bigorna_chamuscada": "bigorna",
};
const ehGui = (id: string | undefined) => !!id?.startsWith("cl:gui_");
const MAT_OK = new Set(Object.keys(DADOS_F15.materiais));
const P_PREV = "cl:tc_prev";

type Layout = { fixos: ReadonlyMap<number, string>; entradas: readonly number[]; saidas: readonly number[] };
function fazerLayout(t: Tela): Layout {
  const fixos = new Map<number, string>();
  for (let k = 0; k < 27; k++) fixos.set(k, "cl:gui_vazio");
  let entradas: number[], saidas: number[];
  if (t === "pecas") {
    fixos.set(0, "cl:gui_padrao").set(1, "cl:gui_material").set(11, "cl:gui_seta").set(18, "cl:gui_ajuda_pecas");
    entradas = [9, 10]; // padrão, material
    saidas = [3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25, 26];
  } else {
    const meio = [11, 12, 13, 14].slice(0, t === "bigorna" ? 4 : 3);
    fixos.set(0, "cl:gui_ferramenta").set(15, "cl:gui_seta").set(18, "cl:gui_ajuda_estacao");
    for (const k of meio) fixos.set(k - 9, "cl:gui_pecas");
    entradas = [9, ...meio]; // a ferramenta (9) e o meio
    saidas = [16];
  }
  for (const k of [...entradas, ...saidas]) fixos.delete(k);
  return { fixos, entradas, saidas };
}
const LAYOUT: Readonly<Record<Tela, Layout>> = { pecas: fazerLayout("pecas"), estacao: fazerLayout("estacao"), bigorna: fazerLayout("bigorna") };

// O que cada prévia (à direita) cobra quando sai do espaço.
type Prev =
  | { k: "peca"; id: string; peca: string; mat: string; custo: number; branco: boolean }
  | { k: "montar"; id: string; usa: [number, string][] }
  | { k: "consertar"; id: string; usa: number; rep: string; ganho: number }
  | { k: "mod"; id: string; m: string; gasto: Gasto };
type Prevs = Record<number, Prev>;
type Calculo = { saidas?: Record<number, { item: ItemStack; prev: Prev }>; msg?: RawMessage | string };

function lerPrev(m: Entity): Prevs {
  try {
    const v = m.getDynamicProperty(P_PREV);
    return typeof v === "string" ? (JSON.parse(v) as Prevs) : {};
  } catch {
    return {};
  }
}

// ---------- contas das entradas ----------
const unidades = (i: ItemStack) => Math.floor(i.amount * (UNIDADE[i.typeId] ?? 1));
/** "cl:peca_cabo_resistente_pedra" -> { peca: "cabo_resistente", mat: "pedra" } */
function pecaDe(id: string): { peca: string; mat: Mat } | undefined {
  if (!id.startsWith("cl:peca_")) return undefined;
  const resto = id.slice(8);
  for (const p of Object.keys(PECAS)) {
    if (!resto.startsWith(`${p}_`)) continue;
    const mat = resto.slice(p.length + 1);
    if (MAT_OK.has(mat)) return { peca: p, mat: mat as Mat };
  }
  return undefined;
}
const mesmasPecas = (a: readonly string[], b: readonly string[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

function calcPecas(c: Container): Calculo {
  const P = c.getItem(9), M = c.getItem(10);
  if (!M) return {};
  const mat = materialDoItem(M.typeId);
  if (!mat) return { msg: "cl.tct.nao_material" };
  if (METAL(mat)) return { msg: "cl.tc.pecas_metal" };
  const branco = P?.typeId === "cl:padrao_branco";
  const especifico = P && !branco && P.typeId.startsWith("cl:padrao_") ? P.typeId.slice("cl:padrao_".length) : undefined;
  if (!branco && !(especifico && PECAS[especifico])) return {};
  const tem = unidades(M);
  const lista = (especifico ? [especifico] : Object.keys(PECAS)).filter((p) => (PECA_MATS[p] ?? [mat]).includes(mat) && PECAS[p].custo <= tem);
  const saidas: NonNullable<Calculo["saidas"]> = {};
  let k = 0;
  for (const p of lista) {
    const id = `cl:peca_${p}_${mat}`;
    let item: ItemStack;
    try {
      item = new ItemStack(id, 1);
    } catch {
      continue; // peça que não existe nesse material
    }
    const s = LAYOUT.pecas.saidas[k++];
    if (s === undefined) break;
    saidas[s] = { item, prev: { k: "peca", id, peca: p, mat, custo: PECAS[p].custo, branco } };
  }
  return k ? { saidas } : { msg: "cl.tct.sem_peca" };
}

function calcEstacao(c: Container, t: Tela): Calculo {
  const L = LAYOUT[t];
  const T = c.getItem(9);
  const itens: [number, ItemStack][] = [];
  for (const s of L.entradas.slice(1)) {
    const i = c.getItem(s);
    if (i) itens.push([s, i]);
  }
  if (!itens.length) return {};
  const OUT = L.saidas[0];
  if (!T) {
    // Montar: as peças do meio formam uma ferramenta.
    const pecas: { s: number; id: string; peca: string; mat: Mat }[] = [];
    for (const [s, i] of itens) {
      const pm = pecaDe(i.typeId);
      if (!pm) return {}; // material de conserto sem a ferramenta, ou outra coisa: nada a fazer
      pecas.push({ s, id: i.typeId, ...pm });
    }
    const nomes = pecas.map((p) => p.peca);
    const tipo = TIPOS.find((x) => mesmasPecas(FERR[x].pecas, nomes) && (t === "bigorna" || FERR[x].pecas.length <= 3));
    if (!tipo) return { msg: TIPOS.some((x) => mesmasPecas(FERR[x].pecas, nomes)) ? "cl.tc.precisa_bigorna" : "cl.tct.sem_receita" };
    // As peças na ordem da receita (cabeça primeiro), como o menu antigo.
    const resto = [...pecas];
    const ordem = FERR[tipo].pecas.map((p) => resto.splice(resto.findIndex((x) => x.peca === p), 1)[0]);
    const receita = FERR[tipo].pecas;
    const kCabo = receita.findIndex((p) => PECAS[p]?.stat === "handle");
    const kLig = receita.findIndex((p, k) => k > 0 && PECAS[p]?.stat === "binding");
    const cabo = kCabo >= 0 ? ordem[kCabo].mat : ordem[ordem.length - 1].mat;
    const item = criarFerramenta(tipo as Tipo, ordem[0].mat, cabo, kLig >= 0 ? ordem[kLig].mat : undefined);
    return { saidas: { [OUT]: { item, prev: { k: "montar", id: item.typeId, usa: ordem.map((x) => [x.s, x.id]) } } } };
  }
  const f = ferramentaDe(T.typeId);
  if (!f) return {};
  // Consertar: só o material da cabeça no meio.
  const rep = itemDeConserto(f.mat);
  const ehRep = (id: string) => (f.mat === "madeira" ? id.endsWith("_planks") : id === rep);
  if (itens.every(([, i]) => ehRep(i.typeId))) {
    const novo = T.clone();
    const { dur, max } = durabilidade(novo);
    if (dur >= max) return { msg: "cl.tct.cheia" };
    const porItem = porItemConserto(novo, f.tipo, f.mat);
    const usa = Math.min(Math.ceil((max - dur) / porItem), itens.reduce((n, [, i]) => n + i.amount, 0));
    const ganho = consertar(novo, usa * porItem);
    return { saidas: { [OUT]: { item: novo, prev: { k: "consertar", id: T.typeId, usa, rep: f.mat === "madeira" ? "planks" : rep, ganho } } } };
  }
  // Modificar: os itens do meio são exatamente os de um modificador.
  const tem = new Map<string, number>();
  for (const [, i] of itens) tem.set(i.typeId, (tem.get(i.typeId) ?? 0) + i.amount);
  const mods = modsDe(T);
  let erro: RawMessage | string | undefined;
  for (const [m, d] of Object.entries(MODS)) {
    const r = m === "slime" ? [[d.item, 1] as const] : receitaDe(d, mods[m] ?? 0);
    const ids = new Set(r.map(([id]) => id));
    if (ids.size !== tem.size || ![...tem.keys()].every((id) => ids.has(id))) continue;
    const novo = T.clone();
    const res = modificarItem(novo, m, t === "bigorna", (id) => tem.get(id) ?? 0);
    if ("erro" in res) {
      erro ??= res.erro;
      continue;
    }
    return { saidas: { [OUT]: { item: novo, prev: { k: "mod", id: T.typeId, m, gasto: res.gasto } } } };
  }
  return { msg: erro ?? "cl.tct.sem_receita" };
}

// ---------- cobrar as entradas ----------
function tirarDoEspaco(c: Container, s: number, n: number): void {
  const i = c.getItem(s);
  if (!i) return;
  if (i.amount > n) {
    i.amount -= n;
    c.setItem(s, i);
  } else c.setItem(s, undefined);
}
/** Tira `n` itens que passam em `serve` dos espaços `slots`. */
function tirarDosEspacos(c: Container, slots: readonly number[], serve: (id: string) => boolean, n: number): void {
  for (const s of slots) {
    if (n <= 0) return;
    const i = c.getItem(s);
    if (!i || !serve(i.typeId)) continue;
    const q = Math.min(n, i.amount);
    tirarDoEspaco(c, s, q);
    n -= q;
  }
}
const somar = (c: Container, slots: readonly number[], serve: (id: string) => boolean) =>
  slots.reduce((n, s) => {
    const i = c.getItem(s);
    return i && serve(i.typeId) ? n + i.amount : n;
  }, 0);

function pagar(c: Container, t: Tela, p: Prev): boolean {
  const meio = LAYOUT[t].entradas.slice(1);
  if (p.k === "peca") {
    const P = c.getItem(9), M = c.getItem(10);
    if (P?.typeId !== (p.branco ? "cl:padrao_branco" : `cl:padrao_${p.peca}`)) return false;
    if (!M || materialDoItem(M.typeId) !== p.mat || unidades(M) < p.custo) return false;
    if (p.branco) tirarDoEspaco(c, 9, 1);
    tirarDoEspaco(c, 10, Math.round(p.custo / (UNIDADE[M.typeId] ?? 1)));
    return true;
  }
  if (p.k === "montar") {
    if (!p.usa.every(([s, id]) => c.getItem(s)?.typeId === id)) return false;
    for (const [s] of p.usa) tirarDoEspaco(c, s, 1);
    return true;
  }
  if (c.getItem(9)?.typeId !== p.id) return false;
  if (p.k === "consertar") {
    const serve = (id: string) => (p.rep === "planks" ? id.endsWith("_planks") : id === p.rep);
    if (somar(c, meio, serve) < p.usa) return false;
    c.setItem(9, undefined);
    tirarDosEspacos(c, meio, serve, p.usa);
    return true;
  }
  if (!p.gasto.every(([id, n]) => somar(c, meio, (x) => x === id) >= n)) return false;
  c.setItem(9, undefined);
  for (const [id, n] of p.gasto) tirarDosEspacos(c, meio, (x) => x === id, n);
  return true;
}

function efeito(j: Player | undefined, p: Prev): void {
  if (!j) return;
  const nome: RawMessage = { translate: new ItemStack(p.id).localizationKey };
  if (p.k === "peca") {
    j.playSound("dig.stone", { pitch: 1.4 });
    registrarAcao(j, "peca");
  } else if (p.k === "montar") {
    j.playSound("random.anvil_use", { volume: 0.6 });
    aviso(j, { translate: "cl.tc.montou", with: { rawtext: [nome] } });
    registrarAcao(j, "montar_ferramenta");
  } else if (p.k === "consertar") {
    j.playSound("random.anvil_use", { volume: 0.6 });
    aviso(j, { translate: "cl.tc.consertou", with: [String(p.ganho)] });
    registrarAcao(j, "consertar");
  } else {
    j.playSound("random.orb");
    aviso(j, { translate: "cl.tc.mod_feito", with: { rawtext: [{ translate: `cl.tc.mod.${p.m}` }] } });
    registrarAcao(j, "modificar");
    if (MODS[p.m]?.tipo === "habilidade") registrarAcao(j, "tc3_habilidade");
  }
}

// ---------- jogadores em volta ----------
function jogadoresPerto(m: Entity): Player[] {
  try {
    return m.dimension.getPlayers({ location: m.location, maxDistance: 8 });
  } catch {
    return [];
  }
}
/** Tira de volta do jogador (cursor ou mochila) uma prévia que ele levou sem as entradas estarem lá. */
function recuperar(m: Entity, id: string): void {
  for (const j of jogadoresPerto(m)) {
    const cur = j.getComponent("minecraft:cursor_inventory");
    if (cur?.item?.typeId === id) return cur.clear();
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) continue;
    for (let s = 0; s < inv.size; s++) {
      if (inv.getItem(s)?.typeId !== id) continue;
      return tirarDoEspaco(inv, s, 1);
    }
  }
}
/** Some com os enfeites da tela que foram parar no jogador. */
function limparGui(m: Entity): void {
  for (const j of jogadoresPerto(m)) {
    const cur = j.getComponent("minecraft:cursor_inventory");
    if (ehGui(cur?.item?.typeId)) cur?.clear();
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (inv) for (let s = 0; s < inv.size; s++) if (ehGui(inv.getItem(s)?.typeId)) inv.setItem(s, undefined);
  }
}
/** Devolve ao jogador mais perto um item posto onde não devia (ou solta no chão). */
function devolver(m: Entity, i: ItemStack): void {
  if (ehGui(i.typeId)) return;
  const j = jogadoresPerto(m)[0];
  const resto = j ? j.getComponent("minecraft:inventory")?.container?.addItem(i) : i;
  if (resto) m.dimension.spawnItem(resto, m.location);
}

// ---------- o laço da tela ----------
const assinaturas = new Map<string, string>();
function assinatura(c: Container, L: Layout): string {
  return L.entradas
    .map((s) => {
      const i = c.getItem(s);
      if (!i) return "-";
      let extra = "";
      if (i.maxAmount === 1)
        try {
          extra = i.getDynamicPropertyIds().map((k) => `${k}=${i.getDynamicProperty(k)}`).join(",");
        } catch {
          // item sem dados
        }
      return `${i.typeId}x${i.amount}${extra}`;
    })
    .join("|");
}

export function processar(m: Entity, t: Tela): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  const L = LAYOUT[t];
  const prev = lerPrev(m);
  let mudou = false;
  // 1) Prévia que saiu do espaço: cobra as entradas (ou toma de volta).
  for (const s of L.saidas) {
    const p = prev[s];
    if (!p || c.getItem(s)?.typeId === p.id) continue;
    delete prev[s];
    mudou = true;
    if (pagar(c, t, p)) efeito(jogadoresPerto(m)[0], p);
    else recuperar(m, p.id);
  }
  // 2) Item do jogador posto à direita: volta para ele.
  for (const s of L.saidas) {
    const i = c.getItem(s);
    if (!i || prev[s]?.id === i.typeId) continue;
    c.setItem(s, undefined);
    devolver(m, i);
    mudou = true;
  }
  // 3) Enfeites no lugar (se algum saiu, some com ele do jogador).
  let tirouGui = false;
  for (const [s, id] of L.fixos) {
    const i = c.getItem(s);
    if (i?.typeId === id) continue;
    if (i) devolver(m, i);
    tirouGui = true;
    c.setItem(s, new ItemStack(id, 1));
  }
  // 4) Enfeite posto numa entrada: some.
  for (const s of L.entradas)
    if (ehGui(c.getItem(s)?.typeId)) {
      c.setItem(s, undefined);
      tirouGui = true;
    }
  if (tirouGui) limparGui(m);
  // 5) As prévias de agora (só quando as entradas mudaram).
  const sig = assinatura(c, L);
  if (!mudou && assinaturas.get(m.id) === sig) return;
  assinaturas.set(m.id, sig);
  const calc = t === "pecas" ? calcPecas(c) : calcEstacao(c, t);
  for (const s of L.saidas) {
    const d = calc.saidas?.[s];
    if (d) {
      c.setItem(s, d.item);
      prev[s] = d.prev;
    } else if (prev[s]) {
      c.setItem(s, undefined);
      delete prev[s];
    }
  }
  m.setDynamicProperty(P_PREV, JSON.stringify(prev));
  if (calc.msg) {
    const j = jogadoresPerto(m)[0];
    if (j) aviso(j, calc.msg, 5);
  }
}

// ---------- a entidade da mesa ----------
const centro = (b: Vector3): Vector3 => ({ x: b.x + 0.5, y: b.y - 0.01, z: b.z + 0.5 });
const blocoDe = (m: Entity) => m.dimension.getBlock({ x: Math.floor(m.location.x), y: Math.floor(m.location.y + 0.1), z: Math.floor(m.location.z) });

export function garantirMesa(b: Block): Entity | undefined {
  const t = TELA_DO_BLOCO[b.typeId];
  if (!t) return undefined;
  try {
    const ja = b.dimension.getEntities({ type: ENT[t], location: centro(b), maxDistance: 0.6 })[0];
    if (ja) return ja;
    const m = b.dimension.spawnEntity(ENT[t], centro(b));
    processar(m, t);
    return m;
  } catch {
    return undefined;
  }
}

/** A mesa saiu (quebrada, explodida, trocada por comando): solta as entradas e some com a entidade. */
function desmontar(m: Entity, t: Tela): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (c)
    for (const s of LAYOUT[t].entradas) {
      const i = c.getItem(s);
      if (i && !ehGui(i.typeId)) m.dimension.spawnItem(i, m.location);
    }
  c?.clearAll();
  assinaturas.delete(m.id);
  m.remove();
}

/** Componente das mesas: o primeiro toque (mesa de antes da 1.56.0, ou posta por estrutura) põe a tela. */
export const mesaTelaComp: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    system.run(() => {
      if (!block.isValid || !garantirMesa(block) || !player) return;
      aviso(player, "cl.tct.abra", 3);
    });
  },
};

let ativas: { m: Entity; t: Tela }[] = [];
export function registrarTelasTinkers(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const t = TELA_DO_BLOCO[block.typeId];
    if (!t || !garantirMesa(block)) return;
    aviso(player, t === "pecas" ? "cl.tct.dica_pecas" : "cl.tct.dica_estacao", 6);
  });
  // Agachado + tocar: o menu antigo (traços, montar com as peças da mochila).
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const t = TELA_DE_ENT.get(ev.target.typeId);
    if (!t || !ev.player.isSneaking) return;
    ev.cancel = true;
    const j = ev.player;
    system.run(() => {
      if (t === "pecas") return aviso(j, "cl.tct.dica_pecas", 5);
      abrirUmMenu(j, () => (t === "bigorna" ? bigorna(j) : estacao(j)));
    });
  });
  // Bater na mesa: ela sai (com o que estava nas entradas).
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: j, hitEntity: m }) => {
    const t = TELA_DE_ENT.get(m.typeId);
    if (!t || !(j instanceof Player)) return;
    system.run(() => {
      if (!m.isValid) return;
      const b = blocoDe(m);
      const id = b?.typeId;
      desmontar(m, t);
      if (!b || !id || !TELA_DO_BLOCO[id]) return;
      b.setType("minecraft:air");
      if (j.getGameMode() !== GameMode.Creative) b.dimension.spawnItem(new ItemStack(id, 1), centro(b));
      j.playSound("dig.wood");
    });
  });
  // Enfeite da tela jogado no chão: some.
  world.afterEvents.entitySpawn.subscribe(({ entity }) => {
    if (entity.typeId !== "minecraft:item") return;
    try {
      if (ehGui(entity.getComponent("minecraft:item")?.itemStack.typeId)) entity.remove();
    } catch {
      // já sumiu
    }
  });
  // A cada segundo: as mesas com alguém perto (e as que perderam o bloco).
  intervalo("telas do tinkers (lista)", () => {
    const vistas = new Map<string, { m: Entity; t: Tela }>();
    for (const j of world.getPlayers())
      for (const m of j.dimension.getEntities({ families: ["mesa_tc"], location: j.location, maxDistance: 8 })) {
        const t = TELA_DE_ENT.get(m.typeId);
        if (!t || vistas.has(m.id)) continue;
        if (TELA_DO_BLOCO[blocoDe(m)?.typeId ?? ""] === undefined) {
          desmontar(m, t);
          continue;
        }
        vistas.set(m.id, { m, t });
      }
    ativas = [...vistas.values()];
  }, 20);
  intervalo("telas do tinkers", () => {
    for (const { m, t } of ativas) if (m.isValid) processar(m, t);
  }, 2);
  // Para os testes no servidor: /scriptevent cl:teste_tct <x> <y> <z> põe a tela da mesa e escreve o que ela mostra.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity }) => {
    if (id !== "cl:teste_tct" || !sourceEntity) return;
    const [x, y, z] = message.split(" ").map(Number);
    const b = sourceEntity.dimension.getBlock({ x, y, z });
    const m = b && garantirMesa(b);
    if (!m) return console.warn("[TCT] sem mesa");
    const t = TELA_DE_ENT.get(m.typeId) as Tela;
    processar(m, t);
    const c = m.getComponent("minecraft:inventory")?.container;
    const itens: string[] = [];
    if (c) for (let s = 0; s < c.size; s++) {
      const i = c.getItem(s);
      if (i && !ehGui(i.typeId)) itens.push(`${s}:${i.typeId}x${i.amount}`);
    }
    console.warn(`[TCT] ${m.typeId} ${itens.join(" ")}`);
  });
}

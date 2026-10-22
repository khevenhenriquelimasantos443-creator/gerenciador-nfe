import { Block, BlockCustomComponent, Dimension, GameMode, ItemStack, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FUNDICAO } from "../config.js";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * Fundição do Tinkers' Construct (Fase 16). Multibloco validado só ao tocar no controlador:
 * - piso 3x3 de Tijolos Refratários; interior 3x3 vazio atrás do controlador; em cada camada (até
 *   FUNDICAO.maxCamadas) uma parede de 12 blocos refratários (tijolos, vidro, tanque, dreno, o controlador);
 * - pelo menos um Tanque Refratário com lava (toque com balde de lava: +1.000 mB).
 * Pronta, o controlador (tick de 1 s) puxa os itens jogados no interior e derrete até
 * FUNDICAO.derretePorSegundo por segundo, gastando lava; o metal fica em mB (144 = 1 lingote), em camadas
 * (o primeiro que derreteu sai primeiro). Ligas: bronze (3 cobre + 1 estanho) e aço (ferro + carvão).
 * Saída: Torneira encostada num Dreno, em cima de uma Mesa (molde de lingote, pepita ou peça) ou Bacia (bloco).
 * Molde: ponha uma peça, lingote ou pepita na mesa e derrame 288 mB de ouro.
 * Quebrar qualquer bloco refratário desmonta as fundições em volta (até tocar no controlador de novo).
 * Custo: 1 busca de itens no interior por segundo por fundição pronta.
 */
type Fundicao = { ok: boolean; h: number; cap: number; tanques: Vector3[]; drenos: Vector3[]; metais: [string, number][] };
type Mesa = { item?: string; pronto?: string };
const T = "fundicao";
const PAREDE = new Set(["cl:tijolos_refratarios", "cl:vidro_refratario", "cl:tanque_refratario", "cl:dreno_fundicao", "cl:controlador_fundicao"]);
const DIRS: Readonly<Record<string, [number, number]>> = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] };
const PECAS = DADOS_F15.pecas as Readonly<Record<string, { custo: number }>>;
const METAIS_FERRAMENTA = new Set(["ferro", "cobre", "bronze", "aco"]);
const nomeMetal = (m: string): RawMessage => ({ translate: `cl.fun.metal.${m}` });
const nomeItem = (id: string): RawMessage => ({ translate: `item.${id}.name` });
const indice = () => (JSON.parse((world.getDynamicProperty("cl:fundicoes") as string | undefined) ?? "[]") as string[]);

function valorDe(id: string): readonly [string, number] | undefined {
  const v = FUNDICAO.valores[id];
  if (v) return v;
  const m = /^cl:peca_(.+)_(ferro|cobre|bronze|aco)$/.exec(id);
  return m && PECAS[m[1]] ? [m[2], PECAS[m[1]].custo * 144] : undefined;
}

function bloco(dim: Dimension, p: Vector3): Block | undefined {
  try {
    return dim.getBlock(p);
  } catch {
    return undefined;
  }
}

/** Confere a estrutura a partir do controlador. Retorna o motivo se não fechar. */
function validar(c: Block): { f?: Omit<Fundicao, "metais">; erro?: string } {
  const [dx, dz] = DIRS[lerEstado<string>(c, "minecraft:cardinal_direction")] ?? [0, -1];
  const cx = c.x + dx * 2, cz = c.z + dz * 2, y0 = c.y;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++)
    if (bloco(c.dimension, { x: cx + a, y: y0 - 1, z: cz + b })?.typeId !== "cl:tijolos_refratarios") return { erro: "piso" };
  const tanques: Vector3[] = [], drenos: Vector3[] = [];
  let h = 0;
  for (; h < FUNDICAO.maxCamadas; h++) {
    const y = y0 + h;
    let interiorOk = true;
    for (let a = -1; a <= 1 && interiorOk; a++) for (let b = -1; b <= 1; b++)
      if (!bloco(c.dimension, { x: cx + a, y, z: cz + b })?.isAir) interiorOk = false;
    const parede: Vector3[] = [];
    for (let k = -1; k <= 1; k++) parede.push({ x: cx + k, y, z: cz - 2 }, { x: cx + k, y, z: cz + 2 }, { x: cx - 2, y, z: cz + k }, { x: cx + 2, y, z: cz + k });
    const blocos = parede.map((p) => bloco(c.dimension, p));
    const paredeOk = blocos.every((b) => b && PAREDE.has(b.typeId));
    if (!interiorOk || !paredeOk) {
      if (h === 0) return { erro: interiorOk ? "parede" : "interior" };
      break;
    }
    for (const b of blocos) {
      if (b!.typeId === "cl:tanque_refratario") tanques.push(b!.location);
      if (b!.typeId === "cl:dreno_fundicao") drenos.push(b!.location);
    }
  }
  if (tanques.length === 0) return { erro: "tanque" };
  return { f: { ok: true, h, cap: h * FUNDICAO.capacidadePorCamada, tanques, drenos } };
}

const lerF = (c: Block): Fundicao => ler<Fundicao>(T, c, { ok: false, h: 0, cap: 0, tanques: [], drenos: [], metais: [] });
const total = (f: Fundicao) => f.metais.reduce((s, [, v]) => s + v, 0);
const lavaDe = (dim: Dimension, p: Vector3) => lerEm<number>("tanque", dim, p, 0);
const lavaTotal = (dim: Dimension, f: Fundicao) => f.tanques.reduce((s, p) => s + lavaDe(dim, p), 0);

function gastarLava(dim: Dimension, f: Fundicao, mb: number): boolean {
  if (lavaTotal(dim, f) < mb) return false;
  for (const p of f.tanques) {
    const tem = lavaDe(dim, p);
    const tira = Math.min(tem, mb);
    if (tira <= 0) continue;
    gravarEm("tanque", dim, p, tem - tira);
    const t = bloco(dim, p);
    if (t?.typeId === "cl:tanque_refratario") definirEstado(t, "cl:nivel", Math.ceil((tem - tira) / 1000));
    mb -= tira;
    if (mb <= 0) break;
  }
  return true;
}

function somar(f: Fundicao, metal: string, mb: number): void {
  const linha = f.metais.find(([m]) => m === metal);
  if (linha) linha[1] += mb;
  else f.metais.push([metal, mb]);
}

function tirar(f: Fundicao, metal: string, mb: number): void {
  const linha = f.metais.find(([m]) => m === metal);
  if (!linha) return;
  linha[1] -= mb;
  f.metais = f.metais.filter(([, v]) => v > 0);
}

const qtd = (f: Fundicao, metal: string) => f.metais.find(([m]) => m === metal)?.[1] ?? 0;

/** Bronze sozinho; aço quando tem carvão e ferro. */
function ligas(f: Fundicao): void {
  const { cobre, estanho, sai } = FUNDICAO.bronze;
  while (qtd(f, "cobre") >= cobre && qtd(f, "estanho") >= estanho) {
    tirar(f, "cobre", cobre);
    tirar(f, "estanho", estanho);
    somar(f, "bronze", sai);
  }
}

function tick(c: Block): void {
  const f = lerF(c);
  if (!f.ok) return;
  const [dx, dz] = DIRS[lerEstado<string>(c, "minecraft:cardinal_direction")] ?? [0, -1];
  const canto = { x: c.x + dx * 2 - 1, y: c.y, z: c.z + dz * 2 - 1 };
  const itens = c.dimension.getEntities({ type: "minecraft:item", location: canto, volume: { x: 3, y: f.h, z: 3 } });
  if (itens.length === 0) return;
  let derreteu = 0, mudou = false;
  for (const e of itens) {
    if (derreteu >= FUNDICAO.derretePorSegundo) break;
    const pilha = e.getComponent("minecraft:item")?.itemStack;
    if (!pilha) continue;
    // Aço: carvão + 144 mB de ferro.
    if ((FUNDICAO.acoCom as readonly string[]).includes(pilha.typeId)) {
      let n = 0;
      while (n < pilha.amount && qtd(f, "ferro") >= 144) {
        tirar(f, "ferro", 144);
        somar(f, "aco", 144);
        n++;
      }
      if (n > 0) {
        consumirEntidade(e, pilha, n);
        mudou = true;
      }
      continue;
    }
    const v = valorDe(pilha.typeId);
    if (!v) continue;
    let n = 0;
    while (n < pilha.amount && derreteu < FUNDICAO.derretePorSegundo && total(f) + v[1] <= f.cap) {
      if (!gastarLava(c.dimension, f, FUNDICAO.lavaPorItem)) break;
      somar(f, v[0], v[1]);
      n++;
      derreteu++;
    }
    if (n > 0) {
      consumirEntidade(e, pilha, n);
      mudou = true;
    }
  }
  if (!mudou) return;
  ligas(f);
  gravar(T, c, f);
  c.dimension.playSound("bucket.fill_lava", c.center(), { volume: 0.4 });
  const quem = c.dimension.getPlayers({ location: c.center(), maxDistance: 16, closest: 1 })[0];
  if (quem) for (let i = 0; i < derreteu; i++) registrarAcao(quem, "derreter");
}

function consumirEntidade(e: { location: Vector3; dimension: Dimension; remove(): void }, pilha: ItemStack, n: number): void {
  const resto = pilha.amount - n;
  const onde = e.location, dim = e.dimension;
  e.remove();
  if (resto > 0) {
    const p = pilha.clone();
    p.amount = resto;
    dim.spawnItem(p, onde);
  }
}

async function menuControlador(j: Player, c: Block): Promise<void> {
  const v = validar(c);
  const antigo = lerF(c);
  if (!v.f) {
    gravar(T, c, { ...antigo, ok: false });
    const r = await new ActionFormData()
      .title({ translate: "cl.fun.titulo" })
      .body({ rawtext: [{ translate: "cl.fun.invalida", with: { rawtext: [{ translate: `cl.fun.erro.${v.erro}` }] } }, { text: "\n\n" }, { translate: "cl.fun.como" }] })
      .button({ translate: "cl.fun.revalidar" })
      .button({ translate: "cl.fun.fechar" })
      .show(j);
    if (r.selection === 0) return menuControlador(j, c);
    return;
  }
  const f: Fundicao = { ...v.f, metais: antigo.metais };
  gravar(T, c, f);
  for (const d of f.drenos) gravarEm("dreno", c.dimension, d, { x: c.x, y: c.y, z: c.z });
  const lista = indice();
  const k = `${c.dimension.id}:${c.x},${c.y},${c.z}`;
  if (!lista.includes(k)) world.setDynamicProperty("cl:fundicoes", JSON.stringify([...lista, k]));
  registrarAcao(j, "fundicao");
  const linhas: RawMessage[] = [{ translate: "cl.fun.ok", with: [String(f.h), String(f.cap), String(lavaTotal(c.dimension, f))] }];
  if (f.metais.length === 0) linhas.push({ text: "\n\n" }, { translate: "cl.fun.vazia" });
  for (const [m, mb] of f.metais)
    linhas.push({ text: "\n" }, { translate: "cl.fun.metal", with: { rawtext: [nomeMetal(m), { text: String(mb) }, { text: (mb / 144).toFixed(1) }] } });
  // Como no TC: tocar num metal o põe embaixo (é o que sai pela torneira).
  const form = new ActionFormData().title({ translate: "cl.fun.titulo" }).body({ rawtext: linhas });
  for (const [m] of f.metais) form.button({ translate: "cl.fun.para_baixo", with: { rawtext: [nomeMetal(m)] } });
  form.button({ translate: "cl.fun.fechar" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined || r.selection >= f.metais.length) return;
  const atual = lerF(c);
  const escolhido = f.metais[r.selection][0];
  atual.metais.sort(([a], [b]) => (a === escolhido ? -1 : b === escolhido ? 1 : 0));
  gravar(T, c, atual);
  return menuControlador(j, c);
}

export const fundicaoComp: BlockCustomComponent = {
  onTick(e) {
    tick(e.block);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (j) abrirUmMenu(j, () => menuControlador(j, e.block));
  },
};

export const tanqueComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const tem = ler<number>("tanque", e.block, 0);
    const mao = itemNaMao(j)?.typeId;
    let novo = tem;
    if (mao === "minecraft:lava_bucket" && tem + 1000 <= FUNDICAO.tanqueMax) {
      novo = tem + 1000;
      if (j.getGameMode() !== GameMode.Creative) {
        gastarDaMao(j);
        darAoJogador(j, "minecraft:bucket");
      }
      e.dimension.playSound("bucket.empty_lava", e.block.center());
    } else if (mao === "minecraft:bucket" && tem >= 1000) {
      novo = tem - 1000;
      gastarDaMao(j);
      darAoJogador(j, "minecraft:lava_bucket");
    }
    if (novo !== tem) {
      gravar("tanque", e.block, novo);
      definirEstado(e.block, "cl:nivel", Math.ceil(novo / 1000));
    }
    aviso(j, { translate: "cl.fun.tanque", with: [String(novo), String(FUNDICAO.tanqueMax)] });
  },
};

// ---------- mesa, bacia e torneira ----------
function tocarMesa(j: Player, b: Block, bacia: boolean): void {
  const tipo = bacia ? "bacia" : "mesa";
  const m = ler<Mesa>(tipo, b, {});
  if (m.pronto) {
    darAoJogador(j, m.pronto);
    gravar(tipo, b, m.item ? { item: m.item } : undefined);
    j.playSound("random.pop");
    return;
  }
  const mao = itemNaMao(j);
  if (!bacia && !m.item && mao) {
    gastarDaMao(j);
    gravar(tipo, b, { item: mao.typeId });
    j.playSound("random.click");
    return aviso(j, { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(mao.typeId)] } });
  }
  if (!bacia && m.item && !mao) {
    darAoJogador(j, m.item);
    gravar(tipo, b, undefined);
    return;
  }
  if (!bacia && m.item) return aviso(j, { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(m.item)] } });
  if (!bacia) aviso(j, "cl.fun.mesa_vazia");
}

export const mesaComp: BlockCustomComponent = { onPlayerInteract: (e) => e.player && tocarMesa(e.player, e.block, false) };
export const baciaComp: BlockCustomComponent = { onPlayerInteract: (e) => e.player && tocarMesa(e.player, e.block, true) };

/** O que sai de `metal` sobre o que está na mesa (ou na bacia): [resultado, mB, consome o item?]. */
function fundir(metal: string, item: string | undefined, bacia: boolean): [string, number, boolean] | undefined | "nao_serve" {
  if (bacia) return FUNDICAO.bloco[metal] ? [FUNDICAO.bloco[metal], FUNDICAO.bacia, false] : "nao_serve";
  if (!item) return undefined;
  if (item === "cl:molde_lingote") return [FUNDICAO.lingote[metal], 144, false];
  if (item === "cl:molde_pepita") return FUNDICAO.pepita[metal] ? [FUNDICAO.pepita[metal], 16, false] : "nao_serve";
  if (item.startsWith("cl:molde_")) {
    const peca = item.slice("cl:molde_".length);
    return PECAS[peca] && METAIS_FERRAMENTA.has(metal) ? [`cl:peca_${peca}_${metal}`, PECAS[peca].custo * 144, false] : "nao_serve";
  }
  // Fazer molde: ouro derramado sobre peça, lingote ou pepita.
  if (metal !== "ouro") return "nao_serve";
  const peca = /^cl:peca_(.+)_[a-z]+$/.exec(item)?.[1];
  const molde = peca && PECAS[peca] ? `cl:molde_${peca}` : /_ingot$|^cl:lingote_/.test(item) ? "cl:molde_lingote" : /_nugget$/.test(item) ? "cl:molde_pepita" : undefined;
  return molde ? [molde, FUNDICAO.ouroParaMolde, true] : "nao_serve";
}

export const torneiraComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const t = e.block;
    const alvo = t.below();
    const bacia = alvo?.typeId === "cl:bacia_fundicao";
    if (!alvo || (!bacia && alvo.typeId !== "cl:mesa_fundicao")) return aviso(j, "cl.fun.torneira_sem", 5);
    const dreno = [t.north(), t.south(), t.east(), t.west()].find((b) => b?.typeId === "cl:dreno_fundicao");
    const pc = dreno && lerEm<Vector3 | undefined>("dreno", t.dimension, dreno.location, undefined);
    const c = pc && bloco(t.dimension, pc);
    if (!c || c.typeId !== "cl:controlador_fundicao") return aviso(j, "cl.fun.torneira_sem", 5);
    const f = lerF(c);
    if (!f.ok || f.metais.length === 0) return aviso(j, "cl.fun.vazia", 5);
    const tipo = bacia ? "bacia" : "mesa";
    const m = ler<Mesa>(tipo, alvo, {});
    if (m.pronto) return aviso(j, { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(m.pronto)] } });
    const [metal, tem] = f.metais[0]; // sai o que está mais embaixo (o primeiro que derreteu)
    const r = fundir(metal, m.item, bacia);
    if (r === undefined) return aviso(j, "cl.fun.mesa_vazia");
    if (r === "nao_serve") return aviso(j, "cl.fun.nao_serve");
    const [sai, mb, consome] = r;
    if (tem < mb) return aviso(j, { translate: "cl.fun.pouco_metal", with: [String(mb)] });
    tirar(f, metal, mb);
    gravar(T, c, f);
    gravar(tipo, alvo, { item: consome ? undefined : m.item, pronto: sai });
    t.dimension.playSound("bucket.empty_lava", t.center(), { pitch: 1.4 });
    system.runTimeout(() => j.isValid && aviso(j, { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(sai)] } }), 10);
    if (consome) registrarAcao(j, "molde");
    if (sai === "cl:lingote_bronze") registrarAcao(j, "bronze");
  },
};

export function registrarFundicao(): void {
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    const dim = block.dimension, p = block.location;
    if (id === "cl:mesa_fundicao" || id === "cl:bacia_fundicao") {
      const tipo = id === "cl:mesa_fundicao" ? "mesa" : "bacia";
      const m = lerEm<Mesa>(tipo, dim, p, {});
      for (const it of [m.item, m.pronto]) if (it) dim.spawnItem(new ItemStack(it, 1), block.center());
      gravarEm(tipo, dim, p, undefined);
    }
    if (!PAREDE.has(id) && id !== "cl:tijolos_refratarios") return;
    if (id === "cl:tanque_refratario") gravarEm("tanque", dim, p, undefined);
    if (id === "cl:dreno_fundicao") gravarEm("dreno", dim, p, undefined);
    // Desmonta as fundições perto (o metal fica guardado no controlador).
    const vivas: string[] = [];
    for (const k of indice()) {
      const [d, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
      const [x, y, z] = xyz.split(",").map(Number);
      if (id === "cl:controlador_fundicao" && d === dim.id && x === p.x && y === p.y && z === p.z) {
        gravarEm(T, dim, p, undefined);
        continue;
      }
      vivas.push(k);
      if (d === dim.id && Math.abs(x - p.x) <= 4 && Math.abs(z - p.z) <= 4 && p.y >= y - 1 && p.y <= y + FUNDICAO.maxCamadas) {
        const f = lerEm<Fundicao | undefined>(T, dim, { x, y, z }, undefined);
        if (f?.ok) gravarEm(T, dim, { x, y, z }, { ...f, ok: false });
      }
    }
    world.setDynamicProperty("cl:fundicoes", JSON.stringify(vivas));
  });

  registrarNoCatalogo(() => {
    const maquina = { translate: "tile.cl:controlador_fundicao.name" };
    const r = [
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:copper_ingot", qtd: 3 }, { item: "cl:lingote_estanho", qtd: 1 }], saidas: [{ item: "cl:lingote_bronze", qtd: 4 }], nota: { translate: "cl.fun.cat_liga" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:iron_ingot", qtd: 1 }, { item: "minecraft:coal", qtd: 1 }], saidas: [{ item: "cl:lingote_aco", qtd: 1 }], nota: { translate: "cl.fun.cat_liga" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:raw_iron", qtd: 1 }], saidas: [{ item: "minecraft:iron_ingot", qtd: 2 }], nota: { translate: "cl.fun.cat_dobra" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "cl:ferro_quebrado", qtd: 2 }], saidas: [{ item: "minecraft:iron_ingot", qtd: 1 }], nota: { translate: "cl.fun.cat_dobra" } },
    ];
    const mesa = { translate: "tile.cl:mesa_fundicao.name" };
    for (const p of Object.keys(PECAS)) {
      r.push({ maquina: mesa, maquinaId: "cl:mesa_fundicao", entradas: [{ item: `cl:peca_${p}_silex`, qtd: 1 }, { item: "minecraft:gold_ingot", qtd: 2 }], saidas: [{ item: `cl:molde_${p}`, qtd: 1 }], nota: { translate: "cl.fun.cat_molde" } });
      for (const m of METAIS_FERRAMENTA)
        r.push({ maquina: mesa, maquinaId: "cl:mesa_fundicao", entradas: [{ item: `cl:molde_${p}`, qtd: 1 }, { item: FUNDICAO.lingote[m], qtd: PECAS[p].custo }], saidas: [{ item: `cl:peca_${p}_${m}`, qtd: 1 }], nota: { translate: "cl.fun.cat_peca" } });
    }
    return r;
  });
  registrarDetalhe("cl:controlador_fundicao", (b) => {
    const f = lerF(b);
    if (!f.ok) return { translate: "cl.fun.invalida", with: [""] };
    return f.metais.length ? { rawtext: f.metais.flatMap(([m, v], i) => [{ text: i ? ", " : "" }, nomeMetal(m), { text: ` ${v} mB` }]) } : { translate: "cl.fun.vazia" };
  });
  registrarDetalhe("cl:tanque_refratario", (b) => ({ translate: "cl.fun.tanque", with: [String(ler<number>("tanque", b, 0)), String(FUNDICAO.tanqueMax)] }));
  registrarDetalhe(["cl:mesa_fundicao", "cl:bacia_fundicao"], (b) => {
    const m = ler<Mesa>(b.typeId === "cl:mesa_fundicao" ? "mesa" : "bacia", b, {});
    if (m.pronto) return { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(m.pronto)] } };
    return m.item ? { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(m.item)] } } : undefined;
  });
}

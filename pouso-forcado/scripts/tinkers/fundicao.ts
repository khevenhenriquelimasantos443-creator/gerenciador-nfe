import { Block, BlockCustomComponent, Dimension, GameMode, ItemStack, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FUNDICAO } from "../config.js";
import { DADOS_F15, DADOS_F45, DADOS_F46 } from "../conteudo/gerado.js";
import { Receita, registrarNoCatalogo } from "../catalogo/catalogo.js";
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
type Loja = { metais: [string, number][] };
type Fundicao = Loja & { ok: boolean; h: number; cap: number; tanques: Vector3[]; drenos: Vector3[]; calhas?: Vector3[] };
type Mesa = { item?: string; pronto?: string };
const T = "fundicao";
const PAREDE = new Set(["cl:tijolos_refratarios", "cl:vidro_refratario", "cl:tanque_refratario", "cl:dreno_fundicao", "cl:controlador_fundicao",
  // 1.29.0 (Tinkers completo, parte 4): os blocos novos da Fundição e da Fundição Fantástica (chamuscada).
  "cl:calha_refrataria", "cl:vidro_alma_refratario", "cl:vidro_fume_refratario", "cl:lanterna_refrataria", "cl:tijolos_refratarios_finos", "cl:tijolos_refratarios_rachados",
  "cl:tijolos_refratarios_pequenos", "cl:tijolos_refratarios_triangulo", "cl:tijolos_refratarios_creeper", "cl:ladrilho_refratario"]);
const PAREDE_CHAMUSCADA = new Set(["cl:tijolos_chamuscados", "cl:vidro_chamuscado", "cl:tanque_chamuscado", "cl:tanque_refratario", "cl:dreno_chamuscado", "cl:calha_chamuscada",
  "cl:controlador_fundicao_fantastica", "cl:pedra_chamuscada_polida", "cl:pedra_chamuscada_entalhada", "cl:lanterna_chamuscada"]);
const TANQUES = new Set(["cl:tanque_refratario", "cl:tanque_chamuscado"]);
const DRENOS = new Set(["cl:dreno_fundicao", "cl:dreno_chamuscado"]);
const CALHAS = new Set(["cl:calha_refrataria", "cl:calha_chamuscada"]);
export const MESAS = new Set(["cl:mesa_fundicao", "cl:mesa_fundicao_chamuscada"]);
export const BACIAS = new Set(["cl:bacia_fundicao", "cl:bacia_fundicao_chamuscada"]);
const fantastica = (c: Block) => c.typeId === "cl:controlador_fundicao_fantastica";
const DIRS: Readonly<Record<string, [number, number]>> = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] };
const PECAS = DADOS_F15.pecas as Readonly<Record<string, { custo: number }>>;
// 1.26.0: os metais de ferramenta são os materiais de metal do Tinkers 3 (cobalto, manyullyn, ferro-porco...).
const METAIS_FERRAMENTA = new Set(Object.entries(DADOS_F15.materiais as unknown as Record<string, { metal?: boolean }>).filter(([, m]) => m.metal).map(([k]) => k));
type Liga = { entra: Readonly<Record<string, number>>; sai: readonly [string, number] };
type Composto = { de: string; liquido: string; mb: number; vira: string };
const D45 = DADOS_F45 as unknown as {
  ligas: readonly Liga[]; derrete: Readonly<Record<string, readonly [string, number]>>; bichos: Readonly<Record<string, string>>; sopaPorGolpe: number;
  compostos: readonly Composto[]; bacia: readonly { base: string; liquido: string; mb: number; vira: string }[]; ossoWither: string;
};
// Lingotes e blocos dos metais novos (o resto vem de FUNDICAO.lingote/bloco).
const NOVOS = new Set(["cobalto", "ferro_porco", "hepatizon", "manyullyn", "slime_rainha", "aco_slime", "slime_brasa", "slime_cavaleiro"]);
const lingoteDe = (m: string) => FUNDICAO.lingote[m] ?? (NOVOS.has(m) || ["osmio", "aluminio", "zinco", "latao"].includes(m) ? `cl:lingote_${m}` : undefined);
const blocoDe = (m: string) => FUNDICAO.bloco[m] ?? (NOVOS.has(m) ? `cl:bloco_${m}` : undefined);
const PECA_IDS = Object.keys(DADOS_F15.pecas).sort((a, b) => b.length - a.length);
/** "cl:peca_cabeca_picareta_cobalto" -> ["cabeca_picareta", "cobalto"]. */
function pecaDe(id: string): [string, string] | undefined {
  if (!id.startsWith("cl:peca_")) return undefined;
  const resto = id.slice(8);
  const p = PECA_IDS.find((x) => resto.startsWith(`${x}_`));
  return p ? [p, resto.slice(p.length + 1)] : undefined;
}
const nomeMetal = (m: string): RawMessage => ({ translate: `cl.fun.metal.${m}` });
const nomeItem = (id: string): RawMessage => ({ translate: `item.${id}.name` });
const indice = () => (JSON.parse((world.getDynamicProperty("cl:fundicoes") as string | undefined) ?? "[]") as string[]);

function valorDe(id: string): readonly [string, number] | undefined {
  const v = FUNDICAO.valores[id];
  if (v) return v;
  const d = D45.derrete[id] ?? (DADOS_F46.derrete as unknown as Readonly<Record<string, readonly [string, number]>>)[id];
  if (d) return d;
  // Peça de metal derrete de volta (custo × 144 mB).
  const pm = pecaDe(id);
  return pm && METAIS_FERRAMENTA.has(pm[1]) && PECAS[pm[0]] ? [pm[1], PECAS[pm[0]].custo * 144] : undefined;
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
  const ff = fantastica(c);
  const piso = ff ? "cl:tijolos_chamuscados" : "cl:tijolos_refratarios";
  const paredes = ff ? PAREDE_CHAMUSCADA : PAREDE;
  for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++)
    if (bloco(c.dimension, { x: cx + a, y: y0 - 1, z: cz + b })?.typeId !== piso) return { erro: "piso" };
  const tanques: Vector3[] = [], drenos: Vector3[] = [], calhas: Vector3[] = [];
  let h = 0;
  for (; h < FUNDICAO.maxCamadas; h++) {
    const y = y0 + h;
    let interiorOk = true;
    for (let a = -1; a <= 1 && interiorOk; a++) for (let b = -1; b <= 1; b++)
      if (!bloco(c.dimension, { x: cx + a, y, z: cz + b })?.isAir) interiorOk = false;
    const parede: Vector3[] = [];
    for (let k = -1; k <= 1; k++) parede.push({ x: cx + k, y, z: cz - 2 }, { x: cx + k, y, z: cz + 2 }, { x: cx - 2, y, z: cz + k }, { x: cx + 2, y, z: cz + k });
    const blocos = parede.map((p) => bloco(c.dimension, p));
    const paredeOk = blocos.every((b) => b && paredes.has(b.typeId));
    if (!interiorOk || !paredeOk) {
      if (h === 0) return { erro: interiorOk ? "parede" : "interior" };
      break;
    }
    for (const b of blocos) {
      if (TANQUES.has(b!.typeId)) tanques.push(b!.location);
      if (DRENOS.has(b!.typeId)) drenos.push(b!.location);
      if (CALHAS.has(b!.typeId)) calhas.push(b!.location);
    }
  }
  if (tanques.length === 0) return { erro: "tanque" };
  return { f: { ok: true, h, cap: h * FUNDICAO.capacidadePorCamada, tanques, drenos, calhas } };
}

const lerF = (c: Block): Fundicao => ler<Fundicao>(T, c, { ok: false, h: 0, cap: 0, tanques: [], drenos: [], metais: [] });
export const total = (f: Loja) => f.metais.reduce((s, [, v]) => s + v, 0);
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

export function somar(f: Loja, metal: string, mb: number): void {
  const linha = f.metais.find(([m]) => m === metal);
  if (linha) linha[1] += mb;
  else f.metais.push([metal, mb]);
}

export function tirar(f: Loja, metal: string, mb: number): void {
  const linha = f.metais.find(([m]) => m === metal);
  if (!linha) return;
  linha[1] -= mb;
  f.metais = f.metais.filter(([, v]) => v > 0);
}

export const qtd = (f: Loja, metal: string) => f.metais.find(([m]) => m === metal)?.[1] ?? 0;

/** Bronze sozinho; aço quando tem carvão e ferro. */
export function ligas(f: Loja): void {
  const { cobre, estanho, sai } = FUNDICAO.bronze;
  while (qtd(f, "cobre") >= cobre && qtd(f, "estanho") >= estanho) {
    tirar(f, "cobre", cobre);
    tirar(f, "estanho", estanho);
    somar(f, "bronze", sai);
  }
  // 1.24.0 (Tinkers 3): Ouro Rosa e Bronze de Ametista.
  const r = FUNDICAO.ouroRosa;
  while (qtd(f, "cobre") >= r.cobre && qtd(f, "ouro") >= r.ouro) {
    tirar(f, "cobre", r.cobre);
    tirar(f, "ouro", r.ouro);
    somar(f, "ouro_rosa", r.sai);
  }
  const a = FUNDICAO.bronzeAmetista;
  while (qtd(f, "cobre") >= a.cobre && qtd(f, "ametista") >= a.ametista) {
    tirar(f, "cobre", a.cobre);
    tirar(f, "ametista", a.ametista);
    somar(f, "bronze_ametista", a.sai);
  }
  // 1.26.0: as ligas do Tinkers 3 (Ferro-Porco, Hepatizão, Manyullyn, Slime da Rainha, as de slime e a obsidiana).
  for (const l of D45.ligas) {
    const ent = Object.entries(l.entra);
    let vezes = 0;
    while (vezes < 64 && ent.every(([k, n]) => qtd(f, k) >= n)) {
      for (const [k, n] of ent) tirar(f, k, n);
      somar(f, l.sai[0], l.sai[1]);
      vezes++;
    }
  }
}

function tick(c: Block): void {
  const f = lerF(c);
  if (!f.ok) return;
  const [dx, dz] = DIRS[lerEstado<string>(c, "minecraft:cardinal_direction")] ?? [0, -1];
  const canto = { x: c.x + dx * 2 - 1, y: c.y, z: c.z + dz * 2 - 1 };
  let derreteu = 0, mudou = false;
  // 1.26.0 (TC3 entity_melting): animais de fazenda no interior tomam dano e viram sopa de carne.
  for (const e of c.dimension.getEntities({ location: canto, volume: { x: 3, y: f.h, z: 3 }, excludeTypes: ["minecraft:item", "minecraft:player"] })) {
    const liq = D45.bichos[e.typeId];
    if (!liq || total(f) + D45.sopaPorGolpe > f.cap) continue;
    try {
      e.applyDamage(2);
      somar(f, liq, D45.sopaPorGolpe);
      mudou = true;
    } catch {
      // morreu
    }
  }
  const itens = c.dimension.getEntities({ type: "minecraft:item", location: canto, volume: { x: 3, y: f.h, z: 3 } });
  // 1.29.0: Calha — o que está no baú encostado na calha (em cima ou do lado de fora) entra na fundição.
  for (const ch of f.calhas ?? []) {
    if (derreteu >= FUNDICAO.derretePorSegundo) break;
    for (const viz of [{ x: 0, y: 1, z: 0 }, { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }]) {
      const b = bloco(c.dimension, { x: ch.x + viz.x, y: ch.y + viz.y, z: ch.z + viz.z });
      let inv;
      try {
        inv = b?.getComponent("minecraft:inventory")?.container;
      } catch {
        inv = undefined;
      }
      if (!inv) continue;
      for (let k = 0; k < inv.size && derreteu < FUNDICAO.derretePorSegundo; k++) {
        const it = inv.getItem(k);
        const v = it && valorDe(it.typeId);
        if (!it || !v || total(f) + v[1] > f.cap || !gastarLava(c.dimension, f, FUNDICAO.lavaPorItem)) continue;
        somar(f, v[0], v[1]);
        if (fantastica(c)) subproduto(f, it.typeId, v);
        if (it.amount > 1) {
          it.amount--;
          inv.setItem(k, it);
        } else inv.setItem(k, undefined);
        derreteu++;
        mudou = true;
      }
    }
  }
  if (itens.length === 0 && !mudou) return;
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
      if (fantastica(c)) subproduto(f, pilha.typeId, v);
      n++;
      derreteu++;
    }
    if (n > 0) {
      consumirEntidade(e, pilha, n);
      mudou = true;
    }
  }
  if (!mudou) return;
  if (!fantastica(c)) ligas(f); // a Fundição Fantástica não faz liga (TC3)
  gravar(T, c, f);
  c.dimension.playSound("bucket.fill_lava", c.center(), { volume: 0.4 });
  const quem = c.dimension.getPlayers({ location: c.center(), maxDistance: 16, closest: 1 })[0];
  if (quem) for (let i = 0; i < derreteu; i++) registrarAcao(quem, "derreter");
}

// Subprodutos da Fundição Fantástica (melting/metal/*/ore do TC3): um terço do que o mod dá, só de minério e bruto.
const SUBPRODUTO: Readonly<Record<string, readonly [string, number]>> = { ferro: ["aco", 1 / 3], ouro: ["cobalto", 1 / 3], cobre: ["ouro", 1 / 9], osmio: ["ferro", 1 / 3] };
function subproduto(f: Loja, id: string, v: readonly [string, number]): void {
  const s = SUBPRODUTO[v[0]];
  if (s && /raw_|_ore$|bruto|minerio/.test(id)) somar(f, s[0], Math.round(v[1] * s[1]));
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
  // 1.26.0: a bacia aceita tábua (Nahuatl).
  if (bacia && !m.item && mao?.typeId.endsWith("_planks")) {
    gastarDaMao(j);
    gravar(tipo, b, { item: mao.typeId });
    j.playSound("random.click");
    return aviso(j, { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(mao.typeId)] } });
  }
  if (bacia && m.item && !mao) {
    darAoJogador(j, m.item);
    gravar(tipo, b, undefined);
    return;
  }
  if (!bacia && !m.item && mao) {
    gastarDaMao(j);
    gravar(tipo, b, { item: mao.typeId });
    j.playSound("random.click");
    return aviso(j, { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(mao.typeId)] } });
  }
  // 1.29.0: areia na mesa + peça (ou lingote) na mão = molde de areia (a peça fica com você).
  if (!bacia && (m.item === "minecraft:sand" || m.item === "minecraft:red_sand") && mao) {
    const pm = pecaDe(mao.typeId);
    const molde = pm && PECAS[pm[0]] ? `cl:molde_areia_${pm[0]}` : /_ingot$|^cl:lingote_/.test(mao.typeId) ? "cl:molde_areia_lingote" : undefined;
    if (molde) {
      gravar(tipo, b, { pronto: molde });
      j.playSound("dig.sand");
      return aviso(j, { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(molde)] } });
    }
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
  if (bacia) {
    // Bacia com tábua + obsidiana = Nahuatl (TC3); vazia = bloco do metal.
    const b = D45.bacia.find((x) => x.liquido === metal && item?.endsWith(`_${x.base}`));
    if (b) return [b.vira, b.mb, true];
    return !item && blocoDe(metal) ? [blocoDe(metal)!, FUNDICAO.bacia, false] : "nao_serve";
  }
  if (!item) return undefined;
  // Material composto (TC3): a peça mergulhada no líquido vira a peça do outro material.
  const pm = pecaDe(item);
  const comp = pm && D45.compostos.find((x) => x.de === pm[1] && x.liquido === metal);
  if (pm && comp && PECAS[pm[0]]) return [`cl:peca_${pm[0]}_${comp.vira}`, comp.mb * PECAS[pm[0]].custo, true];
  if (item === "cl:molde_lingote") return lingoteDe(metal) ? [lingoteDe(metal)!, 144, false] : "nao_serve";
  // 1.29.0: molde de areia (TC3): serve uma vez só.
  if (item === "cl:molde_areia_lingote") return lingoteDe(metal) ? [lingoteDe(metal)!, 144, true] : "nao_serve";
  if (item.startsWith("cl:molde_areia_")) {
    const peca = item.slice("cl:molde_areia_".length);
    return PECAS[peca] && METAIS_FERRAMENTA.has(metal) ? [`cl:peca_${peca}_${metal}`, PECAS[peca].custo * 144, true] : "nao_serve";
  }
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

// 1.29.0: de onde a torneira tira (dreno de uma fundição, ou Fusor/Ligador encostado) e onde cai (mesa ou bacia
// embaixo, ou pelo Canal até a primeira mesa/bacia livre, como os canais do TC3).
type Fonte = { loja: Loja; salvar: (l: Loja) => void };
function fonteDa(t: Block): Fonte | undefined {
  for (const b of [t.north(), t.south(), t.east(), t.west()]) {
    if (!b) continue;
    if (DRENOS.has(b.typeId)) {
      const pc = lerEm<Vector3 | undefined>("dreno", t.dimension, b.location, undefined);
      const c = pc && bloco(t.dimension, pc);
      if (c && (c.typeId === "cl:controlador_fundicao" || c.typeId === "cl:controlador_fundicao_fantastica")) {
        const f = lerF(c);
        if (f.ok) return { loja: f, salvar: (l) => gravar(T, c, l) };
      }
    }
    if (b.typeId === "cl:fusor" || b.typeId === "cl:ligador") {
      const k = b.typeId === "cl:fusor" ? "fusor" : "ligador";
      const l = ler<Loja>(k, b, { metais: [] });
      return { loja: l, salvar: (x) => gravar(k, b, { ...ler<object>(k, b, {}), metais: x.metais }) };
    }
  }
  return undefined;
}
function alvosDa(t: Block): Block[] {
  const baixo = t.below();
  if (!baixo) return [];
  if (MESAS.has(baixo.typeId) || BACIAS.has(baixo.typeId)) return [baixo];
  if (baixo.typeId !== "cl:canal") return [];
  const r: Block[] = [];
  const vistos = new Set<string>();
  const fila = [baixo];
  while (fila.length && vistos.size < 32) {
    const c = fila.shift()!;
    const k = `${c.x},${c.z}`;
    if (vistos.has(k)) continue;
    vistos.add(k);
    const sob = c.below();
    if (sob && (MESAS.has(sob.typeId) || BACIAS.has(sob.typeId))) r.push(sob);
    for (const v of [c.north(), c.south(), c.east(), c.west()]) if (v?.typeId === "cl:canal") fila.push(v);
  }
  return r;
}

export const torneiraComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const t = e.block;
    const alvos = alvosDa(t);
    if (!alvos.length) return aviso(j, "cl.fun.torneira_sem", 5);
    const fonte = fonteDa(t);
    if (!fonte) return aviso(j, "cl.fun.torneira_sem", 5);
    if (fonte.loja.metais.length === 0) return aviso(j, "cl.fun.vazia", 5);
    const [metal, tem] = fonte.loja.metais[0]; // sai o que está mais embaixo (o primeiro que derreteu)
    let ultimo: string | RawMessage = "cl.fun.mesa_vazia";
    for (const alvo of alvos) {
      const bacia = BACIAS.has(alvo.typeId);
      const tipo = bacia ? "bacia" : "mesa";
      const m = ler<Mesa>(tipo, alvo, {});
      if (m.pronto) {
        ultimo = { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(m.pronto)] } };
        continue;
      }
      const r = fundir(metal, m.item, bacia);
      if (r === undefined) continue;
      if (r === "nao_serve") {
        ultimo = "cl.fun.nao_serve";
        continue;
      }
      const [sai, mb, consome] = r;
      if (tem < mb) {
        ultimo = { translate: "cl.fun.pouco_metal", with: [String(mb)] };
        continue;
      }
      tirar(fonte.loja, metal, mb);
      fonte.salvar(fonte.loja);
      gravar(tipo, alvo, { item: consome ? undefined : m.item, pronto: sai });
      t.dimension.playSound("bucket.empty_lava", t.center(), { pitch: 1.4 });
      system.runTimeout(() => j.isValid && aviso(j, { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(sai)] } }), 10);
      if (consome && sai.startsWith("cl:peca_") && !m.item?.startsWith("cl:molde_areia_")) registrarAcao(j, "tc_composto");
      else if (consome && sai.startsWith("cl:molde_")) registrarAcao(j, "molde");
      if (sai === "cl:lingote_bronze") registrarAcao(j, "bronze");
      return;
    }
    aviso(j, ultimo, 5);
  },
};

// ---------- 1.29.0: Fusor, Aquecedor e Ligador (TC3) ----------
// Aquecedor: queima combustível (em ticks, como a fornalha); o Fusor em cima derrete um item a cada segundo, gastando
// 200 ticks de combustível por item (minério sem dobrar, como no Fusor do TC3). O Ligador puxa os líquidos dos Fusores
// encostados e faz as ligas. A torneira tira do Fusor ou do Ligador.
const COMBUSTIVEL: Readonly<Record<string, number>> = {
  "minecraft:coal": 1600, "minecraft:charcoal": 1600, "minecraft:coal_block": 16000, "minecraft:blaze_rod": 2400, "minecraft:lava_bucket": 20000,
  "minecraft:dried_kelp_block": 4000, "cl:coque": 3200, "cl:bloco_coque": 32000,
};
const CAP_FUSOR = 1296, CAP_LIGADOR = 2592, CUSTO_FUSOR = 200;
type Fusor = Loja & { entrada: string[] };
export const aquecedorComp: BlockCustomComponent = {
  onPlayerInteract({ block, player: j }) {
    if (!j) return;
    const mao = itemNaMao(j)?.typeId;
    const v = mao && COMBUSTIVEL[mao];
    const tem = ler<number>("aquecedor", block, 0);
    if (!v) return aviso(j, { translate: "cl.fun.aquecedor", with: [String(Math.round(tem / 20))] }, 4);
    gastarDaMao(j);
    if (mao === "minecraft:lava_bucket") darAoJogador(j, "minecraft:bucket");
    gravar("aquecedor", block, tem + v);
    j.playSound("fire.ignite");
    aviso(j, { translate: "cl.fun.aquecedor", with: [String(Math.round((tem + v) / 20))] }, 4);
  },
};
export const fusorComp: BlockCustomComponent = {
  onTick({ block }) {
    const f = ler<Fusor>("fusor", block, { metais: [], entrada: [] });
    let mudou = false;
    // Puxa do baú de cima (até 3 na fila).
    let bau;
    try {
      bau = block.above()?.getComponent("minecraft:inventory")?.container;
    } catch {
      bau = undefined;
    }
    for (let k = 0; bau && k < bau.size && f.entrada.length < 3; k++) {
      const it = bau.getItem(k);
      if (!it || !valorDe(it.typeId)) continue;
      f.entrada.push(it.typeId);
      if (it.amount > 1) {
        it.amount--;
        bau.setItem(k, it);
      } else bau.setItem(k, undefined);
      mudou = true;
    }
    const aq = block.below();
    const fogo = aq?.typeId === "cl:aquecedor" ? ler<number>("aquecedor", aq, 0) : 0;
    if (f.entrada.length && fogo >= CUSTO_FUSOR) {
      const id = f.entrada[0];
      const v = valorDe(id);
      const mb = v ? (/raw_|_ore$|bruto|minerio/.test(id) ? Math.round(v[1] / 2) : v[1]) : 0;
      if (v && total(f) + mb <= CAP_FUSOR) {
        f.entrada.shift();
        somar(f, v[0], mb);
        gravar("aquecedor", aq!, fogo - CUSTO_FUSOR);
        block.dimension.playSound("bucket.fill_lava", block.center(), { volume: 0.3 });
        mudou = true;
      } else if (!v) {
        f.entrada.shift();
        mudou = true;
      }
    }
    if (mudou) gravar("fusor", block, f);
  },
  onPlayerInteract({ block, player: j }) {
    if (!j) return;
    const f = ler<Fusor>("fusor", block, { metais: [], entrada: [] });
    const mao = itemNaMao(j);
    if (mao && valorDe(mao.typeId) && f.entrada.length < 3) {
      gastarDaMao(j);
      f.entrada.push(mao.typeId);
      gravar("fusor", block, f);
      j.playSound("random.click");
    }
    aviso(j, { translate: "cl.fun.fusor", with: { rawtext: [{ text: String(f.entrada.length) }, ...descrever(f)] } }, 5);
  },
};
export const ligadorComp: BlockCustomComponent = {
  onTick({ block }) {
    const l = ler<Loja>("ligador", block, { metais: [] });
    let mudou = false;
    for (const b of [block.north(), block.south(), block.east(), block.west()]) {
      if (b?.typeId !== "cl:fusor") continue;
      const f = ler<Fusor>("fusor", b, { metais: [], entrada: [] });
      if (!f.metais.length) continue;
      for (const [m, v] of [...f.metais]) {
        const cabe = Math.min(v, CAP_LIGADOR - total(l));
        if (cabe <= 0) break;
        somar(l, m, cabe);
        tirar(f, m, cabe);
        mudou = true;
      }
      gravar("fusor", b, f);
    }
    if (!mudou) return;
    ligas(l);
    gravar("ligador", block, l);
  },
  onPlayerInteract({ block, player: j }) {
    if (j) aviso(j, { translate: "cl.fun.ligador", with: { rawtext: descrever(ler<Loja>("ligador", block, { metais: [] })) } }, 5);
  },
};
function descrever(l: Loja): RawMessage[] {
  if (!l.metais.length) return [{ translate: "cl.fun.nada" }];
  return l.metais.flatMap(([m, v], i) => [{ text: i ? ", " : "" }, nomeMetal(m), { text: ` ${v} mB` }]);
}

export function registrarFundicao(): void {
  // 1.26.0 (TC3, loot_modifiers/wither_bone): os ossos do Esqueleto Wither viram Osso Necrótico.
  world.afterEvents.entityDie.subscribe(
    ({ deadEntity }) => {
      const dim = deadEntity.dimension, onde = deadEntity.location;
      system.runTimeout(() => {
        try {
          for (const e of dim.getEntities({ type: "minecraft:item", location: onde, maxDistance: 2.5 })) {
            const it = e.getComponent("minecraft:item")?.itemStack;
            if (it?.typeId !== "minecraft:bone") continue;
            const l = e.location;
            e.remove();
            dim.spawnItem(new ItemStack(D45.ossoWither, it.amount), l);
          }
        } catch {
          // chunk descarregado
        }
      }, 2);
    },
    { entityTypes: ["minecraft:wither_skeleton"] },
  );
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    const dim = block.dimension, p = block.location;
    if (MESAS.has(id) || BACIAS.has(id)) {
      const tipo = MESAS.has(id) ? "mesa" : "bacia";
      const m = lerEm<Mesa>(tipo, dim, p, {});
      for (const it of [m.item, m.pronto]) if (it) dim.spawnItem(new ItemStack(it, 1), block.center());
      gravarEm(tipo, dim, p, undefined);
    }
    if (!PAREDE.has(id) && !PAREDE_CHAMUSCADA.has(id) && id !== "cl:tijolos_refratarios") return;
    if (TANQUES.has(id)) gravarEm("tanque", dim, p, undefined);
    if (DRENOS.has(id)) gravarEm("dreno", dim, p, undefined);
    // Desmonta as fundições perto (o metal fica guardado no controlador).
    const vivas: string[] = [];
    for (const k of indice()) {
      const [d, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
      const [x, y, z] = xyz.split(",").map(Number);
      if ((id === "cl:controlador_fundicao" || id === "cl:controlador_fundicao_fantastica") && d === dim.id && x === p.x && y === p.y && z === p.z) {
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
    const r: Receita[] = [
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:copper_ingot", qtd: 3 }, { item: "cl:lingote_estanho", qtd: 1 }], saidas: [{ item: "cl:lingote_bronze", qtd: 4 }], nota: { translate: "cl.fun.cat_liga" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:iron_ingot", qtd: 1 }, { item: "minecraft:coal", qtd: 1 }], saidas: [{ item: "cl:lingote_aco", qtd: 1 }], nota: { translate: "cl.fun.cat_liga" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "minecraft:raw_iron", qtd: 1 }], saidas: [{ item: "minecraft:iron_ingot", qtd: 2 }], nota: { translate: "cl.fun.cat_dobra" } },
      { maquina, maquinaId: "cl:controlador_fundicao", entradas: [{ item: "cl:ferro_quebrado", qtd: 2 }], saidas: [{ item: "minecraft:iron_ingot", qtd: 1 }], nota: { translate: "cl.fun.cat_dobra" } },
    ];
    // 1.26.0: as ligas do Tinkers 3, com um item de cada líquido (metal: lingotes; o resto, o item que derrete nele).
    const ITEM: Readonly<Record<string, [string, number]>> = {
      ferro: ["minecraft:iron_ingot", 144], cobre: ["minecraft:copper_ingot", 144], ouro: ["minecraft:gold_ingot", 144], cobalto: ["cl:lingote_cobalto", 144],
      detrito: ["minecraft:netherite_scrap", 144], quartzo: ["minecraft:quartz", 100], magma: ["minecraft:magma_cream", 250], mel: ["minecraft:honey_bottle", 250],
      obsidiana: ["minecraft:obsidian", 1000], pedra_refrataria: ["cl:tijolo_refratario", 250], pedra_chamuscada: ["cl:tijolo_chamuscado", 250],
      sopa_carne: ["minecraft:beef", 50], agua: ["minecraft:water_bucket", 1000], lava: ["minecraft:lava_bucket", 1000],
      slime_ceu: ["cl:bola_slime_ceu", 250], slime_ender: ["cl:bola_slime_ender", 250], icor: ["cl:bola_slime_icor", 250],
    };
    for (const l of D45.ligas) {
      const ent = Object.entries(l.entra);
      if (!ent.every(([k]) => ITEM[k]) || !lingoteDe(l.sai[0])) continue;
      r.push({ maquina, maquinaId: "cl:controlador_fundicao", entradas: ent.map(([k, n]) => ({ item: ITEM[k][0], qtd: Math.max(1, Math.round(n / ITEM[k][1])) })), saidas: [{ item: lingoteDe(l.sai[0])!, qtd: Math.round(l.sai[1] / 144) }], nota: { translate: l.entra.sopa_carne ? "cl.fun.cat_liga_sopa" : "cl.fun.cat_liga" } });
    }
    const mesa = { translate: "tile.cl:mesa_fundicao.name" };
    const pecaMats = DADOS_F15.pecaMats as unknown as Readonly<Record<string, readonly string[]>>;
    for (const p of Object.keys(PECAS)) {
      const base = (pecaMats[p] ?? []).includes("silex") ? "silex" : pecaMats[p]?.[0];
      if (base) r.push({ maquina: mesa, maquinaId: "cl:mesa_fundicao", entradas: [{ item: `cl:peca_${p}_${base}`, qtd: 1 }, { item: "minecraft:gold_ingot", qtd: 2 }], saidas: [{ item: `cl:molde_${p}`, qtd: 1 }], nota: { translate: "cl.fun.cat_molde" } });
      for (const m of METAIS_FERRAMENTA) {
        const l = lingoteDe(m);
        if (l && (pecaMats[p] ?? []).includes(m))
          r.push({ maquina: mesa, maquinaId: "cl:mesa_fundicao", entradas: [{ item: `cl:molde_${p}`, qtd: 1 }, { item: l, qtd: PECAS[p].custo }], saidas: [{ item: `cl:peca_${p}_${m}`, qtd: 1 }], nota: { translate: "cl.fun.cat_peca" } });
      }
      // 1.26.0: materiais compostos (peça + líquido).
      for (const c of D45.compostos)
        if ((pecaMats[p] ?? []).includes(c.de) && (pecaMats[p] ?? []).includes(c.vira))
          r.push({ maquina: mesa, maquinaId: "cl:mesa_fundicao", entradas: [{ item: `cl:peca_${p}_${c.de}`, qtd: 1 }], saidas: [{ item: `cl:peca_${p}_${c.vira}`, qtd: 1 }], nota: { translate: "cl.fun.cat_composto_n", with: { rawtext: [{ text: String(c.mb * PECAS[p].custo) }, { translate: `cl.fun.metal.${c.liquido}` }] } } });
    }
    return r;
  });
  registrarDetalhe(["cl:controlador_fundicao", "cl:controlador_fundicao_fantastica"], (b) => {
    const f = lerF(b);
    if (!f.ok) return { translate: "cl.fun.invalida", with: [""] };
    return f.metais.length ? { rawtext: f.metais.flatMap(([m, v], i) => [{ text: i ? ", " : "" }, nomeMetal(m), { text: ` ${v} mB` }]) } : { translate: "cl.fun.vazia" };
  });
  registrarDetalhe("cl:fusor", (b) => ({ rawtext: descrever(ler<Loja>("fusor", b, { metais: [] })) }));
  registrarDetalhe("cl:ligador", (b) => ({ rawtext: descrever(ler<Loja>("ligador", b, { metais: [] })) }));
  registrarDetalhe("cl:aquecedor", (b) => ({ translate: "cl.fun.aquecedor", with: [String(Math.round(ler<number>("aquecedor", b, 0) / 20))] }));
  registrarDetalhe("cl:tanque_refratario", (b) => ({ translate: "cl.fun.tanque", with: [String(ler<number>("tanque", b, 0)), String(FUNDICAO.tanqueMax)] }));
  registrarDetalhe(["cl:mesa_fundicao", "cl:bacia_fundicao", "cl:mesa_fundicao_chamuscada", "cl:bacia_fundicao_chamuscada"], (b) => {
    const m = ler<Mesa>(MESAS.has(b.typeId) ? "mesa" : "bacia", b, {});
    if (m.pronto) return { translate: "cl.fun.pronto", with: { rawtext: [nomeItem(m.pronto)] } };
    return m.item ? { translate: "cl.fun.na_mesa", with: { rawtext: [nomeItem(m.item)] } } : undefined;
  });
}

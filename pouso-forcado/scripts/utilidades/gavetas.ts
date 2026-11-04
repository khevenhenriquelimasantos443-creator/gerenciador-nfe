import { Block, BlockCustomComponent, Direction, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconeDe, nomeDe } from "../catalogo/catalogo.js";
import { DADOS_F51 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravarEm, lerEm, registrarDetalhe } from "../util/dados.js";
import { abrirUmMenu } from "../util/menus.js";
import { codigoDoItem, guardarNoItem, lerCodigo } from "../util/item_guarda.js";

/*
 * 1.32.0: Storage Drawers 13.2 (o mais novo). Cada gaveta guarda muito de um item só (1×1: 32 pilhas; 1×2: 2 × 16;
 * 2×2: 4 × 8); a Compactadora guarda as 3 formas de um material (bloco, lingote, pepita) contadas na menor. Tocar com
 * o item guarda (dois toques, ou de mão vazia: tudo daquele item da mochila); bater tira uma pilha (agachado: um).
 * Melhorias de armazenamento somam os multiplicadores do mod; Vazio apaga o que sobra; a Chave trava o item. O
 * Controlador guarda em todas as gavetas ligadas a ele (encostadas, como a rede do mod). Quebrada, a gaveta guarda
 * tudo no item. Os dados ficam no mundo por posição (util/dados.ts).
 */
type Slot = { t: string; n: number } | null;
type Gav = { s: Slot[]; up?: string[]; trava?: boolean; tv?: (string | null)[]; c?: string };
const T = "gaveta";
const DEF = DADOS_F51.gavetas as unknown as Readonly<Record<string, readonly [number, number]>>;
const MULT = DADOS_F51.melhoriasGaveta as Readonly<Record<string, number>>;
const VAZIO = "cl:melhoria_gaveta_vazio", CHAVE = "cl:chave_gaveta", CONTROLADOR = "cl:controlador_gavetas", ACABAMENTO = "cl:acabamento_gaveta";
const ehGaveta = (id: string) => DEF[id.replace("cl:", "")] !== undefined;
const ehCompacta = (id: string) => id === "cl:gaveta_compactadora";

// Compactadora: as cadeias (da maior forma para a menor) com quantas da menor cada uma vale.
const CADEIAS_MC: ReadonlyArray<ReadonlyArray<readonly [string, number]>> = [
  [["iron_block", 81], ["iron_ingot", 9], ["iron_nugget", 1]],
  [["gold_block", 81], ["gold_ingot", 9], ["gold_nugget", 1]],
  [["copper_block", 9], ["copper_ingot", 1]],
  [["netherite_block", 9], ["netherite_ingot", 1]],
  [["diamond_block", 9], ["diamond", 1]],
  [["emerald_block", 9], ["emerald", 1]],
  [["lapis_block", 9], ["lapis_lazuli", 1]],
  [["redstone_block", 9], ["redstone", 1]],
  [["coal_block", 9], ["coal", 1]],
  [["raw_iron_block", 9], ["raw_iron", 1]],
  [["raw_gold_block", 9], ["raw_gold", 1]],
  [["raw_copper_block", 9], ["raw_copper", 1]],
  [["quartz_block", 4], ["quartz", 1]],
  [["amethyst_block", 4], ["amethyst_shard", 1]],
  [["glowstone", 4], ["glowstone_dust", 1]],
  [["clay", 4], ["clay_ball", 1]],
  [["snow", 4], ["snowball", 1]],
  [["slime", 9], ["slime_ball", 1]],
  [["bone_block", 9], ["bone_meal", 1]],
  [["hay_block", 9], ["wheat", 1]],
  [["dried_kelp_block", 9], ["dried_kelp", 1]],
];
const CADEIAS: ReadonlyArray<ReadonlyArray<readonly [string, number]>> = CADEIAS_MC.map((c) => c.map(([id, n]) => [`minecraft:${id}`, n] as const));
const cadeiaDe = (id: string) => CADEIAS.find((c) => c.some(([x]) => x === id));
const cadeiaBase = (base: string | undefined) => (base ? CADEIAS.find((c) => c[c.length - 1][0] === base) : undefined);

const maxPilha = new Map<string, number>();
function pilhaDe(id: string): number {
  let n = maxPilha.get(id);
  if (n === undefined) {
    try {
      n = new ItemStack(id, 1).maxAmount;
    } catch {
      n = 64;
    }
    maxPilha.set(id, n);
  }
  return n;
}
const mult = (g: Gav) => Math.max(1, (g.up ?? []).reduce((s, u) => s + (MULT[u.replace("cl:", "")] ?? 0), 0));
const temVazio = (g: Gav) => (g.up ?? []).includes(VAZIO);
function capacidade(tipo: string, g: Gav, item: string): number {
  const [, pilhas] = DEF[tipo.replace("cl:", "")] ?? [1, 32];
  if (ehCompacta(tipo)) {
    const c = cadeiaBase(g.c);
    return pilhas * 64 * (c?.[0][1] ?? 1) * mult(g);
  }
  return pilhas * pilhaDe(item) * mult(g);
}
const ler = (b: Block): Gav => {
  const g = lerEm<Gav>(T, b.dimension, b.location, { s: [] });
  const n = DEF[b.typeId.replace("cl:", "")]?.[0] ?? 1;
  while (g.s.length < (ehCompacta(b.typeId) ? 1 : n)) g.s.push(null);
  return g;
};
const gravar = (b: Block, g: Gav) => gravarEm(T, b.dimension, b.location, g.s.some(Boolean) || g.up?.length || g.trava ? g : undefined);

// ---------- Qual espaço da frente foi tocado ----------
const FRENTE: Readonly<Record<string, Direction>> = { north: Direction.South, south: Direction.North, east: Direction.West, west: Direction.East };
function espacoTocado(b: Block, face: Direction, p: Vector3): number | undefined {
  let dir = "north";
  try {
    dir = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string;
  } catch {
    // sem direção
  }
  if (FRENTE[dir] !== face) return undefined;
  const u = face === Direction.South ? p.x : face === Direction.North ? 1 - p.x : face === Direction.East ? 1 - p.z : p.z;
  const cima = p.y >= 0.5;
  const n = DEF[b.typeId.replace("cl:", "")]?.[0] ?? 1;
  if (ehCompacta(b.typeId)) return cima ? 0 : u < 0.5 ? 1 : 2;
  if (n === 1) return 0;
  if (n === 2) return cima ? 0 : 1;
  return (cima ? 0 : 2) + (u < 0.5 ? 0 : 1);
}
/** O ponto tocado na face (o raio da visão; o evento de bater não traz o ponto). */
function pontoDaVisao(j: Player, b: Block): { face: Direction; p: Vector3 } | undefined {
  const r = j.getBlockFromViewDirection({ maxDistance: 7 });
  if (!r || r.block.x !== b.x || r.block.y !== b.y || r.block.z !== b.z) return undefined;
  return { face: r.face, p: r.faceLocation };
}

// ---------- Guardar e tirar ----------
const simples = (i: ItemStack) =>
  !i.nameTag && !i.getLore().length && !i.getDynamicPropertyIds().length && !i.getComponent("minecraft:enchantable")?.getEnchantments().length && !i.getComponent("minecraft:durability")?.damage;
/** Quanto da pilha `i` (quantidade `qtd`) cabe na gaveta; põe e devolve quanto entrou (o Vazio aceita tudo). */
function por(b: Block, g: Gav, k: number, id: string, qtd: number): number {
  if (ehCompacta(b.typeId)) {
    const c = cadeiaDe(id);
    if (!c) return 0;
    const base = c[c.length - 1][0];
    if (g.c && g.c !== base) return 0;
    g.c = base;
    const vale = c.find(([x]) => x === id)![1];
    const s = g.s[0] ?? { t: base, n: 0 };
    const cabe = Math.floor((capacidade(b.typeId, g, base) - s.n) / vale);
    const entra = Math.max(0, Math.min(qtd, cabe));
    s.n += entra * vale;
    g.s[0] = s;
    return temVazio(g) ? qtd : entra;
  }
  const s = g.s[k];
  if (s && s.t !== id) return 0;
  if (!s && g.trava && g.tv?.[k] && g.tv[k] !== id) return 0; // travada no item de antes
  const atual = s ?? { t: id, n: 0 };
  const entra = Math.max(0, Math.min(qtd, capacidade(b.typeId, g, id) - atual.n));
  atual.n += entra;
  g.s[k] = atual;
  return temVazio(g) ? qtd : entra;
}
/** Tira até `qtd` do espaço `k` (na Compactadora, na forma daquele espaço). */
function tirar(b: Block, g: Gav, k: number, qtd: number): ItemStack | undefined {
  if (ehCompacta(b.typeId)) {
    const c = cadeiaBase(g.c);
    const s = g.s[0];
    if (!c || !s || k >= c.length) return undefined;
    const [id, vale] = c[k];
    const n = Math.min(qtd, Math.floor(s.n / vale), pilhaDe(id));
    if (n <= 0) return undefined;
    s.n -= n * vale;
    if (s.n <= 0) {
      g.s[0] = null;
      if (!g.trava) delete g.c;
    }
    return new ItemStack(id, n);
  }
  const s = g.s[k];
  if (!s) return undefined;
  const n = Math.min(qtd, s.n, pilhaDe(s.t));
  s.n -= n;
  const it = new ItemStack(s.t, n);
  if (s.n <= 0) {
    if (g.trava) (g.tv ??= [])[k] = s.t;
    g.s[k] = null;
  }
  return it;
}

/** Guarda tudo da mochila do jogador que combina com a gaveta (espaço k, ou todos). */
function porTudoDaMochila(j: Player, b: Block, g: Gav, k?: number): number {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return 0;
  let total = 0;
  for (let s = 0; s < inv.size; s++) {
    const it = inv.getItem(s);
    if (!it || !simples(it)) continue;
    let alvo: number | undefined;
    if (ehCompacta(b.typeId)) alvo = g.c && cadeiaDe(it.typeId)?.[cadeiaDe(it.typeId)!.length - 1][0] === g.c ? 0 : undefined;
    else alvo = (k !== undefined ? [k] : g.s.map((_, x) => x)).find((x) => g.s[x]?.t === it.typeId);
    if (alvo === undefined) continue;
    const entrou = por(b, g, alvo, it.typeId, it.amount);
    if (!entrou) continue;
    total += Math.min(entrou, it.amount);
    if (entrou >= it.amount) inv.setItem(s, undefined);
    else {
      it.amount -= entrou;
      inv.setItem(s, it);
    }
  }
  return total;
}

const ultimoToque = new Map<string, { k: string; t: number }>();
function tocar(j: Player, b: Block, face: Direction, p: Vector3): void {
  if (b.typeId === CONTROLADOR) return controlador(j, b);
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  const g = ler(b);
  // Melhorias e chave.
  if (mao && (MULT[mao.typeId.replace("cl:", "")] !== undefined || mao.typeId === VAZIO)) {
    if ((g.up ?? []).length >= 7) return aviso(j, "cl.gaveta.max_melhorias", 2);
    (g.up ??= []).push(mao.typeId);
    gravar(b, g);
    gastar(j);
    j.playSound("random.orb", { volume: 0.5 });
    if (mao.typeId !== VAZIO) registrarAcao(j, "sd_melhoria");
    return;
  }
  if (mao?.typeId === CHAVE) {
    g.trava = !g.trava;
    gravar(b, g);
    return aviso(j, g.trava ? "cl.gaveta.travada" : "cl.gaveta.destravada", 2);
  }
  const k = espacoTocado(b, face, p) ?? 0;
  const chave = `${b.dimension.id}|${b.x},${b.y},${b.z}`;
  const u = ultimoToque.get(j.id);
  const duplo = u?.k === chave && system.currentTick - u.t <= 10;
  ultimoToque.set(j.id, { k: chave, t: system.currentTick });
  if (!mao) {
    if (j.isSneaking) return abrirUmMenu(j, () => menu(j, b));
    const n = porTudoDaMochila(j, b, g);
    if (n) (gravar(b, g), j.playSound("random.pop", { volume: 0.4 }), contar(j, n));
    return;
  }
  if (!simples(mao)) return aviso(j, "cl.gaveta.especial", 2);
  if (ehCompacta(b.typeId) && !cadeiaDe(mao.typeId)) return aviso(j, "cl.gaveta.nao_compacta", 3);
  const entrou = por(b, g, k, mao.typeId, mao.amount);
  let total = entrou;
  if (entrou) {
    if (entrou >= mao.amount) inv!.setItem(j.selectedSlotIndex, undefined);
    else {
      mao.amount -= entrou;
      inv!.setItem(j.selectedSlotIndex, mao);
    }
  }
  if (duplo) total += porTudoDaMochila(j, b, g, ehCompacta(b.typeId) ? 0 : k);
  if (!total) return aviso(j, g.s[k] && g.s[k]!.t !== mao.typeId ? "cl.gaveta.outro" : "cl.gaveta.cheia", 2);
  gravar(b, g);
  j.playSound("random.pop", { volume: 0.4 });
  contar(j, Math.min(total, 64 * 36));
}
function contar(j: Player, n: number): void {
  for (let k = 0; k < Math.min(n, 1000); k += 100) registrarAcao(j, "sd_guardar");
}
function gastar(j: Player): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !i) return;
  if (i.amount > 1) (i.amount--, inv.setItem(j.selectedSlotIndex, i));
  else inv.setItem(j.selectedSlotIndex, undefined);
}
function bater(j: Player, b: Block): void {
  const v = pontoDaVisao(j, b);
  const k = v ? espacoTocado(b, v.face, v.p) : 0;
  if (k === undefined) return;
  const g = ler(b);
  const it = tirar(b, g, k, j.isSneaking ? 1 : 64);
  if (!it) return;
  gravar(b, g);
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(it);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  j.playSound("random.pop", { volume: 0.4, pitch: 1.3 });
}

async function menu(j: Player, b: Block): Promise<void> {
  const g = ler(b);
  const linhas: RawMessage[] = [{ translate: "cl.gaveta.corpo" }, { text: "\n\n" }];
  const conteudo = ehCompacta(b.typeId)
    ? (cadeiaBase(g.c) ?? []).map(([id, vale]) => ({ t: id, n: Math.floor((g.s[0]?.n ?? 0) / vale) }))
    : g.s.map((s) => s);
  for (const s of conteudo)
    linhas.push(s ? { translate: "cl.gaveta.linha", with: { rawtext: [nomeDe(s.t), { text: String(s.n) }, { text: String(capacidade(b.typeId, g, s.t)) }] } } : { translate: "cl.gaveta.vazia" }, { text: "\n" });
  linhas.push({ translate: "cl.gaveta.melhorias", with: [String(g.up?.length ?? 0), String(mult(g))] });
  const f = new ActionFormData().title({ translate: "cl.gaveta.titulo" }).body({ rawtext: linhas });
  for (const u of g.up ?? []) f.button({ translate: "cl.gaveta.tirar_melhoria", with: { rawtext: [nomeDe(u)] } }, iconeDe(u));
  f.button({ translate: "cl.tc.voltar" });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || r.selection >= (g.up?.length ?? 0)) return;
  const agora = ler(b);
  const [u] = (agora.up ?? []).splice(r.selection, 1);
  if (!u) return;
  // Tirar uma melhoria de armazenamento não pode deixar a gaveta acima do limite.
  const passou = agora.s.some((s) => s && s.n > capacidade(b.typeId, agora, s.t));
  if (passou) return aviso(j, "cl.gaveta.cheia", 2);
  gravar(b, agora);
  j.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack(u, 1));
}

// ---------- Controlador: a rede é o que está encostado (gavetas e acabamento) ----------
function rede(b: Block, max = 256): Block[] {
  const vistos = new Set<string>([`${b.x},${b.y},${b.z}`]);
  const fila: Block[] = [b];
  const achadas: Block[] = [];
  const V = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  while (fila.length && vistos.size < max) {
    const at = fila.shift()!;
    for (const [dx, dy, dz] of V) {
      const k = `${at.x + dx},${at.y + dy},${at.z + dz}`;
      if (vistos.has(k)) continue;
      vistos.add(k);
      let n: Block | undefined;
      try {
        n = at.offset({ x: dx, y: dy, z: dz });
      } catch {
        continue;
      }
      if (!n || (!ehGaveta(n.typeId) && n.typeId !== ACABAMENTO && n.typeId !== CONTROLADOR)) continue;
      fila.push(n);
      if (ehGaveta(n.typeId)) achadas.push(n);
    }
  }
  return achadas;
}
function controlador(j: Player, b: Block): void {
  const gavetas = rede(b).map((x) => ({ b: x, g: ler(x) }));
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv || !gavetas.length) return;
  const mao = inv.getItem(j.selectedSlotIndex);
  // Com item: só ele (e dois toques: tudo dele); de mão vazia: tudo da mochila que já tem gaveta.
  const slots = mao ? [j.selectedSlotIndex] : Array.from({ length: inv.size }, (_, s) => s);
  let total = 0;
  for (const s of slots) {
    const it = inv.getItem(s);
    if (!it || !simples(it)) continue;
    let resto = it.amount;
    for (const { b: gb, g } of gavetas) {
      if (!resto) break;
      if (ehCompacta(gb.typeId)) {
        const c = cadeiaDe(it.typeId);
        if (!c || g.c !== c[c.length - 1][0]) continue;
        resto -= Math.min(resto, por(gb, g, 0, it.typeId, resto));
        continue;
      }
      for (let k = 0; k < g.s.length && resto; k++) if (g.s[k]?.t === it.typeId) resto -= Math.min(resto, por(gb, g, k, it.typeId, resto));
    }
    // Com o item na mão, o que sobrou vai para a primeira gaveta vazia.
    if (mao && resto)
      for (const { b: gb, g } of gavetas) {
        if (ehCompacta(gb.typeId) || !resto) continue;
        const k = g.s.findIndex((x) => !x);
        if (k >= 0) resto -= Math.min(resto, por(gb, g, k, it.typeId, resto));
      }
    total += it.amount - resto;
    if (resto === it.amount) continue;
    if (resto) {
      it.amount = resto;
      inv.setItem(s, it);
    } else inv.setItem(s, undefined);
  }
  for (const { b: gb, g } of gavetas) gravar(gb, g);
  if (total) {
    j.playSound("random.pop", { volume: 0.4 });
    registrarAcao(j, "sd_controlador");
    contar(j, total);
  }
  aviso(j, { translate: "cl.gaveta.controlador", with: [String(total)] }, 2);
}

export const gavetaComp: BlockCustomComponent = {
  onPlayerInteract({ player, block, face, faceLocation }) {
    if (!player) return;
    const rel = faceLocation ? { x: faceLocation.x - block.x, y: faceLocation.y - block.y, z: faceLocation.z - block.z } : { x: 0.5, y: 0.5, z: 0.5 };
    // O ponto pode vir no mundo ou já relativo ao bloco.
    const p = Math.abs(rel.x) > 1.5 || Math.abs(rel.y) > 1.5 || Math.abs(rel.z) > 1.5 ? faceLocation! : rel;
    tocar(player, block, face, p);
  },
};

const pendente = new Map<string, { cod: string; tick: number }>();
export function registrarGavetas(): void {
  registrarDetalhe(Object.keys(DEF).map((x) => `cl:${x}`), (b) => {
    const g = ler(b);
    const raw: RawMessage[] = [];
    const itens = ehCompacta(b.typeId) ? (g.s[0] && g.c ? [{ t: (cadeiaBase(g.c) ?? [[g.c, 1]])[0][0], n: Math.floor(g.s[0].n / ((cadeiaBase(g.c) ?? [[g.c, 1]])[0][1] as number)) }] : []) : g.s.filter((s): s is { t: string; n: number } => !!s);
    for (const s of itens) raw.push(raw.length ? { text: " · " } : { text: "" }, nomeDe(s.t), { text: ` ${s.n}` });
    return raw.length ? { rawtext: raw } : { translate: "cl.gaveta.vazia" };
  });
  // Bater tira.
  world.afterEvents.entityHitBlock.subscribe(({ damagingEntity, hitBlock }) => {
    if (!(damagingEntity instanceof Player) || !ehGaveta(hitBlock.typeId)) return;
    bater(damagingEntity, hitBlock);
  });
  // Quebrar: a gaveta vira item com tudo dentro.
  world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const b = ev.block;
    if (!ehGaveta(b.typeId)) return;
    const g = lerEm<Gav>(T, b.dimension, b.location, { s: [] });
    if (!g.s.some(Boolean) && !g.up?.length && !g.trava) return; // vazia: quebra normal
    ev.cancel = true;
    const tipo = b.typeId, dim = b.dimension, onde = { x: b.x, y: b.y, z: b.z };
    system.run(() => {
      const bloco = dim.getBlock(onde);
      if (!bloco || bloco.typeId !== tipo) return;
      const item = new ItemStack(tipo, 1);
      const n = g.s.reduce((s, x) => s + (x?.n ?? 0), 0);
      guardarNoItem(item, g, `§7${n}`);
      gravarEm(T, dim, onde, undefined);
      bloco.setType("minecraft:air");
      dim.spawnItem(item, { x: onde.x + 0.5, y: onde.y + 0.3, z: onde.z + 0.5 });
    });
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const i = ev.itemStack;
    if (!i || !ehGaveta(i.typeId)) return;
    const cod = codigoDoItem(i);
    if (cod) pendente.set(ev.player.id, { cod, tick: system.currentTick });
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (!ehGaveta(block.typeId)) return;
    const p = pendente.get(player.id);
    pendente.delete(player.id);
    const g = p && system.currentTick - p.tick <= 3 ? lerCodigo<Gav>(p.cod) : undefined;
    if (g) gravarEm(T, block.dimension, block.location, g);
    if (block.typeId === "cl:gaveta_compactadora") registrarAcao(player, "sd_compacta");
  });
  // Teste no servidor (o jogador simulado não dá o ponto do toque): scriptevent cl:teste_gaveta <por|tirar|controlador> x y z k
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_gaveta" || !(j instanceof Player)) return;
    const [acao, x, y, z, k] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (!b) return;
    if (acao === "controlador") return controlador(j, b);
    if (acao === "por") {
      const g = ler(b);
      const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
      if (!mao) return;
      const entrou = por(b, g, Number(k ?? 0), mao.typeId, mao.amount);
      gravar(b, g);
      if (entrou >= mao.amount) j.getComponent("minecraft:inventory")?.container?.setItem(j.selectedSlotIndex, undefined);
      else (mao.amount -= entrou), j.getComponent("minecraft:inventory")?.container?.setItem(j.selectedSlotIndex, mao);
    }
    if (acao === "tirar") {
      const g = ler(b);
      const it = tirar(b, g, Number(k ?? 0), 64);
      gravar(b, g);
      if (it) j.getComponent("minecraft:inventory")?.container?.addItem(it);
    }
    if (acao === "melhorar") {
      const g = ler(b);
      (g.up ??= []).push(k);
      gravar(b, g);
    }
    console.warn(`[teste_gaveta] ${JSON.stringify(ler(b))}`);
  });
}

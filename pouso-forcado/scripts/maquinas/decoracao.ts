import { Block, BlockCustomComponent, BlockTypes, Direction, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DADOS_F23, DADOS_F64 } from "../conteudo/gerado.js";
import { cabe, entrada, entregar, tirar } from "../util/maquina.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";
import { ItemSalvo, carregarItem, salvarItem } from "../util/itens.js";
import { toqueNovo } from "../util/toque.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * Fase 23: Chisel, BiblioCraft e ChickenChunks.
 * - Cinzel (500 usos): toque num bloco de uma família para trocar pela próxima variante; agachado e
 *   usando no ar, escolhe um bloco da mochila e a variante e converte a pilha inteira (sem gastar).
 * - Estante (16 livros), Prateleira (4 itens), Suporte de Ferramentas (4 ferramentas), Expositor (1 item):
 *   toque com o item para pôr, com a mão vazia para tirar o último. Quebrar solta tudo.
 * - Cabide de Armadura: troca a sua armadura pela que está nele.
 * - Lanterna e Lâmpada: toque liga/desliga a luz.
 * - Carregador de Chunks (3x3 chunks) e Pontual (1 chunk): área carregada do jogo ("tickingarea"); toque
 *   liga/desliga. O jogo aceita no máximo 10 áreas por mundo.
 */
// 1.45.0 (Chisel 1.18): as famílias novas e as variantes novas do arenito juntam com as da fase 23.
const FAMILIAS: Readonly<Record<string, readonly string[]>> = (() => {
  const f: Record<string, string[]> = {};
  for (const fonte of [DADOS_F23.familias, DADOS_F64.familias] as Readonly<Record<string, readonly string[]>>[])
    for (const [k, lista] of Object.entries(fonte)) f[k] = [...new Set([...(f[k] ?? []), ...lista])];
  return f;
})();
const FAMILIA_DE = new Map<string, readonly string[]>();
for (const lista of Object.values(FAMILIAS)) for (const id of lista) FAMILIA_DE.set(id, lista);
const nome = (id: string): RawMessage => ({ translate: new ItemStack(id, 1).localizationKey });

// ---------- Cinzel ----------
function gastarCinzel(j: Player): void {
  if (j.getGameMode() === GameMode.Creative) return;
  const inv = j.getComponent("minecraft:inventory")?.container;
  const c = inv?.getItem(j.selectedSlotIndex);
  const dur = c?.getComponent("minecraft:durability");
  if (!inv || !c || !dur) return;
  if (dur.damage + 1 >= dur.maxDurability) {
    inv.setItem(j.selectedSlotIndex, undefined);
    j.playSound("random.break");
    return;
  }
  dur.damage++;
  inv.setItem(j.selectedSlotIndex, c);
}

// 1.45.0: os cinzéis do Chisel 1.18 e os modos (ChiselMode): o de ferro só um bloco; o de diamante também painel 3×3,
// coluna 3×1 e linha 1×3; o Hi-Tech também os blocos iguais ligados (até 10 de distância).
const CINZEIS = new Set(["cl:cinzel", "cl:cinzel_diamante", "cl:cinzel_hitech"]);
type Modo = "um" | "painel" | "coluna" | "linha" | "contiguo";
const MODOS: Readonly<Record<string, readonly Modo[]>> = {
  "cl:cinzel": ["um"], "cl:cinzel_diamante": ["um", "painel", "coluna", "linha"], "cl:cinzel_hitech": ["um", "painel", "coluna", "linha", "contiguo"],
};
function alvos(b: Block, modo: Modo, face: Direction): Block[] {
  const d = b.dimension;
  const em = (x: number, y: number, z: number) => d.getBlock({ x: b.x + x, y: b.y + y, z: b.z + z });
  const lista: (Block | undefined)[] = [];
  const vertical = face === Direction.Up || face === Direction.Down;
  const eixoX = face === Direction.North || face === Direction.South;
  if (modo === "painel")
    for (let a = -1; a <= 1; a++) for (let c = -1; c <= 1; c++) lista.push(vertical ? em(a, 0, c) : eixoX ? em(a, c, 0) : em(0, c, a));
  else if (modo === "coluna") for (let a = -1; a <= 1; a++) lista.push(vertical ? em(0, 0, a) : em(0, a, 0));
  else if (modo === "linha") for (let a = -1; a <= 1; a++) lista.push(eixoX || vertical ? em(a, 0, 0) : em(0, 0, a));
  else if (modo === "contiguo") {
    const vistos = new Set<string>();
    const fila: Block[] = [b];
    while (fila.length && lista.length < 128) {
      const v = fila.shift()!;
      const k = `${v.x},${v.y},${v.z}`;
      if (vistos.has(k) || v.typeId !== b.typeId || Math.abs(v.x - b.x) > 10 || Math.abs(v.y - b.y) > 10 || Math.abs(v.z - b.z) > 10) continue;
      vistos.add(k);
      lista.push(v);
      for (const n of [v.above(), v.below(), v.north(), v.south(), v.east(), v.west()]) if (n) fila.push(n);
    }
  } else lista.push(b);
  return lista.filter((x): x is Block => !!x && x.typeId === b.typeId);
}
function cinzelarBloco(j: Player, b: Block, face: Direction = Direction.Up): void {
  // A Placa do Casco é item, não bloco: no mundo o ciclo pula ela.
  const lista = FAMILIA_DE.get(b.typeId)?.filter((id) => BlockTypes.get(id));
  if (!lista) return;
  const prox = lista[(lista.indexOf(b.typeId) + 1) % lista.length];
  const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
  const modo = ((mao?.getDynamicProperty("cl:modo") as Modo | undefined) ?? "um");
  const blocos = MODOS[mao?.typeId ?? "cl:cinzel"]?.includes(modo) ? alvos(b, modo, face) : [b];
  for (const v of blocos) {
    v.setType(prox);
    gastarCinzel(j);
    registrarAcao(j, "cinzelar");
  }
  b.dimension.playSound("dig.stone", b.center(), { pitch: 1.4 });
}
async function escolherModo(j: Player): Promise<void> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const c = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !c || !MODOS[c.typeId]) return;
  const f = new ActionFormData().title({ translate: "cl.ch.modo" });
  for (const m of MODOS[c.typeId]) f.button({ translate: `cl.ch.modo.${m}` });
  f.button({ translate: "cl.ch.titulo" });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection >= MODOS[c.typeId].length) return cinzelarPilha(j);
  const agora = inv.getItem(j.selectedSlotIndex);
  if (agora?.typeId !== c.typeId) return;
  const m = MODOS[c.typeId][r.selection];
  agora.setDynamicProperty("cl:modo", m);
  inv.setItem(j.selectedSlotIndex, agora);
  aviso(j, { translate: "cl.ch.modo_atual", with: { rawtext: [{ translate: `cl.ch.modo.${m}` }] } }, 2);
}

// ---------- Cinzel Automático (Chisel 1.18) ----------
export const cinzelAutomatico: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    if (!player) return;
    const mao = player.getComponent("minecraft:inventory")?.container?.getItem(player.selectedSlotIndex);
    if (!mao || !FAMILIA_DE.has(mao.typeId)) return aviso(player, "cl.ch.auto_sem", 3);
    gravar("ch_alvo", block, mao.typeId);
    aviso(player, { translate: "cl.ch.auto_alvo", with: { rawtext: [nome(mao.typeId)] } }, 3);
  },
  onTick({ block }) {
    const alvo = ler<string | undefined>("ch_alvo", block, undefined);
    const familia = alvo ? FAMILIA_DE.get(alvo) : undefined;
    const c = entrada(block);
    if (!alvo || !familia || !c || !cabe(block)) return;
    for (let s = 0; s < c.size; s++) {
      const it = c.getItem(s);
      if (!it || it.typeId === alvo || !familia.includes(it.typeId)) continue;
      tirar(c, it.typeId, 1);
      entregar(block, [new ItemStack(alvo, 1)]);
      try {
        for (const j of block.dimension.getPlayers({ location: block.center(), maxDistance: 12 })) registrarAcao(j, "ch18_auto");
      } catch {
        // descarregado
      }
      return;
    }
  },
};

async function cinzelarPilha(j: Player): Promise<void> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const slots: number[] = [];
  for (let s = 0; s < inv.size; s++) if (FAMILIA_DE.has(inv.getItem(s)?.typeId ?? "")) slots.push(s);
  if (!slots.length) return aviso(j, "cl.ch.nada", 5);
  const f1 = new ActionFormData().title({ translate: "cl.ch.titulo" }).body({ translate: "cl.ch.corpo" });
  for (const s of slots) {
    const p = inv.getItem(s)!;
    f1.button({ rawtext: [nome(p.typeId), { text: ` §7x${p.amount}` }] });
  }
  const r1 = await f1.show(j);
  if (r1.canceled || r1.selection === undefined) return;
  const slot = slots[r1.selection];
  const pilha = inv.getItem(slot);
  if (!pilha) return;
  const lista = FAMILIA_DE.get(pilha.typeId)!;
  const opcoes = lista.filter((id) => id !== pilha.typeId);
  const f2 = new ActionFormData().title({ translate: "cl.ch.variante", with: { rawtext: [nome(pilha.typeId)] } });
  for (const id of opcoes) f2.button(nome(id));
  const r2 = await f2.show(j);
  if (r2.canceled || r2.selection === undefined) return;
  const atual = inv.getItem(slot);
  if (atual?.typeId !== pilha.typeId) return;
  inv.setItem(slot, new ItemStack(opcoes[r2.selection], atual.amount));
  j.playSound("dig.stone", { pitch: 1.4 });
  for (let i = 0; i < Math.min(atual.amount, 64); i++) registrarAcao(j, "cinzelar");
}

// ---------- BiblioCraft: móveis que guardam itens ----------
type Guarda = { itens: ItemSalvo[] };
const LIMITE: Readonly<Record<string, number>> = { "cl:estante": 16, "cl:prateleira": 4, "cl:suporte_ferramentas": 4, "cl:expositor": 1 };
const LIVROS = new Set(["minecraft:book", "minecraft:written_book", "minecraft:writable_book", "minecraft:enchanted_book"]);

function tocarGuarda(j: Player, b: Block): void {
  const d = ler<Guarda>("guarda", b, { itens: [] });
  const max = LIMITE[b.typeId] ?? 1;
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  if (mao && inv) {
    if (b.typeId === "cl:estante" && !LIVROS.has(mao.typeId)) return aviso(j, "cl.bc.so_livro");
    if (b.typeId === "cl:suporte_ferramentas" && mao.maxAmount > 1) return aviso(j, "cl.bc.so_ferramenta");
    if (d.itens.length >= max) return aviso(j, "cl.bc.cheio");
    // Estante e suporte guardam 1 por vez; prateleira e expositor, a pilha da mão.
    const um = b.typeId === "cl:estante" || b.typeId === "cl:suporte_ferramentas";
    const vai = mao.clone();
    if (um) vai.amount = 1;
    d.itens.push(salvarItem(vai)!);
    if (um && mao.amount > 1) {
      mao.amount--;
      inv.setItem(j.selectedSlotIndex, mao);
    } else inv.setItem(j.selectedSlotIndex, undefined);
    j.playSound("random.pop", { pitch: 0.8 });
    if (b.typeId === "cl:estante" && d.itens.length >= 8) registrarAcao(j, "estante");
  } else {
    const ultimo = d.itens.pop();
    const i = carregarItem(ultimo ?? null);
    if (i) darAoJogador(j, i);
  }
  gravar("guarda", b, d.itens.length ? d : undefined);
  const chave = b.typeId === "cl:estante" ? { translate: "cl.bc.estante", with: [String(d.itens.length)] } : { translate: "cl.bc.guarda", with: { rawtext: [{ translate: b.localizationKey }, { text: String(d.itens.length) }, { text: String(max) }] } };
  aviso(j, chave, 4);
}

export const estante: BlockCustomComponent = { onPlayerInteract: (e) => e.player && tocarGuarda(e.player, e.block) };
export const guardaItens: BlockCustomComponent = { onPlayerInteract: (e) => e.player && tocarGuarda(e.player, e.block) };

const ARMADURA = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
export const cabide: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const eq = j.getComponent("minecraft:equippable");
    if (!eq) return;
    const guardada = ler<Record<string, ItemSalvo | null>>("cabide", e.block, {});
    const nova: Record<string, ItemSalvo | null> = {};
    for (const slot of ARMADURA) {
      nova[slot] = salvarItem(eq.getEquipment(slot));
      eq.setEquipment(slot, carregarItem(guardada[slot] ?? null));
    }
    gravar("cabide", e.block, Object.values(nova).some((x) => x) ? nova : undefined);
    j.playSound("armor.equip_generic");
    aviso(j, "cl.bc.cabide");
    registrarAcao(j, "cabide");
  },
};

export const luminaria: BlockCustomComponent = {
  onPlayerInteract(e) {
    definirEstado(e.block, "cl:aceso", !lerEstado<boolean>(e.block, "cl:aceso"));
    e.dimension.playSound("random.click", e.block.center());
  },
};

// ---------- ChickenChunks ----------
const nomeArea = (b: Block) => `cl_cc_${b.x}_${b.y}_${b.z}`.replace(/-/g, "m");
function ligarCarregador(b: Block, ligar: boolean): boolean {
  try {
    if (ligar) {
      if (b.typeId === "cl:carregador_chunks") b.dimension.runCommand(`tickingarea add circle ${b.x} ${b.y} ${b.z} 1 ${nomeArea(b)} true`);
      else b.dimension.runCommand(`tickingarea add ${b.x} ${b.y} ${b.z} ${b.x} ${b.y} ${b.z} ${nomeArea(b)} true`);
    } else b.dimension.runCommand(`tickingarea remove ${nomeArea(b)}`);
    return true;
  } catch {
    return false;
  }
}

export const carregador: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const ligado = lerEstado<boolean>(b, "cl:ligado");
    if (!ligado) {
      if (!ligarCarregador(b, true)) return aviso(j, "cl.cc.limite", 5);
      definirEstado(b, "cl:ligado", true);
      registrarAcao(j, "carregador");
      return aviso(j, { translate: "cl.cc.ligado", with: { rawtext: [{ translate: b.typeId === "cl:carregador_chunks" ? "cl.cc.area_3x3" : "cl.cc.area_1" }] } }, 5);
    }
    ligarCarregador(b, false);
    definirEstado(b, "cl:ligado", false);
    aviso(j, "cl.cc.desligado");
  },
};

export function registrarDecoracao(): void {
  // Teste no servidor: scriptevent cl:teste_ch <modo m | cinzelar x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_ch" || !(j instanceof Player)) return;
    const [acao, a, y, z] = message.split(" ");
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (acao === "modo" && inv) {
      const c = inv.getItem(j.selectedSlotIndex);
      c?.setDynamicProperty("cl:modo", a);
      if (c) inv.setItem(j.selectedSlotIndex, c);
    }
    if (acao === "cinzelar") {
      const b = j.dimension.getBlock({ x: Number(a), y: Number(y), z: Number(z) });
      if (b) cinzelarBloco(j, b, Direction.Up);
    }
    console.warn(`[teste_ch] ${message}`);
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (!CINZEIS.has(ev.itemStack?.typeId ?? "") || !toqueNovo(ev) || !FAMILIA_DE.has(ev.block.typeId)) return;
    ev.cancel = true;
    const { player, block, blockFace } = ev;
    system.run(() => cinzelarBloco(player, block, blockFace));
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === "cl:cinzel" && source.isSneaking) system.run(() => abrirUmMenu(source, () => cinzelarPilha(source)));
    else if (CINZEIS.has(itemStack.typeId) && source.isSneaking) system.run(() => abrirUmMenu(source, () => escolherModo(source)));
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId.startsWith("cl:lampada_")) registrarAcao(player, "lampada_cor");
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    const dim = block.dimension, p = block.location;
    if (LIMITE[id]) {
      for (const s of lerEm<Guarda>("guarda", dim, p, { itens: [] }).itens) {
        const i = carregarItem(s);
        if (i) dim.spawnItem(i, block.center());
      }
      gravarEm("guarda", dim, p, undefined);
    }
    if (id === "cl:cabide_armadura") {
      for (const s of Object.values(lerEm<Record<string, ItemSalvo | null>>("cabide", dim, p, {}))) {
        const i = carregarItem(s);
        if (i) dim.spawnItem(i, block.center());
      }
      gravarEm("cabide", dim, p, undefined);
    }
    if (id === "cl:carregador_chunks" || id === "cl:carregador_pontual") {
      try {
        dim.runCommand(`tickingarea remove ${`cl_cc_${p.x}_${p.y}_${p.z}`.replace(/-/g, "m")}`);
      } catch {
        // já não existia
      }
    }
  });
  registrarDetalhe(Object.keys(LIMITE), (b) => {
    const d = ler<Guarda>("guarda", b, { itens: [] });
    if (!d.itens.length) return undefined;
    return { translate: "cl.bc.conteudo", with: { rawtext: d.itens.slice(0, 3).flatMap((s, i) => [{ text: i ? ", " : "" }, nome(s.t), { text: s.n > 1 ? ` x${s.n}` : "" }]) } };
  });
}

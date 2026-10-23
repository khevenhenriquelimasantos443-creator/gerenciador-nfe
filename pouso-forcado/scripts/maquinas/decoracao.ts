import { Block, BlockCustomComponent, BlockTypes, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DADOS_F23 } from "../conteudo/gerado.js";
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
const FAMILIAS = DADOS_F23.familias as Readonly<Record<string, readonly string[]>>;
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

function cinzelarBloco(j: Player, b: Block): void {
  // A Placa do Casco é item, não bloco: no mundo o ciclo pula ela.
  const lista = FAMILIA_DE.get(b.typeId)?.filter((id) => BlockTypes.get(id));
  if (!lista) return;
  const prox = lista[(lista.indexOf(b.typeId) + 1) % lista.length];
  b.setType(prox);
  b.dimension.playSound("dig.stone", b.center(), { pitch: 1.4 });
  gastarCinzel(j);
  registrarAcao(j, "cinzelar");
}

async function cinzelarPilha(j: Player): Promise<void> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const slots: number[] = [];
  for (let s = 0; s < inv.size; s++) if (FAMILIA_DE.has(inv.getItem(s)?.typeId ?? "")) slots.push(s);
  if (!slots.length) return aviso(j, "cl.ch.nada", 5);
  const f1 = new ActionFormData().title({ translate: "cl.ch.titulo" }).body({ translate: "cl.ch.corpo" });
  for (const s of slots) {
    const p = inv.getItem(s)!;
    f1.button({ rawtext: [nome(p.typeId), { text: ` §8x${p.amount}` }] });
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
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "cl:cinzel" || !toqueNovo(ev) || !FAMILIA_DE.has(ev.block.typeId)) return;
    ev.cancel = true;
    const { player, block } = ev;
    system.run(() => cinzelarBloco(player, block));
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === "cl:cinzel" && source.isSneaking) system.run(() => abrirUmMenu(source, () => cinzelarPilha(source)));
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

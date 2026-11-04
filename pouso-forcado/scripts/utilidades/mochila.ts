import { Entity, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconeDe, nomeDe, registrarNoCatalogo } from "../catalogo/catalogo.js";
import { abrirUmMenu } from "../util/menus.js";
import { registrarAcao } from "../missoes/progresso.js";
import { aviso } from "../jogador/hud.js";
import { darAoJogador } from "../util/inventario.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { mochilaUsadaEmBau } from "./melhorias_mochila.js";
import { ehMochila, espacosDe, NIVEIS, paginasDe, POR_PAGINA } from "./mochila_niveis.js";

/*
 * Mochila (1.10.0), a do mod Backpacks (Eydamos): 27 espaços. O Bedrock não abre a tela de um item, então a mochila
 * vira um baú no chão: usar o item a põe na frente do jogador (botão Abrir para mexer nela) e bater nela a guarda de
 * volta no item, com tudo dentro (quantidade, nome, desgaste, encantamentos e propriedades, como os corpos do Sync).
 * Mochila dentro de mochila vale. 1.25.0: os níveis do Sophisticated Backpacks (mochila_niveis.ts), em páginas de 27.
 */
const ENTIDADE = "cl:mochila";
const CONTEUDO = "cl:conteudo";
// 1.25.0: a mochila aberta guarda o nível, a página e tudo o que está nas outras páginas.
const MATERIAIS = new Set(Object.values(NIVEIS).map((n) => n.material).filter((x): x is string => !!x));
const P_TIPO = "cl:mochila_tipo", P_PAG = "cl:pag", P_TUDO = "cl:paginas";
type Slots = (ItemSalvo | null)[];
const tipoDe = (m: Entity) => (m.getDynamicProperty(P_TIPO) as string | undefined) ?? "cl:mochila";
function tudoDe(m: Entity): Slots {
  try {
    const v = m.getDynamicProperty(P_TUDO);
    return typeof v === "string" ? (JSON.parse(v) as Slots) : [];
  } catch {
    return [];
  }
}
/** Passa o que está aberto (a página atual) para a lista de tudo. */
function salvarPagina(m: Entity, tudo: Slots): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  const pag = (m.getDynamicProperty(P_PAG) as number | undefined) ?? 0;
  if (!c) return;
  const total = espacosDe(tipoDe(m));
  for (let k = 0; k < POR_PAGINA; k++) {
    const idx = pag * POR_PAGINA + k;
    if (idx < total) {
      tudo[idx] = salvarItem(c.getItem(k));
      continue;
    }
    // A última página não é cheia (45 = 27 + 18): o que foi posto além da conta cai no chão, não some.
    const i = c.getItem(k);
    if (i) {
      c.setItem(k, undefined);
      m.dimension.spawnItem(i, m.location);
    }
  }
}
function abrirPagina(m: Entity, tudo: Slots, pag: number): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  c.clearAll();
  const total = espacosDe(tipoDe(m));
  for (let k = 0; k < POR_PAGINA; k++) {
    const idx = pag * POR_PAGINA + k;
    if (idx >= total) break;
    const i = carregarItem(tudo[idx] ?? null);
    if (i) c.setItem(k, i);
  }
  m.setDynamicProperty(P_PAG, pag);
  m.setDynamicProperty(P_TUDO, JSON.stringify(tudo));
}

function conteudoDe(i: ItemStack): (ItemSalvo | null)[] {
  try {
    const v = i.getDynamicProperty(CONTEUDO);
    return typeof v === "string" ? (JSON.parse(v) as (ItemSalvo | null)[]) : [];
  } catch {
    return [];
  }
}

function por(j: Player): void {
  const mao = j.getComponent("minecraft:equippable")?.getEquipmentSlot(EquipmentSlot.Mainhand);
  const item = mao?.getItem();
  if (!mao || !item || !ehMochila(item.typeId)) return;
  const v = j.getViewDirection();
  const n = Math.hypot(v.x, v.z) || 1;
  const local = { x: j.location.x + (v.x / n) * 1.3, y: j.location.y + 0.2, z: j.location.z + (v.z / n) * 1.3 };
  let m: Entity;
  try {
    m = j.dimension.spawnEntity(ENTIDADE, local);
  } catch {
    return;
  }
  m.setRotation({ x: 0, y: j.getRotation().y + 180 });
  m.setDynamicProperty(P_TIPO, item.typeId);
  abrirPagina(m, conteudoDe(item), 0);
  if (item.nameTag) m.nameTag = item.nameTag;
  mao.setItem(undefined);
  j.playSound("armor.equip_leather");
  aviso(j, "cl.mochila.dica", 5);
}

function guardar(j: Player, m: Entity): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  const tipo = tipoDe(m);
  const slots = tudoDe(m);
  salvarPagina(m, slots);
  while (slots.length < espacosDe(tipo)) slots.push(null);
  slots.length = espacosDe(tipo);
  const usados = slots.filter(Boolean).length;
  const item = new ItemStack(tipo, 1);
  if (m.nameTag) item.nameTag = m.nameTag;
  try {
    if (usados) item.setDynamicProperty(CONTEUDO, JSON.stringify(slots));
    item.setLore([`§7${usados}/${espacosDe(tipo)}`]);
  } catch {
    // Conteúdo grande demais para guardar no item: fica no chão, o que é mais seguro do que sumir.
    return;
  }
  c?.clearAll();
  m.remove();
  darAoJogador(j, item);
  j.playSound("armor.equip_leather");
}

/**
 * 1.25.0: tocar a mochila no chão. Com o material do nível na mão, sobe de nível (sem perder nada); agachado, troca de
 * página. Devolve se tratou o toque (aí a tela da mochila não abre). Pode rodar no evento "antes" (só lê; o resto vai
 * para o próximo tick).
 */
function tocar(j: Player, m: Entity, mao: ItemStack | undefined): boolean {
  const tipo = tipoDe(m);
  const n = NIVEIS[tipo];
  // Material de outro nível na mão (o botão do celular vira "Melhorar"): diz qual é o certo.
  if (mao && MATERIAIS.has(mao.typeId) && mao.typeId !== n?.material) {
    system.run(() =>
      n?.prox && n.material
        ? aviso(j, { translate: "cl.sb.nivel_outro", with: { rawtext: [{ text: String(n.qtd ?? 1) }, { translate: new ItemStack(n.material).localizationKey }] } }, 4)
        : aviso(j, "cl.sb.nivel_max", 3),
    );
    return true;
  }
  if (n?.prox && mao?.typeId === n.material) {
    system.run(() => {
      if (!m.isValid) return;
      const inv = j.getComponent("minecraft:inventory")?.container;
      const p = inv?.getItem(j.selectedSlotIndex);
      if (!inv || !p || p.typeId !== n.material || p.amount < (n.qtd ?? 1)) return aviso(j, { translate: "cl.sb.nivel_falta", with: [String(n.qtd ?? 1)] }, 4);
      if (p.amount === (n.qtd ?? 1)) inv.setItem(j.selectedSlotIndex, undefined);
      else {
        p.amount -= n.qtd ?? 1;
        inv.setItem(j.selectedSlotIndex, p);
      }
      const tudo = tudoDe(m);
      salvarPagina(m, tudo);
      m.setDynamicProperty(P_TIPO, n.prox!);
      abrirPagina(m, tudo, (m.getDynamicProperty(P_PAG) as number | undefined) ?? 0);
      j.playSound("random.anvil_use");
      aviso(j, { translate: "cl.sb.nivel_subiu", with: { rawtext: [{ translate: new ItemStack(n.prox!).localizationKey }, { text: String(espacosDe(n.prox!)) }] } }, 4);
    });
    return true;
  }
  if (!j.isSneaking) return false;
  system.run(() => {
    if (!m.isValid) return;
    if (paginasDe(tipo) <= 1) return aviso(j, { translate: "cl.sb.pagina", with: ["1", "1"] }, 3);
    const tudo = tudoDe(m);
    salvarPagina(m, tudo);
    const prox = (((m.getDynamicProperty(P_PAG) as number | undefined) ?? 0) + 1) % paginasDe(tipo);
    abrirPagina(m, tudo, prox);
    j.playSound("item.book.page_turn");
    aviso(j, { translate: "cl.sb.pagina", with: [String(prox + 1), String(paginasDe(tipo))] }, 3);
  });
  return true;
}

// ---------- 1.31.0: a mochila que abre na mão (sem pôr no chão) ----------
// O Bedrock não abre a tela de um item; a mochila na mão abre um menu: guardar (tudo da mochila do jogador, ou um
// item), tirar (um ou tudo) e "pôr no chão" para a tela completa de antes. Agachado, usar põe direto no chão.
const simples = (s: ItemSalvo) => !s.dp && !s.nome && !s.lore && !s.dano && !s.enc;
function slotsDaMochila(i: ItemStack): Slots {
  const slots = conteudoDe(i);
  const total = espacosDe(i.typeId);
  while (slots.length < total) slots.push(null);
  slots.length = total;
  return slots;
}
/** Grava o conteúdo na mochila da mão (se ainda for a mesma). Devolve se coube na propriedade do item. */
function gravarNaMao(j: Player, tipo: string, slots: Slots): boolean {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !i || i.typeId !== tipo) return false;
  const usados = slots.filter(Boolean).length;
  try {
    i.setDynamicProperty(CONTEUDO, usados ? JSON.stringify(slots) : undefined);
  } catch {
    aviso(j, "cl.mochila.cheia_dados", 4);
    return false;
  }
  i.setLore([`§7${usados}/${espacosDe(tipo)}`]);
  inv.setItem(j.selectedSlotIndex, i);
  return true;
}
/** Põe a pilha nos espaços (junta com as iguais); devolve o que sobrou. */
function enfiar(slots: Slots, it: ItemStack): number {
  const s = salvarItem(it);
  if (!s) return 0;
  let resto = s.n;
  if (simples(s))
    for (const x of slots) {
      if (!x || x.t !== s.t || !simples(x) || x.n >= it.maxAmount) continue;
      const n = Math.min(it.maxAmount - x.n, resto);
      x.n += n;
      resto -= n;
      if (!resto) return 0;
    }
  const k = slots.indexOf(null);
  if (k < 0) return resto;
  slots[k] = { ...s, n: resto };
  return 0;
}
/** Guarda a mochila do jogador (espaços 9 a 35) na mochila da mão; a barra rápida fica. */
function guardarTudo(j: Player, tipo: string): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const agora = inv.getItem(j.selectedSlotIndex);
  if (agora?.typeId !== tipo) return;
  const s2 = slotsDaMochila(agora);
  let n = 0;
  const antes: [number, ItemStack][] = [];
  for (let k = 9; k < inv.size; k++) {
    const it = inv.getItem(k);
    if (!it) continue;
    const resto = enfiar(s2, it);
    if (resto === it.amount) continue;
    antes.push([k, it.clone()]);
    if (resto) {
      it.amount = resto;
      inv.setItem(k, it);
    } else inv.setItem(k, undefined);
    n++;
  }
  if (!gravarNaMao(j, tipo, s2)) {
    for (const [k, it] of antes) inv.setItem(k, it); // não coube: devolve tudo
    return;
  }
  j.playSound("armor.equip_leather");
  if (n) registrarAcao(j, "mochila_mao");
  return aviso(j, { translate: "cl.mochila.mao_guardou", with: [String(n)] }, 3);
}

async function menuMochila(j: Player): Promise<void> {
  const i = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
  if (!i || !ehMochila(i.typeId)) return;
  const tipo = i.typeId;
  const slots = slotsDaMochila(i);
  const usados = slots.filter(Boolean).length;
  const f = new ActionFormData()
    .title({ rawtext: [{ translate: new ItemStack(tipo).localizationKey }, { text: ` §8${usados}/${slots.length}` }] })
    .button({ translate: "cl.mochila.mao_guardar_tudo" }, iconeDe("minecraft:chest"))
    .button({ translate: "cl.mochila.mao_guardar_um" }, iconeDe("minecraft:hopper"))
    .button({ translate: "cl.mochila.mao_tirar", with: [String(usados)] }, iconeDe(tipo))
    .button({ translate: "cl.mochila.mao_tirar_tudo" }, iconeDe("minecraft:dropper"))
    .button({ translate: "cl.mochila.mao_chao" }, iconeDe("minecraft:barrel"));
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  if (r.selection === 4) return por(j);
  if (r.selection === 0) return guardarTudo(j, tipo);
  if (r.selection === 1) {
    const lista: number[] = [];
    const g = new ActionFormData().title({ translate: "cl.mochila.mao_guardar_um" });
    for (let k = 0; k < inv.size; k++) {
      const it = inv.getItem(k);
      if (!it || k === j.selectedSlotIndex) continue;
      lista.push(k);
      g.button({ rawtext: [nomeDe(it.typeId), { text: ` §8x${it.amount}` }] }, iconeDe(it.typeId));
    }
    if (!lista.length) return aviso(j, "cl.mochila.mao_nada", 2);
    const r2 = await g.show(j);
    if (r2.canceled || r2.selection === undefined) return;
    const k = lista[r2.selection];
    const it = inv.getItem(k);
    const agora = inv.getItem(j.selectedSlotIndex);
    if (!it || agora?.typeId !== tipo) return;
    const s2 = slotsDaMochila(agora);
    const resto = enfiar(s2, it);
    if (resto === it.amount) return aviso(j, "cl.mochila.mao_cheia", 2);
    const copia = it.clone();
    if (resto) {
      it.amount = resto;
      inv.setItem(k, it);
    } else inv.setItem(k, undefined);
    if (!gravarNaMao(j, tipo, s2)) inv.setItem(k, copia);
    else (j.playSound("armor.equip_leather"), registrarAcao(j, "mochila_mao"));
    return;
  }
  if (r.selection === 2 || r.selection === 3) {
    let quais: number[] = slots.map((x, k) => (x ? k : -1)).filter((k) => k >= 0);
    if (!quais.length) return aviso(j, "cl.mochila.mao_vazia", 2);
    if (r.selection === 2) {
      const t = new ActionFormData().title({ translate: "cl.mochila.mao_tirar", with: [String(quais.length)] });
      for (const k of quais) t.button({ rawtext: [nomeDe(slots[k]!.t), { text: ` §8x${slots[k]!.n}` }] }, iconeDe(slots[k]!.t));
      const r2 = await t.show(j);
      if (r2.canceled || r2.selection === undefined) return;
      quais = [quais[r2.selection]];
    }
    const agora = inv.getItem(j.selectedSlotIndex);
    if (agora?.typeId !== tipo) return;
    const s2 = slotsDaMochila(agora);
    let n = 0;
    for (const k of quais) {
      const it = carregarItem(s2[k]);
      if (!it) {
        s2[k] = null;
        continue;
      }
      const sobra = inv.addItem(it);
      if (sobra && sobra.amount === it.amount) break; // mochila do jogador cheia
      s2[k] = sobra ? { ...s2[k]!, n: sobra.amount } : null;
      n++;
    }
    if (gravarNaMao(j, tipo, s2)) j.playSound("armor.equip_leather");
    if (!n) aviso(j, "cl.mochila.mao_jogador_cheio", 2);
  }
}

export function registrarMochila(): void {
  // No Catálogo: cada nível, com o material que se toca na mochila aberta no chão.
  registrarNoCatalogo(() =>
    Object.entries(NIVEIS)
      .filter(([, n]) => n.prox && n.material)
      .map(([de, n]) => ({
        maquina: { translate: "cl.mochila.cat" },
        entradas: [{ item: de, qtd: 1 }, { item: n.material!, qtd: n.qtd ?? 1 }],
        saidas: [{ item: n.prox!, qtd: 1 }],
        nota: { translate: "cl.mochila.cat_nota", with: [String(espacosDe(n.prox!)), String(NIVEIS[n.prox!]?.melhorias ?? 1)] },
      })),
  );
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (!ehMochila(itemStack.typeId) || mochilaUsadaEmBau(source)) return;
    // 1.31.0: usar abre o menu na mão; agachado, põe no chão (a tela completa).
    if (source.isSneaking) system.run(() => por(source));
    else abrirUmMenu(source, () => menuMochila(source));
  });
  // 1.25.0: agachado e tocando, troca de página; com o material na mão, sobe de nível (sem perder nada).
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId === ENTIDADE && tocar(ev.player, ev.target, ev.itemStack)) ev.cancel = true;
  });
  // Teste no servidor (o jogador simulado não responde menu): scriptevent cl:teste_mochila_mao guarda tudo na da mão.
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    const i = j instanceof Player ? j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex) : undefined;
    if (id === "cl:teste_mochila_mao" && j instanceof Player && i && ehMochila(i.typeId)) guardarTudo(j, i.typeId);
  });
  // Teste no servidor (o jogador simulado não dispara o toque): scriptevent cl:teste_mochila_tocar.
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    if (id !== "cl:teste_mochila_tocar" || !(j instanceof Player)) return;
    const m = j.dimension.getEntities({ type: ENTIDADE, location: j.location, maxDistance: 5, closest: 1 })[0];
    const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
    if (m) tocar(j, m, mao);
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (hitEntity.typeId !== ENTIDADE || !(damagingEntity instanceof Player) || !hitEntity.isValid) return;
    const j = damagingEntity;
    system.run(() => {
      if (hitEntity.isValid) guardar(j, hitEntity);
    });
  });
}

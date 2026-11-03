import { Entity, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
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
    if (ehMochila(itemStack.typeId) && !mochilaUsadaEmBau(source)) system.run(() => por(source));
  });
  // 1.25.0: agachado e tocando, troca de página; com o material na mão, sobe de nível (sem perder nada).
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId === ENTIDADE && tocar(ev.player, ev.target, ev.itemStack)) ev.cancel = true;
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

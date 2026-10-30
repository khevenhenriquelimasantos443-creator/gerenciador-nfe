import { Entity, EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { darAoJogador } from "../util/inventario.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";

/*
 * Mochila (1.10.0), a do mod Backpacks (Eydamos): 27 espaços. O Bedrock não abre a tela de um item, então a mochila
 * vira um baú no chão: usar o item a põe na frente do jogador (botão Abrir para mexer nela) e bater nela a guarda de
 * volta no item, com tudo dentro (quantidade, nome, desgaste, encantamentos e propriedades, como os corpos do Sync).
 * Mochila dentro de mochila vale.
 */
const ITEM = "cl:mochila";
const ENTIDADE = "cl:mochila";
const CONTEUDO = "cl:conteudo";
const ESPACOS = 27;

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
  if (!mao || item?.typeId !== ITEM) return;
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
  const c = m.getComponent("minecraft:inventory")?.container;
  conteudoDe(item).forEach((s, k) => {
    const i = carregarItem(s);
    if (i && c && k < ESPACOS) c.setItem(k, i);
  });
  if (item.nameTag) m.nameTag = item.nameTag;
  mao.setItem(undefined);
  j.playSound("armor.equip_leather");
  aviso(j, "cl.mochila.dica", 5);
}

function guardar(j: Player, m: Entity): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  const slots: (ItemSalvo | null)[] = [];
  let usados = 0;
  if (c) for (let k = 0; k < c.size; k++) {
    const s = salvarItem(c.getItem(k));
    slots.push(s);
    if (s) usados++;
  }
  const item = new ItemStack(ITEM, 1);
  if (m.nameTag) item.nameTag = m.nameTag;
  try {
    if (usados) item.setDynamicProperty(CONTEUDO, JSON.stringify(slots));
    item.setLore([`§7${usados}/${ESPACOS}`]);
  } catch {
    // Conteúdo grande demais para guardar no item: fica no chão, o que é mais seguro do que sumir.
    return;
  }
  c?.clearAll();
  m.remove();
  darAoJogador(j, item);
  j.playSound("armor.equip_leather");
}

export function registrarMochila(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === ITEM) system.run(() => por(source));
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (hitEntity.typeId !== ENTIDADE || !(damagingEntity instanceof Player) || !hitEntity.isValid) return;
    const j = damagingEntity;
    system.run(() => {
      if (hitEntity.isValid) guardar(j, hitEntity);
    });
  });
}

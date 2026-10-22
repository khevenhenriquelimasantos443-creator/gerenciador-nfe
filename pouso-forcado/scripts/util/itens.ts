import { EnchantmentTypes, EquipmentSlot, ItemStack, Player } from "@minecraft/server";

/*
 * Guardar um item (ou o inventário inteiro de um jogador) como JSON, com quantidade, nome, texto,
 * propriedades, desgaste e encantamentos. Usado pelos corpos do Sync (Fase 21).
 */
export type ItemSalvo = { t: string; n: number; nome?: string; lore?: string[]; dp?: Record<string, string | number | boolean>; dano?: number; enc?: [string, number][] };
export type InventarioSalvo = { slots: (ItemSalvo | null)[]; equip: Record<string, ItemSalvo | null> };
const EQUIP = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];

export function salvarItem(i: ItemStack | undefined): ItemSalvo | null {
  if (!i) return null;
  const s: ItemSalvo = { t: i.typeId, n: i.amount };
  if (i.nameTag) s.nome = i.nameTag;
  const lore = i.getLore().filter((l): l is string => typeof l === "string");
  if (lore.length) s.lore = lore;
  const ids = i.getDynamicPropertyIds();
  if (ids.length) {
    s.dp = {};
    for (const k of ids) {
      const v = i.getDynamicProperty(k);
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") s.dp[k] = v;
    }
  }
  const dur = i.getComponent("minecraft:durability");
  if (dur?.damage) s.dano = dur.damage;
  const enc = i.getComponent("minecraft:enchantable")?.getEnchantments();
  if (enc?.length) s.enc = enc.map((e) => [e.type.id, e.level]);
  return s;
}

export function carregarItem(s: ItemSalvo | null): ItemStack | undefined {
  if (!s) return undefined;
  try {
    const i = new ItemStack(s.t, s.n);
    if (s.nome) i.nameTag = s.nome;
    if (s.lore) i.setLore(s.lore);
    for (const [k, v] of Object.entries(s.dp ?? {})) i.setDynamicProperty(k, v);
    const dur = i.getComponent("minecraft:durability");
    if (dur && s.dano) dur.damage = s.dano;
    const enc = i.getComponent("minecraft:enchantable");
    if (enc && s.enc) for (const [id, nivel] of s.enc) {
      const tipo = EnchantmentTypes.get(id);
      if (tipo) enc.addEnchantment({ type: tipo, level: nivel });
    }
    return i;
  } catch {
    return undefined; // item que não existe mais
  }
}

/** Tira tudo do jogador (mochila e equipamento) e devolve como JSON. */
export function esvaziarJogador(j: Player): InventarioSalvo {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const eq = j.getComponent("minecraft:equippable");
  const salvo: InventarioSalvo = { slots: [], equip: {} };
  if (inv) for (let s = 0; s < inv.size; s++) {
    salvo.slots.push(salvarItem(inv.getItem(s)));
    inv.setItem(s, undefined);
  }
  if (eq) for (const slot of EQUIP) {
    salvo.equip[slot] = salvarItem(eq.getEquipment(slot));
    eq.setEquipment(slot, undefined);
  }
  return salvo;
}

/** Põe o inventário salvo no jogador (o que não couber cai no chão). */
export function vestirJogador(j: Player, salvo: InventarioSalvo): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const eq = j.getComponent("minecraft:equippable");
  const sobra: ItemStack[] = [];
  salvo.slots.forEach((s, k) => {
    const i = carregarItem(s);
    if (!i) return;
    if (inv && k < inv.size && !inv.getItem(k)) inv.setItem(k, i);
    else sobra.push(i);
  });
  for (const slot of EQUIP) {
    const i = carregarItem(salvo.equip[slot] ?? null);
    if (!i) continue;
    if (eq && !eq.getEquipment(slot)) eq.setEquipment(slot, i);
    else sobra.push(i);
  }
  for (const i of sobra) {
    const resto = inv?.addItem(i) ?? i;
    if (resto) j.dimension.spawnItem(resto, j.location);
  }
}

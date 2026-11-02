import { EquipmentSlot, Player, PlayerInventoryType, system, world } from "@minecraft/server";

/*
 * 1.16.4: o que cada jogador segura na mão e veste no peito, guardado por id. Vários laços que rodam a cada 1 ou
 * 2 ticks (asa-delta, jetpack, ferramentas do Minecraft) só precisam saber isso para decidir se têm trabalho; ler o
 * equipamento do jogo toda vez pesava no celular. Atualiza na troca de slot, quando o item da mão muda, quando o
 * jogador usa um item (vestir armadura) e, por garantia, a cada segundo.
 */
type Equip = { mao?: string; peito?: string };
const equip = new Map<string, Equip>();

function ler(j: Player): Equip {
  const eq = j.getComponent("minecraft:equippable");
  const e: Equip = { mao: eq?.getEquipment(EquipmentSlot.Mainhand)?.typeId, peito: eq?.getEquipment(EquipmentSlot.Chest)?.typeId };
  equip.set(j.id, e);
  return e;
}

/** O id do item na mão do jogador (do cache; no máximo 1 s atrasado se nenhum evento avisou). */
export const maoDe = (j: Player): string | undefined => (equip.get(j.id) ?? ler(j)).mao;
/** O id do que o jogador veste no peito. */
export const peitoDe = (j: Player): string | undefined => (equip.get(j.id) ?? ler(j)).peito;

export function registrarJogadores(): void {
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player, itemStack }) => {
    const e = equip.get(player.id);
    if (e) e.mao = itemStack?.typeId;
  });
  world.afterEvents.playerInventoryItemChange.subscribe(({ player, inventoryType, slot, itemStack }) => {
    if (inventoryType !== PlayerInventoryType.Hotbar || slot !== player.selectedSlotIndex) return;
    const e = equip.get(player.id);
    if (e) e.mao = itemStack?.typeId;
  });
  world.afterEvents.itemUse.subscribe(({ source }) => system.run(() => source.isValid && ler(source)));
  world.afterEvents.playerLeave.subscribe(({ playerId }) => equip.delete(playerId));
  system.runInterval(() => {
    for (const j of world.getPlayers()) ler(j);
  }, 20);
}

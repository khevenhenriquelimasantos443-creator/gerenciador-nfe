import { EquipmentSlot, ItemStack, Player, system, world } from "@minecraft/server";
import { PROPS } from "../config.js";

/*
 * Minimapa: o Bedrock não deixa um add-on desenhar na tela, mas um mapa do jogo na mão
 * secundária aparece pequeno no canto da tela, com o terreno já carregado e a sua posição.
 * - Ao entrar pela primeira vez, cada jogador ganha um Mapa Localizador Vazio.
 * - Ao usar o mapa vazio (toque e segure), o mapa pronto vai sozinho para a mão secundária.
 * - /cl:mapa dá outro (o mapa cobre uma área fixa; ao sair dela, pegue um novo).
 */
export function darMapa(jogador: Player): void {
  try {
    jogador.runCommand("give @s empty_map 1 2"); // dado 2 = mapa localizador (mostra você)
  } catch {
    jogador.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack("minecraft:empty_map", 1));
  }
  jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.mapa.recebido" }] });
}

export function entregarMapa(jogador: Player): void {
  if (jogador.getDynamicProperty(PROPS.mapaRecebido)) return;
  jogador.setDynamicProperty(PROPS.mapaRecebido, true);
  darMapa(jogador);
}

/** Depois de usar o mapa vazio, põe o mapa pronto na mão secundária (se ela estiver livre). */
function moverParaMaoSecundaria(jogador: Player): void {
  const roupa = jogador.getComponent("minecraft:equippable");
  const inv = jogador.getComponent("minecraft:inventory")?.container;
  if (!roupa || !inv || roupa.getEquipment(EquipmentSlot.Offhand)) return;
  for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p?.typeId !== "minecraft:filled_map") continue;
    roupa.setEquipment(EquipmentSlot.Offhand, p);
    inv.setItem(s, undefined);
    jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.mapa.na_mao" }] });
    return;
  }
}

export function registrarMapa(): void {
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId !== "minecraft:empty_map") return;
    system.runTimeout(() => {
      if (source.isValid) moverParaMaoSecundaria(source);
    }, 5);
  });
}

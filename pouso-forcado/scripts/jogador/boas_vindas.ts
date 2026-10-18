import { ItemStack, Player, system, world } from "@minecraft/server";
import { KIT_INICIAL, PROPS } from "../config.js";

function entregarKit(jogador: Player): void {
  const container = jogador.getComponent("minecraft:inventory")?.container;
  for (const { item, quantidade } of KIT_INICIAL) {
    const sobra = container?.addItem(new ItemStack(item, quantidade)) ?? new ItemStack(item, quantidade);
    // Inventário cheio: solta o resto no chão, aos pés do jogador.
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
}

function darBoasVindas(jogador: Player): void {
  if (!jogador.isValid || jogador.getDynamicProperty(PROPS.kitRecebido)) return;

  jogador.setDynamicProperty(PROPS.kitRecebido, true);
  entregarKit(jogador);
  jogador.onScreenDisplay.setTitle(
    { translate: "cl.boas_vindas.titulo" },
    { subtitle: { translate: "cl.boas_vindas.subtitulo" }, fadeInDuration: 10, stayDuration: 80, fadeOutDuration: 20 },
  );
  jogador.sendMessage({ translate: "cl.boas_vindas.mensagem" });
}

export function registrarBoasVindas(): void {
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    // Espera ~2 s para a tela de carregamento sumir antes do título.
    system.runTimeout(() => darBoasVindas(player), 40);
  });
}

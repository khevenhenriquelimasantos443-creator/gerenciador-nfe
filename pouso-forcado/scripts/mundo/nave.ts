import { Dimension, ItemStack, Player, Vector3, world } from "@minecraft/server";
import { NAVE, PROPS, SUPRIMENTOS } from "../config.js";

const somar = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

function encherBau(dimensao: Dimension, posicao: Vector3): void {
  const bloco = dimensao.getBlock(posicao);
  if (!bloco) throw new Error("bloco do baú fora do mundo");
  bloco.setType("minecraft:chest");
  const container = bloco.getComponent("minecraft:inventory")?.container;
  if (!container) throw new Error("baú sem inventário");
  for (const { item, quantidade } of SUPRIMENTOS) container.addItem(new ItemStack(item, quantidade));
}

function darSuprimentos(jogador: Player): void {
  const container = jogador.getComponent("minecraft:inventory")?.container;
  for (const { item, quantidade } of SUPRIMENTOS) {
    const sobra = container?.addItem(new ItemStack(item, quantidade)) ?? new ItemStack(item, quantidade);
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
}

/**
 * Coloca a nave caída ao lado do jogador, uma única vez por mundo.
 * Se não der (ex.: chunk ainda não carregado), entrega os suprimentos direto ao jogador.
 */
export function garantirNave(jogador: Player): void {
  if (world.getDynamicProperty(PROPS.naveColocada)) return;
  world.setDynamicProperty(PROPS.naveColocada, true);

  const base = { x: Math.floor(jogador.location.x), y: Math.floor(jogador.location.y), z: Math.floor(jogador.location.z) };
  const origem = somar(base, NAVE.deslocamento);
  try {
    world.structureManager.place(NAVE.estrutura, jogador.dimension, origem);
    encherBau(jogador.dimension, somar(origem, NAVE.bau));
  } catch (erro) {
    console.warn(`[Pouso Forçado] não foi possível colocar a nave: ${erro}`);
    darSuprimentos(jogador);
  }
}

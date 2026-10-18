import { ItemStack, Player, Vector3, world } from "@minecraft/server";
import { NAVE, PROPS, SUPRIMENTOS } from "../config.js";
import { criarBauCom } from "../util/inventario.js";

const somar = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

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
  // Guardado antes de tentar: o relevo só começa depois disto e evita a área da nave.
  world.setDynamicProperty(PROPS.naveChunk, `${Math.floor(origem.x / 16)},${Math.floor(origem.z / 16)}`);
  try {
    world.structureManager.place(NAVE.estrutura, jogador.dimension, origem);
    criarBauCom(jogador.dimension, somar(origem, NAVE.bau), SUPRIMENTOS);
  } catch (erro) {
    console.warn(`[Pouso Forçado] não foi possível colocar a nave: ${erro}`);
    darSuprimentos(jogador);
  }
}

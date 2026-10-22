import { BlockPermutation, Dimension, ItemStack, Player, Vector3, system, world } from "@minecraft/server";
import { IDS, NAVE, PROPS, SUPRIMENTOS } from "../config.js";
import { criarBauCom } from "../util/inventario.js";

const somar = (a: Vector3, b: Vector3): Vector3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

function darSuprimentos(jogador: Player): void {
  const container = jogador.getComponent("minecraft:inventory")?.container;
  for (const { item, quantidade } of SUPRIMENTOS) {
    const sobra = container?.addItem(new ItemStack(item, quantidade)) ?? new ItemStack(item, quantidade);
    if (sobra) jogador.dimension.spawnItem(sobra, jogador.location);
  }
}

/** Põe o Painel da Nave no painel de controle da cabine, com a tela virada para o piloto (oeste). */
function porPainel(dimensao: Dimension, posicao: Vector3): void {
  dimensao.getBlock(posicao)?.setPermutation(BlockPermutation.resolve(IDS.painelNave, { "minecraft:cardinal_direction": "west" }));
}

/**
 * Coloca o avião caído ao lado do jogador, uma única vez por mundo. O avião é grande (95 x 59 com o
 * rastro da queda), então a área é carregada antes ("tickingarea" temporária) e a montagem espera até
 * 30 s por ela. Se não der, os suprimentos vão direto para o jogador.
 */
export function garantirNave(jogador: Player): void {
  if (world.getDynamicProperty(PROPS.naveColocada)) return;
  world.setDynamicProperty(PROPS.naveColocada, true);

  const dimensao = jogador.dimension;
  const base = { x: Math.floor(jogador.location.x), y: Math.floor(jogador.location.y), z: Math.floor(jogador.location.z) };
  const origem = somar(base, NAVE.deslocamento);
  const fim = somar(origem, { x: NAVE.tamanho.x - 1, y: NAVE.tamanho.y - 1, z: NAVE.tamanho.z - 1 });
  const centro = somar(origem, { x: NAVE.centro.x, y: 0, z: NAVE.centro.z });
  // Guardado antes de tentar: o relevo só começa depois disto e evita a área do avião.
  world.setDynamicProperty(PROPS.naveChunk, `${Math.floor(centro.x / 16)},${Math.floor(centro.z / 16)}`);
  const area = "cl_aviao";
  try {
    dimensao.runCommand(`tickingarea add ${origem.x} ${origem.y} ${origem.z} ${fim.x} ${fim.y} ${fim.z} ${area} true`);
  } catch {
    // sem vaga para a área: tenta assim mesmo
  }
  const cantos = [origem, fim, { x: origem.x, y: origem.y, z: fim.z }, { x: fim.x, y: origem.y, z: origem.z }];
  const carregado = () =>
    cantos.every((p) => {
      try {
        return dimensao.getBlock(p) !== undefined;
      } catch {
        return false;
      }
    });
  let tentativas = 0;
  const id = system.runInterval(() => {
    const pronto = carregado();
    if (!pronto && ++tentativas < 30) return;
    system.clearRun(id);
    try {
      if (!pronto) throw new Error("a área do avião não carregou");
      for (let i = 0; i < NAVE.partes; i++) world.structureManager.place(`${NAVE.estrutura}_${i}`, dimensao, somar(origem, { x: i * NAVE.larguraParte, y: 0, z: 0 }));
      criarBauCom(dimensao, somar(origem, NAVE.bau), SUPRIMENTOS);
      porPainel(dimensao, somar(origem, NAVE.painel));
    } catch (erro) {
      console.warn(`[Pouso Forçado] não foi possível colocar a nave: ${erro}`);
      if (jogador.isValid) darSuprimentos(jogador);
    } finally {
      try {
        dimensao.runCommand(`tickingarea remove ${area}`);
      } catch {
        // já removida
      }
    }
  }, 20);
}

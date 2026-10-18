import { BlockVolume, Dimension } from "@minecraft/server";
import { IDS, MASMORRA, MASMORRA_FUNDA_SAQUE, MASMORRA_SAQUE } from "../config.js";
import { sortearSaque } from "../util/aleatorio.js";
import { criarBauCom } from "../util/inventario.js";
import { registrarPonto } from "./pontos.js";

/*
 * Masmorras: salas escondidas no subsolo, escuras, com um Gerador de Monstros no meio e baús.
 * - comuns (pedra, y 12 a 26): pedregulho e pedregulho com musgo; metade tem um poço aberto
 *   até a superfície, marcado por um anel de arenito entalhado (com feno no fundo, para a queda);
 * - fundas (ardósia, y -45 a -25): tijolos de ardósia, 2 geradores, saque bem melhor.
 * Geradas junto com o relevo do chunk (fora das cidades).
 */
function encher(dim: Dimension, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, bloco: string): void {
  dim.fillBlocks(new BlockVolume({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }), bloco);
}

export function talvezMasmorra(dim: Dimension, x0: number, z0: number, sorte: () => number): void {
  if (sorte() >= MASMORRA.chance) return;
  const funda = sorte() < MASMORRA.chanceFunda;
  const [yMin, yMax] = funda ? MASMORRA.yFunda : MASMORRA.yComum;
  const y = yMin + Math.floor(sorte() * (yMax - yMin + 1)); // piso da sala
  const x1 = x0 + 3, z1 = z0 + 3, x2 = x0 + 11, z2 = z0 + 11; // sala 9×9 (7×7 por dentro), 6 de altura

  encher(dim, x1, y - 1, z1, x2, y + 4, z2, funda ? "minecraft:deepslate_bricks" : "minecraft:cobblestone");
  encher(dim, x1 + 1, y, z1 + 1, x2 - 1, y + 3, z2 - 1, "minecraft:air");
  // Musgo / rachaduras espalhados nas paredes.
  for (let i = 0; i < 30; i++) {
    const x = x1 + Math.floor(sorte() * 9), z = z1 + Math.floor(sorte() * 9), yy = y - 1 + Math.floor(sorte() * 6);
    const b = dim.getBlock({ x, y: yy, z });
    if (b && !b.isAir) b.setType(funda ? "minecraft:cracked_deepslate_bricks" : "minecraft:mossy_cobblestone");
  }
  const meio = { x: x0 + 7, z: z0 + 7 };
  dim.getBlock({ x: meio.x, y, z: meio.z })?.setType(IDS.geradorMonstros);
  if (funda) dim.getBlock({ x: meio.x + 2, y, z: meio.z + 2 })?.setType(IDS.geradorMonstros);
  const tabela = funda ? MASMORRA_FUNDA_SAQUE : MASMORRA_SAQUE;
  criarBauCom(dim, { x: x1 + 1, y, z: z2 - 1 }, sortearSaque(tabela, sorte));
  if (funda || sorte() < 0.5) criarBauCom(dim, { x: x2 - 1, y, z: z1 + 1 }, sortearSaque(tabela, sorte));

  if (!funda && sorte() < MASMORRA.chancePoco) {
    const px = x1 + 1, pz = z1 + 1; // canto da sala
    const topo = dim.getTopmostBlock({ x: px, z: pz })?.y ?? y + 30;
    encher(dim, px, y + 4, pz, px + 1, topo, pz + 1, "minecraft:air");
    encher(dim, px, y, pz, px + 1, y, pz + 1, "minecraft:hay_block");
    // Anel de arenito entalhado em volta da boca do poço.
    for (let dx = -1; dx <= 2; dx++) {
      for (const dz of [-1, 2]) dim.getBlock({ x: px + dx, y: topo, z: pz + dz })?.setType("minecraft:chiseled_sandstone");
    }
    for (const dx of [-1, 2]) for (let dz = 0; dz <= 1; dz++) dim.getBlock({ x: px + dx, y: topo, z: pz + dz })?.setType("minecraft:chiseled_sandstone");
  }
  registrarPonto(funda ? "masmorra_funda" : "masmorra", meio.x, y + 1, meio.z, 6);
}

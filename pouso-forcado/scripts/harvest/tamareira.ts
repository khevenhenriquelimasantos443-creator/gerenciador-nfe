import { Block, BlockCustomComponent, BlockPermutation, ItemStack } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";

/*
 * Tamareira (HarvestCraft, 1.2.0). A muda (peneira de areia, 1/64) cresce sozinha: a cada 1–2 min,
 * 1 chance em 8 (as plantas do HO crescem devagar), com céu aberto e 8 blocos livres em cima. Vira um
 * coqueiro de 6 de tronco, com folhas em cruz e 2 cachos de tâmara pendurados. O cacho amadurece em
 * 2 etapas (2–3 min cada); tocado maduro, dá 2–4 tâmaras (e às vezes uma muda) e volta a verde.
 */
const CHANCE_CRESCER = 1 / 8;
const CHAO = new Set(["minecraft:sand", "minecraft:red_sand", "minecraft:dirt", "minecraft:grass_block", "minecraft:coarse_dirt", "minecraft:farmland"]);

function folha(): BlockPermutation {
  try {
    return BlockPermutation.resolve("minecraft:jungle_leaves", { persistent_bit: true } as never);
  } catch {
    return BlockPermutation.resolve("minecraft:jungle_leaves");
  }
}

function crescer(b: Block): void {
  const dim = b.dimension, { x, y, z } = b;
  if (!CHAO.has(b.below()?.typeId ?? "")) return;
  const topo = dim.getTopmostBlock({ x, z });
  if (topo && topo.y > y) return; // sem céu
  for (let k = 1; k <= 8; k++) if (!dim.getBlock({ x, y: y + k, z })?.isAir) return;
  for (let k = 0; k <= 5; k++) dim.getBlock({ x, y: y + k, z })?.setType("minecraft:jungle_log");
  const f = folha();
  const por = (dx: number, dy: number, dz: number, p: BlockPermutation) => {
    const alvo = dim.getBlock({ x: x + dx, y: y + dy, z: z + dz });
    if (alvo?.isAir) alvo.setPermutation(p);
  };
  por(0, 6, 0, f);
  por(0, 7, 0, f);
  for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    por(dx, 6, dz, f);
    por(dx * 2, 6, dz * 2, f);
    por(dx * 3, 5, dz * 3, f);
  }
  for (const [dx, dz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) por(dx, 6, dz, f);
  // Dois cachos embaixo das folhas, encostados no tronco.
  const lados = [[1, 0], [-1, 0], [0, 1], [0, -1]].sort(() => Math.random() - 0.5).slice(0, 2);
  for (const [dx, dz] of lados) por(dx, 5, dz, BlockPermutation.resolve("cl:cacho_tamaras"));
  dim.playSound("block.bamboo.place", b.center());
}

export const mudaTamareira: BlockCustomComponent = {
  onTick(e) {
    if (Math.random() < CHANCE_CRESCER) crescer(e.block);
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, "cl.hc.muda", 5);
  },
};

export const cachoTamaras: BlockCustomComponent = {
  onTick(e) {
    const m = lerEstado<number>(e.block, "cl:maduro");
    if (m < 2) definirEstado(e.block, "cl:maduro", m + 1);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const m = lerEstado<number>(e.block, "cl:maduro");
    if (m < 2) return aviso(j, { translate: "cl.hc.cacho", with: { rawtext: [{ translate: `cl.hc.cacho.${m}` }] } });
    const n = 2 + Math.floor(Math.random() * 3);
    darAoJogador(j, new ItemStack("cl:tamara", n));
    if (Math.random() < 0.15) darAoJogador(j, "cl:muda_tamareira", 1);
    definirEstado(e.block, "cl:maduro", 0);
    j.playSound("block.sweet_berry_bush.pick");
    for (let k = 0; k < n; k++) registrarAcao(j, "tamara");
  },
};

export function registrarTamareira(): void {
  registrarDetalhe("cl:cacho_tamaras", (b) => ({ translate: `cl.hc.cacho.${lerEstado<number>(b, "cl:maduro")}` }));
}

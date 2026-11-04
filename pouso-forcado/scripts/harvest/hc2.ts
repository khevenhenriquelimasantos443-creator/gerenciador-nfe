import { Block, BlockCustomComponent, BlockPermutation, Dimension, GameMode, ItemStack, system, Vector3, world } from "@minecraft/server";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { ARVORES_HC, FRUTOS_HC, HORTAS_HC } from "./gerado.js";

/*
 * Pam's HarvestCraft 2 (1.47.0; Crops e Trees, 1.21.1):
 * - Hortas silvestres (6, uma por tipo de bioma): quebrar dá uma colheita sorteada da lista da horta (loot). Farinha de
 *   osso: 80% de chance de espalhar, se houver menos de 10 hortas iguais num 9×3×9, andando 4 passos ao acaso (como o
 *   GardenBlock do HC2).
 * - Mudas: com luz ≥ 9, viram árvore como as do jogo (2 estágios de 1/7 por tique aleatório: aqui 1/21 a cada 30–60 s).
 *   Tronco reto de base + 0..a + 0..b (os números de cada árvore do HC2), copa redonda e frutos embaixo das folhas.
 * - Frutos: flor → verde → maduro. O HC2 sobe 1 de 7 idades com 1/6 por tique aleatório (~48 min ao todo); aqui 1/32 a
 *   cada 30–60 s em cada um dos 2 passos. Tocar no maduro colhe 1 e volta à flor; quebrar maduro também dá o fruto.
 * Custo: só blocos plantados (o fruto maduro só confere o estágio e sai).
 */
const HORTAS: ReadonlySet<string> = new Set(HORTAS_HC);
const CHAO_HORTA = new Set(["minecraft:grass_block", "minecraft:dirt", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:sand", "minecraft:red_sand",
  "minecraft:farmland", "minecraft:mud", "minecraft:moss_block"]);
const MADURO = 2;
const sorte = (n: number) => Math.floor(Math.random() * n);

function cabeHorta(dim: Dimension, p: Vector3): boolean {
  try {
    return !!dim.getBlock(p)?.isAir && CHAO_HORTA.has(dim.getBlock({ x: p.x, y: p.y - 1, z: p.z })?.typeId ?? "");
  } catch {
    return false;
  }
}

/** Farinha de osso na horta (performBonemeal do GardenBlock do HC2). */
function espalharHorta(b: Block): void {
  const dim = b.dimension;
  let n = 10;
  for (let dx = -4; dx <= 4; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -4; dz <= 4; dz++) {
    if (dim.getBlock({ x: b.x + dx, y: b.y + dy, z: b.z + dz })?.typeId === b.typeId && --n <= 0) return;
  }
  const passo = (p: Vector3): Vector3 => ({ x: p.x + sorte(3) - 1, y: p.y + sorte(2) - sorte(2), z: p.z + sorte(3) - 1 });
  let base: Vector3 = { x: b.x, y: b.y, z: b.z };
  let alvo = passo(base);
  for (let k = 0; k < 4; k++) {
    if (cabeHorta(dim, alvo)) base = alvo;
    alvo = passo(base);
  }
  if (cabeHorta(dim, alvo)) dim.getBlock(alvo)?.setType(b.typeId);
}

export const hortaHc: BlockCustomComponent = {
  onPlayerInteract({ block, player }) {
    if (!player || itemNaMao(player)?.typeId !== "minecraft:bone_meal") return;
    gastarDaMao(player);
    block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
    if (Math.random() < 0.8) espalharHorta(block);
  },
};

function folhaDe(id: string): BlockPermutation {
  try {
    return BlockPermutation.resolve(id, { persistent_bit: true } as never);
  } catch {
    return BlockPermutation.resolve(id);
  }
}

/** A muda vira árvore (se houver espaço). Retorna se cresceu. */
export function crescerArvoreHc(b: Block): boolean {
  const def = ARVORES_HC[b.typeId];
  if (!def) return false;
  const [base, a, c] = def.altura;
  const altura = base + sorte(a + 1) + sorte(c + 1);
  const dim = b.dimension;
  for (let k = 1; k <= altura + 1; k++) if (!b.offset({ x: 0, y: k, z: 0 })?.isAir) return false;
  for (let k = 0; k < altura; k++) dim.getBlock({ x: b.x, y: b.y + k, z: b.z })?.setType(def.tronco);
  const topo = b.y + altura, folha = folhaDe(def.folha), fruto = BlockPermutation.resolve(def.fruto);
  for (const [dy, r] of [[-2, 2], [-1, 2], [0, 1], [1, 1]] as const) {
    for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
      if (Math.abs(dx) === r && Math.abs(dz) === r && (r === 1 || Math.random() < 0.5)) continue;
      const f = dim.getBlock({ x: b.x + dx, y: topo + dy, z: b.z + dz });
      if (!f?.isAir) continue;
      f.setPermutation(folha);
      // Frutos pendurados embaixo da camada de baixo da copa (longe do tronco).
      if (dy === -2 && (dx || dz) && Math.random() < 0.3) {
        const baixo = f.below();
        if (baixo?.isAir) baixo.setPermutation(fruto);
      }
    }
  }
  dim.playSound("block.bamboo.place", b.center());
  return true;
}

export const mudaHc: BlockCustomComponent = {
  onTick({ block }) {
    if (Math.random() >= 1 / 21) return;
    try {
      if (block.dimension.getLightLevel(block.above()?.location ?? block.location) < 9) return;
    } catch {
      /* sem luz conhecida: cresce */
    }
    if (crescerArvoreHc(block)) {
      const j = block.dimension.getPlayers({ location: block.center(), maxDistance: 24, closest: 1 })[0];
      if (j) registrarAcao(j, "hc2_arvore");
    }
  },
  onPlayerInteract({ block, player }) {
    // Farinha de osso: 45% de crescer na hora (como as mudas do jogo).
    if (!player || itemNaMao(player)?.typeId !== "minecraft:bone_meal") return;
    gastarDaMao(player);
    block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
    if (Math.random() < 0.45 && crescerArvoreHc(block)) registrarAcao(player, "hc2_arvore");
  },
};

export const frutoHc: BlockCustomComponent = {
  onTick({ block }) {
    const k = lerEstado<number>(block, "cl:estagio");
    if (k < MADURO && Math.random() < 1 / 32) definirEstado(block, "cl:estagio", k + 1);
  },
  onPlayerInteract({ block, player }) {
    if (!player) return;
    const k = lerEstado<number>(block, "cl:estagio");
    const produto = FRUTOS_HC[block.typeId];
    if (k < MADURO) {
      // Farinha de osso: sobe 1 estágio.
      if (itemNaMao(player)?.typeId !== "minecraft:bone_meal") return;
      gastarDaMao(player);
      block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
      definirEstado(block, "cl:estagio", k + 1);
      return;
    }
    if (!produto) return;
    darAoJogador(player, produto, 1);
    definirEstado(block, "cl:estagio", 0);
    player.playSound("block.sweet_berry_bush.pick");
    registrarAcao(player, "hc2_fruta");
  },
};

export function registrarHc2(): void {
  // Teste no servidor: scriptevent cl:teste_hc2 crescer <x y z> (a muda vira árvore na hora).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message }) => {
    if (id !== "cl:teste_hc2") return;
    const [acao, x, y, z] = message.split(" ");
    const b = world.getDimension("overworld").getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (acao === "crescer" && b) console.warn(`[teste_hc2] crescer ${b.typeId} ${crescerArvoreHc(b)}`);
  });
  registrarDetalhe(Object.keys(FRUTOS_HC), (b) => ({ translate: `cl.hc2.fruto.${lerEstado<number>(b, "cl:estagio")}` }));
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (HORTAS.has(id)) {
      registrarAcao(player, "hc2_horta");
      return;
    }
    const produto = FRUTOS_HC[id];
    if (!produto || player.getGameMode() === GameMode.Creative) return;
    if ((brokenBlockPermutation.getState("cl:estagio" as never) as unknown as number) !== MADURO) return;
    block.dimension.spawnItem(new ItemStack(produto, 1), block.center());
    registrarAcao(player, "hc2_fruta");
  });
}

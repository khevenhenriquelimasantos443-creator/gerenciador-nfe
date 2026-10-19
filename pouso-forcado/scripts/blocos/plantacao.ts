import { Block, BlockCustomComponent, Difficulty, GameMode, ItemStack, world } from "@minecraft/server";
import { BIOMAS_DESERTO, PLANTACAO } from "../config.js";
import { CULTURAS } from "../harvest/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";

/*
 * Plantações do Pam's HarvestCraft com a regra do Hunger Overhaul (Fase 14).
 * Estado cl:estagio: 0 broto, 1 crescendo, 2 madura.
 * - minecraft:tick (30 a 60 s): sobe 1 estágio com chance PLANTACAO.chance × HO × bioma × água;
 *   precisa de luz ≥ PLANTACAO.luzMin em cima;
 * - tocar na madura colhe (PLANTACAO.colheita) e volta ao broto (colheita com a mão do HarvestCraft);
 * - farinha de osso: chance PLANTACAO.farinhaOsso de subir 1 estágio; no Difícil não funciona (HO);
 * - quebrar: sempre 1 semente (loot); madura também solta a colheita.
 * Custo: 1 leitura de bioma, luz e bloco de baixo por planta a cada 30–60 s.
 */
const POR_PLANTA = new Map(CULTURAS.map((c) => [c.planta, c]));
const MADURA = 2;

const desertoIds: ReadonlySet<string> = new Set([...BIOMAS_DESERTO, "minecraft:desert"]);

function noDeserto(bloco: Block): boolean {
  try {
    return desertoIds.has(bloco.dimension.getBiome(bloco.location).id);
  } catch {
    return true; // o mundo é quase todo deserto
  }
}

function chanceDeCrescer(bloco: Block, deserto: boolean): number {
  let chance = PLANTACAO.chance * PLANTACAO.hungerOverhaul;
  if (noDeserto(bloco) !== deserto) chance *= PLANTACAO.biomaErrado;
  const terra = bloco.below();
  if (terra?.typeId === "minecraft:farmland" && ((terra.permutation.getState("moisturized_amount") as number | undefined) ?? 0) === 0) {
    chance *= PLANTACAO.terraSeca;
  }
  return chance;
}

function temLuz(bloco: Block): boolean {
  try {
    return bloco.dimension.getLightLevel(bloco.location) >= PLANTACAO.luzMin;
  } catch {
    return true;
  }
}

const sortear = (): number => PLANTACAO.colheita[0] + Math.floor(Math.random() * (PLANTACAO.colheita[1] - PLANTACAO.colheita[0] + 1));

function soltarColheita(bloco: Block, produto: string): void {
  bloco.dimension.spawnItem(new ItemStack(produto, sortear()), bloco.center());
}

/** Estufa: faz a plantação subir 1 estágio. Retorna se era uma plantação do HarvestCraft. */
export function crescerPlantacao(bloco: Block, chance: number): boolean {
  if (!POR_PLANTA.has(bloco.typeId)) return false;
  const k = lerEstado<number>(bloco, "cl:estagio");
  if (k < MADURA && Math.random() < chance) definirEstado(bloco, "cl:estagio", k + 1);
  return true;
}

export const planta: BlockCustomComponent = {
  onTick(e) {
    const c = POR_PLANTA.get(e.block.typeId);
    if (!c) return;
    const k = lerEstado<number>(e.block, "cl:estagio");
    if (k >= MADURA || !temLuz(e.block)) return;
    if (Math.random() < chanceDeCrescer(e.block, c.deserto)) definirEstado(e.block, "cl:estagio", k + 1);
  },
  onPlayerInteract(e) {
    const jogador = e.player;
    const c = POR_PLANTA.get(e.block.typeId);
    if (!jogador || !c) return;
    const k = lerEstado<number>(e.block, "cl:estagio");
    if (k >= MADURA) {
      soltarColheita(e.block, c.produto);
      definirEstado(e.block, "cl:estagio", 0);
      e.dimension.playSound("dig.grass", e.block.center());
      registrarAcao(jogador, "colher");
      return;
    }
    if (itemNaMao(jogador)?.typeId !== "minecraft:bone_meal") return;
    gastarDaMao(jogador);
    e.dimension.spawnParticle("minecraft:crop_growth_emitter", e.block.center());
    if (world.getDifficulty() === Difficulty.Hard) return;
    if (Math.random() < PLANTACAO.farinhaOsso) definirEstado(e.block, "cl:estagio", k + 1);
  },
};

export function registrarPlantacao(): void {
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    const c = POR_PLANTA.get(brokenBlockPermutation.type.id);
    if (!c || player.getGameMode() === GameMode.Creative) return;
    if ((brokenBlockPermutation.getState("cl:estagio" as never) as unknown as number) !== MADURA) return;
    soltarColheita(block, c.produto);
    registrarAcao(player, "colher");
  });
}

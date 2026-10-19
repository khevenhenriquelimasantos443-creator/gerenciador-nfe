import { BlockCustomComponent, BlockPermutation, GameMode, ItemStack, system, world } from "@minecraft/server";
import { FOLHAS, IDS, MARTELO, MARTELOS, SEDA } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, gastarFerramenta } from "../util/inventario.js";
import { esquecerBarril } from "./barril.js";
import { esquecerCadinho } from "./cadinho.js";

/*
 * Ferramentas do Ex Nihilo e a seda.
 * - Martelo: quebrar pedregulho, cascalho, areia, arenito ou pedra com ele dá o próximo da cadeia
 *   (MARTELO em config.ts: pedra -> pedrinhas, pedregulho -> cascalho -> areia -> poeira).
 * - Cajado: quebrar folhas com ele solta bicho-da-seda (1/100; folha infestada: 1/15).
 * - Bicho-da-seda: use numa folha para infestar. A folha infestada (minecraft:tick 20) chega a 100%
 *   em ~2.000 ticks e, passando de 60%, espalha para uma folha vizinha a cada ~100 ticks.
 *   Quebrada, dá linha (chance = infestação × 0,4, mais uma com × 0,1).
 */

const solta = (dim: import("@minecraft/server").Dimension, loc: import("@minecraft/server").Vector3, item: string, qtd = 1) =>
  dim.spawnItem(new ItemStack(item, qtd), { x: loc.x + 0.5, y: loc.y + 0.4, z: loc.z + 0.5 });

export const folhaInfestada: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const n = lerEstado<number>(b, "cl:infest");
    // +10% a cada ~200 ticks (1 chance em 10 por tick de 20), como os 2.000 ticks do Ex Nihilo.
    if (n < 10 && Math.random() < 0.1) definirEstado(b, "cl:infest", n + 1);
    if (n < SEDA.espalhaAPartir || Math.random() >= 0.2) return; // ~1 tentativa a cada 100 ticks
    const alvo = e.dimension.getBlock({ x: b.x + Math.floor(Math.random() * 3) - 1, y: b.y + Math.floor(Math.random() * 3) - 1, z: b.z + Math.floor(Math.random() * 3) - 1 });
    if (alvo && FOLHAS.includes(alvo.typeId)) alvo.setPermutation(BlockPermutation.resolve(IDS.folhaInfestada));
  },
};

export function registrarNihilo(): void {
  world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const ferramenta = ev.itemStack?.typeId;
    if (!ferramenta || MARTELOS[ferramenta] === undefined) return;
    const tabela = MARTELO[ev.block.typeId];
    if (!tabela) return;
    ev.cancel = true; // o martelo troca o drop: quebra aqui mesmo e solta o próximo da cadeia
    const { player, dimension } = ev;
    const loc = { ...ev.block.location };
    const tipo = ev.block.typeId;
    system.run(() => {
      const b = dimension.getBlock(loc);
      if (!b || b.typeId !== tipo) return;
      b.setType("minecraft:air");
      dimension.playSound("dig.stone", { x: loc.x + 0.5, y: loc.y + 0.5, z: loc.z + 0.5 });
      if (player.getGameMode() !== GameMode.Creative) {
        for (const { item, chance } of tabela) if (Math.random() < chance) solta(dimension, loc, item);
      }
      gastarFerramenta(player);
      registrarAcao(player, "martelar");
    });
  });

  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation, itemStackBeforeBreak }) => {
    const tipo = brokenBlockPermutation.type.id;
    if (tipo === IDS.barrilMadeira || tipo === IDS.barrilPedra) return esquecerBarril(block);
    if (tipo === IDS.cadinho) return esquecerCadinho(block);
    const cajado = itemStackBeforeBreak?.typeId === IDS.cajado;
    const loc = block.location;
    if (tipo === IDS.folhaInfestada) {
      const p = (brokenBlockPermutation.getState("cl:infest" as never) as unknown as number) / 10;
      if (Math.random() < p * SEDA.linha1) solta(block.dimension, loc, "minecraft:string");
      if (Math.random() < p * SEDA.linha2) solta(block.dimension, loc, "minecraft:string");
      if (cajado && Math.random() < SEDA.chanceInfestada) solta(block.dimension, loc, IDS.bichoSeda);
    } else if (cajado && FOLHAS.includes(tipo)) {
      if (Math.random() < SEDA.chanceFolha) solta(block.dimension, loc, IDS.bichoSeda);
    } else return;
    if (cajado) gastarFerramenta(player);
  });

  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== IDS.bichoSeda || !FOLHAS.includes(ev.block.typeId)) return;
    ev.cancel = true;
    if (!ev.isFirstEvent) return;
    const { player, block } = ev;
    system.run(() => {
      if (!FOLHAS.includes(block.typeId)) return;
      block.setPermutation(BlockPermutation.resolve(IDS.folhaInfestada));
      gastarDaMao(player);
      block.dimension.playSound("mob.silverfish.step", block.center());
    });
  });
}

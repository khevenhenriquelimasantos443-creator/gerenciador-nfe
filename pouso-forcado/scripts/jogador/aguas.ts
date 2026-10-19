import { ItemStack, Player, world } from "@minecraft/server";
import { AGUA_DOS_MONSTROS, AGUAS, IDS, POCA, SEDE } from "../config.js";
import { aviso } from "./hud.js";
import { desidratar, lerSede, mudarSede } from "./sede.js";
import { mudarTemperatura } from "./temperatura.js";
import { intervalo } from "../util/perfil.js";

/*
 * Águas e jeitos de beber.
 * Qualidades (AGUAS em config.ts, números do EnviroMine): excelente (fria) > boa (limpa) > suja >
 * muito suja; a imprópria é SALGADA: dá um pouco de água e depois desidrata (piora a sede).
 * Jeitos de beber:
 * - direto do condensador, com a mão vazia (boa; o avançado dá excelente);
 * - tigela (3 tábuas) ou garrafa de vidro no condensador: leva a água junto;
 * - agachado dentro da água (poça feita com balde): goles de água salgada (no Crash Landing toda fonte
 *   de água é salgada), que desidratam;
 * - tigela + cacto na mesa: água suja de cacto (sem precisar de máquina).
 * Melhorar a água: ferver na fornalha ou fogueira (imprópria → muito suja → suja → boa) e
 * filtrar na mesa (água boa + carvão vegetal → excelente).
 * Custo: um evento ao terminar de beber; a cada 2 s, olha quem está agachado na água.
 */

// Que água cada condensador dá.
export const aguaDoCondensador = { comum: IDS.aguaBoa, avancado: IDS.aguaExcelente } as const;

/** Aplica os pontos e efeitos de uma água (ao beber pela tigela, garrafa ou direto). */
export function aplicarAgua(jogador: Player, id: string, direto = false, q = AGUAS[id]): void {
  if (!q) return;
  mudarSede(jogador, direto ? q.direto : q.agua);
  if (q.esfria) mudarTemperatura(jogador, -q.esfria, q.piso);
  for (const e of q.efeitos) {
    if (Math.random() < e.chance) jogador.addEffect(e.id, e.segundos * 20, { amplifier: e.nivel ?? 0 });
  }
  if (q.desidrata) {
    desidratar(jogador, q.desidrata);
    aviso(jogador, "cl.agua.salgada");
  } else if (id === IDS.aguaSuja || id === IDS.aguaMuitoSuja) aviso(jogador, "cl.agua.gosto_ruim");
}

/** Beber direto (sem recipiente). Retorna false se o jogador não estava com sede. */
export function beberDireto(jogador: Player, id: string): boolean {
  if (lerSede(jogador) >= SEDE.max) {
    aviso(jogador, "cl.agua.sem_sede");
    return false;
  }
  aplicarAgua(jogador, id, true);
  jogador.playSound("random.drink");
  return true;
}

export function registrarAguas(): void {
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source }) => aplicarAgua(source, itemStack.typeId));

  // Goles da poça: agachado com os pés na água.
  intervalo("águas", () => {
    for (const jogador of world.getPlayers()) {
      if (!jogador.isSneaking || !jogador.isInWater || lerSede(jogador) >= SEDE.max) continue;
      aplicarAgua(jogador, "poça", true, POCA);
      jogador.playSound("random.drink");
    }
  }, 40);

  world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    const tipo = deadEntity.typeId;
    if (tipo !== "minecraft:husk" && tipo !== "minecraft:zombie") return;
    try {
      const { dimension, location } = deadEntity;
      for (const { item, chance } of AGUA_DOS_MONSTROS) {
        if (Math.random() < chance) dimension.spawnItem(new ItemStack(item, 1), location);
      }
    } catch {
      // entidade já saiu do mundo
    }
  });
}

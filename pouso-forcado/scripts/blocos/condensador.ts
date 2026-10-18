import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent, Player } from "@minecraft/server";
import { IDS } from "../config.js";
import { definirEstado, lerEstado, vizinhos } from "../util/blocos.js";
import { encherUmBalde } from "../util/inventario.js";

/*
 * Condensador de Água
 * - A cada ciclo (minecraft:tick no JSON, 30 s) produz 1 balde de água.
 * - Se houver baú/barril/funil adjacente com balde vazio, entrega lá automaticamente.
 * - Senão, guarda (máx. 1, estado cl:cheio) até o jogador interagir com um balde vazio no inventário.
 * O tick só roda em chunks carregados, então o custo é 1 checagem a cada 30 s por condensador.
 */
const CHEIO = "cl:cheio";

function entregarEmBauAdjacente(e: BlockComponentTickEvent): boolean {
  for (const vizinho of vizinhos(e.block)) {
    const container = vizinho.getComponent("minecraft:inventory")?.container;
    if (encherUmBalde(container)) return true;
  }
  return false;
}

function avisar(jogador: Player, chave: string): void {
  jogador.onScreenDisplay.setActionBar({ translate: chave });
}

export const condensadorAgua: BlockCustomComponent = {
  onTick(e) {
    if (entregarEmBauAdjacente(e)) return;
    if (!lerEstado<boolean>(e.block, CHEIO)) {
      definirEstado(e.block, CHEIO, true);
    }
  },

  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;

    if (!lerEstado<boolean>(e.block, CHEIO)) {
      avisar(jogador, "cl.condensador.condensando");
      return;
    }

    const container = jogador.getComponent("minecraft:inventory")?.container;
    if (!encherUmBalde(container, jogador.selectedSlotIndex)) {
      avisar(jogador, "cl.condensador.sem_balde");
      return;
    }

    definirEstado(e.block, CHEIO, false);
    e.dimension.playSound("bucket.fill_water", e.block.center());
    avisar(jogador, "cl.condensador.coletado");
  },
};

export const ID_COMPONENTE_CONDENSADOR = IDS.condensadorAgua;

import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent, Player } from "@minecraft/server";
import { CONDENSADOR_AVANCADO, IDS } from "../config.js";
import { definirEstado, lerEstado, vizinhos } from "../util/blocos.js";
import { encherGarrafasDaMao, encherUmBalde } from "../util/inventario.js";

/*
 * Condensador de Água
 * - A cada ciclo (minecraft:tick no JSON, 30 s) produz 1 balde de água.
 * - Se houver baú/barril/funil adjacente com balde vazio, entrega lá automaticamente.
 * - Senão, guarda (máx. 1, estado cl:cheio) até o jogador interagir com um balde vazio no inventário.
 * - Com garrafas de vidro na mão, a mesma água enche até 3 garrafas (para beber: Fase 4, sede).
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

/** Garrafas na mão: enche até 3. Senão, enche um balde vazio do inventário. Avisa se não tiver nenhum. */
function retirarAgua(jogador: Player): boolean {
  if (encherGarrafasDaMao(jogador)) return true;
  const container = jogador.getComponent("minecraft:inventory")?.container;
  if (encherUmBalde(container, jogador.selectedSlotIndex)) return true;
  avisar(jogador, "cl.condensador.sem_balde");
  return false;
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

    if (!retirarAgua(jogador)) return;
    definirEstado(e.block, CHEIO, false);
    e.dimension.playSound("bucket.fill_water", e.block.center());
    avisar(jogador, "cl.condensador.coletado");
  },
};


/*
 * Condensador Avançado: mesmo funcionamento, mas 1 balde a cada 10 s (minecraft:tick no JSON)
 * e guarda até CONDENSADOR_AVANCADO.capacidade baldes no estado cl:nivel.
 */
const NIVEL = "cl:nivel";

export const condensadorAvancado: BlockCustomComponent = {
  onTick(e) {
    if (entregarEmBauAdjacente(e)) return;
    const nivel = lerEstado<number>(e.block, NIVEL);
    if (nivel < CONDENSADOR_AVANCADO.capacidade) definirEstado(e.block, NIVEL, nivel + 1);
  },

  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const nivel = lerEstado<number>(e.block, NIVEL);
    if (nivel <= 0) {
      avisar(jogador, "cl.condensador.condensando");
      return;
    }
    if (!retirarAgua(jogador)) return;
    definirEstado(e.block, NIVEL, nivel - 1);
    e.dimension.playSound("bucket.fill_water", e.block.center());
    avisar(jogador, "cl.condensador.coletado");
  },
};

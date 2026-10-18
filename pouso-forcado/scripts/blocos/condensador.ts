import { BlockComponentPlayerInteractEvent, BlockComponentTickEvent, BlockCustomComponent, Player } from "@minecraft/server";
import { CONDENSADOR_AVANCADO } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { definirEstado, lerEstado, vizinhos } from "../util/blocos.js";
import { aguaDoCondensador, beberDireto } from "../jogador/aguas.js";
import { consumir } from "../util/rede.js";
import { creditar } from "./energia.js";
import { encherUmBalde, itemNaMao, trocarDaMao } from "../util/inventario.js";

/*
 * Condensador de Água
 * - A cada ciclo (minecraft:tick no JSON, 30 s) produz 1 balde de água.
 * - Se houver baú/barril/funil adjacente com balde vazio, entrega lá automaticamente.
 * - Senão, guarda (máx. 1, estado cl:cheio) até o jogador interagir com um balde vazio no inventário.
 * - Para beber (sede): mão vazia bebe direto; tigelas ou garrafas na mão levam até 3 doses.
 *   O condensador dá água boa; o avançado, excelente (aguas.ts).
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
  aviso(jogador, chave);
}

/**
 * Tira a água guardada: mão vazia bebe direto; tigelas/garrafas na mão enchem até 3;
 * senão enche um balde vazio do inventário. Avisa se não der.
 */
function retirarAgua(jogador: Player, qualidade: string): boolean {
  if (!itemNaMao(jogador)) return beberDireto(jogador, qualidade);
  if (trocarDaMao(jogador, "minecraft:bowl", qualidade)) return true;
  if (trocarDaMao(jogador, "minecraft:glass_bottle", "minecraft:potion")) return true;
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

    if (!retirarAgua(jogador, aguaDoCondensador.comum)) return;
    definirEstado(e.block, CHEIO, false);
    e.dimension.playSound("bucket.fill_water", e.block.center());
    avisar(jogador, "cl.condensador.coletado");
  },
};


/*
 * Condensador Avançado: mesmo funcionamento, mas 1 balde a cada 10 s (minecraft:tick no JSON)
 * e guarda até CONDENSADOR_AVANCADO.capacidade baldes no estado cl:nivel.
 * Com energia (bateria ligada, Fase 5), gasta 1 E por ciclo e produz em dobro.
 */
const NIVEL = "cl:nivel";

export const condensadorAvancado: BlockCustomComponent = {
  onTick(e) {
    // Só gasta energia se ainda houver espaço para guardar água.
    const cabe = lerEstado<number>(e.block, NIVEL) < CONDENSADOR_AVANCADO.capacidade;
    const vezes = cabe && consumir(e.block) ? 2 : 1;
    if (vezes === 2) creditar(e.block, "turbo");
    for (let i = 0; i < vezes; i++) {
      if (entregarEmBauAdjacente(e)) continue;
      const nivel = lerEstado<number>(e.block, NIVEL);
      if (nivel < CONDENSADOR_AVANCADO.capacidade) definirEstado(e.block, NIVEL, nivel + 1);
    }
  },

  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const nivel = lerEstado<number>(e.block, NIVEL);
    if (nivel <= 0) {
      avisar(jogador, "cl.condensador.condensando");
      return;
    }
    if (!retirarAgua(jogador, aguaDoCondensador.avancado)) return;
    definirEstado(e.block, NIVEL, nivel - 1);
    e.dimension.playSound("bucket.fill_water", e.block.center());
    avisar(jogador, "cl.condensador.coletado");
  },
};

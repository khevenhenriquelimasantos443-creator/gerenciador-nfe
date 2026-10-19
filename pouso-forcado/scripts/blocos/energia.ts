import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, ItemStack, Player, world } from "@minecraft/server";
import { ENERGIA, IDS, PENEIRA } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { Acao } from "../missoes/lista.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";
import { particula } from "../util/efeitos.js";
import { rf, rfPorTick } from "../util/energia.js";
import { cargaDe, consumir, gerar } from "../util/rede.js";

/*
 * Blocos de energia (Fase 5). Todos têm minecraft:tick de 100 ticks (5 s) no JSON.
 * A energia aparece em RF (util/energia.ts); a bateria guarda unidades de 4.000 RF.
 * - Painel Solar: de dia, com céu aberto em cima dele, gera ENERGIA.painelPorCiclo.
 * - Gerador a Carvão: toque com carvão, madeira etc. (ENERGIA.combustivel) para abastecer; gasta 1
 *   de combustível por ciclo e gera ENERGIA.geradorPorCiclo, só se houver bateria com espaço.
 * - Moinho de Vento: dia e noite, se os 4 lados estiverem livres; gera mais quanto mais alto
 *   (ENERGIA.moinho). Bom em cima de dunas ou de uma torre.
 * - Bateria: guarda até ENERGIA.bateriaMax. Toque com a mão vazia para ver a carga.
 * - Cabo: só um bloco; liga tudo (a busca da rede anda pelos cabos).
 * - Peneira Automática: puxa areia/cascalho do baú/funil em cima, gasta 1 E a cada
 *   ENERGIA.peneiraPorE blocos e põe o resultado no baú/funil embaixo (ou solta do lado).
 * Toque em qualquer um com a mão vazia para ver o estado na tela.
 */
const COMBUSTIVEL = "cl:combustivel";

/** O jogador mais perto ganha o progresso das missões das máquinas automáticas. */
export function creditar(bloco: Block, acao: Acao): void {
  const quem = bloco.dimension.getPlayers({ location: bloco.center(), maxDistance: ENERGIA.avisoRaio, closest: 1 })[0];
  if (quem) registrarAcao(quem, acao);
}

function solAlto(): boolean {
  const t = world.getTimeOfDay();
  return t > 500 && t < 11500;
}

function ceuAberto(bloco: Block): boolean {
  const topo = bloco.dimension.getTopmostBlock({ x: bloco.x, z: bloco.z });
  return !topo || topo.y <= bloco.y;
}

function mostrar(jogador: Player | undefined, chave: string, valores: string[] = []): void {
  if (jogador) aviso(jogador, { translate: chave, with: valores });
}

export const painelSolar: BlockCustomComponent = {
  onTick(e) {
    if (solAlto() && ceuAberto(e.block) && gerar(e.block, ENERGIA.painelPorCiclo) > 0)
      particula(e.dimension, "cl:energia", { x: e.block.x + 0.5, y: e.block.y + 0.6, z: e.block.z + 0.5 });
  },
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const chave = !solAlto() ? "cl.energia.painel_noite" : ceuAberto(e.block) ? "cl.energia.painel_ok" : "cl.energia.painel_coberto";
    mostrar(e.player, chave, [rfPorTick(ENERGIA.painelPorCiclo)]);
  },
};

export const gerador: BlockCustomComponent = {
  onTick(e) {
    const c = lerEstado<number>(e.block, COMBUSTIVEL);
    if (c <= 0) return;
    if (gerar(e.block, ENERGIA.geradorPorCiclo) > 0) {
      definirEstado(e.block, COMBUSTIVEL, c - 1);
      particula(e.dimension, "cl:fumaca", { x: e.block.x + 0.5, y: e.block.y + 1.4, z: e.block.z + 0.5 });
    }
  },
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const c = lerEstado<number>(e.block, COMBUSTIVEL);
    const mao = itemNaMao(jogador);
    const valor = mao ? ENERGIA.combustivel[mao.typeId] : undefined;
    if (valor && c < ENERGIA.geradorMax) {
      gastarDaMao(jogador);
      definirEstado(e.block, COMBUSTIVEL, Math.min(ENERGIA.geradorMax, c + valor));
      e.dimension.playSound("fire.ignite", e.block.center());
    }
    const g = ENERGIA.geradorPorCiclo;
    mostrar(jogador, "cl.energia.gerador", [rf(lerEstado<number>(e.block, COMBUSTIVEL) * g), rf(ENERGIA.geradorMax * g), rfPorTick(g)]);
  },
};

function ventoDoMoinho(bloco: Block): number {
  const livre = [bloco.north(), bloco.south(), bloco.east(), bloco.west()].every((b) => b?.isAir);
  if (!livre) return 0;
  return ENERGIA.moinho.find((m) => bloco.y >= m.yMin)?.porCiclo ?? 0;
}

export const moinho: BlockCustomComponent = {
  onTick(e) {
    const vento = ventoDoMoinho(e.block);
    if (vento > 0) gerar(e.block, vento);
  },
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const vento = ventoDoMoinho(e.block);
    if (vento > 0) mostrar(e.player, "cl.energia.moinho_ok", [rfPorTick(vento)]);
    else mostrar(e.player, "cl.energia.moinho_parado", [String(ENERGIA.moinho[ENERGIA.moinho.length - 1].yMin)]);
  },
};

export const bateria: BlockCustomComponent = {
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    mostrar(e.player, "cl.energia.bateria", [rf(cargaDe(e.block)), rf(ENERGIA.bateriaMax)]);
  },
};

/** Tira 1 bloco peneirável do container; retorna o id dele. */
function tirarPeneiravel(bloco: Block): string | undefined {
  const inv = bloco.above()?.getComponent("minecraft:inventory")?.container;
  if (!inv) return undefined;
  for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (!p || !PENEIRA[p.typeId]) continue;
    const id = p.typeId;
    if (p.amount === 1) inv.setItem(s, undefined);
    else {
      p.amount--;
      inv.setItem(s, p);
    }
    return id;
  }
  return undefined;
}

export const peneiraAutomatica: BlockCustomComponent = {
  onTick(e) {
    const temAlgo = e.block.above()?.getComponent("minecraft:inventory")?.container;
    if (!temAlgo || temAlgo.emptySlotsCount === temAlgo.size) return;
    if (!consumir(e.block)) return;
    const saida = e.block.below()?.getComponent("minecraft:inventory")?.container;
    for (let i = 0; i < ENERGIA.peneiraPorE; i++) {
      const id = tirarPeneiravel(e.block);
      if (!id) break;
      for (const { item, chance, max = 1 } of PENEIRA[id]) {
        if (Math.random() >= chance) continue;
        const pilha = new ItemStack(item, 1 + Math.floor(Math.random() * max));
        const sobra = saida ? saida.addItem(pilha) : pilha;
        if (sobra) e.dimension.spawnItem(sobra, { x: e.block.x + 0.5, y: e.block.y + 0.5, z: e.block.z - 0.6 });
      }
      creditar(e.block, "peneirar");
    }
    e.dimension.playSound("dig.sand", e.block.center());
  },
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    mostrar(e.player, "cl.energia.peneira_auto");
  },
};

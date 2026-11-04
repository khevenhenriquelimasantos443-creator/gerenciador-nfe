import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, Dimension, ItemStack, Player, system } from "@minecraft/server";
import { DADOS_F65 } from "../conteudo/gerado.js";
import { gravar, ler } from "../util/dados.js";
import { IDS, PENEIRA, PENEIRA_TOQUES } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao, soltarEmCima } from "../util/inventario.js";

/*
 * Peneira (como a do Ex Nihilo): toque nela com terra, cascalho, areia ou poeira na mão para
 * carregar 1 bloco; depois cada toque peneira um pouco (PENEIRA_TOQUES toques, no máximo 1 a cada
 * 4 ticks: segurar o dedo conta como vários). No fim, cada linha da tabela PENEIRA (config.ts) é
 * sorteada à parte e o que sair pula em cima da peneira.
 * Estados: cl:carga = o que está na malha (0 = nada; ver CARGAS); cl:progresso = toques dados.
 * Sem tick: só custa alguma coisa quando o jogador toca.
 */
export const CARGAS = ["", "minecraft:dirt", "minecraft:gravel", "minecraft:sand", IDS.poeira] as const;
const SOM: Readonly<Record<string, string>> = { "minecraft:dirt": "dig.grass", "minecraft:gravel": "dig.gravel" };
const ultimoToque = new Map<string, number>(); // no máximo 1 toque a cada 4 ticks por jogador

// 1.46.0 (Ex Nihilo: Sequentia): as malhas. Para cada achado da tabela do mod, vale a chance da melhor malha até a que
// está na peneira.
const MALHAS = ["string", "flint", "iron", "diamond", "emerald", "netherite"] as const;
const ITEM_MALHA: Readonly<Record<string, number>> = {
  "cl:malha_barbante": 0, "cl:malha_silex": 1, "cl:malha_ferro": 2, "cl:malha_diamante": 3, "cl:malha_esmeralda": 4, "cl:malha_netherita": 5,
};
const MALHA_ITEM = Object.fromEntries(Object.entries(ITEM_MALHA).map(([k, v]) => [v, k])) as Record<number, string>;
type Achado2 = { item: string; n: number; chance: number[] }; // chance por nível de malha (-1 = não sai)
const TABELA = (() => {
  const t: Record<string, Record<string, Achado2>> = {};
  const fonte = DADOS_F65.peneira as unknown as Record<string, Record<string, [string, number, number][]>>;
  for (const [entrada, porMalha] of Object.entries(fonte))
    for (const [malha, lista] of Object.entries(porMalha)) {
      const nivel = MALHAS.indexOf(malha as (typeof MALHAS)[number]);
      for (const [item, n, chance] of lista) {
        const k = `${item}|${n}`;
        const a = ((t[entrada] ??= {})[k] ??= { item, n, chance: MALHAS.map(() => -1) });
        a.chance[nivel] = Math.max(a.chance[nivel], chance);
      }
    }
  return Object.fromEntries(Object.entries(t).map(([e, m]) => [e, Object.values(m)]));
})();
function peneirarComMalha(bloco: string, nivel: number, soltar: (item: string, qtd: number) => void): boolean {
  let achou = false;
  for (const a of TABELA[bloco] ?? []) {
    let c = -1;
    for (let k = nivel; k >= 0 && c < 0; k--) c = a.chance[k];
    if (c <= 0 || Math.random() >= c) continue;
    soltar(a.item, a.n);
    achou = true;
  }
  return achou;
}

/** Sorteia a tabela de um bloco e solta em cima da peneira. Retorna se saiu alguma coisa. */
export function peneirar(bloco: string, soltar: (item: string, qtd: number) => void): boolean {
  let achou = false;
  for (const { item, chance, max = 1 } of PENEIRA[bloco] ?? []) {
    if (Math.random() >= chance) continue;
    soltar(item, 1 + Math.floor(Math.random() * max));
    achou = true;
  }
  return achou;
}

/** Um toque numa peneira carregada; no fim, sorteia (com a malha, se tiver). Retorna se terminou. */
function avancar(dim: Dimension, b: Block, jogador: Player | undefined): boolean {
  const carga = lerEstado<number>(b, "cl:carga");
  if (!carga) return false;
  const progresso = lerEstado<number>(b, "cl:progresso") + 1;
  if (progresso < PENEIRA_TOQUES) {
    definirEstado(b, "cl:progresso", progresso);
    return false;
  }
  const bloco = CARGAS[carga];
  definirEstado(b, "cl:carga", 0);
  definirEstado(b, "cl:progresso", 0);
  const nivel = ler<number | undefined>("malha", b, undefined);
  const soltar = (item: string, qtd: number) => {
    soltarEmCima(dim, b.location, item, qtd);
    if (item === "minecraft:diamond" && nivel !== undefined && jogador) registrarAcao(jogador, "ens_diamante");
  };
  const achou = nivel !== undefined ? peneirarComMalha(bloco, nivel, soltar) : peneirar(bloco, soltar);
  if (!achou && jogador) aviso(jogador, "cl.peneira.nada");
  if (jogador) registrarAcao(jogador, "peneirar");
  return true;
}

export const peneira: BlockCustomComponent = {
  onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
    const jogador = e.player;
    if (!jogador) return;
    const agora = system.currentTick;
    if (agora - (ultimoToque.get(jogador.id) ?? -10) < 4) return;
    ultimoToque.set(jogador.id, agora);
    const mao = itemNaMao(jogador);
    // Malhas: tocar com uma põe (devolvendo a antiga); agachado de mão vazia tira.
    if (mao && ITEM_MALHA[mao.typeId] !== undefined) {
      const antiga = ler<number | undefined>("malha", e.block, undefined);
      gastarDaMao(jogador);
      if (antiga !== undefined) soltarEmCima(e.dimension, e.block.location, MALHA_ITEM[antiga], 1);
      gravar("malha", e.block, ITEM_MALHA[mao.typeId]);
      aviso(jogador, { translate: "cl.peneira.malha", with: { rawtext: [{ translate: new ItemStack(mao.typeId, 1).localizationKey }] } }, 2);
      if (ITEM_MALHA[mao.typeId] >= 2) registrarAcao(jogador, "ens_malha");
      return;
    }
    if (!mao && jogador.isSneaking) {
      const antiga = ler<number | undefined>("malha", e.block, undefined);
      if (antiga !== undefined) {
        gravar("malha", e.block, undefined);
        soltarEmCima(e.dimension, e.block.location, MALHA_ITEM[antiga], 1);
      } else aviso(jogador, "cl.peneira.sem_malha", 2);
      return;
    }
    const carga = lerEstado<number>(e.block, "cl:carga");
    if (carga === 0) {
      const k = mao ? CARGAS.indexOf(mao.typeId as (typeof CARGAS)[number]) : -1;
      if (k <= 0) {
        aviso(jogador, "cl.peneira.como");
        return;
      }
      gastarDaMao(jogador);
      definirEstado(e.block, "cl:carga", k);
      definirEstado(e.block, "cl:progresso", 0);
      e.dimension.playSound(SOM[CARGAS[k]] ?? "dig.sand", e.block.center());
      return;
    }
    e.dimension.playSound(SOM[CARGAS[carga]] ?? "dig.sand", e.block.center(), { volume: 0.5, pitch: 1.2 });
    avancar(e.dimension, e.block, jogador);
    // Peneiras em grupo (Sequentia): as carregadas até 2 blocos também andam.
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++) {
        if (!dx && !dz) continue;
        const v = e.dimension.getBlock({ x: e.block.x + dx, y: e.block.y, z: e.block.z + dz });
        if (v?.typeId === e.block.typeId) avancar(e.dimension, v, jogador);
      }
  },
};

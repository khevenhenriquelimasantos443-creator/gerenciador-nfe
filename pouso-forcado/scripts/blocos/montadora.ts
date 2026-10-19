import { BlockCustomComponent, Container, ItemStack, Player, RawMessage, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { MONTADORA, ReceitaMontadora } from "../config.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { particula } from "../util/efeitos.js";
import { rf } from "../util/energia.js";
import { consumir } from "../util/rede.js";

/*
 * Montadora: máquina de energia que faz as peças da nave (receitas em MONTADORA, config.ts).
 * - Ponha os ingredientes num baú ou funil EM CIMA dela; a peça sai no baú/funil EMBAIXO
 *   (ou cai do lado, se não houver).
 * - A cada 5 s (minecraft:tick de 100 no JSON) gasta 4.000 RF (1 unidade) de uma bateria da rede e avança 1 no
 *   estado cl:progresso; quando chega na energia da receita, tira os ingredientes e solta a peça.
 * - A primeira receita da lista que estiver completa no baú é a que ela faz.
 * Toque nela para ver as receitas e o andamento.
 * Custo: uma leitura do baú de cima e uma busca de bateria por montadora a cada 5 s.
 */
const PROGRESSO = "cl:progresso";

function contar(inv: Container): Map<string, number> {
  const total = new Map<string, number>();
  for (let s = 0; s < inv.size; s++) {
    const p = inv.getItem(s);
    if (p) total.set(p.typeId, (total.get(p.typeId) ?? 0) + p.amount);
  }
  return total;
}

function receitaPronta(inv: Container): ReceitaMontadora | undefined {
  const tem = contar(inv);
  return MONTADORA.find((r) => r.ingredientes.every(({ item, qtd }) => (tem.get(item) ?? 0) >= qtd));
}

function tirar(inv: Container, item: string, qtd: number): void {
  let falta = qtd;
  for (let s = 0; s < inv.size && falta > 0; s++) {
    const p = inv.getItem(s);
    if (p?.typeId !== item) continue;
    const n = Math.min(falta, p.amount);
    if (n === p.amount) inv.setItem(s, undefined);
    else {
      p.amount -= n;
      inv.setItem(s, p);
    }
    falta -= n;
  }
}

/** Texto de uma receita: "Placa de Casco: 3x Barra de Ferro, 2x Barra de Cobre (8.000 RF)". */
function textoReceita(r: ReceitaMontadora): RawMessage[] {
  const partes: RawMessage[] = [{ text: "§e" }, { translate: nomeItem(r.resultado) }, { text: "§r: " }];
  r.ingredientes.forEach(({ item, qtd }, i) => {
    partes.push({ text: `${i > 0 ? ", " : ""}${qtd}x ` }, { translate: nomeItem(item) });
  });
  partes.push({ text: ` §7(${rf(r.energia)})§r\n` });
  return partes;
}

/** Chave de tradução do nome de um item ou bloco (blocos do jogo usam "tile."). */
export function nomeItem(id: string): string {
  try {
    return new ItemStack(id, 1).localizationKey;
  } catch {
    return id;
  }
}

export function receitasDaMontadora(): RawMessage {
  return { rawtext: MONTADORA.flatMap(textoReceita) };
}

async function mostrar(jogador: Player, andamento: RawMessage): Promise<void> {
  await new ActionFormData()
    .title({ translate: "cl.montadora.titulo" })
    .body({ rawtext: [andamento, { text: "\n\n" }, { translate: "cl.montadora.como" }, { text: "\n\n" }, receitasDaMontadora()] })
    .button({ translate: "cl.diario.fechar" })
    .show(jogador);
}

export const montadora: BlockCustomComponent = {
  onTick(e) {
    const cima = e.block.above()?.getComponent("minecraft:inventory")?.container;
    if (!cima || cima.emptySlotsCount === cima.size) return;
    const r = receitaPronta(cima);
    if (!r) return;
    if (!consumir(e.block)) return;
    const progresso = lerEstado<number>(e.block, PROGRESSO) + 1;
    if (progresso < r.energia) {
      definirEstado(e.block, PROGRESSO, progresso);
      e.dimension.playSound("random.click", e.block.center(), { volume: 0.3 });
      particula(e.dimension, "cl:energia", { x: e.block.x + 0.5, y: e.block.y + 0.9, z: e.block.z + 0.5 });
      return;
    }
    for (const { item, qtd } of r.ingredientes) tirar(cima, item, qtd);
    definirEstado(e.block, PROGRESSO, 0);
    const peca = new ItemStack(r.resultado, r.quantidade);
    const baixo = e.block.below()?.getComponent("minecraft:inventory")?.container;
    const sobra = baixo ? baixo.addItem(peca) : peca;
    if (sobra) e.dimension.spawnItem(sobra, { x: e.block.x + 0.5, y: e.block.y + 0.5, z: e.block.z - 0.6 });
    e.dimension.playSound("random.anvil_use", e.block.center(), { volume: 0.6 });
    particula(e.dimension, "cl:faisca_laranja", { x: e.block.x + 0.5, y: e.block.y + 0.9, z: e.block.z + 0.5 });
  },
  onPlayerInteract(e) {
    const jogador = e.player;
    if (!jogador) return;
    const cima = e.block.above()?.getComponent("minecraft:inventory")?.container;
    const r = cima ? receitaPronta(cima) : undefined;
    const andamento: RawMessage = !cima
      ? { translate: "cl.montadora.sem_bau" }
      : !r
        ? { translate: "cl.montadora.falta" }
        : { rawtext: [{ translate: "cl.montadora.fazendo" }, { text: " " }, { translate: nomeItem(r.resultado) }, { text: ` (${rf(lerEstado<number>(e.block, PROGRESSO))} / ${rf(r.energia)})` }] };
    system.run(() => {
      mostrar(jogador, andamento).catch(() => {
        // menu fechado no meio
      });
    });
  },
};

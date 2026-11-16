import { Block, BlockCustomComponent, Container, ItemStack, world } from "@minecraft/server";
import { IDS } from "../config.js";
import { DADOS_F39, DADOS_F68 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { inv } from "../util/maquina.js";
import { definirAoPassarNoCabo, ligaNoCabo } from "../util/rede.js";
import { quebrado } from "../util/explosao.js";

/*
 * Condutos do Ender IO (1.11.0):
 * - Conduto de Energia: passa energia como os cabos (entra na rede de util/rede.ts) e liga nos cabos, máquinas e
 *   blocos de energia.
 * - Conduto de Itens: tocar troca o modo. No modo "tira" (miolo laranja), a cada segundo tira até 4 itens dos
 *   inventários encostados nele e põe nos inventários encostados nos outros condutos da rede (o mais perto primeiro).
 * As ligações (braços do modelo) mudam quando um bloco é posto ou quebrado do lado e, para os cabos de energia, também
 *   na primeira vez da sessão que a energia passa por eles (conserta os cabos de mundos antigos).
 * Custo: cada conduto que tira faz uma busca de até 64 condutos por segundo.
 */
const ENERGIA = "cl:conduto_energia";
const ITEM = "cl:conduto_item";
const POR_SEGUNDO = 4;
const MAX_REDE = 64;
// Os cabos de energia: o Conduto do Ender IO e os Cabos do Powah! (1.18.0), que ligam do mesmo jeito.
// 1.20.0: os Condutores de Energia Aprimorado e do Ender (Ender IO 9).
// 1.51.0: os Cabos Universais do Mekanism (a rede do pack não limita a vazão; o nível muda a receita e o visual).
// 1.55.0: o Cabo da nave (Fase 9) também, e todos com a mesma regra (ligaNoCabo, em util/rede.ts).
const CABOS_ENERGIA = new Set<string>([IDS.cabo, ENERGIA, "cl:conduto_energia_aprimorado", "cl:conduto_energia_ender", ...DADOS_F39.niveis.map((n) => `cl:cabo_powah_${n}`),
  ...DADOS_F68.cabos]);
// Outros transmissores (1.51.0: canos, tubos e transportadores do Mekanism) dizem com o que ligam.
const OUTRAS = new Map<string, (b: Block, v: Block) => boolean>();
export function registrarLigacao(ids: readonly string[], liga: (b: Block, v: Block) => boolean): void {
  for (const id of ids) OUTRAS.set(id, liga);
}
const LADOS: ReadonlyArray<[string, (b: Block) => Block | undefined]> = [
  ["cl:n", (b) => b.north()], ["cl:s", (b) => b.south()], ["cl:l", (b) => b.east()],
  ["cl:o", (b) => b.west()], ["cl:cima", (b) => b.above()], ["cl:baixo", (b) => b.below()],
];
const ao = (b: Block, passo: (b: Block) => Block | undefined): Block | undefined => {
  try {
    return passo(b);
  } catch {
    return undefined;
  }
};
const chave = (b: Block) => `${b.x},${b.y},${b.z}`;

function liga(b: Block, v: Block | undefined): boolean {
  if (!v) return false;
  const outra = OUTRAS.get(b.typeId);
  if (outra) return outra(b, v);
  return CABOS_ENERGIA.has(b.typeId) ? ligaNoCabo(v.typeId) : v.typeId === ITEM || !!inv(v);
}
function atualizar(b: Block | undefined): void {
  if (!b || (!CABOS_ENERGIA.has(b.typeId) && b.typeId !== ITEM && !OUTRAS.has(b.typeId))) return;
  const antes = b.permutation;
  let p = antes;
  let mudou = false;
  for (const [estado, passo] of LADOS) {
    const quer = liga(b, ao(b, passo));
    if (antes.getState(estado as never) === quer) continue;
    p = p.withState(estado as never, quer as never);
    mudou = true;
  }
  if (mudou) b.setPermutation(p); // só troca quando muda (setPermutation manda o bloco de novo para o celular)
}

/** Os condutos ligados a este (busca em largura, o mais perto primeiro; `ehRede` diz quem é da mesma rede). */
export function redeDe(origem: Block, ehRede: (id: string) => boolean = (id) => id === ITEM, max = MAX_REDE): Block[] {
  const vistos = new Set([chave(origem)]);
  const fila = [origem];
  const lista: Block[] = [];
  while (fila.length && lista.length < max) {
    const b = fila.shift()!;
    lista.push(b);
    for (const [, passo] of LADOS) {
      const v = ao(b, passo);
      if (v && ehRede(v.typeId) && !vistos.has(chave(v))) {
        vistos.add(chave(v));
        fila.push(v);
      }
    }
  }
  return lista;
}

export function inventariosEncostados(b: Block, ehRede: (id: string) => boolean = (id) => id === ITEM): Array<{ c: Container; k: string }> {
  const r: Array<{ c: Container; k: string }> = [];
  for (const [, passo] of LADOS) {
    const v = ao(b, passo);
    const c = v && !ehRede(v.typeId) ? inv(v) : undefined;
    if (v && c) r.push({ c, k: chave(v) });
  }
  return r;
}
const extrai = (c: Block) => c.permutation.getState("cl:extrai" as never) === true;
/** Os inventários encostados nos condutos da rede que não tiram (destinos), sem os de `proibidos`. */
export function destinosDaRede(origem: Block, ehRede: (id: string) => boolean, proibidos = new Set<string>()): Container[] {
  const destinos: Container[] = [];
  for (const c of redeDe(origem, ehRede)) {
    if (extrai(c)) continue;
    for (const d of inventariosEncostados(c, ehRede)) if (!proibidos.has(d.k)) {
      proibidos.add(d.k);
      destinos.push(d.c);
    }
  }
  return destinos;
}
/** Põe a pilha nos destinos; devolve o que sobrou. */
export function porNosDestinos(pilha: ItemStack, destinos: Container[]): ItemStack | undefined {
  let resto: ItemStack | undefined = pilha;
  for (const d of destinos) {
    resto = d.addItem(resto);
    if (!resto) break;
  }
  return resto;
}
/** Tira até `quantos` itens dos inventários encostados em `b` e manda para a rede. Devolve quantos andaram. */
export function moverItens(b: Block, ehRede: (id: string) => boolean, quantos: number): number {
  const fontes = inventariosEncostados(b, ehRede);
  if (!fontes.length) return 0;
  const destinos = destinosDaRede(b, ehRede, new Set(fontes.map((f) => f.k)));
  if (!destinos.length) return 0;
  let falta = quantos;
  for (const { c } of fontes) {
    for (let s = 0; s < c.size && falta > 0; s++) {
      const pilha = c.getItem(s);
      if (!pilha) continue;
      const n = Math.min(falta, pilha.amount);
      const parte = pilha.clone();
      parte.amount = n;
      const resto = porNosDestinos(parte, destinos);
      const movidos = n - (resto?.amount ?? 0);
      if (!movidos) continue;
      falta -= movidos;
      if (pilha.amount > movidos) {
        pilha.amount -= movidos;
        c.setItem(s, pilha);
      } else c.setItem(s, undefined);
    }
  }
  return quantos - falta;
}

export const condutoItem: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    if (!extrai(b)) return;
    if (moverItens(b, (id) => id === ITEM, POR_SEGUNDO) > 0) {
      const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
      if (j) registrarAcao(j, "conduto");
    }
  },
  onPlayerInteract(e) {
    const b = e.block;
    const extrai = b.permutation.getState("cl:extrai" as never) !== true;
    b.setPermutation(b.permutation.withState("cl:extrai" as never, extrai as never));
    if (e.player) aviso(e.player, { translate: "cl.co.modo", with: { rawtext: [{ translate: extrai ? "cl.co.extrai" : "cl.co.insere" }] } }, 3);
  },
};

export { atualizar as atualizarConduto };
export function registrarCondutos(): void {
  definirAoPassarNoCabo((b) => {
    if (CABOS_ENERGIA.has(b.typeId)) atualizar(b);
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    atualizar(block);
    for (const [, passo] of LADOS) atualizar(ao(block, passo));
  });
  quebrado(({ block }) => {
    for (const [, passo] of LADOS) atualizar(ao(block, passo));
  });
}

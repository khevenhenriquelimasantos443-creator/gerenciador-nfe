import { Block, BlockCustomComponent, Container, ItemStack, world } from "@minecraft/server";
import { ARMAZENAMENTO, IDS } from "../config.js";
import { MAQUINAS_CONTEUDO } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { inv } from "../util/maquina.js";
import { CELULAS } from "../util/rede.js";

/*
 * Condutos do Ender IO (1.11.0):
 * - Conduto de Energia: passa energia como os cabos (entra na rede de util/rede.ts) e liga nos cabos, máquinas e
 *   blocos de energia.
 * - Conduto de Itens: tocar troca o modo. No modo "tira" (miolo laranja), a cada segundo tira até 4 itens dos
 *   inventários encostados nele e põe nos inventários encostados nos outros condutos da rede (o mais perto primeiro).
 * As ligações (braços do modelo) mudam quando um bloco é posto ou quebrado do lado.
 * Custo: cada conduto que tira faz uma busca de até 64 condutos por segundo.
 */
const ENERGIA = "cl:conduto_energia";
const ITEM = "cl:conduto_item";
const POR_SEGUNDO = 4;
const MAX_REDE = 64;
const LIGA_ENERGIA = new Set<string>([
  ENERGIA, IDS.cabo, IDS.bateria, IDS.painelSolar, IDS.gerador, IDS.moinho, IDS.peneiraAutomatica, IDS.montadora, IDS.terminal,
  IDS.estufa, IDS.condensadorAvancado, ...ARMAZENAMENTO.conteineres, ...Object.keys(CELULAS), ...MAQUINAS_CONTEUDO, "cl:dinamo_redstone", "cl:tesseract",
]);
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
  return b.typeId === ENERGIA ? LIGA_ENERGIA.has(v.typeId) : v.typeId === ITEM || !!inv(v);
}
function atualizar(b: Block | undefined): void {
  if (!b || (b.typeId !== ENERGIA && b.typeId !== ITEM)) return;
  let p = b.permutation;
  for (const [estado, passo] of LADOS) p = p.withState(estado as never, liga(b, ao(b, passo)) as never);
  b.setPermutation(p);
}

/** Os condutos de itens ligados a este (busca em largura, o mais perto primeiro). */
function rede(origem: Block): Block[] {
  const vistos = new Set([chave(origem)]);
  const fila = [origem];
  const lista: Block[] = [];
  while (fila.length && lista.length < MAX_REDE) {
    const b = fila.shift()!;
    lista.push(b);
    for (const [, passo] of LADOS) {
      const v = ao(b, passo);
      if (v?.typeId === ITEM && !vistos.has(chave(v))) {
        vistos.add(chave(v));
        fila.push(v);
      }
    }
  }
  return lista;
}

function inventarios(b: Block): Array<{ c: Container; k: string }> {
  const r: Array<{ c: Container; k: string }> = [];
  for (const [, passo] of LADOS) {
    const v = ao(b, passo);
    const c = v && v.typeId !== ITEM ? inv(v) : undefined;
    if (v && c) r.push({ c, k: chave(v) });
  }
  return r;
}

export const condutoItem: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    if (b.permutation.getState("cl:extrai" as never) !== true) return;
    const fontes = inventarios(b);
    if (!fontes.length) return;
    const proibidos = new Set(fontes.map((f) => f.k));
    const destinos: Container[] = [];
    for (const c of rede(b)) {
      if (c.permutation.getState("cl:extrai" as never) === true) continue;
      for (const d of inventarios(c)) if (!proibidos.has(d.k)) {
        proibidos.add(d.k);
        destinos.push(d.c);
      }
    }
    if (!destinos.length) return;
    let falta = POR_SEGUNDO;
    for (const { c } of fontes) {
      for (let s = 0; s < c.size && falta > 0; s++) {
        const pilha = c.getItem(s);
        if (!pilha) continue;
        const n = Math.min(falta, pilha.amount);
        let resto: ItemStack | undefined = pilha.clone();
        resto.amount = n;
        for (const d of destinos) {
          resto = d.addItem(resto);
          if (!resto) break;
        }
        const movidos = n - (resto?.amount ?? 0);
        if (!movidos) continue;
        falta -= movidos;
        if (pilha.amount > movidos) {
          pilha.amount -= movidos;
          c.setItem(s, pilha);
        } else c.setItem(s, undefined);
      }
    }
    if (falta < POR_SEGUNDO) {
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

export function registrarCondutos(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    atualizar(block);
    for (const [, passo] of LADOS) atualizar(ao(block, passo));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block }) => {
    for (const [, passo] of LADOS) atualizar(ao(block, passo));
  });
}

import { Block, BlockCustomComponent, ItemStack, Player, system } from "@minecraft/server";
import { DADOS_F57 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import type { Acao } from "../missoes/lista.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, gastarCE, saida, tirar } from "../util/maquina.js";
import { cargaDe, gerar } from "../util/rede.js";

/*
 * 1.38.0: as máquinas novas do Immersive Engineering 12.4, em bloco único (baú de entrada em cima, de saída embaixo,
 * energia da rede). Uma operação por segundo, com os RF por operação das receitas do mod (1 E = 4.000 RF; o gasto é
 * em centésimos de E). Números em tools/dados/ie12.json (tools/importar-ie12.py).
 * - Prensa de Metal: o molde que estiver no baú de cima escolhe a receita (o molde não gasta).
 * - Espremedor e Fermentador: tanque de 24.000 mB; um balde vazio no baú de cima sai cheio embaixo (1.000 mB).
 * - Refinaria: 1 balde de óleo + 1 de etanol (8 + 8 mB por operação, 80 RF cada, uma por tick) → 2 baldes de
 *   biodiesel, com Pó de Salitre no baú (catalisador, não gasta).
 * - Gerador a Diesel: 4.096 RF/t; o balde de biodiesel queima 250 ticks e o de creosoto 20 (o balde volta vazio).
 * - Gerador Termelétrico: em cada eixo com blocos dos dois lados, √(|T1 − T2|)/2 RF/t.
 * - Campânula de Jardim: semente e solo no baú (não gastam); 8 RF/t; colhe no tempo de cada planta.
 */
type Prensa = { molde: string; entrada: string[]; qtd: number; saida: string; n: number; rf: number };
type Tritura = { entrada: string[]; saida: string; n: number; extras: [string, number][]; rf: number };
type Serra = { entrada: string[]; saida: string; n: number; serragem: number; rf: number };
type Planta = { semente: string; solo: string[]; saidas: [string, number, number][]; tempo: number };
const D = DADOS_F57 as unknown as {
  prensa: Prensa[]; triturador: Tritura[]; serraria: Serra[]; espremedor: Record<string, number>; rfEspremedor: number;
  fermentador: Record<string, [number, string | null]>; rfFermentador: number; refinaria: { oleo: number; etanol: number; biodiesel: number; rf: number };
  combustivel: Record<string, number>; termo: Record<string, number>; campanula: Planta[];
};
const CE = (rf: number) => rf / 40; // 1 cE = 40 RF
const TANQUE = 24000;
const DIESEL_RF = 4096;
const porEntrada = <T extends { entrada: string[] }>(l: T[]) => {
  const m = new Map<string, T>();
  for (const r of l) for (const i of r.entrada) if (!m.has(i)) m.set(i, r);
  return m;
};
const TRITURA = porEntrada(D.triturador);
const SERRA = porEntrada(D.serraria);

function avisar(b: Block, acao: Acao): void {
  try {
    for (const j of b.dimension.getPlayers({ location: { x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 }, maxDistance: 12 })) registrarAcao(j, acao);
  } catch {
    // descarregado
  }
}
function pilha(id: string, n: number): ItemStack | undefined {
  try {
    return new ItemStack(id, n);
  } catch {
    return undefined;
  }
}
/** O primeiro item do baú de cima que tem receita no mapa. */
function achar<T>(b: Block, mapa: Map<string, T>): [string, T] | undefined {
  const c = entrada(b);
  if (!c) return undefined;
  for (let s = 0; s < c.size; s++) {
    const it = c.getItem(s);
    const r = it && mapa.get(it.typeId);
    if (r) return [it.typeId, r];
  }
  return undefined;
}

// ---------- Prensa, Triturador e Serraria ----------
export const prensaMetal: BlockCustomComponent = {
  onTick({ block: b }) {
    const c = entrada(b);
    if (!c || !cabe(b)) return;
    for (const r of D.prensa) {
      if (!contar(c, r.molde)) continue;
      const i = r.entrada.find((id) => contar(c, id) >= r.qtd);
      if (!i || !gastarCE(b, CE(r.rf))) continue;
      tirar(c, i, r.qtd);
      const p = pilha(r.saida, r.n);
      if (p) entregar(b, [p]);
      avisar(b, "ie12_prensa");
      return;
    }
  },
};
export const trituradorIe: BlockCustomComponent = {
  onTick({ block: b }) {
    const a = cabe(b) ? achar(b, TRITURA) : undefined;
    if (!a || !gastarCE(b, CE(a[1].rf))) return;
    tirar(entrada(b)!, a[0], 1);
    const out = [pilha(a[1].saida, a[1].n)];
    for (const [id, chance] of a[1].extras) if (Math.random() < chance) out.push(pilha(id, 1));
    entregar(b, out.filter((x): x is ItemStack => !!x));
    if (out.some((x) => x?.typeId === "cl:po_salitre")) avisar(b, "ie12_salitre");
  },
};
export const serrariaIe: BlockCustomComponent = {
  onTick({ block: b }) {
    const a = cabe(b) ? achar(b, SERRA) : undefined;
    if (!a || !gastarCE(b, CE(a[1].rf))) return;
    tirar(entrada(b)!, a[0], 1);
    entregar(b, [pilha(a[1].saida, a[1].n), a[1].serragem ? pilha("cl:serragem", a[1].serragem) : undefined].filter((x): x is ItemStack => !!x));
  },
};

// ---------- Espremedor e Fermentador (tanque e baldes) ----------
function tanqueComBaldes(b: Block, chave: string, balde: string, receitas: Record<string, number>, rf: number, devolve: (id: string) => string | null = () => null): void {
  let mb = ler<number>(chave, b, 0);
  const c = entrada(b);
  if (!c) return;
  if (mb + 250 <= TANQUE)
    for (let s = 0; s < c.size; s++) {
      const it = c.getItem(s);
      const n = it && receitas[it.typeId];
      if (!n) continue;
      if (!gastarCE(b, CE(rf))) break;
      const volta = devolve(it.typeId);
      tirar(c, it.typeId, 1);
      if (volta) entregar(b, [new ItemStack(volta, 1)]);
      mb = Math.min(TANQUE, mb + n);
      break;
    }
  if (mb >= 1000 && contar(c, "minecraft:bucket") && cabe(b)) {
    tirar(c, "minecraft:bucket", 1);
    entregar(b, [new ItemStack(balde, 1)]);
    mb -= 1000;
  }
  gravar(chave, b, mb);
}
const FERMENTA: Record<string, number> = Object.fromEntries(Object.entries(D.fermentador).map(([k, v]) => [k, v[0]]));
export const espremedorIe: BlockCustomComponent = {
  onTick({ block: b }) {
    tanqueComBaldes(b, "ie_oleo", "cl:balde_oleo_vegetal", D.espremedor, D.rfEspremedor);
  },
};
export const fermentador: BlockCustomComponent = {
  onTick({ block: b }) {
    tanqueComBaldes(b, "ie_etanol", "cl:balde_etanol", FERMENTA, D.rfFermentador, (id) => D.fermentador[id]?.[1] ?? null);
  },
};

// ---------- Refinaria ----------
const OPS_REFINO = Math.ceil(2000 / D.refinaria.biodiesel); // 2 baldes de biodiesel = 125 operações de 16 mB
export const refinariaIe: BlockCustomComponent = {
  onTick({ block: b }) {
    const c = entrada(b);
    if (!c || !contar(c, "cl:po_salitre") || !contar(c, "cl:balde_oleo_vegetal") || !contar(c, "cl:balde_etanol")) return;
    // 20 operações por segundo (uma por tick), 80 RF cada.
    if (!gastarCE(b, CE(D.refinaria.rf * 20))) return;
    const prog = ler<number>("ie_refino", b, 0) + 20;
    if (prog < OPS_REFINO || !cabe(b)) {
      gravar("ie_refino", b, Math.min(prog, OPS_REFINO));
      return;
    }
    tirar(c, "cl:balde_oleo_vegetal", 1);
    tirar(c, "cl:balde_etanol", 1);
    entregar(b, [new ItemStack("cl:balde_biodiesel", 1), new ItemStack("cl:balde_biodiesel", 1)]); // o balde não empilha
    gravar("ie_refino", b, 0);
  },
};

// ---------- Gerador a Diesel ----------
export const geradorDiesel: BlockCustomComponent = {
  onTick({ block: b }) {
    let queima = ler<number>("ie_queima", b, 0);
    if (queima <= 0) {
      const c = entrada(b);
      const comb = c && Object.keys(D.combustivel).find((id) => contar(c, id) > 0);
      if (!c || !comb) return;
      tirar(c, comb, 1);
      entregar(b, [new ItemStack("minecraft:bucket", 1)]);
      queima = D.combustivel[comb];
      if (comb === "cl:balde_biodiesel") avisar(b, "ie12_diesel");
    }
    const t = Math.min(20, queima);
    if (gerar(b, (DIESEL_RF * t) / 4000) <= 0) return; // rede cheia: espera sem queimar
    gravar("ie_queima", b, queima - t);
  },
};

// ---------- Gerador Termelétrico ----------
function temperatura(v: Block | undefined): number {
  if (!v || v.isAir) return -1;
  return D.termo[v.typeId] ?? -1;
}
export function rfTermo(b: Block): number {
  let rf = 0;
  for (const [a, c] of [[b.below(), b.above()], [b.north(), b.south()], [b.west(), b.east()]] as const) {
    const t0 = temperatura(a), t1 = temperatura(c);
    if (t0 > -1 && t1 > -1) rf += Math.floor(Math.sqrt(Math.abs(t0 - t1)) / 2);
  }
  return rf;
}
export const geradorTermeletrico: BlockCustomComponent = {
  onTick({ block: b }) {
    const rf = rfTermo(b);
    gravar("ie_termo", b, rf || undefined);
    if (rf > 0 && gerar(b, (rf * 20) / 4000) > 0) avisar(b, "ie12_termo");
  },
};

// ---------- Campânula de Jardim ----------
const CAMPANULA = new Map(D.campanula.map((p) => [p.semente, p]));
export const campanula: BlockCustomComponent = {
  onTick({ block: b }) {
    const a = achar(b, CAMPANULA);
    const c = entrada(b);
    if (!a || !c || !a[1].solo.some((s) => contar(c, s) > 0)) {
      gravar("ie_cresce", b, undefined);
      return;
    }
    if (!gastarCE(b, CE(8 * 20))) return;
    const prog = ler<number>("ie_cresce", b, 0) + 20;
    if (prog < a[1].tempo || !cabe(b)) {
      gravar("ie_cresce", b, Math.min(prog, a[1].tempo));
      return;
    }
    gravar("ie_cresce", b, 0);
    entregar(b, a[1].saidas.filter(([, , chance]) => Math.random() < chance).map(([id, n]) => pilha(id, n)).filter((x): x is ItemStack => !!x));
    avisar(b, "ie12_campanula");
  },
};

export function registrarImmersive12(): void {
  registrarDetalhe("cl:espremedor_ie", (b) => ({ translate: "cl.ie12.tanque", with: { rawtext: [{ translate: "cl.ie12.oleo" }, { text: String(ler<number>("ie_oleo", b, 0)) }] } }));
  registrarDetalhe("cl:fermentador", (b) => ({ translate: "cl.ie12.tanque", with: { rawtext: [{ translate: "cl.ie12.etanol" }, { text: String(ler<number>("ie_etanol", b, 0)) }] } }));
  registrarDetalhe("cl:gerador_diesel", (b) => ({ translate: "cl.ie12.diesel", with: [String(ler<number>("ie_queima", b, 0))] }));
  registrarDetalhe("cl:gerador_termeletrico", (b) => ({ translate: "cl.ie12.termo", with: [String(rfTermo(b))] }));
  registrarDetalhe("cl:refinaria_ie", (b) => ({ translate: "cl.ie12.progresso", with: [String(Math.round((100 * ler<number>("ie_refino", b, 0)) / OPS_REFINO))] }));
  // Teste no servidor: scriptevent cl:teste_ie12 x y z (o que a máquina guarda).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_ie12" || !(j instanceof Player)) return;
    const [x, y, z] = message.split(" ").map(Number);
    const b = j.dimension.getBlock({ x, y, z });
    if (!b) return;
    const s = saida(b);
    const itens: string[] = [];
    for (let i = 0; s && i < s.size; i++) {
      const it = s.getItem(i);
      if (it) itens.push(`${it.typeId}:${it.amount}`);
    }
    let carga = 0;
    for (const v of [b.north(), b.south(), b.east(), b.west()]) if (v) carga += cargaDe(v);
    console.warn(`[teste_ie12] ${b.typeId} oleo=${ler("ie_oleo", b, 0)} etanol=${ler("ie_etanol", b, 0)} queima=${ler("ie_queima", b, 0)} termo=${rfTermo(b)} carga=${carga.toFixed(2)} saida=${itens.join(",")}`);
  });
}

import { Block, BlockCustomComponent, ItemStack, Player, system } from "@minecraft/server";
import { DADOS_F61 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import type { Acao } from "../missoes/lista.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, gastarCE, saida, tirar } from "../util/maquina.js";
import { gerar } from "../util/rede.js";

/*
 * 1.42.0: Thermal Expansion 11 (números em tools/dados/thermal11.json, do código do mod).
 * - Dínamos: 40 RF/t enquanto há combustível e a rede aceita (o que sobra do combustível fica guardado). Um ciclo a
 *   cada segundo (800 RF). Lava devolve o balde; o Desencantamento devolve o item sem os encantamentos (livro
 *   encantado vira livro): energia = (Σ custo mínimo de cada encantamento + n(n+1)/2) × 8.000, com o custo mínimo do
 *   jogo (1 + 10 por nível acima do 1º).
 * - Máquinas a 20 RF/t (400 RF por segundo): a operação termina quando a energia da receita foi gasta.
 */
type Insol = { entrada: string; saidas: [string, number][]; energia: number };
type Piro = { entrada: string[]; saidas: [string, number][]; creosoto: number; energia: number };
const D = DADOS_F61 as unknown as {
  insolador: Insol[]; pirolisador: Piro[]; stirling: Record<string, number>; lapidario: Record<string, number>; gourmand: Record<string, number>;
  magmatico: Record<string, number>; desencantamento: Record<string, number>; potencia: number; gourmandPorFome: number; desencantamentoBase: number;
};
const RF_CICLO = D.potencia * 20;
const MAQ_RF = 20 * 20; // 20 RF/t das máquinas, por segundo
const INSOL = new Map(D.insolador.map((r) => [r.entrada, r]));
const PIRO = new Map(D.pirolisador.flatMap((r) => r.entrada.map((i) => [i, r] as const)));
const AGUA = new Set(["minecraft:water", "minecraft:flowing_water"]);

function avisar(b: Block, acao: Acao): void {
  try {
    for (const j of b.dimension.getPlayers({ location: { x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 }, maxDistance: 12 })) registrarAcao(j, acao);
  } catch {
    // descarregado
  }
}
function pilha(id: string, n: number): ItemStack | undefined {
  try {
    return n > 0 ? new ItemStack(id, n) : undefined;
  } catch {
    return undefined;
  }
}
/** Chance do Thermal: 2,5 = 2 garantidos + 50% de mais um. */
const quantos = (chance: number) => Math.floor(chance) + (Math.random() < chance % 1 ? 1 : 0);

// ---------- Dínamos ----------
type Queima = { rf: number; volta?: ItemStack };
function dinamo(combustivel: (it: ItemStack) => Queima | undefined, acao?: Acao): BlockCustomComponent {
  return {
    onTick({ block: b }) {
      let rf = ler<number>("th_rf", b, 0);
      if (rf <= 0) {
        const c = entrada(b);
        if (!c) return;
        for (let s = 0; s < c.size; s++) {
          const it = c.getItem(s);
          const q = it && combustivel(it);
          if (!it || !q || q.rf <= 0) continue;
          if (it.amount > 1) {
            it.amount--;
            c.setItem(s, it);
          } else c.setItem(s, undefined);
          if (q.volta) entregar(b, [q.volta]);
          rf = q.rf;
          if (acao) avisar(b, acao);
          break;
        }
        if (rf <= 0) return;
      }
      const guardou = gerar(b, Math.min(RF_CICLO, rf) / 4000);
      if (guardou <= 0) return gravar("th_rf", b, rf);
      gravar("th_rf", b, Math.max(0, rf - guardou * 4000));
      avisar(b, "th11_dinamo");
    },
  };
}
const porMapa = (m: Record<string, number>) => (it: ItemStack): Queima | undefined => (m[it.typeId] ? { rf: m[it.typeId] } : undefined);
export const dinamoStirling = dinamo(porMapa(D.stirling));
export const dinamoMagmatico = dinamo((it) => (D.magmatico[it.typeId] ? { rf: D.magmatico[it.typeId], volta: new ItemStack("minecraft:bucket", 1) } : undefined));
export const dinamoLapidario = dinamo(porMapa(D.lapidario), "th11_lapidario");
export const dinamoGourmand = dinamo((it) => {
  if (D.gourmand[it.typeId]) return { rf: D.gourmand[it.typeId] };
  const fome = it.getComponent("minecraft:food")?.nutrition ?? 0;
  return fome > 0 ? { rf: fome * D.gourmandPorFome } : undefined;
});
export const dinamoDesencantamento = dinamo((it) => {
  if (D.desencantamento[it.typeId]) return { rf: D.desencantamento[it.typeId] };
  const enc = it.getComponent("minecraft:enchantable");
  const lista = enc?.getEnchantments() ?? [];
  if (!lista.length) return undefined;
  const custo = lista.reduce((s, e) => s + 1 + 10 * (e.level - 1), 0) + (lista.length * (lista.length + 1)) / 2;
  const volta = it.typeId === "minecraft:enchanted_book" ? new ItemStack("minecraft:book", 1) : it.clone();
  if (volta.typeId !== "minecraft:book") {
    volta.amount = 1;
    volta.getComponent("minecraft:enchantable")?.removeAllEnchantments();
  }
  return { rf: custo * (D.desencantamentoBase / 2), volta };
});

// ---------- Insolador e Pirolisador ----------
function progresso<T>(b: Block, achar: () => [string, T] | undefined, energia: (r: T) => number, pronto: (id: string, r: T) => boolean): void {
  const a = achar();
  if (!a || !cabe(b)) {
    gravar("th_prog", b, undefined);
    return;
  }
  const alvo = energia(a[1]);
  const p = ler<{ id: string; rf: number } | undefined>("th_prog", b, undefined);
  const rf = p?.id === a[0] ? p.rf : 0;
  if (rf < alvo) {
    if (!gastarCE(b, MAQ_RF / 40)) return;
    gravar("th_prog", b, { id: a[0], rf: rf + MAQ_RF });
    return;
  }
  if (pronto(a[0], a[1])) gravar("th_prog", b, undefined);
}
function primeiroCom<T>(b: Block, mapa: Map<string, T>): [string, T] | undefined {
  const c = entrada(b);
  if (!c) return undefined;
  for (let s = 0; s < c.size; s++) {
    const it = c.getItem(s);
    const r = it && mapa.get(it.typeId);
    if (r) return [it.typeId, r];
  }
  return undefined;
}
const temAgua = (b: Block) => [b.north(), b.south(), b.east(), b.west(), b.below()].some((v) => v && AGUA.has(v.typeId));
export const insolador: BlockCustomComponent = {
  onTick({ block: b }) {
    if (!temAgua(b)) return;
    progresso(b, () => primeiroCom(b, INSOL), (r) => r.energia, (id, r) => {
      const c = entrada(b);
      if (!c || !tirar(c, id, 1)) return true;
      entregar(b, r.saidas.map(([s, chance]) => pilha(s, quantos(chance))).filter((x): x is ItemStack => !!x));
      avisar(b, "th11_insolador");
      return true;
    });
  },
};
const TANQUE = 10000;
export const pirolisador: BlockCustomComponent = {
  onTick({ block: b }) {
    let mb = ler<number>("th_creosoto", b, 0);
    if (mb + 250 <= TANQUE)
      progresso(b, () => primeiroCom(b, PIRO), (r) => r.energia, (id, r) => {
        const c = entrada(b);
        if (!c || !tirar(c, id, 1)) return true;
        entregar(b, r.saidas.map(([s, chance]) => pilha(s, quantos(chance))).filter((x): x is ItemStack => !!x));
        mb += r.creosoto;
        if (r.saidas.some(([s]) => s === "cl:coque")) avisar(b, "th11_pirolisador");
        return true;
      });
    const c = entrada(b);
    if (c && mb >= 1000 && contar(c, "minecraft:bucket") && cabe(b)) {
      tirar(c, "minecraft:bucket", 1);
      entregar(b, [new ItemStack("cl:balde_creosoto", 1)]);
      mb -= 1000;
    }
    gravar("th_creosoto", b, mb);
  },
};

export function registrarThermal11(): void {
  registrarDetalhe(["cl:dinamo_stirling", "cl:dinamo_magmatico", "cl:dinamo_lapidario", "cl:dinamo_gourmand", "cl:dinamo_desencantamento"], (b) => ({
    translate: "cl.th11.dinamo", with: [String(Math.round(ler<number>("th_rf", b, 0)))],
  }));
  registrarDetalhe("cl:pirolisador", (b) => ({ translate: "cl.th11.creosoto", with: [String(ler<number>("th_creosoto", b, 0))] }));
  // Teste no servidor: scriptevent cl:teste_th11 x y z (o que a máquina guarda e o baú de baixo).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_th11" || !(j instanceof Player)) return;
    const [x, y, z] = message.split(" ").map(Number);
    const b = j.dimension.getBlock({ x, y, z });
    if (!b) return;
    const s = saida(b);
    const itens: string[] = [];
    for (let i = 0; s && i < s.size; i++) {
      const it = s.getItem(i);
      if (it) itens.push(`${it.typeId}:${it.amount}`);
    }
    console.warn(`[teste_th11] ${b.typeId} rf=${ler("th_rf", b, 0)} prog=${JSON.stringify(ler("th_prog", b, null))} creosoto=${ler("th_creosoto", b, 0)} saida=${itens.join(",")}`);
  });
}

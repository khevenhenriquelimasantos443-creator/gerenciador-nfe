import { Block, BlockCustomComponent, Container, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F66 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { codigoDoItem, guardarNoItem, lerCodigo } from "../util/item_guarda.js";
import { cabe, contar, entrada, entregar, gastarCE, tirar } from "../util/maquina.js";
import { feito, maquina } from "./thermal.js";

/*
 * Mekanism completo, parte 1 (1.49.0): a química do Mekanism 10.7.19 (DADOS_F66, de tools/importar-mekanism-completo.py).
 * Baú de cima = entrada (itens, cilindros cheios, baldes d'água), baú de baixo = saída, energia da rede, ciclo de 5 s.
 * A máquina guarda cada químico num tanque de 10.000 mB: um cilindro cheio vale 1.000 mB (o vazio fica guardado, até 8;
 * o resto sai embaixo) e, quando junta 1.000 mB do que produz, enche um cilindro vazio (o guardado ou um do baú de cima).
 * - Oxidador (item → químico), Câmara de Dissolução (minério + 100 mB de ácido sulfúrico → 1.000 mB de pasta suja) e
 *   Cristalizador (200 mB de pasta limpa → cristal): uma operação por ciclo, como as outras máquinas do pack.
 * - Lavador (1 pasta suja + 5 água → 1 limpa), Infusor Químico e Condensentrador Rotativo trabalham por tique no mod
 *   (1 operação por tique): aqui 100 operações por ciclo de 5 s.
 * - Câmara de Reação Pressurizada: item + água + química → item e/ou química, uma receita por ciclo; energia = (5 J/t +
 *   a da receita) × a duração dela.
 * Tanques de Químico/Fluido: cheios no baú de cima esvaziam no tanque; vazios no baú de cima saem cheios embaixo. Quebrado
 * (sobrevivência), o tanque vira item com o conteúdo na descrição; posto de novo, volta com ele.
 */
type Q = readonly [string, number];
type R = { entra?: string[]; qtd?: number; entra_q?: Q[]; agua?: number; sai?: [string, number]; sai_q?: Q; ticks?: number; energia?: number; gas?: string; liquido?: string };
const D = DADOS_F66 as unknown as {
  processos: Record<string, R[]>;
  ce: Record<string, number>;
  cilindroDe: Record<string, string>;
  tanques: Record<string, readonly [string, number]>;
};
const VAZIO = "cl:cilindro_vazio", BALDE = "minecraft:bucket";
const MB = 1000, CAP = 10000, FLUXO = 100, GUARDA = 8;
const LIQUIDOS: Readonly<Record<string, string>> = { water: "minecraft:water_bucket", brine: "cl:balde_salmoura", lava: "minecraft:lava_bucket" };
const CHEIO = new Map<string, { q: string; vazio: string }>();
const RECIPIENTE = new Map<string, string>();
for (const [q, id] of Object.entries(D.cilindroDe)) {
  CHEIO.set(`cl:${id}`, { q, vazio: VAZIO });
  RECIPIENTE.set(q, `cl:${id}`);
}
for (const [q, id] of Object.entries(LIQUIDOS)) {
  CHEIO.set(id, { q, vazio: BALDE });
  RECIPIENTE.set(q, id);
}
const ehLiquido = (q: string) => LIQUIDOS[q] !== undefined;
const vazioDe = (q: string) => (ehLiquido(q) ? BALDE : VAZIO);
const nomeQ = (q: string): RawMessage => ({ translate: `cl.mkq.q.${q}` });

type Estado = { t: Record<string, number>; v: number; b: number; modo?: "gas" | "liquido" };
const novo = (): Estado => ({ t: {}, v: 0, b: 0 });
const tem = (e: Estado, q: string) => e.t[q] ?? 0;
function mexer(e: Estado, q: string, mb: number): void {
  e.t[q] = tem(e, q) + mb;
  if (e.t[q] <= 0) delete e.t[q];
}

/** Recipiente vazio: fica guardado (até 8 de cada) ou sai embaixo. */
function guardarVazio(b: Block, e: Estado, vazio: string): void {
  if (vazio === VAZIO && e.v < GUARDA) e.v++;
  else if (vazio === BALDE && e.b < GUARDA) e.b++;
  else entregar(b, [new ItemStack(vazio, 1)]);
}
/** Esvazia no tanque da máquina os recipientes cheios do que ela usa. */
function abastecer(b: Block, ent: Container, e: Estado, usa: ReadonlySet<string>): void {
  for (let s = 0; s < ent.size; s++) {
    const p = ent.getItem(s);
    const c = p && CHEIO.get(p.typeId);
    if (!p || !c || !usa.has(c.q)) continue;
    for (let n = 0; n < 4 && tem(e, c.q) + MB <= CAP && tirar(ent, p.typeId); n++) {
      mexer(e, c.q, MB);
      guardarVazio(b, e, c.vazio);
    }
  }
}
/** Enche recipientes com o que a máquina produziu (1.000 mB cada). */
function encher(b: Block, ent: Container, e: Estado, faz: ReadonlySet<string>): boolean {
  let fez = false;
  for (const q of faz) {
    const cheio = RECIPIENTE.get(q);
    if (!cheio) continue;
    for (let n = 0; n < 4 && tem(e, q) >= MB && cabe(b); n++) {
      const vz = vazioDe(q);
      if (vz === VAZIO && e.v > 0) e.v--;
      else if (vz === BALDE && e.b > 0) e.b--;
      else if (!tirar(ent, vz)) break;
      mexer(e, q, -MB);
      entregar(b, [new ItemStack(cheio, 1)]);
      fez = true;
    }
  }
  return fez;
}

type Status = "ok" | "parada" | "sem_energia";
const PROC = D.processos;
const indice = (lista: R[]) => {
  const m = new Map<string, R[]>();
  for (const r of lista) for (const id of r.entra ?? []) m.set(id, [...(m.get(id) ?? []), r]);
  return m;
};
const entradasQ = (lista: R[]) => new Set(lista.flatMap((r) => [...(r.entra_q ?? []).map(([q]) => q), ...(r.agua ? ["water"] : [])]));
const saidasQ = (lista: R[]) => new Set(lista.flatMap((r) => (r.sai_q ? [r.sai_q[0]] : [])));

/** Uma operação por ciclo, com item na entrada (Oxidador, Dissolução, Reação). */
function porItem(lista: R[], ce: (r: R) => number) {
  const idx = indice(lista);
  return (b: Block, ent: Container, e: Estado): Status => {
    for (let s = 0; s < ent.size; s++) {
      const p = ent.getItem(s);
      if (!p) continue;
      for (const r of idx.get(p.typeId) ?? []) {
        if (contar(ent, p.typeId) < (r.qtd ?? 1)) continue;
        if ((r.entra_q ?? []).some(([q, mb]) => tem(e, q) < mb) || tem(e, "water") < (r.agua ?? 0)) continue;
        if (r.sai_q && tem(e, r.sai_q[0]) + r.sai_q[1] > CAP) continue;
        if (r.sai && !cabe(b)) continue;
        if (!gastarCE(b, ce(r))) return "sem_energia";
        tirar(ent, p.typeId, r.qtd ?? 1);
        for (const [q, mb] of r.entra_q ?? []) mexer(e, q, -mb);
        if (r.agua) mexer(e, "water", -r.agua);
        if (r.sai_q) mexer(e, r.sai_q[0], r.sai_q[1]);
        if (r.sai) entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
        return "ok";
      }
    }
    return "parada";
  };
}
/** Química → item (Cristalizador): uma operação por ciclo. */
function cristalizar(b: Block, _ent: Container, e: Estado): Status {
  for (const r of PROC.crystallizing) {
    const [q, mb] = r.entra_q![0];
    if (tem(e, q) < mb || !cabe(b)) continue;
    if (!gastarCE(b, D.ce.crystallizing)) return "sem_energia";
    mexer(e, q, -mb);
    entregar(b, [new ItemStack(r.sai![0], r.sai![1])]);
    return "ok";
  }
  return "parada";
}
/** Por tique no mod (Lavador, Infusor): até 100 operações por ciclo. */
function fluxo(lista: R[], ce: number) {
  return (_b: Block, _ent: Container, e: Estado): Status => {
    for (const r of lista) {
      const ent = [...(r.entra_q ?? []), ...(r.agua ? [["water", r.agua] as Q] : [])];
      let n = FLUXO;
      for (const [q, mb] of ent) n = Math.min(n, Math.floor(tem(e, q) / mb));
      if (r.sai_q) n = Math.min(n, Math.floor((CAP - tem(e, r.sai_q[0])) / r.sai_q[1]));
      if (n <= 0) continue;
      if (!gastarCE(_b, ce)) return "sem_energia";
      for (const [q, mb] of ent) mexer(e, q, -mb * n);
      if (r.sai_q) mexer(e, r.sai_q[0], r.sai_q[1] * n);
      return "ok";
    }
    return "parada";
  };
}
/** Condensentrador Rotativo: líquido ⇄ gás (o modo troca com toque agachado). */
function rotativo(b: Block, _ent: Container, e: Estado): Status {
  for (const r of PROC.rotary) {
    const [de, para] = e.modo === "liquido" ? [r.gas!, r.liquido!] : [r.liquido!, r.gas!];
    const n = Math.min(FLUXO, tem(e, de), CAP - tem(e, para));
    if (n <= 0) continue;
    if (!gastarCE(b, D.ce.rotary)) return "sem_energia";
    mexer(e, de, -n);
    mexer(e, para, n);
    return "ok";
  }
  return "parada";
}
const ceReacao = (r: R) => Math.max(1, Math.round(((D.ce.reaction + (r.energia ?? 0)) * (r.ticks ?? 100)) / 2.5 / 40));
type Maq = { faz: (b: Block, ent: Container, e: Estado) => Status; usa: (e: Estado) => ReadonlySet<string>; sai: (e: Estado) => ReadonlySet<string>; som: string };
const fixo = (s: ReadonlySet<string>) => () => s;
const ROT_GAS = new Set(PROC.rotary.map((r) => r.gas!)), ROT_LIQ = new Set(PROC.rotary.map((r) => r.liquido!));
const MAQ: Readonly<Record<string, Maq>> = {
  "cl:oxidador_quimico": { faz: porItem(PROC.oxidizing, () => D.ce.oxidizing), usa: fixo(new Set()), sai: fixo(saidasQ(PROC.oxidizing)), som: "random.fizz" },
  "cl:camara_dissolucao": { faz: porItem(PROC.dissolution, () => D.ce.dissolution), usa: fixo(entradasQ(PROC.dissolution)), sai: fixo(saidasQ(PROC.dissolution)), som: "bubble.pop" },
  "cl:lavador_quimico": { faz: fluxo(PROC.washing, D.ce.washing), usa: fixo(entradasQ(PROC.washing)), sai: fixo(saidasQ(PROC.washing)), som: "bubble.pop" },
  "cl:cristalizador_quimico": { faz: cristalizar, usa: fixo(entradasQ(PROC.crystallizing)), sai: fixo(new Set()), som: "random.orb" },
  "cl:infusor_quimico": { faz: fluxo(PROC.chemical_infusing, D.ce.chemical_infusing), usa: fixo(entradasQ(PROC.chemical_infusing)), sai: fixo(saidasQ(PROC.chemical_infusing)), som: "bubble.pop" },
  "cl:condensentrador_rotativo": {
    faz: rotativo, usa: (e) => (e.modo === "liquido" ? ROT_GAS : ROT_LIQ), sai: (e) => (e.modo === "liquido" ? ROT_LIQ : ROT_GAS), som: "random.fizz",
  },
  "cl:camara_reacao_pressurizada": { faz: porItem(PROC.reaction, ceReacao), usa: fixo(entradasQ(PROC.reaction)), sai: fixo(saidasQ(PROC.reaction)), som: "random.fizz" },
};

const base = maquina((b) => {
  const m = MAQ[b.typeId];
  const ent = entrada(b);
  if (!m || !ent) return "parada";
  const e = ler<Estado>("mkq", b, novo());
  abastecer(b, ent, e, m.usa(e));
  const s = m.faz(b, ent, e);
  const encheu = encher(b, ent, e, m.sai(e));
  gravar("mkq", b, e);
  if (s === "ok") feito(b, m.som);
  return s === "parada" && encheu ? "ok" : s;
}, "cl.mkq.dica");

export const quimicaComp: BlockCustomComponent = {
  onTick: base.onTick,
  onPlayerInteract(ev) {
    const j = ev.player;
    if (j && ev.block.typeId === "cl:condensentrador_rotativo" && j.isSneaking) {
      const e = ler<Estado>("mkq", ev.block, novo());
      e.modo = e.modo === "liquido" ? "gas" : "liquido";
      gravar("mkq", ev.block, e);
      return aviso(j, `cl.mkq.rotativo.${e.modo}`, 4);
    }
    base.onPlayerInteract?.(ev, undefined as never);
  },
};

// ---------- Tanques ----------
type Tanque = { q?: string; mb: number };
export const tanqueComp: BlockCustomComponent = {
  onTick({ block: b }) {
    const def = D.tanques[b.typeId];
    const ent = entrada(b);
    if (!def || !ent) return;
    const [tipo, cap] = def;
    const t = ler<Tanque>("mkt", b, { mb: 0 });
    const serve = (q: string) => ehLiquido(q) === (tipo === "fluido");
    let mexeu = false;
    for (let n = 0; n < 8; n++) {
      // Cheio no baú de cima: esvazia no tanque.
      let achou = false;
      for (let s = 0; s < ent.size && !achou; s++) {
        const p = ent.getItem(s);
        const c = p && CHEIO.get(p.typeId);
        if (!p || !c || !serve(c.q) || (t.mb > 0 && t.q !== c.q) || t.mb + MB > cap || !cabe(b)) continue;
        tirar(ent, p.typeId);
        t.q = c.q;
        t.mb += MB;
        entregar(b, [new ItemStack(c.vazio, 1)]);
        achou = mexeu = true;
      }
      if (achou) continue;
      // Vazio no baú de cima: sai cheio embaixo.
      const cheio = t.q ? RECIPIENTE.get(t.q) : undefined;
      if (t.q && cheio && t.mb >= MB && cabe(b) && tirar(ent, vazioDe(t.q))) {
        t.mb -= MB;
        entregar(b, [new ItemStack(cheio, 1)]);
        mexeu = true;
        continue;
      }
      break;
    }
    if (mexeu) {
      if (t.mb <= 0) delete t.q;
      gravar("mkt", b, t);
    }
  },
  onPlayerInteract({ block, player }) {
    if (!player) return;
    const t = ler<Tanque>("mkt", block, { mb: 0 });
    aviso(player, t.q && t.mb > 0 ? { translate: "cl.mkq.tanque", with: { rawtext: [{ translate: `tile.${block.typeId}.name` }, { text: t.mb.toLocaleString("pt-BR") }, nomeQ(t.q)] } } : "cl.mkq.tanque.dica", 5);
  },
};

const pendente = new Map<string, { cod?: string; tick: number }>();
export function registrarMekanismQuimica(): void {
  const resumo = (e: Estado): RawMessage | undefined => {
    const partes = Object.entries(e.t).filter(([, mb]) => mb > 0);
    if (!partes.length) return undefined;
    return { rawtext: partes.flatMap(([q, mb], k) => [{ text: `${k ? ", " : ""}${mb} mB ` }, nomeQ(q)]) };
  };
  registrarDetalhe(Object.keys(MAQ), (b) => resumo(ler<Estado>("mkq", b, novo())));
  registrarDetalhe(Object.keys(D.tanques), (b) => {
    const t = ler<Tanque>("mkt", b, { mb: 0 });
    return t.q && t.mb > 0 ? { rawtext: [{ text: `${t.mb} mB ` }, nomeQ(t.q)] } : { translate: "cl.mkq.vazio" };
  });
  // Tanque quebrado leva o conteúdo; posto de novo, devolve.
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (!D.tanques[id]) return;
    const t = lerEm<Tanque>("mkt", block.dimension, block.location, { mb: 0 });
    gravarEm("mkt", block.dimension, block.location, undefined);
    if (player.getGameMode() === GameMode.Creative) return;
    const item = new ItemStack(id, 1);
    if (t.q && t.mb > 0) guardarNoItem(item, t, `§7${t.mb.toLocaleString("pt-BR")} mB`);
    block.dimension.spawnItem(item, block.center());
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack && D.tanques[ev.itemStack.typeId]) pendente.set(ev.player.id, { cod: codigoDoItem(ev.itemStack), tick: system.currentTick });
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (!D.tanques[block.typeId]) return;
    const p = pendente.get(player.id);
    pendente.delete(player.id);
    const t = p && system.currentTick - p.tick <= 3 ? lerCodigo<Tanque>(p.cod) : undefined;
    gravar("mkt", block, t ?? { mb: 0 });
  });
  // Teste no servidor: scriptevent cl:teste_mkq <estado|modo|energia> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mkq" || !(j instanceof Player)) return;
    const [acao, x, y, z] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (!b) return;
    if (acao === "estado") console.warn(`[teste_mkq] ${b.typeId} ${JSON.stringify(D.tanques[b.typeId] ? ler<Tanque>("mkt", b, { mb: 0 }) : ler<Estado>("mkq", b, novo()))}`);
    if (acao === "energia") gravar("celula", b, 20000); // um Cubo de Energia Definitivo cheio (teste)
    if (acao === "modo") {
      const e = ler<Estado>("mkq", b, novo());
      e.modo = e.modo === "liquido" ? "gas" : "liquido";
      gravar("mkq", b, e);
    }
  });
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    const cil = (q: string) => RECIPIENTE.get(q) ?? VAZIO;
    const mbs = (x: R) => [...(x.entra_q ?? []).map(([q, mb]) => `${mb} mB ${q}`), ...(x.agua ? [`${x.agua} mB water`] : []), ...(x.sai_q ? [`→ ${x.sai_q[1]} mB ${x.sai_q[0]}`] : [])].join(", ");
    const add = (id: string, x: R) => r.push({
      ...m(id),
      entradas: [...(x.entra ?? []).slice(0, 1).map((i) => ({ item: i, qtd: x.qtd ?? 1 })), ...(x.entra_q ?? []).map(([q]) => ({ item: cil(q), qtd: 1 })), ...(x.agua ? [{ item: LIQUIDOS.water, qtd: 1 }] : [])],
      saidas: [...(x.sai ? [{ item: x.sai[0], qtd: x.sai[1] }] : []), ...(x.sai_q ? [{ item: cil(x.sai_q[0]), qtd: 1 }] : [])],
      nota: { text: mbs(x) },
    });
    for (const x of PROC.oxidizing) add("cl:oxidador_quimico", x);
    for (const x of PROC.dissolution) add("cl:camara_dissolucao", x);
    for (const x of PROC.washing) add("cl:lavador_quimico", x);
    for (const x of PROC.crystallizing) add("cl:cristalizador_quimico", x);
    for (const x of PROC.chemical_infusing) add("cl:infusor_quimico", x);
    for (const x of PROC.reaction) add("cl:camara_reacao_pressurizada", x);
    for (const x of PROC.rotary) r.push({ ...m("cl:condensentrador_rotativo"), entradas: [{ item: cil(x.liquido!), qtd: 1 }], saidas: [{ item: cil(x.gas!), qtd: 1 }], nota: { text: "⇄" } });
    return r;
  });
}

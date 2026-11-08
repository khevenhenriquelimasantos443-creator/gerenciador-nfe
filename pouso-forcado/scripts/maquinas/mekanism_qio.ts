import { Block, BlockCustomComponent, Container, GameMode, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { nomeDe } from "../catalogo/catalogo.js";
import { DADOS_F70 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { inv } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * QIO do Mekanism (1.53.0): os itens ficam numa frequência (pública ou privada, como no mod). A capacidade vem dos discos
 * nas Matrizes de Discos da mesma frequência (até 12 por matriz): Disco 16.000 itens / 128 tipos, Hiperdenso 128.000 / 256,
 * Dilatador do Tempo 1.048.000 / 1.024, Supermassivo 16 bilhões / 8.192. Painel (e o Portátil): ver, procurar, tirar e
 * guardar a mochila. Importador: puxa do inventário de trás; Exportador: põe lá os itens do filtro (a cada meio segundo,
 * até uma pilha). Diferente do mod: os itens ficam na frequência, não dentro do disco (tirar um disco não some com nada;
 * só não deixa guardar além do limite). Itens com dados (encantados, com nome, com carga) não entram, como no Painel do AE.
 */
const QIO = DADOS_F70.qio as unknown as Record<string, readonly [number, number]>;
const DISCO: Readonly<Record<string, readonly [number, number]>> = {
  "cl:unidade_qio_base": QIO.base, "cl:unidade_qio_hiperdensa": QIO.hyper_dense, "cl:unidade_qio_dilatacao": QIO.time_dilating, "cl:unidade_qio_supermassiva": QIO.supermassive,
};
const MATRIZ = "cl:matriz_unidades_qio", PAINEL = "cl:painel_qio", IMP = "cl:importador_qio", EXP = "cl:exportador_qio", RED = "cl:adaptador_redstone_qio";
const PORTATIL = "cl:painel_qio_portatil";
type Freq = { k: string; nome: string };
type Itens = Record<string, number>;

// ---------- Dados ----------
let banco: Record<string, Itens> | undefined, matrizes: Record<string, { k?: string; d: string[] }> | undefined;
const carregar = <T,>(prop: string): T => {
  try {
    return JSON.parse((world.getDynamicProperty(prop) as string | undefined) ?? "{}") as T;
  } catch {
    return {} as T;
  }
};
const itensDe = (k: string): Itens => ((banco ??= carregar<Record<string, Itens>>("cl:mk_qio"))[k] ??= {});
const arr = () => (matrizes ??= carregar<Record<string, { k?: string; d: string[] }>>("cl:mk_qio_arr"));
let sujo = false;
const sujar = () => {
  if (sujo) return;
  sujo = true;
  system.runTimeout(() => {
    sujo = false;
    world.setDynamicProperty("cl:mk_qio", JSON.stringify(banco ?? {}));
    world.setDynamicProperty("cl:mk_qio_arr", JSON.stringify(matrizes ?? {}));
  }, 20);
};
const posK = (b: { x: number; y: number; z: number; dimension: { id: string } }) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
function capacidade(k: string): [number, number] {
  let n = 0, t = 0;
  for (const m of Object.values(arr())) if (m.k === k) for (const d of m.d) (n += DISCO[d]?.[0] ?? 0), (t += DISCO[d]?.[1] ?? 0);
  return [n, t];
}
const total = (it: Itens) => Object.values(it).reduce((s, n) => s + n, 0);
const simples = (i: ItemStack) =>
  !i.nameTag && !i.getLore().length && !i.getDynamicPropertyIds().length && !i.getComponent("minecraft:enchantable")?.getEnchantments().length && !i.getComponent("minecraft:durability")?.damage;
/** Quanto de `id` cabe agora na frequência. */
function cabe(k: string, id: string): number {
  const [cap, tipos] = capacidade(k);
  const it = itensDe(k);
  if (!it[id] && Object.keys(it).length >= tipos) return 0;
  return Math.max(0, cap - total(it));
}
function por(k: string, i: ItemStack): number {
  if (!simples(i)) return 0;
  const n = Math.min(i.amount, cabe(k, i.typeId));
  if (n <= 0) return 0;
  const it = itensDe(k);
  it[i.typeId] = (it[i.typeId] ?? 0) + n;
  sujar();
  return n;
}
function tirarDe(k: string, id: string, quer: number): number {
  const it = itensDe(k);
  const n = Math.min(quer, it[id] ?? 0);
  if (n <= 0) return 0;
  it[id] -= n;
  if (!it[id]) delete it[id];
  sujar();
  return n;
}
const freqDe = (b: Block): Freq | undefined => ler<Freq | undefined>("mkqf", b, undefined);
const freqItem = (i: ItemStack): Freq | undefined => {
  try {
    return JSON.parse((i.getDynamicProperty("mkqf") as string | undefined) ?? "null") as Freq | undefined;
  } catch {
    return undefined;
  }
};

// ---------- Telas ----------
async function escolherFreq(j: Player, atual?: Freq): Promise<Freq | undefined | null> {
  const r = await new ModalFormData().title({ translate: "cl.mkl.freq.titulo" })
    .textField({ translate: "cl.mkl.freq.nome" }, "Base", { defaultValue: atual?.nome ?? "" })
    .toggle({ translate: "cl.mkl.freq.privada" }, { defaultValue: !!atual && !atual.k.startsWith("*|") }).show(j);
  if (r.canceled || !r.formValues) return null;
  const [nome, privada] = r.formValues.filter((x) => x !== undefined) as [string, boolean];
  const n = nome.trim().slice(0, 24);
  return n ? { k: privada ? `${j.id}|${n}` : `*|${n}`, nome: n } : undefined;
}
async function painel(j: Player, f: Freq, busca = ""): Promise<void> {
  const it = itensDe(f.k);
  const [cap, tipos] = capacidade(f.k);
  const fmt = (n: number) => n.toLocaleString("pt-BR");
  const lista = Object.entries(it).filter(([id]) => !busca || id.includes(busca.toLowerCase())).sort((a, b) => b[1] - a[1]).slice(0, 60);
  const form = new ActionFormData().title({ translate: "cl.mkqio.titulo", with: [f.nome] })
    .body({ translate: "cl.mkqio.corpo", with: [fmt(total(it)), fmt(cap), String(Object.keys(it).length), String(tipos)] })
    .button({ translate: "cl.mkqio.guardar" }).button({ translate: "cl.mkqio.procurar" });
  for (const [id, n] of lista) form.button({ rawtext: [nomeDe(id), { text: ` §8×${fmt(n)}` }] });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  const c = j.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  if (r.selection === 0) {
    let n = 0, cheia = false;
    for (let s = 9; s < c.size; s++) { // a barra de baixo fica
      const i = c.getItem(s);
      if (!i) continue;
      const foi = por(f.k, i);
      if (foi < i.amount && simples(i)) cheia = true;
      if (!foi) continue;
      n += foi;
      if (foi >= i.amount) c.setItem(s, undefined);
      else (i.amount -= foi), c.setItem(s, i);
    }
    if (n) registrarAcao(j, "mk_qio");
    aviso(j, cheia ? "cl.mkqio.cheia" : { translate: "cl.mkqio.guardou", with: [fmt(n)] }, 3);
    return;
  }
  if (r.selection === 1) {
    const q = await new ModalFormData().title({ translate: "cl.mkqio.procurar" }).textField({ translate: "cl.mkqio.busca" }, "iron").show(j);
    if (q.canceled || !q.formValues) return;
    return painel(j, f, String(q.formValues.find((x) => x !== undefined) ?? ""));
  }
  const [id] = lista[r.selection - 2];
  let pilha = 64;
  try {
    pilha = new ItemStack(id, 1).maxAmount;
  } catch {
    // padrão
  }
  const n = tirarDe(f.k, id, pilha);
  if (!n) return;
  const sobra = c.addItem(new ItemStack(id, n));
  if (sobra) {
    const volta = por(f.k, sobra);
    if (volta < sobra.amount) j.dimension.spawnItem(new ItemStack(id, sobra.amount - volta), j.location);
  }
  return painel(j, f, busca);
}

// ---------- Importador e Exportador ----------
const DIRS: Readonly<Record<string, Vector3>> = { north: { x: 0, y: 0, z: -1 }, south: { x: 0, y: 0, z: 1 }, east: { x: 1, y: 0, z: 0 }, west: { x: -1, y: 0, z: 0 } };
function tras(b: Block): Container | undefined {
  let d = "north";
  try {
    d = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string;
  } catch {
    // sem direção
  }
  const v = DIRS[d] ?? DIRS.north;
  try {
    return inv(b.offset({ x: -v.x, y: 0, z: -v.z }));
  } catch {
    return undefined;
  }
}
const filtroDe = (b: Block) => ler<string[]>("mkqfil", b, []);
function importar(b: Block): void {
  const f = freqDe(b), c = tras(b);
  if (!f || !c) return;
  const fil = filtroDe(b);
  for (let s = 0; s < c.size; s++) {
    const i = c.getItem(s);
    if (!i || (fil.length && !fil.includes(i.typeId))) continue;
    const n = por(f.k, i);
    if (!n) continue;
    if (n >= i.amount) c.setItem(s, undefined);
    else (i.amount -= n), c.setItem(s, i);
    return;
  }
}
function exportar(b: Block): void {
  const f = freqDe(b), c = tras(b);
  if (!f || !c) return;
  const it = itensDe(f.k);
  for (const id of filtroDe(b).length ? filtroDe(b) : Object.keys(it)) {
    if (!(it[id] > 0)) continue;
    const n = tirarDe(f.k, id, 64);
    const sobra = c.addItem(new ItemStack(id, n));
    if (sobra) {
      const o = itensDe(f.k);
      o[id] = (o[id] ?? 0) + sobra.amount;
    }
    if (!sobra || sobra.amount < n) return;
  }
}

export const qioComp: BlockCustomComponent = {
  onTick({ block: b }) {
    if (b.typeId === IMP) importar(b);
    else if (b.typeId === EXP) exportar(b);
  },
  onPlayerInteract({ block: b, player: j }) {
    if (!j) return;
    const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
    if (j.isSneaking && b.typeId !== MATRIZ) {
      return abrirUmMenu(j, async () => {
        const nova = await escolherFreq(j, freqDe(b));
        if (nova === null || !b.isValid) return;
        gravar("mkqf", b, nova);
        if ((b.typeId === IMP || b.typeId === EXP || b.typeId === RED) && nova) {
          const r = await new ModalFormData().title({ translate: `tile.${b.typeId}.name` }).textField({ translate: "cl.mkqio.filtro" }, "minecraft:iron_ingot", { defaultValue: filtroDe(b).join(", ") }).show(j);
          if (!r.canceled && r.formValues) {
            const lista = String(r.formValues.find((x) => x !== undefined) ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).map((x) => (x.includes(":") ? x : `minecraft:${x}`));
            gravar("mkqfil", b, lista);
          }
        }
      });
    }
    if (b.typeId === MATRIZ) {
      const m = (arr()[posK(b)] ??= { d: [] });
      if (j.isSneaking && !mao) {
        // agachado de mão vazia: frequência
        return abrirUmMenu(j, async () => {
          const nova = await escolherFreq(j, m.k ? { k: m.k, nome: m.k.slice(m.k.indexOf("|") + 1) } : undefined);
          if (nova === null) return;
          m.k = nova?.k;
          gravar("mkqf", b, nova);
          sujar();
        });
      }
      if (mao && DISCO[mao.typeId] && m.d.length < 12) {
        m.d.push(mao.typeId);
        if (j.getGameMode() !== GameMode.Creative) {
          const c = j.getComponent("minecraft:inventory")!.container!;
          if (mao.amount > 1) (mao.amount--, c.setItem(j.selectedSlotIndex, mao));
          else c.setItem(j.selectedSlotIndex, undefined);
        }
        sujar();
      } else if (j.isSneaking && m.d.length) {
        const d = m.d.pop()!;
        j.getComponent("minecraft:inventory")?.container?.addItem(new ItemStack(d, 1));
        sujar();
      }
      return aviso(j, { translate: "cl.mkqio.matriz", with: [String(m.d.length)] }, 4);
    }
    const f = freqDe(b);
    if (!f) return aviso(j, "cl.mkqio.sem_freq", 4);
    if (b.typeId === PAINEL) return abrirUmMenu(j, () => painel(j, f));
    if (b.typeId === IMP) return aviso(j, "cl.mkqio.importador", 4);
    if (b.typeId === EXP) return aviso(j, "cl.mkqio.exportador", 4);
    if (b.typeId === RED) {
      const fil = filtroDe(b);
      const n = fil.length ? fil.reduce((s, id) => s + (itensDe(f.k)[id] ?? 0), 0) : total(itensDe(f.k));
      return aviso(j, { rawtext: [{ translate: "cl.mkqio.redstone" }, { text: ` ${n.toLocaleString("pt-BR")}` }] }, 6);
    }
  },
};

export function registrarQio(): void {
  registrarDetalhe([MATRIZ, PAINEL, IMP, EXP, RED], (b): RawMessage | undefined => {
    if (b.typeId === MATRIZ) return { translate: "cl.mkqio.matriz", with: [String(arr()[posK(b)]?.d.length ?? 0)] };
    const f = freqDe(b);
    return f ? { text: f.nome } : { translate: "cl.mkl.freq.nenhuma" };
  });
  // A matriz quebrada devolve os discos.
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== MATRIZ) return;
    const k = posK(block);
    for (const d of arr()[k]?.d ?? []) block.dimension.spawnItem(new ItemStack(d, 1), block.center());
    delete arr()[k];
    sujar();
  });
  // Painel Portátil: agachado escolhe a frequência; usar abre o painel.
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    if (i.typeId !== PORTATIL) return;
    abrirUmMenu(j, async () => {
      const f = freqItem(i);
      if (j.isSneaking || !f) {
        const nova = await escolherFreq(j, f);
        if (nova === null) return;
        const eq = j.getComponent("minecraft:inventory")?.container;
        const mao = eq?.getItem(j.selectedSlotIndex);
        if (!eq || mao?.typeId !== PORTATIL) return;
        mao.setDynamicProperty("mkqf", nova ? JSON.stringify(nova) : undefined);
        mao.setLore(nova ? [`§7${nova.nome}`] : []);
        eq.setItem(j.selectedSlotIndex, mao);
        return;
      }
      await painel(j, f);
    });
  });
  // Teste: scriptevent cl:teste_qio <freq <nome>|disco <id>|ver> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_qio" || !(j instanceof Player)) return;
    const p = message.split(" ");
    const [x, y, z] = p.slice(-3).map(Number);
    const b = j.dimension.getBlock({ x, y, z });
    if (!b) return;
    if (p[0] === "freq") {
      const f = { k: `*|${p[1]}`, nome: p[1] };
      gravar("mkqf", b, f);
      if (b.typeId === MATRIZ) (arr()[posK(b)] ??= { d: [] }).k = f.k;
      sujar();
    }
    if (p[0] === "disco") (arr()[posK(b)] ??= { d: [] }).d.push(p[1]), sujar();
    if (p[0] === "filtro") gravar("mkqfil", b, [p[1]]);
    const f = freqDe(b);
    console.warn(`[teste_qio] ${b.typeId} f=${f?.k} itens=${f ? JSON.stringify(itensDe(f.k)) : "-"} cap=${f ? capacidade(f.k) : "-"}`);
  });
}

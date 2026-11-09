import { Block, BlockCustomComponent, BlockVolume, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F39 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rf, rfPorTick } from "../util/energia.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { contar, entrada, entregar, gastarCE, primeiro, saida, tirar } from "../util/maquina.js";
import { consumir, gerar, registrarArmazem } from "../util/rede.js";
import { toqueNovo } from "../util/toque.js";
import { ceuAberto, produzir, solAlto } from "./mekanism_extra.js";

/*
 * Powah! (1.18.0), com os números do código do mod (owmii/Powah): 7 níveis de cada gerador, célula e cabo.
 * - Furnator: queima combustível de fornalha (o baú em cima ou toque com ele): 30 RF por tick de queima, gerando no
 *   ritmo do nível (15 a 4.800 RF/t).
 * - Magmator: lava (balde: 100.000 RF), no mesmo ritmo do Furnator.
 * - Termogerador: calor embaixo (lava 1.000, magma 800, Bloco de Cristal Ardente 2.800) × água; gera nível × calor /
 *   1.000 e gasta 1 mB de água por tick (tanque de 4 baldes; uma fonte de água encostada não acaba).
 * - Painel Solar: de dia, com céu aberto.
 * - Células e cabos entram na rede de energia (util/rede.ts e os condutos em condutos.ts).
 * - Orbe Energizador: até 6 itens dentro; as Hastes Energizadoras a até 4 blocos, ligadas à energia, mandam RF para
 *   ele no ritmo do nível delas (10 a 3.000 RF/t) até a receita ficar pronta (aço energizado, cristais).
 * Os geradores rodam a cada 5 s (o ciclo da rede); o Orbe, a cada segundo.
 */
const D = DADOS_F39;
const nivelDe = (id: string): number => D.niveis.indexOf(id.slice(id.lastIndexOf("_") + 1) as never);
const nomeNivel = (id: string): string => `cl.pw.nivel.${id.slice(id.lastIndexOf("_") + 1)}`;
const QUEIMA: Readonly<Record<string, number>> = D.queima;
function queimaDe(id: string): number {
  if (QUEIMA[id]) return QUEIMA[id];
  if (id.endsWith("_planks")) return QUEIMA["#planks"];
  if (id.endsWith("_log") || id.endsWith("_wood") || id.endsWith("_stem")) return QUEIMA["#logs"];
  return 0;
}
const CALOR: Readonly<Record<string, number>> = D.calor;
const TANQUE = 4000; // mB de água do Termogerador
const MAX_GUARDA = 64 * 12; // E de combustível guardado no Furnator (64 carvões)

const ultimo = new Map<string, number>(); // E/ciclo gerados por último (para o toque e o "o que estou olhando")
const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
const agora = (b: Block): string => {
  const n = ultimo.get(chave(b)) ?? 0;
  return n > 0 ? rfPorTick(n) : "—";
};
/** Gera `n` E (fração guardada entre os ciclos); devolve se pôde (há bateria ou célula com espaço). */
function gerarAgora(b: Block, n: number): boolean {
  ultimo.set(chave(b), n);
  if (n <= 0) return false;
  const foi = produzir(b, n);
  return foi > 0 || n < 1;
}
function creditar(b: Block, acao: "pw_termo"): void {
  const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
  if (j) registrarAcao(j, acao);
}
const status = (j: Player | undefined, chaveTexto: string, b: Block, extra: string) =>
  j && aviso(j, { translate: chaveTexto, with: { rawtext: [{ translate: nomeNivel(b.typeId) }, { text: agora(b) }, { text: extra }] } }, 5);

// ---------- Furnator e Magmator ----------
function geradorDeCombustivel(tipo: "furnator" | "magmator"): BlockCustomComponent {
  const ritmo = tipo === "furnator" ? D.furnator : D.magmator;
  const valor = (id: string): number => (tipo === "furnator" ? queimaDe(id) * D.porTickQueima : id === "minecraft:lava_bucket" ? D.lavaPorBalde : 0);
  return {
    onTick(e) {
      const b = e.block;
      const quer = ritmo[nivelDe(b.typeId)] ?? 0;
      let guardado = ler<number>("pw_comb", b, 0);
      if (guardado < quer) {
        const ent = entrada(b);
        const c = ent && primeiro(ent, (id) => valor(id) > 0);
        if (c && ent) {
          tirar(ent, c.typeId);
          if (c.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
          guardado += valor(c.typeId);
        }
      }
      const n = Math.min(quer, guardado);
      if (gerarAgora(b, n)) guardado -= n;
      gravar("pw_comb", b, guardado);
    },
    onPlayerInteract(e) {
      const b = e.block, j = e.player;
      if (!j) return;
      const mao = itemNaMao(j);
      const v = mao ? valor(mao.typeId) : 0;
      const guardado = ler<number>("pw_comb", b, 0);
      if (v > 0 && guardado + v <= MAX_GUARDA) {
        gastarDaMao(j);
        if (mao?.typeId === "minecraft:lava_bucket") darAoJogador(j, "minecraft:bucket", 1);
        gravar("pw_comb", b, guardado + v);
      }
      status(j, tipo === "furnator" ? "cl.pw.furnator" : "cl.pw.magmator", b, rf(ler<number>("pw_comb", b, 0)));
    },
  };
}
export const furnator = geradorDeCombustivel("furnator");
export const magmator = geradorDeCombustivel("magmator");

// ---------- Termogerador ----------
const fonteDeAgua = (b: Block): boolean => {
  for (const v of [b.north(), b.south(), b.east(), b.west()]) if (v?.typeId === "minecraft:water" && v.permutation.getState("liquid_depth" as never) === 0) return true;
  return false;
};
export const termogerador: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const calor = CALOR[b.below()?.typeId ?? ""] ?? 0;
    let agua = ler<number>("pw_agua", b, 0);
    if (agua < TANQUE - 1000) {
      const ent = entrada(b);
      if (ent && primeiro(ent, (id) => id === "minecraft:water_bucket")) {
        tirar(ent, "minecraft:water_bucket");
        entregar(b, [new ItemStack("minecraft:bucket", 1)]);
        agua += 1000;
      }
    }
    const infinita = fonteDeAgua(b);
    const n = calor > 0 && (infinita || agua >= 100) ? ((D.termogerador[nivelDe(b.typeId)] ?? 0) * calor) / 1000 : 0;
    if (gerarAgora(b, n)) {
      if (!infinita) agua -= 100;
      creditar(b, "pw_termo");
    }
    gravar("pw_agua", b, agua);
  },
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const agua = ler<number>("pw_agua", b, 0);
    if (itemNaMao(j)?.typeId === "minecraft:water_bucket" && agua <= TANQUE - 1000) {
      gastarDaMao(j);
      darAoJogador(j, "minecraft:bucket", 1);
      gravar("pw_agua", b, agua + 1000);
    }
    status(j, "cl.pw.termo", b, String(fonteDeAgua(b) ? "∞" : ler<number>("pw_agua", b, 0)));
  },
};

// ---------- Painel Solar ----------
export const painelSolar: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    gerarAgora(b, solAlto() && ceuAberto(b) ? (D.solar[nivelDe(b.typeId)] ?? 0) : 0);
  },
  onPlayerInteract(e) {
    if (e.player) status(e.player, "cl.pw.solar", e.block, "");
  },
};

// ---------- Orbe Energizador ----------
type Orbe = { itens: string[]; e: number; saida?: [string, number] };
const RECEITAS = D.energizar as ReadonlyArray<{ entradas: readonly string[]; e: number; resultado: string; qtd: number }>;
const HASTES = D.niveis.map((n) => `cl:haste_energizadora_${n}`);
const igual = (a: readonly string[], b: readonly string[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();
const receitaDe = (itens: readonly string[]) => RECEITAS.find((r) => igual(r.entradas, itens));
const lerOrbe = (b: Block): Orbe => ler<Orbe>("pw_orbe", b, { itens: [], e: 0 });
function hastesPerto(b: Block): Block[] {
  const r = D.alcanceOrbe;
  const achadas: Block[] = [];
  try {
    const lista = b.dimension.getBlocks(new BlockVolume({ x: b.x - r, y: b.y - r, z: b.z - r }, { x: b.x + r, y: b.y + r, z: b.z + r }), { includeTypes: HASTES }, true);
    for (const p of lista.getBlockLocationIterator()) {
      const h = b.dimension.getBlock(p);
      if (h) achadas.push(h);
    }
  } catch {
    // fora da área carregada
  }
  return achadas;
}
export const orbe: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const o = lerOrbe(b);
    if (o.saida || !o.itens.length) return;
    const r = receitaDe(o.itens);
    if (!r) return;
    let ganho = 0;
    for (const h of hastesPerto(b)) {
      const porSegundo = D.hastes[nivelDe(h.typeId)] ?? 0;
      if (porSegundo > 0 && gastarCE(h, Math.max(1, Math.round(porSegundo * 100)))) {
        ganho += porSegundo;
        b.dimension.spawnParticle("minecraft:basic_crit_particle", { x: h.x + 0.5, y: h.y + 0.9, z: h.z + 0.5 });
      }
    }
    if (!ganho) return;
    o.e += ganho;
    if (o.e >= r.e) {
      o.saida = [r.resultado, r.qtd];
      o.itens = [];
      o.e = 0;
      b.dimension.playSound("random.orb", b.center());
      b.dimension.spawnParticle("minecraft:totem_particle", { x: b.x + 0.5, y: b.y + 0.7, z: b.z + 0.5 });
    }
    gravar("pw_orbe", b, o);
  },
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const o = lerOrbe(b);
    const mao = itemNaMao(j);
    if (o.saida) {
      if (!mao) {
        darAoJogador(j, o.saida[0], o.saida[1]);
        registrarAcao(j, "energizar");
        if (o.saida[0] === "cl:aco_energizado") registrarAcao(j, "aco_energizado");
        gravar("pw_orbe", b, { itens: [], e: 0 });
      } else aviso(j, "cl.pw.orbe_pronto", 3);
      return;
    }
    if (mao && o.itens.length < 6) {
      o.itens.push(mao.typeId);
      gastarDaMao(j);
      o.e = 0;
      gravar("pw_orbe", b, o);
    } else if (!mao && o.itens.length) {
      for (const id of o.itens) darAoJogador(j, id, 1);
      gravar("pw_orbe", b, { itens: [], e: 0 });
      return;
    }
    const r = receitaDe(o.itens);
    const hastes = hastesPerto(b).length;
    if (!o.itens.length) aviso(j, { translate: "cl.pw.orbe", with: { rawtext: [{ translate: "cl.pw.orbe_vazio" }, { text: "-" }, { text: "-" }, { text: String(hastes) }] } }, 5);
    else if (!r) aviso(j, "cl.pw.orbe_sem_receita", 4);
    else aviso(j, { translate: "cl.pw.orbe", with: { rawtext: [{ translate: new ItemStack(r.resultado).localizationKey }, { text: rf(o.e) }, { text: rf(r.e) }, { text: String(hastes) }] } }, 5);
  },
};

export function registrarPowah(): void {
  const geradores = [
    ...D.niveis.map((n) => `cl:furnator_${n}`), ...D.niveis.map((n) => `cl:magmator_${n}`),
    ...D.niveis.map((n) => `cl:termogerador_${n}`), ...D.niveis.map((n) => `cl:painel_solar_${n}`),
  ];
  registrarDetalhe(geradores, (b) => ({ translate: "cl.pw.gerando", with: [agora(b)] }));
  registrarDetalhe("cl:orbe_energizador", (b) => {
    const o = lerOrbe(b);
    return o.saida ? { translate: "cl.pw.orbe_pronto" } : o.itens.length ? { text: `${o.itens.length}/6 · ${rf(o.e)}` } : undefined;
  });
  // No Catálogo: as receitas do Orbe.
  registrarNoCatalogo(() =>
    RECEITAS.map((r): Receita => ({
      maquina: { translate: "tile.cl:orbe_energizador.name" }, maquinaId: "cl:orbe_energizador",
      entradas: r.entradas.map((item) => ({ item, qtd: 1 })), saidas: [{ item: r.resultado, qtd: r.qtd }], nota: { text: rf(r.e) },
    })),
  );
}

// =====================================================================================================================
// 1.19.0: o resto do Powah! (reator, rede Ender, baterias, funil, descarregador, transmissor, cartões, pérolas, lente,
// bola de neve carregada, chave e livro).
// =====================================================================================================================
const nivelNome = (id: string) => id.slice(id.lastIndexOf("_") + 1);

/** Tira da rede até `max` E (inteiros, o que houver). */
function tirarDaRede(b: Block, max: number): number {
  let n = 0;
  while (n + 1 <= max && consumir(b, 1)) n++;
  return n;
}

// ---------- Baterias (itens com energia guardada) ----------
const ehBateria = (id: string | undefined): boolean => !!id?.startsWith("cl:bateria_pw_");
const capBateria = (i: ItemStack): number => D.bateria[nivelDe(i.typeId)] ?? 0;
const cargaBateria = (i: ItemStack): number => (i.getDynamicProperty("pw_e") as number | undefined) ?? 0;
function carregarBateria(i: ItemStack, e: number): void {
  i.setDynamicProperty("pw_e", e);
  i.setLore([`§7${rf(e)} / ${rf(capBateria(i))}`]);
}

// ---------- Funil de Energia e Descarregador (baterias num baú) ----------
export const funil: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const c = saida(b);
    if (!c) return;
    let falta = D.funilPorSegundo[nivelDe(b.typeId)] ?? 0;
    for (let s = 0; s < c.size && falta > 0.001; s++) {
      const i = c.getItem(s);
      if (!i || !ehBateria(i.typeId)) continue;
      const veio = tirarDaRede(b, Math.min(falta, capBateria(i) - cargaBateria(i)));
      if (!veio) return;
      carregarBateria(i, cargaBateria(i) + veio);
      c.setItem(s, i);
      falta -= veio;
      if (cargaBateria(i) >= capBateria(i)) creditarAcao(b, "bateria");
    }
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, { translate: "cl.pw.funil", with: [rf(D.funilPorSegundo[nivelDe(e.block.typeId)] ?? 0)] }, 4);
  },
};
export const descarregador: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const c = entrada(b);
    if (!c) return;
    let falta = Math.floor(D.descarregadorPorSegundo[nivelDe(b.typeId)] ?? 0);
    for (let s = 0; s < c.size && falta > 0; s++) {
      const i = c.getItem(s);
      if (!i || !ehBateria(i.typeId)) continue;
      const n = Math.min(falta, Math.floor(cargaBateria(i)));
      if (n <= 0) continue;
      const foi = gerar(b, n);
      if (!foi) return;
      carregarBateria(i, cargaBateria(i) - foi);
      c.setItem(s, i);
      falta -= foi;
    }
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, { translate: "cl.pw.descarregador", with: [rf(D.descarregadorPorSegundo[nivelDe(e.block.typeId)] ?? 0)] }, 4);
  },
};

// ---------- Transmissor de Jogador e Cartões de Vínculo ----------
type Vinculo = { id: string; nome: string; dim: boolean };
export const transmissor: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const v = ler<Vinculo | undefined>("pw_vinculo", b, undefined);
    if (!v) return;
    const j = world.getPlayers().find((p) => p.id === v.id);
    if (!j || (!v.dim && j.dimension.id !== b.dimension.id)) return;
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) return;
    let falta = D.transmissorPorSegundo[nivelDe(b.typeId)] ?? 0;
    for (let s = 0; s < inv.size && falta > 0.001; s++) {
      const i = inv.getItem(s);
      if (!i || !ehBateria(i.typeId)) continue;
      const veio = tirarDaRede(b, Math.min(falta, capBateria(i) - cargaBateria(i)));
      if (!veio) return;
      carregarBateria(i, cargaBateria(i) + veio);
      inv.setItem(s, i);
      falta -= veio;
      if (cargaBateria(i) >= capBateria(i)) registrarAcao(j, "bateria");
    }
  },
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const mao = itemNaMao(j);
    if (mao && (mao.typeId === "cl:cartao_vinculo" || mao.typeId === "cl:cartao_vinculo_dimensional")) {
      const id = mao.getDynamicProperty("pw_dono") as string | undefined;
      if (id) gravar("pw_vinculo", b, { id, nome: (mao.getDynamicProperty("pw_nome") as string) ?? "?", dim: mao.typeId.endsWith("dimensional") });
    }
    const v = ler<Vinculo | undefined>("pw_vinculo", b, undefined);
    aviso(j, { translate: "cl.pw.transmissor", with: { rawtext: [v ? { text: v.nome } : { translate: "cl.pw.transmissor_vazio" }, { text: rf(D.transmissorPorSegundo[nivelDe(b.typeId)] ?? 0) }] } }, 4);
  },
};

// ---------- Rede Ender (Célula Ender e Portão Ender) ----------
// Cada dono tem canais (a Célula/Portão do nível dá acesso a até N canais); a energia fica no canal, então tudo que
// estiver no mesmo canal (do mesmo dono) divide a mesma carga, em qualquer lugar e dimensão. A capacidade do canal é a
// soma das Células de Energia (Powah) postas dentro das Células Ender dele (como no mod).
type Canal = { e: number; cap: number };
const PROP_ENDER = "cl:pw_ender";
let canais: Record<string, Canal> | undefined;
const lerCanais = (): Record<string, Canal> => {
  if (!canais) {
    try {
      canais = JSON.parse((world.getDynamicProperty(PROP_ENDER) as string) ?? "{}") as Record<string, Canal>;
    } catch {
      canais = {};
    }
  }
  return canais;
};
let salvarDepois = false;
const salvarCanais = () => {
  if (salvarDepois) return;
  salvarDepois = true;
  system.run(() => {
    salvarDepois = false;
    world.setDynamicProperty(PROP_ENDER, JSON.stringify(lerCanais()));
  });
};
type Ender = { dono: string; canal: number; cells?: string[] };
const lerEnder = (b: Block): Ender | undefined => ler<Ender | undefined>("pw_ender", b, undefined);
const chaveCanal = (x: Ender) => `${x.dono}|${x.canal}`;
const canalDe = (b: Block): Canal => {
  const x = lerEnder(b);
  if (!x) return { e: 0, cap: 0 };
  const c = lerCanais();
  return (c[chaveCanal(x)] ??= { e: 0, cap: 0 });
};
const ENDER = D.niveis.flatMap((n) => [`cl:celula_ender_${n}`, `cl:portao_ender_${n}`]);
const CAP_CELULA: Readonly<Record<string, number>> = D.celulas;
export const ender: BlockCustomComponent = {
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const x = lerEnder(b) ?? { dono: j.id, canal: 0 };
    const mao = itemNaMao(j);
    const ehCelula = b.typeId.startsWith("cl:celula_ender_");
    if (ehCelula && mao && CAP_CELULA[mao.typeId]) {
      const c = lerCanais();
      (c[chaveCanal(x)] ??= { e: 0, cap: 0 }).cap += CAP_CELULA[mao.typeId];
      x.cells = [...(x.cells ?? []), mao.typeId];
      gastarDaMao(j);
      salvarCanais();
    } else if (!mao) {
      x.canal = (x.canal + 1) % (D.enderCanais[nivelDe(b.typeId)] ?? 1);
      registrarAcao(j, "ender_canal");
    }
    gravar("pw_ender", b, x);
    const c = canalDe(b);
    aviso(j, { translate: "cl.pw.ender", with: { rawtext: [{ translate: new ItemStack(b.typeId).localizationKey }, { text: String(x.canal + 1) }, { text: String(D.enderCanais[nivelDe(b.typeId)] ?? 1) }, { text: rf(c.e) }, { text: rf(c.cap) }] } }, 5);
  },
};

// ---------- Reator (multibloco 3×3×4) ----------
type Reator = { combustivel: number; carbono: number; redstone: number; frio: number; frioTemp: number; temp: number; agua: boolean; base: number };
const REATOR0: Reator = { combustivel: 0, carbono: 0, redstone: 0, frio: 0, frioTemp: 0, temp: 0, agua: false, base: 0 };
const RESFRIA: Readonly<Record<string, readonly [number, number]>> = D.resfriadores as never;
const posicoesReator = (b: Block) => {
  const l: Array<{ x: number; y: number; z: number }> = [];
  for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 3; dy++) for (let dz = -1; dz <= 1; dz++) l.push({ x: b.x + dx, y: b.y + dy, z: b.z + dz });
  return l;
};
const nucleoDe = (b: Block): Block | undefined => {
  if (b.permutation.getState("cl:parte" as never) !== true) return b;
  const n = ler<{ x: number; y: number; z: number } | undefined>("pw_nucleo", b, undefined);
  return n ? b.dimension.getBlock(n) : undefined;
};
function montarReator(j: Player, b: Block): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const criativo = j.getGameMode() === GameMode.Creative;
  const livre = posicoesReator(b).every((p) => (p.x === b.x && p.y === b.y && p.z === b.z) || b.dimension.getBlock(p)?.isAir);
  if (!inv || !livre || (!criativo && contar(inv, b.typeId) < 35)) {
    aviso(j, { translate: "cl.pw.reator_montar", with: { rawtext: [{ translate: nomeNivel(b.typeId) }] } }, 6);
    return;
  }
  if (!criativo) tirar(inv, b.typeId, 35);
  const parte = b.permutation.withState("cl:parte" as never, true as never);
  for (const p of posicoesReator(b)) {
    if (p.x === b.x && p.y === b.y && p.z === b.z) continue;
    const pb = b.dimension.getBlock(p);
    if (!pb) continue;
    pb.setPermutation(parte);
    gravar("pw_nucleo", pb, { x: b.x, y: b.y, z: b.z });
  }
  gravar("pw_reator", b, { ...REATOR0 });
  aviso(j, "cl.pw.reator_montado", 3);
}
function demolirReator(dim: Block["dimension"], nucleo: { x: number; y: number; z: number }, id: string): void {
  const b = dim.getBlock(nucleo);
  const r = b ? ler<Reator | undefined>("pw_reator", b, undefined) : undefined;
  let n = 0;
  for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 3; dy++) for (let dz = -1; dz <= 1; dz++) {
    const pb = dim.getBlock({ x: nucleo.x + dx, y: nucleo.y + dy, z: nucleo.z + dz });
    if (pb?.typeId === id) {
      pb.setType("minecraft:air");
      n++;
    }
  }
  const centro = { x: nucleo.x + 0.5, y: nucleo.y + 1, z: nucleo.z + 0.5 };
  dim.spawnItem(new ItemStack(id, Math.min(64, n + 1)), centro);
  if (n + 1 > 64) dim.spawnItem(new ItemStack(id, n + 1 - 64), centro);
  const ur = Math.floor((r?.combustivel ?? 0) / 100);
  if (ur > 0) dim.spawnItem(new ItemStack("cl:uraninita", ur), centro);
}
/** Coloca um item no reator (do toque ou do baú embaixo). Devolve se aceitou. */
function porNoReator(r: Reator, id: string): boolean {
  if (id === "cl:uraninita" && r.combustivel <= 900) {
    r.combustivel += 100;
    r.base = 700;
    return true;
  }
  if (r.carbono <= 0 && queimaDe(id) > 0) {
    r.carbono = queimaDe(id);
    return true;
  }
  if (r.redstone <= 0 && (id === "minecraft:redstone" || id === "minecraft:redstone_block")) {
    r.redstone = id === "minecraft:redstone" ? 18 : 162;
    return true;
  }
  if (r.frio <= 0 && RESFRIA[id]) {
    [r.frio, r.frioTemp] = RESFRIA[id];
    return true;
  }
  return false;
}
export const reator: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    if (b.permutation.getState("cl:parte" as never) === true) return;
    const r = ler<Reator | undefined>("pw_reator", b, undefined);
    if (!r) return; // núcleo sozinho, ainda não montado
    const c = saida(b);
    if (c) for (let s = 0; s < c.size; s++) {
      const i = c.getItem(s);
      if (i && porNoReator(r, i.typeId)) tirar(c, i.typeId);
    }
    const k = nivelDe(b.typeId);
    // Um segundo (20 ticks) do ReactorTile do mod de uma vez.
    const temRed = r.redstone > 0, temCarb = r.carbono > 0;
    let alvo = Math.min(r.base * (r.combustivel > 0 ? 1 : 0) + (temCarb ? 180 : 0) + (temRed ? 120 : 0), 1000);
    if (r.agua) alvo /= Math.abs(-1 + (r.frio > 0 ? r.frioTemp : 0)) + 1;
    if (r.temp < alvo) r.temp = Math.min(alvo, r.temp + 20);
    else if (r.temp > alvo) r.temp = Math.max(alvo, r.temp - 20 / (r.agua ? (r.frio > 0 ? 1 : 3) : 5));
    const calc = (r.temp / 1000) * 0.98 / 2 * (temRed ? 1.4 : 1);
    const porTick = (1 - calc) * Math.floor(r.combustivel / 100) * (D.reator[k] ?? 0) * (temCarb ? 1.2 : 1) * (temRed ? 1.4 : 1);
    const n = (porTick * 20) / 4000;
    if (r.combustivel > 0 && gerarAgora(b, n)) {
      r.combustivel = Math.max(0, r.combustivel - 20 * (1 + k * 0.25) * calc);
      if (temCarb) r.carbono = Math.max(0, r.carbono - 20);
      if (temRed) r.redstone = Math.max(0, r.redstone - 0.5);
      if (r.frio > 0 && r.agua) r.frio = Math.max(0, r.frio - 0.5);
      creditarAcao(b, "pw_reator");
    } else ultimo.set(chave(b), 0);
    if (r.combustivel <= 0) r.base = 0;
    gravar("pw_reator", b, r);
  },
  onPlayerInteract(e) {
    const j = e.player;
    const b = nucleoDe(e.block);
    if (!j || !b) return;
    const r = ler<Reator | undefined>("pw_reator", b, undefined);
    if (!r) return montarReator(j, b);
    const mao = itemNaMao(j);
    if (mao?.typeId === "minecraft:water_bucket" && !r.agua) {
      r.agua = true;
      gastarDaMao(j);
      darAoJogador(j, "minecraft:bucket", 1);
    } else if (mao && porNoReator(r, mao.typeId)) gastarDaMao(j);
    gravar("pw_reator", b, r);
    aviso(j, { translate: "cl.pw.reator", with: { rawtext: [{ translate: nomeNivel(b.typeId) }, { text: agora(b) }, { text: String(Math.round(r.combustivel)) }, { text: String(Math.round(r.temp)) }, { text: String(Math.round(r.carbono)) }, { text: String(Math.round(r.redstone)) }, { text: String(Math.round(r.frio)) }, { text: r.agua ? "✔" : "✘" }] } }, 6);
  },
};

function creditarAcao(b: Block, acao: "bateria" | "pw_reator"): void {
  const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
  if (j) registrarAcao(j, acao);
}

// ---------- Itens: cartões, pérolas, lente, bola de neve carregada, chave e livro ----------
const ZUMBIS = new Set(["minecraft:zombie", "minecraft:husk", "minecraft:zombie_villager_v2", "minecraft:zombie_villager"]);
const ENDERS = new Set(["minecraft:enderman", "minecraft:endermite"]);
const bolas = new Set<string>();

export function registrarPowahCompleto(): void {
  registrarArmazem(ENDER, {
    carga: (b) => canalDe(b).e,
    capacidade: (b) => canalDe(b).cap,
    mudar: (b, delta) => {
      canalDe(b).e = Math.max(0, canalDe(b).e + delta);
      salvarCanais();
    },
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player: j, block: b }) => {
    if (ENDER.includes(b.typeId)) gravar("pw_ender", b, { dono: j.id, canal: 0 });
    else if (b.typeId.startsWith("cl:reator_") && b.permutation.getState("cl:parte" as never) !== true) montarReator(j, b);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block: b, brokenBlockPermutation: p }) => {
    const id = p.type.id;
    if (id.startsWith("cl:reator_")) {
      const n = p.getState("cl:parte" as never) === true ? ler<{ x: number; y: number; z: number } | undefined>("pw_nucleo", b, undefined) : { x: b.x, y: b.y, z: b.z };
      if (n) demolirReator(b.dimension, n, id);
      else b.dimension.spawnItem(new ItemStack(id, 1), b.center());
    } else if (id.startsWith("cl:celula_ender_")) {
      const x = lerEnder(b);
      if (x?.cells?.length) {
        const c = lerCanais()[chaveCanal(x)];
        for (const cel of x.cells) {
          if (c) c.cap = Math.max(0, c.cap - (CAP_CELULA[cel] ?? 0));
          b.dimension.spawnItem(new ItemStack(cel, 1), b.center());
        }
        if (c) c.e = Math.min(c.e, c.cap);
        salvarCanais();
      }
    }
  });
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    if (i.typeId === "cl:cartao_vinculo" || i.typeId === "cl:cartao_vinculo_dimensional") {
      const inv = j.getComponent("minecraft:inventory")?.container;
      const mao = inv?.getItem(j.selectedSlotIndex);
      if (!inv || !mao) return;
      mao.setDynamicProperty("pw_dono", j.id);
      mao.setDynamicProperty("pw_nome", j.name);
      mao.setLore([`§7${j.name}`]);
      inv.setItem(j.selectedSlotIndex, mao);
      aviso(j, { translate: "cl.pw.cartao_vinculado", with: [j.name] }, 3);
    } else if (i.typeId === "cl:bola_neve_carregada") {
      if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      const v = j.getViewDirection();
      const h = j.getHeadLocation();
      try {
        const bola = j.dimension.spawnEntity("minecraft:snowball", { x: h.x + v.x, y: h.y + v.y, z: h.z + v.z });
        bola.getComponent("minecraft:projectile")?.shoot({ x: v.x * 1.5, y: v.y * 1.5, z: v.z * 1.5 });
        bolas.add(bola.id);
        registrarAcao(j, "raio");
      } catch {
        // fora da área carregada
      }
    } else if (i.typeId === "cl:livro_powah") {
      new ActionFormData().title({ translate: "item.cl:livro_powah.name" }).body({ translate: "cl.pw.livro" }).button({ translate: "gui.ok" }).show(j);
    } else if (ehBateria(i.typeId)) {
      aviso(j, { translate: "cl.pw.bateria", with: [rf(cargaBateria(i)), rf(capBateria(i))] }, 3);
    }
  });
  const raio = (id: string, dim: Block["dimension"], p: { x: number; y: number; z: number }) => {
    if (!bolas.delete(id)) return;
    try {
      dim.spawnEntity("minecraft:lightning_bolt", p);
    } catch {
      // fora da área carregada
    }
  };
  world.afterEvents.projectileHitBlock.subscribe((ev) => raio(ev.projectile.id, ev.dimension, ev.location));
  world.afterEvents.projectileHitEntity.subscribe((ev) => raio(ev.projectile.id, ev.dimension, ev.location));
  world.afterEvents.playerInteractWithEntity.subscribe(({ player: j, target, itemStack: i }) => {
    if (!i) return;
    let novo: string | undefined;
    if (i.typeId === "cl:perola_aerea" && ZUMBIS.has(target.typeId)) novo = "cl:perola_aerea_jogador";
    else if (i.typeId === "cl:painel_fotoeletrico" && ENDERS.has(target.typeId)) novo = "cl:lente_ender";
    else if (i.typeId === "cl:cartao_vinculo" && ENDERS.has(target.typeId)) novo = "cl:cartao_vinculo_dimensional";
    if (!novo) return;
    const dono = i.getDynamicProperty("pw_dono") as string | undefined, nome = i.getDynamicProperty("pw_nome") as string | undefined;
    gastarDaMao(j);
    const dado = new ItemStack(novo, 1);
    if (dono && novo === "cl:cartao_vinculo_dimensional") {
      dado.setDynamicProperty("pw_dono", dono);
      dado.setDynamicProperty("pw_nome", nome ?? "?");
      dado.setLore([`§7${nome ?? "?"}`]);
    }
    darAoJogador(j, dado);
    target.dimension.playSound("mob.endermen.death", target.location, { volume: 0.5 });
    target.remove();
  });
  // Chave do Powah: gira as máquinas do mod.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "cl:chave_powah" || !ev.block.typeId.startsWith("cl:") || !toqueNovo(ev)) return;
    const atual = ev.block.permutation.getState("minecraft:cardinal_direction" as never) as string | undefined;
    if (!atual) return;
    ev.cancel = true;
    const ordem = ["north", "east", "south", "west"];
    const b = ev.block;
    system.run(() => b.setPermutation(b.permutation.withState("minecraft:cardinal_direction" as never, ordem[(ordem.indexOf(atual) + 1) % 4] as never)));
  });
  registrarDetalhe(ENDER, (b) => ({ text: `${rf(canalDe(b).e)} / ${rf(canalDe(b).cap)}` }));
  registrarDetalhe(D.niveis.map((n) => `cl:reator_${n}`), (b) => {
    const nb = nucleoDe(b);
    return nb ? { translate: "cl.pw.gerando", with: [agora(nb)] } : undefined;
  });
}

import { Block, BlockCustomComponent, BlockVolume, ItemStack, Player, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { FOLHAS } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F26 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { feito, maquina } from "../maquinas/thermal.js";
import { capacidadeTanque, gravarOxigenio, LUA, oxigenioDe } from "./oxigenio.js";

/*
 * Máquinas do Galacticraft (1.6.0), no padrão das outras: baú em cima = entrada, baú embaixo = saída.
 * - Compressor: queima carvão (1 carvão = 1.600 ticks = 8 placas de 200 ticks) e faz as placas comprimidas
 *   (2 lingotes = 1 placa; placa de cobre + de estanho = de bronze; 3 de aço + 3 de alumínio + 3 de bronze =
 *   2 Placas Reforçadas). O Compressor Elétrico faz o mesmo com energia da rede.
 * - Fabricador de Circuitos: diamante + 2 silício + redstone + tocha de redstone = 3 Wafers Básicos (com
 *   repetidor = 1 Wafer Avançado), 300 ticks.
 * - Coletor de Oxigênio: guarda até 6.000. No planeta, 93 a cada 40 ticks (há ar); na Lua, 0,75 por folha ou
 *   plantação a até 5 blocos.
 * - Compressor de Oxigênio: puxa do Coletor encostado (até 1.200 guardados) e enche os tanques a 2 por tick.
 * - Carregador de Combustível: guarda 12.000 mB (Baldes de Combustível do BuildCraft) e abastece o foguete na
 *   plataforma encostada, a 2 mB por tick.
 * - Bancada da NASA: monta o Foguete Tier 1 pelo menu.
 */
type Linha = { entra: ReadonlyArray<[string, number]>; sai: [string, number] };
const PLACAS: Readonly<Record<string, string>> = DADOS_F26.placas;
export const RECEITAS_COMPRESSOR: ReadonlyArray<Linha> = [
  { entra: [["cl:placa_aco", 3], ["cl:placa_aluminio", 3], ["cl:placa_bronze", 3]], sai: ["cl:placa_reforcada", 2] },
  ...Object.entries(PLACAS).map(([lingote, placa]): Linha => ({ entra: [[lingote, 2]], sai: [placa, 1] })),
  { entra: [["cl:placa_cobre", 1], ["cl:placa_estanho", 1]], sai: ["cl:placa_bronze", 1] },
];
const COMBUSTIVEIS: Readonly<Record<string, number>> = { "minecraft:coal": 8, "minecraft:charcoal": 8, "minecraft:coal_block": 80 };
const quemPerto = (b: Block): Player | undefined => b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];

function comprimir(b: Block): Linha | undefined {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return undefined;
  return RECEITAS_COMPRESSOR.find((r) => r.entra.every(([id, n]) => contar(ent, id) >= n));
}
function terminar(b: Block, r: Linha): void {
  const ent = entrada(b)!;
  for (const [id, n] of r.entra) tirar(ent, id, n);
  entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
  feito(b, "random.anvil_land");
  if (r.sai[0] === "cl:placa_reforcada") {
    const j = quemPerto(b);
    if (j) registrarAcao(j, "placa_reforcada");
  }
}

export const compressor = maquina((b) => {
  const r = comprimir(b);
  if (!r) return "parada";
  let queima = ler<number>("queima", b, 0);
  if (queima <= 0) {
    const ent = entrada(b)!;
    const c = primeiro(ent, (id) => COMBUSTIVEIS[id] !== undefined);
    if (!c) return "parada";
    tirar(ent, c.typeId);
    queima = COMBUSTIVEIS[c.typeId];
  }
  gravar("queima", b, queima - 1);
  terminar(b, r);
  return "ok";
}, "cl.gc.compressor");

export const compressorEletrico = maquina((b) => {
  const r = comprimir(b);
  if (!r) return "parada";
  if (!gastarCE(b, 150)) return "sem_energia";
  terminar(b, r);
  return "ok";
}, "cl.gc.compressor_eletrico");

// ---------- Fabricador de Circuitos ----------
const WAFERS: ReadonlyArray<{ chave: string; sai: [string, number] }> = [
  { chave: "minecraft:redstone_torch", sai: ["cl:wafer_basico", 3] },
  { chave: "minecraft:repeater", sai: ["cl:wafer_avancado", 1] },
];
const BASE_WAFER: ReadonlyArray<[string, number]> = [["minecraft:diamond", 1], ["cl:silicio", 2], ["minecraft:redstone", 1]];
export const fabricador = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b) || !BASE_WAFER.every(([id, n]) => contar(ent, id) >= n)) return "parada";
  const w = WAFERS.find((x) => contar(ent, x.chave) >= 1);
  if (!w) return "parada";
  if (!gastarCE(b, 200)) return "sem_energia";
  for (const [id, n] of BASE_WAFER) tirar(ent, id, n);
  tirar(ent, w.chave);
  entregar(b, [new ItemStack(w.sai[0], w.sai[1])]);
  feito(b, "random.orb");
  return "ok";
}, "cl.gc.fabricador");

// ---------- Oxigênio ----------
const OX = { coletorMax: 6000, compressorMax: 1200, arPor40: 93, folhaPor40: 0.75, raio: 5, puxar: 400, encher: 200, cilindro: 1000 } as const;
const PLANTAS = [...FOLHAS, "minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroot", "minecraft:melon_stem", "minecraft:pumpkin_stem"];

export const coletor = maquina((b) => {
  let o2 = ler<number>("o2", b, 0);
  if (o2 >= OX.coletorMax) return "parada";
  let ganho: number;
  if (b.dimension.id !== LUA) ganho = OX.arPor40 * 2.5; // o tick é de 100 ticks = 2,5 × 40
  else {
    const r = OX.raio;
    const achados = b.dimension.getBlocks(new BlockVolume({ x: b.x - r, y: b.y - r, z: b.z - r }, { x: b.x + r, y: b.y + r, z: b.z + r }), { includeTypes: PLANTAS }, true);
    let n = 0;
    for (const _ of achados.getBlockLocationIterator()) n++;
    ganho = Math.floor(n * OX.folhaPor40 * 2.5);
  }
  if (ganho <= 0) return "parada";
  if (!gastarCE(b, 25)) return "sem_energia";
  o2 = Math.min(OX.coletorMax, o2 + ganho);
  gravar("o2", b, o2);
  return "ok";
}, "cl.gc.coletor");

function coletorVizinho(b: Block): Block | undefined {
  for (const v of [b.above(), b.below(), b.north(), b.south(), b.east(), b.west()]) if (v?.typeId === "cl:coletor_oxigenio") return v;
  return undefined;
}

export const compressorOxigenio = maquina((b) => {
  let o2 = ler<number>("o2", b, 0);
  const ent = entrada(b);
  // Puxa do Coletor encostado.
  const col = coletorVizinho(b);
  if (col && o2 < OX.compressorMax) {
    const tem = ler<number>("o2", col, 0);
    const vem = Math.min(tem, OX.puxar, OX.compressorMax - o2);
    if (vem > 0) {
      gravar("o2", col, tem - vem);
      o2 += vem;
    }
  }
  // Cilindro de Oxigênio do Mekanism: 1.000 de uma vez, devolve o cilindro vazio.
  if (ent && o2 + OX.cilindro <= OX.compressorMax && tirar(ent, "cl:cilindro_oxigenio")) {
    o2 += OX.cilindro;
    entregar(b, [new ItemStack("cl:cilindro_vazio", 1)]);
  }
  gravar("o2", b, o2);
  if (!ent || o2 <= 0) return "parada";
  // Enche o primeiro tanque que não está cheio; cheio, desce para o baú de baixo.
  for (let s = 0; s < ent.size; s++) {
    const t = ent.getItem(s);
    const cap = t && capacidadeTanque(t.typeId);
    if (!t || !cap) continue;
    const tem = oxigenioDe(t);
    if (tem >= cap) {
      if (!cabe(b)) return "parada";
      ent.setItem(s, undefined);
      entregar(b, [t]);
      continue;
    }
    if (!gastarCE(b, 25)) return "sem_energia";
    const vai = Math.min(OX.encher, cap - tem, o2);
    gravarOxigenio(t, tem + vai);
    gravar("o2", b, o2 - vai);
    if (tem + vai >= cap && cabe(b)) {
      ent.setItem(s, undefined);
      entregar(b, [t]);
      const j = quemPerto(b);
      if (j) registrarAcao(j, "encher_tanque");
    } else ent.setItem(s, t);
    feito(b, "random.fizz");
    return "ok";
  }
  return "parada";
}, "cl.gc.compressor_ox");

// ---------- Carregador de Combustível ----------
export const COMBUSTIVEL = { carregadorMax: 12000, porTick: 2, foguete: 1000 } as const;
export const combustivelDoFoguete = (f: { getDynamicProperty(k: string): unknown }): number => (f.getDynamicProperty("cl:comb") as number | undefined) ?? 0;

export const carregador = maquina((b) => {
  let mb = ler<number>("comb", b, 0);
  const ent = entrada(b);
  if (ent && mb + 1000 <= COMBUSTIVEL.carregadorMax && tirar(ent, "cl:balde_combustivel")) {
    mb += 1000;
    entregar(b, [new ItemStack("minecraft:bucket", 1)]);
  }
  gravar("comb", b, mb);
  if (mb <= 0) return "parada";
  const pad = [b.north(), b.south(), b.east(), b.west()].some((v) => v?.typeId === "cl:plataforma_lancamento");
  if (!pad) return "parada";
  const foguete = b.dimension.getEntities({ type: "cl:foguete", location: b.center(), maxDistance: 3.5 })[0];
  if (!foguete) return "parada";
  const tem = combustivelDoFoguete(foguete);
  if (tem >= COMBUSTIVEL.foguete) return "parada";
  if (!gastarCE(b, 25)) return "sem_energia";
  const vai = Math.min(COMBUSTIVEL.porTick * 100, COMBUSTIVEL.foguete - tem, mb);
  foguete.setDynamicProperty("cl:comb", tem + vai);
  gravar("comb", b, mb - vai);
  feito(b, "bucket.empty_lava");
  return "ok";
}, "cl.gc.carregador");

// ---------- Bancada da NASA ----------
export const PECAS_FOGUETE: ReadonlyArray<[string, number]> = [["cl:bico_foguete", 1], ["cl:placa_reforcada", 8], ["cl:aleta_foguete", 4], ["cl:motor_foguete", 1]];

export function itemFoguete(comb: number): ItemStack {
  const i = new ItemStack("cl:foguete_t1", 1);
  i.setDynamicProperty("cl:comb", comb);
  i.setLore([`§7Combustível: ${comb}/1000 mB`]);
  return i;
}

async function abrirBancada(j: Player): Promise<void> {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const faltam = PECAS_FOGUETE.filter(([id, n]) => contar(inv, id) < n);
  const estado = faltam.length
    ? { translate: "cl.gc.bancada.falta", with: { rawtext: faltam.flatMap(([id, n], k) => [...(k ? [{ text: ", " }] : []), { text: `${n - contar(inv, id)}× ` }, { translate: `item.${id}.name` }]) } }
    : { translate: "cl.gc.bancada.pronto" };
  const f = new ActionFormData().title({ translate: "cl.gc.bancada.titulo" }).body({ translate: "cl.gc.bancada.corpo", with: { rawtext: [estado] } });
  if (!faltam.length) f.button({ translate: "cl.gc.bancada.montar" }, "textures/items/cl/c/foguete_t1");
  f.button({ translate: "cl.gc.foguete.fechar" });
  const r = await f.show(j);
  if (r.canceled || faltam.length || r.selection !== 0) return;
  if (!PECAS_FOGUETE.every(([id, n]) => contar(inv, id) >= n)) return;
  for (const [id, n] of PECAS_FOGUETE) tirar(inv, id, n);
  darAoJogador(j, itemFoguete(0));
  j.playSound("random.anvil_use");
  aviso(j, "cl.gc.bancada.feito", 6);
}

export const bancadaNasa: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) system.run(() => void abrirBancada(j));
  },
};

export function registrarMaquinasGC(): void {
  registrarDetalhe("cl:coletor_oxigenio", (b) => ({ translate: "cl.gc.coletor", with: [String(Math.floor(ler<number>("o2", b, 0)))] }));
  registrarDetalhe("cl:compressor_oxigenio", (b) => ({ translate: "cl.gc.compressor_ox", with: [String(Math.floor(ler<number>("o2", b, 0)))] }));
  registrarDetalhe("cl:carregador_combustivel", (b) => ({ translate: "cl.gc.carregador", with: [String(ler<number>("comb", b, 0))] }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const x of RECEITAS_COMPRESSOR) {
      for (const id of ["cl:compressor", "cl:compressor_eletrico"]) r.push({ ...m(id), entradas: x.entra.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }] });
    }
    for (const w of WAFERS) r.push({ ...m("cl:fabricador_circuitos"), entradas: [...BASE_WAFER, [w.chave, 1] as [string, number]].map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: w.sai[0], qtd: w.sai[1] }] });
    r.push({ ...m("cl:bancada_nasa"), entradas: PECAS_FOGUETE.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: "cl:foguete_t1", qtd: 1 }] });
    r.push({ ...m("cl:compressor_oxigenio"), entradas: [{ item: "cl:cilindro_oxigenio", qtd: 1 }], saidas: [{ item: "cl:cilindro_vazio", qtd: 1 }], nota: { text: "+1000 O₂" } });
    return r;
  });
}

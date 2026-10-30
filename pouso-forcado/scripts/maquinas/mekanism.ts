import { Block, EquipmentSlot, ItemStack, Player, world } from "@minecraft/server";
import { THERMAL } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { intervalo } from "../util/perfil.js";
import { feito, maquina } from "./thermal.js";

/*
 * Mekanism leve (1.3.0). Sem rede de gás nem reatores: o gás anda em Cilindros (itens).
 * Todas as máquinas usam o padrão do Thermal: baú em cima = entrada, baú embaixo = saída, energia da rede.
 * - Separador Eletrolítico: água (balde/garrafa) → hidrogênio + oxigênio; salmoura → hidrogênio + cloro.
 * - Evaporador Térmico: de dia e com céu aberto, sem energia: água → salmoura (e sal); salmoura → lítio.
 * - Infusor Químico: hidrogênio + cloro → ácido clorídrico.
 * - Câmara de Purificação: minério + oxigênio → 3 pós; Câmara de Injeção: minério + ácido → 4 pós
 *   (o Pulverizador do Thermal dá 2). Cada cilindro rende 4 minérios.
 * - Infusor Metalúrgico: as ligas (enriquecida, reforçada, atômica) e aço de ferro + carvão.
 * - Jetpack (peito): segurar pular sobe, gastando hidrogênio; no ar sem pular, cai devagar.
 */
const CIL = (g: string) => `cl:cilindro_${g}`;
const VAZIO = CIL("vazio");
const POR_CILINDRO = 4;

// Minério → pó, tirado da tabela do Pulverizador (só o que dá pó de metal).
const PO_DO_MINERIO: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(THERMAL.pulverizador)
    .filter(([de, saidas]) => (de.includes("_ore") || de.startsWith("minecraft:raw_")) && saidas[0][0].startsWith("cl:po_"))
    .map(([de, saidas]) => [de, saidas[0][0]]),
);
const quemPerto = (b: Block) => b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];

// ---------- Separador Eletrolítico ----------
const AGUAS: Readonly<Record<string, [string, string]>> = {
  // entrada → [gás que sai junto do hidrogênio, recipiente que volta]
  "minecraft:water_bucket": ["oxigenio", "minecraft:bucket"],
  "minecraft:potion": ["oxigenio", "minecraft:glass_bottle"],
  "cl:balde_salmoura": ["cloro", "minecraft:bucket"],
};
export const separador = maquina((b) => {
  const ent = entrada(b);
  const agua = ent && primeiro(ent, (id) => AGUAS[id] !== undefined);
  if (!ent || !agua || contar(ent, VAZIO) < 2 || !cabe(b)) return "parada";
  if (!gastarCE(b, 100)) return "sem_energia";
  const [gas, volta] = AGUAS[agua.typeId];
  tirar(ent, agua.typeId);
  tirar(ent, VAZIO, 2);
  entregar(b, [new ItemStack(CIL("hidrogenio"), 1), new ItemStack(CIL(gas), 1), new ItemStack(volta, 1)]);
  feito(b, "bubble.pop");
  const j = quemPerto(b);
  if (j) registrarAcao(j, "eletrolise");
  return "ok";
}, "cl.mk.separador");

// ---------- Evaporador Térmico ----------
export const evaporador = maquina((b) => {
  const t = world.getTimeOfDay();
  if (t > 12000 && t < 23500) return "parada";
  const topo = b.dimension.getTopmostBlock({ x: b.x, z: b.z });
  if (topo && topo.y > b.y) return "parada";
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  if (tirar(ent, "minecraft:water_bucket")) {
    entregar(b, [new ItemStack("cl:balde_salmoura", 1), ...(Math.random() < 0.5 ? [new ItemStack("cl:sal", 1)] : [])]);
  } else if (tirar(ent, "cl:balde_salmoura")) {
    entregar(b, [new ItemStack("cl:po_litio", 1), new ItemStack("minecraft:bucket", 1)]);
  } else if (tirar(ent, "cl:agua_impropria")) {
    entregar(b, [new ItemStack("cl:sal", 1)]);
  } else return "parada";
  feito(b, "random.fizz");
  return "ok";
}, "cl.mk.evaporador");

// ---------- Infusor Químico ----------
export const infusorQuimico = maquina((b) => {
  const ent = entrada(b);
  if (!ent || contar(ent, CIL("hidrogenio")) < 1 || contar(ent, CIL("cloro")) < 1 || !cabe(b)) return "parada";
  if (!gastarCE(b, 50)) return "sem_energia";
  tirar(ent, CIL("hidrogenio"));
  tirar(ent, CIL("cloro"));
  entregar(b, [new ItemStack(CIL("acido"), 1), new ItemStack(VAZIO, 1)]);
  feito(b, "bubble.pop");
  return "ok";
}, "cl.mk.infusor_quimico");

// ---------- Câmaras de Purificação (×3) e de Injeção (×4) ----------
function camara(gas: string, rende: number, ce: number, acao: "purificar" | "injetar", dica: string) {
  return maquina((b) => {
    const ent = entrada(b);
    const minerio = ent && primeiro(ent, (id) => PO_DO_MINERIO[id] !== undefined);
    if (!ent || !minerio || !cabe(b)) return "parada";
    let guardado = ler<number>("gas", b, 0);
    if (guardado < 1) {
      if (!tirar(ent, CIL(gas))) return "parada";
      guardado += POR_CILINDRO;
      entregar(b, [new ItemStack(VAZIO, 1)]);
    }
    if (!gastarCE(b, ce)) {
      gravar("gas", b, guardado);
      return "sem_energia";
    }
    tirar(ent, minerio.typeId);
    gravar("gas", b, guardado - 1);
    entregar(b, [new ItemStack(PO_DO_MINERIO[minerio.typeId], rende)]);
    feito(b, "dig.gravel");
    const j = quemPerto(b);
    if (j) registrarAcao(j, acao);
    return "ok";
  }, dica);
}
export const camaraPurificacao = camara("oxigenio", 3, 100, "purificar", "cl.mk.purificacao");
export const camaraInjecao = camara("acido", 4, 200, "injetar", "cl.mk.injecao");

// ---------- Infusor Metalúrgico ----------
const INFUSOES: ReadonlyArray<{ entra: ReadonlyArray<[string, number]>; sai: string }> = [
  // 1.7.0 (para o Mekanism Generators e Tools): circuito de controle e os lingotes refinados.
  { entra: [["minecraft:obsidian", 1], ["minecraft:diamond", 1], ["cl:lingote_osmio", 1]], sai: "cl:lingote_obsidiana_refinada" },
  { entra: [["minecraft:glowstone_dust", 1], ["cl:lingote_osmio", 1]], sai: "cl:lingote_glowstone_refinado" },
  { entra: [["cl:lingote_osmio", 1], ["minecraft:redstone", 1]], sai: "cl:circuito_controle_basico" },
  { entra: [["minecraft:iron_ingot", 1], ["minecraft:redstone", 1]], sai: "cl:liga_enriquecida" },
  { entra: [["cl:liga_enriquecida", 1], ["minecraft:diamond", 1]], sai: "cl:liga_reforcada" },
  { entra: [["cl:liga_reforcada", 1], ["minecraft:obsidian", 1]], sai: "cl:liga_atomica" },
  { entra: [["minecraft:iron_ingot", 1], ["minecraft:coal", 2]], sai: "cl:lingote_aco" },
];
export const infusorMetalurgico = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const r = INFUSOES.find((x) => x.entra.every(([id, n]) => contar(ent, id) >= n));
  if (!r) return "parada";
  if (!gastarCE(b, 50)) return "sem_energia";
  for (const [id, n] of r.entra) tirar(ent, id, n);
  entregar(b, [new ItemStack(r.sai, 1)]);
  feito(b, "random.anvil_use");
  return "ok";
}, "cl.mk.infusor_metalurgico");


// ---------- Jetpack ----------
const JET = { max: 200, porCilindro: 50, gastoTicks: 20 };
const combustivel = (i: ItemStack) => (i.getDynamicProperty("cl:h2") as number | undefined) ?? 0;
function gravarJet(i: ItemStack, n: number): void {
  i.setDynamicProperty("cl:h2", n);
  i.setLore([`§7Hidrogênio: ${n}/${JET.max}`]);
}
const voando = new Map<string, number>(); // jogador → ticks de voo desde o último gasto

function cuidarJetpack(j: Player): void {
  const eq = j.getComponent("minecraft:equippable");
  const jet = eq?.getEquipment(EquipmentSlot.Chest);
  if (!eq || jet?.typeId !== "cl:jetpack") return void voando.delete(j.id);
  const h2 = combustivel(jet);
  if (h2 <= 0) {
    if (j.isJumping && !j.isOnGround) aviso(j, "cl.mk.jetpack_vazio", 3);
    return;
  }
  if (j.isJumping) {
    const v = j.getVelocity();
    j.applyKnockback({ x: v.x, z: v.z }, 0.35);
    const t = (voando.get(j.id) ?? 0) + 2;
    if (!voando.has(j.id)) registrarAcao(j, "jetpack");
    if (t >= JET.gastoTicks) {
      gravarJet(jet, h2 - 1);
      eq.setEquipment(EquipmentSlot.Chest, jet);
      aviso(j, { translate: "cl.mk.jetpack", with: [String(h2 - 1), String(JET.max)] }, 1);
      voando.set(j.id, 0);
    } else voando.set(j.id, t);
    j.dimension.spawnParticle("minecraft:basic_smoke_particle", { x: j.location.x, y: j.location.y + 0.6, z: j.location.z });
  } else if (!j.isOnGround) {
    j.addEffect("slow_falling", 10, { showParticles: false });
  } else voando.delete(j.id);
}

export function registrarMekanism(): void {
  intervalo("mekanism", () => {
    for (const j of world.getPlayers()) cuidarJetpack(j);
  }, 2);
  // Abastecer: com o jetpack vestido, usar um Cilindro de Hidrogênio.
  world.afterEvents.itemUse.subscribe(({ itemStack, source: j }) => {
    if (itemStack.typeId !== CIL("hidrogenio")) return;
    const eq = j.getComponent("minecraft:equippable");
    const jet = eq?.getEquipment(EquipmentSlot.Chest);
    if (!eq || jet?.typeId !== "cl:jetpack") return;
    const h2 = combustivel(jet);
    if (h2 >= JET.max) return;
    const novo = Math.min(JET.max, h2 + JET.porCilindro);
    gravarJet(jet, novo);
    eq.setEquipment(EquipmentSlot.Chest, jet);
    const inv = j.getComponent("minecraft:inventory")?.container;
    const mao = inv?.getItem(j.selectedSlotIndex);
    if (inv && mao?.typeId === CIL("hidrogenio")) {
      if (mao.amount > 1) {
        mao.amount--;
        inv.setItem(j.selectedSlotIndex, mao);
      } else inv.setItem(j.selectedSlotIndex, undefined);
      darAoJogador(j, VAZIO, 1);
    }
    j.playSound("random.fizz");
    aviso(j, { translate: "cl.mk.jetpack_cheio", with: [String(novo), String(JET.max)] }, 3);
  });
  registrarDetalhe(["cl:camara_purificacao", "cl:camara_injecao"], (b) => ({ translate: "cl.mk.gas", with: [String(ler<number>("gas", b, 0))] }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const [de, po] of Object.entries(PO_DO_MINERIO)) {
      r.push({ ...m("cl:camara_purificacao"), entradas: [{ item: de, qtd: 1 }, { item: CIL("oxigenio"), qtd: 1 }], saidas: [{ item: po, qtd: 3 }], nota: { text: `1 cilindro = ${POR_CILINDRO}` } });
      r.push({ ...m("cl:camara_injecao"), entradas: [{ item: de, qtd: 1 }, { item: CIL("acido"), qtd: 1 }], saidas: [{ item: po, qtd: 4 }], nota: { text: `1 cilindro = ${POR_CILINDRO}` } });
    }
    for (const [de, [gas, volta]] of Object.entries(AGUAS))
      r.push({ ...m("cl:separador_eletrolitico"), entradas: [{ item: de, qtd: 1 }, { item: VAZIO, qtd: 2 }], saidas: [{ item: CIL("hidrogenio"), qtd: 1 }, { item: CIL(gas), qtd: 1 }, { item: volta, qtd: 1 }] });
    r.push({ ...m("cl:infusor_quimico"), entradas: [{ item: CIL("hidrogenio"), qtd: 1 }, { item: CIL("cloro"), qtd: 1 }], saidas: [{ item: CIL("acido"), qtd: 1 }, { item: VAZIO, qtd: 1 }] });
    r.push({ ...m("cl:evaporador"), entradas: [{ item: "minecraft:water_bucket", qtd: 1 }], saidas: [{ item: "cl:balde_salmoura", qtd: 1 }, { item: "cl:sal", qtd: 1, chance: 0.5 }] });
    r.push({ ...m("cl:evaporador"), entradas: [{ item: "cl:balde_salmoura", qtd: 1 }], saidas: [{ item: "cl:po_litio", qtd: 1 }, { item: "minecraft:bucket", qtd: 1 }] });
    for (const x of INFUSOES) r.push({ ...m("cl:infusor_metalurgico"), entradas: x.entra.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: x.sai, qtd: 1 }] });
    return r;
  });
}

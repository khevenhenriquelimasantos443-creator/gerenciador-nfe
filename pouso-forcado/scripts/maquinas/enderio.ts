import { Block, BlockCustomComponent, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { ENERGIA, THERMAL } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F29 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { agora, ceuAberto, gerador, solAlto } from "./mekanism_extra.js";
import { feito, maquina } from "./thermal.js";

/*
 * Ender IO (1.8.0), com os números do Ender IO 5.2 (alloying.xml, sagmill.xml, SolarConfig, CapBankConfig):
 * - Fundidora de Ligas: as 7 ligas (10.000 a 20.000 RF cada) e a Placa Fotovoltaica (15.000 RF);
 * - Moinho SAG: minério em 2 pós (a tabela do Pulverizador), carvão em carvão pulverizado (+10% de outro),
 *   pedregulho em cascalho e cascalho em areia (2.400 RF; minério 3.600 RF);
 * - Gerador Stirling: 20 RF/t com combustível de fornalha (o carvão dura 1.600 ticks);
 * - Painéis Fotovoltaicos: 10, 40 e 160 RF/t de dia com céu aberto;
 * - Bancos de Capacitores: 1, 5 e 25 milhões de RF (usam o componente das Células de Energia);
 * - Âncora de Viagem: tocar abre a lista das outras âncoras a até 96 blocos (o alcance do Ender IO) e leva até ela.
 * Energia em cE (1 E = 4.000 RF, então 1 cE = 40 RF).
 */
const RF_CE = (rf: number) => Math.round(rf / 40);
type Liga = { entra: ReadonlyArray<[string, number]>; sai: [string, number]; rf: number };
export const LIGAS: ReadonlyArray<Liga> = [
  { entra: [["minecraft:iron_ingot", 1], ["cl:po_carvao", 1], ["minecraft:obsidian", 1]], sai: ["cl:aco_negro", 1], rf: 20000 },
  { entra: [["cl:lingote_aco", 1], ["minecraft:obsidian", 1]], sai: ["cl:aco_negro", 1], rf: 10500 },
  { entra: [["minecraft:iron_ingot", 1], ["cl:po_carvao", 1], ["cl:silicio", 1]], sai: ["cl:aco_eletrico", 1], rf: 10000 },
  { entra: [["minecraft:redstone", 1], ["minecraft:gold_ingot", 1], ["minecraft:glowstone_dust", 1]], sai: ["cl:liga_energetica", 1], rf: 10000 },
  { entra: [["cl:liga_energetica", 1], ["minecraft:ender_pearl", 1]], sai: ["cl:liga_vibrante", 1], rf: 10000 },
  { entra: [["minecraft:iron_ingot", 1], ["minecraft:ender_pearl", 1]], sai: ["cl:ferro_pulsante", 1], rf: 10000 },
  { entra: [["minecraft:redstone", 1], ["cl:silicio", 1]], sai: ["cl:liga_redstone", 1], rf: 10000 },
  { entra: [["minecraft:redstone", 1], ["minecraft:iron_ingot", 1]], sai: ["cl:ferro_condutor", 1], rf: 10000 },
  { entra: [["cl:aco_eletrico", 1], ["cl:silicio", 2]], sai: ["cl:placa_fotovoltaica", 1], rf: 15000 },
];
export const fundidora = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const r = LIGAS.find((x) => x.entra.every(([id, n]) => contar(ent, id) >= n));
  if (!r) return "parada";
  if (!gastarCE(b, RF_CE(r.rf))) return "sem_energia";
  for (const [id, n] of r.entra) tirar(ent, id, n);
  entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
  feito(b, "random.fizz");
  return "ok";
}, "cl.eio.fundidora");

// ---------- Moinho SAG ----------
type Moagem = { sai: ReadonlyArray<[string, number, number]>; rf: number };
const DO_PULVERIZADOR = Object.entries(THERMAL.pulverizador).filter(([de]) => de.includes("_ore") || de.startsWith("minecraft:raw_"));
export const MOAGEM: Readonly<Record<string, Moagem>> = {
  ...Object.fromEntries(DO_PULVERIZADOR.map(([de, saidas]) => [de, { sai: saidas, rf: 3600 }])),
  "minecraft:coal": { sai: [["cl:po_carvao", 1, 1], ["cl:po_carvao", 1, 0.1]], rf: 2400 },
  "minecraft:cobblestone": { sai: [["minecraft:gravel", 1, 1]], rf: 2400 },
  "minecraft:gravel": { sai: [["minecraft:sand", 1, 1], ["minecraft:flint", 1, 0.1]], rf: 2400 },
};
export const moinhoSag = maquina((b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => MOAGEM[id] !== undefined);
  if (!ent || !p || !cabe(b)) return "parada";
  const m = MOAGEM[p.typeId];
  if (!gastarCE(b, RF_CE(m.rf))) return "sem_energia";
  tirar(ent, p.typeId);
  entregar(b, m.sai.filter(([, , chance]) => Math.random() < chance).map(([id, n]) => new ItemStack(id, n)));
  feito(b, "dig.stone");
  return "ok";
}, "cl.eio.moinho");

// ---------- Gerador Stirling e painéis ----------
const POR_RFT = 1 / 40; // E por ciclo de 5 s para cada RF/t
export const stirling = gerador((b) => {
  let ciclos = ler<number>("queima", b, 0);
  if (ciclos <= 0) {
    const ent = entrada(b);
    const c = ent && primeiro(ent, (id) => (ENERGIA.combustivel[id] ?? 0) > 0);
    if (!c || !ent) return 0;
    tirar(ent, c.typeId);
    if (c.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
    ciclos = (ENERGIA.combustivel[c.typeId] ?? 0) * 4; // carvão: 4 → 16 ciclos = 1.600 ticks
  }
  gravar("queima", b, ciclos - 1);
  return 20 * POR_RFT;
}, "cl.eio.stirling", true);

const PAINEIS: Readonly<Record<string, number>> = DADOS_F29.paineis;
export const painel = gerador((b) => (solAlto() && ceuAberto(b) ? (PAINEIS[b.typeId] ?? 0) * POR_RFT : 0), "cl.eio.painel", false, (b) => (PAINEIS[b.typeId] ?? 0) * POR_RFT);

// ---------- Âncora de Viagem ----------
const ANCORAS = "cl:ancoras";
const ALCANCE = 96;
type Ancora = { d: string; x: number; y: number; z: number };
function lerAncoras(): Ancora[] {
  try {
    const v = world.getDynamicProperty(ANCORAS);
    return typeof v === "string" ? (JSON.parse(v) as Ancora[]) : [];
  } catch {
    return [];
  }
}
const gravarAncoras = (l: Ancora[]) => world.setDynamicProperty(ANCORAS, JSON.stringify(l));
const mesma = (a: Ancora, b: Block) => a.d === b.dimension.id && a.x === b.x && a.y === b.y && a.z === b.z;

async function viajar(j: Player, b: Block): Promise<void> {
  const daqui = lerAncoras().filter((a) => !mesma(a, b) && a.d === b.dimension.id);
  const perto = daqui
    .map((a) => ({ a, dist: Math.round(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)) }))
    .filter((x) => x.dist <= ALCANCE)
    .sort((p, q) => p.dist - q.dist);
  if (!perto.length) return aviso(j, "cl.eio.ancora.nenhuma", 4);
  const f = new ActionFormData().title({ translate: "cl.eio.ancora.titulo" }).body({ translate: "cl.eio.ancora.corpo" });
  for (const { a, dist } of perto) f.button({ translate: "cl.eio.ancora.item", with: [String(a.x), String(a.y), String(a.z), String(dist)] });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const alvo = perto[r.selection].a;
  const bloco = b.dimension.getBlock({ x: alvo.x, y: alvo.y, z: alvo.z });
  if (bloco?.typeId !== "cl:ancora_viagem") {
    gravarAncoras(lerAncoras().filter((a) => !(a.d === alvo.d && a.x === alvo.x && a.y === alvo.y && a.z === alvo.z)));
    return aviso(j, "cl.eio.ancora.nenhuma", 4);
  }
  j.teleport({ x: alvo.x + 0.5, y: alvo.y + 1, z: alvo.z + 0.5 });
  j.playSound("mob.endermen.portal");
  registrarAcao(j, "ancora");
}
export const ancora: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) system.run(() => void viajar(j, e.block));
  },
};

export function registrarEnderIO(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    if (block.typeId !== "cl:ancora_viagem") return;
    gravarAncoras([...lerAncoras().filter((a) => !mesma(a, block)), { d: block.dimension.id, x: block.x, y: block.y, z: block.z }]);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== "cl:ancora_viagem") return;
    gravarAncoras(lerAncoras().filter((a) => !mesma(a, block)));
  });
  registrarDetalhe(["cl:gerador_stirling", ...Object.keys(PAINEIS)], (b) => ({ text: `§7${agora(b)}` }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const x of LIGAS) r.push({ ...m("cl:fundidora_ligas"), entradas: x.entra.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: `${x.rf} RF` } });
    for (const [de, x] of Object.entries(MOAGEM))
      r.push({ ...m("cl:moinho_sag"), entradas: [{ item: de, qtd: 1 }], saidas: x.sai.map(([item, qtd, chance]) => ({ item, qtd, ...(chance < 1 ? { chance } : {}) })), nota: { text: `${x.rf} RF` } });
    return r;
  });
}

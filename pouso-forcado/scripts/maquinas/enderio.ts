import { Block, BlockCustomComponent, Container, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { ENERGIA } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F29, DADOS_F40 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { agora, ceuAberto, gerador, solAlto } from "./mekanism_extra.js";
import { feito, maquina } from "./thermal.js";

/*
 * Ender IO (1.8.0; 1.20.0: atualizado para o Ender IO 9, o mais novo, com as receitas e os números de
 * tools/dados/conteudo/enderio.json, lido do código do mod por tools/importar-enderio.py):
 * - Fundição de Ligas: as 42 receitas do Ender IO 9 (ligas, quartzo fundido, vidro transparente, corantes...);
 * - Triturador SAG: as 72 receitas, com a Esfera de Trituração do baú de cima (multiplica a saída, a chance dos
 *   extras e o gasto, e se desgasta como no mod);
 * - Gerador Stirling: 40 RF/t; a queima vale 37,5% do tempo de fornalha × 80% (capacitor básico);
 * - Módulos Fotovoltaicos: 4, 16 e 64 RF/t de dia com céu aberto; Bancos de Capacitores: 0,5, 2 e 4 milhões de RF;
 * - Âncora de Viagem: tocar abre a lista das outras âncoras a até 96 blocos (o alcance do Ender IO) e leva até ela.
 * Energia em cE (1 E = 4.000 RF, então 1 cE = 40 RF). As máquinas novas do Ender IO 9 estão em enderio9.ts.
 */
type Ing = string | readonly string[];
type Liga = { entra: ReadonlyArray<readonly [Ing, number]>; sai: readonly [string, number]; ce: number };
type Moagem = { entra: readonly string[]; sai: ReadonlyArray<readonly [string, number, number]>; ce: number; bonus: boolean };
type Esfera = { BonusMultiplier: number; Durability: number; OutputMultiplier: number; PowerUse: number };
const D40 = DADOS_F40 as unknown as { ligas: Liga[]; moagem: Moagem[]; esferas: Record<string, Esfera>; stirling: { porTick: number; fator: number } };
const opcoes = (i: Ing): readonly string[] => (typeof i === "string" ? [i] : i);
// O Aço Elétrico não existe mais no Ender IO 9; a receita de antes fica para quem já usa.
export const LIGAS: readonly Liga[] = [
  ...D40.ligas,
  { entra: [["minecraft:iron_ingot", 1], ["cl:po_carvao", 1], ["cl:silicio", 1]], sai: ["cl:aco_eletrico", 1], ce: 250 } as Liga,
].sort((a, b) => b.entra.length - a.entra.length);
/** O id que o baú tem para o ingrediente (a 1ª opção com quantidade suficiente). */
const temIng = (c: Container, i: Ing, n: number) => opcoes(i).find((id) => contar(c, id) >= n);
export const fundidora = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  // A receita com mais ingredientes primeiro (Liga Energética antes de Liga Condutiva, por exemplo).
  for (const r of LIGAS) {
    const ids = r.entra.map(([i, n]) => temIng(ent, i, n));
    if (ids.some((x) => !x)) continue;
    if (!gastarCE(b, r.ce)) return "sem_energia";
    r.entra.forEach(([, n], k) => tirar(ent, ids[k]!, n));
    entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
    feito(b, "random.fizz");
    return "ok";
  }
  return "parada";
}, "cl.eio.fundidora");

// ---------- Triturador SAG ----------
export const MOAGEM = new Map<string, Moagem>();
for (const m of D40.moagem) for (const id of m.entra) if (!MOAGEM.has(id)) MOAGEM.set(id, m);
const ESFERAS = D40.esferas;
export const moinhoSag = maquina((b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => MOAGEM.has(id));
  if (!ent || !p || !cabe(b)) return "parada";
  const m = MOAGEM.get(p.typeId)!;
  const bola = primeiro(ent, (id) => ESFERAS[id] !== undefined);
  const e = bola && m.bonus ? ESFERAS[bola.typeId] : undefined;
  if (!gastarCE(b, Math.round(m.ce * (e?.PowerUse ?? 1)))) return "sem_energia";
  tirar(ent, p.typeId);
  const saidas: ItemStack[] = [];
  for (const [id, n, chance] of m.sai) {
    if (chance >= 1) {
      const q = n * (e?.OutputMultiplier ?? 1);
      const total = Math.floor(q) + (Math.random() < q - Math.floor(q) ? 1 : 0);
      if (total > 0) saidas.push(new ItemStack(id, total));
    } else if (Math.random() < Math.min(1, chance * (e?.BonusMultiplier ?? 1))) saidas.push(new ItemStack(id, n));
  }
  entregar(b, saidas);
  // A esfera gasta como no mod: a energia da operação conta contra a durabilidade.
  if (bola && e) {
    const gasto = ler<number>("esfera", b, 0) + m.ce * 40;
    if (gasto >= e.Durability) {
      tirar(ent, bola.typeId);
      gravar("esfera", b, 0);
    } else gravar("esfera", b, gasto);
  }
  feito(b, "dig.stone");
  return "ok";
}, "cl.eio.moinho");

// ---------- Gerador Stirling e módulos ----------
const POR_RFT = 1 / 40; // E por ciclo de 5 s para cada RF/t
export const stirling = gerador((b) => {
  let ticks = ler<number>("queima_t", b, 0);
  if (ticks <= 0) {
    // Mundo de antes da 1.20.0: os ciclos guardados viram ticks.
    const antigos = ler<number>("queima", b, 0);
    if (antigos > 0) {
      ticks = antigos * 100;
      gravar("queima", b, undefined);
    } else {
      const ent = entrada(b);
      const c = ent && primeiro(ent, (id) => (ENERGIA.combustivel[id] ?? 0) > 0);
      if (!c || !ent) return 0;
      tirar(ent, c.typeId);
      if (c.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
      ticks = Math.floor((ENERGIA.combustivel[c.typeId] ?? 0) * 400 * D40.stirling.fator); // combustivel: em ciclos de 400 ticks (carvão = 4)
    }
  }
  const agoraT = Math.min(100, ticks);
  gravar("queima_t", b, ticks - agoraT);
  return (agoraT / 100) * D40.stirling.porTick * POR_RFT;
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
    for (const x of LIGAS)
      r.push({ ...m("cl:fundidora_ligas"), entradas: x.entra.map(([i, qtd]) => ({ item: opcoes(i)[0], qtd })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: `${x.ce * 40} RF` } });
    for (const x of D40.moagem)
      r.push({ ...m("cl:moinho_sag"), entradas: [{ item: x.entra[0], qtd: 1 }], saidas: x.sai.map(([item, qtd, chance]) => ({ item, qtd, ...(chance < 1 ? { chance } : {}) })), nota: { text: `${x.ce * 40} RF` } });
    return r;
  });
}

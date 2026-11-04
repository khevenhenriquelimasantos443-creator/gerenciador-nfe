import { Block, BlockCustomComponent, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravarEm, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao, gastarFerramenta } from "../util/inventario.js";
import { DADOS_F54 } from "../conteudo/gerado.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * Waystones (1.10.0), como no mod do BlayTheNinth:
 * - Pedra do Caminho: o primeiro toque ativa a pedra para aquele jogador; os seguintes abrem a lista das pedras que
 *   ele já ativou e levam até a escolhida. Quem põe a pedra dá o nome. Sem custo, só na mesma dimensão (a Lua só
 *   se alcança de foguete).
 * - Pedra de Viagem: abre a mesma lista de qualquer lugar, com 300 s de espera entre usos (warpStoneCooldown).
 * - Pergaminho de Viagem: uma viagem para qualquer pedra ativada (gasta o pergaminho).
 * - Pergaminho de Retorno: volta à última pedra ativada (gasta o pergaminho).
 */
const PEDRA = "cl:pedra_caminho";
// 1.35.0 (Waystones 26): as variantes também são Pedras do Caminho.
const PEDRAS = new Set<string>(DADOS_F54.pedras as unknown as string[]);
const CORES = DADOS_F54.cores as unknown as string[];
const ehPedra = (id: string | undefined) => !!id && PEDRAS.has(id);
const REGISTRO = "cl:pedras_caminho";
const ATIVAS = "cl:pedras_ativas";
const ULTIMA = "cl:ultima_pedra";
type Pedra = { d: string; x: number; y: number; z: number; nome: string };
const chave = (p: { x: number; y: number; z: number }, d: string) => `${d}|${p.x},${p.y},${p.z}`;
const chaveDe = (p: Pedra) => chave(p, p.d);

function lerJson<T>(v: unknown, padrao: T): T {
  try {
    return typeof v === "string" ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}
const pedras = (): Pedra[] => lerJson<Pedra[]>(world.getDynamicProperty(REGISTRO), []);
const gravarPedras = (l: Pedra[]) => world.setDynamicProperty(REGISTRO, JSON.stringify(l));
const ativas = (j: Player): string[] => lerJson<string[]>(j.getDynamicProperty(ATIVAS), []);
const daqui = (b: Block) => pedras().find((p) => chaveDe(p) === chave(b, b.dimension.id));

function ativar(j: Player, p: Pedra): void {
  const l = ativas(j);
  if (!l.includes(chaveDe(p))) j.setDynamicProperty(ATIVAS, JSON.stringify([...l, chaveDe(p)]));
  j.setDynamicProperty(ULTIMA, chaveDe(p));
}

/** Leva até a pedra: o primeiro lado com 2 blocos de ar; se não houver, em cima dela. */
function irPara(j: Player, p: Pedra): boolean {
  const dim = world.getDimension(p.d);
  const b = dim.getBlock(p);
  if (b && !ehPedra(b.typeId)) {
    gravarPedras(pedras().filter((x) => chaveDe(x) !== chaveDe(p)));
    aviso(j, "cl.wy.sumiu", 4);
    return false;
  }
  let destino = { x: p.x + 0.5, y: p.y + 1, z: p.z + 0.5 };
  for (const [dx, dz] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
    const pe = dim.getBlock({ x: p.x + dx, y: p.y, z: p.z + dz });
    if (pe?.isAir && pe.above()?.isAir) {
      destino = { x: p.x + dx + 0.5, y: p.y, z: p.z + dz + 0.5 };
      break;
    }
  }
  j.teleport(destino, { dimension: dim });
  j.playSound("mob.endermen.portal");
  system.run(() => dim.spawnParticle("minecraft:portal_reverse_particle", { x: destino.x, y: destino.y + 1, z: destino.z }));
  registrarAcao(j, "waystone");
  return true;
}

/** Lista das pedras ativadas pelo jogador nesta dimensão (menos a de onde ele está). */
async function escolher(j: Player, aqui?: Pedra, renomear?: Block): Promise<Pedra | "renomear" | undefined> {
  const minhas = new Set(ativas(j));
  const lista = pedras()
    .filter((p) => p.d === j.dimension.id && minhas.has(chaveDe(p)) && (!aqui || chaveDe(p) !== chaveDe(aqui)))
    .map((p) => ({ p, dist: Math.round(Math.hypot(p.x - j.location.x, p.z - j.location.z)) }))
    .sort((a, b) => a.dist - b.dist);
  if (!lista.length && !renomear) {
    aviso(j, "cl.wy.nenhuma", 4);
    return undefined;
  }
  const f = new ActionFormData().title({ translate: "cl.wy.titulo" }).body({ translate: lista.length ? "cl.wy.corpo" : "cl.wy.nenhuma" });
  for (const { p, dist } of lista) f.button({ translate: "cl.wy.item", with: [p.nome, String(dist)] });
  if (renomear) f.button({ translate: "cl.wy.renomear" });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return undefined;
  return r.selection < lista.length ? lista[r.selection].p : "renomear";
}

async function darNome(j: Player, b: Block): Promise<void> {
  const p = daqui(b);
  if (!p) return;
  const r = await new ModalFormData().title({ translate: "cl.wy.titulo" }).textField({ translate: "cl.wy.nome" }, p.nome, { defaultValue: p.nome }).show(j);
  if (r.canceled || !r.formValues) return;
  const nome = String(r.formValues[0] ?? "").trim().slice(0, 32);
  if (!nome) return;
  gravarPedras(pedras().map((x) => (chaveDe(x) === chaveDe(p) ? { ...x, nome } : x)));
  aviso(j, { translate: "cl.wy.ativada", with: [nome] }, 4);
}

// ---------- 1.35.0: custo de XP (WaystonesConfig: 0,01 ponto por bloco, de 0 a 27; outra dimensão 27) ----------
function custoXp(j: Player, p: { d: string; x: number; z: number }): number {
  if (p.d !== j.dimension.id) return 27;
  return Math.max(0, Math.min(27, Math.round(Math.hypot(p.x - j.location.x, p.z - j.location.z) * 0.01)));
}
/** Paga a viagem em XP (no criativo, de graça). Devolve se pagou. */
function pagarXp(j: Player, p: { d: string; x: number; z: number }): boolean {
  if (j.getGameMode() === GameMode.Creative) return true;
  const c = custoXp(j, p);
  if (j.getTotalXp() < c) {
    aviso(j, { translate: "cl.wy.xp", with: [String(c), String(j.getTotalXp())] }, 4);
    return false;
  }
  if (c) j.addExperience(-c);
  return true;
}

export const pedraCaminho: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    system.run(() => {
      let p = daqui(b);
      if (!p) {
        // Pedra posta antes do registro (ou por comando): entra agora.
        p = { d: b.dimension.id, x: b.x, y: b.y, z: b.z, nome: `Pedra ${pedras().length + 1}` };
        gravarPedras([...pedras(), p]);
      }
      // 1.35.0: Pergaminho em Branco na mão: vira Pergaminho Vinculado a esta pedra.
      const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
      if (mao?.typeId === "cl:pergaminho_vazio") return vincular(j, p);
      if (!ativas(j).includes(chaveDe(p))) {
        ativar(j, p);
        j.playSound("beacon.activate");
        return aviso(j, { translate: "cl.wy.ativada", with: [p.nome] }, 4);
      }
      ativar(j, p);
      const aqui = p;
      abrirUmMenu(j, async () => {
        const alvo = await escolher(j, aqui, b);
        if (alvo === "renomear") return darNome(j, b);
        if (alvo && pagarXp(j, alvo)) irPara(j, alvo);
      });
    });
  },
};

async function usarItem(j: Player, id: string): Promise<void> {
  if (id === "cl:pergaminho_retorno") {
    const k = j.getDynamicProperty(ULTIMA);
    const p = pedras().find((x) => chaveDe(x) === k && x.d === j.dimension.id);
    if (!p) return aviso(j, "cl.wy.sem_retorno", 4);
    if (irPara(j, p)) gastarDaMao(j);
    return;
  }
  if (id === "cl:pedra_viagem") {
    // Waystones 26: sem espera; custa XP e 80 de durabilidade (10.000).
    const alvo = await escolher(j);
    if (alvo && alvo !== "renomear" && pagarXp(j, alvo) && irPara(j, alvo)) gastarFerramenta(j, 80);
    return;
  }
  const alvo = await escolher(j);
  if (alvo && alvo !== "renomear" && irPara(j, alvo)) gastarDaMao(j);
}

export function registrarWaystones(): void {
  registrarWaystones26();
  world.afterEvents.playerPlaceBlock.subscribe(({ block, player }) => {
    if (!ehPedra(block.typeId)) return;
    const p: Pedra = { d: block.dimension.id, x: block.x, y: block.y, z: block.z, nome: `Pedra ${pedras().length + 1}` };
    gravarPedras([...pedras().filter((x) => chaveDe(x) !== chaveDe(p)), p]);
    ativar(player, p);
    abrirUmMenu(player, () => darNome(player, block));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (!ehPedra(brokenBlockPermutation.type.id)) return;
    const k = chave(block, block.dimension.id);
    gravarPedras(pedras().filter((x) => chaveDe(x) !== k));
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    const id = itemStack.typeId;
    if (id !== "cl:pedra_viagem" && id !== "cl:pergaminho_viagem" && id !== "cl:pergaminho_retorno") return;
    abrirUmMenu(source, () => usarItem(source, id));
  });
  registrarDetalhe([...PEDRAS], (b) => {
    const p = daqui(b);
    return p ? { text: `§d${p.nome}` } : undefined;
  });
}

// ---------- 1.35.0: Pedras de Partilha, Pedras-Porto, Pedras de Viagem coloridas, Placa de Dobra e pergaminhos ----------
const PARTILHA = "cl:pedras_partilha";
type Partilha = Pedra & { cor: string };
const partilhas = (): Partilha[] => lerJson<Partilha[]>(world.getDynamicProperty(PARTILHA), []);
const gravarPartilhas = (l: Partilha[]) => world.setDynamicProperty(PARTILHA, JSON.stringify(l));
const corDe = (id: string) => CORES.find((c) => id.endsWith(`_${c}`));

/** A rede de uma cor (ou, sem cor, as pedras ativadas): escolhe e viaja. `porXp`: Pedra de Viagem (custa XP e durabilidade). */
async function rede(j: Player, cor: string | undefined, de?: Block, porXp = false): Promise<void> {
  if (!cor) {
    const alvo = await escolher(j);
    if (alvo && alvo !== "renomear" && (!porXp || pagarXp(j, alvo)) && irPara(j, alvo) && porXp) gastarFerramenta(j, 80);
    return;
  }
  const lista = partilhas()
    .filter((p) => p.cor === cor && p.d === j.dimension.id && !(de && p.x === de.x && p.y === de.y && p.z === de.z))
    .map((p) => ({ p, dist: Math.round(Math.hypot(p.x - j.location.x, p.z - j.location.z)) }))
    .sort((a, b) => a.dist - b.dist);
  if (!lista.length) return aviso(j, "cl.wy.partilha_vazia", 3);
  const f = new ActionFormData().title({ translate: "cl.wy.partilha", with: [cor] });
  for (const { p, dist } of lista) f.button({ translate: "cl.wy.item", with: [p.nome, String(dist)] });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const alvo = lista[r.selection].p;
  const b = world.getDimension(alvo.d).getBlock(alvo);
  if (b && !b.typeId.startsWith("cl:pedra_partilha")) {
    gravarPartilhas(partilhas().filter((x) => chaveDe(x) !== chaveDe(alvo)));
    return aviso(j, "cl.wy.sumiu", 3);
  }
  if (porXp && !pagarXp(j, alvo)) return;
  // irPara confere se é Pedra do Caminho; a de Partilha vai direto.
  j.teleport({ x: alvo.x + 0.5, y: alvo.y + 1, z: alvo.z + 0.5 }, { dimension: world.getDimension(alvo.d) });
  j.playSound("mob.endermen.portal");
  if (porXp) gastarFerramenta(j, 80);
  registrarAcao(j, "wy2_partilha");
}

export const pedraPartilha: BlockCustomComponent = {
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    const cor = corDe(b.typeId);
    if (!cor) return;
    if (!partilhas().some((p) => chaveDe(p) === chave(b, b.dimension.id))) {
      gravarPartilhas([...partilhas(), { d: b.dimension.id, x: b.x, y: b.y, z: b.z, nome: `${cor} ${partilhas().filter((p) => p.cor === cor).length + 1}`, cor }]);
    }
    abrirUmMenu(j, () => rede(j, cor, b));
  },
};
export const pedraPorto: BlockCustomComponent = {
  onPlayerInteract({ player: j, block: b }) {
    if (j) abrirUmMenu(j, () => rede(j, corDe(b.typeId)));
  },
};

// Placa de Dobra.
type Placa = { alvo?: { d: string; x: number; y: number; z: number } };
const LORE_ALVO = "§8@";
export const placaDobra: BlockCustomComponent = {
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    const inv = j.getComponent("minecraft:inventory")?.container;
    const mao = inv?.getItem(j.selectedSlotIndex);
    const aqui = { d: b.dimension.id, x: b.x, y: b.y, z: b.z };
    if (mao?.typeId === "cl:fragmento_dormente") {
      gastarDaMao(j);
      const f = new ItemStack("cl:fragmento_sintonizado", 1);
      f.setLore([`§7${b.x} ${b.y} ${b.z}`, `${LORE_ALVO}${aqui.d}|${aqui.x},${aqui.y},${aqui.z}`]);
      darAoJogador(j, f);
      return aviso(j, "cl.wy.placa_sintonizada", 3);
    }
    if (mao?.typeId === "cl:fragmento_sintonizado") {
      const linha = mao.getLore().find((l) => l.startsWith(LORE_ALVO));
      if (!linha) return;
      const [d, xyz] = linha.slice(LORE_ALVO.length).split("|");
      const [x, y, z] = xyz.split(",").map(Number);
      if (d === aqui.d && x === aqui.x && y === aqui.y && z === aqui.z) return aviso(j, "cl.wy.placa_sintonizada", 3);
      gravarEm("placa_dobra", b.dimension, b.location, { alvo: { d, x, y, z } } as Placa);
      gravarEm("placa_dobra", world.getDimension(d), { x, y, z }, { alvo: aqui } as Placa);
      gastarDaMao(j);
      j.playSound("beacon.activate");
      return aviso(j, "cl.wy.placa_ligada", 3);
    }
    aviso(j, "cl.wy.placa", 5);
  },
};
const emCima = new Map<string, number>();
function cuidarPlacas(): void {
  for (const j of world.getPlayers()) {
    let b: Block | undefined;
    try {
      b = j.dimension.getBlock({ x: Math.floor(j.location.x), y: Math.floor(j.location.y - 0.05), z: Math.floor(j.location.z) });
      if (b?.typeId !== "cl:placa_dobra") b = j.dimension.getBlock({ x: Math.floor(j.location.x), y: Math.floor(j.location.y), z: Math.floor(j.location.z) });
    } catch {
      continue;
    }
    if (b?.typeId !== "cl:placa_dobra") {
      emCima.delete(j.id);
      continue;
    }
    const p = lerEm<Placa>("placa_dobra", b.dimension, b.location, {});
    if (!p.alvo) continue;
    const n = (emCima.get(j.id) ?? 0) + 1;
    emCima.set(j.id, n);
    if (n === 1) aviso(j, "cl.wy.placa_indo", 2);
    if (n < 5) continue; // 2,5 s em cima
    emCima.delete(j.id);
    j.teleport({ x: p.alvo.x + 0.5, y: p.alvo.y + 0.2, z: p.alvo.z + 0.5 }, { dimension: world.getDimension(p.alvo.d) });
    j.playSound("mob.endermen.portal");
    registrarAcao(j, "wy2_placa");
  }
}

function vincular(j: Player, p: Pedra): void {
  gastarDaMao(j);
  const it = new ItemStack("cl:pergaminho_vinculado", 1);
  it.setLore([`§d${p.nome}`, `${LORE_ALVO}${p.d}|${p.x},${p.y},${p.z}`]);
  darAoJogador(j, it);
  aviso(j, { translate: "cl.wy.vinculado", with: [p.nome] }, 3);
  registrarAcao(j, "wy2_pergaminho");
}

function registrarWaystones26(): void {
  system.runInterval(cuidarPlacas, 10);
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id.startsWith("cl:pedra_partilha")) gravarPartilhas(partilhas().filter((x) => chaveDe(x) !== chave(block, block.dimension.id)));
    if (id === "cl:placa_dobra") gravarEm("placa_dobra", block.dimension, block.location, undefined);
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    const cor = block.typeId.startsWith("cl:pedra_partilha") ? corDe(block.typeId) : undefined;
    if (cor) gravarPartilhas([...partilhas(), { d: block.dimension.id, x: block.x, y: block.y, z: block.z, nome: `${cor} ${partilhas().filter((p) => p.cor === cor).length + 1}`, cor }]);
  });
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    const id = i.typeId;
    if (id.startsWith("cl:pedra_viagem_")) return abrirUmMenu(j, () => rede(j, corDe(id), undefined, true));
    if (id !== "cl:pergaminho_vinculado") return;
    const linha = i.getLore().find((l) => l.startsWith(LORE_ALVO));
    if (!linha) return;
    const [d, xyz] = linha.slice(LORE_ALVO.length).split("|");
    const [x, y, z] = xyz.split(",").map(Number);
    const p = pedras().find((q) => q.d === d && q.x === x && q.y === y && q.z === z);
    if (!p) return aviso(j, "cl.wy.sumiu", 3);
    system.run(() => {
      if (irPara(j, p)) gastarDaMao(j);
    });
  });
}

import { Block, BlockCustomComponent, Player, system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { registrarDetalhe } from "../util/dados.js";
import { gastarDaMao } from "../util/inventario.js";
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
const REGISTRO = "cl:pedras_caminho";
const ATIVAS = "cl:pedras_ativas";
const ULTIMA = "cl:ultima_pedra";
const ESPERA = "cl:pedra_viagem_ate";
const ESPERA_TICKS = 300 * 20;
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
  if (b && b.typeId !== PEDRA) {
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
        if (alvo) irPara(j, alvo);
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
    const ate = (j.getDynamicProperty(ESPERA) as number | undefined) ?? 0;
    const agora = world.getAbsoluteTime();
    if (ate > agora) return aviso(j, { translate: "cl.wy.espera", with: [String(Math.ceil((ate - agora) / 20))] }, 3);
    const alvo = await escolher(j);
    if (alvo && alvo !== "renomear" && irPara(j, alvo)) j.setDynamicProperty(ESPERA, world.getAbsoluteTime() + ESPERA_TICKS);
    return;
  }
  const alvo = await escolher(j);
  if (alvo && alvo !== "renomear" && irPara(j, alvo)) gastarDaMao(j);
}

export function registrarWaystones(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ block, player }) => {
    if (block.typeId !== PEDRA) return;
    const p: Pedra = { d: block.dimension.id, x: block.x, y: block.y, z: block.z, nome: `Pedra ${pedras().length + 1}` };
    gravarPedras([...pedras().filter((x) => chaveDe(x) !== chaveDe(p)), p]);
    ativar(player, p);
    abrirUmMenu(player, () => darNome(player, block));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== PEDRA) return;
    const k = chave(block, block.dimension.id);
    gravarPedras(pedras().filter((x) => chaveDe(x) !== k));
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    const id = itemStack.typeId;
    if (id !== "cl:pedra_viagem" && id !== "cl:pergaminho_viagem" && id !== "cl:pergaminho_retorno") return;
    abrirUmMenu(source, () => usarItem(source, id));
  });
  registrarDetalhe(PEDRA, (b) => {
    const p = daqui(b);
    return p ? { text: `§d${p.nome}` } : undefined;
  });
}

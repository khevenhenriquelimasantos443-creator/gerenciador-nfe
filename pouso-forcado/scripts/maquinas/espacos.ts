import { Block, Container, Entity, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { ITENS } from "../catalogo/gerado.js";
import { BLOCOS_ENERGIA, BLOCOS_ITENS, BLOCOS_MENU } from "../conteudo/energia.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { rf } from "../util/energia.js";
import { intervalo } from "../util/perfil.js";
import { energiaDaRede } from "../util/rede.js";
import { FORA } from "./fora_tela.js";
import { abrirTelaMaquina } from "./tela.js";
import { estadoMaquina } from "./thermal.js";

/*
 * 1.57.0: as máquinas com tela de espaços, como no Java. Um bloco não tem tela no Bedrock: em cima da máquina fica uma
 * entidade invisível com a tela de baú do jogo (27 espaços): a entrada são os 9 espaços da esquerda e a saída os 9
 * da direita; no meio, setas, o estado da máquina (energia) e a ajuda (cl:gui_*, que somem se saírem da tela).
 * - A entidade só "aparece" (fica do tamanho do bloco) quando alguém perto está de mão vazia: com item na mão o toque
 *   vai para a máquina, como antes (balde, melhoria, chave, frasco de alma...). Bater de mão vazia esconde por 3 s
 *   (para quebrar a máquina na mão).
 * - util/maquina.ts: a entrada é o baú em cima (se houver) e senão estes espaços; a saída, o baú embaixo ou estes.
 *   Com a saída cheia a máquina para (como no Java); antes, sem baú, ela soltava no chão.
 * - Quem ganha: os blocos que usam entrada/saída (BLOCOS_ITENS, do tools/gerar-energia.mjs), menos os que têm menu
 *   próprio (BLOCOS_MENU), os de toque próprio (fora_tela.ts) e os tanques. Máquina posta antes da 1.57.0 ganha os
 *   espaços no primeiro toque de mão vazia.
 * - Agachado + tocar: a tela de detalhes de antes (tela.ts), com o Catálogo.
 * Custo: as máquinas com alguém a até 8 blocos (lista refeita a cada segundo; mostrar/esconder e enfeites a cada
 * 4 ticks; estado a cada segundo). A busca da entidade pela máquina fica guardada.
 */
const ENT = "cl:maquina_tela";
const COM = new Set(
  BLOCOS_ITENS.filter((id) => !BLOCOS_MENU.includes(id) && !FORA.has(id) && !id.startsWith("cl:tanque_")),
);
export const temEspacos = (id: string): boolean => COM.has(id);
const ENERGIA_SET = new Set(BLOCOS_ENERGIA);

const ENTRADA = [0, 1, 2, 9, 10, 11, 18, 19, 20];
const SAIDA = [5, 6, 7, 14, 15, 16, 23, 24, 25];
const STATUS = 4;
const FIXOS = new Map<number, string>([
  [3, "cl:gui_entrada"], [12, "cl:gui_vazio"], [21, "cl:gui_vazio"], [13, "cl:gui_seta"], [22, "cl:gui_vazio"],
  [8, "cl:gui_saida"], [17, "cl:gui_vazio"], [26, "cl:gui_ajuda_maquina"], [STATUS, "cl:gui_status"],
]);
const ehGui = (id: string | undefined) => !!id?.startsWith("cl:gui_");

/** Parte do inventário da entidade vista como um inventário (o que util/maquina.ts usa: tamanho, pegar, pôr, somar). */
class Vista {
  constructor(private readonly c: Container, private readonly slots: readonly number[]) {}
  get isValid(): boolean {
    return this.c.isValid;
  }
  get size(): number {
    return this.slots.length;
  }
  get emptySlotsCount(): number {
    return this.slots.filter((s) => !this.c.getItem(s)).length;
  }
  getItem(i: number): ItemStack | undefined {
    const s = this.slots[i];
    return s === undefined ? undefined : this.c.getItem(s);
  }
  setItem(i: number, item?: ItemStack): void {
    const s = this.slots[i];
    if (s !== undefined) this.c.setItem(s, item);
  }
  clearAll(): void {
    for (const s of this.slots) this.c.setItem(s, undefined);
  }
  addItem(item: ItemStack): ItemStack | undefined {
    let falta = item.amount;
    for (const s of this.slots) {
      const p = this.c.getItem(s);
      if (!p || !p.isStackableWith(item) || p.amount >= p.maxAmount) continue;
      const n = Math.min(p.maxAmount - p.amount, falta);
      p.amount += n;
      this.c.setItem(s, p);
      falta -= n;
      if (falta <= 0) return undefined;
    }
    for (const s of this.slots) {
      if (this.c.getItem(s)) continue;
      const p = item.clone();
      p.amount = Math.min(falta, item.maxAmount);
      this.c.setItem(s, p);
      falta -= p.amount;
      if (falta <= 0) return undefined;
    }
    const resto = item.clone();
    resto.amount = falta;
    return resto;
  }
}

// ---------- a entidade de cada máquina ----------
const centro = (b: Vector3): Vector3 => ({ x: b.x + 0.5, y: b.y - 0.01, z: b.z + 0.5 });
const chave = (b: Block) => `${b.dimension.id}|${b.x}|${b.y}|${b.z}`;
const blocoDe = (m: Entity) => m.dimension.getBlock({ x: Math.floor(m.location.x), y: Math.floor(m.location.y + 0.1), z: Math.floor(m.location.z) });
const porBloco = new Map<string, string>();
const semEntidade = new Map<string, number>();
const vistas = new Map<string, { c: Container; entrada: Vista; saida: Vista }>();

function entidadeDe(b: Block): Entity | undefined {
  const k = chave(b);
  const id = porBloco.get(k);
  if (id) {
    const m = world.getEntity(id);
    if (m?.isValid) return m;
    porBloco.delete(k);
  }
  const visto = semEntidade.get(k);
  if (visto !== undefined && system.currentTick - visto < 200) return undefined;
  let m: Entity | undefined;
  try {
    m = b.dimension.getEntities({ type: ENT, location: centro(b), maxDistance: 0.6 })[0];
  } catch {
    m = undefined;
  }
  if (m) {
    porBloco.set(k, m.id);
    semEntidade.delete(k);
  } else semEntidade.set(k, system.currentTick);
  return m;
}

/** Os espaços de entrada e saída da máquina (para util/maquina.ts), se ela tem. */
export function espacosDe(b: Block): { entrada: Vista; saida: Vista } | undefined {
  if (!COM.has(b.typeId)) return undefined;
  const m = entidadeDe(b);
  if (!m) return undefined;
  let v = vistas.get(m.id);
  if (!v || !v.c.isValid) {
    const c = m.getComponent("minecraft:inventory")?.container;
    if (!c) return undefined;
    v = { c, entrada: new Vista(c, ENTRADA), saida: new Vista(c, SAIDA) };
    vistas.set(m.id, v);
  }
  return v;
}

/** Põe a entidade da máquina (se ainda não tem). Devolve [entidade, se é nova]. */
export function garantirEspacos(b: Block): [Entity, boolean] | undefined {
  if (!COM.has(b.typeId)) return undefined;
  const ja = entidadeDe(b);
  if (ja) return [ja, false];
  let m: Entity;
  try {
    m = b.dimension.spawnEntity(ENT, centro(b));
  } catch {
    return undefined;
  }
  m.nameTag = ITENS[b.typeId]?.pt ?? "Máquina";
  porBloco.set(chave(b), m.id);
  semEntidade.delete(chave(b));
  arrumar(m);
  return [m, true];
}

/** A máquina saiu: solta o que estava na entrada e na saída e some com a entidade. */
function desmontar(m: Entity): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (c)
    for (const s of [...ENTRADA, ...SAIDA]) {
      const i = c.getItem(s);
      if (i && !ehGui(i.typeId)) m.dimension.spawnItem(i, m.location);
    }
  c?.clearAll();
  vistas.delete(m.id);
  mostrando.delete(m.id);
  m.remove();
}

// ---------- jogadores, enfeites e estado ----------
function jogadoresPerto(m: Entity, d = 8): Player[] {
  try {
    return m.dimension.getPlayers({ location: m.location, maxDistance: d });
  } catch {
    return [];
  }
}
function limparGui(m: Entity): void {
  for (const j of jogadoresPerto(m)) {
    const cur = j.getComponent("minecraft:cursor_inventory");
    if (ehGui(cur?.item?.typeId)) cur?.clear();
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (inv) for (let s = 0; s < inv.size; s++) if (ehGui(inv.getItem(s)?.typeId)) inv.setItem(s, undefined);
  }
}
function devolver(m: Entity, i: ItemStack): void {
  if (ehGui(i.typeId)) return;
  const j = jogadoresPerto(m)[0];
  const resto = j ? j.getComponent("minecraft:inventory")?.container?.addItem(i) : i;
  if (resto) m.dimension.spawnItem(resto, m.location);
}

const textoStatus = new Map<string, string>();
function status(b: Block): string {
  const partes: string[] = [`§f${ITENS[b.typeId]?.pt ?? b.typeId}`];
  const est = estadoMaquina(b);
  if (est) partes.push(est === "ok" ? "§aTrabalhando" : est === "sem_energia" ? "§cSem energia" : "§eParada");
  if (ENERGIA_SET.has(b.typeId)) {
    const e = energiaDaRede(b);
    partes.push(e.armazens ? `§7Energia: §b${rf(e.carga)}§7 de ${rf(e.capacidade)}` : "§7Sem bateria ligada (use cabos)");
  }
  return partes.join(" §8| ");
}

const saidas = new Map<string, number>();
/** Enfeites no lugar, nada estranho nas entradas; e quem tirou da saída cumpre a missão. */
function arrumar(m: Entity): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  let tirouGui = false;
  for (const [s, id] of FIXOS) {
    const i = c.getItem(s);
    if (i?.typeId === id) continue;
    if (i) devolver(m, i);
    tirouGui = true;
    const novo = new ItemStack(id, 1);
    if (s === STATUS && textoStatus.has(m.id)) novo.nameTag = textoStatus.get(m.id);
    c.setItem(s, novo);
  }
  for (const s of [...ENTRADA, ...SAIDA])
    if (ehGui(c.getItem(s)?.typeId)) {
      c.setItem(s, undefined);
      tirouGui = true;
    }
  if (tirouGui) limparGui(m);
  const total = SAIDA.reduce((n, s) => n + (c.getItem(s)?.amount ?? 0), 0);
  const antes = saidas.get(m.id);
  saidas.set(m.id, total);
  if (antes !== undefined && total < antes) {
    const j = jogadoresPerto(m, 6)[0];
    if (j) registrarAcao(j, "esp_maquina");
  }
}

// ---------- mostrar (mão vazia perto) ou esconder ----------
const mostrando = new Map<string, boolean>();
const escondidoAte = new Map<string, number>();
function ajustar(m: Entity, mao: { loc: Vector3; vazia: boolean; dim: string }[]): void {
  const livre = (escondidoAte.get(m.id) ?? 0) <= system.currentTick;
  const l = m.location;
  const quer = livre && mao.some((p) => p.vazia && p.dim === m.dimension.id && (p.loc.x - l.x) ** 2 + (p.loc.y - l.y) ** 2 + (p.loc.z - l.z) ** 2 <= 36);
  if (mostrando.get(m.id) === quer) return;
  mostrando.set(m.id, quer);
  try {
    m.triggerEvent(quer ? "cl:mostrar" : "cl:esconder");
  } catch {
    // entidade saindo
  }
}

let ativas: Entity[] = [];
export function registrarEspacos(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (!COM.has(block.typeId) || !garantirEspacos(block)) return;
    aviso(player, "cl.esp.dica", 5);
  });
  // Quebrou a máquina (com ferramenta a entidade está escondida e o bloco quebra normal): solta os espaços.
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (!COM.has(brokenBlockPermutation.type.id)) return;
    const k = chave(block);
    const id = porBloco.get(k);
    const m = id ? world.getEntity(id) : block.dimension.getEntities({ type: ENT, location: centro(block), maxDistance: 0.6 })[0];
    porBloco.delete(k);
    if (m?.isValid) desmontar(m);
  });
  world.afterEvents.blockExplode.subscribe(({ block, explodedBlockPermutation }) => {
    if (!COM.has(explodedBlockPermutation.type.id)) return;
    porBloco.delete(chave(block));
    for (const m of block.dimension.getEntities({ type: ENT, location: centro(block), maxDistance: 0.6 })) desmontar(m);
  });
  // Agachado + tocar: a tela de detalhes de antes (com o Catálogo).
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId !== ENT || !ev.player.isSneaking) return;
    ev.cancel = true;
    const j = ev.player, m = ev.target;
    system.run(() => {
      const b = m.isValid ? blocoDe(m) : undefined;
      if (b && COM.has(b.typeId)) abrirTelaMaquina(j, b);
    });
  });
  // Bater de mão vazia: some por 3 s (para quebrar a máquina na mão).
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (hitEntity.typeId !== ENT || !(damagingEntity instanceof Player)) return;
    escondidoAte.set(hitEntity.id, system.currentTick + 60);
    system.run(() => hitEntity.isValid && ajustar(hitEntity, []));
  });
  // A cada segundo: as máquinas com alguém perto (e as que perderam o bloco) e o estado delas.
  intervalo("espaços das máquinas (lista)", () => {
    const vistasAgora = new Map<string, Entity>();
    for (const j of world.getPlayers())
      for (const m of j.dimension.getEntities({ type: ENT, location: j.location, maxDistance: 8 })) {
        if (vistasAgora.has(m.id)) continue;
        const b = blocoDe(m);
        if (!b || !COM.has(b.typeId)) {
          desmontar(m);
          continue;
        }
        porBloco.set(chave(b), m.id);
        vistasAgora.set(m.id, m);
        if (!mostrando.get(m.id)) continue; // o estado (com a busca da energia na rede) só quando a tela pode abrir
        const txt = status(b);
        if (textoStatus.get(m.id) !== txt) {
          textoStatus.set(m.id, txt);
          const i = new ItemStack("cl:gui_status", 1);
          i.nameTag = txt;
          m.getComponent("minecraft:inventory")?.container?.setItem(STATUS, i);
        }
      }
    ativas = [...vistasAgora.values()];
  }, 20);
  intervalo("espaços das máquinas", () => {
    if (!ativas.length) return;
    const mao = world.getPlayers().map((j) => {
      const inv = j.getComponent("minecraft:inventory")?.container;
      return { loc: j.location, dim: j.dimension.id, vazia: !inv?.getItem(j.selectedSlotIndex) };
    });
    for (const m of ativas) {
      if (!m.isValid) continue;
      ajustar(m, mao);
      if (mostrando.get(m.id)) arrumar(m);
    }
  }, 4);
}

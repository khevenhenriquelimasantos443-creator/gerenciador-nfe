import { Dimension, EasingType, Entity, InputPermissionCategory, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";
import { toqueNovo } from "../util/toque.js";
import { chunkPronto } from "./lua.js";
import { COMBUSTIVEL, combustivelDoFoguete, itemFoguete } from "./maquinas.js";
import { LUA, prontoParaLua, semRespirar } from "./oxigenio.js";

/*
 * O Foguete Tier 1 do Galacticraft. O item só fica de pé no meio de uma Plataforma de Lançamento 3×3; o
 * Carregador de Combustível encostado na plataforma enche o tanque (1.000 mB). Tocar no foguete abre o menu:
 * combustível, destino e o botão Lançar. A viagem gasta o tanque todo saindo do planeta e 70% saindo da Lua
 * (o multiplicador de combustível da Lua no Galacticraft é 0,7).
 * A viagem é uma cena com a câmera do jogo (como a decolagem final): contagem de 10 s, o foguete sobe em fogo,
 * tela preta, e na chegada o foguete desce de ré no lugar de mesma coordenada X/Z do outro lado. Ele fica no
 * chão com o que sobrou de combustível; para voltar é preciso recolhê-lo e pôr numa plataforma de novo (leve
 * plataformas, um carregador, energia e combustível).
 * Se o jogo fechar no meio da viagem, o foguete volta para o inventário ao entrar de novo.
 */
const FOGUETE = "cl:foguete";
const PLATAFORMA = "cl:plataforma_lancamento";
const ITEM = "cl:foguete_t1";
const CONTAGEM = 10; // segundos
const SUBIDA = 120; // ticks subindo
const DESCIDA = 100; // ticks descendo na chegada
const ALTURA_ESPERA = 200;
const custo = (dimId: string): number => (dimId === LUA ? Math.round(COMBUSTIVEL.foguete * 0.7) : COMBUSTIVEL.foguete);
const mais = (a: Vector3, x: number, y: number, z: number): Vector3 => ({ x: a.x + x, y: a.y + y, z: a.z + z });

function travar(j: Player, travado: boolean): void {
  try {
    for (const c of [InputPermissionCategory.Movement, InputPermissionCategory.Camera]) j.inputPermissions.setPermissionCategory(c, !travado);
  } catch {
    // sem permissões de entrada
  }
}
function titulo(j: Player, t: RawMessage, s?: RawMessage, ficar = 40): void {
  if (j.isValid) j.onScreenDisplay.setTitle(t, { subtitle: s, fadeInDuration: 10, stayDuration: ficar, fadeOutDuration: 10 });
}
function fogo(dim: Dimension, p: Vector3, forte: boolean): void {
  try {
    dim.spawnParticle("minecraft:basic_flame_particle", mais(p, Math.random() * 0.6 - 0.3, -0.3, Math.random() * 0.6 - 0.3));
    dim.spawnParticle("minecraft:basic_flame_particle", mais(p, Math.random() * 0.6 - 0.3, -0.8, Math.random() * 0.6 - 0.3));
    if (forte) dim.spawnParticle("minecraft:large_explosion", mais(p, 0, -1.5, 0));
    dim.spawnParticle("minecraft:campfire_tall_smoke_particle", mais(p, 0, -2, 0));
  } catch {
    // chunk fora
  }
}

/** A plataforma 3×3 completa com centro em (x, y, z)? */
function padCompleto(dim: Dimension, x: number, y: number, z: number): boolean {
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (dim.getBlock({ x: x + dx, y, z: z + dz })?.typeId !== PLATAFORMA) return false;
  return true;
}
/** O centro de uma plataforma completa que inclui o bloco tocado. */
function centroDa(dim: Dimension, b: Vector3): Vector3 | undefined {
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) if (padCompleto(dim, b.x + dx, b.y, b.z + dz)) return { x: b.x + dx, y: b.y, z: b.z + dz };
  return undefined;
}
function sobrePlataforma(f: Entity): boolean {
  const { x, y, z } = f.location;
  return padCompleto(f.dimension, Math.floor(x), Math.floor(y), Math.floor(z));
}

// ---------- Viagem ----------
const emViagem = new Set<string>();

function terminarViagem(j: Player): void {
  emViagem.delete(j.id);
  semRespirar.delete(j.id);
  if (!j.isValid) return;
  j.setDynamicProperty("cl:viagem", undefined);
  j.camera.clear();
  travar(j, false);
  j.removeEffect("invisibility");
}

function pousar(j: Player, dim: Dimension, x: number, y: number, z: number, comb: number, paraLua: boolean): void {
  const alvo = { x: x + 0.5, y, z: z + 0.5 };
  let lado;
  try {
    lado = dim.getTopmostBlock({ x: x + 3, z });
  } catch {
    lado = undefined;
  }
  j.teleport({ x: x + 3.5, y: lado ? lado.y + 1 : y, z: z + 0.5 }, { dimension: dim, facingLocation: alvo });
  j.camera.setCamera("minecraft:free", { location: mais(alvo, 10, 6, 10), facingLocation: mais(alvo, 0, 30, 0) });
  j.camera.setCamera("minecraft:free", { location: mais(alvo, 9, 4, 9), facingLocation: mais(alvo, 0, 2, 0), easeOptions: { easeTime: DESCIDA / 20, easeType: EasingType.OutQuad } });
  j.camera.fade({ fadeTime: { fadeInTime: 0, holdTime: 0.3, fadeOutTime: 1.5 }, fadeColor: { red: 0, green: 0, blue: 0 } });
  const f = dim.spawnEntity(FOGUETE, mais(alvo, 0, 60, 0));
  f.setDynamicProperty("cl:comb", comb);
  for (let t = 1; t <= DESCIDA; t++) {
    system.runTimeout(() => {
      if (!f.isValid) return;
      const h = 60 * (1 - t / DESCIDA) ** 2;
      const p = mais(alvo, 0, h, 0);
      f.teleport(p);
      if (t % 2 === 0) fogo(dim, p, t > DESCIDA - 20);
    }, t);
  }
  system.runTimeout(() => {
    dim.playSound("random.explode", alvo, { volume: 1.5, pitch: 1.4 });
    terminarViagem(j);
    if (!j.isValid) return;
    if (paraLua) titulo(j, { translate: "cl.gc.chegando_lua" }, { translate: "cl.gc.chegando_lua_sub" }, 60);
    else titulo(j, { translate: "cl.gc.chegando_terra" }, { translate: "cl.gc.chegando_terra_sub" }, 60);
    registrarAcao(j, paraLua ? "lua" : "voltar_lua");
  }, DESCIDA + 10);
}

function viajar(j: Player, paraLua: boolean, comb: number, x: number, z: number): void {
  const destino = world.getDimension(paraLua ? LUA : "minecraft:overworld");
  const bx = Math.floor(x), bz = Math.floor(z);
  const espera = { x: bx + 0.5, y: ALTURA_ESPERA, z: bz + 0.5 };
  j.teleport(espera, { dimension: destino });
  let tentativas = 0;
  const id = system.runInterval(() => {
    tentativas++;
    if (!j.isValid) {
      system.clearRun(id);
      emViagem.delete(j.id);
      return;
    }
    // Segura a tela preta e o jogador lá em cima até o chão do destino existir.
    j.camera.fade({ fadeTime: { fadeInTime: 0, holdTime: 1, fadeOutTime: 0.2 }, fadeColor: { red: 0, green: 0, blue: 0 } });
    let topo;
    try {
      const pronto = paraLua ? chunkPronto(destino, bx, bz) : destino.isChunkLoaded({ x: bx, y: 0, z: bz });
      topo = pronto ? destino.getTopmostBlock({ x: bx, z: bz }) : undefined;
    } catch {
      topo = undefined;
    }
    if (!topo && tentativas < 120) {
      j.teleport(espera, { dimension: destino });
      return;
    }
    system.clearRun(id);
    pousar(j, destino, bx, topo ? topo.y + 1 : 80, bz, comb, paraLua);
  }, 10);
}

function lancar(j: Player, f: Entity): void {
  if (emViagem.has(j.id) || !f.isValid) return;
  const dim = f.dimension;
  const paraLua = dim.id !== LUA;
  const comb = combustivelDoFoguete(f);
  const sobra = comb - custo(dim.id);
  if (sobra < 0) return;
  emViagem.add(j.id);
  semRespirar.add(j.id);
  j.setDynamicProperty("cl:viagem", comb);
  const base = { ...f.location };
  travar(j, true);
  j.addEffect("resistance", CONTAGEM * 20 + SUBIDA + 600, { amplifier: 255, showParticles: false });
  j.addEffect("invisibility", CONTAGEM * 20 + SUBIDA + 600, { showParticles: false });
  j.camera.setCamera("minecraft:free", { location: mais(base, 9, 3, 9), facingLocation: mais(base, 0, 2, 0), easeOptions: { easeTime: 1.5, easeType: EasingType.InOutSine } });
  for (let s = CONTAGEM; s >= 1; s--) {
    system.runTimeout(() => {
      titulo(j, { text: `§6${s}` }, { translate: "cl.gc.contagem" }, 14);
      dim.playSound("note.bass", base, { pitch: 0.5 + (CONTAGEM - s) * 0.08, volume: 1.5 });
      if (s <= 3) fogo(dim, base, false);
    }, (CONTAGEM - s) * 20);
  }
  const t0 = CONTAGEM * 20;
  system.runTimeout(() => {
    titulo(j, { translate: "cl.gc.decolando" }, undefined, 40);
    dim.playSound("random.explode", base, { volume: 3, pitch: 0.7 });
    dim.playSound("firework.launch", base, { volume: 3, pitch: 0.5 });
    if (j.isValid) j.camera.setCamera("minecraft:free", { location: mais(base, 16, 30, 16), facingLocation: mais(base, 0, 110, 0), easeOptions: { easeTime: SUBIDA / 20, easeType: EasingType.InQuad } });
  }, t0);
  for (let t = 1; t <= SUBIDA; t++) {
    system.runTimeout(() => {
      if (!f.isValid) return;
      const p = mais(base, 0, ((t / SUBIDA) ** 2) * 140, 0);
      f.teleport(p);
      if (t % 2 === 0) fogo(dim, p, t < 30);
    }, t0 + t);
  }
  system.runTimeout(() => {
    if (j.isValid) j.camera.fade({ fadeTime: { fadeInTime: 1, holdTime: 2, fadeOutTime: 0.5 }, fadeColor: { red: 0, green: 0, blue: 0 } });
    system.runTimeout(() => {
      if (f.isValid) f.remove();
      if (j.isValid) viajar(j, paraLua, sobra, base.x, base.z);
      else emViagem.delete(j.id);
    }, 25);
  }, t0 + SUBIDA);
}

// ---------- Menu ----------
function recolher(j: Player, f: Entity): void {
  if (!f.isValid) return;
  const comb = combustivelDoFoguete(f);
  f.remove();
  darAoJogador(j, itemFoguete(comb));
  aviso(j, { translate: "cl.gc.recolhido", with: [String(comb)] }, 4);
}

async function menu(j: Player, f: Entity): Promise<void> {
  const comb = combustivelDoFoguete(f);
  const paraLua = f.dimension.id !== LUA;
  const gasto = custo(f.dimension.id);
  const naPlataforma = sobrePlataforma(f);
  const pode = naPlataforma && comb >= gasto;
  const estado: RawMessage[] = [{ translate: !naPlataforma ? "cl.gc.foguete.sem_plataforma" : pode ? "cl.gc.foguete.pode" : "cl.gc.foguete.sem_comb" }];
  if (paraLua) estado.push({ text: "\n\n§7" }, { translate: "cl.gc.foguete.lembrete" });
  const form = new ActionFormData()
    .title({ translate: "cl.gc.foguete.titulo" })
    .body({ translate: "cl.gc.foguete.corpo", with: { rawtext: [{ text: String(comb) }, { translate: paraLua ? "cl.gc.lua" : "cl.gc.terra" }, { text: String(gasto) }, { rawtext: estado }] } });
  const acoes: Array<() => void | Promise<void>> = [];
  if (pode) {
    form.button({ translate: "cl.gc.foguete.lancar" });
    acoes.push(async () => {
      if (paraLua && !prontoParaLua(j)) {
        const c = await new MessageFormData().title({ translate: "cl.gc.foguete.titulo" }).body({ translate: "cl.gc.foguete.sem_ox" }).button1({ translate: "cl.gc.foguete.fechar" }).button2({ translate: "cl.gc.foguete.lancar" }).show(j);
        if (c.canceled || c.selection !== 1) return;
      }
      lancar(j, f);
    });
  }
  form.button({ translate: "cl.gc.foguete.recolher" });
  acoes.push(() => recolher(j, f));
  form.button({ translate: "cl.gc.foguete.fechar" });
  acoes.push(() => undefined);
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined || !f.isValid || emViagem.has(j.id)) return;
  await acoes[r.selection]();
}

export function registrarFoguete(): void {
  // Pôr o foguete: só no meio de uma plataforma 3×3 (tocando em qualquer bloco dela).
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== ITEM || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    const comb = (ev.itemStack.getDynamicProperty("cl:comb") as number | undefined) ?? 0;
    system.run(() => {
      const centro = b.typeId === PLATAFORMA ? centroDa(b.dimension, b.location) : undefined;
      if (!centro) return aviso(j, "cl.gc.foguete.so_plataforma", 5);
      const p = { x: centro.x + 0.5, y: centro.y + 0.19, z: centro.z + 0.5 };
      if (b.dimension.getEntities({ type: FOGUETE, location: p, maxDistance: 1.5 }).length) return;
      const f = b.dimension.spawnEntity(FOGUETE, p);
      f.setDynamicProperty("cl:comb", comb);
      gastarDaMao(j);
      j.playSound("random.anvil_land", { volume: 0.6 });
    });
  });
  const ultimo = new Map<string, number>();
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId !== FOGUETE) return;
    ev.cancel = true;
    const { player: j, target: f } = ev;
    if (system.currentTick - (ultimo.get(j.id) ?? -99) < 10) return;
    ultimo.set(j.id, system.currentTick);
    system.run(() => void menu(j, f));
  });
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_foguete lança o foguete mais perto, cheio.
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    if (id !== "cl:teste_foguete" || !(j instanceof Player)) return;
    const f = j.dimension.getEntities({ type: FOGUETE, location: j.location, maxDistance: 8, closest: 1 })[0];
    if (!f) return console.warn("[Pouso Forçado] teste_foguete: nenhum foguete perto");
    f.setDynamicProperty("cl:comb", COMBUSTIVEL.foguete);
    lancar(j, f);
  });
  // Jogo fechado no meio da viagem: o foguete volta, com o combustível de antes.
  world.afterEvents.playerSpawn.subscribe(({ player: j, initialSpawn }) => {
    if (!initialSpawn || !j.isValid || emViagem.has(j.id)) return;
    const comb = j.getDynamicProperty("cl:viagem");
    if (typeof comb !== "number") return;
    terminarViagem(j);
    darAoJogador(j, itemFoguete(comb));
  });
}

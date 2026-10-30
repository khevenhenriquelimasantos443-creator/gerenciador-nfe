import { Block, Dimension, Direction, Entity, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarDaMao } from "../util/inventario.js";
import { inv } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";

/*
 * Robô Minerador (1.10.0): a Mining Turtle do ComputerCraft, com os dois programas que todo mundo usava:
 * - "tunnel N": túnel de 3 de largura por 2 de altura e N de comprimento, pondo pedregulho no chão onde faltar;
 * - "excavate N": buraco de N×N, camada por camada, até o fundo do mundo (para na rocha-mãe).
 * Combustível como no ComputerCraft (tempo de queima × 5 / 100): carvão 80, bloco de carvão 800, balde de lava 1.000,
 * vara de blaze 120, madeira 15, graveto 5. Cada passo gasta 1 (o túnel gasta 3 por fatia, como o programa original).
 * 16 espaços de inventário; cheio, volta e despeja no baú atrás do ponto de partida (sem baú, solta lá) e retoma.
 * Uma ação a cada 8 ticks (0,4 s, o tempo de cavar ou andar de uma turtle).
 */
const ROBO = "cl:robo_minerador";
const COMB = "cl:comb";
const PROG = "cl:prog";
const DONO = "cl:dono";
const COMBUSTIVEL: Readonly<Record<string, number>> = {
  "minecraft:coal": 80, "minecraft:charcoal": 80, "minecraft:coal_block": 800, "minecraft:lava_bucket": 1000,
  "minecraft:blaze_rod": 120, "minecraft:stick": 5,
  ...Object.fromEntries(["oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry"].flatMap((m) => [[`minecraft:${m}_planks`, 15], [`minecraft:${m}_log`, 15]])),
};
const INQUEBRAVEIS = new Set([
  "minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:structure_block", "minecraft:end_portal_frame",
  "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava", "cl:bau_tesouro", "cl:painel_nave",
]);
// Frente e direita de cada direção (0 norte, 1 leste, 2 sul, 3 oeste) e o giro do modelo.
const FRENTE: ReadonlyArray<[number, number]> = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const GIRO = [180, -90, 0, 90];
type Prog = { t: "tunel" | "escavar"; n: number; o: [number, number, number]; f: number; i: number; m: number; fundo?: boolean };

const lerProg = (r: Entity): Prog | undefined => {
  try {
    const v = r.getDynamicProperty(PROG);
    return typeof v === "string" ? (JSON.parse(v) as Prog) : undefined;
  } catch {
    return undefined;
  }
};
const gravarProg = (r: Entity, p: Prog | undefined) => r.setDynamicProperty(PROG, p ? JSON.stringify(p) : undefined);
const comb = (r: Entity) => (r.getDynamicProperty(COMB) as number | undefined) ?? 0;
const container = (r: Entity) => r.getComponent("minecraft:inventory")?.container;
const centro = (p: Vector3) => ({ x: p.x + 0.5, y: p.y, z: p.z + 0.5 });
const blocoDo = (r: Entity) => ({ x: Math.floor(r.location.x), y: Math.floor(r.location.y), z: Math.floor(r.location.z) });
const dist = (a: Vector3, b: Vector3) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
const origem = (p: Prog) => ({ x: p.o[0], y: p.o[1], z: p.o[2] });

function dono(r: Entity): Player | undefined {
  const id = r.getDynamicProperty(DONO);
  return world.getPlayers().find((j) => j.id === id) ?? r.dimension.getPlayers({ location: r.location, maxDistance: 48, closest: 1 })[0];
}

/** O bloco e a posição que o robô ocupa no passo i (ou undefined: acabou). */
function alvo(p: Prog, dim: Dimension): { cavar: Vector3; ir?: Vector3; gasto: number } | undefined {
  const [fx, fz] = FRENTE[p.f];
  const [dx, dz] = FRENTE[(p.f + 1) % 4];
  const o = origem(p);
  const em = (a: number, b: number, h: number) => ({ x: o.x + fx * a + dx * b, y: o.y + h, z: o.z + fz * a + dz * b });
  if (p.t === "tunel") {
    const s = Math.floor(p.i / 6) + 1, k = p.i % 6;
    if (s > p.n) return undefined;
    const lado = [0, 0, -1, -1, 1, 1][k], alto = [0, 1, 0, 1, 0, 1][k];
    return k === 0 ? { cavar: em(s, 0, 0), ir: em(s, 0, 0), gasto: 3 } : { cavar: em(s, lado, alto), gasto: 0 };
  }
  const area = p.n * p.n;
  const camada = Math.floor(p.i / area) + 1, j = p.i % area;
  if (j === 0 && camada > 1 && p.fundo) return undefined;
  const y = o.y - camada;
  if (y <= dim.heightRange.min) return undefined;
  const linha = Math.floor(j / p.n);
  const col = linha % 2 ? p.n - 1 - (j % p.n) : j % p.n;
  const pos = em(col, linha, -camada);
  return { cavar: pos, ir: pos, gasto: 1 };
}

function recolher(r: Entity, onde: Vector3): void {
  const c = container(r);
  if (!c || !r.isValid) return;
  for (const e of r.dimension.getEntities({ type: "minecraft:item", location: { x: onde.x + 0.5, y: onde.y + 0.5, z: onde.z + 0.5 }, maxDistance: 2 })) {
    const pilha = e.getComponent("minecraft:item")?.itemStack;
    if (!pilha) continue;
    if (!c.addItem(pilha)) e.remove();
  }
}

/** Despeja tudo no baú atrás do ponto de partida (ou solta lá). */
function despejar(r: Entity, p: Prog): void {
  const c = container(r);
  if (!c) return;
  const [fx, fz] = FRENTE[p.f];
  const o = origem(p);
  const bau = inv(r.dimension.getBlock({ x: o.x - fx, y: o.y, z: o.z - fz }));
  for (let k = 0; k < c.size; k++) {
    const i = c.getItem(k);
    if (!i) continue;
    const sobra = bau ? bau.addItem(i) : i;
    c.setItem(k, undefined);
    if (sobra) r.dimension.spawnItem(sobra, centro(o));
  }
}

function mover(r: Entity, pos: Vector3, f: number): void {
  r.teleport(centro(pos), { rotation: { x: 0, y: GIRO[f] } });
}

function terminar(r: Entity, p: Prog, chave: string): void {
  mover(r, origem(p), p.f);
  despejar(r, p);
  gravarProg(r, undefined);
  const j = dono(r);
  if (!j) return;
  aviso(j, chave === "cl.robo.terminou" ? { translate: chave, with: [String(p.m)] } : chave, 6);
  if (chave === "cl.robo.terminou") registrarAcao(j, "robo");
}

const quebravel = (b: Block) => !b.isAir && !b.isLiquid && !INQUEBRAVEIS.has(b.typeId) && !b.getComponent("minecraft:inventory");

/** Uma ação do robô: cava um bloco e/ou anda um passo. */
function passo(r: Entity): void {
  const p = lerProg(r);
  if (!p) return;
  const dim = r.dimension;
  for (let tentativas = 0; tentativas < 6; tentativas++) {
    const a = alvo(p, dim);
    if (!a) return terminar(r, p, "cl.robo.terminou");
    const b = dim.getBlock(a.cavar);
    if (!b) return; // chunk ainda não carregado: espera
    if (b.typeId === "minecraft:bedrock" && p.t === "escavar") p.fundo = true;
    const cavar = quebravel(b);
    if (a.ir) {
      const resta = comb(r) - a.gasto;
      if (resta < dist(a.ir, origem(p)) || (!cavar && !b.isAir && !b.isLiquid)) {
        // Sem combustível para ir e voltar (ou bloco que não dá para cavar no caminho do robô).
        if (resta < dist(a.ir, origem(p))) return terminar(r, p, "cl.robo.sem_combustivel");
        p.i++;
        continue;
      }
    }
    if (cavar) {
      dim.runCommand(`setblock ${a.cavar.x} ${a.cavar.y} ${a.cavar.z} air destroy`);
      p.m++;
      const onde = a.cavar;
      system.runTimeout(() => recolher(r, onde), 2);
    }
    if (a.ir) {
      r.setDynamicProperty(COMB, comb(r) - a.gasto);
      mover(r, a.ir, p.f);
      if (p.t === "tunel") pisar(r, a.ir);
    }
    p.i++;
    // Cheio: volta, despeja e retoma de onde parou.
    const c = container(r);
    if (c && c.emptySlotsCount === 0) {
      const aqui = blocoDo(r);
      despejar(r, p);
      r.setDynamicProperty(COMB, Math.max(0, comb(r) - 2 * dist(aqui, origem(p))));
    }
    gravarProg(r, p);
    if (cavar || a.ir) return;
  }
  gravarProg(r, p);
}

/** Túnel: pedregulho no chão onde faltar (o turtle.placeDown() do programa). */
function pisar(r: Entity, pos: Vector3): void {
  const baixo = r.dimension.getBlock({ x: pos.x, y: pos.y - 1, z: pos.z });
  if (!baixo || !(baixo.isAir || baixo.isLiquid)) return;
  const c = container(r);
  if (!c) return;
  for (let k = 0; k < c.size; k++) {
    const i = c.getItem(k);
    if (i?.typeId !== "minecraft:cobblestone") continue;
    baixo.setType("minecraft:cobblestone");
    if (i.amount > 1) {
      i.amount--;
      c.setItem(k, i);
    } else c.setItem(k, undefined);
    return;
  }
}

function comecar(j: Player, r: Entity, t: Prog["t"], n: number): void {
  const precisa = t === "tunel" ? n * 4 : n * n + 2 * n;
  if (comb(r) < precisa) return aviso(j, { translate: "cl.robo.pouco", with: [String(precisa)] }, 4);
  const o = blocoDo(r);
  const yaw = r.getRotation().y;
  const f = GIRO.reduce((m, g, k) => (Math.abs(((yaw - g + 540) % 360) - 180) < Math.abs(((yaw - GIRO[m] + 540) % 360) - 180) ? k : m), 0);
  gravarProg(r, { t, n, o: [o.x, o.y, o.z], f, i: 0, m: 0 });
  r.setDynamicProperty(DONO, j.id);
  j.playSound("random.click");
}

function guardarRobo(j: Player, r: Entity): void {
  const c = container(r);
  if (c) for (let k = 0; k < c.size; k++) {
    const i = c.getItem(k);
    if (i) r.dimension.spawnItem(i, r.location);
  }
  c?.clearAll();
  const item = new ItemStack(ROBO, 1);
  const n = comb(r);
  if (n) {
    item.setDynamicProperty(COMB, n);
    item.setLore([`§7${n}`]);
  }
  r.remove();
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(item);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
}

async function menu(j: Player, r: Entity): Promise<void> {
  const p = lerProg(r);
  const c = container(r);
  const usados = c ? c.size - c.emptySlotsCount : 0;
  const estado = p
    ? { translate: "cl.robo.trabalhando", with: { rawtext: [p.t === "tunel" ? { translate: "cl.robo.tunel", with: [String(p.n)] } : { translate: "cl.robo.escavar", with: [String(p.n), String(p.n)] }, { text: String(p.m) }] } }
    : { translate: "cl.robo.parado" };
  const f = new ActionFormData().title({ translate: "cl.robo.titulo" }).body({ translate: "cl.robo.corpo", with: { rawtext: [{ text: String(comb(r)) }, { text: String(usados) }, estado] } });
  const acoes: Array<() => void> = [];
  if (!p) {
    for (const n of [16, 32, 64]) {
      f.button({ translate: "cl.robo.tunel", with: [String(n)] });
      acoes.push(() => comecar(j, r, "tunel", n));
    }
    for (const n of [3, 5, 9]) {
      f.button({ translate: "cl.robo.escavar", with: [String(n), String(n)] });
      acoes.push(() => comecar(j, r, "escavar", n));
    }
  } else {
    f.button({ translate: "cl.robo.parar" });
    acoes.push(() => terminar(r, p, "cl.robo.parado"));
  }
  f.button({ translate: "cl.robo.esvaziar" });
  acoes.push(() => {
    const cc = container(r);
    if (cc) for (let k = 0; k < cc.size; k++) {
      const i = cc.getItem(k);
      if (i) j.dimension.spawnItem(i, j.location);
      cc.setItem(k, undefined);
    }
  });
  if (!p) {
    f.button({ translate: "cl.robo.guardar" });
    acoes.push(() => guardarRobo(j, r));
  }
  const res = await f.show(j);
  if (res.canceled || res.selection === undefined || !r.isValid) return;
  acoes[res.selection]?.();
}

const AO_LADO: Readonly<Record<string, [number, number, number]>> = {
  [Direction.Up]: [0, 1, 0], [Direction.Down]: [0, -1, 0], [Direction.North]: [0, 0, -1],
  [Direction.South]: [0, 0, 1], [Direction.East]: [1, 0, 0], [Direction.West]: [-1, 0, 0],
};

export function registrarRobo(): void {
  // Pôr o robô: toque num bloco com o item; ele fica de costas para o jogador.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== ROBO || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    const d = AO_LADO[ev.blockFace] ?? [0, 1, 0];
    const n = (ev.itemStack.getDynamicProperty(COMB) as number | undefined) ?? 0;
    system.run(() => {
      const pos = { x: b.x + d[0], y: b.y + d[1], z: b.z + d[2] };
      if (!j.dimension.getBlock(pos)?.isAir) return;
      const yaw = j.getRotation().y;
      const f = GIRO.reduce((m, g, k) => (Math.abs(((yaw - g + 540) % 360) - 180) < Math.abs(((yaw - GIRO[m] + 540) % 360) - 180) ? k : m), 0);
      const r = j.dimension.spawnEntity(ROBO, centro(pos));
      r.setRotation({ x: 0, y: GIRO[f] });
      r.setDynamicProperty(COMB, n);
      r.setDynamicProperty(DONO, j.id);
      gastarDaMao(j);
      j.playSound("random.anvil_land", { volume: 0.3, pitch: 1.6 });
    });
  });
  // Tocar no robô: com combustível na mão, abastece (a pilha toda); sem, abre os programas.
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId !== ROBO) return;
    ev.cancel = true;
    const { player: j, target: r } = ev;
    const mao = ev.itemStack;
    system.run(() => {
      const valor = mao ? COMBUSTIVEL[mao.typeId] : undefined;
      if (mao && valor) {
        const inv = j.getComponent("minecraft:inventory")?.container;
        const slot = j.selectedSlotIndex;
        const i = inv?.getItem(slot);
        if (!inv || i?.typeId !== mao.typeId) return;
        r.setDynamicProperty(COMB, comb(r) + valor * i.amount);
        inv.setItem(slot, i.typeId === "minecraft:lava_bucket" ? new ItemStack("minecraft:bucket", i.amount) : undefined);
        j.playSound("random.burp", { pitch: 1.5 });
        return aviso(j, { translate: "cl.robo.abasteceu", with: [String(comb(r))] }, 3);
      }
      abrirUmMenu(j, () => menu(j, r));
    });
  });
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_robo <tunel|escavar> <n> [combustível] no robô
  // mais perto (o jogador simulado não dispara o toque em entidade).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_robo" || !(j instanceof Player)) return;
    const r = j.dimension.getEntities({ type: ROBO, location: j.location, maxDistance: 12, closest: 1 })[0];
    const [t, n, c] = message.split(" ");
    if (!r) return;
    if (Number(c)) r.setDynamicProperty(COMB, Number(c));
    comecar(j, r, t === "escavar" ? "escavar" : "tunel", Number(n) || 4);
  });
  intervalo("robô", () => {
    for (const d of ["minecraft:overworld", "cl:lua"]) {
      let dim: Dimension;
      try {
        dim = world.getDimension(d);
      } catch {
        continue;
      }
      for (const r of dim.getEntities({ type: ROBO })) if (r.getDynamicProperty(PROG) !== undefined) passo(r);
    }
  }, 8);
}

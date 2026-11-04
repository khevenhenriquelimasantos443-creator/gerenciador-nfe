import { Block, BlockPermutation, Dimension, Direction, Entity, EntityDamageCause, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
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
/*
 * 1.39.0 (CC: Tweaked 1.121): o Robô Avançado (item cl:robo_avancado, a mesma entidade com cl:av) e o limite de
 * combustível do mod (turtleFuelLimit 20.000, advancedTurtleFuelLimit 100.000). Ferramentas trocáveis como os upgrades
 * das turtles: tocar o robô parado com uma picareta, machado, enxada ou espada (de diamante ou netherita) troca a
 * ferramenta (a antiga volta para você) e muda os programas: machado corta as árvores numa linha e replanta as mudas,
 * enxada colhe e replanta a plantação à frente, espada guarda a área (8 de dano a monstros a 3 blocos, 1 de combustível
 * por golpe).
 */
const ROBO_AV = "cl:robo_avancado";
const AV = "cl:av";
const FERR = "cl:ferr";
const LIMITE = 20000, LIMITE_AV = 100000;
type Ferramenta = "picareta" | "machado" | "enxada" | "espada";
const FERRAMENTAS: Readonly<Record<string, Ferramenta>> = {
  "minecraft:diamond_pickaxe": "picareta", "minecraft:netherite_pickaxe": "picareta", "minecraft:diamond_axe": "machado", "minecraft:netherite_axe": "machado",
  "minecraft:diamond_hoe": "enxada", "minecraft:netherite_hoe": "enxada", "minecraft:diamond_sword": "espada", "minecraft:netherite_sword": "espada",
};
const ferramentaDe = (r: Entity): string => (r.getDynamicProperty(FERR) as string | undefined) ?? "minecraft:diamond_pickaxe";
const limite = (r: Entity) => (r.getDynamicProperty(AV) ? LIMITE_AV : LIMITE);
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
type Prog = { t: "tunel" | "escavar" | "lenhador" | "agricultor" | "guarda"; n: number; o: [number, number, number]; f: number; i: number; m: number; fundo?: boolean };

const lerProg = (r: Entity): Prog | undefined => {
  try {
    const v = r.getDynamicProperty(PROG);
    return typeof v === "string" ? (JSON.parse(v) as Prog) : undefined;
  } catch {
    return undefined;
  }
};
// 1.16.4: os robôs trabalhando ficam numa lista; sem nenhum, o laço não procura entidades no mundo.
const trabalhando = new Map<string, Entity>();
const gravarProg = (r: Entity, p: Prog | undefined) => {
  r.setDynamicProperty(PROG, p ? JSON.stringify(p) : undefined);
  if (p) trabalhando.set(r.id, r);
  else trabalhando.delete(r.id);
};
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
  if (p.t === "lenhador") return passoLenhador(r, p);
  if (p.t === "agricultor") return passoAgricultor(r, p);
  if (p.t === "guarda") return passoGuarda(r, p);
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

// ---------- 1.39.0: machado, enxada e espada ----------
const tronco = (id: string) => (id.endsWith("_log") || id.endsWith("_stem")) && !id.includes("stripped");
const MUDA: Readonly<Record<string, string>> = {
  "minecraft:oak_log": "minecraft:oak_sapling", "minecraft:spruce_log": "minecraft:spruce_sapling", "minecraft:birch_log": "minecraft:birch_sapling",
  "minecraft:jungle_log": "minecraft:jungle_sapling", "minecraft:acacia_log": "minecraft:acacia_sapling", "minecraft:dark_oak_log": "minecraft:dark_oak_sapling",
  "minecraft:cherry_log": "minecraft:cherry_sapling", "minecraft:mangrove_log": "minecraft:mangrove_propagule",
};
const TERRA = new Set(["minecraft:grass_block", "minecraft:dirt", "minecraft:podzol", "minecraft:coarse_dirt", "minecraft:rooted_dirt", "minecraft:mud"]);
const passavel = (b: Block) => b.isAir || b.typeId.endsWith("_sapling") || b.typeId === "minecraft:mangrove_propagule" || b.typeId === "minecraft:short_grass" || b.typeId === "minecraft:tall_grass";
function tirarDoRobo(r: Entity, id: string): boolean {
  const c = container(r);
  if (!c) return false;
  for (let k = 0; k < c.size; k++) {
    const i = c.getItem(k);
    if (i?.typeId !== id) continue;
    if (i.amount > 1) {
      i.amount--;
      c.setItem(k, i);
    } else c.setItem(k, undefined);
    return true;
  }
  return false;
}
function cheioDespeja(r: Entity, p: Prog): void {
  const c = container(r);
  if (c && c.emptySlotsCount === 0) {
    const aqui = blocoDo(r);
    despejar(r, p);
    r.setDynamicProperty(COMB, Math.max(0, comb(r) - 2 * dist(aqui, origem(p))));
  }
}
function passoLenhador(r: Entity, p: Prog): void {
  const [fx, fz] = FRENTE[p.f];
  const o = origem(p);
  const s = p.i + 1;
  if (s > p.n) return terminar(r, p, "cl.robo.terminou");
  const pos = { x: o.x + fx * s, y: o.y, z: o.z + fz * s };
  const dim = r.dimension;
  const b = dim.getBlock(pos);
  if (!b) return;
  if (tronco(b.typeId)) {
    // Corta o tronco inteiro (até 32 de altura) e replanta a muda se tiver uma e o chão for de terra.
    const tipo = b.typeId;
    for (let h = 0; h < 32; h++) {
      const t = dim.getBlock({ x: pos.x, y: pos.y + h, z: pos.z });
      if (!t || !tronco(t.typeId)) break;
      dim.runCommand(`setblock ${t.x} ${t.y} ${t.z} air destroy`);
      p.m++;
      const onde = { x: t.x, y: t.y, z: t.z };
      system.runTimeout(() => recolher(r, onde), 2);
    }
    system.runTimeout(() => {
      const chao = dim.getBlock({ x: pos.x, y: pos.y - 1, z: pos.z });
      const aqui = dim.getBlock(pos);
      if (MUDA[tipo] && aqui?.isAir && chao && TERRA.has(chao.typeId) && tirarDoRobo(r, MUDA[tipo])) aqui.setType(MUDA[tipo]);
    }, 4);
    const j = dono(r);
    if (j) registrarAcao(j, "cct_lenhador");
    gravarProg(r, p);
    return;
  }
  if (b.typeId.endsWith("_leaves")) {
    dim.runCommand(`setblock ${b.x} ${b.y} ${b.z} air destroy`);
    return;
  }
  if (!passavel(b)) return terminar(r, p, "cl.robo.terminou");
  if (comb(r) - 1 < dist(pos, o)) return terminar(r, p, "cl.robo.sem_combustivel");
  r.setDynamicProperty(COMB, comb(r) - 1);
  mover(r, pos, p.f);
  p.i++;
  cheioDespeja(r, p);
  gravarProg(r, p);
}
const MADURA: Readonly<Record<string, string>> = {
  "minecraft:wheat": "minecraft:wheat_seeds", "minecraft:carrots": "minecraft:carrot", "minecraft:potatoes": "minecraft:potato", "minecraft:beetroot": "minecraft:beetroot_seeds",
};
function passoAgricultor(r: Entity, p: Prog): void {
  const area = p.n * p.n;
  if (p.i >= area) return terminar(r, p, "cl.robo.terminou");
  const [fx, fz] = FRENTE[p.f];
  const [dx, dz] = FRENTE[(p.f + 1) % 4];
  const o = origem(p);
  const linha = Math.floor(p.i / p.n);
  const col = linha % 2 ? p.n - 1 - (p.i % p.n) : p.i % p.n;
  const pos = { x: o.x + fx * (col + 1) + dx * linha, y: o.y, z: o.z + fz * (col + 1) + dz * linha };
  const dim = r.dimension;
  const b = dim.getBlock(pos);
  if (!b) return;
  p.i++;
  if (!passavel(b)) return gravarProg(r, p);
  if (comb(r) - 1 < dist(pos, o)) return terminar(r, p, "cl.robo.sem_combustivel");
  r.setDynamicProperty(COMB, comb(r) - 1);
  mover(r, pos, p.f);
  const planta = dim.getBlock({ x: pos.x, y: pos.y - 1, z: pos.z });
  const semente = planta && MADURA[planta.typeId];
  if (planta && semente && planta.permutation.getState("growth" as never) === 7) {
    const tipo = planta.typeId;
    const onde = { x: planta.x, y: planta.y, z: planta.z };
    dim.runCommand(`setblock ${onde.x} ${onde.y} ${onde.z} air destroy`);
    dim.getBlock(onde)?.setPermutation(BlockPermutation.resolve(tipo, { growth: 0 }));
    p.m++;
    system.runTimeout(() => {
      recolher(r, onde);
      tirarDoRobo(r, semente); // a semente replantada
    }, 2);
    const j = dono(r);
    if (j) registrarAcao(j, "cct_agricultor");
  }
  cheioDespeja(r, p);
  gravarProg(r, p);
}
function passoGuarda(r: Entity, p: Prog): void {
  if (comb(r) < 1) return terminar(r, p, "cl.robo.sem_combustivel");
  p.i++;
  const alvo = r.dimension.getEntities({ location: r.location, maxDistance: 3, families: ["monster"], closest: 1 })[0];
  if (alvo) {
    alvo.applyDamage(8, { cause: EntityDamageCause.entityAttack, damagingEntity: r });
    r.setDynamicProperty(COMB, comb(r) - 1);
    p.m++;
    if (!alvo.isValid || (alvo.getComponent("minecraft:health")?.currentValue ?? 1) <= 0) {
      const j = dono(r);
      if (j) registrarAcao(j, "cct_guarda");
    }
  }
  if (p.i % 10 === 0) recolher(r, blocoDo(r));
  gravarProg(r, p);
}
/** Troca a ferramenta do robô parado pela da mão do jogador (a antiga volta para ele). */
function equipar(j: Player, r: Entity, id: string): boolean {
  if (!FERRAMENTAS[id] || lerProg(r)) return false;
  const antiga = ferramentaDe(r);
  r.setDynamicProperty(FERR, id);
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  if (inv && mao?.typeId === id) inv.setItem(j.selectedSlotIndex, new ItemStack(antiga, 1));
  else {
    const sobra = inv?.addItem(new ItemStack(antiga, 1));
    if (sobra) j.dimension.spawnItem(sobra, j.location);
  }
  j.playSound("random.anvil_use", { volume: 0.4, pitch: 1.4 });
  aviso(j, { translate: "cl.cc.ferramenta", with: { rawtext: [{ translate: `cl.cc.${FERRAMENTAS[id]}` }] } }, 3);
  return true;
}

function comecar(j: Player, r: Entity, t: Prog["t"], n: number): void {
  const precisa = t === "tunel" ? n * 4 : t === "lenhador" ? n * 2 : t === "guarda" ? 1 : n * n + 2 * n;
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
  const item = new ItemStack(r.getDynamicProperty(AV) ? ROBO_AV : ROBO, 1);
  const n = comb(r);
  if (n) {
    item.setDynamicProperty(COMB, n);
    item.setLore([`§7${n}`]);
  }
  if (r.getDynamicProperty(FERR)) item.setDynamicProperty(FERR, r.getDynamicProperty(FERR));
  r.remove();
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(item);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
}

async function menu(j: Player, r: Entity): Promise<void> {
  const p = lerProg(r);
  const c = container(r);
  const usados = c ? c.size - c.emptySlotsCount : 0;
  const nome = (q: Prog): RawMessage =>
    q.t === "tunel" ? { translate: "cl.robo.tunel", with: [String(q.n)] }
    : q.t === "escavar" ? { translate: "cl.robo.escavar", with: [String(q.n), String(q.n)] }
    : q.t === "lenhador" ? { translate: "cl.cc.lenhador", with: [String(q.n)] }
    : q.t === "agricultor" ? { translate: "cl.cc.agricultor", with: [String(q.n), String(q.n)] }
    : { translate: "cl.cc.guarda" };
  const estado = p ? { translate: "cl.robo.trabalhando", with: { rawtext: [nome(p), { text: String(p.m) }] } } : { translate: "cl.robo.parado" };
  const f = new ActionFormData().title({ translate: "cl.robo.titulo" }).body({ translate: "cl.robo.corpo", with: { rawtext: [{ text: `${comb(r)} / ${limite(r)}` }, { text: String(usados) }, estado] } });
  const acoes: Array<() => void> = [];
  if (!p) {
    // 1.39.0: os programas dependem da ferramenta.
    const ferr = FERRAMENTAS[ferramentaDe(r)] ?? "picareta";
    const opcoes: Array<[Prog["t"], number]> =
      ferr === "machado" ? [["lenhador", 16], ["lenhador", 32]]
      : ferr === "enxada" ? [["agricultor", 5], ["agricultor", 9]]
      : ferr === "espada" ? [["guarda", 1]]
      : [["tunel", 16], ["tunel", 32], ["tunel", 64], ["escavar", 3], ["escavar", 5], ["escavar", 9]];
    for (const [t, n] of opcoes) {
      f.button(nome({ t, n, o: [0, 0, 0], f: 0, i: 0, m: 0 }));
      acoes.push(() => comecar(j, r, t, n));
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
    const tipo = ev.itemStack?.typeId;
    if ((tipo !== ROBO && tipo !== ROBO_AV) || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    const d = AO_LADO[ev.blockFace] ?? [0, 1, 0];
    const n = (ev.itemStack!.getDynamicProperty(COMB) as number | undefined) ?? 0;
    const ferr = ev.itemStack!.getDynamicProperty(FERR) as string | undefined;
    system.run(() => {
      const pos = { x: b.x + d[0], y: b.y + d[1], z: b.z + d[2] };
      if (!j.dimension.getBlock(pos)?.isAir) return;
      const yaw = j.getRotation().y;
      const f = GIRO.reduce((m, g, k) => (Math.abs(((yaw - g + 540) % 360) - 180) < Math.abs(((yaw - GIRO[m] + 540) % 360) - 180) ? k : m), 0);
      const r = j.dimension.spawnEntity(ROBO, centro(pos));
      r.setRotation({ x: 0, y: GIRO[f] });
      r.setDynamicProperty(COMB, n);
      r.setDynamicProperty(DONO, j.id);
      if (tipo === ROBO_AV) r.setDynamicProperty(AV, true);
      if (ferr) r.setDynamicProperty(FERR, ferr);
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
      if (mao && FERRAMENTAS[mao.typeId] && equipar(j, r, mao.typeId)) return;
      const valor = mao ? COMBUSTIVEL[mao.typeId] : undefined;
      if (mao && valor) {
        const inv = j.getComponent("minecraft:inventory")?.container;
        const slot = j.selectedSlotIndex;
        const i = inv?.getItem(slot);
        if (!inv || i?.typeId !== mao.typeId) return;
        // 1.39.0: até o limite do robô; o que não cabe fica na mão.
        const cabem = Math.min(i.amount, Math.floor((limite(r) - comb(r)) / valor));
        if (cabem <= 0) return aviso(j, { translate: "cl.cc.limite", with: [String(comb(r))] }, 3);
        r.setDynamicProperty(COMB, comb(r) + valor * cabem);
        const lava = i.typeId === "minecraft:lava_bucket";
        if (cabem === i.amount) inv.setItem(slot, lava ? new ItemStack("minecraft:bucket", i.amount) : undefined);
        else {
          i.amount -= cabem;
          inv.setItem(slot, i);
          if (lava) inv.addItem(new ItemStack("minecraft:bucket", cabem));
        }
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
    if (t === "equipar") {
      console.warn(`[teste_robo] equipar ${n}: ${equipar(j, r, n)} ferr=${ferramentaDe(r)}`);
      return;
    }
    if (t === "abastecer") {
      r.setDynamicProperty(COMB, Math.min(limite(r), comb(r) + Number(n)));
      console.warn(`[teste_robo] combustivel=${comb(r)} limite=${limite(r)}`);
      return;
    }
    if (Number(c)) r.setDynamicProperty(COMB, Number(c));
    const tipos: Prog["t"][] = ["tunel", "escavar", "lenhador", "agricultor", "guarda"];
    comecar(j, r, tipos.includes(t as Prog["t"]) ? (t as Prog["t"]) : "tunel", Number(n) || 4);
  });
  intervalo("robô", () => {
    for (const [id, r] of trabalhando) {
      if (!r.isValid || r.getDynamicProperty(PROG) === undefined) trabalhando.delete(id);
      else passo(r);
    }
  }, 8);
  // Robô trabalhando que volta a carregar (ou de antes de fechar o mundo) entra na lista; a cada 10 s, por garantia,
  // uma procura completa.
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === ROBO && entity.getDynamicProperty(PROG) !== undefined) trabalhando.set(entity.id, entity);
  });
  intervalo("robô", () => {
    for (const d of ["minecraft:overworld", "cl:lua"]) {
      let dim: Dimension;
      try {
        dim = world.getDimension(d);
      } catch {
        continue;
      }
      for (const r of dim.getEntities({ type: ROBO })) if (r.getDynamicProperty(PROG) !== undefined) trabalhando.set(r.id, r);
    }
  }, 200);
}

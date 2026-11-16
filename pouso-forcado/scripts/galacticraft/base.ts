import { BlockCustomComponent, BlockPermutation, BlockVolume, Dimension, EntityDamageCause, ItemStack, Player, Vector3, system, world } from "@minecraft/server";
import { LinhaSaque } from "../config.js";
import { aviso, duasLinhas } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { sortearSaque } from "../util/aleatorio.js";
import { criarBauCom, darAoJogador } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";
import { rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { chunkPronto, dimensaoLua, pedirArea } from "./lua.js";
import { LUA } from "./oxigenio.js";
import { vilaPerto } from "./vila.js";

/*
 * A Base de Pesquisa Lunar (1.6.1): o sinal que o rádio da nave pega. Ela é sorteada a 160–240 blocos de onde o
 * primeiro jogador pousou na Lua, e a Bússola do Avião aponta para ela enquanto se está na Lua.
 * Na superfície, uma cabine de tijolo lunar com um poço e escada; embaixo (y = 26), a masmorra do Galacticraft:
 * um salão, corredores e quatro salas (duas de monstros evoluídos, uma de baús e a do chefe). Na sala do chefe,
 * o Esqueleto Evoluído Gigante (150 de vida, flechas a cada 25 ticks e arremesso de quem chega perto, como no
 * Galacticraft) acorda quando alguém entra e volta se o jogador sair sem matá-lo. Ele deixa a Chave da Masmorra,
 * que abre o Baú do Tesouro com o Núcleo de Salto (o final novo, em scripts/mundo/reparo.ts).
 * A base é construída de uma vez, por fills, assim que o terreno em volta existe; desde a 1.17.0 isso começa quando
 * alguém chega a 160 blocos (uma área de carregamento segura os chunks dela), para estar pronta na chegada.
 */
const PROP = "cl:base_lua";
const Y0 = 26; // chão da masmorra
const TIJOLO = "cl:tijolo_lunar", LUZ = "minecraft:glowstone";
// chave: undefined na Base de Pesquisa (a da história); "rx,rz" nas outras masmorras (1.55.0). rot: 0 a 3 (quartos de volta).
type Base = { x: number; z: number; sy?: number; feita?: boolean; chefe?: boolean; salas?: string[]; chave?: string; rot?: number; cancelada?: boolean; avisada?: boolean };
type Sala = { id: string; dx: number; dz: number; r: number; altura: number; tipo: "monstros" | "baus" | "chefe" | "salao" };
const SALAS: ReadonlyArray<Sala> = [
  { id: "salao", dx: 0, dz: 0, r: 4, altura: 5, tipo: "salao" },
  { id: "leste", dx: 30, dz: 0, r: 5, altura: 5, tipo: "monstros" },
  { id: "norte", dx: 0, dz: -28, r: 5, altura: 5, tipo: "monstros" },
  { id: "oeste", dx: -28, dz: 0, r: 4, altura: 5, tipo: "baus" },
  { id: "chefe", dx: 0, dz: 34, r: 8, altura: 8, tipo: "chefe" },
];
// Corredores (3 de largura, 4 de altura) do salão até cada sala.
const CORREDORES: ReadonlyArray<[number, number, number, number]> = [
  // x1, z1, x2, z2 (interior)
  [5, -1, 24, 1],
  [-1, -22, 1, -5],
  [-23, -1, -5, 1],
  [-1, 5, 1, 25],
];
const SAQUE_BAU: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:iron_ingot", min: 2, max: 6, chance: 0.7 },
  { item: "cl:coalhada_queijo", min: 2, max: 6, chance: 0.6 },
  { item: "cl:placa_aco", min: 1, max: 4, chance: 0.4 },
  { item: "cl:placa_aluminio", min: 1, max: 4, chance: 0.4 },
  { item: "cl:balde_combustivel", min: 1, max: 1, chance: 0.35 },
  { item: "cl:tanque_oxigenio_leve", min: 1, max: 1, chance: 0.25 },
  { item: "cl:wafer_basico", min: 1, max: 3, chance: 0.3 },
  { item: "minecraft:golden_apple", min: 1, max: 1, chance: 0.15 },
  { item: "minecraft:diamond", min: 1, max: 2, chance: 0.12 },
];
const SAQUE_TESOURO: ReadonlyArray<LinhaSaque> = [
  { item: "minecraft:diamond", min: 2, max: 5, chance: 1 },
  { item: "cl:tanque_oxigenio_pesado", min: 1, max: 1, chance: 0.6 },
  { item: "cl:placa_reforcada", min: 2, max: 6, chance: 0.6 },
  { item: "minecraft:enchanted_golden_apple", min: 1, max: 1, chance: 0.2 },
  { item: "cl:balde_combustivel", min: 1, max: 1, chance: 1 },
];
const MONSTROS = ["cl:zumbi_evoluido", "cl:zumbi_evoluido", "cl:esqueleto_evoluido", "cl:aranha_evoluida", "cl:creeper_evoluido", "cl:bruxa_evoluida"];

export function lerBase(): Base | undefined {
  const v = world.getDynamicProperty(PROP);
  if (typeof v !== "string") return undefined;
  try {
    return JSON.parse(v) as Base;
  } catch {
    return undefined;
  }
}
function gravarBase(b: Base): void {
  world.setDynamicProperty(b.chave ? `${PROP_EXTRA}${b.chave}` : PROP, JSON.stringify(b));
  if (b.chave) cacheExtras.set(b.chave, b.cancelada ? null : b);
}

/*
 * 1.55.0: as outras masmorras da Lua, como no Galacticraft 5 (structure_set moon_boss: random_spread de 32×32 chunks,
 * separação 8): uma por região, num chunk sorteado pela semente do mundo, com o mesmo salão, corredores, salas e o
 * Esqueleto Evoluído Gigante, virada para um lado sorteado. O Baú do Tesouro delas dá o saque, mas o Núcleo de Salto
 * só sai da Base de Pesquisa (a da história). Nenhuma cai perto da Base nem em cima de uma Vila Lunar, e não é feita
 * se alguém já andou por cima dela antes (para não apagar o que o jogador fez lá).
 */
const PROP_EXTRA = "cl:masmorra_lua:";
const REGIAO = 32 * 16;
function lerExtra(chave: string): Base | undefined {
  const v = world.getDynamicProperty(PROP_EXTRA + chave);
  if (typeof v !== "string") return undefined;
  try {
    return JSON.parse(v) as Base;
  } catch {
    return undefined;
  }
}
// As masmorras já calculadas nesta sessão (null = nenhuma na região): a conta roda a cada segundo por jogador.
const cacheExtras = new Map<string, Base | null>();
let cacheComHistoria = false;
function extraDaRegiao(rx: number, rz: number): Base | undefined {
  const chave = `${rx},${rz}`;
  // A Base de Pesquisa é sorteada depois do pouso: quando ela aparece, refaz as contas (a distância muda).
  const comHistoria = world.getDynamicProperty(PROP) !== undefined;
  if (comHistoria !== cacheComHistoria) {
    cacheExtras.clear();
    cacheComHistoria = comHistoria;
  }
  const c = cacheExtras.get(chave);
  if (c !== undefined) return c ?? undefined;
  const b = calcularExtra(rx, rz, chave);
  cacheExtras.set(chave, b ?? null);
  return b;
}
function calcularExtra(rx: number, rz: number, chave: string): Base | undefined {
  const salvo = lerExtra(chave);
  if (salvo) return salvo.cancelada ? undefined : salvo;
  const r = rng(sementeDe(sementeDoMundo(), rx, rz, 52532672));
  const x = (rx * 32 + Math.floor(r() * 24)) * 16 + 8, z = (rz * 32 + Math.floor(r() * 24)) * 16 + 8;
  const rot = Math.floor(r() * 4);
  const historia = lerBase();
  if (historia && Math.hypot(historia.x - x, historia.z - z) < 250) return undefined;
  if (vilaPerto(x, z, 40)) return undefined;
  return { x, z, chave, rot };
}
/** As masmorras (fora a da história) das regiões em volta de (x, z). */
function extrasPerto(x: number, z: number): Base[] {
  const rx = Math.floor(x / REGIAO), rz = Math.floor(z / REGIAO);
  const l: Base[] = [];
  for (let dx = -1; dx <= 1; dx++)
    for (let dz = -1; dz <= 1; dz++) {
      const b = extraDaRegiao(rx + dx, rz + dz);
      if (b) l.push(b);
    }
  return l;
}
// Posição de uma sala e de um canto dela, girados com a masmorra.
function girar(dx: number, dz: number, rot = 0): [number, number] {
  for (let i = 0; i < rot; i++) [dx, dz] = [-dz, dx];
  return [dx, dz];
}
const centroSala = (b: Base, s: Sala): [number, number] => {
  const [dx, dz] = girar(s.dx, s.dz, b.rot);
  return [b.x + dx, b.z + dz];
};
const FRENTE_BAU = ["north", "east", "south", "west"];
/** Para a Bússola do Avião, na Lua. */
export const alvoBaseLua = (): { x: number; z: number } | undefined => {
  const b = lerBase();
  return b ? { x: b.x, z: b.z } : undefined;
};

function avisarSinal(j: Player, b: Base): void {
  const dist = Math.round(Math.hypot(b.x - j.location.x, b.z - j.location.z));
  j.sendMessage({ translate: "cl.gc.sinal", with: [String(b.x), String(b.z), String(dist)] });
}

function escolherBase(j: Player): Base {
  const ang = Math.random() * Math.PI * 2, d = 160 + Math.random() * 80;
  const b: Base = { x: Math.floor(j.location.x + Math.cos(ang) * d), z: Math.floor(j.location.z + Math.sin(ang) * d) };
  gravarBase(b);
  return b;
}

// ---------- Construção ----------
const caixa = (dim: Dimension, a: Vector3, c: Vector3, bloco: string) => dim.fillBlocks(new BlockVolume(a, c), bloco);
function sala(dim: Dimension, b: Base, s: Sala): void {
  const [x, z] = centroSala(b, s), r = s.r;
  caixa(dim, { x: x - r - 1, y: Y0, z: z - r - 1 }, { x: x + r + 1, y: Y0 + s.altura + 1, z: z + r + 1 }, TIJOLO);
  caixa(dim, { x: x - r, y: Y0 + 1, z: z - r }, { x: x + r, y: Y0 + s.altura, z: z + r }, "minecraft:air");
  // Luz no teto: nos cantos (o salão e a sala do chefe bem acesos; as outras, penumbra).
  const cantos = s.tipo === "monstros" ? [[0, 0]] : [[-r + 1, -r + 1], [r - 1, -r + 1], [-r + 1, r - 1], [r - 1, r - 1]];
  for (const [dx, dz] of cantos) dim.getBlock({ x: x + dx, y: Y0 + s.altura + 1, z: z + dz })?.setType(LUZ);
}

function construir(dim: Dimension, b: Base): void {
  const cx = b.x, cz = b.z;
  const sy = dim.getTopmostBlock({ x: cx, z: cz })?.y ?? 64;
  // Masmorra: salas e corredores (girados com a masmorra; a da história tem rot 0).
  const corredores = CORREDORES.map(([x1, z1, x2, z2]) => {
    const [a1, b1] = girar(x1, z1, b.rot), [a2, b2] = girar(x2, z2, b.rot);
    return [Math.min(a1, a2), Math.min(b1, b2), Math.max(a1, a2), Math.max(b1, b2)] as const;
  });
  for (const s of SALAS) sala(dim, b, s);
  for (const [x1, z1, x2, z2] of corredores) {
    caixa(dim, { x: cx + x1 - 1, y: Y0, z: cz + z1 - 1 }, { x: cx + x2 + 1, y: Y0 + 5, z: cz + z2 + 1 }, TIJOLO);
  }
  // Abre os corredores e reabre as salas (as paredes dos corredores entram um bloco nelas).
  for (const [x1, z1, x2, z2] of corredores) caixa(dim, { x: cx + x1, y: Y0 + 1, z: cz + z1 }, { x: cx + x2, y: Y0 + 4, z: cz + z2 }, "minecraft:air");
  for (const s of SALAS) {
    const [x, z] = centroSala(b, s);
    caixa(dim, { x: x - s.r, y: Y0 + 1, z: z - s.r }, { x: x + s.r, y: Y0 + s.altura, z: z + s.r }, "minecraft:air");
  }
  // Poço do salão até a superfície, com escada encostada na parede norte (de cima até o chão do salão).
  caixa(dim, { x: cx - 1, y: Y0 + 6, z: cz - 1 }, { x: cx + 1, y: sy, z: cz + 1 }, TIJOLO);
  caixa(dim, { x: cx, y: Y0 + 1, z: cz - 1 }, { x: cx, y: Y0 + 5, z: cz - 1 }, TIJOLO);
  caixa(dim, { x: cx, y: Y0 + 1, z: cz }, { x: cx, y: sy + 3, z: cz }, "minecraft:air");
  const escada = BlockPermutation.resolve("minecraft:ladder", { facing_direction: 3 });
  for (let y = Y0 + 1; y <= sy; y++) dim.getBlock({ x: cx, y, z: cz })?.setPermutation(escada);
  // Cabine na superfície: chão, paredes com uma porta ao sul e teto com luz.
  caixa(dim, { x: cx - 3, y: sy, z: cz - 3 }, { x: cx + 3, y: sy, z: cz + 3 }, TIJOLO);
  caixa(dim, { x: cx - 3, y: sy + 1, z: cz - 3 }, { x: cx + 3, y: sy + 4, z: cz + 3 }, TIJOLO);
  caixa(dim, { x: cx - 2, y: sy + 1, z: cz - 2 }, { x: cx + 2, y: sy + 4, z: cz + 2 }, "minecraft:air");
  caixa(dim, { x: cx, y: sy + 1, z: cz + 3 }, { x: cx, y: sy + 2, z: cz + 3 }, "minecraft:air");
  caixa(dim, { x: cx - 3, y: sy + 5, z: cz - 3 }, { x: cx + 3, y: sy + 5, z: cz + 3 }, TIJOLO);
  dim.getBlock({ x: cx, y: sy + 5, z: cz + 2 })?.setType(LUZ);
  dim.getBlock({ x: cx, y: sy, z: cz })?.setPermutation(escada);
  // Baús da sala oeste e o Baú do Tesouro no fundo da sala do chefe, virado para a entrada.
  const oeste = SALAS.find((s) => s.id === "oeste")!;
  for (const lado of [-3, 3]) {
    const [dx, dz] = girar(oeste.dx - 3, lado, b.rot);
    criarBauCom(dim, { x: cx + dx, y: Y0 + 1, z: cz + dz }, sortearSaque(SAQUE_BAU));
  }
  const chefe = SALAS.find((s) => s.id === "chefe")!;
  const [tx, tz] = girar(0, chefe.dz + chefe.r - 1, b.rot);
  dim.getBlock({ x: cx + tx, y: Y0 + 1, z: cz + tz })?.setPermutation(
    BlockPermutation.resolve("cl:bau_tesouro", { "minecraft:cardinal_direction": FRENTE_BAU[b.rot ?? 0], "cl:aberto": false }),
  );
  b.sy = sy;
  b.feita = true;
  b.salas = [];
  gravarBase(b);
}

// Área de carregamento da base (uma de cada vez), enquanto ela não está construída.
const PREPARAR = 160;
const AREA = "cl_base_lua";
let areaAberta = false;
/** A área da masmorra em blocos (as salas vão até 40 blocos para os lados e 48 para o lado da sala do chefe, girado). */
function areaDa(b: Base): { x1: number; z1: number; x2: number; z2: number } {
  const cantos = [girar(-40, -40, b.rot), girar(40, 48, b.rot)];
  return {
    x1: b.x + Math.min(cantos[0][0], cantos[1][0]), z1: b.z + Math.min(cantos[0][1], cantos[1][1]),
    x2: b.x + Math.max(cantos[0][0], cantos[1][0]), z2: b.z + Math.max(cantos[0][1], cantos[1][1]),
  };
}
function prepararArea(dim: Dimension, b: Base): void {
  const caixa = areaDa(b);
  pedirArea({ dim, ...caixa });
  if (areaAberta) return;
  const opcoes = { dimension: dim, from: { x: caixa.x1, y: 0, z: caixa.z1 }, to: { x: caixa.x2, y: 120, z: caixa.z2 } };
  try {
    if (!world.tickingAreaManager.hasCapacity(opcoes)) return;
    areaAberta = true;
    world.tickingAreaManager.createTickingArea(AREA, opcoes).catch(() => (areaAberta = false));
  } catch {
    areaAberta = false;
  }
}
function soltarArea(): void {
  pedirArea(undefined);
  if (!areaAberta) return;
  areaAberta = false;
  try {
    world.tickingAreaManager.removeTickingArea(AREA);
  } catch {
    // já tinha saído
  }
}

function podeConstruir(dim: Dimension, b: Base): boolean {
  const a = areaDa(b);
  for (let x = a.x1; x <= a.x2 + 15; x += 16) for (let z = a.z1; z <= a.z2 + 15; z += 16) if (!chunkPronto(dim, Math.min(x, a.x2), Math.min(z, a.z2))) return false;
  return true;
}

const CHAO_LUA = new Set(["minecraft:air", "cl:solo_lunar", "cl:terra_lunar", "cl:rocha_lunar", "cl:basalto_lunar", "cl:ardosia_lunar", "cl:meteorito"]);
/** O topo em volta da cabine (11×11) é só o chão da Lua. */
function soChaoDaLua(dim: Dimension, b: Base): boolean {
  for (let x = b.x - 5; x <= b.x + 5; x++)
    for (let z = b.z - 5; z <= b.z + 5; z++) {
      const t = dim.getTopmostBlock({ x, z });
      if (t && !CHAO_LUA.has(t.typeId)) return false;
    }
  return true;
}

// ---------- Salas, chefe e baú ----------
const dentro = (p: Vector3, b: Base, s: Sala) => {
  const [x, z] = centroSala(b, s);
  return Math.abs(p.x - (x + 0.5)) <= s.r + 0.5 && Math.abs(p.z - (z + 0.5)) <= s.r + 0.5 && p.y >= Y0 && p.y <= Y0 + s.altura + 1;
};
// De que masmorra é cada chefe vivo (para a chave cair na sala certa quando ele morre).
const chefes = new Map<string, Base>();

function acordarSala(dim: Dimension, b: Base, s: Sala): void {
  const [sx, sz] = centroSala(b, s);
  const centro = { x: sx + 0.5, y: Y0 + 1, z: sz + 0.5 };
  if (s.tipo === "chefe") {
    if (b.chefe) return;
    const vivo = dim.getEntities({ type: "cl:esqueleto_chefe", location: centro, maxDistance: s.r * 2 + 4 });
    if (vivo.length) {
      for (const e of vivo) chefes.set(e.id, b);
      return;
    }
    chefes.set(dim.spawnEntity("cl:esqueleto_chefe", centro).id, b);
    for (const p of dim.getPlayers({ location: centro, maxDistance: 30 })) p.onScreenDisplay.setTitle({ translate: "cl.gc.chefe_acordou" }, { subtitle: duasLinhas("cl.gc.chefe_acordou_sub"), fadeInDuration: 10, stayDuration: 50, fadeOutDuration: 10 });
    dim.playSound("mob.wither.spawn", centro, { volume: 0.8, pitch: 1.4 });
    return;
  }
  if (s.tipo !== "monstros" || b.salas?.includes(s.id)) return;
  for (let k = 0; k < 4; k++) {
    const tipo = MONSTROS[Math.floor(Math.random() * MONSTROS.length)];
    dim.spawnEntity(tipo, { x: centro.x + (Math.random() * 2 - 1) * (s.r - 1), y: centro.y, z: centro.z + (Math.random() * 2 - 1) * (s.r - 1) });
  }
  b.salas = [...(b.salas ?? []), s.id];
  gravarBase(b);
}

// O chefe agarra e arremessa quem chega perto (no Galacticraft ele levanta o jogador e joga).
const ultimoArremesso = new Map<string, number>();
function arremessar(dim: Dimension): void {
  for (const chefe of dim.getEntities({ type: "cl:esqueleto_chefe" })) {
    const t = ultimoArremesso.get(chefe.id) ?? -999;
    if (system.currentTick - t < 60) continue;
    const alvo = dim.getPlayers({ location: chefe.location, maxDistance: 3, closest: 1 })[0];
    if (!alvo) continue;
    ultimoArremesso.set(chefe.id, system.currentTick);
    const dx = alvo.location.x - chefe.location.x, dz = alvo.location.z - chefe.location.z;
    const n = Math.hypot(dx, dz) || 1;
    alvo.applyKnockback({ x: (dx / n) * 2.2, z: (dz / n) * 2.2 }, 0.9);
    alvo.applyDamage(3, { cause: EntityDamageCause.entityAttack, damagingEntity: chefe });
    aviso(alvo, "cl.gc.arremessado", 3);
  }
}

export const bauTesouro: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    system.run(() => {
      if (b.permutation.getState("cl:aberto" as never)) return aviso(j, "cl.gc.bau_vazio", 4);
      const inv = j.getComponent("minecraft:inventory")?.container;
      let slot = -1;
      for (let s = 0; inv && s < inv.size; s++) if (inv.getItem(s)?.typeId === "cl:chave_masmorra") slot = s;
      if (!inv || slot < 0) return aviso(j, "cl.gc.bau_trancado", 5);
      inv.setItem(slot, undefined);
      b.setPermutation(b.permutation.withState("cl:aberto" as never, true as never));
      // 1.55.0: o Núcleo de Salto só sai do baú da Base de Pesquisa (as outras masmorras dão só o saque).
      const h = lerBase();
      const chefe = SALAS.find((s) => s.tipo === "chefe")!;
      const daHistoria = !!h && b.x === h.x && b.z === h.z + chefe.dz + chefe.r - 1;
      if (daHistoria) darAoJogador(j, "cl:nucleo_salto", 1);
      for (const p of sortearSaque(SAQUE_TESOURO)) darAoJogador(j, p.item, p.quantidade);
      j.playSound("random.chestopen");
      j.playSound("random.levelup");
      j.onScreenDisplay.setTitle({ text: "§d✦" }, { subtitle: duasLinhas(daHistoria ? "cl.gc.bau_aberto" : "cl.gc.bau_extra"), fadeInDuration: 10, stayDuration: 60, fadeOutDuration: 10 });
    });
  },
};

export function registrarBase(): void {
  world.afterEvents.playerDimensionChange.subscribe(({ player, toDimension }) => {
    if (toDimension.id !== LUA) return;
    system.runTimeout(() => {
      if (!player.isValid || player.dimension.id !== LUA) return;
      const b = lerBase() ?? escolherBase(player);
      if (!b.chefe) avisarSinal(player, b);
    }, 200);
  });
  intervalo("base lunar", () => {
    const naLua = world.getPlayers().filter((j) => j.dimension.id === LUA);
    if (!naLua.length) return;
    const dim = dimensaoLua();
    // A Base de Pesquisa e as outras masmorras perto de alguém (cada uma uma vez).
    const bases = new Map<string, Base>();
    const h = lerBase();
    if (h) bases.set("historia", h);
    for (const j of naLua) for (const b of extrasPerto(j.location.x, j.location.z)) bases.set(b.chave!, b);
    const t = lerExtra("teste");
    if (t) bases.set("teste", t);
    // Uma construção de cada vez: a mais perto de alguém que ainda não foi feita.
    let alvo: Base | undefined, dAlvo = Infinity;
    for (const b of bases.values()) {
      for (const j of naLua) {
        const d = Math.hypot(j.location.x - b.x, j.location.z - b.z);
        if (b.chave && !b.feita) {
          // Andou por cima antes de ela existir: fica sem (não apaga o que o jogador fez).
          if (d <= 40 && b.chave !== "teste") {
            b.cancelada = true;
            gravarBase(b);
            break;
          }
          if (!b.avisada && d <= 250) {
            j.sendMessage({ translate: "cl.gc.masmorra_sinal", with: [String(b.x), String(b.z), String(Math.round(d))] });
            b.avisada = true;
            gravarBase(b);
          }
        }
        if (!b.feita && d <= PREPARAR && d < dAlvo) {
          alvo = b;
          dAlvo = d;
        }
      }
    }
    if (alvo && !alvo.cancelada) {
      // 1.17.0: a base fica pronta antes de o jogador chegar. A até PREPARAR blocos dela, uma área de carregamento
      // segura os chunks da base, o terreno deles é gerado primeiro (lua.ts) e a base é construída assim que tudo
      // estiver pronto. Antes só começava a 28 blocos e esperava o jogador passar perto de todos os chunks.
      prepararArea(dim, alvo);
      if (podeConstruir(dim, alvo)) {
        try {
          // 1.55.0: as outras masmorras não entram onde alguém já construiu (a cabine da superfície e o poço).
          if (alvo.chave && alvo.chave !== "teste" && !soChaoDaLua(dim, alvo)) {
            alvo.cancelada = true;
            gravarBase(alvo);
            soltarArea();
            return;
          }
          construir(dim, alvo);
          soltarArea();
        } catch (erro) {
          console.warn(`[Pouso Forçado] base lunar: ${erro}`);
        }
      }
    }
    for (const b of bases.values()) {
      if (!b.feita) continue;
      for (const j of naLua) {
        const perto = Math.hypot(j.location.x - b.x, j.location.z - b.z);
        if (perto > 80) continue;
        if (!b.chave && perto <= 12 && j.getDynamicProperty("cl:viu_base") !== true) {
          j.setDynamicProperty("cl:viu_base", true);
          registrarAcao(j, "base_lua");
          aviso(j, "cl.gc.base_entrada", 6);
        }
        for (const s of SALAS) if (dentro(j.location, b, s)) acordarSala(dim, b, s);
      }
    }
    arremessar(dim);
  }, 20);
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_base põe a base 6 blocos ao lado;
  // /scriptevent cl:teste_masmorra <rot> põe outra masmorra (girada) 6 blocos ao lado.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (!(j instanceof Player)) return;
    if (id === "cl:teste_base") gravarBase({ x: Math.floor(j.location.x) + 6, z: Math.floor(j.location.z) });
    if (id === "cl:teste_masmorra") gravarBase({ x: Math.floor(j.location.x) + 6, z: Math.floor(j.location.z), chave: "teste", rot: Number(message) || 0, avisada: true });
  });
  world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    if (deadEntity.typeId !== "cl:esqueleto_chefe") return;
    // A chave sai pelo script, no meio da sala do chefe (depois da morte o jogo não deixa ler a posição dele, e
    // assim também não depende da regra de saque de monstros do mundo). A masmorra é a que acordou o chefe.
    const daMasmorra = chefes.get(deadEntity.id);
    chefes.delete(deadEntity.id);
    const b = daMasmorra ? (daMasmorra.chave ? lerExtra(daMasmorra.chave) ?? daMasmorra : lerBase()) : lerBase();
    const s = SALAS.find((x) => x.tipo === "chefe")!;
    let sala: [number, number] | undefined;
    if (b) {
      sala = centroSala(b, s);
      try {
        dimensaoLua().spawnItem(new ItemStack("cl:chave_masmorra", 1), { x: sala[0] + 0.5, y: Y0 + 1.5, z: sala[1] + 0.5 });
      } catch {
        // sala fora do mundo carregado
      }
      b.chefe = true;
      gravarBase(b);
    }
    for (const j of world.getPlayers()) {
      if (j.dimension.id !== LUA) continue;
      j.sendMessage({ translate: "cl.gc.chefe_morto" });
      if (!sala || Math.hypot(j.location.x - sala[0], j.location.z - sala[1]) <= 40) registrarAcao(j, "chefe_lua");
    }
  });
}

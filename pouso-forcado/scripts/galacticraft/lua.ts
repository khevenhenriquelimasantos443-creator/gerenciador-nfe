import { BlockVolume, Dimension, DimensionRegistry, Entity, EntityInitializationCause, GameMode, ListBlockVolume, Vector3, system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { intervalo, medir } from "../util/perfil.js";
import { LUA } from "./oxigenio.js";

/*
 * A Lua do Galacticraft como dimensão própria (Bedrock 26.30: dimensionRegistry, gerador vazio). O terreno sai
 * daqui, chunk a chunk, perto de quem está lá, com as regras do ChunkProviderMoon do Galacticraft:
 * - altura 63 + desvio de três ruídos (frequências 0,0125 / 0,015 / 0,01; amplitudes 8 e 24, misturadas pelo
 *   terceiro), Solo Lunar em cima, 3 de Terra Lunar e Rocha Lunar até o fundo (rocha matriz em y = 0);
 * - crateras de 4 tamanhos (raio 8-12, 13-17, 18-25, 26-30, com pesos 14, 8, 2 e 1), fundo de até 5 blocos com o
 *   perfil 5 − 6·r⁴; crateras que se cruzam somam a profundidade, como no original;
 * - veios de minério de cobre, estanho e queijo na rocha.
 * A marca de "chunk pronto" é a rocha matriz no canto (x0, 0, z0), que não quebra no sobrevivência.
 * Custo: só com alguém na Lua; um chunk de cada vez, feito em pedaços pelo system.runJob (1.17.0).
 */
export const LUA_GERACAO = { raioChunks: 4, base: 63, terra: 3 } as const;
const CRATERAS: ReadonlyArray<[number, number, number]> = [[8, 12, 14], [13, 17, 8], [18, 25, 2], [26, 30, 1]];
const CHANCE_CRATERA = 0.22; // por chunk
const VEIOS: ReadonlyArray<[string, number, number, number]> = [
  // bloco, veios por chunk, tamanho, y máximo
  ["cl:minerio_cobre_lunar", 6, 6, 60],
  ["cl:minerio_estanho_lunar", 6, 6, 60],
  ["cl:minerio_queijo", 8, 5, 64],
  // 1.41.0 (Galacticraft 5): bolsões de basalto e de ardósia lunar no fundo e a safira lunar.
  ["cl:basalto_lunar", 2, 24, 40],
  ["cl:ardosia_lunar", 3, 28, 20],
  ["cl:minerio_safira_lunar", 2, 4, 30],
];
const ROCHA = "cl:rocha_lunar", TERRA = "cl:terra_lunar", SOLO = "cl:solo_lunar", MATRIZ = "minecraft:bedrock";

export function registrarDimensaoLua(registro: DimensionRegistry): void {
  try {
    registro.registerCustomDimension(LUA);
  } catch (erro) {
    console.warn(`[Pouso Forçado] dimensão da Lua: ${erro}`);
  }
}
export const dimensaoLua = (): Dimension => world.getDimension(LUA);

// ---------- Ruído de Perlin 2D (semente própria da Lua) ----------
let perm: Uint8Array | undefined;
function preparar(semente: number): Uint8Array {
  if (perm) return perm;
  const sorte = rng(semente ^ 0x4c554131);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(sorte() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}
const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h: number, x: number, z: number) => ((h & 1 ? -x : x) + (h & 2 ? -z : z)) * (h & 4 ? 0.5 : 1);
function ruido(p: Uint8Array, x: number, z: number, deslocamento: number): number {
  x += deslocamento * 31.7;
  z += deslocamento * 17.3;
  const xi = Math.floor(x), zi = Math.floor(z), xf = x - xi, zf = z - zi;
  const X = xi & 255, Z = zi & 255, u = suave(xf), v = suave(zf);
  const a = p[p[X] + Z], b = p[p[X + 1] + Z], c = p[p[X] + Z + 1], d = p[p[X + 1] + Z + 1];
  const l1 = grad(a, xf, zf) + (grad(b, xf - 1, zf) - grad(a, xf, zf)) * u;
  const l2 = grad(c, xf, zf - 1) + (grad(d, xf - 1, zf - 1) - grad(c, xf, zf - 1)) * u;
  return l1 + (l2 - l1) * v;
}

/** Altura do chão (o bloco de Solo Lunar) antes das crateras. */
function alturaBase(p: Uint8Array, x: number, z: number): number {
  const d = ruido(p, x * 0.0125, z * 0.0125, 1) * 8;
  const d2 = ruido(p, x * 0.015, z * 0.015, 2) * 24;
  const d3 = (ruido(p, x * 0.01, z * 0.01, 3) - 0.1) * 4;
  const desvio = d3 < 0 ? d : d3 > 1 ? d2 : d + (d2 - d) * d3;
  return Math.floor(LUA_GERACAO.base + desvio);
}

type Cratera = { x: number; z: number; r: number };
function crateraDoChunk(semente: number, cx: number, cz: number): Cratera | undefined {
  const sorte = rng(sementeDe(semente, cx, cz, 0x6372));
  if (sorte() >= CHANCE_CRATERA) return undefined;
  let peso = sorte() * CRATERAS.reduce((s, [, , w]) => s + w, 0);
  const [min, max] = CRATERAS.find(([, , w]) => (peso -= w) < 0) ?? CRATERAS[0];
  return { x: cx * 16 + Math.floor(sorte() * 16), z: cz * 16 + Math.floor(sorte() * 16), r: min + Math.floor(sorte() * (max - min)) };
}

/** Blocos tirados do topo pelas crateras na coluna (somando as que se cruzam). */
function fundoCratera(crateras: ReadonlyArray<Cratera>, x: number, z: number): number {
  let n = 0;
  for (const c of crateras) {
    const dx = (c.x - x) / c.r, dz = (c.z - z) / c.r;
    const r2 = dx * dx + dz * dz;
    if (r2 >= 1) continue;
    const prof = 5 - r2 * r2 * 6;
    if (prof >= 0) n += Math.floor(prof) + 1;
  }
  return n;
}

const preenche = (dim: Dimension, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, bloco: string) => {
  if (y2 < y1) return;
  dim.fillBlocks(new BlockVolume({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }), bloco);
};

export const chunkPronto = (dim: Dimension, x: number, z: number): boolean => {
  const p = { x: Math.floor(x / 16) * 16, y: 0, z: Math.floor(z / 16) * 16 };
  return dim.isChunkLoaded(p) && dim.getBlock(p)?.typeId === MATRIZ;
};

/*
 * 1.17.0: cada chunk da Lua tem ~14 mil blocos postos pelo script (a dimensão não gera nada sozinha). Antes era tudo
 * de uma vez, dois chunks a cada meio segundo: no celular a tela travava. Agora o chunk é feito por um trabalho em
 * pedaços (system.runJob): o jogo dá um pouco de tempo por tick e o trabalho continua no tick seguinte. A ordem é de
 * cima para baixo (o chão aparece primeiro) e a rocha funda vai em fatias de 4 camadas.
 */
const FATIA = 4;
function* gerarChunk(dim: Dimension, cx: number, cz: number, semente: number): Generator<void, boolean, void> {
  const x0 = cx * 16, z0 = cz * 16;
  if (!dim.isChunkLoaded({ x: x0, y: 0, z: z0 }) || !dim.isChunkLoaded({ x: x0 + 15, y: 0, z: z0 + 15 })) return false;
  if (dim.getBlock({ x: x0, y: 0, z: z0 })?.typeId === MATRIZ) return true;
  const p = preparar(semente);
  const crateras: Cratera[] = [];
  for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
    const c = crateraDoChunk(semente, cx + dx, cz + dz);
    if (c) crateras.push(c);
  }
  const topo: number[] = new Array(256);
  let menor = Infinity;
  for (let z = 0; z < 16; z++) {
    medir("lua: ruído", () => {
      for (let x = 0; x < 16; x++) {
        const t = alturaBase(p, x0 + x, z0 + z) - fundoCratera(crateras, x0 + x, z0 + z);
        topo[z * 16 + x] = t;
        menor = Math.min(menor, t);
      }
    });
    if (z % 4 === 3) yield;
  }
  const T = LUA_GERACAO.terra;
  // Solo e terra (uma lista cada) e a rocha que falta entre a coluna mais baixa e a terra de cada coluna.
  medir("lua: blocos", () => {
    const terra: Vector3[] = [], solo: Vector3[] = [];
    for (let z = 0; z < 16; z++) for (let x = 0; x < 16; x++) {
      const t = topo[z * 16 + x], X = x0 + x, Z = z0 + z;
      for (let y = t - T; y <= t - 1; y++) terra.push({ x: X, y, z: Z });
      solo.push({ x: X, y: t, z: Z });
    }
    dim.fillBlocks(new ListBlockVolume(solo), SOLO);
    dim.fillBlocks(new ListBlockVolume(terra), TERRA);
  });
  yield;
  medir("lua: blocos", () => {
    const rocha: Vector3[] = [];
    for (let z = 0; z < 16; z++) for (let x = 0; x < 16; x++) {
      const t = topo[z * 16 + x];
      for (let y = menor - T; y <= t - T - 1; y++) rocha.push({ x: x0 + x, y, z: z0 + z });
    }
    if (rocha.length) dim.fillBlocks(new ListBlockVolume(rocha), ROCHA);
  });
  yield;
  // Rocha do fundo até abaixo da coluna mais baixa, em fatias, de cima para baixo.
  for (let y2 = menor - T - 1; y2 >= 1; y2 -= FATIA) {
    medir("lua: blocos", () => preenche(dim, x0, Math.max(1, y2 - FATIA + 1), z0, x0 + 15, y2, z0 + 15, ROCHA));
    yield;
  }
  // Veios de minério (passeio aleatório dentro da rocha): as posições de cada minério numa lista, trocando só a rocha
  // (o mesmo resultado de antes, que lia e trocava bloco a bloco).
  const sorte = rng(sementeDe(semente, cx, cz, 0x6f72));
  for (const [bloco, veios, tamanho, yMax] of VEIOS) {
    medir("lua: minérios", () => {
      const lista: Vector3[] = [];
      for (let v = 0; v < veios; v++) {
        let x = x0 + 1 + Math.floor(sorte() * 14), z = z0 + 1 + Math.floor(sorte() * 14), y = 4 + Math.floor(sorte() * (yMax - 4));
        for (let k = 0; k < tamanho; k++) {
          if (x >= x0 && x < x0 + 16 && z >= z0 && z < z0 + 16) lista.push({ x, y, z });
          const passo = Math.floor(sorte() * 6);
          if (passo === 0) x++;
          else if (passo === 1) x--;
          else if (passo === 2) z++;
          else if (passo === 3) z--;
          else if (passo === 4) y++;
          else y--;
        }
      }
      if (lista.length) dim.fillBlocks(new ListBlockVolume(lista), bloco, { blockFilter: { includeTypes: [ROCHA] } });
    });
    yield;
  }
  // Rocha matriz por último: é a marca de que o chunk ficou pronto.
  preenche(dim, x0, 0, z0, x0 + 15, 0, z0 + 15, MATRIZ);
  return true;
}

// O trabalho em andamento (um chunk de cada vez) e a área que a base lunar pede primeiro.
let emCurso: string | undefined;
let prioridade: { dim: Dimension; x1: number; z1: number; x2: number; z2: number } | undefined;
/** A base lunar pede o terreno da área dela primeiro (em blocos). undefined tira o pedido. */
export function pedirArea(a: typeof prioridade): void {
  prioridade = a;
}
function comecar(dim: Dimension, cx: number, cz: number, semente: number): void {
  const chave = `${cx},${cz}`;
  emCurso = chave;
  system.runJob(
    (function* () {
      try {
        const it = gerarChunk(dim, cx, cz, semente);
        let r = it.next();
        while (!r.done) {
          yield;
          r = it.next();
        }
        if (r.value) prontos.add(chave);
      } catch (erro) {
        // chunk descarregou no meio: fica para depois (os fills podem ser refeitos)
        if (!`${erro}`.includes("nload")) console.warn(`[Pouso Forçado] Lua, chunk ${chave}: ${erro}`);
      } finally {
        emCurso = undefined;
      }
    })(),
  );
}

const OFFSETS: ReadonlyArray<[number, number]> = (() => {
  const r = LUA_GERACAO.raioChunks;
  const l: Array<[number, number]> = [];
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.hypot(dx, dz) <= r + 0.5) l.push([dx, dz]);
  return l.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
})();
const prontos = new Set<string>();

// ---------- Monstros evoluídos ----------
// Na Lua, o que o jogo faz nascer no escuro vira a versão evoluída do Galacticraft; o resto some.
const EVOLUIDO: Readonly<Record<string, string>> = {
  "minecraft:zombie": "cl:zumbi_evoluido", "minecraft:husk": "cl:zumbi_evoluido", "minecraft:drowned": "cl:zumbi_evoluido", "minecraft:zombie_villager_v2": "cl:zumbi_evoluido",
  "minecraft:skeleton": "cl:esqueleto_evoluido", "minecraft:stray": "cl:esqueleto_evoluido", "minecraft:bogged": "cl:esqueleto_evoluido",
  "minecraft:spider": "cl:aranha_evoluida", "minecraft:cave_spider": "cl:aranha_evoluida",
  "minecraft:creeper": "cl:creeper_evoluido",
  // 1.17.0: enderman e bruxa também viram os evoluídos do Galacticraft (antes sumiam).
  "minecraft:enderman": "cl:enderman_evoluido",
  "minecraft:witch": "cl:bruxa_evoluida",
};
const SOMEM = new Set(["minecraft:slime", "minecraft:phantom", "minecraft:squid", "minecraft:glow_squid", "minecraft:cod", "minecraft:salmon", "minecraft:bat", "minecraft:dolphin", "minecraft:chicken"]);

// ---------- Meteoros ----------
// Galacticraft (frequência 7 na Lua): a cada tick, 1 chance em 7.000 de um meteoro pequeno e 1 em 21.000 de um
// grande para cada jogador, caindo a até 10 blocos dele. Explosão de força tamanho/3 + 2 e rocha de meteorito.
const METEORO = { checar: 20, pequeno: 7000, grande: 21000 } as const;
function meteoro(dim: Dimension, x0: number, z0: number, grande: boolean): void {
  const x = Math.floor(x0 + Math.random() * 20 - 10), z = Math.floor(z0 + Math.random() * 20 - 10);
  if (!dim.isChunkLoaded({ x, y: 0, z })) return;
  const chao = dim.getTopmostBlock({ x, z });
  if (!chao) return;
  const impacto = { x: x + 0.5, y: chao.y + 1, z: z + 0.5 };
  for (let k = 0; k <= 10; k++) {
    system.runTimeout(() => {
      try {
        const p = { x: impacto.x + (10 - k) * 2.5, y: impacto.y + (10 - k) * 8, z: impacto.z + (10 - k) * 2.5 };
        dim.spawnParticle("minecraft:basic_flame_particle", p);
        if (grande) dim.spawnParticle("minecraft:large_explosion", p);
      } catch {
        // chunk descarregou
      }
    }, k * 3);
  }
  system.runTimeout(() => {
    try {
      dim.createExplosion(impacto, grande ? 4 : 2.3, { breaksBlocks: true, causesFire: false });
      const r = grande ? 2 : 0;
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) for (let dy = -r; dy <= 0; dy++) {
        if (Math.hypot(dx, dy, dz) > r + 0.3) continue;
        dim.getBlock({ x: x + dx, y: chao.y - 1 + dy, z: z + dz })?.setType("cl:meteorito");
      }
    } catch {
      // chunk descarregou
    }
  }, 34);
}

// ---------- Céu (1.17.0) ----------
// Os planetas são a geometria de uma entidade sem corpo (tools/gerar-ceu-lua.mjs) que fica nos pés de cada jogador
// na Lua: desenhados a 48 blocos, parecem estar no céu e acompanham quem anda. Custo: um teleporte por tick por
// jogador na Lua.
const CEU = "cl:ceu_lua";
const ceus = new Map<string, Entity>();
function cuidarCeu(): void {
  for (const j of world.getPlayers()) {
    const e = ceus.get(j.id);
    if (j.dimension.id !== LUA) {
      if (e) {
        if (e.isValid) e.remove();
        ceus.delete(j.id);
      }
      continue;
    }
    try {
      if (e?.isValid) e.teleport(j.location, { rotation: { x: 0, y: 0 } });
      else ceus.set(j.id, j.dimension.spawnEntity(CEU, j.location));
    } catch {
      // chunk ainda carregando
    }
  }
}

export function registrarLua(): void {
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== EntityInitializationCause.Spawned || !entity.isValid || entity.dimension.id !== LUA) return;
    const tipo = entity.typeId;
    const novo = EVOLUIDO[tipo];
    if (!novo && !SOMEM.has(tipo)) return;
    const { dimension: dim, location } = entity;
    entity.remove();
    if (novo) system.run(() => dim.spawnEntity(novo, location));
  });
  intervalo("lua (céu)", cuidarCeu, 1);
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    const e = ceus.get(playerId);
    if (e?.isValid) e.remove();
    ceus.delete(playerId);
  });
  // Céu que sobrou de antes de fechar o mundo: sai (o laço põe um novo).
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === CEU && ![...ceus.values()].some((e) => e.id === entity.id)) entity.remove();
  });
  intervalo("lua (meteoros)", () => {
    for (const j of world.getPlayers({ excludeGameModes: [GameMode.Spectator] })) {
      if (j.dimension.id !== LUA) continue;
      const grande = Math.random() < METEORO.checar / METEORO.grande;
      if (!grande && Math.random() >= METEORO.checar / METEORO.pequeno) continue;
      aviso(j, "cl.gc.meteoro", 2);
      meteoro(j.dimension, j.location.x, j.location.z, grande);
    }
  }, METEORO.checar);
  intervalo("lua (terreno)", () => {
    if (emCurso) return; // um chunk de cada vez
    const naLua = world.getPlayers().filter((j) => j.dimension.id === LUA);
    if (naLua.length === 0) return;
    const dim = dimensaoLua();
    const semente = sementeDoMundo();
    const pronto = (cx: number, cz: number): boolean | undefined => {
      const chave = `${cx},${cz}`;
      if (prontos.has(chave)) return true;
      if (!dim.isChunkLoaded({ x: cx * 16, y: 0, z: cz * 16 })) return undefined;
      if (dim.getBlock({ x: cx * 16, y: 0, z: cz * 16 })?.typeId === MATRIZ) {
        prontos.add(chave);
        return true;
      }
      return false;
    };
    try {
      // Primeiro a área que a base lunar pediu (carregada pela área de carregamento dela).
      const a = prioridade;
      if (a) {
        for (let cx = Math.floor(a.x1 / 16); cx <= Math.floor(a.x2 / 16); cx++)
          for (let cz = Math.floor(a.z1 / 16); cz <= Math.floor(a.z2 / 16); cz++)
            if (pronto(cx, cz) === false) return comecar(dim, cx, cz, semente);
      }
      for (const j of naLua) {
        const l = j.location;
        const pcx = Math.floor(l.x / 16), pcz = Math.floor(l.z / 16);
        for (const [dx, dz] of OFFSETS) if (pronto(pcx + dx, pcz + dz) === false) return comecar(dim, pcx + dx, pcz + dz, semente);
      }
    } catch (erro) {
      console.warn(`[Pouso Forçado] Lua: ${erro}`);
    }
  }, 5);
}

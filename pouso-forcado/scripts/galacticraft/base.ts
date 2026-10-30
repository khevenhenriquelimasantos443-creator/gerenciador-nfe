import { BlockCustomComponent, BlockPermutation, BlockVolume, Dimension, EntityDamageCause, ItemStack, Player, Vector3, system, world } from "@minecraft/server";
import { LinhaSaque } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { sortearSaque } from "../util/aleatorio.js";
import { criarBauCom, darAoJogador } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";
import { chunkPronto, dimensaoLua } from "./lua.js";
import { LUA } from "./oxigenio.js";

/*
 * A Base de Pesquisa Lunar (1.6.1): o sinal que o rádio da nave pega. Ela é sorteada a 160–240 blocos de onde o
 * primeiro jogador pousou na Lua, e a Bússola do Avião aponta para ela enquanto se está na Lua.
 * Na superfície, uma cabine de tijolo lunar com um poço e escada; embaixo (y = 26), a masmorra do Galacticraft:
 * um salão, corredores e quatro salas (duas de monstros evoluídos, uma de baús e a do chefe). Na sala do chefe,
 * o Esqueleto Evoluído Gigante (150 de vida, flechas a cada 25 ticks e arremesso de quem chega perto, como no
 * Galacticraft) acorda quando alguém entra e volta se o jogador sair sem matá-lo. Ele deixa a Chave da Masmorra,
 * que abre o Baú do Tesouro com o Núcleo de Salto (o final novo, em scripts/mundo/reparo.ts).
 * A base é construída de uma vez, por fills, quando alguém chega a 28 blocos e o terreno em volta já existe.
 */
const PROP = "cl:base_lua";
const Y0 = 26; // chão da masmorra
const TIJOLO = "cl:tijolo_lunar", LUZ = "minecraft:glowstone";
type Base = { x: number; z: number; sy?: number; feita?: boolean; chefe?: boolean; salas?: string[] };
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
const MONSTROS = ["cl:zumbi_evoluido", "cl:zumbi_evoluido", "cl:esqueleto_evoluido", "cl:aranha_evoluida", "cl:creeper_evoluido"];

export function lerBase(): Base | undefined {
  const v = world.getDynamicProperty(PROP);
  if (typeof v !== "string") return undefined;
  try {
    return JSON.parse(v) as Base;
  } catch {
    return undefined;
  }
}
const gravarBase = (b: Base) => world.setDynamicProperty(PROP, JSON.stringify(b));
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
function sala(dim: Dimension, cx: number, cz: number, s: Sala): void {
  const x = cx + s.dx, z = cz + s.dz, r = s.r;
  caixa(dim, { x: x - r - 1, y: Y0, z: z - r - 1 }, { x: x + r + 1, y: Y0 + s.altura + 1, z: z + r + 1 }, TIJOLO);
  caixa(dim, { x: x - r, y: Y0 + 1, z: z - r }, { x: x + r, y: Y0 + s.altura, z: z + r }, "minecraft:air");
  // Luz no teto: nos cantos (o salão e a sala do chefe bem acesos; as outras, penumbra).
  const cantos = s.tipo === "monstros" ? [[0, 0]] : [[-r + 1, -r + 1], [r - 1, -r + 1], [-r + 1, r - 1], [r - 1, r - 1]];
  for (const [dx, dz] of cantos) dim.getBlock({ x: x + dx, y: Y0 + s.altura + 1, z: z + dz })?.setType(LUZ);
}

function construir(dim: Dimension, b: Base): void {
  const cx = b.x, cz = b.z;
  const sy = dim.getTopmostBlock({ x: cx, z: cz })?.y ?? 64;
  // Masmorra: salas e corredores.
  for (const s of SALAS) sala(dim, cx, cz, s);
  for (const [x1, z1, x2, z2] of CORREDORES) {
    caixa(dim, { x: cx + x1 - 1, y: Y0, z: cz + z1 - 1 }, { x: cx + x2 + 1, y: Y0 + 5, z: cz + z2 + 1 }, TIJOLO);
  }
  // Abre os corredores e reabre as salas (as paredes dos corredores entram um bloco nelas).
  for (const [x1, z1, x2, z2] of CORREDORES) caixa(dim, { x: cx + x1, y: Y0 + 1, z: cz + z1 }, { x: cx + x2, y: Y0 + 4, z: cz + z2 }, "minecraft:air");
  for (const s of SALAS) caixa(dim, { x: cx + s.dx - s.r, y: Y0 + 1, z: cz + s.dz - s.r }, { x: cx + s.dx + s.r, y: Y0 + s.altura, z: cz + s.dz + s.r }, "minecraft:air");
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
  criarBauCom(dim, { x: cx + oeste.dx - 3, y: Y0 + 1, z: cz - 3 }, sortearSaque(SAQUE_BAU));
  criarBauCom(dim, { x: cx + oeste.dx - 3, y: Y0 + 1, z: cz + 3 }, sortearSaque(SAQUE_BAU));
  const chefe = SALAS.find((s) => s.id === "chefe")!;
  dim.getBlock({ x: cx, y: Y0 + 1, z: cz + chefe.dz + chefe.r - 1 })?.setPermutation(
    BlockPermutation.resolve("cl:bau_tesouro", { "minecraft:cardinal_direction": "north", "cl:aberto": false }),
  );
  b.sy = sy;
  b.feita = true;
  b.salas = [];
  gravarBase(b);
}

function podeConstruir(dim: Dimension, b: Base): boolean {
  for (let x = b.x - 40; x <= b.x + 40; x += 16) for (let z = b.z - 40; z <= b.z + 48; z += 16) if (!chunkPronto(dim, x, z)) return false;
  return chunkPronto(dim, b.x + 40, b.z + 48);
}

// ---------- Salas, chefe e baú ----------
const dentro = (p: Vector3, b: Base, s: Sala) =>
  Math.abs(p.x - (b.x + s.dx + 0.5)) <= s.r + 0.5 && Math.abs(p.z - (b.z + s.dz + 0.5)) <= s.r + 0.5 && p.y >= Y0 && p.y <= Y0 + s.altura + 1;

function acordarSala(dim: Dimension, b: Base, s: Sala): void {
  const centro = { x: b.x + s.dx + 0.5, y: Y0 + 1, z: b.z + s.dz + 0.5 };
  if (s.tipo === "chefe") {
    if (b.chefe) return;
    const vivo = dim.getEntities({ type: "cl:esqueleto_chefe", location: centro, maxDistance: s.r * 2 + 4 }).length > 0;
    if (vivo) return;
    dim.spawnEntity("cl:esqueleto_chefe", centro);
    for (const p of dim.getPlayers({ location: centro, maxDistance: 30 })) p.onScreenDisplay.setTitle({ translate: "cl.gc.chefe_acordou" }, { fadeInDuration: 10, stayDuration: 50, fadeOutDuration: 10 });
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
      darAoJogador(j, "cl:nucleo_salto", 1);
      for (const p of sortearSaque(SAQUE_TESOURO)) darAoJogador(j, p.item, p.quantidade);
      j.playSound("random.chestopen");
      j.playSound("random.levelup");
      j.onScreenDisplay.setTitle({ text: "§d✦" }, { subtitle: { translate: "cl.gc.bau_aberto" }, fadeInDuration: 10, stayDuration: 60, fadeOutDuration: 10 });
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
    const b = lerBase();
    if (!b) return;
    const dim = dimensaoLua();
    for (const j of naLua) {
      const perto = Math.hypot(j.location.x - b.x, j.location.z - b.z);
      if (!b.feita) {
        if (perto <= 28 && podeConstruir(dim, b)) {
          try {
            construir(dim, b);
          } catch (erro) {
            console.warn(`[Pouso Forçado] base lunar: ${erro}`);
          }
        }
        continue;
      }
      if (perto <= 12 && j.getDynamicProperty("cl:viu_base") !== true) {
        j.setDynamicProperty("cl:viu_base", true);
        registrarAcao(j, "base_lua");
        aviso(j, "cl.gc.base_entrada", 6);
      }
      for (const s of SALAS) if (dentro(j.location, b, s)) acordarSala(dim, b, s);
    }
    arremessar(dim);
  }, 20);
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_base põe a base 6 blocos ao lado.
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    if (id !== "cl:teste_base" || !(j instanceof Player)) return;
    gravarBase({ x: Math.floor(j.location.x) + 6, z: Math.floor(j.location.z) });
  });
  world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    if (deadEntity.typeId !== "cl:esqueleto_chefe") return;
    // A chave sai pelo script, no meio da sala do chefe (depois da morte o jogo não deixa ler a posição dele, e
    // assim também não depende da regra de saque de monstros do mundo).
    const b = lerBase();
    if (b) {
      const s = SALAS.find((x) => x.tipo === "chefe")!;
      try {
        dimensaoLua().spawnItem(new ItemStack("cl:chave_masmorra", 1), { x: b.x + s.dx + 0.5, y: Y0 + 1.5, z: b.z + s.dz + 0.5 });
      } catch {
        // sala fora do mundo carregado
      }
      b.chefe = true;
      gravarBase(b);
    }
    for (const j of world.getPlayers()) {
      if (j.dimension.id !== LUA) continue;
      j.sendMessage({ translate: "cl.gc.chefe_morto" });
      if (!b || Math.hypot(j.location.x - b.x, j.location.z - (b.z + 34)) <= 40) registrarAcao(j, "chefe_lua");
    }
  });
}

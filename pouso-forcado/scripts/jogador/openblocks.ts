import { Block, Dimension, Player, system, Vector3, world } from "@minecraft/server";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { intervalo } from "../util/perfil.js";

/*
 * OpenBlocks (1.3.0).
 * - Asa-Delta: segurando na mão e caindo, plana para a frente devagar (agachar fecha a asa).
 * - Elevador: em cima de um, pular leva ao próximo Elevador acima (até 20 blocos); agachar, ao de baixo.
 * - Túmulo: ao morrer, o que caiu no chão vai para um Túmulo no lugar da morte. Tocar devolve tudo.
 */
const ASA = { frente: 0.5, descida: -0.08 };
const ELEVADOR = "cl:elevador";
const ALCANCE = 20;
const TUMULO = "cl:tumulo";
type Tumulo = { dono: string; itens: ItemSalvo[] };

// ---------- Asa-Delta ----------
const planando = new Set<string>();
function cuidarAsa(j: Player): void {
  const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
  const caindo = !j.isOnGround && !j.isInWater && !j.isSneaking && j.getVelocity().y < -0.1;
  if (mao?.typeId !== "cl:asa_delta" || !(caindo || (planando.has(j.id) && !j.isOnGround && !j.isSneaking))) {
    planando.delete(j.id);
    return;
  }
  const v = j.getViewDirection();
  const h = Math.hypot(v.x, v.z) || 1;
  j.applyKnockback({ x: (v.x / h) * ASA.frente, z: (v.z / h) * ASA.frente }, ASA.descida);
  if (!planando.has(j.id)) {
    planando.add(j.id);
    registrarAcao(j, "asa_delta");
  }
}

// ---------- Elevador ----------
type Pe = { pos: { x: number; y: number; z: number }; tick: number };
const pisou = new Map<string, Pe>();
const antes = new Map<string, { pulo: boolean; agacha: boolean }>();
const livre = (b: Block | undefined) => !!b && (b.isAir || b.isLiquid);
function cuidarElevador(j: Player): void {
  const dim = j.dimension;
  const l = j.location;
  if (j.isOnGround) {
    const embaixo = dim.getBlock({ x: Math.floor(l.x), y: Math.floor(l.y - 0.1), z: Math.floor(l.z) });
    if (embaixo?.typeId === ELEVADOR) pisou.set(j.id, { pos: { x: embaixo.x, y: embaixo.y, z: embaixo.z }, tick: system.currentTick });
  }
  const era = antes.get(j.id) ?? { pulo: false, agacha: false };
  // Um toque rápido no pulo pode durar 1 tick só: a subida (velocidade) também conta.
  const agora = { pulo: j.isJumping || j.getVelocity().y > 0.2, agacha: j.isSneaking };
  antes.set(j.id, agora);
  const pe = pisou.get(j.id);
  if (!pe || system.currentTick - pe.tick > 6) return;
  const sobe = agora.pulo && !era.pulo, desce = agora.agacha && !era.agacha;
  if (!sobe && !desce) return;
  const passo = sobe ? 1 : -1;
  for (let d = 2; d <= ALCANCE; d++) {
    const y = pe.pos.y + passo * d;
    let b: Block | undefined;
    try {
      b = dim.getBlock({ x: pe.pos.x, y, z: pe.pos.z });
    } catch {
      return;
    }
    if (b?.typeId !== ELEVADOR || !livre(b.above()) || !livre(b.above(2))) continue;
    j.teleport({ x: pe.pos.x + 0.5, y: y + 1, z: pe.pos.z + 0.5 }, { keepVelocity: false });
    j.playSound("mob.endermen.portal", { volume: 0.5, pitch: 1.4 });
    pisou.set(j.id, { pos: { x: pe.pos.x, y, z: pe.pos.z }, tick: system.currentTick });
    registrarAcao(j, "elevador");
    return;
  }
}

// ---------- Túmulo ----------
function lugarDoTumulo(dim: Dimension, onde: Vector3): Block | undefined {
  const { min, max } = dim.heightRange;
  const x = Math.floor(onde.x), z = Math.floor(onde.z);
  let y = Math.min(max - 1, Math.max(min + 1, Math.floor(onde.y)));
  for (let k = 0; k < 16 && y < max; k++, y++) {
    const b = dim.getBlock({ x, y, z });
    if (!b) return undefined;
    if (b.isAir || b.isLiquid || b.typeId === "minecraft:fire") return b;
  }
  return undefined;
}
function enterrar(j: Player, dim: Dimension, onde: Vector3): void {
  const itens = dim.getEntities({ type: "minecraft:item", location: onde, maxDistance: 4 });
  const salvos: ItemSalvo[] = [];
  for (const e of itens) {
    const s = salvarItem(e.getComponent("minecraft:item")?.itemStack);
    if (s) salvos.push(s);
  }
  if (!salvos.length) return;
  const b = lugarDoTumulo(dim, onde);
  if (!b) return;
  for (const e of itens) e.remove();
  b.setType(TUMULO);
  gravar<Tumulo>("tumulo", b, { dono: j.name, itens: salvos });
  j.sendMessage({ translate: "cl.ob.tumulo_criado", with: [String(b.x), String(b.y), String(b.z)] });
}
function esvaziar(b: Block, j?: Player): void {
  const t = ler<Tumulo | undefined>("tumulo", b, undefined);
  gravar("tumulo", b, undefined);
  for (const s of t?.itens ?? []) {
    const i = carregarItem(s);
    if (!i) continue;
    if (j) darAoJogador(j, i);
    else b.dimension.spawnItem(i, b.center());
  }
}
export const tumulo = {
  onPlayerInteract(e: { block: Block; player?: Player }) {
    const { block: b, player: j } = e;
    if (!j) return;
    esvaziar(b, j);
    b.setType("minecraft:air");
    j.playSound("random.pop");
    registrarAcao(j, "tumulo");
  },
};

export function registrarOpenBlocks(): void {
  intervalo("asa_delta", () => {
    for (const j of world.getPlayers()) cuidarAsa(j);
  }, 2);
  // Todo tick: o pulo pode durar 1 tick só (é barato: um bloco lido por jogador).
  intervalo("elevador", () => {
    for (const j of world.getPlayers()) cuidarElevador(j);
  }, 1);
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    planando.delete(playerId);
    pisou.delete(playerId);
    antes.delete(playerId);
  });
  // Os itens caem no tick da morte; recolhe logo depois.
  world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    if (!(deadEntity instanceof Player)) return;
    const j = deadEntity, dim = j.dimension, onde = { ...j.location };
    system.runTimeout(() => {
      if (j.isValid) enterrar(j, dim, onde);
    }, 2);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id === TUMULO) esvaziar(block);
  });
  registrarDetalhe(TUMULO, (b) => {
    const t = ler<Tumulo | undefined>("tumulo", b, undefined);
    return t ? { translate: "cl.ob.tumulo", with: [t.dono, String(t.itens.reduce((n, s) => n + s.n, 0))] } : undefined;
  });
}

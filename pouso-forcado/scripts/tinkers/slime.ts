import { Block, BlockCustomComponent, Player } from "@minecraft/server";
import { DADOS_F46 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * Mundo dos slimes do Tinkers' Construct 3 (1.27.0, Tinkers completo parte 2):
 * - Mudas de slime: a cada 30 a 90 s, 1 chance em 4 (o tique aleatório não chega aos blocos do add-on) de virar a árvore do TC3 — tronco de 4+0..3
 *   (Coração-Verde) ou 5+0..4 (Raízes-do-Céu, com trepadeiras) e copa de folhas de slime — se houver espaço.
 * - Drusa de cristal de slime: a cada 30 a 90 s, 1 chance em 3 de brotar um aglomerado num lado livre.
 * - Slime congelado e blocos de slime: quem cai neles não se machuca e quica (metade da altura da queda).
 */
type Arvore = readonly [string, string, number, number, string];
const ARVORES = DADOS_F46.arvores as unknown as Readonly<Record<string, Arvore>>;
const CRISTAIS = DADOS_F46.cristais as unknown as Readonly<Record<string, string>>;
const LADOS = [{ x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 }, { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }];

/** Planta a árvore de slime a partir de `b` (a muda). */
export function crescerArvore(b: Block): boolean {
  const def = ARVORES[b.typeId];
  if (!def) return false;
  const [tronco, folhas, base, aleatorio, trep] = def;
  const altura = base + Math.floor(Math.random() * (aleatorio + 1));
  for (let k = 1; k <= altura + 1; k++) {
    const c = b.offset({ x: 0, y: k, z: 0 });
    if (!c || !c.isAir) return false;
  }
  const dim = b.dimension;
  for (let k = 0; k < altura; k++) dim.getBlock({ x: b.x, y: b.y + k, z: b.z })?.setType(tronco);
  const topo = b.y + altura;
  for (const [dy, r] of [[-2, 2], [-1, 2], [0, 1], [1, 1]] as const) {
    for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) {
      if (Math.abs(dx) === r && Math.abs(dz) === r && (r === 1 || Math.random() < 0.6)) continue;
      const c = dim.getBlock({ x: b.x + dx, y: topo + dy, z: b.z + dz });
      if (!c?.isAir) continue;
      c.setType(folhas);
      if (trep && r === 2 && Math.random() < 0.15) {
        const baixo = c.below();
        if (baixo?.isAir) baixo.setType(trep);
      }
    }
  }
  return true;
}

export const mudaSlimeComp: BlockCustomComponent = {
  onTick({ block }) {
    if (Math.random() < 1 / 4 && crescerArvore(block)) {
      const j = block.dimension.getPlayers({ location: block.center(), maxDistance: 24, closest: 1 })[0];
      if (j) registrarAcao(j, "tc_arvore_slime");
    }
  },
  onPlayerInteract({ block, player }) {
    // Farinha de osso faz crescer (como as mudas do jogo).
    const inv = player?.getComponent("minecraft:inventory")?.container;
    const mao = player && inv?.getItem(player.selectedSlotIndex);
    if (!player || !inv || mao?.typeId !== "minecraft:bone_meal") return;
    if (mao.amount > 1) {
      mao.amount--;
      inv.setItem(player.selectedSlotIndex, mao);
    } else inv.setItem(player.selectedSlotIndex, undefined);
    block.dimension.spawnParticle("minecraft:crop_growth_emitter", block.center());
    if (Math.random() < 0.45 && crescerArvore(block)) registrarAcao(player, "tc_arvore_slime");
  },
};

export const cristalBrotandoComp: BlockCustomComponent = {
  onTick({ block }) {
    if (Math.random() >= 1 / 3) return;
    const cacho = CRISTAIS[block.typeId];
    const lado = LADOS[Math.floor(Math.random() * LADOS.length)];
    if (!cacho) return;
    const c = block.offset(lado);
    if (c?.isAir) c.setType(cacho);
  },
};

export const slimeCongeladoComp: BlockCustomComponent = {
  onEntityFallOn({ entity, fallDistance }) {
    if (!entity || fallDistance < 1) return;
    try {
      entity.addEffect("resistance", 5, { amplifier: 4, showParticles: false });
      if (entity instanceof Player && !entity.isSneaking) entity.applyKnockback({ x: 0, z: 0 }, Math.min(1.6, 0.25 + fallDistance * 0.08));
    } catch {
      // saiu
    }
  },
};

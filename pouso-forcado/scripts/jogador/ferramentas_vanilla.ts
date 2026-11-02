import { EquipmentSlot, GameMode, Player, system, world } from "@minecraft/server";
import { FERRAMENTAS_VANILLA as F } from "../config.js";
import { aviso } from "./hud.js";

/*
 * 1.16.0: as ferramentas do próprio Minecraft são péssimas (a progressão é a dos mods, como no Crash Landing):
 * - na mão, Cansaço (minera devagar) e, espada e machado, Fraqueza (batem menos);
 * - a cada bloco ou golpe gastam F.desgaste vezes o normal (uma picareta de ferro dura ~30 blocos).
 * As ferramentas de verdade são as do Tinkers, do Mekanism Tools e do Ender IO.
 * Custo: um laço de 0,5 s que olha a mão de cada jogador; o desgaste vai nos eventos de quebrar e bater.
 */
const RE = /^minecraft:(wooden|stone|iron|golden|diamond|netherite|copper)_(pickaxe|axe|shovel|hoe|sword)$/;
export const ehFerramentaVanilla = (id: string | undefined): boolean => !!id && RE.test(id);
const avisado = new Map<string, number>();

const naMao = (j: Player) => j.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);

/** Gasta n de durabilidade a mais na ferramenta do Minecraft da mão (quebra se acabar). */
function desgastar(j: Player, n: number): void {
  if (n <= 0 || j.getGameMode() === GameMode.Creative) return;
  const eq = j.getComponent("minecraft:equippable");
  const i = eq?.getEquipment(EquipmentSlot.Mainhand);
  if (!eq || !i || !ehFerramentaVanilla(i.typeId)) return;
  const d = i.getComponent("minecraft:durability");
  if (!d) return;
  if (d.damage + n >= d.maxDurability) {
    eq.setEquipment(EquipmentSlot.Mainhand, undefined);
    j.playSound("random.break");
    return;
  }
  d.damage += n;
  eq.setEquipment(EquipmentSlot.Mainhand, i);
}

/** Tira o Cansaço/Fraqueza que este arquivo pôs (mesmo nível e no máximo a duração dele), ao largar a ferramenta. */
function limpar(j: Player): void {
  for (const [ef, nivel] of [["mining_fatigue", F.cansaco], ["weakness", F.fraqueza]] as const) {
    const e = j.getEffect(ef);
    if (e && e.amplifier === nivel && e.duration <= F.duracao) j.removeEffect(ef);
  }
}

export function registrarFerramentasVanilla(): void {
  system.runInterval(() => {
    for (const j of world.getPlayers()) {
      const m = RE.exec(naMao(j)?.typeId ?? "");
      if (!m) continue;
      j.addEffect("mining_fatigue", F.duracao, { amplifier: F.cansaco, showParticles: false });
      if (m[2] === "sword" || m[2] === "axe") j.addEffect("weakness", F.duracao, { amplifier: F.fraqueza, showParticles: false });
    }
  }, F.intervalo);
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player: j, itemStack: i }) => {
    if (!ehFerramentaVanilla(i?.typeId)) return limpar(j);
    const agora = system.currentTick;
    if (agora - (avisado.get(j.id) ?? -1e9) < F.avisoTicks) return;
    avisado.set(j.id, agora);
    aviso(j, { translate: "cl.vanilla.ruim" }, 4);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ player: j, itemStackAfterBreak: i }) => {
    if (ehFerramentaVanilla(i?.typeId)) desgastar(j, F.desgaste - 1);
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: j }) => {
    if (j instanceof Player && ehFerramentaVanilla(naMao(j)?.typeId)) desgastar(j, F.desgaste - 1);
  });
}

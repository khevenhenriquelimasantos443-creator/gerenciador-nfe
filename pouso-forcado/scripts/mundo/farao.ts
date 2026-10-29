import { BlockCustomComponent, Dimension, Entity, EntityDamageCause, GameMode, Vector3, system, world } from "@minecraft/server";
import { FARAO, MONSTROS_CL } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { avisarErro } from "../util/erros.js";
import { comecarTempestade, tempestadeAtiva } from "./tempestade.js";
import { intervalo } from "../util/perfil.js";
import { nascerDoAddon } from "../util/nascer.js";

/*
 * Faraó Amaldiçoado, o chefe do deserto.
 * - Acorda quando alguém toca no Ídolo Amaldiçoado (receita: ouro, faixas de múmia e arenito
 *   talhado) À NOITE; o ídolo some e, depois de um estrondo, ele sobe da areia. Só um por vez.
 * - Tem barra de chefe (minecraft:boss), 300 de vida, não queima no sol e não é empurrado.
 * - A cada FARAO.invocarCadaTicks chama múmias e escorpiões em volta.
 * - A cada FARAO.rajadaCadaTicks solta uma rajada de areia: quem está a até FARAO.rajadaRaio
 *   blocos é ferido, empurrado para longe e fica cego por 3 s.
 * - Abaixo de metade da vida chama uma tempestade de areia (uma vez).
 * - Ao morrer deixa o Coração do Faraó (peça para a Fase 8), ouro, diamantes e maçãs douradas.
 * Custo: a cada 1 s, uma busca de faraós no Overworld (quase sempre nenhum).
 */
const PROP_TEMPESTADE = "cl:chamou_tempestade";
const proximos = new Map<string, { invocar: number; rajada: number }>();

const ehNoite = (): boolean => {
  const t = world.getTimeOfDay();
  return t >= FARAO.noiteInicio && t <= FARAO.noiteFim;
};

function efeito(dimensao: Dimension, particula: string, local: Vector3): void {
  try {
    dimensao.spawnParticle(particula, local);
  } catch {
    // enfeite
  }
}

function despertar(dimensao: Dimension, local: Vector3): void {
  for (const jogador of dimensao.getPlayers({ location: local, maxDistance: 64 })) {
    jogador.onScreenDisplay.setTitle(
      { translate: "cl.farao.titulo" },
      { subtitle: { translate: "cl.farao.subtitulo" }, fadeInDuration: 10, stayDuration: 60, fadeOutDuration: 20 },
    );
    jogador.playSound("mob.wither.spawn", { volume: 0.8 });
  }
  efeito(dimensao, "minecraft:huge_explosion_emitter", local);
  system.runTimeout(() => {
    try {
      nascerDoAddon(dimensao, MONSTROS_CL.farao, local);
      efeito(dimensao, "minecraft:large_explosion", { x: local.x, y: local.y + 1, z: local.z });
    } catch (erro) {
      avisarErro("faraó não nasceu", erro);
    }
  }, 40);
}

export const idoloAmaldicoado: BlockCustomComponent = {
  onPlayerInteract(e) {
    const jogador = e.player;
    if (!jogador) return;
    if (!ehNoite()) {
      aviso(jogador, "cl.farao.so_noite", 4);
      return;
    }
    const centro = e.block.center();
    if (e.dimension.getEntities({ type: MONSTROS_CL.farao, location: centro, maxDistance: 128 }).length > 0) {
      aviso(jogador, "cl.farao.ja_acordado", 4);
      return;
    }
    const { x, y, z } = e.block.location;
    e.block.setType("minecraft:air");
    despertar(e.dimension, { x: x + 0.5, y, z: z + 0.5 });
  },
};

function invocar(farao: Entity, agora: number): void {
  const dimensao = farao.dimension;
  const servos = dimensao.getEntities({ location: farao.location, maxDistance: 20, families: ["mumia"] }).length;
  if (servos >= FARAO.maxServos) return;
  for (let i = 0; i < FARAO.invocarQtd; i++) {
    const angulo = Math.random() * Math.PI * 2;
    const r = 3 + Math.random() * 3;
    const x = Math.floor(farao.location.x + Math.cos(angulo) * r);
    const z = Math.floor(farao.location.z + Math.sin(angulo) * r);
    const chao = dimensao.getTopmostBlock({ x, z });
    if (!chao || Math.abs(chao.y - farao.location.y) > 4) continue;
    const local = { x: x + 0.5, y: chao.y + 1, z: z + 0.5 };
    nascerDoAddon(dimensao, MONSTROS_CL.mumia, local);
    efeito(dimensao, "minecraft:large_explosion", local);
  }
  dimensao.playSound("mob.evocation_illager.prepare_summon", farao.location);
  proximos.get(farao.id)!.invocar = agora + FARAO.invocarCadaTicks;
}

function rajada(farao: Entity, agora: number): void {
  const dimensao = farao.dimension;
  const centro = farao.location;
  efeito(dimensao, "minecraft:huge_explosion_emitter", { x: centro.x, y: centro.y + 1, z: centro.z });
  dimensao.playSound("mob.wither.shoot", centro);
  for (const jogador of dimensao.getPlayers({ location: centro, maxDistance: FARAO.rajadaRaio, excludeGameModes: [GameMode.Creative, GameMode.Spectator] })) {
    const dx = jogador.location.x - centro.x, dz = jogador.location.z - centro.z;
    const d = Math.max(0.5, Math.hypot(dx, dz));
    jogador.applyDamage(FARAO.rajadaDano, { cause: EntityDamageCause.entityAttack, damagingEntity: farao });
    jogador.applyKnockback({ x: (dx / d) * 1.8, z: (dz / d) * 1.8 }, 0.5);
    jogador.addEffect("blindness", 60, { amplifier: 0 });
  }
  proximos.get(farao.id)!.rajada = agora + FARAO.rajadaCadaTicks;
}

function talvezTempestade(farao: Entity): void {
  if (farao.getDynamicProperty(PROP_TEMPESTADE)) return;
  const vida = farao.getComponent("minecraft:health");
  if (!vida || vida.currentValue > vida.effectiveMax * FARAO.tempestadeAbaixoDe) return;
  farao.setDynamicProperty(PROP_TEMPESTADE, true);
  for (const jogador of farao.dimension.getPlayers({ location: farao.location, maxDistance: 64 })) {
    jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.farao.tempestade" }] });
  }
  if (!tempestadeAtiva()) comecarTempestade();
}

function agir(farao: Entity, agora: number): void {
  const perto = farao.dimension.getPlayers({
    location: farao.location,
    maxDistance: FARAO.raioAlvo,
    excludeGameModes: [GameMode.Creative, GameMode.Spectator],
  });
  if (perto.length === 0) return;
  if (!proximos.has(farao.id)) proximos.set(farao.id, { invocar: agora + 100, rajada: agora + 60 });
  const estado = proximos.get(farao.id)!;
  if (agora >= estado.invocar) invocar(farao, agora);
  if (agora >= estado.rajada) rajada(farao, agora);
  talvezTempestade(farao);
}

export function registrarFarao(): void {
  intervalo("faraó", () => {
    const agora = system.currentTick;
    for (const farao of world.getDimension("minecraft:overworld").getEntities({ type: MONSTROS_CL.farao })) {
      try {
        agir(farao, agora);
      } catch (erro) {
        avisarErro("faraó", erro);
      }
    }
  }, 20);

  world.afterEvents.entityDie.subscribe(
    ({ deadEntity }) => {
      proximos.delete(deadEntity.id);
      for (const jogador of world.getPlayers()) {
        if (jogador.dimension.id !== "minecraft:overworld") continue;
        jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.farao.derrotado" }] });
        jogador.playSound("random.totem", { volume: 0.6 });
      }
    },
    { entityTypes: [MONSTROS_CL.farao] },
  );
}

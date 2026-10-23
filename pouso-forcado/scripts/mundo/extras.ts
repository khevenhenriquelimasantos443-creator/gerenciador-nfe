import { GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { chunkDaNave } from "../util/aleatorio.js";
import { registrarDetalhe } from "../util/dados.js";
import { gastarFerramenta } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";
import { noiteDeHorda } from "./horda_noturna.js";

/*
 * Ideias do projeto (1.2.0):
 * - Bússola do Avião: na mão, mostra para que lado e a quantos metros está o Painel da Nave.
 * - Saco de Dormir: à noite, sem monstro a 12 blocos e fora da noite de horda, pula para o amanhecer
 *   (gasta 1 dos 16 usos). Não muda o ponto de renascer.
 * - Meteoros: a cada minuto, 1 chance em 40 de cair um meteorito a 40–90 blocos de um jogador ao ar
 *   livre (uns 2 por dia de jogo em média). Explosão, cratera e 6–9 Rochas de Meteorito com minérios.
 */
const LADOS = ["frente", "frente_direita", "direita", "tras_direita", "tras", "tras_esquerda", "esquerda", "frente_esquerda"];
const METEORO = { chancePorMinuto: 1 / 40, distancia: [40, 90], raio: 1.6 };
const SAQUE_METEORITO: ReadonlyArray<[string, number, number, number]> = [
  // item, mín, máx, chance
  ["cl:fragmento_meteorito", 1, 2, 1],
  ["minecraft:raw_iron", 1, 3, 0.5],
  ["minecraft:raw_copper", 1, 3, 0.4],
  ["minecraft:raw_gold", 1, 2, 0.2],
  ["cl:cristal_certus", 1, 2, 0.25],
  ["cl:po_yellorium", 1, 1, 0.15],
  ["minecraft:diamond", 1, 1, 0.05],
];

// ---------- Bússola ----------
function alvoDoAviao(): { dim: string; x: number; z: number } | undefined {
  try {
    const v = world.getDynamicProperty(PROPS.naveLocal);
    if (typeof v === "string") return JSON.parse(v) as { dim: string; x: number; z: number };
  } catch {
    // dado velho
  }
  const c = chunkDaNave();
  return c ? { dim: "minecraft:overworld", x: c[0] * 16 + 8, z: c[1] * 16 + 8 } : undefined;
}

function mostrarRumo(j: Player): void {
  const alvo = alvoDoAviao();
  if (!alvo) return aviso(j, "cl.bus.sem", 2);
  if (alvo.dim !== j.dimension.id) return aviso(j, "cl.bus.outra_dim", 2);
  const dx = alvo.x + 0.5 - j.location.x, dz = alvo.z + 0.5 - j.location.z;
  const dist = Math.round(Math.hypot(dx, dz));
  if (dist < 4) return aviso(j, "cl.bus.chegou", 2);
  const yaw = (j.getRotation().y * Math.PI) / 180;
  const frente = dx * -Math.sin(yaw) + dz * Math.cos(yaw);
  const direita = dx * -Math.cos(yaw) + dz * -Math.sin(yaw);
  const setor = (Math.round((Math.atan2(direita, frente) * 180) / Math.PI / 45) + 8) % 8;
  aviso(j, { translate: "cl.bus.rumo", with: { rawtext: [{ translate: `cl.bus.${LADOS[setor]}` }, { text: String(dist) }] } }, 2);
}

// ---------- Saco de dormir ----------
function dormir(j: Player): void {
  const t = world.getTimeOfDay();
  if (t < 12542 || t > 23460) return aviso(j, "cl.saco.dia", 3);
  if (noiteDeHorda()) return aviso(j, "cl.saco.horda", 3);
  if (j.dimension.getEntities({ location: j.location, maxDistance: 12, families: ["monster"] }).length) return aviso(j, "cl.saco.monstros", 3);
  j.camera.fade({ fadeTime: { fadeInTime: 0.8, holdTime: 1.2, fadeOutTime: 1 }, fadeColor: { red: 0, green: 0, blue: 0 } });
  system.runTimeout(() => {
    world.setTimeOfDay(0);
    if (!j.isValid) return;
    gastarFerramenta(j);
    aviso(j, "cl.saco.dormiu", 4);
    registrarAcao(j, "saco_dormir");
  }, 20);
}

// ---------- Meteoros ----------
function cairMeteoro(): void {
  const jogadores = world.getPlayers({ excludeGameModes: [GameMode.Creative, GameMode.Spectator] }).filter((j) => j.dimension.id === "minecraft:overworld");
  if (!jogadores.length) return;
  const j = jogadores[Math.floor(Math.random() * jogadores.length)];
  const dim = j.dimension;
  const ang = Math.random() * Math.PI * 2;
  const d = METEORO.distancia[0] + Math.random() * (METEORO.distancia[1] - METEORO.distancia[0]);
  const x = Math.floor(j.location.x + Math.cos(ang) * d), z = Math.floor(j.location.z + Math.sin(ang) * d);
  if (!dim.isChunkLoaded({ x, y: j.location.y, z })) return;
  const chao = dim.getTopmostBlock({ x, z });
  if (!chao || chao.isLiquid) return;
  const impacto = { x: x + 0.5, y: chao.y + 1, z: z + 0.5 };
  // A queda: um rastro de fogo descendo em 2 s.
  for (let k = 0; k <= 10; k++) {
    system.runTimeout(() => {
      try {
        const p = { x: impacto.x + (10 - k) * 3, y: impacto.y + (10 - k) * 6, z: impacto.z };
        dim.spawnParticle("minecraft:large_explosion", p);
        dim.spawnParticle("minecraft:basic_flame_particle", p);
      } catch {
        // chunk descarregou
      }
    }, k * 4);
  }
  system.runTimeout(() => {
    try {
      dim.createExplosion(impacto, 3, { breaksBlocks: true, causesFire: false });
      const r = METEORO.raio;
      for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 1; dy++) for (let dz = -2; dz <= 2; dz++) {
        const dd = Math.hypot(dx, dy * 1.3, dz);
        if (dd > r + Math.random() * 0.4) continue;
        dim.getBlock({ x: x + dx, y: chao.y - 1 + dy, z: z + dz })?.setType(Math.random() < 0.15 ? "minecraft:magma" : "cl:meteorito");
      }
      for (const p of world.getPlayers()) {
        if (p.dimension.id !== dim.id) continue;
        p.playSound("random.explode", { volume: 0.6, pitch: 0.5 });
        p.sendMessage({ translate: "cl.met.caiu", with: [j.name, String(x), String(z)] });
      }
    } catch {
      // chunk descarregou
    }
  }, 44);
}

export function registrarExtras(): void {
  intervalo("extras", () => {
    for (const j of world.getPlayers()) {
      const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
      if (mao?.typeId === "cl:bussola_aviao") mostrarRumo(j);
    }
  }, 20);
  intervalo("extras", () => {
    if (Math.random() < METEORO.chancePorMinuto) cairMeteoro();
  }, 1200);
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === "cl:saco_dormir") dormir(source);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== "cl:meteorito" || player.getGameMode() === GameMode.Creative) return;
    for (const [item, min, max, chance] of SAQUE_METEORITO) {
      if (Math.random() >= chance) continue;
      block.dimension.spawnItem(new ItemStack(item, min + Math.floor(Math.random() * (max - min + 1))), block.center());
    }
  });
  registrarDetalhe("cl:meteorito", () => ({ translate: "cl.met.olhar" }));
}

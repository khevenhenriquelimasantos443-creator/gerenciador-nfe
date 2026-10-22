import { Block, EasingType, InputPermissionCategory, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { IDS, PROPS } from "../config.js";
import { darAoJogador } from "../util/inventario.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * Fase 10: a decolagem. Com os 4 sistemas consertados, o Painel da Nave ganha o botão "Decolar".
 * Todos os jogadores do mundo veem a mesma cena (câmera livre do jogo, sem precisar de nada no
 * pacote de recursos): contagem regressiva, a nave subindo num rastro de fogo e fumaça, tela preta
 * e os créditos. Depois a câmera volta, cada um ganha as recompensas e o mundo segue no "modo
 * infinito" (capítulo Final do Diário). Dá para rever a cena tocando no painel de novo.
 */
const CONTAGEM = 5; // segundos
const SUBIDA = 160; // ticks da nave subindo
const SLIDE = 80; // ticks por tela de créditos
const SLIDES = 12;

let emCena = false;
export const jaDecolou = (): boolean => world.getDynamicProperty(PROPS.final) !== undefined;
const mais = (a: Vector3, x: number, y: number, z: number): Vector3 => ({ x: a.x + x, y: a.y + y, z: a.z + z });

function travar(j: Player, travado: boolean): void {
  try {
    for (const c of [InputPermissionCategory.Movement, InputPermissionCategory.Camera]) j.inputPermissions.setPermissionCategory(c, !travado);
  } catch {
    // versão sem permissões de entrada: só a câmera muda
  }
}

function titulo(js: Player[], t: RawMessage, s?: RawMessage, ficar = 40): void {
  for (const j of js) if (j.isValid) j.onScreenDisplay.setTitle(t, { subtitle: s, fadeInDuration: 10, stayDuration: ficar, fadeOutDuration: 10 });
}

function rastro(b: Vector3, dim: Block["dimension"], h: number): void {
  try {
    dim.spawnParticle("minecraft:huge_explosion_emitter", mais(b, 0, h, 0));
    dim.spawnParticle("minecraft:large_explosion", mais(b, 0, h - 3, 0));
    for (let i = 0; i < 4; i++) dim.spawnParticle("minecraft:basic_flame_particle", mais(b, Math.random() * 2 - 1, h - 1 - i, Math.random() * 2 - 1));
    dim.spawnParticle("minecraft:campfire_tall_smoke_particle", mais(b, 0, Math.max(1, h - 6), 0));
  } catch {
    // chunk não carregado
  }
}

function terminar(js: Player[], primeira: boolean): void {
  emCena = false;
  for (const j of js) {
    if (!j.isValid) continue;
    j.camera.clear();
    j.camera.fade({ fadeTime: { fadeInTime: 0, holdTime: 0.5, fadeOutTime: 1.5 }, fadeColor: { red: 0, green: 0, blue: 0 } });
    travar(j, false);
    j.onScreenDisplay.setTitle({ translate: "cl.fim.infinito" }, { subtitle: { translate: "cl.fim.infinito_sub" }, fadeInDuration: 20, stayDuration: 100, fadeOutDuration: 20 });
    j.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: primeira ? "cl.fim.mensagem" : "cl.fim.de_novo" }] });
    if (primeira) {
      registrarAcao(j, "decolar");
      darAoJogador(j, IDS.sacolaLendaria, 1);
    }
  }
}

function creditos(js: Player[], primeira: boolean, n = 0): void {
  if (n >= SLIDES) return terminar(js, primeira);
  titulo(js, { translate: `cl.fim.c${n + 1}.t` }, { translate: `cl.fim.c${n + 1}.s` }, SLIDE - 20);
  system.runTimeout(() => creditos(js, primeira, n + 1), SLIDE);
}

export function decolar(painel: Block): void {
  if (emCena) return;
  emCena = true;
  const primeira = !jaDecolou();
  if (primeira) world.setDynamicProperty(PROPS.final, world.getDay());
  const dim = painel.dimension;
  const base = painel.center();
  const js = world.getPlayers().filter((j) => j.dimension.id === dim.id);
  for (const j of js) {
    travar(j, true);
    j.addEffect("resistance", (CONTAGEM * 20 + SUBIDA + SLIDES * SLIDE + 200), { amplifier: 255, showParticles: false });
    j.camera.setCamera("minecraft:free", { location: mais(base, 14, 5, 14), facingLocation: base, easeOptions: { easeTime: 1.5, easeType: EasingType.InOutSine } });
  }
  // Contagem regressiva com o motor ganhando força.
  for (let s = CONTAGEM; s >= 1; s--) {
    system.runTimeout(() => {
      titulo(js, { text: `§6${s}` }, { translate: "cl.fim.contagem" }, 14);
      dim.playSound("note.bass", base, { pitch: 0.5 + (CONTAGEM - s) * 0.15, volume: 2 });
      rastro(base, dim, 0);
      try {
        dim.runCommand(`camerashake add @a ${(0.1 * (CONTAGEM - s + 1)).toFixed(1)} 1.2 positional`);
      } catch {
        // sem o comando
      }
    }, (CONTAGEM - s) * 20);
  }
  // A subida: a câmera acompanha um rastro de fogo que sobe até sumir no céu.
  const t0 = CONTAGEM * 20;
  system.runTimeout(() => {
    titulo(js, { translate: "cl.fim.decolando" }, undefined, 40);
    dim.playSound("random.explode", base, { volume: 4, pitch: 0.6 });
    dim.playSound("firework.launch", base, { volume: 4, pitch: 0.5 });
    for (const j of js) if (j.isValid) j.camera.setCamera("minecraft:free", { location: mais(base, 20, 50, 20), facingLocation: mais(base, 0, 110, 0), easeOptions: { easeTime: SUBIDA / 20, easeType: EasingType.InQuad } });
  }, t0);
  for (let t = 0; t < SUBIDA; t += 4) system.runTimeout(() => rastro(base, dim, Math.round(((t / SUBIDA) ** 2) * 120)), t0 + t);
  // Tela preta e créditos com a câmera parada no alto, olhando o horizonte.
  system.runTimeout(() => {
    for (const j of js) {
      if (!j.isValid) continue;
      j.camera.fade({ fadeTime: { fadeInTime: 1, holdTime: 1.5, fadeOutTime: 1.5 }, fadeColor: { red: 0, green: 0, blue: 0 } });
    }
    system.runTimeout(() => {
      for (const j of js) if (j.isValid) j.camera.setCamera("minecraft:free", { location: mais(base, 0, 140, 0), rotation: { x: 10, y: 0 } });
      creditos(js, primeira);
    }, 25);
  }, t0 + SUBIDA);
}

export async function confirmarDecolagem(j: Player, painel: Block): Promise<void> {
  const r = await new ActionFormData()
    .title({ translate: "cl.fim.titulo" })
    .body({ translate: jaDecolou() ? "cl.fim.rever" : "cl.fim.confirmar" })
    .button({ translate: "cl.fim.sim" })
    .button({ translate: "cl.diario.voltar" })
    .show(j);
  if (r.canceled || r.selection !== 0 || !painel.isValid) return;
  decolar(painel);
}

export function registrarDecolagem(): void {
  // Se o mundo fechou no meio da cena, a câmera e os controles voltam ao entrar.
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn || emCena) return;
    player.camera.clear();
    travar(player, false);
  });
}

import { Player, system, world } from "@minecraft/server";
import { intervalo } from "../util/perfil.js";

/*
 * 1.59.0: música de fundo (faixas CC0 do OpenGameArt, ver CREDITOS.md), uma por momento do jogo:
 * - dia no mundo normal: "Exploration Theme"; noite: "I swear I saw it";
 * - Nether e o subsolo (abaixo de y 0): "Space Graveyard";
 * - Lua: "Observing the Star" e "Deep Space Array".
 * Toca uma faixa, faz uma pausa de 1 a 3 minutos e toca outra (como a música do jogo); trocar de momento (anoitecer,
 * descer à mina, ir à Lua) troca a faixa na hora, com fade. O volume é o de "Música" nas configurações do jogo.
 * /scriptevent cl:musica desliga ou liga para quem digitou.
 * Custo: uma conta por jogador a cada 5 s.
 */
type Faixa = { id: string; s: number };
const F: Readonly<Record<string, Faixa>> = {
  exploracao: { id: "cl.musica.exploracao", s: 134 },
  noite: { id: "cl.musica.noite", s: 207 },
  masmorra: { id: "cl.musica.masmorra", s: 313 },
  lua: { id: "cl.musica.lua", s: 134 },
  espaco: { id: "cl.musica.espaco", s: 104 },
};
const DESLIGADA = "cl:musica_off";
type Estado = { momento: string; fim: number; pausa: number };
const estados = new Map<string, Estado>();

function momento(j: Player): readonly Faixa[] {
  const dim = j.dimension.id;
  if (dim === "cl:lua") return [F.lua, F.espaco];
  if (dim === "minecraft:nether" || j.location.y < 0) return [F.masmorra];
  const t = world.getTimeOfDay();
  return t >= 13000 && t < 23000 ? [F.noite] : [F.exploracao];
}

function tocar(j: Player, f: Faixa, e: Estado): void {
  try {
    j.playMusic(f.id, { fade: 4, loop: false, volume: 1 });
  } catch {
    return;
  }
  e.fim = system.currentTick + f.s * 20;
  e.pausa = (60 + Math.floor(Math.random() * 120)) * 20;
}

export function registrarMusica(): void {
  intervalo("música", () => {
    const agora = system.currentTick;
    for (const j of world.getPlayers()) {
      if (j.getDynamicProperty(DESLIGADA) === true) continue;
      const faixas = momento(j);
      const nome = faixas.map((f) => f.id).join();
      let e = estados.get(j.id);
      if (!e) {
        e = { momento: "", fim: 0, pausa: 0 };
        estados.set(j.id, e);
      }
      const sorteada = faixas[Math.floor(Math.random() * faixas.length)];
      if (e.momento !== nome) {
        e.momento = nome;
        tocar(j, sorteada, e);
      } else if (agora >= e.fim + e.pausa) tocar(j, sorteada, e);
    }
  }, 100);
  world.afterEvents.playerLeave.subscribe(({ playerId }) => estados.delete(playerId));
  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity: j }) => {
    if (id !== "cl:musica" || !(j instanceof Player)) return;
    const desligar = j.getDynamicProperty(DESLIGADA) !== true;
    j.setDynamicProperty(DESLIGADA, desligar);
    estados.delete(j.id);
    if (desligar) j.stopMusic();
    j.sendMessage(desligar ? "§7Música do Pouso Forçado desligada." : "§7Música do Pouso Forçado ligada.");
  });
}

import { GameMode, Player, RawMessage, system, world } from "@minecraft/server";
import { SEDE } from "../config.js";
import { lerSede } from "./sede.js";
import { celsius, lerTemperatura } from "./temperatura.js";

/*
 * Painel fixo na barra de ação: água e temperatura do corpo, redesenhado a cada segundo
 * (o jogo apaga a barra de ação depois de uns 3 s, então ela precisa ser renovada).
 * Avisos curtos (máquinas, missões) entram numa linha acima do painel por alguns segundos,
 * em vez de apagar o painel: use aviso() em vez de onScreenDisplay.setActionBar().
 * Custo: 1 setActionBar por jogador por segundo.
 */
const avisos = new Map<string, { msg: RawMessage; ate: number }>();

/** Mostra uma mensagem curta acima do painel por `segundos`. */
export function aviso(jogador: Player, msg: RawMessage | string, segundos = 3): void {
  avisos.set(jogador.id, { msg: typeof msg === "string" ? { translate: msg } : msg, ate: system.currentTick + segundos * 20 });
  desenhar(jogador);
}

function barra(cheios: number, total: number, cor: string): string {
  return `${cor}${"|".repeat(cheios)}§8${"|".repeat(total - cheios)}`;
}

function corTemperatura(t: number): string {
  if (t <= -12) return "§9";
  if (t < -5) return "§b";
  if (t >= 12) return "§c";
  if (t > 5) return "§e";
  return "§a";
}

function painel(jogador: Player): RawMessage {
  const agua = lerSede(jogador);
  const temp = lerTemperatura(jogador);
  const corAgua = agua < SEDE.lentidaoAbaixoDe ? "§c" : "§b";
  const estado = temp >= 12 ? "cl.temp.quente" : temp <= -12 ? "cl.temp.frio" : undefined;
  const linha: RawMessage[] = [
    { translate: "cl.sede.rotulo" },
    { text: ` ${barra(Math.ceil(agua / 2), 10, corAgua)} §f${agua}   ` },
    { translate: "cl.temp.rotulo" },
    { text: ` ${corTemperatura(temp)}${celsius(temp).toFixed(1)}°C` },
  ];
  if (estado) linha.push({ text: " " }, { translate: estado });
  return { rawtext: linha };
}

function desenhar(jogador: Player): void {
  const a = avisos.get(jogador.id);
  const ativo = a && a.ate > system.currentTick;
  if (a && !ativo) avisos.delete(jogador.id);
  const sobrevivendo = ![GameMode.Creative, GameMode.Spectator].includes(jogador.getGameMode());
  if (!sobrevivendo) {
    if (ativo) jogador.onScreenDisplay.setActionBar(a.msg);
    return;
  }
  jogador.onScreenDisplay.setActionBar(ativo ? { rawtext: [a.msg, { text: "§r\n" }, painel(jogador)] } : painel(jogador));
}

export function registrarHud(): void {
  system.runInterval(() => {
    for (const jogador of world.getPlayers()) desenhar(jogador);
  }, 20);
}

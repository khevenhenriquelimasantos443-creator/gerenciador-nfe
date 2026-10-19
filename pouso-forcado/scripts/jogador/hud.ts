import { GameMode, Player, RawMessage, system, world } from "@minecraft/server";
import { AR, SEDE, TEMPERATURA } from "../config.js";
import { arDoJogador, lerAr, nivelCongelamento } from "./ambiente.js";
import { rotuloFome } from "./fome.js";
import { tempestadeRestante } from "../mundo/tempestade.js";
import { desidratacao, lerSede } from "./sede.js";
import { linhaOlhar } from "./olhar.js";
import { lerTemperatura } from "./temperatura.js";
import { intervalo } from "../util/perfil.js";

/*
 * Painel fixo na barra de ação: água e temperatura do corpo, redesenhado a cada segundo
 * (o jogo apaga a barra de ação depois de uns 3 s, então ela precisa ser renovada).
 * Avisos curtos (máquinas, missões) entram numa linha acima do painel por alguns segundos,
 * em vez de apagar o painel: use aviso() em vez de onScreenDisplay.setActionBar().
 * Também mostra o "o que estou olhando" (olhar.ts) numa linha entre o aviso e o painel.
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

function corCorpo(c: number): string {
  const [i1, i2] = TEMPERATURA.insolacao, [h1, h2] = TEMPERATURA.hipotermia;
  if (c <= h2) return "§9";
  if (c <= h1) return "§b";
  if (c >= i2) return "§c";
  if (c >= i1) return "§6";
  if (c >= TEMPERATURA.suor.aPartirDe) return "§e";
  return "§a";
}

/** Estado do corpo em uma palavra (insolação, hipotermia, congelamento, fome, ferimentos). */
function estados(jogador: Player, corpo: number): RawMessage[] {
  const e: RawMessage[] = [];
  const nivel = (limites: ReadonlyArray<number>, acima: boolean) => limites.filter((l) => (acima ? corpo >= l : corpo <= l)).length;
  const ins = nivel(TEMPERATURA.insolacao, true), hip = nivel(TEMPERATURA.hipotermia, false), cong = nivelCongelamento(jogador);
  if (ins) e.push({ translate: "cl.temp.insolacao_n", with: ["I".repeat(ins)] });
  if (hip) e.push({ translate: "cl.temp.hipotermia_n", with: ["I".repeat(hip)] });
  if (cong) e.push({ translate: "cl.temp.congelamento_n", with: ["I".repeat(cong)] });
  if (desidratacao(jogador) > 0) e.push({ translate: "cl.sede.desidratado" });
  const fome = rotuloFome(jogador);
  if (fome) e.push({ translate: fome });
  return e;
}

function painel(jogador: Player): RawMessage {
  const agua = lerSede(jogador);
  const corpo = lerTemperatura(jogador);
  const corAgua = agua < SEDE.fracaAbaixoDe ? "§c" : "§b";
  const linha: RawMessage[] = [
    { translate: "cl.sede.rotulo" },
    { text: ` ${barra(Math.ceil(agua / 10), 10, corAgua)} §f${Math.floor(agua)}   ` },
    { translate: "cl.temp.rotulo" },
    { text: ` ${corCorpo(corpo)}${corpo.toFixed(1).replace(".", ",")}°C` },
  ];
  const arAmbiente = arDoJogador.get(jogador.id);
  if (arAmbiente !== undefined) linha.push({ text: ` §7(${Math.round(arAmbiente)}°)` });
  const ar = lerAr(jogador);
  if (ar < 100) linha.push({ text: "   " }, { translate: "cl.ar.rotulo" }, { text: ` ${ar <= AR.lento ? "§c" : "§f"}${Math.floor(ar)}%` });
  const resta = tempestadeRestante();
  if (resta > 0) {
    const s = Math.ceil(resta / 20);
    linha.push({ text: "   " }, { translate: "cl.tempestade.rotulo" }, { text: ` §6${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` });
  }
  for (const e of estados(jogador, corpo)) linha.push({ text: " §c" }, e);
  return { rawtext: linha };
}

const ultimoOlhar = new Map<string, RawMessage | undefined>();

function desenhar(jogador: Player, olhar = ultimoOlhar.get(jogador.id)): void {
  const a = avisos.get(jogador.id);
  const ativo = a && a.ate > system.currentTick;
  if (a && !ativo) avisos.delete(jogador.id);
  const sobrevivendo = ![GameMode.Creative, GameMode.Spectator].includes(jogador.getGameMode());
  // Linhas de cima para baixo: aviso, o que estou olhando, painel de água e temperatura.
  const linhas: RawMessage[] = [];
  if (ativo) linhas.push(a.msg);
  if (olhar) linhas.push(olhar);
  if (sobrevivendo) linhas.push(painel(jogador));
  if (linhas.length === 0) return;
  jogador.onScreenDisplay.setActionBar({ rawtext: linhas.flatMap((l, k) => (k ? [{ text: "§r\n" }, l] : [l])) });
}

export function registrarHud(): void {
  intervalo("painel", () => {
    for (const jogador of world.getPlayers()) {
      const olhar = linhaOlhar(jogador);
      ultimoOlhar.set(jogador.id, olhar);
      desenhar(jogador, olhar);
    }
  }, 20);
}

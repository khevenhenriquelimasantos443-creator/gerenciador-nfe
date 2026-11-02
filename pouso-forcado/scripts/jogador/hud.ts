import { GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { AR, OLHAR, SEDE, TEMPERATURA } from "../config.js";
import { arDoJogador, lerAr, nivelCongelamento } from "./ambiente.js";
import { rotuloFome } from "./fome.js";
import { tempestadeRestante } from "../mundo/tempestade.js";
import { desidratacao, lerSede } from "./sede.js";
import { linhaOlhar } from "./olhar.js";
import { lerTemperatura } from "./temperatura.js";
import { intervalo, medir } from "../util/perfil.js";
import { LUA, painelLua } from "../galacticraft/oxigenio.js";

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
/**
 * Subtítulo em duas linhas (chave e chave_2): no celular o subtítulo não quebra sozinho e o fim saía da tela.
 * Os %s vão na primeira linha.
 */
export function duasLinhas(chave: string, com?: string[]): RawMessage {
  return { rawtext: [{ translate: chave, ...(com ? { with: com } : {}) }, { text: "\n" }, { translate: `${chave}_2` }] };
}

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
  if (jogador.dimension.id === LUA) return painelLua(jogador);
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
  // 1.17.0: ar, tempestade e estados do corpo numa segunda linha (numa só, no celular o fim saía da tela).
  const extra: RawMessage[] = [];
  const ar = lerAr(jogador);
  if (ar < 100) extra.push({ translate: "cl.ar.rotulo" }, { text: ` ${ar <= AR.lento ? "§c" : "§f"}${Math.floor(ar)}%   ` });
  const resta = tempestadeRestante();
  if (resta > 0) {
    const s = Math.ceil(resta / 20);
    extra.push({ translate: "cl.tempestade.rotulo" }, { text: ` §6${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}   ` });
  }
  for (const e of estados(jogador, corpo)) extra.push({ text: "§c" }, e, { text: " " });
  if (extra.length) linha.push({ text: "§r\n" }, ...extra);
  return { rawtext: linha };
}

const ultimoOlhar = new Map<string, RawMessage | undefined>();
// 1.16.4: o que foi mandado por último para a barra de cada jogador. Mandar a barra é o que mais pesa no celular
// (o jogo monta o texto na tela): igual ao último, só reenvia depois de 2 s (ela some sozinha em uns 3 s).
const ultimaBarra = new Map<string, { chave: string; tick: number }>();
const REENVIO = 40;

function desenhar(jogador: Player, olhar = ultimoOlhar.get(jogador.id)): void {
  const a = avisos.get(jogador.id);
  const ativo = a && a.ate > system.currentTick;
  if (a && !ativo) avisos.delete(jogador.id);
  const sobrevivendo = ![GameMode.Creative, GameMode.Spectator].includes(jogador.getGameMode());
  // Linhas de cima para baixo: aviso, o que estou olhando, painel de água e temperatura.
  const linhas: RawMessage[] = [];
  if (ativo) linhas.push(a.msg);
  if (olhar) linhas.push(olhar);
  if (sobrevivendo) linhas.push(medir("painel: dados", () => painel(jogador)));
  if (linhas.length === 0) return;
  const barra: RawMessage = { rawtext: linhas.flatMap((l, k) => (k ? [{ text: "§r\n" }, l] : [l])) };
  const chave = JSON.stringify(barra);
  const ultima = ultimaBarra.get(jogador.id);
  if (ultima && ultima.chave === chave && system.currentTick - ultima.tick < REENVIO) return;
  ultimaBarra.set(jogador.id, { chave, tick: system.currentTick });
  medir("painel: barra", () => jogador.onScreenDisplay.setActionBar(barra));
}

/** Teste no servidor: /scriptevent cl:teste_bench mede no log quanto custa cada parte do painel (média de 300). */
function bench(j: Player, muitas: boolean): void {
  const N = 300;
  if (muitas) {
    // Como uma base com bichos e itens no chão: 200 itens e 60 galinhas num raio de ~30 blocos.
    const l = j.location;
    for (let i = 0; i < 260; i++) {
      const p = { x: l.x + (Math.random() - 0.5) * 60, y: l.y + 1, z: l.z + (Math.random() - 0.5) * 60 };
      try {
        if (i < 200) j.dimension.spawnItem(new ItemStack("minecraft:stick", 1), p);
        else j.dimension.spawnEntity("minecraft:chicken", p);
      } catch {
        // fora da área carregada
      }
    }
  }
  const t = (nome: string, fn: () => unknown) => {
    const a = Date.now();
    for (let i = 0; i < N; i++) fn();
    console.warn(`[bench] ${nome}: ${(((Date.now() - a) * 1000) / N).toFixed(1)} us`);
  };
  t("raio entidade", () => j.getEntitiesFromViewDirection({ maxDistance: OLHAR.distanciaEntidade }));
  t("entidades perto", () => j.dimension.getEntities({ location: j.location, maxDistance: OLHAR.distanciaEntidade }));
  t("raio bloco", () => j.getBlockFromViewDirection({ maxDistance: 6 }));
  t("linhaOlhar", () => linhaOlhar(j));
  t("painel", () => painel(j));
  t("setActionBar", () => j.onScreenDisplay.setActionBar("x"));
  t("getGameMode", () => j.getGameMode());
  t("location", () => j.location);
  t("getBlock", () => j.dimension.getBlock(j.location));
  t("dynamic property", () => j.getDynamicProperty("cl:hidratacao"));
  t("inventario getItem", () => j.getComponent("minecraft:inventory")?.container?.getItem(0));
  t("world.getPlayers", () => world.getPlayers());
}

export function registrarHud(): void {
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity }) => {
    if (id === "cl:teste_bench" && sourceEntity instanceof Player) bench(sourceEntity, message === "entidades");
  });
  intervalo("painel", () => {
    for (const jogador of world.getPlayers()) {
      const olhar = medir("painel: olhar", () => linhaOlhar(jogador));
      ultimoOlhar.set(jogador.id, olhar);
      desenhar(jogador, olhar);
    }
  }, 20);
}

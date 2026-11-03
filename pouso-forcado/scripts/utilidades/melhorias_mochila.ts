import { Container, ItemStack, Player, system, world } from "@minecraft/server";
import { THERMAL } from "../config.js";
import { DADOS_F37, DADOS_F44 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";
import { ehMochila, espacosDe, NIVEIS } from "./mochila_niveis.js";

/*
 * Melhorias do Sophisticated Backpacks (1.14.0; 1.25.0 com o SB 3.26) para a Mochila: a melhoria vai DENTRO da mochila
 * (aberta no chão) e vale enquanto a mochila está no inventário. Cada nível tem os espaços de melhoria do SB (couro 1,
 * cobre 1, ferro 2, ouro 3, diamante 5, netherita 7): valem as primeiras melhorias diferentes até esse número.
 * - Coleta: os itens do inventário (fora da barra) que já existem na mochila vão para ela.
 * - Ímã (raio 3) e Ímã Avançado (raio 5): puxam os itens soltos e fazem a coleta.
 * - Alimentação: com fome (faltando ao menos o que a comida dá), come da mochila (nada que faça mal). A avançada escolhe
 *   a comida que mais rende sem sobrar e, com menos de metade da vida, come mesmo que sobre.
 * - Compactação: junta 2×2 na mochila (quartzo, argila...); a avançada também 3×3 (pepitas, lingotes...).
 * - Fornalha: funde o que está na mochila (minério, minério bruto, pó, carne crua, batata) com o carvão (ou outro
 *   combustível) que está nela, no tempo de uma fornalha (10 s por item). A Automática também puxa para a mochila o que
 *   dá para fundir do inventário (fora da barra).
 * - Reposição: completa as pilhas da barra com o mesmo item que está na mochila.
 * - Depósito e Reabastecer: agache e toque num baú com a mochila na mão: guarda tudo no baú, ou completa da mochila
 *   o que ela já tem com o que está no baú.
 */
const CONTEUDO = "cl:conteudo";
const COMB = "cl:sb_comb"; // fundições que o combustível já queimado ainda dá
const MELHORIAS = new Set([
  "cl:melhoria_coleta", "cl:melhoria_ima", "cl:melhoria_ima_avancada", "cl:melhoria_alimentacao", "cl:melhoria_alimentacao_avancada",
  "cl:melhoria_compactacao", "cl:melhoria_compactacao_avancada", "cl:melhoria_deposito", "cl:melhoria_reabastecer",
  "cl:melhoria_fornalha", "cl:melhoria_fundicao_auto", "cl:melhoria_recarga",
]);
const C2: Readonly<Record<string, string>> = DADOS_F37.compactar2;
const C3: Readonly<Record<string, string>> = DADOS_F37.compactar3;
const RAIO = DADOS_F37.raioIma;
const D44 = DADOS_F44 as unknown as { raioImaAvancado: number; ticksPorItem: number; combustivel: Record<string, number> };
const FAZ_MAL = new Set(["minecraft:rotten_flesh", "minecraft:spider_eye", "minecraft:poisonous_potato", "minecraft:pufferfish", "minecraft:chicken", "minecraft:suspicious_stew", "minecraft:chorus_fruit"]);
// O que a Fornalha da mochila funde: o que a Fornalha de Redstone funde, menos o que é melhor guardar como está.
const FUNDE: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(THERMAL.fornalha as Record<string, string>).filter(([de]) => /raw_|_ore$|^cl:po_|beef|porkchop|chicken|mutton|rabbit|cod|salmon|potato/.test(de)),
);
const usouAgora = new Map<string, number>();
/** A mochila acabou de ser usada num baú (para não ir para o chão no mesmo toque). */
export const mochilaUsadaEmBau = (j: Player) => (usouAgora.get(j.id) ?? -9) >= system.currentTick - 2;

type Slots = (ItemSalvo | null)[];
function ler(i: ItemStack): Slots {
  const n = espacosDe(i.typeId);
  try {
    const v = i.getDynamicProperty(CONTEUDO);
    const s = typeof v === "string" ? (JSON.parse(v) as Slots) : [];
    while (s.length < n) s.push(null);
    return s;
  } catch {
    return Array(n).fill(null);
  }
}
function gravar(inv: Container, slot: number, i: ItemStack, s: Slots): boolean {
  try {
    i.setDynamicProperty(CONTEUDO, JSON.stringify(s));
    i.setLore([`§7${s.filter(Boolean).length}/${espacosDe(i.typeId)}`]);
    inv.setItem(slot, i);
    return true;
  } catch {
    return false;
  }
}
/** As melhorias que valem: as primeiras diferentes, até os espaços de melhoria do nível. */
function melhoriasDe(i: ItemStack, s: Slots): string[] {
  const max = NIVEIS[i.typeId]?.melhorias ?? 1;
  const r: string[] = [];
  for (const x of s) if (x && MELHORIAS.has(x.t) && !r.includes(x.t)) {
    r.push(x.t);
    if (r.length >= max) break;
  }
  return r;
}
const simples = (x: ItemSalvo | null) => !!x && !x.nome && !x.lore && !x.dp && !x.dano && !x.enc;
const maxDe = (id: string) => {
  try {
    return new ItemStack(id, 1).maxAmount;
  } catch {
    return 64;
  }
};

/** Põe n itens `id` na mochila (completa pilhas iguais, depois espaços vazios). Devolve quantos couberam. */
function guardarNa(s: Slots, id: string, n: number): number {
  const max = maxDe(id);
  let resto = n;
  for (const x of s) if (resto && x && x.t === id && simples(x) && x.n < max) {
    const k = Math.min(max - x.n, resto);
    x.n += k;
    resto -= k;
  }
  for (let k = 0; k < s.length && resto; k++) if (!s[k]) {
    const q = Math.min(max, resto);
    s[k] = { t: id, n: q };
    resto -= q;
  }
  return n - resto;
}
function tirarDa(s: Slots, id: string, n: number): number {
  let falta = n;
  for (let k = s.length - 1; k >= 0 && falta; k--) {
    const x = s[k];
    if (!x || x.t !== id || !simples(x)) continue;
    const q = Math.min(x.n, falta);
    x.n -= q;
    falta -= q;
    if (x.n <= 0) s[k] = null;
  }
  return n - falta;
}
const temNa = (s: Slots, id: string) => s.some((x) => x && x.t === id && simples(x));

/** Leva do inventário (fora da barra) para a mochila os itens que passam no filtro. */
function puxar(inv: Container, s: Slots, passa: (id: string) => boolean): boolean {
  let mudou = false;
  for (let k = 9; k < inv.size; k++) {
    const it = inv.getItem(k);
    if (!it || !passa(it.typeId) || ehMochila(it.typeId) || salvarItem(it)?.dp || it.nameTag) continue;
    const foi = guardarNa(s, it.typeId, it.amount);
    if (!foi) continue;
    mudou = true;
    if (foi >= it.amount) inv.setItem(k, undefined);
    else {
      it.amount -= foi;
      inv.setItem(k, it);
    }
  }
  return mudou;
}
function coletar(inv: Container, s: Slots): boolean {
  const tem = new Set(s.filter((x) => x && simples(x) && !MELHORIAS.has(x.t)).map((x) => x!.t));
  return puxar(inv, s, (id) => tem.has(id));
}
function ima(j: Player, raio: number): void {
  const itens = j.dimension.getEntities({ type: "minecraft:item", location: j.location, maxDistance: raio });
  if (!itens.length) return;
  for (const e of itens) e.teleport(j.location);
  registrarAcao(j, "ima_mochila");
}
function comer(j: Player, s: Slots, avancada: boolean): boolean {
  const fome = j.getComponent("minecraft:player.hunger");
  const sat = j.getComponent("minecraft:player.saturation");
  if (!fome) return false;
  const falta = 20 - fome.currentValue;
  if (falta <= 0) return false;
  const vida = j.getComponent("minecraft:health");
  const urgente = avancada && !!vida && vida.currentValue < vida.effectiveMax / 2;
  let melhor: { id: string; nut: number; satm: number } | undefined;
  for (const x of s) {
    if (!x || FAZ_MAL.has(x.t) || !simples(x)) continue;
    const f = new ItemStack(x.t, 1).getComponent("minecraft:food");
    if (!f || (f.nutrition > falta && !urgente)) continue;
    if (!avancada) {
      melhor = { id: x.t, nut: f.nutrition, satm: f.saturationModifier };
      break;
    }
    if (!melhor || f.nutrition > melhor.nut) melhor = { id: x.t, nut: f.nutrition, satm: f.saturationModifier };
  }
  if (!melhor) return false;
  tirarDa(s, melhor.id, 1);
  fome.setCurrentValue(Math.min(20, fome.currentValue + melhor.nut));
  if (sat) sat.setCurrentValue(Math.min(fome.currentValue, sat.currentValue + melhor.nut * melhor.satm * 2));
  j.playSound("random.burp", { volume: 0.6 });
  aviso(j, { translate: "cl.sb.comeu", with: { rawtext: [{ translate: new ItemStack(melhor.id).localizationKey }] } }, 2);
  registrarAcao(j, "comer_mochila");
  return true;
}
function compactar(s: Slots, avancada: boolean): boolean {
  let mudou = false;
  const contas = new Map<string, number>();
  for (const x of s) if (x && simples(x)) contas.set(x.t, (contas.get(x.t) ?? 0) + x.n);
  for (const [id, n] of contas) {
    const [para, por] = avancada && C3[id] ? [C3[id], 9] : C2[id] ? [C2[id], 4] : [undefined, 0];
    if (!para || n < por) continue;
    const vezes = Math.floor(n / por);
    tirarDa(s, id, vezes * por);
    const coube = guardarNa(s, para, vezes);
    if (coube < vezes) guardarNa(s, id, (vezes - coube) * por); // sem espaço: devolve
    mudou = mudou || coube > 0;
  }
  return mudou;
}
// Progresso da fundição de cada mochila (em ticks; fica na memória, o combustível fica no item).
const progresso = new Map<string, number>();
function fundir(j: Player, i: ItemStack, s: Slots, chave: string): boolean {
  const de = s.find((x) => x && simples(x) && FUNDE[x.t])?.t;
  if (!de) {
    progresso.delete(chave);
    return false;
  }
  const p = (progresso.get(chave) ?? 0) + 20;
  if (p < D44.ticksPorItem) {
    progresso.set(chave, p);
    return false;
  }
  let comb = (i.getDynamicProperty(COMB) as number | undefined) ?? 0;
  if (comb <= 0) {
    const c = Object.keys(D44.combustivel).find((id) => temNa(s, id));
    if (!c) return false; // sem combustível: espera com o progresso cheio
    tirarDa(s, c, 1);
    comb = D44.combustivel[c];
  }
  const para = FUNDE[de];
  tirarDa(s, de, 1);
  if (!guardarNa(s, para, 1)) {
    guardarNa(s, de, 1); // sem espaço para o resultado: devolve
    return false;
  }
  progresso.set(chave, 0);
  i.setDynamicProperty(COMB, comb - 1);
  registrarAcao(j, "fundir_mochila");
  return true;
}
/** Reposição: completa as pilhas da barra com o que está na mochila. */
function repor(j: Player, inv: Container, s: Slots): boolean {
  let mudou = false;
  for (let k = 0; k < 9; k++) {
    const it = inv.getItem(k);
    if (!it || it.maxAmount <= 1 || it.amount >= it.maxAmount || it.nameTag || salvarItem(it)?.dp || !temNa(s, it.typeId)) continue;
    const veio = tirarDa(s, it.typeId, it.maxAmount - it.amount);
    if (!veio) continue;
    it.amount += veio;
    inv.setItem(k, it);
    mudou = true;
  }
  if (mudou) registrarAcao(j, "recarga_mochila");
  return mudou;
}

// 1.16.4: em que espaços do inventário cada jogador leva mochila. Refeito quando uma mochila entra, sai ou muda de
// lugar (e a cada 3 s, por garantia); quem não leva mochila não tem o inventário inteiro lido a cada segundo.
const espacos = new Map<string, number[]>();
function acharMochilas(inv: Container): number[] {
  const r: number[] = [];
  for (let k = 0; k < inv.size; k++) if (ehMochila(inv.getItem(k)?.typeId)) r.push(k);
  return r;
}

function tick(): void {
  const refazer = system.currentTick % 60 < 20;
  for (const j of world.getPlayers()) {
    let slots = espacos.get(j.id);
    if (slots?.length === 0 && !refazer) continue;
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) continue;
    if (!slots || refazer) espacos.set(j.id, (slots = acharMochilas(inv)));
    for (const k of slots) {
      const i = inv.getItem(k);
      if (!i || !ehMochila(i.typeId)) {
        espacos.delete(j.id);
        continue;
      }
      const s = ler(i);
      const ms = melhoriasDe(i, s);
      if (!ms.length) continue;
      let mudou = false;
      const tem = (m: string) => ms.includes(m);
      if (tem("cl:melhoria_ima_avancada")) ima(j, D44.raioImaAvancado);
      else if (tem("cl:melhoria_ima")) ima(j, RAIO);
      if (tem("cl:melhoria_coleta") || tem("cl:melhoria_ima") || tem("cl:melhoria_ima_avancada")) mudou = coletar(inv, s) || mudou;
      if (tem("cl:melhoria_fundicao_auto")) mudou = puxar(inv, s, (id) => !!FUNDE[id]) || mudou;
      if (tem("cl:melhoria_fornalha") || tem("cl:melhoria_fundicao_auto")) mudou = fundir(j, i, s, `${j.id}:${k}`) || mudou;
      if (tem("cl:melhoria_alimentacao_avancada")) mudou = comer(j, s, true) || mudou;
      else if (tem("cl:melhoria_alimentacao")) mudou = comer(j, s, false) || mudou;
      if (tem("cl:melhoria_compactacao_avancada")) mudou = compactar(s, true) || mudou;
      else if (tem("cl:melhoria_compactacao")) mudou = compactar(s, false) || mudou;
      if (tem("cl:melhoria_recarga")) mudou = repor(j, inv, s) || mudou;
      if (mudou) gravar(inv, k, i, s);
    }
  }
}

function noBau(j: Player, slot: number, bau: Container): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(slot);
  if (!inv || !i || !ehMochila(i.typeId)) return;
  const s = ler(i);
  const ms = melhoriasDe(i, s);
  let n = 0;
  if (ms.includes("cl:melhoria_deposito")) {
    for (let k = 0; k < s.length; k++) {
      const x = s[k];
      if (!x || MELHORIAS.has(x.t)) continue;
      const it = carregarItem(x);
      if (!it) continue;
      const sobra = bau.addItem(it);
      const foi = x.n - (sobra?.amount ?? 0);
      n += foi;
      if (sobra) x.n = sobra.amount;
      else s[k] = null;
    }
    aviso(j, { translate: "cl.sb.depositou", with: [String(n)] }, 3);
    registrarAcao(j, "deposito_mochila");
  } else {
    const tem = new Set(s.filter((x) => x && simples(x) && !MELHORIAS.has(x.t)).map((x) => x!.t));
    for (let k = 0; k < bau.size; k++) {
      const it = bau.getItem(k);
      if (!it || !tem.has(it.typeId)) continue;
      const foi = guardarNa(s, it.typeId, it.amount);
      n += foi;
      if (foi >= it.amount) bau.setItem(k, undefined);
      else if (foi) {
        it.amount -= foi;
        bau.setItem(k, it);
      }
    }
    aviso(j, { translate: "cl.sb.reabasteceu", with: [String(n)] }, 3);
  }
  gravar(inv, slot, i, s);
  j.playSound("armor.equip_leather");
}

export function registrarMelhoriasMochila(): void {
  intervalo("mochila", tick, 20);
  world.afterEvents.playerInventoryItemChange.subscribe(({ player, itemStack, beforeItemStack }) => {
    if (ehMochila(itemStack?.typeId) || ehMochila(beforeItemStack?.typeId)) espacos.delete(player.id);
  });
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    espacos.delete(playerId);
    for (const k of progresso.keys()) if (k.startsWith(`${playerId}:`)) progresso.delete(k);
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player: j, block: b, itemStack: item } = ev;
    if (!item || !ehMochila(item.typeId) || !j.isSneaking) return;
    const ms = melhoriasDe(item, ler(item));
    if (!ms.includes("cl:melhoria_deposito") && !ms.includes("cl:melhoria_reabastecer")) return;
    let bau: Container | undefined;
    try {
      bau = b.getComponent("minecraft:inventory")?.container;
    } catch {
      return;
    }
    if (!bau || !toqueNovo(ev)) return;
    ev.cancel = true;
    usouAgora.set(j.id, system.currentTick);
    const slot = j.selectedSlotIndex;
    system.run(() => {
      const c = b.getComponent("minecraft:inventory")?.container;
      if (c) noBau(j, slot, c);
    });
  });
  // Mostra as melhorias que valem ao segurar a mochila.
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player: j, itemStack: i }) => {
    if (!i || !ehMochila(i.typeId)) return;
    const ms = melhoriasDe(i, ler(i));
    if (!ms.length) return;
    const rawtext: { translate?: string; text?: string }[] = [];
    ms.forEach((m, k) => {
      if (k) rawtext.push({ text: ", " });
      rawtext.push({ translate: new ItemStack(m).localizationKey });
    });
    j.onScreenDisplay.setActionBar({ translate: "cl.sb.ativas", with: { rawtext: [{ rawtext }] } });
  });
  // Teste no servidor: scriptevent cl:teste_mochila <melhoria>[,<melhoria>...] [tipo] dá uma mochila com as melhorias e
  // alguns itens no espaço 8.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mochila" || !(j instanceof Player)) return;
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) return;
    const [ms, tipo] = message.trim().split(/\s+/);
    const i = new ItemStack(tipo && ehMochila(tipo) ? tipo : "cl:mochila", 1);
    const s: Slots = Array(espacosDe(i.typeId)).fill(null);
    const lista = (ms ?? "").split(",").filter(Boolean);
    lista.forEach((m, k) => (s[k] = { t: `cl:melhoria_${m}`, n: 1 }));
    const b = lista.length;
    s[b] = { t: "minecraft:iron_ingot", n: 9 };
    s[b + 1] = { t: "minecraft:bread", n: 4 };
    s[b + 2] = { t: "minecraft:cobblestone", n: 5 };
    s[b + 3] = { t: "minecraft:raw_iron", n: 2 };
    s[b + 4] = { t: "minecraft:coal", n: 1 };
    gravar(inv, 8, i, s);
  });
}

import { Container, ItemStack, Player, system, world } from "@minecraft/server";
import { DADOS_F37 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";

/*
 * Melhorias do Sophisticated Backpacks (1.14.0) para a Mochila: a melhoria vai DENTRO da mochila (aberta no chão) e
 * vale enquanto a mochila está no inventário. A mochila de couro do SB tem 1 espaço de melhoria: vale a primeira.
 * - Coleta: os itens do inventário (fora da barra) que já existem na mochila vão para ela.
 * - Ímã: puxa os itens soltos num raio de 3 blocos e faz a coleta.
 * - Alimentação: com fome (faltando ao menos o que a comida dá), come da mochila (nada que faça mal).
 * - Compactação: junta 2×2 na mochila (pepitas não; quartzo, argila...); a avançada também 3×3 (pepitas, lingotes...).
 * - Depósito e Reabastecer: agache e toque num baú com a mochila na mão: guarda tudo no baú, ou completa da mochila
 *   o que ela já tem com o que está no baú.
 */
const MOCHILA = "cl:mochila";
const CONTEUDO = "cl:conteudo";
const ESPACOS = 27;
const MELHORIAS = new Set(["cl:melhoria_coleta", "cl:melhoria_ima", "cl:melhoria_alimentacao", "cl:melhoria_compactacao", "cl:melhoria_compactacao_avancada", "cl:melhoria_deposito", "cl:melhoria_reabastecer"]);
const C2: Readonly<Record<string, string>> = DADOS_F37.compactar2;
const C3: Readonly<Record<string, string>> = DADOS_F37.compactar3;
const RAIO = DADOS_F37.raioIma;
const FAZ_MAL = new Set(["minecraft:rotten_flesh", "minecraft:spider_eye", "minecraft:poisonous_potato", "minecraft:pufferfish", "minecraft:chicken", "minecraft:suspicious_stew", "minecraft:chorus_fruit"]);
const usouAgora = new Map<string, number>();
/** A mochila acabou de ser usada num baú (para não ir para o chão no mesmo toque). */
export const mochilaUsadaEmBau = (j: Player) => (usouAgora.get(j.id) ?? -9) >= system.currentTick - 2;

type Slots = (ItemSalvo | null)[];
function ler(i: ItemStack): Slots {
  try {
    const v = i.getDynamicProperty(CONTEUDO);
    const s = typeof v === "string" ? (JSON.parse(v) as Slots) : [];
    while (s.length < ESPACOS) s.push(null);
    return s;
  } catch {
    return Array(ESPACOS).fill(null);
  }
}
function gravar(inv: Container, slot: number, i: ItemStack, s: Slots): boolean {
  try {
    i.setDynamicProperty(CONTEUDO, JSON.stringify(s));
    i.setLore([`§7${s.filter(Boolean).length}/${ESPACOS}`]);
    inv.setItem(slot, i);
    return true;
  } catch {
    return false;
  }
}
const melhoriaDe = (s: Slots) => s.find((x) => x && MELHORIAS.has(x.t))?.t;
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

function coletar(j: Player, inv: Container, s: Slots): boolean {
  const tem = new Set(s.filter((x) => x && simples(x) && !MELHORIAS.has(x.t)).map((x) => x!.t));
  let mudou = false;
  for (let k = 9; k < inv.size; k++) {
    const it = inv.getItem(k);
    if (!it || !tem.has(it.typeId) || salvarItem(it)?.dp || it.nameTag) continue;
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
function ima(j: Player): void {
  const itens = j.dimension.getEntities({ type: "minecraft:item", location: j.location, maxDistance: RAIO });
  if (!itens.length) return;
  for (const e of itens) e.teleport(j.location);
  registrarAcao(j, "ima_mochila");
}
function comer(j: Player, s: Slots): boolean {
  const fome = j.getComponent("minecraft:player.hunger");
  const sat = j.getComponent("minecraft:player.saturation");
  if (!fome) return false;
  const falta = 20 - fome.currentValue;
  if (falta <= 0) return false;
  for (const x of s) {
    if (!x || FAZ_MAL.has(x.t) || !simples(x)) continue;
    const f = new ItemStack(x.t, 1).getComponent("minecraft:food");
    if (!f || f.nutrition > falta) continue;
    tirarDa(s, x.t, 1);
    fome.setCurrentValue(Math.min(20, fome.currentValue + f.nutrition));
    if (sat) sat.setCurrentValue(Math.min(fome.currentValue, sat.currentValue + f.nutrition * f.saturationModifier * 2));
    j.playSound("random.burp", { volume: 0.6 });
    aviso(j, { translate: "cl.sb.comeu", with: { rawtext: [{ translate: new ItemStack(x.t).localizationKey }] } }, 2);
    registrarAcao(j, "comer_mochila");
    return true;
  }
  return false;
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

// 1.16.4: em que espaços do inventário cada jogador leva mochila. Refeito quando uma mochila entra, sai ou muda de
// lugar (e a cada 3 s, por garantia); quem não leva mochila não tem o inventário inteiro lido a cada segundo.
const espacos = new Map<string, number[]>();
function acharMochilas(inv: Container): number[] {
  const r: number[] = [];
  for (let k = 0; k < inv.size; k++) if (inv.getItem(k)?.typeId === MOCHILA) r.push(k);
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
      if (i?.typeId !== MOCHILA) {
        espacos.delete(j.id);
        continue;
      }
      const s = ler(i);
      const m = melhoriaDe(s);
      if (!m) continue;
      let mudou = false;
      if (m === "cl:melhoria_ima") ima(j);
      if (m === "cl:melhoria_coleta" || m === "cl:melhoria_ima") mudou = coletar(j, inv, s);
      else if (m === "cl:melhoria_alimentacao") mudou = comer(j, s);
      else if (m === "cl:melhoria_compactacao" || m === "cl:melhoria_compactacao_avancada") mudou = compactar(s, m === "cl:melhoria_compactacao_avancada");
      if (mudou) gravar(inv, k, i, s);
    }
  }
}

function noBau(j: Player, slot: number, bau: Container): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(slot);
  if (!inv || i?.typeId !== MOCHILA) return;
  const s = ler(i);
  const m = melhoriaDe(s);
  let n = 0;
  if (m === "cl:melhoria_deposito") {
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
    if (itemStack?.typeId === MOCHILA || beforeItemStack?.typeId === MOCHILA) espacos.delete(player.id);
  });
  world.afterEvents.playerLeave.subscribe(({ playerId }) => espacos.delete(playerId));
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player: j, block: b, itemStack: item } = ev;
    if (item?.typeId !== MOCHILA || !j.isSneaking) return;
    const m = melhoriaDe(ler(item));
    if (m !== "cl:melhoria_deposito" && m !== "cl:melhoria_reabastecer") return;
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
  // Mostra a melhoria ativa ao segurar a mochila.
  world.afterEvents.playerHotbarSelectedSlotChange.subscribe(({ player: j, itemStack: i }) => {
    if (i?.typeId !== MOCHILA) return;
    const m = melhoriaDe(ler(i));
    if (m) j.onScreenDisplay.setActionBar({ translate: "cl.sb.ativa", with: { rawtext: [{ translate: new ItemStack(m).localizationKey }] } });
  });
  // Teste no servidor: scriptevent cl:teste_mochila <melhoria> dá uma mochila com a melhoria e alguns itens.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mochila" || !(j instanceof Player)) return;
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) return;
    const s: Slots = Array(ESPACOS).fill(null);
    s[0] = { t: `cl:melhoria_${message.trim()}`, n: 1 };
    s[1] = { t: "minecraft:iron_ingot", n: 9 };
    s[2] = { t: "minecraft:bread", n: 4 };
    s[3] = { t: "minecraft:cobblestone", n: 5 };
    const i = new ItemStack(MOCHILA, 1);
    gravar(inv, 8, i, s);
  });
}

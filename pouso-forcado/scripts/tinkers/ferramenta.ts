import { Entity, EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { TINKERS } from "../config.js";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { intervalo } from "../util/perfil.js";

/*
 * Ferramentas montadas do Tinkers' Construct, com as regras do Iguana Tweaks (Fases 15 e 16).
 * O tipo do item é "ferramenta × material da cabeça" (velocidade e nível vêm da cabeça, como no TC);
 * o resto fica em propriedades do próprio item:
 * - tc:dur / tc:max: durabilidade "virtual" (a barra do jogo só mostra a proporção). Em 0 a ferramenta
 *   não some: fica quebrada (não minera) até ser consertada na Estação de Ferramentas;
 * - tc:cabo, tc:lig: materiais do cabo e da ligação/guarda (o cabo multiplica a durabilidade);
 * - tc:xp, tc:nivel: XP da ferramenta (1 por bloco ou golpe); ao subir de nível ganha +1 espaço nos
 *   níveis TINKERS.niveisComEspaco;
 * - tc:esp, tc:mods: espaços livres e modificadores (Fase 16).
 * Nível de mineração (Iguana): minério que pede nível maior que o da cabeça não quebra.
 * Modificadores (1.2.0): Sorte (lápis) dá drop a mais de minério, Repulsão (pistão) empurra, Ruína dos
 * Artrópodes (olho fermentado) fere mais as aranhas, Obsidiana às vezes não gasta durabilidade;
 * 1.3.0: Afiado (quartzo) dá mais dano e Fogo (pó de blaze) incendeia o alvo.
 * Ferramenta montada caída no chão não some: a cada TINKERS.renascerTicks o item renasce no lugar.
 * Custo: só eventos (quebrar bloco, bater) e um laço de 1 s para o modificador Pressa.
 */
export type Mat = keyof typeof DADOS_F15.materiais;
export type Tipo = keyof typeof DADOS_F15.ferramentas;
export type Mods = Record<string, number>;
const MAT = DADOS_F15.materiais as Readonly<Record<string, (typeof DADOS_F15.materiais)[Mat]>>;
export const TIPOS = Object.keys(DADOS_F15.ferramentas) as Tipo[];

/** "cl:picareta_silex" -> { tipo, mat } (ou undefined se não é ferramenta do Tinkers). */
export function ferramentaDe(id: string | undefined): { tipo: Tipo; mat: Mat } | undefined {
  if (!id?.startsWith("cl:")) return undefined;
  const nome = id.slice(3);
  for (const tipo of TIPOS) {
    if (!nome.startsWith(`${tipo}_`)) continue;
    const mat = nome.slice(tipo.length + 1);
    if (MAT[mat]) return { tipo, mat: mat as Mat };
  }
  return undefined;
}

export const nivelMat = (mat: string): number => MAT[mat]?.nivel ?? 0;
const num = (i: ItemStack, k: string, padrao = 0) => (i.getDynamicProperty(k) as number | undefined) ?? padrao;
const txt = (i: ItemStack, k: string) => i.getDynamicProperty(k) as string | undefined;
export const xpPara = (nivel: number) => Math.round(TINKERS.xpBase * TINKERS.xpFator ** (nivel - 1));
export function modsDe(i: ItemStack): Mods {
  try {
    return JSON.parse(txt(i, "tc:mods") ?? "{}") as Mods;
  } catch {
    return {};
  }
}

function durabilidadeMax(tipo: Tipo, cabeca: Mat, cabo: Mat, lig: Mat | undefined, mods: Mods): number {
  let base = MAT[cabeca].dur;
  if (tipo === "picareta" && lig) base = (base + MAT[lig].dur) / 2;
  let max = base * MAT[cabo].cabo * TINKERS.iguanaDurabilidade;
  max += (mods.reforco ?? 0) * TINKERS.modificadores.reforco.durabilidade;
  max *= 1 + (mods.esmeralda ?? 0) * TINKERS.modificadores.esmeralda.fator;
  return Math.max(1, Math.round(max));
}

/** Reescreve o texto do item e a barra de durabilidade do jogo a partir das propriedades. */
export function atualizar(i: ItemStack): void {
  const f = ferramentaDe(i.typeId);
  if (!f) return;
  const dur = num(i, "tc:dur"), max = num(i, "tc:max", 1), nivel = num(i, "tc:nivel", 1);
  const linhas: RawMessage[] = [
    { translate: "cl.tc.cabeca", with: { rawtext: [{ translate: `cl.tc.mat.${f.mat}` }] } },
    { translate: "cl.tc.cabo", with: { rawtext: [{ translate: `cl.tc.mat.${txt(i, "tc:cabo") ?? "madeira"}` }] } },
  ];
  const lig = txt(i, "tc:lig");
  if (lig) linhas.push({ translate: "cl.tc.ligacao", with: { rawtext: [{ translate: `cl.tc.mat.${lig}` }] } });
  linhas.push(dur > 0 ? { translate: "cl.tc.durabilidade", with: [String(dur), String(max)] } : { translate: "cl.tc.quebrada" });
  linhas.push({
    translate: "cl.tc.nivel_xp",
    with: { rawtext: [{ translate: `cl.tc.nivel.${nivel}` }, { text: String(num(i, "tc:xp")) }, { text: nivel >= TINKERS.nivelMax ? "-" : String(xpPara(nivel)) }] },
  });
  if (f.tipo !== "espada_larga") linhas.push({ translate: "cl.tc.mineracao", with: [String(nivelMat(f.mat))] });
  for (const [m, n] of Object.entries(modsDe(i))) linhas.push({ translate: "cl.tc.modificador", with: { rawtext: [{ translate: `cl.tc.mod.${m}` }, { text: "I".repeat(n) }] } });
  linhas.push({ translate: "cl.tc.espacos", with: [String(num(i, "tc:esp"))] });
  i.setLore(linhas);
  const barra = i.getComponent("minecraft:durability");
  if (barra) barra.damage = Math.min(barra.maxDurability - 1, Math.round((1 - dur / max) * (barra.maxDurability - 1)));
}

/** Ferramenta nova, inteira, nível 1. */
export function criarFerramenta(tipo: Tipo, cabeca: Mat, cabo: Mat, lig?: Mat): ItemStack {
  const i = new ItemStack(`cl:${tipo}_${cabeca}`, 1);
  const max = durabilidadeMax(tipo, cabeca, cabo, lig, {});
  i.setDynamicProperty("tc:cabo", cabo);
  if (lig) i.setDynamicProperty("tc:lig", lig);
  i.setDynamicProperty("tc:max", max);
  i.setDynamicProperty("tc:dur", max);
  i.setDynamicProperty("tc:nivel", 1);
  i.setDynamicProperty("tc:xp", 0);
  i.setDynamicProperty("tc:esp", TINKERS.espacosIniciais);
  atualizar(i);
  return i;
}

/** Ferramenta feita na bancada/criativo, sem as propriedades: completa com cabo de madeira. */
function garantir(i: ItemStack): void {
  if (i.getDynamicProperty("tc:max") !== undefined) return;
  const f = ferramentaDe(i.typeId)!;
  const max = durabilidadeMax(f.tipo, f.mat, "madeira", f.tipo === "picareta" ? "madeira" : undefined, {});
  i.setDynamicProperty("tc:cabo", "madeira");
  if (f.tipo === "picareta") i.setDynamicProperty("tc:lig", "madeira");
  i.setDynamicProperty("tc:max", max);
  i.setDynamicProperty("tc:dur", max);
  i.setDynamicProperty("tc:nivel", 1);
  i.setDynamicProperty("tc:xp", 0);
  i.setDynamicProperty("tc:esp", TINKERS.espacosIniciais);
}

/** Recalcula o máximo (depois de modificador) mantendo a proporção gasta. */
export function recalcular(i: ItemStack): void {
  const f = ferramentaDe(i.typeId);
  if (!f) return;
  garantir(i);
  const antes = num(i, "tc:max", 1), dur = num(i, "tc:dur");
  const max = durabilidadeMax(f.tipo, f.mat, (txt(i, "tc:cabo") ?? "madeira") as Mat, txt(i, "tc:lig") as Mat | undefined, modsDe(i));
  i.setDynamicProperty("tc:max", max);
  i.setDynamicProperty("tc:dur", Math.min(max, dur + Math.max(0, max - antes)));
  atualizar(i);
}

export function consertar(i: ItemStack, quanto: number): number {
  garantir(i);
  const dur = num(i, "tc:dur"), max = num(i, "tc:max", 1);
  const novo = Math.min(max, dur + quanto);
  i.setDynamicProperty("tc:dur", novo);
  atualizar(i);
  return novo - dur;
}

export const durabilidade = (i: ItemStack) => (garantir(i), { dur: num(i, "tc:dur"), max: num(i, "tc:max", 1) });

/** Gasta durabilidade e dá XP à ferramenta na mão do jogador. */
function usar(j: Player, gasto: number): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  const f = ferramentaDe(i?.typeId);
  if (!inv || !i || !f) return;
  garantir(i);
  const dur = num(i, "tc:dur");
  if (dur <= 0) return;
  const obsidiana = modsDe(i).obsidiana ?? 0;
  if (!(obsidiana && Math.random() < obsidiana * TINKERS.modificadores.obsidiana.chance)) i.setDynamicProperty("tc:dur", Math.max(0, dur - gasto));
  else gasto = 0;
  let nivel = num(i, "tc:nivel", 1), xp = num(i, "tc:xp") + 1;
  if (nivel < TINKERS.nivelMax && xp >= xpPara(nivel)) {
    xp = 0;
    nivel++;
    i.setDynamicProperty("tc:nivel", nivel);
    const ganhou = (TINKERS.niveisComEspaco as readonly number[]).includes(nivel);
    if (ganhou) i.setDynamicProperty("tc:esp", num(i, "tc:esp") + 1);
    j.playSound("random.levelup", { pitch: 1.3 });
    j.sendMessage({ rawtext: [{ translate: "cl.tc.subiu", with: { rawtext: [{ translate: `item.${i.typeId}.name` }, { translate: `cl.tc.nivel.${nivel}` }] } }] });
    if (ganhou) j.sendMessage({ translate: "cl.tc.subiu_espaco" });
    registrarAcao(j, "ferramenta_nivel");
  }
  i.setDynamicProperty("tc:xp", xp);
  if (dur - gasto <= 0) j.playSound("random.break");
  atualizar(i);
  inv.setItem(j.selectedSlotIndex, i);
}

const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;

/** Repulsão e Ruína dos Artrópodes no golpe. */
function golpe(j: Player, alvo: Entity, mods: Mods): void {
  try {
    if (!alvo.isValid) return;
    if (mods.repulsao) {
      const dx = alvo.location.x - j.location.x, dz = alvo.location.z - j.location.z;
      const d = Math.hypot(dx, dz) || 1;
      const forca = mods.repulsao * TINKERS.modificadores.repulsao.forca;
      alvo.applyKnockback({ x: (dx / d) * forca, z: (dz / d) * forca }, 0.3);
    }
    if (mods.afiado) alvo.applyDamage(mods.afiado * TINKERS.modificadores.afiado.dano, { cause: EntityDamageCause.entityAttack, damagingEntity: j });
    if (mods.fogo && alvo.isValid) alvo.setOnFire(mods.fogo * TINKERS.modificadores.fogo.segundos, true);
    if (mods.artropodes && alvo.isValid && (TINKERS.aranhas as readonly string[]).includes(alvo.typeId)) {
      alvo.applyDamage(mods.artropodes * TINKERS.modificadores.artropodes.dano, { cause: EntityDamageCause.entityAttack, damagingEntity: j });
      alvo.addEffect("slowness", 60 * mods.artropodes, { amplifier: 3 });
    }
  } catch {
    // o alvo morreu no golpe
  }
}

/** Ferramenta montada no chão: renasce antes de o jogo apagar o item (5 min). */
const caidas = new Map<string, number>();
function talvezGuardar(e: Entity): void {
  try {
    if (e.typeId !== "minecraft:item") return;
    const item = e.getComponent("minecraft:item")?.itemStack;
    if (ferramentaDe(item?.typeId)) caidas.set(e.id, system.currentTick);
  } catch {
    // já sumiu
  }
}
function registrarRenascer(): void {
  world.afterEvents.entitySpawn.subscribe(({ entity }) => talvezGuardar(entity));
  world.afterEvents.entityLoad.subscribe(({ entity }) => talvezGuardar(entity));
  intervalo("tinkers", () => {
    for (const [id, desde] of caidas) {
      if (system.currentTick - desde < TINKERS.renascerTicks) continue;
      caidas.delete(id);
      const e = world.getEntity(id);
      if (!e?.isValid) continue;
      const item = e.getComponent("minecraft:item")?.itemStack;
      if (!item) continue;
      const novo = e.dimension.spawnItem(item, e.location);
      e.remove();
      caidas.set(novo.id, system.currentTick);
    }
  }, 600);
}

export function registrarFerramentas(): void {
  world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const f = ferramentaDe(ev.itemStack?.typeId);
    if (!f || criativo(ev.player)) return;
    const i = ev.itemStack!;
    if (i.getDynamicProperty("tc:dur") === 0) {
      ev.cancel = true;
      system.run(() => aviso(ev.player, "cl.tc.esta_quebrada"));
      return;
    }
    const precisa = TINKERS.nivelBloco[ev.block.typeId] ?? 0;
    if (precisa > nivelMat(f.mat)) {
      ev.cancel = true;
      system.run(() => aviso(ev.player, { translate: "cl.tc.nivel_baixo", with: [String(precisa), String(nivelMat(f.mat))] }));
    }
  });
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation, itemStackBeforeBreak }) => {
    const f = ferramentaDe(itemStackBeforeBreak?.typeId);
    if (!f) return;
    // Sorte (lápis): cada nível tem uma chance de soltar mais um do que o minério dá.
    const sorte = modsDe(itemStackBeforeBreak!).sorte ?? 0;
    const extra = TINKERS.fortuna[brokenBlockPermutation.type.id];
    if (sorte && extra) {
      let n = 0;
      for (let k = 0; k < sorte; k++) if (Math.random() < TINKERS.modificadores.sorte.chance) n++;
      if (n) block.dimension.spawnItem(new ItemStack(extra, n), block.center());
    }
    if (!criativo(player)) usar(player, f.tipo === "espada_larga" ? 2 : 1);
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    const mao = damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const f = ferramentaDe(mao?.typeId);
    if (!f || !mao) return;
    golpe(damagingEntity, hitEntity, modsDe(mao));
    if (!criativo(damagingEntity)) usar(damagingEntity, f.tipo === "espada_larga" ? 1 : 2);
  });
  registrarRenascer();
  // Pressa (redstone) e Musgo (conserto sozinho) valem com a ferramenta na mão.
  let volta = 0;
  intervalo("tinkers", () => {
    volta++;
    for (const j of world.getPlayers()) {
      const inv = j.getComponent("minecraft:inventory")?.container;
      const i = inv?.getItem(j.selectedSlotIndex);
      if (!inv || !i || !ferramentaDe(i.typeId)) continue;
      const mods = modsDe(i);
      if (mods.pressa && i.getDynamicProperty("tc:dur") !== 0) j.addEffect("haste", 30, { amplifier: mods.pressa - 1, showParticles: false });
      if (mods.musgo && volta % TINKERS.modificadores.musgo.segundos === 0 && consertar(i, mods.musgo) > 0) inv.setItem(j.selectedSlotIndex, i);
    }
  }, 20);
}

import { Entity, EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { TINKERS } from "../config.js";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { maoDe } from "../util/jogadores.js";
import { intervalo } from "../util/perfil.js";
import { toqueNovo } from "../util/toque.js";
import { acaoNoBloco, ajustarDrops, aoQuebrar, desgaste, morder, naMao, noAbate, noGolpe, slimeMax, tracosDe } from "./tracos.js";
import { THERMAL } from "../config.js";

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
type Area = { tipo: string; l?: number; a?: number; p?: number; dist?: number; coluna?: number };
type Def = { pecas: readonly string[]; dur?: number; area?: Area; slot?: string; tracos?: readonly (readonly [string, number])[]; espacos?: { melhorias: number; habilidades: number } };
type MatTr = { tracos?: readonly string[]; cabo?: number };
const MTR = DADOS_F15.materiais as unknown as Readonly<Record<string, MatTr>>;
const temTraco = (m: string | undefined, t: string) => !!m && (MTR[m]?.tracos ?? []).includes(t);
const FERR = DADOS_F15.ferramentas as unknown as Readonly<Record<string, Def>>;

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

export const nivelMat = (mat: string): number => (MAT[mat] as { nivel?: number } | undefined)?.nivel ?? 0;
/** 1.30.0: nível de mineração da ferramenta (Diamante sobe para 3 e Netherita para 4, como no TC3). */
export function nivelDe(i: ItemStack, mat: string): number {
  const m = modsDe(i);
  return Math.max(nivelMat(mat), m.netherita ? 4 : 0, m.reforco ? 3 : 0);
}
const num = (i: ItemStack, k: string, padrao = 0) => (i.getDynamicProperty(k) as number | undefined) ?? padrao;
const txt = (i: ItemStack, k: string) => i.getDynamicProperty(k) as string | undefined;
/** Espaços de habilidade livres (ferramenta de antes da 1.30.0: os do tipo). */
export const habDe = (i: ItemStack, tipo: string) => (i.getDynamicProperty("tc:hab") as number | undefined) ?? FERR[tipo]?.espacos?.habilidades ?? 1;
export const xpPara = (nivel: number) => Math.round(TINKERS.xpBase * TINKERS.xpFator ** (nivel - 1));
export function modsDe(i: ItemStack): Mods {
  try {
    return JSON.parse(txt(i, "tc:mods") ?? "{}") as Mods;
  } catch {
    return {};
  }
}

function durabilidadeMax(tipo: Tipo, cabeca: Mat, cabo: Mat, lig: Mat | undefined, mods: Mods): number {
  // 1.26.0: como no TC3, a durabilidade vem da cabeça vezes o cabo (a ligação não soma).
  const base = (MAT[cabeca] as { dur?: number }).dur ?? 100;
  let max = base * (MTR[cabo]?.cabo ?? 1) * TINKERS.iguanaDurabilidade;
  max += (mods.reforco ?? 0) * TINKERS.modificadores.reforco.durabilidade;
  max *= 1 + (mods.esmeralda ?? 0) * TINKERS.modificadores.esmeralda.fator;
  max *= 1 + (mods.netherita ?? 0) * TINKERS.modificadores.netherita.fator;
  max *= FERR[tipo]?.dur ?? 1; // multiplicador do TC3 (Marreta ×4, Martelo de Mineração ×5, Adaga ×0,75...)
  // Traços: Dúctil (aço) e Preservado (madeira tratada) duram mais.
  if (temTraco(cabeca, "ductile") || temTraco(lig, "ductile")) max *= 1.1;
  if (temTraco(cabeca, "preserved") || temTraco(lig, "preserved")) max *= 1.1;
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
  // 1.26.0: os traços do TC3 e o slime extra / escudo de pedra.
  const t = tracosDe(i, f.tipo, f.mat);
  for (const [nome, n] of t) linhas.push({ translate: "cl.tc.traco_linha", with: { rawtext: [{ translate: `cl.tc.traco.${nome}` }, { text: n > 1 ? ` ${"I".repeat(n)}` : "" }] } });
  const sm = slimeMax(i, t);
  if (sm) linhas.push({ translate: "cl.tc.slime", with: [String(num(i, "tc:slime")), String(sm)] });
  if (num(i, "tc:escudo")) linhas.push({ translate: "cl.tc.escudo", with: [String(num(i, "tc:escudo"))] });
  linhas.push({ translate: "cl.tc.espacos", with: [String(num(i, "tc:esp"))] });
  linhas.push({ translate: "cl.tc.habilidades", with: [String(habDe(i, f.tipo))] });
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
  // 1.30.0: os espaços do TC3 (melhorias e habilidades de cada ferramenta); Aprimorado (ouro rosa) dá mais um.
  i.setDynamicProperty("tc:esp", (FERR[tipo]?.espacos?.melhorias ?? 3) + (temTraco(cabeca, "enhanced") ? 1 : 0));
  i.setDynamicProperty("tc:hab", FERR[tipo]?.espacos?.habilidades ?? 1);
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
  // 1.26.0: o slime extra, o escudo de pedra, Denso e Energia Solar seguram parte do desgaste.
  gasto = desgaste(j, i, tracosDe(i, f.tipo, f.mat), gasto);
  if (gasto && obsidiana && Math.random() < obsidiana * TINKERS.modificadores.obsidiana.chance) gasto = 0;
  if (gasto) i.setDynamicProperty("tc:dur", Math.max(0, dur - gasto));
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

// ---------- Áreas do TC3 ----------
// Marreta e Escavadeira: 3×3 na face mirada; Foice: 3×3×3; Martelo de Mineração: o veio do mesmo bloco (até 2 de
// distância); Machado Grande: a árvore inteira (ou uma coluna de 6 quando não é tora).
const INQUEBRAVEIS = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:structure_block", "minecraft:mob_spawner", "minecraft:chest", "minecraft:end_portal_frame"]);
const TERRA = ["dirt", "sand", "gravel", "grass_block", "snow", "clay", "mud", "soul", "farmland", "mycelium", "podzol", "concrete_powder", "grass_path"];
const PLANTA = /leaves|short_grass|tall_grass|tallgrass|fern|flower|wheat|carrots|potatoes|beetroot|vine|bush|sapling|mushroom|kelp|seagrass|reeds|sugar_cane|hay_block|melon|pumpkin|cocoa|nether_wart|sweet_berry|azalea|dandelion|poppy|tulip|orchid|allium|bluet|daisy|cornflower|lily|cactus|bamboo|cl:planta|cl:cultura/;
const MADEIRA = /_log$|_wood$|_stem$|_hyphae$|planks|bamboo_block/;
type P = { x: number; y: number; z: number };
function serveArea(tipo: string, id: string): boolean {
  const terra = TERRA.some((t) => id.includes(t));
  if (tipo === "escavadeira") return terra;
  if (tipo === "foice") return PLANTA.test(id);
  if (tipo === "machado_largo") return MADEIRA.test(id);
  return !terra && !MADEIRA.test(id) && !id.includes("leaves");
}
/** Caixa l×a na face mirada e p de profundidade para dentro. */
function caixa(j: Player, b: P, l: number, a: number, p: number): P[] {
  const v = j.getViewDirection();
  const ax = Math.abs(v.x), ay = Math.abs(v.y), az = Math.abs(v.z);
  const r: P[] = [];
  const hl = Math.floor(l / 2), ha = Math.floor(a / 2);
  for (let w = -hl; w <= hl; w++) for (let h = -ha; h <= ha; h++) for (let d = 0; d < p; d++) {
    if (!w && !h && !d) continue;
    if (ay >= ax && ay >= az) r.push({ x: b.x + w, y: b.y + (v.y < 0 ? -d : d), z: b.z + h });
    else if (ax >= az) r.push({ x: b.x + (v.x < 0 ? -d : d), y: b.y + h, z: b.z + w });
    else r.push({ x: b.x + w, y: b.y + h, z: b.z + (v.z < 0 ? -d : d) });
  }
  return r;
}
type Dim = { getBlock(p: P): { typeId: string } | undefined };
/** O veio: blocos iguais ligados (também na diagonal) até `dist` do primeiro, no máximo 64. */
function veio(dim: Dim, b: P, id: string, dist: number): P[] {
  const achados: P[] = [];
  const vistos = new Set<string>([`${b.x},${b.y},${b.z}`]);
  const fila = [b];
  while (fila.length && achados.length < 64) {
    const p = fila.shift()!;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const q = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
      const k = `${q.x},${q.y},${q.z}`;
      if (vistos.has(k) || Math.max(Math.abs(q.x - b.x), Math.abs(q.y - b.y), Math.abs(q.z - b.z)) > dist) continue;
      vistos.add(k);
      if (dim.getBlock(q)?.typeId === id) {
        achados.push(q);
        fila.push(q);
      }
    }
  }
  return achados;
}
/** As toras ligadas acima e em volta (até 64), para o Machado Grande. */
function arvore(dim: Dim, b: P, id: string): P[] {
  if (!/_log$|_stem$|_wood$|_hyphae$/.test(id)) return [];
  const achadas: P[] = [];
  const vistos = new Set<string>();
  const fila = [{ x: b.x, y: b.y, z: b.z }];
  while (fila.length && achadas.length < 64) {
    const p = fila.shift()!;
    for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const q = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
      const k = `${q.x},${q.y},${q.z}`;
      if (vistos.has(k) || (q.x === b.x && q.y === b.y && q.z === b.z)) continue;
      vistos.add(k);
      if (dim.getBlock(q)?.typeId === id) {
        achadas.push(q);
        fila.push(q);
      }
    }
  }
  return achadas;
}
function blocosDaArea(j: Player, dim: Dim, b: P, id: string, ar: Area): P[] {
  if (ar.tipo === "veio") return veio(dim, b, id, ar.dist ?? 2);
  if (ar.tipo === "arvore") {
    if (/_log$|_stem$|_wood$|_hyphae$/.test(id)) return arvore(dim, b, id);
    const r: P[] = [];
    for (let k = 1; k < (ar.coluna ?? 1); k++) r.push({ x: b.x, y: b.y + k, z: b.z });
    return r;
  }
  return caixa(j, b, ar.l ?? 3, ar.a ?? 3, ar.p ?? 1);
}
const corpoACorpo = (tipo: string) => FERR[tipo]?.slot === "sword";

/** A ferramenta na mão (do inventário, para poder gravar). */
function naMaoDe(j: Player): { inv: NonNullable<ReturnType<typeof inventario>>; i: ItemStack; f: { tipo: Tipo; mat: Mat } } | undefined {
  const inv = inventario(j);
  const i = inv?.getItem(j.selectedSlotIndex);
  const f = ferramentaDe(i?.typeId);
  return inv && i && f ? { inv, i, f } : undefined;
}
const inventario = (j: Player) => j.getComponent("minecraft:inventory")?.container;

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
    if (precisa > nivelDe(i, f.mat)) {
      ev.cancel = true;
      system.run(() => aviso(ev.player, { translate: "cl.tc.nivel_baixo", with: [String(precisa), String(nivelDe(i, f.mat))] }));
    }
  });
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation, itemStackBeforeBreak }) => {
    const f = ferramentaDe(itemStackBeforeBreak?.typeId);
    if (!f) return;
    const id = brokenBlockPermutation.type.id;
    // Sorte (lápis): cada nível tem uma chance de soltar mais um do que o minério dá.
    const sorte = modsDe(itemStackBeforeBreak!).sorte ?? 0;
    const extra = TINKERS.fortuna[id];
    if (sorte && extra) {
      let n = 0;
      for (let k = 0; k < sorte; k++) if (Math.random() < TINKERS.modificadores.sorte.chance) n++;
      if (n) block.dimension.spawnItem(new ItemStack(extra, n), block.center());
    }
    // 1.26.0: traços ao quebrar (Magnético, Queimante, Impulso, Escudo de Pedra, Tesoura...).
    const m = naMaoDe(player);
    const tr = tracosDe(itemStackBeforeBreak!, f.tipo, f.mat);
    if (m && m.i.typeId === itemStackBeforeBreak!.typeId && aoQuebrar(player, m.i, tracosDe(m.i, f.tipo, f.mat), block, id)) m.inv.setItem(player.selectedSlotIndex, m.i);
    // 1.30.0: Autofundir, Derreter e Toque Sedoso mexem no que caiu.
    ajustarDrops(block.dimension, block.location, id, tr, THERMAL.fornalha as Readonly<Record<string, string>>);
    if (!criativo(player)) usar(player, corpoACorpo(f.tipo) ? 2 : 1);
    // Áreas do TC3 (agachado, quebra um bloco só).
    const def = FERR[f.tipo];
    // Expandido (TC3): a área cresce 1 para cada lado por nível; ferramenta sem área ganha 3×3.
    const exp = tr.get("expanded") ?? 0;
    const area: Area | undefined = def?.area
      ? exp ? { ...def.area, l: (def.area.l ?? 1) + 2 * exp, a: (def.area.a ?? 1) + 2 * exp, dist: (def.area.dist ?? 0) + exp } : def.area
      : exp ? { tipo: "caixa", l: 1 + 2 * exp, a: 1 + 2 * exp, p: 1 } : undefined;
    if (area && !player.isSneaking && itemStackBeforeBreak!.getDynamicProperty("tc:dur") !== 0) {
      const lista = blocosDaArea(player, block.dimension, block, id, area);
      system.run(() => {
        let n = 0;
        for (const p of lista) {
          const b = block.dimension.getBlock(p);
          if (!b || b.isAir || b.isLiquid || INQUEBRAVEIS.has(b.typeId) || (TINKERS.nivelBloco[b.typeId] ?? 0) > nivelDe(itemStackBeforeBreak!, f.mat)) continue;
          if (area.tipo === "caixa" && !serveArea(f.tipo, b.typeId)) continue;
          if (area.tipo === "arvore" && !serveArea("machado_largo", b.typeId)) continue;
          const bid = b.typeId;
          block.dimension.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
          ajustarDrops(block.dimension, p, bid, tr, THERMAL.fornalha as Readonly<Record<string, string>>);
          n++;
        }
        if (n && !criativo(player)) usar(player, n);
      });
    }
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    const mao = damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const f = ferramentaDe(mao?.typeId);
    if (!f || !mao) return;
    golpe(damagingEntity, hitEntity, modsDe(mao));
    noGolpe(damagingEntity, hitEntity, mao, tracosDe(mao, f.tipo, f.mat));
    if (!criativo(damagingEntity)) usar(damagingEntity, corpoACorpo(f.tipo) ? 1 : 2);
  });
  // Decapitação (Espadão): a cabeça sai no abate.
  world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    const j = damageSource.damagingEntity;
    if (!(j instanceof Player)) return;
    const mao = j.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    const f = ferramentaDe(mao?.typeId);
    if (f && mao) noAbate(j, deadEntity, tracosDe(mao, f.tipo, f.mat));
  });
  // Ações do TC3 no bloco (arar, caminho, descascar, colher e replantar).
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player, block, itemStack } = ev;
    const f = ferramentaDe(itemStack?.typeId);
    if (!f || !itemStack || itemStack.getDynamicProperty("tc:dur") === 0) return;
    const t = tracosDe(itemStack, f.tipo, f.mat);
    if (!["harvest", "tilling", "pathing", "stripping", "glowing"].some((x) => t.has(x)) || !toqueNovo(ev)) return;
    const face = ev.blockFace;
    const V: Readonly<Record<string, { x: number; y: number; z: number }>> = { Up: { x: 0, y: 1, z: 0 }, Down: { x: 0, y: -1, z: 0 }, North: { x: 0, y: 0, z: -1 }, South: { x: 0, y: 0, z: 1 }, East: { x: 1, y: 0, z: 0 }, West: { x: -1, y: 0, z: 0 } };
    system.run(() => {
      if (!block.isValid) return;
      const gasto = acaoNoBloco(player, t, block, f.tipo === "foice", V[face]);
      if (gasto && !criativo(player)) usar(player, gasto);
    });
  });
  // Saboroso (ferro-porco): com fome, toque no ar para dar uma mordida.
  world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
    const f = ferramentaDe(itemStack.typeId);
    if (!f || !tracosDe(itemStack, f.tipo, f.mat).has("tasty")) return;
    const m = naMaoDe(source);
    if (m && morder(source, m.i)) {
      atualizar(m.i);
      m.inv.setItem(source.selectedSlotIndex, m.i);
    }
  });
  registrarRenascer();
  // 1.30.0: Vinculada à Alma (TC3 soulbound): ao morrer, a ferramenta não fica no chão; volta quando você renasce.
  const almas = new Map<string, ItemStack[]>();
  world.afterEvents.entityDie.subscribe(
    ({ deadEntity }) => {
      if (!(deadEntity instanceof Player)) return;
      const dim = deadEntity.dimension, onde = deadEntity.location, id = deadEntity.id;
      system.runTimeout(() => {
        try {
          for (const e of dim.getEntities({ type: "minecraft:item", location: onde, maxDistance: 4 })) {
            const it = e.getComponent("minecraft:item")?.itemStack;
            if (!it || !ferramentaDe(it.typeId) || !(modsDe(it).alma ?? 0)) continue;
            almas.set(id, [...(almas.get(id) ?? []), it]);
            e.remove();
          }
        } catch {
          // chunk descarregado
        }
      }, 2);
    },
    { entityTypes: ["minecraft:player"] },
  );
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    const lista = almas.get(player.id);
    if (initialSpawn || !lista) return;
    almas.delete(player.id);
    const inv = player.getComponent("minecraft:inventory")?.container;
    for (const it of lista) if (inv?.addItem(it)) player.dimension.spawnItem(it, player.location);
  });
  // Pressa (redstone) e Musgo (conserto sozinho) valem com a ferramenta na mão; 1.26.0: e os traços na mão.
  let volta = 0;
  intervalo("tinkers", () => {
    volta++;
    for (const j of world.getPlayers()) {
      if (!ferramentaDe(maoDe(j))) continue; // 1.16.4: o item da mão vem do cache; só lê o item de quem segura uma
      const inv = j.getComponent("minecraft:inventory")?.container;
      const i = inv?.getItem(j.selectedSlotIndex);
      const f = ferramentaDe(i?.typeId);
      if (!inv || !i || !f) continue;
      const mods = modsDe(i);
      let mudou = false;
      if (mods.pressa && i.getDynamicProperty("tc:dur") !== 0) j.addEffect("haste", 30, { amplifier: Math.min(4, mods.pressa - 1), showParticles: false });
      if (mods.musgo && volta % TINKERS.modificadores.musgo.segundos === 0 && consertar(i, mods.musgo) > 0) mudou = true;
      if (naMao(j, i, tracosDe(i, f.tipo, f.mat), volta)) {
        atualizar(i);
        mudou = true;
      }
      if (mudou) inv.setItem(j.selectedSlotIndex, i);
    }
  }, 20);
}

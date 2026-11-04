import { Block, Entity, EntityDamageCause, ItemStack, Player, system, world } from "@minecraft/server";
import { DADOS_F15 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { madura, SEMENTES } from "../maquinas/mfr.js";
import { registrarAcao } from "../missoes/progresso.js";

/*
 * Traços do Tinkers' Construct 3 (1.26.0, Tinkers completo parte 1). Cada material dá o traço do TC3 (o da cabeça e o
 * da ligação) e cada ferramenta os seus (tool_definitions). O que dá para fazer no Bedrock, com o efeito mais perto do
 * mod (a descrição de cada um, do próprio mod, aparece no item):
 * - no golpe: Dentado (sílex, mais dano quanto mais gasta), Perfuração (osso, picareta), Golpeada (marreta, mortos-vivos),
 *   Repulsão (escavadeira), Enderferência (coro: o alvo fica lento), Escaldante (pedra chamuscada, alvo pegando fogo),
 *   Antitoxina (osso venenoso, você envenenado), Necromante (osso necrótico: golpe caindo cura), Lacerante (nahuatl,
 *   sangramento), Emboscada (manyullyn, alvo com vida cheia), Condutor (osso de blaze, você pegando fogo), Magnético
 *   (ferro, puxa os itens), Decapitação (espadão: cabeças);
 * - ao quebrar: Magnético, Queimante (pedra refratária: minério acelera), Impulso (hepatizon: minerar seguido acelera),
 *   Escudo de Pedra (pedra branca: pedra minerada protege a ferramenta), Tesoura (kama: folhas e plantas inteiras),
 *   Teleportação Ender (trepadeira de slime do ender);
 * - na mão (laço de 1 s, só de quem segura uma): Ligado à Pedra (pedra: gasta = mais rápida), Mantido (bronze: inteira =
 *   mais rápida), Anão (cobre: quanto mais fundo, mais rápida), Leve (cobalto), Aéreo (trepadeira de slime do céu: sem
 *   castigo no ar), Flamestância (trepadeira chorona: mais forte no Nether), Entrelaçado (trepadeira retorcida: mais
 *   rápido), Slimebilidade (cria e gasta o slime extra: Crescimento Excessivo, Nublado, Soberano, Superqueima, Sobrecarregado
 *   e o Sobrepoder do slime-cavaleiro);
 * - durabilidade: Denso (ósmio) e Energia Solar (trepadeira) às vezes não gastam; Dúctil (aço) e Preservado (madeira
 *   tratada) duram mais; Cultivado e Preservado consertam mais; Aprimorado (ouro rosa) dá um espaço a mais;
 * - Saboroso (ferro-porco): com fome, use a ferramenta (toque no ar) para dar uma mordida (gasta 10%).
 * - Ações (toque num bloco): Aragem (chibanca, kama, foice: terra vira terra arada), Caminhando (escavadeira,
 *   picarenxó: grama vira caminho), Descascamento (machados: tora vira tora descascada), Coleta (kama e foice: colhe e
 *   replanta; a foice em 3×3).
 */
type MatDef = { tracos?: readonly string[] };
type FerrDef = { tracos?: readonly (readonly [string, number])[] };
const SEMENTE_DE: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(SEMENTES).map(([semente, planta]) => [planta, semente]));
const MAT = DADOS_F15.materiais as unknown as Readonly<Record<string, MatDef>>;
const FERR = DADOS_F15.ferramentas as unknown as Readonly<Record<string, FerrDef>>;
const num = (i: ItemStack, k: string, p = 0) => (i.getDynamicProperty(k) as number | undefined) ?? p;

/** Os traços da ferramenta: da cabeça, da ligação e do tipo (nível de cada um). */
export function tracosDe(i: ItemStack, tipo: string, mat: string): Map<string, number> {
  const t = new Map<string, number>();
  for (const x of MAT[mat]?.tracos ?? []) t.set(x, (t.get(x) ?? 0) + 1);
  const lig = i.getDynamicProperty("tc:lig") as string | undefined;
  if (lig && lig !== mat) for (const x of MAT[lig]?.tracos ?? []) t.set(x, (t.get(x) ?? 0) + 1);
  for (const [x, n] of FERR[tipo]?.tracos ?? []) t.set(x, (t.get(x) ?? 0) + n);
  return t;
}

// ---------- Slime extra (overslime) ----------
/** Quanto slime extra cabe: 50, +100 com Nublado, +10% da durabilidade com Soberano. */
export function slimeMax(i: ItemStack, t: Map<string, number>): number {
  if (!t.has("overslime")) return 0;
  return 50 + (t.has("overcast") ? 100 : 0) + (t.has("overlord") ? Math.round(num(i, "tc:max", 1) * 0.1) : 0);
}
export function ganharSlime(i: ItemStack, t: Map<string, number>, n: number): boolean {
  const max = slimeMax(i, t);
  const agora = num(i, "tc:slime");
  if (!max || agora >= max) return false;
  i.setDynamicProperty("tc:slime", Math.min(max, agora + n * (t.has("overworked") ? 2 : 1)));
  return true;
}

/**
 * Quanto do desgaste de fato vai para a durabilidade (o resto o slime, o escudo de pedra, Denso ou Energia Solar
 * seguram). Grava o que mudou no item.
 */
export function desgaste(j: Player, i: ItemStack, t: Map<string, number>, gasto: number): number {
  let resto = gasto;
  const slime = num(i, "tc:slime");
  if (slime > 0 && resto > 0) {
    const n = Math.min(slime, resto);
    i.setDynamicProperty("tc:slime", slime - n);
    resto -= n;
  }
  const escudo = num(i, "tc:escudo");
  if (escudo > 0 && resto > 0) {
    const n = Math.min(escudo, resto);
    i.setDynamicProperty("tc:escudo", escudo - n);
    resto -= n;
  }
  if (resto <= 0) return 0;
  let livra = 0;
  if (t.has("dense")) livra += 0.2;
  if (t.has("solar_powered") && ehDia() && j.dimension.id === "minecraft:overworld" && j.location.y > 50) livra += 0.25;
  if (livra && Math.random() < livra) return 0;
  return resto;
}
const ehDia = () => {
  const h = world.getTimeOfDay();
  return h < 12000 || h > 23500;
};

// ---------- Golpe ----------
const MORTOS_VIVOS = new Set(["minecraft:zombie", "minecraft:husk", "minecraft:drowned", "minecraft:skeleton", "minecraft:stray", "minecraft:wither_skeleton", "minecraft:zombie_villager_v2", "minecraft:zombie_pigman", "minecraft:zoglin", "minecraft:phantom", "minecraft:wither", "minecraft:bogged", "cl:mumia", "cl:farao"]);
const CABECAS: Readonly<Record<string, string>> = {
  "minecraft:zombie": "minecraft:zombie_head", "minecraft:husk": "minecraft:zombie_head", "minecraft:skeleton": "minecraft:skeleton_skull", "minecraft:stray": "minecraft:skeleton_skull",
  "minecraft:creeper": "minecraft:creeper_head", "minecraft:wither_skeleton": "minecraft:wither_skeleton_skull", "minecraft:piglin": "minecraft:piglin_head", "minecraft:player": "minecraft:player_head",
};
const ferir = (alvo: Entity, j: Player, n: number) => {
  if (n > 0 && alvo.isValid) alvo.applyDamage(n, { cause: EntityDamageCause.entityAttack, damagingEntity: j });
};

export function noGolpe(j: Player, alvo: Entity, i: ItemStack, t: Map<string, number>): void {
  try {
    if (!alvo.isValid) return;
    const dur = num(i, "tc:dur"), max = num(i, "tc:max", 1);
    let extra = 0;
    if (t.has("jagged")) extra += Math.round((1 - dur / max) * 3);
    if (t.has("pierce")) extra += t.get("pierce")!;
    if (t.has("smite") && MORTOS_VIVOS.has(alvo.typeId)) extra += 2.5 * t.get("smite")!;
    if (t.has("scorching") && alvo.getComponent("minecraft:onfire")) extra += 2;
    if (t.has("antitoxin") && j.getEffect("poison")) extra += 2;
    if (t.has("conducting") && j.getComponent("minecraft:onfire")) extra += 3;
    const vida = alvo.getComponent("minecraft:health");
    if (t.has("ambush") && vida && vida.currentValue >= vida.effectiveMax) extra += 2;
    ferir(alvo, j, extra);
    if (!alvo.isValid) return;
    if (t.has("knockback")) {
      const dx = alvo.location.x - j.location.x, dz = alvo.location.z - j.location.z, d = Math.hypot(dx, dz) || 1;
      alvo.applyKnockback({ x: (dx / d) * 0.4 * t.get("knockback")!, z: (dz / d) * 0.4 * t.get("knockback")! }, 0.25);
    }
    if (t.has("enderference")) alvo.addEffect("slowness", 60, { amplifier: 1 });
    if (t.has("necrotic") && !j.isOnGround && j.getVelocity().y < 0) {
      const h = j.getComponent("minecraft:health");
      if (h) h.setCurrentValue(Math.min(h.effectiveMax, h.currentValue + 2));
    }
    if (t.has("lacerating")) for (let k = 1; k <= 3; k++) system.runTimeout(() => ferir(alvo, j, 1), k * 20);
    if (t.has("magnetic")) puxar(j, 3);
    if (t.has("severing") && CABECAS[alvo.typeId] && vida && vida.currentValue <= 0 && Math.random() < 0.1 * t.get("severing")!)
      alvo.dimension.spawnItem(new ItemStack(CABECAS[alvo.typeId], 1), alvo.location);
  } catch {
    // o alvo morreu no golpe
  }
}
/** Decapitação no abate (o golpe que mata deixa a vida em 0 só depois). */
export function noAbate(j: Player, morto: Entity, t: Map<string, number>): void {
  if (t.has("severing") && CABECAS[morto.typeId] && Math.random() < 0.1 * t.get("severing")!) {
    try {
      morto.dimension.spawnItem(new ItemStack(CABECAS[morto.typeId], 1), morto.location);
      registrarAcao(j, "tc_cabeca");
    } catch {
      // fora do mundo carregado
    }
  }
}

function puxar(j: Player, raio: number): void {
  system.run(() => {
    try {
      for (const e of j.dimension.getEntities({ type: "minecraft:item", location: j.location, maxDistance: raio })) e.teleport(j.location);
    } catch {
      // saiu
    }
  });
}

// ---------- Ao quebrar ----------
const impulso = new Map<string, { n: number; ate: number }>();
const PEDRAS = /^minecraft:(stone|cobblestone|deepslate|cobbled_deepslate|andesite|diorite|granite|tuff|netherrack|blackstone|basalt|end_stone)$/;
const TESOURA = /leaves|tallgrass|short_grass|tall_grass|fern|vine|web|seagrass|dead_bush|glow_lichen|hanging_roots/;
export function aoQuebrar(j: Player, i: ItemStack, t: Map<string, number>, b: Block, id: string): boolean {
  let mudou = false;
  if (t.has("magnetic")) puxar(j, 3);
  if (t.has("searing") && id.includes("_ore")) j.addEffect("haste", 60, { amplifier: 1, showParticles: false });
  if (t.has("momentum")) {
    const m = impulso.get(j.id);
    const n = m && m.ate > system.currentTick ? Math.min(3, m.n + 1) : 1;
    impulso.set(j.id, { n, ate: system.currentTick + 60 });
    j.addEffect("haste", 60, { amplifier: n - 1, showParticles: false });
  }
  if (t.has("stoneshield") && PEDRAS.test(id) && Math.random() < 0.2 && num(i, "tc:escudo") < 50) {
    i.setDynamicProperty("tc:escudo", num(i, "tc:escudo") + 1);
    mudou = true;
  }
  if (t.has("shears") && TESOURA.test(id)) {
    try {
      b.dimension.spawnItem(new ItemStack(id, 1), b.center());
    } catch {
      // bloco sem item
    }
  }
  if (t.has("enderporting")) {
    const cima = b.above();
    if (b.isAir && cima?.isAir) j.teleport(b.bottomCenter());
  }
  return mudou;
}

// ---------- Na mão (1 s) ----------
export function naMao(j: Player, i: ItemStack, t: Map<string, number>, volta: number): boolean {
  const dur = num(i, "tc:dur"), max = num(i, "tc:max", 1);
  if (dur <= 0) return false;
  let pressa = -1;
  if (t.has("stonebound") && dur < max * 0.5) pressa = Math.max(pressa, 0);
  if (t.has("maintained") && dur > max * 0.75) pressa = Math.max(pressa, 0);
  if (t.has("lightweight")) pressa = Math.max(pressa, 0);
  if (t.has("dwarven")) pressa = Math.max(pressa, j.location.y < 0 ? 1 : j.location.y < 40 ? 0 : -1);
  if (t.has("airborne") && !j.isOnGround) pressa = Math.max(pressa, 2);
  let mudou = false;
  if (t.has("overwield") && num(i, "tc:slime") > 0) {
    pressa = Math.max(pressa, 1);
    i.setDynamicProperty("tc:slime", num(i, "tc:slime") - 1);
    mudou = true;
  }
  if (pressa >= 0) j.addEffect("haste", 30, { amplifier: pressa, showParticles: false });
  if (t.has("entangled")) j.addEffect("speed", 30, { amplifier: 0, showParticles: false });
  if (t.has("flamestance") && j.dimension.id === "minecraft:nether") j.addEffect("strength", 30, { amplifier: 0, showParticles: false });
  // Slime extra: Crescimento Excessivo cria 1 a cada 3 s; Superqueima, 2 por segundo no Nether.
  if (t.has("overgrowth") && volta % 3 === 0) mudou = ganharSlime(i, t, 1) || mudou;
  if (t.has("overburn") && j.dimension.id === "minecraft:nether") mudou = ganharSlime(i, t, 2) || mudou;
  return mudou;
}

/** Saboroso: com fome, uma mordida na ferramenta (2 de fome, gasta 10% da durabilidade). */
export function morder(j: Player, i: ItemStack): boolean {
  const fome = j.getComponent("minecraft:player.hunger");
  if (!fome || fome.currentValue >= 20) return false;
  const dur = num(i, "tc:dur"), max = num(i, "tc:max", 1);
  if (dur <= max * 0.1) return false;
  fome.setCurrentValue(Math.min(20, fome.currentValue + 2));
  i.setDynamicProperty("tc:dur", dur - Math.round(max * 0.1));
  j.playSound("random.eat");
  aviso(j, "cl.tc.mordida", 2);
  registrarAcao(j, "tc_mordida");
  return true;
}

// ---------- Ações no bloco ----------
const ARAR = new Set(["minecraft:dirt", "minecraft:grass_block", "minecraft:grass", "minecraft:grass_path", "minecraft:dirt_path", "minecraft:coarse_dirt", "minecraft:rooted_dirt"]);
const CAMINHO = new Set(["minecraft:dirt", "minecraft:grass_block", "minecraft:grass", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:mycelium", "minecraft:rooted_dirt"]);
function trocar(b: Block, id: string): boolean {
  try {
    b.setType(id);
    return true;
  } catch {
    return false;
  }
}
/** Toque com a ferramenta num bloco. Devolve quanto de durabilidade gastou (0 = nada a fazer). */
export function acaoNoBloco(j: Player, t: Map<string, number>, b: Block, area: boolean): number {
  const id = b.typeId;
  const livre = b.above()?.isAir ?? false;
  if (t.has("harvest") && madura(b)) {
    let n = 0;
    const alvos = area ? arredor(b) : [b];
    for (const c of alvos) if (madura(c) && colher(c)) n++;
    if (n) registrarAcao(j, "tc_colher");
    return n;
  }
  if (t.has("tilling") && livre && ARAR.has(id) && trocar(b, "minecraft:farmland")) {
    j.playSound("use.gravel");
    return 1;
  }
  if (t.has("pathing") && livre && CAMINHO.has(id) && (trocar(b, "minecraft:grass_path") || trocar(b, "minecraft:dirt_path"))) {
    j.playSound("use.grass");
    return 1;
  }
  if (t.has("stripping") && /_(log|wood|stem|hyphae)$/.test(id) && !id.includes("stripped")) {
    const [ns, nome] = id.split(":");
    const novo = `${ns}:stripped_${nome}`;
    const perm = b.permutation;
    if (trocar(b, novo)) {
      try {
        const eixo = perm.getState("pillar_axis" as never);
        if (eixo !== undefined) b.setPermutation(b.permutation.withState("pillar_axis" as never, eixo as never));
      } catch {
        // sem eixo
      }
      j.playSound("use.wood");
      return 1;
    }
  }
  return 0;
}
function arredor(b: Block): Block[] {
  const r: Block[] = [];
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
    const c = b.offset({ x: dx, y: 0, z: dz });
    if (c) r.push(c);
  }
  return r;
}
/** Colhe e replanta: quebra a planta madura (o jogo solta tudo) e põe a muda de volta, gastando uma semente. */
function colher(b: Block): boolean {
  const id = b.typeId;
  const semente = SEMENTE_DE[id];
  const p = b.location;
  b.dimension.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
  if (!semente) return true;
  system.runTimeout(() => {
    try {
      const itens = b.dimension.getEntities({ type: "minecraft:item", location: b.center(), maxDistance: 1.5 });
      const s = itens.find((e) => e.getComponent("minecraft:item")?.itemStack.typeId === semente);
      if (!s) return;
      const pilha = s.getComponent("minecraft:item")!.itemStack;
      if (pilha.amount > 1) {
        pilha.amount -= 1;
        b.dimension.spawnItem(pilha, s.location);
      }
      s.remove();
      b.dimension.getBlock(p)?.setType(id);
    } catch {
      // chunk descarregado
    }
  }, 2);
  return true;
}

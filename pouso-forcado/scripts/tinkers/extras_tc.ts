import { Block, BlockCustomComponent, Direction, Entity, EntityDamageCause, GameMode, ItemStack, Player, RawMessage, Vector3, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { THERMAL, TINKERS } from "../config.js";
import { DADOS_F15, DADOS_F49 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { lerEm, gravarEm, registrarDetalhe } from "../util/dados.js";
import { gastarFerramenta, itemNaMao } from "../util/inventario.js";
import { ItemSalvo, carregarItem, salvarItem } from "../util/itens.js";
import { abrirUmMenu } from "../util/menus.js";
import { ajustarDrops } from "./tracos.js";

/*
 * 1.30.0 (Tinkers' Construct 3 completo, parte 5): livros, ferramentas antigas, cajados de slime, geringonças
 * (EFLN, Bola Brilhante, Estilingue de Slime, Estacas Punji) e os baús do Tinker. A Bigorna e a Mesa de
 * Modificadores ficam em mesas.ts.
 */

// ---------- Livros ----------
type Mat = { pt: string; dur?: number; vel?: number; dano?: number; nivel?: number; tracos: readonly string[]; cabeca: boolean; cabo?: number };
const MATERIAIS = DADOS_F15.materiais as unknown as Readonly<Record<string, Mat>>;
const LIVROS = DADOS_F49.livros as Readonly<Record<string, number>>;
const MODS = TINKERS.modificadores as unknown as Readonly<Record<string, { item: string; qtd: number; max: number; tipo?: string; itens?: readonly (readonly [string, number])[] }>>;
const nome = (id: string): RawMessage => ({ translate: id.startsWith("minecraft:") ? `item.${id.slice(10)}.name` : `item.${id}.name` });

function paginasTexto(id: string): RawMessage[] {
  const n = LIVROS[id] ?? 0;
  return Array.from({ length: n }, (_, k) => ({ translate: `cl.livro.${id}.${k + 1}` }));
}
/** Materiais e Você: uma página para cada 3 materiais de cabeça (números do TC3). */
function paginasMateriais(): RawMessage[] {
  const mats = Object.entries(MATERIAIS).filter(([, m]) => m.cabeca);
  const pags: RawMessage[] = [];
  for (let k = 0; k < mats.length; k += 3) {
    const raw: RawMessage[] = [];
    for (const [id, m] of mats.slice(k, k + 3)) {
      raw.push({ text: "§l" }, { translate: `cl.tc.mat.${id}` }, { text: "§r\n" });
      raw.push({ translate: "cl.livro.linha_material", with: [String(m.dur ?? 0), String(m.vel ?? 0), String(m.dano ?? 0), String(m.nivel ?? 0)] }, { text: "\n" });
      for (const t of m.tracos) raw.push({ text: "§d" }, { translate: `cl.tc.traco.${t}` }, { text: "§r: " }, { translate: `cl.tc.tracodesc.${t}` }, { text: "\n" });
      raw.push({ text: "\n" });
    }
    pags.push({ rawtext: raw });
  }
  return pags;
}
/** Os modificadores e o que cada um pede (para a Enciclopédia). */
function paginasModificadores(): RawMessage[] {
  const lista = Object.entries(MODS);
  const pags: RawMessage[] = [];
  for (let k = 0; k < lista.length; k += 5) {
    const raw: RawMessage[] = [];
    for (const [m, d] of lista.slice(k, k + 5)) {
      const r = d.itens ?? [[d.item, d.qtd]];
      raw.push({ text: "§l" }, { translate: `cl.tc.mod.${m}` }, { text: `§r §8(máx ${d.max})§r\n` });
      r.forEach(([id, n], i) => raw.push({ text: `${i ? ", " : "  "}${n}x ` }, nome(id)));
      raw.push({ text: "\n\n" });
    }
    pags.push({ rawtext: raw });
  }
  return pags;
}
function paginasDe(id: string): RawMessage[] {
  if (id === "livro_materiais") return [...paginasTexto(id), ...paginasMateriais()];
  if (id === "livro_enciclopedia")
    return [
      ...paginasTexto("livro_materiais"), ...paginasTexto("livro_fundicao_pequena"), ...paginasTexto("livro_fundicao_poderosa"),
      ...paginasTexto("livro_geringoncas"), ...paginasTexto("livro_fundicao_fantastica"), ...paginasModificadores(), ...paginasMateriais(),
    ];
  return paginasTexto(id);
}
async function lerLivro(j: Player, id: string): Promise<void> {
  const pags = paginasDe(id);
  let p = 0;
  while (pags.length) {
    const f = new ActionFormData()
      .title({ rawtext: [nome(`cl:${id}`), { text: ` §8${p + 1}/${pags.length}` }] })
      .body(pags[p]);
    const botoes: ("ant" | "prox" | "fechar")[] = [];
    if (p + 1 < pags.length) (f.button({ translate: "cl.tc.livro_prox" }), botoes.push("prox"));
    if (p > 0) (f.button({ translate: "cl.tc.livro_ant" }), botoes.push("ant"));
    f.button({ translate: "cl.tc.livro_fechar" });
    botoes.push("fechar");
    const r = await f.show(j);
    if (r.canceled || r.selection === undefined) return;
    const b = botoes[r.selection];
    if (b === "fechar") return;
    p += b === "prox" ? 1 : -1;
  }
}

// ---------- Cajados, ferramentas antigas e geringonças ----------
const espera = new Map<string, number>();
function pronto(j: Player, chave: string, ticks: number): boolean {
  const k = `${j.id}|${chave}`;
  const t = espera.get(k) ?? 0;
  if (system.currentTick < t) return false;
  espera.set(k, system.currentTick + ticks);
  return true;
}
const soma = (a: Vector3, b: Vector3, k = 1): Vector3 => ({ x: a.x + b.x * k, y: a.y + b.y * k, z: a.z + b.z * k });

function cajado(j: Player, id: string): void {
  if (!pronto(j, "cajado", 20)) return aviso(j, "cl.tc.cajado_espera", 1);
  const d = j.getViewDirection();
  const cab = j.getHeadLocation();
  if (id === "cl:cajado_ceu") {
    // Céu: um salto para onde olha e queda lenta.
    j.applyKnockback({ x: d.x * 1.6, z: d.z * 1.6 }, Math.max(0.6, d.y * 1.4 + 0.8));
    j.addEffect("slow_falling", 60, { amplifier: 0, showParticles: false });
    j.playSound("mob.slime.big");
  } else if (id === "cl:cajado_terra") {
    // Terra: onda de choque em volta (dano e empurrão).
    for (const e of j.dimension.getEntities({ location: j.location, maxDistance: 5, excludeTypes: ["minecraft:item", "minecraft:xp_orb"], excludeFamilies: ["inanimate"] })) {
      if (e.id === j.id) continue;
      const v = { x: e.location.x - j.location.x, z: e.location.z - j.location.z };
      const n = Math.hypot(v.x, v.z) || 1;
      try {
        e.applyDamage(4, { cause: EntityDamageCause.entityAttack, damagingEntity: j });
        e.applyKnockback({ x: (v.x / n) * 1.2, z: (v.z / n) * 1.2 }, 0.5);
      } catch {
        // entidade sem vida
      }
    }
    j.dimension.spawnParticle("minecraft:huge_explosion_emitter", j.location);
    j.playSound("random.explode", { volume: 0.5 });
  } else if (id === "cl:cajado_icor") {
    // Icor: bola de fogo.
    const bola = j.dimension.spawnEntity("minecraft:small_fireball", soma(cab, d, 1.2));
    bola.getComponent("minecraft:projectile")?.shoot({ x: d.x * 1.4, y: d.y * 1.4, z: d.z * 1.4 });
    j.playSound("mob.blaze.shoot");
  } else if (id === "cl:cajado_ender") {
    // Ender: teleporte até 32 blocos para onde olha.
    const alvo = j.getBlockFromViewDirection({ maxDistance: 32 })?.block;
    if (!alvo) return;
    const acima = alvo.above();
    if (!acima?.isAir) return;
    j.teleport({ x: acima.x + 0.5, y: acima.y, z: acima.z + 0.5 });
    j.playSound("mob.endermen.portal");
  }
  gastarFerramenta(j, 1);
  registrarAcao(j, "tc_cajado");
}

function atirarFlecha(j: Player, dano: number): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  let slot = -1;
  for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === "minecraft:arrow") { slot = s; break; }
  if (slot < 0 && j.getGameMode() !== GameMode.Creative) return aviso(j, { translate: "cl.tc.sem_material", with: { rawtext: [nome("minecraft:arrow")] } });
  if (slot >= 0 && j.getGameMode() !== GameMode.Creative) {
    const p = inv.getItem(slot)!;
    if (p.amount > 1) {
      p.amount--;
      inv.setItem(slot, p);
    } else inv.setItem(slot, undefined);
  }
  const d = j.getViewDirection();
  const f = j.dimension.spawnEntity("minecraft:arrow", soma(j.getHeadLocation(), d, 1));
  const pr = f.getComponent("minecraft:projectile");
  if (pr) {
    pr.owner = j;
    pr.shoot({ x: d.x * 2.6, y: d.y * 2.6, z: d.z * 2.6 });
  }
  f.setDynamicProperty("cl:dano_extra", dano);
  j.playSound("random.bow");
  gastarFerramenta(j, 1);
}

function antiga(j: Player, id: string): void {
  registrarAcao(j, "tc_antiga");
  if (id === "cl:picareta_guerra" && pronto(j, "antiga", 16)) atirarFlecha(j, 2); // Picareta de Guerra: besta embutida
  else if (id === "cl:lavador" && pronto(j, "antiga", 12)) atirarFlecha(j, 4); // Lavador: espada com arco
  else if (id === "cl:machado_minotauro" && pronto(j, "antiga", 60)) {
    // Machado do Minotauro: investida para a frente.
    const d = j.getViewDirection();
    j.applyKnockback({ x: d.x * 2.2, z: d.z * 2.2 }, 0.25);
    j.addEffect("strength", 40, { amplifier: 0, showParticles: false });
    j.playSound("mob.ravager.roar", { volume: 0.4 });
    gastarFerramenta(j, 2);
  }
}

function estilingue(j: Player): void {
  if (!pronto(j, "estilingue", 20)) return;
  // TC3: lança para o lado contrário de onde olha (mire no chão para subir).
  const d = j.getViewDirection();
  j.applyKnockback({ x: -d.x * 2.4, z: -d.z * 2.4 }, Math.max(0.2, -d.y * 2));
  j.addEffect("slow_falling", 20, { amplifier: 0, showParticles: false });
  j.playSound("mob.slime.big");
  gastarFerramenta(j, 1);
}

function luzEm(b: Block | undefined): void {
  if (!b?.isAir) return;
  for (const id of ["minecraft:light_block_15", "minecraft:light_block"]) {
    try {
      b.setType(id);
      return;
    } catch {
      // nome antigo
    }
  }
}
const FACE: Readonly<Record<string, Vector3>> = {
  [Direction.Up]: { x: 0, y: 1, z: 0 }, [Direction.Down]: { x: 0, y: -1, z: 0 }, [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 }, [Direction.East]: { x: 1, y: 0, z: 0 }, [Direction.West]: { x: -1, y: 0, z: 0 },
};

// ---------- Mochila de Porco (TC3 Piggybackpack: leva um animal nas costas) ----------
// No Bedrock o jogador não carrega passageiro: o animal vai guardado no item (tipo e nome) e sai onde você olha.
const NAO_LEVA = new Set(["minecraft:player", "minecraft:ender_dragon", "minecraft:wither", "minecraft:warden", "minecraft:elder_guardian"]);
const levavel = (e: Entity) =>
  e.isValid && e.id !== undefined && !NAO_LEVA.has(e.typeId) && !e.matches({ families: ["monster"] }) && !e.matches({ families: ["inanimate"] }) && !!e.getComponent("minecraft:health");
/** O animal para onde o jogador olha; se o raio não pegar (no celular é difícil mirar), o mais perto na frente. */
function animalNaFrente(j: Player): Entity | undefined {
  const raio = j.getEntitiesFromViewDirection({ maxDistance: 4 }).map((h) => h.entity).find(levavel);
  if (raio) return raio;
  const c = j.getHeadLocation(), d = j.getViewDirection();
  let melhor: Entity | undefined, dist = 99;
  for (const e of j.dimension.getEntities({ location: c, maxDistance: 4, excludeTypes: ["minecraft:player", "minecraft:item", "minecraft:xp_orb"] })) {
    if (!levavel(e)) continue;
    const v = { x: e.location.x - c.x, y: e.location.y + 0.5 - c.y, z: e.location.z - c.z };
    const n = Math.hypot(v.x, v.y, v.z) || 1;
    if ((v.x * d.x + v.y * d.y + v.z * d.z) / n < 0.6 || n >= dist) continue;
    melhor = e;
    dist = n;
  }
  return melhor;
}
function mochilaPorco(j: Player, i: ItemStack): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const dentro = i.getDynamicProperty("cl:bicho") as string | undefined;
  if (dentro) {
    const [tipo, nomeTag] = dentro.split("|");
    const alvo = j.getBlockFromViewDirection({ maxDistance: 5 })?.block?.above() ?? j.dimension.getBlock(j.location);
    if (!alvo) return;
    try {
      const e = j.dimension.spawnEntity(tipo, { x: alvo.x + 0.5, y: alvo.y, z: alvo.z + 0.5 });
      if (nomeTag) e.nameTag = nomeTag;
    } catch {
      return;
    }
    i.setDynamicProperty("cl:bicho", undefined);
    i.setLore([]);
    inv.setItem(j.selectedSlotIndex, i);
    j.playSound("mob.pig.say");
    return;
  }
  const e = animalNaFrente(j);
  if (!e) return aviso(j, "cl.tc.porco_nada", 2);
  const tipo = e.typeId, curto = tipo.replace(/^[a-z_]+:/, ""), nomeTag = e.nameTag ?? "";
  i.setDynamicProperty("cl:bicho", `${tipo}|${nomeTag}`);
  i.setLore([`§7${nomeTag || curto}`]);
  inv.setItem(j.selectedSlotIndex, i);
  e.remove();
  j.playSound("mob.pig.say");
  aviso(j, { translate: "cl.tc.porco_pegou", with: [nomeTag || curto] }, 3);
}

// ---------- Estacas Punji ----------
export const punjiComp: BlockCustomComponent = {
  onTick({ block }) {
    let es;
    try {
      es = block.dimension.getEntitiesAtBlockLocation(block.location);
    } catch {
      return;
    }
    for (const e of es) {
      if (e.typeId === "minecraft:item" || e.typeId === "minecraft:xp_orb" || !e.getComponent("minecraft:health")) continue;
      try {
        e.applyDamage(3, { cause: EntityDamageCause.contact });
        e.addEffect("slowness", 20, { amplifier: 1, showParticles: false });
      } catch {
        // sem vida
      }
    }
  },
};

// ---------- Baús do Tinker ----------
const BAU_MAX = 54;
const aceita = (bau: string, item: string): boolean =>
  bau === "cl:bau_pecas" ? /^cl:(peca_|padrao_)/.test(item) : bau === "cl:bau_moldes" ? /^cl:molde_/.test(item) : true;
const simples = (s: ItemSalvo) => !s.dp && !s.nome && !s.lore && !s.dano && !s.enc;

function guardar(j: Player, b: Block, i: ItemStack): void {
  const lista = lerEm<ItemSalvo[]>("bau_tc", b.dimension, b.location, []);
  const s = salvarItem(i);
  if (!s) return;
  let resto = s.n;
  if (simples(s))
    for (const x of lista) {
      if (x.t !== s.t || !simples(x)) continue;
      const cabe = i.maxAmount - x.n;
      const n = Math.min(cabe, resto);
      x.n += n;
      resto -= n;
      if (!resto) break;
    }
  if (resto && lista.length >= BAU_MAX) {
    if (resto === s.n) return aviso(j, "cl.tc.bau_cheio");
  } else if (resto) lista.push({ ...s, n: resto }), (resto = 0);
  gravarEm("bau_tc", b.dimension, b.location, lista);
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (inv) {
    if (resto) {
      i.amount = resto;
      inv.setItem(j.selectedSlotIndex, i);
    } else inv.setItem(j.selectedSlotIndex, undefined);
  }
  j.playSound("random.chestclosed", { volume: 0.4 });
}
async function abrirBau(j: Player, b: Block): Promise<void> {
  const lista = lerEm<ItemSalvo[]>("bau_tc", b.dimension, b.location, []);
  const f = new ActionFormData().title({ translate: `tile.${b.typeId}.name` }).body({ translate: "cl.tc.bau_corpo", with: [String(lista.length)] });
  for (const s of lista) f.button({ rawtext: [nome(s.t), { text: ` §8x${s.n}` }] });
  f.button({ translate: "cl.tc.voltar" });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || r.selection >= lista.length) return;
  const agora = lerEm<ItemSalvo[]>("bau_tc", b.dimension, b.location, []);
  const s = agora[r.selection];
  if (!s || s.t !== lista[r.selection].t) return;
  agora.splice(r.selection, 1);
  gravarEm("bau_tc", b.dimension, b.location, agora.length ? agora : undefined);
  const it = carregarItem(s);
  if (!it) return;
  const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(it);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  j.playSound("random.chestopen", { volume: 0.4 });
}
export const bauTcComp: BlockCustomComponent = {
  onPlayerInteract({ player, block }) {
    if (!player) return;
    const i = itemNaMao(player);
    if (i && aceita(block.typeId, i.typeId) && !player.isSneaking) return guardar(player, block, i);
    if (i && !aceita(block.typeId, i.typeId) && block.typeId !== "cl:bau_tinker") aviso(player, "cl.tc.bau_nao_aceita", 2);
    abrirUmMenu(player, () => abrirBau(player, block));
  },
};
const BAUS = new Set(["cl:bau_pecas", "cl:bau_moldes", "cl:bau_tinker"]);
const CAJADOS = new Set(["cl:cajado_ceu", "cl:cajado_terra", "cl:cajado_icor", "cl:cajado_ender"]);

export function registrarExtrasTC(): void {
  registrarDetalhe([...BAUS], (b) => ({ translate: "cl.tc.bau_corpo", with: [String(lerEm<ItemSalvo[]>("bau_tc", b.dimension, b.location, []).length)] }));
  world.afterEvents.itemUse.subscribe(({ source: j, itemStack: i }) => {
    const id = i.typeId;
    if (!id.startsWith("cl:")) return;
    const sem = id.slice(3);
    if (sem in LIVROS) return abrirUmMenu(j, () => lerLivro(j, sem));
    if (CAJADOS.has(id)) return system.run(() => cajado(j, id));
    if (["cl:picareta_guerra", "cl:lavador", "cl:machado_minotauro", "cl:placa_batalha", "cl:panela_fusao"].includes(id)) return system.run(() => antiga(j, id));
    if (id === "cl:estilingue_slime") return system.run(() => estilingue(j));
    if (id === "cl:mochila_porco") return system.run(() => {
      const atual = itemNaMao(j);
      if (atual?.typeId === id) mochilaPorco(j, atual);
    });
  });
  // Flecha da Picareta de Guerra e do Lavador: dano a mais.
  world.afterEvents.projectileHitEntity.subscribe((ev) => {
    const p = ev.projectile;
    if (!p.isValid) return;
    if (p.typeId === "cl:efln_proj") return explodir(ev.dimension, ev.location, p);
    const extra = p.getDynamicProperty("cl:dano_extra") as number | undefined;
    const alvo = ev.getEntityHit().entity;
    if (extra && alvo?.isValid && ev.source) alvo.applyDamage(extra, { cause: EntityDamageCause.projectile, damagingEntity: ev.source });
    if (p.typeId === "cl:bola_brilhante_proj") luzEm(ev.dimension.getBlock(ev.location));
  });
  world.afterEvents.projectileHitBlock.subscribe((ev) => {
    const p = ev.projectile;
    if (!p.isValid) return;
    if (p.typeId === "cl:efln_proj") return explodir(ev.dimension, ev.location, p);
    if (p.typeId === "cl:bola_brilhante_proj") {
      const h = ev.getBlockHit();
      const v = FACE[h.face];
      const b = h.block;
      const ar = v ? b.dimension.getBlock({ x: b.x + v.x, y: b.y + v.y, z: b.z + v.z }) : undefined;
      system.run(() => {
        luzEm(ar);
        if (p.isValid) p.remove();
      });
    }
  });
  // Panela de Fusão: o que a pá quebra sai fundido.
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation, itemStackBeforeBreak }) => {
    const bid = brokenBlockPermutation.type.id;
    if (BAUS.has(bid)) {
      // Baú quebrado: solta o que tinha dentro.
      const lista = lerEm<ItemSalvo[]>("bau_tc", block.dimension, block.location, []);
      gravarEm("bau_tc", block.dimension, block.location, undefined);
      const c = { x: block.x + 0.5, y: block.y + 0.5, z: block.z + 0.5 }, dim = block.dimension;
      // 2 ticks depois: o Autofundir da picareta não mexe no que estava guardado.
      system.runTimeout(() => {
        for (const s of lista) {
          const it = carregarItem(s);
          if (it) dim.spawnItem(it, c);
        }
      }, 2);
      return;
    }
    const id = itemStackBeforeBreak?.typeId;
    if (id === "cl:panela_fusao") ajustarDrops(block.dimension, block.location, bid, new Map([["autosmelt", 1]]), THERMAL.fornalha as Readonly<Record<string, string>>);
    if (id?.startsWith("cl:") && ["cl:picareta_guerra", "cl:lavador", "cl:machado_minotauro", "cl:panela_fusao"].includes(id)) registrarAcao(player, "tc_antiga");
  });
}

function explodir(dim: Player["dimension"], onde: Vector3, p: { isValid: boolean; remove(): void }): void {
  system.run(() => {
    try {
      // EFLN (TC3): explosão pequena que não põe fogo.
      dim.createExplosion(onde, 2.5, { breaksBlocks: true, causesFire: false });
    } catch {
      // fora do mundo carregado
    }
    if (p.isValid) p.remove();
  });
}

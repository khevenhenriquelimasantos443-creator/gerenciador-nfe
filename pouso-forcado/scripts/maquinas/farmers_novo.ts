import { Block, BlockCustomComponent, BlockStates, EntityDamageCause, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { iconeDe, nomeDe } from "../catalogo/catalogo.js";
import { DADOS_F53 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, lerEm, gravarEm } from "../util/dados.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * 1.34.0: Farmer's Delight 1.3.0 (o mais novo). Tortas e banquetes em bloco servidos aos pedaços; Composto Orgânico
 * que vira Solo Rico; Solo Rico que acelera o que cresce em cima e encostado (e cogumelo em cima vira colônia); Rede de
 * Segurança (sem dano de queda, quica); Cesto (junta o que cai em cima); bebidas e comidas com os efeitos do mod;
 * presunto dos porcos (com faca); rações para cachorro e cavalo. Tudo por evento ou pelo tick do próprio bloco.
 */
const PORCOES = DADOS_F53.porcoes as unknown as Readonly<Record<string, readonly [string, number, boolean]>>;
const SELVAGENS = new Set<string>(DADOS_F53.selvagens as unknown as string[]);
const FACA = (i?: ItemStack) => !!i?.typeId.startsWith("cl:faca_");

// ---------- Tortas e banquetes ----------
export const porcoesComp: BlockCustomComponent = {
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    const def = PORCOES[b.typeId];
    if (!def) return;
    const [porcao, total, tigela] = def;
    const resta = ler<number>("porcoes", b, total);
    const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
    if (tigela && mao?.typeId !== "minecraft:bowl")
      return aviso(j, { translate: "cl.fd.porcoes", with: { rawtext: [nomeDe(b.typeId), { text: String(resta) }, { translate: "cl.fd.com_tigela" }] } }, 3);
    if (tigela && j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
    // A travessa de rolinhos serve um de cada (fatia de alga, salmão, bacalhau).
    const item = b.typeId === "cl:travessa_rolinhos" ? ["cl:fatia_rolo_alga", "cl:rolinho_salmao", "cl:rolinho_bacalhau"][resta % 3] : porcao;
    darAoJogador(j, item, 1);
    j.playSound("random.eat", { volume: 0.4 });
    registrarAcao(j, PORCOES[b.typeId][2] ? "fd2_banquete" : "fd2_torta");
    if (resta <= 1) {
      gravar("porcoes", b, undefined);
      b.setType("minecraft:air");
    } else gravar("porcoes", b, resta - 1);
  },
};

// ---------- Composto e Solo Rico ----------
const ESTADOS_IDADE = ["growth", "age", "cl:idade", "cl:estagio", "minecraft:growth"];
/** Uma etapa a mais de crescimento (como um pouco de farinha de osso). */
function crescer(b: Block | undefined): void {
  if (!b || b.isAir) return;
  for (const nome of ESTADOS_IDADE) {
    let v: unknown;
    try {
      v = b.permutation.getState(nome as never);
    } catch {
      continue;
    }
    if (typeof v !== "number") continue;
    const max = Math.max(...((BlockStates.get(nome)?.validValues as number[] | undefined) ?? [v]));
    if (v < max)
      try {
        b.setPermutation(b.permutation.withState(nome as never, (v + 1) as never));
      } catch {
        // estado com outro limite
      }
    return;
  }
}
export const soloComp: BlockCustomComponent = {
  onTick({ block: b }) {
    if (b.typeId === "cl:composto_organico") {
      // Vira Solo Rico depois de 4 vezes (mais rápido com água ou cogumelo encostado).
      let ajuda = 0;
      for (const v of [b.north(), b.south(), b.east(), b.west(), b.above()]) if (v && /water|mushroom/.test(v.typeId)) ajuda++;
      const n = ler<number>("composto", b, 0) + 1 + ajuda;
      if (n >= 4) {
        gravar("composto", b, undefined);
        b.setType("cl:solo_rico");
        const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
        if (j) registrarAcao(j, "fd2_solo");
      } else gravar("composto", b, n);
      return;
    }
    const cima = b.above();
    if (cima?.typeId === "minecraft:brown_mushroom") return void cima.setType("cl:colonia_cogumelo_marrom");
    if (cima?.typeId === "minecraft:red_mushroom") return void cima.setType("cl:colonia_cogumelo_vermelho");
    crescer(cima);
    // As plantações encostadas (na terra arada do lado) também.
    for (const v of [b.north(), b.south(), b.east(), b.west()]) if (v?.typeId === "minecraft:farmland") crescer(v.above());
  },
  onPlayerInteract({ player: j, block: b }) {
    if (j) aviso(j, b.typeId === "cl:composto_organico" ? "cl.fd.composto" : "cl.fd.solo", 4);
  },
};

// ---------- Rede de Segurança ----------
export const redeComp: BlockCustomComponent = {
  onEntityFallOn({ entity }) {
    if (!entity || entity.isSneaking) return;
    try {
      const v = entity.getVelocity();
      entity.applyKnockback({ x: v.x, z: v.z }, Math.min(1, Math.abs(v.y) * 0.8 + 0.3));
    } catch {
      // sem física
    }
  },
};

// ---------- Cesto ----------
const CESTO_MAX = 27;
export const cestoComp: BlockCustomComponent = {
  onTick({ block: b }) {
    let itens;
    try {
      itens = b.dimension.getEntities({ type: "minecraft:item", location: { x: b.x + 0.5, y: b.y + 1.2, z: b.z + 0.5 }, maxDistance: 1.2 });
    } catch {
      return;
    }
    if (!itens.length) return;
    const lista = lerEm<ItemSalvo[]>("cesto", b.dimension, b.location, []);
    for (const e of itens) {
      if (lista.length >= CESTO_MAX) break;
      const s = salvarItem(e.getComponent("minecraft:item")?.itemStack);
      if (!s) continue;
      lista.push(s);
      e.remove();
    }
    gravarEm("cesto", b.dimension, b.location, lista);
  },
  onPlayerInteract({ player: j, block: b }) {
    if (j) abrirUmMenu(j, () => abrirCesto(j, b));
  },
};
async function abrirCesto(j: Player, b: Block): Promise<void> {
  const lista = lerEm<ItemSalvo[]>("cesto", b.dimension, b.location, []);
  const f = new ActionFormData().title({ translate: `tile.${b.typeId}.name` }).body({ translate: "cl.fd.cesto", with: [String(lista.length)] });
  for (const s of lista) f.button({ rawtext: [nomeDe(s.t), { text: ` §8x${s.n}` }] }, iconeDe(s.t));
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const agora = lerEm<ItemSalvo[]>("cesto", b.dimension, b.location, []);
  const [s] = agora.splice(r.selection, 1);
  gravarEm("cesto", b.dimension, b.location, agora.length ? agora : undefined);
  const it = carregarItem(s ?? null);
  if (it) darAoJogador(j, it);
}

// ---------- Efeitos das comidas e bebidas novas ----------
const RUINS = new Set(["poison", "wither", "nausea", "blindness", "hunger", "slowness", "weakness", "mining_fatigue", "darkness"]);
function tirarUmEfeito(j: Player, soRuim: boolean): void {
  const lista = j.getEffects().filter((e) => !soRuim || RUINS.has(e.typeId.replace("minecraft:", "")));
  const e = lista[Math.floor(Math.random() * lista.length)];
  if (e) j.removeEffect(e.typeId);
}
const COMER: Readonly<Record<string, (j: Player) => void>> = {
  "cl:sidra_maca": (j) => j.addEffect("absorption", 1200, { amplifier: 0 }),
  "cl:chocolate_quente": (j) => tirarUmEfeito(j, true),
  "cl:garrafa_leite": (j) => tirarUmEfeito(j, false),
  "cl:suco_melancia": (j) => {
    const h = j.getComponent("minecraft:health");
    if (h) h.setCurrentValue(Math.min(h.effectiveMax, h.currentValue + 2));
  },
  "cl:picole_melancia": (j) => j.extinguishFire(),
  "cl:creme_baga_brilhante": (j) => j.addEffect("glowing" as never, 100, { amplifier: 0 }),
  "cl:fatia_bolo": (j) => j.addEffect("speed", 400, { amplifier: 0, showParticles: false }),
  "cl:fatia_torta_maca": (j) => j.addEffect("speed", 600, { amplifier: 0, showParticles: false }),
  "cl:fatia_cheesecake": (j) => j.addEffect("speed", 600, { amplifier: 0, showParticles: false }),
  "cl:fatia_torta_chocolate": (j) => j.addEffect("speed", 600, { amplifier: 0, showParticles: false }),
  "cl:fatia_torta_abobora": (j) => j.addEffect("speed", 600, { amplifier: 0, showParticles: false }),
  "cl:salada_nether": (j) => Math.random() < 0.3 && j.addEffect("nausea", 240, { amplifier: 0 }),
};

export function registrarFarmersNovo(): void {
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: j }) => {
    const f = COMER[itemStack.typeId];
    if (f)
      try {
        f(j);
      } catch {
        // efeito com outro nome
      }
  });
  // Presunto: porco ou hoglin abatido com faca.
  world.afterEvents.entityDie.subscribe(({ deadEntity, damageSource }) => {
    const j = damageSource.damagingEntity;
    if (!(j instanceof Player) || !["minecraft:pig", "minecraft:hoglin"].includes(deadEntity.typeId)) return;
    const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
    if (FACA(mao)) deadEntity.dimension.spawnItem(new ItemStack("cl:presunto", 1), deadEntity.location);
  });
  // Rações: cachorro domado e cavalo ganham vida e força (5 min, como no mod).
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    if (id !== "cl:racao_cachorro" && id !== "cl:racao_cavalo") return;
    const alvo = ev.target, j = ev.player;
    const certo = id === "cl:racao_cachorro" ? alvo.typeId === "minecraft:wolf" : ["minecraft:horse", "minecraft:donkey", "minecraft:mule"].includes(alvo.typeId);
    if (!certo) return;
    ev.cancel = true;
    system.run(() => {
      if (!alvo.isValid) return;
      const h = alvo.getComponent("minecraft:health");
      if (h) h.resetToMaxValue();
      for (const ef of id === "cl:racao_cachorro" ? ["speed", "strength", "resistance"] : ["speed", "jump_boost", "regeneration"]) alvo.addEffect(ef, 6000, { amplifier: 0 });
      if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      aviso(j, { translate: "cl.fd.racao", with: { rawtext: [{ translate: `entity.${alvo.typeId.replace("minecraft:", "")}.name` }] } }, 3);
    });
  });
  // Rede de Segurança: cair nela não machuca.
  world.beforeEvents.entityHurt.subscribe(
    (ev) => {
      const l = ev.hurtEntity.location;
      try {
        const b = ev.hurtEntity.dimension.getBlock({ x: Math.floor(l.x), y: Math.floor(l.y - 0.3), z: Math.floor(l.z) });
        if (b?.typeId === "cl:rede_seguranca") ev.cancel = true;
      } catch {
        // fora do mundo
      }
    },
    { allowedDamageCauses: [EntityDamageCause.fall] },
  );
  // Plantas selvagens: a missão de achar uma.
  world.afterEvents.playerBreakBlock.subscribe(({ player, brokenBlockPermutation }) => {
    if (SELVAGENS.has(brokenBlockPermutation.type.id)) registrarAcao(player, "fd2_selvagem");
  });
}

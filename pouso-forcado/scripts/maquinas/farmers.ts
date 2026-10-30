import { Block, BlockCustomComponent, GameMode, ItemStack, Player, system, world } from "@minecraft/server";
import { DADOS_F33 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";

/*
 * Farmer's Delight (1.12.0):
 * - Panela de Cozinha: em cima de fogo, fogueira, lava, magma ou Fogão. Tocar com um ingrediente o põe dentro (até 6);
 *   com os ingredientes certos ela cozinha (100 a 200 ticks, como no mod) e o prato fica esperando: tocar com uma tigela
 *   serve (os pratos de tigela pedem a tigela, como no mod). Agachado e de mão vazia, esvazia.
 * - Tábua de Cortar: põe um ingrediente tocando com ele; tocar com uma faca corta (gasta 1 de durabilidade).
 * - Fogão: esquenta a panela e assa até 6 comidas cruas em cima (600 ticks, como a fogueira).
 * - Efeitos: Nutrição (a fome não baixa: 1 ponto de saturação a cada 30 s) e Conforto (tira lentidão, fraqueza e fome).
 * - Faca quebrando grama: 1 em 5 dá Palha; trigo dá Palha.
 */
type Receita = { sai: string; n?: number; ingr: ReadonlyArray<ReadonlyArray<string>>; tempo: number };
const RECEITAS: ReadonlyArray<Receita> = DADOS_F33.panela;
const CORTE: Readonly<Record<string, ReadonlyArray<readonly [string, number, number]>>> = DADOS_F33.corte;
const EFEITOS: Readonly<Record<string, readonly [number, number]>> = DADOS_F33.efeitos;
const REGENERA = new Set<string>(DADOS_F33.regenera);
// Pratos de tigela pedem uma tigela para servir (os rolinhos e os bolinhos não).
const TIGELA = new Set(RECEITAS.map((r) => r.sai).filter((id) => id !== "cl:rolinhos_repolho" && id !== "cl:bolinhos"));
const CALOR = new Set(["minecraft:fire", "minecraft:soul_fire", "minecraft:lava", "minecraft:flowing_lava", "minecraft:magma", "minecraft:campfire", "minecraft:soul_campfire", "cl:fogao"]);
const ASSAR: Readonly<Record<string, string>> = {
  "minecraft:beef": "minecraft:cooked_beef", "minecraft:porkchop": "minecraft:cooked_porkchop", "minecraft:chicken": "minecraft:cooked_chicken",
  "minecraft:mutton": "minecraft:cooked_mutton", "minecraft:cod": "minecraft:cooked_cod", "minecraft:salmon": "minecraft:cooked_salmon",
  "minecraft:potato": "minecraft:baked_potato", "minecraft:rabbit": "minecraft:cooked_rabbit", "minecraft:kelp": "minecraft:dried_kelp",
  "cl:carne_moida": "cl:hamburguer_carne", "cl:pedacos_frango": "cl:pedacos_frango_cozidos", "cl:bacon": "cl:bacon_cozido",
  "cl:fatia_bacalhau": "cl:fatia_bacalhau_cozida", "cl:fatia_salmao": "cl:fatia_salmao_cozida", "cl:costeleta_carneiro": "cl:costeleta_carneiro_cozida",
};
const nome = (id: string) => ({ translate: new ItemStack(id).localizationKey });
const mao = (j: Player) => j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
const ehFaca = (id?: string) => !!id?.startsWith("cl:faca_");

// ---------- Panela ----------
type Panela = { itens: string[]; prog: number; pronto?: { id: string; n: number } };
const lerPanela = (b: Block) => ler<Panela>("panela", b, { itens: [], prog: 0 });
function receitaDe(itens: string[]): Receita | undefined {
  return RECEITAS.find((r) => {
    if (r.ingr.length !== itens.length) return false;
    const resta = [...itens];
    return r.ingr.every((op) => {
      const k = resta.findIndex((i) => op.includes(i));
      return k >= 0 && resta.splice(k, 1).length > 0;
    });
  });
}
const quente = (b: Block) => {
  const baixo = b.below();
  if (!baixo || !CALOR.has(baixo.typeId)) return false;
  return baixo.permutation.getState("extinguished" as never) !== true;
};
export const panela: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const p = lerPanela(b);
    const r = p.itens.length ? receitaDe(p.itens) : undefined;
    if (!r || !quente(b) || (p.pronto && p.pronto.id !== r.sai)) return;
    p.prog += 20;
    b.dimension.spawnParticle("minecraft:basic_smoke_particle", { x: b.x + 0.5, y: b.y + 1.1, z: b.z + 0.5 });
    if (p.prog >= r.tempo) {
      p.pronto = { id: r.sai, n: (p.pronto?.n ?? 0) + (r.n ?? 1) };
      p.itens = [];
      p.prog = 0;
      b.dimension.playSound("bubble.pop", b.center());
      const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 12, closest: 1 })[0];
      if (j) registrarAcao(j, "cozinhar");
    }
    gravar("panela", b, p);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const p = lerPanela(b);
    const item = mao(j);
    if (p.pronto) {
      const precisa = TIGELA.has(p.pronto.id);
      if (precisa && item?.typeId !== "minecraft:bowl") return aviso(j, { translate: "cl.fd.pronto", with: { rawtext: [{ text: String(p.pronto.n) }, nome(p.pronto.id)] } }, 3);
      if (precisa && j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      darAoJogador(j, p.pronto.id, 1);
      p.pronto.n--;
      if (p.pronto.n <= 0) p.pronto = undefined;
      gravar("panela", b, p);
      return;
    }
    if (!item) {
      if (j.isSneaking && p.itens.length) {
        for (const i of p.itens) darAoJogador(j, i, 1);
        gravar("panela", b, { itens: [], prog: 0 });
        return;
      }
      const r = receitaDe(p.itens);
      const estado = !p.itens.length ? { text: "" } : !r ? { translate: "cl.fd.sem_receita" } : !quente(b) ? { translate: "cl.fd.sem_fogo" }
        : { translate: "cl.fd.cozinhando", with: { rawtext: [nome(r.sai), { text: String(Math.floor((p.prog / r.tempo) * 100)) }] } };
      return aviso(j, { translate: "cl.fd.panela", with: { rawtext: [{ text: String(p.itens.length) }, estado] } }, 4);
    }
    if (p.itens.length >= 6 || ehFaca(item.typeId)) return;
    p.itens.push(item.typeId);
    p.prog = 0;
    if (j.getGameMode() !== GameMode.Creative) {
      gastarDaMao(j);
      if (item.typeId.endsWith("_bucket")) darAoJogador(j, "minecraft:bucket", 1);
    }
    gravar("panela", b, p);
    j.playSound("bucket.fill_water", { volume: 0.4, pitch: 1.4 });
  },
};

// ---------- Tábua de Cortar ----------
export const tabua: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const em = ler<string | undefined>("tabua", b, undefined);
    const item = mao(j);
    if (em && ehFaca(item?.typeId)) {
      const saidas = CORTE[em];
      if (!saidas) return;
      for (const [id, n, chance] of saidas) if (Math.random() < chance) b.dimension.spawnItem(new ItemStack(id, n), { x: b.x + 0.5, y: b.y + 0.5, z: b.z + 0.5 });
      gravar("tabua", b, undefined);
      j.playSound("block.bamboo.hit", { pitch: 1.2 });
      if (j.getGameMode() !== GameMode.Creative) {
        const inv = j.getComponent("minecraft:inventory")?.container;
        const f = inv?.getItem(j.selectedSlotIndex);
        const dur = f?.getComponent("minecraft:durability");
        if (inv && f && dur) {
          if (dur.damage + 1 >= dur.maxDurability) inv.setItem(j.selectedSlotIndex, undefined);
          else {
            dur.damage++;
            inv.setItem(j.selectedSlotIndex, f);
          }
        }
      }
      registrarAcao(j, "cortar");
      return;
    }
    if (em && !item) {
      darAoJogador(j, em, 1);
      gravar("tabua", b, undefined);
      return;
    }
    if (!em && item && CORTE[item.typeId]) {
      gravar("tabua", b, item.typeId);
      if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      return aviso(j, { translate: "cl.fd.tabua", with: { rawtext: [nome(item.typeId)] } }, 3);
    }
    aviso(j, em ? { translate: "cl.fd.tabua", with: { rawtext: [nome(em)] } } : "cl.fd.tabua_vazia", 3);
  },
};

// ---------- Fogão ----------
type Assando = { id: string; t: number };
export const fogao: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const l = ler<Assando[]>("fogao", b, []);
    if (!l.length) return;
    for (const a of l) a.t += 20;
    const prontos = l.filter((a) => a.t >= 600);
    for (const a of prontos) b.dimension.spawnItem(new ItemStack(ASSAR[a.id] ?? a.id, 1), { x: b.x + 0.5, y: b.y + 1.2, z: b.z + 0.5 });
    gravar("fogao", b, l.filter((a) => a.t < 600));
    b.dimension.spawnParticle("minecraft:basic_smoke_particle", { x: b.x + 0.5, y: b.y + 1.1, z: b.z + 0.5 });
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const l = ler<Assando[]>("fogao", b, []);
    const item = mao(j);
    if (item && ASSAR[item.typeId] && l.length < 6) {
      l.push({ id: item.typeId, t: 0 });
      gravar("fogao", b, l);
      if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
      j.playSound("random.fizz", { volume: 0.3 });
    }
    aviso(j, { translate: "cl.fd.fogao", with: [String(l.length)] }, 2);
  },
};

// ---------- Efeitos ----------
const NUTRICAO = "cl:nutricao_ate", CONFORTO = "cl:conforto_ate";
const agora = () => world.getAbsoluteTime();

export function registrarFarmers(): void {
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: j }) => {
    const ef = EFEITOS[itemStack.typeId];
    if (REGENERA.has(itemStack.typeId)) j.addEffect("regeneration", 100, { amplifier: 0 });
    if (!ef) return;
    const [nut, conf] = ef;
    if (nut) {
      j.setDynamicProperty(NUTRICAO, Math.max((j.getDynamicProperty(NUTRICAO) as number) ?? 0, agora() + nut));
      aviso(j, { translate: "cl.fd.nutricao", with: [String(nut / 20)] }, 3);
      registrarAcao(j, "nutricao");
    }
    if (conf) j.setDynamicProperty(CONFORTO, Math.max((j.getDynamicProperty(CONFORTO) as number) ?? 0, agora() + conf));
  });
  intervalo("farmer's delight", () => {
    const t = agora();
    for (const j of world.getPlayers()) {
      if (((j.getDynamicProperty(CONFORTO) as number) ?? 0) > t) for (const ef of ["slowness", "weakness", "hunger"]) j.removeEffect(ef);
      if (((j.getDynamicProperty(NUTRICAO) as number) ?? 0) > t && system.currentTick % 600 < 20) j.addEffect("saturation", 1, { amplifier: 0, showParticles: false });
    }
  }, 20);
  // Faca na grama e no trigo: palha.
  world.afterEvents.playerBreakBlock.subscribe(({ player, brokenBlockPermutation, block, itemStackBeforeBreak }) => {
    if (!ehFaca(itemStackBeforeBreak?.typeId) || player.getGameMode() === GameMode.Creative) return;
    const t = brokenBlockPermutation.type.id;
    const chance = t === "minecraft:wheat" ? 1 : t === "minecraft:short_grass" || t === "minecraft:tall_grass" || t === "minecraft:fern" ? 0.2 : 0;
    if (Math.random() < chance) block.dimension.spawnItem(new ItemStack("cl:palha", 1), block.center());
  });
  registrarDetalhe("cl:panela_cozinha", (b) => {
    const p = lerPanela(b);
    return p.pronto ? { rawtext: [{ text: `§a${p.pronto.n}× ` }, nome(p.pronto.id)] } : { text: `§7${p.itens.length}/6` };
  });
}

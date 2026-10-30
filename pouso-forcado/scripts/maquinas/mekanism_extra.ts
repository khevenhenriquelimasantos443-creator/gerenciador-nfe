import { Block, EnchantmentType, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ENERGIA } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { LUA } from "../galacticraft/oxigenio.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rfPorTick } from "../util/energia.js";
import { cabe, entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { gerar } from "../util/rede.js";
import { feito, maquina } from "./thermal.js";

/*
 * Os add-ons do Mekanism (1.7.0), com os números do código do Mekanism (J/t do Mekanism: 100 J/t = 1 E a cada 5 s).
 * - Triturador (200 ticks, 50 J/t): plantas → Biocombustível; lingotes → pó; pedregulho → cascalho → areia.
 * - Mekanism Generators: Gerador a Calor (150 J/t com combustível de fornalha, +5 J/t por lava encostada), Gerador
 *   Solar (50 J/t) e Solar Avançado (300 J/t) de dia com céu aberto, Biogerador (350 J/t; 1 biocombustível dura 200
 *   ticks), Gerador a Gás (hidrogênio a 200 J/mB: devolve o que a eletrólise gastou) e Turbina Eólica (60 J/t em
 *   y 24 até 480 J/t em y 255; na Lua não venta).
 * - Mekanism Tools: as ferramentas e armaduras têm durabilidade e dano no JSON; aqui o desgaste (o jogo não gasta
 *   ferramenta de add-on sozinho), a Inquebrável e a enxada arando a terra.
 * Os geradores guardam a fração de E que sobra entre os ciclos ("resto").
 */
const POR_J = 1 / 100; // E por ciclo de 5 s para cada J/t
const quemPerto = (b: Block): Player | undefined => b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];

// ---------- Triturador ----------
export const TRITURADOR: Readonly<Record<string, [string, number]>> = {
  "minecraft:short_grass": ["cl:biocombustivel", 4], "minecraft:sugar_cane": ["cl:biocombustivel", 2], "minecraft:wheat_seeds": ["cl:biocombustivel", 2],
  "minecraft:wheat": ["cl:biocombustivel", 4], "minecraft:pumpkin_seeds": ["cl:biocombustivel", 2], "minecraft:melon_seeds": ["cl:biocombustivel", 2],
  "minecraft:apple": ["cl:biocombustivel", 4], "minecraft:bread": ["cl:biocombustivel", 4], "minecraft:potato": ["cl:biocombustivel", 4],
  "minecraft:carrot": ["cl:biocombustivel", 4], "minecraft:rotten_flesh": ["cl:biocombustivel", 2],
  "minecraft:iron_ingot": ["cl:po_ferro", 1], "minecraft:gold_ingot": ["cl:po_ouro", 1], "minecraft:copper_ingot": ["cl:po_cobre", 1],
  "cl:lingote_estanho": ["cl:po_estanho", 1], "cl:lingote_osmio": ["cl:po_osmio", 1],
  "minecraft:cobblestone": ["minecraft:gravel", 1], "minecraft:gravel": ["minecraft:sand", 1],
};
export const triturador = maquina((b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => TRITURADOR[id] !== undefined);
  if (!ent || !p || !cabe(b)) return "parada";
  if (!gastarCE(b, 50)) return "sem_energia";
  tirar(ent, p.typeId);
  const [sai, n] = TRITURADOR[p.typeId];
  entregar(b, [new ItemStack(sai, n)]);
  feito(b, "dig.gravel");
  return "ok";
}, "cl.mk.triturador");

// ---------- Geradores ----------
export function produzir(b: Block, porCiclo: number): number {
  if (porCiclo <= 0) return 0;
  const total = ler<number>("resto", b, 0) + porCiclo;
  const inteiro = Math.floor(total);
  const foi = inteiro > 0 ? gerar(b, inteiro) : 0;
  // Sem bateria com espaço, a fração não acumula sem fim.
  gravar("resto", b, foi < inteiro ? Math.min(total - foi, 1) : total - foi);
  return foi;
}
const ultimo = new Map<string, number>(); // E/ciclo do último tick, para o toque e o WAILA
const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
/** Componente de gerador: calcular() dá os E deste ciclo; nominal() (painéis) entra no toque como "rende X". */
export function gerador(calcular: (b: Block) => number, dica: string, comFumaca = false, nominal?: (b: Block) => number) {
  return {
    onTick(e: { block: Block }) {
      const n = calcular(e.block);
      ultimo.set(chave(e.block), n);
      if (produzir(e.block, n) > 0 && comFumaca) e.block.dimension.spawnParticle("cl:fumaca", { x: e.block.x + 0.5, y: e.block.y + 1.3, z: e.block.z + 0.5 });
    },
    onPlayerInteract(e: { player?: Player; block: Block }) {
      if (e.player) estadoGerador(e.player, e.block, dica, nominal);
    },
  };
}
export function agora(b: Block): string {
  const n = ultimo.get(chave(b)) ?? 0;
  return n > 0 ? rfPorTick(n) : "—";
}
function estadoGerador(j: Player, b: Block, dica: string, nominal?: (b: Block) => number): void {
  const valor: RawMessage = (ultimo.get(chave(b)) ?? 0) > 0 ? { text: agora(b) } : { translate: "cl.mk.parado" };
  const extra = nominal ? [{ text: rfPorTick(nominal(b)) }] : [];
  j.sendMessage({ translate: dica, with: { rawtext: [...extra, valor] } });
}

export function solAlto(): boolean {
  const t = world.getTimeOfDay();
  return t > 500 && t < 11500;
}
export function ceuAberto(b: Block): boolean {
  const topo = b.dimension.getTopmostBlock({ x: b.x, z: b.z });
  return !topo || topo.y <= b.y;
}

// Combustível de fornalha: o Gerador a Calor queima metade do tempo de fornalha (carvão 1.600 → 800 ticks = 8 ciclos).
const queimaDe = (id: string): number => (ENERGIA.combustivel[id] ?? 0) * 2;
const LAVAS = new Set(["minecraft:lava", "minecraft:flowing_lava"]);
export const geradorCalor = gerador((b) => {
  let lava = 0;
  for (const v of [b.north(), b.south(), b.east(), b.west(), b.above(), b.below()]) if (v && LAVAS.has(v.typeId)) lava++;
  let ciclos = ler<number>("queima", b, 0);
  if (ciclos <= 0) {
    const ent = entrada(b);
    const c = ent && primeiro(ent, (id) => queimaDe(id) > 0);
    if (c && ent) {
      tirar(ent, c.typeId);
      if (c.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
      ciclos = queimaDe(c.typeId);
    }
  }
  let jt = lava * 5;
  if (ciclos > 0) {
    jt += 150;
    gravar("queima", b, ciclos - 1);
  }
  return jt * POR_J;
}, "cl.mk.gerador_calor", true);

export const geradorSolar = gerador((b) => (solAlto() && ceuAberto(b) ? 50 * POR_J : 0), "cl.mk.gerador_solar", false, () => 50 * POR_J);
export const geradorSolarAvancado = gerador((b) => (solAlto() && ceuAberto(b) ? 300 * POR_J : 0), "cl.mk.gerador_solar", false, () => 300 * POR_J);

export const geradorBio = gerador((b) => {
  // Um biocombustível dura 200 ticks = 2 ciclos de 350 J/t.
  let ciclos = ler<number>("queima", b, 0);
  if (ciclos <= 0) {
    const ent = entrada(b);
    if (!ent || !tirar(ent, "cl:biocombustivel")) return 0;
    ciclos = 2;
  }
  gravar("queima", b, ciclos - 1);
  return 350 * POR_J;
}, "cl.mk.gerador_bio", true);

export const geradorGas = gerador((b) => {
  const ent = entrada(b);
  if (!ent || !tirar(ent, "cl:cilindro_hidrogenio")) return 0;
  entregar(b, [new ItemStack("cl:cilindro_vazio", 1)]);
  return 1;
}, "cl.mk.gerador_gas");

export const geradorEolico = gerador((b) => {
  if (b.dimension.id === LUA) return 0;
  const y = Math.min(255, Math.max(24, b.y));
  return (60 + ((y - 24) / (255 - 24)) * (480 - 60)) * POR_J;
}, "cl.mk.gerador_eolico");

// ---------- Mekanism Tools: desgaste ----------
const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;
function desgastar(j: Player, pontos: number): void {
  if (criativo(j)) return;
  const eq = j.getComponent("minecraft:equippable");
  const mao = eq?.getEquipment(EquipmentSlot.Mainhand);
  if (!eq || !mao?.hasTag("cl:mk_ferramenta")) return;
  const dur = mao.getComponent("minecraft:durability");
  if (!dur) return;
  // Inquebrável: cada nível dá uma chance de não gastar (como no jogo).
  const inq = mao.getComponent("minecraft:enchantable")?.getEnchantment("unbreaking" as unknown as EnchantmentType)?.level ?? 0;
  let gasto = 0;
  for (let k = 0; k < pontos; k++) if (Math.random() < 1 / (inq + 1)) gasto++;
  if (!gasto) return;
  if (dur.damage + gasto >= dur.maxDurability) {
    eq.setEquipment(EquipmentSlot.Mainhand, undefined);
    j.playSound("random.break");
    return;
  }
  dur.damage += gasto;
  eq.setEquipment(EquipmentSlot.Mainhand, mao);
}
const TERRA = new Set(["minecraft:dirt", "minecraft:grass_block", "minecraft:dirt_path", "minecraft:coarse_dirt"]);

export function registrarMekanismExtra(): void {
  world.afterEvents.playerBreakBlock.subscribe(({ player, itemStackBeforeBreak }) => {
    if (!itemStackBeforeBreak?.hasTag("cl:mk_ferramenta")) return;
    desgastar(player, itemStackBeforeBreak.hasTag("minecraft:is_sword") ? 2 : 1);
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
    if (!(damagingEntity instanceof Player)) return;
    const mao = damagingEntity.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!mao?.hasTag("cl:mk_ferramenta")) return;
    desgastar(damagingEntity, mao.hasTag("minecraft:is_sword") ? 1 : 2);
  });
  // A enxada ara a terra (o jogo só faz isso com as enxadas dele).
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const i = ev.itemStack;
    if (!i?.hasTag("cl:mk_ferramenta") || !i.hasTag("minecraft:is_hoe") || !TERRA.has(ev.block.typeId) || !ev.isFirstEvent) return;
    const acima = ev.block.above();
    if (acima && !acima.isAir) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    system.run(() => {
      b.setType("minecraft:farmland");
      j.playSound("use.gravel");
      desgastar(j, 1);
    });
  });
  // "O que estou olhando": quanto o gerador está dando agora.
  registrarDetalhe(["cl:gerador_calor", "cl:gerador_bio", "cl:gerador_gas", "cl:gerador_eolico", "cl:gerador_solar_mk", "cl:gerador_solar_avancado"], (b) => ({ text: `§7${agora(b)}` }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const [de, [sai, n]] of Object.entries(TRITURADOR)) r.push({ ...m("cl:triturador_mk"), entradas: [{ item: de, qtd: 1 }], saidas: [{ item: sai, qtd: n }] });
    r.push({ ...m("cl:gerador_bio"), entradas: [{ item: "cl:biocombustivel", qtd: 1 }], saidas: [], nota: { text: "7 E (28.000 RF)" } });
    r.push({ ...m("cl:gerador_gas"), entradas: [{ item: "cl:cilindro_hidrogenio", qtd: 1 }], saidas: [{ item: "cl:cilindro_vazio", qtd: 1 }], nota: { text: "1 E (4.000 RF)" } });
    r.push({ ...m("cl:gerador_calor"), entradas: [{ item: "minecraft:coal", qtd: 1 }], saidas: [], nota: { text: "12 E (48.000 RF)" } });
    return r;
  });
}

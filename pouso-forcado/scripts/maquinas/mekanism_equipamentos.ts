import {
  Block, BlockCustomComponent, Container, EntityDamageCause, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, StructureSaveMode, system, Vector3, world,
} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { nomeDe } from "../catalogo/catalogo.js";
import { THERMAL } from "../config.js";
import { DADOS_F70 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { abrirUmMenu } from "../util/menus.js";
import { capacidadeDe, cargaDe, coletarNaRede } from "../util/rede.js";
import { capacidadeDaPilha, cargaItem, definirCarga, registrarItemComEnergia } from "./enderio9.js";
import { nomeQuimico, pontaDe } from "./mekanism_quimica.js";
import { doseDe, formatarSv, nivelEm, registrarProtecao } from "./mekanism_radiacao.js";

/*
 * Mekanism completo, parte 5 (1.53.0): equipamentos, com os números do GearConfig (energia no item em RF; 2,5 J = 1 RF).
 * - Meka-Tool (16 MJ, ×2 por Unidade de Energia) e MekaSuit (16 MJ por peça): módulos instalados na Estação de Modificação
 *   (a Meka-Tool/peça na mão, toque a estação). Gastos: 10 J por bloco (100 J com Toque Suave), 2.000 J por golpe, 1.000 J
 *   por bloco de teletransporte; a MekaSuit absorve dano por 100.000 J por ponto (capacete 15%, peito 40%, calça 30%,
 *   botas 15%), queda por 50 J.
 * - Desintegrador Atômico: 1 MJ, 10 J por bloco, 2.000 J por golpe; modos normal / veio / veio estendido (agachado + usar).
 * - Arco Elétrico (120 kJ; 120 J por flecha, 1.200 J de fogo), Lança-Chamas (hidrogênio), Corredores (64 kJ, sem dano de
 *   queda por 50 J por ponto), Tanque e Máscara de Mergulho (oxigênio, 1 mB por tique na água), Configurador (gira),
 *   Leitor de Rede, Dicionário (etiquetas), Conta-Gotas (mostra/esvazia), Cantil (pasta nutritiva: 50 mB por ponto de fome),
 *   Caixa de Papelão (leva um bloco com o que tem dentro).
 * O que o Bedrock não deixa: voar livre (Modulação Gravitacional vira um jetpack que paira), élitros no peito (vira queda
 * lenta), passo alto do Servo, cores.
 */
const G = DADOS_F70.gear as unknown as Record<string, number>;
const RF = (joules: number) => Math.ceil(joules * 0.4);
const META = "cl:ferramenta_meka", DESM = "cl:desmontador_atomico";
const SUIT: Readonly<Record<string, EquipmentSlot>> = {
  "cl:capacete_mekasuit": EquipmentSlot.Head, "cl:peitoral_mekasuit": EquipmentSlot.Chest, "cl:calcas_mekasuit": EquipmentSlot.Legs, "cl:botas_mekasuit": EquipmentSlot.Feet,
};
const ABSORVE: Readonly<Record<string, number>> = { "cl:capacete_mekasuit": 0.15, "cl:peitoral_mekasuit": 0.4, "cl:calcas_mekasuit": 0.3, "cl:botas_mekasuit": 0.15 };
const CAP_MEKA = G.MEKA_TOOL_CAPACITY ?? 16000000;

// ---------- Módulos ----------
type Mods = Record<string, number>;
const T = Object.keys(SUIT);
const [CAB, PEI, CAL, BOT] = T;
const COMUM = [CAB, PEI, CAL, BOT];
/** id do item do módulo → [chave, máximo, onde instala] */
const MODULOS: Readonly<Record<string, readonly [string, number, readonly string[]]>> = {
  "cl:modulo_energia": ["energia", 8, [META, ...COMUM]], "cl:modulo_escavacao": ["escavacao", 4, [META]], "cl:modulo_ataque": ["ataque", 4, [META]],
  "cl:modulo_cultivo": ["cultivo", 4, [META]], "cl:modulo_tosquia": ["tosquia", 1, [META]], "cl:modulo_toque_suave": ["suave", 1, [META]],
  "cl:modulo_fortuna": ["fortuna", 3, [META]], "cl:modulo_explosao": ["explosao", 4, [META]], "cl:modulo_veio": ["veio", 4, [META]],
  "cl:modulo_teletransporte": ["teleporte", 1, [META]], "cl:modulo_respiracao": ["respiracao", 4, [CAB]], "cl:modulo_purificacao": ["purificacao", 1, [CAB]],
  "cl:modulo_visao": ["visao", 4, [CAB]], "cl:modulo_nutricao": ["nutricao", 1, [CAB]], "cl:modulo_blindagem_radiacao": ["blindagem", 1, COMUM],
  "cl:modulo_dosimetro": ["dosimetro", 1, [CAB]], "cl:modulo_geiger": ["geiger", 1, [CAB]], "cl:modulo_solar": ["solar", 8, [CAB]],
  "cl:modulo_jetpack": ["jetpack", 1, [PEI]], "cl:modulo_distribuicao_carga": ["distribuicao", 1, [PEI]], "cl:modulo_gravitacional": ["gravitacional", 1, [PEI]],
  "cl:modulo_elitro": ["elitro", 1, [PEI]], "cl:modulo_locomocao": ["locomocao", 4, [CAL]], "cl:modulo_giroscopio": ["giroscopio", 1, [CAL]],
  "cl:modulo_geotermico": ["geotermico", 8, [CAL]], "cl:modulo_servo": ["servo", 5, [CAL]], "cl:modulo_propulsao": ["propulsao", 4, [BOT]],
  "cl:modulo_magnetico": ["magnetico", 4, [BOT]], "cl:modulo_gelo": ["gelo", 2, [BOT]], "cl:modulo_hidrostatico": ["hidrostatico", 4, [BOT]],
  "cl:modulo_almas": ["almas", 1, [BOT]], "cl:modulo_dissipacao_laser": ["laser", 1, COMUM], "cl:modulo_cor": ["cor", 1, COMUM],
};
const ITEM_DO: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(MODULOS).map(([id, [k]]) => [k, id]));
export const modsDe = (i: ItemStack | undefined): Mods => {
  try {
    return i ? (JSON.parse((i.getDynamicProperty("mk_mod") as string | undefined) ?? "{}") as Mods) : {};
  } catch {
    return {};
  }
};
function gravarMods(i: ItemStack, m: Mods): void {
  i.setDynamicProperty("mk_mod", JSON.stringify(m));
  // Encantamentos que o Bedrock já sabe aplicar: Toque Suave, Fortuna e Passos Gelados.
  const ench = i.getComponent("minecraft:enchantable");
  if (ench) {
    for (const [k, e] of [["suave", "silk_touch"], ["fortuna", "fortune"], ["gelo", "frost_walker"]] as const) {
      try {
        ench.removeEnchantment(e);
      } catch {
        // não tinha
      }
      if (m[k]) {
        try {
          ench.addEnchantment({ type: e as never, level: m[k] });
        } catch {
          // não cabe nesse item
        }
      }
    }
  }
  definirCarga(i, cargaItem(i)); // refaz a descrição com a capacidade nova
}
const capMeka = (i: ItemStack) => RF(CAP_MEKA * Math.pow(2, modsDe(i).energia ?? 0));

// ---------- Energia do item ----------
const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;
/** Gasta `joules` do item no slot; devolve se deu. */
function gastar(j: Player, slot: EquipmentSlot, joules: number): boolean {
  if (criativo(j)) return true;
  const eq = j.getComponent("minecraft:equippable");
  const i = eq?.getEquipment(slot);
  if (!eq || !i) return false;
  const rf = RF(joules);
  if (cargaItem(i) < rf) return false;
  definirCarga(i, cargaItem(i) - rf);
  eq.setEquipment(slot, i);
  return true;
}
function somar(j: Player, slot: EquipmentSlot, joules: number): void {
  const eq = j.getComponent("minecraft:equippable");
  const i = eq?.getEquipment(slot);
  if (!eq || !i) return;
  definirCarga(i, cargaItem(i) + RF(joules));
  eq.setEquipment(slot, i);
}
const naMao = (j: Player) => j.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand);

// ---------- Estação de Modificação ----------
async function estacao(j: Player): Promise<void> {
  const alvo = naMao(j);
  if (!alvo || (alvo.typeId !== META && !SUIT[alvo.typeId])) return aviso(j, "cl.mke.estacao.mao", 4);
  const m = modsDe(alvo);
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const candidatos: string[] = [];
  for (let s = 0; s < inv.size; s++) {
    const it = inv.getItem(s);
    const d = it ? MODULOS[it.typeId] : undefined;
    if (it && d && d[2].includes(alvo.typeId) && (m[d[0]] ?? 0) < d[1] && !candidatos.includes(it.typeId)) candidatos.push(it.typeId);
  }
  const instalados = Object.entries(m).filter(([, n]) => n > 0);
  const lista: RawMessage = instalados.length
    ? { rawtext: instalados.flatMap(([k, n], x) => [{ text: x ? ", " : "" }, nomeDe(ITEM_DO[k]), { text: ` ${n}` }]) }
    : { translate: "cl.mke.nenhum" };
  const f = new ActionFormData().title({ translate: "cl.mke.estacao" })
    .body({ translate: "cl.mke.estacao.corpo", with: { rawtext: [nomeDe(alvo.typeId), { text: `${cargaItem(alvo).toLocaleString("pt-BR")} RF` }, lista] } });
  for (const id of candidatos) f.button({ translate: "cl.mke.instalar", with: { rawtext: [nomeDe(id), { text: String((m[MODULOS[id][0]] ?? 0) + 1) }, { text: String(MODULOS[id][1]) }] } });
  for (const [k, n] of instalados) f.button({ translate: "cl.mke.tirar", with: { rawtext: [nomeDe(ITEM_DO[k]), { text: String(n) }] } });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const agora = naMao(j);
  if (!agora || agora.typeId !== alvo.typeId) return;
  const mods = modsDe(agora);
  if (r.selection < candidatos.length) {
    const id = candidatos[r.selection];
    let tirou = false;
    for (let s = 0; s < inv.size && !tirou; s++) {
      const it = inv.getItem(s);
      if (it?.typeId !== id) continue;
      if (it.amount > 1) (it.amount--, inv.setItem(s, it));
      else inv.setItem(s, undefined);
      tirou = true;
    }
    if (!tirou) return;
    mods[MODULOS[id][0]] = (mods[MODULOS[id][0]] ?? 0) + 1;
    registrarAcao(j, "mk_modulo");
  } else {
    const [k] = instalados[r.selection - candidatos.length];
    mods[k] = Math.max(0, (mods[k] ?? 0) - 1);
    if (!mods[k]) delete mods[k];
    const sobra = inv.addItem(new ItemStack(ITEM_DO[k], 1));
    if (sobra) j.dimension.spawnItem(sobra, j.location);
  }
  gravarMods(agora, mods);
  j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, agora);
  j.playSound("random.anvil_use", { volume: 0.5 });
}
export const estacaoComp: BlockCustomComponent = {
  onPlayerInteract({ player: j }) {
    if (j) abrirUmMenu(j, () => estacao(j));
  },
};

// ---------- Mineração: Meka-Tool e Desintegrador ----------
const ehMinerio = (id: string) => /_ore$|:minerio_|ancient_debris/.test(id);
const ehTora = (id: string) => /_log$|_stem$|_wood$|_hyphae$/.test(id);
const NAO = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:end_portal_frame", "minecraft:reinforced_deepslate"]);
function quebrarJunto(j: Player, b0: Block, ids: (id: string) => boolean, max: number, joules: number): void {
  const dim = b0.dimension, alvo = b0.typeId;
  const vistos = new Set([`${b0.x},${b0.y},${b0.z}`]);
  const fila: Vector3[] = [{ x: b0.x, y: b0.y, z: b0.z }];
  const achados: Vector3[] = [];
  while (fila.length && achados.length < max) {
    const p = fila.shift()!;
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const q = { x: p.x + dx, y: p.y + dy, z: p.z + dz }, k = `${q.x},${q.y},${q.z}`;
          if (vistos.has(k)) continue;
          vistos.add(k);
          let id = "";
          try {
            id = dim.getBlock(q)?.typeId ?? "";
          } catch {
            continue;
          }
          if (id !== alvo || !ids(id)) continue;
          fila.push(q);
          achados.push(q);
          if (achados.length >= max) break;
        }
  }
  system.run(() => {
    for (const q of achados) {
      if (!gastar(j, EquipmentSlot.Mainhand, joules)) break;
      dim.runCommand(`setblock ${q.x} ${q.y} ${q.z} air destroy`);
    }
  });
}
function explosao(j: Player, b: Block, raio: number, joules: number): void {
  const v = j.getViewDirection();
  const eixo = Math.abs(v.y) > 0.7 ? "y" : Math.abs(v.x) > Math.abs(v.z) ? "x" : "z";
  const dim = b.dimension, lista: Vector3[] = [];
  for (let a = -raio; a <= raio; a++)
    for (let c = -raio; c <= raio; c++) {
      if (!a && !c) continue;
      const p = eixo === "y" ? { x: b.x + a, y: b.y, z: b.z + c } : eixo === "x" ? { x: b.x, y: b.y + a, z: b.z + c } : { x: b.x + a, y: b.y + c, z: b.z };
      lista.push(p);
    }
  system.run(() => {
    for (const p of lista) {
      let id = "";
      try {
        id = dim.getBlock(p)?.typeId ?? "";
      } catch {
        continue;
      }
      if (!id || id === "minecraft:air" || NAO.has(id) || id.includes("water") || id.includes("lava")) continue;
      if (!gastar(j, EquipmentSlot.Mainhand, joules)) break;
      dim.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
    }
  });
}
const MODOS_DESM = ["normal", "veio", "veio_estendido"] as const;
const modoDe = (i: ItemStack) => (i.getDynamicProperty("mk_modo") as string | undefined) ?? "normal";

// ---------- Combate ----------
function golpe(j: Player, alvo: { applyDamage: (n: number, o: { cause: EntityDamageCause; damagingEntity: Player }) => boolean }): void {
  const i = naMao(j);
  if (!i) return;
  if (i.typeId === META) {
    const n = modsDe(i).ataque ?? 0;
    if (!n || !gastar(j, EquipmentSlot.Mainhand, (G.MEKA_TOOL_ENERGY_USAGE_WEAPON ?? 2000) * (n + 1))) return;
    try {
      alvo.applyDamage(n * 4, { cause: EntityDamageCause.entityAttack, damagingEntity: j });
    } catch {
      // já morreu
    }
  } else if (i.typeId === DESM) gastar(j, EquipmentSlot.Mainhand, G.DISASSEMBLER_ENERGY_USAGE_WEAPON ?? 2000);
}

// ---------- Arco, Lança-Chamas, Mergulho, Cantil ----------
function arco(j: Player, i: ItemStack): void {
  const fogo = (i.getDynamicProperty("mk_modo") as string | undefined) === "fogo";
  if (!gastar(j, EquipmentSlot.Mainhand, (G.BOW_ENERGY_USAGE ?? 120) + (fogo ? G.BOW_ENERGY_USAGE_FLAME ?? 1200 : 0))) return aviso(j, { translate: "cl.mke.sem_energia", with: { rawtext: [nomeDe(i.typeId)] } }, 3);
  const v = j.getViewDirection();
  const o = j.getHeadLocation();
  const a = j.dimension.spawnEntity("minecraft:arrow", { x: o.x + v.x, y: o.y + v.y, z: o.z + v.z });
  const proj = a.getComponent("minecraft:projectile");
  if (proj) {
    proj.owner = j;
    proj.shoot({ x: v.x * 3, y: v.y * 3, z: v.z * 3 });
  } else a.applyImpulse({ x: v.x * 3, y: v.y * 3, z: v.z * 3 });
  if (fogo) a.setOnFire(100, true);
  j.playSound("random.bow", { volume: 0.7 });
}
const encher = (j: Player, de: string, volta: string, prop: string, max: number, i: ItemStack, slot: EquipmentSlot): number => {
  const inv = j.getComponent("minecraft:inventory")?.container;
  let tem = (i.getDynamicProperty(prop) as number | undefined) ?? 0;
  for (let s = 0; inv && s < inv.size && tem + 1000 <= max; s++) {
    const it = inv.getItem(s);
    if (it?.typeId !== de) continue;
    const n = Math.min(it.amount, Math.floor((max - tem) / 1000));
    tem += n * 1000;
    if (it.amount > n) (it.amount -= n, inv.setItem(s, it));
    else inv.setItem(s, undefined);
    const sobra = inv.addItem(new ItemStack(volta, n));
    if (sobra) j.dimension.spawnItem(sobra, j.location);
  }
  i.setDynamicProperty(prop, tem);
  j.getComponent("minecraft:equippable")?.setEquipment(slot, i);
  return tem;
};
const MODOS_LANCA = ["combate", "calor", "inferno"] as const;
function lancaChamas(j: Player, i: ItemStack): void {
  if (j.isSneaking) {
    const h = encher(j, "cl:cilindro_hidrogenio", "cl:cilindro_vazio", "mk_h2", 24000, i, EquipmentSlot.Mainhand);
    return aviso(j, { translate: "cl.mke.hidrogenio", with: [h.toLocaleString("pt-BR")] }, 3);
  }
  const h = (i.getDynamicProperty("mk_h2") as number | undefined) ?? 0;
  if (h < 20 && !criativo(j)) return aviso(j, { translate: "cl.mke.hidrogenio", with: [String(h)] }, 3);
  if (!criativo(j)) {
    i.setDynamicProperty("mk_h2", h - 20);
    j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
  }
  const modo = (i.getDynamicProperty("mk_modo") as string | undefined) ?? "combate";
  const o = j.getHeadLocation(), v = j.getViewDirection();
  for (let k = 1; k <= 6; k++) j.dimension.spawnParticle("minecraft:basic_flame_particle", { x: o.x + v.x * k, y: o.y + v.y * k, z: o.z + v.z * k });
  for (const hit of j.getEntitiesFromViewDirection({ maxDistance: 6 })) {
    hit.entity.setOnFire(5, true);
    try {
      hit.entity.applyDamage(4, { cause: EntityDamageCause.fire, damagingEntity: j });
    } catch {
      // sem vida
    }
  }
  const alvo = j.getBlockFromViewDirection({ maxDistance: 6 });
  if (!alvo) return;
  if (modo === "calor") {
    const sai = (THERMAL.fornalha as Record<string, string>)[alvo.block.typeId];
    if (sai) {
      alvo.block.setType("minecraft:air");
      j.dimension.spawnItem(new ItemStack(sai, 1), alvo.block.center());
    }
  } else if (modo === "inferno") {
    try {
      const cima = alvo.block.above();
      if (cima?.isAir) cima.setType("minecraft:fire");
    } catch {
      // fora do mundo
    }
  }
}
function cantil(j: Player, i: ItemStack): void {
  if (j.isSneaking) {
    const p = encher(j, "cl:balde_pasta_nutritiva", "minecraft:bucket", "mk_pasta", 64000, i, EquipmentSlot.Mainhand);
    return aviso(j, { translate: "cl.mke.cantil", with: [p.toLocaleString("pt-BR")] }, 3);
  }
  const fome = j.getComponent("minecraft:player.hunger");
  let p = (i.getDynamicProperty("mk_pasta") as number | undefined) ?? 0;
  if (!fome) return;
  let n = 0;
  while (fome.currentValue + n < fome.effectiveMax && p >= 50) (p -= 50), n++;
  if (!n) return aviso(j, { translate: "cl.mke.cantil", with: [p.toLocaleString("pt-BR")] }, 3);
  fome.setCurrentValue(fome.currentValue + n);
  i.setDynamicProperty("mk_pasta", p);
  j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
  j.playSound("random.drink", { volume: 0.6 });
}

// ---------- Caixa de Papelão ----------
const CAIXA = "cl:caixa_papelao";
const NAO_CAIXA = new Set([...NAO, "minecraft:air", CAIXA, "minecraft:water", "minecraft:lava"]);
function encaixotar(j: Player, b: Block): void {
  if (NAO_CAIXA.has(b.typeId) || b.typeId.startsWith("minecraft:") === false && /reator|turbina|fissao|fusao|inducao/.test(b.typeId)) return aviso(j, "cl.mke.caixa_nao", 3);
  const nome = `cl:cx${system.currentTick}_${Math.floor(Math.random() * 1e6)}`;
  const tipo = b.typeId;
  try {
    world.structureManager.createFromWorld(nome, b.dimension, b.location, b.location, { saveMode: StructureSaveMode.World, includeEntities: false, includeBlocks: true });
  } catch {
    return aviso(j, "cl.mke.caixa_nao", 3);
  }
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  if (!inv || mao?.typeId !== CAIXA) return;
  // Esvazia antes de tirar (o conteúdo vai junto na estrutura, não no chão).
  try {
    (b.getComponent("minecraft:inventory")?.container as Container | undefined)?.clearAll();
  } catch {
    // sem inventário
  }
  b.setType("minecraft:air");
  if (mao.amount > 1) (mao.amount--, inv.setItem(j.selectedSlotIndex, mao));
  else inv.setItem(j.selectedSlotIndex, undefined);
  const cheia = new ItemStack(CAIXA, 1);
  cheia.setDynamicProperty("mk_caixa", nome);
  cheia.setLore([`§7${tipo}`]);
  const sobra = inv.addItem(cheia);
  if (sobra) j.dimension.spawnItem(sobra, j.location);
  aviso(j, { translate: "cl.mke.caixa_cheia", with: { rawtext: [nomeDe(tipo)] } }, 3);
}
const caixaPendente = new Map<string, { nome: string; tick: number }>();

// ---------- MekaSuit: o que roda a cada segundo ----------
const peca = (j: Player, slot: EquipmentSlot) => j.getComponent("minecraft:equippable")?.getEquipment(slot);
const RUINS = ["poison", "wither", "nausea", "hunger", "slowness", "weakness", "blindness", "mining_fatigue", "darkness"];
function suitTick(j: Player, passo: number): void {
  const cab = peca(j, EquipmentSlot.Head), pei = peca(j, EquipmentSlot.Chest), cal = peca(j, EquipmentSlot.Legs), bot = peca(j, EquipmentSlot.Feet);
  const mc = cab?.typeId === CAB ? modsDe(cab) : {}, mp = pei?.typeId === PEI ? modsDe(pei) : {};
  const ml = cal?.typeId === CAL ? modsDe(cal) : {}, mb = bot?.typeId === BOT ? modsDe(bot) : {};
  if (cab?.typeId === CAB && pei?.typeId === PEI && cal?.typeId === CAL && bot?.typeId === BOT && passo % 5 === 0) registrarAcao(j, "mk_mekasuit");
  const efeito = (nome: string, amp: number, slot: EquipmentSlot, joules: number) => {
    if (gastar(j, slot, joules)) j.addEffect(nome, nome === "night_vision" ? 400 : 40, { amplifier: amp, showParticles: false });
  };
  if (mc.visao) efeito("night_vision", 0, EquipmentSlot.Head, (G.MEKA_SUIT_ENERGY_USAGE_VISION ?? 500) * 20);
  if (mc.respiracao && j.isInWater) efeito("water_breathing", 0, EquipmentSlot.Head, 200);
  if (mc.purificacao)
    for (const e of RUINS)
      if (j.getEffect(e) && gastar(j, EquipmentSlot.Head, G.MEKA_SUIT_ENERGY_USAGE_POTION ?? 40000)) j.removeEffect(e);
  if (mc.nutricao) {
    const fome = j.getComponent("minecraft:player.hunger");
    if (fome && fome.currentValue < fome.effectiveMax - 1 && gastar(j, EquipmentSlot.Head, G.MEKA_SUIT_ENERGY_USAGE_FOOD ?? 20000)) fome.setCurrentValue(fome.currentValue + 1);
  }
  if (mc.solar && cab && world.getTimeOfDay() < 12500) {
    try {
      const topo = j.dimension.getTopmostBlock({ x: j.location.x, z: j.location.z });
      if (!topo || topo.y <= j.location.y) somar(j, EquipmentSlot.Head, (G.MEKA_SUIT_CHARGE_RATE_SOLAR ?? 500) * 20 * mc.solar);
    } catch {
      // fora do mundo
    }
  }
  if ((mc.dosimetro || mc.geiger) && passo % 10 === 0) {
    const n = nivelEm(j.dimension, j.location);
    if (n > 0.00001) aviso(j, { translate: "cl.mkn.geiger", with: [`${formatarSv(n)}/h · ${formatarSv(doseDe(j))}`] }, 3);
  }
  if (mp.elitro && !j.isOnGround && !j.isJumping && j.getVelocity().y < -0.4) efeito("slow_falling", 0, EquipmentSlot.Chest, (G.MEKA_SUIT_ENERGY_USAGE_ELYTRA ?? 32000) / 20);
  if (mp.distribuicao && pei) {
    const inv = j.getComponent("minecraft:inventory")?.container;
    let orc = RF((G.MEKA_SUIT_CHARGE_RATE_INVENTORY ?? 10000) * 20);
    for (let s = 0; inv && s < inv.size && orc > 0; s++) {
      const it = inv.getItem(s);
      const cap = it ? capacidadeDaPilha(it) : undefined;
      if (!it || !cap || cargaItem(it) >= cap) continue;
      const n = Math.min(orc, cap - cargaItem(it));
      if (!gastar(j, EquipmentSlot.Chest, n / 0.4)) break;
      definirCarga(it, cargaItem(it) + n);
      inv.setItem(s, it);
      orc -= n;
    }
  }
  if (ml.locomocao && j.isSprinting) efeito("speed", ml.locomocao - 1, EquipmentSlot.Legs, (G.MEKA_SUIT_ENERGY_USAGE_SPRINT ?? 100) * 20 * ml.locomocao);
  if (ml.giroscopio && j.isInWater) efeito("conduit_power", 0, EquipmentSlot.Legs, 200);
  if (ml.geotermico) {
    try {
      const pe = j.dimension.getBlock(j.location);
      if (pe?.typeId.includes("lava")) {
        somar(j, EquipmentSlot.Legs, 10000 * 20 * ml.geotermico);
        j.addEffect("fire_resistance", 40, { showParticles: false });
      }
    } catch {
      // fora do mundo
    }
  }
  if (mb.propulsao) efeito("jump_boost", mb.propulsao - 1, EquipmentSlot.Feet, 0);
  if (mb.hidrostatico && j.isInWater) efeito("dolphins_grace", 0, EquipmentSlot.Feet, (G.MEKA_SUIT_ENERGY_USAGE_SWIM ?? 500) * 20);
  if (mb.almas) {
    try {
      const baixo = j.dimension.getBlock({ x: j.location.x, y: j.location.y - 0.5, z: j.location.z })?.typeId ?? "";
      if (baixo.includes("soul")) efeito("speed", 1, EquipmentSlot.Feet, 100);
    } catch {
      // fora do mundo
    }
  }
  if (mb.magnetico) {
    const raio = 4 * mb.magnetico;
    for (const e of j.dimension.getEntities({ location: j.location, maxDistance: raio, type: "minecraft:item" })) {
      if (!gastar(j, EquipmentSlot.Feet, G.MEKA_SUIT_ENERGY_USAGE_MAGNET ?? 250)) break;
      e.teleport(j.location);
    }
  }
}
// Jetpack da MekaSuit (e a Modulação Gravitacional, que paira): a cada 2 tiques para quem tem.
const voadores = new Set<string>();
function jatoTick(j: Player): void {
  const pei = peca(j, EquipmentSlot.Chest);
  const m = pei?.typeId === PEI ? modsDe(pei) : {};
  if (!m.jetpack && !m.gravitacional) return void voadores.delete(j.id);
  const v = j.getVelocity();
  if (j.isJumping) {
    if (!gastar(j, EquipmentSlot.Chest, m.gravitacional ? 2000 : 1000)) return;
    j.applyKnockback({ x: v.x * (m.gravitacional ? 1.6 : 1.2), z: v.z * (m.gravitacional ? 1.6 : 1.2) }, m.gravitacional ? 0.45 : 0.35);
  } else if (!j.isOnGround && m.gravitacional && !j.isSneaking) {
    j.applyKnockback({ x: v.x * 1.4, z: v.z * 1.4 }, 0.02); // paira
  }
}

export function registrarEquipamentos(): void {
  registrarItemComEnergia(META, capMeka);
  for (const id of T) registrarItemComEnergia(id, (i) => RF((G.MEKA_SUIT_CAPACITY ?? 16000000) * Math.pow(2, modsDe(i).energia ?? 0)));
  registrarItemComEnergia(DESM, RF(G.DISASSEMBLER_MAX_ENERGY ?? 1000000));
  registrarItemComEnergia("cl:arco_eletrico", RF(G.BOW_MAX_ENERGY ?? 120000));
  registrarItemComEnergia("cl:corredores_livres", RF(G.FREE_RUNNERS_MAX_ENERGY ?? 64000));
  registrarItemComEnergia("cl:corredores_livres_blindados", RF(G.FREE_RUNNERS_MAX_ENERGY ?? 64000));
  registrarItemComEnergia("cl:leitor_rede", RF(G.NETWORK_READER_MAX_ENERGY ?? 60000));
  // Blindagem contra radiação nas peças da MekaSuit (como a roupa Hazmat: 25% por peça).
  registrarProtecao((j) => {
    let p = 0;
    for (const [id, slot] of Object.entries(SUIT)) {
      const i = peca(j, slot);
      if (i?.typeId === id && modsDe(i).blindagem) p += 0.25;
    }
    return p;
  });
  // Quebrar: energia, veio, explosão (Meka-Tool) e os modos do Desintegrador.
  world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    const i = ev.itemStack, j = ev.player, b = ev.block;
    if (!i || (i.typeId !== META && i.typeId !== DESM)) return;
    const m = i.typeId === META ? modsDe(i) : {};
    const joules = (i.typeId === META ? G.MEKA_TOOL_ENERGY_USAGE_BASE ?? 10 : G.DISASSEMBLER_ENERGY_USAGE ?? 10) * (m.suave ? 10 : 1) * 2;
    if (!criativo(j) && cargaItem(i) < RF(joules)) {
      ev.cancel = true;
      system.run(() => aviso(j, { translate: "cl.mke.sem_energia", with: { rawtext: [nomeDe(i.typeId)] } }, 3));
      return;
    }
    const tipo = b.typeId, onde = { x: b.x, y: b.y, z: b.z }, dim = b.dimension;
    system.run(() => {
      gastar(j, EquipmentSlot.Mainhand, joules);
      const fake = { typeId: tipo, ...onde, dimension: dim } as unknown as Block;
      if (i.typeId === META) {
        if (m.veio && (ehMinerio(tipo) || ehTora(tipo))) quebrarJunto(j, fake, () => true, Math.pow(2, m.veio + 2), joules);
        if (m.explosao) explosao(j, fake, m.explosao, joules);
      } else {
        const modo = modoDe(i);
        if (modo === "veio" && (ehMinerio(tipo) || ehTora(tipo))) quebrarJunto(j, fake, () => true, 128, joules);
        if (modo === "veio_estendido") quebrarJunto(j, fake, () => true, 128, joules);
      }
    });
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: j, hitEntity }) => {
    if (j instanceof Player) golpe(j, hitEntity as never);
  });
  // Usar itens.
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    switch (i.typeId) {
      case DESM:
        if (j.isSneaking) {
          const novo = MODOS_DESM[(MODOS_DESM.indexOf(modoDe(i) as never) + 1) % MODOS_DESM.length];
          i.setDynamicProperty("mk_modo", novo);
          j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
          aviso(j, { translate: "cl.mke.modo", with: { rawtext: [nomeDe(i.typeId), { translate: `cl.mke.modo.${novo}` }] } }, 3);
        }
        return;
      case META: {
        const m = modsDe(i);
        if (!m.teleporte) return;
        const alvo = j.getBlockFromViewDirection({ maxDistance: 100 });
        if (!alvo) return aviso(j, "cl.mke.teleporte_longe", 3);
        const d = Math.hypot(alvo.block.x - j.location.x, alvo.block.y - j.location.y, alvo.block.z - j.location.z);
        if (!gastar(j, EquipmentSlot.Mainhand, (G.MEKA_TOOL_ENERGY_USAGE_TELEPORT ?? 1000) * d))
          return aviso(j, { translate: "cl.mke.sem_energia", with: { rawtext: [nomeDe(i.typeId)] } }, 3);
        j.teleport({ x: alvo.block.x + 0.5, y: alvo.block.y + 1, z: alvo.block.z + 0.5 });
        j.playSound("mob.endermen.portal", { volume: 0.6 });
        return;
      }
      case "cl:arco_eletrico":
        if (j.isSneaking) {
          const novo = (i.getDynamicProperty("mk_modo") as string | undefined) === "fogo" ? "normal" : "fogo";
          i.setDynamicProperty("mk_modo", novo);
          j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
          return aviso(j, { translate: "cl.mke.modo", with: { rawtext: [nomeDe(i.typeId), { translate: `cl.mke.modo.${novo === "fogo" ? "fogo" : "normal"}` }] } }, 3);
        }
        return arco(j, i);
      case "cl:lanca_chamas":
        if (j.isSneaking && !j.getComponent("minecraft:inventory")?.container?.find(new ItemStack("cl:cilindro_hidrogenio", 1))) {
          const atual = (i.getDynamicProperty("mk_modo") as string | undefined) ?? "combate";
          const novo = MODOS_LANCA[(MODOS_LANCA.indexOf(atual as never) + 1) % MODOS_LANCA.length];
          i.setDynamicProperty("mk_modo", novo);
          j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
          return aviso(j, { translate: "cl.mke.modo", with: { rawtext: [nomeDe(i.typeId), { translate: `cl.mke.modo.${novo}` }] } }, 3);
        }
        return lancaChamas(j, i);
      case "cl:tanque_mergulho":
        if (j.isSneaking) {
          const o = encher(j, "cl:cilindro_oxigenio", "cl:cilindro_vazio", "mk_o2", 24000, i, EquipmentSlot.Mainhand);
          aviso(j, { translate: "cl.mke.oxigenio", with: [o.toLocaleString("pt-BR")] }, 3);
        }
        return;
      case "cl:cantil":
        return cantil(j, i);
    }
  });
  // Usar em blocos: configurador, leitor de rede, dicionário, conta-gotas, cultivo da Meka-Tool, caixa de papelão.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const i = ev.itemStack, j = ev.player, b = ev.block;
    if (!i || !ev.isFirstEvent) return;
    if (i.typeId === CAIXA) {
      const nome = i.getDynamicProperty("mk_caixa") as string | undefined;
      if (nome) caixaPendente.set(j.id, { nome, tick: system.currentTick });
      else if (j.isSneaking) {
        ev.cancel = true;
        system.run(() => encaixotar(j, b));
      }
      return;
    }
    const ferramentas = ["cl:configurador", "cl:leitor_rede", "cl:dicionario", "cl:conta_gotas"];
    const cultivo = i.typeId === META && (modsDe(i).cultivo ?? 0) > 0 && ["minecraft:dirt", "minecraft:grass_block", "minecraft:coarse_dirt"].includes(b.typeId);
    if (!ferramentas.includes(i.typeId) && !cultivo) return;
    ev.cancel = true;
    system.run(() => {
      if (!b.isValid) return;
      if (cultivo) {
        const n = modsDe(i).cultivo ?? 1;
        for (let dx = -(n - 1); dx <= n - 1; dx++)
          for (let dz = -(n - 1); dz <= n - 1; dz++) {
            try {
              const x = b.offset({ x: dx, y: 0, z: dz });
              if (x && ["minecraft:dirt", "minecraft:grass_block", "minecraft:coarse_dirt"].includes(x.typeId) && x.above()?.isAir && gastar(j, EquipmentSlot.Mainhand, G.MEKA_TOOL_HOE ?? 10))
                x.setType("minecraft:farmland");
            } catch {
              // fora do mundo
            }
          }
        return;
      }
      if (i.typeId === "cl:configurador") {
        const ordem = ["north", "east", "south", "west"];
        try {
          const d = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string;
          b.setPermutation(b.permutation.withState("minecraft:cardinal_direction" as never, ordem[(ordem.indexOf(d) + 1) % 4] as never));
          aviso(j, "cl.mke.configurador", 2);
        } catch {
          // não gira
        }
      } else if (i.typeId === "cl:leitor_rede") {
        if (!gastar(j, EquipmentSlot.Mainhand, G.NETWORK_READER_ENERGY_USAGE ?? 400)) return aviso(j, { translate: "cl.mke.sem_energia", with: { rawtext: [nomeDe(i.typeId)] } }, 3);
        const guardas = coletarNaRede(b, (x) => capacidadeDe(x) > 0, 256, 1024);
        const total = guardas.reduce((s, x) => s + cargaDe(x), 0);
        aviso(j, { translate: "cl.mke.rede", with: ["—", String(guardas.length), `${Math.round(total).toLocaleString("pt-BR")} E`] }, 5);
      } else if (i.typeId === "cl:dicionario") {
        const tags = b.getTags();
        aviso(j, tags.length ? { translate: "cl.mke.tags", with: { rawtext: [nomeDe(b.typeId), { text: tags.join(", ") }] } } : "cl.mke.sem_tags", 6);
      } else if (i.typeId === "cl:conta_gotas") {
        const p = pontaDe(b);
        if (!p) return;
        const tem = p.oferece();
        if (j.isSneaking) {
          for (const [q, mb] of tem) p.mexer(q, -mb);
          p.gravar();
          return aviso(j, "cl.mke.esvaziou", 2);
        }
        const msg: RawMessage = tem.length ? { rawtext: tem.flatMap(([q, mb], x) => [{ text: `${x ? ", " : ""}${mb.toLocaleString("pt-BR")} mB ` }, nomeQuimico(q)]) } : { translate: "cl.mkq.vazio" };
        aviso(j, { translate: "cl.mke.conta_gotas", with: { rawtext: [msg] } }, 5);
      }
    });
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId !== CAIXA) return;
    const p = caixaPendente.get(player.id);
    caixaPendente.delete(player.id);
    if (!p || system.currentTick - p.tick > 3) return;
    const dim = block.dimension, onde = block.location;
    system.run(() => {
      try {
        world.structureManager.place(p.nome, dim, onde);
        world.structureManager.delete(p.nome);
      } catch {
        // estrutura perdida
      }
    });
  });
  // Dano: a MekaSuit absorve (energia) e os Corredores e a MekaSuit seguram a queda.
  world.beforeEvents.entityHurt.subscribe(
    (ev) => {
      const j = ev.hurtEntity as Player;
      const eq = j.getComponent("minecraft:equippable");
      if (!eq) return;
      const queda = ev.damageSource.cause === EntityDamageCause.fall;
      const bot = eq.getEquipment(EquipmentSlot.Feet);
      if (queda && bot && (bot.typeId === "cl:corredores_livres" || bot.typeId === "cl:corredores_livres_blindados" || bot.typeId === BOT)) {
        const custo = RF((G.FREE_RUNNERS_FALL_COST ?? 50) * ev.damage);
        if (cargaItem(bot) >= custo || j.getGameMode() === GameMode.Creative) {
          ev.cancel = true;
          system.run(() => gastar(j, EquipmentSlot.Feet, (G.FREE_RUNNERS_FALL_COST ?? 50) * ev.damage));
          return;
        }
      }
      let corta = 0;
      const gasto: Array<[EquipmentSlot, number]> = [];
      for (const [id, slot] of Object.entries(SUIT)) {
        const i = eq.getEquipment(slot);
        if (i?.typeId !== id) continue;
        const parte = ev.damage * ABSORVE[id];
        const joules = parte * (G.MEKA_SUIT_ENERGY_USAGE_DAMAGE ?? 100000);
        if (cargaItem(i) < RF(joules)) continue;
        corta += parte;
        gasto.push([slot, joules]);
      }
      if (!corta) return;
      ev.damage = Math.max(0, ev.damage - corta);
      if (ev.damage <= 0.01) ev.cancel = true;
      system.run(() => {
        for (const [slot, joules] of gasto) gastar(j, slot, joules);
      });
    },
    { entityFilter: { type: "minecraft:player" } },
  );
  // A cada segundo: MekaSuit, Meka-Tool na mão (escavação), mergulho; a cada 2 tiques: jatos.
  let passo = 0;
  system.runInterval(() => {
    passo++;
    for (const j of world.getAllPlayers()) {
      const eq = j.getComponent("minecraft:equippable");
      if (!eq) continue;
      try {
        const mao = eq.getEquipment(EquipmentSlot.Mainhand);
        if (mao?.typeId === META && (modsDe(mao).escavacao ?? 0) > 0) j.addEffect("haste", 40, { amplifier: modsDe(mao).escavacao - 1, showParticles: false });
        const pei = eq.getEquipment(EquipmentSlot.Chest);
        if (Object.values(SUIT).some((s) => SUIT[eq.getEquipment(s)?.typeId ?? ""] === s)) suitTick(j, passo);
        if (pei?.typeId === PEI && (modsDe(pei).jetpack || modsDe(pei).gravitacional)) voadores.add(j.id);
        // Mergulho: máscara + tanque com oxigênio, 1 mB por tique na água.
        if (j.isInWater && eq.getEquipment(EquipmentSlot.Head)?.typeId === "cl:mascara_mergulho" && pei?.typeId === "cl:tanque_mergulho") {
          const o = (pei.getDynamicProperty("mk_o2") as number | undefined) ?? 0;
          if (o >= 20) {
            pei.setDynamicProperty("mk_o2", o - 20);
            eq.setEquipment(EquipmentSlot.Chest, pei);
            j.addEffect("water_breathing", 40, { showParticles: false });
          }
        }
      } catch {
        // jogador saindo
      }
    }
  }, 20);
  system.runInterval(() => {
    if (!voadores.size) return;
    for (const j of world.getAllPlayers())
      if (voadores.has(j.id))
        try {
          jatoTick(j);
        } catch {
          // jogador saindo
        }
  }, 2);
  // Teste: scriptevent cl:teste_equip <mod <item do módulo>|carregar|ver>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_equip" || !(j instanceof Player)) return;
    const [acao, arg] = message.split(" ");
    const eq = j.getComponent("minecraft:equippable");
    const i = eq?.getEquipment(EquipmentSlot.Mainhand);
    if (!eq || !i) return;
    if (acao === "mod" && MODULOS[arg]) {
      const m = modsDe(i);
      m[MODULOS[arg][0]] = (m[MODULOS[arg][0]] ?? 0) + 1;
      gravarMods(i, m);
    }
    if (acao === "carregar") definirCarga(i, capacidadeDaPilha(i) ?? 0);
    eq.setEquipment(EquipmentSlot.Mainhand, i);
    console.warn(`[teste_equip] ${i.typeId} carga=${cargaItem(i)} cap=${capacidadeDaPilha(i)} mods=${JSON.stringify(modsDe(i))}`);
  });
}

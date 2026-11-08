import {
  Block, BlockCustomComponent, Container, Entity, EntityInitializationCause, EquipmentSlot, GameMode, ItemStack, Player, system, Vector3, WeatherType, world,
} from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F40 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { lerEstado } from "../util/blocos.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { maoDe } from "../util/jogadores.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, saida, tirar } from "../util/maquina.js";
import { intervalo } from "../util/perfil.js";
import { adubar, bloco, madura, quebrar, recolher, SEMENTES } from "./mfr.js";
import { gerador } from "./mekanism_extra.js";
import { feito, maquina } from "./thermal.js";

/*
 * Ender IO 9 (1.20.0): as máquinas e os itens que o Ender IO mais novo tem e o pack ainda não tinha. Receitas e
 * números em DADOS_F40 (tools/dados/conteudo/enderio.json, do código do mod). Como as outras máquinas do pack: o
 * baú de cima é a entrada, o de baixo a saída, a energia vem da rede (1 cE = 40 RF) e o ciclo é de 5 s.
 * Onde o mod guarda a alma dentro do item (Motor de Almas, Gerador Energizado), aqui se toca a máquina colocada com
 * o Frasco de Alma: o Bedrock não passa dados de item para bloco pela receita.
 * Fluidos viram baldes de 1.000 mB (o Bedrock não tem fluido de add-on).
 */
type Ing = string | readonly string[];
type Alma = { entra: string; alma: string; sai: readonly [string, number]; ce: number; xp: number };
type Cuba = { entra: string; mb: number; r1: { ids: string[]; mult: Record<string, number> }; r2: { ids: string[]; mult: Record<string, number> }; sai: string; mbSai: number };
type Tanque = { modo: "encher" | "esvaziar"; entra: string; sai: string; fluido: string; mb: number };
type Fogo = { bases: string[]; vira: string | null; sai: string; chance: number; min: number; max: number };
const D = DADOS_F40 as unknown as {
  fatiar: { entra: string[]; sai: [string, number]; ce: number }[];
  almas: Alma[];
  cuba: Cuba[];
  tanque: Tanque[];
  fogo: Fogo[];
  clima: Record<string, "clear" | "rain" | "lightning">;
  motor: Record<string, { fluido: string; rfPorMb: number; ticksPorMb: number }>;
  gerador: { quantidade: number; maxPerto: number; custoPadrao: number; custo: Record<string, number> };
  obeliscos: { atracao: number; inibicao: number; aversao: number; relocacao: number };
  viagem: { pulo: number; ateBloco: number; rfPorUso: number; capacidade: number };
  levitacao: { rfPorTick: number; capacidade: number };
  eletroima: { rfPorTick: number; capacidade: number; alcance: number; maxItens: number };
  enderios: { chance: number; alcance: number };
  graoFogo: { idadeMinima: number };
  cabecaChance: number;
  usoCE: Record<string, number>;
  carregador: { fioPorCiclo: number; semFioPorCiclo: number; alcance: number };
};
const NS = "cl";
const opcoes = (i: Ing): readonly string[] => (typeof i === "string" ? [i] : i);
const nomeEntidade = (id: string) => ({ translate: `entity.${id.startsWith("minecraft:") ? id.slice(10) : id}.name` });
const BALDE = "minecraft:bucket";
const vazioAcima = (b: Block) => entrada(b);

// ---------- Itens com energia (cajados, Eletroímã): RF no item, com a carga na descrição ----------
const CAPACIDADE: Record<string, number> = {
  [`${NS}:cajado_viagem`]: D.viagem.capacidade, [`${NS}:cajado_levitacao`]: D.levitacao.capacidade, [`${NS}:eletroima`]: D.eletroima.capacidade,
};
/** 1.33.0: outros itens com RF (os jetpacks) carregam nos mesmos carregadores. */
export function registrarItemComEnergia(id: string, capacidade: number): void {
  CAPACIDADE[id] = capacidade;
}
export const capacidadeItem = (id: string): number | undefined => CAPACIDADE[id];
const PROP_RF = "eio_rf";
export const cargaItem = (i: ItemStack): number => (i.getDynamicProperty(PROP_RF) as number | undefined) ?? 0;
export function definirCarga(i: ItemStack, v: number): void {
  const cap = CAPACIDADE[i.typeId] ?? 0;
  i.setDynamicProperty(PROP_RF, Math.max(0, Math.min(cap, Math.round(v))));
  i.setLore([`§7${cargaItem(i).toLocaleString("pt-BR")} / ${cap.toLocaleString("pt-BR")} RF`]);
}
/** Gasta RF do item na mão do jogador (devolve se deu). */
function gastarDaMaoRF(j: Player, item: ItemStack, quanto: number): boolean {
  if (j.getGameMode() === GameMode.Creative) return true;
  const tem = cargaItem(item);
  if (tem < quanto) return false;
  definirCarga(item, tem - quanto);
  j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, item);
  return true;
}

// ---------- Fatiar e Emendar ----------
export const fatiar = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  for (const r of D.fatiar) {
    const precisa = new Map<string, number>();
    for (const id of r.entra) precisa.set(id, (precisa.get(id) ?? 0) + 1);
    if ([...precisa].some(([id, n]) => contar(ent, id) < n)) continue;
    if (!gastarCE(b, r.ce)) return "sem_energia";
    for (const [id, n] of precisa) tirar(ent, id, n);
    entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
    feito(b, "random.anvil_use");
    const j = perto(b, 16);
    if (j) registrarAcao(j, "fatiar");
    return "ok";
  }
  return "parada";
}, "cl.eio9.fatiar");
const perto = (b: Block, d: number): Player | undefined => b.dimension.getPlayers({ location: b.center(), maxDistance: d, closest: 1 })[0];

// ---------- Frasco de Alma ----------
const PROP_ALMA = "alma";
const PROP_MONSTRO = "alma_m";
const NAO_CABE = new Set(["minecraft:player", "minecraft:ender_dragon", "minecraft:wither", "minecraft:warden", "minecraft:elder_guardian", "cl:ceu_lua"]);
/** As almas guardadas num baú: [slot, entidade, é monstro]. */
function frascos(c: Container): { slot: number; alma: string; monstro: boolean }[] {
  const r: { slot: number; alma: string; monstro: boolean }[] = [];
  for (let s = 0; s < c.size; s++) {
    const p = c.getItem(s);
    if (p?.typeId !== `${NS}:frasco_alma_cheio` && p?.typeId !== `${NS}:gerador_quebrado`) continue;
    const alma = p.getDynamicProperty(PROP_ALMA) as string | undefined;
    if (alma && p.typeId === `${NS}:frasco_alma_cheio`) r.push({ slot: s, alma, monstro: !!p.getDynamicProperty(PROP_MONSTRO) });
  }
  return r;
}
function frascoCheio(alma: string, monstro: boolean): ItemStack {
  const f = new ItemStack(`${NS}:frasco_alma_cheio`, 1);
  f.setDynamicProperty(PROP_ALMA, alma);
  f.setDynamicProperty(PROP_MONSTRO, monstro);
  f.setLore([`§7${alma.replace("minecraft:", "")}`]);
  return f;
}
const ehMonstro = (e: Entity): boolean => !!e.getComponent("minecraft:type_family")?.hasTypeFamily("monster");
function capturar(j: Player, alvo: Entity): void {
  if (!alvo.isValid) return;
  const id = alvo.typeId;
  if (NAO_CABE.has(id) || !alvo.getComponent("minecraft:health")) return aviso(j, "cl.eio9.frasco_nao", 3);
  const cheio = frascoCheio(id, ehMonstro(alvo));
  if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
  darAoJogador(j, cheio);
  alvo.remove();
  j.playSound("mob.endermen.portal");
  aviso(j, { translate: "cl.eio9.frasco_pegou", with: { rawtext: [nomeEntidade(id)] } }, 3);
  registrarAcao(j, "frasco_alma");
}

// ---------- Vinculador de Almas ----------
// As receitas que no mod põem a alma num bloco (motor, gerador, módulo, estação) aqui são o toque com o frasco.
const ALMAS = D.almas.filter((a) => !["solar", "fazenda", "motor", "gerador"].includes(a.alma));
const almaServe = (a: Alma, alma: string, monstro: boolean) =>
  a.alma === "qualquer" || a.alma === alma || (a.alma === "monstro" && monstro) || (a.alma === "animal" && !monstro);
export const vinculador = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const fs = frascos(ent);
  if (!fs.length) return "parada";
  for (const r of ALMAS) {
    if (contar(ent, r.entra) < 1) continue;
    const f = fs.find((x) => almaServe(r, x.alma, x.monstro));
    if (!f) continue;
    // Os níveis de XP saem de quem estiver perto (o mod pede XP; aqui não há tanque de XP).
    const j = perto(b, 5);
    if (r.xp > 0 && (!j || (j.level < r.xp && j.getGameMode() !== GameMode.Creative))) {
      if (j) aviso(j, { translate: "cl.eio9.vinculador_xp", with: [String(r.xp)] }, 3);
      return "parada";
    }
    if (!gastarCE(b, r.ce)) return "sem_energia";
    if (j && r.xp > 0 && j.getGameMode() !== GameMode.Creative) j.addLevels(-r.xp);
    ent.setItem(f.slot, undefined);
    tirar(ent, r.entra);
    const sai = new ItemStack(r.sai[0], r.sai[1]);
    if (r.sai[0] === `${NS}:gerador_quebrado`) {
      sai.setDynamicProperty(PROP_ALMA, f.alma);
      sai.setLore([`§7${f.alma.replace("minecraft:", "")}`]);
    }
    entregar(b, [sai, new ItemStack(`${NS}:frasco_alma`, 1)]);
    feito(b, "mob.zombie.unfect");
    if (j) registrarAcao(j, "vincular");
    return "ok";
  }
  return "parada";
}, "cl.eio9.vinculador");

// ---------- Crisol de Fermentação ----------
type Tanques = { ent?: string; mbE: number; sai?: string; mbS: number };
const MAX_CUBA = 8000;
export const crisol = maquina((b) => {
  const c = vazioAcima(b);
  if (!c) return "parada";
  const t = ler<Tanques>("eio_cuba", b, { mbE: 0, mbS: 0 });
  let mexeu = false;
  // Entrada: um balde de um fluido que alguma receita usa (e igual ao que já está no tanque).
  if (t.mbE + 1000 <= MAX_CUBA) {
    const p = primeiro(c, (id) => D.cuba.some((r) => r.entra === id) && (!t.ent || t.ent === id));
    if (p) {
      tirar(c, p.typeId);
      t.ent = p.typeId;
      t.mbE += 1000;
      entregar(b, [new ItemStack(BALDE, 1)]);
      mexeu = true;
    }
  }
  // Fermentar: 1 de cada reagente por receita; a saída multiplica pela força dos reagentes (açúcar de cana 0,5...).
  for (const r of D.cuba) {
    if (r.entra !== t.ent || t.mbE < r.mb || (t.sai && t.sai !== r.sai) || t.mbS + r.mbSai > MAX_CUBA) continue;
    const a = r.r1.ids.find((id) => contar(c, id) > 0);
    const z = r.r2.ids.find((id) => contar(c, id) > 0 && (id !== a || contar(c, id) > 1));
    if (!a || !z) continue;
    tirar(c, a);
    tirar(c, z);
    t.mbE -= r.mb;
    if (t.mbE <= 0) t.ent = undefined;
    t.sai = r.sai;
    t.mbS += Math.round(r.mbSai * (r.r1.mult[a] ?? 1) * (r.r2.mult[z] ?? 1));
    mexeu = true;
    break;
  }
  // Saída: cada 1.000 mB enchem um balde vazio do baú de cima.
  while (t.sai && t.mbS >= 1000 && contar(c, BALDE) > 0 && cabe(b)) {
    tirar(c, BALDE);
    entregar(b, [new ItemStack(t.sai, 1)]);
    t.mbS -= 1000;
    mexeu = true;
    const j = perto(b, 16);
    if (j && t.sai === `${NS}:balde_hootch`) registrarAcao(j, "crisol");
  }
  if (t.mbS <= 0) t.sai = undefined;
  gravar("eio_cuba", b, t);
  if (mexeu) feito(b, "bucket.fill_water");
  return mexeu ? "ok" : "parada";
}, "cl.eio9.crisol_vazio");
const nomeFluido = (id?: string) => (id ? { translate: new ItemStack(id).localizationKey } : { translate: "cl.eio9.vazio" });

// ---------- Motor de Almas ----------
type Motor = { alma?: string; mb: number };
const MAX_MOTOR = 4000;
export const motor = gerador((b) => {
  const m = ler<Motor>("eio_motor", b, { mb: 0 });
  const tipo = m.alma ? D.motor[m.alma] : undefined;
  if (!tipo) return 0;
  if (m.mb + 1000 <= MAX_MOTOR) {
    const c = entrada(b);
    if (c && tirar(c, tipo.fluido)) {
      m.mb += 1000;
      entregar(b, [new ItemStack(BALDE, 1)]);
    }
  }
  const mb = Math.min(m.mb, 100 / tipo.ticksPorMb);
  m.mb -= mb;
  gravar("eio_motor", b, m);
  return (mb * tipo.rfPorMb) / 4000;
}, "cl.eio9.motor_sem_alma");
const motorComToque: BlockCustomComponent = {
  onTick: motor.onTick,
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const m = ler<Motor>("eio_motor", e.block, { mb: 0 });
    if (porAlma(j, e.block, "eio_motor", (a) => D.motor[a] !== undefined)) return registrarAcao(j, "motor_almas");
    if (!m.alma) return aviso(j, "cl.eio9.motor_sem_alma", 5);
    const tipo = D.motor[m.alma];
    aviso(j, { translate: "cl.eio9.motor", with: { rawtext: [nomeEntidade(m.alma), { text: rf((100 / tipo.ticksPorMb) * tipo.rfPorMb / 4000) + "/5 s" }, { text: String(Math.round(m.mb)) }, nomeFluido(tipo.fluido)] } }, 6);
  },
};
/** Toque com Frasco de Alma (ou Gerador Quebrado com alma) numa máquina de alma: grava a alma no bloco. */
function porAlma(j: Player, b: Block, chave: string, serve: (alma: string) => boolean): boolean {
  const mao = itemNaMao(j);
  if (mao?.typeId !== `${NS}:frasco_alma_cheio` && mao?.typeId !== `${NS}:gerador_quebrado`) return false;
  const alma = mao.getDynamicProperty(PROP_ALMA) as string | undefined;
  if (!alma) return false;
  if (!serve(alma)) {
    aviso(j, "cl.eio9.alma_ruim", 3);
    return true;
  }
  const d = ler<Record<string, unknown>>(chave, b, {});
  gravar(chave, b, { ...d, alma });
  if (j.getGameMode() !== GameMode.Creative) {
    gastarDaMao(j);
    if (mao.typeId === `${NS}:frasco_alma_cheio`) darAoJogador(j, `${NS}:frasco_alma`);
  }
  aviso(j, { translate: "cl.eio9.alma_posta", with: { rawtext: [nomeEntidade(alma)] } }, 3);
  b.dimension.playSound("mob.zombie.unfect", b.center(), { volume: 0.5 });
  return true;
}

// ---------- Gerador de Monstros Energizado ----------
type Spawner = { alma?: string; rf: number };
const GERADO = "cl_eio_gerado";
const custoDe = (alma: string) => D.gerador.custo[alma] ?? D.gerador.custoPadrao;
const geradorEnergizado: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const g = ler<Spawner>("eio_gerador", b, { rf: 0 });
    if (!g.alma) return;
    // Gasta no ritmo do mod (20 RF/t) até juntar o custo da criatura; aí cria até 4 em volta.
    if (g.rf < custoDe(g.alma)) {
      if (!gastarCE(b, D.usoCE.poweredSpawner)) return;
      g.rf += D.usoCE.poweredSpawner * 40;
    }
    if (g.rf >= custoDe(g.alma)) {
      const ja = b.dimension.getEntities({ type: g.alma, location: b.center(), maxDistance: 8 }).length;
      if (ja < D.gerador.quantidade + D.gerador.maxPerto * 2) {
        for (let k = 0; k < D.gerador.quantidade; k++) {
          const p = { x: b.x + 0.5 + (Math.random() * 8 - 4), y: b.y + 1, z: b.z + 0.5 + (Math.random() * 8 - 4) };
          const lugar = bloco(b.dimension, p);
          if (!lugar?.isAir || !lugar.above()?.isAir) continue;
          try {
            b.dimension.spawnEntity(g.alma as never, p).addTag(GERADO);
          } catch {
            // criatura que não nasce nesta dimensão
          }
        }
        b.dimension.spawnParticle("minecraft:mobflame_single", b.center());
        g.rf = 0;
      }
    }
    gravar("eio_gerador", b, g);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    if (porAlma(j, e.block, "eio_gerador", (a) => !NAO_CABE.has(a))) return registrarAcao(j, "gerador_alma");
    const g = ler<Spawner>("eio_gerador", e.block, { rf: 0 });
    if (!g.alma) return aviso(j, "cl.eio9.gerador_sem_alma", 5);
    aviso(j, { translate: "cl.eio9.gerador", with: { rawtext: [nomeEntidade(g.alma), { text: `${g.rf.toLocaleString("pt-BR")} RF` }, { text: `${custoDe(g.alma).toLocaleString("pt-BR")} RF` }, { text: String(D.gerador.quantidade) }] } }, 6);
  },
};

// ---------- Funil de Impulso ----------
export const funilImpulso = maquina((b) => {
  const de = entrada(b), para = saida(b);
  if (!de || !para) return "parada";
  let n = 0;
  for (let s = 0; s < de.size && n < 64; s++) {
    const p = de.getItem(s);
    if (!p) continue;
    if (!gastarCE(b, Math.max(1, Math.round((p.amount * 16) / 40)))) return n ? "ok" : "sem_energia";
    const sobra = para.addItem(p);
    de.setItem(s, sobra);
    n += p.amount - (sobra?.amount ?? 0);
    if (sobra) break;
  }
  if (!n) return "parada";
  feito(b);
  return "ok";
}, "cl.eio9.funil");

// ---------- Carregadores ----------
const CARREGA = Math.round(D.carregador.fioPorCiclo * 4000);
export const carregadorFio = maquina((b) => {
  const c = entrada(b);
  if (!c) return "parada";
  for (let s = 0; s < c.size; s++) {
    const p = c.getItem(s);
    const cap = p ? CAPACIDADE[p.typeId] : undefined;
    if (!p || !cap) continue;
    if (cargaItem(p) >= cap) {
      if (!cabe(b)) continue;
      c.setItem(s, undefined);
      entregar(b, [p]);
      continue;
    }
    if (!gastarCE(b, Math.round(CARREGA / 40))) return "sem_energia";
    definirCarga(p, cargaItem(p) + CARREGA);
    c.setItem(s, p);
    feito(b, "random.orb");
    return "ok";
  }
  return "parada";
}, "cl.eio9.carregador");
const CARREGA_SF = Math.round(D.carregador.semFioPorCiclo * 4000);
export const carregadorSemFio = maquina((b) => {
  let n = 0;
  for (const j of b.dimension.getPlayers({ location: b.center(), maxDistance: D.carregador.alcance })) {
    const inv = j.getComponent("minecraft:inventory")?.container;
    if (!inv) continue;
    // 1.33.0: o que está vestido (o jetpack) também carrega.
    const eq = j.getComponent("minecraft:equippable");
    const peito = eq?.getEquipment(EquipmentSlot.Chest);
    const capP = peito ? CAPACIDADE[peito.typeId] : undefined;
    if (peito && capP && cargaItem(peito) < capP) {
      if (!gastarCE(b, Math.round(CARREGA_SF / 40))) return n ? "ok" : "sem_energia";
      definirCarga(peito, cargaItem(peito) + CARREGA_SF);
      eq!.setEquipment(EquipmentSlot.Chest, peito);
      n++;
      continue;
    }
    for (let s = 0; s < inv.size; s++) {
      const p = inv.getItem(s);
      const cap = p ? CAPACIDADE[p.typeId] : undefined;
      if (!p || !cap || cargaItem(p) >= cap) continue;
      if (!gastarCE(b, Math.round(CARREGA_SF / 40))) return n ? "ok" : "sem_energia";
      definirCarga(p, cargaItem(p) + CARREGA_SF);
      inv.setItem(s, p);
      n++;
      break;
    }
  }
  return n ? "ok" : "parada";
}, "cl.eio9.carregador_sem_fio");

// ---------- Obelisco de XP ----------
/** Pontos de XP para chegar ao nível n (a conta do jogo). */
function pontos(n: number): number {
  if (n <= 16) return n * n + 6 * n;
  if (n <= 31) return Math.round(2.5 * n * n - 40.5 * n + 360);
  return Math.round(4.5 * n * n - 162.5 * n + 2220);
}
function nivelDe(xp: number): number {
  let n = 0;
  while (pontos(n + 1) <= xp) n++;
  return n;
}
function definirXp(j: Player, total: number): void {
  j.resetLevel();
  if (total > 0) j.addExperience(total);
}
async function obeliscoXp(j: Player, b: Block): Promise<void> {
  const guardado = ler<number>("eio_xp", b, 0);
  const f = new ActionFormData()
    .title({ translate: "cl.eio9.obelisco_xp.titulo" })
    .body({ translate: "cl.eio9.obelisco_xp.corpo", with: [guardado.toLocaleString("pt-BR"), String(nivelDe(guardado)), String(j.level)] });
  const botoes = ["xp_guardar1", "xp_guardar10", "xp_guardar_tudo", "xp_tirar1", "xp_tirar10", "xp_tirar_tudo"];
  for (const k of botoes) f.button({ translate: `cl.eio9.${k}` });
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined || !b.isValid) return;
  const total = j.getTotalXp();
  const agora = ler<number>("eio_xp", b, 0);
  const k = botoes[r.selection];
  if (k.startsWith("xp_guardar")) {
    const alvo = k === "xp_guardar_tudo" ? 0 : Math.min(total, pontos(Math.max(0, j.level - (k === "xp_guardar1" ? 1 : 10))));
    const vai = total - alvo;
    if (vai <= 0) return;
    definirXp(j, alvo);
    gravar("eio_xp", b, agora + vai);
    registrarAcao(j, "obelisco_xp");
  } else {
    const quer = k === "xp_tirar_tudo" ? agora : Math.min(agora, pontos(j.level + (k === "xp_tirar1" ? 1 : 10)) - total);
    if (quer <= 0) return;
    j.addExperience(quer);
    gravar("eio_xp", b, agora - quer);
  }
  j.playSound("random.orb");
}
const obeliscoXpComp: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) system.run(() => void obeliscoXp(j, e.block));
  },
};

// ---------- Vácuo de XP e Baú de Vácuo ----------
const vacuoXp: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    for (const o of b.dimension.getEntities({ type: "minecraft:xp_orb", location: b.center(), maxDistance: 8 })) o.teleport({ x: b.x + 0.5, y: b.y + 1.2, z: b.z + 0.5 });
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, "cl.eio9.vacuo_xp", 4);
  },
};
const bauVacuo: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const destino = saida(b);
    if (!destino) return;
    for (const it of b.dimension.getEntities({ type: "minecraft:item", location: b.center(), maxDistance: 6 })) {
      const p = it.getComponent("minecraft:item")?.itemStack;
      if (!p) continue;
      const sobra = destino.addItem(p);
      if (sobra && sobra.amount === p.amount) break;
      it.remove();
      if (sobra) b.dimension.spawnItem(sobra, it.location);
    }
  },
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, "cl.eio9.bau_vacuo", 4);
  },
};

// ---------- Obeliscos de Aversão, Relocação, Inibição e Atração ----------
type Obelisco = { d: string; x: number; y: number; z: number; tipo: string; ate: number };
const OBELISCOS = new Map<string, Obelisco>(); // os que estão com energia (renovado a cada ciclo)
const ALCANCE: Readonly<Record<string, number>> = {
  [`${NS}:obelisco_aversao`]: D.obeliscos.aversao, [`${NS}:obelisco_relocacao`]: D.obeliscos.relocacao,
  [`${NS}:obelisco_inibicao`]: D.obeliscos.inibicao, [`${NS}:obelisco_atracao`]: D.obeliscos.atracao,
};
const USO: Readonly<Record<string, number>> = {
  [`${NS}:obelisco_aversao`]: D.usoCE.aversion, [`${NS}:obelisco_relocacao`]: D.usoCE.relocator,
  [`${NS}:obelisco_inibicao`]: D.usoCE.inhibitor, [`${NS}:obelisco_atracao`]: D.usoCE.attractor,
};
const chaveB = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
const dentro = (o: Obelisco, p: Vector3, r: number) => Math.abs(p.x - o.x - 0.5) <= r && Math.abs(p.y - o.y - 0.5) <= r && Math.abs(p.z - o.z - 0.5) <= r;
const obelisco: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const k = chaveB(b);
    if (gastarCE(b, USO[b.typeId] ?? 50)) OBELISCOS.set(k, { d: b.dimension.id, x: b.x, y: b.y, z: b.z, tipo: b.typeId, ate: system.currentTick + 110 });
    else OBELISCOS.delete(k);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const ativo = (OBELISCOS.get(chaveB(e.block))?.ate ?? 0) > system.currentTick;
    aviso(j, { translate: "cl.eio9.obelisco", with: { rawtext: [{ translate: e.block.localizationKey }, { translate: ativo ? "cl.eio9.ligado" : "cl.eio9.desligado" }, { text: String(ALCANCE[e.block.typeId] ?? 0) }] } }, 5);
  },
};
function ativos(tipo: string, d: string): Obelisco[] {
  const r: Obelisco[] = [];
  for (const [k, o] of OBELISCOS) {
    if (o.ate < system.currentTick) OBELISCOS.delete(k);
    else if (o.tipo === tipo && o.d === d) r.push(o);
  }
  return r;
}
function nasceu(e: Entity): void {
  if (!e.isValid || e.hasTag(GERADO) || !ehMonstro(e)) return;
  const d = e.dimension.id;
  for (const o of ativos(`${NS}:obelisco_aversao`, d)) if (dentro(o, e.location, D.obeliscos.aversao)) return void e.remove();
  for (const o of ativos(`${NS}:obelisco_relocacao`, d)) {
    if (!dentro(o, e.location, D.obeliscos.relocacao)) continue;
    // Para fora do alcance, na superfície, do lado em que nasceu.
    const dx = e.location.x - o.x || 1, dz = e.location.z - o.z || 1;
    const h = Math.hypot(dx, dz);
    const x = o.x + (dx / h) * (D.obeliscos.relocacao + 3), z = o.z + (dz / h) * (D.obeliscos.relocacao + 3);
    const topo = e.dimension.getTopmostBlock({ x, z });
    if (topo) e.teleport({ x, y: topo.y + 1, z });
    return;
  }
}
// Inibição: quem se teletransporta (enderman, shulker) dentro do alcance volta para onde estava.
const ultimoLugar = new Map<string, Vector3>();
function inibir(): void {
  if (!OBELISCOS.size) return;
  const vistos = new Set<string>();
  for (const o of OBELISCOS.values()) {
    if (o.ate < system.currentTick) continue;
    const dim = world.getDimension(o.d);
    const centro = { x: o.x + 0.5, y: o.y + 0.5, z: o.z + 0.5 };
    if (o.tipo === `${NS}:obelisco_inibicao`) {
      for (const tipo of ["minecraft:enderman", "minecraft:shulker", "minecraft:endermite"]) {
        for (const m of dim.getEntities({ type: tipo, location: centro, maxDistance: D.obeliscos.inibicao * 1.5 })) {
          vistos.add(m.id);
          const antes = ultimoLugar.get(m.id);
          const p = m.location;
          if (antes && Math.hypot(p.x - antes.x, p.y - antes.y, p.z - antes.z) > 4 && dentro(o, antes, D.obeliscos.inibicao)) m.teleport(antes);
          else ultimoLugar.set(m.id, p);
        }
      }
    } else if (o.tipo === `${NS}:obelisco_atracao`) {
      // Atração: os monstros em volta andam até o obelisco.
      for (const m of dim.getEntities({ families: ["monster"], location: centro, maxDistance: D.obeliscos.atracao * 2 })) {
        const p = m.location;
        const dx = centro.x - p.x, dz = centro.z - p.z, h = Math.hypot(dx, dz);
        if (h > 1.5) m.applyImpulse({ x: (dx / h) * 0.25, y: 0, z: (dz / h) * 0.25 });
      }
    }
  }
  for (const id of ultimoLugar.keys()) if (!vistos.has(id)) ultimoLugar.delete(id);
}

// ---------- Obelisco Climático ----------
function mudarClima(b: Block, balde: string): boolean {
  const modo = D.clima[balde];
  if (!modo) return false;
  const dim = world.getDimension("overworld");
  if (modo === "clear") dim.setWeather(WeatherType.Clear, 6000);
  else if (modo === "rain") dim.setWeather(WeatherType.Rain, 6000);
  else {
    dim.setWeather(WeatherType.Thunder, 6000);
    b.dimension.spawnEntity("minecraft:lightning_bolt", { x: b.x + 0.5, y: b.y + 2, z: b.z + 0.5 });
  }
  b.dimension.spawnParticle("minecraft:totem_particle", b.center());
  return true;
}
const obeliscoClima: BlockCustomComponent = {
  onTick(e) {
    const c = entrada(e.block);
    const p = c && primeiro(c, (id) => D.clima[id] !== undefined);
    if (!c || !p) return;
    tirar(c, p.typeId);
    mudarClima(e.block, p.typeId);
    entregar(e.block, [new ItemStack(BALDE, 1)]);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const mao = itemNaMao(j)?.typeId ?? "";
    if (!mudarClima(e.block, mao)) return aviso(j, "cl.eio9.clima", 6);
    if (j.getGameMode() !== GameMode.Creative) {
      gastarDaMao(j);
      darAoJogador(j, BALDE);
    }
    aviso(j, "cl.eio9.clima_feito", 3);
  },
};

// ---------- Dreno ----------
type Fluido = { f?: string; mb: number; cursor?: number };
const MAX_DRENO = 16000;
const FONTES: Readonly<Record<string, string>> = { "minecraft:water": "minecraft:water_bucket", "minecraft:lava": "minecraft:lava_bucket" };
const R_DRENO = 5;
export const dreno = maquina((b) => {
  const t = ler<Fluido>("eio_dreno", b, { mb: 0 });
  let mexeu = false;
  // Procura fontes aos poucos (60 posições por ciclo, do próprio nível até 5 abaixo), para não pesar no celular.
  if (t.mb + 1000 <= MAX_DRENO) {
    const lado = 2 * R_DRENO + 1, total = lado * lado * (R_DRENO + 1);
    let cur = t.cursor ?? 0;
    for (let i = 0; i < 60; i++, cur = (cur + 1) % total) {
      const x = b.x - R_DRENO + (cur % lado), z = b.z - R_DRENO + (Math.floor(cur / lado) % lado), y = b.y - Math.floor(cur / (lado * lado));
      const a = bloco(b.dimension, { x, y, z });
      const balde = a && FONTES[a.typeId];
      if (!a || !balde || (t.f && t.f !== balde) || lerEstado<number>(a, "liquid_depth") !== 0) continue;
      if (!gastarCE(b, D.usoCE.drain)) break;
      a.setType("minecraft:air");
      t.f = balde;
      t.mb += 1000;
      mexeu = true;
      break;
    }
    t.cursor = cur;
  }
  const c = entrada(b);
  while (c && t.f && t.mb >= 1000 && contar(c, BALDE) > 0 && cabe(b)) {
    tirar(c, BALDE);
    entregar(b, [new ItemStack(t.f, 1)]);
    t.mb -= 1000;
    mexeu = true;
  }
  if (t.mb <= 0) t.f = undefined;
  gravar("eio_dreno", b, t);
  return mexeu ? "ok" : "parada";
}, "cl.eio9.dreno");

// ---------- Tanques ----------
const CAP_TANQUE: Readonly<Record<string, number>> = { [`${NS}:tanque_fluido`]: 16000, [`${NS}:tanque_fluido_pressurizado`]: 32000 };
const BALDES_FLUIDO = new Set<string>(["minecraft:water_bucket", "minecraft:lava_bucket", "minecraft:milk_bucket", ...D.cuba.map((r) => r.sai), ...D.cuba.map((r) => r.entra),
  ...Object.values(D.motor).map((m) => m.fluido), ...Object.keys(D.clima), `${NS}:balde_suco_xp`]);
const tanque: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const c = entrada(b);
    if (!c) return;
    const t = ler<Fluido>("eio_tanque", b, { mb: 0 });
    const cap = CAP_TANQUE[b.typeId] ?? 16000;
    let mexeu = false;
    for (const r of D.tanque) {
      if (contar(c, r.entra) < 1 || !cabe(b)) continue;
      if (r.modo === "encher" && t.f === r.fluido && t.mb >= r.mb) t.mb -= r.mb;
      else if (r.modo === "esvaziar" && (!t.f || t.f === r.fluido) && t.mb + r.mb <= cap) {
        t.f = r.fluido;
        t.mb += r.mb;
      } else continue;
      tirar(c, r.entra);
      entregar(b, [new ItemStack(r.sai, 1)]);
      mexeu = true;
      break;
    }
    if (t.mb <= 0) t.f = undefined;
    if (mexeu) gravar("eio_tanque", b, t);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const t = ler<Fluido>("eio_tanque", b, { mb: 0 });
    const cap = CAP_TANQUE[b.typeId] ?? 16000;
    const mao = itemNaMao(j)?.typeId ?? "";
    const criativo = j.getGameMode() === GameMode.Creative;
    if (BALDES_FLUIDO.has(mao) && (!t.f || t.f === mao) && t.mb + 1000 <= cap) {
      t.f = mao;
      t.mb += 1000;
      if (!criativo) {
        gastarDaMao(j);
        darAoJogador(j, BALDE);
      }
      j.playSound("bucket.empty_water");
    } else if (mao === BALDE && t.f && t.mb >= 1000) {
      if (!criativo) gastarDaMao(j);
      darAoJogador(j, t.f);
      t.mb -= 1000;
      if (t.mb <= 0) t.f = undefined;
      j.playSound("bucket.fill_water");
    } else {
      return aviso(j, { translate: "cl.eio9.tanque", with: { rawtext: [{ text: t.mb.toLocaleString("pt-BR") }, nomeFluido(t.f), { text: cap.toLocaleString("pt-BR") }] } }, 6);
    }
    gravar("eio_tanque", b, t);
  },
};

// ---------- Estação Agrícola ----------
const R_FAZENDA = 5;
const ADUBOS = new Set(["minecraft:bone_meal", `${NS}:graveto_nutritivo`]);
export const estacao = maquina((b) => {
  if (!gastarCE(b, D.usoCE.farmingStation)) return "sem_energia";
  const ent = entrada(b);
  const lado = 2 * R_FAZENDA + 1;
  let cur = ler<number>("eio_fazenda", b, 0);
  let n = 0;
  for (let i = 0; i < 24 && n < 8; i++, cur = (cur + 1) % (lado * lado)) {
    const x = b.x - R_FAZENDA + (cur % lado), z = b.z - R_FAZENDA + Math.floor(cur / lado);
    if (x === b.x && z === b.z) continue;
    const a = bloco(b.dimension, { x, y: b.y, z });
    if (!a) continue;
    if (!a.isAir && madura(a)) {
      quebrar(b.dimension, a.location);
      n++;
    } else if (a.isAir && ent) {
      const chao = a.below();
      if (chao?.typeId !== "minecraft:farmland") continue;
      const s = primeiro(ent, (id) => SEMENTES[id] !== undefined);
      if (!s) continue;
      tirar(ent, s.typeId);
      a.setType(SEMENTES[s.typeId]);
      n++;
    } else if (!a.isAir && ent) {
      const adubo = primeiro(ent, (id) => ADUBOS.has(id));
      if (adubo && adubar(a)) {
        tirar(ent, adubo.typeId);
        b.dimension.spawnParticle("minecraft:crop_growth_emitter", a.center());
        n++;
      }
    }
  }
  gravar("eio_fazenda", b, cur);
  if (!n) return "parada";
  recolher(b, { x: b.x - R_FAZENDA, y: b.y - 1, z: b.z - R_FAZENDA }, lado, 4);
  return "ok";
}, "cl.eio9.estacao");

// ---------- Grãos do Infinito (fogo em pedra do abismo ou rocha matriz) ----------
type FogoVivo = { d: string; x: number; y: number; z: number; t: number };
const FOGOS: FogoVivo[] = [];
const BASES = new Set(D.fogo.flatMap((f) => f.bases));
function acabouFogo(f: FogoVivo): void {
  const dim = world.getDimension(f.d);
  const base = bloco(dim, { x: f.x, y: f.y - 1, z: f.z });
  if (!base) return;
  const ganhou: string[] = [];
  for (const r of D.fogo) {
    if (!r.bases.includes(base.typeId) || Math.random() >= r.chance) continue;
    const n = r.min + Math.floor(Math.random() * (r.max - r.min + 1));
    dim.spawnItem(new ItemStack(r.sai, n), { x: f.x + 0.5, y: f.y + 0.3, z: f.z + 0.5 });
    ganhou.push(r.sai);
    if (r.vira) base.setType(r.vira);
  }
  if (ganhou.length) dim.playSound("random.fizz", { x: f.x, y: f.y, z: f.z });
}
function cuidarFogos(): void {
  for (let i = FOGOS.length - 1; i >= 0; i--) {
    const f = FOGOS[i];
    const idade = system.currentTick - f.t;
    const b = bloco(world.getDimension(f.d), f);
    if (!b) continue;
    const fogo = b.typeId === "minecraft:fire" || b.typeId === "minecraft:soul_fire";
    if (idade < D.graoFogo.idadeMinima) {
      // O fogo em pedra apaga sozinho em poucos segundos; o mod pede 260 ticks de fogo, então ele volta até lá
      // (se ninguém tirou: um bloco no lugar ou a base trocada cancela).
      if (!fogo && b.isAir && b.below() && BASES.has(b.below()!.typeId)) b.setType("minecraft:fire");
      else if (!fogo) FOGOS.splice(i, 1);
      continue;
    }
    FOGOS.splice(i, 1);
    if (fogo) b.setType("minecraft:air");
    acabouFogo(f);
  }
}

// ---------- Cajados, Eletroímã, Enderios, O Ender ----------
function cajadoViagem(j: Player, item: ItemStack): void {
  if (!gastarDaMaoRF(j, item, D.viagem.rfPorUso)) return aviso(j, "cl.eio9.cajado_sem", 3);
  const longe = j.getBlockFromViewDirection({ maxDistance: D.viagem.ateBloco });
  // Mirando numa Âncora de Viagem (até 192 blocos): vai para cima dela; senão, pula até 24 blocos para a frente.
  if (longe?.block.typeId === `${NS}:ancora_viagem`) {
    const a = longe.block;
    j.teleport({ x: a.x + 0.5, y: a.y + 1, z: a.z + 0.5 });
  } else {
    const v = j.getViewDirection(), o = j.getHeadLocation();
    const perto = j.getBlockFromViewDirection({ maxDistance: D.viagem.pulo });
    const dist = perto ? Math.max(0, Math.hypot(perto.block.x + 0.5 - o.x, perto.block.y + 0.5 - o.y, perto.block.z + 0.5 - o.z) - 1.5) : D.viagem.pulo;
    const alvo = { x: o.x + v.x * dist, y: o.y + v.y * dist - 1.6, z: o.z + v.z * dist };
    j.teleport(alvo, { checkForBlocks: true });
  }
  j.playSound("mob.endermen.portal");
  registrarAcao(j, "cajado_viagem");
}
const IMAS = new Set<string>(); // jogadores com Eletroímã ligado
function eletroima(): void {
  for (const id of IMAS) {
    const j = world.getEntity(id) as Player | undefined;
    if (!j?.isValid) {
      IMAS.delete(id);
      continue;
    }
    const inv = j.getComponent("minecraft:inventory")?.container;
    let ima: ItemStack | undefined, slot = -1;
    for (let s = 0; inv && s < inv.size; s++) {
      const p = inv.getItem(s);
      if (p?.typeId === `${NS}:eletroima` && p.getDynamicProperty("eio_on")) {
        ima = p;
        slot = s;
        break;
      }
    }
    if (!inv || !ima) {
      IMAS.delete(id);
      continue;
    }
    const gasto = D.eletroima.rfPorTick * 10;
    if (cargaItem(ima) < gasto && j.getGameMode() !== GameMode.Creative) continue;
    const itens = j.dimension.getEntities({ type: "minecraft:item", location: j.location, maxDistance: D.eletroima.alcance }).slice(0, D.eletroima.maxItens);
    if (!itens.length) continue;
    for (const it of itens) it.teleport(j.location);
    if (j.getGameMode() !== GameMode.Creative) {
      definirCarga(ima, cargaItem(ima) - gasto);
      inv.setItem(slot, ima);
    }
  }
}
const CABECAS: ReadonlyArray<[RegExp, string]> = [
  [/wither_skeleton/, "minecraft:wither_skeleton_skull"], [/skeleton|stray|bogged|esqueleto/, "minecraft:skeleton_skull"],
  [/zombie|husk|drowned|zumbi/, "minecraft:zombie_head"], [/creeper/, "minecraft:creeper_head"], [/ender_dragon/, "minecraft:dragon_head"],
  [/enderman/, `${NS}:cabeca_enderman`], [/piglin/, "minecraft:piglin_head"],
];

export function registrarEnderIO9(): void {
  // Frasco de Alma: num bicho, guarda a alma; o frasco cheio solta a criatura onde tocar.
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.itemStack?.typeId !== `${NS}:frasco_alma`) return;
    ev.cancel = true;
    const { player: j, target: alvo } = ev;
    system.run(() => capturar(j, alvo));
  });
  // No celular, tocar num monstro bate nele (não tem "usar"): bater com o frasco também pega a alma.
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: j, hitEntity: alvo }) => {
    // A mão lida na hora (o cache pode estar 1 s atrasado e a batida é rara).
    if (!(j instanceof Player) || itemNaMao(j)?.typeId !== `${NS}:frasco_alma` || !alvo.isValid) return;
    capturar(j, alvo);
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    // Chave Yeta: gira as máquinas (como a Chave do Powah).
    if (id === `${NS}:chave_yeta` && ev.block.typeId.startsWith(`${NS}:`)) {
      const atual = ev.block.permutation.getState("minecraft:cardinal_direction" as never) as string | undefined;
      if (!atual) return;
      ev.cancel = true;
      const ordem = ["north", "east", "south", "west"];
      const b = ev.block;
      system.run(() => b.setPermutation(b.permutation.withState("minecraft:cardinal_direction" as never, ordem[(ordem.indexOf(atual) + 1) % 4] as never)));
      return;
    }
    if (id !== `${NS}:frasco_alma_cheio` || !ev.isFirstEvent) return;
    const t = ev.block.typeId;
    if (t === `${NS}:motor_almas` || t === `${NS}:gerador_energizado`) return; // a própria máquina recebe a alma
    ev.cancel = true;
    const { player: j, block: b, blockFace } = ev;
    const alma = ev.itemStack?.getDynamicProperty(PROP_ALMA) as string | undefined;
    system.run(() => {
      if (!alma) return;
      const o: Record<string, Vector3> = { Up: { x: 0, y: 1, z: 0 }, Down: { x: 0, y: -1, z: 0 }, North: { x: 0, y: 0, z: -1 }, South: { x: 0, y: 0, z: 1 }, East: { x: 1, y: 0, z: 0 }, West: { x: -1, y: 0, z: 0 } };
      const d = o[blockFace] ?? { x: 0, y: 1, z: 0 };
      try {
        b.dimension.spawnEntity(alma as never, { x: b.x + 0.5 + d.x, y: b.y + d.y + (d.y < 0 ? -1 : 0), z: b.z + 0.5 + d.z });
      } catch {
        return;
      }
      if (j.getGameMode() !== GameMode.Creative) {
        gastarDaMao(j);
        darAoJogador(j, `${NS}:frasco_alma`);
      }
    });
  });
  // Grãos do Infinito: o fogo aceso em pedra do abismo ou rocha matriz.
  world.afterEvents.playerInteractWithBlock.subscribe(({ itemStack, block, blockFace }) => {
    const id = itemStack?.typeId;
    if ((id !== "minecraft:flint_and_steel" && id !== "minecraft:fire_charge") || blockFace !== "Up" || !BASES.has(block.typeId) || FOGOS.length >= 50) return;
    const p = { x: block.x, y: block.y + 1, z: block.z };
    if (!FOGOS.some((f) => f.x === p.x && f.y === p.y && f.z === p.z)) FOGOS.push({ d: block.dimension.id, ...p, t: system.currentTick });
  });
  intervalo("eio_fogo", () => FOGOS.length && cuidarFogos(), 20);
  // Gerador de monstros quebrado: sai ao quebrar um gerador de monstros do jogo.
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id === "minecraft:mob_spawner") block.dimension.spawnItem(new ItemStack(`${NS}:gerador_quebrado`, 1), block.center());
  });
  // Aversão e Relocação: monstros que nascem perto de um obelisco ligado.
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause === EntityInitializationCause.Spawned && OBELISCOS.size) nasceu(entity);
  });
  intervalo("eio_obeliscos", inibir, 10);
  // Itens que se usam.
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    const id = i.typeId;
    if (id === `${NS}:cajado_viagem`) return cajadoViagem(j, i);
    if (id === `${NS}:cajado_levitacao`) {
      if (!gastarDaMaoRF(j, i, D.levitacao.rfPorTick * 40)) return aviso(j, "cl.eio9.cajado_sem", 3);
      j.addEffect("levitation", 40, { amplifier: 1, showParticles: false });
      return;
    }
    if (id === `${NS}:eletroima`) {
      const on = !i.getDynamicProperty("eio_on");
      i.setDynamicProperty("eio_on", on);
      if (cargaItem(i) === 0 && !i.getLore().length) definirCarga(i, 0);
      j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, i);
      if (on) IMAS.add(j.id);
      aviso(j, { translate: "cl.eio9.eletroima", with: { rawtext: [{ translate: on ? "cl.eio9.ligado" : "cl.eio9.desligou" }] } }, 2);
    }
  });
  intervalo("eio_ima", () => IMAS.size && eletroima(), 10);
  // Enderios: 30% de chance de levar o jogador para um lugar a até 16 blocos.
  world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: j }) => {
    if (itemStack.typeId !== `${NS}:enderios` || Math.random() >= D.enderios.chance) return;
    const r = D.enderios.alcance;
    const x = j.location.x + (Math.random() * 2 - 1) * r, z = j.location.z + (Math.random() * 2 - 1) * r;
    const topo = j.dimension.getTopmostBlock({ x, z });
    if (topo && Math.abs(topo.y - j.location.y) <= r) j.teleport({ x, y: topo.y + 1, z });
    j.playSound("mob.endermen.portal");
  });
  // O Ender: 7% de chance de cortar a cabeça do monstro morto com ela.
  world.afterEvents.entityDie.subscribe(({ deadEntity: e, damageSource }) => {
    const j = damageSource.damagingEntity;
    if (!(j instanceof Player) || maoDe(j) !== `${NS}:eio_espada_aco_negro` || Math.random() >= D.cabecaChance) return;
    const c = CABECAS.find(([re]) => re.test(e.typeId));
    if (!c) return;
    e.dimension.spawnItem(new ItemStack(c[1], 1), e.location);
    registrarAcao(j, "cabeca_ender");
  });
  registrarDetalhe(Object.keys(CAP_TANQUE), (b) => {
    const t = ler<Fluido>("eio_tanque", b, { mb: 0 });
    return { rawtext: [{ text: `§7${t.mb.toLocaleString("pt-BR")} mB ` }, nomeFluido(t.f)] };
  });
  registrarDetalhe(`${NS}:crisol_fermentacao`, (b) => {
    const t = ler<Tanques>("eio_cuba", b, { mbE: 0, mbS: 0 });
    return { translate: "cl.eio9.crisol", with: { rawtext: [{ text: String(t.mbE) }, nomeFluido(t.ent), { text: String(t.mbS) }, nomeFluido(t.sai)] } };
  });
  registrarDetalhe(`${NS}:dreno`, (b) => {
    const t = ler<Fluido>("eio_dreno", b, { mb: 0 });
    return { rawtext: [{ text: `§7${t.mb.toLocaleString("pt-BR")} mB ` }, nomeFluido(t.f)] };
  });
  registrarDetalhe([`${NS}:motor_almas`, `${NS}:gerador_energizado`], (b) => {
    const a = ler<{ alma?: string }>(b.typeId === `${NS}:motor_almas` ? "eio_motor" : "eio_gerador", b, {}).alma;
    return a ? nomeEntidade(a) : { translate: "cl.eio9.vazio" };
  });
  registrarDetalhe(`${NS}:obelisco_xp`, (b) => ({ text: `§7${ler<number>("eio_xp", b, 0).toLocaleString("pt-BR")} XP` }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const x of D.fatiar) r.push({ ...m(`${NS}:fatiar_emendar`), entradas: x.entra.map((item) => ({ item, qtd: 1 })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: `${x.ce * 40} RF` } });
    for (const x of ALMAS)
      r.push({ ...m(`${NS}:vinculador_almas`), entradas: [{ item: x.entra, qtd: 1 }, { item: `${NS}:frasco_alma_cheio`, qtd: 1 }], saidas: [{ item: x.sai[0], qtd: x.sai[1] }],
        nota: { rawtext: [{ text: `${x.ce * 40} RF, ${x.xp} XP — ` }, x.alma.includes(":") ? nomeEntidade(x.alma) : { text: x.alma }] } });
    for (const x of D.cuba)
      r.push({ ...m(`${NS}:crisol_fermentacao`), entradas: [{ item: x.entra, qtd: Math.ceil(x.mb / 1000) }, { item: x.r1.ids[0], qtd: 1 }, { item: x.r2.ids[0], qtd: 1 }],
        saidas: [{ item: x.sai, qtd: 1 }], nota: { text: `${x.mb} mB → ${x.mbSai} mB` } });
    for (const x of D.tanque) r.push({ ...m(`${NS}:tanque_fluido`), entradas: [{ item: x.entra, qtd: 1 }, ...(x.modo === "encher" ? [{ item: x.fluido, qtd: 1 }] : [])], saidas: [{ item: x.sai, qtd: 1 }], nota: { text: `${x.mb} mB` } });
    return r;
  });
}

/** Componentes de bloco das máquinas do Ender IO 9 (main.ts registra). */
export const COMPONENTES_EIO9: Readonly<Record<string, BlockCustomComponent>> = {
  "cl:eio_fatiar_emendar": fatiar,
  "cl:eio_vinculador_almas": vinculador,
  "cl:eio_crisol_fermentacao": crisol,
  "cl:eio_motor_almas": motorComToque,
  "cl:eio_gerador_energizado": geradorEnergizado,
  "cl:eio_funil_impulso": funilImpulso,
  "cl:eio_carregador_fio": carregadorFio,
  "cl:eio_carregador_sem_fio": carregadorSemFio,
  "cl:eio_obelisco_xp": obeliscoXpComp,
  "cl:eio_vacuo_xp": vacuoXp,
  "cl:eio_bau_vacuo": bauVacuo,
  "cl:eio_obelisco_inibicao": obelisco,
  "cl:eio_obelisco_aversao": obelisco,
  "cl:eio_obelisco_atracao": obelisco,
  "cl:eio_obelisco_relocacao": obelisco,
  "cl:eio_obelisco_climatico": obeliscoClima,
  "cl:eio_dreno": dreno,
  "cl:eio_tanque_fluido": tanque,
  "cl:eio_tanque_fluido_pressurizado": tanque,
  "cl:eio_estacao_agricola": estacao,
};

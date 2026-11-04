import { Block, BlockPermutation, GameMode, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm } from "../util/dados.js";
import { gastarCE } from "../util/maquina.js";
import { feito } from "./thermal.js";

/*
 * Mekanism completo, parte 2 (1.50.0): melhorias e fábricas, com as fórmulas do mod (MekanismUtils; maxUpgradeMultiplier
 * = 10). Velocidade v (0 a 8): o tempo vira 10^(-v/8) (8 = 10× mais rápida); energia por operação × 10^((v - e)/8), com e
 * as de Energia; químico por operação × 10^((v - q)/8), com q as Químicas. Silenciador: sem som. Âncora: mantém o chunk da
 * máquina carregado (uma área de atualização do jogo; o Bedrock deixa só 10). Gerador de Pedra: o Combinador não precisa de
 * pedregulho. Filtro: na Bomba Elétrica (parte 3). Fábricas fazem 3, 5, 7 ou 9 operações onde a máquina faz 1.
 * Tocar a máquina com a melhoria instala; quebrar a máquina devolve as melhorias.
 */
export type Upg = { velocidade?: number; energia?: number; quimica?: number; silenciador?: number; ancora?: number; pedra?: number; filtro?: number };
export const MELHORIAS: Readonly<Record<string, [keyof Upg, number]>> = {
  "cl:melhoria_velocidade": ["velocidade", 8], "cl:melhoria_energia": ["energia", 8], "cl:melhoria_quimica": ["quimica", 8],
  "cl:melhoria_silenciador": ["silenciador", 1], "cl:melhoria_ancora": ["ancora", 1], "cl:melhoria_gerador_pedra": ["pedra", 1],
  "cl:melhoria_filtro": ["filtro", 1],
};
const ITEM_DE: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(MELHORIAS).map(([id, [k]]) => [k, id]));
const ACEITA = new Map<string, ReadonlySet<keyof Upg>>();
/** Registra máquinas que aceitam melhorias (e quais). */
export function aceitarMelhorias(ids: readonly string[], tipos: readonly (keyof Upg)[] = ["velocidade", "energia", "silenciador", "ancora"]): void {
  for (const id of ids) ACEITA.set(id, new Set([...(ACEITA.get(id) ?? []), ...tipos]));
}
export const melhorias = (b: Block): Upg => ler<Upg>("mk_upg", b, {});

// Durante uma operação: o gasto de energia e de químico com as melhorias da máquina.
let MULT_E = 1, MULT_Q = 1;
export const gastarMk = (b: Block, ce: number): boolean => gastarCE(b, Math.max(1, Math.round(ce * MULT_E)));
export const quimicoMk = (mb: number): number => Math.max(1, Math.round(mb * MULT_Q));
/** Quantas vezes a velocidade multiplica (10^(v/8)). */
export const fatorVelocidade = (u: Upg): number => Math.pow(10, (u.velocidade ?? 0) / 8);

type Status = "ok" | "parada" | "sem_energia";
/**
 * Roda `proc` quantas vezes a velocidade e as fábricas mandam neste ciclo (a fração que sobra fica para o próximo).
 * `processos`: 1 na máquina, 3/5/7/9 nas fábricas. Toca o som uma vez (se não tiver Silenciador).
 */
export function rodarMk(b: Block, proc: (b: Block) => Status, processos = 1, som = "random.click"): Status {
  const u = melhorias(b);
  const vel = fatorVelocidade(u);
  MULT_E = Math.pow(10, ((u.velocidade ?? 0) - (u.energia ?? 0)) / 8);
  MULT_Q = Math.pow(10, ((u.velocidade ?? 0) - (u.quimica ?? 0)) / 8);
  let credito = ler<number>("mk_cred", b, 0) + vel * processos;
  const vezes = Math.min(64, Math.floor(credito));
  credito -= vezes;
  let s: Status = "parada", fez = 0;
  try {
    for (let k = 0; k < vezes; k++) {
      const r = proc(b);
      if (r !== "ok") {
        if (!fez) s = r;
        break;
      }
      fez++;
      s = "ok";
    }
  } finally {
    MULT_E = MULT_Q = 1;
  }
  // Parada não acumula crédito (como a máquina do mod, que só conta o tempo enquanto trabalha).
  gravar("mk_cred", b, fez ? credito : Math.min(credito, 1));
  if (fez) feito(b, u.silenciador ? "" : som);
  return s;
}

/** Texto das melhorias para o WAILA. */
export function textoMelhorias(b: Block): RawMessage | undefined {
  const u = melhorias(b);
  const partes = (Object.keys(u) as (keyof Upg)[]).filter((k) => (u[k] ?? 0) > 0);
  if (!partes.length) return undefined;
  return { rawtext: partes.flatMap((k, i) => [{ text: i ? ", " : "" }, { translate: `item.${ITEM_DE[k]}.name` }, { text: (MELHORIAS[ITEM_DE[k]][1] > 1 ? ` ${u[k]}` : "") }]) };
}

function areaAncora(b: { x: number; y: number; z: number }) {
  return `mkanc_${b.x}_${b.y}_${b.z}`.replace(/-/g, "m");
}
function instalar(j: Player, b: Block, id: string): boolean {
  const [k, max] = MELHORIAS[id];
  if (!ACEITA.get(b.typeId)?.has(k)) {
    aviso(j, "cl.mku.nao_aceita", 3);
    return false;
  }
  const u = melhorias(b);
  if ((u[k] ?? 0) >= max) {
    aviso(j, { translate: "cl.mku.cheia", with: { rawtext: [{ translate: `item.${id}.name` }] } }, 3);
    return false;
  }
  if (k === "ancora") {
    try {
      b.dimension.runCommand(`tickingarea add circle ${b.x} ${b.y} ${b.z} 0 ${areaAncora(b)}`);
    } catch {
      aviso(j, "cl.mku.ancora_cheia", 4);
      return false;
    }
  }
  u[k] = (u[k] ?? 0) + 1;
  gravar("mk_upg", b, u);
  aviso(j, { translate: "cl.mku.instalou", with: { rawtext: [{ translate: `item.${id}.name` }, { text: `${u[k]}/${max}` }] } }, 3);
  j.playSound("random.anvil_use", { volume: 0.4 });
  registrarAcao(j, "mk_melhoria");
  return true;
}

// ---------- Instaladores de nível ----------
const NIVEIS = ["basica", "avancada", "elite", "definitiva"] as const;
let BASE_DE: Readonly<Record<string, string>> = {}; // fábrica -> máquina
let FABRICA_DE: Readonly<Record<string, string>> = {}; // máquina ou fábrica -> a do próximo nível
const INSTALADOR: Readonly<Record<string, number>> = { "cl:instalador_nivel_basico": 0, "cl:instalador_nivel_avancado": 1, "cl:instalador_nivel_elite": 2, "cl:instalador_nivel_definitivo": 3 };
export function registrarNiveis(fabricas: Readonly<Record<string, readonly [string, number]>>): void {
  const base: Record<string, string> = {}, prox: Record<string, string> = {};
  const porTipo = new Map<string, string[]>();
  for (const [id, [maq, nivel]] of Object.entries(fabricas)) {
    base[id] = maq;
    const l = porTipo.get(maq) ?? [];
    l[nivel] = id;
    porTipo.set(maq, l);
  }
  for (const [maq, l] of porTipo) {
    prox[maq] = l[0];
    for (let k = 0; k + 1 < l.length; k++) prox[l[k]] = l[k + 1];
  }
  BASE_DE = base;
  FABRICA_DE = prox;
}
const nivelDe = (id: string): number => {
  const n = NIVEIS.findIndex((x) => id.endsWith(`_${x}`));
  return BASE_DE[id] ? n : -1;
};
function subirNivel(j: Player, b: Block, instalador: string): boolean {
  const alvo = FABRICA_DE[b.typeId];
  const quer = INSTALADOR[instalador];
  if (!alvo || nivelDe(b.typeId) + 1 !== quer) {
    aviso(j, "cl.mku.nivel_errado", 3);
    return false;
  }
  let perm: BlockPermutation;
  try {
    const dir = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string | undefined;
    perm = dir ? BlockPermutation.resolve(alvo, { "minecraft:cardinal_direction": dir }) : BlockPermutation.resolve(alvo);
  } catch {
    perm = BlockPermutation.resolve(alvo);
  }
  b.setPermutation(perm); // os dados (energia, químicos, melhorias) ficam no lugar
  j.playSound("random.anvil_use", { volume: 0.5 });
  aviso(j, { translate: "cl.mku.subiu", with: { rawtext: [{ translate: `tile.${alvo}.name` }] } }, 3);
  registrarAcao(j, "mk_fabrica");
  return true;
}

function gastarDaMao(j: Player): void {
  if (j.getGameMode() === GameMode.Creative) return;
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !i) return;
  if (i.amount > 1) {
    i.amount--;
    inv.setItem(j.selectedSlotIndex, i);
  } else inv.setItem(j.selectedSlotIndex, undefined);
}

export function registrarMelhorias(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    if (!id || !ev.isFirstEvent) return;
    if (MELHORIAS[id] && ACEITA.has(ev.block.typeId)) {
      ev.cancel = true;
      const j = ev.player, b = ev.block;
      system.run(() => b.isValid && instalar(j, b, id) && gastarDaMao(j));
    } else if (INSTALADOR[id] !== undefined && FABRICA_DE[ev.block.typeId]) {
      ev.cancel = true;
      const j = ev.player, b = ev.block;
      system.run(() => b.isValid && subirNivel(j, b, id) && gastarDaMao(j));
    }
  });
  // Quebrar a máquina devolve as melhorias (e solta a âncora).
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (!ACEITA.has(brokenBlockPermutation.type.id)) return;
    const u = lerEm<Upg>("mk_upg", block.dimension, block.location, {});
    gravarEm("mk_upg", block.dimension, block.location, undefined);
    gravarEm("mk_cred", block.dimension, block.location, undefined);
    for (const [k, n] of Object.entries(u) as [keyof Upg, number][]) if (n > 0) block.dimension.spawnItem(new ItemStack(ITEM_DE[k], n), block.center());
    if (u.ancora) {
      try {
        block.dimension.runCommand(`tickingarea remove ${areaAncora(block)}`);
      } catch {
        /* já não existia */
      }
    }
  });
  // Teste no servidor: scriptevent cl:teste_mku <instalar <item>|subir <instalador>|ver> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mku" || !(j instanceof Player)) return;
    const [acao, arg, x, y, z] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (!b) return;
    if (acao === "instalar") console.warn(`[teste_mku] instalar ${instalar(j, b, arg)}`);
    if (acao === "subir") console.warn(`[teste_mku] subir ${subirNivel(j, b, arg)} ${b.typeId}`);
    if (acao === "ver") console.warn(`[teste_mku] ${b.typeId} ${JSON.stringify(melhorias(b))}`);
  });
}

import { Block, BlockCustomComponent, Dimension, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { ENERGIA, TURBINA } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { abrirUmMenu } from "../util/menus.js";
import { gerar } from "../util/rede.js";

/*
 * 1.36.0: a turbina do Extreme Reactors 2.4 (fórmula fechada, sem simular a rotação). Montagem conferida ao tocar no
 * Controlador: caixa de 3 a 9 de lado, arestas de Carcaça; nas faces carcaça, vidro, controlador, Mancal do Rotor,
 * Tomadas e Portas de Fluido; dentro o Eixo saindo do mancal, Pás encostadas no eixo, bobinas (blocos de metal da
 * lista TURBINA.bobinas) encostadas no eixo e ar. A cada 5 s: pega o vapor que o reator deixou nas Portas de Fluido
 * (até 25 mB/t por pá), RF = vapor × 10 × eficiência média das bobinas × bônus (as bobinas precisam ser pelo menos
 * metade das pás para a eficiência inteira); a energia sai pelas Tomadas.
 */
type Turbina = { ok: boolean; pas: number; bobinas: number; ef: number; bonus: number; portas: Vector3[]; tomadas: Vector3[]; tam: number[]; ultimo: number; acum?: number };
const CASCA = new Set(["cl:carcaca_turbina", "cl:vidro_turbina", "cl:controlador_turbina", "cl:mancal_rotor", "cl:tomada_turbina", "cl:porta_fluido_turbina"]);
const vazia = (): Turbina => ({ ok: false, pas: 0, bobinas: 0, ef: 0, bonus: 1, portas: [], tomadas: [], tam: [0, 0, 0], ultimo: 0 });
const k3 = (p: Vector3) => `${p.x},${p.y},${p.z}`;
const V6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
function bloco(dim: Dimension, p: Vector3): Block | undefined {
  try {
    return dim.getBlock(p);
  } catch {
    return undefined;
  }
}

function validar(c: Block): { t?: Turbina; erro?: string } {
  const fila = [c.location], vistos = new Set<string>(), partes: Vector3[] = [];
  while (fila.length && partes.length < 6 * TURBINA.ladoMax * TURBINA.ladoMax) {
    const p = fila.shift()!;
    if (vistos.has(k3(p))) continue;
    vistos.add(k3(p));
    const b = bloco(c.dimension, p);
    if (!b || !CASCA.has(b.typeId)) continue;
    partes.push(p);
    for (const [dx, dy, dz] of V6) fila.push({ x: p.x + dx, y: p.y + dy, z: p.z + dz });
  }
  const min = { x: Math.min(...partes.map((p) => p.x)), y: Math.min(...partes.map((p) => p.y)), z: Math.min(...partes.map((p) => p.z)) };
  const max = { x: Math.max(...partes.map((p) => p.x)), y: Math.max(...partes.map((p) => p.y)), z: Math.max(...partes.map((p) => p.z)) };
  const tam = [max.x - min.x + 1, max.y - min.y + 1, max.z - min.z + 1];
  if (tam.some((n) => n < TURBINA.ladoMin || n > TURBINA.ladoMax)) return { erro: "tamanho" };
  const t: Turbina = { ...vazia(), tam };
  const eixos: Vector3[] = [], mancais: Vector3[] = [], dentro = new Map<string, string>();
  for (let x = min.x; x <= max.x; x++) for (let y = min.y; y <= max.y; y++) for (let z = min.z; z <= max.z; z++) {
    const planos = Number(x === min.x || x === max.x) + Number(y === min.y || y === max.y) + Number(z === min.z || z === max.z);
    const id = bloco(c.dimension, { x, y, z })?.typeId ?? "";
    if (planos >= 2) {
      if (id !== "cl:carcaca_turbina") return { erro: "bordas" };
    } else if (planos === 1) {
      if (!CASCA.has(id)) return { erro: "faces" };
      if (id === "cl:mancal_rotor") mancais.push({ x, y, z });
      if (id === "cl:tomada_turbina") t.tomadas.push({ x, y, z });
      if (id === "cl:porta_fluido_turbina") t.portas.push({ x, y, z });
    } else {
      if (id === "cl:eixo_rotor") eixos.push({ x, y, z });
      else if (id !== "minecraft:air" && id !== "cl:pa_rotor" && !TURBINA.bobinas[id]) return { erro: "dentro" };
      dentro.set(k3({ x, y, z }), id);
    }
  }
  // O eixo sai de um mancal: algum eixo encostado num mancal.
  const temEixo = (p: Vector3) => V6.some(([dx, dy, dz]) => dentro.get(k3({ x: p.x + dx, y: p.y + dy, z: p.z + dz })) === "cl:eixo_rotor");
  if (!mancais.some(temEixo) || !eixos.length) return { erro: "rotor" };
  const noEixo = new Set<string>();
  for (const e of eixos) for (const [dx, dy, dz] of V6) noEixo.add(k3({ x: e.x + dx, y: e.y + dy, z: e.z + dz }));
  let soma = 0, bonus = 0;
  for (const [k, id] of dentro) {
    if (!noEixo.has(k)) continue;
    if (id === "cl:pa_rotor") t.pas++;
    const b = TURBINA.bobinas[id];
    if (b) {
      t.bobinas++;
      soma += b[0];
      bonus += b[1];
    }
  }
  if (!t.pas || !t.bobinas) return { erro: "rotor" };
  t.ef = (soma / t.bobinas) * Math.min(1, t.bobinas / Math.max(1, Math.ceil(t.pas / 2)));
  t.bonus = bonus / t.bobinas;
  t.ok = true;
  return { t };
}

const lerT = (c: Block) => ler<Turbina>("turbina", c, vazia());
function ciclo(c: Block): void {
  const t = lerT(c);
  if (!t.ok) return;
  const dim = c.dimension;
  const cabe = t.pas * TURBINA.mbPorPa * ENERGIA.ticksPorCiclo;
  let vapor = 0;
  for (const p of t.portas) {
    const tem = lerEm<number>("vapor", dim, p, 0);
    const usa = Math.min(tem, cabe - vapor);
    if (usa > 0) {
      vapor += usa;
      gravarEm("vapor", dim, p, tem - usa > 0 ? tem - usa : undefined);
    }
  }
  t.ultimo = 0;
  if (vapor > 0) {
    const e = (vapor * TURBINA.rfPorMb * t.ef * t.bonus) / ENERGIA.rfPorUnidade;
    let saiu = 0;
    for (const p of t.tomadas) {
      const tb = bloco(dim, p);
      if (tb) saiu += gerar(tb, Math.ceil((e - saiu) / Math.max(1, t.tomadas.length)));
      if (saiu >= e) break;
    }
    t.ultimo = e;
    if (saiu > 0) {
      const j = dim.getPlayers({ location: c.center(), maxDistance: 32, closest: 1 })[0];
      if (j) registrarAcao(j, "er_vapor");
    }
  }
  gravar("turbina", c, t);
}

async function menu(j: Player, c: Block): Promise<void> {
  const v = validar(c);
  const antes = lerT(c);
  if (!v.t) {
    gravar("turbina", c, { ...antes, ok: false });
    await new ActionFormData().title({ translate: "cl.tb.titulo" }).body({ translate: "cl.tb.invalida", with: { rawtext: [{ translate: `cl.tb.erro.${v.erro}` }] } }).button({ translate: "cl.br.fechar" }).show(j);
    return;
  }
  const t: Turbina = { ...v.t, ultimo: antes.ultimo };
  gravar("turbina", c, t);
  registrarAcao(j, "er_turbina");
  const vapor = t.portas.reduce((s, p) => s + lerEm<number>("vapor", c.dimension, p, 0), 0);
  const corpo: RawMessage[] = [
    { translate: "cl.tb.ok", with: [String(t.tam[0]), String(t.tam[1]), String(t.tam[2]), String(t.pas), String(t.pas * TURBINA.mbPorPa), String(t.bobinas), t.ef.toFixed(2)] },
    { text: "\n" },
    { translate: "cl.tb.estado", with: [String(Math.round(vapor)), rf(t.ultimo)] },
  ];
  await new ActionFormData().title({ translate: "cl.tb.titulo" }).body({ rawtext: corpo }).button({ translate: "cl.br.fechar" }).show(j);
}

export const turbina: BlockCustomComponent = {
  onTick: (e) => ciclo(e.block),
  onPlayerInteract(e) {
    const j = e.player;
    if (j) abrirUmMenu(j, () => menu(j, e.block));
  },
};
export const turbinaParte: BlockCustomComponent = {
  onPlayerInteract: (e) => e.player && aviso(e.player, "cl.tb.parte", 4),
};

/** Reator em refrigeração ativa: a Porta de Refrigeração encostada numa Porta de Fluido da turbina. */
export function portaDeTurbina(porta: Block): Block | undefined {
  for (const [dx, dy, dz] of V6) {
    const v = bloco(porta.dimension, { x: porta.x + dx, y: porta.y + dy, z: porta.z + dz });
    if (v?.typeId === "cl:porta_fluido_turbina") return v;
  }
  return undefined;
}
/** Deixa o vapor na Porta de Fluido (até 2 ciclos de turbina grande). */
export function deixarVapor(p: Block, mb: number): void {
  const tem = lerEm<number>("vapor", p.dimension, p.location, 0);
  gravarEm("vapor", p.dimension, p.location, Math.min(tem + mb, 2 * 64 * TURBINA.mbPorPa * ENERGIA.ticksPorCiclo));
}

export function registrarTurbina(): void {
  // Teste no servidor: scriptevent cl:teste_turbina <vapor x y z mb | validar x y z | ciclo x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_turbina" || !(j instanceof Player)) return;
    const [acao, x, y, z, mb] = message.split(" ");
    const b = j.dimension.getBlock({ x: Number(x), y: Number(y), z: Number(z) });
    if (!b) return;
    if (acao === "vapor") deixarVapor(b, Number(mb));
    if (acao === "validar") {
      const v = validar(b);
      if (v.t) gravar("turbina", b, v.t);
      console.warn(`[teste_turbina] ${v.erro ?? JSON.stringify({ pas: v.t!.pas, bobinas: v.t!.bobinas, ef: v.t!.ef })}`);
    }
    if (acao === "ciclo") {
      ciclo(b);
      console.warn(`[teste_turbina] ultimo=${lerT(b).ultimo}`);
    }
  });
  registrarDetalhe("cl:porta_fluido_turbina", (b) => ({ text: `§7${Math.round(lerEm<number>("vapor", b.dimension, b.location, 0))} mB` }));
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id === "cl:controlador_turbina") gravarEm("turbina", block.dimension, block.location, undefined);
  });
}

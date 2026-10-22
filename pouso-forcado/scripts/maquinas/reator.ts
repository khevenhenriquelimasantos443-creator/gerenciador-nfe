import { Block, BlockCustomComponent, Dimension, ItemStack, Player, RawMessage, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { REATOR } from "../config.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { creditar } from "../blocos/energia.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado, vizinhos } from "../util/blocos.js";
import { gravar, gravarEm, ler, registrarDetalhe } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { cabe, contar, entrada, entregar, gastarCE, inv, primeiro, tirar } from "../util/maquina.js";
import { gerar } from "../util/rede.js";

/*
 * Big Reactors (Fase 22), com fórmula fechada (sem a simulação de calor e radiação do mod).
 * Montagem (conferida só ao tocar no controlador): caixa de 3x3x3 a 7x7x7; arestas e cantos de Carcaça;
 * faces com carcaça, vidro, Controlador, Portas de Acesso, Tomadas de Energia, Portas de Refrigeração e
 * Barras de Controle (só no teto); dentro, colunas de Barras de Combustível do chão ao teto, cada uma com
 * uma Barra de Controle em cima, e o resto ar, água ou grafite (moderador).
 * A cada 5 s: energia = barras × REATOR.base × moderador × (1 − inserção média), se houver combustível;
 * o combustível vira cianita na mesma medida. A energia sai pelas Tomadas para a rede (cabos/baterias).
 * Combustível: Lingotes de Yellorium ou Blutônio nas Portas de Acesso (toque ou baú encostado);
 * a cianita sai em lingotes no baú encostado na porta.
 * O Controlador e a Tomada não têm receita: só se acham nas cidades abandonadas (como no Crash Landing).
 */
type Reator = {
  ok: boolean; min: Vector3; max: Vector3; barras: number; mod: number; colunas: Vector3[];
  portas: Vector3[]; tomadas: Vector3[]; refri: Vector3[]; comb: number; cian: number; ligado: boolean; ultimo: number; agua: number; acum?: number; resto?: number;
};
const CASCA = new Set(["cl:carcaca_reator", "cl:vidro_reator", "cl:controlador_reator", "cl:porta_acesso_reator", "cl:tomada_energia", "cl:porta_refrigeracao", "cl:barra_controle"]);
const k3 = (p: Vector3) => `${p.x},${p.y},${p.z}`;
const vazio = (): Reator => ({ ok: false, min: { x: 0, y: 0, z: 0 }, max: { x: 0, y: 0, z: 0 }, barras: 0, mod: 1, colunas: [], portas: [], tomadas: [], refri: [], comb: 0, cian: 0, ligado: true, ultimo: 0, agua: 0 });

function bloco(dim: Dimension, p: Vector3): Block | undefined {
  try {
    return dim.getBlock(p);
  } catch {
    return undefined;
  }
}

function validar(c: Block): { r?: Reator; erro?: string } {
  const fila = [c.location], vistos = new Set<string>(), partes: Vector3[] = [];
  while (fila.length && partes.length < 6 * REATOR.ladoMax * REATOR.ladoMax) {
    const p = fila.shift()!;
    if (vistos.has(k3(p))) continue;
    vistos.add(k3(p));
    const b = bloco(c.dimension, p);
    if (!b || !CASCA.has(b.typeId)) continue;
    partes.push(p);
    for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) fila.push({ x: p.x + dx, y: p.y + dy, z: p.z + dz });
  }
  const min = { x: Math.min(...partes.map((p) => p.x)), y: Math.min(...partes.map((p) => p.y)), z: Math.min(...partes.map((p) => p.z)) };
  const max = { x: Math.max(...partes.map((p) => p.x)), y: Math.max(...partes.map((p) => p.y)), z: Math.max(...partes.map((p) => p.z)) };
  const tam = [max.x - min.x + 1, max.y - min.y + 1, max.z - min.z + 1];
  if (tam.some((t) => t < REATOR.ladoMin || t > REATOR.ladoMax)) return { erro: "tamanho" };
  const r: Reator = { ...vazio(), min, max };
  let somaMod = 0, nMod = 0;
  for (let x = min.x; x <= max.x; x++) for (let y = min.y; y <= max.y; y++) for (let z = min.z; z <= max.z; z++) {
    const planos = Number(x === min.x || x === max.x) + Number(y === min.y || y === max.y) + Number(z === min.z || z === max.z);
    const b = bloco(c.dimension, { x, y, z });
    const id = b?.typeId ?? "";
    if (planos >= 2) {
      if (id !== "cl:carcaca_reator") return { erro: "bordas" };
    } else if (planos === 1) {
      if (!CASCA.has(id) || (id === "cl:barra_controle" && y !== max.y)) return { erro: "faces" };
      if (id === "cl:porta_acesso_reator") r.portas.push({ x, y, z });
      if (id === "cl:tomada_energia") r.tomadas.push({ x, y, z });
      if (id === "cl:porta_refrigeracao") r.refri.push({ x, y, z });
    } else if (id === "cl:barra_combustivel") {
      r.barras++;
    } else if (REATOR.moderador[id] !== undefined) {
      somaMod += REATOR.moderador[id];
      nMod++;
    } else return { erro: "dentro" };
  }
  // Colunas: barra de controle no teto -> combustível do chão ao teto de dentro.
  for (let x = min.x + 1; x < max.x; x++) for (let z = min.z + 1; z < max.z; z++) {
    const topo = bloco(c.dimension, { x, y: max.y, z })?.typeId === "cl:barra_controle";
    let cheias = 0;
    for (let y = min.y + 1; y < max.y; y++) if (bloco(c.dimension, { x, y, z })?.typeId === "cl:barra_combustivel") cheias++;
    if (cheias === 0 && !topo) continue;
    if (!topo || cheias !== max.y - min.y - 1) return { erro: "coluna" };
    r.colunas.push({ x, y: max.y, z });
  }
  if (r.barras === 0) return { erro: "sem_barra" };
  r.mod = nMod ? somaMod / nMod / REATOR.moderador["minecraft:air"] : 1;
  r.ok = true;
  return { r };
}

const lerR = (c: Block) => ler<Reator>("reator", c, vazio());
function insercao(dim: Dimension, r: Reator): number {
  if (!r.colunas.length) return 0;
  let soma = 0;
  for (const p of r.colunas) {
    const b = bloco(dim, p);
    soma += b?.typeId === "cl:barra_controle" ? lerEstado<number>(b, "cl:insercao") : 0;
  }
  return soma / r.colunas.length / 10;
}

function ciclo(c: Block): void {
  const r = lerR(c);
  if (!r.ok) return;
  const dim = c.dimension;
  // Combustível pelas portas (baú encostado do lado de fora); cianita volta para o baú.
  for (const p of r.portas) {
    const porta = bloco(dim, p);
    if (!porta) continue;
    for (const v of vizinhos(porta)) {
      const caixa = CASCA.has(v.typeId) ? undefined : inv(v);
      if (!caixa) continue;
      while (r.comb + 1000 <= r.barras * REATOR.porBarra) {
        const f = primeiro(caixa, (id) => REATOR.combustivel[id] !== undefined);
        if (!f) break;
        tirar(caixa, f.typeId);
        r.comb += REATOR.combustivel[f.typeId];
      }
      while (r.cian >= 1000 && caixa.emptySlotsCount > 0) {
        caixa.addItem(new ItemStack("cl:lingote_cianita", 1));
        r.cian -= 1000;
      }
    }
  }
  r.ultimo = 0;
  if (r.ligado && r.comb > 0) {
    const ins = insercao(dim, r);
    const queima = Math.min(r.comb, r.barras * REATOR.consumo * (1 - ins));
    let e = r.barras * REATOR.base * r.mod * (1 - ins) * (queima / Math.max(1e-9, r.barras * REATOR.consumo * (1 - ins)));
    // Refrigeração: 1 balde de água a cada REATOR.refrigeracaoCiclos dobra a energia.
    if (r.refri.length) {
      if (r.agua <= 0) {
        for (const p of r.refri) {
          const porta = bloco(dim, p);
          const caixa = porta && vizinhos(porta).map((v) => (CASCA.has(v.typeId) ? undefined : inv(v))).find((x) => x && contar(x, "minecraft:water_bucket") > 0);
          if (caixa && tirar(caixa, "minecraft:water_bucket")) {
            caixa.addItem(new ItemStack("minecraft:bucket", 1));
            r.agua = REATOR.refrigeracaoCiclos;
            break;
          }
        }
      }
      if (r.agua > 0) {
        e *= 2;
        r.agua--;
      }
    }
    r.comb -= queima;
    r.cian += queima;
    const inteiro = Math.floor(e + (r.resto ?? 0)); // o que sobra de fração fica para o próximo ciclo
    r.resto = e + (r.resto ?? 0) - inteiro;
    let saiu = 0;
    for (const p of r.tomadas) {
      const t = bloco(dim, p);
      if (t) saiu += gerar(t, Math.ceil((inteiro - saiu) / Math.max(1, r.tomadas.length)));
      if (saiu >= inteiro) break;
    }
    r.ultimo = e;
    // Missão: 1 a cada 10 E que saíram.
    r.acum = (r.acum ?? 0) + saiu;
    const quem = r.acum >= 10 ? dim.getPlayers({ location: c.center(), maxDistance: 32, closest: 1 })[0] : undefined;
    while (r.acum >= 10) {
      r.acum -= 10;
      if (quem) registrarAcao(quem, "reator_10e");
    }
  }
  gravar("reator", c, r);
}

async function menu(j: Player, c: Block): Promise<void> {
  const v = validar(c);
  const antes = lerR(c);
  if (!v.r) {
    gravar("reator", c, { ...antes, ok: false });
    const res = await new ActionFormData()
      .title({ translate: "cl.br.titulo" })
      .body({ translate: "cl.br.invalido", with: { rawtext: [{ translate: `cl.br.erro.${v.erro}` }] } })
      .button({ translate: "cl.br.verificar" })
      .button({ translate: "cl.br.fechar" })
      .show(j);
    if (res.selection === 0) return menu(j, c);
    return;
  }
  const r: Reator = { ...v.r, comb: antes.comb, cian: antes.cian, ligado: antes.ligado, ultimo: antes.ultimo, agua: antes.agua };
  gravar("reator", c, r);
  registrarAcao(j, "reator");
  const l = (a: number, b: number) => String(b - a + 1);
  const corpo: RawMessage[] = [
    { translate: "cl.br.ok", with: [l(r.min.x, r.max.x), l(r.min.y, r.max.y), l(r.min.z, r.max.z), String(r.barras), r.mod.toFixed(2)] },
    { text: "\n" },
    { translate: "cl.br.estado", with: [String(Math.round(r.comb)), String(Math.round(r.cian)), `${Math.round(insercao(c.dimension, r) * 100)}%`, rf(r.ultimo)] },
  ];
  if (!r.ligado) corpo.push({ text: " " }, { translate: "cl.br.desligado" });
  if (!r.tomadas.length) corpo.push({ text: "\n" }, { translate: "cl.br.sem_tomada" });
  const res = await new ActionFormData()
    .title({ translate: "cl.br.titulo" })
    .body({ rawtext: corpo })
    .button({ translate: r.ligado ? "cl.br.desligar" : "cl.br.ligar" })
    .button({ translate: "cl.br.fechar" })
    .show(j);
  if (res.selection === 0) {
    const agora = lerR(c);
    agora.ligado = !agora.ligado;
    gravar("reator", c, agora);
  }
}

export const controladorReator: BlockCustomComponent = {
  onTick: (e) => ciclo(e.block),
  onPlayerInteract(e) {
    const j = e.player;
    if (j) abrirUmMenu(j, () => menu(j, e.block));
  },
};

export const barraControle: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const n = Math.max(0, Math.min(10, lerEstado<number>(e.block, "cl:insercao") + (j.isSneaking ? -1 : 1)));
    definirEstado(e.block, "cl:insercao", n);
    aviso(j, { translate: "cl.br.insercao", with: [`${n * 10}%`] });
  },
};

export const portaAcesso: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const mao = itemNaMao(j);
    if (!mao || REATOR.combustivel[mao.typeId] === undefined) return aviso(j, "cl.br.porta", 6);
    // Acha o controlador da caixa desta porta.
    for (const k of indice()) {
      const [d, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
      if (d !== e.dimension.id) continue;
      const [x, y, z] = xyz.split(",").map(Number);
      const c = bloco(e.dimension, { x, y, z });
      if (c?.typeId !== "cl:controlador_reator") continue;
      const r = lerR(c);
      if (!r.ok || !r.portas.some((p) => k3(p) === k3(e.block.location))) continue;
      if (r.comb + 1000 > r.barras * REATOR.porBarra) return aviso(j, "cl.br.porta", 4);
      gastarDaMao(j);
      r.comb += REATOR.combustivel[mao.typeId];
      gravar("reator", c, r);
      return aviso(j, { translate: "cl.br.estado", with: [String(Math.round(r.comb)), String(Math.round(r.cian)), "-", rf(r.ultimo)] });
    }
    aviso(j, "cl.br.porta", 6);
  },
};
const indice = () => JSON.parse((world.getDynamicProperty("cl:reatores") as string | undefined) ?? "[]") as string[];

export const portaRefrigeracao: BlockCustomComponent = { onPlayerInteract: (e) => e.player && aviso(e.player, "cl.br.refrigeracao", 6) };
export const tomada: BlockCustomComponent = {};

export const reprocessador: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const ent = entrada(b);
    if (!ent || contar(ent, "cl:lingote_cianita") < 2 || contar(ent, "minecraft:water_bucket") < 1 || !cabe(b)) return;
    if (!gastarCE(b, REATOR.reprocessadorCE)) return;
    tirar(ent, "cl:lingote_cianita", 2);
    tirar(ent, "minecraft:water_bucket");
    entregar(b, [new ItemStack("cl:lingote_blutonio", 1), new ItemStack("minecraft:bucket", 1)]);
    creditar(b, "blutonio");
  },
  onPlayerInteract: (e) => e.player && aviso(e.player, "cl.br.reprocessador", 6),
};

export function registrarReator(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    if (block.typeId !== "cl:controlador_reator") return;
    world.setDynamicProperty("cl:reatores", JSON.stringify([...indice(), `${block.dimension.id}:${k3(block.location)}`]));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (!CASCA.has(id) && id !== "cl:barra_combustivel") return;
    if (id === "cl:controlador_reator") {
      const k = `${block.dimension.id}:${k3(block.location)}`;
      world.setDynamicProperty("cl:reatores", JSON.stringify(indice().filter((x) => x !== k)));
      gravarEm("reator", block.dimension, block.location, undefined);
      return;
    }
    // Desmonta o reator que tinha esta peça (o combustível fica guardado no controlador).
    for (const k of indice()) {
      const [d, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
      if (d !== block.dimension.id) continue;
      const [x, y, z] = xyz.split(",").map(Number);
      const c = bloco(block.dimension, { x, y, z });
      if (c?.typeId !== "cl:controlador_reator") continue;
      const r = lerR(c);
      if (r.ok && block.x >= r.min.x && block.x <= r.max.x && block.y >= r.min.y && block.y <= r.max.y && block.z >= r.min.z && block.z <= r.max.z) gravar("reator", c, { ...r, ok: false });
    }
  });
  registrarDetalhe("cl:controlador_reator", (c) => {
    const r = lerR(c);
    if (!r.ok) return { translate: "cl.br.invalido", with: [""] };
    return { translate: "cl.br.estado", with: [String(Math.round(r.comb)), String(Math.round(r.cian)), `${Math.round(insercao(c.dimension, r) * 100)}%`, rf(r.ultimo)] };
  });
  registrarDetalhe("cl:barra_controle", (b) => ({ translate: "cl.br.insercao", with: [`${lerEstado<number>(b, "cl:insercao") * 10}%`] }));
  registrarNoCatalogo(() => [
    {
      maquina: { translate: "tile.cl:reprocessador_cianita.name" }, maquinaId: "cl:reprocessador_cianita",
      entradas: [{ item: "cl:lingote_cianita", qtd: 2 }, { item: "minecraft:water_bucket", qtd: 1 }], saidas: [{ item: "cl:lingote_blutonio", qtd: 1 }],
    },
    {
      maquina: { translate: "tile.cl:controlador_reator.name" }, maquinaId: "cl:controlador_reator",
      entradas: [{ item: "cl:lingote_yellorium", qtd: 1 }], saidas: [{ item: "cl:lingote_cianita", qtd: 1 }], nota: { translate: "cl.br.porta" },
    },
  ]);
}

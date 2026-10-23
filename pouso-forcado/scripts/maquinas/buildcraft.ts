import { Block, ItemStack, system, world } from "@minecraft/server";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { lerEstado } from "../util/blocos.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";
import { cabe, entrada, entregar, gastarCE, inventarioVizinho, tirar } from "../util/maquina.js";
import { gerar } from "../util/rede.js";
import { toqueNovo } from "../util/toque.js";
import { feito, maquina } from "./thermal.js";

/*
 * BuildCraft (1.3.0). O petróleo é um bloco (o Bedrock não tem líquido próprio): poços no deserto
 * (scripts/mundo/minerios.ts), pegos com balde ou pela Bomba.
 * - Bomba: procura petróleo embaixo dela (até 64 blocos) e esvazia o poço bloco a bloco, enchendo os
 *   baldes vazios de um baú encostado. 1 E por balde.
 * - Refinaria: petróleo → combustível. 1 E.
 * - Motor a Combustão: queima combustível (60 E) ou petróleo (20 E) do baú de cima, 2 E a cada 5 s na rede.
 * - Pedreira: cava 9x9 atrás dela (como no BuildCraft), uma camada por vez, do nível dela até o fundo do
 *   mundo, 1 bloco a cada 2 s. Os blocos vão para o baú de cima. 0,25 E por bloco.
 */
const PETROLEO = "cl:petroleo";
const MOTOR = { combustivel: 60, petroleo: 20, porCiclo: 2 };
const LADO = 9;

// ---------- Petróleo e balde ----------
function registrarBalde(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "minecraft:bucket" || ev.block.typeId !== PETROLEO || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    system.run(() => {
      if (b.typeId !== PETROLEO) return;
      b.setType("minecraft:air");
      gastarDaMao(j);
      darAoJogador(j, "cl:balde_petroleo", 1);
      j.playSound("bucket.fill_lava");
    });
  });
}

// ---------- Bomba ----------
function acharPetroleo(b: Block): Block | undefined {
  let p: Block | undefined = b.below();
  for (let k = 0; k < 64 && p; k++, p = p.below()) {
    if (p.typeId !== PETROLEO) continue;
    // Esvazia o poço do fundo para cima: anda pelos vizinhos de petróleo e pega o último achado.
    const vistos = new Set<string>();
    const fila = [p];
    let ultimo = p;
    while (fila.length && vistos.size < 128) {
      const c = fila.shift()!;
      const k2 = `${c.x},${c.y},${c.z}`;
      if (vistos.has(k2)) continue;
      vistos.add(k2);
      ultimo = c;
      for (const v of [c.below(), c.north(), c.south(), c.east(), c.west(), c.above()]) if (v?.typeId === PETROLEO) fila.push(v);
    }
    return ultimo;
  }
  return undefined;
}
export const bomba = maquina((b) => {
  const bau = inventarioVizinho(b);
  if (!bau) return "parada";
  let temBalde = false;
  for (let s = 0; s < bau.size && !temBalde; s++) temBalde = bau.getItem(s)?.typeId === "minecraft:bucket";
  const alvo = temBalde ? acharPetroleo(b) : undefined;
  if (!alvo) return "parada";
  if (!gastarCE(b, 100)) return "sem_energia";
  alvo.setType("minecraft:air");
  tirar(bau, "minecraft:bucket");
  const sobra = bau.addItem(new ItemStack("cl:balde_petroleo", 1));
  if (sobra) b.dimension.spawnItem(sobra, b.center());
  feito(b, "bucket.fill_lava");
  return "ok";
}, "cl.bc2.bomba");

// ---------- Refinaria ----------
export const refinaria = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  let tem = false;
  for (let s = 0; s < ent.size && !tem; s++) tem = ent.getItem(s)?.typeId === "cl:balde_petroleo";
  if (!tem) return "parada";
  if (!gastarCE(b, 100)) return "sem_energia";
  tirar(ent, "cl:balde_petroleo");
  entregar(b, [new ItemStack("cl:balde_combustivel", 1)]);
  feito(b, "fire.fire");
  return "ok";
}, "cl.bc2.refinaria");

// ---------- Motor a Combustão ----------
export const motor = {
  onTick(e: { block: Block }) {
    const b = e.block;
    let guardado = ler<number>("motor", b, 0);
    if (guardado < MOTOR.porCiclo) {
      const ent = entrada(b);
      if (ent && tirar(ent, "cl:balde_combustivel")) guardado += MOTOR.combustivel;
      else if (ent && tirar(ent, "cl:balde_petroleo")) guardado += MOTOR.petroleo;
      else {
        gravar("motor", b, guardado || undefined);
        return;
      }
      const sobra = ent.addItem(new ItemStack("minecraft:bucket", 1));
      if (sobra) b.dimension.spawnItem(sobra, b.center());
    }
    const foi = gerar(b, Math.min(MOTOR.porCiclo, guardado));
    gravar("motor", b, guardado - foi || undefined);
    if (foi) {
      b.dimension.spawnParticle("minecraft:basic_smoke_particle", { x: b.x + 0.5, y: b.y + 1.1, z: b.z + 0.5 });
      const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
      if (j) registrarAcao(j, "motor");
    }
  },
  onPlayerInteract(e: { block: Block; player?: import("@minecraft/server").Player }) {
    if (e.player) aviso(e.player, { translate: "cl.bc2.motor", with: [rf(ler<number>("motor", e.block, 0))] }, 5);
  },
};

// ---------- Pedreira ----------
const ATRAS: Readonly<Record<string, [number, number]>> = { north: [0, 1], south: [0, -1], east: [-1, 0], west: [1, 0] };
const PULA = new Set(["minecraft:air", "minecraft:bedrock", "minecraft:water", "minecraft:flowing_water", "minecraft:lava", "minecraft:flowing_lava", PETROLEO]);
const SOLTA: Readonly<Record<string, [string, number]>> = {
  "minecraft:stone": ["minecraft:cobblestone", 1], "minecraft:deepslate": ["minecraft:cobbled_deepslate", 1], "minecraft:grass_block": ["minecraft:dirt", 1],
  "minecraft:coal_ore": ["minecraft:coal", 1], "minecraft:deepslate_coal_ore": ["minecraft:coal", 1],
  "minecraft:iron_ore": ["minecraft:raw_iron", 1], "minecraft:deepslate_iron_ore": ["minecraft:raw_iron", 1],
  "minecraft:gold_ore": ["minecraft:raw_gold", 1], "minecraft:deepslate_gold_ore": ["minecraft:raw_gold", 1],
  "minecraft:copper_ore": ["minecraft:raw_copper", 3], "minecraft:deepslate_copper_ore": ["minecraft:raw_copper", 3],
  "minecraft:redstone_ore": ["minecraft:redstone", 4], "minecraft:lit_redstone_ore": ["minecraft:redstone", 4], "minecraft:deepslate_redstone_ore": ["minecraft:redstone", 4],
  "minecraft:lapis_ore": ["minecraft:lapis_lazuli", 4], "minecraft:deepslate_lapis_ore": ["minecraft:lapis_lazuli", 4],
  "minecraft:diamond_ore": ["minecraft:diamond", 1], "minecraft:deepslate_diamond_ore": ["minecraft:diamond", 1],
  "minecraft:emerald_ore": ["minecraft:emerald", 1], "minecraft:deepslate_emerald_ore": ["minecraft:emerald", 1],
};
type Cursor = { a: number; c: number; y: number; fim?: boolean };
function oQueSolta(id: string): ItemStack | undefined {
  const [item, n] = SOLTA[id] ?? [id, 1];
  try {
    return new ItemStack(item, n);
  } catch {
    return undefined; // bloco sem item (fogo, folha de planta...)
  }
}
export const pedreira = {
  onTick(e: { block: Block }) {
    const b = e.block;
    const cur = ler<Cursor>("pedreira", b, { a: 1, c: -4, y: b.y });
    if (cur.fim) return;
    const [fx, fz] = ATRAS[lerEstado<string>(b, "minecraft:cardinal_direction")] ?? [0, 1];
    const fundo = b.dimension.heightRange.min + 1;
    const bau = entrada(b);
    if (!bau) return;
    // Anda pelo cursor até achar um bloco para cavar (no máximo uma camada por vez).
    for (let passos = 0; passos < LADO * LADO; passos++) {
      const x = b.x + fx * cur.a + (fz !== 0 ? cur.c : 0), z = b.z + fz * cur.a + (fx !== 0 ? cur.c : 0);
      let alvo: Block | undefined;
      try {
        alvo = b.dimension.getBlock({ x, y: cur.y, z });
      } catch {
        return; // fora do mundo carregado: tenta de novo depois
      }
      if (!alvo) return;
      const id = alvo.typeId;
      if (!PULA.has(id) && !id.startsWith("cl:")) {
        const item = oQueSolta(id);
        if (item && bau.emptySlotsCount === 0) return;
        if (!gastarCE(b, 25)) return;
        alvo.setType("minecraft:air");
        if (item) bau.addItem(item);
        const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 32, closest: 1 })[0];
        if (j) registrarAcao(j, "pedreira");
        avancar(cur, fundo);
        gravar("pedreira", b, cur);
        return;
      }
      avancar(cur, fundo);
      if (cur.fim) break;
    }
    gravar("pedreira", b, cur);
  },
  onPlayerInteract(e: { block: Block; player?: import("@minecraft/server").Player }) {
    if (!e.player) return;
    const cur = ler<Cursor>("pedreira", e.block, { a: 1, c: -4, y: e.block.y });
    aviso(e.player, cur.fim ? "cl.bc2.pedreira_fim" : { translate: "cl.bc2.pedreira", with: [String(cur.y)] }, 5);
  },
};
function avancar(cur: Cursor, fundo: number): void {
  cur.c++;
  if (cur.c > 4) {
    cur.c = -4;
    cur.a++;
  }
  if (cur.a > LADO) {
    cur.a = 1;
    cur.y--;
    if (cur.y < fundo) cur.fim = true;
  }
}

export function registrarBuildcraft(): void {
  registrarBalde();
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id === "cl:pedreira" || id === "cl:motor_combustao") gravar(id === "cl:pedreira" ? "pedreira" : "motor", block, undefined);
  });
  registrarDetalhe(PETROLEO, () => ({ translate: "cl.bc2.petroleo" }));
  registrarDetalhe("cl:motor_combustao", (b) => ({ translate: "cl.olhar.combustivel", with: [rf(ler<number>("motor", b, 0))] }));
  registrarNoCatalogo(() => [
    { maquina: { translate: "tile.cl:refinaria.name" }, maquinaId: "cl:refinaria", entradas: [{ item: "cl:balde_petroleo", qtd: 1 }], saidas: [{ item: "cl:balde_combustivel", qtd: 1 }] },
    { maquina: { translate: "tile.cl:bomba.name" }, maquinaId: "cl:bomba", entradas: [{ item: "minecraft:bucket", qtd: 1 }], saidas: [{ item: "cl:balde_petroleo", qtd: 1 }], nota: { translate: "cl.bc2.bomba" } },
  ]);
}

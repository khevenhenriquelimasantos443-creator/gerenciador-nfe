import { Block, BlockCustomComponent, BlockVolume, ItemStack, RawMessage, system, world } from "@minecraft/server";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { vizinhos } from "../util/blocos.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, primeiro, tirar } from "../util/maquina.js";

/*
 * Create (1.9.0): rotação e estresse com os números do Create. Fontes dão capacidade em SU por RPM (Manivela 8 a 32 RPM
 * enquanto é girada, Roda d'Água 32 a 8 RPM com água encostada, Rolamento de Moinho 512 por RPM com 1 RPM a cada 8
 * Velas por perto); máquinas gastam SU por RPM (Prensa e Rodas Trituradoras 8; Mó, Misturador e Furadeira 4;
 * Ventilador 2). A rede roda no RPM da fonte mais rápida (ou no do Controlador de Velocidade); se o estresse passar da
 * capacidade, tudo para (sobrecarga). Eixos e engrenagens que giram trocam para a textura do rotor animado.
 * Simplificações: as peças ligam com qualquer vizinha (sem conferir o eixo) e todas giram no mesmo RPM.
 * O trabalho das máquinas anda RPM a cada segundo: a 32 RPM a Prensa faz 1 chapa por segundo e a Mó 1 farinha a cada 2 s.
 * Custo: cada máquina, a cada segundo, percorre a rede (até 128 peças); o resultado vale para toda a rede naquele tick.
 */
const TRANSMISSORES = new Set(["cl:eixo", "cl:engrenagem", "cl:engrenagem_grande", "cl:caixa_engrenagens"]);
const CONTROLADOR = "cl:controlador_velocidade";
const IMPACTO: Readonly<Record<string, number>> = {
  "cl:mo": 4, "cl:rodas_trituradoras": 8, "cl:prensa_mecanica": 8, "cl:misturador_mecanico": 4, "cl:ventilador": 2, "cl:furadeira": 4,
};
const FONTES = new Set(["cl:manivela", "cl:roda_dagua", "cl:rolamento_moinho"]);
const CINETICOS = new Set([...TRANSMISSORES, ...FONTES, CONTROLADOR, ...Object.keys(IMPACTO)]);
const VELOCIDADES = [16, 32, 64, 128, 256];
const MAX_PECAS = 128;
const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;

// ---------- Fontes ----------
const girada = new Map<string, number>(); // manivela → tick do último toque
const AGUA = new Set(["minecraft:water", "minecraft:flowing_water"]);
function velas(b: Block): number {
  let n = 0;
  const r = 4;
  for (const _ of b.dimension.getBlocks(new BlockVolume({ x: b.x - r, y: b.y - r, z: b.z - r }, { x: b.x + r, y: b.y + r, z: b.z + r }), { includeTypes: ["cl:vela_moinho"] }, true).getBlockLocationIterator()) n++;
  return n;
}
function fonte(b: Block): { rpm: number; cap: number } | undefined {
  if (b.typeId === "cl:manivela") return system.currentTick - (girada.get(chave(b)) ?? -999) <= 40 ? { rpm: 32, cap: 8 } : undefined;
  if (b.typeId === "cl:roda_dagua") return vizinhos(b).some((v) => AGUA.has(v.typeId)) ? { rpm: 8, cap: 32 } : undefined;
  if (b.typeId === "cl:rolamento_moinho") {
    const rpm = Math.min(256, Math.floor(velas(b) / 8));
    return rpm > 0 ? { rpm, cap: 512 } : undefined;
  }
  return undefined;
}

// ---------- A rede ----------
type Rede = { rpm: number; cap: number; estresse: number; sobrecarga: boolean; t: number };
const cache = new Map<string, Rede>();
function definirGiro(b: Block, sim: boolean): void {
  try {
    if (b.permutation.getState("cl:girando" as never) !== sim) b.setPermutation(b.permutation.withState("cl:girando" as never, sim as never));
  } catch {
    // peça sem o estado
  }
}
export function rede(origem: Block): Rede {
  const c = cache.get(chave(origem));
  if (c && c.t === system.currentTick) return c;
  const vistos = new Map<string, Block>([[chave(origem), origem]]);
  const fila = [origem];
  while (fila.length && vistos.size < MAX_PECAS) {
    const b = fila.shift()!;
    for (const v of vizinhos(b)) {
      if (!CINETICOS.has(v.typeId) || vistos.has(chave(v))) continue;
      vistos.set(chave(v), v);
      fila.push(v);
    }
  }
  let cap = 0, rpm = 0, impacto = 0, controlada: number | undefined;
  for (const b of vistos.values()) {
    const f = FONTES.has(b.typeId) ? fonte(b) : undefined;
    if (f) {
      cap += f.cap * f.rpm;
      rpm = Math.max(rpm, f.rpm);
    }
    if (b.typeId === CONTROLADOR) controlada = ler<number>("rpm", b, 32);
    impacto += IMPACTO[b.typeId] ?? 0;
  }
  if (rpm > 0 && controlada) rpm = controlada;
  const estresse = impacto * rpm;
  const sobrecarga = rpm > 0 && estresse > cap;
  const r: Rede = { rpm: sobrecarga ? 0 : rpm, cap, estresse, sobrecarga, t: system.currentTick };
  for (const [k, b] of vistos) {
    cache.set(k, r);
    if (TRANSMISSORES.has(b.typeId)) definirGiro(b, r.rpm > 0);
  }
  return r;
}
const estado = (r: Rede): RawMessage =>
  r.sobrecarga ? { translate: "cl.cr.sobrecarga", with: [String(r.estresse), String(r.cap)] }
  : r.rpm > 0 ? { translate: "cl.cr.rede", with: [String(r.rpm), String(r.estresse), String(r.cap)] }
  : { translate: "cl.cr.parada" };

// ---------- Máquinas ----------
type Saida = ReadonlyArray<[string, number, number]>; // item, quantidade, chance
const CRUS: ReadonlyArray<[string, string]> = [["ferro", "iron"], ["ouro", "gold"], ["cobre", "copper"]];
export const MO: Readonly<Record<string, Saida>> = {
  "minecraft:wheat": [["cl:farinha", 1, 1], ["cl:farinha", 1, 0.25], ["minecraft:wheat_seeds", 1, 0.25]],
  "minecraft:cobblestone": [["minecraft:gravel", 1, 1]],
  "minecraft:gravel": [["minecraft:flint", 1, 1]],
  "minecraft:bone": [["minecraft:bone_meal", 3, 1], ["minecraft:white_dye", 1, 0.25]],
  "minecraft:sugar_cane": [["minecraft:sugar", 2, 1]],
  ...Object.fromEntries(CRUS.map(([pt, en]): [string, Saida] => [`minecraft:raw_${en}`, [[`cl:triturado_${pt}`, 1, 1]]])),
};
export const RODAS: Readonly<Record<string, Saida>> = {
  ...Object.fromEntries(CRUS.flatMap(([pt, en]): Array<[string, Saida]> => [
    [`minecraft:raw_${en}`, [[`cl:triturado_${pt}`, 1, 1]]],
    [`minecraft:${en}_ore`, [[`cl:triturado_${pt}`, 1, 1], [`cl:triturado_${pt}`, 1, 0.75], ["minecraft:cobblestone", 1, 0.12]]],
    [`minecraft:deepslate_${en}_ore`, [[`cl:triturado_${pt}`, 2, 1], [`cl:triturado_${pt}`, 1, 0.25], ["minecraft:cobbled_deepslate", 1, 0.12]]],
  ])),
  "minecraft:cobblestone": [["minecraft:gravel", 1, 1]],
  "minecraft:gravel": [["minecraft:sand", 1, 1], ["minecraft:flint", 1, 0.1]],
  "minecraft:white_wool": [["minecraft:string", 2, 1], ["minecraft:string", 1, 0.5]],
};
export const PRENSA: Readonly<Record<string, string>> = {
  "minecraft:iron_ingot": "cl:chapa_ferro", "minecraft:copper_ingot": "cl:chapa_cobre", "minecraft:gold_ingot": "cl:chapa_ouro", "cl:lingote_latao": "cl:chapa_latao",
};
export const MISTURAS: ReadonlyArray<{ entra: ReadonlyArray<[string, number]>; sai: [string, number] }> = [
  { entra: [["minecraft:copper_ingot", 1], ["cl:lingote_zinco", 1]], sai: ["cl:lingote_latao", 2] },
  { entra: [["minecraft:andesite", 1], ["minecraft:iron_nugget", 1]], sai: ["cl:liga_andesita", 1] },
];

/** Máquina do Create: o trabalho anda o RPM da rede a cada segundo; ao passar de `custo`, faz uma operação. */
function maquinaCreate(custo: number, fazer: (b: Block) => boolean): BlockCustomComponent {
  return {
    onTick(e) {
      const b = e.block;
      const r = rede(b);
      if (r.rpm <= 0) return;
      let t = ler<number>("trabalho", b, 0) + r.rpm;
      if (t < custo) return void gravar("trabalho", b, t);
      t -= custo;
      if (!fazer(b)) t = 0;
      gravar("trabalho", b, Math.min(t, custo));
    },
    onPlayerInteract(e) {
      if (e.player) aviso(e.player, estado(rede(e.block)), 4);
    },
  };
}
function processar(tabela: Readonly<Record<string, Saida>>, som: string) {
  return (b: Block): boolean => {
    const ent = entrada(b);
    const p = ent && primeiro(ent, (id) => tabela[id] !== undefined);
    if (!ent || !p || !cabe(b)) return false;
    tirar(ent, p.typeId);
    entregar(b, tabela[p.typeId].filter(([, , c]) => Math.random() < c).map(([id, n]) => new ItemStack(id, n)));
    b.dimension.playSound(som, b.center(), { volume: 0.3 });
    return true;
  };
}
export const mo = maquinaCreate(64, processar(MO, "dig.stone"));
export const rodas = maquinaCreate(32, processar(RODAS, "dig.gravel"));
export const prensa = maquinaCreate(32, (b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => PRENSA[id] !== undefined);
  if (!ent || !p || !cabe(b)) return false;
  tirar(ent, p.typeId);
  entregar(b, [new ItemStack(PRENSA[p.typeId], 1)]);
  b.dimension.playSound("random.anvil_land", b.center(), { volume: 0.25, pitch: 1.4 });
  return true;
});
export const misturador = maquinaCreate(64, (b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return false;
  const r = MISTURAS.find((x) => x.entra.every(([id, n]) => contar(ent, id) >= n));
  if (!r) return false;
  for (const [id, n] of r.entra) tirar(ent, id, n);
  entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
  b.dimension.playSound("bucket.fill_water", b.center(), { volume: 0.25 });
  return true;
});

// Frente da máquina: o lado para onde ela foi virada ao ser posta.
function frente(b: Block): { dx: number; dz: number } {
  const d = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string;
  return d === "south" ? { dx: 0, dz: 1 } : d === "west" ? { dx: -1, dz: 0 } : d === "east" ? { dx: 1, dz: 0 } : { dx: 0, dz: -1 };
}

// Ventilador: soprando por água lava; por lava ou fogo, cozinha (o "processamento em massa" do Create).
const LAVAR: Readonly<Record<string, Saida>> = {
  "cl:triturado_ferro": [["minecraft:iron_nugget", 9, 1]],
  "cl:triturado_ouro": [["minecraft:gold_nugget", 9, 1]],
  "minecraft:gravel": [["minecraft:flint", 1, 0.25], ["minecraft:iron_nugget", 1, 0.125]],
  "minecraft:sand": [["minecraft:clay_ball", 1, 0.25]],
};
const COZINHAR: Readonly<Record<string, string>> = {
  "cl:triturado_ferro": "minecraft:iron_ingot", "cl:triturado_ouro": "minecraft:gold_ingot", "cl:triturado_cobre": "minecraft:copper_ingot", "cl:triturado_zinco": "cl:lingote_zinco",
  "minecraft:raw_iron": "minecraft:iron_ingot", "minecraft:raw_gold": "minecraft:gold_ingot", "minecraft:raw_copper": "minecraft:copper_ingot",
  "minecraft:sand": "minecraft:glass", "minecraft:cobblestone": "minecraft:stone", "minecraft:clay_ball": "minecraft:brick", "minecraft:cactus": "minecraft:green_dye",
  "minecraft:beef": "minecraft:cooked_beef", "minecraft:porkchop": "minecraft:cooked_porkchop", "minecraft:chicken": "minecraft:cooked_chicken",
  "minecraft:mutton": "minecraft:cooked_mutton", "minecraft:oak_log": "minecraft:charcoal",
};
const CALOR = new Set(["minecraft:lava", "minecraft:flowing_lava", "minecraft:fire", "minecraft:magma", "minecraft:campfire"]);
export const ventilador = maquinaCreate(20, (b) => {
  const { dx, dz } = frente(b);
  let modo: "lavar" | "cozinhar" | undefined;
  for (let k = 1; k <= 4 && !modo; k++) {
    const t = b.dimension.getBlock({ x: b.x + dx * k, y: b.y, z: b.z + dz * k })?.typeId ?? "";
    if (AGUA.has(t)) modo = "lavar";
    else if (CALOR.has(t)) modo = "cozinhar";
  }
  if (!modo) return true;
  const centro = { x: b.x + 0.5 + dx * 2.5, y: b.y + 0.5, z: b.z + 0.5 + dz * 2.5 };
  let feitos = 0;
  for (const e of b.dimension.getEntities({ type: "minecraft:item", location: centro, maxDistance: 2.6 })) {
    const pilha = e.getComponent("minecraft:item")?.itemStack;
    if (!pilha) continue;
    const local = e.location;
    if (modo === "lavar") {
      const s = LAVAR[pilha.typeId];
      if (!s) continue;
      e.remove();
      for (const [id, n, c] of s) {
        let q = 0;
        for (let k = 0; k < pilha.amount; k++) if (Math.random() < c) q += n;
        if (q) b.dimension.spawnItem(new ItemStack(id, Math.min(64, q)), local);
      }
    } else {
      const s = COZINHAR[pilha.typeId];
      if (!s) continue;
      e.remove();
      b.dimension.spawnItem(new ItemStack(s, pilha.amount), local);
    }
    feitos += pilha.amount;
  }
  if (feitos && modo === "lavar") {
    const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
    if (j) for (let k = 0; k < Math.min(feitos, 8); k++) registrarAcao(j, "lavar");
  }
  return true;
});

// Furadeira: quebra o bloco da frente (soltando o que ele dá), mais rápido quanto maior o RPM.
const INQUEBRAVEIS = new Set(["minecraft:air", "minecraft:bedrock", "minecraft:barrier", "minecraft:water", "minecraft:lava", "minecraft:flowing_water", "minecraft:flowing_lava"]);
export const furadeira = maquinaCreate(64, (b) => {
  const { dx, dz } = frente(b);
  const alvo = b.dimension.getBlock({ x: b.x + dx, y: b.y, z: b.z + dz });
  if (!alvo || INQUEBRAVEIS.has(alvo.typeId) || alvo.typeId.startsWith("cl:painel_nave")) return true;
  b.dimension.runCommand(`setblock ${alvo.x} ${alvo.y} ${alvo.z} air destroy`);
  return true;
});

// ---------- Fontes e controlador (toque) ----------
export const manivela: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    girada.set(chave(e.block), system.currentTick);
    if (!j) return;
    j.playSound("random.click", { volume: 0.4, pitch: 0.8 });
    const r = rede(e.block);
    aviso(j, r.sobrecarga ? estado(r) : { translate: "cl.cr.manivela" }, 2);
    if (r.estresse > 0 && !r.sobrecarga) registrarAcao(j, "manivela");
  },
};
export const fonteGenerica: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    if (b.typeId !== "cl:rolamento_moinho") return;
    const n = velas(b);
    if (n >= 16) {
      const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
      if (j && j.getDynamicProperty("cl:moinho16") !== true) {
        j.setDynamicProperty("cl:moinho16", true);
        registrarAcao(j, "moinho16");
      }
    }
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    if (b.typeId === "cl:rolamento_moinho") {
      const n = velas(b), rpm = Math.min(256, Math.floor(n / 8));
      return aviso(j, { translate: "cl.cr.moinho", with: [String(n), String(rpm), String(512 * rpm)] }, 5);
    }
    aviso(j, estado(rede(b)), 4);
  },
};
export const controlador: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    const atual = ler<number>("rpm", e.block, 32);
    const novo = VELOCIDADES[(VELOCIDADES.indexOf(atual) + 1) % VELOCIDADES.length];
    gravar("rpm", e.block, novo);
    if (j) aviso(j, { translate: "cl.cr.velocidade", with: [String(novo)] }, 3);
  },
};

export function registrarCreate(): void {
  registrarDetalhe([...Object.keys(IMPACTO), ...FONTES, CONTROLADOR], (b) => {
    const r = rede(b);
    return { text: r.sobrecarga ? `§c${r.estresse}/${r.cap} SU` : `§7${r.rpm} RPM, ${r.estresse}/${r.cap} SU` };
  });
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    const tab = (id: string, t: Readonly<Record<string, Saida>>) => {
      for (const [de, s] of Object.entries(t)) r.push({ ...m(id), entradas: [{ item: de, qtd: 1 }], saidas: s.map(([item, qtd, chance]) => ({ item, qtd, ...(chance < 1 ? { chance } : {}) })) });
    };
    tab("cl:mo", MO);
    tab("cl:rodas_trituradoras", RODAS);
    tab("cl:ventilador", LAVAR);
    for (const [de, sai] of Object.entries(PRENSA)) r.push({ ...m("cl:prensa_mecanica"), entradas: [{ item: de, qtd: 1 }], saidas: [{ item: sai, qtd: 1 }] });
    for (const x of MISTURAS) r.push({ ...m("cl:misturador_mecanico"), entradas: x.entra.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }] });
    return r;
  });
  world.afterEvents.playerLeave.subscribe(() => cache.clear());
}

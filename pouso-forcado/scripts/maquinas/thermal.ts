import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, ItemStack, RawMessage } from "@minecraft/server";
import { THERMAL } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { creditar } from "../blocos/energia.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { particula } from "../util/efeitos.js";
import { rf, rfPorTick } from "../util/energia.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";
import { cabe, contar, entrada, entregar, gastarCE, primeiro, saida, tirar } from "../util/maquina.js";
import { capacidadeDe, cargaDe, gerar } from "../util/rede.js";

/*
 * Máquinas do Thermal Expansion (Fase 17). Todas com minecraft:tick de 100 ticks (5 s):
 * puxam do inventário em cima, põem no de baixo (ou soltam ao lado) e gastam energia da rede
 * (baterias e Células de Energia ligadas por cabo). Valores em THERMAL (config.ts).
 * Toque com a mão vazia para ver o estado.
 */
const nome = (b: Block): RawMessage => ({ translate: b.localizationKey });
const ultimo = new Map<string, string>(); // estado mais recente de cada máquina (para o toque)
const chave = (b: Block) => `${b.x},${b.y},${b.z}`;

function feito(b: Block, som = "random.click"): void {
  ultimo.set(chave(b), "ok");
  b.dimension.playSound(som, b.center(), { volume: 0.3 });
  particula(b.dimension, "cl:energia", { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 });
  creditar(b, "te_operacao");
}

function maquina(processar: (b: Block) => "ok" | "parada" | "sem_energia", dica?: string): BlockCustomComponent {
  return {
    onTick(e) {
      ultimo.set(chave(e.block), processar(e.block));
    },
    onPlayerInteract(e: BlockComponentPlayerInteractEvent) {
      if (!e.player) return;
      const s = ultimo.get(chave(e.block)) ?? "parada";
      if (s === "sem_energia") return aviso(e.player, "cl.te.sem_energia", 4);
      if (s === "parada") return aviso(e.player, dica ?? { translate: "cl.te.parada", with: { rawtext: [nome(e.block)] } }, 5);
      aviso(e.player, { translate: "cl.te.trabalhando", with: [rf(1)] }, 4);
    },
  };
}

// ---------- Pulverizador ----------
export const pulverizador = maquina((b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => THERMAL.pulverizador[id] !== undefined);
  if (!ent || !p || !cabe(b)) return "parada";
  if (!gastarCE(b, THERMAL.pulverizadorCE)) return "sem_energia";
  tirar(ent, p.typeId);
  const saidas = THERMAL.pulverizador[p.typeId].filter(([, , chance]) => Math.random() < chance).map(([id, n]) => new ItemStack(id, n));
  entregar(b, saidas);
  feito(b, "dig.gravel");
  if (p.typeId.includes("ore") || p.typeId.startsWith("minecraft:raw_")) {
    const quem = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
    if (quem) registrarAcao(quem, "pulverizar");
  }
  return "ok";
});

// ---------- Fornalha de Redstone ----------
const PEDACO = /^cl:(ferro|ouro|cobre|estanho)_(quebrado|triturado|po)$/;
const LINGOTE: Readonly<Record<string, string>> = { ferro: "minecraft:iron_ingot", ouro: "minecraft:gold_ingot", cobre: "minecraft:copper_ingot", estanho: "cl:lingote_estanho" };
export const fornalhaRedstone = maquina((b) => {
  const ent = entrada(b);
  if (!ent) return "parada";
  let fez = 0;
  for (let k = 0; k < THERMAL.fornalhaPorCiclo; k++) {
    const p = primeiro(ent, (id) => THERMAL.fornalha[id] !== undefined || (PEDACO.test(id) && contar(ent, id) >= 4));
    if (!p || !cabe(b)) break;
    if (!gastarCE(b, THERMAL.fornalhaCE)) return fez ? "ok" : "sem_energia";
    const pedaco = PEDACO.exec(p.typeId);
    if (pedaco) {
      tirar(ent, p.typeId, 4);
      entregar(b, [new ItemStack(LINGOTE[pedaco[1]], 1)]);
    } else {
      tirar(ent, p.typeId);
      entregar(b, [new ItemStack(THERMAL.fornalha[p.typeId], 1)]);
    }
    fez++;
  }
  if (!fez) return "parada";
  feito(b, "fire.fire");
  return "ok";
});

// ---------- Fundidora de Indução ----------
export const fundidoraInducao = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const r = THERMAL.fundidora.find((x) => x.entra.every(([id, n]) => contar(ent, id) >= n));
  if (!r) return "parada";
  if (!gastarCE(b, r.ce)) return "sem_energia";
  for (const [id, n] of r.entra) tirar(ent, id, n);
  entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
  feito(b, "random.fizz");
  return "ok";
});

// ---------- Serraria ----------
export const serraria = maquina((b) => {
  const ent = entrada(b);
  const p = ent && primeiro(ent, (id) => THERMAL.serraria[id] !== undefined);
  if (!ent || !p || !cabe(b)) return "parada";
  if (!gastarCE(b, THERMAL.serrariaCE)) return "sem_energia";
  tirar(ent, p.typeId);
  const sai = [new ItemStack(THERMAL.serraria[p.typeId], 6)];
  if (Math.random() < THERMAL.serragemChance) sai.push(new ItemStack("cl:serragem", 1));
  entregar(b, sai);
  feito(b, "dig.wood");
  return "ok";
});

// ---------- Extrusora Ígnea e Precipitador Glacial ----------
const encostados = (b: Block) => [b.north(), b.south(), b.east(), b.west(), b.above(), b.below()].map((v) => v?.typeId ?? "");
const tem = (b: Block, nomes: string[]) => encostados(b).some((id) => nomes.includes(id));
const LAVA = ["minecraft:lava", "minecraft:flowing_lava"], AGUA = ["minecraft:water", "minecraft:flowing_water"];

export const extrusora = maquina((b) => {
  if (!tem(b, LAVA) || !tem(b, AGUA) || !cabe(b)) return "parada";
  entregar(b, [new ItemStack("minecraft:cobblestone", THERMAL.extrusoraPorCiclo)]);
  feito(b, "random.fizz");
  return "ok";
}, "cl.te.extrusora");

export const precipitador = maquina((b) => {
  if (!tem(b, AGUA) || !cabe(b)) return "parada";
  if (!gastarCE(b, THERMAL.precipitadorCE)) return "sem_energia";
  entregar(b, [new ItemStack("minecraft:snowball", THERMAL.precipitadorBolas)]);
  feito(b, "random.glass");
  return "ok";
}, "cl.te.precipitador");

// ---------- Dínamo de Redstone e Células ----------
export const dinamo: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    let comb = ler<number>("dinamo", b, 0);
    const ent = entrada(b);
    if (ent && comb < THERMAL.dinamo.max - 144) {
      const p = primeiro(ent, (id) => THERMAL.dinamo.combustivel[id] !== undefined);
      if (p) {
        tirar(ent, p.typeId);
        comb += THERMAL.dinamo.combustivel[p.typeId];
      }
    }
    if (comb > 0) {
      const g = gerar(b, Math.min(comb, THERMAL.dinamo.porCiclo));
      if (g > 0) particula(b.dimension, "cl:energia", { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 });
      comb -= g;
    }
    gravar("dinamo", b, comb);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    let comb = ler<number>("dinamo", e.block, 0);
    const mao = itemNaMao(j);
    const valor = mao ? THERMAL.dinamo.combustivel[mao.typeId] : undefined;
    if (valor && comb + valor <= THERMAL.dinamo.max) {
      gastarDaMao(j);
      comb += valor;
      gravar("dinamo", e.block, comb);
      registrarAcao(j, "dinamo");
    }
    aviso(j, { translate: "cl.te.dinamo", with: [rf(comb), rfPorTick(THERMAL.dinamo.porCiclo)] });
  },
};

export const celulaEnergia: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, { translate: "cl.te.celula", with: [rf(cargaDe(e.block)), rf(capacidadeDe(e.block))] });
  },
};

export function registrarThermal(): void {
  registrarDetalhe(["cl:celula_energia_basica", "cl:celula_energia_reforcada", "cl:celula_energia_redstone", "cl:celula_energia_ressonante"], (b) => ({
    translate: "cl.olhar.energia",
    with: [rf(cargaDe(b)), rf(capacidadeDe(b))],
  }));
  registrarDetalhe("cl:dinamo_redstone", (b) => ({ translate: "cl.olhar.combustivel", with: [rf(ler<number>("dinamo", b, 0))] }));
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    for (const [de, saidas] of Object.entries(THERMAL.pulverizador))
      r.push({ ...m("cl:pulverizador"), entradas: [{ item: de, qtd: 1 }], saidas: saidas.map(([item, qtd, chance]) => ({ item, qtd, chance: chance < 1 ? chance : undefined })) });
    for (const [de, para] of Object.entries(THERMAL.fornalha)) r.push({ ...m("cl:fornalha_redstone"), entradas: [{ item: de, qtd: 1 }], saidas: [{ item: para, qtd: 1 }] });
    for (const [metal, lingote] of Object.entries(LINGOTE)) r.push({ ...m("cl:fornalha_redstone"), entradas: [{ item: `cl:${metal}_po`, qtd: 4 }], saidas: [{ item: lingote, qtd: 1 }] });
    for (const x of THERMAL.fundidora) r.push({ ...m("cl:fundidora_inducao"), entradas: x.entra.map(([item, qtd]) => ({ item, qtd })), saidas: [{ item: x.sai[0], qtd: x.sai[1] }] });
    for (const [de, para] of Object.entries(THERMAL.serraria))
      r.push({ ...m("cl:serraria"), entradas: [{ item: de, qtd: 1 }], saidas: [{ item: para, qtd: 6 }, { item: "cl:serragem", qtd: 1, chance: THERMAL.serragemChance }] });
    r.push({ ...m("cl:extrusora_ignea"), entradas: [], saidas: [{ item: "minecraft:cobblestone", qtd: 1 }], nota: { translate: "cl.te.extrusora" } });
    r.push({ ...m("cl:precipitador_glacial"), entradas: [], saidas: [{ item: "minecraft:snowball", qtd: THERMAL.precipitadorBolas }], nota: { translate: "cl.te.precipitador" } });
    return r;
  });
}

import { Block, BlockCustomComponent, ItemStack, Player, RawMessage, system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { AE } from "../config.js";
import { DADOS_F18 } from "../conteudo/gerado.js";
import { abrirInventarios, abrirTerminal } from "../blocos/terminal.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { procurarNaRede } from "../util/rede.js";
import { InventarioMapa, Mapa, registrarInventario } from "./virtual.js";

/*
 * Applied Energistics 1 + ExtraCells (Fase 18).
 * - Células ME 1k/4k/16k/64k: 1.024 a 65.536 bytes, até 63 tipos; cada tipo ocupa 8/32/128/512 bytes
 *   e cada 8 itens ocupam 1 byte (números do AE1). O conteúdo fica no próprio item (propriedade "me").
 * - Drive ME (10 células) e Baú ME (1 célula): toque com a célula para pôr; mão vazia no Drive = tirar;
 *   no Baú ME, mão vazia abre o conteúdo e agachado tira a célula. O Terminal vê as células ligadas.
 * - Ponto de Acesso + Terminal sem Fio: abre o Terminal da rede do ponto a até AE.alcanceSemFio blocos.
 * - Célula de Água (ExtraCells): guarda até AE.aguaMax garrafas; enche no condensador ou na água;
 *   usar com garrafas vazias na mochila dá Água Boa.
 */
type Celula = { id: string; itens: Mapa };
const CELULAS = DADOS_F18.celulas as Readonly<Record<string, { bytes: number; porTipo: number }>>;
const ehCelula = (id: string | undefined) => !!id && CELULAS[id] !== undefined;
const MAX: Readonly<Record<string, number>> = { "cl:drive_me": 10, "cl:bau_me": 1 };
const tipo = (b: Block) => (b.typeId === "cl:drive_me" ? "drive" : "baume");

function uso(c: Celula): { bytes: number; tipos: number; total: number } {
  const tipos = Object.keys(c.itens).length;
  const total = Object.values(c.itens).reduce((s, n) => s + n, 0);
  return { tipos, total, bytes: tipos * CELULAS[c.id].porTipo + Math.ceil(total / 8) };
}

/** Quantos `id` ainda cabem na célula. */
function cabe(c: Celula, id: string): number {
  const { bytes, porTipo } = CELULAS[c.id];
  const novo = c.itens[id] === undefined;
  const tipos = Object.keys(c.itens).length + (novo ? 1 : 0);
  if (tipos > AE.maxTipos) return 0;
  const total = Object.values(c.itens).reduce((s, n) => s + n, 0);
  return Math.max(0, (bytes - tipos * porTipo) * 8 - total);
}

function textoCelula(c: Celula): RawMessage {
  const u = uso(c);
  return { translate: "cl.ae.celula_info", with: { rawtext: [{ translate: `item.${c.id}.name` }, { text: String(u.bytes) }, { text: String(CELULAS[c.id].bytes) }, { text: String(u.tipos) }, { text: String(AE.maxTipos) }] } };
}

export function itemDaCelula(c: Celula): ItemStack {
  const i = new ItemStack(c.id, 1);
  if (Object.keys(c.itens).length) i.setDynamicProperty("me", JSON.stringify(c.itens));
  i.setLore([textoCelula(c)]);
  return i;
}

function celulaDoItem(i: ItemStack): Celula {
  try {
    return { id: i.typeId, itens: JSON.parse((i.getDynamicProperty("me") as string | undefined) ?? "{}") as Mapa };
  } catch {
    return { id: i.typeId, itens: {} };
  }
}

const lerCelulas = (b: Block) => ler<Celula[]>(tipo(b), b, []);

async function tirarCelula(j: Player, b: Block): Promise<void> {
  const cel = lerCelulas(b);
  if (cel.length === 0) return aviso(j, { translate: "cl.ae.drive", with: ["0", String(MAX[b.typeId])] }, 5);
  const form = new ActionFormData().title({ translate: "cl.ae.tirar_titulo" });
  for (const c of cel) form.button(textoCelula(c));
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  const agora = lerCelulas(b);
  const c = agora[r.selection];
  if (!c) return;
  agora.splice(r.selection, 1);
  gravar(tipo(b), b, agora);
  darAoJogador(j, itemDaCelula(c));
}

function porCelula(j: Player, b: Block): boolean {
  const mao = itemNaMao(j);
  if (!mao || !ehCelula(mao.typeId)) return false;
  const cel = lerCelulas(b);
  if (cel.length >= MAX[b.typeId]) {
    aviso(j, "cl.ae.cheio");
    return true;
  }
  cel.push(celulaDoItem(mao));
  gastarDaMao(j);
  gravar(tipo(b), b, cel);
  j.playSound("random.click", { pitch: 1.5 });
  aviso(j, { translate: "cl.ae.drive", with: [String(cel.length), String(MAX[b.typeId])] });
  registrarAcao(j, "celula_me");
  return true;
}

export const driveMe: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j || porCelula(j, e.block)) return;
    abrirUmMenu(j, () => tirarCelula(j, e.block));
  },
};

export const bauMe: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j || porCelula(j, e.block)) return;
    if (j.isSneaking) return abrirUmMenu(j, () => tirarCelula(j, e.block));
    if (lerCelulas(e.block).length === 0) return aviso(j, "cl.ae.bau", 5);
    const b = e.block;
    abrirUmMenu(j, () => abrirInventarios(j, b, () => inventarios(b)));
  },
};

function inventarios(b: Block): InventarioMapa[] {
  return lerCelulas(b).map(
    (c, k) =>
      new InventarioMapa(c.itens, (m, id) => cabe({ id: c.id, itens: m }, id), (m) => {
        const todas = lerCelulas(b);
        if (!todas[k]) return;
        todas[k].itens = m;
        gravar(tipo(b), b, todas);
      }),
  );
}

// ---------- Ponto de Acesso e Terminal sem Fio ----------
const pontos = () => JSON.parse((world.getDynamicProperty("cl:pontos_acesso") as string | undefined) ?? "[]") as string[];

export const pontoAcesso: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, { translate: "cl.ae.ponto", with: [String(AE.alcanceSemFio)] });
  },
};

function usarSemFio(j: Player): void {
  for (const k of pontos()) {
    const [dim, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
    if (dim !== j.dimension.id) continue;
    const [x, y, z] = xyz.split(",").map(Number);
    if (Math.hypot(x - j.location.x, y - j.location.y, z - j.location.z) > AE.alcanceSemFio) continue;
    const ponto = j.dimension.getBlock({ x, y, z });
    if (ponto?.typeId !== "cl:ponto_acesso") continue;
    const terminal = procurarNaRede(ponto, (b) => b.typeId === "cl:terminal");
    if (!terminal) continue;
    registrarAcao(j, "sem_fio");
    return abrirUmMenu(j, () => abrirTerminal(j, terminal));
  }
  aviso(j, { translate: "cl.ae.sem_ponto", with: [String(AE.alcanceSemFio)] }, 5);
}

// ---------- Célula de Água ----------
function usarCelulaAgua(j: Player): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const cel = inv?.getItem(j.selectedSlotIndex);
  if (!inv || cel?.typeId !== "cl:celula_agua") return;
  const agua = (cel.getDynamicProperty("agua") as number | undefined) ?? 0;
  let garrafa = -1;
  for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === "minecraft:glass_bottle") garrafa = s;
  if (agua > 0 && garrafa >= 0) {
    const g = inv.getItem(garrafa)!;
    if (g.amount === 1) inv.setItem(garrafa, undefined);
    else {
      g.amount--;
      inv.setItem(garrafa, g);
    }
    marcarAgua(cel, agua - 1);
    inv.setItem(j.selectedSlotIndex, cel);
    darAoJogador(j, "cl:agua_boa");
    j.playSound("bucket.fill");
  } else if (agua > 0) aviso(j, "cl.ae.agua_sem_garrafa");
  aviso(j, { translate: "cl.ae.agua", with: [String((cel.getDynamicProperty("agua") as number | undefined) ?? 0), String(AE.aguaMax)] }, 5);
}

function marcarAgua(cel: ItemStack, n: number): void {
  cel.setDynamicProperty("agua", n);
  cel.setLore([{ translate: "cl.ae.agua", with: [String(n), String(AE.aguaMax)] }]);
}

function encherCelulaAgua(j: Player, b: Block): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const cel = inv?.getItem(j.selectedSlotIndex);
  if (!inv || cel?.typeId !== "cl:celula_agua") return;
  const agua = (cel.getDynamicProperty("agua") as number | undefined) ?? 0;
  let ganho = 0;
  if (b.typeId === "cl:condensador_agua" && lerEstado<boolean>(b, "cl:cheio")) {
    definirEstado(b, "cl:cheio", false);
    ganho = 3;
  } else if (b.typeId === "cl:condensador_avancado") {
    const n = lerEstado<number>(b, "cl:nivel");
    if (n > 0) {
      definirEstado(b, "cl:nivel", 0);
      ganho = 3 * n;
    }
  } else if (b.typeId === "minecraft:water") {
    b.setType("minecraft:air");
    ganho = 3;
  }
  if (ganho > 0) {
    marcarAgua(cel, Math.min(AE.aguaMax, agua + ganho));
    inv.setItem(j.selectedSlotIndex, cel);
    j.playSound("bucket.fill");
  }
  aviso(j, { translate: "cl.ae.agua", with: [String((cel.getDynamicProperty("agua") as number | undefined) ?? 0), String(AE.aguaMax)] }, 5);
}

export function registrarAE(): void {
  registrarInventario("cl:drive_me", inventarios);
  registrarInventario("cl:bau_me", inventarios);
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === "cl:terminal_sem_fio") system.run(() => usarSemFio(source));
    if (itemStack.typeId === "cl:celula_agua") system.run(() => usarCelulaAgua(source));
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "cl:celula_agua" || !ev.isFirstEvent) return;
    const alvo = ["cl:condensador_agua", "cl:condensador_avancado", "minecraft:water"];
    if (!alvo.includes(ev.block.typeId)) return;
    ev.cancel = true;
    const { player, block } = ev;
    system.run(() => encherCelulaAgua(player, block));
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ block }) => {
    if (block.typeId !== "cl:ponto_acesso") return;
    world.setDynamicProperty("cl:pontos_acesso", JSON.stringify([...pontos(), `${block.dimension.id}:${block.x},${block.y},${block.z}`]));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id === "cl:ponto_acesso") {
      const k = `${block.dimension.id}:${block.x},${block.y},${block.z}`;
      world.setDynamicProperty("cl:pontos_acesso", JSON.stringify(pontos().filter((p) => p !== k)));
    }
    if (id === "cl:drive_me" || id === "cl:bau_me") {
      const t = id === "cl:drive_me" ? "drive" : "baume";
      for (const c of lerEm<Celula[]>(t, block.dimension, block.location, [])) block.dimension.spawnItem(itemDaCelula(c), block.center());
      gravarEm(t, block.dimension, block.location, undefined);
    }
  });
  registrarDetalhe(["cl:drive_me", "cl:bau_me"], (b) => {
    const cel = lerCelulas(b);
    return { translate: "cl.ae.drive", with: [String(cel.length), String(MAX[b.typeId])] };
  });
}


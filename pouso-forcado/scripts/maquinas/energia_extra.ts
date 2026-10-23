import { Block, BlockCustomComponent, Dimension, EntityDamageCause, GameMode, ItemStack, Player, Vector3, system, world } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { gastarCE } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";
import { CELULAS, definirPares } from "../util/rede.js";

/*
 * 1.2.0, energia e PneumaticCraft:
 * - Células de Energia guardam a carga ao serem quebradas (como no Thermal): o bloco não solta nada
 *   pelo jogo; o script solta a célula com a carga escrita no item ("Carga: N E") e, ao colocar de volta,
 *   a célula nasce com essa carga. Explodida, também solta com a carga.
 * - Tesseract: frequência de 1 a 999 (0 = desligado). A rede de energia pula de um Tesseract para os
 *   outros da mesma frequência (util/rede.ts). Índice no mundo: "cl:tesseratos" = { freq: ["dim|x,y,z"] }.
 * - Torre de Defesa (ideia do projeto): a cada 1 s, atira no monstro mais perto até 12 blocos,
 *   gastando 0,25 E da rede por tiro.
 * - Ferro comprimido por explosão (PneumaticCraft): lingotes e blocos de ferro jogados no chão perto de
 *   uma explosão viram ferro comprimido, com 20% de perda.
 */
const LORE_CARGA = /Carga: (\d+) E|Charge: (\d+) E/;
const TORRE = { alcance: 12, dano: 4, custoCE: 25 };
const COMPRIME: Readonly<Record<string, string>> = { "minecraft:iron_ingot": "cl:lingote_ferro_comprimido", "minecraft:iron_block": "cl:bloco_ferro_comprimido" };
const PERDA = 0.2;

// ---------- Células ----------
function itemCelula(id: string, carga: number): ItemStack {
  const i = new ItemStack(id, 1);
  if (carga > 0) i.setLore([`§7Carga: ${Math.floor(carga)} E`]);
  return i;
}
const cargaDoItem = (i: ItemStack | undefined): number => {
  const m = i?.getLore().join(" ").match(LORE_CARGA);
  return m ? Number(m[1] ?? m[2]) : 0;
};
const aColocar = new Map<string, { id: string; carga: number }>(); // jogador → célula com carga na mão

function registrarCelulas(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const i = ev.itemStack;
    if (!i || CELULAS[i.typeId] === undefined) return;
    const carga = cargaDoItem(i);
    if (carga > 0) aColocar.set(ev.player.id, { id: i.typeId, carga });
    else aColocar.delete(ev.player.id);
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    const p = aColocar.get(player.id);
    if (!p || block.typeId !== p.id) return;
    aColocar.delete(player.id);
    gravar("celula", block, Math.min(p.carga, CELULAS[p.id]));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ player, block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (CELULAS[id] === undefined) return;
    const carga = lerEm<number>("celula", block.dimension, block.location, 0);
    gravarEm("celula", block.dimension, block.location, undefined);
    if (player.getGameMode() !== GameMode.Creative) block.dimension.spawnItem(itemCelula(id, carga), block.center());
  });
}

// ---------- Tesseract ----------
type Indice = Record<string, string[]>;
const lerIndice = (): Indice => {
  try {
    return JSON.parse((world.getDynamicProperty("cl:tesseratos") as string) ?? "{}") as Indice;
  } catch {
    return {};
  }
};
const gravarIndice = (i: Indice) => world.setDynamicProperty("cl:tesseratos", JSON.stringify(i));
const pos = (dim: Dimension, p: Vector3) => `${dim.id}|${p.x},${p.y},${p.z}`;
const freqDe = (b: Block): number => ler<number>("tesseract", b, 0);

function mudarFrequencia(dim: Dimension, p: Vector3, antiga: number, nova: number): void {
  const idx = lerIndice(), aqui = pos(dim, p);
  if (antiga) idx[antiga] = (idx[antiga] ?? []).filter((s) => s !== aqui);
  if (antiga && !idx[antiga].length) delete idx[antiga];
  if (nova) idx[nova] = [...new Set([...(idx[nova] ?? []), aqui])];
  gravarIndice(idx);
}

function pares(b: Block): Block[] {
  const f = freqDe(b);
  if (!f) return [];
  const aqui = pos(b.dimension, b);
  const r: Block[] = [];
  for (const s of lerIndice()[f] ?? []) {
    if (s === aqui) continue;
    const [dimId, xyz] = s.split("|");
    const [x, y, z] = xyz.split(",").map(Number);
    try {
      const outro = world.getDimension(dimId).getBlock({ x, y, z });
      if (outro?.typeId === "cl:tesseract") r.push(outro);
    } catch {
      // longe demais (não carregado)
    }
  }
  return r;
}

async function menuTesseract(j: Player, b: Block): Promise<void> {
  const antiga = freqDe(b);
  const r = await new ModalFormData()
    .title({ translate: "cl.te.tesseract" })
    .textField({ rawtext: [{ translate: "cl.te.tesseract_corpo", with: [String(antiga)] }, { text: "\n\n" }, { translate: "cl.te.frequencia" }] }, "1", { defaultValue: String(antiga) })
    .show(j);
  if (r.canceled || !r.formValues || !b.isValid || b.typeId !== "cl:tesseract") return;
  const nova = Math.max(0, Math.min(999, Math.floor(Number(r.formValues[0]) || 0)));
  gravar("tesseract", b, nova || undefined);
  mudarFrequencia(b.dimension, b, antiga, nova);
  const ligados = pares(b).length;
  aviso(j, { translate: "cl.te.tesseract_ok", with: [String(nova), String(ligados)] }, 5);
  if (nova && ligados) registrarAcao(j, "tesseract");
}

export const tesseract: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (j) system.run(() => abrirUmMenu(j, () => menuTesseract(j, e.block)));
  },
};

// ---------- Torre de Defesa ----------
export const torreDefesa: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) aviso(e.player, "cl.te.torre", 5);
  },
  onTick(e) {
    const b = e.block, centro = b.center();
    const alvo = e.dimension.getEntities({ location: centro, maxDistance: TORRE.alcance, families: ["monster"], closest: 1 })[0];
    if (!alvo?.isValid || !gastarCE(b, TORRE.custoCE)) return;
    const destino = { x: alvo.location.x, y: alvo.location.y + 1, z: alvo.location.z };
    const origem = { x: centro.x, y: centro.y + 0.6, z: centro.z };
    const d = Math.hypot(destino.x - origem.x, destino.y - origem.y, destino.z - origem.z);
    try {
      for (let k = 1; k < d; k += 1.5) {
        const t = k / d;
        e.dimension.spawnParticle("minecraft:basic_crit_particle", { x: origem.x + (destino.x - origem.x) * t, y: origem.y + (destino.y - origem.y) * t, z: origem.z + (destino.z - origem.z) * t });
      }
      e.dimension.playSound("random.bow", origem, { pitch: 1.6 });
      alvo.applyDamage(TORRE.dano, { cause: EntityDamageCause.projectile });
    } catch {
      // o alvo sumiu
    }
  },
};

// ---------- Ferro comprimido por explosão ----------
function registrarExplosao(): void {
  world.beforeEvents.explosion.subscribe((ev) => {
    const centro = ev.source?.location ?? ev.getImpactedBlocks()[0]?.location;
    if (!centro) return;
    const achados: { id: string; local: Vector3; tipo: string; qtd: number }[] = [];
    for (const e of ev.dimension.getEntities({ type: "minecraft:item", location: centro, maxDistance: 5 })) {
      const pilha = e.getComponent("minecraft:item")?.itemStack;
      if (pilha && COMPRIME[pilha.typeId]) achados.push({ id: e.id, local: { ...e.location }, tipo: pilha.typeId, qtd: pilha.amount });
    }
    // Células na explosão: guarda a carga para soltar o item depois.
    const celulas = ev.getImpactedBlocks().filter((b) => CELULAS[b.typeId] !== undefined).map((b) => ({ id: b.typeId, local: { x: b.x, y: b.y, z: b.z } }));
    if (!achados.length && !celulas.length) return;
    const dim = ev.dimension;
    system.run(() => {
      for (const a of achados) {
        const velho = world.getEntity(a.id);
        if (velho?.isValid) velho.remove();
        let n = 0;
        for (let k = 0; k < a.qtd; k++) if (Math.random() >= PERDA) n++;
        if (n) dim.spawnItem(new ItemStack(COMPRIME[a.tipo], n), a.local);
        for (const j of dim.getPlayers({ location: a.local, maxDistance: 24 })) for (let k = 0; k < n; k++) registrarAcao(j, "ferro_comprimido");
      }
      for (const c of celulas) {
        const carga = lerEm<number>("celula", dim, c.local, 0);
        gravarEm("celula", dim, c.local, undefined);
        dim.spawnItem(itemCelula(c.id, carga), { x: c.local.x + 0.5, y: c.local.y + 0.5, z: c.local.z + 0.5 });
      }
    });
  });
}

export function registrarEnergiaExtra(): void {
  registrarCelulas();
  definirPares(pares);
  registrarExplosao();
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== "cl:tesseract") return;
    const f = lerEm<number>("tesseract", block.dimension, block.location, 0);
    gravarEm("tesseract", block.dimension, block.location, undefined);
    if (f) mudarFrequencia(block.dimension, block.location, f, 0);
  });
  registrarDetalhe("cl:tesseract", (b) => ({ translate: "cl.te.tesseract_ok", with: [String(freqDe(b)), String(pares(b).length)] }));
}

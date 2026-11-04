import { Block, BlockCustomComponent, BlockPermutation, Dimension, Entity, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { DADOS_F51 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { carregarItem, ItemSalvo, salvarItem } from "../util/itens.js";
import { codigoDoItem, guardarNoItem, lerCodigo } from "../util/item_guarda.js";

/*
 * 1.32.0: os baús do Iron Chests (Cobre 45, Ferro 54, Ouro 81, Diamante/Cristal/Obsidiana 108, Terra 1). Um bloco
 * não tem inventário no Bedrock: em cima do bloco fica uma entidade invisível com a tela de baú do jogo (27 espaços),
 * em páginas (agachado + tocar troca). Bater no baú guarda o baú com tudo dentro (como uma caixa de shulker); pôr o
 * baú de volta devolve tudo. As melhorias do mod trocam o baú (inclusive o baú normal) sem tirar nada.
 */
const ENT = "cl:bau_grande";
const TAMANHO = DADOS_F51.baus as Readonly<Record<string, number>>;
const MELHORIAS = DADOS_F51.melhoriasBau as unknown as Readonly<Record<string, readonly [string, string]>>;
const POR_PAG = 27;
const P_TIPO = "cl:bau_tipo", P_PAG = "cl:pag", P_TUDO = "cl:paginas";
type Slots = (ItemSalvo | null)[];
const ehBau = (id: string | undefined) => !!id && TAMANHO[id.replace("cl:", "")] !== undefined;
const total = (tipo: string) => TAMANHO[tipo.replace("cl:", "")] ?? 27;
const paginas = (tipo: string) => Math.max(1, Math.ceil(total(tipo) / POR_PAG));
const centro = (b: { x: number; y: number; z: number }): Vector3 => ({ x: b.x + 0.5, y: b.y - 0.01, z: b.z + 0.5 });

function tudoDe(m: Entity): Slots {
  try {
    const v = m.getDynamicProperty(P_TUDO);
    return typeof v === "string" ? (JSON.parse(v) as Slots) : [];
  } catch {
    return [];
  }
}
/** Passa a página aberta para a lista de tudo (o que passar do tamanho do baú cai no chão). */
function salvarPagina(m: Entity, tudo: Slots): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  const pag = (m.getDynamicProperty(P_PAG) as number | undefined) ?? 0;
  const n = total(m.getDynamicProperty(P_TIPO) as string);
  for (let k = 0; k < POR_PAG; k++) {
    const idx = pag * POR_PAG + k;
    if (idx < n) {
      tudo[idx] = salvarItem(c.getItem(k));
      continue;
    }
    const i = c.getItem(k);
    if (i) {
      c.setItem(k, undefined);
      m.dimension.spawnItem(i, m.location);
    }
  }
}
function abrirPagina(m: Entity, tudo: Slots, pag: number): void {
  const c = m.getComponent("minecraft:inventory")?.container;
  if (!c) return;
  c.clearAll();
  const n = total(m.getDynamicProperty(P_TIPO) as string);
  for (let k = 0; k < POR_PAG; k++) {
    const idx = pag * POR_PAG + k;
    if (idx >= n) break;
    const i = carregarItem(tudo[idx] ?? null);
    if (i) c.setItem(k, i);
  }
  m.setDynamicProperty(P_PAG, pag);
  m.setDynamicProperty(P_TUDO, JSON.stringify(tudo));
}
/** Tudo o que está no baú (todas as páginas). */
function conteudo(m: Entity): Slots {
  const tudo = tudoDe(m);
  salvarPagina(m, tudo);
  return tudo;
}

function entidadeEm(dim: Dimension, b: { x: number; y: number; z: number }): Entity | undefined {
  try {
    return dim.getEntities({ type: ENT, location: centro(b), maxDistance: 0.6 })[0];
  } catch {
    return undefined;
  }
}
/** Põe a entidade do baú (se ainda não tem) com o conteúdo dado. */
function garantirEntidade(b: Block, tudo?: Slots, nome?: string): Entity | undefined {
  const ja = entidadeEm(b.dimension, b);
  if (ja) return ja;
  let m: Entity;
  try {
    m = b.dimension.spawnEntity(ENT, centro(b));
  } catch {
    return undefined;
  }
  m.setDynamicProperty(P_TIPO, b.typeId);
  if (nome) m.nameTag = nome;
  abrirPagina(m, tudo ?? [], 0);
  return m;
}

/** Bater no baú: vira item com tudo dentro (ou, se não couber no item, solta o conteúdo). */
function recolher(j: Player | undefined, m: Entity, b?: Block): void {
  const tipo = (m.getDynamicProperty(P_TIPO) as string | undefined) ?? "cl:bau_ferro";
  const tudo = conteudo(m);
  const usados = tudo.filter(Boolean).length;
  const item = new ItemStack(tipo, 1);
  const onde = m.location, dim = m.dimension;
  let soltar = false;
  try {
    if (usados) guardarNoItem(item, tudo, `§7${usados}/${total(tipo)}`);
  } catch {
    soltar = true; // grande demais para guardar
  }
  m.getComponent("minecraft:inventory")?.container?.clearAll();
  m.remove();
  const bloco = b ?? dim.getBlock({ x: Math.floor(onde.x), y: Math.floor(onde.y + 0.1), z: Math.floor(onde.z) });
  if (bloco && ehBau(bloco.typeId)) bloco.setType("minecraft:air");
  if (soltar) for (const s of tudo) {
    const i = carregarItem(s);
    if (i) dim.spawnItem(i, onde);
  }
  if (j) {
    const sobra = j.getComponent("minecraft:inventory")?.container?.addItem(item);
    if (sobra) dim.spawnItem(sobra, onde);
    j.playSound("random.chestclosed");
  } else dim.spawnItem(item, onde);
}

function trocarPagina(j: Player, m: Entity): void {
  const tipo = m.getDynamicProperty(P_TIPO) as string;
  const n = paginas(tipo);
  if (n <= 1) return aviso(j, { translate: "cl.bau.pagina", with: ["1", "1"] }, 2);
  const tudo = tudoDe(m);
  salvarPagina(m, tudo);
  const prox = (((m.getDynamicProperty(P_PAG) as number | undefined) ?? 0) + 1) % n;
  abrirPagina(m, tudo, prox);
  j.playSound("item.book.page_turn");
  aviso(j, { translate: "cl.bau.pagina", with: [String(prox + 1), String(n)] }, 2);
}

/** Melhoria de baú: troca o bloco (e a entidade) sem tirar nada. Devolve se usou. */
function melhorar(j: Player, b: Block, id: string): boolean {
  const par = MELHORIAS[id.replace("cl:", "")];
  if (!par) return false;
  const [de, para] = par;
  if (b.typeId !== de) {
    aviso(j, { translate: "cl.bau.errado", with: { rawtext: [{ translate: new ItemStack(de).localizationKey }] } }, 3);
    return false;
  }
  let dir = "north";
  try {
    dir = (b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string) ?? "north";
  } catch {
    // baú sem direção
  }
  let tudo: Slots = [];
  let nome: string | undefined;
  if (de === "minecraft:chest") {
    const c = b.getComponent("minecraft:inventory")?.container;
    if (c && c.size > 27) {
      aviso(j, "cl.bau.duplo", 3);
      return false;
    }
    if (c) for (let k = 0; k < c.size; k++) tudo.push(salvarItem(c.getItem(k)));
    c?.clearAll();
  } else {
    const m = entidadeEm(b.dimension, b);
    if (m) {
      tudo = conteudo(m);
      nome = m.nameTag || undefined;
      m.getComponent("minecraft:inventory")?.container?.clearAll();
      m.remove();
    }
  }
  try {
    b.setPermutation(BlockPermutation.resolve(para, { "minecraft:cardinal_direction": dir }));
  } catch {
    b.setType(para);
  }
  garantirEntidade(b, tudo, nome);
  j.playSound("random.anvil_use", { volume: 0.5 });
  aviso(j, { translate: "cl.bau.melhorou", with: { rawtext: [{ translate: new ItemStack(para).localizationKey }] } }, 3);
  if (tudo.some(Boolean)) registrarAcao(j, "ic_melhoria");
  return true;
}
function gastarDaMao(j: Player): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const i = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !i) return;
  if (i.amount > 1) {
    i.amount--;
    inv.setItem(j.selectedSlotIndex, i);
  } else inv.setItem(j.selectedSlotIndex, undefined);
}

/** O bloco: se a entidade sumiu (estrutura, comando), põe de novo. */
export const bauGrandeComp: BlockCustomComponent = {
  onPlayerInteract({ block }) {
    system.run(() => {
      if (block.isValid && ehBau(block.typeId)) garantirEntidade(block);
    });
  },
};

const pendente = new Map<string, { cod?: string; tick: number; nome?: string }>();
export function registrarBausGrandes(): void {
  // Pôr o baú: a entidade nasce com o que o item guardava.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const i = ev.itemStack;
    if (!i) return;
    // Melhoria num baú (normal ou do mod) visto pelo bloco.
    if (MELHORIAS[i.typeId.replace("cl:", "")] && (ev.block.typeId === "minecraft:chest" || ehBau(ev.block.typeId))) {
      ev.cancel = true;
      const j = ev.player, b = ev.block, id = i.typeId;
      system.run(() => {
        if (b.isValid && melhorar(j, b, id)) gastarDaMao(j);
      });
      return;
    }
    if (!ehBau(i.typeId)) return;
    pendente.set(ev.player.id, { cod: codigoDoItem(i), tick: system.currentTick, nome: i.nameTag });
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (!ehBau(block.typeId)) return;
    const p = pendente.get(player.id);
    pendente.delete(player.id);
    const ok = p && system.currentTick - p.tick <= 3;
    garantirEntidade(block, (ok ? lerCodigo<Slots>(p.cod) : undefined) ?? [], ok ? p.nome : undefined);
    aviso(player, "cl.bau.dica", 4);
    if (block.typeId === "cl:bau_cobre") registrarAcao(player, "ic_cobre");
  });
  // Na entidade: agachado troca de página; com melhoria, melhora.
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    if (ev.target.typeId !== ENT) return;
    const j = ev.player, m = ev.target;
    const i = ev.itemStack;
    if (i && MELHORIAS[i.typeId.replace("cl:", "")]) {
      ev.cancel = true;
      const id = i.typeId;
      system.run(() => {
        const b = m.isValid ? m.dimension.getBlock({ x: Math.floor(m.location.x), y: Math.floor(m.location.y + 0.1), z: Math.floor(m.location.z) }) : undefined;
        if (b && melhorar(j, b, id)) gastarDaMao(j);
      });
      return;
    }
    if (j.isSneaking) {
      ev.cancel = true;
      system.run(() => m.isValid && trocarPagina(j, m));
    }
  });
  // Bater guarda o baú com tudo dentro.
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity, hitEntity }) => {
    if (hitEntity.typeId !== ENT || !(damagingEntity instanceof Player)) return;
    const j = damagingEntity;
    system.run(() => hitEntity.isValid && recolher(j, hitEntity));
  });
  // Bloco quebrado por outro jeito (explosão, comando): solta tudo.
  world.afterEvents.blockExplode.subscribe(({ block, explodedBlockPermutation }) => {
    if (!ehBau(explodedBlockPermutation.type.id)) return;
    const m = entidadeEm(block.dimension, block);
    if (!m) return;
    for (const s of conteudo(m)) {
      const i = carregarItem(s);
      if (i) block.dimension.spawnItem(i, centro(block));
    }
    m.getComponent("minecraft:inventory")?.container?.clearAll();
    m.remove();
  });
  // Teste no servidor: scriptevent cl:teste_bau <pagina|recolher|melhorar <id>> no baú mais perto.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_bau" || !(j instanceof Player)) return;
    const m = j.dimension.getEntities({ type: ENT, location: j.location, maxDistance: 8, closest: 1 })[0];
    const [acao, arg] = message.split(" ");
    if (acao === "melhorar") {
      const baixo = j.dimension.getBlock({ x: Math.floor(j.location.x), y: Math.floor(j.location.y) - 1, z: Math.floor(j.location.z) });
      const b = m ? j.dimension.getBlock({ x: Math.floor(m.location.x), y: Math.floor(m.location.y + 0.1), z: Math.floor(m.location.z) }) : undefined;
      const alvo = baixo && (baixo.typeId === "minecraft:chest" || ehBau(baixo.typeId)) ? baixo : b;
      if (alvo) console.warn(`[teste_bau] melhorar=${melhorar(j, alvo, arg)}`);
      return;
    }
    if (!m) return console.warn("[teste_bau] sem baú");
    if (acao === "pagina") trocarPagina(j, m);
    if (acao === "recolher") recolher(j, m);
    if (acao === "info") console.warn(`[teste_bau] tipo=${m.getDynamicProperty(P_TIPO)} pag=${m.getDynamicProperty(P_PAG)} itens=${conteudo(m).filter(Boolean).length}`);
  });
}

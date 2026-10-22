import { Block, BlockCustomComponent, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { SYNC } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { vizinhos } from "../util/blocos.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rf } from "../util/energia.js";
import { itemNaMao } from "../util/inventario.js";
import { InventarioSalvo, carregarItem, esvaziarJogador, vestirJogador } from "../util/itens.js";
import { abrirUmMenu } from "../util/menus.js";
import { consumir } from "../util/rede.js";

/*
 * Sync (Fase 21): corpos reserva com inventário próprio. Sem sistema de vidas (decisão 2).
 * - Construtor de Corpos: mão vazia = amostra de sangue (2 corações) e começa um corpo; leva SYNC.custoCE
 *   de energia (da rede ou de uma Esteira de Animal encostada, com porco ou lobo em cima). O corpo pronto
 *   fica no construtor até ser usado.
 * - Armazém de Corpos: tocando num armazém vazio você escolhe um corpo para ir; o corpo de agora fica
 *   guardado nele com tudo o que você carrega (mochila e armadura).
 * - Ao morrer, você acorda no corpo marcado como casa (ou no mais perto, na mesma dimensão) com o
 *   inventário dele. Sem corpo, renasce normalmente.
 * Os corpos ficam em propriedades do mundo (não são entidades): não somem com chunk descarregado.
 */
type Corpo = { id: number; dono: string; nome: number; dim: string; pos: Vector3; casa?: boolean; inv: InventarioSalvo };
type Construtor = { dono?: string; ce: number };
const lista = (): number[] => JSON.parse((world.getDynamicProperty("cl:corpos") as string | undefined) ?? "[]") as number[];
const lerCorpo = (id: number): Corpo | undefined => {
  const v = world.getDynamicProperty(`cl:corpo:${id}`);
  return typeof v === "string" ? (JSON.parse(v) as Corpo) : undefined;
};
const gravarCorpo = (c: Corpo | undefined, id: number) => world.setDynamicProperty(`cl:corpo:${id}`, c ? JSON.stringify(c) : undefined);
const corposDe = (j: Player) => lista().map(lerCorpo).filter((c): c is Corpo => !!c && c.dono === j.id);
const aqui = (b: Block) => (c: Corpo) => c.dim === b.dimension.id && c.pos.x === b.x && c.pos.y === b.y && c.pos.z === b.z;
const nomeCorpo = (c: Corpo): RawMessage => ({ translate: "cl.sy.nome", with: [String(c.nome)] });

function novoCorpo(dono: string, b: Block, inv: InventarioSalvo): Corpo {
  const ids = lista();
  const id = (ids.length ? Math.max(...ids) : 0) + 1;
  const nome = ((world.getDynamicProperty(`cl:corpos_n:${dono}`) as number | undefined) ?? 0) + 1;
  world.setDynamicProperty(`cl:corpos_n:${dono}`, nome);
  const c: Corpo = { id, dono, nome, dim: b.dimension.id, pos: { x: b.x, y: b.y, z: b.z }, inv };
  gravarCorpo(c, id);
  world.setDynamicProperty("cl:corpos", JSON.stringify([...ids, id]));
  return c;
}

function apagarCorpo(id: number): void {
  gravarCorpo(undefined, id);
  world.setDynamicProperty("cl:corpos", JSON.stringify(lista().filter((x) => x !== id)));
}

/** Vai para o corpo `alvo`: teleporta, veste o inventário dele e apaga o corpo. */
function entrar(j: Player, alvo: Corpo): void {
  apagarCorpo(alvo.id);
  const dim = world.getDimension(alvo.dim);
  j.teleport({ x: alvo.pos.x + 0.5, y: alvo.pos.y + 1, z: alvo.pos.z + 0.5 }, { dimension: dim });
  vestirJogador(j, alvo.inv);
  j.playSound("mob.endermen.portal");
}

async function menuCorpos(j: Player, b: Block): Promise<void> {
  const meus = corposDe(j);
  const armazemVazio = b.typeId === "cl:armazem_corpos" && !lista().map(lerCorpo).some((c) => c && aqui(b)(c));
  const destinos = armazemVazio ? meus : [];
  const form = new ActionFormData().title({ translate: "cl.sy.titulo" });
  form.body({ translate: meus.length === 0 ? "cl.sy.nenhum" : armazemVazio ? "cl.sy.trocar_aqui" : "cl.sy.trocar_onde" });
  const rotulo = (c: Corpo): RawMessage => ({
    rawtext: [{ translate: "cl.sy.corpo", with: { rawtext: [nomeCorpo(c), { text: `${c.pos.x}, ${c.pos.y}, ${c.pos.z}` }] } }, ...(c.casa ? [{ translate: "cl.sy.casa" }] : [])],
  });
  for (const c of destinos) form.button(rotulo(c));
  for (const c of meus) form.button({ translate: "cl.sy.marcar_casa", with: { rawtext: [nomeCorpo(c)] } });
  form.button({ translate: "cl.sy.fechar" });
  const r = await form.show(j);
  if (r.canceled || r.selection === undefined) return;
  if (r.selection < destinos.length) {
    const alvo = lerCorpo(destinos[r.selection].id);
    if (!alvo) return;
    // O corpo de agora fica aqui, com tudo.
    novoCorpo(j.id, b, esvaziarJogador(j));
    entrar(j, alvo);
    registrarAcao(j, "trocar_corpo");
    j.sendMessage({ rawtext: [{ translate: "cl.sy.foi", with: { rawtext: [nomeCorpo(alvo)] } }] });
    return;
  }
  const k = r.selection - destinos.length;
  if (k < meus.length) {
    for (const c of meus) gravarCorpo({ ...c, casa: c.id === meus[k].id }, c.id);
    return menuCorpos(j, b);
  }
}

export const armazemCorpos: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const dono = lista().map(lerCorpo).find((c) => c && aqui(e.block)(c));
    if (dono && dono.dono !== j.id) return aviso(j, { translate: "cl.sy.ocupado", with: { rawtext: [nomeCorpo(dono)] } });
    abrirUmMenu(j, () => menuCorpos(j, e.block));
  },
};

// ---------- Construtor e esteira ----------
function esteiraDe(b: Block): number {
  let ce = 0;
  for (const v of vizinhos(b)) {
    if (v.typeId !== "cl:esteira_animal") continue;
    const bichos = v.dimension.getEntities({ location: { x: v.x, y: v.y + 1, z: v.z }, volume: { x: 1, y: 2, z: 1 } });
    for (const e of bichos) ce += SYNC.esteira[e.typeId] ?? 0;
  }
  return ce;
}

export const construtorCorpos: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const d = ler<Construtor>("construtor", b, { ce: 0 });
    if (!d.dono || d.ce >= SYNC.custoCE) return;
    d.ce += esteiraDe(b);
    if (d.ce < SYNC.custoCE && consumir(b)) d.ce += 100;
    if (d.ce >= SYNC.custoCE) {
      const c = novoCorpo(d.dono, b, { slots: [], equip: {} });
      gravar("construtor", b, undefined);
      b.dimension.playSound("random.levelup", b.center());
      const dono = world.getPlayers().find((p) => p.id === d.dono);
      if (dono) {
        dono.sendMessage({ rawtext: [{ translate: "cl.sy.pronto", with: { rawtext: [nomeCorpo(c)] } }] });
        registrarAcao(dono, "corpo_criado");
      }
      return;
    }
    gravar("construtor", b, d);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const b = e.block;
    const d = ler<Construtor>("construtor", b, { ce: 0 });
    const pronto = lista().map(lerCorpo).find((c) => c && aqui(b)(c));
    if (pronto) return abrirUmMenu(j, () => menuCorpos(j, b));
    if (d.dono) return aviso(j, { translate: "cl.sy.construindo", with: [rf(d.ce / 100), rf(SYNC.custoCE / 100)] });
    if (itemNaMao(j)) return aviso(j, { translate: "cl.sy.comecar", with: [rf(SYNC.custoCE / 100)] }, 6);
    const vida = j.getComponent("minecraft:health");
    if (!vida || vida.currentValue <= SYNC.amostraSangue + 1) return aviso(j, "cl.sy.pouca_vida");
    j.applyDamage(SYNC.amostraSangue);
    gravar("construtor", b, { dono: j.id, ce: 0 });
    aviso(j, { translate: "cl.sy.construindo", with: [rf(0), rf(SYNC.custoCE / 100)] });
  },
};

export function registrarSync(): void {
  // Morreu: escolhe o corpo (casa, ou o mais perto) e acorda nele ao renascer.
  const pendente = new Map<string, number>();
  world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
    if (!(deadEntity instanceof Player)) return;
    const meus = corposDe(deadEntity);
    if (!meus.length) return;
    const casa = meus.find((c) => c.casa && c.dim === deadEntity.dimension.id) ?? meus.find((c) => c.casa);
    const perto = [...meus].sort((a, b) => {
      const d = (c: Corpo) => (c.dim === deadEntity.dimension.id ? Math.hypot(c.pos.x - deadEntity.location.x, c.pos.z - deadEntity.location.z) : 1e9);
      return d(a) - d(b);
    })[0];
    pendente.set(deadEntity.id, (casa ?? perto).id);
  });
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    const id = pendente.get(player.id);
    if (initialSpawn || id === undefined) return;
    pendente.delete(player.id);
    system.runTimeout(() => {
      const alvo = lerCorpo(id);
      if (!alvo || !player.isValid) return;
      entrar(player, alvo);
      player.sendMessage({ rawtext: [{ translate: "cl.sy.acordou", with: { rawtext: [nomeCorpo(alvo)] } }] });
      registrarAcao(player, "reviver_corpo");
    }, 5);
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id !== "cl:armazem_corpos" && id !== "cl:construtor_corpos") return;
    // O corpo guardado se perde, mas o que ele carregava cai no chão.
    for (const c of lista().map(lerCorpo)) {
      if (!c || c.dim !== block.dimension.id || c.pos.x !== block.x || c.pos.y !== block.y || c.pos.z !== block.z) continue;
      for (const s of [...c.inv.slots, ...Object.values(c.inv.equip)]) {
        const i = carregarItem(s);
        if (i) block.dimension.spawnItem(i, block.center());
      }
      apagarCorpo(c.id);
    }
    world.setDynamicProperty(`cl:construtor:${block.dimension.id}:${block.x},${block.y},${block.z}`, undefined);
  });
  registrarDetalhe("cl:esteira_animal", (b) => {
    const bicho = b.dimension.getEntities({ location: { x: b.x, y: b.y + 1, z: b.z }, volume: { x: 1, y: 2, z: 1 } }).find((e) => SYNC.esteira[e.typeId]);
    return bicho ? { translate: "cl.sy.esteira", with: { rawtext: [{ translate: bicho.localizationKey }] } } : { translate: "cl.sy.esteira_vazia" };
  });
  registrarDetalhe("cl:construtor_corpos", (b) => {
    const d = ler<Construtor>("construtor", b, { ce: 0 });
    return d.dono ? { translate: "cl.sy.construindo", with: [rf(d.ce / 100), rf(SYNC.custoCE / 100)] } : undefined;
  });
}

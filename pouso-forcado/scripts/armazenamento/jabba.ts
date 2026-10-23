import { Block, BlockCustomComponent, Direction, ItemStack, Player, RawMessage, StructureSaveMode, system, Vector3, world } from "@minecraft/server";
import { DADOS_F18 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { entrada, saida } from "../util/maquina.js";
import { toqueNovo } from "../util/toque.js";
import { InventarioMapa, Mapa, registrarInventario, simples } from "./virtual.js";

/*
 * JABBA (Fase 18).
 * Barril de Armazenamento: 1 tipo de item, 64 pilhas. Toque com o item para guardar a pilha da mão;
 * dois toques rápidos guardam todos iguais da mochila; bater tira 1 pilha (agachado: 1 item).
 * Upgrades (toque com eles): Estrutural MK I–VII abre 1/3/7/15/31/63/127 espaços; cada Upgrade de
 * Armazenamento usa 1 espaço e soma +64 pilhas; o Núcleo de Funil usa 1 espaço e liga a entrada (baú em
 * cima) e a saída (baú embaixo) a cada 2 s. A Chave de Barril tira o último upgrade.
 * Quebrar o barril solta tudo o que tinha dentro e os upgrades.
 * Carrinho: leva um baú, baú com armadilha, barril ou barril de armazenamento com tudo dentro
 * (estrutura salva no mundo); o de diamante também leva gerador de monstros e tem 6 usos.
 * O Terminal vê o conteúdo dos barris ligados por cabo (armazenamento/virtual.ts).
 */
type Barril = { id?: string; qtd: number; up: number; mk: number; funil?: boolean };
const T = "jabba";
const ID = "cl:barril_armazenamento";
const ESTRUTURAIS = DADOS_F18.estruturais as readonly number[];
const vazio = (): Barril => ({ qtd: 0, up: 0, mk: 0 });
const espacos = (b: Barril) => (b.mk > 0 ? ESTRUTURAIS[b.mk - 1] : 0);
const usados = (b: Barril) => b.up + (b.funil ? 1 : 0);
const pilhaMax = (id: string) => {
  try {
    return new ItemStack(id, 1).maxAmount;
  } catch {
    return 64;
  }
};
const capacidade = (b: Barril, id = b.id) => 64 * (1 + b.up) * (id ? pilhaMax(id) : 64);
const nome = (id: string): RawMessage => ({ translate: new ItemStack(id, 1).localizationKey });

function info(j: Player, b: Barril): void {
  if (!b.id) return aviso(j, { translate: "cl.jb.vazio", with: [String(64 * (1 + b.up))] }, 6);
  aviso(j, { translate: "cl.jb.conteudo", with: { rawtext: [nome(b.id), { text: String(b.qtd) }, { text: String(capacidade(b)) }] } }, 4);
}

function guardar(bloco: Block, b: Barril, p: ItemStack): number {
  if (b.id && b.id !== p.typeId) return 0;
  const n = Math.min(p.amount, capacidade(b, p.typeId) - b.qtd);
  if (n <= 0) return 0;
  b.id = p.typeId;
  b.qtd += n;
  gravar(T, bloco, b);
  return n;
}

const ultimoToque = new Map<string, number>();

function tocar(j: Player, bloco: Block): void {
  const b = ler<Barril>(T, bloco, vazio());
  const mao = itemNaMao(j);
  const id = mao?.typeId ?? "";
  // Upgrades
  const mk = /^cl:upgrade_estrutural_(\d)$/.exec(id);
  if (mk) {
    if (Number(mk[1]) <= b.mk) return aviso(j, "cl.jb.estrutural_menor");
    if (b.mk > 0) darAoJogador(j, `cl:upgrade_estrutural_${b.mk}`);
    b.mk = Number(mk[1]);
    return instalar(j, bloco, b, id);
  }
  if (id === "cl:upgrade_armazenamento" || id === "cl:nucleo_funil") {
    if (usados(b) >= espacos(b) || (id === "cl:nucleo_funil" && b.funil)) return aviso(j, "cl.jb.sem_espaco", 5);
    if (id === "cl:upgrade_armazenamento") b.up++;
    else b.funil = true;
    return instalar(j, bloco, b, id);
  }
  if (id === "cl:chave_barril") return tirarUpgrade(j, bloco, b);
  if (!mao) return info(j, b);
  if (!simples(mao)) return aviso(j, "cl.jb.nao_guarda");
  if (b.id && b.id !== id) return aviso(j, "cl.jb.outro_item");
  // Dois toques seguidos: guarda todos iguais da mochila.
  const agora = system.currentTick;
  const duplo = agora - (ultimoToque.get(j.id) ?? -100) < 12;
  ultimoToque.set(j.id, agora);
  let total = 0;
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  const slots = duplo ? [...Array(inv.size).keys()] : [j.selectedSlotIndex];
  for (const s of slots) {
    const p = inv.getItem(s);
    if (!p || p.typeId !== id || !simples(p)) continue;
    const n = guardar(bloco, b, p);
    if (n <= 0) break;
    total += n;
    if (n === p.amount) inv.setItem(s, undefined);
    else {
      p.amount -= n;
      inv.setItem(s, p);
    }
  }
  if (total === 0) return aviso(j, "cl.jb.cheio");
  j.playSound("random.pop", { pitch: 0.8 });
  info(j, b);
  if (b.qtd >= 1000) registrarAcao(j, "barril_mil");
}

function instalar(j: Player, bloco: Block, b: Barril, id: string): void {
  gastarDaMao(j);
  gravar(T, bloco, b);
  j.playSound("random.anvil_use", { volume: 0.4, pitch: 1.4 });
  aviso(j, { translate: "cl.jb.upgrade_ok", with: { rawtext: [nome(id)] } });
  if (b.mk > 0 && b.up > 0) registrarAcao(j, "barril_upgrade");
}

function tirarUpgrade(j: Player, bloco: Block, b: Barril): void {
  if (b.funil) {
    b.funil = false;
    darAoJogador(j, "cl:nucleo_funil");
  } else if (b.up > 0) {
    if (b.qtd > capacidade({ ...b, up: b.up - 1 })) return aviso(j, "cl.jb.nao_tira");
    b.up--;
    darAoJogador(j, "cl:upgrade_armazenamento");
  } else if (b.mk > 0) {
    darAoJogador(j, `cl:upgrade_estrutural_${b.mk}`);
    b.mk = 0;
  } else return info(j, b);
  gravar(T, bloco, b);
  aviso(j, "cl.jb.tirou_upgrade");
}

function tirar(j: Player, bloco: Block, um: boolean): void {
  const b = ler<Barril>(T, bloco, vazio());
  if (!b.id || b.qtd <= 0) return;
  const n = um ? 1 : Math.min(b.qtd, pilhaMax(b.id));
  darAoJogador(j, new ItemStack(b.id, n));
  b.qtd -= n;
  if (b.qtd <= 0) {
    b.qtd = 0;
    delete b.id;
  }
  gravar(T, bloco, b);
  j.playSound("random.pop");
  info(j, b);
}

export const barrilArmazenamento: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) tocar(e.player, e.block);
  },
  // Núcleo de Funil: puxa 1 pilha do baú de cima e manda 1 pilha para o baú de baixo.
  onTick(e) {
    const bloco = e.block;
    const b = ler<Barril>(T, bloco, vazio());
    if (!b.funil) return;
    let mudou = false;
    const de = entrada(bloco);
    if (de) {
      for (let s = 0; s < de.size; s++) {
        const p = de.getItem(s);
        if (!p || !simples(p) || (b.id && b.id !== p.typeId)) continue;
        const n = guardar(bloco, b, p);
        if (n <= 0) break;
        if (n === p.amount) de.setItem(s, undefined);
        else {
          p.amount -= n;
          de.setItem(s, p);
        }
        mudou = true;
        break;
      }
    }
    const para = saida(bloco);
    if (para && b.id && b.qtd > 0) {
      const n = Math.min(b.qtd, pilhaMax(b.id));
      const sobra = para.addItem(new ItemStack(b.id, n));
      const foi = n - (sobra?.amount ?? 0);
      if (foi > 0) {
        b.qtd -= foi;
        if (b.qtd <= 0) {
          b.qtd = 0;
          delete b.id;
        }
        mudou = true;
      }
    }
    if (mudou) gravar(T, bloco, b);
  },
};

// ---------- Carrinho ----------
type Carga = { estrutura: string; bloco: string; dados?: string };
const LEVA = new Set(["minecraft:chest", "minecraft:trapped_chest", "minecraft:barrel", ID]);
const LEVA_DIAMANTE = new Set([...LEVA, "minecraft:mob_spawner", "cl:gerador_monstros"]);
const FACE: Readonly<Record<string, Vector3>> = {
  [Direction.Up]: { x: 0, y: 1, z: 0 }, [Direction.Down]: { x: 0, y: -1, z: 0 }, [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 }, [Direction.East]: { x: 1, y: 0, z: 0 }, [Direction.West]: { x: -1, y: 0, z: 0 },
};

function usarCarrinho(j: Player, bloco: Block, face: Direction): void {
  const inv = j.getComponent("minecraft:inventory")?.container;
  const item = inv?.getItem(j.selectedSlotIndex);
  if (!inv || !item || !item.typeId.startsWith("cl:carrinho")) return;
  const diamante = item.typeId === "cl:carrinho_diamante";
  const cargaTxt = item.getDynamicProperty("carga") as string | undefined;
  if (!cargaTxt) {
    if (!(diamante ? LEVA_DIAMANTE : LEVA).has(bloco.typeId)) return aviso(j, "cl.jb.carrinho_nao", 5);
    const c = bloco.getComponent("minecraft:inventory")?.container;
    if (c && c.size > 27) return aviso(j, "cl.jb.carrinho_duplo");
    const id = `cl:carrinho_${system.currentTick}_${Math.floor(Math.random() * 1e6)}`;
    world.structureManager.createFromWorld(id, bloco.dimension, bloco.location, bloco.location, { includeEntities: false, saveMode: StructureSaveMode.World });
    const carga: Carga = { estrutura: id, bloco: bloco.typeId };
    if (bloco.typeId === ID) {
      carga.dados = world.getDynamicProperty(`cl:${T}:${bloco.dimension.id}:${bloco.x},${bloco.y},${bloco.z}`) as string | undefined;
      gravar(T, bloco, undefined);
    }
    c?.clearAll();
    bloco.setType("minecraft:air");
    item.setDynamicProperty("carga", JSON.stringify(carga));
    item.setLore([{ translate: "cl.jb.carrinho_carregando", with: { rawtext: [{ translate: new ItemStack(carga.bloco, 1).localizationKey }] } }, ...usosLore(item)]);
    inv.setItem(j.selectedSlotIndex, item);
    j.playSound("random.pop", { pitch: 0.6 });
    return aviso(j, { translate: "cl.jb.carrinho_pegou", with: { rawtext: [{ translate: new ItemStack(carga.bloco, 1).localizationKey }] } });
  }
  const carga = JSON.parse(cargaTxt) as Carga;
  const d = FACE[face];
  const alvo = { x: bloco.x + d.x, y: bloco.y + d.y, z: bloco.z + d.z };
  if (!bloco.dimension.getBlock(alvo)?.isAir) return aviso(j, "cl.jb.carrinho_ocupado");
  world.structureManager.place(carga.estrutura, bloco.dimension, alvo);
  world.structureManager.delete(carga.estrutura);
  if (carga.dados) world.setDynamicProperty(`cl:${T}:${bloco.dimension.id}:${alvo.x},${alvo.y},${alvo.z}`, carga.dados);
  j.playSound("random.pop", { pitch: 1.2 });
  registrarAcao(j, "carrinho");
  if (diamante) {
    const usos = ((item.getDynamicProperty("usos") as number | undefined) ?? 6) - 1;
    if (usos <= 0) {
      inv.setItem(j.selectedSlotIndex, undefined);
      j.playSound("random.break");
      return;
    }
    item.setDynamicProperty("usos", usos);
  }
  item.setDynamicProperty("carga", undefined);
  item.setLore(usosLore(item));
  inv.setItem(j.selectedSlotIndex, item);
}

function usosLore(item: ItemStack): RawMessage[] {
  if (item.typeId !== "cl:carrinho_diamante") return [];
  return [{ translate: "cl.jb.carrinho_usos", with: [String((item.getDynamicProperty("usos") as number | undefined) ?? 6)] }];
}

export function registrarJabba(): void {
  world.afterEvents.entityHitBlock.subscribe(({ damagingEntity, hitBlock }) => {
    if (hitBlock.typeId === ID && damagingEntity instanceof Player) tirar(damagingEntity, hitBlock, damagingEntity.isSneaking);
  });
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (!ev.itemStack?.typeId.startsWith("cl:carrinho") || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player, block, blockFace } = ev;
    system.run(() => usarCarrinho(player, block, blockFace));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== ID) return;
    const b = lerEm<Barril>(T, block.dimension, block.location, vazio());
    gravarEm(T, block.dimension, block.location, undefined);
    const solta = (p: ItemStack) => block.dimension.spawnItem(p, block.center());
    if (b.id) for (let resto = b.qtd; resto > 0; ) {
      const n = Math.min(resto, pilhaMax(b.id));
      solta(new ItemStack(b.id, n));
      resto -= n;
    }
    for (let i = 0; i < b.up; i++) solta(new ItemStack("cl:upgrade_armazenamento", 1));
    if (b.mk > 0) solta(new ItemStack(`cl:upgrade_estrutural_${b.mk}`, 1));
    if (b.funil) solta(new ItemStack("cl:nucleo_funil", 1));
  });
  registrarDetalhe(ID, (bloco) => {
    const b = ler<Barril>(T, bloco, vazio());
    if (!b.id) return { translate: "cl.jb.vazio", with: [String(64 * (1 + b.up))] };
    return { translate: "cl.jb.conteudo", with: { rawtext: [nome(b.id), { text: String(b.qtd) }, { text: String(capacidade(b)) }] } };
  });
  registrarInventario(ID, (bloco) => {
    const b = ler<Barril>(T, bloco, vazio());
    const mapa: Mapa = b.id ? { [b.id]: b.qtd } : {};
    return [
      new InventarioMapa(
        mapa,
        (m, id) => {
          const atual = Object.keys(m)[0];
          if (atual && atual !== id) return 0;
          return capacidade(b, id) - (m[id] ?? 0);
        },
        (m) => {
          const [id, qtd] = Object.entries(m)[0] ?? [];
          const novo = ler<Barril>(T, bloco, vazio());
          if (id && qtd) {
            novo.id = id;
            novo.qtd = qtd;
          } else {
            delete novo.id;
            novo.qtd = 0;
          }
          gravar(T, bloco, novo);
        },
      ),
    ];
  });
}

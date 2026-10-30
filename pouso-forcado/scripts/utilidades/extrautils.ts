import { Block, BlockCustomComponent, BlockPermutation, Direction, GameMode, Player, system, Vector3, world } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import { aviso } from "../jogador/hud.js";
import { particula } from "../util/efeitos.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarDaMao } from "../util/inventario.js";
import { abrirUmMenu } from "../util/menus.js";
import { toqueNovo } from "../util/toque.js";

/*
 * Extra Utilities (1.10.0), os pedaços que cabem no Bedrock:
 * - Lixeira: apaga o que cai em cima dela; tocar com um item na mão pergunta e apaga a pilha.
 * - Regador: molha a terra arada e faz as plantações em volta (5×5) crescerem um pouco mais rápido (1 chance em 4
 *   de avançar um estágio por planta a cada uso; espera de meio segundo entre usos).
 * - Bloco Angelical: põe no ar, sem apoio (2 blocos à frente do olhar); quebra na hora.
 * - Varinha do Construtor (9 blocos) e Super Varinha (49): toque numa face e ela copia a camada de blocos iguais
 *   ligados àquela face, gastando os blocos da mochila.
 * - Pedregulho Comprimido 1x a 8x: só receitas (9 do nível de baixo = 1).
 */
const ESTADOS_CRESCER = ["growth", "age", "cl:estagio"];
const VARINHAS: Readonly<Record<string, number>> = { "cl:varinha_construtor": 9, "cl:super_varinha_construtor": 49 };
const FACE: Readonly<Record<string, Vector3>> = {
  [Direction.Up]: { x: 0, y: 1, z: 0 }, [Direction.Down]: { x: 0, y: -1, z: 0 }, [Direction.North]: { x: 0, y: 0, z: -1 },
  [Direction.South]: { x: 0, y: 0, z: 1 }, [Direction.East]: { x: 1, y: 0, z: 0 }, [Direction.West]: { x: -1, y: 0, z: 0 },
};
const soma = (a: Vector3, b: Vector3) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const livre = (b: Block | undefined) => !!b && (b.isAir || b.isLiquid || b.typeId === "minecraft:short_grass" || b.typeId === "minecraft:deadbush");

// ---------- Lixeira ----------
export const lixeira: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    for (const i of b.dimension.getEntities({ type: "minecraft:item", location: { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 }, maxDistance: 1.1 })) i.remove();
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const inv = j.getComponent("minecraft:inventory")?.container;
    const slot = j.selectedSlotIndex;
    const i = inv?.getItem(slot);
    if (!inv || !i) return aviso(j, "cl.xu.lixeira.dica", 4);
    abrirUmMenu(j, async () => {
      const nome = { translate: i.localizationKey };
      const r = await new MessageFormData()
        .title({ translate: "cl.xu.lixeira.titulo" })
        .body({ translate: "cl.xu.lixeira.pergunta", with: { rawtext: [{ text: String(i.amount) }, i.nameTag ? { text: i.nameTag } : nome] } })
        .button1({ translate: "cl.xu.nao" })
        .button2({ translate: "cl.xu.sim" })
        .show(j);
      if (r.canceled || r.selection !== 1) return;
      const agora = inv.getItem(slot);
      if (agora?.typeId !== i.typeId) return;
      inv.setItem(slot, undefined);
      j.playSound("random.fizz", { volume: 0.5 });
    });
  },
};

// ---------- Regador ----------
const regou = new Map<string, number>();
function regar(j: Player, centro: Block): void {
  if (system.currentTick - (regou.get(j.id) ?? -99) < 10) return;
  regou.set(j.id, system.currentTick);
  const dim = centro.dimension;
  for (let dx = -2; dx <= 2; dx++)
    for (let dz = -2; dz <= 2; dz++)
      for (let dy = -1; dy <= 1; dy++) {
        const b = dim.getBlock({ x: centro.x + dx, y: centro.y + dy, z: centro.z + dz });
        if (!b || b.isAir) continue;
        if (b.typeId === "minecraft:farmland") {
          try {
            b.setPermutation(b.permutation.withState("moisturized_amount", 7));
          } catch {
            // sem o estado
          }
          continue;
        }
        if (Math.random() >= 0.25) continue;
        for (const s of ESTADOS_CRESCER) {
          const v = b.permutation.getState(s as never) as unknown;
          if (typeof v !== "number") continue;
          try {
            b.setPermutation(b.permutation.withState(s as never, (v + 1) as never));
            particula(dim, "minecraft:crop_growth_emitter", b.center());
          } catch {
            // já madura
          }
          break;
        }
      }
  particula(dim, "minecraft:water_splash_particle_manual", { x: centro.x + 0.5, y: centro.y + 1.2, z: centro.z + 0.5 });
  j.playSound("bucket.empty_water", { volume: 0.3, pitch: 1.6 });
}

// ---------- Varinha do Construtor ----------
function construir(j: Player, base: Block, face: Direction, max: number): void {
  const d = FACE[face];
  if (!d) return;
  const perm: BlockPermutation = base.permutation;
  const item = base.getItemStack(1)?.typeId;
  if (!item) return;
  const criativo = j.getGameMode() === GameMode.Creative;
  const inv = j.getComponent("minecraft:inventory")?.container;
  let tem = 0;
  if (!criativo && inv) for (let k = 0; k < inv.size; k++) if (inv.getItem(k)?.typeId === item) tem += inv.getItem(k)!.amount;
  const limite = criativo ? max : Math.min(max, tem);
  if (limite <= 0) return aviso(j, { translate: "cl.xu.varinha.falta", with: { rawtext: [{ translate: base.localizationKey }] } }, 3);
  // Anda pela camada (as 4 direções da face) a partir do bloco tocado.
  const plano = Object.values(FACE).filter((v) => v.x * d.x + v.y * d.y + v.z * d.z === 0);
  const vistos = new Set<string>([`${base.x},${base.y},${base.z}`]);
  const fila: Block[] = [base];
  const lugares: Vector3[] = [];
  while (fila.length && lugares.length < limite) {
    const b = fila.shift()!;
    const destino = soma(b.location, d);
    if (!livre(b.dimension.getBlock(destino))) continue;
    lugares.push(destino);
    for (const v of plano) {
      const p = soma(b.location, v);
      const k = `${p.x},${p.y},${p.z}`;
      if (vistos.has(k)) continue;
      vistos.add(k);
      const n = b.dimension.getBlock(p);
      if (n?.typeId === base.typeId) fila.push(n);
    }
  }
  if (!lugares.length) return;
  for (const p of lugares) base.dimension.getBlock(p)?.setPermutation(perm);
  if (!criativo && inv) {
    let falta = lugares.length;
    for (let k = 0; k < inv.size && falta > 0; k++) {
      const i = inv.getItem(k);
      if (i?.typeId !== item) continue;
      const usa = Math.min(falta, i.amount);
      falta -= usa;
      if (i.amount > usa) {
        i.amount -= usa;
        inv.setItem(k, i);
      } else inv.setItem(k, undefined);
    }
  }
  j.playSound("use.stone");
  registrarAcao(j, "varinha");
}

// ---------- Bloco Angelical ----------
function porNoAr(j: Player): void {
  const olho = j.getHeadLocation();
  const v = j.getViewDirection();
  const p = { x: Math.floor(olho.x + v.x * 2), y: Math.floor(olho.y + v.y * 2), z: Math.floor(olho.z + v.z * 2) };
  const b = j.dimension.getBlock(p);
  if (!b?.isAir) return;
  b.setType("cl:bloco_angelical");
  if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
  j.playSound("use.stone");
}

export function registrarExtraUtils(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const id = ev.itemStack?.typeId;
    if (!id || !toqueNovo(ev)) return;
    const { player: j, block: b } = ev;
    if (id === "cl:regador") {
      ev.cancel = true;
      system.run(() => regar(j, b));
    } else if (VARINHAS[id]) {
      ev.cancel = true;
      const face = ev.blockFace;
      system.run(() => construir(j, b, face, VARINHAS[id]));
    }
  });
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack.typeId === "cl:bloco_angelical") porNoAr(source);
  });
}

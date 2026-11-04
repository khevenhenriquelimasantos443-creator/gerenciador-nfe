import { Block, BlockCustomComponent, Dimension, EntityInitializationCause, system, Vector3, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravarEm, lerEm } from "../util/dados.js";

/*
 * 1.33.0: TorchMaster 21.9 (xalcon, MIT). Mega Tocha: nenhum monstro nasce sozinho num cubo de 64 blocos para cada
 * lado (o raio do mod). Lanterna Sinalizadora (Feral Flare Lantern): acende o escuro num raio de 24 blocos com luzes
 * invisíveis (aos poucos, para não travar o celular); quebrar a lanterna apaga as luzes.
 * As posições das Mega Tochas ficam numa lista no mundo (são poucas): o teste de cada monstro que nasce é barato.
 */
const RAIO_MEGA = 64, RAIO_LANTERNA = 24, PASSO = 6, MAX_LUZES = 255;
const LISTA = "cl:megatochas";
type Pos = { d: string; x: number; y: number; z: number };
let megas: Pos[] | undefined;
function lista(): Pos[] {
  if (!megas)
    try {
      megas = JSON.parse((world.getDynamicProperty(LISTA) as string | undefined) ?? "[]") as Pos[];
    } catch {
      megas = [];
    }
  return megas;
}
function salvar(): void {
  world.setDynamicProperty(LISTA, JSON.stringify(lista()));
}
const igual = (a: Pos, b: Block) => a.d === b.dimension.id && a.x === b.x && a.y === b.y && a.z === b.z;
function protegido(dim: Dimension, p: Vector3): boolean {
  for (const m of lista())
    if (m.d === dim.id && Math.abs(m.x - p.x) <= RAIO_MEGA && Math.abs(m.y - p.y) <= RAIO_MEGA && Math.abs(m.z - p.z) <= RAIO_MEGA) return true;
  return false;
}

export const megaTochaComp: BlockCustomComponent = {
  onPlace({ block }) {
    if (!lista().some((m) => igual(m, block))) {
      lista().push({ d: block.dimension.id, x: block.x, y: block.y, z: block.z });
      salvar();
    }
  },
  onPlayerInteract({ player }) {
    if (player) aviso(player, "cl.tm.mega", 3);
  },
};

// ---------- Lanterna Sinalizadora ----------
const LUZ = ["minecraft:light_block_15", "minecraft:light_block"];
function porLuz(b: Block): boolean {
  for (const id of LUZ)
    try {
      b.setType(id);
      return true;
    } catch {
      // nome antigo
    }
  return false;
}
function acender(dim: Dimension, centro: Vector3): void {
  const pos: Vector3[] = [];
  const luzes: Vector3[] = [];
  for (let dx = -RAIO_LANTERNA; dx <= RAIO_LANTERNA; dx += PASSO)
    for (let dz = -RAIO_LANTERNA; dz <= RAIO_LANTERNA; dz += PASSO)
      for (let dy = -12; dy <= 12; dy += PASSO) if (dx * dx + dz * dz <= RAIO_LANTERNA * RAIO_LANTERNA) pos.push({ x: centro.x + dx, y: centro.y + dy, z: centro.z + dz });
  let k = 0;
  const job = system.runInterval(() => {
    for (let n = 0; n < 12 && k < pos.length; n++, k++) {
      if (luzes.length >= MAX_LUZES) break;
      try {
        // Desce até achar o chão (até 5 blocos): a luz fica logo acima dele.
        let b = dim.getBlock(pos[k]);
        if (!b?.isAir) continue;
        for (let d = 0; d < 5 && b?.below()?.isAir; d++) b = b.below();
        if (b && b.isAir && porLuz(b)) luzes.push({ x: b.x, y: b.y, z: b.z });
      } catch {
        // fora do mundo carregado
      }
    }
    if (k >= pos.length || luzes.length >= MAX_LUZES) {
      system.clearRun(job);
      gravarEm("lanterna", dim, { x: Math.floor(centro.x), y: Math.floor(centro.y), z: Math.floor(centro.z) }, luzes);
    }
  }, 2);
}
export const lanternaComp: BlockCustomComponent = {
  onPlace({ block }) {
    acender(block.dimension, { x: block.x, y: block.y, z: block.z });
  },
  onPlayerInteract({ player }) {
    if (player) aviso(player, "cl.tm.lanterna", 3);
  },
};

export function registrarTochas(): void {
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== EntityInitializationCause.Spawned || !lista().length) return;
    try {
      if (!entity.matches({ families: ["monster"] }) || entity.typeId.startsWith("cl:")) return;
      if (protegido(entity.dimension, entity.location)) entity.remove();
    } catch {
      // já saiu
    }
  });
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId === "cl:tocha_mega") registrarAcao(player, "tm_mega");
    if (block.typeId === "cl:lanterna_feral") registrarAcao(player, "tm_lanterna");
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id === "cl:tocha_mega") {
      megas = lista().filter((m) => !igual(m, block));
      salvar();
    }
    if (id === "cl:lanterna_feral") {
      const luzes = lerEm<Vector3[]>("lanterna", block.dimension, block.location, []);
      gravarEm("lanterna", block.dimension, block.location, undefined);
      for (const p of luzes)
        try {
          const b = block.dimension.getBlock(p);
          if (b && LUZ.includes(b.typeId)) b.setType("minecraft:air");
        } catch {
          // descarregado
        }
    }
  });
}

import { Block, Entity, EntityInventoryComponent, GameMode, ItemStack, Player, system, Vector3, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { THERMAL } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gastarCE } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";

/*
 * Robit (Mekanism, 1.53.0): o robozinho do mod. Ponha o item em cima de um Carregador de Chão: ele nasce seu, com 100 kJ
 * (EntityRobit.MAX_ENERGY), e volta a carregar sempre que está em cima de um Carregador ligado à rede. Tocando nele: seguir
 * ou ficar, pegar itens do chão (até 3 blocos) no inventário dele (27 espaços), fundir o que dá (fornalha, 100 J por item),
 * voltar para o Carregador, entregar os itens. Andar seguindo gasta 10 J por segundo; sem energia ele para. Quebrado
 * (morto), vira o item de novo e solta o que levava.
 */
const ROBIT = "cl:robit", ITEM = "cl:robit", PAD = "cl:carregador_chao";
const MAX = 100000;
const P_E = "mk_e", P_DONO = "mk_dono", P_CASA = "mk_casa", P_SEGUE = "mk_segue", P_PEGA = "mk_pega";
const energia = (r: Entity) => (r.getDynamicProperty(P_E) as number | undefined) ?? 0;
const mudarEnergia = (r: Entity, v: number) => r.setDynamicProperty(P_E, Math.max(0, Math.min(MAX, v)));
const invDe = (r: Entity) => (r.getComponent("minecraft:inventory") as EntityInventoryComponent | undefined)?.container;
function seguir(r: Entity, sim: boolean): void {
  r.setDynamicProperty(P_SEGUE, sim);
  try {
    r.triggerEvent(sim ? "cl:seguir" : "cl:parar");
  } catch {
    // entidade sumindo
  }
}
function contarItens(r: Entity): number {
  const c = invDe(r);
  let n = 0;
  for (let s = 0; c && s < c.size; s++) n += c.getItem(s)?.amount ?? 0;
  return n;
}
function fundir(r: Entity): number {
  const c = invDe(r);
  const forno = THERMAL.fornalha as Record<string, string>;
  let n = 0;
  for (let s = 0; c && s < c.size; s++) {
    const i = c.getItem(s);
    const sai = i ? forno[i.typeId] : undefined;
    if (!i || !sai) continue;
    const k = Math.min(i.amount, Math.floor(energia(r) / 100));
    if (!k) break;
    mudarEnergia(r, energia(r) - k * 100);
    if (k >= i.amount) c.setItem(s, undefined);
    else (i.amount -= k), c.setItem(s, i);
    const sobra = c.addItem(new ItemStack(sai, k));
    if (sobra) r.dimension.spawnItem(sobra, r.location);
    n += k;
  }
  return n;
}
async function menu(j: Player, r: Entity): Promise<void> {
  const segue = r.getDynamicProperty(P_SEGUE) === true, pega = r.getDynamicProperty(P_PEGA) !== false;
  const f = new ActionFormData().title({ translate: "cl.mkr.titulo", with: [r.nameTag || "Robit"] })
    .body({ translate: "cl.mkr.corpo", with: [`${Math.round(energia(r) / 1000)} kJ`, String(contarItens(r))] })
    .button({ translate: segue ? "cl.mkr.parar" : "cl.mkr.seguir" })
    .button({ translate: pega ? "cl.mkr.pegar_on" : "cl.mkr.pegar_off" })
    .button({ translate: "cl.mkr.fundir" })
    .button({ translate: "cl.mkr.casa" })
    .button({ translate: "cl.mkr.entregar" });
  const res = await f.show(j);
  if (res.canceled || res.selection === undefined || !r.isValid) return;
  switch (res.selection) {
    case 0:
      seguir(r, !segue);
      if (!segue) registrarAcao(j, "mk_robit");
      break;
    case 1:
      r.setDynamicProperty(P_PEGA, !pega);
      break;
    case 2:
      fundir(r);
      break;
    case 3: {
      const casa = r.getDynamicProperty(P_CASA) as Vector3 | undefined;
      if (casa) {
        seguir(r, false);
        r.teleport({ x: casa.x + 0.5, y: casa.y + 1, z: casa.z + 0.5 });
      }
      break;
    }
    case 4: {
      const c = invDe(r), pc = j.getComponent("minecraft:inventory")?.container;
      for (let s = 0; c && pc && s < c.size; s++) {
        const i = c.getItem(s);
        if (!i) continue;
        const sobra = pc.addItem(i);
        c.setItem(s, sobra);
      }
      break;
    }
  }
}

function nascer(j: Player, b: Block): void {
  if (b.typeId !== PAD) return aviso(j, "cl.mkr.so_carregador", 4);
  {
    {
      const r = b.dimension.spawnEntity(ROBIT, { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 });
      try {
        r.getComponent("minecraft:tameable")?.tame(j);
      } catch {
        // já domado
      }
      r.setDynamicProperty(P_DONO, j.id);
      r.setDynamicProperty(P_CASA, { x: b.x, y: b.y, z: b.z });
      const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
      mudarEnergia(r, (mao?.getDynamicProperty(P_E) as number | undefined) ?? MAX);
      seguir(r, true);
      registrarAcao(j, "mk_robit");
      if (j.getGameMode() !== GameMode.Creative) {
        const c = j.getComponent("minecraft:inventory")?.container;
        const i = c?.getItem(j.selectedSlotIndex);
        if (c && i) {
          if (i.amount > 1) (i.amount--, c.setItem(j.selectedSlotIndex, i));
          else c.setItem(j.selectedSlotIndex, undefined);
        }
      }
    }
  }
}

export function registrarRobit(): void {
  // Nascer: o item usado em cima de um Carregador de Chão.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== ITEM || !ev.isFirstEvent) return;
    ev.cancel = true;
    const j = ev.player, b = ev.block;
    system.run(() => nascer(j, b));
  });
  // Tocar: o painel (só o dono).
  world.afterEvents.playerInteractWithEntity.subscribe(({ player: j, target: r }) => {
    if (r.typeId !== ROBIT) return;
    if (r.getDynamicProperty(P_DONO) !== j.id) return aviso(j, "cl.mkr.nao_dono", 3);
    abrirUmMenu(j, () => menu(j, r));
  });
  // A cada segundo: energia, carregador e pegar itens.
  system.runInterval(() => {
    for (const dim of ["minecraft:overworld", "minecraft:nether", "minecraft:the_end"].map((d) => world.getDimension(d))) {
      let robits: Entity[] = [];
      try {
        robits = dim.getEntities({ type: ROBIT });
      } catch {
        continue;
      }
      for (const r of robits) {
        try {
          const pe = dim.getBlock({ x: Math.floor(r.location.x), y: Math.floor(r.location.y - 0.1), z: Math.floor(r.location.z) });
          const pad = pe?.typeId === PAD ? pe : dim.getBlock({ x: Math.floor(r.location.x), y: Math.floor(r.location.y), z: Math.floor(r.location.z) });
          if (pad?.typeId === PAD && energia(r) < MAX && gastarCE(pad, Math.ceil((MAX - energia(r)) / 100))) mudarEnergia(r, MAX);
          const segue = r.getDynamicProperty(P_SEGUE) === true;
          if (segue) {
            mudarEnergia(r, energia(r) - 10);
            if (energia(r) <= 0) {
              seguir(r, false);
              const dono = world.getAllPlayers().find((p) => p.id === r.getDynamicProperty(P_DONO));
              if (dono) aviso(dono, "cl.mkr.sem_energia", 4);
            }
          }
          if (r.getDynamicProperty(P_PEGA) !== false && energia(r) > 0) {
            const c = invDe(r);
            for (const e of dim.getEntities({ location: r.location, maxDistance: 3, type: "minecraft:item" })) {
              const it = e.getComponent("minecraft:item")?.itemStack;
              if (!c || !it) continue;
              const sobra = c.addItem(it);
              if (!sobra) e.remove();
              else if (sobra.amount !== it.amount) {
                e.remove();
                dim.spawnItem(sobra, e.location);
              }
            }
          }
        } catch {
          // chunk descarregado
        }
      }
    }
  }, 20);
  // Morreu: vira o item (com a energia) e solta o que levava.
  world.afterEvents.entityDie.subscribe(({ deadEntity: r }) => {
    if (r.typeId !== ROBIT) return;
    try {
      const i = new ItemStack(ITEM, 1);
      i.setDynamicProperty(P_E, energia(r));
      r.dimension.spawnItem(i, r.location);
    } catch {
      // entidade já sumiu
    }
  });
  // Teste: scriptevent cl:teste_robit ver (mostra os robits perto).
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_robit" || !(j instanceof Player)) return;
    const p = message.split(" ");
    if (p[0] === "nascer") {
      const b = j.dimension.getBlock({ x: Number(p[1]), y: Number(p[2]), z: Number(p[3]) });
      if (b) nascer(j, b);
    }
    for (const r of j.dimension.getEntities({ type: ROBIT, location: j.location, maxDistance: 32 }))
      console.warn(`[teste_robit] e=${energia(r)} segue=${String(r.getDynamicProperty(P_SEGUE))} itens=${contarItens(r)} dono=${r.getDynamicProperty(P_DONO) === j.id}`);
  });
}

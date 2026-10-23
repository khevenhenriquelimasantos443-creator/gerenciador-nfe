import { Block, BlockCustomComponent, Container, Player, world } from "@minecraft/server";
import { aviso } from "../jogador/hud.js";
import { vizinhos } from "../util/blocos.js";
import { gravar, gravarEm, ler, registrarDetalhe } from "../util/dados.js";
import { abertas, concluir, contarNoInventario, lerEstado, nomeItem } from "./progresso.js";

/*
 * Caixa de Entrega (o "Quest Delivery System" do Hardcore Questing Mode, 1.2.0). Fica de quem colocou.
 * A cada 5 s, com o dono no mundo, olha os baús encostados nela:
 * - missão "entregar" aberta: se os baús têm tudo, tira dos baús e conclui;
 * - missão "ter" aberta: o que está nos baús soma com a mochila.
 */
type Dono = { id: string; nome: string };

function baus(b: Block): Container[] {
  const r: Container[] = [];
  for (const v of vizinhos(b)) {
    const c = v.getComponent("minecraft:inventory")?.container;
    if (c) r.push(c);
  }
  return r;
}
const contar = (cs: Container[], item: string) => {
  let n = 0;
  for (const c of cs) for (let s = 0; s < c.size; s++) {
    const p = c.getItem(s);
    if (p?.typeId === item) n += p.amount;
  }
  return n;
};
function tirar(cs: Container[], item: string, qtd: number): void {
  let falta = qtd;
  for (const c of cs) for (let s = 0; s < c.size && falta > 0; s++) {
    const p = c.getItem(s);
    if (p?.typeId !== item) continue;
    const n = Math.min(falta, p.amount);
    if (n === p.amount) c.setItem(s, undefined);
    else {
      p.amount -= n;
      c.setItem(s, p);
    }
    falta -= n;
  }
}

function entregar(j: Player, b: Block): void {
  const cs = baus(b);
  if (!cs.length) return;
  for (const m of abertas(lerEstado(j))) {
    const o = m.objetivo;
    if (o.tipo === "entregar" && contar(cs, o.item) >= o.qtd) {
      tirar(cs, o.item, o.qtd);
      concluir(j, m.id);
      j.sendMessage({ translate: "cl.qds.entregou", with: { rawtext: [{ text: `${o.qtd}x ` }, nomeItem(o.item)] } });
    } else if (o.tipo === "ter" && contar(cs, o.item) + contarNoInventario(j, o.item) >= o.qtd) concluir(j, m.id);
  }
}

export const caixaEntrega: BlockCustomComponent = {
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    let dono = ler<Dono | undefined>("dono", e.block, undefined);
    if (!dono) {
      dono = { id: j.id, nome: j.name };
      gravar("dono", e.block, dono);
    }
    aviso(j, { translate: "cl.qds.dono", with: [dono.nome] }, 6);
  },
  onTick(e) {
    const dono = ler<Dono | undefined>("dono", e.block, undefined);
    if (!dono) return;
    const j = world.getPlayers().find((p) => p.id === dono.id);
    if (j) entregar(j, e.block);
  },
};

export function registrarEntrega(): void {
  world.afterEvents.playerPlaceBlock.subscribe(({ player, block }) => {
    if (block.typeId === "cl:caixa_entrega") gravar("dono", block, { id: player.id, nome: player.name });
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id === "cl:caixa_entrega") gravarEm("dono", block.dimension, block.location, undefined);
  });
  registrarDetalhe("cl:caixa_entrega", (b) => {
    const d = ler<Dono | undefined>("dono", b, undefined);
    return d ? { text: d.nome } : undefined;
  });
}

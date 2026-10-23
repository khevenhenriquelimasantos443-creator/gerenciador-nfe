import { Block, BlockCustomComponent, GameMode, ItemStack, Player, world } from "@minecraft/server";
import { VARAL } from "../config.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { darAoJogador } from "../util/inventario.js";

/*
 * Varal (o Drying Rack do Tinkers): até VARAL.ganchos itens pendurados, cada um com a hora em que fica
 * pronto (tempo absoluto do mundo). Sem tick: o tempo é conferido quando alguém toca ou olha.
 * Toque: primeiro entrega o que já secou; depois, se a mão tiver Carne Podre e houver gancho livre,
 * pendura uma. O estado cl:pendurado (0 a 4) mostra os pedaços no modelo. Quebrar solta tudo.
 */
type Gancho = { t: string; ate: number };
type Varal = { g: Gancho[] };
const agora = () => world.getAbsoluteTime();
const resultado = (g: Gancho) => (agora() >= g.ate ? VARAL.receitas[g.t]?.resultado ?? g.t : g.t);

function estado(b: Block, d: Varal): void {
  gravar("varal", b, d.g.length ? d : undefined);
  definirEstado(b, "cl:pendurado", d.g.length);
}

function resumo(d: Varal): { secando: number; prontos: number; minutos: number } {
  const t = agora();
  const secando = d.g.filter((g) => t < g.ate);
  const proximo = Math.min(...secando.map((g) => g.ate));
  return { secando: secando.length, prontos: d.g.length - secando.length, minutos: secando.length ? Math.ceil((proximo - t) / 1200) : 0 };
}

function tocar(j: Player, b: Block): void {
  const d = ler<Varal>("varal", b, { g: [] });
  // Entrega o que já secou.
  const t = agora();
  const prontos = d.g.filter((g) => t >= g.ate);
  if (prontos.length) {
    d.g = d.g.filter((g) => t < g.ate);
    for (const g of prontos) {
      darAoJogador(j, resultado(g), 1);
      registrarAcao(j, "varal");
    }
    j.playSound("random.pop");
    aviso(j, { translate: "cl.tc.varal_pegou", with: [String(prontos.length)] });
  }
  // Pendura o que estiver na mão.
  const inv = j.getComponent("minecraft:inventory")?.container;
  const mao = inv?.getItem(j.selectedSlotIndex);
  const receita = mao ? VARAL.receitas[mao.typeId] : undefined;
  if (inv && mao && receita) {
    if (d.g.length >= VARAL.ganchos) aviso(j, "cl.tc.varal_cheio");
    else {
      d.g.push({ t: mao.typeId, ate: t + receita.ticks });
      if (j.getGameMode() !== GameMode.Creative) {
        if (mao.amount > 1) {
          mao.amount--;
          inv.setItem(j.selectedSlotIndex, mao);
        } else inv.setItem(j.selectedSlotIndex, undefined);
      }
      j.playSound("mob.zombie.step", { pitch: 1.4, volume: 0.5 });
    }
  }
  estado(b, d);
  if (!prontos.length || receita) {
    const r = resumo(d);
    aviso(j, d.g.length ? { translate: "cl.tc.varal_estado", with: [String(r.secando), String(r.prontos), String(r.minutos)] } : "cl.tc.varal_como", 4);
  }
}

export const varal: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) tocar(e.player, e.block);
  },
};

export function registrarVaral(): void {
  registrarNoCatalogo(() =>
    Object.entries(VARAL.receitas).map(([entrada, r]) => ({
      maquina: { translate: "tile.cl:varal.name" }, maquinaId: "cl:varal",
      entradas: [{ item: entrada, qtd: 1 }], saidas: [{ item: r.resultado, qtd: 1 }],
      nota: { text: `${r.ticks / 1200} min` },
    })),
  );
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    if (brokenBlockPermutation.type.id !== "cl:varal") return;
    const dim = block.dimension, p = block.location;
    for (const g of lerEm<Varal>("varal", dim, p, { g: [] }).g) dim.spawnItem(new ItemStack(resultado(g), 1), block.center());
    gravarEm("varal", dim, p, undefined);
  });
  registrarDetalhe("cl:varal", (b) => {
    const d = ler<Varal>("varal", b, { g: [] });
    if (!d.g.length) return undefined;
    const r = resumo(d);
    return { translate: "cl.tc.varal_estado", with: [String(r.secando), String(r.prontos), String(r.minutos)] };
  });
}

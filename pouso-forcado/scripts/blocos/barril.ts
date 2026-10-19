import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, Difficulty, Player, world } from "@minecraft/server";
import { BARRIL, BARRIL_COMPOSTO, IDS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { darAoJogador, gastarDaMao, itemNaMao, trocarMao } from "../util/inventario.js";
import { creditar } from "./energia.js";

/*
 * Barril do Ex Nihilo (madeira e pedra).
 * - Compostagem: restos (BARRIL_COMPOSTO) enchem de 0 a 1; cheio, vira terra em BARRIL.compostoTicks.
 * - Fluidos: balde de água ou de lava (lava só no barril de pedra) enche 1.000 mB; balde vazio tira.
 * - Com água/lava cheio: poeira -> argila, redstone -> netherrack, pó de glowstone -> pedra do End
 *   (item na mão); bloco de água em cima da lava -> obsidiana; lava em cima da água -> pedregulho;
 *   leite na água -> slime (depois de 1.000 ticks dá bolas de slime; mais 1.000 e nasce um Slime).
 * - O que fica pronto sai com um toque.
 * Estados: cl:conteudo (ver CONTEUDOS) e cl:nivel (0 a 8, a altura do que está dentro).
 * O enchimento da compostagem e os tempos ficam numa dynamic property do mundo, só enquanto valem.
 * Custo: minecraft:tick de 20; barril vazio só lê o próprio estado.
 */
export const CONTEUDOS = ["vazio", "composto", "terra", "agua", "lava", "leite", "slime", "obsidiana", "pedregulho", "argila", "netherrack", "end"] as const;
type Conteudo = (typeof CONTEUDOS)[number];
const BLOCO_PRONTO: Partial<Record<Conteudo, string>> = {
  terra: "minecraft:dirt", obsidiana: "minecraft:obsidian", pedregulho: "minecraft:cobblestone", argila: "minecraft:clay",
  netherrack: "minecraft:netherrack", end: "minecraft:end_stone",
};
const VIRA_EM: Readonly<Record<string, Conteudo>> = {
  "minecraft:clay": "argila", "minecraft:netherrack": "netherrack", "minecraft:end_stone": "end", "minecraft:obsidian": "obsidiana", "minecraft:cobblestone": "pedregulho",
};

type Dados = { c?: number; t?: number }; // c = compostagem (0 a 1); t = ticks contados
const chave = (b: Block) => `cl:barril:${b.dimension.id}:${b.x},${b.y},${b.z}`;
function ler(b: Block): Dados {
  const v = world.getDynamicProperty(chave(b));
  return typeof v === "string" ? (JSON.parse(v) as Dados) : {};
}
const gravar = (b: Block, d: Dados | undefined) => world.setDynamicProperty(chave(b), d ? JSON.stringify(d) : undefined);

const conteudo = (b: Block): Conteudo => CONTEUDOS[lerEstado<number>(b, "cl:conteudo")] ?? "vazio";
function mudar(b: Block, c: Conteudo, nivel = c === "vazio" ? 0 : 8): void {
  definirEstado(b, "cl:conteudo", CONTEUDOS.indexOf(c));
  definirEstado(b, "cl:nivel", nivel);
}

/** Apaga os dados guardados de um barril quebrado. */
export const esquecerBarril = (b: Block): void => gravar(b, undefined);

function tocar(e: BlockComponentPlayerInteractEvent, jogador: Player): void {
  const b = e.block;
  const c = conteudo(b);
  const mao = itemNaMao(jogador);
  const id = mao?.typeId ?? "";
  const pronto = BLOCO_PRONTO[c];
  if (pronto) {
    darAoJogador(jogador, pronto);
    mudar(b, "vazio");
    gravar(b, undefined);
    e.dimension.playSound("random.pop", b.center());
    const acao = c === "terra" ? "barril_terra" : c === "argila" ? "barril_argila" : c === "obsidiana" ? "barril_obsidiana" : undefined;
    if (acao) registrarAcao(jogador, acao);
    return;
  }
  if (c === "slime") {
    darAoJogador(jogador, "minecraft:slime_ball", 1 + Math.floor(Math.random() * 4));
    mudar(b, "vazio");
    gravar(b, undefined);
    return;
  }
  if ((c === "vazio" || c === "composto") && BARRIL_COMPOSTO[id] !== undefined) {
    const d = ler(b);
    if ((d.c ?? 0) >= 1) return aviso(jogador, "cl.barril.cheio");
    d.c = Math.min(1, (d.c ?? 0) + BARRIL_COMPOSTO[id]);
    gravar(b, d);
    mudar(b, "composto", Math.max(1, Math.ceil(d.c * 8 - 1e-9)));
    gastarDaMao(jogador);
    e.dimension.playSound("dig.grass", b.center(), { volume: 0.6 });
    return;
  }
  if (c === "vazio") {
    if (id === "minecraft:water_bucket") {
      mudar(b, "agua");
      trocarMao(jogador, "minecraft:bucket");
      return e.dimension.playSound("bucket.empty_water", b.center());
    }
    if (id === "minecraft:lava_bucket") {
      if (b.typeId === IDS.barrilMadeira) return aviso(jogador, "cl.barril.lava_madeira");
      mudar(b, "lava");
      trocarMao(jogador, "minecraft:bucket");
      return e.dimension.playSound("bucket.empty_lava", b.center());
    }
  }
  if ((c === "agua" || c === "lava") && id === "minecraft:bucket") {
    mudar(b, "vazio");
    trocarMao(jogador, c === "agua" ? "minecraft:water_bucket" : "minecraft:lava_bucket");
    return e.dimension.playSound(c === "agua" ? "bucket.fill_water" : "bucket.fill_lava", b.center());
  }
  if (c === "agua" && id === "minecraft:milk_bucket") {
    mudar(b, "leite");
    gravar(b, { t: 0 });
    trocarMao(jogador, "minecraft:bucket");
    return;
  }
  const receita = BARRIL.receitas.find((r) => r.fluido === c && r.item === id);
  if (receita) {
    gastarDaMao(jogador);
    mudar(b, VIRA_EM[receita.vira]);
    e.dimension.playSound("random.fizz", b.center(), { volume: 0.5 });
    return;
  }
  aviso(jogador, { translate: `cl.barril.${c}` });
}

export const barril: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) tocar(e, e.player);
  },
  onTick(e) {
    const b = e.block;
    const c = conteudo(b);
    if (c === "agua" || c === "lava") {
      const acima = b.above()?.typeId ?? "";
      const enc = BARRIL.encontro.find((x) => x.fluido === c && (x.acima as ReadonlyArray<string>).includes(acima));
      if (enc) {
        mudar(b, VIRA_EM[enc.vira]);
        e.dimension.playSound("random.fizz", b.center());
      }
      return;
    }
    if (c !== "composto" && c !== "leite" && c !== "slime") return;
    const d = ler(b);
    if (c === "composto" && (d.c ?? 0) < 1) return;
    d.t = (d.t ?? 0) + 20;
    if (c === "composto" && d.t >= BARRIL.compostoTicks) {
      mudar(b, "terra");
      gravar(b, undefined);
      creditar(b, "compostar");
      return;
    }
    if (c === "leite" && d.t >= BARRIL.leiteTicks) {
      mudar(b, "slime");
      gravar(b, { t: 0 });
      return;
    }
    if (c === "slime" && d.t >= BARRIL.leiteTicks) {
      mudar(b, "vazio");
      gravar(b, undefined);
      if (world.getDifficulty() !== Difficulty.Peaceful) e.dimension.spawnEntity("minecraft:slime", { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 });
      return;
    }
    gravar(b, d);
  },
};

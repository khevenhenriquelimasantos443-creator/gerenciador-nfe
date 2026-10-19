import { Block, BlockCustomComponent, Player, world } from "@minecraft/server";
import { CADINHO, IDS } from "../config.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { definirEstado, lerEstado } from "../util/blocos.js";
import { gastarDaMao, itemNaMao, trocarMao } from "../util/inventario.js";

/*
 * Cadinho do Ex Nihilo (porcelana cozida). Toque com pedregulho, pedra, cascalho ou netherrack
 * (vira lava) ou com neve, gelo ou folhas (vira água). O bloco logo ABAIXO dá o calor (CADINHO.calor,
 * em mB por tick): tocha, lava, fornalha acesa, fogo, fogueira ou o Gerador a Carvão aceso.
 * Cada bloco ocupa espaço até derreter; cabem CADINHO.capacidade entre o sólido e o líquido, e
 * os fluidos não se misturam. Com 1.000 mB, toque com um balde vazio para encher.
 * Estados: cl:nivel (0 a 4, altura do líquido), cl:fluido (0 nada, 1 lava, 2 água), cl:solido.
 * Os números (mB) ficam numa dynamic property do mundo. Custo: tick de 20 só lê os dados se houver
 * sólido derretendo.
 */
type Dados = { f: "lava" | "agua" | ""; p: number; o: number; l: number }; // p = mB a derreter; o = espaço do sólido; l = líquido
const chave = (b: Block) => `cl:cadinho:${b.dimension.id}:${b.x},${b.y},${b.z}`;
function ler(b: Block): Dados {
  const v = world.getDynamicProperty(chave(b));
  return typeof v === "string" ? (JSON.parse(v) as Dados) : { f: "", p: 0, o: 0, l: 0 };
}
function gravar(b: Block, d: Dados): void {
  const vazio = d.p <= 0 && d.l <= 0;
  world.setDynamicProperty(chave(b), vazio ? undefined : JSON.stringify(d));
  definirEstado(b, "cl:nivel", d.l <= 0 ? 0 : Math.min(4, Math.ceil(d.l / 2500)));
  definirEstado(b, "cl:fluido", vazio ? 0 : d.f === "lava" ? 1 : 2);
  definirEstado(b, "cl:solido", d.p > 0);
}
export const esquecerCadinho = (b: Block): void => world.setDynamicProperty(chave(b), undefined);

/** Calor (mB por tick) do bloco embaixo do cadinho. */
export function calorEmbaixo(b: Block): number {
  const baixo = b.below();
  if (!baixo) return 0;
  const id = baixo.typeId;
  if (id === "minecraft:campfire" || id === "minecraft:soul_campfire") {
    return baixo.permutation.getState("extinguished" as never) ? 0 : CADINHO.calor["minecraft:campfire"];
  }
  if (id === IDS.gerador) return lerEstado<number>(baixo, "cl:combustivel") > 0 ? CADINHO.calor[IDS.gerador] : 0;
  return CADINHO.calor[id] ?? 0;
}

/** Texto do estado, para o toque e para o "o que estou olhando". */
export function resumoCadinho(b: Block): { translate: string; with: string[] } {
  const d = ler(b);
  return { translate: `cl.cadinho.estado_${d.f || "vazio"}`, with: [String(Math.floor(d.l)), String(Math.ceil(d.p)), calorEmbaixo(b).toFixed(2).replace(".", ",")] };
}

function tocar(b: Block, jogador: Player): void {
  const d = ler(b);
  const mao = itemNaMao(jogador);
  const entrada = mao ? CADINHO.entradas[mao.typeId] : undefined;
  if (entrada) {
    if (d.f && d.f !== entrada.fluido && (d.p > 0 || d.l > 0)) return aviso(jogador, "cl.cadinho.mistura");
    if (d.o + d.l + entrada.ocupa > CADINHO.capacidade) return aviso(jogador, "cl.cadinho.cheio");
    d.f = entrada.fluido;
    d.p += entrada.rende;
    d.o += entrada.ocupa;
    gastarDaMao(jogador);
    gravar(b, d);
    b.dimension.playSound("dig.stone", b.center(), { volume: 0.5 });
    return;
  }
  if (mao?.typeId === "minecraft:bucket" && d.l >= 1000) {
    d.l -= 1000;
    const lava = d.f === "lava";
    trocarMao(jogador, lava ? "minecraft:lava_bucket" : "minecraft:water_bucket");
    gravar(b, d);
    b.dimension.playSound(lava ? "bucket.fill_lava" : "bucket.fill_water", b.center());
    if (lava) registrarAcao(jogador, "cadinho_lava");
    return;
  }
  aviso(jogador, resumoCadinho(b));
}

export const cadinho: BlockCustomComponent = {
  onPlayerInteract(e) {
    if (e.player) tocar(e.block, e.player);
  },
  onTick(e) {
    if (!lerEstado<boolean>(e.block, "cl:solido")) return;
    const calor = calorEmbaixo(e.block);
    if (calor <= 0) return;
    const d = ler(e.block);
    if (d.p <= 0) return gravar(e.block, d);
    const derrete = Math.min(d.p, calor * 20);
    d.o = Math.max(0, d.o - (derrete * d.o) / d.p);
    d.p -= derrete;
    d.l += derrete;
    if (d.p < 0.01) {
      d.p = 0;
      d.o = 0;
    }
    gravar(e.block, d);
  },
};

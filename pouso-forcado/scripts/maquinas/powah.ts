import { Block, BlockCustomComponent, BlockVolume, ItemStack, Player } from "@minecraft/server";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F39 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { rf, rfPorTick } from "../util/energia.js";
import { darAoJogador, gastarDaMao, itemNaMao } from "../util/inventario.js";
import { entrada, entregar, gastarCE, primeiro, tirar } from "../util/maquina.js";
import { ceuAberto, produzir, solAlto } from "./mekanism_extra.js";

/*
 * Powah! (1.18.0), com os números do código do mod (owmii/Powah): 7 níveis de cada gerador, célula e cabo.
 * - Furnator: queima combustível de fornalha (o baú em cima ou toque com ele): 30 RF por tick de queima, gerando no
 *   ritmo do nível (15 a 4.800 RF/t).
 * - Magmator: lava (balde: 100.000 RF), no mesmo ritmo do Furnator.
 * - Termogerador: calor embaixo (lava 1.000, magma 800, Bloco de Cristal Ardente 2.800) × água; gera nível × calor /
 *   1.000 e gasta 1 mB de água por tick (tanque de 4 baldes; uma fonte de água encostada não acaba).
 * - Painel Solar: de dia, com céu aberto.
 * - Células e cabos entram na rede de energia (util/rede.ts e os condutos em condutos.ts).
 * - Orbe Energizador: até 6 itens dentro; as Hastes Energizadoras a até 4 blocos, ligadas à energia, mandam RF para
 *   ele no ritmo do nível delas (10 a 3.000 RF/t) até a receita ficar pronta (aço energizado, cristais).
 * Os geradores rodam a cada 5 s (o ciclo da rede); o Orbe, a cada segundo.
 */
const D = DADOS_F39;
const nivelDe = (id: string): number => D.niveis.indexOf(id.slice(id.lastIndexOf("_") + 1) as never);
const nomeNivel = (id: string): string => `cl.pw.nivel.${id.slice(id.lastIndexOf("_") + 1)}`;
const QUEIMA: Readonly<Record<string, number>> = D.queima;
function queimaDe(id: string): number {
  if (QUEIMA[id]) return QUEIMA[id];
  if (id.endsWith("_planks")) return QUEIMA["#planks"];
  if (id.endsWith("_log") || id.endsWith("_wood") || id.endsWith("_stem")) return QUEIMA["#logs"];
  return 0;
}
const CALOR: Readonly<Record<string, number>> = D.calor;
const TANQUE = 4000; // mB de água do Termogerador
const MAX_GUARDA = 64 * 12; // E de combustível guardado no Furnator (64 carvões)

const ultimo = new Map<string, number>(); // E/ciclo gerados por último (para o toque e o "o que estou olhando")
const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
const agora = (b: Block): string => {
  const n = ultimo.get(chave(b)) ?? 0;
  return n > 0 ? rfPorTick(n) : "—";
};
/** Gera `n` E (fração guardada entre os ciclos); devolve se pôde (há bateria ou célula com espaço). */
function gerarAgora(b: Block, n: number): boolean {
  ultimo.set(chave(b), n);
  if (n <= 0) return false;
  const foi = produzir(b, n);
  return foi > 0 || n < 1;
}
function creditar(b: Block, acao: "pw_termo"): void {
  const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
  if (j) registrarAcao(j, acao);
}
const status = (j: Player | undefined, chaveTexto: string, b: Block, extra: string) =>
  j && aviso(j, { translate: chaveTexto, with: { rawtext: [{ translate: nomeNivel(b.typeId) }, { text: agora(b) }, { text: extra }] } }, 5);

// ---------- Furnator e Magmator ----------
function geradorDeCombustivel(tipo: "furnator" | "magmator"): BlockCustomComponent {
  const ritmo = tipo === "furnator" ? D.furnator : D.magmator;
  const valor = (id: string): number => (tipo === "furnator" ? queimaDe(id) * D.porTickQueima : id === "minecraft:lava_bucket" ? D.lavaPorBalde : 0);
  return {
    onTick(e) {
      const b = e.block;
      const quer = ritmo[nivelDe(b.typeId)] ?? 0;
      let guardado = ler<number>("pw_comb", b, 0);
      if (guardado < quer) {
        const ent = entrada(b);
        const c = ent && primeiro(ent, (id) => valor(id) > 0);
        if (c && ent) {
          tirar(ent, c.typeId);
          if (c.typeId === "minecraft:lava_bucket") entregar(b, [new ItemStack("minecraft:bucket", 1)]);
          guardado += valor(c.typeId);
        }
      }
      const n = Math.min(quer, guardado);
      if (gerarAgora(b, n)) guardado -= n;
      gravar("pw_comb", b, guardado);
    },
    onPlayerInteract(e) {
      const b = e.block, j = e.player;
      if (!j) return;
      const mao = itemNaMao(j);
      const v = mao ? valor(mao.typeId) : 0;
      const guardado = ler<number>("pw_comb", b, 0);
      if (v > 0 && guardado + v <= MAX_GUARDA) {
        gastarDaMao(j);
        if (mao?.typeId === "minecraft:lava_bucket") darAoJogador(j, "minecraft:bucket", 1);
        gravar("pw_comb", b, guardado + v);
      }
      status(j, tipo === "furnator" ? "cl.pw.furnator" : "cl.pw.magmator", b, rf(ler<number>("pw_comb", b, 0)));
    },
  };
}
export const furnator = geradorDeCombustivel("furnator");
export const magmator = geradorDeCombustivel("magmator");

// ---------- Termogerador ----------
const fonteDeAgua = (b: Block): boolean => {
  for (const v of [b.north(), b.south(), b.east(), b.west()]) if (v?.typeId === "minecraft:water" && v.permutation.getState("liquid_depth" as never) === 0) return true;
  return false;
};
export const termogerador: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const calor = CALOR[b.below()?.typeId ?? ""] ?? 0;
    let agua = ler<number>("pw_agua", b, 0);
    if (agua < TANQUE - 1000) {
      const ent = entrada(b);
      if (ent && primeiro(ent, (id) => id === "minecraft:water_bucket")) {
        tirar(ent, "minecraft:water_bucket");
        entregar(b, [new ItemStack("minecraft:bucket", 1)]);
        agua += 1000;
      }
    }
    const infinita = fonteDeAgua(b);
    const n = calor > 0 && (infinita || agua >= 100) ? ((D.termogerador[nivelDe(b.typeId)] ?? 0) * calor) / 1000 : 0;
    if (gerarAgora(b, n)) {
      if (!infinita) agua -= 100;
      creditar(b, "pw_termo");
    }
    gravar("pw_agua", b, agua);
  },
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const agua = ler<number>("pw_agua", b, 0);
    if (itemNaMao(j)?.typeId === "minecraft:water_bucket" && agua <= TANQUE - 1000) {
      gastarDaMao(j);
      darAoJogador(j, "minecraft:bucket", 1);
      gravar("pw_agua", b, agua + 1000);
    }
    status(j, "cl.pw.termo", b, String(fonteDeAgua(b) ? "∞" : ler<number>("pw_agua", b, 0)));
  },
};

// ---------- Painel Solar ----------
export const painelSolar: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    gerarAgora(b, solAlto() && ceuAberto(b) ? (D.solar[nivelDe(b.typeId)] ?? 0) : 0);
  },
  onPlayerInteract(e) {
    if (e.player) status(e.player, "cl.pw.solar", e.block, "");
  },
};

// ---------- Orbe Energizador ----------
type Orbe = { itens: string[]; e: number; saida?: [string, number] };
const RECEITAS = D.energizar as ReadonlyArray<{ entradas: readonly string[]; e: number; resultado: string; qtd: number }>;
const HASTES = D.niveis.map((n) => `cl:haste_energizadora_${n}`);
const igual = (a: readonly string[], b: readonly string[]) => a.length === b.length && [...a].sort().join() === [...b].sort().join();
const receitaDe = (itens: readonly string[]) => RECEITAS.find((r) => igual(r.entradas, itens));
const lerOrbe = (b: Block): Orbe => ler<Orbe>("pw_orbe", b, { itens: [], e: 0 });
function hastesPerto(b: Block): Block[] {
  const r = D.alcanceOrbe;
  const achadas: Block[] = [];
  try {
    const lista = b.dimension.getBlocks(new BlockVolume({ x: b.x - r, y: b.y - r, z: b.z - r }, { x: b.x + r, y: b.y + r, z: b.z + r }), { includeTypes: HASTES }, true);
    for (const p of lista.getBlockLocationIterator()) {
      const h = b.dimension.getBlock(p);
      if (h) achadas.push(h);
    }
  } catch {
    // fora da área carregada
  }
  return achadas;
}
export const orbe: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const o = lerOrbe(b);
    if (o.saida || !o.itens.length) return;
    const r = receitaDe(o.itens);
    if (!r) return;
    let ganho = 0;
    for (const h of hastesPerto(b)) {
      const porSegundo = D.hastes[nivelDe(h.typeId)] ?? 0;
      if (porSegundo > 0 && gastarCE(h, Math.max(1, Math.round(porSegundo * 100)))) {
        ganho += porSegundo;
        b.dimension.spawnParticle("minecraft:basic_crit_particle", { x: h.x + 0.5, y: h.y + 0.9, z: h.z + 0.5 });
      }
    }
    if (!ganho) return;
    o.e += ganho;
    if (o.e >= r.e) {
      o.saida = [r.resultado, r.qtd];
      o.itens = [];
      o.e = 0;
      b.dimension.playSound("random.orb", b.center());
      b.dimension.spawnParticle("minecraft:totem_particle", { x: b.x + 0.5, y: b.y + 0.7, z: b.z + 0.5 });
    }
    gravar("pw_orbe", b, o);
  },
  onPlayerInteract(e) {
    const b = e.block, j = e.player;
    if (!j) return;
    const o = lerOrbe(b);
    const mao = itemNaMao(j);
    if (o.saida) {
      if (!mao) {
        darAoJogador(j, o.saida[0], o.saida[1]);
        registrarAcao(j, "energizar");
        if (o.saida[0] === "cl:aco_energizado") registrarAcao(j, "aco_energizado");
        gravar("pw_orbe", b, { itens: [], e: 0 });
      } else aviso(j, "cl.pw.orbe_pronto", 3);
      return;
    }
    if (mao && o.itens.length < 6) {
      o.itens.push(mao.typeId);
      gastarDaMao(j);
      o.e = 0;
      gravar("pw_orbe", b, o);
    } else if (!mao && o.itens.length) {
      for (const id of o.itens) darAoJogador(j, id, 1);
      gravar("pw_orbe", b, { itens: [], e: 0 });
      return;
    }
    const r = receitaDe(o.itens);
    const hastes = hastesPerto(b).length;
    if (!o.itens.length) aviso(j, { translate: "cl.pw.orbe", with: { rawtext: [{ translate: "cl.pw.orbe_vazio" }, { text: "-" }, { text: "-" }, { text: String(hastes) }] } }, 5);
    else if (!r) aviso(j, "cl.pw.orbe_sem_receita", 4);
    else aviso(j, { translate: "cl.pw.orbe", with: { rawtext: [{ translate: new ItemStack(r.resultado).localizationKey }, { text: rf(o.e) }, { text: rf(r.e) }, { text: String(hastes) }] } }, 5);
  },
};

export function registrarPowah(): void {
  const geradores = [
    ...D.niveis.map((n) => `cl:furnator_${n}`), ...D.niveis.map((n) => `cl:magmator_${n}`),
    ...D.niveis.map((n) => `cl:termogerador_${n}`), ...D.niveis.map((n) => `cl:painel_solar_${n}`),
  ];
  registrarDetalhe(geradores, (b) => ({ translate: "cl.pw.gerando", with: [agora(b)] }));
  registrarDetalhe("cl:orbe_energizador", (b) => {
    const o = lerOrbe(b);
    return o.saida ? { translate: "cl.pw.orbe_pronto" } : o.itens.length ? { text: `${o.itens.length}/6 · ${rf(o.e)}` } : undefined;
  });
  // No Catálogo: as receitas do Orbe.
  registrarNoCatalogo(() =>
    RECEITAS.map((r): Receita => ({
      maquina: { translate: "tile.cl:orbe_energizador.name" }, maquinaId: "cl:orbe_energizador",
      entradas: r.entradas.map((item) => ({ item, qtd: 1 })), saidas: [{ item: r.resultado, qtd: r.qtd }], nota: { text: rf(r.e) },
    })),
  );
}

import { Block, BlockCustomComponent, ItemStack } from "@minecraft/server";
import { THERMAL } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F41 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler } from "../util/dados.js";
import { cabe, contar, entrada, entregar, gastarCE, tirar } from "../util/maquina.js";
import { TRITURADOR } from "./mekanism_extra.js";
import { feito, maquina } from "./thermal.js";

/*
 * Mekanism 10.7 (1.21.0), o mais novo: as máquinas de processamento com as receitas do mod (DADOS_F41, lido do código
 * por tools/importar-mekanism.py) e o gasto de energia de cada uma (UsageConfig × 200 ticks; 2,5 J = 1 RF).
 * Baú de cima = entrada, baú de baixo = saída, energia da rede, um ciclo de 5 s por operação (como no pack).
 * Gás e infusão ficam guardados na máquina: o cilindro vale 1.000 mB (devolve o cilindro vazio) e os itens valem o
 * que o mod diz (sílex = 10 mB de oxigênio, lingote de ósmio = 200, redstone = 10 de infusão, carvão = 10...).
 */
type Simples = { entra: string[]; qtd: number; sai: [string, number]; extra?: [string, number, number] | []; qtdExtra?: number };
type Quimico = { entra: string[]; qtd: number; sai: [string, number]; quimico: string; quantidade: number; porTick: boolean };
type Combina = { entra: string[]; qtd: number; extra: string[]; qtdExtra: number; sai: [string, number] };
const D = DADOS_F41 as unknown as {
  processos: { enriching: Simples[]; crushing: Simples[]; sawing: Simples[]; combining: Combina[]; purifying: Quimico[]; injecting: Quimico[];
    compressing: Quimico[]; metallurgic_infusing: Quimico[] };
  infusao: Record<string, Record<string, number>>;
  ce: Record<string, number>;
};
const VAZIO = "cl:cilindro_vazio";
// Fontes de cada química: [item, mB, o que volta].
const CILINDRO: Readonly<Record<string, string>> = { oxygen: "cl:cilindro_oxigenio", hydrogen_chloride: "cl:cilindro_acido" };
function fontes(q: string): ReadonlyArray<[string, number, string?]> {
  const r: [string, number, string?][] = [];
  if (CILINDRO[q]) r.push([CILINDRO[q], 1000, VAZIO]);
  for (const [id, mb] of Object.entries(D.infusao[q] ?? {})) r.push([id, mb]);
  return r;
}
const quemPerto = (b: Block) => b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
function indice<T extends { entra: string[] }>(lista: T[]): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const r of lista) for (const id of r.entra) m.set(id, [...(m.get(id) ?? []), r]);
  return m;
}
const nota = (ce: number) => `${(ce * 40).toLocaleString("pt-BR")} RF`;

/** Máquina de uma entrada só (Enriquecimento, Triturador, Serraria, Fundição). */
function simples(lista: Simples[], ce: number, som: string, acao?: (b: Block, r: Simples) => void) {
  const idx = indice(lista);
  return maquina((b) => {
    const ent = entrada(b);
    if (!ent || !cabe(b)) return "parada";
    for (let s = 0; s < ent.size; s++) {
      const p = ent.getItem(s);
      const r = p && idx.get(p.typeId)?.find((x) => contar(ent, p.typeId) >= x.qtd);
      if (!p || !r) continue;
      if (!gastarCE(b, ce)) return "sem_energia";
      tirar(ent, p.typeId, r.qtd);
      const sai = [new ItemStack(r.sai[0], r.sai[1])];
      if (r.extra && r.extra.length && Math.random() < r.extra[2]) sai.push(new ItemStack(r.extra[0], r.extra[1]));
      entregar(b, sai);
      feito(b, som);
      acao?.(b, r);
      return "ok";
    }
    return "parada";
  }, "cl.mk10.dica");
}

/** Máquina com química guardada (Purificação, Injeção, Compressor de Ósmio, Infusor Metalúrgico). */
function quimica(lista: Quimico[], ce: number, som: string, acao?: (b: Block, r: Quimico) => void) {
  const idx = indice(lista);
  return maquina((b) => {
    const ent = entrada(b);
    if (!ent || !cabe(b)) return "parada";
    const t = ler<Record<string, number>>("mk10_q", b, {});
    let mudou = false;
    for (let s = 0; s < ent.size; s++) {
      const p = ent.getItem(s);
      if (!p) continue;
      for (const r of idx.get(p.typeId) ?? []) {
        if (contar(ent, p.typeId) < r.qtd) continue;
        const precisa = r.quantidade * (r.porTick ? 200 : 1);
        // Enche o tanque da máquina com o que tiver no baú (cilindro ou item da química).
        for (const [id, mb, volta] of fontes(r.quimico)) {
          while ((t[r.quimico] ?? 0) < precisa && id !== p.typeId && tirar(ent, id)) {
            t[r.quimico] = (t[r.quimico] ?? 0) + mb;
            if (volta) entregar(b, [new ItemStack(volta, 1)]);
            mudou = true;
          }
        }
        if ((t[r.quimico] ?? 0) < precisa) continue;
        if (!gastarCE(b, ce)) {
          gravar("mk10_q", b, t);
          return "sem_energia";
        }
        tirar(ent, p.typeId, r.qtd);
        t[r.quimico] -= precisa;
        gravar("mk10_q", b, t);
        entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
        feito(b, som);
        acao?.(b, r);
        return "ok";
      }
    }
    if (mudou) gravar("mk10_q", b, t);
    return "parada";
  }, "cl.mk10.dica");
}

// ---------- As máquinas ----------
const P = D.processos;
export const enriquecimento = simples(P.enriching, D.ce.enrichmentChamber, "dig.gravel");
// O Triturador do pack de antes (biocombustível de plantas, lingote em pó) continua, menos o que o Mekanism 10 já faz.
const JA_TRITURA = new Set(P.crushing.flatMap((r) => r.entra));
const TRITURA: Simples[] = [...P.crushing, ...Object.entries(TRITURADOR).filter(([de]) => !JA_TRITURA.has(de)).map(([de, sai]) => ({ entra: [de], qtd: 1, sai }))];
export const triturador10 = simples(TRITURA, D.ce.crusher, "dig.stone");
export const serraria = simples(P.sawing, D.ce.precisionSawmill, "dig.wood");
// Fundição Energizada: o que a Fornalha de Redstone do Thermal derrete (minério, pó e minério bruto em lingote).
const FORNO: Simples[] = Object.entries(THERMAL.fornalha as Record<string, string>).map(([de, para]) => ({ entra: [de], qtd: 1, sai: [para, 1] }));
export const fundidor = simples(FORNO, D.ce.energizedSmelter, "random.fizz");
export const purificacao10 = quimica(P.purifying, D.ce.purificationChamber, "dig.gravel", (b) => {
  const j = quemPerto(b);
  if (j) registrarAcao(j, "purificar");
});
export const injecao10 = quimica(P.injecting, D.ce.chemicalInjectionChamber, "dig.gravel", (b) => {
  const j = quemPerto(b);
  if (j) registrarAcao(j, "injetar");
});
export const compressor10 = quimica(P.compressing, D.ce.osmiumCompressor, "random.anvil_use");
export const infusor10 = quimica(P.metallurgic_infusing, D.ce.metallurgicInfuser, "random.anvil_use");
// Combinador: o item principal mais o extra (8 pós + pedregulho = minério, por exemplo).
const IDX_COMB = indice(P.combining);
export const combinador = maquina((b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  for (let s = 0; s < ent.size; s++) {
    const p = ent.getItem(s);
    if (!p) continue;
    for (const r of IDX_COMB.get(p.typeId) ?? []) {
      const x = r.extra.find((id) => id !== p.typeId && contar(ent, id) >= r.qtdExtra);
      if (contar(ent, p.typeId) < r.qtd || !x) continue;
      if (!gastarCE(b, D.ce.combiner)) return "sem_energia";
      tirar(ent, p.typeId, r.qtd);
      tirar(ent, x, r.qtdExtra);
      entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
      feito(b, "random.anvil_use");
      return "ok";
    }
  }
  return "parada";
}, "cl.mk10.dica");

/** Componentes novos (main.ts registra) e os que trocam os de antes. */
export const COMPONENTES_MK10: Readonly<Record<string, BlockCustomComponent>> = {
  "cl:mk10_camara_enriquecimento": enriquecimento,
  "cl:mk10_compressor_osmio": compressor10,
  "cl:mk10_combinador": combinador,
  "cl:mk10_fundidor_energizado": fundidor,
  "cl:mk10_serraria_precisao": serraria,
};

export function registrarMekanism10(): void {
  registrarNoCatalogo(() => {
    const r: Receita[] = [];
    const m = (id: string) => ({ maquina: { translate: `tile.${id}.name` }, maquinaId: id });
    const simplesCat = (id: string, lista: Simples[], ce: number) => {
      for (const x of lista)
        r.push({ ...m(id), entradas: [{ item: x.entra[0], qtd: x.qtd }], saidas: [{ item: x.sai[0], qtd: x.sai[1] }, ...(x.extra && x.extra.length ? [{ item: x.extra[0], qtd: x.extra[1], chance: x.extra[2] }] : [])], nota: { text: nota(ce) } });
    };
    simplesCat("cl:camara_enriquecimento", P.enriching, D.ce.enrichmentChamber);
    simplesCat("cl:triturador_mk", P.crushing, D.ce.crusher);
    simplesCat("cl:serraria_precisao", P.sawing, D.ce.precisionSawmill);
    for (const x of P.combining) r.push({ ...m("cl:combinador"), entradas: [{ item: x.entra[0], qtd: x.qtd }, { item: x.extra[0], qtd: x.qtdExtra }], saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: nota(D.ce.combiner) } });
    const quimCat = (id: string, lista: Quimico[], ce: number) => {
      for (const x of lista)
        r.push({ ...m(id), entradas: [{ item: x.entra[0], qtd: x.qtd }], saidas: [{ item: x.sai[0], qtd: x.sai[1] }], nota: { text: `${nota(ce)}, ${x.quantidade * (x.porTick ? 200 : 1)} mB ${x.quimico}` } });
    };
    quimCat("cl:camara_purificacao", P.purifying, D.ce.purificationChamber);
    quimCat("cl:camara_injecao", P.injecting, D.ce.chemicalInjectionChamber);
    quimCat("cl:compressor_osmio", P.compressing, D.ce.osmiumCompressor);
    quimCat("cl:infusor_metalurgico", P.metallurgic_infusing, D.ce.metallurgicInfuser);
    return r;
  });
}

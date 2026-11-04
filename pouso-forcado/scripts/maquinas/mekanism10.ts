import { Block, BlockCustomComponent, ItemStack, RawMessage } from "@minecraft/server";
import { THERMAL } from "../config.js";
import { registrarNoCatalogo, Receita } from "../catalogo/catalogo.js";
import { DADOS_F41, DADOS_F67 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler, registrarDetalhe } from "../util/dados.js";
import { cabe, contar, entrada, entregar, tirar } from "../util/maquina.js";
import { TRITURADOR } from "./mekanism_extra.js";
import { aceitarMelhorias, gastarMk, melhorias, quimicoMk, registrarNiveis, rodarMk, textoMelhorias } from "./mekanism_upgrades.js";
import { maquina } from "./thermal.js";

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

type Status = "ok" | "parada" | "sem_energia";
type Proc = (b: Block) => Status;
/** Uma operação de uma máquina de uma entrada só (Enriquecimento, Triturador, Serraria, Fundição). */
function simples(lista: Simples[], ce: number, acao?: (b: Block, r: Simples) => void): Proc {
  const idx = indice(lista);
  return (b) => {
    const ent = entrada(b);
    if (!ent || !cabe(b)) return "parada";
    for (let s = 0; s < ent.size; s++) {
      const p = ent.getItem(s);
      const r = p && idx.get(p.typeId)?.find((x) => contar(ent, p.typeId) >= x.qtd);
      if (!p || !r) continue;
      if (!gastarMk(b, ce)) return "sem_energia";
      tirar(ent, p.typeId, r.qtd);
      const sai = [new ItemStack(r.sai[0], r.sai[1])];
      if (r.extra && r.extra.length && Math.random() < r.extra[2]) sai.push(new ItemStack(r.extra[0], r.extra[1]));
      entregar(b, sai);
      acao?.(b, r);
      return "ok";
    }
    return "parada";
  };
}

/** Uma operação de uma máquina com química guardada (Purificação, Injeção, Compressor de Ósmio, Infusor Metalúrgico). */
function quimica(lista: Quimico[], ce: number, acao?: (b: Block, r: Quimico) => void): Proc {
  const idx = indice(lista);
  return (b) => {
    const ent = entrada(b);
    if (!ent || !cabe(b)) return "parada";
    const t = ler<Record<string, number>>("mk10_q", b, {});
    let mudou = false;
    for (let s = 0; s < ent.size; s++) {
      const p = ent.getItem(s);
      if (!p) continue;
      for (const r of idx.get(p.typeId) ?? []) {
        if (contar(ent, p.typeId) < r.qtd) continue;
        // Melhoria Química: gasta menos (a de Velocidade, mais), só nas que gastam por tique (Purificação, Injeção).
        const precisa = r.porTick ? quimicoMk(r.quantidade * 200) : r.quantidade;
        // Enche o tanque da máquina com o que tiver no baú (cilindro ou item da química).
        for (const [id, mb, volta] of fontes(r.quimico)) {
          while ((t[r.quimico] ?? 0) < precisa && id !== p.typeId && tirar(ent, id)) {
            t[r.quimico] = (t[r.quimico] ?? 0) + mb;
            if (volta) entregar(b, [new ItemStack(volta, 1)]);
            mudou = true;
          }
        }
        if ((t[r.quimico] ?? 0) < precisa) continue;
        if (!gastarMk(b, ce)) {
          gravar("mk10_q", b, t);
          return "sem_energia";
        }
        tirar(ent, p.typeId, r.qtd);
        t[r.quimico] -= precisa;
        gravar("mk10_q", b, t);
        entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
        acao?.(b, r);
        return "ok";
      }
    }
    if (mudou) gravar("mk10_q", b, t);
    return "parada";
  };
}

// ---------- As máquinas ----------
const P = D.processos;
// O Triturador do pack de antes (biocombustível de plantas, lingote em pó) continua, menos o que o Mekanism 10 já faz.
const JA_TRITURA = new Set(P.crushing.flatMap((r) => r.entra));
const TRITURA: Simples[] = [...P.crushing, ...Object.entries(TRITURADOR).filter(([de]) => !JA_TRITURA.has(de)).map(([de, sai]) => ({ entra: [de], qtd: 1, sai }))];
// Fundição Energizada: o que a Fornalha de Redstone do Thermal derrete (minério, pó e minério bruto em lingote).
const FORNO: Simples[] = Object.entries(THERMAL.fornalha as Record<string, string>).map(([de, para]) => ({ entra: [de], qtd: 1, sai: [para, 1] }));
// Combinador: o item principal mais o extra (8 pós + pedregulho = minério, por exemplo). Com o Gerador de Pedra, o
// pedregulho (e a pedra) não sai do baú.
const IDX_COMB = indice(P.combining);
const PEDRAS = new Set(["minecraft:cobblestone", "minecraft:stone"]); // o Gerador de Pedra do mod dá pedra ou pedregulho
const combinar: Proc = (b) => {
  const ent = entrada(b);
  if (!ent || !cabe(b)) return "parada";
  const pedra = (melhorias(b).pedra ?? 0) > 0;
  for (let s = 0; s < ent.size; s++) {
    const p = ent.getItem(s);
    if (!p) continue;
    for (const r of IDX_COMB.get(p.typeId) ?? []) {
      const gera = pedra ? r.extra.find((id) => PEDRAS.has(id)) : undefined;
      const x = gera ?? r.extra.find((id) => id !== p.typeId && contar(ent, id) >= r.qtdExtra);
      if (contar(ent, p.typeId) < r.qtd || !x) continue;
      if (!gastarMk(b, D.ce.combiner)) return "sem_energia";
      tirar(ent, p.typeId, r.qtd);
      if (!gera) tirar(ent, x, r.qtdExtra);
      entregar(b, [new ItemStack(r.sai[0], r.sai[1])]);
      return "ok";
    }
  }
  return "parada";
};
const missao = (acao: "purificar" | "injetar") => (b: Block) => {
  const j = quemPerto(b);
  if (j) registrarAcao(j, acao);
};
/** Uma operação de cada máquina (as fábricas da parte 2 rodam a mesma, 3 a 9 vezes por ciclo). */
export const PROCS: Readonly<Record<string, { proc: Proc; som: string }>> = {
  "cl:camara_enriquecimento": { proc: simples(P.enriching, D.ce.enrichmentChamber), som: "dig.gravel" },
  "cl:triturador_mk": { proc: simples(TRITURA, D.ce.crusher), som: "dig.stone" },
  "cl:serraria_precisao": { proc: simples(P.sawing, D.ce.precisionSawmill), som: "dig.wood" },
  "cl:fundidor_energizado": { proc: simples(FORNO, D.ce.energizedSmelter), som: "random.fizz" },
  "cl:camara_purificacao": { proc: quimica(P.purifying, D.ce.purificationChamber, missao("purificar")), som: "dig.gravel" },
  "cl:camara_injecao": { proc: quimica(P.injecting, D.ce.chemicalInjectionChamber, missao("injetar")), som: "dig.gravel" },
  "cl:compressor_osmio": { proc: quimica(P.compressing, D.ce.osmiumCompressor), som: "random.anvil_use" },
  "cl:infusor_metalurgico": { proc: quimica(P.metallurgic_infusing, D.ce.metallurgicInfuser), som: "random.anvil_use" },
  "cl:combinador": { proc: combinar, som: "random.anvil_use" },
};
const comp = (id: string) => maquina((b) => rodarMk(b, PROCS[id].proc, 1, PROCS[id].som), "cl.mk10.dica");
export const enriquecimento = comp("cl:camara_enriquecimento");
export const triturador10 = comp("cl:triturador_mk");
export const serraria = comp("cl:serraria_precisao");
export const fundidor = comp("cl:fundidor_energizado");
export const purificacao10 = comp("cl:camara_purificacao");
export const injecao10 = comp("cl:camara_injecao");
export const compressor10 = comp("cl:compressor_osmio");
export const infusor10 = comp("cl:infusor_metalurgico");
export const combinador = comp("cl:combinador");

// ---------- Fábricas (parte 2, 1.50.0): a operação da máquina de origem, 3/5/7/9 vezes por ciclo ----------
const FABRICAS = DADOS_F67.fabricas as unknown as Readonly<Record<string, readonly [string, number, number]>>;
export const fabricaComp = maquina((b) => {
  const f = FABRICAS[b.typeId];
  const m = f && PROCS[f[0]];
  return m ? rodarMk(b, m.proc, f[1], m.som) : "parada";
}, "cl.mk10.dica");
const QUIMICAS = new Set(["cl:camara_purificacao", "cl:camara_injecao"]);
aceitarMelhorias([...Object.keys(PROCS), ...Object.keys(FABRICAS)]);
aceitarMelhorias([...QUIMICAS, ...Object.keys(FABRICAS).filter((id) => QUIMICAS.has(FABRICAS[id][0]))], ["quimica"]);
aceitarMelhorias(["cl:combinador", ...Object.keys(FABRICAS).filter((id) => FABRICAS[id][0] === "cl:combinador")], ["pedra"]);
registrarNiveis(FABRICAS);

/** Componentes novos (main.ts registra) e os que trocam os de antes. */
export const COMPONENTES_MK10: Readonly<Record<string, BlockCustomComponent>> = {
  "cl:mk10_camara_enriquecimento": enriquecimento,
  "cl:mk10_compressor_osmio": compressor10,
  "cl:mk10_combinador": combinador,
  "cl:mk10_fundidor_energizado": fundidor,
  "cl:mk10_serraria_precisao": serraria,
};

export function registrarMekanism10(): void {
  // WAILA: o químico guardado e as melhorias (máquinas e fábricas).
  registrarDetalhe([...Object.keys(PROCS), ...Object.keys(FABRICAS)], (b) => {
    const t = ler<Record<string, number>>("mk10_q", b, {});
    const q = Object.entries(t).filter(([, mb]) => mb > 0).map(([q, mb]) => `${q.replace("hydrogen_chloride", "HCl").replace("oxygen", "O₂")}: ${mb} mB`).join(", ");
    const f = FABRICAS[b.typeId];
    const u = textoMelhorias(b);
    const partes: RawMessage[] = [];
    if (f) partes.push({ text: `§7×${f[1]}` });
    if (q) partes.push({ text: `§7${partes.length ? " | " : ""}${q}` });
    if (u) partes.push({ text: partes.length ? " | " : "" }, u);
    return partes.length ? { rawtext: partes } : undefined;
  });
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

import { Block, Dimension, GameMode, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DADOS_F69 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravarEm, gravarGrande, lerEm, lerGrande } from "../util/dados.js";
import { abrirUmMenu } from "../util/menus.js";
import { consumir, gerar, registrarArmazem } from "../util/rede.js";
import { CHEIO_MK, ehLiquidoMk, MB_CILINDRO, nomeQuimico, Ponta, RECIPIENTE_MK, registrarPonta } from "./mekanism_quimica.js";
import { soltarQuimicos } from "./mekanism_radiacao.js";

/*
 * Multiblocos do Mekanism (1.52.0), com os números do Mekanism 10.7.19 / Generators:
 * - Tanque Dinâmico: 350.000 mB de fluido ou 16.000.000 mB de químico por bloco de dentro.
 * - Planta de Evaporação Térmica: 4×4, altura 3 a 18, topo aberto; água → salmoura → lítio (10 → 1).
 * - Matriz de Indução: células (8 GJ a 4 TJ) e provedores (256 kJ/t a 131 MJ/t) dentro.
 * - Caldeira Térmica: camada de Dispersores; água embaixo (16.000 mB/bloco), vapor em cima (160.000 mB/bloco); cada Elemento
 *   de Superaquecimento passa até 16 MJ/t; 10 J ferve 1 mB.
 * - SPS: 1.000 mB de polônio + 1.000.000 J por mB → 1 mB de antimatéria (energia pelas Bobinas Supercarregadas).
 * - Reator de Fissão: 1 MJ de calor por mB de combustível; 20.000 mB de vapor por mB (eficiência 0,2, 10 J por mB);
 *   8.000 mB de combustível por conjunto; sem água bastante, dano até derreter (explosão de raio 8 e radiação × 50).
 * - Turbina Industrial: vazão = mín(volume de baixo × dispersores × 1.280, ventilações × 32.000) mB/t; energia por mB =
 *   10 J ÷ 28 × mín(pás, bobinas × 4); condensadores devolvem até 64.000 mB/t de água.
 * - Reator de Fusão: 5×5×5; acende com Hohlraum + 400 MJ de laser na Matriz de Foco; cada mB/t de injeção dá 10 MJ × 0,05.
 * O formato é conferido ao pôr um bloco dele (ou ao tocar) e guardado no mundo; o ciclo é de 1 s. Dados por estrutura em
 * "cl:mk_mb" (o conteúdo fica se quebrar e montar igual de novo).
 */
type V = { x: number; y: number; z: number };
type Mb = { t: string; d: string; a: V; b: V; ok: boolean; n: Record<string, number>; s: Record<string, any>; portas: V[] };
type Def = {
  nome: string;
  quadro: ReadonlySet<string>;
  dentro: ReadonlySet<string>;
  min: readonly [number, number, number];
  max: readonly [number, number, number];
  topoAberto?: boolean;
  quadrado?: boolean;
  portas: ReadonlySet<string>;
  validar?: (m: Mb, dim: Dimension) => string | undefined;
  tick?: (m: Mb, dim: Dimension) => void;
  ponta?: (m: Mb) => Ponta | undefined;
  info: (m: Mb) => RawMessage;
  menu?: (j: Player, m: Mb) => Promise<void>;
};
const cl = (...ids: string[]) => new Set(ids.map((i) => `cl:${i}`));
const CEL = DADOS_F69.celulas as unknown as Record<string, number>;
const PROV = DADOS_F69.provedores as unknown as Record<string, number>;
const fmt = (n: number) => Math.round(n).toLocaleString("pt-BR");
const J = (j: number) => (j >= 1e12 ? `${(j / 1e12).toFixed(2)} TJ` : j >= 1e9 ? `${(j / 1e9).toFixed(2)} GJ` : j >= 1e6 ? `${(j / 1e6).toFixed(2)} MJ` : j >= 1e3 ? `${(j / 1e3).toFixed(1)} kJ` : `${Math.round(j)} J`);
const E_J = 10000; // 1 E da rede = 10.000 J
const vol = (m: Mb) => (m.b.x - m.a.x - 1) * (m.b.y - m.a.y - 1) * (m.b.z - m.a.z - 1);
const area = (m: Mb) => (m.b.x - m.a.x - 1) * (m.b.z - m.a.z - 1);
const tot = (m: Mb) => (m.b.x - m.a.x + 1) * (m.b.y - m.a.y + 1) * (m.b.z - m.a.z + 1);
const soma = (m: Mb, tabela: Record<string, number>) => Object.entries(tabela).reduce((s, [id, v]) => s + (m.n[id] ?? 0) * v, 0);
const qtd = (q: string | undefined, mb: number): RawMessage => (q && mb > 0 ? { rawtext: [{ text: `${fmt(mb)} mB ` }, nomeQuimico(q)] } : { text: `0 mB` });
const perto = (dim: Dimension, m: Mb): Player | undefined =>
  dim.getPlayers({ location: { x: (m.a.x + m.b.x) / 2, y: (m.a.y + m.b.y) / 2, z: (m.a.z + m.b.z) / 2 }, maxDistance: 32, closest: 1 })[0];
/** Uma ponta simples sobre um campo {mb} (e q fixo ou livre) do estado. */
function campo(m: Mb, nome: string, q: string | undefined, cap: number, entra: boolean, sai: boolean) {
  return {
    oferece: (): Array<[string, number]> => (sai && (m.s[nome] ?? 0) > 0 ? [[q ?? m.s[`${nome}_q`], m.s[nome]]] : []),
    aceita: (x: string): number => (entra && (q ? x === q : !m.s[`${nome}_q`] || (m.s[nome] ?? 0) <= 0 || m.s[`${nome}_q`] === x) ? Math.max(0, cap - (m.s[nome] ?? 0)) : 0),
    mexer: (x: string, mb: number) => {
      m.s[nome] = Math.max(0, (m.s[nome] ?? 0) + mb);
      if (!q) m.s[`${nome}_q`] = m.s[nome] > 0 ? x : undefined;
    },
  };
}
function juntar(...cs: ReturnType<typeof campo>[]): Ponta {
  return {
    oferece: () => cs.flatMap((c) => c.oferece()),
    aceita: (x) => Math.max(0, ...cs.map((c) => c.aceita(x))),
    mexer: (x, mb) => {
      const c = mb > 0 ? cs.find((k) => k.aceita(x) > 0) : cs.find((k) => k.oferece().some(([q]) => q === x));
      c?.mexer(x, mb);
    },
    gravar: () => sujar(),
  };
}

// ---------- Definições ----------
const DEFS: Record<string, Def> = {
  tanque: {
    nome: "tile.cl:tanque_dinamico.name", quadro: cl("tanque_dinamico", "valvula_dinamica", "vidro_estrutural"), dentro: new Set(), min: [3, 3, 3], max: [18, 18, 18],
    portas: cl("valvula_dinamica"),
    ponta: (m) => {
      const cap = (q: string) => vol(m) * (ehLiquidoMk(q) ? 350000 : 16000000);
      return {
        oferece: () => (m.s.q && m.s.mb > 0 ? [[m.s.q, m.s.mb]] : []),
        aceita: (q) => (!m.s.q || !(m.s.mb > 0) || m.s.q === q ? cap(q) - (m.s.mb ?? 0) : 0),
        mexer: (q, mb) => {
          m.s.mb = Math.max(0, (m.s.mb ?? 0) + mb);
          m.s.q = m.s.mb > 0 ? q : undefined;
        },
        gravar: () => sujar(),
      };
    },
    info: (m) => ({ translate: "cl.mkn.tanque", with: { rawtext: [qtd(m.s.q, m.s.mb ?? 0), { text: fmt(vol(m) * (m.s.q && !ehLiquidoMk(m.s.q) ? 16000000 : 350000)) }] } }),
  },
  evaporacao: {
    nome: "tile.cl:controlador_evaporacao.name", quadro: cl("bloco_evaporacao", "valvula_evaporacao", "controlador_evaporacao"), dentro: new Set(),
    min: [4, 3, 4], max: [4, 18, 4], topoAberto: true, portas: cl("valvula_evaporacao"),
    validar: (m) => ((m.n["cl:controlador_evaporacao"] ?? 0) === 1 ? undefined : "cl.mkn.erro.controlador"),
    tick: (m, dim) => {
      const h = m.b.y - m.a.y + 1;
      const t = world.getTimeOfDay();
      let sol = 0;
      if (dim.id === "minecraft:overworld" && !(t > 12500 && t < 23500)) {
        try {
          const topo = dim.getTopmostBlock({ x: m.a.x + 1, z: m.a.z + 1 });
          sol = topo && topo.y <= m.b.y ? 1 : 0;
        } catch {
          sol = 0;
        }
      }
      const calor = (m.s.calor ?? 0) / 20;
      m.s.calor = 0;
      const ritmo = (sol + calor / 400) * h; // mB/t de entrada
      m.s.ritmo = ritmo;
      const q = m.s.ent_q as string | undefined;
      const sai = q === "water" ? "brine" : q === "brine" ? "lithium" : undefined;
      if (!sai || !(m.s.ent > 0) || ritmo <= 0) return;
      if (m.s.sai_q && m.s.sai_q !== sai && m.s.sai > 0) return;
      const n = Math.floor(Math.min(m.s.ent, ritmo * 20, (10000 - (m.s.sai ?? 0)) * 10) / 10);
      if (n <= 0) return;
      m.s.ent -= n * 10;
      m.s.sai = (m.s.sai ?? 0) + n;
      m.s.sai_q = sai;
      sujar();
    },
    ponta: (m) => {
      const h = m.b.y - m.a.y + 1;
      const ent = campo(m, "ent", undefined, h * 64000, true, false);
      const filtrada = { ...ent, aceita: (x: string) => (x === "water" || x === "brine" ? ent.aceita(x) : 0) };
      return juntar(filtrada, campo(m, "sai", undefined, 10000, false, true));
    },
    info: (m) => ({ translate: "cl.mkn.evaporacao", with: { rawtext: [{ text: String(m.b.y - m.a.y + 1) }, qtd(m.s.ent_q, m.s.ent ?? 0), qtd(m.s.sai_q, m.s.sai ?? 0), { text: (m.s.ritmo ?? 0).toFixed(1) }] } }),
  },
  inducao: {
    nome: "tile.cl:porta_inducao.name", quadro: cl("revestimento_inducao", "porta_inducao", "vidro_estrutural"), dentro: new Set([...Object.keys(CEL), ...Object.keys(PROV)]),
    min: [3, 3, 3], max: [18, 18, 18], portas: cl("porta_inducao"),
    tick: (m) => {
      m.s.entrou = 0;
      m.s.saiu = 0;
    },
    info: (m) => ({ translate: "cl.mkn.inducao", with: [J((m.s.e ?? 0) * E_J), J(soma(m, CEL)), J(soma(m, PROV))] }),
  },
  caldeira: {
    nome: "tile.cl:revestimento_caldeira.name", quadro: cl("revestimento_caldeira", "valvula_caldeira", "vidro_estrutural"), dentro: cl("dispersor_pressao", "elemento_superaquecimento"),
    min: [3, 4, 3], max: [18, 18, 18], portas: cl("valvula_caldeira"),
    validar: (m, dim) => {
      const y = camadaCheia(m, dim, "cl:dispersor_pressao");
      if (y === undefined) return "cl.mkn.erro.dispersor";
      m.s.yd = y;
      return undefined;
    },
    tick: (m) => {
      const calor = (m.s.calor ?? 0) / 20;
      m.s.calor = 0;
      const elementos = m.n["cl:elemento_superaquecimento"] ?? 0;
      const usa = Math.min(calor, elementos * 16000000);
      const { agua, vapor } = capsCaldeira(m);
      const n = Math.floor(Math.min(m.s.agua ?? 0, vapor - (m.s.vapor ?? 0), (usa / 10) * 20));
      m.s.calorT = usa;
      m.s.ferve = n / 20;
      if (n > 0) {
        m.s.agua -= n;
        m.s.vapor = (m.s.vapor ?? 0) + n;
        sujar();
      }
      void agua;
    },
    ponta: (m) => {
      const { agua, vapor } = capsCaldeira(m);
      return juntar(campo(m, "agua", "water", agua, true, false), campo(m, "vapor", "steam", vapor, false, true));
    },
    info: (m) => ({ translate: "cl.mkn.caldeira", with: [fmt(m.s.agua ?? 0), fmt(m.s.vapor ?? 0), fmt(m.s.calorT ?? 0), fmt((m.n["cl:elemento_superaquecimento"] ?? 0) * 16000000), (m.s.ferve ?? 0).toFixed(0)] }),
  },
  sps: {
    nome: "tile.cl:porta_sps.name", quadro: cl("revestimento_sps", "porta_sps", "vidro_estrutural"), dentro: new Set(), min: [5, 5, 5], max: [7, 7, 7], quadrado: true,
    portas: cl("porta_sps"),
    tick: (m, dim) => {
      const bobinas: Block[] = [];
      for (const p of m.portas)
        for (const v of vizinhos(dim, p)) if (v.typeId === "cl:bobina_supercarregada") bobinas.push(v);
      if (!bobinas.length || !(m.s.polonio > 0) || (m.s.antimateria ?? 0) >= 1000) return;
      // 10 mB de polônio por passo = 10.000.000 J = 1.000 E; até 10 passos por segundo.
      for (let k = 0; k < 10 && m.s.polonio >= 10; k++) {
        if (!consumir(bobinas[k % bobinas.length], 1000)) break;
        m.s.polonio -= 10;
        m.s.prog = (m.s.prog ?? 0) + 10;
        if (m.s.prog >= 1000) {
          m.s.prog -= 1000;
          m.s.antimateria = Math.min(1000, (m.s.antimateria ?? 0) + 1);
        }
        sujar();
      }
    },
    ponta: (m) => juntar(campo(m, "polonio", "polonium", 64000, true, false), campo(m, "antimateria", "antimatter", 1000, false, true)),
    info: (m) => ({ translate: "cl.mkn.sps", with: [fmt(m.s.polonio ?? 0), fmt(m.s.antimateria ?? 0)] }),
  },
  fissao: {
    nome: "tile.cl:revestimento_fissao.name", quadro: cl("revestimento_fissao", "porta_fissao", "adaptador_logico_fissao", "vidro_reator_mk"),
    dentro: cl("conjunto_combustivel_fissao", "conjunto_barras_controle"), min: [3, 4, 3], max: [18, 18, 18], portas: cl("porta_fissao"),
    validar: (m, dim) => {
      if (!(m.n["cl:conjunto_combustivel_fissao"] > 0)) return "cl.mkn.erro.combustivel";
      // Cada coluna de conjuntos termina numa Barra de Controle.
      for (let x = m.a.x + 1; x < m.b.x; x++)
        for (let z = m.a.z + 1; z < m.b.z; z++) {
          let tem = false;
          for (let y = m.a.y + 1; y < m.b.y; y++) {
            const id = idEm(dim, { x, y, z });
            if (id === "cl:conjunto_combustivel_fissao") tem = true;
            else if (tem) {
              if (id !== "cl:conjunto_barras_controle") return "cl.mkn.erro.combustivel";
              tem = false;
            }
          }
          if (tem) return "cl.mkn.erro.combustivel";
        }
      m.s.taxa ??= 0.1;
      m.s.scram ??= true;
      return undefined;
    },
    tick: (m, dim) => {
      const n = m.n["cl:conjunto_combustivel_fissao"] ?? 0;
      const capComb = n * 8000, capVapor = tot(m) * 1000000;
      if (!m.s.ativo || !(m.s.comb > 0)) {
        m.s.dano = Math.max(0, (m.s.dano ?? 0) - 1);
        m.s.queima = 0;
        return;
      }
      const queima = Math.min(Math.min(m.s.taxa ?? 0.1, n) * 20, m.s.comb, capComb - (m.s.res ?? 0));
      if (queima <= 0) return;
      m.s.comb -= queima;
      m.s.res = (m.s.res ?? 0) + queima;
      const quer = queima * 20000;
      const usa = Math.min(m.s.agua ?? 0, quer, capVapor - (m.s.vapor ?? 0));
      m.s.agua = (m.s.agua ?? 0) - usa;
      m.s.vapor = (m.s.vapor ?? 0) + usa;
      const falta = (quer - usa) / quer;
      m.s.dano = falta > 0.001 ? (m.s.dano ?? 0) + falta * queima * 0.5 : Math.max(0, (m.s.dano ?? 0) - 1);
      m.s.queima = queima / 20;
      sujar();
      const j = perto(dim, m);
      if (j) registrarAcao(j, "mk_fissao");
      if (m.s.scram && m.n["cl:adaptador_logico_fissao"] && m.s.dano >= 80) m.s.ativo = false;
      if (m.s.dano >= 100) derreter(m, dim);
    },
    ponta: (m) => {
      const n = m.n["cl:conjunto_combustivel_fissao"] ?? 0;
      return juntar(campo(m, "comb", "fissile_fuel", n * 8000, true, false), campo(m, "agua", "water", tot(m) * 100000, true, false),
        campo(m, "vapor", "steam", tot(m) * 1000000, false, true), campo(m, "res", "nuclear_waste", n * 8000, false, true));
    },
    info: (m) => {
      const n = m.n["cl:conjunto_combustivel_fissao"] ?? 0;
      return { translate: "cl.mkn.fissao", with: { rawtext: [{ text: String(n) }, { translate: m.s.ativo ? "cl.mkn.ligado" : "cl.mkn.desligado" }, { text: (m.s.queima ?? 0).toFixed(2) },
        { text: String(n) }, { text: `${fmt(m.s.comb ?? 0)} mB` }, { text: `${fmt(m.s.agua ?? 0)} mB` }, { text: `${fmt(m.s.vapor ?? 0)} mB` }, { text: `${fmt(m.s.res ?? 0)} mB` },
        { text: (m.s.dano ?? 0).toFixed(1) }] } };
    },
    menu: async (j, m) => {
      const n = m.n["cl:conjunto_combustivel_fissao"] ?? 0;
      const f = new ModalFormData().title({ translate: "tile.cl:revestimento_fissao.name" }).label(DEFS.fissao.info(m))
        .toggle({ translate: "cl.mkn.fissao.ligar" }, { defaultValue: !!m.s.ativo })
        .textField({ translate: "cl.mkn.fissao.taxa" }, "0.1", { defaultValue: String(m.s.taxa ?? 0.1) });
      if (m.n["cl:adaptador_logico_fissao"]) f.toggle({ translate: "cl.mkn.fissao.scram" }, { defaultValue: m.s.scram !== false });
      const r = await f.show(j);
      if (r.canceled || !r.formValues) return;
      const v = r.formValues.filter((x) => x !== undefined);
      m.s.ativo = v[0] as boolean;
      m.s.taxa = Math.max(0.1, Math.min(n, Number(String(v[1]).replace(",", ".")) || 0.1));
      if (v.length > 2) m.s.scram = v[2] as boolean;
      sujar(true);
    },
  },
  turbina: {
    nome: "tile.cl:revestimento_turbina_mk.name", quadro: cl("revestimento_turbina_mk", "valvula_turbina_mk", "ventilacao_turbina", "vidro_estrutural"),
    dentro: cl("rotor_turbina", "complexo_rotacional", "dispersor_pressao", "bobina_eletromagnetica", "condensador_saturante"),
    min: [5, 5, 5], max: [17, 18, 17], quadrado: true, portas: cl("valvula_turbina_mk"),
    validar: (m, dim) => {
      if ((m.b.x - m.a.x) % 2 !== 0) return "cl.mkn.erro.tamanho";
      const cx = (m.a.x + m.b.x) / 2, cz = (m.a.z + m.b.z) / 2;
      let y = m.a.y + 1, pas = 0;
      for (; y < m.b.y && idEm(dim, { x: cx, y, z: cz }) === "cl:rotor_turbina"; y++) pas += lerEm<number>("mkr", dim, { x: cx, y, z: cz }, 0);
      if (y === m.a.y + 1 || idEm(dim, { x: cx, y, z: cz }) !== "cl:complexo_rotacional") return "cl.mkn.erro.rotor";
      // A camada do Complexo: o resto cheio de Dispersores.
      for (let x = m.a.x + 1; x < m.b.x; x++)
        for (let z = m.a.z + 1; z < m.b.z; z++) if ((x !== cx || z !== cz) && idEm(dim, { x, y, z }) !== "cl:dispersor_pressao") return "cl.mkn.erro.dispersor";
      m.s.yc = y;
      m.s.pas = pas;
      m.s.baixo = (y - m.a.y - 1) * area(m);
      return undefined;
    },
    tick: (m, dim) => {
      const disp = m.n["cl:dispersor_pressao"] ?? 0, vents = m.n["cl:ventilacao_turbina"] ?? 0, bob = m.n["cl:bobina_eletromagnetica"] ?? 0;
      const fluxo = Math.min((m.s.vapor ?? 0) / 20, (m.s.baixo ?? 0) * disp * 1280, vents * 32000);
      const mult = (10 / 28) * Math.min(m.s.pas ?? 0, bob * 4);
      m.s.fluxo = fluxo;
      m.s.gera = fluxo * mult;
      if (fluxo <= 0 || mult <= 0) return;
      m.s.vapor -= fluxo * 20;
      const cond = m.n["cl:condensador_saturante"] ?? 0;
      m.s.agua = Math.min(1000000, (m.s.agua ?? 0) + Math.min(fluxo, cond * 64000) * 20);
      m.s.eAcc = (m.s.eAcc ?? 0) + (fluxo * mult * 20) / E_J;
      entregarEnergia(m, dim);
      sujar();
      const j = perto(dim, m);
      if (j) registrarAcao(j, "mk_turbina");
    },
    ponta: (m) => juntar(campo(m, "vapor", "steam", (m.s.baixo ?? 0) * 64000, true, false), campo(m, "agua", "water", 1000000, false, true)),
    info: (m) => ({ translate: "cl.mkn.turbina", with: [fmt(m.s.vapor ?? 0), fmt(m.s.fluxo ?? 0), J(m.s.gera ?? 0), String(m.s.pas ?? 0), String(m.n["cl:bobina_eletromagnetica"] ?? 0),
      String(m.n["cl:dispersor_pressao"] ?? 0), String(m.n["cl:ventilacao_turbina"] ?? 0), String(m.n["cl:condensador_saturante"] ?? 0)] }),
  },
  fusao: {
    nome: "tile.cl:controlador_fusao.name", quadro: cl("moldura_fusao", "porta_fusao", "adaptador_logico_fusao", "controlador_fusao", "matriz_foco_laser", "vidro_reator_mk"),
    dentro: new Set(), min: [5, 5, 5], max: [5, 5, 5], portas: cl("porta_fusao"),
    validar: (m) => {
      m.s.inj ??= 2;
      return (m.n["cl:controlador_fusao"] ?? 0) === 1 ? undefined : "cl.mkn.erro.controlador";
    },
    tick: (m, dim) => {
      if (!m.s.aceso) {
        m.s.gera = 0;
        return;
      }
      const inj = m.s.inj ?? 2, quer = inj * 20;
      if ((m.s.dt ?? 0) >= quer) m.s.dt -= quer;
      else if ((m.s.deu ?? 0) >= quer / 2 && (m.s.tri ?? 0) >= quer / 2) {
        m.s.deu -= quer / 2;
        m.s.tri -= quer / 2;
      } else {
        m.s.aceso = false; // o plasma esfria sem combustível
        m.s.gera = 0;
        sujar(true);
        return;
      }
      const calor = quer * 10000000;
      m.s.gera = (calor * 0.05) / 20;
      m.s.eAcc = (m.s.eAcc ?? 0) + (calor * 0.05) / E_J;
      const vapor = Math.min(m.s.agua ?? 0, inj * 100000 - (m.s.vapor ?? 0), (calor * 0.3) / 10);
      if (vapor > 0) {
        m.s.agua -= vapor;
        m.s.vapor = (m.s.vapor ?? 0) + vapor;
      }
      entregarEnergia(m, dim);
      sujar();
    },
    ponta: (m) => juntar(campo(m, "deu", "deuterium", 64000, true, false), campo(m, "tri", "tritium", 64000, true, false), campo(m, "dt", "fusion_fuel", 64000, true, false),
      campo(m, "agua", "water", (m.s.inj ?? 2) * 1000000, true, false), campo(m, "vapor", "steam", (m.s.inj ?? 2) * 100000, false, true)),
    info: (m) => ({ translate: "cl.mkn.fusao", with: { rawtext: [{ translate: m.s.aceso ? "cl.mkn.aceso" : "cl.mkn.apagado" }, { text: String(m.s.inj ?? 2) }, { text: J(m.s.gera ?? 0) },
      { text: `${fmt(m.s.deu ?? 0)} mB` }, { text: `${fmt(m.s.tri ?? 0)} mB` }, { text: `${fmt(m.s.dt ?? 0)} mB` }, { text: `${fmt(m.s.agua ?? 0)} mB` }, { text: `${fmt(m.s.vapor ?? 0)} mB` }] } }),
    menu: async (j, m) => {
      const r = await new ModalFormData().title({ translate: "tile.cl:controlador_fusao.name" }).label(DEFS.fusao.info(m))
        .slider({ translate: "cl.mkn.fusao.injecao" }, 2, 98, { valueStep: 2, defaultValue: m.s.inj ?? 2 }).show(j);
      if (r.canceled || !r.formValues) return;
      const v = r.formValues.filter((x) => x !== undefined);
      m.s.inj = Number(v[0]) || 2;
      sujar(true);
    },
  },
};
const capsCaldeira = (m: Mb) => {
  const ar = area(m);
  const yd = m.s.yd ?? m.a.y + 1;
  return { agua: ar * (yd - m.a.y - 1) * 16000, vapor: ar * (m.b.y - 1 - yd) * 160000 };
};

// ---------- Índice das estruturas ----------
const PROP = "cl:mk_mb";
let idx: Record<string, Mb> | undefined;
const estruturas = (): Record<string, Mb> => {
  if (!idx) {
    idx = lerGrande<Record<string, Mb>>(PROP, {});
  }
  return idx;
};
let sujo = false;
function sujar(agora = false): void {
  sujo = true;
  if (agora) salvar();
}
function salvar(): void {
  if (!sujo) return;
  sujo = false;
  gravarGrande(PROP, estruturas());
}
const chaveMb = (t: string, d: string, a: V) => `${t}|${d}|${a.x},${a.y},${a.z}`;
const dentroDe = (m: Mb, p: V) => p.x >= m.a.x && p.x <= m.b.x && p.y >= m.a.y && p.y <= m.b.y && p.z >= m.a.z && p.z <= m.b.z;
/** A estrutura formada que tem este bloco. */
export function estruturaEm(dim: Dimension, p: V): Mb | undefined {
  for (const m of Object.values(estruturas())) if (m.ok && m.d === dim.id && dentroDe(m, p)) return m;
  return undefined;
}
const idEm = (dim: Dimension, p: V): string => {
  try {
    return dim.getBlock(p)?.typeId ?? "";
  } catch {
    return "";
  }
};
function vizinhos(dim: Dimension, p: V): Block[] {
  const r: Block[] = [];
  for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
    try {
      const b = dim.getBlock({ x: p.x + dx, y: p.y + dy, z: p.z + dz });
      if (b) r.push(b);
    } catch {
      // chunk descarregado
    }
  }
  return r;
}
/** A altura de uma camada de dentro toda feita de `id` (e nenhum `id` fora dela). */
function camadaCheia(m: Mb, dim: Dimension, id: string): number | undefined {
  let achou: number | undefined;
  for (let y = m.a.y + 1; y < m.b.y; y++) {
    let todos = true, algum = false;
    for (let x = m.a.x + 1; x < m.b.x; x++)
      for (let z = m.a.z + 1; z < m.b.z; z++) {
        if (idEm(dim, { x, y, z }) === id) algum = true;
        else todos = false;
      }
    if (todos && achou === undefined) achou = y;
    else if (algum) return undefined;
  }
  return achou;
}

// ---------- Formação ----------
const TODOS_QUADRO = new Set(Object.values(DEFS).flatMap((d) => [...d.quadro]));
const TODOS_DENTRO = new Set(Object.values(DEFS).flatMap((d) => [...d.dentro]));
function formar(dim: Dimension, ini: V, j?: Player): Mb | undefined {
  const id = idEm(dim, ini);
  let erro: string | undefined, nomeErro: string | undefined;
  for (const [t, def] of Object.entries(DEFS)) {
    if (!def.quadro.has(id)) continue;
    // Busca as peças da parede ligadas (até o tamanho máximo) e pega a caixa delas.
    const vistos = new Set([`${ini.x},${ini.y},${ini.z}`]);
    const fila: V[] = [ini];
    const a = { ...ini }, b = { ...ini };
    const limite = def.max[0] * def.max[1] * 2 + def.max[0] * def.max[2] * 2 + def.max[1] * def.max[2] * 2;
    while (fila.length && vistos.size <= limite) {
      const p = fila.shift()!;
      a.x = Math.min(a.x, p.x), a.y = Math.min(a.y, p.y), a.z = Math.min(a.z, p.z);
      b.x = Math.max(b.x, p.x), b.y = Math.max(b.y, p.y), b.z = Math.max(b.z, p.z);
      for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const q = { x: p.x + dx, y: p.y + dy, z: p.z + dz }, k = `${q.x},${q.y},${q.z}`;
        if (vistos.has(k) || !def.quadro.has(idEm(dim, q))) continue;
        vistos.add(k);
        fila.push(q);
      }
    }
    const w = b.x - a.x + 1, h = b.y - a.y + 1, d = b.z - a.z + 1;
    nomeErro = def.nome;
    if (w < def.min[0] || h < def.min[1] || d < def.min[2] || w > def.max[0] || h > def.max[1] || d > def.max[2] || (def.quadrado && w !== d)) {
      erro = "cl.mkn.erro.tamanho";
      continue;
    }
    const m: Mb = { t, d: dim.id, a, b, ok: true, n: {}, s: {}, portas: [] };
    erro = undefined;
    for (let x = a.x; x <= b.x && !erro; x++)
      for (let y = a.y; y <= b.y && !erro; y++)
        for (let z = a.z; z <= b.z && !erro; z++) {
          const borda = x === a.x || x === b.x || y === a.y || y === b.y || z === a.z || z === b.z;
          const i = idEm(dim, { x, y, z });
          if (borda) {
            const furoTopo = def.topoAberto && y === b.y && x > a.x && x < b.x && z > a.z && z < b.z;
            if (furoTopo ? i !== "minecraft:air" && !def.quadro.has(i) : !def.quadro.has(i)) erro = "cl.mkn.erro.parede";
            else if (def.portas.has(i)) m.portas.push({ x, y, z });
          } else if (i !== "minecraft:air" && !def.dentro.has(i)) erro = "cl.mkn.erro.dentro";
          if (!erro && i && i !== "minecraft:air") m.n[i] = (m.n[i] ?? 0) + 1;
        }
    if (erro) continue;
    const k = chaveMb(t, dim.id, a);
    const antes = estruturas()[k];
    if (antes && antes.b.x === b.x && antes.b.y === b.y && antes.b.z === b.z) m.s = antes.s; // monta de novo com o conteúdo de antes
    erro = def.validar?.(m, dim);
    if (erro) continue;
    estruturas()[k] = m;
    sujar(true);
    if (j) {
      aviso(j, { translate: "cl.mkn.forma_ok", with: { rawtext: [{ translate: def.nome }, { text: String(w) }, { text: String(h) }, { text: String(d) }] } }, 4);
      registrarAcao(j, "mk_multibloco");
      if (t === "inducao" && Object.keys(CEL).some((c) => m.n[c]) && Object.keys(PROV).some((c) => m.n[c])) registrarAcao(j, "mk_inducao");
    }
    return m;
  }
  if (j && erro && nomeErro) aviso(j, { translate: "cl.mkn.forma_erro", with: { rawtext: [{ translate: nomeErro }, { translate: erro }] } }, 5);
  return undefined;
}

// ---------- Energia, derretimento, calor e laser ----------
function entregarEnergia(m: Mb, dim: Dimension): void {
  const n = Math.floor(m.s.eAcc ?? 0);
  if (n <= 0 || !m.portas.length) return;
  for (const p of m.portas) {
    const b = dim.getBlock(p);
    if (!b) continue;
    const foi = gerar(b, n);
    m.s.eAcc -= foi;
    if (foi) break;
  }
  m.s.eAcc = Math.min(m.s.eAcc, 1000); // o que não coube some (o mod guarda num buffer pequeno)
}
function derreter(m: Mb, dim: Dimension): void {
  const c = { x: (m.a.x + m.b.x) / 2 + 0.5, y: (m.a.y + m.b.y) / 2, z: (m.a.z + m.b.z) / 2 + 0.5 };
  soltarQuimicos(dim, c, { nuclear_waste: m.s.res ?? 0, fissile_fuel: m.s.comb ?? 0 }, 50);
  for (const j of dim.getPlayers({ location: c, maxDistance: 64 })) aviso(j, "cl.mkn.derreteu", 6);
  m.ok = false;
  m.s = {};
  delete estruturas()[chaveMb(m.t, m.d, m.a)];
  sujar(true);
  dim.createExplosion(c, 8, { breaksBlocks: true, causesFire: false });
}
/** Calor (J/t) entregue a um bloco de multibloco (aquecedores e condutores térmicos). Devolve se alguém usou. */
export function darCalor(b: Block, jPorTique: number): boolean {
  const m = estruturaEm(b.dimension, b);
  if (!m || (m.t !== "caldeira" && m.t !== "evaporacao")) return false;
  m.s.calor = (m.s.calor ?? 0) + jPorTique * 20;
  return true;
}
export const recebeCalor = (b: Block): boolean => {
  const m = TODOS_QUADRO.has(b.typeId) ? estruturaEm(b.dimension, b) : undefined;
  return !!m && (m.t === "caldeira" || m.t === "evaporacao");
};
/** Um feixe de laser chegou neste bloco (Matriz de Foco da fusão). */
export function laserEm(b: Block, joules: number): boolean {
  if (b.typeId !== "cl:matriz_foco_laser") return false;
  const m = estruturaEm(b.dimension, b);
  if (!m || m.t !== "fusao") return false;
  if (!m.s.aceso && m.s.hohl && joules >= 400000000) {
    m.s.aceso = true;
    m.s.hohl = false;
    sujar(true);
    for (const j of b.dimension.getPlayers({ location: b.center(), maxDistance: 32 })) {
      aviso(j, "cl.mkn.acendeu", 5);
      registrarAcao(j, "mk_fusao");
    }
  }
  return true;
}

// ---------- Interação ----------
async function menuInfo(j: Player, m: Mb): Promise<void> {
  const def = DEFS[m.t];
  if (def.menu) return def.menu(j, m);
  await new ActionFormData().title({ translate: def.nome }).body(def.info(m)).button({ translate: "cl.tc.voltar" }).show(j);
}
function usarRecipiente(j: Player, m: Mb, mao: ItemStack): boolean {
  const p = DEFS[m.t].ponta?.(m);
  if (!p) return false;
  const inv = j.getComponent("minecraft:inventory")?.container;
  if (!inv) return false;
  const cheio = CHEIO_MK.get(mao.typeId);
  const criativo = j.getGameMode() === GameMode.Creative;
  const trocar = (novo: string) => {
    if (criativo) return;
    if (mao.amount > 1) {
      mao.amount--;
      inv.setItem(j.selectedSlotIndex, mao);
      const sobra = inv.addItem(new ItemStack(novo, 1));
      if (sobra) j.dimension.spawnItem(sobra, j.location);
    } else inv.setItem(j.selectedSlotIndex, new ItemStack(novo, 1));
  };
  if (cheio) {
    if (p.aceita(cheio.q) < MB_CILINDRO) return false;
    p.mexer(cheio.q, MB_CILINDRO);
    p.gravar();
    trocar(cheio.vazio);
    return true;
  }
  for (const [q, mb] of p.oferece()) {
    const r = RECIPIENTE_MK.get(q);
    const vazio = ehLiquidoMk(q) ? "minecraft:bucket" : "cl:cilindro_vazio";
    if (!r || mao.typeId !== vazio || mb < MB_CILINDRO) continue;
    p.mexer(q, -MB_CILINDRO);
    p.gravar();
    trocar(r);
    return true;
  }
  return false;
}

export function registrarMultiblocos(): void {
  registrarPonta([...new Set(Object.values(DEFS).flatMap((d) => [...d.portas]))], (b) => {
    const m = estruturaEm(b.dimension, b);
    return m ? DEFS[m.t].ponta?.(m) : undefined;
  });
  registrarArmazem(["cl:porta_inducao"], {
    carga: (b) => {
      const m = estruturaEm(b.dimension, b);
      if (!m) return 0;
      const limite = (soma(m, PROV) * 20) / E_J;
      return Math.max(0, Math.min(m.s.e ?? 0, limite - (m.s.saiu ?? 0)));
    },
    capacidade: (b) => {
      const m = estruturaEm(b.dimension, b);
      if (!m) return 0;
      const limite = (soma(m, PROV) * 20) / E_J;
      return Math.min(soma(m, CEL) / E_J, (m.s.e ?? 0) + Math.max(0, limite - (m.s.entrou ?? 0)));
    },
    mudar: (b, delta) => {
      const m = estruturaEm(b.dimension, b);
      if (!m) return;
      m.s.e = Math.max(0, (m.s.e ?? 0) + delta);
      if (delta > 0) m.s.entrou = (m.s.entrou ?? 0) + delta;
      else m.s.saiu = (m.s.saiu ?? 0) - delta;
      sujar();
    },
  });
  // Ciclo de 1 s.
  let passo = 0;
  system.runInterval(() => {
    passo++;
    for (const m of Object.values(estruturas())) {
      if (!m.ok) continue;
      const dim = world.getDimension(m.d);
      try {
        if (!dim.getBlock(m.a)) continue; // descarregado
      } catch {
        continue;
      }
      DEFS[m.t]?.tick?.(m, dim);
    }
    if (passo % 5 === 0) salvar();
  }, 20);
  // Pôr um bloco: tenta formar (ou desfaz a que mudou).
  world.afterEvents.playerPlaceBlock.subscribe(({ player: j, block: b }) => {
    const antiga = estruturaEm(b.dimension, b);
    if (antiga) {
      antiga.ok = false;
      sujar(true);
    }
    if (!TODOS_QUADRO.has(b.typeId) && !TODOS_DENTRO.has(b.typeId) && !antiga) return;
    const dim = b.dimension, p = { x: b.x, y: b.y, z: b.z };
    system.run(() => {
      if (TODOS_QUADRO.has(idEm(dim, p))) formar(dim, p, j);
      else if (antiga) formar(dim, antiga.a, j);
    });
  });
  // Quebrar: a estrutura desfaz (o conteúdo fica guardado para quando montar igual de novo).
  world.afterEvents.playerBreakBlock.subscribe(({ block: b }) => {
    const m = estruturaEm(b.dimension, b);
    if (!m) return;
    m.ok = false;
    sujar(true);
    const dim = b.dimension, a = m.a;
    system.run(() => formar(dim, a));
  });
  // Tocar: recipientes nas válvulas/portas, pás nos rotores, Hohlraum no controlador; senão, o painel.
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const b = ev.block;
    if (!ev.isFirstEvent || (!TODOS_QUADRO.has(b.typeId) && b.typeId !== "cl:rotor_turbina")) return;
    const j = ev.player, mao = ev.itemStack;
    if (mao && (TODOS_QUADRO.has(mao.typeId) || TODOS_DENTRO.has(mao.typeId))) return; // pondo mais blocos
    ev.cancel = true;
    const dim = b.dimension, p = { x: b.x, y: b.y, z: b.z }, id = b.typeId;
    system.run(() => {
      if (id === "cl:rotor_turbina" && mao?.typeId === "cl:pa_turbina_mk") {
        const n = lerEm<number>("mkr", dim, p, 0);
        if (n >= 2) return aviso(j, { translate: "cl.mkn.pa", with: ["2"] }, 3);
        gravarEm("mkr", dim, p, n + 1);
        if (j.getGameMode() !== GameMode.Creative) {
          const inv = j.getComponent("minecraft:inventory")?.container;
          const it = inv?.getItem(j.selectedSlotIndex);
          if (it && it.amount > 1) (it.amount--, inv!.setItem(j.selectedSlotIndex, it));
          else inv?.setItem(j.selectedSlotIndex, undefined);
        }
        aviso(j, { translate: "cl.mkn.pa", with: [String(n + 1)] }, 3);
        const m = estruturaEm(dim, p);
        if (m) formar(dim, m.a);
        return;
      }
      let m = estruturaEm(dim, p);
      if (!m) m = formar(dim, p, j);
      if (!m) return;
      if (id === "cl:controlador_fusao" && mao?.typeId === "cl:hohlraum") {
        m.s.hohl = true;
        sujar(true);
        if (j.getGameMode() !== GameMode.Creative) j.getComponent("minecraft:inventory")?.container?.setItem(j.selectedSlotIndex, undefined);
        return aviso(j, "cl.mkn.hohlraum", 5);
      }
      if (mao && DEFS[m.t].portas.has(id) && usarRecipiente(j, m, mao)) return;
      abrirUmMenu(j, () => menuInfo(j, m!));
    });
  });
  // Teste no servidor: scriptevent cl:teste_mb <formar|ver|por <campo> <mB>|ligar|acender> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mb" || !(j instanceof Player)) return;
    const p = message.split(" ");
    const [x, y, z] = p.slice(-3).map(Number);
    const dim = j.dimension;
    let m = estruturaEm(dim, { x, y, z });
    if (p[0] === "formar") m = formar(dim, { x, y, z }, j);
    if (m && p[0] === "por") {
      m.s[p[1]] = (m.s[p[1]] ?? 0) + Number(p[2]);
      if (p.length >= 7) m.s[p[1] === "mb" ? "q" : `${p[1]}_q`] = p[3];
      sujar(true);
    }
    if (p[0] === "pas") gravarEm("mkr", dim, { x, y, z }, Number(p[1]));
    if (m && p[0] === "ligar") (m.s.ativo = true), (m.s.taxa = Number(p[1]) || 1), sujar(true);
    if (m && p[0] === "acender") (m.s.aceso = true), sujar(true);
    console.warn(`[teste_mb] ${m ? `${m.t} ok=${m.ok} n=${JSON.stringify(m.n)} s=${JSON.stringify(m.s)}` : "nada"}`);
  });
}

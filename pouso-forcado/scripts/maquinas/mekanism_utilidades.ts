import { Block, BlockCustomComponent, Container, Dimension, EquipmentSlot, GameMode, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { nomeDe } from "../catalogo/catalogo.js";
import { DADOS_F66, DADOS_F68 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { entrada, gastarCE, inv, saida, tirar } from "../util/maquina.js";
import { abrirUmMenu } from "../util/menus.js";
import { registrarArmazem } from "../util/rede.js";
import { destinosDaRede, moverItens, porNosDestinos, redeDe, registrarLigacao } from "./condutos.js";
import { capacidadeItem, cargaItem, definirCarga, registrarItemComEnergia } from "./enderio9.js";
import { ehLiquidoMk, ehPonta, MB_CILINDRO, nomeQuimico, Ponta, pontaDe, registrarPonta } from "./mekanism_quimica.js";
import { aceitarMelhorias, gastarMk, rodarMk } from "./mekanism_upgrades.js";

/*
 * Mekanism completo, parte 3 (1.51.0), com os números do Mekanism 10.7.19 (DADOS_F68, de tools/importar-mekanism-completo.py).
 * Energia: 1 cE = 40 RF = 100 J (2,5 J = 1 RF).
 * - Canos Mecânicos (fluidos), Tubos Pressurizados (químicos) e Transportadores Logísticos (itens): tocar troca TIRA/RECEBE
 *   (as ligações "puxar" do Configurador do mod). O que TIRA puxa do que está encostado nele e entrega no que está
 *   encostado nos outros da rede (até 64). Vazão por segundo = a do nível × 20 tiques (canos e tubos); transportador:
 *   puxa 1/16/32/64 itens a cada 10 tiques (o tempo do mod depois de uma entrega). Cabo Universal: rede de energia do pack.
 * - Bomba Elétrica: 19 tiques e 100 J/t por bloco de fluido (1.000 mB), tanque de 10.000 mB, até 80 blocos ligados;
 *   a água com a regra de fonte infinita do jogo não some (como no mod). Plenificador: 20 tiques e 100 J/t por bloco.
 * - Minerador Digital: 80 tiques e 1.000 J/t por bloco; raio padrão 10 (até 32), y 0 a 60; energia × (1 + (raio − 10)/22) ×
 *   (1 + (altura − 60)/(altura do mundo − 61)); Toque Suave × 12. Sem filtros só minera no Inverso.
 * - Teletransportador: 1.000 J + 10 J por bloco (+10.000 J para outra dimensão), para o mais perto da mesma frequência
 *   (a mesma dimensão primeiro). Portátil: 1.000.000 J no item. Leitor Sísmico: 12.000 J, 250 J por leitura.
 * - Entrelaçador Quântico: por frequência, 1 espaço de item, energia de um Cubo Definitivo (256 MJ), fluido e químico
 *   dos tanques Definitivos.
 */
type Taxa = readonly [string, readonly number[]];
const D = DADOS_F68 as unknown as {
  transmissores: Record<string, Taxa>;
  niveis: Record<string, string>;
  energia: { bomba: number; plenificador: number; minerador: number; vibrador: number };
};
const TANQUES = DADOS_F66.tanques as unknown as Record<string, readonly [string, number]>;
const ce = (joules: number) => joules / 100;
const perto = (b: Block): Player | undefined => b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
const acao = (b: Block, a: Parameters<typeof registrarAcao>[1]) => {
  const j = perto(b);
  if (j) registrarAcao(j, a);
};
const chaveB = (b: { x: number; y: number; z: number; dimension: Dimension }) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
const extrai = (b: Block) => b.permutation.getState("cl:extrai" as never) === true;
const LADOS: ReadonlyArray<(b: Block) => Block | undefined> = [(b) => b.north(), (b) => b.south(), (b) => b.east(), (b) => b.west(), (b) => b.above(), (b) => b.below()];
const vizinhos = (b: Block): Block[] => {
  const r: Block[] = [];
  for (const passo of LADOS) {
    try {
      const v = passo(b);
      if (v) r.push(v);
    } catch {
      // chunk descarregado
    }
  }
  return r;
};
const fmt = (n: number) => Math.round(n).toLocaleString("pt-BR");

// ======================= Transmissores =======================
const tipoDe = (id: string): string | undefined => D.transmissores[id]?.[0];
const mesmaRede = (tipo: string) => (id: string) => tipoDe(id) === tipo;
const serveQ = (tipo: string, q: string) => (tipo === "cano_mecanico") === ehLiquidoMk(q);

/** Canos e tubos: puxa das pontas encostadas e entrega nas pontas encostadas aos outros da rede. */
function moverFluido(b: Block, tipo: string, porTique: number): number {
  const ehRede = mesmaRede(tipo);
  const fontes: Array<{ k: string; p: Ponta }> = [];
  for (const v of vizinhos(b)) {
    const p = !ehRede(v.typeId) ? pontaDe(v) : undefined;
    if (p) fontes.push({ k: chaveB(v), p });
  }
  if (!fontes.length) return 0;
  const vistos = new Set(fontes.map((f) => f.k));
  const destinos: Ponta[] = [];
  for (const c of redeDe(b, ehRede)) {
    if (extrai(c)) continue;
    for (const v of vizinhos(c)) {
      const k = chaveB(v);
      if (vistos.has(k) || ehRede(v.typeId)) continue;
      const p = pontaDe(v);
      if (!p) continue;
      vistos.add(k);
      destinos.push(p);
    }
  }
  if (!destinos.length) return 0;
  let falta = porTique * 20;
  const mexidas = new Set<Ponta>();
  for (const { p: f } of fontes) {
    for (const [q, tem] of f.oferece()) {
      if (!serveQ(tipo, q)) continue;
      let resta = tem;
      for (const d of destinos) {
        const n = Math.min(falta, resta, d.aceita(q));
        if (n <= 0) continue;
        f.mexer(q, -n);
        d.mexer(q, n);
        mexidas.add(f).add(d);
        falta -= n;
        resta -= n;
        if (!falta || !resta) break;
      }
      if (!falta) break;
    }
    if (!falta) break;
  }
  for (const p of mexidas) p.gravar();
  return porTique * 20 - falta;
}

export const transmissorComp: BlockCustomComponent = {
  onTick({ block: b }) {
    if (!extrai(b)) return;
    const t = D.transmissores[b.typeId];
    if (!t) return;
    const [tipo, taxa] = t;
    if (tipo === "transportador_logistico") {
      if (moverItens(b, mesmaRede(tipo), taxa[0]) > 0) acao(b, "mk_transportador");
    } else if (moverFluido(b, tipo, taxa[1]) > 0) acao(b, "mk_cano");
  },
  onPlayerInteract({ block: b, player: j }) {
    if (!j) return;
    const agora = !extrai(b);
    b.setPermutation(b.permutation.withState("cl:extrai" as never, agora as never));
    aviso(j, { translate: "cl.mkl.modo", with: { rawtext: [{ translate: `tile.${b.typeId}.name` }, { translate: agora ? "cl.mkl.tira" : "cl.mkl.recebe" }] } }, 4);
  },
};

// ======================= Bomba Elétrica e Plenificador Fluídico =======================
type Fl = { q?: string; mb: number; fim?: boolean };
const CAP_FL = 10000, ALCANCE = 80, MAX_BUSCA = 512;
const FONTE: Readonly<Record<string, string>> = { "minecraft:water": "water", "minecraft:lava": "lava", "minecraft:flowing_water": "water", "minecraft:flowing_lava": "lava" };
const BLOCO_DE: Readonly<Record<string, string>> = { water: "minecraft:water", lava: "minecraft:lava" };
const BALDE_DE: Readonly<Record<string, string>> = { water: "minecraft:water_bucket", lava: "minecraft:lava_bucket" };
const DO_BALDE: Readonly<Record<string, string>> = { "minecraft:water_bucket": "water", "minecraft:lava_bucket": "lava" };
const fluidoDe = (b: Block): string | undefined => FONTE[b.typeId];
const ehFonte = (b: Block): boolean => {
  if (!fluidoDe(b)) return false;
  try {
    return (b.permutation.getState("liquid_depth" as never) as unknown as number) === 0;
  } catch {
    return false;
  }
};
/** Fonte de fluido mais perto embaixo da bomba (busca em largura pelo fluido ligado, até 80 blocos de distância). */
function acharFonte(b: Block, q?: string): Block | undefined {
  let ini: Block | undefined;
  try {
    ini = b.below();
  } catch {
    return undefined;
  }
  if (!ini || !fluidoDe(ini) || (q && fluidoDe(ini) !== q)) return undefined;
  const tipo = fluidoDe(ini)!;
  const vistos = new Set([chaveB(ini)]);
  const fila = [ini];
  while (fila.length && vistos.size < MAX_BUSCA) {
    const at = fila.shift()!;
    if (ehFonte(at)) return at;
    for (const v of vizinhos(at)) {
      const k = chaveB(v);
      if (vistos.has(k) || fluidoDe(v) !== tipo || Math.abs(v.x - b.x) + Math.abs(v.y - b.y) + Math.abs(v.z - b.z) > ALCANCE) continue;
      vistos.add(k);
      fila.push(v);
    }
  }
  return undefined;
}
// A água tem fonte infinita no jogo: a bomba tira sem apagar (pumpInfiniteFluidSources = false no mod).
const infinita = (q: string) => q === "water";
function encherBaldes(b: Block, f: Fl): void {
  const c = entrada(b);
  if (!c || !f.q || !BALDE_DE[f.q]) return;
  for (let n = 0; n < 4 && f.mb >= MB_CILINDRO && c.emptySlotsCount >= 0; n++) {
    if (!tirar(c, "minecraft:bucket")) break;
    f.mb -= MB_CILINDRO;
    const sobra = c.addItem(new ItemStack(BALDE_DE[f.q], 1));
    if (sobra) b.dimension.spawnItem(sobra, b.center());
  }
  if (f.mb <= 0) (f.mb = 0), delete f.q;
}
function bomba(b: Block): void {
  const f = ler<Fl>("mkb", b, { mb: 0 });
  rodarMk(b, (x) => {
    if (f.mb + MB_CILINDRO > CAP_FL) return "parada";
    const fonte = acharFonte(x, f.q);
    if (!fonte) return "parada";
    if (!gastarMk(x, ce(D.energia.bomba * 19))) return "sem_energia";
    const q = fluidoDe(fonte)!;
    if (!infinita(q)) fonte.setType("minecraft:air");
    f.q = q;
    f.mb += MB_CILINDRO;
    return "ok";
  }, 20 / 19, "bucket.fill_water");
  encherBaldes(b, f);
  gravar("mkb", b, f);
}
/** Lugar vazio mais baixo em volta e embaixo do Plenificador (busca em largura pelo ar, sem subir). */
function acharVazio(b: Block): Block | undefined {
  let ini: Block | undefined;
  try {
    ini = b.below();
  } catch {
    return undefined;
  }
  if (!ini || !(ini.isAir || fluidoDe(ini))) return undefined;
  const vistos = new Set([chaveB(ini)]);
  const fila = [ini];
  let melhor: Block | undefined;
  while (fila.length && vistos.size < MAX_BUSCA) {
    const at = fila.shift()!;
    if ((at.isAir || (fluidoDe(at) && !ehFonte(at))) && (!melhor || at.y < melhor.y)) melhor = at;
    for (const v of vizinhos(at)) {
      const k = chaveB(v);
      if (vistos.has(k) || v.y > ini.y || !(v.isAir || (fluidoDe(v) && !ehFonte(v)))) continue;
      if (Math.abs(v.x - b.x) + Math.abs(v.z - b.z) > ALCANCE) continue;
      vistos.add(k);
      fila.push(v);
    }
  }
  return melhor;
}
function plenificador(b: Block): void {
  const f = ler<Fl>("mkpl", b, { mb: 0 });
  const c = entrada(b);
  // Baldes cheios no baú de cima: esvaziam no tanque (o balde vazio volta ao baú).
  if (c)
    for (let s = 0; s < c.size && f.mb + MB_CILINDRO <= CAP_FL; s++) {
      const it = c.getItem(s);
      const q = it && DO_BALDE[it.typeId];
      if (!it || !q || (f.q && f.mb > 0 && f.q !== q)) continue;
      tirar(c, it.typeId);
      c.addItem(new ItemStack("minecraft:bucket", 1));
      f.q = q;
      f.mb += MB_CILINDRO;
    }
  rodarMk(b, (x) => {
    if (!f.q || f.mb < MB_CILINDRO || !BLOCO_DE[f.q]) return "parada";
    const alvo = acharVazio(x);
    if (!alvo) {
      f.fim = true;
      return "parada";
    }
    if (!gastarMk(x, ce(D.energia.plenificador * 20))) return "sem_energia";
    alvo.setType(BLOCO_DE[f.q]);
    f.mb -= MB_CILINDRO;
    f.fim = false;
    if (f.mb <= 0) (f.mb = 0), delete f.q;
    return "ok";
  }, 1, "bucket.empty_water");
  gravar("mkpl", b, f);
}
registrarPonta(["cl:bomba_eletrica"], (b) => {
  const f = ler<Fl>("mkb", b, { mb: 0 });
  return {
    oferece: () => (f.q && f.mb > 0 ? [[f.q, f.mb]] : []),
    aceita: () => 0,
    mexer: (q, mb) => {
      f.mb += mb;
      if (f.mb <= 0) (f.mb = 0), delete f.q;
    },
    gravar: () => gravar("mkb", b, f),
  };
});
registrarPonta(["cl:plenificador_fluidico"], (b) => {
  const f = ler<Fl>("mkpl", b, { mb: 0 });
  return {
    oferece: () => [],
    aceita: (q) => (BLOCO_DE[q] && (!f.q || f.mb <= 0 || f.q === q) ? CAP_FL - f.mb : 0),
    mexer: (q, mb) => {
      f.q = q;
      f.mb += mb;
    },
    gravar: () => gravar("mkpl", b, f),
  };
});

// ======================= Minerador Digital =======================
type Mi = { liga?: boolean; r: number; y0: number; y1: number; filtros: string[]; inv?: boolean; suave?: boolean; i: number; fim?: boolean };
const RAIO_PADRAO = 10, RAIO_MAX = 32, ALTURA_PADRAO = 60;
const novoMi = (): Mi => ({ r: RAIO_PADRAO, y0: 0, y1: ALTURA_PADRAO, filtros: [], i: 0 });
const NUNCA = new Set(["minecraft:bedrock", "minecraft:barrier", "minecraft:command_block", "minecraft:structure_block", "minecraft:end_portal_frame",
  "minecraft:end_portal", "minecraft:portal", "minecraft:end_gateway", "minecraft:reinforced_deepslate", "minecraft:light_block", "minecraft:moving_block"]);
const ehMinerio = (id: string) => /_ore$|:minerio_|ancient_debris/.test(id);
function casa(m: Mi, id: string): boolean {
  const bate = m.filtros.some((f) => (f === "#minerios" ? ehMinerio(id) : f === id));
  return m.inv ? !bate : bate;
}
function energiaMinerador(m: Mi, alturaMundo: number): number {
  const raio = Math.max(0, (m.r - RAIO_PADRAO) / (RAIO_MAX - RAIO_PADRAO));
  const altura = Math.max(0, (m.y1 - m.y0 - ALTURA_PADRAO) / (alturaMundo - 1 - ALTURA_PADRAO));
  return ce(D.energia.minerador * 80) * (1 + raio) * (1 + altura) * (m.suave ? 12 : 1);
}
const totalMi = (m: Mi) => (2 * m.r + 1) ** 2 * Math.max(0, m.y1 - m.y0 + 1);
/** Posição número i (de cima para baixo, camada por camada). */
function posMi(b: Block, m: Mi, i: number): Vector3 {
  const lado = 2 * m.r + 1;
  const camada = Math.floor(i / (lado * lado));
  const resto = i % (lado * lado);
  return { x: b.x - m.r + (resto % lado), y: m.y1 - camada, z: b.z - m.r + Math.floor(resto / lado) };
}
function minerarUm(b: Block, m: Mi): "ok" | "parada" | "sem_energia" {
  if (!m.liga || m.fim || !m.filtros.length && !m.inv) return "parada";
  const destino = entrada(b);
  if (!destino || destino.emptySlotsCount === 0) return "parada";
  const total = totalMi(m);
  const dim = b.dimension;
  for (let olhou = 0; olhou < 256 && m.i < total; olhou++, m.i++) {
    const p = posMi(b, m, m.i);
    if (p.x === b.x && p.z === b.z && (p.y === b.y || p.y === b.y + 1)) continue;
    let alvo: Block | undefined;
    try {
      alvo = dim.getBlock(p);
    } catch {
      alvo = undefined;
    }
    if (!alvo || alvo.isAir || alvo.isLiquid || NUNCA.has(alvo.typeId) || inv(alvo) || !casa(m, alvo.typeId)) continue;
    if (!gastarMk(b, energiaMinerador(m, dim.heightRange.max - dim.heightRange.min))) return "sem_energia";
    let pilhas: ItemStack[] = [];
    if (m.suave) {
      const it = alvo.getItemStack(1, false);
      if (it) {
        pilhas = [it];
        alvo.setType("minecraft:air");
      }
    }
    if (!pilhas.length) {
      dim.runCommand(`setblock ${p.x} ${p.y} ${p.z} air destroy`);
      for (const e of dim.getEntities({ location: { x: p.x + 0.5, y: p.y + 0.5, z: p.z + 0.5 }, maxDistance: 1.5, type: "minecraft:item" })) {
        const it = e.getComponent("minecraft:item")?.itemStack;
        if (!it) continue;
        pilhas.push(it);
        e.remove();
      }
    }
    for (const it of pilhas) {
      const sobra = destino.addItem(it);
      if (sobra) dim.spawnItem(sobra, b.center());
    }
    m.i++;
    const n = ler<number>("mkm_n", b, 0) + 1;
    gravar("mkm_n", b, n);
    if (n % 64 === 0) acao(b, "mk_minerador");
    return "ok";
  }
  if (m.i >= total) m.fim = true;
  return "parada";
}
function minerador(b: Block): void {
  const m = ler<Mi>("mkm", b, novoMi());
  if (!m.liga) return;
  // 80 tiques por bloco; o ciclo é de 20 tiques.
  rodarMk(b, (x) => minerarUm(x, m), 20 / 80, "dig.stone");
  gravar("mkm", b, m);
}
async function menuMinerador(j: Player, b: Block): Promise<void> {
  const m = ler<Mi>("mkm", b, novoMi());
  const dim = b.dimension;
  const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
  const custo = energiaMinerador(m, dim.heightRange.max - dim.heightRange.min);
  const f = new ModalFormData()
    .title({ translate: "cl.mkl.minerador.titulo" })
    .label({ translate: "cl.mkl.minerador.corpo", with: [String(2 * m.r + 1), `${fmt(custo * 100)} J`, fmt(Math.max(0, totalMi(m) - m.i))] })
    .toggle({ translate: "cl.mkl.minerador.ligado" }, { defaultValue: !!m.liga })
    .slider({ translate: "cl.mkl.minerador.raio" }, 0, RAIO_MAX, { valueStep: 1, defaultValue: m.r })
    .textField({ translate: "cl.mkl.minerador.ymin" }, String(dim.heightRange.min), { defaultValue: String(m.y0) })
    .textField({ translate: "cl.mkl.minerador.ymax" }, String(b.y - 1), { defaultValue: String(m.y1) })
    .toggle({ translate: "cl.mkl.minerador.suave" }, { defaultValue: !!m.suave })
    .toggle({ translate: "cl.mkl.minerador.inverso" }, { defaultValue: !!m.inv })
    .textField({ translate: "cl.mkl.minerador.filtros" }, "#minerios", { defaultValue: m.filtros.join(", ") })
    .toggle({ translate: "cl.mkl.minerador.mao" }, { defaultValue: false });
  const r = await f.show(j);
  if (r.canceled || !r.formValues || !b.isValid || b.typeId !== "cl:minerador_digital") return;
  const v = r.formValues.filter((x) => x !== undefined);
  const [liga, raio, y0, y1, suave, inverso, filtros, porMao] = v as [boolean, number, string, string, boolean, boolean, string, boolean];
  const novo = ler<Mi>("mkm", b, novoMi());
  const lim = (n: number) => Math.max(dim.heightRange.min, Math.min(dim.heightRange.max - 1, Math.round(n)));
  const a = lim(Number(y0) || 0), z = lim(Number(y1) || 0);
  const lista = filtros.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).map((x) => (x.startsWith("#") || x.includes(":") ? x : `minecraft:${x}`));
  if (porMao && mao) lista.push(mao.typeId);
  const mudou = novo.r !== raio || novo.y0 !== Math.min(a, z) || novo.y1 !== Math.max(a, z) || novo.inv !== inverso || lista.join() !== novo.filtros.join();
  Object.assign(novo, { liga, r: raio, y0: Math.min(a, z), y1: Math.max(a, z), suave, inv: inverso, filtros: [...new Set(lista)] });
  if (mudou || liga && novo.fim) (novo.i = 0), (novo.fim = false);
  gravar("mkm", b, novo);
}

// ======================= Carregador de Chão =======================
const RF_POR_TIQUE_ITEM = 2000; // 5.000 J/t, a carga dos itens do mod
function carregador(b: Block): void {
  for (const j of b.dimension.getPlayers({ location: { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 }, maxDistance: 1.1 })) {
    const pilhas: Array<{ it: ItemStack; por: (i: ItemStack) => void }> = [];
    const c = j.getComponent("minecraft:inventory")?.container;
    if (c)
      for (let s = 0; s < c.size; s++) {
        const it = c.getItem(s);
        if (it && capacidadeItem(it.typeId)) pilhas.push({ it, por: (i) => c.setItem(s, i) });
      }
    const eq = j.getComponent("minecraft:equippable");
    for (const slot of [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand]) {
      const it = eq?.getEquipment(slot);
      if (it && capacidadeItem(it.typeId)) pilhas.push({ it, por: (i) => eq!.setEquipment(slot, i) });
    }
    for (const { it, por } of pilhas) {
      const cap = capacidadeItem(it.typeId)!;
      const n = Math.min(cap - cargaItem(it), RF_POR_TIQUE_ITEM * 10);
      if (n <= 0) continue;
      if (!gastarCE(b, Math.max(1, Math.round(n / 40)))) return;
      definirCarga(it, cargaItem(it) + n);
      por(it);
    }
  }
}

// ======================= Frequências (Entrelaçador e Teletransportador) =======================
type Freq = { k: string; nome: string; dono?: string };
const chaveFreq = (nome: string, privada: boolean, j: Player) => (privada ? `${j.id}|${nome}` : `*|${nome}`);
const nomeFreq = (k: string) => k.slice(k.indexOf("|") + 1);
const podeUsar = (k: string, j: Player) => k.startsWith("*|") || k.startsWith(`${j.id}|`);
async function menuFrequencia(j: Player, b: Block, tipo: string, corpo: RawMessage): Promise<string | undefined | null> {
  const atual = ler<Freq | undefined>(tipo, b, undefined);
  const r = await new ModalFormData()
    .title({ translate: "cl.mkl.freq.titulo" })
    .label(corpo)
    .textField({ translate: "cl.mkl.freq.nome" }, "Base", { defaultValue: atual ? atual.nome : "" })
    .toggle({ translate: "cl.mkl.freq.privada" }, { defaultValue: !!atual && !atual.k.startsWith("*|") })
    .show(j);
  if (r.canceled || !r.formValues || !b.isValid) return null;
  const [nome, privada] = r.formValues.filter((x) => x !== undefined) as [string, boolean];
  const n = nome.trim().slice(0, 24);
  return n ? chaveFreq(n, privada, j) : undefined;
}

// ---------- Entrelaçador Quântico ----------
type Qe = { item?: { t: string; n: number; de?: string }; e: number; fl?: { q: string; mb: number }; ch?: { q: string; mb: number } };
const PROP_QE = "cl:mk_qe";
const CAP_E_QE = 256000000 / 10000; // 256 MJ (Cubo Definitivo) em E (1 E = 10.000 J)
const CAP_FL_QE = TANQUES["cl:tanque_fluido_definitivo"]?.[1] ?? 256000;
const CAP_CH_QE = TANQUES["cl:tanque_quimico_definitivo"]?.[1] ?? 8192000;
let qeCache: Record<string, Qe> | undefined;
const qes = (): Record<string, Qe> => {
  if (!qeCache) {
    try {
      qeCache = JSON.parse((world.getDynamicProperty(PROP_QE) as string | undefined) ?? "{}") as Record<string, Qe>;
    } catch {
      qeCache = {};
    }
  }
  return qeCache;
};
let salvarQe = false;
const marcarQe = () => {
  if (salvarQe) return;
  salvarQe = true;
  system.runTimeout(() => {
    salvarQe = false;
    world.setDynamicProperty(PROP_QE, JSON.stringify(qes()));
  }, 20);
};
const freqQe = (b: Block): Qe | undefined => {
  const f = ler<Freq | undefined>("mk_qe", b, undefined);
  if (!f) return undefined;
  return (qes()[f.k] ??= { e: 0 });
};
const simples = (i: ItemStack) =>
  !i.nameTag && !i.getLore().length && !i.getDynamicPropertyIds().length && !i.getComponent("minecraft:enchantable")?.getEnchantments().length && !i.getComponent("minecraft:durability")?.damage;
function entrelacador(b: Block): void {
  const q = freqQe(b);
  if (!q) return;
  const ent = entrada(b), sai = saida(b);
  let mexeu = false;
  // Baú de cima entra no espaço da frequência (um item, até a pilha dele).
  if (ent)
    for (let s = 0; s < ent.size; s++) {
      const it = ent.getItem(s);
      if (!it || !simples(it) || (q.item && q.item.t !== it.typeId)) continue;
      const cabeN = it.maxAmount - (q.item?.n ?? 0);
      const n = Math.min(cabeN, it.amount);
      if (n <= 0) break;
      q.item = { t: it.typeId, n: (q.item?.n ?? 0) + n, de: chaveB(b) };
      if (it.amount > n) (it.amount -= n), ent.setItem(s, it);
      else ent.setItem(s, undefined);
      mexeu = true;
      break;
    }
  // O espaço sai no baú de baixo (de outro Entrelaçador: o que entrou por este não volta para ele).
  if (sai && q.item && q.item.n > 0 && q.item.de !== chaveB(b)) {
    const sobra = sai.addItem(new ItemStack(q.item.t, q.item.n));
    const ficou = sobra?.amount ?? 0;
    if (ficou !== q.item.n) {
      q.item.n = ficou;
      if (!ficou) delete q.item;
      mexeu = true;
    }
  }
  if (mexeu) marcarQe();
}
registrarPonta(["cl:entrelacador_quantico"], (b) => {
  const q = freqQe(b);
  if (!q) return undefined;
  return {
    oferece: () => [...(q.fl && q.fl.mb > 0 ? [[q.fl.q, q.fl.mb] as [string, number]] : []), ...(q.ch && q.ch.mb > 0 ? [[q.ch.q, q.ch.mb] as [string, number]] : [])],
    aceita: (x) => {
      const t = ehLiquidoMk(x) ? q.fl : q.ch;
      const cap = ehLiquidoMk(x) ? CAP_FL_QE : CAP_CH_QE;
      return !t || t.mb <= 0 || t.q === x ? cap - (t?.mb ?? 0) : 0;
    },
    mexer: (x, mb) => {
      const campo = ehLiquidoMk(x) ? "fl" : "ch";
      const t = (q[campo] ??= { q: x, mb: 0 });
      t.q = x;
      t.mb += mb;
      if (t.mb <= 0) delete q[campo];
    },
    gravar: marcarQe,
  };
});

// ---------- Classificador Logístico ----------
type So = { f: string[]; def?: boolean; um?: boolean };
const DIRS: Readonly<Record<string, Vector3>> = { north: { x: 0, y: 0, z: -1 }, south: { x: 0, y: 0, z: 1 }, east: { x: 1, y: 0, z: 0 }, west: { x: -1, y: 0, z: 0 } };
function frente(b: Block): Vector3 {
  let d = "north";
  try {
    d = b.permutation.getState("minecraft:cardinal_direction" as never) as unknown as string;
  } catch {
    // sem direção
  }
  return DIRS[d] ?? DIRS.north;
}
const ehTransportador = mesmaRede("transportador_logistico");
function classificador(b: Block): void {
  const so = ler<So>("mks", b, { f: [] });
  if (!so.f.length && !so.def) return;
  const v = frente(b);
  let tras: Block | undefined, fr: Block | undefined;
  try {
    tras = b.offset({ x: -v.x, y: 0, z: -v.z });
    fr = b.offset(v);
  } catch {
    return;
  }
  const origem = inv(tras);
  if (!origem || !fr) return;
  let destinos: Container[] = [];
  if (ehTransportador(fr.typeId)) {
    destinos = destinosDaRede(fr, ehTransportador, new Set([chaveB(tras!)]));
  } else {
    const c = inv(fr);
    if (c) destinos = [c];
  }
  if (!destinos.length) return;
  for (let s = 0; s < origem.size; s++) {
    const it = origem.getItem(s);
    if (!it) continue;
    const filtrado = so.f.includes(it.typeId);
    if (!filtrado && !so.def) continue;
    const n = so.um ? 1 : it.amount;
    const parte = it.clone();
    parte.amount = n;
    const resto = porNosDestinos(parte, destinos);
    const foi = n - (resto?.amount ?? 0);
    if (!foi) continue;
    if (it.amount > foi) (it.amount -= foi), origem.setItem(s, it);
    else origem.setItem(s, undefined);
    acao(b, "mk_transportador");
    return;
  }
}
async function menuClassificador(j: Player, b: Block): Promise<void> {
  const so = ler<So>("mks", b, { f: [] });
  const mao = j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
  const r = await new ModalFormData()
    .title({ translate: "cl.mkl.classificador.titulo" })
    .label({ translate: "cl.mkl.classificador.corpo" })
    .textField({ translate: "cl.mkl.classificador.filtros" }, "minecraft:iron_ingot", { defaultValue: so.f.join(", ") })
    .toggle({ translate: "cl.mkl.classificador.padrao" }, { defaultValue: !!so.def })
    .toggle({ translate: "cl.mkl.classificador.um" }, { defaultValue: !!so.um })
    .toggle({ translate: "cl.mkl.classificador.mao" }, { defaultValue: false })
    .show(j);
  if (r.canceled || !r.formValues || !b.isValid) return;
  const [txt, def, um, porMao] = r.formValues.filter((x) => x !== undefined) as [string, boolean, boolean, boolean];
  const lista = txt.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).map((x) => (x.includes(":") ? x : `minecraft:${x}`));
  if (porMao && mao) lista.push(mao.typeId);
  gravar("mks", b, { f: [...new Set(lista)], def, um });
}

// ======================= Vibrador e Leitor Sísmico, Alarme =======================
const vibrando = new Map<string, number>(); // "dim|cx,cz" -> tique até quando vibra
const chunkDe = (dim: Dimension, x: number, z: number) => `${dim.id}|${Math.floor(x / 16)},${Math.floor(z / 16)}`;
function vibrador(b: Block): void {
  if (gastarCE(b, ce(D.energia.vibrador * 20))) vibrando.set(chunkDe(b.dimension, b.x, b.z), system.currentTick + 30);
}
const LEITOR = "cl:leitor_sismico", CAP_LEITOR = 12000 * 0.4, USO_LEITOR = 250 * 0.4;
async function lerSismico(j: Player, item: ItemStack): Promise<void> {
  const dim = j.dimension;
  const x = Math.floor(j.location.x), z = Math.floor(j.location.z);
  if ((vibrando.get(chunkDe(dim, x, z)) ?? 0) < system.currentTick) return aviso(j, "cl.mkl.leitor.sem_vibrador", 4);
  if (j.getGameMode() !== GameMode.Creative) {
    if (cargaItem(item) < USO_LEITOR) return aviso(j, "cl.mkl.leitor.sem_carga", 4);
    definirCarga(item, cargaItem(item) - USO_LEITOR);
    j.getComponent("minecraft:equippable")?.setEquipment(EquipmentSlot.Mainhand, item);
  }
  const contagem = new Map<string, number>();
  const minerios: RawMessage[] = [];
  for (let y = Math.floor(j.location.y) - 1; y >= dim.heightRange.min; y--) {
    let id: string;
    try {
      id = dim.getBlock({ x, y, z })?.typeId ?? "minecraft:air";
    } catch {
      continue;
    }
    if (id === "minecraft:air") continue;
    contagem.set(id, (contagem.get(id) ?? 0) + 1);
    if (ehMinerio(id) && minerios.length < 40) minerios.push({ text: `\ny ${y}: ` }, nomeDe(id));
  }
  const total: RawMessage[] = [...contagem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).flatMap(([id, n]) => [{ text: `\n${n}× ` }, nomeDe(id)]);
  registrarAcao(j, "mk_sismico");
  await new ActionFormData()
    .title({ translate: "cl.mkl.leitor.titulo", with: [String(x), String(z)] })
    .body({ rawtext: [{ translate: "cl.mkl.leitor.total" }, ...total, { text: "\n\n" }, { translate: "cl.mkl.leitor.minerios" }, ...minerios] })
    .button({ translate: "cl.tc.voltar" })
    .show(j);
}
function alarme(b: Block): void {
  let forca = 0;
  for (const v of [b, ...vizinhos(b)]) {
    try {
      forca = Math.max(forca, v.getRedstonePower() ?? 0);
    } catch {
      // sem redstone
    }
  }
  if (forca > 0) b.dimension.playSound("cl.mk.alarme", b.center(), { volume: 1 });
}

// ======================= Teletransportador =======================
const PROP_TP = "cl:mk_tps";
const TP = "cl:teletransportador", MOLDURA = "cl:moldura_teletransportador";
type Pos = { d: string; x: number; y: number; z: number };
const lerTps = (): Record<string, string[]> => {
  try {
    return JSON.parse((world.getDynamicProperty(PROP_TP) as string | undefined) ?? "{}") as Record<string, string[]>;
  } catch {
    return {};
  }
};
const posDe = (s: string): Pos => {
  const [d, xyz] = s.split("|");
  const [x, y, z] = xyz.split(",").map(Number);
  return { d, x, y, z };
};
function indexarTp(b: { x: number; y: number; z: number; dimension: Dimension }, antiga?: string, nova?: string): void {
  const tps = lerTps();
  const k = chaveB(b);
  if (antiga) {
    tps[antiga] = (tps[antiga] ?? []).filter((x) => x !== k);
    if (!tps[antiga].length) delete tps[antiga];
  }
  if (nova) tps[nova] = [...new Set([...(tps[nova] ?? []), k])];
  world.setDynamicProperty(PROP_TP, JSON.stringify(tps));
}
const ehMoldura = (dim: Dimension, p: Vector3) => {
  try {
    return dim.getBlock(p)?.typeId === MOLDURA;
  } catch {
    return false;
  }
};
const vao = (dim: Dimension, p: Vector3) => {
  try {
    const b = dim.getBlock(p);
    return !!b && (b.isAir || b.isLiquid);
  } catch {
    return false;
  }
};
/** A moldura do mod: 3 de largura e 4 de altura, o Teletransportador no meio de baixo, 2 de vão dentro (em x ou em z). */
function temMoldura(dim: Dimension, p: Vector3): boolean {
  for (const [ax, az] of [[1, 0], [0, 1]]) {
    let ok = vao(dim, { x: p.x, y: p.y + 1, z: p.z }) && vao(dim, { x: p.x, y: p.y + 2, z: p.z }) && ehMoldura(dim, { x: p.x, y: p.y + 3, z: p.z });
    for (let dy = 0; dy <= 3 && ok; dy++) ok = ehMoldura(dim, { x: p.x - ax, y: p.y + dy, z: p.z - az }) && ehMoldura(dim, { x: p.x + ax, y: p.y + dy, z: p.z + az });
    if (ok) return true;
  }
  return false;
}
const custoTp = (de: Pos, para: Pos) =>
  1000 + 10 * Math.hypot(de.x - para.x, de.y - para.y, de.z - para.z) * (de.d === para.d ? 1 : 0) + (de.d === para.d ? 0 : 10000);
/** O Teletransportador mais perto da frequência (a mesma dimensão primeiro), menos o próprio. */
function destinoTp(k: string, de: Pos): Pos | undefined {
  let melhor: Pos | undefined;
  for (const s of lerTps()[k] ?? []) {
    const p = posDe(s);
    if (p.d === de.d && p.x === de.x && p.y === de.y && p.z === de.z) continue;
    if (!melhor) melhor = p;
    else if (melhor.d !== de.d && p.d === de.d) melhor = p;
    else if (p.d === melhor.d && Math.hypot(p.x - de.x, p.y - de.y, p.z - de.z) < Math.hypot(melhor.x - de.x, melhor.y - de.y, melhor.z - de.z)) melhor = p;
  }
  return melhor;
}
const recemChegados = new Map<string, string>(); // jogador -> teletransportador onde chegou (só volta a ir depois de sair do vão)
function levar(j: Player, para: Pos): void {
  j.teleport({ x: para.x + 0.5, y: para.y + 1, z: para.z + 0.5 }, { dimension: world.getDimension(para.d) });
  recemChegados.set(j.id, `${para.d}|${para.x},${para.y},${para.z}`);
  system.run(() => j.dimension.playSound("mob.endermen.portal", j.location, { volume: 0.8 }));
  registrarAcao(j, "mk_teletransporte");
}
function teletransportador(b: Block): void {
  const f = ler<Freq | undefined>("mk_tp", b, undefined);
  const k = chaveB(b);
  const dentro = b.dimension.getPlayers({ location: { x: b.x + 0.5, y: b.y + 2, z: b.z + 0.5 }, maxDistance: 1.6 }).filter((j) => {
    const p = j.location;
    return Math.floor(p.x) === b.x && Math.floor(p.z) === b.z && p.y >= b.y + 0.9 && p.y < b.y + 3;
  });
  for (const [id, onde] of recemChegados) if (onde === k && !dentro.some((j) => j.id === id)) recemChegados.delete(id);
  if (!f || !dentro.length || !temMoldura(b.dimension, b)) return;
  const de: Pos = { d: b.dimension.id, x: b.x, y: b.y, z: b.z };
  const para = destinoTp(f.k, de);
  for (const j of dentro) {
    if (recemChegados.get(j.id) === k) continue;
    if (!para) {
      aviso(j, "cl.mkl.tp.sem_destino", 3);
      continue;
    }
    const custo = custoTp(de, para);
    if (!gastarCE(b, Math.ceil(ce(custo)))) {
      aviso(j, { translate: "cl.mkl.tp.sem_energia", with: [`${fmt(custo)} J`] }, 3);
      continue;
    }
    levar(j, para);
  }
}
const PORTATIL = "cl:teletransportador_portatil", CAP_PORTATIL = 1000000 * 0.4;
async function usarPortatil(j: Player, item: ItemStack): Promise<void> {
  const tps = lerTps();
  const freqs = Object.keys(tps).filter((k) => podeUsar(k, j) && tps[k].length).sort();
  if (!freqs.length) return aviso(j, "cl.mkl.tp.nenhuma", 4);
  const f = new ActionFormData().title({ translate: "cl.mkl.tp.portatil" }).body({ translate: "cl.mkl.tp.escolha", with: [`${fmt(cargaItem(item) * 2.5)} J`] });
  for (const k of freqs) f.button(`${nomeFreq(k)}${k.startsWith("*|") ? "" : " 🔒"} (${tps[k].length})`);
  const r = await f.show(j);
  if (r.canceled || r.selection === undefined) return;
  const de: Pos = { d: j.dimension.id, x: Math.floor(j.location.x), y: Math.floor(j.location.y), z: Math.floor(j.location.z) };
  const para = destinoTp(freqs[r.selection], de);
  if (!para) return aviso(j, "cl.mkl.tp.sem_destino", 3);
  const rf = custoTp(de, para) * 0.4;
  const inv2 = j.getComponent("minecraft:inventory")?.container;
  const atual = inv2?.getItem(j.selectedSlotIndex);
  if (j.getGameMode() !== GameMode.Creative) {
    if (!atual || atual.typeId !== PORTATIL || cargaItem(atual) < rf) return aviso(j, { translate: "cl.mkl.tp.sem_energia", with: [`${fmt(rf * 2.5)} J`] }, 4);
    definirCarga(atual, cargaItem(atual) - rf);
    inv2!.setItem(j.selectedSlotIndex, atual);
  }
  levar(j, para);
}

// ======================= Componente das máquinas, WAILA, eventos =======================
const TICK: Readonly<Record<string, (b: Block) => void>> = {
  "cl:bomba_eletrica": bomba, "cl:plenificador_fluidico": plenificador, "cl:minerador_digital": minerador, "cl:carregador_chao": carregador,
  "cl:entrelacador_quantico": entrelacador, "cl:classificador_logistico": classificador, "cl:vibrador_sismico": vibrador, "cl:alarme_industrial": alarme,
  "cl:teletransportador": teletransportador,
};
const fluidoTexto = (f?: { q?: string; mb: number }): RawMessage => (f?.q && f.mb > 0 ? { rawtext: [{ text: `${fmt(f.mb)} mB ` }, nomeQuimico(f.q)] } : { translate: "cl.mkq.vazio" });
const freqTexto = (f?: Freq): RawMessage => (f ? { text: `${f.nome}${f.k.startsWith("*|") ? "" : " 🔒"}` } : { translate: "cl.mkl.freq.nenhuma" });
function estadoQe(b: Block): RawMessage {
  const f = ler<Freq | undefined>("mk_qe", b, undefined);
  const q = freqQe(b);
  return { translate: "cl.mkl.qe.estado", with: { rawtext: [freqTexto(f), q?.item ? { rawtext: [{ text: `${q.item.n}× ` }, nomeDe(q.item.t)] } : { translate: "cl.mkq.vazio" },
    { text: fmt(q?.e ?? 0) }, fluidoTexto(q?.fl), fluidoTexto(q?.ch)] } };
}
function estadoMi(b: Block): RawMessage {
  const m = ler<Mi>("mkm", b, novoMi());
  const st: RawMessage = !m.liga ? { translate: "cl.mkl.desligado" } : m.fim ? { translate: "cl.mkl.minerador.terminou" } : { text: `${Math.floor((100 * m.i) / Math.max(1, totalMi(m)))}%` };
  return { translate: "cl.mkl.minerador.estado", with: { rawtext: [st, { text: String(m.r) }, { text: String(m.y0) }, { text: String(m.y1) }, { text: String(m.filtros.length) }, { text: m.inv ? " · inverso" : "" }] } };
}
async function trocarFrequencia(j: Player, b: Block, tipo: "mk_qe" | "mk_tp", corpo: RawMessage): Promise<void> {
  const nova = await menuFrequencia(j, b, tipo, corpo);
  if (nova === null || !b.isValid) return;
  const antiga = ler<Freq | undefined>(tipo, b, undefined);
  gravar(tipo, b, nova ? { k: nova, nome: nomeFreq(nova), dono: j.id } : undefined);
  if (tipo === "mk_tp") indexarTp(b, antiga?.k, nova);
  const ligados = tipo === "mk_tp" ? (lerTps()[nova ?? ""] ?? []).length : 0;
  aviso(j, { translate: "cl.mkl.freq.ok", with: { rawtext: [nova ? { text: nomeFreq(nova) } : { translate: "cl.mkl.freq.nenhuma" }, { text: String(ligados) }] } }, 4);
}
export const utilComp: BlockCustomComponent = {
  onTick({ block: b }) {
    TICK[b.typeId]?.(b);
  },
  onPlayerInteract({ block: b, player: j }) {
    if (!j) return;
    switch (b.typeId) {
      case "cl:minerador_digital":
        return abrirUmMenu(j, () => menuMinerador(j, b));
      case "cl:classificador_logistico":
        return abrirUmMenu(j, () => menuClassificador(j, b));
      case "cl:entrelacador_quantico":
        return abrirUmMenu(j, () => trocarFrequencia(j, b, "mk_qe", { rawtext: [{ translate: "cl.mkl.qe.corpo" }, { text: "\n\n" }, estadoQe(b)] }));
      case "cl:teletransportador":
        return abrirUmMenu(j, () => trocarFrequencia(j, b, "mk_tp", { translate: "cl.mkl.tp.corpo", with: { rawtext: [{ translate: temMoldura(b.dimension, b) ? "cl.mkl.tp.moldura_ok" : "cl.mkl.tp.moldura_falta" }] } }));
      case "cl:bomba_eletrica":
        return aviso(j, { translate: "cl.mkl.bomba", with: { rawtext: [fluidoTexto(ler<Fl>("mkb", b, { mb: 0 }))] } }, 7);
      case "cl:plenificador_fluidico":
        return aviso(j, { translate: "cl.mkl.plenificador", with: { rawtext: [fluidoTexto(ler<Fl>("mkpl", b, { mb: 0 }))] } }, 7);
      case "cl:carregador_chao":
        return aviso(j, "cl.mkl.carregador", 5);
      case "cl:vibrador_sismico":
        return aviso(j, { translate: "cl.mkl.vibrador", with: { rawtext: [{ translate: (vibrando.get(chunkDe(b.dimension, b.x, b.z)) ?? 0) >= system.currentTick ? "cl.mkl.vibrando" : "cl.mkl.desligado" }] } }, 5);
      case "cl:alarme_industrial":
        return aviso(j, "cl.mkl.alarme", 4);
    }
  },
};

export function registrarMekanismUtilidades(): void {
  aceitarMelhorias(["cl:bomba_eletrica", "cl:plenificador_fluidico", "cl:minerador_digital"]);
  registrarItemComEnergia(PORTATIL, CAP_PORTATIL);
  registrarItemComEnergia(LEITOR, CAP_LEITOR);
  // Energia do Entrelaçador: a da frequência (como a rede Ender do Powah!).
  registrarArmazem(["cl:entrelacador_quantico"], {
    carga: (b) => freqQe(b)?.e ?? 0,
    capacidade: (b) => (freqQe(b) ? CAP_E_QE : 0),
    mudar: (b, delta) => {
      const q = freqQe(b);
      if (!q) return;
      q.e = Math.max(0, Math.min(CAP_E_QE, q.e + delta));
      marcarQe();
    },
  });
  // Com o que cada transmissor liga.
  const ids = Object.keys(D.transmissores);
  registrarLigacao(ids, (b, v) => {
    const tipo = tipoDe(b.typeId)!;
    if (tipoDe(v.typeId) === tipo) return true;
    if (tipo === "transportador_logistico") return !!inv(v) || v.typeId === "cl:classificador_logistico";
    return ehPonta(v.typeId);
  });
  // WAILA
  registrarDetalhe(ids, (b) => {
    const [tipo, taxa] = D.transmissores[b.typeId];
    const vazao = tipo === "transportador_logistico" ? `${taxa[0]} itens/10 t` : `${fmt(taxa[1])} mB/t`;
    return { translate: "cl.mkl.taxa", with: { rawtext: [{ translate: extrai(b) ? "cl.mkl.tira" : "cl.mkl.recebe" }, { text: vazao }] } };
  });
  registrarDetalhe(["cl:bomba_eletrica"], (b) => fluidoTexto(ler<Fl>("mkb", b, { mb: 0 })));
  registrarDetalhe(["cl:plenificador_fluidico"], (b) => fluidoTexto(ler<Fl>("mkpl", b, { mb: 0 })));
  registrarDetalhe(["cl:minerador_digital"], estadoMi);
  registrarDetalhe(["cl:entrelacador_quantico"], estadoQe);
  registrarDetalhe(["cl:teletransportador"], (b) => {
    const f = ler<Freq | undefined>("mk_tp", b, undefined);
    return { rawtext: [freqTexto(f), { text: " · " }, { translate: temMoldura(b.dimension, b) ? "cl.mkl.tp.moldura_ok" : "cl.mkl.tp.moldura_falta" }] };
  });
  registrarDetalhe(["cl:classificador_logistico"], (b) => {
    const so = ler<So>("mks", b, { f: [] });
    return { translate: "cl.mkl.classificador.estado", with: [String(so.f.length), so.def ? "✔" : "✘"] };
  });
  // Itens: Teletransportador Portátil e Leitor Sísmico.
  world.afterEvents.itemUse.subscribe(({ itemStack: i, source: j }) => {
    if (i.typeId === PORTATIL) abrirUmMenu(j, () => usarPortatil(j, i));
    else if (i.typeId === LEITOR) abrirUmMenu(j, () => lerSismico(j, i));
  });
  // Quebrar: limpa os dados (o Minerador e o Teletransportador saem do índice).
  world.afterEvents.playerBreakBlock.subscribe(({ block: b, brokenBlockPermutation: p }) => {
    const id = p.type.id;
    if (!TICK[id] && !D.transmissores[id]) return;
    if (id === TP) indexarTp(b, lerEm<Freq | undefined>("mk_tp", b.dimension, b.location, undefined)?.k);
    for (const t of ["mkb", "mkpl", "mkm", "mkm_n", "mk_qe", "mk_tp", "mks"]) gravarEm(t, b.dimension, b.location, undefined);
  });
  // Teste no servidor: scriptevent cl:teste_mkl <ver|freq <nome>|minerar <filtro>|modo> <x y z>.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_mkl" || !(j instanceof Player)) return;
    const p = message.split(" ");
    const [acaoT] = p;
    const [x, y, z] = p.slice(-3).map(Number);
    const b = j.dimension.getBlock({ x, y, z });
    if (!b) return;
    if (acaoT === "freq") {
      const tipo = b.typeId === TP ? "mk_tp" : "mk_qe";
      const k = `*|${p[1]}`;
      const antiga = ler<Freq | undefined>(tipo, b, undefined);
      gravar(tipo, b, { k, nome: p[1] });
      if (tipo === "mk_tp") indexarTp(b, antiga?.k, k);
    }
    if (acaoT === "minerar") gravar("mkm", b, { ...novoMi(), liga: true, r: 1, y0: b.y - 3, y1: b.y - 1, filtros: [p[1]] });
    if (acaoT === "modo") b.setPermutation(b.permutation.withState("cl:extrai" as never, true as never));
    if (acaoT === "classificar") gravar("mks", b, { f: [p[1]] });
    if (acaoT === "energia") gravar("celula", b, 20000);
    const dados: Record<string, unknown> = {};
    for (const t of ["mkb", "mkpl", "mkm", "mk_qe", "mk_tp", "mks", "mkt", "mkq"]) {
      const v = ler<unknown>(t, b, undefined);
      if (v !== undefined) dados[t] = v;
    }
    if (b.typeId === "cl:entrelacador_quantico") dados.freq = freqQe(b);
    console.warn(`[teste_mkl] ${b.typeId} ${JSON.stringify(dados)} moldura=${b.typeId === TP ? temMoldura(b.dimension, b) : "-"}`);
  });
}

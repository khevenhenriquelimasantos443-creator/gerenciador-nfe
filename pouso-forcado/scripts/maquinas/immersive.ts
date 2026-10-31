import { Block, BlockCustomComponent, BlockPermutation, Dimension, Entity, GameMode, ItemStack, Player, RawMessage, Vector3, WeatherType, system, world } from "@minecraft/server";
import { DADOS_F35 } from "../conteudo/gerado.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { gravar, ler } from "../util/dados.js";
import { darAoJogador, gastarDaMao, gastarFerramenta } from "../util/inventario.js";
import { toqueNovo } from "../util/toque.js";
import { gerador } from "./mekanism_extra.js";

/*
 * Immersive Engineering (1.13.0), com os números do código do IE 1.20.1:
 * - Forno de Coque e Alto-Forno: cubo 3×3×3 de tijolos; bater com o Martelo no tijolo do meio de um lado põe a boca do
 *   forno ali. Tocar a boca com o item põe dentro, de mão vazia pega o que ficou pronto, com balde tira o creosoto.
 *   Coque: carvão → coque (1.800 ticks, 500 mB de creosoto), bloco de carvão → bloco de coque (16.200, 5.000 mB),
 *   toras → carvão vegetal (900, 250 mB); tanque de 12.000 mB. Alto-Forno: ferro → aço + escória (1.200 ticks),
 *   bloco de ferro → bloco de aço + 9 escórias (10.800), queimando coque (1.200 ticks) ou carvão vegetal (300).
 *   Quebrar um tijolo desfaz o forno (a boca volta a ser tijolo e solta o que tinha dentro).
 * - Dínamo Cinético: 3 RF por "rotação" que o moinho ou a roda encostados entregam (dynamo_output = 3).
 *   Moinho de Vento (WindmillBlockEntity): disco de 9 blocos livre e até 7 blocos de ar à frente (cada bloco de ar
 *   soma 1; outro moinho na frente tira 179); giro = 0,00005 × (sem chuva 0,75) × (sem tempestade 0,66) ×
 *   (0,5 + 0,125 por vela) × ar; potência = giro × 800. Céu limpo, ar todo livre e sem velas: ~12 RF/t; 8 velas: ~36.
 *   Roda d'Água: cada bloco de água corrente passando por cima (ou caindo num lado) soma 1; potência × 0,75; até 3 rodas
 *   em fila no mesmo dínamo.
 * As pás são uma entidade só de enfeite (cl:pas_moinho e cl:roda_agua_giro) que o script cria, gira e tira.
 */
type Receita = readonly [string, number, number];
const COQUE: Readonly<Record<string, Receita>> = DADOS_F35.coque;
const ALTO: Readonly<Record<string, Receita>> = DADOS_F35.altoForno;
const COMB_ALTO: Readonly<Record<string, number>> = DADOS_F35.combustivelAlto;
const TANQUE = DADOS_F35.tanqueCoque;
const MARTELO = "cl:martelo_engenheiro";
const FORNOS: Readonly<Record<string, { tijolo: string; boca: string; nome: string; acao: "ie_coque" | "ie_alto" }>> = {
  "cl:tijolo_coque": { tijolo: "cl:tijolo_coque", boca: "cl:forno_coque", nome: "tile.cl:forno_coque.name", acao: "ie_coque" },
  "cl:tijolo_alto_forno": { tijolo: "cl:tijolo_alto_forno", boca: "cl:alto_forno", nome: "tile.cl:alto_forno.name", acao: "ie_alto" },
};
const DE_BOCA = Object.fromEntries(Object.values(FORNOS).map((f) => [f.boca, f]));
const HORIZ: ReadonlyArray<readonly [string, number, number]> = [["north", 0, -1], ["south", 0, 1], ["west", -1, 0], ["east", 1, 0]];
const nome = (id: string): RawMessage => ({ translate: new ItemStack(id).localizationKey });
const mao = (j: Player) => j.getComponent("minecraft:inventory")?.container?.getItem(j.selectedSlotIndex);
const criativo = (j: Player) => j.getGameMode() === GameMode.Creative;
const pct = (p: number, t: number) => ({ text: String(t > 0 ? Math.floor((p / t) * 100) : 0) });

// ---------- Estrutura 3×3×3 ----------
function cuboCompleto(dim: Dimension, c: Vector3, tijolo: string, boca?: Vector3): boolean {
  for (let x = -1; x <= 1; x++)
    for (let y = -1; y <= 1; y++)
      for (let z = -1; z <= 1; z++) {
        const p = { x: c.x + x, y: c.y + y, z: c.z + z };
        if (boca && p.x === boca.x && p.y === boca.y && p.z === boca.z) continue;
        if (dim.getBlock(p)?.typeId !== tijolo) return false;
      }
  return true;
}
/** Bater com o Martelo no meio de um lado: vira a boca do forno virada para fora. */
function formar(j: Player, b: Block): boolean {
  const f = FORNOS[b.typeId];
  if (!f) return false;
  for (const [dir, dx, dz] of HORIZ) {
    const c = { x: b.x - dx, y: b.y, z: b.z - dz };
    if (!cuboCompleto(b.dimension, c, f.tijolo)) continue;
    b.setPermutation(BlockPermutation.resolve(f.boca, { "minecraft:cardinal_direction": dir }));
    gravar("forno_centro", b, c);
    gastarFerramenta(j);
    j.playSound("random.anvil_use", { pitch: 1.2 });
    aviso(j, { translate: "cl.ie.formado", with: { rawtext: [{ translate: f.nome }] } }, 3);
    registrarAcao(j, f.acao);
    return true;
  }
  aviso(j, { translate: "cl.ie.estrutura", with: { rawtext: [{ translate: `tile.${f.tijolo}.name` }] } }, 4);
  return true;
}
function inteiro(b: Block): boolean {
  const f = DE_BOCA[b.typeId];
  const c = ler<Vector3 | undefined>("forno_centro", b, undefined);
  return !!f && !!c && cuboCompleto(b.dimension, c, f.tijolo, b);
}

// ---------- Forno de Coque ----------
type Pilha = { id: string; n: number };
type Coque = { ent?: Pilha; sai?: Pilha; cre: number; p: number };
const lerCoque = (b: Block) => ler<Coque>("coque", b, { cre: 0, p: 0 });
function soltar(dim: Dimension, p: Vector3, ...pilhas: Array<Pilha | undefined>): void {
  for (const s of pilhas) if (s && s.n > 0) dim.spawnItem(new ItemStack(s.id, Math.min(64, s.n)), { x: p.x + 0.5, y: p.y + 0.5, z: p.z + 0.5 });
}
function desfazer(b: Block): void {
  const f = DE_BOCA[b.typeId];
  if (!f) return;
  const c = lerCoque(b), a = lerAlto(b);
  soltar(b.dimension, b.location, c.ent, c.sai, a.ent, a.sai, a.esc, a.comb);
  gravar("coque", b, undefined);
  gravar("alto", b, undefined);
  gravar("forno_centro", b, undefined);
  b.setType(f.tijolo);
}
const cabeEm = (s: Pilha | undefined, id: string, n: number) => !s || (s.id === id && s.n + n <= 64);
function poe(s: Pilha | undefined, id: string, n: number): Pilha {
  return s ? { id, n: s.n + n } : { id, n };
}
function fumaca(b: Block): void {
  b.dimension.spawnParticle("minecraft:campfire_smoke_particle", { x: b.x + 0.5, y: b.y + 2.2, z: b.z + 0.5 });
}

export const fornoCoque: BlockCustomComponent = {
  onTick({ block: b }) {
    if (system.currentTick % 100 < 20 && !inteiro(b)) return desfazer(b);
    const s = lerCoque(b);
    const r = s.ent && COQUE[s.ent.id];
    if (!s.ent || !r || !cabeEm(s.sai, r[0], 1)) return;
    s.p += 20;
    if (s.p >= r[1]) {
      s.p = 0;
      s.ent.n--;
      if (s.ent.n <= 0) s.ent = undefined;
      s.sai = poe(s.sai, r[0], 1);
      s.cre = Math.min(TANQUE, s.cre + r[2]);
    }
    if (system.currentTick % 60 < 20) fumaca(b);
    gravar("coque", b, s);
  },
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    const s = lerCoque(b);
    const item = mao(j);
    if (item?.typeId === "minecraft:bucket") {
      if (s.cre < 1000) return aviso(j, "cl.ie.sem_creosoto");
      s.cre -= 1000;
      gravar("coque", b, s);
      if (!criativo(j)) gastarDaMao(j);
      darAoJogador(j, "cl:balde_creosoto");
      j.playSound("bucket.fill_lava");
      registrarAcao(j, "creosoto");
      return;
    }
    if (item && COQUE[item.typeId] && cabeEm(s.ent, item.typeId, 1)) {
      const n = Math.min(item.amount, 64 - (s.ent?.n ?? 0));
      s.ent = poe(s.ent, item.typeId, n);
      gravar("coque", b, s);
      if (!criativo(j)) gastarDaMao(j, n);
      return j.playSound("random.pop", { pitch: 0.8 });
    }
    if (!item && s.sai) {
      darAoJogador(j, s.sai.id, s.sai.n);
      s.sai = undefined;
      return gravar("coque", b, s);
    }
    const r = s.ent && COQUE[s.ent.id];
    aviso(j, { translate: "cl.ie.coque", with: { rawtext: [s.ent ? nome(s.ent.id) : { translate: "cl.ie.vazio" }, r ? nome(r[0]) : { text: "—" }, pct(s.p, r?.[1] ?? 0), { text: String(s.cre) }] } }, 5);
  },
};

// ---------- Alto-Forno ----------
type Alto = { ent?: Pilha; comb?: Pilha; sai?: Pilha; esc?: Pilha; p: number; q: number };
const lerAlto = (b: Block) => ler<Alto>("alto", b, { p: 0, q: 0 });
export const altoForno: BlockCustomComponent = {
  onTick({ block: b }) {
    if (system.currentTick % 100 < 20 && !inteiro(b)) return desfazer(b);
    const s = lerAlto(b);
    const r = s.ent && ALTO[s.ent.id];
    const pode = !!s.ent && !!r && cabeEm(s.sai, r[0], 1) && cabeEm(s.esc, "cl:escoria", r[2]);
    if (!pode && s.q <= 0) return;
    // O fogo só acende com algo para fazer; uma vez aceso, queima até o fim do combustível.
    if (s.q <= 0 && s.comb) {
      s.q = COMB_ALTO[s.comb.id] ?? 0;
      s.comb.n--;
      if (s.comb.n <= 0) s.comb = undefined;
    }
    if (s.q <= 0) return gravar("alto", b, s);
    s.q = Math.max(0, s.q - 20);
    if (pode && r) {
      s.p += 20;
      if (s.p >= r[1]) {
        s.p = 0;
        s.ent!.n--;
        if (s.ent!.n <= 0) s.ent = undefined;
        s.sai = poe(s.sai, r[0], 1);
        s.esc = poe(s.esc, "cl:escoria", r[2]);
        const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
        if (j && r[0] === "cl:lingote_aco") registrarAcao(j, "aco_alto");
      }
    }
    if (system.currentTick % 60 < 20) fumaca(b);
    gravar("alto", b, s);
  },
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    const s = lerAlto(b);
    const item = mao(j);
    const slot: "ent" | "comb" | undefined = item ? (ALTO[item.typeId] ? "ent" : COMB_ALTO[item.typeId] ? "comb" : undefined) : undefined;
    if (item && slot && cabeEm(s[slot], item.typeId, 1)) {
      const n = Math.min(item.amount, 64 - (s[slot]?.n ?? 0));
      s[slot] = poe(s[slot], item.typeId, n);
      gravar("alto", b, s);
      if (!criativo(j)) gastarDaMao(j, n);
      return j.playSound("random.pop", { pitch: 0.8 });
    }
    if (!item && (s.sai || s.esc)) {
      if (s.sai) darAoJogador(j, s.sai.id, s.sai.n);
      if (s.esc) darAoJogador(j, s.esc.id, s.esc.n);
      s.sai = s.esc = undefined;
      return gravar("alto", b, s);
    }
    const r = s.ent && ALTO[s.ent.id];
    const comb: RawMessage = s.comb ? { rawtext: [{ text: `${s.comb.n}× ` }, nome(s.comb.id)] } : { translate: "cl.ie.vazio" };
    aviso(j, { translate: "cl.ie.alto", with: { rawtext: [s.ent ? nome(s.ent.id) : { translate: "cl.ie.vazio" }, r ? nome(r[0]) : { text: "—" }, pct(s.p, r?.[1] ?? 0), comb] } }, 5);
  },
};

// ---------- Moinho de Vento, Roda d'Água e Dínamo ----------
const DINAMO = "cl:dinamo_cinetico", MOINHO = "cl:moinho_vento", RODA = "cl:roda_hidraulica";
const potencia = new Map<string, number>(); // "rotação" por tick que cada moinho/roda entrega (RF/t = 3 × isso)
const chave = (b: Block) => `${b.dimension.id}|${b.x},${b.y},${b.z}`;
/** Direção (dx, dz) do dínamo para o moinho/roda, se houver um dínamo encostado. */
function ladoDoDinamo(b: Block): readonly [number, number] | undefined {
  for (const [, dx, dz] of HORIZ) if (b.dimension.getBlock({ x: b.x - dx, y: b.y, z: b.z - dz })?.typeId === DINAMO) return [dx, dz];
  return undefined;
}
const vazio = (b: Block | undefined) => !b || b.isAir;
// Disco do moinho: raio 4 no meio, 3, 2 e 1 nas pontas (computeTurnSpeed).
const RAIO = (h: number) => (Math.abs(h) === 4 ? 1 : Math.abs(h) === 3 ? 2 : Math.abs(h) === 2 ? 3 : 4);
function arDoMoinho(b: Block, dx: number, dz: number): number {
  // O "lado" do disco: horário da frente.
  const lx = -dz, lz = dx;
  const dim = b.dimension;
  for (let h = -4; h <= 4; h++)
    for (let w = -RAIO(h); w <= RAIO(h); w++)
      if ((h || w) && !vazio(dim.getBlock({ x: b.x + lx * w, y: b.y + h, z: b.z + lz * w }))) return 0;
  let ar = 0, bloqueado = 0;
  for (let h = -4; h <= 4; h++) {
    for (let w = -RAIO(h); w <= RAIO(h); w++)
      for (let d = 1; d < 8; d++) {
        const p = dim.getBlock({ x: b.x + lx * w + dx * d, y: b.y + h, z: b.z + lz * w + dz * d });
        if (vazio(p)) ar++;
        else if (p!.typeId === MOINHO) {
          bloqueado += 20;
          ar -= 179;
        } else bloqueado++;
      }
    if (bloqueado > 100) return 0;
  }
  return Math.max(0, ar);
}
// O tempo de cada dimensão (o script só fica sabendo quando muda; ao abrir o mundo conta como céu limpo).
const tempoEm = new Map<string, WeatherType>();
function giroDoMoinho(b: Block, ar: number): number {
  const tempo = tempoEm.get(b.dimension.id) ?? WeatherType.Clear;
  let mod = 0.00005;
  if (tempo === WeatherType.Clear) mod *= 0.75;
  if (tempo !== WeatherType.Thunder) mod *= 0.66;
  return mod * (0.5 + velas(b) * 0.125) * ar; // rotações por tick
}
const velas = (b: Block) => ler<number>("velas", b, 0);

const AGUA = new Set(["minecraft:water", "minecraft:flowing_water"]);
function agua(dim: Dimension, p: Vector3, caindo: boolean): number {
  const b = dim.getBlock(p);
  if (!b || !AGUA.has(b.typeId)) return 0;
  const n = b.permutation.getState("liquid_depth") as number;
  return caindo ? (n >= 8 ? 1 : 0) : n > 0 && n < 8 ? 1 : 0;
}
/** Água que passa na roda: corrente em cima (y+2/+3) contra embaixo (y-2/-3) e queda num lado contra o outro. */
function forcaDaRoda(b: Block, dx: number, dz: number): number {
  const lx = -dz, lz = dx, dim = b.dimension;
  const em = (w: number, h: number, caindo: boolean) => agua(dim, { x: b.x + lx * w, y: b.y + h, z: b.z + lz * w }, caindo);
  const cima = em(-1, 3, false) + em(0, 3, false) + em(1, 3, false) + em(-2, 2, false) + em(2, 2, false);
  const baixo = em(-1, -3, false) + em(0, -3, false) + em(1, -3, false) + em(-2, -2, false) + em(2, -2, false);
  const lado = (s: number) => em(2 * s, 2, true) + em(3 * s, 1, true) + em(3 * s, 0, true) + em(3 * s, -1, true) + em(2 * s, -2, true);
  return Math.abs(cima - baixo) + Math.abs(lado(-1) - lado(1));
}

/** A entidade das pás (cria se faltar), virada no eixo dínamo → moinho. */
function rotor(b: Block, tipo: string, dx: number, dz: number): Entity | undefined {
  const c = b.center();
  let e = b.dimension.getEntities({ type: tipo, location: c, maxDistance: 0.6 })[0];
  if (!e) {
    try {
      e = b.dimension.spawnEntity(tipo, c);
    } catch {
      return undefined;
    }
  }
  e.setRotation({ x: 0, y: (Math.atan2(-dx, dz) * 180) / Math.PI });
  return e;
}
function tirarRotor(dim: Dimension, p: Vector3): void {
  for (const e of dim.getEntities({ families: ["rotor"], location: { x: p.x + 0.5, y: p.y + 0.5, z: p.z + 0.5 }, maxDistance: 0.8 })) e.remove();
}
function girar(e: Entity | undefined, grausPorSegundo: number, nVelas?: number): void {
  if (!e) return;
  const g = Math.min(2000, Math.round(grausPorSegundo));
  if (e.getProperty("cl:giro") !== g) e.setProperty("cl:giro", g);
  if (nVelas !== undefined && e.getProperty("cl:velas") !== nVelas) e.setProperty("cl:velas", nVelas);
}

export const moinhoVento: BlockCustomComponent = {
  onTick({ block: b }) {
    const lado = ladoDoDinamo(b);
    if (!lado) {
      potencia.set(chave(b), 0);
      return tirarRotor(b.dimension, b.location);
    }
    const giro = giroDoMoinho(b, arDoMoinho(b, lado[0], lado[1]));
    potencia.set(chave(b), giro * 800);
    girar(rotor(b, "cl:pas_moinho", lado[0], lado[1]), giro * 360 * 20, velas(b));
  },
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    if (mao(j)?.typeId === "cl:vela_lona" && velas(b) < 8) {
      gravar("velas", b, velas(b) + 1);
      if (!criativo(j)) gastarDaMao(j);
      j.playSound("item.armor.equip_leather");
    }
    if (!ladoDoDinamo(b)) return aviso(j, "cl.ie.sem_dinamo");
    aviso(j, { translate: "cl.ie.moinho", with: { rawtext: [{ text: ((potencia.get(chave(b)) ?? 0) * 3).toFixed(1) }, { text: String(velas(b)) }] } }, 5);
  },
};
export const rodaHidraulica: BlockCustomComponent = {
  onTick({ block: b }) {
    // A roda gira junto com as outras da fila; o eixo vem do dínamo na ponta (até 2 rodas no meio).
    let lado: readonly [number, number] | undefined;
    for (const [, dx, dz] of HORIZ)
      for (let k = 1; k <= 3; k++) {
        const v = b.dimension.getBlock({ x: b.x - dx * k, y: b.y, z: b.z - dz * k })?.typeId;
        if (v === DINAMO) lado = [dx, dz];
        if (v !== RODA) break;
      }
    if (!lado) {
      potencia.set(chave(b), 0);
      return tirarRotor(b.dimension, b.location);
    }
    const f = forcaDaRoda(b, lado[0], lado[1]);
    potencia.set(chave(b), f * 0.75);
    girar(rotor(b, "cl:roda_agua_giro", lado[0], lado[1]), f * 5);
  },
  onPlayerInteract({ player: j, block: b }) {
    if (!j) return;
    aviso(j, { translate: "cl.ie.roda", with: { rawtext: [{ text: ((potencia.get(chave(b)) ?? 0) * 3).toFixed(1) }] } }, 5);
  },
};
/** RF/t do dínamo: 3 × a rotação do moinho encostado ou das rodas em fila. */
export function rfDoDinamo(b: Block): number {
  let rot = 0;
  for (const [, dx, dz] of HORIZ)
    for (let k = 1; k <= 3; k++) {
      const v = b.dimension.getBlock({ x: b.x + dx * k, y: b.y, z: b.z + dz * k });
      if (v?.typeId === MOINHO && k === 1) rot += potencia.get(chave(v)) ?? 0;
      if (v?.typeId !== RODA) break;
      rot += potencia.get(chave(v)) ?? 0;
    }
  return 3 * rot;
}
// 1 E = 4.000 RF a cada ciclo de 100 ticks: RF/t ÷ 40.
export const dinamoCinetico = gerador((b) => {
  const rf = rfDoDinamo(b);
  if (rf > 0 && HORIZ.some(([, dx, dz]) => b.dimension.getBlock({ x: b.x + dx, y: b.y, z: b.z + dz })?.typeId === MOINHO)) {
    const j = b.dimension.getPlayers({ location: b.center(), maxDistance: 16, closest: 1 })[0];
    if (j) registrarAcao(j, "vento");
  }
  return rf / 40;
}, "cl.ie.dinamo");

export function registrarImmersive(): void {
  world.afterEvents.weatherChange.subscribe(({ dimension, newWeather }) => tempoEm.set(dimension, newWeather));
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== MARTELO || !FORNOS[ev.block.typeId] || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    system.run(() => formar(j, b));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block: b, brokenBlockPermutation: p }) => {
    const id = p.type.id;
    if (id === MOINHO || id === RODA) {
      tirarRotor(b.dimension, b.location);
      potencia.delete(chave(b));
      gravar("velas", b, undefined);
      return;
    }
    // A boca quebrada devolve o tijolo e o que tinha dentro.
    const f = DE_BOCA[id];
    if (!f) return;
    const c = ler<Coque>("coque", b, { cre: 0, p: 0 }), a = ler<Alto>("alto", b, { p: 0, q: 0 });
    soltar(b.dimension, b.location, { id: f.tijolo, n: 1 }, c.ent, c.sai, a.ent, a.sai, a.esc, a.comb);
    gravar("coque", b, undefined);
    gravar("alto", b, undefined);
    gravar("forno_centro", b, undefined);
  });
}

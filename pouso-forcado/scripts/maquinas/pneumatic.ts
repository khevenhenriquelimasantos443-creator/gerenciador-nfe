import { Block, BlockCustomComponent, Dimension, ItemStack, Player, RawMessage, system, Vector3, world } from "@minecraft/server";
import { PNEUMATIC } from "../config.js";
import { registrarNoCatalogo } from "../catalogo/catalogo.js";
import { aviso } from "../jogador/hud.js";
import { registrarAcao } from "../missoes/progresso.js";
import { vizinhos } from "../util/blocos.js";
import { gravar, gravarEm, ler, lerEm, registrarDetalhe } from "../util/dados.js";
import { gastarDaMao, itemNaMao } from "../util/inventario.js";
import { entrada, inv, primeiro, tirar } from "../util/maquina.js";

/*
 * PneumaticCraft, versão leve (Fase 20).
 * - Compressor de Ar: queima combustível (baú em cima ou toque) e põe PNEUMATIC.mlPorSegundo de ar na rede
 *   (ele + Tubos de Pressão + as Câmaras ligadas por uma Válvula). A pressão é a mesma na rede toda:
 *   bar = ar ÷ volume. O compressor para no limite crítico; acima do limite de perigo um tubo pode estourar.
 *   Toque com a mão vazia: liga/desliga.
 * - Câmara de Pressão: cubo oco de 3x3x3 a 5x5x5 (paredes, vidros, válvulas, interfaces), conferido ao
 *   tocar na válvula. A cada segundo, os itens jogados dentro viram o que a receita manda se a pressão der.
 * - Interface: puxa de um baú encostado para dentro da câmara e devolve os produtos para ele.
 * - Manômetro: toque num bloco de ar comprimido para ver a pressão.
 * Custo: uma busca pela rede de tubos (até PNEUMATIC.maxBlocosRede) por compressor por segundo.
 */
type Compressor = { ar: number; comb: number; desligado?: boolean };
type Camara = { min: Vector3; max: Vector3; vol: number; ar: number; principal: Vector3 };
const TUBOS = new Set(["cl:tubo_pressao", "cl:tubo_pressao_avancado"]);
const CAMARA = new Set(["cl:parede_camara", "cl:vidro_camara", "cl:valvula_camara", "cl:interface_camara"]);
const k3 = (p: Vector3) => `${p.x},${p.y},${p.z}`;
const RECEITAS = [...PNEUMATIC.receitas].sort((a, b) => b.entra.length - a.entra.length);

function bloco(dim: Dimension, p: Vector3): Block | undefined {
  try {
    return dim.getBlock(p);
  } catch {
    return undefined;
  }
}
const camaraEm = (dim: Dimension, chave: Vector3 | undefined) => (chave ? lerEm<Camara | undefined>("camara", dim, chave, undefined) : undefined);
const camaraDe = (b: Block) => camaraEm(b.dimension, ler<Vector3 | undefined>("valv", b, undefined));
const bar = (ar: number, vol: number) => (vol > 0 ? ar / vol : 0);
const fmt = (n: number) => n.toFixed(2);

/** A rede de tubos a partir do compressor: quantos tubos de cada tipo e as válvulas encostadas. */
function rede(c: Block): { comuns: Block[]; avancados: Block[]; camaras: Vector3[] } {
  const comuns: Block[] = [], avancados: Block[] = [], camaras = new Map<string, Vector3>();
  const vistos = new Set([k3(c.location)]);
  const fila = vizinhos(c);
  while (fila.length && comuns.length + avancados.length < PNEUMATIC.maxBlocosRede) {
    const b = fila.shift()!;
    if (vistos.has(k3(b.location))) continue;
    vistos.add(k3(b.location));
    if (b.typeId === "cl:valvula_camara") {
      const ch = ler<Vector3 | undefined>("valv", b, undefined);
      if (ch && camaraEm(b.dimension, ch)) camaras.set(k3(ch), ch);
      continue;
    }
    if (!TUBOS.has(b.typeId)) continue;
    (b.typeId === "cl:tubo_pressao" ? comuns : avancados).push(b);
    fila.push(...vizinhos(b));
  }
  return { comuns, avancados, camaras: [...camaras.values()] };
}

function pressaoDoCompressor(c: Block): { p: number; limite: "comum" | "avancado"; r: ReturnType<typeof rede> } {
  const r = rede(c);
  const d = ler<Compressor>("comp", c, { ar: 0, comb: 0 });
  const vol = PNEUMATIC.volumeCompressor + r.comuns.length * PNEUMATIC.volumeTubo + r.avancados.length * PNEUMATIC.volumeTuboAvancado;
  return { p: bar(d.ar, vol), limite: r.comuns.length === 0 && r.avancados.length > 0 ? "avancado" : "comum", r };
}

export const compressor: BlockCustomComponent = {
  onTick(e) {
    const c = e.block;
    const d = ler<Compressor>("comp", c, { ar: 0, comb: 0 });
    const r = rede(c);
    const volRede = PNEUMATIC.volumeCompressor + r.comuns.length * PNEUMATIC.volumeTubo + r.avancados.length * PNEUMATIC.volumeTuboAvancado;
    const camaras = r.camaras.map((ch) => [ch, camaraEm(c.dimension, ch)!] as const);
    const limite = r.comuns.length === 0 && r.avancados.length > 0 ? "avancado" : "comum";
    // Combustível
    if (!d.desligado && d.comb <= 0) {
      const ent = entrada(c);
      const f = ent && primeiro(ent, (id) => PNEUMATIC.combustivel[id] !== undefined);
      if (ent && f) {
        tirar(ent, f.typeId);
        d.comb += PNEUMATIC.combustivel[f.typeId];
        if (f.typeId === "minecraft:lava_bucket") ent.addItem(new ItemStack("minecraft:bucket", 1));
      }
    }
    let total = d.ar + camaras.reduce((s, [, cam]) => s + cam.ar, 0);
    const vol = volRede + camaras.reduce((s, [, cam]) => s + cam.vol, 0);
    if (!d.desligado && d.comb > 0 && bar(total, vol) < PNEUMATIC.critico[limite]) {
      total += PNEUMATIC.mlPorSegundo;
      d.comb--;
    }
    // Pressão igual na rede toda.
    const p = bar(total, vol);
    d.ar = p * volRede;
    for (const [ch, cam] of camaras) gravarEm("camara", c.dimension, ch, { ...cam, ar: p * cam.vol });
    gravar("comp", c, d);
    // Perigo: um tubo estoura.
    if (p > PNEUMATIC.perigo[limite]) {
      c.dimension.spawnParticle("minecraft:basic_smoke_particle", { x: c.x + 0.5, y: c.y + 1.2, z: c.z + 0.5 });
      if (Math.random() < PNEUMATIC.chanceExplosao) {
        const tubos = limite === "comum" ? r.comuns : r.avancados;
        const alvo = tubos.length ? tubos[Math.floor(Math.random() * tubos.length)].location : c.location;
        system.run(() => c.dimension.createExplosion({ x: alvo.x + 0.5, y: alvo.y + 0.5, z: alvo.z + 0.5 }, 1.5, { breaksBlocks: true }));
      }
    }
    if (p >= 2) {
      const quem = c.dimension.getPlayers({ location: c.center(), maxDistance: 16, closest: 1 })[0];
      if (quem) registrarAcao(quem, "pressao2");
    }
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const c = e.block;
    const d = ler<Compressor>("comp", c, { ar: 0, comb: 0 });
    const mao = itemNaMao(j);
    const valor = mao ? PNEUMATIC.combustivel[mao.typeId] : undefined;
    if (valor) {
      gastarDaMao(j);
      d.comb += valor;
    } else if (!mao) d.desligado = !d.desligado;
    gravar("comp", c, d);
    const { p, limite } = pressaoDoCompressor(c);
    const linhas: RawMessage[] = [{ translate: "cl.pn.compressor", with: { rawtext: [{ text: fmt(p) }, { text: String(d.comb) }, { translate: d.desligado ? "cl.pn.desligado" : "cl.pn.ligado" }] } }];
    if (p > PNEUMATIC.perigo[limite]) linhas.push({ text: "\n" }, { translate: "cl.pn.perigo", with: [fmt(p)] });
    aviso(j, { rawtext: linhas }, 5);
  },
};

// ---------- Câmara de Pressão ----------
function validar(v: Block): Camara | undefined {
  const fila = [v.location], vistos = new Set<string>(), partes: Vector3[] = [];
  while (fila.length && partes.length <= 98) {
    const p = fila.shift()!;
    if (vistos.has(k3(p))) continue;
    vistos.add(k3(p));
    const b = bloco(v.dimension, p);
    if (!b || !CAMARA.has(b.typeId)) continue;
    partes.push(p);
    for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) fila.push({ x: p.x + dx, y: p.y + dy, z: p.z + dz });
  }
  const min = { x: Math.min(...partes.map((p) => p.x)), y: Math.min(...partes.map((p) => p.y)), z: Math.min(...partes.map((p) => p.z)) };
  const max = { x: Math.max(...partes.map((p) => p.x)), y: Math.max(...partes.map((p) => p.y)), z: Math.max(...partes.map((p) => p.z)) };
  const lado = max.x - min.x + 1;
  if (lado < 3 || lado > 5 || max.y - min.y + 1 !== lado || max.z - min.z + 1 !== lado) return undefined;
  let internos = 0;
  for (let x = min.x; x <= max.x; x++) for (let y = min.y; y <= max.y; y++) for (let z = min.z; z <= max.z; z++) {
    const borda = x === min.x || x === max.x || y === min.y || y === max.y || z === min.z || z === max.z;
    const b = bloco(v.dimension, { x, y, z });
    if (borda ? !b || !CAMARA.has(b.typeId) : !b?.isAir) return undefined;
    if (!borda) internos++;
  }
  const antiga = lerEm<Camara | undefined>("camara", v.dimension, min, undefined);
  const cam: Camara = { min, max, vol: internos * PNEUMATIC.volumePorBlocoInterno, ar: antiga?.ar ?? 0, principal: v.location };
  gravarEm("camara", v.dimension, min, cam);
  for (const p of partes) {
    const b = bloco(v.dimension, p);
    if (b?.typeId === "cl:valvula_camara" || b?.typeId === "cl:interface_camara") gravar("valv", b, min);
  }
  const lista = indice();
  const k = `${v.dimension.id}:${k3(min)}`;
  if (!lista.includes(k)) world.setDynamicProperty("cl:camaras", JSON.stringify([...lista, k]));
  return cam;
}
const indice = () => JSON.parse((world.getDynamicProperty("cl:camaras") as string | undefined) ?? "[]") as string[];

function textoCamara(cam: Camara): RawMessage {
  const l = String(cam.max.x - cam.min.x + 1);
  return { translate: "cl.pn.camara", with: [l, l, l, fmt(bar(cam.ar, cam.vol)), String(Math.round(cam.ar)), String(cam.vol)] };
}

/** Itens soltos dentro da câmara. */
function itensDentro(dim: Dimension, cam: Camara) {
  const lado = cam.max.x - cam.min.x - 1;
  return dim.getEntities({ type: "minecraft:item", location: { x: cam.min.x + 1, y: cam.min.y + 1, z: cam.min.z + 1 }, volume: { x: lado, y: lado, z: lado } });
}

function processar(v: Block, cam: Camara): void {
  const p = bar(cam.ar, cam.vol);
  if (p < 1) return;
  const itens = itensDentro(v.dimension, cam);
  if (!itens.length) return;
  const centro = { x: (cam.min.x + cam.max.x) / 2 + 0.5, y: cam.min.y + 1.2, z: (cam.min.z + cam.max.z) / 2 + 0.5 };
  for (let vezes = 0; vezes < 4; vezes++) {
    const conta = new Map<string, number>();
    for (const e of itens) {
      if (!e.isValid) continue;
      const s = e.getComponent("minecraft:item")?.itemStack;
      if (s) conta.set(s.typeId, (conta.get(s.typeId) ?? 0) + s.amount);
    }
    const r = RECEITAS.find((x) => p >= x.bar && x.entra.every(([id, n]) => (conta.get(id) ?? 0) >= n));
    if (!r) return;
    for (const [id, n] of r.entra) {
      let falta = n;
      for (const e of itens) {
        if (falta <= 0) break;
        if (!e.isValid) continue;
        const s = e.getComponent("minecraft:item")?.itemStack;
        if (s?.typeId !== id) continue;
        const usa = Math.min(falta, s.amount);
        falta -= usa;
        const onde = e.location;
        e.remove();
        if (usa < s.amount) {
          s.amount -= usa;
          const resto = v.dimension.spawnItem(s, onde);
          if (resto) itens.push(resto);
        }
      }
    }
    v.dimension.spawnItem(new ItemStack(r.sai[0], r.sai[1]), centro);
    v.dimension.playSound("random.fizz", centro, { volume: 0.4, pitch: 1.5 });
    const quem = v.dimension.getPlayers({ location: centro, maxDistance: 16, closest: 1 })[0];
    if (quem) registrarAcao(quem, r.sai[0] === "cl:lingote_ferro_comprimido" ? "ferro_comprimido" : r.sai[0] === "minecraft:diamond" ? "diamante_carvao" : "eletronica");
  }
}

export const valvula: BlockCustomComponent = {
  onTick(e) {
    const cam = camaraDe(e.block);
    if (cam && k3(cam.principal) === k3(e.block.location)) processar(e.block, cam);
  },
  onPlayerInteract(e) {
    const j = e.player;
    if (!j) return;
    const cam = validar(e.block);
    if (!cam) return aviso(j, "cl.pn.camara_invalida", 6);
    registrarAcao(j, "camara");
    aviso(j, textoCamara(cam), 5);
  },
};

const PRODUTOS = new Set(PNEUMATIC.receitas.map((r) => r.sai[0]));
export const interfaceCamara: BlockCustomComponent = {
  onTick(e) {
    const b = e.block;
    const cam = camaraDe(b);
    if (!cam) return;
    const fora = vizinhos(b).map((v) => (CAMARA.has(v.typeId) ? undefined : inv(v))).find((c) => c);
    if (!fora) return;
    // Devolve os produtos.
    for (const it of itensDentro(b.dimension, cam)) {
      const s = it.getComponent("minecraft:item")?.itemStack;
      if (!s || !PRODUTOS.has(s.typeId)) continue;
      const sobra = fora.addItem(s);
      it.remove();
      if (sobra) b.dimension.spawnItem(sobra, it.location);
      return;
    }
    // Põe 1 pilha para dentro (só ingredientes de receita).
    for (let s = 0; s < fora.size; s++) {
      const p = fora.getItem(s);
      if (!p || !PNEUMATIC.receitas.some((r) => r.entra.some(([id]) => id === p.typeId))) continue;
      fora.setItem(s, undefined);
      b.dimension.spawnItem(p, { x: (cam.min.x + cam.max.x) / 2 + 0.5, y: cam.min.y + 1.2, z: (cam.min.z + cam.max.z) / 2 + 0.5 });
      return;
    }
  },
  onPlayerInteract(e) {
    const cam = camaraDe(e.block);
    if (e.player) aviso(e.player, cam ? textoCamara(cam) : { translate: "cl.pn.camara_invalida" }, 5);
  },
};

function mostrarPressao(j: Player, b: Block): void {
  if (b.typeId === "cl:compressor_ar") return aviso(j, { translate: "cl.pn.pressao", with: [fmt(pressaoDoCompressor(b).p)] });
  const cam = camaraDe(b);
  if (cam) return aviso(j, textoCamara(cam));
  if (TUBOS.has(b.typeId)) {
    // Acha um compressor na rede do tubo.
    const fila = [b], vistos = new Set<string>();
    while (fila.length && vistos.size < PNEUMATIC.maxBlocosRede) {
      const t = fila.shift()!;
      if (vistos.has(k3(t.location))) continue;
      vistos.add(k3(t.location));
      if (t.typeId === "cl:compressor_ar") return aviso(j, { translate: "cl.pn.pressao", with: [fmt(pressaoDoCompressor(t).p)] });
      if (TUBOS.has(t.typeId)) fila.push(...vizinhos(t));
    }
  }
  aviso(j, { translate: "cl.pn.pressao", with: ["0.00"] });
}

export function registrarPneumatic(): void {
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.itemStack?.typeId !== "cl:manometro" || !ev.isFirstEvent) return;
    ev.cancel = true;
    const { player, block } = ev;
    system.run(() => mostrarPressao(player, block));
  });
  world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation }) => {
    const id = brokenBlockPermutation.type.id;
    if (id === "cl:compressor_ar") gravarEm("comp", block.dimension, block.location, undefined);
    if (!CAMARA.has(id)) return;
    gravarEm("valv", block.dimension, block.location, undefined);
    const vivas: string[] = [];
    for (const k of indice()) {
      const [d, xyz] = [k.slice(0, k.lastIndexOf(":")), k.slice(k.lastIndexOf(":") + 1)];
      const [x, y, z] = xyz.split(",").map(Number);
      const cam = lerEm<Camara | undefined>("camara", block.dimension, { x, y, z }, undefined);
      const dentro = cam && d === block.dimension.id && block.x >= cam.min.x && block.x <= cam.max.x && block.y >= cam.min.y && block.y <= cam.max.y && block.z >= cam.min.z && block.z <= cam.max.z;
      if (dentro) gravarEm("camara", block.dimension, { x, y, z }, undefined); // o ar escapa
      else vivas.push(k);
    }
    world.setDynamicProperty("cl:camaras", JSON.stringify(vivas));
  });
  registrarDetalhe("cl:compressor_ar", (b) => ({ translate: "cl.pn.pressao", with: [fmt(pressaoDoCompressor(b).p)] }));
  registrarDetalhe(["cl:valvula_camara", "cl:interface_camara"], (b) => {
    const cam = camaraDe(b);
    return cam ? textoCamara(cam) : undefined;
  });
  registrarNoCatalogo(() =>
    PNEUMATIC.receitas.map((r) => ({
      maquina: { translate: "tile.cl:valvula_camara.name" },
      maquinaId: "cl:valvula_camara",
      entradas: r.entra.map(([item, qtd]) => ({ item, qtd })),
      saidas: [{ item: r.sai[0], qtd: r.sai[1] }],
      nota: { translate: "cl.pn.pressao", with: [String(r.bar)] },
    })),
  );
}

import { ButtonState, Entity, GameMode, InputButton, ItemStack, Player, Vector3, system, world } from "@minecraft/server";
import { DADOS_F36 } from "../conteudo/gerado.js";
import { registrarAcao } from "../missoes/progresso.js";
import { darAoJogador, gastarDaMao } from "../util/inventario.js";
import { toqueNovo } from "../util/toque.js";

/*
 * Immersive Aircraft (1.13.0): a física de voo é a do código do mod (AircraftEntity, AirplaneEntity, Rotorcraft,
 * AirshipEntity, GyrodyneEntity, QuadrocopterEntity e InventoryVehicleEntity.applyFriction), a 20 ticks por segundo,
 * com os stats de data/immersive_aircraft/aircraft/*.json.
 * - Biplano: pular acelera o motor (+10% por tick); no chão, puxar para trás freia e corta o motor. No ar o joystick
 *   inclina o nariz (para frente desce) e vira; a velocidade vira sustentação (lift) e o planeio troca altura por
 *   velocidade.
 * - Dirigível e Quadricóptero: o motor liga sozinho com combustível; pular sobe, olhar bem para baixo desce, o joystick
 *   anda e vira (o quadricóptero vira para onde o piloto olha e anda de lado).
 * - Girocóptero: sem combustível, a força é das pernas: andar para frente dá corda até 100%; aí pular sobe e inclinar
 *   para frente anda.
 * - Caldeira: tocar a aeronave com um combustível de fornalha põe a pilha na caldeira (até 64); o motor gasta
 *   combustível × motor por tick (carvão: 1.600 ticks; o biplano gasta 1,25 por tick com o motor no máximo).
 * - Bater 3 vezes (vazia) recolhe a aeronave como item, devolvendo o combustível.
 * No Bedrock, agachar desmonta: por isso descer é olhando para baixo.
 */
type Stats = {
  tipo: "aviao" | "dirigivel" | "girocoptero" | "quadricoptero"; combustivel: number; yawSpeed: number; pitchSpeed?: number; engineSpeed: number; pushSpeed?: number;
  verticalSpeed?: number; glideFactor?: number; lift: number; rollFactor: number; groundPitch?: number; mass: number; groundFriction: number;
  horizontalDecay: number; verticalDecay: number; stabilizer: number; reacao: number;
};
const TIPOS = DADOS_F36.tipos as unknown as Readonly<Record<string, Stats>>;
const QUEIMA: Readonly<Record<string, number>> = DADOS_F36.queima;
const FRICCAO = 0.015, GRAVIDADE = -0.04, FRENAGEM = 0.95, ALVO_COMBUSTIVEL = 1000;
const RAD = Math.PI / 180;

type Estado = {
  v: Vector3; alvo: number; motor: number; px: number; py: number; pz: number; arf: number; rol: number; ultY: number;
  ant: Vector3; mostrado: number; dist: number;
};
const estados = new Map<string, Estado>();
const ativos = new Map<string, Entity>();
const batidas = new Map<string, { n: number; ate: number }>();
type Entrada = { x: number; y: number; z: number; pulo: boolean };
const teste = new Map<string, Entrada>(); // entrada simulada (teste no servidor)

const passo = (v: number, alvo: number, n: number) => v + Math.max(-1 / n, Math.min(1 / n, alvo - v));
const comp = (v: Vector3) => Math.hypot(v.x, v.y, v.z);
const norm = (v: Vector3) => {
  const n = comp(v) || 1;
  return { x: v.x / n, y: v.y / n, z: v.z / n };
};
const lerp = (a: Vector3, b: Vector3, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });
const escala = (a: Vector3, k: number) => ({ x: a.x * k, y: a.y * k, z: a.z * k });
const soma = (a: Vector3, b: Vector3) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
const ponto = (a: Vector3, b: Vector3) => a.x * b.x + a.y * b.y + a.z * b.z;

// ---------- Caldeira (propriedades dinâmicas da entidade) ----------
type Caldeira = { id?: string; n: number; q: number };
function caldeira(e: Entity): Caldeira {
  try {
    return JSON.parse((e.getDynamicProperty("cl:caldeira") as string) ?? "") as Caldeira;
  } catch {
    return { n: 0, q: 0 };
  }
}
const gravarCaldeira = (e: Entity, c: Caldeira) => e.setDynamicProperty("cl:caldeira", JSON.stringify(c));
/** Gasta combustível; reabastece da pilha enquanto a queima está abaixo de 1.000 (EngineVehicle.refuel). */
function queimar(e: Entity, c: Caldeira, gasto: number): number {
  let mudou = false;
  while (c.q <= ALVO_COMBUSTIVEL && c.id && c.n > 0) {
    c.q += QUEIMA[c.id] ?? 0;
    c.n--;
    if (c.n <= 0) c.id = undefined;
    mudou = true;
  }
  while (gasto > 0 && c.q > 0 && (gasto >= 1 || Math.random() < gasto)) {
    c.q--;
    gasto--;
    mudou = true;
  }
  if (mudou && system.currentTick % 20 === 0) gravarCaldeira(e, c);
  return c.q > 0 ? 1 : 0;
}

// ---------- Voo ----------
function piloto(e: Entity): Player | undefined {
  const r = e.getComponent("minecraft:rideable")?.getRiders()[0];
  return r instanceof Player ? r : undefined;
}
function entrada(j: Player | undefined, s: Stats): Entrada {
  if (!j) return { x: 0, y: 0, z: 0, pulo: false };
  let m = { x: 0, y: 0 }, pulo = false;
  try {
    m = j.inputInfo.getMovementVector();
    pulo = j.inputInfo.getButtonState(InputButton.Jump) === ButtonState.Pressed;
  } catch {
    // sem entrada
  }
  const desce = s.tipo !== "aviao" && j.getRotation().x > 50;
  return { x: m.x, z: m.y, y: pulo ? 1 : desce ? -1 : 0, pulo };
}

function voar(e: Entity): void {
  const s = TIPOS[e.typeId];
  if (!s) return;
  let st = estados.get(e.id);
  if (!st) {
    const r = e.getRotation();
    st = { v: { x: 0, y: 0, z: 0 }, alvo: 0, motor: 0, px: 0, py: 0, pz: 0, arf: r.x, rol: 0, ultY: 0, ant: e.location, mostrado: -1, dist: 0 };
    estados.set(e.id, st);
  }
  const j = piloto(e);
  const chao = e.isOnGround;
  const agua = e.isInWater;
  // Batidas: o que andou de fato (o jogo trava a entidade nos blocos).
  const real = { x: e.location.x - st.ant.x, y: e.location.y - st.ant.y, z: e.location.z - st.ant.z };
  for (const k of ["x", "y", "z"] as const) if (Math.abs(st.v[k]) > 0.02 && Math.abs(real[k]) < Math.abs(st.v[k]) * 0.3) st.v[k] = real[k];
  if (chao && st.v.y < 0) st.v.y = 0;
  st.ant = e.location;
  if (j) st.dist += Math.hypot(real.x, real.z);

  const inp = teste.get(e.id) ?? entrada(j, s);
  const tem = !!j || teste.has(e.id);
  const n = s.tipo === "quadricoptero" ? 5 : 10;
  st.px = passo(st.px, inp.x, n);
  st.pz = passo(st.pz, inp.z, n);
  st.py = passo(st.py, inp.y, n);

  // Motor e combustível.
  if (!tem) st.alvo = 0;
  else if (s.tipo === "aviao") {
    if (inp.pulo) st.alvo = Math.min(1, st.alvo + 0.1);
    if (chao && inp.z < -0.5) {
      st.alvo = Math.max(0, st.alvo - 0.1);
      st.v = escala(st.v, FRENAGEM);
    }
  } else if (s.tipo === "girocoptero") {
    if (st.alvo < 1) {
      st.alvo = Math.max(0, Math.min(1, st.alvo + inp.z * 0.05 - 0.035));
      if (st.alvo === 1 && chao) st.v.y += 0.25;
      const p = Math.round(st.alvo * 100);
      if (p !== st.mostrado) {
        st.mostrado = p;
        j?.onScreenDisplay.setActionBar({ translate: "cl.ia.pedalar", with: [String(p)] });
      }
    }
  } else st.alvo = 1;
  let uso = 1;
  if (s.combustivel > 0) {
    const c = caldeira(e);
    const criativo = j?.getGameMode() === GameMode.Creative;
    uso = criativo ? 1 : queimar(e, c, st.alvo * s.combustivel);
    if (!uso && j && st.alvo > 0 && system.currentTick % 40 === 0) j.onScreenDisplay.setActionBar({ translate: "cl.ia.acabou" });
  }
  st.motor = passo(st.motor, st.alvo * (agua ? 0.1 : 1), s.reacao);
  const forca = st.motor * Math.sqrt(uso);
  if (j && s.tipo === "aviao" && system.currentTick % 10 === 0) {
    const p = Math.round(st.alvo * 100);
    if (p !== st.mostrado) {
      st.mostrado = p;
      j.onScreenDisplay.setActionBar({ translate: "cl.ia.motor", with: [String(p)] });
    }
  }

  // Direção (updateController): virar e inclinar.
  const rot = e.getRotation();
  let yaw = rot.y;
  if (s.tipo === "quadricoptero") {
    if (j) {
      let d = j.getRotation().y - yaw;
      if (d > 180) d -= 360;
      else if (d < -180) d += 360;
      d *= s.yawSpeed;
      if (Math.abs(d) < 60) yaw += d;
    }
  } else yaw -= s.yawSpeed * st.px;
  if (!chao && s.pitchSpeed) st.arf += s.pitchSpeed * st.pz;
  st.arf = Math.max(-80, Math.min(80, st.arf * (1 - s.stabilizer)));

  const frente3 = { x: -Math.sin(yaw * RAD) * Math.cos(st.arf * RAD), y: -Math.sin(st.arf * RAD), z: Math.cos(yaw * RAD) * Math.cos(st.arf * RAD) };
  const frenteH = { x: -Math.sin(yaw * RAD), y: 0, z: Math.cos(yaw * RAD) };
  const esquerda = { x: Math.cos(yaw * RAD), y: 0, z: Math.sin(yaw * RAD) };

  // Empuxo.
  let g = GRAVIDADE;
  if (s.tipo === "aviao") {
    let empuxo = forca * forca * s.engineSpeed;
    if (chao && st.alvo < 1) empuxo = ((s.pushSpeed ?? 0) / (1 + comp(st.v) * 5)) * st.pz * (1 - forca);
    st.v = soma(st.v, escala(frente3, empuxo));
    const vel = comp(st.v) * (1 - Math.abs(frente3.y));
    g = Math.max(0, 1 - vel * 1.5) * GRAVIDADE;
  } else if (s.tipo === "girocoptero") {
    const cima = { x: -Math.sin(yaw * RAD) * Math.sin(st.arf * RAD), y: Math.cos(st.arf * RAD), z: Math.cos(yaw * RAD) * Math.sin(st.arf * RAD) };
    st.v = soma(st.v, escala(cima, forca * (s.verticalSpeed ?? 0) * st.py));
    let empuxo = forca * forca * s.engineSpeed * Math.sin(st.arf * RAD);
    if (chao && st.alvo < 1) empuxo = ((s.pushSpeed ?? 0) / (1 + comp(st.v) * 5)) * st.pz * (st.pz > 0 ? 1 : 0.5) * forca;
    st.v = soma(st.v, escala(frenteH, empuxo));
    g = (1 - forca) * GRAVIDADE;
  } else {
    st.v.y += forca * (s.verticalSpeed ?? 0) * st.py;
    const empuxo = Math.pow(forca, 5) * s.engineSpeed;
    if (s.tipo === "quadricoptero") st.v = soma(st.v, escala(esquerda, empuxo * st.px));
    st.v = soma(st.v, escala(frenteH, empuxo * st.pz));
    g = agua ? 0.04 : (1 - forca) * GRAVIDADE;
  }

  // updateVelocity: planeio, sustentação e atrito.
  if (s.glideFactor && st.ultY !== 0) {
    const caiu = st.ultY - e.location.y;
    if (caiu !== 0) st.v = soma(st.v, escala(frente3, caiu * s.glideFactor * (1 - Math.abs(frente3.y))));
  }
  st.ultY = e.location.y;
  if (s.tipo === "aviao") {
    const vn = norm(st.v);
    const arrasto = Math.abs(ponto(frente3, vn));
    st.v = escala(norm(lerp(vn, frente3, s.lift)), comp(st.v) * (arrasto * FRICCAO + (1 - FRICCAO)));
  } else if (s.tipo !== "quadricoptero") {
    const h = { x: st.v.x, y: 0, z: st.v.z };
    const vn = norm(h);
    const arrasto = Math.abs(ponto(frenteH, vn));
    const nh = escala(norm(lerp(vn, frenteH, s.lift)), comp(h) * (arrasto * FRICCAO + (1 - FRICCAO)));
    st.v = { x: nh.x, y: st.v.y, z: nh.z };
  }
  let decai = 1 - FRICCAO;
  if (agua) {
    g *= 0.25;
    decai = 0.9;
  } else if (chao) {
    const gf = Math.min(1, Math.max(0, g / GRAVIDADE));
    decai = j ? (s.groundFriction * gf + (1 - gf)) * 0.5 + 0.5 : 0.75;
  }
  st.v = { x: st.v.x * decai * s.horizontalDecay, y: st.v.y * decai * s.verticalDecay + g, z: st.v.z * decai * s.horizontalDecay };
  if (chao && s.groundPitch) st.arf = (st.arf + s.groundPitch) * 0.9 - s.groundPitch;
  st.rol = chao ? st.rol * 0.9 : -st.px * s.rollFactor;

  // Aplica: velocidade, rumo e o desenho (arfagem, rolagem e hélice).
  try {
    e.clearVelocity();
    e.applyImpulse(st.v);
  } catch {
    // fora da área carregada
  }
  e.setRotation({ x: 0, y: yaw });
  if (system.currentTick % 2 === 0) {
    const arf = Math.round(st.arf), rol = Math.round(st.rol), giro = Math.round(forca * 1440);
    if (e.getProperty("cl:arfagem") !== arf) e.setProperty("cl:arfagem", arf);
    if (e.getProperty("cl:rolagem") !== rol) e.setProperty("cl:rolagem", rol);
    if (e.getProperty("cl:giro") !== giro) e.setProperty("cl:giro", giro);
  }

  // Missões.
  if (j && system.currentTick % 20 === 0 && !chao) {
    if (s.tipo === "girocoptero" && forca > 0.5) registrarAcao(j, "girocoptero");
    if (s.tipo === "aviao") {
      const topo = e.dimension.getTopmostBlock({ x: e.location.x, z: e.location.z });
      if (!topo || e.location.y - topo.y >= 30) registrarAcao(j, "biplano_alto");
    }
    if ((s.tipo === "dirigivel" || s.tipo === "quadricoptero") && st.dist >= 500) {
      st.dist = 0;
      registrarAcao(j, "voo_lento");
    }
  }
  // Parado no chão e sem piloto: sai da lista (volta quando alguém monta).
  if (!tem && chao && comp(st.v) < 0.01 && st.motor < 0.01) {
    ativos.delete(e.id);
    estados.delete(e.id);
  }
}

function tick(): void {
  for (const j of world.getPlayers()) {
    const e = j.getComponent("minecraft:riding")?.entityRidingOn;
    if (e && TIPOS[e.typeId] && !ativos.has(e.id)) {
      ativos.set(e.id, e);
      const s = TIPOS[e.typeId];
      j.onScreenDisplay.setActionBar(s.tipo === "aviao" ? { translate: "cl.ia.controles_aviao" } : { translate: "cl.ia.controles_rotor", with: { rawtext: [{ translate: `item.${e.typeId}.name` }] } });
    }
  }
  for (const [id, e] of ativos) {
    if (!e.isValid) {
      ativos.delete(id);
      estados.delete(id);
      continue;
    }
    voar(e);
  }
}

// ---------- Pôr, abastecer e recolher ----------
function por(j: Player, item: ItemStack, p: Vector3): void {
  const e = j.dimension.spawnEntity(item.typeId, p);
  e.setRotation({ x: 0, y: j.getRotation().y });
  gravarCaldeira(e, { n: 0, q: 0 });
  if (j.getGameMode() !== GameMode.Creative) gastarDaMao(j);
  ativos.set(e.id, e); // cai até o chão
}
function abastecer(j: Player, e: Entity, item: ItemStack): void {
  const s = TIPOS[e.typeId];
  const c = caldeira(e);
  if (c.id && c.id !== item.typeId) return void j.onScreenDisplay.setActionBar({ translate: "cl.ia.combustivel", with: { rawtext: [{ translate: `item.${e.typeId}.name` }, { text: String(c.n) }, { translate: new ItemStack(c.id).localizationKey }, { text: segundos(c, s) }] } });
  const n = Math.min(item.amount, 64 - c.n);
  if (n <= 0) return;
  c.id = item.typeId;
  c.n += n;
  gravarCaldeira(e, c);
  if (j.getGameMode() !== GameMode.Creative) {
    gastarDaMao(j, n);
    if (item.typeId === "minecraft:lava_bucket") darAoJogador(j, "minecraft:bucket", n);
  }
  j.playSound("random.pop", { pitch: 0.7 });
  j.onScreenDisplay.setActionBar({ translate: "cl.ia.combustivel", with: { rawtext: [{ translate: `item.${e.typeId}.name` }, { text: String(c.n) }, { translate: item.localizationKey }, { text: segundos(c, s) }] } });
}
const segundos = (c: Caldeira, s: Stats) => String(Math.floor((c.q + (c.id ? (QUEIMA[c.id] ?? 0) * c.n : 0)) / Math.max(0.01, s.combustivel) / 20));
function recolher(j: Player, e: Entity): void {
  if (e.getComponent("minecraft:rideable")?.getRiders().length) return;
  const b = batidas.get(e.id);
  const n = b && b.ate > system.currentTick ? b.n + 1 : 1;
  if (n < 3) {
    batidas.set(e.id, { n, ate: system.currentTick + 40 });
    j.onScreenDisplay.setActionBar({ translate: "cl.ia.recolher", with: [String(3 - n)] });
    return;
  }
  batidas.delete(e.id);
  const c = caldeira(e);
  if (j.getGameMode() !== GameMode.Creative) darAoJogador(j, e.typeId, 1);
  if (c.id && c.n > 0) darAoJogador(j, c.id, c.n);
  ativos.delete(e.id);
  estados.delete(e.id);
  e.remove();
}

export function registrarAeronaves(): void {
  system.runInterval(tick, 1);
  world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const item = ev.itemStack;
    if (!item || !TIPOS[item.typeId] || !toqueNovo(ev)) return;
    ev.cancel = true;
    const { player: j, block: b } = ev;
    system.run(() => por(j, item, { x: b.x + 0.5, y: b.y + 1, z: b.z + 0.5 }));
  });
  world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const { target: e, player: j, itemStack: item } = ev;
    const s = TIPOS[e.typeId];
    if (!s || !item || s.combustivel <= 0 || !QUEIMA[item.typeId]) return;
    ev.cancel = true;
    system.run(() => abastecer(j, e, item));
  });
  world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: j, hitEntity: e }) => {
    if (j instanceof Player && TIPOS[e.typeId]) recolher(j, e);
  });
  // Aeronaves no ar quando o mundo abriu: voltam para a lista para cair.
  world.afterEvents.entityLoad.subscribe(({ entity: e }) => {
    if (TIPOS[e.typeId]) ativos.set(e.id, e);
  });
  // Teste no servidor (o jogador simulado não monta): scriptevent cl:teste_aeronave <tipo> <ticks>
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_aeronave" || !(j instanceof Player)) return;
    const [tipo, ticks, carvao] = message.split(" ");
    const e = j.dimension.getEntities({ type: `cl:${tipo}`, location: j.location, maxDistance: 16, closest: 1 })[0];
    if (!e) return console.warn("[Pouso Forçado] teste_aeronave: nenhuma aeronave perto");
    const aviao = TIPOS[e.typeId].tipo === "aviao";
    if (carvao) gravarCaldeira(e, { id: "minecraft:coal", n: Number(carvao), q: 0 });
    // Avião: acelera e puxa o nariz para cima; os outros: sobem e andam para frente.
    teste.set(e.id, aviao ? { x: 0, y: 0, z: -0.4, pulo: true } : { x: 0, y: 1, z: 1, pulo: true });
    ativos.set(e.id, e);
    const y0 = e.location.y, p0 = e.location;
    system.runTimeout(() => {
      teste.delete(e.id);
      const st = estados.get(e.id);
      console.warn(`[Pouso Forçado] teste_aeronave ${tipo}: subiu ${(e.location.y - y0).toFixed(1)}, andou ${Math.hypot(e.location.x - p0.x, e.location.z - p0.z).toFixed(1)}, motor ${st?.motor.toFixed(2)}, caldeira ${JSON.stringify(caldeira(e))}`);
    }, Number(ticks || 100));
  });
}

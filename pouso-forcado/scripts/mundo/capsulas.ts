import { Dimension, EntityInitializationCause, GameMode, Player, Vector3, system, world } from "@minecraft/server";
import { CAPSULA, PROPS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { criarBauCom } from "../util/inventario.js";
import { intervalo } from "../util/perfil.js";
import { nascerDoAddon } from "../util/nascer.js";

/*
 * Cápsulas de carga: pedaços da nave que ainda estavam em órbita.
 * - Uma vez por dia (de CAPSULA.primeiroDia em diante), de manhã, uma cápsula cai perto de um
 *   jogador: aviso na tela, rastro de fogo descendo e impacto (explosão que não quebra blocos).
 * - A cápsula é uma gaiola pequena de ardósia e barras de ferro com um barril de saque
 *   (CAPSULA.saque) e um casal de animais (vaca, ovelha, galinha ou porco) do lado.
 *   Os animais não nascem sozinhos neste planeta: a cápsula é o jeito de começar um rebanho.
 * - Chegar perto conta como "encontrada" (missões); as não encontradas ficam em PROPS.capsulas.
 * - Para testar: /scriptevent cl:capsula (com trapaças) derruba uma perto de você.
 * Custo: uma checagem a cada 10 s; a queda roda por ~3 s.
 */
type Capsula = { x: number; y: number; z: number };

function lerCapsulas(): Capsula[] {
  const v = world.getDynamicProperty(PROPS.capsulas);
  try {
    return typeof v === "string" ? (JSON.parse(v) as Capsula[]) : [];
  } catch {
    return [];
  }
}

function salvarCapsulas(lista: Capsula[]): void {
  world.setDynamicProperty(PROPS.capsulas, JSON.stringify(lista.slice(-10)));
}

function sortear<T>(lista: ReadonlyArray<T>): T {
  return lista[Math.floor(Math.random() * lista.length)];
}

/** Acha um ponto no chão, carregado, entre as distâncias da config. */
function acharPouso(jogador: Player): Vector3 | undefined {
  const dimensao = jogador.dimension;
  for (let tentativa = 0; tentativa < 12; tentativa++) {
    const angulo = Math.random() * Math.PI * 2;
    const d = CAPSULA.distanciaMin + Math.random() * (CAPSULA.distanciaMax - CAPSULA.distanciaMin);
    const x = Math.floor(jogador.location.x + Math.cos(angulo) * d);
    const z = Math.floor(jogador.location.z + Math.sin(angulo) * d);
    if (!dimensao.isChunkLoaded({ x, y: jogador.location.y, z })) continue;
    const topo = dimensao.getTopmostBlock({ x, z });
    if (!topo || topo.isLiquid) continue;
    return { x, y: topo.y + 1, z };
  }
  return undefined;
}

function particula(dimensao: Dimension, id: string, local: Vector3): void {
  try {
    dimensao.spawnParticle(id, local);
  } catch {
    // partícula é só enfeite
  }
}

/** Monta a gaiola: base 3×3 de ardósia, barras de ferro em volta (sul aberto), barril no meio, teto. */
function montar(dimensao: Dimension, p: Vector3): void {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      dimensao.getBlock({ x: p.x + dx, y: p.y, z: p.z + dz })?.setType("minecraft:polished_deepslate");
      dimensao.getBlock({ x: p.x + dx, y: p.y + 3, z: p.z + dz })?.setType("minecraft:polished_deepslate_slab");
      if (dx === 0 && dz === 0) continue;
      const aberto = dz === 1 && dx === 0; // entrada pelo sul
      for (let dy = 1; dy <= 2; dy++) {
        dimensao.getBlock({ x: p.x + dx, y: p.y + dy, z: p.z + dz })?.setType(aberto ? "minecraft:air" : "minecraft:iron_bars");
      }
    }
  }
  dimensao.getBlock({ x: p.x, y: p.y + 2, z: p.z })?.setType("minecraft:lantern");
  const saque = CAPSULA.saque
    .filter((l) => Math.random() < l.chance)
    .map((l) => ({ item: l.item, quantidade: l.min + Math.floor(Math.random() * (l.max - l.min + 1)) }));
  criarBauCom(dimensao, { x: p.x, y: p.y + 1, z: p.z }, saque, "minecraft:barrel");

  // Um casal de animais saindo pela abertura.
  const animal = sortear(CAPSULA.animais);
  for (let i = 0; i < 2; i++) nascerDoAddon(dimensao, animal, { x: p.x + 0.5 + (i - 0.5), y: p.y + 1, z: p.z + 2.5 });
}

export function derrubarCapsula(jogador: Player): boolean {
  const pouso = acharPouso(jogador);
  if (!pouso) return false;
  const dimensao = jogador.dimension;
  for (const j of world.getPlayers()) {
    j.onScreenDisplay.setTitle(
      { translate: "cl.capsula.titulo" },
      {
        subtitle: { translate: "cl.capsula.subtitulo", with: [String(pouso.x), String(pouso.y), String(pouso.z)] },
        fadeInDuration: 10,
        stayDuration: 80,
        fadeOutDuration: 20,
      },
    );
    j.playSound("random.fuse");
  }
  // Rastro de fogo descendo do céu em ~3 s; depois o impacto.
  const altura = 60;
  let passo = 0;
  const id = intervalo("cápsulas", () => {
    const y = pouso.y + altura - passo * 3;
    particula(dimensao, "minecraft:large_explosion", { x: pouso.x + 0.5, y, z: pouso.z + 0.5 });
    particula(dimensao, "minecraft:campfire_smoke_particle", { x: pouso.x + 0.5, y: y + 2, z: pouso.z + 0.5 });
    particula(dimensao, "minecraft:basic_flame_particle", { x: pouso.x + 0.5, y: y + 1, z: pouso.z + 0.5 });
    passo++;
    if (y > pouso.y + 2) return;
    system.clearRun(id);
    try {
      dimensao.createExplosion({ x: pouso.x + 0.5, y: pouso.y + 1, z: pouso.z + 0.5 }, 2, { breaksBlocks: false, causesFire: false });
      particula(dimensao, "minecraft:huge_explosion_emitter", pouso);
      montar(dimensao, pouso);
      salvarCapsulas([...lerCapsulas(), pouso]);
    } catch (erro) {
      console.warn(`[Pouso Forçado] cápsula: ${erro}`);
    }
  }, 3);
  return true;
}

function procurarEncontradas(): void {
  const lista = lerCapsulas();
  if (lista.length === 0) return;
  const restantes = lista.filter((c) => {
    const quem = world.getPlayers().find(
      (j) => j.dimension.id === "minecraft:overworld" && Math.hypot(j.location.x - c.x, j.location.y - c.y, j.location.z - c.z) <= CAPSULA.achouRaio,
    );
    if (!quem) return true;
    quem.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: "cl.capsula.encontrada" }] });
    registrarAcao(quem, "capsula");
    return false;
  });
  if (restantes.length !== lista.length) salvarCapsulas(restantes);
}

export function registrarCapsulas(): void {
  intervalo("cápsulas", () => {
    procurarEncontradas();
    const t = world.getTimeOfDay();
    const dia = world.getDay();
    if (dia < CAPSULA.primeiroDia || t < CAPSULA.horaMin || t > CAPSULA.horaMax) return;
    if (world.getDynamicProperty(PROPS.capsulaDia) === dia) return;
    const jogadores = world
      .getPlayers({ excludeGameModes: [GameMode.Spectator] })
      .filter((j) => j.dimension.id === "minecraft:overworld");
    if (jogadores.length === 0) return;
    if (derrubarCapsula(sortear(jogadores))) world.setDynamicProperty(PROPS.capsulaDia, dia);
  }, 200);

  system.afterEvents.scriptEventReceive.subscribe(({ id, sourceEntity }) => {
    if (id !== "cl:capsula" || !(sourceEntity instanceof Player)) return;
    if (!derrubarCapsula(sourceEntity)) sourceEntity.sendMessage("§c[Pouso Forçado] Sem lugar carregado para a cápsula cair.");
  });

  // Filhotes contam para a missão do rebanho (jogador a até 10 blocos).
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== EntityInitializationCause.Born) return;
    try {
      const perto = entity.dimension.getPlayers({ location: entity.location, maxDistance: 10 });
      for (const j of perto) registrarAcao(j, "procriar");
    } catch {
      // entidade já sumiu
    }
  });
}

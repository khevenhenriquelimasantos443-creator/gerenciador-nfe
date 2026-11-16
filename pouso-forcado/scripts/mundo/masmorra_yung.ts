import { Dimension, Player, system, world } from "@minecraft/server";
import { registrarAcao } from "../missoes/progresso.js";
import { chunkDaNave, rng, sementeDe, sementeDoMundo } from "../util/aleatorio.js";
import { intervalo } from "../util/perfil.js";
import { MASMORRA_YUNG } from "./masmorra_yung_dados.js";
import { mundoPlano } from "./tipo.js";

/*
 * 1.55.0: a Masmorra dos Esqueletos do YUNG's Better Dungeons (LGPLv3), montada das peças do mod por
 * tools/gerar-masmorra-yung.py (3 variantes de 31×13×31, com os geradores de esqueletos e os baús do mod).
 * Onde, como no mod (structure_set skeleton_dungeons: random_spread de 46×46 chunks, separação 23): uma por região, num
 * chunk sorteado pela semente do mundo, com a âncora entre y -50 e -30. Não fica perto da nave.
 * Quando: é posta de uma vez quando alguém chega a 100 blocos (uma área de carregamento segura os chunks). Se alguém
 * já estava cavando ali embaixo antes de ela existir, ela não é posta (para não apagar o túnel do jogador).
 * Só no mundo normal (o plano, de antes da 1.15.0, não tem rocha embaixo).
 * Custo: uma conta por segundo e a construção, uma vez por masmorra.
 */
const REGIAO = 46, SEPARACAO = 23;
const PREPARAR = 100, AVISO = 48;
const AREA = "cl_masmorra_yung";
type Masmorra = { chave: string; v: number; x: number; y: number; z: number; x1: number; z1: number; x2: number; z2: number; y1: number; y2: number };
type Estado = { e: 0 | 1 | 2; a?: boolean };

const cache = new Map<string, Masmorra | null>();
function daRegiao(rx: number, rz: number): Masmorra | undefined {
  const k = `${rx},${rz}`;
  const c = cache.get(k);
  if (c !== undefined) return c ?? undefined;
  const r = rng(sementeDe(sementeDoMundo(), rx, rz, 732581671));
  const cx = rx * REGIAO + Math.floor(r() * (REGIAO - SEPARACAO)), cz = rz * REGIAO + Math.floor(r() * (REGIAO - SEPARACAO));
  const v = Math.floor(r() * MASMORRA_YUNG.variantes.length);
  const d = MASMORRA_YUNG.variantes[v];
  // A âncora (o meio da casca, no chão) entre y -50 e -30; o fundo não passa de y -63.
  const y = Math.max(-63 + d.ancora[1], -50 + Math.floor(r() * 21));
  const x = cx * 16 + 8, z = cz * 16 + 8;
  const m: Masmorra = {
    chave: k, v, x, y, z, x1: x - d.ancora[0], z1: z - d.ancora[2], x2: x - d.ancora[0] + d.tam[0] - 1, z2: z - d.ancora[2] + d.tam[2] - 1,
    y1: y - d.ancora[1], y2: y - d.ancora[1] + d.tam[1] - 1,
  };
  const nave = chunkDaNave();
  const longe = !nave || Math.max(Math.abs(cx - nave[0]), Math.abs(cz - nave[1])) >= 6;
  cache.set(k, longe ? m : null);
  return longe ? m : undefined;
}
const prop = (m: Masmorra) => `cl:masmorra_yung:${m.chave}`;
function ler(m: Masmorra): Estado {
  const v = world.getDynamicProperty(prop(m));
  try {
    return typeof v === "string" ? (JSON.parse(v) as Estado) : { e: 0 };
  } catch {
    return { e: 0 };
  }
}
const gravar = (m: Masmorra, e: Estado) => world.setDynamicProperty(prop(m), JSON.stringify(e));

let areaAberta = false;
function soltarArea(): void {
  if (!areaAberta) return;
  areaAberta = false;
  try {
    world.tickingAreaManager.removeTickingArea(AREA);
  } catch {
    // já tinha saído
  }
}

// Sinais de construção do jogador no subsolo (os blocos do pack, fora minérios e pedras, e os do jogo que não nascem
// sozinhos lá embaixo): num mundo de antes da 1.55.0 a masmorra não pode apagar o túnel ou a base de alguém.
const DO_JOGADOR = new Set(["minecraft:torch", "minecraft:crafting_table", "minecraft:furnace", "minecraft:lit_furnace", "minecraft:ladder",
  "minecraft:glass", "minecraft:bed", "minecraft:barrel", "minecraft:smoker", "minecraft:blast_furnace"]);
const NATURAL_CL = /minerio|marmore|calcario|petroleo|pedra|rocha|bolsao/;
function subsoloLivre(dim: Dimension, m: Masmorra): boolean {
  for (let x = m.x1; x <= m.x2; x += 2)
    for (let z = m.z1; z <= m.z2; z += 2)
      for (let y = m.y1; y <= m.y2; y += 2) {
        const id = dim.getBlock({ x, y, z })?.typeId ?? "";
        if (DO_JOGADOR.has(id) || (id.startsWith("cl:") && !NATURAL_CL.test(id))) return false;
      }
  return true;
}

/** true: terminou (posta, ou cancelada por ter construção do jogador ali); false: esperando os chunks. */
function construir(m: Masmorra): boolean {
  const dim = world.getDimension("overworld");
  const pronta = dim.isChunkLoaded({ x: m.x1, y: m.y1, z: m.z1 }) && dim.isChunkLoaded({ x: m.x2, y: m.y1, z: m.z2 }) &&
    dim.isChunkLoaded({ x: m.x1, y: m.y1, z: m.z2 }) && dim.isChunkLoaded({ x: m.x2, y: m.y1, z: m.z1 });
  if (!pronta) {
    if (!areaAberta) {
      const opcoes = { dimension: dim, from: { x: m.x1, y: m.y1, z: m.z1 }, to: { x: m.x2, y: m.y2, z: m.z2 } };
      try {
        if (world.tickingAreaManager.hasCapacity(opcoes)) {
          areaAberta = true;
          world.tickingAreaManager.createTickingArea(AREA, opcoes).catch(() => (areaAberta = false));
        }
      } catch {
        areaAberta = false;
      }
    }
    return false;
  }
  if (m.chave !== "teste" && !subsoloLivre(dim, m)) {
    gravar(m, { ...ler(m), e: 2 });
    cancelada = true;
    return true;
  }
  const d = MASMORRA_YUNG.variantes[m.v];
  for (const [i, k] of d.tiles) world.structureManager.place(`cl:masmorra_yung_${m.v}_${i}_${k}`, dim, { x: m.x1 + i * 64, y: m.y1, z: m.z1 + k * 64 });
  return true;
}
let cancelada = false;

let teste: Masmorra | undefined;
export function registrarMasmorraYung(): void {
  intervalo("masmorra dos esqueletos", () => {
    const jogadores = world.getPlayers().filter((j) => j.dimension.id === "minecraft:overworld");
    if (!jogadores.length) return soltarArea();
    // Mundo plano (os de antes da 1.15.0) não tem rocha embaixo: a masmorra ficaria no ar (o teste usa o comando).
    if (mundoPlano() && !teste) return;
    let alvo: Masmorra | undefined, dAlvo = Infinity;
    for (const j of jogadores) {
      const { x, y, z } = j.location;
      const rx = Math.floor(Math.floor(x / 16) / REGIAO), rz = Math.floor(Math.floor(z / 16) / REGIAO);
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          const m = daRegiao(rx + dx, rz + dz);
          if (!m) continue;
          const d = Math.hypot(m.x - x, m.z - z);
          if (d > PREPARAR + 20) continue;
          const est = ler(m);
          const dentroXZ = x >= m.x1 - 4 && x <= m.x2 + 4 && z >= m.z1 - 4 && z <= m.z2 + 4;
          if (est.e === 0 && dentroXZ && y <= m.y2 + 24) {
            gravar(m, { ...est, e: 2 }); // cavando ali antes de ela existir: fica sem
            continue;
          }
          if (est.e === 0 && d <= PREPARAR && d < dAlvo) {
            alvo = m;
            dAlvo = d;
          }
          if (est.e === 1) {
            if (!est.a && d <= AVISO) {
              j.sendMessage({ translate: "cl.yung.masmorra_aviso", with: [String(m.x), String(m.z), String(Math.max(0, Math.round(y - m.y)))] });
              gravar(m, { ...est, a: true });
            }
            if (dentroXZ && y >= m.y1 && y <= m.y2 + 2) {
              const marca = `cl:viu_masmorra_yung:${m.chave}`;
              if (j.getDynamicProperty(marca) !== true) {
                j.setDynamicProperty(marca, true);
                registrarAcao(j, "masmorra_esqueletos");
              }
            }
          }
        }
    }
    if (teste) alvo = teste;
    if (!alvo) return soltarArea();
    cancelada = false;
    if (!construir(alvo)) return;
    if (cancelada) console.warn(`[Pouso Forçado] Masmorra dos Esqueletos em ${alvo.x}, ${alvo.z} ficou sem: construção do jogador ali`);
    else {
      if (alvo !== teste) gravar(alvo, { ...ler(alvo), e: 1 });
      console.warn(`[Pouso Forçado] Masmorra dos Esqueletos em ${alvo.x}, ${alvo.y}, ${alvo.z}`);
    }
    teste = undefined;
    soltarArea();
  }, 20);
  // Para os testes no servidor (só com cheats): /scriptevent cl:teste_masmorra_yung <variante> põe uma 40 blocos ao
  // lado, com a âncora 20 blocos abaixo do jogador.
  system.afterEvents.scriptEventReceive.subscribe(({ id, message, sourceEntity: j }) => {
    if (id !== "cl:teste_masmorra_yung" || !(j instanceof Player)) return;
    const v = Number(message) || 0;
    const d = MASMORRA_YUNG.variantes[v];
    const x = Math.floor(j.location.x) + 40, y = Math.floor(j.location.y) - 20, z = Math.floor(j.location.z);
    teste = {
      chave: "teste", v, x, y, z, x1: x - d.ancora[0], z1: z - d.ancora[2], x2: x - d.ancora[0] + d.tam[0] - 1, z2: z - d.ancora[2] + d.tam[2] - 1,
      y1: y - d.ancora[1], y2: y - d.ancora[1] + d.tam[1] - 1,
    };
  });
}

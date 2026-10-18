import { Dimension, StructureRotation, Vector3, system, world } from "@minecraft/server";
import { DESTROCOS_SAQUE, MUNDO_PLANO, PROPS, RELEVO, TEMPLO_SAQUE } from "../config.js";
import { chunkDaNave, rng, sementeDe, sementeDoMundo, sortearSaque } from "../util/aleatorio.js";
import { criarBauCom } from "../util/inventario.js";
import { cidadeDoChunk, construirQuarteirao } from "./cidade.js";
import { alturaDuna, porDunas } from "./dunas.js";
import { talvezMasmorra } from "./masmorra.js";
import { porMinerios } from "./minerios.js";
import { registrarPonto } from "./pontos.js";

/*
 * Relevo do mundo plano: o mundo gera só camadas planas de areia, pedra e ardósia. Este módulo
 * decora cada chunk UMA vez: dunas por ruído contínuo (scripts/mundo/dunas.ts), veios de minério,
 * cactos, arbustos secos, masmorras no subsolo (masmorra.ts) e, nas planícies, às vezes um morro,
 * uma mesa, rochas, um templo soterrado ou destroços de nave (estruturas em BP/structures/cl/).
 * Chunks de cidade (cidade.ts) viram quarteirões em vez disso.
 *
 * Para o relevo já estar pronto quando aparece no horizonte, os chunks até RELEVO.raioChunks
 * são decorados antes de o jogador chegar: os que o jogo já carregou, direto; os outros, abrindo
 * uma ticking area (que carrega um bloco de chunks), decorando e fechando a área.
 *
 * Custo: a cada 0,5 s, no máximo RELEVO.maxPorCiclo chunks decorados e uma ticking area aberta
 * por vez. Chunks já decorados ficam marcados no próprio mundo (MUNDO_PLANO.marcador), então nada
 * é refeito ao reabrir o mundo.
 */

const vistos = new Set<string>(); // chunks já resolvidos nesta sessão
const GIROS = [StructureRotation.None, StructureRotation.Rotate90, StructureRotation.Rotate180, StructureRotation.Rotate270];

function areaCarregada(dimensao: Dimension, x: number, z: number, tamanho: number): boolean {
  const y = MUNDO_PLANO.superficieY;
  return [[x, z], [x + tamanho, z], [x, z + tamanho], [x + tamanho, z + tamanho]].every(([px, pz]) =>
    dimensao.isChunkLoaded({ x: px, y, z: pz }),
  );
}

const SAQUES = { templo: TEMPLO_SAQUE, destrocos: DESTROCOS_SAQUE } as const;

// Cactos de 1 a 3 blocos, só em areia e sem nada encostado nos lados (como no jogo normal).
function porCactos(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  if (sorte() >= RELEVO.cacto.chance) return;
  const quantos = 1 + Math.floor(sorte() * RELEVO.cacto.maxPorChunk);
  for (let i = 0; i < quantos; i++) {
    const topo = dimensao.getTopmostBlock({ x: x0 + 1 + Math.floor(sorte() * 14), z: z0 + 1 + Math.floor(sorte() * 14) });
    if (topo?.typeId !== "minecraft:sand") continue;
    const altura = 1 + Math.floor(sorte() * 3);
    let bloco = topo.above();
    for (let h = 0; h < altura && bloco?.isAir; h++) {
      const lados = [bloco.north(), bloco.south(), bloco.east(), bloco.west()];
      if (!lados.every((l) => l?.isAir)) break;
      bloco.setType("minecraft:cactus");
      bloco = bloco.above();
    }
  }
}

function porArbustosSecos(dimensao: Dimension, x0: number, z0: number, sorte: () => number): void {
  if (sorte() >= RELEVO.arbustoSeco) return;
  const quantos = 1 + Math.floor(sorte() * 3);
  for (let i = 0; i < quantos; i++) {
    const topo = dimensao.getTopmostBlock({ x: x0 + Math.floor(sorte() * 16), z: z0 + Math.floor(sorte() * 16) });
    const acima = topo?.typeId === "minecraft:sand" ? topo.above() : undefined;
    if (acima?.isAir) acima.setType("minecraft:deadbush");
  }
}

/** O bloco bate com a camada esperada? Minério conta como a pedra/ardósia onde ele nasceu. */
function bate(achado: string | undefined, esperado: string): boolean {
  if (achado === esperado) return true;
  if (!achado?.endsWith("_ore")) return false;
  if (esperado === "minecraft:deepslate") return achado.startsWith("minecraft:deepslate_");
  if (esperado === "minecraft:stone") return !achado.startsWith("minecraft:deepslate_");
  return false;
}

/** A coluna x, z tem as camadas exatas do mundo plano do add-on? */
function ehColunaDoMundoPlano(dimensao: Dimension, x: number, z: number): boolean {
  return MUNDO_PLANO.assinatura.every(({ y, bloco }) => bate(dimensao.getBlock({ x, y, z })?.typeId, bloco));
}

/** Pelo menos 2 de 3 colunas do chunk batem (o jogador pode ter cavado uma). */
function ehChunkDoMundoPlano(dimensao: Dimension, x0: number, z0: number): boolean {
  return [[0, 0], [8, 8], [15, 15]].filter(([dx, dz]) => ehColunaDoMundoPlano(dimensao, x0 + dx, z0 + dz)).length >= 2;
}

/**
 * Descobre uma vez se este mundo é o plano do add-on, olhando a coluna do primeiro jogador.
 * Num mundo normal o relevo fica desligado para sempre (senão punha areia e minério por cima
 * do relevo do jogo). Retorna undefined enquanto o chunk ainda não carregou.
 */
function tipoDoMundo(): "plano" | "normal" | undefined {
  const salvo = world.getDynamicProperty(PROPS.tipoMundo);
  if (salvo === "plano" || salvo === "normal") return salvo;
  const jogador = world.getPlayers().find((j) => j.dimension.id === "minecraft:overworld");
  if (!jogador) return undefined;
  const x = Math.floor(jogador.location.x / 16) * 16, z = Math.floor(jogador.location.z / 16) * 16;
  if (!jogador.dimension.isChunkLoaded({ x, y: 0, z })) return undefined;
  const plano = ehChunkDoMundoPlano(jogador.dimension, x, z);
  const tipo = plano ? "plano" : "normal";
  world.setDynamicProperty(PROPS.tipoMundo, tipo);
  console.warn(`[Pouso Forçado] tipo de mundo: ${tipo}`);
  return tipo;
}

// pronto = nada a fazer (já marcado ou não é mundo plano); decorado = trabalho feito; esperar = área ainda não carregada
type Resultado = "pronto" | "decorado" | "esperar";

/** A área da peça está toda em planície (sem duna)? */
function areaPlana(x: number, z: number, tamanho: number, semente: number, nave: { x: number; z: number }): boolean {
  const m = Math.floor(tamanho / 2);
  return [[0, 0], [tamanho, 0], [0, tamanho], [tamanho, tamanho], [m, m]].every(
    ([dx, dz]) => alturaDuna(x + dx, z + dz, semente, nave) === 0,
  );
}

/** Se a duna nova cobriu um jogador, põe ele em cima dela. */
function desenterrarJogadores(dimensao: Dimension, x0: number, z0: number): void {
  for (const jogador of dimensao.getPlayers()) {
    const { x, y, z } = jogador.location;
    if (x < x0 || x >= x0 + 16 || z < z0 || z >= z0 + 16) continue;
    const cabeca = dimensao.getBlock({ x, y: y + 1, z });
    if (cabeca && !cabeca.isAir) {
      const topo = dimensao.getTopmostBlock({ x, z });
      if (topo) jogador.teleport({ x, y: topo.y + 1, z });
    }
  }
}

function decorarChunk(dimensao: Dimension, cx: number, cz: number, semente: number, naveChunk: [number, number]): Resultado {
  const x0 = cx * 16, z0 = cz * 16;
  const canto = { x: x0, y: MUNDO_PLANO.marcadorY, z: z0 };
  if (!dimensao.isChunkLoaded(canto)) return "esperar";
  const marca = dimensao.getBlock(canto);
  if (!marca) return "esperar";
  // Já decorado, ou não é o mundo plano do modelo (ex.: add-on num mundo normal): não mexe.
  if (marca.typeId !== MUNDO_PLANO.pedraEsperada) return "pronto";
  if (!ehChunkDoMundoPlano(dimensao, x0, z0)) return "pronto";

  const sorte = rng(sementeDe(semente, cx, cz));
  const nave = { x: naveChunk[0] * 16 + 8, z: naveChunk[1] * 16 + 8 };

  // Cidade: o chunk é um quarteirão (sem dunas nem peças), com minérios por baixo.
  const cidade = cidadeDoChunk(cx, cz, semente, naveChunk);
  if (cidade) {
    porMinerios(dimensao, x0, z0, sorte);
    construirQuarteirao(dimensao, cx, cz, cidade.dist, semente);
    desenterrarJogadores(dimensao, x0, z0);
    marca.setType(MUNDO_PLANO.marcador);
    return "decorado";
  }
  const pertoDaNave = Math.max(Math.abs(cx - naveChunk[0]), Math.abs(cz - naveChunk[1])) < RELEVO.distanciaNave;

  // Primeiro decide a peça e confere se a área dela está carregada, antes de mexer em qualquer bloco.
  let rolagem = sorte();
  const peca = pertoDaNave ? undefined : RELEVO.pecas.find((p) => (rolagem -= p.chance) < 0);
  const ox = x0 + Math.floor(sorte() * 16) - Math.floor((peca?.tamanho ?? 0) / 2);
  const oz = z0 + Math.floor(sorte() * 16) - Math.floor((peca?.tamanho ?? 0) / 2);
  const girar = Math.floor(sorte() * 4);
  const colocaPeca = !!peca && areaPlana(ox, oz, peca.tamanho, semente, nave);
  if (colocaPeca && !areaCarregada(dimensao, ox, oz, peca.tamanho)) return "esperar";

  porDunas(dimensao, x0, z0, semente, nave);
  desenterrarJogadores(dimensao, x0, z0);
  porMinerios(dimensao, x0, z0, sorte);
  if (!pertoDaNave) talvezMasmorra(dimensao, x0, z0, sorte);

  if (colocaPeca && peca) {
    const origem: Vector3 = { x: ox, y: MUNDO_PLANO.superficieY + peca.deslocY, z: oz };
    const rotation = peca.girar ? GIROS[girar] : StructureRotation.None;
    world.structureManager.place(peca.estrutura, dimensao, origem, { rotation });
    if ("bau" in peca) {
      const b = peca.bau;
      const tabela = SAQUES["saque" in peca ? peca.saque : "templo"];
      criarBauCom(dimensao, { x: ox + b.x, y: origem.y + b.y, z: oz + b.z }, sortearSaque(tabela, sorte));
      if ("ponto" in peca) registrarPonto(peca.ponto, ox + b.x, origem.y + b.y, oz + b.z, 7);
    }
  }
  if (!pertoDaNave) {
    porArbustosSecos(dimensao, x0, z0, sorte);
    porCactos(dimensao, x0, z0, sorte);
  }

  marca.setType(MUNDO_PLANO.marcador);
  return "decorado";
}

// Deslocamentos (em chunks) até RELEVO.raioChunks, do mais perto para o mais longe.
const OFFSETS: ReadonlyArray<[number, number]> = (() => {
  const r = RELEVO.raioChunks;
  const lista: Array<[number, number]> = [];
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) if (Math.hypot(dx, dz) <= r + 0.5) lista.push([dx, dz]);
  return lista.sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]));
})();

// Ticking area aberta para carregar chunks distantes (uma por vez).
const ID_AREA = "cl_relevo";
let area: { alvo: string; criadaEm: number; pronta: boolean } | undefined;
let limpouAreas = false;

function fecharArea(): void {
  area = undefined;
  try {
    if (world.tickingAreaManager.hasTickingArea(ID_AREA)) world.tickingAreaManager.removeTickingArea(ID_AREA);
  } catch (erro) {
    console.warn(`[Pouso Forçado] fechar ticking area: ${erro}`);
  }
}

function abrirArea(dimensao: Dimension, cx: number, cz: number): void {
  const gerente = world.tickingAreaManager;
  // Tenta 4×4 chunks; se não couber, 2×2; depois só o chunk.
  for (const lado of [RELEVO.areaLado, 2, 1]) {
    const a = Math.floor((lado - 1) / 2);
    const opcoes = {
      dimension: dimensao,
      from: { x: (cx - a) * 16, y: -64, z: (cz - a) * 16 },
      to: { x: (cx - a + lado) * 16 - 1, y: 100, z: (cz - a + lado) * 16 - 1 },
    };
    if (!gerente.hasCapacity(opcoes)) continue;
    const esta = { alvo: `${cx},${cz}`, criadaEm: system.currentTick, pronta: false };
    area = esta;
    gerente
      .createTickingArea(ID_AREA, opcoes)
      .then(() => {
        esta.pronta = true;
      })
      .catch((erro) => {
        console.warn(`[Pouso Forçado] ticking area: ${erro}`);
        if (area === esta) fecharArea();
      });
    return;
  }
}

export function registrarRelevo(): void {
  system.runInterval(() => {
    // Só depois que a nave já foi posta, para nada nascer em cima dela.
    const nave = chunkDaNave();
    if (!nave) return;
    if (tipoDoMundo() !== "plano") return;
    if (!limpouAreas) {
      limpouAreas = true; // sobras de uma sessão anterior
      try {
        world.tickingAreaManager.removeAllTickingAreas();
      } catch {
        // sem ticking areas
      }
    }
    const semente = sementeDoMundo();
    let orcamento = RELEVO.maxPorCiclo;

    // A área atual já serviu (o chunk-alvo ficou pronto) ou demorou demais: fecha.
    if (area && (vistos.has(area.alvo) || system.currentTick - area.criadaEm > RELEVO.areaEsperaTicks)) fecharArea();

    for (const jogador of world.getPlayers()) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      const pcx = Math.floor(jogador.location.x / 16), pcz = Math.floor(jogador.location.z / 16);
      let pendentes = 0; // chunks que ainda esperam carregar: não precisa olhar todos a cada ciclo
      for (const [dx, dz] of OFFSETS) {
        if (pendentes > 16) break;
        if (orcamento <= 0) return;
        const cx = pcx + dx, cz = pcz + dz;
        const chave = `${cx},${cz}`;
        if (vistos.has(chave)) continue;
        try {
          const resultado = decorarChunk(jogador.dimension, cx, cz, semente, nave);
          if (resultado !== "esperar") vistos.add(chave);
          if (resultado === "decorado") orcamento--;
          // Chunk longe e ainda não carregado: abre uma ticking area nele (uma de cada vez).
          if (resultado === "esperar") {
            pendentes++;
            if (!area) abrirArea(jogador.dimension, cx, cz);
          }
        } catch (erro) {
          console.warn(`[Pouso Forçado] relevo no chunk ${chave}: ${erro}`);
          vistos.add(chave); // não insiste num chunk problemático
          orcamento--;
        }
      }
    }
  }, RELEVO.intervaloTicks);
}

import { Dimension, Player, StructureRotation, Vector3, system, world } from "@minecraft/server";
import { MUNDO_PLANO, PROPS, RELEVO, TEMPLO_SAQUE } from "../config.js";
import { Pilha, criarBauCom } from "../util/inventario.js";

/*
 * Relevo do mundo plano: o .mctemplate gera só camadas planas de areia. Este módulo
 * decora cada chunk UMA vez, quando ele carrega perto de um jogador: às vezes uma duna,
 * um morro pequeno, rochas ou um templo soterrado (estruturas em BP/structures/cl/).
 *
 * Custo: a cada 1 s, consulta um conjunto em memória para os chunks em volta e
 * decora no máximo RELEVO.maxPorCiclo chunks novos. Chunks já decorados ficam marcados
 * no próprio mundo (MUNDO_PLANO.marcador), então nada é refeito ao reabrir o mundo.
 */

const vistos = new Set<string>(); // chunks já resolvidos nesta sessão
const GIROS = [StructureRotation.None, StructureRotation.Rotate90, StructureRotation.Rotate180, StructureRotation.Rotate270];

// Gerador pseudoaleatório determinístico por chunk (mulberry32).
function rng(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sementeDoMundo(): number {
  let s = world.getDynamicProperty(PROPS.sementeRelevo);
  if (typeof s !== "number") {
    s = Math.floor(Math.random() * 2 ** 31);
    world.setDynamicProperty(PROPS.sementeRelevo, s);
  }
  return s;
}

function chunkDaNave(): [number, number] | undefined {
  const valor = world.getDynamicProperty(PROPS.naveChunk);
  if (typeof valor !== "string") return undefined;
  const [cx, cz] = valor.split(",").map(Number);
  return [cx, cz];
}

function areaCarregada(dimensao: Dimension, x: number, z: number, tamanho: number): boolean {
  const y = MUNDO_PLANO.superficieY;
  return [[x, z], [x + tamanho, z], [x, z + tamanho], [x + tamanho, z + tamanho]].every(([px, pz]) =>
    dimensao.isChunkLoaded({ x: px, y, z: pz }),
  );
}

function sortearSaque(sorte: () => number): Pilha[] {
  return TEMPLO_SAQUE.filter((l) => sorte() < l.chance).map((l) => ({
    item: l.item,
    quantidade: l.min + Math.floor(sorte() * (l.max - l.min + 1)),
  }));
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

// pronto = nada a fazer (já marcado ou não é mundo plano); decorado = trabalho feito; esperar = área ainda não carregada
type Resultado = "pronto" | "decorado" | "esperar";

function decorarChunk(dimensao: Dimension, cx: number, cz: number, semente: number, nave: [number, number]): Resultado {
  const x0 = cx * 16, z0 = cz * 16;
  const canto = { x: x0, y: MUNDO_PLANO.marcadorY, z: z0 };
  if (!dimensao.isChunkLoaded(canto)) return "esperar";
  const marca = dimensao.getBlock(canto);
  if (!marca) return "esperar";
  // Já decorado, ou não é o mundo plano do modelo (ex.: add-on num mundo normal): não mexe.
  if (marca.typeId !== MUNDO_PLANO.pedraEsperada) return "pronto";

  const sorte = rng(semente ^ Math.imul(cx, 73856093) ^ Math.imul(cz, 83492791));
  const pertoDaNave = Math.max(Math.abs(cx - nave[0]), Math.abs(cz - nave[1])) < RELEVO.distanciaNave;

  if (!pertoDaNave) {
    let rolagem = sorte();
    const peca = RELEVO.pecas.find((p) => (rolagem -= p.chance) < 0);
    if (peca) {
      const ox = x0 + Math.floor(sorte() * 16) - Math.floor(peca.tamanho / 2);
      const oz = z0 + Math.floor(sorte() * 16) - Math.floor(peca.tamanho / 2);
      if (!areaCarregada(dimensao, ox, oz, peca.tamanho)) return "esperar";
      const origem: Vector3 = { x: ox, y: MUNDO_PLANO.superficieY + peca.deslocY, z: oz };
      const rotation = peca.girar ? GIROS[Math.floor(sorte() * 4)] : StructureRotation.None;
      world.structureManager.place(peca.estrutura, dimensao, origem, { rotation });
      if ("bau" in peca) {
        const b = peca.bau;
        criarBauCom(dimensao, { x: ox + b.x, y: origem.y + b.y, z: oz + b.z }, sortearSaque(sorte));
      }
    }
    porArbustosSecos(dimensao, x0, z0, sorte);
  }

  marca.setType(MUNDO_PLANO.marcador);
  return "decorado";
}

function chunksEmVolta(jogador: Player): Array<[number, number]> {
  const pcx = Math.floor(jogador.location.x / 16), pcz = Math.floor(jogador.location.z / 16);
  const r = RELEVO.raioChunks;
  const lista: Array<[number, number]> = [];
  for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) lista.push([pcx + dx, pcz + dz]);
  // Mais perto primeiro.
  return lista.sort((a, b) => Math.hypot(a[0] - pcx, a[1] - pcz) - Math.hypot(b[0] - pcx, b[1] - pcz));
}

export function registrarRelevo(): void {
  system.runInterval(() => {
    // Só depois que a nave já foi posta, para nada nascer em cima dela.
    const nave = chunkDaNave();
    if (!nave) return;
    const semente = sementeDoMundo();
    let orcamento = RELEVO.maxPorCiclo;

    for (const jogador of world.getPlayers()) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      for (const [cx, cz] of chunksEmVolta(jogador)) {
        if (orcamento <= 0) return;
        const chave = `${cx},${cz}`;
        if (vistos.has(chave)) continue;
        try {
          const resultado = decorarChunk(jogador.dimension, cx, cz, semente, nave);
          if (resultado !== "esperar") vistos.add(chave);
          if (resultado === "decorado") orcamento--;
        } catch (erro) {
          console.warn(`[Pouso Forçado] relevo no chunk ${chave}: ${erro}`);
          vistos.add(chave); // não insiste num chunk problemático
          orcamento--;
        }
      }
    }
  }, RELEVO.intervaloTicks);
}

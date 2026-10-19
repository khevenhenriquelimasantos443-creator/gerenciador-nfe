import { Player, RawMessage, TitleDisplayOptions, system, world } from "@minecraft/server";
import { MINIMAPA, MUNDO_PLANO, PROPS } from "../config.js";
import { cidadeDoChunk } from "../mundo/cidade.js";
import { alturaDuna } from "../mundo/dunas.js";
import { raraDoChunk } from "../mundo/raras.js";
import { chunkDaNave, sementeDoMundo } from "../util/aleatorio.js";

/*
 * Minimapa na tela, no canto superior direito: cada quadradinho é um chunk, com o norte para cima.
 * O Bedrock não deixa o script desenhar na tela, então o mapa vai como TÍTULO, começando com a
 * marca MARCA. O RP/ui/hud_screen.json mostra todo título com a marca num painel pequeno no
 * canto (sem a marca) e esconde o título grande normal. Os quadradinhos são caracteres de uma
 * fonte própria (RP/font/glyph_E8.png, gerada por tools/gerar-texturas.mjs).
 * - Chunk que o jogo já carregou: areia, duna baixa/alta, cidade, torre, templo, destroços, nave.
 * - Chunk nunca carregado nesta sessão: escuro.
 * - Você: a seta no meio, apontando para onde olha.
 * Títulos de verdade (horda, tempestade...) vão por mostrarTitulo(), que pausa o mapa enquanto aparecem.
 * /cl:mapa liga e desliga. Custo: até 225 consultas "chunk carregado?" por jogador a cada 5 ticks.
 */
export const MARCA = "clmapa:";
const G = (i: number) => String.fromCharCode(0xe800 + i);
const DESCONHECIDO = 0, AREIA = 1, DUNA_BAIXA = 2, DUNA_ALTA = 3, CIDADE = 4, TORRE = 5, TEMPLO = 6, DESTROCOS = 7, NAVE = 8, SETA = 9;

const tipos = new Map<string, number>(); // chunk -> tipo do terreno (não muda; depende só da semente)
const conhecidos = new Set<string>(); // chunks já vistos carregados nesta sessão
const ultimo = new Map<string, { texto: string; tick: number }>();
const pausaAte = new Map<string, number>();

/** Mostra um título normal e segura o minimapa enquanto ele aparece. */
export function mostrarTitulo(jogador: Player, titulo: RawMessage | string, opcoes?: TitleDisplayOptions): void {
  const dura = (opcoes?.fadeInDuration ?? 10) + (opcoes?.stayDuration ?? 70) + (opcoes?.fadeOutDuration ?? 20);
  pausaAte.set(jogador.id, system.currentTick + dura + MINIMAPA.pausaPorTitulo);
  ultimo.delete(jogador.id);
  jogador.onScreenDisplay.setTitle(titulo, opcoes);
}

function tipoDoChunk(cx: number, cz: number, semente: number, nave: [number, number], plano: boolean): number {
  const chave = `${cx},${cz}`;
  const salvo = tipos.get(chave);
  if (salvo !== undefined) return salvo;
  let tipo = AREIA; // mundo normal (add-on fora do mundo plano): o relevo e as estruturas não existem
  if (plano && cx === nave[0] && cz === nave[1]) tipo = NAVE;
  else if (plano) {
    const cidade = cidadeDoChunk(cx, cz, semente, nave);
    const rara = cidade ? undefined : raraDoChunk(cx, cz, semente, nave);
    if (cidade) tipo = cidade.dist === 0 ? TORRE : CIDADE;
    else if (rara) tipo = rara.tipo === "templo" ? TEMPLO : DESTROCOS;
    else {
      const centro = { x: nave[0] * 16 + 8, z: nave[1] * 16 + 8 };
      let alta = 0;
      for (const [dx, dz] of [[4, 4], [12, 4], [4, 12], [12, 12], [8, 8]]) alta = Math.max(alta, alturaDuna(cx * 16 + dx, cz * 16 + dz, semente, centro));
      tipo = alta === 0 ? AREIA : alta <= 4 ? DUNA_BAIXA : DUNA_ALTA;
    }
  }
  if (tipos.size > 50000) tipos.clear();
  tipos.set(chave, tipo);
  return tipo;
}

/** Índice da seta (0 = norte, no sentido horário) para a rotação do jogador. */
function seta(jogador: Player): number {
  const rumo = (((jogador.getRotation().y + 180) % 360) + 360) % 360; // 0 = norte, 90 = leste
  return Math.round(rumo / 45) % 8;
}

export function desenharMinimapa(jogador: Player): string {
  const semente = sementeDoMundo();
  const nave = chunkDaNave() ?? [0, 0];
  const plano = world.getDynamicProperty(PROPS.tipoMundo) === "plano";
  const { x, z } = jogador.location;
  const pcx = Math.floor(x / 16), pcz = Math.floor(z / 16);
  const r = MINIMAPA.raio;
  const linhas: string[] = ["§7N§r"];
  for (let cz = pcz - r; cz <= pcz + r; cz++) {
    let linha = "";
    for (let cx = pcx - r; cx <= pcx + r; cx++) {
      if (cx === pcx && cz === pcz) {
        linha += G(SETA + seta(jogador));
        continue;
      }
      const chave = `${cx},${cz}`;
      let visto = conhecidos.has(chave);
      if (!visto && jogador.dimension.isChunkLoaded({ x: cx * 16 + 8, y: MUNDO_PLANO.superficieY, z: cz * 16 + 8 })) {
        conhecidos.add(chave);
        visto = true;
      }
      linha += G(visto ? tipoDoChunk(cx, cz, semente, nave, plano) : DESCONHECIDO);
    }
    linhas.push(linha);
  }
  linhas.push(`§7${Math.floor(x)}, ${Math.floor(z)}§r`);
  return MARCA + linhas.join("\n");
}

function atualizar(jogador: Player): void {
  const id = jogador.id;
  const agora = system.currentTick;
  const desligado = !!jogador.getDynamicProperty(PROPS.minimapaDesligado);
  const foraDoMundo = jogador.dimension.id !== "minecraft:overworld";
  if (desligado || foraDoMundo) {
    if (ultimo.has(id)) {
      ultimo.delete(id);
      try {
        jogador.runCommand("title @s clear");
      } catch {
        jogador.onScreenDisplay.setTitle(" ", { fadeInDuration: 0, stayDuration: 1, fadeOutDuration: 0 });
      }
    }
    return;
  }
  if ((pausaAte.get(id) ?? 0) > agora) return;
  const texto = desenharMinimapa(jogador);
  const antes = ultimo.get(id);
  if (antes && antes.texto === texto && agora - antes.tick < MINIMAPA.reenviarTicks) return;
  jogador.onScreenDisplay.setTitle(texto, { fadeInDuration: 0, stayDuration: 60, fadeOutDuration: 0 });
  ultimo.set(id, { texto, tick: agora });
}

/** Liga ou desliga o minimapa do jogador (comando /cl:mapa). */
export function alternarMinimapa(jogador: Player): void {
  const desligar = !jogador.getDynamicProperty(PROPS.minimapaDesligado);
  jogador.setDynamicProperty(PROPS.minimapaDesligado, desligar);
  jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: desligar ? "cl.mapa.desligado" : "cl.mapa.ligado" }] });
}

export function registrarMinimapa(): void {
  world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    ultimo.delete(playerId);
    pausaAte.delete(playerId);
  });
  system.runInterval(() => {
    for (const jogador of world.getPlayers()) atualizar(jogador);
  }, MINIMAPA.intervaloTicks);
}

import { Player, RawMessage, TitleDisplayOptions, system, world } from "@minecraft/server";
import { MINIMAPA, PROPS } from "../config.js";
import { cidadeDoChunk } from "../mundo/cidade.js";
import { alturaDuna } from "../mundo/dunas.js";
import { raraDoChunk } from "../mundo/raras.js";
import { chunkDaNave, sementeDoMundo } from "../util/aleatorio.js";

/*
 * Minimapa na tela, no canto superior direito: redondo, norte para cima, cada quadradinho com
 * MINIMAPA.celula blocos de lado. O Bedrock não deixa o script desenhar na tela, então o mapa vai
 * como TÍTULO (começando com a marca MARCA) e a hora e as coordenadas como SUBTÍTULO. O
 * RP/ui/hud_screen.json mostra esse título num painel pequeno no canto e esconde o título grande.
 * Os quadradinhos são caracteres de uma fonte própria (RP/font/glyph_E8.png, gerada por
 * tools/gerar-texturas.mjs; os índices estão explicados lá).
 * - Já carregado: areia (mais escura nas dunas mais altas, com sombra no lado sul/leste delas),
 *   cidade, torre, templo, destroços, nave. Linhas finas marcam as bordas dos chunks.
 * - Nunca carregado nesta sessão: escuro.
 * - Você: a seta no meio, apontando para onde olha. N, L, S, O no anel.
 * Títulos de verdade (horda, tempestade...) vão por mostrarTitulo(), que pausa o mapa enquanto aparecem.
 * /cl:mapa liga e desliga. Custo: ~170 consultas "chunk carregado?" por jogador a cada 5 ticks.
 */
export const MARCA = "clmapa:";
const G = (i: number) => String.fromCharCode(0xe800 + i);
// Bases da fonte (cada uma com 3 luzes x 4 linhas de grade = 12 caracteres).
const DESCONHECIDO = 0, AREIA = 1, CIDADE = 7, TORRE = 8, TEMPLO = 9, DESTROCOS = 10, NAVE = 11;
const VAZIO = 144, ANEL = 145, LETRA = { N: 146, L: 147, S: 148, O: 149 }, SETA = 150;

const tipos = new Map<string, number>(); // quadradinho -> base * 3 + luz (não muda; depende só da semente)
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

// Altura da duna -> 0 (planície) a 5 (crista alta).
const nivel = (h: number) => (h <= 0 ? 0 : Math.min(5, Math.ceil(h / 2)));

/** Base e luz do quadradinho que começa em (x0, z0). */
function tipoDaCelula(x0: number, z0: number, semente: number, nave: [number, number], plano: boolean): number {
  const chave = `${x0},${z0}`;
  const salvo = tipos.get(chave);
  if (salvo !== undefined) return salvo;
  const cx = Math.floor(x0 / 16), cz = Math.floor(z0 / 16);
  let base = AREIA, luz = 0; // mundo normal (add-on fora do mundo plano): o relevo e as estruturas não existem
  if (plano && cx === nave[0] && cz === nave[1]) base = NAVE;
  else if (plano) {
    const cidade = cidadeDoChunk(cx, cz, semente, nave);
    const rara = cidade ? undefined : raraDoChunk(cx, cz, semente, nave);
    if (cidade) base = cidade.dist === 0 ? TORRE : CIDADE;
    else if (rara) base = rara.tipo === "templo" ? TEMPLO : DESTROCOS;
    else {
      const centro = { x: nave[0] * 16 + 8, z: nave[1] * 16 + 8 };
      const c = MINIMAPA.celula, m = c / 2;
      const h = alturaDuna(x0 + m, z0 + m, semente, centro);
      const noroeste = alturaDuna(x0 + m - c, z0 + m - c, semente, centro);
      base = AREIA + nivel(h);
      luz = h - noroeste >= 1 ? 1 : noroeste - h >= 1 ? 2 : 0; // luz vinda do noroeste
    }
  }
  const tipo = base * 3 + luz;
  if (tipos.size > 50000) tipos.clear();
  tipos.set(chave, tipo);
  return tipo;
}

/** Índice da seta (0 = norte, no sentido horário) para a rotação do jogador. */
function seta(jogador: Player): number {
  const rumo = (((jogador.getRotation().y + 180) % 360) + 360) % 360; // 0 = norte, 90 = leste
  return Math.round(rumo / 45) % 8;
}

/** Hora do jogo (0 = 6:00) e se é dia. */
function relogio(): { texto: string; dia: boolean } {
  const t = world.getTimeOfDay();
  const minutos = Math.floor(((t / 1000 + 6) % 24) * 60);
  const texto = `${String(Math.floor(minutos / 60)).padStart(2, "0")}:${String(minutos % 60).padStart(2, "0")}`;
  return { texto, dia: t < 12542 || t > 23460 };
}

/** O mapa (título) e a linha de baixo (subtítulo) do jogador. */
export function desenharMinimapa(jogador: Player): { mapa: string; info: RawMessage; chave: string } {
  const semente = sementeDoMundo();
  const nave = chunkDaNave() ?? [0, 0];
  const plano = world.getDynamicProperty(PROPS.tipoMundo) === "plano";
  const { x, z } = jogador.location;
  const c = MINIMAPA.celula, r = MINIMAPA.raio, borda = r + 1;
  const pix = Math.floor(x / c), piz = Math.floor(z / c);
  const linhas: string[] = [];
  for (let dz = -borda; dz <= borda; dz++) {
    let linha = "";
    for (let dx = -borda; dx <= borda; dx++) {
      const d = Math.hypot(dx, dz);
      if (d > r + 1.5) linha += G(VAZIO);
      else if (d > r + 0.5) {
        const letra = dx === 0 && dz === -borda ? "N" : dx === borda && dz === 0 ? "L" : dx === 0 && dz === borda ? "S" : dx === -borda && dz === 0 ? "O" : undefined;
        linha += G(letra ? LETRA[letra] : ANEL);
      } else if (dx === 0 && dz === 0) linha += G(SETA + seta(jogador));
      else {
        const ix = pix + dx, iz = piz + dz;
        const x0 = ix * c, z0 = iz * c;
        const chunk = `${Math.floor(x0 / 16)},${Math.floor(z0 / 16)}`;
        let visto = conhecidos.has(chunk);
        if (!visto && jogador.dimension.isChunkLoaded({ x: x0, y: 0, z: z0 })) {
          conhecidos.add(chunk);
          visto = true;
        }
        const grade = (z0 % 16 === 0 ? 1 : 0) + (x0 % 16 === 0 ? 2 : 0); // borda de chunk em cima / à esquerda
        const tipo = visto ? tipoDaCelula(x0, z0, semente, nave, plano) : DESCONHECIDO * 3;
        linha += G(Math.floor(tipo / 3) * 12 + (tipo % 3) * 4 + grade);
      }
    }
    linhas.push(linha);
  }
  const hora = relogio();
  const coords = `x: ${Math.floor(x)}, z: ${Math.floor(z)}`;
  const info: RawMessage = { rawtext: [{ text: `${hora.texto} ` }, { translate: hora.dia ? "cl.mapa.dia" : "cl.mapa.noite" }, { text: `\n${coords}` }] };
  const mapa = MARCA + linhas.join("\n");
  return { mapa, info, chave: `${mapa}|${hora.texto}|${coords}` };
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
  const { mapa, info, chave } = desenharMinimapa(jogador);
  const antes = ultimo.get(id);
  if (antes && antes.texto === chave && agora - antes.tick < MINIMAPA.reenviarTicks) return;
  jogador.onScreenDisplay.setTitle(mapa, { subtitle: info, fadeInDuration: 0, stayDuration: 60, fadeOutDuration: 0 });
  ultimo.set(id, { texto: chave, tick: agora });
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

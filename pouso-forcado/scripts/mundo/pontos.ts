import { Player, system, world } from "@minecraft/server";
import { PROPS } from "../config.js";
import { registrarAcao } from "../missoes/progresso.js";
import { Acao } from "../missoes/lista.js";
import { cidadeMaisProxima } from "./cidade.js";

/*
 * Lugares para achar (missões de exploração): masmorras e destroços ficam guardados em
 * PROPS.pontos quando são gerados; cidades são calculadas (cidade.ts), sem guardar nada.
 * A cada 2 s, quem ENTRA num lugar ganha o progresso (sair e voltar conta de novo, para a
 * missão poder ser feita depois). A mensagem "você achou..." só aparece na primeira vez.
 */
type Ponto = { t: Acao; x: number; y: number; z: number; r: number };
const dentro = new Map<string, Set<string>>(); // jogador → lugares onde ele está agora

function lerPontos(): Ponto[] {
  const v = world.getDynamicProperty(PROPS.pontos);
  try {
    return typeof v === "string" ? (JSON.parse(v) as Ponto[]) : [];
  } catch {
    return [];
  }
}

/** Guarda um lugar novo (os mais antigos saem depois de 120). */
export function registrarPonto(t: Acao, x: number, y: number, z: number, r: number): void {
  const lista = lerPontos();
  lista.push({ t, x: Math.floor(x), y: Math.floor(y), z: Math.floor(z), r });
  world.setDynamicProperty(PROPS.pontos, JSON.stringify(lista.slice(-120)));
}

function primeiraVez(jogador: Player, chave: string): boolean {
  let lista: string[] = [];
  try {
    lista = JSON.parse((jogador.getDynamicProperty(PROPS.visitados) as string) ?? "[]");
  } catch {
    // começa vazio
  }
  if (lista.includes(chave)) return false;
  lista.push(chave);
  jogador.setDynamicProperty(PROPS.visitados, JSON.stringify(lista.slice(-200)));
  return true;
}

function entrou(jogador: Player, chave: string, tipos: Acao[]): void {
  const agora = dentro.get(jogador.id) ?? new Set<string>();
  dentro.set(jogador.id, agora);
  if (agora.has(chave)) return;
  agora.add(chave);
  for (const t of tipos) registrarAcao(jogador, t);
  if (primeiraVez(jogador, chave)) {
    jogador.sendMessage({ rawtext: [{ text: "§6[Diário de Bordo]§r " }, { translate: `cl.ponto.${tipos[tipos.length - 1]}` }] });
    jogador.playSound("random.orb");
  }
}

export function registrarPontos(): void {
  system.runInterval(() => {
    const pontos = lerPontos();
    for (const jogador of world.getPlayers()) {
      if (jogador.dimension.id !== "minecraft:overworld") continue;
      const { x, y, z } = jogador.location;
      const estou = new Set<string>();
      for (const p of pontos) {
        if (Math.hypot(x - p.x, y - p.y, z - p.z) > p.r) continue;
        const chave = `${p.t}:${p.x},${p.y},${p.z}`;
        estou.add(chave);
        entrou(jogador, chave, p.t === "masmorra_funda" ? ["masmorra", "masmorra_funda"] : [p.t]);
      }
      const cidade = cidadeMaisProxima(x, z);
      if (cidade && cidade.distancia <= cidade.raioBlocos) {
        const chave = `cidade:${cidade.x},${cidade.z}`;
        estou.add(chave);
        entrou(jogador, chave, ["cidade"]);
      }
      // Quem saiu de um lugar pode entrar de novo depois.
      const antes = dentro.get(jogador.id);
      if (antes) for (const c of [...antes]) if (!estou.has(c)) antes.delete(c);
    }
  }, 40);
}

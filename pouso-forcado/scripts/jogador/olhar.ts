import { Block, Entity, Player, RawMessage } from "@minecraft/server";
import { COMPOSTOR_CHEIO, CONDENSADOR_AVANCADO, ENERGIA, IDS, OLHAR, PENEIRA_TOQUES } from "../config.js";
import { CONTEUDOS } from "../blocos/barril.js";
import { resumoCadinho } from "../blocos/cadinho.js";
import { origemDe } from "../catalogo/catalogo.js";
import { rf } from "../util/energia.js";
import { olharLigado } from "./opcoes.js";

/*
 * "O que estou olhando" (no estilo do WAILA): nome do bloco ou do bicho na mira, de que "mod"
 * ele é e um detalhe (energia da bateria, combustível, progresso, vida, crescimento da planta).
 * Vai numa linha da barra de ação, junto com o painel (hud.ts), uma vez por segundo.
 * Custo: dois raios (entidade e bloco) por jogador por segundo. Desliga nas Opções do Diário.
 */

function estado<T extends string | number | boolean>(b: Block, nome: string): T | undefined {
  try {
    return b.permutation.getState(nome as never) as T | undefined;
  } catch {
    return undefined;
  }
}

function detalheBloco(b: Block): RawMessage | undefined {
  switch (b.typeId) {
    case IDS.bateria:
      return { translate: "cl.olhar.energia", with: [rf(estado<number>(b, "cl:carga") ?? 0), rf(ENERGIA.bateriaMax)] };
    case IDS.gerador:
      return { translate: "cl.olhar.combustivel", with: [rf((estado<number>(b, "cl:combustivel") ?? 0) * ENERGIA.geradorPorCiclo)] };
    case IDS.montadora:
      return { translate: "cl.olhar.progresso", with: [rf(estado<number>(b, "cl:progresso") ?? 0)] };
    case IDS.compostor:
      return estado<boolean>(b, "cl:pronto")
        ? { translate: "cl.olhar.pronto" }
        : { translate: "cl.olhar.compostor", with: [String(estado<number>(b, "cl:nivel") ?? 0), String(COMPOSTOR_CHEIO)] };
    case IDS.condensadorAgua:
      return { translate: estado<boolean>(b, "cl:cheio") ? "cl.olhar.cheio" : "cl.olhar.condensando" };
    case IDS.peneira: {
      const t = estado<number>(b, "cl:progresso") ?? 0;
      return (estado<number>(b, "cl:carga") ?? 0) > 0 ? { translate: "cl.olhar.peneirando", with: [String(t), String(PENEIRA_TOQUES)] } : undefined;
    }
    case IDS.barrilMadeira:
    case IDS.barrilPedra: {
      const c = CONTEUDOS[estado<number>(b, "cl:conteudo") ?? 0];
      if (c === "composto") return { translate: "cl.olhar.compostando", with: [`${Math.round(((estado<number>(b, "cl:nivel") ?? 0) / 8) * 100)}%`] };
      return { translate: `cl.olhar.barril_${c}` };
    }
    case IDS.cadinho:
      return resumoCadinho(b);
    case IDS.folhaInfestada:
      return { translate: "cl.olhar.infestada", with: [`${(estado<number>(b, "cl:infest") ?? 0) * 10}%`] };
    case IDS.condensadorAvancado:
      return { translate: "cl.olhar.baldes", with: [String(estado<number>(b, "cl:nivel") ?? 0), String(CONDENSADOR_AVANCADO.capacidade)] };
  }
  const idade = estado<number>(b, "growth");
  if (idade !== undefined) return { translate: "cl.olhar.crescimento", with: [`${Math.round((idade / 7) * 100)}%`] };
  return undefined;
}

function linhaEntidade(e: Entity): RawMessage {
  const vida = e.getComponent("minecraft:health");
  const partes: RawMessage[] = [{ text: "§f" }, e.nameTag ? { text: e.nameTag } : { translate: e.localizationKey }];
  if (vida) partes.push({ text: `  §c${Math.ceil(vida.currentValue)}/${Math.ceil(vida.effectiveMax)} ` }, { translate: "cl.olhar.vida" });
  partes.push({ text: `  §9§o${origemDe(e.typeId)}` });
  return { rawtext: partes };
}

/** A linha do "o que estou olhando", ou undefined se não há nada na mira (ou se está desligado). */
export function linhaOlhar(jogador: Player): RawMessage | undefined {
  if (!olharLigado(jogador)) return undefined;
  try {
    const alvo = jogador.getEntitiesFromViewDirection({ maxDistance: OLHAR.distanciaEntidade })[0]?.entity;
    if (alvo?.isValid) return linhaEntidade(alvo);
    const b = jogador.getBlockFromViewDirection({ maxDistance: OLHAR.distanciaBloco })?.block;
    if (!b || b.isAir || b.isLiquid) return undefined;
    const partes: RawMessage[] = [{ text: "§f" }, { translate: b.localizationKey }];
    const detalhe = detalheBloco(b);
    if (detalhe) partes.push({ text: "  §b" }, detalhe);
    partes.push({ text: `  §9§o${origemDe(b.typeId)}` });
    return { rawtext: partes };
  } catch {
    return undefined; // mira fora do mundo carregado
  }
}

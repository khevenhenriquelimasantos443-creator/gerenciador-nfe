import { CommandPermissionLevel, CustomCommandRegistry, CustomCommandStatus, Player, system } from "@minecraft/server";
import { cidadeMaisProxima } from "../mundo/cidade.js";
import { raraMaisProxima } from "../mundo/raras.js";
import { chunkDaNave, sementeDoMundo } from "../util/aleatorio.js";

/*
 * Comandos de localização, sem precisar de trapaças:
 *   /cl:cidade     cidade abandonada mais perto
 *   /cl:templo     templo soterrado mais perto
 *   /cl:destrocos  destroços de nave mais perto
 * (o jogo também aceita sem o "cl:", se nenhum outro comando tiver o mesmo nome)
 * Mostra no chat as coordenadas, a distância e a direção (norte = z menor, leste = x maior).
 * O comando roda em modo restrito, então a resposta vai no próximo tick (system.run).
 */
type Alvo = { x: number; z: number; distancia: number } | undefined;

function direcao(dx: number, dz: number): string {
  const ns = dz < -0.4 * Math.abs(dx) ? "cl.direcao.norte" : dz > 0.4 * Math.abs(dx) ? "cl.direcao.sul" : "";
  const lo = dx > 0.4 * Math.abs(dz) ? "cl.direcao.leste" : dx < -0.4 * Math.abs(dz) ? "cl.direcao.oeste" : "";
  return ns && lo ? `${ns}_${lo.split(".").pop()}` : ns || lo || "cl.direcao.aqui";
}

function responder(jogador: Player, nome: string, alvo: Alvo): void {
  if (!alvo) {
    jogador.sendMessage({ translate: "cl.comando.nada", with: { rawtext: [{ translate: nome }] } });
    return;
  }
  const { x, z } = jogador.location;
  jogador.sendMessage({
    translate: "cl.comando.achou",
    with: {
      rawtext: [
        { translate: nome },
        { text: String(Math.round(alvo.x)) },
        { text: String(Math.round(alvo.z)) },
        { text: String(Math.round(alvo.distancia)) },
        { translate: direcao(alvo.x - x, alvo.z - z) },
      ],
    },
  });
}

export function registrarComandos(registro: CustomCommandRegistry): void {
  const comandos: Array<[string, string, (j: Player) => Alvo]> = [
    ["cl:cidade", "cl.comando.cidade", (j) => cidadeMaisProxima(j.location.x, j.location.z)],
    ["cl:templo", "cl.comando.templo", (j) => perto("templo", j)],
    ["cl:destrocos", "cl.comando.destrocos", (j) => perto("destrocos", j)],
  ];
  for (const [nome, rotulo, achar] of comandos) {
    registro.registerCommand(
      { name: nome, description: `Pouso Forçado: mostra onde fica o lugar mais perto (${nome.slice(3)})`, permissionLevel: CommandPermissionLevel.Any, cheatsRequired: false },
      (origem) => {
        const jogador = origem.sourceEntity;
        if (!(jogador instanceof Player)) return { status: CustomCommandStatus.Failure, message: "Use como jogador." };
        system.run(() => responder(jogador, rotulo, achar(jogador)));
        return { status: CustomCommandStatus.Success };
      },
    );
  }
}

function perto(tipo: "templo" | "destrocos", j: Player): Alvo {
  const nave = chunkDaNave();
  if (!nave) return undefined;
  return raraMaisProxima(tipo, j.location.x, j.location.z, sementeDoMundo(), nave);
}

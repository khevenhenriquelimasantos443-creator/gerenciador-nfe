import { BiomeTypes, Player } from "@minecraft/server";
import { BIOMAS_DESERTO, VERSAO } from "../config.js";

// Linha cinza no chat ao entrar: mostra se o jogo aceitou os biomas do add-on
// e em que bioma o jogador está. Serve para testar no celular sem o log de conteúdo.
export function mostrarDiagnostico(jogador: Player): void {
  const biomas = BIOMAS_DESERTO.map((id) => `${id}=${BiomeTypes.get(id) ? "ok" : "NÃO CARREGOU"}`).join(", ");
  let aqui = "?";
  try {
    aqui = jogador.dimension.getBiome(jogador.location).id;
  } catch (erro) {
    aqui = `erro: ${erro}`;
  }
  jogador.sendMessage(`§7[Pouso Forçado ${VERSAO}] biomas: ${biomas} | bioma aqui: ${aqui}`);
}

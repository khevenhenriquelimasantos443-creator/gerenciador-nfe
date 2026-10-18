import { BiomeTypes, BlockTypes, ItemTypes, Player, world } from "@minecraft/server";
import { BIOMAS_DESERTO, IDS, VERSAO } from "../config.js";

// Linha cinza no chat ao entrar: mostra se o jogo aceitou os biomas do add-on
// em que bioma o jogador está e a luz nos pés dele. Serve para testar no celular sem o log de conteúdo.
export function mostrarDiagnostico(jogador: Player): void {
  const biomas = BIOMAS_DESERTO.map((id) => `${id}=${BiomeTypes.get(id) ? "ok" : "NÃO CARREGOU"}`).join(", ");
  let aqui = "?";
  try {
    aqui = jogador.dimension.getBiome(jogador.location).id;
  } catch (erro) {
    aqui = `erro: ${erro}`;
  }
  let luz = "?";
  try {
    const pes = jogador.location;
    luz = `céu ${jogador.dimension.getSkyLightLevel(pes)}, total ${jogador.dimension.getLightLevel(pes)}`;
  } catch (erro) {
    luz = `erro: ${erro}`;
  }
  // Blocos/itens do pack que o jogo não carregou (JSON recusado): aparecem em vermelho.
  const faltando = Object.values(IDS).filter((id) => !BlockTypes.get(id) && !ItemTypes.get(id));
  if (faltando.length > 0) jogador.sendMessage(`§c[Pouso Forçado] o jogo não carregou: ${faltando.join(", ")}`);
  jogador.sendMessage(`§7[Pouso Forçado ${VERSAO}] biomas: ${biomas} | bioma aqui: ${aqui} | luz: ${luz} | hora: ${world.getTimeOfDay()}`);
}

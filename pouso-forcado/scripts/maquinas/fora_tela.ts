/*
 * Blocos que ficam sem a tela da máquina (1.55.0) e sem os espaços (1.57.0).
 */
// Blocos do conteúdo em que o toque com a mão vazia já é uma ação (girar a manivela, depositar experiência, ligar o
// carregador de chunks, o baú do tesouro trancado...) ou que são baú, barril, tanque ou enfeite: ficam sem a tela.
export const FORA = new Set<string>([
  "cl:caixa_entrega", "cl:estrutura_maquina", "cl:chassi_maquina", "cl:bloco_maquina", "cl:chassi_almas", "cl:barril_armazenamento", "cl:bau_me",
  "cl:drive_me", "cl:bau_tesouro", "cl:bau_vacuo", "cl:obelisco_xp", "cl:vacuo_xp", "cl:carregador_chunks", "cl:carregador_pontual",
  "cl:ancora_viagem", "cl:esteira", "cl:esteira_animal", "cl:tanque_fluido", "cl:tanque_fluido_pressurizado", "cl:alarme_industrial",
  "cl:manivela", "cl:roda_dagua", "cl:rolamento_moinho", "cl:controlador_velocidade", "cl:mo", "cl:rodas_trituradoras", "cl:prensa_mecanica",
  "cl:misturador_mecanico", "cl:ventilador", "cl:furadeira", "cl:barril_residuos_radioativos",
]);

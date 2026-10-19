import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { PROPS } from "../config.js";

/*
 * Opções do jogador (aberto pelo Diário): liga/desliga o "o que estou olhando" na barra de ação
 * e o reabastecimento automático da mão. Salvo em dynamic properties do jogador.
 */
export const olharLigado = (j: Player): boolean => !j.getDynamicProperty(PROPS.olharDesligado);
export const reabastecerLigado = (j: Player): boolean => !j.getDynamicProperty(PROPS.reabastecerDesligado);

export async function abrirOpcoes(jogador: Player): Promise<void> {
  const r = await new ModalFormData()
    .title({ translate: "cl.opcoes.titulo" })
    .toggle({ translate: "cl.opcoes.olhar" }, { defaultValue: olharLigado(jogador) })
    .toggle({ translate: "cl.opcoes.reabastecer" }, { defaultValue: reabastecerLigado(jogador) })
    .show(jogador);
  if (r.canceled || !r.formValues) return;
  jogador.setDynamicProperty(PROPS.olharDesligado, r.formValues[0] ? undefined : true);
  jogador.setDynamicProperty(PROPS.reabastecerDesligado, r.formValues[1] ? undefined : true);
}

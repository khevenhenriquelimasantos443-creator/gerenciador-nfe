import { Player } from "@minecraft/server";

const abertos = new Set<string>(); // evita abrir dois menus se o jogador tocar várias vezes

/** Abre um menu sem deixar o jogador abrir dois ao mesmo tempo. */
export function abrirUmMenu(jogador: Player, abrir: () => Promise<void>): void {
  if (abertos.has(jogador.id)) return;
  abertos.add(jogador.id);
  abrir()
    .catch((erro) => console.warn(`[Pouso Forçado] menu: ${erro}`))
    .finally(() => abertos.delete(jogador.id));
}

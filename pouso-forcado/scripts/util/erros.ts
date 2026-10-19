import { world } from "@minecraft/server";

// Erros aparecem uma vez por sessão no chat (no celular não dá para ver o log de conteúdo).
const avisados = new Set<string>();

export function avisarErro(onde: string, erro: unknown): void {
  if (avisados.has(onde)) return;
  avisados.add(onde);
  console.warn(`[Pouso Forçado] ${onde}: ${erro}`);
  world.sendMessage(`§c[Pouso Forçado] erro (${onde}): ${erro}`);
}

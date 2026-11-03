/*
 * Níveis da mochila (1.25.0), os do Sophisticated Backpacks 3.26 (o mais novo; Config.java): Couro 27 espaços e 1
 * melhoria, Cobre 45 e 1, Ferro 54 e 2, Ouro 81 e 3, Diamante 108 e 5, Netherite 120 e 7. O Bedrock mostra 27 espaços
 * por vez, então a mochila aberta tem páginas de 27 (agachado + tocar troca de página). Subir de nível: tocar a mochila
 * aberta com o material na mão (8 lingotes de cobre, 4 de ferro, 8 de ouro, 8 diamantes, 1 lingote de netherita), como a
 * receita do SB (que no Bedrock perderia o que está dentro).
 */
export type Nivel = { espacos: number; melhorias: number; prox?: string; material?: string; qtd?: number };
export const NIVEIS: Readonly<Record<string, Nivel>> = {
  "cl:mochila": { espacos: 27, melhorias: 1, prox: "cl:mochila_cobre", material: "minecraft:copper_ingot", qtd: 8 },
  "cl:mochila_cobre": { espacos: 45, melhorias: 1, prox: "cl:mochila_ferro", material: "minecraft:iron_ingot", qtd: 4 },
  "cl:mochila_ferro": { espacos: 54, melhorias: 2, prox: "cl:mochila_ouro", material: "minecraft:gold_ingot", qtd: 8 },
  "cl:mochila_ouro": { espacos: 81, melhorias: 3, prox: "cl:mochila_diamante", material: "minecraft:diamond", qtd: 8 },
  "cl:mochila_diamante": { espacos: 108, melhorias: 5, prox: "cl:mochila_netherite", material: "minecraft:netherite_ingot", qtd: 1 },
  "cl:mochila_netherite": { espacos: 120, melhorias: 7 },
};
export const ehMochila = (id: string | undefined): boolean => !!id && NIVEIS[id] !== undefined;
export const espacosDe = (id: string): number => NIVEIS[id]?.espacos ?? 27;
export const POR_PAGINA = 27;
export const paginasDe = (id: string): number => Math.ceil(espacosDe(id) / POR_PAGINA);

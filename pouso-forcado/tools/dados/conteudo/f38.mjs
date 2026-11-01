// Fase 38 (1.15.0): geração natural do mundo normal. Marcos que a estrutura posta pelo jogo traz por dentro: no
// primeiro tick (com o chunk carregado perto de alguém) o marco guarda o lugar para as missões de exploração
// (scripts/mundo/pontos.ts) e vira ar. As features e as estruturas são de tools/gerar-geracao.py.
const marco = (id, pt, en) => ({ id, pt, en, tipo: "cubo", cor: "#6b6b6b", padrao: "rachado", dureza: 1, girar: false, comp: "cl:marco_ponto", tick: 20, loot: "loot_tables/empty.json", menu: "none" });

export default {
  fase: 38,
  mod: "Pouso Forçado",
  blocos: [
    marco("marco_masmorra", "Marco de Masmorra", "Dungeon Marker"),
    marco("marco_masmorra_funda", "Marco de Masmorra Funda", "Deep Dungeon Marker"),
    marco("marco_destrocos", "Marco de Destroços", "Wreck Marker"),
  ],
};

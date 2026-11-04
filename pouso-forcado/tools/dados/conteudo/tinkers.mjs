// Tabelas do Tinkers' Construct usadas pelas Fases 15 e 16 (e pela 45, a do Tinkers completo).
// 1.6.4 (+ Iguana Tweaks) no começo; 1.24.0 com os números do TC3; 1.26.0 (Tinkers completo, parte 1): tudo vem do
// Tinkers' Construct 3.12.1 (o mais novo), lido por tools/importar-tinkers3.py em tinkers3.json:
// - materiais: dur = durabilidade da cabeça, vel = velocidade de mineração (o item arredonda: o Bedrock só aceita
//   inteiro), dano = ataque da cabeça, nivel (madeira/ouro 0, pedra 1, ferro 2, diamante 3, netherita 4),
//   cabo = 1 + a durabilidade do cabo (multiplica a durabilidade), ligacao = serve de ligação, tracos = traços do mod;
// - peças: custo no Construtor de Peças e o tipo de número que usam (cabeça, cabo, ligação);
// - ferramentas: as peças (a primeira é a cabeça), os números base e os multiplicadores, os traços, a área e o que
//   quebram. O item é "ferramenta × material da cabeça"; o resto fica em propriedades do item (scripts/tinkers).
// IDs de antes continuam (cacto e obsidiana não são cabeça no TC3, mas as peças e ferramentas deles ficam; a Pá não
// existe no TC3 e fica para quem já tem).
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "tinkers3.json"), "utf8"));
const ANTIGOS = ["madeira", "pedra", "silex", "cacto", "osso", "obsidiana", "ferro", "cobre", "bronze", "aco", "ouro_rosa", "bronze_ametista"];
const PECAS_ANTIGAS = ["cabo", "ligacao", "cabeca_picareta", "cabeca_pa", "cabeca_machado", "lamina_espada", "guarda_larga", "travessa", "cabeca_martelo", "placa_grande", "cabo_resistente", "ligacao_resistente", "cabeca_machado_larga"];
const FERR_ANTIGAS = ["picareta", "pa", "machadinha", "espada_larga", "marreta", "escavadeira", "machado_largo"];

export const MATERIAIS = Object.fromEntries(
  Object.entries(D.materiais).map(([id, m]) => [
    id,
    {
      pt: m.pt, en: m.en, cor: m.cor, tier: m.tier, metal: m.metal, tracos: m.tracos, cabeca: m.cabeca, ligacao: m.ligacao,
      ...(m.cabeca ? { dur: m.dur, vel: m.vel, dano: m.dano, nivel: m.nivel } : {}),
      ...(m.cabo !== undefined ? { cabo: m.cabo } : {}),
    },
  ]),
);
// Peças: as do TC3 e as três que só o pack de antes tinha.
export const PECAS = {
  ...Object.fromEntries(Object.entries(D.pecas).map(([id, p]) => [id, { pt: p.pt, en: p.en, custo: p.custo, stat: p.stat }])),
  cabeca_pa: { pt: "Cabeça de Pá", en: "Shovel Head", custo: 2, stat: "head" },
  guarda_larga: { pt: "Guarda Larga", en: "Wide Guard", custo: 1, stat: "binding" },
  travessa: { pt: "Travessa", en: "Crossbar", custo: 1, stat: "binding" },
};
// Ferramentas: as do TC3 e a Pá do pack de antes.
const r = (v) => Math.round(v * 100) / 100;
export const FERRAMENTAS = {
  ...Object.fromEntries(
    Object.entries(D.ferramentas).map(([id, f]) => [
      id,
      {
        pt: f.pt, en: f.en, pecas: f.pecas, tags: f.tags, slot: f.slot, tracos: f.tracos,
        base: r(f.base.attack_damage ?? 0), mDano: r(f.mult.attack_damage ?? 1), dur: r(f.mult.durability ?? 1), vel: r(f.mult.mining_speed ?? 1),
        ...(f.area ? { area: f.area } : {}),
      },
    ]),
  ),
  pa: { pt: "Pá", en: "Shovel", pecas: ["cabeca_pa", "cabo"], tags: ["minecraft:is_shovel_item_destructible"], slot: "shovel", tracos: [], base: 1, mDano: 1, dur: 1, vel: 1 },
};
export const TRACOS = D.tracos;

/** A peça `p` de material `m` existe? (as de antes sempre; as novas se o material tem aquele tipo de número). */
export function pecaServe(p, m) {
  const d = MATERIAIS[m];
  if (ANTIGOS.includes(m) && PECAS_ANTIGAS.includes(p)) return true;
  if (["cabeca_pa", "guarda_larga", "travessa"].includes(p)) return false;
  const stat = PECAS[p].stat;
  if (["cacto", "obsidiana"].includes(m)) return false; // não são peça no TC3: só as de antes
  return stat === "head" ? d.cabeca : stat === "handle" ? d.cabo !== undefined : d.ligacao;
}
/** A ferramenta `f` com cabeça `m` existe? */
export function ferramentaServe(f, m) {
  if (ANTIGOS.includes(m) && FERR_ANTIGAS.includes(f)) return true;
  return f !== "pa" && !!MATERIAIS[m].cabeca && !["cacto", "obsidiana"].includes(m);
}
/** Dano do item (o que soma ao 1 do jogador): (base + ataque da cabeça) × multiplicador, como no TC3. */
export const danoDe = (f, m) => Math.max(1, Math.round((FERRAMENTAS[f].base + (MATERIAIS[m].dano ?? 0)) * FERRAMENTAS[f].mDano));

const de = (mat) => `de ${MATERIAIS[mat].pt}`;
export function itensDe(mats) {
  const itens = [];
  for (const mat of mats) {
    const m = MATERIAIS[mat];
    for (const [p, d] of Object.entries(PECAS))
      if (pecaServe(p, mat)) itens.push({ id: `peca_${p}_${mat}`, pt: `${d.pt} ${de(mat)}`, en: `${m.en} ${d.en}`, icone: `peca:${p}:${m.cor}` });
    for (const [f, d] of Object.entries(FERRAMENTAS)) {
      if (!ferramentaServe(f, mat)) continue;
      const vel = Math.max(1, Math.round((m.vel ?? 1) * d.vel));
      const comp = {
        "minecraft:hand_equipped": true,
        "minecraft:durability": { max_durability: 1000 },
        "minecraft:damage": danoDe(f, mat),
        "minecraft:enchantable": { slot: d.slot, value: 10 },
        "minecraft:digger": { use_efficiency: true, destroy_speeds: [...d.tags.map((t) => ({ block: { tags: `q.any_tag('${t}')` }, speed: vel })), ...(d.slot === "sword" ? [{ block: "minecraft:web", speed: 15 }] : [])] },
      };
      itens.push({ id: `${f}_${mat}`, pt: `${d.pt} ${de(mat)}`, en: `${m.en} ${d.en}`, icone: `ferramenta:${f}:${m.cor}`, pilha: 1, cat: "equipment", comp });
    }
  }
  return itens;
}
/** Para os scripts: que materiais fazem cada peça e cada ferramenta. */
export const PECA_MATS = Object.fromEntries(Object.keys(PECAS).map((p) => [p, Object.keys(MATERIAIS).filter((m) => pecaServe(p, m))]));
export const FERR_MATS = Object.fromEntries(Object.keys(FERRAMENTAS).map((f) => [f, Object.keys(MATERIAIS).filter((m) => ferramentaServe(f, m))]));

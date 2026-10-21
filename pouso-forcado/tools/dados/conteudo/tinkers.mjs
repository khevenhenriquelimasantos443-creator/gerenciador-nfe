// Tabelas do Tinkers' Construct 1.6.4 (+ Iguana Tweaks) usadas pelas Fases 15 e 16.
// dur = durabilidade da cabeça (TC), vel = velocidade (TC ÷ 100, inteiro no Bedrock), dano = ataque extra,
// nivel = nível de mineração (Iguana), cabo = multiplicador da durabilidade quando é o cabo.
export const MATERIAIS = {
  madeira: { pt: "Madeira", en: "Wood", dur: 97, vel: 3, dano: 0, nivel: 0, cabo: 1.0, cor: "#a07c48" },
  pedra: { pt: "Pedra", en: "Stone", dur: 131, vel: 4, dano: 1, nivel: 1, cabo: 0.5, cor: "#8c8c8c" },
  silex: { pt: "Sílex", en: "Flint", dur: 171, vel: 5, dano: 2, nivel: 1, cabo: 0.7, cor: "#55545e" },
  cacto: { pt: "Cacto", en: "Cactus", dur: 150, vel: 5, dano: 2, nivel: 1, cabo: 1.0, cor: "#4f8f3a" },
  osso: { pt: "Osso", en: "Bone", dur: 200, vel: 4, dano: 1, nivel: 1, cabo: 1.0, cor: "#e6dfc6" },
  obsidiana: { pt: "Obsidiana", en: "Obsidian", dur: 89, vel: 7, dano: 2, nivel: 3, cabo: 0.8, cor: "#3d2c5e" },
  ferro: { pt: "Ferro", en: "Iron", dur: 250, vel: 6, dano: 2, nivel: 2, cabo: 1.3, cor: "#d6d9dc", metal: true },
  cobre: { pt: "Cobre", en: "Copper", dur: 180, vel: 5, dano: 2, nivel: 1, cabo: 1.15, cor: "#d4743c", metal: true },
  bronze: { pt: "Bronze", en: "Bronze", dur: 350, vel: 7, dano: 2, nivel: 2, cabo: 1.3, cor: "#c8913a", metal: true },
  aco: { pt: "Aço", en: "Steel", dur: 750, vel: 10, dano: 4, nivel: 3, cabo: 1.3, cor: "#8797a6", metal: true },
};
// Peças: custo em itens do material no Construtor de Peças (ou em lingotes, na fundição).
export const PECAS = {
  cabo: { pt: "Cabo", en: "Tool Rod", custo: 1 },
  ligacao: { pt: "Ligação", en: "Binding", custo: 1 },
  cabeca_picareta: { pt: "Cabeça de Picareta", en: "Pickaxe Head", custo: 2 },
  cabeca_pa: { pt: "Cabeça de Pá", en: "Shovel Head", custo: 2 },
  cabeca_machado: { pt: "Cabeça de Machado", en: "Hatchet Head", custo: 2 },
  lamina_espada: { pt: "Lâmina de Espada", en: "Sword Blade", custo: 2 },
  guarda_larga: { pt: "Guarda Larga", en: "Wide Guard", custo: 1 },
  travessa: { pt: "Travessa", en: "Crossbar", custo: 1 },
};
// Ferramentas: peças (a primeira é a cabeça), dano base e o que quebram.
export const FERRAMENTAS = {
  picareta: { pt: "Picareta", en: "Pickaxe", pecas: ["cabeca_picareta", "ligacao", "cabo"], dano: 2, tag: "minecraft:is_pickaxe_item_destructible" },
  pa: { pt: "Pá", en: "Shovel", pecas: ["cabeca_pa", "cabo"], dano: 1, tag: "minecraft:is_shovel_item_destructible" },
  machadinha: { pt: "Machadinha", en: "Hatchet", pecas: ["cabeca_machado", "cabo"], dano: 3, tag: "minecraft:is_axe_item_destructible" },
  espada_larga: { pt: "Espada Larga", en: "Broadsword", pecas: ["lamina_espada", "guarda_larga", "cabo"], dano: 4 },
};

const de = (mat) => `de ${MATERIAIS[mat].pt}`;
export function itensDe(mats) {
  const itens = [];
  for (const mat of mats) {
    const m = MATERIAIS[mat];
    for (const [p, d] of Object.entries(PECAS))
      itens.push({ id: `peca_${p}_${mat}`, pt: `${d.pt} ${de(mat)}`, en: `${m.en} ${d.en}`, icone: `peca:${p}:${m.cor}` });
    for (const [f, d] of Object.entries(FERRAMENTAS)) {
      const comp = {
        "minecraft:hand_equipped": true,
        "minecraft:durability": { max_durability: 1000 },
        "minecraft:damage": d.dano + m.dano,
        "minecraft:enchantable": { slot: f === "espada_larga" ? "sword" : f === "pa" ? "shovel" : f === "machadinha" ? "axe" : "pickaxe", value: 10 },
      };
      if (d.tag) comp["minecraft:digger"] = { use_efficiency: true, destroy_speeds: [{ block: { tags: `q.any_tag('${d.tag}')` }, speed: m.vel }] };
      itens.push({ id: `${f}_${mat}`, pt: `${d.pt} ${de(mat)}`, en: `${m.en} ${d.en}`, icone: `ferramenta:${f}:${m.cor}`, pilha: 1, cat: "equipment", comp });
    }
  }
  return itens;
}

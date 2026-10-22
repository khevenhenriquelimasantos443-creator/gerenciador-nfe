// Gera scripts/catalogo/gerado.ts: os dados do Catálogo (estilo JEI) que o jogo não dá ao script.
// - Nomes (pt/en) e ícones de cada item do add-on e dos itens do jogo usados nas receitas e tabelas.
// - Receitas de bancada e fornalha (BP/recipes) e drops dos monstros do add-on (BP/loot_tables/cl).
// As tabelas das máquinas (peneira, montadora...) o Catálogo lê direto do config.ts.
// Nomes e ícones do jogo vêm dos arquivos oficiais (Mojang/bedrock-samples) em referencias/vanilla/,
// que fica fora do git; o resultado vai para tools/dados/vanilla.json (no git), então o build
// funciona sem eles. Roda antes do tsc (tools/build.mjs).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8").replace(/^\s*\/\/.*$/gm, ""));
const arquivos = (rel) => readdirSync(join(RAIZ, rel)).filter((n) => n.endsWith(".json")).map((n) => `${rel}/${n}`);

function lang(rel) {
  const mapa = {};
  for (const linha of readFileSync(join(RAIZ, rel), "utf8").split(/\r?\n/)) {
    const i = linha.indexOf("=");
    if (i > 0 && !linha.startsWith("#")) mapa[linha.slice(0, i)] = linha.slice(i + 1).replace(/\s*#.*$/, "").trim();
  }
  return mapa;
}

// ---------- receitas ----------
const ingrediente = (v) => (typeof v === "string" ? v : v.item ?? (v.tag ? `#${v.tag}` : "?"));
const receitas = [];
for (const rel of arquivos("BP/recipes")) {
  const j = lerJson(rel);
  const tipo = Object.keys(j).find((k) => k.startsWith("minecraft:recipe_"));
  const r = j[tipo];
  const id = r.description.identifier;
  const estacoes = r.tags ?? [];
  if (tipo === "minecraft:recipe_shaped") {
    const chaves = Object.fromEntries(Object.entries(r.key).map(([k, v]) => [k, ingrediente(v)]));
    receitas.push({ tipo: "bancada", id, resultado: ingrediente(r.result), qtd: r.result.count ?? 1, grade: r.pattern, chaves, estacoes });
  } else if (tipo === "minecraft:recipe_shapeless") {
    const soma = new Map();
    for (const v of r.ingredients) soma.set(ingrediente(v), (soma.get(ingrediente(v)) ?? 0) + (v.count ?? 1));
    const ingredientes = [...soma].map(([item, qtd]) => ({ item, qtd }));
    receitas.push({ tipo: "sem_forma", id, resultado: ingrediente(r.result), qtd: r.result.count ?? 1, ingredientes, estacoes });
  } else if (tipo === "minecraft:recipe_furnace") {
    receitas.push({ tipo: "fornalha", id, resultado: ingrediente(r.output), qtd: 1, ingredientes: [{ item: ingrediente(r.input), qtd: 1 }], estacoes });
  }
}

// ---------- drops dos monstros do add-on ----------
const drops = [];
for (const rel of arquivos("BP/loot_tables/cl")) {
  const fonte = `cl:${rel.split("/").pop().replace(".json", "")}`;
  for (const pool of lerJson(rel).pools ?? []) {
    const chance = pool.conditions?.find((c) => c.condition?.startsWith("random_chance"))?.chance ?? 1;
    for (const e of pool.entries ?? []) {
      if (e.type !== "item") continue;
      const n = e.functions?.find((f) => f.function === "set_count")?.count ?? 1;
      const [min, max] = typeof n === "number" ? [n, n] : [n.min, n.max];
      drops.push({ fonte, item: e.name, min, max, chance });
    }
  }
}

// ---------- itens do add-on ----------
const ptCl = lang("RP/texts/pt_BR.lang"), enCl = lang("RP/texts/en_US.lang");
const iconesItens = lerJson("RP/textures/item_texture.json").texture_data;
const terreno = lerJson("RP/textures/terrain_texture.json").texture_data;
const caminho = (t) => (typeof t === "string" ? t : Array.isArray(t) ? caminho(t[0]) : t?.path);
const itens = {};
for (const rel of arquivos("BP/items")) {
  const d = lerJson(rel)["minecraft:item"];
  const id = d.description.identifier;
  const ic = d.components["minecraft:icon"];
  const chave = typeof ic === "string" ? ic : ic?.texture ?? ic?.textures?.default;
  itens[id] = { pt: ptCl[`item.${id}.name`] ?? id, en: enCl[`item.${id}.name`] ?? id, icone: caminho(iconesItens[chave]?.textures) };
}
// Ícone de bloco: o desenhado à mão (arte/blocos, ver tools/importar-icones.py); senão o desenho 3D
// feito por tools/icones-blocos.py; sem ele, a textura de cima.
for (const rel of arquivos("BP/blocks")) {
  const d = lerJson(rel)["minecraft:block"];
  const id = d.description.identifier;
  const arte = `textures/items/cl/arte/blocos/${id.slice(3)}`;
  const desenho = existsSync(join(RAIZ, `RP/${arte}.png`)) ? arte : `textures/items/cl/blocos/${id.slice(3)}`;
  const mats = d.components["minecraft:material_instances"] ?? {};
  const icone = existsSync(join(RAIZ, `RP/${desenho}.png`)) ? desenho : caminho(terreno[(mats.up ?? mats["*"])?.texture]?.textures);
  itens[id] = { pt: ptCl[`tile.${id}.name`] ?? id, en: enCl[`tile.${id}.name`] ?? id, icone };
}

// ---------- itens do jogo citados pelo add-on ----------
const citados = new Set();
const procurar = (texto) => {
  for (const m of texto.matchAll(/"(minecraft:[a-z0-9_]+)"/g)) citados.add(m[1]);
};
for (const r of receitas) procurar(JSON.stringify(r));
for (const d of drops) citados.add(d.item);
for (const rel of ["scripts/config.ts", "scripts/missoes/lista.ts"]) procurar(readFileSync(join(RAIZ, rel), "utf8"));
for (const id of [...citados]) if (!id.startsWith("minecraft:")) citados.delete(id);

// Nomes e ícones que não seguem o padrão do ID.
const APELIDOS = {
  water_bucket: { lang: "item.bucketWater.name", icone: "textures/items/bucket_water" },
  lava_bucket: { lang: "item.bucketLava.name", icone: "textures/items/bucket_lava" },
  milk_bucket: { lang: "item.milk.name", icone: "textures/items/bucket_milk" },
  bucket: { icone: "textures/items/bucket_empty" },
  wheat_seeds: { lang: "item.wheat_seeds.name", icone: "textures/items/seeds_wheat" },
  beetroot_seeds: { lang: "item.beetroot_seeds.name", icone: "textures/items/seeds_beetroot" },
  pumpkin_seeds: { lang: "item.pumpkin_seeds.name", icone: "textures/items/seeds_pumpkin" },
  melon_seeds: { lang: "item.melon_seeds.name", icone: "textures/items/seeds_melon" },
  golden_apple: { lang: "item.golden_apple.name", icone: "textures/items/apple_golden" },
  enchanted_golden_apple: { lang: "item.appleEnchanted.name", icone: "textures/items/apple_golden" },
  potion: { lang: "potion.emptyPotion.name", icone: "textures/items/potion_bottle_drinkable" },
  glass_bottle: { lang: "item.glass_bottle.name", icone: "textures/items/potion_bottle_empty" },
  melon_slice: { lang: "item.melon.name", icone: "textures/items/melon" },
  bone_meal: { lang: "item.dye.white.name", icone: "textures/items/dye_powder_white" },
  lapis_lazuli: { lang: "item.dye.blue.name", icone: "textures/items/dye_powder_blue_new" },
  rotten_flesh: { lang: "item.rotten_flesh.name", icone: "textures/items/rotten_flesh" },
  name_tag: { lang: "item.name_tag.name", icone: "textures/items/name_tag" },
  clay_ball: { lang: "item.clay_ball.name", icone: "textures/items/clay_ball" },
  sugar_cane: { lang: "item.reeds.name", icone: "textures/items/reeds" },
  dried_kelp_block: { lang: "tile.dried_kelp_block.name", icone: "textures/blocks/dried_kelp_side_a" },
  deadbush: { lang: "tile.deadbush.name", icone: "textures/blocks/deadbush" },
  cactus: { lang: "tile.cactus.name", icone: "textures/blocks/cactus_side" },
  oak_log: { lang: "tile.log.oak.name", icone: "textures/blocks/log_oak" },
  birch_log: { lang: "tile.log.birch.name", icone: "textures/blocks/log_birch" },
  acacia_log: { lang: "tile.log.acacia.name", icone: "textures/blocks/log_acacia" },
  oak_planks: { lang: "tile.planks.oak.name", icone: "textures/blocks/planks_oak" },
  spruce_log: { lang: "tile.log.spruce.name", icone: "textures/blocks/log_spruce" },
  jungle_log: { lang: "tile.log.jungle.name", icone: "textures/blocks/log_jungle" },
  dark_oak_log: { lang: "tile.log.big_oak.name", icone: "textures/blocks/log_big_oak" },
  spruce_planks: { lang: "tile.planks.spruce.name", icone: "textures/blocks/planks_spruce" },
  jungle_planks: { lang: "tile.planks.jungle.name", icone: "textures/blocks/planks_jungle" },
  dark_oak_planks: { lang: "tile.planks.big_oak.name", icone: "textures/blocks/planks_big_oak" },
  green_dye: { lang: "item.dye.green.name", icone: "textures/items/dye_powder_green_new" },
  birch_planks: { lang: "tile.planks.birch.name", icone: "textures/blocks/planks_birch" },
  acacia_planks: { lang: "tile.planks.acacia.name", icone: "textures/blocks/planks_acacia" },
  oak_sapling: { lang: "tile.sapling.oak.name", icone: "textures/blocks/sapling_oak" },
  birch_sapling: { lang: "tile.sapling.birch.name", icone: "textures/blocks/sapling_birch" },
  acacia_sapling: { lang: "tile.sapling.acacia.name", icone: "textures/blocks/sapling_acacia" },
  oak_leaves: { lang: "tile.leaves.oak.name", icone: "textures/blocks/leaves_oak_carried" },
  birch_leaves: { lang: "tile.leaves.birch.name", icone: "textures/blocks/leaves_birch_carried" },
  acacia_leaves: { lang: "tile.leaves2.acacia.name", icone: "textures/blocks/leaves_acacia_carried" },
  sand: { lang: "tile.sand.default.name", icone: "textures/blocks/sand" },
  dirt: { lang: "tile.dirt.default.name", icone: "textures/blocks/dirt" },
  stone_bricks: { lang: "tile.stonebrick.default.name", icone: "textures/blocks/stonebrick" },
  cracked_stone_bricks: { lang: "tile.stonebrick.cracked.name", icone: "textures/blocks/stonebrick_cracked" },
  mossy_stone_bricks: { lang: "tile.stonebrick.mossy.name", icone: "textures/blocks/stonebrick_mossy" },
  sandstone: { lang: "tile.sandstone.default.name", icone: "textures/blocks/sandstone_normal" },
  smooth_sandstone: { lang: "tile.sandstone.smooth.name", icone: "textures/blocks/sandstone_top" },
  cut_sandstone: { lang: "tile.sandstone.cut.name", icone: "textures/blocks/sandstone_smooth" },
  polished_andesite: { lang: "tile.stone.andesiteSmooth.name", icone: "textures/blocks/stone_andesite_smooth" },
  andesite: { lang: "tile.stone.andesite.name", icone: "textures/blocks/stone_andesite" },
  crafting_table: { lang: "tile.crafting_table.name", icone: "textures/blocks/crafting_table_front" },
  furnace: { lang: "tile.furnace.name", icone: "textures/blocks/furnace_front_off" },
  chest: { lang: "tile.chest.name", icone: "textures/blocks/chest_front" },
  trapped_chest: { lang: "tile.trapped_chest.name", icone: "textures/blocks/chest_front" },
  barrel: { lang: "tile.barrel.name", icone: "textures/blocks/barrel_side" },
  piston: { lang: "tile.piston.name", icone: "textures/blocks/piston_side" },
  glass: { lang: "tile.glass.name", icone: "textures/blocks/glass" },
  iron_block: { lang: "tile.iron_block.name", icone: "textures/blocks/iron_block" },
  coal_block: { lang: "tile.coal_block.name", icone: "textures/blocks/coal_block" },
  cobblestone: { lang: "tile.cobblestone.name", icone: "textures/blocks/cobblestone" },
  gravel: { lang: "tile.gravel.name", icone: "textures/blocks/gravel" },
  torch: { lang: "tile.torch.name", icone: "textures/blocks/torch_on" },
  reinforced_deepslate: { lang: "tile.reinforced_deepslate.name", icone: "textures/blocks/reinforced_deepslate_side" },
  deepslate: { lang: "tile.deepslate.name", icone: "textures/blocks/deepslate/deepslate" },
  stone: { lang: "tile.stone.stone.name", icone: "textures/blocks/stone" },
  stone_brick_slab: { lang: "tile.stone_slab.brick.name", icone: "textures/blocks/stonebrick" },
  hopper: { lang: "tile.hopper.name", icone: "textures/items/hopper" },
  leather_helmet: { lang: "item.leather_helmet.name", icone: "textures/items/leather_helmet" },
  iron_pickaxe: { lang: "item.iron_pickaxe.name", icone: "textures/items/iron_pickaxe" },
  stone_pickaxe: { lang: "item.stone_pickaxe.name", icone: "textures/items/stone_pickaxe" },
  egg: { lang: "item.egg.name", icone: "textures/items/egg" },
  raw_copper: { lang: "item.raw_copper.name", icone: "textures/items/raw_copper" },
  honey_bottle: { lang: "item.honey_bottle.name", icone: "textures/items/honey_bottle" },
  sweet_berries: { lang: "item.sweet_berries.name", icone: "textures/items/sweet_berries" },
  book: { icone: "textures/items/book_normal" },
  redstone: { icone: "textures/items/redstone_dust" },
  chicken: { icone: "textures/items/chicken_raw" },
  chiseled_sandstone: { lang: "tile.sandstone.chiseled.name" },
  brown_carpet: { lang: "tile.carpet.brown.name" },
  gray_carpet: { lang: "tile.carpet.gray.name" },
  light_gray_carpet: { lang: "tile.carpet.silver.name" },
  red_carpet: { lang: "tile.carpet.red.name" },
  white_carpet: { lang: "tile.carpet.white.name" },
  oak_slab: { lang: "tile.wooden_slab.oak.name", icone: "textures/blocks/planks_oak" },
  birch_slab: { lang: "tile.wooden_slab.birch.name", icone: "textures/blocks/planks_birch" },
  acacia_slab: { lang: "tile.wooden_slab.acacia.name", icone: "textures/blocks/planks_acacia" },
  jungle_slab: { lang: "tile.wooden_slab.jungle.name", icone: "textures/blocks/planks_jungle" },
  spruce_slab: { lang: "tile.wooden_slab.spruce.name", icone: "textures/blocks/planks_spruce" },
  smooth_stone_slab: { lang: "tile.stone_slab.stone.name", icone: "textures/blocks/stone_slab_top" },
  cocoa_beans: { lang: "item.dye.brown.name", icone: "textures/items/dye_powder_brown" },
  jungle_leaves: { lang: "tile.leaves.jungle.name", icone: "textures/blocks/leaves_jungle_carried" },
  spruce_leaves: { lang: "tile.leaves.spruce.name", icone: "textures/blocks/leaves_spruce_carried" },
  jungle_sapling: { lang: "tile.sapling.jungle.name", icone: "textures/blocks/sapling_jungle" },
  spruce_sapling: { lang: "tile.sapling.spruce.name", icone: "textures/blocks/sapling_spruce" },
  red_sand: { lang: "tile.sand.red.name", icone: "textures/blocks/red_sand" },
  short_grass: { lang: "tile.tallgrass.grass.name", icone: "textures/blocks/tallgrass_carried" },
  baked_potato: { icone: "textures/items/potato_baked" },
  beef: { icone: "textures/items/beef_raw" },
  cooked_beef: { icone: "textures/items/beef_cooked" },
  cooked_chicken: { icone: "textures/items/chicken_cooked" },
  cooked_cod: { lang: "item.cooked_fish.name", icone: "textures/items/fish_cooked" },
  cooked_mutton: { lang: "item.muttonCooked.name", icone: "textures/items/mutton_cooked" },
  mutton: { lang: "item.muttonRaw.name", icone: "textures/items/mutton_raw" },
  cooked_porkchop: { icone: "textures/items/porkchop_cooked" },
  porkchop: { icone: "textures/items/porkchop_raw" },
  cooked_rabbit: { icone: "textures/items/rabbit_cooked" },
  golden_carrot: { icone: "textures/items/carrot_golden" },
  poisonous_potato: { icone: "textures/items/potato_poisonous" },
  white_wool: { lang: "tile.wool.white.name", icone: "textures/blocks/wool_colored_white" },
};

function vanilla() {
  const pasta = join(RAIZ, "referencias/vanilla");
  const cache = join(RAIZ, "tools/dados/vanilla.json");
  const salvo = existsSync(cache) ? JSON.parse(readFileSync(cache, "utf8")) : {};
  if (!existsSync(join(pasta, "pt_BR.lang"))) return salvo; // sem os arquivos oficiais: usa o que já foi resolvido
  const pt = lang("referencias/vanilla/pt_BR.lang"), en = lang("referencias/vanilla/en_US.lang");
  const itTex = lerJson("referencias/vanilla/item_texture.json").texture_data;
  const terTex = lerJson("referencias/vanilla/terrain_texture.json").texture_data;
  const blocos = lerJson("referencias/vanilla/blocks.json");
  const caminhos = new Set(Object.values(itTex).flatMap((t) => (Array.isArray(t.textures) ? t.textures.map(caminho) : [caminho(t.textures)])));
  const faltam = [];
  for (const id of [...citados].sort()) {
    const n = id.slice(10), ap = APELIDOS[n] ?? {};
    const chave = ap.lang ?? [`item.${n}.name`, `tile.${n}.name`].find((k) => pt[k]);
    if (!chave && pt[`entity.${n}.name`]) {
      citados.delete(id); // é um mob (listas de monstros do config), não um item
      continue;
    }
    let icone = ap.icone;
    if (!icone && caminhos.has(`textures/items/${n}`)) icone = `textures/items/${n}`;
    if (!icone && itTex[n]) icone = caminho(itTex[n].textures);
    if (!icone && blocos[n]) {
      const t = blocos[n].textures;
      const k = typeof t === "string" ? t : t?.side ?? t?.north ?? t?.up;
      icone = caminho(terTex[k]?.textures);
    }
    if (!chave || !pt[chave] || !icone) faltam.push(`${id}${!chave || !pt[chave] ? " (nome)" : ""}${!icone ? " (ícone)" : ""}`);
    salvo[id] = { pt: pt[chave] ?? salvo[id]?.pt ?? n, en: en[chave] ?? salvo[id]?.en ?? n, icone: icone ?? salvo[id]?.icone };
  }
  if (faltam.length) console.warn(`  catálogo: sem nome/ícone exato para ${faltam.join(", ")}`);
  mkdirSync(dirname(cache), { recursive: true });
  writeFileSync(cache, JSON.stringify(Object.fromEntries(Object.entries(salvo).sort()), null, 1) + "\n");
  return salvo;
}
const doJogo = vanilla();
for (const id of citados) if (doJogo[id]) itens[id] = doJogo[id];

// ---------- saída ----------
const ordenado = Object.fromEntries(Object.entries(itens).sort(([a], [b]) => a.localeCompare(b)));
const saida = `// Gerado por tools/gerar-catalogo.mjs (roda no build). Não edite à mão.
export type ReceitaJson = {
  tipo: "bancada" | "sem_forma" | "fornalha";
  id: string;
  resultado: string;
  qtd: number;
  grade?: ReadonlyArray<string>;
  chaves?: Readonly<Record<string, string>>;
  ingredientes?: ReadonlyArray<{ item: string; qtd: number }>;
  estacoes: ReadonlyArray<string>;
};
export type InfoItem = { pt: string; en: string; icone?: string };
export const ITENS: Readonly<Record<string, InfoItem>> = ${JSON.stringify(ordenado, null, 1)};
export const RECEITAS_JSON: ReadonlyArray<ReceitaJson> = ${JSON.stringify(receitas, null, 1)};
export const DROPS: ReadonlyArray<{ fonte: string; item: string; min: number; max: number; chance: number }> = ${JSON.stringify(drops, null, 1)};
`;
mkdirSync(join(RAIZ, "scripts/catalogo"), { recursive: true });
writeFileSync(join(RAIZ, "scripts/catalogo/gerado.ts"), saida);
console.log(`catálogo: ${Object.keys(itens).length} itens, ${receitas.length} receitas, ${drops.length} drops`);

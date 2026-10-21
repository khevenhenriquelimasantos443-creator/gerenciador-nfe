// Fases 15 a 23: gera itens, blocos, receitas, texturas, ícones e textos a partir de
// tools/dados/conteudo/f<fase>.mjs (um módulo por fase, que exporta { fase, mod, itens, blocos, receitas, dados }).
// - item:    { id, pt, en, icone: "forma:cor", pilha?, cat?, comp? }  (comp = componentes extras do item)
// - bloco:   { id, pt, en, tipo: "maquina" | "cubo" | "vidro", luz?, glifo?, cor?, padrao?, comp?, tick?, estados?,
//              girar?, dureza?, luzEmite?, loot?, extra?, permutacoes?, receita? }
// - receita: { id, tipo: "shaped" | "shapeless" | "furnace", padrao?, chave?, ingredientes?, entrada?, resultado, qtd?, tags? }
// Saída: BP/items, BP/blocks, BP/recipes (c_<id>.json), RP/textures/items/cl/c, RP/textures/blocks/cl/c,
// item_texture/terrain_texture, o trecho "Conteúdo" dos .lang e scripts/conteudo/gerado.ts (origem por mod e `dados`).
// Roda no build antes do Catálogo e do tsc.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FACE, PADRAO, hex, icone, png } from "./pintura.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DADOS = join(RAIZ, "tools/dados/conteudo");
const pasta = (rel) => (mkdirSync(join(RAIZ, rel), { recursive: true }), join(RAIZ, rel));
const json = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8"));

const fases = [];
for (const arq of existsSync(DADOS) ? readdirSync(DADOS).filter((a) => /^f\d+\.mjs$/.test(a)).sort() : []) {
  fases.push((await import(pathToFileURL(join(DADOS, arq)).href)).default);
}

const itemTex = lerJson("RP/textures/item_texture.json");
const terreno = lerJson("RP/textures/terrain_texture.json");
const dirIcone = pasta("RP/textures/items/cl/c");
const dirBloco = pasta("RP/textures/blocks/cl/c");
// Receitas geradas: apaga as antigas (c_*) para não sobrar receita de item que mudou de nome.
for (const a of readdirSync(join(RAIZ, "BP/recipes"))) if (a.startsWith("c_")) rmSync(join(RAIZ, "BP/recipes", a));

const nomes = { pt: [], en: [] };
const origem = {};
const ingrediente = (i) => (i.startsWith("#") ? { tag: i.slice(1) } : { item: i });
const resultado = (r) => (r.qtd ? { item: r.resultado, count: r.qtd } : { item: r.resultado });

function receita(r) {
  const desc = { identifier: `cl:c_${r.id}` };
  let corpo;
  if (r.tipo === "shaped") {
    corpo = { "minecraft:recipe_shaped": { description: desc, tags: r.tags ?? ["crafting_table"], pattern: r.padrao,
      key: Object.fromEntries(Object.entries(r.chave).map(([k, v]) => [k, ingrediente(v)])), unlock: [ingrediente(Object.values(r.chave)[0])], result: resultado(r) } };
  } else if (r.tipo === "shapeless") {
    corpo = { "minecraft:recipe_shapeless": { description: desc, tags: r.tags ?? ["crafting_table"], ingredients: r.ingredientes.map(ingrediente),
      unlock: [ingrediente(r.ingredientes[0])], result: resultado(r) } };
  } else if (r.tipo === "furnace") {
    corpo = { "minecraft:recipe_furnace": { description: desc, tags: r.tags ?? ["furnace"], input: r.entrada, output: r.resultado } };
  } else throw new Error(`receita ${r.id}: tipo ${r.tipo}`);
  json(`BP/recipes/c_${r.id}.json`, { format_version: "1.20.10", ...corpo });
}

function item(f, it) {
  writeFileSync(join(dirIcone, `${it.id}.png`), png(icone(it.icone)));
  itemTex.texture_data[`clc_${it.id}`] = { textures: `textures/items/cl/c/${it.id}` };
  json(`BP/items/${it.id}.json`, {
    format_version: "1.21.60",
    "minecraft:item": {
      description: { identifier: `cl:${it.id}`, menu_category: { category: it.cat ?? "items" } },
      components: {
        "minecraft:icon": `clc_${it.id}`,
        "minecraft:display_name": { value: `item.cl:${it.id}.name` },
        "minecraft:max_stack_size": it.pilha ?? 64,
        ...(it.comp ?? {}),
      },
    },
  });
  nomes.pt.push(`item.cl:${it.id}.name=${it.pt}`);
  nomes.en.push(`item.cl:${it.id}.name=${it.en}`);
  origem[`cl:${it.id}`] = f.mod;
}

function textura(nome, pintor) {
  writeFileSync(join(dirBloco, `${nome}.png`), png(pintor));
  terreno.texture_data[`clc_${nome}`] = { textures: `textures/blocks/cl/c/${nome}` };
  return `clc_${nome}`;
}

function bloco(f, b) {
  const comps = {};
  let mats;
  if (b.tipo === "maquina") {
    const luz = b.luz ?? "ciano";
    const t = {
      frente: textura(`${b.id}_frente`, FACE.frente(luz, b.glifo ?? "engrenagem")),
      lado: textura(`${b.id}_lado`, FACE.lado(luz)),
      topo: textura(`${b.id}_topo`, FACE.topo(luz)),
      baixo: textura(`${b.id}_baixo`, FACE.baixo()),
    };
    const m = (tex, acesa) => ({ texture: tex, render_method: "opaque", ...(acesa ? { face_dimming: false, ambient_occlusion: 0 } : {}) });
    mats = { "*": m(t.lado), north: m(t.frente, true), up: m(t.topo), down: m(t.baixo) };
  } else {
    const c = hex(b.cor ?? "#999999");
    const vidro = b.tipo === "vidro";
    const lado = textura(b.id, PADRAO[vidro ? "vidro" : b.padrao ?? "liso"](c));
    const rm = vidro ? "blend" : "opaque";
    mats = { "*": { texture: lado, render_method: rm } };
    if (b.topo) mats.up = mats.down = { texture: textura(`${b.id}_topo`, PADRAO[b.topo](c)), render_method: rm };
    if (vidro) comps["minecraft:light_dampening"] = 0;
  }
  Object.assign(comps, {
    "minecraft:geometry": "minecraft:geometry.full_block",
    "minecraft:material_instances": mats,
    "minecraft:destructible_by_mining": { seconds_to_destroy: b.dureza ?? (b.tipo === "maquina" ? 1.5 : 2) },
    "minecraft:destructible_by_explosion": { explosion_resistance: b.resistencia ?? 6 },
    "minecraft:map_color": b.cor ?? "#c9ced3",
  });
  if (b.luzEmite) comps["minecraft:light_emission"] = b.luzEmite;
  if (b.loot) comps["minecraft:loot"] = b.loot;
  if (b.tick) comps["minecraft:tick"] = { interval_range: Array.isArray(b.tick) ? b.tick : [b.tick, b.tick], looping: true };
  if (b.comp) comps[b.comp] = {};
  Object.assign(comps, b.extra ?? {});
  const girar = b.girar ?? b.tipo === "maquina";
  const description = { identifier: `cl:${b.id}`, menu_category: { category: b.menu ?? "items" } };
  if (b.estados) description.states = b.estados;
  const permutations = [...(b.permutacoes ?? [])];
  if (girar) {
    description.traits = { "minecraft:placement_direction": { enabled_states: ["minecraft:cardinal_direction"], y_rotation_offset: 180 } };
    for (const [dir, rot] of [["north", 0], ["west", 90], ["south", 180], ["east", -90]])
      permutations.push({ condition: `q.block_state('minecraft:cardinal_direction') == '${dir}'`, components: { "minecraft:transformation": { rotation: [0, rot, 0] } } });
  }
  json(`BP/blocks/${b.id}.json`, {
    format_version: "1.26.30",
    "minecraft:block": { description, components: comps, ...(permutations.length ? { permutations } : {}) },
  });
  nomes.pt.push(`tile.cl:${b.id}.name=${b.pt}`);
  nomes.en.push(`tile.cl:${b.id}.name=${b.en}`);
  origem[`cl:${b.id}`] = f.mod;
}

const dadosTs = [];
for (const f of fases) {
  for (const it of f.itens ?? []) item(f, it);
  for (const b of f.blocos ?? []) bloco(f, b);
  for (const r of f.receitas ?? []) receita(r);
  for (const [k, v] of Object.entries(f.textos ?? {})) {
    nomes.pt.push(`${k}=${v[0]}`);
    nomes.en.push(`${k}=${v[1]}`);
  }
  if (f.dados) dadosTs.push(`export const DADOS_F${f.fase} = ${JSON.stringify(f.dados)} as const;`);
}
json("RP/textures/item_texture.json", itemTex);
json("RP/textures/terrain_texture.json", terreno);

for (const [arq, lingua] of [["RP/texts/pt_BR.lang", "pt"], ["RP/texts/en_US.lang", "en"]]) {
  const INI = "## Conteúdo das Fases 15+ (gerado por tools/gerar-conteudo.mjs)", FIM = "## fim Conteúdo";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const i = texto.indexOf(INI);
  if (i >= 0) texto = texto.slice(0, i) + texto.slice(texto.indexOf(FIM) + FIM.length + 1);
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${nomes[lingua].join("\n")}\n${FIM}\n`);
}

pasta("scripts/conteudo");
writeFileSync(join(RAIZ, "scripts/conteudo/gerado.ts"), `// Gerado por tools/gerar-conteudo.mjs a partir de tools/dados/conteudo/. Não edite à mão.
export const ORIGEM_CONTEUDO: Readonly<Record<string, string>> = ${JSON.stringify(origem)};
${dadosTs.join("\n")}
`);
console.log(`conteúdo: ${fases.length} fases, ${Object.keys(origem).length} itens e blocos`);

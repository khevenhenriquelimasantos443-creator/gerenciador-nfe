// Grupos do inventário criativo e do livro de receitas (BP/item_catalog/crafting_item_catalog.json).
// Cada item continua na aba do seu "menu_category" (construção, equipamento, itens, natureza); aqui ele
// entra num grupo recolhível por mod, como os grupos do próprio jogo. Itens com categoria "none" ficam
// fora (plantas no chão, blocos técnicos). Os nomes dos grupos vão para os .lang.
// Roda depois do TypeScript: a origem de cada item vem de BP/scripts/config.js (ORIGEM_MOD).
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { ORIGEM_MOD, JUNTA_MODS: JUNTA, MODS } = await import(pathToFileURL(join(RAIZ, "BP/scripts/config.js")).href);

const ORDEM = MODS.map((m) => m.mod);
const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

// Os mods grandes se dividem em subgrupos, para não virar uma parede de itens.
const FAMILIAS_CHISEL = [["arenito", "Arenito"], ["pedra", "Pedra"], ["marmore", "Mármore"], ["calcario", "Calcário"], ["casco_nave", "Casco da Nave"], ["vidro", "Vidro"]];
function subgrupo(mod, id, categoria) {
  const n = id.split(":")[1];
  if (mod === "Tinkers' Construct") {
    if (categoria === "equipment") return ["Tinkers: ferramentas", "Tinkers: tools"];
    if (n.startsWith("padrao_")) return ["Tinkers: padrões", "Tinkers: patterns"];
    if (n.startsWith("peca_")) return ["Tinkers: peças", "Tinkers: parts"];
    if (n.startsWith("molde_")) return ["Tinkers: moldes", "Tinkers: casts"];
  }
  if (mod === "Chisel" && categoria === "construction") {
    const f = FAMILIAS_CHISEL.find(([p]) => n === p || n.startsWith(`${p}_`));
    if (f) return [`Chisel: ${f[1]}`, `Chisel: ${f[0].replace("_", " ")}`];
  }
  if (mod === "Pam's HarvestCraft" && categoria === "nature") {
    return n.startsWith("semente_") || n.startsWith("muda_") ? ["HarvestCraft: sementes", "HarvestCraft: seeds"] : ["HarvestCraft: comidas", "HarvestCraft: food"];
  }
  return [mod, mod];
}

const grupos = new Map(); // chave -> { categoria, pt, en, mod, itens }
for (const pasta of ["BP/items", "BP/blocks"]) {
  for (const arq of readdirSync(join(RAIZ, pasta)).filter((a) => a.endsWith(".json")).sort()) {
    const j = JSON.parse(readFileSync(join(RAIZ, pasta, arq), "utf8"));
    const d = (j["minecraft:item"] ?? j["minecraft:block"])?.description;
    const categoria = d?.menu_category?.category;
    if (!d?.identifier?.startsWith("cl:") || !categoria || categoria === "none") continue;
    const original = ORIGEM_MOD[d.identifier] ?? "Pouso Forçado";
    const mod = JUNTA[original] ?? original;
    const [pt, en] = subgrupo(mod, d.identifier, categoria);
    const chave = `${categoria}|${pt}`;
    if (!grupos.has(chave)) grupos.set(chave, { categoria, pt, en, mod, itens: [] });
    grupos.get(chave).itens.push(d.identifier);
  }
}

// Ícone do grupo: um item conhecido do mod (config.ts, MODS), senão o primeiro da lista.
const ICONE = Object.fromEntries(MODS.map((m) => [m.mod, m.icones]));
const posicao = (g) => {
  const i = ORDEM.indexOf(g.mod);
  return (i < 0 ? ORDEM.length : i) * 100 + (g.pt === g.mod ? 0 : 1);
};
const categorias = {};
const lang = { pt: [], en: [] };
for (const g of [...grupos.values()].sort((a, b) => posicao(a) - posicao(b) || a.pt.localeCompare(b.pt))) {
  // O nome do grupo é único por aba (o mesmo mod pode ter grupo em mais de uma).
  const nome = `cl:itemGroup.name.${g.categoria}_${slug(g.pt)}`;
  const icone = (ICONE[g.mod] ?? []).find((i) => g.itens.includes(i)) ?? g.itens[0];
  (categorias[g.categoria] ??= []).push({ group_identifier: { icon: icone, name: nome }, items: g.itens });
  lang.pt.push(`${nome}=${g.pt}`);
  lang.en.push(`${nome}=${g.en}`);
}
mkdirSync(join(RAIZ, "BP/item_catalog"), { recursive: true });
writeFileSync(join(RAIZ, "BP/item_catalog/crafting_item_catalog.json"), `${JSON.stringify({
  format_version: "1.21.60",
  "minecraft:crafting_items_catalog": {
    categories: ["construction", "equipment", "items", "nature"].filter((c) => categorias[c]).map((c) => ({ category_name: c, groups: categorias[c] })),
  },
}, null, 2)}\n`);

for (const [arq, lingua] of [["RP/texts/pt_BR.lang", "pt"], ["RP/texts/en_US.lang", "en"]]) {
  const INI = "## Grupos do inventário (gerado por tools/gerar-grupos.mjs)", FIM = "## fim Grupos";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const i = texto.indexOf(INI);
  if (i >= 0) texto = texto.slice(0, i) + texto.slice(texto.indexOf(FIM) + FIM.length + 1);
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${lang[lingua].join("\n")}\n${FIM}\n`);
}
const total = [...grupos.values()].reduce((n, g) => n + g.itens.length, 0);
console.log(`inventário: ${grupos.size} grupos, ${total} itens e blocos`);

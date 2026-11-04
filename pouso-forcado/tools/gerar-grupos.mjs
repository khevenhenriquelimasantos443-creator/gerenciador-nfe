// Grupos do inventário criativo e do livro de receitas (BP/item_catalog/crafting_item_catalog.json).
// 1.48.0: o Bedrock não deixa criar aba nova no criativo, então tudo do pack vai para uma aba só, a última
// (Natureza), depois das coisas do jogo: um grupo recolhível por mod, na ordem do pack (os mods muito grandes
// em alguns subgrupos seguidos). A aba de cada item/bloco é reescrita aqui (os geradores ainda escrevem a de
// antes; quem decide é este arquivo). Itens com categoria "none" ficam fora (plantas no chão, blocos técnicos).
// Os nomes dos grupos vão para os .lang.
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
const ABA = "nature";
// Equipamento = tem durabilidade ou se veste (não depende da aba antiga, que este arquivo reescreve).
const equipamento = (c) => !!(c["minecraft:durability"] || c["minecraft:wearable"]);
function subgrupo(mod, id, ehBloco, comps) {
  const n = id.split(":")[1];
  if (mod === "Tinkers' Construct") {
    if (equipamento(comps)) return ["Tinkers: ferramentas", "Tinkers: tools"];
    if (n.startsWith("padrao_")) return ["Tinkers: padrões", "Tinkers: patterns"];
    if (n.startsWith("peca_")) return ["Tinkers: peças", "Tinkers: parts"];
    if (n.startsWith("molde_")) return ["Tinkers: moldes", "Tinkers: casts"];
  }
  if (mod === "Chisel" && ehBloco) {
    const f = FAMILIAS_CHISEL.find(([p]) => n === p || n.startsWith(`${p}_`));
    if (f) return [`Chisel: ${f[1]}`, `Chisel: ${f[0].replace("_", " ")}`];
  }
  if (mod === "Pam's HarvestCraft") {
    if (n.startsWith("semente_") || n.startsWith("muda_")) return ["HarvestCraft: sementes e mudas", "HarvestCraft: seeds and saplings"];
    if (!ehBloco && comps["minecraft:food"]) return ["HarvestCraft: comidas", "HarvestCraft: food"];
  }
  return [mod, mod];
}

const grupos = new Map(); // nome em pt -> { pt, en, mod, itens }
let reescritos = 0;
for (const pasta of ["BP/items", "BP/blocks"]) {
  for (const arq of readdirSync(join(RAIZ, pasta)).filter((a) => a.endsWith(".json")).sort()) {
    const caminho = join(RAIZ, pasta, arq);
    const texto = readFileSync(caminho, "utf8");
    const j = JSON.parse(texto);
    const corpo = j["minecraft:item"] ?? j["minecraft:block"];
    const d = corpo?.description;
    const categoria = d?.menu_category?.category;
    if (!d?.identifier?.startsWith("cl:") || !categoria || categoria === "none") continue;
    if (categoria !== ABA) {
      d.menu_category.category = ABA;
      writeFileSync(caminho, `${JSON.stringify(j, null, 2)}\n`);
      reescritos++;
    }
    const original = ORIGEM_MOD[d.identifier] ?? "Pouso Forçado";
    const mod = JUNTA[original] ?? original;
    const [pt, en] = subgrupo(mod, d.identifier, pasta === "BP/blocks", corpo.components ?? {});
    if (!grupos.has(pt)) grupos.set(pt, { pt, en, mod, itens: [] });
    grupos.get(pt).itens.push(d.identifier);
  }
}

// Ícone do grupo: um item conhecido do mod (config.ts, MODS), senão o primeiro da lista.
const ICONE = Object.fromEntries(MODS.map((m) => [m.mod, m.icones]));
// Os add-ons ficam logo depois do mod deles (Mekanism, Mekanism Generators, Mekanism Additions, Mekanism Tools).
const base = (mod) => ORDEM.filter((m) => mod === m || mod.startsWith(`${m} `)).sort((a, b) => a.length - b.length)[0] ?? mod;
const posicao = (g) => {
  const i = ORDEM.indexOf(base(g.mod)), j = ORDEM.indexOf(g.mod);
  return (i < 0 ? ORDEM.length : i) * 10000 + (g.mod === base(g.mod) ? 0 : 100 + (j < 0 ? 99 : j)) + (g.pt === g.mod ? 0 : 1);
};
const grupos_ = [];
const lang = { pt: [], en: [] };
for (const g of [...grupos.values()].sort((a, b) => posicao(a) - posicao(b) || a.pt.localeCompare(b.pt))) {
  const nome = `cl:itemGroup.name.${slug(g.pt)}`;
  const icone = (ICONE[g.mod] ?? []).find((i) => g.itens.includes(i)) ?? g.itens[0];
  grupos_.push({ group_identifier: { icon: icone, name: nome }, items: g.itens });
  lang.pt.push(`${nome}=${g.pt}`);
  lang.en.push(`${nome}=${g.en}`);
}
mkdirSync(join(RAIZ, "BP/item_catalog"), { recursive: true });
writeFileSync(join(RAIZ, "BP/item_catalog/crafting_item_catalog.json"), `${JSON.stringify({
  format_version: "1.21.60",
  "minecraft:crafting_items_catalog": { categories: [{ category_name: ABA, groups: grupos_ }] },
}, null, 2)}\n`);

for (const [arq, lingua] of [["RP/texts/pt_BR.lang", "pt"], ["RP/texts/en_US.lang", "en"]]) {
  const INI = "## Grupos do inventário (gerado por tools/gerar-grupos.mjs)", FIM = "## fim Grupos";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const i = texto.indexOf(INI);
  if (i >= 0) texto = texto.slice(0, i) + texto.slice(texto.indexOf(FIM) + FIM.length + 1);
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${lang[lingua].join("\n")}\n${FIM}\n`);
}
const total = [...grupos.values()].reduce((n, g) => n + g.itens.length, 0);
console.log(`inventário: ${grupos.size} grupos na aba Natureza, ${total} itens e blocos (${reescritos} mudaram de aba)`);

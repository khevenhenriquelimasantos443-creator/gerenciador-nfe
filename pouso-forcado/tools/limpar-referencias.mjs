// Tira de RP/textures/terrain_texture.json as chaves que apontam para um arquivo próprio (textures/blocks/cl/...) que
// não existe. Textura do jogo base (textures/blocks/dirt etc.) não é tocada. Roda no fim do build; avisa o que tirou.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARQ = join(RAIZ, "RP/textures/terrain_texture.json");
const existe = (p) => [".png", ".tga"].some((e) => existsSync(join(RAIZ, "RP", p + e)));
const bruto = readFileSync(ARQ, "utf8");
const json = JSON.parse(bruto);
const tirar = [];
for (const [chave, v] of Object.entries(json.texture_data)) {
  const lista = Array.isArray(v.textures) ? v.textures : [v.textures];
  const caminhos = lista.map((x) => (typeof x === "string" ? x : x?.path)).filter(Boolean);
  if (caminhos.length && caminhos.every((p) => p.startsWith("textures/blocks/cl/") && !existe(p))) tirar.push(chave);
}
if (tirar.length) {
  for (const c of tirar) delete json.texture_data[c];
  const indent = bruto.startsWith("{\n  ") ? 2 : bruto.startsWith("{\n ") ? 1 : 0;
  writeFileSync(ARQ, JSON.stringify(json, null, indent || undefined) + (bruto.endsWith("\n") ? "\n" : ""));
}
console.log(`referências: ${tirar.length} chave(s) de textura sem arquivo removida(s)${tirar.length ? ": " + tirar.join(", ") : ""}`);

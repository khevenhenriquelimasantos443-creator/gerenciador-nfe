// Ícones desenhados à mão (importados por tools/importar-icones.py para RP/textures/items/cl/arte/)
// têm prioridade sobre os gerados: aponta o ícone de cada item que tiver arte/<id>.png para ela.
// Roda no build antes do Catálogo e de novo depois dos geradores (que reescrevem item_texture.json).
// Também troca o ovo de criar dos monstros (arte/ovo_<monstro>.png).
// Os ícones de bloco (arte/blocos/<id>.png) o Catálogo já procura sozinho.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const ARTE = join(RAIZ, "RP/textures/items/cl/arte");
const arqTex = join(RAIZ, "RP/textures/item_texture.json");
const tex = JSON.parse(readFileSync(arqTex, "utf8"));
let n = 0;
for (const arq of existsSync(ARTE) ? readdirSync(ARTE).filter((a) => a.endsWith(".png")) : []) {
  const id = arq.slice(0, -4);
  // Ovo de criar de um monstro do add-on: textura própria no lugar das duas cores.
  const entidade = join(RAIZ, `RP/entity/${id.slice(4)}.entity.json`);
  if (id.startsWith("ovo_") && existsSync(entidade)) {
    tex.texture_data[`cl_${id}`] = { textures: `textures/items/cl/arte/${id}` };
    const e = JSON.parse(readFileSync(entidade, "utf8"));
    e["minecraft:client_entity"].description.spawn_egg = { texture: `cl_${id}`, texture_index: 0 };
    writeFileSync(entidade, JSON.stringify(e, null, 2) + "\n");
    n++;
    continue;
  }
  const item = join(RAIZ, `BP/items/${id}.json`);
  if (!existsSync(item)) throw new Error(`ícone ${arq} sem item BP/items/${id}.json`);
  const ic = JSON.parse(readFileSync(item, "utf8"))["minecraft:item"].components["minecraft:icon"];
  const chave = typeof ic === "string" ? ic : ic?.texture ?? ic?.textures?.default;
  tex.texture_data[chave] = { textures: `textures/items/cl/arte/${id}` };
  n++;
}
writeFileSync(arqTex, JSON.stringify(tex, null, 2) + "\n");
console.log(`ícones desenhados: ${n} itens`);

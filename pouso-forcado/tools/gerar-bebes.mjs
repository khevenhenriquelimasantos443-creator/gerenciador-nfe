// Filhotes de monstros do Mekanism Additions (1.11.0): o creeper, o esqueleto, o esqueleto errante e o enderman do jogo
// (referencias/vanilla/entidades/, dos exemplos oficiais Mojang/bedrock-samples) na metade do tamanho, com o mesmo
// comportamento e as mesmas famílias (a horda noturna e o sol tratam igual). O creeper bebê explode com metade da força.
// Nascem no lugar de 1 em 3 adultos (peso 0,5 do Mekanism; scripts/maquinas/mekanism_additions.ts).
// Roda à mão quando mudar algo (os arquivos gerados vão no repositório):
//   node tools/gerar-bebes.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(RAIZ, "referencias/vanilla/entidades");
const ler = (arq) => JSON.parse(readFileSync(join(REF, arq), "utf8").replace(/\/\/.*$/gm, ""));
const gravar = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
const BEBES = [["creeper", "creeper_bebe"], ["skeleton", "esqueleto_bebe"], ["stray", "esqueleto_errante_bebe"], ["enderman", "enderman_bebe"]];

// Reduz pela metade a caixa de colisão e a força das explosões (em qualquer grupo de componentes).
function meia(c) {
  const cx = c["minecraft:collision_box"];
  if (cx) c["minecraft:collision_box"] = { width: cx.width / 2, height: cx.height / 2 };
  if (c["minecraft:explode"]?.power) c["minecraft:explode"].power /= 2;
}
for (const [de, id] of BEBES) {
  const bp = ler(`${de}.json`);
  const e = bp["minecraft:entity"];
  e.description.identifier = `cl:${id}`;
  e.description.is_spawnable = true;
  e.description.is_summonable = true;
  // O comportamento de inchar e explodir (e o teletransporte do enderman) só vale com o tipo de execução do original.
  e.description.runtime_identifier = `minecraft:${de}`;
  meia(e.components);
  for (const g of Object.values(e.component_groups ?? {})) meia(g);
  e.components["minecraft:scale"] = { value: 0.5 };
  const fam = e.components["minecraft:type_family"]?.family ?? [];
  e.components["minecraft:type_family"] = { family: [...new Set([...fam, "bebe_mekanism"])] };
  gravar(`BP/entities/${id}.json`, bp);
  const rp = ler(`${de}.entity.json`);
  rp["minecraft:client_entity"].description.identifier = `cl:${id}`;
  gravar(`RP/entity/${id}.entity.json`, rp);
}
console.log(`filhotes: ${BEBES.length} entidades`);

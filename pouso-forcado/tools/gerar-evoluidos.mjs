// Monstros evoluídos da Lua e o chefe da masmorra (Galacticraft), feitos a partir dos monstros do jogo
// (referencias/vanilla/entidades/, dos exemplos oficiais Mojang/bedrock-samples 1.26.30): o mesmo comportamento,
// com a vida do Galacticraft (zumbi 30, esqueleto 25, aranha 22, creeper 25; chefe 150), sem queimar no sol
// (eles usam tanque de oxigênio) e com as famílias "evoluido" e "lunar". O chefe é o esqueleto em dobro (1,5 × 4
// blocos), com barra de chefe e sem sumir longe do jogador (a Chave da Masmorra sai pelo script, em base.ts).
// Roda à mão quando mudar algo (os arquivos gerados vão no repositório):
//   node tools/gerar-evoluidos.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(RAIZ, "referencias/vanilla/entidades");
const ler = (arq) => JSON.parse(readFileSync(join(REF, arq), "utf8").replace(/\/\/.*$/gm, ""));
const gravar = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");

const MOBS = [
  { de: "zombie", id: "zumbi_evoluido", vida: 30 },
  { de: "skeleton", id: "esqueleto_evoluido", vida: 25 },
  { de: "spider", id: "aranha_evoluida", vida: 22 },
  { de: "creeper", id: "creeper_evoluido", vida: 25 },
  { de: "skeleton", id: "esqueleto_chefe", vida: 150, chefe: true },
];

function semSol(c) {
  delete c["minecraft:burns_in_daylight"];
  delete c["minecraft:behavior.flee_sun"];
}

for (const m of MOBS) {
  const bp = ler(`${m.de}.json`);
  const e = bp["minecraft:entity"];
  e.description.identifier = `cl:${m.id}`;
  e.description.is_spawnable = true;
  e.description.is_summonable = true;
  // O comportamento de inchar e explodir do creeper só vale com o tipo de execução do original.
  e.description.runtime_identifier = `minecraft:${m.de}`;
  const c = e.components;
  c["minecraft:health"] = { value: m.vida, max: m.vida };
  semSol(c);
  for (const g of Object.values(e.component_groups ?? {})) semSol(g);
  const fam = c["minecraft:type_family"]?.family ?? [];
  c["minecraft:type_family"] = { family: [...new Set([...fam, "evoluido", "lunar"])] };
  if (m.chefe) {
    delete c["minecraft:despawn"];
    c["minecraft:persistent"] = {};
    c["minecraft:scale"] = { value: 2 };
    c["minecraft:collision_box"] = { width: 0.75, height: 2 };
    c["minecraft:boss"] = { hud_range: 40, should_darken_sky: false, name: "entity.cl:esqueleto_chefe.name" };
    c["minecraft:loot"] = { table: "loot_tables/cl/esqueleto_chefe.json" };
    c["minecraft:experience_reward"] = { on_death: "50" };
    c["minecraft:knockback_resistance"] = { value: 0.8 };
    c["minecraft:damage_sensor"] = { triggers: [{ cause: "fall", deals_damage: "no" }, { cause: "drowning", deals_damage: "no" }] };
    c["minecraft:movement"] = { value: 0.25 };
    // Galacticraft: 1 flecha a cada 25 ticks, até 10 blocos.
    c["minecraft:behavior.ranged_attack"] = { priority: 0, attack_interval_min: 1.25, attack_interval_max: 1.25, attack_radius: 10 };
    c["minecraft:follow_range"] = { value: 32, max: 32 };
    c["minecraft:type_family"].family.push("chefe");
  }
  gravar(`BP/entities/${m.id}.json`, bp);

  const rp = ler(`${m.de}.entity.json`);
  const d = rp["minecraft:client_entity"].description;
  d.identifier = `cl:${m.id}`;
  // Ovo próprio só no criativo: mesma figura do ovo do monstro original.
  gravar(`RP/entity/${m.id}.entity.json`, rp);
}
console.log(`evoluídos: ${MOBS.length} entidades`);

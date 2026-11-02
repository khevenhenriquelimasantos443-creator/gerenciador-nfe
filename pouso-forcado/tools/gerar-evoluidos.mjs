// Monstros evoluídos da Lua e o chefe da masmorra (Galacticraft), feitos a partir dos monstros do jogo
// (referencias/vanilla/entidades/, dos exemplos oficiais Mojang/bedrock-samples 1.26.30): o mesmo comportamento,
// com a vida do Galacticraft (zumbi 30, esqueleto 25, aranha 22, creeper 25; chefe 150), sem queimar no sol
// (eles usam tanque de oxigênio) e com as famílias "evoluido" e "lunar". O chefe é o esqueleto em dobro (1,5 × 4
// blocos), com barra de chefe e sem sumir longe do jogador (a Chave da Masmorra sai pelo script, em base.ts).
// Roda à mão quando mudar algo (os arquivos gerados vão no repositório):
//   node tools/gerar-evoluidos.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { gerarPng } from "./png.mjs";
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
  // 1.17.0: os outros evoluídos do Galacticraft (EntityEvolvedEnderman e EntityEvolvedWitch), com a vida do jogo.
  { de: "enderman", id: "enderman_evoluido", vida: 40 },
  { de: "witch", id: "bruxa_evoluida", vida: 26 },
];

// ---------- Traje espacial (1.17.0) ----------
// No Galacticraft os evoluídos usam máscara e tanques de oxigênio. Aqui: um capacete de vidro em volta da cabeça e
// dois tanques nas costas (um no dorso, na aranha), numa geometria à parte com os mesmos ossos do modelo do jogo
// (as animações do monstro movem o traje junto). Desenho próprio; o modelo base é o do jogo
// (referencias/vanilla/modelos, dos exemplos oficiais Mojang/bedrock-samples).
const MODELOS = {
  zombie: ["zombie", "geometry.zombie.v1.8"],
  skeleton: ["skeleton", "geometry.skeleton.v1.8"],
  creeper: ["creeper", "geometry.creeper.v1.8"],
  spider: ["spider", "geometry.spider.v1.8"],
  enderman: ["enderman", "geometry.enderman.v1.8"],
  witch: ["villager", "geometry.villager.v1.8"],
};
const lerModelo = (arq) => JSON.parse(readFileSync(join(RAIZ, "referencias/vanilla/modelos", `${arq}.geo.json`), "utf8").replace(/\/\/.*$/gm, ""));
// Textura 64×32: vidro (0,0 16×16), tanque (16,0 8×8), tampa (24,0 4×4), cano (28,0 4×4).
const UV = { vidro: [0, 0, 16, 16], tanque: [16, 0, 8, 8], tampa: [24, 0, 4, 4], cano: [28, 0, 4, 4] };
function cubo(origin, size, parte) {
  const [u, v, w, h] = UV[parte];
  const f = { uv: [u, v], uv_size: [w, h] };
  return { origin, size, uv: { north: f, south: f, east: f, west: f, up: f, down: f } };
}
function traje(de) {
  const [arq, id] = MODELOS[de];
  const ossos = lerModelo(arq)[id].bones;
  const osso = (n) => ossos.find((b) => b.name === n);
  const cabeca = osso("head").cubes[0];
  const corpoNome = de === "spider" ? "body1" : "body";
  const corpo = osso(corpoNome).cubes[0];
  const folga = de === "witch" ? 2 : 1;
  const capacete = cubo(cabeca.origin.map((o) => o - folga), cabeca.size.map((t) => t + 2 * folga), "vidro");
  const [cx, cy, cz] = corpo.origin, [sx, sy, sz] = corpo.size;
  let tanques;
  if (de === "spider") {
    // Um tanque deitado no dorso.
    tanques = [cubo([-2, cy + sy, cz + 2], [4, 3, 8], "tanque"), cubo([-1, cy + sy + 1, cz + 1], [2, 1, 1], "tampa")];
  } else {
    const yt = cy + sy - 9, zt = cz + sz; // costas, na parte de cima do corpo
    tanques = [
      cubo([-3.5, yt, zt], [3, 7, 3], "tanque"), cubo([0.5, yt, zt], [3, 7, 3], "tanque"),
      cubo([-3, yt + 7, zt + 0.5], [2, 1, 2], "tampa"), cubo([1, yt + 7, zt + 0.5], [2, 1, 2], "tampa"),
      cubo([-0.5, yt + 7, zt + 1], [1, 2, 1], "cano"),
    ];
  }
  // Os ossos do traje: a cabeça, o corpo e os pais deles, com os mesmos nomes e pivôs do modelo do jogo.
  const precisa = new Set();
  for (let n of ["head", corpoNome]) while (n) {
    precisa.add(n);
    n = osso(n).parent;
  }
  const bones = ossos.filter((b) => precisa.has(b.name)).map((b) => {
    const nb = { name: b.name, pivot: b.pivot ?? [0, 0, 0] };
    if (b.parent) nb.parent = b.parent;
    if (b.rotation) nb.rotation = b.rotation;
    if (b.name === "head") nb.cubes = [capacete];
    if (b.name === corpoNome) nb.cubes = [...(nb.cubes ?? []), ...tanques];
    return nb;
  });
  return { format_version: "1.12.0", "minecraft:geometry": [{ description: { identifier: `geometry.cl_traje_${de}`, texture_width: 64, texture_height: 32, visible_bounds_width: 3, visible_bounds_height: 4, visible_bounds_offset: [0, 1.5, 0] }, bones }] };
}
mkdirSync(join(RAIZ, "RP/models/entity"), { recursive: true });
for (const de of Object.keys(MODELOS)) gravar(`RP/models/entity/cl_traje_${de}.geo.json`, traje(de));
gravar("RP/render_controllers/cl_traje.render_controllers.json", {
  format_version: "1.8.0",
  render_controllers: { "controller.render.cl_traje": { geometry: "Geometry.traje", materials: [{ "*": "Material.traje" }], textures: ["Texture.traje"] } },
});
mkdirSync(join(RAIZ, "RP/textures/entity/cl"), { recursive: true });
writeFileSync(join(RAIZ, "RP/textures/entity/cl/traje_espacial.png"), gerarPng(64, 32, (x, y) => {
  if (x < 16 && y < 16) {
    const borda = x === 0 || y === 0 || x === 15 || y === 15;
    const brilho = (x === 3 && y >= 3 && y <= 6) || (y === 3 && x >= 3 && x <= 6);
    return borda ? [214, 228, 236, 200] : brilho ? [240, 250, 255, 150] : [150, 205, 235, 70];
  }
  if (x >= 16 && x < 24 && y < 8) return y === 1 ? [246, 168, 92, 255] : y === 6 ? [150, 70, 20, 255] : [222, 112, 40, 255];
  if (x >= 24 && x < 28 && y < 4) return [154, 156, 160, 255];
  if (x >= 28 && x < 32 && y < 4) return [70, 72, 76, 255];
  return [0, 0, 0, 0];
}));

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
  c["minecraft:type_family"] = { family: [...new Set([...fam, "evoluido", "lunar", m.id])] };
  // Versão do formato que o jogo 26.30 aceita (o exemplo do enderman já vem num formato mais novo).
  bp.format_version = "1.26.0";
  if (c["minecraft:pushable_by_block"] || c["minecraft:pushable_by_entity"]) {
    delete c["minecraft:pushable_by_block"];
    delete c["minecraft:pushable_by_entity"];
    c["minecraft:pushable"] = { is_pushable: true, is_pushable_by_piston: true };
  }
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
  // O traje por cima do monstro (menos no filhote, que tem outro modelo).
  d.materials = { ...d.materials, traje: "entity_alphablend" };
  d.textures = { ...d.textures, traje: "textures/entity/cl/traje_espacial" };
  d.geometry = { ...d.geometry, traje: `geometry.cl_traje_${m.de}` };
  d.render_controllers = [...d.render_controllers, m.de === "zombie" ? { "controller.render.cl_traje": "!query.is_baby" } : "controller.render.cl_traje"];
  // Ovo próprio só no criativo: mesma figura do ovo do monstro original.
  gravar(`RP/entity/${m.id}.entity.json`, rp);
}
console.log(`evoluídos: ${MOBS.length} entidades`);

// Balão (Mekanism Additions, 1.11.0): modelo próprio (bola, nó e a linha) e uma textura por cor; e a TNT de
// Obsidiana acesa (entidade que explode). Roda à mão quando mudar o desenho (os arquivos gerados vão no repositório):
//   node tools/gerar-baloes.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { CORES } = await import(pathToFileURL(join(RAIZ, "tools/dados/conteudo/f32.mjs")).href);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const json = (rel, o) => writeFileSync(join(RAIZ, rel), JSON.stringify(o, null, 2) + "\n");
const LADOS = ["north", "south", "east", "west", "up", "down"];
const cubo = (origin, size, u, v) => ({ origin, size, uv: Object.fromEntries(LADOS.map((f) => [f, { uv: [u, v], uv_size: [8, 8] }])) });
mkdirSync(join(RAIZ, "RP/textures/entity/cl/balao"), { recursive: true });

json("RP/models/entity/cl_balao.geo.json", {
  format_version: "1.12.0",
  "minecraft:geometry": [{
    description: { identifier: "geometry.cl.balao", texture_width: 32, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 3, visible_bounds_offset: [0, 1, 0] },
    bones: [{ name: "balao", pivot: [0, 0, 0], cubes: [
      cubo([-4, 18, -4], [8, 9, 8], 0, 0), cubo([-3, 17, -3], [6, 11, 6], 0, 0), cubo([-1, 16, -1], [2, 1, 2], 8, 0),
      cubo([-0.25, 0, -0.25], [0.5, 16, 0.5], 16, 0),
    ] }],
  }],
});
for (const [c, , , , cor] of CORES) {
  const rgb = hex(cor);
  writeFileSync(join(RAIZ, `RP/textures/entity/cl/balao/${c}.png`), gerarPng(32, 16, (x, y) => {
    if (x >= 16) return [225, 225, 225, 255]; // linha
    const k = x < 8 ? 1.08 - y * 0.03 + (x + y < 5 ? 0.25 : 0) : 0.8;
    return [...rgb.map((v) => Math.max(0, Math.min(255, Math.round(v * k)))), 255];
  }));
}
json("RP/entity/balao.entity.json", {
  format_version: "1.10.0",
  "minecraft:client_entity": { description: {
    identifier: "cl:balao", materials: { default: "entity_alphatest" },
    textures: Object.fromEntries(CORES.map(([c]) => [c, `textures/entity/cl/balao/${c}`])),
    geometry: { default: "geometry.cl.balao" }, render_controllers: ["controller.render.cl.balao"],
  } },
});
mkdirSync(join(RAIZ, "RP/render_controllers"), { recursive: true });
json("RP/render_controllers/cl_balao.render_controllers.json", {
  format_version: "1.8.0",
  render_controllers: { "controller.render.cl.balao": {
    arrays: { textures: { "Array.cores": CORES.map(([c]) => `Texture.${c}`) } },
    geometry: "Geometry.default", materials: [{ "*": "Material.default" }], textures: ["Array.cores[query.variant]"],
  } },
});
json("BP/entities/balao.json", {
  format_version: "1.21.50",
  "minecraft:entity": {
    description: { identifier: "cl:balao", is_spawnable: false, is_summonable: true },
    components: {
      "minecraft:type_family": { family: ["balao", "inanimate"] },
      "minecraft:health": { value: 1, max: 1 },
      "minecraft:collision_box": { width: 0.5, height: 0.6 },
      "minecraft:physics": { has_gravity: false, has_collision: false },
      "minecraft:pushable": { is_pushable: false, is_pushable_by_piston: false },
      "minecraft:variant": { value: 0 },
      "minecraft:fire_immune": {},
      "minecraft:loot": { table: "loot_tables/empty.json" },
    },
    // A cor vem de um evento logo depois de nascer (o script chama cl:cor_<n>).
    component_groups: Object.fromEntries(CORES.map((_, n) => [`cl:cor_${n}`, { "minecraft:variant": { value: n } }])),
    events: Object.fromEntries(CORES.map((_, n) => [`cl:cor_${n}`, { add: { component_groups: [`cl:cor_${n}`] } }])),
  },
});
// TNT de Obsidiana acesa: 100 ticks de pavio, explosão de raio 12 (obsidianTNTDelay e obsidianTNTBlastRadius).
json("BP/entities/tnt_obsidiana_acesa.json", {
  format_version: "1.21.50",
  "minecraft:entity": {
    description: { identifier: "cl:tnt_obsidiana_acesa", is_spawnable: false, is_summonable: true },
    components: {
      "minecraft:type_family": { family: ["tnt", "inanimate"] },
      "minecraft:collision_box": { width: 0.98, height: 0.98 },
      "minecraft:physics": {},
      "minecraft:pushable": { is_pushable: true, is_pushable_by_piston: true },
      "minecraft:damage_sensor": { triggers: [{ cause: "all", deals_damage: "no" }] },
      "minecraft:explode": { fuse_length: 5, fuse_lit: true, power: 12, causes_fire: false, breaks_blocks: true, destroy_affected_by_griefing: true },
    },
  },
});
json("RP/entity/tnt_obsidiana_acesa.entity.json", {
  format_version: "1.10.0",
  "minecraft:client_entity": { description: {
    identifier: "cl:tnt_obsidiana_acesa", materials: { default: "entity_alphatest" }, textures: { default: "textures/blocks/cl/c/tnt_obsidiana" },
    geometry: { default: "geometry.cl.tnt_bloco" }, render_controllers: ["controller.render.default"],
  } },
});
json("RP/models/entity/cl_tnt_bloco.geo.json", {
  format_version: "1.12.0",
  "minecraft:geometry": [{
    description: { identifier: "geometry.cl.tnt_bloco", texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2, visible_bounds_offset: [0, 0.5, 0] },
    bones: [{ name: "tnt", pivot: [0, 0, 0], cubes: [{ origin: [-8, 0, -8], size: [16, 16, 16], uv: Object.fromEntries(LADOS.map((f) => [f, { uv: [0, 0], uv_size: [16, 16] }])) }] }],
  }],
});
console.log(`balões: ${CORES.length} cores; TNT de obsidiana`);

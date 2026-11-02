// O céu da Lua (1.17.0): Terra, Marte, Júpiter e Saturno. Bedrock não deixa mudar o céu de uma dimensão própria,
// então os planetas são uma entidade sem corpo (cl:ceu_lua) que o script põe nos pés de cada jogador na Lua a cada
// tick (scripts/galacticraft/lua.ts); a geometria dela desenha os planetas a 48 blocos, sempre de frente para o
// centro. Assim ficam no céu, nem perto nem longe, e a névoa preta da Lua (que começa a 75% da distância de
// renderização) não os apaga. Texturas desenhadas aqui (arte própria). Roda à mão quando mudar algo:
//   node tools/gerar-ceu-lua.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const gravar = (rel, obj) => {
  mkdirSync(dirname(join(RAIZ, rel)), { recursive: true });
  writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
};

const D = 48; // distância em blocos
// [nome, azimute°, elevação°, largura e altura em blocos, área na textura (u, v, w, h)]
const PLANETAS = [
  ["terra", 35, 38, 10, 10, [0, 0, 64, 64]],
  ["marte", 160, 52, 3, 3, [64, 0, 32, 32]],
  ["jupiter", 245, 33, 6, 6, [128, 0, 64, 64]],
  ["saturno", 315, 58, 9, 4.5, [0, 64, 128, 64]],
];
const VAZIO = { uv: [200, 70], uv_size: [2, 2] }; // área transparente para as faces de lado

// ---------- Geometria ----------
const bones = [{ name: "ceu", pivot: [0, 0, 0] }];
for (const [nome, az, el, w, h, [u, v, tw, th]] of PLANETAS) {
  const face = { uv: [u, v], uv_size: [tw, th] };
  bones.push({ name: `az_${nome}`, parent: "ceu", pivot: [0, 0, 0], rotation: [0, az, 0] });
  bones.push({
    name: `el_${nome}`, parent: `az_${nome}`, pivot: [0, 0, 0], rotation: [-el, 0, 0],
    // Um plano no lado da frente do modelo (-Z), a D blocos, com o planeta dos dois lados.
    cubes: [{ origin: [(-w * 16) / 2, (-h * 16) / 2, -D * 16], size: [w * 16, h * 16, 0], uv: { north: face, south: face, east: VAZIO, west: VAZIO, up: VAZIO, down: VAZIO } }],
  });
}
gravar("RP/models/entity/ceu_lua.geo.json", {
  format_version: "1.12.0",
  "minecraft:geometry": [{ description: { identifier: "geometry.cl_ceu_lua", texture_width: 256, texture_height: 128, visible_bounds_width: 2 * D + 20, visible_bounds_height: 2 * D + 20, visible_bounds_offset: [0, D / 2, 0] }, bones }],
});

// ---------- Textura (256×128) ----------
const px = new Uint8Array(256 * 128 * 4);
const por = (x, y, [r, g, b], a = 255) => {
  const i = (y * 256 + x) * 4;
  px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
};
// Ruído simples (valor com interpolação) para continentes, manchas e faixas.
const hash = (x, y, s) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const ruido = (x, y, s) => {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};
const fbm = (x, y, s) => ruido(x, y, s) * 0.55 + ruido(x * 2, y * 2, s + 7) * 0.3 + ruido(x * 4, y * 4, s + 13) * 0.15;
const mistura = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
const luz = (cor, k) => cor.map((v) => Math.max(0, Math.min(255, Math.round(v * k))));

/** Pinta um disco na área (u, v, w, h): cor(nx, ny, x, y) com nx, ny de -1 a 1 dentro do disco; sombra no limbo. */
function disco(u, v, w, h, r, cor, cx = w / 2, cy = h / 2) {
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const nx = (x + 0.5 - cx) / r, ny = (y + 0.5 - cy) / r, d2 = nx * nx + ny * ny;
    if (d2 > 1) continue;
    const nz = Math.sqrt(1 - d2);
    const k = 0.45 + 0.55 * Math.max(0, nz * 0.8 - nx * 0.35 - ny * 0.25); // luz vinda de cima à esquerda
    por(u + x, v + y, luz(cor(nx, ny, x, y), k));
  }
}

// Terra: oceano, continentes, gelo nos polos e nuvens.
disco(0, 0, 64, 64, 31, (nx, ny, x, y) => {
  let c = fbm(x / 9, y / 9, 1) > 0.6 ? mistura([70, 140, 60], [150, 130, 80], Math.max(0, fbm(x / 5, y / 5, 3) - 0.4)) : [30, 80, 175];
  if (Math.abs(ny) > 0.82) c = [235, 240, 245];
  if (fbm(x / 6 + 20, y / 4, 5) > 0.66) c = mistura(c, [250, 250, 252], 0.8);
  return c;
});
// Marte: vermelho com manchas e uma calota polar.
disco(64, 0, 32, 32, 15, (nx, ny, x, y) => (ny < -0.8 ? [240, 235, 230] : mistura([196, 92, 50], [120, 50, 30], Math.max(0, fbm(x / 4, y / 4, 9) - 0.45) * 1.6)));
// Júpiter: faixas e a Grande Mancha Vermelha.
disco(128, 0, 64, 64, 31, (nx, ny, x, y) => {
  const faixa = Math.sin(ny * 11 + fbm(x / 8, y / 3, 11) * 2.2);
  let c = faixa > 0.35 ? [222, 196, 160] : faixa > -0.4 ? [196, 150, 110] : [150, 105, 75];
  const ex = (nx - 0.3) / 0.22, ey = (ny - 0.35) / 0.12;
  if (ex * ex + ey * ey < 1) c = [200, 90, 60];
  return c;
});
// Saturno: anéis por trás, o planeta e os anéis da frente.
const anel = (x, y) => {
  const dx = (x + 0.5 - 64) / 60, dy = (y + 0.5 - 32) / 15, r = Math.sqrt(dx * dx + dy * dy);
  return r > 0.52 && r < 0.98 && !(r > 0.74 && r < 0.78) ? r : 0;
};
for (let y = 0; y < 64; y++) for (let x = 0; x < 128; x++) if (anel(x, y) && y < 32) por(x, 64 + y, mistura([210, 190, 150], [150, 130, 100], (anel(x, y) - 0.52) * 2));
disco(0, 64, 128, 64, 22, (nx, ny) => (Math.sin(ny * 9) > 0.2 ? [226, 204, 150] : [200, 172, 120]));
for (let y = 32; y < 64; y++) for (let x = 0; x < 128; x++) if (anel(x, y)) por(x, 64 + y, mistura([220, 200, 160], [160, 140, 110], (anel(x, y) - 0.52) * 2));

writeFileSync(join(RAIZ, "RP/textures/entity/cl/planetas.png"), gerarPng(256, 128, (x, y) => {
  const i = (y * 256 + x) * 4;
  return [px[i], px[i + 1], px[i + 2], px[i + 3]];
}));

// ---------- Entidade ----------
gravar("BP/entities/ceu_lua.json", {
  format_version: "1.26.0",
  "minecraft:entity": {
    description: { identifier: "cl:ceu_lua", is_spawnable: false, is_summonable: true },
    components: {
      "minecraft:collision_box": { width: 0.01, height: 0.01 },
      "minecraft:physics": { has_gravity: false, has_collision: false },
      "minecraft:pushable": { is_pushable: false, is_pushable_by_piston: false },
      "minecraft:damage_sensor": { triggers: { cause: "all", deals_damage: "no" } },
      "minecraft:knockback_resistance": { value: 1 },
      "minecraft:type_family": { family: ["inanimate", "ceu_lua"] },
    },
  },
});
gravar("RP/entity/ceu_lua.entity.json", {
  format_version: "1.10.0",
  "minecraft:client_entity": {
    description: {
      identifier: "cl:ceu_lua",
      // Brilha sozinho (a Lua é escura) e o fundo transparente da textura não aparece.
      materials: { default: "entity_emissive_alpha" },
      textures: { default: "textures/entity/cl/planetas" },
      geometry: { default: "geometry.cl_ceu_lua" },
      render_controllers: ["controller.render.default"],
    },
  },
});
console.log(`céu da Lua: ${PLANETAS.length} planetas a ${D} blocos`);

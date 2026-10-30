// Modelos e texturas das entidades da 1.10.0: a Mochila (Backpacks) no chão e o Robô Minerador (a Mining Turtle do
// ComputerCraft: caixa amarelada com tela na frente e a picareta de diamante do lado). Mesmo jeito do foguete:
// cada face de cada cubo usa uma "amostra" de cor da textura 64×64.
// Roda à mão quando mudar o desenho (os arquivos gerados vão no repositório):
//   node tools/gerar-modelos-utilidades.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const LADOS = ["north", "south", "east", "west", "up", "down"];

const MODELOS = {
  mochila: {
    amostras: { couro: [0, 0, "#8b5a2b"], escuro: [1, 0, "#5e3b1c"], fivela: [2, 0, "#c8ccd0"], alca: [3, 0, "#6e4522"] },
    // [origem, tamanho, amostra, amostra da frente (north)?]
    cubos: [
      [[-5, 0, -3], [10, 11, 6], "couro"],
      [[-5.2, 7, -3.2], [10.4, 4.2, 6.4], "escuro"],
      [[-1, 6, -3.4], [2, 2, 0.4], "fivela"],
      [[-4, 1, -4.2], [8, 5, 1.2], "couro"],
      [[-4, 2, 3], [2, 9, 1], "alca"],
      [[2, 2, 3], [2, 9, 1], "alca"],
    ],
    bounds: [1.2, 1.2, 0.4],
  },
  robo_minerador: {
    amostras: { casco: [0, 0, "#d9c37a"], borda: [1, 0, "#a8924e"], tela: [2, 0, "#1d2b22"], texto: [3, 0, "#58d26b"], cabo: [0, 1, "#8a6a3a"], diamante: [1, 1, "#6ff0e6"] },
    cubos: [
      [[-6, 0, -6], [12, 12, 12], "casco"],
      [[-6.2, 0, -6.2], [12.4, 1.5, 12.4], "borda"],
      [[-4, 4, -6.3], [8, 6, 0.4], "tela"],
      [[-3, 7.5, -6.4], [3, 1, 0.2], "texto"],
      [[-3, 5.5, -6.4], [5, 1, 0.2], "texto"],
      // Picareta do lado direito
      [[6, 5, -1], [1, 2, 2], "borda"],
      [[7, 5.5, -0.5], [6, 1, 1], "cabo"],
      [[12, 2, -0.5], [1, 8, 1], "diamante"],
      [[11, 2, -0.5], [1, 1, 1], "diamante"],
      [[11, 9, -0.5], [1, 1, 1], "diamante"],
    ],
    bounds: [1.6, 1.2, 0.5],
  },
};

mkdirSync(join(RAIZ, "RP/models/entity"), { recursive: true });
mkdirSync(join(RAIZ, "RP/textures/entity/cl"), { recursive: true });
for (const [nome, m] of Object.entries(MODELOS)) {
  const face = (a) => {
    const [c, l] = m.amostras[a];
    return { uv: [c * 16 + 2, l * 16 + 2], uv_size: [12, 12] };
  };
  const geo = {
    format_version: "1.12.0",
    "minecraft:geometry": [
      {
        description: { identifier: `geometry.cl.${nome}`, texture_width: 64, texture_height: 64, visible_bounds_width: m.bounds[0], visible_bounds_height: m.bounds[1], visible_bounds_offset: [0, m.bounds[2], 0] },
        bones: [{ name: nome, pivot: [0, 0, 0], cubes: m.cubos.map(([origin, size, a]) => ({ origin, size, uv: Object.fromEntries(LADOS.map((f) => [f, face(a)])) })) }],
      },
    ],
  };
  writeFileSync(join(RAIZ, `RP/models/entity/cl_${nome}.geo.json`), JSON.stringify(geo, null, 2) + "\n");
  const porPixel = {};
  for (const [a, [c, l, cor]] of Object.entries(m.amostras)) porPixel[`${c},${l}`] = [a, hex(cor)];
  const png = gerarPng(64, 64, (x, y) => {
    const p = porPixel[`${Math.floor(x / 16)},${Math.floor(y / 16)}`];
    if (!p) return [0, 0, 0, 0];
    const lx = x % 16, ly = y % 16;
    let k = 1.06 - ly * 0.012;
    if (lx < 2 || ly < 2 || lx > 13 || ly > 13) k *= 0.82;
    if ((lx * 7 + ly * 3) % 13 === 0) k *= 0.95;
    return [...p[1].map((v) => Math.max(0, Math.min(255, Math.round(v * k)))), 255];
  });
  writeFileSync(join(RAIZ, `RP/textures/entity/cl/${nome}.png`), png);
}
console.log(`modelos: ${Object.keys(MODELOS).join(", ")}`);

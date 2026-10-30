// Modelo e textura do Foguete Tier 1 (Galacticraft): corpo branco com faixas vermelhas, janela, bico em degraus,
// 4 aletas e o bocal do motor. Cada face de cada cubo usa uma "amostra" de cor da textura 64×64.
// Roda à mão quando mudar o desenho (os arquivos gerados vão no repositório):
//   node tools/gerar-foguete.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

// Amostras 16×16 na textura (coluna, linha) e a cor de cada uma.
const AMOSTRA = {
  branco: [0, 0, "#eef1f4"],
  vermelho: [1, 0, "#d63a3a"],
  metal: [2, 0, "#9aa3ab"],
  escuro: [3, 0, "#3a4048"],
  janela: [0, 1, "#2a7fd0"],
  brasa: [1, 1, "#ff8a2a"],
  antena: [2, 1, "#c8ccd0"],
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// Cubos: [origem, tamanho, amostra das faces laterais, amostra de cima/baixo?]
const CUBOS = [
  [[-4, 0, -4], [8, 4, 8], "escuro"],
  [[-2.5, 0.2, -2.5], [5, 0.2, 5], "brasa"],
  [[-6, 4, -6], [12, 30, 12], "branco"],
  [[-6.5, 13, -6.5], [13, 3, 13], "vermelho"],
  [[-6.5, 31, -6.5], [13, 2, 13], "vermelho"],
  [[-2.5, 23, -6.6], [5, 5, 0.6], "janela"],
  [[-5, 34, -5], [10, 6, 10], "branco"],
  [[-3.5, 40, -3.5], [7, 5, 7], "vermelho"],
  [[-2, 45, -2], [4, 4, 4], "vermelho"],
  [[-0.75, 49, -0.75], [1.5, 4, 1.5], "antena"],
  // Aletas
  [[-1, 2, -12], [2, 14, 6], "metal"],
  [[-1, 2, 6], [2, 14, 6], "metal"],
  [[6, 2, -1], [6, 14, 2], "metal"],
  [[-12, 2, -1], [6, 14, 2], "metal"],
];

const face = (nome) => {
  const [c, l] = AMOSTRA[nome];
  return { uv: [c * 16 + 2, l * 16 + 2], uv_size: [12, 12] };
};
const geo = {
  format_version: "1.12.0",
  "minecraft:geometry": [
    {
      description: { identifier: "geometry.cl.foguete", texture_width: 64, texture_height: 64, visible_bounds_width: 3, visible_bounds_height: 4, visible_bounds_offset: [0, 1.6, 0] },
      bones: [
        {
          name: "foguete",
          pivot: [0, 0, 0],
          cubes: CUBOS.map(([origin, size, amostra]) => ({
            origin,
            size,
            uv: Object.fromEntries(["north", "south", "east", "west", "up", "down"].map((f) => [f, face(amostra)])),
          })),
        },
      ],
    },
  ],
};
mkdirSync(join(RAIZ, "RP/models/entity"), { recursive: true });
writeFileSync(join(RAIZ, "RP/models/entity/cl_foguete.geo.json"), JSON.stringify(geo, null, 2) + "\n");

// Textura: cada amostra com um leve degradê (luz de cima) e borda mais escura, para não ficar chapado.
const porPixel = {};
for (const [nome, [c, l, cor]] of Object.entries(AMOSTRA)) porPixel[`${c},${l}`] = [nome, hex(cor)];
const png = gerarPng(64, 64, (x, y) => {
  const a = porPixel[`${Math.floor(x / 16)},${Math.floor(y / 16)}`];
  if (!a) return [0, 0, 0, 0];
  const [nome, rgb] = a;
  const lx = x % 16, ly = y % 16;
  let k = 1.06 - ly * 0.012;
  if (lx < 2 || ly < 2 || lx > 13 || ly > 13) k *= 0.82;
  if (nome === "janela" && lx + ly > 9 && lx + ly < 13) k = 1.5;
  if (nome === "branco" && (lx * 7 + ly * 3) % 17 === 0) k *= 0.96;
  return [...rgb.map((v) => Math.max(0, Math.min(255, Math.round(v * k)))), 255];
});
mkdirSync(join(RAIZ, "RP/textures/entity/cl"), { recursive: true });
writeFileSync(join(RAIZ, "RP/textures/entity/cl/foguete.png"), png);
console.log("foguete: modelo e textura gerados");

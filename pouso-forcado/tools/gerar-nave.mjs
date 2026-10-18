// Gera BP/structures/cl/nave_caida.mcstructure (a nave caída do spawn) a partir de
// um modelo em código. Para trocar por uma nave feita à mão no jogo, exporte com o
// Bloco de Estrutura e salve por cima deste arquivo (o build não sobrescreve; use --force para regerar).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { comp, int, list, nbt, str } from "./nbt.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const DESTINO = join(RAIZ, "BP/structures/cl/nave_caida.mcstructure");
const FORCAR = process.argv.includes("--force");

// Tamanho (x = largura, y = altura, z = comprimento). y = 2 é o nível do chão:
// a estrutura é colocada 2 blocos abaixo da superfície, então a nave fica meio enterrada.
const X = 13, Y = 7, Z = 17;
export const BAU = { x: 6, y: 2, z: 8 }; // posição do baú de suprimentos (colocado pelo script)

// Versão do formato de blocos: 1.26.0.0 codificado como (maior<<24 | menor<<16 | patch<<8 | rev).
const VERSAO_BLOCOS = (1 << 24) | (26 << 16) | (0 << 8) | 0;

const AR = "minecraft:air";
const CASCO = "minecraft:light_gray_concrete";
const CASCO_BAIXO = "minecraft:gray_concrete";
const FAIXA = "minecraft:orange_concrete";
const VIDRO = "minecraft:glass";
const MOTOR = "minecraft:magma";
const BOCAL = "minecraft:black_concrete";
const ASA = "minecraft:white_concrete";
const SUCATA = "minecraft:polished_andesite";
const AREIA = "minecraft:sand";

const grade = new Array(X * Y * Z).fill(null); // null = vazio de estrutura (não mexe no terreno)
const indice = (x, y, z) => (x * Y + y) * Z + z;
function por(x, y, z, bloco) {
  if (x < 0 || y < 0 || z < 0 || x >= X || y >= Y || z >= Z) return;
  grade[indice(x, y, z)] = bloco;
}
// "Aleatório" determinístico, para os furos do casco saírem sempre iguais.
const sorte = (x, y, z) => (((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) >>> 0) % 100;

// Fuselagem: seção 7x5 com cantos arredondados; cauda mais alta que o nariz (nave inclinada).
const baseY = (z) => Math.round((15 - z) / 7);
for (let z = 0; z <= 15; z++) {
  const yb = baseY(z);
  for (let lx = 0; lx <= 6; lx++) {
    for (let ly = 0; ly <= 4; ly++) {
      const canto = (lx === 0 || lx === 6) && (ly === 0 || ly === 4);
      if (canto) continue;
      const x = 3 + lx, y = yb + ly;
      const borda = lx === 0 || lx === 6 || ly === 0 || ly === 4;
      if (!borda) { por(x, y, z, AR); continue; }
      let bloco = ly === 0 ? CASCO_BAIXO : (ly === 2 ? FAIXA : CASCO);
      if (ly >= 2 && sorte(x, y, z) < 12) bloco = AR; // furos da queda
      por(x, y, z, bloco);
    }
  }
}

// Cauda: bocal do motor ainda quente.
for (let x = 4; x <= 8; x++) {
  for (let y = 3; y <= 5; y++) {
    por(x, y, 0, (x - 6) ** 2 + (y - 4) ** 2 <= 1 ? MOTOR : BOCAL);
  }
}

// Nariz: cabine de vidro enterrada na areia.
for (let x = 4; x <= 8; x++) {
  por(x, 0, 16, CASCO_BAIXO);
  for (let y = 1; y <= 3; y++) por(x, y, 16, VIDRO);
}

// Asa esquerda inteira (afinando para trás) e asa direita quebrada.
for (let z = 9; z <= 12; z++) {
  const y = baseY(z) + 1;
  const comprimento = [3, 3, 2, 1][z - 9];
  for (let x = 3 - comprimento; x < 3; x++) por(x, y, z, ASA);
}
por(10, baseY(9) + 1, 9, ASA);
por(10, baseY(10) + 1, 10, ASA);

// Porta lateral (rasgo no casco esquerdo).
for (const z of [5, 6]) for (let y = baseY(z) + 1; y <= baseY(z) + 2; y++) por(3, y, z, AR);

// Destroços espalhados e areia empilhada no nariz.
for (const [x, z] of [[11, 13], [12, 14], [11, 15], [0, 3], [12, 5]]) por(x, 2, z, SUCATA);
por(12, 2, 13, ASA);
for (const [x, z] of [[2, 15], [2, 16], [10, 15], [10, 16], [3, 16], [9, 16]]) por(x, 2, z, AREIA);

if (grade[indice(BAU.x, BAU.y, BAU.z)] !== AR) throw new Error("posição do baú não está livre");

// Monta a paleta e os índices.
const paleta = [];
const indicesPaleta = new Map();
const camada = grade.map((bloco) => {
  if (bloco === null) return -1;
  if (!indicesPaleta.has(bloco)) {
    indicesPaleta.set(bloco, paleta.length);
    paleta.push(bloco);
  }
  return indicesPaleta.get(bloco);
});

const raiz = comp({
  format_version: int(1),
  size: list("int", [int(X), int(Y), int(Z)]),
  structure: comp({
    block_indices: list("list", [
      list("int", camada.map(int)),
      list("int", camada.map(() => int(-1))),
    ]),
    entities: list("compound", []),
    palette: comp({
      default: comp({
        block_palette: list("compound", paleta.map((nome) => comp({
          name: str(nome),
          states: comp({}),
          version: int(VERSAO_BLOCOS),
        }))),
        block_position_data: comp({}),
      }),
    }),
  }),
  structure_world_origin: list("int", [int(0), int(0), int(0)]),
});

if (existsSync(DESTINO) && !FORCAR) {
  console.log("mantido  BP/structures/cl/nave_caida.mcstructure");
} else {
  mkdirSync(dirname(DESTINO), { recursive: true });
  writeFileSync(DESTINO, nbt(raiz));
  const usados = camada.filter((i) => i >= 0).length;
  console.log(`gerado   BP/structures/cl/nave_caida.mcstructure (${X}x${Y}x${Z}, ${usados} blocos, ${paleta.length} tipos)`);
}

// Gera BP/structures/cl/aviao_caido_<n>.mcstructure (em pedaços), o avião caído do começo do jogo, a partir de
// tools/dados/nave/aviao.json (os comandos do pacote "Nativo 3.1 — Asas Recuadas" feito pelo jogador).
// Mudanças em cima do modelo: sem as 4 turbinas das asas, um buraco grande e rasgado na traseira da
// fuselagem (com cratera e destroços em volta), o baú de suprimentos e o lugar do Painel da Nave.
// As posições de NAVE (scripts/config.ts) saem daqui: o script confere e para se não baterem.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Estrutura, sorte } from "./mcstructure.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PASTA = join(RAIZ, "BP/structures/cl");
const LARGURA_PARTE = 48; // o jogo só garante estruturas de até 64 blocos: o avião vai em pedaços lado a lado
const modelo = JSON.parse(readFileSync(join(RAIZ, "tools/dados/nave/aviao.json"), "utf8"));

// 1) Monta a grade do modelo (coordenadas do modelo: nariz em +x, y = 0 é o chão).
const g = new Map();
const k = (x, y, z) => `${x},${y},${z}`;
for (const [x1, y1, z1, x2, y2, z2, i] of modelo.comandos) {
  const b = `minecraft:${modelo.paleta[i]}`;
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
      for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) g.set(k(x, y, z), b);
}
const ler = (x, y, z) => g.get(k(x, y, z));
const AR = "minecraft:air";
const vazio = (b) => b === undefined || b === AR;

// 2) Tira as 4 turbinas das asas. Acima e abaixo da asa sai tudo; na altura da asa (y 2 e 3) o miolo
// escuro da turbina vira asa de novo, para não ficar buraco.
const TURBINAS = [
  { x: [-24, -14], z: [-22, -18], asa: false }, // esquerda de fora (pendurada para fora da ponta)
  { x: [-16, -6], z: [-10, -6], asa: true }, // esquerda de dentro
  { x: [-16, -6], z: [6, 10], asa: true }, // direita de dentro
  { x: [-22, -12], z: [12, 16], asa: true }, // direita de fora
];
const MIOLO = new Set(["black_concrete", "iron_block", "orange_terracotta", "blackstone", "fire", "netherrack"].map((b) => `minecraft:${b}`));
const ASA = { 2: "minecraft:light_gray_concrete", 3: "minecraft:smooth_quartz" };
for (const t of TURBINAS) {
  for (let x = t.x[0]; x <= t.x[1]; x++)
    for (let z = t.z[0]; z <= t.z[1]; z++)
      for (let y = 1; y <= 6; y++) {
        const b = ler(x, y, z);
        if (vazio(b)) continue;
        if (t.asa && (y === 2 || y === 3)) {
          // Fica o que é asa; o miolo da turbina vira chapa da asa se tiver asa encostada.
          if (!MIOLO.has(b)) continue;
          const vizinhaAsa = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dz]) => ler(x + dx, y, z + dz) === ASA[y]);
          g.set(k(x, y, z), vizinhaAsa ? ASA[y] : AR);
        } else g.set(k(x, y, z), AR);
      }
}
// Pedaços de turbina que sobram embaixo das asas (y 2 e 3 fora do contorno da asa).
for (const t of TURBINAS) {
  for (let x = t.x[0]; x <= t.x[1]; x++)
    for (let z = t.z[0]; z <= t.z[1]; z++)
      for (const y of [2, 3]) {
        const b = ler(x, y, z);
        if (vazio(b) || !t.asa) continue;
        const asaEmVolta = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dz]) => !vazio(ler(x + dx, y, z + dz))).length;
        if (asaEmVolta <= 1) g.set(k(x, y, z), AR);
      }
}

// 3) Buraco grande na traseira: elipsoide rasgado (borda irregular) no lado esquerdo de cima da
// fuselagem, perto da cauda, atravessando o piso até uma cratera no chão.
const BURACO = { x: -31, y: 5, z: -2, rx: 8.5, ry: 5, rz: 6 };
const dentroBuraco = (x, y, z, folga = 0) => {
  const d = ((x - BURACO.x) / BURACO.rx) ** 2 + ((y - BURACO.y) / BURACO.ry) ** 2 + ((z - BURACO.z) / BURACO.rz) ** 2;
  return d < 1 + folga + (sorte(x, y, z) - 50) / 160;
};
const QUEIMADO = ["minecraft:black_concrete", "minecraft:blackstone", "minecraft:coal_block"];
for (let x = BURACO.x - 9; x <= BURACO.x + 9; x++)
  for (let y = 1; y <= 12; y++)
    for (let z = BURACO.z - 8; z <= BURACO.z + 8; z++) {
      const b = ler(x, y, z);
      if (vazio(b)) continue;
      if (dentroBuraco(x, y, z)) g.set(k(x, y, z), AR);
      else if (dentroBuraco(x, y, z, 0.35) && sorte(x, y, z) < 35) g.set(k(x, y, z), QUEIMADO[sorte(z, x, y) % 3]); // borda chamuscada
    }
// Cratera embaixo do buraco (chão afundado e queimado).
for (let x = BURACO.x - 7; x <= BURACO.x + 7; x++)
  for (let z = BURACO.z - 6; z <= BURACO.z + 6; z++) {
    const d = ((x - BURACO.x) / 7) ** 2 + ((z - BURACO.z) / 6) ** 2;
    if (d >= 1) continue;
    const fundo = d < 0.35 ? -2 : d < 0.7 ? -1 : 0;
    for (let y = fundo; y <= 0; y++) g.set(k(x, y, z), AR);
    g.set(k(x, fundo - 1, z), sorte(x, fundo, z) < 45 ? "minecraft:coarse_dirt" : sorte(x, 0, z) < 70 ? "minecraft:blackstone" : "minecraft:magma");
  }
// Destroços jogados para trás e para a esquerda do buraco.
const SUCATA = ["minecraft:light_gray_concrete", "minecraft:white_concrete", "minecraft:iron_block", "minecraft:smooth_quartz", "minecraft:gray_concrete", "minecraft:black_concrete"];
for (let x = BURACO.x - 16; x <= BURACO.x + 6; x++)
  for (let z = BURACO.z - 18; z <= BURACO.z + 4; z++) {
    if (sorte(x, 7, z) >= 9) continue;
    const d = ((x - BURACO.x) / 7) ** 2 + ((z - BURACO.z) / 6) ** 2;
    if (d < 1.1) continue; // não dentro da cratera
    let y = 1;
    while (!vazio(ler(x, y, z)) && y < 4) y++;
    if (y > 1 && sorte(x, y, z) < 60) continue; // em cima do avião só às vezes
    if (vazio(ler(x, y - 1, z)) && y - 1 > 0) continue;
    g.set(k(x, y, z), SUCATA[sorte(z, y, x) % SUCATA.length]);
  }

// 4) Carga: o baú de suprimentos (o script põe os itens) e os outros baús viram barris vazios.
const BAU_MODELO = { x: -16, y: 4, z: 2 };
for (const [x, y, z] of [[-22, 4, -2], [-22, 4, 2], [-16, 4, -2]]) g.set(k(x, y, z), "minecraft:barrel");
g.set(k(BAU_MODELO.x, BAU_MODELO.y, BAU_MODELO.z), AR); // o script põe o baú com os itens
// Painel da Nave no meio do painel de controle da cabine (o script põe virado para o piloto).
const PAINEL_MODELO = { x: -3, y: 4, z: 0 };
g.set(k(PAINEL_MODELO.x, PAINEL_MODELO.y, PAINEL_MODELO.z), AR);

// 5) Recorte e conversão. O chão liso do modelo (areia e arenito) não entra: fica o terreno do mundo.
// Dentro do contorno do avião, do chão até o teto, o vazio vira ar (limpa morro e areia de dentro).
const X0 = -80, X1 = 14, Z0 = -32, Z1 = 26, Y0 = -3, Y1 = 18;
const nave = new Estrutura(X1 - X0 + 1, Y1 - Y0 + 1, Z1 - Z0 + 1);
const CHAO = new Set(["minecraft:sand", "minecraft:sandstone"]);
for (const [chave, b] of g) {
  const [x, y, z] = chave.split(",").map(Number);
  if (x < X0 || x > X1 || z < Z0 || z > Z1 || y < Y0 || y > Y1) continue;
  if (y <= 0 && CHAO.has(b)) continue;
  nave.por(x - X0, y - Y0, z - Z0, b);
}
for (let x = X0; x <= X1; x++)
  for (let z = Z0; z <= Z1; z++) {
    let topo = 0;
    for (let y = 1; y <= Y1; y++) if (!vazio(ler(x, y, z)) && x >= -45) topo = y;
    for (let y = 1; y <= topo; y++) if (nave.obter(x - X0, y - Y0, z - Z0) === null) nave.por(x - X0, y - Y0, z - Z0, AR);
  }

// 6) Posições para o script (relativas à origem da estrutura) e o lugar do jogador.
// No pacote original o jogador fica 8 blocos à frente da âncora e 30 ao lado, olhando o avião.
const rel = (p) => ({ x: p.x - X0, y: p.y - Y0, z: p.z - Z0 });
const JOGADOR = { x: 8, y: 1, z: -30 };
const esperado = {
  tamanho: { x: nave.X, y: nave.Y, z: nave.Z },
  deslocamento: { x: X0 - JOGADOR.x, y: Y0 - JOGADOR.y, z: Z0 - JOGADOR.z },
  bau: rel(BAU_MODELO),
  painel: rel(PAINEL_MODELO),
};
const partes = Math.ceil(nave.X / LARGURA_PARTE);
const config = readFileSync(join(RAIZ, "scripts/config.ts"), "utf8");
for (const [nome, v] of Object.entries(esperado)) {
  const txt = `${nome}: { x: ${v.x}, y: ${v.y}, z: ${v.z} }`;
  if (!config.includes(txt)) throw new Error(`scripts/config.ts (NAVE) precisa de "${txt}"`);
}
if (!config.includes(`partes: ${partes}, larguraParte: ${LARGURA_PARTE}`)) throw new Error(`scripts/config.ts (NAVE) precisa de "partes: ${partes}, larguraParte: ${LARGURA_PARTE}"`);
for (let i = 0; i < partes; i++) {
  const x0 = i * LARGURA_PARTE, largura = Math.min(LARGURA_PARTE, nave.X - x0);
  const parte = new Estrutura(largura, nave.Y, nave.Z);
  for (let x = 0; x < largura; x++) for (let y = 0; y < nave.Y; y++) for (let z = 0; z < nave.Z; z++) parte.por(x, y, z, nave.obter(x0 + x, y, z));
  parte.salvar(join(PASTA, `aviao_caido_${i}.mcstructure`), `BP/structures/cl/aviao_caido_${i}.mcstructure`, true);
}

// Para revisar: AVIAO_DUMP=<arquivo.json> grava a grade final (coordenadas do modelo).
if (process.env.AVIAO_DUMP) {
  const { writeFileSync } = await import("node:fs");
  const lista = [];
  for (let x = 0; x < nave.X; x++)
    for (let y = 0; y < nave.Y; y++)
      for (let z = 0; z < nave.Z; z++) {
        const b = nave.obter(x, y, z);
        if (b !== null) lista.push([x + X0, y + Y0, z + Z0, b]);
      }
  writeFileSync(process.env.AVIAO_DUMP, JSON.stringify(lista));
}

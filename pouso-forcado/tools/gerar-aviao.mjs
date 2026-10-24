// Gera BP/structures/cl/aviao_caido_<n>.mcstructure (em pedaços), o avião caído do começo do jogo, a partir de
// tools/dados/nave/aviao.json (os comandos do pacote "Nativo 3.1 — Asas Recuadas" feito pelo jogador).
// Mudanças em cima do modelo: sem as 4 turbinas das asas, casco fechado (abrigo), o baú de suprimentos,
// o lugar do Painel da Nave e das portas.
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

// 3) O avião fica inteiro (abrigo para a noite). Os dois vãos do modelo viram portas: a dupla do lado
// esquerdo e a simples do lado direito. A verga em cima da porta é fechada (a porta tem 2 de altura) e as
// portas são postas pelo script (scripts/mundo/nave.ts), porque a estrutura não guarda estados de bloco.
const PORTAS_MODELO = [{ x: -13, y: 4, z: -4 }, { x: -12, y: 4, z: -4 }, { x: -8, y: 4, z: 4 }];
const vizinhoComum = (x, y, z) => {
  const conta = new Map();
  for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
    const b = ler(x + dx, y + dy, z + dz);
    if (!vazio(b) && b !== "minecraft:fire") conta.set(b, (conta.get(b) ?? 0) + 1);
  }
  return [...conta].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "minecraft:light_gray_concrete";
};
for (const p of PORTAS_MODELO) {
  g.set(k(p.x, p.y, p.z), AR);
  g.set(k(p.x, p.y + 1, p.z), AR);
  g.set(k(p.x, p.y + 2, p.z), vizinhoComum(p.x, p.y + 2, p.z));
}
// Fecha os furos que sobrarem no casco: procura um caminho de dentro do porão até fora e tapa o vão de
// parede mais de fora do caminho, até não haver mais caminho (com as portas contadas como fechadas).
const ehPorta = (x, y, z) => PORTAS_MODELO.some((p) => p.x === x && p.z === z && (y === p.y || y === p.y + 1));
const solido = (x, y, z) => (!vazio(ler(x, y, z)) && ler(x, y, z) !== "minecraft:fire") || ehPorta(x, y, z);
const LADOS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const CAIXA = { x: [-45, 8], y: [2, 14], z: [-9, 9] };
let selados = 0;
for (;;) {
  const ini = k(-20, 5, 0), pai = new Map([[ini, null]]), fila = [ini];
  let fora = null;
  while (fila.length && !fora) {
    const [x, y, z] = fila.shift().split(",").map(Number);
    for (const [dx, dy, dz] of LADOS) {
      const n = [x + dx, y + dy, z + dz], kn = k(...n);
      if (pai.has(kn) || solido(...n)) continue;
      pai.set(kn, k(x, y, z));
      if (n[0] < CAIXA.x[0] || n[0] > CAIXA.x[1] || n[1] < CAIXA.y[0] || n[1] > CAIXA.y[1] || n[2] < CAIXA.z[0] || n[2] > CAIXA.z[1]) { fora = kn; break; }
      fila.push(kn);
    }
  }
  if (!fora) break;
  if (++selados > 60) throw new Error("o casco do avião tem furos demais para fechar");
  const caminho = [];
  for (let c = fora; c; c = pai.get(c)) caminho.push(c.split(",").map(Number));
  let alvo = caminho[1];
  for (const c of [...caminho].reverse()) {
    if ([[1, 0, 0], [0, 1, 0], [0, 0, 1]].some(([a, b, d]) => solido(c[0] + a, c[1] + b, c[2] + d) && solido(c[0] - a, c[1] - b, c[2] - d))) alvo = c;
  }
  g.set(k(...alvo), vizinhoComum(...alvo));
}
// Luz no fundo da cauda: o teto ganha lanternas do mar, para não nascer monstro lá dentro.
for (const x of [-37, -32, -29]) {
  let y = 5;
  while (y < 12 && !solido(x, y, 0)) y++;
  if (y < 12) g.set(k(x, y, 0), "minecraft:sea_lantern");
}

// 4) Carga: o baú de suprimentos (o script põe os itens) e os outros baús viram barris vazios.
const BAU_MODELO = { x: -16, y: 4, z: 2 };
for (const [x, y, z] of [[-22, 4, -2], [-22, 4, 2], [-16, 4, -2]]) g.set(k(x, y, z), "minecraft:barrel");
g.set(k(BAU_MODELO.x, BAU_MODELO.y, BAU_MODELO.z), AR); // o script põe o baú com os itens
// Painel da Nave no meio do painel de controle da cabine (o script põe virado para o piloto).
const PAINEL_MODELO = { x: -3, y: 4, z: 0 };
g.set(k(PAINEL_MODELO.x, PAINEL_MODELO.y, PAINEL_MODELO.z), AR);

// 5) O avião afunda AFUNDA blocos na areia (1.3.2): a asa fica rente ao chão e as portas abrem no nível do
// chão, sem vão escuro embaixo onde nascem monstros. O que sobra de vão embaixo (cauda) vira areia. Os
// destroços da queda (o que não está preso ao avião) ficam no chão, onde estavam.
// Coordenadas finais: h = altura em relação ao chão do mundo (h = 0 é o bloco de cima do chão).
const AFUNDA = 3;
const solidoModelo = (c) => !vazio(g.get(c)) && g.get(c) !== "minecraft:fire";
const aviao = new Set();
{
  const ini = k(-20, 3, 0);
  if (!solidoModelo(ini)) throw new Error("piso do avião não encontrado em -20,3,0");
  const fila = [ini];
  aviao.add(ini);
  while (fila.length) {
    const [x, y, z] = fila.pop().split(",").map(Number);
    for (const [dx, dy, dz] of LADOS) {
      const n = k(x + dx, y + dy, z + dz);
      if (y + dy >= 1 && !aviao.has(n) && solidoModelo(n)) {
        aviao.add(n);
        fila.push(n);
      }
    }
  }
  // Peças que só encostam pela quina (lanternas do teto, peças do painel) também são do avião. Só acima da
  // asa (y >= 3): os destroços do chão, encostados na asa pela quina, ficam fora.
  for (let novos = true; novos; ) {
    novos = false;
    for (const [c, b] of g) {
      const [x, y, z] = c.split(",").map(Number);
      if (y < 3 || aviao.has(c) || vazio(b) || b === "minecraft:fire") continue;
      let encosta = false;
      for (let dx = -1; dx <= 1 && !encosta; dx++)
        for (let dy = -1; dy <= 1 && !encosta; dy++) for (let dz = -1; dz <= 1 && !encosta; dz++) encosta = aviao.has(k(x + dx, y + dy, z + dz));
      if (encosta) {
        aviao.add(c);
        novos = true;
      }
    }
  }
}
// Interior (o ar de dentro do casco, com as portas fechadas): vira ar mesmo abaixo do nível do chão.
const interior = new Set();
{
  const ini = k(-20, 5, 0), fila = [ini];
  interior.add(ini);
  while (fila.length) {
    const [x, y, z] = fila.pop().split(",").map(Number);
    for (const [dx, dy, dz] of LADOS) {
      const n = [x + dx, y + dy, z + dz], kn = k(...n);
      if (interior.has(kn) || solido(...n)) continue;
      interior.add(kn);
      fila.push(kn);
    }
  }
}
const w = new Map(); // "x,h,z" -> bloco
const CHAO = new Set(["minecraft:sand", "minecraft:sandstone"]);
const X0 = -80, X1 = 14, Z0 = -32, Z1 = 26;
for (const [chave, b] of g) {
  const [x, y, z] = chave.split(",").map(Number);
  if (x < X0 || x > X1 || z < Z0 || z > Z1) continue;
  if (aviao.has(chave)) w.set(k(x, y - AFUNDA, z), b);
  else if (!vazio(b) && !(y <= 0 && CHAO.has(b))) w.set(chave, b); // destroço: fica onde está
}
for (const c of interior) {
  const [x, y, z] = c.split(",").map(Number);
  w.set(k(x, y - AFUNDA, z), AR);
}
for (const p of PORTAS_MODELO) for (const dy of [0, 1]) w.set(k(p.x, p.y + dy - AFUNDA, p.z), AR);
// Em cada coluna do avião: embaixo dele, até o chão, areia; do lado de fora acima do chão, ar (limpa morro).
const colunas = new Map();
for (const c of aviao) {
  const [x, y, z] = c.split(",").map(Number);
  const h = y - AFUNDA, col = `${x},${z}`, v = colunas.get(col) ?? { baixo: h, topo: h };
  colunas.set(col, { baixo: Math.min(v.baixo, h), topo: Math.max(v.topo, h) });
}
let areia = 0;
for (const [col, { baixo, topo }] of colunas) {
  const [x, z] = col.split(",").map(Number);
  for (let h = 1; h <= topo; h++) {
    if (w.has(k(x, h, z))) continue;
    if (h < baixo) {
      w.set(k(x, h, z), "minecraft:sand");
      areia++;
    } else w.set(k(x, h, z), AR);
  }
}
let Y0 = Infinity, Y1 = -Infinity;
for (const c of w.keys()) {
  const h = Number(c.split(",")[1]);
  Y0 = Math.min(Y0, h);
  Y1 = Math.max(Y1, h);
}
const nave = new Estrutura(X1 - X0 + 1, Y1 - Y0 + 1, Z1 - Z0 + 1);
for (const [c, b] of w) {
  const [x, h, z] = c.split(",").map(Number);
  nave.por(x - X0, h - Y0, z - Z0, b);
}
console.log(`avião: ${aviao.size} blocos afundados ${AFUNDA}, ${interior.size} de interior, ${areia} de areia embaixo`);

// 6) Posições para o script (relativas à origem da estrutura) e o lugar do jogador.
// No pacote original o jogador fica 8 blocos à frente da âncora e 30 ao lado, olhando o avião.
// Peças do avião: a altura já descontando o afundamento.
const rel = (p) => ({ x: p.x - X0, y: p.y - AFUNDA - Y0, z: p.z - Z0 });
const JOGADOR = { x: 8, y: 1, z: -30 };
const esperado = {
  tamanho: { x: nave.X, y: nave.Y, z: nave.Z },
  deslocamento: { x: X0 - JOGADOR.x, y: Y0 - JOGADOR.y, z: Z0 - JOGADOR.z },
  bau: rel(BAU_MODELO),
  painel: rel(PAINEL_MODELO),
};
const partes = Math.ceil(nave.X / LARGURA_PARTE);
const config = readFileSync(join(RAIZ, "scripts/config.ts"), "utf8");
const portasTxt = `portas: [${PORTAS_MODELO.map((p) => { const r = rel(p); return `{ x: ${r.x}, y: ${r.y}, z: ${r.z} }`; }).join(", ")}]`;
if (!config.includes(portasTxt)) throw new Error(`scripts/config.ts (NAVE) precisa de "${portasTxt}"`);
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

// Fase 14 (Pam's HarvestCraft): gera, a partir de tools/dados/harvestcraft.json,
// - BP: sementes, colheitas, comidas e intermediários (itens), plantações e utensílios (blocos), receitas;
// - RP: ícones (32×32), texturas das plantações (3 estágios), modelos dos utensílios, textos pt/en;
// - scripts/harvest/gerado.ts: listas e valores que os scripts usam (plantação, fome, sede).
// Roda no build antes do Catálogo e do tsc. Texturas e modelos são próprios (as do HarvestCraft
// não podem ser usadas: ver CREDITOS.md).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

// Toda receita aparece no livro de receitas desde o começo (1.3.2): o livro vira o "JEI" do inventário.
const SEMPRE = { context: "AlwaysUnlocked" };

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = JSON.parse(readFileSync(join(RAIZ, "tools/dados/harvestcraft.json"), "utf8"));
// 1.47.0: Pam's HarvestCraft 2 (Crops, Trees e Food Core), de tools/importar-hc2.py.
const H2 = JSON.parse(readFileSync(join(RAIZ, "tools/dados/hc2.json"), "utf8"));
const T = 32;
const pasta = (rel) => (mkdirSync(join(RAIZ, rel), { recursive: true }), join(RAIZ, rel));
const json = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8"));

// ---------- pintura ----------
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const mul = (c, f) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
const ruido = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const elipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const borda = (dentro, x, y) => dentro(x, y) && (!dentro(x - 1, y) || !dentro(x + 1, y) || !dentro(x, y - 1) || !dentro(x, y + 1));
const png = (pintar) => gerarPng(T, T, (x, y) => {
  const p = pintar(x, y);
  return !p ? [0, 0, 0, 0] : p.length === 4 ? p : [...p, 255];
});
const VERDE = hex("#4f9a3a"), VERDE_ESC = hex("#2f6b25"), BRANCO = hex("#f4f1e8"), CERAMICA = hex("#e9e2d2");

/** Pinta uma forma cheia com contorno escuro e sombreado. */
function solido(dentro, cor, x, y, luz = 0.25) {
  if (!dentro(x, y)) return null;
  if (borda(dentro, x, y)) return mul(cor, 0.55);
  return mix(cor, [255, 255, 255], Math.max(0, luz - (x + y) / 80)) ;
}

// Colheitas (forma por cultura)
const COLHEITA = {
  milho: (c) => (x, y) => {
    const folha = (Math.abs(x - 8 - (y - 6) * 0.35) < 1.5 && y > 6 && y < 26) || (Math.abs(x - 24 + (y - 6) * 0.35) < 1.5 && y > 6 && y < 26);
    if (folha) return VERDE;
    const espiga = (a, b) => elipse(a, b, 16, 15, 5.5, 12);
    if (!espiga(x, y)) return null;
    if (borda(espiga, x, y)) return mul(c, 0.55);
    return (x + (y % 2)) % 2 ? c : mul(c, 0.85);
  },
  redondo: (c) => (x, y) => {
    if (y < 9 && Math.abs(x - 16) < 4 - Math.abs(y - 7)) return VERDE;
    return solido((a, b) => elipse(a, b, 16, 18, 11, 10), c, x, y, 0.35);
  },
  cebola: (c) => (x, y) => {
    if (y < 10 && Math.abs(x - 16) <= 1) return y < 6 ? VERDE : mul(c, 0.7);
    const bulbo = (a, b) => elipse(a, b, 16, 19, 10, 9) || (b < 14 && b > 8 && Math.abs(a - 16) < (b - 8) * 1.2);
    const p = solido(bulbo, c, x, y, 0.3);
    if (p && !borda(bulbo, x, y) && (x - 16) % 4 === 0) return mul(c, 0.8);
    return p;
  },
  graos: (c) => (x, y) => {
    const graos = [[10, 12], [17, 10], [22, 15], [13, 19], [20, 21], [9, 24], [24, 24], [16, 26]];
    for (const [gx, gy] of graos) if (elipse(x, y, gx, gy, 3.5, 2.5)) return solido((a, b) => elipse(a, b, gx, gy, 3.5, 2.5), c, x, y, 0.4);
    return null;
  },
  pimenta: (c) => (x, y) => {
    if (y < 8 && Math.abs(x - 10 - (8 - y) * 0.3) < 1.3) return VERDE;
    const d = (a, b) => b >= 7 && b <= 27 && Math.abs(a - (10 + (b - 7) * 0.6)) < 4 - (b - 7) * 0.17;
    return solido(d, c, x, y, 0.4);
  },
  pimentao: (c) => (x, y) => {
    if (y < 9 && Math.abs(x - 16) <= 1.5) return VERDE_ESC;
    const d = (a, b) => elipse(a, b, 12, 19, 7, 9.5) || elipse(a, b, 20, 19, 7, 9.5);
    const p = solido(d, c, x, y, 0.35);
    if (p && Math.abs(x - 16) < 0.6 && y > 12 && !borda(d, x, y)) return mul(c, 0.75);
    return p;
  },
  amendoim: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 12, 13, 6, 6.5) || elipse(a, b, 20, 21, 6, 6.5) || (Math.abs(a - b + 1) < 4 && a > 11 && a < 21);
    const p = solido(d, c, x, y, 0.2);
    if (p && !borda(d, x, y) && ruido(x, y, 3) < 0.15) return mul(c, 0.8);
    return p;
  },
};

// Comidas e intermediários: "forma:cor"
const ICONE = {
  po: (c) => (x, y) => {
    const h = 26 - 9 * Math.max(0, 1 - ((x - 16) / 12) ** 2);
    if (y < h || y > 26 || x < 4 || x > 28) return null;
    return y < h + 1 ? mul(c, 0.85) : mix(c, mul(c, 0.88), ruido(x, y, 7));
  },
  bola: (c) => (x, y) => solido((a, b) => elipse(a, b, 16, 18, 10, 9), c, x, y, 0.35),
  tigela: (c) => (x, y) => {
    const tigela = (a, b) => b >= 15 && b <= 26 && elipse(a, b, 16, 15, 13, 11);
    if (y >= 12 && y <= 16 && elipse(x, y, 16, 14, 12, 3)) return mix(c, [255, 255, 255], ruido(x, y, 8) * 0.15);
    if (!tigela(x, y)) return null;
    return borda(tigela, x, y) ? mul(CERAMICA, 0.6) : mix(CERAMICA, mul(CERAMICA, 0.8), (y - 15) / 12);
  },
  prato: (c) => (x, y) => {
    if (elipse(x, y, 16, 18, 8, 6)) return solido((a, b) => elipse(a, b, 16, 18, 8, 6), c, x, y, 0.4);
    const prato = (a, b) => elipse(a, b, 16, 21, 14, 7);
    if (!prato(x, y)) return null;
    return borda(prato, x, y) ? mul(BRANCO, 0.6) : BRANCO;
  },
  copo: (c) => (x, y) => {
    const copo = (a, b) => b >= 6 && b <= 27 && Math.abs(a - 16) <= 7 - (b - 6) * 0.08;
    if (!copo(x, y)) return x === 21 && y >= 2 && y <= 12 ? hex("#ffffff") : null; // canudo
    if (borda(copo, x, y)) return hex("#9fb8c4");
    if (y < 9) return hex("#dcecf2");
    return mix(c, [255, 255, 255], (x === 11 ? 0.35 : 0) + 0.05);
  },
  bloco: (c) => (x, y) => {
    const topo = (a, b) => b >= 10 && b <= 15 && a >= 6 + (15 - b) && a <= 26 - (15 - b) * 0 ;
    const corpo = (a, b) => (b >= 13 && b <= 24 && a >= 6 && a <= 26) || topo(a, b);
    const p = solido(corpo, c, x, y, 0.3);
    if (p && y < 14 && !borda(corpo, x, y)) return mix(c, [255, 255, 255], 0.25);
    return p;
  },
  queijo: (c) => (x, y) => {
    const fatia = (a, b) => b >= 9 && b <= 24 && a >= 5 && a <= 27 && b >= 24 - (a - 5) * 0.7;
    const p = solido(fatia, c, x, y, 0.2);
    if (p && !borda(fatia, x, y) && (elipse(x, y, 20, 19, 2, 2) || elipse(x, y, 13, 21, 1.5, 1.5))) return mul(c, 0.75);
    return p;
  },
  pote: (c) => (x, y) => {
    if (y >= 5 && y <= 8 && Math.abs(x - 16) <= 6) return y === 5 || Math.abs(x - 16) === 6 ? hex("#6a6a6a") : hex("#9a9a9a");
    const pote = (a, b) => b >= 9 && b <= 27 && Math.abs(a - 16) <= 8;
    if (!pote(x, y)) return null;
    return borda(pote, x, y) ? hex("#9fb8c4") : mix(c, mul(c, 0.9), (x - 8) / 16);
  },
  ovo: () => (x, y) => {
    const clara = (a, b) => elipse(a, b, 16, 17, 12, 10) && ruido(a >> 2, b >> 2, 9) < 0.95;
    if (elipse(x, y, 15, 16, 4.5, 4)) return solido((a, b) => elipse(a, b, 15, 16, 4.5, 4), hex("#f6b21a"), x, y, 0.4);
    return solido(clara, BRANCO, x, y, 0.1);
  },
  pao: (c) => (x, y) => {
    const pao = (a, b) => elipse(a, b, 16, 18, 13, 8) && b > 12;
    const p = solido(pao, c, x, y, 0.35);
    if (p && !borda(pao, x, y) && (x - y + 40) % 7 === 0 && y < 18) return mul(c, 0.8);
    return p;
  },
  sanduiche: (c) => (x, y) => {
    const pao = hex("#d39a4a");
    if (elipse(x, y, 16, 11, 12, 5) && y <= 12) return solido((a, b) => elipse(a, b, 16, 11, 12, 5) && b <= 12, pao, x, y, 0.4);
    if (y >= 13 && y <= 15 && Math.abs(x - 16) <= 13) return y === 13 ? VERDE : c;
    if (y >= 16 && y <= 21 && Math.abs(x - 16) <= 12) return y === 21 || Math.abs(x - 16) === 12 ? mul(pao, 0.6) : mul(pao, 0.9);
    return null;
  },
  disco: (c) => (x, y) => solido((a, b) => elipse(a, b, 16, 17, 13, 9), c, x, y, 0.3),
  tira: (c) => (x, y) => {
    const tira = (a, b) => Math.abs(a - b) < 4 && a > 5 && a < 27;
    const p = solido(tira, c, x, y, 0.15);
    if (p && !borda(tira, x, y) && ruido(x, y, 4) < 0.2) return mul(c, 1.2);
    return p;
  },
  pipoca: () => (x, y) => {
    const balde = (a, b) => b >= 13 && b <= 28 && Math.abs(a - 16) <= 9 - (28 - b) * 0.05;
    if (y < 15 && elipse(x, y, 16, 12, 10, 6) && ruido(x >> 1, y >> 1, 5) < 0.9) return mix(hex("#fff6d8"), hex("#f2d06b"), ruido(x, y, 6) * 0.5);
    if (!balde(x, y)) return null;
    return Math.floor((x - 7) / 3) % 2 ? hex("#d62d20") : BRANCO;
  },
  espiga: () => (x, y) => {
    const e = (a, b) => elipse(a, b, 16, 16, 12, 5.5);
    if (!e(x, y)) return null;
    if (borda(e, x, y)) return hex("#9a7a20");
    if (y < 14 && x > 10 && x < 22) return hex("#fff1a8"); // manteiga derretendo
    return (x + (y % 2)) % 2 ? hex("#f2c94c") : hex("#e0b43a");
  },
  pilha: (c) => (x, y) => {
    for (const cy of [21, 17, 13]) {
      const d = (a, b) => elipse(a, b, 16, cy, 12, 4);
      if (d(x, y)) return solido(d, c, x, y, 0.2);
    }
    if (elipse(x, y, 16, 10, 4, 2)) return hex("#f7e27a");
    return null;
  },
};

// ---------- 1.47.0 (HarvestCraft 2): formas novas de colheita e de comida ----------
const MARROM = hex("#7a5232"), MADEIRA = hex("#b98a55");
const dentroDe = (lista) => (a, b) => lista.some((f) => f(a, b));
Object.assign(COLHEITA, {
  cacto: (c) => (x, y) => {
    // Roseta de folhas pontudas (agave, babosa, palma, cacto-barril).
    const folhas = [[16, 4, 3.2], [10, 9, 2.6], [22, 9, 2.6], [6, 15, 2.2], [26, 15, 2.2]];
    const dentro = (a, b) => b <= 28 && folhas.some(([fx, topo, w]) => b >= topo && Math.abs(a - fx - (fx - 16) * (b - topo) * -0.02) < w * Math.min(1, (b - topo) / 10 + 0.15));
    const p = solido(dentro, c, x, y, 0.3);
    if (p && !borda(dentro, x, y) && ruido(x, y, 21) < 0.08) return hex("#f4f1e8");
    return p;
  },
  raiz: (c) => (x, y) => {
    if (y < 10 && (Math.abs(x - 13 - (10 - y) * -0.3) < 1.2 || Math.abs(x - 19 - (10 - y) * 0.3) < 1.2 || Math.abs(x - 16) < 1)) return VERDE;
    const d = (a, b) => b >= 9 && b <= 29 && Math.abs(a - 16 - (b - 9) * 0.15) < 6 - (b - 9) * 0.28;
    const p = solido(d, c, x, y, 0.3);
    if (p && !borda(d, x, y) && y % 5 === 0) return mul(c, 0.8);
    return p;
  },
  raiz_redonda: (c) => (x, y) => {
    if (y < 10 && (Math.abs(x - 13 - (10 - y) * -0.4) < 1.2 || Math.abs(x - 19 - (10 - y) * 0.4) < 1.2)) return VERDE;
    if (y > 26 && Math.abs(x - 16) < 1) return mul(c, 0.7);
    const p = solido((a, b) => elipse(a, b, 16, 18, 9, 8.5), c, x, y, 0.35);
    if (p && y > 20 && y < 24 && !borda((a, b) => elipse(a, b, 16, 18, 9, 8.5), x, y)) return mix(c, BRANCO, 0.4);
    return p;
  },
  alcachofra: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 16, 17, 10, 11);
    const p = solido(d, c, x, y, 0.25);
    if (p && !borda(d, x, y) && ((x + Math.floor(y / 3) * 2) % 6 === 0 || y % 6 === 0)) return mul(c, 0.7);
    if (!p && y > 27 && Math.abs(x - 16) < 1.5) return VERDE_ESC;
    return p;
  },
  talo: (c) => (x, y) => {
    for (const [cx, topo] of [[11, 6], [16, 3], [21, 7]]) {
      if (y >= topo && y <= 28 && Math.abs(x - cx - (y - 16) * (cx - 16) * -0.015) < 1.8) return Math.abs(x - cx) < 0.6 ? mix(c, BRANCO, 0.3) : c;
      if (y >= topo - 3 && y < topo + 2 && Math.abs(x - cx) < 3 - (topo + 2 - y) * 0.5) return VERDE;
    }
    if (y >= 26 && y <= 28 && x >= 9 && x <= 23) return mul(c, 0.7);
    return null;
  },
  trigo: (c) => (x, y) => {
    if (Math.abs(x - 16 - (y - 20) * 0.1) < 0.7 && y >= 4 && y <= 29) return mul(c, 0.7);
    for (let k = 0; k < 6; k++) {
      const gy = 6 + k * 3;
      if (elipse(x, y, 13.5, gy, 2.4, 1.6) || elipse(x, y, 18.5, gy + 1.5, 2.4, 1.6)) return (x + y) % 3 ? c : mix(c, BRANCO, 0.25);
    }
    return null;
  },
  baga: (c) => (x, y) => {
    if (y < 9 && Math.abs(x - 17 - (9 - y) * 0.4) < 1) return VERDE_ESC;
    if (elipse(x, y, 20, 8, 4, 2)) return VERDE;
    const bagas = [[12, 15, 5], [20, 15, 5], [16, 22, 5.5], [10, 23, 4], [22, 23, 4]];
    for (const [bx, by, r] of bagas) {
      const d = (a, b) => elipse(a, b, bx, by, r, r);
      if (d(x, y)) return elipse(x, y, bx - 1.5, by - 1.5, 1.2, 1.2) ? mix(c, BRANCO, 0.5) : solido(d, c, x, y, 0.2);
    }
    return null;
  },
  brocolis: (c) => (x, y) => {
    if (y >= 18 && y <= 29 && Math.abs(x - 16) < 3 - (29 - y) * 0.05) return mix(hex("#9ac860"), c, 0.3);
    for (const [bx, by, r] of [[10, 13, 5.5], [16, 9, 6.5], [22, 13, 5.5], [16, 16, 5]]) {
      const d = (a, b) => elipse(a, b, bx, by, r, r * 0.9);
      if (d(x, y)) return ruido(x >> 1, y >> 1, 22) < 0.5 ? c : mul(c, 0.82);
    }
    return null;
  },
  fibra: (c) => (x, y) => {
    if (y >= 16 && y <= 19 && x >= 9 && x <= 23) return MARROM;
    const d = (a, b) => b >= 4 && b <= 29 && Math.abs(a - 16) < (b < 17 ? 4 + (17 - b) * 0.45 : 4 + (b - 17) * 0.35);
    if (!d(x, y)) return null;
    return borda(d, x, y) ? mul(c, 0.6) : x % 2 ? c : mul(c, 0.88);
  },
  alongado: (c) => (x, y) => {
    const d = (a, b) => elipse(a + b - 32, a - b, 0, 0, 7, 19);
    if (elipse(x, y, 8, 8, 4, 3) || (Math.abs(x - y) < 1.2 && x < 7)) return VERDE;
    const p = solido(d, c, x, y, 0.35);
    if (p && !borda(d, x, y) && (x - y) % 7 === 0 && ruido(x, y, 23) < 0.5) return mix(c, BRANCO, 0.25);
    return p;
  },
  cacho: (c) => (x, y) => {
    if (y < 7 && Math.abs(x - 16) < 1) return MARROM;
    if (elipse(x, y, 21, 6, 4, 2.2)) return VERDE;
    const bagas = [];
    for (let fila = 0; fila < 5; fila++) for (let k = 0; k <= 4 - fila; k++) bagas.push([16 + (k - (4 - fila) / 2) * 4.6, 10 + fila * 4.2]);
    for (const [bx, by] of bagas) {
      const d = (a, b) => elipse(a, b, bx, by, 2.6, 2.6);
      if (d(x, y)) return elipse(x, y, bx - 0.8, by - 0.8, 0.8, 0.8) ? mix(c, BRANCO, 0.5) : solido(d, c, x, y, 0.15);
    }
    return null;
  },
  folha: (c) => (x, y) => {
    const d = dentroDe([(a, b) => elipse(a, b, 16, 18, 12, 10), (a, b) => elipse(a, b, 10, 12, 6, 6), (a, b) => elipse(a, b, 22, 12, 6, 6)]);
    const p = solido(d, c, x, y, 0.3);
    if (p && !borda(d, x, y) && (Math.abs(x - 16) < 0.6 || Math.abs(Math.abs(x - 16) - (y - 10) * 0.5) < 0.5)) return mix(c, BRANCO, 0.35);
    return p;
  },
  vagem: (c) => (x, y) => {
    const d = (a, b) => elipse(a + b - 32, a - b, 0, 0, 5, 20);
    if (Math.abs(x - y) < 1.2 && x < 6) return VERDE_ESC;
    const p = solido(d, c, x, y, 0.3);
    if (p && !borda(d, x, y)) for (let k = -2; k <= 2; k++) if (elipse(x, y, 16 + k * 4, 16 + k * 4, 2, 2)) return mix(c, BRANCO, 0.2);
    return p;
  },
  abacaxi: (c) => (x, y) => {
    if (y < 11) {
      for (const dx of [-4, 0, 4]) if (Math.abs(x - 16 - dx * (11 - y) / 8) < 1.3 && y > 2) return VERDE;
      return null;
    }
    const d = (a, b) => elipse(a, b, 16, 20, 8, 9);
    const p = solido(d, c, x, y, 0.3);
    if (p && !borda(d, x, y) && ((x + y) % 5 === 0 || (x - y + 64) % 5 === 0)) return mul(c, 0.7);
    return p;
  },
  noz: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 16, 18, 9, 10);
    const p = solido(d, c, x, y, 0.3);
    if (p && y < 12 && !borda(d, x, y)) return mul(c, 0.7);
    if (p && Math.abs(x - 16) < 0.6 && y > 12) return mul(c, 0.6);
    if (!p && y >= 5 && y <= 8 && Math.abs(x - 16) < 1) return mul(c, 0.5);
    return p;
  },
  cogumelo: (c) => (x, y) => {
    const chapeu = (a, b) => elipse(a, b, 16, 14, 12, 8) && b <= 15;
    if (chapeu(x, y)) return solido(chapeu, c, x, y, 0.3);
    const pe = (a, b) => b > 15 && b <= 28 && Math.abs(a - 16) < 4;
    return solido(pe, mix(c, BRANCO, 0.6), x, y, 0.1);
  },
  morango: (c) => (x, y) => {
    if (y < 10 && elipse(x, y, 16, 8, 7, 3)) return VERDE;
    const d = (a, b) => b >= 8 && b <= 28 && Math.abs(a - 16) < 10 * Math.sin(Math.min(Math.PI, ((b - 6) / 23) * Math.PI)) ** 0.7;
    const p = solido(d, c, x, y, 0.3);
    if (p && !borda(d, x, y) && (x * 3 + y * 5) % 7 === 0) return hex("#f7e27a");
    return p;
  },
  taboa: (c) => (x, y) => {
    if (Math.abs(x - 16) < 0.8 && (y < 6 || y > 22)) return VERDE_ESC;
    return solido((a, b) => b >= 6 && b <= 22 && Math.abs(a - 16) < 3.5, c, x, y, 0.25);
  },
  flor: (c) => (x, y) => {
    const centro = (a, b) => elipse(a, b, 16, 18, 3, 3);
    if (centro(x, y)) return hex("#f2c94c");
    for (const ang of [0, 1, 2, 3, 4, 5]) {
      const t = (ang * Math.PI) / 3, px = 16 + Math.cos(t) * 7, py = 18 + Math.sin(t) * 6;
      if (elipse(x, y, px, py, 4, 4)) return solido((a, b) => elipse(a, b, px, py, 4, 4), c, x, y, 0.4);
    }
    return elipse(x, y, 16, 27, 12, 3) ? VERDE : null;
  },
  pera: (c) => (x, y) => {
    if (y < 7 && Math.abs(x - 16) < 0.8) return MARROM;
    if (elipse(x, y, 20, 6, 3, 1.5)) return VERDE;
    const d = dentroDe([(a, b) => elipse(a, b, 16, 13, 5.5, 6), (a, b) => elipse(a, b, 16, 21, 8.5, 8)]);
    return solido(d, c, x, y, 0.35);
  },
  banana: (c) => (x, y) => {
    const d = (a, b) => {
      const r = Math.hypot(a - 30, b - 2);
      return r > 17 && r < 24 && a < 26 && b < 30 && a > 3;
    };
    const p = solido(d, c, x, y, 0.3);
    if (p && (x < 6 || y > 26)) return MARROM;
    return p;
  },
  cereja: (c) => (x, y) => {
    if (Math.abs(x - 16 - (y - 4) * -0.3) < 0.8 && y >= 4 && y <= 17) return VERDE_ESC;
    if (Math.abs(x - 16 - (y - 4) * 0.5) < 0.8 && y >= 4 && y <= 15) return VERDE_ESC;
    for (const [bx, by] of [[11, 21], [22, 19]]) if (elipse(x, y, bx, by, 5, 5)) return solido((a, b) => elipse(a, b, bx, by, 5, 5), c, x, y, 0.4);
    return elipse(x, y, 19, 4, 3, 1.5) ? VERDE : null;
  },
  canela: (c) => (x, y) => {
    for (const k of [-5, 0, 5]) {
      const d = (a, b) => Math.abs(a - b - k) < 2.6 && a + b > 10 && a + b < 54;
      if (d(x, y)) return borda(d, x, y) ? mul(c, 0.6) : (x + y) % 4 === 0 ? mul(c, 0.8) : c;
    }
    return null;
  },
  coco: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 16, 17, 11, 11);
    const p = solido(d, c, x, y, 0.15);
    if (p && (elipse(x, y, 12, 13, 1.4, 1.4) || elipse(x, y, 18, 12, 1.4, 1.4) || elipse(x, y, 15, 17, 1.4, 1.4))) return hex("#2a1a10");
    if (p && ruido(x, y, 24) < 0.15) return mul(c, 1.25);
    return p;
  },
  xarope: (c) => (x, y) => {
    if (y >= 3 && y <= 9 && Math.abs(x - 16) <= 2.5) return y < 5 ? hex("#e8e0c8") : hex("#d8ecf2");
    const vidro = (a, b) => b >= 9 && b <= 28 && Math.abs(a - 16) <= 8 - Math.max(0, 12 - b);
    if (!vidro(x, y)) return null;
    if (borda(vidro, x, y)) return hex("#9fb8c4");
    return y < 13 ? hex("#dcecf2") : mix(c, BRANCO, x === 11 ? 0.35 : 0);
  },
  papel: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 16, 16, 12, 6) || (Math.abs(a - 16) < 12 && b > 16 && b < 24);
    const p = solido(d, c, x, y, 0.1);
    if (p && y > 17 && y % 3 === 0) return mul(c, 0.85);
    return p;
  },
  teia: (c) => (x, y) => {
    const dx = x - 16, dy = y - 16, r = Math.hypot(dx, dy);
    if (r > 14) return null;
    const ang = Math.atan2(dy, dx);
    if (Math.abs(Math.sin(ang * 4)) < 0.12 || Math.abs(r % 4.5 - 2) < 0.5) return c;
    return null;
  },
  carambola: (c) => (x, y) => {
    const dx = x - 16, dy = y - 17, r = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
    const raio = 8 + 5 * Math.cos(ang * 5);
    const p = solido((a, b) => Math.hypot(a - 16, b - 17) < 8 + 5 * Math.cos(Math.atan2(b - 17, a - 16) * 5), c, x, y, 0.3);
    return r < raio ? p : null;
  },
});
const ESPESSURA = (d, x, y, c, l = 0.3) => solido(d, c, x, y, l);
Object.assign(ICONE, {
  rosca: (c) => (x, y) => {
    const anel = (a, b) => elipse(a, b, 16, 17, 12, 10) && !elipse(a, b, 16, 17, 4.5, 3.5);
    if (!anel(x, y)) return null;
    if (borda(anel, x, y)) return mul(hex("#c88a4a"), 0.6);
    if (y > 21) return hex("#d8a050");
    return (x * 7 + y * 3) % 11 === 0 ? BRANCO : mix(c, BRANCO, 0.1);
  },
  muffin: (c) => (x, y) => {
    const forma = (a, b) => b >= 18 && b <= 28 && Math.abs(a - 16) <= 9 - (b - 18) * 0.25;
    if (forma(x, y)) return borda(forma, x, y) ? hex("#8a8a8a") : x % 3 ? hex("#e8e4dc") : hex("#c8c4bc");
    const topo = (a, b) => elipse(a, b, 16, 16, 11, 8) && b <= 19;
    const p = ESPESSURA(topo, x, y, mix(c, hex("#d8a050"), 0.35), 0.35);
    if (p && ruido(x, y, 25) < 0.12) return c;
    return p;
  },
  torta: (c) => (x, y) => {
    const prato = (a, b) => elipse(a, b, 16, 19, 14, 8);
    if (!prato(x, y)) return null;
    if (borda(prato, x, y)) return mul(hex("#d8a050"), 0.6);
    if (!elipse(x, y, 16, 18, 11, 6)) return hex("#e0b060");
    return (x + y) % 5 === 0 || (x - y + 64) % 5 === 0 ? hex("#f0c878") : c;
  },
  picole: (c) => (x, y) => {
    if (y >= 23 && y <= 30 && Math.abs(x - 16) <= 1.5) return MADEIRA;
    const d = (a, b) => b >= 3 && b <= 23 && Math.abs(a - 16) <= 6 && !(b < 6 && Math.abs(a - 16) > 6 - (6 - b));
    return ESPESSURA(d, x, y, c, 0.35);
  },
  sorvete: (c) => (x, y) => {
    const cone = (a, b) => b >= 15 && b <= 30 && Math.abs(a - 16) <= (30 - b) * 0.5;
    if (cone(x, y)) return (x + y) % 4 === 0 || (x - y + 64) % 4 === 0 ? hex("#b07a3a") : hex("#e0b060");
    return ESPESSURA((a, b) => elipse(a, b, 16, 11, 8, 7) && b <= 16, x, y, c, 0.35);
  },
  bolo: (c) => (x, y) => {
    const fatia = (a, b) => b >= 10 && b <= 26 && a >= 5 && a <= 27 && b >= 10 + (27 - a) * 0.0 && b <= 26 && a <= 5 + (b - 6) * 1.4;
    if (!fatia(x, y)) return null;
    if (borda(fatia, x, y)) return mul(c, 0.55);
    if (y < 13) return mix(c, BRANCO, 0.55);
    return (y - 13) % 6 < 2 ? mix(c, BRANCO, 0.4) : c;
  },
  espeto: (c) => (x, y) => {
    if (Math.abs(x - y) < 1 && x > 2 && x < 30) return MADEIRA;
    for (const k of [9, 16, 23]) if (elipse(x, y, k, k, 4, 4)) return ESPESSURA((a, b) => elipse(a, b, k, k, 4, 4), x, y, k === 16 ? mix(c, VERDE, 0.4) : c, 0.3);
    return null;
  },
  barra: (c) => (x, y) => {
    const d = (a, b) => a >= 5 && a <= 27 && b >= 8 && b <= 24;
    if (!d(x, y)) return null;
    if (borda(d, x, y) || (x - 5) % 7 === 0 || (y - 8) % 8 === 0) return mul(c, 0.7);
    return y < 16 && x > 18 ? hex("#c8c8d0") : c;
  },
  garrafa: (c) => (x, y) => {
    if (y >= 2 && y <= 6 && Math.abs(x - 16) <= 2) return MADEIRA;
    const vidro = (a, b) => (b >= 6 && b <= 11 && Math.abs(a - 16) <= 3) || (b > 11 && b <= 29 && Math.abs(a - 16) <= 8);
    if (!vidro(x, y)) return null;
    if (borda(vidro, x, y)) return hex("#9fb8c4");
    return y < 14 ? hex("#dcecf2") : mix(c, BRANCO, x === 11 ? 0.35 : 0);
  },
  algodao: (c) => (x, y) => {
    if (Math.abs(x - 16) < 1 && y > 18) return MADEIRA;
    const d = (a, b) => elipse(a, b, 16, 11, 10, 9) && ruido(a >> 1, b >> 1, 26) < 0.92;
    return ESPESSURA(d, x, y, c, 0.5);
  },
  fritas: (c) => (x, y) => {
    const caixa = (a, b) => b >= 16 && b <= 29 && Math.abs(a - 16) <= 9 - (29 - b) * 0.15;
    if (caixa(x, y)) return borda(caixa, x, y) ? hex("#8a1a1a") : hex("#d62d20");
    for (const k of [-6, -3, 0, 3, 6]) if (Math.abs(x - 16 - k - (y - 16) * k * 0.03) < 1.2 && y >= 4 + Math.abs(k) && y < 17) return (y + k) % 4 ? c : mul(c, 0.85);
    return null;
  },
  massa: (c) => (x, y) => {
    const prato = (a, b) => elipse(a, b, 16, 21, 14, 7);
    if (elipse(x, y, 16, 18, 10, 6)) return Math.sin(x * 1.3 + y * 0.4) > 0.2 ? c : mul(c, 0.82);
    if (!prato(x, y)) return null;
    return borda(prato, x, y) ? mul(BRANCO, 0.6) : BRANCO;
  },
});
const pintorDe = (forma, cor) => (ICONE[forma] ?? COLHEITA[forma])(cor ? hex(cor) : undefined);

// Semente: saquinho com a cor da cultura.
const SEMENTE = (c) => (x, y) => {
  const saco = (a, b) => b >= 7 && b <= 27 && a >= 8 && a <= 24;
  if (y >= 4 && y <= 7 && x >= 10 && x <= 22) return y === 4 ? hex("#7a5a35") : hex("#a07a4a");
  if (!saco(x, y)) return null;
  if (borda(saco, x, y)) return hex("#6b4a2b");
  if (elipse(x, y, 16, 17, 5, 5)) return solido((a, b) => elipse(a, b, 16, 17, 5, 5), c, x, y, 0.4);
  return mix(hex("#d8c08a"), hex("#c9ad74"), ruido(x, y, 10));
};

// Plantação: 3 estágios (broto, planta, madura com a colheita).
function estagio(cultura, k) {
  const c = hex(cultura.cor);
  if (cultura.deserto && (!cultura.forma || cultura.forma === "cacto")) {
    // Cacto baixo com frutas rosadas.
    return png((x, y) => {
      const alto = [10, 18, 24][k];
      const corpo = (a, b) => b >= 31 - alto && Math.abs(a - 16) <= 4;
      const braco = k > 0 && ((x >= 8 && x <= 11 && y >= 31 - alto + 6 && y <= 31 - alto + 12) || (x >= 21 && x <= 24 && y >= 31 - alto + 3 && y <= 31 - alto + 9));
      if (k === 2 && (elipse(x, y, 16, 31 - alto, 2.5, 2.5) || elipse(x, y, 9.5, 31 - alto + 5, 2, 2) || elipse(x, y, 22.5, 31 - alto + 2, 2, 2))) return c;
      if (corpo(x, y) || braco) return (x + y) % 5 === 0 ? hex("#cfe8a0") : mix(hex("#3f7a2a"), hex("#5a9a3a"), ruido(x, y, 11) * 0.5);
      return null;
    });
  }
  return png((x, y) => {
    const alto = [9, 18, 27][k];
    const caule = Math.abs(x - 16) <= 0.6 && y >= 31 - alto;
    if (caule) return VERDE_ESC;
    // Folhas alternadas ao longo do caule.
    for (let i = 0; i < k + 2; i++) {
      const fy = 31 - (i + 1) * (alto / (k + 2.5));
      const lado = i % 2 ? 1 : -1;
      if (elipse(x, y, 16 + lado * 5, fy, 5, 1.8)) return mix(VERDE_ESC, VERDE, 0.5 + ruido(x, y, 12) * 0.4);
    }
    if (k === 2) {
      const frutos = [[11, 10], [21, 14], [13, 18], [20, 7]];
      for (const [fx, fy] of frutos) if (elipse(x, y, fx, fy, 2.6, 2.6)) return mix(c, [255, 255, 255], (x + y) % 5 === 0 ? 0.25 : 0);
    }
    return null;
  });
}

// ---------- modelos dos utensílios (pixels de 0 a 16, como em gerar-visual.mjs) ----------
const cubo = (x0, y0, z0, x1, y1, z1, m) => ({ a: [x0, y0, z0], b: [x1, y1, z1], m });
const MODELOS = {
  tabua_corte: [cubo(2, 0, 4, 14, 1, 12, "madeira"), cubo(9, 1, 6, 13, 1.5, 7, "metal")],
  panela: [cubo(3, 0, 3, 13, 7, 13, "metal"), cubo(1, 5, 7, 3, 6, 9, "metal"), cubo(13, 5, 7, 15, 6, 9, "metal"), cubo(4, 7, 4, 12, 7.5, 12, "tampa")],
  frigideira: [cubo(2, 0, 2, 12, 2, 12, "metal"), cubo(12, 1, 6.5, 16, 2, 9.5, "madeira")],
  cacarola: [cubo(4, 0, 4, 11, 6, 11, "metal"), cubo(11, 4, 7, 16, 5, 8, "madeira")],
  assadeira: [cubo(1, 0, 2, 15, 2, 14, "metal")],
  pilao: [cubo(3, 0, 3, 13, 5, 13, "pedra"), cubo(8, 3, 8, 10, 11, 10, "madeira")],
  tigela_mistura: [cubo(2, 0, 2, 14, 5, 14, "madeira")],
  espremedor: [cubo(4, 0, 4, 12, 2, 12, "pedra"), cubo(6, 2, 6, 10, 6, 10, "pedra"), cubo(7, 6, 7, 9, 8, 9, "pedra")],
  rolo: [cubo(3, 0, 6.5, 13, 3, 9.5, "madeira"), cubo(0, 1, 7.5, 3, 2, 8.5, "madeira"), cubo(13, 1, 7.5, 16, 2, 8.5, "madeira")],
};
const TEX_UTENSILIO = { madeira: "textures/blocks/planks_oak", metal: "textures/blocks/iron_block", pedra: "textures/blocks/stone", tampa: "textures/blocks/iron_block" };
const FACES = ["north", "south", "east", "west", "up", "down"];
function uvDe(face, [x0, y0, z0], [x1, y1, z1]) {
  return { north: [16 - x1, 16 - y1, x1 - x0, y1 - y0], south: [x0, 16 - y1, x1 - x0, y1 - y0], east: [16 - z1, 16 - y1, z1 - z0, y1 - y0], west: [z0, 16 - y1, z1 - z0, y1 - y0], up: [x0, z0, x1 - x0, z1 - z0], down: [x0, 16 - z1, x1 - x0, z1 - z0] }[face];
}
function geometria(id, cubos) {
  return {
    format_version: "1.12.0",
    "minecraft:geometry": [{
      description: { identifier: `geometry.cl.${id}`, texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2, visible_bounds_offset: [0, 0.5, 0] },
      bones: [{ name: "corpo", pivot: [0, 0, 0], cubes: cubos.map((c) => ({
        origin: [c.a[0] - 8, c.a[1], c.a[2] - 8], size: [c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]],
        uv: Object.fromEntries(FACES.map((f) => { const [u, v, du, dv] = uvDe(f, c.a, c.b); return [f, { uv: [u, v], uv_size: [du || 0.01, dv || 0.01], material_instance: c.m }]; })),
      })) }],
    }],
  };
}
// Plantação: dois planos cruzados.
const GEO_PLANTA = {
  format_version: "1.12.0",
  "minecraft:geometry": [{
    description: { identifier: "geometry.cl.planta", texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2, visible_bounds_offset: [0, 0.5, 0] },
    bones: [{ name: "corpo", pivot: [0, 0, 0], cubes: [45, -45].map((r) => ({
      origin: [-8, 0, 0], size: [16, 16, 0], pivot: [0, 8, 0], rotation: [0, r, 0],
      uv: { north: { uv: [0, 0], uv_size: [16, 16] }, south: { uv: [16, 0], uv_size: [-16, 16] } },
    })) }],
  }],
};

// ---------- saída ----------
const itemTex = lerJson("RP/textures/item_texture.json");
const terreno = lerJson("RP/textures/terrain_texture.json");
const dirIcone = pasta("RP/textures/items/cl/hc");
const dirBloco = pasta("RP/textures/blocks/cl/hc");
pasta("RP/models/blocks");
pasta("BP/loot_tables/cl/hc");
const nomes = { pt: {}, en: {} };
const icone = (id, pintor) => {
  writeFileSync(join(dirIcone, `${id}.png`), png(pintor));
  itemTex.texture_data[`clhc_${id}`] = { textures: `textures/items/cl/hc/${id}` };
};
function item(id, comps, categoria = "items", stack = 64) {
  const tags = [...(H2.etiquetas[`cl:${id}`] ?? []), ...(id.startsWith("semente_") ? ["cl:hc_semente"] : [])];
  if (tags.length) comps = { ...comps, "minecraft:tags": { tags } };
  json(`BP/items/${id}.json`, {
    format_version: "1.21.60",
    "minecraft:item": {
      description: { identifier: `cl:${id}`, menu_category: { category: categoria } },
      components: { "minecraft:icon": `clhc_${id}`, "minecraft:display_name": { value: `item.cl:${id}.name` }, "minecraft:max_stack_size": stack, ...comps },
    },
  });
}
// Hunger Overhaul: pilha de 16 até 2 de fome; tempo de comer = fome × 8 + 8 ticks.
const comida = (fome, bebida = false) => ({
  "minecraft:use_animation": bebida ? "drink" : "eat",
  "minecraft:use_modifiers": { use_duration: (fome * 8 + 8) / 20, movement_modifier: 0.35 },
  "minecraft:food": { nutrition: fome, saturation_modifier: 0.1 },
});
const pilhaHO = (fome) => (fome <= 2 ? 16 : fome <= 5 ? 8 : 4);
const receita = (nome, corpo) => json(`BP/recipes/hc_${nome}.json`, { format_version: "1.20.10", ...corpo });
const ingrediente = (i) => (i.startsWith("#") ? { tag: i.slice(1) } : { item: i });

const valores = {}; // id -> [fome, sat] (para o Hunger Overhaul do script)
const bebidas = {}, temperaturas = {}, origem = [];

for (const c of [...D.culturas, ...H2.culturas]) {
  const semente = `semente_${c.id}`, planta = `planta_${c.id}`, produto = c.produto ?? `cl:${c.id}`;
  icone(semente, SEMENTE(hex(c.cor)));
  item(semente, { "minecraft:block_placer": { block: `cl:${planta}`, use_on: ["minecraft:farmland"] } }, "nature");
  if (!c.produto) {
    const fome = c.fome ?? 1; // HC2: as fibras (algodão, linho...) não se comem
    icone(c.id, COLHEITA[c.forma](hex(c.cor)));
    item(c.id, fome ? comida(fome) : {}, fome ? "nature" : "items", fome ? pilhaHO(fome) : 64);
    if (fome) valores[`cl:${c.id}`] = [fome, 0.1];
  }
  for (let k = 0; k < 3; k++) {
    writeFileSync(join(dirBloco, `${c.id}_${k}.png`), estagio(c, k));
    terreno.texture_data[`clhc_${c.id}_${k}`] = { textures: `textures/blocks/cl/hc/${c.id}_${k}` };
  }
  const material = (k) => ({ "*": { texture: `clhc_${c.id}_${k}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } });
  json(`BP/blocks/${planta}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${planta}`, menu_category: { category: "none" }, states: { "cl:estagio": { values: { min: 0, max: 2 } } } },
      components: {
        "minecraft:geometry": "geometry.cl.planta",
        "minecraft:material_instances": material(0),
        "minecraft:collision_box": false,
        "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 8, 12] },
        "minecraft:destructible_by_mining": { seconds_to_destroy: 0 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 0 },
        "minecraft:light_dampening": 0,
        "minecraft:map_color": c.cor,
        "minecraft:loot": `loot_tables/cl/hc/${planta}.json`,
        "minecraft:placement_filter": { conditions: [{ allowed_faces: ["up"], block_filter: ["minecraft:farmland"] }] },
        "minecraft:tick": { interval_range: [600, 1200], looping: true },
        "cl:planta": {},
      },
      permutations: [1, 2].map((k) => ({ condition: `q.block_state('cl:estagio') == ${k}`, components: { "minecraft:material_instances": material(k) } })),
    },
  });
  // Quebrar: sempre 1 semente (a colheita da planta madura sai pelo script).
  json(`BP/loot_tables/cl/hc/${planta}.json`, { pools: [{ rolls: 1, entries: [{ type: "item", name: `cl:${semente}`, weight: 1 }] }] });
  receita(`semente_${c.id}`, {
    "minecraft:recipe_shapeless": { description: { identifier: `cl:hc_semente_${c.id}` }, tags: ["crafting_table"], ingredients: [{ item: produto }], unlock: SEMPRE, result: { item: `cl:${semente}` } },
  });
  nomes.pt[`item.cl:${semente}.name`] = `Sementes de ${c.pt}`;
  nomes.en[`item.cl:${semente}.name`] = `${c.en.replace(/ Seeds$/, "")} Seeds`;
  nomes.pt[`tile.cl:${planta}.name`] = `Plantação de ${c.pt}`;
  nomes.en[`tile.cl:${planta}.name`] = `${c.en.replace(/ Seeds$/, "")} Crop`;
  if (!c.produto) {
    nomes.pt[`item.cl:${c.id}.name`] = c.pt;
    nomes.en[`item.cl:${c.id}.name`] = c.en;
    origem.push(`cl:${c.id}`);
  }
  origem.push(`cl:${semente}`, `cl:${planta}`);
}
json("RP/models/blocks/cl_planta.geo.json", GEO_PLANTA);

for (const u of [...D.utensilios, H2.rolo]) {
  json(`RP/models/blocks/cl_${u.id}.geo.json`, geometria(u.id, MODELOS[u.id]));
  const usados = [...new Set(MODELOS[u.id].map((c) => c.m))];
  const mats = Object.fromEntries(usados.map((m) => [m, { texture: `clhc_u_${m}`, render_method: "opaque" }]));
  mats["*"] = mats[usados[0]];
  const caixa = MODELOS[u.id].reduce((b, c) => ({ min: c.a.map((v, i) => Math.min(b.min[i], v)), max: c.b.map((v, i) => Math.max(b.max[i], v)) }), { min: [16, 16, 16], max: [0, 0, 0] });
  const box = { origin: [caixa.min[0] - 8, caixa.min[1], caixa.min[2] - 8], size: caixa.max.map((v, i) => Math.max(1, Math.ceil(v - caixa.min[i]))) };
  json(`BP/blocks/${u.id}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${u.id}`, menu_category: { category: "items" } },
      components: {
        "minecraft:geometry": `geometry.cl.${u.id}`,
        "minecraft:material_instances": mats,
        "minecraft:crafting_table": { crafting_tags: [`cl_${u.id}`], table_name: `tile.cl:${u.id}.name` },
        "minecraft:collision_box": box,
        "minecraft:selection_box": box,
        "minecraft:destructible_by_mining": { seconds_to_destroy: 0.6 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 3 },
        "minecraft:light_dampening": 0,
        "minecraft:map_color": "#9a9a9a",
      },
    },
  });
  receita(u.id, {
    "minecraft:recipe_shaped": {
      description: { identifier: `cl:hc_${u.id}` }, tags: ["crafting_table"], pattern: u.padrao,
      key: Object.fromEntries(Object.entries(u.chave).map(([k, v]) => [k, ingrediente(v)])),
      unlock: SEMPRE, result: { item: `cl:${u.id}` },
    },
  });
  nomes.pt[`tile.cl:${u.id}.name`] = u.pt;
  nomes.en[`tile.cl:${u.id}.name`] = u.en;
  origem.push(`cl:${u.id}`);
}
for (const [m, caminho] of Object.entries(TEX_UTENSILIO)) terreno.texture_data[`clhc_u_${m}`] = { textures: caminho };

for (const f of D.comidas) {
  const id = f.mesmo ?? f.id;
  const resultado = f.resultado ?? `cl:${id}`;
  if (!f.mesmo && !f.resultado) {
    const [forma, cor] = f.icone.split(":");
    icone(f.id, ICONE[forma](cor ? hex(cor) : undefined));
    item(f.id, f.fome ? comida(f.fome, f.bebida) : {}, f.fome ? "nature" : "items", f.fome ? pilhaHO(f.fome) : 64);
    nomes.pt[`item.cl:${f.id}.name`] = f.pt;
    nomes.en[`item.cl:${f.id}.name`] = f.en;
    origem.push(`cl:${f.id}`);
    if (f.fome) valores[`cl:${f.id}`] = [f.fome, 0.1];
    if (f.agua) bebidas[`cl:${f.id}`] = f.agua;
    if (f.temp) temperaturas[`cl:${f.id}`] = f.temp;
  }
  receita(f.id, {
    "minecraft:recipe_shapeless": {
      description: { identifier: `cl:hc_${f.id}` }, tags: [f.em ? `cl_${f.em}` : "crafting_table"],
      ingredients: f.ingredientes.map(ingrediente), unlock: SEMPRE,
      result: f.qtd ? { item: resultado, count: f.qtd } : { item: resultado },
    },
  });
}
// ---------- 1.47.0: HarvestCraft 2 (hortas silvestres, árvores frutíferas, comidas do Food Core) ----------
const hexDe = (rgb) => "#" + rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
const COR = Object.fromEntries([...D.culturas, ...H2.culturas, ...H2.arvores].map((c) => [c.produto ?? `cl:${c.id}`, c.cor]));
const semForma = (id, em, ings, resultado, qtd) => receita(id, {
  "minecraft:recipe_shapeless": {
    description: { identifier: `cl:hc_${id}` }, tags: [em ? `cl_${em}` : "crafting_table"], ingredients: ings.map(ingrediente), unlock: SEMPRE,
    result: qtd > 1 ? { item: resultado, count: qtd } : { item: resultado },
  },
});
// Forno, defumador e fogueira (como no HC2); o forno do Bedrock não aceita etiqueta: uma receita por alternativa.
const forno = (id, de, resultado) => de.filter((d) => !d.startsWith("#")).forEach((d, k) => receita(`${id}_forno${k || ""}`, {
  "minecraft:recipe_furnace": { description: { identifier: `cl:hc_${id}_forno${k || ""}` }, tags: ["furnace", "smoker", "campfire", "soul_campfire"], input: d, output: resultado },
}));
const PLANTA_GEO = "geometry.cl.planta";
const mat = (tex) => ({ "*": { texture: tex, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } });
const CHAO_HORTA = ["minecraft:grass_block", "minecraft:dirt", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:sand", "minecraft:red_sand", "minecraft:farmland", "minecraft:mud", "minecraft:moss_block"];
const CHAO_MUDA = ["minecraft:grass_block", "minecraft:dirt", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:farmland", "minecraft:rooted_dirt", "minecraft:moss_block"];

// Hortas: moita com as cores das colheitas de cada uma.
function hortaPng(h) {
  const cores = h.itens.map((i) => hex(COR[i] ?? "#c0c040"));
  const pontos = [[11, 15], [20, 11], [24, 20], [14, 23], [7, 22], [19, 19], [16, 8]];
  return png((x, y) => {
    for (const [k, [bx, by]] of pontos.entries()) if (elipse(x, y, bx, by, 2.2, 2.2)) return elipse(x, y, bx - 0.7, by - 0.7, 0.7, 0.7) ? mix(cores[k % cores.length], BRANCO, 0.5) : cores[(k * 5) % cores.length];
    for (const [fx, fy, rx, ry] of [[9, 21, 7, 7], [17, 14, 9, 8], [24, 21, 7, 7], [15, 25, 10, 6]]) {
      if (elipse(x, y, fx, fy, rx, ry)) return mix(VERDE_ESC, VERDE, 0.3 + ruido(x, y, 30) * 0.7);
    }
    return null;
  });
}
for (const h of H2.hortas) {
  writeFileSync(join(dirBloco, `${h.id}.png`), hortaPng(h));
  terreno.texture_data[`clhc_${h.id}`] = { textures: `textures/blocks/cl/hc/${h.id}` };
  json(`BP/blocks/${h.id}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${h.id}`, menu_category: { category: "nature" } },
      components: {
        "minecraft:geometry": PLANTA_GEO, "minecraft:material_instances": mat(`clhc_${h.id}`), "minecraft:collision_box": false,
        "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 13, 12] }, "minecraft:destructible_by_mining": { seconds_to_destroy: 0 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 0 }, "minecraft:light_dampening": 0, "minecraft:map_color": "#4f9a3a",
        "minecraft:flammable": { catch_chance_modifier: 60, destroy_chance_modifier: 100 },
        "minecraft:loot": `loot_tables/cl/hc/${h.id}.json`,
        "minecraft:placement_filter": { conditions: [{ allowed_faces: ["up"], block_filter: CHAO_HORTA }] },
        "cl:horta": {},
      },
    },
  });
  // Uma colheita da lista, sorteada (como a do HC2).
  json(`BP/loot_tables/cl/hc/${h.id}.json`, { pools: [{ rolls: 1, entries: h.itens.map((i) => ({ type: "item", name: i, weight: 1 })) }] });
  nomes.pt[`tile.cl:${h.id}.name`] = h.pt;
  nomes.en[`tile.cl:${h.id}.name`] = h.en;
  origem.push(`cl:${h.id}`);
}

// Árvores frutíferas: muda, fruto pendurado (3 estágios: flor, verde, maduro) e o item do fruto.
function mudaPng(a) {
  const c = hex(a.cor);
  return png((x, y) => {
    if (Math.abs(x - 16) < 1.2 && y >= 16 && y <= 31) return MARROM;
    if (elipse(x, y, 12, 19, 1.8, 1.8) || elipse(x, y, 20, 12, 1.8, 1.8)) return c;
    const copa = (p, q) => elipse(p, q, 16, 12, 9, 8) || elipse(p, q, 11, 17, 5, 4) || elipse(p, q, 21, 17, 5, 4);
    if (copa(x, y)) return borda(copa, x, y) ? VERDE_ESC : mix(VERDE_ESC, VERDE, 0.4 + ruido(x, y, 31) * 0.6);
    return null;
  });
}
function frutoPng(a, k) {
  const escala = [0, 0.5, 0.72][k];
  const cor = k === 2 ? a.cor : hexDe(mix(hex("#7ab03a"), hex(a.cor), 0.3));
  const pintor = k ? pintorDe(a.forma, cor) : null;
  return png((x, y) => {
    if (Math.abs(x - 16) < 0.8 && y <= 5) return VERDE_ESC;
    if (k === 0) {
      if (elipse(x, y, 16, 8, 3.5, 3.5)) return elipse(x, y, 16, 8, 1.2, 1.2) ? hex("#f2c94c") : BRANCO;
      return null;
    }
    const x0 = 16 - 16 * escala, u = Math.floor((x - x0) / escala), v = Math.floor((y - 3) / escala);
    return u < 0 || v < 0 || u > 31 || v > 31 ? null : pintor(u, v);
  });
}
const ARVORES = {}, FRUTOS = {};
for (const a of H2.arvores) {
  const muda = `muda_${a.id}`, fruto = `fruto_${a.id}`;
  writeFileSync(join(dirBloco, `${muda}.png`), mudaPng(a));
  terreno.texture_data[`clhc_${muda}`] = { textures: `textures/blocks/cl/hc/${muda}` };
  for (let k = 0; k < 3; k++) {
    writeFileSync(join(dirBloco, `${fruto}_${k}.png`), frutoPng(a, k));
    terreno.texture_data[`clhc_${fruto}_${k}`] = { textures: `textures/blocks/cl/hc/${fruto}_${k}` };
  }
  json(`BP/blocks/${muda}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${muda}`, menu_category: { category: "nature" } },
      components: {
        "minecraft:geometry": PLANTA_GEO, "minecraft:material_instances": mat(`clhc_${muda}`), "minecraft:collision_box": false,
        "minecraft:selection_box": { origin: [-5, 0, -5], size: [10, 12, 10] }, "minecraft:destructible_by_mining": { seconds_to_destroy: 0 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 0 }, "minecraft:light_dampening": 0, "minecraft:map_color": a.cor,
        "minecraft:placement_filter": { conditions: [{ allowed_faces: ["up"], block_filter: CHAO_MUDA }] },
        "minecraft:tick": { interval_range: [600, 1200], looping: true }, "cl:muda_hc": {},
      },
    },
  });
  json(`BP/blocks/${fruto}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${fruto}`, menu_category: { category: "none" }, states: { "cl:estagio": { values: { min: 0, max: 2 } } } },
      components: {
        "minecraft:geometry": PLANTA_GEO, "minecraft:material_instances": mat(`clhc_${fruto}_0`), "minecraft:collision_box": false,
        "minecraft:selection_box": { origin: [-4, 4, -4], size: [8, 12, 8] }, "minecraft:destructible_by_mining": { seconds_to_destroy: 0.1 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 0 }, "minecraft:light_dampening": 0, "minecraft:map_color": a.cor,
        "minecraft:loot": "loot_tables/empty.json", "minecraft:tick": { interval_range: [600, 1200], looping: true }, "cl:fruto_hc": {},
      },
      permutations: [1, 2].map((k) => ({ condition: `q.block_state('cl:estagio') == ${k}`, components: { "minecraft:material_instances": mat(`clhc_${fruto}_${k}`) } })),
    },
  });
  if (a.produto === `cl:${a.id}`) {
    icone(a.id, pintorDe(a.forma, a.cor));
    item(a.id, a.fome ? comida(a.fome) : {}, a.fome ? "nature" : "items", a.fome ? pilhaHO(a.fome) : 64);
    if (a.fome) valores[`cl:${a.id}`] = [a.fome, 0.1];
    nomes.pt[`item.cl:${a.id}.name`] = a.pt;
    nomes.en[`item.cl:${a.id}.name`] = a.en;
    origem.push(`cl:${a.id}`);
  }
  // Muda: 8 frutos e uma muda qualquer (no Bedrock, a de carvalho), como no HC2.
  semForma(`muda_${a.id}`, "", [...Array(8).fill(a.produto), "minecraft:oak_sapling"], `cl:${muda}`, 1);
  nomes.pt[`tile.cl:${muda}.name`] = `Muda de ${a.pt}`;
  nomes.en[`tile.cl:${muda}.name`] = `${a.en.replace(/s$/, "")} Sapling`;
  nomes.pt[`tile.cl:${fruto}.name`] = `${a.pt} (no pé)`;
  nomes.en[`tile.cl:${fruto}.name`] = `${a.en} Fruit`;
  origem.push(`cl:${muda}`, `cl:${fruto}`);
  ARVORES[`cl:${muda}`] = { fruto: `cl:${fruto}`, tronco: a.tronco, folha: a.folha, altura: a.altura };
  FRUTOS[`cl:${fruto}`] = a.produto;
}

// Comidas do Food Core e o que vai ao forno (Crops e Trees).
for (const f of [...H2.comidas, ...H2.fornos]) {
  const resultado = f.resultado ?? `cl:${f.mesmo ?? f.id}`;
  if (!f.mesmo && !f.resultado) {
    const [forma, cor] = f.icone.split(":");
    icone(f.id, pintorDe(forma, cor));
    item(f.id, f.fome ? comida(f.fome, f.bebida) : {}, f.fome ? "nature" : "items", f.fome ? pilhaHO(f.fome) : 64);
    nomes.pt[`item.cl:${f.id}.name`] = f.pt;
    nomes.en[`item.cl:${f.id}.name`] = f.en;
    origem.push(`cl:${f.id}`);
    if (f.fome) valores[`cl:${f.id}`] = [f.fome, 0.1];
    if (f.agua) bebidas[`cl:${f.id}`] = f.agua;
    if (f.temp) temperaturas[`cl:${f.id}`] = f.temp;
  }
  (f.receitas ?? []).forEach(([em, vs, qtd], r) => vs.forEach((ings, v) => semForma(`${f.id}_${r}_${v}`, em, ings, resultado, qtd)));
  if (f.forno) forno(f.id, f.forno, resultado);
}
for (const e of H2.extras) e.variantes.forEach((ings, v) => semForma(`${e.id}_${v}`, e.em, ings, e.resultado, e.qtd));

// Textos do HC2 (estágios do fruto e missões do Diário).
for (const [k, pt, en] of [
  ["cl.hc2.fruto.0", "Em flor", "Flowering"], ["cl.hc2.fruto.1", "Verde", "Unripe"], ["cl.hc2.fruto.2", "Maduro (toque para colher)", "Ripe (tap to pick)"],
  ["cl.missao.hc2_horta.titulo", "Horta silvestre", "Wild garden"],
  ["cl.missao.hc2_horta.desc", "Quebre uma horta silvestre (deserto, taiga, floresta, pântano, selva, planície ou savana): dá uma colheita da região.", "Break a wild garden (desert, taiga, forest, swamp, jungle, plains or savanna): it gives a crop of the region."],
  ["cl.missao.hc2_rolo.titulo", "Rolo de Massa", "Roller"], ["cl.missao.hc2_rolo.desc", "Ponha um Rolo de Massa (2 gravetos e 1 tronco).", "Place a Roller (2 sticks and 1 log)."],
  ["cl.missao.hc2_macarrao.titulo", "Macarrão", "Pasta"], ["cl.missao.hc2_macarrao.desc", "Abra massa no Rolo: tenha 2 Macarrões.", "Roll dough on the Roller: have 2 Pasta."],
  ["cl.missao.hc2_arvore.titulo", "Pomar", "Orchard"],
  ["cl.missao.hc2_arvore.desc", "Faça crescer uma árvore frutífera (muda = 8 frutos + muda de carvalho; farinha de osso ajuda).", "Grow a fruit tree (sapling = 8 fruits + oak sapling; bone meal helps)."],
  ["cl.missao.hc2_fruta.titulo", "Fruta do pé", "Fresh from the tree"], ["cl.missao.hc2_fruta.desc", "Colha 10 frutos maduros das árvores.", "Pick 10 ripe fruits from trees."],
]) {
  nomes.pt[k] = pt;
  nomes.en[k] = en;
}
json("RP/textures/item_texture.json", itemTex);
json("RP/textures/terrain_texture.json", terreno);

// Textos: o trecho entre as marcas é refeito a cada build.
for (const [arq, lingua] of [["RP/texts/pt_BR.lang", "pt"], ["RP/texts/en_US.lang", "en"]]) {
  const INI = "## HarvestCraft (gerado por tools/gerar-harvestcraft.mjs)", FIM = "## fim HarvestCraft";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const i = texto.indexOf(INI);
  if (i >= 0) texto = texto.slice(0, i) + texto.slice(texto.indexOf(FIM) + FIM.length + 1);
  const linhas = Object.entries(nomes[lingua]).map(([k, v]) => `${k}=${v}`);
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${linhas.join("\n")}\n${FIM}\n`);
}

pasta("scripts/harvest");
writeFileSync(join(RAIZ, "scripts/harvest/gerado.ts"), `// Gerado por tools/gerar-harvestcraft.mjs a partir de tools/dados/harvestcraft.json. Não edite à mão.
export const CULTURAS: ReadonlyArray<{ id: string; planta: string; semente: string; produto: string; deserto: boolean }> = ${JSON.stringify(
  D.culturas.map((c) => ({ id: c.id, planta: `cl:planta_${c.id}`, semente: `cl:semente_${c.id}`, produto: c.produto ?? `cl:${c.id}`, deserto: !!c.deserto })),
)};
export const UTENSILIOS: ReadonlyArray<string> = ${JSON.stringify([...D.utensilios, H2.rolo].map((u) => `cl:${u.id}`))};
// HarvestCraft 2 (1.47.0): hortas silvestres, árvores (muda -> fruto, tronco, folha, altura base/a/b) e frutos (-> o que dá).
export const HORTAS_HC: ReadonlyArray<string> = ${JSON.stringify(H2.hortas.map((h) => `cl:${h.id}`))};
export const ARVORES_HC: Readonly<Record<string, { fruto: string; tronco: string; folha: string; altura: readonly [number, number, number] }>> = ${JSON.stringify(ARVORES)};
export const FRUTOS_HC: Readonly<Record<string, string>> = ${JSON.stringify(FRUTOS)};
// Fome e modificador de saturação das comidas do HarvestCraft (regra do Hunger Overhaul).
export const COMIDAS_HC: Readonly<Record<string, readonly [number, number]>> = ${JSON.stringify(valores)};
export const BEBIDAS_HC: Readonly<Record<string, number>> = ${JSON.stringify(bebidas)};
export const TEMPERATURA_HC: Readonly<Record<string, number>> = ${JSON.stringify(temperaturas)};
export const ITENS_HC: ReadonlyArray<string> = ${JSON.stringify(origem)};
`);
console.log(`harvestcraft: ${D.culturas.length + H2.culturas.length} plantações, ${D.utensilios.length + 1} utensílios, ${H2.hortas.length} hortas, ${H2.arvores.length} árvores, ${D.comidas.length + H2.comidas.length + H2.fornos.length} comidas`);

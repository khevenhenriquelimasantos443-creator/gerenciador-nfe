// Pintura procedural das Fases 15+ (tools/gerar-conteudo.mjs): ícones de item 32x32 e texturas de
// bloco 32x32 no estilo da Fase 9 (branco-gelo, grafite e uma faixa de luz colorida).
// São só o "rascunho": quando chega o desenho feito à mão (tools/importar-icones.py), ele vale.
import { gerarPng } from "./png.mjs";

export const T = 32;
export const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
export const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * Math.max(0, Math.min(1, t))));
export const mul = (c, f) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
export const ruido = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const elipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const borda = (m, x, y) => m(x, y) && (!m(x - 1, y) || !m(x + 1, y) || !m(x, y - 1) || !m(x, y + 1));
export const png = (pintar, w = T, h = T) =>
  gerarPng(w, h, (x, y) => {
    const p = pintar(x, y);
    return !p ? [0, 0, 0, 0] : p.length === 4 ? p : [...p, 255];
  });

export const COR = {
  branco: hex("#eef1f4"), branco2: hex("#d9dfe4"), costura: hex("#b9c2ca"), grafite: hex("#2b3138"),
  grafiteLuz: hex("#3c444d"), tela: hex("#0d141b"), madeira: hex("#9c7a4a"),
};
export const LUZ = {
  ciano: hex("#5ff3ff"), laranja: hex("#ffa142"), azul: hex("#58b4ff"), verde: hex("#7dffa8"),
  violeta: hex("#c08cff"), vermelho: hex("#ff5a5a"), amarelo: hex("#ffe14a"), branco: hex("#ffffff"),
};
export const MATERIAL = {
  madeira: "#a07c48", pedra: "#8c8c8c", silex: "#55545e", cacto: "#4f8f3a", osso: "#e6dfc6", obsidiana: "#3d2c5e",
  ferro: "#d6d9dc", cobre: "#d4743c", bronze: "#c8913a", aco: "#8797a6", ouro: "#f2c94c", estanho: "#c4cad0",
};

/** Forma cheia com contorno 1 px mais escuro e luz vinda de cima à esquerda. */
function solido(m, cor, x, y, brilho = 0.3) {
  if (!m(x, y)) return null;
  if (borda(m, x, y)) return mul(cor, 0.5);
  const l = brilho - ((x + y) / 64) * brilho * 2;
  return l >= 0 ? mix(cor, [255, 255, 255], l) : mul(cor, 1 + l);
}
// Faixa diagonal (de baixo-esquerda para cima-direita), para cabos e lâminas.
const diag = (x, y, x0, y0, x1, y1, w) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
  const t = ((x - x0) * dx + (y - y0) * dy) / (L * L);
  if (t < 0 || t > 1) return false;
  return Math.abs((x - x0) * dy - (y - y0) * dx) / L <= w;
};

// ---------- silhuetas (máscaras 32x32) ----------
const S = {
  cabo: (x, y) => diag(x, y, 7, 26, 25, 6, 1.6),
  ligacao: (x, y) => elipse(x, y, 16, 16, 9, 9) && !elipse(x, y, 16, 16, 5, 5),
  cabeca_picareta: (x, y) => (y >= 8 && y <= 13 && Math.abs(x - 16) <= 13 - Math.max(0, (Math.abs(x - 16) - 6) * 0.6) && y >= 8 + Math.max(0, Math.abs(x - 16) - 7) * 0.5) || (Math.abs(x - 16) <= 3 && y >= 8 && y <= 18),
  cabeca_pa: (x, y) => elipse(x, y, 16, 14, 8, 10) || (Math.abs(x - 16) <= 2 && y >= 22 && y <= 27),
  cabeca_machado: (x, y) => (x >= 9 && x <= 22 && y >= 7 && y <= 25 && x <= 9 + (y < 16 ? 13 - (16 - y) * 0.3 : 13 - (y - 16) * 0.3)) || (x >= 5 && x <= 10 && y >= 13 && y <= 19),
  lamina_espada: (x, y) => diag(x, y, 8, 24, 26, 6, 3) || diag(x, y, 24, 8, 28, 4, 1.4),
  guarda_larga: (x, y) => (y >= 13 && y <= 18 && x >= 4 && x <= 27) || (Math.abs(x - 16) <= 3 && y >= 10 && y <= 21),
  travessa: (x, y) => y >= 14 && y <= 17 && x >= 7 && x <= 24,
};
// Ferramentas montadas: cabeça na cor do material, cabo de madeira.
const CABO = (x, y) => diag(x, y, 5, 27, 20, 12, 1.4);
const FERR = {
  picareta: (x, y) => diag(x, y, 12, 5, 27, 20, 2.2),
  pa: (x, y) => elipse(x, y, 22, 10, 6, 7),
  machadinha: (x, y) => (x >= 16 && x <= 27 && y >= 4 && y <= 17 && (x - 16) + (y - 4) * 0.2 <= 11) && !(x > 24 && y > 14),
  espada_larga: (x, y) => diag(x, y, 13, 19, 27, 5, 2.6),
};

// ---------- ícones de item ----------
const silhueta = (m, cor) => (x, y) => solido(m, cor, x, y);
export const ICONE = {
  lingote: (c) => silhueta((x, y) => y >= 11 && y <= 22 && x >= 4 + (22 - y) * 0.35 && x <= 27 - (22 - y) * 0.35, c),
  pepita: (c) => silhueta((x, y) => elipse(x, y, 16, 17, 7, 5), c),
  po: (c) => (x, y) => {
    const h = 25 - 10 * Math.max(0, 1 - ((x - 16) / 12) ** 2);
    if (y < h || y > 25 || x < 4 || x > 28) return null;
    return y < h + 1 ? mul(c, 0.8) : mix(c, mul(c, 0.82), ruido(x, y, 7));
  },
  cristal: (c) => silhueta((x, y) => Math.abs(x - 16) <= 6 - Math.max(0, 8 - y) * 0.9 && y >= 4 && y <= 27 - Math.max(0, Math.abs(x - 16) - 2) * 1.2, c),
  barra: (c) => silhueta((x, y) => diag(x, y, 6, 25, 26, 7, 2.5), c),
  placa: (c) => silhueta((x, y) => x >= 5 && x <= 26 && y >= 8 && y <= 23, c),
  bloco: (c) => silhueta((x, y) => x >= 6 && x <= 25 && y >= 6 && y <= 25, c),
  bola: (c) => silhueta((x, y) => elipse(x, y, 16, 17, 9, 9), c),
  gota: (c) => silhueta((x, y) => elipse(x, y, 16, 19, 7, 7) || (y >= 6 && y < 16 && Math.abs(x - 16) <= (y - 6) * 0.7), c),
  tijolo: (c) => (x, y) => {
    const m = (a, b) => a >= 5 && a <= 26 && b >= 10 && b <= 21;
    const p = solido(m, c, x, y, 0.2);
    return p && !borda(m, x, y) && ruido(x, y, 3) < 0.12 ? mul(c, 0.8) : p;
  },
  chip: (c) => (x, y) => {
    if ((x === 8 || x === 12 || x === 16 || x === 20 || x === 24) && (y === 6 || y === 26)) return hex("#e8c860");
    const m = (a, b) => a >= 6 && a <= 26 && b >= 7 && b <= 25;
    const p = solido(m, mul(c, 0.7), x, y, 0.15);
    if (p && x >= 12 && x <= 20 && y >= 12 && y <= 20) return mix(c, [255, 255, 255], 0.25);
    return p;
  },
  celula: (c) => (x, y) => {
    const m = (a, b) => a >= 8 && a <= 24 && b >= 4 && b <= 27;
    const p = solido(m, COR.branco2, x, y, 0.2);
    if (p && !borda(m, x, y) && y >= 9 && y <= 12) return c;
    if (p && !borda(m, x, y) && x >= 12 && x <= 20 && y >= 16 && y <= 23) return mul(c, 0.7);
    return p;
  },
  garrafa: (c) => (x, y) => {
    const m = (a, b) => (b >= 4 && b <= 9 && Math.abs(a - 16) <= 2) || (b >= 10 && b <= 27 && Math.abs(a - 16) <= 7 - Math.max(0, 13 - b));
    if (!m(x, y)) return null;
    if (borda(m, x, y)) return hex("#9fb8c4");
    if (y < 13) return hex("#dcecf2");
    return mix(c, [255, 255, 255], x === 12 ? 0.35 : 0.05);
  },
  saco: (c) => silhueta((x, y) => elipse(x, y, 16, 19, 10, 9) || (y >= 6 && y <= 11 && Math.abs(x - 16) <= 3), c),
  engrenagem: (c) => silhueta((x, y) => {
    const r = Math.hypot(x - 15.5, y - 15.5), a = Math.atan2(y - 15.5, x - 15.5);
    return (r <= 9 || (r <= 12 && Math.cos(a * 8) > 0.3)) && r >= 3.5;
  }, c),
  upgrade: (c) => (x, y) => {
    const m = (a, b) => a >= 5 && a <= 26 && b >= 5 && b <= 26;
    const p = solido(m, COR.grafiteLuz, x, y, 0.2);
    if (!p || borda(m, x, y)) return p;
    if (Math.abs(x - 16) <= 7 - (y - 8) && y >= 8 && y <= 15) return c; // seta
    if (Math.abs(x - 16) <= 2 && y >= 15 && y <= 23) return c;
    return p;
  },
  nucleo: (c) => (x, y) => {
    if (!elipse(x, y, 16, 16, 11, 11)) return null;
    const r = Math.hypot(x - 16, y - 16);
    return r > 10 ? mul(COR.costura, 0.8) : mix(c, [255, 255, 255], Math.max(0, 0.6 - r / 12));
  },
  tablet: (c) => (x, y) => {
    const m = (a, b) => a >= 7 && a <= 24 && b >= 4 && b <= 27;
    const p = solido(m, COR.grafite, x, y, 0.15);
    if (p && x >= 9 && x <= 22 && y >= 7 && y <= 20) return (y - 7) % 3 === 0 && x < 20 ? c : COR.tela;
    if (x === 22 && y >= 0 && y < 4) return COR.costura; // antena
    return p;
  },
  manometro: (c) => (x, y) => {
    if (!elipse(x, y, 16, 16, 11, 11)) return null;
    const r = Math.hypot(x - 16, y - 16);
    if (r > 9.5) return hex("#b08a3a");
    if (diag(x, y, 16, 16, 22, 10, 0.8)) return hex("#c0392b");
    return r < 1.5 ? COR.grafite : hex("#f3efe2");
  },
  faca: (c) => (x, y) => (diag(x, y, 6, 26, 14, 18, 1.6) ? COR.madeira : solido((a, b) => diag(a, b, 14, 18, 27, 5, 2.2), c, x, y)),
  carrinho: (c) => (x, y) => {
    if (diag(x, y, 8, 4, 12, 24, 1.2) || (y >= 22 && y <= 24 && x >= 10 && x <= 26)) return c;
    if (elipse(x, y, 13, 27, 2.5, 2.5) || elipse(x, y, 23, 27, 2.5, 2.5)) return COR.grafite;
    return null;
  },
  chave: (c) => silhueta((x, y) => diag(x, y, 7, 25, 21, 11, 2) || (elipse(x, y, 23, 9, 5, 5) && !elipse(x, y, 25, 7, 2.2, 2.2)), c),
  folha: (c) => (x, y) => {
    const m = (a, b) => a >= 6 && a <= 25 && b >= 5 && b <= 26;
    if (!m(x, y)) return null;
    return borda(m, x, y) ? mul(c, 0.75) : mix(c, [255, 255, 255], 0.1 + ruido(x, y, 9) * 0.1);
  },
  cinzel: () => (x, y) => (diag(x, y, 6, 26, 15, 17, 1.8) ? COR.madeira : solido((a, b) => diag(a, b, 15, 17, 26, 6, 1.4), hex("#c8ccd0"), x, y)),
  padrao: (forma) => (x, y) => {
    const m = (a, b) => a >= 3 && a <= 28 && b >= 3 && b <= 28;
    if (!m(x, y)) return null;
    const madeira = hex("#d9b77a");
    if (borda(m, x, y)) return mul(madeira, 0.6);
    if (forma && S[forma](x, y)) return borda(S[forma], x, y) ? mul(madeira, 0.45) : mul(madeira, 0.75);
    return mix(madeira, [255, 255, 255], ruido(x, y, 4) * 0.12);
  },
  molde: (forma) => (x, y) => {
    const m = (a, b) => a >= 3 && a <= 28 && b >= 3 && b <= 28;
    if (!m(x, y)) return null;
    const ouro = hex("#e8b830");
    if (borda(m, x, y)) return mul(ouro, 0.55);
    if (S[forma]?.(x, y) || (forma === "lingote" && y >= 12 && y <= 20 && x >= 8 && x <= 23) || (forma === "pepita" && elipse(x, y, 16, 16, 5, 4)))
      return mul(ouro, 0.45);
    return mix(ouro, [255, 255, 255], 0.15 - (x + y) / 400);
  },
  peca: (forma, c) => silhueta(S[forma], c),
  ferramenta: (tipo, c) => (x, y) => {
    const cabeca = solido(FERR[tipo], c, x, y, 0.35);
    if (cabeca) return cabeca;
    return CABO(x, y) ? (borda(CABO, x, y) ? mul(COR.madeira, 0.55) : COR.madeira) : null;
  },
};

/** "forma:#cor" ou "peca:forma:material" etc. -> função de pintura. */
export function icone(spec) {
  const [forma, a, b] = spec.split(":");
  const cor = (v) => (v?.startsWith("#") ? hex(v) : hex(MATERIAL[v] ?? "#cccccc"));
  if (forma === "peca") return ICONE.peca(a, cor(b));
  if (forma === "ferramenta") return ICONE.ferramenta(a, cor(b));
  if (forma === "padrao" || forma === "molde") return ICONE[forma](a);
  if (forma === "cinzel") return ICONE.cinzel();
  if (!ICONE[forma]) throw new Error(`ícone desconhecido: ${spec}`);
  return ICONE[forma](cor(a));
}

// ---------- texturas de bloco ----------
const quadro = (x, y, n = 1) => x < n || y < n || x >= T - n || y >= T - n;
const painel = (x, y) => {
  if (quadro(x, y)) return COR.costura;
  if (y === 1) return mix(COR.branco, [255, 255, 255], 0.6);
  return mul(mix(COR.branco, COR.branco2, y / T), 0.985 + ruido(x, y, 1) * 0.03);
};
// Desenhos da tela da frente das máquinas (máscara em 32x32, área útil de 8 a 23).
const GLIFO = {
  engrenagem: (x, y) => {
    const r = Math.hypot(x - 15.5, y - 15.5), a = Math.atan2(y - 15.5, x - 15.5);
    return (r <= 5 || (r <= 7 && Math.cos(a * 6) > 0.3)) && r >= 2;
  },
  chama: (x, y) => elipse(x, y, 16, 19, 5, 5) || (y >= 9 && y < 19 && Math.abs(x - 16 - Math.sin(y / 2)) <= (y - 9) * 0.5),
  gota: (x, y) => elipse(x, y, 16, 18, 5, 5) || (y >= 9 && y < 18 && Math.abs(x - 16) <= (y - 9) * 0.55),
  raio: (x, y) => diag(x, y, 19, 8, 13, 16, 1.5) || diag(x, y, 13, 16, 19, 16, 1) || diag(x, y, 19, 16, 13, 24, 1.5),
  seta: (x, y) => (Math.abs(x - 16) <= 6 - (y - 9) && y >= 9 && y <= 15) || (Math.abs(x - 16) <= 2 && y > 15 && y <= 23),
  cristal: (x, y) => Math.abs(x - 16) <= 4 - Math.max(0, 12 - y) && y >= 8 && y <= 23 - Math.max(0, Math.abs(x - 16) - 1),
  folha: (x, y) => elipse(x, y, 16, 15, 4, 7) || (Math.abs(x - 16) < 0.6 && y >= 15 && y <= 23),
  grade: (x, y) => x >= 9 && x <= 22 && y >= 9 && y <= 22 && (x % 4 === 1 || y % 4 === 1),
  circulo: (x, y) => elipse(x, y, 15.5, 15.5, 6.5, 6.5) && !elipse(x, y, 15.5, 15.5, 4, 4),
  x: (x, y) => x >= 9 && x <= 22 && y >= 9 && y <= 22 && (Math.abs(x - y) < 1.5 || Math.abs(x + y - 31) < 1.5),
  caixa: (x, y) => x >= 9 && x <= 22 && y >= 10 && y <= 22 && (x === 9 || x === 22 || y === 10 || y === 22 || y === 14),
  serra: (x, y) => {
    const r = Math.hypot(x - 15.5, y - 15.5), a = Math.atan2(y - 15.5, x - 15.5);
    return r <= 7 - ((a * 12 / Math.PI) % 1) * 2 && r >= 1.5;
  },
  floco: (x, y) => (Math.abs(x - 16) < 1 || Math.abs(y - 16) < 1 || Math.abs(x - y) < 1 || Math.abs(x + y - 32) < 1) && Math.hypot(x - 16, y - 16) <= 7,
  pessoa: (x, y) => elipse(x, y, 16, 11, 3, 3) || (y >= 15 && y <= 23 && Math.abs(x - 16) <= 4 - (y > 20 ? 1 : 0)),
};

export const FACE = {
  lado: (luz) => (x, y) => {
    if (y >= 14 && y <= 17 && x >= 3 && x <= 28) return y === 14 || y === 17 ? mul(LUZ[luz], 0.6) : mix(LUZ[luz], [255, 255, 255], 0.3);
    return painel(x, y);
  },
  topo: (luz) => (x, y) => {
    if (quadro(x, y, 3) && !quadro(x, y, 1)) return COR.grafiteLuz;
    if (Math.abs(x - 15.5) < 1 || Math.abs(y - 15.5) < 1) return COR.costura;
    if (elipse(x, y, 15.5, 15.5, 2.5, 2.5)) return LUZ[luz];
    return painel(x, y);
  },
  baixo: () => (x, y) => (quadro(x, y) ? COR.grafiteLuz : x % 8 === 0 || y % 8 === 0 ? mix(COR.grafite, COR.grafiteLuz, 0.35) : mul(COR.grafite, 0.95 + ruido(x, y, 3) * 0.1)),
  frente: (luz, glifo) => (x, y) => {
    if (quadro(x, y, 2)) return quadro(x, y, 1) ? COR.costura : COR.grafiteLuz;
    if (quadro(x, y, 6)) return painel(x, y);
    if (quadro(x, y, 7)) return COR.grafite;
    if (GLIFO[glifo]?.(x, y)) return mix(LUZ[luz], [255, 255, 255], 0.25);
    return mix(COR.tela, LUZ[luz], ruido(x, y, 5) < 0.04 ? 0.25 : 0.06);
  },
};

// Blocos "cubo" (decorativos, metais, tijolos, vidro): cor base + padrão.
export const PADRAO = {
  liso: (c) => (x, y) => mul(c, 0.94 + ruido(x, y, 11) * 0.1),
  polido: (c) => (x, y) => (quadro(x, y) ? mul(c, 0.8) : y === 1 || x === 1 ? mix(c, [255, 255, 255], 0.3) : mul(c, 0.97 + ruido(x, y, 12) * 0.05)),
  metal: (c) => (x, y) => (quadro(x, y) ? mul(c, 0.7) : (x + y) % 11 === 0 ? mix(c, [255, 255, 255], 0.25) : mul(c, 0.92 + (1 - y / T) * 0.12)),
  rebitado: (c) => (x, y) => {
    if (quadro(x, y)) return mul(c, 0.65);
    if ((x === 4 || x === 27) && (y === 4 || y === 27)) return mix(c, [255, 255, 255], 0.4);
    return mul(c, 0.9 + ruido(x, y, 13) * 0.08);
  },
  tijolos: (c) => (x, y) => {
    const fila = Math.floor(y / 8), off = fila % 2 ? 8 : 0;
    if (y % 8 === 7 || (x + off) % 16 === 15) return mul(c, 0.62);
    return mul(c, 0.9 + ruido(x >> 1, y >> 1, 14) * 0.18);
  },
  tijolos_pequenos: (c) => (x, y) => {
    const fila = Math.floor(y / 4), off = fila % 2 ? 4 : 0;
    if (y % 4 === 3 || (x + off) % 8 === 7) return mul(c, 0.65);
    return mul(c, 0.9 + ruido(x, y, 15) * 0.15);
  },
  ladrilho: (c) => (x, y) => (x % 16 === 0 || y % 16 === 0 ? mul(c, 0.6) : x % 16 === 1 || y % 16 === 1 ? mix(c, [255, 255, 255], 0.25) : mul(c, 0.95 + ruido(x, y, 16) * 0.06)),
  pilar: (c) => (x, y) => (x % 8 === 0 ? mul(c, 0.66) : x % 8 === 1 ? mix(c, [255, 255, 255], 0.2) : y < 2 || y > 29 ? mul(c, 0.8) : mul(c, 0.95 + ruido(x, y, 17) * 0.05)),
  entalhado: (c) => (x, y) => {
    if (quadro(x, y, 2)) return mul(c, quadro(x, y) ? 0.6 : 1.05);
    if (elipse(x, y, 15.5, 15.5, 8, 8) && !elipse(x, y, 15.5, 15.5, 6, 6)) return mul(c, 0.7);
    if (elipse(x, y, 15.5, 15.5, 2.5, 2.5)) return mul(c, 0.75);
    return mul(c, 0.95 + ruido(x, y, 18) * 0.05);
  },
  mosaico: (c) => (x, y) => {
    const k = ruido(x >> 2, y >> 2, 19);
    if (x % 4 === 3 || y % 4 === 3) return mul(c, 0.6);
    return mul(c, 0.8 + k * 0.35);
  },
  rachado: (c) => (x, y) => (Math.abs(Math.sin(x * 0.4) * 6 + 16 - y) < 0.8 || Math.abs(x - 10 - Math.sin(y * 0.5) * 3) < 0.6 ? mul(c, 0.55) : mul(c, 0.92 + ruido(x, y, 20) * 0.12)),
  vidro: (c) => (x, y) => (quadro(x, y) ? [...mul(c, 0.7), 255] : Math.abs(x - y - 6) < 1.5 || Math.abs(x - y + 10) < 1 ? [...mix(c, [255, 255, 255], 0.6), 170] : [...c, 70]),
  livros: (c) => (x, y) => {
    if (y % 16 === 15 || y % 16 === 0 || quadro(x, y)) return mul(COR.madeira, 0.7);
    const livro = Math.floor(x / 3);
    const cores = ["#8b2e2e", "#2e4f8b", "#2e7a3a", "#8b6f2e", "#5e2e8b", "#2e7a7a", "#7a2e5e", "#4a4a4a", "#8b4a2e", "#2e3a8b"];
    if (x % 3 === 2) return mul(COR.madeira, 0.5);
    return mul(hex(cores[(livro + (y > 15 ? 4 : 0)) % cores.length]), 0.85 + ruido(livro, y >> 3, 21) * 0.3);
  },
};

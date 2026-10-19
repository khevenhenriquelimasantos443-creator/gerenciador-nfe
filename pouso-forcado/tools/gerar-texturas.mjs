// Gera texturas placeholder (cor sólida + borda). Não sobrescreve arquivos
// existentes, para não apagar texturas que você já trocou. Use --force para regerar tudo.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCAR = process.argv.includes("--force");

const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 255];

/** Cor de fundo, borda de 1px e (opcional) um quadrado central. */
function placeholder({ tamanho = 16, fundo, borda, centro, margemCentro = 5 }) {
  const f = hex(fundo), b = hex(borda), c = centro && hex(centro);
  const max = tamanho - 1;
  const m = Math.round((margemCentro * tamanho) / 16);
  return gerarPng(tamanho, tamanho, (x, y) => {
    if (x === 0 || y === 0 || x === max || y === max) return b;
    if (c && x >= m && y >= m && x <= max - m && y <= max - m) return c;
    return f;
  });
}

const TEXTURAS = {
  "RP/textures/blocks/cl/condensador_lado.png": { fundo: "#7d8a96", borda: "#3a4148", centro: "#5b6670", margemCentro: 6 },
  "RP/textures/blocks/cl/condensador_topo.png": { fundo: "#7d8a96", borda: "#3a4148", centro: "#2b3f5c" },
  "RP/textures/blocks/cl/condensador_topo_cheio.png": { fundo: "#7d8a96", borda: "#3a4148", centro: "#3f8ce0" },
  "RP/textures/blocks/cl/condensador_base.png": { fundo: "#5b6670", borda: "#3a4148" },
  "RP/textures/blocks/cl/peneira_lado.png": { fundo: "#b58b52", borda: "#5c4020", centro: "#8a6535", margemCentro: 6 },
  "RP/textures/blocks/cl/peneira_topo.png": { fundo: "#d8c08a", borda: "#5c4020", centro: "#3a2a15", margemCentro: 4 },
  "RP/textures/blocks/cl/compostor_lado.png": { fundo: "#7a5a35", borda: "#3b2a16", centro: "#5e4426", margemCentro: 6 },
  "RP/textures/blocks/cl/compostor_topo.png": { fundo: "#7a5a35", borda: "#3b2a16", centro: "#2a1d10", margemCentro: 3 },
  "RP/textures/blocks/cl/compostor_topo_cheio.png": { fundo: "#7a5a35", borda: "#3b2a16", centro: "#5b7a2e", margemCentro: 3 },
  "RP/textures/blocks/cl/compostor_topo_pronto.png": { fundo: "#7a5a35", borda: "#3b2a16", centro: "#6b4a2b", margemCentro: 3 },
  "RP/textures/blocks/cl/condensador_avancado_lado.png": { fundo: "#6f8fa8", borda: "#2c3e50", centro: "#b87333", margemCentro: 6 },
  "RP/textures/blocks/cl/condensador_avancado_topo.png": { fundo: "#6f8fa8", borda: "#2c3e50", centro: "#2b3f5c" },
  "RP/textures/blocks/cl/condensador_avancado_topo_cheio.png": { fundo: "#6f8fa8", borda: "#2c3e50", centro: "#3f8ce0" },
  "RP/textures/blocks/cl/estufa_lado.png": { fundo: "#cfeedd", borda: "#b87333", centro: "#7cc58a", margemCentro: 5 },
  "RP/textures/blocks/cl/estufa_topo.png": { fundo: "#e6f7ee", borda: "#b87333", centro: "#9fd6a0", margemCentro: 4 },
  "RP/textures/items/cl/fruta_cacto.png": { fundo: "#c2185b", borda: "#4a7a2a", centro: "#f48fb1", margemCentro: 5 },
  "RP/textures/items/cl/agua_excelente.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#9ff0ff", margemCentro: 4 },
  "RP/textures/items/cl/agua_boa.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#3f8ce0", margemCentro: 4 },
  "RP/textures/items/cl/agua_suja.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#8a8a4a", margemCentro: 4 },
  "RP/textures/items/cl/agua_muito_suja.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#5a4a2a", margemCentro: 4 },
  "RP/textures/items/cl/agua_impropria.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#4f7a2a", margemCentro: 4 },
  "RP/textures/blocks/cl/painel_lado.png": { fundo: "#9aa4ad", borda: "#3a4148", centro: "#b87333", margemCentro: 6 },
  "RP/textures/blocks/cl/painel_topo.png": { fundo: "#1f3a66", borda: "#c0c8d0", centro: "#2f5fa8", margemCentro: 2 },
  "RP/textures/blocks/cl/gerador_lado.png": { fundo: "#555555", borda: "#222222", centro: "#2a2a2a", margemCentro: 5 },
  "RP/textures/blocks/cl/gerador_lado_aceso.png": { fundo: "#555555", borda: "#222222", centro: "#ff8c1a", margemCentro: 5 },
  "RP/textures/blocks/cl/gerador_topo.png": { fundo: "#666666", borda: "#222222", centro: "#444444", margemCentro: 4 },
  "RP/textures/blocks/cl/bateria_lado.png": { fundo: "#b87333", borda: "#4a2a10", centro: "#7a4a20", margemCentro: 6 },
  "RP/textures/blocks/cl/bateria_topo_vazia.png": { fundo: "#b87333", borda: "#4a2a10", centro: "#3a1a1a", margemCentro: 4 },
  "RP/textures/blocks/cl/bateria_topo_meia.png": { fundo: "#b87333", borda: "#4a2a10", centro: "#d8c020", margemCentro: 4 },
  "RP/textures/blocks/cl/bateria_topo_cheia.png": { fundo: "#b87333", borda: "#4a2a10", centro: "#40e040", margemCentro: 4 },
  "RP/textures/blocks/cl/moinho_lado.png": { fundo: "#d8d8d8", borda: "#6b4a2b", centro: "#a07850", margemCentro: 3 },
  "RP/textures/blocks/cl/moinho_topo.png": { fundo: "#a07850", borda: "#6b4a2b", centro: "#d8d8d8", margemCentro: 6 },
  "RP/textures/blocks/cl/gerador_monstros.png": { fundo: "#2a1a22", borda: "#111111", centro: "#a01c2c", margemCentro: 5 },
  "RP/textures/blocks/cl/cabo.png": { fundo: "#c46a2b", borda: "#6a3010", centro: "#e08a4a", margemCentro: 6 },
  "RP/textures/blocks/cl/peneira_auto_lado.png": { fundo: "#8a7a5a", borda: "#3a4148", centro: "#b87333", margemCentro: 5 },
  "RP/textures/items/cl/diario_bordo.png": { fundo: "#8b5a2b", borda: "#3e2410", centro: "#e8d9a8", margemCentro: 6 },
  "RP/pack_icon.png": { tamanho: 64, fundo: "#d9a066", borda: "#6b3f1d", centro: "#3f8ce0", margemCentro: 6 },
  "BP/pack_icon.png": { tamanho: 64, fundo: "#d9a066", borda: "#6b3f1d", centro: "#c0392b", margemCentro: 6 },
};

for (const [rel, opcoes] of Object.entries(TEXTURAS)) {
  const destino = join(RAIZ, rel);
  if (existsSync(destino) && !FORCAR) {
    console.log(`mantido  ${rel}`);
    continue;
  }
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, placeholder(opcoes));
  console.log(`gerado   ${rel}`);
}

// Fonte do minimapa (scripts/jogador/minimapa.ts): RP/font/glyph_E8.png = caracteres U+E800 a U+E8FF,
// 16x16 células de 16 px. Cada caractere é um quadradinho do mapa (8x8 blocos). Sempre regerada.
// Índices (iguais aos de minimapa.ts):
//   base * 12 + luz * 4 + grade, para as 12 bases abaixo; luz 0 normal, 1 claro, 2 sombra;
//   grade bit 1 = linha em cima, bit 2 = linha à esquerda (borda de chunk)
//   144 vazio (fora do círculo), 145 anel, 146-149 N L S O no anel, 150-157 você (8 direções)
function glifosMinimapa() {
  const rgb = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mul = ([r, g, b], f) => [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
  const ANEL = rgb("#2b3570");
  const AREIA = ["#e6d7a3", "#dfcd95", "#d8c489", "#d0ba7d", "#c8b071", "#bfa666"].map(rgb);
  // Cada base: (x, y) -> [r, g, b] e a opacidade.
  const bases = [
    { a: 215, px: () => rgb("#3b3833") }, // 0 ainda não carregado
    ...AREIA.map((c) => ({ px: () => c })), // 1-6 areia, da planície à crista mais alta
    { px: (x, y) => rgb(x >= 3 && x <= 12 && y >= 3 && y <= 12 ? (x + y) % 6 < 2 ? "#8a8780" : "#77746e" : "#a8a49a") }, // 7 cidade
    { px: (x, y) => rgb(x >= 4 && x <= 11 && y >= 4 && y <= 11 ? "#3c3c3c" : "#5e5e5e") }, // 8 torre
    { px: (x, y) => rgb(y % 4 < 2 ? "#e0a648" : "#c98b33") }, // 9 templo
    { px: (x, y) => rgb(Math.abs(x - y) <= 1 || Math.abs(x + y - 15) <= 1 ? "#2f6f7a" : "#6fb2bd") }, // 10 destroços
    { px: (x, y) => rgb(Math.hypot(x - 7.5, y - 7.5) < 3.5 ? "#e03030" : "#eeeeee") }, // 11 a sua nave
  ];
  const desenhos = [];
  for (const base of bases) {
    for (const luz of [1, 1.07, 0.85]) {
      for (let grade = 0; grade < 4; grade++) {
        desenhos.push((x, y) => {
          const linha = ((grade & 1) && y < 2) || ((grade & 2) && x < 2);
          return [...mul(base.px(x, y), luz * (linha ? 0.86 : 1)), base.a ?? 255];
        });
      }
    }
  }
  // 144 vazio: transparente, com um pontinho quase invisível nos cantos para o jogo dar a largura cheia.
  desenhos.push((x, y) => ((x === 0 || x === 15) && (y === 0 || y === 15) ? [0, 0, 0, 4] : [0, 0, 0, 0]));
  // 145 anel
  desenhos.push(() => [...ANEL, 255]);
  // 146-149 letras N L S O (5x7, ampliadas 2x) em branco sobre o anel
  const LETRAS = {
    N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  };
  for (const l of ["N", "L", "S", "O"]) {
    desenhos.push((x, y) => {
      const lx = Math.floor((x - 3) / 2), ly = Math.floor((y - 1) / 2);
      const aceso = lx >= 0 && lx < 5 && ly >= 0 && ly < 7 && LETRAS[l][ly][lx] === "1";
      return aceso ? [255, 255, 255, 255] : [...ANEL, 255];
    });
  }
  // 150-157 você: seta branca com borda azul (0 = norte, no sentido horário), sobre areia
  const seta = [[0, -7.5], [6.5, 7], [0, 3], [-6.5, 7]];
  const dentro = (px, py) => {
    let d = false;
    for (let i = 0, j = seta.length - 1; i < seta.length; j = i++) {
      const [xi, yi] = seta[i], [xj, yj] = seta[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) d = !d;
    }
    return d;
  };
  for (let k = 0; k < 8; k++) {
    const t = (k * Math.PI) / 4, c = Math.cos(t), s = Math.sin(t);
    const na = (x, y) => {
      const rx = x - 7.5, ry = y - 7.5;
      return dentro(rx * c + ry * s, -rx * s + ry * c);
    };
    desenhos.push((x, y) => {
      if (!na(x, y)) return [...AREIA[0], 255];
      const borda = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]].some(([dx, dy]) => !na(x + dx, y + dy));
      return borda ? [...ANEL, 255] : [255, 255, 255, 255];
    });
  }
  const png = gerarPng(256, 256, (x, y) => {
    const i = Math.floor(y / 16) * 16 + Math.floor(x / 16);
    return desenhos[i] ? desenhos[i](x % 16, y % 16) : [0, 0, 0, 0];
  });
  const destino = join(RAIZ, "RP/font/glyph_E8.png");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, png);
  console.log("gerado   RP/font/glyph_E8.png");
}
glifosMinimapa();

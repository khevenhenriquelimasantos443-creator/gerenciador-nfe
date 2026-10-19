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
// 16x16 células de 16 px. Cada caractere é um quadradinho do mapa (um chunk). Sempre regerada.
function glifosMinimapa() {
  const cor = (c, a = 255) => [...hex(c).slice(0, 3), a];
  const vazio = [0, 0, 0, 0];
  const lisos = ["#2a2620", "#e3d29b", "#c9b273", "#a68c4c"];
  const AREIA = "#e3d29b";
  const desenhos = [];
  // 0 desconhecido, 1 areia, 2 duna baixa, 3 duna alta
  lisos.forEach((c, i) => desenhos.push(() => cor(c, i === 0 ? 170 : 255)));
  // 4 quarteirão: prédios cinza com ruas mais escuras
  desenhos.push((x, y) => cor(x % 8 < 2 || y % 8 < 2 ? "#6e6a62" : "#a3a3a3"));
  // 5 torre (centro da cidade)
  desenhos.push((x, y) => cor(x < 2 || y < 2 || x > 13 || y > 13 ? "#3a3a3a" : x > 4 && x < 11 && y > 4 && y < 11 ? "#222222" : "#6e6e6e"));
  // 6 templo: pirâmide laranja
  desenhos.push((x, y) => cor(y >= 3 && y <= 13 && Math.abs(x - 7.5) <= (y - 2) * 0.7 ? (y % 3 === 0 ? "#a8642a" : "#e0a040") : AREIA));
  // 7 destroços: X de metal
  desenhos.push((x, y) => cor(Math.abs(x - y) <= 1.5 || Math.abs(x + y - 15) <= 1.5 ? (x < 3 || x > 12 ? "#2f6f7a" : "#4fb3c4") : AREIA));
  // 8 a sua nave: losango branco e vermelho
  desenhos.push((x, y) => {
    const d = Math.abs(x - 7.5) + Math.abs(y - 7.5);
    return cor(d <= 3 ? "#e03030" : d <= 7 ? "#f2f2f2" : "#3a3a3a");
  });
  // 9 a 16: você, uma seta para cada uma das 8 direções (0 = norte, no sentido horário)
  const seta = [[0, -7], [5, 6], [-5, 6]];
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
      if (!na(x, y)) return cor("#3a3a3a");
      const borda = !na(x - 1, y) || !na(x + 1, y) || !na(x, y - 1) || !na(x, y + 1);
      return cor(borda ? "#111111" : "#ff3030");
    });
  }
  const png = gerarPng(256, 256, (x, y) => {
    const i = Math.floor(y / 16) * 16 + Math.floor(x / 16);
    return desenhos[i] ? desenhos[i](x % 16, y % 16) : vazio;
  });
  const destino = join(RAIZ, "RP/font/glyph_E8.png");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, png);
  console.log("gerado   RP/font/glyph_E8.png");
}
glifosMinimapa();

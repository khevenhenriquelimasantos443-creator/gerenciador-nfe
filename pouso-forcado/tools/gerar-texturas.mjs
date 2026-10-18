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

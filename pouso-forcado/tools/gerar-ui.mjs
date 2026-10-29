// Texturas da tela do Diário de Bordo (RP/textures/ui/cl/), usadas por RP/ui/server_form.json:
// painel de console da nave (grafite com moldura de metal rebitada), barra de título laranja do avião com
// faixa de alerta, visor escuro para o texto e placas de metal para os botões (borda ciano ao tocar).
// Cada textura esticável tem o seu .json de nineslice ao lado.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hex, mix, mul, png, ruido } from "./pintura.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PASTA = join(RAIZ, "RP/textures/ui/cl");
mkdirSync(PASTA, { recursive: true });

function salvar(nome, pintar, w, h, nineslice) {
  writeFileSync(join(PASTA, `${nome}.png`), png(pintar, w, h));
  if (nineslice !== undefined) writeFileSync(join(PASTA, `${nome}.json`), `${JSON.stringify({ nineslice_size: nineslice, base_size: [w, h] })}\n`);
}

const C = {
  contorno: hex("#0d1013"), metal: hex("#8f98a1"), metalLuz: hex("#d4d9dd"), metalSombra: hex("#59606a"),
  painel: hex("#252a30"), painelEsc: hex("#1b1f24"), visor: hex("#141a1e"), ciano: hex("#43d9e6"),
  laranja: hex("#ea8a2c"), laranjaLuz: hex("#ffc27a"), laranjaEsc: hex("#b85f18"), preto: hex("#1b1b1b"), amarelo: hex("#f2b01e"),
  placa: hex("#3a4047"), placaLuz: hex("#59616b"), placaSombra: hex("#2a2f35"),
};

// Painel da janela: moldura de metal de 3 px (luz em cima/esquerda, sombra embaixo/direita), rebites nos cantos.
salvar("diario_fundo", (x, y) => {
  const n = 16, d = Math.min(x, y, n - 1 - x, n - 1 - y);
  if (d === 0 || d === 3) return C.contorno;
  if (d <= 2) {
    if ((x === 2 || x === n - 3) && (y === 2 || y === n - 3)) return C.metalLuz; // rebite
    if (y === d || x === d) return mix(C.metal, C.metalLuz, 0.45);
    if (y === n - 1 - d || x === n - 1 - d) return C.metalSombra;
    return C.metal;
  }
  return mul(C.painel, 0.97 + ruido(x, y, 51) * 0.06);
}, 16, 16, 5);

// Barra de título: laranja do casco, com brilho em cima e linha escura embaixo.
salvar("diario_titulo", (x, y) => {
  const h = 16;
  if (y === h - 1) return hex("#5a2c0c");
  if (y === 0) return C.laranjaLuz;
  if (x === 0 || x === 15) return C.laranjaEsc;
  return mix(C.laranja, C.laranjaEsc, y / (h - 2));
}, 16, 16, 3);

// Faixa de alerta (repetida na largura): listras diagonais preto e amarelo.
salvar("diario_listra", (x, y) => (((x + y) >> 2) % 2 === 0 ? C.amarelo : C.preto), 16, 4);

// Visor do texto: tela escura afundada, com linhas de varredura bem leves.
salvar("diario_visor", (x, y) => {
  const n = 16, d = Math.min(x, y, n - 1 - x, n - 1 - y);
  if (d === 0) return y === n - 1 || x === n - 1 ? C.metalSombra : C.contorno;
  const base = y % 2 === 0 ? C.visor : mix(C.visor, C.ciano, 0.025);
  return d === 1 ? mul(base, 0.7) : base;
}, 16, 16, 3);

// Placas dos botões: normal, tocando (borda ciano) e apertado (mais escuro).
const placa = (borda, fundo, luz, sombra) => (x, y) => {
  const n = 16, d = Math.min(x, y, n - 1 - x, n - 1 - y);
  if (d === 0) return borda;
  if (y === 1 && x > 0 && x < n - 1) return luz;
  if (y === n - 2 && x > 0 && x < n - 1) return sombra;
  return mul(fundo, 0.97 + ruido(x, y, 61) * 0.06);
};
salvar("diario_botao", placa(C.contorno, C.placa, C.placaLuz, C.placaSombra), 16, 16, 3);
salvar("diario_botao_toque", placa(C.ciano, mix(C.placa, C.ciano, 0.12), mix(C.placaLuz, C.ciano, 0.3), C.placaSombra), 16, 16, 3);
salvar("diario_botao_apertado", placa(C.ciano, C.painelEsc, C.placaSombra, C.painelEsc), 16, 16, 3);

// Placa clara das telas com campos (busca, frequência...): os controles do jogo são feitos para fundo claro.
salvar("diario_claro", (x, y) => {
  const n = 16, d = Math.min(x, y, n - 1 - x, n - 1 - y);
  if (d === 0) return C.contorno;
  if (d === 1) return y === 1 || x === 1 ? C.metalLuz : C.metalSombra;
  return mul(hex("#c6cacd"), 0.98 + ruido(x, y, 71) * 0.04);
}, 16, 16, 3);

console.log("ui das telas: 8 texturas");

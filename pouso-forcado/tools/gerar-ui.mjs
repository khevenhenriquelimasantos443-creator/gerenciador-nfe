// Texturas da tela do Diário de Bordo (RP/textures/ui/cl/), usadas por RP/ui/server_form.json:
// painel de console da nave (grafite com moldura de metal rebitada), barra de título laranja do avião com
// faixa de alerta, visor escuro para o texto e placas de metal para os botões (borda ciano ao tocar).
// Cada textura esticável tem o seu .json de nineslice ao lado.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { hex, mix, mul, png, ruido } from "./pintura.mjs";
import { lerPng } from "./png.mjs";

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

// Tela do Diário no layout de painel (1.5.0): a arte desenhada (RP/textures/ui/cl/painel/, feita com o ChatGPT)
// tem o dobro de resolução; o .json diz o tamanho base (metade) e as bordas fixas do nineslice nesse tamanho,
// para ficar nítida no celular. Daqui saem também as barras de progresso cheias, as caixinhas do objetivo e o LED.
{
  const PAINEL = join(PASTA, "painel");
  const json = (nome, base, nineslice) => writeFileSync(join(PAINEL, `${nome}.json`), `${JSON.stringify({ nineslice_size: nineslice, base_size: base })}\n`);
  json("moldura", [64, 64], 6);
  json("barra_titulo", [96, 16], 4);
  json("botao_grafite", [64, 16], 2);
  json("botao_laranja", [64, 16], 4);
  json("botao_selecionado", [64, 16], [5, 2, 2, 2]);
  // Barra de progresso em 4 segmentos: progresso_0..10 (décimos), o vazio da arte com laranja por dentro.
  const vazia = lerPng(join(PAINEL, "barra_progresso_vazia.png"));
  const px = (x, y) => [...vazia.rgba.subarray((y * vazia.w + x) * 4, (y * vazia.w + x) * 4 + 4)];
  const escuro = (c) => c[0] + c[1] + c[2] < 3 * 0x38;
  for (let k = 0; k <= 10; k++) {
    const limite = Math.round(((vazia.w - 4) * k) / 10) + 2;
    writeFileSync(join(PAINEL, `progresso_${k}.png`), png((x, y) => {
      const c = px(x, y);
      // Só o miolo escuro dos segmentos enche; as divisórias e a moldura ficam.
      if (x < 2 || x >= limite || y < 2 || y >= vazia.h - 2 || !escuro(c)) return c;
      const t = (y - 2) / (vazia.h - 5);
      return y === 2 ? hex("#ffc45a") : mix(hex("#f7951f"), hex("#d9670c"), t);
    }, vazia.w, vazia.h));
  }
  // Caixinha do objetivo (vazia e marcada) e o LED do estado da nave (branco: a tela pinta da cor certa).
  const caixa = (marcada) => (x, y) => {
    const d = Math.min(x, y, 11 - x, 11 - y);
    if (d === 0) return hex("#c9d0d6");
    if (d === 1) return hex("#0f1418");
    if (!marcada) return hex("#1b2127");
    const check = [[3, 6], [4, 7], [5, 8], [6, 7], [7, 6], [8, 5], [8, 4], [9, 3]];
    return check.some(([cx, cy]) => (x === cx && (y === cy || y === cy - 1))) ? hex("#7dff6a") : hex("#1d3a1d");
  };
  writeFileSync(join(PAINEL, "caixa.png"), png(caixa(false), 12, 12));
  writeFileSync(join(PAINEL, "caixa_marcada.png"), png(caixa(true), 12, 12));
  writeFileSync(join(PAINEL, "led.png"), png((x, y) => {
    const d = Math.min(x, y, 5 - x, 7 - y);
    if (d === 0) return hex("#202020");
    return x === 1 && y <= 3 ? [255, 255, 255] : hex("#d8d8d8");
  }, 6, 8));
}

// Logo do menu e da tela de carregamento (no lugar do logo do Minecraft: RP_menu/textures/ui/title.png, do
// mesmo tamanho do original): "POUSO FORÇADO" em letras de bloco, branco-gelo do casco com a faixa laranja do avião, a lateral
// em grafite (o volume para baixo, como no logo original) e contorno preto.
{
  const LETRAS = {
    P: ["#####.", "##..##", "##..##", "#####.", "##....", "##....", "##...."],
    O: [".####.", "##..##", "##..##", "##..##", "##..##", "##..##", ".####."],
    U: ["##..##", "##..##", "##..##", "##..##", "##..##", "##..##", ".####."],
    S: [".#####", "##....", "##....", ".####.", "....##", "....##", "#####."],
    F: ["######", "##....", "##....", "#####.", "##....", "##....", "##...."],
    R: ["#####.", "##..##", "##..##", "#####.", "##.##.", "##..##", "##..##"],
    Ç: [".#####", "##....", "##....", "##....", "##....", "##....", ".#####", "..##..", ".##..."],
    A: [".####.", "##..##", "##..##", "######", "##..##", "##..##", "##..##"],
    D: ["#####.", "##..##", "##..##", "##..##", "##..##", "##..##", "#####."],
  };
  const W = 1937, H = 333, LINHAS = 9;
  const colunas = [];
  for (const c of "POUSO FORÇADO") {
    if (c === " ") colunas.push(...Array(3).fill(null));
    else {
      if (colunas.length && colunas[colunas.length - 1] !== null) colunas.push(null);
      for (let x = 0; x < 6; x++) colunas.push(LETRAS[c].map((l) => l[x] === "#"));
    }
  }
  const cheio = (cx, cy) => cx >= 0 && cy >= 0 && cx < colunas.length && cy < LINHAS && !!colunas[cx]?.[cy];
  const u = Math.floor(Math.min((W - 40) / colunas.length, (H - 30) / (LINHAS + 0.6)));
  const fundo = Math.round(u * 0.6), borda = Math.max(3, Math.round(u / 7));
  const ox = Math.floor((W - colunas.length * u) / 2), oy = Math.floor((H - (7 * u + fundo)) / 2) - u / 2;
  const frente = (x, y) => cheio(Math.floor((x - ox) / u), Math.floor((y - oy) / u));
  // Máscaras em pixels: frente das letras, a lateral (volume) e o contorno em volta das duas.
  const M = new Uint8Array(W * H); // 1 frente, 2 lateral, 3 contorno
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (frente(x, y)) M[y * W + x] = 1;
  for (let y = H - 1; y >= 0; y--)
    for (let x = 0; x < W; x++) {
      if (M[y * W + x]) continue;
      for (let k = 1; k <= fundo; k++) if (y - k >= 0 && M[(y - k) * W + x] === 1) { M[y * W + x] = 2; break; }
    }
  const ocupado = M.map((v) => (v ? 1 : 0));
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (ocupado[y * W + x]) continue;
      let perto = false;
      for (let dy = -borda; dy <= borda && !perto; dy++)
        for (let dx = -borda; dx <= borda && !perto; dx++) {
          const xx = x + dx, yy = y + dy;
          perto = xx >= 0 && yy >= 0 && xx < W && yy < H && ocupado[yy * W + xx] === 1;
        }
      if (perto) M[y * W + x] = 3;
    }
  const branco = hex("#eef1f4"), gelo = hex("#c9d1d8");
  mkdirSync(join(RAIZ, "RP_menu/textures/ui"), { recursive: true });
  writeFileSync(join(RAIZ, "RP_menu/textures/ui/title.png"), png((x, y) => {
    const m = M[y * W + x];
    if (!m) return null;
    if (m === 3) return C.contorno;
    const cx = Math.floor((x - ox) / u), cy = Math.floor((y - oy) / u), fx = (x - ox) - cx * u, fy = (y - oy) - cy * u;
    if (m === 2) {
      // Lateral: grafite, mais escura embaixo; cada bloco com a junta marcada.
      const k = (y - oy - (Math.floor((y - oy - 1) / u) + 1) * u) / fundo;
      return mul(mix(hex("#59616b"), hex("#2b3138"), Math.max(0, Math.min(1, k))), fx < 2 ? 0.8 : 1);
    }
    // Frente: textura de bloco (4x4 por bloco), faixa laranja na 5ª linha, luz em cima e sombra embaixo.
    const base = cy === 4 ? C.laranja : cy >= 7 ? gelo : branco;
    let c = mul(base, 0.95 + ruido(cx * 4 + Math.floor((fx * 4) / u), cy * 4 + Math.floor((fy * 4) / u), 81) * 0.08);
    const g = Math.max(2, Math.round(u / 12));
    if (fy < g && !cheio(cx, cy - 1)) c = mix(c, [255, 255, 255], cy === 4 ? 0.35 : 0.6);
    else if (fy >= u - g && !cheio(cx, cy + 1)) c = mul(c, 0.8);
    else if (fx >= u - g && !cheio(cx + 1, cy)) c = mul(c, 0.86);
    else if (fx < g && !cheio(cx - 1, cy)) c = mix(c, [255, 255, 255], 0.25);
    return c;
  }, W, H));
}

console.log("ui das telas: 8 texturas, o painel do Diário e o logo");

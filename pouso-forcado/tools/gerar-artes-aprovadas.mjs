// Artes aprovadas (visualizador_pouso_forcado_completo.html): os 9 flipbooks e as 33 texturas estáticas das máquinas,
// mais as texturas de UI dos controles do Diário (cl_painel, cl_diario e cl_diario_campos).
// Node puro, sem dependências: o desenho é feito num buffer RGBA e o PNG é codificado com node:zlib.
// As funções de desenho são as do HTML, sem "melhorias", para o resultado sair igual pixel a pixel.
//
// Roda no fim do `npm run build`, DEPOIS do gerar-visual.mjs e do gerar-ui.mjs, que desenham os mesmos arquivos
// (por isso este passo tem de vir por último). Uso avulso: node tools/gerar-artes-aprovadas.mjs
// Não mexe em progress_screen.json nem em fundo_carregamento.png (a tela de carregamento já está aprovada).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

// ============================================================================
// PNG sem dependências
// ============================================================================
const TABELA_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = TABELA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function bloco(tipo, dados) {
  const t = Buffer.from(tipo, "ascii");
  const n = Buffer.alloc(4);
  n.writeUInt32BE(dados.length);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc32(Buffer.concat([t, dados])));
  return Buffer.concat([n, t, dados, c]);
}
function codificarPng(img) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.w, 0);
  ihdr.writeUInt32BE(img.h, 4);
  ihdr[8] = 8; // 8 bits por canal
  ihdr[9] = 6; // RGBA
  const linhas = Buffer.alloc((img.w * 4 + 1) * img.h);
  for (let y = 0; y < img.h; y++) {
    linhas[y * (img.w * 4 + 1)] = 0; // filtro "nenhum"
    Buffer.from(img.data.buffer, img.data.byteOffset + y * img.w * 4, img.w * 4).copy(linhas, y * (img.w * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    bloco("IHDR", ihdr),
    bloco("IDAT", deflateSync(linhas, { level: 9 })),
    bloco("IEND", Buffer.alloc(0)),
  ]);
}

// ============================================================================
// Desenho (mesma ideia do canvas do HTML: rect/px sobre um buffer RGBA)
// ============================================================================
const novaImagem = (w, h) => ({ w, h, data: new Uint8ClampedArray(w * h * 4) });
const corDe = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
/** Contexto de desenho com deslocamento (o equivalente do ctx.translate(0, f * 16) dos flipbooks). */
const contexto = (img, ox = 0, oy = 0) => ({ img, ox, oy });
function rect(ctx, x, y, w, h, c) {
  const [r, g, b] = corDe(c);
  const { img } = ctx;
  for (let j = Math.max(0, y + ctx.oy); j < Math.min(img.h, y + ctx.oy + h); j++)
    for (let i = Math.max(0, x + ctx.ox); i < Math.min(img.w, x + ctx.ox + w); i++) {
      const o = (j * img.w + i) * 4;
      img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b; img.data[o + 3] = 255;
    }
}
function px(ctx, x, y, c) {
  if (!c) return;
  rect(ctx, x, y, 1, 1, c);
}

// Ajuste da revisão: faixa que dá a volta na textura (x módulo 16). Os flipbooks de 8 quadros andam 2 px por quadro (8 x 2 = 16),
// então com a volta em 16 o último quadro encaixa no primeiro, sem o "pulo" de antes (a volta era em 12, 13 ou 14).
const rectV = (ctx, x, y, w, h, c) => { for (let i = 0; i < w; i++) rect(ctx, (x + i) % 16, y, 1, h, c); };
const clarear = (c, k) => "#" + corDe(c).map((v) => Math.round(v + (255 - v) * k).toString(16).padStart(2, "0")).join("");

const SAIDAS = []; // { caminho, img }
function salvar(caminho, img) {
  const arq = join(RAIZ, caminho);
  mkdirSync(dirname(arq), { recursive: true });
  writeFileSync(arq, codificarPng(img));
  SAIDAS.push({ caminho, w: img.w, h: img.h });
}

// ============================================================================
// 1. Os 9 flipbooks (16 x 16 por quadro, tira vertical)
// ============================================================================
const V = "RP/textures/blocks/cl/v/";
const FLIPBOOKS = []; // { nome, quadros, ticks }
function flipbook(nome, quadros, ticks, desenharQuadro) {
  const tira = novaImagem(16, 16 * quadros);
  for (let f = 0; f < quadros; f++) desenharQuadro(contexto(tira, 0, f * 16), f);
  salvar(`${V}${nome}.png`, tira);
  FLIPBOOKS.push({ nome, quadros, ticks });
}

flipbook("tela_nave", 8, 3, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#091e3a");
  rect(ctx, 2, 8, 12, 1, "#0369a1"); rect(ctx, 8, 2, 1, 12, "#0369a1");
  const pts = [[8, 3], [11, 4], [13, 8], [11, 12], [8, 13], [4, 12], [3, 8], [4, 4]];
  const [rx, ry] = pts[f];
  rect(ctx, rx, ry, 2, 2, "#38bdf8");
  px(ctx, 11, 5, f % 2 === 0 ? "#ef4444" : "#facc15");
});

flipbook("tela_terminal", 8, 6, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#2e1065");
  for (let r = 0; r < 4; r++) {
    const y = ((r * 3 + Math.floor(f * 1.5)) % 12) + 1; // ajuste da revisão: 8 quadros somam 12 px e fecham o ciclo
    rect(ctx, 2, y, 2, 2, "#38bdf8");
    rect(ctx, 5, y, 8, 1, "#c084fc");
  }
});

flipbook("solar", 8, 5, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#1e293b");
  // Ajuste da revisão: o brilho só aparecia em quadros pares (x + y + f * 2 nunca batia nos ímpares), então piscava. Agora uma faixa de 2 diagonais de células avança uma diagonal por quadro.
  for (let y = 1; y < 15; y += 4) for (let x = 1; x < 15; x += 4) rect(ctx, x, y, 3, 3, ((((x + y - 2) / 4 - f) % 8) + 8) % 8 < 2 ? "#38bdf8" : "#1d4ed8");
});

flipbook("rotor", 8, 2, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#27272a");
  rect(ctx, 6, 6, 4, 4, "#71717a");
  // Ajuste da revisão: com 4 pás a 90°, girar 45° por quadro só alternava "+" e "×". Agora os 8 quadros cobrem 90° (11,25° cada) e o ciclo fecha sem salto.
  const ang = (f / 8) * (Math.PI / 2);
  for (let d = 0; d < 4; d++) {
    const a = ang + d * (Math.PI / 2);
    // Ajuste da revisão: pixel que contém o ponto (floor, centro em 8,8 como o miolo) e passo de 0,5: a pá não fica com buracos.
    for (let r = 2; r <= 6.5; r += 0.5) px(ctx, Math.floor(8 + Math.cos(a) * r), Math.floor(8 + Math.sin(a) * r), "#e4e4e7");
  }
});

flipbook("brasa_on", 6, 3, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#18181b");
  for (let y = 2; y < 14; y += 3) {
    rect(ctx, 2, y, 12, 2, (f + y) % 2 === 0 ? "#f97316" : "#dc2626");
    px(ctx, 4 + ((f * 4 + y) % 8), y, "#fef08a"); // ajuste da revisão: 6 quadros x 4 = 24 fecha o ciclo em 8
  }
});

flipbook("forja", 6, 3, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#7c2d12");
  for (let y = 1; y < 15; y += 2) {
    rect(ctx, 1, y, 14, 2, (y + f) % 3 === 0 ? "#ea580c" : "#fb923c");
    px(ctx, ((f * 2 + y * 5) % 12) + 1, y, "#fef08a"); // ajuste da revisão: 6 quadros x 2 = 12 fecha o ciclo
  }
});

flipbook("agua", 8, 4, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#0284c7");
  for (let y = 0; y < 16; y += 4) rectV(ctx, (y * 3 + f * 2) % 16, y, 4, 1, "#7dd3fc");
});

flipbook("lava", 8, 4, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#ea580c");
  for (let y = 0; y < 16; y += 3) {
    const x = (y * 3 + f * 2) % 16;
    rectV(ctx, x, y, 5, 2, "#c2410c");
    rectV(ctx, x + 6, y, 3, 1, "#facc15");
  }
});

flipbook("petroleo", 8, 5, (ctx, f) => {
  rect(ctx, 0, 0, 16, 16, "#0a0a0c");
  for (let y = 0; y < 16; y += 4) rectV(ctx, (y * 3 + f * 2) % 16, y, 4, 1, "#27272a");
});

// ============================================================================
// 2. As 33 texturas estáticas (listaTexturas do HTML)
// ============================================================================
const escurecer = (c, k) => "#" + corDe(c).map((v) => Math.round(v * k).toString(16).padStart(2, "0")).join("");
const desenharChassi = (ctx, cor, borda, hi, lo) => {
  rect(ctx, 0, 0, 16, 16, cor);
  rect(ctx, 0, 0, 16, 1, hi); rect(ctx, 0, 0, 1, 16, hi);
  rect(ctx, 0, 15, 16, 1, lo); rect(ctx, 15, 0, 1, 16, lo);
  // Ajuste da revisão: sombra interna de 1 px embaixo e à direita (profundidade nas máquinas; os rebites ficam de fora dela).
  rect(ctx, 1, 14, 14, 1, escurecer(cor, 0.85)); rect(ctx, 14, 1, 1, 13, escurecer(cor, 0.85));
  px(ctx, 2, 2, "#d4d4d8"); px(ctx, 13, 2, "#d4d4d8");
  px(ctx, 2, 13, "#d4d4d8"); px(ctx, 13, 13, "#d4d4d8");
};
const luz = (fundo, meio, centro) => (ctx) => {
  rect(ctx, 0, 0, 16, 16, fundo);
  rect(ctx, 3, 3, 10, 10, meio);
  rect(ctx, 6, 6, 4, 4, centro);
};
// Ajuste da revisão: faixa colorida com moldura escura de 1 px e filete claro em cima (antes ficava chapada contra o chassi claro).
const faixa = (ctx, x, y, w, h, cor) => {
  rect(ctx, x - 1, y - 1, w + 2, h + 2, "#1e293b");
  rect(ctx, x, y, w, h, cor);
  rect(ctx, x, y, w, 1, clarear(cor, 0.35));
};
const CINZA = ["#3f3f46", "#18181b", "#71717a", "#27272a"];
const METAL = ["#94a3b8", "#334155", "#cbd5e1", "#475569"];

const LISTA_TEXTURAS = [
  ["corpo", `${V}corpo`, (ctx) => desenharChassi(ctx, "#cbd5e1", "#334155", "#f8fafc", "#64748b")],
  ["corpo_friso", `${V}corpo_friso`, (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#94a3b8");
    for (let y = 0; y < 16; y += 4) {
      rect(ctx, 0, y, 16, 1, "#f1f5f9");
      rect(ctx, 0, y + 3, 16, 1, "#475569");
    }
  }],
  ["grafite", `${V}grafite`, (ctx) => desenharChassi(ctx, "#27272a", "#09090b", "#3f3f46", "#18181b")],
  ["luz_ciano", `${V}luz_ciano`, luz("#06b6d4", "#67e8f9", "#cffafe")],
  ["luz_laranja", `${V}luz_laranja`, luz("#ea580c", "#fb923c", "#fef08a")],
  ["luz_azul", `${V}luz_azul`, luz("#1d4ed8", "#38bdf8", "#e0f2fe")],
  ["luz_verde", `${V}luz_verde`, luz("#15803d", "#4ade80", "#bbf7d0")],
  ["luz_violeta", `${V}luz_violeta`, luz("#7e22ce", "#c084fc", "#f3e8ff")],
  ["cabo", "RP/textures/blocks/cl/cabo", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#27272a");
    rect(ctx, 5, 0, 6, 16, "#b45309");
    rect(ctx, 7, 0, 2, 16, "#fb923c");
    rect(ctx, 0, 5, 16, 6, "#b45309");
    rect(ctx, 0, 7, 16, 2, "#fb923c");
    rect(ctx, 5, 5, 6, 6, "#06b6d4"); // núcleo ciano
  }],
  ["condensador_lado", "RP/textures/blocks/cl/condensador_lado", (ctx) => {
    desenharChassi(ctx, "#cbd5e1", "#334155", "#f8fafc", "#64748b");
    rect(ctx, 3, 4, 10, 8, "#0284c7");
    for (let y = 5; y < 11; y += 2) rect(ctx, 4, y, 8, 1, "#38bdf8");
  }],
  ["condensador_topo", "RP/textures/blocks/cl/condensador_topo", (ctx) => {
    desenharChassi(ctx, "#94a3b8", "#334155", "#cbd5e1", "#475569");
    rect(ctx, 4, 4, 8, 8, "#1e293b");
  }],
  ["condensador_topo_cheio", "RP/textures/blocks/cl/condensador_topo_cheio", (ctx) => {
    desenharChassi(ctx, "#94a3b8", "#334155", "#cbd5e1", "#475569");
    rect(ctx, 4, 4, 8, 8, "#38bdf8");
  }],
  ["condensador_avancado_lado", "RP/textures/blocks/cl/condensador_avancado_lado", (ctx) => {
    desenharChassi(ctx, "#b45309", "#451a03", "#f59e0b", "#78350f");
    rect(ctx, 3, 4, 10, 8, "#0284c7");
    rect(ctx, 0, 7, 16, 2, "#38bdf8"); // anel ciano
  }],
  ["peneira_lado", "RP/textures/blocks/cl/peneira_lado", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#9a6432");
    rect(ctx, 0, 0, 16, 2, "#b87d46"); rect(ctx, 0, 14, 16, 2, "#5c3a18");
    rect(ctx, 2, 2, 2, 12, "#78350f"); rect(ctx, 12, 2, 2, 12, "#78350f");
  }],
  ["peneira_topo", "RP/textures/blocks/cl/peneira_topo", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#9a6432");
    for (let y = 2; y < 14; y++) for (let x = 2; x < 14; x++) if ((x + y) % 2 === 0) px(ctx, x, y, "#e4e4e7");
  }],
  ["peneira_auto_lado", "RP/textures/blocks/cl/peneira_auto_lado", (ctx) => {
    desenharChassi(ctx, "#3f3f46", "#18181b", "#71717a", "#27272a");
    rect(ctx, 4, 4, 8, 8, "#b45309");
    rect(ctx, 0, 8, 16, 2, "#38bdf8");
  }],
  ["compostor_lado", "RP/textures/blocks/cl/compostor_lado", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#78350f");
    for (let y = 0; y < 16; y += 4) {
      rect(ctx, 0, y, 16, 1, "#a16207");
      rect(ctx, 0, y + 3, 16, 1, "#451a03");
    }
  }],
  ["compostor_topo_cheio", "RP/textures/blocks/cl/compostor_topo_cheio", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#78350f");
    rect(ctx, 2, 2, 12, 12, "#15803d");
  }],
  ["compostor_topo_pronto", "RP/textures/blocks/cl/compostor_topo_pronto", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#78350f");
    rect(ctx, 2, 2, 12, 12, "#5c3418");
  }],
  ["gerador_lado", "RP/textures/blocks/cl/gerador_lado", (ctx) => {
    desenharChassi(ctx, ...CINZA);
    rect(ctx, 3, 4, 10, 8, "#18181b");
    for (const y of [6, 8, 10]) rect(ctx, 4, y, 8, 1, "#27272a"); // ajuste da revisão: frestas (não é mais uma caixa preta lisa)
  }],
  ["gerador_lado_aceso", "RP/textures/blocks/cl/gerador_lado_aceso", (ctx) => {
    desenharChassi(ctx, ...CINZA);
    rect(ctx, 3, 4, 10, 8, "#ea580c");
    rect(ctx, 5, 6, 6, 4, "#fef08a");
  }],
  ["bateria_lado", "RP/textures/blocks/cl/bateria_lado", (ctx) => {
    desenharChassi(ctx, ...CINZA);
    rect(ctx, 6, 2, 4, 12, "#18181b");
    // Ajuste da revisão: a barra contínua virou 3 LEDs (medidor segmentado).
    for (const y of [4, 7, 10]) rect(ctx, 7, y, 2, 2, "#22c55e");
  }],
  ["moinho_lado", "RP/textures/blocks/cl/moinho_lado", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#9a6432");
    rect(ctx, 4, 4, 8, 8, "#3f3f46");
  }],
  ["idolo_lado", "RP/textures/blocks/cl/idolo_lado", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#c4b48c");
    rect(ctx, 2, 2, 12, 12, "#eab308");
    rect(ctx, 4, 4, 8, 8, "#78350f");
    px(ctx, 6, 6, "#ef4444"); px(ctx, 9, 6, "#ef4444"); // olhos vermelhos
  }],
  ["idolo_topo", "RP/textures/blocks/cl/idolo_topo", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#c4b48c");
    rect(ctx, 4, 4, 8, 8, "#f59e0b");
  }],
  ["painel_nave_lado", "RP/textures/blocks/cl/painel_nave_lado", (ctx) => {
    desenharChassi(ctx, ...METAL);
    faixa(ctx, 3, 6, 10, 4, "#38bdf8");
  }],
  ["terminal_lado", "RP/textures/blocks/cl/terminal_lado", (ctx) => {
    desenharChassi(ctx, ...METAL);
    faixa(ctx, 3, 6, 10, 4, "#c084fc");
  }],
  ["montadora_lado", "RP/textures/blocks/cl/montadora_lado", (ctx) => {
    desenharChassi(ctx, ...METAL);
    // Ajuste da revisão: duas faixas (o painel da nave e o terminal têm uma só), para não se confundirem de longe.
    faixa(ctx, 3, 4, 10, 3, "#f97316");
    faixa(ctx, 3, 9, 10, 3, "#f97316");
  }],
  ["gerador_monstros", "RP/textures/blocks/cl/gerador_monstros", (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#18181b");
    rect(ctx, 1, 1, 14, 14, "#3f3f46");
    for (let y = 3; y < 13; y += 3) rect(ctx, 3, y, 10, 1, "#18181b");
    rect(ctx, 6, 6, 4, 4, "#dc2626"); // chama interna
  }],
  ["barril_madeira", `${V}barril_madeira`, (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#78350f");
    for (const x of [3, 7, 11]) { rect(ctx, x, 0, 1, 2, "#5c280b"); rect(ctx, x, 4, 1, 8, "#5c280b"); rect(ctx, x, 14, 1, 2, "#5c280b"); } // ajuste da revisão: aduelas
    rect(ctx, 0, 2, 16, 2, "#3f3f46"); rect(ctx, 0, 12, 16, 2, "#3f3f46");
  }],
  ["barril_pedra", `${V}barril_pedra`, (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#64748b");
    rect(ctx, 0, 2, 16, 2, "#1e293b"); rect(ctx, 0, 12, 16, 2, "#1e293b");
  }],
  ["porcelana", `${V}porcelana`, (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#f8fafc");
    rect(ctx, 1, 1, 14, 14, "#e2e8f0");
  }],
  ["folha_infestada", `${V}folha_infestada`, (ctx) => {
    rect(ctx, 0, 0, 16, 16, "#d6d3d1");
    // Ajuste da revisão: manchas agrupadas (o pontilhado regular virava ruído cinza no celular).
    for (const [x, y, w, h] of [[1, 1, 2, 2], [9, 0, 3, 2], [5, 5, 2, 3], [12, 6, 2, 2], [2, 10, 3, 2], [8, 11, 2, 3], [13, 12, 2, 2]]) rect(ctx, x, y, w, h, "#a8a29e");
    for (const [x, y, w, h] of [[4, 2, 2, 2], [10, 4, 3, 1], [0, 7, 3, 2], [7, 8, 2, 2], [11, 9, 2, 2], [5, 13, 3, 2]]) rect(ctx, x, y, w, h, "#e7e5e4");
    for (const [x, y] of [[2, 2], [10, 1], [6, 6], [13, 7], [3, 11], [9, 12], [14, 13]]) px(ctx, x, y, "#78716c");
  }],
];

for (const [, caminho, desenhar] of LISTA_TEXTURAS) {
  const img = novaImagem(16, 16);
  desenhar(contexto(img));
  salvar(`${caminho}.png`, img);
}

// ============================================================================
// 3. Texturas de UI (cores do desenharCaixaMetal e dos demais trechos do HTML)
// ============================================================================
// desenharCaixaMetal do HTML, com a espessura k: k = 2 é o desenho do mockup (que está em 2x); k = 1 serve às
// texturas de 16 px, que ficam com a metade do tamanho (anel de 1 px, relevo de 1 px, miolo a partir de 2 px).
function caixaMetal(ctx, x, y, w, h, bg, hi, lo, borda = "#080a0e", k = 2) {
  rect(ctx, x, y, w, h, borda);
  rect(ctx, x + k, y + k, w - 2 * k, k, hi); rect(ctx, x + k, y + k, k, h - 2 * k, hi);
  rect(ctx, x + k, y + h - 2 * k, w - 2 * k, k, lo); rect(ctx, x + w - 2 * k, y + k, k, h - 2 * k, lo);
  rect(ctx, x + 2 * k, y + 2 * k, w - 4 * k, h - 4 * k, bg);
}
const ui = (caminho, w, h, desenhar) => {
  const img = novaImagem(w, h);
  desenhar(contexto(img), w, h);
  salvar(`RP/textures/ui/cl/${caminho}.png`, img);
};

// ----- cl_painel (arte em 2x: o .json diz o tamanho base, metade, e as bordas do nineslice) -----
ui("painel/moldura", 128, 128, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#141820", "#2a3342", "#0c0f14", "#05070a"));
ui("painel/barra_titulo", 192, 32, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#94a3b8", "#e2e8f0", "#475569", "#0d1117"));
ui("painel/botao_laranja", 128, 32, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#d97706", "#fbbf24", "#92400e"));
ui("painel/botao_grafite", 128, 32, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#1e2531", "#323c4d", "#11161d"));
ui("painel/botao_selecionado", 128, 32, (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, "#261e12", "#f59e0b", "#11161d");
  rect(c, 2, 2, 6, h - 4, "#f59e0b"); // faixa laranja do capítulo aberto
});
ui("painel/botao_fechar", 32, 32, (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, "#991b1b", "#ef4444", "#5c0f0f");
  for (let i = 0; i < 12; i++) { // ajuste da revisão: X centrado (x de 9 a 22, y de 10 a 21 em 32 x 32)
    for (let t = 0; t < 3; t++) {
      px(c, 9 + i + t, 10 + i, "#ffffff");
      px(c, 20 - i + t, 10 + i, "#ffffff");
    }
  }
});
ui("painel/icone_diario", 64, 64, (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, "#1e293b", "#475569", "#0f172a", "#080a0e", 3);
  rect(c, 13, 10, 38, 45, "#f59e0b"); // o livro
  rect(c, 19, 16, 26, 6, "#fef08a");
});
// Ajuste da revisão: 300 x 18, o dobro dos 150 x 9 em que a tela desenha a barra (antes 128 x 12 era esticada para 150 x 9, e a borda de 1 px sumia).
const barra = (k) => (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, "#0f141c", "#222c3c", "#111722", "#080a0e", 2);
  const util = w - 8;
  const cheio = Math.round((util * k) / 10);
  if (cheio > 0) {
    rect(c, 4, 4, cheio, h - 8, "#f59e0b");
    rect(c, 4 + Math.max(0, cheio - 4), 4, Math.min(4, cheio), h - 8, "#fef08a"); // marcador na ponta
  }
};
ui("painel/barra_progresso_vazia", 300, 18, barra(0));
for (let k = 0; k <= 10; k++) ui(`painel/progresso_${k}`, 300, 18, barra(k));
const caixinha = (marcada) => (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, marcada ? "#22c55e" : "#0f141c", "#222c3c", "#111722", "#080a0e", 1);
  if (marcada) for (const [x, y] of [[3, 6], [4, 7], [5, 8], [6, 7], [7, 6], [8, 5], [8, 4], [9, 3]]) rect(c, x, y - 1, 1, 2, "#0f172a");
};
ui("painel/caixa", 12, 12, caixinha(false));
ui("painel/caixa_marcada", 12, 12, caixinha(true));

// ----- cl_diario e cl_diario_campos (16 x 16, nineslice) -----
ui("diario_fundo", 16, 16, (c, w, h) => {
  caixaMetal(c, 0, 0, w, h, "#241a12", "#453322", "#140e09", "#080503", 1);
  for (const [x, y] of [[0, 0], [11, 0], [0, 11], [11, 11]]) { // cantoneiras de latão
    rect(c, x, y, 5, 5, "#b45309");
    rect(c, x + 1, y + 1, 2, 2, "#fef08a");
  }
});
ui("diario_titulo", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#78350f", "#d97706", "#451a03", "#080a0e", 1));
ui("diario_listra", 16, 4, (c, w, h) => rect(c, 0, 0, w, h, "#f59e0b"));
ui("diario_visor", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#14100c", "#2c221a", "#0a0806", "#080a0e", 1));
ui("diario_botao", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#2f241a", "#4d3b2b", "#1c150f", "#080a0e", 1));
// O mockup não mostra o botão tocado nem apertado: derivados da mesma paleta (borda laranja ao tocar, relevo invertido ao apertar).
ui("diario_botao_toque", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#3b2d20", "#6b5139", "#1c150f", "#f59e0b", 1));
ui("diario_botao_apertado", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#241b12", "#1c150f", "#4d3b2b", "#f59e0b", 1));
ui("diario_claro", 16, 16, (c, w, h) => caixaMetal(c, 0, 0, w, h, "#ded2b2", "#f3ebd4", "#a89874", "#080a0e", 1));

// ============================================================================
// 4. flipbook_textures.json e terrain_texture.json: só se faltar entrada ou os ticks forem outros
// ============================================================================
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8"));
const gravarJson = (rel, obj, original) => {
  const indent = original.startsWith("[\n  ") || original.startsWith("{\n  ") ? 2 : 1;
  writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, indent) + (original.endsWith("\n") ? "\n" : ""));
};
{
  const rel = "RP/textures/flipbook_textures.json";
  const original = readFileSync(join(RAIZ, rel), "utf8");
  const lista = JSON.parse(original);
  const mudancas = [];
  for (const { nome, ticks } of FLIPBOOKS) {
    const caminho = `textures/blocks/cl/v/${nome}`;
    const e = lista.find((x) => x.flipbook_texture === caminho);
    if (!e) {
      lista.push({ flipbook_texture: caminho, atlas_tile: `clv_${nome}`, ticks_per_frame: ticks });
      mudancas.push(`+ ${nome}: ticks_per_frame ${ticks}`);
    } else if (e.ticks_per_frame !== ticks) {
      mudancas.push(`~ ${nome}: ticks_per_frame ${e.ticks_per_frame} -> ${ticks}`);
      e.ticks_per_frame = ticks;
    }
  }
  if (mudancas.length) gravarJson(rel, lista, original);
  console.log(mudancas.length ? `flipbook_textures.json:\n  ${mudancas.join("\n  ")}` : "flipbook_textures.json: sem mudanças (os 9 ticks já são os aprovados)");
}
{
  const rel = "RP/textures/terrain_texture.json";
  const original = readFileSync(join(RAIZ, rel), "utf8");
  const json = JSON.parse(original);
  const usados = new Set();
  for (const v of Object.values(json.texture_data)) for (const t of Array.isArray(v.textures) ? v.textures : [v.textures]) usados.add(typeof t === "string" ? t : t?.path);
  const mudancas = [];
  for (const [nome, caminho] of LISTA_TEXTURAS.map(([n, c]) => [n, c.replace(/^RP\//, "")])) {
    if (usados.has(caminho)) continue;
    const chave = `clv_aprovada_${nome}`;
    json.texture_data[chave] = { textures: caminho };
    mudancas.push(`+ ${chave}: ${caminho}`);
  }
  if (mudancas.length) gravarJson(rel, json, original);
  console.log(mudancas.length ? `terrain_texture.json:\n  ${mudancas.join("\n  ")}` : "terrain_texture.json: sem mudanças (as 33 texturas já têm entrada)");
}

// ============================================================================
// 5. Conferência e lista final
// ============================================================================
for (const { nome, quadros } of FLIPBOOKS) {
  const s = SAIDAS.find((x) => x.caminho === `${V}${nome}.png`);
  if (s.w !== 16 || s.h !== 16 * quadros) throw new Error(`flipbook ${nome}: ${s.w}x${s.h}, esperado 16x${16 * quadros}`);
}
for (const [, caminho] of LISTA_TEXTURAS) if (!existsSync(join(RAIZ, `${caminho}.png`))) throw new Error(`faltou ${caminho}.png`);
console.log(`artes aprovadas: ${FLIPBOOKS.length} flipbooks, ${LISTA_TEXTURAS.length} texturas e ${SAIDAS.length - FLIPBOOKS.length - LISTA_TEXTURAS.length} de UI`);
if (process.argv.includes("--lista")) for (const s of SAIDAS) console.log(`  ${s.caminho.padEnd(62)} ${s.w}x${s.h}`);

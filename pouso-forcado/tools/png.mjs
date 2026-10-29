// Encoder PNG mínimo (RGBA 8 bits), só com zlib do Node.
import { deflateSync } from "node:zlib";
import { crc32 } from "./crc32.mjs";

function chunk(tipo, dados) {
  const tam = Buffer.alloc(4);
  tam.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, "ascii"), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tam, corpo, crc]);
}

// Filtro "Paeth" da linha (o melhor para imagens grandes, como o panorama).
function paeth(cru, largura, y) {
  const L = largura * 4, saida = Buffer.alloc(L + 1);
  saida[0] = 4;
  for (let i = 0; i < L; i++) {
    const a = i >= 4 ? cru[y * L + i - 4] : 0, b = y ? cru[(y - 1) * L + i] : 0, c = y && i >= 4 ? cru[(y - 1) * L + i - 4] : 0;
    const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    saida[i + 1] = (cru[y * L + i] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
  }
  return saida;
}

/** pixel(x, y) deve retornar [r, g, b, a]. filtrar = true deixa imagens grandes bem menores. */
export function gerarPng(largura, altura, pixel, filtrar = false) {
  let linhas = Buffer.alloc((largura * 4 + 1) * altura);
  let o = 0;
  for (let y = 0; y < altura; y++) {
    linhas[o++] = 0; // filtro "none"
    for (let x = 0; x < largura; x++) {
      const [r, g, b, a] = pixel(x, y);
      linhas[o++] = r; linhas[o++] = g; linhas[o++] = b; linhas[o++] = a;
    }
  }
  if (filtrar) {
    const cru = Buffer.alloc(largura * 4 * altura);
    for (let y = 0; y < altura; y++) linhas.copy(cru, y * largura * 4, y * (largura * 4 + 1) + 1, (y + 1) * (largura * 4 + 1));
    linhas = Buffer.concat(Array.from({ length: altura }, (_, y) => paeth(cru, largura, y)));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(linhas)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

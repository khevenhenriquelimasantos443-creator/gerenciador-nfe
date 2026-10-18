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

/** pixel(x, y) deve retornar [r, g, b, a]. */
export function gerarPng(largura, altura, pixel) {
  const linhas = Buffer.alloc((largura * 4 + 1) * altura);
  let o = 0;
  for (let y = 0; y < altura; y++) {
    linhas[o++] = 0; // filtro "none"
    for (let x = 0; x < largura; x++) {
      const [r, g, b, a] = pixel(x, y);
      linhas[o++] = r; linhas[o++] = g; linhas[o++] = b; linhas[o++] = a;
    }
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

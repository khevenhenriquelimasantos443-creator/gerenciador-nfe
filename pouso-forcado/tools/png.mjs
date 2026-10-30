// Encoder e leitor PNG mínimos (RGBA 8 bits), só com zlib do Node.
import { readFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";
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

/** Lê um PNG (qualquer tipo de cor, sem entrelaçamento): { w, h, rgba }. */
export function lerPng(arq) {
  const d = readFileSync(arq);
  let o = 8, w = 0, h = 0, bits = 8, tipo = 6, pal = null, trns = null;
  const idat = [];
  while (o < d.length) {
    const n = d.readUInt32BE(o), t = d.toString("latin1", o + 4, o + 8), c = d.subarray(o + 8, o + 8 + n);
    if (t === "IHDR") {
      [w, h, bits, tipo] = [c.readUInt32BE(0), c.readUInt32BE(4), c[8], c[9]];
      if (c[12]) throw new Error(`${arq}: PNG entrelaçado`);
    } else if (t === "PLTE") pal = c;
    else if (t === "tRNS") trns = c;
    else if (t === "IDAT") idat.push(c);
    o += 12 + n;
  }
  const canais = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[tipo];
  const bpp = Math.max(1, (canais * bits) >> 3), L = Math.ceil((w * canais * bits) / 8);
  const cru = inflateSync(Buffer.concat(idat)), px = Buffer.alloc(L * h);
  for (let y = 0; y < h; y++) {
    const f = cru[y * (L + 1)], de = y * (L + 1) + 1, para = y * L;
    for (let i = 0; i < L; i++) {
      const a = i >= bpp ? px[para + i - bpp] : 0, b = y ? px[para - L + i] : 0, c = y && i >= bpp ? px[para - L + i - bpp] : 0;
      let v = cru[de + i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[para + i] = v & 255;
    }
  }
  const amostra = (y, i) => {
    if (bits >= 8) return px[y * L + i * (bits >> 3)];
    const porByte = 8 / bits, byte = px[y * L + Math.floor(i / porByte)];
    return (byte >> (8 - bits * ((i % porByte) + 1))) & ((1 << bits) - 1);
  };
  const rgba = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let r, g, b, a = 255;
      if (tipo === 3) {
        const k = amostra(y, x);
        [r, g, b] = [pal[k * 3], pal[k * 3 + 1], pal[k * 3 + 2]];
        if (trns && k < trns.length) a = trns[k];
      } else if (tipo === 0 || tipo === 4) {
        r = g = b = Math.round(amostra(y, x * canais) * (bits < 8 ? 255 / ((1 << bits) - 1) : 1));
        if (tipo === 4) a = amostra(y, x * 2 + 1);
      } else {
        [r, g, b] = [amostra(y, x * canais), amostra(y, x * canais + 1), amostra(y, x * canais + 2)];
        if (tipo === 6) a = amostra(y, x * 4 + 3);
      }
      rgba.set([r, g, b, a], (y * w + x) * 4);
    }
  return { w, h, rgba };
}

// Escritor ZIP mínimo (deflate), suficiente para .mcpack/.mcaddon.
import { deflateRawSync } from "node:zlib";
import { crc32 } from "./crc32.mjs";

/** arquivos: [{ nome: "pasta/arquivo.json", dados: Buffer }] */
export function gerarZip(arquivos) {
  const locais = [];
  const centrais = [];
  let offset = 0;

  for (const { nome, dados } of arquivos) {
    const nomeBuf = Buffer.from(nome, "utf8");
    const comprimido = deflateRawSync(dados);
    const crc = crc32(dados);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);      // versão necessária
    local.writeUInt16LE(0x0800, 6);  // flag: nomes em UTF-8
    local.writeUInt16LE(8, 8);       // método: deflate
    local.writeUInt32LE(0, 10);      // hora/data (zerado)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(dados.length, 22);
    local.writeUInt16LE(nomeBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locais.push(local, nomeBuf, comprimido);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(0, 12);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(comprimido.length, 20);
    central.writeUInt32LE(dados.length, 24);
    central.writeUInt16LE(nomeBuf.length, 28);
    central.writeUInt32LE(offset, 42);
    centrais.push(central, nomeBuf);

    offset += local.length + nomeBuf.length + comprimido.length;
  }

  const tamCentral = centrais.reduce((s, b) => s + b.length, 0);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(arquivos.length, 8);
  fim.writeUInt16LE(arquivos.length, 10);
  fim.writeUInt32LE(tamCentral, 12);
  fim.writeUInt32LE(offset, 16);

  return Buffer.concat([...locais, ...centrais, fim]);
}

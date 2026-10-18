// Pasta db/ de um LevelDB vazio (o formato de banco de dados dos mundos do Bedrock).
// Só tem o MANIFEST com a versão inicial; o jogo cria o resto ao abrir o mundo.

// CRC-32C (Castagnoli), usado pelo log do LevelDB.
const TABELA = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0x82f63b78 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32c(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = TABELA[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
const mascarar = (crc) => ((((crc >>> 15) | (crc << 17)) >>> 0) + 0xa282ead8) >>> 0;

function varint(n) {
  const bytes = [];
  while (n >= 0x80) { bytes.push((n & 0x7f) | 0x80); n = Math.floor(n / 128); }
  bytes.push(n);
  return Buffer.from(bytes);
}

/** Registro único (tipo FULL) no formato de log do LevelDB. */
function registro(dados) {
  const cab = Buffer.alloc(7);
  const tipo = Buffer.from([1]);
  cab.writeUInt32LE(mascarar(crc32c(Buffer.concat([tipo, dados]))), 0);
  cab.writeUInt16LE(dados.length, 4);
  cab[6] = 1;
  return Buffer.concat([cab, dados]);
}

export function dbVazio() {
  const comparador = Buffer.from("leveldb.BytewiseComparator");
  const edicao = Buffer.concat([
    varint(1), varint(comparador.length), comparador, // comparador
    varint(2), varint(3), // número do log
    varint(9), varint(0), // log anterior
    varint(3), varint(4), // próximo número de arquivo
    varint(4), varint(0), // última sequência
  ]);
  return [
    { nome: "db/CURRENT", dados: Buffer.from("MANIFEST-000002\n") },
    { nome: "db/MANIFEST-000002", dados: registro(edicao) },
    { nome: "db/000003.log", dados: Buffer.alloc(0) },
  ];
}

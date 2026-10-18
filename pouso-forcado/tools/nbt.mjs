// Escritor NBT little-endian (formato do Bedrock), só o necessário para .mcstructure.
const TIPO = { byte: 1, int: 3, long: 4, float: 5, string: 8, list: 9, compound: 10 };

export const byte = (v) => ({ t: TIPO.byte, v });
export const int = (v) => ({ t: TIPO.int, v });
export const str = (v) => ({ t: TIPO.string, v });
/** Lista homogênea. tipoItem: "int" | "compound" | "list" ... ; itens já como tags. */
export const list = (tipoItem, itens) => ({ t: TIPO.list, tipoItem: TIPO[tipoItem], v: itens });
export const comp = (campos) => ({ t: TIPO.compound, v: campos });

class Saida {
  partes = [];
  u8(n) { this.partes.push(Buffer.from([n & 0xff])); }
  i16(n) { const b = Buffer.alloc(2); b.writeInt16LE(n); this.partes.push(b); }
  i32(n) { const b = Buffer.alloc(4); b.writeInt32LE(n); this.partes.push(b); }
  i64(n) { const b = Buffer.alloc(8); b.writeBigInt64LE(BigInt(n)); this.partes.push(b); }
  f32(n) { const b = Buffer.alloc(4); b.writeFloatLE(n); this.partes.push(b); }
  texto(s) { const b = Buffer.from(s, "utf8"); this.i16(b.length); this.partes.push(b); }
  buffer() { return Buffer.concat(this.partes); }
}

function payload(s, tag) {
  switch (tag.t) {
    case TIPO.byte: return s.u8(tag.v);
    case TIPO.int: return s.i32(tag.v);
    case TIPO.long: return s.i64(tag.v);
    case TIPO.float: return s.f32(tag.v);
    case TIPO.string: return s.texto(tag.v);
    case TIPO.list:
      s.u8(tag.v.length ? tag.tipoItem : 0);
      s.i32(tag.v.length);
      for (const item of tag.v) payload(s, item);
      return;
    case TIPO.compound:
      for (const [nome, filho] of Object.entries(tag.v)) {
        s.u8(filho.t);
        s.texto(nome);
        payload(s, filho);
      }
      return s.u8(0); // TAG_End
  }
  throw new Error(`tipo NBT desconhecido: ${tag.t}`);
}

/** Serializa um compound raiz (nome vazio). */
export function nbt(raiz) {
  const s = new Saida();
  s.u8(TIPO.compound);
  s.texto("");
  payload(s, raiz);
  return s.buffer();
}

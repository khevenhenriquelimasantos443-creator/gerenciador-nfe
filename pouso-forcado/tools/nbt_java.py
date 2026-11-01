"""Leitor de NBT do Java (big-endian, gzip) e escritor de NBT do Bedrock (little-endian), para as estruturas."""
import gzip
import struct


def ler(caminho):
    dados = gzip.open(caminho).read()
    pos = [0]

    def lerb(fmt, n):
        v = struct.unpack(">" + fmt, dados[pos[0]:pos[0] + n])[0]
        pos[0] += n
        return v

    def texto():
        n = lerb("H", 2)
        s = dados[pos[0]:pos[0] + n].decode("utf-8", "replace")
        pos[0] += n
        return s

    def valor(t):
        if t == 1: return lerb("b", 1)
        if t == 2: return lerb("h", 2)
        if t == 3: return lerb("i", 4)
        if t == 4: return lerb("q", 8)
        if t == 5: return lerb("f", 4)
        if t == 6: return lerb("d", 8)
        if t == 7:
            n = lerb("i", 4); b = dados[pos[0]:pos[0] + n]; pos[0] += n; return list(b)
        if t == 8: return texto()
        if t == 9:
            tt = lerb("b", 1); n = lerb("i", 4); return [valor(tt) for _ in range(n)]
        if t == 10:
            d = {}
            while True:
                tt = lerb("b", 1)
                if tt == 0: return d
                k = texto(); d[k] = valor(tt)
        if t == 11:
            n = lerb("i", 4); return [lerb("i", 4) for _ in range(n)]
        if t == 12:
            n = lerb("i", 4); return [lerb("q", 8) for _ in range(n)]
        raise ValueError(t)

    t = lerb("b", 1)
    texto()
    return valor(t)


# ---------- Escrita (Bedrock, little-endian) ----------
class Tag:
    def __init__(self, tipo, v):
        self.tipo, self.v = tipo, v


def byte(v): return Tag(1, v)
def short(v): return Tag(2, v)
def int_(v): return Tag(3, v)
def string(v): return Tag(8, v)
def lista(tipo, itens): return Tag(9, (tipo, itens))
def comp(d): return Tag(10, d)


def _s(b, s):
    e = s.encode("utf-8"); b += struct.pack("<H", len(e)) + e


def _w(b, t):
    if t.tipo == 4: b += struct.pack("<q", t.v); return
    if t.tipo == 5: b += struct.pack("<f", t.v); return
    if t.tipo == 6: b += struct.pack("<d", t.v); return
    if t.tipo == 11: b += struct.pack("<i", len(t.v)) + b"".join(struct.pack("<i", x) for x in t.v); return
    if t.tipo == 1: b += struct.pack("<b", t.v)
    elif t.tipo == 2: b += struct.pack("<h", t.v)
    elif t.tipo == 3: b += struct.pack("<i", t.v)
    elif t.tipo == 8: _s(b, t.v)
    elif t.tipo == 9:
        tipo, itens = t.v
        b += struct.pack("<bi", tipo, len(itens))
        for i in itens: _w(b, i)
    elif t.tipo == 10:
        for k, v in t.v.items():
            b += struct.pack("<b", v.tipo); _s(b, k); _w(b, v)
        b += b"\x00"


def escrever(raiz):
    b = bytearray(b"\x0a\x00\x00")
    _w(b, raiz)
    return bytes(b)


# ---------- Leitura do NBT do Bedrock (little-endian), guardando os tipos para regravar ----------
def ler_le(dados):
    pos = [0]

    def lerb(fmt, n):
        v = struct.unpack("<" + fmt, dados[pos[0]:pos[0] + n])[0]
        pos[0] += n
        return v

    def texto():
        n = lerb("H", 2)
        s = dados[pos[0]:pos[0] + n].decode("utf-8", "replace")
        pos[0] += n
        return s

    def valor(t):
        if t == 1: return Tag(1, lerb("b", 1))
        if t == 2: return Tag(2, lerb("h", 2))
        if t == 3: return Tag(3, lerb("i", 4))
        if t == 4: return Tag(4, lerb("q", 8))
        if t == 5: return Tag(5, lerb("f", 4))
        if t == 6: return Tag(6, lerb("d", 8))
        if t == 8: return Tag(8, texto())
        if t == 9:
            tt = lerb("b", 1); n = lerb("i", 4)
            return Tag(9, (tt, [valor(tt) for _ in range(n)]))
        if t == 10:
            d = {}
            while True:
                tt = lerb("b", 1)
                if tt == 0: return Tag(10, d)
                k = texto(); d[k] = valor(tt)
        if t == 11:
            n = lerb("i", 4); return Tag(11, [lerb("i", 4) for _ in range(n)])
        raise ValueError(f"tipo {t}")

    t = lerb("b", 1)
    texto()
    return valor(t)


def py(t):
    """Tag -> valor Python (para ler)."""
    if t.tipo == 10: return {k: py(v) for k, v in t.v.items()}
    if t.tipo == 9: return [py(x) for x in t.v[1]]
    return t.v

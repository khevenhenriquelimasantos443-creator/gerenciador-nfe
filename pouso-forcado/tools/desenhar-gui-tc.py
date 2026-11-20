"""Desenha os ícones das telas do Tinkers (1.56.0): enfeite, setas e rótulos (16x16, em RP/textures/items/cl/arte/gui_*.png).
Rodado uma vez; os PNG ficam no repositório (não faz parte do build)."""
from pathlib import Path

from PIL import Image

SAIDA = Path(__file__).resolve().parent.parent / "RP/textures/items/cl/arte"
FUNDO, BORDA, LUZ = (55, 55, 58, 255), (35, 35, 38, 255), (78, 78, 82, 255)
AMARELO, CONTORNO, BRANCO = (240, 196, 64, 255), (60, 40, 10, 255), (235, 235, 235, 255)


def painel():
    im = Image.new("RGBA", (16, 16), FUNDO)
    for i in range(16):
        im.putpixel((i, 0), LUZ); im.putpixel((0, i), LUZ)
        im.putpixel((i, 15), BORDA); im.putpixel((15, i), BORDA)
    return im


def pintar(im, pontos, cor, contorno=CONTORNO):
    s = set(pontos)
    for x, y in s:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            q = (x + dx, y + dy)
            if q not in s and 0 <= q[0] < 16 and 0 <= q[1] < 16:
                im.putpixel(q, contorno)
    for p in s:
        im.putpixel(p, cor)


def seta_direita():
    pts = [(x, y) for x in range(3, 9) for y in range(7, 9)]
    for k in range(5):  # ponta
        pts += [(9 + k, y) for y in range(3 + k, 13 - k)]
    return pts


def seta_baixo():
    return [(y, x) for (x, y) in seta_direita()]


def interrogacao():
    linhas = ["..XXXX..", ".XX..XX.", ".....XX.", "....XX..", "...XX...", "...XX...", "........", "...XX..."]
    return [(4 + c, 3 + r) for r, l in enumerate(linhas) for c, ch in enumerate(l) if ch == "X"]


def salvar(nome, pontos=None, cor=AMARELO):
    im = painel()
    if pontos:
        pintar(im, pontos, cor)
    im.save(SAIDA / f"gui_{nome}.png")


SAIDA.mkdir(parents=True, exist_ok=True)
salvar("vazio")
salvar("seta", seta_direita(), BRANCO)
for n in ("padrao", "material", "ferramenta", "pecas"):
    salvar(n, seta_baixo())
salvar("ajuda_pecas", interrogacao())
salvar("ajuda_estacao", interrogacao())
print("gui do Tinkers desenhada")

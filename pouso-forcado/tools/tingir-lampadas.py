# As 8 lâmpadas coloridas (Fase 23, BiblioCraft) a partir da arte da Lâmpada (RP/textures/blocks/cl/arte/lampada_*.png
# e o ícone de menu arte/blocos/lampada.png): só o vidro âmbar muda de tom; a moldura cinza fica igual.
# Assim as 8 ficam idênticas à Lâmpada desenhada, sem precisar pedir arte nova. Roda à mão, depois de importar
# a arte da Lâmpada (precisa de Python + Pillow):
#   python3 tools/tingir-lampadas.py
import colorsys, os
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FACES = os.path.join(R, "RP/textures/blocks/cl/arte")
MENU = os.path.join(R, "RP/textures/items/cl/arte/blocos")
# cor -> (matiz em graus, multiplicador de saturação)
CORES = {
    "vermelha": (2, 1.0), "laranja": (24, 1.0), "amarela": (52, 1.1), "verde": (115, 0.9),
    "ciano": (185, 0.9), "azul": (218, 1.0), "roxa": (275, 0.9), "rosa": (322, 0.8),
}


def tingir(im, matiz, sat):
    im = im.convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            # Vidro âmbar: tons quentes saturados (a moldura e os parafusos são cinza, com saturação baixa).
            if a == 0 or s < 0.25 or not (20 / 360 <= h <= 70 / 360):
                continue
            r2, g2, b2 = colorsys.hls_to_rgb(matiz / 360, l, min(1.0, s * sat))
            px[x, y] = (round(r2 * 255), round(g2 * 255), round(b2 * 255), a)
    return im


def main():
    n = 0
    for cor, (matiz, sat) in CORES.items():
        for face in ("frente", "lado", "topo", "baixo"):
            tingir(Image.open(f"{FACES}/lampada_{face}.png"), matiz, sat).save(f"{FACES}/lampada_{cor}_{face}.png")
            n += 1
        if os.path.exists(f"{MENU}/lampada.png"):
            tingir(Image.open(f"{MENU}/lampada.png"), matiz, sat).save(f"{MENU}/lampada_{cor}.png")
            n += 1
    print(f"lâmpadas coloridas: {n} imagens")


if __name__ == "__main__":
    main()

# 1.40.0: arte própria do Extra Utilities 2 (o mod é de código e arte fechados): os 4 visuais do Lírio Ender e da
# Orquídea Vermelha (cada um serve 2 estágios), as sementes, os laços, os espinhos, a Tocha Magnum e o Candelabro.
# Uso: python3 tools/desenhar-xu2.py
from pathlib import Path
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
B = RAIZ / "RP/textures/blocks/cl/arte"
I = RAIZ / "RP/textures/items/cl/arte"


def nova():
    return Image.new("RGBA", (16, 16), (0, 0, 0, 0))


def caule(d, x, y0, y1, cor):
    d.line([(x, y0), (x, y1)], fill=cor)


def planta(tam, flor, folha, miolo=None):
    im = nova()
    d = ImageDraw.Draw(im)
    alto = [4, 7, 10, 13][tam]
    caule(d, 8, 15, 15 - alto, folha)
    for k in range(tam + 1):
        y = 14 - k * 3
        d.point([(7, y), (6, y - 1), (9, y - 1), (10, y - 2)], fill=folha)
    if tam >= 2:
        r = 1 + (tam - 2)
        cy = 15 - alto
        d.ellipse([8 - r - 1, cy - r, 8 + r + 1, cy + r], fill=flor)
        if miolo and tam == 3:
            d.ellipse([7, cy - 1, 9, cy + 1], fill=miolo)
    return im


ROXO, VERDE_ESC, PEROLA = (122, 60, 168, 255), (54, 92, 70, 255), (32, 140, 120, 255)
VERMELHO, VERDE = (200, 30, 36, 255), (70, 120, 50, 255)
for k in range(4):
    planta(k, ROXO, VERDE_ESC, PEROLA).save(B / f"lirio_ender_planta_{k}.png")
    planta(k, VERMELHO, VERDE, (250, 200, 60, 255)).save(B / f"orquidea_planta_{k}.png")

# Sementes e a orquídea como item.
s = nova()
d = ImageDraw.Draw(s)
for x, y in ((5, 9), (9, 7), (8, 11), (11, 10), (6, 5)):
    d.ellipse([x, y, x + 2, y + 2], fill=(90, 50, 130, 255), outline=(40, 120, 100, 255))
s.save(I / "semente_lirio_ender.png")
planta(3, VERMELHO, VERDE, (250, 200, 60, 255)).save(I / "orquidea_vermelha.png")


def laco(cor, escuro):
    im = nova()
    d = ImageDraw.Draw(im)
    d.ellipse([3, 2, 13, 10], outline=cor, width=2)
    d.line([(8, 10), (6, 13), (8, 15)], fill=escuro, width=2)
    d.point([(5, 4), (11, 8)], fill=(255, 255, 255, 200))
    return im


laco((240, 200, 60, 255), (160, 120, 30, 255)).save(I / "laco_dourado.png")
laco((150, 40, 60, 255), (70, 20, 40, 255)).save(I / "laco_amaldicoado.png")

# Espinhos: base do material e pontas claras (a face de cima e os lados).
for nome, base, ponta in (("madeira", (150, 110, 60), (200, 160, 100)), ("ferro", (150, 150, 155), (225, 225, 230)),
                          ("ouro", (200, 160, 40), (255, 235, 120)), ("diamante", (40, 170, 160), (150, 245, 235))):
    lado = nova()
    d = ImageDraw.Draw(lado)
    d.rectangle([0, 12, 15, 15], fill=base + (255,))
    for x0 in (0, 4, 8, 12):
        for k in range(4):
            d.line([(x0 + k // 2, 11 - k * 3), (x0 + 3 - k // 2, 11 - k * 3)], fill=(ponta if k else base) + (255,))
            d.line([(x0 + k // 2, 10 - k * 3), (x0 + 3 - k // 2, 10 - k * 3)], fill=ponta + (255,))
    lado.save(B / f"espinho_{nome}.png")

# Tocha Magnum e Candelabro (vistos de lado).
m = nova()
d = ImageDraw.Draw(m)
d.rectangle([5, 6, 10, 15], fill=(110, 80, 50, 255))
d.rectangle([4, 4, 11, 6], fill=(60, 180, 200, 255))
d.ellipse([5, 0, 10, 5], fill=(255, 210, 90, 255))
d.ellipse([6, 1, 9, 4], fill=(255, 250, 200, 255))
m.save(B / "tocha_magnum.png")
c = nova()
d = ImageDraw.Draw(c)
d.line([(8, 0), (8, 6)], fill=(70, 60, 50, 255))
d.rectangle([2, 7, 13, 8], fill=(220, 180, 60, 255))
for x in (2, 6, 9, 13):
    d.rectangle([x, 4, x, 6], fill=(240, 240, 220, 255))
    d.point([(x, 3)], fill=(255, 200, 60, 255))
c.save(B / "candelabro.png")
print("xu2: arte desenhada")

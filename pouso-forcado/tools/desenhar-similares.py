# Ícones redesenhados "parecidos com o original" (1.10.1) para os mods cuja arte não pode ser copiada
# (Galacticraft, Create, Extra Utilities, ComputerCraft sem ícone plano): desenho próprio em pixel art 32x32,
# só lembrando o formato e as cores dos originais. Grava em RP/textures/items/cl/arte/<item>.png (o build aplica).
#   python3 tools/desenhar-similares.py
import math, os
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SAIDA = os.path.join(R, "RP/textures/items/cl/arte")
N = 32
CONTORNO = (28, 30, 36, 255)


def novo():
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def contornar(im):
    """Contorno escuro de 1 px em volta do desenho (o jeito dos ícones do Minecraft)."""
    px = im.load()
    borda = []
    for x in range(N):
        for y in range(N):
            if px[x, y][3]:
                continue
            if any(0 <= x + dx < N and 0 <= y + dy < N and px[x + dx, y + dy][3] > 128 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                borda.append((x, y))
    for p in borda:
        px[p] = CONTORNO
    return im


def tom(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c[:3]) + (255,)


def salvar(im, nome):
    im.save(os.path.join(SAIDA, f"{nome}.png"))


def foguete():
    # Foguete Tier 1: deitado na diagonal, corpo claro, bico vermelho, aletas e chama.
    im, d = novo()
    base = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    b = ImageDraw.Draw(base)
    b.rectangle([12, 9, 19, 24], fill=(232, 236, 240, 255))
    b.rectangle([12, 9, 13, 24], fill=(200, 205, 212, 255))
    b.rectangle([18, 9, 19, 24], fill=(175, 182, 190, 255))
    b.polygon([(12, 9), (19, 9), (15.5, 2)], fill=(214, 58, 58, 255))
    b.polygon([(14, 9), (15.5, 9), (15.5, 3)], fill=(240, 96, 90, 255))
    b.rectangle([12, 14, 19, 15], fill=(214, 58, 58, 255))
    b.ellipse([14, 11, 17, 13], fill=(70, 150, 220, 255))
    b.polygon([(12, 18), (8, 25), (12, 24)], fill=(150, 158, 168, 255))
    b.polygon([(19, 18), (23, 25), (19, 24)], fill=(130, 138, 148, 255))
    b.rectangle([13, 24, 18, 26], fill=(90, 96, 104, 255))
    b.polygon([(13, 27), (18, 27), (15.5, 31)], fill=(255, 150, 40, 255))
    b.polygon([(14.5, 27), (16.5, 27), (15.5, 29)], fill=(255, 230, 120, 255))
    im = base.rotate(-40, resample=Image.NEAREST, center=(16, 16))
    salvar(contornar(im), "foguete_t1")


def mascara():
    # Máscara de oxigênio: bolha de vidro com aro cinza.
    im, d = novo()
    d.ellipse([5, 3, 26, 24], fill=(150, 205, 235, 170))
    d.ellipse([8, 6, 15, 12], fill=(230, 245, 255, 220))
    d.rectangle([4, 21, 27, 26], fill=(120, 126, 134, 255))
    d.rectangle([4, 21, 27, 22], fill=(170, 176, 184, 255))
    d.rectangle([13, 23, 18, 26], fill=(80, 86, 94, 255))
    salvar(contornar(im), "mascara_oxigenio")


def equipamento():
    # Equipamento de oxigênio: caixa nas costas com dois tubos.
    im, d = novo()
    d.rectangle([9, 8, 22, 26], fill=(130, 136, 146, 255))
    d.rectangle([9, 8, 22, 10], fill=(170, 176, 186, 255))
    d.rectangle([12, 13, 19, 22], fill=(95, 101, 110, 255))
    d.rectangle([14, 15, 17, 17], fill=(90, 200, 120, 255))
    for x in (5, 25):
        d.rectangle([x, 6, x + 2, 22], fill=(70, 150, 220, 255))
        d.rectangle([x, 6, x + 2, 7], fill=(140, 200, 245, 255))
    salvar(contornar(im), "equipamento_oxigenio")


def tanque(nome, cor):
    # Tanques de oxigênio (verde, laranja e vermelho no original): cilindro com faixa e tampa.
    im, d = novo()
    d.rounded_rectangle([10, 6, 21, 28], radius=4, fill=cor)
    d.rectangle([12, 8, 13, 26], fill=tom(cor, 1.3))
    d.rectangle([19, 8, 20, 26], fill=tom(cor, 0.7))
    d.rectangle([10, 12, 21, 14], fill=(200, 205, 212, 255))
    d.rectangle([13, 2, 18, 6], fill=(150, 156, 166, 255))
    d.rectangle([14, 1, 17, 2], fill=(110, 116, 126, 255))
    salvar(contornar(im), nome)


def bico():
    im, d = novo()
    d.polygon([(7, 27), (25, 27), (16, 4)], fill=(214, 58, 58, 255))
    d.polygon([(13, 27), (16, 27), (16, 6)], fill=(240, 100, 92, 255))
    d.rectangle([7, 25, 25, 28], fill=(180, 186, 194, 255))
    salvar(contornar(im), "bico_foguete")


def aleta():
    im, d = novo()
    d.polygon([(8, 4), (8, 28), (26, 28)], fill=(160, 166, 176, 255))
    d.polygon([(8, 4), (11, 4), (11, 28), (8, 28)], fill=(120, 126, 136, 255))
    d.line([(10, 10), (22, 27)], fill=(200, 206, 214, 255))
    salvar(contornar(im), "aleta_foguete")


def motor():
    im, d = novo()
    d.rectangle([7, 4, 24, 16], fill=(140, 146, 156, 255))
    d.rectangle([7, 4, 24, 6], fill=(180, 186, 196, 255))
    d.polygon([(10, 16), (21, 16), (25, 28), (6, 28)], fill=(90, 96, 106, 255))
    d.polygon([(12, 18), (19, 18), (21, 27), (10, 27)], fill=(60, 64, 72, 255))
    d.rectangle([12, 9, 19, 11], fill=(255, 150, 40, 255))
    salvar(contornar(im), "motor_foguete")


def helice():
    # Hélice do Create: quatro pás de ferro em volta de um miolo de liga de andesita.
    im, d = novo()
    for a in range(4):
        ang = math.radians(a * 90 + 20)
        cx, cy = 16 + math.cos(ang) * 8, 16 + math.sin(ang) * 8
        pts = [(16 + math.cos(ang + s) * r, 16 + math.sin(ang + s) * r) for s, r in ((-0.35, 4), (-0.25, 13), (0.3, 13), (0.35, 4))]
        d.polygon(pts, fill=(205, 210, 216, 255))
        d.line([(16, 16), (cx, cy)], fill=(160, 166, 174, 255))
    d.ellipse([12, 12, 20, 20], fill=(167, 169, 159, 255))
    d.ellipse([14, 14, 18, 18], fill=(120, 122, 114, 255))
    salvar(contornar(im), "helice")


def batedor():
    # Batedor do Create: cabo de liga de andesita e o arame em laços.
    im, d = novo()
    d.rectangle([14, 2, 17, 12], fill=(167, 169, 159, 255))
    d.rectangle([14, 2, 15, 12], fill=(200, 202, 192, 255))
    for w in (3, 6, 9):
        d.ellipse([16 - w, 11, 16 + w, 29], outline=(215, 220, 226, 255), width=1)
    d.rectangle([13, 11, 18, 13], fill=(130, 132, 124, 255))
    salvar(contornar(im), "batedor")


def regador():
    # Regador do Extra Utilities: lata de pedra com bico e alça.
    im, d = novo()
    d.rounded_rectangle([7, 12, 21, 27], radius=2, fill=(128, 128, 128, 255))
    d.rectangle([7, 12, 21, 14], fill=(160, 160, 160, 255))
    d.rectangle([9, 15, 11, 25], fill=(150, 150, 150, 255))
    d.polygon([(20, 18), (28, 9), (30, 11), (21, 22)], fill=(110, 110, 110, 255))
    d.rectangle([27, 7, 30, 10], fill=(90, 90, 90, 255))
    d.arc([8, 5, 20, 17], 180, 360, fill=(95, 95, 95, 255), width=2)
    d.point([(29, 13), (30, 16), (28, 15)], fill=(80, 150, 230, 255))
    salvar(contornar(im), "regador")


def robo():
    # Robô Minerador: a "turtle" do ComputerCraft vista de frente, com tela e a picareta do lado.
    im, d = novo()
    d.rectangle([5, 8, 23, 26], fill=(217, 195, 122, 255))
    d.rectangle([5, 8, 23, 10], fill=(236, 220, 160, 255))
    d.rectangle([21, 10, 23, 26], fill=(176, 156, 92, 255))
    d.rectangle([8, 12, 19, 21], fill=(29, 43, 34, 255))
    d.rectangle([10, 14, 13, 14], fill=(88, 210, 107, 255))
    d.rectangle([10, 17, 15, 17], fill=(88, 210, 107, 255))
    d.line([(24, 16), (29, 11)], fill=(138, 106, 58, 255), width=2)
    d.polygon([(26, 6), (31, 11), (30, 12), (25, 7)], fill=(111, 240, 230, 255))
    salvar(contornar(im), "robo_minerador")


for f in (foguete, mascara, equipamento, bico, aleta, motor, helice, batedor, regador, robo):
    f()
tanque("tanque_oxigenio_leve", (80, 190, 90, 255))
tanque("tanque_oxigenio_medio", (235, 150, 50, 255))
tanque("tanque_oxigenio_pesado", (210, 60, 60, 255))
print("ícones parecidos: 13")

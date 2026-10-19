# Ícones dos blocos do add-on para o Catálogo (64x64, vista isométrica de sudeste).
# Os blocos com modelo próprio não têm ícone plano; o menu do Catálogo precisa de uma imagem.
# Lê os modelos (RP/models/blocks) e as texturas; grava RP/textures/items/cl/blocos/<bloco>.png.
# Não roda no build (precisa de Python + Pillow): rode de novo quando mudar um modelo ou textura.
#   python3 tools/icones-blocos.py
import json, math, os, sys
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SAIDA = os.path.join(R, "RP/textures/items/cl/blocos")
ESTADO = {"bateria": 1}  # permutação a usar no ícone (bateria com carga)
terreno = json.load(open(f"{R}/RP/textures/terrain_texture.json"))["texture_data"]
cache = {}


def tex(nome):
    if nome not in cache:
        p = terreno[nome]["textures"]
        p = p if isinstance(p, str) else p[0] if isinstance(p, list) else p["path"]
        arq = f"{R}/RP/{p}.png"
        if not os.path.exists(arq):  # textura do próprio jogo: cópia local em referencias/vanilla (fora do git)
            arq = f"{R}/referencias/vanilla/{p}.png"
        im = Image.open(arq).convert("RGBA")
        cache[nome] = im.crop((0, 0, im.width, im.width))  # 1º quadro das animadas
    return cache[nome]


S = 9.0


def proj(p):
    x, y, z = p
    return (220 + (x - z) * S * 0.866, 330 - y * S + (x + z) * S * 0.5)


def rot_x(p, piv, ang):
    a = math.radians(ang)
    y, z = p[1] - piv[1], p[2] - piv[2]
    return (p[0], piv[1] + y * math.cos(a) - z * math.sin(a), piv[2] + y * math.sin(a) + z * math.cos(a))


def cubos(nome, bloco):
    arq = f"{R}/RP/models/blocks/cl_{nome}.geo.json"
    if os.path.exists(arq):
        geo = json.load(open(arq))["minecraft:geometry"][0]
        g = bloco["components"]["minecraft:geometry"]
        escondidos = set(g.get("bone_visibility", {})) if isinstance(g, dict) else set()
        for bone in geo["bones"]:
            if nome == "cabo":
                if bone["name"] in ("leste", "oeste"):
                    continue
            elif bone["name"] in escondidos:  # partes que só aparecem em algum estado (conteúdo, níveis)
                continue
            yield from bone.get("cubes", [])
        return
    # Bloco cúbico simples: um cubo inteiro, material por face.
    mi = bloco["components"]["minecraft:material_instances"]
    uv = {f: {"uv": [0, 0], "uv_size": [16, 16], "material_instance": f if f in mi else "*"} for f in ("up", "north", "south", "east", "west")}
    yield {"origin": [-8, 0, -8], "size": [16, 16, 16], "uv": uv}


def render(nome):
    bloco = json.load(open(f"{R}/BP/blocks/{nome}.json"))["minecraft:block"]
    mi = dict(bloco["components"]["minecraft:material_instances"])
    k = ESTADO.get(nome)
    if k is not None and bloco.get("permutations"):
        mi.update(bloco["permutations"][min(k, len(bloco["permutations"]) - 1)]["components"].get("minecraft:material_instances", {}))
    gira = "traits" in bloco["description"]
    faces = []
    for c in cubos(nome, bloco):
        ox, oy, oz = c["origin"]
        sx, sy, sz = c["size"]
        x0, y0, z0 = ox + 8, oy, oz + 8
        x1, y1, z1 = x0 + sx, y0 + sy, z0 + sz
        rot, piv = c.get("rotation"), c.get("pivot")

        def P(p, rot=rot, piv=piv):
            if rot:
                p = rot_x(p, (piv[0] + 8, piv[1], piv[2] + 8), -rot[0])
            if gira:
                p = (16 - p[0], p[1], 16 - p[2])
            return p

        quads = {
            "up": [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)],
            "south": [(x0, y1, z1), (x1, y1, z1), (x1, y0, z1), (x0, y0, z1)],
            "east": [(x1, y1, z1), (x1, y1, z0), (x1, y0, z0), (x1, y0, z1)],
            "north": [(x1, y1, z0), (x0, y1, z0), (x0, y0, z0), (x1, y0, z0)],
            "west": [(x0, y1, z0), (x0, y1, z1), (x0, y0, z1), (x0, y0, z0)],
        }
        for f, q in quads.items():
            if f not in c["uv"]:
                continue
            q = [P(p) for p in q]
            nrm = {"up": (0, 1, 0), "south": (0, 0, 1), "east": (1, 0, 0), "north": (0, 0, -1), "west": (-1, 0, 0)}[f]
            if rot or gira:
                nrm = tuple(b - a for a, b in zip(P((0, 0, 0)), P(nrm)))
            if nrm[0] + nrm[1] * 1.2 + nrm[2] <= 0.01:
                continue
            uv = c["uv"][f]
            m = mi.get(uv["material_instance"], mi["*"])
            if isinstance(m, str):
                m = mi[m]
            luz = m.get("face_dimming", True) is False
            sombra = 1.0 if luz else {"up": 1.0, "south": 0.82, "east": 0.68, "north": 0.75, "west": 0.7}[f]
            if gira and not luz:
                sombra = {"up": 1.0, "south": 0.68, "east": 0.75, "north": 0.82, "west": 0.68}[f]
            faces.append((sum(p[0] + p[1] + p[2] for p in q) / 4, q, uv, m["texture"], sombra))
    img = Image.new("RGBA", (440, 440), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for _, q, uv, t, sombra in sorted(faces, key=lambda f: f[0]):
        im = tex(t)
        W = im.width
        u0, v0 = uv["uv"]
        du, dv = uv["uv_size"]
        n = 16
        for i in range(n):
            for j in range(n):
                a, b, cc, dd = i / n, (i + 1) / n, j / n, (j + 1) / n

                def pt(s, t_):
                    top = [q[0][k] + (q[1][k] - q[0][k]) * s for k in range(3)]
                    bot = [q[3][k] + (q[2][k] - q[3][k]) * s for k in range(3)]
                    return proj([top[k] + (bot[k] - top[k]) * t_ for k in range(3)])

                px = im.getpixel((min(W - 1, int((u0 + du * (a + b) / 2) * W / 16) % W), min(W - 1, int((v0 + dv * (cc + dd) / 2) * W / 16) % W)))
                if px[3] < 128:
                    continue
                d.polygon([pt(a, cc), pt(b, cc), pt(b, dd), pt(a, dd)], fill=tuple(int(v * sombra) for v in px[:3]) + (255,))
    # Corta a sobra e centraliza num quadrado de 64x64.
    caixa = img.getbbox()
    img = img.crop(caixa)
    lado = max(img.size)
    quad = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    quad.alpha_composite(img, ((lado - img.width) // 2, (lado - img.height) // 2))
    return quad.resize((64, 64), Image.LANCZOS)


os.makedirs(SAIDA, exist_ok=True)
# Plantações (planos cruzados) usam a textura plana no Catálogo. Com nomes na linha de comando, só esses.
nomes = sys.argv[1:] or sorted(n[:-5] for n in os.listdir(f"{R}/BP/blocks") if n.endswith(".json") and not n.startswith("planta_"))
for nome in nomes:
    render(nome).save(f"{SAIDA}/{nome}.png")
print(f"ícones de bloco: {len(nomes)}")

# Tinkers' Construct 3.12.1 (SlimeKnights, MIT, inclusive a arte; github.com/SlimeKnights/TinkersConstruct, ramo 1.20.1, o
# mais novo) para o pack (1.24.0): a arte das peças e das ferramentas. O TC3 desenha cada peça em cinza e pinta com a cor
# do material; aqui a mesma coisa: o cinza do mod vezes a cor do material (tools/dados/conteudo/tinkers.mjs). Nas
# ferramentas, a cabeça leva a cor do material e o cabo e a ligação a da madeira (o ícone não sabe dos outros materiais).
# Uso: python3 tools/importar-tinkers3.py <pasta do Tinkers clonado>
import json, os, re, subprocess, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-tinkers3.py <pasta do Tinkers>")
T = os.path.join(SRC, "src/main/resources/assets/tconstruct/textures/item")
dados = json.loads(subprocess.check_output(["node", "-e", 'import("./tools/dados/conteudo/tinkers.mjs").then(m=>console.log(JSON.stringify({M:m.MATERIAIS,P:m.PECAS,F:m.FERRAMENTAS})))'], cwd=R))
MAT, PECAS, FERR = dados["M"], dados["P"], dados["F"]
MADEIRA = "#a07c48"
PECA = {"cabo": "tool/parts/tool_handle", "ligacao": "tool/parts/tool_binding", "cabeca_picareta": "tool/pickaxe/head", "cabeca_pa": "tool/excavator/head",
        "cabeca_machado": "tool/hand_axe/head", "lamina_espada": "tool/sword/blade", "guarda_larga": "tool/sword/guard", "travessa": "tool/parts/tough_binding",
        "cabeca_martelo": "tool/sledge_hammer/head", "placa_grande": "tool/parts/large_plate", "cabo_resistente": "tool/parts/tough_handle",
        "ligacao_resistente": "tool/parts/tough_binding", "cabeca_machado_larga": "tool/broad_axe/blade"}
# Camadas de cada ferramenta: (textura, "cabeca" ou "resto"), de baixo para cima.
CAMADAS = {
    "picareta": [("tool/pickaxe/handle", "resto"), ("tool/pickaxe/binding", "resto"), ("tool/pickaxe/head", "cabeca")],
    "pa": [("tool/excavator/handle", "resto"), ("tool/excavator/head", "cabeca")],
    "machadinha": [("tool/pickaxe/handle", "resto"), ("tool/hand_axe/binding", "resto"), ("tool/hand_axe/head", "cabeca")],
    "espada_larga": [("tool/sword/handle", "resto"), ("tool/sword/guard", "resto"), ("tool/sword/blade", "cabeca")],
    "marreta": [("tool/sledge_hammer/handle", "resto"), ("tool/sledge_hammer/back", "cabeca"), ("tool/sledge_hammer/front", "cabeca"), ("tool/sledge_hammer/head", "cabeca")],
    "escavadeira": [("tool/excavator/handle", "resto"), ("tool/excavator/grip", "resto"), ("tool/excavator/binding", "resto"), ("tool/excavator/head", "cabeca")],
    "machado_largo": [("tool/broad_axe/handle", "resto"), ("tool/broad_axe/binding", "resto"), ("tool/broad_axe/back", "cabeca"), ("tool/broad_axe/blade", "cabeca")],
}
LINGOTES = {"lingote_ouro_rosa": "materials/rose_gold_ingot", "lingote_bronze_ametista": "materials/amethyst_bronze_ingot"}


def cor(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def abrir(rel):
    im = Image.open(os.path.join(T, rel + ".png")).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def pintar(im, c):
    r, g, b = cor(c)
    px = im.load()
    out = Image.new("RGBA", im.size)
    po = out.load()
    for y in range(im.height):
        for x in range(im.width):
            pr, pg, pb, pa = px[x, y]
            v = (pr + pg + pb) / 3 / 255
            # Um pouco de brilho a mais (o cinza do mod é escuro para a paleta dele).
            v = min(1.0, v * 1.15)
            po[x, y] = (int(r * v), int(g * v), int(b * v), pa)
    return out


saida = os.path.join(R, "RP/textures/items/cl/arte")
usados = []
for mat, m in MAT.items():
    for p in PECAS:
        if p not in PECA:
            continue
        im = pintar(abrir(PECA[p]), m["cor"]).resize((16, 16), Image.NEAREST)
        im.save(os.path.join(saida, f"peca_{p}_{mat}.png"))
        usados.append(f"peca_{p}_{mat}")
    for f, camadas in CAMADAS.items():
        if f not in FERR:
            continue
        base = None
        for rel, papel in camadas:
            if not os.path.exists(os.path.join(T, rel + ".png")):
                continue
            im = pintar(abrir(rel), m["cor"] if papel == "cabeca" else MADEIRA)
            base = im if base is None else Image.alpha_composite(base.resize(im.size), im)
        if base:
            base.resize((16, 16), Image.NEAREST).save(os.path.join(saida, f"{f}_{mat}.png"))
            usados.append(f"{f}_{mat}")
for pid, rel in LINGOTES.items():
    abrir(rel).save(os.path.join(saida, f"{pid}.png"))
    usados.append(pid)
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["tinkers3"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
with open(os.path.join(R, "docs/licencas/tinkers3.txt"), "w") as g:
    g.write("Tinkers' Construct 3.12.1 (SlimeKnights), github.com/SlimeKnights/TinkersConstruct, ramo 1.20.1. Código, texturas e binários: MIT.\n\n")
    g.write(open(os.path.join(SRC, "LICENSE")).read())
print(f"tinkers 3: {len(usados)} artes")

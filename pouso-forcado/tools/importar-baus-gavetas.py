#!/usr/bin/env python3
"""1.32.0: arte do Iron Chests (progwml6, GPL-3) e do Storage Drawers (jaquadro, MIT).

Uso: python3 tools/importar-baus-gavetas.py <clone do ironchest> <clone do StorageDrawers>
- Baús: o atlas 64×64 do modelo do baú vira as 4 faces de um bloco (frente com a trava, lado, topo e baixo).
- Gavetas: frente com sombra e puxadores (as camadas do mod), lado, controlador, compactadora; e os itens das melhorias.
"""
import json, shutil, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
IC = next(Path(sys.argv[1]).glob("**/assets/ironchest/textures"))
SD = next(Path(sys.argv[2]).glob("**/assets/storagedrawers/textures"))
BLOCOS = RAIZ / "RP/textures/blocks/cl/arte"
ITENS = RAIZ / "RP/textures/items/cl/arte"
usados = {"ironchest": [], "storagedrawers": []}


def faixa(im, x, y, w, h):
    return im.crop((x, y, x + w, y + h)).transpose(Image.FLIP_TOP_BOTTOM)


def bau(nome, mod_nome):
    """O modelo do baú do Java é desenhado de cabeça para baixo: as faixas da tampa e da base vêm viradas."""
    a = Image.open(IC / f"model/{mod_nome}.png").convert("RGBA")
    def lado(u):
        f = Image.new("RGBA", (14, 14))
        f.paste(faixa(a, u, 14, 14, 5), (0, 0))  # tampa
        f.paste(faixa(a, u, 34, 14, 9), (0, 5))  # base (a linha de cima fica sob a tampa)
        return f
    frente = lado(42)
    frente.alpha_composite(faixa(a, 1, 1, 2, 4), (6, 3))  # trava
    faces = {"frente": frente, "lado": lado(0), "topo": a.crop((28, 0, 42, 14)), "baixo": a.crop((14, 19, 28, 33))}
    for face, im in faces.items():
        im.resize((16, 16), Image.NEAREST).save(BLOCOS / f"{nome}_{face}.png")
    usados["ironchest"].append(nome)


def camadas(base, *over):
    im = Image.open(SD / base).convert("RGBA")
    for o in over:
        im.alpha_composite(Image.open(SD / o).convert("RGBA").resize(im.size))
    return im


def gaveta(nome, frente, lado="block/drawers_oak_side.png", topo=None):
    frente.save(BLOCOS / f"{nome}_frente.png")
    for face in ("lado", "baixo"):
        camadas(lado).save(BLOCOS / f"{nome}_{face}.png")
    camadas(topo or lado).save(BLOCOS / f"{nome}_topo.png")
    usados["storagedrawers"].append(nome)


for nome, deles in [("bau_cobre", "copper_chest"), ("bau_ferro", "iron_chest"), ("bau_ouro", "gold_chest"), ("bau_diamante", "diamond_chest"),
                    ("bau_cristal", "crystal_chest"), ("bau_obsidiana", "obsidian_chest"), ("bau_terra", "dirt_chest")]:
    bau(nome, deles)
for de, para in [("wood", "copper"), ("wood", "iron"), ("copper", "iron"), ("iron", "gold"), ("gold", "diamond"), ("diamond", "crystal"), ("diamond", "obsidian")]:
    pt = {"wood": "madeira", "copper": "cobre", "iron": "ferro", "gold": "ouro", "diamond": "diamante", "crystal": "cristal", "obsidian": "obsidiana"}
    nome = f"melhoria_bau_{pt[de]}_{pt[para]}"
    shutil.copyfile(IC / f"item/{de}_{para}_upgrade.png", ITENS / f"{nome}.png")
    usados["ironchest"].append(nome)

b = "block/"
gaveta("gaveta", camadas(b + "drawers_oak_front_1.png", b + "overlay/shading_1.png", b + "overlay/handle_1.png"))
gaveta("gaveta_2", camadas(b + "drawers_oak_front_2.png", b + "overlay/shading_2.png", b + "overlay/handle_2.png"))
gaveta("gaveta_4", camadas(b + "drawers_oak_front_4.png", b + "overlay/shading_4.png", b + "overlay/handle_4.png"))
gaveta("gaveta_compactadora", camadas(b + "drawers_comp_front_0.png"), b + "drawers_comp_side.png")
gaveta("controlador_gavetas", camadas(b + "drawers_controller_front.png"), b + "drawers_comp_side.png")
gaveta("acabamento_gaveta", camadas(b + "drawers_oak_trim.png"), b + "drawers_oak_trim.png")
for nome, deles in [("melhoria_gaveta_1", "obsidian"), ("melhoria_gaveta_2", "copper"), ("melhoria_gaveta_3", "iron"), ("melhoria_gaveta_4", "gold"),
                    ("melhoria_gaveta_5", "emerald"), ("melhoria_gaveta_6", "diamond"), ("melhoria_gaveta_7", "netherite")]:
    shutil.copyfile(SD / f"item/upgrade_{deles}.png", ITENS / f"{nome}.png")
    usados["storagedrawers"].append(nome)
for nome, deles in [("melhoria_gaveta_vazio", "upgrade_void"), ("melhoria_gaveta_base", "upgrade_blank"), ("chave_gaveta", "drawer_key")]:
    src = SD / f"item/{deles}.png"
    if not src.exists():
        src = next(SD.glob(f"item/{deles}*.png"))
    shutil.copyfile(src, ITENS / f"{nome}.png")
    usados["storagedrawers"].append(nome)

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos.update({k: sorted(set(v)) for k, v in usados.items()})
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(next(Path(sys.argv[1]).glob("LICENSE*")), RAIZ / "docs/licencas/ironchest.txt")
shutil.copyfile(next(Path(sys.argv[2]).glob("LICENSE*")), RAIZ / "docs/licencas/storagedrawers.txt")
print("baús e gavetas:", {k: len(v) for k, v in usados.items()})

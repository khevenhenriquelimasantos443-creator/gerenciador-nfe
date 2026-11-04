#!/usr/bin/env python3
"""1.33.0: arte do Iron Jetpacks (BlakeBr0, MIT) e do TorchMaster (xalcon, MIT).

Uso: python3 tools/importar-jetpacks-tochas.py <clone do IronJetpacks> <clone do TorchMaster>
- Jetpacks: o mod pinta as peças cinzas com a cor de cada tier (tinge aqui do mesmo jeito): jetpack, célula,
  propulsor e capacitor; bobinas e alça como estão. Vestido: dois propulsores nas costas (modelo próprio, simples,
  pintado com a cor do tier).
- Mega Tocha e Lanterna Sinalizadora: a coluna e a lanterna do mod, recortadas para o canto (o modelo do bloco usa o
  canto da textura).
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
IJ = next(Path(sys.argv[1]).glob("**/assets/ironjetpacks/textures"))
TM = next(Path(sys.argv[2]).glob("**/assets/torchmaster/textures"))
ITENS = RAIZ / "RP/textures/items/cl/arte"
BLOCOS = RAIZ / "RP/textures/blocks/cl/arte"
usados = {"ironjetpacks": [], "torchmaster": []}
f52 = (RAIZ / "tools/dados/conteudo/f52.mjs").read_text()
TIERS = re.findall(r'\["([a-z]+)", "[^"]+", "[^"]+", \d, "(#[0-9a-f]{6})"', f52)


def tingir(im, cor):
    r, g, b = int(cor[1:3], 16), int(cor[3:5], 16), int(cor[5:7], 16)
    out = Image.new("RGBA", im.size)
    px, po = im.load(), out.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            pr, pg, pb, pa = px[x, y]
            po[x, y] = (pr * r // 255, pg * g // 255, pb * b // 255, pa)
    return out


for tier, cor in TIERS:
    for peca, arq in [("jetpack", "jetpack"), ("celula", "cell"), ("propulsor", "thruster"), ("capacitor", "capacitor")]:
        if peca != "jetpack" and tier == "criativo":
            continue
        nome = f"{peca}_{tier}"
        tingir(Image.open(IJ / f"item/{arq}.png").convert("RGBA"), cor).save(ITENS / f"{nome}.png")
        usados["ironjetpacks"].append(nome)
    # Vestido: textura 16×16 do propulsor (tampa clara, corpo na cor, bocal escuro).
    t = Image.new("RGBA", (16, 16))
    corpo = tingir(Image.new("RGBA", (16, 16), (210, 210, 210, 255)), cor)
    t.paste(corpo, (0, 0))
    for x in range(16):
        for y in range(0, 3):
            t.putpixel((x, y), (235, 235, 235, 255))
        for y in range(13, 16):
            t.putpixel((x, y), (50, 50, 55, 255))
    (RAIZ / "RP/textures/models/armor/cl").mkdir(parents=True, exist_ok=True)
    t.save(RAIZ / f"RP/textures/models/armor/cl/jetpack_{tier}.png")
    att = {"format_version": "1.10.0", "minecraft:attachable": {"description": {
        "identifier": f"cl:jetpack_{tier}", "materials": {"default": "entity_alphatest", "enchanted": "entity_alphatest_glint"},
        "textures": {"default": f"textures/models/armor/cl/jetpack_{tier}", "enchanted": "textures/misc/enchanted_item_glint"},
        "geometry": {"default": "geometry.cl.jetpack_vestido"}, "render_controllers": ["controller.render.armor"]}}}
    (RAIZ / f"RP/attachables/cl_jetpack_{tier}.json").write_text(json.dumps(att, indent=2) + "\n")
for nome, arq in [("bobina_basica", "basic_coil"), ("bobina_avancada", "advanced_coil"), ("bobina_elite", "elite_coil"), ("bobina_suprema", "ultimate_coil"), ("alca_jetpack", "strap")]:
    shutil.copyfile(IJ / f"item/{arq}.png", ITENS / f"{nome}.png")
    usados["ironjetpacks"].append(nome)
# Modelo vestido: dois propulsores e a alça nas costas, presos ao osso "body" do jogador.
cubo = lambda o, s: {"origin": o, "size": s, "uv": [0, 0]}
geo = {"format_version": "1.12.0", "minecraft:geometry": [{"description": {"identifier": "geometry.cl.jetpack_vestido", "texture_width": 16, "texture_height": 16,
       "visible_bounds_width": 2, "visible_bounds_height": 3, "visible_bounds_offset": [0, 1.5, 0]},
       "bones": [{"name": "body", "pivot": [0, 24, 0], "cubes": [cubo([-4, 14, 2], [3, 9, 3]), cubo([1, 14, 2], [3, 9, 3]), cubo([-1, 19, 2], [2, 3, 1])]}]}]}
(RAIZ / "RP/models/entity/cl_jetpack_vestido.geo.json").write_text(json.dumps(geo, indent=2) + "\n")


def recorte(arq, caixa, nome):
    im = Image.open(TM / f"block/{arq}.png").convert("RGBA")
    out = Image.new("RGBA", (16, 16))
    out.paste(im.crop(caixa), (0, 0))
    out.save(BLOCOS / f"{nome}.png")
    usados["torchmaster"].append(nome)


def caixa_util(arq):
    return Image.open(TM / f"block/{arq}.png").convert("RGBA").getbbox()


recorte("megatorch", caixa_util("megatorch"), "tocha_mega")
recorte("feral_flare_lantern", caixa_util("feral_flare_lantern"), "lanterna_feral")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos.update({k: sorted(set(v)) for k, v in usados.items()})
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(next(Path(sys.argv[1]).glob("LICENSE*")), RAIZ / "docs/licencas/ironjetpacks.txt")
shutil.copyfile(next(Path(sys.argv[2]).glob("LICENSE*")), RAIZ / "docs/licencas/torchmaster.txt")
print("jetpacks e tochas:", {k: len(v) for k, v in usados.items()}, "tiers:", len(TIERS))

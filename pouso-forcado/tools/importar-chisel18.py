# 1.45.0: arte do Chisel 1.18 (o mais novo, branch 1.18/dev; Chisel Team, GPLv2, como a da 1.10.1) para as variantes
# novas da fase 64 (tools/dados/chisel18.json): arenito e arenito vermelho, templo, fábrica e laboratório.
# Uso: python3 tools/importar-chisel18.py <clone do Chisel (1.18/dev)>
import json, subprocess, sys
from io import BytesIO
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
C = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-chisel18.py <clone do Chisel 1.18>"))
B = RAIZ / "RP/textures/blocks/cl/arte"
VARIANTES = json.loads((RAIZ / "tools/dados/chisel18.json").read_text(encoding="utf-8"))
PASTA = {"arenito": "sandstone", "arenito_vermelho": "red_sandstone", "templo": "temple", "fabrica": "factory", "laboratorio": "laboratory"}
ARVORE = subprocess.run(["git", "-C", str(C), "ls-tree", "-r", "--name-only", "HEAD"], capture_output=True, check=True, text=True).stdout.split()
usados = []


def abrir(rel):
    p = next(x for x in ARVORE if x.endswith(f"/assets/chisel/textures/block/{rel}.png"))
    im = Image.open(BytesIO(subprocess.run(["git", "-C", str(C), "show", f"HEAD:{p}"], capture_output=True, check=True).stdout)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


for familia, lista in VARIANTES["familias"].items():
    for id_, _pt, _en, arq in lista:
        pasta = PASTA[familia]
        if arq.endswith("-side"):  # coluna: lado e topo
            base = arq[: -len("-side")]
            for f, a in (("frente", arq), ("lado", arq), ("topo", base + "-top"), ("baixo", base + "-top")):
                abrir(f"{pasta}/{a}").save(B / f"{id_}_{f}.png")
        else:
            abrir(f"{pasta}/{arq}").save(B / f"{id_}.png")
        usados.append(id_)

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["chisel"] = sorted(set(todos.get("chisel", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print("chisel 1.18:", len(usados), "variantes")

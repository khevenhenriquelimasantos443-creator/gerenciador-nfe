# 1.43.0: arte do BuildCraft 8 (o mais novo publicado, branch 8.0.x-1.12.2; licença MMPL, inclusive a arte) para os
# blocos novos da fase 62: motores de Redstone e Stirling, Poço de Mineração, Comporta, Enchedor e Marco.
# Uso: python3 tools/importar-bc8.py <clone do BuildCraft (8.0.x-1.12.2)>
import json, subprocess, sys
from io import BytesIO
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
C = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-bc8.py <clone do BuildCraft 8>"))
A = "buildcraft_resources/assets/"
B = RAIZ / "RP/textures/blocks/cl/arte"
usados = []


def abrir(rel):
    dados = subprocess.run(["git", "-C", str(C), "show", f"HEAD:{A}{rel}.png"], capture_output=True, check=True).stdout
    im = Image.open(BytesIO(dados)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def faces(i, frente, lado, topo=None, baixo=None):
    for f, rel in zip(("frente", "lado", "topo", "baixo"), (frente, lado, topo or lado, baixo or topo or lado)):
        abrir(rel).save(B / f"{i}_{f}.png")
    usados.append(i)


faces("motor_redstone", "buildcraftcore/textures/blocks/engine/wood/back", "buildcraftcore/textures/blocks/engine/wood/side")
faces("motor_stirling", "buildcraftenergy/textures/blocks/engine/stone/back", "buildcraftenergy/textures/blocks/engine/stone/side")
W = "buildcraftfactory/textures/blocks/mining_well/"
faces("poco_mineracao", W + "front", W + "side", W + "top", W + "bottom")
G = "buildcraftfactory/textures/blocks/flood_gate/"
faces("comporta", G + "open", G + "closed", G + "top", G + "open")
F = "buildcraftbuilders/textures/blocks/filler/"
faces("enchedor", F + "front", F + "side", F + "top", F + "bottom")
abrir("buildcraftcore/textures/blocks/marker_volume").save(B / "marco.png")
usados.append("marco")

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["buildcraft"] = sorted(set(todos.get("buildcraft", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print("buildcraft 8:", len(usados), "blocos")

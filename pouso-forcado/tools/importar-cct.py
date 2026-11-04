# 1.39.0: arte do CC:Tweaked 1.121 (o mais novo, mc-1.21.x; texturas CCPL de Daniel Ratcliffe e as do alto-falante MPL-2.0
# dos desenvolvedores do CC: Tweaked) para o Monitor, a Impressora, o Alto-falante e a Página Impressa da fase 58.
# Uso: python3 tools/importar-cct.py <clone do CC:Tweaked>
import json, shutil, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
C = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-cct.py <clone do CC:Tweaked>"))
T = C / "projects/common/src/main/resources/assets/computercraft/textures"
usados = []


def copiar(rel, destino):
    im = Image.open(T / rel).convert("RGBA")
    im = im.crop((0, 0, im.width, im.width)) if im.height > im.width else im
    im.save(destino)
    usados.append(destino.stem)


B = RAIZ / "RP/textures/blocks/cl/arte"
for bloco, faces in {
    "monitor": {"frente": "monitor_normal_15", "lado": "monitor_normal_0", "topo": "monitor_normal_0", "baixo": "monitor_normal_0"},
    "impressora": {"frente": "printer_front_empty", "lado": "printer_side", "topo": "printer_top", "baixo": "printer_top"},
    "alto_falante": {"frente": "speaker_front", "lado": "speaker_side", "topo": "speaker_top", "baixo": "speaker_top"},
}.items():
    for face, arq in faces.items():
        copiar(f"block/{arq}.png", B / f"{bloco}_{face}.png")
copiar("item/printed_page.png", RAIZ / "RP/textures/items/cl/arte/pagina_impressa.png")
copiar("item/printed_book.png", RAIZ / "RP/textures/items/cl/arte/livro_impresso.png")

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["computercraft"] = sorted(set(todos.get("computercraft", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(C / "LICENSES/LicenseRef-CCPL.txt", RAIZ / "docs/licencas/computercraft.txt")
shutil.copyfile(C / "LICENSES/MPL-2.0.txt", RAIZ / "docs/licencas/cctweaked_mpl.txt")
print("cc:tweaked:", len(usados), "texturas")

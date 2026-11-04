# 1.46.0: Ex Nihilo: Sequentia (o mais novo, branch 1.21; NovaMachina, CC BY-NC-SA 4.0, inclusive a arte) para a fase 65:
# a tabela da peneira por malha (data/exnihilosequentia/recipe/sifting) em tools/dados/ens.json e a arte das malhas.
# Os pedaços de minério viram os do pack (do cascalho: quebrado; da areia: triturado; da poeira: em pó).
# Uso: python3 tools/importar-ens.py <clone do Ex Nihilo: Sequentia (1.21)>
import json, subprocess, sys
from io import BytesIO
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
E = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-ens.py <clone do Ex Nihilo: Sequentia>"))
ARVORE = subprocess.run(["git", "-C", str(E), "ls-tree", "-r", "--name-only", "HEAD"], capture_output=True, check=True, text=True).stdout.split()
EXISTE = {f"cl:{p.stem}" for p in (RAIZ / "BP/items").glob("*.json")}
ENTRADA = {"minecraft:dirt": "minecraft:dirt", "minecraft:gravel": "minecraft:gravel", "minecraft:sand": "minecraft:sand", "exnihilosequentia:dust": "cl:poeira"}
ESTAGIO = {"minecraft:gravel": "quebrado", "minecraft:sand": "triturado", "exnihilosequentia:dust": "po"}
METAL = {"iron": "ferro", "gold": "ouro", "copper": "cobre", "tin": "estanho", "aluminum": "aluminio", "osmium": "osmio", "zinc": "zinco"}
MALHAS = ["string", "flint", "iron", "diamond", "emerald", "netherite"]


def mostrar(p):
    return subprocess.run(["git", "-C", str(E), "show", f"HEAD:{p}"], capture_output=True, check=True).stdout


def item(res, entrada):
    i = res["id"]
    if i.endswith("_pieces") and i.startswith("exnihilosequentia:"):
        m = METAL.get(i.split(":")[1][: -len("_pieces")])
        est = ESTAGIO.get(entrada)
        alvo = f"cl:{m}_{est}" if m and est else None
        return alvo if alvo in EXISTE else None
    if i == "exnihilosequentia:pebble_stone":
        return "cl:pedrinha"
    return i if i.startswith("minecraft:") else None


tabela = {}
for p in ARVORE:
    if "/recipe/sifting/" not in p or not p.endswith(".json"):
        continue
    r = json.loads(mostrar(p))
    entrada = r.get("input") if isinstance(r.get("input"), str) else (r.get("input") or {}).get("item")
    if r.get("waterlogged") or entrada not in ENTRADA:
        continue
    alvo = item(r["result"], entrada)
    if not alvo:
        continue
    n = r["result"].get("count", 1)
    for rolo in r["rolls"]:
        tabela.setdefault(ENTRADA[entrada], {}).setdefault(rolo["mesh"], []).append([alvo, n, rolo["chance"]])
(RAIZ / "tools/dados/ens.json").write_text(json.dumps({"malhas": MALHAS, "peneira": tabela}, ensure_ascii=False, indent=1), encoding="utf-8")

ARTE = RAIZ / "RP/textures/items/cl/arte"
PT = {"string": "barbante", "flint": "silex", "iron": "ferro", "diamond": "diamante", "emerald": "esmeralda", "netherite": "netherita"}
usados = []
for m in MALHAS:
    p = next(x for x in ARVORE if x.endswith(f"textures/item/{m}_mesh.png"))
    Image.open(BytesIO(mostrar(p))).convert("RGBA").save(ARTE / f"malha_{PT[m]}.png")
    usados.append(f"malha_{PT[m]}")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["exnihilo_sequentia"] = sorted(set(todos.get("exnihilo_sequentia", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
(RAIZ / "docs/licencas/exnihilo_sequentia.txt").write_bytes(mostrar("LICENSE"))
print("ex nihilo sequentia:", {k: {m: len(v) for m, v in t.items()} for k, t in tabela.items()})

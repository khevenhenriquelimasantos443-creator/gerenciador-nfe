"""Monta docs/icones-todos/icones.json: todos os ícones do jogo (itens e blocos), com o mod, de onde veio o desenho e,
para os que você pediu ao ChatGPT e foram trocados depois, o desenho do ChatGPT (tirado do histórico do git).
A página docs/icones-todos/index.html lê esse arquivo. Não roda no build:
    python3 tools/listar-icones-todos.py
"""
import base64
import io
import json
import os
import re
import subprocess

from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAIZ_GIT = os.path.dirname(R)
PREF = "pouso-forcado/"
ARTE = "RP/textures/items/cl/arte/"
# Os pacotes do ChatGPT (tools/importar-icones.py): 0.20.1, 0.20.2, 1.2.3, 1.3.4 e 1.3.6.
CHATGPT = ["05087119", "7df5a4dd", "27426d9a", "41a57fac", "dc656dea"]
SAIDA = os.path.join(R, "docs/icones-todos")


def git(*a, binario=False):
    r = subprocess.run(["git", *a], cwd=RAIZ_GIT, capture_output=True)
    return r.stdout if binario else r.stdout.decode("utf8")


def b64(dados):
    """PNG pequeno (até 32x32, paleta) para a página carregar rápido no celular."""
    im = Image.open(io.BytesIO(dados)).convert("RGBA")
    if max(im.size) > 32:
        im.thumbnail((32, 32), Image.NEAREST if im.size[0] <= 64 else Image.LANCZOS)
    buf = io.BytesIO()
    im.quantize(colors=64, method=Image.FASTOCTREE).save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def ler(rel):
    p = os.path.join(R, rel)
    return open(p, "rb").read() if os.path.exists(p) else None


# ---- o que veio do ChatGPT e do AI Studio ----
chat = {}  # caminho relativo ao pacote -> (blob, commit)
for c in CHATGPT:
    for linha in git("diff-tree", "--no-commit-id", "-r", "--diff-filter=AM", c, "--", PREF + ARTE).splitlines():
        meta, caminho = linha.split("\t")
        chat[caminho[len(PREF):]] = meta.split()[3]
agora = {}
for linha in git("ls-tree", "-r", "HEAD", "--", PREF + ARTE).splitlines():
    meta, caminho = linha.split("\t")
    agora[caminho[len(PREF):]] = meta.split()[2]
aistudio = set()
for f in os.listdir(os.path.join(R, "tools/artes")):
    if f.endswith(".mjs"):
        for m in re.finditer(r'"?path"?:\s*"([^"]+)"', open(os.path.join(R, "tools/artes", f), encoding="utf8").read()):
            aistudio.add(m.group(1).replace("cl/c/", "cl/arte/"))

# ---- nomes e mods ----
ger = open(os.path.join(R, "scripts/conteudo/gerado.ts"), encoding="utf8").read()
ORIGEM = json.loads(re.search(r"export const ORIGEM_CONTEUDO[^=]*= (\{.*?\});", ger, re.S).group(1))
cat = open(os.path.join(R, "scripts/catalogo/gerado.ts"), encoding="utf8").read()
ITENS = json.loads(re.search(r"export const ITENS[^=]*= (\{.*?\n\});", cat, re.S).group(1))
tex = json.load(open(os.path.join(R, "RP/textures/item_texture.json"), encoding="utf8"))["texture_data"]


def origem(rel):
    if rel in aistudio:
        return "aistudio"
    if rel in chat and agora.get(rel) == chat[rel]:
        return "chatgpt"
    return "mod"


lista = []
vistos = set()
for f in sorted(os.listdir(os.path.join(R, "BP/items"))):
    d = json.load(open(os.path.join(R, "BP/items", f), encoding="utf8"))["minecraft:item"]
    iid = d["description"]["identifier"]
    if iid.startswith("cl:gui_"):
        continue
    ic = d["components"].get("minecraft:icon")
    chave = ic if isinstance(ic, str) else (ic or {}).get("texture") or ((ic or {}).get("textures") or {}).get("default")
    t = (tex.get(chave) or {}).get("textures")
    t = t if isinstance(t, str) else (t[0] if t else None)
    if not t:
        continue
    rel = "RP/" + t + ".png"
    png = ler(rel)
    if not png:
        continue
    nome = iid.split(":", 1)[1]
    mod = ORIGEM.get(iid) or ("Pam's HarvestCraft" if str(chave).startswith("clhc_") else "Pouso Forçado e outros")
    r = {"id": nome, "pt": ITENS.get(iid, {}).get("pt", nome), "mod": mod, "tipo": "item", "o": origem(rel), "png": b64(png)}
    if rel in chat and agora.get(rel) != chat[rel]:
        r["gpt"] = b64(git("cat-file", "blob", chat[rel], binario=True))
        r["o"] = "trocado" if r["o"] == "mod" else r["o"]
    lista.append(r)
    vistos.add(rel)

for f in sorted(os.listdir(os.path.join(R, "BP/blocks"))):
    d = json.load(open(os.path.join(R, "BP/blocks", f), encoding="utf8"))["minecraft:block"]
    bid = d["description"]["identifier"]
    nome = bid.split(":", 1)[1]
    info = ITENS.get(bid, {})
    if not info.get("icone"):
        continue
    rel = "RP/" + info["icone"] + ".png"
    png = ler(rel)
    if not png:
        continue
    r = {"id": nome, "pt": info.get("pt", nome), "mod": ORIGEM.get(bid, "Pouso Forçado e outros"), "tipo": "bloco", "o": origem(rel), "png": b64(png)}
    menu = ARTE + "blocos/" + nome + ".png"
    if menu in chat and agora.get(menu) != chat[menu]:
        r["gpt"] = b64(git("cat-file", "blob", chat[menu], binario=True))
        r["o"] = "trocado"
    lista.append(r)

os.makedirs(SAIDA, exist_ok=True)
with open(os.path.join(SAIDA, "icones.json"), "w", encoding="utf8") as fh:
    fh.write("[\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in lista) + "\n]\n")
from collections import Counter
print(len(lista), Counter(r["o"] for r in lista))

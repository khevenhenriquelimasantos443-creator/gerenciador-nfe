#!/usr/bin/env python3
"""1.31.0: copia a arte dos itens do Artifacts (Wouter Pauwels/ochotonida, MIT) para RP/textures/items/cl/arte/.

Uso: python3 tools/importar-artifacts.py <clone do github.com/ochotonida/artifacts>
Os nomes dos itens (os nossos, em português) vêm de tools/dados/conteudo/f50.mjs.
"""
import json, re, shutil, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
mod = Path(sys.argv[1])
tex = next(mod.glob("**/textures/item"))
f50 = (RAIZ / "tools/dados/conteudo/f50.mjs").read_text()
pares = re.findall(r'\["([a-z_]+)", "([a-z_]+)", "(?:cabeca|rosto|pescoco|cinto|maos|pes)"', f50)
pares += [("guarda_chuva", "umbrella"), ("almofada_pum", "whoopee_cushion"), ("carne_infinita", "everlasting_beef"), ("bife_eterno", "eternal_steak")]
dest = RAIZ / "RP/textures/items/cl/arte"
n = 0
usados = []
for nosso, deles in pares:
    src = tex / f"{deles}.png"
    if not src.exists():
        print("sem arte:", deles)
        continue
    shutil.copyfile(src, dest / f"{nosso}.png")
    n += 1
    usados.append(nosso)
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos["artifacts"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(next(mod.glob("LICENSE*")), RAIZ / "docs/licencas/artifacts.txt")
print(f"artifacts: {n} texturas")

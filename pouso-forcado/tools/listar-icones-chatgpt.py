"""1.59.1: o pedido ao AI Studio para refazer os ícones que ainda são os desenhados pelo ChatGPT (o filtro "ChatGPT" da
página docs/icones-todos). Lê docs/icones-todos/icones.json (rode antes tools/listar-icones-todos.py) e grava
docs/icones-chatgpt/LEIAME.md e parte-<n>.png (os ícones de hoje, numerados como na lista). Não roda no build:
    python3 tools/listar-icones-chatgpt.py
"""
import base64
import io
import json
import os
import re

from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(R, "docs/icones-chatgpt")
lista = [json.loads(l.rstrip(",\n")) for l in open(os.path.join(R, "docs/icones-todos/icones.json"), encoding="utf8") if l.startswith("{")]
cat = open(os.path.join(R, "scripts/catalogo/gerado.ts"), encoding="utf8").read()
ITENS = json.loads(re.search(r"export const ITENS[^=]*= (\{.*?\n\});", cat, re.S).group(1))
chat = [r for r in lista if r["o"] == "chatgpt"]
partes = [
    ("itens", "Itens", [r for r in chat if r["tipo"] == "item"]),
    ("blocos", "Blocos (ícone do Catálogo e dos menus)", [r for r in chat if r["tipo"] == "bloco"]),
]

os.makedirs(SAIDA, exist_ok=True)
fonte = ImageFont.load_default()
CEL, COLS = 56, 15
linhas = []
for n, (tipo, titulo, itens) in enumerate(partes, 1):
    img = Image.new("RGB", (COLS * CEL, ((len(itens) + COLS - 1) // COLS) * CEL), (52, 55, 62))
    d = ImageDraw.Draw(img)
    for i, r in enumerate(itens):
        x, y = (i % COLS) * CEL, (i // COLS) * CEL
        d.rectangle([x + 1, y + 1, x + CEL - 2, y + CEL - 2], fill=(84, 88, 96))
        ic = Image.open(io.BytesIO(base64.b64decode(r["png"].split(",", 1)[1]))).convert("RGBA").resize((40, 40), Image.NEAREST)
        img.paste(ic, (x + 8, y + 2), ic)
        d.text((x + 3, y + 43), str(i + 1), fill=(255, 226, 120), font=fonte)
    img.save(os.path.join(SAIDA, f"parte-{n}.png"))
    pasta = "RP/textures/items/cl/arte/" if tipo == "itens" else "RP/textures/items/cl/arte/blocos/"
    linhas.append(f"\n## Parte {n} de {len(partes)}: {titulo} ({len(itens)} ícones)\n")
    linhas.append(f"Ícones de hoje: `parte-{n}.png` (o número embaixo de cada um é o da lista). `path`: `{pasta}<arquivo>`.\n")
    linhas.append("| # | arquivo | nome no jogo | nome original (inglês) | mod |")
    linhas.append("|---|---|---|---|---|")
    for i, r in enumerate(itens, 1):
        en = ITENS.get(f"cl:{r['id']}", {}).get("en", "")
        linhas.append(f"| {i} | `{r['id']}.png` | {r['pt']} | {en} | {r['mod']} |")

cab = f"""# Pouso Forçado: ícones do ChatGPT para refazer ({len(chat)} ícones, {len(partes)} partes)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Estes ícones ainda são os que o
ChatGPT desenhou no começo do projeto (o filtro "ChatGPT" da lista de todos os ícones) e precisam ficar no mesmo estilo
das artes novas do AI Studio.

## O que pedir (mande uma parte por vez)
Faça um script Node.js (`.mjs`) igual ao das artes aprovadas: uma lista `ARTES` com `{{ "path", "base64" }}` e um laço que
grava cada PNG. Para cada ícone da parte:
- **Parte 1 (itens):** `path`: `RP/textures/items/cl/arte/<arquivo>`; `base64`: PNG **16×16**, fundo transparente.
- **Parte 2 (blocos):** `path`: `RP/textures/items/cl/arte/blocos/<arquivo>`; `base64`: PNG **32×32**, fundo
  transparente, o bloco em 3D isométrico (como aparece no inventário: topo e dois lados, o da esquerda mais claro).
  Esse ícone aparece no Catálogo e nos menus; no inventário o bloco continua com as faces dele.
- O nome do arquivo é o da tabela, sem mudar nada: é o ID no jogo.

## Estilo (o mesmo das artes aprovadas do AI Studio)
- Pixel art do Minecraft, legível no celular: silhueta clara, contorno escuro de 1 px, luz de cima à esquerda.
- Poucas cores por ícone, sem anti-aliasing e sem pixel semitransparente na borda.
- Coisas da mesma família ficam com a mesma forma e mudam só a cor (todas as células de energia iguais com a cor do
  nível, todos os barris iguais...), como nos mods.
- Comida do HarvestCraft: desenhe o prato de verdade pelo nome em inglês, que é o do mod.
- Máquinas: a frente com o detalhe da máquina (tela, engrenagem, chama...) e os lados em metal.
- Não use nem copie a arte original do mod: desenho próprio que só lembra o original.

## Regras
- Não renomear arquivos nem IDs (quebraria os mundos salvos).
- Responda só com o script, em um bloco de código, sem explicação.
"""
open(os.path.join(SAIDA, "LEIAME.md"), "w", encoding="utf8").write(cab + "\n".join(linhas) + "\n")
print(f"{len(chat)} ícones do ChatGPT em {len(partes)} partes: " + ", ".join(f"{t} {len(i)}" for _, t, i in partes))

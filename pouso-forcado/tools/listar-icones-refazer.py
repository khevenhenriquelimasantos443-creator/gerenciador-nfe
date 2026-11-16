# 1.55.0: lista os ícones de item que ainda são desenho gerado por código (os "antigos e estranhos") para pedir arte
# nova no Google AI Studio, no mesmo formato das artes aprovadas (tools/artes/*.mjs: PNG 16x16 em base64).
#   python3 tools/listar-icones-refazer.py
# Grava docs/icones-refazer/LEIAME.md (o pedido, com a lista em partes) e docs/icones-refazer/parte-<n>.png (os ícones
# de hoje, numerados como na lista). Não roda no build.
# Grupos:
#   1. ícones gerados pelo build (RP/textures/items/cl/c/): pó, chapa, cilindro, balde, molde... feitos por fórmula;
#   2. HarvestCraft 2 (RP/textures/items/cl/hc/): comidas, sementes e plantas feitas por fórmula (a arte do mod é fechada);
#   3. desenhados por script em Python (tools/desenhar-similares.py e desenhar-xu2.py): balões, regador, laços...
# Fora da lista: arte original dos mods (licença permite), arte do Tinkers pintada com as paletas do mod e as 114
# artes aprovadas.
import json, os, re, shutil, subprocess, sys, tempfile
from PIL import Image, ImageChops, ImageDraw, ImageFont

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SAIDA = os.path.join(R, "docs/icones-refazer")
POR_PARTE = 105


def itens_catalogo():
    s = open(os.path.join(R, "scripts/catalogo/gerado.ts"), encoding="utf8").read()
    a = s.index("export const ITENS")
    b = s.index("export const RECEITAS_JSON")
    return json.loads(s[s.index("{", a): s.rindex("}", a, b) + 1])


def icone_para_item():
    m = {}
    pasta = os.path.join(R, "BP/items")
    for f in os.listdir(pasta):
        if not f.endswith(".json"):
            continue
        j = json.load(open(os.path.join(pasta, f), encoding="utf8"))["minecraft:item"]
        ic = j["components"].get("minecraft:icon")
        k = ic if isinstance(ic, str) else (ic or {}).get("texture") or ((ic or {}).get("textures") or {}).get("default")
        if k:
            m[k] = j["description"]["identifier"]
    return m


def desenhados_por_script():
    """Roda os dois desenhistas numa pasta temporária e vê quais ícones de hoje são iguais ao que eles desenham."""
    t = tempfile.mkdtemp()
    try:
        os.makedirs(f"{t}/sim"); os.makedirs(f"{t}/xu2i"); os.makedirs(f"{t}/xu2b")
        s = open(os.path.join(R, "tools/desenhar-similares.py"), encoding="utf8").read()
        open(f"{t}/sim.py", "w").write(re.sub(r"^SAIDA = .*$", f"SAIDA = {t + '/sim'!r}", s, flags=re.M))
        s = open(os.path.join(R, "tools/desenhar-xu2.py"), encoding="utf8").read()
        s = re.sub(r"^B = .*$", f"B = __import__('pathlib').Path({t + '/xu2b'!r})", s, flags=re.M)
        s = re.sub(r"^I = .*$", f"I = __import__('pathlib').Path({t + '/xu2i'!r})", s, flags=re.M)
        open(f"{t}/xu2.py", "w").write(s)
        for p in ("sim.py", "xu2.py"):
            subprocess.run([sys.executable, "-I", p], cwd=t, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        iguais = set()
        for sub in ("sim", "xu2i"):
            for f in os.listdir(f"{t}/{sub}"):
                atual = os.path.join(R, "RP/textures/items/cl/arte", f)
                if not os.path.exists(atual):
                    continue
                a = Image.open(f"{t}/{sub}/{f}").convert("RGBA")
                b = Image.open(atual).convert("RGBA")
                if a.size == b.size and ImageChops.difference(a, b).getbbox() is None:
                    iguais.add(f[:-4])
        return iguais
    finally:
        shutil.rmtree(t, ignore_errors=True)


def main():
    tex = json.load(open(os.path.join(R, "RP/textures/item_texture.json"), encoding="utf8"))["texture_data"]
    itens = itens_catalogo()
    ic2id = icone_para_item()
    script = desenhados_por_script()
    grupos = {"gerado": [], "hc": [], "script": []}
    for chave, v in sorted(tex.items()):
        t = v["textures"] if isinstance(v["textures"], str) else v["textures"][0]
        item = ic2id.get(chave)
        if not item:
            continue
        nome = item.split(":", 1)[1]
        g = "gerado" if "/cl/c/" in t else "hc" if "/cl/hc/" in t else "script" if t.endswith(f"/cl/arte/{nome}") and nome in script else None
        if g:
            info = itens.get(item, {})
            grupos[g].append({"id": nome, "pt": info.get("pt", nome), "en": info.get("en", ""), "png": os.path.join(R, "RP", t + ".png")})
    # partes: os gerados, depois o HarvestCraft, depois os do script
    partes = []
    for g, titulo in (("gerado", "ícones gerados pelo build"), ("hc", "Pam's HarvestCraft 2"), ("script", "desenhados por script")):
        lista = grupos[g]
        if not lista:
            continue
        n = -(-len(lista) // POR_PARTE)  # partes do mesmo tamanho, até POR_PARTE cada
        tam = -(-len(lista) // max(1, n))
        for i in range(0, len(lista), tam):
            partes.append((titulo, lista[i: i + tam]))
    os.makedirs(SAIDA, exist_ok=True)
    for f in os.listdir(SAIDA):
        if f.startswith("parte-") and f.endswith(".png"):
            os.remove(os.path.join(SAIDA, f))
    fonte = ImageFont.load_default()
    CEL, COLS = 56, 15
    linhas = []
    total = sum(len(p[1]) for p in partes)
    for n, (titulo, lista) in enumerate(partes, 1):
        img = Image.new("RGB", (COLS * CEL, ((len(lista) + COLS - 1) // COLS) * CEL), (52, 55, 62))
        d = ImageDraw.Draw(img)
        for i, it in enumerate(lista):
            x, y = (i % COLS) * CEL, (i // COLS) * CEL
            d.rectangle([x + 1, y + 1, x + CEL - 2, y + CEL - 2], fill=(84, 88, 96))
            ic = Image.open(it["png"]).convert("RGBA").resize((40, 40), Image.NEAREST)
            img.paste(ic, (x + 8, y + 2), ic)
            d.text((x + 3, y + 43), str(i + 1), fill=(255, 226, 120), font=fonte)
        img.save(os.path.join(SAIDA, f"parte-{n}.png"))
        linhas.append(f"\n## Parte {n} de {len(partes)}: {titulo} ({len(lista)} ícones)\n")
        linhas.append(f"Ícones de hoje: `parte-{n}.png` (o número embaixo de cada um é o da lista).\n")
        linhas.append("| # | arquivo | nome no jogo | nome original (inglês) |")
        linhas.append("|---|---|---|---|")
        for i, it in enumerate(lista, 1):
            linhas.append(f"| {i} | `{it['id']}.png` | {it['pt']} | {it['en']} |")
    cab = f"""# Pouso Forçado: ícones para refazer ({total} ícones, {len(partes)} partes)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Estes ícones de item ainda são
**desenho gerado por fórmula** (pó, chapa, cilindro, comida...) e ficaram genéricos ou estranhos. O resto dos ícones é a
arte original dos mods ou arte já aprovada e **não** entra aqui.

## O que pedir (mande uma parte por vez)
Faça um script Node.js (`.mjs`) igual ao das artes aprovadas: uma lista `ARTES` com `{{ "path", "base64" }}` e um laço que
grava cada PNG. Para cada ícone da parte:
- `path`: `RP/textures/items/cl/arte/<arquivo>` (o nome do arquivo da tabela, sem mudar nada: é o ID do item no jogo);
- `base64`: PNG **16×16**, fundo transparente.

## Estilo (o mesmo das 114 artes aprovadas)
- Pixel art de item do Minecraft, 16×16, legível no celular: silhueta clara, contorno escuro de 1 px, luz de cima à esquerda.
- Poucas cores por ícone, sem anti-aliasing e sem pixel semitransparente na borda.
- Coisas da mesma família ficam com a mesma forma e mudam só a cor (todos os cilindros iguais com a cor do conteúdo,
  todos os baldes iguais, todos os pós iguais...), como nos mods.
- Comida do HarvestCraft: desenhe o prato de verdade (torta, sanduíche, suco no copo, semente no pacotinho...) pelo nome
  em inglês, que é o do mod.
- Não use nem copie a arte original do mod (é fechada): desenho próprio que só lembra o original.

## Regras
- Não renomear arquivos nem IDs (quebraria os mundos salvos).
- Responda só com o script, em um bloco de código, sem explicação.
"""
    open(os.path.join(SAIDA, "LEIAME.md"), "w", encoding="utf8").write(cab + "\n".join(linhas) + "\n")
    print(f"ícones para refazer: {total} em {len(partes)} partes ({', '.join(f'{k}={len(v)}' for k, v in grupos.items())})")


main()

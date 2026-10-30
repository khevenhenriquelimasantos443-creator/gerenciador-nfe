# Monta a wiki do modpack (docs/wiki/wiki.html) a partir de docs/wiki/wiki.fonte.html:
# - "@icone/<caminho>" vira o PNG embutido de RP/textures/items/cl/<caminho>.png (ícones do próprio pack);
# - "@img/<nome>" vira uma imagem do jogo embutida: o logo do menu (PNG), o fundo da troca de dimensão e as
#   faces do panorama (JPEG).
# Tudo fica dentro de um arquivo só, para abrir no celular e publicar como página. Roda à mão depois de mudar
# a fonte ou as imagens (precisa de Python + Pillow):
#   python3 tools/gerar-wiki.py
import base64, io, os, re
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FONTE = os.path.join(R, "docs/wiki/wiki.fonte.html")
SAIDA = os.path.join(R, "docs/wiki/wiki.html")
PANORAMA = os.path.join(R, "RP_menu/textures/ui")


def jpeg(im, largura, qualidade=82):
    im = im.convert("RGB")
    if im.width > largura:
        im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=qualidade, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def foto(nome):
    if nome == "logo":  # o logo do menu, com fundo transparente
        return "data:image/png;base64," + base64.b64encode(open(os.path.join(PANORAMA, "title.png"), "rb").read()).decode()
    if nome == "fundo":
        return jpeg(Image.open(os.path.join(R, "RP/textures/ui/cl/fundo_carregamento.png")), 1280)
    m = re.fullmatch(r"pano(\d)", nome)
    if m:  # faixa do meio de uma face do panorama (o horizonte)
        im = Image.open(os.path.join(PANORAMA, f"panorama_{m.group(1)}.png"))
        n = im.width
        return jpeg(im.crop((0, n // 4, n, n * 3 // 4)), 640)
    raise SystemExit(f"gerar-wiki: imagem desconhecida @img/{nome}")


def icone(caminho):
    arq = os.path.join(R, "RP/textures/items/cl", caminho + ".png")
    if not os.path.exists(arq):
        raise SystemExit(f"gerar-wiki: falta o ícone {arq}")
    return "data:image/png;base64," + base64.b64encode(open(arq, "rb").read()).decode()


def main():
    texto = open(FONTE, encoding="utf-8").read()
    cache = {}

    def troca(m):
        chave = m.group(0)
        if chave not in cache:
            cache[chave] = icone(m.group(2)) if m.group(1) == "icone" else foto(m.group(2))
        return cache[chave]

    texto = re.sub(r"@(icone|img)/([a-z0-9_/]+)", troca, texto)
    open(SAIDA, "w", encoding="utf-8").write(texto)
    print(f"wiki: {len(cache)} imagens, {os.path.getsize(SAIDA) // 1024} KB em docs/wiki/wiki.html")


if __name__ == "__main__":
    main()

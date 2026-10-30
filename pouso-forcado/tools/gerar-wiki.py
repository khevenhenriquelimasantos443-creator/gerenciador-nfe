# Monta a wiki do modpack a partir de docs/wiki/wiki.fonte.html, em duas saídas:
# - docs/wiki/wiki.html: a página publicada como Artifact (sem <html>/<head>, que o Artifact põe); os botões de
#   download apontam para os arquivos no GitHub;
# - docs/wiki/site/index.html: o site da Vercel (documento completo e leve): as imagens e os downloads vêm
#   direto deste repositório no GitHub (que é público); as fotos do jogo ficam em docs/wiki/site/img/.
#   Na Vercel vão só ele e o vercel.json (endereços curtos /baixar e /mundo). Ver "Wiki" no README.
# Trocas na fonte:
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
SITE = os.path.join(R, "docs/wiki/site/index.html")
GITHUB = "https://github.com/khevenhenriquelimasantos443-creator/gerenciador-nfe/raw/claude/dazzling-bell-twympv/pouso-forcado/dist/"
RAW = "https://raw.githubusercontent.com/khevenhenriquelimasantos443-creator/gerenciador-nfe/claude/dazzling-bell-twympv/pouso-forcado/"
IMG_SITE = os.path.join(R, "docs/wiki/site/img")
ARQUIVOS = {"mcaddon": "pouso-forcado.mcaddon", "mcworld": "pouso-forcado.mcworld"}
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


def versao():
    m = re.search(r'VERSAO = "([0-9.]+)"', open(os.path.join(R, "scripts/config.ts"), encoding="utf-8").read())
    return m.group(1)


def tamanho(chave):
    mb = os.path.getsize(os.path.join(R, "dist", ARQUIVOS[chave])) / 1024 / 1024
    return f"{mb:.1f} MB".replace(".", ",")


def endereco(tipo, nome):
    """No site, a imagem vem do GitHub: os ícones e o logo estão no pack; as fotos são salvas em JPEG aqui."""
    if tipo == "icone":
        return RAW + f"RP/textures/items/cl/{nome}.png"
    if nome == "logo":
        return RAW + "RP_menu/textures/ui/title.png"
    os.makedirs(IMG_SITE, exist_ok=True)
    dados = base64.b64decode(foto(nome).split(",", 1)[1])
    open(os.path.join(IMG_SITE, f"{nome}.jpg"), "wb").write(dados)
    return RAW + f"docs/wiki/site/img/{nome}.jpg"


def montar(base_download, embutir=True):
    texto = open(FONTE, encoding="utf-8").read()
    cache = {}

    def troca(m):
        chave = m.group(0)
        if chave not in cache:
            if not embutir:
                cache[chave] = endereco(m.group(1), m.group(2))
            else:
                cache[chave] = icone(m.group(2)) if m.group(1) == "icone" else foto(m.group(2))
        return cache[chave]

    texto = re.sub(r"@(icone|img)/([a-z0-9_/]+)", troca, texto)
    texto = re.sub(r"@baixar/(\w+)", lambda m: base_download + ARQUIVOS[m.group(1)], texto)
    texto = re.sub(r"@tamanho/(\w+)", lambda m: tamanho(m.group(1)), texto)
    return texto.replace("@versao", versao()), len(cache)


def main():
    texto, n = montar(GITHUB)
    open(SAIDA, "w", encoding="utf-8").write(texto)
    # O site: o mesmo conteúdo num documento completo (o cabeçalho é tudo até o fim do <style>).
    texto, _ = montar(GITHUB, embutir=False)
    corte = texto.index("</style>") + len("</style>")
    favicon = RAW + "RP/textures/items/cl/arte/diario_bordo.png"
    site = (
        '<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="Guia e download do Pouso Forçado, modpack de sobrevivência no deserto para Minecraft Bedrock.">\n'
        f'<link rel="icon" href="{favicon}">\n'
        "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}"
        "body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n"
        + texto[:corte] + "\n</head>\n<body>\n" + texto[corte:] + "\n</body>\n</html>\n"
    )
    # Enxuto (sem comentários nem recuo): o arquivo vai inteiro no pedido de publicação da Vercel.
    site = re.sub(r"<!--.*?-->", "", site, flags=re.S)
    site = "\n".join(l.strip() for l in site.splitlines() if l.strip()) + "\n"
    os.makedirs(os.path.dirname(SITE), exist_ok=True)
    open(SITE, "w", encoding="utf-8").write(site)
    print(f"wiki: {n} imagens; {os.path.getsize(SAIDA) // 1024} KB em docs/wiki/wiki.html e site em docs/wiki/site/index.html")


if __name__ == "__main__":
    main()

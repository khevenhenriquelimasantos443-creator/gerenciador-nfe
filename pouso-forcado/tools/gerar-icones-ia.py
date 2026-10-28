# Gera pela API de imagens da OpenAI os ícones e texturas que faltam de uma parte da lista
# (docs/prompt-icones-faltando.md, "## LISTA, parte N") e monta o mesmo pacote que o ChatGPT entregava:
#   <saída>/itens/<id>.png          A: 128x128 transparente (desenho de 32x32 ampliado 4x)
#   <saída>/blocos_menu/<id>.png    B: 128x128 transparente, isométrico (blocos "máquina")
#   <saída>/blocos_faces/<nome>.png C: 32x32 opaco (máquina: _frente/_lado/_topo/_baixo; cubo e modelo: <nome>)
#   <saída>/manifesto.csv e prancha.png (revisão)
# Depois é só importar como os outros: python3 tools/importar-icones.py <saída>
#
# A chave da OpenAI fica num segredo de rede do ambiente (Bearer para api.openai.com, caminho /v1/images/): o proxy
# a põe no pedido e o script nunca a vê. Se houver OPENAI_API_KEY no ambiente, ela é usada no lugar. Modelo e qualidade:
# OPENAI_IMAGE_MODEL (padrão gpt-image-1) e OPENAI_IMAGE_QUALITY (padrão medium). As respostas cruas ficam em
# <saída>/cru/: rodar de novo não paga de novo o que já veio. Precisa de Python + Pillow.
#   python3 tools/gerar-icones-ia.py 3 <saída>          (parte 3)
#   python3 tools/gerar-icones-ia.py 4 <saída> --seco   (só mostra o que pediria e quantas imagens)
import base64, csv, json, os, re, ssl, sys, time, urllib.error, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DOC = os.path.join(R, "docs/prompt-icones-faltando.md")
MODELO = os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1")
QUALIDADE = os.environ.get("OPENAI_IMAGE_QUALITY", "medium")

# Estilo: o mesmo texto que foi para o ChatGPT (seção "Estilo" do prompt), mais o que a API precisa saber.
def estilo():
    s = open(DOC, encoding="utf8").read()
    a = s.index("**Estilo:**")
    b = s.index("### O que entregar")
    texto = s[a:b].replace("use **exatamente o estilo da prancha em anexo**", "pixel art no estilo dos ícones do Minecraft")
    texto = re.sub(r"dos melhores da prancha \([^)]*\)", "de um resource pack caprichado", texto)
    return re.sub(r"\*\*", "", texto).strip()


def lista(parte):
    """Linhas da tabela da parte: (tipo, nome, rotulo, descrição). tipo: item, maquina, cubo."""
    s = open(DOC, encoding="utf8").read()
    a = s.index(f"## LISTA, parte {parte}")
    b = s.find("\n## ", a + 5)
    sec = s[a:b if b > 0 else len(s)]
    tipo, saida = None, []
    for linha in sec.splitlines():
        if linha.startswith("**"):
            t = linha.lower()
            tipo = "item" if "itens" in t else "maquina" if "máquina" in t else "cubo"
            continue
        if not linha.startswith("| ") or linha.startswith("| Arquivo") or linha.startswith("|---"):
            continue
        c = [x.strip() for x in linha.strip().strip("|").split("|")]
        saida.append((tipo, c[0].replace(".png", ""), c[1], c[2]))
    return saida


def pedido(parte, tipo, nome, rotulo, desc):
    """(arquivo cru, prompt, fundo) de cada imagem a pedir."""
    base = f"Add-on de Minecraft Bedrock 'Pouso Forçado' (nave caída num planeta de deserto). Objeto: {rotulo}. Aparência: {desc}.\n{estilo()}\n"
    proibido = "Sem texto, letras ou números; sem moldura, grade ou borda de cartão; sem sombra no chão; sem cenário."
    if tipo == "item":
        return [(f"{nome}.png", base + "Desenhe UM ícone de ITEM: um objeto só, centralizado, ocupando uns 80% do quadro, com margem, nada cortado. "
                 "Vista de lado/3-4 como os itens do Minecraft. Fundo 100% transparente. " + proibido, "transparent")]
    if tipo == "maquina":
        return [
            (f"{nome}.menu.png", base + "Desenhe o ícone de MENU deste bloco: um cubo em vista isométrica (frente-esquerda e frente-direita visíveis, topo por cima), "
             "centralizado, com margem, fundo 100% transparente. " + proibido, "transparent"),
            (f"{nome}.faces.png", base + "Desenhe uma folha 2x2 com as 4 FACES planas deste bloco, vistas de frente (sem perspectiva), cada uma ocupando exatamente um quarto "
             "da imagem, encostadas, sem espaço nem linha entre elas: em cima à esquerda a FRENTE (com o detalhe principal), em cima à direita a LATERAL, embaixo "
             "à esquerda o TOPO, embaixo à direita a BASE. Mesma paleta e detalhes nas quatro, com borda de metal. Opaco, sem transparência. " + proibido, "opaque"),
        ]
    return [(f"{nome}.png", base + "Desenhe UMA textura de face de bloco do Minecraft: quadrada, plana, vista de frente, cobrindo a imagem inteira de borda a borda, "
             "opaca e emendável (a borda da esquerda continua na da direita, a de cima na de baixo). " + proibido, "opaque")]


def chamar(prompt, fundo, chave=None):
    corpo = json.dumps({"model": MODELO, "prompt": prompt, "size": "1024x1024", "quality": QUALIDADE,
                        "background": fundo, "output_format": "png", "n": 1}).encode()
    req = urllib.request.Request("https://api.openai.com/v1/images/generations", data=corpo,
                                 headers={"Content-Type": "application/json", **({"Authorization": f"Bearer {chave}"} if chave else {})})
    ctx = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or None)
    for tentativa in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300, context=ctx) as r:
                return base64.b64decode(json.load(r)["data"][0]["b64_json"])
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and tentativa < 3:
                time.sleep(10 * (tentativa + 1))
                continue
            if e.code == 401:
                raise RuntimeError("API 401: a chave não chegou ou é inválida (segredo de rede Bearer para api.openai.com, caminho /v1/images/)")
            raise RuntimeError(f"API {e.code}: {msg}")
    raise RuntimeError("API sem resposta")


# ---------- acabamento ----------
def quadrado(im, margem=0.1):
    """Recorta o desenho (pelo alfa) e centraliza num quadrado com margem."""
    caixa = im.getchannel("A").point(lambda a: 255 if a > 24 else 0).getbbox() or (0, 0, im.width, im.height)
    im = im.crop(caixa)
    lado = int(max(im.size) * (1 + 2 * margem))
    q = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    q.alpha_composite(im, ((lado - im.width) // 2, (lado - im.height) // 2))
    return q


def item(cru):
    p = quadrado(Image.open(cru).convert("RGBA")).resize((32, 32), Image.LANCZOS)
    p.putalpha(p.getchannel("A").point(lambda a: 255 if a >= 110 else 0))  # pixel art: alfa 0 ou 255
    return p.resize((128, 128), Image.NEAREST)


def menu(cru):
    return quadrado(Image.open(cru).convert("RGBA"), 0.06).resize((128, 128), Image.LANCZOS)


def face(im):
    w, h = im.size
    m = int(min(w, h) * 0.02)  # tira a beirada (às vezes vem uma linha)
    return im.crop((m, m, w - m, h - m)).convert("RGB").resize((32, 32), Image.BOX).convert("RGBA")


def faces(cru):
    im = Image.open(cru).convert("RGB")
    w, h = im.size
    q = {"frente": (0, 0), "lado": (1, 0), "topo": (0, 1), "baixo": (1, 1)}
    return {k: face(im.crop((x * w // 2, y * h // 2, (x + 1) * w // 2, (y + 1) * h // 2))) for k, (x, y) in q.items()}


def prancha(arquivos, destino):
    col, cel = 6, 150
    linhas = (len(arquivos) + col - 1) // col
    p = Image.new("RGBA", (col * cel, linhas * cel), (30, 34, 40, 255))
    d = ImageDraw.Draw(p)
    for i, (pasta, nome) in enumerate(arquivos):
        im = Image.open(os.path.join(destino, pasta, nome)).convert("RGBA").resize((112, 112), Image.NEAREST)
        x, y = (i % col) * cel, (i // col) * cel
        p.alpha_composite(im, (x + 19, y + 6))
        d.text((x + 6, y + 126), nome[:24], fill=(220, 220, 220, 255))
    p.save(os.path.join(destino, "prancha.png"))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 2:
        sys.exit(__doc__ or "uso: python3 tools/gerar-icones-ia.py <parte> <saída> [--seco]")
    parte, destino = args
    seco = "--seco" in sys.argv
    linhas = lista(parte)
    pedidos = [(t, n, *p) for t, n, rot, desc in linhas for p in pedido(parte, t, n, rot, desc)]
    print(f"parte {parte}: {len(linhas)} da lista, {len(pedidos)} imagens a pedir ({MODELO}, {QUALIDADE})")
    if seco:
        for t, n, arq, prompt, fundo in pedidos:
            print(f"  {t:8s} {arq}")
        print(f"\nexemplo de prompt ({pedidos[0][2]}):\n{pedidos[0][3]}")
        return
    chave = os.environ.get("OPENAI_API_KEY")  # sem ela, vale o segredo de rede do ambiente
    for pasta in ("cru", "itens", "blocos_menu", "blocos_faces"):
        os.makedirs(os.path.join(destino, pasta), exist_ok=True)

    def baixar(p):
        t, n, arq, prompt, fundo = p
        cru = os.path.join(destino, "cru", arq)
        if not os.path.exists(cru):
            open(cru, "wb").write(chamar(prompt, fundo, chave))
            print(f"  ok {arq}", flush=True)
        return p

    erros = []
    with ThreadPoolExecutor(3) as ex:
        for f in [ex.submit(baixar, p) for p in pedidos]:
            try:
                f.result()
            except Exception as e:  # segue com os outros; o que falhou sai no fim
                erros.append(str(e))
    feitos = []
    for t, n, arq, prompt, fundo in pedidos:
        cru = os.path.join(destino, "cru", arq)
        if not os.path.exists(cru):
            continue
        if t == "item":
            item(cru).save(os.path.join(destino, "itens", f"{n}.png"))
            feitos.append(("itens", f"{n}.png"))
        elif arq.endswith(".menu.png"):
            menu(cru).save(os.path.join(destino, "blocos_menu", f"{n}.png"))
            feitos.append(("blocos_menu", f"{n}.png"))
        elif arq.endswith(".faces.png"):
            for k, im in faces(cru).items():
                im.save(os.path.join(destino, "blocos_faces", f"{n}_{k}.png"))
                feitos.append(("blocos_faces", f"{n}_{k}.png"))
        else:
            face(Image.open(cru)).save(os.path.join(destino, "blocos_faces", f"{n}.png"))
            feitos.append(("blocos_faces", f"{n}.png"))
    with open(os.path.join(destino, "manifesto.csv"), "w", newline="", encoding="utf8") as f:
        w = csv.writer(f)
        w.writerow(["arquivo", "pasta", "tipo", "parte"])
        for pasta, nome in feitos:
            w.writerow([nome, pasta, {"itens": "item", "blocos_menu": "menu", "blocos_faces": "face"}[pasta], parte])
    if feitos:
        prancha(feitos, destino)
    print(f"pronto: {len(feitos)} arquivos em {destino}")
    for e in erros:
        print(f"  ERRO: {e}")


if __name__ == "__main__":
    main()

# Monta a página nova do Pouso Forçado (landing + wiki) a partir de docs/wiki/nova/modelo.html.
# Tudo fica dentro de um arquivo só (imagens em data: URI, dados dos capítulos em JSON), sem pedir nada à internet além das fontes.
# Saídas:
#   docs/wiki/nova/index.html          documento completo (para publicar no site)
#   --fragmento <arquivo>              só o conteúdo, sem <html>/<head>/<body> (para publicar como Artifact)
# Os números (capítulos, missões, itens...), a versão, o tamanho do .mcaddon e os capítulos vêm dos arquivos do projeto.
# Uso: python3 tools/gerar-pagina-nova.py [--fragmento caminho]   (precisa de Pillow)
import base64, io, json, math, re, sys
from pathlib import Path
from PIL import Image

R = Path(__file__).resolve().parent.parent
PAGINA = R / "docs/wiki/nova"
REPO = "https://github.com/khevenhenriquelimasantos443-creator/gerenciador-nfe"
RAMO = "claude/dazzling-bell-twympv"


def uri(dados: bytes, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(dados).decode()


def jpeg(im: Image.Image, largura: int, q: int) -> str:
    im = im.convert("RGB")
    im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
    return uri(b.getvalue(), "image/jpeg")


def webp(im: Image.Image, largura: int) -> str:
    im = im.convert("RGBA")
    im = im.resize((largura, round(im.height * largura / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "WEBP", quality=88, method=6)
    return uri(b.getvalue(), "image/webp")


def icone(nome: str) -> str:
    return uri((R / f"RP/textures/items/cl/arte/{nome}.png").read_bytes(), "image/png")


# ---- números e versão ----
versao = re.search(r'VERSAO = "([\d.]+)"', (R / "scripts/config.ts").read_text(encoding="utf-8")).group(1)
mcaddon = R / "dist/pouso-forcado.mcaddon"
tamanho_mb = max(1, round(mcaddon.stat().st_size / 1e6)) if mcaddon.exists() else 32
lista = (R / "scripts/missoes/lista.ts").read_text(encoding="utf-8")
missoes = len(re.findall(r"objetivo:", lista))
itens = len({m for p in list((R / "BP/items").glob("*.json")) + list((R / "BP/blocks").glob("*.json")) for m in re.findall(r'"identifier":\s*"(cl:[^"]+)"', p.read_text(encoding="utf-8"))[:1]})
receitas = len(list((R / "BP/recipes").glob("*.json")))
piso = lambda n, passo: f"{(n // passo) * passo:,}".replace(",", ".")

# ---- textos do jogo ----
lang = {}
for l in (R / "RP/texts/pt_BR.lang").read_text(encoding="utf-8").splitlines():
    if "=" in l and not l.startswith("#"):
        k, v = l.split("=", 1); lang[k] = v
limpa = lambda s: re.sub(r"§.", "", s).replace("\\n", " ").strip()
CATEGORIAS = {
    "inicio": ("Primeiros dias", "chegada maquinas nihilo comida enviromine harvestcraft farmers farmers2 extras equipamento"),
    "mundo": ("Mundo e perigos", "exploracao deserto"),
    "energia": ("Energia e indústria", "energia powah thermal thermal11 enderio ie ie12 buildcraft bc8 reator extreme create mekanism mekanism_extra additions"),
    "automacao": ("Automação e logística", "mfr pneumatic cct sync armazenamento gavetas utilidades waystones2 xu2"),
    "fundicao": ("Fundição e equipamento", "tinkers tinkers3 fundicao fundicao2 mochilas jetpacks artefatos"),
    "construcao": ("Construção e transporte", "decoracao quark quark4 aircraft"),
    "espaco": ("Nave e espaço", "nave galacticraft final"),
}
cat_de = {c: k for k, (_, ids) in CATEGORIAS.items() for c in ids.split()}
ids = sorted({k.split(".")[2] for k in lang if k.startswith("cl.capitulo.")})
assert all(i in cat_de for i in ids), [i for i in ids if i not in cat_de]
ordem = [c for _, (_, ids_) in CATEGORIAS.items() for c in ids_.split() if c in ids]
capitulos = [{"id": c, "nome": limpa(lang[f"cl.capitulo.{c}.nome"]), "desc": limpa(lang[f"cl.capitulo.{c}.desc"]), "cat": cat_de[c]} for c in ordem]

# ---- novidades (títulos do README) ----
novidades = []
for m in re.finditer(r"^## Novidades da ([\d.]+) \((.+)\)\s*$", (R / "README.md").read_text(encoding="utf-8"), re.M):
    novidades.append({"v": m.group(1), "t": m.group(2)[0].upper() + m.group(2)[1:]})
novidades = novidades[:9]

# ---- imagens ----
tiles = [Image.open(R / f"RP_menu/textures/ui/panorama_{i}.png").convert("RGB") for i in range(6)]
faixa = Image.new("RGB", (1024 * 3, 640))
for i in range(3):
    faixa.paste(tiles[i].crop((0, 0, 1024, 640)), (i * 1024, 0))
ruinas = tiles[3].crop((0, 20, 1024, 560))
logo = Image.open(R / "RP_menu/textures/ui/title.png")
bb = logo.getbbox(); logo = logo.crop(bb)

troca = {
    "{{VERSAO}}": versao, "{{TAMANHO_MB}}": str(tamanho_mb),
    "{{N_CAPITULOS}}": str(len(capitulos)), "{{N_MISSOES}}": piso(missoes, 50), "{{N_ITENS}}": piso(itens, 100), "{{N_RECEITAS}}": piso(receitas, 100),
    "{{REPO}}": REPO, "{{RAMO}}": RAMO,
    "{{IMG_HERO}}": jpeg(faixa, 2200, 66), "{{IMG_RUINAS}}": jpeg(ruinas, 760, 72), "{{IMG_LOGO}}": webp(logo, 900),
    "{{ICO_CASCO}}": icone("placa_casco"), "{{ICO_COMPUTADOR}}": icone("computador_bordo"), "{{ICO_COMBUSTIVEL}}": icone("celula_combustivel"),
    "{{ICO_MOTOR}}": icone("motor_nave"), "{{ICO_DIARIO}}": icone("diario_bordo"), "{{ICO_AGUA}}": icone("agua_boa"),
    "{{ICO_CACTO}}": icone("fruta_cacto"), "{{ICO_FARAO}}": icone("coracao_farao"), "{{ICO_FOGUETE}}": icone("foguete_t1"),
    "{{CATEGORIAS_JSON}}": json.dumps({k: v[0] for k, v in CATEGORIAS.items()}, ensure_ascii=False),
    "{{CAPITULOS_JSON}}": json.dumps(capitulos, ensure_ascii=False, separators=(",", ":")),
    "{{NOVIDADES_JSON}}": json.dumps(novidades, ensure_ascii=False, separators=(",", ":")),
}
html = (PAGINA / "modelo.html").read_text(encoding="utf-8")
for k, v in troca.items():
    html = html.replace(k, v)
sobra = re.findall(r"\{\{[A-Z_]+\}\}", html)
assert not sobra, sobra

if "--fragmento" in sys.argv:
    Path(sys.argv[sys.argv.index("--fragmento") + 1]).write_text(html, encoding="utf-8")
cab, corpo = html.split("<!--FIM-CABECALHO-->", 1)
completo = ('<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            + cab + "\n</head>\n<body>\n" + corpo + "\n</body>\n</html>\n")
(PAGINA / "index.html").write_text(completo, encoding="utf-8")
print(f"página nova: {len(completo) // 1024} KB | v{versao} | {len(capitulos)} capítulos | {missoes} objetivos | {itens} itens/blocos | {receitas} receitas | {tamanho_mb} MB")

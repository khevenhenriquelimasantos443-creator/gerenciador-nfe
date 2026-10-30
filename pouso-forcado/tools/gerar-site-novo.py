# Site novo da wiki (prévia, 1.12.0): visual «Da queda ao recomeço» das telas do ChatGPT (marfim, grafite e laranja).
# Monta site-novo/ (projeto separado; o site antigo da Vercel não muda):
#   index.html  a página (visual, navegação, busca e as telas: início, guias, artigo, máquinas, nave, instalar,
#               busca e novidades), com rotas no "#";
#   dados.js    os textos: os artigos vêm de docs/wiki/wiki.fonte.html (a fonte da wiki antiga), mais os artigos
#               novos da 1.11.0 e da 1.12.0 e a lista das máquinas;
#   img/        os ícones oficiais das telas (docs/site/icones, PNGs reais do add-on, sem mudar nada), os ícones que
#               os artigos usam (RP/textures/items/cl), a logo e as fotos do mundo.
# Uso:  python3 tools/gerar-site-novo.py
import html, json, os, re, shutil

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SAIDA = os.path.join(R, "site-novo")
OFICIAIS = os.path.join(R, "docs/site/icones")
FONTE = open(os.path.join(R, "docs/wiki/wiki.fonte.html"), encoding="utf8").read()
VERSAO = re.search(r'VERSAO = "([^"]+)"', open(os.path.join(R, "scripts/config.ts"), encoding="utf8").read()).group(1)
CAPITULOS = len(re.findall(r'^    id: "', open(os.path.join(R, "scripts/missoes/lista.ts"), encoding="utf8").read(), re.M))
BAIXAR = "https://github.com/khevenhenriquelimasantos443-creator/gerenciador-nfe/raw/claude/dazzling-bell-twympv/pouso-forcado/dist/"
TAM = {a: os.path.getsize(os.path.join(R, "dist", f"pouso-forcado.{a}")) for a in ("mcaddon", "mcworld")}
tam = lambda a: f"{TAM[a] / 1024 / 1024:.1f} MB".replace(".", ",")

shutil.rmtree(SAIDA, ignore_errors=True)
for p in ("img/oficiais", "img/ic", "img/mundo"):
    os.makedirs(os.path.join(SAIDA, p), exist_ok=True)
for a in os.listdir(OFICIAIS):
    shutil.copy(os.path.join(OFICIAIS, a), os.path.join(SAIDA, "img/oficiais", a))
from PIL import Image  # a logo vem grande (2172 px): no cabeçalho bastam 360 px
logo = Image.open(os.path.join(R, "docs/site/logo_pouso_forcado.png"))
logo.resize((360, round(360 * logo.height / logo.width)), Image.LANCZOS).save(os.path.join(SAIDA, "img/logo.png"))
for n in ("pano0", "pano1", "pano2", "pano3", "fundo"):
    shutil.copy(os.path.join(R, f"docs/wiki/site/img/{n}.jpg"), os.path.join(SAIDA, f"img/mundo/{n}.jpg"))
# Capas: recortes do panorama do menu do jogo (RP_menu, faces 1024×1024 que se emendam 0-1-2-3-0), com o horizonte
# no meio e o assunto à direita (o texto da capa fica à esquerda).
faces = [Image.open(os.path.join(R, f"RP_menu/textures/ui/panorama_{i}.png")).convert("RGB") for i in range(4)]
def capa(nome, a, b, x0):
    tira = Image.new("RGB", (2048, 1024))
    tira.paste(faces[a], (0, 0)); tira.paste(faces[b], (1024, 0))
    tira.crop((x0, 300, x0 + 1600, 860)).save(os.path.join(SAIDA, f"img/mundo/{nome}.jpg"), quality=84)
capa("capa_aviao", 3, 0, 300)   # o avião caído
capa("capa_destrocos", 0, 1, 380)  # os destroços da outra nave
capa("capa_templo", 1, 2, 400)  # o templo soterrado
capa("capa_cidade", 2, 3, 420)  # a cidade abandonada
FOTO = {"pano0": "O avião caído", "pano1": "Destroços de outra nave", "pano2": "Templo soterrado", "pano3": "Cidade abandonada"}


def icone(caminho):
    """@icone/<caminho> -> img/ic/... (copia o PNG do pacote de recursos; os oficiais têm prioridade)."""
    nome = caminho.split("/")[-1]
    if os.path.exists(os.path.join(OFICIAIS, f"{nome}.png")):
        return f"img/oficiais/{nome}.png"
    origem = os.path.join(R, "RP/textures/items/cl", f"{caminho}.png")
    if not os.path.exists(origem):
        return ""
    destino = caminho.replace("/", "__") + ".png"
    shutil.copy(origem, os.path.join(SAIDA, "img/ic", destino))
    return f"img/ic/{destino}"


def limpar(h):
    h = re.sub(r'<img src="@icone/([^"]+)" alt="[^"]*">', lambda m: f'<img class="px mini" src="{icone(m.group(1))}" alt="">' if icone(m.group(1)) else "", h)
    h = re.sub(r'<img src="@img/(\w+)"', lambda m: f'<img src="img/mundo/{m.group(1)}.jpg"', h)
    h = h.replace("@versao", VERSAO)
    h = re.sub(r'<div class="tabela">', '<div class="tabela">', h)
    return h


slug = lambda t: re.sub(r"[^a-z0-9]+", "-", t.lower().translate(str.maketrans("áàâãéêíóôõúüç", "aaaaeeiooouuc"))).strip("-")


def secoes_da_fonte():
    """Cada <section class="secao" id="..."> da wiki antiga: título, resumo e os blocos (h3 + conteúdo)."""
    out = {}
    for m in re.finditer(r'<section class="secao" id="([\w-]+)">(.*?)</section>', FONTE, re.S):
        sid, corpo = m.group(1), m.group(2)
        cab = re.search(r"<h2>(.*?)</h2><p>(.*?)</p>", corpo)
        blocos = []
        for b in re.finditer(r'<article class="bloco([^"]*)">(.*?)</article>', corpo, re.S):
            if "baixar" in b.group(1):
                continue
            t = re.search(r"<h3>(.*?)</h3>", b.group(2), re.S)
            titulo = re.sub(r"<[^>]+>", "", t.group(1)).strip() if t else ""
            conteudo = limpar(re.sub(r"<h3>.*?</h3>", "", b.group(2), count=1, flags=re.S)).strip()
            blocos.append((titulo, conteudo))
        if sid in out:  # as duas seções "utilidades" da wiki antiga viram uma só
            out[sid]["blocos"] += blocos
        else:
            out[sid] = {"titulo": cab.group(1), "resumo": cab.group(2), "blocos": blocos}
    return out


FONTE_SEC = secoes_da_fonte()

# Artigos novos (1.11.0 e 1.12.0), escritos a partir do README e dos scripts do add-on.
NOVOS = {
    "additions": {"titulo": "Mekanism Additions", "resumo": "Plástico, painéis brilhantes, balões, TNT de obsidiana e filhotes.", "blocos": [
        ("Plástico em 16 cores", "<p>A Folha de Plástico (a mesma do MineFactory) faz o <strong>Plástico</strong>: 4 folhas + 1 corante = 4 blocos. Dele saem os outros:</p>"
         '<div class="tabela"><table><thead><tr><th>Bloco</th><th>Receita</th><th>O que tem de especial</th></tr></thead><tbody>'
         "<tr><td>Plástico Liso</td><td>4 plásticos + 1 bola de slime = 4</td><td>escorrega como gelo</td></tr>"
         "<tr><td>Plástico Brilhante</td><td>3 plásticos + 1 pó de glowstone = 3</td><td>ilumina (luz 15)</td></tr>"
         "<tr><td>Plástico Reforçado</td><td>4 plásticos + 1 pó de ósmio = 4</td><td>aguenta explosão</td></tr>"
         "<tr><td>Estrada de Plástico</td><td>3 plásticos lisos + 6 areias = 3</td><td>quem anda em cima ganha Velocidade II</td></tr>"
         "</tbody></table></div>"),
        ("Painéis Brilhantes", "<p>Placa fina de luz (15) que gruda em qualquer face: chão, teto ou parede. Receita: 2 vidros finos, 3 folhas de plástico, 1 corante e 2 pós de glowstone = 2 painéis.</p>"),
        ("Balões", "<p>Couro + linha + corante = 2 balões. Usado no ar, prende em você: você <strong>cai devagar por 60 s</strong>. Usado num bicho, levanta o bicho por <strong>10 s</strong>. Bata no balão para estourar.</p>"),
        ("TNT de Obsidiana", "<p>3 obsidianas, 3 TNTs e 3 obsidianas. Acende com isqueiro ou carga de fogo: <strong>5 s de pavio</strong> (100 ticks) e explosão de <strong>raio 12</strong>, os números do mod.</p>"),
        ("Filhotes", "<p>1 em cada 3 creepers, esqueletos, esqueletos errantes e endermen nasce <strong>bebê</strong>: metade do tamanho e o mesmo comportamento. O creeper bebê explode com metade da força.</p>"),
        ("Condutos do Ender IO", "<p><strong>Conduto de Energia</strong> (aglutinante de conduíte + ferro condutor = 8): passa energia como os cabos.</p>"
         "<p><strong>Conduto de Itens</strong> (aglutinante + ferro pulsante = 8): toque nele para o miolo ficar laranja. Assim ele <strong>tira 4 itens por segundo</strong> dos baús encostados e leva para os baús encostados nos outros condutos da rede (o mais perto primeiro).</p>"),
    ]},
    "farmers": {"titulo": "Farmer's Delight", "resumo": "Cozinha, cultivo, Nutrição e Conforto.", "blocos": [
        ("Utensílios", "<p><strong>Facas</strong> de sílex, ferro, ouro e diamante (graveto + material). Quebrar grama com faca dá palha (1 em 5); trigo dá palha sempre.</p>"
         "<p><strong>Tábua de Cortar</strong>: toque com o ingrediente para pôr na tábua e depois com a faca para cortar.</p>"
         '<div class="tabela"><table><thead><tr><th>Na tábua</th><th>Sai</th></tr></thead><tbody>'
         "<tr><td>Repolho</td><td>2 folhas de repolho</td></tr><tr><td>Carne</td><td>2 carnes moídas</td></tr><tr><td>Frango</td><td>2 pedaços de frango + farinha de osso</td></tr>"
         "<tr><td>Porco</td><td>2 bacons</td></tr><tr><td>Bacalhau e salmão</td><td>2 fatias + farinha de osso</td></tr><tr><td>Carneiro</td><td>2 costeletas</td></tr>"
         "<tr><td>Abóbora</td><td>4 fatias</td></tr><tr><td>Massa</td><td>macarrão cru</td></tr><tr><td>Trigo</td><td>palha</td></tr></tbody></table></div>"),
        ("Panela de Cozinha e Fogão", "<p>A <strong>Panela</strong> cozinha em cima de fogo, fogueira, lava, magma ou do <strong>Fogão</strong>. Toque com até 6 ingredientes; quando fica pronta, sirva com uma <strong>tigela</strong> (os pratos de tigela pedem a tigela). Agache de mão vazia para esvaziar.</p>"
         "<p>O Fogão também assa até 6 comidas cruas em cima (30 s cada).</p>"
         '<div class="tabela"><table><thead><tr><th>Prato</th><th>Ingredientes</th></tr></thead><tbody>'
         "<tr><td>Molho de Tomate</td><td>2 tomates</td></tr><tr><td>Arroz Cozido</td><td>arroz</td></tr><tr><td>Ensopado de Carne</td><td>carne, cenoura, batata</td></tr>"
         "<tr><td>Sopa de Frango</td><td>frango, cenoura, repolho, legume</td></tr><tr><td>Sopa de Cebola</td><td>2 cebolas, pão, leite</td></tr>"
         "<tr><td>Macarrão com Almôndegas</td><td>carne moída, macarrão cru, molho de tomate</td></tr><tr><td>Ratatouille</td><td>tomate, cebola, beterraba, legume</td></tr>"
         "<tr><td>Bolinhos (2)</td><td>massa, repolho, cebola, frango</td></tr></tbody></table></div>"),
        ("Nutrição e Conforto", "<p>Os pratos da panela dão <strong>Nutrição</strong>: a fome não baixa. As sopas e ensopados também dão <strong>Conforto</strong>: sem lentidão, fraqueza nem fome. Duração: breve 30 s, curta 1 min, média 3 min, longa 5 min.</p>"
         "<p>As saladas dão Regeneração por 5 s.</p>"),
        ("Plantar e guardar", "<p>O <strong>repolho</strong> é uma plantação nova (sementes na peneira). Tomate, cebola e arroz são os do HarvestCraft. Caixotes de repolho, tomate, cebola, cenoura, batata e beterraba, saco de arroz e fardo de palha guardam 9 de cada.</p>"
         "<p>Palha faz <strong>corda</strong> (2 palhas = 4) e <strong>lona</strong> (4 palhas).</p>"),
    ]},
    "quark": {"titulo": "Quark", "resumo": "Construção, exploração e melhorias do dia a dia.", "blocos": [
        ("Blocos", "<p>Caixote de maçã, sacos de bagas, pólvora e cacau, blocos de carvão vegetal, cana, cacto e gravetos (9 de cada).</p>"
         "<p><strong>Jaspe</strong> e <strong>xisto</strong>: 8 pedregulhos + corante vermelho ou cinza; depois polido, tijolos, entalhado e pilar.</p>"
         "<p>Vidro emoldurado, placa de ferro (e enferrujada), grade, palha trançada, <strong>lanterna de papel</strong> e lâmpada de pedra (as duas iluminam).</p>"),
        ("Picarango", "<p>Picareta de arremesso (diamantes e ferro). Vai até <strong>20 blocos</strong>, quebra o primeiro bloco que acerta (ou fere o primeiro bicho) e volta trazendo os itens. Gasta 1 de durabilidade por arremesso (800 usos).</p>"),
        ("Melhorias do dia a dia", "<ul><li><strong>Colheita com toque</strong>: toque num trigo, cenoura, batata ou beterraba madura; ela colhe e replanta sozinha.</li>"
         "<li><strong>Portas duplas</strong>: abrir uma porta de madeira abre a vizinha.</li>"
         "<li><strong>Corda</strong>: pule dentro para subir; parado, desce devagar. Toque uma corda com outra para estender para baixo.</li></ul>"),
    ]},
}

# Índice dos guias, como na tela 02 (grupos editoriais; o Diário no jogo tem a sua própria ordem).
GUIAS = [
    ("Sobreviver e conseguir recursos", [
        ("comecar", "Começar", "Entenda o básico, conheça a nave e prepare-se para a primeira noite.", "painel_nave"),
        ("sobreviver", "Sobreviver", "Gerencie sede, fome e abrigo em um planeta hostil.", "agua_boa"),
        ("nihilo", "Ex Nihilo", "Gere recursos a partir da areia.", "peneira"),
        ("ferramentas", "Ferramentas", "Crie e melhore suas ferramentas.", "picareta_ferro"),
        ("farmers", "Farmer's Delight", "Cozinha, cultivo, Nutrição e Conforto.", "repolho"),
    ]),
    ("Construir e automatizar", [
        ("energia", "Energia", "Gere, armazene e distribua energia para as máquinas.", "celula_energia_basica"),
        ("maquinas", "Máquinas", "Conheça as máquinas e o que cada uma faz.", "pulverizador"),
        ("armazenamento", "Armazenamento", "Organize seus itens e otimize o espaço.", "barril_armazenamento"),
        ("mekanism", "Mekanism", "Geradores, ferramentas e o processamento de minério.", "separador_eletrolitico"),
        ("additions", "Mekanism Additions", "Plásticos, balões e novas utilidades.", ""),
        ("enderio", "Ender IO", "Ligas, máquinas, capacitores e condutos.", "fundidora_ligas"),
        ("create", "Create", "Rotação, estresse e máquinas mecânicas.", "engrenagem"),
    ]),
    ("Explorar e voltar", [
        ("explorar", "Explorar", "Estruturas e segredos deste planeta.", "bussola_aviao"),
        ("perigos", "Perigos", "Os perigos que esperam e como se proteger.", "ovo_mumia"),
        ("nave", "Nave", "Recupere os sistemas e prepare a volta.", "painel_nave"),
        ("lua", "Lua", "Foguete, oxigênio, a base e o Núcleo de Salto.", "foguete_t1"),
        ("utilidades", "Utilidades", "Waystones, mochila, robô e as ajudas do dia a dia.", "pedra_caminho"),
        ("quark", "Quark", "Construção, exploração e melhorias do dia a dia.", "picarango"),
    ]),
]
guias = []
for grupo, itens in GUIAS:
    for gid, titulo, desc, ic in itens:
        s = NOVOS.get(gid) or FONTE_SEC[gid]
        blocos = list(s["blocos"])
        if gid == "nave":  # o final novo (1.6.1) não estava na página antiga
            blocos.insert(2, ("A última peça: o Núcleo de Salto", "<p>Com os 4 sistemas consertados, o Painel da Nave mostra a <strong>Bobina de Salto</strong> queimada. O <strong>Núcleo de Salto</strong> está na <strong>Base de Pesquisa Lunar</strong>: chegue à Lua de foguete, desça a masmorra, vença o <strong>Esqueleto Evoluído Gigante</strong> e abra o Baú do Tesouro com a chave que ele deixa. Instalado o núcleo, aparece o botão <strong>Decolar</strong>.</p><p>Mundos que já decolaram seguem no modo infinito, sem pedir o núcleo.</p>"))
        guias.append({"id": gid, "grupo": grupo, "titulo": titulo, "h1": s["titulo"], "resumo": s["resumo"], "desc": desc,
                      "icone": f"img/oficiais/{ic}.png" if ic else "",
                      "secoes": [{"id": slug(t) or f"s{k}", "titulo": t, "html": h} for k, (t, h) in enumerate(blocos)]})
creditos = FONTE_SEC["creditos"]

# Máquinas (tela 04): as do Thermal com a tabela do que processam; as outras com o resumo da wiki.
def m(mid, nome, mod, desc, custo="", linhas=(), nota="Entrada pelo baú de cima. Saída pelo baú de baixo."):
    ic = f"img/oficiais/{mid}.png" if os.path.exists(os.path.join(OFICIAIS, f"{mid}.png")) else icone(f"arte/blocos/{mid}") or icone(f"blocos/{mid}")
    return {"id": mid, "nome": nome, "mod": mod, "desc": desc, "custo": custo, "linhas": [list(l) for l in linhas], "nota": nota, "icone": ic}
MAQUINAS = [
    m("pulverizador", "Pulverizador", "Thermal", "Transforma minério em dois pós e tritura recursos básicos.", "4.000 RF",
      [("Minério", "2 pós (+10% de outro pó)"), ("Pedregulho", "Cascalho"), ("Cascalho", "Areia"), ("Areia", "Poeira"), ("Osso", "6 farinhas de osso")]),
    m("fornalha_redstone", "Fornalha de Redstone", "Thermal", "Funde 2 itens por vez.", "1.600 RF por item", [("Item de fornalha", "o mesmo da fornalha"), ("4 pedaços do Ex Nihilo", "1 lingote")]),
    m("fundidora_inducao", "Fundidora de Indução", "Thermal", "Faz ligas e dobra minério com areia.", "1.600 a 3.200 RF",
      [("3 cobre + 1 estanho", "4 bronze"), ("Ferro + carvão", "Aço"), ("Minério + areia", "2 lingotes")]),
    m("serraria", "Serraria", "Thermal", "Corta toras em tábuas.", "800 RF", [("Tora", "6 tábuas (+25% serragem)")]),
    m("extrusora_ignea", "Extrusora Ígnea", "Thermal", "Faz pedregulho com lava e água encostadas.", "grátis", [("Lava + água encostadas", "Pedregulho")], "Saída pelo baú de baixo."),
    m("precipitador_glacial", "Precipitador Glacial", "Thermal", "Faz neve com água encostada.", "2.000 RF", [("Água encostada", "4 bolas de neve")], "Saída pelo baú de baixo."),
    m("separador_eletrolitico", "Separador Eletrolítico", "Mekanism", "Separa a água em hidrogênio e oxigênio.", "", [("Água + 2 cilindros vazios", "Hidrogênio + oxigênio"), ("Salmoura", "Hidrogênio + cloro")]),
    m("evaporador", "Evaporador Térmico", "Mekanism", "Sem energia, de dia e com céu aberto.", "grátis", [("Água", "Salmoura"), ("Salmoura", "Pó de lítio")]),
    m("infusor_quimico", "Infusor Químico", "Mekanism", "Mistura gases.", "", [("Hidrogênio + cloro", "Ácido clorídrico")]),
    m("camara_purificacao", "Câmara de Purificação", "Mekanism", "Triplica o minério com oxigênio.", "", [("Minério + oxigênio", "3 pós")]),
    m("camara_injecao", "Câmara de Injeção", "Mekanism", "Quadruplica o minério com ácido.", "", [("Minério + ácido", "4 pós")]),
    m("infusor_metalurgico", "Infusor Metalúrgico", "Mekanism", "Faz as ligas do Mekanism.", "", [("Ferro + 2 carvões", "Aço"), ("Ligas", "Enriquecida, Reforçada e Atômica")]),
    m("fundidora_ligas", "Fundidora de Ligas", "Ender IO", "Faz as 7 ligas do Ender IO.", "10.000 a 20.000 RF",
      [("Ferro + carvão pulverizado + silício", "Aço Elétrico"), ("Redstone + ouro + glowstone", "Liga Energética"), ("Ferro + carvão pulverizado + obsidiana", "Aço Negro")]),
    m("moinho_sag", "Moinho SAG", "Ender IO", "Mói minério e pedra.", "2.400 a 3.600 RF", [("Minério", "2 pós"), ("Carvão", "Carvão pulverizado (+10%)"), ("Pedregulho", "Cascalho"), ("Cascalho", "Areia")]),
    m("bomba", "Bomba", "BuildCraft", "Esvazia o bolsão de petróleo embaixo dela.", "1 E por balde", [("Petróleo (até 96 blocos abaixo)", "Baldes de petróleo")], "Baldes vazios num baú encostado."),
    m("refinaria", "Refinaria", "BuildCraft", "Transforma petróleo em combustível.", "1 E", [("Petróleo", "Combustível")]),
    m("pedreira", "Pedreira", "BuildCraft", "Cava 9×9 atrás dela, camada por camada, até o fundo.", "0,25 E por bloco", [("Blocos da área", "Itens no baú de cima")], "Saída pelo baú de cima."),
    m("compressor_ar", "Compressor de Ar", "Pneumática", "Queima combustível e enche a rede de tubos.", "", [("Combustível", "Ar na rede (bar = ar ÷ volume)")], "Tubos comuns: perigo acima de 5 bar; avançados: acima de 20."),
    m("mo", "Mó", "Create", "Mói com rotação (4 SU por RPM).", "rotação", [("Trigo", "Farinha"), ("Osso", "3 farinhas de osso"), ("Cana", "2 açúcares")]),
    m("prensa_mecanica", "Prensa Mecânica", "Create", "Faz chapas com rotação (8 SU por RPM).", "rotação", [("Lingote de ferro, cobre, ouro ou latão", "Chapa")]),
    m("panela_cozinha", "Panela de Cozinha", "Farmer's Delight", "Cozinha os pratos em cima de fogo ou do Fogão.", "calor", [("2 tomates", "Molho de Tomate"), ("Carne + cenoura + batata", "Ensopado de Carne")], "Toque com os ingredientes; sirva com uma tigela."),
]

dados = {
    "versao": VERSAO, "capitulos": CAPITULOS, "baixar": {a: BAIXAR + f"pouso-forcado.{a}" for a in TAM}, "tamanho": {a: tam(a) for a in TAM},
    "guias": guias, "grupos": [g for g, _ in GUIAS], "maquinas": MAQUINAS,
    "creditos": {"titulo": creditos["titulo"], "resumo": creditos["resumo"], "secoes": [{"id": slug(t), "titulo": t, "html": h} for t, h in creditos["blocos"]]},
    "fotos": [{"src": f"img/mundo/{k}.jpg", "legenda": v} for k, v in FOTO.items()],
}
with open(os.path.join(SAIDA, "dados.js"), "w", encoding="utf8") as f:
    f.write("// Gerado por tools/gerar-site-novo.py. Não edite à mão.\nwindow.DADOS = " + json.dumps(dados, ensure_ascii=False) + ";\n")
shutil.copy(os.path.join(R, "tools/site-novo/index.html"), os.path.join(SAIDA, "index.html"))
n = sum(len(fs) for _, _, fs in os.walk(SAIDA))
print(f"site novo: {len(guias)} guias, {len(MAQUINAS)} máquinas, {n} arquivos em site-novo/")

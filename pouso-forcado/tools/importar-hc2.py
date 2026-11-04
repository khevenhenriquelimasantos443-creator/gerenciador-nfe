# 1.47.0: Pam's HarvestCraft 2 (o mais novo, 1.21.1: Crops, Trees e Food Core; MatrexsVigil, todos os direitos
# reservados) para tools/dados/hc2.json. Só os dados de jogo (listas, receitas e números de comida); nomes traduzidos,
# texturas e modelos próprios (as do mod não podem ser usadas: ver CREDITOS.md). Os valores de fome estão no código
# (FoodBuilderRegistry), lidos com o javap do JDK.
# Uso: python3 tools/importar-hc2.py <pasta com os jars pamhc2crops, pamhc2trees e pamhc2foodcore (NEOFORGE 1.21.1)>
import itertools, json, re, subprocess, sys, tempfile, zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PASTA = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-hc2.py <pasta com os jars>"))
JAR = {m: zipfile.ZipFile(next(PASTA.glob(f"{m}-*.jar"))) for m in ("pamhc2crops", "pamhc2trees", "pamhc2foodcore")}
# Itens e blocos de outros mods (os do próprio HarvestCraft, gerados antes, não contam).
_gerado = (RAIZ / "scripts/harvest/gerado.ts").read_text(encoding="utf-8") if (RAIZ / "scripts/harvest/gerado.ts").exists() else ""
_nosso = set(json.loads(re.search(r"ITENS_HC: ReadonlyArray<string> = (\[.*?\]);", _gerado).group(1))) if "ITENS_HC" in _gerado else set()
EXISTE = ({f"cl:{p.stem}" for p in (RAIZ / "BP/items").glob("*.json")} | {f"cl:{p.stem}" for p in (RAIZ / "BP/blocks").glob("*.json")}) - _nosso


def ler(m, p):
    try:
        return json.loads(JAR[m].read(p))
    except (KeyError, json.JSONDecodeError):
        return None


def arquivos(m, prefixo):
    return [n for n in JAR[m].namelist() if n.startswith(prefixo) and n.endswith(".json")]


def fomes(m, classe):
    """(nutrição, saturação) de cada comida, na ordem do bytecode: int, float e putstatic do FoodProperties."""
    with tempfile.TemporaryDirectory() as t:
        JAR[m].extract(classe, t)
        out = subprocess.run(["javap", "-c", "-p", str(Path(t) / classe)], capture_output=True, text=True).stdout
    res, nums = {}, []
    for ln in out.splitlines():
        if (a := re.search(r"\b(?:iconst_(\d)|bipush\s+(\d+))", ln)):
            nums.append(int(a.group(1) or a.group(2)))
        elif (a := re.search(r"putstatic .*Field (\w+):Lnet/minecraft/world/food/FoodProperties", ln)):
            if nums:
                res[a.group(1).lower()] = nums[0]
            nums = []
    return res


FOME = {**fomes("pamhc2crops", "com/pam/pamhc2crops/setup/FoodBuilderRegistry.class"),
        **fomes("pamhc2trees", "com/pam/pamhc2trees/init/FoodBuilderRegistry.class"),
        **fomes("pamhc2foodcore", "com/pam/pamhc2foodcore/setup/FoodBuilderRegistry.class")}
# Hunger Overhaul (igual à Fase 14): fome da comida de mod = max(arredondar(fome / 4), 1).
ho = lambda n: max(int(n / 4 + 0.5), 1)

# ---------- plantações (id do HC2 -> id nosso, pt, forma, cor) ----------
# As que o pack já tinha (Fase 14) ficam com o id antigo.
JA = {"corn": "milho", "tomato": "tomate", "onion": "cebola", "garlic": "alho", "bean": "feijao", "chilipepper": "pimenta",
      "bellpepper": "pimentao", "rice": "arroz", "peanut": "amendoim", "cactusfruit": "fruta_cacto", "cabbage": "repolho"}
CULT = {
    "agave": ("agave", "Agave", "cacto", "#6fa88a"), "amaranth": ("amaranto", "Amaranto", "graos", "#b03a5a"),
    "arrowroot": ("araruta", "Araruta", "raiz", "#d8c8a0"), "artichoke": ("alcachofra", "Alcachofra", "alcachofra", "#6a9a4a"),
    "asparagus": ("aspargo", "Aspargo", "talo", "#7aa84a"), "barley": ("cevada", "Cevada", "trigo", "#d8b860"),
    "blackberry": ("amora_preta", "Amora-Preta", "baga", "#3a2244"), "blueberry": ("mirtilo", "Mirtilo", "baga", "#3a4aa8"),
    "broccoli": ("brocolis", "Brócolis", "brocolis", "#3a8a3a"), "brusselsprout": ("couve_bruxelas", "Couve-de-Bruxelas", "baga", "#6aa84a"),
    "candleberry": ("baga_cera", "Baga-de-Cera", "baga", "#c8c8a0"), "cantaloupe": ("melao", "Melão", "redondo", "#e8a050"),
    "cassava": ("mandioca", "Mandioca", "raiz", "#8a5a3a"), "cauliflower": ("couve_flor", "Couve-Flor", "brocolis", "#f0ecd8"),
    "celery": ("salsao", "Salsão", "talo", "#8ac85a"), "chickpea": ("grao_de_bico", "Grão-de-Bico", "graos", "#e0c080"),
    "coffeebean": ("cafe", "Grão de Café", "graos", "#5a2a1a"), "cotton": ("algodao", "Algodão", "fibra", "#f4f4f0"),
    "cranberry": ("oxicoco", "Oxicoco", "baga", "#b8202c"), "cucumber": ("pepino", "Pepino", "alongado", "#3a8a3a"),
    "eggplant": ("berinjela", "Berinjela", "alongado", "#4a2a5a"), "elderberry": ("sabugueiro", "Baga de Sabugueiro", "baga", "#2a2a4a"),
    "flax": ("linho", "Linho", "fibra", "#8aa0d8"), "ginger": ("gengibre", "Gengibre", "raiz", "#d8b070"),
    "grape": ("uva", "Uva", "cacho", "#6a2a7a"), "greengrape": ("uva_verde", "Uva Verde", "cacho", "#a0c85a"),
    "huckleberry": ("uva_do_monte", "Uva-do-Monte", "baga", "#4a2a6a"), "jicama": ("jicama", "Jicama", "raiz", "#c8a070"),
    "juniperberry": ("zimbro", "Baga de Zimbro", "baga", "#4a5a8a"), "jute": ("juta", "Juta", "fibra", "#b8a060"),
    "kale": ("couve", "Couve", "folha", "#2a6a3a"), "kenaf": ("kenaf", "Kenaf", "fibra", "#9ab060"),
    "kiwi": ("kiwi", "Kiwi", "redondo", "#8a6a3a"), "kohlrabi": ("couve_rabano", "Couve-Rábano", "redondo", "#a0c870"),
    "leek": ("alho_poro", "Alho-Poró", "talo", "#7ab060"), "lentil": ("lentilha", "Lentilha", "graos", "#b07a3a"),
    "lettuce": ("alface", "Alface", "folha", "#8ac850"), "millet": ("painco", "Painço", "trigo", "#e8d090"),
    "mulberry": ("amora", "Amora", "baga", "#5a1a3a"), "mustardseeds": ("mostarda", "Mostarda", "graos", "#d8a830"),
    "oats": ("aveia", "Aveia", "trigo", "#d8c890"), "okra": ("quiabo", "Quiabo", "vagem", "#5a9a3a"),
    "parsnip": ("pastinaca", "Pastinaca", "raiz", "#f0e0b0"), "peas": ("ervilha", "Ervilha", "vagem", "#6ab04a"),
    "pineapple": ("abacaxi", "Abacaxi", "abacaxi", "#e8c040"), "quinoa": ("quinoa", "Quinoa", "graos", "#e8d8b0"),
    "radish": ("rabanete", "Rabanete", "raiz_redonda", "#d83a4a"), "raspberry": ("framboesa", "Framboesa", "baga", "#d83a5a"),
    "rhubarb": ("ruibarbo", "Ruibarbo", "talo", "#c83a4a"), "rutabaga": ("nabo_sueco", "Nabo-Sueco", "raiz_redonda", "#c8a0a0"),
    "rye": ("centeio", "Centeio", "trigo", "#b89a5a"), "scallion": ("cebolinha", "Cebolinha", "talo", "#5ab04a"),
    "sesameseeds": ("gergelim", "Gergelim", "graos", "#f0e0c0"), "sisal": ("sisal", "Sisal", "fibra", "#c8d090"),
    "soybean": ("soja", "Soja", "vagem", "#c8b060"), "spiceleaf": ("folha_tempero", "Folha de Tempero", "folha", "#4a8a3a"),
    "spinach": ("espinafre", "Espinafre", "folha", "#2a7a3a"), "strawberry": ("morango", "Morango", "morango", "#e0302f"),
    "sweetpotato": ("batata_doce", "Batata-Doce", "raiz", "#b05a4a"), "taro": ("inhame", "Inhame", "raiz_redonda", "#8a6a7a"),
    "tealeaf": ("folha_cha", "Folha de Chá", "folha", "#4a8a3a"), "tomatillo": ("tomatilho", "Tomatilho", "redondo", "#9ac050"),
    "turnip": ("nabo", "Nabo", "raiz_redonda", "#e8d8e0"), "waterchestnut": ("castanha_dagua", "Castanha-d'Água", "noz", "#5a3a2a"),
    "whitemushroom": ("cogumelo_branco", "Cogumelo Branco", "cogumelo", "#f0ece0"), "wintersquash": ("abobora_inverno", "Abóbora-de-Inverno", "redondo", "#e09a3a"),
    "zucchini": ("abobrinha", "Abobrinha", "alongado", "#4a8a3a"), "alfalfa": ("alfafa", "Alfafa", "folha", "#6ab04a"),
    "aloe": ("babosa", "Babosa", "cacto", "#6aa86a"), "barrelcactus": ("cacto_barril", "Cacto-Barril", "cacto", "#4a8a4a"),
    "canola": ("canola", "Canola", "graos", "#e8d040"), "cattail": ("taboa", "Taboa", "taboa", "#8a5a3a"),
    "chia": ("chia", "Chia", "graos", "#6a6a6a"), "cloudberry": ("amora_artica", "Amora-Ártica", "baga", "#f0a040"),
    "lotus": ("lotus", "Lótus", "flor", "#f0a0c0"), "nettles": ("urtiga", "Urtiga", "folha", "#3a7a3a"),
    "nopales": ("palma", "Palma", "cacto", "#5a9a4a"), "sorghum": ("sorgo", "Sorgo", "trigo", "#a85a3a"),
    "truffle": ("trufa", "Trufa", "noz", "#3a2a1a"), "wolfberry": ("goji", "Goji", "baga", "#e04a2a"),
    "yucca": ("iuca", "Iúca", "raiz", "#e8d8b0"), "bokchoy": ("couve_chinesa", "Couve-Chinesa", "folha", "#8ac870"),
    "calabash": ("cabaca", "Cabaça", "alongado", "#a0b060"), "guarana": ("guarana", "Guaraná", "baga", "#c8302a"),
    "papyrus": ("papiro", "Papiro", "talo", "#7a9a3a"), "sunchoke": ("tupinambo", "Tupinambo", "raiz", "#c89a6a"),
}
# ---------- árvores (HC2 Trees): id do HC2 -> id nosso, pt, forma do fruto, cor ----------
# Maçã dá a maçã do jogo; tâmara já é a tamareira do pack (1.2.0); canela, bordo e casca-de-papel são frutos no tronco.
ARV = {
    "acorn": ("bolota", "Bolota", "noz", "#8a5a2a"), "almond": ("amendoa", "Amêndoa", "noz", "#c89a6a"),
    "apple": ("maca", "Maçã", "redondo", "#d8332a"), "apricot": ("damasco", "Damasco", "redondo", "#f0a040"),
    "avocado": ("abacate", "Abacate", "pera", "#4a7a2a"), "banana": ("banana", "Banana", "banana", "#f0d040"),
    "breadfruit": ("fruta_pao", "Fruta-Pão", "redondo", "#8ab040"), "candlenut": ("noz_iguape", "Noz-de-Iguape", "noz", "#c8b090"),
    "cashew": ("castanha_caju", "Castanha-de-Caju", "noz", "#e8c890"), "cherry": ("cereja", "Cereja", "cereja", "#c8202a"),
    "chestnut": ("castanha", "Castanha", "noz", "#6a3a1a"), "cinnamon": ("canela", "Canela", "canela", "#a0602a"),
    "coconut": ("coco", "Coco", "coco", "#6a4a2a"), "dragonfruit": ("pitaya", "Pitaya", "redondo", "#e0407a"),
    "durian": ("durian", "Durião", "redondo", "#b0a040"), "fig": ("figo", "Figo", "pera", "#6a3a5a"),
    "gooseberry": ("groselha", "Groselha", "baga", "#a0c050"), "grapefruit": ("toranja", "Toranja", "redondo", "#f08060"),
    "guava": ("goiaba", "Goiaba", "redondo", "#b0d060"), "hazelnut": ("avela", "Avelã", "noz", "#a0703a"),
    "jackfruit": ("jaca", "Jaca", "alongado", "#a0b030"), "lemon": ("limao_siciliano", "Limão-Siciliano", "redondo", "#f0e040"),
    "lime": ("limao", "Limão", "redondo", "#60b030"), "lychee": ("lichia", "Lichia", "baga", "#d04050"),
    "mango": ("manga", "Manga", "pera", "#f0a020"), "maple": ("xarope_bordo", "Xarope de Bordo", "xarope", "#b0601a"),
    "nutmeg": ("noz_moscada", "Noz-Moscada", "noz", "#8a5a3a"), "olive": ("azeitona", "Azeitona", "baga", "#5a6a2a"),
    "orange": ("laranja", "Laranja", "redondo", "#f08a1a"), "papaya": ("mamao", "Mamão", "alongado", "#f0a040"),
    "paperbark": ("casca_papel", "Casca-de-Papel", "papel", "#e8e0c8"), "passionfruit": ("maracuja", "Maracujá", "redondo", "#e0c040"),
    "pawpaw": ("asimina", "Asimina", "pera", "#a0c050"), "peach": ("pessego", "Pêssego", "redondo", "#f0a080"),
    "pear": ("pera", "Pera", "pera", "#c0d050"), "pecan": ("peca", "Pecã", "noz", "#8a4a2a"),
    "peppercorn": ("pimenta_reino", "Pimenta-do-Reino", "graos", "#3a2a2a"), "persimmon": ("caqui", "Caqui", "redondo", "#f07020"),
    "pinenut": ("pinoli", "Pinoli", "noz", "#c89a5a"), "pistachio": ("pistache", "Pistache", "noz", "#a0c060"),
    "plum": ("ameixa", "Ameixa", "redondo", "#6a2a6a"), "pomegranate": ("roma", "Romã", "redondo", "#b02030"),
    "rambutan": ("rambutan", "Rambutã", "baga", "#d03040"), "soursop": ("graviola", "Graviola", "pera", "#6a9a3a"),
    "spiderweb": ("teia", "Teia", "teia", "#f0f0f0"), "starfruit": ("carambola", "Carambola", "carambola", "#e0d040"),
    "tamarind": ("tamarindo", "Tamarindo", "vagem", "#8a5a2a"), "vanillabean": ("baunilha", "Fava de Baunilha", "vagem", "#3a2a1a"),
    "walnut": ("noz", "Noz", "noz", "#8a6a3a"),
}
PRODUTO_ARV = {"apple": "minecraft:apple", "paperbark": "minecraft:paper", "spiderweb": "minecraft:string"}
EN_ARV = {"maple": "Maple Syrup", "pinenut": "Pinenuts", "spiderweb": "Spiderweb", "paperbark": "Paperbark"}

# ---------- comidas do Food Core ----------
# As que o pack já tinha (Fase 14) ficam como estão (receita e valores do Crash Landing).
JA_COMIDA = {"saltitem": "cl:sal", "flouritem": "cl:farinha", "doughitem": "cl:massa", "batteritem": "cl:massa_liquida",
             "butteritem": "cl:manteiga", "cheeseitem": "cl:queijo", "mayonaiseitem": "cl:maionese", "stockitem": "cl:caldo",
             "friedeggitem": "cl:ovo_frito", "boiledeggitem": "cl:ovo_cozido", "toastitem": "cl:torrada", "beefjerkyitem": "cl:charque",
             "freshwateritem": "cl:agua_boa"}
SABOR = {"apple": ("Maçã", "maca", "#d8332a"), "melon": ("Melancia", "melancia", "#e4553f"), "sweetberry": ("Bagas Doces", "bagas_doces", "#b8202c"),
         "glowberry": ("Bagas Brilhantes", "bagas_brilhantes", "#f2a93b"), "chorus": ("Fruta do Coro", "coro", "#a678c8"),
         "carrot": ("Cenoura", "cenoura", "#f08a24"), "pumpkin": ("Abóbora", "abobora", "#e38a1e"), "caramel": ("Caramelo", "caramelo", "#c8842a"),
         "chocolate": ("Chocolate", "chocolate", "#5a3220"), "honey": ("Mel", "mel", "#f2b632")}
CARNE = {"beef": ("Carne", "carne", "#8b3a2a"), "chicken": ("Frango", "frango", "#e8c27a"), "fish": ("Peixe", "peixe", "#d9b28c"),
         "mutton": ("Carneiro", "carneiro", "#b5523a"), "pork": ("Porco", "porco", "#e8a0a0"), "rabbit": ("Coelho", "coelho", "#c89a7a"),
         "veggie": ("Legumes", "legumes", "#5aa03a")}
MOIDO = {"beef": "Carne Moída", "chicken": "Frango Moído", "fish": "Peixe Moído", "mutton": "Carneiro Moído", "pork": "Porco Moído", "rabbit": "Coelho Moído"}
# (sufixo em inglês sem espaço, nome em pt com {}, id com {}, forma do ícone, bebida/fria/quente)
PADRAO = [("jellytoast", "Torrada com Geleia de {}", "torrada_geleia_{}", "pao", ""), ("donut", "Rosquinha de {}", "rosquinha_{}", "rosca", ""),
          ("jelly", "Geleia de {}", "geleia_{}", "pote", ""), ("juice", "Suco de {}", "suco_{}", "copo", "fria"),
          ("muffin", "Muffin de {}", "muffin_{}", "muffin", ""), ("pie", "Torta de {}", "torta_{}", "torta", ""),
          ("popsicle", "Picolé de {}", "picole_{}", "picole", "gelo"), ("smoothie", "Vitamina de {}", "vitamina_{}", "copo", "fria"),
          ("yogurt", "Iogurte de {}", "iogurte_{}", "pote", ""), ("icecream", "Sorvete de {}", "sorvete_{}", "sorvete", "gelo"),
          ("cake", "Bolo de {}", "bolo_{}", "bolo", ""), ("bread", "Pão de {}", "pao_{}", "pao", ""), ("soup", "Sopa de {}", "sopa_{}", "tigela", "sopa")]
PADRAO_CARNE = [("jerky", "Charque de {}", "charque_{}", "tira", ""), ("noodlesoup", "Sopa de Macarrão com {}", "sopa_macarrao_{}", "tigela", "sopa"),
                ("potpie", "Empadão de {}", "empadao_{}", "torta", ""), ("skewer", "Espetinho de {}", "espetinho_{}", "espeto", ""),
                ("sandwich", "Sanduíche de {}", "sanduiche_{}", "sanduiche", "")]
MANUAL = {
    "applesauce": ("Purê de Maçã", "pure_maca", "tigela:#e8c070", ""), "baconandeggs": ("Ovos com Bacon", "ovos_bacon", "prato:#c84a3a", ""),
    "baconcheeseburger": ("X-Bacon", "x_bacon", "sanduiche:#c84a3a", ""), "bakedvegetablemedly": ("Legumes Assados", "legumes_assados", "prato:#5aa03a", ""),
    "basiccheeseburger": ("X-Búrguer", "x_burguer", "sanduiche:#f4c542", ""), "basichamburger": ("Hambúrguer Simples", "hamburguer_simples", "sanduiche:#7a4a2a", ""),
    "basicveggieburger": ("Hambúrguer Vegetariano", "hamburguer_vegetariano", "sanduiche:#5aa03a", ""),
    "butteredbakedpotato": ("Batata Assada com Manteiga", "batata_manteiga", "prato:#d8a85a", ""), "caramelapple": ("Maçã do Amor", "maca_amor", "bola:#b8302a", ""),
    "caramel": ("Caramelo", "caramelo", "bloco:#c8842a", ""), "cheesecake": ("Cheesecake", "cheesecake", "bolo:#f4e0a0", ""),
    "chickendinner": ("Jantar de Frango", "jantar_frango", "prato:#e8c27a", ""), "chickennugget": ("Nuggets de Frango", "nuggets_frango", "prato:#d8a040", ""),
    "chocolatebacon": ("Bacon com Chocolate", "bacon_chocolate", "tira:#5a3220", ""), "chocolatebar": ("Barra de Chocolate", "barra_chocolate", "barra:#5a3220", ""),
    "chocolatecaramelfudge": ("Fudge de Chocolate e Caramelo", "fudge_chocolate", "bloco:#6a3a20", ""), "chocolatemilk": ("Achocolatado", "achocolatado", "copo:#8a5a3a", "fria"),
    "chocolateroll": ("Rocambole de Chocolate", "rocambole_chocolate", "pao:#5a3220", ""), "cocoapowder": ("Cacau em Pó", "cacau_po", "po:#6a3a20", ""),
    "cookiesandmilk": ("Biscoitos com Leite", "biscoitos_leite", "copo:#f4f1e8", "fria"), "cookingoil": ("Óleo de Cozinha", "oleo_cozinha", "garrafa:#e8c040", ""),
    "cottoncandy": ("Algodão-Doce", "algodao_doce", "algodao:#f0a0c8", ""), "cracker": ("Bolacha", "bolacha", "disco:#e0b870", ""),
    "crackersandcheese": ("Bolachas com Queijo", "bolachas_queijo", "disco:#f4c542", ""), "cream": ("Creme de Leite", "creme_leite", "pote:#fbf6e8", ""),
    "epicbacon": ("Bacon Épico", "bacon_epico", "tira:#d83a8a", ""), "fishandchips": ("Peixe com Fritas", "peixe_fritas", "prato:#d9b28c", ""),
    "fishsticks": ("Iscas de Peixe", "iscas_peixe", "prato:#d8a040", ""), "freshmilk": ("Leite Fresco", "leite_fresco", "copo:#f8f8f4", "fria"),
    "friedchicken": ("Frango Frito", "frango_frito", "prato:#c88a3a", ""), "fries": ("Batata Frita", "batata_frita", "fritas:#f0c040", ""),
    "fruitpunch": ("Ponche de Frutas", "ponche_frutas", "copo:#e04a5a", "fria"), "fruitsalad": ("Salada de Frutas", "salada_frutas", "tigela:#e0603a", ""),
    "fudgesicle": ("Picolé de Chocolate", "picole_chocolate", "picole:#5a3220", "gelo"), "glazedcarrots": ("Cenouras Glaceadas", "cenouras_glaceadas", "prato:#f08a24", ""),
    "grilledcheeseandham": ("Misto-Quente", "misto_quente", "sanduiche:#e8a0a0", ""), "grilledcheese": ("Queijo Quente", "queijo_quente", "sanduiche:#f4c542", ""),
    "gummycreepers": ("Balas de Creeper", "balas_creeper", "graos:#4ac040", ""), "honeyglazeddonut": ("Rosquinha com Mel", "rosquinha_mel", "rosca:#f2b632", ""),
    "hotchocolate": ("Chocolate Quente", "chocolate_quente", "copo:#6a3a20", "quente"), "hotdog": ("Cachorro-Quente", "cachorro_quente", "sanduiche:#c8503a", ""),
    "icecream": ("Sorvete", "sorvete", "sorvete:#f8f4e8", "gelo"), "jellybeans": ("Jujubas", "jujubas", "graos:#e04a8a", ""),
    "macncheese": ("Macarrão com Queijo", "macarrao_queijo", "tigela:#f4c542", ""), "marshmellows": ("Marshmallows", "marshmallow", "bola:#f8f4f0", ""),
    "mashedpotatoes": ("Purê de Batata", "pure_batata", "tigela:#f0e0a0", ""), "meatloaf": ("Bolo de Carne", "bolo_carne", "pao:#8b3a2a", ""),
    "noodlesoup": ("Sopa de Macarrão", "sopa_macarrao", "tigela:#e8c070", "sopa"), "p8juice": ("Suco de Legumes P8", "suco_p8", "copo:#c83a2a", "fria"),
    "pasta": ("Macarrão", "macarrao", "massa:#f0d890", ""), "pickledbeets": ("Beterraba em Conserva", "beterraba_conserva", "pote:#9a1a3a", ""),
    "plaindonut": ("Rosquinha Simples", "rosquinha", "rosca:#d8a050", ""), "potatochips": ("Batata Chips", "batata_chips", "fritas:#f0d060", ""),
    "potatosoup": ("Sopa de Batata", "sopa_batata", "tigela:#e8d8a0", "sopa"), "potroast": ("Carne de Panela", "carne_panela", "tigela:#8b3a2a", "sopa"),
    "powdereddonut": ("Rosquinha Açucarada", "rosquinha_acucarada", "rosca:#f8f4f0", ""), "pumpkincheesecake": ("Cheesecake de Abóbora", "cheesecake_abobora", "bolo:#e38a1e", ""),
    "roastedsunflowerseeds": ("Sementes de Girassol Torradas", "girassol_torrado", "graos:#6a5a3a", ""), "scrambledegg": ("Ovos Mexidos", "ovos_mexidos", "prato:#f7d55c", ""),
    "smores": ("S'mores", "smores", "sanduiche:#d8b080", ""), "softpretzel": ("Pretzel", "pretzel", "rosca:#b0702a", ""),
    "sprinklesdonut": ("Rosquinha com Granulado", "rosquinha_granulado", "rosca:#f0a0c8", ""), "stew": ("Ensopado", "ensopado", "tigela:#9a5a2a", "sopa"),
    "sunflowerseeds": ("Sementes de Girassol", "semente_girassol", "graos:#3a3a3a", ""), "trailmix": ("Mix de Castanhas", "mix_castanhas", "graos:#a0703a", ""),
    "vinegar": ("Vinagre", "vinagre", "garrafa:#c8b890", ""), "yogurt": ("Iogurte", "iogurte", "pote:#f8f4ec", ""),
    "vegetablenoodlesoup": ("Sopa de Macarrão com Legumes", "sopa_macarrao_legumes", "tigela:#5aa03a", "sopa"),
    "carrotcake": ("Bolo de Cenoura", "bolo_cenoura", "bolo:#f08a24", ""), "chocolatecake": ("Bolo de Chocolate", "bolo_chocolate", "bolo:#5a3220", ""),
}
EN = {}  # nomes em inglês (do próprio mod)
for m in JAR:
    lang = ler(m, f"assets/{m}/lang/en_us.json") or {}
    for k, v in lang.items():
        EN[k.split(".")[-1]] = v.strip()


def nome_comida(item):
    """(slug, pt, icone, clima) de uma comida do Food Core."""
    b = item[:-4] if item.endswith("item") else item
    if b in MANUAL:
        return MANUAL[b][1], MANUAL[b][0], MANUAL[b][2], MANUAL[b][3]
    if b.startswith("cookedground"):
        c = b[len("cookedground"):]
        return f"moido_{CARNE[c][1]}_cozido", f"{MOIDO[c]} Cozido".replace("Moída Cozido", "Moída Cozida"), f"po:{CARNE[c][2]}", ""
    if b.startswith("ground"):
        c = b[len("ground"):]
        return f"moido_{CARNE[c][1]}", MOIDO[c], f"po:{CARNE[c][2]}", ""
    for suf, pt, slug, forma, clima in PADRAO_CARNE:
        for pre in ("grilled", "basic", ""):
            for c, (cpt, cslug, cor) in CARNE.items():
                if b == f"{pre}{c}{suf}":
                    return slug.format(cslug), pt.format(cpt), f"{forma}:{cor}", clima
    for suf, pt, slug, forma, clima in PADRAO:
        for s, (spt, sslug, cor) in SABOR.items():
            if b == f"{s}{suf}":
                return slug.format(sslug), pt.format(spt), f"{forma}:{cor}", clima
    raise SystemExit(f"sem nome: {item}")

# ---------- tabela de nomes: item do HC2 -> nosso ----------
MAPA = {}
for en, nosso in JA.items():
    MAPA[f"{en}item"] = f"cl:{nosso}"
for en, (slug, *_r) in CULT.items():
    MAPA[f"{en}item"] = f"cl:{slug}"
for en, (slug, *_r) in ARV.items():
    MAPA[f"{en}item"] = PRODUTO_ARV.get(en, f"cl:{slug}")
MAPA["maplesyrupitem"] = MAPA["mapleitem"]
MAPA["dateitem"] = "cl:tamara"
COMIDAS_ITENS = sorted(k.split(".")[-1] for k in json.loads(JAR["pamhc2foodcore"].read("assets/pamhc2foodcore/lang/en_us.json")) if k.startswith("item."))
FERRAMENTAS = {"potitem": "panela", "skilletitem": "frigideira", "saucepanitem": "cacarola", "bakewareitem": "assadeira", "cuttingboarditem": "tabua_corte",
               "grinderitem": "pilao", "mixingbowlitem": "tigela_mistura", "juiceritem": "espremedor", "rolleritem": "rolo"}
NOMES_COMIDA, REUSO = {}, {}
for it in COMIDAS_ITENS:
    if it in FERRAMENTAS:
        continue
    if it in JA_COMIDA:
        MAPA[it] = JA_COMIDA[it]
        continue
    slug, pt, icone, clima = nome_comida(it)
    if f"cl:{slug}" in EXISTE and (RAIZ / f"BP/items/{slug}.json").exists():
        MAPA[it] = f"cl:{slug}"  # o Farmer's Delight já tem: a receita do HC2 dá o mesmo item
        REUSO[it] = f"cl:{slug}"
        continue
    if f"cl:{slug}" in EXISTE and (RAIZ / f"BP/blocks/{slug}.json").exists():
        slug = f"hc_{slug}"  # no Farmer's Delight é bloco (torta de pôr na mesa); a do HC2 é item
    MAPA[it] = f"cl:{slug}"
    NOMES_COMIDA[it] = (slug, pt, icone, clima)

# Etiquetas próprias (o Bedrock não deixa pôr etiqueta em item do jogo: os do jogo entram como alternativas).
VEG = ["arrowroot", "artichoke", "asparagus", "bellpepper", "bokchoy", "broccoli", "brusselsprout", "cabbage", "calabash", "cassava", "cauliflower",
       "celery", "chilipepper", "cucumber", "eggplant", "garlic", "jicama", "kale", "kohlrabi", "leek", "lettuce", "lotus", "nettles", "nopales",
       "okra", "onion", "parsnip", "peanut", "peas", "radish", "rhubarb", "rutabaga", "scallion", "spinach", "sweetpotato", "taro", "tomatillo",
       "tomato", "turnip", "waterchestnut", "whitemushroom", "wintersquash", "zucchini", "avocado", "olive"]
FRUTA = ["blackberry", "blueberry", "cactusfruit", "candleberry", "cantaloupe", "cloudberry", "cranberry", "elderberry", "grape", "greengrape",
         "guarana", "huckleberry", "juniperberry", "kiwi", "mulberry", "pineapple", "raspberry", "strawberry", "wolfberry", "apricot", "banana",
         "breadfruit", "cherry", "date", "dragonfruit", "durian", "fig", "gooseberry", "grapefruit", "guava", "jackfruit", "lemon", "lime", "lychee",
         "mango", "orange", "papaya", "passionfruit", "pawpaw", "peach", "pear", "persimmon", "plum", "pomegranate", "rambutan", "soursop",
         "starfruit", "tamarind"]
NOZ = ["peanut", "acorn", "almond", "cashew", "chestnut", "hazelnut", "pecan", "pinenut", "pistachio", "walnut"]
# Farinha: as plantas novas (milho, arroz e feijão já têm a receita do pack no pilão).
FARINHA = ["amaranth", "arrowroot", "barley", "cassava", "cattail", "chickpea", "jicama", "lentil", "millet", "oats", "peas", "quinoa", "rutabaga",
           "rye", "soybean", "sunchoke", "taro", "acorn", "almond", "banana", "breadfruit", "cashew", "chestnut", "coconut", "hazelnut", "pecan",
           "pinenut", "pistachio", "walnut"]
GRAO = ["amaranth", "barley", "bean", "chickpea", "corn", "lentil", "oats", "quinoa", "rice", "rye", "sorghum", "soybean"]
FIBRA = ["cotton", "flax", "jute", "kenaf", "sisal", "yucca"]
PAPEL = ["blackberry", "juniperberry", "mulberry", "okra", "papyrus", "pineapple", "raspberry", "rice", "spiceleaf"]
ETIQUETAS = {}
for tag, lista in (("hc_vegetal", VEG), ("hc_fruta", FRUTA), ("hc_noz", NOZ), ("hc_farinha", FARINHA), ("hc_grao", GRAO), ("hc_fibra", FIBRA), ("hc_papel", PAPEL)):
    for en in lista:
        i = MAPA[f"{en}item"]
        if i.startswith("cl:"):
            ETIQUETAS.setdefault(i, []).append(f"cl:{tag}")
for i in ("cl:semente_girassol",):
    ETIQUETAS.setdefault(i, []).append("cl:hc_noz")
ETIQUETAS.setdefault("cl:cacto_barril", []).append("cl:hc_cacto")
ETIQUETAS.setdefault("cl:palma", []).append("cl:hc_cacto")

DYE = {"red", "green", "orange", "pink", "purple", "yellow", "blue"}
TAG = {
    "c:batter": ["cl:massa_liquida"], "c:bread": ["minecraft:bread"], "c:butter": ["cl:manteiga"], "c:caramel": ["cl:caramelo"], "c:cheese": ["cl:queijo"],
    "c:chocolatebar": ["cl:barra_chocolate"], "c:cocoapowder": ["cl:cacau_po"], "c:condiments": ["cl:maionese"], "c:cookedpork": ["minecraft:cooked_porkchop"],
    "c:cookies": ["minecraft:cookie"], "c:cookingoil": ["cl:oleo_cozinha"], "c:cracker": ["cl:bolacha"], "c:cream": ["cl:creme_leite"],
    "c:dough": ["cl:massa"], "c:egg": ["minecraft:egg"], "c:fishes": ["minecraft:cod", "minecraft:salmon"], "c:flour": ["cl:farinha"],
    "c:flour_plants": ["#cl:hc_farinha", "minecraft:potato"], "c:fruits": ["#cl:hc_fruta", "minecraft:apple", "minecraft:melon_slice", "minecraft:sweet_berries"],
    "c:groundmeats": ["#cl:hc_moido"], "c:honey": ["minecraft:honey_bottle"], "c:icecream": ["cl:sorvete"], "c:ices": ["minecraft:ice", "minecraft:snowball"],
    "c:ingots/copper": ["minecraft:copper_ingot"], "c:marshmellows": ["cl:marshmallow"], "c:milk": ["cl:leite_fresco", "minecraft:milk_bucket"],
    "c:nuts": ["#cl:hc_noz"], "c:pasta": ["cl:macarrao"], "c:rawbeef": ["minecraft:beef"], "c:rawchicken": ["minecraft:chicken"],
    "c:rawfish": ["minecraft:cod", "minecraft:salmon"], "c:rawmeats": ["minecraft:beef", "minecraft:porkchop", "minecraft:chicken"],
    "c:rawmutton": ["minecraft:mutton"], "c:rawpork": ["minecraft:porkchop"], "c:rawrabbit": ["minecraft:rabbit"], "c:rods/wooden": ["minecraft:stick"],
    "c:salt": ["cl:sal"], "c:seeds": ["minecraft:wheat_seeds", "#cl:hc_semente"], "c:stock": ["cl:caldo"], "c:stock_ingredients": ["minecraft:bone"],
    "c:sugar": ["minecraft:sugar"], "c:toast": ["cl:torrada"], "c:vegetables": ["#cl:hc_vegetal", "minecraft:carrot", "minecraft:potato", "minecraft:beetroot"],
    "c:vinegar": ["cl:vinagre"], "c:vinegar_ingredients": ["#cl:hc_fruta", "minecraft:apple"], "c:water": ["cl:agua_boa"], "c:yogurt": ["cl:iogurte"],
    "minecraft:logs": ["#minecraft:logs"], "minecraft:planks": ["#minecraft:planks"], "c:mushrooms": ["minecraft:brown_mushroom", "minecraft:red_mushroom", "cl:cogumelo_branco", "cl:trufa"],
    "c:grain": ["#cl:hc_grao"], "c:fiber": ["#cl:hc_fibra"], "c:paper_plants": ["#cl:hc_papel"], "c:cactus_plants": ["#cl:hc_cacto"],
}
VANILLA = {"minecraft:melon": "minecraft:melon_slice"}
for c, (_p, slug, _c) in CARNE.items():
    if c != "veggie":
        TAG[f"c:groundmeats/ground{c}"] = [f"cl:moido_{slug}"]
for s, (_p, slug, _c) in SABOR.items():
    TAG[f"c:jellies/{s}jelly"] = [f"cl:geleia_{slug}"]
    TAG[f"c:juices/{s}juice"] = [f"cl:suco_{slug}"]
VAN_CROP = {"apple": "apple", "beetroot": "beetroot", "carrot": "carrot", "chorusfruit": "chorus_fruit", "cocoabeans": "cocoa_beans", "glowberry": "glow_berries",
            "melon": "melon_slice", "potato": "potato", "pumpkin": "pumpkin", "sweetberry": "sweet_berries"}


def alternativas(ing):
    """Lista de alternativas de um ingrediente do HC2 (id ou #etiqueta nossa)."""
    if "item" in ing:
        i = ing["item"]
        if i.startswith("minecraft:"):
            return [VANILLA.get(i, i)]
        nome = i.split(":")[1]
        if nome not in MAPA:
            raise KeyError(i)
        return [MAPA[nome]]
    t = ing["tag"]
    if t.startswith("c:dyes/") and t[7:] in DYE:
        return [f"minecraft:{t[7:]}_dye"]
    if t.startswith("c:crops/"):
        n = t[8:].replace("_", "")
        if n in VAN_CROP:
            return [f"minecraft:{VAN_CROP[n]}"]
        return [MAPA[f"{n}item"]]
    if t in TAG:
        return TAG[t]
    raise KeyError(t)


def variantes(ings, limite=6):
    """Combinações das alternativas; ingredientes da mesma etiqueta escolhem juntos (até `limite`)."""
    grupos, ordem = {}, []
    for ing in ings:
        k = json.dumps(ing, sort_keys=True)
        if k not in grupos:
            grupos[k] = alternativas(ing)
            ordem.append(k)
    chaves = [json.dumps(i, sort_keys=True) for i in ings]
    res = []
    for escolha in itertools.product(*(range(len(grupos[k])) for k in ordem)):
        sel = dict(zip(ordem, escolha))
        res.append([grupos[k][sel[k]] for k in chaves])
        if len(res) >= limite:
            break
    return res


def receita(r):
    """(estação, variantes, quantidade) de uma receita sem forma do HC2."""
    ings = r.get("ingredients") or []
    em = ""
    resto = []
    for i in ings:
        t = i.get("tag", "") if isinstance(i, dict) else ""
        if t.startswith("c:tool_"):
            em = FERRAMENTAS[t[7:] + "item"]
        else:
            resto.append(i)
    return em, variantes(resto), r["result"].get("count", 1)

for c, (_p, slug, _c) in CARNE.items():
    if c != "veggie":
        ETIQUETAS.setdefault(f"cl:moido_{slug}", []).append("cl:hc_moido")

# ---------- hortas ----------
HORTAS = {"aridgarden": ("horta_arida", "Horta Árida", ["desert", "mesa"]), "frostgarden": ("horta_gelada", "Horta Gelada", ["taiga"]),
          "shadedgarden": ("horta_sombria", "Horta Sombria", ["forest"]), "soggygarden": ("horta_umida", "Horta Úmida", ["swamp"]),
          "tropicalgarden": ("horta_tropical", "Horta Tropical", ["jungle"]), "windygarden": ("horta_ventosa", "Horta Ventosa", ["plains", "savanna"])}
hortas, horta_de = [], {}
for g, (slug, pt, biomas) in HORTAS.items():
    loot = ler("pamhc2crops", f"data/pamhc2crops/loot_table/blocks/{g}.json")
    itens = [MAPA[e["name"].split(":")[1]] for p in loot["pools"] for e in p["entries"]]
    feat = ler("pamhc2crops", f"data/pamhc2crops/worldgen/configured_feature/{g.replace('garden', '_garden')}.json")["config"]
    base = g.replace("garden", "_garden")
    lugar = next(ler("pamhc2crops", n) for n in arquivos("pamhc2crops", f"data/pamhc2crops/worldgen/placed_feature/{base}_placed"))
    raridade = next(p["chance"] for p in lugar["placement"] if p["type"] == "minecraft:rarity_filter")
    hortas.append({"id": slug, "pt": pt, "en": EN[g], "itens": itens, "biomas": biomas, "tentativas": feat["tries"], "espalha": feat["xz_spread"],
                   "altura": feat["y_spread"], "raridade": raridade})
    for i in itens:
        horta_de.setdefault(i, slug)

# ---------- plantações novas ----------
culturas = []
for en, (slug, pt, forma, cor) in CULT.items():
    i = f"cl:{slug}"
    if i in EXISTE:
        print("aviso: já existe", i)
    culturas.append({"id": slug, "pt": pt, "en": EN.get(f"{en}item", en.title()), "forma": forma, "cor": cor,
                     "fome": ho(FOME.get(f"{en}item", 4)) if f"{en}item" in FOME else 0, "horta": horta_de.get(i),
                     **({"deserto": True} if horta_de.get(i) == "horta_arida" else {})})

# ---------- árvores ----------
GRUPO = {}
for f in arquivos("pamhc2trees", "data/pamhc2trees/neoforge/biome_modifier/"):
    d = json.loads(JAR["pamhc2trees"].read(f))
    s = json.dumps(d["biomes"])
    g = "conifera" if "coniferous" in s else "temperada" if "is_hot" in s else "quente"
    GRUPO[Path(f).stem.replace("_placed", "")] = g
arvores = []
for en, (slug, pt, forma, cor) in ARV.items():
    # (o mod grava a da goiaba como "gauva")
    feat = (ler("pamhc2trees", f"data/pamhc2trees/worldgen/configured_feature/{en}.json")
            or ler("pamhc2trees", f"data/pamhc2trees/worldgen/configured_feature/{en.replace('guava', 'gauva')}.json"))["config"]
    tronco = feat["trunk_provider"]["state"]["Name"]
    folha = feat["foliage_provider"]["state"]["Name"]
    tp = feat["trunk_placer"]
    lugar = ler("pamhc2trees", f"data/pamhc2trees/worldgen/placed_feature/{en}_placed.json")
    raridade = next(p["chance"] for p in lugar["placement"] if p["type"] == "minecraft:rarity_filter")
    nome_item = "maplesyrupitem" if en == "maple" else f"{en}item"
    arvores.append({"id": slug, "pt": pt, "en": EN_ARV.get(en, EN.get(nome_item, en.title())), "forma": forma, "cor": cor,
                    "produto": MAPA[nome_item], "fome": ho(FOME[nome_item]) if nome_item in FOME else 0,
                    "tronco": tronco, "folha": folha, "altura": [tp["base_height"], tp["height_rand_a"], tp["height_rand_b"]],
                    "grupo": GRUPO[en], "raridade": raridade, "no_tronco": en in ("cinnamon", "maple", "paperbark")})

# ---------- comidas (Food Core) e cozidos (Crops e Trees) ----------
comidas = {}
for it, (slug, pt, icone, clima) in NOMES_COMIDA.items():
    forma = icone.split(":")[0]
    bebida = forma == "copo"
    comidas[it] = {"id": slug, "pt": pt, "en": EN.get(it, it), "icone": icone, "fome": ho(FOME[it]) if it in FOME else 0,
                   **({"bebida": True} if bebida else {}),
                   **({"agua": 10, "temp": -0.05} if clima == "fria" else {"agua": 5, "temp": 0.05} if clima in ("sopa", "quente") else
                      {"temp": -0.05} if clima == "gelo" else {}), "receitas": []}
COZIDO = {"bakedarrowroot": ("araruta_assada", "Araruta Assada"), "bakedcassava": ("mandioca_assada", "Mandioca Assada"),
          "roastedgarlic": ("alho_assado", "Alho Assado"), "bakedjicama": ("jicama_assada", "Jicama Assada"), "roastedleek": ("alho_poro_assado", "Alho-Poró Assado"),
          "roastedkohlrabi": ("couve_rabano_assada", "Couve-Rábano Assada"), "roastedonion": ("cebola_assada", "Cebola Assada"),
          "bakedparsnip": ("pastinaca_assada", "Pastinaca Assada"), "roastedpeanut": ("amendoim_torrado", "Amendoim Torrado"),
          "roastedradish": ("rabanete_assado", "Rabanete Assado"), "roastedrhubarb": ("ruibarbo_assado", "Ruibarbo Assado"),
          "bakedrutabaga": ("nabo_sueco_assado", "Nabo-Sueco Assado"), "roastedscallion": ("cebolinha_assada", "Cebolinha Assada"),
          "bakedsweetpotato": ("batata_doce_assada", "Batata-Doce Assada"), "bakedtaro": ("inhame_assado", "Inhame Assado"),
          "bakedturnip": ("nabo_assado", "Nabo Assado"), "bakedwaterchestnut": ("castanha_dagua_assada", "Castanha-d'Água Assada"),
          "bakedsunchoke": ("tupinambo_assado", "Tupinambo Assado"), "roastedmushroom": ("cogumelo_assado", "Cogumelo Assado"),
          "hottea": ("cha_quente", "Chá Quente"), "hotcoffee": ("cafe_quente", "Café Quente"), "hotnettletea": ("cha_urtiga", "Chá de Urtiga"),
          "roastedchestnut": ("castanha_assada", "Castanha Assada"), "roastedhazelnut": ("avela_torrada", "Avelã Torrada"),
          "roastedwalnut": ("noz_torrada", "Noz Torrada"), "roastedalmond": ("amendoa_torrada", "Amêndoa Torrada"),
          "roastedcashew": ("caju_torrado", "Castanha-de-Caju Torrada"), "roastedpecan": ("peca_torrada", "Pecã Torrada"),
          "roastedpistachio": ("pistache_torrado", "Pistache Torrado"), "roastedpinenut": ("pinoli_torrado", "Pinoli Torrado"),
          "roastedacorn": ("bolota_assada", "Bolota Assada")}


def escurecer(cor, f=0.72):
    return "#" + "".join(f"{max(0, min(255, int(int(cor[i:i + 2], 16) * f))):02x}" for i in (1, 3, 5))


fornos = {}
for m in ("pamhc2crops", "pamhc2trees"):
    for f in arquivos(m, f"data/{m}/recipe/"):
        if not f.endswith("_forge.json"):
            continue
        r = ler(m, f)
        res = r["result"]["id"].split(":")[1]
        b = res[:-4]
        if b not in COZIDO or res in fornos:
            continue
        slug, pt = COZIDO[b]
        de = alternativas(r["ingredient"])
        base = de[0].split(":")[1]
        orig = next((v for v in list(CULT.values()) + list(ARV.values()) if v[0] == base), None)
        quente = b.startswith("hot")
        icone = f"copo:{'#6a3a20' if 'coffee' in b else '#7a9a3a'}" if quente else f"{orig[2] if orig else 'cogumelo'}:{escurecer(orig[3] if orig else '#9a7a5a')}"
        MAPA[res] = f"cl:{slug}"
        fornos[res] = {"id": slug, "pt": pt, "en": EN.get(res, res), "icone": icone, "fome": ho(FOME[res]) if res in FOME else 1,
                       **({"bebida": True, "agua": 5, "temp": 0.05} if quente else {}), "forno": de}

for f in arquivos("pamhc2foodcore", "data/minecraft/recipe/smelting_"):
    r = ler("pamhc2foodcore", f)
    nome = r["result"]["id"].split(":")[1]
    if nome in comidas:
        comidas[nome]["forno"] = alternativas(r["ingredient"])
# O HC2 não tem a do porco moído cozido (as outras carnes têm): a mesma receita.
comidas["cookedgroundporkitem"].setdefault("forno", ["cl:moido_porco"])
for f in arquivos("pamhc2foodcore", "data/pamhc2foodcore/recipe/"):
    r = ler("pamhc2foodcore", f)
    if not r or not r["type"].endswith("shapeless"):
        continue
    res = r["result"]["id"]
    nome = res.split(":")[1]
    if nome in comidas:
        comidas[nome]["receitas"].append(receita(r))
    elif nome in REUSO:
        comidas.setdefault(f"_{nome}", {"id": f"hc2_{REUSO[nome][3:]}", "resultado": REUSO[nome], "receitas": []})["receitas"].append(receita(r))
    elif nome == "flouritem" and "flour_plants" in f:
        comidas.setdefault("_farinha", {"mesmo": "farinha", "id": "farinha_hc2", "receitas": []})["receitas"].append(receita(r))
    elif res in ("minecraft:sugar",) and "honey" in f:
        comidas["_acucar"] = {"id": "acucar_mel", "resultado": "minecraft:sugar", "receitas": [receita(r)]}
# Variantes repetidas (mesma estação e mesmos ingredientes): fica a receita própria (variante 0), como a do suco de
# cenoura; a alternativa de etiqueta (o Suco P8 com 2 cenouras) sai.
todas = sorted(((k > 0, nome, r, k) for nome, c in comidas.items() for r, (_e, vs, _n) in enumerate(c["receitas"]) for k in range(len(vs))))
vistas, fora = set(), set()
for _alt, nome, r, k in todas:
    em, vs, _n = comidas[nome]["receitas"][r]
    chave = (em, tuple(sorted(vs[k])))
    if chave in vistas:
        fora.add((nome, r, k))
    vistas.add(chave)
for nome, r, k in sorted(fora, reverse=True):
    print("variante repetida fora:", comidas[nome]["id"], comidas[nome]["receitas"][r][1][k])
    del comidas[nome]["receitas"][r][1][k]
for nome, c in comidas.items():
    if not c["receitas"] and not c.get("forno"):
        print("aviso: sem receita", nome)
# Receitas das plantações (Crops) que dão itens do jogo ou da cozinha.
extras = []
for f in arquivos("pamhc2crops", "data/pamhc2crops/recipe/"):
    r = ler("pamhc2crops", f)
    if not r or not r["type"].endswith("shapeless") or "seeditem" in r["result"]["id"]:
        continue
    res = r["result"]["id"]
    alvo = res if res.startswith("minecraft:") else MAPA.get(res.split(":")[1])
    if res == "minecraft:bread" or not alvo:
        if res != "minecraft:bread":
            continue
    em, vs, n = receita(r)
    extras.append({"id": Path(f).stem, "resultado": alvo, "qtd": n, "em": em, "variantes": vs})

saida = {"_comentario": "1.47.0: Pam's HarvestCraft 2 (Crops, Trees e Food Core, 1.21.1), gerado por tools/importar-hc2.py. fome = Hunger Overhaul: "
                        "max(arredondar(fome do HC2 / 4), 1). agua/temp como na Fase 14.",
         "culturas": culturas, "hortas": hortas, "arvores": arvores, "comidas": list(comidas.values()), "fornos": list(fornos.values()),
         "extras": extras, "etiquetas": ETIQUETAS,
         "rolo": {"id": "rolo", "pt": "Rolo de Massa", "en": EN.get("rolleritem", "Roller"), "padrao": ["SLS"], "chave": {"S": "minecraft:stick", "L": "#minecraft:logs"}}}
(RAIZ / "tools/dados/hc2.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
ids = [c["id"] for c in culturas] + [a["id"] for a in arvores] + [c["id"] for c in comidas.values() if "resultado" not in c and "mesmo" not in c] + [c["id"] for c in fornos.values()]
dup = {i for i in ids if ids.count(i) > 1}
ja = sorted(i for i in ids if f"cl:{i}" in EXISTE)
print(f"hc2: {len(culturas)} plantações, {len(hortas)} hortas, {len(arvores)} árvores, {len(comidas)} comidas, {len(fornos)} no forno, {len(extras)} extras")
print("repetidos:", dup or "-", "| já existem:", ja or "-")

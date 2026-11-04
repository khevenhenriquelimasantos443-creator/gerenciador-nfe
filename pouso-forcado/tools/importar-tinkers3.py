# Tinkers' Construct 3.12.1 (SlimeKnights, MIT, inclusive a arte; github.com/SlimeKnights/TinkersConstruct, ramo 1.20.1, o
# mais novo) para o pack. 1.24.0: a arte das peças e das ferramentas. 1.26.0 (Tinkers completo, parte 1): também os dados
# — materiais (números de cada tipo de peça, nível, traço e nomes), peças (custo no Construtor de Peças) e ferramentas
# (peças, números base e multiplicadores, traços, área e ações) — em tools/dados/conteudo/tinkers3.json, lido por
# tinkers.mjs. A arte é a do mod pintada como o mod pinta: cada textura cinza vira a cor da paleta do material
# (grey_to_color), com a variante de cada material (cabeça de pedra, cabo de graveto, ligação primitiva...).
# Uso: python3 tools/importar-tinkers3.py <pasta do Tinkers clonado>
import json, os, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-tinkers3.py <pasta do Tinkers>")
GEN = os.path.join(SRC, "src/generated/resources")
MAIN = os.path.join(SRC, "src/main/resources")
T = os.path.join(MAIN, "assets/tconstruct/textures/item")
DADOS = os.path.join(GEN, "data/tconstruct/tinkering")
PT = json.load(open(os.path.join(MAIN, "assets/tconstruct/lang/pt_br.json")))
EN = json.load(open(os.path.join(MAIN, "assets/tconstruct/lang/en_us.json")))

# Material do TC3 -> id do pack. Os 12 primeiros já existiam (1.6.4/1.24.0); cacto e obsidiana não são cabeça no TC3 e
# ficam com o que tinham.
MATS = {
    "wood": "madeira", "rock": "pedra", "flint": "silex", "cactus": "cacto", "bone": "osso", "obsidian": "obsidiana",
    "iron": "ferro", "copper": "cobre", "bronze": "bronze", "steel": "aco", "rose_gold": "ouro_rosa", "amethyst_bronze": "bronze_ametista",
    "chorus": "coro", "seared_stone": "pedra_refrataria", "scorched_stone": "pedra_chamuscada", "slimewood": "madeira_slime",
    "venombone": "osso_venenoso", "necrotic_bone": "osso_necrotico", "osmium": "osmio", "pig_iron": "ferro_porco", "cobalt": "cobalto",
    "slimesteel": "aco_slime", "nahuatl": "nahuatl", "plated_slimewood": "madeira_slime_revestida", "whitestone": "pedra_branca",
    "hepatizon": "hepatizon", "manyullyn": "manyullyn", "queens_slime": "slime_rainha", "blazing_bone": "osso_blaze",
    "cinderslime": "slime_brasa", "knightslime": "slime_cavaleiro", "treated_wood": "madeira_tratada",
    # Só ligação (cordas e trepadeiras).
    "string": "corda", "leather": "couro", "vine": "trepadeira", "weeping_vine": "trepadeira_chorona", "twisting_vine": "trepadeira_retorcida",
    "darkthread": "linha_negra", "skyslime_vine": "trepadeira_slime_ceu", "enderslime_vine": "trepadeira_slime_ender",
}
ANTIGOS = ["madeira", "pedra", "silex", "cacto", "osso", "obsidiana", "ferro", "cobre", "bronze", "aco", "ouro_rosa", "bronze_ametista"]
NOME_PACK = {"pedra": ("Pedra", "Stone"), "cacto": ("Cacto", "Cactus"), "ouro_rosa": ("Ouro Rosa", "Rose Gold"), "pedra_branca": ("Pedra Branca", "Whitestone")}
NIVEL = {"wood": 0, "gold": 0, "stone": 1, "iron": 2, "diamond": 3, "netherite": 4}
# Os metais (derretem na Fundição; peça de metal só por molde, como no Iguana).
METAIS = {"ferro", "cobre", "bronze", "aco", "ouro_rosa", "bronze_ametista", "osmio", "ferro_porco", "cobalto", "aco_slime", "hepatizon",
          "manyullyn", "slime_rainha", "slime_brasa", "slime_cavaleiro"}
# Os números de antes de cacto e obsidiana (não são cabeça no TC3).
LEGADO = {"cacto": {"dur": 150, "vel": 5, "dano": 2, "nivel": 1, "cabo": 1.0}, "obsidiana": {"dur": 89, "vel": 7, "dano": 2, "nivel": 3, "cabo": 0.8}}

# Peça do TC3 -> id do pack, e o tipo de número que usa.
PECAS = {
    "pick_head": ("cabeca_picareta", "head"), "small_axe_head": ("cabeca_machado", "head"), "small_blade": ("lamina_espada", "head"),
    "adze_head": ("cabeca_enxo", "head"), "hammer_head": ("cabeca_martelo", "head"), "broad_blade": ("lamina_larga", "head"),
    "broad_axe_head": ("cabeca_machado_larga", "head"), "large_plate": ("placa_grande", "head"), "tool_binding": ("ligacao", "binding"),
    "tough_binding": ("ligacao_resistente", "binding"), "tool_handle": ("cabo", "handle"), "tough_handle": ("cabo_resistente", "handle"),
}
# Ferramenta do TC3 -> id do pack, o que quebra (tags do Bedrock), o encantamento e a área.
PICK, SHOVEL, AXE, HOE, SWORD = "minecraft:is_pickaxe_item_destructible", "minecraft:is_shovel_item_destructible", "minecraft:is_axe_item_destructible", "minecraft:is_hoe_item_destructible", "minecraft:is_sword_item_destructible"
FERR = {
    "pickaxe": ("picareta", [PICK], "pickaxe", None),
    "sledge_hammer": ("marreta", [PICK], "pickaxe", {"tipo": "caixa", "l": 3, "a": 3, "p": 1}),
    "vein_hammer": ("martelo_veio", [PICK], "pickaxe", {"tipo": "veio", "dist": 2}),
    "mattock": ("chibanca", [AXE, SHOVEL, HOE], "axe", None),
    "pickadze": ("picarenxo", [PICK, SHOVEL], "pickaxe", None),
    "excavator": ("escavadeira", [SHOVEL], "shovel", {"tipo": "caixa", "l": 3, "a": 3, "p": 1}),
    "hand_axe": ("machadinha", [AXE], "axe", None),
    "broad_axe": ("machado_largo", [AXE], "axe", {"tipo": "arvore", "coluna": 6}),
    "kama": ("kama", [HOE], "hoe", None),
    "scythe": ("foice", [HOE], "hoe", {"tipo": "caixa", "l": 3, "a": 3, "p": 3}),
    "dagger": ("adaga", [SWORD], "sword", None),
    "sword": ("espada_larga", [SWORD], "sword", None),
    "cleaver": ("espadao", [SWORD], "sword", None),
}
# Camadas de cada ícone: (textura, índice da peça), de baixo para cima (models/item/<ferramenta>.json do TC3).


def nome(chave, padrao):
    return PT.get(chave) or EN.get(chave) or padrao


def hexcor(argb):
    return "#" + argb[-6:].lower()


def paleta(tc, rend):
    """A paleta do material: a do gerador do TC3; sem ela, a da primeira variante (pedra comum, madeira de slime
    verde); com paleta de textura (slime da rainha), uma em degradê da cor do material."""
    t = rend.get("generator", {}).get("transformer") or {}
    pal = t.get("color_mapping", {}).get("palette", {})
    if pal:
        return pal
    pasta = os.path.join(GEN, f"assets/tconstruct/tinkering/materials/{tc}")
    if not t and os.path.isdir(pasta):
        for v in sorted(os.listdir(pasta), key=lambda a: (a not in ("stone.json", "greenheart.json"), a)):
            pv = json.load(open(os.path.join(pasta, v))).get("generator", {}).get("transformer", {}).get("color_mapping", {}).get("palette", {})
            if pv:
                return pv
    c = rend.get("color", "FF888888")[-6:]
    rgb = [int(c[i:i + 2], 16) for i in (0, 2, 4)]
    graus = {"000": 0, "063": 0.3, "102": 0.5, "140": 0.65, "178": 0.82, "216": 1.0}
    out = {k: "FF" + "".join(f"{min(255, int(v * f)):02X}" for v in rgb) for k, f in graus.items()}
    out["255"] = "FF" + "".join(f"{min(255, int(v + (255 - v) * 0.35)):02X}" for v in rgb)
    return out


# ---------- Materiais ----------
mats = {}
for tc, pid in MATS.items():
    st = json.load(open(os.path.join(DADOS, f"materials/stats/{tc}.json")))["stats"]
    df = json.load(open(os.path.join(DADOS, f"materials/definition/{tc}.json")))
    tr = os.path.join(DADOS, f"materials/traits/{tc}.json")
    tr = json.load(open(tr)) if os.path.exists(tr) else {}
    rend = json.load(open(os.path.join(GEN, f"assets/tconstruct/tinkering/materials/{tc}.json")))
    pal = paleta(tc, rend)
    h, hd = st.get("tconstruct:head"), st.get("tconstruct:handle")
    pt_, en_ = NOME_PACK.get(pid, (nome(f"material.tconstruct.{tc}", tc), EN.get(f"material.tconstruct.{tc}", tc)))
    m = {"tc": tc, "pt": pt_, "en": en_, "tier": df.get("tier", 0), "cor": hexcor(pal.get("216", rend.get("color", "FF888888"))),
         "paleta": {k: hexcor(v) for k, v in pal.items()}, "variantes": rend.get("fallbacks", []),
         "tracos": [x["name"].split(":")[1] for x in tr.get("default", [])], "antigo": pid in ANTIGOS, "metal": pid in METAIS}
    if h:
        m.update(dur=h["durability"], vel=h["mining_speed"], dano=h["melee_attack"], nivel=NIVEL[h["mining_tier"].split(":")[1]])
    elif pid in LEGADO:
        m.update(LEGADO[pid])
    if hd:
        m["cabo"] = round(1 + hd["durability"], 3)
    elif pid in LEGADO:
        m["cabo"] = LEGADO[pid]["cabo"]
    m["ligacao"] = "tconstruct:binding" in st
    m["cabeca"] = bool(h) or pid in LEGADO
    mats[pid] = m

# ---------- Peças ----------
custos = {}
for f in os.listdir(os.path.join(GEN, "data/tconstruct/recipes/tools/parts/builder")):
    j = json.load(open(os.path.join(GEN, "data/tconstruct/recipes/tools/parts/builder", f)))
    r = j["result"]
    custos[(r["item"] if isinstance(r, dict) else r).split(":")[1]] = j["cost"]
pecas = {}
for tc, (pid, stat) in PECAS.items():
    pecas[pid] = {"tc": tc, "pt": nome(f"item.tconstruct.{tc}", tc), "en": EN.get(f"item.tconstruct.{tc}", tc), "custo": custos[tc], "stat": stat}

# ---------- Ferramentas ----------
ferr = {}
for tc, (pid, tags, slot, area) in FERR.items():
    d = json.load(open(os.path.join(DADOS, f"tool_definitions/{tc}.json")))
    f = {"tc": tc, "pt": nome(f"item.tconstruct.{tc}", tc), "en": EN.get(f"item.tconstruct.{tc}", tc), "tags": tags, "slot": slot, "base": {}, "mult": {}, "tracos": [], "espacos": {}}
    for mod in d["modules"]:
        t = mod["type"].split(":")[1]
        if t == "part_stats":
            f["pecas"] = [PECAS[(p if isinstance(p, str) else p.get("item") or p.get("part")).split(":")[1]][0] for p in mod["parts"]]
        elif t == "base_stats":
            f["base"] = {k.split(":")[1]: v for k, v in mod["stats"].items()}
        elif t == "multiply_stats":
            f["mult"] = {k.split(":")[1]: v for k, v in mod["multipliers"].items()}
        elif t == "traits":
            f["tracos"] = [[x["name"].split(":")[1], x["level"]] for x in mod["traits"]]
        elif t == "modifier_slots":
            f["espacos"] = mod["slots"]
    if area:
        f["area"] = area
    # A cabeça (a peça 0) dá o material do ícone e do item.
    modelo = json.load(open(os.path.join(MAIN, f"assets/tconstruct/models/item/{tc}.json")))
    f["camadas"] = [[modelo["textures"][p["name"]].split("item/")[1], p.get("index", 0)] for p in modelo["parts"]]
    ferr[pid] = f

# ---------- Traços (nomes e descrições do mod) ----------
tracos = {}
for m in mats.values():
    for t in m["tracos"]:
        tracos[t] = 1
for f in ferr.values():
    for t, _ in f["tracos"]:
        tracos[t] = 1
tracos = {t: {"pt": nome(f"modifier.tconstruct.{t}", t), "en": EN.get(f"modifier.tconstruct.{t}", t),
              "dpt": PT.get(f"modifier.tconstruct.{t}.description") or EN.get(f"modifier.tconstruct.{t}.description", ""),
              "den": EN.get(f"modifier.tconstruct.{t}.description", "")} for t in sorted(tracos)}

# Que peças cada material faz (as do pack de antes continuam para os materiais de antes).
json.dump({"materiais": mats, "pecas": pecas, "ferramentas": ferr, "tracos": tracos},
          open(os.path.join(R, "tools/dados/conteudo/tinkers3.json"), "w"), ensure_ascii=False, indent=1)


# ---------- Arte ----------
def abrir(rel):
    p = os.path.join(T, rel + ".png")
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def variante(rel, m):
    """A textura da variante do material (head_rock, handle_stick...), como o TC3 escolhe."""
    for v in [f"tconstruct_{m['tc']}"] + m["variantes"]:
        im = abrir(f"{rel}_{v}")
        if im:
            return im
    return abrir(rel)


def pintar(im, m):
    """grey_to_color: o cinza de cada pixel vira a cor da paleta (interpolada entre os degraus)."""
    pal = sorted((int(k), tuple(int(v[i:i + 2], 16) for i in (1, 3, 5))) for k, v in m["paleta"].items()) or [(0, (0, 0, 0)), (255, (255, 255, 255))]
    px = im.load()
    out = Image.new("RGBA", im.size)
    po = out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a:
                continue
            c = (r + g + b) // 3
            lo = max((p for p in pal if p[0] <= c), default=pal[0])
            hi = min((p for p in pal if p[0] >= c), default=pal[-1])
            t = 0 if hi[0] == lo[0] else (c - lo[0]) / (hi[0] - lo[0])
            po[x, y] = tuple(int(lo[1][i] + (hi[1][i] - lo[1][i]) * t) for i in range(3)) + (a,)
    return out


PECA_ARTE = {"cabo": "tool/parts/tool_handle", "ligacao": "tool/parts/tool_binding", "cabeca_picareta": "tool/pickaxe/head",
             "cabeca_machado": "tool/hand_axe/head", "lamina_espada": "tool/parts/small_blade", "cabeca_enxo": "tool/pickadze/adze",
             "cabeca_martelo": "tool/sledge_hammer/head", "lamina_larga": "tool/cleaver/head", "cabeca_machado_larga": "tool/broad_axe/blade",
             "placa_grande": "tool/parts/large_plate", "cabo_resistente": "tool/parts/tough_handle", "ligacao_resistente": "tool/parts/tough_binding",
             # Peças só do pack de antes.
             "cabeca_pa": "tool/excavator/head", "guarda_larga": "tool/sword/guard", "travessa": "tool/parts/tough_binding"}
# Peças do pack de antes só para os materiais de antes; as outras só para quem tem o número daquele tipo.
SO_ANTIGAS = {"cabeca_pa", "guarda_larga", "travessa"}


def serve(p, pid, m):
    if pid in ANTIGOS and (p in SO_ANTIGAS or p in ("cabo", "ligacao", "cabeca_picareta", "cabeca_machado", "lamina_espada", "cabeca_martelo", "placa_grande", "cabo_resistente", "ligacao_resistente", "cabeca_machado_larga")):
        return True
    if p in SO_ANTIGAS or pid in LEGADO:
        return False
    stat = pecas[p]["stat"]
    return m["cabeca"] if stat == "head" else ("cabo" in m) if stat == "handle" else m["ligacao"]


saida = os.path.join(R, "RP/textures/items/cl/arte")
os.makedirs(saida, exist_ok=True)
usados = []
madeira = mats["madeira"]
for pid, m in mats.items():
    for p, rel in PECA_ARTE.items():
        if not serve(p, pid, m):
            continue
        im = variante(rel, m)
        if im is None:
            continue
        pintar(im, m).resize((16, 16), Image.NEAREST).save(os.path.join(saida, f"peca_{p}_{pid}.png"))
        usados.append(f"peca_{p}_{pid}")
    if not m["cabeca"]:
        continue
    for fid, f in ferr.items():
        # Cacto e obsidiana não são cabeça no TC3: só as ferramentas de antes.
        if pid in LEGADO and fid not in ("picareta", "machadinha", "espada_larga", "marreta", "escavadeira", "machado_largo"):
            continue
        base = None
        for rel, idx in f["camadas"]:
            stat = pecas[f["pecas"][idx]]["stat"] if idx < len(f["pecas"]) else "head"
            mm = m if stat == "head" else madeira
            im = variante(rel, mm)
            if im is None:
                continue
            im = pintar(im, mm)
            base = im if base is None else Image.alpha_composite(base.resize(im.size), im)
        if base:
            base.resize((16, 16), Image.NEAREST).save(os.path.join(saida, f"{fid}_{pid}.png"))
            usados.append(f"{fid}_{pid}")
# A Pá do pack de antes (não existe no TC3): cabeça da escavadeira num cabo.
for pid, m in mats.items():
    if pid in ANTIGOS and m["cabeca"]:
        a, b = variante("tool/pickaxe/handle", madeira), variante("tool/excavator/head", m)
        if a and b:
            Image.alpha_composite(pintar(a, madeira), pintar(b, m)).resize((16, 16), Image.NEAREST).save(os.path.join(saida, f"pa_{pid}.png"))
            usados.append(f"pa_{pid}")
LINGOTES = {"lingote_ouro_rosa": "materials/rose_gold_ingot", "lingote_bronze_ametista": "materials/amethyst_bronze_ingot",
            "lingote_cobalto": "materials/cobalt_ingot", "lingote_ferro_porco": "materials/pigiron_ingot", "lingote_hepatizon": "materials/hepatizon_ingot",
            "lingote_manyullyn": "materials/manyullyn_ingot", "lingote_slime_rainha": "materials/queens_slime_ingot", "lingote_aco_slime": "materials/slimesteel_ingot",
            "lingote_slime_brasa": "materials/cinderslime_ingot", "lingote_slime_cavaleiro": "materials/knightslime_ingot",
            "pepita_cobalto": "materials/cobalt_nugget", "cobalto_bruto": "materials/raw_cobalt", "osso_necrotico": "materials/necrotic_bone",
            "osso_blaze": "materials/blazing_bone", "nahuatl": "materials/nahuatl", "osso_venenoso": "materials/venombone", "tijolo_chamuscado": "materials/scorched_brick"}
for pid, rel in LINGOTES.items():
    im = abrir(rel)
    if im:
        im.save(os.path.join(saida, f"{pid}.png"))
        usados.append(pid)
# 1.26.0: os blocos (minério de cobalto, blocos de metal, nahuatl).
B = os.path.join(MAIN, "assets/tconstruct/textures/block")
BLOCOS = {"minerio_cobalto": "cobalt_ore", "bloco_cobalto": "storage/cobalt", "bloco_cobalto_bruto": "storage/raw_cobalt", "bloco_manyullyn": "storage/manyullyn",
          "bloco_hepatizon": "storage/hepatizon", "bloco_aco_slime": "storage/slimesteel", "bloco_slime_brasa": "storage/cinderslime",
          "bloco_slime_cavaleiro": "storage/knightslime", "bloco_slime_rainha": "storage/queens_slime_side", "bloco_ferro_porco": "storage/pig_iron/front",
          "nahuatl": "wood/nahuatl"}
saida_b = os.path.join(R, "RP/textures/blocks/cl/arte")
for pid, rel in BLOCOS.items():
    p = os.path.join(B, rel + ".png")
    if os.path.exists(p):
        im = Image.open(p).convert("RGBA")
        (im.crop((0, 0, im.width, im.width)) if im.height > im.width else im).save(os.path.join(saida_b, f"{pid}.png"))
        usados.append(pid)
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["tinkers3"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
with open(os.path.join(R, "docs/licencas/tinkers3.txt"), "w") as g:
    g.write("Tinkers' Construct 3.12.1 (SlimeKnights), github.com/SlimeKnights/TinkersConstruct, ramo 1.20.1. Código, texturas e binários: MIT.\n\n")
    g.write(open(os.path.join(SRC, "LICENSE")).read())
print(f"tinkers 3: {len(mats)} materiais, {len(pecas)} peças, {len(ferr)} ferramentas, {len(tracos)} traços, {len(usados)} artes")

# Powah! (owmii, LGPL-3.0) para o pack (1.18.0): lê o código-fonte do mod (github.com/owmii/Powah, ramo master) e
# grava o que o pack usa:
# - tools/dados/conteudo/powah.json: as receitas de bancada e do Orbe Energizador (traduzidas para os ids do pack) e os
#   números de cada nível (geração, capacidade), do código do mod (config/*.java);
# - a arte original dos itens e das faces dos blocos (RP/textures/items/cl/arte e RP/textures/blocks/cl/arte), que o
#   build põe no lugar dos desenhos gerados; o lado das máquinas leva a marca do nível por cima (<nível>_ov.png),
#   como no mod;
# - docs/licencas/powah.txt e a lista docs/licencas/usados.json.
# Uso: python3 tools/importar-powah.py <pasta do Powah clonado>
import json, os, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-powah.py <pasta do Powah>")
ASSETS = os.path.join(SRC, "src/main/resources/assets/powah/textures")
RECEITAS = os.path.join(SRC, "src/main/resources/data/powah/recipes")

NIVEIS = [("starter", "inicial", "Inicial", "Starter"), ("basic", "basico", "Básico", "Basic"), ("hardened", "endurecido", "Endurecido", "Hardened"),
          ("blazing", "ardente", "Ardente", "Blazing"), ("niotic", "niotico", "Niótico", "Niotic"), ("spirited", "espiritual", "Espiritual", "Spirited"),
          ("nitro", "nitro", "Nitro", "Nitro")]
ITENS = {
    "dielectric_paste": "pasta_dieletrica", "dielectric_casing": "involucro_dieletrico", "dielectric_rod": "haste_dieletrica",
    "dielectric_rod_horizontal": "haste_dieletrica", "capacitor_basic_tiny": "capacitor_pw_minusculo", "capacitor_basic": "capacitor_pw_basico",
    "capacitor_basic_large": "capacitor_pw_grande", "steel_energized": "aco_energizado", "photoelectric_pane": "painel_fotoeletrico",
    "thermoelectric_plate": "placa_termoeletrica",
}
for en, pt, _, _ in NIVEIS[2:]:
    ITENS[f"capacitor_{en}"] = f"capacitor_pw_{pt}"
for en, pt, _, _ in NIVEIS[3:]:
    ITENS[f"crystal_{en}"] = f"cristal_{pt}"
BLOCOS = {"energized_steel_block": "bloco_aco_energizado", "energizing_orb": "orbe_energizador"}
for en, pt, _, _ in NIVEIS[3:]:
    BLOCOS[f"{en}_crystal_block"] = f"bloco_cristal_{pt}"
MAQUINAS = {"furnator": "furnator", "magmator": "magmator", "thermo_generator": "termogerador", "solar_panel": "painel_solar",
            "energy_cell": "celula_powah", "energy_cable": "cabo_powah", "energizing_rod": "haste_energizadora"}
for en, pt, _, _ in NIVEIS:
    for a, b in MAQUINAS.items():
        BLOCOS[f"{a}_{en}"] = f"{b}_{pt}"
POWAH = {**ITENS, **BLOCOS}
# As receitas do mod chamam alguns blocos por outro nome.
POWAH.update({f"cable_{en}": f"cabo_powah_{pt}" for en, pt, _, _ in NIVEIS})
TAGS = {
    "forge:ingots/iron": "minecraft:iron_ingot", "forge:ingots/gold": "minecraft:gold_ingot", "forge:glass": "minecraft:glass",
    "forge:glass_panes": "minecraft:glass_pane", "forge:gems/quartz": "minecraft:quartz", "forge:storage_blocks/quartz": "minecraft:quartz_block",
    "forge:gems/diamond": "minecraft:diamond", "forge:gems/emerald": "minecraft:emerald", "forge:nether_stars": "minecraft:nether_star",
    "forge:storage_blocks/redstone": "minecraft:redstone_block", "forge:dusts/redstone": "minecraft:redstone", "forge:nuggets/iron": "minecraft:iron_nugget",
    "forge:ingots/gold_nugget": "minecraft:gold_nugget", "minecraft:coals": "#minecraft:coals",
}


def item(ing):
    """Ingrediente do mod -> id do pack (ou None se o pack não tem)."""
    if isinstance(ing, list):
        ing = ing[0]
    if "tag" in ing:
        return TAGS.get(ing["tag"])
    i = ing["item"]
    if i.startswith("minecraft:"):
        return i
    nome = i.split(":", 1)[1]
    return f"cl:{POWAH[nome]}" if nome in POWAH else None


receitas, pulou = [], []
for arq in sorted(os.listdir(os.path.join(RECEITAS, "crafting"))):
    j = json.load(open(os.path.join(RECEITAS, "crafting", arq)))
    res = j["result"]["item"].split(":", 1)[1]
    if res not in POWAH or arq.startswith("dielectric_rod_h"):
        pulou.append(arq)
        continue
    r = {"id": f"pw_{arq[:-5]}", "resultado": f"cl:{POWAH[res]}", "qtd": j["result"].get("count", 1)}
    if "pattern" in j:
        chave = {k: item(v) for k, v in j["key"].items()}
        if None in chave.values():
            pulou.append(arq)
            continue
        r.update(tipo="shaped", padrao=j["pattern"], chave=chave)
    else:
        ings = [item(i) for i in j["ingredients"]]
        if None in ings:
            pulou.append(arq)
            continue
        r.update(tipo="shapeless", ingredientes=ings)
    receitas.append(r)
energizar = []
for arq in sorted(os.listdir(os.path.join(RECEITAS, "energizing"))):
    j = json.load(open(os.path.join(RECEITAS, "energizing", arq)))
    res = j["result"]["item"].split(":", 1)[1]
    ings = [item(i) for i in j["ingredients"]]
    if res not in POWAH or None in ings:
        pulou.append(f"energizing/{arq}")
        continue
    energizar.append({"entradas": ings, "rf": j["energy"], "resultado": f"cl:{POWAH[res]}", "qtd": j["result"].get("count", 1)})

# Números do código (config/*.java): por nível, de Inicial a Nitro, em FE (= RF).
numeros = {
    "furnator": {"geracao": [15, 70, 180, 400, 900, 2000, 4800], "capacidade": [10000, 100000, 500000, 900000, 2000000, 5000000, 10000000]},
    "magmator": {"geracao": [15, 70, 180, 400, 900, 2000, 4800], "capacidade": [10000, 100000, 500000, 900000, 2000000, 5000000, 10000000]},
    "termogerador": {"geracao": [3, 8, 18, 42, 90, 200, 800]},
    "painel_solar": {"geracao": [5, 12, 40, 90, 220, 500, 1200]},
    "celula_powah": {"capacidade": [100000, 1000000, 4000000, 10000000, 25000000, 60000000, 140000000]},
    "haste_energizadora": {"transferencia": [10, 50, 120, 300, 700, 1200, 3000]},
    "combustivelPorTick": 30,  # GeneralConfig.fuelTicks: carvão (1.600) = 48.000 FE
    "lavaPorBalde": 100000,  # MagmatorConfig: lava = 10.000 por 100 mB
    "calor": {"minecraft:lava": 1000, "minecraft:flowing_lava": 1000, "minecraft:magma": 800, "cl:bloco_cristal_ardente": 2800},
    "alcanceOrbe": 4,
}
saida = {"niveis": [[pt, ptn, enn] for _, pt, ptn, enn in NIVEIS], "receitas": receitas, "energizar": energizar, "numeros": numeros}
json.dump(saida, open(os.path.join(R, "tools/dados/conteudo/powah.json"), "w"), ensure_ascii=False, indent=1)

# ---------- Arte ----------
def abrir(rel):
    im = Image.open(os.path.join(ASSETS, rel)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def salvar(im, rel):
    destino = os.path.join(R, rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino)


def com_nivel(base, en):
    """A face com a marca do nível por cima (como o mod desenha o lado das máquinas)."""
    im = base.copy()
    try:
        im.alpha_composite(abrir(f"block/{en}_ov.png").resize(im.size))
    except FileNotFoundError:
        pass
    return im


usados = []
for en, pt in {k: v for k, v in ITENS.items() if k != "dielectric_rod_horizontal"}.items():
    salvar(abrir(f"item/{en}.png"), f"RP/textures/items/cl/arte/{pt}.png")
    usados.append(pt)
B = "RP/textures/blocks/cl/arte"
for en, pt in (("energized_steel_block", "bloco_aco_energizado"), *[(f"{e}_crystal_block", f"bloco_cristal_{p}") for e, p, _, _ in NIVEIS[3:]]):
    salvar(abrir(f"block/{en}.png"), f"{B}/{pt}.png")
    usados.append(pt)
# O orbe: a textura cinza do mod tingida de azul-claro com o vidro por cima (o vidro sozinho é quase transparente).
orbe = abrir("block/energizing_orb.png")
orbe = Image.merge("RGBA", (orbe.getchannel("R").point(lambda v: int(v * 0.75)), orbe.getchannel("G").point(lambda v: int(v * 0.95)), orbe.getchannel("B"), orbe.getchannel("A")))
orbe.alpha_composite(abrir("block/energizing_orb_glass.png").resize(orbe.size))
salvar(orbe, f"{B}/orbe_energizador.png")
usados.append("orbe_energizador")
for en, pt, _, _ in NIVEIS:
    faces = {
        f"furnator_{pt}": {"frente": abrir("block/furnator_unlit.png"), "lado": com_nivel(abrir("block/furnator_side.png"), en), "topo": abrir("block/furnator_top.png")},
        f"magmator_{pt}": {"frente": abrir("block/magmator_face_unlit.png"), "lado": com_nivel(abrir("block/magmator_side.png"), en), "topo": abrir("block/magmator_top.png")},
        f"termogerador_{pt}": {"frente": abrir(f"block/thermo_generator_{en}_core.png"), "lado": abrir(f"block/thermo_generator_{en}_core.png"),
                               "topo": abrir(f"block/thermo_generator_{en}_top.png"),
                               "baixo": abrir("block/thermo_generator_starter_heater.png" if en == "starter" else "block/thermo_generator_heater.png")},
    }
    topo_solar = abrir("block/solar_panel_starter_top.png" if en == "starter" else "block/solar_panel_top.png")
    topo_solar.alpha_composite(abrir(f"block/solar_panel_{en}_frame.png").resize(topo_solar.size))
    faces[f"painel_solar_{pt}"] = {"frente": abrir(f"block/solar_panel_{en}_frame.png"), "lado": abrir(f"block/solar_panel_{en}_frame.png"), "topo": topo_solar}
    for i, fs in faces.items():
        fs.setdefault("baixo", fs["topo"])
        for f, im in fs.items():
            salvar(im, f"{B}/{i}_{f}.png")
        usados.append(i)
    salvar(abrir(f"block/energy_cell_{en}.png"), f"{B}/celula_powah_{pt}.png")
    usados.append(f"celula_powah_{pt}")
    salvar(abrir(f"block/energizing_rod_{en}_gem.png") if os.path.exists(os.path.join(ASSETS, f"block/energizing_rod_{en}_gem.png")) else abrir("block/energizing_rod.png"), f"{B}/haste_energizadora_{pt}.png")
    usados.append(f"haste_energizadora_{pt}")

os.makedirs(os.path.join(R, "docs/licencas"), exist_ok=True)
with open(os.path.join(SRC, "LICENSE")) as f, open(os.path.join(R, "docs/licencas/powah.txt"), "w") as g:
    g.write(f.read())
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["powah"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
print(f"powah: {len(receitas)} receitas, {len(energizar)} do orbe, {len(usados)} artes; puladas: {len(pulou)}")

# Create 6.0.11 (simibubi e equipe; github.com/Creators-of-Create/Create, ramo mc1.21.1/dev, o mais novo) para o pack
# (1.23.0). Código MIT; a arte do Create é "todos os direitos reservados", então fica a do pack.
# Lê as receitas geradas do mod (Mó, Rodas Trituradoras, Prensa, Misturador, lavagem e assombração do Ventilador, e as
# de bancada das peças que o pack tem) e grava tools/dados/conteudo/create.json com os ids do pack. Saídas que o pack não
# tem saem da receita (a principal fica). Uso: python3 tools/importar-create.py <pasta do Create clonado>
import json, os, re, sys

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-create.py <pasta do Create>")
REC = os.path.join(SRC, "src/generated/resources/data/create/recipe")
PT = json.load(open(os.path.join(SRC, "src/main/resources/assets/create/lang/pt_br.json")))
EN = json.load(open(os.path.join(SRC, "src/generated/resources/assets/create/lang/en_us.json")))

CRUS = {"iron": "ferro", "gold": "ouro", "copper": "cobre", "zinc": "zinco"}
MAPA = {
    "wheat_flour": "farinha", "iron_sheet": "chapa_ferro", "copper_sheet": "chapa_cobre", "golden_sheet": "chapa_ouro", "brass_sheet": "chapa_latao",
    "brass_ingot": "lingote_latao", "zinc_ingot": "lingote_zinco", "andesite_alloy": "liga_andesita", "powdered_obsidian": "po_obsidiana",
    "shaft": "eixo", "cogwheel": "engrenagem", "large_cogwheel": "engrenagem_grande", "andesite_casing": "revestimento_andesita",
    "gearbox": "caixa_engrenagens", "hand_crank": "manivela", "water_wheel": "roda_dagua", "windmill_bearing": "rolamento_moinho",
    "white_sail": "vela_moinho", "rotation_speed_controller": "controlador_velocidade", "millstone": "mo", "crushing_wheel": "rodas_trituradoras",
    "mechanical_press": "prensa_mecanica", "whisk": "batedor", "mechanical_mixer": "misturador_mecanico", "propeller": "helice",
    "encased_fan": "ventilador", "mechanical_drill": "furadeira", "experience_nugget": "pepita_experiencia", "cinder_flour": "farinha_cinzas",
    "dough": "massa",
    **{f"crushed_raw_{en}": f"triturado_{pt}" for en, pt in CRUS.items()},
}
NOVOS = {"experience_nugget": "pepita_experiencia", "cinder_flour": "farinha_cinzas"}  # a massa é a do HarvestCraft
TAGS = {
    "c:ingots/iron": "minecraft:iron_ingot", "c:ingots/gold": "minecraft:gold_ingot", "c:ingots/copper": "minecraft:copper_ingot",
    "c:ingots/zinc": "cl:lingote_zinco", "c:ingots/brass": "cl:lingote_latao", "c:nuggets/iron": "minecraft:iron_nugget",
    "c:nuggets/zinc": None, "c:plates/iron": "cl:chapa_ferro", "c:plates/copper": "cl:chapa_cobre", "c:plates/brass": "cl:chapa_latao",
    "c:plates/gold": "cl:chapa_ouro", "minecraft:logs": "minecraft:oak_log", "minecraft:planks": "#minecraft:planks", "minecraft:wooden_slabs": "minecraft:oak_slab",
    "minecraft:wool": "minecraft:white_wool", "c:dusts/redstone": "minecraft:redstone", "c:obsidians": "minecraft:obsidian", "c:stones": "minecraft:stone",
    "c:cobblestones": "minecraft:cobblestone", "c:gravels": "minecraft:gravel", "c:sands": "minecraft:sand", "c:raw_materials/iron": "minecraft:raw_iron",
    "c:raw_materials/gold": "minecraft:raw_gold", "c:raw_materials/copper": "minecraft:raw_copper", "c:raw_materials/zinc": "cl:zinco_bruto",
    "c:ores/iron": "minecraft:iron_ore", "c:ores/gold": "minecraft:gold_ore", "c:ores/copper": "minecraft:copper_ore", "c:crops/wheat": "minecraft:wheat",
    "c:rods/wooden": "minecraft:stick", "c:seeds/wheat": "minecraft:wheat_seeds", "c:gems/quartz": "minecraft:quartz",
    "c:storage_blocks/raw_iron": "minecraft:raw_iron_block", "c:storage_blocks/raw_gold": "minecraft:raw_gold_block",
    "c:storage_blocks/raw_copper": "minecraft:raw_copper_block",
}


def um(x):
    if isinstance(x, list):
        alts = [a for a in (um(i) for i in x) if a]
        return alts[0] if alts else None
    if isinstance(x, dict):
        if "tag" in x:
            return TAGS.get(x["tag"])
        return um(x.get("item") or x.get("id", ""))
    if x.startswith("#"):
        return TAGS.get(x[1:])
    if ":" not in x:
        return None
    ns, nome = x.split(":", 1)
    if ns == "minecraft":
        return x
    if ns == "create" and MAPA.get(nome):
        return f"cl:{MAPA[nome]}"
    return None


def todos(pasta):
    for raiz, _, arqs in os.walk(os.path.join(REC, pasta)):
        for a in sorted(arqs):
            if a.endswith(".json"):
                yield a[:-5], json.load(open(os.path.join(raiz, a)))


proc, pulou = {}, []
for tipo in ("milling", "crushing", "pressing", "mixing", "splashing", "haunting"):
    lista = []
    for nome, j in todos(tipo):
        ings = [um(i) for i in j.get("ingredients", []) if "fluid" not in i and "amount" not in i]
        if not ings or None in ings or any("fluid" in i or "amount" in i for i in j.get("ingredients", [])):
            pulou.append(f"{tipo}/{nome}")
            continue
        sai = []
        for r in j["results"]:
            s = um(r.get("id", r.get("item", "")))
            if s:
                sai.append([s, r.get("count", 1), r.get("chance", 1)])
        if not sai or sai[0][2] < 1:
            pulou.append(f"{tipo}/{nome}")
            continue
        lista.append({"entra": ings, "sai": sai, "calor": j.get("heat_requirement")})
    proc[tipo] = lista

receitas = []
for nome, j in todos("crafting"):
    t = j.get("type", "")
    res = j.get("result", {})
    s = um(res.get("id", "")) if isinstance(res, dict) else None
    if not s or not s.startswith("cl:"):
        continue
    r = {"id": "cr6_" + re.sub(r"[^a-z0-9_]", "_", nome), "resultado": s, **({"qtd": res["count"]} if res.get("count", 1) > 1 else {})}
    if t == "minecraft:crafting_shaped":
        chave = {k: um(v) for k, v in j["key"].items()}
        if None in chave.values():
            pulou.append("bancada/" + nome)
            continue
        w = max(len(l) for l in j["pattern"])
        r.update(tipo="shaped", padrao=[l.ljust(w) for l in j["pattern"]], chave=chave)
    elif t == "minecraft:crafting_shapeless":
        ings = [um(i) for i in j["ingredients"]]
        if None in ings:
            pulou.append("bancada/" + nome)
            continue
        r.update(tipo="shapeless", ingredientes=ings)
    else:
        continue
    receitas.append(r)
vistos, unicas = set(), []
for r in receitas:
    if r["resultado"] in vistos:
        continue
    vistos.add(r["resultado"])
    unicas.append(r)
itens = []
for c, pid in NOVOS.items():
    k = f"item.create.{c}"
    itens.append({"id": pid, "pt": PT.get(k, EN.get(k, c)), "en": EN.get(k, c)})
json.dump({"processos": proc, "receitas": unicas, "itens": itens}, open(os.path.join(R, "tools/dados/conteudo/create.json"), "w"), ensure_ascii=False, indent=1)
print("create 6: " + ", ".join(f"{k} {len(v)}" for k, v in proc.items()) + f", {len(unicas)} receitas de bancada; puladas {len(pulou)}")
print("  bancada puladas:", [p for p in pulou if p.startswith("bancada/")][:30])

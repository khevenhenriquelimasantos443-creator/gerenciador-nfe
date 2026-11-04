# 1.38.0: receitas e números do Immersive Engineering 12.4 (o mais novo, 1.21.1; BluSunrize e equipe, código GPLv3; a
# arte pede permissão, então é própria) para as máquinas novas da fase 57 (tools/dados/ie12.json).
# Lê src/generated/resources/data/immersiveengineering/recipe (prensa, triturador, serraria, espremedor, fermentador,
# refinaria, combustíveis, termelétrico e campânula) e troca as tags e os itens do Java pelos do pack/do Bedrock; a
# receita cujo item não existe aqui fica de fora.
# Uso: python3 tools/importar-ie12.py <clone do IE (branch 1.21.1)>
import json, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
REC = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-ie12.py <clone do IE>")) / "src/generated/resources/data/immersiveengineering/recipe"
EXISTE = {f"cl:{p.stem}" for p in (RAIZ / "BP/items").glob("*.json")} | {f"cl:{p.stem}" for p in (RAIZ / "BP/blocks").glob("*.json")}
NOVOS = {"cl:po_salitre", "cl:balde_oleo_vegetal", "cl:balde_etanol", "cl:balde_biodiesel", "cl:molde_chapa", "cl:molde_engrenagem", "cl:molde_haste", "cl:molde_desembalar"}

METAIS = {
    "iron": {"ingots": ["minecraft:iron_ingot"], "dusts": ["cl:po_ferro"], "plates": ["cl:placa_ferro"], "gears": ["cl:engrenagem_ferro"],
             "ores": ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"], "raw_materials": ["minecraft:raw_iron"], "raw_block": ["minecraft:raw_iron_block"]},
    "gold": {"ingots": ["minecraft:gold_ingot"], "dusts": ["cl:po_ouro"], "plates": ["cl:chapa_ouro"], "gears": ["cl:engrenagem_ouro"],
             "ores": ["minecraft:gold_ore", "minecraft:deepslate_gold_ore"], "raw_materials": ["minecraft:raw_gold"], "raw_block": ["minecraft:raw_gold_block"]},
    "copper": {"ingots": ["minecraft:copper_ingot"], "dusts": ["cl:po_cobre"], "plates": ["cl:placa_cobre"],
               "ores": ["minecraft:copper_ore", "minecraft:deepslate_copper_ore"], "raw_materials": ["minecraft:raw_copper"], "raw_block": ["minecraft:raw_copper_block"]},
    "tin": {"ingots": ["cl:lingote_estanho"], "dusts": ["cl:po_estanho"], "plates": ["cl:placa_estanho"]},
    "steel": {"ingots": ["cl:lingote_aco"], "dusts": ["cl:po_aco"], "plates": ["cl:placa_aco"]},
    "aluminum": {"ingots": ["cl:lingote_aluminio"], "plates": ["cl:placa_aluminio"]},
    "bronze": {"ingots": ["cl:lingote_bronze"], "plates": ["cl:placa_bronze"]},
    "brass": {"ingots": ["cl:lingote_latao"], "plates": ["cl:chapa_latao"]},
    "osmium": {"ingots": ["cl:lingote_osmio"], "dusts": ["cl:po_osmio"]},
}
TAGS = {
    "c:rods/blaze": ["minecraft:blaze_rod"], "c:gems/lapis": ["minecraft:lapis_lazuli"], "c:cobblestones": ["minecraft:cobblestone", "minecraft:cobbled_deepslate"],
    "c:gravels": ["minecraft:gravel"], "c:glass_blocks": ["minecraft:glass"], "c:sandstone/uncolored_blocks": ["minecraft:sandstone"],
    "c:sandstone/red_blocks": ["minecraft:red_sandstone"], "c:storage_blocks/clay": ["minecraft:clay"], "c:coal_coke": ["cl:coque"],
    "c:storage_blocks/coal_coke": ["cl:bloco_coque"], "c:dusts/coal": ["cl:po_carvao"], "c:slag": ["cl:escoria"], "c:dusts/wood": ["cl:serragem"],
    "c:dusts/saltpeter": ["cl:po_salitre"], "c:ores/coal": ["minecraft:coal_ore", "minecraft:deepslate_coal_ore"],
    "c:ores/diamond": ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"], "c:ores/emerald": ["minecraft:emerald_ore", "minecraft:deepslate_emerald_ore"],
    "c:ores/lapis": ["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"], "c:ores/redstone": ["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore"],
    "c:ores/quartz": ["minecraft:quartz_ore"], "c:sands": ["minecraft:sand", "minecraft:red_sand"], "c:crops/beetroot": ["minecraft:beetroot"],
    "c:crops/potato": ["minecraft:potato"],
    "minecraft:wool": [f"minecraft:{c}_wool" for c in ("white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan",
                                                          "purple", "blue", "brown", "green", "red", "black")],
}
for m, d in METAIS.items():
    for k, v in d.items():
        TAGS[f"c:storage_blocks/raw_{m}" if k == "raw_block" else f"c:{k}/{m}"] = v
# Itens com outro nome no Bedrock ou no pack.
TROCA = {"minecraft:melon": "minecraft:melon_block", "minecraft:moss": "minecraft:moss_block", "minecraft:nether_gold_ore": "minecraft:nether_gold_ore",
         "immersiveengineering:seed": "cl:semente_canhamo", "immersiveengineering:hemp_fiber": "cl:fibra_canhamo", "immersiveengineering:slag": "cl:escoria",
         "immersiveengineering:coal_coke": "cl:coque"}


def ids(x):
    """Ingrediente ou resultado do IE -> lista de ids daqui (vazia se não existe)."""
    if isinstance(x, list):
        return [i for y in x for i in ids(y)]
    if "basePredicate" in x:
        return ids(x["basePredicate"])
    if "base_ingredient" in x:
        return ids(x["base_ingredient"])
    if "tag" in x:
        return list(TAGS.get(x["tag"], []))
    i = x.get("item") or x.get("id")
    if not i:
        return []
    i = TROCA.get(i, i)
    if i.startswith("cl:") and i not in EXISTE and i not in NOVOS:
        return []
    return [] if i.startswith("immersiveengineering:") else [i]


def qtd(x):
    return x.get("count", x.get("amount", 1)) if isinstance(x, dict) else 1


def ler(pasta):
    for f in sorted((REC / pasta).glob("*.json")):
        yield f.stem, json.loads(f.read_text(encoding="utf-8"))


MOLDES = {"mold_plate": "molde_chapa", "mold_gear": "molde_engrenagem", "mold_rod": "molde_haste", "mold_unpacking": "molde_desembalar"}
prensa, triturador, serraria = [], [], []
for nome, r in ler("metalpress"):
    molde = MOLDES.get(r["mold"].split(":")[1])
    ent, sai = ids(r["input"]), ids(r["result"])
    if molde and ent and sai:
        prensa.append({"molde": f"cl:{molde}", "entrada": ent, "qtd": qtd(r["input"]), "saida": sai[0], "n": qtd(r["result"]), "rf": r["energy"]})
for nome, r in ler("crusher"):
    ent, sai = ids(r["input"]), ids(r["result"])
    if not ent or not sai:
        continue
    extras = [[ids(s["output"])[0], s["chance"]] for s in r.get("secondaries", []) if ids(s["output"])]
    triturador.append({"entrada": ent, "saida": sai[0], "n": qtd(r["result"]), "extras": extras, "rf": r["energy"]})
for nome, r in ler("sawmill"):
    ent, sai = ids(r["input"]), ids(r["result"])
    if ent and sai:
        serraria.append({"entrada": ent, "saida": sai[0], "n": qtd(r["result"]), "serragem": len(r.get("secondaries", r.get("secondaryOutputs", []))) + len(r.get("strippingSecondaries", [])), "rf": r["energy"]})
espremedor = {i: r["fluid"]["amount"] for _, r in ler("squeezer") if "fluid" in r for i in ids(r["input"])}
fermentador = {i: [r["fluid"]["amount"], (ids(r["result"]) or [None])[0] if "result" in r else None] for _, r in ler("fermenter") for i in ids(r["input"])}
rf_espremedor = next(r["energy"] for _, r in ler("squeezer") if "fluid" in r)
rf_fermentador = next(r["energy"] for _, r in ler("fermenter"))
bio = dict(ler("refinery"))["biodiesel"]
combustivel = {n: r["burnTime"] for n, r in ler("generator_fuel")}
termo = {}
for _, r in ler("thermoelectric"):
    for i in ([r["singleBlock"]] if "singleBlock" in r else TAGS.get(r.get("blockTag", ""), {"minecraft:snow": ["minecraft:snow"]}.get(r.get("blockTag"), []))):
        termo[i] = r["tempKelvin"]
# Fluidos do jogo (temperatura do FluidType do Java): água 300 K, lava 1300 K.
termo.update({"minecraft:water": 300, "minecraft:flowing_water": 300, "minecraft:lava": 1300, "minecraft:flowing_lava": 1300})
campanula = []
for nome, r in ler("cloche"):
    sem, solo = ids(r["input"]), ids(r["soil"])
    saidas = []
    for s in r["results"]:
        o = s.get("output", s)
        i = ids(o)
        if i:
            saidas.append([i[0], qtd(o), s.get("chance", 1)])
    if sem and solo and saidas:
        campanula.append({"semente": sem[0], "solo": solo, "saidas": saidas, "tempo": r["time"]})

saida = {
    "prensa": prensa, "triturador": triturador, "serraria": serraria,
    "espremedor": espremedor, "rfEspremedor": rf_espremedor, "fermentador": fermentador, "rfFermentador": rf_fermentador,
    "refinaria": {"oleo": bio["input0"]["amount"], "etanol": bio["input1"]["amount"], "biodiesel": bio["result"]["amount"], "rf": bio["energy"]},
    "combustivel": {"cl:balde_biodiesel": combustivel["biodiesel"], "cl:balde_creosoto": combustivel["creosote"]},
    "termo": termo, "campanula": campanula,
}
(RAIZ / "tools/dados/ie12.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
print("ie 12.4:", {k: len(v) if isinstance(v, (list, dict)) else v for k, v in saida.items()})

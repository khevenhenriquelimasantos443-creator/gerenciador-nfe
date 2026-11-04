# 1.42.0: receitas e números do Thermal Expansion 11 (o mais novo, branch 1.20.x; CoFH; arte "todos os direitos
# reservados", então própria) para a fase 61 (tools/dados/thermal11.json): Insolador Fitogênico e Pirolisador, e os
# combustíveis dos dínamos (ThermalCore: data/thermal/recipes/fuels).
# Uso: python3 tools/importar-thermal11.py <clone do ThermalExpansion 1.20.x> <clone do ThermalCore 1.20.x>
import json, subprocess, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
TE, TC = (Path(a) for a in sys.argv[1:3]) if len(sys.argv) > 2 else sys.exit("uso: python3 tools/importar-thermal11.py <ThermalExpansion> <ThermalCore>")


def arquivos(repo, pasta):
    out = subprocess.run(["git", "-C", str(repo), "ls-tree", "-r", "--name-only", "HEAD"], capture_output=True, check=True, text=True).stdout.split()
    for p in out:
        if f"/{pasta}/" in p and p.endswith(".json"):
            yield Path(p).stem, json.loads(subprocess.run(["git", "-C", str(repo), "show", f"HEAD:{p}"], capture_output=True, check=True).stdout)


TROCA = {"minecraft:melon": "minecraft:melon_block", "minecraft:sugar_cane": "minecraft:sugar_cane"}
TAGS = {"minecraft:logs": [f"minecraft:{m}_log" for m in ("oak", "spruce", "birch", "jungle", "acacia", "dark_oak", "mangrove", "cherry")]}


def ids(x):
    if "tag" in x:
        return TAGS.get(x["tag"], [])
    i = TROCA.get(x.get("item", ""), x.get("item", ""))
    return [i] if i.startswith("minecraft:") else []


insolador = []
for nome, r in arquivos(TE, "insolator"):
    ent = ids(r["ingredient"]) if "ingredient" in r else []
    saidas = [[TROCA.get(o["item"], o["item"]), o.get("chance", 1)] for o in r.get("result", []) if "item" in o and o["item"].startswith("minecraft:")]
    if ent and saidas:
        insolador.append({"entrada": ent[0], "saidas": saidas, "energia": round(20000 * r.get("energy_mod", 1))})
pirolisador = []
for nome, r in arquivos(TE, "pyrolyzer"):
    ent = ids(r["ingredient"]) if "ingredient" in r else []
    itens = [[{"thermal:coal_coke": "cl:coque"}.get(o["item"], o["item"]), o.get("chance", 1)] for o in r.get("result", []) if "item" in o]
    itens = [i for i in itens if i[0].startswith(("minecraft:", "cl:"))]
    creosoto = sum(o["amount"] for o in r.get("result", []) if o.get("fluid") == "thermal:creosote")
    if ent and itens:
        pirolisador.append({"entrada": ent, "saidas": itens, "creosoto": creosoto, "energia": r.get("energy", 2000)})
comb = {}
for nome, r in arquivos(TC, "fuels"):
    comb[nome] = r
GEMA = {"forge:gems/diamond": ["minecraft:diamond"], "forge:gems/emerald": ["minecraft:emerald"], "forge:gems/lapis": ["minecraft:lapis_lazuli"],
        "forge:gems/quartz": ["minecraft:quartz"], "forge:gems/amethyst": ["minecraft:amethyst_shard"], "forge:gems/prismarine": ["minecraft:prismarine_crystals"],
        "forge:gems/sapphire": ["cl:safira_lunar"], "forge:coal_coke": ["cl:coque"], "forge:storage_blocks/coal_coke": ["cl:bloco_coque"]}


def combustivel(prefixo):
    m = {}
    for nome, r in comb.items():
        if not nome.startswith(prefixo):
            continue
        ing = r["ingredient"]
        alvo = GEMA.get(ing.get("tag", ""), []) or ([ing["item"]] if ing.get("item", "").startswith("minecraft:") else [])
        for i in alvo:
            m[i] = r["energy"]
    return m


saida = {
    "insolador": insolador, "pirolisador": pirolisador,
    "stirling": combustivel("stirling_"), "lapidario": combustivel("lapidary_"), "gourmand": combustivel("gourmand_"),
    "magmatico": {"minecraft:lava_bucket": comb["magmatic_lava"]["energy"]},
    "desencantamento": combustivel("disenchantment_"),
    "potencia": 40,  # RF/t base dos dínamos (SingleItemFuelManager/SingleFluidFuelManager: basePower = 40)
    "gourmandPorFome": 1600, "desencantamentoBase": 16000,
}
(RAIZ / "tools/dados/thermal11.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1), encoding="utf-8")
print("thermal 11:", {k: len(v) if isinstance(v, (list, dict)) else v for k, v in saida.items()})

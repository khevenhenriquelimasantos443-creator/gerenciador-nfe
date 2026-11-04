#!/usr/bin/env python3
"""1.34.0: Farmer's Delight 1.3.0 (o mais novo, MC 26.1; vectorwing, MIT, inclusive a arte).

Uso: python3 tools/importar-farmers.py <clone do FarmersDelight (ramo 26.1)>
Lê FoodValues.java (fome e saturação), as receitas (bancada, panela e tábua) dos itens que o pack ainda não tinha e
copia a arte. Grava tools/dados/conteudo/farmers26.json (a fase 53 usa).
"""
import json, re, shutil, sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
M = Path(sys.argv[1])
TEX = next(M.glob("**/assets/farmersdelight/textures"))
GEN = next(M.glob("src/generated/resources/data/farmersdelight/recipe"))
MAIN = M / "src/main/resources/data/farmersdelight/recipe"
fv = next(M.glob("**/FoodValues.java")).read_text()
COMIDA = {n.lower(): (int(a), float(b)) for n, a, b in re.findall(r"FoodProperties (\w+) = \(new FoodProperties\.Builder\(\)\)\s*\.nutrition\((\d+)\)\.saturationModifier\(([\d.]+)F?f?\)", fv)}

# Os do FD que o pack já tem (nome do FD -> id do pack).
TEM = {
    "tomato": "cl:tomate", "cabbage": "cl:repolho", "onion": "cl:cebola", "rice": "cl:arroz", "cabbage_leaf": "cl:folha_repolho",
    "straw": "cl:palha", "canvas": "cl:lona", "rope": "cl:corda", "tomato_sauce": "cl:molho_tomate", "fried_egg": "cl:ovo_frito",
    "wheat_dough": "cl:massa", "raw_pasta": "cl:macarrao_cru", "pumpkin_slice": "cl:fatia_abobora", "minced_beef": "cl:carne_moida",
    "beef_patty": "cl:hamburguer_carne", "chicken_cuts": "cl:pedacos_frango", "cooked_chicken_cuts": "cl:pedacos_frango_cozidos",
    "bacon": "cl:bacon", "cooked_bacon": "cl:bacon_cozido", "cod_slice": "cl:fatia_bacalhau", "cooked_cod_slice": "cl:fatia_bacalhau_cozida",
    "salmon_slice": "cl:fatia_salmao", "cooked_salmon_slice": "cl:fatia_salmao_cozida", "mutton_chops": "cl:costeleta_carneiro",
    "cooked_mutton_chops": "cl:costeleta_carneiro_cozida", "cooked_rice": "cl:arroz_cozido", "bone_broth": "cl:caldo_osso",
    "mixed_salad": "cl:salada_mista", "fruit_salad": "cl:salada_frutas", "cooking_pot": "cl:panela_cozinha", "cutting_board": "cl:tabua_cortar",
    "stove": "cl:fogao", "cabbage_seeds": "cl:semente_repolho", "tomato_seeds": "cl:semente_tomate", "rice_panicle": "cl:semente_arroz",
    "flint_knife": "cl:faca_silex", "iron_knife": "cl:faca_ferro", "golden_knife": "cl:faca_ouro", "diamond_knife": "cl:faca_diamante",
    "straw_bale": "cl:fardo_palha", "rice_bag": "cl:saco_arroz", "c:foods/bread": "minecraft:bread",
}
# Os novos (nome do FD -> id do pack, pt).
NOVOS = {
    "ham": ("presunto", "Presunto"), "smoked_ham": ("presunto_defumado", "Presunto Defumado"), "pie_crust": ("massa_torta", "Massa de Torta"),
    "milk_bottle": ("garrafa_leite", "Garrafa de Leite"), "hot_cocoa": ("chocolate_quente", "Chocolate Quente"), "apple_cider": ("sidra_maca", "Sidra de Maçã"),
    "melon_juice": ("suco_melancia", "Suco de Melancia"), "cake_slice": ("fatia_bolo", "Fatia de Bolo"),
    "apple_pie_slice": ("fatia_torta_maca", "Fatia de Torta de Maçã"), "sweet_berry_cheesecake_slice": ("fatia_cheesecake", "Fatia de Cheesecake de Frutas Vermelhas"),
    "chocolate_pie_slice": ("fatia_torta_chocolate", "Fatia de Torta de Chocolate"), "pumpkin_pie_slice": ("fatia_torta_abobora", "Fatia de Torta de Abóbora"),
    "sweet_berry_cookie": ("biscoito_frutas", "Biscoito de Frutas Vermelhas"), "honey_cookie": ("biscoito_mel", "Biscoito de Mel"),
    "melon_popsicle": ("picole_melancia", "Picolé de Melancia"), "glow_berry_custard": ("creme_baga_brilhante", "Creme de Baga Brilhante"),
    "salmon_roll": ("rolinho_salmao", "Rolinho de Salmão"), "cod_roll": ("rolinho_bacalhau", "Rolinho de Bacalhau"),
    "kelp_roll": ("rolo_alga", "Rolo de Alga"), "kelp_roll_slice": ("fatia_rolo_alga", "Fatia de Rolo de Alga"), "nether_salad": ("salada_nether", "Salada do Nether"),
    "roast_chicken": ("prato_frango_assado", "Prato de Frango Assado"), "stuffed_pumpkin": ("tigela_abobora_recheada", "Tigela de Abóbora Recheada"),
    "honey_glazed_ham": ("prato_presunto_mel", "Prato de Presunto com Mel"), "shepherds_pie": ("prato_torta_pastor", "Prato de Torta do Pastor"),
    "gleaming_salad": ("tigela_salada_brilhante", "Tigela de Salada Brilhante"), "dog_food": ("racao_cachorro", "Ração de Cachorro"),
    "horse_feed": ("racao_cavalo", "Ração de Cavalo"), "rotten_tomato": ("tomate_podre", "Tomate Podre"), "tree_bark": ("casca_arvore", "Casca de Árvore"),
    "netherite_knife": ("faca_netherita", "Faca de Netherita"), "organic_compost": ("composto_organico", "Composto Orgânico"),
    "rich_soil": ("solo_rico", "Solo Rico"), "rich_soil_farmland": ("terra_arada_rica", "Terra Arada Rica"), "safety_net": ("rede_seguranca", "Rede de Segurança"),
    "canvas_rug": ("tapete_lona", "Tapete de Lona"), "tatami": ("tatame", "Tatame"), "rice_bale": ("fardo_arroz", "Fardo de Arroz"),
    "wooden_basket": ("cesto", "Cesto"), "bamboo_basket": ("cesto_bambu", "Cesto de Bambu"),
    "apple_pie": ("torta_maca", "Torta de Maçã"), "sweet_berry_cheesecake": ("cheesecake", "Cheesecake de Frutas Vermelhas"),
    "chocolate_pie": ("torta_chocolate", "Torta de Chocolate"), "pumpkin_pie": ("torta_abobora_fd", "Torta de Abóbora"),
    "roast_chicken_block": ("frango_assado", "Frango Assado"), "stuffed_pumpkin_block": ("abobora_recheada", "Abóbora Recheada"),
    "honey_glazed_ham_block": ("presunto_mel", "Presunto com Mel"), "shepherds_pie_block": ("torta_pastor", "Torta do Pastor"),
    "gleaming_salad_block": ("salada_brilhante", "Salada Brilhante"), "rice_roll_medley_block": ("travessa_rolinhos", "Travessa de Rolinhos"),
    "brown_mushroom_colony": ("colonia_cogumelo_marrom", "Colônia de Cogumelo Marrom"), "red_mushroom_colony": ("colonia_cogumelo_vermelho", "Colônia de Cogumelo Vermelho"),
    "sandy_shrub": ("arbusto_arenoso", "Arbusto Arenoso"), "wild_cabbages": ("repolho_selvagem", "Repolho Selvagem"), "wild_tomatoes": ("tomateiro_selvagem", "Tomateiro Selvagem"),
    "wild_onions": ("cebola_selvagem", "Cebola Selvagem"), "wild_carrots": ("cenoura_selvagem", "Cenoura Selvagem"), "wild_potatoes": ("batata_selvagem", "Batata Selvagem"),
    "wild_beetroots": ("beterraba_marinha", "Beterraba Marinha"), "wild_rice": ("arroz_selvagem", "Arroz Selvagem"),
    **{f"{w}_cabinet": (f"armario_{p}", f"Armário de {n}") for w, p, n in [("oak", "carvalho", "Carvalho"), ("birch", "betula", "Bétula"), ("spruce", "pinheiro", "Pinheiro"),
       ("jungle", "selva", "Selva"), ("acacia", "acacia", "Acácia"), ("dark_oak", "carvalho_escuro", "Carvalho Escuro"), ("mangrove", "mangue", "Mangue"),
       ("cherry", "cerejeira", "Cerejeira"), ("bamboo", "bambu", "Bambu"), ("crimson", "carmesim", "Carmesim"), ("warped", "distorcido", "Distorcido")]},
}
lang = json.loads(next(M.glob("**/lang/en_us.json")).read_text())
en = lambda k: lang.get(f"item.farmersdelight.{k}") or lang.get(f"block.farmersdelight.{k}") or k


JAVA_BEDROCK = {"minecraft:oak_trapdoor": "minecraft:trapdoor"}


def nosso(ref):
    ref = JAVA_BEDROCK.get(ref, ref)
    if ref.startswith("farmersdelight:"):
        k = ref.split(":")[1]
        if k in TEM:
            return TEM[k]
        if k in NOVOS:
            return "cl:" + NOVOS[k][0]
        return None
    return ref


TAGS = {"c:crops/wheat": "minecraft:wheat", "c:drinks/milk": "minecraft:milk_bucket", "c:eggs": "minecraft:egg", "c:crops/tomato": "cl:tomate",
        "c:crops/cabbage": "cl:repolho", "c:crops/onion": "cl:cebola", "c:crops/rice": "cl:arroz", "c:foods/raw_beef": "minecraft:beef",
        "c:foods/raw_chicken": "minecraft:chicken", "c:foods/raw_pork": "minecraft:porkchop", "c:foods/raw_mutton": "minecraft:mutton",
        "c:foods/cooked_chicken": "minecraft:cooked_chicken", "c:foods/cooked_rice": "cl:arroz_cozido", "c:foods/milk": "minecraft:milk_bucket",
        "minecraft:planks": "#minecraft:planks", "c:rods/wooden": "minecraft:stick", "minecraft:logs": "#minecraft:logs", "c:foods/dough": "cl:massa",
        "c:foods/pasta": "cl:macarrao_cru", "c:foods/raw_fish": "minecraft:cod", "c:foods/safe_raw_fish": "minecraft:cod", "c:crops/beetroot": "minecraft:beetroot",
        "c:crops/carrot": "minecraft:carrot", "c:crops/potato": "minecraft:potato", "c:foods/vegetable": "minecraft:carrot", "c:foods/leafy_green": "cl:repolho",
        "c:foods/cooked_beef": "minecraft:cooked_beef", "c:foods/cooked_pork": "minecraft:cooked_porkchop", "c:foods/cooked_mutton": "minecraft:cooked_mutton",
        "c:foods/raw_cod": "minecraft:cod", "c:foods/raw_salmon": "minecraft:salmon", "c:foods/cooked_cod": "minecraft:cooked_cod",
        "c:foods/cooked_salmon": "minecraft:cooked_salmon", "c:strings": "minecraft:string", "c:ingots/iron": "minecraft:iron_ingot",
        "c:crops/pumpkin": "minecraft:pumpkin", "c:mushrooms": "minecraft:brown_mushroom", "c:foods/berry": "minecraft:sweet_berries",
        "c:foods/fruit": "minecraft:apple", "minecraft:wooden_slabs": "minecraft:oak_slab", "c:ingots/netherite": "minecraft:netherite_ingot",
        "c:gems/diamond": "minecraft:diamond", "c:crops": "minecraft:wheat", "c:foods/bread": "minecraft:bread", "c:foods/cooked_egg": "cl:ovo_frito", "c:foods/raw_meat": "minecraft:beef", "c:foods/cooked_meat": "minecraft:cooked_beef"}


def ingr(x):
    if isinstance(x, list):
        return ingr(x[0])
    if isinstance(x, str):
        return TAGS.get(x[1:], None) if x.startswith("#") else nosso(x)
    if "item" in x:
        return nosso(x["item"])
    if "tag" in x:
        return TAGS.get(x["tag"])
    return None


receitas, panela, corte = [], [], {}
alvo = {"cl:" + v[0] for v in NOVOS.values()}
for arq in list(GEN.glob("*.json")) + list(MAIN.glob("*.json")) + list(GEN.glob("cooking/*.json")) + list(GEN.glob("cutting/*.json")):
    r = json.loads(arq.read_text())
    t = r.get("type", "")
    if t == "farmersdelight:cooking":
        sai = nosso(r["result"]["id"])
        ing = [ingr(i) for i in r["ingredients"]]
        if sai in alvo and all(ing):
            panela.append({"sai": sai, "n": r["result"].get("count", 1), "ingr": [[i] for i in ing], "tempo": r.get("cookingtime", 200), "recipiente": nosso(r.get("container", {}).get("id", "")) if r.get("container") else None})
    elif t == "farmersdelight:cutting":
        de = ingr(r["ingredients"][0])
        saidas = [(nosso(s["item"]["id"]), s["item"].get("count", 1), s.get("chance", 1)) for s in r["result"]]
        if de and any(s[0] in alvo for s in saidas if s[0]):
            corte.setdefault(de, []).extend([[a, b, c] for a, b, c in saidas if a])
    elif t in ("minecraft:crafting_shaped", "minecraft:crafting_shapeless"):
        sai = nosso(r["result"]["id"])
        if sai not in alvo:
            continue
        if t.endswith("shaped"):
            chave = {k: ingr(v) for k, v in r["key"].items()}
            if all(chave.values()):
                receitas.append({"id": arq.stem, "tipo": "shaped", "padrao": r["pattern"], "chave": chave, "resultado": sai, "qtd": r["result"].get("count", 1)})
        else:
            ing = [ingr(i) for i in r["ingredients"]]
            if all(ing):
                receitas.append({"id": arq.stem, "tipo": "shapeless", "ingredientes": ing, "resultado": sai, "qtd": r["result"].get("count", 1)})

# Arte (MIT).
arte_i, arte_b = RAIZ / "RP/textures/items/cl/arte", RAIZ / "RP/textures/blocks/cl/arte"
usados = []
BLOCOS = {"composto_organico", "solo_rico", "terra_arada_rica", "rede_seguranca", "tapete_lona", "tatame", "fardo_arroz", "cesto", "cesto_bambu",
          "torta_maca", "cheesecake", "torta_chocolate", "torta_abobora_fd", "frango_assado", "abobora_recheada", "presunto_mel", "torta_pastor",
          "salada_brilhante", "travessa_rolinhos", "colonia_cogumelo_marrom", "colonia_cogumelo_vermelho", "arbusto_arenoso", "repolho_selvagem",
          "tomateiro_selvagem", "cebola_selvagem", "cenoura_selvagem", "batata_selvagem", "beterraba_marinha", "arroz_selvagem"}
for k, (nid, _) in NOVOS.items():
    if nid in BLOCOS or nid.startswith("armario_") or nid == "tomate_podre":
        (arte_i / f"{nid}.png").unlink(missing_ok=True)  # bloco: o ícone é o próprio bloco
        continue
    src = TEX / f"item/{k}.png"
    if src.exists():
        shutil.copyfile(src, arte_i / f"{nid}.png")
        usados.append(nid)
# Blocos: as faces que o mod tem.
for k, (nid, _) in NOVOS.items():
    for face_fd, face in (("", "lado"), ("_side", "lado"), ("_top", "topo"), ("_bottom", "baixo"), ("_front", "frente")):
        src = TEX / f"block/{k}{face_fd}.png"
        if src.exists():
            shutil.copyfile(src, arte_b / f"{nid}_{face}.png" if face_fd else arte_b / f"{nid}.png")
            usados.append(f"{nid}{face_fd}")
# Texturas avulsas dos blocos de comida (tortas e banquetes) e do composto.
for de, para in (("organic_compost_stage0", "composto_organico"), ("pie_side", "fd_torta_lado"), ("pie_bottom", "fd_torta_baixo"), ("platter", "fd_travessa"),
                 ("roast_chicken", "frango_assado"), ("stuffed_pumpkin_side", "abobora_recheada"), ("honey_glazed_ham", "presunto_mel"),
                 ("shepherds_pie_top", "torta_pastor"), ("gleaming_salad", "salada_brilhante"), ("rice_roll_medley", "travessa_rolinhos"), ("tray", "fd_bandeja")):
    src = TEX / f"block/{de}.png"
    if src.exists():
        shutil.copyfile(src, arte_b / f"{para}.png")
        usados.append(para)

# Blocos sem frente/baixo: a frente é o lado, o baixo é o topo (o gerador quer as 4 faces).
for nid in {v[0] for v in NOVOS.values()}:
    lado, topo = arte_b / f"{nid}_lado.png", arte_b / f"{nid}_topo.png"
    if lado.exists() and topo.exists():
        for face, de in (("frente", lado), ("baixo", topo)):
            if not (arte_b / f"{nid}_{face}.png").exists():
                shutil.copyfile(de, arte_b / f"{nid}_{face}.png")
# Plantas selvagens e colônias: arte de planta (cruz) e o que soltam (as tabelas do FD: a semente e às vezes a planta).
PLANTA = {"wild_cabbages": ("repolho_selvagem", "cl:semente_repolho", "cl:repolho"), "wild_tomatoes": ("tomateiro_selvagem", "cl:semente_tomate", "cl:tomate"),
          "wild_onions": ("cebola_selvagem", "cl:cebola", "cl:cebola"), "wild_carrots": ("cenoura_selvagem", "minecraft:carrot", "minecraft:carrot"),
          "wild_potatoes": ("batata_selvagem", "minecraft:potato", "minecraft:potato"), "wild_beetroots": ("beterraba_marinha", "minecraft:beetroot_seeds", "minecraft:beetroot"),
          "wild_rice": ("arroz_selvagem", "cl:semente_arroz", "cl:arroz"), "sandy_shrub": ("arbusto_arenoso", "minecraft:stick", "minecraft:dead_bush"),
          "brown_mushroom_colony": ("colonia_cogumelo_marrom", "minecraft:brown_mushroom", "minecraft:brown_mushroom"),
          "red_mushroom_colony": ("colonia_cogumelo_vermelho", "minecraft:red_mushroom", "minecraft:red_mushroom")}
(RAIZ / "BP/loot_tables/cl/fd").mkdir(parents=True, exist_ok=True)
for fd, (nid, semente, planta) in PLANTA.items():
    src = TEX / f"block/{fd}.png"
    if not src.exists():
        src = next(iter(sorted(TEX.glob(f"block/{fd}*stage3.png")) + sorted(TEX.glob(f"block/{fd}_top.png"))), None)
    if src:
        shutil.copyfile(src, arte_b / f"{nid}.png")
        usados.append(nid)
    colonia = "colony" in fd
    pools = [{"rolls": 1, "entries": [{"type": "item", "name": semente, "functions": [{"function": "set_count", "count": {"min": 1, "max": 5 if colonia else 2}}]}]}]
    if not colonia and planta != semente:
        pools.append({"rolls": 1, "entries": [{"type": "item", "name": planta}], "conditions": [{"condition": "random_chance", "chance": 0.3}]})
    (RAIZ / f"BP/loot_tables/cl/fd/{nid}.json").write_text(json.dumps({"pools": pools}, indent=1))

saida = {"comidas": {"cl:" + NOVOS[k][0]: COMIDA[k] for k in NOVOS if k in COMIDA}, "nomes": {"cl:" + v[0]: [v[1], en(k)] for k, v in NOVOS.items()},
         "fd": {k: "cl:" + v[0] for k, v in NOVOS.items()}, "receitas": receitas, "panela": panela, "corte": corte}
(RAIZ / "tools/dados/conteudo/farmers26.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1))
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text())
todos["farmers26"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"farmer's delight 1.3.0: {len(saida['comidas'])} comidas, {len(receitas)} receitas, {len(panela)} da panela, {len(corte)} cortes, {len(usados)} texturas")

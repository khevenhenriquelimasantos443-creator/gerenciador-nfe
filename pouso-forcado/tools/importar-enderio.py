# Ender IO 9 (Team Ender IO, CC0/Unlicense; github.com/Team-EnderIO/EnderIO, ramo 26.3, o mais novo) para o pack
# (1.20.0). Lê o código e os dados gerados do mod e grava:
# - tools/dados/conteudo/enderio.json: os itens e blocos novos (nomes do pt_br.json e do en_us.json do mod), as
#   receitas de bancada e de fornalha, as das máquinas (Fundição de Ligas, Triturador SAG, Fatiar e Emendar,
#   Vinculador de Almas, Crisol de Fermentação, tanques, fogo do Grão do Infinito) e os números das configurações
#   (EnergyConfig, MachinesCommonConfig, ItemsConfig, data_maps), tudo traduzido para os ids do pack;
# - a arte original (CC0) dos itens e das faces dos blocos em RP/textures/{items,blocks}/cl/arte, que o build usa no
#   lugar dos desenhos gerados (as faces das máquinas saem dos modelos do mod: north = frente, east = lado...);
# - docs/licencas/enderio.txt e a lista docs/licencas/usados.json.
# Os baldes de fluido do mod não têm textura própria (o jogo pinta o balde com a cor do fluido): aqui o balde vazio do
# jogo (bedrock-samples da Mojang) leva o fluido do mod por cima.
# Uso: python3 tools/importar-enderio.py <pasta do Ender IO clonado> <balde vazio do jogo .png>
import json, os, re, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
if len(sys.argv) < 3:
    sys.exit("uso: python3 tools/importar-enderio.py <pasta do Ender IO> <bucket_empty.png>")
SRC, BALDE = sys.argv[1], sys.argv[2]
MOD = os.path.join(SRC, "enderio/src")
GER = os.path.join(MOD, "generated/resources")
ASSETS = os.path.join(MOD, "main/resources/assets/enderio")
REC = os.path.join(GER, "data/enderio/recipe")
DADOS = os.path.join(GER, "data/enderio")
EN = json.load(open(os.path.join(GER, "assets/enderio/lang/en_us.json")))
PT = json.load(open(os.path.join(ASSETS, "lang/pt_br.json")))

# ---------- Ids: o que o pack já tinha (1.8.0 e 1.11.0) e o que entra agora ----------
JA = {
    "powdered_coal": "po_carvao", "dark_steel_ingot": "aco_negro", "energetic_alloy_ingot": "liga_energetica",
    "vibrant_alloy_ingot": "liga_vibrante", "redstone_alloy_ingot": "liga_redstone", "conductive_alloy_ingot": "ferro_condutor",
    "pulsating_alloy_ingot": "ferro_pulsante", "pulsating_crystal": "cristal_pulsante", "conduit_binder_composite": "composto_aglutinante",
    "conduit_binder": "aglutinante_conduite", "basic_capacitor": "capacitor_basico", "double_layer_capacitor": "capacitor_duplo",
    "octadic_capacitor": "capacitor_octadico", "dark_bimetal_gear": "engrenagem_aco_negro", "photovoltaic_plate": "placa_fotovoltaica",
    "void_chassis": "chassi_maquina", "alloy_smelter": "fundidora_ligas", "sag_mill": "moinho_sag", "stirling_generator": "gerador_stirling",
    "energetic_photovoltaic_module": "painel_fotovoltaico", "pulsating_photovoltaic_module": "painel_fotovoltaico_avancado",
    "vibrant_photovoltaic_module": "painel_fotovoltaico_vibrante", "basic_capacitor_bank": "banco_capacitores_basico",
    "advanced_capacitor_bank": "banco_capacitores", "vibrant_capacitor_bank": "banco_capacitores_vibrante", "travel_anchor": "ancora_viagem",
    "silicon": "silicio", "powdered_iron": "po_ferro", "powdered_gold": "po_ouro", "powdered_copper": "po_cobre", "powdered_tin": "po_estanho",
    "iron_gear": "engrenagem_ferro", "dark_steel_sword": "eio_espada_aco_negro",
}
LIGAS = {"dark_steel": "aco_negro", "end_steel": "aco_end", "energetic_alloy": "liga_energetica", "vibrant_alloy": "liga_vibrante",
         "redstone_alloy": "liga_redstone", "conductive_alloy": "ferro_condutor", "pulsating_alloy": "ferro_pulsante", "soularium": "almario"}
ITENS = {
    "end_steel_ingot": "aco_end", "soularium_ingot": "almario",
    **{f"{en}_nugget": f"pepita_{pt}" for en, pt in LIGAS.items()},
    **{f"{en}_grinding_ball": f"esfera_{pt}" for en, pt in LIGAS.items()},
    "powdered_ender_pearl": "po_perola_ender", "powdered_lapis_lazuli": "po_lapis", "powdered_obsidian": "po_obsidiana", "powdered_quartz": "po_quartzo",
    "grains_of_infinity": "graos_infinito", "pulsating_powder": "graos_piezalidade", "vibrant_powder": "graos_vibracao",
    "prescient_powder": "graos_presciencia", "ender_crystal_powder": "graos_end",
    "vibrant_crystal": "cristal_vibrante", "ender_crystal": "cristal_ender", "enticing_crystal": "cristal_sedutor",
    "weather_crystal": "cristal_climatico", "prescient_crystal": "cristal_presciencia",
    "energized_gear": "engrenagem_energizada", "vibrant_gear": "engrenagem_vibrante", "photovoltaic_composite": "composto_fotovoltaico",
    "plant_matter_green": "materia_vegetal_verde", "plant_matter_brown": "materia_vegetal_marrom", "nutritious_stick": "graveto_nutritivo",
    "soul_vial": "frasco_alma", "broken_spawner": "gerador_quebrado", "z_logic_controller": "controlador_logico_z",
    "skeletal_contractor": "contratante_esqueletico", "zombie_electrode": "eletrodo_zumbi", "guardian_diode": "diodo_guardiao",
    "ender_resonator": "ressonador_ender", "frank_n_zombie": "frank_n_zumbi", "sentient_ender": "ender_senciente", "enderios": "enderios",
    "infinity_rod": "vara_infinito", "experience_rod": "vara_experiencia", "yeta_wrench": "chave_yeta", "staff_of_travelling": "cajado_viagem",
    "staff_of_levity": "cajado_levitacao", "glider": "planador", "glider_wing": "asa_planador", "electromagnet": "eletroima",
    "soul_chain": "corrente_almas", "enderman_head": "cabeca_enderman", "animal_token": "simbolo_animal", "monster_token": "simbolo_monstro",
    "player_token": "simbolo_jogador", "suspicious_seed": "semente_suspeita", "void_vial": "frasco_vazio",
}
# Fluidos do mod: no pack viram baldes (Bedrock não tem fluido de add-on). [id do pack, cor do desenho gerado]
FLUIDOS = {
    "hootch": "balde_hootch", "rocket_fuel": "balde_combustivel_foguete", "fire_water": "balde_agua_fogo",
    "nutrient_distillation": "balde_destilado_nutrientes", "liquid_sunshine": "balde_luz_solar", "cloud_seed": "balde_semente_nuvem",
    "cloud_seed_concentrated": "balde_semente_nuvem_concentrada", "xp_juice": "balde_suco_xp", "vapor_of_levity": "balde_vapor_levitacao",
    "dew_of_the_void": "balde_orvalho_vazio", "liquid_darkness": "balde_escuridao_liquida",
}
BLOCOS = {
    **{f"{en}_block": f"bloco_{pt}" for en, pt in LIGAS.items()},
    "fused_quartz": "quartzo_fundido", "fused_quartz_e": "quartzo_fundido_iluminado", "fused_quartz_d": "quartzo_fundido_escuro",
    "clear_glass": "vidro_transparente", "clear_glass_e": "vidro_transparente_iluminado", "clear_glass_d": "vidro_transparente_escuro",
    "reinforced_obsidian_block": "obsidiana_reforcada", "industrial_insulation": "isolamento_industrial",
    "dark_steel_bars": "barras_aco_negro", "end_steel_bars": "barras_aco_end", "ensouled_chassis": "chassi_almas",
}
MAQUINAS = {
    "slice_and_splice": "fatiar_emendar", "soul_binder": "vinculador_almas", "vat": "crisol_fermentacao", "soul_engine": "motor_almas",
    "powered_spawner": "gerador_energizado", "impulse_hopper": "funil_impulso", "wired_charger": "carregador_fio",
    "wireless_charger": "carregador_sem_fio", "xp_obelisk": "obelisco_xp", "xp_vacuum": "vacuo_xp", "vacuum_chest": "bau_vacuo",
    "inhibitor_obelisk": "obelisco_inibicao", "aversion_obelisk": "obelisco_aversao", "attractor_obelisk": "obelisco_atracao",
    "relocator_obelisk": "obelisco_relocacao", "weather_obelisk": "obelisco_climatico", "drain": "dreno", "fluid_tank": "tanque_fluido",
    "pressurized_fluid_tank": "tanque_fluido_pressurizado", "farming_station": "estacao_agricola",
}
CONDUTOS = {"energy_conduit": "conduto_energia", "item_conduit": "conduto_item", "enhanced_energy_conduit": "conduto_energia_aprimorado",
            "ender_energy_conduit": "conduto_energia_ender"}
TODOS = {**JA, **ITENS, **BLOCOS, **MAQUINAS}

# Tags do mod -> item do pack (ou lista, para o que aceita mais de um).
TAGS = {
    "c:ingots/iron": "minecraft:iron_ingot", "c:ingots/gold": "minecraft:gold_ingot", "c:ingots/copper": "minecraft:copper_ingot",
    "c:nuggets/gold": "minecraft:gold_nugget", "c:nuggets/iron": "minecraft:iron_nugget", "c:gems/diamond": "minecraft:diamond",
    "c:gems/emerald": "minecraft:emerald", "c:gems/quartz": "minecraft:quartz", "c:gems/amethyst": "minecraft:amethyst_shard",
    "c:gems/lapis": "minecraft:lapis_lazuli", "c:dusts/redstone": "minecraft:redstone", "c:dusts/glowstone": "minecraft:glowstone_dust",
    "c:storage_blocks/redstone": "minecraft:redstone_block", "c:storage_blocks/quartz": "minecraft:quartz_block",
    "c:storage_blocks/amethyst": "minecraft:amethyst_block", "c:obsidians": "minecraft:obsidian", "c:ender_pearls": "minecraft:ender_pearl",
    "c:end_stones": "minecraft:end_stone", "c:glass_blocks": "minecraft:glass", "c:glass_blocks/colorless": "minecraft:glass",
    "c:glass_blocks/fused_quartz": "cl:quartzo_fundido", "c:glass_blocks/enlighted_fused_quartz": "cl:quartzo_fundido_iluminado",
    "c:stones": "minecraft:stone", "c:gravels": "minecraft:gravel", "c:sands": "minecraft:sand", "c:chests": "minecraft:chest",
    "c:leathers": "minecraft:leather", "c:rods/wooden": "minecraft:stick", "c:slime_balls": "minecraft:slime_ball", "c:silicon": "cl:silicio",
    "c:dusts/coal": "cl:po_carvao", "c:dusts/lapis": "cl:po_lapis", "c:dusts/quartz": "cl:po_quartzo", "c:dusts/obsidian": "cl:po_obsidiana",
    "c:dusts/ender_pearl": "cl:po_perola_ender", "c:dusts/grains_of_infinity": "cl:graos_infinito", "c:dusts/iron": "cl:po_ferro",
    "c:dusts/gold": "cl:po_ouro", "c:dusts/copper": "cl:po_cobre", "c:dusts/tin": "cl:po_estanho", "c:gears/iron": "cl:engrenagem_ferro",
    "c:gears/energized": "cl:engrenagem_energizada", "c:gears/vibrant": "cl:engrenagem_vibrante", "c:gems/pulsating_crystal": "cl:cristal_pulsante",
    "c:gems/vibrant_crystal": "cl:cristal_vibrante", "c:gems/ender_crystal": "cl:cristal_ender", "c:gems/enticing_crystal": "cl:cristal_sedutor",
    "c:gems/prescient_crystal": "cl:cristal_presciencia", "c:gems/weather_crystal": "cl:cristal_climatico", "minecraft:eggs": "minecraft:egg",
    "minecraft:wool": "minecraft:white_wool", "minecraft:saplings": "minecraft:oak_sapling", "minecraft:skulls": "minecraft:skeleton_skull",
    "minecraft:coals": "#minecraft:coals", "c:dyes/red": "minecraft:red_dye", "c:dyes/green": "minecraft:green_dye",
    "c:dyes/blue": "minecraft:blue_dye", "c:bones": "minecraft:bone", "c:ingots/end_steel": "cl:aco_end",
    "c:ores/iron": ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"], "c:ores/gold": ["minecraft:gold_ore", "minecraft:deepslate_gold_ore", "minecraft:nether_gold_ore"],
    "c:ores/copper": ["minecraft:copper_ore", "minecraft:deepslate_copper_ore"], "c:ores/coal": ["minecraft:coal_ore", "minecraft:deepslate_coal_ore"],
    "c:ores/diamond": ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"], "c:ores/emerald": ["minecraft:emerald_ore", "minecraft:deepslate_emerald_ore"],
    "c:ores/lapis": ["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"], "c:ores/redstone": ["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore"],
    "c:ores/quartz": "minecraft:quartz_ore", "c:raw_materials/iron": "minecraft:raw_iron", "c:raw_materials/gold": "minecraft:raw_gold",
    "c:raw_materials/copper": "minecraft:raw_copper", "c:cobblestones": "minecraft:cobblestone", "c:cobblestones/normal": "minecraft:cobblestone",
    "c:cobblestones/deepslate": "minecraft:cobbled_deepslate", "c:sandstone/blocks": "minecraft:sandstone", "c:storage_blocks/bone_meal": "minecraft:bone_block",
    "minecraft:leaves": "minecraft:oak_leaves", "minecraft:small_flowers": "minecraft:dandelion", "c:crops": ["minecraft:wheat", "minecraft:carrot", "minecraft:potato", "minecraft:beetroot"],
    "c:seeds": ["minecraft:wheat_seeds", "minecraft:melon_seeds", "minecraft:pumpkin_seeds", "minecraft:beetroot_seeds"],
    "minecraft:meat": ["minecraft:beef", "minecraft:porkchop", "minecraft:chicken", "minecraft:mutton", "minecraft:rabbit"],
    "c:glass_blocks/clear_glass": "cl:vidro_transparente", "c:glass_blocks/dark_fused_quartz": "cl:quartzo_fundido_escuro",
    "c:cobblestones/mossy": "minecraft:mossy_cobblestone", "c:dusts/prismarine": "minecraft:prismarine_crystals",
    "c:gems/prismarine": "minecraft:prismarine_shard", "c:dusts/grains_of_pizeallity": "cl:graos_piezalidade", "c:dusts/grains_of_the_end": "cl:graos_end",
    "c:dusts/grains_of_prescience": "cl:graos_presciencia", "c:dusts/grains_of_vibrancy": "cl:graos_vibracao", "c:ingots/tin": "cl:lingote_estanho",
    "c:ores/tin": "cl:minerio_estanho_lunar", "c:ingots/osmium": "cl:lingote_osmio", "c:dusts/osmium": "cl:po_osmio",
    "c:ingots/aluminum": "cl:lingote_aluminio", "c:dusts/aluminum": "cl:aluminio_po",
    "c:experience": "cl:balde_suco_xp", "minecraft:water": "minecraft:water_bucket", "minecraft:lava": "minecraft:lava_bucket",
    "c:dusts/sulfur": None, "c:dusts/blaze": "minecraft:blaze_powder", "c:rods/blaze": "minecraft:blaze_rod",
}
for en, pt in LIGAS.items():
    TAGS[f"c:ingots/{en}"] = f"cl:{pt}"
    TAGS[f"c:nuggets/{en}"] = f"cl:pepita_{pt}"
# Os tags do próprio mod (enderio:explosives etc.), lidos dos arquivos.
TAGS_EIO = {}


def tag_eio(nome):
    if nome in TAGS_EIO:
        return TAGS_EIO[nome]
    arq = os.path.join(DADOS, "tags/item", nome.split(":", 1)[1] + ".json")
    if not os.path.exists(arq):
        return None
    ids = []
    for v in json.load(open(arq))["values"]:
        r = um(v)
        if r:
            ids += r if isinstance(r, list) else [r]
    TAGS_EIO[nome] = ids or None
    return TAGS_EIO[nome]


def um(x):
    """Um ingrediente do mod -> id do pack (str), lista de ids ou None se o pack não tem."""
    if isinstance(x, list):
        alts = [um(i) for i in x]
        alts = [a for a in alts if a]
        return alts[0] if len(alts) == 1 else (sum(([a] if isinstance(a, str) else a for a in alts), []) or None)
    if isinstance(x, dict):
        if "tag" in x:
            return um("#" + x["tag"])
        if "item" in x:
            return um(x["item"])
        if "ingredient" in x:
            return um(x["ingredient"])
        return None
    if x.startswith("#"):
        t = x[1:]
        if t.startswith("enderio:"):
            return tag_eio(t)
        return TAGS.get(t)
    ns, nome = x.split(":", 1)
    if x in ("minecraft:water", "minecraft:lava"):
        return f"{x}_bucket"
    if ns == "minecraft":
        return x
    if nome in TODOS:
        return f"cl:{TODOS[nome]}"
    m = re.match(r"fluid_(.+)_still", nome)
    if m and m.group(1) in FLUIDOS:
        return f"cl:{FLUIDOS[m.group(1)]}"
    return None


def simples(x):
    """Para as receitas de bancada: só um id (a 1ª opção de uma lista)."""
    r = um(x)
    return r[0] if isinstance(r, list) else r


def nome(chave, eio):
    en = EN.get(f"{chave}.enderio.{eio}", eio)
    pt = PT.get(f"{chave}.enderio.{eio}", en)
    return pt, en


# O pt_br do mod tem alguns nomes trocados (as barras viraram "lingote").
CORRIGE = {"dark_steel_bars": ("Barras de Aço Sombrio", None), "end_steel_bars": ("Barras de Aço do End", None),
           "powered_spawner": ("Gerador de Monstros Energizado", "Powered Spawner"), "broken_spawner": ("Gerador de Monstros Quebrado", None),
           "vat": ("Crisol de Fermentação (VAT)", None)}

# ---------- Itens e blocos novos ----------
itens, blocos, maquinas = [], [], []
for eio, pid in ITENS.items():
    pt, en = nome("block" if eio in ("enderman_head", "soul_chain") else "item", eio)
    pt, en = pt.strip('"'), en.strip('"')
    if eio in CORRIGE:
        pt, en = CORRIGE[eio][0], CORRIGE[eio][1] or en
    itens.append({"id": pid, "pt": pt, "en": en, "eio": eio})
for fl, pid in FLUIDOS.items():
    pt, en = nome("item", f"{fl}_bucket")
    itens.append({"id": pid, "pt": pt, "en": en, "eio": f"{fl}_bucket", "balde": True})
for eio, pid in BLOCOS.items():
    pt, en = nome("block", eio)
    if eio in CORRIGE:
        pt, en = CORRIGE[eio][0], CORRIGE[eio][1] or en
    blocos.append({"id": pid, "pt": pt, "en": en, "eio": eio})
for eio, pid in MAQUINAS.items():
    pt, en = nome("block", eio)
    if eio in CORRIGE:
        pt, en = CORRIGE[eio][0], CORRIGE[eio][1] or en
    maquinas.append({"id": pid, "pt": pt, "en": en, "eio": eio})
# Os nomes novos (Aço Sombrio, Liga Condutiva...) dos itens que o pack já tinha.
renomear = {}
DE_OUTROS = {"silicon", "powdered_iron", "powdered_gold", "powdered_copper", "powdered_tin", "iron_gear"}  # do AE2, Mekanism e BuildCraft
for eio, pid in ((e, p) for e, p in JA.items() if e not in DE_OUTROS):
    for chave in ("item", "block"):
        if f"{chave}.enderio.{eio}" in EN:
            pt, en = nome(chave, eio)
            if eio in CORRIGE:
                pt, en = CORRIGE[eio][0], CORRIGE[eio][1] or en
            renomear[pid] = [pt, en]
for eio, pid in CONDUTOS.items():
    renomear[pid] = None  # nomes à mão no f40 ("Condutor de Energia" etc.)

# ---------- Receitas de bancada e fornalha ----------
receitas, pulou = [], []
for arq in sorted(os.listdir(REC)):
    p = os.path.join(REC, arq)
    if os.path.isdir(p) or arq.startswith("erase_") or "_upgrade" in arq:
        continue
    j = json.load(open(p))
    t = j.get("type", "")
    base = arq[:-5]
    res = j.get("result")
    if t in ("minecraft:smelting",):
        e, s = simples(j["ingredient"]), um(res["id"])
        # Só a do aglomerante: os pós de ferro, ouro e cobre já derretem pelas receitas do Mekanism.
        if e == "cl:composto_aglutinante" and s:
            receitas.append({"id": "eio_aglutinante", "tipo": "furnace", "entrada": e, "resultado": s})
        continue
    if t not in ("minecraft:crafting_shaped", "minecraft:crafting_shapeless") or not isinstance(res, dict):
        continue
    rid = res.get("id", "")
    if rid == "enderio:conduit":
        if base not in CONDUTOS:
            continue
        saida = f"cl:{CONDUTOS[base]}"
    else:
        saida = um(rid)
    if not saida or not saida.startswith("cl:"):
        continue
    r = {"id": "eio_" + re.sub(r"[^a-z0-9_]", "_", base.replace("item.enderio.", "")), "resultado": saida}
    if res.get("count", 1) > 1:
        r["qtd"] = res["count"]
    if "pattern" in j:
        chave = {k: simples(v) for k, v in j["key"].items()}
        if None in chave.values():
            pulou.append(arq)
            continue
        r.update(tipo="shaped", padrao=j["pattern"], chave=chave)
    else:
        ings = [simples(i) for i in j["ingredients"]]
        if None in ings:
            pulou.append(arq)
            continue
        r.update(tipo="shapeless", ingredientes=ings)
    receitas.append(r)


def pasta(nome):
    d = os.path.join(REC, nome)
    return [json.load(open(os.path.join(d, a))) | {"_arq": a[:-5]} for a in sorted(os.listdir(d))]


def saida_item(o):
    if "id" in o:
        return um(o["id"]), o.get("count", 1)
    if "tag" in o:
        return simples("#" + o["tag"]), o.get("count", 1)
    return None, 0


# Fundição de Ligas: entradas [[id ou [ids], qtd]], saída, energia (µI = RF).
ligas = []
for j in pasta("alloy_smelting"):
    ent = [[um(i["ingredient"]), i.get("count", 1)] for i in j["inputs"]]
    s, n = saida_item(j["output"])
    if not s or any(e is None for e, _ in ent):
        pulou.append("alloy/" + j["_arq"])
        continue
    ligas.append({"entra": ent, "sai": [s, n], "rf": j["energy"], "xp": j.get("experience", 0)})
# Triturador SAG: cada entrada (ids) -> saídas [id, qtd, chance] e se a esfera aumenta (bonus).
moagem = []
for j in pasta("sag_milling"):
    ent = um(j["input"])
    if not ent:
        pulou.append("sag/" + j["_arq"])
        continue
    sai = []
    for o in j["outputs"]:
        s, n = saida_item(o["item"])
        if s:
            sai.append([s, n, o.get("chance", 1)])
    if sai:
        ent = ent if isinstance(ent, list) else [ent]
        ent = sum((["minecraft:coal", "minecraft:charcoal"] if e == "#minecraft:coals" else [e] for e in ent), [])  # máquina não lê tag
        moagem.append({"entra": ent, "sai": sai, "rf": j["energy"], "bonus": j.get("bonus", "multiply_output")})
# Fatiar e Emendar: 6 entradas na ordem do mod.
fatiar = []
for j in pasta("slicing"):
    ent = [simples(i) for i in j["inputs"]]
    s, n = saida_item(j["output"])
    if s and None not in ent:
        fatiar.append({"entra": ent, "sai": [s, n], "rf": j["energy"]})
    else:
        pulou.append("slicing/" + j["_arq"])
# Vinculador de Almas: item + alma (entidade, "qualquer" ou um tipo de alma) -> resultado.
almas = []
for j in pasta("soulbinding"):
    e = j["input"]
    ent = simples(e["item"] if isinstance(e, dict) and "item" in e else e)
    alma = j.get("inputSoul")
    if isinstance(alma, dict):
        alma = {"enderio:any_entity": "qualquer", "enderio:has_solar_soul_data": "solar", "enderio:has_farm_soul_data": "fazenda",
                "enderio:has_engine_soul_data": "motor", "enderio:has_spawner_soul_data": "gerador"}.get(alma.get("type"), None) or \
            {"creature": "animal", "monster": "monstro"}.get(alma.get("category"))
    s, n = saida_item(j["output"])
    if not ent or not s or not alma:
        pulou.append("soul/" + j["_arq"])
        continue
    almas.append({"entra": ent, "alma": alma, "sai": [s, n], "rf": j["energy"], "xp": j.get("experience", 0)})
# Crisol: reagentes (ids e multiplicador), fluido de entrada e de saída (em mB; o pack conta em baldes de 1.000 mB).
reag = json.load(open(os.path.join(DADOS, "data_maps/item/vat_reagent.json")))["values"]
cuba = []
for j in pasta("fermenting"):
    def reagente(t):
        ids = um("#" + t if not t.startswith("#") else t) or []
        ids = ids if isinstance(ids, list) else [ids]
        mult = {}
        for k, v in reag.items():
            for tg, m in v.items():
                if tg == "#" + t and um(k):
                    mult[um(k)] = m
        return {"ids": ids, "mult": mult}
    e = um(j["input"]["ingredient"]) if j["input"]["ingredient"] != "#minecraft:water" else "minecraft:water_bucket"
    s = um(j["output"]["id"])
    r1, r2 = reagente(j["first_reagent"]), reagente(j["second_reagent"])
    if not e or not s or not r1["ids"] or not r2["ids"]:
        pulou.append("vat/" + j["_arq"])
        continue
    cuba.append({"entra": e, "mb": j["input"]["amount"], "r1": r1, "r2": r2, "sai": s, "mbSai": j["output"]["amount"], "ticks": j["ticks"]})
# Tanque: encher (item + 1.000 mB de fluido -> item) e esvaziar.
tanque = []
for nomep, modo in (("tank_fill", "encher"), ("tank_empty", "esvaziar")):
    for j in pasta(nomep):
        e, s, f = simples(j["input"]), um(j["output"]["id"]), um(j["fluid"]["ingredient"]) if "ingredient" in j["fluid"] else None
        if e and s and f:
            tanque.append({"modo": modo, "entra": e, "sai": s, "fluido": f, "mb": j["fluid"]["amount"]})
# Fogo: Grão do Infinito quando o fogo apaga em cima de pedra do abismo ou rocha matriz.
fogo = []
for j in pasta("fire_crafting"):
    for r in j["results"]:
        fogo.append({"bases": j["base_blocks"], "vira": j.get("block_after_burning"), "sai": um(r["result"]["id"]), "chance": r["chance"],
                     "min": r.get("min_count", 1), "max": r.get("max_count", 1)})
# Obelisco Climático: o fluido de 1.000 mB e o que faz.
clima = {um(j["fluid"]["id"]): j["mode"] for j in [json.load(open(os.path.join(REC, a))) for a in ("clear.json", "rain.json", "lightning.json")]}

# ---------- Números das configurações ----------
def config(rel):
    txt = open(os.path.join(MOD, "main/java/com/enderio/enderio/config", rel)).read()
    secao, out = [], {}
    for linha in txt.splitlines():
        m = re.search(r'push\("(\w+)"\)', linha)
        if m:
            secao.append(m.group(1))
        if "builder.pop()" in linha and secao:
            secao.pop()
        m = re.search(r'define(?:InRange)?\("(\w+)",\s*([\d_.]+)', linha)
        if m:
            out[".".join(secao + [m.group(1)])] = float(m.group(2).replace("_", ""))
    # Chaves sem a seção de fora ("energy." no EnergyConfig), para ler igual nos três arquivos.
    return {re.sub(r"^(energy|items)\.", "", k): v for k, v in out.items()}


ENE = config("machines/common/EnergyConfig.java")
MAQ = config("machines/common/MachinesCommonConfig.java")
ITC = config("base/common/ItemsConfig.java")
esferas = {um(k): v for k, v in json.load(open(os.path.join(DADOS, "data_maps/item/grinding_ball.json")))["values"].items()}
motor = {}
for k, v in json.load(open(os.path.join(DADOS, "data_maps/entity_type/engine_soul.json")))["values"].items():
    alvo = {"#enderio:creepers": ["minecraft:creeper"], "#enderio:endermen": ["minecraft:enderman"],
            "#enderio:zombies": ["minecraft:zombie", "minecraft:husk", "minecraft:drowned", "minecraft:zombie_villager_v2"]}.get(k, [k])
    fl = "minecraft:lava_bucket" if v["fluid"] == "#minecraft:lava" else um(v["fluid"])
    for a in alvo:
        motor[a] = {"fluido": fl, "rfPorMb": v["powerPerMb"], "ticksPorMb": v["tickPerMb"]}
custo_gerador = {}
for k, v in json.load(open(os.path.join(DADOS, "data_maps/entity_type/spawner_soul.json")))["values"].items():
    alvo = {"#enderio:zombies": ["minecraft:zombie", "minecraft:husk", "minecraft:drowned"],
            "#minecraft:skeletons": ["minecraft:skeleton", "minecraft:stray", "minecraft:wither_skeleton", "minecraft:bogged"]}.get(k, [k])
    for a in alvo:
        custo_gerador[a] = v["power"]
numeros = {
    "capacidade": {k.split(".")[0]: int(v) for k, v in ENE.items() if k.endswith(".capacity")},
    "uso": {k.split(".")[0]: int(v) for k, v in ENE.items() if k.endswith(".usage")},
    "stirling": {"geracao": ENE["stirlingGenerator.generation"], "queima": ENE["stirlingGenerator.burnSpeed"], "eficiencia": ENE["stirlingGenerator.fuelEfficiencyBase"]},
    "solar": {"painel_fotovoltaico": ENE["photovoltaicCellRates.energetic"], "painel_fotovoltaico_avancado": ENE["photovoltaicCellRates.pulsating"],
              "painel_fotovoltaico_vibrante": ENE["photovoltaicCellRates.vibrant"]},
    "bancos": {"banco_capacitores_basico": ENE["capacitorBankCapacity.basic"], "banco_capacitores": ENE["capacitorBankCapacity.advanced"],
               "banco_capacitores_vibrante": ENE["capacitorBankCapacity.vibrant"]},
    "carregadorSemFio": {"alcance": MAQ["wirelessCharger.baseRange"], "porTick": ENE["wirelessCharger.chargeRate"]},
    "carregadorFio": ENE["wiredCharger.usage"],
    "obeliscos": {"atracao": MAQ["obelisks.attractorRange"], "inibicao": MAQ["obelisks.inhibitorRange"], "aversao": MAQ["obelisks.aversionRange"],
                  "relocacao": MAQ["obelisks.relocatorRange"]},
    "gerador": {"quantidade": MAQ["poweredSpawner.spawnAmount"], "maxPerto": MAQ["poweredSpawner.maxEntities"], "custoPadrao": MAQ["poweredSpawner.defaultSpawnEnergyCost"],
                "custo": custo_gerador},
    "motor": motor,
    "esferas": esferas,
    "viagem": {"pulo": ITC["travelling.blinkRange"], "ateBloco": ITC["travelling.itemToBlockRange"], "entreBlocos": ITC["travelling.blockToBlockRange"],
               "rfPorUso": ITC["travelling.energyUse"], "capacidade": ITC["travelling.maxEnergy"]},
    "levitacao": {"rfPorTick": ITC["levitationstaff.energyUse"], "capacidade": ITC["levitationstaff.maxEnergy"]},
    "eletroima": {"rfPorTick": ITC["electromagnet.energyUse"], "capacidade": ITC["electromagnet.maxEnergy"], "alcance": ITC["electromagnet.range"],
                  "maxItens": ITC["electromagnet.maxItems"]},
    "enderios": {"chance": ITC["food.enderioChance"], "alcance": ITC["food.enderioRange"]},
    "graoFogo": {"idadeMinima": config("base/common/InfinityConfig.java").get("grainsOfInfinity.fireMinAge", 260)},
    "cabecaChance": 0.07,  # DarkSteelSwordItem.postHurtEnemy
}
# Os fluidos que o Motor de Almas queima e o Crisol faz: 1 balde = 1.000 mB.
saida = {"itens": itens, "blocos": blocos, "maquinas": maquinas, "renomear": renomear, "receitas": receitas, "ligas": ligas, "moagem": moagem,
         "fatiar": fatiar, "almas": almas, "cuba": cuba, "tanque": tanque, "fogo": fogo, "clima": clima, "numeros": numeros}
json.dump(saida, open(os.path.join(R, "tools/dados/conteudo/enderio.json"), "w"), ensure_ascii=False, indent=1)

# ---------- Arte ----------
TEX = os.path.join(ASSETS, "textures")


def abrir(rel):
    im = Image.open(os.path.join(TEX, rel)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def salvar(im, rel):
    destino = os.path.join(R, rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino)


usados = []
ARQ_ITEM = {"soul_vial": "soul_vial"}
I, B = "RP/textures/items/cl/arte", "RP/textures/blocks/cl/arte"
for eio, pid in {**JA, **ITENS}.items():
    arq = f"item/{ARQ_ITEM.get(eio, eio)}.png"
    if os.path.exists(os.path.join(TEX, arq)):
        salvar(abrir(arq), f"{I}/{pid}.png")
        usados.append(pid)
for t, pid in (("item/soul_vial_filled.png", "frasco_alma_cheio"), ("item/dark_steel_pickaxe.png", "eio_picareta_aco_negro"),
               ("item/dark_steel_axe.png", "eio_machado_aco_negro"), ("item/dark_steel_helmet.png", "eio_capacete_aco_negro"),
               ("item/dark_steel_chestplate.png", "eio_peitoral_aco_negro"), ("item/dark_steel_leggings.png", "eio_calcas_aco_negro"),
               ("item/dark_steel_boots.png", "eio_botas_aco_negro")):
    if os.path.exists(os.path.join(TEX, t)):
        salvar(abrir(t), f"{I}/{pid}.png")
        usados.append(pid)
# Baldes: o balde vazio do jogo com o fluido do mod no miolo (os pixels do "leite" do balde de leite).
balde = Image.open(BALDE).convert("RGBA")
MIOLO = [(x, y) for y in range(4, 7) for x in range(4, 12)] + [(x, 7) for x in range(5, 11)]
for fl, pid in FLUIDOS.items():
    f = abrir(f"block/{fl}_still.png").resize((16, 16))
    im = balde.copy()
    for x, y in MIOLO:
        if im.getpixel((x, y))[3]:
            im.putpixel((x, y), f.getpixel((x, y))[:3] + (255,))
    salvar(im, f"{I}/{pid}.png")
    usados.append(pid)
# Blocos simples: a textura do mod.
ARQ_BLOCO = {"fused_quartz_e": "fused_quartz", "fused_quartz_d": "fused_quartz", "clear_glass_e": "clear_glass", "clear_glass_d": "clear_glass"}
for eio, pid in BLOCOS.items():
    arq = f"block/{ARQ_BLOCO.get(eio, eio)}.png"
    if not os.path.exists(os.path.join(TEX, arq)):
        continue
    im = abrir(arq)
    if eio.endswith("_e"):  # iluminado: o mesmo vidro um pouco amarelado (o mod pinta com cor)
        im = Image.merge("RGBA", (im.getchannel("R"), im.getchannel("G"), im.getchannel("B").point(lambda v: int(v * 0.7)), im.getchannel("A")))
    if eio.endswith("_d"):
        im = Image.merge("RGBA", (*(im.getchannel(c).point(lambda v: int(v * 0.35)) for c in "RGB"), im.getchannel("A").point(lambda v: max(v, 150))))
    salvar(im, f"{B}/{pid}.png")
    usados.append(pid)
# Máquinas: as faces que o modelo do mod usa (north = frente, east = lado, up = topo, down = baixo).
MODELOS = os.path.join(ASSETS, "models/block")
PADRAO_FACES = {"frente": "block/soul_machine_side", "lado": "block/soul_machine_side", "topo": "block/soul_machine_top", "baixo": "block/soul_machine_bottom"}
FRENTE_PROPRIA = {"xp_obelisk": None, "xp_vacuum": None, "vacuum_chest": "block/vacuum_portal", "inhibitor_obelisk": None, "aversion_obelisk": None,
                  "attractor_obelisk": None, "relocator_obelisk": None, "weather_obelisk": None, "fluid_tank": "block/fluid_tank",
                  "pressurized_fluid_tank": "block/pressurized_fluid_tank", "powered_spawner": "block/powered_spawner_front"}


def faces_do_modelo(eio):
    arq = os.path.join(MODELOS, f"{eio}.json")
    t = json.load(open(arq)).get("textures", {}) if os.path.exists(arq) else {}
    tira = lambda v: v.split(":", 1)[1] if v and ":" in v else None
    f = {"frente": tira(t.get("north")), "lado": tira(t.get("east")), "topo": tira(t.get("up")), "baixo": tira(t.get("down"))}
    for k, v in PADRAO_FACES.items():
        if not f[k] or not os.path.exists(os.path.join(TEX, f[k] + ".png")):
            f[k] = v
    if eio in FRENTE_PROPRIA and FRENTE_PROPRIA[eio]:
        f["frente"] = FRENTE_PROPRIA[eio]
    if eio in ("fluid_tank", "pressurized_fluid_tank", "vacuum_chest"):
        f["lado"] = f["frente"]
    return f


for eio, pid in {**MAQUINAS, "alloy_smelter": "fundidora_ligas", "sag_mill": "moinho_sag", "stirling_generator": "gerador_stirling",
                 "void_chassis": "chassi_maquina"}.items():
    for face, tex in faces_do_modelo(eio).items():
        salvar(abrir(tex + ".png").resize((16, 16), Image.NEAREST), f"{B}/{pid}_{face}.png")
    usados.append(pid)
# Painéis: o topo do módulo em cima e o lado em volta; bancos de capacitores: a textura do banco.
for eio, pid in (("energetic", "painel_fotovoltaico"), ("pulsating", "painel_fotovoltaico_avancado"), ("vibrant", "painel_fotovoltaico_vibrante")):
    lado, topo = abrir(f"block/{eio}_photovoltaic_module_side.png"), abrir(f"block/{eio}_photovoltaic_module_top.png")
    for face, im in (("frente", lado), ("lado", lado), ("topo", topo), ("baixo", abrir("block/machine_bottom.png"))):
        salvar(im.resize((16, 16), Image.NEAREST), f"{B}/{pid}_{face}.png")
    usados.append(pid)
for eio, pid in (("basic", "banco_capacitores_basico"), ("advanced", "banco_capacitores"), ("vibrant", "banco_capacitores_vibrante")):
    im = abrir(f"block/{eio}_capacitor_bank.png").resize((16, 16), Image.NEAREST)
    for face in ("frente", "lado", "topo", "baixo"):
        salvar(im, f"{B}/{pid}_{face}.png")
    usados.append(pid)
anc = abrir("block/travel_anchor_backdrop.png").resize((16, 16), Image.NEAREST)
for face in ("frente", "lado", "topo", "baixo"):
    salvar(anc, f"{B}/ancora_viagem_{face}.png")
usados.append("ancora_viagem")

os.makedirs(os.path.join(R, "docs/licencas"), exist_ok=True)
with open(os.path.join(SRC, "LICENSE.txt")) as f, open(os.path.join(R, "docs/licencas/enderio.txt"), "w") as g:
    g.write("Ender IO 9 (Team Ender IO), github.com/Team-EnderIO/EnderIO. Código: Unlicense. Arte: CC0 1.0 (README do mod e\n"
            "docs/license/*: DTFuel, NeepNoop e os autores do Travel Anchors liberaram as contribuições em CC0).\n\n" + f.read())
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["enderio"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
print(f"enderio: {len(itens)} itens, {len(blocos)} blocos, {len(maquinas)} máquinas, {len(receitas)} receitas, {len(ligas)} ligas, "
      f"{len(moagem)} moagens, {len(fatiar)} fatiar, {len(almas)} almas, {len(cuba)} crisol, {len(tanque)} tanque, {len(usados)} artes; "
      f"puladas: {len(pulou)}")
print("  puladas:", ", ".join(pulou))

# Mapa Mekanism -> pack (ids, etiquetas e conversão de ingredientes), usado por tools/importar-mekanism.py (1.21.0) e
# tools/importar-mekanism-completo.py (Mekanism completo, 1.49.0+). NOVOS: ids dos itens e blocos das partes do Mekanism
# completo (entram no mapa para as receitas, mas não na lista de itens da 1.21.0).
import re

METAIS = {"iron": "ferro", "gold": "ouro", "copper": "cobre", "tin": "estanho", "osmium": "osmio", "lead": "chumbo", "uranium": "uranio"}
JA = {
    "dust_iron": "po_ferro", "dust_gold": "po_ouro", "dust_copper": "po_cobre", "dust_tin": "po_estanho", "dust_osmium": "po_osmio",
    "dust_obsidian": "po_obsidiana", "dust_quartz": "po_quartzo", "dust_lapis_lazuli": "po_lapis", "dust_coal": "po_carvao", "dust_lithium": "po_litio",
    "ingot_osmium": "lingote_osmio", "ingot_tin": "lingote_estanho", "ingot_steel": "lingote_aco", "ingot_bronze": "lingote_bronze",
    "ingot_refined_obsidian": "lingote_obsidiana_refinada", "ingot_refined_glowstone": "lingote_glowstone_refinado",
    "alloy_infused": "liga_enriquecida", "alloy_reinforced": "liga_reforcada", "alloy_atomic": "liga_atomica",
    "basic_control_circuit": "circuito_controle_basico", "advanced_control_circuit": "circuito_controle_avancado", "bio_fuel": "biocombustivel",
    "sawdust": "serragem", "steel_casing": "revestimento_aco", "energy_tablet": "tablet_energia", "electrolytic_core": "nucleo_eletrolitico",
    "purification_chamber": "camara_purificacao", "chemical_injection_chamber": "camara_injecao", "metallurgic_infuser": "infusor_metalurgico",
    "crusher": "triturador_mk", "electrolytic_separator": "separador_eletrolitico", "chemical_infuser": "infusor_quimico",
    "basic_energy_cube": "cubo_energia_basico", "advanced_energy_cube": "cubo_energia_avancado", "elite_energy_cube": "cubo_energia_elite",
    "ultimate_energy_cube": "cubo_energia_definitivo", "jetpack": "jetpack", "block_steel": "bloco_aco", "block_bronze": "bloco_bronze",
    "block_tin": "bloco_estanho",
}
ITENS = {
    **{f"clump_{en}": f"torrao_{pt}" for en, pt in METAIS.items()},
    **{f"shard_{en}": f"fragmento_{pt}" for en, pt in METAIS.items()},
    **{f"dirty_dust_{en}": f"po_sujo_{pt}" for en, pt in METAIS.items()},
    "enriched_iron": "ferro_enriquecido", "dust_steel": "po_aco", "dust_diamond": "po_diamante", "dust_refined_obsidian": "po_obsidiana_refinada",
    "enriched_carbon": "carbono_enriquecido", "enriched_redstone": "redstone_enriquecida", "enriched_diamond": "diamante_enriquecido",
    "enriched_refined_obsidian": "obsidiana_refinada_enriquecida", "enriched_gold": "ouro_enriquecido", "enriched_tin": "estanho_enriquecido",
    "elite_control_circuit": "circuito_controle_elite", "ultimate_control_circuit": "circuito_controle_supremo",
    "ingot_bronze": None,
}
ITENS = {k: v for k, v in ITENS.items() if v}
MAQUINAS = {"enrichment_chamber": "camara_enriquecimento", "osmium_compressor": "compressor_osmio", "combiner": "combinador",
            "energized_smelter": "fundidor_energizado", "precision_sawmill": "serraria_precisao"}
TODOS = {**JA, **ITENS, **MAQUINAS}

TAGS = {
    "c:ingots/iron": "minecraft:iron_ingot", "c:ingots/gold": "minecraft:gold_ingot", "c:ingots/copper": "minecraft:copper_ingot",
    "c:ingots/osmium": "cl:lingote_osmio", "c:ingots/tin": "cl:lingote_estanho", "c:ingots/steel": "cl:lingote_aco", "c:ingots/bronze": "cl:lingote_bronze",
    "c:ingots/refined_obsidian": "cl:lingote_obsidiana_refinada", "c:ingots/refined_glowstone": "cl:lingote_glowstone_refinado",
    "c:gems/diamond": "minecraft:diamond", "c:gems/emerald": "minecraft:emerald", "c:gems/quartz": "minecraft:quartz", "c:gems/lapis": "minecraft:lapis_lazuli",
    "c:dusts/redstone": "minecraft:redstone", "c:dusts/glowstone": "minecraft:glowstone_dust", "c:obsidians": "minecraft:obsidian",
    "c:storage_blocks/redstone": "minecraft:redstone_block", "c:storage_blocks/coal": "minecraft:coal_block", "c:storage_blocks/charcoal": "cl:bloco_carvao_vegetal",
    "c:storage_blocks/iron": "minecraft:iron_block", "c:storage_blocks/osmium": "cl:bloco_osmio", "c:glass_blocks": "minecraft:glass", "c:glass_blocks/colorless": "minecraft:glass",
    "c:cobblestones": "minecraft:cobblestone", "c:cobblestones/normal": "minecraft:cobblestone", "c:cobblestones/deepslate": "minecraft:cobbled_deepslate",
    "c:gravels": "minecraft:gravel", "c:sands": "minecraft:sand", "c:sands/colorless": "minecraft:sand", "c:stones": "minecraft:stone",
    "c:chests/wooden": "minecraft:chest", "c:chests": "minecraft:chest", "c:rods/wooden": "minecraft:stick", "c:nuggets/iron": "minecraft:iron_nugget",
    "minecraft:coals": "minecraft:coal", "c:dusts/coal": "cl:po_carvao", "c:dusts/charcoal": "cl:po_carvao", "c:dusts/obsidian": "cl:po_obsidiana",
    "c:dusts/diamond": "cl:po_diamante", "c:dusts/steel": "cl:po_aco", "c:dusts/refined_obsidian": "cl:po_obsidiana_refinada", "c:dusts/lithium": "cl:po_litio",
    "c:dusts/quartz": "cl:po_quartzo", "c:dusts/lapis": "cl:po_lapis", "c:fuels/bio": "cl:biocombustivel",
    "c:raw_materials/iron": "minecraft:raw_iron", "c:raw_materials/gold": "minecraft:raw_gold", "c:raw_materials/copper": "minecraft:raw_copper",
    "c:ores/iron": ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"], "c:ores/gold": ["minecraft:gold_ore", "minecraft:deepslate_gold_ore", "minecraft:nether_gold_ore"],
    "c:ores/copper": ["minecraft:copper_ore", "minecraft:deepslate_copper_ore"], "c:ores/tin": ["cl:minerio_estanho", "cl:minerio_estanho_profundo", "cl:minerio_estanho_lunar"],
    "c:ores/coal": ["minecraft:coal_ore", "minecraft:deepslate_coal_ore"], "c:ores/diamond": ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"],
    "c:ores/redstone": ["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore"], "c:ores/lapis": ["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"],
    "c:ores/emerald": ["minecraft:emerald_ore", "minecraft:deepslate_emerald_ore"], "c:ores/quartz": "minecraft:quartz_ore",
    "minecraft:logs": None, "minecraft:planks": None, "minecraft:wool": "minecraft:white_wool", "c:ores/netherite_scrap": "minecraft:ancient_debris",
}
TAGS.update({
    "mekanism:alloys/basic": "minecraft:redstone", "mekanism:alloys/infused": "cl:liga_enriquecida", "mekanism:alloys/advanced": "cl:liga_enriquecida",
    "mekanism:alloys/reinforced": "cl:liga_reforcada", "mekanism:alloys/elite": "cl:liga_reforcada", "mekanism:alloys/atomic": "cl:liga_atomica",
    "mekanism:alloys/ultimate": "cl:liga_atomica", "c:circuits/basic": "cl:circuito_controle_basico", "c:circuits/advanced": "cl:circuito_controle_avancado",
    "c:circuits/elite": "cl:circuito_controle_elite", "c:circuits/ultimate": "cl:circuito_controle_supremo",
    "c:storage_blocks/raw_iron": "minecraft:raw_iron_block", "c:storage_blocks/raw_gold": "minecraft:raw_gold_block",
    "c:storage_blocks/raw_copper": "minecraft:raw_copper_block", "mekanism:enriched/carbon": "cl:carbono_enriquecido",
    "mekanism:enriched/redstone": "cl:redstone_enriquecida", "mekanism:enriched/diamond": "cl:diamante_enriquecido",
    "mekanism:enriched/obsidian": "cl:obsidiana_refinada_enriquecida", "mekanism:enriched/gold": "cl:ouro_enriquecido", "mekanism:enriched/tin": "cl:estanho_enriquecido",
    "c:dusts/netherite": None, "c:ingots/netherite": "minecraft:netherite_ingot", "c:storage_blocks/steel": "cl:bloco_aco",
})
for en, pt in METAIS.items():
    TAGS.setdefault(f"c:dusts/{en}", f"cl:po_{pt}")
    TAGS[f"c:clumps/{en}"] = f"cl:torrao_{pt}"
    TAGS[f"c:shards/{en}"] = f"cl:fragmento_{pt}"
    TAGS[f"c:dirty_dusts/{en}"] = f"cl:po_sujo_{pt}"
# Ex Nihilo do pack: os pedaços de minério de ósmio, estanho e alumínio já viram pó; o mod pede minério de ósmio.
# 1.52.0: o Mekanism completo traz os minérios de ósmio e estanho (e o bruto deles); o Ex Nihilo continua dando os pedaços.
TAGS["c:ores/osmium"] = ["cl:minerio_osmio", "cl:minerio_osmio_profundo"]
TAGS["c:raw_materials/osmium"] = "cl:osmio_bruto"
TAGS["c:raw_materials/tin"] = "cl:estanho_bruto"



# ---------- Mekanism completo (1.49.0+) ----------
NOVOS = {
    **{f"crystal_{en}": f"cristal_{pt}" for en, pt in METAIS.items()},
    "dust_sulfur": "po_enxofre", "fluorite_gem": "fluorita", "dust_fluorite": "po_fluorita", "substrate": "substrato",
    "hdpe_pellet": "pellet_pead", "hdpe_rod": "barra_pead", "hdpe_sheet": "folha_pead", "hdpe_stick": "vareta_pead",
    "chemical_oxidizer": "oxidador_quimico", "chemical_dissolution_chamber": "camara_dissolucao", "chemical_washer": "lavador_quimico",
    "chemical_crystallizer": "cristalizador_quimico", "rotary_condensentrator": "condensentrador_rotativo",
    "pressurized_reaction_chamber": "camara_reacao_pressurizada", "dynamic_tank": "tanque_dinamico", "personal_barrel": "barril_pessoal",
    **{f"{t}_chemical_tank": f"tanque_quimico_{p}" for t, p in (("basic", "basico"), ("advanced", "avancado"), ("elite", "elite"), ("ultimate", "definitivo"))},
    **{f"{t}_fluid_tank": f"tanque_fluido_{p}" for t, p in (("basic", "basico"), ("advanced", "avancado"), ("elite", "elite"), ("ultimate", "definitivo"))},
    "fluorite_ore": "minerio_fluorita", "deepslate_fluorite_ore": "minerio_fluorita_profundo", "block_fluorite": "bloco_fluorita",
    "salt": "sal",
}
# Parte 2 (1.50.0): fábricas, melhorias e instaladores de nível.
FABRICA_TIPO = {"smelting": "fundicao", "enriching": "enriquecimento", "crushing": "trituracao", "compressing": "compressao", "combining": "combinacao",
                "purifying": "purificacao", "injecting": "injecao", "infusing": "infusao", "sawing": "serragem"}
NIVEL_F = {"basic": "basica", "advanced": "avancada", "elite": "elite", "ultimate": "definitiva"}
NOVOS.update({f"{t}_{tipo}_factory": f"fabrica_{tp}_{n}" for tipo, tp in FABRICA_TIPO.items() for t, n in NIVEL_F.items()})
NOVOS.update({"upgrade_speed": "melhoria_velocidade", "upgrade_energy": "melhoria_energia", "upgrade_chemical": "melhoria_quimica",
              "upgrade_muffling": "melhoria_silenciador", "upgrade_anchor": "melhoria_ancora", "upgrade_stone_generator": "melhoria_gerador_pedra",
              "upgrade_filter": "melhoria_filtro"})
NOVOS.update({f"{t}_tier_installer": f"instalador_nivel_{p}" for t, p in (("basic", "basico"), ("advanced", "avancado"), ("elite", "elite"), ("ultimate", "definitivo"))})
# Parte 3 (1.51.0): armazenamento, logística e utilidades.
_N3 = (("basic", "basico", "basica"), ("advanced", "avancado", "avancada"), ("elite", "elite", "elite"), ("ultimate", "definitivo", "definitiva"))
NOVOS.update({f"{t}_bin": f"caixa_{f}" for t, _m, f in _N3})
NOVOS.update({f"{t}_universal_cable": f"cabo_universal_{m}" for t, m, _f in _N3})
NOVOS.update({f"{t}_mechanical_pipe": f"cano_mecanico_{m}" for t, m, _f in _N3})
NOVOS.update({f"{t}_pressurized_tube": f"tubo_pressurizado_{m}" for t, m, _f in _N3})
NOVOS.update({f"{t}_logistical_transporter": f"transportador_logistico_{m}" for t, m, _f in _N3})
NOVOS.update({"electric_pump": "bomba_eletrica", "fluidic_plenisher": "plenificador_fluidico", "digital_miner": "minerador_digital",
              "chargepad": "carregador_chao", "quantum_entangloporter": "entrelacador_quantico", "logistical_sorter": "classificador_logistico",
              "seismic_vibrator": "vibrador_sismico", "industrial_alarm": "alarme_industrial", "teleporter": "teletransportador",
              "teleporter_frame": "moldura_teletransportador", "portable_teleporter": "teletransportador_portatil", "seismic_reader": "leitor_sismico",
              "teleportation_core": "nucleo_teletransporte"})
# Chumbo (o pack não tinha): minério normal e profundo, bruto, lingote, pepita, pó e blocos (o resto sai de METAIS).
NOVOS.update({"ingot_lead": "lingote_chumbo", "raw_lead": "chumbo_bruto", "nugget_lead": "pepita_chumbo", "dust_lead": "po_chumbo",
              "block_lead": "bloco_chumbo", "block_raw_lead": "bloco_chumbo_bruto", "lead_ore": "minerio_chumbo",
              "deepslate_lead_ore": "minerio_chumbo_profundo", "robit": "robit"})
TAGS.update({"mekanism:transmitters/logistical_transporters": "cl:transportador_logistico_basico", "c:chests/ender": "minecraft:ender_chest",
             "mekanism:personal_storage": "cl:barril_pessoal",
             "c:ingots/lead": "cl:lingote_chumbo", "c:raw_materials/lead": "cl:chumbo_bruto", "c:nuggets/lead": "cl:pepita_chumbo",
             "c:storage_blocks/lead": "cl:bloco_chumbo", "c:storage_blocks/raw_lead": "cl:bloco_chumbo_bruto",
             "c:ores/lead": ["cl:minerio_chumbo", "cl:minerio_chumbo_profundo"], "c:ores_in_ground/stone": None, "c:ores_in_ground/deepslate": None,
             # Ingredientes das partes 2 e 3 que faltavam (sem o equivalente no Bedrock, o mais próximo).
             "minecraft:planks": "#minecraft:planks", "c:buckets/water": "minecraft:water_bucket", "c:buckets/lava": "minecraft:lava_bucket",
             "c:ender_pearls": "minecraft:ender_pearl", "mekanism:stone_crafting_materials": "minecraft:cobblestone",
             "mekanism:muffling_center": "minecraft:iron_ingot", "c:dusts/redstone": "minecraft:redstone"})
TODOS.update(NOVOS)
for en, pt in METAIS.items():
    TAGS[f"mekanism:crystals/{en}"] = f"cl:cristal_{pt}"
    TAGS[f"c:crystals/{en}"] = f"cl:cristal_{pt}"
TAGS.update({
    "c:dusts/sulfur": "cl:po_enxofre", "c:gunpowders": "minecraft:gunpowder", "c:gems/fluorite": "cl:fluorita", "c:dusts/fluorite": "cl:po_fluorita",
    "c:storage_blocks/fluorite": "cl:bloco_fluorita", "c:ores/fluorite": ["cl:minerio_fluorita", "cl:minerio_fluorita_profundo"],
    "c:dusts/salt": "cl:sal", "c:glass_blocks/cheap": "minecraft:glass", "mekanism:personal_storage": "cl:barril_pessoal",
    "c:pellets/hdpe": "cl:pellet_pead", "c:barrels/wooden": "minecraft:barrel", "c:barrels": "minecraft:barrel", "c:fuels/block/bio": None, "c:dusts/wood": "cl:serragem",
})


def um(x):
    if isinstance(x, list):
        alts = [a for a in (um(i) for i in x) if a]
        return alts[0] if len(alts) == 1 else (sum(([a] if isinstance(a, str) else a for a in alts), []) or None)
    if isinstance(x, dict):
        if "tag" in x:
            m = re.fullmatch(r"minecraft:(\w+)_(logs|stems)", x["tag"])
            if m:  # as toras de cada madeira (com casca e descascadas)
                w, t = m.group(1), "log" if m.group(2) == "logs" else "stem"
                f = "wood" if t == "log" else "hyphae"
                return [f"minecraft:{w}_{t}", f"minecraft:stripped_{w}_{t}", f"minecraft:{w}_{f}", f"minecraft:stripped_{w}_{f}"]
            return TAGS.get(x["tag"])
        if "item" in x:
            return um(x["item"])
        if "id" in x:
            return um(x["id"])
        return None
    ns, nome = x.split(":", 1)
    if ns == "minecraft":
        return x
    return f"cl:{TODOS[nome]}" if nome in TODOS else None


def simples(x):
    r = um(x)
    return r[0] if isinstance(r, list) else r




# Parte 4 (1.52.0): urânio, química nuclear, multiblocos e reatores (Mekanism e Mekanism Generators).
_N4 = (("basic", "basico"), ("advanced", "avancado"), ("elite", "elite"), ("ultimate", "definitivo"))
RECURSOS4 = {
    "ingot_uranium": "lingote_uranio", "raw_uranium": "uranio_bruto", "nugget_uranium": "pepita_uranio", "dust_uranium": "po_uranio",
    "block_uranium": "bloco_uranio", "block_raw_uranium": "bloco_uranio_bruto", "uranium_ore": "minerio_uranio", "deepslate_uranium_ore": "minerio_uranio_profundo",
    "osmium_ore": "minerio_osmio", "deepslate_osmium_ore": "minerio_osmio_profundo", "raw_osmium": "osmio_bruto", "block_osmium": "bloco_osmio",
    "block_raw_osmium": "bloco_osmio_bruto", "nugget_osmium": "pepita_osmio", "tin_ore": "minerio_estanho", "deepslate_tin_ore": "minerio_estanho_profundo",
    "raw_tin": "estanho_bruto", "block_raw_tin": "bloco_estanho_bruto", "nugget_tin": "pepita_estanho", "nugget_steel": "pepita_aco", "nugget_bronze": "pepita_bronze",
    "nugget_refined_obsidian": "pepita_obsidiana_refinada", "nugget_refined_glowstone": "pepita_glowstone_refinado", "block_refined_obsidian": "bloco_obsidiana_refinada",
    "block_refined_glowstone": "bloco_glowstone_refinado", "block_salt": "bloco_sal", "block_bio_fuel": "bloco_biocombustivel", "dust_bronze": "po_bronze",
    "dust_emerald": "po_esmeralda", "dust_netherite": "po_netherita", "dirty_netherite_scrap": "sucata_netherita_suja",
}
ITENS4 = {
    "yellow_cake_uranium": "bolo_amarelo_uranio", "pellet_plutonium": "pastilha_plutonio", "pellet_polonium": "pastilha_polonio",
    "pellet_antimatter": "pastilha_antimateria", "reprocessed_fissile_fragment": "fragmento_fissil_reprocessado", "dosimeter": "dosimetro",
    "geiger_counter": "contador_geiger", "hazmat_mask": "mascara_hazmat", "hazmat_gown": "jaleco_hazmat", "hazmat_pants": "calca_hazmat",
    "hazmat_boots": "botas_hazmat", "hohlraum": "hohlraum", "turbine_blade": "pa_turbina_mk",
}
MAQ4 = {
    "isotopic_centrifuge": "centrifuga_isotopica", "solar_neutron_activator": "ativador_neutrons_solar", "antiprotonic_nucleosynthesizer": "nucleossintetizador",
    "nutritional_liquifier": "liquidificador_nutricional", "resistive_heater": "aquecedor_resistivo", "fuelwood_heater": "aquecedor_lenha", "laser": "laser_mk",
    "laser_amplifier": "amplificador_laser", "laser_tractor_beam": "feixe_trator_laser", "dimensional_stabilizer": "estabilizador_dimensional",
    "radioactive_waste_barrel": "barril_residuos_radioativos",
}
ESTRUTURA4 = {
    "boiler_casing": "revestimento_caldeira", "boiler_valve": "valvula_caldeira", "pressure_disperser": "dispersor_pressao",
    "superheating_element": "elemento_superaquecimento", "dynamic_valve": "valvula_dinamica", "structural_glass": "vidro_estrutural",
    "thermal_evaporation_block": "bloco_evaporacao", "thermal_evaporation_controller": "controlador_evaporacao", "thermal_evaporation_valve": "valvula_evaporacao",
    "induction_casing": "revestimento_inducao", "induction_port": "porta_inducao", "sps_casing": "revestimento_sps", "sps_port": "porta_sps",
    "supercharged_coil": "bobina_supercarregada",
    **{f"{t}_induction_cell": f"celula_inducao_{m}" for t, m in _N4}, **{f"{t}_induction_provider": f"provedor_inducao_{m}" for t, m in _N4},
    # Mekanism Generators
    "fission_reactor_casing": "revestimento_fissao", "fission_reactor_port": "porta_fissao", "fission_reactor_logic_adapter": "adaptador_logico_fissao",
    "fission_fuel_assembly": "conjunto_combustivel_fissao", "control_rod_assembly": "conjunto_barras_controle", "reactor_glass": "vidro_reator_mk",
    "turbine_casing": "revestimento_turbina_mk", "turbine_valve": "valvula_turbina_mk", "turbine_vent": "ventilacao_turbina", "turbine_rotor": "rotor_turbina",
    "rotational_complex": "complexo_rotacional", "electromagnetic_coil": "bobina_eletromagnetica", "saturating_condenser": "condensador_saturante",
    "fusion_reactor_controller": "controlador_fusao", "fusion_reactor_frame": "moldura_fusao", "fusion_reactor_port": "porta_fusao",
    "fusion_reactor_logic_adapter": "adaptador_logico_fusao", "laser_focus_matrix": "matriz_foco_laser",
}
CONDUTORES4 = {f"{t}_thermodynamic_conductor": f"condutor_termico_{m}" for t, m in _N4}
NOVOS.update(RECURSOS4); NOVOS.update(ITENS4); NOVOS.update(MAQ4); NOVOS.update(ESTRUTURA4); NOVOS.update(CONDUTORES4)
# Os geradores que o pack já tinha (1.7.0), para as receitas que os usam.
GERADORES_JA = {"heat_generator": "gerador_calor", "solar_generator": "gerador_solar_mk", "advanced_solar_generator": "gerador_solar_avancado",
                "bio_generator": "gerador_bio", "gas_burning_generator": "gerador_gas", "wind_generator": "gerador_eolico", "solar_panel": "painel_solar_mk"}
TODOS.update(NOVOS); TODOS.update(GERADORES_JA)
TAGS.update({
    "c:ingots/uranium": "cl:lingote_uranio", "c:raw_materials/uranium": "cl:uranio_bruto", "c:nuggets/uranium": "cl:pepita_uranio",
    "c:storage_blocks/uranium": "cl:bloco_uranio", "c:storage_blocks/raw_uranium": "cl:bloco_uranio_bruto",
    "c:ores/uranium": ["cl:minerio_uranio", "cl:minerio_uranio_profundo"], "c:dusts/uranium": "cl:po_uranio",
    "c:storage_blocks/raw_osmium": "cl:bloco_osmio_bruto", "c:storage_blocks/raw_tin": "cl:bloco_estanho_bruto", "c:nuggets/osmium": "cl:pepita_osmio",
    "c:nuggets/tin": "cl:pepita_estanho", "c:nuggets/steel": "cl:pepita_aco", "c:nuggets/bronze": "cl:pepita_bronze",
    "c:nuggets/refined_obsidian": "cl:pepita_obsidiana_refinada", "c:nuggets/refined_glowstone": "cl:pepita_glowstone_refinado",
    "c:storage_blocks/refined_obsidian": "cl:bloco_obsidiana_refinada", "c:storage_blocks/refined_glowstone": "cl:bloco_glowstone_refinado",
    "c:storage_blocks/salt": "cl:bloco_sal", "c:dusts/bronze": "cl:po_bronze", "c:dusts/emerald": "cl:po_esmeralda", "c:dusts/netherite": "cl:po_netherita",
    "c:pellets/plutonium": "cl:pastilha_plutonio", "c:pellets/polonium": "cl:pastilha_polonio", "c:pellets/antimatter": "cl:pastilha_antimateria",
    "c:fuels/bio": "cl:biocombustivel", "c:fuels/block/bio": "cl:bloco_biocombustivel", "c:ingots/lead": "cl:lingote_chumbo",
    "mekanism:enriched/gold": "cl:ouro_enriquecido", "c:silicon": None, "c:ingots/silicon": None,
})
TAGS.update({"c:storage_blocks/diamond": "minecraft:diamond_block", "c:dyes/black": "minecraft:black_dye", "c:glass_panes": "minecraft:glass_pane",
             "c:gems/amethyst": "minecraft:amethyst_shard", "c:gems/prismarine": "minecraft:prismarine_shard", "c:gems/lapis": "minecraft:lapis_lazuli",
             "c:ingots/gold": "minecraft:gold_ingot", "c:ender_pearls": "minecraft:ender_pearl", "c:obsidians/crying": "minecraft:crying_obsidian",
             "c:dyes/white": "minecraft:white_dye", "c:dyes/red": "minecraft:red_dye", "c:dyes/yellow": "minecraft:yellow_dye"})
for _c in ("white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"):
    TAGS[f"c:dyes/{_c}"] = f"minecraft:{_c}_dye"

# Parte 5 (1.53.0): equipamentos (Meka-Tool, MekaSuit, módulos, Desmontador Atômico...), QIO e o Robit.
MODULOS5 = {
    "module_base": "base_modulo", "module_energy_unit": "modulo_energia", "module_excavation_escalation_unit": "modulo_escavacao",
    "module_attack_amplification_unit": "modulo_ataque", "module_farming_unit": "modulo_cultivo", "module_shearing_unit": "modulo_tosquia",
    "module_silk_touch_unit": "modulo_toque_suave", "module_fortune_unit": "modulo_fortuna", "module_blasting_unit": "modulo_explosao",
    "module_vein_mining_unit": "modulo_veio", "module_teleportation_unit": "modulo_teletransporte", "module_electrolytic_breathing_unit": "modulo_respiracao",
    "module_inhalation_purification_unit": "modulo_purificacao", "module_vision_enhancement_unit": "modulo_visao", "module_nutritional_injection_unit": "modulo_nutricao",
    "module_radiation_shielding_unit": "modulo_blindagem_radiacao", "module_dosimeter_unit": "modulo_dosimetro", "module_geiger_unit": "modulo_geiger",
    "module_jetpack_unit": "modulo_jetpack", "module_charge_distribution_unit": "modulo_distribuicao_carga", "module_gravitational_modulating_unit": "modulo_gravitacional",
    "module_elytra_unit": "modulo_elitro", "module_locomotive_boosting_unit": "modulo_locomocao", "module_gyroscopic_stabilization_unit": "modulo_giroscopio",
    "module_hydraulic_propulsion_unit": "modulo_propulsao", "module_magnetic_attraction_unit": "modulo_magnetico", "module_frost_walker_unit": "modulo_gelo",
    "module_hydrostatic_repulsor_unit": "modulo_hidrostatico", "module_motorized_servo_unit": "modulo_servo", "module_soul_surfer_unit": "modulo_almas",
    "module_laser_dissipation_unit": "modulo_dissipacao_laser", "module_color_modulation_unit": "modulo_cor", "module_solar_recharging_unit": "modulo_solar",
    "module_geothermal_generator_unit": "modulo_geotermico",
}
ITENS5 = {
    "atomic_disassembler": "desmontador_atomico", "meka_tool": "ferramenta_meka", "mekasuit_helmet": "capacete_mekasuit", "mekasuit_bodyarmor": "peitoral_mekasuit",
    "mekasuit_pants": "calcas_mekasuit", "mekasuit_boots": "botas_mekasuit", "electric_bow": "arco_eletrico", "flamethrower": "lanca_chamas",
    "free_runners": "corredores_livres", "free_runners_armored": "corredores_livres_blindados", "jetpack_armored": "jetpack_blindado",
    "scuba_mask": "mascara_mergulho", "scuba_tank": "tanque_mergulho", "configurator": "configurador", "network_reader": "leitor_rede",
    "dictionary": "dicionario", "gauge_dropper": "conta_gotas", "canteen": "cantil", "configuration_card": "cartao_configuracao", "hdpe_elytra": "elitro_pead",
    "dye_base": "base_tinta", "qio_drive_base": "unidade_qio_base", "qio_drive_hyper_dense": "unidade_qio_hiperdensa", "qio_drive_time_dilating": "unidade_qio_dilatacao",
    "qio_drive_supermassive": "unidade_qio_supermassiva", "portable_qio_dashboard": "painel_qio_portatil",
}
BLOCOS5 = {"modification_station": "estacao_modificacao", "qio_drive_array": "matriz_unidades_qio", "qio_dashboard": "painel_qio", "qio_importer": "importador_qio",
           "qio_exporter": "exportador_qio", "qio_redstone_adapter": "adaptador_redstone_qio", "personal_chest": "bau_pessoal", "cardboard_box": "caixa_papelao"}
NOVOS.update(MODULOS5); NOVOS.update(ITENS5); NOVOS.update(BLOCOS5)
TODOS.update(NOVOS)
TAGS.update({"c:chests/personal": "cl:bau_pessoal", "c:leathers": "minecraft:leather", "c:feathers": "minecraft:feather", "c:strings": "minecraft:string",
             "c:ingots/silver": None, "c:rods/blaze": "minecraft:blaze_rod", "c:nether_stars": "minecraft:nether_star", "c:slime_balls": "minecraft:slime_ball",
             "c:gems/quartz": "minecraft:quartz", "c:dusts/sulfur": "cl:po_enxofre", "minecraft:wool": "minecraft:white_wool", "c:bones": "minecraft:bone",
             "c:dusts/glowstone": "minecraft:glowstone_dust", "c:crops/wheat": "minecraft:wheat", "c:gunpowders": "minecraft:gunpowder"})
for _t, _v in (("basic", "minecraft:redstone"), ("infused", "cl:liga_enriquecida"), ("advanced", "cl:liga_enriquecida"), ("reinforced", "cl:liga_reforcada"),
               ("elite", "cl:liga_reforcada"), ("atomic", "cl:liga_atomica"), ("ultimate", "cl:liga_atomica")):
    TAGS[f"c:alloys/{_t}"] = _v

# Texturas e ícones ORIGINAIS dos mods que permitem (1.10.1): copia do código-fonte de cada mod para a arte do pack
# (RP/textures/items/cl/arte/<item>.png, RP/textures/blocks/cl/arte/<bloco>[_<face>].png e as camadas das armaduras),
# que o build já põe no lugar dos desenhos gerados (tools/aplicar-icones.mjs). Animações: só o 1º quadro.
# Só entram mods com licença que deixa usar a arte (ver CREDITOS.md e docs/licencas/):
#   Mekanism (MIT), Ender IO (Unlicense/CC0), Waystones (MIT), ComputerCraft (CCPL), Tinkers' Construct (CC BY 3.0),
#   Applied Energistics 2 (CC BY-NC-SA 3.0), PneumaticCraft (GPLv3), Big Reactors (MIT), BuildCraft (MMPL),
#   OpenBlocks (MIT), Chisel (GPLv2), ChickenChunks (MIT) e EnviroMine (CC BY-NC-SA 4.0).
# Fora (todos os direitos reservados ou sem licença): Create, Galacticraft, Extra Utilities, Thermal Expansion,
# MineFactory Reloaded, Pam's HarvestCraft, Sync, JABBA, BiblioCraft, Ex Nihilo, Backpacks e Hunger Overhaul.
# Uso (os repositórios clonados numa pasta, um por mod, com os nomes de FONTES):
#   python3 tools/importar-originais.py <pasta dos mods>
# Depois: npm run build e python3 tools/icones-blocos.py (ícones 3D dos blocos com as faces novas).
import json, os, shutil, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MODS = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-originais.py <pasta dos mods>")
FONTES = {
    "mekanism": "mekanism/src/main/resources/assets/mekanism/",
    "enderio": "enderio/enderio-base/src/main/resources/assets/enderio/textures/",
    "enderio_maq": "enderio/enderio-machines/src/main/resources/assets/enderio/textures/",
    "enderio_cond": "enderio/enderio-conduits/src/main/resources/assets/enderio/textures/",
    "mekanism_additions": "mekanism10/src/additions/resources/assets/mekanismadditions/textures/",
    "farmers": "farmersdelight/src/main/resources/assets/farmersdelight/textures/",
    "quark": "quark/src/main/resources/assets/quark/textures/",
    "aircraft": "aircraft/common/src/main/resources/assets/immersive_aircraft/textures/",
    "waystones": "waystones/src/main/resources/assets/waystones/textures/",
    "computercraft": "computercraft/src/main/resources/assets/computercraft/textures/",
    "tinkers": "tconstruct/resources/assets/tinker/textures/",
    "ae2": "ae2/src/main/resources/assets/appliedenergistics2/textures/",
    "pneumaticcraft": "pneumaticcraft/resources/assets/pneumaticcraft/textures/",
    "bigreactors": "bigreactors/src/main/resources/assets/bigreactors/textures/",
    "buildcraft": "buildcraft/buildcraft_resources/assets/",
    "openblocks": "openblocks/src/main/resources/assets/openblocks/textures/",
    "chisel": "chisel/src/main/resources/assets/chisel/textures/",
    "chickenchunks": "chickenchunks/src/main/resources/assets/chickenchunks/textures/",
    "enviromine": "enviromine/src/main/resources/assets/enviromine/textures/",
}
LICENCAS = {  # arquivo de licença de cada repositório (cópia em docs/licencas/)
    "mekanism": "mekanism/README.md", "mekanism_additions": "mekanism10/LICENSE", "farmers": "farmersdelight/LICENSE", "quark": "quark/LICENSE.md", "aircraft": "aircraft/LICENSE", "enderio": "enderio/LICENSE", "waystones": "waystones/LICENSE",
    "computercraft": "computercraft/LICENSE", "tinkers": "tconstruct/README.md", "ae2": "ae2/README.md",
    "pneumaticcraft": "pneumaticcraft/LICENSE", "bigreactors": "bigreactors/LICENSE.txt", "buildcraft": "buildcraft/LICENSE",
    "openblocks": "openblocks/LICENSE", "chisel": "chisel/LICENSE", "chickenchunks": "chickenchunks/LICENSE.txt",
    "enviromine": "enviromine/LICENSE",
}

ITENS = {}  # id do item -> (fonte, caminho) ou lista de camadas (ferramentas do Tinkers)
FACES = {}  # id do bloco -> {face: (fonte, caminho)}; face "" = textura única do bloco
ARMADURAS = {}  # material -> (fonte, caminho com {n})
TINTA = {}  # id do bloco -> cor "#rrggbb" para tingir a textura (o plástico do Mekanism é cinza e o jogo pinta)


def itens(fonte, pasta, mapa):
    for i, arq in mapa.items():
        ITENS[i] = (fonte, f"{pasta}{arq}.png")


def faces(fonte, pasta, i, frente, lado=None, topo=None, baixo=None):
    lado = lado or frente
    topo = topo or lado
    FACES[i] = {f: (fonte, f"{pasta}{a}.png") for f, a in (("frente", frente), ("lado", lado), ("topo", topo), ("baixo", baixo or topo))}


def unica(fonte, pasta, i, arq):
    FACES[i] = {"": (fonte, f"{pasta}{arq}.png")}


# ---------- Mekanism (Mekanism, Generators e Tools da 1.7.10) ----------
itens("mekanism", "textures/items/", {
    "lingote_osmio": "OsmiumIngot", "po_osmio": "OsmiumDust", "lingote_obsidiana_refinada": "ObsidianIngot",
    "lingote_glowstone_refinado": "GlowstoneIngot", "circuito_controle_basico": "BasicControlCircuit",
    "circuito_controle_avancado": "AdvancedControlCircuit", "tablet_energia": "EnergyTablet", "nucleo_eletrolitico": "ElectrolyticCore",
    "biocombustivel": "BioFuel", "painel_solar_mk": "SolarPanel", "liga_enriquecida": "EnrichedAlloy", "liga_reforcada": "ReinforcedAlloy",
    "liga_atomica": "AtomicAlloy", "po_litio": "LithiumDust", "balde_salmoura": "BrineBucket",
    # pós de metal (os do Thermal Expansion não podem): os do Mekanism
    "po_ferro": "IronDust", "po_ouro": "GoldDust", "po_cobre": "CopperDust", "po_estanho": "TinDust",
})
MK_MAT = {"obsidiana": "Obsidian", "lapis": "Lazuli", "osmio": "Osmium", "bronze": "Bronze", "glowstone": "Glowstone", "aco": "Steel"}
MK_PECA = {"picareta": "Pickaxe", "machado": "Axe", "pa": "Shovel", "enxada": "Hoe", "espada": "Sword", "paxel": "Paxel",
           "capacete": "Helmet", "peitoral": "Chestplate", "calcas": "Leggings", "botas": "Boots"}
for m, en in MK_MAT.items():
    itens("mekanism", "textures/items/", {f"mk_{p}_{m}": f"{en}{pe}" for p, pe in MK_PECA.items()})
    ARMADURAS[m] = ("mekanism", f"armor/{en.lower()}_{{n}}.png")
itens("mekanism", "textures/items/", {f"mk_paxel_{m}": f"{en}Paxel" for m, en in
                                      {"madeira": "Wood", "pedra": "Stone", "ferro": "Iron", "ouro": "Gold", "diamante": "Diamond"}.items()})
B = "textures/blocks/"
faces("mekanism", B, "triturador_mk", "crusher/CrusherFront", "crusher/CrusherLeft", "crusher/CrusherTop")
faces("mekanism", B, "camara_purificacao", "purification_chamber/PurificationChamberFront", "purification_chamber/PurificationChamberLeft",
      "purification_chamber/PurificationChamberTop", "purification_chamber/PurificationChamberBottom")
faces("mekanism", B, "camara_injecao", "chemical_injection_chamber/ChemicalInjectionChamberFront", "chemical_injection_chamber/ChemicalInjectionChamberLeft",
      "chemical_injection_chamber/ChemicalInjectionChamberTop", "chemical_injection_chamber/ChemicalInjectionChamberBottom")
faces("mekanism", B, "evaporador", "SalinationController", "SalinationBlock")
unica("mekanism", B, "revestimento_aco", "SteelCasing")

# ---------- Mekanism Additions (Mekanism 10, 1.20) ----------
CORES = [("branco", "#f9fffe"), ("laranja", "#f9801d"), ("magenta", "#c74ebd"), ("azul_claro", "#3ab3da"), ("amarelo", "#fed83d"), ("lima", "#80c71f"),
         ("rosa", "#f38baa"), ("cinza", "#474f52"), ("cinza_claro", "#9d9d97"), ("ciano", "#169c9c"), ("roxo", "#8932b8"), ("azul", "#3c44aa"),
         ("marrom", "#835432"), ("verde", "#5e7c16"), ("vermelho", "#b02e26"), ("preto", "#1d1d21")]  # as de tools/dados/conteudo/f32.mjs
for pre, arq in (("plastico", "plastic_block"), ("plastico_liso", "slick_plastic_block"), ("plastico_brilhante", "plastic_glow_block"),
                 ("plastico_reforcado", "reinforced_plastic_block"), ("estrada_plastico", "plastic_road"), ("painel_brilhante", "glow_panel")):
    for c, cor in CORES:
        unica("mekanism_additions", "block/", f"{pre}_{c}", arq)
        TINTA[f"{pre}_{c}"] = cor
unica("enderio_cond", "blocks/", "conduto_energia", "power_conduit")
unica("enderio_cond", "blocks/", "conduto_item", "item_conduit_core")

# ---------- Farmer's Delight (1.20) ----------
itens("farmers", "item/", {
    **{f"faca_{m}": f"{en}_knife" for m, en in (("silex", "flint"), ("ferro", "iron"), ("ouro", "golden"), ("diamante", "diamond"))},
    "palha": "straw", "lona": "canvas", "repolho": "cabbage", "semente_repolho": "cabbage_seeds", "folha_repolho": "cabbage_leaf",
    "carne_moida": "minced_beef", "hamburguer_carne": "beef_patty", "pedacos_frango": "chicken_cuts", "pedacos_frango_cozidos": "cooked_chicken_cuts",
    "bacon": "bacon", "bacon_cozido": "cooked_bacon", "fatia_bacalhau": "cod_slice", "fatia_bacalhau_cozida": "cooked_cod_slice",
    "fatia_salmao": "salmon_slice", "fatia_salmao_cozida": "cooked_salmon_slice", "costeleta_carneiro": "mutton_chops",
    "costeleta_carneiro_cozida": "cooked_mutton_chops", "fatia_abobora": "pumpkin_slice", "macarrao_cru": "raw_pasta", "molho_tomate": "tomato_sauce",
    "arroz_cozido": "cooked_rice", "caldo_osso": "bone_broth", "ensopado_carne": "beef_stew", "sopa_frango": "chicken_soup", "ensopado_peixe": "fish_stew",
    "sopa_cebola": "onion_soup", "sopa_abobora": "pumpkin_soup", "ensopado_bacalhau": "baked_cod_stew", "sopa_macarrao": "noodle_soup",
    "macarrao_almondegas": "pasta_with_meatballs", "macarrao_carneiro": "pasta_with_mutton_chop", "ratatouille": "ratatouille",
    "arroz_cogumelos": "mushroom_rice", "macarrao_tinta_lula": "squid_ink_pasta", "macarrao_legumes": "vegetable_noodles", "rolinhos_repolho": "cabbage_rolls",
    "bolinhos": "dumplings", "salada_mista": "mixed_salad", "salada_frutas": "fruit_salad", "espetinho": "barbecue_stick", "sanduiche_ovo": "egg_sandwich",
    "sanduiche_frango": "chicken_sandwich", "sanduiche_bacon": "bacon_sandwich", "wrap_carneiro": "mutton_wrap", "bife_batatas": "steak_and_potatoes",
    "bacon_ovos": "bacon_and_eggs", "batata_recheada": "stuffed_potato", "salmao_grelhado": "grilled_salmon", "costeletas_assadas": "roasted_mutton_chops",
})
faces("farmers", "block/", "panela_cozinha", "cooking_pot_side", "cooking_pot_side", "cooking_pot_top", "cooking_pot_bottom")
faces("farmers", "block/", "fogao", "stove_front", "stove_side", "stove_top", "stove_bottom")
faces("farmers", "block/", "tabua_cortar", "cutting_board")
unica("farmers", "block/", "corda", "rope")
for i, a in (("caixote_repolho", "cabbage_crate"), ("caixote_tomate", "tomato_crate"), ("caixote_cebola", "onion_crate"), ("caixote_cenoura", "carrot_crate"),
             ("caixote_batata", "potato_crate"), ("caixote_beterraba", "beetroot_crate")):
    faces("farmers", "block/", i, f"{a}_side", f"{a}_side", f"{a}_top", "crate_bottom")
faces("farmers", "block/", "saco_arroz", "rice_bag_side", "rice_bag_side", "rice_bag_top", "rice_bag_bottom")
faces("farmers", "block/", "fardo_palha", "straw_bale_side", "straw_bale_side", "straw_bale_end")

# ---------- Immersive Aircraft (1.13.0) ----------
itens("aircraft", "item/", {"casco_aeronave": "hull", "motor_aeronave": "engine", "vela_aeronave": "sail", "helice_aviao": "propeller", "caldeira": "boiler",
                            "biplano": "biplane", "dirigivel": "airship", "girocoptero": "gyrodyne", "quadricoptero": "quadrocopter"})

# ---------- Quark ----------
itens("quark", "item/", {"picarango": "pickarang"})
Q = "block/"
for i, a in (("caixote_maca", "apple_crate"), ("saco_bagas", "berry_sack"), ("saco_polvora", "gunpowder_sack"), ("saco_cacau", "cocoa_beans_sack")):
    faces("quark", Q, i, a, a, f"{a}_top", f"{a}_bottom")
for i, a in (("bloco_cana", "sugar_cane_block"), ("bloco_cacto", "cactus_block"), ("bloco_gravetos", "stick_block")):
    faces("quark", Q, i, a, a, f"{a}_top")
unica("quark", Q, "bloco_carvao_vegetal", "charcoal_block")
for p, en in (("jaspe", "jasper"), ("xisto", "shale")):
    unica("quark", Q, p, en)
    unica("quark", Q, f"{p}_polido", f"polished_{en}")
    unica("quark", Q, f"{p}_tijolos", f"{en}_bricks")
    unica("quark", Q, f"{p}_entalhado", f"chiseled_{en}_bricks")
    faces("quark", Q, f"{p}_pilar", f"{en}_pillar", f"{en}_pillar", f"{en}_pillar_top")
for i, a in (("vidro_emoldurado", "framed_glass"), ("bloco_placa_ferro", "iron_plate"), ("bloco_placa_ferro_enferrujada", "rusty_iron_plate"), ("grade", "grate"),
             ("palha_trancada", "thatch"), ("lampada_pedra", "stone_lamp")):
    unica("quark", Q, i, a)
faces("quark", Q, "lanterna_papel", "paper_lantern_side", "paper_lantern_side", "paper_lantern_top_bottom")

# ---------- Ender IO 5.2 ----------
itens("enderio", "items/", {
    "po_carvao": "item_material_powder_coal", "aco_eletrico": "item_alloy_ingot_electrical_steel", "liga_energetica": "item_alloy_ingot_energetic_alloy",
    "liga_vibrante": "item_alloy_ingot_vibrant_alloy", "liga_redstone": "item_alloy_ingot_redstone_alloy", "ferro_condutor": "item_alloy_ingot_conductive_iron",
    "ferro_pulsante": "item_alloy_ingot_pulsating_iron", "aco_negro": "item_alloy_ingot_dark_steel", "cristal_pulsante": "item_material_pulsating_crystal",
    "composto_aglutinante": "item_material_binder_composite", "aglutinante_conduite": "item_material_conduit_binder",
    "capacitor_basico": "item_basic_capacitor_basic", "capacitor_duplo": "item_basic_capacitor_activated", "capacitor_octadico": "item_basic_capacitor_ender",
    "engrenagem_aco_negro": "item_material_gear_darksteel", "placa_fotovoltaica": "item_material_plate_photovoltaic",
    "eio_picareta_aco_negro": "item_dark_steel_pickaxe", "eio_machado_aco_negro": "item_dark_steel_axe", "eio_espada_aco_negro": "item_dark_steel_sword",
    "eio_capacete_aco_negro": "item_dark_steel_helmet", "eio_peitoral_aco_negro": "item_dark_steel_chestplate",
    "eio_calcas_aco_negro": "item_dark_steel_leggings", "eio_botas_aco_negro": "item_dark_steel_boots",
})
ARMADURAS["aco_negro"] = ("enderio", "models/armor/dark_steel_layer_{n}.png")
M = ("block_machine_side", "block_machine_top", "block_machine_bottom")
faces("enderio", "blocks/", "fundidora_ligas", "block_alloy_smelter_front", *M)
faces("enderio", "blocks/", "moinho_sag", "block_sagmill_front", *M)
faces("enderio", "blocks/", "gerador_stirling", "block_stirling_gen_front_off", *M)
faces("enderio", "blocks/", "chassi_maquina", "block_machine_back", *M)
for i in ("banco_capacitores_basico", "banco_capacitores", "banco_capacitores_vibrante"):
    faces("enderio", "blocks/", i, "capacitor_bank")
faces("enderio", "blocks/", "ancora_viagem", "block_travel_anchor")
for i, p in (("painel_fotovoltaico", "normal"), ("painel_fotovoltaico_avancado", "advanced"), ("painel_fotovoltaico_vibrante", "vibrant")):
    faces("enderio_maq", "blocks/", i, f"solar_panel_{p}_side", f"solar_panel_{p}_side", f"solar_panel_{p}_top", f"solar_panel_{p}_side")

# ---------- Waystones e ComputerCraft ----------
itens("waystones", "items/", {"pedra_viagem": "warpStone", "pergaminho_retorno": "returnScroll", "pergaminho_viagem": "returnScroll"})
itens("computercraft", "blocks/", {"computador": "computer_front"})

# ---------- Tinkers' Construct 1.7.10 ----------
TC_MAT = {"madeira": "wood", "pedra": "stone", "silex": "flint", "cacto": "cactus", "osso": "bone", "obsidiana": "obsidian",
          "ferro": "iron", "cobre": "copper", "bronze": "bronze", "aco": "steel"}
TC_PECA = {"cabo": "rod", "ligacao": "binding", "cabeca_picareta": "pickaxe_head", "cabeca_pa": "shovel_head", "cabeca_machado": "axe_head",
           "lamina_espada": "sword_blade", "guarda_larga": "large_guard", "travessa": "crossbar"}
TC_PADRAO = {"cabo": "rod", "ligacao": "binding", "cabeca_picareta": "pickaxe", "cabeca_pa": "shovel", "cabeca_machado": "axe",
             "lamina_espada": "swordblade", "guarda_larga": "largeguard", "travessa": "crossbar"}
# Ferramenta: as camadas do próprio Tinkers (cabo, cabeça e acessório), uma sobre a outra.
TC_FERR = {"picareta": ("pickaxe", ["pickaxe_handle", "pickaxe_head", "pickaxe_accessory"]), "pa": ("shovel", ["shovel_handle", "shovel_head"]),
           "machadinha": ("axe", ["axe_handle", "axe_head"]), "espada_larga": ("broadsword", ["sword_handle", "sword_blade", "sword_accessory"])}
for m, en in TC_MAT.items():
    itens("tinkers", "items/parts/", {f"peca_{p}_{m}": f"{en}_{pe}" for p, pe in TC_PECA.items()})
    for f, (pasta, camadas) in TC_FERR.items():
        ITENS[f"{f}_{m}"] = [("tinkers", f"items/{pasta}/{en}_{c}.png") for c in camadas]
itens("tinkers", "items/materials/", {f"padrao_{p}": f"pattern_{pe}" for p, pe in TC_PADRAO.items()})
itens("tinkers", "items/materials/", {f"molde_{p}": f"cast_{pe}" for p, pe in {**TC_PADRAO, "lingote": "ingot", "pepita": "nugget", "cabeca_picareta": "pickaxe",
                                                                              "lamina_espada": "swordblade", "guarda_larga": "largeguard"}.items()})
itens("tinkers", "items/materials/", {
    "padrao_branco": "blank_pattern", "lingote_bronze": "material_bronzeingot", "lingote_aco": "material_steelingot", "lingote_estanho": "material_tiningot",
    "lingote_aluminio": "material_aluminumingot", "bola_musgo": "material_mossball", "argamassa": "grout", "tijolo_refratario": "material_searedbrick",
})
T = "blocks/"
unica("tinkers", T, "tijolos_refratarios", "searedbrick")
faces("tinkers", T, "controlador_fundicao", "smeltery_inactive", "smeltery_side", "searedbrick")
faces("tinkers", T, "tanque_refratario", "lavatank_side", "lavatank_side", "lavatank_top")
faces("tinkers", T, "dreno_fundicao", "drain_out", "drain_side")
faces("tinkers", T, "torneira", "faucet")
faces("tinkers", T, "mesa_fundicao", "castingtable_side", "castingtable_side", "castingtable_top", "castingtable_bottom")
faces("tinkers", T, "bacia_fundicao", "blockcast_side", "blockcast_side", "blockcast_top", "blockcast_bottom")
faces("tinkers", T, "mesa_moldes", "stenciltable_oak_side", "stenciltable_oak_side", "stenciltable_oak_top", "stenciltable_oak_bottom")
faces("tinkers", T, "construtor_pecas", "partbuilder_oak_side", "partbuilder_oak_side", "partbuilder_oak_top", "partbuilder_oak_bottom")
faces("tinkers", T, "estacao_ferramentas", "toolstation_side", "toolstation_side", "toolstation_top", "toolstation_bottom")
for i, a in (("bloco_bronze", "compressed_bronze"), ("bloco_aco", "compressed_steel"), ("bloco_estanho", "compressed_tin")):
    unica("tinkers", T, i, a)

# ---------- Applied Energistics 2 (rv3, 1.7.10) ----------
itens("ae2", "items/", {
    **{f"celula_me_{k}": f"ItemBasicStorageCell.{k}" for k in ("1k", "4k", "16k", "64k")},
    **{f"componente_me_{k}": f"ItemMaterial.Cell{k}Part" for k in ("1k", "4k", "16k", "64k")},
    "cristal_certus": "ItemMaterial.CertusQuartzCrystal", "po_certus": "ItemMaterial.CertusQuartzDust", "silicio": "ItemMaterial.Silicon",
    "cristal_fluix": "ItemMaterial.FluixCrystal", "po_fluix": "ItemMaterial.FluixDust", "faca_corte": "ToolCertusQuartzCuttingKnife",
    "processador_basico": "ItemMaterial.LogicProcessor", "processador_avancado": "ItemMaterial.EngProcessor",
    "matriz_conversao": "ItemMaterial.FormationCore", "padrao_me_vazio": "ItemMaterial.BlankPattern", "terminal_sem_fio": "ToolWirelessTerminal",
})
faces("ae2", "blocks/", "controlador_me", "BlockController")
faces("ae2", "blocks/", "drive_me", "BlockDriveFront", "BlockDriveSide", "BlockDrive", "BlockDriveBottom")
faces("ae2", "blocks/", "bau_me", "BlockChestFront", "BlockChestSide", "BlockChest", "BlockChestBottom")
faces("ae2", "blocks/", "montador_molecular", "BlockMolecularAssembler")

# ---------- PneumaticCraft ----------
itens("pneumaticcraft", "items/", {"lingote_ferro_comprimido": "ingotIronCompressed", "manometro": "manometer", "placa_circuito_vazia": "EmptyPCB",
                                   "transistor": "Transistor", "capacitor": "Capacitor"})
unica("pneumaticcraft", "blocks/", "bloco_ferro_comprimido", "CompressedIronBlock")
unica("pneumaticcraft", "blocks/", "parede_camara", "pressureChamber/pressureChamberWall")
faces("pneumaticcraft", "blocks/", "valvula_camara", "pressureChamber/valve", "pressureChamber/pressureChamberWall")

# ---------- Big Reactors ----------
itens("bigreactors", "items/", {"lingote_yellorium": "ingotYellorium", "po_yellorium": "dustYellorium", "lingote_cianita": "ingotCyanite",
                                "lingote_blutonio": "ingotBlutonium", "barra_grafite": "ingotGraphite"})
BR = "blocks/tile."
CASCO = "blockReactorPart.casing.default"
unica("bigreactors", BR, "bloco_yellorium", "brMetal.blockYellorium")
unica("bigreactors", BR, "bloco_grafite", "brMetal.blockGraphite")
unica("bigreactors", BR, "carcaca_reator", CASCO)
unica("bigreactors", BR, "vidro_reator", "multiblockGlass.reactor.0")
for i, a in (("controlador_reator", "blockReactorPart.controller.idle"), ("porta_acesso_reator", "blockReactorPart.accessPort.inlet"),
             ("tomada_energia", "blockReactorPart.powerTap.disconnected"), ("porta_refrigeracao", "blockReactorPart.coolantPort.inlet"),
             ("reprocessador_cianita", "blockBRDevice.cyaniteReprocessor")):
    faces("bigreactors", BR, i, a, CASCO)
faces("bigreactors", BR, "barra_controle", "blockReactorPart.controlRod.top")
faces("bigreactors", "blocks/", "barra_combustivel", "fuelRod.side", "fuelRod.side", "fuelRod.end")

# ---------- BuildCraft 7.1 ----------
itens("buildcraft", "buildcraftcore/textures/items/", {f"engrenagem_{m}": f"{en}GearItem" for m, en in
                                                         {"madeira": "wooden", "pedra": "stone", "ferro": "iron", "ouro": "gold", "diamante": "diamond"}.items()})
itens("buildcraft", "buildcraftenergy/textures/items/", {"balde_petroleo": "bucketOil", "balde_combustivel": "bucketFuel"})
unica("buildcraft", "buildcraftenergy/textures/blocks/fluids/", "petroleo", "oil_still")
faces("buildcraft", "buildcraftfactory/textures/blocks/pumpBlock/", "bomba", "side", "side", "top", "bottom")

# ---------- OpenBlocks, ChickenChunks e EnviroMine ----------
itens("openblocks", "items/", {"asa_delta": "hang_glider"})
faces("openblocks", "blocks/", "tumulo", "grave_front", "grave_back", "grave_base")
unica("openblocks", "blocks/", "elevador", "elevator")
faces("chickenchunks", "block/full/", "carregador_chunks", "side", "side", "top", "bottom")
faces("chickenchunks", "block/spot/", "carregador_pontual", "side", "side", "top", "bottom")
itens("enviromine", "items/", {"camel_pack": "camel_pack", "mascara": "gas_mask", "filtro": "air_filter"})

# ---------- Chisel (as famílias de pedra; o casco da nave é nosso) ----------
itens("chisel", "items/", {"cinzel": "chisel_iron"})
CH = "blocks/"
unica("chisel", CH, "marmore", "marble")
unica("chisel", CH, "calcario", "limestone")
VARIANTES = ("liso", "polido", "tijolos", "tijolos_pequenos", "ladrilho", "pilar", "entalhado", "mosaico")
for familia, arqs in {
    "marmore": ["marble/raw", "marble/panel", "marble/marble-bricks", "marble/marble-arranged-bricks", "marble/marble-blocks",
                "marble/a1-stoneornamental-marbleclassicpanel", "marble/a1-stoneornamental-marblecarved", "marble/marble-fancy-bricks"],
    "calcario": ["limestone2", "limestone/terrain-pistonback-lightpanel", "limestone/terrain-cob-frenchlight", "limestone/terrain-cob-smallbricklight",
                 "limestone/terrain-cobbsmalltilelight", "limestone/terrain-pistonback-lightfour", "limestone/terrain-pistonback-dungeonornate",
                 "limestone/terrain-cob-french2light"],
    "arenito": ["sandstone/smooth", "sandstone/faded-side", "sandstone/blocks", "sandstone/small-side", "sandstone/horizontal-tiles-side",
                "sandstone/column-side", "sandstone/terrain-sandstone-smoothglyph-side", "sandstone/mosaic"],
    "pedra": ["stonebrick/fullsmooth", "stonebrick/panel-hard", "stonebrick/largebricks", "stonebrick/smallbricks", "stonebrick/fancy",
              "stonebrick/largeornate", "stonebrick/ornate", "stonebrick/chaotic"],
    "vidro": ["glass/terrain-glassnoborder", "glass/terrain-glass-steelframe", "glass/terrain-glassstone", "glass/terrain-glass-thingrid",
              "glass/terrain-glass-thickgrid", "glass/terrain-glassstreak", "glass/terrain-glass-ornatesteel", "glass/japanese"],
}.items():
    for v, a in zip(VARIANTES, arqs):
        unica("chisel", CH, f"{familia}_{v}", a)


# ---------- cópia ----------
def abrir(fonte, caminho):
    arq = os.path.join(MODS, FONTES[fonte], caminho)
    im = Image.open(arq).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im  # animação: 1º quadro


def salvar(im, rel):
    destino = os.path.join(R, rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino)


usados = {}
faltou = []
for i, src in ITENS.items():
    if not os.path.exists(os.path.join(R, f"BP/items/{i}.json")):
        faltou.append(f"item {i} (não existe no pack)")
        continue
    try:
        if isinstance(src, list):
            camadas = [abrir(*c) for c in src if os.path.exists(os.path.join(MODS, FONTES[c[0]], c[1]))]
            im = Image.new("RGBA", camadas[0].size)
            for c in camadas:
                im.alpha_composite(c.resize(im.size, Image.NEAREST))
            usados.setdefault(src[0][0], []).append(i)
        else:
            im = abrir(*src)
            usados.setdefault(src[0], []).append(i)
        if i == "pergaminho_viagem":  # o Waystones da 1.7.10 não tem o de viagem: o de retorno em roxo
            px = im.load()
            for x in range(im.width):
                for y in range(im.height):
                    r, g, b, a = px[x, y]
                    px[x, y] = (int(r * 0.75), int(g * 0.55), min(255, int(b * 1.1)), a)
        salvar(im, f"RP/textures/items/cl/arte/{i}.png")
    except Exception as e:
        faltou.append(f"item {i}: {e}")

for i, fs in FACES.items():
    if not os.path.exists(os.path.join(R, f"BP/blocks/{i}.json")):
        faltou.append(f"bloco {i} (não existe no pack)")
        continue
    try:
        ims = {f: abrir(*src) for f, src in fs.items()}
    except Exception as e:
        faltou.append(f"bloco {i}: {e}")
        continue
    for f, im in ims.items():
        if i in TINTA:
            cor = [int(TINTA[i][k:k + 2], 16) for k in (1, 3, 5)]
            px = im.load()
            for x in range(im.width):
                for y in range(im.height):
                    r, g, b, a = px[x, y]
                    px[x, y] = tuple(min(255, int(v * c / 255 * 1.12)) for v, c in zip((r, g, b), cor)) + (a,)
        salvar(im, f"RP/textures/blocks/cl/arte/{i}{'_' + f if f else ''}.png")
    # O ícone 3D do Catálogo passa a sair das faces novas (tools/icones-blocos.py).
    antigo = os.path.join(R, f"RP/textures/items/cl/arte/blocos/{i}.png")
    if os.path.exists(antigo):
        os.remove(antigo)
    usados.setdefault(next(iter(fs.values()))[0], []).append(i)

for m, (fonte, padrao) in ARMADURAS.items():
    for n in (1, 2):
        try:
            salvar(abrir(fonte, padrao.format(n=n)), f"RP/textures/models/armor/cl/{m}_{n}.png")
        except Exception as e:
            faltou.append(f"armadura {m}_{n}: {e}")
        else:
            usados.setdefault(fonte, []).append(f"armadura {m}_{n}")

# Plantação de repolho (HarvestCraft no pack, Farmer's Delight na arte): 3 estágios do mod (1, 4 e 7).
for k, est in enumerate((1, 4, 7)):
    salvar(abrir("farmers", f"block/cabbages_stage{est}.png"), f"RP/textures/blocks/cl/arte/planta_repolho_{k}.png")

os.makedirs(os.path.join(R, "docs/licencas"), exist_ok=True)
for fonte, arq in LICENCAS.items():
    if fonte in usados or (fonte == "enderio" and ("enderio_maq" in usados or "enderio_cond" in usados)):
        shutil.copy(os.path.join(MODS, arq), os.path.join(R, f"docs/licencas/{fonte}.txt"))
with open(os.path.join(R, "docs/licencas/usados.json"), "w") as f:
    json.dump(usados, f, ensure_ascii=False, indent=1, sort_keys=True)
for fonte, l in sorted(usados.items()):
    print(f"{fonte}: {len(l)}")
print(f"total: {sum(len(l) for l in usados.values())}")
for x in faltou:
    print("faltou:", x)

#!/usr/bin/env python3
"""Tinkers' Construct 3.12.1 (MIT, inclusive a arte), parte 5 do Tinkers completo (1.30.0): a arte dos livros, cajados,
ferramentas antigas (pintadas com a paleta do material Ancestral), geringonças, moldes de ouro e de areia, e dos blocos
de mesa (Construtor de Peças, Estação de Ferramentas, Mesa de Moldes, Bigorna, Estação de Criação, Mesa de
Modificadores, baús). python3 tools/importar-tinkers3-extras.py <pasta do Tinkers clonado>
"""
import json
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1])
T = SRC / "src/main/resources/assets/tconstruct/textures"
REND = SRC / "src/generated/resources/assets/tconstruct/tinkering/materials"
ITENS = RAIZ / "RP/textures/items/cl/arte"
BLOCOS = RAIZ / "RP/textures/blocks/cl/arte"
usados = []


def abrir(rel):
    p = T / (rel + ".png")
    if not p.exists():
        return None
    im = Image.open(p).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def paleta(tc):
    r = json.loads((REND / f"{tc}.json").read_text())
    pal = r.get("generator", {}).get("transformer", {}).get("color_mapping", {}).get("palette", {})
    return sorted((int(k), tuple(int(v[-6:][i:i + 2], 16) for i in (0, 2, 4))) for k, v in pal.items())


def pintar(im, pal):
    if im is None or not pal:
        return im
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


def camadas(lista):
    base = None
    for im in lista:
        if im is None:
            continue
        base = im if base is None else Image.alpha_composite(base, im.resize(base.size, Image.NEAREST))
    return base


def item(nome, im):
    if im is None:
        print("falta", nome)
        return
    im.resize((16, 16), Image.NEAREST).save(ITENS / f"{nome}.png")
    usados.append(nome)


def bloco(nome, rel):
    im = abrir(rel)
    if im is None:
        print("falta", rel)
        return
    im.save(BLOCOS / f"{nome}.png")
    usados.append(nome)


for nome, rel in (("livro_materiais", "materials_and_you"), ("livro_fundicao_pequena", "puny_smelting"), ("livro_fundicao_poderosa", "mighty_smelting"),
                  ("livro_geringoncas", "tinkers_gadgetry"), ("livro_fundicao_fantastica", "fantastic_foundry"), ("livro_enciclopedia", "encyclopedia")):
    item(nome, abrir(f"item/{rel}"))
for nome, rel in (("cajado_ceu", "sky"), ("cajado_terra", "earth"), ("cajado_icor", "ichor"), ("cajado_ender", "ender")):
    item(nome, abrir(f"item/tool/staff/{rel}"))
ANC, MAD = paleta("ancient"), paleta("wood")
cabo = lambda rel: pintar(abrir(rel + "_stick") or abrir(rel), MAD)
item("picareta_guerra", camadas([pintar(abrir("item/tool/war_pick/body"), MAD), abrir("item/tool/war_pick/bowstring"), pintar(abrir("item/tool/war_pick/limb"), ANC)]))
item("placa_batalha", camadas([cabo("item/tool/battlesign/handle"), pintar(abrir("item/tool/battlesign/head"), ANC)]))
item("lavador", camadas([cabo("item/tool/swasher/handle"), pintar(abrir("item/tool/swasher/blade"), ANC), pintar(abrir("item/tool/swasher/barrel"), paleta("iron")), abrir("item/tool/swasher/tank")]))
item("machado_minotauro", camadas([cabo("item/tool/pickaxe/handle"), pintar(abrir("item/tool/minotaur_axe/back"), ANC), pintar(abrir("item/tool/minotaur_axe/front"), ANC)]))
item("panela_fusao", camadas([cabo("item/tool/melting_pan/handle"), pintar(abrir("item/tool/melting_pan/head"), ANC)]))
item("efln", abrir("item/gadgets/efln"))
item("bola_brilhante", abrir("item/gadgets/glowball"))
item("mochila_porco", abrir("item/gadgets/piggy_backpack"))
# 1.33.0 (ícones mais bonitos): Pano Sedoso, Argamassa do Nether e Malha com a arte do TC3.
item("pano_sedoso", abrir("item/materials/silky_cloth"))
item("argamassa_nether", abrir("block/nether_grout"))
_m = SRC / "src/generated/resources/assets/tconstruct/textures/item/tool/parts/maille_tconstruct_iron.png"
item("malha", Image.open(_m).convert("RGBA") if _m.exists() else None)
# Moldes de ouro e de areia com a arte do TC3.
PECA_TC = {"cabo": "tool_handle", "ligacao": "tool_binding", "cabeca_picareta": "pick_head", "cabeca_machado": "small_axe_head", "lamina_espada": "small_blade",
           "cabeca_enxo": "adze_head", "cabeca_martelo": "hammer_head", "lamina_larga": "broad_blade", "cabeca_machado_larga": "broad_axe_head",
           "placa_grande": "large_plate", "cabo_resistente": "tough_handle", "ligacao_resistente": "tough_binding", "lingote": "ingot", "pepita": "nugget"}
for p, tc in PECA_TC.items():
    item(f"molde_{p}", abrir(f"item/cast/{tc}"))
    if p != "pepita":
        item(f"molde_areia_{p}", abrir(f"item/sand_cast/{tc}"))
# Blocos de mesa (frente, lado, topo, baixo) e baús.
MESAS = {
    "construtor_pecas": ("table/side", "table/side", "table/part_builder_top", "table/bottom"),
    "estacao_ferramentas": ("table/side", "table/side", "table/tinker_station_top", "table/bottom"),
    "mesa_moldes": ("table/side", "table/side", "table/stencil_table_top", "table/bottom"),
    "estacao_criacao": ("table/crafting_station_side", "table/crafting_station_side", "table/crafting_station_top", "table/bottom"),
    "mesa_modificadores": ("table/modifier_workstation_side", "table/modifier_workstation_side", "table/modifier_workstation_top", "table/bottom"),
    "bigorna": ("table/anvil_base", "table/anvil_base", "table/anvil_base_upper", "table/anvil_base"),
    "bigorna_chamuscada": ("table/scorched_anvil_base", "table/scorched_anvil_base", "table/scorched_anvil_base_upper", "table/scorched_anvil_base"),
    "bau_pecas": ("chest/part/front", "chest/part/side", "chest/part/top", "chest/part/side"),
    "bau_moldes": ("chest/cast/front", "chest/cast/side", "chest/part/top", "chest/cast/side"),
    "bau_tinker": ("chest/tinkers/front", "chest/tinkers/side", "chest/tinkers/top", "chest/tinkers/side"),
}
for nome, faces in MESAS.items():
    for face, rel in zip(("frente", "lado", "topo", "baixo"), faces):
        bloco(f"{nome}_{face}", f"block/{rel}")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos["tinkers3_extras"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"extras do tinkers 3: {len(usados)} texturas")

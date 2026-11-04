#!/usr/bin/env python3
"""Tinkers' Construct 3.12.1 (MIT, inclusive a arte), parte 4 do Tinkers completo (1.29.0): a arte dos blocos da
Fundição (refratários e chamuscados, Fusor, Aquecedor, Ligador, Fundição Fantástica, calhas, drenos, tanques, mesas,
bacias, canal) e a dos blocos de antes (tijolos, controlador, tanque, dreno, vidro, torneira, mesa, bacia) trocada pela do
TC3. python3 tools/importar-tinkers3-fundicao.py <pasta do Tinkers clonado>
"""
import json
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
T = Path(sys.argv[1]) / "src/main/resources/assets/tconstruct/textures/block"
B = RAIZ / "RP/textures/blocks/cl/arte"
usados = []


def copiar(rel, nome):
    p = T / (rel + ".png")
    if not p.exists():
        print("falta", rel)
        return
    im = Image.open(p).convert("RGBA")
    if im.height > im.width:
        im = im.crop((0, 0, im.width, im.width))
    im.save(B / f"{nome}.png")
    usados.append(nome)


S, F = "smeltery", "foundry"
UMA = {
    "tijolos_refratarios": f"{S}/seared/bricks", "pedra_refrataria_bloco": f"{S}/seared/stone", "pedregulho_refratario": f"{S}/seared/cobble",
    "pavimento_refratario": f"{S}/seared/paver", "tijolos_refratarios_rachados": f"{S}/seared/cracked_bricks", "tijolos_refratarios_finos": f"{S}/seared/fancy_bricks",
    "tijolos_refratarios_triangulo": f"{S}/seared/triangle_bricks", "tijolos_refratarios_pequenos": f"{S}/seared/small_bricks",
    "tijolos_refratarios_creeper": f"{S}/seared/creeper", "ladrilho_refratario": f"{S}/seared/tile", "estrada_refrataria": f"{S}/seared/road",
    "lanterna_refrataria": f"{S}/seared/lamp", "vidro_refratario": f"{S}/seared_glass", "vidro_alma_refratario": f"{S}/soul_glass",
    "vidro_fume_refratario": f"{S}/tinted_glass", "tijolos_chamuscados": f"{F}/scorched/bricks", "pedra_chamuscada_bloco": f"{F}/scorched/stone_side",
    "pedra_chamuscada_bloco_topo": f"{F}/scorched/stone_top", "estrada_chamuscada": f"{F}/scorched/road", "pedra_chamuscada_polida": f"{F}/scorched/polished_side",
    "pedra_chamuscada_polida_topo": f"{F}/scorched/polished_top", "pedra_chamuscada_entalhada": f"{F}/scorched/chiseled", "lanterna_chamuscada": f"{F}/scorched/lamp",
    "vidro_chamuscado": f"{F}/glass", "dreno_chamuscado": f"{F}/io/drain_front_inactive", "calha_refrataria": f"{S}/io/chute_side_inactive",
    "calha_chamuscada": f"{F}/io/chute_side_inactive", "tanque_chamuscado": f"{F}/tank/fuel_tank", "canal": f"{S}/seared/bricks",
    "mesa_fundicao_chamuscada": f"{F}/casting/table_side", "mesa_fundicao_chamuscada_topo": f"{F}/casting/table_plate",
    "bacia_fundicao_chamuscada": f"{F}/casting/basin_side", "bacia_fundicao_chamuscada_topo": f"{F}/casting/basin_top",
}
for nome, rel in UMA.items():
    copiar(rel, nome)
# Máquinas (frente, lado, topo, baixo).
QUATRO = {
    "aquecedor": (f"{S}/controller/heater_inactive", f"{S}/controller/heater_inactive", f"{S}/seared/stone", f"{S}/seared/stone"),
    "fusor": (f"{S}/controller/melter_inactive", f"{S}/controller/melter_side", f"{S}/tank/tank_top", f"{S}/seared/stone"),
    "ligador": (f"{F}/controller/alloyer_inactive", f"{F}/controller/alloyer_side", f"{F}/tank/tank_top", f"{F}/scorched/stone_top"),
    "controlador_fundicao_fantastica": (f"{F}/controller/foundry_inactive", f"{F}/scorched/bricks", f"{F}/scorched/bricks", f"{F}/scorched/bricks"),
    "controlador_fundicao": (f"{S}/controller/smeltery_inactive", f"{S}/seared/bricks", f"{S}/seared/bricks", f"{S}/seared/bricks"),
    "dreno_fundicao": (f"{S}/io/drain_front_inactive", f"{S}/seared/bricks", f"{S}/seared/bricks", f"{S}/seared/bricks"),
}
for nome, (fr, la, to, ba) in QUATRO.items():
    for face, rel in (("frente", fr), ("lado", la), ("topo", to), ("baixo", ba)):
        copiar(rel, f"{nome}_{face}")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos["tinkers3_fundicao"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"fundição do tinkers 3: {len(usados)} texturas")

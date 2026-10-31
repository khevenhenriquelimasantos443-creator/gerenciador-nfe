#!/usr/bin/env python3
"""Aeronaves do Immersive Aircraft (1.13.0) e as pás do Moinho de Vento e da Roda d'Água (Immersive Engineering).

Os aviões usam os modelos e as texturas ORIGINAIS do Immersive Aircraft (Luke100000, GPLv3): os .bbmodel do Blockbench
(malhas e cubos) viram poly_mesh do Bedrock. O IE não deixa usar a arte, então o moinho e a roda têm modelo próprio.
Roda à mão quando mudar algo (os arquivos gerados vão no repositório):
  python3 tools/gerar-aeronaves.py <pasta do repositório do Immersive Aircraft>
"""
import json
import math
import shutil
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
IA = Path(sys.argv[1]) if len(sys.argv) > 1 else None
ASSETS = IA / "common/src/main/resources/assets/immersive_aircraft" if IA else None


def escrever(rel, obj):
    p = RAIZ / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


# id do pack, arquivo do IA, partes que giram (grupo -> eixo), grupos que ficam de fora, tamanho da caixa, assentos
AERONAVES = {
    "biplano": ("biplane", {"propeller": "z"}, {"banners"}, (2.5, 1.2), [(0, 0.375, -0.6)]),
    "dirigivel": ("airship", {"propeller": "z"}, {"banners", "lod1"}, (2.2, 2.5), [(0, 0.2, 0.4), (0, 0.2, -0.3)]),
    "girocoptero": ("gyrodyne", {"propeller": "y"}, set(), (2.0, 1.6), [(0, 0.15, 0.3), (0, 0.2, -0.6)]),
    "quadricoptero": ("quadrocopter", {"propellor_0": "y", "propellor_1": "y", "propellor_2": "y", "propellor_3": "y"}, set(), (1.6, 0.9), [(0, 0.475, -0.1)]),
}


def girar(v, rot, centro):
    """Rotação do Blockbench (graus, ordem ZYX: X primeiro) em volta de `centro`."""
    x, y, z = (v[i] - centro[i] for i in range(3))
    rx, ry, rz = (math.radians(a or 0) for a in (rot or [0, 0, 0]))
    y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
    x, z = x * math.cos(ry) + z * math.sin(ry), -x * math.sin(ry) + z * math.cos(ry)
    x, y = x * math.cos(rz) - y * math.sin(rz), x * math.sin(rz) + y * math.cos(rz)
    return [x + centro[0], y + centro[1], z + centro[2]]


# O avião do IA olha para +Z; o modelo do Bedrock olha para -Z (e a exportação espelha o X): fica (x, y, -z).
def bedrock(p):
    return [round(p[0], 4), round(p[1], 4), round(-p[2], 4)]


def sub(a, b):
    return [a[i] - b[i] for i in range(3)]


def cruz(a, b):
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]


def unit(v):
    n = math.sqrt(sum(c * c for c in v)) or 1
    return [c / n for c in v]


def ordenar_quad(pts):
    """O Blockbench guarda os 4 vértices de uma face fora de ordem: escolhe a volta de menor perímetro."""
    import itertools
    melhor = None
    for perm in ([0, 1, 2, 3], [0, 1, 3, 2], [0, 2, 1, 3]):
        per = sum(math.dist(pts[perm[i]][0], pts[perm[(i + 1) % 4]][0]) for i in range(4))
        if melhor is None or per < melhor[0]:
            melhor = (per, perm)
    return [pts[i] for i in melhor[1]]


# Cantos de cada face de um cubo (TL, TR, BR, BL) como o Blockbench mapeia a UV [u1, v1, u2, v2].
def cantos(f, a, b):
    x1, y1, z1 = a
    x2, y2, z2 = b
    return {
        "north": [(x2, y2, z1), (x1, y2, z1), (x1, y1, z1), (x2, y1, z1)],
        "south": [(x1, y2, z2), (x2, y2, z2), (x2, y1, z2), (x1, y1, z2)],
        "east": [(x2, y2, z2), (x2, y2, z1), (x2, y1, z1), (x2, y1, z2)],
        "west": [(x1, y2, z1), (x1, y2, z2), (x1, y1, z2), (x1, y1, z1)],
        "up": [(x1, y2, z1), (x2, y2, z1), (x2, y2, z2), (x1, y2, z2)],
        "down": [(x1, y1, z2), (x2, y1, z2), (x2, y1, z1), (x1, y1, z1)],
    }[f]


def faces_do_elemento(e, texs):
    """Lista de faces [(pontos em pixels do Blockbench, uvs normalizadas 0..1 com v para baixo, textura)]."""
    out = []
    if e.get("type", "cube") == "mesh":
        o = e["origin"]
        for f in e["faces"].values():
            if f.get("texture") is None:
                continue
            t = texs[f["texture"]]
            pts = []
            for k in f["vertices"]:
                v = e["vertices"][k]
                p = girar([v[0] + o[0], v[1] + o[1], v[2] + o[2]], e.get("rotation"), o)
                uv = f["uv"][k]
                pts.append((p, (uv[0] / t["uv_width"], uv[1] / t["uv_height"])))
            if len(pts) == 4:
                pts = ordenar_quad(pts)
            if len(pts) in (3, 4):
                out.append((pts, f["texture"]))
    else:
        inf = e.get("inflate", 0)
        a = [e["from"][i] - inf for i in range(3)]
        b = [e["to"][i] + inf for i in range(3)]
        o = e.get("origin", [0, 0, 0])
        for nome, f in e["faces"].items():
            if f.get("texture") is None or not f.get("uv"):
                continue
            t = texs[f["texture"]]
            u1, v1, u2, v2 = f["uv"]
            uvs = [(u1, v1), (u2, v1), (u2, v2), (u1, v2)]
            r = (f.get("rotation") or 0) // 90
            uvs = uvs[-r:] + uvs[:-r] if r else uvs
            pts = [(girar(list(c), e.get("rotation"), o), (uv[0] / t["uv_width"], uv[1] / t["uv_height"])) for c, uv in zip(cantos(nome, a, b), uvs)]
            out.append((pts, f["texture"]))
    return out


def converter(id_, arq, giram, fora):
    d = json.loads((ASSETS / f"objects/{arq}.bbmodel").read_text())
    texs = d["textures"]
    els = {e["uuid"]: e for e in d["elements"]}
    # Textura: a primeira; a segunda (casco colorido do dirigível) vai embaixo dela, já tingida com a cor padrão.
    base = Image.open(ASSETS / f"textures/entity/{arq}.png").convert("RGBA")
    W, H = base.size
    desloc = {0: (0, 1)}
    if len(texs) > 1:
        cor = Image.open(ASSETS / f"textures/entity/{arq}_color.png").convert("RGBA")
        tint = (0xEC, 0xC8, 0x8C)  # default_item_colors.json: 15517836
        px = cor.load()
        for yy in range(cor.size[1]):
            for xx in range(cor.size[0]):
                r, g, b, a = px[xx, yy]
                px[xx, yy] = (r * tint[0] // 255, g * tint[1] // 255, b * tint[2] // 255, a)
        junta = Image.new("RGBA", (W, H + cor.size[1]))
        junta.paste(base, (0, 0))
        junta.paste(cor, (0, H))
        desloc = {0: (0, H / (H + cor.size[1])), 1: (H / (H + cor.size[1]), cor.size[1] / (H + cor.size[1]))}
        H += cor.size[1]
        base = junta
    destino = RAIZ / f"RP/textures/entity/cl/aeronave/{id_}.png"
    destino.parent.mkdir(parents=True, exist_ok=True)
    base.save(destino)

    ossos = {"corpo": {"pivot": [0, 0, 0], "faces": []}}
    eixos = {}

    def walk(n, osso):
        if isinstance(n, str):
            ossos[osso]["faces"] += faces_do_elemento(els[n], texs)
            return
        if n["name"] in fora:
            return
        if n["name"] in giram:
            osso = n["name"]
            ossos[osso] = {"pivot": bedrock(n["origin"]), "faces": [], "parent": "corpo"}
            eixos[osso] = giram[n["name"]]
        for c in n["children"]:
            walk(c, osso)

    for n in d["outliner"]:
        walk(n, "corpo")

    bones = []
    for nome, o in ossos.items():
        pos, nor, uvs, polys = [], [], [], []
        for pts, ti in o["faces"]:
            p3 = [p for p, _ in pts]
            nrm = unit(cruz(sub(p3[1], p3[0]), sub(p3[2], p3[0])))
            nb = [round(nrm[0], 4), round(nrm[1], 4), round(-nrm[2], 4)]
            ini, alt = desloc[ti]
            poly = []
            for p, (u, v) in reversed(pts):  # o espelho em Z inverte o sentido da volta
                pos.append(bedrock(p))
                uvs.append([round(u, 5), round(1 - (ini + v * alt), 5)])
                nor.append(nb)
                k = len(pos) - 1
                poly.append([k, k, k])
            if len(poly) == 3:
                poly.append(poly[-1])
            polys.append(poly)
        if not polys:
            continue
        bone = {"name": nome, "pivot": o["pivot"], "poly_mesh": {"normalized_uvs": True, "positions": pos, "normals": nor, "uvs": uvs, "polys": polys}}
        if o.get("parent"):
            bone["parent"] = o["parent"]
        bones.append(bone)
    todos = [p for b in bones for p in b["poly_mesh"]["positions"]]
    largura = max(max(abs(p[0]), abs(p[2])) for p in todos) / 16 * 2 + 1
    altura = max(p[1] for p in todos) / 16 + 1
    escrever(f"RP/models/entity/cl_{id_}.geo.json", {
        "format_version": "1.12.0",
        "minecraft:geometry": [{
            "description": {"identifier": f"geometry.cl.{id_}", "texture_width": W, "texture_height": H,
                            "visible_bounds_width": round(largura, 1), "visible_bounds_height": round(altura, 1), "visible_bounds_offset": [0, round(altura / 2, 1), 0]},
            "bones": bones,
        }],
    })
    return eixos


ROT = {"x": ["variable.giro", 0, 0], "y": [0, "variable.giro", 0], "z": [0, 0, "variable.giro"]}


def animacoes(id_, eixos, corpo=True):
    anims = {}
    if corpo:
        # Inclinação (arfagem) e rolagem vêm do script em propriedades da entidade.
        anims[f"animation.cl.{id_}.inclinar"] = {"loop": True, "bones": {"corpo": {"rotation": ["q.property('cl:arfagem')", 0, "q.property('cl:rolagem')"]}}}
    if eixos:
        anims[f"animation.cl.{id_}.girar"] = {"loop": True, "bones": {o: {"rotation": ROT[e]} for o, e in eixos.items()}}
    escrever(f"RP/animations/cl_{id_}.animation.json", {"format_version": "1.8.0", "animations": anims})


def cliente(id_, eixos, textura, corpo=True, extra_scripts=None, controle="controller.render.default"):
    scripts = {"pre_animation": ["variable.giro = math.mod((variable.giro ?? 0) + q.delta_time * q.property('cl:giro'), 360);"]}
    anims, animate = {}, []
    if corpo:
        anims["inclinar"] = f"animation.cl.{id_}.inclinar"
        animate.append("inclinar")
    if eixos:
        anims["girar"] = f"animation.cl.{id_}.girar"
        animate.append("girar")
    scripts["animate"] = animate
    escrever(f"RP/entity/{id_}.entity.json", {
        "format_version": "1.10.0",
        "minecraft:client_entity": {"description": {
            "identifier": f"cl:{id_}", "materials": {"default": "entity_alphatest"}, "textures": {"default": textura},
            "geometry": {"default": f"geometry.cl.{id_}"}, "animations": anims, "scripts": scripts, "render_controllers": [controle],
        }},
    })


PROPS = {
    "cl:arfagem": {"type": "float", "range": [-90.0, 90.0], "default": 0.0, "client_sync": True},
    "cl:rolagem": {"type": "float", "range": [-90.0, 90.0], "default": 0.0, "client_sync": True},
    "cl:giro": {"type": "float", "range": [0.0, 2000.0], "default": 0.0, "client_sync": True},
}


def servidor_aeronave(id_, caixa, assentos):
    escrever(f"BP/entities/{id_}.json", {
        "format_version": "1.21.50",
        "minecraft:entity": {
            "description": {"identifier": f"cl:{id_}", "is_spawnable": False, "is_summonable": True, "properties": PROPS},
            "components": {
                "minecraft:type_family": {"family": ["aeronave", "inanimate"]},
                "minecraft:health": {"value": 20, "max": 20},
                "minecraft:damage_sensor": {"triggers": [{"cause": "all", "deals_damage": "no"}]},
                "minecraft:collision_box": {"width": caixa[0], "height": caixa[1]},
                "minecraft:physics": {"has_gravity": False, "has_collision": True},
                "minecraft:pushable": {"is_pushable": False, "is_pushable_by_piston": False},
                "minecraft:knockback_resistance": {"value": 1},
                "minecraft:fire_immune": {},
                "minecraft:persistent": {},
                "minecraft:loot": {"table": "loot_tables/empty.json"},
                "minecraft:rideable": {
                    "seat_count": len(assentos), "family_types": ["player"], "interact_text": "action.interact.ride.boat", "pull_in_entities": False,
                    "seats": [{"position": list(p), "lock_rider_rotation": 0} for p in assentos],
                },
                "minecraft:is_stackable": {},
            },
        },
    })


# ---------- Moinho de Vento e Roda d'Água (arte própria; o IE não deixa usar a dele) ----------
LADOS = ["north", "south", "east", "west", "up", "down"]


def cubo(origin, size, tile, rot=None, pivot=None):
    c = {"origin": origin, "size": size, "uv": {f: {"uv": [tile * 8, 0], "uv_size": [8, 8]} for f in LADOS}}
    if rot:
        c["rotation"] = rot
        c["pivot"] = pivot or [0, 0, 0]
    return c


def pas():
    # Textura 32x8: madeira tratada, madeira escura, lona e ferro.
    img = Image.new("RGBA", (32, 8))
    cores = [(122, 82, 46), (84, 55, 30), (226, 214, 184), (150, 152, 156)]
    for x in range(32):
        for y in range(8):
            r, g, b = cores[x // 8]
            k = 1 + (((x * 7 + y * 13) % 5) - 2) * 0.03 - (0.08 if (x // 8 < 2 and y % 4 == 0) else 0)
            img.putpixel((x, y), (max(0, min(255, int(r * k))), max(0, min(255, int(g * k))), max(0, min(255, int(b * k))), 255))
    (RAIZ / "RP/textures/entity/cl/moinho").mkdir(parents=True, exist_ok=True)
    img.save(RAIZ / "RP/textures/entity/cl/moinho/pas.png")
    # Pás do Moinho: 8 pás de 4 blocos (raio do disco livre do IE), cada uma com sua vela (aparece com as velas postas).
    bones = [{"name": "rotor", "pivot": [0, 0, 0], "cubes": [cubo([-3, -3, -2], [6, 6, 4], 3), cubo([-1, -1, 2], [2, 2, 8], 3)]}]
    for k in range(8):
        a = k * 45
        bones.append({"name": f"pa_{k}", "parent": "rotor", "pivot": [0, 0, 0], "rotation": [0, 0, a], "cubes": [cubo([-1, 3, -1], [2, 62, 2], 0), cubo([-6, 24, -0.5], [12, 40, 1], 1)]})
        bones.append({"name": f"vela_{k}", "parent": f"pa_{k}", "pivot": [0, 0, 0], "cubes": [cubo([-7, 22, -1.5], [14, 44, 1], 2)]})
    escrever("RP/models/entity/cl_pas_moinho.geo.json", {"format_version": "1.12.0", "minecraft:geometry": [{
        "description": {"identifier": "geometry.cl.pas_moinho", "texture_width": 32, "texture_height": 8, "visible_bounds_width": 10, "visible_bounds_height": 10, "visible_bounds_offset": [0, 0, 0]},
        "bones": bones}]})
    # Roda d'Água: raio de 3 blocos, 8 raios, aro de 16 pedaços e 16 pás.
    rb = [{"name": "rotor", "pivot": [0, 0, 0], "cubes": [cubo([-4, -4, -6], [8, 8, 12], 3)]}]
    for k in range(8):
        rb.append({"name": f"raio_{k}", "parent": "rotor", "pivot": [0, 0, 0], "rotation": [0, 0, k * 45], "cubes": [cubo([-1.5, 4, -5], [3, 40, 2], 1), cubo([-1.5, 4, 3], [3, 40, 2], 1)]})
    for k in range(16):
        rb.append({"name": f"aro_{k}", "parent": "rotor", "pivot": [0, 0, 0], "rotation": [0, 0, k * 22.5], "cubes": [
            cubo([-9.5, 42, -5], [19, 3, 2], 0), cubo([-9.5, 42, 3], [19, 3, 2], 0), cubo([-1, 42, -5], [2, 6, 10], 1)]})
    escrever("RP/models/entity/cl_roda_agua_giro.geo.json", {"format_version": "1.12.0", "minecraft:geometry": [{
        "description": {"identifier": "geometry.cl.roda_agua_giro", "texture_width": 32, "texture_height": 8, "visible_bounds_width": 8, "visible_bounds_height": 8, "visible_bounds_offset": [0, 0, 0]},
        "bones": rb}]})
    escrever("RP/render_controllers/cl_pas_moinho.render_controllers.json", {"format_version": "1.8.0", "render_controllers": {"controller.render.cl.pas_moinho": {
        "geometry": "Geometry.default", "materials": [{"*": "Material.default"}], "textures": ["Texture.default"],
        "part_visibility": [{"*": True}] + [{f"vela_{k}": f"q.property('cl:velas') > {k}"} for k in range(8)],
    }}})
    for id_ in ("pas_moinho", "roda_agua_giro"):
        escrever(f"RP/animations/cl_{id_}.animation.json", {"format_version": "1.8.0", "animations": {
            f"animation.cl.{id_}.girar": {"loop": True, "bones": {"rotor": {"rotation": [0, 0, "variable.giro"]}}}}})
        cliente_rotor(id_)
        props = {"cl:giro": PROPS["cl:giro"]}
        if id_ == "pas_moinho":
            props["cl:velas"] = {"type": "int", "range": [0, 8], "default": 0, "client_sync": True}
        escrever(f"BP/entities/{id_}.json", {"format_version": "1.21.50", "minecraft:entity": {
            "description": {"identifier": f"cl:{id_}", "is_spawnable": False, "is_summonable": True, "properties": props},
            "components": {
                "minecraft:type_family": {"family": ["rotor", "inanimate"]},
                "minecraft:health": {"value": 1, "max": 1},
                "minecraft:damage_sensor": {"triggers": [{"cause": "all", "deals_damage": "no"}]},
                "minecraft:collision_box": {"width": 0.1, "height": 0.1},
                "minecraft:physics": {"has_gravity": False, "has_collision": False},
                "minecraft:pushable": {"is_pushable": False, "is_pushable_by_piston": False},
                "minecraft:knockback_resistance": {"value": 1},
                "minecraft:fire_immune": {},
                "minecraft:persistent": {},
                "minecraft:loot": {"table": "loot_tables/empty.json"},
            }}})


def cliente_rotor(id_):
    escrever(f"RP/entity/{id_}.entity.json", {"format_version": "1.10.0", "minecraft:client_entity": {"description": {
        "identifier": f"cl:{id_}", "materials": {"default": "entity_alphatest"}, "textures": {"default": "textures/entity/cl/moinho/pas"},
        "geometry": {"default": f"geometry.cl.{id_}"}, "animations": {"girar": f"animation.cl.{id_}.girar"},
        "scripts": {"pre_animation": ["variable.giro = math.mod((variable.giro ?? 0) + q.delta_time * q.property('cl:giro'), 360);"], "animate": ["girar"]},
        "render_controllers": ["controller.render.cl.pas_moinho" if id_ == "pas_moinho" else "controller.render.default"],
    }}})


if __name__ == "__main__":
    pas()
    if ASSETS:
        for id_, (arq, giram, fora, caixa, assentos) in AERONAVES.items():
            eixos = converter(id_, arq, giram, fora)
            animacoes(id_, eixos)
            cliente(id_, eixos, f"textures/entity/cl/aeronave/{id_}")
            servidor_aeronave(id_, caixa, assentos)
            print(id_, "ossos que giram:", eixos)
        shutil.copy(IA / "LICENSE", RAIZ / "docs/licencas/aircraft.txt")
    else:
        print("Sem a pasta do Immersive Aircraft: só as pás do moinho e da roda.")

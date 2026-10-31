#!/usr/bin/env python3
"""Templo do Deserto do YUNG's Better Desert Temples (YUNGNICKYOUNG, LGPLv3), montado fora do jogo (1.14.0).

O mod monta o templo no Java com peças de jigsaw (data/betterdeserttemples: template_pool e structure/*.nbt) e
"processadores" que trocam blocos-marcador (vidros coloridos, lã, concreto) por arenito, teias, geradores de monstro e
TNT. O Bedrock não tem esse montador, então este script faz o mesmo que o JigsawPlacement do jogo (peças sorteadas pelo
peso, encaixe pelos blocos de jigsaw, sem sobrepor, até a profundidade 20 e 116 blocos do centro), aplica os
processadores do mod e converte os blocos do Java para o Bedrock. Sai em pedaços de 64×64 (o limite de uma estrutura)
em BP/structures/cl/templo_yung_<variante>_<i>_<j>.mcstructure, mais scripts/mundo/templo_yung_dados.ts com os baús,
os geradores e o lugar do Faraó.
  python3 tools/gerar-templo-yung.py <pasta do YUNGs-Better-Desert-Temples>
"""
import json
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import nbt_java as N  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
DADOS = Path(sys.argv[1]) / "Common/src/main/resources/data/betterdeserttemples"
VARIANTES = 3
TILE = 64
PROFUNDIDADE = 20
DIST_MAX = 116

# ---------- Direções e rotação (Rotation.CLOCKWISE_90 do Java: (x, z) -> (-z, x)) ----------
DIR = {"north": (0, 0, -1), "south": (0, 0, 1), "west": (-1, 0, 0), "east": (1, 0, 0), "up": (0, 1, 0), "down": (0, -1, 0)}
HORAR = {"north": "east", "east": "south", "south": "west", "west": "north", "up": "up", "down": "down"}
OPOSTO = {"north": "south", "south": "north", "east": "west", "west": "east", "up": "down", "down": "up"}


def girar_dir(d, r):
    for _ in range(r):
        d = HORAR[d]
    return d


def girar_pos(p, r):
    x, y, z = p
    for _ in range(r):
        x, z = -z, x
    return (x, y, z)


def girar_estado(nome, props, r):
    if not r or not props:
        return props
    p = dict(props)
    for _ in range(r):
        q = dict(p)
        if p.get("facing") in HORAR and p["facing"] not in ("up", "down"):
            q["facing"] = HORAR[p["facing"]]
        if "rotation" in p:
            q["rotation"] = str((int(p["rotation"]) + 4) % 16)
        if "axis" in p and p["axis"] in ("x", "z"):
            q["axis"] = "z" if p["axis"] == "x" else "x"
        lados = ["north", "east", "south", "west"]
        if all(k in p for k in lados):
            for i, k in enumerate(lados):
                q[lados[(i + 1) % 4]] = p[k]
        if "orientation" in p:
            a, b = p["orientation"].split("_")
            q["orientation"] = f"{HORAR[a]}_{HORAR[b]}"
        p = q
    return p


# ---------- Peças ----------
_pecas = {}


def peca(loc):
    if loc not in _pecas:
        ns, caminho = loc.split(":")
        d = N.ler(DADOS / f"structure/{caminho}.nbt")
        pal = d.get("palette") or d["palettes"][0]
        blocos, jigs = [], []
        for b in d["blocks"]:
            st = pal[b["state"]]
            pos = tuple(b["pos"])
            if st["Name"] == "minecraft:jigsaw":
                n = b["nbt"]
                frente, topo = st["Properties"]["orientation"].split("_")
                jigs.append({"pos": pos, "frente": frente, "topo": topo, "nome": n["name"], "alvo": n["target"], "pool": n["pool"],
                             "final": n["final_state"], "junta": n.get("joint", "rollable"), "prio": n.get("selection_priority", 0)})
            else:
                blocos.append((pos, st["Name"], st.get("Properties") or {}, b.get("nbt")))
        ents = [(e["blockPos"], e["nbt"].get("id")) for e in d.get("entities", [])]
        _pecas[loc] = {"tam": tuple(d["size"]), "blocos": blocos, "jigs": jigs, "ents": ents}
    return _pecas[loc]


_pools = {}


def pool(nome):
    if nome not in _pools:
        if nome in ("minecraft:empty", ""):
            _pools[nome] = {"el": [], "fallback": None}
        else:
            ns, c = nome.split(":")
            d = json.loads((DADOS / f"worldgen/template_pool/{c}.json").read_text())
            el = []
            for e in d["elements"]:
                x = e["element"]
                if x.get("element_type", "").endswith("empty_pool_element"):
                    el.append((e.get("weight", 1), None))
                else:
                    el.append((e.get("weight", 1), {"loc": x["location"], "max": x.get("max_count"), "nome": x.get("name")}))
            _pools[nome] = {"el": el, "fallback": d.get("fallback")}
    return _pools[nome]


def caixa(loc, r, desl):
    sx, sy, sz = peca(loc)["tam"]
    cantos = [girar_pos((x, 0, z), r) for x in (0, sx - 1) for z in (0, sz - 1)]
    x0 = min(c[0] for c in cantos) + desl[0]
    z0 = min(c[2] for c in cantos) + desl[2]
    return (x0, desl[1], z0, x0 + max(c[0] for c in cantos) - min(c[0] for c in cantos), desl[1] + sy - 1, z0 + max(c[2] for c in cantos) - min(c[2] for c in cantos))


def cruza(a, b):
    return not (a[3] < b[0] or b[3] < a[0] or a[4] < b[1] or b[4] < a[1] or a[5] < b[2] or b[5] < a[2])


def dentro(a, b):
    return a[0] >= b[0] and a[1] >= b[1] and a[2] >= b[2] and a[3] <= b[3] and a[4] <= b[4] and a[5] <= b[5]


def montar(semente):
    rnd = random.Random(semente)
    colocadas = []  # {loc, r, desl, caixa, pai}
    contagem = {}
    inicio = "betterdeserttemples:starts/center"
    r0 = rnd.randrange(4)
    ancora = next(j for j in peca(inicio)["jigs"] if j["nome"] == "betterdeserttemples:temple_anchor")
    a = girar_pos(ancora["pos"], r0)
    desl = (-a[0], -a[1], -a[2])
    fila = [(inicio, r0, desl, 0, None)]
    colocadas.append({"loc": inicio, "r": r0, "desl": desl, "caixa": caixa(inicio, r0, desl), "pai": None})
    while fila:
        loc, r, desl, prof, _ = fila.pop(0)
        eu = next(c for c in colocadas if c["loc"] == loc and c["desl"] == desl and c["r"] == r)
        jigs = list(peca(loc)["jigs"])
        rnd.shuffle(jigs)
        jigs.sort(key=lambda j: -j["prio"])
        for j in jigs:
            frente = girar_dir(j["frente"], r)
            topo = girar_dir(j["topo"], r)
            pj = girar_pos(j["pos"], r)
            pj = (pj[0] + desl[0], pj[1] + desl[1], pj[2] + desl[2])
            dv = DIR[frente]
            alvo_pos = (pj[0] + dv[0], pj[1] + dv[1], pj[2] + dv[2])
            interno = eu["caixa"][0] <= alvo_pos[0] <= eu["caixa"][3] and eu["caixa"][1] <= alvo_pos[1] <= eu["caixa"][4] and eu["caixa"][2] <= alvo_pos[2] <= eu["caixa"][5]
            pl = pool(j["pool"])
            cands = []
            if prof < PROFUNDIDADE:
                lista = [(w, e) for w, e in pl["el"]]
                bolsa = [e for w, e in lista for _ in range(w)]
                rnd.shuffle(bolsa)
                vistos = []
                for e in bolsa:
                    if e not in vistos:
                        vistos.append(e)
                cands += vistos
            if pl["fallback"] and pl["fallback"] != "minecraft:empty":
                fb = [e for w, e in pool(pl["fallback"])["el"]]
                rnd.shuffle(fb)
                cands += fb
            for e in cands:
                if e is None:
                    break
                if e["max"] and contagem.get(e["nome"] or e["loc"], 0) >= e["max"]:
                    continue
                feito = False
                rots = [0, 1, 2, 3]
                rnd.shuffle(rots)
                for rc in rots:
                    cj = list(peca(e["loc"])["jigs"])
                    rnd.shuffle(cj)
                    for k in cj:
                        if k["nome"] != j["alvo"]:
                            continue
                        kf = girar_dir(k["frente"], rc)
                        kt = girar_dir(k["topo"], rc)
                        if kf != OPOSTO[frente]:
                            continue
                        if j["junta"] == "aligned" and frente in ("up", "down") and kt != topo:
                            continue
                        kp = girar_pos(k["pos"], rc)
                        d2 = (alvo_pos[0] - kp[0], alvo_pos[1] - kp[1], alvo_pos[2] - kp[2])
                        cx = caixa(e["loc"], rc, d2)
                        enc = (cx[0] + 0, cx[1], cx[2], cx[3], cx[4], cx[5])
                        if max(abs(cx[0]), abs(cx[3]), abs(cx[2]), abs(cx[5])) > DIST_MAX:
                            continue
                        ok = True
                        if interno and not dentro(enc, eu["caixa"]):
                            ok = False
                        if ok:
                            for c in colocadas:
                                if c is eu and interno:
                                    continue
                                if c is eu and not interno:
                                    if cruza(enc, c["caixa"]):
                                        ok = False
                                        break
                                    continue
                                if cruza(enc, c["caixa"]):
                                    ok = False
                                    break
                        if not ok:
                            continue
                        colocadas.append({"loc": e["loc"], "r": rc, "desl": d2, "caixa": cx, "pai": eu})
                        contagem[e["nome"] or e["loc"]] = contagem.get(e["nome"] or e["loc"], 0) + 1
                        fila.append((e["loc"], rc, d2, prof + 1, eu))
                        feito = True
                        break
                    if feito:
                        break
                if feito:
                    break
    return colocadas


# ---------- Processadores do mod ----------
def sorteio(rnd, base, opcoes):
    for est, p in opcoes:
        if rnd.random() < p:
            return est
    return base


ESC = lambda f, h="top": ("minecraft:sandstone_stairs", {"facing": f, "half": h, "shape": "straight"})


def processar(nome, props, rnd):
    """Os processadores de world/processor/*.java. Devolve (nome, props, extra) ou None para não pôr nada."""
    if nome == "minecraft:tinted_glass" or nome == "minecraft:yellow_stained_glass" or nome == "minecraft:quartz_pillar":
        return "minecraft:sandstone", {}, None
    if nome == "minecraft:polished_diorite":
        return ("minecraft:cut_sandstone", {}, None) if rnd.random() < 0.6 else ("minecraft:sandstone", {}, None)
    if nome == "minecraft:diorite":
        f = rnd.random()
        return (("minecraft:cut_sandstone", {}) if f < 0.25 else ("minecraft:sandstone_slab", {"type": "bottom"}) if f < 0.5 else ("minecraft:sand", {}) if f < 0.75 else ("minecraft:sandstone", {})) + (None,)
    if nome == "minecraft:acacia_wood":
        f = rnd.random()
        if f < 0.1: return "minecraft:sandstone_slab", {"type": "bottom"}, None
        if f < 0.2: return "minecraft:sandstone_slab", {"type": "top"}, None
        for i, d in enumerate(("north", "east", "south", "west")):
            if f < 0.225 + 0.025 * i:
                return ESC(d) + (None,)
        return "minecraft:sandstone", {}, None
    if nome in ("minecraft:sponge", "minecraft:wet_sponge", "minecraft:candle"):
        if rnd.random() < 0.8:
            r = rnd.random()
            n = 2 if r < 0.1 else 3 if r < 0.15 else 4 if r < 0.2 else 1
            cor = rnd.choice(["candle", "white_candle", "light_gray_candle", "yellow_candle", "orange_candle", "brown_candle"])
            return f"minecraft:{cor}", {"candles": str(n), "lit": "true" if rnd.random() < 0.4 else "false"}, None
        return "minecraft:air", {}, None
    if nome == "minecraft:end_stone_brick_wall":
        return "minecraft:sandstone_wall", props, None
    if nome == "minecraft:white_stained_glass":
        return ("minecraft:web", {}, None) if rnd.random() < 0.4 else ("minecraft:air", {}, None)
    if nome in ("minecraft:lime_wall_banner", "minecraft:red_wall_banner", "minecraft:blue_wall_banner", "minecraft:yellow_wall_banner", "minecraft:black_wall_banner"):
        return "minecraft:air", {}, None
    if nome == "minecraft:purpur_pillar":
        return "minecraft:sandstone_wall", {"north": "none", "east": "none", "south": "none", "west": "none", "up": "true"}, None
    if nome in ("minecraft:yellow_wool", "minecraft:gravel", "minecraft:infested_cracked_stone_bricks"):
        return "minecraft:mob_spawner", {}, "minecraft:husk"
    if nome == "minecraft:bone_block":
        return "minecraft:mob_spawner", {}, "minecraft:skeleton"
    if nome == "minecraft:yellow_concrete":
        return "minecraft:yellow_terracotta", {}, None
    if nome == "minecraft:blue_concrete":
        return "minecraft:blue_terracotta", {}, None
    if nome in ("minecraft:torch", "minecraft:wall_torch") and rnd.random() > 0.05:
        return "minecraft:air", {}, None
    if nome == "minecraft:campfire" and props.get("lit") == "true" and rnd.random() > 0.25:
        props = dict(props, lit="false")
    if nome == "minecraft:orange_stained_glass":
        f = rnd.random()
        if f < 0.1: return "minecraft:sand", {}, None
        if f < 0.2: return "minecraft:sandstone", {}, None
        if f < 0.45: return ESC(rnd.choice(["north", "east", "south", "west"])) + (None,)
        return "minecraft:cut_sandstone", {}, None
    if nome == "minecraft:red_stained_glass":
        f = rnd.random()
        if f < 0.3: return "minecraft:sand", {}, None
        if f < 0.75: return "minecraft:sandstone", {}, None
        return ESC(rnd.choice(["north", "east", "south", "west"])) + (None,)
    if nome == "minecraft:red_wool":
        return "minecraft:tnt", {}, None
    return nome, props, None


# ---------- Java -> Bedrock ----------
FD = {"down": 0, "up": 1, "north": 2, "south": 3, "west": 4, "east": 5}
ESCADA = {"east": 0, "west": 1, "south": 2, "north": 3}
GANCHO = {"south": 0, "west": 1, "north": 2, "east": 3}
B = lambda v: v == "true"
IGUAL = {"sandstone", "cut_sandstone", "smooth_sandstone", "chiseled_sandstone", "sand", "bookshelf", "redstone_block", "tnt", "clay", "podzol", "gold_ore",
         "raw_gold_block", "gold_block", "polished_blackstone", "gilded_blackstone", "blackstone", "dripstone_block", "target", "iron_bars", "loom", "web",
         "birch_planks", "oak_planks", "redstone_ore", "red_concrete_powder", "black_concrete", "black_stained_glass", "yellow_terracotta", "blue_terracotta",
         "black_wool", "blue_wool", "green_wool", "yellow_carpet", "blue_carpet", "black_carpet", "birch_fence", "cake", "brewing_stand", "flower_pot",
         "cauldron", "coarse_dirt", "air", "fire", "sea_lantern"}


def bedrock(nome, p):
    n = nome.split(":")[1]
    s = {}
    if n in IGUAL:
        return f"minecraft:{n}", s
    if n.endswith("_stairs"):
        return f"minecraft:{n}", {"weirdo_direction": ESCADA[p["facing"]], "upside_down_bit": p.get("half") == "top"}
    if n.endswith("_slab"):
        if p.get("type") == "double":
            return f"minecraft:{n[:-5]}_double_slab", {"minecraft:vertical_half": "bottom"}
        return f"minecraft:{n}", {"minecraft:vertical_half": "top" if p.get("type") == "top" else "bottom"}
    if n.endswith("_wall"):
        cv = {"none": "none", "low": "short", "tall": "tall", "true": "short", "false": "none"}
        return f"minecraft:{n}", {**{f"wall_connection_type_{k}": cv[p.get(k, "none")] for k in ("north", "east", "south", "west")}, "wall_post_bit": B(p.get("up", "true"))}
    if n in ("wall_torch", "redstone_wall_torch"):
        base = "torch" if n == "wall_torch" else ("redstone_torch" if p.get("lit", "true") == "true" else "unlit_redstone_torch")
        return f"minecraft:{base}", {"torch_facing_direction": p["facing"]}
    if n in ("torch", "redstone_torch"):
        base = "torch" if n == "torch" else ("redstone_torch" if p.get("lit", "true") == "true" else "unlit_redstone_torch")
        return f"minecraft:{base}", {"torch_facing_direction": "top"}
    if n == "redstone_wire":
        return "minecraft:redstone_wire", {"redstone_signal": int(p.get("power", 0))}
    if n == "redstone_lamp":
        return ("minecraft:lit_redstone_lamp" if B(p.get("lit")) else "minecraft:redstone_lamp"), s
    if n == "repeater":
        return ("minecraft:powered_repeater" if B(p.get("powered")) else "minecraft:unpowered_repeater"), {"minecraft:cardinal_direction": OPOSTO[p["facing"]], "repeater_delay": int(p.get("delay", 1)) - 1}
    if n == "comparator":
        return ("minecraft:powered_comparator" if B(p.get("powered")) else "minecraft:unpowered_comparator"), {"minecraft:cardinal_direction": OPOSTO[p["facing"]], "output_subtract_bit": p.get("mode") == "subtract", "output_lit_bit": B(p.get("powered"))}
    if n in ("piston", "sticky_piston"):
        return f"minecraft:{n}", {"facing_direction": FD[p["facing"]]}
    if n == "piston_head":
        return "minecraft:air", s
    if n == "observer":
        return "minecraft:observer", {"minecraft:facing_direction": p["facing"], "powered_bit": B(p.get("powered"))}
    if n in ("dispenser", "dropper"):
        return f"minecraft:{n}", {"facing_direction": FD[p["facing"]], "triggered_bit": B(p.get("triggered"))}
    if n == "hopper":
        return "minecraft:hopper", {"facing_direction": FD[p.get("facing", "down")], "toggle_bit": not B(p.get("enabled", "true"))}
    if n in ("chest", "trapped_chest"):
        return f"minecraft:{n}", {"minecraft:cardinal_direction": p.get("facing", "north")}
    if n == "barrel":
        return "minecraft:barrel", {"facing_direction": FD[p.get("facing", "up")], "open_bit": False}
    if n == "lectern":
        return "minecraft:lectern", {"minecraft:cardinal_direction": p.get("facing", "north"), "powered_bit": False}
    if n == "ladder":
        return "minecraft:ladder", {"facing_direction": FD[p["facing"]]}
    if n.endswith("_wall_sign"):
        return f"minecraft:{n}", {"facing_direction": FD[p["facing"]]}
    if n.endswith("_trapdoor"):
        base = "trapdoor" if n == "oak_trapdoor" else n
        return f"minecraft:{base}", {"direction": {"east": 1, "west": 0, "south": 3, "north": 2}[p["facing"]], "open_bit": B(p.get("open")), "upside_down_bit": p.get("half") == "top"}
    if n.endswith("_pressure_plate"):
        base = "wooden_pressure_plate" if n == "oak_pressure_plate" else n
        return f"minecraft:{base}", {"redstone_signal": int(p.get("power", 0)) if "power" in p else (15 if B(p.get("powered")) else 0)}
    if n.endswith("_button"):
        base = "wooden_button" if n == "oak_button" else n
        face = p.get("face", "wall")
        fd = 1 if face == "floor" else 0 if face == "ceiling" else FD[p["facing"]]
        return f"minecraft:{base}", {"facing_direction": fd, "button_pressed_bit": B(p.get("powered"))}
    if n == "lever":
        face, f = p.get("face", "wall"), p.get("facing", "north")
        if face == "floor":
            d = "up_north_south" if f in ("north", "south") else "up_east_west"
        elif face == "ceiling":
            d = "down_north_south" if f in ("north", "south") else "down_east_west"
        else:
            d = f
        return "minecraft:lever", {"lever_direction": d, "open_bit": B(p.get("powered"))}
    if n == "chain":
        return "minecraft:chain", {"pillar_axis": p.get("axis", "y")}
    if n == "campfire":
        return "minecraft:campfire", {"minecraft:cardinal_direction": p.get("facing", "north"), "extinguished": not B(p.get("lit", "true"))}
    if n == "composter":
        return "minecraft:composter", {"composter_fill_level": int(p.get("level", 0))}
    if n == "scaffolding":
        return "minecraft:scaffolding", {"stability": int(p.get("distance", 0)), "stability_check": False}
    if n == "pointed_dripstone":
        esp = {"tip": "tip", "tip_merge": "merge", "frustum": "frustum", "middle": "middle", "base": "base"}[p.get("thickness", "tip")]
        return "minecraft:pointed_dripstone", {"dripstone_thickness": esp, "hanging": p.get("vertical_direction") == "down"}
    if n == "tripwire":
        return "minecraft:trip_wire", {"attached_bit": B(p.get("attached")), "disarmed_bit": B(p.get("disarmed")), "powered_bit": B(p.get("powered")), "suspended_bit": True}
    if n == "tripwire_hook":
        return "minecraft:tripwire_hook", {"direction": GANCHO[p["facing"]], "attached_bit": B(p.get("attached")), "powered_bit": B(p.get("powered"))}
    if n.endswith("candle"):
        return f"minecraft:{n}", {"candles": int(p.get("candles", 1)) - 1, "lit": B(p.get("lit"))}
    if n in ("skeleton_skull", "zombie_head"):
        return f"minecraft:{n}", {"facing_direction": 1}
    if n.startswith("potted_"):
        return "minecraft:flower_pot", s
    if n == "lantern":
        return "minecraft:lantern", {"hanging": B(p.get("hanging"))}
    if n == "magma_block":
        return "minecraft:magma", s
    if n == "note_block":
        return "minecraft:noteblock", s
    if n == "crafting_table":
        return "minecraft:crafting_table", s
    if n == "grindstone":
        return "minecraft:grindstone", {"attachment": "standing", "direction": GANCHO.get(p.get("facing", "north"), 0)}
    if n == "anvil":
        return "minecraft:anvil", {"minecraft:cardinal_direction": p.get("facing", "north")}
    if n == "water_cauldron":
        return "minecraft:cauldron", {"fill_level": 6, "cauldron_liquid": "water"}
    if n == "lightning_rod":
        return "minecraft:lightning_rod", {"facing_direction": FD[p.get("facing", "up")]}
    if n == "decorated_pot":
        return "minecraft:decorated_pot", {"direction": GANCHO.get(p.get("facing", "north"), 0)}
    if n.endswith("_glazed_terracotta"):
        return f"minecraft:{n}", {"facing_direction": FD[p.get("facing", "north")]}
    if n.endswith("_bed"):
        return "minecraft:bed", {"direction": GANCHO[p["facing"]], "head_piece_bit": p.get("part") == "head", "occupied_bit": False}
    if n in ("water", "lava"):
        return f"minecraft:{n}", {"liquid_depth": int(p.get("level", 0))}
    if n == "kelp" or n == "kelp_plant":
        return "minecraft:kelp", {"kelp_age": 0}
    if n == "seagrass":
        return "minecraft:seagrass", {"sea_grass_type": "default"}
    if n == "glow_lichen":
        bits = sum(1 << i for i, k in enumerate(("down", "up", "south", "west", "north", "east")) if B(p.get(k)))
        return "minecraft:glow_lichen", {"multi_face_direction_bits": bits}
    if n == "mob_spawner":
        return "minecraft:mob_spawner", s
    if n.endswith("stained_glass") or n.endswith("_wool") or n.endswith("_carpet") or n.endswith("_concrete"):
        return f"minecraft:{n}", s
    return None


# ---------- Montagem final ----------
def compor(colocadas, semente):
    rnd = random.Random(semente * 7 + 1)
    mundo = {}
    extras = {"baus": [], "geradores": [], "farao": []}
    for c in colocadas:
        pc = peca(c["loc"])
        r, d = c["r"], c["desl"]
        for pos, nome, props, nb in pc["blocos"]:
            if nome == "minecraft:structure_void":
                continue
            gp = girar_pos(pos, r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            mundo[g] = (nome, girar_estado(nome, props, r))
        for j in pc["jigs"]:
            gp = girar_pos(j["pos"], r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            fs = j["final"]
            nome = fs.split("[")[0]
            if nome != "minecraft:structure_void":
                mundo[g] = (nome, {})
        if c["loc"].endswith("mobs/pharaoh"):
            for (bx, by, bz), eid in pc["ents"]:
                if eid == "minecraft:armor_stand":
                    gp = girar_pos((bx, by, bz), r)
                    extras["farao"].append([gp[0] + d[0], gp[1] + d[1], gp[2] + d[2]])
    final, faltou = {}, {}
    for g in sorted(mundo):
        nome, props = mundo[g]
        res = processar(nome, props, rnd)
        if res is None:
            continue
        nome, props, gerador = res
        bb = bedrock(nome, props)
        if bb is None:
            faltou[nome] = faltou.get(nome, 0) + 1
            bb = ("minecraft:sandstone", {})
        final[g] = (bb, gerador)
        if bb[0] in ("minecraft:chest", "minecraft:barrel", "minecraft:trapped_chest"):
            extras["baus"].append(list(g))
    return final, extras, faltou


def bloco_tag(nome, states):
    def tag(v):
        if isinstance(v, bool):
            return N.byte(1 if v else 0)
        if isinstance(v, int):
            return N.int_(v)
        return N.string(str(v))
    return N.comp({"name": N.string(nome), "states": N.comp({k: tag(v) for k, v in states.items()}), "version": N.int_(18481152)})


def salvar_tile(blocos, X, Y, Z, caminho):
    paleta, indices, camada, dados_pos = [], {}, [], {}
    grade = {}
    for (x, y, z), v in blocos.items():
        grade[(x, y, z)] = v
    for x in range(X):
        for y in range(Y):
            for z in range(Z):
                v = grade.get((x, y, z))
                if v is None:
                    camada.append(-1)
                    continue
                (nome, st), gerador = v
                chave = json.dumps([nome, st], sort_keys=True)
                if chave not in indices:
                    indices[chave] = len(paleta)
                    paleta.append(bloco_tag(nome, st))
                k = len(camada)
                camada.append(indices[chave])
                if gerador:
                    dados_pos[str(k)] = N.comp({"block_entity_data": N.comp({
                        "id": N.string("MobSpawner"), "EntityIdentifier": N.string(gerador), "isMovable": N.byte(1),
                        "x": N.int_(x), "y": N.int_(y), "z": N.int_(z), "Delay": N.short(20), "MinSpawnDelay": N.short(200),
                        "MaxSpawnDelay": N.short(800), "SpawnCount": N.short(2), "MaxNearbyEntities": N.short(6), "RequiredPlayerRange": N.short(16)})})
    raiz = N.comp({
        "format_version": N.int_(1),
        "size": N.lista(3, [N.int_(X), N.int_(Y), N.int_(Z)]),
        "structure": N.comp({
            "block_indices": N.lista(9, [N.lista(3, [N.int_(i) for i in camada]), N.lista(3, [N.int_(-1) for _ in camada])]),
            "entities": N.lista(10, []),
            "palette": N.comp({"default": N.comp({"block_palette": N.lista(10, paleta), "block_position_data": N.comp(dados_pos)})}),
        }),
        "structure_world_origin": N.lista(3, [N.int_(0), N.int_(0), N.int_(0)]),
    })
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_bytes(N.escrever(raiz))


def main():
    saida = {"variantes": []}
    for v in range(VARIANTES):
        melhor = None
        for tentativa in range(12):
            col = montar(1000 * v + tentativa)
            if melhor is None or len(col) > len(melhor[1]):
                melhor = (1000 * v + tentativa, col)
        semente, col = melhor
        final, extras, faltou = compor(col, semente)
        xs = [p[0] for p in final]; ys = [p[1] for p in final]; zs = [p[2] for p in final]
        x0, y0, z0 = min(xs), min(ys), min(zs)
        X, Y, Z = max(xs) - x0 + 1, max(ys) - y0 + 1, max(zs) - z0 + 1
        nx, nz = -(-X // TILE), -(-Z // TILE)
        tiles = []
        for i in range(nx):
            for k in range(nz):
                sub = {(x - x0 - i * TILE, y - y0, z - z0 - k * TILE): b for (x, y, z), b in final.items()
                       if i * TILE <= x - x0 < (i + 1) * TILE and k * TILE <= z - z0 < (k + 1) * TILE}
                if not sub:
                    continue
                tx = min(TILE, X - i * TILE); tz = min(TILE, Z - k * TILE)
                salvar_tile(sub, tx, Y, tz, RAIZ / f"BP/structures/cl/templo_yung_{v}_{i}_{k}.mcstructure")
                tiles.append([i, k])
        rel = lambda p: [p[0] - x0, p[1] - y0, p[2] - z0]
        # Altura da âncora (o centro do templo, que fica 4 a 24 blocos abaixo da superfície no mod).
        saida["variantes"].append({"tam": [X, Y, Z], "ancora": rel((0, 0, 0)), "tiles": tiles, "baus": [rel(p) for p in extras["baus"]],
                                   "farao": [rel(p) for p in extras["farao"]], "pecas": len(col)})
        print(f"variante {v}: semente {semente}, {len(col)} peças, {X}x{Y}x{Z}, {len(tiles)} pedaços, {len(extras['baus'])} baús, faraó {len(extras['farao'])}, sem conversão: {faltou}")
    ts = RAIZ / "scripts/mundo/templo_yung_dados.ts"
    ts.write_text("// Gerado por tools/gerar-templo-yung.py: pedaços, baús e faraó de cada variante do templo do YUNG's.\n"
                  f"export const TEMPLO_YUNG = {json.dumps(saida)} as const;\n", encoding="utf-8")


if __name__ == "__main__":
    main()

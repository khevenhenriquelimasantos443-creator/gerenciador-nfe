#!/usr/bin/env python3
"""Masmorra dos Esqueletos do YUNG's Better Dungeons (YUNGNICKYOUNG, LGPLv3), montada fora do jogo (1.55.0), com o
montador e o conversor do templo do YUNG's (tools/gerar-templo-yung.py).

No mod (data/betterdungeons/worldgen/structure/skeleton_dungeon.json): jigsaw a partir de skeleton_dungeon (a
"casca" com a fogueira no meio), âncora skeleton_dungeon_anchor, até a profundidade 20 e 80 blocos do centro, no
subsolo (y -50 a -30). Os processadores do mod (processor_list/skeleton_dungeon.json e world/processor/*.java):
- vidro amarelo: tijolo de pedra (50 %), musgoso (30 %) ou rachado (20 %); laje de tijolo de prismarinho: laje de
  tijolo de pedra em cima (70 %) ou musgosa (30 %); vidro azul (as "pernas"): pedregulho;
- gerador de monstros: de esqueletos (alcance 18, até 8 por perto, espera máxima de 650 ticks);
- pepino-do-mar: 1 a 4 velas de uma cor sorteada (10 % acesas);
- regras: tijolo de pedra vira musgoso (20 %) ou rachado (30 %), pedregulho vira musgoso (50 %), tijolo entalhado
  infestado vira entalhado (90 %).
Os baús "common" e "middle" do mod ganham as tabelas de masmorra do pack (cl_masmorra e cl_masmorra_funda).
Sai em pedaços de 64x64 em BP/structures/cl/masmorra_yung_<v>_<i>_<k>.mcstructure e
scripts/mundo/masmorra_yung_dados.ts.
  python3 tools/gerar-masmorra-yung.py <pasta do YUNGs-Better-Dungeons>
"""
import importlib.util
import json
import os
import random
import shutil
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
YBD = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/gerar-masmorra-yung.py <pasta do YUNGs-Better-Dungeons>"))

_argv = sys.argv
sys.argv = ["gerar-templo-yung.py", "/nao/usado"]
_spec = importlib.util.spec_from_file_location("templo_yung", RAIZ / "tools/gerar-templo-yung.py")
Y = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(Y)
sys.argv = _argv
N = Y.N

_tmp = Path(tempfile.mkdtemp())
DADOS = YBD / "Common/src/main/resources/data/betterdungeons"
os.symlink(DADOS / "structure", _tmp / "structure")
os.symlink(DADOS / "worldgen", _tmp / "worldgen")
Y.DADOS = _tmp

VARIANTES = 3
PROFUNDIDADE = 20
DIST_MAX = 80
TILE = 64
SAQUE = {"common": "loot_tables/chests/cl_masmorra.json", "middle": "loot_tables/chests/cl_masmorra_funda.json"}

# ---------- Blocos (Java -> Bedrock) que o conversor do templo não tem ----------
IGUAL = {"stone_bricks", "mossy_stone_bricks", "cracked_stone_bricks", "chiseled_stone_bricks", "infested_chiseled_stone_bricks",
         "infested_cobblestone", "infested_stone_bricks", "cobblestone", "mossy_cobblestone", "stone", "smithing_table", "jukebox",
         "soul_sand", "soul_soil", "crafting_table", "iron_bars", "brewing_stand", "bookshelf", "cobweb"}
EIXO = lambda p: {"pillar_axis": p.get("axis", "y")}


def converter(nome, props):
    n = nome.split(":")[1]
    if n in ("air", "cave_air"):
        return ("minecraft:air", {})
    if n in IGUAL:
        return ("minecraft:web" if n == "cobweb" else f"minecraft:{n}", {})
    if n == "spawner":
        return ("minecraft:mob_spawner", {})
    # Nomes que mudam no Bedrock: as escadas e lajes de pedregulho e de pedra lisa.
    if n == "cobblestone_stairs":
        nome, n = "minecraft:stone_stairs", "stone_stairs_bedrock"
        return ("minecraft:stone_stairs", {"weirdo_direction": Y.ESCADA[props["facing"]], "upside_down_bit": props.get("half") == "top"})
    if n == "stone_stairs":
        return ("minecraft:normal_stone_stairs", {"weirdo_direction": Y.ESCADA[props["facing"]], "upside_down_bit": props.get("half") == "top"})
    if n == "stone_slab":
        if props.get("type") == "double":
            return ("minecraft:normal_stone_double_slab", {"minecraft:vertical_half": "bottom"})
        return ("minecraft:normal_stone_slab", {"minecraft:vertical_half": "top" if props.get("type") == "top" else "bottom"})
    if n.endswith("_log") or n.endswith("_wood"):
        return (f"minecraft:{n}", EIXO(props))
    if n.endswith("_door"):
        return (f"minecraft:{'wooden_door' if n == 'oak_door' else n}", {
            "direction": {"east": 0, "south": 1, "west": 2, "north": 3}[props.get("facing", "north")],
            "door_hinge_bit": props.get("hinge") == "right", "open_bit": props.get("open") == "true", "upper_block_bit": props.get("half") == "upper"})
    if n in ("damaged_anvil", "chipped_anvil"):
        return (f"minecraft:{n}", {"minecraft:cardinal_direction": props.get("facing", "north")})
    if n in ("soul_campfire",):
        return ("minecraft:soul_campfire", {"minecraft:cardinal_direction": props.get("facing", "north"), "extinguished": props.get("lit", "true") != "true"})
    if n in ("soul_lantern",):
        return ("minecraft:soul_lantern", {"hanging": props.get("hanging") == "true"})
    if n == "skeleton_wall_skull":
        return ("minecraft:skeleton_skull", {"facing_direction": Y.FD[props.get("facing", "north")]})
    return Y.bedrock(nome, props)


# ---------- Processadores do mod ----------
CORES_VELA = ["candle", "white_candle", "light_gray_candle", "gray_candle", "black_candle", "brown_candle", "red_candle", "orange_candle",
              "yellow_candle", "lime_candle", "green_candle", "cyan_candle", "light_blue_candle", "blue_candle", "purple_candle", "magenta_candle", "pink_candle"]


def processar(nome, props, nb, rnd):
    """Devolve (nome, props, extra) ou None (não põe nada). extra: ("gerador", mob) ou ("bau", tabela)."""
    if nome in ("minecraft:jigsaw", "minecraft:structure_void", "minecraft:structure_block"):
        return None
    if nome == "minecraft:yellow_stained_glass":
        f = rnd.random()
        nome = "minecraft:mossy_stone_bricks" if f < 0.3 else "minecraft:cracked_stone_bricks" if f < 0.5 else "minecraft:stone_bricks"
        return nome, {}, None
    if nome == "minecraft:prismarine_brick_slab":
        return ("minecraft:mossy_stone_brick_slab" if rnd.random() < 0.3 else "minecraft:stone_brick_slab"), {"type": "top"}, None
    if nome == "minecraft:blue_stained_glass":
        return "minecraft:cobblestone", {}, None
    if nome == "minecraft:spawner":
        return nome, {}, ("gerador", "minecraft:skeleton")
    if nome == "minecraft:sea_pickle":
        return f"minecraft:{rnd.choice(CORES_VELA)}", {"candles": str(rnd.randint(1, 4)), "lit": "true" if rnd.random() < 0.1 else "false"}, None
    # minecraft:rule
    if nome == "minecraft:stone_bricks":
        if rnd.random() < 0.2:
            nome = "minecraft:mossy_stone_bricks"
        elif rnd.random() < 0.3:
            nome = "minecraft:cracked_stone_bricks"
    elif nome == "minecraft:cobblestone" and rnd.random() < 0.5:
        nome = "minecraft:mossy_cobblestone"
    elif nome == "minecraft:infested_chiseled_stone_bricks" and rnd.random() < 0.9:
        nome = "minecraft:chiseled_stone_bricks"
    if nome in ("minecraft:chest", "minecraft:barrel", "minecraft:trapped_chest"):
        lt = (nb or {}).get("LootTable", "")
        return nome, props, ("bau", SAQUE["middle" if lt.endswith("middle") else "common"])
    return nome, props, None


# ---------- Montagem (o laço do templo, com a âncora e os números da masmorra) ----------
def montar(semente):
    rnd = random.Random(semente)
    inicio = "betterdungeons:skeleton_dungeon/skeleton_shell"
    r0 = rnd.randrange(4)
    ancora = next(j for j in Y.peca(inicio)["jigs"] if j["nome"] == "betterdungeons:skeleton_dungeon_anchor")
    a = Y.girar_pos(ancora["pos"], r0)
    desl = (-a[0], -a[1], -a[2])
    # "cont": a peça cujo espaço interno esta ocupa (None = o espaço de fora), como o espaço livre do JigsawPlacement:
    # um filho cujo encaixe cai dentro da caixa do pai fica no espaço interno do pai; senão, no mesmo espaço do pai.
    colocadas = [{"loc": inicio, "r": r0, "desl": desl, "caixa": Y.caixa(inicio, r0, desl), "pai": None, "cont": None}]
    fila = [(inicio, r0, desl, 0)]
    contagem = {}
    while fila:
        loc, r, d, prof = fila.pop(0)
        eu = next(x for x in colocadas if x["loc"] == loc and x["desl"] == d and x["r"] == r)
        jigs = list(Y.peca(loc)["jigs"])
        rnd.shuffle(jigs)
        jigs.sort(key=lambda j: -j["prio"])
        for j in jigs:
            frente = Y.girar_dir(j["frente"], r)
            topo = Y.girar_dir(j["topo"], r)
            pj = Y.girar_pos(j["pos"], r)
            pj = (pj[0] + d[0], pj[1] + d[1], pj[2] + d[2])
            dv = Y.DIR[frente]
            alvo_pos = (pj[0] + dv[0], pj[1] + dv[1], pj[2] + dv[2])
            interno = all(eu["caixa"][i] <= alvo_pos[i] <= eu["caixa"][i + 3] for i in range(3))
            pl = Y.pool(j["pool"])
            cands = []
            if prof < PROFUNDIDADE:
                b = [e for w, e in pl["el"] for _ in range(w)]
                rnd.shuffle(b)
                for e in b:
                    if e not in cands:
                        cands.append(e)
            if pl["fallback"] and pl["fallback"] != "minecraft:empty":
                fb = [e for w, e in Y.pool(pl["fallback"])["el"]]
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
                    cj = list(Y.peca(e["loc"])["jigs"])
                    rnd.shuffle(cj)
                    for k in cj:
                        if k["nome"] != j["alvo"]:
                            continue
                        kf = Y.girar_dir(k["frente"], rc)
                        kt = Y.girar_dir(k["topo"], rc)
                        if kf != Y.OPOSTO[frente]:
                            continue
                        if j["junta"] == "aligned" and frente in ("up", "down") and kt != topo:
                            continue
                        kp = Y.girar_pos(k["pos"], rc)
                        d2 = (alvo_pos[0] - kp[0], alvo_pos[1] - kp[1], alvo_pos[2] - kp[2])
                        cx = Y.caixa(e["loc"], rc, d2)
                        if max(abs(cx[0]), abs(cx[3]), abs(cx[2]), abs(cx[5])) > DIST_MAX:
                            continue
                        cont = eu if interno else eu["cont"]
                        if cont is not None and not Y.dentro(cx, cont["caixa"]):
                            continue
                        # não pode cruzar as outras peças do mesmo espaço (nem, no espaço de fora, nenhuma peça de fora)
                        if any(Y.cruza(cx, x["caixa"]) for x in colocadas if x is not cont and x["cont"] is cont):
                            continue
                        colocadas.append({"loc": e["loc"], "r": rc, "desl": d2, "caixa": cx, "pai": eu, "cont": cont})
                        contagem[e["nome"] or e["loc"]] = contagem.get(e["nome"] or e["loc"], 0) + 1
                        fila.append((e["loc"], rc, d2, prof + 1))
                        feito = True
                        break
                    if feito:
                        break
                if feito:
                    break
    return colocadas


def compor(colocadas, semente):
    rnd = random.Random(semente * 7 + 3)
    mundo = {}
    for c in colocadas:
        pc = Y.peca(c["loc"])
        r, d = c["r"], c["desl"]
        for pos, nome, props, nb in pc["blocos"]:
            gp = Y.girar_pos(pos, r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            mundo[g] = (nome, Y.girar_estado(nome, props, r), nb)
        for j in pc["jigs"]:
            gp = Y.girar_pos(j["pos"], r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            fs = j["final"]
            nome = fs.split("[")[0]
            if nome != "minecraft:structure_void":
                props = dict(kv.split("=") for kv in fs.split("[")[1].rstrip("]").split(",")) if "[" in fs else {}
                mundo[g] = (nome, Y.girar_estado(nome, props, r), None)
    final, faltou, extras = {}, {}, {"baus": 0, "geradores": 0}
    for g in sorted(mundo):
        nome, props, nb = mundo[g]
        res = processar(nome, props, nb, rnd)
        if res is None:
            continue
        nome, props, extra = res
        bb = converter(nome, props)
        if bb is None:
            faltou[nome] = faltou.get(nome, 0) + 1
            bb = ("minecraft:stone_bricks", {})
        final[g] = (bb, extra)
        if extra and extra[0] == "bau":
            extras["baus"] += 1
        if extra and extra[0] == "gerador":
            extras["geradores"] += 1
    return final, extras, faltou


def salvar(blocos, X, Yh, Z, caminho):
    paleta, indices, camada, dados_pos = [], {}, [], {}
    for x in range(X):
        for y in range(Yh):
            for z in range(Z):
                v = blocos.get((x, y, z))
                if v is None:
                    camada.append(-1)
                    continue
                (nome, st), extra = v
                chave = json.dumps([nome, st], sort_keys=True)
                if chave not in indices:
                    indices[chave] = len(paleta)
                    paleta.append(Y.bloco_tag(nome, st))
                k = len(camada)
                camada.append(indices[chave])
                if extra and extra[0] == "bau":
                    dados_pos[str(k)] = N.comp({"block_entity_data": N.comp({
                        "id": N.string("Barrel" if nome == "minecraft:barrel" else "Chest"), "LootTable": N.string(extra[1]), "LootTableSeed": N.int_(0),
                        "Items": N.lista(10, []), "isMovable": N.byte(1), "x": N.int_(x), "y": N.int_(y), "z": N.int_(z)})})
                if extra and extra[0] == "gerador":
                    dados_pos[str(k)] = N.comp({"block_entity_data": N.comp({
                        "id": N.string("MobSpawner"), "EntityIdentifier": N.string(extra[1]), "isMovable": N.byte(1),
                        "x": N.int_(x), "y": N.int_(y), "z": N.int_(z), "Delay": N.short(20), "MinSpawnDelay": N.short(200),
                        "MaxSpawnDelay": N.short(650), "SpawnCount": N.short(4), "MaxNearbyEntities": N.short(8), "RequiredPlayerRange": N.short(18)})})
    raiz = N.comp({
        "format_version": N.int_(1),
        "size": N.lista(3, [N.int_(X), N.int_(Yh), N.int_(Z)]),
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
        for t in range(12):
            col = montar(7000 + 100 * v + t)
            if melhor is None or len(col) > len(melhor[1]):
                melhor = (7000 + 100 * v + t, col)
        semente, col = melhor
        final, extras, faltou = compor(col, semente)
        xs = [p[0] for p in final]; ys = [p[1] for p in final]; zs = [p[2] for p in final]
        x0, y0, z0 = min(xs), min(ys), min(zs)
        X, Yh, Z = max(xs) - x0 + 1, max(ys) - y0 + 1, max(zs) - z0 + 1
        tiles = []
        for i in range(-(-X // TILE)):
            for k in range(-(-Z // TILE)):
                sub = {(x - x0 - i * TILE, y - y0, z - z0 - k * TILE): b for (x, y, z), b in final.items()
                       if i * TILE <= x - x0 < (i + 1) * TILE and k * TILE <= z - z0 < (k + 1) * TILE}
                if not sub:
                    continue
                salvar(sub, min(TILE, X - i * TILE), Yh, min(TILE, Z - k * TILE), RAIZ / f"BP/structures/cl/masmorra_yung_{v}_{i}_{k}.mcstructure")
                tiles.append([i, k])
        # ancora: onde fica a âncora do mod (o meio da casca, na altura do chão) em relação ao canto de baixo.
        saida["variantes"].append({"tam": [X, Yh, Z], "ancora": [-x0, -y0, -z0], "tiles": tiles, "baus": extras["baus"], "geradores": extras["geradores"], "pecas": len(col)})
        print(f"variante {v}: semente {semente}, {len(col)} peças, {X}x{Yh}x{Z}, {len(tiles)} pedaços, {extras['baus']} baús, {extras['geradores']} geradores; sem conversão: {faltou}")
    (RAIZ / "scripts/mundo/masmorra_yung_dados.ts").write_text(
        "// Gerado por tools/gerar-masmorra-yung.py: pedaços e números de cada variante da Masmorra dos Esqueletos do YUNG's.\n"
        f"export const MASMORRA_YUNG = {json.dumps(saida)} as const;\n", encoding="utf-8")
    shutil.rmtree(_tmp, ignore_errors=True)


if __name__ == "__main__":
    main()

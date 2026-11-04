#!/usr/bin/env python3
"""Geração natural do mundo normal (1.15.0): o próprio jogo põe as estruturas e os minérios, sem script.

O Bedrock não roda features em mundo plano (testado no servidor), então o mundo do add-on passou a ser infinito com
o deserto (BP/biomes/deserto_seco) no lugar de todos os biomas. Este script lê a configuração (scripts/config.ts,
compilada em BP/scripts/config.js) e escreve:
- BP/loot_tables/chests/cl_*.json: o saque do templo, dos destroços e da pirâmide (os baús enchem ao abrir);
- BP/structures/cl/templo_soterrado_n e nave_caida_n: as estruturas com o baú de saque no lugar;
- BP/features e BP/feature_rules: as peças (morro, mesa, rochas) ao acaso, as raras (templo e destroços) numa
  grade fixa (NATIVO em config.ts; o script faz a mesma conta para os comandos) e os
  veios de mármore, calcário e petróleo (os minérios do jogo já vêm no mundo normal).
Roda no build, depois de compilar o TypeScript.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import nbt_java as N  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
CFG = json.loads(subprocess.check_output(["node", "-e", """
import('./BP/scripts/config.js').then((m) => console.log(JSON.stringify({
  templo: m.TEMPLO_SAQUE, destrocos: m.DESTROCOS_SAQUE, pecas: m.RELEVO.pecas, nativo: m.NATIVO, raras: m.RARAS,
  minerios: m.MINERIOS.filter((x) => x.bloco), petroleo: m.PETROLEO, masmorra: m.MASMORRA,
  saqueMasmorra: m.MASMORRA_SAQUE, saqueFunda: m.MASMORRA_FUNDA_SAQUE, sorteio: m.SAQUE_SORTEIO, gerador: m.IDS.geradorMonstros, mobs: m.GERADOR_MONSTROS })));
"""], cwd=RAIZ, text=True))
FILTRO = [{"test": "has_biome_tag", "operator": "==", "value": "desert"}]


def escrever(rel, obj):
    p = RAIZ / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(obj, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


for pasta in ("BP/features", "BP/feature_rules"):
    shutil.rmtree(RAIZ / pasta, ignore_errors=True)


# ---------- Saque ----------
def tabela(linhas):
    pools = []
    for l in linhas:
        e = {"type": "item", "name": l["item"], "weight": 1}
        if l["max"] > 1 or l["min"] > 1:
            e["functions"] = [{"function": "set_count", "count": {"min": l["min"], "max": l["max"]}}]
        pool = {"rolls": 1, "entries": [e]}
        if l["chance"] < 1:
            pool["conditions"] = [{"condition": "random_chance", "chance": l["chance"]}]
        pools.append(pool)
    return {"pools": pools}


def com_sorteio(nome, t):
    # 1.30.0/1.31.0: SAQUE_SORTEIO (config.ts): um item da lista ou nada, por baú.
    for s in CFG["sorteio"].get(nome, []):
        entradas = [{"type": "item", "name": i, "weight": 1} for i in s["itens"]] + [{"type": "empty", "weight": s["vazio"]}]
        t["pools"].append({"rolls": 1, "entries": entradas})
    return t


escrever("BP/loot_tables/chests/cl_templo.json", com_sorteio("cl_templo", tabela(CFG["templo"])))
escrever("BP/loot_tables/chests/cl_destrocos.json", com_sorteio("cl_destrocos", tabela(CFG["destrocos"])))
escrever("BP/loot_tables/chests/cl_piramide.json", com_sorteio("cl_piramide", tabela(CFG["templo"])))
escrever("BP/loot_tables/chests/cl_masmorra.json", com_sorteio("cl_masmorra", tabela(CFG["saqueMasmorra"])))
escrever("BP/loot_tables/chests/cl_masmorra_funda.json", com_sorteio("cl_masmorra_funda", tabela(CFG["saqueFunda"])))


# ---------- Spawners do Minecraft (1.15.1): uma estrutura de um bloco para cada mob ----------
def dados_spawner(mob, x=0, y=0, z=0):
    g = CFG["mobs"]
    return N.comp({"block_entity_data": N.comp({
        "id": N.string("MobSpawner"), "EntityIdentifier": N.string(mob), "isMovable": N.byte(1), "x": N.int_(x), "y": N.int_(y), "z": N.int_(z),
        "Delay": N.short(20), "MinSpawnDelay": N.short(200), "MaxSpawnDelay": N.short(800), "SpawnCount": N.short(g["porVez"][1]),
        "MaxNearbyEntities": N.short(g["limitePerto"]), "RequiredPlayerRange": N.short(g["raioJogador"]), "SpawnRange": N.short(3)})})


MOBS = sorted(set(CFG["mobs"]["mobs"]) | set(CFG["mobs"]["mobsFundo"]) | set(CFG["mobs"]["blazes"]))
for mob in MOBS:
    raiz = N.comp({"format_version": N.int_(1), "size": N.lista(3, [N.int_(1), N.int_(1), N.int_(1)]),
                   "structure": N.comp({"block_indices": N.lista(9, [N.lista(3, [N.int_(0)]), N.lista(3, [N.int_(-1)])]), "entities": N.lista(10, []),
                                        "palette": N.comp({"default": N.comp({"block_palette": N.lista(10, [N.comp({"name": N.string("minecraft:mob_spawner"), "states": N.comp({}), "version": N.int_(18481152)})]),
                                                                              "block_position_data": N.comp({"0": dados_spawner(mob)})})})}),
                   "structure_world_origin": N.lista(3, [N.int_(0), N.int_(0), N.int_(0)])})
    (RAIZ / f"BP/structures/cl/spawner_{mob.replace(':', '_')}.mcstructure").write_bytes(N.escrever(raiz))


# ---------- Estruturas com baú de saque ----------
def com_bau(origem, destino, pos, saque, marco=None):
    t = N.ler_le((RAIZ / f"BP/structures/cl/{origem}.mcstructure").read_bytes())
    est = t.v["structure"].v
    X, Y, Z = (x.v for x in t.v["size"].v[1])
    pal = est["palette"].v["default"].v
    blocos = pal["block_palette"].v[1]
    blocos.append(N.comp({"name": N.string("minecraft:chest"), "states": N.comp({"minecraft:cardinal_direction": N.string("south")}), "version": N.int_(18481152)}))
    k = (pos[0] * Y + pos[1]) * Z + pos[2]
    est["block_indices"].v[1][0].v[1][k] = N.int_(len(blocos) - 1)
    pal["block_position_data"].v[str(k)] = N.comp({"block_entity_data": N.comp({
        "id": N.string("Chest"), "LootTable": N.string(f"loot_tables/chests/{saque}.json"), "LootTableSeed": N.int_(0),
        "Items": N.lista(10, []), "isMovable": N.byte(1), "x": N.int_(pos[0]), "y": N.int_(pos[1]), "z": N.int_(pos[2])})})
    if marco:
        # O marco vai no primeiro ar perto do baú (cl:marco_* guarda o lugar para a missão e vira ar).
        nomes = [b.v["name"].v for b in blocos]
        idx = est["block_indices"].v[1][0].v[1]
        blocos.append(N.comp({"name": N.string(marco), "states": N.comp({}), "version": N.int_(18481152)}))
        for dx, dy, dz in ((0, 1, 0), (1, 0, 0), (-1, 0, 0), (0, 0, 1), (0, 0, -1), (0, 2, 0)):
            x, y, z = pos[0] + dx, pos[1] + dy, pos[2] + dz
            if 0 <= x < X and 0 <= y < Y and 0 <= z < Z:
                kk = (x * Y + y) * Z + z
                if idx[kk].v < 0 or nomes[idx[kk].v] == "minecraft:air":
                    idx[kk] = N.int_(len(blocos) - 1)
                    break
    (RAIZ / f"BP/structures/cl/{destino}.mcstructure").write_bytes(N.escrever(t))


raras = {r["tipo"]: r for r in CFG["raras"]}
for tipo, origem, saque in (("templo", "templo_soterrado", "cl_templo"), ("destrocos", "nave_caida", "cl_destrocos")):
    b = raras[tipo]["bau"]
    com_bau(origem, f"{origem}_n", [b["x"], b["y"], b["z"]], saque, "cl:marco_destrocos" if tipo == "destrocos" else None)


# ---------- Masmorras (como scripts/mundo/masmorra.ts, sem o poço): sala 9×6×9 com o Gerador de Monstros ----------
def masmorra(nome, funda):
    import random
    rnd = random.Random(7 if funda else 3)
    X = Y = Z = 9
    Y = 6
    parede, musgo = ("minecraft:deepslate_bricks", "minecraft:cracked_deepslate_bricks") if funda else ("minecraft:cobblestone", "minecraft:mossy_cobblestone")
    grade = {}
    for x in range(X):
        for y in range(Y):
            for z in range(Z):
                dentro = 0 < x < X - 1 and 0 < z < Z - 1 and 0 < y < Y - 1
                grade[(x, y, z)] = ("minecraft:air", {}) if dentro else (musgo if rnd.random() < 0.15 else parede, {})
    extra, spawners = {}, {}
    lista = CFG["mobs"]["mobsFundo"] if funda else CFG["mobs"]["mobs"]
    for p in ((4, 1, 4), (6, 1, 6)) if funda else ((4, 1, 4),):
        grade[p] = ("minecraft:mob_spawner", {})
        spawners[p] = rnd.choice(lista)
    saque = "cl_masmorra_funda" if funda else "cl_masmorra"
    for (x, y, z) in ((1, 1, 7), (7, 1, 1)):
        grade[(x, y, z)] = ("minecraft:chest", {"minecraft:cardinal_direction": "south"})
        extra[(x, y, z)] = saque
    grade[(4, 3, 4)] = ("cl:marco_masmorra_funda" if funda else "cl:marco_masmorra", {})
    paleta, ids, camada, dados = [], {}, [], {}
    for x in range(X):
        for y in range(Y):
            for z in range(Z):
                nomeb, st = grade[(x, y, z)]
                ch = json.dumps([nomeb, st], sort_keys=True)
                if ch not in ids:
                    ids[ch] = len(paleta)
                    paleta.append(N.comp({"name": N.string(nomeb), "states": N.comp({k: N.string(v) for k, v in st.items()}), "version": N.int_(18481152)}))
                if (x, y, z) in spawners:
                    dados[str(len(camada))] = dados_spawner(spawners[(x, y, z)], x, y, z)
                if (x, y, z) in extra:
                    dados[str(len(camada))] = N.comp({"block_entity_data": N.comp({
                        "id": N.string("Chest"), "LootTable": N.string(f"loot_tables/chests/{extra[(x, y, z)]}.json"), "LootTableSeed": N.int_(0),
                        "Items": N.lista(10, []), "isMovable": N.byte(1), "x": N.int_(x), "y": N.int_(y), "z": N.int_(z)})})
                camada.append(ids[ch])
    raiz = N.comp({"format_version": N.int_(1), "size": N.lista(3, [N.int_(X), N.int_(Y), N.int_(Z)]),
                   "structure": N.comp({"block_indices": N.lista(9, [N.lista(3, [N.int_(i) for i in camada]), N.lista(3, [N.int_(-1) for _ in camada])]),
                                        "entities": N.lista(10, []),
                                        "palette": N.comp({"default": N.comp({"block_palette": N.lista(10, paleta), "block_position_data": N.comp(dados)})})}),
                   "structure_world_origin": N.lista(3, [N.int_(0), N.int_(0), N.int_(0)])})
    (RAIZ / f"BP/structures/cl/{nome}.mcstructure").write_bytes(N.escrever(raiz))


masmorra("masmorra_n", False)
masmorra("masmorra_funda_n", True)


# ---------- 1.34.0: plantas selvagens do Farmer's Delight (raridade do mod: 1 em 30 chunks; cada vez, um punhado) ----------
SELVAGENS = [("repolho_selvagem", "beach"), ("beterraba_marinha", "beach"), ("tomateiro_selvagem", "savanna"), ("cebola_selvagem", "forest"),
             ("cenoura_selvagem", "plains"), ("batata_selvagem", "taiga"), ("arroz_selvagem", "swamp"), ("arbusto_arenoso", "desert")]
for planta, bioma in SELVAGENS:
    escrever(f"BP/features/fd_{planta}.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
        "description": {"identifier": f"cl:fd_{planta}"}, "places_block": f"cl:{planta}", "enforce_placement_rules": False, "enforce_survivability_rules": False,
        "may_attach_to": {"bottom": ["minecraft:grass_block", "minecraft:sand", "minecraft:dirt", "minecraft:podzol", "minecraft:mud", "minecraft:coarse_dirt"]},
        "may_replace": ["minecraft:air", "minecraft:short_grass"]}})
    escrever(f"BP/features/fd_{planta}_tufo.json", {"format_version": "1.13.0", "minecraft:scatter_feature": {
        "description": {"identifier": f"cl:fd_{planta}_tufo"}, "places_feature": f"cl:fd_{planta}", "iterations": 6, "coordinate_eval_order": "xzy",
        "x": {"distribution": "gaussian", "extent": [-3, 3]}, "z": {"distribution": "gaussian", "extent": [-3, 3]}, "y": 0}})
    escrever(f"BP/feature_rules/fd_{planta}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:fd_{planta}_regra", "places_feature": f"cl:fd_{planta}_tufo"},
        "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": [{"test": "has_biome_tag", "operator": "==", "value": bioma}]},
        "distribution": {"iterations": 1, "scatter_chance": {"numerator": 1, "denominator": 30}, "x": {"distribution": "uniform", "extent": [0, 16]},
                         "y": "query.heightmap(variable.worldx, variable.worldz)", "z": {"distribution": "uniform", "extent": [0, 16]}}}})


# ---------- Features ----------
def feature_estrutura(nome, estrutura, girar=True, chao=True):
    escrever(f"BP/features/{nome}.json", {"format_version": "1.13.0", "minecraft:structure_template_feature": {
        "description": {"identifier": f"cl:{nome}"}, "structure_name": estrutura, "adjustment_radius": 2 if chao else 0,
        "facing_direction": "random" if girar else "north", "constraints": {"grounded": {}} if chao else {}}})


def regra(nome, feature, distribuicao, passo="surface_pass"):
    escrever(f"BP/feature_rules/{nome}.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:{nome}", "places_feature": f"cl:{feature}"},
        "conditions": {"placement_pass": passo, "minecraft:biome_filter": FILTRO}, "distribution": distribuicao}})


def chance(p):
    # scatter_chance: numerador < denominador.
    d = 1000
    return {"numerator": max(1, round(p * d)), "denominator": d}


ALTURA = "query.heightmap(variable.worldx, variable.worldz)"
for p in CFG["pecas"]:
    nome = p["estrutura"].split(":")[1]
    feature_estrutura(f"peca_{nome}", p["estrutura"], girar=p.get("girar", True))
    regra(f"peca_{nome}_regra", f"peca_{nome}", {
        "iterations": 1, "scatter_chance": chance(p["chance"]),
        "x": {"distribution": "uniform", "extent": [0, 16]}, "z": {"distribution": "uniform", "extent": [0, 16]},
        "y": f"{ALTURA} + {p['deslocY']}"})


def na_grade(celula, desloc):
    """Só no chunk do canto da célula. O teste vai em "iterations" (0 ou 1): mandar a estrutura grande para fora do
    mundo nos outros chunks deixava a geração travada (testado no servidor)."""
    c, (a, b) = celula * 16, desloc
    cond = lambda v, o: f"(math.mod(variable.origin{v}, {c}) == {o * 16} || math.mod(variable.origin{v}, {c}) == {o * 16 - c})"
    return f"({cond('x', a)} && {cond('z', b)})"


def rara(nome, estrutura, celula, desloc, dy):
    feature_estrutura(nome, estrutura, chao=False)
    regra(f"{nome}_regra", nome, {"iterations": f"{na_grade(celula, desloc)} ? 1 : 0", "x": 0, "z": 0, "y": f"{ALTURA} + ({dy})"})


nat = CFG["nativo"]
rara("rara_templo", nat["templo"]["estrutura"], nat["templo"]["celula"], nat["templo"]["desloc"], nat["templo"]["deslocY"])
rara("rara_destrocos", nat["destrocos"]["estrutura"], nat["destrocos"]["celula"], nat["destrocos"]["desloc"], nat["destrocos"]["deslocY"])
# As pirâmides do YUNG's (83×83) não: a feature só desenha a parte perto do chunk dela (testado). Quem põe é o script,
# uma vez, quando alguém chega perto (scripts/mundo/templo_yung.ts), nos mesmos cantos da grade.

# Masmorras no subsolo (comuns na pedra, fundas na ardósia).
mm = CFG["masmorra"]
for nome, chance_m, faixa in (("masmorra_n", mm["chance"] * (1 - mm["chanceFunda"]), mm["yComum"]), ("masmorra_funda_n", mm["chance"] * mm["chanceFunda"], mm["yFunda"])):
    feature_estrutura(nome, f"cl:{nome}", chao=False)
    regra(f"{nome}_regra", nome, {"iterations": 1, "scatter_chance": chance(chance_m), "coordinate_eval_order": "xzy",
        "x": {"distribution": "uniform", "extent": [0, 8]}, "z": {"distribution": "uniform", "extent": [0, 8]},
        "y": {"distribution": "uniform", "extent": [faixa[0], faixa[1]]}}, "underground_pass")

# Veios de mármore e calcário (Chisel) e bolsões de petróleo (BuildCraft).
for m in CFG["minerios"]:
    nome = f"veio_{m['minerio']}"
    escrever(f"BP/features/{nome}.json", {"format_version": "1.13.0", "minecraft:ore_feature": {
        "description": {"identifier": f"cl:{nome}"}, "count": m["tamanho"],
        "replace_rules": [{"places_block": m["bloco"], "may_replace": ["minecraft:stone"]}]}})
    regra(f"{nome}_regra", nome, {"iterations": m["veios"], "coordinate_eval_order": "xzy",
        "x": {"distribution": "uniform", "extent": [0, 16]}, "z": {"distribution": "uniform", "extent": [0, 16]},
        "y": {"distribution": "uniform", "extent": [m["yMin"], m["yMax"]]}}, "underground_pass")
pt = CFG["petroleo"]
escrever("BP/features/bolsao_petroleo.json", {"format_version": "1.13.0", "minecraft:ore_feature": {
    "description": {"identifier": "cl:bolsao_petroleo"}, "count": 64,  # mais que isso derruba o servidor (testado)
    "replace_rules": [{"places_block": "cl:petroleo", "may_replace": ["minecraft:stone", "minecraft:deepslate", "minecraft:tuff", "minecraft:gravel", "minecraft:dirt"]}]}})
regra("bolsao_petroleo_regra", "bolsao_petroleo", {"iterations": 1, "scatter_chance": chance(pt["chance"]), "coordinate_eval_order": "xzy",
    "x": {"distribution": "uniform", "extent": [0, 16]}, "z": {"distribution": "uniform", "extent": [0, 16]},
    "y": {"distribution": "uniform", "extent": [pt["yMin"], pt["yMax"]]}}, "underground_pass")

# 1.26.0 (Tinkers completo): Minério de Cobalto no Nether, com os números do TC3 (worldgen/placed_feature): 5 veios de 4
# blocos em toda a altura e 3 de 6 entre y 8 e 32, trocando netherrack.
for nome, tam, veios, y0, y1 in (("cobalto_pequeno", 4, 5, 8, 119), ("cobalto_grande", 6, 3, 8, 32)):
    escrever(f"BP/features/veio_{nome}.json", {"format_version": "1.13.0", "minecraft:ore_feature": {
        "description": {"identifier": f"cl:veio_{nome}"}, "count": tam,
        "replace_rules": [{"places_block": "cl:minerio_cobalto", "may_replace": ["minecraft:netherrack"]}]}})
    escrever(f"BP/feature_rules/veio_{nome}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:veio_{nome}_regra", "places_feature": f"cl:veio_{nome}"},
        "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": [{"test": "has_biome_tag", "operator": "==", "value": "nether"}]},
        "distribution": {"iterations": veios, "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                         "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [y0, y1]}}}})

# 1.27.0 (Tinkers completo, parte 2): as ilhas de slime (tools/importar-slime-tc3.py fez as estruturas, 5 formatos por
# tipo) e os geodos de slime (worldgen do TC3). Ilhas: céu e terra no céu do deserto, sangue no mar de lava do Nether,
# ender no End; raras como no mod (uma a cada 35×35 chunks, metade das vezes).
ILHAS = json.loads((RAIZ / "tools/dados/ilhas_slime.json").read_text(encoding="utf-8"))
for tipo, pt, filtro, y0, y1, chance_ in (("sky", "ceu", FILTRO, 100, 116, 0.0007), ("earth", "terra", FILTRO, 76, 90, 0.0005),
                                           ("blood", "sangue", [{"test": "has_biome_tag", "operator": "==", "value": "nether"}], 29, 30, 0.002),
                                           ("ender", "ender", [{"test": "has_biome_tag", "operator": "==", "value": "the_end"}], 58, 74, 0.003)):
    nomes = []
    for il in ILHAS[tipo]:
        escrever(f"BP/features/{il['nome']}.json", {"format_version": "1.13.0", "minecraft:structure_template_feature": {
            "description": {"identifier": f"cl:{il['nome']}"}, "structure_name": f"cl:{il['nome']}", "adjustment_radius": 0,
            "facing_direction": "random", "constraints": {"block_intersection": {"block_allowlist": ["minecraft:air", "minecraft:lava", "minecraft:flowing_lava"]}}}})
        nomes.append(il["nome"])
    escrever(f"BP/features/ilha_slime_{pt}.json", {"format_version": "1.13.0", "minecraft:weighted_random_feature": {
        "description": {"identifier": f"cl:ilha_slime_{pt}"}, "features": [[f"cl:{n}", 1] for n in nomes]}})
    escrever(f"BP/feature_rules/ilha_slime_{pt}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:ilha_slime_{pt}_regra", "places_feature": f"cl:ilha_slime_{pt}"},
        "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": filtro},
        "distribution": {"iterations": 1, "scatter_chance": chance(chance_), "coordinate_eval_order": "xzy",
                         "x": {"distribution": "uniform", "extent": [0, 16]}, "z": {"distribution": "uniform", "extent": [0, 16]},
                         "y": {"distribution": "uniform", "extent": [y0, y1]}}}})
for t, fora, filtro, y0, y1, raridade, raio in (("terra", "minecraft:clay", FILTRO, -58, -10, 256, 9), ("ceu", "minecraft:mossy_cobblestone", FILTRO, -40, 30, 128, 7),
                                               ("icor", "minecraft:netherrack", [{"test": "has_biome_tag", "operator": "==", "value": "nether"}], 80, 112, 52, 6),
                                               ("ender", "minecraft:end_stone", [{"test": "has_biome_tag", "operator": "==", "value": "the_end"}], 16, 64, 256, 10)):
    escrever(f"BP/features/geodo_slime_{t}.json", {"format_version": "1.13.0", "minecraft:geode_feature": {
        "description": {"identifier": f"cl:geodo_slime_{t}"}, "filler": "minecraft:air", "inner_layer": f"cl:bloco_cristal_slime_{t}",
        "alternate_inner_layer": f"cl:cristal_slime_brotando_{t}", "middle_layer": "minecraft:calcite", "outer_layer": fora,
        "inner_placements": [f"cl:cacho_cristal_slime_{t}"], "min_outer_wall_distance": 4, "max_outer_wall_distance": raio,
        "min_distribution_points": 3, "max_distribution_points": 4, "min_point_offset": 1, "max_point_offset": 2, "max_radius": 16,
        "crack_point_offset": 2.0, "generate_crack_chance": 0.0, "base_crack_size": 2.0, "noise_multiplier": 0.05,
        "use_potential_placements_chance": 0.35, "use_alternate_layer0_chance": 0.083, "placements_require_layer0_alternate": True,
        "invalid_blocks_threshold": 1}})
    escrever(f"BP/feature_rules/geodo_slime_{t}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:geodo_slime_{t}_regra", "places_feature": f"cl:geodo_slime_{t}"},
        "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": filtro},
        "distribution": {"iterations": 1, "scatter_chance": chance(1 / raridade), "coordinate_eval_order": "xzy",
                         "x": {"distribution": "uniform", "extent": [0, 16]}, "z": {"distribution": "uniform", "extent": [0, 16]},
                         "y": {"distribution": "uniform", "extent": [y0, y1]}}}})

# 1.37.0 (Quark 4.1): cristais de Corindo nas paredes das cavernas (com aglomerados em cima), a Caixa de Monstros no chão
# das cavernas fundas (MonsterBoxModule: 20% dos chunks, y -50 a 0, procurando 15 blocos para cima e para baixo) e os
# veios de jaspe (deserto e mesa) e xisto (frio) do NewStoneTypes.
PEDRAS_CAVERNA = ["minecraft:stone", "minecraft:deepslate", "minecraft:tuff", "minecraft:andesite", "minecraft:diorite", "minecraft:granite", "minecraft:cobblestone"]
CORES_CORINDO = ["vermelho", "laranja", "amarelo", "verde", "azul", "anil", "violeta", "branco", "preto"]  # f56.mjs
SUBTERRANEO = [{"test": "has_biome_tag", "operator": "==", "value": "overworld"}]
for cor in CORES_CORINDO:
    escrever(f"BP/features/qk_corindo_{cor}.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
        "description": {"identifier": f"cl:qk_corindo_{cor}"}, "places_block": f"cl:corindo_{cor}", "enforce_placement_rules": False, "enforce_survivability_rules": False,
        "may_attach_to": {"min_sides_must_attach": 1, "sides": PEDRAS_CAVERNA, "top": PEDRAS_CAVERNA, "bottom": PEDRAS_CAVERNA}, "may_replace": ["minecraft:air"]}})
    escrever(f"BP/features/qk_aglomerado_{cor}.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
        "description": {"identifier": f"cl:qk_aglomerado_{cor}"}, "places_block": f"cl:aglomerado_corindo_{cor}", "enforce_placement_rules": False, "enforce_survivability_rules": False,
        "may_attach_to": {"bottom": [f"cl:corindo_{cor}"]}, "may_replace": ["minecraft:air"]}})
    escrever(f"BP/features/qk_cristais_{cor}.json", {"format_version": "1.13.0", "minecraft:aggregate_feature": {
        "description": {"identifier": f"cl:qk_cristais_{cor}"}, "features": [f"cl:qk_cristais_{cor}_blocos", f"cl:qk_cristais_{cor}_cachos"]}})
    for parte, alvo, n in (("blocos", f"cl:qk_corindo_{cor}", 48), ("cachos", f"cl:qk_aglomerado_{cor}", 32)):
        escrever(f"BP/features/qk_cristais_{cor}_{parte}.json", {"format_version": "1.13.0", "minecraft:scatter_feature": {
            "description": {"identifier": f"cl:qk_cristais_{cor}_{parte}"}, "places_feature": alvo, "iterations": n, "coordinate_eval_order": "xzy",
            "x": {"distribution": "uniform", "extent": [-4, 4]}, "y": {"distribution": "uniform", "extent": [-4, 4]}, "z": {"distribution": "uniform", "extent": [-4, 4]}}})
    escrever(f"BP/feature_rules/qk_cristais_{cor}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:qk_cristais_{cor}_regra", "places_feature": f"cl:qk_cristais_{cor}"},
        "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": SUBTERRANEO},
        "distribution": {"iterations": 1, "scatter_chance": chance(1 / 12), "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                         "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [-40, 30]}}}})
escrever("BP/features/qk_caixa_monstros.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
    "description": {"identifier": "cl:qk_caixa_monstros"}, "places_block": "cl:caixa_monstros", "enforce_placement_rules": False, "enforce_survivability_rules": False,
    "may_attach_to": {"bottom": PEDRAS_CAVERNA + ["minecraft:gravel", "minecraft:dirt"]}, "may_replace": ["minecraft:air"]}})
escrever("BP/features/qk_caixa_monstros_busca.json", {"format_version": "1.13.0", "minecraft:search_feature": {
    "description": {"identifier": "cl:qk_caixa_monstros_busca"}, "places_feature": "cl:qk_caixa_monstros",
    "search_volume": {"min": [0, -15, 0], "max": [0, 15, 0]}, "search_axis": "-y", "required_successes": 1}})
escrever("BP/feature_rules/qk_caixa_monstros_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
    "description": {"identifier": "cl:qk_caixa_monstros_regra", "places_feature": "cl:qk_caixa_monstros_busca"},
    "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": SUBTERRANEO},
    "distribution": {"iterations": 1, "scatter_chance": chance(0.2), "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                     "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [-50, 0]}}}})
for pedra, filtro in (("jaspe", [{"any_of": [{"test": "has_biome_tag", "operator": "==", "value": "desert"}, {"test": "has_biome_tag", "operator": "==", "value": "mesa"}]}]),
                      ("xisto", [{"test": "has_biome_tag", "operator": "==", "value": "cold"}])):
    escrever(f"BP/features/qk_veio_{pedra}.json", {"format_version": "1.13.0", "minecraft:ore_feature": {
        "description": {"identifier": f"cl:qk_veio_{pedra}"}, "count": 48,
        "replace_rules": [{"places_block": f"cl:{pedra}", "may_replace": ["minecraft:stone", "minecraft:andesite", "minecraft:diorite", "minecraft:granite"]}]}})
    escrever(f"BP/feature_rules/qk_veio_{pedra}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:qk_veio_{pedra}_regra", "places_feature": f"cl:qk_veio_{pedra}"},
        "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": filtro},
        "distribution": {"iterations": 1, "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                         "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [0, 64]}}}})

# 1.40.0 (Extra Utilities 2): a Orquídea Vermelha madura em cima do minério de redstone nas cavernas abaixo de y 16 e o
# Lírio Ender maduro no chão do End.
escrever("BP/features/xu2_orquidea.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
    "description": {"identifier": "cl:xu2_orquidea"}, "places_block": {"name": "cl:orquidea_planta", "states": {"cl:estagio": 6}},
    "enforce_placement_rules": False, "enforce_survivability_rules": False,
    "may_attach_to": {"bottom": ["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore"]}, "may_replace": ["minecraft:air"]}})
escrever("BP/features/xu2_orquidea_tufo.json", {"format_version": "1.13.0", "minecraft:scatter_feature": {
    "description": {"identifier": "cl:xu2_orquidea_tufo"}, "places_feature": "cl:xu2_orquidea", "iterations": 48, "coordinate_eval_order": "xzy",
    "x": {"distribution": "uniform", "extent": [-6, 6]}, "y": {"distribution": "uniform", "extent": [-6, 6]}, "z": {"distribution": "uniform", "extent": [-6, 6]}}})
escrever("BP/feature_rules/xu2_orquidea_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
    "description": {"identifier": "cl:xu2_orquidea_regra", "places_feature": "cl:xu2_orquidea_tufo"},
    "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": [{"test": "has_biome_tag", "operator": "==", "value": "overworld"}]},
    "distribution": {"iterations": 2, "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                     "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [-58, 16]}}}})
escrever("BP/features/xu2_lirio.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
    "description": {"identifier": "cl:xu2_lirio"}, "places_block": {"name": "cl:lirio_ender_planta", "states": {"cl:estagio": 7}},
    "enforce_placement_rules": False, "enforce_survivability_rules": False,
    "may_attach_to": {"bottom": ["minecraft:end_stone"]}, "may_replace": ["minecraft:air"]}})
escrever("BP/feature_rules/xu2_lirio_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
    "description": {"identifier": "cl:xu2_lirio_regra", "places_feature": "cl:xu2_lirio"},
    "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": [{"test": "has_biome_tag", "operator": "==", "value": "the_end"}]},
    "distribution": {"iterations": 1, "scatter_chance": chance(1 / 8), "x": {"distribution": "uniform", "extent": [0, 16]},
                     "y": "query.heightmap(variable.worldx, variable.worldz)", "z": {"distribution": "uniform", "extent": [0, 16]}}}})

# 1.49.0 (Mekanism completo, parte 1): minério de fluorita com os números do mod (OreType.FLUORITE): 5 veios de até 5
# em toda a altura abaixo de y 23 e 3 de até 13 perto do fundo (y -64 a 4), trocando pedra (ou ardósia: o profundo).
for nome, tam, veios, y0, y1 in (("fluorita", 5, 5, -64, 23), ("fluorita_funda", 13, 3, -64, 4)):
    escrever(f"BP/features/mk_veio_{nome}.json", {"format_version": "1.13.0", "minecraft:ore_feature": {
        "description": {"identifier": f"cl:mk_veio_{nome}"}, "count": tam,
        "replace_rules": [{"places_block": "cl:minerio_fluorita", "may_replace": ["minecraft:stone", "minecraft:andesite", "minecraft:diorite", "minecraft:granite"]},
                          {"places_block": "cl:minerio_fluorita_profundo", "may_replace": ["minecraft:deepslate", "minecraft:tuff"]}]}})
    escrever(f"BP/feature_rules/mk_veio_{nome}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:mk_veio_{nome}_regra", "places_feature": f"cl:mk_veio_{nome}"},
        "conditions": {"placement_pass": "underground_pass", "minecraft:biome_filter": [{"test": "has_biome_tag", "operator": "==", "value": "overworld"}]},
        "distribution": {"iterations": veios, "coordinate_eval_order": "xzy", "x": {"distribution": "uniform", "extent": [0, 16]},
                         "z": {"distribution": "uniform", "extent": [0, 16]}, "y": {"distribution": "uniform", "extent": [y0, y1]}}}})

# 1.47.0 (Pam's HarvestCraft 2): as 6 hortas silvestres (cada uma no seu tipo de bioma: 1 em 20 chunks, 32 tentativas
# espalhadas ±6 e ±2 na altura) e as árvores frutíferas (cada árvore 1 em 90 chunks na floresta do seu grupo; os frutos
# ficam pendurados embaixo das folhas).
HC2 = json.loads((RAIZ / "tools/dados/hc2.json").read_text(encoding="utf-8"))
CHAO_HORTA = ["minecraft:grass_block", "minecraft:dirt", "minecraft:coarse_dirt", "minecraft:podzol", "minecraft:sand", "minecraft:red_sand", "minecraft:mud", "minecraft:moss_block"]
tag = lambda v, op="==": {"test": "has_biome_tag", "operator": op, "value": v}
for h in HC2["hortas"]:
    escrever(f"BP/features/hc2_{h['id']}.json", {"format_version": "1.13.0", "minecraft:single_block_feature": {
        "description": {"identifier": f"cl:hc2_{h['id']}"}, "places_block": f"cl:{h['id']}", "enforce_placement_rules": False,
        "enforce_survivability_rules": False, "may_attach_to": {"bottom": CHAO_HORTA}, "may_replace": ["minecraft:air", "minecraft:short_grass"]}})
    escrever(f"BP/features/hc2_{h['id']}_tufo.json", {"format_version": "1.13.0", "minecraft:scatter_feature": {
        "description": {"identifier": f"cl:hc2_{h['id']}_tufo"}, "places_feature": f"cl:hc2_{h['id']}", "iterations": h["tentativas"],
        "coordinate_eval_order": "xzy", "x": {"distribution": "gaussian", "extent": [-h["espalha"], h["espalha"]]},
        "z": {"distribution": "gaussian", "extent": [-h["espalha"], h["espalha"]]}, "y": {"distribution": "uniform", "extent": [-h["altura"], h["altura"]]}}})
    escrever(f"BP/feature_rules/hc2_{h['id']}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:hc2_{h['id']}_regra", "places_feature": f"cl:hc2_{h['id']}_tufo"},
        "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": [{"any_of": [tag(b) for b in h["biomas"]]}]},
        "distribution": {"iterations": 1, "scatter_chance": {"numerator": 1, "denominator": h["raridade"]}, "x": {"distribution": "uniform", "extent": [0, 16]},
                         "y": ALTURA, "z": {"distribution": "uniform", "extent": [0, 16]}}}})
FOLHAS = sorted({a["folha"] for a in HC2["arvores"]})
grupos = {}
for a in HC2["arvores"]:
    base, ra, rb = a["altura"]
    escrever(f"BP/features/hc2_arvore_{a['id']}.json", {"format_version": "1.13.0", "minecraft:tree_feature": {
        "description": {"identifier": f"cl:hc2_arvore_{a['id']}"},
        "base_block": ["minecraft:dirt"],
        "may_grow_on": ["minecraft:dirt", "minecraft:grass_block", "minecraft:podzol", "minecraft:coarse_dirt", "minecraft:rooted_dirt", "minecraft:moss_block"],
        "may_replace": ["minecraft:air", "minecraft:short_grass", "minecraft:vine", *FOLHAS],
        "may_grow_through": ["minecraft:dirt", "minecraft:grass_block", "minecraft:short_grass"],
        "trunk": {"trunk_height": {"range_min": base, "range_max": base + ra + rb + 1}, "trunk_block": a["tronco"]},
        "canopy": {"canopy_offset": {"min": -3, "max": 0}, "min_width": 0, "canopy_slope": {"rise": 1, "run": 2},
                   "variation_chance": [{"numerator": 1, "denominator": 2}, {"numerator": 1, "denominator": 2}, {"numerator": 1, "denominator": 2}, {"numerator": 1, "denominator": 1}],
                   "leaf_block": a["folha"],
                   "canopy_decoration": {"decoration_chance": {"numerator": 1, "denominator": 4}, "decoration_block": f"cl:fruto_{a['id']}",
                                         "num_steps": 1, "step_direction": "down"}}}})
    grupos.setdefault(a["grupo"], []).append(a)
FILTRO_ARV = {"temperada": [tag("forest"), tag("taiga", "!="), tag("cold", "!="), tag("jungle", "!="), tag("swamp", "!=")],
              "quente": [{"any_of": [{"all_of": [tag("forest"), tag("taiga", "!="), tag("cold", "!=")]}, tag("jungle")]}],
              "conifera": [tag("taiga")]}
for g, lista in grupos.items():
    escrever(f"BP/features/hc2_arvores_{g}.json", {"format_version": "1.13.0", "minecraft:weighted_random_feature": {
        "description": {"identifier": f"cl:hc2_arvores_{g}"}, "features": [[f"cl:hc2_arvore_{a['id']}", 1] for a in lista]}})
    escrever(f"BP/feature_rules/hc2_arvores_{g}_regra.json", {"format_version": "1.13.0", "minecraft:feature_rules": {
        "description": {"identifier": f"cl:hc2_arvores_{g}_regra", "places_feature": f"cl:hc2_arvores_{g}"},
        "conditions": {"placement_pass": "surface_pass", "minecraft:biome_filter": FILTRO_ARV[g]},
        "distribution": {"iterations": 1, "scatter_chance": {"numerator": len(lista), "denominator": lista[0]["raridade"]},
                         "x": {"distribution": "uniform", "extent": [0, 16]}, "y": ALTURA, "z": {"distribution": "uniform", "extent": [0, 16]}}}})

print(f"geração natural: {len(list((RAIZ / 'BP/features').iterdir()))} features, 3 tabelas de saque, templo e destroços com baú")

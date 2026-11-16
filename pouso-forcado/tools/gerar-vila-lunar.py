#!/usr/bin/env python3
"""Vila Lunar e Ruínas Lunares do Galacticraft 5 (Team Galacticraft, licença MIT, inclusive a arte), montadas fora do
jogo (1.55.0), do mesmo jeito que o templo do YUNG's (tools/gerar-templo-yung.py, de onde vêm o montador e o conversor).

Vila (data/galacticraft/worldgen/structure/moon_village.json): jigsaw a partir de village/moon/highlands/starts, até a
profundidade 6 e 80 blocos do centro. As peças do mod (ruas de terra lunar, casas de Decoração de Estanho com vidro,
estufa com mudas, postes com tocha e o centro com sino) saem em pedaços de 64x64 em
BP/structures/cl/vila_lua_<v>_<i>_<k>.mcstructure; os aldeões e o golem viram posições em
scripts/galacticraft/vila_lua_dados.ts (o script põe o Aldeão Lunar, cl:aldeao_lunar, no lugar do aldeão do mod).
Ruínas (MoonRuinsGenerator do mod): a peça do centro e mais 4 a 8 em volta (ruin_3 a ruin_6), cada uma três vezes,
com 80 %, 70 % e 65 % dos blocos (o BlockRotProcessor), viradas ao acaso; cada peça é uma estrutura pequena que o
script põe na altura do chão de onde ela cai. Os marcadores "chest" viram baús com a tabela cl_ruinas_lua.
Também copia a textura da Decoração de Estanho e a do Aldeão Lunar (base + roupa do planalto lunar).
  python3 tools/gerar-vila-lunar.py <clone do Galacticraft 5>
"""
import importlib.util
import json
import os
import random
import shutil
import sys
import tempfile
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
GC5 = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/gerar-vila-lunar.py <clone do Galacticraft 5>"))

# O montador e o conversor do templo do YUNG's (o script só define funções; o main dele não roda no import).
_argv = sys.argv
sys.argv = ["gerar-templo-yung.py", "/nao/usado"]
_spec = importlib.util.spec_from_file_location("templo_yung", RAIZ / "tools/gerar-templo-yung.py")
Y = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(Y)
sys.argv = _argv
N = Y.N

# As peças ficam em src/main/resources e os pools (gerados) em src/main/generated: uma pasta com os dois.
_tmp = Path(tempfile.mkdtemp())
os.symlink(GC5 / "src/main/resources/data/galacticraft/structure", _tmp / "structure")
os.symlink(GC5 / "src/main/generated/data/galacticraft/worldgen", _tmp / "worldgen")
Y.DADOS = _tmp

VARIANTES = 4
PROFUNDIDADE = 6
DIST_MAX = 80
TILE = 64

# ---------- Blocos do Galacticraft -> pack (o resto passa pelo conversor do templo) ----------
GC = {
    "galacticraft:moon_dirt": ("cl:terra_lunar", {}),
    "galacticraft:moon_turf": ("cl:solo_lunar", {}),
    "galacticraft:moon_rock": ("cl:rocha_lunar", {}),
    "galacticraft:moon_basalt": ("cl:basalto_lunar", {}),
    "galacticraft:tin_decoration": ("cl:decoracao_estanho", {}),
    "galacticraft:detailed_tin_decoration": ("cl:decoracao_estanho_detalhada", {}),
}
PULAR = ("", {})
# Lajes, escadas e muros de estanho e de basalto: os do jogo com a cor mais parecida.
PARECIDO = {"tin_decoration": "polished_andesite", "detailed_tin_decoration": "polished_andesite", "moon_basalt": "polished_blackstone"}


def converter(nome, props):
    if nome in GC:
        return GC[nome]
    if nome in ("galacticraft:glowstone_wall_torch", "galacticraft:glowstone_torch"):
        nome = "minecraft:wall_torch" if "wall" in nome else "minecraft:torch"
    elif nome.startswith("galacticraft:"):
        n = nome.split(":")[1]
        for base, troca in PARECIDO.items():
            for fim in ("_slab", "_stairs", "_wall"):
                if n == base + fim:
                    if troca == "polished_andesite" and fim == "_wall":
                        nome = "minecraft:andesite_wall"
                    else:
                        nome = f"minecraft:{troca}{fim}"
    if nome in ("minecraft:structure_block", "minecraft:structure_void", "minecraft:jigsaw"):
        return PULAR
    if nome == "minecraft:bell":
        att = {"floor": "standing", "ceiling": "hanging", "single_wall": "side", "double_wall": "multiple"}.get(props.get("attachment", "floor"), "standing")
        return ("minecraft:bell", {"attachment": att, "direction": Y.GANCHO.get(props.get("facing", "north"), 0), "toggle_bit": False})
    if nome == "minecraft:glass":
        return ("minecraft:glass", {})
    if nome == "minecraft:glowstone":
        return ("minecraft:glowstone", {})
    if nome == "minecraft:prismarine":
        return ("minecraft:prismarine", {})
    if nome == "minecraft:cobweb":
        return ("minecraft:web", {})
    if nome == "minecraft:gray_carpet":
        return ("minecraft:gray_carpet", {})
    if nome.endswith("_sapling"):
        return (nome, {"age_bit": False})
    if nome == "minecraft:dead_bush":
        return ("minecraft:deadbush", {})
    if nome == "minecraft:dirt":
        return ("minecraft:dirt", {})
    return Y.bedrock(nome, props)


# ---------- Vila ----------
def montar_vila(semente):
    """O mesmo laço do templo (Y.montar), com o início, a profundidade e a distância da vila do mod."""
    Y.PROFUNDIDADE = PROFUNDIDADE
    Y.DIST_MAX = DIST_MAX
    rnd = random.Random(semente)
    inicio_pool = Y.pool("galacticraft:village/moon/highlands/starts")
    bolsa = [e for w, e in inicio_pool["el"] for _ in range(w) if e]
    inicio = rnd.choice(bolsa)["loc"]
    r0 = rnd.randrange(4)
    sx, sy, sz = Y.peca(inicio)["tam"]
    c = Y.girar_pos((sx // 2, 0, sz // 2), r0)
    desl = (-c[0], 0, -c[2])
    # Reaproveita o laço do templo trocando a peça de início (ele procura pelo "temple_anchor" só para o início).
    colocadas = [{"loc": inicio, "r": r0, "desl": desl, "caixa": Y.caixa(inicio, r0, desl), "pai": None}]
    fila = [(inicio, r0, desl, 0, None)]
    contagem = {}
    while fila:
        loc, r, d, prof, _ = fila.pop(0)
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
                        # Entrada de casa dentro do lote da rua (16x16, 2 de altura): a casa tem de caber no lote só na
                        # horizontal (no jogo, o espaço livre das peças que seguem o terreno sobe até o céu).
                        if interno and not (cx[0] >= eu["caixa"][0] and cx[2] >= eu["caixa"][2] and cx[3] <= eu["caixa"][3] and cx[5] <= eu["caixa"][5]):
                            continue
                        if any(Y.cruza(cx, x["caixa"]) for x in colocadas if not (x is eu and interno)):
                            continue
                        colocadas.append({"loc": e["loc"], "r": rc, "desl": d2, "caixa": cx, "pai": eu})
                        contagem[e["loc"]] = contagem.get(e["loc"], 0) + 1
                        fila.append((e["loc"], rc, d2, prof + 1, eu))
                        feito = True
                        break
                    if feito:
                        break
                if feito:
                    break
    return colocadas


def compor_vila(colocadas):
    mundo, ents = {}, []
    for c in colocadas:
        pc = Y.peca(c["loc"])
        r, d = c["r"], c["desl"]
        for pos, nome, props, nb in pc["blocos"]:
            if nome == "minecraft:structure_void":
                continue
            gp = Y.girar_pos(pos, r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            # Ar das peças altas (casas) não apaga o que outra peça já pôs (as ruas têm 2 de altura).
            if nome == "minecraft:air" and g in mundo:
                continue
            mundo[g] = (nome, Y.girar_estado(nome, props, r))
        for j in pc["jigs"]:
            gp = Y.girar_pos(j["pos"], r)
            g = (gp[0] + d[0], gp[1] + d[1], gp[2] + d[2])
            fs = j["final"]
            nome = fs.split("[")[0]
            if nome != "minecraft:structure_void":
                props = dict(kv.split("=") for kv in fs.split("[")[1].rstrip("]").split(",")) if "[" in fs else {}
                mundo[g] = (nome, Y.girar_estado(nome, props, r))
        for (bx, by, bz), eid in pc["ents"]:
            gp = Y.girar_pos((int(bx), int(by), int(bz)), r)
            tipo = {"minecraft:villager": "aldeao", "minecraft:iron_golem": "golem"}.get(eid)
            if tipo:
                ents.append([tipo, gp[0] + d[0], gp[1] + d[1], gp[2] + d[2]])
    final, faltou = {}, {}
    for g in sorted(mundo):
        nome, props = mundo[g]
        bb = converter(nome, props)
        if bb is PULAR:
            continue
        if bb is None:
            faltou[nome] = faltou.get(nome, 0) + 1
            continue
        final[g] = (bb, None)
    return final, ents, faltou


def salvar_tiles(final, prefixo):
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
            salvar(sub, min(TILE, X - i * TILE), Yh, min(TILE, Z - k * TILE), RAIZ / f"BP/structures/cl/{prefixo}_{i}_{k}.mcstructure")
            tiles.append([i, k])
    return (x0, y0, z0), (X, Yh, Z), tiles


# ---------- Ruínas ----------
RUINAS = ["moon_ruins/ruin_3", "moon_ruins/ruin_4", "moon_ruins/ruin_5", "moon_ruins/ruin_6"]
INTEGRIDADE = (0.8, 0.7, 0.65)


def peca_ruina(rnd, loc, rot):
    """Três cópias da peça (com 80 %, 70 % e 65 % dos blocos), viradas iguais: o mesmo jeito do mod."""
    pc = Y.peca(f"galacticraft:{loc}")
    sx, sy, sz = pc["tam"]
    blocos, baus = {}, []
    for integ in INTEGRIDADE:
        escolha = rnd.choice(RUINAS)
        p2 = Y.peca(f"galacticraft:{escolha}")
        for pos, nome, props, nb in p2["blocos"]:
            if nome in ("minecraft:air", "minecraft:structure_void"):
                continue
            g = Y.girar_pos(pos, rot)
            if nome == "minecraft:structure_block":
                if nb and nb.get("metadata") == "chest" and rnd.random() < integ and g not in baus:
                    baus.append(g)
                continue
            if rnd.random() >= integ:
                continue
            blocos[g] = (nome, Y.girar_estado(nome, props, rot))
    return blocos, baus


def ruina(semente):
    rnd = random.Random(semente)
    rot0 = rnd.randrange(4)
    pecas = []
    # Centro: canto em (0, 0); a peça de 16x16 ocupa até (15, 15) virada.
    pecas.append(((0, 0), rot0))
    lista = [(-16 + rnd.randint(1, 8), 16 + rnd.randint(1, 7)), (-16 + rnd.randint(1, 8), rnd.randint(1, 7)),
             (-16 + rnd.randint(1, 8), -16 + rnd.randint(4, 8)), (rnd.randint(1, 7), 16 + rnd.randint(1, 7)),
             (rnd.randint(1, 7), -16 + rnd.randint(4, 6)), (16 + rnd.randint(1, 7), 16 + rnd.randint(3, 8)),
             (16 + rnd.randint(1, 7), rnd.randint(1, 7)), (16 + rnd.randint(1, 7), -16 + rnd.randint(4, 8))]
    for _ in range(rnd.randint(4, 8)):
        if not lista:
            break
        p = lista.pop(rnd.randrange(len(lista)))
        if 0 <= p[0] <= 15 and 0 <= p[1] <= 15:
            continue  # não cai em cima do centro
        pecas.append((p, rnd.randrange(4)))
    saida = []
    for n, ((px, pz), rot) in enumerate(pecas):
        blocos, baus = peca_ruina(rnd, RUINAS[0], rot)
        if not blocos:
            continue
        xs = [b[0] for b in blocos]; ys = [b[1] for b in blocos]; zs = [b[2] for b in blocos]
        x0, y0, z0 = min(xs), min(ys), min(zs)
        final = {}
        for g, (nome, props) in blocos.items():
            bb = converter(nome, props)
            if bb and bb is not PULAR:
                final[(g[0] - x0, g[1] - y0, g[2] - z0)] = (bb, None)
        for g in baus:
            final[(g[0] - x0, g[1] - y0, g[2] - z0)] = (("minecraft:chest", {"minecraft:cardinal_direction": "north"}), None)
        saida.append({"x": px + x0, "z": pz + z0, "y": y0, "blocos": final, "baus": [[g[0] - x0, g[1] - y0, g[2] - z0] for g in baus]})
    return saida


def salvar(blocos, X, Yh, Z, caminho, saque="loot_tables/chests/cl_ruinas_lua.json"):
    """O salvar_tile do templo, com a tabela de saque dos baús escolhida (lá ela é a da pirâmide)."""
    paleta, indices, camada, dados_pos = [], {}, [], {}
    for x in range(X):
        for y in range(Yh):
            for z in range(Z):
                v = blocos.get((x, y, z))
                if v is None:
                    camada.append(-1)
                    continue
                (nome, st), _ = v
                chave = json.dumps([nome, st], sort_keys=True)
                if chave not in indices:
                    indices[chave] = len(paleta)
                    paleta.append(Y.bloco_tag(nome, st))
                k = len(camada)
                camada.append(indices[chave])
                if nome == "minecraft:chest":
                    dados_pos[str(k)] = N.comp({"block_entity_data": N.comp({
                        "id": N.string("Chest"), "LootTable": N.string(saque), "LootTableSeed": N.int_(0), "Items": N.lista(10, []),
                        "isMovable": N.byte(1), "x": N.int_(x), "y": N.int_(y), "z": N.int_(z)})})
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


def salvar_ruina(final, caminho):
    xs = [p[0] for p in final]; ys = [p[1] for p in final]; zs = [p[2] for p in final]
    tam = (max(xs) + 1, max(ys) + 1, max(zs) + 1)
    salvar(final, *tam, caminho)
    return tam


def main():
    saida = {"vilas": [], "ruinas": []}
    for v in range(VARIANTES):
        melhor = None
        for t in range(16):
            col = montar_vila(5000 + 100 * v + t)
            casas = sum(1 for c in col if "/houses/" in c["loc"])
            nota = len(col) + 4 * casas
            if melhor is None or nota > melhor[0]:
                melhor = (nota, col, 5000 + 100 * v + t)
        _, col, semente = melhor
        final, ents, faltou = compor_vila(col)
        (x0, y0, z0), tam, tiles = salvar_tiles(final, f"vila_lua_{v}")
        rel = lambda e: [e[0], e[1] - x0, e[2] - y0, e[3] - z0]
        # O chão da vila (onde as ruas pisam) em relação ao canto de baixo da estrutura.
        saida["vilas"].append({"tam": list(tam), "tiles": tiles, "centro": [-x0, -y0, -z0], "ents": [rel(e) for e in ents],
                               "casas": sum(1 for c in col if "/houses/" in c["loc"]), "pecas": len(col)})
        print(f"vila {v}: semente {semente}, {len(col)} peças ({saida['vilas'][-1]['casas']} casas), {tam[0]}x{tam[1]}x{tam[2]}, "
              f"{len(tiles)} pedaços, {sum(1 for e in ents if e[0] == 'aldeao')} aldeões, {sum(1 for e in ents if e[0] == 'golem')} golem; sem conversão: {faltou}")
    for v in range(3):
        pecas = ruina(9000 + v)
        lista = []
        for n, p in enumerate(pecas):
            tam = salvar_ruina(p["blocos"], RAIZ / f"BP/structures/cl/ruina_lua_{v}_{n}.mcstructure")
            lista.append({"x": p["x"], "z": p["z"], "tam": list(tam), "baus": p["baus"]})
        saida["ruinas"].append(lista)
        print(f"ruína {v}: {len(lista)} peças, {sum(len(p['baus']) for p in lista)} baús")
    (RAIZ / "scripts/galacticraft/vila_lua_dados.ts").write_text(
        "// Gerado por tools/gerar-vila-lunar.py: os pedaços e as posições de cada vila e ruína do Galacticraft 5.\n"
        f"export const VILA_LUA = {json.dumps(saida)} as const;\n", encoding="utf-8")
    # Texturas (arte do GC5, MIT): Decoração de Estanho e o Aldeão Lunar (base + roupa do planalto lunar por cima).
    T = GC5 / "src/main/resources/assets/galacticraft/textures"
    B = RAIZ / "RP/textures/blocks/cl/arte"
    shutil.copy(T / "block/tin_decoration.png", B / "decoracao_estanho.png")
    # O cubo de 4 faces do pack (frente, lado, topo e baixo): os lados e o topo/baixo do mod.
    for f, rel in (("frente", "side"), ("lado", "side"), ("topo", "top"), ("baixo", "top")):
        shutil.copy(T / f"block/detailed_tin_decoration_{rel}.png", B / f"decoracao_estanho_detalhada_{f}.png")
    base = Image.open(T / "entity/villager/moon_villager.png").convert("RGBA")
    roupa = Image.open(T / "entity/villager/type/moon_highlands.png").convert("RGBA")
    base.alpha_composite(roupa)
    (RAIZ / "RP/textures/entity/cl").mkdir(parents=True, exist_ok=True)
    base.save(RAIZ / "RP/textures/entity/cl/aldeao_lunar.png")
    shutil.rmtree(_tmp, ignore_errors=True)


if __name__ == "__main__":
    main()

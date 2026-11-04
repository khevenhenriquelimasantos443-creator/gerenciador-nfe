# 1.37.0: arte e modelos do Quark 4.1 (Vazkii e equipe; arte CC BY-NC-SA 3.0, como na 1.12.0) para a fase 56.
# - Texturas dos blocos e itens novos (RP/textures/blocks/cl/arte e RP/textures/items/cl/arte).
# - Modelos de bloco do mod (JSON do Java, com "from/to" e o UV de cada face) viram geometria do Bedrock
#   (RP/models/blocks/cl_q_<modelo>.geo.json): banquinho, batatinha, calha, cocho, barra de ferro, barras de ouro,
#   tora oca e poste. As toras ocas e os postes usam as texturas das madeiras do próprio jogo (clv_* no terrain_texture).
# - tools/dados/quark4.json: para cada bloco, a geometria, os materiais e a caixa (a fase 56 lê).
# Uso: python3 tools/importar-quark4.py <clone do Quark (branch master, 4.1)>
import json, re, shutil, subprocess, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
Q = Path(sys.argv[1]) if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-quark4.py <clone do Quark>")
TEX = Q / "src/main/resources/assets/quark/textures"
ARTE_B = RAIZ / "RP/textures/blocks/cl/arte"
ARTE_I = RAIZ / "RP/textures/items/cl/arte"
usados = []


def png(rel):
    im = Image.open(TEX / rel).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im  # animação: 1º quadro


def bloco(destino, rel):
    png(rel).save(ARTE_B / f"{destino}.png")
    usados.append(destino)


def item(destino, rel):
    png(rel).save(ARTE_I / f"{destino}.png")
    usados.append(destino)


def modelo_java(nome):
    """Modelo do Quark (com os pais do próprio mod resolvidos); para nos pais do jogo."""
    txt = subprocess.run(["git", "-C", str(Q), "show", f"origin/master:src/main/resources/assets/quark/models/{nome}.json"],
                         capture_output=True, check=True).stdout.decode("utf-8-sig")
    d = json.loads(re.sub(r",(\s*[}\]])", r"\1", txt))
    pai = d.get("parent", "")
    if pai.startswith("quark:"):
        base = modelo_java(pai[6:])
        base["textures"] = {**base.get("textures", {}), **d.get("textures", {})}
        if "elements" in d:
            base["elements"] = d["elements"]
        return base
    return d


def uv_padrao(face, f, t):
    return {"north": [16 - t[0], 16 - t[1], 16 - f[0], 16 - f[1]], "south": [f[0], 16 - t[1], t[0], 16 - f[1]],
            "west": [f[2], 16 - t[1], t[2], 16 - f[1]], "east": [16 - t[2], 16 - t[1], 16 - f[2], 16 - f[1]],
            "up": [f[0], f[2], t[0], t[2]], "down": [f[0], 16 - t[2], t[0], 16 - f[2]]}[face]


def geometria(nome, m):
    """Escreve geometry.cl.q_<nome>; devolve os nomes de material usados e a caixa que cobre o modelo."""
    cubos, mats = [], set()
    lo, hi = [16, 16, 16], [0, 0, 0]
    for e in m["elements"]:
        f, t = e["from"], e["to"]
        lo = [min(a, b) for a, b in zip(lo, f)]
        hi = [max(a, b) for a, b in zip(hi, t)]
        uv = {}
        for face, fd in e["faces"].items():
            u = fd.get("uv") or uv_padrao(face, f, t)
            mat = fd.get("texture", "#all").lstrip("#")
            mats.add(mat)
            if face in ("up", "down"):  # o Bedrock lê o UV de cima e de baixo virado
                uv[face] = {"uv": [u[2], u[3]], "uv_size": [u[0] - u[2], u[1] - u[3]], "material_instance": mat}
            else:
                uv[face] = {"uv": [u[0], u[1]], "uv_size": [u[2] - u[0], u[3] - u[1]], "material_instance": mat}
        cubos.append({"origin": [f[0] - 8, f[1], f[2] - 8], "size": [t[i] - f[i] for i in range(3)], "uv": uv})
    geo = {"format_version": "1.12.0", "minecraft:geometry": [{
        "description": {"identifier": f"geometry.cl.q_{nome}", "texture_width": 16, "texture_height": 16,
                        "visible_bounds_width": 2, "visible_bounds_height": 2, "visible_bounds_offset": [0, 0.5, 0]},
        "bones": [{"name": "q", "pivot": [0, 0, 0], "cubes": cubos}]}]}
    (RAIZ / f"RP/models/blocks/cl_q_{nome}.geo.json").write_text(json.dumps(geo, indent=1), encoding="utf-8")
    caixa = {"origin": [lo[0] - 8, lo[1], lo[2] - 8], "size": [max(1, hi[i] - lo[i]) for i in range(3)]}
    return sorted(mats), caixa


saida = {}


def registrar(i, nome, mats, caixa, render="alpha_test"):
    saida[i] = {"geometria": f"geometry.cl.q_{nome}", "caixa": caixa,
                "materiais": {k: {"texture": v, "render_method": render} for k, v in mats.items()}}


# ---------- Blocos inteiros ----------
B = "block/"
for i, a in (("tijolos_arenito", "sandstone_bricks"), ("tijolos_arenito_vermelho", "red_sandstone_bricks"),
             ("tijolos_arenito_almas", "soul_sandstone_bricks"), ("tijolos_ferro_bruto", "raw_iron_bricks"),
             ("tijolos_ouro_bruto", "raw_gold_bricks"), ("tijolos_cobre_bruto", "raw_copper_bricks"), ("caixa_monstros", "monster_box")):
    bloco(i, f"{B}{a}.png")
for i, lado in (("arenito_almas", "soul_sandstone"), ("arenito_almas_cortado", "cut_soul_sandstone"), ("arenito_almas_entalhado", "chiseled_soul_sandstone")):
    for face, a in (("frente", lado), ("lado", lado), ("topo", "soul_sandstone_top"), ("baixo", "soul_sandstone_bottom" if i == "arenito_almas" else "soul_sandstone_top")):
        bloco(f"{i}_{face}", f"{B}{a}.png")
CORES = [("vermelho", "red"), ("laranja", "orange"), ("amarelo", "yellow"), ("verde", "green"), ("azul", "blue"), ("anil", "indigo"),
         ("violeta", "violet"), ("branco", "white"), ("preto", "black")]
for pt, en in CORES:
    bloco(f"corindo_{pt}", f"{B}{en}_corundum.png")
    bloco(f"aglomerado_corindo_{pt}", f"{B}{en}_corundum_cluster.png")
    bloco(f"lampada_cristal_{pt}", f"{B}{en}_crystal_lamp.png")
    bloco(f"lampada_cristal_{pt}_acesa", f"{B}{en}_crystal_lamp_on.png")
# A nuvem do Quark não tem textura (é desenhada pelo jogo): uma nuvem branca própria.
nuvem = Image.new("RGBA", (16, 16))
for x in range(16):
    for y in range(16):
        borda = x in (0, 15) or y in (0, 15)
        nuvem.putpixel((x, y), (236, 241, 247, 230) if borda else (250, 252, 255, 205))
nuvem.save(ARTE_B / "nuvem.png")

# ---------- Modelos ----------
LAS = [("branco", "white"), ("laranja", "orange"), ("magenta", "magenta"), ("azul_claro", "light_blue"), ("amarelo", "yellow"), ("lima", "lime"),
       ("rosa", "pink"), ("cinza", "gray"), ("cinza_claro", "light_gray"), ("ciano", "cyan"), ("roxo", "purple"), ("azul", "blue"),
       ("marrom", "brown"), ("verde", "green"), ("vermelho", "red"), ("preto", "black")]
mats, caixa = geometria("banquinho", modelo_java("block/stool"))
for pt, en in LAS:
    bloco(f"banquinho_{pt}", f"{B}{en}_stool.png")
    registrar(f"banquinho_{pt}", "banquinho", {m: f"clc_banquinho_{pt}" for m in mats}, caixa)
mats, caixa = geometria("batatinha", modelo_java("tiny_potato/base"))
bloco("batatinha", f"{B}tiny_potato/default.png")
registrar("batatinha", "batatinha", {m: "clc_batatinha" for m in mats}, caixa)
mats, caixa = geometria("calha_itens", modelo_java("block/chute"))
for m in mats:
    bloco(f"calha_itens_q{m}", f"{B}chute_{m}.png")
registrar("calha_itens", "calha_itens", {m: f"clc_calha_itens_q{m}" for m in mats}, {"origin": [-8, 0, -8], "size": [16, 16, 16]})
mats, caixa = geometria("cocho", modelo_java("block/trough_empty"))
TROUGH = {"top": "trough_top", "bottom": "trough_bottom", "side": "trough_side", "inner": "trough_side_inner", "inside": "trough_bottom"}
for m in mats:
    bloco(f"cocho_q{m}", f"{B}{TROUGH[m]}.png")
registrar("cocho", "cocho", {m: f"clc_cocho_q{m}" for m in mats}, caixa)
mats, caixa = geometria("barra_ferro", modelo_java("block/iron_rod"))
bloco("barra_ferro_qiron_rod", f"{B}iron_rod.png")
registrar("barra_ferro", "barra_ferro", {m: "clc_barra_ferro_qiron_rod" for m in mats}, caixa)
mats, caixa = geometria("barras_ouro", modelo_java("block/gold_bars_post"))
bloco("barras_ouro_qbars", f"{B}gold_bars_but_its_actually_just_one.png")
registrar("barras_ouro", "barras_ouro", {m: "clc_barras_ouro_qbars" for m in mats}, {"origin": [-1, 0, -1], "size": [2, 16, 2]})
# Toras ocas e postes: texturas das madeiras do jogo (nomes do Bedrock).
MADEIRAS = [("carvalho", "oak", "log_oak", "stripped_oak_log"), ("pinheiro", "spruce", "log_spruce", "stripped_spruce_log"),
            ("betula", "birch", "log_birch", "stripped_birch_log"), ("selva", "jungle", "log_jungle", "stripped_jungle_log"),
            ("acacia", "acacia", "log_acacia", "stripped_acacia_log"), ("carvalho_escuro", "dark_oak", "log_big_oak", "stripped_dark_oak_log")]
ter_arq = RAIZ / "RP/textures/terrain_texture.json"
ter = json.loads(ter_arq.read_text(encoding="utf-8"))
for _, _, log, desc in MADEIRAS:
    for t in (log, f"{log}_top", desc):
        ter["texture_data"][f"clv_{t}"] = {"textures": f"textures/blocks/{t}"}
ter_arq.write_text(json.dumps(ter, ensure_ascii=False, indent=1), encoding="utf-8")
mats_t, caixa_t = geometria("tora_oca", modelo_java("block/hollow_log"))
mats_p, caixa_p = geometria("poste", modelo_java("block/post"))
for pt, _, log, desc in MADEIRAS:
    registrar(f"tora_oca_{pt}", "tora_oca", {"side": f"clv_{log}", "end": f"clv_{log}_top", "inside": f"clv_{desc}"}, {"origin": [-8, 0, -8], "size": [16, 16, 16]}, "opaque")
    registrar(f"poste_{pt}", "poste", {m: f"clv_{log}" for m in mats_p}, caixa_p, "opaque")

# ---------- Itens ----------
I = "item/"
for i, a in (("colher_pedreiro", "trowel"), ("bolsa_sementes", "seed_pouch"), ("abaco", "abacus_unset"), ("nuvem_engarrafada", "bottled_cloud"),
             ("slime_balde", "slime_in_a_bucket"), ("caco_vidro", "clear_shard")):
    item(i, f"{I}{a}.png")

# ---------- Saque extra da Caixa de Monstros (loot_table/misc/monster_box.json do mod) ----------
def saque_java(rel):
    txt = subprocess.run(["git", "-C", str(Q), "show", f"origin/master:src/main/resources/data/quark/loot_table/{rel}.json"], capture_output=True, check=True).stdout
    return json.loads(txt.decode("utf-8-sig"))


def funcao(f):
    nome = f["function"].replace("minecraft:", "")
    if nome == "set_count":
        return {"function": "set_count", "count": f["count"]}
    if nome == "set_damage":
        return {"function": "set_damage", "damage": f["damage"]}
    if nome == "enchant_randomly":
        return {"function": "enchant_randomly"}
    return None


pools = []
for p in saque_java("misc/monster_box")["pools"]:
    entradas = []
    for e in p["entries"]:
        nome = e["name"].replace("quark:monster_box", "cl:caixa_monstros")
        entradas.append({"type": "item", "name": nome, "weight": e.get("weight", 1), "functions": [x for x in map(funcao, e.get("functions", [])) if x]})
    pools.append({"rolls": p.get("rolls", 1), "entries": entradas})
destino = RAIZ / "BP/loot_tables/cl/quark/caixa_monstros.json"
destino.parent.mkdir(parents=True, exist_ok=True)
destino.write_text(json.dumps({"pools": pools}, indent=1), encoding="utf-8")

(RAIZ / "tools/dados/quark4.json").write_text(json.dumps(saida, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["quark"] = sorted(set(todos.get("quark", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(Q / "LICENSE.md", RAIZ / "docs/licencas/quark.txt")
print(f"quark 4.1: {len(usados)} texturas, {len(saida)} blocos com modelo")

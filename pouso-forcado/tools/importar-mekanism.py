# Mekanism 10.7 (aidancbrady e equipe, MIT; github.com/mekanism/Mekanism, ramo release/1.21.x, o mais novo) para o
# pack (1.21.0). Lê os dados gerados do mod e grava tools/dados/conteudo/mekanism.json com:
# - os itens e máquinas novos (nomes do pt_br.json do mod);
# - as receitas de bancada dos itens e máquinas que o pack tem;
# - as receitas das máquinas: Câmara de Enriquecimento, Triturador, Combinador, Serraria de Precisão, Câmara de
#   Purificação (oxigênio), Câmara de Injeção Química (cloreto de hidrogênio), Compressor de Ósmio (ósmio) e Infusor
#   Metalúrgico (carbono, redstone, diamante, obsidiana refinada, ouro, estanho, bio e fungo, vindos dos itens);
# - o gasto de energia de cada máquina (UsageConfig, J por tick × 200 ticks; 2,5 J = 1 RF).
# E copia a arte original (MIT) dos itens e das faces das máquinas para RP/textures/{items,blocks}/cl/arte.
# Uso: python3 tools/importar-mekanism.py <pasta do Mekanism clonado>
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-mekanism.py <pasta do Mekanism>")
GEN = os.path.join(SRC, "src/datagen/generated/mekanism")
REC = os.path.join(GEN, "data/mekanism/recipe")
ASSETS = os.path.join(SRC, "src/main/resources/assets/mekanism")
EN = json.load(open(os.path.join(GEN, "assets/mekanism/lang/en_us.json")))
PT = json.load(open(os.path.join(ASSETS, "lang/pt_br.json")))

from mek_mapa import *  # noqa: F401,F403 (METAIS, JA, ITENS, MAQUINAS, TODOS, TAGS, um, simples)

def todos_json(pasta):
    for raiz, _, arqs in os.walk(os.path.join(REC, pasta)):
        for a in sorted(arqs):
            if a.endswith(".json"):
                yield os.path.relpath(os.path.join(raiz, a), REC)[:-5], json.load(open(os.path.join(raiz, a)))


# ---------- Receitas das máquinas ----------
maquinas = {k: [] for k in ("enriching", "crushing", "combining", "sawing", "purifying", "injecting", "compressing", "metallurgic_infusing")}
pulou = []
for nome, j in todos_json(""):
    t = j.get("type", "").replace("mekanism:", "")
    if t not in maquinas or "neoforge:conditions" in j and "compat" in nome:
        continue
    if t in ("enriching", "crushing"):
        e, s = um(j["input"]), j["output"]
        sai = um(s)
        if not e or not sai:
            pulou.append(nome)
            continue
        maquinas[t].append({"entra": e if isinstance(e, list) else [e], "qtd": j["input"].get("count", 1), "sai": [sai if isinstance(sai, str) else sai[0], s.get("count", 1)]})
    elif t == "combining":
        e, x, s = um(j["main_input"]), um(j["extra_input"]), um(j["output"])
        if not e or not x or not s:
            pulou.append(nome)
            continue
        maquinas[t].append({"entra": e if isinstance(e, list) else [e], "qtd": j["main_input"].get("count", 1), "extra": x if isinstance(x, list) else [x],
                            "qtdExtra": j["extra_input"].get("count", 1), "sai": [s if isinstance(s, str) else s[0], j["output"].get("count", 1)]})
    elif t == "sawing":
        e = um(j["input"])
        s = j.get("main_output")
        sai = um(s) if s else None
        if not e or not sai:
            pulou.append(nome)
            continue
        extra = []
        if "secondary_output" in j and um(j["secondary_output"]):
            extra = [simples(j["secondary_output"]), j["secondary_output"].get("count", 1), j.get("secondary_chance", 1)]
        maquinas[t].append({"entra": e if isinstance(e, list) else [e], "qtd": j["input"].get("count", 1), "sai": [simples(s), s.get("count", 1)], "extra": extra})
    else:
        e, s = um(j["item_input"]), um(j["output"])
        quim = j["chemical_input"].get("chemical") or j["chemical_input"].get("tag")
        if not e or not s:
            pulou.append(nome)
            continue
        maquinas[t].append({"entra": e if isinstance(e, list) else [e], "qtd": j["item_input"].get("count", 1), "quimico": quim.split(":", 1)[1],
                            "quantidade": j["chemical_input"]["amount"], "porTick": j.get("per_tick_usage", False),
                            "sai": [s if isinstance(s, str) else s[0], j["output"].get("count", 1)]})
# Infusão: que item dá quanto de cada tipo (chemical_conversion/<tipo>/*.json).
infusao = {}
for nome, j in todos_json("chemical_conversion"):
    out = j["output"]["id"].split(":", 1)[1]
    e = um(j["input"])
    if not e:
        continue
    for i in (e if isinstance(e, list) else [e]):
        infusao.setdefault(out, {})[i] = j["output"]["amount"] // j["input"].get("count", 1)

# ---------- Receitas de bancada ----------
receitas = []
for nome, j in todos_json(""):
    t = j.get("type", "")
    if t not in ("minecraft:crafting_shaped", "minecraft:crafting_shapeless", "mekanism:mek_data") and not t.endswith("shaped"):
        continue
    res = j.get("result", {})
    rid = res.get("id", "")
    if not rid.startswith("mekanism:") or rid.split(":", 1)[1] not in TODOS or rid.split(":", 1)[1] in NOVOS:
        continue  # (as do Mekanism completo saem de tools/importar-mekanism-completo.py)
    saida = um(rid)
    if saida.startswith(("cl:bloco_", "cl:lingote_")):
        continue  # os blocos e lingotes já têm receita no pack
    r = {"id": "mk10_" + re.sub(r"[^a-z0-9_]", "_", nome), "resultado": saida}
    if res.get("count", 1) > 1:
        r["qtd"] = res["count"]
    if "pattern" in j:
        chave = {k: simples(v) for k, v in j["key"].items()}
        if None in chave.values():
            pulou.append("bancada/" + nome)
            continue
        r.update(tipo="shaped", padrao=j["pattern"], chave=chave)
    elif "ingredients" in j:
        ings = [simples(i) for i in j["ingredients"]]
        if None in ings:
            pulou.append("bancada/" + nome)
            continue
        r.update(tipo="shapeless", ingredientes=ings)
    else:
        continue
    receitas.append(r)

# ---------- Nomes e energia ----------
def nome_de(eio):
    for chave in ("item", "block"):
        k = f"{chave}.mekanism.{eio}"
        if k in EN:
            return PT.get(k, EN[k]), EN[k]
    return eio, eio


itens = [{"id": pid, "pt": nome_de(m)[0], "en": nome_de(m)[1], "mek": m} for m, pid in ITENS.items()]
novas = [{"id": pid, "pt": nome_de(m)[0], "en": nome_de(m)[1], "mek": m} for m, pid in MAQUINAS.items()]
# Lingotes, blocos e pós são de vários mods no pack: só os nomes das coisas do Mekanism mudam.
renomear = {pid: list(nome_de(m)) for m, pid in JA.items()
            if not m.startswith(("dust_", "ingot_", "block_")) and m not in ("sawdust", "jetpack", "bio_fuel") and nome_de(m)[0] != m}
uso = open(os.path.join(SRC, "src/main/java/mekanism/common/config/UsageConfig.java")).read()
J = {m.group(1): int(m.group(2).replace("_", "")) for m in re.finditer(r'"(\w+)", ([\d_]+)L\)', uso)}
# Máquinas de 200 ticks: J/t × 200 / 2,5 = RF por operação; em cE (40 RF).
CE = {k: round(J[k] * 200 / 2.5 / 40) for k in ("enrichmentChamber", "osmiumCompressor", "combiner", "crusher", "metallurgicInfuser",
                                                  "purificationChamber", "energizedSmelter", "chemicalInjectionChamber", "precisionSawmill")}
tier = open(os.path.join(SRC, "src/main/java/mekanism/common/tier/EnergyCubeTier.java")).read()
cubos = {m.group(1).lower(): int(m.group(2).replace("_", "")) for m in re.finditer(r"(BASIC|ADVANCED|ELITE|ULTIMATE)\(BaseTier\.\w+, ([\d_]+)L", tier)}
saida = {"itens": itens, "maquinas": novas, "renomear": renomear, "receitas": receitas, "processos": maquinas, "infusao": infusao, "ce": CE,
         "cubosJ": cubos}
json.dump(saida, open(os.path.join(R, "tools/dados/conteudo/mekanism.json"), "w"), ensure_ascii=False, indent=1)

# ---------- Arte ----------
TEX = os.path.join(ASSETS, "textures")


def abrir(rel):
    im = Image.open(os.path.join(TEX, rel)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def salvar(im, rel):
    destino = os.path.join(R, rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino)


usados = []
for m, pid in {**JA, **ITENS}.items():
    if os.path.exists(os.path.join(TEX, f"item/{m}.png")) and not os.path.exists(os.path.join(R, f"BP/blocks/{pid}.json")):
        salvar(abrir(f"item/{m}.png"), f"RP/textures/items/cl/arte/{pid}.png")
        usados.append(pid)
for m, pid in {**MAQUINAS, "purification_chamber": "camara_purificacao", "chemical_injection_chamber": "camara_injecao", "crusher": "triturador_mk"}.items():
    d = f"block/{m}"
    if not os.path.isdir(os.path.join(TEX, d)):
        continue
    for face, arq in (("frente", "front"), ("lado", "left"), ("topo", "top"), ("baixo", "bottom")):
        if os.path.exists(os.path.join(TEX, f"{d}/{arq}.png")):
            salvar(abrir(f"{d}/{arq}.png").resize((16, 16), Image.NEAREST), f"RP/textures/blocks/cl/arte/{pid}_{face}.png")
    usados.append(pid)
for m, pid in (("block_steel", "bloco_aco"), ("block_bronze", "bloco_bronze"), ("block_tin", "bloco_estanho")):
    if os.path.exists(os.path.join(TEX, f"block/{m}.png")):
        salvar(abrir(f"block/{m}.png"), f"RP/textures/blocks/cl/arte/{pid}.png")
        usados.append(pid)
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["mekanism10"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
with open(os.path.join(SRC, "LICENSE")) as f, open(os.path.join(R, "docs/licencas/mekanism10.txt"), "w") as g:
    g.write("Mekanism 10.7 (aidancbrady e equipe), github.com/mekanism/Mekanism, ramo release/1.21.x. Código e arte: MIT.\n\n" + f.read())
print(f"mekanism 10: {len(itens)} itens, {len(novas)} máquinas, {len(receitas)} receitas de bancada, "
      + ", ".join(f"{k} {len(v)}" for k, v in maquinas.items()) + f", {len(usados)} artes; ce {CE}; cubos {cubos}; puladas {len(pulou)}")
print("  puladas:", ", ".join(pulou[:60]))

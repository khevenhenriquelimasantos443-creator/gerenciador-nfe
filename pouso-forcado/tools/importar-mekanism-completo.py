# Mekanism completo (1.49.0+; Mekanism 10.7.19, aidancbrady e equipe, MIT; ramo release/1.21.x, o mais novo).
# Parte 1: minério ×5 e a química. Lê os dados gerados e o código do mod e grava tools/dados/conteudo/mekanism_p1.json:
# - itens (cristais, pó de enxofre, fluorita, substrato, PEAD) com a arte original;
# - os cilindros dos químicos novos (o gás anda em cilindros de 1.000 mB no pack);
# - as máquinas (Oxidador, Câmara de Dissolução, Lavador, Cristalizador, Condensentrador Rotativo, Câmara de Reação
#   Pressurizada e o Infusor Químico de antes com o modelo novo), os tanques de químico e de fluido (4 níveis), o Tanque
#   Dinâmico (bloco), o Barril Pessoal e o minério de fluorita, com os modelos 3D do mod convertidos para o Bedrock;
# - as receitas de bancada e as das máquinas, e o gasto de energia (UsageConfig; 2,5 J = 1 RF; 40 RF = 1 cE).
# Uso: python3 tools/importar-mekanism-completo.py <pasta do Mekanism clonado (release/1.21.x)>
import json, os, re, sys
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mek_mapa import FABRICA_TIPO, METAIS, NIVEL_F, NOVOS, TAGS, TODOS, simples, um  # noqa: E402

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-mekanism-completo.py <pasta do Mekanism>")
GEN = os.path.join(SRC, "src/datagen/generated/mekanism")
REC = os.path.join(GEN, "data/mekanism/recipe")
ASSETS = os.path.join(SRC, "src/main/resources/assets/mekanism")
TEX = os.path.join(ASSETS, "textures")
MOD = os.path.join(ASSETS, "models")
EN = json.load(open(os.path.join(GEN, "assets/mekanism/lang/en_us.json")))
PT = json.load(open(os.path.join(ASSETS, "lang/pt_br.json")))
usados = []


def nome_de(m):
    for chave in ("item", "block", "chemical"):
        k = f"{chave}.mekanism.{m}"
        if k in EN:
            return PT.get(k, EN[k]), EN[k]
    return m, m


def salvar(im, rel):
    destino = os.path.join(R, rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im.save(destino)


def abrir(rel):
    im = Image.open(os.path.join(TEX, rel)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im  # 1º quadro das animadas


# ---------- modelos Java -> Bedrock ----------
def modelo_java(nome):
    """Modelo do Mekanism com os pais do mod resolvidos (e as partes dos modelos compostos juntas)."""
    d = json.load(open(os.path.join(MOD, f"{nome}.json")))
    pai = d.get("parent", "")
    base = modelo_java(pai.split(":", 1)[1]) if pai.startswith("mekanism:") else {"textures": {}, "elements": []}
    tex = {**base.get("textures", {}), **d.get("textures", {})}
    elems = d.get("elements")
    if "children" in d:  # neoforge:composite: cada parte com as suas texturas (ou com o seu modelo pai)
        elems = []
        for filho in d["children"].values():
            sub = modelo_java(filho["parent"].split(":", 1)[1]) if filho.get("parent", "").startswith("mekanism:") else {"textures": {}, "elements": []}
            t = {**tex, **sub["textures"], **filho.get("textures", {})}
            for e in [*sub["elements"], *filho.get("elements", [])]:
                e = json.loads(json.dumps(e))
                for f in e["faces"].values():
                    f["texture"] = resolver(f.get("texture", "#all"), t)
                elems.append(e)
    elif elems is not None:
        elems = json.loads(json.dumps(elems))
        for e in elems:
            for f in e["faces"].values():
                f["texture"] = f.get("texture", "#all")
    else:
        elems = base["elements"]
    return {"textures": tex, "elements": elems}


def resolver(t, tex, n=0):
    while isinstance(t, str) and t.startswith("#") and n < 8:
        t, n = tex.get(t[1:], t), n + 1
    return t


def uv_padrao(face, f, t):
    return {"north": [16 - t[0], 16 - t[1], 16 - f[0], 16 - f[1]], "south": [f[0], 16 - t[1], t[0], 16 - f[1]],
            "west": [f[2], 16 - t[1], t[2], 16 - f[1]], "east": [16 - t[2], 16 - t[1], 16 - f[2], 16 - f[1]],
            "up": [f[0], f[2], t[0], t[2]], "down": [f[0], 16 - t[2], t[0], 16 - f[2]]}[face]


def geometria(pid, nome):
    """geometry.cl.mk_<pid> a partir do modelo do mod; devolve os materiais (textura de cada um) e a caixa."""
    m = modelo_java(nome)
    cubos, mats = [], {}
    lo, hi = [16, 16, 16], [0, 0, 0]
    for e in m["elements"]:
        f, t = e["from"], e["to"]
        lo = [min(a, b) for a, b in zip(lo, f)]
        hi = [max(a, b) for a, b in zip(hi, t)]
        uv = {}
        for face, fd in e["faces"].items():
            arq = resolver(fd["texture"] if fd["texture"].startswith("#") else fd["texture"], m["textures"])
            if not isinstance(arq, str) or ":" not in arq:
                continue
            rel = arq.split(":", 1)[1]
            mat = "m_" + re.sub(r"[^a-z0-9]+", "_", rel.split("/")[-1])
            if mat not in mats:
                png = f"{rel}.png"
                salvar(abrir(png), f"RP/textures/blocks/cl/arte/mkm_{mat[2:]}.png")
                mats[mat] = f"clc_mkm_{mat[2:]}"
            u = fd.get("uv") or uv_padrao(face, f, t)
            if face in ("up", "down"):  # o Bedrock lê o UV de cima e de baixo virado
                uv[face] = {"uv": [u[2], u[3]], "uv_size": [u[0] - u[2], u[1] - u[3]], "material_instance": mat}
            else:
                uv[face] = {"uv": [u[0], u[1]], "uv_size": [u[2] - u[0], u[3] - u[1]], "material_instance": mat}
        if uv:
            cubos.append({"origin": [f[0] - 8, f[1], f[2] - 8], "size": [max(t[i] - f[i], 0) for i in range(3)], "uv": uv})
    geo = {"format_version": "1.12.0", "minecraft:geometry": [{
        "description": {"identifier": f"geometry.cl.mk_{pid}", "texture_width": 16, "texture_height": 16,
                        "visible_bounds_width": 2, "visible_bounds_height": 2, "visible_bounds_offset": [0, 0.5, 0]},
        "bones": [{"name": "mk", "pivot": [0, 0, 0], "cubes": cubos}]}]}
    with open(os.path.join(R, f"RP/models/blocks/cl_mk_{pid}.geo.json"), "w") as g:
        json.dump(geo, g, indent=1)
    # A caixa do Bedrock tem de caber no bloco (alguns modelos passam 0,01 da borda).
    lo = [max(0, round(v)) for v in lo]
    hi = [min(16, round(v)) for v in hi]
    caixa = {"origin": [lo[0] - 8, lo[1], lo[2] - 8], "size": [max(1, hi[i] - lo[i]) for i in range(3)]}
    usados.append(pid)
    return {"geometria": f"geometry.cl.mk_{pid}", "materiais": mats, "caixa": caixa}


# ---------- itens ----------
ITENS_P1 = {**{f"crystal_{en}": f"cristal_{pt}" for en, pt in METAIS.items()},
            "dust_sulfur": "po_enxofre", "fluorite_gem": "fluorita", "dust_fluorite": "po_fluorita", "substrate": "substrato",
            "hdpe_pellet": "pellet_pead", "hdpe_rod": "barra_pead", "hdpe_sheet": "folha_pead", "hdpe_stick": "vareta_pead"}
itens = []
for m, pid in ITENS_P1.items():
    pt, en = nome_de(m)
    salvar(abrir(f"item/{m}.png"), f"RP/textures/items/cl/arte/{pid}.png")
    usados.append(pid)
    itens.append({"id": pid, "pt": pt, "en": en})

# ---------- químicos e cilindros ----------
# Os de antes (Fase 24): oxigênio, hidrogênio, cloro, cloreto de hidrogênio. Água e salmoura em balde.
CILINDRO = {"oxygen": "cilindro_oxigenio", "hydrogen": "cilindro_hidrogenio", "chlorine": "cilindro_cloro", "hydrogen_chloride": "cilindro_acido"}
NOVOS_Q = {"sulfur_dioxide": "dioxido_enxofre", "sulfur_trioxide": "trioxido_enxofre", "sulfuric_acid": "acido_sulfurico",
           "water_vapor": "vapor_agua", "ethene": "eteno", "lithium": "litio", "sodium": "sodio",
           **{f"dirty_{en}": f"pasta_suja_{pt}" for en, pt in METAIS.items()}, **{f"clean_{en}": f"pasta_limpa_{pt}" for en, pt in METAIS.items()}}
# Cores dos químicos (ChemicalConstants: 0xAARRGGBB); o vapor d'água usa a do vapor.
cor_q = {mm.group(1): "#" + mm.group(2).lower() for mm in re.finditer(r'\("(\w+)", 0x[0-9A-Fa-f]{2}([0-9A-Fa-f]{6})',
                                                                        open(os.path.join(SRC, "src/main/java/mekanism/common/ChemicalConstants.java")).read())}
cor_q.setdefault("water_vapor", "#d8e4ec")
COR_METAL = {"iron": "#af8e77", "gold": "#f2cd67", "copper": "#c87240", "tin": "#ccccd9", "osmium": "#1e79c3"}
cilindros = []
for q, pid in NOVOS_Q.items():
    if q.startswith(("dirty_", "clean_")):
        metal = q.split("_", 1)[1]
        pt_m = {"iron": "Ferro", "gold": "Ouro", "copper": "Cobre", "tin": "Estanho", "osmium": "Ósmio"}[metal]
        sujo = q.startswith("dirty_")
        pt, en = f"Cilindro de Pasta {'Suja' if sujo else 'Limpa'} de {pt_m}", f"{'Dirty' if sujo else 'Clean'} {metal.title()} Slurry Tank"
        cor = COR_METAL[metal] if not sujo else "#" + "".join(f"{int(int(COR_METAL[metal][i:i + 2], 16) * 0.6):02x}" for i in (1, 3, 5))
    else:
        npt, nen = nome_de(q)
        pt, en, cor = f"Cilindro de {npt}", f"{nen} Tank", cor_q.get(q, "#9aa3ab")
    CILINDRO[q] = f"cilindro_{pid}"
    cilindros.append({"id": f"cilindro_{pid}", "q": q, "pt": pt, "en": en, "cor": cor})

# ---------- blocos ----------
MAQ = {"chemical_oxidizer": "oxidador_quimico", "chemical_dissolution_chamber": "camara_dissolucao", "chemical_washer": "lavador_quimico",
       "chemical_crystallizer": "cristalizador_quimico", "rotary_condensentrator": "condensentrador_rotativo",
       "pressurized_reaction_chamber": "camara_reacao_pressurizada", "chemical_infuser": "infusor_quimico"}
maquinas = []
for m, pid in MAQ.items():
    pt, en = nome_de(m)
    maquinas.append({"id": pid, "pt": pt, "en": en, "modelo": geometria(pid, f"block/{m}")})
TIERS = (("basic", "basico", "Básico"), ("advanced", "avancado", "Avançado"), ("elite", "elite", "Elite"), ("ultimate", "definitivo", "Definitivo"))
tier_q = open(os.path.join(SRC, "src/main/java/mekanism/common/tier/ChemicalTankTier.java")).read()
tier_f = open(os.path.join(SRC, "src/main/java/mekanism/common/tier/FluidTankTier.java")).read()
cap = lambda txt, t: int(re.search(rf"{t.upper()}\(BaseTier\.\w+, ([\d_]+) \* FluidType.BUCKET_VOLUME", txt).group(1).replace("_", "")) * 1000
tanques = []
for en_t, pid_t, _pt in TIERS:
    for tipo, m, txt in (("quimico", f"{en_t}_chemical_tank", tier_q), ("fluido", f"{en_t}_fluid_tank", tier_f)):
        pt, en = nome_de(m)
        modelo = f"block/chemical_tank/{en_t}" if tipo == "quimico" else "block/fluid_tank"
        tanques.append({"id": f"tanque_{tipo}_{pid_t}", "pt": pt, "en": en, "tipo": tipo, "cap": cap(txt, en_t), "modelo": geometria(f"tanque_{tipo}_{pid_t}", modelo)})
blocos = []
for m, pid, arq in (("dynamic_tank", "tanque_dinamico", "block/dynamic_tank.png"), ("fluorite_ore", "minerio_fluorita", "block/fluorite_ore.png"),
                    ("deepslate_fluorite_ore", "minerio_fluorita_profundo", "block/deepslate_fluorite_ore.png"), ("block_fluorite", "bloco_fluorita", "block/block_fluorite.png")):
    pt, en = nome_de(m)
    salvar(abrir(arq), f"RP/textures/blocks/cl/arte/{pid}.png")
    usados.append(pid)
    blocos.append({"id": pid, "pt": pt, "en": en})
pt, en = nome_de("personal_barrel")
for face, arq in (("frente", "side"), ("lado", "side"), ("topo", "top"), ("baixo", "bottom")):  # o barril não tem frente: a tampa é o topo
    p = f"block/personal_barrel/{arq}.png"
    if os.path.exists(os.path.join(TEX, p)):
        salvar(abrir(p), f"RP/textures/blocks/cl/arte/barril_pessoal_{face}.png")
usados.append("barril_pessoal")
blocos.append({"id": "barril_pessoal", "pt": pt, "en": en})

# ---------- receitas das máquinas ----------
def todos_json():
    for raiz, _, arqs in os.walk(REC):
        for a in sorted(arqs):
            if a.endswith(".json"):
                yield os.path.relpath(os.path.join(raiz, a), REC)[:-5], json.load(open(os.path.join(raiz, a)))


def lista(x):
    r = um(x)
    return r if isinstance(r, list) else [r] if r else None


q = lambda c: (c.get("chemical") or c.get("id") or c.get("tag", "")).split(":", 1)[1]
proc = {k: [] for k in ("oxidizing", "chemical_infusing", "dissolution", "washing", "crystallizing", "rotary", "reaction")}
pulou = []
for nome, j in todos_json():
    t = j.get("type", "").replace("mekanism:", "")
    if t not in proc:
        continue
    if t == "oxidizing":
        e, s = lista(j["input"]), q(j["output"])
        if not e or s not in CILINDRO and s not in ("brine",):
            pulou.append(nome)
            continue
        proc[t].append({"entra": e, "qtd": j["input"].get("count", 1), "sai_q": [s, j["output"]["amount"]]})
    elif t == "chemical_infusing":
        a, b, s = q(j["left_input"]), q(j["right_input"]), q(j["output"])
        if s not in CILINDRO:
            pulou.append(nome)
            continue
        proc[t].append({"entra_q": [[a, j["left_input"]["amount"]], [b, j["right_input"]["amount"]]], "sai_q": [s, j["output"]["amount"]]})
    elif t == "dissolution":
        e, s = lista(j["item_input"]), q(j["output"])
        if not e or s not in CILINDRO:
            pulou.append(nome)
            continue
        # 100 ticks por operação (TileEntityChemicalDissolutionChamber), gasto por tique.
        proc[t].append({"entra": e, "qtd": j["item_input"].get("count", 1), "entra_q": [[q(j["chemical_input"]), j["chemical_input"]["amount"] * 100]],
                        "sai_q": [s, j["output"]["amount"]]})
    elif t == "washing":
        s = q(j["output"])
        proc[t].append({"entra_q": [[q(j["chemical_input"]), j["chemical_input"]["amount"]]], "agua": j["fluid_input"]["amount"], "sai_q": [s, j["output"]["amount"]]})
    elif t == "crystallizing":
        s = simples(j["output"])
        e = q(j["input"])
        if not s or (e not in CILINDRO and e != "brine"):
            pulou.append(nome)
            continue
        proc[t].append({"entra_q": [[e, j["input"]["amount"]]], "sai": [s, j["output"].get("count", 1)]})
    elif t == "rotary":
        g = q(j["chemical_output"])
        if g == "water_vapor":
            proc[t].append({"gas": g, "liquido": "water"})
        elif g == "brine":
            proc[t].append({"gas": g, "liquido": "brine"})
    elif t == "reaction":
        e = lista(j["item_input"])
        if not e or "lategame" in nome:
            pulou.append(nome)
            continue
        r = {"entra": e, "qtd": j["item_input"].get("count", 1), "agua": j["fluid_input"]["amount"] if "water" in j["fluid_input"].get("tag", "") else 0,
             "entra_q": [[q(j["chemical_input"]), j["chemical_input"]["amount"]]], "ticks": j.get("duration", 100), "energia": j.get("energy_required", 0)}
        if "ethene" in j["fluid_input"].get("tag", ""):
            r["entra_q"].append(["ethene", j["fluid_input"]["amount"]])
        if "item_output" in j:
            r["sai"] = [simples(j["item_output"]), j["item_output"].get("count", 1)]
        if "chemical_output" in j:
            r["sai_q"] = [q(j["chemical_output"]), j["chemical_output"]["amount"]]
        if r.get("sai") and not r["sai"][0]:
            pulou.append(nome)
            continue
        proc[t].append(r)

# ---------- receitas de bancada ----------
def receitas_de(ids):
    rs = []
    for nome, j in todos_json():
        tp = j.get("type", "")
        res = j.get("result", {})
        rid = res.get("id", "")
        if not (tp.endswith("shaped") or tp.endswith("shapeless") or tp == "mekanism:mek_data") or not rid.startswith("mekanism:"):
            continue
        if rid.split(":", 1)[1] not in ids:
            continue
        saida = um(rid)
        r = {"id": "mkc_" + re.sub(r"[^a-z0-9_]", "_", nome), "resultado": saida}
        if res.get("count", 1) > 1:
            r["qtd"] = res["count"]
        if "pattern" in j:
            chave = {k: simples(v) for k, v in j["key"].items()}
            if None in chave.values():
                pulou.append("bancada/" + nome + " " + str([k for k, v in chave.items() if v is None]))
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
        rs.append(r)
    return rs


P1 = set(ITENS_P1) | set(MAQ) | {"dynamic_tank", "fluorite_ore", "deepslate_fluorite_ore", "block_fluorite", "personal_barrel", "salt"} | \
    {f"{t}_{k}_tank" for t, _p, _n in TIERS for k in ("chemical", "fluid")}
receitas = receitas_de(P1)

# ---------- energia ----------
uso = open(os.path.join(SRC, "src/main/java/mekanism/common/config/UsageConfig.java")).read()
J = {m.group(1): int(m.group(2).replace("_", "")) for m in re.finditer(r'"(\w+)", ([\d_]+)L\)', uso)}
# Máquinas de operação (ticks do mod por operação) e de fluxo (100 tiques de fluxo por ciclo de 5 s): J -> cE (40 RF).
ce = lambda jt, ticks: max(1, round(jt * ticks / 2.5 / 40))
CE = {"oxidizing": ce(J["chemicalOxidizer"], 100), "dissolution": ce(J["chemicalDissolutionChamber"], 100), "crystallizing": ce(J["chemicalCrystallizer"], 200),
      "washing": ce(J["chemicalWasher"], 100), "chemical_infusing": ce(J["chemicalInfuser"], 100), "rotary": ce(J["rotaryCondensentrator"], 100),
      "reaction": J["pressurizedReactionBase"]}

# ---------- Parte 2 (1.50.0): fábricas, melhorias e instaladores de nível ----------
BASE_FAB = {"smelting": "fundidor_energizado", "enriching": "camara_enriquecimento", "crushing": "triturador_mk", "compressing": "compressor_osmio",
            "combining": "combinador", "purifying": "camara_purificacao", "injecting": "camara_injecao", "infusing": "infusor_metalurgico",
            "sawing": "serraria_precisao"}
proc_f = {m.group(1).lower(): int(m.group(2)) for m in re.finditer(r"(BASIC|ADVANCED|ELITE|ULTIMATE)\(BaseTier\.\w+, (\d+)\)",
                                                                    open(os.path.join(SRC, "src/main/java/mekanism/common/tier/FactoryTier.java")).read())}
fabricas = []
for tipo, tp in FABRICA_TIPO.items():
    for t, n in NIVEL_F.items():
        m = f"{t}_{tipo}_factory"
        pt, en = nome_de(m)
        fabricas.append({"id": f"fabrica_{tp}_{n}", "pt": pt, "en": en, "base": BASE_FAB[tipo], "processos": proc_f[t], "nivel": list(NIVEL_F).index(t),
                         "modelo": geometria(f"fabrica_{tp}_{n}", f"block/factory/{tipo}/{t}")})
itens2 = []
for m in [*(k for k in NOVOS if k.startswith("upgrade_")), *(k for k in NOVOS if k.endswith("_tier_installer"))]:
    pid = NOVOS[m]
    pt, en = nome_de(m)
    salvar(abrir(f"item/{m}.png"), f"RP/textures/items/cl/arte/{pid}.png")
    usados.append(pid)
    itens2.append({"id": pid, "pt": pt, "en": en})
P2 = {f"{t}_{tipo}_factory" for tipo in FABRICA_TIPO for t in NIVEL_F} | {k for k in NOVOS if k.startswith("upgrade_") or k.endswith("_tier_installer")}
receitas2 = receitas_de(P2)
json.dump({"fabricas": fabricas, "itens": itens2, "receitas": receitas2}, open(os.path.join(R, "tools/dados/conteudo/mekanism_p2.json"), "w"), ensure_ascii=False, indent=1)
print(f"mekanism completo p2: {len(fabricas)} fábricas, {len(itens2)} itens, {len(receitas2)} receitas, processos {proc_f}")

saida = {"itens": itens, "cilindros": cilindros, "cilindroDe": CILINDRO, "maquinas": maquinas, "tanques": tanques, "blocos": blocos,
         "receitas": receitas, "processos": proc, "ce": CE}
json.dump(saida, open(os.path.join(R, "tools/dados/conteudo/mekanism_p1.json"), "w"), ensure_ascii=False, indent=1)
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["mekanism_completo"] = sorted(set(todos.get("mekanism_completo", [])) | set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
print(f"mekanism completo p1: {len(itens)} itens, {len(cilindros)} cilindros, {len(maquinas)} máquinas, {len(tanques)} tanques, {len(blocos)} blocos, "
      f"{len(receitas)} receitas; " + ", ".join(f"{k} {len(v)}" for k, v in proc.items()) + f"; ce {CE}")
print("  puladas:", "; ".join(pulou))

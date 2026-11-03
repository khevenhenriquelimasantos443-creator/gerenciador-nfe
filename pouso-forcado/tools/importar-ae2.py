# Applied Energistics 2 (AlgorithmX2, Ridanisaurus e equipe; github.com/AppliedEnergistics/Applied-Energistics-2, ramo
# main, Minecraft 26.3, o mais novo) para o pack (1.22.0). Código LGPL-3.0; arte CC BY-NC-SA 3.0; textos sem restrição.
# Lê os dados gerados do mod e grava tools/dados/conteudo/ae2.json com os itens e blocos novos (nomes do pt_br.json do
# mod), as receitas de bancada e de fornalha, as da Prensa Inscritora, do Carregador e as de jogar na água (Fluix), e
# copia a arte original para RP/textures/{items,blocks}/cl/arte.
# Uso: python3 tools/importar-ae2.py <pasta do AE2 clonado>
import json, os, re, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-ae2.py <pasta do AE2>")
REC = os.path.join(SRC, "src/generated/resources/data/ae2/recipe")
ASSETS = os.path.join(SRC, "src/main/resources/assets/ae2")
EN = json.load(open(os.path.join(SRC, "src/generated/resources/assets/ae2/lang/en_us.json")))
PT = json.load(open(os.path.join(ASSETS, "lang/pt_br.json")))
TAMANHOS = ["1k", "4k", "16k", "64k", "256k"]

JA = {
    "certus_quartz_crystal": "cristal_certus", "certus_quartz_dust": "po_certus", "fluix_crystal": "cristal_fluix", "fluix_dust": "po_fluix",
    "silicon": "silicio", "logic_processor": "processador_basico", "engineering_processor": "processador_avancado",
    "certus_quartz_cutting_knife": "faca_corte", "controller": "controlador_me", "drive": "drive_me", "me_chest": "bau_me",
    "molecular_assembler": "montador_molecular", "wireless_access_point": "ponto_acesso", "wireless_terminal": "terminal_sem_fio",
    "blank_pattern": "padrao_me_vazio", "ender_dust": "po_perola_ender", "sky_stone_block": "meteorito", "terminal": "terminal",
    **{f"cell_component_{t}": f"componente_me_{t}" for t in TAMANHOS[:4]},
    **{f"item_storage_cell_{t}": f"celula_me_{t}" for t in TAMANHOS[:4]},
}
ITENS = {
    "charged_certus_quartz_crystal": "cristal_certus_carregado", "calculation_processor": "processador_calculo",
    "silicon_press": "prensa_silicio", "logic_processor_press": "prensa_logica", "calculation_processor_press": "prensa_calculo",
    "engineering_processor_press": "prensa_engenharia", "printed_silicon": "silicio_impresso", "printed_logic_processor": "circuito_logico_impresso",
    "printed_calculation_processor": "circuito_calculo_impresso", "printed_engineering_processor": "circuito_engenharia_impresso",
    "cell_component_256k": "componente_me_256k", "item_storage_cell_256k": "celula_me_256k", "item_cell_housing": "involucro_celula_me",
    "fluix_glass_cable": "cabo_me_fluix", "quartz_fiber": "fibra_quartzo", "wireless_receiver": "receptor_sem_fio",
    "annihilation_core": "nucleo_aniquilacao", "formation_core": "nucleo_formacao", "fluix_pearl": "perola_fluix", "sky_dust": "po_pedra_ceu",
}
BLOCOS = {"quartz_glass": "vidro_quartzo", "smooth_sky_stone_block": "pedra_ceu_lisa", "energy_cell": "celula_energia_ae",
          "dense_energy_cell": "celula_energia_ae_densa", "fluix_block": "bloco_fluix"}
MAQUINAS = {"inscriber": "inscritor", "charger": "carregador_ae"}
TODOS = {**JA, **ITENS, **BLOCOS, **MAQUINAS}
NAO_IMPORTAR = {"terminal", "meteorito", "po_perola_ender", "silicio"}  # receitas que são de outros mods no pack

TAGS = {
    "c:ingots/iron": "minecraft:iron_ingot", "c:ingots/gold": "minecraft:gold_ingot", "c:ingots/copper": "minecraft:copper_ingot",
    "c:gems/diamond": "minecraft:diamond", "c:gems/quartz": "minecraft:quartz", "c:dusts/redstone": "minecraft:redstone",
    "c:dusts/glowstone": "minecraft:glowstone_dust", "c:storage_blocks/iron": "minecraft:iron_block", "c:ender_pearls": "minecraft:ender_pearl",
    "c:glass_blocks/cheap": "minecraft:glass", "c:glass_blocks": "minecraft:glass", "c:chests": "minecraft:chest", "c:rods/wooden": "minecraft:stick",
    "c:silicon": "cl:silicio", "c:gems/certus_quartz": "cl:cristal_certus", "c:gems/fluix": "cl:cristal_fluix", "c:dusts/fluix": "cl:po_fluix",
    "c:dusts/certus_quartz": "cl:po_certus", "c:dusts/ender_pearl": "cl:po_perola_ender", "ae2:all_certus_quartz": "cl:cristal_certus",
    "ae2:all_nether_quartz": "minecraft:quartz", "ae2:all_quartz": "minecraft:quartz", "ae2:all_fluix": "cl:cristal_fluix",
    "ae2:all_quartz_dust": "cl:po_certus", "c:dusts/sky_stone": "cl:po_pedra_ceu", "c:dusts/quartz": "cl:po_quartzo", "c:stones": "minecraft:stone",
}


def um(x):
    if isinstance(x, list):
        alts = [a for a in (um(i) for i in x) if a]
        return alts[0] if alts else None
    if isinstance(x, dict):
        return um(("#" + x["tag"]) if "tag" in x else x.get("item") or x.get("id", ""))
    if x.startswith("#"):
        return TAGS.get(x[1:])
    ns, nome = x.split(":", 1) if ":" in x else ("", x)
    if ns == "minecraft":
        return x
    return f"cl:{TODOS[nome]}" if ns == "ae2" and nome in TODOS else None


def nome_de(chave, ae):
    k = f"{chave}.ae2.{ae}"
    en = EN.get(k, ae)
    return PT.get(k, en), en


def todos_json():
    for raiz, _, arqs in os.walk(REC):
        for a in sorted(arqs):
            if a.endswith(".json"):
                yield os.path.relpath(os.path.join(raiz, a), REC)[:-5], json.load(open(os.path.join(raiz, a)))


receitas, inscritor, carregar, agua, pulou = [], [], [], [], []
for nome, j in todos_json():
    t = j.get("type", "")
    res = j.get("result", {})
    rid = res.get("id", "") if isinstance(res, dict) else ""
    saida = um(rid) if rid else None
    if t == "ae2:inscriber":
        ing = {k: um(v) for k, v in j["ingredients"].items()}
        if saida and None not in ing.values():
            inscritor.append({"cima": ing.get("top"), "meio": ing["middle"], "baixo": ing.get("bottom"), "prensa": j["mode"] == "press", "sai": [saida, res.get("count", 1)]})
        else:
            pulou.append(nome)
        continue
    if t == "ae2:charger":
        e = um(j["ingredient"])
        if e and saida:
            carregar.append({"entra": e, "sai": saida})
        continue
    if t == "ae2:transform":
        ings = [um(i) for i in j["ingredients"]]
        if saida and None not in ings and "circumstance" not in j:
            agua.append({"entra": ings, "sai": [saida, res.get("count", 1)]})
        continue
    if not saida or not saida.startswith("cl:") or saida[3:] in NAO_IMPORTAR:
        continue
    r = {"id": "ae2_" + re.sub(r"[^a-z0-9_]", "_", nome), "resultado": saida}
    if t in ("minecraft:smelting",):
        e = um(j["ingredient"])
        if e:
            receitas.append({"id": r["id"], "tipo": "furnace", "entrada": e, "resultado": saida})
        continue
    if res.get("count", 1) > 1:
        r["qtd"] = res["count"]
    if t == "minecraft:crafting_shaped":
        chave = {k: um(v) for k, v in j["key"].items()}
        if None in chave.values():
            pulou.append(nome)
            continue
        # O padrão do mod vem com as linhas curtas (sem os espaços do fim); a bancada do Bedrock quer todas do mesmo tamanho.
        w = max(len(l) for l in j["pattern"])
        r.update(tipo="shaped", padrao=[l.ljust(w) for l in j["pattern"]], chave=chave)
    elif t == "minecraft:crafting_shapeless":
        ings = [um(i) for i in j["ingredients"]]
        if None in ings:
            pulou.append(nome)
            continue
        r.update(tipo="shapeless", ingredientes=ings)
    else:
        continue
    receitas.append(r)
# Uma receita por resultado basta (o mod tem a versão "_alt" e as de desmontar).
vistos, unicas = set(), []
for r in receitas:
    k = (r["resultado"], r["tipo"])
    if k in vistos and r["tipo"] != "furnace":
        continue
    vistos.add(k)
    unicas.append(r)

itens = [{"id": pid, "pt": nome_de("item", a)[0], "en": nome_de("item", a)[1]} for a, pid in ITENS.items()]
blocos = [{"id": pid, "pt": nome_de("block", a)[0], "en": nome_de("block", a)[1]} for a, pid in BLOCOS.items()]
maquinas = [{"id": pid, "pt": nome_de("block", a)[0], "en": nome_de("block", a)[1]} for a, pid in MAQUINAS.items()]
renomear = {}
for a, pid in JA.items():
    if pid in NAO_IMPORTAR:
        continue
    for ch in ("item", "block"):
        if f"{ch}.ae2.{a}" in EN:
            renomear[pid] = list(nome_de(ch, a))
json.dump({"itens": itens, "blocos": blocos, "maquinas": maquinas, "renomear": renomear, "receitas": unicas, "inscritor": inscritor,
           "carregar": carregar, "agua": agua}, open(os.path.join(R, "tools/dados/conteudo/ae2.json"), "w"), ensure_ascii=False, indent=1)

# ---------- Arte ----------
TEX = os.path.join(ASSETS, "textures")


def abrir(rel):
    im = Image.open(os.path.join(TEX, rel)).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def salvar(im, rel):
    os.makedirs(os.path.dirname(os.path.join(R, rel)), exist_ok=True)
    im.save(os.path.join(R, rel))


usados = []
ARQ = {"charged_certus_quartz_crystal": "certus_quartz_crystal_charged"}
for a, pid in {**JA, **ITENS}.items():
    arq = f"item/{ARQ.get(a, a)}.png"
    if os.path.exists(os.path.join(TEX, arq)) and not os.path.exists(os.path.join(R, f"BP/blocks/{pid}.json")) and pid not in NAO_IMPORTAR:
        salvar(abrir(arq), f"RP/textures/items/cl/arte/{pid}.png")
        usados.append(pid)
FACES = {
    "inscritor": {"frente": "block/inscriber.png", "lado": "block/inscriber.png", "topo": "block/inscriber.png", "baixo": "block/inscriber.png"},
    "carregador_ae": {"frente": "block/charger.png", "lado": "block/charger.png", "topo": "block/charger.png", "baixo": "block/charger.png"},
    "controlador_me": {"frente": "block/controller_powered.png", "lado": "block/controller_powered.png", "topo": "block/controller_powered.png", "baixo": "block/controller_powered.png"},
    "montador_molecular": {"frente": "block/molecular_assembler.png", "lado": "block/molecular_assembler.png", "topo": "block/molecular_assembler.png", "baixo": "block/molecular_assembler.png"},
}
for pid, fs in FACES.items():
    for face, arq in fs.items():
        if os.path.exists(os.path.join(TEX, arq)):
            salvar(abrir(arq).resize((16, 16), Image.NEAREST), f"RP/textures/blocks/cl/arte/{pid}_{face}.png")
    usados.append(pid)
for a, pid in (("quartz_glass", "vidro_quartzo"), ("smooth_sky_stone_block", "pedra_ceu_lisa"), ("energy_cell_4", "celula_energia_ae"),
               ("dense_energy_cell_4", "celula_energia_ae_densa"), ("fluix_block", "bloco_fluix")):
    for arq in (f"block/{a}.png", f"block/glass/{a}.png"):
        if os.path.exists(os.path.join(TEX, arq)):
            salvar(abrir(arq).resize((16, 16), Image.NEAREST), f"RP/textures/blocks/cl/arte/{pid}.png")
            usados.append(pid)
            break
arq = os.path.join(R, "docs/licencas/usados.json")
todos = json.load(open(arq)) if os.path.exists(arq) else {}
todos["ae2_novo"] = sorted(set(usados))
json.dump(todos, open(arq, "w"), ensure_ascii=False, indent=1, sort_keys=True)
with open(os.path.join(R, "docs/licencas/ae2_novo.txt"), "w") as g:
    g.write("Applied Energistics 2 (AlgorithmX2, Ridanisaurus Rid e equipe), github.com/AppliedEnergistics/Applied-Energistics-2, ramo main\n"
            "(Minecraft 26.3). Código: LGPL-3.0 (API: MIT). Texturas e modelos: CC BY-NC-SA 3.0. Textos e traduções: sem restrição (CC0).\n")
print(f"ae2: {len(itens)} itens, {len(blocos)} blocos, {len(maquinas)} máquinas, {len(unicas)} receitas, {len(inscritor)} da prensa, "
      f"{len(carregar)} do carregador, {len(agua)} na água, {len(usados)} artes; puladas {len(pulou)}: {', '.join(pulou[:40])}")

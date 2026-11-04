#!/usr/bin/env python3
"""Tinkers' Construct 3.12.1 (MIT, inclusive a arte), parte 3 do Tinkers completo (1.28.0): armaduras, escudos, arcos e
arremessáveis.

Lê os números do mod (tinkering/materials/stats: placas de armadura, braços de arco) e pinta a arte como o mod pinta
(o cinza de cada textura vira a paleta do material):
- Armadura de Placa (capacete, peitoral, calças, botas e escudo) de cada material de placa, com a malha de ferro; a
  textura vestida (tinker_armor/plate) também, para os "attachables".
- Equipamento de Viajante (óculos, colete, calças, botas, escudo), de couro e cobre como o mod faz por padrão.
- Traje de Slime (crânio, peitoral, calças, botas) e Slimélitros, de slime do céu.
- Arco Longo e Besta de cada material de braço de arco; Shuriken, Machado de Arremesso e Dardo de 4 materiais.
Escreve tools/dados/conteudo/tinkers3_armas.json (lido pela f47), a arte em RP/textures/items/cl/arte, as texturas
vestidas em RP/textures/models/armor/cl e os attachables em RP/attachables.
  python3 tools/importar-tinkers3-armas.py <pasta do Tinkers clonado>
"""
import json
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-tinkers3-armas.py <pasta do Tinkers>")
GEN = SRC / "src/generated/resources"
T = SRC / "src/main/resources/assets/tconstruct/textures"
STATS = GEN / "data/tconstruct/tinkering/materials/stats"
REND = GEN / "assets/tconstruct/tinkering/materials"
ARTE = RAIZ / "RP/textures/items/cl/arte"
VEST = RAIZ / "RP/textures/models/armor/cl"
ATT = RAIZ / "RP/attachables"
for p in (ARTE, VEST, ATT):
    p.mkdir(parents=True, exist_ok=True)
TC3 = json.loads((RAIZ / "tools/dados/conteudo/tinkers3.json").read_text())["materiais"]

# Material de placa (pack -> TC3) e o item que o faz e conserta.
PLACA = {
    "cobre": ("copper", "minecraft:copper_ingot"), "ferro": ("iron", "minecraft:iron_ingot"), "ouro": ("gold", "minecraft:gold_ingot"),
    "aluminio": ("aluminum", "cl:lingote_aluminio"), "pedra_refrataria": ("seared_stone", "cl:tijolo_refratario"),
    "pedra_chamuscada": ("scorched_stone", "cl:tijolo_chamuscado"), "obsidiana": ("obsidian", "minecraft:obsidian"), "osmio": ("osmium", "cl:lingote_osmio"),
    "ferro_porco": ("pig_iron", "cl:lingote_ferro_porco"), "ouro_rosa": ("rose_gold", "cl:lingote_ouro_rosa"),
    "bronze_ametista": ("amethyst_bronze", "cl:lingote_bronze_ametista"), "bronze": ("bronze", "cl:lingote_bronze"), "aco": ("steel", "cl:lingote_aco"),
    "cobalto": ("cobalt", "cl:lingote_cobalto"), "aco_slime": ("slimesteel", "cl:lingote_aco_slime"), "hepatizon": ("hepatizon", "cl:lingote_hepatizon"),
    "manyullyn": ("manyullyn", "cl:lingote_manyullyn"), "slime_rainha": ("queens_slime", "cl:lingote_slime_rainha"),
    "slime_brasa": ("cinderslime", "cl:lingote_slime_brasa"), "slime_cavaleiro": ("knightslime", "cl:lingote_slime_cavaleiro"),
}
# Material de braço de arco (pack -> TC3) e o item da receita.
ARCO = {
    "madeira": ("wood", "#minecraft:planks"), "osso": ("bone", "minecraft:bone"), "cacto": ("cactus", "minecraft:cactus"), "coro": ("chorus", "minecraft:popped_chorus_fruit"),
    "madeira_slime": ("slimewood", "cl:tabuas_verdecoracao"), "osso_venenoso": ("venombone", "cl:osso_venenoso"), "osso_necrotico": ("necrotic_bone", "cl:osso_necrotico"),
    "madeira_tratada": ("treated_wood", "cl:tabuas_tratadas"), "nahuatl": ("nahuatl", "cl:nahuatl"), "osso_blaze": ("blazing_bone", "cl:osso_blaze"),
    "cobre": ("copper", "minecraft:copper_ingot"), "ferro": ("iron", "minecraft:iron_ingot"), "aluminio": ("aluminum", "cl:lingote_aluminio"),
    "ferro_porco": ("pig_iron", "cl:lingote_ferro_porco"), "ouro_rosa": ("rose_gold", "cl:lingote_ouro_rosa"), "bronze_ametista": ("amethyst_bronze", "cl:lingote_bronze_ametista"),
    "bronze": ("bronze", "cl:lingote_bronze"), "aco": ("steel", "cl:lingote_aco"), "cobalto": ("cobalt", "cl:lingote_cobalto"), "aco_slime": ("slimesteel", "cl:lingote_aco_slime"),
    "madeira_slime_revestida": ("plated_slimewood", "cl:lingote_latao"), "hepatizon": ("hepatizon", "cl:lingote_hepatizon"), "manyullyn": ("manyullyn", "cl:lingote_manyullyn"),
    "slime_rainha": ("queens_slime", "cl:lingote_slime_rainha"), "slime_brasa": ("cinderslime", "cl:lingote_slime_brasa"), "slime_cavaleiro": ("knightslime", "cl:lingote_slime_cavaleiro"),
}
ARREMESSO = {"silex": ("flint", "minecraft:flint"), "ferro": ("iron", "minecraft:iron_ingot"), "cobalto": ("cobalt", "cl:lingote_cobalto"), "manyullyn": ("manyullyn", "cl:lingote_manyullyn")}
NOMES = {"ouro": ("Ouro", "Gold"), "aluminio": ("Alumínio", "Aluminum")}
usados = []


def stats(tc):
    return {k.split(":")[1]: v for k, v in json.loads((STATS / f"{tc}.json").read_text())["stats"].items()}


def paleta(tc):
    r = json.loads((REND / f"{tc}.json").read_text())
    t = r.get("generator", {}).get("transformer") or {}
    pal = t.get("color_mapping", {}).get("palette", {})
    pasta = REND / tc
    if not pal and pasta.is_dir():
        for v in sorted(pasta.iterdir(), key=lambda a: (a.name not in ("stone.json", "greenheart.json"), a.name)):
            pal = json.loads(v.read_text()).get("generator", {}).get("transformer", {}).get("color_mapping", {}).get("palette", {})
            if pal:
                break
    if not pal:
        c = r.get("color", "FF888888")[-6:]
        rgb = [int(c[i:i + 2], 16) for i in (0, 2, 4)]
        pal = {k: "FF" + "".join(f"{min(255, int(v * f)):02X}" for v in rgb) for k, f in {"000": 0, "063": 0.3, "102": 0.5, "140": 0.65, "178": 0.82, "216": 1.0}.items()}
        pal["255"] = "FF" + "".join(f"{min(255, int(v + (255 - v) * 0.35)):02X}" for v in rgb)
    return sorted((int(k), tuple(int(v[-6:][i:i + 2], 16) for i in (0, 2, 4))) for k, v in pal.items()), r.get("fallbacks", [])


def abrir(rel):
    p = T / (rel + ".png")
    if not p.exists():
        return None
    im = Image.open(p).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width * 2 else im


def variante(rel, tc, fallbacks):
    for v in [f"tconstruct_{tc}"] + fallbacks:
        im = abrir(f"{rel}_{v}")
        if im:
            return im
    return abrir(rel)


def pintar(im, pal):
    px = im.load()
    out = Image.new("RGBA", im.size)
    po = out.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a:
                continue
            c = (r + g + b) // 3
            lo = max((p for p in pal if p[0] <= c), default=pal[0])
            hi = min((p for p in pal if p[0] >= c), default=pal[-1])
            t = 0 if hi[0] == lo[0] else (c - lo[0]) / (hi[0] - lo[0])
            po[x, y] = tuple(int(lo[1][i] + (hi[1][i] - lo[1][i]) * t) for i in range(3)) + (a,)
    return out


def camadas(lista, tamanho=None):
    base = None
    for im in lista:
        if im is None:
            continue
        if tamanho:
            im = im.resize(tamanho, Image.NEAREST)
        base = im if base is None else Image.alpha_composite(base, im.resize(base.size, Image.NEAREST))
    return base


def icone(nome, im):
    im.resize((16, 16), Image.NEAREST).save(ARTE / f"{nome}.png")
    usados.append(nome)


def attachable(item, textura, geo, variavel):
    (ATT / f"{item.replace(':', '_')}.json").write_text(json.dumps({"format_version": "1.10.0", "minecraft:attachable": {"description": {
        "identifier": item, "materials": {"default": "armor", "enchanted": "armor_enchanted"},
        "textures": {"default": textura, "enchanted": "textures/misc/enchanted_item_glint"}, "geometry": {"default": f"geometry.player.armor.{geo}"},
        "scripts": {"parent_setup": f"variable.{variavel} = 0.0;"}, "render_controllers": ["controller.render.armor"]}}}, indent=2) + "\n")


PECAS = [("capacete", "helmet", "helmet", "helmet_layer_visible", 1), ("peitoral", "chestplate", "chestplate", "chest_layer_visible", 1),
         ("calcas", "leggings", "leggings", "leg_layer_visible", 2), ("botas", "boots", "boots", "boot_layer_visible", 1)]
FERRO_PAL = paleta("iron")[0]
dados = {"placa": {}, "arco": {}, "arremesso": {}}

# ---------- Armadura de Placa ----------
for m, (tc, item) in PLACA.items():
    s = stats(tc)
    pal, fb = paleta(tc)
    nome = NOMES.get(m) or (TC3[m]["pt"], TC3[m]["en"])
    dados["placa"][m] = {"pt": nome[0], "en": nome[1], "item": item, "kb": s["plating_chestplate"].get("knockback_resistance", 0), "dureza": s["plating_chestplate"].get("toughness", 0),
                         **{p: [s[f"plating_{tcp}"]["armor"], s[f"plating_{tcp}"]["durability"]] for p, tcp, *_ in PECAS}, "escudo": s["plating_shield"]["durability"]}
    for p, tcp, pasta, var, cam in PECAS:
        icone(f"{p}_placa_{m}", camadas([pintar(variante(f"item/tool/armor/plate/{pasta}/maille", "iron", ["metal"]), FERRO_PAL),
                                         pintar(variante(f"item/tool/armor/plate/{pasta}/plating", tc, fb), pal)]))
        attachable(f"cl:{p}_placa_{m}", f"textures/models/armor/cl/placa_{m}_{cam}", tcp, var)
    icone(f"escudo_placa_{m}", camadas([pintar(abrir("item/tool/armor/plate/shield/core_wood") or abrir("item/tool/armor/plate/shield/core"), paleta("wood")[0]),
                                        pintar(abrir("item/tool/armor/plate/shield/plating"), pal)]))
    for cam, sufixo in ((1, "armor"), (2, "leggings")):
        vest = camadas([pintar(Image.open(T / f"tinker_armor/plate/maille_{sufixo}_metal.png").convert("RGBA"), FERRO_PAL),
                        pintar(Image.open(T / f"tinker_armor/plate/plating_{sufixo}.png").convert("RGBA"), pal)])
        vest.save(VEST / f"placa_{m}_{cam}.png")

# ---------- Viajante (couro e cobre) e Traje de Slime ----------
COURO, COBRE, SLIME = paleta("leather")[0], paleta("copper")[0], paleta("skyslime")[0]
VIAJ = {"capacete": ("goggles", "helmet", "helmet_layer_visible", 1), "peitoral": ("vest", "chestplate", "chest_layer_visible", 1),
        "calcas": ("pants", "leggings", "leg_layer_visible", 2), "botas": ("boots", "boots", "boot_layer_visible", 1)}
for p, (pasta, geo, var, cam) in VIAJ.items():
    icone(f"{p}_viajante", camadas([abrir(f"item/tool/armor/travelers/{pasta}/base"), pintar(abrir(f"item/tool/armor/travelers/{pasta}/cuirass"), COURO),
                                    pintar(abrir(f"item/tool/armor/travelers/{pasta}/metal"), COBRE)]))
    attachable(f"cl:{p}_viajante", f"textures/models/armor/cl/viajante_{cam}", geo, var)
icone("escudo_viajante", camadas([pintar(abrir("item/tool/armor/travelers/shield/wood"), paleta("wood")[0]), pintar(abrir("item/tool/armor/travelers/shield/cuirass"), COURO)]))
for cam, sufixo in ((1, "armor"), (2, "leggings")):
    partes = [Image.open(T / f"tinker_armor/travelers/base_armor.png").convert("RGBA")] if cam == 1 else []
    partes += [pintar(Image.open(T / f"tinker_armor/travelers/cuirass_{sufixo}.png").convert("RGBA"), COURO),
               pintar(Image.open(T / f"tinker_armor/travelers/metal_{sufixo}.png").convert("RGBA"), COBRE)]
    camadas(partes).save(VEST / f"viajante_{cam}.png")
SLIMES = {"capacete": ("helmet", "slime", "helmet", "helmet_layer_visible", 1), "peitoral": ("chestplate", "slime", "chestplate", "chest_layer_visible", 1),
          "calcas": ("leggings", "slime", "leggings", "leg_layer_visible", 2), "botas": ("boots", "slime", "boots", "boot_layer_visible", 1)}
for p, (pasta, cam_nome, geo, var, cam) in SLIMES.items():
    extra = abrir(f"item/tool/armor/slime/{pasta}/skull_tconstruct_bone") if p == "capacete" else abrir(f"item/tool/armor/slime/{pasta}/laces") if p == "botas" else None
    icone(f"{p}_slime", camadas([extra, pintar(abrir(f"item/tool/armor/slime/{pasta}/{cam_nome}"), SLIME)]))
    attachable(f"cl:{p}_slime", f"textures/models/armor/cl/slime_{cam}", geo, var)
icone("slimelitros", pintar(abrir("item/tool/armor/slime/wings/slime"), SLIME))
attachable("cl:slimelitros", "textures/models/armor/cl/slime_1", "chestplate", "chest_layer_visible")
for cam, sufixo in ((1, "armor"), (2, "leggings")):
    camadas([pintar(Image.open(T / f"tinker_armor/slime/{sufixo}.png").convert("RGBA"), SLIME),
             Image.open(T / f"tinker_armor/slime/overlay_{sufixo}.png").convert("RGBA")]).save(VEST / f"slime_{cam}.png")

# ---------- Arcos ----------
MAD = paleta("wood")
CORDA = paleta("string")[0]
for m, (tc, item) in ARCO.items():
    s = stats(tc)
    pal, fb = paleta(tc)
    lim = s["limb"]
    dados["arco"][m] = {"pt": TC3.get(m, {}).get("pt", m), "en": TC3.get(m, {}).get("en", m), "item": item, "dur": lim["durability"], "vel": lim["velocity"], "saque": lim["draw_speed"], "tier": TC3.get(m, {}).get("tier", 1)}
    icone(f"arco_longo_{m}", camadas([pintar(abrir("item/tool/longbow/bowstring"), CORDA), pintar(variante("item/tool/longbow/grip", "wood", ["stick"]), MAD[0]),
                                      pintar(variante("item/tool/longbow/limb_top", tc, fb), pal), pintar(variante("item/tool/longbow/limb_bottom", tc, fb), pal)]))
    icone(f"besta_{m}", camadas([pintar(abrir("item/tool/crossbow/body"), MAD[0]), pintar(abrir("item/tool/crossbow/bowstring"), CORDA), pintar(variante("item/tool/crossbow/limb", tc, fb), pal)]))

# ---------- Arremessáveis ----------
for m, (tc, item) in ARREMESSO.items():
    pal, fb = paleta(tc)
    s = stats(tc)
    dados["arremesso"][m] = {"pt": TC3[m]["pt"], "en": TC3[m]["en"], "item": item, "dano": s.get("head", {}).get("melee_attack", s.get("arrow_head", {}).get("damage", 1.0)), "tier": TC3[m]["tier"]}
    icone(f"shuriken_{m}", camadas([pintar(abrir("item/tool/ammo/shuriken_bottom"), pal), pintar(abrir("item/tool/ammo/shuriken_top"), pal)]))
    icone(f"machado_arremesso_{m}", camadas([pintar(abrir("item/tool/ammo/arrow_shaft"), MAD[0]), pintar(abrir("item/tool/ammo/axe_head"), pal)]))
    icone(f"dardo_{m}", camadas([pintar(variante("item/tool/javelin/handle", "wood", ["stick"]), MAD[0]), pintar(variante("item/tool/javelin/grip", "wood", ["stick"]), MAD[0]),
                                 pintar(variante("item/tool/javelin/guard", "wood", ["stick"]), MAD[0]), pintar(variante("item/tool/javelin/head", tc, fb), pal)]))

(RAIZ / "tools/dados/conteudo/tinkers3_armas.json").write_text(json.dumps(dados, ensure_ascii=False, indent=1), encoding="utf-8")
arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos["tinkers3_armas"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"armas do tinkers 3: {len(dados['placa'])} placas, {len(dados['arco'])} arcos, {len(dados['arremesso'])} arremessáveis, {len(usados)} ícones")

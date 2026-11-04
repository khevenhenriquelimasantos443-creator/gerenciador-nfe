# 1.41.0: arte do Galacticraft 5 (o mais novo, 1.21.1; Team Galacticraft, licença MIT, inclusive a arte) no lugar dos
# desenhos próprios do Galacticraft do pack (o Galacticraft antigo proibia), e a arte dos blocos novos da Lua (fase 60).
# Uso: python3 tools/importar-gc5.py <clone do Galacticraft 5>
import json, shutil, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
G = Path(sys.argv[1] if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-gc5.py <clone do Galacticraft 5>"))
T = G / "src/main/resources/assets/galacticraft/textures"
B = RAIZ / "RP/textures/blocks/cl/arte"
I = RAIZ / "RP/textures/items/cl/arte"
FACES = ("frente", "lado", "topo", "baixo")
usados, faltou = [], []


def abrir(rel):
    im = Image.open(T / f"{rel}.png").convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im  # animação: 1º quadro


def existe(i):
    return (RAIZ / f"BP/blocks/{i}.json").exists() or (RAIZ / f"BP/items/{i}.json").exists()


def unica(i, rel):
    """Bloco com uma textura só (apaga as 4 faces antigas, se houver)."""
    if not (RAIZ / f"BP/blocks/{i}.json").exists():
        return faltou.append(i)
    for f in FACES:
        (B / f"{i}_{f}.png").unlink(missing_ok=True)
    abrir(rel).save(B / f"{i}.png")
    usados.append(i)


def faces(i, frente, lado, topo=None, baixo=None):
    if not (RAIZ / f"BP/blocks/{i}.json").exists():
        return faltou.append(i)
    (B / f"{i}.png").unlink(missing_ok=True)
    for f, rel in zip(FACES, (frente, lado, topo or lado, baixo or topo or lado)):
        abrir(rel).save(B / f"{i}_{f}.png")
    usados.append(i)


def item(i, rel):
    if not (RAIZ / f"BP/items/{i}.json").exists():
        return faltou.append(i)
    abrir(rel).save(I / f"{i}.png")
    usados.append(i)


b, it = "block/", "item/"
# ---------- O que o pack já tinha (fases 26 e 27) ----------
unica("rocha_lunar", b + "moon_rock")
unica("terra_lunar", b + "moon_dirt")
faces("solo_lunar", b + "moon_turf_block_side", b + "moon_turf_block_side", b + "moon_turf_block_top", b + "moon_dirt")
unica("tijolo_lunar", b + "moon_dungeon_brick")
unica("minerio_cobre_lunar", b + "moon_copper_ore")
unica("minerio_estanho_lunar", b + "moon_tin_ore")
unica("minerio_queijo", b + "moon_cheese_ore")
unica("meteorito", b + "fallen_meteor")
M = b + "machine"
for i, frente in (("coletor_oxigenio", "oxygen_collector"), ("compressor_oxigenio", "oxygen_compressor"), ("compressor", "compressor"),
                  ("compressor_eletrico", "electric_compressor"), ("fabricador_circuitos", "circuit_fabricator"),
                  ("distribuidor_oxigenio", "oxygen_bubble_distributor"), ("carregador_combustivel", "fuel_loader_0")):
    faces(i, b + frente, b + "machine_side", M, M)
faces("bancada_nasa", b + "rocket_workbench_side", b + "rocket_workbench_side", b + "rocket_workbench_top", b + "rocket_workbench_bottom")
faces("plataforma_lancamento", b + "rocket_launch_pad_side", b + "rocket_launch_pad_side", b + "rocket_launch_pad", b + "rocket_launch_pad")
for i, rel in (("wafer_basico", "basic_wafer"), ("wafer_avancado", "advanced_wafer"), ("motor_foguete", "rocket_engine"), ("aleta_foguete", "rocket_fin"),
               ("bico_foguete", "nose_cone"), ("mascara_oxigenio", "oxygen_mask"), ("equipamento_oxigenio", "oxygen_gear"),
               ("tanque_oxigenio_leve", "small_oxygen_tank"), ("tanque_oxigenio_medio", "medium_oxygen_tank"), ("tanque_oxigenio_pesado", "large_oxygen_tank"),
               ("lata_cobre", "copper_canister"), ("lata_estanho", "tin_canister"), ("ventilador_oxigenio", "oxygen_fan"), ("respiro_oxigenio", "oxygen_vent"),
               ("concentrador_oxigenio", "oxygen_concentrator"), ("placa_reforcada", "heavy_plating"), ("coalhada_queijo", "moon_cheese_curd"),
               ("cano_oxigenio", "../block/glass_fluid_pipe")):
    item(i, it + rel)
# ---------- Blocos novos da Lua (fase 60) ----------
for i, rel in (("basalto_lunar", "moon_basalt"), ("tijolos_basalto_lunar", "moon_basalt_brick"), ("tijolos_basalto_lunar_rachados", "cracked_moon_basalt_brick"),
               ("pedregulho_lunar", "cobbled_moon_rock"), ("rocha_lunar_polida", "polished_moon_rock"), ("tijolos_rocha_lunar", "moon_rock_brick"),
               ("tijolos_rocha_lunar_rachados", "cracked_moon_rock_brick"), ("tijolos_rocha_lunar_entalhados", "chiseled_moon_rock_brick"),
               ("ardosia_lunar_pedregulho", "cobbled_lunaslate"), ("minerio_safira_lunar", "lunar_sapphire_ore"), ("bloco_safira_lunar", "lunar_sapphire_block"),
               ("vidro_lunar", "moon_glass")):
    unica(i, b + rel)
faces("ardosia_lunar", b + "lunaslate", b + "lunaslate", b + "lunaslate_top")
faces("pilar_rocha_lunar", b + "moon_rock_pillar_side", b + "moon_rock_pillar_side", b + "moon_rock_pillar_top")
item("safira_lunar", it + "lunar_sapphire")

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text(encoding="utf-8")) if arq.exists() else {}
todos["galacticraft5"] = sorted(set(todos.get("galacticraft5", [])) | set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
shutil.copyfile(G / "LICENSE", RAIZ / "docs/licencas/galacticraft5.txt")
print("galacticraft 5:", len(usados), "trocas;", "faltou:", faltou)

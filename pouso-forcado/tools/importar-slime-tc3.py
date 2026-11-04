#!/usr/bin/env python3
"""Tinkers' Construct 3.12.1 (MIT, inclusive a arte), parte 2 do Tinkers completo (1.27.0): o mundo dos slimes.

- Arte: terra, grama, folhas, capim e trepadeira de slime (o mod pinta as folhas e a grama com a cor de cada tipo,
  FoliageType.java: terra 8CD782, céu 00F4DA, icor D09800, ender A92DFF, sangue B80000), troncos e tábuas, mudas, slime
  congelado, blocos de slime, cristais dos geodos, bolas de slime e cristais, e os slimes (entity/*.png).
- Ilhas: as 20 ilhas do mod (structures/islands/<tipo>/*.nbt, 5 formatos para cada um dos 4 tipos) viram
  BP/structures/cl/ilha_slime_<tipo>_<n>.mcstructure, com as árvores, o capim e as trepadeiras nos marcadores do mod
  (slime_tree, slime_tall_grass, slime_vine), como o mod faz ao gerar (árvore de slime: tronco de 4+0..3 (terra) ou
  5+0..4 (céu), copa de folhas). As features e as regras ficam em tools/gerar-geracao.py.
  python3 tools/importar-slime-tc3.py <pasta do Tinkers clonado>
"""
import json
import random
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import nbt_java as N  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else sys.exit("uso: python3 tools/importar-slime-tc3.py <pasta do Tinkers>")
T = SRC / "src/main/resources/assets/tconstruct/textures"
ISL = SRC / "src/generated/resources/data/tconstruct/structures/islands"
ITENS = RAIZ / "RP/textures/items/cl/arte"
BLOCOS = RAIZ / "RP/textures/blocks/cl/arte"
ENT = RAIZ / "RP/textures/entity/cl"
for p in (ITENS, BLOCOS, ENT):
    p.mkdir(parents=True, exist_ok=True)

FOLHAGEM = {"terra": "8CD782", "ceu": "00F4DA", "icor": "D09800", "ender": "A92DFF", "sangue": "B80000"}
TC = {"terra": "earth", "ceu": "sky", "icor": "ichor", "ender": "ender", "sangue": "blood"}
MADEIRA = {"verdecoracao": "greenheart", "raizceu": "skyroot", "cogusangue": "bloodshroom", "cascaender": "enderbark"}
usados = []


def abrir(rel):
    im = Image.open(T / (rel + ".png")).convert("RGBA")
    return im.crop((0, 0, im.width, im.width)) if im.height > im.width else im


def tingir(im, cor):
    r, g, b = (int(cor[i:i + 2], 16) for i in (0, 2, 4))
    out = Image.new("RGBA", im.size)
    pi, po = im.load(), out.load()
    for y in range(im.height):
        for x in range(im.width):
            pr, pg, pb, a = pi[x, y]
            v = (pr + pg + pb) / 765
            po[x, y] = (int(r * v), int(g * v), int(b * v), a)
    return out


def salvar(im, pasta, nome):
    im.save(pasta / f"{nome}.png")
    usados.append(nome)


# ---------- Arte ----------
for t, tc in TC.items():
    cor = FOLHAGEM[t]
    if t != "sangue":
        salvar(abrir(f"block/slime/dirt/{tc}"), BLOCOS, f"terra_slime_{t}")
        salvar(abrir(f"item/materials/{tc}_slime_crystal"), ITENS, f"cristal_slime_{t}")
        salvar(abrir(f"block/geode/{tc}/block"), BLOCOS, f"bloco_cristal_slime_{t}")
        salvar(abrir(f"block/geode/{tc}/budding"), BLOCOS, f"cristal_slime_brotando_{t}")
        salvar(abrir(f"block/geode/{tc}/cluster"), BLOCOS, f"cacho_cristal_slime_{t}")
    # Grama: o lado é a terra com a franja de grama pintada; em cima, o topo pintado; embaixo, a terra.
    terra = {"terra": "earth", "ceu": "earth", "icor": "ichor", "ender": "ender", "sangue": "ichor"}[t]
    lado = Image.alpha_composite(abrir(f"block/slime/dirt/{terra}"), tingir(abrir("block/slime/dirt/grass_overlay"), cor))
    salvar(lado, BLOCOS, f"grama_slime_{t}")
    salvar(tingir(abrir("block/slime/dirt/grass_top"), cor), BLOCOS, f"grama_slime_{t}_topo")
    salvar(abrir(f"block/slime/dirt/{terra}"), BLOCOS, f"grama_slime_{t}_baixo")
    salvar(tingir(abrir("block/slime/foliage/leaves"), cor), BLOCOS, f"folhas_slime_{t}")
    salvar(tingir(abrir("block/slime/foliage/tall_grass"), cor), BLOCOS, f"capim_slime_{t}")
    salvar(abrir(f"block/slime/sapling/{tc}"), BLOCOS, f"muda_slime_{t}")
    salvar(abrir(f"block/slime/storage/congealed_{tc}"), BLOCOS, f"slime_congelado_{t}")
    if t != "terra":
        salvar(abrir(f"block/slime/storage/{tc}"), BLOCOS, f"bloco_slime_{t}")
        salvar(abrir(f"item/materials/{tc}_slime_ball"), ITENS, f"bola_slime_{t}")
for t in ("ceu", "ender"):
    salvar(tingir(abrir("block/slime/foliage/vine"), FOLHAGEM[t]), BLOCOS, f"trepadeira_slime_{t}")
for m, tc in MADEIRA.items():
    salvar(abrir(f"block/wood/{tc}/log"), BLOCOS, f"tronco_{m}")
    salvar(abrir(f"block/wood/{tc}/log_top"), BLOCOS, f"tronco_{m}_topo")
    salvar(abrir(f"block/wood/{tc}/planks"), BLOCOS, f"tabuas_{m}")
for nome, tc in (("slime_ceu", "sky_slime"), ("slime_ender", "ender_slime"), ("terracubo", "terracube")):
    Image.open(T / f"entity/{tc}.png").convert("RGBA").save(ENT / f"{nome}.png")
    usados.append(f"entidade_{nome}")


# ---------- Ilhas ----------
def bloco_tag(nome, states):
    def tag(v):
        if isinstance(v, bool):
            return N.byte(1 if v else 0)
        if isinstance(v, int):
            return N.int_(v)
        return N.string(str(v))
    return N.comp({"name": N.string(nome), "states": N.comp({k: tag(v) for k, v in states.items()}), "version": N.int_(18481152)})


def salvar_estrutura(blocos, X, Y, Z, caminho):
    paleta, indices, camada = [], {}, []
    for x in range(X):
        for y in range(Y):
            for z in range(Z):
                v = blocos.get((x, y, z))
                if v is None:
                    camada.append(-1)
                    continue
                nome, st = v
                k = json.dumps([nome, st], sort_keys=True)
                if k not in indices:
                    indices[k] = len(paleta)
                    paleta.append(bloco_tag(nome, st))
                camada.append(indices[k])
    raiz = N.comp({
        "format_version": N.int_(1),
        "size": N.lista(3, [N.int_(X), N.int_(Y), N.int_(Z)]),
        "structure": N.comp({
            "block_indices": N.lista(9, [N.lista(3, [N.int_(i) for i in camada]), N.lista(3, [N.int_(-1) for _ in camada])]),
            "entities": N.lista(10, []),
            "palette": N.comp({"default": N.comp({"block_palette": N.lista(10, paleta), "block_position_data": N.comp({})})}),
        }),
        "structure_world_origin": N.lista(3, [N.int_(0), N.int_(0), N.int_(0)]),
    })
    caminho.write_bytes(N.escrever(raiz))


# Tipo da ilha -> (folhagem do capim, tronco, folhas, árvore: base, aleatório, trepadeira)
ILHAS = {
    "earth": ("terra", "tronco_verdecoracao", "folhas_slime_terra", 4, 3, None),
    "sky": ("ceu", "tronco_raizceu", "folhas_slime_ceu", 5, 4, "trepadeira_slime_ceu"),
    "ender": ("ender", "tronco_cascaender", "folhas_slime_ender", 5, 3, "trepadeira_slime_ender"),
    "blood": ("sangue", "tronco_cogusangue", "folhas_slime_sangue", 4, 3, None),
}
PT = {"earth": "terra", "sky": "ceu", "ichor": "icor", "ender": "ender", "blood": "sangue"}


def converter(nome):
    """Bloco do TC3 -> bloco do pack (ou None)."""
    n = nome.split(":")[1]
    if nome == "minecraft:magma_block":
        return "minecraft:magma"
    if n.endswith("_slime_dirt"):
        return f"cl:terra_slime_{PT[n.split('_')[0]]}"
    if n.endswith("_slime_grass"):
        return f"cl:grama_slime_{PT[n.split('_')[0]]}"
    if n.endswith("_congealed_slime"):
        return f"cl:slime_congelado_{PT[n.split('_')[0]]}"
    if n == "magma_fluid":
        return "minecraft:magma"
    if n.endswith("_slime_fluid"):
        t = PT[n.split("_")[0]]
        return "minecraft:slime" if t == "terra" else f"cl:bloco_slime_{t}"
    return None


def arvore(blocos, x, y, z, tronco, folhas, base, aleatorio, trep, rnd, X, Y, Z):
    altura = base + rnd.randint(0, aleatorio)
    for k in range(altura):
        if y + k < Y:
            blocos[(x, y + k, z)] = (f"cl:{tronco}", {"pillar_axis": "y"})
    topo = y + altura
    for dy, r in ((-2, 2), (-1, 2), (0, 1), (1, 1)):
        yy = topo + dy
        for dx in range(-r, r + 1):
            for dz in range(-r, r + 1):
                if abs(dx) == r and abs(dz) == r and (r == 1 or rnd.random() < 0.6):
                    continue
                p = (x + dx, yy, z + dz)
                if 0 <= p[0] < X and 0 <= yy < Y and 0 <= p[2] < Z and p not in blocos:
                    blocos[p] = (f"cl:{folhas}", {})
                    if trep and r == 2 and (abs(dx) == 2 or abs(dz) == 2) and rnd.random() < 0.15 and yy - 1 >= 0 and (p[0], yy - 1, p[2]) not in blocos:
                        blocos[(p[0], yy - 1, p[2])] = (f"cl:{trep}", {})


saida = RAIZ / "BP/structures/cl"
lista = {}
for tipo, (folh, tronco, folhas, base, aleat, trep) in ILHAS.items():
    lista[tipo] = []
    for i, arq in enumerate(sorted((ISL / tipo).glob("*.nbt"))):
        d = N.ler(arq)
        pal = (d.get("palettes") or [d.get("palette")])[0]
        X, Y, Z = d["size"]
        Y += 9  # espaço para as árvores
        rnd = random.Random(f"{tipo}{i}")
        blocos, marcas = {}, []
        for b in d["blocks"]:
            nome = pal[b["state"]]["Name"]
            x, y, z = b["pos"]
            if nome == "minecraft:structure_block":
                marcas.append((str(b.get("nbt", {}).get("metadata", "")), x, y, z))
                continue
            c = converter(nome)
            if c:
                blocos[(x, y, z)] = (c, {})
        for meta, x, y, z in marcas:
            if meta.endswith("slime_tree"):
                arvore(blocos, x, y, z, tronco, folhas, base, aleat, trep, rnd, X, Y, Z)
            elif meta.endswith("slime_tall_grass") and rnd.random() < 0.5 and (x, y, z) not in blocos:
                blocos[(x, y, z)] = (f"cl:capim_slime_{folh}", {})
            elif meta.endswith("slime_vine") and trep:
                for k in range(rnd.randint(1, 3)):
                    if y - k >= 0 and (x, y - k, z) not in blocos:
                        blocos[(x, y - k, z)] = (f"cl:{trep}", {})
        nome = f"ilha_slime_{PT[tipo]}_{i}"
        salvar_estrutura(blocos, X, Y, Z, saida / f"{nome}.mcstructure")
        lista[tipo].append({"nome": nome, "tamanho": [X, Y, Z]})
(RAIZ / "tools/dados/ilhas_slime.json").write_text(json.dumps(lista, indent=1), encoding="utf-8")

arq = RAIZ / "docs/licencas/usados.json"
todos = json.loads(arq.read_text()) if arq.exists() else {}
todos["tinkers3_slime"] = sorted(set(usados))
arq.write_text(json.dumps(todos, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")
print(f"slime do tinkers 3: {len(usados)} artes, {sum(len(v) for v in lista.values())} ilhas")

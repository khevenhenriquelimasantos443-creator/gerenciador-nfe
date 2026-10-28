# Importa os ícones desenhados fora (um .zip por fase, já descompactado) para RP/textures/items/cl/arte/.
# Esses ícones têm prioridade sobre os gerados (tools/aplicar-icones.mjs, no build).
#   itens/<id>.png        128x128 em grade de 32x32 -> arte/<id>.png (32x32, sem perder pixel)
#   blocos_menu/<id>.png  128x128 isométrico        -> arte/blocos/<id>.png (64x64; Catálogo e menus)
#   itens/ovo_<monstro>   ovo do monstro            -> arte/ovo_<monstro>.png (ovo de criar do jogo)
#   blocos_faces/<bloco>[_frente|_lado|_topo|_baixo].png -> RP/textures/blocks/cl/arte/ (só blocos das Fases 15+,
#                         que são cubos; as máquinas antigas têm modelo próprio) e planta_<id>_<0|1|2>.png das plantações.
#                         Um cubo com as 4 faces passa a usar cada uma e vira de frente para quem coloca (gerar-conteudo).
# Nomes que vieram diferentes dos IDs do jogo são trocados por SINONIMOS; o resto é listado no fim.
# Não roda no build (precisa de Python + Pillow):
#   python3 tools/importar-icones.py <pasta do pacote>
import os, sys
from PIL import Image

R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SAIDA = os.path.join(R, "RP/textures/items/cl/arte")
MONSTROS = {"mumia", "escorpiao", "golem_areia", "farao"}
# nome no pacote -> id no jogo
SINONIMOS = {
    "agua_salgada": "agua_impropria", "bicho_da_seda": "bicho_seda", "bicho_da_seda_cozido": "bicho_seda_cozido",
    "burrito_feijao": "burrito", "filtro_ar": "filtro", "mascara_gas": "mascara", "cobre_pedaco": "cobre_quebrado",
    "po_cobre": "cobre_po", "po_ferro": "ferro_po", "po_ouro": "ouro_po", "farinha_trigo": "farinha",
    "pimenta_verde": "pimentao", "semente_cacto": "semente_fruta_cacto",
}
# blocos_menu -> id do bloco; os que no jogo são itens vão para os itens
MENU = {"terminal_armazenamento": "terminal"}
MENU_ITEM = {"organizador", "motor_nave"}
# itens do pacote que no jogo são utensílios (blocos): viram o ícone de menu do bloco
ITEM_BLOCO = {"panela": "panela", "frigideira": "frigideira", "tigela": "tigela_mistura"}


def item(src):
    im = Image.open(src).convert("RGBA")
    lado = im.width // 4 if im.width >= 128 else im.width
    return im.resize((lado, lado), Image.NEAREST)


def menu(src):
    im = Image.open(src).convert("RGBA")
    im = im.crop(im.getbbox())
    lado = max(im.size)
    quad = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    quad.alpha_composite(im, ((lado - im.width) // 2, (lado - im.height) // 2))
    return quad.resize((64, 64), Image.LANCZOS)


def main(pacote):
    os.makedirs(f"{SAIDA}/blocos", exist_ok=True)
    itens_jogo = {f[:-5] for f in os.listdir(f"{R}/BP/items")}
    blocos_jogo = {f[:-5] for f in os.listdir(f"{R}/BP/blocks")}
    feitos, ignorados = set(), []
    pasta = f"{pacote}/itens"
    for arq in sorted(os.listdir(pasta)) if os.path.isdir(pasta) else []:
        nome = arq[:-4]
        # Sinônimo só vale se o nome não for um item do jogo: po_ferro (Thermal) e ferro_po (Ex Nihilo) são itens diferentes.
        id = nome if nome in itens_jogo else SINONIMOS.get(nome, nome)
        if nome in ITEM_BLOCO:
            item(f"{pasta}/{arq}").resize((64, 64), Image.NEAREST).save(f"{SAIDA}/blocos/{ITEM_BLOCO[nome]}.png")
            continue
        if id in itens_jogo or (id.startswith("ovo_") and id[4:] in MONSTROS):
            item(f"{pasta}/{arq}").save(f"{SAIDA}/{id}.png")
            feitos.add(id)
        else:
            ignorados.append(nome)
    pasta = f"{pacote}/blocos_menu"
    nb = 0
    for arq in sorted(os.listdir(pasta)) if os.path.isdir(pasta) else []:
        nome = arq[:-4]
        if nome in MENU_ITEM and nome not in feitos:
            menu(f"{pasta}/{arq}").resize((32, 32), Image.LANCZOS).save(f"{SAIDA}/{nome}.png")
            feitos.add(nome)
            continue
        id = MENU.get(nome, nome)
        if id in blocos_jogo:
            menu(f"{pasta}/{arq}").save(f"{SAIDA}/blocos/{id}.png")
            nb += 1
        else:
            ignorados.append(f"blocos_menu/{nome}")
    faces = f"{pacote}/blocos_faces"
    nf = 0
    if os.path.isdir(faces):
        destino = os.path.join(R, "RP/textures/blocks/cl/arte")
        os.makedirs(destino, exist_ok=True)
        for arq in sorted(os.listdir(faces)):
            nome = arq[:-4]
            bloco = nome.rsplit("_", 1)[0] if nome.rsplit("_", 1)[-1] in ("frente", "lado", "topo", "baixo") else nome
            # Plantações: planta_<id>_<estágio> substitui a textura do HarvestCraft (RP/textures/blocks/cl/hc/<id>_<estágio>).
            planta = nome.startswith("planta_") and os.path.exists(f"{R}/RP/textures/blocks/cl/hc/{nome[7:]}.png")
            # Cubo com as 4 faces desenhadas (frente, lado, topo, baixo): o gerar-conteudo passa a usar cada uma.
            quatro = bloco != nome and bloco in blocos_jogo
            if planta or quatro or os.path.exists(f"{R}/RP/textures/blocks/cl/c/{nome}.png"):
                im = Image.open(f"{faces}/{arq}").convert("RGBA")
                if im.width > 32:
                    im = im.resize((32, 32), Image.NEAREST if im.width % 32 == 0 else Image.LANCZOS)
                im.save(f"{destino}/{nome}.png")
                nf += 1
            else:
                ignorados.append(f"blocos_faces/{nome} ({bloco})")
    print(f"faces de bloco: {nf}")
    faltam = sorted(itens_jogo - feitos - {f[:-4] for f in os.listdir(SAIDA) if f.endswith(".png")})
    print(f"importados: {len(feitos)} itens, {nb} blocos")
    print(f"ignorados (não existem no jogo): {', '.join(ignorados) or 'nenhum'}")
    print(f"itens sem ícone novo (ficam com o gerado): {', '.join(faltam) or 'nenhum'}")


if __name__ == "__main__":
    main(sys.argv[1])

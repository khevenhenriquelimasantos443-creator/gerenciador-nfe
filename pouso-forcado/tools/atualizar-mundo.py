#!/usr/bin/env python3
"""Atualiza um mundo Pouso Forçado exportado do jogo (.mcworld) para a versão do build atual, sem perder nada.

Uso (depois do `npm run build`):
    python3 tools/atualizar-mundo.py <mundo exportado.mcworld> [saída.mcworld]

O mundo leva dentro dele uma cópia dos packs da versão em que foi criado, e o jogo usa essa cópia mesmo depois de
importar uma versão nova. Aqui só os packs do Pouso Forçado (reconhecidos pelo UUID) são trocados pelos do
dist/pouso-forcado.mcworld e as versões em world_behavior_packs.json / world_resource_packs.json são atualizadas.
O mapa (db/), o level.dat e o resto ficam como estão; o nome do mundo ganha a versão (" (1.16.1)") só se o level.dat
for regravado byte a byte igual (senão o nome fica o mesmo). Importar o arquivo novo cria uma cópia: o mundo
original continua no celular.
"""
import json
import struct
import sys
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from nbt_java import Tag, escrever, ler_le  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
NOVO = RAIZ / "dist" / "pouso-forcado.mcworld"


def manifesto(z, nome):
    try:
        return json.loads(z.read(nome).decode("utf-8-sig"))["header"]
    except (KeyError, ValueError):
        return None


def packs_do_pouso(z):
    """{"behavior": (pasta, uuid, versao), "resource": ...} dos packs do Pouso Forçado dentro do zip."""
    achados = {}
    for nome in z.namelist():
        partes = nome.split("/")
        if len(partes) == 3 and partes[0] in ("behavior_packs", "resource_packs") and partes[2] == "manifest.json":
            h = manifesto(z, nome)
            if h:
                achados.setdefault(partes[0].split("_")[0], []).append((partes[1], h["uuid"], h["version"]))
    return achados


def renomear(level_dat, sufixo):
    """level.dat com LevelName + sufixo, ou None se a regravação não sair idêntica ao original."""
    cab, corpo = level_dat[:8], level_dat[8:]
    try:
        raiz = ler_le(corpo)
        if escrever(raiz) != corpo:
            return None
        nome = raiz.v.get("LevelName")
        if not nome or nome.tipo != 8:
            return None
        if not nome.v.endswith(sufixo):
            base = nome.v.split(" (")[0]
            raiz.v["LevelName"] = Tag(8, base + sufixo)
        novo = escrever(raiz)
    except Exception:  # tipo de tag que o leitor não conhece: não mexe
        return None
    return struct.pack("<ii", struct.unpack("<i", cab[:4])[0], len(novo)) + novo


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    entrada = Path(sys.argv[1])
    novo = zipfile.ZipFile(NOVO)
    nossos = packs_do_pouso(novo)
    uuids = {t: lista[0][1] for t, lista in nossos.items()}
    versoes = {t: lista[0][2] for t, lista in nossos.items()}
    versao = ".".join(map(str, versoes["behavior"]))
    saida = Path(sys.argv[2]) if len(sys.argv) > 2 else RAIZ / "dist" / f"{entrada.stem}_{versao}.mcworld"

    velho = zipfile.ZipFile(entrada)
    nomes = velho.namelist()
    # Mundo exportado dentro de uma pasta (alguns apps de arquivo fazem isso): acha a raiz pelo level.dat.
    raiz = next((n[: -len("level.dat")] for n in nomes if n.endswith("level.dat") and n.count("/") <= 1), None)
    if raiz is None:
        sys.exit("não achei o level.dat: isso não parece um mundo do Minecraft")
    tira = lambda n: n[len(raiz):]  # noqa: E731
    seus = {}
    for nome in nomes:
        partes = tira(nome).split("/")
        if len(partes) == 3 and partes[0] in ("behavior_packs", "resource_packs") and partes[2] == "manifest.json":
            h = manifesto(velho, nome)
            if h:
                seus[(partes[0], partes[1])] = (h["uuid"], h["version"])
    trocar = {k: v for k, v in seus.items() if v[0] in uuids.values()}
    if not trocar:
        sys.exit("este mundo não tem os packs do Pouso Forçado dentro dele")
    for (tipo, pasta), (_, v) in sorted(trocar.items()):
        print(f"{tipo}/{pasta}: {'.'.join(map(str, v))} -> {versao}")

    with zipfile.ZipFile(saida, "w", zipfile.ZIP_DEFLATED) as z:
        for info in velho.infolist():
            n = tira(info.filename)
            if not n:
                continue
            partes = n.split("/")
            if len(partes) >= 2 and (partes[0], partes[1]) in trocar:
                continue  # pack antigo: sai, entra o novo abaixo
            dados = velho.read(info.filename)
            if n in ("world_behavior_packs.json", "world_resource_packs.json"):
                tipo = n.split("_")[1]
                lista = json.loads(dados.decode("utf-8-sig") or "[]")
                for e in lista:
                    if e.get("pack_id") == uuids[tipo]:
                        e["version"] = versoes[tipo]
                if not any(e.get("pack_id") == uuids[tipo] for e in lista):
                    lista.append({"pack_id": uuids[tipo], "version": versoes[tipo]})
                dados = json.dumps(lista, indent=2).encode()
            elif n == "level.dat":
                renomeado = renomear(dados, f" ({versao})")
                print("nome do mundo:", "com a versão" if renomeado else "mantido")
                dados = renomeado or dados
            z.writestr(n, dados)
        # Os packs novos, na mesma pasta que os antigos ocupavam.
        for (tipo, pasta), _ in trocar.items():
            t = tipo.split("_")[0]
            origem = f"{tipo}/{nossos[t][0][0]}/"
            for info in novo.infolist():
                if info.filename.startswith(origem) and not info.is_dir():
                    z.writestr(f"{tipo}/{pasta}/{info.filename[len(origem):]}", novo.read(info.filename))
    print(f"pronto: {saida} ({saida.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()

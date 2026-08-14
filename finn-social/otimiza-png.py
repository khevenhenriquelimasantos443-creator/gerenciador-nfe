#!/usr/bin/env python3
"""Reduz os PNG do feed para paleta de 256 cores.

Motivo: os 20 posts entram embutidos em base64 dentro de finn-serve/index.js,
e o Worker da Cloudflare tem teto de 3 MiB comprimido. PNG de 24 bits saído do
Chromium ocupa ~2,5x o necessário para uma arte que é praticamente cor chapada
mais um degradê suave — quantizar devolve quase 500 KB de margem sem diferença
visível (conferido a olho no cartão com o degradê mais forte, o de fundo
escuro com brilho).

Dithering Floyd-Steinberg fica ligado de propósito: sem ele o brilho laranja
sobre o fundo azul vira anel, que é exatamente onde a economia apareceria.

Uso: python3 finn-social/otimiza-png.py arquivo.png [...]
"""
import sys

from PIL import Image


def otimiza(caminho):
    antes = __import__("os").path.getsize(caminho)
    im = Image.open(caminho).convert("RGB")
    q = im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
    q.save(caminho, optimize=True)
    depois = __import__("os").path.getsize(caminho)
    return antes, depois


def main(argv):
    if not argv:
        print("nada a fazer", file=sys.stderr)
        return 1
    total_antes = total_depois = 0
    for caminho in argv:
        antes, depois = otimiza(caminho)
        total_antes += antes
        total_depois += depois
    print(
        "png otimizado: %.0f KB -> %.0f KB (%.0f%% menor)"
        % (
            total_antes / 1024,
            total_depois / 1024,
            100 - total_depois * 100.0 / total_antes,
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

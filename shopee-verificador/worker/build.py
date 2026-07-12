#!/usr/bin/env python3
"""Gera worker/index.js embutindo o site (dashboard) dentro do Worker.

Uso:  python3 build.py
Lê   ../dashboard.html, ../dashboard.css, ../dashboard.js e worker-logic.js
Gera index.js (o arquivo que você cola no Cloudflare).
"""
import io
import json
import os
import re

AQUI = os.path.dirname(os.path.abspath(__file__))
EXT = os.path.dirname(AQUI)

css = io.open(os.path.join(EXT, 'dashboard.css'), encoding='utf-8').read()
js = io.open(os.path.join(EXT, 'dashboard.js'), encoding='utf-8').read()
html = io.open(os.path.join(EXT, 'dashboard.html'), encoding='utf-8').read()

body = re.search(r'<body>(.*)</body>', html, re.S).group(1)
body = body.replace('<link rel="stylesheet" href="dashboard.css">', '')
body = body.replace('<script src="dashboard.js"></script>', '')
body = body.replace(
    'Gerado pela extensão Verificador de Anúncios Shopee — os dados ficam só no seu navegador.',
    'Atualizado automaticamente pela extensão Verificador de Anúncios Shopee a cada varredura.')

site = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Painel de Anúncios — Shopee</title>
<style>
{css}
</style>
</head>
<body>
{body}
<script>window.SPX_SITE = true;</script>
<script>
{js}
</script>
</body>
</html>'''

logic = io.open(os.path.join(AQUI, 'worker-logic.js'), encoding='utf-8').read()
out = logic.replace('__SITE_HTML__', json.dumps(site, ensure_ascii=False))
io.open(os.path.join(AQUI, 'index.js'), 'w', encoding='utf-8').write(out)
print(f'index.js gerado ({len(out) // 1024} KB) — cole no Cloudflare ou rode "wrangler deploy".')

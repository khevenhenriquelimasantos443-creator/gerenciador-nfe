# Gera dist/texto/pouso-forcado_0_leia-me_artes.md: arquivo curto para revisar as artes e as telas no Google AI Studio
# (contexto, regras, paleta, o script das artes, a tela e os nineslices). Rode depois de tools/exportar-texto.py.
import json, re
from pathlib import Path

R = Path(__file__).resolve().parent.parent
ver = re.search(r'VERSAO = "([\d.]+)"', (R / "scripts/config.ts").read_text(encoding="utf-8")).group(1)
ler = lambda p: (R / p).read_text(encoding="utf-8")
txt = f"""# Pouso Forçado {ver}: revisão das artes e das telas (para o Google AI Studio)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Este arquivo é só para **revisar as artes e as telas**.
O add-on completo, em texto, está nos outros .md (código TypeScript, JSON do BP e do RP).

## O que pedir
Leia este arquivo e diga, em português do Brasil, **o que dá para ajustar ou melhorar** nas artes e nas telas descritas abaixo, sem inventar API, componente nem campo de JSON.
Se não tiver certeza de algo do Bedrock, diga isso em vez de chutar. Para cada sugestão: arquivo, o que mudar e por quê.

## Regras do projeto (não quebre)
- Resposta curta e direta, em português.
- Não renomear IDs (`cl:...`) nem chaves de textura: quebraria mundos salvos.
- Não mexer na tela de carregamento (`RP/ui/progress_screen.json` e `RP/textures/ui/cl/fundo_carregamento.png`): já está aprovada.
- Desempenho no celular primeiro: texturas 16×16, flipbooks pequenos, nada de efeito pesado.
- Não criar tela, item, bloco ou fluxo novo. Só melhorar o que existe.
- Não mudar balanceamento nem textos de missão.

## O que foi aplicado na {ver}
1. **9 animações (flipbooks), 16×16 por quadro, tira vertical** em `RP/textures/blocks/cl/v/`:
   tela_nave 8 quadros/3 ticks, tela_terminal 8/6, solar 8/5, rotor 8/2, brasa_on 6/3, forja 6/3, agua 8/4, lava 8/4, petroleo 8/5.
   (O rotor gira 90° ao longo dos 8 quadros: com 4 pás, girar 45° por quadro só alternava "+" e "×".)
2. **33 texturas estáticas 16×16** das máquinas, com sombra interna de 1 px no chassi, bateria com medidor de 3 LEDs e montadora com duas faixas.
3. **Texturas de UI dos controles do Diário** (`RP/textures/ui/cl/painel/*` e `diario_*`).
4. **114 ícones aprovados** (mochilas, melhorias, lingotes, comidas, Galacticraft) em `RP/textures/items/cl/arte/` e `RP/textures/blocks/cl/arte/`.

As artes 1 a 3 são geradas por `tools/gerar-artes-aprovadas.mjs` (código abaixo), no fim do `npm run build`. Os 114 ícones vêm de `tools/artes/*.mjs` (PNG embutidos em base64; não estão neste arquivo).

## Paleta e estilo
- Painel técnico escuro (`#141820`, relevo `#2a3342`/`#0c0f14`, contorno `#05070a`), barra de título em metal claro (`#94a3b8`), botão principal laranja (`#d97706`), botão secundário grafite (`#1e2531`), capítulo aberto com faixa laranja `#f59e0b`.
- Diário clássico em couro e latão (`#241a12`, bronze `#78350f`, listra `#f59e0b`), visor escuro (`#14100c`), campo de busca em pergaminho (`#ded2b2`).
- Máquinas: corpo branco-gelo/cinza-azulado, base grafite, uma luz da cor da função (ciano = energia, laranja = calor, azul = água, verde = vida, violeta = armazenamento).

## Lacunas conhecidas (o mockup mostra, o jogo não tem)
5º sistema da nave ("Salto"; o jogo tem 4), grade 3×3 de receita e cantoneiras no Catálogo, 3º interruptor e botão "APLICAR FILTRO" da busca, scanlines do monitor.

## Perguntas úteis
- As texturas 16×16 têm contraste e leitura boas num celular? Alguma está confusa ou parecida demais com outra?
- Os flipbooks têm movimento claro? Algum quadro dá "pulo" ou é rápido/lento demais?
- Os nineslices da UI (tamanho base, fatia) estão coerentes com o PNG? Algum botão ou texto em português pode estourar a caixa?
- Algum botão da UI é pequeno demais para o toque (o fechar é 18×18 unidades)? Alguma cor tem contraste fraco com o texto?

---

## Código: tools/gerar-artes-aprovadas.mjs
```js
{ler("tools/gerar-artes-aprovadas.mjs")}
```

## Tela: RP/ui/server_form.json
```json
{json.dumps(json.loads(ler("RP/ui/server_form.json")), ensure_ascii=False, separators=(",", ":"))}
```

## flipbook_textures.json (as 9 animações do Pouso Forçado)
```json
{json.dumps([e for e in json.loads(ler("RP/textures/flipbook_textures.json")) if "/cl/v/" in e["flipbook_texture"]], ensure_ascii=False, indent=1)}
```

## Nineslices da UI
```json
{json.dumps({str(p.relative_to(R)): json.loads(p.read_text()) for p in sorted((R / "RP/textures/ui/cl").rglob("*.json"))}, ensure_ascii=False, indent=1)}
```
"""
(R / "dist/texto/pouso-forcado_0_leia-me_artes.md").write_text(txt, encoding="utf-8")
print(f"leia-me das artes: {len(txt) // 1024} KB")

# Artes aprovadas (ícones, comidas, Galacticraft e os 555 ícones novos)

Os scripts desta pasta gravam PNG 16×16 em `RP/textures/items/cl/` e `RP/textures/blocks/cl/`:

- `gerar-artes.mjs`: mochilas, melhorias das mochilas, lingotes, blocos de liga, pedregulho comprimido e algumas ferramentas;
- `gerar-comidas.mjs`: águas e comidas;
- `gerar-galacticraft.mjs`: placas, tanques de oxigênio, foguete, minérios e blocos lunares;
- `gerar-artes-555.mjs` (1.55.1): os 555 ícones da lista `docs/icones-refazer` (gerados por fórmula, HarvestCraft 2 e os desenhados por script).

Os caminhos foram ajustados de `cl/c/` para `cl/arte/`: o `gerar-conteudo.mjs` reescreve `cl/c/` (ícones gerados) em todo build, e `cl/arte/` é a camada de arte desenhada, que o `aplicar-icones.mjs` liga sozinho aos itens e blocos.

Foram rodados uma vez (`node tools/artes/<script>.mjs`, na pasta `pouso-forcado`) e os PNG foram para o repositório.
**Não** fazem parte do `npm run build`, para o build não apagar um ícone que você trocar depois.
As animações (flipbooks) e as texturas das máquinas vêm de `tools/gerar-artes-aprovadas.mjs`, que roda no build.

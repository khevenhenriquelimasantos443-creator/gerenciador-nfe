# Pouso Forçado: ícones para refazer (0 ícones, 0 partes)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Estes ícones de item ainda são
**desenho gerado por fórmula** (pó, chapa, cilindro, comida...) e ficaram genéricos ou estranhos. O resto dos ícones é a
arte original dos mods ou arte já aprovada e **não** entra aqui.

## O que pedir (mande uma parte por vez)
Faça um script Node.js (`.mjs`) igual ao das artes aprovadas: uma lista `ARTES` com `{ "path", "base64" }` e um laço que
grava cada PNG. Para cada ícone da parte:
- `path`: `RP/textures/items/cl/arte/<arquivo>` (o nome do arquivo da tabela, sem mudar nada: é o ID do item no jogo);
- `base64`: PNG **16×16**, fundo transparente.

## Estilo (o mesmo das 114 artes aprovadas)
- Pixel art de item do Minecraft, 16×16, legível no celular: silhueta clara, contorno escuro de 1 px, luz de cima à esquerda.
- Poucas cores por ícone, sem anti-aliasing e sem pixel semitransparente na borda.
- Coisas da mesma família ficam com a mesma forma e mudam só a cor (todos os cilindros iguais com a cor do conteúdo,
  todos os baldes iguais, todos os pós iguais...), como nos mods.
- Comida do HarvestCraft: desenhe o prato de verdade (torta, sanduíche, suco no copo, semente no pacotinho...) pelo nome
  em inglês, que é o do mod.
- Não use nem copie a arte original do mod (é fechada): desenho próprio que só lembra o original.

## Regras
- Não renomear arquivos nem IDs (quebraria os mundos salvos).
- Responda só com o script, em um bloco de código, sem explicação.


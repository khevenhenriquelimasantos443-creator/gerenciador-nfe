# Pendências

Atualizado na 1.6.0.

## Esperando o jogador (prints do celular)

- **Diário 1.5.1:** a visão geral e a tela de uma missão aberta (caixinha do objetivo, barra de progresso, recompensa). Conferir se o texto do corpo apareceu e se as linhas entre as colunas e no rodapé saíram inteiras.
- **Outras telas no visual de painel da 1.4.0:** Catálogo, Opções, Terminal e as máquinas.
- **Logo na tela de "Carregando...":** se o "POUSO FORÇADO" aparece ou se fica o do Minecraft (o fundo já foi confirmado).
- **Lua (1.6.0):** a cor do céu. A dimensão nova usa o bioma "oceano" padrão do jogo, e mudar o céu dele estragaria os oceanos de quem usa o add-on num mundo normal; por isso o horizonte fica escuro só pela névoa preta. Ver no celular se ficou bom ou se o céu azul incomoda.
- **Viagem de foguete (1.6.0):** testada no servidor com jogador simulado (vai, pousa e volta). Falta ver a cena com a câmera no celular.

## Plano (decidido na 1.6.0)

O jogador escolheu: o Galacticraft vai **só até a Lua**; dos mods da proposta entram todos **menos o Lycanites**; e entram também **Ender IO**, **todos os add-ons do Mekanism** e o **Create**. Detalhes em `docs/proposta-galacticraft.md`.

| Versão | O que entra | Situação |
|---|---|---|
| 1.6.0 | Galacticraft: alumínio, compressor, placas, wafers, oxigênio, Bancada da NASA, plataforma, carregador, Foguete Tier 1, a Lua (terreno e gravidade), ida e volta | pronta |
| 1.6.1 | A Lua de verdade: meteoros, monstros evoluídos, base de pesquisa com masmorra e chefe, distribuidor de bolha de oxigênio | próxima |
| 1.6.2 | Final novo: bobina de salto queimada, Núcleo de Salto, "Saltar para casa" | |
| 1.7.0 | Add-ons do Mekanism: Generators, Tools, Additions | |
| 1.8.0 | Ender IO | |
| 1.9.0 | Create | |
| 1.10.0 | Waystones, Mochilas, Robô Minerador (ComputerCraft leve), pedaços do Extra Utilities, redemoinhos do Weather2 | |

## Feito por último

- Wiki do modpack: https://pouso-forcado.vercel.app (fonte em `docs/wiki/wiki.fonte.html`, montada por `tools/gerar-wiki.py`). Atualizar a cada versão com mecânica nova.

## Decidido

- De dia, todo monstro da superfície se enterra na areia, inclusive o que estiver atacando o jogador (pedido: nenhum mob hostil de manhã e de tarde).
- Texturas originais dos mods com licença livre: não usar; o projeto fica com a arte própria, que é uniforme.
- Galacticraft só até a Lua (sem estação espacial nem Marte). Sem o Lycanites.

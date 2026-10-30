# Pendências

Atualizado na 1.8.0.

## Esperando o jogador (prints do celular)

- **Diário 1.5.1:** a visão geral e a tela de uma missão aberta (caixinha do objetivo, barra de progresso, recompensa). Conferir se o texto do corpo apareceu e se as linhas entre as colunas e no rodapé saíram inteiras.
- **Outras telas no visual de painel da 1.4.0:** Catálogo, Opções, Terminal e as máquinas.
- **Logo na tela de "Carregando...":** se o "POUSO FORÇADO" aparece ou se fica o do Minecraft (o fundo já foi confirmado).
- **Lua (1.6.0):** a cor do céu. A dimensão nova usa o bioma "oceano" padrão do jogo, e mudar o céu dele estragaria os oceanos de quem usa o add-on num mundo normal; por isso o horizonte fica escuro só pela névoa preta. Ver no celular se ficou bom ou se o céu azul incomoda.
- **Base lunar e chefe (1.6.1):** testados no servidor (a base é construída, o chefe acorda, deixa a chave e o baú dá o Núcleo). Falta ver no celular se a escada do poço ficou certa e se o chefe é difícil demais.
- **Armaduras do Mekanism Tools (1.7.0):** ver no celular se a cor de cada material ficou boa no corpo.
- **Mekanism Additions (1.11.0):** ver no celular se o Painel Brilhante fica encostado na face certa (teto, chão e paredes) e se a cor dos balões aparece.
- **Utilidades (1.10.0):** testadas no servidor (Pedra do Caminho com o Pergaminho de Retorno, túnel do robô, mochila guardando e devolvendo, varinha, regador, lixeira, bloco angelical e redemoinho). O jogador simulado não toca em entidades, então falta ver no celular: o botão Abrir da mochila, o toque no robô (abastecer e o menu dos programas) e a tela de nome da Pedra do Caminho logo depois de pôr. A Mochila Grande (54) do Backpacks ficou de fora: a tela de baú de entidade do Bedrock é de 27.
- **Viagem de foguete (1.6.0):** testada no servidor com jogador simulado (vai, pousa e volta). Falta ver a cena com a câmera no celular.

## Plano (decidido na 1.6.0)

O jogador escolheu: o Galacticraft vai **só até a Lua**; dos mods da proposta entram todos **menos o Lycanites**; e entram também **Ender IO**, **todos os add-ons do Mekanism** e o **Create**. Detalhes em `docs/proposta-galacticraft.md`.

| Versão | O que entra | Situação |
|---|---|---|
| 1.6.0 | Galacticraft: alumínio, compressor, placas, wafers, oxigênio, Bancada da NASA, plataforma, carregador, Foguete Tier 1, a Lua (terreno e gravidade), ida e volta | pronta |
| 1.6.1 | A Lua de verdade (meteoros, monstros evoluídos, base de pesquisa com masmorra e chefe, bolha de oxigênio) e o final novo (Bobina de Salto, Núcleo de Salto) | pronta |
| 1.7.0 | Add-ons do Mekanism da época do 1.6.4: Generators e Tools (o Additions só veio no 1.12) | pronta |
| 1.8.0 | Ender IO (ligas, Moinho SAG, Stirling, painéis, bancos de capacitores, Âncoras de Viagem, Aço Negro) | pronta |
| 1.9.0 | Create (Manivela, Roda d'Água, Moinho de Vento, eixos e engrenagens, Mó, Rodas Trituradoras, Prensa, Misturador, Ventilador, Furadeira, zinco e latão) | pronta |
| 1.10.0 | Waystones, Mochilas, Robô Minerador (ComputerCraft leve), pedaços do Extra Utilities, redemoinhos do Weather2 | pronta |
| 1.10.1–1.10.2 | Texturas originais dos mods que permitem; ícones parecidos para os outros | pronta |
| 1.11.0 | Mekanism Additions (plástico, painéis, balões, TNT de obsidiana, filhotes) e condutos do Ender IO | pronta |
| 1.12.0 | Farmer's Delight e Quark | pronta |
| 1.13.0 | Immersive Engineering e Immersive Aircraft | próxima |
| 1.14.0 | Sophisticated Backpacks (melhorias da mochila) e estruturas do YUNG's | |

## Feito por último

- Wiki do modpack: https://pouso-forcado.vercel.app (fonte em `docs/wiki/wiki.fonte.html`, montada por `tools/gerar-wiki.py`). Atualizar a cada versão com mecânica nova.

## Decidido

- De dia, todo monstro da superfície se enterra na areia, inclusive o que estiver atacando o jogador (pedido: nenhum mob hostil de manhã e de tarde).
- Texturas originais dos mods: **usar sempre que a licença deixar** (decidido na 1.10.1, mudando a decisão antiga de arte uniforme), inclusive nos mods que já estavam no pack. Os outros ficam com a arte própria, redesenhada parecida com a original quando der.
- Galacticraft só até a Lua (sem estação espacial nem Marte). Sem o Lycanites.

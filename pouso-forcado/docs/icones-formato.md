# Ícones: formato para gerar em outra IA

## O que eu preciso

**Só ícones de ITENS** (as coisas que ficam na mão e no inventário).

Blocos com modelo 3D (máquinas, panela, barril...) **não** precisam: o jogo mostra o próprio modelo, e o ícone dos menus eu tiro do modelo automaticamente. Se quiser mudar a cara de um bloco, isso é outra coisa: textura das faces. Combinamos à parte.

## Formato de cada arquivo

| O quê | Como |
|---|---|
| Tipo | **PNG** |
| Fundo | **Transparente de verdade** (canal alfa). Se a IA não fizer transparente, use **fundo magenta puro `#FF00FF`** liso, sem degradê, que eu recorto. Nada de quadriculado "falso transparente" desenhado na imagem |
| Tamanho final no jogo | **32×32 pixels**. Pode mandar maior (512 ou 1024): eu reduzo. O ideal é a IA já desenhar em "pixel art de 32×32" ampliada (cada pixel virando um quadradão) |
| Um item por arquivo | Sem grade com vários itens (se vier em grade, tudo bem, mas me diga a ordem) |
| Nome do arquivo | **Exatamente o da coluna "Arquivo"** da lista abaixo (ex.: `agua_boa.png`) |
| Enquadramento | Item centralizado, ocupando **~80% do quadro**, sem cortar nas bordas |
| Proibido | Texto, letras, números, moldura, borda de cartão, sombra no chão, fundo de cenário, marca d'água |

## Estilo (para todos ficarem iguais)

- **Pixel art de Minecraft**: pixels quadrados e nítidos, sem anti-aliasing, sem desfoque, sem degradê suave.
- **Vista**: o item de lado/frente, plano (como os itens do Minecraft). Ferramentas e cajados na **diagonal**, cabo embaixo à esquerda e ponta em cima à direita.
- **Contorno**: 1 pixel mais escuro da própria cor (não preto puro).
- **Luz**: vindo de cima à esquerda; lado de baixo à direita mais escuro.
- **Poucas cores**: no máximo ~12 a 16 cores por ícone.
- **Tema**: deserto seco + nave futurista. Peças da nave e máquinas em **branco-gelo, grafite e uma faixa de luz colorida** (ciano = energia, laranja = calor/motor, azul = água, verde = vida, roxo = armazenamento).

## Texto pronto para colar na outra IA

> Pixel art icon of **[DESCRIÇÃO DO ITEM]**, Minecraft item style, 32x32 pixel grid upscaled, crisp square pixels, no anti-aliasing, side view flat item, 1-pixel darker outline, light from top-left, limited palette (max 16 colors), centered, filling 80% of the canvas, fully transparent background (or flat pure magenta #FF00FF background), no text, no border, no shadow, no scenery.

Troque **[DESCRIÇÃO DO ITEM]** pela coluna "Como deve parecer" (pode escrever em inglês ou português).

## Como me mandar

- Um **.zip** com os PNGs, nomeados como na lista. Pode ser por partes (por fase).
- Eu reduzo para 32×32, limpo o fundo, coloco no pacote e te mostro uma prancha com todos antes de fechar a versão.
- Se algum não ficar bom no tamanho pequeno, eu aviso qual.

## Fases futuras (15 a 23)

Os itens ainda não têm nome de arquivo definido (a lista com descrição está em `docs/icones.md`). Duas opções:

1. **Gerar por fase**: no começo de cada fase eu passo a lista de arquivos dela (recomendado).
2. **Gerar já**: use o nome em português, minúsculo, sem acento e com `_` (ex.: `cabeca_picareta_bronze.png`), e eu ajusto os IDs para bater.

## Lista atual (Fases 0 a 14): 97 itens

| Arquivo | Nome no jogo | Como deve parecer |
|---|---|---|
| `agua_boa.png` | Água Boa | garrafa de vidro com água azul clara e limpa |
| `agua_excelente.png` | Água Excelente | garrafa com água azul gelada, brilho de frio |
| `agua_impropria.png` | Água Salgada | garrafa com água azul-acinzentada e cristais de sal brancos |
| `agua_muito_suja.png` | Água Muito Suja | garrafa com água marrom escura, quase lama |
| `agua_suja.png` | Água Suja | garrafa com água marrom-esverdeada turva |
| `alho.png` | Alho | alho (cor #efe8da) |
| `amendoim.png` | Amendoim | amendoim (cor #c99a5e) |
| `arroz.png` | Arroz | arroz (cor #f4f1e6) |
| `arroz_frito.png` | Arroz Frito | arroz frito (cor #efe0a6) |
| `bicho_seda.png` | Bicho-da-seda | larva branca gordinha |
| `bicho_seda_cozido.png` | Bicho-da-seda Cozido | larva dourada/torrada |
| `bolinho_arroz.png` | Bolinho de Arroz | bolinho de arroz (cor #f4f0e2) |
| `broa_milho.png` | Broa de Milho | broa de milho (cor #e9b949) |
| `burrito.png` | Burrito de Feijão | burrito de feijão (cor #7a3b2e) |
| `cadinho_cru.png` | Cadinho Cru | pote de argila cru, cinza-claro sem brilho |
| `cajado.png` | Cajado | cajado de madeira com ponta curva (gancho de pastor) |
| `caldo.png` | Caldo | caldo (cor #c9a46b) |
| `camel_pack.png` | Camel Pack | mochila de couro marrom com mangueirinha e bocal |
| `catalogo.png` | Catálogo | livro grosso com capa azul e lupa |
| `cebola.png` | Cebola | cebola (cor #c98a5a) |
| `celula_combustivel.png` | Célula de Combustível | cilindro metálico com faixa verde brilhante |
| `charque.png` | Charque | charque (cor #8b3a2a) |
| `chili_poppers.png` | Pimentas Empanadas | pimentas empanadas (cor #e0682f) |
| `circuito.png` | Circuito | placa de circuito verde com trilhas douradas |
| `cobre_po.png` | Pó de Minério de Cobre | montinho de pó laranja-cobre (fino) |
| `cobre_quebrado.png` | Pedaço Quebrado de Cobre | pedaço de cascalho cinza com pedaços laranja-cobre (graúdo) |
| `cobre_triturado.png` | Pedaço Triturado de Cobre | areia com grãos laranja-cobre (médio) |
| `computador_bordo.png` | Computador de Bordo | pequeno computador/tela com moldura grafite e tela ciano |
| `coracao_farao.png` | Coração do Faraó | coração dourado com joias e brilho maldito roxo |
| `diario_bordo.png` | Diário de Bordo | caderno de capa de couro marrom com fecho |
| `faixa_mumia.png` | Faixa de Múmia | tira de pano bege enrolada, um pouco suja |
| `farinha.png` | Farinha | farinha (cor #f3ead6) |
| `feijao.png` | Feijão | feijão (cor #7a3b2e) |
| `feijao_assado.png` | Feijão Assado | feijão assado (cor #8a3b23) |
| `ferro_po.png` | Pó de Minério de Ferro | montinho de pó bege-rosado com pontos de ferro (fino) |
| `ferro_quebrado.png` | Pedaço Quebrado de Ferro | pedaço de cascalho cinza com pedaços bege-rosado com pontos de ferro (graúdo) |
| `ferro_triturado.png` | Pedaço Triturado de Ferro | areia com grãos bege-rosado com pontos de ferro (médio) |
| `filtro.png` | Filtro de Ar | cartucho redondo de filtro de ar, cinza com centro preto |
| `fruta_cacto.png` | Fruta do Cacto | fruta rosa/magenta oval com pontinhos (pitaya do cacto) |
| `fuba.png` | Fubá | fubá (cor #f2c94c) |
| `hamburguer.png` | Hambúrguer | hambúrguer (cor #7a4a2a) |
| `maionese.png` | Maionese | maionese (cor #fbf3d0) |
| `manteiga.png` | Manteiga | manteiga (cor #f7e27a) |
| `martelo_cobre.png` | Martelo de Cobre | martelo de cabeça larga de cobre alaranjado com cabo de madeira, na diagonal |
| `martelo_diamante.png` | Martelo de Diamante | martelo de cabeça larga de diamante azul-claro com cabo de madeira, na diagonal |
| `martelo_ferro.png` | Martelo de Ferro | martelo de cabeça larga de ferro com cabo de madeira, na diagonal |
| `martelo_madeira.png` | Martelo de Madeira | martelo de cabeça larga de madeira com cabo de madeira, na diagonal |
| `martelo_ouro.png` | Martelo de Ouro | martelo de cabeça larga de ouro com cabo de madeira, na diagonal |
| `martelo_pedra.png` | Martelo de Pedra | martelo de cabeça larga de pedra cinza com cabo de madeira, na diagonal |
| `mascara.png` | Máscara de Gás | máscara de gás com dois filtros redondos e visor |
| `massa.png` | Massa | massa (cor #f3e2b8) |
| `massa_liquida.png` | Massa Líquida | massa líquida (cor #f5e3a8) |
| `milho.png` | Milho | milho (cor #f2c94c) |
| `milho_espiga.png` | Milho na Espiga | milho na espiga |
| `motor_nave.png` | Motor da Nave | motor/turbina futurista grafite com brilho laranja |
| `omelete.png` | Omelete | omelete (cor #f7d55c) |
| `organizador.png` | Organizador | baú pequeno com setas de ordenar |
| `ouro_po.png` | Pó de Minério de Ouro | montinho de pó amarelo-dourado (fino) |
| `ouro_quebrado.png` | Pedaço Quebrado de Ouro | pedaço de cascalho cinza com pedaços amarelo-dourado (graúdo) |
| `ouro_triturado.png` | Pedaço Triturado de Ouro | areia com grãos amarelo-dourado (médio) |
| `ovo_cozido.png` | Ovo Cozido | ovo cozido (cor #f6f1e4) |
| `ovo_frito.png` | Ovo Frito | ovo frito |
| `panquecas.png` | Panquecas | panquecas (cor #e0b26a) |
| `pedrinha.png` | Pedrinha | pedrinha cinza pequena |
| `pemmican.png` | Pemmican | pemmican (cor #6b3f25) |
| `pimenta.png` | Pimenta | pimenta (cor #d62d20) |
| `pimentao.png` | Pimentão | pimentão (cor #3fa34d) |
| `pimentao_recheado.png` | Pimentão Recheado | pimentão recheado (cor #3fa34d) |
| `pipoca.png` | Pipoca | pipoca |
| `placa_casco.png` | Placa de Casco | placa de metal branco-gelo com rebites |
| `porcelana.png` | Porcelana | bola de argila branca lisa |
| `queijo.png` | Queijo | queijo (cor #f4c542) |
| `sacola_boa.png` | Sacola Boa | saco de pano verde amarrado |
| `sacola_comum.png` | Sacola Comum | saco de pano bege amarrado |
| `sacola_epica.png` | Sacola Épica | saco de pano roxo amarrado com brilho |
| `sacola_lendaria.png` | Sacola Lendária | saco dourado amarrado com brilho forte |
| `sacola_otima.png` | Sacola Ótima | saco de pano azul amarrado |
| `sal.png` | Sal | sal (cor #ffffff) |
| `semente_alho.png` | Sementes de Alho | saquinho de sementes de alho (cor #efe8da no centro) |
| `semente_amendoim.png` | Sementes de Amendoim | saquinho de sementes de amendoim (cor #c99a5e no centro) |
| `semente_arroz.png` | Sementes de Arroz | saquinho de sementes de arroz (cor #f4f1e6 no centro) |
| `semente_cebola.png` | Sementes de Cebola | saquinho de sementes de cebola (cor #c98a5a no centro) |
| `semente_feijao.png` | Sementes de Feijão | saquinho de sementes de feijão (cor #7a3b2e no centro) |
| `semente_fruta_cacto.png` | Sementes de Fruta do Cacto | saquinho de sementes de fruta do cacto (cor #c2185b no centro) |
| `semente_milho.png` | Sementes de Milho | saquinho de sementes de milho (cor #f2c94c no centro) |
| `semente_pimenta.png` | Sementes de Pimenta | saquinho de sementes de pimenta (cor #d62d20 no centro) |
| `semente_pimentao.png` | Sementes de Pimentão | saquinho de sementes de pimentão (cor #3fa34d no centro) |
| `semente_tomate.png` | Sementes de Tomate | saquinho de sementes de tomate (cor #e0402f no centro) |
| `sopa_arroz.png` | Sopa de Arroz | sopa de arroz (cor #efe8d2) |
| `sopa_cacto.png` | Sopa de Cacto | sopa de cacto (cor #5a9a3a) |
| `sopa_legumes.png` | Sopa de Legumes | sopa de legumes (cor #c97a3a) |
| `sopa_tomate.png` | Sopa de Tomate | sopa de tomate (cor #d0392b) |
| `suco_cacto.png` | Suco de Fruta do Cacto | suco de fruta do cacto (cor #e0457b) |
| `taco.png` | Taco | taco (cor #e0402f) |
| `tomate.png` | Tomate | tomate (cor #e0402f) |
| `torrada.png` | Torrada | torrada (cor #d39a4a) |
| `tortilha.png` | Tortilha | tortilha (cor #e8c983) |

# Prompt para gerar todos os ícones e texturas (Pouso Forçado)

Copie tudo a partir de "PROMPT" e mande junto a **prancha anterior** como referência de estilo.
Peça uma fase por vez: Fases 0–14 primeiro, depois uma por mensagem, porque a lista é grande.
Os nomes de arquivo abaixo já são os IDs do jogo: não podem mudar.

---

## PROMPT

Você vai desenhar os ícones e as texturas de um add-on de Minecraft Bedrock chamado **Pouso Forçado**.

**A história:** uma nave cai num planeta de deserto. O jogo mistura sobrevivência (água, comida, peneira, plantações) e tecnologia (máquinas, energia, nave futurista).

**Estilo:** use **exatamente o estilo da prancha em anexo**:

- pixel art detalhado de Minecraft, com pixels quadrados e nítidos, sem anti-aliasing e sem desfoque;
- contorno de 1 pixel numa cor mais escura do próprio objeto (nunca preto puro);
- luz vindo de cima à esquerda; sombreado em 3 a 4 tons por cor;
- objetos tecnológicos em **branco-gelo e grafite com uma faixa de luz colorida**:
  - ciano = energia;
  - laranja = calor e motor;
  - azul = água;
  - verde = vida e plantas;
  - roxo = armazenamento;
- comida e coisas naturais com cores vivas e quentes;
- todos os itens precisam ter o **mesmo nível de detalhe** dos melhores da prancha (Camel Pack, Catálogo, Circuito, Coração do Faraó). Nada de "bolinhas simples".

### O que entregar (3 tipos)

**A. Ícone de ITEM**

- Desenhe numa grade de **32×32 pixels** e entregue ampliado 4× com vizinho mais próximo: **PNG de 128×128**.
- **Fundo 100% transparente** (canal alfa). Sem quadriculado desenhado.
- Um objeto por arquivo, centralizado, ocupando uns **80%** do quadro, com margem. **Nada cortado na borda.**
- Vista de lado/3-4, como os itens do Minecraft. Ferramentas na diagonal, com o cabo embaixo à esquerda.
- Pasta: `itens/`. Nome do arquivo: o da coluna "Arquivo".

**B. Ícone de MENU de bloco** (só para os blocos do tipo "máquina")

- Cubo ou objeto em **vista isométrica**, como os blocos da prancha (frente-esquerda e frente-direita visíveis, topo por cima).
- **PNG de 128×128, fundo 100% transparente.** Sem o retângulo azul-escuro atrás, sem sombra no chão.
- Pasta: `blocos_menu/`, arquivo `<id>.png`.

**C. TEXTURAS DE FACE de bloco** (para o jogo pintar o bloco no mundo)

- **32×32 pixels exatos**, opaco (sem transparência, exceto em vidro e plantas), e **emendável**: a borda da esquerda continua na da direita e a de cima na de baixo.
- Bloco **"cubo"**: um arquivo só, `<id>.png` (todas as faces iguais). Se o topo for diferente, mande `<id>_topo.png` e `<id>_lado.png`.
- Bloco **"máquina"**: `<id>_frente.png`, `<id>_lado.png`, `<id>_topo.png`, `<id>_baixo.png`.
  - São as faces de uma caixa que lembre o ícone de menu dele: mesma paleta e mesmos detalhes, só que planas, de frente.
- Pasta: `blocos_faces/`.
- **Plantas:** 3 estágios, `planta_<id>_0.png`, `_1.png` e `_2.png`. São 32×32 com fundo transparente: a planta vista de lado, nascendo da borda de baixo.

### Proibido em TODOS os arquivos

- texto, letras, números ou nome do item;
- moldura, borda de cartão, linhas de grade ou de recorte;
- fundo colorido (só a textura de face de bloco é opaca);
- sombra no chão, cenário, marca d'água;
- objeto cortado na borda;
- dois objetos no mesmo arquivo;
- reaproveitar placeholder simples.

### Como devolver

- **Um .zip por fase**, com as pastas `itens/`, `blocos_menu/`, `blocos_faces/` e mais:
  - `manifesto.csv`, com as colunas `arquivo,pasta,tipo,fase`;
  - `prancha.png`: uma prancha com todos os desenhos da fase e o nome embaixo de cada um, **só para revisão**. O nome aparece só na prancha, nunca nos arquivos.
- Confira se **todos os arquivos da lista** estão no zip e se o nome está **idêntico**: minúsculo, sem acento, com `_`.

---

## LISTA: Fases 0 a 14 (o que já existe no jogo)

### Itens (97)

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

### Blocos já existentes: só o ícone de menu (B)

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| condensador_agua | Condensador de Água | máquina branca-gelo com tanque de vidro de água azul e faixa de luz azul |
| condensador_avancado | Condensador Avançado | condensador maior, reforçado, com tela azul e 4 tanques |
| peneira | Peneira | mesa de madeira com tela de peneira no topo |
| peneira_automatica | Peneira Automática | peneira de metal com motor e faixa ciano |
| compostor | Compostor de Terra | caixa de madeira aberta com terra escura dentro |
| estufa | Estufa | caixa de vidro com base verde e mudas dentro |
| painel_solar | Painel Solar | placa solar azul inclinada sobre base branca |
| moinho | Moinho de Vento | torre fina com hélice de 4 pás |
| gerador | Gerador a Carvão | bloco grafite com grade e brasa laranja, chaminé |
| bateria | Bateria | bloco branco-gelo com janela de carga ciano |
| cabo | Cabo de Cobre | segmento de cabo de cobre com conectores |
| gerador_monstros | Gerador de Monstros | gaiola escura de ferro com chama/núcleo laranja dentro |
| idolo_amaldicoado | Ídolo Amaldiçoado | bloco dourado egípcio com hieróglifos e brilho maldito |
| montadora | Montadora | mesa de montagem futurista com braço mecânico e luz laranja |
| painel_nave | Painel da Nave | console da nave com tela de radar verde e botões |
| terminal | Terminal de Armazenamento | terminal com tela roxa listando itens |
| barril_madeira | Barril de Madeira | barril aberto de tábuas, visto de cima em 3/4 |
| barril_pedra | Barril de Pedra | barril aberto de pedra lisa |
| cadinho | Cadinho | pote grande de porcelana branca, aberto |
| poeira | Poeira | bloco de pó bege-claro bem fino |
| folha_infestada | Folha Infestada | bloco de folhas coberto de teia branca |
| tabua_corte | Tábua de Corte | tábua de madeira com faca |
| panela | Panela | panela de metal com tampa e alças |
| frigideira | Frigideira | frigideira de ferro com cabo de madeira |
| cacarola | Caçarola | panelinha funda com cabo longo |
| assadeira | Assadeira | forma de assar rasa de metal |
| pilao | Pilão | pilão de pedra com socador de madeira |
| tigela_mistura | Tigela de Mistura | tigela larga de madeira |
| espremedor | Espremedor | espremedor de frutas de pedra |

### Plantações (texturas C, 3 estágios cada)

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| planta_milho_0/1/2 | Plantação de Milho | 3 estágios: broto, planta média, planta madura com milho |
| planta_tomate_0/1/2 | Plantação de Tomate | 3 estágios: broto, planta média, planta madura com tomate |
| planta_cebola_0/1/2 | Plantação de Cebola | 3 estágios: broto, planta média, planta madura com cebola |
| planta_alho_0/1/2 | Plantação de Alho | 3 estágios: broto, planta média, planta madura com alho |
| planta_feijao_0/1/2 | Plantação de Feijão | 3 estágios: broto, planta média, planta madura com feijão |
| planta_pimenta_0/1/2 | Plantação de Pimenta | 3 estágios: broto, planta média, planta madura com pimenta |
| planta_pimentao_0/1/2 | Plantação de Pimentão | 3 estágios: broto, planta média, planta madura com pimentão |
| planta_arroz_0/1/2 | Plantação de Arroz | 3 estágios: broto, planta média, planta madura com arroz |
| planta_amendoim_0/1/2 | Plantação de Amendoim | 3 estágios: broto, planta média, planta madura com amendoim |
| planta_fruta_cacto_0/1/2 | Plantação de Fruta do Cacto | 3 estágios: broto, planta média, planta madura com fruta do cacto (cacto baixo com frutas rosas) |

---

## LISTA: Fases 15 a 23 (o que vamos adicionar)

Nos blocos, "máquina" = entregar **B + C (4 faces)**; "cubo" = entregar só **C**.
Os blocos sem coluna "Tipo" são todos máquina.

### Fase 15: Tinkers' Construct + Iguana (ferramentas montadas)

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| padrao_branco.png | Padrão em Branco | placa fina de madeira clara, vazia |
| padrao_cabo.png | Padrão de Cabo | placa de madeira clara com o recorte/silhueta de vareta curta |
| padrao_ligacao.png | Padrão de Ligação | placa de madeira clara com o recorte/silhueta de amarração/anel de prender |
| padrao_cabeca_picareta.png | Padrão de Cabeça de Picareta | placa de madeira clara com o recorte/silhueta de cabeça de picareta sem cabo |
| padrao_cabeca_pa.png | Padrão de Cabeça de Pá | placa de madeira clara com o recorte/silhueta de lâmina de pá sem cabo |
| padrao_cabeca_machado.png | Padrão de Cabeça de Machado | placa de madeira clara com o recorte/silhueta de lâmina de machadinha sem cabo |
| padrao_lamina_espada.png | Padrão de Lâmina de Espada | placa de madeira clara com o recorte/silhueta de lâmina larga sem cabo |
| padrao_guarda_larga.png | Padrão de Guarda Larga | placa de madeira clara com o recorte/silhueta de guarda de espada larga |
| padrao_travessa.png | Padrão de Travessa | placa de madeira clara com o recorte/silhueta de barra curta de guarda |

**Peças: 80 arquivos `peca_<peça>_<material>.png`.** São as 8 peças abaixo × os 10 materiais. A mesma forma muda só o material (cor e textura do material).

- Peças: `cabo` (vareta curta), `ligacao` (amarração/anel de prender), `cabeca_picareta` (cabeça de picareta sem cabo), `cabeca_pa` (lâmina de pá sem cabo), `cabeca_machado` (lâmina de machadinha sem cabo), `lamina_espada` (lâmina larga sem cabo), `guarda_larga` (guarda de espada larga), `travessa` (barra curta de guarda).
- Materiais: `madeira` (madeira), `pedra` (pedra), `silex` (sílex), `cacto` (cacto), `osso` (osso), `obsidiana` (obsidiana), `ferro` (ferro), `cobre` (cobre), `bronze` (bronze), `aco` (aço).
- Exemplos: `peca_cabeca_picareta_bronze.png`, `peca_cabo_osso.png`.

**Ferramentas: 40 arquivos `<ferramenta>_<material>.png`.**

- Ferramentas: `picareta` (Picareta), `pa` (Pá), `machadinha` (Machadinha), `espada_larga` (Espada Larga), com cabeça do material e cabo de madeira.
- Mesmos 10 materiais. Exemplos: `picareta_silex.png`, `espada_larga_aco.png`.
- Na diagonal, cabo embaixo à esquerda.

**Blocos (máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| mesa_moldes | Mesa de Moldes | mesa de madeira com moldes e padrões espalhados |
| construtor_pecas | Construtor de Peças | mesa de madeira com tampo de pedra e ferramentas de entalhe |
| estacao_ferramentas | Estação de Ferramentas | bancada de madeira com martelo, ferramentas e torno |

### Fase 16: Tinkers' Construct (fundição)

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| argamassa.png | Argamassa | bola de argila cinza com cascalho |
| tijolo_refratario.png | Tijolo Refratário | tijolo cinza-escuro queimado |
| molde_lingote.png | Molde de Lingote | placa dourada com o buraco de um lingote |
| molde_pepita.png | Molde de Pepita | placa dourada com o buraco de uma pepita |
| molde_cabo.png | Molde de Cabo | placa dourada com a silhueta de vareta curta |
| molde_ligacao.png | Molde de Ligação | placa dourada com a silhueta de amarração/anel de prender |
| molde_cabeca_picareta.png | Molde de Cabeça de Picareta | placa dourada com a silhueta de cabeça de picareta sem cabo |
| molde_cabeca_pa.png | Molde de Cabeça de Pá | placa dourada com a silhueta de lâmina de pá sem cabo |
| molde_cabeca_machado.png | Molde de Cabeça de Machado | placa dourada com a silhueta de lâmina de machadinha sem cabo |
| molde_lamina_espada.png | Molde de Lâmina de Espada | placa dourada com a silhueta de lâmina larga sem cabo |
| molde_guarda_larga.png | Molde de Guarda Larga | placa dourada com a silhueta de guarda de espada larga |
| molde_travessa.png | Molde de Travessa | placa dourada com a silhueta de barra curta de guarda |
| lingote_bronze.png | Lingote de Bronze | lingote marrom-dourado |
| lingote_aco.png | Lingote de Aço | lingote cinza-azulado escuro |
| lingote_estanho.png | Lingote de Estanho | lingote prata-claro fosco |
| estanho_quebrado.png | Pedaço Quebrado de Estanho | cascalho com pedaços prata-claro (graúdo) |
| estanho_triturado.png | Pedaço Triturado de Estanho | areia com grãos prata-claro (médio) |
| estanho_po.png | Pó de Minério de Estanho | montinho de pó prata-claro (fino) |
| bola_musgo.png | Bola de Musgo | bola de musgo verde |

**Blocos:**

| Arquivo | Nome | Tipo | Como deve parecer |
|---|---|---|---|
| tijolos_refratarios | Tijolos Refratários | cubo | parede de tijolos cinza-escuros |
| controlador_fundicao | Controlador da Fundição | máquina | tijolos refratários com janela de metal derretido laranja na frente |
| tanque_refratario | Tanque Refratário | máquina | tanque de tijolos com vidro mostrando lava |
| dreno_fundicao | Dreno | máquina | tijolos refratários com bocal de saída |
| vidro_refratario | Vidro Refratário | cubo | vidro com moldura de tijolo cinza |
| torneira | Torneira | máquina | bica de tijolo refratário |
| mesa_fundicao | Mesa de Fundição | máquina | mesa de tijolos refratários com tampo raso |
| bacia_fundicao | Bacia de Fundição | máquina | bacia funda de tijolos refratários |
| bloco_bronze | Bloco de Bronze | cubo | bloco de metal bronze |
| bloco_aco | Bloco de Aço | cubo | bloco de metal aço |
| bloco_estanho | Bloco de Estanho | cubo | bloco de metal estanho |

### Fase 17: Thermal Expansion

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| serragem.png | Serragem | montinho de pó de madeira |

**Blocos (todos máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| estrutura_maquina | Estrutura de Máquina | moldura de ferro com vidro e núcleo dourado, vazia |
| pulverizador | Pulverizador | máquina com moedores e faixa laranja |
| fornalha_redstone | Fornalha de Redstone | fornalha futurista com brilho vermelho |
| fundidora_inducao | Fundidora de Indução | máquina com bobinas e calor laranja |
| serraria | Serraria | máquina com serra circular |
| extrusora_ignea | Extrusora Ígnea | máquina com lava e água lado a lado |
| precipitador_glacial | Precipitador Glacial | máquina com gelo e neve, faixa azul-clara |
| dinamo_redstone | Dínamo de Redstone | dínamo com bobina vermelha |
| celula_energia_basica | Célula de Energia Básica | cubo de energia cinza com barra de carga |
| celula_energia_reforcada | Célula de Energia Reforçada | cubo de energia com moldura de aço |
| celula_energia_redstone | Célula de Energia Redstone | cubo de energia com vidro vermelho |
| celula_energia_ressonante | Célula de Energia Ressonante | cubo de energia roxo brilhante |

### Fase 18: armazenamento (JABBA, AutoPackager, AE1 + ExtraCells)

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| upgrade_armazenamento.png | Upgrade de Armazenamento | placa com seta para cima e baú |
| upgrade_estrutural_1.png | Upgrade Estrutural MK I | moldura de madeira |
| upgrade_estrutural_2.png | Upgrade Estrutural MK II | moldura de ferro |
| upgrade_estrutural_3.png | Upgrade Estrutural MK III | moldura de ouro |
| upgrade_estrutural_4.png | Upgrade Estrutural MK IV | moldura de diamante |
| upgrade_estrutural_5.png | Upgrade Estrutural MK V | moldura de obsidiana |
| upgrade_estrutural_6.png | Upgrade Estrutural MK VI | moldura de pedra do End |
| upgrade_estrutural_7.png | Upgrade Estrutural MK VII | moldura de esmeralda |
| nucleo_funil.png | Núcleo de Funil | pequeno funil de metal num núcleo |
| chave_barril.png | Chave de Barril | martelinho/chave de ferro |
| carrinho.png | Carrinho | carrinho de mão (dolly) de ferro |
| carrinho_diamante.png | Carrinho de Diamante | carrinho de mão com detalhes de diamante |
| celula_me_1k.png | Célula ME 1k | cartucho de armazenamento cinza com faixa marrom |
| celula_me_4k.png | Célula ME 4k | cartucho de armazenamento cinza com faixa verde |
| celula_me_16k.png | Célula ME 16k | cartucho de armazenamento cinza com faixa azul |
| celula_me_64k.png | Célula ME 64k | cartucho de armazenamento cinza com faixa roxa |
| componente_me_1k.png | Componente ME 1k | chip de memória com núcleo marrom |
| componente_me_4k.png | Componente ME 4k | chip de memória com núcleo verde |
| componente_me_16k.png | Componente ME 16k | chip de memória com núcleo azul |
| componente_me_64k.png | Componente ME 64k | chip de memória com núcleo roxo |
| cristal_certus.png | Cristal de Certus | cristal azul-claro pontudo |
| po_certus.png | Pó de Certus | montinho de pó azul-claro |
| silicio.png | Silício | placa cinza-escura brilhante |
| cristal_fluix.png | Cristal Fluix | cristal roxo brilhante |
| po_fluix.png | Pó Fluix | montinho de pó roxo |
| faca_corte.png | Faca de Corte | faca de quartzo com cabo de ferro |
| processador_basico.png | Processador Básico | chip verde com contatos dourados |
| processador_avancado.png | Processador Avançado | chip azul com contatos dourados |
| matriz_conversao.png | Matriz de Conversão | cubo de vidro com núcleo roxo |
| celula_agua.png | Célula de Água | cartucho de armazenamento com água azul visível |
| terminal_sem_fio.png | Terminal sem Fio | tablet com tela roxa e antena |

**Blocos (todos máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| barril_armazenamento | Barril de Armazenamento | barril de madeira deitado com etiqueta/visor na frente |
| empacotador | Empacotador Automático | máquina com prensa e esteira |
| controlador_me | Controlador ME | bloco com núcleo roxo brilhante |
| drive_me | Drive ME | gabinete com 10 baias de célula |
| bau_me | Baú ME | baú metálico com tela roxa |
| ponto_acesso | Ponto de Acesso sem Fio | antena sobre base metálica |

### Fase 19: MineFactory Reloaded

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| upgrade_alcance_1.png | Upgrade de Alcance +1 | placa com seta de expansão e núcleo de lápis-lazúli |
| upgrade_alcance_2.png | Upgrade de Alcance +2 | placa com seta de expansão e núcleo de ferro |
| upgrade_alcance_3.png | Upgrade de Alcance +3 | placa com seta de expansão e núcleo de estanho |
| upgrade_alcance_4.png | Upgrade de Alcance +4 | placa com seta de expansão e núcleo de cobre |
| upgrade_alcance_5.png | Upgrade de Alcance +5 | placa com seta de expansão e núcleo de bronze |
| resina.png | Resina | gota de seiva âmbar |
| barra_borracha.png | Barra de Borracha | barra preta de borracha |
| plastico_cru.png | Plástico Cru | bolinhas brancas de plástico |
| folha_plastico.png | Folha de Plástico | folha branca de plástico |
| fertilizante.png | Fertilizante | saquinho de fertilizante verde |

**Blocos (todos máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| bloco_maquina | Bloco de Máquina | carcaça de plástico e pedra, vazia |
| plantadeira | Plantadeira | máquina com mudas e garras |
| colheitadeira | Colheitadeira | máquina com lâminas de colher |
| fertilizadora | Fertilizadora | máquina com spray verde |
| rancheiro | Rancheiro | máquina com balde de leite |
| triturador_monstros | Triturador de Monstros | máquina com dentes e faixa vermelha |
| esgoto | Esgoto | grade no chão com líquido marrom |
| compostadora | Compostadora | máquina com terra e folhas |
| quebrador_blocos | Quebrador de Blocos | máquina com picareta mecânica na frente |
| colocador_blocos | Colocador de Blocos | máquina com braço segurando bloco |
| esteira | Esteira | esteira rolante preta com setas |

### Fase 20: PneumaticCraft

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| lingote_ferro_comprimido.png | Lingote de Ferro Comprimido | lingote de ferro escuro e denso |
| manometro.png | Manômetro | relógio de pressão com ponteiro |
| placa_circuito_vazia.png | Placa de Circuito Vazia | placa verde sem componentes |
| transistor.png | Transistor | componente preto com 3 pernas |
| capacitor.png | Capacitor | cilindro azul com 2 pernas |

**Blocos:**

| Arquivo | Nome | Tipo | Como deve parecer |
|---|---|---|---|
| bloco_ferro_comprimido | Bloco de Ferro Comprimido | cubo | bloco de ferro escuro rebitado |
| compressor_ar | Compressor de Ar | máquina | compressor com manômetro e fornalha |
| tubo_pressao | Tubo de Pressão | máquina | tubo metálico com anéis amarelos |
| tubo_pressao_avancado | Tubo de Pressão Avançado | máquina | tubo metálico grosso com anéis vermelhos |
| parede_camara | Parede da Câmara de Pressão | cubo | placa de metal rebitada |
| vidro_camara | Vidro da Câmara de Pressão | cubo | vidro com moldura de metal |
| valvula_camara | Válvula da Câmara | máquina | placa de metal com válvula redonda |
| interface_camara | Interface da Câmara | máquina | placa de metal com portinhola |

### Fase 21: Sync

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| nucleo_sync.png | Núcleo Sync | esfera de vidro com coração dourado dentro |

**Blocos (todos máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| construtor_corpos | Construtor de Corpos | cápsula alta de vidro com silhueta humana sendo montada (2 blocos de altura) |
| armazem_corpos | Armazém de Corpos | cápsula alta de vidro com porta (2 blocos de altura) |
| esteira_animal | Esteira de Animal | esteira de corrida para animal (2 blocos de comprimento) |

### Fase 22: Big Reactors

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| lingote_yellorium.png | Lingote de Yellorium | lingote amarelo radioativo brilhante |
| po_yellorium.png | Pó de Yellorium | montinho de pó amarelo brilhante |
| lingote_cianita.png | Lingote de Cianita | lingote azul-ciano |
| lingote_blutonio.png | Lingote de Blutônio | lingote azul-escuro brilhante |
| barra_grafite.png | Barra de Grafite | barra preta fosca |

**Blocos:**

| Arquivo | Nome | Tipo | Como deve parecer |
|---|---|---|---|
| bloco_yellorium | Bloco de Yellorium | cubo | bloco amarelo radioativo |
| bloco_grafite | Bloco de Grafite | cubo | bloco preto fosco |
| carcaca_reator | Carcaça do Reator | cubo | placa de metal escuro com bordas amarelas |
| vidro_reator | Vidro do Reator | cubo | vidro com moldura de metal escuro |
| controlador_reator | Controlador do Reator | máquina | carcaça com tela e luzes |
| barra_combustivel | Barra de Combustível | máquina | coluna de vidro com núcleo amarelo |
| barra_controle | Barra de Controle | máquina | carcaça com barra vertical e indicador |
| porta_acesso_reator | Porta de Acesso | máquina | carcaça com portinhola e setas |
| tomada_energia | Tomada de Energia | máquina | carcaça com plugue de energia ciano |
| porta_refrigeracao | Porta de Refrigeração | máquina | carcaça com bocal azul de água |
| reprocessador_cianita | Reprocessador de Cianita | máquina | máquina com tanque azul-ciano |

### Fase 23: Chisel, BiblioCraft e ChickenChunks

**Itens:**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| cinzel.png | Cinzel | cinzel de ferro com cabo de madeira, na diagonal |

**Chisel: blocos cubo, 48 arquivos `<família>_<variante>`.**

- Famílias: `arenito`, `pedra`, `marmore` (branco com veios cinza), `calcario` (bege-claro), `casco_nave` (metal branco-gelo da nave), `vidro`.
- Variantes: `liso`, `polido`, `tijolos`, `tijolos_pequenos`, `ladrilho`, `pilar`, `entalhado`, `mosaico`.
- Também entram os blocos brutos `marmore` e `calcario` (cubo).

**BiblioCraft e ChickenChunks: blocos (todos máquinas):**

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| estante | Estante | estante de madeira com livros coloridos |
| prateleira | Prateleira | prateleira de madeira com 2 andares |
| suporte_ferramentas | Suporte de Ferramentas | painel de madeira com ganchos |
| expositor | Expositor | vitrine de vidro com base de madeira |
| cabide_armadura | Cabide de Armadura | manequim de madeira |
| lanterna | Lanterna | lanterna de ferro com vidro aceso |
| lampada | Lâmpada | abajur de mesa aceso |
| carregador_chunks | Carregador de Chunks | bloco com pedestal e cristal verde-água girando |
| carregador_pontual | Carregador Pontual | versão menor do carregador, laje com cristal |

### Pendente da Fase 12

| Arquivo | Nome | Como deve parecer |
|---|---|---|
| seiva_cacto.png | Seiva de Cacto | garrafa com seiva verde-clara de cacto |


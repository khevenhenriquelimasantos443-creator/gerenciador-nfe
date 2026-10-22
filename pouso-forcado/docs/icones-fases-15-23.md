# Ícones e texturas: Fases 15 a 23

Lista definitiva do que vai entrar no jogo, com os nomes de arquivo exatos. Mesmo formato e mesmas regras de `docs/prompt-icones.md`.


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
| po_ferro.png | Pó de Ferro | montinho de pó metálico cinza-claro |
| po_ouro.png | Pó de Ouro | montinho de pó dourado |
| po_cobre.png | Pó de Cobre | montinho de pó laranja-cobre |
| po_estanho.png | Pó de Estanho | montinho de pó prata-claro |

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


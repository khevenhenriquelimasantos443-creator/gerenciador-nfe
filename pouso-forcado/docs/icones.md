# Ícones: tudo que precisa de ícone, fase por fase

Levantamento do que aparece no inventário (e no Catálogo) e precisa de imagem.
Legenda da coluna **Arte do mod**:

- **sim**: a licença deixa usar a textura original, com crédito;
- **sim (NC-SA)**: deixa, porque o RP já é CC BY-NC-SA 4.0;
- **não**: redesenhar no estilo do mod;
- **—**: não veio de mod.

Como os ícones são feitos hoje:

| Pasta | Gerador | O que tem |
|---|---|---|
| `RP/textures/items/cl/` | `tools/gerar-texturas.mjs` | águas, peças da nave, fruta do cacto, faixa de múmia (Fases 0–8) |
| `RP/textures/items/cl/v/` | `tools/gerar-visual.mjs` | ícones das Fases 9, 11, 12 e 13 |
| `RP/textures/items/cl/hc/` | `tools/gerar-harvestcraft.mjs` | HarvestCraft (Fase 14) |
| `RP/textures/items/cl/blocos/` | `tools/icones-blocos.py` (à mão, Python + Pillow) | blocos com modelo 3D, vistos de lado (Catálogo e menus) |

Os blocos com modelo 3D aparecem no inventário pelo próprio modelo. O ícone deles só é usado nos menus (Catálogo, Diário, WAILA).

## Resumo

| Fases | Itens | Blocos | Sem ícone próprio |
|---|---|---|---|
| 0–14 (prontas) | 97 | 29 | 10 plantações (não vão para o inventário) e 4 ovos de monstro (cor) |
| 15–23 (planejadas) | ~330 ícones novos ao todo | (contagem por fase no fim) | — |
| 10 (final) | nada definido ainda | | |

Todos os itens e blocos das Fases 0–14 já têm ícone. Podem trocar o ícone próprio pela arte original do mod:

- as 5 águas, o Camel Pack, a Máscara e o Filtro (EnviroMine);
- o Martelo de Cobre e os 3 pedaços de cobre (Ex Aliquo);
- o Terminal (arte do AE2).

**Pendente da Fase 12:** a **Seiva de Cacto** (Ex Aliquo: cacto → água) foi planejada, mas não existe ainda. Ela vai precisar de ícone.

---

## Fases prontas (0–14)

### Fase 0, 3 e 5: máquinas de sobrevivência e energia (blocos)

| Bloco | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Condensador de Água | Crash Landing (pack) | Tira água do ar: enche baldes e garrafas, e agora o Camel Pack | — |
| Condensador Avançado | Crash Landing (pack) | 1 balde a cada 10 s, guarda até 4 e enche baldes de baú encostado; mais rápido com energia | — |
| Peneira | Ex Nihilo | Peneira terra, cascalho, areia e poeira por toques | não |
| Peneira Automática | Ex Nihilo (adaptado) | Peneira sozinha com energia, com as mesmas tabelas | não |
| Compostor de Terra | Ex Nihilo (adaptado) | Restos de planta e carne podre viram terra | não |
| Estufa | Pouso Forçado | Faz as plantações em volta crescerem e mantém a terra molhada | — |
| Painel Solar | Pouso Forçado | Gera energia de dia | — |
| Moinho de Vento | Pouso Forçado | Gera energia com o vento | — |
| Gerador a Carvão | Thermal Expansion (Steam Dynamo, números) | Queima carvão e gera energia (RF) | não |
| Bateria | Thermal Expansion (Energy Cell, números) | Guarda energia da rede | não |
| Cabo de Cobre | Pouso Forçado | Liga máquinas, geradores e baterias | — |

### Fase 2 e 11: Diário, Catálogo e organização (itens)

| Item | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Diário de Bordo | Hardcore Questing Mode | Livro de missões em capítulos | não |
| Sacola Comum / Boa / Ótima / Épica / Lendária (5) | Hardcore Questing Mode | Recompensa que sorteia itens, com os pesos do HQM | não |
| Catálogo | JEI / NEI | Mostra como fazer e onde usar cada item | — |
| Organizador | Inventory Tweaks | Ordena o inventário e o baú que você olha | — |

### Fase 4 e 13: água, clima e fome (itens)

| Item | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Água Excelente | EnviroMine (água fria) | +25 de água, refresca bem | sim (NC-SA) |
| Água Boa | EnviroMine (água limpa) | +25 de água, refresca um pouco | sim (NC-SA) |
| Água Suja | EnviroMine | +25 de água, com chance de fome ou veneno | sim (NC-SA) |
| Água Muito Suja | EnviroMine | Pior que a suja; precisa ferver | sim (NC-SA) |
| Água Salgada | EnviroMine | +10 de água e depois desidrata | sim (NC-SA) |
| Fruta do Cacto | Pam's HarvestCraft | Sai do cacto; mata a sede | não |
| Camel Pack | EnviroMine | Mochila de água (100) no peito ou na mão secundária | sim (NC-SA) |
| Máscara de Gás | EnviroMine | Protege do ar ruim e da areia da tempestade | sim (NC-SA) |
| Filtro de Ar | EnviroMine | Recarrega a máscara (+500) | sim (NC-SA) |

### Fase 7: perigos do deserto

| Item ou bloco | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Ídolo Amaldiçoado (bloco) | Pouso Forçado | Acorda o chefe Faraó Amaldiçoado | — |
| Gerador de Monstros (bloco) | Pouso Forçado | Gerador das masmorras; quebrado dá ferro, ouro e redstone (não cai como item) | — |
| Faixa de Múmia | Pouso Forçado | Drop da Múmia; vai no Ídolo Amaldiçoado | — |
| Coração do Faraó | Pouso Forçado | Drop do chefe; vai no Motor da Nave | — |
| Ovos: Múmia, Escorpião, Golem de Areia, Faraó | Pouso Forçado | Ovo do jogo com as cores do monstro; não precisam de ícone | — |

### Fase 8: consertar a nave

| Item ou bloco | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Painel da Nave (bloco) | Crash Landing (objetivo do pack) | Mostra e recebe os 4 sistemas da nave | — |
| Montadora (bloco) | Pouso Forçado | Máquina de energia que faz as peças da nave | — |
| Terminal de Armazenamento (bloco) | Applied Energistics | Vê e tira itens de todos os baús ligados | sim (NC-SA, arte do AE2) |
| Placa de Casco | Crash Landing | Peça do sistema do casco | — |
| Circuito | Crash Landing | Peça eletrônica; usada em várias receitas | — |
| Célula de Combustível | Crash Landing | Peça do sistema de combustível | — |
| Motor da Nave | Crash Landing | Peça do sistema do motor | — |
| Computador de Bordo | Crash Landing | Peça do sistema do computador | — |

### Fase 12: Ex Nihilo + Ex Aliquo

| Item ou bloco | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Poeira (bloco) | Ex Nihilo | Areia martelada; vai para a peneira | não |
| Pedrinha | Ex Nihilo | 4 = 1 pedregulho | não |
| Barril de Madeira (bloco) | Ex Nihilo | Composto vira terra; água + poeira = argila | não |
| Barril de Pedra (bloco) | Ex Nihilo | Igual ao de madeira e aguenta lava (obsidiana) | não |
| Cadinho (bloco) | Ex Nihilo | Derrete pedra em lava e folhas em água | não |
| Cadinho Cru | Ex Nihilo | Cadinho antes de ir ao fogo | não |
| Porcelana | Ex Nihilo | Argila + farinha de osso; faz o cadinho | não |
| Cajado | Ex Nihilo | Mais mudas das folhas; acha bicho-da-seda | não |
| Bicho-da-seda / Bicho-da-seda Cozido | Ex Nihilo | Infesta folhas (linha); cozido é comida | não |
| Folha Infestada (bloco) | Ex Nihilo | Folha com teia; dá linha | não |
| Martelo de Madeira, Pedra, Ferro, Ouro, Diamante (5) | Ex Nihilo | Quebra pedregulho → cascalho → areia → poeira | não |
| Martelo de Cobre | Ex Aliquo | Martelo intermediário | **sim** (MIT) |
| Pedaço Quebrado / Triturado / Pó de Ferro e de Ouro (6) | Ex Nihilo | Pedaços de minério da peneira; 4 = 1 minério | não |
| Pedaço Quebrado / Triturado / Pó de Cobre (3) | Ex Aliquo | Pedaços de cobre | **sim** (MIT) |

### Fase 14: Pam's HarvestCraft (todos com arte própria; a do mod **não** pode)

**Utensílios (blocos; abrem a grade de receitas):**

| Bloco | Original | Descrição |
|---|---|---|
| Tábua de Corte | Cutting Board | Cortar e montar (taco) |
| Panela | Pot | Ferver: sal, caldo, sopas, queijo |
| Frigideira | Skillet | Fritar: ovo, hambúrguer, tortilha, burrito |
| Caçarola | Saucepan | Manteiga |
| Assadeira | Bakeware | Assar: pão, torrada, pipoca |
| Pilão | Mortar and Pestle | Moer: farinha, fubá |
| Tigela de Mistura | Mixing Bowl | Massa e massa líquida |
| Espremedor | Juicer | Suco de fruta do cacto, maionese |

**Plantações:** 10 sementes e 10 colheitas.

- Milho, Tomate, Cebola, Alho, Feijão, Pimenta, Pimentão, Arroz, Amendoim.
- Fruta do Cacto: a colheita é a Fruta do Cacto da Fase 4.
- As 10 Plantações (blocos) usam 3 texturas de estágio e não vão para o inventário.

**Comidas e ingredientes (35):**

| Item | Descrição |
|---|---|
| Sal | Água Salgada fervida |
| Farinha | Moída de trigo ou arroz |
| Fubá | Moído de milho |
| Massa | Para fazer pão |
| Massa Líquida | Para panquecas e empanados |
| Manteiga | Ingrediente |
| Queijo | Leite + sal |
| Maionese | Ovo no espremedor |
| Caldo | Base das sopas; dá água |
| Ovo Frito / Ovo Cozido | Comida |
| Torrada | Comida |
| Hambúrguer | Comida |
| Tortilha | Comida |
| Taco | Comida |
| Burrito de Feijão | Comida |
| Feijão Assado | Comida |
| Arroz Frito | Comida |
| Sopa de Legumes / de Cacto / de Tomate / de Arroz | Dão água e esquentam |
| Suco de Fruta do Cacto | Dá água e refresca |
| Charque | Comida |
| Pipoca | Comida |
| Milho na Espiga | Comida |
| Pimentão Recheado | Comida |
| Pimentas Empanadas | Comida |
| Omelete | Comida |
| Bolinho de Arroz | Comida |
| Pemmican | Comida |
| Panquecas | Comida |
| Broa de Milho | Comida |

O Pão do HarvestCraft sai como o Pão do jogo, por isso não tem ícone próprio.

---

## Fases planejadas (15–23)

Lista tirada da pesquisa (`docs/pesquisa-mods.md` e `docs/pesquisa/C` a `F`). Os nomes ainda podem mudar na hora de fazer.

### Fase 15: Tinkers' Construct + Iguana Tweaks (parte 1)

Arte do Tinkers: **sim** (CC BY 3.0); o Tinkers 1.6.4 já tem um PNG por peça × material. Arte do Iguana: **não**.

| Item ou bloco | Original | Descrição |
|---|---|---|
| Padrão em Branco | Blank Pattern | Base dos padrões (2 tábuas + 2 gravetos) |
| Padrões de peça (~8) | Wooden Patterns | Dizem qual peça o Construtor de Peças faz |
| Mesa de Moldes (bloco) | Stencil Table | Transforma o padrão em branco num padrão |
| Construtor de Peças (bloco) | Part Builder | Padrão + material → peça |
| Estação de Ferramentas (bloco) | Tool Station | Monta, conserta e põe modificadores |
| Forja de Ferramentas (bloco, opcional) | Tool Forge | Ferramentas grandes (marreta, escavadeira) |
| **Peças** | Tool Parts | Cabo, Ligação, Cabeça de Picareta, Cabeça de Pá, Cabeça de Machado, Lâmina de Espada, Guarda Larga e Travessa × materiais. Nesta fase entram só as não metálicas, ~21 ícones (madeira, sílex, osso, cacto, obsidiana) |
| **Ferramentas** | Tools | Picareta, Pá, Machadinha e Espada Larga, um ícone por material da cabeça: ~26 ícones com as regras do Iguana (a primeira picareta é de sílex; sem ferramenta de pedra) |
| Cabeça de Enderman (opcional) | Enderman Head | Aumenta o nível de mineração |
| Balde de Argila (opcional) | Clay Bucket | Balde barato de água, lava ou leite |

Os 10 materiais são madeira, pedra, sílex, cacto, osso, obsidiana, ferro, cobre, bronze e aço. Sem Nether, ficam fora cobalto, ardite e manyullyn.

O martelo do Tinkers colide com os martelos do Ex Nihilo; sugestão: chamar de **Marreta**.

### Fase 16: Tinkers' Construct (parte 2, fundição)

Arte: **sim** (Tinkers).

| Item ou bloco | Original | Descrição |
|---|---|---|
| Argamassa | Grout | Argila + areia + cascalho; vai ao forno |
| Tijolo Refratário | Seared Brick | Material da fundição |
| Tijolos Refratários (bloco) | Seared Bricks | Paredes e piso da fundição |
| Controlador da Fundição (bloco) | Smeltery Controller | Liga o multibloco e guarda o metal derretido |
| Tanque Refratário (bloco) | Seared Tank | Lava que aquece a fundição |
| Dreno (bloco) | Smeltery Drain | Saída do metal |
| Vidro Refratário (bloco, opcional) | Seared Glass | Parede com visor |
| Torneira (bloco) | Faucet | Derrama o metal |
| Mesa de Fundição (bloco) | Casting Table | Faz lingote, peça ou molde |
| Bacia de Fundição (bloco) | Casting Basin | Faz bloco de metal |
| Molde de Lingote / de Pepita | Ingot / Nugget Cast | Moldes da mesa |
| Moldes de peça (~8) | Part Casts | Fazem as peças de metal |
| Lingote e Bloco de Bronze | Bronze | Liga de 3 cobre + 1 estanho |
| Lingote e Bloco de Aço | Steel | Liga de aço |
| Lingote de Estanho | Tin Ingot | Necessário para o bronze (**fonte ainda não definida**) |
| Bola de Musgo | Ball of Moss | Modificador de auto-reparo |
| Peças de metal (~32) | Tool Parts | Ferro, cobre, bronze e aço × 8 peças |

O metal derretido é só um número (mB), sem ícone.

### Fase 17: Thermal Expansion

Arte: **não** (redesenhar).

| Item ou bloco | Original | Descrição |
|---|---|---|
| Estrutura de Máquina (bloco) | Machine Frame | Base das máquinas |
| Pulverizador (bloco) | Pulverizer | Minério → 2 pós (+ extra) |
| Fornalha de Redstone (bloco) | Redstone Furnace | Fornalha elétrica |
| Fundidora de Indução (bloco) | Induction Smelter | Pós e minério → lingotes; ligas |
| Serraria (bloco) | Sawmill | Tora → tábuas + serragem |
| Extrusora Ígnea (bloco) | Igneous Extruder | Lava + água → pedregulho |
| Precipitador Glacial (bloco) | Glacial Precipitator | Água → neve ou gelo |
| Dínamo de Redstone (bloco) | Enervation Dynamo | Redstone vira energia |
| Células de Energia (4 blocos) | Energy Cells | Básica, Reforçada, Redstone e Ressonante |
| Conduítes de Energia (3 blocos) | Energy Conduits | Básico (o Cabo de Cobre atual), Reforçado e Redstone |
| Serragem | Sawdust | Sobra da serraria |
| Pós novos (estanho, bronze, aço) | Dusts | Saídas do pulverizador |
| Lingote de Invar (+ níquel) | Invar | Liga (**fonte de níquel ainda não definida**) |
| Tesseract (bloco, opcional) | Tesseract | Energia por frequência |

O Dínamo a Vapor já é o Gerador a Carvão: sem ícone novo.

### Fase 18: armazenamento (JABBA, AutoPackager, Applied Energistics 1 + ExtraCells)

Arte: JABBA **sim (NC-SA)**; AutoPackager **sim**; AE **sim (NC-SA, arte do AE2)**; ExtraCells **sim**.

| Item ou bloco | Mod | Descrição |
|---|---|---|
| Barril de Armazenamento (bloco) | JABBA | 1 tipo de item, 64 pilhas |
| Upgrade de Armazenamento | JABBA | +64 pilhas |
| Upgrades Estruturais MK I a VII (7, ou 4 até MK IV) | JABBA | Mais espaço para upgrades |
| Núcleo de Funil | JABBA | Entrada e saída automáticas |
| Martelo do Barril | JABBA | Tira os upgrades |
| Carrinho / Carrinho de Diamante | JABBA (Dolly) | Move baú (e spawner) com o conteúdo |
| Empacotador Automático (bloco) | AutoPackager | Compacta 4→1 e 9→1 |
| Controlador ME (bloco) | AE1 | Aumenta o tamanho da rede |
| Drive ME (bloco) | AE1 | Guarda 10 células |
| Baú ME (bloco) | AE1 | Guarda 1 célula |
| Células ME 1k, 4k, 16k, 64k (4) | AE1 | Guardam itens |
| Componentes de célula 1k a 64k (4) | AE1 | Ingredientes das células |
| Cristal e Pó de Certus | AE1 | Da peneira de cascalho e dos destroços |
| Silício | AE1 | Pó de certus na fornalha |
| Cristal e Pó Fluix | AE1 | Precisa de quartzo (**sem fonte: não há Nether**) |
| Faca de Corte | AE1 | Ingrediente dos processadores |
| Processadores básico e avançado | AE1 | Feitos na Montadora |
| Matriz de Conversão | AE1 | Ingrediente do Baú ME |
| Célula de Água | ExtraCells | Guarda água em baldes |
| Terminal sem Fio / Ponto de Acesso (bloco) | AE1 | Abre o Terminal de longe |

O Terminal e o Cabo atuais viram a rede ME (mesmos IDs).

### Fase 19: MineFactory Reloaded

Arte: **não**.

| Item ou bloco | Original | Descrição |
|---|---|---|
| Bloco de Máquina | Machine Block | Base das máquinas |
| Plantadeira (bloco) | Planter | Planta numa área 3×3 |
| Colheitadeira (bloco) | Harvester | Colhe plantas e árvores |
| Fertilizadora (bloco) | Fertilizer | Faz as plantas crescerem |
| Rancheiro (bloco) | Rancher | Tira leite dos animais |
| Triturador de Monstros (bloco) | Mob Grinder | Mata monstros e dá XP |
| Esgoto (bloco) | Sewer | Junta esgoto e XP |
| Compostadora (bloco) | Composter | Esgoto → fertilizante |
| Quebrador e Colocador de Blocos (blocos) | Block Breaker / Placer | Quebram ou colocam o bloco da frente |
| Esteira (bloco) | Conveyor Belt | Passa itens de baú para baú |
| Upgrades de Alcance (5 úteis, até 11) | Range Upgrades | Aumentam a área |
| Resina | Sap / Raw Rubber | Do cacto ou da árvore |
| Barra de Borracha | Rubber Bar | Resina na fornalha |
| Plástico Cru / Folha de Plástico | Raw Plastic / Plastic Sheet | Receitas das máquinas |
| Fertilizante | Fertilizer | Igual farinha de osso |

### Fase 20: PneumaticCraft (versão leve)

Arte: **não**.

| Item ou bloco | Original | Descrição |
|---|---|---|
| Lingote e Bloco de Ferro Comprimido | Compressed Iron | Ferro na câmara de pressão ou na explosão |
| Compressor de Ar (bloco) | Air Compressor | Queima combustível e faz pressão |
| Tubo de Pressão / Tubo Avançado (blocos) | Pressure Tubes | Rede de ar; explode se passar do limite |
| Parede, Vidro, Válvula e Interface da Câmara (blocos) | Pressure Chamber | Multibloco da câmara |
| Manômetro | Pressure Gauge | Mostra a pressão |
| Pá de Turbina, Placa de Circuito, Transistor, Capacitor, Ácido (opcionais) | PCB chain | Cadeia de eletrônicos |

### Fase 21: Sync

Arte: **não**.

| Item ou bloco | Original | Descrição |
|---|---|---|
| Núcleo Sync | Sync Core | Ingrediente (leva o Coração do Faraó) |
| Construtor de Corpos (bloco) | Shell Constructor | Cria o corpo reserva |
| Armazém de Corpos (bloco) | Shell Storage | Guarda o corpo; troca e volta nele ao morrer |
| Esteira de Animal (bloco) | Treadmill | Porco ou lobo geram energia |

### Fase 22: Big Reactors

Arte: **sim** (MIT).

| Item ou bloco | Original | Descrição |
|---|---|---|
| Lingote de Yellorium (+ bloco) | Yellorium | Combustível; só vem da peneira de poeira |
| Lingote de Cianita | Cyanite | Resto do reator |
| Lingote de Blutônio | Blutonium | Combustível reprocessado |
| Barra e Bloco de Grafite | Graphite | Melhor moderador |
| Carcaça e Vidro do Reator (blocos) | Reactor Casing / Glass | Paredes do reator |
| Controlador do Reator (bloco) | Reactor Controller | Liga e mostra o reator (só no saque da cidade) |
| Barra de Combustível (bloco) | Fuel Rod | Coluna de dentro |
| Barra de Controle (bloco) | Control Rod | Regula a potência |
| Porta de Acesso (bloco) | Access Port | Entrada do combustível, saída da cianita |
| Tomada de Energia (bloco) | Power Tap | Liga o reator aos cabos (saque da cidade) |
| Porta de Refrigeração (bloco) | Coolant Port | Água aumenta a potência |
| Reprocessador de Cianita (bloco) | Cyanite Reprocessor | Cianita → blutônio |

### Fase 23: Chisel, BiblioCraft e ChickenChunks

| Item ou bloco | Mod | Descrição | Arte do mod |
|---|---|---|---|
| Cinzel | Chisel | Troca o bloco pela próxima variante | não |
| Mármore e Calcário (blocos) | Chisel | Pedra decorativa do subsolo | não |
| **Variantes**: 1 ícone por variante | Chisel | 6 famílias × 16 = ~96 (ou 8 × 8 = 64): arenito, pedra, mármore, calcário, casco da nave, vidro | não |
| Estante (bloco) | BiblioCraft | Guarda 16 livros | sim (MIT) |
| Prateleira (bloco) | BiblioCraft | Mostra itens | sim (MIT) |
| Suporte de Ferramentas (bloco) | BiblioCraft | Pendura 4 ferramentas | sim (MIT) |
| Expositor (bloco) | BiblioCraft | Vitrine de 1 item | sim (MIT) |
| Cabide de Armadura (bloco) | BiblioCraft | Troca a armadura inteira | sim (MIT) |
| Lanterna e Lâmpada (blocos) | BiblioCraft | 16 cores (2 ícones, ou 32 se cada cor for um item) | sim (MIT) |
| Carregador de Chunks (bloco) | ChickenChunks | Mantém uma área 3×3 carregada | não |
| Carregador Pontual (bloco) | ChickenChunks | Mantém 1 chunk carregado | não |

### Fase 10: final (decolagem)

Sem itens nem blocos novos: usa o Painel da Nave e a câmera do jogo.

---

## Contagem aproximada (Fases 15–23)

| Fase | Ícones novos |
|---|---|
| 15 | ~57 (mesas e padrões ~10, peças ~21, ferramentas ~26) |
| 16 | ~60 (fundição ~11, moldes ~10, ligas ~6, peças de metal ~32) |
| 17 | ~20 |
| 18 | ~38 |
| 19 | ~25 |
| 20 | ~10 (+4 opcionais) |
| 21 | 4 |
| 22 | ~15 |
| 23 | ~75 a 110 (a maior parte é variante do Chisel) |
| **Total** | **~305 a 340** |

## Materiais que as fases pedem e ainda não têm de onde vir

| Material | Precisa dele |
|---|---|
| Estanho | Bronze e upgrade de alcance |
| Aço | Receita da liga ainda não definida |
| Níquel | Invar |
| Quartzo (sem Nether) | Fluix do AE, modificador de afiação, upgrade de alcance |
| Prata e platina | Upgrades de alcance |
| Pó de blaze, cristal de lava, osso necrótico | Modificadores do Tinkers |

Cada um precisa de uma fonte (peneira, destroços ou cidade) e de ícone próprio, ou sai do plano.

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
| 15–23 (planejadas) | ver abaixo | ver abaixo | — |

Todos os itens e blocos das Fases 0–14 já têm ícone. Os únicos trocáveis pela arte original do mod estão marcados com **sim**.

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

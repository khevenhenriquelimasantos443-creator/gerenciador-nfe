# Pesquisa F — Chisel, BiblioCraft, Sync, ChickenChunks, WAILA, Inventory Tweaks (MC Java 1.6.4 / Crash Landing)

> Objetivo: recriar as **mecânicas** no add-on Bedrock "Pouso Forçado" (celular).
> Método: os wikis (ftb.fandom.com, ftbwiki.org, CurseForge, readthedocs) **não estavam acessíveis por fetch** neste ambiente (bloqueio de rede); usei (a) **código-fonte real** clonado do GitHub, fixando commits da era 1.6.4, e (b) trechos de busca web. Cada número traz a fonte entre colchetes; a lista de URLs está no fim.
> Legenda de confiança: **[código 1.6.4]** = lido no fonte da versão 1.6.4; **[código posterior]** = lido em versão mais nova (provável igual, não confirmado); **[web]** = trecho de busca; **não encontrado** = não achei.

Presença no Crash Landing: a lista do MyM (servidor 1.6.4) cita BiblioCraft, ChickenChunks, Sync e WAILA; uma lista mais antiga (1.1.x) cita Chisel e Inventory Tweaks [web: MyM / Aternos / FTB forum].

---

## 1. Chisel (1.6.4)

### Versão / "Chisel 2"
- No 1.6.4 existia o **Chisel 1.x original do AUTOMATIC_MAIDEN**; a última versão dele foi a **1.5, para MC 1.6.4** [web: página CurseForge "Chisel Retro"].
- O código do 1.6.4 **nunca foi publicado oficialmente**: o repositório Chisel-Team/Chisel começa com um *port* para 1.7.2 cujo README diz: *"Original version by AUTOMATIC_MAIDEN, 1.6.4 decompile by delta534, port by asiekierka"* (commit `c79c767b`, 2014-03-16). Os números abaixo vêm desse primeiro commit (= conteúdo do 1.6.4 portado; o vidro tingido só entra no commit seguinte, prova de que o primeiro ainda é o conteúdo 1.6.4).
- **"Chisel 2" NÃO existia no 1.6.4**: é a continuação para 1.7.10 (asie → Pokefenn/TheCricket26). No Crash Landing é o Chisel 1.x.

### Como funciona [código 1.6.4 portado: `ItemChisel.java`, `inventory/*`]
- **Clique direito com o cinzel** → abre a **GUI**: um slot central de entrada + slots ao redor com todas as variantes do grupo; clicar numa variante converte **a pilha inteira** do slot de entrada. **Na GUI o cinzel NÃO perde durabilidade** (o `SlotChiselSelection` não chama `damageItem`).
- **Clique esquerdo num bloco do mundo** (`onBlockStartBreak`): se o cinzel tem um "alvo" escolhido na GUI → transforma o bloco nessa variante; se não tem → escolhe **uma variante aleatória** diferente da atual. **Gasta 1 de durabilidade por bloco**. Recarga anti-spam de **20 ticks** no mesmo bloco (modo aleatório).
- **Durabilidade: 500 usos** (`setMaxDamage(500)`) [código 1.6.4 portado]. O FTB wiki dá **512** [web], provavelmente de versões posteriores.
- **Receita**: diagonal — lingote de ferro em cima à direita, graveto embaixo à esquerda (`" Y","X "`, Y=ferro, X=graveto). Receita alternativa por config: 2×2 de ferro + graveto (`" YY"," YY","X  "`).
- Lajes: 3 blocos → 6 lajes (mármore, calcário, pilar). Blocos "novos" (FFT, Tyrian, Temple, Factory) feitos com 8 pedras + 1 item (pepita de ouro, ferro, corante azul) → 8 (Factory: 32).

### Geração no mundo [código 1.6.4 portado: `MarbleWorldGenerator.java`, `Chisel.java` l.1198-1199]
- **Mármore**: veios de **32 blocos**, **8 tentativas por chunk**, altura **Y 40–128** (config "Worldgen marble amount", 0 desliga).
- **Calcário (limestone)**: veios de **32 blocos**, **4 por chunk**, Y **40–128**.
- Dureza 2.0 / resistência 10 (como pedra).

### Blocos com variantes (contagem do código) [código 1.6.4 portado]
Cada grupo usa metadata 0–15 (máx. 16). Total ≈ **615 variações em ~40 grupos** (contando lajes/escadas/tapetes).

| Grupo | Variantes | Grupo | Variantes |
|---|---|---|---|
| Mármore | 16 (+16 lajes, +16 escadas) | Calcário | 16 (+16 lajes) |
| Pilar de mármore | 16 (+16 lajes) | Pedregulho (cobblestone) | 16 |
| Tijolo de pedra (stoneBrick) | 16 | Pedra musgosa | 16 |
| Arenito | 16 | Arenito "rabiscado" | 16 |
| Madeira (carvalho, abeto, bétula, selva) | 15 cada = 60 | Vidro | 16 |
| Painel de vidro | 9 | Barras de ferro | 10 |
| Bloco de ferro | 16 | Bloco de ouro | 15 |
| Bloco de diamante | 13 | Bloco de esmeralda | 12 |
| Bloco de lápis | 9 | Bloco de redstone | 16 |
| Obsidiana | 16 | Pedra luminosa (glowstone) | 16 |
| Tijolo do Nether | 16 | Netherrack (hellrock) | 15 |
| Gelo | 16 (+16 pilares de gelo) | Estante (bookshelf) | 9 |
| Terra | 14 | Concreto | 11 |
| Holystone | 14 | Lavastone | 7 |
| Tapete / tapete de chão | 16 / 16 | FFT, Tyrian, Temple, Temple musgoso, Factory | 16 cada |
| Nuvem | 1 | | |

Extras do mod: Ball o' Moss, Cloud in a Bottle, gelo que solta "ice shards" (config), texturas conectadas (CTM).

### Licença
- Código do port: **GPL v2** (LICENSE do Chisel-Team/Chisel). O código original 1.6.4 do AUTOMATIC_MAIDEN não tinha licença publicada (o que existe é decompilação).
- Texturas: o `mcmod.info` diz *"uses a lot of textures from the Painterly pack"* — licença de terceiros, **não reaproveitar**; fazer texturas próprias inspiradas. Reaproveitar código GPL num add-on JS exigiria GPL no add-on → recomendação: só reimplementar a ideia (mecânica não tem copyright), com crédito em "inspirado por".

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Item cinzel com durabilidade | 500 usos; receita ferro+graveto diagonal | Item custom `cl:cinzel` com `minecraft:durability` (max 500) e receita shaped JSON | Alta | Baixo | — |
| Cinzelar bloco no mundo | 1 durabilidade/bloco; aleatório ou alvo fixo | Custom component `onUseOn` (toque no bloco): troca o bloco pela próxima variante (`block.setPermutation(perm.withState('cl:variante', n))`) e aplica dano no item. Vanilla (pedra, pedregulho, arenito…) é trocado por um bloco custom `cl:<familia>_cinzelado` com estado `cl:variante` 0–15 | Alta | Baixo (só no evento) | Tap simples = próxima variante; agachado+tap = variante anterior |
| GUI de cinzel (converter pilha inteira, sem gastar durabilidade) | slot central + variantes | Agachar + usar o cinzel no ar → `ActionFormData` listando variantes (botões com ícone) da família do bloco que está na outra mão/slot seguinte; converte a pilha toda via `Container.setItem`. Guardar "alvo" no `ItemStack.setDynamicProperty` (cinzel é não empilhável) | Alta | Baixo | Bancada "Mesa de entalhe" + baú adjacente (converte o conteúdo do baú) |
| Variantes por bloco | até 16 por família | 1 bloco custom por família, estado `cl:variante` 0–15 (16 valores, dentro do limite), `permutations` com `material_instances` próprios. Geometria cúbica padrão | Alta | Baixo (render estático) | Reduzir para 8 famílias × 8–16 variantes para não inflar o pacote |
| Texturas conectadas (CTM) | — | Não há CTM em Bedrock para blocos custom | Inviável | — | Desenhar variantes "sem borda" que lado a lado pareçam contínuas |
| Mármore e calcário no mundo | veio 32; 8/chunk (mármore), 4/chunk (calcário), Y 40–128 | `features` (`minecraft:ore_feature`, size 32) + `feature_rules` (iterations 8/4, y 40–128) no BP — puramente data-driven | Alta | Baixo (só na geração) | Diminuir para 4/2 por chunk se o mapa ficar "branco" demais |
| Lajes/escadas de cada variante | 3→6 lajes | Lajes/escadas custom exigem geometria + estados `minecraft:vertical_half` / placement traits; fazer só para mármore e calcário | Média | Baixo | Usar só blocos inteiros |

---

## 2. BiblioCraft (1.6.4)

### Versão e fonte
- Autor: **Nuchaz** (Joseph D. Sinclair). Na era 1.6.4 o mod era **código fechado**; a versão exata usada no Crash Landing **não encontrada** (provavelmente a linha v1.5.x; não confirmado).
- O código foi aberto em 2022 para **1.12.2+** (repo `Nuchaz/BiblioCraft-Source`, licença **MIT**, inclui `assets/` com texturas e receitas JSON). Receitas e nº de slots abaixo vêm desse fonte **[código posterior]**; as receitas básicas de madeira são as mesmas desde o início, mas não confirmei 1.6.4.
- O Fancy Sign só entrou na **v1.7.0** [web: wiki oficial] e a Typesetting Table na **v1.2.0** [web]; o Printing Press tem nota de v1.5.0 [web]. Portanto Fancy Sign provavelmente **não** estava no pack 1.6.4 (incerto).

### Blocos principais [código posterior: TileEntity*.java + recipes/*.json]
| Bloco | Slots | Receita (madeira: L = laje de madeira, T = tábua) | Notas |
|---|---|---|---|
| Estante (Bookcase) | **16** | `T L T / T L T / T L T` (6 tábuas + 3 lajes) | Só livros/itens pequenos; mostra cada livro na posição. **8 livros = 1 estante vanilla** para encantamento (estante cheia = 2) [web: wiki oficial]. Com o livro "Redstone: Volume 1" emite redstone 0–15 conforme o slot [web] |
| Prateleira (Shelf) | 16 (1.12.2) | `L L L / _ T _ / L L L` | Mostra os itens como modelos |
| Suporte de ferramentas (Tool Rack) | **4** | `L L L / L ferro L / L L L` | Na parede; ferramentas/armas |
| Prateleira de poções (Potion Shelf) | **12** | `L L L / T frasco T / L L L` | — |
| Expositor (Display Case) | 2 | `L vidro L / L lã L / L L L` | Mostra 1 item girando, tampa de vidro |
| Suporte de armadura (Armor Stand) | **4** | `_ graveto _ / _ graveto _ / L L L` | Clique com peça = equipa nela; **shift+clique troca o conjunto inteiro** do jogador com o do suporte [web: 9minecraft]. Tem GUI [web: wiki Hexxit] |
| Mesa (Table) | 3 | `L L L / _ T _ / _ T _` | Põe itens em cima; vira mesa grande ao juntar; aceita toalha (lã) |
| Rótulo (Label) | **3** | `L L L / L L L` | Mostra até 3 itens na parede (identificar baús) |
| Fancy Sign | 2 | sem forma: rótulo + placa + papel | v1.7.0+, texto + 2 itens |
| Lanterna (ouro/ferro) | — | `painel N / lingote tocha lingote / painel N` com pó de glowstone (`NGN/ITI/NGN`) | 16 cores por tingimento (corante + lanterna) |
| Lâmpada/abajur (ouro/ferro) | — | `vidro glowstone vidro / _ lingote _ / pepita lingote pepita` | 16 cores |
| Typesetting Table | — | `ferro chase ferro / L L L / T redstone T` | Grava/recupera livros assinados (v1.2.0) |
| Printing Press | — | `ferro vara-de-blaze ferro / L placa-pesada L / bloco-ferro ×3` | Copia livros (bloco "chase" + livro e pena + tinta) |

### Licença
- 1.6.4: **fechado / todos os direitos reservados** (nenhuma licença encontrada para a época).
- 1.12.2+: **MIT** (c) 2022 Joseph D Sinclair — permite reaproveitar código **e** os assets do repositório com aviso de copyright. Texturas MIT podem ser reaproveitadas no add-on com o crédito "BiblioCraft © Joseph D Sinclair (Nuchaz), MIT". Ainda assim, recomendo texturas próprias para manter o estilo do pack.

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Estante que guarda 16 livros e mostra quantos | 16 slots; 6 tábuas + 3 lajes | Bloco custom com geometria; tocar com livro = guarda (conteúdo em dynamic property do mundo, chave `bib:x,y,z,dim`, JSON). Visual: estado `cl:livros` 0–8 (passos de 2 livros, 9 permutações). Agachar+tocar vazio = retira o último | Alta | Baixo (só em interação) | Guardar só livros comuns (sem NBT) para simplificar a serialização |
| Estante conta para encantamento | 8 livros = 1 estante | Bloco custom não entra no cálculo da mesa de encantamento | Inviável | — | Receita "estante cheia → estante vanilla" ou deixar só decorativa |
| Redstone pela estante | 0–15 pelo slot | Bloco custom não emite redstone por script (não há API estável para emitir sinal) | Inviável | — | Ignorar |
| Prateleira/suporte de ferramentas/expositor/rótulo mostrando o item real | 4/16/2/3 slots | Bedrock não desenha item arbitrário em bloco custom. Opções: (a) estados com modelos genéricos ("tem ferramenta" sim/não por slot: 2⁴ = 16 permutações no Tool Rack); (b) usar molduras e suporte de armadura vanilla | Média (genérico) / Baixa (item real) | Baixo | Molduras vanilla (item frame) para mostrar o item exato |
| Armazenamento dos itens | — | Preferir entidade-contêiner invisível (`minecraft:inventory`) ancorada no bloco: `Container.transferItem/moveItem` preservam encantamento/nome/durabilidade (serializar ItemStack em JSON perde dados) | Alta | Baixo (entidade parada, sem AI) | Dynamic property com typeId+qtd para itens simples |
| Suporte de armadura com troca do conjunto inteiro | 4 slots; shift+clique troca tudo | Usar **suporte de armadura vanilla** para exibir; a troca: bloco custom "Cabide" guarda 4 peças numa entidade-contêiner; agachar+tocar troca com `EntityEquippableComponent` do jogador (Head/Chest/Legs/Feet) | Média | Baixo | Só o suporte vanilla (troca peça a peça) |
| Mesa | 3 slots | Bloco com geometria; estado `cl:toalha` (cor 0–15) para a toalha de lã; itens em cima: mesmo problema de exibição | Alta (móvel) / Baixa (itens visíveis) | Baixo | Mesa só decorativa |
| Lanterna/lâmpada colorida | 16 cores | Bloco custom com `minecraft:light_emission` 15 e estado `cl:cor` 0–15 (16 permutações); liga/desliga por toque (estado `cl:aceso`) → 32 permutações | Alta | Baixo | Menos cores (8) |
| Lâmpada liga por redstone | — | `Block.getRedstonePower()` só lendo em intervalo (polling) | Média | Médio (se houver muitas) | Liga/desliga por toque, sem redstone |
| Rótulo / Fancy Sign com texto | 3 itens; texto | Texto livre em bloco custom não é renderizável | Baixa | — | Placa/placa suspensa vanilla; nome do baú via bigorna |
| Typesetting Table / Printing Press (copiar livros) | receitas acima | Bedrock vanilla já copia livro escrito na bancada (livro escrito + livro e pena) | Alta (via vanilla) | Nenhum | — |

---

## 3. Sync (iChun) — fonte 1.6.4 lido

Fonte: `iChun/Sync`, commit **`cf0c22f` (2014-07-07)**, último antes do port 1.7 (`c938184`, 2014-07-10); versão 2.2.x para MC 1.6.4. Licença **LGPL v3** (COPYING.LESSER).

### Blocos e receitas [código 1.6.4: README.md, CommonProxy.java]
- **Sync Core**: `sensor de luz solar / bloco de lápis / sensor de luz solar` — `quartzo / pérola do Ender / quartzo` — `esmeralda / bloco de redstone / esmeralda`. Em **mundo Hardcore** a pérola vira **sinalizador (beacon)** (config `hardcoreMode` = 2: "só no Hardcore real").
- **Shell Constructor**: `obsidiana / Sync Core / obsidiana` — `painel de vidro ×3` — `obsidiana / redstone / obsidiana`.
- **Shell Storage**: `obsidiana / Sync Core / obsidiana` — `painel de vidro / bloco de ferro / painel de vidro` — `obsidiana / placa de pressão de ferro / obsidiana`.
- **Treadmill (esteira)**: `_ _ sensor de luz solar` — `tapete preto, tapete preto, barras de ferro` — `obsidiana, obsidiana, redstone`. Bloco de 2 de comprimento.
- Constructor e Storage têm 2 blocos de altura.

### Energia (números exatos do código)
- Construir um corpo custa **48 000 "Piggawatts" (PW)** (config `shellConstructionPowerRequirement`).
- Esteira: **lobo = 4 PW/tick, porco = 2 PW/tick** (outros mods registram por IMC). Lobo **domesticado** rende 75%: 4 → **3 PW/tick**. Bônus de "aquecimento": **+0 a +2 PW/tick**, crescendo linearmente em **12 000 ticks (10 min)** de corrida contínua (`timeRunning`).
- O Constructor soma a saída de **todas as esteiras nas 8 posições ao redor** (mesmo Y).
- RF: **1 RF = 2 PW** (`ratioRF` = 2) → 24 000 RF por corpo.
- Tempos calculados (1 esteira): **porco ≈ 15 000 ticks = 12,5 min**; **lobo selvagem ≈ 9 940 ticks ≈ 8,3 min**; **lobo domesticado = 12 000 ticks = 10 min**.
- Lobo sentado sai da esteira; animal machucado (perde vida) é solto; trela (lead) ajuda a prender e é devolvida.
- **Shell Storage**: consumo padrão **0 PW/tick** (`shellStoragePowerRequirement`), mas **precisa de sinal de redstone** para ativar (indicador verde).

### Regras de jogo [código 1.6.4]
- Dar a amostra: clicar no Constructor **causa 2 meio-corações = 1 coração de dano** (`damageGivenOnShellConstruction` = 2). Não há custo de fome encontrado.
- Cada corpo tem **inventário próprio, nível de XP próprio e até gamemode próprio** (README). Corpo novo nasce vazio.
- Trocar de corpo: entrar no Shell Storage ativo → **menu radial** com os corpos e posições; escolher um → a consciência vai para ele (o corpo atual fica guardado no Storage). Funciona **entre dimensões**, exceto o End (config `allowCrossDimensional` = 1).
- **Morte**: se houver corpo disponível, o jogador "ressincroniza" no **corpo mais próximo** (`overrideDeathIfThereAreAvailableShells` = 1: **só corpos em Storage**, não em Constructor). Corpo marcado como **"casa"** (clicar o Storage com uma **cama**) tem prioridade (`prioritizeHomeShellOnDeath` = 1). Pode nomear o Storage com **name tag**. Ressincronizar na morte entre dimensões = permitido.
- O corpo que morreu **não tem o evento de morte cancelado** → os itens dele caem normalmente (inferido do código: `LivingDeathEvent` não é cancelado; a vida vai a 20 e o jogador é transportado). XP do corpo morto: perdido como morte normal (inferido).
- Funciona em **Hardcore**: com corpo reserva você não é expulso do mundo hardcore (README).
- Quebrar um Storage com corpo dentro → o inventário do corpo cai no chão (`fake.inventory.dropAllItems`).
- Corpos são mantidos carregados (chunkloading próprio, `allowChunkLoading` = 1).
- Durante a sincronização o jogador não sofre dano.

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Sync Core / Constructor / Storage / Esteira | receitas acima | Itens e blocos custom de 2 de altura (geometria única 16×32 ou bloco + bloco "topo" invisível), receitas shaped | Alta | Baixo | — |
| Esteira com porco/lobo gera energia | porco 2, lobo 4 (domado 3) PW/t, +2 em 10 min | `system.runInterval` a cada **20 ticks**: para cada esteira registrada (lista em dynamic property), `dimension.getEntities({location, maxDistance:1, type})`; somar 20× a potência ao estoque do Constructor vizinho. Bônus de aquecimento guardado como contador em segundos. Animal fica preso com trela vanilla em poste/cerca | Alta | Baixo–Médio (1 consulta por esteira por segundo; limitar a 4 esteiras ativas) | Esteira "manual": o próprio jogador anda em cima (detectar posição) |
| Construção do corpo | 48 000 PW (≈ 8–12,5 min) | Progresso em dynamic property; visual do Constructor por estado `cl:progresso` 0–10 (11 permutações). Ao chegar a 100% grava "corpo pronto" | Alta | Baixo | Reduzir para ~5 min no celular (sessões curtas) |
| Custo de amostra | 1 coração | `player.applyDamage(2)` ao tocar no Constructor | Alta | Baixo | — |
| Storage exige redstone | sinal ligado; 0 PW/t | Ler `block.getRedstonePower()` só quando o jogador interage/entra | Alta | Baixo | Dispensar redstone |
| Inventário/XP/vida por corpo | inventário + XP + gamemode | Cada corpo = entidade invisível custom `cl:corpo` com `minecraft:inventory` (≥ 40 slots: 36 + 4 armaduras) ancorada no Storage. Trocar: mover itens jogador↔entidade com `Container.moveItem/swapItems` (preserva NBT), armaduras via `EntityEquippableComponent`, XP via `getTotalXp/resetLevel/addExperience`, vida via `minecraft:health`. Gamemode: ignorar | Alta | Baixo (só na troca) | Guardar só itens simples em dynamic property |
| Menu de escolha (radial) | lista de corpos + posição + "casa" | `ActionFormData` ao tocar/entrar no Storage; botões "Nome — X Y Z — dim — (casa)" | Alta | Baixo | — |
| Corpos longe/descarregados | chunkloading próprio | Antes de trocar, criar ticking area temporária de 1 chunk no corpo-alvo (`/tickingarea add` ou TickingAreaManager), esperar carregar, mover itens, remover a área. Limite Bedrock de 10 áreas → no máx. 1 temporária por vez | Média | Baixo (só durante a troca) | Exigir que o corpo esteja na mesma dimensão e até ~128 blocos (carregado) |
| Ressincronizar ao morrer no corpo mais próximo/"casa" | só Storage; casa tem prioridade; cross-dim ok (não End) | Não dá para cancelar a morte no API estável. Fazer: `entityDie` (jogador) → escolher corpo (casa > mais próximo) → na hora `player.setSpawnPoint` para o Storage; no `playerSpawn` (initialSpawn=false) carregar o inventário/XP do corpo e consumi-lo. Itens do corpo morto caem onde morreu (igual ao original) | Alta | Baixo | Só teleporte para o Storage, sem trocar inventário |
| Vida extra em Hardcore | funciona no hardcore | No **Hardcore do Bedrock** a morte é definitiva (vira espectador) e o script não impede | Inviável (hardcore real) | — | Modo "hardcore do add-on" (dynamic property de vidas) em mundo sobrevivência normal |
| Nomear Storage / marcar casa | name tag / cama | `onPlayerInteract` com item na mão: name tag → `ModalFormData` com texto; cama → alterna `casa` | Alta | Baixo | — |
| Animação de morte/câmera | zoom out | `player.camera.setCamera` + fade (`camera fade`) por 2–3 s | Média | Baixo | Só tela de fade + som |

---

## 4. ChickenChunks (chicken_bones)

Fonte: `Chicken-Bones/ChickenChunks` — o histórico público começa no **port 1.7.10 (2014-08-02)**; o código 1.6.4 não está no repo. Mecânica/padrões abaixo **[código posterior 1.7.10]**, quase certamente iguais ao 1.6.4.

### Números [código posterior]
- **Chunk Loader**: GUI do dono com **forma** (Quadrado, Círculo, Linha X, Linha Z) e **raio**. Raio padrão ao colocar: **2 em quadrado = 3×3 = 9 chunks** (raio r ⇒ (2r−1)² chunks no quadrado). Mínimo raio 1 (1 chunk).
- **Máx. por loader: 400 chunks** (`maxchunks`) → quadrado até raio 10 (19×19 = 361).
- **Limite por jogador: 5 000 chunks** (`players.DEFAULT`; comentário: "Forge gives everyone 12500 by default"), OP 5 000.
- **Funciona offline** por padrão (`allowoffline.DEFAULT=true`); `awayTimeout` 0 = infinito (minutos desde o último login).
- **Sinal de redstone desliga** o loader (`powered` → não força chunks).
- `cleanuptime` 1 200 ticks (limpeza de chunks órfãos). Só o dono altera (OP só com `op-interact`).
- **Spot Loader**: carrega **só o chunk em que está** (1 chunk), sem GUI.
- **Receitas**: Chunk Loader = `_ pérola-do-Ender _ / ouro ouro ouro / ouro mesa-de-encantamento ouro` (1). Spot Loader = **8 pérolas do Ender em volta de 1 Chunk Loader → 10 Spot Loaders**.
- Comando `/chunkloaders` lista os loaders.

### Licença
- Repo: **MIT** (c) 2014 ChickenBones (LICENSE criado em 2014-09, já na era 1.7.10). Licença da build 1.6.4: **não encontrada** (pré-MIT). Sem texturas relevantes a reaproveitar (bloco simples) — fazer próprias.

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Chunk Loader com raio/forma | padrão 3×3; até 400 chunks | Bloco custom; ao colocar cria ticking area (`TickingAreaManager` ou `/tickingarea add circle x y z r` / `add x1 z1 x2 z2`) com nome `cl_cl_<id>`. Raio escolhido por `ActionFormData`/`ModalFormData` (slider 1–2). Remove ao quebrar (`playerBreakBlock`) | Alta | **Médio–Alto** (cada chunk carregado roda tick de verdade; no celular manter ≤ 3×3) | Limitar o add-on a raio máx. 2 (3×3) |
| Limite global/por jogador | 5 000 chunks/jogador | Bedrock: **máx. 10 ticking areas por mundo** e cada área ≤ 100 chunks. Contar por jogador em dynamic property (ex.: 2 loaders por jogador, total 8, deixando 2 para scripts como o Sync) | Alta | Baixo | — |
| Spot Loader (1 chunk) | 10 por receita | Mesmo bloco com área de 1 chunk; receita 8 pérolas + loader → 10 | Alta | Baixo–Médio | — |
| Desligar com redstone | powered = off | `getRedstonePower()` lido a cada ~5 s só para loaders ativos (≤ 10), ou alternar por toque | Média | Baixo | Liga/desliga por toque |
| Offline / tempo ausente | offline = sim; awayTimeout 0 | `playerLeave`: opcionalmente remover áreas do dono; `playerSpawn`: recriar. Em mundo local de celular só existe "online" | Alta | Baixo | — |
| Lasers mostrando a área | — | Partículas nas bordas só ao abrir o menu (um disparo, não por tick) | Média | Baixo | Mensagem com coordenadas |

---

## 5. WAILA (ProfMobius)

Fonte: histórico original importado no repo `TehNut/HWYLA` — tags **`1.4.5` (2014-02-03)** e **`Waila_1.5.0` (2014-02-19, MC 1.6.4)**. Licença **Apache 2.0** (LICENSE.txt do próprio Waila 1.5.0). Requer NEI/CodeChickenCore no 1.6.4 (atalhos de receita/uso via NEI).

### O que mostra [código 1.6.4]
- Raycast do **cliente a cada tick**, alcance **4,0 blocos** (`RayTracing.fire()` → `rayTrace(viewpoint, 4.0, 0)`).
- **Cabeça**: nome do bloco/entidade (com ícone do item). **Cauda**: **nome do mod** em azul itálico ("Minecraft" para vanilla).
- **Entidades**: **vida em corações** (cheios/meio/vazios, `getHealth()/2` de `getMaxHealth()/2`); opção "agache para ver mais".
- **Vanilla**: tipo do spawner, **crescimento de plantações** (trigo, cenoura, batata, caules, cacau, verruga), estado da alavanca, atraso do repetidor, modo do comparador, força da redstone, silverfish disfarçado, disco na jukebox.
- **Plugins embutidos** (pasta `addons/`): Thermal Expansion (**RF "x / y RF"**, **tanque "x / y mB"** e modo, tesseract, dono), BuildCraft (**quantidade e tipo de fluido em tanque**, consumo), AE (conteúdo de monitor), EnderStorage (cores), IC2, Railcraft, Steve's Carts, Carpenter's Blocks, HarvestCraft/MagicalCrops etc.
- Opções: mostrar/ocultar, mostrar líquidos (olhar para fluido), metadata, "shift para ver blocos/entidades", posição X/Y, escala, transparência e cores. Teclas padrão: Numpad0 config, Numpad1 mostrar, Numpad2 líquido, Numpad3/4 receita/uso (NEI).
- **Progresso de máquinas** (ex.: fornalha): **não encontrado** no Waila 1.5.0 vanilla (só aparece em versões/plugins posteriores).

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Nome do bloco olhado | alcance 4, todo tick | `system.runInterval` a cada **5 ticks**: `player.getBlockFromViewDirection({maxDistance: 5})`; mostrar via rawtext `{translate: block.localizationKey}`. Só reenviar à actionbar quando o alvo mudar (+ refresh a cada 1 s) | Alta | Médio (1 raycast/5 ticks/jogador) | 10 ticks, ou só quando agachado/segurando "Lupa" |
| Nome da entidade + vida em corações | corações = vida/2 | `getEntitiesFromViewDirection({maxDistance: 5})[0]`; `entity.localizationKey` + `minecraft:health` (currentValue/effectiveMax) → "❤ 7/10" | Alta | Médio (mesmo intervalo; fazer 1 raycast de entidade e, se vazio, o de bloco) | Mostrar só vida, sem nome |
| Nome do mod | cauda azul | Namespace do `typeId` ("minecraft" → "Minecraft", "cl" → "Pouso Forçado") | Alta | Baixo | — |
| Crescimento de plantas | % por idade | `block.permutation.getState('growth')` (vanilla) → "Crescimento 57%" | Alta | Baixo | — |
| Progresso de máquinas / energia / tanques | "x / y RF", "x / y mB" | Ler dynamic property/estado dos blocos do próprio add-on (Constructor do Sync, tanques, barris) — "Clone 63%", "Água 4/8" | Alta | Baixo | — |
| Conteúdo de baú/fornalha | (plugins) | `block.getComponent('inventory')` → resumo "12 itens" / item na fornalha | Média | Médio (ler container a cada troca de alvo, não a cada 5 ticks) | Só nome |
| HUD em caixa com ícone | overlay | Actionbar já usada para sede/temperatura: compor 2 linhas (linha 1 = WAILA, linha 2 = sede/temp) ou alternar; ícone só com glifos/emojis do pack de fontes | Média | Baixo | Usar `title` subtítulo curto |
| Teclas (mostrar/ocultar) | Numpad | Toggle num menu de opções (`ActionFormData`), salvo em dynamic property do jogador | Alta | Baixo | — |

---

## 6. Inventory Tweaks (Kobata / Marwane Kalam-Alami)

Fonte: `Inventory-Tweaks/inventory-tweaks`, tag **`1.56`** (2013-08-21; changelog: "1.56 (1.6.2)"; a 1.57 só sai em 2014-03 para 1.7). A build usada em packs 1.6.4 era a linha 1.56 (exato do pack: **não encontrado**). Licença **MIT** (c) 2011-2013 Marwane Kalam-Alami.

### Funcionalidades [código/doc 1.6.4: InvTweaksConfig.java, invtweaks_docs/index.txt]
- **Ordenar**: tecla **R** (padrão) ou **clique do meio**, mesmo fora do inventário. No grid de crafting o clique do meio **equilibra** as quantidades.
- **Baús**: **3 botões** no topo (ordenação padrão, por colunas, por linhas); clique do meio alterna.
- **Auto-reabastecer** (padrão **ligado**): ao **comer** um item, **quebrar ferramenta** ou **acabar a pilha** ao colocar blocos, busca item igual no inventário (desde 1.55 casa metadata exata — lã, tapete etc.).
- `autoRefillBeforeBreak` (modo "amigo do reparo") **desligado**; quando ligado troca a ferramenta quando faltam **5** de durabilidade (`autoRefillDamageThreshhold` = 5).
- Ordenar ao pegar item: desligado. Auto-equipar armadura: desligado. Sons: ligado.
- Atalhos no inventário: Ctrl = 1 item; Ctrl+Shift = todos daquele tipo; Espaço = tudo; Alt = soltar; ↑/↓ = mover para a seção de cima/baixo.
- **Regras** (`InvTweaksRules.txt`): alvo + palavra-chave — `D1 pickaxe` (hotbar coluna 1 = melhor picareta), linha `D sword`, coluna `1 sword`, retângulo `A5-C9 stuff`; modificadores `r` (reverso) e `v` (vertical); `LOCKED` (não move na ordenação), `FROZEN` (nunca move, nem no refill); itens por ID. Vários perfis (`Mining:` / `Fighting:`) trocados segurando R 1 s ou **1–9 + R**.
- Árvore de categorias (`InvTweaksTree.txt`) define a ordem dos itens (ex.: espada de ferro antes de outras).

### Tabela Bedrock
| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Ordenar inventário | tecla R / clique do meio | Não há tecla nem botão na tela de inventário. Gatilho: item "Organizador" (usar = ordena), comando custom (`/cl:ordenar` se custom commands estiverem disponíveis no 2.x), ou opção no menu do add-on. Script: ler os 27 slots (9–35) do `inventory.container`, juntar pilhas (`isStackableWith`), ordenar por categoria (tabela própria) + `typeId`, regravar | Alta | Baixo (só sob demanda; ~36 leituras) | Agachar + usar item vazio não existe → usar o item |
| Ordenar baú | 3 botões (padrão/colunas/linhas) | Tocar no baú segurando o Organizador: `block.getComponent('inventory').container`, ordenar. Modo (padrão/colunas/linhas) alternado em `ActionFormData` | Alta | Baixo | — |
| Auto-reabastecer bloco/comida | quando a pilha acaba | Eventos `playerPlaceBlock` (after) e `itemCompleteUse` (comida): se o slot selecionado ficou vazio, procurar o mesmo `typeId` em 9–35 e `container.moveItem` para o slot da mão | Alta | Baixo (event-driven) | — |
| Auto-reabastecer ferramenta quebrada | ao quebrar | `playerBreakBlock` (after) traz `itemStackBeforeBreak`/`itemStackAfterBreak`: se antes havia ferramenta e depois `undefined` → buscar mesma ferramenta (mesmo typeId; senão mesma classe: picareta/machado/pá/espada) e mover. Para armas: `entityHitEntity` + checar slot | Alta | Baixo | — |
| Trocar antes de quebrar (reparo) | limiar 5 de durabilidade | Após cada quebra, se `durability.maxDurability - damage ≤ 5`, mover para o inventário e puxar outra | Alta | Baixo | Opção desligada por padrão, como no original |
| Regras de hotbar (D1 pickaxe…), LOCKED/FROZEN | arquivo de regras | `ModalFormData` com dropdown por slot da hotbar (9 categorias) salvo em dynamic property do jogador; a ordenação respeita e não toca nos slots "congelados" | Média | Baixo | Só "hotbar travada" (não ordenar 0–8) |
| Atalhos de transferência (Ctrl/Shift/Espaço) | — | Bedrock já tem toque rápido/arrastar; Script não intercepta cliques na UI | Inviável | — | Comando "despejar tudo no baú olhado" via Organizador agachado |
| Perfis múltiplos | 1–9 + R | Lista de perfis no formulário | Média | Baixo | Um único perfil |

---

## Resumo de licenças
| Mod | Código | Texturas/assets | Reaproveitar? |
|---|---|---|---|
| Chisel 1.x | GPL v2 (port 1.7.2 do decompilado 1.6.4); original sem licença publicada | Muitas do **Painterly pack** (terceiros) | Só a mecânica; texturas próprias |
| BiblioCraft | 1.6.4 fechado; fonte 1.12.2+ **MIT** (2022) | Assets do repo MIT | Sim, com aviso MIT e crédito a Nuchaz (preferível estilo próprio) |
| Sync | **LGPL v3** | No repo (mesma licença presumida) | Com crédito a iChun; se copiar código, manter LGPL |
| ChickenChunks | **MIT** (repo 1.7.10); 1.6.4 não encontrado | Irrelevante | Sim, com crédito |
| WAILA | **Apache 2.0** | — | Sim, com NOTICE/crédito a ProfMobius |
| Inventory Tweaks | **MIT** | Botões simples | Sim, com crédito |

## Pontos incertos
1. Versões exatas dos jars no Crash Landing (BiblioCraft, Chisel 1.5?, InvTweaks 1.56-b77?) — não encontradas.
2. Receitas/slots do BiblioCraft são do fonte 1.12.2 (prováveis iguais às de 1.6.4, não confirmado); Fancy Sign provavelmente ausente no 1.6.4.
3. ChickenChunks: números do fonte 1.7.10 (o 1.6.4 não está no GitHub).
4. Chisel: durabilidade 500 no código 1.6.4 decompilado vs. 512 no FTB wiki.
5. Sync: queda de itens/XP do corpo que morre é dedução do código (evento de morte não cancelado), não texto explícito.
6. Bedrock: disponibilidade de comandos custom e de `TickingAreaManager` no `@minecraft/server` 2.x deve ser conferida na versão exata usada; `EntityEquippableComponent` só funciona em jogadores (por isso o suporte de armadura usa entidade-contêiner/vanilla).

## Fontes
Código (clonado via git, commits citados):
- https://github.com/iChun/Sync (commit cf0c22f, README.md, sync/common/Sync.java, TileEntityTreadmill.java, TileEntityShellConstructor.java, TileEntityDualVertical.java, EventHandler.java, CommonProxy.java)
- https://github.com/Chicken-Bones/ChickenChunks (ChunkLoaderManager.java, ChunkLoaderProxy.java, TileChunkLoader.java, ChunkLoaderShape.java, LICENSE.txt)
- https://github.com/Chisel-Team/Chisel (commit c79c767b: README.md, Chisel.java, ItemChisel.java, MarbleWorldGenerator.java, mcmod.info, LICENSE)
- https://github.com/TehNut/HWYLA (refs/import/tags/Waila_1.5.0 e 1.4.5: LICENSE.txt, RayTracing.java, HUDHandlerEntities.java, HUDHandlerVanilla.java, addons/*, Constants.java)
- https://github.com/Inventory-Tweaks/inventory-tweaks (tag 1.56: LICENSE.md, InvTweaksConfig.java, invtweaks_docs/index.txt, changelog.txt)
- https://github.com/Nuchaz/BiblioCraft-Source (branch 1.12.2: LICENSE, recipes/*.json, tileentities/*.java)

Web (trechos de busca):
- https://ftb.fandom.com/wiki/Chisel_(mod)
- https://ftb.fandom.com/wiki/Chisel_(item)
- https://www.curseforge.com/minecraft/mc-mods/chisel-retro
- https://www.bibliocraftmod.com/wiki/bookcase/
- https://bibliocraftmod.com/wiki/typesetting-table
- https://www.bibliocraftmod.com/wiki/fancy-sign/
- https://bibliocraftmod.com/?p=427
- https://www.bibliocraftmod.com/?p=417
- https://www.9minecraft.net/bibliocraft-mod/wiki/
- https://hexxit.fandom.com/wiki/Armor_Stand_(BetterStorage)
- https://www.curseforge.com/minecraft/mc-mods/waila/files/774350
- https://blog.curseforge.com/waila-minecraft-mod-faqs/
- https://mineyourmind.readthedocs.io/en/latest/Modpacks_Server/1.6.4/crash_landing.html
- https://board.aternos.org/thread/2581-modpackcrash-landing-v1-1-2-1-minecraft-version-1-6-4/
- https://forum.feed-the-beast.com/threads/how-to-successfully-limit-allotted-chunks-for-chunkloaders.31021
- https://feed-the-beast.fandom.com/wiki/ChickenChunks
- https://modrinth.com/mod/sync-re-forged (port moderno, só para contraste: 256 000 FE por corpo)

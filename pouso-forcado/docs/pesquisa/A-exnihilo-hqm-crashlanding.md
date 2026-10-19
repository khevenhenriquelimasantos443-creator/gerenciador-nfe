# Pesquisa A — Ex Nihilo + Ex Aliquo, Hardcore Questing Mode e o modpack Crash Landing (1.6.4)

Objetivo: levantar as **mecânicas e números** desses mods do Java 1.6.4 para recriá-las no add-on Bedrock "Pouso Forçado" (celular).

## 0. Como esta pesquisa foi feita (leia antes dos números)

- **Restrição de acesso:** neste ambiente só o GitHub (github.com / raw.githubusercontent.com) respondeu. ftbwiki.org, ftb.fandom.com, ex-nihilo-minecraft.fandom.com, forum.feed-the-beast.com, curseforge.com, modrinth.com, 9minecraft, aternos e giantitp **não abriram** (falha de DNS/proxy). O que vem desses sites saiu só dos **trechos devolvidos pela busca na web**, e está marcado **[busca]**.
- **Fonte dos números do Ex Nihilo:** não achei o código-fonte da versão 1.6.4 (a **1.29e**, que o Crash Landing usava). Os números exatos vêm do repositório **LegacyModdingMC/ex-nihilo**. O README dele diz: *"Fork of Ex-Nihilo from bitbucket and decompiled 1.38-53"*. Isso é o código **1.7.10** do mesmo autor e da mesma linhagem. Esses números estão marcados **[EN-1.7.10]**.
  - O que muda com certeza em relação à 1.6.4: acácia e carvalho-escuro não existem na 1.6.4. As malhas de pederneira, ferro e diamante também não; na 1.6.4 só existe a **malha de seda**, e é por isso que o fork guarda essa receita como `LEGACY_SIEVE`.
  - O que pode mudar: os valores de raridade. Uma comparação com a wiki fandom **[busca]** mostra os mesmos números na maioria dos itens, com uma diferença pequena em uma das pedras.
- **Fonte dos números do HQM:** vêm do branch **1.7.10** de **lorddusk/HQM**, porque não existe branch 1.6.4. O Crash Landing usava o HQM **4.0.5**. Esses números estão marcados **[HQM-1.7.10]**.
- **Ex Aliquo:** o código vem de **Zerokyuuni/Ex-Aliquo**, que é da era 1.6.x: usa IDs numéricos, `Block.whiteStone` e `Item.reed`. Marcado **[ExA]**.
- Quando um número não apareceu, escrevi **"não encontrado"**.

---

## 1. Ex Nihilo (erasmus_crowley) — versão no Crash Landing: 1.29e [busca: wiki FTB, lista de mods do Crash Landing]

### 1.1 Peneira (Sieve) e malha de seda
- **Receitas [EN-1.7.10, `Recipes.java`]:**
  - Malha de seda = 9 linhas (*string*) preenchendo a grade 3x3.
  - Peneira na 1.6.4 (modo "legacy"): `tábua, malha, tábua / tábua, malha, tábua / graveto, _, graveto`. Leva 4 tábuas, 2 malhas de seda e 2 gravetos.
  - Na 1.7.10 sem legacy, a malha virou um item separado: seda → pederneira → ferro → diamante, cada uma com tabela própria. **Isso não existe na 1.6.4.**
- **Como funciona [EN-1.7.10, `TileEntitySieve.java`]:**
  - Cada clique adiciona **0,075** de progresso, com no máximo um clique a cada **4 ticks**.
  - Termina com progresso ≥ 1, ou seja, em **14 cliques**, cerca de **2,6 s** segurando o botão.
  - Cada linha da tabela é sorteada **independentemente** com chance **1/raridade** (`rand.nextInt(rarity)==0`), e cada sucesso solta 1 item.
  - Não há efeito de Fortuna/Sorte.
  - A automação vem desligada por padrão (`sieve automation allowed=false`, em `ModData.java`).
- **Tabelas padrão [EN-1.7.10, `SieveRegistry.java`]** (chance = 1/raridade):

| Bloco peneirado | Drop (raridade → chance) |
|---|---|
| **Terra** | Pedrinha (*Stones*): 6 linhas com raridade 1, 1, 2, 2, 3, 3 → 100%, 100%, 50%, 50%, 33%, 33% (média ≈ 3,67 pedrinhas por bloco). A wiki fandom **[busca]** lista 100/100/50/50/33/**22%**. Sementes de trigo 1/15 (6,7%); Sementes de grama 1/15 (6,7%); Melancia 1/32 (3,1%); Abóbora 1/32 (3,1%); "Semente" de cana 1/32 (3,1%); Cenoura 1/64 (1,6%); Batata 1/64 (1,6%); Semente de carvalho 1/64 (1,6%); Abeto 1/90, Bétula 1/90 (1,1%); Acácia 1/90 (não existe na 1.6.4) |
| **Cascalho** | Pederneira 1/4 (25%); Carvão 1/8 (12,5%); Lápis-lazúli 1/20 (5%); Diamante 1/128 (0,78%); Esmeralda 1/150 (0,67%); + **minério quebrado** (*broken*), ver 1.5 |
| **Areia** | Cacau 1/32 (3,1%); Semente de cacto 1/32 (3,1%); Semente de selva 1/64 (1,6%); Esporos 1/128 (0,78%); + **minério triturado** (*crushed*) |
| **Poeira (Dust)** | Farinha de osso 1/5 (20%); Redstone 1/8 (12,5%); Pólvora 1/15 (6,7%); Pó de glowstone 1/16 (6,25%); Pó de blaze 1/20 (5%); + **minério em pó** (*powdered*). A wiki fandom **[busca]** confirma 20% e ~13% |
| **Areia das almas** | Quartzo 1/1 e 1/3; Fungo do Nether 1/20; Lágrima de Ghast 1/64 |

- **Mudança no Crash Landing [busca, changelog do fórum FTB]:**
  - "buffed iron drops from dust and gravel sieving slightly". O valor novo **não foi encontrado**.
  - Tirou as sementes vanilla da peneira e do livro de quests e depois pôs sementes do Harvestcraft no lugar.
  - Dica de jogador **[busca]**: peneirar poeira durante a 1ª noite dá "~24 stones", o suficiente para uma fornalha de laje e tesouras. Isso sugere que **no Crash Landing a poeira também solta pedrinhas**, o que não acontece no padrão. Configuração exata: não encontrada.

### 1.2 Cadinho (Crucible)
- **Receita [EN-1.7.10]:**
  - Porcelana = argila (bola) + farinha de osso, sem forma.
  - Cadinho cru = 7 porcelanas em formato de "U" (`x_x / x_x / xxx`). Cozinhar na fornalha dá o cadinho.
- **O que derrete [EN-1.7.10, `CrucibleRegistry.java`]:**

| Entrada | Ocupa | Rende |
|---|---|---|
| Pedregulho | 2000 | **250 mB de lava** |
| Pedra | 2000 | **250 mB de lava** |
| Cascalho | 2000 | **250 mB de lava** |
| Netherrack | 2000 | **1000 mB de lava** |
| Neve | 2000 | **500 mB de água** |
| Gelo | 2000 | **1000 mB de água** |

  Resultado: **4 pedregulhos = 1 balde de lava**.
- **Capacidade [EN-1.7.10, `TileEntityCrucible.java`]:**
  - O volume total é **10 000**, compartilhado entre sólido, fluido e ar.
  - Cada pedregulho ocupa 2000, então cabem **≈5 blocos na fila**.
  - Não mistura fluidos diferentes.
- **Calor [EN-1.7.10, `HeatRegistry.java`]:** a fonte é o bloco **diretamente abaixo**, e a velocidade é em mB derretidos por tick.

| Fonte | Velocidade | 1 pedregulho (250 mB) | 1 balde (1000 mB) |
|---|---|---|---|
| Tocha | 0,1 mB/tick | 2500 ticks ≈ 125 s | ≈ 8 min 20 s |
| Lava (fonte) | 0,2 mB/tick | 1250 ticks ≈ 62,5 s | ≈ 4 min 10 s |
| Lava corrente | 0,1 mB/tick | ≈ 125 s | ≈ 8 min 20 s |
| Fornalha acesa | 0,15 mB/tick | ≈ 83 s | ≈ 5 min 33 s |
| Fogo | 0,3 mB/tick | ≈ 41,7 s | ≈ 2 min 47 s |

  Os tempos são cálculo meu a partir das velocidades do código.
- O fluido sai por cano (`IFluidHandler`). No Crash Landing, jogadores citam usar o cadinho **com folhas** para fazer água "sem combustível" **[busca, fórum]**. A entrada de folhas **não aparece** no registro padrão; pode vir de configuração ou de outro mod. Valor em mB: **não encontrado**.

### 1.3 Barril (madeira / pedra)
- **Receitas [EN-1.7.10]:**
  - Barril de madeira: `tábua _ tábua / tábua _ tábua / tábua laje tábua`.
  - Barril de pedra: o mesmo formato com pedra e laje de pedra.
- **Capacidade:** **1000 mB** (1 balde). O barril não mistura fluidos. Os itens prontos saem com clique-direito, e só pela face de baixo quando é automação [EN-1.7.10, `TileEntityBarrel.java`].
- **Compostagem → terra:**
  - Os itens enchem de 0 a 1,0.
  - Depois de cheio, leva **1000 ticks (50 s)** para virar **terra**.
- **Valores de compostagem [EN-1.7.10, `CompostRegistry.java`]:**

| Valor | Itens |
|---|---|
| 0,125 (8 para 1 terra) | Muda, folhas |
| 0,1 (10 para 1 terra) | Carne podre, flores, cogumelos, maçã, cacto, vitória-régia, trepadeira, fungo do Nether |
| 0,08 (12,5 por terra) | Olho de aranha, trigo, cenoura, batata (crua/assada/venenosa), grama alta, ovo, cana |
| 0,16 | Pão, torta de abóbora |
| 0,2 (5 por terra) | Carnes cruas e cozidas (porco, boi, frango) |
| 0,15 | Peixes |
| ≈0,1667 (6 por terra) | Melancia (bloco), abóbora, abóbora-lanterna |
| 0,04 (25 por terra) | Fatia de melancia, bicho-da-seda (cru/cozido), linha |

- **Chuva enche:**
  - Taxa: `volume += chuvaDoBioma/1000` por tick, o que equivale a `rainfall` mB/tick. Com bioma de chuva 0,5, o barril enche em cerca de 2000 ticks (100 s).
  - Configuração `Allow barrels to fill when raining = true`.
- **Lava + água:**
  - Barril cheio de **lava** com **bloco de água em cima** → **obsidiana**.
  - Barril cheio de **água** com **bloco de lava em cima** → **pedregulho**.
  - Exige o bloco de fluido acima, não balde.
- **Lava em barril de madeira:** a cada 400 ticks, se não estiver cheio, põe fogo em cima. Se estiver cheio, o barril vira um bloco de lava.
- **Água + leite (balde) → slime:**
  - 1000 ticks no modo "leitoso" → estado SLIME.
  - Em dificuldade ≠ pacífico: mais 1000 ticks e **nasce um Slime** em cima.
  - Ou o jogador retira **1–4 bolas de slime**.
  - Total ≈ 2000 ticks (100 s).
- **Água + Poeira → bloco de argila**, na hora (é uma receita do barril).
- **Outras receitas de barril [EN-1.7.10, `BarrelRecipeRegistry.java`]:**
  - Lava + redstone → netherrack.
  - Lava + pó de glowstone → pedra do End.
  - Água-de-bruxa + areia → areia das almas.
  - Água-de-bruxa + muda de carvalho → muda de carvalho-escuro (não existe na 1.6.4).
  - Água-de-bruxa + flores → flores duplas.
- **Água → água-de-bruxa:** barril de água cheio perto de **micélio** (raio de 1 bloco). Leva cerca de 1000 ticks e acelera com mais micélio.
- **Mobs:**
  - Lava + **Boneca Raivosa** → Blaze, depois de 1000 ticks. Em barril de madeira, explode com força 4.
  - Água-de-bruxa + **Boneca Sinistra** → Enderman.
  - Em pacífico, soltam vara de blaze e pérola do End.
- **Barril de madeira com água:** a cada tick, 1/500 de chance de transformar pedregulho ou tijolo de pedra próximo em versão musgosa, gastando 100 mB.

### 1.4 Martelo
- **Receita [EN-1.7.10]:** `_ x _ / _ graveto x / graveto _ _`. O `x` pode ser tábua, pedregulho, ferro, ouro ou diamante.
- **Material:** o martelo usa o material vanilla da ferramenta (madeira, pedra, ferro, ouro e diamante = `EMERALD`) [EN-1.7.10, `HammerType.java`].
  - **Durabilidade = a da ferramenta vanilla do mesmo material:** madeira 59, pedra 131, ferro 250, ouro 32, diamante 1561. São constantes vanilla de `ToolMaterial`, não aparecem no arquivo do mod.
  - Velocidade = eficiência do material × 0,75 nos blocos registrados; 0,8 nos outros.
  - Dano base: 3.
- **O que o martelo quebra [EN-1.7.10, `HammerRegistry.java`]:** cada entrada é (chance, bônus por Fortuna).

| Bloco | Resultado |
|---|---|
| Pedregulho | Cascalho (100%) |
| Cascalho | Areia (100%) |
| Areia | **Poeira** (100%) |
| Arenito | Areia (100%) |
| Pedra | Pedrinhas: 1,0 / 0,75 / 0,75 / 0,5 / 0,25 / 0,05, com +0,1 por nível de Fortuna nas chances < 1 (média ≈ 3,3) |
| Netherrack | Cascalho do Nether |
| Pedra do End | Cascalho do End |
| Gelo | Lascas de gelo |

  A cadeia principal é **pedra → cascalho → areia → poeira**.
- **Pedrinhas → pedregulho:** 4 pedrinhas em 2x2 = 1 pedregulho [EN-1.7.10].

### 1.5 Pedaços de minério → minério → lingote
- **De onde vêm [EN-1.7.10, `OreRegistry.java`]:**
  - Cascalho na peneira dá pedaço **quebrado** (*broken*).
  - Areia na peneira dá **triturado** (*crushed*).
  - Poeira na peneira dá **em pó** (*powdered*).
  - O martelo também converte: cascalho-de-minério → triturado, areia-de-minério → em pó. A quantidade **não foi encontrada**; está registrada com chance 0, então a lógica fica em outro arquivo.
- **Conversão:**
  - **4 pedaços (2x2) = 1 bloco** de "cascalho/areia/poeira de minério".
  - **Fornalha:** esse bloco vira **1 lingote**. Portanto **4 pedaços = 1 lingote**.
- **Raridade padrão na peneira [EN-1.7.10, `OreList.java`]** (mesma raridade nos três estágios):

| Minério | Chance |
|---|---|
| Ferro | 1/5 (20%) |
| Ouro | 1/32 |
| Cobre | 1/18 |
| Estanho | 1/18 |
| Prata | 1/45 |
| Chumbo | 1/32 |
| Níquel | 1/32 |
| Platina | 1/128 |
| Alumínio | 1/8 |
| Ósmio | 1/10 |

  Os minérios de outros mods só aparecem se algum mod registrar aquele minério. As variantes de Nether e End são da 1.7.10.
- **No Crash Landing 1.1.0 [busca, changelog]:**
  - Tirou o *oreDict* dos cascalhos e areias de minério do Ex Nihilo e Ex Aliquo, para evitar um exploit.
  - Criou receitas no **High Oven** (Tinkers' Steelworks).
  - Mudou o **pulverizador**: agora rende areia-de-minério + pó + fragmentos, "just like, but slightly less efficient than, a hammer".

### 1.6 Sementes da peneira
- As sementes de árvore e planta são itens próprios do mod: carvalho, abeto, bétula, selva, cacto, cana, cenoura, batata, grama e esporos.
- Uso: plantar na terra; os esporos transformam terra em micélio. As chances estão na tabela 1.1.
- Detalhe do plantio por item: **não encontrado** (não abri os arquivos `ItemSeed*`).

### 1.7 Bicho-da-seda e seda
- **Cajado (*crook*) [EN-1.7.10, `Recipes.java`]:** gravetos em formato de bengala (`xx_ / _x_ / _x_`).
- **Obter o bicho [EN-1.7.10, `CrookUtils.java`]:**
  - Quebrar **folhas** com o cajado: **1/100** de chance de bicho-da-seda.
  - Quebrar **folhas infestadas** com o cajado: **1/15**.
- **Infestar [EN-1.7.10, `ItemSilkworm.java` e `TileEntityLeavesInfested.java`]:**
  - Clique-direito com o bicho numa folha transforma a folha em **folha infestada** e consome 1 bicho.
  - O progresso sobe +0,0005 por tick: **2000 ticks (100 s)** até 100%.
  - Acima de **60%** começa a **espalhar**. A cada cerca de 100 ticks sorteia um vizinho num cubo 3x3x3 (1/27 por posição) e, se for folha, infesta.
- **Seda [EN-1.7.10, `BlockLeavesInfested.java`]:** ao quebrar uma folha infestada:
  - 1º sorteio: chance de linha = progresso × **0,4**.
  - 2º sorteio: progresso × **0,1**.
  - Resultado: até 2 linhas por folha. A folha em si não dropa.
  - Configuração `infested leaf string chance = 0.4`.
- **Bicho-da-seda cozido:** fornalha.

### 1.8 Licença (Ex Nihilo)
- **Licença original da 1.6.4 (Erasmus Crowley): não encontrada.**
  - O fork LegacyModdingMC/ex-nihilo está marcado **GPL-3.0**, mas declara ser parte **descompilação** da versão do CurseForge. A etiqueta GPL de um fork não garante direitos sobre o código e as **texturas** originais.
  - **Recomendação:** não copiar código nem texturas. Reimplementar a mecânica do zero em JS e desenhar texturas próprias. Regras de jogo e números não são, em geral, protegíveis; dar crédito como inspiração ("inspirado em Ex Nihilo, de Erasmus_Crowley").
- **Referência Bedrock que já existe:** PrograMistV1/ExNihilo_Bedrock é um port do **Ex Nihilo: Sequentia**, outro mod da família.
  - Licença **CC BY-NC-SA 4.0**: não comercial e com compartilhamento pela mesma licença. Parte da arte tem copyright da NovaMachina.
  - Dá para **estudar** como resolveram as coisas, mas copiar arte ou código obriga o add-on a ser NC-SA.

### 1.9 Tabela de recriação — Ex Nihilo

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Peneira manual por cliques | 14 cliques (0,075 cada), 1 clique/4 ticks; drop = 1/raridade por linha [EN-1.7.10] | Evoluir a Peneira atual. `onPlayerInteract` soma 1 ao estado `cl:progresso` (0–14 cabe nos 16 valores); o cooldown fica num `Map` em memória com `system.currentTick`; ao completar, sorteia a tabela e usa `dimension.spawnItem` acima do bloco | Alta | Baixo | — |
| Tabela por bloco (terra/cascalho/areia/poeira) | Ver tabela 1.1 | Tabela JS `{bloco: [[item, raridade], ...]}` com sorteio independente. Terra rende pedrinhas e sementes; poeira rende pedrinhas (como no Crash Landing), farinha de osso etc. | Alta | Baixo | — |
| Malha de seda / malhas | Malha = 9 linhas; peneira = 4 tábuas + 2 malhas + 2 gravetos | Receita JSON *shaped*. Se quiser níveis de malha: estado `cl:malha` (seda/pederneira/ferro) trocado com a malha na mão, e uma tabela por malha | Alta | Baixo | Só a malha de seda, como na 1.6.4 |
| Peneira automática | Desligada por padrão no EN | Já existe no add-on: puxa de baú/funil adjacente e gasta E | Alta | Médio (varredura de inventário a cada ≥20 ticks) | Processar 1 bloco por intervalo |
| Cadinho: pedra → lava | 250 mB por pedregulho/pedra/cascalho; 1000 por netherrack; capacidade 10 000 (≈5 blocos na fila) | Bloco custom com `onTick` (20 ticks): lê o bloco abaixo, faz `mB += calor×20`. Estado `cl:nivel` 0–10 para o visual; mB e fila exata em `world.setDynamicProperty("cad:x,y,z", json)` (bloco não tem dynamic property própria). Entrada por item na mão ou funil acima; saída com balde vazio (≥1000 mB → balde de lava) ou colocando uma fonte de lava ao lado | Alta | Baixo–Médio (1 leitura de bloco por tick do componente) | Rendimento direto: 4 pedregulhos + tempo fixo → balde de lava |
| Fontes de calor | Tocha 0,1; lava 0,2; lava corrente 0,1; fornalha acesa 0,15; fogo 0,3 mB/tick | Mapa `{"minecraft:torch":0.1, "minecraft:lava":0.2, "minecraft:lit_furnace":0.15, "minecraft:fire":0.3}`. Somar também blocos de calor do add-on ligados a E (ex.: "aquecedor elétrico") | Alta | Baixo | — |
| Cadinho: gelo/neve/folhas → água | Gelo 1000, neve 500 mB; folhas: valor não encontrado | Útil no deserto sem água: folhas da Estufa → água. Mesma lógica do cadinho, com tipo de fluido em estado `cl:fluido` (nenhum/lava/água) | Alta | Baixo | Usar só o Condensador de Água |
| Barril: compostagem | Itens valem de 0,04 a 0,2; cheio + 1000 ticks → terra | Já existe o Compostor de Terra; basta adotar os valores (muda/folha 0,125, carne 0,2 etc.). `onTick` 20 ticks: 50 execuções = 1000 ticks. Estado `cl:cheio` 0–8 + `cl:fase` | Alta | Baixo | — |
| Barril: chuva enche | `rainfall` mB/tick | No deserto **não chove** (bioma seco). Dá para ler o tempo com `dimension.getWeather()`, mas em deserto não haverá chuva | Inviável (no deserto) | — | Condensador de Água enchendo barris adjacentes |
| Lava + água = obsidiana / água + lava = pedregulho | Barril cheio + bloco de fluido em cima | `onTick`: se o conteúdo for lava cheia e o bloco acima for `minecraft:water` → estado `obsidiana`; retira com clique | Alta | Baixo | — |
| Água + leite = slime | 1000 + 1000 ticks; 1–4 bolas ou spawn de Slime | Balde de leite com `onPlayerInteract` → estado `leite`; depois de 50 ticks de componente, `spawnEntity("minecraft:slime")` ou retirada de 1–4 bolas | Alta | Baixo | Só dar as bolas |
| Água + poeira = argila | Instantâneo | `onPlayerInteract` com Poeira na mão + água cheia → estado `argila` | Alta | Baixo | — |
| Lava + redstone/glowstone; água-de-bruxa | Ver 1.3 | Mais estados do barril. A água-de-bruxa exigiria fluido custom, e **fluido custom não existe no Bedrock** | Média (receitas) / Baixa (fluido) | Baixo | Água-de-bruxa como "estado do barril", sem bloco de fluido |
| Bonecas → Blaze/Enderman | 1000 ticks | `spawnEntity` depois do tempo | Alta | Baixo | Dar o drop direto (vara de blaze / pérola) |
| Martelo | Pedra → cascalho → areia → poeira (100%); durabilidade 59/131/250/32/1561 | Item custom com `minecraft:durability` e `minecraft:digger` (velocidade por bloco). Em `world.beforeEvents.playerBreakBlock`, com martelo na mão e bloco na tabela: cancelar, trocar o bloco por ar via `system.run`, dar `spawnItem` do resultado e aplicar dano ao item | Alta | Baixo | Bancada que "martela" com E (estilo pulverizador do Crash Landing) |
| Pedrinhas → pedregulho | 4 em 2x2 = 1 | Receita JSON | Alta | Baixo | — |
| Pedaços de minério | 4 pedaços = 1 bloco-de-minério → fornalha = 1 lingote; ferro 1/5, ouro 1/32… | Itens custom (quebrado/triturado/em pó por metal); receita 2x2; bloco "cascalho de ferro" + receita de fornalha (o JSON de fornalha aceita item custom). Para economizar itens, fazer 4 pedaços → **1 item "minério bruto"** → fornalha | Alta | Baixo | Peneira solta direto `raw_iron` com chance menor |
| Sementes da peneira | Ver 1.1 | Soltar direto mudas/sementes vanilla (`minecraft:oak_sapling`, `wheat_seeds`, `cactus`…) | Alta | Baixo | — |
| Bicho-da-seda / folhas infestadas | Cajado: 1/100 folha, 1/15 folha infestada; 2000 ticks; espalha >60% a cada ~100 ticks; linha = progresso×0,4 (+×0,1) | Item "cajado" + `playerBreakBlock` em folhas. Bicho usado na folha → bloco custom "folha infestada" (uma textura só, sem imitar a espécie) com `onTick` 20 ticks, estado `cl:infest` 0–10 (+1 a cada 10 execuções). Ao chegar em 6, tenta infestar 1 vizinho aleatório a cada 5 execuções. Quebra → linha | Média (precisa de folhas, que só vêm da Estufa) | Baixo–Médio (poucos blocos) | Linha direto de casulos raros na peneira de terra |

---

## 2. Ex Aliquo (Zerokyuuni) — versão no Crash Landing: 0.11.2 [busca: wiki FTB]

Addon do Ex Nihilo que liga o Ex Nihilo aos outros mods do pack. O que o código mostra [ExA]:

- **Minérios extras como pedaços de Ex Nihilo:** 27 tipos, cada um com item em 3 estágios (`Gravel`, `Sand`, `Dust`) e bloco 2x2.
  - Cobalto, Ardite (Tinkers).
  - Os do Metallurgy: Adamantine, Alduorite, Astral Silver, Atlarus, Carmot, Ceruclase, Deep Iron, Eximite, Ignatius, Infuscolium, Kalendrite, Lemurite, Manganese, Meutoite, Midasium, Mithril, Orichalcum, Oureclase, Prometheum, Rubracium, Sanguinite, Shadow Iron, Vulcanite, Vyroxeres, Zinc.
  - Fonte: `Registries.java`. A raridade de cada um **não foi encontrada**.
- **Martelos de metal:** Invar, Cobre, Estanho, Prata, Chumbo, Platina, Níquel, Alumínio e Taumium (se houver Thaumcraft).
  - Receita padrão de martelo: `_ i _ / _ s i / s _ _`.
  - Durabilidade: **não encontrada**, porque o material é mapeado para materiais vanilla.
- **Cajados:** de Cana (*Reed Crook*), de Ouro e de Feno (trigo + grade de ferro).
- **Modificadores do Tinkers:**
  - **Crooked** (ID 60), feito com o cajado de ouro: a ferramenta age como cajado.
  - **Hammered** (ID 61), feito com o martelo de diamante: a ferramenta age como martelo.
- **Peneira:**
  - Pedra pode soltar arbustos de *oreberry* do Tinkers (ferro, ouro, cobre, estanho, alumínio) com raridade **1/256**.
  - Arbusto de essência: **1/128**.
  - Solo do Tinkers solta alguns itens com raridade 1/3 a 1/10.
- **Cadinho:**
  - Minério e pedaços derretem em **metal fundido do Tinkers**. O custo é em `ingotCost`, e o valor em mB **não foi encontrado**.
  - Calcário do Mariculture → gás natural: 2000 de sólido rende 250.
- **Fontes de calor** de outros mods (TConstruct, Thaumcraft, Thermal Expansion, Natura, Ars Magica), mais **compostáveis** e **cores** de vários mods.
- **Diversos:**
  - Olho do End: 2x2 de pérolas.
  - Bolo do End: olhos do End + bolo + maçã dourada encantada.
  - Ovo de dragão (item).
  - Garrafa de água: cactos em volta de uma garrafa → poção de água. **Relevante para um mundo sem água!**
- **No Crash Landing 1.1.0:** o *oreDict* dos cascalhos e areias de minério do Ex Aliquo foi removido, junto com os do Ex Nihilo [busca].

### 2.1 Licença (Ex Aliquo)
- Repositório **Zerokyuuni/Ex-Aliquo**: **MIT**, "Copyright (c) 2014 Zerokyuuni".
- A MIT permite reaproveitar código e, em princípio, os arquivos do repositório (inclui `resources/assets/exaliquo`), **desde que se mantenha o aviso de copyright e a licença** nos créditos.
- **Atenção:** parte das texturas pode derivar das do Ex Nihilo (os pedaços de minério recoloridos), cuja licença não foi encontrada. É mais seguro redesenhar.
- O código é Java/Forge e não roda no Bedrock. Na prática só reaproveitamos **ideias e números**.

### 2.2 Tabela de recriação — Ex Aliquo

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Minérios de outros mods como pedaços | 27 metais × 3 estágios; raridade não encontrada | Não faz sentido copiar o Metallurgy. Se quiser, criar 2–3 metais "alienígenas" do planeta (ex.: "titânio", "cristal de energia") como pedaços raros (1/64–1/128) na peneira de poeira | Média | Baixo (só itens e receitas; o custo é de tamanho do pack) | Usar só metais vanilla (ferro, ouro, cobre) |
| Martelos de metal | Mesmo formato de receita | Mais variantes do item martelo com `minecraft:durability` diferente | Alta | Baixo | Só martelos de pedra/ferro/diamante |
| Cajado de cana/ouro/feno | Ver acima | Variantes do cajado com chance maior de bicho-da-seda ou de muda | Alta | Baixo | — |
| Modificadores do Tinkers (Hammered/Crooked) | ID 60/61 | Bedrock não tem ferramentas modulares. Dá para fazer uma **"melhoria" na Montadora** que gera uma "picareta-martelo" (item novo) | Média | Baixo | Ignorar |
| Arbustos de oreberry na peneira | 1/256 (pedra) | Bloco custom "arbusto mineral" com `onTick` que gera pepitas devagar (estado de crescimento 0–3) | Média | Baixo | Ignorar |
| Cactos → garrafa de água | 3x3 de cacto em volta da garrafa | Receita JSON (uma poção de água como resultado é possível via item de saída `minecraft:potion`); ou item custom "água de cacto" que reduz a sede do add-on | Alta | Baixo | Item custom "seiva de cacto" |
| Calor de outros mods | — | Blocos do add-on (gerador a carvão, aquecedor) entram no mapa de calor do cadinho | Alta | Baixo | — |

---

## 3. Hardcore Questing Mode (HQM, por Vswe/lorddusk) — versão no Crash Landing: 4.0.5 [busca: wiki FTB]

### 3.1 Estrutura do livro
- **Livro de Quests:** receita sem forma = livro + linha [HQM-1.7.10, `ModItems.java`].
  - Configuração `SpawnBook=true`: o livro aparece ao criar o mundo.
  - Configuração `LoseQuestBookOnDeath=true`: o livro some ao morrer.
- **Conjuntos (Quest Sets), que funcionam como capítulos:** cada conjunto é uma página com quests posicionadas livremente.
  - **Dependências:** uma quest exige outras, de qualquer conjunto; as linhas são desenhadas entre elas.
  - Uma quest fica bloqueada até as requisitos estarem completas. Existe também "requisitos opcionais": quantas das requisitos precisam estar feitas. Nesta versão, o nome exato do campo **não foi verificado**.
- **Gatilhos de visibilidade (`TriggerType`):**
  - `NONE`: sempre visível.
  - `QUEST_TRIGGER`: invisível, serve só de gatilho.
  - `TASK_TRIGGER`: aparece depois de N tarefas.
  - `ANTI_TRIGGER`.
- **Repetição (`RepeatType`):**
  - `NONE`.
  - `INSTANT`: repete na hora.
  - `INTERVAL`: reseta a cada X dias/horas do jogo.
  - `TIME`: X dias/horas depois de completar.

### 3.2 Tipos de tarefa [HQM-1.7.10, pasta `quests/`]

| Classe | Tipo | O que exige |
|---|---|---|
| `QuestTaskItemsDetect` | Detectar (*detect*) | Ter os itens no inventário |
| `QuestTaskItemsConsume` | Consumir / entregar (*consume*) | Os itens são tirados do inventário |
| `QuestTaskItemsConsumeQDS` | Entrega via **Quest Delivery System** | Bloco que recebe itens, inclusive de canos e funis |
| `QuestTaskItemsCrafting` | Fabricar (*craft*) | Craftar os itens |
| `QuestTaskLocation` | Localização (*location*) | Chegar a uma coordenada X/Y/Z, num raio, numa dimensão |
| `QuestTaskMob` | Matar (*kill*) | N mobs de um tipo |
| `QuestTaskDeath` | Morrer | Morrer N vezes |
| `QuestTaskReputation` / `ReputationTarget` / `ReputationKill` | Reputação | Atingir um nível de reputação com uma facção, ou matar mobs que mudam reputação |

- **Precisão de itens (`ItemPrecision`):** exata, ignorar dano/NBT, *ore dictionary*.

### 3.3 Recompensas
- **Recompensa fixa:** todos os itens.
- **"Pick one":** o jogador escolhe 1 item da lista.
- **Recompensa de reputação.**
- Em time:
  - Configuração `MultiReward=true`: cada membro pode resgatar.
  - Configuração do time (`RewardSetting`): `ALL`, `ANY` ou `RANDOM`.

### 3.4 Vidas (modo hardcore do HQM)
- **Valores [HQM-1.7.10, `ModConfig.java`]:**
  - **Vidas iniciais = 3**.
  - **Máximo = 20** (limite configurável de 1 a 255).
  - O modo hardcore não liga sozinho: `Auto-start hardcore mode=false`.
  - Com 0 vidas o mundo é apagado (SP) ou o jogador banido (MP). Essa descrição vem do conceito do mod **[busca: modpackindex]**, e o comportamento exato da 4.0.5 **não foi verificado**.
  - Os valores da 1.6.4 não foram encontrados.
- **Itens de coração [HQM-1.7.10, `ItemHeart.java` e `ModItems.java`]:**
  - Valores de dano: 0 = ¼ de coração, 1 = ½, 2 = ¾, 3 = **coração**, 4 = **coração podre**.
  - **4 quartos = 1 coração.** Também: 2 quartos + meio, quarto + ¾, 2 meios, 2 quartos → meio, 3 quartos → ¾ (receitas sem forma).
  - **Coração (clique-direito):** +1 vida se estiver abaixo do máximo, e é consumido. Se estiver no máximo: mensagem "haveMaxLives" e não consome.
  - **Apodrecimento:** configuração `RotTimer=false` por padrão. Se ligada, depois de `RotTime=120` s o coração vira **coração podre**.
  - **Coração podre:** comê-lo **tira 1 vida** e conta como morte do HQM.
  - Os quartos de coração vêm como **recompensa de quest ou de sacola**. Drop de mob: **não encontrado** (não há código de drop).

### 3.5 Sacolas de recompensa (*reward bags*)
- **Níveis das sacolas [HQM-1.7.10, `BagTier.java`]:** **Basic** (cinza), **Good** (verde), **Greater** (azul), **Epic** (laranja), **Legendary** (roxo).
  - Os nomes "common/uncommon/rare/epic/legendary" pedidos não são os do código. "Common/Uncommon/Rare" são nomes dos **grupos** de conteúdo, abaixo.
- **Grupos de conteúdo:** cada grupo pertence a um **nível de grupo** com pesos por tipo de sacola.
- **Pesos padrão** [HQM atual, `GroupTier.java`; os valores do 1.6.4/4.0.5 **não foram verificados**]. Colunas = peso nas sacolas Basic / Good / Greater / Epic / Legendary:

| Nível do grupo | Basic | Good | Greater | Epic | Legendary |
|---|---|---|---|---|---|
| Crap | 50 | 50 | 50 | 5 | 0 |
| Plain | 50 | 50 | 50 | 30 | 10 |
| Common | 20 | 30 | 40 | 30 | 20 |
| Uncommon | 5 | 10 | 15 | 20 | 25 |
| Rare | 3 | 6 | 12 | 18 | 21 |
| Unique | 1 | 2 | 3 | 4 | 30 |

- **Como se obtém:** a sacola é **item de recompensa de quest**, dada pelo autor do pack.
  - Ao abrir, sorteia um grupo pelo peso e entrega todos os itens do grupo.
  - Configuração `RewardInterface=true`: mostra o conteúdo.
  - Grupos podem ter limite de vezes.
  - Receita de sacola: **não existe** no código.

### 3.6 Times [HQM-1.7.10, `Team.java`]
- O dono convida jogadores; nomes de time são únicos; sem limite de membros.
- Ao entrar, o progresso é mesclado; na reputação, fica o valor de maior módulo.
- **Vidas do time:**
  - `SHARE` (padrão): soma das vidas dos membros.
  - `INDIVIDUAL`.
- **Recompensas do time:** `ANY` ou `RANDOM`; `ALL` só se estiver habilitado.

### 3.7 Licença (HQM)
- O repositório lorddusk/HQM está sob **LGPL-3.0** (código).
- A **arte** tem licença à parte (`LICENSE_ART.md`): arte do CyanideX em **LGPL**, arte do falseresync em **MIT**. Isso vale para a arte **atual**; a arte original da 1.6.4 (Vswe) tem licença **não encontrada**.
- **Recomendação:** recriar o sistema em JS próprio (o Diário de Bordo já existe) e fazer ícones próprios. Se usar alguma textura LGPL/MIT, colocar crédito e o texto da licença no pack.

### 3.8 Tabela de recriação — HQM

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Livro com conjuntos (capítulos) | N conjuntos, quests livres | Diário de Bordo: `ActionFormData` com a lista de capítulos → lista de quests (ícone e status ✔/🔒/!) → detalhe (`MessageForm`/`ActionForm` com botões "Entregar" e "Resgatar"). Dados das quests em JSON dentro do script | Alta | Baixo (só abre ao usar o item) | — |
| Árvore de dependências | Quest exige outras (de qualquer capítulo) | Campo `requer: ["id1","id2"]` + `minRequisitos`. Trocar "uma por vez" por "todas as desbloqueadas ao mesmo tempo". Não há como desenhar linhas, então mostrar o texto "Requer: X, Y" | Alta | Baixo | Manter sequência linear por capítulo |
| Detectar / ter item | — | Já existe ("ter item"); checar com `container.getItem` ao abrir o livro ou a cada 40 ticks | Alta | Baixo | — |
| Consumir / entregar | Itens removidos | Botão "Entregar" que remove os itens do inventário via script | Alta | Baixo | — |
| Entrega por bloco (QDS) | Bloco recebe itens/canos | Bloco "Terminal de Entrega" que puxa de funil ou baú adjacente (`onTick` 20) | Alta | Baixo–Médio | Só entrega manual |
| Fabricar (*craft*) | — | **Não há evento de craft na Script API estável.** Opções: tratar como "ter item" ou contar itens produzidos pela Montadora (ação de máquina, que já existe) | Média | Baixo | Converter em "ter item" |
| Localização | Coordenada + raio + dimensão | `system.runInterval` a cada 40 ticks comparando `player.location` com pontos de interesse (destroços da nave, cidade) | Alta | Baixo | — |
| Matar | N mobs | Já existe ("matar família"); `world.afterEvents.entityDie` com `damageSource.damagingEntity` | Alta | Baixo | — |
| Morrer N vezes | — | `entityDie` do jogador + contador em dynamic property | Alta | Baixo | — |
| Consumir comida/poção | — | `world.afterEvents.itemCompleteUse` | Alta | Baixo | — |
| Reputação | Facções com níveis | Dynamic property `rep:<facção>` por jogador; quests dão ou exigem reputação | Média | Baixo | Ignorar |
| Recompensa fixa + "pick one" | Escolha 1 de N | Depois de completar, um `ActionForm` com um botão por item; `player.getComponent("inventory").container.addItem` (ou `spawnItem` se cheio) | Alta | Baixo | — |
| Vidas (hardcore do HQM) | Iniciais 3, máximo 20 | Dynamic property `vidas` no jogador; `entityDie` → −1. Com 0: `player.setGameMode(GameMode.Spectator)` (não dá para apagar mundo ou banir). Mostrar na actionbar | Alta | Baixo | — |
| Corações (¼, ½, ¾, inteiro, podre) | 4 × ¼ = 1; inteiro = +1 vida; podre = −1 vida | Itens custom; receitas sem forma JSON; `world.afterEvents.itemUse` para comer. Podre: `player.kill()` ou −1 vida. Apodrecimento opcional: guardar o tick de criação no item via `ItemStack.setDynamicProperty`/lore e checar no uso | Alta | Baixo | Sem apodrecimento |
| Sacolas por raridade | Níveis Basic…Legendary; pesos da tabela 3.5 | Item custom por nível; ao usar, sorteio ponderado em JS → `ActionForm` mostrando o que saiu → `addItem` | Alta | Baixo | — |
| Repetíveis / gatilhos invisíveis | INSTANT/INTERVAL/TIME | Campo `repete: {tipo, dias}` usando `world.getDay()`; quests ocultas com `visivelSe` | Média | Baixo | Sem repetíveis |
| Times | Vidas compartilhadas; recompensa ALL/ANY/RANDOM | Dynamic property de mundo `time:<nome>` com lista de membros; vidas somadas | Média | Baixo | Só um jogador (foco no celular) |

---

## 4. Crash Landing (Iskandar) — Minecraft 1.6.4, pack de terceiros do FTB

### 4.1 História e início
- **Premissa** (post original do Iskandar, maio/2014) **[busca: giantitp / FTB]**:
  - *"you have crash landed on an unfriendly planet. The atmosphere is breathable...and that is about it. No water, no food, and no resources."*
  - O Iskandar quis trocar a dificuldade "de fome" dos outros packs por **sede**.
- **Planeta "dry and dusty"** **[busca: wiki FTB]**:
  - O jogador começa nos **destroços da nave**.
  - "everything you need to survive is within the confines of the spaceship" **[busca, resumo de 9minecraft]**.
  - O principal desafio é a **sede** (mod **EnviroMine**).
  - **Água "salgada" (*salt water*):** a água posta na superfície ou tirada do caldeirão frio vem salgada e **aumenta a sede**; é preciso fervê-la ou fundi-la na fornalha para limpar. Não há fontes infinitas de água **[busca: chriselison.uk, fórum FTB]**.
  - **Água suja:** terra + garrafa vazia dá água suja; na fornalha vira água limpa. "8 folhas → 1 terra" é usado para isso **[busca, fórum de ajuda]**.
- **Mapa:**
  - O **Beta 1.0.2** tornou o mapa **Hardcore vanilla** e "mudou o ambiente para oceano" **[busca: thread de desenvolvimento, FTB 45698]**.
  - O jogo mais conhecido é num **deserto/poeira**, com **cidades geradas aleatoriamente com loot** **[busca, changelog]**.

### 4.2 Regras de dificuldade e o que o pack mudou
- **Vidas:**
  - O mundo fica em **Hardcore vanilla** (1 vida).
  - Vidas extras vêm do mod **Sync**: "clones" (*shells*) feitos no **Shell Constructor**, movido a esteira (*Treadmill*) ou energia, e guardados no **Shell Storage**.
  - **O HQM é usado só para quests**, porque "o hardcore do HQM não funciona com o sistema de vidas do Sync" (post do Iskandar, 1.1.x) **[busca: wiki FTB e fórum]**.
  - O addon não oficial CRU recolocou vidas do HQM (10 vidas) **[busca]**.
- **Receitas:** "several crafting recipes have been removed or greatly increased in difficulty" (resenha de 2017) **[busca]**.
- **Ex Nihilo / Ex Aliquo** **[busca, changelog 1.1.0]**:
  - Sem *oreDict* nos cascalhos e areias de minério.
  - Receitas no High Oven.
  - Pulverizador "um pouco menos eficiente que o martelo".
  - Ferro na peneira de poeira e cascalho "levemente buffado".
  - Sementes vanilla trocadas pelas do Harvestcraft.
- **Primeiros passos citados por jogadores** **[busca]**:
  - Peneirar poeira na 1ª noite (≈24 pedrinhas) → fornalha de laje + tesoura.
  - Barril de pedra com lava + água em cima → obsidiana.
  - Cadinho com folhas → água.
- **Livro de quests:** guia o jogador pelos mods centrais para montar **energia e água** **[busca]**.
  - O 1.1.0 adicionou quests de PneumaticCraft e de animais passivos.
  - **Nomes e ordem dos capítulos: não encontrados.** O arquivo de quests do pack não está acessível e as páginas que listariam os capítulos não abriram.

### 4.3 Lista de mods e versões (parcial)
Fonte: wiki FTB, via trechos de busca; a página completa não abriu.

| Mod | Versão |
|---|---|
| Applied Energistics | rv14 finale3 |
| BiblioCraft | 1.5.5 |
| Big Reactors | 0.3.4A2 |
| EnviroMine | 1.1.63 |
| Ex Aliquo | 0.11.2 |
| Ex Nihilo | 1.29e |
| Hardcore Questing Mode | 4.0.5 |
| Hunger Overhaul | 2l-build4 |
| JABBA | 1.1.4 |
| MineFactory Reloaded | 2.7.9 |
| Sync | 2.2.3 |
| Thermal Expansion | 3.0.0.7 |
| Tinkers' Construct | 1.5.5.7 |

- Também na lista, **sem versão encontrada**: Tinkers' Mechworks, Tinkers' Steelworks, Autoutils, CoFH Core, PneumaticCraft.
- Uma lista antiga (Aternos, 2015) também cita **EnderIO** e **Extra Utilities**, mas eles não aparecem na lista da wiki **[busca]**.
- **Versões do pack:** 1.1.x "BETA STABLE"; a última é a **1.1.3** (abril/2015, CurseForge) **[busca]**.
- **Remakes:** "Crashed" (CurseForge), "Desolate Planet" (planeta T4L0S, Modrinth/CurseForge; repositório pawjwp/Desolate-Planet) e "Crash-2" (MarkScedra). Todos citam o Iskandar como criador original.

### 4.4 Licença (Crash Landing)
- **Licença do pack, configurações e textos das quests: não encontrada.**
- Os textos e o arquivo de quests são obra do Iskandar. **Não copiar** os textos; usar o conceito (queda, sede, água salgada, clones como vidas) como inspiração e dar crédito ("inspirado em Crash Landing, de Iskandar").

### 4.5 Tabela de recriação — Crash Landing

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Início nos destroços da nave | Estrutura com o essencial | Estrutura `.mcstructure` posta no spawn com `world.structureManager.place` no 1º `playerSpawn` (`initialSpawn`), com baú inicial | Alta | Baixo (uma vez só) | Kit no inventário |
| Sede como desafio central | EnviroMine | Já existe (sede + temperatura) | Alta | — | — |
| Água salgada / suja que precisa ser purificada | Garrafa da superfície = salgada; fornalha limpa | Itens custom "água salgada" e "água suja" (aumentam a sede ou dão náusea) + receita de fornalha → `minecraft:potion` (água). Interceptar o enchimento de garrafa em água vanilla com `itemUseOn` e trocar pelo item salgado | Média (interceptar o enchimento é chato) | Baixo | Nem existe água vanilla no mapa: só o Condensador produz água limpa |
| Terra + garrafa = água suja; 8 folhas → terra | Receitas | Receitas JSON | Alta | Baixo | — |
| Hardcore vanilla + clones (Sync) como vidas | 1 vida + 1 clone por "shell" | Bloco **"Câmara de Clonagem"** que gasta E (ex.: 15 E = 1 bateria cheia) para fabricar 1 clone; guarda o contador em dynamic property. No `entityDie` do jogador: se houver clone, `player.setSpawnPoint` na câmara e −1 clone; senão, espectador. O mundo não pode ficar em hardcore real, então controlar tudo por script | Alta | Baixo | Vidas do estilo HQM (corações) |
| Quests como guia (energia → água → tecnologia) | Capítulos não encontrados | Diário de Bordo com capítulos sugeridos: 1) Sobrevivência (peneira, água suja, compostagem), 2) Energia (painel, moinho, baterias), 3) Água (condensador, cadinho com folhas), 4) Agricultura (estufa), 5) Metais (martelo, pedaços → lingotes), 6) Automação (peneira automática, terminal), 7) Exploração (destroços/cidades) | Alta | Baixo | — |
| Cidades com loot | Geradas aleatoriamente | Estruturas `.mcstructure` posicionadas por script em coordenadas pré-sorteadas no mundo plano (`world.structureManager`), carregando quando o chunk está ativo | Média | Médio (colocar estruturas grandes trava o celular; fazer em pedaços) | Poucas estruturas fixas perto do spawn |
| Receitas mais difíceis | Não detalhadas | Receitas próprias do add-on (não dá para remover receitas vanilla de forma limpa; dá para sobrescrever por identificador quando a receita é do próprio add-on) | Média | Baixo | — |

---

## 5. Pontos incertos (resumo)
1. **Todos os números do Ex Nihilo vêm do código 1.7.10 (fork LegacyModdingMC)**, não da 1.29e (1.6.4). A wiki fandom confirma a maioria (pederneira 25%, farinha de osso 20%, redstone ~13%) mas mostra **22%** em vez de 33% na 6ª pedrinha da terra.
2. Configuração específica do Crash Landing (poeira dando pedrinhas, ferro "buffado", cadinho com folhas): valores **não encontrados**.
3. HQM: valores do branch 1.7.10 (vidas 3/20); os **pesos das sacolas** vêm do código atual. Os valores exatos da 4.0.5 (1.6.4) não foram verificados.
4. **Capítulos do livro do Crash Landing: não encontrados.**
5. **Licenças:** do Ex Nihilo original e do Crash Landing, **não encontradas**. Ex Aliquo é MIT. HQM é LGPL-3.0 (código), e a arte atual é LGPL/MIT.

---

## 6. Fontes

**Código (aberto e lido):**
- https://github.com/LegacyModdingMC/ex-nihilo (README: "Fork of Ex-Nihilo from bitbucket and decompiled 1.38-53"; GPL-3.0)
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/SieveRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/CrucibleRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/HeatRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/CompostRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/HammerRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/OreRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/registries/BarrelRecipeRegistry.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/compatibility/OreList.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/tileentities/TileEntitySieve.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/tileentities/TileEntityCrucible.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/tileentities/TileEntityBarrel.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/tileentities/TileEntityLeavesInfested.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/BlockLeavesInfested.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/blocks/BlockBarrel.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/items/ItemSilkworm.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/items/hammers/ItemHammer.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/items/hammers/HammerType.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/utils/CrookUtils.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/data/ModData.java
- https://raw.githubusercontent.com/LegacyModdingMC/ex-nihilo/master/src/main/java/exnihilo/Recipes.java
- https://github.com/Zerokyuuni/Ex-Aliquo (MIT) — `exaliquo/Registries.java`, `exaliquo/bridges/TConstruct/Sieving.java`, `exaliquo/bridges/TConstruct/TConstruct.java`, `exaliquo/bridges/*/Smelting.java`, `LICENSE`
- https://github.com/lorddusk/HQM (LGPL-3.0; branch 1.7.10) — `src/main/java/hardcorequesting/config/ModConfig.java`, `items/ItemHeart.java`, `items/ModItems.java`, `bag/BagTier.java`, `bag/GroupTier.java`, `quests/*` (lista de classes), `quests/TriggerType.java`, `quests/RepeatType.java`, `Team.java`; `LICENSE_ART.md`; pesos padrão em `common/src/main/java/hardcorequesting/common/bag/GroupTier.java` (branch atual)
- https://github.com/PrograMistV1/ExNihilo_Bedrock (referência Bedrock; CC BY-NC-SA 4.0)
- https://github.com/pawjwp/Desolate-Planet e https://github.com/MarkScedra/Crash-2 (remakes que citam o Iskandar)

**Páginas vistas só pelos trechos de busca (não abriram direto):**
- https://ftb.fandom.com/wiki/Crash_Landing (lista de mods e versões; hardcore vanilla + Sync)
- https://ftb.fandom.com/wiki/Sync
- https://forum.feed-the-beast.com/threads/1-6-4-crash-landing-hardcore-hqm-version-1-1-x-beta-stable.46277/ (changelogs 1.0.8–1.1.0; HQM hardcore × Sync)
- https://forum.feed-the-beast.com/threads/building-a-new-hqm-map-crash-landings.45698/ (alfas/betas; Beta 1.0.2 = hardcore vanilla + oceano)
- https://forum.feed-the-beast.com/threads/crash-landing-help-venting-and-discussion.50255/ (dicas: peneirar poeira, água suja, cadinho com folhas)
- https://forum.feed-the-beast.com/threads/cru-an-unofficial-addon-pack-for-crashlanding-1-6-4.163706/
- https://www.giantitp.com/forums/archive/index.php/t-353697.html (premissa original do Iskandar)
- https://www.curseforge.com/minecraft/modpacks/crash-landing (versão 1.1.3, abril/2015)
- https://www.9minecraft.net/crash-landing-modpack/
- https://chriselison.uk/minecraft/2017/11/my-favourite-minecraft-modpacks/ (água salgada, receitas mais difíceis)
- https://board.aternos.org/thread/4879-modpack-request-ftb-crash-landed/ (lista antiga de mods)
- https://www.modpackindex.com/modpack/20156/crash-landing
- https://ex-nihilo-minecraft.fandom.com/wiki/Sieved_Items (chances da peneira, para comparação)
- https://www.modpackindex.com/mod/9379/hardcore-questing-mode (conceito de vidas do HQM)

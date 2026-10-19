# Pesquisa D: Thermal Expansion 3, MineFactory Reloaded e Big Reactors (Crash Landing 1.6.4) para o "Pouso Forçado"

> Escopo: mecânicas dos três mods na versão usada pelo Crash Landing, para recriá-las num add-on Bedrock (Script API `@minecraft/server` 2.x, ciclo de 100 ticks = 5 s).
>
> **Versões usadas no Crash Landing (FTB wiki, página do pack):** Thermal Expansion **3.0.0.7**, MineFactory Reloaded **2.7.9** (último build para 1.6.4) e Big Reactors **0.3.4A2**.
>
> **Como cada número foi obtido:**
> - **[código]:** lido direto do código-fonte oficial na versão exata do pack. Big Reactors vem do branch `release-0.3` (o Changelog diz "Current Release 0.3.4A2"). MFR vem do commit `d201d1f9` do repositório do skyboy ("Promote to 2.7.9", arquivo VERSION = `1.6.4R2.7.9`).
> - **[wiki]:** FTB wiki, CoFH docs antigas ou fóruns, citados nas fontes no fim do arquivo.
> - **[inferido]:** dedução minha. Confira antes de tratar como fato.
>
> O código do Thermal Expansion 3 (1.6.4) **nunca foi publicado**. A CoFH só abriu o código das versões posteriores. Por isso todos os números de TE3 vêm de wiki e fórum. Eu não consegui abrir as páginas das wikis direto (o acesso estava bloqueado), então os números de TE3 vieram de trechos de busca. Por isso a seção "Pontos incertos" no fim é importante.

---

## 0. Conversão de escala RF → E (proposta)

O projeto já tem números que batem quase exatamente com o **Steam Dynamo** do TE3. Por isso uso o dínamo como âncora:

| Grandeza | TE3 original | Pouso Forçado atual | Conclusão |
|---|---|---|---|
| Geração do gerador "básico" | Steam Dynamo: **80 RF/t** máx. [wiki] → 80 × 100 ticks = **8.000 RF por ciclo de 5 s** | Gerador a carvão: **2 E/ciclo** | 8.000 RF = 2 E → **1 E = 4.000 RF** |
| Valor do carvão | Steam Dynamo TE3: **32.000 RF/carvão** (24.000 o carvão vegetal) [wiki] | 1 carvão = 4 ciclos × 2 E = **8 E** | 32.000 / 4.000 = **8 E** ✔ (bate exato) |
| Consumo da máquina "padrão" | Pulverizer **40 RF/t** [wiki] → 4.000 RF por ciclo | Máquinas gastam **1 E/ciclo** | 4.000 RF = 1 E ✔ (bate exato) |

**Regra proposta: 1 E = 4.000 RF, 1 ciclo = 100 ticks.** Portanto **X RF/t = X/40 E por ciclo**.

Os custos por operação de TE e MFR viram frações de E. Por isso sugiro guardar a energia internamente numa **subunidade inteira: 1 E = 100 cE (centi-E), 1 cE = 40 RF**. Dynamic properties guardam `number`, então isso é trivial. A UI continua mostrando "E" com uma casa decimal.

| Valor original | Em E | Em cE |
|---|---|---|
| 40 RF (1 tick de pulverizer) | 0,01 E | 1 cE |
| 160 RF (MFR Planter, por bloco) | 0,04 E | 4 cE |
| 800 RF (Induction Smelter, 2 pós → 2 lingotes) | 0,2 E | 20 cE |
| 1.600 RF (Redstone Furnace, por item) | 0,4 E | 40 cE |
| 3.200 RF (MFR Grinder, por golpe) | 0,8 E | 80 cE |
| 4.000 RF (Pulverizer, por minério) | 1 E | 100 cE |
| 400.000 RF (Leadstone Energy Cell) | 100 E | 10.000 cE |

Efeito colateral: o painel solar do projeto (1 E/ciclo) equivale a 40 RF/t, metade de um dínamo. Isso é generoso para um painel, mas é decisão de design do projeto e não muda as proporções entre as máquinas.

---

## 1. Thermal Expansion 3 (3.0.0.7, MC 1.6.4), da Team CoFH

### 1.1 Licença
- **Código do TE3 (1.6.4):** fechado, nunca publicado. As versões posteriores no GitHub (CoFH/ThermalExpansion) usam a **CoFH "Don't Be a Jerk" License v2**, que na prática é "All Rights Reserved" com permissões. Ela permite copiar trechos para outros projetos, mas proíbe redistribuir o mod inteiro ou código com ≥50% de "Functionally Equivalent Statements", e exige manter o código derivado visível. **Recriar as mecânicas do zero em JS (sem copiar código) não é afetado.**
- **Texturas e arte:** "All Rights Reserved". O README diz que, para reaproveitar a arte de GUI, é preciso pedir no Discord da CoFH. **Não reaproveitar texturas.** Faça arte própria e cite "inspirado em Thermal Expansion (Team CoFH)" nos créditos.

### 1.2 Máquinas que existiam no TE3 / 1.6.4
- **Existiam (wiki da Resonant Rise, pack 1.6.4):** Redstone Furnace, Pulverizer, Sawmill, Induction Smelter, Magma Crucible, Fluid Transposer, Glacial Precipitator, Igneous Extruder. Também havia o Energetic Infuser [inferido] e o Aqueous Accumulator. Para o Accumulator só achei página de TE4, então a existência dele no TE3 não foi confirmada.
- **Não existiam no TE3:** Phytogenic Insolator e Compactor. A FTB wiki só tem páginas "(Thermal Expansion 4)" e "(Thermal Expansion 5)" do Insolator, e o Compactor é do TE5 [inferido pela ausência de página TE3].
- **Dínamos:** os cinco existiam no TE3: Steam, Magmatic, Compression, Reactant e Enervation. Todos tinham **teto de 80 RF/t** [wiki].
- **Transporte:** conduítes de energia (Leadstone, Hardened, Redstone) e de fluido. **Conduíte de itens no TE3: não encontrado.** Os "itemducts" são do Thermal Dynamics (1.7.10+). No 1.6.4 se usavam pipes de BuildCraft, Ender IO etc. [inferido]

### 1.3 Números por máquina

| Máquina | RF/t máx. | RF por operação | Receita (TE3) | Observações |
|---|---|---|---|---|
| **Machine Frame** | – | – | 4 lingotes de ferro + 4 vidros + 1 lingote de ouro [wiki TE3] | O TE4+ trocou o ouro por engrenagem de estanho |
| **Pulverizer** | 40 | 800–4.000 conforme a entrada; **minério = 4.000** [wiki, guia de fórum]. Buffer 48.000 RF | Frame + Redstone Reception Coil + 2 sílex + 2 engrenagens de cobre + pistão [wiki] | Minério → **2 pós** + chance de secundário (ver 1.4) |
| **Redstone Furnace** | 20 | **≈1.600 RF/item** (benchmark de fórum com TE 3.0.0.7) | não encontrado (provavelmente Frame + Coil + tijolo/cobre) | Funde como a fornalha |
| **Induction Smelter** | 40 | **800 RF** para 2 pós → 2 lingotes; **3.200 RF** para minério cru + areia → 2 lingotes [wiki Getting Started TE3] | Balde + 2 lingotes de invar + Frame + Coil + 2 engrenagens de cobre [wiki TE3] | Fluxos: areia, areia de almas, cinábrio (minério + cinábrio = 3 lingotes), pó de pirotheum, rich slag |
| **Sawmill** | não encontrado (TE4: 20) | não encontrado | Frame + Coil + engrenagens de cobre + tábuas + machado de ferro [wiki] | Tora → ~6 tábuas + serragem (valor TE4, [inferido]) |
| **Magma Crucible** | 400? (doc CoFH antiga, versão incerta) | Pedregulho → 1.000 mB de lava = **320.000 RF** (doc CoFH antiga) | não encontrado | Funde sólido em líquido (lava, redstone → Destabilized Redstone etc.) |
| **Fluid Transposer** | 40 [doc CoFH] | depende da receita | não encontrado | Enche ou esvazia itens com fluido (ex.: fazer Liquid Resonant Ender para o Tesseract) |
| **Igneous Extruder** | – | TE3: não encontrado (TE5: pedregulho 400 RF) | não encontrado | Lava + água adjacentes → pedregulho, pedra ou obsidiana |
| **Glacial Precipitator** | – | não encontrado | não encontrado | Água + RF → neve ou gelo |
| **Tesseract** | sem limite próprio no TE3; o gargalo é o conduíte (10.000 RF/t por lado) [wiki, fórum] | – | Receita em várias etapas: Transposer + Liquid Resonant Ender; tem variantes de energia, item e fluido [wiki] | Liga dois pontos que compartilham uma "frequência"; exige chunks carregados |

### 1.4 Saídas do Pulverizer (minério)
Os valores variam entre fontes e versões. O mais consistente: **minério → 2 pós; secundário ~10%**. Ferro → níquel 10% (FTB wiki; a doc CoFH diz "ferrous" 10%). Cobre → ouro. Estanho → ferro. Níquel ("ferrous") → platina ("shiny"). Minério de redstone → **cinábrio 25%** [wiki "Cinnabar (TE3)"]. As chances exatas de estanho, prata e chumbo no TE3 não foram encontradas.

### 1.5 Dínamos (todos com teto de 80 RF/t)

| Dínamo | Combustível → RF | Notas |
|---|---|---|
| **Steam** | Carvão **32.000 RF**, carvão vegetal **24.000 RF** (wikis "TE 3.0.0"; o TE4 usa 48.000 e 32.000) | Consome 40 mB/t de vapor. Rende 80 RF/t com buffer acima de 50% e cai até 4 RF/t quando a energia não é consumida. **Precisa de água** |
| **Magmatic** | Lava **180.000 RF/balde**, Blazing Pyrotheum 2.000.000 RF/balde (doc CoFH antiga) | **Desativado no Crash Landing** (relato de fórum: "all means of lava generation is disabled", "no nether") |
| **Compression** | Por balde: óleo 150.000, combustível 1.500.000, biocombustível/etanol 500.000, carvão liquefeito 1.000.000 | Precisa de **combustível líquido + refrigerante** (água) |
| **Reactant** | Fluido + sólido (redstone/glowstone). Tabela antiga: Energized Glowstone 750.000, Destabilized Redstone 600.000, esgoto/lama 12.000 | Valores de versão incerta |
| **Enervation** | Redstone **64.000 RF**, bloco de redstone 640.000 RF | Sem fluido. Também drena itens com RF |

### 1.6 Energy Cells e conduítes (TE3)

| Tier | Capacidade | Entrada/saída | Em E (1 E = 4.000 RF) |
|---|---|---|---|
| Leadstone Cell | 400.000 RF | 80 RF/t (FTB wiki; ftbwiki.org diz 200) | 100 E, 2 E/ciclo |
| Hardened Cell | 2.000.000 RF | 400 RF/t (ftbwiki.org diz 800) | 500 E, 10 E/ciclo |
| Redstone Cell | 10.000.000 RF | 1.000 RF/t no infobox da FTB wiki (**incerto**) | 2.500 E, 25 E/ciclo |
| Resonant Cell | 50.000.000 RF | 10.000 RF/t | 12.500 E, 250 E/ciclo |
| Leadstone Energy Conduit | – | 80 RF/t | 2 E/ciclo |
| Hardened Energy Conduit | – | 400 RF/t | 10 E/ciclo |
| Redstone Energy Conduit | – | 10.000 RF/t (sem perda por distância; perda única de ~5% na entrada, segundo a wiki) | 250 E/ciclo |

### 1.7 O que o Crash Landing mudou no TE
- Receitas do Pulverizer para **minério em cascalho e areia** (do sistema de peneira): agora dão "ore sand"/"ore dust" + fragmentos, "como o martelo, porém um pouco menos eficiente" (changelog 1.1.0 no fórum FTB).
- Magmatic Dynamo e geração de lava desativados. O planeta não tem Nether (relatos de fórum, de segunda mão).
- A **progressão de redstone depende de peneirar poeira**. Um jogador sugere "três pulverizers em cadeia".
- Machine frames e peças "salvage-only": isso foi confirmado só para peças de Big Reactors, Smeltery, High Oven e Deep Tank. Para o TE não encontrei confirmação.

### 1.8 Tabela de viabilidade: Thermal Expansion 3

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Machine Frame | 4 ferro + 4 vidro + 1 ouro | Item/bloco custom com receita shaped em JSON | Alta | Baixo | – |
| Pulverizer | 40 RF/t; minério = 4.000 RF; 2 pós + ~10% secundário | Bloco com `onTick` a cada 100 ticks. Lê o baú/funil de cima, gasta **1 E** e põe 2 pós (+ `Math.random()<0.1` secundário) no baú de baixo. 1 minério por ciclo bate exato com 40 RF/t | Alta | Baixo | – |
| Redstone Furnace | 20 RF/t; ~1.600 RF/item | Igual ao Pulverizer: **40 cE por item**, até 1 item/ciclo (20 RF/t × 100 = 2.000 RF ≈ 1,25 item) | Alta | Baixo | Usar a fornalha vanilla + funil |
| Induction Smelter | 40 RF/t; pó+pó 800 RF; minério+areia 3.200 RF; cinábrio → 3 lingotes | Duas entradas: baú em cima (minério/pó) + baú de lado ou o mesmo baú com areia. Receitas em tabela JS. 20 cE (pó) ou 80 cE (minério) | Alta | Baixo | Entrada única: "pó + areia no mesmo baú" |
| Sawmill | Tora → tábuas + serragem | Igual ao Pulverizer, ~0,5 E por tora [inferido] | Alta | Baixo | – |
| Magma Crucible | Pedregulho → 1.000 mB lava (320.000 RF) | Sem sistema de fluidos: gerar **balde de lava** (exige balde vazio no baú de entrada). Custo sugerido: 80 E por balde | Média | Baixo | Desativar, como o Crash Landing fez com a lava |
| Fluid Transposer | 40 RF/t | Sem fluidos: só receitas "item + balde → item" (ex.: balde de água + X → Y) | Baixa | Baixo | Receitas de crafting com balde |
| Igneous Extruder | Lava + água adjacentes → pedregulho | Checa blocos vizinhos (`block.north()` etc.) e gera 1 pedregulho por ciclo no baú | Alta | Baixo | – |
| Glacial Precipitator | Água + RF → neve/gelo | Bloco adjacente a água gera bola de neve/gelo por ciclo, 0,5 E [inferido] | Alta | Baixo | – |
| Steam Dynamo | 80 RF/t; carvão 32.000 RF; precisa de água | Já é o "gerador a carvão" (2 E/ciclo, carvão = 8 E). Opcional: exigir água adjacente, um balde no baú ou a "Aqueous Accumulator" | Alta | Baixo | Manter sem água |
| Magmatic Dynamo | Lava 180.000 RF/balde | Balde de lava → **45 E** (12 ciclos de 2 E + resto) e devolve balde vazio | Alta | Baixo | Desativar (fiel ao Crash Landing) |
| Compression Dynamo | Combustível 1,5M RF/balde + refrigerante | Só se existirem "baldes" de combustível como itens custom. Balde = 375 E | Média | Baixo | Omitir |
| Reactant Dynamo | Fluido + sólido | Omitir ou usar "redstone + balde de água" | Baixa | Baixo | Omitir |
| Enervation Dynamo | Redstone 64.000 RF; bloco 640.000 RF | Item de redstone no baú → **16 E** (bloco → 160 E), a 2 E/ciclo | Alta | Baixo | – |
| Energy Cells (4 tiers) | 400k/2M/10M/50M RF; 80/400/1.000?/10.000 RF/t | Bloco "célula" com dynamic property `energia` e limite de entrada/saída por ciclo: **100/500/2.500/12.500 E e 2/10/25/250 E por ciclo**. O tier vai num estado de bloco (4 valores). Ao quebrar, copiar a energia para o item exige item com lore/dynamic property. **Item stack com dynamic property está disponível na API estável** [inferido: confirmar na versão alvo] | Alta | Baixo | Perder a energia ao quebrar |
| Conduítes com limite por tier | 80/400/10.000 RF/t | A busca em largura atual (64 condutores) pode virar "rede" com taxa = **menor tier no caminho** (2/10/250 E/ciclo). Cachear a rede e só recalcular ao colocar ou quebrar cabo (eventos `playerPlaceBlock`/`playerBreakBlock`) | Média | Médio (BFS em ciclo de 5 s é aceitável se cacheado) | Um único tier de cabo sem limite |
| Tesseract | Transferência sem fio por frequência | Bloco com "frequência" num estado ou dynamic property. Um mapa global em `world.getDynamicProperty` liga emissor e receptor. **Os dois chunks precisam estar carregados** (igual ao original) | Média | Baixo | Só energia (sem itens) |
| Conduítes de item | Não encontrado no TE3 | Usar funil vanilla | – | – | Funil |

---

## 2. MineFactory Reloaded 2.7.9 (MC 1.6.4), de PowerCrystals e skyboy

### 2.1 Licença
- O repositório GitHub (skyboy/MineFactoryReloaded e powercrystals/MineFactoryReloaded) **não tem arquivo de licença**. Por padrão isso é "todos os direitos reservados".
- Os termos históricos do PowerCrystals (citados no fórum FTB): "free for non-commercial use". Modpacks podem incluir o mod sem pedir, com crédito. O código pode ser lido, mas não pode ser apresentado como seu. **Recriar as mecânicas em JS próprio é seguro. Não copiar texturas**, que estão no repositório mas sem licença explícita. Crédito sugerido: "inspirado em MineFactory Reloaded (PowerCrystals, skyboy)".

### 2.2 Modelo de energia (código)
- Unidade interna = RF (`energyPerMJ = 10`, `energyPerEU = 4`).
- Cada máquina tem uma **"activation energy"**: o RF gasto por ação bem-sucedida. A cada tick, se `energia ≥ activation` e `idleTicks == 0`, ela chama `activateMachine()`. Se a ação der certo, desconta a energia. Se não houver nada a fazer, entra em espera (`idleTicks`).
- A entrada máxima por tick é `activation × 4`. Redstone ligado **pausa** a máquina.

| Máquina | RF por ação | Buffer RF | Espera quando ocioso (ticks) | Área (código) | Em cE (1 cE = 40 RF) |
|---|---|---|---|---|---|
| Planter | 160 | 8.000 | 5 | raio 1 = **3×3** | 4 cE/bloco plantado |
| Harvester | 240 | 16.000 | 5 | raio 1 = 3×3 (+ árvores) | 6 cE/bloco. Gera **10 mB de lama ("sludge")** por colheita |
| Fertilizer | 960 | 32.000 | 20 | raio 1 = 3×3 | 24 cE por uso de fertilizante |
| Rancher | 320 | 32.000 | 200 | raio 2 (5×5), +2 acima, 1 abaixo | 8 cE/ação (leite, lã) |
| Grinder (Mob Grinder) | **3.200** | 32.000 | 200 (nada); 20 após matar; 10 após golpe | raio 2 (5×5), +2/−1 | 80 cE/golpe |
| Breeder | 640 | 16.000 | 200 | raio 2 | 16 cE |
| Vet | 320 | 32.000 | 200 | raio 2 | 8 cE |
| Fisher | 20 | 16.000 | 200 (trabalho 900) | raio 1 | 1 cE por tick de trabalho |
| Composter | 20 por trabalho | 16.000 | 1 | – | **2.000 mB de esgoto + 100 trabalhos (2.000 RF = 50 cE) → 1 fertilizante** |
| Sewer | **0** (sem energia) | – | a cada 31 ticks | raio 0, 1 acima (o bloco fica sob os animais) | Coleta **25 mB de esgoto × massa do animal** (aresta²) e **orbes de XP → essência (1 XP = 66,67 mB)** |
| Block Breaker | 960 | 64.000 | – | 1 bloco à frente | 24 cE |
| Auto Spawner | 600 | 32.000 | – | – | (precisa de essência; fora do escopo) |

**Grinder (código):** dano 500.000 (mata na hora praticamente qualquer mob), com `recentlyHit = 100`, então dropa loot como se um jogador tivesse matado. Ignora filhotes e mobs invulneráveis. **Cada morte enche 100 mB de "mob essence"** no tanque de 4.000 mB. Mobs com regras especiais (registry "grindables") têm drops próprios.

**Upgrades de alcance (código):** o item "upgrade" aumenta o raio em **+1 (lápis), +2 (ferro), +3 (estanho), +4 (cobre), +5 (bronze), +6 (prata), +7 (ouro), +8 (quartzo), +9 (diamante), +10 (platina), +11 (esmeralda)**. O de pedregulho dá −1. Receita: 3 do material + 3 plástico + redstone, pepita de ouro, redstone. Exemplo do de lápis: `III / PPP / RGR`, com I = lápis, P = raw plastic, R = redstone, G = pepita de ouro.

### 2.3 Receitas (código, receitas "Vanilla" do MFR)
- **Machine Block:** 3 folhas de plástico + 3 pedras → 3 blocos (`PPP / SSS`).
- **Cadeia do plástico:** seiva da seringueira → raw rubber → (fornalha) rubber bar → (fornalha) **raw plastic** → 4 raw plastic = 4 folhas de plástico.
- **Planter:** `GGG / CPC / _M_`, com G = plástico, C = vaso de flor, P = pistão, M = machine block.
- **Harvester:** `GGG / SXS / _M_`, com X = machado de ouro e S = tesoura.
- **Rancher:** `GGG / SBS / _M_`, com B = balde e S = tesoura.
- **Fertilizer:** `GGG / LBL / _M_`, com L = couro e B = frasco de vidro.
- **Grinder:** `GGG / BSP / _M_`, com B = livro, S = espada de ouro e P = pistão.
- **Sewer (rende 4):** `GGG / BUB / BMB`, com B = tijolo e U = balde.
- **Composter:** `GGG / PFP / _M_`, com P = pistão e F = fornalha.
- **Fertilizante (rende 16):** `WBW / STS / WBW`, com W = trigo, B = farinha de osso, S = linha e T = graveto.
- **Conveyor Belt (rende 16):** `UUU / RIR`, com U = borracha, R = redstone e I = ferro. Não usa energia. Redstone desliga. A esteira tem 16 cores.

### 2.4 O que o Crash Landing mudou no MFR
- Não encontrado nenhum changelog específico do MFR. O pack usa a versão 2.7.9 [FTB wiki]. No contexto do planeta sem água, a seringueira e a cadeia do plástico dependem de mudas e água obtidas no início do jogo [inferido].

### 2.5 Tabela de viabilidade: MineFactory Reloaded

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Planter | 160 RF/bloco; 3×3 à frente/acima; mudas e sementes do baú | `onTick` 100: lê o baú adjacente e varre a área 3×3 (9 blocos, `dimension.getBlock`). Planta em terra arada ou grama com `setType`/`setPermutation`. 4 cE por planta, no máximo 9 por ciclo | Alta | Baixo | – |
| Harvester | 240 RF/bloco; 3×3; colhe plantas maduras e árvores; 10 mB de lama | Varre 3×3, checa o estado `growth`/`age` (ex.: `minecraft:wheat` growth = 7) e chama `dimension.spawnItem` com os drops (tabela JS própria). **Árvore inteira:** BFS de troncos e folhas com limite (ex.: 64 blocos) só quando a muda virou tronco. Sem lama: opcional "item lama" a cada N colheitas | Alta (plantas) / Média (árvores) | Baixo / Médio (BFS da árvore) | Árvores: cortar só o tronco vertical |
| Fertilizer | 960 RF; consome 1 fertilizante; 3×3 | Usa farinha de osso ou fertilizante custom: escolhe 1 planta aleatória da área e avança o estado `growth` +1 ou +2 (ou `/fill` não; usar `setPermutation`). 24 cE | Alta | Baixo | Usar farinha de osso vanilla |
| Rancher | 320 RF; ordenha vacas (balde) e tosa ovelhas; raio 2 | `dimension.getEntities({location, maxDistance, families:["cow"]})` → precisa de balde vazio no baú e põe balde de leite. Ovelha: componente `minecraft:is_sheared`. Disparar o evento de tosa com `entity.triggerEvent("minecraft:on_sheared")`, se disponível, e spawnar lã [inferido: confirmar o evento da ovelha vanilla] | Média | Baixo | Só leite |
| Grinder (Mob Grinder) | 3.200 RF/golpe; mata praticamente na hora; drops como morte por jogador; 100 mB de essência por morte | `getEntities` na área 5×5×(+2/−1), exclui `player`, filhotes (`minecraft:is_baby`) e nomeados. `entity.applyDamage(9999, {cause:"entityAttack"})`: o loot vanilla dropa, mas **sem bônus "morto por jogador"** (XP vanilla só cai com jogador; ver próxima linha). 80 cE por morte, no máximo 1 a 3 mortes por ciclo | Alta | Médio (`getEntities` com raio pequeno é barato; limitar quantos por ciclo) | – |
| Essência de mob (XP líquida) | 100 mB por morte; 1 XP = 66,67 mB (Sewer) | Sem fluido: contador `essencia` em dynamic property do bloco. A cada 1.000 mB, entrega **1 garrafa de XP** no baú de baixo, ou spawna orbe com `dimension.spawnEntity("minecraft:xp_orb")` | Alta | Baixo | Spawnar orbes de XP direto |
| Sewer | 25 mB × massa do animal a cada 31 ticks; puxa orbes de XP; sem energia | A cada ciclo: `getEntities` (família `animal`) na área acima → contador `esgoto`. Orbes de XP próximos viram essência (remover a orbe com `entity.remove()`) | Alta | Baixo | – |
| Composter | 2.000 mB de esgoto + 2.000 RF → 1 fertilizante | Bloco ao lado do Sewer, que "puxa" o contador de esgoto (ou o Sewer deposita um item "balde de esgoto"). A cada 2.000 mB e 50 cE → 1 fertilizante no baú | Alta | Baixo | Fundir Sewer+Composter num bloco só |
| Upgrades de alcance | +1…+11 de raio (lápis→esmeralda) | Item na mão + interação: grava o `nível` num estado de bloco (0–11 cabe em 16 valores) e devolve o upgrade anterior. Área = (2r+1)². **Limitar a ~raio 5 (11×11)** no celular | Alta | Médio–Alto em raio grande (varredura de 121+ blocos a cada ciclo) | Varrer em "fatias": N blocos por ciclo com cursor salvo em dynamic property |
| Conveyor Belt | Move itens e entidades; sem energia; 16 cores | Bloco custom com direção (estado `cardinal_direction`). Movimento de **itens soltos**: num `system.runInterval` de 2 a 4 ticks, `getEntities({type:"minecraft:item"})` perto das esteiras e `applyImpulse`/`teleport`. **Isso precisa de intervalo curto (o onTick de bloco ≥ 20)** | Baixa–Média | **Alto** (polling frequente de entidades) | Esteira "lógica": bloco que transfere itens de baú em baú (como funil) a cada ciclo |
| Machine Block + plástico | Plástico via borracha da seringueira | Itens custom e receitas de fornalha (`minecraft:recipe_furnace`). A seringueira pode ser trocada por "resina" de outra fonte | Alta | Baixo | Plástico de outra matéria-prima do planeta |
| Fertilizante MFR | 16 por 4 trigo + 2 farinha de osso + 2 linhas + 1 graveto | Item custom: usar em planta = farinha de osso vanilla (o item pode chamar a mesma lógica de growth) | Alta | Baixo | – |

---

## 3. Big Reactors 0.3.4A2 (MC 1.6.4), de ErogenousBeef

### 3.1 Licença
- **Código: MIT** (`LICENSE.txt` e README: "If you want to use, copy or fork my code, go for it, have fun!"). Pode portar algoritmos e constantes diretamente, mantendo o aviso de copyright MIT ("Copyright (c) 2013 Erogenous Beef").
- **Texturas:** estão no mesmo repositório (`assets/.../textures`), que tem licença MIT. Em tese podem ser reaproveitadas **com crédito**. Para garantir, confirme que nenhuma textura é de terceiros e cite "texturas: Big Reactors, ErogenousBeef, MIT".

### 3.2 Multibloco do reator (código)
- **Tamanho:** mínimo **3×3×3** (cubo oco: 26 blocos de borda + 1 coluna interna). Máximo **32×32 (X/Z) × 48 (Y)** (configs `maxReactorSize` e `maxReactorHeight`).
- **Obrigatórios:** ≥1 **Controller**, ≥1 **Control Rod** e as **Fuel Rods** em colunas abaixo de cada control rod. O control rod fica na face de cima e a coluna de fuel rods vai até o fundo. O resto da borda é Casing ou Glass.
- **Partes opcionais:** Access Port (entrada de combustível e saída de cianita), Power Tap (saída de RF), Coolant Port (água entra, vapor sai: modo **ativo**), Redstone Port, RedNet Port e Computer Port.
- **Interior:** ar, água ou blocos "moderadores". Valores do código (absorção, eficiência de calor, moderação, condutividade): **grafite 0,10 / 0,50 / 2,00** (o melhor moderador), água 0,33 / 0,50 / 1,33, ar 0,10 / 0,25 / 1,10, diamante 0,55 / 0,85 / 1,50, ouro 0,52 / 0,80 / 1,45, ferro 0,50 / 0,75 / 1,40, gelo 0,33 / 0,33 / 1,15, vidro 0,20 / 0,25 / 1,10.
- **Combustível:** 1 lingote = 1.000 mB. **Cada fuel rod guarda 4 lingotes** (4.000 mB). Bloco de yellorium = 9.000 mB. Blutonium também é combustível.
- **Queima:** a radiação de cada fuel rod é `0,01 × mB de combustível`, elevada à reatividade. É multiplicada por **(100 − inserção%) / 100** (as barras de controle funcionam de forma linear, de 0 a 100%). Gera 10 RF de calor por "evento de fissão" e gasta 0,0007 de combustível por evento (`fuelUsageMultiplier`). **Cada mB de yellorium queimado vira 1 mB de cianita** (lixo).
- **Calor e energia:** o calor do combustível passa para o calor do reator. Em modo **passivo** (com Power Tap), 20% do calor disponível vira transferência por tick, com **eficiência de 50%** de RF ("cerca de 1/3 de um reator básico refrigerado a água", comentário do código). Em modo **ativo**, o calor vaporiza o refrigerante: água → vapor, 100 mB de tanque por bloco de casing, até 50 baldes.
- **Buffer interno:** 10.000.000 RF.
- **Temperatura alta:** **não há derretimento ou explosão na 0.3** (o código tem `// TODO: Overload/overheat`). Calor alto só **piora a eficiência** do combustível.
- **RF/t típico:** 3×3×3 passivo ≈ **270 RF/t** (guia comunitário). Reatores médios de 7×7 a 11×11 com 5 barras ≈ **7.200 a 9.200 RF/t** (testes de fórum). Os tamanhos máximos passivos chegariam a ~2M RF/t (afirmação de guia, duvidosa para a 0.3).

### 3.3 Turbina (existia na 0.3, introduzida na 0.3.0)
- Tamanho mínimo **5×5×4**, máximo **16×16×32**. Partes: Housing, Controller, Rotor Bearing, Rotor Shaft, Rotor Blade, Fluid Port, Power Tap e Glass. Bobinas de metal em volta do rotor: ferro 1,0; ouro 2,0; cobre 1,2; aço 1,5 etc.
- Vapor: **10 RF por mB** de densidade. Fluxo máximo de 2.000 mB/t. Tanque de 4.000 mB. Buffer de 1M RF. Velocidade (RPM) com arrasto quadrático. Tem "embreagem" (clutch) na 0.3.4.

### 3.4 Minério, materiais e receitas (código)
- **Yellorite Ore (geração padrão):** 2 a 5 aglomerados por chunk, até 10 blocos cada, entre **Y 4 e Y 50**, substituindo pedra. Há também um bônus de 1 a 2 aglomerados entre Y 11 e Y 13. Não aparece no Nether nem no End.
- **Fornalha:** yellorite → lingote (registrado como `ingotUranium` por padrão). Carvão e carvão vegetal → **grafite**. Pó de yellorium → lingote.
- **Cianita:** sai do reator (1:1 com o combustível). Também tem receita shapeless: **yellorium + areia → cianita**.
- **Cyanite Reprocessor:** **2 cianitas + 1.000 mB de água + 2.000 RF, 200 ticks → 1 blutonium**. Buffer de 10.000 RF.
- **Receitas** (I = ferro, C = grafite, U = yellorium, K = casing):
  - Fuel Rod: `ICI / IUI / ICI`
  - **Casing (rende 4):** `ICI / CUC / ICI`
  - Controller: `K_K / UDU / KRK` (D = diamante, R = redstone)
  - Power Tap: `KRK / R_R / KRK`
  - Access Port: `K_K / _V_ / KPK` (V = baú, P = pistão)
  - Coolant Port: `K_K / IBI / KPK` (B = balde)
  - Control Rod: `KCK / CRC / KUK`
  - Reactor Glass: `GKG` (G = vidro)
  - Redstone Port: `KRK / RgR / KRK` (g = lingote de ouro)
  - Cyanite Reprocessor: `KIK / PFP / KRK` (F = fuel rod)
  - Turbina: Housing ×4 = `IGI / QCQ / IGI` (C = cianita, Q = quartzo); Controller `H_H / BDB / H_H` (B = blutonium); Rotor Shaft `ICI`; Blade `CII`.

### 3.5 O que o Crash Landing mudou no Big Reactors
- Atualizou para a **0.3.4A2** (changelog 1.1.0, fórum FTB).
- **"Big Reactor parts to be salvage only":** as partes do reator não são craftáveis e precisam ser **encontradas em ruínas**. O **Controller é recuperado num prédio específico das cidades, que nem toda cidade tem** (guia comunitário). Não encontrei a lista exata de quais partes continuaram craftáveis.
- **Yellorium:** relatos dizem que é preciso **peneirar poeira** ("dust sifting is needed to keep up Yellorium supply"). Outro post diz que "yellorium has to be found on other planets". A geração de minério no mundo provavelmente estava desligada no planeta desértico [inferido]. Os jogadores também reprocessavam cianita em blutonium.

### 3.6 Tabela de viabilidade: Big Reactors

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Validação do multibloco | Cubo oco 3×3×3 a 32×32×48; ≥1 controller e ≥1 control rod; fuel rods em colunas | **Só ao interagir com o Controller** (`playerInteractWithBlock`): BFS ou flood-fill a partir do controller pelos blocos de casing para achar a caixa, verificar bordas e interior, e contar rods e moderadores. Salva o resultado (dimensões, nº de rods, fator de moderador, coordenadas de portas) em dynamic property do controller. **Limitar a 7×7×7** (343 blocos ≈ 1 varredura barata). Invalidar ao quebrar qualquer parte (`playerBreakBlock` + tag "reator_id") | Alta | Médio só no momento da montagem; Baixo depois | Limitar a 5×5×5 |
| Simulação calor/radiação (tick a tick) | Fórmulas do código: rad = 0,01 × mB^reatividade × (1 − inserção); 10 RF por fissão; 50% no passivo | **Não simular por tick.** No `onTick` 100 do controller, usar um modelo fechado: `E/ciclo = rods × base × fatorModerador × (1 − inserção)`, calibrado para 3×3×3 (1 rod, ar) ≈ 270 RF/t ≈ **6,75 E/ciclo** e 7×7 com 5 rods de grafite ≈ 8.000 RF/t ≈ 200 E/ciclo (cortar para caber na economia do jogo) | Alta (simplificado) | Baixo | – |
| Barras de controle 0–100% | Linear | Estado de bloco `inserção` 0–10 (passos de 10%; 11 valores ≤ 16). Interagir com a mão vazia: +10%, agachado: −10% | Alta | Baixo | – |
| Combustível yellorium → cianita | 1 lingote = 1.000 mB; rod guarda 4 lingotes; 1:1 em lixo | Access Port com baú em cima: o controller puxa lingotes até `4 × rods`. A cada ciclo queima `rods × q × (1 − inserção)` mB [valor de design, ex.: 1 lingote dura ~1 dia de jogo por rod] e devolve cianita no baú de baixo ao fechar 1.000 mB | Alta | Baixo | – |
| Power Tap | Saída de RF | Bloco de borda que vira "fonte" para a rede de cabos E existente (só entrega o que o controller produziu no ciclo). Buffer do reator: limitar a ~2.500 E | Alta | Baixo | O próprio controller conecta nos cabos |
| Temperatura | Sem explosão na 0.3; calor alto reduz eficiência | Mostrar "temperatura" (estado visual ou texto na action bar via `onPlayerInteract`). Eficiência −X% acima de um limiar ligado ao tamanho e à inserção | Alta | Baixo | Omitir temperatura |
| Modo ativo (água → vapor) + turbina | Coolant port; turbina 5×5×4 a 16×16×32, 10 RF/mB de vapor | **Sem fluidos** no projeto. Simplificar: "Coolant Port" com baldes de água no baú dá um **bônus de ×2 a ×3 na produção** e consome 1 balde a cada N ciclos | Baixa (fiel) / Média (simplificado) | Baixo | Omitir a turbina |
| Cyanite Reprocessor | 2 cianitas + 1.000 mB de água + 2.000 RF, 200 ticks → 1 blutonium | Máquina simples: baú em cima com 2 cianitas e balde de água (devolve balde vazio), gasta **0,5 E** e leva 2 ciclos (10 s), saída embaixo | Alta | Baixo | – |
| Yellorite Ore na geração | 2–5 aglomerados/chunk, Y 4–50, até 10 blocos | Feature custom (`features` + `feature_rules`) com `minecraft:ore_feature`. **No Pouso Forçado, seguir o Crash Landing:** sem minério no mundo, yellorium só pela **peneira de poeira** com chance baixa | Alta | Baixo (worldgen nativo) | Só peneira |
| Peças "salvage-only" (Crash Landing) | Controller só em ruínas de cidade | Colocar o Controller (e talvez o Power Tap) como **loot** em estruturas (`structure` + `loot_tables`) e não registrar receita | Alta | Baixo | Receita cara com item raro |
| Grafite | Carvão ou carvão vegetal na fornalha | Receita de fornalha JSON | Alta | Baixo | – |
| Moderadores (grafite, água etc.) | Tabela do código | Na validação, contar os blocos internos e tirar a média do fator "moderação" (grafite 2,0, água 1,33, ar 1,1) como multiplicador | Alta | Baixo (só ao montar) | – |

---

## 4. Proporções resumidas no "E" (para balanceamento)

| Equipamento | Original | Pouso Forçado sugerido |
|---|---|---|
| Steam Dynamo / gerador a carvão | 80 RF/t; carvão 32.000 RF | **2 E/ciclo; carvão = 8 E** (já existe) |
| Enervation Dynamo | redstone 64.000 RF | 2 E/ciclo; redstone = 16 E |
| Magmatic Dynamo | lava 180.000 RF | 2 E/ciclo; balde de lava = 45 E (ou desativado, como no Crash Landing) |
| Pulverizer | 40 RF/t; 4.000 RF/minério | **1 E por minério, 1 minério/ciclo** |
| Redstone Furnace | 20 RF/t; 1.600 RF/item | 0,4 E/item, ~1 item/ciclo |
| Induction Smelter | 40 RF/t; 800 / 3.200 RF | 0,2 E (pó) / 0,8 E (minério) por operação |
| MFR Planter / Harvester | 160 / 240 RF por bloco | 0,04 / 0,06 E por bloco (área 3×3 ≈ 0,4 / 0,5 E por ciclo cheio) |
| MFR Grinder | 3.200 RF/golpe | 0,8 E por mob morto |
| Leadstone / Hardened Cell | 400k / 2M RF | 100 / 500 E (bateria atual: 15 E) |
| Reator 3×3×3 passivo | ~270 RF/t | ~6–7 E/ciclo (3× o gerador a carvão) |

---

## 5. Pontos incertos e não encontrados
1. **Números do TE3 sem código-fonte.** Os números vêm de trechos de FTB wiki, CoFH docs e fóruns, porque não consegui abrir as páginas. Os conflitos são: **Steam Dynamo: carvão = 32.000 RF (wikis TE3) ou 48.000 RF (TE4)**; **Leadstone Cell: 80 ou 200 RF/t**; **Redstone Cell: 1.000 RF/t (incerto, pode ser 2.000)**; **Magma Crucible: 320.000 RF por balde e 400 RF/t** (doc CoFH de versão incerta).
2. Não encontrados no TE3: RF/t do Sawmill, custos do Glacial Precipitator e do Igneous Extruder, receita do Redstone Furnace, receitas do Magma Crucible e do Transposer, e chances exatas de secundário para estanho, prata e chumbo.
3. Existência no TE3: Phytogenic Insolator, Compactor e conduíte de itens **provavelmente não existiam** [inferido]. Aqueous Accumulator e Energetic Infuser: não confirmados.
4. Crash Landing: a lista exata de partes "salvage-only" e de onde vinha o yellorium (peneira de poeira ou "outros planetas") vem de relatos de fórum. Também não encontrei o changelog oficial (o site `crashlanding.wildwestscifi.net` é citado, mas não consegui acessar).
5. Big Reactors: os RF/t por tamanho são relatos comunitários. Não calculei a simulação do código. O consumo de combustível por ciclo no Bedrock é **valor de design**, não original.
6. MFR: a interpretação de `HarvestAreaManager(radius, up, down)` como "raio 2, +2 acima, −1 abaixo" vem da leitura do construtor. A área exata do Planter e do Harvester (à frente ou em cima) depende da orientação da máquina.
7. Bedrock: os eventos e APIs citados (`entity.applyDamage`, `getEntities`, `spawnItem`, dynamic property em ItemStack, tosa de ovelha via evento) devem ser conferidos na versão estável alvo da `@minecraft/server` 2.x.

---

## 6. Fontes

**Código-fonte (lido localmente, versões exatas):**
- Big Reactors, branch `release-0.3` (0.3.4A2): https://github.com/erogenousbeef/BigReactors/tree/release-0.3. Arquivos: `common/BigReactors.java` (configs, worldgen, receitas), `common/multiblock/MultiblockReactor.java`, `helpers/RadiationHelper.java`, `MultiblockTurbine.java`, `tileentity/TileEntityCyaniteReprocessor.java`, `LICENSE.txt` (MIT) e `Changelog.md`
- MineFactory Reloaded 2.7.9 (commit d201d1f9): https://github.com/skyboy/MineFactoryReloaded. Arquivos: `setup/Machine.java`, `tile/base/TileEntityFactoryPowered.java`, `tile/machine/TileEntity{Planter,Harvester,Rancher,Grinder,Fertilizer,Composter,Sewer}.java`, `item/ItemUpgrade.java`, `setup/recipe/Vanilla.java`
- MFR original (PowerCrystals): https://github.com/powercrystals/MineFactoryReloaded
- Licença CoFH "Don't Be a Jerk" v2 (README): https://github.com/CoFH/ThermalExpansion

**Wikis, documentação e fóruns:**
- Crash Landing (versões dos mods): https://ftb.fandom.com/wiki/Crash_Landing
- Lista de mods do servidor: https://mineyourmind.readthedocs.io/en/latest/Modpacks_Server/1.6.4/crash_landing.html
- Tópico do Crash Landing 1.1.x (changelog: BR 0.3.4A2, peças salvage-only, pulverizer de ore gravel/sand): https://forum.feed-the-beast.com/threads/1-6-4-crash-landing-hardcore-hqm-version-1-1-x-beta-stable.46277/
- Crash Landing power source (lava desativada): https://forum.feed-the-beast.com/threads/crash-landing-power-source.50222/
- Crash Landing, help, venting and discussion: https://forum.feed-the-beast.com/threads/crash-landing-help-venting-and-discussion.50255/
- Guia de Big Reactors no Crash Landing: http://minecraft-lab.blogspot.com/2014/11/minecraft-crashlanding-big-rectors.html
- Getting Started (TE3): https://ftb.fandom.com/wiki/Getting_Started_(Thermal_Expansion_3)
- Pulverizer (TE3): https://ftb.fandom.com/wiki/Pulverizer_(Thermal_Expansion_3)
- Machine Frame (TE3): https://ftb.fandom.com/wiki/Machine_Frame_(Thermal_Expansion_3)
- Tesseract (TE3): https://ftb.fandom.com/wiki/Tesseract_(Thermal_Expansion_3)
- Redstone Energy Cell (TE3): https://ftb.fandom.com/wiki/Redstone_Energy_Cell_(Thermal_Expansion_3)
- Leadstone Energy Cell: https://ftbwiki.org/Leadstone_Energy_Cell
- Hardened Energy Cell: https://ftb.fandom.com/wiki/Hardened_Energy_Cell
- Resonant Energy Cell: https://ftb.fandom.com/wiki/Resonant_Energy_Cell
- Redstone Energy Conduit (TE3): https://ftb.fandom.com/wiki/Redstone_Energy_Conduit_(Thermal_Expansion_3)
- Energy Conduit: https://over-the-oasis-test.fandom.com/wiki/Energy_Conduit
- Steam Dynamo (TE3): https://ftb.fandom.com/wiki/Steam_Dynamo_(Thermal_Expansion_3)
- Steam Dynamo (fan wiki): https://over-the-oasis-test.fandom.com/wiki/Steam_Dynamo
- Steam Dynamo (tekkify2): https://tekkify2.fandom.com/wiki/Steam_Dynamo
- Magmatic Dynamo (TE3): https://ftb.fandom.com/wiki/Magmatic_Dynamo_(Thermal_Expansion_3)
- Compression Dynamo (TE3): https://ftb.fandom.com/wiki/Compression_Dynamo_(Thermal_Expansion_3)
- CoFH docs antigas (pulverizer, crucible, dínamos, células): https://oldcofh.github.io/docs/thermal-expansion/
- Thermal Expansion (Resonant Rise, máquinas TE3 1.6.4): https://resonant-rise.fandom.com/wiki/Thermal_Expansion
- Cinnabar (TE3): https://ftb.fandom.com/wiki/Cinnabar_(Thermal_Expansion_3)
- Thermal Expansion Ore Processing: https://ftb.fandom.com/wiki/Thermal_Expansion_Ore_Processing
- Benchmark Redstone Furnace TE 3.0.0.7 (20 RF/t, ~1.600 RF/item): https://forum.feed-the-beast.com/goto/post?id=665349
- Guia "Thermal Expansion 3 for Newbies": https://forum.feed-the-beast.com/threads/thermal-expansion-3-for-newbies-a-reference-guide-for-the-rest-of-us.39154/
- Tesseract no TE3: https://forum.feed-the-beast.com/threads/thermal-expansion-3-0-tesseract-energy-cap.38312/
- RF cable (Tesseract): https://forum.feed-the-beast.com/threads/rf-cable.50354/
- Energy Tesseract (fan wiki): https://over-the-oasis-test.fandom.com/wiki/Energy_Tesseract
- Phytogenic Insolator (só páginas de TE4 e TE5): https://ftb.fandom.com/wiki/Phytogenic_Insolator_(Thermal_Expansion_4)
- Licença do MFR (termos do PowerCrystals): https://forum.feed-the-beast.com/goto/post?id=442180
- MineFactory Reloaded (FTB wiki): https://ftb.fandom.com/wiki/MineFactory_Reloaded
- Big Reactors (devco wiki, 3×3×3 ≈ 270 RF/t): https://devco.fandom.com/wiki/Big_Reactors
- Good Big Reactors setup: https://forum.feed-the-beast.com/threads/good-big-reactors-setup.38559/page-2
- Big Reactors changelog: https://ftb.fandom.com/wiki/Big_Reactors/Changelog

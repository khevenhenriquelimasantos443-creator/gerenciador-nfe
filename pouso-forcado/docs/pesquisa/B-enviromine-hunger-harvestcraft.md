# Pesquisa B — EnviroMine, Hunger Overhaul e Pam's HarvestCraft (Crash Landing, MC 1.6.4)

Objetivo: levantar as **mecânicas** (com números) desses três mods do modpack *Crash Landing* (Iskandar, FTB third-party, MC 1.6.4) para recriá-las no add-on Bedrock **"Pouso Forçado"** (Script API `@minecraft/server` 2.x, celular).

## Como ler as fontes

A maior parte dos números abaixo vem da **leitura direta do código-fonte** da versão certa, não de wikis. As siglas de fonte usadas no texto são:

| Sigla | O que é |
|---|---|
| **[CL-wiki]** | Página do Crash Landing no FTB Wiki. Lista as versões usadas no pack: **EnviroMine 1.1.63**, **Hunger Overhaul 2l-build4**, **Pam's HarvestCraft 1.1.4**, Ex Nihilo 1.29e. |
| **[CL-fórum]** | Tópicos do fórum do FTB sobre o Crash Landing (posts do Iskandar e de jogadores). São informações anedóticas. |
| **[EM-código]** | Repositório `EnviroMine/EnviroMine-1.7`, commit `dcd5f9a`, de 28/07/2014: *"Transfer EnviroMine v1.1.63 … to 1.7.10"*. É o código da **1.1.63**, a mesma versão do pack, com só alguns arquivos já parcialmente portados para a API 1.7 (a lógica é a da 1.1.63). Arquivos citados: `trackers/EnviroDataTracker.java`, `handlers/EM_StatusManager.java`, `handlers/EM_EventManager.java`, `EnviroPotion.java`, `items/*WaterBottle.java`, `handlers/EM_PhysManager.java`, `core/EM_ConfigHandler.java`, `core/EM_Settings.java`. |
| **[EM-1.7]** | O mesmo repositório no `master` (EnviroMine 1.7.10, versão posterior). É usado só para recursos que **não existiam** na 1.1.63, como máscara de gás e filtros. |
| **[EM-wiki]** | Wiki oficial do GitHub (`EnviroMine-1.7.wiki`). Foi escrita para a versão 1.7.10, mas os textos de Temperatura, Hidratação, Sanidade e Ar batem com o código da 1.1.63. |
| **[HO-código]** | Repositório `squeek502/HungerOverhaul`, commit `38bed78` (iguana_man, 28/01/2014). `@Mod version="1.6.X-2l"` é a última versão 1.6.x, a mesma linha "2l" do pack. Arquivos: `IguanaConfig.java`, `IguanaFoodStats.java`, `ModuleVanilla.java`, `items/IguanaFood.java`, `blocks/IguanaCrop.java`, `blocks/IguanaCropPam.java`, `util/IguanaEventHook.java`, `util/IguanaPlayerHandler.java`, `ModuleHarvestCraftCrops.java`, `ModuleHarvestCraftTrees.java`. |
| **[HC-1.12]** | Repositório oficial `MatrexsVigil/harvestcraft` (versão 1.12, **não** é a 1.6.4): `item/ItemRegistry.java`, `config/ConfigHandler.java` e `assets/harvestcraft/recipes/*.json`. É usado só como **referência** de receitas e valores, porque o código da 1.6.4 (v1.1.4) não está público. |
| **[HC-wiki]** | Wikis de comunidade (harvestcraftmod.fandom, FTB Wiki, GT New Horizons wiki). |

> **Unidade de tempo do EnviroMine:** o "tracker" de cada jogador roda **a cada 30 ticks (1,5 s)** (`EM_StatusManager.updateTracker`: `updateTimer >= 30`). Todas as taxas "por atualização" abaixo valem por 1,5 s. Isso cai bem no limite "≥ 1 s" do projeto: dá para usar `system.runInterval(..., 30)`.
>
> **Escala:** o EnviroMine usa hidratação, ar e sanidade de 0 a 100. O projeto usa sede de 0 a 20, então **divida por 5**.

---

# 1. EnviroMine 1.1.63

## 1.1 Licença

- **Código:** **CC BY-NC-SA 4.0**, conforme o README do repositório (*"Licence: CC BY-NC-SA 4.0"*) [EM-código].
  - **BY:** exige crédito.
  - **NC:** proíbe uso comercial. Não pode ir para o Marketplace pago nem para um add-on vendido.
  - **SA:** se você **copiar ou adaptar** código ou assets, o add-on (ou ao menos a parte derivada) tem que sair sob a mesma licença.
- **Texturas:** o README não separa as texturas. Como elas estão no mesmo repositório (`src/main/resources/assets/enviromine/textures`), a leitura razoável é que também estão sob CC BY-NC-SA 4.0. Isso é **inferência**: não há declaração explícita sobre texturas.
- **Recomendação:** reimplemente as **mecânicas** com código próprio em JS. Ideias e números de balanceamento não são protegidos por direito autoral. Mesmo assim, ponha nos créditos "inspirado em EnviroMine (Funwayguy, TimbuckTato, GenDeathrow)". Só reaproveite texturas se o add-on for gratuito e publicado sob CC BY-NC-SA.

## 1.2 Visão geral: as 4 barras

Cada barra começa em: ar 100, temperatura corporal 37 °C, hidratação 100 e sanidade 100 (`EnviroDataTracker`) [EM-código]. No modo criativo, os valores ficam congelados.

### 1.2.1 Temperatura do ar (o "ambiente")

A temperatura do ar é calculada em `EM_StatusManager.getSurroundingData(entity, range=5)`, que varre um cubo de **11×11×11 blocos** em volta do jogador [EM-código].

1. **Bioma.** `bTemp = média(temperatura dos biomas no anel y=0 do cubo) × 2,25`. Em seguida:
   - se `bTemp > 1,5`: `bTemp = 30 + (bTemp − 1) × 10`;
   - se `bTemp < −1,5`: `bTemp = −30 + (bTemp + 1) × 10`;
   - caso contrário: `bTemp × 20`.
   - **Exemplos (temperaturas de bioma vanilla 1.6.4):**
     - deserto (2,0) → 4,5 → **65 °C**;
     - planície (0,8) → 1,8 → **38 °C**;
     - floresta (0,7) → 1,575 → 35,75 °C;
     - taiga (0,05) → 2,25 °C.
   - O cálculo é meu, aplicando a fórmula do código.
2. **Altitude** (fora do Nether):
   - Y ≤ 48: soma `50 × (1 − Y/48)` se o bioma estiver abaixo de 20 °C, ou `20 × (1 − Y/48)` se estiver acima. É o "calor geotérmico".
   - 96 < Y < 256: subtrai `20 × (Y−96)/159` (bioma abaixo de 20 °C) ou `40 × …` (bioma acima).
   - Y ≥ 256: −20 ou −40.
3. **Blocos frios** (somados como "cooling", com queda de efeito pela distância):
   - camada de neve: 0,01;
   - bloco de neve ou gelo: 0,015.
   - Nos padrões de item: bloco de neve e gelo −0,1, camada de neve −0,05.
4. **Dormindo:** +5 °C.
5. **Chuva** (com céu visível e bioma que chove): **−10 °C**, e o resfriamento do corpo fica 5× mais rápido (`dropSpeed` 0,005).
6. **Sombra de dia** (sem ver o céu, sem chuva): −2,5 °C.
7. **Noite:**
   - bioma **seco** (`rainfall == 0`, como o deserto): temperatura positiva **÷ 9**, então o deserto cai de 65 para **≈ 7,2 °C**;
   - outros biomas: ÷ 2;
   - se já estava ≤ 0: −10 °C.
8. **Dentro da água** (Y > 48): −5 °C, ou −10 °C em bioma com neve. O resfriamento fica 10× mais rápido (`dropSpeed` 0,01).
9. **Entidades vivas** num raio de cerca de 2 blocos: se a média delas (37 °C por padrão) for maior que o ar, o ar passa a ser `(ar + média)/2`. Um animal por perto aquece.
10. **Fontes de calor** (pega a **maior**, com queda pela distância `temp × (1 − d²/máx²)`, onde máx = √(3×5²) ≈ 8,66):
    - lava 200;
    - fogo 100;
    - tocha ou fornalha acesa 75;
    - netherrack 50;
    - itens na hotbar: balde de lava 100.
    - Se a fonte for mais quente que o ar: `ar final = (ar + fonte)/2`. Se a fonte passar de ar + 5, o aquecimento do corpo fica 5× mais rápido.
11. **Armadura** (padrões do `Defaults.cfg`, gerado em `loadDefaultArmorProperties`):

    | Conjunto | Noite | Sombra | Sol | Mult. noite / sombra / sol |
    |---|---|---|---|---|
    | Couro (por peça) | +1 °C | +1 °C | +1 °C | 1,0 / 1,0 / 1,0 |
    | Ferro | −0,5 °C | 0 | **+2,5 °C** | 1,0 / 1,0 / **1,1** |
    | Ouro | 0 | 0 | 0 | 1,0 / 1,0 / **1,2** |
    | Diamante | 0 | 0 | 0 | **1,1** / 1,0 / **0,9** |

    Os valores somam por peça: `bTemp *= 1 + Σ(mult−1)`, depois `bTemp += Σadd`.

    **Proteção contra fogo:** o excesso acima de 37 °C é multiplicado por `1 − níveis/18`. Com 4 peças de Proteção contra Fogo IV (16 níveis), quase anula o calor. Poção de Resistência ao Fogo limita a temperatura a 37 °C.
12. **Estados do corpo:**
    - correndo: +2 °C no ar, +0,05 de desidratação e velocidade de aquecimento de pelo menos 0,01;
    - em chamas: ar no mínimo 75 °C e velocidade 0,1;
    - dentro da lava: 200 °C e velocidade 1,0.

### 1.2.2 Temperatura corporal: como se move

A cada atualização de 1,5 s, o corpo anda em direção ao ar com passo `velocidade × spAmp`, onde `spAmp = |corpo − ar| / 10` se a diferença for maior que 10, senão 1 [EM-código].

- **Velocidades base:**
  - subida e descida: 0,001 por atualização;
  - bioma seco, Nether ou perto de lava: subida **0,005**.
- **Exemplo no deserto de dia:** o corpo sobe cerca de 0,005 × 2,8 = 0,014 °C a cada 1,5 s. Sem suor, leva uns **3,5 min** de 37 a 39 °C. A conta é minha.
- **Suor (termorregulação):** se o corpo estiver ≥ 38,02 °C, perde **0,1** de hidratação extra por atualização. Se a hidratação estiver ≥ 75, o corpo também **resfria 0,01 °C** por atualização. Por isso a [EM-wiki] diz que *"hidratação acima de 75% segura o corpo em ~38 °C"*.

**Limiares e efeitos** (a cada 1,5 s, efeito de 200 ticks = 10 s) [EM-código `EnviroDataTracker`, `EnviroPotion`, `EM_EventManager.onLivingUpdate`]:

| Corpo | Efeito |
|---|---|
| ≥ 39 °C | **Insolação I** (heatstroke), com velocidade de movimento **−25%** (modificador de atributo). |
| ≥ 41 °C | **Insolação II**: + Fraqueza, Fadiga de mineração e Fome (10 s), 10% de chance de Náusea. Também derruba a sanidade (taxa mínima de −1 por atualização). |
| ≥ 43 °C | **Insolação III**: + **4 de dano (2 corações)** com 50% de chance por atualização. |
| ≥ 45 °C com lava a até 5 blocos | Pega fogo por 10 s. |
| 38 °C | Partículas de suor (visual). |
| 37 °C | Normal. |
| ≤ 35 °C | **Hipotermia I**, com velocidade −25%. |
| ≤ 32 °C | **Hipotermia II**: + Fraqueza e Fadiga de mineração. |
| ≤ 30 °C | **Hipotermia III**: 4 de dano com 50% de chance por atualização ("falência de órgãos"). |
| Congelamento | O contador `timeBelow10` cresce quando (ar ≤ 10 °C **e** corpo ≤ 35 °C) **ou** corpo ≤ 30 °C. Com **≥ 120 atualizações (3 min)** vem o **Congelamento I**: 1/20 de chance por atualização de **soltar o item da mão**, velocidade −50% e a mensagem "dedos dormentes". Com **≥ 240 atualizações (6 min)** vem o **Congelamento II**: velocidade **−99%**, **não pula**, "pernas endurecem". O nível fica gravado e **só sai com maçã dourada**. |

**Comida e bebida que mexem na temperatura** [EM-código `EM_EventManager`, `Defaults.cfg`]:
- sopa e torta de abóbora: +0,05 °C (até 40 °C);
- carnes cozidas e batata assada: +0,05 °C;
- garrafa de água: −0,05 °C (piso de 37,05 °C);
- melancia, cenoura, maçã e cenoura dourada: −0,01 °C;
- água fria: −0,1 °C (piso de 30,1 °C).
- Ao acordar de uma noite de sono: corpo a 37 °C, se estiver abaixo disso.

> **Crash Landing:** o Iskandar escreveu que *"resfriar com água não leva abaixo de 37 °C; água fria pode levar até a hipotermia"* [CL-fórum]. Isso confirma o piso de 37,05 °C da água comum e o de 30,1 °C da água fria. Jogadores relatam insolação "perto da nave de metal" [CL-fórum], o que sugere propriedades customizadas de bloco no pack. O changelog beta 1.0.3 diz *"Several more blocks now have Enviromine properties"* [CL-fórum]. Os valores exatos **não foram encontrados**.

### 1.2.3 Hidratação (0–100)

Fonte: [EM-código], `EnviroDataTracker`, `getSurroundingData` e `EM_EventManager`.

**Perdas por atualização de 1,5 s:**

| Situação | Perda |
|---|---|
| Sempre | **0,05**, ou seja 2%/min e **50 min** de 100 a 0 |
| Bioma seco (`rainfall == 0`), Nether ou perto de lava | +0,05 |
| Bioma com `getIntRainfall() == 0` **e de dia** | +0,05 |
| Corpo ≥ 38,02 °C (suor) | +0,1 |
| Correndo | +0,05 |
| Efeito Fome (vanilla) ativo | +0,1 |
| Efeito Desidratação | **1 + amplificador** por atualização. É o efeito da água salgada, não a condição de estar sem água. |

Exemplo da conta: no **deserto de dia**, parado e sem suar, a perda é 0,15 por atualização, ou 6%/min, ou **≈ 16,7 min** de 100 a 0. Suando, sobe para 0,25 (10%/min, 10 min).

**Ganhos:**

| Fonte | Hidratação | Outros efeitos |
|---|---|---|
| Beber direto do bloco de água, **limpa** | +10 | −0,05 °C |
| Beber direto do bloco, **suja** | +10 | Fome 10 s (50%), Veneno 10 s (25%) |
| Beber direto do bloco, **salgada** | +5 | Desidratação 30 s (sempre); se já estiver desidratado, 20% de chance de subir o nível |
| Beber direto do bloco, **fria** | +10 | −0,1 °C |
| Garrafa de água **limpa** | **+25** | −0,05 °C |
| Garrafa **suja** (`EnviroItemBadWaterBottle`) | +25 | Fome 30 s (25%), Veneno 10 s (25%) |
| Garrafa **salgada** | +10 | Desidratação 30 s, que tira 1 por atualização, ≈ −20 de hidratação no total |
| Garrafa **fria** | +25 | −0,1 °C |
| Leite | +10 | — |
| Sopa ou torta de abóbora | +5 | — |
| Maçã, melancia, cenoura, cenoura dourada | +5 | — |
| Maçã dourada | +10 | Sanidade 100. A versão encantada zera tudo: 100/37/100/100. |
| Carne podre, olho de aranha, batata venenosa | **−5** | −1 de sanidade |

Detalhes das bebidas:
- O balanço líquido da **garrafa salgada** é cerca de **−10**: piora a sede.
- **Caldeirão sobre fogo ou lava** dá sempre água limpa, tanto bebendo quanto enchendo garrafa.

**Como o tipo da água é definido** (`getWaterType`):
- **suja:** pântano, selva, água com cor alterada ou **Y < 48**;
- **salgada:** oceano, praia ou oceano congelado;
- **fria:** planície de gelo, taiga, bioma com temperatura < 0 ou **Y > 127**;
- **limpa:** qualquer outro caso.

**Purificação e receitas** (`EnviroMine.java`):
- **fornalha:** garrafa suja, salgada ou fria vira **limpa** (0 XP);
- garrafa limpa + bola de neve = fria;
- garrafa limpa + terra = suja;
- garrafa limpa + areia = salgada.

**Efeitos da falta de água:**
- abaixo de **10**: Fraqueza + Fadiga de mineração e velocidade **−25%**;
- em **0**: **4 de dano a cada 1,5 s**, que mata em segundos.

**Camel Pack:**
- receita: 8 couros em volta de 1 garrafa de vidro;
- capacidade de 100 unidades, onde **1 garrafa = 25 unidades**, então cabem 4 garrafas;
- vestido no peito, quando a hidratação está ≤ 99 − 1, gasta 1 unidade e dá **+1 de hidratação por atualização** (a wiki diz "1% por segundo") e −0,1 °C se o corpo estiver ≥ 37,1 °C;
- **só aceita água limpa** (o refill confere `potion damage == 0`).

Fontes: [EM-código `CamelPackRefillHandler`, `EnviroArmor.setMaxDamage(100)`] e [EM-wiki].

> **Crash Landing:**
> - **Toda fonte de água conta como salgada** ("all water source blocks count as salt water in this pack, bad, bad things happen") [CL-fórum, Iskandar].
> - Não há fonte infinita.
> - Água colocada vira salgada (review de 2017).
> - A água que sai de caldeirão frio também é salgada e se limpa na fornalha [CL-fórum].
> - O caminho do jogador é: terra (barril ou peneira) → garrafa + terra = **suja** → fornalha → limpa. Recomenda-se guardar água limpa no Camel Pack [CL-fórum].

### 1.2.4 Qualidade do ar (0–100)

Fonte: [EM-código `getSurroundingData`].
- Com **luz do céu > 1** (céu visível) **ou Y > 48**, fora do Nether: o ar **regenera +2 por atualização**, cerca de 75 s de 0 a 100.
- No subsolo escuro, a taxa é o **pior valor negativo** entre os blocos do cubo 11³:

  | Fonte | Taxa |
  |---|---|
  | Lava | −1 |
  | Fogo | −0,5 |
  | Tocha ou fornalha acesa | −0,25 |
  | Balde de lava na hotbar | −0,5 |

  Esse valor é multiplicado pela **fração de blocos sólidos** do cubo, então um espaço aberto sofre menos.
- **Positivos (somam):**

  | Fonte | Taxa |
  |---|---|
  | Folhas (bloco ou na hotbar) | +0,1 cada |
  | Grama, flores e plantas | +0,1 ou +0,01 |
  | Encantamento Respiração no capacete | +0,3 por nível |

  A stack na hotbar multiplica por `1 + (n−1)/63`.
- **Nether:** −0,1 no mínimo.
- **Efeitos:**
  - ≤ 25: Lentidão I + Fadiga I (10 s);
  - ≤ 10: Lentidão II + Fadiga II;
  - **0: 4 de dano a cada 1,5 s**.
  - A [EM-wiki] diz que a tela fica esverdeada abaixo de 50%.

**Máscara de gás e filtros:** **não existem na 1.1.63** (o Crash Landing não tinha). Foram adicionados na 1.7.10 [EM-1.7]:
- **Respirador:** 5 ferros, vidro e 2 filtros. Carga de 1000.
- **Filtro (×4):** ferro + lã ou papel + carvão vegetal. Cada filtro recarrega 500.
- Com a máscara, a cada atualização em que o ar está ≤ 99, ela gasta `100 − ar` da carga e devolve o ar a 100. Também imuniza contra os gases da versão 1.7 (CO, CO₂, SO₂, H₂S, metano).

### 1.2.5 Sanidade (0–100)

Fonte: [EM-código `getSurroundingData`, `EM_EventManager`, `EnviroPotion`].

**Perda base:** **−0,005 por atualização**, sempre (0,2%/min, cerca de 8 h para zerar). No lugar da base, vale **o pior** destes valores:

| Fonte | Taxa por atualização |
|---|---|
| **Escuridão** (luz de bloco ≤ 1 **e** luz do céu ≤ 1, sem visão noturna) ou Nether | **−0,1**, ou 4%/min e **25 min** para zerar |
| Crânio por perto | −0,1 |
| Enderman à vista | −0,1 |
| Areia das almas | −0,05 |
| Teia | −0,01 |
| Morcego ou morto-vivo à vista | −0,01 |
| Vida ≤ 2 (1 coração) **ou** corpo ≥ 41 °C | taxa no mínimo **−1** (40%/min) |

**Golpes recebidos:** de Enderman −5, de morto-vivo −1 (`onEntityAttacked`).

**Ganhos:**
- flores ou plantas comuns por perto ou na hotbar, **só de dia**: **+0,1 por atualização**;
- ovo do dragão: +1;
- **dormir:** `ganho = 100 × (12000 − (horaDeDormir − 12000))/12000`, então uma noite inteira dá **+100**;
- maçã dourada: 100.
- O ganho de sono é calculado ao acordar (`onLivingUpdate`).

**Efeitos (Insanidade, 30 s):**
- ≤ 50: Insanidade I;
- ≤ 25: Insanidade II, com chance de Náusea de 1/(50/(amp+1)) por atualização;
- ≤ 10: Insanidade III.
- Também há **sons falsos**: 16 sons, como creeper, zumbi, explosão, trovão e lava, com a mesma chance.
- E **alucinações** (mobs falsos no cliente, chance de 1/75 por tick) e partículas de portal.

### 1.2.6 Ferimentos por queda: pernas quebradas e sangramento

**Não existem.** O `EnviroDataTracker` declara `brokenLeg`, `brokenArm` e `bleedingOut`, mas **nenhum código usa esses campos**, nem na 1.1.63 nem na 1.7.10 final. A 1.7.10 só define o `EnviroDamageSource.bleedout`, sem lógica [EM-código, EM-1.7].

O único efeito de "pernas" é o **Congelamento II** (−99% de velocidade, sem pulo).

Quanto à queda: ao aterrissar, há **1/5 de chance** de disparar uma atualização de física no bloco embaixo (`onLand`, tipo "Jump"). Pisar em estrutura instável pode derrubá-la.

### 1.2.7 Física: desmoronamento de blocos

Fonte: [EM-código `EM_PhysManager`, `EM_ConfigHandler.loadDefaultStabilityTypes`], [EM-wiki Physics].

**Quando roda:**
- ao quebrar um bloco (`HarvestDropsEvent`, exceto no criativo);
- em 1/5 das aterrissagens;
- em cascata, porque um bloco que cai agenda os vizinhos.

**Ritmo:**
- intervalo de **2 ticks** entre passes;
- teto de **128 atualizações por passe**;
- atraso de **1000 ticks** após o mundo iniciar e de **500** após carregar um chunk.

**Quais blocos** (`getDefaultStabilityType`):

| Tipo | Blocos | Distância de suporte | Mín. / máx. de vizinhos faltando para cair | Pode ficar pendurado? |
|---|---|---|---|---|
| **forte** | material ferro ou madeira, obsidiana, tijolo de pedra, tijolo, quartzo | 3 | 22 / 25 | sim |
| **médio** | material rocha, vidro, gelo, folhas | 2 | 15 / 22 | **não** (padrão do código; a wiki diz "sim") |
| **solto** | todo o resto (terra etc.), e blocos com ID > 175 por padrão | 1 | 10 / 15 | não |
| areia e cascalho | gravidade vanilla | — | — | — |

**Excluídos da física:** spawner, escada de mão, teia, glowstone, placa, cama, porta, bigorna, portais, pedra do End, vinhas, blocos indestrutíveis e não sólidos.

**Regra de suporte** (`hasSupports`): o bloco está **apoiado** se houver qualquer bloco sólido nas **9 posições logo abaixo** (3×3). Também está apoiado se, seguindo em linha reta em ±X e ±Z até `distância de suporte` blocos, existir uma "viga" de blocos sólidos na mesma altura com algo sólido embaixo.

**Regra de queda.** O bloco cai se **todas** estas condições valem:
- o bloco **logo abaixo não é sólido**;
- ele **não** está apoiado;
- nenhum vizinho "segura os outros";
- o número de vizinhos ar ou não sólidos (de 26) passa do mínimo.

Quando passa do mínimo:
- a chance é `1/(máx − faltando)`, ou 100% se for evento de colapso;
- é queda **garantida** se `faltando ≥ máx`.

**Casos especiais:**
- **Bloco molhado** (tocando água): a distância de suporte cai à metade e há 50% de chance extra de cair.
- **Pedra vira pedregulho** antes de cair (`stoneCracks`) e grama vira terra.
- **Vidro, gelo e folhas** quebram em vez de cair. O gelo vira água se houver algo embaixo.
- **Landslide:** blocos soltos sem nada ao lado escorregam na diagonal.

> **Crash Landing:** nenhuma configuração específica de física foi encontrada.

## 1.3 Tabela de implementação no Bedrock (EnviroMine)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Laço do tracker | 1 atualização a cada 30 ticks (1,5 s) | `system.runInterval(tick, 30)`, iterando `world.getAllPlayers()`. Estado em `player.setDynamicProperty` (salvar a cada N atualizações, não toda hora). | Alta | Baixo | — |
| Hidratação: perda base e de bioma | 0,05/upd; +0,05 em bioma seco; +0,05 de dia em bioma seco; +0,1 suando; +0,05 correndo. Na escala 0–20 do projeto: ÷5, ou seja 0,01/upd base e 0,03 no deserto de dia. | Já existe barra de sede: só **substituir as taxas** pelas do EM. `player.isSprinting`; dia por `world.getTimeOfDay()`; o mundo inteiro é deserto, então aplicar sempre o "bioma seco". | Alta | Baixo | — |
| 5 qualidades de água × EM (4 tipos) | Limpa +25 (garrafa) / +10 (bloco). Suja +25, Fome 25%, Veneno 25%. Salgada +10, depois Desidratação 30 s (−1/upd ≈ −20). Fria +25, −0,1 °C. | Mapear para o que já existe: excelente = limpa, boa = fria?, suja = suja, muito suja = suja com chance maior de veneno, imprópria = **salgada** (efeito "desidratação" customizado: dreno extra por 20 atualizações). `world.afterEvents.itemCompleteUse`. | Alta | Baixo | — |
| Purificação na fornalha e caldeirão aquecido | Fornalha: qualquer garrafa ruim vira limpa. Caldeirão com fogo ou lava embaixo dá água limpa. | Receita `minecraft:recipe_furnace` (tags `furnace`, `campfire`) de item custom para item custom. Caldeirão: `world.beforeEvents.playerInteractWithBlock` em `minecraft:cauldron` e checar o bloco abaixo (`fire`, `campfire`, `lava`). | Alta | Baixo | Só a fogueira (`campfire` tag) |
| Camel Pack | 4 garrafas (100 unidades). +1/upd quando a sede ≤ 99. Só água limpa. Receita: 8 couros + garrafa. | Item com `minecraft:wearable` (slot.armor.chest) e `minecraft:durability` como "água restante". No laço: se vestido e sede < máx, gastar 1 ponto e dar +0,2 (escala 20). Recarga por receita (pack + garrafa limpa → pack) ou interação. | Alta | Baixo | Cantil na mão (item usável) |
| Temperatura do ar | Deserto 65 °C de dia, ≈ 7 °C à noite (÷9). Sombra −2,5. Chuva −10. Água −5. Dormir +5. Fogo 100 / tocha 75 / lava 200 (queda `t×(1−d²/75)`). | O projeto já tem calor de dia e frio à noite: **copiar as âncoras** (65/7 °C) e a regra "fonte quente: (ar+fonte)/2". **Não varrer 11³ = 1331 blocos**: usar raio 2–3 só para fogueira, fornalha e lava, via `dimension.getBlocks(new BlockVolume(a,b), {includeTypes:[...]})` a cada 2–3 upd, ou manter registro dos blocos de calor colocados (eventos de colocar e quebrar). | Alta | Médio (varredura) / Baixo (registro) | Só checar o bloco onde o jogador pisa e 1 raio |
| "Vê o céu" e sombra | Sem céu: −2,5 °C. O ar regenera com céu. | `dimension.getTopmostBlock({x,z})` e comparar com `player.location.y`. Barato. | Alta | Baixo | `getBlockFromRay` para cima |
| Corpo segue o ar | Passo 0,001 (0,005 em bioma seco), × \|Δ\|/10 se \|Δ\| > 10. Suor ≥ 38,02 °C: −0,01 °C se sede ≥ 75%. | Fórmula pura em JS. Para o celular ficar mais "legível", pode-se multiplicar os passos por 3–5. | Alta | Baixo | — |
| Armadura e temperatura | Couro +1 por peça; ferro +2,5 ao sol (×1,1); ouro ×1,2 ao sol; diamante ×0,9 ao sol. | `player.getComponent('minecraft:equippable').getEquipment(EquipmentSlot.Head…)`, tabela por `typeId`. Roupa custom de deserto (turbante ou manto, ×0,8 ao sol) cai bem no tema. | Alta | Baixo | — |
| Insolação, hipotermia e congelamento | 39/41/43 °C e 35/32/30 °C. Dano 4 com 50% no nível III. Congelamento após 3 e 6 min frio: solta item / −99% velocidade. | `player.addEffect('slowness'|'weakness'|'mining_fatigue'|'nausea'|'hunger', 200, {amplifier, showParticles:false})` e `player.applyDamage(4, {cause: EntityDamageCause.temperature?})` (conferir o enum; senão `'override'`). Soltar item: `container.setItem(slot)` + `dimension.spawnItem`. | Alta | Baixo | Trocar "soltar item" por fraqueza |
| Desidratação 0 | Sede < 10: Fraqueza + Fadiga + Lentidão. Em 0: 4 de dano / 1,5 s. | Já existe dano. Ajustar a cadência para 1,5 s. | Alta | Baixo | — |
| Comidas que hidratam ou esquentam | Maçã, melancia, cenoura +5. Sopa +5 e +0,05 °C. Carne podre −5 de sede. | `itemCompleteUse` + tabela por `typeId`. Fruta de cacto e frutas custom +5. | Alta | Baixo | — |
| Qualidade do ar | Só abaixo da superfície e escuro. Lava −1, fogo −0,5, tocha −0,25. Folhas +0,1. 0 → 4 dano. | Mundo plano: o "subsolo" é o que o jogador cavar. Se a profundidade for > 4 blocos abaixo da superfície e **não houver céu**, aplicar dreno. Ar 100 quando houver céu. Fontes por registro de blocos colocados. | Média | Baixo–Médio | Simplificar: dreno fixo quando sem céu e com fogueira/tocha a ≤ 3 blocos |
| Tempestade de areia → ar | (não existe no EM) | **Extensão natural:** durante a tempestade de areia, o ar cai ao ar livre e a máscara protege. | Alta | Baixo | — |
| Máscara de gás e filtros | (só na 1.7.10) Carga 1000; filtro +500; consome `100−ar` por upd. | Capacete custom `wearable` (slot.armor.head) com `durability` como carga. Receita filtro = pano + carvão vegetal; recarga por receita. Ótimo para a tempestade de areia. | Alta | Baixo | — |
| Sanidade | Base −0,005/upd. Escuro −0,1. Vida ≤ 1 coração ou corpo ≥ 41 °C: −1. Flores de dia +0,1. Dormir +100. Insanidade em 50/25/10. | Escuro: `dimension.getLightLevel(loc)` / `getSkyLightLevel(loc)` (**conferir se é estável no 2.x**). Alternativa: "sem céu e sem tocha ou fogueira a ≤ 4 blocos". Dormir: `world.afterEvents.playerSleep`? (conferir) ou detectar `player.isSleeping`. Efeitos: náusea e sons falsos `player.playSound('random.explode', {location: perto})`. | Média | Baixo | Sanidade só subterrânea/noturna, sem alucinações visuais |
| Alucinações (mobs falsos) | Mob fantasma no cliente, 1/75 por tick | Não há entidade "só no cliente" via script. Seria preciso uma entidade custom invisível para os outros, o que é impossível em multiplayer. Em solo: spawnar uma entidade custom inofensiva que some em 3 s. | Baixa | Médio | Sons falsos e partícula (`spawnParticle` só para o jogador via `player.spawnParticle`) |
| Física: desmoronamento | Forte 3 / 22–25; médio 2 / 15–22; solto 1 / 10–15. Suporte 3×3 abaixo ou viga lateral. 2 ticks/passe, teto 128. | `world.afterEvents.playerBreakBlock`: checar **só** o bloco de cima e os 4 laterais (5 checagens) com a regra simplificada "sem bloco sólido 3×3 abaixo e sem viga ≤ N". Se cair, `setType('air')` no lugar e colocar o mesmo tipo no primeiro espaço livre abaixo (sem entidade de bloco caindo; não dá para spawnar `falling_block` arbitrário por script). Fila limitada a ~8 blocos por segundo. | Média | Médio | Só "cave-in" ao cavar túnel: teto de terra ou arenito sem suporte cai 1 bloco com dano 2 a quem estiver embaixo |
| Pernas quebradas e sangramento | **Não existem no EM** | Se quiser inventar: em `entityHurt` com `cause == 'fall'` e dano ≥ 6, chance de "perna quebrada" (lentidão II até tala custom). | (não original) | Baixo | — |

**Nota de desempenho:** a varredura original de 1331 blocos por jogador a cada 1,5 s é pesada demais para celular. A recomendação é um **registro de fontes de calor e ar** (Map de posições atualizado em `playerPlaceBlock`/`playerBreakBlock`) e checagem por distância. É O(n) em poucas fontes.

---

# 2. Hunger Overhaul (iguana_man), versão 1.6.X-2l

## 2.1 Licença

- O repositório (`squeek502/HungerOverhaul`, que contém a história completa desde o primeiro commit do iguana_man) **não tem arquivo de licença**. Nem a busca no CurseForge nem a dos espelhos achou licença declarada para o original. **Licença: não encontrada.** Sem licença explícita, o padrão legal é "todos os direitos reservados": **não copie código nem texturas**.
- **Mecânicas e números** (multiplicadores, regras) são ideias de jogo e podem ser **reimplementadas** com código próprio. Dê crédito por cortesia: "inspirado em Hunger Overhaul (iguanaman)".
- Os forks modernos têm licenças próprias (Hunger Overhauled: MIT; ActionHunger: CC0) e são reescritas. Não se aplicam ao original [HO-busca].

## 2.2 Mecânicas e valores padrão (config da 2l)

Fonte de todos os números: [HO-código `IguanaConfig.java`], salvo indicação.

### Crescimento de plantas: categoria `delays`

| Chave | Padrão | Efeito real no código |
|---|---|---|
| `cropRegrowthMultiplier` | **4** | Em cada *random tick*, só segue para o crescimento vanilla se `rand.nextInt(4 × modBioma) == 0`. Plantas ficam **4× mais lentas** (`IguanaCrop.updateTick`). |
| `noSunlightRegrowthMultiplier` | **2** | Se **não** for dia **ou** o bloco não vê o céu, o tempo dobra. 0 = só cresce ao sol. |
| `wrongBiomeRegrowthMultiplier` | **2** | Fora do bioma certo, ×2. Trigo, cenoura e batata: Floresta ou Planície. HarvestCraft: "normal" = Floresta ou Planície, "úmido" = Selva ou Pântano, **"deserto" = Deserto (fruta de cacto)** (`IguanaCropPam.biomes`). |
| `wrongBiomeRegrowthMultiplierSugarcane` | 2 | Igual, para cana. |
| `sugarcaneRegrowthMultiplier` | 4 | Cana 4× mais lenta. |
| `cactusRegrowthMultiplier` | 4 | Cacto 4× (só com Natura instalado). |
| `cocoaRegrowthMultiplier` | 4 | Cacau. |
| `treeCropRegrowthMultiplier` | 4 | Frutas de árvore do HarvestCraft. |
| `saplingRegrowthMultiplier` | 4 | Muda: `SaplingGrowTreeEvent` negado com chance 3/4. |
| `flowerRegrowthMultiplier` | 1 | Flores do WeeeFlowers. |

> **Atenção (uma interpretação):** com o `cropRegrowthMultiplier` 4 e o `noSunlightRegrowthMultiplier` 2, o código **não multiplica** os dois. Ele faz `return` se não houver sol e o fator for 0, mas o fator de sol 2 **não entra** na conta do `nextInt` do `IguanaCrop`. Lendo `updateTick`, só o `sunlightModifier == 0` tem efeito. A variável é calculada e depois **ignorada** (bug ou simplificação). O efeito real é **4× sempre** e **8× fora do bioma**. A descrição da config promete ×2 sem sol. Fonte: leitura de `IguanaCrop.updateTick` e `IguanaCropPam.updateTick`.

### Colheita: categoria `harvesting`

- **Clique direito** na planta madura colhe e **devolve a planta ao estágio 0**, sem precisar replantar (`IguanaCrop.onBlockActivated`).
- Produção por colheita: `producePerHarvestMin` **2**, `producePerHarvestMax` **4**.
- Sementes por colheita madura: `seedsPerHarvestMin/Max` **0/0**. Quebrar uma planta madura **não devolve sementes**; quebrar uma imatura devolve 1 semente.
- **"Colher com enxada dá mais": não existe na 2l.** A enxada só afeta a obtenção de sementes, abaixo.

### Sementes e enxada: categoria `getting seeds`

- `removeTallGrassSeeds` **true**: grama alta não dá semente.
- `modifyHoeUse` **true**:
  - **com água a até 4 blocos** (área 9×2×9), a enxada ara normalmente, mas leva **dano ×5** (`hoeToolDamageMultiplier` 5);
  - **sem água**, usar a enxada em **grama** a transforma em **terra** e tem chance de dar semente: `seedChance` **20%** no Normal, **40%** no Pacífico ou Fácil, **10%** no Difícil;
  - em terra sem água, a ação é cancelada.
- `allSeedsEqual` true: todas as sementes têm o mesmo peso.
- `removeHoeRecipes` true: **remove as enxadas de madeira e de pedra**.

### Animais (`delays`)

- `breedingTimeoutMultiplier` **4**: depois de cruzar, o contador de idade positivo só avança em 1 de cada 4 ticks. Intervalo entre cruzas **4×** (vanilla 5 min, então cerca de 20 min).
- `childDurationMultiplier` **4**: filhote leva 4× para crescer (vanilla 20 min, então cerca de 80 min).
- `eggTimeoutMultiplier` **4**: ovos 4× mais raros (vanilla 5–10 min, então 20–40 min).
- `milkedTimeout` **20 min**: a vaca não dá leite de novo por 20 min, ou 1200 s guardados no NBT `Milked` (`IguanaEventHook`).
- Valores vanilla de referência (cruza, filhote, ovo): conhecimento geral da Minecraft Wiki, **não conferidos nesta pesquisa**.

### Comida: categoria `food`

- `modifyFoodValues` **true**. **Com HarvestCraft instalado**, que é o caso do Crash Landing:
  - **Comidas vanilla substituídas** (`ModuleVanilla`), na forma fome / modificador de saturação. **Saturação ganha = fome × mod × 2**, a fórmula vanilla mantida em `addStats(int,float)`.

    | Comida | Fome / mod | Observação |
    |---|---|---|
    | Maçã | 1 / 0,05 | |
    | Pão | 3 / 0,2 | |
    | Porco cru | 1 / 0,05 | |
    | Porco assado | 2 / 0,15 | |
    | Peixe cru | 1 / 0,05 | |
    | Peixe cozido | 2 / 0,1 | |
    | Cookie | 1 / 0,05 | |
    | Melancia | 1 / 0,05 | |
    | Bife cru | 1 / 0,05 | |
    | Bife | 2 / 0,15 | |
    | Frango cru | 1 / 0,05 | Fome 30 s com 15% de chance |
    | Frango assado | 2 / 0,15 | |
    | Carne podre | 1 / 0,05 | Fome com 40% de chance |
    | Batata assada | 2 / 0,15 | |
    | Batata venenosa | 1 / 0,05 | Veneno 5 s com 30% de chance |
    | Torta de abóbora | 3 / 0,15 | |
    | Ensopado de cogumelo | 2 / 0,1 | |
    | Cenoura | 1 / 0,05 | |
    | Batata | 1 / 0,05 | |

    - **Comida crua é sempre 1 / 0,05.** O pacote "cru é pior" vem daí: 1 ponto e 0,1 de saturação, contra 2 / 0,6 da cozida.
    - Para comparar, o vanilla 1.6.4 (de memória; conferir na Minecraft Wiki) é pão 5/0,6, bife 8/0,8, maçã 4/0,3. Ou seja, a comida vanilla fica **cerca de 4× pior**.
  - **Comidas de outros mods** (todas as do HarvestCraft) passam por `IguanaFoodStats.addStats(ItemFood)`:
    - **fome = max(arredondar(fome_original / 4), 1)**, com `modFoodValueDivider` 4;
    - **modificador de saturação = max(arredondar(fome/20), 0)**, que dá **0** para qualquer comida (a fome resultante ≤ 5), então **nenhuma saturação**.
    - Isso entrou no último commit (*"Fix incorrect saturation value on mod foods"*).
  - Plantas cruas do HarvestCraft: `cropfoodrestore` e `bushfoodrestore` forçados a **1**, com mod 0,1 (`ModuleHarvestCraftCrops`).
- `modifyFoodStackSize` true. O tamanho do stack depende da fome:

  | Fome | Stack máximo |
  |---|---|
  | ≤ 2 | 16 |
  | ≤ 5 | 8 |
  | ≤ 8 | 4 |
  | ≤ 11 | 2 |
  | maior | 1 |

  Fonte: `IguanaFood`.
- `modifyFoodEatingSpeed` true: o tempo de comer é **fome × 8 + 8 ticks** (vanilla 32).
- Não dá para comer com o efeito **Fome** ativo (`onItemRightClick`).
- `addWellFedEffect` true. **Bem Alimentado** dura `(fome×100)^1,2` ticks, e só é aplicado se for ≥ 30. Exemplos: fome 2 dá cerca de 577 ticks (29 s); fome 3 dá cerca de 934 ticks (47 s). A duração **soma** com a do efeito ativo. Efeito: o intervalo de regeneração × 0,75.
- Tooltips: "morsel / snack / light meal / meal / large meal / feast" e "unfulfilling / nourishing / wholesome / hearty".

### Fome e regeneração: categorias `hunger`, `health`, `difficulty scaling` e `low stats`

Fontes: `IguanaFoodStats.onUpdate`, `IguanaEventHook`, `IguanaPlayerHandler`.

- **Perda de fome:** limiar de exaustão **3,0** no Normal ou Difícil (vanilla 4,0), 4 no Fácil e 5 no Pacífico. Fome cai cerca de **33% mais rápido** no Normal.
- `constantHungerLoss` true: **+0,01 de exaustão a cada 10 ticks** (0,02/s). Só por existir, perde 1 ponto de saturação ou fome a cada cerca de **150 s** no Normal (conta minha: 3 / 0,02).
- `hungerLossRatePercentage` 100 (0 desliga a fome).
- **Regeneração:**
  - só com fome ≥ **7** (`minHungerToHeal`; vanilla 18);
  - **não gasta fome** (`disableHealingHungerDrain` true);
  - 1 HP a cada `80 × dif × bemAlimentado × (1 + vidaFaltando × 0,05 × dif)^1,5` ticks, onde dif = 0,75 (Pacífico ou Fácil), 1 (Normal) ou **1,5 (Difícil)**;
  - exemplo no Normal, faltando 10 HP: cerca de 147 ticks, ou **7,4 s por meio coração**;
  - **levar dano zera o contador**.
- `foodRegensHealth` false: comer não cura direto.
- **Fome zero:** `damageOnStarve` **200** (morte instantânea). **Porém** o código `if (foodLevel <= 0 && ++starveTimer >= 80) {…} else starveTimer = 0;` zera o contador a cada tick. Pela leitura, **o dano de fome nunca dispara** (provável bug). **Incerto**: não testado em jogo.
- **Fome ao renascer:** 20 no Pacífico ou Fácil, 16 no Normal e **12 no Difícil** (`respawnHungerValue` 20 − (dif−1) × 4).
- `addSleepHungerLoss` false (o código está comentado).
- **Efeitos de status baixo:** checados a cada 10 ticks, duram 19 ticks (renovação contínua). Com `difficultyScaling`, o modificador de dificuldade é **2 no Normal** e **3 no Difícil**.

  | Condição | Lentidão | Fadiga de mineração | Fraqueza | Náusea |
  |---|---|---|---|---|
  | fome ≤ 1 **ou** vida ≤ 5% | amp. 1+m (Normal: **IV**) | IV | amp. m−1 (Normal: **II**) | sim |
  | fome ≤ 2 ou vida ≤ 10% | III | III | I (m ≥ 2) | — |
  | fome ≤ 3 ou vida ≤ 15% | II | II | (m ≥ 3) | — |
  | fome ≤ 4 ou vida ≤ 20% | I (m ≥ 2) | I | — | — |
  | fome ≤ 5 ou vida ≤ 25% | (só m ≥ 3) | — | — | — |

  - **Texto no HUD:** "Starving" com fome ≤ 6, "Hungry" ≤ 10, "Peckish" ≤ 14. "Hurt" com vida < 50%, "Injured" ≤ 30%, "Dying" ≤ 15%.
- **Farinha de osso** (`difficultyScalingBoneMeal`):
  - **no Difícil, não faz nada**;
  - no Normal, planta vanilla +1 estágio;
  - plantas do HarvestCraft, 1/3 de chance, e 1/6 para as de ID > 28.

> **Crash Landing:** a dificuldade é **Hardcore**, que no Java 1.6.4 roda como **Difícil** [CL-wiki]. Se o pack manteve o padrão do HO, no CL:
> - a farinha de osso é inútil;
> - a regeneração é 1,5× mais lenta;
> - a semente por enxada sai com 10% de chance;
> - os efeitos de status baixo são os mais fortes;
> - o jogador renasce com fome 12.
>
> A config específica do CL **não foi encontrada**. O pack também tinha **Spice of Life**: um histórico de 20 refeições reduz o valor de comida repetida [CL-fórum].

## 2.3 Tabela de implementação no Bedrock (Hunger Overhaul)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Plantas 4× mais lentas | `nextInt(4)` por random tick; ×2 fora do bioma | **Plantas custom** com custom component `onRandomTick` (bloco com estados `cl:stage`): `if (Math.random() < 1/4) avança`. Como o mundo é deserto, usar o "bioma certo" como **estufa**: dentro dela, 1/4; fora, 1/8. | Alta | Baixo (random tick nativo) | — |
| Sem sol, mais lento | ×2 (na prática não aplicado no 2l) | No `onRandomTick`: `dimension.getTopmostBlock` acima da planta, ou checar se há teto de vidro da estufa. À noite: `world.getTimeOfDay()`. | Alta | Baixo | Ignorar |
| Plantas vanilla mais lentas | Trigo, cenoura, batata, cana, cacau 4× | Não dá para alterar o crescimento vanilla por script. `randomTickSpeed` é global e afetaria tudo. | Inviável (vanilla) | — | Usar só plantas custom no add-on, ou não dar sementes vanilla (como o CL fez: tirou as sementes vanilla da peneira) |
| Colheita com clique direito, 2–4 produtos, 0 sementes | min 2, máx 4; volta ao estágio 0 | `onPlayerInteract` do componente custom: se maduro, `dimension.spawnItem(new ItemStack(id, 2+rand(3)))` e `setPermutation(stage 0)`. | Alta | Baixo | — |
| Sem sementes da grama; enxada em grama seca dá semente (20/40/10%) | `seedChance` 20 | No deserto não há grama. Equivalente temático: **peneirar areia ou terra** (como o CL fazia com a peneira do Ex Nihilo) com chance de semente de 5–20%. | Alta | Baixo | — |
| Enxada ×5 de desgaste perto de água | `hoeToolDamageMultiplier` 5 | `world.afterEvents.playerInteractWithBlock` em terra: aplicar dano extra à enxada via `ItemDurabilityComponent.damage += 4`. | Média | Baixo | Omitir |
| Comida crua 1 / 0,05; cozida 2 / 0,15; pão 3 / 0,2 | Ver a tabela da seção 2.2 | **Itens custom**: `minecraft:food` com `nutrition` e `saturation_modifier`. A fórmula do Bedrock é a mesma: sat = nutr × mod × 2. **Comidas vanilla não podem ser redefinidas** por add-on. Opção: em `itemCompleteUse` de comida vanilla, aplicar **efeito Fome curto** para "comer" parte do ganho (aproximação), ou ler e ajustar `player.getComponent('minecraft:player.hunger'/'player.saturation')` (**conferir se é estável no 2.x**). | Média | Baixo | Não fornecer comida vanilla no mundo; só custom |
| Comidas de mod ÷4 e saturação 0 | `max(round(h/4),1)`, sat 0 | Já embutir nos valores dos itens custom (por exemplo, prato de 8 → 2). **Não recomendo saturação 0** no celular: fica frustrante. Usar mod 0,1–0,3. | Alta | Baixo | — |
| Perda de fome mais rápida | Exaustão 3,0 (vs 4,0); +0,02/s constante | Se o componente `player.exhaustion` estiver estável, somar 0,03 por 1,5 s. Senão: aplicar `hunger` amp 0 por 1 s a cada N s (o efeito Fome dá 0,005 de exaustão por tick no Java; **conferir no Bedrock**). | Média | Baixo | Aceitar a fome vanilla e compensar com comida mais fraca |
| Regenerar com fome ≥ 7, sem gastar fome; mais lento com pouca vida | 80 ticks × fórmula | Não dá para mudar a regen vanilla. Opção: gamerule `naturalRegeneration false` + regen própria a cada 1,5 s (`health.setCurrentValue(+1)` se o timer passou da fórmula). | Média | Baixo | Manter a regen vanilla |
| Efeitos de status baixo (lentidão, fadiga, fraqueza, náusea) | Limiares 1/2/3/4/5 de fome e 5/10/15/20/25% de vida | No mesmo laço de 1,5 s: `addEffect(..., 40, {amplifier})` (2 s, renova). Fome lida via componente (conferir) **ou** só pela vida (`minecraft:health`). | Alta (vida) / Média (fome) | Baixo | Só pela vida |
| HUD "Faminto / Ferido" | Fome ≤ 6/10/14; vida 50/30/15% | Acrescentar à actionbar já existente. | Alta | Baixo | — |
| Bem Alimentado | `(h×100)^1,2` ticks; regen ×0,75 | Em `itemCompleteUse`: `addEffect('regeneration', …)` fraco, ou flag própria que acelera a regen custom. | Alta | Baixo | — |
| Animais: cruza ×4, filhote ×4, ovo ×4 | 20 min / 80 min / 20–40 min | Sobrescrever os JSON das entidades vanilla no behavior pack (permitido): `minecraft:ageable.duration` ×4 (vaca 1200 s → 4800 s). Galinha: `minecraft:spawn_entity` `min_wait_time`/`max_wait_time` 300–600 → 1200–2400. Cruza: cooldown via `minecraft:breedable`? (**não confirmado**; alternativa: tag/propriedade dinâmica após `entitySpawn` com causa `Born` e cancelar `playerInteractWithEntity` com comida de cruza até expirar). Para as **cápsulas com animais** do projeto, aplicar nas entidades custom ou nas vanilla sobrescritas. | Alta (ageable/ovo) / Média (cruza) | Baixo | — |
| Vaca: 20 min entre ordenhas | `milkedTimeout` 20 | `world.beforeEvents.playerInteractWithEntity`: se o alvo é vaca e o item é balde, checar `cow.getDynamicProperty('cl:ordenha')` (tick do mundo). Cancelar e tocar som de dano se < 24000 ticks. | Alta | Baixo | — |
| Farinha de osso nula no Difícil | — | Em plantas custom: `onPlayerInteract` com farinha de osso, `cancel`, ou só 1/3 de chance. | Alta | Baixo | — |
| Stack de comida por valor (16/8/4/2/1) | ≤2→16 … >11→1 | `minecraft:max_stack_size` em cada comida custom. | Alta | Baixo | — |
| Tempo de comer = h×8+8 ticks | Fome 1 → 0,8 s; fome 8 → 3,6 s | `minecraft:use_modifiers.use_duration` (segundos) por item custom. | Alta | Baixo | — |

---

# 3. Pam's HarvestCraft 1.6.4 (v1.1.4 no Crash Landing)

## 3.1 Licença

- O texto da licença do HarvestCraft (copiado em sites de listagem; varia por versão) [HC-licença]:
  - **proíbe** descompilar exceto para fins educativos;
  - **proíbe** redistribuir;
  - **proíbe** usar as **texturas** sem permissão escrita e datada da autora (Pamela Collins / MatrexsVigil; as texturas antigas são em parte do Rhodox, do Painterly Pack);
  - versões novas afirmam que **nenhuma arte pode ser usada de graça em outro jogo**;
  - permite uso em **modpacks gratuitos com crédito**, e permite add-ons e configs, desde que se diga que as mudanças não são da autora.
- O repositório oficial no GitHub (`MatrexsVigil/harvestcraft`, 1.12) **não tem arquivo LICENSE** [HC-1.12].
- **Conclusão:** **não reaproveitar código nem texturas.** Recriar nomes genéricos de comida, receitas (que são culinária comum) e mecânicas com arte própria. Crédito opcional: "inspirado em Pam's HarvestCraft".

## 3.2 Plantações (lista da era 1.6.4)

A lista de plantas que o Hunger Overhaul 2l substitui (`ModuleHarvestCraftCrops`, IDs de 0 a 55) [HO-código], e portanto as que existiam na linha 1.6.x do HarvestCraft:

aspargo, cevada, feijão, beterraba, brócolis, couve-flor, aipo, cranberry, alho, gengibre, alho-poró, alface, aveia, cebola, pastinaca, amendoim, abacaxi, rabanete, arroz, rutabaga, centeio, cebolinha, soja, raiz comestível, folha de tempero, semente de girassol, batata-doce, folha de chá, nabo, cogumelo branco, alcachofra, pimentão, amora-preta, mirtilo, couve-de-bruxelas, repolho, **fruta de cacto**, candleberry, melão cantalupo, **pimenta chili**, grão de café, **milho**, pepino, berinjela, uva, kiwi, semente de mostarda, quiabo, ervilha, framboesa, ruibarbo, alga, morango, tomate, abóbora-de-inverno, abobrinha.

- Na 1.6.4 as plantas do HarvestCraft têm **3 estágios** (0–2), com TileEntity. A farinha de osso avança até o estágio 2 (`IguanaCropPam.fertilize`) [HO-código].
- **Bioma preferido** segundo o HO: **fruta de cacto = Deserto**; abacaxi, arroz, uva e kiwi entre as "úmidas" (Selva ou Pântano); a maioria das outras = Floresta ou Planície. Há incerteza no mapeamento exato de índice para bioma (`IguanaCropPam.biomes`).
- **Árvores de fruta 1.6.4** (`ModuleHarvestCraftTrees`): maçã, abacate, banana, cereja, canela, **coco**, pitaya (dragonfruit), **limão**, lima, manga, noz-moscada, **azeitona**, laranja, mamão, pêssego, pera, pimenta-do-reino, ameixa, romã, carambola, baunilha, noz. São 22 [HO-código].

## 3.3 Como se obtêm as sementes: jardins

- **Jardins** (blocos de mundo que, ao quebrar, dão a planta, de onde se tiram as sementes, ou dão as sementes se `gardensdropSeeds` estiver ativo) [HC-wiki].
- Lista da era 1.7.10 (13 tipos; **não confirmado para 1.6.4 v1.1.4**): Berry, **Desert**, Grass, Ground, Gourd, Herb, Leafy, Mushroom, Nether, Stalk, Textile, Tropical, Water [HC-wiki GTNH].
  - **Jardim do Deserto:** só em deserto (e, em versões posteriores, mesa e savana). Dá **cacto + fruta de cacto (3×)**. Sementes da fruta de cacto no grid de crafting [HC-wiki FTB].
  - Grass Garden: aspargo, broto de bambu, cevada, milho, aveia, centeio. Gourd: cantalupo, pepino, abóbora, abóbora-de-inverno, abobrinha (wiki de modpack, versão não declarada).
- **Sementes a partir da comida:** cada planta vira semente no grid de crafting (a fruta de cacto, por exemplo) [HC-wiki].

> **Crash Landing:** o desenvolvedor **removeu as sementes vanilla da peneira e do livro de quests e pôs sementes do HarvestCraft** na peneira (Ex Nihilo) e nas recompensas de quest [CL-fórum, changelog]. Peneirar terra dá pedrinhas e chance de **sementes de plantas ou de árvores** [CL-fórum]. Ou seja: **no CL, as sementes vinham da peneira e das quests, não de jardins** (num mapa de deserto vazio não há jardins naturais). Dicas do fórum para comida inicial: ossos para fazer caldo (stock), sopa de olho de aranha, arroz → farinha [CL-fórum "Crash Landing Food"].

## 3.4 Utensílios (ferramentas que voltam após o craft)

São 8 utensílios na era 1.6.4, conforme o fórum da Pam: **Assadeira (Bakeware), Panela (Pot), Tábua de corte (Cutting Board), Pilão (Mortar and Pestle), Espremedor (Juicer), Batedeira/Tigela (Mixer / Mixing Bowl), Frigideira (Skillet), Caçarola/Molheira (Saucepan)** [HC-wiki, fórum Pam's Mods 1.6.x]. Eles **não são consumidos** na receita, porque são *container items* [HC-wiki FTB "Pot", "Mortar and Pestle"].

| Utensílio | Uso | Receita 1.12 [HC-1.12 `tool_*.json`] |
|---|---|---|
| Tábua de corte | sanduíches e cortes | tijolo, graveto, tábua (diagonal) |
| Panela | sopas, caldos, sal, queijo | graveto + 4 tijolos |
| Frigideira | fritos, ovos, panquecas | 2 tijolos + graveto (diagonal) |
| Caçarola | molhos, manteiga, doces | tijolo + graveto |
| Assadeira | pães, assados, pipoca | 8 tijolos (anel) |
| Pilão | farinha, fubá, temperos | 3 pedras + graveto |
| Tigela de mistura | massa, massa líquida | 3 tábuas + graveto |
| Espremedor | sucos, maionese | pedra + placa de pressão de pedra |

Na 1.6.4, as receitas dos utensílios usavam **ferro** (frigideira e caçarola com lingote de ferro e graveto), segundo um Pastebin de versão desconhecida. **Não confirmado.**

## 3.5 Receitas úteis (~40)

**Aviso sobre os valores:** os valores originais de fome e saturação da **1.6.4 (v1.1.4) não foram encontrados** em fonte confiável. As wikis divergem: o Hambúrguer aparece como 6/15 numa página e 8/9,5 em outra [HC-wiki]. A tabela traz **ingredientes e fome da 1.12 oficial** [HC-1.12 `ItemRegistry.java` + `recipes/*.json`], e todos os pratos usam `mealsaturation` = **1,2**, então saturação = fome × 1,2 × 2.

A coluna "No CL (HO)" aplica a regra do Hunger Overhaul às comidas de mod, **max(arredondar(fome/4),1) e 0 de saturação**. Ela foi calculada sobre o valor da 1.12 e serve de **ordem de grandeza**.

### Intermediários

Fonte: [HC-1.12]. Nenhum é comida.

- **Água fresca:** balde ou garrafa de água → água fresca.
- **Sal:** panela + água.
- **Farinha:** pilão + grão. Na 1.12 é amêndoa; versões antigas usavam trigo, cevada, arroz etc. Pelo [CL-fórum], **arroz → farinha**.
- **Fubá:** pilão + milho.
- **Massa (dough):** tigela + água + farinha + sal.
- **Massa líquida (batter):** tigela + farinha + ovo.
- **Manteiga:** caçarola + creme de leite + sal.
- **Queijo:** panela + leite + sal (comida, fome 2).
- **Maionese:** espremedor + ovo.
- **Caldo (stock):** panela + carne crua, rende **3**, fome 2. No CL se fazia com **ossos** [CL-fórum].

### Pratos

| # | Prato | Ingredientes (utensílio em negrito) | Fome 1.12 | No CL (HO) |
|---|---|---|---|---|
| 1 | Torrada | **assadeira**, pão, manteiga | 4 | 1 |
| 2 | Ovo frito | **frigideira**, ovo | 3 | 1 |
| 3 | Ovo cozido | **panela**, ovo | 3 | 1 |
| 4 | Hambúrguer | **frigideira**, carne crua, torrada | 6 | 2 |
| 5 | Cheeseburger | hambúrguer, queijo | 8 | 2 |
| 6 | Iscas de peixe | **assadeira**, peixe cru, massa líquida | 5 | 1 |
| 7 | Arroz frito | **frigideira**, arroz, cenoura, ovo, cebola | 5 | 1 |
| 8 | Sopa de legumes | **panela**, batata, cenoura, cogumelo, caldo | 5 | 1 |
| 9 | Pizza | **assadeira**, massa, tomate, queijo, pepperoni | 11 | 3 |
| 10 | Broa de milho | **frigideira**, fubá, ovo, leite | 4 | 1 |
| 11 | Tortilha | **frigideira**, fubá, água | 3 | 1 |
| 12 | Taco | **tábua**, carne cozida, alface, queijo, tortilha | 8 | 2 |
| 13 | Burrito de feijão | **frigideira**, feijão, tortilha, arroz, queijo | 7 | 2 |
| 14 | Feijão assado | **panela**, feijão, porco cozido, açúcar | 4 | 1 |
| 15 | Salada de batata | **tábua**, batata assada, maionese | 3 | 1 |
| 16 | Purê de batata | **tigela**, batata amanteigada, sal | 5 | 1 |
| 17 | Batata amanteigada | batata assada, manteiga | 4 | 1 |
| 18 | Bolinho de batata | **frigideira**, cebola, batata, manteiga | 4 | 1 |
| 19 | Bacon com ovos | **frigideira**, porco cru, ovo | 4 | 1 |
| 20 | Panquecas | **frigideira**, massa líquida, leite | 4 | 1 |
| 21 | Omelete | **frigideira**, ovo, pimentão, cebola | 4 | 1 |
| 22 | Pimentão recheado | **assadeira**, pimentão, tomate, arroz | 3 | 1 |
| 23 | Chili poppers | **assadeira**, pimenta chili, massa líquida, queijo | 6 | 2 |
| 24 | **Suco de fruta de cacto** | **espremedor**, 2 frutas de cacto | 2 (bebida) | 1 |
| 25 | Suco de maçã | **espremedor**, 2 maçãs | 2 | 1 |
| 26 | **Sopa de cacto** | **panela**, cacto, caldo | 3 | 1 |
| 27 | Sopa de cenoura | **panela**, cenoura, creme de leite, caldo | 4 | 1 |
| 28 | Sopa de tomate | **panela**, tomate, caldo | 3 | 1 |
| 29 | Sopa de arroz | **panela**, arroz, caldo | 3 | 1 |
| 30 | Canja com macarrão | **panela**, frango cru, cenoura, macarrão, caldo | 6 | 2 |
| 31 | Ensopado de carne | **panela**, carne crua, farinha, caldo | 5 | 1 |
| 32 | Frango frito | **panela**, frango cru, massa líquida, tempero, pimenta, azeite | 8 | 2 |
| 33 | **Charque (beef jerky)** | carne crua, sal (sem utensílio) | 3 | 1 |
| 34 | Queijo-quente | **frigideira**, torrada, manteiga, queijo | 8 | 2 |
| 35 | Bolinho de arroz | arroz, **assadeira** | 2 | 1 |
| 36 | **Pipoca** | milho, **assadeira** | 2 | 1 |
| 37 | Milho na espiga | milho, manteiga | 3 | 1 |
| 38 | Salada de frutas | **tábua**, 2 frutas | 2 | 1 |
| 39 | Espetinho grelhado | **tábua**, pimentão, cebola, cenoura, graveto | 4 | 1 |
| 40 | **Pemmican** | **panela**, amendoim, fruta, carne cozida, gota de mel | 6 | 2 |
| 41 | Sushi | **tábua**, peixe cru, alga, arroz | 4 | 1 |
| 42 | Café da manhã reforçado | porco cozido, ovo frito, torrada, bolinho de batata, leite com chocolate | 15 | 4 |

Os itens em **negrito** no nome do prato (cacto, charque, pipoca, pemmican) se encaixam no tema deserto e sobrevivência e precisam de poucos ingredientes.

## 3.6 Tabela de implementação no Bedrock (HarvestCraft)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Utensílios que voltam após o craft | 8 utensílios, não consumidos | O Bedrock **não tem "item que volta"** em receita de crafting (sem container item). Solução: **utensílios como blocos-estação**: bloco custom com `minecraft:crafting_table` `{ "crafting_tags": ["cl_panela"], "table_name": "Panela" }`, e receitas `minecraft:recipe_shapeless` com `"tags": ["cl_panela"]`. O jogador coloca a panela no chão e "cozinha" nela. Sem GUI custom: usa a UI nativa de crafting. | Alta | Baixo | Utensílio como ingrediente consumido, com durabilidade simulada por script em `itemCompleteUse` (impraticável) |
| Plantas com estágios | 3 estágios (1.6.4) | Bloco custom com estado `cl:stage` 0–2 e `onRandomTick` (com a lentidão do HO). Exigir **terra arada + água por perto**, ou **solo de estufa** (já existe estufa no projeto). | Alta | Baixo | — |
| Sementes da comida | Planta → semente no crafting | Receita shapeless 1 planta → 1 ou 2 sementes. | Alta | Baixo | — |
| Jardins (fonte inicial de sementes) | Jardim do Deserto: cacto + 3 frutas de cacto | Mundo plano sem worldgen: **cápsulas ou caixas de suprimento** com sementes, ou **peneira de areia** (igual ao CL) com uma loot table de sementes. "Jardim seco" como bloco raro que aparece com a tempestade de areia (script coloca 1 bloco perto do jogador a cada X tempestades). | Alta | Baixo | — |
| Árvores de fruta | 22 árvores; fruta pendurada que regenera | Fruta como bloco custom pendurado em folha custom, com `onRandomTick` e colheita por clique. No deserto: **tamareira**, **coqueiro** e **limoeiro** combinam. | Média | Baixo–Médio (muitos blocos com tick) | Arbusto de fruta de 1 bloco (como a fruta de cacto) |
| Comidas | ~40 pratos (seção 3.5) | `minecraft:food` (`nutrition`, `saturation_modifier`, `using_converts_to: "minecraft:bowl"` para sopas). Valores sugeridos: arredondar a "Fome 1.12" ÷ 2, entre a 1.12 e o "No CL", porque o mundo já é duro. | Alta | Baixo | — |
| Sucos hidratam (integração com a sede) | (não existe no HC/EM 1.1.63) | Em `itemCompleteUse`: suco de fruta de cacto +4 de sede (escala 20) e −0,05 °C. Sopas +1 de sede. **Recomendado**: amarra comida e água. | Alta | Baixo | — |
| Sal a partir de água; água fresca | Panela + água → sal | No deserto **sem água**: sal a partir de **água salgada** (panela-estação + garrafa salgada → sal + garrafa vazia). Dá uso à água "imprópria". | Alta | Baixo | — |
| Spice of Life (do CL, não do HC) | Últimas 20 refeições; comida repetida rende menos | Lista circular em `dynamicProperty` (string JSON, 20 IDs). Em `itemCompleteUse`, se o mesmo item aparece ≥ 3 vezes, aplicar `hunger` curto para "anular" parte do ganho. | Média | Baixo | Omitir |

---

## 4. Resumo do que o Crash Landing configurou (e o que não se achou)

**Confirmado:**
- **EnviroMine 1.1.63**, **Hunger Overhaul 2l-build4**, **HarvestCraft 1.1.4**, **Ex Nihilo 1.29e** [CL-wiki];
- dificuldade **Hardcore**, com respawn por Sync [CL-wiki];
- **toda fonte de água é salgada** [CL-fórum, Iskandar];
- sem água infinita;
- garrafa + terra = suja → fornalha = limpa [CL-fórum];
- o Camel Pack só aceita água limpa (coerente com o código);
- sementes do HarvestCraft vêm da **peneira** e das quests; as vanilla foram removidas [CL-fórum];
- **Spice of Life** ativo (histórico de 20 refeições) [CL-fórum];
- "vários blocos com propriedades do EnviroMine" (beta 1.0.3) [CL-fórum].

**Não encontrado:**
- os arquivos de config do CL (multiplicadores do EM, propriedades custom de blocos e armaduras, config do HO);
- os valores de comida do HarvestCraft 1.6.4.

---

## 5. Fontes

- Código EnviroMine (1.1.63 → commit `dcd5f9a`; master 1.7.10) e README da licença: https://github.com/EnviroMine/EnviroMine-1.7
  - Commit da 1.1.63: https://github.com/EnviroMine/EnviroMine-1.7/commit/dcd5f9a
- Wiki EnviroMine (Temperature, Hydration, Sanity, Air-Quality, Physics, Water-Bottles, Camel-Pack, Respirator, Gas): https://github.com/EnviroMine/EnviroMine-1.7/wiki
  - Camel Pack: https://github.com/EnviroMine/EnviroMine-1.7/wiki/Camel-Pack
- Código Hunger Overhaul (história completa; commit 1.6.X-2l `38bed78`): https://github.com/squeek502/HungerOverhaul
  - https://github.com/squeek502/HungerOverhaul/commit/38bed78
- Hunger Overhaul no CurseForge (sem licença declarada encontrada): https://www.curseforge.com/minecraft/mc-mods/hunger-overhaul
- Forks com licença própria (só contexto): https://moddex.gg/mod/hunger-overhauled , https://moddex.gg/mod/actionhunger
- Código HarvestCraft 1.12 (receitas e valores de referência): https://github.com/MatrexsVigil/harvestcraft
- Licença do HarvestCraft (cópias de terceiros): https://www.modpackindex.com/mod/2143/pams-harvestcraft , https://www.curseforge.com/minecraft/mc-mods/pams-harvestcraft
- Fórum Pam's Mods 1.6.x (lista de utensílios, 1.6.4 v1.1.4): https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1274678-1-6-x-1-5-2-others-pams-mods-feb-9th-im-back
- Wikis HarvestCraft:
  - https://harvestcraftmod.fandom.com/wiki/Garden
  - https://harvestcraftmod.fandom.com/wiki/Cooking_Utensils
  - https://harvestcraftmod.fandom.com/wiki/Hamburger
  - https://ftb.fandom.com/wiki/Desert_Garden
  - https://ftb.fandom.com/wiki/Pot_(Pam%27s_HarvestCraft)
  - https://ftb.fandom.com/wiki/Mortar_and_Pestle
  - https://ftb.fandom.com/wiki/Getting_Started_(Pam's_HarvestCraft)
  - https://wiki.gtnewhorizons.com/wiki/Garden
- Pastebin de receitas (versão desconhecida, não confirmado): https://pastebin.com/VUXsDBDU
- Crash Landing:
  - FTB Wiki: https://ftb.fandom.com/wiki/Crash_Landing
  - Tópico oficial: https://forum.feed-the-beast.com/threads/1-6-4-crash-landing-hardcore-hqm-version-1-1-x-beta-stable.46277/
  - Ajuda e discussão: https://forum.feed-the-beast.com/threads/crash-landing-help-venting-and-discussion.50255/
  - Comida: https://forum.feed-the-beast.com/threads/crash-landing-food.50389/
  - Outros tópicos: https://forum.feed-the-beast.com/threads/crash-landing.48228/page-2 , https://forum.feed-the-beast.com/threads/seeds-for-wheat-in-crash-landing.51532/
  - Review de 2017: https://chriselison.uk/minecraft/2017/11/my-favourite-minecraft-modpacks/
  - Modpack Index: https://www.modpackindex.com/modpack/20156/crash-landing
- EnviroMine (listagens):
  - https://www.modpackindex.com/mod/1274/enviromine
  - https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1293048-enviromine-discontinued-a-little-bit-of-realism?page=116

> **Observação de método:** o acesso direto às páginas (ftbwiki, fandom, CurseForge, pastebin) estava bloqueado neste ambiente. As informações dessas páginas vieram de resumos de busca, e são as menos confiáveis aqui. Os repositórios do GitHub foram clonados e lidos por inteiro: os números marcados [EM-código] e [HO-código] são leitura direta do código.

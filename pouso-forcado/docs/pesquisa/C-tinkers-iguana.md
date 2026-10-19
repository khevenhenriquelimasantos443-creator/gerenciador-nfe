# Pesquisa C — Tinkers' Construct (1.6.4) + Iguana Tweaks for Tinkers (1.6.4)

Recriando as **mecânicas** no add-on Bedrock "Pouso Forçado" (Script API `@minecraft/server` 2.x + `@minecraft/server-ui`).

## Metodologia e confiabilidade

- **Os números foram tirados do código-fonte oficial**, não de wikis:
  - Tinkers' Construct, branch `1.6.4` do repositório SlimeKnights (commit `109741b`, versão interna `1.6.X_1.5.5.8`, Forge 9.11.1.964).
  - Iguana Tweaks 1.6.4 original de iguana_man (`github.com/iguanaman/iguanatweakstconstruct`, commit `7868e94`, de janeiro de 2014). A última versão marcada no histórico é a "1p".
- Os dois repositórios foram clonados e lidos. Todo número abaixo tem a referência `arquivo:linha` (links na seção Fontes).
- **ftbwiki.org, ftb.fandom.com, tinkers-construct.fandom.com, CurseForge e minecraftforum ficaram bloqueados** pelo proxy desta sessão. Deles só vieram trechos de resultados de busca, usados apenas para o contexto do Crash Landing.
- **"Material unit"**: no TC 1.6.4 o custo de um padrão é contado em **meias-unidades**. O comentário do código diz "2 for full material, 1 for half". Assim, custo 2 = 1 lingote/tábua/sílex = 144 mB, e custo 1 = meio lingote = 72 mB. Na fundição: `mB = custo × 144 / 2` (TContent.java:1729).
- **Velocidade de mineração**: no código vale `miningspeed/100`. Por exemplo, 600 = 6,0, o mesmo valor do digger de uma ferramenta de ferro vanilla.

---

## 1. Tinkers' Construct (1.6.4, série 1.5.x)

### 1.1 Licença

| Item | Licença (README do branch 1.6.4) | Pode reaproveitar? |
|---|---|---|
| Código | "Most code is public domain under **Creative Commons 0**" | Sim, sem obrigação de crédito. Dar crédito é educado. |
| Texturas e binários | "Textures and binaries are licensed under **Creative Commons 3** (CC BY 3.0)" | **Sim, com atribuição.** Exemplo de crédito: "Texturas de Tinkers' Construct © SlimeKnights, CC BY 3.0", com link. Se alterar, indique que alterou. |
| Exceções | "Any alternate licenses are noted where appropriate". Por exemplo, `textures/items/Credits.txt` diz "Thaumium tool parts by NekoGloop". | Evite as texturas de Thaumium, ou dê crédito específico. |
| Versões modernas | O branch atual (1.19.2) usa **MIT** ("Copyright (c) 2022 SlimeKnights"). | O 1.6.4 **não** era MIT: o código era CC0 e as texturas CC BY 3.0. |

As texturas do 1.6.4 já vêm separadas **por peça e por material** (`resources/assets/tinker/textures/items/...`, 16×16). Isso combina com a abordagem de "um tipo de item por peça×material" no Bedrock.

### 1.2 Mesas, blocos e receitas (TContent.java:1205-1245, 1385-1400)

| Bloco | Receita | Função |
|---|---|---|
| Blank Pattern (padrão em branco) | `ps / sp` (2 tábuas + 2 gravetos) | Base de todos os padrões. O Iguana adiciona a receita de 4 gravetos em quadrado. |
| **Stencil Table** (Pattern Shaper) | Blank pattern sobre tábua | Transforma o padrão em branco em um padrão específico (escolhido na GUI). |
| **Part Builder** | Blank pattern sobre tronco | Padrão + material não-metálico → peça. Por padrão, metais **não** são feitos aqui: `craftMetalTools=false` (PHConstruct.java:62). |
| **Tool Station** | Blank pattern sobre crafting table | Monta ferramentas de 2 a 3 peças, aplica modificadores, conserta e renomeia. |
| **Pattern Chest** | Blank pattern sobre baú | Guarda padrões. |
| **Tool Forge** | `bbb / msm / m m` (b = bloco de seared brick, s = Tool Station, m = bloco de metal: ferro, ouro, diamante, esmeralda, cobalto, ardite, manyullyn, cobre, bronze, estanho, alumínio, latão de alumínio, alumite ou aço) | Tudo o que a Tool Station faz, mais as ferramentas de 4 peças (martelo, escavadeira, machado de lenhador, machado de batalha, cutelo, foice). |

### 1.3 Padrões, custo de material por peça e ferramentas (Pattern.java:79-140, TContent.java:1558-1612)

Na coluna "mB" o custo está em meias-unidades. O valor de fundição é custo × 72 mB.

| meta | Padrão / peça | Custo TC | mB (fundição) | Custo **Iguana** (só padrão de madeira) |
|---|---|---|---|---|
| 1 | Tool Rod (cabo) | 1 | 72 | 1 |
| 2 | Pickaxe Head | 2 | 144 | **6** |
| 3 | Shovel Head | 2 | 144 | 2 |
| 4 | Axe Head (hatchet) | 2 | 144 | **4** |
| 5 | Sword Blade | 2 | 144 | **4** |
| 6 | Wide Guard | 1 | 72 | 1 |
| 7 | Hand Guard | 1 | 72 | 1 |
| 8 | Crossbar | 1 | 72 | 1 |
| 9 | Binding (ligação) | 1 | 72 | 1 |
| 10 | Frying Pan head | 2 | 144 | 6 |
| 11 | Sign head | 2 | 144 | 6 |
| 12 | Knife Blade | 1 | 72 | 1 |
| 13 | Chisel head | 1 | 72 | 1 |
| 14 | Tough Rod | 6 | 432 | 6 |
| 15 | Tough Binding | 6 | 432 | 6 |
| 16 | Large (Heavy) Plate | 16 | 1152 | 16 |
| 17 | Broad Axe Head | 16 | 1152 | 16 |
| 18 | Scythe Blade | 16 | 1152 | 16 |
| 19 | Excavator Head | 16 | 1152 | 16 |
| 20 | Large Sword Blade | 16 | 1152 | 16 |
| 21 | Hammer Head | 16 | 1152 | 16 |
| 22 | Full Guard | 6 | 432 | 6 |
| 23 | Bowstring | 6 | — | 6 |
| 24 | Fletching | 2 | — | 2 |
| 25 | Arrowhead | 2 | 144 | 2 |

**Valor dos materiais no Part Builder** (TContent.java:1137-1183): 1 tábua, pedra ou pedregulho, sílex, cacto, osso, obsidiana, netherrack, slime ou papel = 2 meias-unidades (1 unidade). Graveto e "shard" (lasca) = meia unidade.

**Receitas de ferramenta (Tool Station / Forge)** (TContent.java:1590-1612). A coluna "Base atk" é o `super(id, X)` de cada classe:

| Ferramenta | Peças | Base atk | Durab. mult. | Obs. |
|---|---|---|---|---|
| Picareta | Pickaxe Head + Tool Rod + Binding | +1 | 1,0 | Velocidade e nível de mineração vêm **só da cabeça**. |
| Pá | Shovel Head + Rod | +2 | 1,0 | |
| Machadinha | Axe Head + Rod | +3 | 1,0 | |
| Broadsword (espada) | Sword Blade + Rod + Wide Guard | +4 | **1,2** | |
| Longsword | Blade + Rod + Hand Guard | +4 | 1,0 | |
| Rapier | Blade + Rod + Crossbar | +2 | 0,7 | |
| Cutlass | Blade + Rod + Full Guard | +4 | 1,0 | |
| Dagger | Knife Blade + Rod + Crossbar | +1 | 1,0 | |
| Mattock | Axe Head + Rod + Shovel Head | +3 | 1,0 | 2 cabeças |
| Frying Pan / Battlesign / Chisel | cabeça + Rod | +2 / +1 / 0 | 1,0 | |
| **Forge:** Hammer (3×3) | Hammer Head + Tough Rod + 2 Large Plates | +2 | 4,5 | velocidade ×0,4 |
| Excavator | Excavator Head + Tough Rod + Large Plate + Tough Binding | +2 | 2,75 | velocidade ×0,4 |
| Lumber Axe | Broad Axe Head + Tough Rod + Large Plate + Tough Binding | 0 | 2,5 | velocidade ×0,4 |
| Battleaxe | Broad Axe Head + Tough Rod + Broad Axe Head + Tough Binding | +4 | 2,5 | |
| Cleaver | Large Blade + Tough Rod + Large Plate + Tough Rod | +5 | 2,5 | |
| Scythe | Scythe Blade + Tough Rod + Tough Binding + Tough Rod | +4 | 3,0 | |
| Shortbow / Arrow | Rod + Bowstring + Rod / Arrowhead + Rod + Fletching | — | — | |

**Fórmulas** (ToolBuilder.java:215-335, HarvestTool.java:85-115, AbilityHelper.java:73-90):

- **Durabilidade** = `soma(durab. das "cabeças") / nCabeças × (0,5 + nCabeças × 0,5) × modCabo × multFerramenta`.
  - `modCabo` é o *handle modifier* do material do cabo. Se houver várias peças tipo "cabo", entra a média com o fator (0,5 + n × 0,5) / n.
  - Exemplo: picareta de ferro com cabo de madeira = 250 × 1,0 = **250**. Picareta de cobalto com cabo de manyullyn = 800 × 2,5 = **2000**.
- **Velocidade** = média de `MiningSpeed` das cabeças / 100 × modFerramenta + bônus stonebound. Se o nível de mineração do bloco for maior que o da ferramenta, a velocidade cai para **0,1** e o bloco não é coletado.
- **Ataque** = média do ataque das cabeças + base da ferramenta. Dano do golpe = `Attack + 1 + atributo do jogador` (≈ Attack + 2 HP no 1.6.4).
- **Nível de mineração** = o do material da cabeça (`HarvestLevel`). Nomes no TC: 0 Stone, 1 Iron, 2 Redstone, 3 Obsidian, 4 Cobalt, 5 Manyullyn (en_US.lang:712-717).
- **Ferramenta quebrada** não some: vira `Broken` (velocidade 0,1, não ataca) até ser consertada (AbilityHelper.java:365-390).

### 1.4 Materiais e stats (TContent.java:1065-1083)

Assinatura: `id, nome, nível, durabilidade, velocidade×100, ataque, modCabo, reinforced, stonebound, habilidade`.

| Material | Nível | Durab. | Veloc. | Ataque | Mod. cabo | Reinforced | Stonebound/Jagged | Habilidade |
|---|---|---|---|---|---|---|---|---|
| Madeira | 0 | 59 | 2,0 | 0 | 1,0 | 0 | 0 | — |
| Pedra | 1 | 131 | 4,0 | 1 | 0,5 | 0 | +1 | Stonebound |
| Ferro | 2 | 250 | 6,0 | 2 | 1,3 | 1 | 0 | — |
| Sílex | 1 | 171 | 5,25 | 2 | 0,7 | 0 | 0 | — |
| Cacto | 1 | 150 | 5,0 | 2 | 1,0 | 0 | −1 | Jagged |
| Osso | 1 | 200 | 4,0 | 1 | 1,0 | 0 | 0 | — |
| Obsidiana | 3 | 89 | 7,0 | 2 | 0,8 | 3 | 0 | — |
| Netherrack | 2 | 131 | 4,0 | 1 | 1,2 | 0 | +1 | Stonebound |
| Slime (verde) | 0 | 500 | 1,5 | 0 | 1,5 | 0 | 0 | — |
| Papel | 0 | 30 | 2,0 | 0 | 0,3 | 0 | 0 | Writable (+1 slot de modificador por peça de papel) |
| Cobalto | 4 | 800 | 11,0 | 3 | 1,75 | 2 | 0 | — |
| Ardite | 4 | 600 | 8,0 | 3 | 2,0 | 0 | +2 | Stonebound |
| Manyullyn | 5 | 1200 | 9,0 | 4 | 2,5 | 0 | 0 | — |
| Cobre | 1 | 180 | 5,0 | 2 | 1,15 | 0 | 0 | — |
| Bronze | 2 | 350 | 7,0 | 2 | 1,3 | 1 | 0 | — |
| Alumite | 4 | 550 | 8,0 | 3 | 1,3 | 2 | 0 | — |
| Aço | 4 | 750 | 8,0 | 3 | 1,3 | 2 | 0 | — |
| Blue Slime | 0 | 1200 | 1,5 | 0 | 2,0 | 0 | 0 | — |
| Pig Iron | 3 | 250 | 6,0 | 2 | 1,3 | 1 | 0 | Tasty |

**Traços** (AbilityHelper.java:56-90, 202-285; HarvestTool.java:105-112; ToolBuilder.java:473-525):

- **Stonebound / Jagged ("Shoddy")**: o valor é a **média** do stonebound das peças. A ferramenta acumula dano `D` e o efeito escala com `b = ln(D/72 + 1) × 2 × shoddy`:
  - a velocidade **soma** `b`;
  - o ataque **subtrai** `b`.
  - Com valor positivo (stonebound: pedra, netherrack, ardite), a ferramenta fica mais rápida e mais fraca conforme se desgasta.
  - Com valor negativo (jagged: cacto), fica mais forte e mais lenta.
- **Reinforced**: vale o **maior** valor entre as peças. Cada uso tem chance `reinforced/10` de **não** perder durabilidade (`random.nextInt(10) < 10 − reinforced`).
- **Writable (papel)**: +1 slot de modificador por peça de papel. Cabeça de papel em ferramenta sem acessório dá +2.
- **Slots de modificador**: **3** em toda ferramenta (ToolCore.java:110-113).

**Modificadores** (TContent.java:1615-1670, `modifiers/tools/*.java`). Cada um gasta 1 slot, salvo indicação:

| Modificador | Item | Efeito / limite |
|---|---|---|
| Diamante | 1 diamante | +500 durabilidade; sobe o nível de mineração para 3 (obsidiana) se for menor. |
| Esmeralda | 1 esmeralda | +50% de durabilidade; sobe o nível para 2 se for menor. |
| Redstone (Haste) | redstone (1) ou bloco (9) | Até 50 por slot. Cada redstone dá +8 de MiningSpeed (+0,08); o bônus cresce 2 a cada 50 já aplicados (`boost = 8 + ((n−1)/50) × 2`). |
| Lápis (Luck) | lápis (1) ou bloco (9) | Máximo **450 no total**, um único slot. Fortuna/Looting I com 100, II com 300, III com 450. Ganha lápis aleatoriamente ao minerar. |
| Quartzo (Sharpness) | quartzo (1) ou bloco (4) | Até 72 por slot; **+1 de ataque a cada 24**. |
| Ball of Moss (Auto-Repair) | moss | Por tick: chance `nível×3 / 350` (céu aberto) ou `/1150` (fechado) de curar 1. Dá ≈ 0,17 ou 0,05 de durabilidade/s por nível (TActiveOmniMod.java:37-43). |
| Blaze Powder (Fiery) | blaze powder | Até 25 por slot. Fogo de `fiery/5 + 1` s. |
| Lava Crystal | lava crystal | Auto-smelt: drops de forno, com fortuna. |
| Necrotic Bone | osso necrótico | Life steal: cura `random(0..2×nível)`. |
| Piston (Knockback) | pistão | +0,1 por pistão, até 10. |
| Beheading | obsidiana + ender pearl | Chance de soltar cabeça. |
| Smite / Anti-Spider | consecrated soil (até 36) / olho de aranha fermentado (até 4) | Dano extra contra mortos-vivos / artrópodes. |
| Silky Jewel | silky jewel | Silk touch. Reduz ataque e velocidade. |
| Reinforced | Large Plate de obsidiana | +1 reinforced. |
| Slot extra | diamante + bloco de ouro (Tier1); bloco de diamante + maçã encantada (Tier1.5); nether star (Tier2) | +1 slot (não gasta slot). |

**Conserto** (ModRepair.java:70-96). Feito com o material da cabeça na Tool Station:

- `cura = (50 × itens + BaseDurability × 0,4 × valorMaterial) × fMod × fReparo / custoReparo`.
- `fMod` depende dos slots livres: 1,0 se ≥3, 0,9 se 2, 0,8 se 1, 0,7 se 0.
- `fReparo = max(0,5; (100 − nº de consertos)/100)`.
- `custoReparo` vale 4 para lumber axe, battleaxe, cleaver, excavator e scythe; 1 para as demais.

### 1.5 Smeltery (SmelteryLogic.java, TConstruct.java:69-73)

**Estrutura** (`checkSameLevel` / `recurse*` / `validateBottom`, SmelteryLogic.java:756-920):

- Interior **fixo de 3×3** de ar em cada camada.
- Anel de **12 blocos** por camada: os 3 de cada lado de um quadrado 5×5, **cantos dispensados**. Valem seared bricks, controlador, drain, seared tank, seared glass ou window.
- **Piso 3×3 de seared bricks** (meta ≥ 2: o controlador e o drain não servem de piso).
- **Pelo menos 1 seared tank** nas paredes, com lava.
- Empilhável em **N camadas**. Cada camada dá **9 slots de item** e **20.000 mB** de capacidade (`maxLiquid = 20000 × layers`, linha 93).
- Tamanhos livres até 7×7/11×11 só apareceram no TC 1.7.x. Os resultados de busca confirmam o "5×5 com base 3×3" para versões antigas.

**Temperatura e combustível:**

- Com a estrutura válida, `internalTemp = 900` (fixo).
- Cada item aquece **+1 a cada 4 ticks (+5 °/s)**, partindo de 20, até a temperatura de fusão. O tempo ≈ `(Tfusão − 20)/5` s **por slot, com os slots em paralelo**:
  - minério de ferro (600) ≈ 116 s;
  - ouro e estanho (400) ≈ 76 s;
  - cobre (550) ≈ 106 s.
  - Valor derivado do código; não foi medido em jogo.
- O combustível vem do tank ativo, que retira **150 mB de lava** por vez (linhas 585-590). O consumo é de **3 unidades por segundo** só enquanto há item derretendo. Resultado: 150 mB ≈ 50 s, e **1 balde ≈ 333 s (5,5 min)**.
- Seared Tank comporta **4.000 mB** (LavaTankLogic.java:24).

**Temperaturas de fusão** (FluidType.java):

| Metal | °C | Metal | °C |
|---|---|---|---|
| Ferro | 600 | Bronze | 500 |
| Ouro | 400 | Aço | 700 |
| Estanho | 400 | Alumite | 800 |
| Cobre | 550 | Manyullyn | 750 |
| Alumínio | 350 | Obsidiana | 750 (bloco: 800) |
| Cobalto | 650 | Pedra | 800 |
| Ardite | 650 | Vidro | 625 |
| Esmeralda | 575 | | |

**Quantidades** (TConstruct.java:69-73, TContent.java:1837-1911):

| Forma | mB |
|---|---|
| Lingote | **144** |
| Bloco | **1296** |
| **Minério** | **288 (dobra)** |
| Nugget | 16 |
| Shard | 72 |
| Pedra ou pedregulho | 8 |
| Areia ou vidro | 1000 de vidro |
| Esmeralda | 640 |
| Balde de ferro | 432 (3 lingotes) |

**Ligas** (TContent.java:1815-1825, padrões de PHConstruct.java:75-79):

| Liga | Proporção → saída |
|---|---|
| Bronze | 3 cobre + 1 estanho → **4** |
| Aluminum Brass | 3 alumínio + 1 cobre → **4** |
| Alumite | 5 alumínio + 2 ferro + 2 obsidiana → **3** |
| Manyullyn | 1 cobalto + 1 ardite → **1** |
| Pig Iron | 144 ferro + 640 esmeralda + 80 sangue → 144 |
| Obsidiana líquida | 1000 lava + 1000 água → **288** |

As saídas de bronze, latão, alumite, manyullyn e pig iron são configuráveis.

**Blocos de fundição:**

- Seared brick = **grout** assado no forno. Grout: 1 argila + 1 areia + 1 cascalho → 2 grout; ou 1 bloco de argila + 4 areia + 4 cascalho → 8 grout.
- Custo em seared bricks de cada bloco: Controller 8 (anel), Drain 6, Bloco de seared bricks 4, Tank 8 + vidro, Seared Glass 4 + 5 vidros, Window 6 + 3 vidros, Casting Table 7, Faucet 3, Casting Basin 7, Channel 5 (faz 4).
- Drain + Faucet levam o metal à **Casting Table** (lingote, peças, moldes) ou à **Casting Basin** (blocos de 1296 mB).
- A moldagem leva **50 ticks (2,5 s)**.
- **Moldes (casts)**: derrama-se **144 mB de aluminum brass** ou **288 mB de ouro** sobre uma peça ou lingote. O molde gerado faz a peça metálica com custo × 72 mB.
- Peças, padrões e ferramentas podem ser derretidos de volta: peças de pedra viram pedra líquida (TContent.java:1729-1835).

### 1.6 Tabela de viabilidade — Tinkers' Construct → Bedrock

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Blank Pattern + Stencil Table | 2 tábuas + 2 gravetos; stencil = pattern sobre tábua | Item `cl:pattern_blank` (receita normal). A Stencil Table é um bloco custom: interagir com o padrão em branco na mão abre um `ActionFormData` com os padrões, consome o branco e entrega `cl:pattern_<tipo>`. | Alta | Baixo | — |
| Part Builder | padrão + material (custos da §1.3) | Bloco custom. O jogador segura o padrão; o script lê o material num **barril vanilla adjacente** (`block.getComponent('minecraft:inventory').container`) ou no slot seguinte da hotbar, consome `custo/2` itens (meia unidade = shard) e entrega `cl:part_<peça>_<material>`. | Alta | Baixo | Receitas comuns de crafting (sem padrão), como o "easyPartCrafting" do Iguana. O padrão não volta porque o Bedrock não devolve item-container em receitas. |
| Peças por material (item por peça×material) | ~8 peças úteis × ~15 materiais | Um tipo de item por peça×material (≈ 100 itens), reaproveitando as texturas do TC 1.6.4 (CC BY 3.0, com crédito). | Alta | Baixo (só assets) | Restringir às peças das ferramentas escolhidas. |
| Tool Station (montar) | cabeça + cabo (+ ligação) | Bloco custom. O script valida as peças no barril/hotbar e cria **um tipo de item por (ferramenta × material da cabeça)**: o JSON fixa `minecraft:digger` (velocidade da cabeça/100), `minecraft:damage` (Attack + 1) e as tags de tier. Cabo e ligação vão em **dynamic properties** (`handle`, `binding`, `maxDur`, `dmg`, `reinf`, `shoddy`, `mods`) e no **lore**. | Alta | Baixo | Ferramentas pré-definidas (combinações fixas) se o número de itens explodir. |
| Combinação livre de materiais (cabeça×cabo×ligação) | 19³ combinações | Inviável como tipos de item. No TC a picareta usa velocidade e nível **só da cabeça**, então item por cabeça + props para o resto reproduz o original quase exatamente. Só o ícone não mostra o cabo. | Média | Baixo | Mostrar o cabo e a ligação no nome/lore (`§7Cabo: Osso`). |
| Durabilidade por fórmula (cabo multiplica) | `durCabeça × modCabo × multFerramenta` | **Durabilidade virtual**: `minecraft:durability` com max fixo (ex.: 1000) usado só como barra. A durabilidade real fica em `dmg/maxDur` (dynamic property). Em `afterEvents.playerBreakBlock` e `entityHitEntity` o script soma 1 e reescreve `durability.damage = round(dmg/maxDur×999)`. | Alta | Baixo | — |
| Ferramenta "Broken" (não some) | velocidade 0,1, sem ataque | Com `dmg ≥ maxDur`: marcar `broken`, cancelar quebra em `beforeEvents.playerBreakBlock` (`ev.cancel = true`) e anular o dano. Nunca deixar o motor zerar a barra. | Alta | Baixo | — |
| Velocidade de mineração por material | 2,0 / 4,0 / 5,25 / 6,0 / 7,0 / 8,0 / 9,0 / 11,0 | Fixa no JSON (`minecraft:digger`, lista de blocos e tags com `speed`). Na prática a velocidade efetiva do Bedrock não é linear; calibrar com testes. | Alta | Baixo | — |
| Nível de mineração | 0-5 (TC) / 0-8 (Iguana) | `world.beforeEvents.playerBreakBlock`: se `nivelBloco > nivelFerramenta`, `ev.cancel = true` + aviso na actionbar. Tabela `blockId → nível` no script. Também dar ao item as tags vanilla `minecraft:is_pickaxe` e de tier, para os drops vanilla funcionarem (verificar na versão alvo). | Alta | Baixo | — |
| Stonebound / Jagged | `ln(D/72+1)×2×shoddy` em velocidade e ataque | Ataque: `entityHitEntity` → `alvo.applyDamage(extra)`. Como não dá para aplicar dano negativo, o `minecraft:damage` do JSON fica no valor mínimo (o do stonebound gasto) e o script só soma o bônus positivo. Velocidade: efeito **Haste** (ou Mining Fatigue para jagged) aplicado enquanto a ferramenta está na mão, em nível proporcional a `b`. | Média | Baixo-Médio (`runInterval` de 10-20 ticks) | Simplificar: stonebound = +1 nível de Haste quando passa de 50% de desgaste. |
| Reinforced | chance `r/10` de não gastar | Na durabilidade virtual: `if (Math.random()*10 < r) não incrementa`. | Alta | Baixo | — |
| 3 slots de modificador (+1 por peça de papel) | 3 base | Dynamic property `mods`. | Alta | Baixo | — |
| Redstone (velocidade) | +8/redstone, 50 por slot | Digger fixo, então: **Haste** enquanto segura (nível 1 a cada 50 redstone) **ou** variante de item "+haste". | Média | Baixo | Haste por script (mais simples). |
| Lápis (sorte) | 100/300/450 → Fortuna/Looting I/II/III | Item com `minecraft:enchantable` (slot pickaxe/sword) + `ItemEnchantableComponent.addEnchantment({type:'fortune', level})`. Confirmar disponibilidade no 2.x estável. | Alta | Baixo | Drops extras por script em `playerBreakBlock` (spawnItem) se o componente não estiver disponível. |
| Quartzo (dano) | +1 ataque / 24 quartzos (máx. 72 por slot) | `entityHitEntity` → `alvo.applyDamage(bonus, {cause:'entityAttack', damagingEntity: player})`. | Alta | Baixo | — |
| Diamante / Esmeralda | +500 durab. / +50%; nível 3 / 2 | Altera `maxDur` e `level` nas props. | Alta | Baixo | — |
| Moss (auto-reparo) | ≈ 0,17 durab./s por nível ao céu aberto, 0,05 fechado | `system.runInterval` (20 ticks) percorrendo os inventários dos jogadores. Para itens com `moss`, cura binomial (`dimension.getSkyLightLevel`/`getTopmostBlock` para decidir "céu aberto"). | Alta | Médio (varrer 36 slots/s por jogador; dá para limitar à hotbar) | Curar só o item na mão. |
| Fiery, Life Steal, Smite, Anti-Spider, Knockback, Beheading | ver §1.4 | `entityHitEntity` / `entityHurt` / `entityDie`: `setOnFire(s)`, curar via `minecraft:health.setCurrentValue`, `entity.matches({families:['undead']})`, `applyKnockback`, spawnItem de cabeça. | Alta | Baixo | — |
| Auto-smelt (lava crystal) | drops de forno | `beforeEvents.playerBreakBlock`: cancelar, depois em `system.run` trocar para ar e `spawnItem` do resultado fundido (tabela própria). | Média | Baixo | — |
| Silk touch (silky jewel) | — | `addEnchantment('silk_touch')`. | Alta | Baixo | — |
| Conserto na Tool Station | fórmula da §1.4 | Bloco Tool Station: segurar a ferramenta, material no barril adjacente, menu "Consertar (X itens)". | Alta | Baixo | — |
| Tool Forge + ferramentas de 4 peças | receita da §1.2; martelo 3×3, escavadeira, lumber axe | Multibloco simples ou bloco único. Martelo: em `afterEvents.playerBreakBlock` quebrar os 8 vizinhos no plano da face, com `dimension.runCommand('setblock x y z air destroy')` para gerar drops. Respeitar o nível de cada bloco. | Média | Médio (8 comandos por quebra) | Lançar só martelo e escavadeira; lumber axe com limite de 64 troncos. |
| Smeltery multibloco | anel de 12 por camada, piso 3×3, tank obrigatório | Blocos custom (`cl:seared_bricks`, `controller`, `tank`, `drain`). Validação por script **apenas** ao colocar/quebrar/interagir com o controlador (lê 9 + 12×N + 9 blocos). Estado em **world dynamic property** com chave `smeltery:x,y,z,dim` (JSON). | Alta | Baixo (validar só em eventos) | — |
| Inserir itens / GUI de 9 slots por camada | 9 × camadas | Sem GUI de container: (a) **jogar itens no interior**: a cada 20 ticks o script lê `dimension.getEntities({type:'item', location, volume})` dentro do 3×3 e consome; (b) barril vanilla acoplado como "funil"; (c) interagir com o controlador segurando o minério. Conteúdo mostrado em `ActionFormData` e na actionbar. | Alta | Baixo-Médio | — |
| Temperatura por slot | +5 °/s; Tfusão por metal | Contador por slot no JSON do controlador, avançado a cada 20 ticks (+100 por segundo de jogo = 5 °/s × 20). | Alta | Baixo | Tempo fixo por metal (ex.: ferro 116 s, ou acelerado para o celular). |
| Combustível lava | 150 mB por vez; 1 balde ≈ 333 s | Seared Tank custom com estados `level` 0-4 (baldes). Interagir com balde de lava → +1000 mB (devolve balde vazio). O script desconta `useTime`. | Alta | Baixo | — |
| Metal líquido (fluidos) | 144/1296/288 mB | **Bedrock não tem fluidos custom.** O metal é só um número (mB por fluido) no estado do controlador. Visual: bloco decorativo `cl:molten_<metal>` (não sólido, com permutação de altura) preenchendo o interior. | Média | Baixo | Só UI (barra no menu/actionbar). |
| Ligas | 3:1→4 (bronze), 1:1→1 (manyullyn), etc. | `mixMetals` por proporção a cada tick do smeltery, como no TC. | Alta | Baixo | — |
| Drain + Faucet + Casting Table/Basin | 144 mB / 1296 mB; 50 ticks | Faucet custom: ao interagir (ou com sinal de redstone), transfere o metal do fundo do smeltery para a mesa/bacia abaixo. Mesa com estados `cast=<tipo>`, `fill` e `metal`; após 50 ticks de timer, troca para o estado "pronto" e o jogador retira com interação (spawnItem). | Média | Baixo | Controlador com menu "Fundir lingote/bloco/peça" entregando direto no inventário. |
| Moldes (casts) | 144 mB de latão ou 288 mB de ouro sobre a peça | Mesmo fluxo da mesa: peça na mesa + metal → `cl:cast_<peça>`. | Alta | Baixo | — |
| Minério dobra | 1 minério = 288 mB = 2 lingotes | Tabela de fusão no script. | Alta | Baixo | — |
| Derreter ferramentas/peças de volta | custo × 72 mB | Tabela de fusão para itens `cl:part_*` e baldes/portas vanilla. | Alta | Baixo | — |

---

## 2. Iguana Tweaks for Tinkers (1.6.4, iguana_man)

### 2.1 Licença

- O repositório original `iguanaman/iguanatweakstconstruct` (1.6.4) **não tem arquivo de licença** nem menção no `mcmod.info`.
- O port 1.7.10 (`SlimeKnights/IguanaTweaksTConstruct`, de boni) também **não tem LICENSE** (404 em master e release).
- **Conclusão: todos os direitos reservados por padrão.**
  - **Não copiar código nem assets** (som `chime.ogg`, texturas de clay bucket e cabeças).
  - **Mecânicas e números não têm proteção autoral** e podem ser reimplementados do zero.
  - Recomendado creditar a inspiração: "inspirado em Iguana Tweaks for Tinkers, de iguana_man".

### 2.2 O que o mod faz (valores padrão do código; IguanaConfig.java)

**a) Materiais rebalanceados** (MaterialTweaks.java):

- A durabilidade é multiplicada por `durabilityPercentage` = **50%** (padrão).
- A velocidade é multiplicada por `miningSpeedPercentage` = 100%.
- Os níveis passam a ter **9 degraus**.

| Material | Nível Iguana | Durab. (×0,5) | Veloc. | Ataque | Mod. cabo | Reinf. | Shoddy |
|---|---|---|---|---|---|---|---|
| Madeira | 0 | 30 | 1,5 | 1 | 1,0 | 0 | 0 |
| Pedra | 0 | 66 | 3,0 | 2 | 0,5 | 0 | +1 |
| Cacto | 0 | 75 | 5,0 | 2 | 1,0 | 0 | −1 |
| Slime | 0 | 250 | 1,0 | 1 | 2,0 | 0 | 0 |
| Blue Slime | 0 | 600 | 1,0 | 1 | 1,5 | 0 | 0 |
| Papel | 0 | 15 | 1,0 | 1 | 0,3 | 0 | 0 |
| Netherrack | 0 | 66 | 4,0 | 3 | 1,2 | 0 | +1 |
| Sílex | **1** | 86 | 4,0 | 2 | 0,5 | 0 | 0 |
| Osso | **1** | 100 | 4,0 | 2 | 1,0 | 0 | 0 |
| Cobre | **2** | 90 | 5,0 | 2 | 1,15 | 0 | 0 |
| Ferro | **3** | 125 | 6,0 | 3 | 1,3 | 1 | 0 |
| Bronze | **4** | 175 | 7,0 | 3 | 1,3 | 1 | 0 |
| Aço | 4 | 200 | 8,0 | 3 | 1,3 | 2 | 0 |
| Pig Iron | 4 | 125 | 6,0 | 3 | 1,3 | 1 | 0 |
| Obsidiana | **5** | 45 | 7,0 | 3 | 0,8 | 3 | 0 |
| Alumite | **5** | 275 | 8,0 | 4 | 1,3 | 2 | 0 |
| Ardite | **6** | 300 | 8,0 | 4 | 2,0 | 0 | +2 |
| Cobalto | **7** | 400 | 11,0 | 4 | 1,75 | 2 | 0 |
| Manyullyn | **8** | 600 | 9,0 | 5 | 2,5 | 0 | 0 |

**b) Restrição de nível de mineração** (HarvestLevelTweaks.java). Vale com `pickaxeBoostRequired=true` (padrão), que soma `boostMod=1` aos blocos de índice > 1:

| Nível exigido | Blocos (ore/block/stone + nome do OreDictionary) | Quem minera (nível do material) |
|---|---|---|
| 0 | pedra, terra etc. | qualquer coisa |
| 1 | carvão, **cobre**, alumínio/bauxita, zinco, aluminum brass, shards | sílex, osso (1) ou mais |
| 3 | **ferro**, pirita, chumbo, prata; bloco de ferro, barras de ferro | ferro (3) **ou cobre com boost** |
| 4 | **estanho**, ouro, lápis, aço, níquel, invar, electrum; bloco de ouro e de lápis | bronze (4) ou ferro com boost |
| 5 | **diamante**, esmeralda, **redstone**, quartzo, **obsidiana**, certus etc.; bloco de diamante | obsidiana/alumite (5) ou bronze com boost |
| 6 | **ardite**, urânio, platina, ósmio | ardite (6) ou obsidiana/alumite com boost |
| 7 | **cobalto**, irídio, titânio | cobalto (7) ou ardite com boost |
| 8 | manyullyn | manyullyn (8) ou cobalto com boost |

- Nomes exibidos: Stone, Copper, Iron, Tin, Diamond, Ardite, Cobalt, Manyullyn (IguanaTweaksTConstruct.java:103-117).
- **Pedra minera só o nível 0**: não pega carvão, cobre nem ferro. Além disso, **ferramentas de pedra são proibidas** (`allowStoneTools=false`): qualquer peça de pedra nega a montagem (IguanaEventHandler.java:239) e as receitas de ferramentas de pedra vanilla são removidas.
- Picaretas vanilla são remapeadas: madeira → nível da madeira (0), pedra → sílex (1), ferro → ferro (3), diamante → obsidiana (5).
- Cascalho-minério (oreGravel) também ganha níveis, com pá.

**c) Ferramentas vanilla** (RemoveVanillaTools.java):

- **Receitas removidas** de picareta, pá, machado e espada de **madeira e pedra**, e removidas do baú bônus.
- As de ferro, ouro e diamante continuam, porém com os níveis remapeados.

**d) Peças restritas por material** (IguanaConfig.java:136-161), aplicadas no Part Builder. Os números são os metas da §1.3:

| Material | **Permitido** (o resto é negado) |
|---|---|
| Madeira | Tool Rod, Shovel Head, Crossbar, Binding, Sign, Knife Blade, Arrowhead (**sem cabeça de picareta, machado ou espada**) |
| Pedra | nada (ferramentas de pedra proibidas) |
| Sílex | **Pickaxe Head**, Shovel Head, Axe Head, Knife Blade, Chisel, Arrowhead |
| Osso | Tool Rod, Shovel Head, Axe Head, Crossbar, Knife Blade, Arrowhead |
| Papel | Tool Rod, Binding, Fletching |
| Slime / Cacto | Tool Rod, Binding |
| Netherrack, Obsidiana | sem restrição |

Resultado: **a primeira picareta é obrigatoriamente de sílex** (cabeça custa **6 meias-unidades = 3 sílex**) com cabo de madeira ou osso.

**Peças metálicas**:

- Continuam só por fundição, porque `craftMetalTools=false` do TC.
- O Iguana **não** altera o custo dos moldes de metal: a troca do `metalPattern` está comentada em IguanaItems.java:152-154. Uma cabeça de picareta de ferro continua custando 144 mB, enquanto a de sílex custa 3 sílex.
- Peças não-metálicas podem ser **reaproveitadas** no Part Builder (VariousTweaks.java).

**e) Tool Leveling** (IguanaLevelingLogic.java, IguanaActiveToolMod.java, IguanaEventHandler.java):

- **Níveis**: 1 Clumsy → 2 Comfortable → 3 Accustomed → 4 Adept → 5 Expert → 6 Master (máximo).
- **Ganho de XP**:
  - Ferramenta: **+1 XP por bloco quebrado**, desde que a ferramenta seja eficaz (`canHarvest` e velocidade > 1).
  - Enxada: +1 por uso.
  - Arma: **XP = dano causado** (HP); contra animais, dano/4.
  - Arco: dano da flecha.
- **XP necessária** para passar do nível L para L+1 = `base × 1,35^(L−1)`, onde `xpPerLevelMultiplier = 1.35`.
  - **Ferramentas**: `base = 100 + (velocidade média das cabeças × 100)/2`. Multiplicadores: machadinha ÷2, pá ×2, mattock ×2,5, lumber axe ×3, martelo ×6, escavadeira ×9.
  - **Armas**: `base = 400` (foice ×1,5).
  - Exemplo, picareta de ferro (veloc. 600): **400 / 540 / 729 / 984 / 1329** XP (total ≈ 3982 blocos). Uma espada usa os mesmos números em HP de dano.
- **Bônus por nível**:
  - Ferramentas novas perdem os 3 slots de modificador (`Modifiers − 3`, com `toolLevelingExtraModifiers=true`).
  - Ganham **+1 slot nos níveis 2, 4 e 6**.
  - A **cada nível** sai 1 bônus aleatório (`toolLevelingRandomBonuses=true`), sorteado `rnd = 0..9`:
    - *Ferramentas*: 0 = Moss (+3 de auto-reparo); 1 = Lápis +100 (só picareta e martelo; nas outras vira redstone); 2-5 = Redstone +50 (+1 "haste"); 6-9 = Reinforced +1.
    - *Armas*: 0 = Moss; 1 = Lápis +100; 2 = Quartzo +30 (+1 ataque); 3 = Beheading +1; 4 = Blaze +25 (fogo); 5 = Necrotic +1 (life steal); 6 = Smite; 7 = Anti-Spider; 8 = Knockback +10 (pistão); 9 = Reinforced +1.
- Ao subir de nível toca um som (chime) e aparece uma mensagem no chat (ex.: "You begin to feel comfortable handling the …").

**f) Pick boost (nível de mineração por XP)**:

- Picaretas e martelos com cabeça de **cobre ou acima**, e abaixo do nível 7, ganham um **"Boost XP"** separado. Vale o mesmo +1 por bloco.
- Ao atingir `(100 + veloc/2) × 1,35^(nívelCabeça − 2)`, a picareta ganha **+1 nível de mineração, uma única vez** (`HarvestLevelModified`).
- Valores: cobre **350**, ferro **540**, bronze **820**, obsidiana **1107**, alumite **1230**, ardite **1661**, cobalto **2915** blocos.
- **Alternativa por cabeça de mob** (`mobHeadPickaxeBoost`, ModifierTweaks.java). Dá +1 nível imediato se o nível atual for > 1 e menor que o teto do item:

| Item | Teto do boost |
|---|---|
| Crânio de esqueleto, cabeça de zumbi | ferro |
| Cabeça de creeper | bronze |
| Cabeça de enderman | obsidiana |
| Crânio de wither skeleton | ardite |
| Nether star | cobalto |

- Cabeças dropam: **5% base + 2% por nível de beheading**. O Iguana adiciona cabeças de enderman, pigman e blaze.

**g) Modificadores alterados** (ModifierTweaks.java, IguanaConfig.java):

| Modificador | Mudança no Iguana |
|---|---|
| Redstone | **4 por redstone** (TC: 8), máximo 50 por slot |
| Quartzo | máximo 120, **+1 ataque a cada 40** |
| Moss | 3 por nível (configurável) |
| Esmeralda | +50% de durabilidade; sobe o nível até o **bronze (4)** |
| Diamante | +500 de durabilidade, **sem** subir nível |
| "Tier1Free" (diamante + bloco de ouro) e "Tier2Free" | removidos quando o leveling está ligado |
| Silky Cloth | pede lingote de ouro |
| Silky Jewel | pede **bloco** de esmeralda |
| Novo: Clean | silky cloth remove os modificadores |
| Novo: **substituição de peças** | trocar a cabeça ou o cabo de uma ferramenta pronta (`partReplacement=true`) |

**h) Conserto** (IguanaModRepair):

- Fórmula parecida com a do TC: `50 + dur × 0,4 × valor`.
- `repairCostPercentage = 100`.
- `repairLimitActive = false` (limite de 25 consertos se ligado).
- `repairCostScaling = false`; se ligado, o custo dobra a cada 5 consertos.

**i) Outras regras:**

- Martelo, escavadeira e lumber axe recebem **velocidade ÷2**.
- Ferramentas TC caídas no chão **nunca somem** (`toolsNeverDespawn`).
- **Cascalho não dropa sílex** (`removeFlintDrop`). Receita nova: **4 cascalhos → 1 sílex**.
- A receita de tocha de pedra do TC é removida.
- Seared blocks com dureza 1,5.
- Atalhos de crafting no grid normal: padrão com 4 gravetos, girar padrões, fazer peças, montar e modificar ferramentas.
- Baldes de argila (água, lava e leite) e o item "skull" substituído.
- `cobaltArmor=false` (opção de trocar armadura de diamante por cobalto).
- Peças de metal e de pedra são removidas do loot do "Tinker House".

### 2.3 O que o Crash Landing configurou

- **Não encontrado** o arquivo `IguanaTweaksTConstruct.cfg` do Crash Landing. As páginas do FTB Wiki, CurseForge e fórum ficaram inacessíveis aqui.
- Pelos trechos de busca:
  - Crash Landing (Iskandar, MC 1.6.4, última versão **1.1.3**, abr/2015) inclui **"Iguana Tweaks for Tinkers Construct 1.0.3"**.
  - O changelog do fórum FTB registra "Added Iguana Tweaks" na versão **1.0.5**.
  - O pack também tem Tinkers' Steelworks, EnviroMine (água escassa), HQM e Sync (vidas via "shells"), com progressão por **peneirar poeira** (pedras, ferro, ovos).
- **Suposição de trabalho**: o pack usou os **padrões do Iguana** listados acima (durabilidade 50%, leveling e boost ligados, sem ferramentas de pedra, sílex sem drop de cascalho).
  - Indício a favor: num cenário de deserto sem cascalho natural, a receita 4 cascalhos → sílex e a peneira fazem sentido.
  - Precisa confirmar abrindo `config/IguanaTweaksTConstruct.cfg` e `config/TConstruct.cfg` do zip do pack.

### 2.4 Tabela de viabilidade — Iguana Tweaks → Bedrock

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Níveis de mineração 0-8 + tabela de blocos | §2.2b | Mapa `typeId → nível` (incluir variantes deepslate e blocos de 1.20+: minério de cobre = 1, ancient debris ≈ 6 sugerido). `beforeEvents.playerBreakBlock` cancela se `nivelItem < nivelBloco`. Picaretas vanilla mapeadas: madeira 0, pedra 1, ferro 3, diamante 5, netherite 6 (sugestão). | Alta | Baixo | — |
| Tool leveling (XP, 6 níveis) | +1/bloco; dano = XP; `base × 1,35^(L−1)` | Props `lvl`, `xp`. `afterEvents.playerBreakBlock` / `entityHurt` (dano em `ev.damage`, ÷4 se a família for animal). Ao subir: `world.playSound` + `sendMessage` + lore atualizado. | Alta | Baixo (1 `setItem` por evento; agrupar a cada N blocos para economizar) | — |
| Bônus aleatório por nível / +1 slot nos níveis 2, 4, 6 | distribuição da §2.2e | Mesmo sorteio no script, aplicando os modificadores da §1.6. | Alta | Baixo | — |
| Pick boost por XP | 350…2915 blocos | Prop `boostXp`; ao atingir, `level+1` e `boosted=true`. O digger do item já precisa listar os blocos do tier seguinte (a verificação é por script). | Alta | Baixo | — |
| Boost por cabeça de mob | tetos da §2.2f | Tool Station aceita a cabeça no barril. Bedrock tem crânio de esqueleto e de wither, cabeças de zumbi, creeper, piglin e dragão; **enderman, blaze e pigman não existem** e viram itens custom `cl:head_enderman` etc. | Alta | Baixo | Usar a cabeça de piglin no lugar da de pigman. |
| Drop de cabeças (5% + 2%/beheading) | — | `world.afterEvents.entityDie` com `damageSource.damagingEntity` sendo o jogador → `spawnItem`. | Alta | Baixo | — |
| Durabilidade 50% | ×0,5 em todos os materiais | Embutido nos valores de `maxDur` da Tool Station. | Alta | Baixo | — |
| Proibir ferramentas de pedra + receitas vanilla de madeira/pedra | §2.2c | (1) Sobrescrever as receitas vanilla no BP com o **mesmo identifier** e um ingrediente impossível (testar na versão alvo). (2) Reforço por script: `beforeEvents.playerBreakBlock` com `minecraft:wooden_*`/`stone_*` na mão é tratado como "mão vazia" (cancelar blocos de nível ≥ 1). | Média | Baixo | Varredura que converte ferramentas vanilla proibidas em "sucata". |
| Peças restritas por material | §2.2d | Lista de permissões no menu do Part Builder (só mostra combinações válidas). | Alta | Baixo | — |
| Custo de padrão alterado (picareta 6, machado 4, espada 4) | §1.3 | Constante na tabela de custos. | Alta | Baixo | — |
| Remover sílex do cascalho + 4 cascalhos → sílex | — | Sobrescrever `loot_tables/blocks/gravel.json` no BP + receita shapeless. | Alta | Baixo | — |
| Redstone 4/unid., quartzo +1/40 | §2.2g | Constantes. | Alta | Baixo | — |
| Substituição de peças (part replacement) | — | Menu da Tool Station: "Trocar cabo/cabeça". Trocar a cabeça muda o `typeId`, então cria-se um novo ItemStack copiando todas as props (`getDynamicPropertyIds`). | Alta | Baixo | — |
| Clean (silky cloth) | — | Menu "Limpar modificadores" (zera props e reaplica a base). | Alta | Baixo | — |
| Ferramentas nunca somem | — | Bedrock: item no chão some em 5 min e não dá para mudar por componente. Script: em `entitySpawn` de item com ferramenta `cl:*`, registrar e, a cada ~4 min, despawnar e respawnar uma cópia no mesmo lugar (o timer reinicia). | Média | Baixo (poucos itens) | Ao morrer, guardar as ferramentas TC num "baú de recuperação" virtual por jogador. |
| Velocidade ÷2 em martelo/escavadeira/lumber axe | — | Digger com metade da velocidade no JSON. | Alta | Baixo | — |
| Baldes de argila (água/lava/leite) | — | Item custom; `itemUseOn` → `setBlockType('water')`. Importante com água escassa (como no EnviroMine). | Média | Baixo | — |
| Dureza 1,5 dos seared blocks | — | `minecraft:destructible_by_mining.seconds_to_destroy` no JSON. | Alta | Baixo | — |
| Comandos `/leveluptool`, `/toolxp` | debug | `system.afterEvents.scriptEventReceive` (`/scriptevent cl:toolxp 100`). | Alta | Baixo | — |

---

## 3. Recomendações de arquitetura (resumo)

1. **Item = (tipo de ferramenta × material da cabeça)**. Velocidade, nível base, dano base e tier no JSON. Todo o resto em dynamic properties do ItemStack (`stackable=false`), espelhado no lore:
   - `handle`, `binding`, `extra`, `maxDur`, `dmg`, `reinf`, `shoddy`, `mods`;
   - modificadores: `redstone`, `lapis`, `quartz`, `moss`, `fiery`, `necrotic`, `beheading`, `smite`, `spider`, `knockback`, `silk`, `autosmelt`;
   - leveling: `lvl`, `xp`, `boostXp`, `boosted`, `broken`, `repairs`.
2. **Durabilidade virtual** (como o TC faz com `InfiTool.Damage`). A barra nativa é só o mostrador. Confirmar na versão alvo se o motor aplica dano nativo em itens custom e neutralizar se aplicar.
3. **Smeltery** com estado em world dynamic property, um `runInterval` de 20 ticks iterando **só smelteries ativas** (com item ou metal), e validação estrutural **apenas em eventos**. Metal líquido abstrato, em mB.
4. **Sem GUI de container**: barril vanilla adjacente como "bandeja" de entrada para Part Builder, Tool Station e Smeltery, mais `ActionFormData` para escolhas. Também é possível jogar itens dentro do smeltery.
5. **Texturas**: reaproveitar as do TC 1.6.4 (CC BY 3.0) com crédito. **Nada do Iguana**, que não tem licença.

---

## 4. Pontos incertos

- O config real do Crash Landing (Iguana e TC) **não foi encontrado**. Assumidos os valores padrão.
- A versão do Iguana no Crash Landing é citada como "1.0.3", mas o repositório 1.6.4 de iguana_man usa a numeração "1n/1o/1p". O comportamento pode diferir em detalhes; o código lido é o commit mais recente (`7868e94`, jan/2014).
- A build exata do TC no Crash Landing é desconhecida (o código lido é o branch `1.6.4`, 1.5.5.8). Os stats de material quase não mudaram ao longo da série 1.5.x, mas isso não foi verificado.
- O tempo de fusão (+5 °/s, ex.: minério de ferro ≈ 116 s) foi derivado do código, não medido em jogo.
- Bedrock: comportamento de dano nativo em ferramentas custom, disponibilidade estável de `ItemEnchantableComponent.addEnchantment` no 2.x, override de receitas vanilla por identifier e tags de tier para drops. **Testar** na versão alvo.

---

## 5. Fontes

**Código-fonte (lido diretamente):**

- Tinkers' Construct, branch 1.6.4: https://github.com/SlimeKnights/TinkersConstruct/tree/1.6.4 (commit `109741b7d12500d14d212e894c06868795dfe887`)
  - README (licenças CC0 e CC BY 3.0): https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/README.md
  - Materiais, receitas, padrões, ligas, fusão e modificadores: https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/common/TContent.java (linhas 1065-1083, 1128-1185, 1205-1245, 1385-1400, 1558-1670, 1687-1911)
  - Custos de padrão: https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/items/Pattern.java
  - Fórmulas de ferramenta: https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/crafting/ToolBuilder.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/tools/HarvestTool.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/tools/AbilityHelper.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/tools/ToolCore.java
  - Smeltery: https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/blocks/logic/SmelteryLogic.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/crafting/Smeltery.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/library/crafting/FluidType.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/blocks/logic/LavaTankLogic.java ; https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/TConstruct.java
  - Modificadores: https://github.com/SlimeKnights/TinkersConstruct/tree/1.6.4/src/main/java/tconstruct/modifiers/tools
  - Config padrão: https://github.com/SlimeKnights/TinkersConstruct/blob/1.6.4/src/main/java/tconstruct/util/config/PHConstruct.java
  - Licença MIT das versões modernas: https://github.com/SlimeKnights/TinkersConstruct/blob/1.19.2/LICENSE
- Iguana Tweaks 1.6.4 (iguana_man): https://github.com/iguanaman/iguanatweakstconstruct (commit `7868e947ebc9e6a50668532fb5173d5149880e9b`)
  - IguanaConfig.java, MaterialTweaks.java, HarvestLevelTweaks.java, IguanaLevelingLogic.java, ModifierTweaks.java, VariousTweaks.java, RemoveVanillaTools.java, util/IguanaEventHandler.java, modifiers/IguanaActiveToolMod.java, items/IguanaPattern.java, IguanaItems.java
- Port 1.7.10 (comparação e licença ausente): https://github.com/SlimeKnights/IguanaTweaksTConstruct

**Web (só trechos de busca; as páginas estavam bloqueadas):**

- Crash Landing, FTB Wiki: https://ftb.fandom.com/wiki/Crash_Landing
- Crash Landing, CurseForge: https://www.curseforge.com/minecraft/modpacks/crash-landing e https://www.curseforge.com/minecraft/modpacks/crash-landing/files/all
- Tópico do Crash Landing no fórum FTB: https://forum.feed-the-beast.com/threads/1-6-4-crash-landing-hardcore-hqm-version-1-1-x-beta-stable.46277/
- Atualização do Crash Landing (MinecraftForum): https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/mod-packs/2461188-creating-update-for-crash-landing-by-iskandar
- Lista de mods (Aternos): https://board.aternos.org/thread/4879-modpack-request-ftb-crash-landed/
- Modpack Index (Crash Landing): https://www.modpackindex.com/modpack/20156/crash-landing
- Iguana Tinker Tweaks, CurseForge: https://www.curseforge.com/minecraft/mc-mods/iguanas-tinker-tweaks
- Iguana Tinker Tweaks, MinecraftForum: https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/2176855-iguanas-tinker-tweaks
- Fórum FTB sobre nível de mineração e boost: https://forum.feed-the-beast.com/threads/how-to-change-the-mining-level-of-an-ore.71796/
- Gist com config do Iguana (1.7.10): https://gist.github.com/Havvy/a57da872245c0fd89943
- Smeltery 5×5 / 3×3 em versões antigas: https://ftb.gamepedia.com/Getting_Started_(Tinkers%27_Construct) ; https://tinkers-construct.fandom.com/wiki/Talk:Smeltery/@comment-24851733-20140422204703

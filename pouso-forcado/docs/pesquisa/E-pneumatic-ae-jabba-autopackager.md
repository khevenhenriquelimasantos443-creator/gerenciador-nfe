# Pesquisa E — PneumaticCraft, Applied Energistics + ExtraCells, JABBA, AutoPackager/AutoUtils (Crash Landing 1.6.4)

Objetivo: levantar as **mecânicas e números** destes mods como estavam no modpack *Crash Landing* (Iskandar, FTB third-party, MC 1.6.4) e dizer como recriá-los no add-on Bedrock **"Pouso Forçado"** (Script API `@minecraft/server` 2.x + `@minecraft/server-ui`).

## Como os dados foram obtidos (leia antes)

- **Versões do pack**: tiradas da lista de mods da página *Crash Landing* do FTB Wiki (fandom), lida por meio do buscador (o site em si estava bloqueado pelo proxy deste ambiente). Versões listadas: **Applied Energistics rv14 finale3**, **ExtraCells 1.6.9d**, **PneumaticCraft 1.1.4f**, **JABBA 1.1.4**, **AutoPackager 1.4**, **Autoutils 1.0.1**.
- **Números**: sempre que deu, vieram do **código-fonte** (clonado do GitHub) ou do **site oficial arquivado do AE1** (repositório `AppliedEnergistics/ae1-site-archive`). Quando o código do 1.6.4 não existe publicamente, usei a versão de código aberto mais próxima e digo isso.
  - PneumaticCraft: o código só foi aberto em 30/08/2014, já no MC 1.7.10 (versão 1.2.6, commit `a80b62e5`). **O 1.1.4f (1.6.4) é de código fechado**, então os números abaixo são do 1.2.6. Eles devem ser iguais ou muito parecidos, mas não há como conferir.
  - JABBA: o código da era 1.6.4 (v1.1.x, meados de 2014) está no espelho `Jorch72/jabba`, junto com o `CHANGELOG` original.
  - AutoPackager: código oficial `MCUpdater/AutoPackager`. O commit `1b75db3` (16/07/2014) é exatamente a **v1.4 para 1.6.4**.
  - ExtraCells: código oficial `ExtraCells/ExtraCells1`, versão 1.6.9e para MC 1.6.4 (o pack usava a 1.6.9d, uma sub-versão antes).
  - AE1: **nunca teve código aberto**. O FAQ oficial diz: *"AE Is currently not open souce"*. Os números vêm das páginas oficiais arquivadas.
- O que não foi achado aparece como **"não encontrado"**.

---

## 0. Resposta direta: AE1 ou AE2? ExtraCells 1 ou 2?

**O que o Crash Landing tinha de fato:**

| Item | No pack (1.6.4) | O que o usuário pediu |
|---|---|---|
| Applied Energistics | **AE1 rv14.finale3** (lançado em 28/12/2013, conforme o changelog oficial) | "AE2" (AE2 é do MC 1.7.10+) |
| ExtraCells | **ExtraCells 1.6.9d**, addon do **AE1** (o README do repo diz *"No Support anymore! Use ExtraCells 2 for MC 1.7.x!"*) | "ExtraCells 2" (addon do AE2) |

**Diferenças que importam para o add-on:**

| Aspecto | AE1 rv14 (o que estava no pack) | AE2 (1.7.10 rv1–rv3) |
|---|---|---|
| Canais | **Não existem.** A rede só exige *1 e apenas 1* ME Controller, pelo menos 1 Drive ou Chest e 1 Terminal | Existem. 8 canais por cabo comum, 32 no Dense Cable; sem controller a rede "ad-hoc" aceita só 8 dispositivos |
| Controller | Bloco único. Dois controllers na mesma rede "brigam" e nada funciona | Multibloco (com regras próprias) |
| Células | 1k / 4k / 16k / 64k: **1.024 / 4.096 / 16.384 / 65.536 bytes**, **63 tipos** cada, **8 / 32 / 128 / 512 bytes por tipo**, 8 itens por byte | **Os mesmos números** (1k–64k, 63 tipos, 8/32/128/512 bytes por tipo, 8 itens por byte) |
| Drive | 10 células, 1 u/t + o consumo de cada célula | 10 células, 2 AE/t, precisa de canal |
| Processadores | **Não há Inscriber.** O Processor Assembly é feito na bancada com a **Quartz Cutting Knife** (redstone + ouro ou diamante + silício) e depois **cozido na fornalha** | Inscriber com prensas (Logic/Calculation/Engineering/Silicon) que vêm de meteoritos; 10 AE/t, 100 ticks para carregar, 1k AE por operação |
| Certus | Minério acima da camada do diamante e abaixo do nível do mar; dropa 1–4 cristais ou pó. **Não existe Charged Certus nem crescimento por sementes** | Charged Certus (feito no Charger), sementes que crescem na água, Crystal Growth Accelerator (8 AE/t) |
| Fluix | Crafting: **Nether Quartz + Redstone + Certus Crystal** | Charged Certus + Nether Quartz + Redstone jogados na água |
| Autocraft | **Molecular Assembler Chamber (MAC)**, um multibloco cuboide: cantos = Assembler Containment Wall, faces não-canto = Heat Vent, interior = Pattern Provider ou Crafting CPU (sem ar). Mínimo 3x3x3. **1 craft a cada 3 ticks** de base e **+1 craft/3 ticks por CPU**. Padrões gravados no **ME Pattern Encoder**, um bloco **fora** da rede. Cada operação de crafting custa 3 unidades | Molecular Assembler é um bloco único, alimentado por ME Interface; Crafting CPU é um multibloco (Crafting Units, Storage, Co-Processors); usa Pattern Terminal |
| Processamento externo | ME Interface com padrão no slot "Processing" manda os itens para uma máquina (por exemplo, a fornalha embaixo) | Igual, com ME Interface |
| Fluidos | ExtraCells 1 (células de fluido 1k–64k, **5 tipos**) | ExtraCells 2 |
| Licença | Fechado, todos os direitos reservados | Código LGPLv3; texturas CC BY-NC-SA 3.0 |

**Recomendação:** seguir as **mecânicas do AE1**. Dá para usar nomes atuais, se quiser.
1. **Não ter canais** é mais fiel ao pack e muito mais barato no celular, porque não há busca de caminho mais curto. O projeto já tem o limite de 48 nós no Terminal, e isso basta.
2. Os **limites das células são iguais** em AE1 e AE2, então o jogador que conhece AE2 não estranha.
3. **Processador por faca + fornalha** se encaixa na **Montadora** que o projeto já tem. Não precisa de Inscriber nem de meteoritos.
4. O autocraft do AE1 (MAC) pode virar um multibloco simplificado. Dá para medir a velocidade só contando CPUs, sem simular canais.
5. As **células de fluido do ExtraCells 1** fazem sentido no Crash Landing (falta d'água e sede), mas só se o add-on tiver um sistema de "água em baldes".

---

## 1. PneumaticCraft (pack: 1.1.4f, MC 1.6.4; números do código 1.2.6 / 1.7.10)

**Licença:** o código é **GPLv3** (o README diz *"It's licenced under GPLv3, so have fun"*; o commit `071e0b8d` de 30/08/2014 mudou de GPLv2 para GPLv3). As texturas e modelos ficam no mesmo repositório (`resources/`, `Models/`). Não há licença separada para os assets, então valem os termos do repositório (GPLv3).
- **Dá para reaproveitar com créditos?** Sim, mas o GPLv3 é *copyleft*: se você copiar código ou texturas, o add-on (ou pelo menos a parte derivada) precisa ser distribuído sob GPLv3, com o código disponível e os créditos a MineMaarten. **Sugestão:** reimplementar as mecânicas, que não são protegidas, e desenhar texturas próprias. Assim o add-on não fica preso ao GPL.
- Observação: no Crash Landing, Iskandar pode ter mudado receitas com MineTweaker ou HQM. **Não encontrei** a lista de receitas alteradas.

### Números-chave (de `pneumaticCraft/lib/PneumaticValues.java` e dos TileEntities, commit `a80b62e5`)

- **Pressão (bar) = ar armazenado (mL) / volume (mL).**
- **Nível 1** (tubo, Air Compressor, Pressure Chamber, Elevator, UV Light Box…): **pressão de perigo 5 bar** e **pressão crítica 7 bar**.
- **Nível 2** (Advanced Pressure Tube, Charging Station etc.): **perigo 20 bar** e **crítica 25 bar**.
- **Explosão:** quando o bloco é criado, ele sorteia um limite `maxPressure = perigo + (crítica - perigo) × random`, ou seja, **entre 5 e 7 bar** no nível 1. Se a pressão passar desse limite, o bloco cria uma **explosão de força 1.0** e vira ar.
- **Vazamento:** um lado do tubo ou máquina sem conexão vaza `pressão × 40 + 20` mL/tick (`AIR_LEAK_FACTOR = 40`).
- **Volumes:** Air Compressor 5.000 mL; Pressure Tube 1.000 mL; Advanced Pressure Tube 4.000 mL; válvula da Pressure Chamber 1.000 mL **+ 16.000 mL por bloco interno vazio**; Volume Upgrade +5.000 mL.
- **Air Compressor:** queima **qualquer combustível de fornalha**, com o mesmo tempo de queima da fornalha (carvão = 1.600 ticks). Enquanto queima, produz **10 mL/tick**. Um carvão rende 16.000 mL. O Speed Upgrade multiplica a produção por 1,5 e o consumo de combustível por 1,8.
- **Ferro Comprimido por explosão** (`EntityItemSpecial`): um item **Iron Ingot** ou **Iron Block** atingido por explosão vira Compressed Iron Ingot ou Compressed Iron Block. A config `Compressed Iron Loss Percentage` vale **20** por padrão.
  - Stacks com **3 ou mais itens** rendem entre **70% e 90%**, ou seja, perda média de 20%.
  - Stacks com **1–2 itens** são **perdidos inteiros**. É um bug: o código compara `rand <= 20`, que é sempre verdadeiro. Na prática a regra conhecida é "jogue pelo menos 3".
- **Pressure Chamber** (multibloco): **cubo oco de 3x3x3, 4x4x4 ou 5x5x5** (o código testa tamanhos 3 a 5).
  - Toda a casca deve ser **Pressure Chamber Wall**, **Pressure Chamber Glass** (que é a Wall com metadado 6), **Valve** ou **Interface**.
  - Precisa de pelo menos **1 Valve** no **meio de uma face** (não em aresta), virada para fora daquela face.
  - Volume: 3x3x3 tem 1 bloco interno e dá 17.000 mL no total; 4x4x4 tem 8 internos e dá 129.000 mL; 5x5x5 tem 27 internos e dá 433.000 mL.
  - Os itens são **jogados dentro**. Quando a pressão chega à exigida pela receita e os itens param de se mexer, o crafting é **instantâneo**. A receita não consome ar.
  - A **Pressure Chamber Interface** gasta **1.000 mL por item transferido**.
- Exemplo de custo: para levar uma câmara 3x3x3 a **2 bar** são precisos 34.000 mL, ou 3.400 ticks (~170 s, ~2,1 carvões) de um compressor, sem contar o vazamento.

### Receitas da Pressure Chamber (`CraftingRegistrator.java`)

| Entrada | Pressão exigida | Saída |
|---|---|---|
| 1 Iron Ingot | **2,0 bar** | 1 Compressed Iron Ingot |
| 1 Iron Block | 2,0 bar | 1 Compressed Iron Block |
| 8 Coal Block | 4,0 bar (config, ativo por padrão) | 1 Diamond |
| 2 Redstone + 1 Gold Ingot | 1,0 bar | Turbine Blade |
| Plastic (creeper) + Compressed Iron | 1,5 bar | Empty PCB |
| 2 Plastic + 2 Rotten Flesh + 2 Gunpowder + 2 Spider Eye + Water Bucket | 1,0 bar | Etching Acid Bucket |
| Plastic (squid) + Compressed Iron + Redstone | 1,0 bar | Transistor |
| Plastic (lightning) + Compressed Iron + Redstone | 1,0 bar | Capacitor |
| 9× um item de qualquer receita "9 iguais → bloco" | 1,0 bar | o bloco (compactação automática) |
| 1 bloco de armazenamento | **−0,5 bar** (vácuo) | 9 itens (descompacta) |

### Receitas de bancada do começo do jogo

| Saída | Receita |
|---|---|
| 4 Pressure Tube | `igi` (i = Compressed Iron, g = Glass) |
| Air Compressor | `iii / i t / ifi` (i = Compressed Iron, t = Pressure Tube, f = Furnace) |
| 4 Pressure Chamber Wall | 8 Compressed Iron em anel |
| 4 Pressure Chamber Glass | `iii / igi / iii`, ou 4 Walls + 1 Glass (sem forma) |
| 4 Pressure Chamber Valve | `iii / iti / iii` (t = tubo), ou 4 Walls + tubo |
| 4 Pressure Chamber Interface | `ici / ihi / ici` (c = Pneumatic Cylinder, h = Hopper) |
| Pressure Gauge | `" g " / gig / " g "` (g = ouro, i = Compressed Iron) |
| Compressed Iron Block | 9 Compressed Iron |
| PCB | Unassembled PCB + 3 Transistor + 3 Capacitor (sem forma). A placa vazia é "revelada" na **UV Light Box** (≥1 bar, 2 mL/t) e depois passa por ácido |

### Tabela de recriação

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Pressão (bar) em máquinas e tubos | bar = mL / volume; nível 1: perigo 5, explode entre 5 e 7; nível 2: 20/25 | Guardar `ar` (mL) de cada rede de tubos numa **dynamic property do mundo** com chave `pc:net:<id>`. Estado de bloco `pc:pressao` (0–15 = 0,5 bar por nível) só para a textura e o manômetro. Ao colocar ou quebrar um tubo, fazer flood-fill **só nesse momento** e guardar o grafo; no `onTick` (≥20 ticks) apenas igualar ar/volume | Alta | Médio (o flood-fill é caro, então fazer só em evento) | Simplificar para "pressão por rede" sem fluxo entre trechos: toda a rede tem a mesma pressão |
| Explosão por sobrepressão | limite sorteado entre 5 e 7 bar; explosão de força 1.0 | Ao colocar o bloco, sortear `maxBar` e guardar na dynamic property. No tick, se `bar > maxBar`, chamar `dimension.createExplosion(loc, 1, {breaksBlocks:true})` e apagar a rede | Alta | Baixo | Mostrar um aviso (partícula ou som) antes de explodir, para ser amigável no celular |
| Vazamento em ponta aberta | `bar × 40 + 20` mL/t por lado aberto | Contar, ao montar o grafo, os lados de tubo sem vizinho. A cada 20 ticks: `ar -= abertos × (bar×40+20) × 20` | Alta | Baixo | Ignorar o vazamento e apenas impedir o funcionamento com ponta aberta |
| Air Compressor | 10 mL/t enquanto queima; tempo de queima da fornalha; volume 5.000 mL | Bloco custom que lê o combustível de um **baú ou funil adjacente** (`block.getComponent("inventory")`). Tabela de tempo de queima fixa (carvão 1600, bloco de carvão 16000, madeira 300…). A cada 20 ticks: `ar += 200` enquanto houver queima | Alta | Baixo | Permitir também o combustível na mão (interagir) |
| Tubos e Advanced Tube | 1.000 mL e 4.000 mL de volume | Blocos com estados de conexão (6 booleanos ou geometria com `minecraft:connection`) | Alta | Baixo | — |
| Pressure Chamber 3x3x3 → 5x5x5 | casca de Wall/Glass/Valve/Interface; Valve no centro de uma face; +16.000 mL por bloco interno | Ao interagir com a **Valve** (ou ao colocar o último bloco), validar o cubo testando os tamanhos 3–5 e as posições da válvula. Guardar `{min,max,size}` na dynamic property. No tick, `dimension.getEntities({type:"minecraft:item", location, volume})` dentro do interior, conferir receitas e pressão, então `kill()` e `spawnItem` da saída | Média | Médio (busca de entidades a cada 20 ticks em até 27 blocos) | Câmara "1 bloco" (máquina comum) com entrada e saída por baú; o tamanho só aumenta o volume |
| Receitas da câmara | Ferro 2 bar; carvão→diamante 4 bar; blade 1 bar; PCB 1,5 bar; compactar 9→1 com 1 bar e descompactar com −0,5 bar | Tabela JS `{entrada:[{id,qtd}], bar, saida}`. Vácuo só se existir Vacuum Pump; se não, deixar a descompactação de fora | Alta | Baixo | Mover as receitas para a Montadora com o requisito "rede ≥ X bar" |
| Compressed Iron por explosão | perda média de 20%; stacks de 1–2 somem (bug); 3+ rendem 70–90% | `world.beforeEvents.explosion` (ou `afterEvents`): pegar o centro e o raio, buscar entidades `minecraft:item` com `iron_ingot` ou `iron_block` dentro do raio + 1, e via `system.run` trocar pelo ferro comprimido com 70–90% da quantidade | Média | Baixo (só quando há explosão) | Receita só na câmara a 2 bar, ou uma "prensa" na Montadora |
| Interface da câmara | 1.000 mL por item | Bloco que puxa de um baú adjacente e "joga" dentro do interior (spawnItem). Desconta 1.000 mL | Média | Baixo | A Valve aceita direto do baú adjacente |
| UV Light Box / PCB | ≥1 bar, 2 mL/t, tempo `LIGHT_BOX_0_100_TIME` (valor não encontrado) | Máquina com item vindo de baú; o progresso fica na dynamic property do mundo | Média | Baixo | Etapa "PCB" direto na Montadora |
| Pressure Gauge / Manômetro | leitura em bar | Item: interagir com o bloco e mostrar `ActionForm` ou actionbar `x,x bar / máx` | Alta | Baixo | — |

---

## 2. Applied Energistics (pack: **AE1 rv14.finale3**) + ExtraCells (pack: **1.6.9d, para AE1**)

**Licenças:**
- **AE1:** código **fechado**, todos os direitos reservados (FAQ oficial: *"AE Is currently not open souce"*). **As texturas não podem ser reaproveitadas.** Recriar só as mecânicas.
- **AE2** (se quiser usar arte "estilo AE"): código **LGPLv3**, API **MIT**, **texturas e modelos CC BY-NC-SA 3.0** (AlgorithmX2 e Ridanisaurus), textos CC0. Reaproveitar texturas exige **atribuição**, **uso não comercial** e **mesma licença** (share-alike) para os derivados.
- **ExtraCells 1:** **MIT** (o commit `d6409a7` de 10/04/2015 relicenciou; *Copyright (c) 2014 M3gaFr3ak/Leonelf*). As texturas estão no mesmo repositório (o README credita *cyntain* e *tgame14*). O MIT permite reaproveitar com o aviso de copyright. Para as texturas, há uma leve incerteza sobre o que os autores das artes aceitam; o recomendado é creditá-los.

### 2.1 Números do AE1 (site oficial arquivado)

**Energia** (página *Energy Usage Information*): 1 EU = 2 unidades; 1 MJ = 5; 20 J (UE) = 1; 2 RF = 1.

| Bloco ou ação | Consumo |
|---|---|
| ME Controller | 6 u/t |
| Drive / Chest | 1 u/t + o consumo das células |
| Célula 1k / 4k / 16k / 64k | 0,5 / 1,0 / 1,5 / 2,0 u/t |
| Terminal / IO Port / Storage Bus | 1 u/t |
| Import/Export Bus | 1 u/t (2 no modo stack) |
| Pattern Provider / Crafting CPU | 1 u/t |
| Cabo | 1/16 u/t |
| Wall / Heat Vent / Power Relay | 0 |
| Inserir ou retirar 1 item | 1 unidade (64 itens = 64 unidades) |
| 1 operação de crafting | 3 unidades |

Uma rede pequena gasta cerca de 6–8 EU/t.

**Células** (página *ME Storage Math*):

| Célula | Bytes | Tipos | Bytes/tipo | Pilhas com 1 tipo | Pilhas com 63 tipos | Custo aprox. (quartzo/ouro/diamante) |
|---|---|---|---|---|---|---|
| 1k | 1.024 | 63 | 8 | 127 | 65 | 4 / 1 / 0 |
| 4k | 4.096 | 63 | 32 | 508 | 260 | 12 / 4 / 0 |
| 16k | 16.384 | 63 | 128 | 2.032 | 1.040 | 36 / 12 / 1 |
| 64k | 65.536 | 63 | 512 | 8.128 | 4.160 | 108 / 36 / 4 |

Fórmula: `bytesUsados = tipos × bytesPorTipo + ceil(itensTotais / 8)` (8 itens por byte). Exemplo: 1k com 1 tipo comporta (1024 − 8) × 8 = 8.128 itens, ou 127 pilhas.

**Rede:** exige 1 e apenas 1 Controller, pelo menos 1 Drive ou Chest e 1 Terminal. **Não há canais.** Drive com **10 células**. O ME Chest usa **1 célula** e aceita itens de qualquer fonte, mas não deixa extrair por automação. O Wireless Access Point tem alcance de **32 blocos** (64 com o Wireless Booster).

**Certus e materiais:**
- **Certus Quartz Ore:** raro; aparece **acima da camada do diamante e abaixo do nível do mar**; dropa 1–4 Crystal ou Dust; Fortune aumenta o drop.
- **Silicon:** fornalha com Certus Dust.
- **Fluix Crystal:** Nether Quartz + Redstone + Certus Crystal na bancada (quantidade de saída **não encontrada**).
- **Fluix Dust:** as mesmas três coisas em pó.
- **Quartz Grind Stone + Wooden Crank:** moedor manual, **1 minério → 2 pós**. Se a manivela for girada vazia muitas vezes, ela quebra.

**Processadores (no AE1 não há Inscriber):**
- Basic Processor Assembly: `_ K _ / R G R / _ S _` (K = Quartz Cutting Knife, que **volta e se desgasta**; R = redstone; G = ouro; S = silício). Cozinhar na **fornalha** dá o **ME Basic Processor**.
- O Advanced é igual, com **diamante** no lugar do ouro.
- Alternativa no BC Assembly Table: silício + redstone + ouro ou diamante, gastando bastante energia.

**Receitas principais (grade 3x3, linhas separadas por "/"):**

| Item | Receita |
|---|---|
| Storage Cell (componente 1k) | `R C R / C BP C / R C R` (C = Certus Crystal, BP = Basic Processor) |
| Storage Segment (4k) | `R BP R / SC Vidro SC / R SC R` |
| Storage Block (16k) | `Gl AP Gl / SS Vidro SS / Gl SS Gl` (Gl = glowstone, AP = Advanced Processor, SS = Segment) |
| Storage Cluster (64k) | igual ao Block, usando Storage Blocks |
| ME 1k/4k… Storage (célula pronta) | `Vidro R Vidro / R Componente R / Ferro Ferro Ferro`. Sneak + usar com a célula vazia na mão devolve o **Storage Cell Housing** + o componente |
| ME Controller | `Fe Fx Fe / Fx AP Fx / Fe Fx Fe` (Fx = Fluix Crystal) |
| ME Drive | `Fe BP Fe / Vidro Baú Vidro / Fe BP Fe` |
| ME Chest | `Vidro CM Vidro / Fe Baú Fe / Fe Fe Fe` (CM = Conversion Matrix) |
| ME Conversion Matrix | `Fe NQ Fe / FxD BP FxD / Fe C Fe` (NQ = Nether Quartz, FxD = Fluix Dust) |
| ME Cable | `Vidro×3 / FxD×3 / Vidro×3` (saída 3, conforme a página) |
| ME Access Terminal | `Fe Fe Vidro / Cabo CM Vidro / Fe Fe Vidro` |
| ME Crafting Terminal | `Fe Fe Vidro / Bancada SC Terminal / Fe Fe Vidro` |
| ME Interface | `Fe Vidro Fe / Cabo CM Vidro / Fe Vidro Fe` |
| ME Pattern Encoder | `Fe CM Fe / Fe Bancada Fe / Fe Fe Fe` (fora da rede; guarda 1 pilha de Blank Patterns; aceita automação e pulso de redstone) |
| ME Blank Pattern | `Vidro Gl Vidro / Gl C Gl / Fe Fe Fe` |
| ME Pattern Provider | `Fe Bancada Fe / CM AP CM / Fe SC Fe` |
| ME Crafting CPU | `Fe C Fe / Gl AP Gl / Fe C Fe` |
| ME Heat Vent | `Fe Barra Fe / Barra Cabo Barra / Fe Barra Fe` |
| ME Assembler Containment Wall | `Fe Au Fe / Au C Au / Fe Au Fe` |

**Autocraft (MAC):**
- Regras do cuboide: cantos = Wall; faces não-canto = Heat Vent; interior = Pattern Provider ou CPU, sem ar; pelo menos 1 Provider.
- Velocidade: **1 craft/3 ticks + 1 por CPU**.
- O terminal mostra "Craft" no lugar da quantidade, e o jogador escolhe quantos quer.
- Sem material, o pedido fica aguardando. Para cancelar: Crafting Monitor, ou reiniciar o Controller.
- Padrões que não são de bancada aparecem em vermelho.
- **Quantos padrões cabem num Pattern Provider: não encontrado.**

### 2.2 ExtraCells 1.6.9 (código `ExtraCells1`)

| Item | Bytes ou capacidade | Tipos | Bytes/tipo | Receita |
|---|---|---|---|---|
| 256k Storage | 262.144 | 63 | 2.048 (bytes/128) | `Vidro de quartzo, Flux Dust, Vidro de quartzo / Flux Dust, Componente "Kilo", Flux Dust / Diamante ×3`, ou Advanced Casing + componente |
| 1024k | 1.048.576 | 63 | 8.192 | idem, com componente "Mega" |
| 4096k | 4.194.304 | 63 | 32.768 | idem, com "Giga" |
| 16384k (o código escreve "16348k") | 16.777.216 | 63 | 131.072 | idem, com "Tera" |
| Componentes Kilo/Mega/Giga/Tera | — | — | — | `FD AP FD / Cn D Cn / FD Cn FD` (Cn = Storage Cluster do AE para o Kilo, e o componente anterior para os demais) |
| Célula de fluido 1k / 4k / 16k / 64k | **1.024 × 250 mB = 256.000 mB (256 baldes)**; 4k = 1.024 baldes; 16k ≈ 4.087 baldes (o código usa 16348); 64k = 16.384 baldes | **5 fluidos** | — (conta em mB) | `Vidro de quartzo, FD, Vidro de quartzo / FD, componente de fluido, FD / Certus Tank ×3` |
| Container Cell | 65.536 | **1 tipo** | — | célula 1k + baú (sem forma) |
| Customizable Cell | config padrão 4.096 bytes / 27 tipos | — | — | ` P / SSS / P` (P = Basic Processor, S = célula 1k) |
| Encryptable Cell | — | — | — | célula 1k cercada de ferro |

Também há blocos de fluido: Fluid Import/Export/Storage Bus, Fluid Terminal, Fluid Interface, Fluid Level Emitter, Certus Tank, ME Battery, Blast-Resistant (Hard) ME Drive, ME Dropper, Soldering Station, Void Fluid e Walrus (decorativo). Existem células de fluido 256k–16m no código, mas **só 1k–64k têm receita**.

### 2.3 Tabela de recriação (AE1 + ExtraCells1)

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Rede ME / Controller único | 1 controller; sem canais; 6 u/t | Reaproveitar o **Terminal de Armazenamento** e os cabos já existentes. Um bloco "Controlador" vira obrigatório; se houver 0 ou mais de 1 na rede, nada funciona. Sem canais; manter o limite de 48 nós | Alta | Baixo (o flood-fill dos cabos já existe) | Deixar o controlador opcional (só aumenta o alcance) |
| Células 1k–64k (bytes e tipos reais) | 1024/4096/16384/65536 B; 63 tipos; 8/32/128/512 B por tipo; 8 itens/byte | **Item não-empilhável** `cl:celula_1k` etc. com dynamic property `cl:cel` = JSON `{"v":1,"i":{"minecraft:iron_ingot":8128,…}}`. Calcular `usado = nTipos×bpt + ceil(total/8)` antes de cada inserção e recusar se passar dos bytes ou de 63 tipos. Mostrar no `nameTag`/lore: "x de 1024 bytes, y de 63 tipos". JSON de 63 tipos tem ~2–3 KB, bem abaixo do limite de string da dynamic property (~32 KB) | Alta | Baixo | — |
| ME Drive (10 células) | 1 u/t + 0,5–2 u/t por célula | Bloco custom sem inventário: **interagir com a célula na mão** tira o item do jogador e copia o JSON para a dynamic property do mundo `cl:drive:x,y,z` = `[cel0..cel9]` (tipo + conteúdo). Um menu (`ActionForm`) lista os slots e permite tirar uma célula, recriando o item com a dynamic property. Estado de bloco `cl:slots` (0–10) para a textura. O Terminal soma os drives como "inventários virtuais" | Alta | Baixo–Médio | ME Chest: 1 célula, mesma lógica |
| ME Chest | 1 célula; aceita entrada de qualquer fonte; sem saída automática | Mesmo bloco do Drive com 1 slot. A entrada por **funil ou baú adjacente** é puxada no `onTick` (20 ticks) | Alta | Baixo | — |
| Terminal (busca, ordenar, crafting terminal) | ordenar por nome, quantidade ou prioridade; filtro "guardados/craftáveis" | **Já existe** (busca por ID em inglês, tirar 1/16/64/tudo). Acrescentar: ordenar por quantidade e o filtro "Craftáveis". Crafting Terminal: Script API **não tem API de receitas**, então ele só pode fazer receitas de uma **tabela do add-on** (a Montadora já tem uma) | Alta | Baixo | Crafting só pelas receitas da Montadora |
| Custo de energia por operação | 1 unidade por item movido; 3 por crafting | Já cobra 1 E por uso. Sugestão: 1 E por operação de menu **+ 1 E a cada 64 itens** movidos, e 1 E a cada 8 craftings. Consumo ocioso: 1 E por minuto por Drive ou Controlador (opcional) | Alta | Baixo | Só por uso (como hoje) |
| Certus Quartz (minério) | abaixo do nível do mar, acima da camada do diamante; 1–4 drops; raro | Feature de worldgen (`minecraft:ore_feature` + feature rule) em Y ~ 16 a 62 (ajustar à altura do Bedrock); loot table de 1–4 cristais ou pó com fortune | Alta | Baixo | Obter certus por quest ou na peneira |
| Fluix / Silício / Processadores | Fluix = NQ + R + C; silício = fornalha(pó); processador = faca + R/ouro ou diamante/silício, depois fornalha | Receitas **JSON de bancada** (a faca volta com durabilidade via `minecraft:crafting_table` + item com `damage`; no Bedrock, item de receita que "volta" não é nativo, então a faca pode virar um item consumível barato) e receitas de **fornalha JSON** | Alta | Baixo | Fazer o processador na Montadora |
| Grind Stone manual | 1 minério → 2 pós; manivela | Bloco custom: interagir N vezes (contador na dynamic property) e soltar o pó | Alta | Baixo | — |
| Autocraft MAC (Wall/Vent/Provider/CPU) | cuboide ≥3x3x3; 1 craft/3t + 1 por CPU | Validar o cuboide ao interagir com um Pattern Provider (até 5x5x5, por exemplo). Guardar `nCPU` e a lista de padrões na dynamic property. **Padrão** = item não-empilhável com `{saida:{id,q}, entradas:[{id,q}]}` gravado no **Codificador** escolhendo uma receita da tabela do add-on (`ActionForm`), já que não há API de receitas. Pedido pelo Terminal: "Fabricar N" verifica recursivamente (até 3 níveis) e reserva os itens. Velocidade no tick de 20: `floor(20/3)×(1+nCPU)` ≈ 6×(1+CPU) craftings por segundo | Média | Médio (a recursão só roda no pedido; o tick só desconta uma fila) | "Montadora automática" de 1 bloco com 1 padrão (estilo Molecular Assembler do AE2) |
| Processamento externo (Interface + fornalha) | o padrão envia itens para a máquina vizinha | ME Interface custom: no pedido, colocar itens no **inventário da fornalha** vizinha (`getComponent("inventory")` funciona em fornalha vanilla) e depois puxar a saída | Média | Baixo | Só craftings da tabela interna |
| Células de fluido (ExtraCells) | 1k = 256.000 mB (256 baldes), 5 fluidos; até 64k = 16.384 baldes | Item não-empilhável com JSON `{"agua":mB,…}`; máx. 5 chaves. Entrada: balde cheio na mão + interagir com o "Terminal de Fluidos" (balde → vazio), ou caldeirão adjacente. Saída: balde vazio → cheio. Combina com a sede do Pouso Forçado | Média | Baixo | Tanque de água simples (um bloco) com capacidade em baldes |
| Células grandes do ExtraCells (256k–16384k) | 262.144–16.777.216 bytes, 63 tipos | Mesmo item de célula, com limites maiores. Os números grandes cabem em `number` JS | Alta | Baixo | Limitar ao 64k para não quebrar o balanço |
| Wireless Terminal | AP com 32 blocos (64 com booster) | Item que abre o mesmo menu se `distância ≤ 32` de um "Ponto de Acesso" ligado à rede | Alta | Baixo | — |
| Storage Bus | inclui baús ou barris externos na rede | **Já existe na prática** (o Terminal junta baús e barris) | Alta | — | — |
| Matter Condenser / Spatial IO / P2P / Quantum Bridge | — | Fora do escopo do começo do jogo | Baixa | Alto | Omitir |

---

## 3. JABBA (pack: 1.1.4, MC 1.6.4; código do espelho `Jorch72/jabba` + CHANGELOG v1.1)

**Licença:** a página do CurseForge (repetida no `LICENSE.txt` do fork GTNH) diz **CC BY-NC-SA 4.0**. Permite reaproveitar texturas e código com **atribuição** (ProfMobius e taelnia), **sem uso comercial** e com a **mesma licença** nos derivados. Não há certeza se essa licença já valia na época do 1.6.4, porque o espelho de 2014 não tem arquivo de licença.

### Números (código 1.6.4)

- **Barril:** guarda **1 tipo de item**. Capacidade base = **64 pilhas** (`basestacks = 64`) × tamanho de pilha do item, ou seja, **4.096** para itens de 64 e **1.024** para itens de 16. A capacidade é **em pilhas**, não em itens.
- **Storage Upgrade (core):** **+64 pilhas** cada, **ocupa 1 slot**: `maxstacks = 64 × (nUpgrades + 1)`. No 1.6.4 **só existe o Storage simples**. Os Storage x3, x9, x27, x81 e x243, Void e Creative **vieram depois, no 1.7.10** (`UpgradeCore` 1.2.x).
- **Structural Upgrades (tiers)** abrem slots. O nível n tem `soma(2^i, i<n)` = **2^n − 1** slots: MK I = 1, MK II = 3, MK III = 7, MK IV = 15, MK V = 31, MK VI = 63, MK VII = 127. Precisam ser **aplicados em ordem**, mas não exigem o tier anterior na receita.
  - Material de cada tier (config `materialList`): **tábua, ferro, ouro, diamante, obsidiana, end stone, esmeralda**.
  - Receita: `P B P / B _ B / P B P` (P = **cerca**, B = material do tier).
- **Capacidade máxima** (MK VII lotado de Storage): 64 × 128 = **8.192 pilhas** (524.288 itens de 64).
- **Outros cores** (custo em slots): **Ender/BSpace = 2 slots** (sincroniza barris ligados pelo Tuning Fork); **Redstone = 1**; **Hopper = 1**. Só 1 de cada tipo. Receita de core: `_ Pistão _ / _ X _ / _ Pistão _` (X: Storage = **um barril**; Ender = **ender chest**; Redstone = **bloco de redstone**; Hopper = **funil**).
- **Side upgrades** (não usam slot; 4 por receita, em formato `_P_ / PXP / _P_`): **Sticker** = slime + papel; **Hopper facade** = funil + tábuas; **Redstone facade** = redstone + tábuas.
  - Hopper core + facade: o barril **empurra itens a cada 8 ticks** pelo lado com a facade.
  - Redstone core + facade: o barril emite sinal de redstone pelo lado com a facade.
- **Barril:** `W - W / W C W / W W W` (W = tronco, - = laje de madeira, C = baú).
- **Hammer:** `III / ISI / _S_` (remove upgrades). **Tuning Fork:** `_ I _ / _ E I / I _ _` (E = ender pearl).
- **Dolly:** `_ _ X / _ P X / X X X` (X = ferro, P = tábua). Pega baús, barris e as máquinas de uma lista branca (Iron Chest, máquinas TE, engines BC/Railcraft/Forestry, tanques, BetterStorage) **com o conteúdo** e coloca de novo.
- **Diamond Dolly:** `_ _ _ / _ Dolly _ / D D D`. **Também move spawners.** Cada spawner movido gasta 1 de durabilidade, com **6 usos** (CHANGELOG v1.1: *"Each time a spawner is moved, the dolly will take 1 dmg and can be used 6 times"*). Pode ser desativado na config (`diamondDollyActive`).

### Tabela de recriação

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| Barril de 1 item | 64 pilhas × tamanho da pilha (4.096 / 1.024 / 64 para itens de 1) | Bloco custom; conteúdo `{id, qtd, maxStack, nStorage, tier, cores}` na **dynamic property do mundo** `cl:bar:x,y,z`. Interagir com o item na mão guarda a pilha (duplo toque rápido guarda todos do inventário, como no JABBA). `world.afterEvents.entityHitBlock` (soco) tira 1 pilha (agachado tira 1 item). Leitura do `maxAmount` do ItemStack para a capacidade | Alta | Baixo | — |
| Mostrar o conteúdo na frente | ícone + número renderizado | Bedrock não renderiza item dinâmico em bloco. Opções: (a) **actionbar** quando o jogador olha (`getBlockFromViewDirection` a cada 10–20 ticks, só para jogadores perto); (b) estado `cl:cheio` 0–15 para a barra de preenchimento na textura; (c) entidade invisível com `nameTag` "Ferro ×4096" (1 entidade por barril, custo maior) | Média | Baixo (a) / Médio (c) | Só a actionbar |
| Storage Upgrade | +64 pilhas, 1 slot | Item; interagir no barril: se houver slot livre, `nStorage++` | Alta | Baixo | — |
| Structural MK I–VII | slots 1, 3, 7, 15, 31, 63, 127; materiais tábua → esmeralda; cerca + material | Item com 7 variantes (ou dados por tipo); aplicação em ordem; estado de bloco `cl:tier` 0–7 para a cor da borda (cabe em 16 valores) | Alta | Baixo | Limitar a MK IV (15 slots) para balancear |
| Hopper core + facade | saída a cada 8 ticks pelo lado marcado | No `onTick` (20 ticks), empurrar até 2–3 itens para o inventário adjacente do lado marcado (`getComponent("inventory")` de baú ou funil vanilla). O funil vanilla **não consegue puxar** de bloco custom, então a saída precisa ser feita por script | Alta | Baixo | Saída só para baú adjacente |
| Entrada automática | funil vanilla insere no barril | Funil vanilla **não insere** em bloco custom. No tick, o barril puxa o item igual de um **funil ou baú acima** | Alta | Baixo | — |
| Redstone core + facade | emite sinal | Bloco custom não emite redstone de forma dinâmica no Script API estável. Alternativa: trocar o estado e usar `redstone_conductivity`… **não emite sinal**. Colocar um bloco "emissor" separado ou alternar uma alavanca ou bloco de redstone vizinho via script | Baixa | Baixo | Omitir |
| BSpace (ender core, 2 slots) + Tuning Fork | barris ligados compartilham o conteúdo | Os barris ligados apontam para a mesma chave de dynamic property `cl:bar:link:<id>` | Alta | Baixo | — |
| Integração com o Terminal | o AE1 lia barris pelo Storage Bus | Terminal trata o barril como "inventário virtual" de 1 tipo | Alta | Baixo | — |
| Dolly (baús e máquinas com conteúdo) | ferro + tábua; uso ilimitado | `world.structureManager.createFromWorld("cl:dolly_<uuid>", dim, pos, pos, {includeEntities:false})` salva o bloco **com o NBT (conteúdo do baú)**. Remove o bloco e guarda o id da estrutura na dynamic property do Dolly (não-empilhável). Ao usar: `structureManager.place(...)`, depois `delete` da estrutura. Para blocos do próprio add-on, mover junto a dynamic property do mundo (mudar a chave de posição) | Alta | Baixo | Copiar só itens de baús (`container.getItem`), perdendo encantamentos e NBT especiais |
| Diamond Dolly (spawner, 6 usos) | 3 diamantes + Dolly; 6 spawners | Mesmo processo, com spawner liberado: a estrutura salva o tipo de mob do `mob_spawner`. Durabilidade via `minecraft:durability` (max 6) | Alta | Baixo | — |
| Hammer / remover upgrades | devolve os itens | Interagir agachado com o Martelo: `ActionForm` lista os cores e devolve o escolhido | Alta | Baixo | — |

---

## 4. AutoPackager (pack: 1.4) e AutoUtils (pack: 1.0.1)

### 4.1 AutoPackager — o que faz de verdade (código `MCUpdater/AutoPackager`, commit `1b75db3` = v1.4 para 1.6.4)

**Licença:** **Apache 2.0** (`LICENSE`, commit `254f4ac`). Vale para todo o repositório, inclusive as 2 texturas (`packager_front.png` e `packager_side.png`). Pode reaproveitar código e texturas **com aviso de copyright e da licença**; é permissivo (sem copyleft).

- **Função:** um bloco que, a cada ciclo, procura num **inventário de entrada** um slot com **≥4 itens iguais** e testa se **4 iguais numa grade 2x2** formam uma receita; se não, testa **9 iguais na grade 3x3**. Se houver receita e espaço na saída, tira 4 ou 9 e coloca **1 resultado** no **inventário de saída**. Usa o **gerenciador de receitas** do jogo, então serve para **qualquer** receita "4 iguais" ou "9 iguais": bloco de ferro, glowstone, neve, arenito, pepitas → lingote etc.
  - Na **v1.4** ele também **junta pilhas parciais** do mesmo item no inventário de entrada quando não tem nada para compactar.
  - Os **modos** (2x2 depois 3x3, só 2x2, só 3x3) **só chegaram na 1.4.2** (tag `mc164-1.4.2`). No pack (1.4) o comportamento era **sempre "2x2 primeiro, depois 3x3"**.
  - "Hollow" (como baú ou fornalha) veio na 1.5.3 e "unpackage" depois, ambos no 1.7.10.
- **Lados:** o bloco é orientado. A entrada fica num **lado lateral** (`moveLeft`) e a saída no **lado lateral oposto** (`moveRight`), relativos à frente.
- **Energia:** **sim, usa energia (RF)**. Config `RF_per_cycle` = **1.000 RF por compactação**. Só tenta se tiver **mais de 1.000 RF** guardados. Armazenamento interno: `TileEnergyHandler` da CoFH API, cujo padrão é 32.000 RF (**não confirmei esse número no código do pack**).
- **Tempos:** `cycle_delay_ticks` = **10 ticks** (0,5 s) entre tentativas enquanto consegue compactar; se falhar, espera `idle_delay_ticks` = **200 ticks** (10 s). Cada ciclo faz **no máximo 1 compactação**, então rende até 2 compactações por segundo.
- **Receita:** `F P F / P B P / F C F` (F = lingote de ferro, P = pistão, B = **bancada**, C = **Redstone Reception Coil** do Thermal Expansion, `TEItems.powerCoilGold`). Depende de CoFHCore e ThermalExpansion.

### 4.2 AutoUtils — **não é um mod de blocos**

O "**Autoutils 1.0.1**" do pack é uma **biblioteca** de **AUTOMATIC_MAIDEN**, usada para não repetir código entre os mods dele: **Chisel**, Waypoints, Statues, Safe. **Não adiciona Item Placer, Breaker nem Transferer**, nem bloco nenhum (OpenEye e FTB Wiki: "library", jar `autoutils-1.6.4-1.0.1` de ~80 KB). Ele estava no Crash Landing só porque o **Chisel** precisa dele.
- **Licença:** **não encontrada**. É irrelevante, porque não há mecânica para recriar.
- Se a ideia era ter "placer/breaker" no add-on, isso vem de **outros mods** do pack (por exemplo MineFactory Reloaded ou Thermal Expansion) e deve ser pesquisado à parte.

### Tabela de recriação

| Mecânica original | Números/receita | Como fazer no Bedrock | Viabilidade | Custo no celular | Alternativa se inviável |
|---|---|---|---|---|---|
| AutoPackager: compactar 4→1 (2x2) e 9→1 (3x3) | 2x2 primeiro e depois 3x3; 1 compactação por ciclo | Bloco custom orientado (`minecraft:placement_direction`). No `onTick` (20 ticks): ler o inventário do **baú ou funil à esquerda** e escrever no da **direita** (ou de cima → baixo, mais simples no celular). **Sem API de receitas no Bedrock**: usar uma **tabela fixa**. 9→1: ferro, ouro, cobre, diamante, esmeralda, lápis, redstone, carvão, netherite (lingote), ferro/ouro/cobre bruto, pepitas de ferro e ouro → lingote, trigo → fardo, slime, farinha de osso → bloco de osso, alga seca, ferro comprimido do add-on. 4→1: neve (bolas), argila, glowstone, quartzo, areia → arenito, ametista, favo de mel, tijolo, tijolo do Nether, barbante → lã | Alta | Baixo | Colocar a compactação como receita na Montadora |
| Velocidade | 10 ticks ativo / 200 ticks parado (2 por segundo) | `onTick` de 20 ticks fazendo **até 2 compactações** por tick. Se falhar, guardar `cl:idle = 10` (pular 10 ticks de 20, ou seja 200 ticks) | Alta | Baixo | 1 por tick |
| Energia | 1.000 RF por compactação | Gastar **1 E a cada 8 compactações** (contador na dynamic property; a bateria de 15 E dá 120 compactações). Sem E, para | Alta | Baixo | Sem energia (só tempo) |
| Juntar pilhas parciais | quando ocioso | Opcional: no tick ocioso, `container` → juntar slots iguais. É barato, mas reescreve o baú do jogador | Média | Baixo | Omitir |
| Receita do bloco | ferro, pistões, bancada, bobina TE | Bancada JSON: `F P F / P B P / F X F`, com X = "bobina/circuito" do add-on (ou redstone, como no 1.7.10 sem TE) | Alta | Baixo | — |
| AutoUtils | biblioteca, sem blocos | **Nada a recriar** | — | — | Se quiser placer/breaker, pesquisar MFR ou outro mod |

---

## 5. Prioridade sugerida para o Pouso Forçado

1. **JABBA** (barril + Dolly via `structureManager`): barato, muito útil e se integra direto ao Terminal.
2. **AutoPackager** com tabela fixa: simples.
3. **Células AE1** como itens com dynamic property + **Drive/Chest**, aproveitando o Terminal que já existe. Sem canais.
4. **PneumaticCraft**: pressão por rede, compressor, tubos, Pressure Chamber 3x3x3 (validação com cache). Ferro comprimido por explosão é um bônus.
5. **Autocraft MAC** e **células de fluido**: deixar para o fim (custo médio, depende da tabela de receitas).

## 6. Pontos incertos

- **Números do PneumaticCraft:** são do 1.2.6 (1.7.10). O 1.1.4f (1.6.4) é de código fechado; podem existir pequenas diferenças (por exemplo, se a Pressure Chamber Glass ou o PCB já existiam).
- **Receitas do pack:** Iskandar pode ter alterado receitas no Crash Landing (MineTweaker ou HQM). **Não encontrei** essa lista.
- **AE1:**
  - Quantidade de saída do Fluix Crystal: **não encontrada**.
  - Quantos padrões cabem num Pattern Provider: **não encontrado**.
  - A ordem exata de algumas receitas foi lida das grades HTML do site arquivado.
- **Capacidade de RF do AutoPackager:** os 32.000 RF são o padrão da CoFH API, não confirmado no pack.
- **ExtraCells:** o pack tinha a 1.6.9d e o código lido é da 1.6.9e.
- **Licenças:** a licença do JABBA na época do 1.6.4 e a licença do AutoUtils não foram confirmadas.
- **Bedrock:** o limite exato de tamanho de string em dynamic property (~32 KB) deve ser conferido na versão alvo. Emitir redstone dinâmico a partir de bloco custom não tem suporte direto.

---

## Fontes

- Lista de mods do Crash Landing (versões AE rv14 finale3, ExtraCells 1.6.9d, PneumaticCraft 1.1.4f, JABBA 1.1.4, AutoPackager 1.4, Autoutils 1.0.1): https://ftb.fandom.com/wiki/Crash_Landing (lido via resultado de busca; site bloqueado no ambiente)
- Lista de mods (MyM, servidor 1.6.4): https://mineyourmind.readthedocs.io/en/latest/Modpacks_Server/1.6.4/crash_landing.html
- Lista de mods (fórum Aternos): https://board.aternos.org/thread/4879-modpack-request-ftb-crash-landed/
- PneumaticCraft (código, GPLv3): https://github.com/MineMaarten/PneumaticCraft (commit `a80b62e5`, arquivos `src/pneumaticCraft/lib/PneumaticValues.java`, `common/tileentity/TileEntityPneumaticBase.java`, `TileEntityAirCompressor.java`, `TileEntityPressureChamberValve.java`, `common/recipes/CraftingRegistrator.java`, `common/entity/item/EntityItemSpecial.java`, `common/Config.java`)
- Site oficial arquivado do AE1: https://github.com/AppliedEnergistics/ae1-site-archive (páginas ME-Storage-Math, ME-1k/4k/64k-Storage, Energy-Usage-Information, ME-Controller, ME-Drive, ME-Chest, ME-Network, ME-Crafting, ME-Pattern-Encoder, ME-Pattern-Provider, ME-Crafting-CPU, ME-Processors, Basic/Advanced-Processor-Assembly, Certus-Quartz-Ore, Fluix-Crystal, Quartz-Grind-Stone, Frequently-Asked-Questions, Change-Log/rv14.finale). Versão web: https://appliedenergistics.org/ae1-site-archive/ME-1k-Storage/index.html e https://appliedenergistics.org/ae1-site-archive/ME-Storage-Math/index.html
- Site oficial arquivado do AE2 (canais, Inscriber, Charger, Molecular Assembler, Drive): https://github.com/AppliedEnergistics/ae2-site-archive ; https://appliedenergistics.org/ae2-site-archive/ME-Storage-Math/
- Licença AE2 (README): https://github.com/AppliedEnergistics/Applied-Energistics-2
- ExtraCells 1 (código MIT, 1.6.9e / MC 1.6.4): https://github.com/ExtraCells/ExtraCells1 (`items/ItemStoragePhysical.java`, `items/ItemStorageFluid.java`, `handler/FluidStorageInventoryHandler.java`, `proxy/CommonProxy.java`, `License.txt`)
- Tópico ExtraCells 1.6.9 (FTB Forum): https://forum.feed-the-beast.com/threads/ae-add-on-m3gas-extracells-v-1-6-9-smp-ssp.34073/
- JABBA código da era 1.6.4 + CHANGELOG v1.1: https://github.com/Jorch72/jabba (e https://github.com/Jorch72/jabba/blob/master/CHANGELOG)
- JABBA 1.7.10 (fork GTNH, com o LICENSE CC BY-NC-SA 4.0 "per CurseForge"): https://github.com/GTNewHorizons/JABBA
- JABBA no CurseForge: https://www.curseforge.com/minecraft/mc-mods/jabba ; wiki GTNH: https://wiki.gtnewhorizons.com/wiki/JABBA ; FTB Wiki Storage upgrade: https://ftb.fandom.com/wiki/Storage_upgrade
- AutoPackager (código Apache 2.0): https://github.com/MCUpdater/AutoPackager (commit `1b75db3` = v1.4; tag `mc164-1.4.2`); CurseForge: https://www.curseforge.com/minecraft/mc-mods/autopackager
- AutoUtils (biblioteca de AUTOMATIC_MAIDEN): https://ftbwiki.org/AutoUtils ; https://ftb.fandom.com/wiki/Autoutils ; https://openeye.openmods.info/mod/autoutils/all ; https://archive.org/details/autoutils-1.6.4-1.0.1

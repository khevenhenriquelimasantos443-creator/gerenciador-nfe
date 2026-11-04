# Créditos e licenças — Pouso Forçado

Add-on de sobrevivência para Minecraft Bedrock, **gratuito e sem fins comerciais**.
Todo o código (TypeScript em `scripts/` e os geradores em `tools/`) foi escrito para este projeto.

## Licença do pacote de recursos (RP)

O pacote de recursos é distribuído sob **CC BY-NC-SA 4.0**
(https://creativecommons.org/licenses/by-nc-sa/4.0/): pode copiar e adaptar, dando crédito,
sem vender, e mantendo a mesma licença. Isso permite usar texturas de mods com licenças
CC BY-NC-SA e compatíveis (CC BY, MIT, Apache 2.0), sempre creditadas abaixo. As texturas originais de mods
(seção "Texturas de terceiros") continuam com a licença do mod de onde vieram.

## Avião caído

- Modelo do avião "Nativo 3.1 — Asas Recuadas", feito pelo dono do projeto (`tools/dados/nave/aviao.json`), com as
  turbinas tiradas e a traseira rasgada por `tools/gerar-aviao.mjs`.

## Menu e tela de carregamento

- O panorama do menu, o fundo da troca de dimensão e o ícone do pacote do menu são imagens do deserto do jogo
  (avião caído, destroços, templo soterrado e cidade abandonada) desenhadas por `tools/gerar-panorama.mjs` com as **texturas originais do Minecraft** (Mojang, do repositório
  oficial `Mojang/bedrock-samples`). O logo "Pouso Forçado" e as dicas foram feitos para este projeto.

## Inspiração

- **Waystones** (BlayTheNinth), **Backpacks** (Eydamos), **ComputerCraft** (Daniel Ratcliffe, os programas "tunnel" e
  "excavate" e a conta do combustível), **Extra Utilities** (RWTema) e **Weather2** (Corosauce, os redemoinhos de poeira):
  só as ideias e os números (1.10.0). Código, modelos e arte próprios.
- **Extra Utilities 2** (RWTema; código e arte fechados): espinhos, Lírio Ender, Orquídea Vermelha, laços, Tocha Magnum e
  Candelabro (1.40.0), com os números das páginas do mod no wiki do FTB (ftb.fandom.com e ftbwiki.org). Código e arte
  próprios (`tools/desenhar-xu2.py`).

- **Extreme Reactors** (ZeroNoRyouki; sem licença publicada para a arte): a turbina, a refrigeração ativa, os
  moderadores e as bobinas com os números de ReactorGameData.java e TurbineGameData.java (2.4.18,
  github.com/ZeroNoRyouki/ExtremeReactors2) e as ligas do reprocessador. Código e arte próprios.
- **Iron Jetpacks** (BlakeBr0; MIT, inclusive a arte; github.com/BlakeBr0/IronJetpacks, 26.1): os jetpacks com os
  números do mod e as receitas geradas por ele; a arte das peças (tingida com a cor de cada tier, como o mod faz). O
  modelo vestido e o voo são código próprio (`tools/importar-jetpacks-tochas.py`).
- **TorchMaster** (xalcon; MIT, inclusive a arte; github.com/xalcon/TorchMaster, 21.9): a Mega Tocha e a Lanterna
  Sinalizadora com os raios do mod e a arte do mod. Código próprio.
- **Iron Chests** (progwml6; GPL-3, inclusive a arte; github.com/progwml6/ironchest): os baús com os tamanhos do mod
  e as melhorias; a arte dos baús (o atlas do modelo vira as faces do bloco) e das melhorias
  (`tools/importar-baus-gavetas.py`). A licença está em `docs/licencas/ironchest.txt`.
- **Storage Drawers** (jaquadro; MIT, inclusive a arte; github.com/jaquadro/StorageDrawers, 13.2): as gavetas com as
  capacidades e os multiplicadores do mod, a compactadora, o controlador e as melhorias, com a arte do mod. Código
  próprio.
- **Artifacts** (Wouter Pauwels/ochotonida; MIT, inclusive a arte; github.com/ochotonida/artifacts, 15.1.3): os
  artefatos com os números do mod e a arte dos itens (`tools/importar-artifacts.py`). A Tela de Artefatos e os
  efeitos são código próprio.
- **Sophisticated Backpacks** (P3pp3rF1y; código e arte com todos os direitos reservados): as melhorias da mochila
  (1.14.0) e, desde a 1.25.0, a versão 3.26.19 (a mais nova): os níveis Couro, Cobre, Ferro, Ouro, Diamante e Netherita
  com os espaços e as melhorias de cada um, o raio dos ímãs e o formato das receitas. Só as ideias e os números; código
  e ícones próprios.

- **Create** (simibubi e equipe, MIT; desde a 1.23.0 com as receitas do Create 6.0.11, o mais novo, lidas por
  `tools/importar-create.py`): rotação e estresse (Manivela, Roda d'Água, Moinho de Vento, eixos, engrenagens,
  Mó, Rodas Trituradoras, Prensa, Misturador, Ventilador e Furadeira), com os números de estresse e as receitas do código
  público (github.com/Creators-of-Create/Create). Código e arte próprios.

- **Ender IO** (CrazyPants, SleepyTrousers e Team Ender IO, Unlicense/CC0): desde a 1.20.0 o Ender IO 9, o mais novo
  (github.com/Team-EnderIO/EnderIO, ramo 26.3), com os itens, os nomes em português, as receitas (bancada, Fundição de
  Ligas, Triturador SAG, Fatiar e Emendar, Vinculador de Almas, Crisol, tanques, fogo) e os números das configurações
  lidos do código por `tools/importar-enderio.py`; a arte original também (CC0; DTFuel, NeepNoop e os autores do Travel
  Anchors liberaram as suas em CC0, veja docs/licencas/enderio.txt). Código do pack próprio.

- **Mekanism** 10.7 (1.21.0, o mais novo; aidancbrady e equipe, MIT): processamento de minério ×2/×3/×4, máquinas e
  receitas lidas do código por `tools/importar-mekanism.py`, com a arte original.

- **Mekanism Generators** e **Mekanism Tools** (aidancbrady, MIT): geradores, ferramentas e armaduras, com os números lidos
  no código-fonte público (github.com/aidancbrady/Mekanism). Código próprio; as armaduras usam a textura da armadura de
  ferro do jogo (Mojang, `Mojang/bedrock-samples`) tingida por `tools/gerar-armaduras.mjs`.

- **Galacticraft** (micdoodle8 e equipe, LGPL 3.0): a viagem à Lua, as máquinas de oxigênio, a Bancada da NASA e o
  Foguete Tier 1. Os números (receitas, tanques, consumo, crateras, combustível) foram lidos no código-fonte público
  do mod (github.com/micdoodle8/Galacticraft); o código daqui é próprio, e o modelo do foguete e as texturas foram
  feitos para este projeto (`tools/gerar-foguete.mjs`). Os monstros evoluídos e o chefe partem das definições dos
  monstros do jogo nos exemplos oficiais da Mojang (`Mojang/bedrock-samples`, em `referencias/vanilla/entidades/`),
  com a vida e o comportamento do Galacticraft (`tools/gerar-evoluidos.mjs`); usam as texturas do próprio jogo.
  Desde a 1.17.0 também o Enderman e a Bruxa Evoluídos, e todos usam um traje espacial (capacete e tanques) desenhado
  para este projeto sobre os modelos do jogo (`referencias/vanilla/modelos`, dos mesmos exemplos da Mojang). Os
  planetas do céu da Lua também são arte própria (`tools/gerar-ceu-lua.mjs`).

- **Powah!** (owmii, LGPL-3.0, github.com/owmii/Powah): geradores, células, cabos e o Orbe Energizador (1.18.0). A arte
  dos itens e das faces dos blocos é a do mod e os números e receitas foram lidos do código (`tools/importar-powah.py`;
  licença em `docs/licencas/powah.txt`). O código daqui é próprio.

- **Crash Landing**, modpack de Iskandar (Minecraft 1.6.4): a ideia de cair num planeta seco,
  a sede, a água que precisa ser tratada e a progressão por quests. Nenhum texto do pack foi copiado.
- **Ex Nihilo** (Erasmus_Crowley) e **Ex Aliquo** (Zerokyuuni, MIT): peneira, martelo, barril, cadinho,
  cajado e bicho-da-seda, com as tabelas e tempos do mod. Texturas e modelos próprios (as do Ex Nihilo
  não têm licença encontrada).
- **EnviroMine** (Funwayguy, TimbuckTato, GenDeathrow; CC BY-NC-SA 4.0): hidratação, temperatura do corpo,
  qualidade do ar, Camel Pack e máscara de gás, com os números do mod. Código e texturas próprios.
- **Hunger Overhaul** (iguanaman): valores de comida, regeneração, efeitos de status baixo e animais.
- **Tinkers' Construct** (mDiyo e SlimeKnights; texturas CC BY 3.0) e **Iguana Tweaks** (iguanaman): peças,
  ferramentas montadas, materiais, níveis de mineração e XP com os números do mod. Desde a 1.26.0, o **Tinkers'
  Construct 3.12.1** completo (MIT, inclusive a arte; github.com/SlimeKnights/TinkersConstruct): os 40 materiais com
  os números e os traços do mod, as peças e ferramentas de mão, as áreas, o cobalto, as ligas, os materiais compostos
  e a arte das peças, ferramentas, lingotes e blocos (pintada com as paletas do mod), lidos por
  `tools/importar-tinkers3.py`; o mundo dos slimes, as armaduras e armas, a fundição inteira e (1.30.0) os
  modificadores, a Bigorna, os livros, as ferramentas antigas, os cajados e as geringonças, com a arte do mod
  (`tools/importar-slime-tc3.py`, `-armas.py`, `-fundicao.py` e `-extras.py`). Os textos dos livros são próprios.
- **Thermal Expansion** (Team CoFH): as máquinas da Fase 17 e os custos em RF. Código e desenhos próprios. Na 1.42.0, o
  Thermal Expansion 11 (branch 1.20.x, `tools/importar-thermal11.py`): os dínamos com os combustíveis do ThermalCore
  (data/thermal/recipes/fuels e basePower 40), o Insolador e o Pirolisador com as receitas e energias do mod.
- **JABBA** (ProfMobius), **AutoPackager** (Wolf_IV), **Applied Energistics** (AlgorithmX2) e **ExtraCells** (M3gaFr3ak):
  barril e upgrades, carrinho, empacotador, células ME com os bytes do AE1, drive, baú ME e terminal sem fio.
  Código e desenhos próprios.
- **MineFactory Reloaded** (PowerCrystals, skyboy): máquinas de fazenda e de blocos com os custos em RF. Código e
  desenhos próprios.
- **PneumaticCraft** (MineMaarten): ar comprimido, tubos, pressão e câmara de pressão com os números do mod.
  Código e desenhos próprios.
- **Sync** (iChun): corpos reserva, construtor, armazém, esteira e acordar no clone. Código e desenhos próprios.
- **Big Reactors** (Erogenous Beef; MIT): o reator de yellorium, moderadores, barras de controle e cianita, com
  uma fórmula fechada no lugar da simulação. Código e desenhos próprios.
- **Chisel** (Cricket, AUTOMATIC_MAIDEN, Drullkus): o cinzel e as variantes de bloco. Texturas próprias.
- **BiblioCraft** (Nuchaz): estante, prateleira, suporte de ferramentas, expositor, cabide e luminárias. Código e
  desenhos próprios.
- **ChickenChunks** (ChickenBones): carregadores de chunk, feitos com as áreas carregadas do Bedrock.
- **Mekanism** (aidancbrady; MIT): separador eletrolítico, evaporador, infusores, câmaras de purificação e injeção,
  cubos de energia e jetpack, em versão leve (sem reatores nem rede de gás). Código e desenhos próprios.
- **BuildCraft** (SpaceToad e equipe): petróleo, bomba, refinaria, motor a combustão, pedreira e engrenagens.
  Código e desenhos próprios.
- **OpenBlocks** (Mikee, NeverCast, boq; MIT): asa-delta, túmulo e elevador. Código e desenhos próprios.
- **The Spice of Life** (squeek502): comida repetida rende menos (usado no Crash Landing). Código próprio.
- **Pam's HarvestCraft** (MatrexsVigil / pamharvestcraft): plantações, utensílios de cozinha e receitas
  (nomes traduzidos, ingredientes do mod). Texturas, ícones e modelos próprios (as do mod não podem ser usadas).
- **Hardcore Questing Mode** (Vswe, lorddusk): o Diário de Bordo em capítulos, dependências,
  recompensas "escolha 1" e as sacolas de recompensa com os pesos do HQM. Ícones próprios.
- **Just Enough Items** (mezz) / NEI (ChickenBones): o Catálogo de receitas e usos.
- **WAILA** (ProfMobius, Apache 2.0): o "o que estou olhando" na barra de ação.
- **Inventory Tweaks** (Kobata, Marwane Kalam-Alami, MIT): o Organizador e o reabastecimento da mão.
- **Thermal Expansion** (Team CoFH): a unidade de energia RF e a escala (80 RF/t do Steam Dynamo,
  32.000 RF por carvão). Só os números; nenhuma arte.
- **Applied Energistics** (AlgorithmX2): o Terminal de Armazenamento.

## Ícones

Os ícones desenhados (itens, ovos dos monstros e os ícones de menu das máquinas) foram feitos pelo
autor do projeto com ajuda de IA. Ficam em `RP/textures/items/cl/arte/` e são importados por
`tools/importar-icones.py`; onde ainda não há desenho, vale o ícone gerado pelos scripts. A tela do Diário de
Bordo (moldura, barras, botões e os ícones dos sistemas da nave, em `RP/textures/ui/cl/painel/`) também.

## Texturas de terceiros

Desde a 1.10.1, os itens e blocos dos mods abaixo usam as **texturas e ícones originais** do mod, copiados do
código-fonte público por `tools/importar-originais.py` (a lista de cada um fica em `docs/licencas/usados.json` e
a licença de cada repositório em `docs/licencas/`). Animações viram o 1º quadro; as ferramentas do Tinkers são
as camadas do próprio mod sobrepostas. Cada arquivo continua com a licença do mod:

| Mod | Autores | Licença da arte | Repositório |
|---|---|---|---|
| Mekanism, Generators e Tools | aidancbrady e equipe (arte: Cheapshot, Archadia e outros) | MIT | github.com/mekanism/Mekanism (10.7, 1.21.1; e 1.7.10) |
| Mekanism Additions | aidancbrady e equipe | MIT | github.com/mekanism/Mekanism (1.20) |
| Farmer's Delight | vectorwing e equipe | MIT | github.com/vectorwing/FarmersDelight (1.3.0, 26.1; e 1.20) |
| Quark (1.12.0 e o 4.1 na 1.37.0: arte, modelos 3D convertidos, saque da Caixa de Monstros e números dos módulos) | Vazkii e equipe | CC BY-NC-SA 3.0 | github.com/VazkiiMods/Quark (master, 4.1) |
| Immersive Aircraft (ícones, modelos 3D e texturas das aeronaves) | Luke100000 e equipe | GPLv3 | github.com/Luke100000/ImmersiveAircraft |
| Ender IO 9 (e os condutos) | CrazyPants, SleepyTrousers e Team Ender IO | Unlicense / CC0 | github.com/Team-EnderIO/EnderIO (26.3) |
| Waystones | BlayTheNinth | MIT (1.7.10; a 26.3 é "todos os direitos reservados": só ideias e números, arte própria) | github.com/blay09/Waystones (1.7.10; e 26.3) |
| ComputerCraft | Daniel Ratcliffe | ComputerCraft Public License (uso em mods sem fins comerciais) | github.com/dan200/ComputerCraft |
| CC: Tweaked 1.121 (1.39.0: monitor, impressora, alto-falante, páginas e livro; limites de combustível do Config.java) | Daniel Ratcliffe e os desenvolvedores do CC: Tweaked | CCPL (texturas) e MPL-2.0 (alto-falante) | github.com/cc-tweaked/CC-Tweaked (mc-1.21.x) |
| Iron Jetpacks | BlakeBr0 | MIT | github.com/BlakeBr0/IronJetpacks (26.1) |
| TorchMaster | xalcon | MIT | github.com/xalcon/TorchMaster (21.9) |
| Iron Chests | progwml6 | GPL-3 | github.com/progwml6/ironchest (1.21.9) |
| Storage Drawers | jaquadro | MIT | github.com/jaquadro/StorageDrawers (13.2, 26.3) |
| Artifacts | Wouter Pauwels (ochotonida) | MIT | github.com/ochotonida/artifacts (15.1.3, 26.1) |
| Tinkers' Construct | mDiyo e SlimeKnights | MIT (TC3) e CC BY 3.0 (1.7.10) | github.com/SlimeKnights/TinkersConstruct (3.12.1, 1.20.1; e 1.7.10) |
| Applied Energistics 2 | AlgorithmX2, Ridanisaurus Rid e equipe | CC BY-NC-SA 3.0 | github.com/AppliedEnergistics/Applied-Energistics-2 (main, 26.3; e rv3) |
| PneumaticCraft | MineMaarten | GPLv3 | github.com/MineMaarten/PneumaticCraft |
| PneumaticCraft: Repressurized 8.2 (1.44.0: compressores Avançado e Líquido, combustíveis e receitas da câmara; PneumaticValues) | desht e TeamPneumatic | GPLv3 | github.com/TeamPneumatic/pnc-repressurized (1.21) |
| Big Reactors | Erogenous Beef | MIT | github.com/erogenousbeef/BigReactors |
| BuildCraft | SpaceToad e equipe | Minecraft Mod Public License | github.com/BuildCraft/BuildCraft (7.1) |
| BuildCraft 8 (1.43.0: motores de Redstone e Stirling, Poço de Mineração, Comporta, Enchedor e Marco; números de TileEngine*_BC8, BlockUtil e SnapshotBuilder) | SpaceToad e equipe | Minecraft Mod Public License | github.com/BuildCraft/BuildCraft (8.0.x-1.12.2) |
| OpenBlocks | OpenMods | MIT | github.com/OpenMods/OpenBlocks |
| Chisel | Chisel Team | GPLv2 | github.com/Chisel-Team/Chisel (1.7) |
| ChickenChunks | ChickenBones e equipe | MIT | github.com/TheCBProject/ChickenChunks |
| EnviroMine | Funwayguy, TimbuckTato e equipe | CC BY-NC-SA 4.0 | github.com/EnviroMine/EnviroMine-1.7 |

Também usados fora do próprio mod: os pós de ferro, ouro, cobre e estanho são os do Mekanism; os lingotes de bronze,
aço, estanho e alumínio são os do Tinkers; o silício é o do AE2.

**Ficaram com a arte própria** (a licença não deixa usar a arte): Create (arte "todos os direitos reservados"),
Galacticraft antigo (proíbe versões para outras plataformas; desde a 1.41.0 a arte é a do **Galacticraft 5**, da Team
Galacticraft, licença MIT, github.com/TeamGalacticraft/Galacticraft, `tools/importar-gc5.py`), Extra Utilities (código fechado), Thermal Expansion, MineFactory
Reloaded, Pam's HarvestCraft, Sync, JABBA, BiblioCraft, Ex Nihilo, Backpacks e Hunger Overhaul (sem licença publicada),
Sophisticated Backpacks (todos os direitos reservados).
Os add-ons de Bedrock parecidos (Space.PE, Create e Extra Utilities feitos por outras pessoas) também não entram.
Alguns desses ícones foram redesenhados por `tools/desenhar-similares.py` lembrando o formato e as cores dos originais
(desenho próprio, nenhum pixel copiado).

## Dados do jogo

Os nomes e ícones dos itens do Minecraft no Catálogo apontam para o pacote de recursos do próprio
jogo (caminhos tirados de Mojang/bedrock-samples); nenhum arquivo do jogo é copiado para o add-on.

### Immersive Engineering (1.13.0 e 1.38.0)

Na 1.38.0, as receitas e os números do IE 12.4 (branch 1.21.1, `tools/importar-ie12.py`): Prensa de Metal e moldes,
Triturador, Serraria, Espremedor, Fermentador, Refinaria, Gerador a Diesel (IEServerConfig: 4.096 RF/t), Gerador
Termelétrico (√ΔT/2 por eixo, do ThermoelectricGenBlockEntity) e Campânula de Jardim (8 RF/t). Código e arte próprios.

Mecânicas e números do Immersive Engineering (BluSunrize e equipe, código GPLv3, github.com/BluSunrize/ImmersiveEngineering,
branch 1.20.1): Forno de Coque, Alto-Forno, creosoto e madeira tratada, cânhamo, Moinho de Vento, Roda d'Água e Dínamo
Cinético. A arte do IE pede permissão antes de ser copiada, então os blocos, itens e as pás têm arte própria.
Os modelos das aeronaves (Immersive Aircraft) foram convertidos do Blockbench para o Bedrock por `tools/gerar-aeronaves.py`.

# Créditos e licenças — Pouso Forçado

Add-on de sobrevivência para Minecraft Bedrock, **gratuito e sem fins comerciais**.
Todo o código (TypeScript em `scripts/` e os geradores em `tools/`) foi escrito para este projeto.

## Licença do pacote de recursos (RP)

O pacote de recursos é distribuído sob **CC BY-NC-SA 4.0**
(https://creativecommons.org/licenses/by-nc-sa/4.0/): pode copiar e adaptar, dando crédito,
sem vender, e mantendo a mesma licença. Isso permite usar texturas de mods com licenças
CC BY-NC-SA e compatíveis (CC BY, MIT, Apache 2.0), sempre creditadas abaixo.

## Avião caído

- Modelo do avião "Nativo 3.1 — Asas Recuadas", feito pelo dono do projeto (`tools/dados/nave/aviao.json`), com as
  turbinas tiradas e a traseira rasgada por `tools/gerar-aviao.mjs`.

## Menu e tela de carregamento

- O panorama do menu, o fundo da troca de dimensão e o ícone do pacote do menu são imagens do deserto do jogo
  (avião caído, destroços, templo soterrado e cidade abandonada) desenhadas por `tools/gerar-panorama.mjs` com as **texturas originais do Minecraft** (Mojang, do repositório
  oficial `Mojang/bedrock-samples`). O logo "Pouso Forçado" e as dicas foram feitos para este projeto.

## Inspiração

- **Crash Landing**, modpack de Iskandar (Minecraft 1.6.4): a ideia de cair num planeta seco,
  a sede, a água que precisa ser tratada e a progressão por quests. Nenhum texto do pack foi copiado.
- **Ex Nihilo** (Erasmus_Crowley) e **Ex Aliquo** (Zerokyuuni, MIT): peneira, martelo, barril, cadinho,
  cajado e bicho-da-seda, com as tabelas e tempos do mod. Texturas e modelos próprios (as do Ex Nihilo
  não têm licença encontrada).
- **EnviroMine** (Funwayguy, TimbuckTato, GenDeathrow; CC BY-NC-SA 4.0): hidratação, temperatura do corpo,
  qualidade do ar, Camel Pack e máscara de gás, com os números do mod. Código e texturas próprios.
- **Hunger Overhaul** (iguanaman): valores de comida, regeneração, efeitos de status baixo e animais.
- **Tinkers' Construct** (mDiyo e SlimeKnights; texturas CC BY 3.0) e **Iguana Tweaks** (iguanaman): peças,
  ferramentas montadas, materiais, níveis de mineração e XP com os números do mod. Código e desenhos próprios.
- **Thermal Expansion** (Team CoFH): as máquinas da Fase 17 e os custos em RF. Código e desenhos próprios.
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
`tools/importar-icones.py`; onde ainda não há desenho, vale o ícone gerado pelos scripts.

## Texturas de terceiros

Nenhuma até esta versão. As próximas fases listam aqui cada textura reaproveitada, com autor,
mod e licença.

## Dados do jogo

Os nomes e ícones dos itens do Minecraft no Catálogo apontam para o pacote de recursos do próprio
jogo (caminhos tirados de Mojang/bedrock-samples); nenhum arquivo do jogo é copiado para o add-on.

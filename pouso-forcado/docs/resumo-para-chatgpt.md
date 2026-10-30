# Pouso Forçado — o que mudou (versões 1.9.0 a 1.12.0)

Resumo para atualizar o ChatGPT, que fez as telas do site, o Diário e boa parte dos ícones. A versão atual é a **1.12.0**.
A wiki (pouso-forcado.vercel.app) ainda descreve a 1.10.0 e vai ser refeita no visual novo («Da queda ao recomeço»).

## 1. Mudança de regra na arte (importante para os ícones)

Antes, o pack só usava arte própria (desenhada pelo ChatGPT/IA ou gerada por script). **Agora, quando a licença do mod
deixa, usamos as texturas e os ícones ORIGINAIS do mod**, mesmo fora do tema. Por isso, parte dos ícones que o ChatGPT
desenhou foi **substituída** pelos originais.

**Mods com arte original (os ícones do ChatGPT destes mods não valem mais):**
Mekanism (e Generators, Tools, Additions), Ender IO, Waystones, ComputerCraft, Tinkers' Construct, Applied Energistics 2,
PneumaticCraft, Big Reactors, BuildCraft, OpenBlocks, Chisel, ChickenChunks, EnviroMine, Farmer's Delight e Quark.
Exemplos do que mudou: ferramentas e peças do Tinkers, células e componentes ME, lingotes do Yellorium/Cianita, engrenagens
do BuildCraft, Camel Pack, máscara e filtro (EnviroMine), cilindros e ligas do Mekanism, máquinas do Mekanism e do Ender IO,
o Moinho SAG, os painéis, as armaduras (no corpo também), blocos do Chisel (mármore, calcário, arenito, pedra e vidro).
Os pós de metal agora são os do Mekanism; os lingotes de bronze, aço, estanho e alumínio são os do Tinkers.

**Continuam com arte própria (a licença não deixa usar a original):** Create, Galacticraft, Extra Utilities, Thermal
Expansion, MineFactory Reloaded, Pam's HarvestCraft, Sync, JABBA, BiblioCraft, Ex Nihilo, Backpacks e Hunger Overhaul.
Desses, alguns ícones foram redesenhados "parecidos com o original": Foguete Tier 1, Máscara e Equipamento de Oxigênio,
os três tanques, bico/aleta/motor do foguete, Hélice e Batedor (Create), Regador e Robô Minerador.

**Continuam valendo os desenhos do ChatGPT:** os itens e máquinas da nave (Placa de Casco, Computador de Bordo, Célula de
Combustível, Motor da Nave, Painel da Nave), os condensadores de água, as águas, a peneira, o Diário, a bússola do avião,
as máquinas do Thermal (Pulverizador, Fornalha de Redstone, Fundidora de Indução, Serraria, Extrusora Ígnea, Precipitador
Glacial), o Gerador, a Bateria, o Painel Solar, o Barril de Armazenamento e os ovos dos monstros.

O pacote `icones_reais_para_o_site.zip` tem o ícone real de cada coisa que aparece nas telas do site (veja a seção 4).

## 2. Versões novas

- **1.9.0 — Create:** rotação e estresse (SU) com os números do Create. Manivela, Roda d'Água e Rolamento de Moinho com
  velas; eixos, engrenagens, caixa de engrenagens e Controlador de Velocidade; Mó, Rodas Trituradoras, Prensa Mecânica,
  Misturador Mecânico, Ventilador Revestido (lava e cozinha itens) e Furadeira. Zinco na peneira, latão, liga de andesita.
- **1.10.0 — Utilidades:** Pedras do Caminho (Waystones) com Pedra de Viagem e pergaminhos; Mochila de 27 espaços (vira um
  baú no chão); Robô Minerador (Mining Turtle do ComputerCraft: túnel e escavação); Extra Utilities (Lixeira, Regador,
  Bloco Angelical, Varinhas do Construtor, Pedregulho Comprimido 1x–8x); redemoinhos de poeira do Weather2.
- **1.10.1 / 1.10.2 — Texturas originais** dos mods que permitem (407 trocas) e os ícones "parecidos" (seção 1).
- **1.11.0 — Mekanism Additions e condutos do Ender IO:** plástico nas 16 cores (bloco, liso, brilhante, reforçado e
  estrada), Painéis Brilhantes, Balões, TNT de Obsidiana, filhotes de creeper/esqueleto/enderman; Conduto de Energia e
  Conduto de Itens. Corrigido: o Creeper Evoluído da Lua não explodia.
- **1.12.0 — Farmer's Delight e Quark:** facas, Tábua de Cortar, Panela de Cozinha (em cima de fogo ou do Fogão), Fogão,
  repolho, caixotes, palha, lona, corda e ~45 comidas com **Nutrição** e **Conforto**; do Quark, blocos de armazenamento,
  jaspe e xisto, vidro emoldurado, placa de ferro, lanterna de papel, o Picarango (picareta de arremesso), colheita com
  toque, portas duplas e a corda que dá para subir.

Agora são **32 capítulos** de missões no Diário (entraram Create, Utilidades, Mekanism Additions, Farmer's Delight e Quark).

**Próximas:** 1.13.0 (Immersive Engineering e Immersive Aircraft — aviões!) e 1.14.0 (melhorias da Mochila e estruturas
do deserto). Botania não entra. Nenhum bicho peçonhento novo.

## 3. Site novo

O usuário aprovou o visual das telas «Da queda ao recomeço» (marfim, grafite e laranja; logo nova). Subtítulo escolhido:
**Pouso Forçado: Da Queda ao Recomeço**. O Claude vai montar uma prévia num projeto separado, sem substituir o site atual.
Os assuntos da wiki agora incluem também Create, Utilidades, Mekanism Additions, Farmer's Delight e Quark.

## 4. Ícones nas telas do site (o que trocar nos mockups)

Use os arquivos do pacote (pasta `icones/`, um PNG por item/bloco, e `faces/` com as faces dos blocos). Correções:

| Tela | No mockup | Use |
|---|---|---|
| Início, Nave | Casco, Computador, Combustível, Motor (desenhos genéricos) | `placa_casco`, `computador_bordo`, `celula_combustivel`, `motor_nave` |
| Início, Água, Busca | condensador genérico | `condensador_agua` e `condensador_avancado` (são diferentes) |
| Água | garrafas | `agua_excelente`, `agua_boa`, `agua_suja`, `agua_impropria` |
| Água, Busca | mochila de couro como Camel Pack | `camel_pack` (é o original do EnviroMine) |
| Início | mesa como "Recursos" | `peneira` |
| Guias | Ex Nihilo (muda na terra) | `peneira` |
| Guias | Ferramentas | `picareta_ferro` (Tinkers, original) |
| Guias | Mekanism | `separador_eletrolitico` |
| Guias | Ender IO | `fundidora_ligas` (original do Ender IO) |
| Guias | Create | `engrenagem` |
| Guias | Perigos (aranha) | **sem aranha**: `ovo_mumia` |
| Guias | Lua (pedra) | `rocha_lunar` ou `foguete_t1`; Núcleo de Salto = `nucleo_salto` |
| Guias | Utilidades | `pedra_caminho` |
| Máquinas | as 6 do Thermal | os 6 arquivos com o nome de cada máquina |
| Nave | Painel da Nave | `painel_nave` |

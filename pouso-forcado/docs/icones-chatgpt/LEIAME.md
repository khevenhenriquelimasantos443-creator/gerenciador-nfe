# Pouso Forçado: ícones do ChatGPT para refazer (189 ícones, 2 partes)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Estes ícones ainda são os que o
ChatGPT desenhou no começo do projeto (o filtro "ChatGPT" da lista de todos os ícones) e precisam ficar no mesmo estilo
das artes novas do AI Studio.

## O que pedir (mande uma parte por vez)
Faça um script Node.js (`.mjs`) igual ao das artes aprovadas: uma lista `ARTES` com `{ "path", "base64" }` e um laço que
grava cada PNG. Para cada ícone da parte:
- **Parte 1 (itens):** `path`: `RP/textures/items/cl/arte/<arquivo>`; `base64`: PNG **16×16**, fundo transparente.
- **Parte 2 (blocos):** `path`: `RP/textures/items/cl/arte/blocos/<arquivo>`; `base64`: PNG **32×32**, fundo
  transparente, o bloco em 3D isométrico (como aparece no inventário: topo e dois lados, o da esquerda mais claro).
  Esse ícone aparece no Catálogo e nos menus; no inventário o bloco continua com as faces dele.
- O nome do arquivo é o da tabela, sem mudar nada: é o ID no jogo.

## Estilo (o mesmo das artes aprovadas do AI Studio)
- Pixel art do Minecraft, legível no celular: silhueta clara, contorno escuro de 1 px, luz de cima à esquerda.
- Poucas cores por ícone, sem anti-aliasing e sem pixel semitransparente na borda.
- Coisas da mesma família ficam com a mesma forma e mudam só a cor (todas as células de energia iguais com a cor do
  nível, todos os barris iguais...), como nos mods.
- Comida do HarvestCraft: desenhe o prato de verdade pelo nome em inglês, que é o do mod.
- Máquinas: a frente com o detalhe da máquina (tela, engrenagem, chama...) e os lados em metal.
- Não use nem copie a arte original do mod: desenho próprio que só lembra o original.

## Regras
- Não renomear arquivos nem IDs (quebraria os mundos salvos).
- Responda só com o script, em um bloco de código, sem explicação.

## Parte 1 de 2: Itens (106 ícones)

Ícones de hoje: `parte-1.png` (o número embaixo de cada um é o da lista). `path`: `RP/textures/items/cl/arte/<arquivo>`.

| # | arquivo | nome no jogo | nome original (inglês) | mod |
|---|---|---|---|---|
| 1 | `arroz_frito.png` | Arroz Frito | Fried Rice | Pam's HarvestCraft |
| 2 | `barra_borracha.png` | Barra de Borracha | Rubber Bar | MineFactory Reloaded |
| 3 | `bicho_seda.png` | Bicho-da-seda | Silkworm | Pouso Forçado e outros |
| 4 | `bicho_seda_cozido.png` | Bicho-da-seda Cozido | Cooked Silkworm | Pouso Forçado e outros |
| 5 | `bolinho_arroz.png` | Bolinho de Arroz | Rice Cake | Pam's HarvestCraft |
| 6 | `broa_milho.png` | Broa de Milho | Cornbread | Pam's HarvestCraft |
| 7 | `bussola_aviao.png` | Bússola do Avião | Plane Compass | Pouso Forçado |
| 8 | `cadinho_cru.png` | Cadinho Cru | Unfired Crucible | Pouso Forçado e outros |
| 9 | `cajado.png` | Cajado | Crook | Pouso Forçado e outros |
| 10 | `cajado_osso.png` | Cajado de Osso | Bone Crook | Ex Nihilo |
| 11 | `cajado_ouro.png` | Cajado de Ouro | Golden Crook | Ex Aliquo |
| 12 | `caldo.png` | Caldo | Stock | Pam's HarvestCraft |
| 13 | `carrinho.png` | Carrinho | Dolly | JABBA |
| 14 | `carrinho_diamante.png` | Carrinho de Diamante | Diamond Dolly | JABBA |
| 15 | `catalogo.png` | Catálogo | Catalog | Pouso Forçado e outros |
| 16 | `celula_agua.png` | Célula de Água | Water Storage Cell | ExtraCells |
| 17 | `celula_combustivel.png` | Célula de Combustível | Fuel Cell | Pouso Forçado e outros |
| 18 | `charque.png` | Charque | Beef Jerky | Pam's HarvestCraft |
| 19 | `chave_barril.png` | Chave de Barril | Barrel Hammer | JABBA |
| 20 | `chili_poppers.png` | Pimentas Empanadas | Chili Poppers | Pam's HarvestCraft |
| 21 | `cilindro_acido.png` | Cilindro de Ácido Clorídrico | Hydrogen Chloride Tank | Mekanism |
| 22 | `cilindro_cloro.png` | Cilindro de Cloro | Chlorine Tank | Mekanism |
| 23 | `cilindro_hidrogenio.png` | Cilindro de Hidrogênio | Hydrogen Tank | Mekanism |
| 24 | `cilindro_oxigenio.png` | Cilindro de Oxigênio | Oxygen Tank | Mekanism |
| 25 | `cilindro_vazio.png` | Cilindro de Gás Vazio | Empty Gas Tank | Mekanism |
| 26 | `circuito.png` | Circuito | Circuit | Pouso Forçado e outros |
| 27 | `cobre_po.png` | Pó de Minério de Cobre | Powdered Copper Ore | Pouso Forçado e outros |
| 28 | `cobre_quebrado.png` | Pedaço Quebrado de Cobre | Broken Copper Ore | Pouso Forçado e outros |
| 29 | `cobre_triturado.png` | Pedaço Triturado de Cobre | Crushed Copper Ore | Pouso Forçado e outros |
| 30 | `computador_bordo.png` | Computador de Bordo | Flight Computer | Pouso Forçado e outros |
| 31 | `coracao_farao.png` | Coração do Faraó | Pharaoh's Heart | Pouso Forçado e outros |
| 32 | `diario_bordo.png` | Diário de Bordo | Logbook | Pouso Forçado e outros |
| 33 | `estanho_po.png` | Pó de Minério de Estanho | Powdered Tin Ore | Tinkers' Construct |
| 34 | `estanho_quebrado.png` | Pedaço Quebrado de Estanho | Broken Tin Ore | Tinkers' Construct |
| 35 | `estanho_triturado.png` | Pedaço Triturado de Estanho | Crushed Tin Ore | Tinkers' Construct |
| 36 | `faixa_mumia.png` | Faixa de Múmia | Mummy Wrap | Pouso Forçado e outros |
| 37 | `farinha.png` | Farinha | Flour | Pam's HarvestCraft |
| 38 | `feijao_assado.png` | Feijão Assado | Baked Beans | Pam's HarvestCraft |
| 39 | `ferro_po.png` | Pó de Minério de Ferro | Powdered Iron Ore | Pouso Forçado e outros |
| 40 | `ferro_quebrado.png` | Pedaço Quebrado de Ferro | Broken Iron Ore | Pouso Forçado e outros |
| 41 | `ferro_triturado.png` | Pedaço Triturado de Ferro | Crushed Iron Ore | Pouso Forçado e outros |
| 42 | `fertilizante.png` | Fertilizante | Fertilizer | MineFactory Reloaded |
| 43 | `folha_plastico.png` | Folha de Plástico | Plastic Sheet | MineFactory Reloaded |
| 44 | `fragmento_meteorito.png` | Fragmento de Meteorito | Meteorite Fragment | Pouso Forçado |
| 45 | `fuba.png` | Fubá | Cornmeal | Pam's HarvestCraft |
| 46 | `jetpack.png` | Jetpack | Jetpack | Mekanism |
| 47 | `maionese.png` | Maionese | Mayonnaise | Pam's HarvestCraft |
| 48 | `martelo_cobre.png` | Martelo de Cobre | Copper Hammer | Pouso Forçado e outros |
| 49 | `martelo_diamante.png` | Martelo de Diamante | Diamond Hammer | Pouso Forçado e outros |
| 50 | `martelo_ferro.png` | Martelo de Ferro | Iron Hammer | Pouso Forçado e outros |
| 51 | `martelo_madeira.png` | Martelo de Madeira | Wooden Hammer | Pouso Forçado e outros |
| 52 | `martelo_ouro.png` | Martelo de Ouro | Golden Hammer | Pouso Forçado e outros |
| 53 | `martelo_pedra.png` | Martelo de Pedra | Stone Hammer | Pouso Forçado e outros |
| 54 | `massa.png` | Massa | Dough | Pam's HarvestCraft |
| 55 | `massa_liquida.png` | Massa Líquida | Batter | Pam's HarvestCraft |
| 56 | `milho_espiga.png` | Milho na Espiga | Corn on the Cob | Pam's HarvestCraft |
| 57 | `motor_nave.png` | Motor da Nave | Ship Engine | Pouso Forçado e outros |
| 58 | `nucleo_funil.png` | Núcleo de Funil | Hopper Core | JABBA |
| 59 | `nucleo_sync.png` | Núcleo Sync | Sync Core | Sync |
| 60 | `omelete.png` | Omelete | Omelet | Pam's HarvestCraft |
| 61 | `organizador.png` | Organizador | Organizer | Pouso Forçado e outros |
| 62 | `ouro_po.png` | Pó de Minério de Ouro | Powdered Gold Ore | Pouso Forçado e outros |
| 63 | `ouro_quebrado.png` | Pedaço Quebrado de Ouro | Broken Gold Ore | Pouso Forçado e outros |
| 64 | `ouro_triturado.png` | Pedaço Triturado de Ouro | Crushed Gold Ore | Pouso Forçado e outros |
| 65 | `ovo_cozido.png` | Ovo Cozido | Boiled Egg | Pam's HarvestCraft |
| 66 | `pedrinha.png` | Pedrinha | Pebble | Pouso Forçado e outros |
| 67 | `pemmican.png` | Pemmican | Pemmican | Pam's HarvestCraft |
| 68 | `pimentao_recheado.png` | Pimentão Recheado | Stuffed Pepper | Pam's HarvestCraft |
| 69 | `placa_casco.png` | Placa de Casco | Hull Plate | Pouso Forçado e outros |
| 70 | `plastico_cru.png` | Plástico Cru | Raw Plastic | MineFactory Reloaded |
| 71 | `porcelana.png` | Porcelana | Porcelain | Pouso Forçado e outros |
| 72 | `resina.png` | Resina | Sap | MineFactory Reloaded |
| 73 | `saco_dormir.png` | Saco de Dormir | Sleeping Bag | Pouso Forçado |
| 74 | `sacola_boa.png` | Sacola Boa | Good Bag | Pouso Forçado e outros |
| 75 | `sacola_comum.png` | Sacola Comum | Basic Bag | Pouso Forçado e outros |
| 76 | `sacola_epica.png` | Sacola Épica | Epic Bag | Pouso Forçado e outros |
| 77 | `sacola_lendaria.png` | Sacola Lendária | Legendary Bag | Pouso Forçado e outros |
| 78 | `sacola_otima.png` | Sacola Ótima | Greater Bag | Pouso Forçado e outros |
| 79 | `sal.png` | Sal | Salt | Pam's HarvestCraft |
| 80 | `semente_alho.png` | Sementes de Alho | Garlic Seeds | Pam's HarvestCraft |
| 81 | `semente_amendoim.png` | Sementes de Amendoim | Peanut Seeds | Pam's HarvestCraft |
| 82 | `semente_arroz.png` | Sementes de Arroz | Rice Seeds | Pam's HarvestCraft |
| 83 | `semente_cebola.png` | Sementes de Cebola | Onion Seeds | Pam's HarvestCraft |
| 84 | `semente_feijao.png` | Sementes de Feijão | Beans Seeds | Pam's HarvestCraft |
| 85 | `semente_fruta_cacto.png` | Sementes de Fruta do Cacto | Cactus Fruit Seeds | Pam's HarvestCraft |
| 86 | `semente_milho.png` | Sementes de Milho | Corn Seeds | Pam's HarvestCraft |
| 87 | `semente_pimenta.png` | Sementes de Pimenta | Chili Pepper Seeds | Pam's HarvestCraft |
| 88 | `semente_pimentao.png` | Sementes de Pimentão | Bell Pepper Seeds | Pam's HarvestCraft |
| 89 | `semente_tomate.png` | Sementes de Tomate | Tomato Seeds | Pam's HarvestCraft |
| 90 | `sopa_arroz.png` | Sopa de Arroz | Rice Soup | Pam's HarvestCraft |
| 91 | `sopa_cacto.png` | Sopa de Cacto | Cactus Soup | Pam's HarvestCraft |
| 92 | `torrada.png` | Torrada | Toast | Pam's HarvestCraft |
| 93 | `tortilha.png` | Tortilha | Tortilla | Pam's HarvestCraft |
| 94 | `upgrade_alcance_1.png` | Upgrade de Alcance +1 | Range Upgrade +1 | MineFactory Reloaded |
| 95 | `upgrade_alcance_2.png` | Upgrade de Alcance +2 | Range Upgrade +2 | MineFactory Reloaded |
| 96 | `upgrade_alcance_3.png` | Upgrade de Alcance +3 | Range Upgrade +3 | MineFactory Reloaded |
| 97 | `upgrade_alcance_4.png` | Upgrade de Alcance +4 | Range Upgrade +4 | MineFactory Reloaded |
| 98 | `upgrade_alcance_5.png` | Upgrade de Alcance +5 | Range Upgrade +5 | MineFactory Reloaded |
| 99 | `upgrade_armazenamento.png` | Upgrade de Armazenamento | Storage Upgrade | JABBA |
| 100 | `upgrade_estrutural_1.png` | Upgrade Estrutural MK I | Structural Upgrade MK I | JABBA |
| 101 | `upgrade_estrutural_2.png` | Upgrade Estrutural MK II | Structural Upgrade MK II | JABBA |
| 102 | `upgrade_estrutural_3.png` | Upgrade Estrutural MK III | Structural Upgrade MK III | JABBA |
| 103 | `upgrade_estrutural_4.png` | Upgrade Estrutural MK IV | Structural Upgrade MK IV | JABBA |
| 104 | `upgrade_estrutural_5.png` | Upgrade Estrutural MK V | Structural Upgrade MK V | JABBA |
| 105 | `upgrade_estrutural_6.png` | Upgrade Estrutural MK VI | Structural Upgrade MK VI | JABBA |
| 106 | `upgrade_estrutural_7.png` | Upgrade Estrutural MK VII | Structural Upgrade MK VII | JABBA |

## Parte 2 de 2: Blocos (ícone do Catálogo e dos menus) (83 ícones)

Ícones de hoje: `parte-2.png` (o número embaixo de cada um é o da lista). `path`: `RP/textures/items/cl/arte/blocos/<arquivo>`.

| # | arquivo | nome no jogo | nome original (inglês) | mod |
|---|---|---|---|---|
| 1 | `armazem_corpos.png` | Armazém de Corpos | Shell Storage | Sync |
| 2 | `assadeira.png` | Assadeira | Bakeware | Pouso Forçado e outros |
| 3 | `barril_armazenamento.png` | Barril de Armazenamento | Storage Barrel | JABBA |
| 4 | `barril_madeira.png` | Barril de Madeira | Wooden Barrel | Pouso Forçado e outros |
| 5 | `barril_pedra.png` | Barril de Pedra | Stone Barrel | Pouso Forçado e outros |
| 6 | `bateria.png` | Bateria | Battery | Pouso Forçado e outros |
| 7 | `bloco_maquina.png` | Bloco de Máquina | Machine Block | MineFactory Reloaded |
| 8 | `cabide_armadura.png` | Cabide de Armadura | Armor Stand | BiblioCraft |
| 9 | `cabo.png` | Cabo de Cobre | Copper Cable | Pouso Forçado e outros |
| 10 | `cacarola.png` | Caçarola | Saucepan | Pouso Forçado e outros |
| 11 | `cadinho.png` | Cadinho | Crucible | Pouso Forçado e outros |
| 12 | `caixa_entrega.png` | Caixa de Entrega | Quest Delivery System | Hardcore Questing Mode |
| 13 | `celula_energia_basica.png` | Célula de Energia Básica | Leadstone Energy Cell | Thermal Expansion |
| 14 | `celula_energia_redstone.png` | Célula de Energia Redstone | Redstone Energy Cell | Thermal Expansion |
| 15 | `celula_energia_reforcada.png` | Célula de Energia Reforçada | Hardened Energy Cell | Thermal Expansion |
| 16 | `celula_energia_ressonante.png` | Célula de Energia Ressonante | Resonant Energy Cell | Thermal Expansion |
| 17 | `colheitadeira.png` | Colheitadeira | Harvester | MineFactory Reloaded |
| 18 | `colocador_blocos.png` | Colocador de Blocos | Block Placer | MineFactory Reloaded |
| 19 | `compostadora.png` | Compostadora | Composter | MineFactory Reloaded |
| 20 | `compostor.png` | Compostor de Terra | Dirt Composter | Pouso Forçado e outros |
| 21 | `compressor_ar.png` | Compressor de Ar | Air Compressor | PneumaticCraft |
| 22 | `condensador_agua.png` | Condensador de Água | Water Condenser | Pouso Forçado e outros |
| 23 | `condensador_avancado.png` | Condensador Avançado | Advanced Condenser | Pouso Forçado e outros |
| 24 | `construtor_corpos.png` | Construtor de Corpos | Shell Constructor | Sync |
| 25 | `cubo_energia_avancado.png` | Cubo de Energia Avançado | Advanced Energy Cube | Mekanism |
| 26 | `cubo_energia_basico.png` | Cubo de Energia Básico | Basic Energy Cube | Mekanism |
| 27 | `cubo_energia_definitivo.png` | Cubo de Energia Ultimate | Ultimate Energy Cube | Mekanism |
| 28 | `cubo_energia_elite.png` | Cubo de Energia Elite | Elite Energy Cube | Mekanism |
| 29 | `dinamo_redstone.png` | Dínamo de Redstone | Enervation Dynamo | Thermal Expansion |
| 30 | `empacotador.png` | Empacotador Automático | AutoPackager | AutoPackager |
| 31 | `esgoto.png` | Esgoto | Sewer | MineFactory Reloaded |
| 32 | `espremedor.png` | Espremedor | Juicer | Pouso Forçado e outros |
| 33 | `estante.png` | Estante | Bookcase | BiblioCraft |
| 34 | `esteira.png` | Esteira | Conveyor Belt | MineFactory Reloaded |
| 35 | `esteira_animal.png` | Esteira de Animal | Treadmill | Sync |
| 36 | `estrutura_maquina.png` | Estrutura de Máquina | Machine Frame | Thermal Expansion |
| 37 | `estufa.png` | Estufa | Greenhouse | Pouso Forçado e outros |
| 38 | `expositor.png` | Expositor | Display Case | BiblioCraft |
| 39 | `extrusora_ignea.png` | Extrusora Ígnea | Igneous Extruder | Thermal Expansion |
| 40 | `fertilizadora.png` | Fertilizadora | Fertilizer | MineFactory Reloaded |
| 41 | `folha_infestada.png` | Folha Infestada | Infested Leaves | Pouso Forçado e outros |
| 42 | `fornalha_redstone.png` | Fornalha de Redstone | Redstone Furnace | Thermal Expansion |
| 43 | `frigideira.png` | Frigideira | Skillet | Pouso Forçado e outros |
| 44 | `fundidora_inducao.png` | Fundidora de Indução | Induction Smelter | Thermal Expansion |
| 45 | `gerador.png` | Gerador a Carvão | Coal Generator | Pouso Forçado e outros |
| 46 | `gerador_blaze.png` | Gerador de Blazes | Blaze Spawner | Pouso Forçado |
| 47 | `gerador_monstros.png` | Gerador de Monstros | Monster Generator | Pouso Forçado e outros |
| 48 | `idolo_amaldicoado.png` | Ídolo Amaldiçoado | Cursed Idol | Pouso Forçado e outros |
| 49 | `infusor_metalurgico.png` | Infusor Metalúrgico | Metallurgic Infuser | Mekanism |
| 50 | `infusor_quimico.png` | Infusor Químico | Chemical Infuser | Mekanism |
| 51 | `interface_camara.png` | Interface da Câmara | Pressure Chamber Interface | PneumaticCraft |
| 52 | `lampada.png` | Lâmpada | Fancy Lamp | BiblioCraft |
| 53 | `lanterna.png` | Lanterna | Fancy Lantern | BiblioCraft |
| 54 | `moinho.png` | Moinho de Vento | Windmill | Pouso Forçado e outros |
| 55 | `montadora.png` | Montadora | Assembler | Pouso Forçado e outros |
| 56 | `motor_combustao.png` | Motor a Combustão | Combustion Engine | BuildCraft |
| 57 | `painel_nave.png` | Painel da Nave | Ship Console | Pouso Forçado e outros |
| 58 | `painel_solar.png` | Painel Solar | Solar Panel | Pouso Forçado e outros |
| 59 | `panela.png` | Panela | Pot | Pouso Forçado e outros |
| 60 | `pedreira.png` | Pedreira | Quarry | BuildCraft |
| 61 | `peneira.png` | Peneira | Sieve | Pouso Forçado e outros |
| 62 | `peneira_automatica.png` | Peneira Automática | Automatic Sieve | Pouso Forçado e outros |
| 63 | `pilao.png` | Pilão | Mortar and Pestle | Pouso Forçado e outros |
| 64 | `plantadeira.png` | Plantadeira | Planter | MineFactory Reloaded |
| 65 | `poeira.png` | Poeira | Dust | Pouso Forçado e outros |
| 66 | `ponto_acesso.png` | Ponto de Acesso Sem Fio | ME Wireless Access Point | Applied Energistics |
| 67 | `prateleira.png` | Prateleira | Shelf | BiblioCraft |
| 68 | `precipitador_glacial.png` | Precipitador Glacial | Glacial Precipitator | Thermal Expansion |
| 69 | `pulverizador.png` | Pulverizador | Pulverizer | Thermal Expansion |
| 70 | `quebrador_blocos.png` | Quebrador de Blocos | Block Breaker | MineFactory Reloaded |
| 71 | `rancheiro.png` | Rancheiro | Rancher | MineFactory Reloaded |
| 72 | `refinaria.png` | Refinaria | Refinery | BuildCraft |
| 73 | `separador_eletrolitico.png` | Separador Eletrolítico | Electrolytic Separator | Mekanism |
| 74 | `serraria.png` | Serraria | Sawmill | Thermal Expansion |
| 75 | `suporte_ferramentas.png` | Suporte de Ferramentas | Tool Rack | BiblioCraft |
| 76 | `tabua_corte.png` | Tábua de Corte | Cutting Board | Pouso Forçado e outros |
| 77 | `terminal.png` | Terminal de Armazenamento | Storage Terminal | Pouso Forçado e outros |
| 78 | `tesseract.png` | Tesseract | Tesseract | Thermal Expansion |
| 79 | `tigela_mistura.png` | Tigela de Mistura | Mixing Bowl | Pouso Forçado e outros |
| 80 | `torre_defesa.png` | Torre de Defesa | Defense Turret | Pouso Forçado |
| 81 | `triturador_monstros.png` | Triturador de Monstros | Mob Grinder | MineFactory Reloaded |
| 82 | `tubo_pressao.png` | Tubo de Pressão | Pressure Tube | PneumaticCraft |
| 83 | `tubo_pressao_avancado.png` | Tubo de Pressão Avançado | Advanced Pressure Tube | PneumaticCraft |

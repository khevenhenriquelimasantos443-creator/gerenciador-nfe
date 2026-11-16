# Pouso Forçado: ícones para refazer (555 ícones, 7 partes)

Add-on de Minecraft Bedrock (jogado no celular) que recria o modpack Crash Landing. Estes ícones de item ainda são
**desenho gerado por fórmula** (pó, chapa, cilindro, comida...) e ficaram genéricos ou estranhos. O resto dos ícones é a
arte original dos mods ou arte já aprovada e **não** entra aqui.

## O que pedir (mande uma parte por vez)
Faça um script Node.js (`.mjs`) igual ao das artes aprovadas: uma lista `ARTES` com `{ "path", "base64" }` e um laço que
grava cada PNG. Para cada ícone da parte:
- `path`: `RP/textures/items/cl/arte/<arquivo>` (o nome do arquivo da tabela, sem mudar nada: é o ID do item no jogo);
- `base64`: PNG **16×16**, fundo transparente.

## Estilo (o mesmo das 114 artes aprovadas)
- Pixel art de item do Minecraft, 16×16, legível no celular: silhueta clara, contorno escuro de 1 px, luz de cima à esquerda.
- Poucas cores por ícone, sem anti-aliasing e sem pixel semitransparente na borda.
- Coisas da mesma família ficam com a mesma forma e mudam só a cor (todos os cilindros iguais com a cor do conteúdo,
  todos os baldes iguais, todos os pós iguais...), como nos mods.
- Comida do HarvestCraft: desenhe o prato de verdade (torta, sanduíche, suco no copo, semente no pacotinho...) pelo nome
  em inglês, que é o do mod.
- Não use nem copie a arte original do mod (é fechada): desenho próprio que só lembra o original.

## Regras
- Não renomear arquivos nem IDs (quebraria os mundos salvos).
- Responda só com o script, em um bloco de código, sem explicação.

## Parte 1 de 7: ícones gerados pelo build (103 ícones)

Ícones de hoje: `parte-1.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `aluminio_po.png` | Pó de Minério de Alumínio | Powdered Aluminum Ore |
| 2 | `aluminio_quebrado.png` | Pedaço Quebrado de Alumínio | Broken Aluminum Ore |
| 3 | `aluminio_triturado.png` | Pedaço Triturado de Alumínio | Crushed Aluminum Ore |
| 4 | `balde_agua_pesada.png` | Balde de Água Pesada | Heavy Water Bucket |
| 5 | `balde_biodiesel.png` | Balde de Biodiesel | Biodiesel Bucket |
| 6 | `balde_creosoto.png` | Balde de Creosoto | Creosote Bucket |
| 7 | `balde_etanol.png` | Balde de Etanol | Ethanol Bucket |
| 8 | `balde_oleo_vegetal.png` | Balde de Óleo Vegetal | Plant Oil Bucket |
| 9 | `balde_pasta_nutritiva.png` | Balde de pasta nutricional | Nutritional Paste Bucket |
| 10 | `cabeca_enderman.png` | Cabeça de Enderman | Enderman Head |
| 11 | `chapa_cobre.png` | Chapa de Cobre | Copper Sheet |
| 12 | `chapa_ferro.png` | Chapa de Ferro | Iron Sheet |
| 13 | `chapa_latao.png` | Chapa de Latão | Brass Sheet |
| 14 | `chapa_ouro.png` | Chapa de Ouro | Golden Sheet |
| 15 | `cilindro_acido_fluoridrico.png` | Cilindro de Ácido Fluorídrico | Liquid Hydrofluoric Acid Tank |
| 16 | `cilindro_acido_sulfurico.png` | Cilindro de Ácido Sulfúrico Líquido | Liquid Sulfuric Acid Tank |
| 17 | `cilindro_antimateria.png` | Cilindro de Antimatéria | Antimatter Tank |
| 18 | `cilindro_combustivel_fissil.png` | Cilindro de Combustível Físsil | Fissile Fuel Tank |
| 19 | `cilindro_combustivel_fusao.png` | Cilindro de Combustível de Fusão | Liquid D-T Fuel Tank |
| 20 | `cilindro_deuterio.png` | Cilindro de Deutério | Liquid Deuterium Tank |
| 21 | `cilindro_dioxido_enxofre.png` | Cilindro de Dióxido de enxofre líquido | Liquid Sulfur Dioxide Tank |
| 22 | `cilindro_eteno.png` | Cilindro de Etileno Líquido | Liquid Ethene Tank |
| 23 | `cilindro_hexafluoreto_uranio.png` | Cilindro de Hexafluoreto de Urânio | Liquid Uranium Hexafluoride Tank |
| 24 | `cilindro_litio.png` | Cilindro de Lítio líquido | Liquid Lithium Tank |
| 25 | `cilindro_oxido_uranio.png` | Cilindro de Óxido de Urânio | Liquid Uranium Oxide Tank |
| 26 | `cilindro_pasta_limpa_chumbo.png` | Cilindro de Pasta Limpa de Chumbo | Clean Lead Slurry Tank |
| 27 | `cilindro_pasta_limpa_cobre.png` | Cilindro de Pasta Limpa de Cobre | Clean Copper Slurry Tank |
| 28 | `cilindro_pasta_limpa_estanho.png` | Cilindro de Pasta Limpa de Estanho | Clean Tin Slurry Tank |
| 29 | `cilindro_pasta_limpa_ferro.png` | Cilindro de Pasta Limpa de Ferro | Clean Iron Slurry Tank |
| 30 | `cilindro_pasta_limpa_osmio.png` | Cilindro de Pasta Limpa de Ósmio | Clean Osmium Slurry Tank |
| 31 | `cilindro_pasta_limpa_ouro.png` | Cilindro de Pasta Limpa de Ouro | Clean Gold Slurry Tank |
| 32 | `cilindro_pasta_limpa_uranio.png` | Cilindro de Pasta Limpa de Urânio | Clean Uranium Slurry Tank |
| 33 | `cilindro_pasta_suja_chumbo.png` | Cilindro de Pasta Suja de Chumbo | Dirty Lead Slurry Tank |
| 34 | `cilindro_pasta_suja_cobre.png` | Cilindro de Pasta Suja de Cobre | Dirty Copper Slurry Tank |
| 35 | `cilindro_pasta_suja_estanho.png` | Cilindro de Pasta Suja de Estanho | Dirty Tin Slurry Tank |
| 36 | `cilindro_pasta_suja_ferro.png` | Cilindro de Pasta Suja de Ferro | Dirty Iron Slurry Tank |
| 37 | `cilindro_pasta_suja_osmio.png` | Cilindro de Pasta Suja de Ósmio | Dirty Osmium Slurry Tank |
| 38 | `cilindro_pasta_suja_ouro.png` | Cilindro de Pasta Suja de Ouro | Dirty Gold Slurry Tank |
| 39 | `cilindro_pasta_suja_uranio.png` | Cilindro de Pasta Suja de Urânio | Dirty Uranium Slurry Tank |
| 40 | `cilindro_plutonio.png` | Cilindro de Plutônio | Plutonium Tank |
| 41 | `cilindro_polonio.png` | Cilindro de Polônio | Polonium Tank |
| 42 | `cilindro_residuo_nuclear.png` | Cilindro de Resíduo Nuclear | Nuclear Waste Tank |
| 43 | `cilindro_residuo_nuclear_gasto.png` | Cilindro de Resíduo Nuclear Gasto | Spent Nuclear Waste Tank |
| 44 | `cilindro_sodio.png` | Cilindro de Sódio líquido | Liquid Sodium Tank |
| 45 | `cilindro_trioxido_enxofre.png` | Cilindro de Trióxido de enxofre líquido | Liquid Sulfur Trioxide Tank |
| 46 | `cilindro_tritio.png` | Cilindro de Trítio | Liquid Tritium Tank |
| 47 | `cilindro_vapor.png` | Cilindro de Vapor | Liquid Steam Tank |
| 48 | `cilindro_vapor_agua.png` | Cilindro de Vapor d'Água | Water Vapor Tank |
| 49 | `cinzel_diamante.png` | Cinzel de Diamante | Diamond Chisel |
| 50 | `cinzel_hitech.png` | Cinzel Hi-Tech | iChisel |
| 51 | `corredores_livres.png` | Corredores Livres | Free Runners |
| 52 | `corredores_livres_blindados.png` | Corredores Livres Blindados | Armored Free Runners |
| 53 | `desmontador_atomico.png` | Desintegrador Atômico | Atomic Disassembler |
| 54 | `ender_senciente.png` | Ender Senciente | Sentient Ender |
| 55 | `farinha_cinzas.png` | Farinha de Netherrack | Cinder Flour |
| 56 | `ferramenta_meka.png` | Meka-Tool | Meka-Tool |
| 57 | `fragmento_dormente.png` | Fragmento Dormente | Dormant Shard |
| 58 | `fragmento_sintonizado.png` | Fragmento Sintonizado | Attuned Shard |
| 59 | `frank_n_zumbi.png` | Frank'N'Zumbi | Frank'N'Zombie |
| 60 | `jetpack_blindado.png` | Jetpack Blindado | Armored Jetpack |
| 61 | `lanca_chamas.png` | Lança-Chamas | Flamethrower |
| 62 | `liga_andesita.png` | Liga de Andesita | Andesite Alloy |
| 63 | `mascara_mergulho.png` | Máscara de Mergulho | Scuba Mask |
| 64 | `molde_areia_cabeca_pa.png` | Molde de Areia: Cabeça de Pá | Shovel Head Sand Cast |
| 65 | `molde_areia_guarda_larga.png` | Molde de Areia: Guarda Larga | Wide Guard Sand Cast |
| 66 | `molde_areia_travessa.png` | Molde de Areia: Travessa | Crossbar Sand Cast |
| 67 | `molde_chapa.png` | Molde de Chapa | Metal Press Mold: Plate |
| 68 | `molde_desembalar.png` | Molde de Desembalar | Metal Press Mold: Unpacking |
| 69 | `molde_engrenagem.png` | Molde de Engrenagem | Metal Press Mold: Gear |
| 70 | `molde_haste.png` | Molde de Haste | Metal Press Mold: Rod |
| 71 | `osmio_po.png` | Pó de Minério de Ósmio | Powdered Osmium Ore |
| 72 | `osmio_quebrado.png` | Pedaço Quebrado de Ósmio | Broken Osmium Ore |
| 73 | `osmio_triturado.png` | Pedaço Triturado de Ósmio | Crushed Osmium Ore |
| 74 | `pa_turbina_pneumatica.png` | Pá de Turbina | Turbine Blade |
| 75 | `padrao_cabeca_enxo.png` | Padrão: Cabeça de Enxó | Adze Head Pattern |
| 76 | `padrao_cabeca_machado_larga.png` | Padrão: Cabeça de Machado Grande | Broad Axe Head Pattern |
| 77 | `padrao_cabeca_martelo.png` | Padrão: Cabeça de Martelo | Hammer Head Pattern |
| 78 | `padrao_cabo_resistente.png` | Padrão: Cabo Resistente | Tough Handle Pattern |
| 79 | `padrao_lamina_larga.png` | Padrão: Lâmina Grande | Broad Blade Pattern |
| 80 | `padrao_ligacao_resistente.png` | Padrão: Colar Resistente | Tough Collar Pattern |
| 81 | `padrao_placa_grande.png` | Padrão: Placa Grande | Large Plate Pattern |
| 82 | `pedra_viagem_ametista.png` | Pedra de Viagem de Ametista | Amethyst Warp Stone |
| 83 | `pedra_viagem_cobre.png` | Pedra de Viagem de Cobre | Copper Warp Stone |
| 84 | `pedra_viagem_diamante.png` | Pedra de Viagem de Diamante | Diamond Warp Stone |
| 85 | `pedra_viagem_esmeralda.png` | Pedra de Viagem de Esmeralda | Emerald Warp Stone |
| 86 | `pedra_viagem_lapis.png` | Pedra de Viagem de Lápis | Lapis Warp Stone |
| 87 | `pedra_viagem_ouro.png` | Pedra de Viagem de Ouro | Gold Warp Stone |
| 88 | `pedra_viagem_prismarinho.png` | Pedra de Viagem de Prismarinho | Prismarine Warp Stone |
| 89 | `pedra_viagem_redstone.png` | Pedra de Viagem de Redstone | Redstone Warp Stone |
| 90 | `pepita_experiencia.png` | Pepita de Experiência | Nugget of Experience |
| 91 | `pergaminho_vazio.png` | Pergaminho em Branco | Unbound Scroll |
| 92 | `pergaminho_vinculado.png` | Pergaminho Vinculado | Bound Scroll |
| 93 | `robo_avancado.png` | Robô Minerador Avançado | Advanced Mining Turtle |
| 94 | `super_varinha_construtor.png` | Super Varinha do Construtor | Super Builder's Wand |
| 95 | `tanque_mergulho.png` | Tanque de Mergulho | Scuba Tank |
| 96 | `triturado_cobre.png` | Cobre Bruto Triturado | Crushed Raw Copper |
| 97 | `triturado_ferro.png` | Ferro Bruto Triturado | Crushed Raw Iron |
| 98 | `triturado_ouro.png` | Ouro Bruto Triturado | Crushed Raw Gold |
| 99 | `triturado_zinco.png` | Zinco Bruto Triturado | Crushed Raw Zinc |
| 100 | `varinha_construtor.png` | Varinha do Construtor | Builder's Wand |
| 101 | `zinco_po.png` | Pó de Minério de Zinco | Powdered Zinc Ore |
| 102 | `zinco_quebrado.png` | Pedaço Quebrado de Zinco | Broken Zinc Ore |
| 103 | `zinco_triturado.png` | Pedaço Triturado de Zinco | Crushed Zinc Ore Piece |

## Parte 2 de 7: Pam's HarvestCraft 2 (85 ícones)

Ícones de hoje: `parte-2.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `abacate.png` | Abacate | Avocado |
| 2 | `abacaxi.png` | Abacaxi | Pineapple |
| 3 | `abobora_inverno.png` | Abóbora-de-Inverno | Winter Squash |
| 4 | `abobrinha.png` | Abobrinha | Zucchini |
| 5 | `achocolatado.png` | Achocolatado | Chocolate Milk |
| 6 | `agave.png` | Agave | Agave |
| 7 | `alcachofra.png` | Alcachofra | Artichoke |
| 8 | `alface.png` | Alface | Lettuce |
| 9 | `alfafa.png` | Alfafa | Alfalfa |
| 10 | `algodao.png` | Algodão | Cotton |
| 11 | `algodao_doce.png` | Algodão-Doce | Cotton Candy |
| 12 | `alho_assado.png` | Alho Assado | Roasted Garlic |
| 13 | `alho_poro.png` | Alho-Poró | Leek |
| 14 | `alho_poro_assado.png` | Alho-Poró Assado | Roasted Leek |
| 15 | `amaranto.png` | Amaranto | Amaranth |
| 16 | `ameixa.png` | Ameixa | Plum |
| 17 | `amendoa.png` | Amêndoa | Almond |
| 18 | `amendoa_torrada.png` | Amêndoa Torrada | Roasted Almond |
| 19 | `amendoim_torrado.png` | Amendoim Torrado | Roasted Peanut |
| 20 | `amora.png` | Amora | Mulberry |
| 21 | `amora_artica.png` | Amora-Ártica | Cloudberry |
| 22 | `amora_preta.png` | Amora-Preta | Blackberry |
| 23 | `araruta.png` | Araruta | Arrowroot |
| 24 | `araruta_assada.png` | Araruta Assada | Baked Arrowroot |
| 25 | `asimina.png` | Asimina | Pawpaw |
| 26 | `aspargo.png` | Aspargo | Asparagus |
| 27 | `aveia.png` | Aveia | Oats |
| 28 | `avela.png` | Avelã | Hazelnut |
| 29 | `avela_torrada.png` | Avelã Torrada | Roasted Hazelnut |
| 30 | `azeitona.png` | Azeitona | Olive |
| 31 | `babosa.png` | Babosa | Aloe |
| 32 | `bacon_chocolate.png` | Bacon com Chocolate | Chocolate Bacon |
| 33 | `bacon_epico.png` | Bacon Épico | Epic Bacon |
| 34 | `baga_cera.png` | Baga-de-Cera | Candleberry |
| 35 | `balas_creeper.png` | Balas de Creeper | Gummy Creepers |
| 36 | `banana.png` | Banana | Banana |
| 37 | `barra_chocolate.png` | Barra de Chocolate | Chocolate Bar |
| 38 | `batata_chips.png` | Batata Chips | Potato Chips |
| 39 | `batata_doce.png` | Batata-Doce | Sweet Potato |
| 40 | `batata_doce_assada.png` | Batata-Doce Assada | Baked Sweet Potato |
| 41 | `batata_frita.png` | Batata Frita | Fries |
| 42 | `batata_manteiga.png` | Batata Assada com Manteiga | Buttered Baked Potato |
| 43 | `baunilha.png` | Fava de Baunilha | Vanillabean |
| 44 | `berinjela.png` | Berinjela | Eggplant |
| 45 | `beterraba_conserva.png` | Beterraba em Conserva | Pickled Beets |
| 46 | `biscoitos_leite.png` | Biscoitos com Leite | Cookies and Milk |
| 47 | `bolacha.png` | Bolacha | Cracker |
| 48 | `bolachas_queijo.png` | Bolachas com Queijo | Crackers and Cheese |
| 49 | `bolo_carne.png` | Bolo de Carne | Meatloaf |
| 50 | `bolo_cenoura.png` | Bolo de Cenoura | Carrot Cake |
| 51 | `bolo_chocolate.png` | Bolo de Chocolate | Chocolate Cake |
| 52 | `bolota.png` | Bolota | Acorn |
| 53 | `bolota_assada.png` | Bolota Assada | Roasted Acorn |
| 54 | `brocolis.png` | Brócolis | Broccoli |
| 55 | `cabaca.png` | Cabaça | Calabash |
| 56 | `cacau_po.png` | Cacau em Pó | Cocoa Powder |
| 57 | `cachorro_quente.png` | Cachorro-Quente | Hot Dog |
| 58 | `cacto_barril.png` | Cacto-Barril | Barrel Cactus |
| 59 | `cafe.png` | Grão de Café | Coffeebean |
| 60 | `cafe_quente.png` | Café Quente | Hot Coffee |
| 61 | `caju_torrado.png` | Castanha-de-Caju Torrada | Roasted Cashew |
| 62 | `canela.png` | Canela | Cinnamon |
| 63 | `canola.png` | Canola | Canola |
| 64 | `caqui.png` | Caqui | Persimmon |
| 65 | `carambola.png` | Carambola | Starfruit |
| 66 | `caramelo.png` | Caramelo | Caramel |
| 67 | `carne_panela.png` | Carne de Panela | Pot Roast |
| 68 | `castanha.png` | Castanha | Chestnut |
| 69 | `castanha_assada.png` | Castanha Assada | Roasted Chestnut |
| 70 | `castanha_caju.png` | Castanha-de-Caju | Cashew |
| 71 | `castanha_dagua.png` | Castanha-d'Água | Waterchestnut |
| 72 | `castanha_dagua_assada.png` | Castanha-d'Água Assada | Baked Water Chestnut |
| 73 | `cebola_assada.png` | Cebola Assada | Roasted Onion |
| 74 | `cebolinha.png` | Cebolinha | Scallion |
| 75 | `cebolinha_assada.png` | Cebolinha Assada | Roasted Scallion |
| 76 | `cenouras_glaceadas.png` | Cenouras Glaceadas | Glazed Carrots |
| 77 | `centeio.png` | Centeio | Rye |
| 78 | `cereja.png` | Cereja | Cherry |
| 79 | `cevada.png` | Cevada | Barley |
| 80 | `cha_quente.png` | Chá Quente | Hot Tea |
| 81 | `cha_urtiga.png` | Chá de Urtiga | Hot Nettle Tea |
| 82 | `charque_carneiro.png` | Charque de Carneiro | Mutton Jerky |
| 83 | `charque_coelho.png` | Charque de Coelho | Rabbit Jerky |
| 84 | `charque_frango.png` | Charque de Frango | Chicken Jerky |
| 85 | `charque_peixe.png` | Charque de Peixe | Fish Jerky |

## Parte 3 de 7: Pam's HarvestCraft 2 (85 ícones)

Ícones de hoje: `parte-3.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `charque_porco.png` | Charque de Porco | Pork Jerky |
| 2 | `cheesecake_abobora.png` | Cheesecake de Abóbora | Pumpkin Cheese Cake |
| 3 | `chia.png` | Chia | Chia |
| 4 | `coco.png` | Coco | Coconut |
| 5 | `cogumelo_assado.png` | Cogumelo Assado | Roasted Mushroom |
| 6 | `cogumelo_branco.png` | Cogumelo Branco | White Mushroom |
| 7 | `couve.png` | Couve | Kale |
| 8 | `couve_bruxelas.png` | Couve-de-Bruxelas | Brusselsprout |
| 9 | `couve_chinesa.png` | Couve-Chinesa | Bok Choy |
| 10 | `couve_flor.png` | Couve-Flor | Cauliflower |
| 11 | `couve_rabano.png` | Couve-Rábano | Kohlrabi |
| 12 | `couve_rabano_assada.png` | Couve-Rábano Assada | Roasted Kohlrabi |
| 13 | `creme_leite.png` | Creme de Leite | Cream |
| 14 | `damasco.png` | Damasco | Apricot |
| 15 | `durian.png` | Durião | Durian |
| 16 | `empadao_carne.png` | Empadão de Carne | Beef Pot Pie |
| 17 | `empadao_carneiro.png` | Empadão de Carneiro | Mutton Pot Pie |
| 18 | `empadao_coelho.png` | Empadão de Coelho | Rabbit Pot Pie |
| 19 | `empadao_frango.png` | Empadão de Frango | Chicken Pot Pie |
| 20 | `empadao_legumes.png` | Empadão de Legumes | Veggie Pot Pie |
| 21 | `empadao_peixe.png` | Empadão de Peixe | Fish Pot Pie |
| 22 | `empadao_porco.png` | Empadão de Porco | Pork Pot Pie |
| 23 | `ensopado.png` | Ensopado | Stew |
| 24 | `ervilha.png` | Ervilha | Peas |
| 25 | `espetinho_carne.png` | Espetinho de Carne | Grilled Beef Skewer |
| 26 | `espetinho_carneiro.png` | Espetinho de Carneiro | Grilled Mutton Skewer |
| 27 | `espetinho_coelho.png` | Espetinho de Coelho | Grilled Rabbit Skewer |
| 28 | `espetinho_frango.png` | Espetinho de Frango | Grilled Chicken Skewer |
| 29 | `espetinho_legumes.png` | Espetinho de Legumes | Grilled Veggie Skewer |
| 30 | `espetinho_peixe.png` | Espetinho de Peixe | Grilled Fish Skewer |
| 31 | `espetinho_porco.png` | Espetinho de Porco | Grilled Pork Skewer |
| 32 | `espinafre.png` | Espinafre | Spinach |
| 33 | `figo.png` | Figo | Fig |
| 34 | `folha_cha.png` | Folha de Chá | Tealeaf |
| 35 | `folha_tempero.png` | Folha de Tempero | Spiceleaf |
| 36 | `framboesa.png` | Framboesa | Raspberry |
| 37 | `frango_frito.png` | Frango Frito | Fried Chicken |
| 38 | `fruta_pao.png` | Fruta-Pão | Breadfruit |
| 39 | `fudge_chocolate.png` | Fudge de Chocolate e Caramelo | Chocolate Caramel Fudge |
| 40 | `geleia_bagas_brilhantes.png` | Geleia de Bagas Brilhantes | Glow Berry Jelly |
| 41 | `geleia_bagas_doces.png` | Geleia de Bagas Doces | Sweet Berry Jelly |
| 42 | `geleia_coro.png` | Geleia de Fruta do Coro | Chorus Jelly |
| 43 | `geleia_maca.png` | Geleia de Maçã | Apple Jelly |
| 44 | `geleia_melancia.png` | Geleia de Melancia | Melon Jelly |
| 45 | `gengibre.png` | Gengibre | Ginger |
| 46 | `gergelim.png` | Gergelim | Sesame Seeds |
| 47 | `girassol_torrado.png` | Sementes de Girassol Torradas | Roasted Sunflower Seeds |
| 48 | `goiaba.png` | Goiaba | Guava |
| 49 | `goji.png` | Goji | Wolfberry |
| 50 | `grao_de_bico.png` | Grão-de-Bico | Chickpea |
| 51 | `graviola.png` | Graviola | Soursop |
| 52 | `groselha.png` | Groselha | Gooseberry |
| 53 | `guarana.png` | Guaraná | Guarana |
| 54 | `hamburguer_simples.png` | Hambúrguer Simples | Basic Hamburger |
| 55 | `hamburguer_vegetariano.png` | Hambúrguer Vegetariano | Basic Veggie Burger |
| 56 | `hc_cheesecake.png` | Cheesecake | Cheese Cake |
| 57 | `hc_torta_chocolate.png` | Torta de Chocolate | Chocolate Pie |
| 58 | `hc_torta_maca.png` | Torta de Maçã | Apple Pie |
| 59 | `inhame.png` | Inhame | Taro |
| 60 | `inhame_assado.png` | Inhame Assado | Baked Taro |
| 61 | `iogurte.png` | Iogurte | Yogurt |
| 62 | `iogurte_abobora.png` | Iogurte de Abóbora | Pumpkin Yogurt |
| 63 | `iogurte_bagas_brilhantes.png` | Iogurte de Bagas Brilhantes | Glow Berry Yogurt |
| 64 | `iogurte_bagas_doces.png` | Iogurte de Bagas Doces | Sweet Berry Yogurt |
| 65 | `iogurte_caramelo.png` | Iogurte de Caramelo | Caramel Yogurt |
| 66 | `iogurte_chocolate.png` | Iogurte de Chocolate | Chocolate Yogurt |
| 67 | `iogurte_coro.png` | Iogurte de Fruta do Coro | Chorus Yogurt |
| 68 | `iogurte_maca.png` | Iogurte de Maçã | Apple Yogurt |
| 69 | `iogurte_melancia.png` | Iogurte de Melancia | Melon Yogurt |
| 70 | `iscas_peixe.png` | Iscas de Peixe | Fish Sticks |
| 71 | `iuca.png` | Iúca | Yucca |
| 72 | `jaca.png` | Jaca | Jackfruit |
| 73 | `jantar_frango.png` | Jantar de Frango | Chicken Dinner |
| 74 | `jicama.png` | Jicama | Jicama |
| 75 | `jicama_assada.png` | Jicama Assada | Baked Jicama |
| 76 | `jujubas.png` | Jujubas | Jelly Beans |
| 77 | `juta.png` | Juta | Jute |
| 78 | `kenaf.png` | Kenaf | Kenaf |
| 79 | `kiwi.png` | Kiwi | Kiwi |
| 80 | `laranja.png` | Laranja | Orange |
| 81 | `legumes_assados.png` | Legumes Assados | Baked Vegetable Medly |
| 82 | `leite_fresco.png` | Leite Fresco | Fresh Milk |
| 83 | `lentilha.png` | Lentilha | Lentil |
| 84 | `lichia.png` | Lichia | Lychee |
| 85 | `limao.png` | Limão | Lime |

## Parte 4 de 7: Pam's HarvestCraft 2 (85 ícones)

Ícones de hoje: `parte-4.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `limao_siciliano.png` | Limão-Siciliano | Lemon |
| 2 | `linho.png` | Linho | Flax |
| 3 | `lotus.png` | Lótus | Lotus |
| 4 | `maca_amor.png` | Maçã do Amor | Caramel Apple |
| 5 | `macarrao.png` | Macarrão | Pasta |
| 6 | `macarrao_queijo.png` | Macarrão com Queijo | Mac n Cheese |
| 7 | `mamao.png` | Mamão | Papaya |
| 8 | `mandioca.png` | Mandioca | Cassava |
| 9 | `mandioca_assada.png` | Mandioca Assada | Baked Cassava |
| 10 | `manga.png` | Manga | Mango |
| 11 | `maracuja.png` | Maracujá | Passionfruit |
| 12 | `marshmallow.png` | Marshmallows | Marshmellows |
| 13 | `melao.png` | Melão | Cantaloupe |
| 14 | `mirtilo.png` | Mirtilo | Blueberry |
| 15 | `misto_quente.png` | Misto-Quente | Grilled Cheese and Ham |
| 16 | `mix_castanhas.png` | Mix de Castanhas | Trail Mix |
| 17 | `moido_carne.png` | Carne Moída | Ground Beef |
| 18 | `moido_carne_cozido.png` | Carne Moída Cozida | Cooked Ground Beef |
| 19 | `moido_carneiro.png` | Carneiro Moído | Ground Mutton |
| 20 | `moido_carneiro_cozido.png` | Carneiro Moído Cozido | Cooked Ground Mutton |
| 21 | `moido_coelho.png` | Coelho Moído | Ground Rabbit |
| 22 | `moido_coelho_cozido.png` | Coelho Moído Cozido | Cooked Ground Rabbit |
| 23 | `moido_frango.png` | Frango Moído | Ground Chicken |
| 24 | `moido_frango_cozido.png` | Frango Moído Cozido | Cooked Ground Chicken |
| 25 | `moido_peixe.png` | Peixe Moído | Ground Fish |
| 26 | `moido_peixe_cozido.png` | Peixe Moído Cozido | Cooked Ground Fish |
| 27 | `moido_porco.png` | Porco Moído | Ground Pork |
| 28 | `moido_porco_cozido.png` | Porco Moído Cozido | Cooked Ground Pork |
| 29 | `morango.png` | Morango | Strawberry |
| 30 | `mostarda.png` | Mostarda | Mustard Seeds |
| 31 | `muffin_abobora.png` | Muffin de Abóbora | Pumpkin Muffin |
| 32 | `muffin_bagas_brilhantes.png` | Muffin de Bagas Brilhantes | Glow Berry Muffin |
| 33 | `muffin_bagas_doces.png` | Muffin de Bagas Doces | Sweet Berry Muffin |
| 34 | `muffin_caramelo.png` | Muffin de Caramelo | Caramel Muffin |
| 35 | `muffin_cenoura.png` | Muffin de Cenoura | Carrot Muffin |
| 36 | `muffin_chocolate.png` | Muffin de Chocolate | Chocolate Muffin |
| 37 | `muffin_coro.png` | Muffin de Fruta do Coro | Chorus Muffin |
| 38 | `muffin_maca.png` | Muffin de Maçã | Apple Muffin |
| 39 | `muffin_mel.png` | Muffin de Mel | Honey Muffin |
| 40 | `muffin_melancia.png` | Muffin de Melancia | Melon Muffin |
| 41 | `nabo.png` | Nabo | Turnip |
| 42 | `nabo_assado.png` | Nabo Assado | Baked Turnip |
| 43 | `nabo_sueco.png` | Nabo-Sueco | Rutabaga |
| 44 | `nabo_sueco_assado.png` | Nabo-Sueco Assado | Baked Rutabaga |
| 45 | `noz.png` | Noz | Walnut |
| 46 | `noz_iguape.png` | Noz-de-Iguape | Candlenut |
| 47 | `noz_moscada.png` | Noz-Moscada | Nutmeg |
| 48 | `noz_torrada.png` | Noz Torrada | Roasted Walnut |
| 49 | `nuggets_frango.png` | Nuggets de Frango | Chicken Nugget |
| 50 | `oleo_cozinha.png` | Óleo de Cozinha | Cooking Oil |
| 51 | `ovos_bacon.png` | Ovos com Bacon | Bacon and Eggs |
| 52 | `ovos_mexidos.png` | Ovos Mexidos | Scrambled Egg |
| 53 | `oxicoco.png` | Oxicoco | Cranberry |
| 54 | `painco.png` | Painço | Millet |
| 55 | `palma.png` | Palma | Nopales |
| 56 | `pao_abobora.png` | Pão de Abóbora | Pumpkin Bread |
| 57 | `pao_cenoura.png` | Pão de Cenoura | Carrot Bread |
| 58 | `papiro.png` | Papiro | Papyrus |
| 59 | `pastinaca.png` | Pastinaca | Parsnip |
| 60 | `pastinaca_assada.png` | Pastinaca Assada | Baked Parsnip |
| 61 | `peca.png` | Pecã | Pecan |
| 62 | `peca_torrada.png` | Pecã Torrada | Roasted Pecan |
| 63 | `peixe_fritas.png` | Peixe com Fritas | Fish and Chips |
| 64 | `pepino.png` | Pepino | Cucumber |
| 65 | `pera.png` | Pera | Pear |
| 66 | `pessego.png` | Pêssego | Peach |
| 67 | `picole_bagas_brilhantes.png` | Picolé de Bagas Brilhantes | Glow Berry Popsicle |
| 68 | `picole_bagas_doces.png` | Picolé de Bagas Doces | Sweet Berry Popsicle |
| 69 | `picole_chocolate.png` | Picolé de Chocolate | Fudgesicle |
| 70 | `picole_coro.png` | Picolé de Fruta do Coro | Chorus Popsicle |
| 71 | `picole_maca.png` | Picolé de Maçã | Apple Popsicle |
| 72 | `pimenta_reino.png` | Pimenta-do-Reino | Peppercorn |
| 73 | `pinoli.png` | Pinoli | Pinenuts |
| 74 | `pinoli_torrado.png` | Pinoli Torrado | Roasted Pinenuts |
| 75 | `pistache.png` | Pistache | Pistachio |
| 76 | `pistache_torrado.png` | Pistache Torrado | Roasted Pistachio |
| 77 | `pitaya.png` | Pitaya | Dragonfruit |
| 78 | `ponche_frutas.png` | Ponche de Frutas | Fruit Punch |
| 79 | `pretzel.png` | Pretzel | Soft Pretzel |
| 80 | `pure_batata.png` | Purê de Batata | Mashed Potatoes |
| 81 | `pure_maca.png` | Purê de Maçã | Applesauce |
| 82 | `queijo_quente.png` | Queijo Quente | Grilled Cheese |
| 83 | `quiabo.png` | Quiabo | Okra |
| 84 | `quinoa.png` | Quinoa | Quinoa |
| 85 | `rabanete.png` | Rabanete | Radish |

## Parte 5 de 7: Pam's HarvestCraft 2 (85 ícones)

Ícones de hoje: `parte-5.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `rabanete_assado.png` | Rabanete Assado | Roasted Radish |
| 2 | `rambutan.png` | Rambutã | Rambutan |
| 3 | `rocambole_chocolate.png` | Rocambole de Chocolate | Chocolate Roll |
| 4 | `roma.png` | Romã | Pomegranate |
| 5 | `rosquinha.png` | Rosquinha Simples | Plain Donut |
| 6 | `rosquinha_abobora.png` | Rosquinha de Abóbora | Pumpkin Donut |
| 7 | `rosquinha_acucarada.png` | Rosquinha Açucarada | Powdered Donut |
| 8 | `rosquinha_bagas_brilhantes.png` | Rosquinha de Bagas Brilhantes | Glow Berry Donut |
| 9 | `rosquinha_bagas_doces.png` | Rosquinha de Bagas Doces | Sweet Berry Donut |
| 10 | `rosquinha_caramelo.png` | Rosquinha de Caramelo | Caramel Donut |
| 11 | `rosquinha_cenoura.png` | Rosquinha de Cenoura | Carrot Donut |
| 12 | `rosquinha_chocolate.png` | Rosquinha de Chocolate | Chocolate Donut |
| 13 | `rosquinha_coro.png` | Rosquinha de Fruta do Coro | Chorus Donut |
| 14 | `rosquinha_granulado.png` | Rosquinha com Granulado | Sprinkles Donut |
| 15 | `rosquinha_maca.png` | Rosquinha de Maçã | Apple Donut |
| 16 | `rosquinha_mel.png` | Rosquinha com Mel | Honey Glazed Donut |
| 17 | `rosquinha_melancia.png` | Rosquinha de Melancia | Melon Donut |
| 18 | `ruibarbo.png` | Ruibarbo | Rhubarb |
| 19 | `ruibarbo_assado.png` | Ruibarbo Assado | Roasted Rhubarb |
| 20 | `sabugueiro.png` | Baga de Sabugueiro | Elderberry |
| 21 | `salsao.png` | Salsão | Celery |
| 22 | `sanduiche_carneiro.png` | Sanduíche de Carneiro | Basic Mutton Sandwich |
| 23 | `sanduiche_coelho.png` | Sanduíche de Coelho | Basic Rabbit Sandwich |
| 24 | `sanduiche_peixe.png` | Sanduíche de Peixe | Basic Fish Sandwich |
| 25 | `sanduiche_porco.png` | Sanduíche de Porco | Basic Pork Sandwich |
| 26 | `semente_abacaxi.png` | Sementes de Abacaxi | Pineapple Seeds |
| 27 | `semente_abobora_inverno.png` | Sementes de Abóbora-de-Inverno | Winter Squash Seeds |
| 28 | `semente_abobrinha.png` | Sementes de Abobrinha | Zucchini Seeds |
| 29 | `semente_agave.png` | Sementes de Agave | Agave Seeds |
| 30 | `semente_alcachofra.png` | Sementes de Alcachofra | Artichoke Seeds |
| 31 | `semente_alface.png` | Sementes de Alface | Lettuce Seeds |
| 32 | `semente_alfafa.png` | Sementes de Alfafa | Alfalfa Seeds |
| 33 | `semente_algodao.png` | Sementes de Algodão | Cotton Seeds |
| 34 | `semente_alho_poro.png` | Sementes de Alho-Poró | Leek Seeds |
| 35 | `semente_amaranto.png` | Sementes de Amaranto | Amaranth Seeds |
| 36 | `semente_amora.png` | Sementes de Amora | Mulberry Seeds |
| 37 | `semente_amora_artica.png` | Sementes de Amora-Ártica | Cloudberry Seeds |
| 38 | `semente_amora_preta.png` | Sementes de Amora-Preta | Blackberry Seeds |
| 39 | `semente_araruta.png` | Sementes de Araruta | Arrowroot Seeds |
| 40 | `semente_aspargo.png` | Sementes de Aspargo | Asparagus Seeds |
| 41 | `semente_aveia.png` | Sementes de Aveia | Oats Seeds |
| 42 | `semente_babosa.png` | Sementes de Babosa | Aloe Seeds |
| 43 | `semente_baga_cera.png` | Sementes de Baga-de-Cera | Candleberry Seeds |
| 44 | `semente_batata_doce.png` | Sementes de Batata-Doce | Sweet Potato Seeds |
| 45 | `semente_berinjela.png` | Sementes de Berinjela | Eggplant Seeds |
| 46 | `semente_brocolis.png` | Sementes de Brócolis | Broccoli Seeds |
| 47 | `semente_cabaca.png` | Sementes de Cabaça | Calabash Seeds |
| 48 | `semente_cacto_barril.png` | Sementes de Cacto-Barril | Barrel Cactus Seeds |
| 49 | `semente_cafe.png` | Sementes de Grão de Café | Coffeebean Seeds |
| 50 | `semente_canhamo.png` | Sementes de Cânhamo Industrial | Industrial Hemp Seeds |
| 51 | `semente_canola.png` | Sementes de Canola | Canola Seeds |
| 52 | `semente_castanha_dagua.png` | Sementes de Castanha-d'Água | Waterchestnut Seeds |
| 53 | `semente_cebolinha.png` | Sementes de Cebolinha | Scallion Seeds |
| 54 | `semente_centeio.png` | Sementes de Centeio | Rye Seeds |
| 55 | `semente_cevada.png` | Sementes de Cevada | Barley Seeds |
| 56 | `semente_chia.png` | Sementes de Chia | Chia Seeds |
| 57 | `semente_cogumelo_branco.png` | Sementes de Cogumelo Branco | White Mushroom Seeds |
| 58 | `semente_couve.png` | Sementes de Couve | Kale Seeds |
| 59 | `semente_couve_bruxelas.png` | Sementes de Couve-de-Bruxelas | Brusselsprout Seeds |
| 60 | `semente_couve_chinesa.png` | Sementes de Couve-Chinesa | Bok Choy Seeds |
| 61 | `semente_couve_flor.png` | Sementes de Couve-Flor | Cauliflower Seeds |
| 62 | `semente_couve_rabano.png` | Sementes de Couve-Rábano | Kohlrabi Seeds |
| 63 | `semente_ervilha.png` | Sementes de Ervilha | Peas Seeds |
| 64 | `semente_espinafre.png` | Sementes de Espinafre | Spinach Seeds |
| 65 | `semente_folha_cha.png` | Sementes de Folha de Chá | Tealeaf Seeds |
| 66 | `semente_folha_tempero.png` | Sementes de Folha de Tempero | Spiceleaf Seeds |
| 67 | `semente_framboesa.png` | Sementes de Framboesa | Raspberry Seeds |
| 68 | `semente_gengibre.png` | Sementes de Gengibre | Ginger Seeds |
| 69 | `semente_gergelim.png` | Sementes de Gergelim | Sesame Seeds |
| 70 | `semente_girassol.png` | Sementes de Girassol | Sunflower Seeds |
| 71 | `semente_goji.png` | Sementes de Goji | Wolfberry Seeds |
| 72 | `semente_grao_de_bico.png` | Sementes de Grão-de-Bico | Chickpea Seeds |
| 73 | `semente_guarana.png` | Sementes de Guaraná | Guarana Seeds |
| 74 | `semente_inhame.png` | Sementes de Inhame | Taro Seeds |
| 75 | `semente_iuca.png` | Sementes de Iúca | Yucca Seeds |
| 76 | `semente_jicama.png` | Sementes de Jicama | Jicama Seeds |
| 77 | `semente_juta.png` | Sementes de Juta | Jute Seeds |
| 78 | `semente_kenaf.png` | Sementes de Kenaf | Kenaf Seeds |
| 79 | `semente_kiwi.png` | Sementes de Kiwi | Kiwi Seeds |
| 80 | `semente_lentilha.png` | Sementes de Lentilha | Lentil Seeds |
| 81 | `semente_linho.png` | Sementes de Linho | Flax Seeds |
| 82 | `semente_lotus.png` | Sementes de Lótus | Lotus Seeds |
| 83 | `semente_mandioca.png` | Sementes de Mandioca | Cassava Seeds |
| 84 | `semente_melao.png` | Sementes de Melão | Cantaloupe Seeds |
| 85 | `semente_mirtilo.png` | Sementes de Mirtilo | Blueberry Seeds |

## Parte 6 de 7: Pam's HarvestCraft 2 (83 ícones)

Ícones de hoje: `parte-6.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `semente_morango.png` | Sementes de Morango | Strawberry Seeds |
| 2 | `semente_mostarda.png` | Sementes de Mostarda | Mustard Seeds |
| 3 | `semente_nabo.png` | Sementes de Nabo | Turnip Seeds |
| 4 | `semente_nabo_sueco.png` | Sementes de Nabo-Sueco | Rutabaga Seeds |
| 5 | `semente_oxicoco.png` | Sementes de Oxicoco | Cranberry Seeds |
| 6 | `semente_painco.png` | Sementes de Painço | Millet Seeds |
| 7 | `semente_palma.png` | Sementes de Palma | Nopales Seeds |
| 8 | `semente_papiro.png` | Sementes de Papiro | Papyrus Seeds |
| 9 | `semente_pastinaca.png` | Sementes de Pastinaca | Parsnip Seeds |
| 10 | `semente_pepino.png` | Sementes de Pepino | Cucumber Seeds |
| 11 | `semente_quiabo.png` | Sementes de Quiabo | Okra Seeds |
| 12 | `semente_quinoa.png` | Sementes de Quinoa | Quinoa Seeds |
| 13 | `semente_rabanete.png` | Sementes de Rabanete | Radish Seeds |
| 14 | `semente_ruibarbo.png` | Sementes de Ruibarbo | Rhubarb Seeds |
| 15 | `semente_sabugueiro.png` | Sementes de Baga de Sabugueiro | Elderberry Seeds |
| 16 | `semente_salsao.png` | Sementes de Salsão | Celery Seeds |
| 17 | `semente_sisal.png` | Sementes de Sisal | Sisal Seeds |
| 18 | `semente_soja.png` | Sementes de Soja | Soybean Seeds |
| 19 | `semente_sorgo.png` | Sementes de Sorgo | Sorghum Seeds |
| 20 | `semente_taboa.png` | Sementes de Taboa | Cattail Seeds |
| 21 | `semente_tomatilho.png` | Sementes de Tomatilho | Tomatillo Seeds |
| 22 | `semente_trufa.png` | Sementes de Trufa | Truffle Seeds |
| 23 | `semente_tupinambo.png` | Sementes de Tupinambo | Sunchoke Seeds |
| 24 | `semente_urtiga.png` | Sementes de Urtiga | Nettles Seeds |
| 25 | `semente_uva.png` | Sementes de Uva | Grape Seeds |
| 26 | `semente_uva_do_monte.png` | Sementes de Uva-do-Monte | Huckleberry Seeds |
| 27 | `semente_uva_verde.png` | Sementes de Uva Verde | Green Grape Seeds |
| 28 | `semente_zimbro.png` | Sementes de Baga de Zimbro | Juniperberry Seeds |
| 29 | `sisal.png` | Sisal | Sisal |
| 30 | `smores.png` | S'mores | Smores |
| 31 | `soja.png` | Soja | Soybean |
| 32 | `sopa_batata.png` | Sopa de Batata | Potato Soup |
| 33 | `sopa_cenoura.png` | Sopa de Cenoura | Carrot Soup |
| 34 | `sopa_macarrao_carne.png` | Sopa de Macarrão com Carne | Beef Noodle Soup |
| 35 | `sopa_macarrao_carneiro.png` | Sopa de Macarrão com Carneiro | Mutton Noodle Soup |
| 36 | `sopa_macarrao_coelho.png` | Sopa de Macarrão com Coelho | Rabbit Noodle Soup |
| 37 | `sopa_macarrao_frango.png` | Sopa de Macarrão com Frango | Chicken Noodle Soup |
| 38 | `sopa_macarrao_legumes.png` | Sopa de Macarrão com Legumes | Vegetable Noodle Soup |
| 39 | `sopa_macarrao_peixe.png` | Sopa de Macarrão com Peixe | Fish Noodle Soup |
| 40 | `sopa_macarrao_porco.png` | Sopa de Macarrão com Porco | Pork Noodle Soup |
| 41 | `sorgo.png` | Sorgo | Sorghum |
| 42 | `sorvete.png` | Sorvete | Ice Cream |
| 43 | `sorvete_caramelo.png` | Sorvete de Caramelo | Caramel Ice Cream |
| 44 | `sorvete_chocolate.png` | Sorvete de Chocolate | Chocolate Ice Cream |
| 45 | `suco_bagas_brilhantes.png` | Suco de Bagas Brilhantes | Glow Berry Juice |
| 46 | `suco_bagas_doces.png` | Suco de Bagas Doces | Sweet Berry Juice |
| 47 | `suco_cenoura.png` | Suco de Cenoura | Carrot Juice |
| 48 | `suco_coro.png` | Suco de Fruta do Coro | Chorus Juice |
| 49 | `suco_maca.png` | Suco de Maçã | Apple Juice |
| 50 | `suco_p8.png` | Suco de Legumes P8 | P8 Juice |
| 51 | `taboa.png` | Taboa | Cattail |
| 52 | `tamarindo.png` | Tamarindo | Tamarind |
| 53 | `tomatilho.png` | Tomatilho | Tomatillo |
| 54 | `toranja.png` | Toranja | Grapefruit |
| 55 | `torrada_geleia_bagas_brilhantes.png` | Torrada com Geleia de Bagas Brilhantes | Glow Berry Jelly Toast |
| 56 | `torrada_geleia_bagas_doces.png` | Torrada com Geleia de Bagas Doces | Sweet Berry Jelly Toast |
| 57 | `torrada_geleia_coro.png` | Torrada com Geleia de Fruta do Coro | Chorus Jelly Toast |
| 58 | `torrada_geleia_maca.png` | Torrada com Geleia de Maçã | Apple Jelly Toast |
| 59 | `torrada_geleia_melancia.png` | Torrada com Geleia de Melancia | Melon Jelly Toast |
| 60 | `torta_bagas_brilhantes.png` | Torta de Bagas Brilhantes | Glow Berry Pie |
| 61 | `torta_bagas_doces.png` | Torta de Bagas Doces | Sweet Berry Pie |
| 62 | `torta_caramelo.png` | Torta de Caramelo | Caramel Pie |
| 63 | `torta_cenoura.png` | Torta de Cenoura | Carrot Pie |
| 64 | `torta_coro.png` | Torta de Fruta do Coro | Chorus Pie |
| 65 | `torta_mel.png` | Torta de Mel | Honey Pie |
| 66 | `torta_melancia.png` | Torta de Melancia | Melon Pie |
| 67 | `trufa.png` | Trufa | Truffle |
| 68 | `tupinambo.png` | Tupinambo | Sunchoke |
| 69 | `tupinambo_assado.png` | Tupinambo Assado | Baked Sunchoke |
| 70 | `urtiga.png` | Urtiga | Nettles |
| 71 | `uva.png` | Uva | Grape |
| 72 | `uva_do_monte.png` | Uva-do-Monte | Huckleberry |
| 73 | `uva_verde.png` | Uva Verde | Green Grape |
| 74 | `vinagre.png` | Vinagre | Vinegar |
| 75 | `vitamina_bagas_brilhantes.png` | Vitamina de Bagas Brilhantes | Glow Berry Smoothie |
| 76 | `vitamina_bagas_doces.png` | Vitamina de Bagas Doces | Sweet Berry Smoothie |
| 77 | `vitamina_coro.png` | Vitamina de Fruta do Coro | Chorus Smoothie |
| 78 | `vitamina_maca.png` | Vitamina de Maçã | Apple Smoothie |
| 79 | `vitamina_melancia.png` | Vitamina de Melancia | Melon Smoothie |
| 80 | `x_bacon.png` | X-Bacon | Bacon Cheeseburger |
| 81 | `x_burguer.png` | X-Búrguer | Basic Cheeseburger |
| 82 | `xarope_bordo.png` | Xarope de Bordo | Maple Syrup |
| 83 | `zimbro.png` | Baga de Zimbro | Juniperberry |

## Parte 7 de 7: desenhados por script (29 ícones)

Ícones de hoje: `parte-7.png` (o número embaixo de cada um é o da lista).

| # | arquivo | nome no jogo | nome original (inglês) |
|---|---|---|---|
| 1 | `balao_amarelo.png` | Balão Amarelo | Yellow Balloon |
| 2 | `balao_azul.png` | Balão Azul | Blue Balloon |
| 3 | `balao_azul_claro.png` | Balão Azul-Claro | Light Blue Balloon |
| 4 | `balao_branco.png` | Balão Branco | White Balloon |
| 5 | `balao_ciano.png` | Balão Ciano | Cyan Balloon |
| 6 | `balao_cinza.png` | Balão Cinza | Gray Balloon |
| 7 | `balao_cinza_claro.png` | Balão Cinza-Claro | Light Gray Balloon |
| 8 | `balao_laranja.png` | Balão Laranja | Orange Balloon |
| 9 | `balao_lima.png` | Balão Lima | Lime Balloon |
| 10 | `balao_magenta.png` | Balão Magenta | Magenta Balloon |
| 11 | `balao_marrom.png` | Balão Marrom | Brown Balloon |
| 12 | `balao_preto.png` | Balão Preto | Black Balloon |
| 13 | `balao_rosa.png` | Balão Rosa | Pink Balloon |
| 14 | `balao_roxo.png` | Balão Roxo | Purple Balloon |
| 15 | `balao_verde.png` | Balão Verde | Green Balloon |
| 16 | `balao_vermelho.png` | Balão Vermelho | Red Balloon |
| 17 | `batedor.png` | Batedor | Whisk |
| 18 | `bobina_fio_cobre.png` | Bobina de Fio de Cobre | LV Wire Coil |
| 19 | `cabo_me_fluix.png` | Cabo ME Fluix | Fluix ME Glass Cable |
| 20 | `estilingue_slime.png` | Estilingue de Slime | Slime Sling |
| 21 | `estojo_artefatos.png` | Estojo de Artefatos | Artifact Case |
| 22 | `fibra_quartzo.png` | Fibra de Quartzo | Quartz Fiber |
| 23 | `helice.png` | Hélice | Propeller |
| 24 | `laco_amaldicoado.png` | Laço Amaldiçoado | Cursed Lasso |
| 25 | `laco_dourado.png` | Laço Dourado | Golden Lasso |
| 26 | `orquidea_vermelha.png` | Orquídea Vermelha | Red Orchid |
| 27 | `regador.png` | Regador | Watering Can |
| 28 | `robo_minerador.png` | Robô Minerador | Mining Turtle |
| 29 | `semente_lirio_ender.png` | Sementes de Lírio Ender | Ender-Lily Seeds |

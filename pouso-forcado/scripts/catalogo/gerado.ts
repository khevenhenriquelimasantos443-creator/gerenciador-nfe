// Gerado por tools/gerar-catalogo.mjs (roda no build). Não edite à mão.
export type ReceitaJson = {
  tipo: "bancada" | "sem_forma" | "fornalha";
  id: string;
  resultado: string;
  qtd: number;
  grade?: ReadonlyArray<string>;
  chaves?: Readonly<Record<string, string>>;
  ingredientes?: ReadonlyArray<{ item: string; qtd: number }>;
  estacoes: ReadonlyArray<string>;
};
export type InfoItem = { pt: string; en: string; icone?: string };
export const ITENS: Readonly<Record<string, InfoItem>> = {
 "cl:aco_eletrico": {
  "pt": "Lingote de Aço Elétrico",
  "en": "Electrical Steel Ingot",
  "icone": "textures/items/cl/arte/aco_eletrico"
 },
 "cl:aco_end": {
  "pt": "Lingote de Aço do End",
  "en": "End Steel Ingot",
  "icone": "textures/items/cl/arte/aco_end"
 },
 "cl:aco_energizado": {
  "pt": "Aço Energizado",
  "en": "Energized Steel",
  "icone": "textures/items/cl/arte/aco_energizado"
 },
 "cl:aco_negro": {
  "pt": "Lingote de Aço Sombrio",
  "en": "Dark Steel Ingot",
  "icone": "textures/items/cl/arte/aco_negro"
 },
 "cl:adaga_aco": {
  "pt": "Adaga de Aço",
  "en": "Steel Dagger",
  "icone": "textures/items/cl/arte/adaga_aco"
 },
 "cl:adaga_aco_slime": {
  "pt": "Adaga de Aço de Slime",
  "en": "Slimesteel Dagger",
  "icone": "textures/items/cl/arte/adaga_aco_slime"
 },
 "cl:adaga_bronze": {
  "pt": "Adaga de Bronze",
  "en": "Bronze Dagger",
  "icone": "textures/items/cl/arte/adaga_bronze"
 },
 "cl:adaga_bronze_ametista": {
  "pt": "Adaga de Bronze de Ametista",
  "en": "Amethyst Bronze Dagger",
  "icone": "textures/items/cl/arte/adaga_bronze_ametista"
 },
 "cl:adaga_cobalto": {
  "pt": "Adaga de Cobalto",
  "en": "Cobalt Dagger",
  "icone": "textures/items/cl/arte/adaga_cobalto"
 },
 "cl:adaga_cobre": {
  "pt": "Adaga de Cobre",
  "en": "Copper Dagger",
  "icone": "textures/items/cl/arte/adaga_cobre"
 },
 "cl:adaga_coro": {
  "pt": "Adaga de Chorus",
  "en": "Chorus Dagger",
  "icone": "textures/items/cl/arte/adaga_coro"
 },
 "cl:adaga_ferro": {
  "pt": "Adaga de Ferro",
  "en": "Iron Dagger",
  "icone": "textures/items/cl/arte/adaga_ferro"
 },
 "cl:adaga_ferro_porco": {
  "pt": "Adaga de Ferro-Porco",
  "en": "Pig Iron Dagger",
  "icone": "textures/items/cl/arte/adaga_ferro_porco"
 },
 "cl:adaga_hepatizon": {
  "pt": "Adaga de Hepatizão",
  "en": "Hepatizon Dagger",
  "icone": "textures/items/cl/arte/adaga_hepatizon"
 },
 "cl:adaga_madeira": {
  "pt": "Adaga de Madeira",
  "en": "Wood Dagger",
  "icone": "textures/items/cl/arte/adaga_madeira"
 },
 "cl:adaga_madeira_slime": {
  "pt": "Adaga de Madeira de Slime",
  "en": "Slimewood Dagger",
  "icone": "textures/items/cl/arte/adaga_madeira_slime"
 },
 "cl:adaga_madeira_slime_revestida": {
  "pt": "Adaga de Madeira de Slime Revestida",
  "en": "Plated Slimewood Dagger",
  "icone": "textures/items/cl/arte/adaga_madeira_slime_revestida"
 },
 "cl:adaga_madeira_tratada": {
  "pt": "Adaga de Madeira Tratada",
  "en": "Treated Wood Dagger",
  "icone": "textures/items/cl/arte/adaga_madeira_tratada"
 },
 "cl:adaga_manyullyn": {
  "pt": "Adaga de Manyullyn",
  "en": "Manyullyn Dagger",
  "icone": "textures/items/cl/arte/adaga_manyullyn"
 },
 "cl:adaga_nahuatl": {
  "pt": "Adaga de Nahuatl",
  "en": "Nahuatl Dagger",
  "icone": "textures/items/cl/arte/adaga_nahuatl"
 },
 "cl:adaga_osmio": {
  "pt": "Adaga de Ósmio",
  "en": "Osmium Dagger",
  "icone": "textures/items/cl/arte/adaga_osmio"
 },
 "cl:adaga_osso": {
  "pt": "Adaga de Osso",
  "en": "Bone Dagger",
  "icone": "textures/items/cl/arte/adaga_osso"
 },
 "cl:adaga_osso_blaze": {
  "pt": "Adaga de Osso de Blaze",
  "en": "Blazing Bone Dagger",
  "icone": "textures/items/cl/arte/adaga_osso_blaze"
 },
 "cl:adaga_osso_necrotico": {
  "pt": "Adaga de Osso Necrótico",
  "en": "Necrotic Bone Dagger",
  "icone": "textures/items/cl/arte/adaga_osso_necrotico"
 },
 "cl:adaga_osso_venenoso": {
  "pt": "Adaga de Osso Venenoso",
  "en": "Venombone Dagger",
  "icone": "textures/items/cl/arte/adaga_osso_venenoso"
 },
 "cl:adaga_ouro_rosa": {
  "pt": "Adaga de Ouro Rosa",
  "en": "Rose Gold Dagger",
  "icone": "textures/items/cl/arte/adaga_ouro_rosa"
 },
 "cl:adaga_pedra": {
  "pt": "Adaga de Pedra",
  "en": "Stone Dagger",
  "icone": "textures/items/cl/arte/adaga_pedra"
 },
 "cl:adaga_pedra_branca": {
  "pt": "Adaga de Pedra Branca",
  "en": "Whitestone Dagger",
  "icone": "textures/items/cl/arte/adaga_pedra_branca"
 },
 "cl:adaga_pedra_chamuscada": {
  "pt": "Adaga de Pedra Chamuscada",
  "en": "Scorched Stone Dagger",
  "icone": "textures/items/cl/arte/adaga_pedra_chamuscada"
 },
 "cl:adaga_pedra_refrataria": {
  "pt": "Adaga de Pedra Carbonizada",
  "en": "Seared Stone Dagger",
  "icone": "textures/items/cl/arte/adaga_pedra_refrataria"
 },
 "cl:adaga_silex": {
  "pt": "Adaga de Sílex",
  "en": "Flint Dagger",
  "icone": "textures/items/cl/arte/adaga_silex"
 },
 "cl:adaga_slime_brasa": {
  "pt": "Adaga de Slime de Brasa",
  "en": "Cinderslime Dagger",
  "icone": "textures/items/cl/arte/adaga_slime_brasa"
 },
 "cl:adaga_slime_cavaleiro": {
  "pt": "Adaga de Slime-Cavaleiro",
  "en": "Knightslime Dagger",
  "icone": "textures/items/cl/arte/adaga_slime_cavaleiro"
 },
 "cl:adaga_slime_rainha": {
  "pt": "Adaga de Slime da Rainha",
  "en": "Queen's Slime Dagger",
  "icone": "textures/items/cl/arte/adaga_slime_rainha"
 },
 "cl:aglutinante_conduite": {
  "pt": "Aglomerante de Condutor",
  "en": "Conduit Binder",
  "icone": "textures/items/cl/arte/aglutinante_conduite"
 },
 "cl:agua_boa": {
  "pt": "Água Boa",
  "en": "Good Water",
  "icone": "textures/items/cl/arte/agua_boa"
 },
 "cl:agua_excelente": {
  "pt": "Água Excelente",
  "en": "Excellent Water",
  "icone": "textures/items/cl/arte/agua_excelente"
 },
 "cl:agua_impropria": {
  "pt": "Água Salgada",
  "en": "Salt Water",
  "icone": "textures/items/cl/arte/agua_impropria"
 },
 "cl:agua_muito_suja": {
  "pt": "Água Muito Suja",
  "en": "Very Dirty Water",
  "icone": "textures/items/cl/arte/agua_muito_suja"
 },
 "cl:agua_suja": {
  "pt": "Água Suja",
  "en": "Dirty Water",
  "icone": "textures/items/cl/arte/agua_suja"
 },
 "cl:aleta_foguete": {
  "pt": "Aleta do Foguete",
  "en": "Rocket Fins",
  "icone": "textures/items/cl/arte/aleta_foguete"
 },
 "cl:alho": {
  "pt": "Alho",
  "en": "Garlic",
  "icone": "textures/items/cl/arte/alho"
 },
 "cl:almario": {
  "pt": "Lingote de Almário",
  "en": "Soularium Ingot",
  "icone": "textures/items/cl/arte/almario"
 },
 "cl:alto_forno": {
  "pt": "Alto-Forno",
  "en": "Blast Furnace",
  "icone": "textures/items/cl/blocos/alto_forno"
 },
 "cl:aluminio_po": {
  "pt": "Pó de Minério de Alumínio",
  "en": "Powdered Aluminum Ore",
  "icone": "textures/items/cl/c/aluminio_po"
 },
 "cl:aluminio_quebrado": {
  "pt": "Pedaço Quebrado de Alumínio",
  "en": "Broken Aluminum Ore",
  "icone": "textures/items/cl/c/aluminio_quebrado"
 },
 "cl:aluminio_triturado": {
  "pt": "Pedaço Triturado de Alumínio",
  "en": "Crushed Aluminum Ore",
  "icone": "textures/items/cl/c/aluminio_triturado"
 },
 "cl:amendoim": {
  "pt": "Amendoim",
  "en": "Peanut",
  "icone": "textures/items/cl/arte/amendoim"
 },
 "cl:ancora_viagem": {
  "pt": "Âncora de Viagem",
  "en": "Travel Anchor",
  "icone": "textures/items/cl/blocos/ancora_viagem"
 },
 "cl:aquecedor": {
  "pt": "Aquecedor Refratário",
  "en": "Seared Heater",
  "icone": "textures/blocks/cl/arte/aquecedor_topo"
 },
 "cl:arco_longo_aco": {
  "pt": "Arco Longo de Aço",
  "en": "Steel Longbow",
  "icone": "textures/items/cl/arte/arco_longo_aco"
 },
 "cl:arco_longo_aco_slime": {
  "pt": "Arco Longo de Aço de Slime",
  "en": "Slimesteel Longbow",
  "icone": "textures/items/cl/arte/arco_longo_aco_slime"
 },
 "cl:arco_longo_aluminio": {
  "pt": "Arco Longo de aluminio",
  "en": "aluminio Longbow",
  "icone": "textures/items/cl/arte/arco_longo_aluminio"
 },
 "cl:arco_longo_bronze": {
  "pt": "Arco Longo de Bronze",
  "en": "Bronze Longbow",
  "icone": "textures/items/cl/arte/arco_longo_bronze"
 },
 "cl:arco_longo_bronze_ametista": {
  "pt": "Arco Longo de Bronze de Ametista",
  "en": "Amethyst Bronze Longbow",
  "icone": "textures/items/cl/arte/arco_longo_bronze_ametista"
 },
 "cl:arco_longo_cacto": {
  "pt": "Arco Longo de Cacto",
  "en": "Cactus Longbow",
  "icone": "textures/items/cl/arte/arco_longo_cacto"
 },
 "cl:arco_longo_cobalto": {
  "pt": "Arco Longo de Cobalto",
  "en": "Cobalt Longbow",
  "icone": "textures/items/cl/arte/arco_longo_cobalto"
 },
 "cl:arco_longo_cobre": {
  "pt": "Arco Longo de Cobre",
  "en": "Copper Longbow",
  "icone": "textures/items/cl/arte/arco_longo_cobre"
 },
 "cl:arco_longo_coro": {
  "pt": "Arco Longo de Chorus",
  "en": "Chorus Longbow",
  "icone": "textures/items/cl/arte/arco_longo_coro"
 },
 "cl:arco_longo_ferro": {
  "pt": "Arco Longo de Ferro",
  "en": "Iron Longbow",
  "icone": "textures/items/cl/arte/arco_longo_ferro"
 },
 "cl:arco_longo_ferro_porco": {
  "pt": "Arco Longo de Ferro-Porco",
  "en": "Pig Iron Longbow",
  "icone": "textures/items/cl/arte/arco_longo_ferro_porco"
 },
 "cl:arco_longo_hepatizon": {
  "pt": "Arco Longo de Hepatizão",
  "en": "Hepatizon Longbow",
  "icone": "textures/items/cl/arte/arco_longo_hepatizon"
 },
 "cl:arco_longo_madeira": {
  "pt": "Arco Longo de Madeira",
  "en": "Wood Longbow",
  "icone": "textures/items/cl/arte/arco_longo_madeira"
 },
 "cl:arco_longo_madeira_slime": {
  "pt": "Arco Longo de Madeira de Slime",
  "en": "Slimewood Longbow",
  "icone": "textures/items/cl/arte/arco_longo_madeira_slime"
 },
 "cl:arco_longo_madeira_slime_revestida": {
  "pt": "Arco Longo de Madeira de Slime Revestida",
  "en": "Plated Slimewood Longbow",
  "icone": "textures/items/cl/arte/arco_longo_madeira_slime_revestida"
 },
 "cl:arco_longo_madeira_tratada": {
  "pt": "Arco Longo de Madeira Tratada",
  "en": "Treated Wood Longbow",
  "icone": "textures/items/cl/arte/arco_longo_madeira_tratada"
 },
 "cl:arco_longo_manyullyn": {
  "pt": "Arco Longo de Manyullyn",
  "en": "Manyullyn Longbow",
  "icone": "textures/items/cl/arte/arco_longo_manyullyn"
 },
 "cl:arco_longo_nahuatl": {
  "pt": "Arco Longo de Nahuatl",
  "en": "Nahuatl Longbow",
  "icone": "textures/items/cl/arte/arco_longo_nahuatl"
 },
 "cl:arco_longo_osso": {
  "pt": "Arco Longo de Osso",
  "en": "Bone Longbow",
  "icone": "textures/items/cl/arte/arco_longo_osso"
 },
 "cl:arco_longo_osso_blaze": {
  "pt": "Arco Longo de Osso de Blaze",
  "en": "Blazing Bone Longbow",
  "icone": "textures/items/cl/arte/arco_longo_osso_blaze"
 },
 "cl:arco_longo_osso_necrotico": {
  "pt": "Arco Longo de Osso Necrótico",
  "en": "Necrotic Bone Longbow",
  "icone": "textures/items/cl/arte/arco_longo_osso_necrotico"
 },
 "cl:arco_longo_osso_venenoso": {
  "pt": "Arco Longo de Osso Venenoso",
  "en": "Venombone Longbow",
  "icone": "textures/items/cl/arte/arco_longo_osso_venenoso"
 },
 "cl:arco_longo_ouro_rosa": {
  "pt": "Arco Longo de Ouro Rosa",
  "en": "Rose Gold Longbow",
  "icone": "textures/items/cl/arte/arco_longo_ouro_rosa"
 },
 "cl:arco_longo_slime_brasa": {
  "pt": "Arco Longo de Slime de Brasa",
  "en": "Cinderslime Longbow",
  "icone": "textures/items/cl/arte/arco_longo_slime_brasa"
 },
 "cl:arco_longo_slime_cavaleiro": {
  "pt": "Arco Longo de Slime-Cavaleiro",
  "en": "Knightslime Longbow",
  "icone": "textures/items/cl/arte/arco_longo_slime_cavaleiro"
 },
 "cl:arco_longo_slime_rainha": {
  "pt": "Arco Longo de Slime da Rainha",
  "en": "Queen's Slime Longbow",
  "icone": "textures/items/cl/arte/arco_longo_slime_rainha"
 },
 "cl:arenito_entalhado": {
  "pt": "Arenito Entalhado",
  "en": "Carved Sandstone",
  "icone": "textures/items/cl/blocos/arenito_entalhado"
 },
 "cl:arenito_ladrilho": {
  "pt": "Arenito Ladrilho",
  "en": "Tiles Sandstone",
  "icone": "textures/items/cl/blocos/arenito_ladrilho"
 },
 "cl:arenito_liso": {
  "pt": "Arenito Liso",
  "en": "Smooth Sandstone",
  "icone": "textures/items/cl/blocos/arenito_liso"
 },
 "cl:arenito_mosaico": {
  "pt": "Arenito Mosaico",
  "en": "Mosaic Sandstone",
  "icone": "textures/items/cl/blocos/arenito_mosaico"
 },
 "cl:arenito_pilar": {
  "pt": "Arenito Pilar",
  "en": "Pillar Sandstone",
  "icone": "textures/items/cl/blocos/arenito_pilar"
 },
 "cl:arenito_polido": {
  "pt": "Arenito Polido",
  "en": "Polished Sandstone",
  "icone": "textures/items/cl/blocos/arenito_polido"
 },
 "cl:arenito_tijolos": {
  "pt": "Arenito Tijolos",
  "en": "Bricks Sandstone",
  "icone": "textures/items/cl/blocos/arenito_tijolos"
 },
 "cl:arenito_tijolos_pequenos": {
  "pt": "Arenito Tijolinhos",
  "en": "Small Bricks Sandstone",
  "icone": "textures/items/cl/blocos/arenito_tijolos_pequenos"
 },
 "cl:argamassa": {
  "pt": "Argamassa",
  "en": "Grout",
  "icone": "textures/items/cl/arte/argamassa"
 },
 "cl:argamassa_nether": {
  "pt": "Argamassa do Nether",
  "en": "Nether Grout",
  "icone": "textures/items/cl/c/argamassa_nether"
 },
 "cl:armazem_corpos": {
  "pt": "Armazém de Corpos",
  "en": "Shell Storage",
  "icone": "textures/items/cl/arte/blocos/armazem_corpos"
 },
 "cl:arroz": {
  "pt": "Arroz",
  "en": "Rice",
  "icone": "textures/items/cl/arte/arroz"
 },
 "cl:arroz_cogumelos": {
  "pt": "Arroz com Cogumelos",
  "en": "Mushroom Rice",
  "icone": "textures/items/cl/arte/arroz_cogumelos"
 },
 "cl:arroz_cozido": {
  "pt": "Arroz Cozido",
  "en": "Cooked Rice",
  "icone": "textures/items/cl/arte/arroz_cozido"
 },
 "cl:arroz_frito": {
  "pt": "Arroz Frito",
  "en": "Fried Rice",
  "icone": "textures/items/cl/arte/arroz_frito"
 },
 "cl:asa_delta": {
  "pt": "Asa-Delta",
  "en": "Hang Glider",
  "icone": "textures/items/cl/arte/asa_delta"
 },
 "cl:asa_planador": {
  "pt": "Asa de Planador",
  "en": "Glider Wing",
  "icone": "textures/items/cl/arte/asa_planador"
 },
 "cl:assadeira": {
  "pt": "Assadeira",
  "en": "Bakeware",
  "icone": "textures/items/cl/arte/blocos/assadeira"
 },
 "cl:bacia_fundicao": {
  "pt": "Bacia de Fundição",
  "en": "Casting Basin",
  "icone": "textures/items/cl/blocos/bacia_fundicao"
 },
 "cl:bacia_fundicao_chamuscada": {
  "pt": "Bacia de Fundição Chamuscada",
  "en": "Scorched Casting Basin",
  "icone": "textures/blocks/cl/arte/bacia_fundicao_chamuscada_topo"
 },
 "cl:bacon": {
  "pt": "Bacon",
  "en": "Bacon",
  "icone": "textures/items/cl/arte/bacon"
 },
 "cl:bacon_cozido": {
  "pt": "Bacon Cozido",
  "en": "Cooked Bacon",
  "icone": "textures/items/cl/arte/bacon_cozido"
 },
 "cl:bacon_ovos": {
  "pt": "Bacon com Ovos",
  "en": "Bacon and Eggs",
  "icone": "textures/items/cl/arte/bacon_ovos"
 },
 "cl:balao_amarelo": {
  "pt": "Balão Amarelo",
  "en": "Yellow Balloon",
  "icone": "textures/items/cl/arte/balao_amarelo"
 },
 "cl:balao_azul": {
  "pt": "Balão Azul",
  "en": "Blue Balloon",
  "icone": "textures/items/cl/arte/balao_azul"
 },
 "cl:balao_azul_claro": {
  "pt": "Balão Azul-Claro",
  "en": "Light Blue Balloon",
  "icone": "textures/items/cl/arte/balao_azul_claro"
 },
 "cl:balao_branco": {
  "pt": "Balão Branco",
  "en": "White Balloon",
  "icone": "textures/items/cl/arte/balao_branco"
 },
 "cl:balao_ciano": {
  "pt": "Balão Ciano",
  "en": "Cyan Balloon",
  "icone": "textures/items/cl/arte/balao_ciano"
 },
 "cl:balao_cinza": {
  "pt": "Balão Cinza",
  "en": "Gray Balloon",
  "icone": "textures/items/cl/arte/balao_cinza"
 },
 "cl:balao_cinza_claro": {
  "pt": "Balão Cinza-Claro",
  "en": "Light Gray Balloon",
  "icone": "textures/items/cl/arte/balao_cinza_claro"
 },
 "cl:balao_laranja": {
  "pt": "Balão Laranja",
  "en": "Orange Balloon",
  "icone": "textures/items/cl/arte/balao_laranja"
 },
 "cl:balao_lima": {
  "pt": "Balão Lima",
  "en": "Lime Balloon",
  "icone": "textures/items/cl/arte/balao_lima"
 },
 "cl:balao_magenta": {
  "pt": "Balão Magenta",
  "en": "Magenta Balloon",
  "icone": "textures/items/cl/arte/balao_magenta"
 },
 "cl:balao_marrom": {
  "pt": "Balão Marrom",
  "en": "Brown Balloon",
  "icone": "textures/items/cl/arte/balao_marrom"
 },
 "cl:balao_preto": {
  "pt": "Balão Preto",
  "en": "Black Balloon",
  "icone": "textures/items/cl/arte/balao_preto"
 },
 "cl:balao_rosa": {
  "pt": "Balão Rosa",
  "en": "Pink Balloon",
  "icone": "textures/items/cl/arte/balao_rosa"
 },
 "cl:balao_roxo": {
  "pt": "Balão Roxo",
  "en": "Purple Balloon",
  "icone": "textures/items/cl/arte/balao_roxo"
 },
 "cl:balao_verde": {
  "pt": "Balão Verde",
  "en": "Green Balloon",
  "icone": "textures/items/cl/arte/balao_verde"
 },
 "cl:balao_vermelho": {
  "pt": "Balão Vermelho",
  "en": "Red Balloon",
  "icone": "textures/items/cl/arte/balao_vermelho"
 },
 "cl:balde_agua_fogo": {
  "pt": "Balde de Água de Fogo",
  "en": "Fire Water Bucket",
  "icone": "textures/items/cl/arte/balde_agua_fogo"
 },
 "cl:balde_combustivel": {
  "pt": "Balde de Combustível",
  "en": "Fuel Bucket",
  "icone": "textures/items/cl/arte/balde_combustivel"
 },
 "cl:balde_combustivel_foguete": {
  "pt": "Balde de Combustível de Foguete",
  "en": "Rocket Fuel Bucket",
  "icone": "textures/items/cl/arte/balde_combustivel_foguete"
 },
 "cl:balde_creosoto": {
  "pt": "Balde de Creosoto",
  "en": "Creosote Bucket",
  "icone": "textures/items/cl/c/balde_creosoto"
 },
 "cl:balde_destilado_nutrientes": {
  "pt": "Balde de Destilado de Nutrientes",
  "en": "Nutrient Distillation Bucket",
  "icone": "textures/items/cl/arte/balde_destilado_nutrientes"
 },
 "cl:balde_escuridao_liquida": {
  "pt": "Balde de Escuridão Líquida",
  "en": "Liquid Darkness Bucket",
  "icone": "textures/items/cl/arte/balde_escuridao_liquida"
 },
 "cl:balde_hootch": {
  "pt": "Balde de Hootch",
  "en": "Hootch Bucket",
  "icone": "textures/items/cl/arte/balde_hootch"
 },
 "cl:balde_luz_solar": {
  "pt": "Balde de Luz Solar Líquida",
  "en": "Liquid Sunshine Bucket",
  "icone": "textures/items/cl/arte/balde_luz_solar"
 },
 "cl:balde_orvalho_vazio": {
  "pt": "Balde de Orvalho do Vazio",
  "en": "Dew of the Void Bucket",
  "icone": "textures/items/cl/arte/balde_orvalho_vazio"
 },
 "cl:balde_petroleo": {
  "pt": "Balde de Petróleo",
  "en": "Oil Bucket",
  "icone": "textures/items/cl/arte/balde_petroleo"
 },
 "cl:balde_salmoura": {
  "pt": "Balde de Salmoura",
  "en": "Brine Bucket",
  "icone": "textures/items/cl/arte/balde_salmoura"
 },
 "cl:balde_semente_nuvem": {
  "pt": "Balde de Semente de Nuvem",
  "en": "Cloud Seed Bucket",
  "icone": "textures/items/cl/arte/balde_semente_nuvem"
 },
 "cl:balde_semente_nuvem_concentrada": {
  "pt": "Balde de Semente de Nuvem Concentrada",
  "en": "Cloud Seed Concentrated Bucket",
  "icone": "textures/items/cl/arte/balde_semente_nuvem_concentrada"
 },
 "cl:balde_suco_xp": {
  "pt": "Balde de Suco de XP",
  "en": "XP Juice Bucket",
  "icone": "textures/items/cl/arte/balde_suco_xp"
 },
 "cl:balde_vapor_levitacao": {
  "pt": "Balde de Vapor de Levitação",
  "en": "Vapor of Levity Bucket",
  "icone": "textures/items/cl/arte/balde_vapor_levitacao"
 },
 "cl:bancada_nasa": {
  "pt": "Bancada da NASA",
  "en": "NASA Workbench",
  "icone": "textures/items/cl/blocos/bancada_nasa"
 },
 "cl:banco_capacitores": {
  "pt": "Banco de Capacitores Avançado",
  "en": "Advanced Capacitor Bank",
  "icone": "textures/items/cl/blocos/banco_capacitores"
 },
 "cl:banco_capacitores_basico": {
  "pt": "Banco de Capacitores Básico",
  "en": "Basic Capacitor Bank",
  "icone": "textures/items/cl/blocos/banco_capacitores_basico"
 },
 "cl:banco_capacitores_vibrante": {
  "pt": "Banco de Capacitores Vibrante",
  "en": "Vibrant Capacitor Bank",
  "icone": "textures/items/cl/blocos/banco_capacitores_vibrante"
 },
 "cl:barra_borracha": {
  "pt": "Barra de Borracha",
  "en": "Rubber Bar",
  "icone": "textures/items/cl/arte/barra_borracha"
 },
 "cl:barra_combustivel": {
  "pt": "Barra de Combustível",
  "en": "Yellorium Fuel Rod",
  "icone": "textures/items/cl/blocos/barra_combustivel"
 },
 "cl:barra_controle": {
  "pt": "Barra de Controle",
  "en": "Reactor Control Rod",
  "icone": "textures/items/cl/blocos/barra_controle"
 },
 "cl:barra_grafite": {
  "pt": "Barra de Grafite",
  "en": "Graphite Bar",
  "icone": "textures/items/cl/arte/barra_grafite"
 },
 "cl:barras_aco_end": {
  "pt": "Barras de Aço do End",
  "en": "End Steel Bars",
  "icone": "textures/items/cl/blocos/barras_aco_end"
 },
 "cl:barras_aco_negro": {
  "pt": "Barras de Aço Sombrio",
  "en": "Dark Steel Bars",
  "icone": "textures/items/cl/blocos/barras_aco_negro"
 },
 "cl:barril_armazenamento": {
  "pt": "Barril de Armazenamento",
  "en": "Storage Barrel",
  "icone": "textures/items/cl/arte/blocos/barril_armazenamento"
 },
 "cl:barril_madeira": {
  "pt": "Barril de Madeira",
  "en": "Wooden Barrel",
  "icone": "textures/items/cl/arte/blocos/barril_madeira"
 },
 "cl:barril_pedra": {
  "pt": "Barril de Pedra",
  "en": "Stone Barrel",
  "icone": "textures/items/cl/arte/blocos/barril_pedra"
 },
 "cl:batata_recheada": {
  "pt": "Batata Recheada",
  "en": "Stuffed Potato",
  "icone": "textures/items/cl/arte/batata_recheada"
 },
 "cl:batedor": {
  "pt": "Batedor",
  "en": "Whisk",
  "icone": "textures/items/cl/arte/batedor"
 },
 "cl:bateria": {
  "pt": "Bateria",
  "en": "Battery",
  "icone": "textures/items/cl/arte/blocos/bateria"
 },
 "cl:bateria_pw_ardente": {
  "pt": "Bateria Ardente",
  "en": "Blazing Battery",
  "icone": "textures/items/cl/arte/bateria_pw_ardente"
 },
 "cl:bateria_pw_basico": {
  "pt": "Bateria Básico",
  "en": "Basic Battery",
  "icone": "textures/items/cl/arte/bateria_pw_basico"
 },
 "cl:bateria_pw_endurecido": {
  "pt": "Bateria Endurecido",
  "en": "Hardened Battery",
  "icone": "textures/items/cl/arte/bateria_pw_endurecido"
 },
 "cl:bateria_pw_espiritual": {
  "pt": "Bateria Espiritual",
  "en": "Spirited Battery",
  "icone": "textures/items/cl/arte/bateria_pw_espiritual"
 },
 "cl:bateria_pw_inicial": {
  "pt": "Bateria Inicial",
  "en": "Starter Battery",
  "icone": "textures/items/cl/arte/bateria_pw_inicial"
 },
 "cl:bateria_pw_niotico": {
  "pt": "Bateria Niótico",
  "en": "Niotic Battery",
  "icone": "textures/items/cl/arte/bateria_pw_niotico"
 },
 "cl:bateria_pw_nitro": {
  "pt": "Bateria Nitro",
  "en": "Nitro Battery",
  "icone": "textures/items/cl/arte/bateria_pw_nitro"
 },
 "cl:bau_me": {
  "pt": "Baú ME",
  "en": "ME Chest",
  "icone": "textures/items/cl/blocos/bau_me"
 },
 "cl:bau_tesouro": {
  "pt": "Baú do Tesouro",
  "en": "Treasure Chest",
  "icone": "textures/items/cl/blocos/bau_tesouro"
 },
 "cl:bau_vacuo": {
  "pt": "Baú de Vácuo",
  "en": "Vacuum Chest",
  "icone": "textures/items/cl/blocos/bau_vacuo"
 },
 "cl:besta_aco": {
  "pt": "Besta de Aço",
  "en": "Steel Crossbow",
  "icone": "textures/items/cl/arte/besta_aco"
 },
 "cl:besta_aco_slime": {
  "pt": "Besta de Aço de Slime",
  "en": "Slimesteel Crossbow",
  "icone": "textures/items/cl/arte/besta_aco_slime"
 },
 "cl:besta_aluminio": {
  "pt": "Besta de aluminio",
  "en": "aluminio Crossbow",
  "icone": "textures/items/cl/arte/besta_aluminio"
 },
 "cl:besta_bronze": {
  "pt": "Besta de Bronze",
  "en": "Bronze Crossbow",
  "icone": "textures/items/cl/arte/besta_bronze"
 },
 "cl:besta_bronze_ametista": {
  "pt": "Besta de Bronze de Ametista",
  "en": "Amethyst Bronze Crossbow",
  "icone": "textures/items/cl/arte/besta_bronze_ametista"
 },
 "cl:besta_cacto": {
  "pt": "Besta de Cacto",
  "en": "Cactus Crossbow",
  "icone": "textures/items/cl/arte/besta_cacto"
 },
 "cl:besta_cobalto": {
  "pt": "Besta de Cobalto",
  "en": "Cobalt Crossbow",
  "icone": "textures/items/cl/arte/besta_cobalto"
 },
 "cl:besta_cobre": {
  "pt": "Besta de Cobre",
  "en": "Copper Crossbow",
  "icone": "textures/items/cl/arte/besta_cobre"
 },
 "cl:besta_coro": {
  "pt": "Besta de Chorus",
  "en": "Chorus Crossbow",
  "icone": "textures/items/cl/arte/besta_coro"
 },
 "cl:besta_ferro": {
  "pt": "Besta de Ferro",
  "en": "Iron Crossbow",
  "icone": "textures/items/cl/arte/besta_ferro"
 },
 "cl:besta_ferro_porco": {
  "pt": "Besta de Ferro-Porco",
  "en": "Pig Iron Crossbow",
  "icone": "textures/items/cl/arte/besta_ferro_porco"
 },
 "cl:besta_hepatizon": {
  "pt": "Besta de Hepatizão",
  "en": "Hepatizon Crossbow",
  "icone": "textures/items/cl/arte/besta_hepatizon"
 },
 "cl:besta_madeira": {
  "pt": "Besta de Madeira",
  "en": "Wood Crossbow",
  "icone": "textures/items/cl/arte/besta_madeira"
 },
 "cl:besta_madeira_slime": {
  "pt": "Besta de Madeira de Slime",
  "en": "Slimewood Crossbow",
  "icone": "textures/items/cl/arte/besta_madeira_slime"
 },
 "cl:besta_madeira_slime_revestida": {
  "pt": "Besta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Crossbow",
  "icone": "textures/items/cl/arte/besta_madeira_slime_revestida"
 },
 "cl:besta_madeira_tratada": {
  "pt": "Besta de Madeira Tratada",
  "en": "Treated Wood Crossbow",
  "icone": "textures/items/cl/arte/besta_madeira_tratada"
 },
 "cl:besta_manyullyn": {
  "pt": "Besta de Manyullyn",
  "en": "Manyullyn Crossbow",
  "icone": "textures/items/cl/arte/besta_manyullyn"
 },
 "cl:besta_nahuatl": {
  "pt": "Besta de Nahuatl",
  "en": "Nahuatl Crossbow",
  "icone": "textures/items/cl/arte/besta_nahuatl"
 },
 "cl:besta_osso": {
  "pt": "Besta de Osso",
  "en": "Bone Crossbow",
  "icone": "textures/items/cl/arte/besta_osso"
 },
 "cl:besta_osso_blaze": {
  "pt": "Besta de Osso de Blaze",
  "en": "Blazing Bone Crossbow",
  "icone": "textures/items/cl/arte/besta_osso_blaze"
 },
 "cl:besta_osso_necrotico": {
  "pt": "Besta de Osso Necrótico",
  "en": "Necrotic Bone Crossbow",
  "icone": "textures/items/cl/arte/besta_osso_necrotico"
 },
 "cl:besta_osso_venenoso": {
  "pt": "Besta de Osso Venenoso",
  "en": "Venombone Crossbow",
  "icone": "textures/items/cl/arte/besta_osso_venenoso"
 },
 "cl:besta_ouro_rosa": {
  "pt": "Besta de Ouro Rosa",
  "en": "Rose Gold Crossbow",
  "icone": "textures/items/cl/arte/besta_ouro_rosa"
 },
 "cl:besta_slime_brasa": {
  "pt": "Besta de Slime de Brasa",
  "en": "Cinderslime Crossbow",
  "icone": "textures/items/cl/arte/besta_slime_brasa"
 },
 "cl:besta_slime_cavaleiro": {
  "pt": "Besta de Slime-Cavaleiro",
  "en": "Knightslime Crossbow",
  "icone": "textures/items/cl/arte/besta_slime_cavaleiro"
 },
 "cl:besta_slime_rainha": {
  "pt": "Besta de Slime da Rainha",
  "en": "Queen's Slime Crossbow",
  "icone": "textures/items/cl/arte/besta_slime_rainha"
 },
 "cl:bicho_seda": {
  "pt": "Bicho-da-seda",
  "en": "Silkworm",
  "icone": "textures/items/cl/arte/bicho_seda"
 },
 "cl:bicho_seda_cozido": {
  "pt": "Bicho-da-seda Cozido",
  "en": "Cooked Silkworm",
  "icone": "textures/items/cl/arte/bicho_seda_cozido"
 },
 "cl:bico_foguete": {
  "pt": "Bico do Foguete",
  "en": "Nose Cone",
  "icone": "textures/items/cl/arte/bico_foguete"
 },
 "cl:bife_batatas": {
  "pt": "Bife com Batatas",
  "en": "Steak and Potatoes",
  "icone": "textures/items/cl/arte/bife_batatas"
 },
 "cl:biocombustivel": {
  "pt": "Biocombustível",
  "en": "Bio Fuel",
  "icone": "textures/items/cl/arte/biocombustivel"
 },
 "cl:biplano": {
  "pt": "Biplano",
  "en": "Biplane",
  "icone": "textures/items/cl/arte/biplano"
 },
 "cl:bloco_aco": {
  "pt": "Bloco de Aço",
  "en": "Block of Steel",
  "icone": "textures/items/cl/blocos/bloco_aco"
 },
 "cl:bloco_aco_end": {
  "pt": "Bloco de Aço do End",
  "en": "End Steel Block",
  "icone": "textures/items/cl/blocos/bloco_aco_end"
 },
 "cl:bloco_aco_energizado": {
  "pt": "Bloco de Aço Energizado",
  "en": "Energized Steel Block",
  "icone": "textures/items/cl/blocos/bloco_aco_energizado"
 },
 "cl:bloco_aco_negro": {
  "pt": "Bloco de Aço Sombrio",
  "en": "Dark Steel Block",
  "icone": "textures/items/cl/blocos/bloco_aco_negro"
 },
 "cl:bloco_aco_slime": {
  "pt": "Bloco de Aço de Slime",
  "en": "Block of Slimesteel",
  "icone": "textures/blocks/cl/arte/bloco_aco_slime"
 },
 "cl:bloco_almario": {
  "pt": "Bloco de Almário",
  "en": "Soularium Block",
  "icone": "textures/items/cl/blocos/bloco_almario"
 },
 "cl:bloco_angelical": {
  "pt": "Bloco Angelical",
  "en": "Angel Block",
  "icone": "textures/items/cl/blocos/bloco_angelical"
 },
 "cl:bloco_bronze": {
  "pt": "Bloco de Bronze",
  "en": "Block of Bronze",
  "icone": "textures/items/cl/blocos/bloco_bronze"
 },
 "cl:bloco_bronze_ametista": {
  "pt": "Bloco de Bronze de Ametista",
  "en": "Block of Amethyst Bronze",
  "icone": "textures/blocks/cl/c/bloco_bronze_ametista"
 },
 "cl:bloco_cacto": {
  "pt": "Bloco de Cacto",
  "en": "Cactus Block",
  "icone": "textures/items/cl/blocos/bloco_cacto"
 },
 "cl:bloco_cana": {
  "pt": "Bloco de Cana-de-Açúcar",
  "en": "Sugar Cane Block",
  "icone": "textures/items/cl/blocos/bloco_cana"
 },
 "cl:bloco_carvao_vegetal": {
  "pt": "Bloco de Carvão Vegetal",
  "en": "Charcoal Block",
  "icone": "textures/items/cl/blocos/bloco_carvao_vegetal"
 },
 "cl:bloco_cobalto": {
  "pt": "Bloco de Cobalto",
  "en": "Block of Cobalt",
  "icone": "textures/blocks/cl/arte/bloco_cobalto"
 },
 "cl:bloco_cobalto_bruto": {
  "pt": "Bloco de Cobalto Bruto",
  "en": "Block of Raw Cobalt",
  "icone": "textures/blocks/cl/arte/bloco_cobalto_bruto"
 },
 "cl:bloco_coque": {
  "pt": "Bloco de Coque",
  "en": "Block of Coal Coke",
  "icone": "textures/items/cl/blocos/bloco_coque"
 },
 "cl:bloco_cristal_ardente": {
  "pt": "Bloco de Cristal Ardente",
  "en": "Blazing Crystal Block",
  "icone": "textures/items/cl/blocos/bloco_cristal_ardente"
 },
 "cl:bloco_cristal_espiritual": {
  "pt": "Bloco de Cristal Espiritual",
  "en": "Spirited Crystal Block",
  "icone": "textures/items/cl/blocos/bloco_cristal_espiritual"
 },
 "cl:bloco_cristal_niotico": {
  "pt": "Bloco de Cristal Niótico",
  "en": "Niotic Crystal Block",
  "icone": "textures/items/cl/blocos/bloco_cristal_niotico"
 },
 "cl:bloco_cristal_nitro": {
  "pt": "Bloco de Cristal Nitro",
  "en": "Nitro Crystal Block",
  "icone": "textures/items/cl/blocos/bloco_cristal_nitro"
 },
 "cl:bloco_cristal_slime_ceu": {
  "pt": "Bloco de Cristal de Slime-do-Céu",
  "en": "Skyslime Crystal Block",
  "icone": "textures/blocks/cl/arte/bloco_cristal_slime_ceu"
 },
 "cl:bloco_cristal_slime_ender": {
  "pt": "Bloco de Cristal de Slime-do-Ender",
  "en": "Enderslime Crystal Block",
  "icone": "textures/blocks/cl/arte/bloco_cristal_slime_ender"
 },
 "cl:bloco_cristal_slime_icor": {
  "pt": "Bloco de Cristal de Icor",
  "en": "Ichor Crystal Block",
  "icone": "textures/blocks/cl/arte/bloco_cristal_slime_icor"
 },
 "cl:bloco_cristal_slime_terra": {
  "pt": "Bloco de Cristal de Slime-da-Terra",
  "en": "Earthslime Crystal Block",
  "icone": "textures/blocks/cl/arte/bloco_cristal_slime_terra"
 },
 "cl:bloco_estanho": {
  "pt": "Bloco de Estanho",
  "en": "Block of Tin",
  "icone": "textures/items/cl/blocos/bloco_estanho"
 },
 "cl:bloco_ferro_comprimido": {
  "pt": "Bloco de Ferro Comprimido",
  "en": "Compressed Iron Block",
  "icone": "textures/items/cl/blocos/bloco_ferro_comprimido"
 },
 "cl:bloco_ferro_condutor": {
  "pt": "Bloco de Liga Condutiva",
  "en": "Conductive Alloy Block",
  "icone": "textures/items/cl/blocos/bloco_ferro_condutor"
 },
 "cl:bloco_ferro_porco": {
  "pt": "Bloco de Ferro-Porco",
  "en": "Block of Pig Iron",
  "icone": "textures/blocks/cl/arte/bloco_ferro_porco"
 },
 "cl:bloco_ferro_pulsante": {
  "pt": "Bloco de Liga Pulsante",
  "en": "Pulsating Alloy Block",
  "icone": "textures/items/cl/blocos/bloco_ferro_pulsante"
 },
 "cl:bloco_fluix": {
  "pt": "Bloco de Fluix",
  "en": "Fluix Block",
  "icone": "textures/blocks/cl/arte/bloco_fluix"
 },
 "cl:bloco_grafite": {
  "pt": "Bloco de Grafite",
  "en": "Graphite Block",
  "icone": "textures/items/cl/blocos/bloco_grafite"
 },
 "cl:bloco_gravetos": {
  "pt": "Bloco de Gravetos",
  "en": "Stick Block",
  "icone": "textures/items/cl/blocos/bloco_gravetos"
 },
 "cl:bloco_hepatizon": {
  "pt": "Bloco de Hepatizão",
  "en": "Block of Hepatizon",
  "icone": "textures/blocks/cl/arte/bloco_hepatizon"
 },
 "cl:bloco_liga_energetica": {
  "pt": "Bloco de Liga Energética",
  "en": "Energetic Alloy Block",
  "icone": "textures/items/cl/blocos/bloco_liga_energetica"
 },
 "cl:bloco_liga_redstone": {
  "pt": "Bloco de Liga de Redstone",
  "en": "Redstone Alloy Block",
  "icone": "textures/items/cl/blocos/bloco_liga_redstone"
 },
 "cl:bloco_liga_vibrante": {
  "pt": "Bloco de Liga Vibrante",
  "en": "Vibrant Alloy Block",
  "icone": "textures/items/cl/blocos/bloco_liga_vibrante"
 },
 "cl:bloco_manyullyn": {
  "pt": "Bloco de Manyullyn",
  "en": "Block of Manyullyn",
  "icone": "textures/blocks/cl/arte/bloco_manyullyn"
 },
 "cl:bloco_maquina": {
  "pt": "Bloco de Máquina",
  "en": "Machine Block",
  "icone": "textures/items/cl/arte/blocos/bloco_maquina"
 },
 "cl:bloco_ouro_rosa": {
  "pt": "Bloco de Ouro Rosa",
  "en": "Block of Rose Gold",
  "icone": "textures/blocks/cl/c/bloco_ouro_rosa"
 },
 "cl:bloco_placa_ferro": {
  "pt": "Placa de Ferro",
  "en": "Iron Plate",
  "icone": "textures/items/cl/blocos/bloco_placa_ferro"
 },
 "cl:bloco_placa_ferro_enferrujada": {
  "pt": "Placa de Ferro Enferrujada",
  "en": "Rusty Iron Plate",
  "icone": "textures/items/cl/blocos/bloco_placa_ferro_enferrujada"
 },
 "cl:bloco_slime_brasa": {
  "pt": "Bloco de Slime de Brasa",
  "en": "Block of Cinderslime",
  "icone": "textures/blocks/cl/arte/bloco_slime_brasa"
 },
 "cl:bloco_slime_cavaleiro": {
  "pt": "Bloco de Slime-Cavaleiro",
  "en": "Block of Knightslime",
  "icone": "textures/blocks/cl/arte/bloco_slime_cavaleiro"
 },
 "cl:bloco_slime_ceu": {
  "pt": "Bloco de Slime-do-Céu",
  "en": "Skyslime Block",
  "icone": "textures/blocks/cl/arte/bloco_slime_ceu"
 },
 "cl:bloco_slime_ender": {
  "pt": "Bloco de Slime-do-Ender",
  "en": "Enderslime Block",
  "icone": "textures/blocks/cl/arte/bloco_slime_ender"
 },
 "cl:bloco_slime_icor": {
  "pt": "Bloco de Icor",
  "en": "Ichor Block",
  "icone": "textures/blocks/cl/arte/bloco_slime_icor"
 },
 "cl:bloco_slime_rainha": {
  "pt": "Bloco de Slime da Rainha",
  "en": "Block of Queen's Slime",
  "icone": "textures/blocks/cl/arte/bloco_slime_rainha"
 },
 "cl:bloco_slime_sangue": {
  "pt": "Bloco de Sangue",
  "en": "Blood Block",
  "icone": "textures/blocks/cl/arte/bloco_slime_sangue"
 },
 "cl:bloco_uraninita": {
  "pt": "Bloco de Uraninita",
  "en": "Uraninite Block",
  "icone": "textures/items/cl/blocos/bloco_uraninita"
 },
 "cl:bloco_yellorium": {
  "pt": "Bloco de Yellorium",
  "en": "Yellorium Block",
  "icone": "textures/items/cl/blocos/bloco_yellorium"
 },
 "cl:bobina_bt": {
  "pt": "Bobina de Baixa Tensão",
  "en": "LV Coil Block Item",
  "icone": "textures/items/cl/c/bobina_bt"
 },
 "cl:bobina_fio_cobre": {
  "pt": "Bobina de Fio de Cobre",
  "en": "LV Wire Coil",
  "icone": "textures/items/cl/c/bobina_fio_cobre"
 },
 "cl:bola_musgo": {
  "pt": "Bola de Musgo",
  "en": "Ball of Moss",
  "icone": "textures/items/cl/arte/bola_musgo"
 },
 "cl:bola_neve_carregada": {
  "pt": "Bola de Neve Carregada",
  "en": "Charged Snowball",
  "icone": "textures/items/cl/arte/bola_neve_carregada"
 },
 "cl:bola_slime_ceu": {
  "pt": "Bola de Slime-do-Céu",
  "en": "Skyslime Ball",
  "icone": "textures/items/cl/arte/bola_slime_ceu"
 },
 "cl:bola_slime_ender": {
  "pt": "Bola de Slime-do-Ender",
  "en": "Enderslime Ball",
  "icone": "textures/items/cl/arte/bola_slime_ender"
 },
 "cl:bola_slime_icor": {
  "pt": "Bola de Icor",
  "en": "Ichor Ball",
  "icone": "textures/items/cl/arte/bola_slime_icor"
 },
 "cl:bola_slime_sangue": {
  "pt": "Bola de Sangue",
  "en": "Blood Ball",
  "icone": "textures/items/cl/arte/bola_slime_sangue"
 },
 "cl:bolinho_arroz": {
  "pt": "Bolinho de Arroz",
  "en": "Rice Cake",
  "icone": "textures/items/cl/arte/bolinho_arroz"
 },
 "cl:bolinhos": {
  "pt": "Bolinhos",
  "en": "Dumplings",
  "icone": "textures/items/cl/arte/bolinhos"
 },
 "cl:bomba": {
  "pt": "Bomba",
  "en": "Pump",
  "icone": "textures/items/cl/blocos/bomba"
 },
 "cl:botas_placa_aco": {
  "pt": "Botas de Placa de Aço",
  "en": "Steel Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_aco"
 },
 "cl:botas_placa_aco_slime": {
  "pt": "Botas de Placa de Aço de Slime",
  "en": "Slimesteel Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_aco_slime"
 },
 "cl:botas_placa_aluminio": {
  "pt": "Botas de Placa de Alumínio",
  "en": "Aluminum Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_aluminio"
 },
 "cl:botas_placa_bronze": {
  "pt": "Botas de Placa de Bronze",
  "en": "Bronze Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_bronze"
 },
 "cl:botas_placa_bronze_ametista": {
  "pt": "Botas de Placa de Bronze de Ametista",
  "en": "Amethyst Bronze Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_bronze_ametista"
 },
 "cl:botas_placa_cobalto": {
  "pt": "Botas de Placa de Cobalto",
  "en": "Cobalt Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_cobalto"
 },
 "cl:botas_placa_cobre": {
  "pt": "Botas de Placa de Cobre",
  "en": "Copper Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_cobre"
 },
 "cl:botas_placa_ferro": {
  "pt": "Botas de Placa de Ferro",
  "en": "Iron Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_ferro"
 },
 "cl:botas_placa_ferro_porco": {
  "pt": "Botas de Placa de Ferro-Porco",
  "en": "Pig Iron Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_ferro_porco"
 },
 "cl:botas_placa_hepatizon": {
  "pt": "Botas de Placa de Hepatizão",
  "en": "Hepatizon Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_hepatizon"
 },
 "cl:botas_placa_manyullyn": {
  "pt": "Botas de Placa de Manyullyn",
  "en": "Manyullyn Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_manyullyn"
 },
 "cl:botas_placa_obsidiana": {
  "pt": "Botas de Placa de Obsidiana",
  "en": "Obsidian Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_obsidiana"
 },
 "cl:botas_placa_osmio": {
  "pt": "Botas de Placa de Ósmio",
  "en": "Osmium Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_osmio"
 },
 "cl:botas_placa_ouro": {
  "pt": "Botas de Placa de Ouro",
  "en": "Gold Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_ouro"
 },
 "cl:botas_placa_ouro_rosa": {
  "pt": "Botas de Placa de Ouro Rosa",
  "en": "Rose Gold Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_ouro_rosa"
 },
 "cl:botas_placa_pedra_chamuscada": {
  "pt": "Botas de Placa de Pedra Chamuscada",
  "en": "Scorched Stone Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_pedra_chamuscada"
 },
 "cl:botas_placa_pedra_refrataria": {
  "pt": "Botas de Placa de Pedra Carbonizada",
  "en": "Seared Stone Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_pedra_refrataria"
 },
 "cl:botas_placa_slime_brasa": {
  "pt": "Botas de Placa de Slime de Brasa",
  "en": "Cinderslime Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_slime_brasa"
 },
 "cl:botas_placa_slime_cavaleiro": {
  "pt": "Botas de Placa de Slime-Cavaleiro",
  "en": "Knightslime Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_slime_cavaleiro"
 },
 "cl:botas_placa_slime_rainha": {
  "pt": "Botas de Placa de Slime da Rainha",
  "en": "Queen's Slime Plate Boots",
  "icone": "textures/items/cl/arte/botas_placa_slime_rainha"
 },
 "cl:botas_slime": {
  "pt": "Botas de Slime",
  "en": "Slime Boots",
  "icone": "textures/items/cl/arte/botas_slime"
 },
 "cl:botas_viajante": {
  "pt": "Botas de Viajante",
  "en": "Traveler's Boots",
  "icone": "textures/items/cl/arte/botas_viajante"
 },
 "cl:broa_milho": {
  "pt": "Broa de Milho",
  "en": "Cornbread",
  "icone": "textures/items/cl/arte/broa_milho"
 },
 "cl:burrito": {
  "pt": "Burrito de Feijão",
  "en": "Bean Burrito",
  "icone": "textures/items/cl/arte/burrito"
 },
 "cl:bussola_aviao": {
  "pt": "Bússola do Avião",
  "en": "Plane Compass",
  "icone": "textures/items/cl/arte/bussola_aviao"
 },
 "cl:cabeca_enderman": {
  "pt": "Cabeça de Enderman",
  "en": "Enderman Head",
  "icone": "textures/items/cl/c/cabeca_enderman"
 },
 "cl:cabide_armadura": {
  "pt": "Cabide de Armadura",
  "en": "Armor Stand",
  "icone": "textures/items/cl/arte/blocos/cabide_armadura"
 },
 "cl:cabo": {
  "pt": "Cabo de Cobre",
  "en": "Copper Cable",
  "icone": "textures/items/cl/arte/blocos/cabo"
 },
 "cl:cabo_me_fluix": {
  "pt": "Cabo ME Fluix",
  "en": "Fluix ME Glass Cable",
  "icone": "textures/items/cl/c/cabo_me_fluix"
 },
 "cl:cabo_powah_ardente": {
  "pt": "Cabo de Energia Ardente",
  "en": "Blazing Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_ardente"
 },
 "cl:cabo_powah_basico": {
  "pt": "Cabo de Energia Básico",
  "en": "Basic Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_basico"
 },
 "cl:cabo_powah_endurecido": {
  "pt": "Cabo de Energia Endurecido",
  "en": "Hardened Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_endurecido"
 },
 "cl:cabo_powah_espiritual": {
  "pt": "Cabo de Energia Espiritual",
  "en": "Spirited Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_espiritual"
 },
 "cl:cabo_powah_inicial": {
  "pt": "Cabo de Energia Inicial",
  "en": "Starter Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_inicial"
 },
 "cl:cabo_powah_niotico": {
  "pt": "Cabo de Energia Niótico",
  "en": "Niotic Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_niotico"
 },
 "cl:cabo_powah_nitro": {
  "pt": "Cabo de Energia Nitro",
  "en": "Nitro Energy Cable",
  "icone": "textures/items/cl/blocos/cabo_powah_nitro"
 },
 "cl:cacarola": {
  "pt": "Caçarola",
  "en": "Saucepan",
  "icone": "textures/items/cl/arte/blocos/cacarola"
 },
 "cl:cacho_cristal_slime_ceu": {
  "pt": "Aglomerado de Cristal de Slime-do-Céu",
  "en": "Skyslime Crystal Cluster",
  "icone": "textures/blocks/cl/arte/cacho_cristal_slime_ceu"
 },
 "cl:cacho_cristal_slime_ender": {
  "pt": "Aglomerado de Cristal de Slime-do-Ender",
  "en": "Enderslime Crystal Cluster",
  "icone": "textures/blocks/cl/arte/cacho_cristal_slime_ender"
 },
 "cl:cacho_cristal_slime_icor": {
  "pt": "Aglomerado de Cristal de Icor",
  "en": "Ichor Crystal Cluster",
  "icone": "textures/blocks/cl/arte/cacho_cristal_slime_icor"
 },
 "cl:cacho_cristal_slime_terra": {
  "pt": "Aglomerado de Cristal de Slime-da-Terra",
  "en": "Earthslime Crystal Cluster",
  "icone": "textures/blocks/cl/arte/cacho_cristal_slime_terra"
 },
 "cl:cacho_tamaras": {
  "pt": "Cacho de Tâmaras",
  "en": "Date Bunch",
  "icone": "textures/items/cl/blocos/cacho_tamaras"
 },
 "cl:cadinho": {
  "pt": "Cadinho",
  "en": "Crucible",
  "icone": "textures/items/cl/arte/blocos/cadinho"
 },
 "cl:cadinho_cru": {
  "pt": "Cadinho Cru",
  "en": "Unfired Crucible",
  "icone": "textures/items/cl/arte/cadinho_cru"
 },
 "cl:caixa_engrenagens": {
  "pt": "Caixa de Engrenagens",
  "en": "Gearbox",
  "icone": "textures/items/cl/blocos/caixa_engrenagens"
 },
 "cl:caixa_entrega": {
  "pt": "Caixa de Entrega",
  "en": "Quest Delivery System",
  "icone": "textures/items/cl/arte/blocos/caixa_entrega"
 },
 "cl:caixote_batata": {
  "pt": "Caixote de Batata",
  "en": "Potato Crate",
  "icone": "textures/items/cl/blocos/caixote_batata"
 },
 "cl:caixote_beterraba": {
  "pt": "Caixote de Beterraba",
  "en": "Beetroot Crate",
  "icone": "textures/items/cl/blocos/caixote_beterraba"
 },
 "cl:caixote_cebola": {
  "pt": "Caixote de Cebola",
  "en": "Onion Crate",
  "icone": "textures/items/cl/blocos/caixote_cebola"
 },
 "cl:caixote_cenoura": {
  "pt": "Caixote de Cenoura",
  "en": "Carrot Crate",
  "icone": "textures/items/cl/blocos/caixote_cenoura"
 },
 "cl:caixote_maca": {
  "pt": "Caixote de Maçã",
  "en": "Apple Crate",
  "icone": "textures/items/cl/blocos/caixote_maca"
 },
 "cl:caixote_repolho": {
  "pt": "Caixote de Repolho",
  "en": "Cabbage Crate",
  "icone": "textures/items/cl/blocos/caixote_repolho"
 },
 "cl:caixote_tomate": {
  "pt": "Caixote de Tomate",
  "en": "Tomato Crate",
  "icone": "textures/items/cl/blocos/caixote_tomate"
 },
 "cl:cajado": {
  "pt": "Cajado",
  "en": "Crook",
  "icone": "textures/items/cl/arte/cajado"
 },
 "cl:cajado_levitacao": {
  "pt": "Cajado de Levitação",
  "en": "Staff of Levity",
  "icone": "textures/items/cl/arte/cajado_levitacao"
 },
 "cl:cajado_osso": {
  "pt": "Cajado de Osso",
  "en": "Bone Crook",
  "icone": "textures/items/cl/arte/cajado_osso"
 },
 "cl:cajado_ouro": {
  "pt": "Cajado de Ouro",
  "en": "Golden Crook",
  "icone": "textures/items/cl/arte/cajado_ouro"
 },
 "cl:cajado_viagem": {
  "pt": "Cajado de Viagem",
  "en": "Staff of Travelling",
  "icone": "textures/items/cl/arte/cajado_viagem"
 },
 "cl:calcario": {
  "pt": "Calcário",
  "en": "Limestone",
  "icone": "textures/items/cl/blocos/calcario"
 },
 "cl:calcario_entalhado": {
  "pt": "Calcário Entalhado",
  "en": "Carved Limestone",
  "icone": "textures/items/cl/blocos/calcario_entalhado"
 },
 "cl:calcario_ladrilho": {
  "pt": "Calcário Ladrilho",
  "en": "Tiles Limestone",
  "icone": "textures/items/cl/blocos/calcario_ladrilho"
 },
 "cl:calcario_liso": {
  "pt": "Calcário Liso",
  "en": "Smooth Limestone",
  "icone": "textures/items/cl/blocos/calcario_liso"
 },
 "cl:calcario_mosaico": {
  "pt": "Calcário Mosaico",
  "en": "Mosaic Limestone",
  "icone": "textures/items/cl/blocos/calcario_mosaico"
 },
 "cl:calcario_pilar": {
  "pt": "Calcário Pilar",
  "en": "Pillar Limestone",
  "icone": "textures/items/cl/blocos/calcario_pilar"
 },
 "cl:calcario_polido": {
  "pt": "Calcário Polido",
  "en": "Polished Limestone",
  "icone": "textures/items/cl/blocos/calcario_polido"
 },
 "cl:calcario_tijolos": {
  "pt": "Calcário Tijolos",
  "en": "Bricks Limestone",
  "icone": "textures/items/cl/blocos/calcario_tijolos"
 },
 "cl:calcario_tijolos_pequenos": {
  "pt": "Calcário Tijolinhos",
  "en": "Small Bricks Limestone",
  "icone": "textures/items/cl/blocos/calcario_tijolos_pequenos"
 },
 "cl:calcas_placa_aco": {
  "pt": "Calças de Placa de Aço",
  "en": "Steel Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_aco"
 },
 "cl:calcas_placa_aco_slime": {
  "pt": "Calças de Placa de Aço de Slime",
  "en": "Slimesteel Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_aco_slime"
 },
 "cl:calcas_placa_aluminio": {
  "pt": "Calças de Placa de Alumínio",
  "en": "Aluminum Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_aluminio"
 },
 "cl:calcas_placa_bronze": {
  "pt": "Calças de Placa de Bronze",
  "en": "Bronze Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_bronze"
 },
 "cl:calcas_placa_bronze_ametista": {
  "pt": "Calças de Placa de Bronze de Ametista",
  "en": "Amethyst Bronze Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_bronze_ametista"
 },
 "cl:calcas_placa_cobalto": {
  "pt": "Calças de Placa de Cobalto",
  "en": "Cobalt Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_cobalto"
 },
 "cl:calcas_placa_cobre": {
  "pt": "Calças de Placa de Cobre",
  "en": "Copper Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_cobre"
 },
 "cl:calcas_placa_ferro": {
  "pt": "Calças de Placa de Ferro",
  "en": "Iron Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_ferro"
 },
 "cl:calcas_placa_ferro_porco": {
  "pt": "Calças de Placa de Ferro-Porco",
  "en": "Pig Iron Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_ferro_porco"
 },
 "cl:calcas_placa_hepatizon": {
  "pt": "Calças de Placa de Hepatizão",
  "en": "Hepatizon Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_hepatizon"
 },
 "cl:calcas_placa_manyullyn": {
  "pt": "Calças de Placa de Manyullyn",
  "en": "Manyullyn Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_manyullyn"
 },
 "cl:calcas_placa_obsidiana": {
  "pt": "Calças de Placa de Obsidiana",
  "en": "Obsidian Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_obsidiana"
 },
 "cl:calcas_placa_osmio": {
  "pt": "Calças de Placa de Ósmio",
  "en": "Osmium Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_osmio"
 },
 "cl:calcas_placa_ouro": {
  "pt": "Calças de Placa de Ouro",
  "en": "Gold Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_ouro"
 },
 "cl:calcas_placa_ouro_rosa": {
  "pt": "Calças de Placa de Ouro Rosa",
  "en": "Rose Gold Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_ouro_rosa"
 },
 "cl:calcas_placa_pedra_chamuscada": {
  "pt": "Calças de Placa de Pedra Chamuscada",
  "en": "Scorched Stone Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_pedra_chamuscada"
 },
 "cl:calcas_placa_pedra_refrataria": {
  "pt": "Calças de Placa de Pedra Carbonizada",
  "en": "Seared Stone Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_pedra_refrataria"
 },
 "cl:calcas_placa_slime_brasa": {
  "pt": "Calças de Placa de Slime de Brasa",
  "en": "Cinderslime Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_slime_brasa"
 },
 "cl:calcas_placa_slime_cavaleiro": {
  "pt": "Calças de Placa de Slime-Cavaleiro",
  "en": "Knightslime Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_slime_cavaleiro"
 },
 "cl:calcas_placa_slime_rainha": {
  "pt": "Calças de Placa de Slime da Rainha",
  "en": "Queen's Slime Plate Leggings",
  "icone": "textures/items/cl/arte/calcas_placa_slime_rainha"
 },
 "cl:calcas_slime": {
  "pt": "Calças de Slime",
  "en": "Slimesuit Leggings",
  "icone": "textures/items/cl/arte/calcas_slime"
 },
 "cl:calcas_viajante": {
  "pt": "Calças de Viajante",
  "en": "Traveler's Pants",
  "icone": "textures/items/cl/arte/calcas_viajante"
 },
 "cl:caldeira": {
  "pt": "Caldeira",
  "en": "Boiler",
  "icone": "textures/items/cl/arte/caldeira"
 },
 "cl:caldo": {
  "pt": "Caldo",
  "en": "Stock",
  "icone": "textures/items/cl/arte/caldo"
 },
 "cl:caldo_osso": {
  "pt": "Caldo de Osso",
  "en": "Bone Broth",
  "icone": "textures/items/cl/arte/caldo_osso"
 },
 "cl:calha_chamuscada": {
  "pt": "Calha Chamuscada",
  "en": "Scorched Chute",
  "icone": "textures/blocks/cl/arte/calha_chamuscada"
 },
 "cl:calha_refrataria": {
  "pt": "Calha Refratária",
  "en": "Seared Chute",
  "icone": "textures/blocks/cl/arte/calha_refrataria"
 },
 "cl:camara_enriquecimento": {
  "pt": "Câmara de Enriquecimento",
  "en": "Enrichment Chamber",
  "icone": "textures/blocks/cl/arte/camara_enriquecimento_topo"
 },
 "cl:camara_injecao": {
  "pt": "Câmara de Injeção Química",
  "en": "Chemical Injection Chamber",
  "icone": "textures/items/cl/blocos/camara_injecao"
 },
 "cl:camara_purificacao": {
  "pt": "Câmara de Purificação",
  "en": "Purification Chamber",
  "icone": "textures/items/cl/blocos/camara_purificacao"
 },
 "cl:camel_pack": {
  "pt": "Camel Pack",
  "en": "Camel Pack",
  "icone": "textures/items/cl/arte/camel_pack"
 },
 "cl:canal": {
  "pt": "Canal Refratário",
  "en": "Seared Channel",
  "icone": "textures/blocks/cl/arte/canal"
 },
 "cl:cano_oxigenio": {
  "pt": "Cano de Oxigênio",
  "en": "Oxygen Pipe",
  "icone": "textures/items/cl/c/cano_oxigenio"
 },
 "cl:capacete_placa_aco": {
  "pt": "Capacete de Placa de Aço",
  "en": "Steel Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_aco"
 },
 "cl:capacete_placa_aco_slime": {
  "pt": "Capacete de Placa de Aço de Slime",
  "en": "Slimesteel Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_aco_slime"
 },
 "cl:capacete_placa_aluminio": {
  "pt": "Capacete de Placa de Alumínio",
  "en": "Aluminum Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_aluminio"
 },
 "cl:capacete_placa_bronze": {
  "pt": "Capacete de Placa de Bronze",
  "en": "Bronze Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_bronze"
 },
 "cl:capacete_placa_bronze_ametista": {
  "pt": "Capacete de Placa de Bronze de Ametista",
  "en": "Amethyst Bronze Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_bronze_ametista"
 },
 "cl:capacete_placa_cobalto": {
  "pt": "Capacete de Placa de Cobalto",
  "en": "Cobalt Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_cobalto"
 },
 "cl:capacete_placa_cobre": {
  "pt": "Capacete de Placa de Cobre",
  "en": "Copper Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_cobre"
 },
 "cl:capacete_placa_ferro": {
  "pt": "Capacete de Placa de Ferro",
  "en": "Iron Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_ferro"
 },
 "cl:capacete_placa_ferro_porco": {
  "pt": "Capacete de Placa de Ferro-Porco",
  "en": "Pig Iron Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_ferro_porco"
 },
 "cl:capacete_placa_hepatizon": {
  "pt": "Capacete de Placa de Hepatizão",
  "en": "Hepatizon Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_hepatizon"
 },
 "cl:capacete_placa_manyullyn": {
  "pt": "Capacete de Placa de Manyullyn",
  "en": "Manyullyn Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_manyullyn"
 },
 "cl:capacete_placa_obsidiana": {
  "pt": "Capacete de Placa de Obsidiana",
  "en": "Obsidian Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_obsidiana"
 },
 "cl:capacete_placa_osmio": {
  "pt": "Capacete de Placa de Ósmio",
  "en": "Osmium Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_osmio"
 },
 "cl:capacete_placa_ouro": {
  "pt": "Capacete de Placa de Ouro",
  "en": "Gold Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_ouro"
 },
 "cl:capacete_placa_ouro_rosa": {
  "pt": "Capacete de Placa de Ouro Rosa",
  "en": "Rose Gold Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_ouro_rosa"
 },
 "cl:capacete_placa_pedra_chamuscada": {
  "pt": "Capacete de Placa de Pedra Chamuscada",
  "en": "Scorched Stone Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_pedra_chamuscada"
 },
 "cl:capacete_placa_pedra_refrataria": {
  "pt": "Capacete de Placa de Pedra Carbonizada",
  "en": "Seared Stone Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_pedra_refrataria"
 },
 "cl:capacete_placa_slime_brasa": {
  "pt": "Capacete de Placa de Slime de Brasa",
  "en": "Cinderslime Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_slime_brasa"
 },
 "cl:capacete_placa_slime_cavaleiro": {
  "pt": "Capacete de Placa de Slime-Cavaleiro",
  "en": "Knightslime Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_slime_cavaleiro"
 },
 "cl:capacete_placa_slime_rainha": {
  "pt": "Capacete de Placa de Slime da Rainha",
  "en": "Queen's Slime Plate Helmet",
  "icone": "textures/items/cl/arte/capacete_placa_slime_rainha"
 },
 "cl:capacete_slime": {
  "pt": "Crânio de Slime",
  "en": "Slimeskull",
  "icone": "textures/items/cl/arte/capacete_slime"
 },
 "cl:capacete_viajante": {
  "pt": "Óculos de Viajante",
  "en": "Traveler's Goggles",
  "icone": "textures/items/cl/arte/capacete_viajante"
 },
 "cl:capacitor": {
  "pt": "Capacitor",
  "en": "Capacitor",
  "icone": "textures/items/cl/arte/capacitor"
 },
 "cl:capacitor_basico": {
  "pt": "Capacitor Básico",
  "en": "Basic Capacitor",
  "icone": "textures/items/cl/arte/capacitor_basico"
 },
 "cl:capacitor_duplo": {
  "pt": "Capacitor de Camada Dupla",
  "en": "Double-Layer Capacitor",
  "icone": "textures/items/cl/arte/capacitor_duplo"
 },
 "cl:capacitor_octadico": {
  "pt": "Capacitor Octádico",
  "en": "Octadic Capacitor",
  "icone": "textures/items/cl/arte/capacitor_octadico"
 },
 "cl:capacitor_pw_ardente": {
  "pt": "Capacitor Ardente",
  "en": "Blazing Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_ardente"
 },
 "cl:capacitor_pw_basico": {
  "pt": "Capacitor Básico (Powah)",
  "en": "Basic Capacitor (Powah)",
  "icone": "textures/items/cl/arte/capacitor_pw_basico"
 },
 "cl:capacitor_pw_endurecido": {
  "pt": "Capacitor Endurecido",
  "en": "Hardened Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_endurecido"
 },
 "cl:capacitor_pw_espiritual": {
  "pt": "Capacitor Espiritual",
  "en": "Spirited Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_espiritual"
 },
 "cl:capacitor_pw_grande": {
  "pt": "Capacitor Grande",
  "en": "Large Basic Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_grande"
 },
 "cl:capacitor_pw_minusculo": {
  "pt": "Capacitor Minúsculo",
  "en": "Tiny Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_minusculo"
 },
 "cl:capacitor_pw_niotico": {
  "pt": "Capacitor Niótico",
  "en": "Niotic Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_niotico"
 },
 "cl:capacitor_pw_nitro": {
  "pt": "Capacitor Nitro",
  "en": "Nitro Capacitor",
  "icone": "textures/items/cl/arte/capacitor_pw_nitro"
 },
 "cl:capim_slime_ceu": {
  "pt": "Capim de Slime-do-Céu",
  "en": "Skyslime Tall Grass",
  "icone": "textures/blocks/cl/arte/capim_slime_ceu"
 },
 "cl:capim_slime_ender": {
  "pt": "Capim de Slime-do-Ender",
  "en": "Enderslime Tall Grass",
  "icone": "textures/blocks/cl/arte/capim_slime_ender"
 },
 "cl:capim_slime_icor": {
  "pt": "Capim de Icor",
  "en": "Ichor Tall Grass",
  "icone": "textures/blocks/cl/arte/capim_slime_icor"
 },
 "cl:capim_slime_sangue": {
  "pt": "Capim de Sangue",
  "en": "Blood Tall Grass",
  "icone": "textures/blocks/cl/arte/capim_slime_sangue"
 },
 "cl:capim_slime_terra": {
  "pt": "Capim de Slime-da-Terra",
  "en": "Earthslime Tall Grass",
  "icone": "textures/blocks/cl/arte/capim_slime_terra"
 },
 "cl:carbono_enriquecido": {
  "pt": "Carbono Enriquecido",
  "en": "Enriched Carbon",
  "icone": "textures/items/cl/arte/carbono_enriquecido"
 },
 "cl:carcaca_reator": {
  "pt": "Carcaça do Reator",
  "en": "Reactor Casing",
  "icone": "textures/items/cl/blocos/carcaca_reator"
 },
 "cl:carne_moida": {
  "pt": "Carne Moída",
  "en": "Minced Beef",
  "icone": "textures/items/cl/arte/carne_moida"
 },
 "cl:carregador_ae": {
  "pt": "Carregador",
  "en": "Charger",
  "icone": "textures/blocks/cl/arte/carregador_ae_topo"
 },
 "cl:carregador_chunks": {
  "pt": "Carregador de Chunks",
  "en": "Chunk Loader",
  "icone": "textures/items/cl/blocos/carregador_chunks"
 },
 "cl:carregador_combustivel": {
  "pt": "Carregador de Combustível",
  "en": "Fuel Loader",
  "icone": "textures/items/cl/blocos/carregador_combustivel"
 },
 "cl:carregador_fio": {
  "pt": "Carregador com Fio",
  "en": "Wired Charger",
  "icone": "textures/items/cl/blocos/carregador_fio"
 },
 "cl:carregador_pontual": {
  "pt": "Carregador Pontual",
  "en": "Spot Loader",
  "icone": "textures/items/cl/blocos/carregador_pontual"
 },
 "cl:carregador_sem_fio": {
  "pt": "Carregador Sem Fio",
  "en": "Wireless Charger",
  "icone": "textures/items/cl/blocos/carregador_sem_fio"
 },
 "cl:carrinho": {
  "pt": "Carrinho",
  "en": "Dolly",
  "icone": "textures/items/cl/arte/carrinho"
 },
 "cl:carrinho_diamante": {
  "pt": "Carrinho de Diamante",
  "en": "Diamond Dolly",
  "icone": "textures/items/cl/arte/carrinho_diamante"
 },
 "cl:cartao_branco": {
  "pt": "Cartão Branco",
  "en": "Blank Card",
  "icone": "textures/items/cl/arte/cartao_branco"
 },
 "cl:cartao_vinculo": {
  "pt": "Cartão de Vínculo",
  "en": "Binding Card",
  "icone": "textures/items/cl/arte/cartao_vinculo"
 },
 "cl:cartao_vinculo_dimensional": {
  "pt": "Cartão de Vínculo Dimensional",
  "en": "Dimensional Binding Card",
  "icone": "textures/items/cl/arte/cartao_vinculo_dimensional"
 },
 "cl:cascalho_nether": {
  "pt": "Cascalho do Nether",
  "en": "Nether Gravel",
  "icone": "textures/items/cl/blocos/cascalho_nether"
 },
 "cl:casco_aeronave": {
  "pt": "Casco",
  "en": "Hull",
  "icone": "textures/items/cl/arte/casco_aeronave"
 },
 "cl:casco_nave_entalhado": {
  "pt": "Casco da Nave Entalhado",
  "en": "Carved Hull",
  "icone": "textures/items/cl/blocos/casco_nave_entalhado"
 },
 "cl:casco_nave_ladrilho": {
  "pt": "Casco da Nave Ladrilho",
  "en": "Tiles Hull",
  "icone": "textures/items/cl/blocos/casco_nave_ladrilho"
 },
 "cl:casco_nave_liso": {
  "pt": "Casco da Nave Liso",
  "en": "Smooth Hull",
  "icone": "textures/items/cl/blocos/casco_nave_liso"
 },
 "cl:casco_nave_mosaico": {
  "pt": "Casco da Nave Mosaico",
  "en": "Mosaic Hull",
  "icone": "textures/items/cl/blocos/casco_nave_mosaico"
 },
 "cl:casco_nave_pilar": {
  "pt": "Casco da Nave Pilar",
  "en": "Pillar Hull",
  "icone": "textures/items/cl/blocos/casco_nave_pilar"
 },
 "cl:casco_nave_polido": {
  "pt": "Casco da Nave Polido",
  "en": "Polished Hull",
  "icone": "textures/items/cl/blocos/casco_nave_polido"
 },
 "cl:casco_nave_tijolos": {
  "pt": "Casco da Nave Tijolos",
  "en": "Bricks Hull",
  "icone": "textures/items/cl/blocos/casco_nave_tijolos"
 },
 "cl:casco_nave_tijolos_pequenos": {
  "pt": "Casco da Nave Tijolinhos",
  "en": "Small Bricks Hull",
  "icone": "textures/items/cl/blocos/casco_nave_tijolos_pequenos"
 },
 "cl:catalogo": {
  "pt": "Catálogo",
  "en": "Catalog",
  "icone": "textures/items/cl/arte/catalogo"
 },
 "cl:cebola": {
  "pt": "Cebola",
  "en": "Onion",
  "icone": "textures/items/cl/arte/cebola"
 },
 "cl:celula_agua": {
  "pt": "Célula de Água",
  "en": "Water Storage Cell",
  "icone": "textures/items/cl/arte/celula_agua"
 },
 "cl:celula_combustivel": {
  "pt": "Célula de Combustível",
  "en": "Fuel Cell",
  "icone": "textures/items/cl/arte/celula_combustivel"
 },
 "cl:celula_ender_ardente": {
  "pt": "Célula Ender Ardente",
  "en": "Blazing Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_ardente"
 },
 "cl:celula_ender_basico": {
  "pt": "Célula Ender Básico",
  "en": "Basic Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_basico"
 },
 "cl:celula_ender_endurecido": {
  "pt": "Célula Ender Endurecido",
  "en": "Hardened Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_endurecido"
 },
 "cl:celula_ender_espiritual": {
  "pt": "Célula Ender Espiritual",
  "en": "Spirited Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_espiritual"
 },
 "cl:celula_ender_inicial": {
  "pt": "Célula Ender Inicial",
  "en": "Starter Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_inicial"
 },
 "cl:celula_ender_niotico": {
  "pt": "Célula Ender Niótico",
  "en": "Niotic Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_niotico"
 },
 "cl:celula_ender_nitro": {
  "pt": "Célula Ender Nitro",
  "en": "Nitro Ender Cell",
  "icone": "textures/items/cl/blocos/celula_ender_nitro"
 },
 "cl:celula_energia_ae": {
  "pt": "Célula de Energia",
  "en": "Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_ae_topo"
 },
 "cl:celula_energia_ae_densa": {
  "pt": "Célula Densa de Energia",
  "en": "Dense Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_ae_densa_topo"
 },
 "cl:celula_energia_basica": {
  "pt": "Célula de Energia Básica",
  "en": "Leadstone Energy Cell",
  "icone": "textures/items/cl/arte/blocos/celula_energia_basica"
 },
 "cl:celula_energia_redstone": {
  "pt": "Célula de Energia Redstone",
  "en": "Redstone Energy Cell",
  "icone": "textures/items/cl/arte/blocos/celula_energia_redstone"
 },
 "cl:celula_energia_reforcada": {
  "pt": "Célula de Energia Reforçada",
  "en": "Hardened Energy Cell",
  "icone": "textures/items/cl/arte/blocos/celula_energia_reforcada"
 },
 "cl:celula_energia_ressonante": {
  "pt": "Célula de Energia Ressonante",
  "en": "Resonant Energy Cell",
  "icone": "textures/items/cl/arte/blocos/celula_energia_ressonante"
 },
 "cl:celula_me_16k": {
  "pt": "Célula de Armazenamento de 16k para Itens",
  "en": "16k ME Item Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_16k"
 },
 "cl:celula_me_1k": {
  "pt": "Célula de Armazenamento de 1k para Itens",
  "en": "1k ME Item Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_1k"
 },
 "cl:celula_me_256k": {
  "pt": "Célula de Armazenamento de 256k para Itens",
  "en": "256k ME Item Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_256k"
 },
 "cl:celula_me_4k": {
  "pt": "Célula de Armazenamento de 4k para Itens",
  "en": "4k ME Item Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_4k"
 },
 "cl:celula_me_64k": {
  "pt": "Célula de 64k de Armazenamento para Itens",
  "en": "64k ME Item Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_64k"
 },
 "cl:celula_powah_ardente": {
  "pt": "Célula de Energia Ardente (Powah)",
  "en": "Blazing Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_ardente"
 },
 "cl:celula_powah_basico": {
  "pt": "Célula de Energia Básico (Powah)",
  "en": "Basic Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_basico"
 },
 "cl:celula_powah_endurecido": {
  "pt": "Célula de Energia Endurecido (Powah)",
  "en": "Hardened Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_endurecido"
 },
 "cl:celula_powah_espiritual": {
  "pt": "Célula de Energia Espiritual (Powah)",
  "en": "Spirited Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_espiritual"
 },
 "cl:celula_powah_inicial": {
  "pt": "Célula de Energia Inicial (Powah)",
  "en": "Starter Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_inicial"
 },
 "cl:celula_powah_niotico": {
  "pt": "Célula de Energia Niótico (Powah)",
  "en": "Niotic Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_niotico"
 },
 "cl:celula_powah_nitro": {
  "pt": "Célula de Energia Nitro (Powah)",
  "en": "Nitro Energy Cell (Powah)",
  "icone": "textures/items/cl/blocos/celula_powah_nitro"
 },
 "cl:chapa_cobre": {
  "pt": "Chapa de Cobre",
  "en": "Copper Sheet",
  "icone": "textures/items/cl/c/chapa_cobre"
 },
 "cl:chapa_ferro": {
  "pt": "Chapa de Ferro",
  "en": "Iron Sheet",
  "icone": "textures/items/cl/c/chapa_ferro"
 },
 "cl:chapa_latao": {
  "pt": "Chapa de Latão",
  "en": "Brass Sheet",
  "icone": "textures/items/cl/c/chapa_latao"
 },
 "cl:chapa_ouro": {
  "pt": "Chapa de Ouro",
  "en": "Golden Sheet",
  "icone": "textures/items/cl/c/chapa_ouro"
 },
 "cl:charque": {
  "pt": "Charque",
  "en": "Beef Jerky",
  "icone": "textures/items/cl/arte/charque"
 },
 "cl:chassi_almas": {
  "pt": "Chassis de Almas",
  "en": "Ensouled Chassis",
  "icone": "textures/items/cl/blocos/chassi_almas"
 },
 "cl:chassi_maquina": {
  "pt": "Chassis do Vazio",
  "en": "Void Chassis",
  "icone": "textures/items/cl/blocos/chassi_maquina"
 },
 "cl:chave_barril": {
  "pt": "Chave de Barril",
  "en": "Barrel Hammer",
  "icone": "textures/items/cl/arte/chave_barril"
 },
 "cl:chave_masmorra": {
  "pt": "Chave da Masmorra Tier 1",
  "en": "Tier 1 Dungeon Key",
  "icone": "textures/items/cl/c/chave_masmorra"
 },
 "cl:chave_powah": {
  "pt": "Chave (Powah)",
  "en": "Wrench (Powah)",
  "icone": "textures/items/cl/arte/chave_powah"
 },
 "cl:chave_yeta": {
  "pt": "Chave Yeta",
  "en": "Yeta Wrench",
  "icone": "textures/items/cl/arte/chave_yeta"
 },
 "cl:chibanca_aco": {
  "pt": "Chibanca de Aço",
  "en": "Steel Mattock",
  "icone": "textures/items/cl/arte/chibanca_aco"
 },
 "cl:chibanca_aco_slime": {
  "pt": "Chibanca de Aço de Slime",
  "en": "Slimesteel Mattock",
  "icone": "textures/items/cl/arte/chibanca_aco_slime"
 },
 "cl:chibanca_bronze": {
  "pt": "Chibanca de Bronze",
  "en": "Bronze Mattock",
  "icone": "textures/items/cl/arte/chibanca_bronze"
 },
 "cl:chibanca_bronze_ametista": {
  "pt": "Chibanca de Bronze de Ametista",
  "en": "Amethyst Bronze Mattock",
  "icone": "textures/items/cl/arte/chibanca_bronze_ametista"
 },
 "cl:chibanca_cobalto": {
  "pt": "Chibanca de Cobalto",
  "en": "Cobalt Mattock",
  "icone": "textures/items/cl/arte/chibanca_cobalto"
 },
 "cl:chibanca_cobre": {
  "pt": "Chibanca de Cobre",
  "en": "Copper Mattock",
  "icone": "textures/items/cl/arte/chibanca_cobre"
 },
 "cl:chibanca_coro": {
  "pt": "Chibanca de Chorus",
  "en": "Chorus Mattock",
  "icone": "textures/items/cl/arte/chibanca_coro"
 },
 "cl:chibanca_ferro": {
  "pt": "Chibanca de Ferro",
  "en": "Iron Mattock",
  "icone": "textures/items/cl/arte/chibanca_ferro"
 },
 "cl:chibanca_ferro_porco": {
  "pt": "Chibanca de Ferro-Porco",
  "en": "Pig Iron Mattock",
  "icone": "textures/items/cl/arte/chibanca_ferro_porco"
 },
 "cl:chibanca_hepatizon": {
  "pt": "Chibanca de Hepatizão",
  "en": "Hepatizon Mattock",
  "icone": "textures/items/cl/arte/chibanca_hepatizon"
 },
 "cl:chibanca_madeira": {
  "pt": "Chibanca de Madeira",
  "en": "Wood Mattock",
  "icone": "textures/items/cl/arte/chibanca_madeira"
 },
 "cl:chibanca_madeira_slime": {
  "pt": "Chibanca de Madeira de Slime",
  "en": "Slimewood Mattock",
  "icone": "textures/items/cl/arte/chibanca_madeira_slime"
 },
 "cl:chibanca_madeira_slime_revestida": {
  "pt": "Chibanca de Madeira de Slime Revestida",
  "en": "Plated Slimewood Mattock",
  "icone": "textures/items/cl/arte/chibanca_madeira_slime_revestida"
 },
 "cl:chibanca_madeira_tratada": {
  "pt": "Chibanca de Madeira Tratada",
  "en": "Treated Wood Mattock",
  "icone": "textures/items/cl/arte/chibanca_madeira_tratada"
 },
 "cl:chibanca_manyullyn": {
  "pt": "Chibanca de Manyullyn",
  "en": "Manyullyn Mattock",
  "icone": "textures/items/cl/arte/chibanca_manyullyn"
 },
 "cl:chibanca_nahuatl": {
  "pt": "Chibanca de Nahuatl",
  "en": "Nahuatl Mattock",
  "icone": "textures/items/cl/arte/chibanca_nahuatl"
 },
 "cl:chibanca_osmio": {
  "pt": "Chibanca de Ósmio",
  "en": "Osmium Mattock",
  "icone": "textures/items/cl/arte/chibanca_osmio"
 },
 "cl:chibanca_osso": {
  "pt": "Chibanca de Osso",
  "en": "Bone Mattock",
  "icone": "textures/items/cl/arte/chibanca_osso"
 },
 "cl:chibanca_osso_blaze": {
  "pt": "Chibanca de Osso de Blaze",
  "en": "Blazing Bone Mattock",
  "icone": "textures/items/cl/arte/chibanca_osso_blaze"
 },
 "cl:chibanca_osso_necrotico": {
  "pt": "Chibanca de Osso Necrótico",
  "en": "Necrotic Bone Mattock",
  "icone": "textures/items/cl/arte/chibanca_osso_necrotico"
 },
 "cl:chibanca_osso_venenoso": {
  "pt": "Chibanca de Osso Venenoso",
  "en": "Venombone Mattock",
  "icone": "textures/items/cl/arte/chibanca_osso_venenoso"
 },
 "cl:chibanca_ouro_rosa": {
  "pt": "Chibanca de Ouro Rosa",
  "en": "Rose Gold Mattock",
  "icone": "textures/items/cl/arte/chibanca_ouro_rosa"
 },
 "cl:chibanca_pedra": {
  "pt": "Chibanca de Pedra",
  "en": "Stone Mattock",
  "icone": "textures/items/cl/arte/chibanca_pedra"
 },
 "cl:chibanca_pedra_branca": {
  "pt": "Chibanca de Pedra Branca",
  "en": "Whitestone Mattock",
  "icone": "textures/items/cl/arte/chibanca_pedra_branca"
 },
 "cl:chibanca_pedra_chamuscada": {
  "pt": "Chibanca de Pedra Chamuscada",
  "en": "Scorched Stone Mattock",
  "icone": "textures/items/cl/arte/chibanca_pedra_chamuscada"
 },
 "cl:chibanca_pedra_refrataria": {
  "pt": "Chibanca de Pedra Carbonizada",
  "en": "Seared Stone Mattock",
  "icone": "textures/items/cl/arte/chibanca_pedra_refrataria"
 },
 "cl:chibanca_silex": {
  "pt": "Chibanca de Sílex",
  "en": "Flint Mattock",
  "icone": "textures/items/cl/arte/chibanca_silex"
 },
 "cl:chibanca_slime_brasa": {
  "pt": "Chibanca de Slime de Brasa",
  "en": "Cinderslime Mattock",
  "icone": "textures/items/cl/arte/chibanca_slime_brasa"
 },
 "cl:chibanca_slime_cavaleiro": {
  "pt": "Chibanca de Slime-Cavaleiro",
  "en": "Knightslime Mattock",
  "icone": "textures/items/cl/arte/chibanca_slime_cavaleiro"
 },
 "cl:chibanca_slime_rainha": {
  "pt": "Chibanca de Slime da Rainha",
  "en": "Queen's Slime Mattock",
  "icone": "textures/items/cl/arte/chibanca_slime_rainha"
 },
 "cl:chili_poppers": {
  "pt": "Pimentas Empanadas",
  "en": "Chili Poppers",
  "icone": "textures/items/cl/arte/chili_poppers"
 },
 "cl:cilindro_acido": {
  "pt": "Cilindro de Ácido Clorídrico",
  "en": "Hydrogen Chloride Tank",
  "icone": "textures/items/cl/arte/cilindro_acido"
 },
 "cl:cilindro_cloro": {
  "pt": "Cilindro de Cloro",
  "en": "Chlorine Tank",
  "icone": "textures/items/cl/arte/cilindro_cloro"
 },
 "cl:cilindro_hidrogenio": {
  "pt": "Cilindro de Hidrogênio",
  "en": "Hydrogen Tank",
  "icone": "textures/items/cl/arte/cilindro_hidrogenio"
 },
 "cl:cilindro_oxigenio": {
  "pt": "Cilindro de Oxigênio",
  "en": "Oxygen Tank",
  "icone": "textures/items/cl/arte/cilindro_oxigenio"
 },
 "cl:cilindro_vazio": {
  "pt": "Cilindro de Gás Vazio",
  "en": "Empty Gas Tank",
  "icone": "textures/items/cl/arte/cilindro_vazio"
 },
 "cl:cinzel": {
  "pt": "Cinzel",
  "en": "Chisel",
  "icone": "textures/items/cl/arte/cinzel"
 },
 "cl:circuito": {
  "pt": "Circuito",
  "en": "Circuit",
  "icone": "textures/items/cl/arte/circuito"
 },
 "cl:circuito_calculo_impresso": {
  "pt": "Circuito Impresso de Cálculo",
  "en": "Printed Calculation Circuit",
  "icone": "textures/items/cl/arte/circuito_calculo_impresso"
 },
 "cl:circuito_controle_avancado": {
  "pt": "Circuito de Controle Avançado",
  "en": "Advanced Control Circuit",
  "icone": "textures/items/cl/arte/circuito_controle_avancado"
 },
 "cl:circuito_controle_basico": {
  "pt": "Circuito de Controle Básico",
  "en": "Basic Control Circuit",
  "icone": "textures/items/cl/arte/circuito_controle_basico"
 },
 "cl:circuito_controle_elite": {
  "pt": "Circuito de Controle Elite",
  "en": "Elite Control Circuit",
  "icone": "textures/items/cl/arte/circuito_controle_elite"
 },
 "cl:circuito_controle_supremo": {
  "pt": "Circuito de Controle Ultimate",
  "en": "Ultimate Control Circuit",
  "icone": "textures/items/cl/arte/circuito_controle_supremo"
 },
 "cl:circuito_engenharia_impresso": {
  "pt": "Circuito Impresso de Engenharia",
  "en": "Printed Engineering Circuit",
  "icone": "textures/items/cl/arte/circuito_engenharia_impresso"
 },
 "cl:circuito_logico_impresso": {
  "pt": "Circuito Impresso Lógico",
  "en": "Printed Logic Circuit",
  "icone": "textures/items/cl/arte/circuito_logico_impresso"
 },
 "cl:coalhada_queijo": {
  "pt": "Coalhada de Queijo",
  "en": "Cheese Curd",
  "icone": "textures/items/cl/c/coalhada_queijo"
 },
 "cl:cobalto_bruto": {
  "pt": "Cobalto Bruto",
  "en": "Raw Cobalt",
  "icone": "textures/items/cl/arte/cobalto_bruto"
 },
 "cl:cobre_po": {
  "pt": "Pó de Minério de Cobre",
  "en": "Powdered Copper Ore",
  "icone": "textures/items/cl/arte/cobre_po"
 },
 "cl:cobre_quebrado": {
  "pt": "Pedaço Quebrado de Cobre",
  "en": "Broken Copper Ore",
  "icone": "textures/items/cl/arte/cobre_quebrado"
 },
 "cl:cobre_triturado": {
  "pt": "Pedaço Triturado de Cobre",
  "en": "Crushed Copper Ore",
  "icone": "textures/items/cl/arte/cobre_triturado"
 },
 "cl:coletor_oxigenio": {
  "pt": "Coletor de Oxigênio",
  "en": "Oxygen Collector",
  "icone": "textures/items/cl/blocos/coletor_oxigenio"
 },
 "cl:colheitadeira": {
  "pt": "Colheitadeira",
  "en": "Harvester",
  "icone": "textures/items/cl/arte/blocos/colheitadeira"
 },
 "cl:colocador_blocos": {
  "pt": "Colocador de Blocos",
  "en": "Block Placer",
  "icone": "textures/items/cl/arte/blocos/colocador_blocos"
 },
 "cl:combinador": {
  "pt": "Combinador",
  "en": "Combiner",
  "icone": "textures/blocks/cl/arte/combinador_topo"
 },
 "cl:componente_ferro": {
  "pt": "Componente de Ferro",
  "en": "Iron Mechanical Component",
  "icone": "textures/items/cl/c/componente_ferro"
 },
 "cl:componente_me_16k": {
  "pt": "Componente de Armazenamento de 16k",
  "en": "16k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_16k"
 },
 "cl:componente_me_1k": {
  "pt": "Componente de Armazenamento de 1k",
  "en": "1k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_1k"
 },
 "cl:componente_me_256k": {
  "pt": "Componente de Armazenamento de 256k",
  "en": "256k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_256k"
 },
 "cl:componente_me_4k": {
  "pt": "Componente de Armazenamento de 4k",
  "en": "4k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_4k"
 },
 "cl:componente_me_64k": {
  "pt": "Componente de Armazenamento de 64k",
  "en": "64k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_64k"
 },
 "cl:compostadora": {
  "pt": "Compostadora",
  "en": "Composter",
  "icone": "textures/items/cl/arte/blocos/compostadora"
 },
 "cl:composto_aglutinante": {
  "pt": "Composto Aglomerante de Condutor",
  "en": "Conduit Binder Composite",
  "icone": "textures/items/cl/arte/composto_aglutinante"
 },
 "cl:composto_fotovoltaico": {
  "pt": "Composto Fotovoltaico",
  "en": "Photovoltaic Composite",
  "icone": "textures/items/cl/arte/composto_fotovoltaico"
 },
 "cl:compostor": {
  "pt": "Compostor de Terra",
  "en": "Dirt Composter",
  "icone": "textures/items/cl/arte/blocos/compostor"
 },
 "cl:compressor": {
  "pt": "Compressor",
  "en": "Compressor",
  "icone": "textures/items/cl/blocos/compressor"
 },
 "cl:compressor_ar": {
  "pt": "Compressor de Ar",
  "en": "Air Compressor",
  "icone": "textures/items/cl/arte/blocos/compressor_ar"
 },
 "cl:compressor_eletrico": {
  "pt": "Compressor Elétrico",
  "en": "Electric Compressor",
  "icone": "textures/items/cl/blocos/compressor_eletrico"
 },
 "cl:compressor_osmio": {
  "pt": "Compressor de Ósmio",
  "en": "Osmium Compressor",
  "icone": "textures/blocks/cl/arte/compressor_osmio_topo"
 },
 "cl:compressor_oxigenio": {
  "pt": "Compressor de Oxigênio",
  "en": "Oxygen Compressor",
  "icone": "textures/items/cl/blocos/compressor_oxigenio"
 },
 "cl:computador": {
  "pt": "Computador",
  "en": "Computer",
  "icone": "textures/items/cl/arte/computador"
 },
 "cl:computador_bordo": {
  "pt": "Computador de Bordo",
  "en": "Flight Computer",
  "icone": "textures/items/cl/arte/computador_bordo"
 },
 "cl:concentrador_oxigenio": {
  "pt": "Concentrador de Oxigênio",
  "en": "Oxygen Concentrator",
  "icone": "textures/items/cl/c/concentrador_oxigenio"
 },
 "cl:condensador_agua": {
  "pt": "Condensador de Água",
  "en": "Water Condenser",
  "icone": "textures/items/cl/arte/blocos/condensador_agua"
 },
 "cl:condensador_avancado": {
  "pt": "Condensador Avançado",
  "en": "Advanced Condenser",
  "icone": "textures/items/cl/arte/blocos/condensador_avancado"
 },
 "cl:conduto_energia": {
  "pt": "Conduto de Energia",
  "en": "Energy Conduit",
  "icone": "textures/items/cl/blocos/conduto_energia"
 },
 "cl:conduto_energia_aprimorado": {
  "pt": "Condutor de Energia Aprimorado",
  "en": "Enhanced Energy Conduit",
  "icone": "textures/items/cl/blocos/conduto_energia_aprimorado"
 },
 "cl:conduto_energia_ender": {
  "pt": "Condutor de Energia do Ender",
  "en": "Ender Energy Conduit",
  "icone": "textures/items/cl/blocos/conduto_energia_ender"
 },
 "cl:conduto_item": {
  "pt": "Conduto de Itens",
  "en": "Item Conduit",
  "icone": "textures/items/cl/blocos/conduto_item"
 },
 "cl:construtor_corpos": {
  "pt": "Construtor de Corpos",
  "en": "Shell Constructor",
  "icone": "textures/items/cl/arte/blocos/construtor_corpos"
 },
 "cl:construtor_pecas": {
  "pt": "Construtor de Peças",
  "en": "Part Builder",
  "icone": "textures/items/cl/blocos/construtor_pecas"
 },
 "cl:contratante_esqueletico": {
  "pt": "Contratante Esquelético",
  "en": "Skeletal Contractor",
  "icone": "textures/items/cl/arte/contratante_esqueletico"
 },
 "cl:controlador_fundicao": {
  "pt": "Controlador da Fundição",
  "en": "Smeltery Controller",
  "icone": "textures/items/cl/blocos/controlador_fundicao"
 },
 "cl:controlador_fundicao_fantastica": {
  "pt": "Controlador da Fundição Fantástica",
  "en": "Foundry Controller",
  "icone": "textures/blocks/cl/arte/controlador_fundicao_fantastica_topo"
 },
 "cl:controlador_logico_z": {
  "pt": "Controlador Lógico Z",
  "en": "Z-Logic Controller",
  "icone": "textures/items/cl/arte/controlador_logico_z"
 },
 "cl:controlador_me": {
  "pt": "Controlador ME",
  "en": "ME Controller",
  "icone": "textures/items/cl/blocos/controlador_me"
 },
 "cl:controlador_reator": {
  "pt": "Controlador do Reator",
  "en": "Reactor Controller",
  "icone": "textures/items/cl/blocos/controlador_reator"
 },
 "cl:controlador_velocidade": {
  "pt": "Controlador de Velocidade",
  "en": "Rotation Speed Controller",
  "icone": "textures/items/cl/blocos/controlador_velocidade"
 },
 "cl:coque": {
  "pt": "Coque",
  "en": "Coal Coke",
  "icone": "textures/items/cl/c/coque"
 },
 "cl:coracao_farao": {
  "pt": "Coração do Faraó",
  "en": "Pharaoh's Heart",
  "icone": "textures/items/cl/arte/coracao_farao"
 },
 "cl:corda": {
  "pt": "Corda",
  "en": "Rope",
  "icone": "textures/items/cl/blocos/corda"
 },
 "cl:corrente_almas": {
  "pt": "Corrente de Almas",
  "en": "Soul Chain",
  "icone": "textures/items/cl/arte/corrente_almas"
 },
 "cl:costeleta_carneiro": {
  "pt": "Costeleta de Carneiro",
  "en": "Mutton Chops",
  "icone": "textures/items/cl/arte/costeleta_carneiro"
 },
 "cl:costeleta_carneiro_cozida": {
  "pt": "Costeleta de Carneiro Cozida",
  "en": "Cooked Mutton Chops",
  "icone": "textures/items/cl/arte/costeleta_carneiro_cozida"
 },
 "cl:costeletas_assadas": {
  "pt": "Costeletas Assadas",
  "en": "Roasted Mutton Chops",
  "icone": "textures/items/cl/arte/costeletas_assadas"
 },
 "cl:crisol_fermentacao": {
  "pt": "Crisol de Fermentação (VAT)",
  "en": "VAT",
  "icone": "textures/items/cl/blocos/crisol_fermentacao"
 },
 "cl:cristal_ardente": {
  "pt": "Cristal Ardente",
  "en": "Blazing Crystal",
  "icone": "textures/items/cl/arte/cristal_ardente"
 },
 "cl:cristal_certus": {
  "pt": "Cristal de Quartzo Certus",
  "en": "Certus Quartz Crystal",
  "icone": "textures/items/cl/arte/cristal_certus"
 },
 "cl:cristal_certus_carregado": {
  "pt": "Cristal Carregado de Quartzo Certus",
  "en": "Charged Certus Quartz Crystal",
  "icone": "textures/items/cl/arte/cristal_certus_carregado"
 },
 "cl:cristal_climatico": {
  "pt": "Cristal Climático",
  "en": "Weather Crystal",
  "icone": "textures/items/cl/arte/cristal_climatico"
 },
 "cl:cristal_ender": {
  "pt": "Cristal do Ender",
  "en": "Ender Crystal",
  "icone": "textures/items/cl/arte/cristal_ender"
 },
 "cl:cristal_espiritual": {
  "pt": "Cristal Espiritual",
  "en": "Spirited Crystal",
  "icone": "textures/items/cl/arte/cristal_espiritual"
 },
 "cl:cristal_fluix": {
  "pt": "Cristal de Fluix",
  "en": "Fluix Crystal",
  "icone": "textures/items/cl/arte/cristal_fluix"
 },
 "cl:cristal_niotico": {
  "pt": "Cristal Niótico",
  "en": "Niotic Crystal",
  "icone": "textures/items/cl/arte/cristal_niotico"
 },
 "cl:cristal_nitro": {
  "pt": "Cristal Nitro",
  "en": "Nitro Crystal",
  "icone": "textures/items/cl/arte/cristal_nitro"
 },
 "cl:cristal_presciencia": {
  "pt": "Cristal da Presciência",
  "en": "Prescient Crystal",
  "icone": "textures/items/cl/arte/cristal_presciencia"
 },
 "cl:cristal_pulsante": {
  "pt": "Cristal Pulsante",
  "en": "Pulsating Crystal",
  "icone": "textures/items/cl/arte/cristal_pulsante"
 },
 "cl:cristal_sedutor": {
  "pt": "Cristal Sedutor",
  "en": "Enticing Crystal",
  "icone": "textures/items/cl/arte/cristal_sedutor"
 },
 "cl:cristal_slime_brotando_ceu": {
  "pt": "Drusa de Cristal de Slime-do-Céu",
  "en": "Budding Skyslime Crystal",
  "icone": "textures/blocks/cl/arte/cristal_slime_brotando_ceu"
 },
 "cl:cristal_slime_brotando_ender": {
  "pt": "Drusa de Cristal de Slime-do-Ender",
  "en": "Budding Enderslime Crystal",
  "icone": "textures/blocks/cl/arte/cristal_slime_brotando_ender"
 },
 "cl:cristal_slime_brotando_icor": {
  "pt": "Drusa de Cristal de Icor",
  "en": "Budding Ichor Crystal",
  "icone": "textures/blocks/cl/arte/cristal_slime_brotando_icor"
 },
 "cl:cristal_slime_brotando_terra": {
  "pt": "Drusa de Cristal de Slime-da-Terra",
  "en": "Budding Earthslime Crystal",
  "icone": "textures/blocks/cl/arte/cristal_slime_brotando_terra"
 },
 "cl:cristal_slime_ceu": {
  "pt": "Cristal de Slime-do-Céu",
  "en": "Skyslime Crystal",
  "icone": "textures/items/cl/arte/cristal_slime_ceu"
 },
 "cl:cristal_slime_ender": {
  "pt": "Cristal de Slime-do-Ender",
  "en": "Enderslime Crystal",
  "icone": "textures/items/cl/arte/cristal_slime_ender"
 },
 "cl:cristal_slime_icor": {
  "pt": "Cristal de Icor",
  "en": "Ichor Crystal",
  "icone": "textures/items/cl/arte/cristal_slime_icor"
 },
 "cl:cristal_slime_terra": {
  "pt": "Cristal de Slime-da-Terra",
  "en": "Earthslime Crystal",
  "icone": "textures/items/cl/arte/cristal_slime_terra"
 },
 "cl:cristal_vibrante": {
  "pt": "Cristal Vibrante",
  "en": "Vibrant Crystal",
  "icone": "textures/items/cl/arte/cristal_vibrante"
 },
 "cl:cubo_energia_avancado": {
  "pt": "Cubo de Energia Avançado",
  "en": "Advanced Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_avancado"
 },
 "cl:cubo_energia_basico": {
  "pt": "Cubo de Energia Básico",
  "en": "Basic Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_basico"
 },
 "cl:cubo_energia_definitivo": {
  "pt": "Cubo de Energia Ultimate",
  "en": "Ultimate Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_definitivo"
 },
 "cl:cubo_energia_elite": {
  "pt": "Cubo de Energia Elite",
  "en": "Elite Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_elite"
 },
 "cl:dardo_cobalto": {
  "pt": "Dardo de Cobalto",
  "en": "Cobalt Javelin",
  "icone": "textures/items/cl/arte/dardo_cobalto"
 },
 "cl:dardo_ferro": {
  "pt": "Dardo de Ferro",
  "en": "Iron Javelin",
  "icone": "textures/items/cl/arte/dardo_ferro"
 },
 "cl:dardo_manyullyn": {
  "pt": "Dardo de Manyullyn",
  "en": "Manyullyn Javelin",
  "icone": "textures/items/cl/arte/dardo_manyullyn"
 },
 "cl:dardo_silex": {
  "pt": "Dardo de Sílex",
  "en": "Flint Javelin",
  "icone": "textures/items/cl/arte/dardo_silex"
 },
 "cl:descarregador_ardente": {
  "pt": "Descarregador Ardente",
  "en": "Blazing Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_ardente"
 },
 "cl:descarregador_basico": {
  "pt": "Descarregador Básico",
  "en": "Basic Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_basico"
 },
 "cl:descarregador_endurecido": {
  "pt": "Descarregador Endurecido",
  "en": "Hardened Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_endurecido"
 },
 "cl:descarregador_espiritual": {
  "pt": "Descarregador Espiritual",
  "en": "Spirited Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_espiritual"
 },
 "cl:descarregador_inicial": {
  "pt": "Descarregador Inicial",
  "en": "Starter Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_inicial"
 },
 "cl:descarregador_niotico": {
  "pt": "Descarregador Niótico",
  "en": "Niotic Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_niotico"
 },
 "cl:descarregador_nitro": {
  "pt": "Descarregador Nitro",
  "en": "Nitro Energy Discharger",
  "icone": "textures/items/cl/blocos/descarregador_nitro"
 },
 "cl:diamante_enriquecido": {
  "pt": "Diamante Enriquecido",
  "en": "Enriched Diamond",
  "icone": "textures/items/cl/arte/diamante_enriquecido"
 },
 "cl:diario_bordo": {
  "pt": "Diário de Bordo",
  "en": "Logbook",
  "icone": "textures/items/cl/arte/diario_bordo"
 },
 "cl:dinamo_cinetico": {
  "pt": "Dínamo Cinético",
  "en": "Kinetic Dynamo",
  "icone": "textures/items/cl/blocos/dinamo_cinetico"
 },
 "cl:dinamo_redstone": {
  "pt": "Dínamo de Redstone",
  "en": "Enervation Dynamo",
  "icone": "textures/items/cl/arte/blocos/dinamo_redstone"
 },
 "cl:diodo_guardiao": {
  "pt": "Diodo Guardião",
  "en": "Guardian Diode",
  "icone": "textures/items/cl/arte/diodo_guardiao"
 },
 "cl:dirigivel": {
  "pt": "Dirigível",
  "en": "Airship",
  "icone": "textures/items/cl/arte/dirigivel"
 },
 "cl:distribuidor_oxigenio": {
  "pt": "Distribuidor de Bolha de Oxigênio",
  "en": "Oxygen Bubble Distributor",
  "icone": "textures/items/cl/blocos/distribuidor_oxigenio"
 },
 "cl:dreno": {
  "pt": "Dreno",
  "en": "Drain",
  "icone": "textures/items/cl/blocos/dreno"
 },
 "cl:dreno_chamuscado": {
  "pt": "Dreno Chamuscado",
  "en": "Scorched Drain",
  "icone": "textures/blocks/cl/arte/dreno_chamuscado"
 },
 "cl:dreno_fundicao": {
  "pt": "Dreno",
  "en": "Smeltery Drain",
  "icone": "textures/items/cl/blocos/dreno_fundicao"
 },
 "cl:drive_me": {
  "pt": "Gabinete ME",
  "en": "ME Drive",
  "icone": "textures/items/cl/blocos/drive_me"
 },
 "cl:eio_botas_aco_negro": {
  "pt": "Botas de Aço Sombrio",
  "en": "Dark Steel Boots",
  "icone": "textures/items/cl/arte/eio_botas_aco_negro"
 },
 "cl:eio_calcas_aco_negro": {
  "pt": "Calças de Aço Sombrio",
  "en": "Dark Steel Leggings",
  "icone": "textures/items/cl/arte/eio_calcas_aco_negro"
 },
 "cl:eio_capacete_aco_negro": {
  "pt": "Capacete de Aço Sombrio",
  "en": "Dark Steel Helmet",
  "icone": "textures/items/cl/arte/eio_capacete_aco_negro"
 },
 "cl:eio_espada_aco_negro": {
  "pt": "O Ender",
  "en": "The Ender",
  "icone": "textures/items/cl/arte/eio_espada_aco_negro"
 },
 "cl:eio_machado_aco_negro": {
  "pt": "Machado de Aço Sombrio",
  "en": "Dark Steel Axe",
  "icone": "textures/items/cl/arte/eio_machado_aco_negro"
 },
 "cl:eio_peitoral_aco_negro": {
  "pt": "Peitoral de Aço Sombrio",
  "en": "Dark Steel Chestplate",
  "icone": "textures/items/cl/arte/eio_peitoral_aco_negro"
 },
 "cl:eio_picareta_aco_negro": {
  "pt": "Picareta de Aço Sombrio",
  "en": "Dark Steel Pickaxe",
  "icone": "textures/items/cl/arte/eio_picareta_aco_negro"
 },
 "cl:eixo": {
  "pt": "Eixo",
  "en": "Shaft",
  "icone": "textures/items/cl/blocos/eixo"
 },
 "cl:eletrodo_zumbi": {
  "pt": "Eletrodo Zumbi",
  "en": "Zombie Electrode",
  "icone": "textures/items/cl/arte/eletrodo_zumbi"
 },
 "cl:eletroima": {
  "pt": "Eletroímã",
  "en": "Electromagnet",
  "icone": "textures/items/cl/arte/eletroima"
 },
 "cl:elevador": {
  "pt": "Elevador",
  "en": "Elevator",
  "icone": "textures/items/cl/blocos/elevador"
 },
 "cl:empacotador": {
  "pt": "Empacotador Automático",
  "en": "AutoPackager",
  "icone": "textures/items/cl/arte/blocos/empacotador"
 },
 "cl:ender_senciente": {
  "pt": "Ender Senciente",
  "en": "Sentient Ender",
  "icone": "textures/items/cl/c/ender_senciente"
 },
 "cl:enderios": {
  "pt": "Enderios",
  "en": "Enderios",
  "icone": "textures/items/cl/arte/enderios"
 },
 "cl:engrenagem": {
  "pt": "Engrenagem",
  "en": "Cogwheel",
  "icone": "textures/items/cl/blocos/engrenagem"
 },
 "cl:engrenagem_aco_negro": {
  "pt": "Engrenagem de Bimetal Sombrio",
  "en": "Dark Bimetal Gear",
  "icone": "textures/items/cl/arte/engrenagem_aco_negro"
 },
 "cl:engrenagem_diamante": {
  "pt": "Engrenagem de Diamante",
  "en": "Diamond Gear",
  "icone": "textures/items/cl/arte/engrenagem_diamante"
 },
 "cl:engrenagem_energizada": {
  "pt": "Engrenagem de Bimetal Energizado",
  "en": "Energized Bimetal Gear",
  "icone": "textures/items/cl/arte/engrenagem_energizada"
 },
 "cl:engrenagem_ferro": {
  "pt": "Engrenagem de Ferro",
  "en": "Iron Gear",
  "icone": "textures/items/cl/arte/engrenagem_ferro"
 },
 "cl:engrenagem_grande": {
  "pt": "Engrenagem Grande",
  "en": "Large Cogwheel",
  "icone": "textures/items/cl/blocos/engrenagem_grande"
 },
 "cl:engrenagem_madeira": {
  "pt": "Engrenagem de Madeira",
  "en": "Wooden Gear",
  "icone": "textures/items/cl/arte/engrenagem_madeira"
 },
 "cl:engrenagem_ouro": {
  "pt": "Engrenagem de Ouro",
  "en": "Gold Gear",
  "icone": "textures/items/cl/arte/engrenagem_ouro"
 },
 "cl:engrenagem_pedra": {
  "pt": "Engrenagem de Pedra",
  "en": "Stone Gear",
  "icone": "textures/items/cl/arte/engrenagem_pedra"
 },
 "cl:engrenagem_vibrante": {
  "pt": "Engrenagem de Bimetal Vibrante",
  "en": "Vibrant Bimetal Gear",
  "icone": "textures/items/cl/arte/engrenagem_vibrante"
 },
 "cl:ensopado_bacalhau": {
  "pt": "Ensopado de Bacalhau Assado",
  "en": "Baked Cod Stew",
  "icone": "textures/items/cl/arte/ensopado_bacalhau"
 },
 "cl:ensopado_carne": {
  "pt": "Ensopado de Carne",
  "en": "Beef Stew",
  "icone": "textures/items/cl/arte/ensopado_carne"
 },
 "cl:ensopado_peixe": {
  "pt": "Ensopado de Peixe",
  "en": "Fish Stew",
  "icone": "textures/items/cl/arte/ensopado_peixe"
 },
 "cl:equipamento_oxigenio": {
  "pt": "Equipamento de Oxigênio",
  "en": "Oxygen Gear",
  "icone": "textures/items/cl/arte/equipamento_oxigenio"
 },
 "cl:escavadeira_aco": {
  "pt": "Escavadeira de Aço",
  "en": "Steel Excavator",
  "icone": "textures/items/cl/arte/escavadeira_aco"
 },
 "cl:escavadeira_aco_slime": {
  "pt": "Escavadeira de Aço de Slime",
  "en": "Slimesteel Excavator",
  "icone": "textures/items/cl/arte/escavadeira_aco_slime"
 },
 "cl:escavadeira_bronze": {
  "pt": "Escavadeira de Bronze",
  "en": "Bronze Excavator",
  "icone": "textures/items/cl/arte/escavadeira_bronze"
 },
 "cl:escavadeira_bronze_ametista": {
  "pt": "Escavadeira de Bronze de Ametista",
  "en": "Amethyst Bronze Excavator",
  "icone": "textures/items/cl/arte/escavadeira_bronze_ametista"
 },
 "cl:escavadeira_cacto": {
  "pt": "Escavadeira de Cacto",
  "en": "Cactus Excavator",
  "icone": "textures/items/cl/arte/escavadeira_cacto"
 },
 "cl:escavadeira_cobalto": {
  "pt": "Escavadeira de Cobalto",
  "en": "Cobalt Excavator",
  "icone": "textures/items/cl/arte/escavadeira_cobalto"
 },
 "cl:escavadeira_cobre": {
  "pt": "Escavadeira de Cobre",
  "en": "Copper Excavator",
  "icone": "textures/items/cl/arte/escavadeira_cobre"
 },
 "cl:escavadeira_coro": {
  "pt": "Escavadeira de Chorus",
  "en": "Chorus Excavator",
  "icone": "textures/items/cl/arte/escavadeira_coro"
 },
 "cl:escavadeira_ferro": {
  "pt": "Escavadeira de Ferro",
  "en": "Iron Excavator",
  "icone": "textures/items/cl/arte/escavadeira_ferro"
 },
 "cl:escavadeira_ferro_porco": {
  "pt": "Escavadeira de Ferro-Porco",
  "en": "Pig Iron Excavator",
  "icone": "textures/items/cl/arte/escavadeira_ferro_porco"
 },
 "cl:escavadeira_hepatizon": {
  "pt": "Escavadeira de Hepatizão",
  "en": "Hepatizon Excavator",
  "icone": "textures/items/cl/arte/escavadeira_hepatizon"
 },
 "cl:escavadeira_madeira": {
  "pt": "Escavadeira de Madeira",
  "en": "Wood Excavator",
  "icone": "textures/items/cl/arte/escavadeira_madeira"
 },
 "cl:escavadeira_madeira_slime": {
  "pt": "Escavadeira de Madeira de Slime",
  "en": "Slimewood Excavator",
  "icone": "textures/items/cl/arte/escavadeira_madeira_slime"
 },
 "cl:escavadeira_madeira_slime_revestida": {
  "pt": "Escavadeira de Madeira de Slime Revestida",
  "en": "Plated Slimewood Excavator",
  "icone": "textures/items/cl/arte/escavadeira_madeira_slime_revestida"
 },
 "cl:escavadeira_madeira_tratada": {
  "pt": "Escavadeira de Madeira Tratada",
  "en": "Treated Wood Excavator",
  "icone": "textures/items/cl/arte/escavadeira_madeira_tratada"
 },
 "cl:escavadeira_manyullyn": {
  "pt": "Escavadeira de Manyullyn",
  "en": "Manyullyn Excavator",
  "icone": "textures/items/cl/arte/escavadeira_manyullyn"
 },
 "cl:escavadeira_nahuatl": {
  "pt": "Escavadeira de Nahuatl",
  "en": "Nahuatl Excavator",
  "icone": "textures/items/cl/arte/escavadeira_nahuatl"
 },
 "cl:escavadeira_obsidiana": {
  "pt": "Escavadeira de Obsidiana",
  "en": "Obsidian Excavator",
  "icone": "textures/items/cl/arte/escavadeira_obsidiana"
 },
 "cl:escavadeira_osmio": {
  "pt": "Escavadeira de Ósmio",
  "en": "Osmium Excavator",
  "icone": "textures/items/cl/arte/escavadeira_osmio"
 },
 "cl:escavadeira_osso": {
  "pt": "Escavadeira de Osso",
  "en": "Bone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_osso"
 },
 "cl:escavadeira_osso_blaze": {
  "pt": "Escavadeira de Osso de Blaze",
  "en": "Blazing Bone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_osso_blaze"
 },
 "cl:escavadeira_osso_necrotico": {
  "pt": "Escavadeira de Osso Necrótico",
  "en": "Necrotic Bone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_osso_necrotico"
 },
 "cl:escavadeira_osso_venenoso": {
  "pt": "Escavadeira de Osso Venenoso",
  "en": "Venombone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_osso_venenoso"
 },
 "cl:escavadeira_ouro_rosa": {
  "pt": "Escavadeira de Ouro Rosa",
  "en": "Rose Gold Excavator",
  "icone": "textures/items/cl/arte/escavadeira_ouro_rosa"
 },
 "cl:escavadeira_pedra": {
  "pt": "Escavadeira de Pedra",
  "en": "Stone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_pedra"
 },
 "cl:escavadeira_pedra_branca": {
  "pt": "Escavadeira de Pedra Branca",
  "en": "Whitestone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_pedra_branca"
 },
 "cl:escavadeira_pedra_chamuscada": {
  "pt": "Escavadeira de Pedra Chamuscada",
  "en": "Scorched Stone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_pedra_chamuscada"
 },
 "cl:escavadeira_pedra_refrataria": {
  "pt": "Escavadeira de Pedra Carbonizada",
  "en": "Seared Stone Excavator",
  "icone": "textures/items/cl/arte/escavadeira_pedra_refrataria"
 },
 "cl:escavadeira_silex": {
  "pt": "Escavadeira de Sílex",
  "en": "Flint Excavator",
  "icone": "textures/items/cl/arte/escavadeira_silex"
 },
 "cl:escavadeira_slime_brasa": {
  "pt": "Escavadeira de Slime de Brasa",
  "en": "Cinderslime Excavator",
  "icone": "textures/items/cl/arte/escavadeira_slime_brasa"
 },
 "cl:escavadeira_slime_cavaleiro": {
  "pt": "Escavadeira de Slime-Cavaleiro",
  "en": "Knightslime Excavator",
  "icone": "textures/items/cl/arte/escavadeira_slime_cavaleiro"
 },
 "cl:escavadeira_slime_rainha": {
  "pt": "Escavadeira de Slime da Rainha",
  "en": "Queen's Slime Excavator",
  "icone": "textures/items/cl/arte/escavadeira_slime_rainha"
 },
 "cl:escoria": {
  "pt": "Escória",
  "en": "Slag",
  "icone": "textures/items/cl/c/escoria"
 },
 "cl:escudo_placa_aco": {
  "pt": "Escudo de Placa de Aço",
  "en": "Steel Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_aco"
 },
 "cl:escudo_placa_aco_slime": {
  "pt": "Escudo de Placa de Aço de Slime",
  "en": "Slimesteel Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_aco_slime"
 },
 "cl:escudo_placa_aluminio": {
  "pt": "Escudo de Placa de Alumínio",
  "en": "Aluminum Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_aluminio"
 },
 "cl:escudo_placa_bronze": {
  "pt": "Escudo de Placa de Bronze",
  "en": "Bronze Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_bronze"
 },
 "cl:escudo_placa_bronze_ametista": {
  "pt": "Escudo de Placa de Bronze de Ametista",
  "en": "Amethyst Bronze Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_bronze_ametista"
 },
 "cl:escudo_placa_cobalto": {
  "pt": "Escudo de Placa de Cobalto",
  "en": "Cobalt Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_cobalto"
 },
 "cl:escudo_placa_cobre": {
  "pt": "Escudo de Placa de Cobre",
  "en": "Copper Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_cobre"
 },
 "cl:escudo_placa_ferro": {
  "pt": "Escudo de Placa de Ferro",
  "en": "Iron Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_ferro"
 },
 "cl:escudo_placa_ferro_porco": {
  "pt": "Escudo de Placa de Ferro-Porco",
  "en": "Pig Iron Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_ferro_porco"
 },
 "cl:escudo_placa_hepatizon": {
  "pt": "Escudo de Placa de Hepatizão",
  "en": "Hepatizon Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_hepatizon"
 },
 "cl:escudo_placa_manyullyn": {
  "pt": "Escudo de Placa de Manyullyn",
  "en": "Manyullyn Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_manyullyn"
 },
 "cl:escudo_placa_obsidiana": {
  "pt": "Escudo de Placa de Obsidiana",
  "en": "Obsidian Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_obsidiana"
 },
 "cl:escudo_placa_osmio": {
  "pt": "Escudo de Placa de Ósmio",
  "en": "Osmium Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_osmio"
 },
 "cl:escudo_placa_ouro": {
  "pt": "Escudo de Placa de Ouro",
  "en": "Gold Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_ouro"
 },
 "cl:escudo_placa_ouro_rosa": {
  "pt": "Escudo de Placa de Ouro Rosa",
  "en": "Rose Gold Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_ouro_rosa"
 },
 "cl:escudo_placa_pedra_chamuscada": {
  "pt": "Escudo de Placa de Pedra Chamuscada",
  "en": "Scorched Stone Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_pedra_chamuscada"
 },
 "cl:escudo_placa_pedra_refrataria": {
  "pt": "Escudo de Placa de Pedra Carbonizada",
  "en": "Seared Stone Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_pedra_refrataria"
 },
 "cl:escudo_placa_slime_brasa": {
  "pt": "Escudo de Placa de Slime de Brasa",
  "en": "Cinderslime Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_slime_brasa"
 },
 "cl:escudo_placa_slime_cavaleiro": {
  "pt": "Escudo de Placa de Slime-Cavaleiro",
  "en": "Knightslime Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_slime_cavaleiro"
 },
 "cl:escudo_placa_slime_rainha": {
  "pt": "Escudo de Placa de Slime da Rainha",
  "en": "Queen's Slime Plate Shield",
  "icone": "textures/items/cl/arte/escudo_placa_slime_rainha"
 },
 "cl:escudo_viajante": {
  "pt": "Escudo de Viajante",
  "en": "Traveler's Shield",
  "icone": "textures/items/cl/arte/escudo_viajante"
 },
 "cl:esfera_aco_end": {
  "pt": "Esfera de Trituração de Aço do End",
  "en": "End Steel Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_aco_end"
 },
 "cl:esfera_aco_negro": {
  "pt": "Esfera de Trituração de Aço Sombrio",
  "en": "Dark Steel Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_aco_negro"
 },
 "cl:esfera_almario": {
  "pt": "Esfera de Trituração de Almário",
  "en": "Soularium Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_almario"
 },
 "cl:esfera_ferro_condutor": {
  "pt": "Esfera de Trituração de Liga Condutiva",
  "en": "Conductive Alloy Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_ferro_condutor"
 },
 "cl:esfera_ferro_pulsante": {
  "pt": "Esfera de Trituração de Liga Pulsante",
  "en": "Pulsating Alloy Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_ferro_pulsante"
 },
 "cl:esfera_liga_energetica": {
  "pt": "Esfera de Trituração de Liga Energética",
  "en": "Energetic Alloy Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_liga_energetica"
 },
 "cl:esfera_liga_redstone": {
  "pt": "Esfera de Trituração de Liga de Redstone",
  "en": "Redstone Alloy Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_liga_redstone"
 },
 "cl:esfera_liga_vibrante": {
  "pt": "Esfera de Trituração de Liga Vibrante",
  "en": "Vibrant Alloy Grinding Ball",
  "icone": "textures/items/cl/arte/esfera_liga_vibrante"
 },
 "cl:esgoto": {
  "pt": "Esgoto",
  "en": "Sewer",
  "icone": "textures/items/cl/arte/blocos/esgoto"
 },
 "cl:espada_larga_aco": {
  "pt": "Espada de Aço",
  "en": "Steel Sword",
  "icone": "textures/items/cl/arte/espada_larga_aco"
 },
 "cl:espada_larga_aco_slime": {
  "pt": "Espada de Aço de Slime",
  "en": "Slimesteel Sword",
  "icone": "textures/items/cl/arte/espada_larga_aco_slime"
 },
 "cl:espada_larga_bronze": {
  "pt": "Espada de Bronze",
  "en": "Bronze Sword",
  "icone": "textures/items/cl/arte/espada_larga_bronze"
 },
 "cl:espada_larga_bronze_ametista": {
  "pt": "Espada de Bronze de Ametista",
  "en": "Amethyst Bronze Sword",
  "icone": "textures/items/cl/arte/espada_larga_bronze_ametista"
 },
 "cl:espada_larga_cacto": {
  "pt": "Espada de Cacto",
  "en": "Cactus Sword",
  "icone": "textures/items/cl/arte/espada_larga_cacto"
 },
 "cl:espada_larga_cobalto": {
  "pt": "Espada de Cobalto",
  "en": "Cobalt Sword",
  "icone": "textures/items/cl/arte/espada_larga_cobalto"
 },
 "cl:espada_larga_cobre": {
  "pt": "Espada de Cobre",
  "en": "Copper Sword",
  "icone": "textures/items/cl/arte/espada_larga_cobre"
 },
 "cl:espada_larga_coro": {
  "pt": "Espada de Chorus",
  "en": "Chorus Sword",
  "icone": "textures/items/cl/arte/espada_larga_coro"
 },
 "cl:espada_larga_ferro": {
  "pt": "Espada de Ferro",
  "en": "Iron Sword",
  "icone": "textures/items/cl/arte/espada_larga_ferro"
 },
 "cl:espada_larga_ferro_porco": {
  "pt": "Espada de Ferro-Porco",
  "en": "Pig Iron Sword",
  "icone": "textures/items/cl/arte/espada_larga_ferro_porco"
 },
 "cl:espada_larga_hepatizon": {
  "pt": "Espada de Hepatizão",
  "en": "Hepatizon Sword",
  "icone": "textures/items/cl/arte/espada_larga_hepatizon"
 },
 "cl:espada_larga_madeira": {
  "pt": "Espada de Madeira",
  "en": "Wood Sword",
  "icone": "textures/items/cl/arte/espada_larga_madeira"
 },
 "cl:espada_larga_madeira_slime": {
  "pt": "Espada de Madeira de Slime",
  "en": "Slimewood Sword",
  "icone": "textures/items/cl/arte/espada_larga_madeira_slime"
 },
 "cl:espada_larga_madeira_slime_revestida": {
  "pt": "Espada de Madeira de Slime Revestida",
  "en": "Plated Slimewood Sword",
  "icone": "textures/items/cl/arte/espada_larga_madeira_slime_revestida"
 },
 "cl:espada_larga_madeira_tratada": {
  "pt": "Espada de Madeira Tratada",
  "en": "Treated Wood Sword",
  "icone": "textures/items/cl/arte/espada_larga_madeira_tratada"
 },
 "cl:espada_larga_manyullyn": {
  "pt": "Espada de Manyullyn",
  "en": "Manyullyn Sword",
  "icone": "textures/items/cl/arte/espada_larga_manyullyn"
 },
 "cl:espada_larga_nahuatl": {
  "pt": "Espada de Nahuatl",
  "en": "Nahuatl Sword",
  "icone": "textures/items/cl/arte/espada_larga_nahuatl"
 },
 "cl:espada_larga_obsidiana": {
  "pt": "Espada de Obsidiana",
  "en": "Obsidian Sword",
  "icone": "textures/items/cl/arte/espada_larga_obsidiana"
 },
 "cl:espada_larga_osmio": {
  "pt": "Espada de Ósmio",
  "en": "Osmium Sword",
  "icone": "textures/items/cl/arte/espada_larga_osmio"
 },
 "cl:espada_larga_osso": {
  "pt": "Espada de Osso",
  "en": "Bone Sword",
  "icone": "textures/items/cl/arte/espada_larga_osso"
 },
 "cl:espada_larga_osso_blaze": {
  "pt": "Espada de Osso de Blaze",
  "en": "Blazing Bone Sword",
  "icone": "textures/items/cl/arte/espada_larga_osso_blaze"
 },
 "cl:espada_larga_osso_necrotico": {
  "pt": "Espada de Osso Necrótico",
  "en": "Necrotic Bone Sword",
  "icone": "textures/items/cl/arte/espada_larga_osso_necrotico"
 },
 "cl:espada_larga_osso_venenoso": {
  "pt": "Espada de Osso Venenoso",
  "en": "Venombone Sword",
  "icone": "textures/items/cl/arte/espada_larga_osso_venenoso"
 },
 "cl:espada_larga_ouro_rosa": {
  "pt": "Espada de Ouro Rosa",
  "en": "Rose Gold Sword",
  "icone": "textures/items/cl/arte/espada_larga_ouro_rosa"
 },
 "cl:espada_larga_pedra": {
  "pt": "Espada de Pedra",
  "en": "Stone Sword",
  "icone": "textures/items/cl/arte/espada_larga_pedra"
 },
 "cl:espada_larga_pedra_branca": {
  "pt": "Espada de Pedra Branca",
  "en": "Whitestone Sword",
  "icone": "textures/items/cl/arte/espada_larga_pedra_branca"
 },
 "cl:espada_larga_pedra_chamuscada": {
  "pt": "Espada de Pedra Chamuscada",
  "en": "Scorched Stone Sword",
  "icone": "textures/items/cl/arte/espada_larga_pedra_chamuscada"
 },
 "cl:espada_larga_pedra_refrataria": {
  "pt": "Espada de Pedra Carbonizada",
  "en": "Seared Stone Sword",
  "icone": "textures/items/cl/arte/espada_larga_pedra_refrataria"
 },
 "cl:espada_larga_silex": {
  "pt": "Espada de Sílex",
  "en": "Flint Sword",
  "icone": "textures/items/cl/arte/espada_larga_silex"
 },
 "cl:espada_larga_slime_brasa": {
  "pt": "Espada de Slime de Brasa",
  "en": "Cinderslime Sword",
  "icone": "textures/items/cl/arte/espada_larga_slime_brasa"
 },
 "cl:espada_larga_slime_cavaleiro": {
  "pt": "Espada de Slime-Cavaleiro",
  "en": "Knightslime Sword",
  "icone": "textures/items/cl/arte/espada_larga_slime_cavaleiro"
 },
 "cl:espada_larga_slime_rainha": {
  "pt": "Espada de Slime da Rainha",
  "en": "Queen's Slime Sword",
  "icone": "textures/items/cl/arte/espada_larga_slime_rainha"
 },
 "cl:espadao_aco": {
  "pt": "Espadão de Aço",
  "en": "Steel Cleaver",
  "icone": "textures/items/cl/arte/espadao_aco"
 },
 "cl:espadao_aco_slime": {
  "pt": "Espadão de Aço de Slime",
  "en": "Slimesteel Cleaver",
  "icone": "textures/items/cl/arte/espadao_aco_slime"
 },
 "cl:espadao_bronze": {
  "pt": "Espadão de Bronze",
  "en": "Bronze Cleaver",
  "icone": "textures/items/cl/arte/espadao_bronze"
 },
 "cl:espadao_bronze_ametista": {
  "pt": "Espadão de Bronze de Ametista",
  "en": "Amethyst Bronze Cleaver",
  "icone": "textures/items/cl/arte/espadao_bronze_ametista"
 },
 "cl:espadao_cobalto": {
  "pt": "Espadão de Cobalto",
  "en": "Cobalt Cleaver",
  "icone": "textures/items/cl/arte/espadao_cobalto"
 },
 "cl:espadao_cobre": {
  "pt": "Espadão de Cobre",
  "en": "Copper Cleaver",
  "icone": "textures/items/cl/arte/espadao_cobre"
 },
 "cl:espadao_coro": {
  "pt": "Espadão de Chorus",
  "en": "Chorus Cleaver",
  "icone": "textures/items/cl/arte/espadao_coro"
 },
 "cl:espadao_ferro": {
  "pt": "Espadão de Ferro",
  "en": "Iron Cleaver",
  "icone": "textures/items/cl/arte/espadao_ferro"
 },
 "cl:espadao_ferro_porco": {
  "pt": "Espadão de Ferro-Porco",
  "en": "Pig Iron Cleaver",
  "icone": "textures/items/cl/arte/espadao_ferro_porco"
 },
 "cl:espadao_hepatizon": {
  "pt": "Espadão de Hepatizão",
  "en": "Hepatizon Cleaver",
  "icone": "textures/items/cl/arte/espadao_hepatizon"
 },
 "cl:espadao_madeira": {
  "pt": "Espadão de Madeira",
  "en": "Wood Cleaver",
  "icone": "textures/items/cl/arte/espadao_madeira"
 },
 "cl:espadao_madeira_slime": {
  "pt": "Espadão de Madeira de Slime",
  "en": "Slimewood Cleaver",
  "icone": "textures/items/cl/arte/espadao_madeira_slime"
 },
 "cl:espadao_madeira_slime_revestida": {
  "pt": "Espadão de Madeira de Slime Revestida",
  "en": "Plated Slimewood Cleaver",
  "icone": "textures/items/cl/arte/espadao_madeira_slime_revestida"
 },
 "cl:espadao_madeira_tratada": {
  "pt": "Espadão de Madeira Tratada",
  "en": "Treated Wood Cleaver",
  "icone": "textures/items/cl/arte/espadao_madeira_tratada"
 },
 "cl:espadao_manyullyn": {
  "pt": "Espadão de Manyullyn",
  "en": "Manyullyn Cleaver",
  "icone": "textures/items/cl/arte/espadao_manyullyn"
 },
 "cl:espadao_nahuatl": {
  "pt": "Espadão de Nahuatl",
  "en": "Nahuatl Cleaver",
  "icone": "textures/items/cl/arte/espadao_nahuatl"
 },
 "cl:espadao_osmio": {
  "pt": "Espadão de Ósmio",
  "en": "Osmium Cleaver",
  "icone": "textures/items/cl/arte/espadao_osmio"
 },
 "cl:espadao_osso": {
  "pt": "Espadão de Osso",
  "en": "Bone Cleaver",
  "icone": "textures/items/cl/arte/espadao_osso"
 },
 "cl:espadao_osso_blaze": {
  "pt": "Espadão de Osso de Blaze",
  "en": "Blazing Bone Cleaver",
  "icone": "textures/items/cl/arte/espadao_osso_blaze"
 },
 "cl:espadao_osso_necrotico": {
  "pt": "Espadão de Osso Necrótico",
  "en": "Necrotic Bone Cleaver",
  "icone": "textures/items/cl/arte/espadao_osso_necrotico"
 },
 "cl:espadao_osso_venenoso": {
  "pt": "Espadão de Osso Venenoso",
  "en": "Venombone Cleaver",
  "icone": "textures/items/cl/arte/espadao_osso_venenoso"
 },
 "cl:espadao_ouro_rosa": {
  "pt": "Espadão de Ouro Rosa",
  "en": "Rose Gold Cleaver",
  "icone": "textures/items/cl/arte/espadao_ouro_rosa"
 },
 "cl:espadao_pedra": {
  "pt": "Espadão de Pedra",
  "en": "Stone Cleaver",
  "icone": "textures/items/cl/arte/espadao_pedra"
 },
 "cl:espadao_pedra_branca": {
  "pt": "Espadão de Pedra Branca",
  "en": "Whitestone Cleaver",
  "icone": "textures/items/cl/arte/espadao_pedra_branca"
 },
 "cl:espadao_pedra_chamuscada": {
  "pt": "Espadão de Pedra Chamuscada",
  "en": "Scorched Stone Cleaver",
  "icone": "textures/items/cl/arte/espadao_pedra_chamuscada"
 },
 "cl:espadao_pedra_refrataria": {
  "pt": "Espadão de Pedra Carbonizada",
  "en": "Seared Stone Cleaver",
  "icone": "textures/items/cl/arte/espadao_pedra_refrataria"
 },
 "cl:espadao_silex": {
  "pt": "Espadão de Sílex",
  "en": "Flint Cleaver",
  "icone": "textures/items/cl/arte/espadao_silex"
 },
 "cl:espadao_slime_brasa": {
  "pt": "Espadão de Slime de Brasa",
  "en": "Cinderslime Cleaver",
  "icone": "textures/items/cl/arte/espadao_slime_brasa"
 },
 "cl:espadao_slime_cavaleiro": {
  "pt": "Espadão de Slime-Cavaleiro",
  "en": "Knightslime Cleaver",
  "icone": "textures/items/cl/arte/espadao_slime_cavaleiro"
 },
 "cl:espadao_slime_rainha": {
  "pt": "Espadão de Slime da Rainha",
  "en": "Queen's Slime Cleaver",
  "icone": "textures/items/cl/arte/espadao_slime_rainha"
 },
 "cl:espetinho": {
  "pt": "Espetinho",
  "en": "Barbecue on a Stick",
  "icone": "textures/items/cl/arte/espetinho"
 },
 "cl:espremedor": {
  "pt": "Espremedor",
  "en": "Juicer",
  "icone": "textures/items/cl/arte/blocos/espremedor"
 },
 "cl:estacao_agricola": {
  "pt": "Estação Agrícola",
  "en": "Farming Station",
  "icone": "textures/items/cl/blocos/estacao_agricola"
 },
 "cl:estacao_ferramentas": {
  "pt": "Estação de Ferramentas",
  "en": "Tool Station",
  "icone": "textures/items/cl/blocos/estacao_ferramentas"
 },
 "cl:estanho_enriquecido": {
  "pt": "Estanho Enriquecido",
  "en": "Enriched Tin",
  "icone": "textures/items/cl/arte/estanho_enriquecido"
 },
 "cl:estanho_po": {
  "pt": "Pó de Minério de Estanho",
  "en": "Powdered Tin Ore",
  "icone": "textures/items/cl/arte/estanho_po"
 },
 "cl:estanho_quebrado": {
  "pt": "Pedaço Quebrado de Estanho",
  "en": "Broken Tin Ore",
  "icone": "textures/items/cl/arte/estanho_quebrado"
 },
 "cl:estanho_triturado": {
  "pt": "Pedaço Triturado de Estanho",
  "en": "Crushed Tin Ore",
  "icone": "textures/items/cl/arte/estanho_triturado"
 },
 "cl:estante": {
  "pt": "Estante",
  "en": "Bookcase",
  "icone": "textures/items/cl/arte/blocos/estante"
 },
 "cl:esteira": {
  "pt": "Esteira",
  "en": "Conveyor Belt",
  "icone": "textures/items/cl/arte/blocos/esteira"
 },
 "cl:esteira_animal": {
  "pt": "Esteira de Animal",
  "en": "Treadmill",
  "icone": "textures/items/cl/arte/blocos/esteira_animal"
 },
 "cl:estrada_chamuscada": {
  "pt": "Estrada Chamuscada",
  "en": "Scorched Road",
  "icone": "textures/blocks/cl/arte/estrada_chamuscada"
 },
 "cl:estrada_plastico_amarelo": {
  "pt": "Estrada de Plástico Amarelo",
  "en": "Yellow Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_amarelo"
 },
 "cl:estrada_plastico_azul": {
  "pt": "Estrada de Plástico Azul",
  "en": "Blue Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_azul"
 },
 "cl:estrada_plastico_azul_claro": {
  "pt": "Estrada de Plástico Azul-Claro",
  "en": "Light Blue Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_azul_claro"
 },
 "cl:estrada_plastico_branco": {
  "pt": "Estrada de Plástico Branco",
  "en": "White Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_branco"
 },
 "cl:estrada_plastico_ciano": {
  "pt": "Estrada de Plástico Ciano",
  "en": "Cyan Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_ciano"
 },
 "cl:estrada_plastico_cinza": {
  "pt": "Estrada de Plástico Cinza",
  "en": "Gray Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_cinza"
 },
 "cl:estrada_plastico_cinza_claro": {
  "pt": "Estrada de Plástico Cinza-Claro",
  "en": "Light Gray Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_cinza_claro"
 },
 "cl:estrada_plastico_laranja": {
  "pt": "Estrada de Plástico Laranja",
  "en": "Orange Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_laranja"
 },
 "cl:estrada_plastico_lima": {
  "pt": "Estrada de Plástico Lima",
  "en": "Lime Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_lima"
 },
 "cl:estrada_plastico_magenta": {
  "pt": "Estrada de Plástico Magenta",
  "en": "Magenta Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_magenta"
 },
 "cl:estrada_plastico_marrom": {
  "pt": "Estrada de Plástico Marrom",
  "en": "Brown Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_marrom"
 },
 "cl:estrada_plastico_preto": {
  "pt": "Estrada de Plástico Preto",
  "en": "Black Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_preto"
 },
 "cl:estrada_plastico_rosa": {
  "pt": "Estrada de Plástico Rosa",
  "en": "Pink Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_rosa"
 },
 "cl:estrada_plastico_roxo": {
  "pt": "Estrada de Plástico Roxo",
  "en": "Purple Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_roxo"
 },
 "cl:estrada_plastico_verde": {
  "pt": "Estrada de Plástico Verde",
  "en": "Green Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_verde"
 },
 "cl:estrada_plastico_vermelho": {
  "pt": "Estrada de Plástico Vermelho",
  "en": "Red Plastic Road",
  "icone": "textures/items/cl/blocos/estrada_plastico_vermelho"
 },
 "cl:estrada_refrataria": {
  "pt": "Estrada Refratária",
  "en": "Seared Road",
  "icone": "textures/blocks/cl/arte/estrada_refrataria"
 },
 "cl:estrutura_maquina": {
  "pt": "Estrutura de Máquina",
  "en": "Machine Frame",
  "icone": "textures/items/cl/arte/blocos/estrutura_maquina"
 },
 "cl:estufa": {
  "pt": "Estufa",
  "en": "Greenhouse",
  "icone": "textures/items/cl/arte/blocos/estufa"
 },
 "cl:evaporador": {
  "pt": "Evaporador Térmico",
  "en": "Thermal Evaporation Controller",
  "icone": "textures/items/cl/blocos/evaporador"
 },
 "cl:expositor": {
  "pt": "Expositor",
  "en": "Display Case",
  "icone": "textures/items/cl/arte/blocos/expositor"
 },
 "cl:extrusora_ignea": {
  "pt": "Extrusora Ígnea",
  "en": "Igneous Extruder",
  "icone": "textures/items/cl/arte/blocos/extrusora_ignea"
 },
 "cl:fabricador_circuitos": {
  "pt": "Fabricador de Circuitos",
  "en": "Circuit Fabricator",
  "icone": "textures/items/cl/blocos/fabricador_circuitos"
 },
 "cl:faca_corte": {
  "pt": "Faca de Quartzo Certus",
  "en": "Certus Quartz Cutting Knife",
  "icone": "textures/items/cl/arte/faca_corte"
 },
 "cl:faca_diamante": {
  "pt": "Faca de Diamante",
  "en": "Diamond Knife",
  "icone": "textures/items/cl/arte/faca_diamante"
 },
 "cl:faca_ferro": {
  "pt": "Faca de Ferro",
  "en": "Iron Knife",
  "icone": "textures/items/cl/arte/faca_ferro"
 },
 "cl:faca_ouro": {
  "pt": "Faca de Ouro",
  "en": "Golden Knife",
  "icone": "textures/items/cl/arte/faca_ouro"
 },
 "cl:faca_silex": {
  "pt": "Faca de Sílex",
  "en": "Flint Knife",
  "icone": "textures/items/cl/arte/faca_silex"
 },
 "cl:faixa_mumia": {
  "pt": "Faixa de Múmia",
  "en": "Mummy Wrap",
  "icone": "textures/items/cl/arte/faixa_mumia"
 },
 "cl:fardo_palha": {
  "pt": "Fardo de Palha",
  "en": "Straw Bale",
  "icone": "textures/items/cl/blocos/fardo_palha"
 },
 "cl:farinha": {
  "pt": "Farinha",
  "en": "Flour",
  "icone": "textures/items/cl/arte/farinha"
 },
 "cl:farinha_cinzas": {
  "pt": "Farinha de Netherrack",
  "en": "Cinder Flour",
  "icone": "textures/items/cl/c/farinha_cinzas"
 },
 "cl:fatia_abobora": {
  "pt": "Fatia de Abóbora",
  "en": "Pumpkin Slice",
  "icone": "textures/items/cl/arte/fatia_abobora"
 },
 "cl:fatia_bacalhau": {
  "pt": "Fatia de Bacalhau",
  "en": "Cod Slice",
  "icone": "textures/items/cl/arte/fatia_bacalhau"
 },
 "cl:fatia_bacalhau_cozida": {
  "pt": "Fatia de Bacalhau Cozida",
  "en": "Cooked Cod Slice",
  "icone": "textures/items/cl/arte/fatia_bacalhau_cozida"
 },
 "cl:fatia_salmao": {
  "pt": "Fatia de Salmão",
  "en": "Salmon Slice",
  "icone": "textures/items/cl/arte/fatia_salmao"
 },
 "cl:fatia_salmao_cozida": {
  "pt": "Fatia de Salmão Cozida",
  "en": "Cooked Salmon Slice",
  "icone": "textures/items/cl/arte/fatia_salmao_cozida"
 },
 "cl:fatiar_emendar": {
  "pt": "Fatiar e Emendar",
  "en": "Slice'N'Splice",
  "icone": "textures/items/cl/blocos/fatiar_emendar"
 },
 "cl:feijao": {
  "pt": "Feijão",
  "en": "Beans",
  "icone": "textures/items/cl/arte/feijao"
 },
 "cl:feijao_assado": {
  "pt": "Feijão Assado",
  "en": "Baked Beans",
  "icone": "textures/items/cl/arte/feijao_assado"
 },
 "cl:ferro_condutor": {
  "pt": "Lingote de Liga Condutiva",
  "en": "Conductive Alloy Ingot",
  "icone": "textures/items/cl/arte/ferro_condutor"
 },
 "cl:ferro_enriquecido": {
  "pt": "Ferro Enriquecido",
  "en": "Enriched Iron",
  "icone": "textures/items/cl/arte/ferro_enriquecido"
 },
 "cl:ferro_po": {
  "pt": "Pó de Minério de Ferro",
  "en": "Powdered Iron Ore",
  "icone": "textures/items/cl/arte/ferro_po"
 },
 "cl:ferro_pulsante": {
  "pt": "Lingote de Liga Pulsante",
  "en": "Pulsating Alloy Ingot",
  "icone": "textures/items/cl/arte/ferro_pulsante"
 },
 "cl:ferro_quebrado": {
  "pt": "Pedaço Quebrado de Ferro",
  "en": "Broken Iron Ore",
  "icone": "textures/items/cl/arte/ferro_quebrado"
 },
 "cl:ferro_triturado": {
  "pt": "Pedaço Triturado de Ferro",
  "en": "Crushed Iron Ore",
  "icone": "textures/items/cl/arte/ferro_triturado"
 },
 "cl:fertilizadora": {
  "pt": "Fertilizadora",
  "en": "Fertilizer",
  "icone": "textures/items/cl/arte/blocos/fertilizadora"
 },
 "cl:fertilizante": {
  "pt": "Fertilizante",
  "en": "Fertilizer",
  "icone": "textures/items/cl/arte/fertilizante"
 },
 "cl:fibra_canhamo": {
  "pt": "Fibra de Cânhamo",
  "en": "Industrial Hemp Fiber",
  "icone": "textures/items/cl/c/fibra_canhamo"
 },
 "cl:fibra_quartzo": {
  "pt": "Fibra de Quartzo",
  "en": "Quartz Fiber",
  "icone": "textures/items/cl/c/fibra_quartzo"
 },
 "cl:filtro": {
  "pt": "Filtro de Ar",
  "en": "Air Filter",
  "icone": "textures/items/cl/arte/filtro"
 },
 "cl:fogao": {
  "pt": "Fogão",
  "en": "Stove",
  "icone": "textures/items/cl/blocos/fogao"
 },
 "cl:foguete_t1": {
  "pt": "Foguete Tier 1",
  "en": "Tier 1 Rocket",
  "icone": "textures/items/cl/arte/foguete_t1"
 },
 "cl:foice_aco": {
  "pt": "Foice de Aço",
  "en": "Steel Scythe",
  "icone": "textures/items/cl/arte/foice_aco"
 },
 "cl:foice_aco_slime": {
  "pt": "Foice de Aço de Slime",
  "en": "Slimesteel Scythe",
  "icone": "textures/items/cl/arte/foice_aco_slime"
 },
 "cl:foice_bronze": {
  "pt": "Foice de Bronze",
  "en": "Bronze Scythe",
  "icone": "textures/items/cl/arte/foice_bronze"
 },
 "cl:foice_bronze_ametista": {
  "pt": "Foice de Bronze de Ametista",
  "en": "Amethyst Bronze Scythe",
  "icone": "textures/items/cl/arte/foice_bronze_ametista"
 },
 "cl:foice_cobalto": {
  "pt": "Foice de Cobalto",
  "en": "Cobalt Scythe",
  "icone": "textures/items/cl/arte/foice_cobalto"
 },
 "cl:foice_cobre": {
  "pt": "Foice de Cobre",
  "en": "Copper Scythe",
  "icone": "textures/items/cl/arte/foice_cobre"
 },
 "cl:foice_coro": {
  "pt": "Foice de Chorus",
  "en": "Chorus Scythe",
  "icone": "textures/items/cl/arte/foice_coro"
 },
 "cl:foice_ferro": {
  "pt": "Foice de Ferro",
  "en": "Iron Scythe",
  "icone": "textures/items/cl/arte/foice_ferro"
 },
 "cl:foice_ferro_porco": {
  "pt": "Foice de Ferro-Porco",
  "en": "Pig Iron Scythe",
  "icone": "textures/items/cl/arte/foice_ferro_porco"
 },
 "cl:foice_hepatizon": {
  "pt": "Foice de Hepatizão",
  "en": "Hepatizon Scythe",
  "icone": "textures/items/cl/arte/foice_hepatizon"
 },
 "cl:foice_madeira": {
  "pt": "Foice de Madeira",
  "en": "Wood Scythe",
  "icone": "textures/items/cl/arte/foice_madeira"
 },
 "cl:foice_madeira_slime": {
  "pt": "Foice de Madeira de Slime",
  "en": "Slimewood Scythe",
  "icone": "textures/items/cl/arte/foice_madeira_slime"
 },
 "cl:foice_madeira_slime_revestida": {
  "pt": "Foice de Madeira de Slime Revestida",
  "en": "Plated Slimewood Scythe",
  "icone": "textures/items/cl/arte/foice_madeira_slime_revestida"
 },
 "cl:foice_madeira_tratada": {
  "pt": "Foice de Madeira Tratada",
  "en": "Treated Wood Scythe",
  "icone": "textures/items/cl/arte/foice_madeira_tratada"
 },
 "cl:foice_manyullyn": {
  "pt": "Foice de Manyullyn",
  "en": "Manyullyn Scythe",
  "icone": "textures/items/cl/arte/foice_manyullyn"
 },
 "cl:foice_nahuatl": {
  "pt": "Foice de Nahuatl",
  "en": "Nahuatl Scythe",
  "icone": "textures/items/cl/arte/foice_nahuatl"
 },
 "cl:foice_osmio": {
  "pt": "Foice de Ósmio",
  "en": "Osmium Scythe",
  "icone": "textures/items/cl/arte/foice_osmio"
 },
 "cl:foice_osso": {
  "pt": "Foice de Osso",
  "en": "Bone Scythe",
  "icone": "textures/items/cl/arte/foice_osso"
 },
 "cl:foice_osso_blaze": {
  "pt": "Foice de Osso de Blaze",
  "en": "Blazing Bone Scythe",
  "icone": "textures/items/cl/arte/foice_osso_blaze"
 },
 "cl:foice_osso_necrotico": {
  "pt": "Foice de Osso Necrótico",
  "en": "Necrotic Bone Scythe",
  "icone": "textures/items/cl/arte/foice_osso_necrotico"
 },
 "cl:foice_osso_venenoso": {
  "pt": "Foice de Osso Venenoso",
  "en": "Venombone Scythe",
  "icone": "textures/items/cl/arte/foice_osso_venenoso"
 },
 "cl:foice_ouro_rosa": {
  "pt": "Foice de Ouro Rosa",
  "en": "Rose Gold Scythe",
  "icone": "textures/items/cl/arte/foice_ouro_rosa"
 },
 "cl:foice_pedra": {
  "pt": "Foice de Pedra",
  "en": "Stone Scythe",
  "icone": "textures/items/cl/arte/foice_pedra"
 },
 "cl:foice_pedra_branca": {
  "pt": "Foice de Pedra Branca",
  "en": "Whitestone Scythe",
  "icone": "textures/items/cl/arte/foice_pedra_branca"
 },
 "cl:foice_pedra_chamuscada": {
  "pt": "Foice de Pedra Chamuscada",
  "en": "Scorched Stone Scythe",
  "icone": "textures/items/cl/arte/foice_pedra_chamuscada"
 },
 "cl:foice_pedra_refrataria": {
  "pt": "Foice de Pedra Carbonizada",
  "en": "Seared Stone Scythe",
  "icone": "textures/items/cl/arte/foice_pedra_refrataria"
 },
 "cl:foice_silex": {
  "pt": "Foice de Sílex",
  "en": "Flint Scythe",
  "icone": "textures/items/cl/arte/foice_silex"
 },
 "cl:foice_slime_brasa": {
  "pt": "Foice de Slime de Brasa",
  "en": "Cinderslime Scythe",
  "icone": "textures/items/cl/arte/foice_slime_brasa"
 },
 "cl:foice_slime_cavaleiro": {
  "pt": "Foice de Slime-Cavaleiro",
  "en": "Knightslime Scythe",
  "icone": "textures/items/cl/arte/foice_slime_cavaleiro"
 },
 "cl:foice_slime_rainha": {
  "pt": "Foice de Slime da Rainha",
  "en": "Queen's Slime Scythe",
  "icone": "textures/items/cl/arte/foice_slime_rainha"
 },
 "cl:folha_infestada": {
  "pt": "Folha Infestada",
  "en": "Infested Leaves",
  "icone": "textures/items/cl/arte/blocos/folha_infestada"
 },
 "cl:folha_plastico": {
  "pt": "Folha de Plástico",
  "en": "Plastic Sheet",
  "icone": "textures/items/cl/arte/folha_plastico"
 },
 "cl:folha_repolho": {
  "pt": "Folha de Repolho",
  "en": "Cabbage Leaf",
  "icone": "textures/items/cl/arte/folha_repolho"
 },
 "cl:folhas_slime_ceu": {
  "pt": "Folhas de Slime-do-Céu",
  "en": "Skyslime Leaves",
  "icone": "textures/blocks/cl/arte/folhas_slime_ceu"
 },
 "cl:folhas_slime_ender": {
  "pt": "Folhas de Slime-do-Ender",
  "en": "Enderslime Leaves",
  "icone": "textures/blocks/cl/arte/folhas_slime_ender"
 },
 "cl:folhas_slime_icor": {
  "pt": "Verrugas de Icor",
  "en": "Ichor Leaves",
  "icone": "textures/blocks/cl/arte/folhas_slime_icor"
 },
 "cl:folhas_slime_sangue": {
  "pt": "Verrugas de Sangue",
  "en": "Blood Leaves",
  "icone": "textures/blocks/cl/arte/folhas_slime_sangue"
 },
 "cl:folhas_slime_terra": {
  "pt": "Folhas de Slime-da-Terra",
  "en": "Earthslime Leaves",
  "icone": "textures/blocks/cl/arte/folhas_slime_terra"
 },
 "cl:fornalha_redstone": {
  "pt": "Fornalha de Redstone",
  "en": "Redstone Furnace",
  "icone": "textures/items/cl/arte/blocos/fornalha_redstone"
 },
 "cl:forno_coque": {
  "pt": "Forno de Coque",
  "en": "Coke Oven",
  "icone": "textures/items/cl/blocos/forno_coque"
 },
 "cl:fragmento_cobre": {
  "pt": "Estilhaço de cobre",
  "en": "Copper Shard",
  "icone": "textures/items/cl/arte/fragmento_cobre"
 },
 "cl:fragmento_estanho": {
  "pt": "Estilhaço de estanho",
  "en": "Tin Shard",
  "icone": "textures/items/cl/arte/fragmento_estanho"
 },
 "cl:fragmento_ferro": {
  "pt": "Estilhaço de ferro",
  "en": "Iron Shard",
  "icone": "textures/items/cl/arte/fragmento_ferro"
 },
 "cl:fragmento_meteorito": {
  "pt": "Fragmento de Meteorito",
  "en": "Meteorite Fragment",
  "icone": "textures/items/cl/arte/fragmento_meteorito"
 },
 "cl:fragmento_osmio": {
  "pt": "Estilhaço de ósmio",
  "en": "Osmium Shard",
  "icone": "textures/items/cl/arte/fragmento_osmio"
 },
 "cl:fragmento_ouro": {
  "pt": "Estilhaço de ouro",
  "en": "Gold Shard",
  "icone": "textures/items/cl/arte/fragmento_ouro"
 },
 "cl:frank_n_zumbi": {
  "pt": "Frank'N'Zumbi",
  "en": "Frank'N'Zombie",
  "icone": "textures/items/cl/c/frank_n_zumbi"
 },
 "cl:frasco_alma": {
  "pt": "Frasco de Alma",
  "en": "Soul Vial",
  "icone": "textures/items/cl/arte/frasco_alma"
 },
 "cl:frasco_alma_cheio": {
  "pt": "Frasco de Alma (com alma)",
  "en": "Soul Vial (filled)",
  "icone": "textures/items/cl/arte/frasco_alma_cheio"
 },
 "cl:frasco_vazio": {
  "pt": "Frasco do Vazio",
  "en": "Vial of the Void",
  "icone": "textures/items/cl/arte/frasco_vazio"
 },
 "cl:frigideira": {
  "pt": "Frigideira",
  "en": "Skillet",
  "icone": "textures/items/cl/arte/blocos/frigideira"
 },
 "cl:fruta_cacto": {
  "pt": "Fruta do Cacto",
  "en": "Cactus Fruit",
  "icone": "textures/items/cl/arte/fruta_cacto"
 },
 "cl:fuba": {
  "pt": "Fubá",
  "en": "Cornmeal",
  "icone": "textures/items/cl/arte/fuba"
 },
 "cl:fundidor_energizado": {
  "pt": "Fundição Energizada",
  "en": "Energized Smelter",
  "icone": "textures/blocks/cl/arte/fundidor_energizado_topo"
 },
 "cl:fundidora_inducao": {
  "pt": "Fundidora de Indução",
  "en": "Induction Smelter",
  "icone": "textures/items/cl/arte/blocos/fundidora_inducao"
 },
 "cl:fundidora_ligas": {
  "pt": "Fundição de Ligas",
  "en": "Alloy Smelter",
  "icone": "textures/items/cl/blocos/fundidora_ligas"
 },
 "cl:funil_energia_ardente": {
  "pt": "Funil de Energia Ardente",
  "en": "Blazing Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_ardente"
 },
 "cl:funil_energia_basico": {
  "pt": "Funil de Energia Básico",
  "en": "Basic Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_basico"
 },
 "cl:funil_energia_endurecido": {
  "pt": "Funil de Energia Endurecido",
  "en": "Hardened Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_endurecido"
 },
 "cl:funil_energia_espiritual": {
  "pt": "Funil de Energia Espiritual",
  "en": "Spirited Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_espiritual"
 },
 "cl:funil_energia_inicial": {
  "pt": "Funil de Energia Inicial",
  "en": "Starter Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_inicial"
 },
 "cl:funil_energia_niotico": {
  "pt": "Funil de Energia Niótico",
  "en": "Niotic Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_niotico"
 },
 "cl:funil_energia_nitro": {
  "pt": "Funil de Energia Nitro",
  "en": "Nitro Energy Hopper",
  "icone": "textures/items/cl/blocos/funil_energia_nitro"
 },
 "cl:funil_impulso": {
  "pt": "Funil de Impulso",
  "en": "Impulse Hopper",
  "icone": "textures/items/cl/blocos/funil_impulso"
 },
 "cl:furadeira": {
  "pt": "Furadeira Mecânica",
  "en": "Mechanical Drill",
  "icone": "textures/items/cl/blocos/furadeira"
 },
 "cl:furnator_ardente": {
  "pt": "Furnator Ardente",
  "en": "Blazing Furnator",
  "icone": "textures/items/cl/blocos/furnator_ardente"
 },
 "cl:furnator_basico": {
  "pt": "Furnator Básico",
  "en": "Basic Furnator",
  "icone": "textures/items/cl/blocos/furnator_basico"
 },
 "cl:furnator_endurecido": {
  "pt": "Furnator Endurecido",
  "en": "Hardened Furnator",
  "icone": "textures/items/cl/blocos/furnator_endurecido"
 },
 "cl:furnator_espiritual": {
  "pt": "Furnator Espiritual",
  "en": "Spirited Furnator",
  "icone": "textures/items/cl/blocos/furnator_espiritual"
 },
 "cl:furnator_inicial": {
  "pt": "Furnator Inicial",
  "en": "Starter Furnator",
  "icone": "textures/items/cl/blocos/furnator_inicial"
 },
 "cl:furnator_niotico": {
  "pt": "Furnator Niótico",
  "en": "Niotic Furnator",
  "icone": "textures/items/cl/blocos/furnator_niotico"
 },
 "cl:furnator_nitro": {
  "pt": "Furnator Nitro",
  "en": "Nitro Furnator",
  "icone": "textures/items/cl/blocos/furnator_nitro"
 },
 "cl:fusor": {
  "pt": "Fusor Refratário",
  "en": "Seared Melter",
  "icone": "textures/blocks/cl/arte/fusor_topo"
 },
 "cl:gelo_seco": {
  "pt": "Gelo Seco",
  "en": "Dry Ice",
  "icone": "textures/items/cl/blocos/gelo_seco"
 },
 "cl:gerador": {
  "pt": "Gerador a Carvão",
  "en": "Coal Generator",
  "icone": "textures/items/cl/arte/blocos/gerador"
 },
 "cl:gerador_bio": {
  "pt": "Biogerador",
  "en": "Bio-Generator",
  "icone": "textures/items/cl/blocos/gerador_bio"
 },
 "cl:gerador_blaze": {
  "pt": "Gerador de Blazes",
  "en": "Blaze Spawner",
  "icone": "textures/items/cl/arte/blocos/gerador_blaze"
 },
 "cl:gerador_calor": {
  "pt": "Gerador a Calor",
  "en": "Heat Generator",
  "icone": "textures/items/cl/blocos/gerador_calor"
 },
 "cl:gerador_energizado": {
  "pt": "Gerador de Monstros Energizado",
  "en": "Powered Spawner",
  "icone": "textures/items/cl/blocos/gerador_energizado"
 },
 "cl:gerador_eolico": {
  "pt": "Turbina Eólica",
  "en": "Wind Generator",
  "icone": "textures/items/cl/blocos/gerador_eolico"
 },
 "cl:gerador_gas": {
  "pt": "Gerador a Gás",
  "en": "Gas-Burning Generator",
  "icone": "textures/items/cl/blocos/gerador_gas"
 },
 "cl:gerador_monstros": {
  "pt": "Gerador de Monstros",
  "en": "Monster Generator",
  "icone": "textures/items/cl/arte/blocos/gerador_monstros"
 },
 "cl:gerador_quebrado": {
  "pt": "Gerador de Monstros Quebrado",
  "en": "Broken Spawner",
  "icone": "textures/items/cl/arte/gerador_quebrado"
 },
 "cl:gerador_solar_avancado": {
  "pt": "Gerador Solar Avançado",
  "en": "Advanced Solar Generator",
  "icone": "textures/items/cl/blocos/gerador_solar_avancado"
 },
 "cl:gerador_solar_mk": {
  "pt": "Gerador Solar",
  "en": "Solar Generator",
  "icone": "textures/items/cl/blocos/gerador_solar_mk"
 },
 "cl:gerador_stirling": {
  "pt": "Gerador Stirling",
  "en": "Stirling Generator",
  "icone": "textures/items/cl/blocos/gerador_stirling"
 },
 "cl:girocoptero": {
  "pt": "Girocóptero",
  "en": "Gyrodyne",
  "icone": "textures/items/cl/arte/girocoptero"
 },
 "cl:grade": {
  "pt": "Grade",
  "en": "Grate",
  "icone": "textures/items/cl/blocos/grade"
 },
 "cl:grama_slime_ceu": {
  "pt": "Grama de Slime-do-Céu",
  "en": "Skyslime Grass",
  "icone": "textures/blocks/cl/arte/grama_slime_ceu_topo"
 },
 "cl:grama_slime_ender": {
  "pt": "Grama de Slime-do-Ender",
  "en": "Enderslime Grass",
  "icone": "textures/blocks/cl/arte/grama_slime_ender_topo"
 },
 "cl:grama_slime_icor": {
  "pt": "Grama de Icor",
  "en": "Ichor Grass",
  "icone": "textures/blocks/cl/arte/grama_slime_icor_topo"
 },
 "cl:grama_slime_sangue": {
  "pt": "Grama de Sangue",
  "en": "Blood Grass",
  "icone": "textures/blocks/cl/arte/grama_slime_sangue_topo"
 },
 "cl:grama_slime_terra": {
  "pt": "Grama de Slime-da-Terra",
  "en": "Earthslime Grass",
  "icone": "textures/blocks/cl/arte/grama_slime_terra_topo"
 },
 "cl:graos_end": {
  "pt": "Grãos do End",
  "en": "Grains of the End",
  "icone": "textures/items/cl/arte/graos_end"
 },
 "cl:graos_infinito": {
  "pt": "Grãos do Infinito",
  "en": "Grains of Infinity",
  "icone": "textures/items/cl/arte/graos_infinito"
 },
 "cl:graos_piezalidade": {
  "pt": "Grãos de Piezalidade",
  "en": "Grains of Piezallity",
  "icone": "textures/items/cl/arte/graos_piezalidade"
 },
 "cl:graos_presciencia": {
  "pt": "Grãos da Presciência",
  "en": "Grains of Prescience",
  "icone": "textures/items/cl/arte/graos_presciencia"
 },
 "cl:graos_vibracao": {
  "pt": "Grãos de Vibração",
  "en": "Grains of Vibrancy",
  "icone": "textures/items/cl/arte/graos_vibracao"
 },
 "cl:graveto_nutritivo": {
  "pt": "Graveto Nutritivo",
  "en": "Nutritious Stick",
  "icone": "textures/items/cl/arte/graveto_nutritivo"
 },
 "cl:graveto_tratado": {
  "pt": "Graveto de Madeira Tratada",
  "en": "Treated Stick",
  "icone": "textures/items/cl/c/graveto_tratado"
 },
 "cl:hamburguer": {
  "pt": "Hambúrguer",
  "en": "Hamburger",
  "icone": "textures/items/cl/arte/hamburguer"
 },
 "cl:hamburguer_carne": {
  "pt": "Hambúrguer de Carne",
  "en": "Beef Patty",
  "icone": "textures/items/cl/arte/hamburguer_carne"
 },
 "cl:haste_dieletrica": {
  "pt": "Haste Dielétrica",
  "en": "Dielectric Rod",
  "icone": "textures/items/cl/arte/haste_dieletrica"
 },
 "cl:haste_energizadora_ardente": {
  "pt": "Haste Energizadora Ardente",
  "en": "Blazing Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_ardente"
 },
 "cl:haste_energizadora_basico": {
  "pt": "Haste Energizadora Básico",
  "en": "Basic Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_basico"
 },
 "cl:haste_energizadora_endurecido": {
  "pt": "Haste Energizadora Endurecido",
  "en": "Hardened Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_endurecido"
 },
 "cl:haste_energizadora_espiritual": {
  "pt": "Haste Energizadora Espiritual",
  "en": "Spirited Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_espiritual"
 },
 "cl:haste_energizadora_inicial": {
  "pt": "Haste Energizadora Inicial",
  "en": "Starter Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_inicial"
 },
 "cl:haste_energizadora_niotico": {
  "pt": "Haste Energizadora Niótico",
  "en": "Niotic Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_niotico"
 },
 "cl:haste_energizadora_nitro": {
  "pt": "Haste Energizadora Nitro",
  "en": "Nitro Energizing Rod",
  "icone": "textures/items/cl/blocos/haste_energizadora_nitro"
 },
 "cl:helice": {
  "pt": "Hélice",
  "en": "Propeller",
  "icone": "textures/items/cl/arte/helice"
 },
 "cl:helice_aviao": {
  "pt": "Hélice de Avião",
  "en": "Propeller",
  "icone": "textures/items/cl/arte/helice_aviao"
 },
 "cl:idolo_amaldicoado": {
  "pt": "Ídolo Amaldiçoado",
  "en": "Cursed Idol",
  "icone": "textures/items/cl/arte/blocos/idolo_amaldicoado"
 },
 "cl:infusor_metalurgico": {
  "pt": "Infusor Metalúrgico",
  "en": "Metallurgic Infuser",
  "icone": "textures/items/cl/arte/blocos/infusor_metalurgico"
 },
 "cl:infusor_quimico": {
  "pt": "Infusor Químico",
  "en": "Chemical Infuser",
  "icone": "textures/items/cl/arte/blocos/infusor_quimico"
 },
 "cl:inscritor": {
  "pt": "Inscritor",
  "en": "Inscriber",
  "icone": "textures/blocks/cl/arte/inscritor_topo"
 },
 "cl:interface_camara": {
  "pt": "Interface da Câmara",
  "en": "Pressure Chamber Interface",
  "icone": "textures/items/cl/arte/blocos/interface_camara"
 },
 "cl:involucro_celula_me": {
  "pt": "Cápsula para Células de Armazenamento de Itens",
  "en": "ME Item Cell Housing",
  "icone": "textures/items/cl/arte/involucro_celula_me"
 },
 "cl:involucro_dieletrico": {
  "pt": "Invólucro Dielétrico",
  "en": "Dielectric Casing",
  "icone": "textures/items/cl/arte/involucro_dieletrico"
 },
 "cl:isolamento_industrial": {
  "pt": "Isolamento Industrial",
  "en": "Industrial Insulation",
  "icone": "textures/items/cl/blocos/isolamento_industrial"
 },
 "cl:jaspe": {
  "pt": "Jaspe",
  "en": "Jasper",
  "icone": "textures/items/cl/blocos/jaspe"
 },
 "cl:jaspe_entalhado": {
  "pt": "Jaspe Entalhado",
  "en": "Chiseled Jasper",
  "icone": "textures/items/cl/blocos/jaspe_entalhado"
 },
 "cl:jaspe_pilar": {
  "pt": "Jaspe (Pilar)",
  "en": "Jasper Pillar",
  "icone": "textures/items/cl/blocos/jaspe_pilar"
 },
 "cl:jaspe_polido": {
  "pt": "Jaspe Polido",
  "en": "Polished Jasper",
  "icone": "textures/items/cl/blocos/jaspe_polido"
 },
 "cl:jaspe_tijolos": {
  "pt": "Jaspe (Tijolos)",
  "en": "Jasper Bricks",
  "icone": "textures/items/cl/blocos/jaspe_tijolos"
 },
 "cl:jetpack": {
  "pt": "Jetpack",
  "en": "Jetpack",
  "icone": "textures/items/cl/arte/jetpack"
 },
 "cl:kama_aco": {
  "pt": "Kama de Aço",
  "en": "Steel Kama",
  "icone": "textures/items/cl/arte/kama_aco"
 },
 "cl:kama_aco_slime": {
  "pt": "Kama de Aço de Slime",
  "en": "Slimesteel Kama",
  "icone": "textures/items/cl/arte/kama_aco_slime"
 },
 "cl:kama_bronze": {
  "pt": "Kama de Bronze",
  "en": "Bronze Kama",
  "icone": "textures/items/cl/arte/kama_bronze"
 },
 "cl:kama_bronze_ametista": {
  "pt": "Kama de Bronze de Ametista",
  "en": "Amethyst Bronze Kama",
  "icone": "textures/items/cl/arte/kama_bronze_ametista"
 },
 "cl:kama_cobalto": {
  "pt": "Kama de Cobalto",
  "en": "Cobalt Kama",
  "icone": "textures/items/cl/arte/kama_cobalto"
 },
 "cl:kama_cobre": {
  "pt": "Kama de Cobre",
  "en": "Copper Kama",
  "icone": "textures/items/cl/arte/kama_cobre"
 },
 "cl:kama_coro": {
  "pt": "Kama de Chorus",
  "en": "Chorus Kama",
  "icone": "textures/items/cl/arte/kama_coro"
 },
 "cl:kama_ferro": {
  "pt": "Kama de Ferro",
  "en": "Iron Kama",
  "icone": "textures/items/cl/arte/kama_ferro"
 },
 "cl:kama_ferro_porco": {
  "pt": "Kama de Ferro-Porco",
  "en": "Pig Iron Kama",
  "icone": "textures/items/cl/arte/kama_ferro_porco"
 },
 "cl:kama_hepatizon": {
  "pt": "Kama de Hepatizão",
  "en": "Hepatizon Kama",
  "icone": "textures/items/cl/arte/kama_hepatizon"
 },
 "cl:kama_madeira": {
  "pt": "Kama de Madeira",
  "en": "Wood Kama",
  "icone": "textures/items/cl/arte/kama_madeira"
 },
 "cl:kama_madeira_slime": {
  "pt": "Kama de Madeira de Slime",
  "en": "Slimewood Kama",
  "icone": "textures/items/cl/arte/kama_madeira_slime"
 },
 "cl:kama_madeira_slime_revestida": {
  "pt": "Kama de Madeira de Slime Revestida",
  "en": "Plated Slimewood Kama",
  "icone": "textures/items/cl/arte/kama_madeira_slime_revestida"
 },
 "cl:kama_madeira_tratada": {
  "pt": "Kama de Madeira Tratada",
  "en": "Treated Wood Kama",
  "icone": "textures/items/cl/arte/kama_madeira_tratada"
 },
 "cl:kama_manyullyn": {
  "pt": "Kama de Manyullyn",
  "en": "Manyullyn Kama",
  "icone": "textures/items/cl/arte/kama_manyullyn"
 },
 "cl:kama_nahuatl": {
  "pt": "Kama de Nahuatl",
  "en": "Nahuatl Kama",
  "icone": "textures/items/cl/arte/kama_nahuatl"
 },
 "cl:kama_osmio": {
  "pt": "Kama de Ósmio",
  "en": "Osmium Kama",
  "icone": "textures/items/cl/arte/kama_osmio"
 },
 "cl:kama_osso": {
  "pt": "Kama de Osso",
  "en": "Bone Kama",
  "icone": "textures/items/cl/arte/kama_osso"
 },
 "cl:kama_osso_blaze": {
  "pt": "Kama de Osso de Blaze",
  "en": "Blazing Bone Kama",
  "icone": "textures/items/cl/arte/kama_osso_blaze"
 },
 "cl:kama_osso_necrotico": {
  "pt": "Kama de Osso Necrótico",
  "en": "Necrotic Bone Kama",
  "icone": "textures/items/cl/arte/kama_osso_necrotico"
 },
 "cl:kama_osso_venenoso": {
  "pt": "Kama de Osso Venenoso",
  "en": "Venombone Kama",
  "icone": "textures/items/cl/arte/kama_osso_venenoso"
 },
 "cl:kama_ouro_rosa": {
  "pt": "Kama de Ouro Rosa",
  "en": "Rose Gold Kama",
  "icone": "textures/items/cl/arte/kama_ouro_rosa"
 },
 "cl:kama_pedra": {
  "pt": "Kama de Pedra",
  "en": "Stone Kama",
  "icone": "textures/items/cl/arte/kama_pedra"
 },
 "cl:kama_pedra_branca": {
  "pt": "Kama de Pedra Branca",
  "en": "Whitestone Kama",
  "icone": "textures/items/cl/arte/kama_pedra_branca"
 },
 "cl:kama_pedra_chamuscada": {
  "pt": "Kama de Pedra Chamuscada",
  "en": "Scorched Stone Kama",
  "icone": "textures/items/cl/arte/kama_pedra_chamuscada"
 },
 "cl:kama_pedra_refrataria": {
  "pt": "Kama de Pedra Carbonizada",
  "en": "Seared Stone Kama",
  "icone": "textures/items/cl/arte/kama_pedra_refrataria"
 },
 "cl:kama_silex": {
  "pt": "Kama de Sílex",
  "en": "Flint Kama",
  "icone": "textures/items/cl/arte/kama_silex"
 },
 "cl:kama_slime_brasa": {
  "pt": "Kama de Slime de Brasa",
  "en": "Cinderslime Kama",
  "icone": "textures/items/cl/arte/kama_slime_brasa"
 },
 "cl:kama_slime_cavaleiro": {
  "pt": "Kama de Slime-Cavaleiro",
  "en": "Knightslime Kama",
  "icone": "textures/items/cl/arte/kama_slime_cavaleiro"
 },
 "cl:kama_slime_rainha": {
  "pt": "Kama de Slime da Rainha",
  "en": "Queen's Slime Kama",
  "icone": "textures/items/cl/arte/kama_slime_rainha"
 },
 "cl:ladrilho_refratario": {
  "pt": "Ladrilho Refratário",
  "en": "Seared Tiles",
  "icone": "textures/blocks/cl/arte/ladrilho_refratario"
 },
 "cl:lampada": {
  "pt": "Lâmpada",
  "en": "Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada"
 },
 "cl:lampada_amarela": {
  "pt": "Lâmpada Amarela",
  "en": "Yellow Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_amarela"
 },
 "cl:lampada_azul": {
  "pt": "Lâmpada Azul",
  "en": "Blue Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_azul"
 },
 "cl:lampada_ciano": {
  "pt": "Lâmpada Ciano",
  "en": "Cyan Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_ciano"
 },
 "cl:lampada_laranja": {
  "pt": "Lâmpada Laranja",
  "en": "Orange Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_laranja"
 },
 "cl:lampada_pedra": {
  "pt": "Lâmpada de Pedra",
  "en": "Stone Lamp",
  "icone": "textures/items/cl/blocos/lampada_pedra"
 },
 "cl:lampada_rosa": {
  "pt": "Lâmpada Rosa",
  "en": "Pink Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_rosa"
 },
 "cl:lampada_roxa": {
  "pt": "Lâmpada Roxa",
  "en": "Purple Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_roxa"
 },
 "cl:lampada_verde": {
  "pt": "Lâmpada Verde",
  "en": "Green Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_verde"
 },
 "cl:lampada_vermelha": {
  "pt": "Lâmpada Vermelha",
  "en": "Red Fancy Lamp",
  "icone": "textures/items/cl/arte/blocos/lampada_vermelha"
 },
 "cl:lanterna": {
  "pt": "Lanterna",
  "en": "Fancy Lantern",
  "icone": "textures/items/cl/arte/blocos/lanterna"
 },
 "cl:lanterna_chamuscada": {
  "pt": "Lanterna Chamuscada",
  "en": "Scorched Lantern",
  "icone": "textures/blocks/cl/arte/lanterna_chamuscada"
 },
 "cl:lanterna_papel": {
  "pt": "Lanterna de Papel",
  "en": "Paper Lantern",
  "icone": "textures/items/cl/blocos/lanterna_papel"
 },
 "cl:lanterna_refrataria": {
  "pt": "Lanterna Refratária",
  "en": "Seared Lantern",
  "icone": "textures/blocks/cl/arte/lanterna_refrataria"
 },
 "cl:lata_cobre": {
  "pt": "Lata de Cobre",
  "en": "Copper Canister",
  "icone": "textures/items/cl/c/lata_cobre"
 },
 "cl:lata_estanho": {
  "pt": "Lata de Estanho",
  "en": "Tin Canister",
  "icone": "textures/items/cl/c/lata_estanho"
 },
 "cl:lente_ender": {
  "pt": "Lente do Ender",
  "en": "Lens of Ender",
  "icone": "textures/items/cl/arte/lente_ender"
 },
 "cl:liga_andesita": {
  "pt": "Liga de Andesita",
  "en": "Andesite Alloy",
  "icone": "textures/items/cl/c/liga_andesita"
 },
 "cl:liga_atomica": {
  "pt": "Liga Atômica",
  "en": "Atomic Alloy",
  "icone": "textures/items/cl/arte/liga_atomica"
 },
 "cl:liga_energetica": {
  "pt": "Lingote de Liga Energética",
  "en": "Energetic Alloy Ingot",
  "icone": "textures/items/cl/arte/liga_energetica"
 },
 "cl:liga_enriquecida": {
  "pt": "Liga Fundida",
  "en": "Infused Alloy",
  "icone": "textures/items/cl/arte/liga_enriquecida"
 },
 "cl:liga_redstone": {
  "pt": "Lingote de Liga de Redstone",
  "en": "Redstone Alloy Ingot",
  "icone": "textures/items/cl/arte/liga_redstone"
 },
 "cl:liga_reforcada": {
  "pt": "Liga Reforçada",
  "en": "Reinforced Alloy",
  "icone": "textures/items/cl/arte/liga_reforcada"
 },
 "cl:liga_vibrante": {
  "pt": "Lingote de Liga Vibrante",
  "en": "Vibrant Alloy Ingot",
  "icone": "textures/items/cl/arte/liga_vibrante"
 },
 "cl:ligador": {
  "pt": "Ligador Chamuscado",
  "en": "Scorched Alloyer",
  "icone": "textures/blocks/cl/arte/ligador_topo"
 },
 "cl:lingote_aco": {
  "pt": "Lingote de Aço",
  "en": "Steel Ingot",
  "icone": "textures/items/cl/arte/lingote_aco"
 },
 "cl:lingote_aco_slime": {
  "pt": "Lingote de Aço de Slime",
  "en": "Slimesteel Ingot",
  "icone": "textures/items/cl/arte/lingote_aco_slime"
 },
 "cl:lingote_aluminio": {
  "pt": "Lingote de Alumínio",
  "en": "Aluminum Ingot",
  "icone": "textures/items/cl/arte/lingote_aluminio"
 },
 "cl:lingote_blutonio": {
  "pt": "Lingote de Blutônio",
  "en": "Blutonium Ingot",
  "icone": "textures/items/cl/arte/lingote_blutonio"
 },
 "cl:lingote_bronze": {
  "pt": "Lingote de Bronze",
  "en": "Bronze Ingot",
  "icone": "textures/items/cl/arte/lingote_bronze"
 },
 "cl:lingote_bronze_ametista": {
  "pt": "Lingote de Bronze de Ametista",
  "en": "Amethyst Bronze Ingot",
  "icone": "textures/items/cl/arte/lingote_bronze_ametista"
 },
 "cl:lingote_cianita": {
  "pt": "Lingote de Cianita",
  "en": "Cyanite Ingot",
  "icone": "textures/items/cl/arte/lingote_cianita"
 },
 "cl:lingote_cobalto": {
  "pt": "Lingote de Cobalto",
  "en": "Cobalt Ingot",
  "icone": "textures/items/cl/arte/lingote_cobalto"
 },
 "cl:lingote_estanho": {
  "pt": "Lingote de Estanho",
  "en": "Tin Ingot",
  "icone": "textures/items/cl/arte/lingote_estanho"
 },
 "cl:lingote_ferro_comprimido": {
  "pt": "Lingote de Ferro Comprimido",
  "en": "Compressed Iron Ingot",
  "icone": "textures/items/cl/arte/lingote_ferro_comprimido"
 },
 "cl:lingote_ferro_porco": {
  "pt": "Lingote de Ferro-Porco",
  "en": "Pig Iron Ingot",
  "icone": "textures/items/cl/arte/lingote_ferro_porco"
 },
 "cl:lingote_glowstone_refinado": {
  "pt": "Lingote de Glowstone Refinada",
  "en": "Refined Glowstone Ingot",
  "icone": "textures/items/cl/arte/lingote_glowstone_refinado"
 },
 "cl:lingote_hepatizon": {
  "pt": "Lingote de Hepatizão",
  "en": "Hepatizon Ingot",
  "icone": "textures/items/cl/arte/lingote_hepatizon"
 },
 "cl:lingote_latao": {
  "pt": "Lingote de Latão",
  "en": "Brass Ingot",
  "icone": "textures/items/cl/c/lingote_latao"
 },
 "cl:lingote_manyullyn": {
  "pt": "Lingote de Manyullyn",
  "en": "Manyullyn Ingot",
  "icone": "textures/items/cl/arte/lingote_manyullyn"
 },
 "cl:lingote_obsidiana_refinada": {
  "pt": "Lingote de Obsidiana Refinada",
  "en": "Refined Obsidian Ingot",
  "icone": "textures/items/cl/arte/lingote_obsidiana_refinada"
 },
 "cl:lingote_osmio": {
  "pt": "Lingote de Ósmio",
  "en": "Osmium Ingot",
  "icone": "textures/items/cl/arte/lingote_osmio"
 },
 "cl:lingote_ouro_rosa": {
  "pt": "Lingote de Ouro Rosa",
  "en": "Rose Gold Ingot",
  "icone": "textures/items/cl/arte/lingote_ouro_rosa"
 },
 "cl:lingote_slime_brasa": {
  "pt": "Lingote de Slime de Brasa",
  "en": "Cinderslime Ingot",
  "icone": "textures/items/cl/arte/lingote_slime_brasa"
 },
 "cl:lingote_slime_cavaleiro": {
  "pt": "Lingote de Slime-Cavaleiro",
  "en": "Knightslime Ingot",
  "icone": "textures/items/cl/arte/lingote_slime_cavaleiro"
 },
 "cl:lingote_slime_rainha": {
  "pt": "Lingote de Slime da Rainha",
  "en": "Queen's Slime Ingot",
  "icone": "textures/items/cl/arte/lingote_slime_rainha"
 },
 "cl:lingote_yellorium": {
  "pt": "Lingote de Yellorium",
  "en": "Yellorium Ingot",
  "icone": "textures/items/cl/arte/lingote_yellorium"
 },
 "cl:lingote_zinco": {
  "pt": "Lingote de Zinco",
  "en": "Zinc Ingot",
  "icone": "textures/items/cl/c/lingote_zinco"
 },
 "cl:livro_powah": {
  "pt": "Livro do Powah",
  "en": "Powah Book",
  "icone": "textures/items/cl/arte/livro_powah"
 },
 "cl:lixeira": {
  "pt": "Lixeira",
  "en": "Trash Can",
  "icone": "textures/items/cl/blocos/lixeira"
 },
 "cl:lona": {
  "pt": "Lona",
  "en": "Canvas",
  "icone": "textures/items/cl/arte/lona"
 },
 "cl:macarrao_almondegas": {
  "pt": "Macarrão com Almôndegas",
  "en": "Pasta with Meatballs",
  "icone": "textures/items/cl/arte/macarrao_almondegas"
 },
 "cl:macarrao_carneiro": {
  "pt": "Macarrão com Costeleta",
  "en": "Pasta with Mutton Chop",
  "icone": "textures/items/cl/arte/macarrao_carneiro"
 },
 "cl:macarrao_cru": {
  "pt": "Macarrão Cru",
  "en": "Raw Pasta",
  "icone": "textures/items/cl/arte/macarrao_cru"
 },
 "cl:macarrao_legumes": {
  "pt": "Macarrão de Legumes",
  "en": "Vegetable Noodles",
  "icone": "textures/items/cl/arte/macarrao_legumes"
 },
 "cl:macarrao_tinta_lula": {
  "pt": "Macarrão com Tinta de Lula",
  "en": "Squid Ink Pasta",
  "icone": "textures/items/cl/arte/macarrao_tinta_lula"
 },
 "cl:machadinha_aco": {
  "pt": "Machado de Mão de Aço",
  "en": "Steel Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_aco"
 },
 "cl:machadinha_aco_slime": {
  "pt": "Machado de Mão de Aço de Slime",
  "en": "Slimesteel Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_aco_slime"
 },
 "cl:machadinha_bronze": {
  "pt": "Machado de Mão de Bronze",
  "en": "Bronze Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_bronze"
 },
 "cl:machadinha_bronze_ametista": {
  "pt": "Machado de Mão de Bronze de Ametista",
  "en": "Amethyst Bronze Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_bronze_ametista"
 },
 "cl:machadinha_cacto": {
  "pt": "Machado de Mão de Cacto",
  "en": "Cactus Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_cacto"
 },
 "cl:machadinha_cobalto": {
  "pt": "Machado de Mão de Cobalto",
  "en": "Cobalt Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_cobalto"
 },
 "cl:machadinha_cobre": {
  "pt": "Machado de Mão de Cobre",
  "en": "Copper Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_cobre"
 },
 "cl:machadinha_coro": {
  "pt": "Machado de Mão de Chorus",
  "en": "Chorus Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_coro"
 },
 "cl:machadinha_ferro": {
  "pt": "Machado de Mão de Ferro",
  "en": "Iron Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_ferro"
 },
 "cl:machadinha_ferro_porco": {
  "pt": "Machado de Mão de Ferro-Porco",
  "en": "Pig Iron Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_ferro_porco"
 },
 "cl:machadinha_hepatizon": {
  "pt": "Machado de Mão de Hepatizão",
  "en": "Hepatizon Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_hepatizon"
 },
 "cl:machadinha_madeira": {
  "pt": "Machado de Mão de Madeira",
  "en": "Wood Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_madeira"
 },
 "cl:machadinha_madeira_slime": {
  "pt": "Machado de Mão de Madeira de Slime",
  "en": "Slimewood Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_madeira_slime"
 },
 "cl:machadinha_madeira_slime_revestida": {
  "pt": "Machado de Mão de Madeira de Slime Revestida",
  "en": "Plated Slimewood Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_madeira_slime_revestida"
 },
 "cl:machadinha_madeira_tratada": {
  "pt": "Machado de Mão de Madeira Tratada",
  "en": "Treated Wood Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_madeira_tratada"
 },
 "cl:machadinha_manyullyn": {
  "pt": "Machado de Mão de Manyullyn",
  "en": "Manyullyn Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_manyullyn"
 },
 "cl:machadinha_nahuatl": {
  "pt": "Machado de Mão de Nahuatl",
  "en": "Nahuatl Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_nahuatl"
 },
 "cl:machadinha_obsidiana": {
  "pt": "Machado de Mão de Obsidiana",
  "en": "Obsidian Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_obsidiana"
 },
 "cl:machadinha_osmio": {
  "pt": "Machado de Mão de Ósmio",
  "en": "Osmium Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_osmio"
 },
 "cl:machadinha_osso": {
  "pt": "Machado de Mão de Osso",
  "en": "Bone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_osso"
 },
 "cl:machadinha_osso_blaze": {
  "pt": "Machado de Mão de Osso de Blaze",
  "en": "Blazing Bone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_osso_blaze"
 },
 "cl:machadinha_osso_necrotico": {
  "pt": "Machado de Mão de Osso Necrótico",
  "en": "Necrotic Bone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_osso_necrotico"
 },
 "cl:machadinha_osso_venenoso": {
  "pt": "Machado de Mão de Osso Venenoso",
  "en": "Venombone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_osso_venenoso"
 },
 "cl:machadinha_ouro_rosa": {
  "pt": "Machado de Mão de Ouro Rosa",
  "en": "Rose Gold Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_ouro_rosa"
 },
 "cl:machadinha_pedra": {
  "pt": "Machado de Mão de Pedra",
  "en": "Stone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_pedra"
 },
 "cl:machadinha_pedra_branca": {
  "pt": "Machado de Mão de Pedra Branca",
  "en": "Whitestone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_pedra_branca"
 },
 "cl:machadinha_pedra_chamuscada": {
  "pt": "Machado de Mão de Pedra Chamuscada",
  "en": "Scorched Stone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_pedra_chamuscada"
 },
 "cl:machadinha_pedra_refrataria": {
  "pt": "Machado de Mão de Pedra Carbonizada",
  "en": "Seared Stone Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_pedra_refrataria"
 },
 "cl:machadinha_silex": {
  "pt": "Machado de Mão de Sílex",
  "en": "Flint Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_silex"
 },
 "cl:machadinha_slime_brasa": {
  "pt": "Machado de Mão de Slime de Brasa",
  "en": "Cinderslime Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_slime_brasa"
 },
 "cl:machadinha_slime_cavaleiro": {
  "pt": "Machado de Mão de Slime-Cavaleiro",
  "en": "Knightslime Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_slime_cavaleiro"
 },
 "cl:machadinha_slime_rainha": {
  "pt": "Machado de Mão de Slime da Rainha",
  "en": "Queen's Slime Hand Axe",
  "icone": "textures/items/cl/arte/machadinha_slime_rainha"
 },
 "cl:machado_arremesso_cobalto": {
  "pt": "Machado de Arremesso de Cobalto",
  "en": "Cobalt Throwing Axe",
  "icone": "textures/items/cl/arte/machado_arremesso_cobalto"
 },
 "cl:machado_arremesso_ferro": {
  "pt": "Machado de Arremesso de Ferro",
  "en": "Iron Throwing Axe",
  "icone": "textures/items/cl/arte/machado_arremesso_ferro"
 },
 "cl:machado_arremesso_manyullyn": {
  "pt": "Machado de Arremesso de Manyullyn",
  "en": "Manyullyn Throwing Axe",
  "icone": "textures/items/cl/arte/machado_arremesso_manyullyn"
 },
 "cl:machado_arremesso_silex": {
  "pt": "Machado de Arremesso de Sílex",
  "en": "Flint Throwing Axe",
  "icone": "textures/items/cl/arte/machado_arremesso_silex"
 },
 "cl:machado_largo_aco": {
  "pt": "Machado Grande de Aço",
  "en": "Steel Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_aco"
 },
 "cl:machado_largo_aco_slime": {
  "pt": "Machado Grande de Aço de Slime",
  "en": "Slimesteel Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_aco_slime"
 },
 "cl:machado_largo_bronze": {
  "pt": "Machado Grande de Bronze",
  "en": "Bronze Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_bronze"
 },
 "cl:machado_largo_bronze_ametista": {
  "pt": "Machado Grande de Bronze de Ametista",
  "en": "Amethyst Bronze Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_bronze_ametista"
 },
 "cl:machado_largo_cacto": {
  "pt": "Machado Grande de Cacto",
  "en": "Cactus Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_cacto"
 },
 "cl:machado_largo_cobalto": {
  "pt": "Machado Grande de Cobalto",
  "en": "Cobalt Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_cobalto"
 },
 "cl:machado_largo_cobre": {
  "pt": "Machado Grande de Cobre",
  "en": "Copper Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_cobre"
 },
 "cl:machado_largo_coro": {
  "pt": "Machado Grande de Chorus",
  "en": "Chorus Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_coro"
 },
 "cl:machado_largo_ferro": {
  "pt": "Machado Grande de Ferro",
  "en": "Iron Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_ferro"
 },
 "cl:machado_largo_ferro_porco": {
  "pt": "Machado Grande de Ferro-Porco",
  "en": "Pig Iron Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_ferro_porco"
 },
 "cl:machado_largo_hepatizon": {
  "pt": "Machado Grande de Hepatizão",
  "en": "Hepatizon Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_hepatizon"
 },
 "cl:machado_largo_madeira": {
  "pt": "Machado Grande de Madeira",
  "en": "Wood Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_madeira"
 },
 "cl:machado_largo_madeira_slime": {
  "pt": "Machado Grande de Madeira de Slime",
  "en": "Slimewood Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_madeira_slime"
 },
 "cl:machado_largo_madeira_slime_revestida": {
  "pt": "Machado Grande de Madeira de Slime Revestida",
  "en": "Plated Slimewood Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_madeira_slime_revestida"
 },
 "cl:machado_largo_madeira_tratada": {
  "pt": "Machado Grande de Madeira Tratada",
  "en": "Treated Wood Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_madeira_tratada"
 },
 "cl:machado_largo_manyullyn": {
  "pt": "Machado Grande de Manyullyn",
  "en": "Manyullyn Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_manyullyn"
 },
 "cl:machado_largo_nahuatl": {
  "pt": "Machado Grande de Nahuatl",
  "en": "Nahuatl Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_nahuatl"
 },
 "cl:machado_largo_obsidiana": {
  "pt": "Machado Grande de Obsidiana",
  "en": "Obsidian Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_obsidiana"
 },
 "cl:machado_largo_osmio": {
  "pt": "Machado Grande de Ósmio",
  "en": "Osmium Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_osmio"
 },
 "cl:machado_largo_osso": {
  "pt": "Machado Grande de Osso",
  "en": "Bone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_osso"
 },
 "cl:machado_largo_osso_blaze": {
  "pt": "Machado Grande de Osso de Blaze",
  "en": "Blazing Bone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_osso_blaze"
 },
 "cl:machado_largo_osso_necrotico": {
  "pt": "Machado Grande de Osso Necrótico",
  "en": "Necrotic Bone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_osso_necrotico"
 },
 "cl:machado_largo_osso_venenoso": {
  "pt": "Machado Grande de Osso Venenoso",
  "en": "Venombone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_osso_venenoso"
 },
 "cl:machado_largo_ouro_rosa": {
  "pt": "Machado Grande de Ouro Rosa",
  "en": "Rose Gold Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_ouro_rosa"
 },
 "cl:machado_largo_pedra": {
  "pt": "Machado Grande de Pedra",
  "en": "Stone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_pedra"
 },
 "cl:machado_largo_pedra_branca": {
  "pt": "Machado Grande de Pedra Branca",
  "en": "Whitestone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_pedra_branca"
 },
 "cl:machado_largo_pedra_chamuscada": {
  "pt": "Machado Grande de Pedra Chamuscada",
  "en": "Scorched Stone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_pedra_chamuscada"
 },
 "cl:machado_largo_pedra_refrataria": {
  "pt": "Machado Grande de Pedra Carbonizada",
  "en": "Seared Stone Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_pedra_refrataria"
 },
 "cl:machado_largo_silex": {
  "pt": "Machado Grande de Sílex",
  "en": "Flint Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_silex"
 },
 "cl:machado_largo_slime_brasa": {
  "pt": "Machado Grande de Slime de Brasa",
  "en": "Cinderslime Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_slime_brasa"
 },
 "cl:machado_largo_slime_cavaleiro": {
  "pt": "Machado Grande de Slime-Cavaleiro",
  "en": "Knightslime Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_slime_cavaleiro"
 },
 "cl:machado_largo_slime_rainha": {
  "pt": "Machado Grande de Slime da Rainha",
  "en": "Queen's Slime Broad Axe",
  "icone": "textures/items/cl/arte/machado_largo_slime_rainha"
 },
 "cl:magmator_ardente": {
  "pt": "Magmator Ardente",
  "en": "Blazing Magmator",
  "icone": "textures/items/cl/blocos/magmator_ardente"
 },
 "cl:magmator_basico": {
  "pt": "Magmator Básico",
  "en": "Basic Magmator",
  "icone": "textures/items/cl/blocos/magmator_basico"
 },
 "cl:magmator_endurecido": {
  "pt": "Magmator Endurecido",
  "en": "Hardened Magmator",
  "icone": "textures/items/cl/blocos/magmator_endurecido"
 },
 "cl:magmator_espiritual": {
  "pt": "Magmator Espiritual",
  "en": "Spirited Magmator",
  "icone": "textures/items/cl/blocos/magmator_espiritual"
 },
 "cl:magmator_inicial": {
  "pt": "Magmator Inicial",
  "en": "Starter Magmator",
  "icone": "textures/items/cl/blocos/magmator_inicial"
 },
 "cl:magmator_niotico": {
  "pt": "Magmator Niótico",
  "en": "Niotic Magmator",
  "icone": "textures/items/cl/blocos/magmator_niotico"
 },
 "cl:magmator_nitro": {
  "pt": "Magmator Nitro",
  "en": "Nitro Magmator",
  "icone": "textures/items/cl/blocos/magmator_nitro"
 },
 "cl:maionese": {
  "pt": "Maionese",
  "en": "Mayonnaise",
  "icone": "textures/items/cl/arte/maionese"
 },
 "cl:malha": {
  "pt": "Malha",
  "en": "Maille",
  "icone": "textures/items/cl/c/malha"
 },
 "cl:manivela": {
  "pt": "Manivela",
  "en": "Hand Crank",
  "icone": "textures/items/cl/blocos/manivela"
 },
 "cl:manometro": {
  "pt": "Manômetro",
  "en": "Pressure Gauge",
  "icone": "textures/items/cl/arte/manometro"
 },
 "cl:manteiga": {
  "pt": "Manteiga",
  "en": "Butter",
  "icone": "textures/items/cl/arte/manteiga"
 },
 "cl:marco_destrocos": {
  "pt": "Marco de Destroços",
  "en": "Wreck Marker",
  "icone": "textures/items/cl/blocos/marco_destrocos"
 },
 "cl:marco_masmorra": {
  "pt": "Marco de Masmorra",
  "en": "Dungeon Marker",
  "icone": "textures/items/cl/blocos/marco_masmorra"
 },
 "cl:marco_masmorra_funda": {
  "pt": "Marco de Masmorra Funda",
  "en": "Deep Dungeon Marker",
  "icone": "textures/items/cl/blocos/marco_masmorra_funda"
 },
 "cl:marmore": {
  "pt": "Mármore",
  "en": "Marble",
  "icone": "textures/items/cl/blocos/marmore"
 },
 "cl:marmore_entalhado": {
  "pt": "Mármore Entalhado",
  "en": "Carved Marble",
  "icone": "textures/items/cl/blocos/marmore_entalhado"
 },
 "cl:marmore_ladrilho": {
  "pt": "Mármore Ladrilho",
  "en": "Tiles Marble",
  "icone": "textures/items/cl/blocos/marmore_ladrilho"
 },
 "cl:marmore_liso": {
  "pt": "Mármore Liso",
  "en": "Smooth Marble",
  "icone": "textures/items/cl/blocos/marmore_liso"
 },
 "cl:marmore_mosaico": {
  "pt": "Mármore Mosaico",
  "en": "Mosaic Marble",
  "icone": "textures/items/cl/blocos/marmore_mosaico"
 },
 "cl:marmore_pilar": {
  "pt": "Mármore Pilar",
  "en": "Pillar Marble",
  "icone": "textures/items/cl/blocos/marmore_pilar"
 },
 "cl:marmore_polido": {
  "pt": "Mármore Polido",
  "en": "Polished Marble",
  "icone": "textures/items/cl/blocos/marmore_polido"
 },
 "cl:marmore_tijolos": {
  "pt": "Mármore Tijolos",
  "en": "Bricks Marble",
  "icone": "textures/items/cl/blocos/marmore_tijolos"
 },
 "cl:marmore_tijolos_pequenos": {
  "pt": "Mármore Tijolinhos",
  "en": "Small Bricks Marble",
  "icone": "textures/items/cl/blocos/marmore_tijolos_pequenos"
 },
 "cl:marreta_aco": {
  "pt": "Marreta de Aço",
  "en": "Steel Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_aco"
 },
 "cl:marreta_aco_slime": {
  "pt": "Marreta de Aço de Slime",
  "en": "Slimesteel Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_aco_slime"
 },
 "cl:marreta_bronze": {
  "pt": "Marreta de Bronze",
  "en": "Bronze Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_bronze"
 },
 "cl:marreta_bronze_ametista": {
  "pt": "Marreta de Bronze de Ametista",
  "en": "Amethyst Bronze Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_bronze_ametista"
 },
 "cl:marreta_cacto": {
  "pt": "Marreta de Cacto",
  "en": "Cactus Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_cacto"
 },
 "cl:marreta_cobalto": {
  "pt": "Marreta de Cobalto",
  "en": "Cobalt Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_cobalto"
 },
 "cl:marreta_cobre": {
  "pt": "Marreta de Cobre",
  "en": "Copper Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_cobre"
 },
 "cl:marreta_coro": {
  "pt": "Marreta de Chorus",
  "en": "Chorus Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_coro"
 },
 "cl:marreta_ferro": {
  "pt": "Marreta de Ferro",
  "en": "Iron Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_ferro"
 },
 "cl:marreta_ferro_porco": {
  "pt": "Marreta de Ferro-Porco",
  "en": "Pig Iron Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_ferro_porco"
 },
 "cl:marreta_hepatizon": {
  "pt": "Marreta de Hepatizão",
  "en": "Hepatizon Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_hepatizon"
 },
 "cl:marreta_madeira": {
  "pt": "Marreta de Madeira",
  "en": "Wood Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_madeira"
 },
 "cl:marreta_madeira_slime": {
  "pt": "Marreta de Madeira de Slime",
  "en": "Slimewood Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_madeira_slime"
 },
 "cl:marreta_madeira_slime_revestida": {
  "pt": "Marreta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_madeira_slime_revestida"
 },
 "cl:marreta_madeira_tratada": {
  "pt": "Marreta de Madeira Tratada",
  "en": "Treated Wood Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_madeira_tratada"
 },
 "cl:marreta_manyullyn": {
  "pt": "Marreta de Manyullyn",
  "en": "Manyullyn Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_manyullyn"
 },
 "cl:marreta_nahuatl": {
  "pt": "Marreta de Nahuatl",
  "en": "Nahuatl Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_nahuatl"
 },
 "cl:marreta_obsidiana": {
  "pt": "Marreta de Obsidiana",
  "en": "Obsidian Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_obsidiana"
 },
 "cl:marreta_osmio": {
  "pt": "Marreta de Ósmio",
  "en": "Osmium Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_osmio"
 },
 "cl:marreta_osso": {
  "pt": "Marreta de Osso",
  "en": "Bone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_osso"
 },
 "cl:marreta_osso_blaze": {
  "pt": "Marreta de Osso de Blaze",
  "en": "Blazing Bone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_osso_blaze"
 },
 "cl:marreta_osso_necrotico": {
  "pt": "Marreta de Osso Necrótico",
  "en": "Necrotic Bone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_osso_necrotico"
 },
 "cl:marreta_osso_venenoso": {
  "pt": "Marreta de Osso Venenoso",
  "en": "Venombone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_osso_venenoso"
 },
 "cl:marreta_ouro_rosa": {
  "pt": "Marreta de Ouro Rosa",
  "en": "Rose Gold Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_ouro_rosa"
 },
 "cl:marreta_pedra": {
  "pt": "Marreta de Pedra",
  "en": "Stone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_pedra"
 },
 "cl:marreta_pedra_branca": {
  "pt": "Marreta de Pedra Branca",
  "en": "Whitestone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_pedra_branca"
 },
 "cl:marreta_pedra_chamuscada": {
  "pt": "Marreta de Pedra Chamuscada",
  "en": "Scorched Stone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_pedra_chamuscada"
 },
 "cl:marreta_pedra_refrataria": {
  "pt": "Marreta de Pedra Carbonizada",
  "en": "Seared Stone Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_pedra_refrataria"
 },
 "cl:marreta_silex": {
  "pt": "Marreta de Sílex",
  "en": "Flint Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_silex"
 },
 "cl:marreta_slime_brasa": {
  "pt": "Marreta de Slime de Brasa",
  "en": "Cinderslime Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_slime_brasa"
 },
 "cl:marreta_slime_cavaleiro": {
  "pt": "Marreta de Slime-Cavaleiro",
  "en": "Knightslime Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_slime_cavaleiro"
 },
 "cl:marreta_slime_rainha": {
  "pt": "Marreta de Slime da Rainha",
  "en": "Queen's Slime Sledge Hammer",
  "icone": "textures/items/cl/arte/marreta_slime_rainha"
 },
 "cl:martelo_cobre": {
  "pt": "Martelo de Cobre",
  "en": "Copper Hammer",
  "icone": "textures/items/cl/arte/martelo_cobre"
 },
 "cl:martelo_diamante": {
  "pt": "Martelo de Diamante",
  "en": "Diamond Hammer",
  "icone": "textures/items/cl/arte/martelo_diamante"
 },
 "cl:martelo_engenheiro": {
  "pt": "Martelo de Engenheiro",
  "en": "Engineer's Hammer",
  "icone": "textures/items/cl/c/martelo_engenheiro"
 },
 "cl:martelo_ferro": {
  "pt": "Martelo de Ferro",
  "en": "Iron Hammer",
  "icone": "textures/items/cl/arte/martelo_ferro"
 },
 "cl:martelo_madeira": {
  "pt": "Martelo de Madeira",
  "en": "Wooden Hammer",
  "icone": "textures/items/cl/arte/martelo_madeira"
 },
 "cl:martelo_ouro": {
  "pt": "Martelo de Ouro",
  "en": "Golden Hammer",
  "icone": "textures/items/cl/arte/martelo_ouro"
 },
 "cl:martelo_pedra": {
  "pt": "Martelo de Pedra",
  "en": "Stone Hammer",
  "icone": "textures/items/cl/arte/martelo_pedra"
 },
 "cl:martelo_veio_aco": {
  "pt": "Martelo de Mineração de Aço",
  "en": "Steel Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_aco"
 },
 "cl:martelo_veio_aco_slime": {
  "pt": "Martelo de Mineração de Aço de Slime",
  "en": "Slimesteel Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_aco_slime"
 },
 "cl:martelo_veio_bronze": {
  "pt": "Martelo de Mineração de Bronze",
  "en": "Bronze Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_bronze"
 },
 "cl:martelo_veio_bronze_ametista": {
  "pt": "Martelo de Mineração de Bronze de Ametista",
  "en": "Amethyst Bronze Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_bronze_ametista"
 },
 "cl:martelo_veio_cobalto": {
  "pt": "Martelo de Mineração de Cobalto",
  "en": "Cobalt Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_cobalto"
 },
 "cl:martelo_veio_cobre": {
  "pt": "Martelo de Mineração de Cobre",
  "en": "Copper Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_cobre"
 },
 "cl:martelo_veio_coro": {
  "pt": "Martelo de Mineração de Chorus",
  "en": "Chorus Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_coro"
 },
 "cl:martelo_veio_ferro": {
  "pt": "Martelo de Mineração de Ferro",
  "en": "Iron Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_ferro"
 },
 "cl:martelo_veio_ferro_porco": {
  "pt": "Martelo de Mineração de Ferro-Porco",
  "en": "Pig Iron Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_ferro_porco"
 },
 "cl:martelo_veio_hepatizon": {
  "pt": "Martelo de Mineração de Hepatizão",
  "en": "Hepatizon Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_hepatizon"
 },
 "cl:martelo_veio_madeira": {
  "pt": "Martelo de Mineração de Madeira",
  "en": "Wood Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_madeira"
 },
 "cl:martelo_veio_madeira_slime": {
  "pt": "Martelo de Mineração de Madeira de Slime",
  "en": "Slimewood Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_madeira_slime"
 },
 "cl:martelo_veio_madeira_slime_revestida": {
  "pt": "Martelo de Mineração de Madeira de Slime Revestida",
  "en": "Plated Slimewood Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_madeira_slime_revestida"
 },
 "cl:martelo_veio_madeira_tratada": {
  "pt": "Martelo de Mineração de Madeira Tratada",
  "en": "Treated Wood Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_madeira_tratada"
 },
 "cl:martelo_veio_manyullyn": {
  "pt": "Martelo de Mineração de Manyullyn",
  "en": "Manyullyn Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_manyullyn"
 },
 "cl:martelo_veio_nahuatl": {
  "pt": "Martelo de Mineração de Nahuatl",
  "en": "Nahuatl Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_nahuatl"
 },
 "cl:martelo_veio_osmio": {
  "pt": "Martelo de Mineração de Ósmio",
  "en": "Osmium Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_osmio"
 },
 "cl:martelo_veio_osso": {
  "pt": "Martelo de Mineração de Osso",
  "en": "Bone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_osso"
 },
 "cl:martelo_veio_osso_blaze": {
  "pt": "Martelo de Mineração de Osso de Blaze",
  "en": "Blazing Bone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_osso_blaze"
 },
 "cl:martelo_veio_osso_necrotico": {
  "pt": "Martelo de Mineração de Osso Necrótico",
  "en": "Necrotic Bone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_osso_necrotico"
 },
 "cl:martelo_veio_osso_venenoso": {
  "pt": "Martelo de Mineração de Osso Venenoso",
  "en": "Venombone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_osso_venenoso"
 },
 "cl:martelo_veio_ouro_rosa": {
  "pt": "Martelo de Mineração de Ouro Rosa",
  "en": "Rose Gold Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_ouro_rosa"
 },
 "cl:martelo_veio_pedra": {
  "pt": "Martelo de Mineração de Pedra",
  "en": "Stone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_pedra"
 },
 "cl:martelo_veio_pedra_branca": {
  "pt": "Martelo de Mineração de Pedra Branca",
  "en": "Whitestone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_pedra_branca"
 },
 "cl:martelo_veio_pedra_chamuscada": {
  "pt": "Martelo de Mineração de Pedra Chamuscada",
  "en": "Scorched Stone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_pedra_chamuscada"
 },
 "cl:martelo_veio_pedra_refrataria": {
  "pt": "Martelo de Mineração de Pedra Carbonizada",
  "en": "Seared Stone Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_pedra_refrataria"
 },
 "cl:martelo_veio_silex": {
  "pt": "Martelo de Mineração de Sílex",
  "en": "Flint Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_silex"
 },
 "cl:martelo_veio_slime_brasa": {
  "pt": "Martelo de Mineração de Slime de Brasa",
  "en": "Cinderslime Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_slime_brasa"
 },
 "cl:martelo_veio_slime_cavaleiro": {
  "pt": "Martelo de Mineração de Slime-Cavaleiro",
  "en": "Knightslime Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_slime_cavaleiro"
 },
 "cl:martelo_veio_slime_rainha": {
  "pt": "Martelo de Mineração de Slime da Rainha",
  "en": "Queen's Slime Vein Hammer",
  "icone": "textures/items/cl/arte/martelo_veio_slime_rainha"
 },
 "cl:mascara": {
  "pt": "Máscara de Gás",
  "en": "Gas Mask",
  "icone": "textures/items/cl/arte/mascara"
 },
 "cl:mascara_oxigenio": {
  "pt": "Máscara de Oxigênio",
  "en": "Oxygen Mask",
  "icone": "textures/items/cl/arte/mascara_oxigenio"
 },
 "cl:massa": {
  "pt": "Massa",
  "en": "Dough",
  "icone": "textures/items/cl/arte/massa"
 },
 "cl:massa_liquida": {
  "pt": "Massa Líquida",
  "en": "Batter",
  "icone": "textures/items/cl/arte/massa_liquida"
 },
 "cl:materia_vegetal_marrom": {
  "pt": "Galhos e Podas",
  "en": "Twigs and Prunings",
  "icone": "textures/items/cl/arte/materia_vegetal_marrom"
 },
 "cl:materia_vegetal_verde": {
  "pt": "Recortes e Aparas",
  "en": "Clippings and Trimmings",
  "icone": "textures/items/cl/arte/materia_vegetal_verde"
 },
 "cl:matriz_conversao": {
  "pt": "Matriz de Conversão",
  "en": "Conversion Matrix",
  "icone": "textures/items/cl/arte/matriz_conversao"
 },
 "cl:melhoria_alimentacao": {
  "pt": "Melhoria: Alimentação",
  "en": "Feeding Upgrade",
  "icone": "textures/items/cl/c/melhoria_alimentacao"
 },
 "cl:melhoria_alimentacao_avancada": {
  "pt": "Melhoria: Alimentação Avançada",
  "en": "Advanced Feeding Upgrade",
  "icone": "textures/items/cl/c/melhoria_alimentacao_avancada"
 },
 "cl:melhoria_base": {
  "pt": "Base de Melhoria",
  "en": "Upgrade Base",
  "icone": "textures/items/cl/c/melhoria_base"
 },
 "cl:melhoria_coleta": {
  "pt": "Melhoria: Coleta",
  "en": "Pickup Upgrade",
  "icone": "textures/items/cl/c/melhoria_coleta"
 },
 "cl:melhoria_compactacao": {
  "pt": "Melhoria: Compactação",
  "en": "Compacting Upgrade",
  "icone": "textures/items/cl/c/melhoria_compactacao"
 },
 "cl:melhoria_compactacao_avancada": {
  "pt": "Melhoria: Compactação Avançada",
  "en": "Advanced Compacting Upgrade",
  "icone": "textures/items/cl/c/melhoria_compactacao_avancada"
 },
 "cl:melhoria_deposito": {
  "pt": "Melhoria: Depósito",
  "en": "Deposit Upgrade",
  "icone": "textures/items/cl/c/melhoria_deposito"
 },
 "cl:melhoria_fornalha": {
  "pt": "Melhoria: Fornalha",
  "en": "Smelting Upgrade",
  "icone": "textures/items/cl/c/melhoria_fornalha"
 },
 "cl:melhoria_fundicao_auto": {
  "pt": "Melhoria: Fornalha Automática",
  "en": "Auto-Smelting Upgrade",
  "icone": "textures/items/cl/c/melhoria_fundicao_auto"
 },
 "cl:melhoria_ima": {
  "pt": "Melhoria: Ímã",
  "en": "Magnet Upgrade",
  "icone": "textures/items/cl/c/melhoria_ima"
 },
 "cl:melhoria_ima_avancada": {
  "pt": "Melhoria: Ímã Avançado",
  "en": "Advanced Magnet Upgrade",
  "icone": "textures/items/cl/c/melhoria_ima_avancada"
 },
 "cl:melhoria_reabastecer": {
  "pt": "Melhoria: Reabastecer",
  "en": "Restock Upgrade",
  "icone": "textures/items/cl/c/melhoria_reabastecer"
 },
 "cl:melhoria_recarga": {
  "pt": "Melhoria: Reposição",
  "en": "Refill Upgrade",
  "icone": "textures/items/cl/c/melhoria_recarga"
 },
 "cl:mesa_fundicao": {
  "pt": "Mesa de Fundição",
  "en": "Casting Table",
  "icone": "textures/items/cl/blocos/mesa_fundicao"
 },
 "cl:mesa_fundicao_chamuscada": {
  "pt": "Mesa de Fundição Chamuscada",
  "en": "Scorched Casting Table",
  "icone": "textures/blocks/cl/arte/mesa_fundicao_chamuscada_topo"
 },
 "cl:mesa_moldes": {
  "pt": "Mesa de Moldes",
  "en": "Stencil Table",
  "icone": "textures/items/cl/blocos/mesa_moldes"
 },
 "cl:meteorito": {
  "pt": "Rocha de Meteorito",
  "en": "Meteorite Rock",
  "icone": "textures/items/cl/blocos/meteorito"
 },
 "cl:milho": {
  "pt": "Milho",
  "en": "Corn",
  "icone": "textures/items/cl/arte/milho"
 },
 "cl:milho_espiga": {
  "pt": "Milho na Espiga",
  "en": "Corn on the Cob",
  "icone": "textures/items/cl/arte/milho_espiga"
 },
 "cl:minerio_cobalto": {
  "pt": "Minério de Cobalto",
  "en": "Cobalt Ore",
  "icone": "textures/blocks/cl/arte/minerio_cobalto"
 },
 "cl:minerio_cobre_lunar": {
  "pt": "Minério de Cobre Lunar",
  "en": "Moon Copper Ore",
  "icone": "textures/items/cl/blocos/minerio_cobre_lunar"
 },
 "cl:minerio_estanho_lunar": {
  "pt": "Minério de Estanho Lunar",
  "en": "Moon Tin Ore",
  "icone": "textures/items/cl/blocos/minerio_estanho_lunar"
 },
 "cl:minerio_queijo": {
  "pt": "Minério de Queijo",
  "en": "Cheese Ore",
  "icone": "textures/items/cl/blocos/minerio_queijo"
 },
 "cl:misturador_mecanico": {
  "pt": "Misturador Mecânico",
  "en": "Mechanical Mixer",
  "icone": "textures/items/cl/blocos/misturador_mecanico"
 },
 "cl:mk_botas_aco": {
  "pt": "Botas de Aço",
  "en": "Steel Boots",
  "icone": "textures/items/cl/arte/mk_botas_aco"
 },
 "cl:mk_botas_bronze": {
  "pt": "Botas de Bronze",
  "en": "Bronze Boots",
  "icone": "textures/items/cl/arte/mk_botas_bronze"
 },
 "cl:mk_botas_glowstone": {
  "pt": "Botas de Glowstone Refinada",
  "en": "Refined Glowstone Boots",
  "icone": "textures/items/cl/arte/mk_botas_glowstone"
 },
 "cl:mk_botas_lapis": {
  "pt": "Botas de Lápis-Lazúli",
  "en": "Lapis Lazuli Boots",
  "icone": "textures/items/cl/arte/mk_botas_lapis"
 },
 "cl:mk_botas_obsidiana": {
  "pt": "Botas de Obsidiana Refinada",
  "en": "Refined Obsidian Boots",
  "icone": "textures/items/cl/arte/mk_botas_obsidiana"
 },
 "cl:mk_botas_osmio": {
  "pt": "Botas de Ósmio",
  "en": "Osmium Boots",
  "icone": "textures/items/cl/arte/mk_botas_osmio"
 },
 "cl:mk_calcas_aco": {
  "pt": "Calças de Aço",
  "en": "Steel Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_aco"
 },
 "cl:mk_calcas_bronze": {
  "pt": "Calças de Bronze",
  "en": "Bronze Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_bronze"
 },
 "cl:mk_calcas_glowstone": {
  "pt": "Calças de Glowstone Refinada",
  "en": "Refined Glowstone Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_glowstone"
 },
 "cl:mk_calcas_lapis": {
  "pt": "Calças de Lápis-Lazúli",
  "en": "Lapis Lazuli Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_lapis"
 },
 "cl:mk_calcas_obsidiana": {
  "pt": "Calças de Obsidiana Refinada",
  "en": "Refined Obsidian Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_obsidiana"
 },
 "cl:mk_calcas_osmio": {
  "pt": "Calças de Ósmio",
  "en": "Osmium Leggings",
  "icone": "textures/items/cl/arte/mk_calcas_osmio"
 },
 "cl:mk_capacete_aco": {
  "pt": "Capacete de Aço",
  "en": "Steel Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_aco"
 },
 "cl:mk_capacete_bronze": {
  "pt": "Capacete de Bronze",
  "en": "Bronze Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_bronze"
 },
 "cl:mk_capacete_glowstone": {
  "pt": "Capacete de Glowstone Refinada",
  "en": "Refined Glowstone Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_glowstone"
 },
 "cl:mk_capacete_lapis": {
  "pt": "Capacete de Lápis-Lazúli",
  "en": "Lapis Lazuli Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_lapis"
 },
 "cl:mk_capacete_obsidiana": {
  "pt": "Capacete de Obsidiana Refinada",
  "en": "Refined Obsidian Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_obsidiana"
 },
 "cl:mk_capacete_osmio": {
  "pt": "Capacete de Ósmio",
  "en": "Osmium Helmet",
  "icone": "textures/items/cl/arte/mk_capacete_osmio"
 },
 "cl:mk_enxada_aco": {
  "pt": "Enxada de Aço",
  "en": "Steel Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_aco"
 },
 "cl:mk_enxada_bronze": {
  "pt": "Enxada de Bronze",
  "en": "Bronze Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_bronze"
 },
 "cl:mk_enxada_glowstone": {
  "pt": "Enxada de Glowstone Refinada",
  "en": "Refined Glowstone Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_glowstone"
 },
 "cl:mk_enxada_lapis": {
  "pt": "Enxada de Lápis-Lazúli",
  "en": "Lapis Lazuli Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_lapis"
 },
 "cl:mk_enxada_obsidiana": {
  "pt": "Enxada de Obsidiana Refinada",
  "en": "Refined Obsidian Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_obsidiana"
 },
 "cl:mk_enxada_osmio": {
  "pt": "Enxada de Ósmio",
  "en": "Osmium Hoe",
  "icone": "textures/items/cl/arte/mk_enxada_osmio"
 },
 "cl:mk_espada_aco": {
  "pt": "Espada de Aço",
  "en": "Steel Sword",
  "icone": "textures/items/cl/arte/mk_espada_aco"
 },
 "cl:mk_espada_bronze": {
  "pt": "Espada de Bronze",
  "en": "Bronze Sword",
  "icone": "textures/items/cl/arte/mk_espada_bronze"
 },
 "cl:mk_espada_glowstone": {
  "pt": "Espada de Glowstone Refinada",
  "en": "Refined Glowstone Sword",
  "icone": "textures/items/cl/arte/mk_espada_glowstone"
 },
 "cl:mk_espada_lapis": {
  "pt": "Espada de Lápis-Lazúli",
  "en": "Lapis Lazuli Sword",
  "icone": "textures/items/cl/arte/mk_espada_lapis"
 },
 "cl:mk_espada_obsidiana": {
  "pt": "Espada de Obsidiana Refinada",
  "en": "Refined Obsidian Sword",
  "icone": "textures/items/cl/arte/mk_espada_obsidiana"
 },
 "cl:mk_espada_osmio": {
  "pt": "Espada de Ósmio",
  "en": "Osmium Sword",
  "icone": "textures/items/cl/arte/mk_espada_osmio"
 },
 "cl:mk_machado_aco": {
  "pt": "Machado de Aço",
  "en": "Steel Axe",
  "icone": "textures/items/cl/arte/mk_machado_aco"
 },
 "cl:mk_machado_bronze": {
  "pt": "Machado de Bronze",
  "en": "Bronze Axe",
  "icone": "textures/items/cl/arte/mk_machado_bronze"
 },
 "cl:mk_machado_glowstone": {
  "pt": "Machado de Glowstone Refinada",
  "en": "Refined Glowstone Axe",
  "icone": "textures/items/cl/arte/mk_machado_glowstone"
 },
 "cl:mk_machado_lapis": {
  "pt": "Machado de Lápis-Lazúli",
  "en": "Lapis Lazuli Axe",
  "icone": "textures/items/cl/arte/mk_machado_lapis"
 },
 "cl:mk_machado_obsidiana": {
  "pt": "Machado de Obsidiana Refinada",
  "en": "Refined Obsidian Axe",
  "icone": "textures/items/cl/arte/mk_machado_obsidiana"
 },
 "cl:mk_machado_osmio": {
  "pt": "Machado de Ósmio",
  "en": "Osmium Axe",
  "icone": "textures/items/cl/arte/mk_machado_osmio"
 },
 "cl:mk_pa_aco": {
  "pt": "Pá de Aço",
  "en": "Steel Shovel",
  "icone": "textures/items/cl/arte/mk_pa_aco"
 },
 "cl:mk_pa_bronze": {
  "pt": "Pá de Bronze",
  "en": "Bronze Shovel",
  "icone": "textures/items/cl/arte/mk_pa_bronze"
 },
 "cl:mk_pa_glowstone": {
  "pt": "Pá de Glowstone Refinada",
  "en": "Refined Glowstone Shovel",
  "icone": "textures/items/cl/arte/mk_pa_glowstone"
 },
 "cl:mk_pa_lapis": {
  "pt": "Pá de Lápis-Lazúli",
  "en": "Lapis Lazuli Shovel",
  "icone": "textures/items/cl/arte/mk_pa_lapis"
 },
 "cl:mk_pa_obsidiana": {
  "pt": "Pá de Obsidiana Refinada",
  "en": "Refined Obsidian Shovel",
  "icone": "textures/items/cl/arte/mk_pa_obsidiana"
 },
 "cl:mk_pa_osmio": {
  "pt": "Pá de Ósmio",
  "en": "Osmium Shovel",
  "icone": "textures/items/cl/arte/mk_pa_osmio"
 },
 "cl:mk_paxel_aco": {
  "pt": "Paxel de Aço",
  "en": "Steel Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_aco"
 },
 "cl:mk_paxel_bronze": {
  "pt": "Paxel de Bronze",
  "en": "Bronze Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_bronze"
 },
 "cl:mk_paxel_diamante": {
  "pt": "Paxel de Diamante",
  "en": "Diamond Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_diamante"
 },
 "cl:mk_paxel_ferro": {
  "pt": "Paxel de Ferro",
  "en": "Iron Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_ferro"
 },
 "cl:mk_paxel_glowstone": {
  "pt": "Paxel de Glowstone Refinada",
  "en": "Refined Glowstone Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_glowstone"
 },
 "cl:mk_paxel_lapis": {
  "pt": "Paxel de Lápis-Lazúli",
  "en": "Lapis Lazuli Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_lapis"
 },
 "cl:mk_paxel_madeira": {
  "pt": "Paxel de Madeira",
  "en": "Wooden Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_madeira"
 },
 "cl:mk_paxel_obsidiana": {
  "pt": "Paxel de Obsidiana Refinada",
  "en": "Refined Obsidian Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_obsidiana"
 },
 "cl:mk_paxel_osmio": {
  "pt": "Paxel de Ósmio",
  "en": "Osmium Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_osmio"
 },
 "cl:mk_paxel_ouro": {
  "pt": "Paxel de Ouro",
  "en": "Golden Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_ouro"
 },
 "cl:mk_paxel_pedra": {
  "pt": "Paxel de Pedra",
  "en": "Stone Paxel",
  "icone": "textures/items/cl/arte/mk_paxel_pedra"
 },
 "cl:mk_peitoral_aco": {
  "pt": "Peitoral de Aço",
  "en": "Steel Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_aco"
 },
 "cl:mk_peitoral_bronze": {
  "pt": "Peitoral de Bronze",
  "en": "Bronze Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_bronze"
 },
 "cl:mk_peitoral_glowstone": {
  "pt": "Peitoral de Glowstone Refinada",
  "en": "Refined Glowstone Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_glowstone"
 },
 "cl:mk_peitoral_lapis": {
  "pt": "Peitoral de Lápis-Lazúli",
  "en": "Lapis Lazuli Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_lapis"
 },
 "cl:mk_peitoral_obsidiana": {
  "pt": "Peitoral de Obsidiana Refinada",
  "en": "Refined Obsidian Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_obsidiana"
 },
 "cl:mk_peitoral_osmio": {
  "pt": "Peitoral de Ósmio",
  "en": "Osmium Chestplate",
  "icone": "textures/items/cl/arte/mk_peitoral_osmio"
 },
 "cl:mk_picareta_aco": {
  "pt": "Picareta de Aço",
  "en": "Steel Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_aco"
 },
 "cl:mk_picareta_bronze": {
  "pt": "Picareta de Bronze",
  "en": "Bronze Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_bronze"
 },
 "cl:mk_picareta_glowstone": {
  "pt": "Picareta de Glowstone Refinada",
  "en": "Refined Glowstone Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_glowstone"
 },
 "cl:mk_picareta_lapis": {
  "pt": "Picareta de Lápis-Lazúli",
  "en": "Lapis Lazuli Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_lapis"
 },
 "cl:mk_picareta_obsidiana": {
  "pt": "Picareta de Obsidiana Refinada",
  "en": "Refined Obsidian Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_obsidiana"
 },
 "cl:mk_picareta_osmio": {
  "pt": "Picareta de Ósmio",
  "en": "Osmium Pickaxe",
  "icone": "textures/items/cl/arte/mk_picareta_osmio"
 },
 "cl:mo": {
  "pt": "Mó",
  "en": "Millstone",
  "icone": "textures/items/cl/blocos/mo"
 },
 "cl:mochila": {
  "pt": "Mochila",
  "en": "Backpack",
  "icone": "textures/items/cl/c/mochila"
 },
 "cl:mochila_cobre": {
  "pt": "Mochila de Cobre",
  "en": "Copper Backpack",
  "icone": "textures/items/cl/c/mochila_cobre"
 },
 "cl:mochila_diamante": {
  "pt": "Mochila de Diamante",
  "en": "Diamond Backpack",
  "icone": "textures/items/cl/c/mochila_diamante"
 },
 "cl:mochila_ferro": {
  "pt": "Mochila de Ferro",
  "en": "Iron Backpack",
  "icone": "textures/items/cl/c/mochila_ferro"
 },
 "cl:mochila_netherite": {
  "pt": "Mochila de Netherita",
  "en": "Netherite Backpack",
  "icone": "textures/items/cl/c/mochila_netherite"
 },
 "cl:mochila_ouro": {
  "pt": "Mochila de Ouro",
  "en": "Gold Backpack",
  "icone": "textures/items/cl/c/mochila_ouro"
 },
 "cl:moinho": {
  "pt": "Moinho de Vento",
  "en": "Windmill",
  "icone": "textures/items/cl/arte/blocos/moinho"
 },
 "cl:moinho_sag": {
  "pt": "Triturador SAG",
  "en": "SAG Mill",
  "icone": "textures/items/cl/blocos/moinho_sag"
 },
 "cl:moinho_vento": {
  "pt": "Moinho de Vento",
  "en": "Windmill",
  "icone": "textures/items/cl/blocos/moinho_vento"
 },
 "cl:molde_areia_cabeca_enxo": {
  "pt": "Molde de Areia: Cabeça de Enxó",
  "en": "Adze Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_enxo"
 },
 "cl:molde_areia_cabeca_machado": {
  "pt": "Molde de Areia: Cabeça de Machado Pequeno",
  "en": "Small Axe Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_machado"
 },
 "cl:molde_areia_cabeca_machado_larga": {
  "pt": "Molde de Areia: Cabeça de Machado Grande",
  "en": "Broad Axe Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_machado_larga"
 },
 "cl:molde_areia_cabeca_martelo": {
  "pt": "Molde de Areia: Cabeça de Martelo",
  "en": "Hammer Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_martelo"
 },
 "cl:molde_areia_cabeca_pa": {
  "pt": "Molde de Areia: Cabeça de Pá",
  "en": "Shovel Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_pa"
 },
 "cl:molde_areia_cabeca_picareta": {
  "pt": "Molde de Areia: Cabeça de Picareta",
  "en": "Pick Head Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabeca_picareta"
 },
 "cl:molde_areia_cabo": {
  "pt": "Molde de Areia: Cabo de Ferramenta",
  "en": "Tool Handle Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabo"
 },
 "cl:molde_areia_cabo_resistente": {
  "pt": "Molde de Areia: Cabo Resistente",
  "en": "Tough Handle Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_cabo_resistente"
 },
 "cl:molde_areia_guarda_larga": {
  "pt": "Molde de Areia: Guarda Larga",
  "en": "Wide Guard Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_guarda_larga"
 },
 "cl:molde_areia_lamina_espada": {
  "pt": "Molde de Areia: Lâmina Pequena",
  "en": "Small Blade Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_lamina_espada"
 },
 "cl:molde_areia_lamina_larga": {
  "pt": "Molde de Areia: Lâmina Grande",
  "en": "Broad Blade Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_lamina_larga"
 },
 "cl:molde_areia_ligacao": {
  "pt": "Molde de Areia: Ligamento de Ferramenta",
  "en": "Tool Binding Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_ligacao"
 },
 "cl:molde_areia_ligacao_resistente": {
  "pt": "Molde de Areia: Colar Resistente",
  "en": "Tough Collar Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_ligacao_resistente"
 },
 "cl:molde_areia_lingote": {
  "pt": "Molde de Areia: Lingote",
  "en": "Ingot Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_lingote"
 },
 "cl:molde_areia_placa_grande": {
  "pt": "Molde de Areia: Placa Grande",
  "en": "Large Plate Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_placa_grande"
 },
 "cl:molde_areia_travessa": {
  "pt": "Molde de Areia: Travessa",
  "en": "Crossbar Sand Cast",
  "icone": "textures/items/cl/c/molde_areia_travessa"
 },
 "cl:molde_cabeca_enxo": {
  "pt": "Molde: Cabeça de Enxó",
  "en": "Adze Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_enxo"
 },
 "cl:molde_cabeca_machado": {
  "pt": "Molde: Cabeça de Machado Pequeno",
  "en": "Small Axe Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_machado"
 },
 "cl:molde_cabeca_machado_larga": {
  "pt": "Molde: Cabeça de Machado Grande",
  "en": "Broad Axe Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_machado_larga"
 },
 "cl:molde_cabeca_martelo": {
  "pt": "Molde: Cabeça de Martelo",
  "en": "Hammer Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_martelo"
 },
 "cl:molde_cabeca_pa": {
  "pt": "Molde: Cabeça de Pá",
  "en": "Shovel Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_pa"
 },
 "cl:molde_cabeca_picareta": {
  "pt": "Molde: Cabeça de Picareta",
  "en": "Pick Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_picareta"
 },
 "cl:molde_cabo": {
  "pt": "Molde: Cabo de Ferramenta",
  "en": "Tool Handle Cast",
  "icone": "textures/items/cl/arte/molde_cabo"
 },
 "cl:molde_cabo_resistente": {
  "pt": "Molde: Cabo Resistente",
  "en": "Tough Handle Cast",
  "icone": "textures/items/cl/c/molde_cabo_resistente"
 },
 "cl:molde_guarda_larga": {
  "pt": "Molde: Guarda Larga",
  "en": "Wide Guard Cast",
  "icone": "textures/items/cl/arte/molde_guarda_larga"
 },
 "cl:molde_lamina_espada": {
  "pt": "Molde: Lâmina Pequena",
  "en": "Small Blade Cast",
  "icone": "textures/items/cl/arte/molde_lamina_espada"
 },
 "cl:molde_lamina_larga": {
  "pt": "Molde: Lâmina Grande",
  "en": "Broad Blade Cast",
  "icone": "textures/items/cl/c/molde_lamina_larga"
 },
 "cl:molde_ligacao": {
  "pt": "Molde: Ligamento de Ferramenta",
  "en": "Tool Binding Cast",
  "icone": "textures/items/cl/arte/molde_ligacao"
 },
 "cl:molde_ligacao_resistente": {
  "pt": "Molde: Colar Resistente",
  "en": "Tough Collar Cast",
  "icone": "textures/items/cl/c/molde_ligacao_resistente"
 },
 "cl:molde_lingote": {
  "pt": "Molde de Lingote",
  "en": "Ingot Cast",
  "icone": "textures/items/cl/arte/molde_lingote"
 },
 "cl:molde_pepita": {
  "pt": "Molde de Pepita",
  "en": "Nugget Cast",
  "icone": "textures/items/cl/arte/molde_pepita"
 },
 "cl:molde_placa_grande": {
  "pt": "Molde: Placa Grande",
  "en": "Large Plate Cast",
  "icone": "textures/items/cl/c/molde_placa_grande"
 },
 "cl:molde_travessa": {
  "pt": "Molde: Travessa",
  "en": "Crossbar Cast",
  "icone": "textures/items/cl/arte/molde_travessa"
 },
 "cl:molho_tomate": {
  "pt": "Molho de Tomate",
  "en": "Tomato Sauce",
  "icone": "textures/items/cl/arte/molho_tomate"
 },
 "cl:montador_molecular": {
  "pt": "Montador Molecular",
  "en": "Molecular Assembler",
  "icone": "textures/items/cl/blocos/montador_molecular"
 },
 "cl:montadora": {
  "pt": "Montadora",
  "en": "Assembler",
  "icone": "textures/items/cl/arte/blocos/montadora"
 },
 "cl:motor_aeronave": {
  "pt": "Motor",
  "en": "Engine",
  "icone": "textures/items/cl/arte/motor_aeronave"
 },
 "cl:motor_almas": {
  "pt": "Motor de Almas",
  "en": "Soul Engine",
  "icone": "textures/items/cl/blocos/motor_almas"
 },
 "cl:motor_combustao": {
  "pt": "Motor a Combustão",
  "en": "Combustion Engine",
  "icone": "textures/items/cl/arte/blocos/motor_combustao"
 },
 "cl:motor_foguete": {
  "pt": "Motor do Foguete Tier 1",
  "en": "Tier 1 Rocket Engine",
  "icone": "textures/items/cl/arte/motor_foguete"
 },
 "cl:motor_nave": {
  "pt": "Motor da Nave",
  "en": "Ship Engine",
  "icone": "textures/items/cl/arte/motor_nave"
 },
 "cl:muda_slime_ceu": {
  "pt": "Muda de Slime-do-Céu",
  "en": "Skyslime Sapling",
  "icone": "textures/blocks/cl/arte/muda_slime_ceu"
 },
 "cl:muda_slime_ender": {
  "pt": "Muda de Slime-do-Ender",
  "en": "Enderslime Sapling",
  "icone": "textures/blocks/cl/arte/muda_slime_ender"
 },
 "cl:muda_slime_icor": {
  "pt": "Muda de Icor",
  "en": "Ichor Sapling",
  "icone": "textures/blocks/cl/arte/muda_slime_icor"
 },
 "cl:muda_slime_sangue": {
  "pt": "Muda de Sangue",
  "en": "Blood Sapling",
  "icone": "textures/blocks/cl/arte/muda_slime_sangue"
 },
 "cl:muda_slime_terra": {
  "pt": "Muda de Slime-da-Terra",
  "en": "Earthslime Sapling",
  "icone": "textures/blocks/cl/arte/muda_slime_terra"
 },
 "cl:muda_tamareira": {
  "pt": "Muda de Tamareira",
  "en": "Date Palm Sapling",
  "icone": "textures/items/cl/blocos/muda_tamareira"
 },
 "cl:nahuatl": {
  "pt": "Nahuatl",
  "en": "Nahuatl",
  "icone": "textures/blocks/cl/arte/nahuatl"
 },
 "cl:nucleo_aniquilacao": {
  "pt": "Núcleo de Aniquilação",
  "en": "Annihilation Core",
  "icone": "textures/items/cl/arte/nucleo_aniquilacao"
 },
 "cl:nucleo_eletrolitico": {
  "pt": "Núcleo Eletrolítico",
  "en": "Electrolytic Core",
  "icone": "textures/items/cl/arte/nucleo_eletrolitico"
 },
 "cl:nucleo_ender": {
  "pt": "Núcleo Ender",
  "en": "Ender Core",
  "icone": "textures/items/cl/arte/nucleo_ender"
 },
 "cl:nucleo_formacao": {
  "pt": "Núcleo de Formação",
  "en": "Formation Core",
  "icone": "textures/items/cl/arte/nucleo_formacao"
 },
 "cl:nucleo_funil": {
  "pt": "Núcleo de Funil",
  "en": "Hopper Core",
  "icone": "textures/items/cl/arte/nucleo_funil"
 },
 "cl:nucleo_salto": {
  "pt": "Núcleo de Salto",
  "en": "Jump Core",
  "icone": "textures/items/cl/c/nucleo_salto"
 },
 "cl:nucleo_sync": {
  "pt": "Núcleo Sync",
  "en": "Sync Core",
  "icone": "textures/items/cl/arte/nucleo_sync"
 },
 "cl:obelisco_atracao": {
  "pt": "Obelisco de Atração",
  "en": "Attractor Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_atracao"
 },
 "cl:obelisco_aversao": {
  "pt": "Obelisco de Aversão",
  "en": "Aversion Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_aversao"
 },
 "cl:obelisco_climatico": {
  "pt": "Obelisco Climático",
  "en": "Weather Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_climatico"
 },
 "cl:obelisco_inibicao": {
  "pt": "Obelisco de Inibição",
  "en": "Inhibitor Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_inibicao"
 },
 "cl:obelisco_relocacao": {
  "pt": "Obelisco de Relocação",
  "en": "Relocator Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_relocacao"
 },
 "cl:obelisco_xp": {
  "pt": "Obelisco de XP",
  "en": "XP Obelisk",
  "icone": "textures/items/cl/blocos/obelisco_xp"
 },
 "cl:obsidiana_refinada_enriquecida": {
  "pt": "Obsidiana Enriquecida",
  "en": "Enriched Obsidian",
  "icone": "textures/items/cl/arte/obsidiana_refinada_enriquecida"
 },
 "cl:obsidiana_reforcada": {
  "pt": "Obsidiana Reforçada",
  "en": "Reinforced Obsidian",
  "icone": "textures/items/cl/blocos/obsidiana_reforcada"
 },
 "cl:omelete": {
  "pt": "Omelete",
  "en": "Omelet",
  "icone": "textures/items/cl/arte/omelete"
 },
 "cl:orbe_energizador": {
  "pt": "Orbe Energizador",
  "en": "Energizing Orb",
  "icone": "textures/items/cl/blocos/orbe_energizador"
 },
 "cl:organizador": {
  "pt": "Organizador",
  "en": "Organizer",
  "icone": "textures/items/cl/arte/organizador"
 },
 "cl:osmio_po": {
  "pt": "Pó de Minério de Ósmio",
  "en": "Powdered Osmium Ore",
  "icone": "textures/items/cl/c/osmio_po"
 },
 "cl:osmio_quebrado": {
  "pt": "Pedaço Quebrado de Ósmio",
  "en": "Broken Osmium Ore",
  "icone": "textures/items/cl/c/osmio_quebrado"
 },
 "cl:osmio_triturado": {
  "pt": "Pedaço Triturado de Ósmio",
  "en": "Crushed Osmium Ore",
  "icone": "textures/items/cl/c/osmio_triturado"
 },
 "cl:osso_blaze": {
  "pt": "Osso de Blaze",
  "en": "Blazing Bone",
  "icone": "textures/items/cl/arte/osso_blaze"
 },
 "cl:osso_necrotico": {
  "pt": "Osso Necrótico",
  "en": "Necrotic Bone",
  "icone": "textures/items/cl/arte/osso_necrotico"
 },
 "cl:osso_venenoso": {
  "pt": "Osso Venenoso",
  "en": "Venombone",
  "icone": "textures/items/cl/arte/osso_venenoso"
 },
 "cl:ouro_enriquecido": {
  "pt": "Ouro Enriquecido",
  "en": "Enriched Gold",
  "icone": "textures/items/cl/arte/ouro_enriquecido"
 },
 "cl:ouro_po": {
  "pt": "Pó de Minério de Ouro",
  "en": "Powdered Gold Ore",
  "icone": "textures/items/cl/arte/ouro_po"
 },
 "cl:ouro_quebrado": {
  "pt": "Pedaço Quebrado de Ouro",
  "en": "Broken Gold Ore",
  "icone": "textures/items/cl/arte/ouro_quebrado"
 },
 "cl:ouro_triturado": {
  "pt": "Pedaço Triturado de Ouro",
  "en": "Crushed Gold Ore",
  "icone": "textures/items/cl/arte/ouro_triturado"
 },
 "cl:ovo_cozido": {
  "pt": "Ovo Cozido",
  "en": "Boiled Egg",
  "icone": "textures/items/cl/arte/ovo_cozido"
 },
 "cl:ovo_frito": {
  "pt": "Ovo Frito",
  "en": "Fried Egg",
  "icone": "textures/items/cl/arte/ovo_frito"
 },
 "cl:pa_aco": {
  "pt": "Pá de Aço",
  "en": "Steel Shovel",
  "icone": "textures/items/cl/arte/pa_aco"
 },
 "cl:pa_bronze": {
  "pt": "Pá de Bronze",
  "en": "Bronze Shovel",
  "icone": "textures/items/cl/arte/pa_bronze"
 },
 "cl:pa_bronze_ametista": {
  "pt": "Pá de Bronze de Ametista",
  "en": "Amethyst Bronze Shovel",
  "icone": "textures/items/cl/arte/pa_bronze_ametista"
 },
 "cl:pa_cacto": {
  "pt": "Pá de Cacto",
  "en": "Cactus Shovel",
  "icone": "textures/items/cl/arte/pa_cacto"
 },
 "cl:pa_cobre": {
  "pt": "Pá de Cobre",
  "en": "Copper Shovel",
  "icone": "textures/items/cl/arte/pa_cobre"
 },
 "cl:pa_ferro": {
  "pt": "Pá de Ferro",
  "en": "Iron Shovel",
  "icone": "textures/items/cl/arte/pa_ferro"
 },
 "cl:pa_madeira": {
  "pt": "Pá de Madeira",
  "en": "Wood Shovel",
  "icone": "textures/items/cl/arte/pa_madeira"
 },
 "cl:pa_moinho": {
  "pt": "Pá de Moinho",
  "en": "Windmill Blade",
  "icone": "textures/items/cl/c/pa_moinho"
 },
 "cl:pa_obsidiana": {
  "pt": "Pá de Obsidiana",
  "en": "Obsidian Shovel",
  "icone": "textures/items/cl/arte/pa_obsidiana"
 },
 "cl:pa_osso": {
  "pt": "Pá de Osso",
  "en": "Bone Shovel",
  "icone": "textures/items/cl/arte/pa_osso"
 },
 "cl:pa_ouro_rosa": {
  "pt": "Pá de Ouro Rosa",
  "en": "Rose Gold Shovel",
  "icone": "textures/items/cl/arte/pa_ouro_rosa"
 },
 "cl:pa_pedra": {
  "pt": "Pá de Pedra",
  "en": "Stone Shovel",
  "icone": "textures/items/cl/arte/pa_pedra"
 },
 "cl:pa_silex": {
  "pt": "Pá de Sílex",
  "en": "Flint Shovel",
  "icone": "textures/items/cl/arte/pa_silex"
 },
 "cl:padrao_branco": {
  "pt": "Padrão em Branco",
  "en": "Blank Pattern",
  "icone": "textures/items/cl/arte/padrao_branco"
 },
 "cl:padrao_cabeca_enxo": {
  "pt": "Padrão: Cabeça de Enxó",
  "en": "Adze Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_enxo"
 },
 "cl:padrao_cabeca_machado": {
  "pt": "Padrão: Cabeça de Machado Pequeno",
  "en": "Small Axe Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_machado"
 },
 "cl:padrao_cabeca_machado_larga": {
  "pt": "Padrão: Cabeça de Machado Grande",
  "en": "Broad Axe Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_machado_larga"
 },
 "cl:padrao_cabeca_martelo": {
  "pt": "Padrão: Cabeça de Martelo",
  "en": "Hammer Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_martelo"
 },
 "cl:padrao_cabeca_pa": {
  "pt": "Padrão: Cabeça de Pá",
  "en": "Shovel Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_pa"
 },
 "cl:padrao_cabeca_picareta": {
  "pt": "Padrão: Cabeça de Picareta",
  "en": "Pick Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_picareta"
 },
 "cl:padrao_cabo": {
  "pt": "Padrão: Cabo de Ferramenta",
  "en": "Tool Handle Pattern",
  "icone": "textures/items/cl/arte/padrao_cabo"
 },
 "cl:padrao_cabo_resistente": {
  "pt": "Padrão: Cabo Resistente",
  "en": "Tough Handle Pattern",
  "icone": "textures/items/cl/c/padrao_cabo_resistente"
 },
 "cl:padrao_guarda_larga": {
  "pt": "Padrão: Guarda Larga",
  "en": "Wide Guard Pattern",
  "icone": "textures/items/cl/arte/padrao_guarda_larga"
 },
 "cl:padrao_lamina_espada": {
  "pt": "Padrão: Lâmina Pequena",
  "en": "Small Blade Pattern",
  "icone": "textures/items/cl/arte/padrao_lamina_espada"
 },
 "cl:padrao_lamina_larga": {
  "pt": "Padrão: Lâmina Grande",
  "en": "Broad Blade Pattern",
  "icone": "textures/items/cl/c/padrao_lamina_larga"
 },
 "cl:padrao_ligacao": {
  "pt": "Padrão: Ligamento de Ferramenta",
  "en": "Tool Binding Pattern",
  "icone": "textures/items/cl/arte/padrao_ligacao"
 },
 "cl:padrao_ligacao_resistente": {
  "pt": "Padrão: Colar Resistente",
  "en": "Tough Collar Pattern",
  "icone": "textures/items/cl/c/padrao_ligacao_resistente"
 },
 "cl:padrao_me_vazio": {
  "pt": "Padrão em Branco",
  "en": "Blank Pattern",
  "icone": "textures/items/cl/arte/padrao_me_vazio"
 },
 "cl:padrao_placa_grande": {
  "pt": "Padrão: Placa Grande",
  "en": "Large Plate Pattern",
  "icone": "textures/items/cl/c/padrao_placa_grande"
 },
 "cl:padrao_travessa": {
  "pt": "Padrão: Travessa",
  "en": "Crossbar Pattern",
  "icone": "textures/items/cl/arte/padrao_travessa"
 },
 "cl:painel_brilhante_amarelo": {
  "pt": "Painel Brilhante Amarelo",
  "en": "Yellow Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_amarelo"
 },
 "cl:painel_brilhante_azul": {
  "pt": "Painel Brilhante Azul",
  "en": "Blue Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_azul"
 },
 "cl:painel_brilhante_azul_claro": {
  "pt": "Painel Brilhante Azul-Claro",
  "en": "Light Blue Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_azul_claro"
 },
 "cl:painel_brilhante_branco": {
  "pt": "Painel Brilhante Branco",
  "en": "White Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_branco"
 },
 "cl:painel_brilhante_ciano": {
  "pt": "Painel Brilhante Ciano",
  "en": "Cyan Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_ciano"
 },
 "cl:painel_brilhante_cinza": {
  "pt": "Painel Brilhante Cinza",
  "en": "Gray Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_cinza"
 },
 "cl:painel_brilhante_cinza_claro": {
  "pt": "Painel Brilhante Cinza-Claro",
  "en": "Light Gray Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_cinza_claro"
 },
 "cl:painel_brilhante_laranja": {
  "pt": "Painel Brilhante Laranja",
  "en": "Orange Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_laranja"
 },
 "cl:painel_brilhante_lima": {
  "pt": "Painel Brilhante Lima",
  "en": "Lime Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_lima"
 },
 "cl:painel_brilhante_magenta": {
  "pt": "Painel Brilhante Magenta",
  "en": "Magenta Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_magenta"
 },
 "cl:painel_brilhante_marrom": {
  "pt": "Painel Brilhante Marrom",
  "en": "Brown Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_marrom"
 },
 "cl:painel_brilhante_preto": {
  "pt": "Painel Brilhante Preto",
  "en": "Black Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_preto"
 },
 "cl:painel_brilhante_rosa": {
  "pt": "Painel Brilhante Rosa",
  "en": "Pink Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_rosa"
 },
 "cl:painel_brilhante_roxo": {
  "pt": "Painel Brilhante Roxo",
  "en": "Purple Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_roxo"
 },
 "cl:painel_brilhante_verde": {
  "pt": "Painel Brilhante Verde",
  "en": "Green Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_verde"
 },
 "cl:painel_brilhante_vermelho": {
  "pt": "Painel Brilhante Vermelho",
  "en": "Red Glow Panel",
  "icone": "textures/items/cl/blocos/painel_brilhante_vermelho"
 },
 "cl:painel_fotoeletrico": {
  "pt": "Painel Fotoelétrico",
  "en": "Photoelectric Pane",
  "icone": "textures/items/cl/arte/painel_fotoeletrico"
 },
 "cl:painel_fotovoltaico": {
  "pt": "Módulo Fotovoltaico Energético",
  "en": "Energetic Photovoltaic Module",
  "icone": "textures/items/cl/blocos/painel_fotovoltaico"
 },
 "cl:painel_fotovoltaico_avancado": {
  "pt": "Módulo Fotovoltaico Pulsante",
  "en": "Pulsating Photovoltaic Module",
  "icone": "textures/items/cl/blocos/painel_fotovoltaico_avancado"
 },
 "cl:painel_fotovoltaico_vibrante": {
  "pt": "Módulo Fotovoltaico Vibrante",
  "en": "Vibrant Photovoltaic Module",
  "icone": "textures/items/cl/blocos/painel_fotovoltaico_vibrante"
 },
 "cl:painel_nave": {
  "pt": "Painel da Nave",
  "en": "Ship Console",
  "icone": "textures/items/cl/arte/blocos/painel_nave"
 },
 "cl:painel_solar": {
  "pt": "Painel Solar",
  "en": "Solar Panel",
  "icone": "textures/items/cl/arte/blocos/painel_solar"
 },
 "cl:painel_solar_ardente": {
  "pt": "Painel Solar Ardente",
  "en": "Blazing Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_ardente"
 },
 "cl:painel_solar_basico": {
  "pt": "Painel Solar Básico",
  "en": "Basic Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_basico"
 },
 "cl:painel_solar_endurecido": {
  "pt": "Painel Solar Endurecido",
  "en": "Hardened Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_endurecido"
 },
 "cl:painel_solar_espiritual": {
  "pt": "Painel Solar Espiritual",
  "en": "Spirited Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_espiritual"
 },
 "cl:painel_solar_inicial": {
  "pt": "Painel Solar Inicial",
  "en": "Starter Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_inicial"
 },
 "cl:painel_solar_mk": {
  "pt": "Painel Solar (Mekanism)",
  "en": "Solar Panel",
  "icone": "textures/items/cl/arte/painel_solar_mk"
 },
 "cl:painel_solar_niotico": {
  "pt": "Painel Solar Niótico",
  "en": "Niotic Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_niotico"
 },
 "cl:painel_solar_nitro": {
  "pt": "Painel Solar Nitro",
  "en": "Nitro Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar_nitro"
 },
 "cl:palha": {
  "pt": "Palha",
  "en": "Straw",
  "icone": "textures/items/cl/arte/palha"
 },
 "cl:palha_trancada": {
  "pt": "Palha Trançada",
  "en": "Thatch",
  "icone": "textures/items/cl/blocos/palha_trancada"
 },
 "cl:panela": {
  "pt": "Panela",
  "en": "Pot",
  "icone": "textures/items/cl/arte/blocos/panela"
 },
 "cl:panela_cozinha": {
  "pt": "Panela de Cozinha",
  "en": "Cooking Pot",
  "icone": "textures/items/cl/blocos/panela_cozinha"
 },
 "cl:panquecas": {
  "pt": "Panquecas",
  "en": "Pancakes",
  "icone": "textures/items/cl/arte/panquecas"
 },
 "cl:parede_camara": {
  "pt": "Parede da Câmara de Pressão",
  "en": "Pressure Chamber Wall",
  "icone": "textures/items/cl/blocos/parede_camara"
 },
 "cl:pasta_dieletrica": {
  "pt": "Pasta Dielétrica",
  "en": "Dielectric Paste",
  "icone": "textures/items/cl/arte/pasta_dieletrica"
 },
 "cl:pavimento_refratario": {
  "pt": "Pavimento Refratário",
  "en": "Seared Paver",
  "icone": "textures/blocks/cl/arte/pavimento_refratario"
 },
 "cl:peca_cabeca_enxo_aco": {
  "pt": "Cabeça de Enxó de Aço",
  "en": "Steel Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_aco"
 },
 "cl:peca_cabeca_enxo_aco_slime": {
  "pt": "Cabeça de Enxó de Aço de Slime",
  "en": "Slimesteel Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_aco_slime"
 },
 "cl:peca_cabeca_enxo_bronze": {
  "pt": "Cabeça de Enxó de Bronze",
  "en": "Bronze Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_bronze"
 },
 "cl:peca_cabeca_enxo_bronze_ametista": {
  "pt": "Cabeça de Enxó de Bronze de Ametista",
  "en": "Amethyst Bronze Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_bronze_ametista"
 },
 "cl:peca_cabeca_enxo_cobalto": {
  "pt": "Cabeça de Enxó de Cobalto",
  "en": "Cobalt Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_cobalto"
 },
 "cl:peca_cabeca_enxo_cobre": {
  "pt": "Cabeça de Enxó de Cobre",
  "en": "Copper Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_cobre"
 },
 "cl:peca_cabeca_enxo_coro": {
  "pt": "Cabeça de Enxó de Chorus",
  "en": "Chorus Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_coro"
 },
 "cl:peca_cabeca_enxo_ferro": {
  "pt": "Cabeça de Enxó de Ferro",
  "en": "Iron Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_ferro"
 },
 "cl:peca_cabeca_enxo_ferro_porco": {
  "pt": "Cabeça de Enxó de Ferro-Porco",
  "en": "Pig Iron Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_ferro_porco"
 },
 "cl:peca_cabeca_enxo_hepatizon": {
  "pt": "Cabeça de Enxó de Hepatizão",
  "en": "Hepatizon Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_hepatizon"
 },
 "cl:peca_cabeca_enxo_madeira": {
  "pt": "Cabeça de Enxó de Madeira",
  "en": "Wood Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_madeira"
 },
 "cl:peca_cabeca_enxo_madeira_slime": {
  "pt": "Cabeça de Enxó de Madeira de Slime",
  "en": "Slimewood Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_madeira_slime"
 },
 "cl:peca_cabeca_enxo_madeira_slime_revestida": {
  "pt": "Cabeça de Enxó de Madeira de Slime Revestida",
  "en": "Plated Slimewood Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_madeira_slime_revestida"
 },
 "cl:peca_cabeca_enxo_madeira_tratada": {
  "pt": "Cabeça de Enxó de Madeira Tratada",
  "en": "Treated Wood Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_madeira_tratada"
 },
 "cl:peca_cabeca_enxo_manyullyn": {
  "pt": "Cabeça de Enxó de Manyullyn",
  "en": "Manyullyn Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_manyullyn"
 },
 "cl:peca_cabeca_enxo_nahuatl": {
  "pt": "Cabeça de Enxó de Nahuatl",
  "en": "Nahuatl Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_nahuatl"
 },
 "cl:peca_cabeca_enxo_osmio": {
  "pt": "Cabeça de Enxó de Ósmio",
  "en": "Osmium Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_osmio"
 },
 "cl:peca_cabeca_enxo_osso": {
  "pt": "Cabeça de Enxó de Osso",
  "en": "Bone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_osso"
 },
 "cl:peca_cabeca_enxo_osso_blaze": {
  "pt": "Cabeça de Enxó de Osso de Blaze",
  "en": "Blazing Bone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_osso_blaze"
 },
 "cl:peca_cabeca_enxo_osso_necrotico": {
  "pt": "Cabeça de Enxó de Osso Necrótico",
  "en": "Necrotic Bone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_osso_necrotico"
 },
 "cl:peca_cabeca_enxo_osso_venenoso": {
  "pt": "Cabeça de Enxó de Osso Venenoso",
  "en": "Venombone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_osso_venenoso"
 },
 "cl:peca_cabeca_enxo_ouro_rosa": {
  "pt": "Cabeça de Enxó de Ouro Rosa",
  "en": "Rose Gold Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_ouro_rosa"
 },
 "cl:peca_cabeca_enxo_pedra": {
  "pt": "Cabeça de Enxó de Pedra",
  "en": "Stone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_pedra"
 },
 "cl:peca_cabeca_enxo_pedra_branca": {
  "pt": "Cabeça de Enxó de Pedra Branca",
  "en": "Whitestone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_pedra_branca"
 },
 "cl:peca_cabeca_enxo_pedra_chamuscada": {
  "pt": "Cabeça de Enxó de Pedra Chamuscada",
  "en": "Scorched Stone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_pedra_chamuscada"
 },
 "cl:peca_cabeca_enxo_pedra_refrataria": {
  "pt": "Cabeça de Enxó de Pedra Carbonizada",
  "en": "Seared Stone Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_pedra_refrataria"
 },
 "cl:peca_cabeca_enxo_silex": {
  "pt": "Cabeça de Enxó de Sílex",
  "en": "Flint Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_silex"
 },
 "cl:peca_cabeca_enxo_slime_brasa": {
  "pt": "Cabeça de Enxó de Slime de Brasa",
  "en": "Cinderslime Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_slime_brasa"
 },
 "cl:peca_cabeca_enxo_slime_cavaleiro": {
  "pt": "Cabeça de Enxó de Slime-Cavaleiro",
  "en": "Knightslime Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_slime_cavaleiro"
 },
 "cl:peca_cabeca_enxo_slime_rainha": {
  "pt": "Cabeça de Enxó de Slime da Rainha",
  "en": "Queen's Slime Adze Head",
  "icone": "textures/items/cl/arte/peca_cabeca_enxo_slime_rainha"
 },
 "cl:peca_cabeca_machado_aco": {
  "pt": "Cabeça de Machado Pequeno de Aço",
  "en": "Steel Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_aco"
 },
 "cl:peca_cabeca_machado_aco_slime": {
  "pt": "Cabeça de Machado Pequeno de Aço de Slime",
  "en": "Slimesteel Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_aco_slime"
 },
 "cl:peca_cabeca_machado_bronze": {
  "pt": "Cabeça de Machado Pequeno de Bronze",
  "en": "Bronze Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_bronze"
 },
 "cl:peca_cabeca_machado_bronze_ametista": {
  "pt": "Cabeça de Machado Pequeno de Bronze de Ametista",
  "en": "Amethyst Bronze Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_bronze_ametista"
 },
 "cl:peca_cabeca_machado_cacto": {
  "pt": "Cabeça de Machado Pequeno de Cacto",
  "en": "Cactus Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_cacto"
 },
 "cl:peca_cabeca_machado_cobalto": {
  "pt": "Cabeça de Machado Pequeno de Cobalto",
  "en": "Cobalt Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_cobalto"
 },
 "cl:peca_cabeca_machado_cobre": {
  "pt": "Cabeça de Machado Pequeno de Cobre",
  "en": "Copper Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_cobre"
 },
 "cl:peca_cabeca_machado_coro": {
  "pt": "Cabeça de Machado Pequeno de Chorus",
  "en": "Chorus Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_coro"
 },
 "cl:peca_cabeca_machado_ferro": {
  "pt": "Cabeça de Machado Pequeno de Ferro",
  "en": "Iron Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_ferro"
 },
 "cl:peca_cabeca_machado_ferro_porco": {
  "pt": "Cabeça de Machado Pequeno de Ferro-Porco",
  "en": "Pig Iron Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_ferro_porco"
 },
 "cl:peca_cabeca_machado_hepatizon": {
  "pt": "Cabeça de Machado Pequeno de Hepatizão",
  "en": "Hepatizon Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_hepatizon"
 },
 "cl:peca_cabeca_machado_larga_aco": {
  "pt": "Cabeça de Machado Grande de Aço",
  "en": "Steel Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_aco"
 },
 "cl:peca_cabeca_machado_larga_aco_slime": {
  "pt": "Cabeça de Machado Grande de Aço de Slime",
  "en": "Slimesteel Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_aco_slime"
 },
 "cl:peca_cabeca_machado_larga_bronze": {
  "pt": "Cabeça de Machado Grande de Bronze",
  "en": "Bronze Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_bronze"
 },
 "cl:peca_cabeca_machado_larga_bronze_ametista": {
  "pt": "Cabeça de Machado Grande de Bronze de Ametista",
  "en": "Amethyst Bronze Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_bronze_ametista"
 },
 "cl:peca_cabeca_machado_larga_cacto": {
  "pt": "Cabeça de Machado Grande de Cacto",
  "en": "Cactus Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_cacto"
 },
 "cl:peca_cabeca_machado_larga_cobalto": {
  "pt": "Cabeça de Machado Grande de Cobalto",
  "en": "Cobalt Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_cobalto"
 },
 "cl:peca_cabeca_machado_larga_cobre": {
  "pt": "Cabeça de Machado Grande de Cobre",
  "en": "Copper Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_cobre"
 },
 "cl:peca_cabeca_machado_larga_coro": {
  "pt": "Cabeça de Machado Grande de Chorus",
  "en": "Chorus Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_coro"
 },
 "cl:peca_cabeca_machado_larga_ferro": {
  "pt": "Cabeça de Machado Grande de Ferro",
  "en": "Iron Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_ferro"
 },
 "cl:peca_cabeca_machado_larga_ferro_porco": {
  "pt": "Cabeça de Machado Grande de Ferro-Porco",
  "en": "Pig Iron Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_ferro_porco"
 },
 "cl:peca_cabeca_machado_larga_hepatizon": {
  "pt": "Cabeça de Machado Grande de Hepatizão",
  "en": "Hepatizon Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_hepatizon"
 },
 "cl:peca_cabeca_machado_larga_madeira": {
  "pt": "Cabeça de Machado Grande de Madeira",
  "en": "Wood Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_madeira"
 },
 "cl:peca_cabeca_machado_larga_madeira_slime": {
  "pt": "Cabeça de Machado Grande de Madeira de Slime",
  "en": "Slimewood Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_madeira_slime"
 },
 "cl:peca_cabeca_machado_larga_madeira_slime_revestida": {
  "pt": "Cabeça de Machado Grande de Madeira de Slime Revestida",
  "en": "Plated Slimewood Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_madeira_slime_revestida"
 },
 "cl:peca_cabeca_machado_larga_madeira_tratada": {
  "pt": "Cabeça de Machado Grande de Madeira Tratada",
  "en": "Treated Wood Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_madeira_tratada"
 },
 "cl:peca_cabeca_machado_larga_manyullyn": {
  "pt": "Cabeça de Machado Grande de Manyullyn",
  "en": "Manyullyn Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_manyullyn"
 },
 "cl:peca_cabeca_machado_larga_nahuatl": {
  "pt": "Cabeça de Machado Grande de Nahuatl",
  "en": "Nahuatl Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_nahuatl"
 },
 "cl:peca_cabeca_machado_larga_obsidiana": {
  "pt": "Cabeça de Machado Grande de Obsidiana",
  "en": "Obsidian Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_obsidiana"
 },
 "cl:peca_cabeca_machado_larga_osmio": {
  "pt": "Cabeça de Machado Grande de Ósmio",
  "en": "Osmium Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_osmio"
 },
 "cl:peca_cabeca_machado_larga_osso": {
  "pt": "Cabeça de Machado Grande de Osso",
  "en": "Bone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_osso"
 },
 "cl:peca_cabeca_machado_larga_osso_blaze": {
  "pt": "Cabeça de Machado Grande de Osso de Blaze",
  "en": "Blazing Bone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_osso_blaze"
 },
 "cl:peca_cabeca_machado_larga_osso_necrotico": {
  "pt": "Cabeça de Machado Grande de Osso Necrótico",
  "en": "Necrotic Bone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_osso_necrotico"
 },
 "cl:peca_cabeca_machado_larga_osso_venenoso": {
  "pt": "Cabeça de Machado Grande de Osso Venenoso",
  "en": "Venombone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_osso_venenoso"
 },
 "cl:peca_cabeca_machado_larga_ouro_rosa": {
  "pt": "Cabeça de Machado Grande de Ouro Rosa",
  "en": "Rose Gold Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_ouro_rosa"
 },
 "cl:peca_cabeca_machado_larga_pedra": {
  "pt": "Cabeça de Machado Grande de Pedra",
  "en": "Stone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_pedra"
 },
 "cl:peca_cabeca_machado_larga_pedra_branca": {
  "pt": "Cabeça de Machado Grande de Pedra Branca",
  "en": "Whitestone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_pedra_branca"
 },
 "cl:peca_cabeca_machado_larga_pedra_chamuscada": {
  "pt": "Cabeça de Machado Grande de Pedra Chamuscada",
  "en": "Scorched Stone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_pedra_chamuscada"
 },
 "cl:peca_cabeca_machado_larga_pedra_refrataria": {
  "pt": "Cabeça de Machado Grande de Pedra Carbonizada",
  "en": "Seared Stone Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_pedra_refrataria"
 },
 "cl:peca_cabeca_machado_larga_silex": {
  "pt": "Cabeça de Machado Grande de Sílex",
  "en": "Flint Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_silex"
 },
 "cl:peca_cabeca_machado_larga_slime_brasa": {
  "pt": "Cabeça de Machado Grande de Slime de Brasa",
  "en": "Cinderslime Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_slime_brasa"
 },
 "cl:peca_cabeca_machado_larga_slime_cavaleiro": {
  "pt": "Cabeça de Machado Grande de Slime-Cavaleiro",
  "en": "Knightslime Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_slime_cavaleiro"
 },
 "cl:peca_cabeca_machado_larga_slime_rainha": {
  "pt": "Cabeça de Machado Grande de Slime da Rainha",
  "en": "Queen's Slime Broad Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_larga_slime_rainha"
 },
 "cl:peca_cabeca_machado_madeira": {
  "pt": "Cabeça de Machado Pequeno de Madeira",
  "en": "Wood Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_madeira"
 },
 "cl:peca_cabeca_machado_madeira_slime": {
  "pt": "Cabeça de Machado Pequeno de Madeira de Slime",
  "en": "Slimewood Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_madeira_slime"
 },
 "cl:peca_cabeca_machado_madeira_slime_revestida": {
  "pt": "Cabeça de Machado Pequeno de Madeira de Slime Revestida",
  "en": "Plated Slimewood Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_madeira_slime_revestida"
 },
 "cl:peca_cabeca_machado_madeira_tratada": {
  "pt": "Cabeça de Machado Pequeno de Madeira Tratada",
  "en": "Treated Wood Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_madeira_tratada"
 },
 "cl:peca_cabeca_machado_manyullyn": {
  "pt": "Cabeça de Machado Pequeno de Manyullyn",
  "en": "Manyullyn Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_manyullyn"
 },
 "cl:peca_cabeca_machado_nahuatl": {
  "pt": "Cabeça de Machado Pequeno de Nahuatl",
  "en": "Nahuatl Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_nahuatl"
 },
 "cl:peca_cabeca_machado_obsidiana": {
  "pt": "Cabeça de Machado Pequeno de Obsidiana",
  "en": "Obsidian Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_obsidiana"
 },
 "cl:peca_cabeca_machado_osmio": {
  "pt": "Cabeça de Machado Pequeno de Ósmio",
  "en": "Osmium Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osmio"
 },
 "cl:peca_cabeca_machado_osso": {
  "pt": "Cabeça de Machado Pequeno de Osso",
  "en": "Bone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osso"
 },
 "cl:peca_cabeca_machado_osso_blaze": {
  "pt": "Cabeça de Machado Pequeno de Osso de Blaze",
  "en": "Blazing Bone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osso_blaze"
 },
 "cl:peca_cabeca_machado_osso_necrotico": {
  "pt": "Cabeça de Machado Pequeno de Osso Necrótico",
  "en": "Necrotic Bone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osso_necrotico"
 },
 "cl:peca_cabeca_machado_osso_venenoso": {
  "pt": "Cabeça de Machado Pequeno de Osso Venenoso",
  "en": "Venombone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osso_venenoso"
 },
 "cl:peca_cabeca_machado_ouro_rosa": {
  "pt": "Cabeça de Machado Pequeno de Ouro Rosa",
  "en": "Rose Gold Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_ouro_rosa"
 },
 "cl:peca_cabeca_machado_pedra": {
  "pt": "Cabeça de Machado Pequeno de Pedra",
  "en": "Stone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_pedra"
 },
 "cl:peca_cabeca_machado_pedra_branca": {
  "pt": "Cabeça de Machado Pequeno de Pedra Branca",
  "en": "Whitestone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_pedra_branca"
 },
 "cl:peca_cabeca_machado_pedra_chamuscada": {
  "pt": "Cabeça de Machado Pequeno de Pedra Chamuscada",
  "en": "Scorched Stone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_pedra_chamuscada"
 },
 "cl:peca_cabeca_machado_pedra_refrataria": {
  "pt": "Cabeça de Machado Pequeno de Pedra Carbonizada",
  "en": "Seared Stone Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_pedra_refrataria"
 },
 "cl:peca_cabeca_machado_silex": {
  "pt": "Cabeça de Machado Pequeno de Sílex",
  "en": "Flint Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_silex"
 },
 "cl:peca_cabeca_machado_slime_brasa": {
  "pt": "Cabeça de Machado Pequeno de Slime de Brasa",
  "en": "Cinderslime Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_slime_brasa"
 },
 "cl:peca_cabeca_machado_slime_cavaleiro": {
  "pt": "Cabeça de Machado Pequeno de Slime-Cavaleiro",
  "en": "Knightslime Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_slime_cavaleiro"
 },
 "cl:peca_cabeca_machado_slime_rainha": {
  "pt": "Cabeça de Machado Pequeno de Slime da Rainha",
  "en": "Queen's Slime Small Axe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_slime_rainha"
 },
 "cl:peca_cabeca_martelo_aco": {
  "pt": "Cabeça de Martelo de Aço",
  "en": "Steel Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_aco"
 },
 "cl:peca_cabeca_martelo_aco_slime": {
  "pt": "Cabeça de Martelo de Aço de Slime",
  "en": "Slimesteel Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_aco_slime"
 },
 "cl:peca_cabeca_martelo_bronze": {
  "pt": "Cabeça de Martelo de Bronze",
  "en": "Bronze Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_bronze"
 },
 "cl:peca_cabeca_martelo_bronze_ametista": {
  "pt": "Cabeça de Martelo de Bronze de Ametista",
  "en": "Amethyst Bronze Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_bronze_ametista"
 },
 "cl:peca_cabeca_martelo_cacto": {
  "pt": "Cabeça de Martelo de Cacto",
  "en": "Cactus Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_cacto"
 },
 "cl:peca_cabeca_martelo_cobalto": {
  "pt": "Cabeça de Martelo de Cobalto",
  "en": "Cobalt Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_cobalto"
 },
 "cl:peca_cabeca_martelo_cobre": {
  "pt": "Cabeça de Martelo de Cobre",
  "en": "Copper Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_cobre"
 },
 "cl:peca_cabeca_martelo_coro": {
  "pt": "Cabeça de Martelo de Chorus",
  "en": "Chorus Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_coro"
 },
 "cl:peca_cabeca_martelo_ferro": {
  "pt": "Cabeça de Martelo de Ferro",
  "en": "Iron Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_ferro"
 },
 "cl:peca_cabeca_martelo_ferro_porco": {
  "pt": "Cabeça de Martelo de Ferro-Porco",
  "en": "Pig Iron Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_ferro_porco"
 },
 "cl:peca_cabeca_martelo_hepatizon": {
  "pt": "Cabeça de Martelo de Hepatizão",
  "en": "Hepatizon Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_hepatizon"
 },
 "cl:peca_cabeca_martelo_madeira": {
  "pt": "Cabeça de Martelo de Madeira",
  "en": "Wood Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_madeira"
 },
 "cl:peca_cabeca_martelo_madeira_slime": {
  "pt": "Cabeça de Martelo de Madeira de Slime",
  "en": "Slimewood Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_madeira_slime"
 },
 "cl:peca_cabeca_martelo_madeira_slime_revestida": {
  "pt": "Cabeça de Martelo de Madeira de Slime Revestida",
  "en": "Plated Slimewood Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_madeira_slime_revestida"
 },
 "cl:peca_cabeca_martelo_madeira_tratada": {
  "pt": "Cabeça de Martelo de Madeira Tratada",
  "en": "Treated Wood Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_madeira_tratada"
 },
 "cl:peca_cabeca_martelo_manyullyn": {
  "pt": "Cabeça de Martelo de Manyullyn",
  "en": "Manyullyn Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_manyullyn"
 },
 "cl:peca_cabeca_martelo_nahuatl": {
  "pt": "Cabeça de Martelo de Nahuatl",
  "en": "Nahuatl Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_nahuatl"
 },
 "cl:peca_cabeca_martelo_obsidiana": {
  "pt": "Cabeça de Martelo de Obsidiana",
  "en": "Obsidian Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_obsidiana"
 },
 "cl:peca_cabeca_martelo_osmio": {
  "pt": "Cabeça de Martelo de Ósmio",
  "en": "Osmium Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_osmio"
 },
 "cl:peca_cabeca_martelo_osso": {
  "pt": "Cabeça de Martelo de Osso",
  "en": "Bone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_osso"
 },
 "cl:peca_cabeca_martelo_osso_blaze": {
  "pt": "Cabeça de Martelo de Osso de Blaze",
  "en": "Blazing Bone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_osso_blaze"
 },
 "cl:peca_cabeca_martelo_osso_necrotico": {
  "pt": "Cabeça de Martelo de Osso Necrótico",
  "en": "Necrotic Bone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_osso_necrotico"
 },
 "cl:peca_cabeca_martelo_osso_venenoso": {
  "pt": "Cabeça de Martelo de Osso Venenoso",
  "en": "Venombone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_osso_venenoso"
 },
 "cl:peca_cabeca_martelo_ouro_rosa": {
  "pt": "Cabeça de Martelo de Ouro Rosa",
  "en": "Rose Gold Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_ouro_rosa"
 },
 "cl:peca_cabeca_martelo_pedra": {
  "pt": "Cabeça de Martelo de Pedra",
  "en": "Stone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_pedra"
 },
 "cl:peca_cabeca_martelo_pedra_branca": {
  "pt": "Cabeça de Martelo de Pedra Branca",
  "en": "Whitestone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_pedra_branca"
 },
 "cl:peca_cabeca_martelo_pedra_chamuscada": {
  "pt": "Cabeça de Martelo de Pedra Chamuscada",
  "en": "Scorched Stone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_pedra_chamuscada"
 },
 "cl:peca_cabeca_martelo_pedra_refrataria": {
  "pt": "Cabeça de Martelo de Pedra Carbonizada",
  "en": "Seared Stone Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_pedra_refrataria"
 },
 "cl:peca_cabeca_martelo_silex": {
  "pt": "Cabeça de Martelo de Sílex",
  "en": "Flint Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_silex"
 },
 "cl:peca_cabeca_martelo_slime_brasa": {
  "pt": "Cabeça de Martelo de Slime de Brasa",
  "en": "Cinderslime Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_slime_brasa"
 },
 "cl:peca_cabeca_martelo_slime_cavaleiro": {
  "pt": "Cabeça de Martelo de Slime-Cavaleiro",
  "en": "Knightslime Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_slime_cavaleiro"
 },
 "cl:peca_cabeca_martelo_slime_rainha": {
  "pt": "Cabeça de Martelo de Slime da Rainha",
  "en": "Queen's Slime Hammer Head",
  "icone": "textures/items/cl/arte/peca_cabeca_martelo_slime_rainha"
 },
 "cl:peca_cabeca_pa_aco": {
  "pt": "Cabeça de Pá de Aço",
  "en": "Steel Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_aco"
 },
 "cl:peca_cabeca_pa_bronze": {
  "pt": "Cabeça de Pá de Bronze",
  "en": "Bronze Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_bronze"
 },
 "cl:peca_cabeca_pa_bronze_ametista": {
  "pt": "Cabeça de Pá de Bronze de Ametista",
  "en": "Amethyst Bronze Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_bronze_ametista"
 },
 "cl:peca_cabeca_pa_cacto": {
  "pt": "Cabeça de Pá de Cacto",
  "en": "Cactus Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_cacto"
 },
 "cl:peca_cabeca_pa_cobre": {
  "pt": "Cabeça de Pá de Cobre",
  "en": "Copper Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_cobre"
 },
 "cl:peca_cabeca_pa_ferro": {
  "pt": "Cabeça de Pá de Ferro",
  "en": "Iron Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_ferro"
 },
 "cl:peca_cabeca_pa_madeira": {
  "pt": "Cabeça de Pá de Madeira",
  "en": "Wood Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_madeira"
 },
 "cl:peca_cabeca_pa_obsidiana": {
  "pt": "Cabeça de Pá de Obsidiana",
  "en": "Obsidian Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_obsidiana"
 },
 "cl:peca_cabeca_pa_osso": {
  "pt": "Cabeça de Pá de Osso",
  "en": "Bone Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_osso"
 },
 "cl:peca_cabeca_pa_ouro_rosa": {
  "pt": "Cabeça de Pá de Ouro Rosa",
  "en": "Rose Gold Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_ouro_rosa"
 },
 "cl:peca_cabeca_pa_pedra": {
  "pt": "Cabeça de Pá de Pedra",
  "en": "Stone Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_pedra"
 },
 "cl:peca_cabeca_pa_silex": {
  "pt": "Cabeça de Pá de Sílex",
  "en": "Flint Shovel Head",
  "icone": "textures/items/cl/arte/peca_cabeca_pa_silex"
 },
 "cl:peca_cabeca_picareta_aco": {
  "pt": "Cabeça de Picareta de Aço",
  "en": "Steel Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_aco"
 },
 "cl:peca_cabeca_picareta_aco_slime": {
  "pt": "Cabeça de Picareta de Aço de Slime",
  "en": "Slimesteel Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_aco_slime"
 },
 "cl:peca_cabeca_picareta_bronze": {
  "pt": "Cabeça de Picareta de Bronze",
  "en": "Bronze Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_bronze"
 },
 "cl:peca_cabeca_picareta_bronze_ametista": {
  "pt": "Cabeça de Picareta de Bronze de Ametista",
  "en": "Amethyst Bronze Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_bronze_ametista"
 },
 "cl:peca_cabeca_picareta_cacto": {
  "pt": "Cabeça de Picareta de Cacto",
  "en": "Cactus Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_cacto"
 },
 "cl:peca_cabeca_picareta_cobalto": {
  "pt": "Cabeça de Picareta de Cobalto",
  "en": "Cobalt Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_cobalto"
 },
 "cl:peca_cabeca_picareta_cobre": {
  "pt": "Cabeça de Picareta de Cobre",
  "en": "Copper Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_cobre"
 },
 "cl:peca_cabeca_picareta_coro": {
  "pt": "Cabeça de Picareta de Chorus",
  "en": "Chorus Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_coro"
 },
 "cl:peca_cabeca_picareta_ferro": {
  "pt": "Cabeça de Picareta de Ferro",
  "en": "Iron Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_ferro"
 },
 "cl:peca_cabeca_picareta_ferro_porco": {
  "pt": "Cabeça de Picareta de Ferro-Porco",
  "en": "Pig Iron Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_ferro_porco"
 },
 "cl:peca_cabeca_picareta_hepatizon": {
  "pt": "Cabeça de Picareta de Hepatizão",
  "en": "Hepatizon Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_hepatizon"
 },
 "cl:peca_cabeca_picareta_madeira": {
  "pt": "Cabeça de Picareta de Madeira",
  "en": "Wood Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_madeira"
 },
 "cl:peca_cabeca_picareta_madeira_slime": {
  "pt": "Cabeça de Picareta de Madeira de Slime",
  "en": "Slimewood Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_madeira_slime"
 },
 "cl:peca_cabeca_picareta_madeira_slime_revestida": {
  "pt": "Cabeça de Picareta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_madeira_slime_revestida"
 },
 "cl:peca_cabeca_picareta_madeira_tratada": {
  "pt": "Cabeça de Picareta de Madeira Tratada",
  "en": "Treated Wood Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_madeira_tratada"
 },
 "cl:peca_cabeca_picareta_manyullyn": {
  "pt": "Cabeça de Picareta de Manyullyn",
  "en": "Manyullyn Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_manyullyn"
 },
 "cl:peca_cabeca_picareta_nahuatl": {
  "pt": "Cabeça de Picareta de Nahuatl",
  "en": "Nahuatl Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_nahuatl"
 },
 "cl:peca_cabeca_picareta_obsidiana": {
  "pt": "Cabeça de Picareta de Obsidiana",
  "en": "Obsidian Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_obsidiana"
 },
 "cl:peca_cabeca_picareta_osmio": {
  "pt": "Cabeça de Picareta de Ósmio",
  "en": "Osmium Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osmio"
 },
 "cl:peca_cabeca_picareta_osso": {
  "pt": "Cabeça de Picareta de Osso",
  "en": "Bone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osso"
 },
 "cl:peca_cabeca_picareta_osso_blaze": {
  "pt": "Cabeça de Picareta de Osso de Blaze",
  "en": "Blazing Bone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osso_blaze"
 },
 "cl:peca_cabeca_picareta_osso_necrotico": {
  "pt": "Cabeça de Picareta de Osso Necrótico",
  "en": "Necrotic Bone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osso_necrotico"
 },
 "cl:peca_cabeca_picareta_osso_venenoso": {
  "pt": "Cabeça de Picareta de Osso Venenoso",
  "en": "Venombone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osso_venenoso"
 },
 "cl:peca_cabeca_picareta_ouro_rosa": {
  "pt": "Cabeça de Picareta de Ouro Rosa",
  "en": "Rose Gold Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_ouro_rosa"
 },
 "cl:peca_cabeca_picareta_pedra": {
  "pt": "Cabeça de Picareta de Pedra",
  "en": "Stone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_pedra"
 },
 "cl:peca_cabeca_picareta_pedra_branca": {
  "pt": "Cabeça de Picareta de Pedra Branca",
  "en": "Whitestone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_pedra_branca"
 },
 "cl:peca_cabeca_picareta_pedra_chamuscada": {
  "pt": "Cabeça de Picareta de Pedra Chamuscada",
  "en": "Scorched Stone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_pedra_chamuscada"
 },
 "cl:peca_cabeca_picareta_pedra_refrataria": {
  "pt": "Cabeça de Picareta de Pedra Carbonizada",
  "en": "Seared Stone Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_pedra_refrataria"
 },
 "cl:peca_cabeca_picareta_silex": {
  "pt": "Cabeça de Picareta de Sílex",
  "en": "Flint Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_silex"
 },
 "cl:peca_cabeca_picareta_slime_brasa": {
  "pt": "Cabeça de Picareta de Slime de Brasa",
  "en": "Cinderslime Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_slime_brasa"
 },
 "cl:peca_cabeca_picareta_slime_cavaleiro": {
  "pt": "Cabeça de Picareta de Slime-Cavaleiro",
  "en": "Knightslime Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_slime_cavaleiro"
 },
 "cl:peca_cabeca_picareta_slime_rainha": {
  "pt": "Cabeça de Picareta de Slime da Rainha",
  "en": "Queen's Slime Pick Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_slime_rainha"
 },
 "cl:peca_cabo_aco": {
  "pt": "Cabo de Ferramenta de Aço",
  "en": "Steel Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_aco"
 },
 "cl:peca_cabo_aco_slime": {
  "pt": "Cabo de Ferramenta de Aço de Slime",
  "en": "Slimesteel Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_aco_slime"
 },
 "cl:peca_cabo_bronze": {
  "pt": "Cabo de Ferramenta de Bronze",
  "en": "Bronze Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_bronze"
 },
 "cl:peca_cabo_bronze_ametista": {
  "pt": "Cabo de Ferramenta de Bronze de Ametista",
  "en": "Amethyst Bronze Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_bronze_ametista"
 },
 "cl:peca_cabo_cacto": {
  "pt": "Cabo de Ferramenta de Cacto",
  "en": "Cactus Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_cacto"
 },
 "cl:peca_cabo_cobalto": {
  "pt": "Cabo de Ferramenta de Cobalto",
  "en": "Cobalt Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_cobalto"
 },
 "cl:peca_cabo_cobre": {
  "pt": "Cabo de Ferramenta de Cobre",
  "en": "Copper Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_cobre"
 },
 "cl:peca_cabo_coro": {
  "pt": "Cabo de Ferramenta de Chorus",
  "en": "Chorus Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_coro"
 },
 "cl:peca_cabo_ferro": {
  "pt": "Cabo de Ferramenta de Ferro",
  "en": "Iron Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_ferro"
 },
 "cl:peca_cabo_ferro_porco": {
  "pt": "Cabo de Ferramenta de Ferro-Porco",
  "en": "Pig Iron Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_ferro_porco"
 },
 "cl:peca_cabo_hepatizon": {
  "pt": "Cabo de Ferramenta de Hepatizão",
  "en": "Hepatizon Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_hepatizon"
 },
 "cl:peca_cabo_madeira": {
  "pt": "Cabo de Ferramenta de Madeira",
  "en": "Wood Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_madeira"
 },
 "cl:peca_cabo_madeira_slime": {
  "pt": "Cabo de Ferramenta de Madeira de Slime",
  "en": "Slimewood Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_madeira_slime"
 },
 "cl:peca_cabo_madeira_slime_revestida": {
  "pt": "Cabo de Ferramenta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_madeira_slime_revestida"
 },
 "cl:peca_cabo_madeira_tratada": {
  "pt": "Cabo de Ferramenta de Madeira Tratada",
  "en": "Treated Wood Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_madeira_tratada"
 },
 "cl:peca_cabo_manyullyn": {
  "pt": "Cabo de Ferramenta de Manyullyn",
  "en": "Manyullyn Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_manyullyn"
 },
 "cl:peca_cabo_nahuatl": {
  "pt": "Cabo de Ferramenta de Nahuatl",
  "en": "Nahuatl Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_nahuatl"
 },
 "cl:peca_cabo_obsidiana": {
  "pt": "Cabo de Ferramenta de Obsidiana",
  "en": "Obsidian Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_obsidiana"
 },
 "cl:peca_cabo_osmio": {
  "pt": "Cabo de Ferramenta de Ósmio",
  "en": "Osmium Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_osmio"
 },
 "cl:peca_cabo_osso": {
  "pt": "Cabo de Ferramenta de Osso",
  "en": "Bone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_osso"
 },
 "cl:peca_cabo_osso_blaze": {
  "pt": "Cabo de Ferramenta de Osso de Blaze",
  "en": "Blazing Bone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_osso_blaze"
 },
 "cl:peca_cabo_osso_necrotico": {
  "pt": "Cabo de Ferramenta de Osso Necrótico",
  "en": "Necrotic Bone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_osso_necrotico"
 },
 "cl:peca_cabo_osso_venenoso": {
  "pt": "Cabo de Ferramenta de Osso Venenoso",
  "en": "Venombone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_osso_venenoso"
 },
 "cl:peca_cabo_ouro_rosa": {
  "pt": "Cabo de Ferramenta de Ouro Rosa",
  "en": "Rose Gold Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_ouro_rosa"
 },
 "cl:peca_cabo_pedra": {
  "pt": "Cabo de Ferramenta de Pedra",
  "en": "Stone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_pedra"
 },
 "cl:peca_cabo_pedra_branca": {
  "pt": "Cabo de Ferramenta de Pedra Branca",
  "en": "Whitestone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_pedra_branca"
 },
 "cl:peca_cabo_pedra_chamuscada": {
  "pt": "Cabo de Ferramenta de Pedra Chamuscada",
  "en": "Scorched Stone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_pedra_chamuscada"
 },
 "cl:peca_cabo_pedra_refrataria": {
  "pt": "Cabo de Ferramenta de Pedra Carbonizada",
  "en": "Seared Stone Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_pedra_refrataria"
 },
 "cl:peca_cabo_resistente_aco": {
  "pt": "Cabo Resistente de Aço",
  "en": "Steel Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_aco"
 },
 "cl:peca_cabo_resistente_aco_slime": {
  "pt": "Cabo Resistente de Aço de Slime",
  "en": "Slimesteel Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_aco_slime"
 },
 "cl:peca_cabo_resistente_bronze": {
  "pt": "Cabo Resistente de Bronze",
  "en": "Bronze Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_bronze"
 },
 "cl:peca_cabo_resistente_bronze_ametista": {
  "pt": "Cabo Resistente de Bronze de Ametista",
  "en": "Amethyst Bronze Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_bronze_ametista"
 },
 "cl:peca_cabo_resistente_cacto": {
  "pt": "Cabo Resistente de Cacto",
  "en": "Cactus Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_cacto"
 },
 "cl:peca_cabo_resistente_cobalto": {
  "pt": "Cabo Resistente de Cobalto",
  "en": "Cobalt Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_cobalto"
 },
 "cl:peca_cabo_resistente_cobre": {
  "pt": "Cabo Resistente de Cobre",
  "en": "Copper Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_cobre"
 },
 "cl:peca_cabo_resistente_coro": {
  "pt": "Cabo Resistente de Chorus",
  "en": "Chorus Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_coro"
 },
 "cl:peca_cabo_resistente_ferro": {
  "pt": "Cabo Resistente de Ferro",
  "en": "Iron Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_ferro"
 },
 "cl:peca_cabo_resistente_ferro_porco": {
  "pt": "Cabo Resistente de Ferro-Porco",
  "en": "Pig Iron Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_ferro_porco"
 },
 "cl:peca_cabo_resistente_hepatizon": {
  "pt": "Cabo Resistente de Hepatizão",
  "en": "Hepatizon Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_hepatizon"
 },
 "cl:peca_cabo_resistente_madeira": {
  "pt": "Cabo Resistente de Madeira",
  "en": "Wood Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_madeira"
 },
 "cl:peca_cabo_resistente_madeira_slime": {
  "pt": "Cabo Resistente de Madeira de Slime",
  "en": "Slimewood Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_madeira_slime"
 },
 "cl:peca_cabo_resistente_madeira_slime_revestida": {
  "pt": "Cabo Resistente de Madeira de Slime Revestida",
  "en": "Plated Slimewood Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_madeira_slime_revestida"
 },
 "cl:peca_cabo_resistente_madeira_tratada": {
  "pt": "Cabo Resistente de Madeira Tratada",
  "en": "Treated Wood Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_madeira_tratada"
 },
 "cl:peca_cabo_resistente_manyullyn": {
  "pt": "Cabo Resistente de Manyullyn",
  "en": "Manyullyn Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_manyullyn"
 },
 "cl:peca_cabo_resistente_nahuatl": {
  "pt": "Cabo Resistente de Nahuatl",
  "en": "Nahuatl Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_nahuatl"
 },
 "cl:peca_cabo_resistente_obsidiana": {
  "pt": "Cabo Resistente de Obsidiana",
  "en": "Obsidian Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_obsidiana"
 },
 "cl:peca_cabo_resistente_osmio": {
  "pt": "Cabo Resistente de Ósmio",
  "en": "Osmium Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_osmio"
 },
 "cl:peca_cabo_resistente_osso": {
  "pt": "Cabo Resistente de Osso",
  "en": "Bone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_osso"
 },
 "cl:peca_cabo_resistente_osso_blaze": {
  "pt": "Cabo Resistente de Osso de Blaze",
  "en": "Blazing Bone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_osso_blaze"
 },
 "cl:peca_cabo_resistente_osso_necrotico": {
  "pt": "Cabo Resistente de Osso Necrótico",
  "en": "Necrotic Bone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_osso_necrotico"
 },
 "cl:peca_cabo_resistente_osso_venenoso": {
  "pt": "Cabo Resistente de Osso Venenoso",
  "en": "Venombone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_osso_venenoso"
 },
 "cl:peca_cabo_resistente_ouro_rosa": {
  "pt": "Cabo Resistente de Ouro Rosa",
  "en": "Rose Gold Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_ouro_rosa"
 },
 "cl:peca_cabo_resistente_pedra": {
  "pt": "Cabo Resistente de Pedra",
  "en": "Stone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_pedra"
 },
 "cl:peca_cabo_resistente_pedra_branca": {
  "pt": "Cabo Resistente de Pedra Branca",
  "en": "Whitestone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_pedra_branca"
 },
 "cl:peca_cabo_resistente_pedra_chamuscada": {
  "pt": "Cabo Resistente de Pedra Chamuscada",
  "en": "Scorched Stone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_pedra_chamuscada"
 },
 "cl:peca_cabo_resistente_pedra_refrataria": {
  "pt": "Cabo Resistente de Pedra Carbonizada",
  "en": "Seared Stone Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_pedra_refrataria"
 },
 "cl:peca_cabo_resistente_silex": {
  "pt": "Cabo Resistente de Sílex",
  "en": "Flint Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_silex"
 },
 "cl:peca_cabo_resistente_slime_brasa": {
  "pt": "Cabo Resistente de Slime de Brasa",
  "en": "Cinderslime Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_slime_brasa"
 },
 "cl:peca_cabo_resistente_slime_cavaleiro": {
  "pt": "Cabo Resistente de Slime-Cavaleiro",
  "en": "Knightslime Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_slime_cavaleiro"
 },
 "cl:peca_cabo_resistente_slime_rainha": {
  "pt": "Cabo Resistente de Slime da Rainha",
  "en": "Queen's Slime Tough Handle",
  "icone": "textures/items/cl/arte/peca_cabo_resistente_slime_rainha"
 },
 "cl:peca_cabo_silex": {
  "pt": "Cabo de Ferramenta de Sílex",
  "en": "Flint Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_silex"
 },
 "cl:peca_cabo_slime_brasa": {
  "pt": "Cabo de Ferramenta de Slime de Brasa",
  "en": "Cinderslime Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_slime_brasa"
 },
 "cl:peca_cabo_slime_cavaleiro": {
  "pt": "Cabo de Ferramenta de Slime-Cavaleiro",
  "en": "Knightslime Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_slime_cavaleiro"
 },
 "cl:peca_cabo_slime_rainha": {
  "pt": "Cabo de Ferramenta de Slime da Rainha",
  "en": "Queen's Slime Tool Handle",
  "icone": "textures/items/cl/arte/peca_cabo_slime_rainha"
 },
 "cl:peca_guarda_larga_aco": {
  "pt": "Guarda Larga de Aço",
  "en": "Steel Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_aco"
 },
 "cl:peca_guarda_larga_bronze": {
  "pt": "Guarda Larga de Bronze",
  "en": "Bronze Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_bronze"
 },
 "cl:peca_guarda_larga_bronze_ametista": {
  "pt": "Guarda Larga de Bronze de Ametista",
  "en": "Amethyst Bronze Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_bronze_ametista"
 },
 "cl:peca_guarda_larga_cacto": {
  "pt": "Guarda Larga de Cacto",
  "en": "Cactus Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_cacto"
 },
 "cl:peca_guarda_larga_cobre": {
  "pt": "Guarda Larga de Cobre",
  "en": "Copper Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_cobre"
 },
 "cl:peca_guarda_larga_ferro": {
  "pt": "Guarda Larga de Ferro",
  "en": "Iron Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_ferro"
 },
 "cl:peca_guarda_larga_madeira": {
  "pt": "Guarda Larga de Madeira",
  "en": "Wood Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_madeira"
 },
 "cl:peca_guarda_larga_obsidiana": {
  "pt": "Guarda Larga de Obsidiana",
  "en": "Obsidian Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_obsidiana"
 },
 "cl:peca_guarda_larga_osso": {
  "pt": "Guarda Larga de Osso",
  "en": "Bone Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_osso"
 },
 "cl:peca_guarda_larga_ouro_rosa": {
  "pt": "Guarda Larga de Ouro Rosa",
  "en": "Rose Gold Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_ouro_rosa"
 },
 "cl:peca_guarda_larga_pedra": {
  "pt": "Guarda Larga de Pedra",
  "en": "Stone Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_pedra"
 },
 "cl:peca_guarda_larga_silex": {
  "pt": "Guarda Larga de Sílex",
  "en": "Flint Wide Guard",
  "icone": "textures/items/cl/arte/peca_guarda_larga_silex"
 },
 "cl:peca_lamina_espada_aco": {
  "pt": "Lâmina Pequena de Aço",
  "en": "Steel Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_aco"
 },
 "cl:peca_lamina_espada_aco_slime": {
  "pt": "Lâmina Pequena de Aço de Slime",
  "en": "Slimesteel Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_aco_slime"
 },
 "cl:peca_lamina_espada_bronze": {
  "pt": "Lâmina Pequena de Bronze",
  "en": "Bronze Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_bronze"
 },
 "cl:peca_lamina_espada_bronze_ametista": {
  "pt": "Lâmina Pequena de Bronze de Ametista",
  "en": "Amethyst Bronze Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_bronze_ametista"
 },
 "cl:peca_lamina_espada_cacto": {
  "pt": "Lâmina Pequena de Cacto",
  "en": "Cactus Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_cacto"
 },
 "cl:peca_lamina_espada_cobalto": {
  "pt": "Lâmina Pequena de Cobalto",
  "en": "Cobalt Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_cobalto"
 },
 "cl:peca_lamina_espada_cobre": {
  "pt": "Lâmina Pequena de Cobre",
  "en": "Copper Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_cobre"
 },
 "cl:peca_lamina_espada_coro": {
  "pt": "Lâmina Pequena de Chorus",
  "en": "Chorus Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_coro"
 },
 "cl:peca_lamina_espada_ferro": {
  "pt": "Lâmina Pequena de Ferro",
  "en": "Iron Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_ferro"
 },
 "cl:peca_lamina_espada_ferro_porco": {
  "pt": "Lâmina Pequena de Ferro-Porco",
  "en": "Pig Iron Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_ferro_porco"
 },
 "cl:peca_lamina_espada_hepatizon": {
  "pt": "Lâmina Pequena de Hepatizão",
  "en": "Hepatizon Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_hepatizon"
 },
 "cl:peca_lamina_espada_madeira": {
  "pt": "Lâmina Pequena de Madeira",
  "en": "Wood Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_madeira"
 },
 "cl:peca_lamina_espada_madeira_slime": {
  "pt": "Lâmina Pequena de Madeira de Slime",
  "en": "Slimewood Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_madeira_slime"
 },
 "cl:peca_lamina_espada_madeira_slime_revestida": {
  "pt": "Lâmina Pequena de Madeira de Slime Revestida",
  "en": "Plated Slimewood Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_madeira_slime_revestida"
 },
 "cl:peca_lamina_espada_madeira_tratada": {
  "pt": "Lâmina Pequena de Madeira Tratada",
  "en": "Treated Wood Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_madeira_tratada"
 },
 "cl:peca_lamina_espada_manyullyn": {
  "pt": "Lâmina Pequena de Manyullyn",
  "en": "Manyullyn Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_manyullyn"
 },
 "cl:peca_lamina_espada_nahuatl": {
  "pt": "Lâmina Pequena de Nahuatl",
  "en": "Nahuatl Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_nahuatl"
 },
 "cl:peca_lamina_espada_obsidiana": {
  "pt": "Lâmina Pequena de Obsidiana",
  "en": "Obsidian Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_obsidiana"
 },
 "cl:peca_lamina_espada_osmio": {
  "pt": "Lâmina Pequena de Ósmio",
  "en": "Osmium Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osmio"
 },
 "cl:peca_lamina_espada_osso": {
  "pt": "Lâmina Pequena de Osso",
  "en": "Bone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osso"
 },
 "cl:peca_lamina_espada_osso_blaze": {
  "pt": "Lâmina Pequena de Osso de Blaze",
  "en": "Blazing Bone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osso_blaze"
 },
 "cl:peca_lamina_espada_osso_necrotico": {
  "pt": "Lâmina Pequena de Osso Necrótico",
  "en": "Necrotic Bone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osso_necrotico"
 },
 "cl:peca_lamina_espada_osso_venenoso": {
  "pt": "Lâmina Pequena de Osso Venenoso",
  "en": "Venombone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osso_venenoso"
 },
 "cl:peca_lamina_espada_ouro_rosa": {
  "pt": "Lâmina Pequena de Ouro Rosa",
  "en": "Rose Gold Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_ouro_rosa"
 },
 "cl:peca_lamina_espada_pedra": {
  "pt": "Lâmina Pequena de Pedra",
  "en": "Stone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_pedra"
 },
 "cl:peca_lamina_espada_pedra_branca": {
  "pt": "Lâmina Pequena de Pedra Branca",
  "en": "Whitestone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_pedra_branca"
 },
 "cl:peca_lamina_espada_pedra_chamuscada": {
  "pt": "Lâmina Pequena de Pedra Chamuscada",
  "en": "Scorched Stone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_pedra_chamuscada"
 },
 "cl:peca_lamina_espada_pedra_refrataria": {
  "pt": "Lâmina Pequena de Pedra Carbonizada",
  "en": "Seared Stone Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_pedra_refrataria"
 },
 "cl:peca_lamina_espada_silex": {
  "pt": "Lâmina Pequena de Sílex",
  "en": "Flint Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_silex"
 },
 "cl:peca_lamina_espada_slime_brasa": {
  "pt": "Lâmina Pequena de Slime de Brasa",
  "en": "Cinderslime Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_slime_brasa"
 },
 "cl:peca_lamina_espada_slime_cavaleiro": {
  "pt": "Lâmina Pequena de Slime-Cavaleiro",
  "en": "Knightslime Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_slime_cavaleiro"
 },
 "cl:peca_lamina_espada_slime_rainha": {
  "pt": "Lâmina Pequena de Slime da Rainha",
  "en": "Queen's Slime Small Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_slime_rainha"
 },
 "cl:peca_lamina_larga_aco": {
  "pt": "Lâmina Grande de Aço",
  "en": "Steel Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_aco"
 },
 "cl:peca_lamina_larga_aco_slime": {
  "pt": "Lâmina Grande de Aço de Slime",
  "en": "Slimesteel Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_aco_slime"
 },
 "cl:peca_lamina_larga_bronze": {
  "pt": "Lâmina Grande de Bronze",
  "en": "Bronze Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_bronze"
 },
 "cl:peca_lamina_larga_bronze_ametista": {
  "pt": "Lâmina Grande de Bronze de Ametista",
  "en": "Amethyst Bronze Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_bronze_ametista"
 },
 "cl:peca_lamina_larga_cobalto": {
  "pt": "Lâmina Grande de Cobalto",
  "en": "Cobalt Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_cobalto"
 },
 "cl:peca_lamina_larga_cobre": {
  "pt": "Lâmina Grande de Cobre",
  "en": "Copper Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_cobre"
 },
 "cl:peca_lamina_larga_coro": {
  "pt": "Lâmina Grande de Chorus",
  "en": "Chorus Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_coro"
 },
 "cl:peca_lamina_larga_ferro": {
  "pt": "Lâmina Grande de Ferro",
  "en": "Iron Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_ferro"
 },
 "cl:peca_lamina_larga_ferro_porco": {
  "pt": "Lâmina Grande de Ferro-Porco",
  "en": "Pig Iron Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_ferro_porco"
 },
 "cl:peca_lamina_larga_hepatizon": {
  "pt": "Lâmina Grande de Hepatizão",
  "en": "Hepatizon Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_hepatizon"
 },
 "cl:peca_lamina_larga_madeira": {
  "pt": "Lâmina Grande de Madeira",
  "en": "Wood Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_madeira"
 },
 "cl:peca_lamina_larga_madeira_slime": {
  "pt": "Lâmina Grande de Madeira de Slime",
  "en": "Slimewood Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_madeira_slime"
 },
 "cl:peca_lamina_larga_madeira_slime_revestida": {
  "pt": "Lâmina Grande de Madeira de Slime Revestida",
  "en": "Plated Slimewood Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_madeira_slime_revestida"
 },
 "cl:peca_lamina_larga_madeira_tratada": {
  "pt": "Lâmina Grande de Madeira Tratada",
  "en": "Treated Wood Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_madeira_tratada"
 },
 "cl:peca_lamina_larga_manyullyn": {
  "pt": "Lâmina Grande de Manyullyn",
  "en": "Manyullyn Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_manyullyn"
 },
 "cl:peca_lamina_larga_nahuatl": {
  "pt": "Lâmina Grande de Nahuatl",
  "en": "Nahuatl Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_nahuatl"
 },
 "cl:peca_lamina_larga_osmio": {
  "pt": "Lâmina Grande de Ósmio",
  "en": "Osmium Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_osmio"
 },
 "cl:peca_lamina_larga_osso": {
  "pt": "Lâmina Grande de Osso",
  "en": "Bone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_osso"
 },
 "cl:peca_lamina_larga_osso_blaze": {
  "pt": "Lâmina Grande de Osso de Blaze",
  "en": "Blazing Bone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_osso_blaze"
 },
 "cl:peca_lamina_larga_osso_necrotico": {
  "pt": "Lâmina Grande de Osso Necrótico",
  "en": "Necrotic Bone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_osso_necrotico"
 },
 "cl:peca_lamina_larga_osso_venenoso": {
  "pt": "Lâmina Grande de Osso Venenoso",
  "en": "Venombone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_osso_venenoso"
 },
 "cl:peca_lamina_larga_ouro_rosa": {
  "pt": "Lâmina Grande de Ouro Rosa",
  "en": "Rose Gold Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_ouro_rosa"
 },
 "cl:peca_lamina_larga_pedra": {
  "pt": "Lâmina Grande de Pedra",
  "en": "Stone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_pedra"
 },
 "cl:peca_lamina_larga_pedra_branca": {
  "pt": "Lâmina Grande de Pedra Branca",
  "en": "Whitestone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_pedra_branca"
 },
 "cl:peca_lamina_larga_pedra_chamuscada": {
  "pt": "Lâmina Grande de Pedra Chamuscada",
  "en": "Scorched Stone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_pedra_chamuscada"
 },
 "cl:peca_lamina_larga_pedra_refrataria": {
  "pt": "Lâmina Grande de Pedra Carbonizada",
  "en": "Seared Stone Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_pedra_refrataria"
 },
 "cl:peca_lamina_larga_silex": {
  "pt": "Lâmina Grande de Sílex",
  "en": "Flint Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_silex"
 },
 "cl:peca_lamina_larga_slime_brasa": {
  "pt": "Lâmina Grande de Slime de Brasa",
  "en": "Cinderslime Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_slime_brasa"
 },
 "cl:peca_lamina_larga_slime_cavaleiro": {
  "pt": "Lâmina Grande de Slime-Cavaleiro",
  "en": "Knightslime Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_slime_cavaleiro"
 },
 "cl:peca_lamina_larga_slime_rainha": {
  "pt": "Lâmina Grande de Slime da Rainha",
  "en": "Queen's Slime Broad Blade",
  "icone": "textures/items/cl/arte/peca_lamina_larga_slime_rainha"
 },
 "cl:peca_ligacao_aco": {
  "pt": "Ligamento de Ferramenta de Aço",
  "en": "Steel Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_aco"
 },
 "cl:peca_ligacao_aco_slime": {
  "pt": "Ligamento de Ferramenta de Aço de Slime",
  "en": "Slimesteel Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_aco_slime"
 },
 "cl:peca_ligacao_bronze": {
  "pt": "Ligamento de Ferramenta de Bronze",
  "en": "Bronze Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_bronze"
 },
 "cl:peca_ligacao_bronze_ametista": {
  "pt": "Ligamento de Ferramenta de Bronze de Ametista",
  "en": "Amethyst Bronze Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_bronze_ametista"
 },
 "cl:peca_ligacao_cacto": {
  "pt": "Ligamento de Ferramenta de Cacto",
  "en": "Cactus Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_cacto"
 },
 "cl:peca_ligacao_cobalto": {
  "pt": "Ligamento de Ferramenta de Cobalto",
  "en": "Cobalt Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_cobalto"
 },
 "cl:peca_ligacao_cobre": {
  "pt": "Ligamento de Ferramenta de Cobre",
  "en": "Copper Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_cobre"
 },
 "cl:peca_ligacao_corda": {
  "pt": "Ligamento de Ferramenta de Corda",
  "en": "String Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_corda"
 },
 "cl:peca_ligacao_coro": {
  "pt": "Ligamento de Ferramenta de Chorus",
  "en": "Chorus Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_coro"
 },
 "cl:peca_ligacao_couro": {
  "pt": "Ligamento de Ferramenta de Couro",
  "en": "Leather Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_couro"
 },
 "cl:peca_ligacao_ferro": {
  "pt": "Ligamento de Ferramenta de Ferro",
  "en": "Iron Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_ferro"
 },
 "cl:peca_ligacao_ferro_porco": {
  "pt": "Ligamento de Ferramenta de Ferro-Porco",
  "en": "Pig Iron Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_ferro_porco"
 },
 "cl:peca_ligacao_hepatizon": {
  "pt": "Ligamento de Ferramenta de Hepatizão",
  "en": "Hepatizon Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_hepatizon"
 },
 "cl:peca_ligacao_linha_negra": {
  "pt": "Ligamento de Ferramenta de Linha Negra",
  "en": "Darkthread Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_linha_negra"
 },
 "cl:peca_ligacao_madeira": {
  "pt": "Ligamento de Ferramenta de Madeira",
  "en": "Wood Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_madeira"
 },
 "cl:peca_ligacao_madeira_slime": {
  "pt": "Ligamento de Ferramenta de Madeira de Slime",
  "en": "Slimewood Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_madeira_slime"
 },
 "cl:peca_ligacao_madeira_slime_revestida": {
  "pt": "Ligamento de Ferramenta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_madeira_slime_revestida"
 },
 "cl:peca_ligacao_madeira_tratada": {
  "pt": "Ligamento de Ferramenta de Madeira Tratada",
  "en": "Treated Wood Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_madeira_tratada"
 },
 "cl:peca_ligacao_manyullyn": {
  "pt": "Ligamento de Ferramenta de Manyullyn",
  "en": "Manyullyn Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_manyullyn"
 },
 "cl:peca_ligacao_nahuatl": {
  "pt": "Ligamento de Ferramenta de Nahuatl",
  "en": "Nahuatl Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_nahuatl"
 },
 "cl:peca_ligacao_obsidiana": {
  "pt": "Ligamento de Ferramenta de Obsidiana",
  "en": "Obsidian Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_obsidiana"
 },
 "cl:peca_ligacao_osmio": {
  "pt": "Ligamento de Ferramenta de Ósmio",
  "en": "Osmium Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osmio"
 },
 "cl:peca_ligacao_osso": {
  "pt": "Ligamento de Ferramenta de Osso",
  "en": "Bone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osso"
 },
 "cl:peca_ligacao_osso_blaze": {
  "pt": "Ligamento de Ferramenta de Osso de Blaze",
  "en": "Blazing Bone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osso_blaze"
 },
 "cl:peca_ligacao_osso_necrotico": {
  "pt": "Ligamento de Ferramenta de Osso Necrótico",
  "en": "Necrotic Bone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osso_necrotico"
 },
 "cl:peca_ligacao_osso_venenoso": {
  "pt": "Ligamento de Ferramenta de Osso Venenoso",
  "en": "Venombone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osso_venenoso"
 },
 "cl:peca_ligacao_ouro_rosa": {
  "pt": "Ligamento de Ferramenta de Ouro Rosa",
  "en": "Rose Gold Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_ouro_rosa"
 },
 "cl:peca_ligacao_pedra": {
  "pt": "Ligamento de Ferramenta de Pedra",
  "en": "Stone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_pedra"
 },
 "cl:peca_ligacao_pedra_branca": {
  "pt": "Ligamento de Ferramenta de Pedra Branca",
  "en": "Whitestone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_pedra_branca"
 },
 "cl:peca_ligacao_pedra_chamuscada": {
  "pt": "Ligamento de Ferramenta de Pedra Chamuscada",
  "en": "Scorched Stone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_pedra_chamuscada"
 },
 "cl:peca_ligacao_pedra_refrataria": {
  "pt": "Ligamento de Ferramenta de Pedra Carbonizada",
  "en": "Seared Stone Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_pedra_refrataria"
 },
 "cl:peca_ligacao_resistente_aco": {
  "pt": "Colar Resistente de Aço",
  "en": "Steel Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_aco"
 },
 "cl:peca_ligacao_resistente_aco_slime": {
  "pt": "Colar Resistente de Aço de Slime",
  "en": "Slimesteel Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_aco_slime"
 },
 "cl:peca_ligacao_resistente_bronze": {
  "pt": "Colar Resistente de Bronze",
  "en": "Bronze Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_bronze"
 },
 "cl:peca_ligacao_resistente_bronze_ametista": {
  "pt": "Colar Resistente de Bronze de Ametista",
  "en": "Amethyst Bronze Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_bronze_ametista"
 },
 "cl:peca_ligacao_resistente_cacto": {
  "pt": "Colar Resistente de Cacto",
  "en": "Cactus Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_cacto"
 },
 "cl:peca_ligacao_resistente_cobalto": {
  "pt": "Colar Resistente de Cobalto",
  "en": "Cobalt Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_cobalto"
 },
 "cl:peca_ligacao_resistente_cobre": {
  "pt": "Colar Resistente de Cobre",
  "en": "Copper Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_cobre"
 },
 "cl:peca_ligacao_resistente_corda": {
  "pt": "Colar Resistente de Corda",
  "en": "String Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_corda"
 },
 "cl:peca_ligacao_resistente_coro": {
  "pt": "Colar Resistente de Chorus",
  "en": "Chorus Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_coro"
 },
 "cl:peca_ligacao_resistente_couro": {
  "pt": "Colar Resistente de Couro",
  "en": "Leather Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_couro"
 },
 "cl:peca_ligacao_resistente_ferro": {
  "pt": "Colar Resistente de Ferro",
  "en": "Iron Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_ferro"
 },
 "cl:peca_ligacao_resistente_ferro_porco": {
  "pt": "Colar Resistente de Ferro-Porco",
  "en": "Pig Iron Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_ferro_porco"
 },
 "cl:peca_ligacao_resistente_hepatizon": {
  "pt": "Colar Resistente de Hepatizão",
  "en": "Hepatizon Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_hepatizon"
 },
 "cl:peca_ligacao_resistente_linha_negra": {
  "pt": "Colar Resistente de Linha Negra",
  "en": "Darkthread Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_linha_negra"
 },
 "cl:peca_ligacao_resistente_madeira": {
  "pt": "Colar Resistente de Madeira",
  "en": "Wood Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_madeira"
 },
 "cl:peca_ligacao_resistente_madeira_slime": {
  "pt": "Colar Resistente de Madeira de Slime",
  "en": "Slimewood Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_madeira_slime"
 },
 "cl:peca_ligacao_resistente_madeira_slime_revestida": {
  "pt": "Colar Resistente de Madeira de Slime Revestida",
  "en": "Plated Slimewood Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_madeira_slime_revestida"
 },
 "cl:peca_ligacao_resistente_madeira_tratada": {
  "pt": "Colar Resistente de Madeira Tratada",
  "en": "Treated Wood Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_madeira_tratada"
 },
 "cl:peca_ligacao_resistente_manyullyn": {
  "pt": "Colar Resistente de Manyullyn",
  "en": "Manyullyn Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_manyullyn"
 },
 "cl:peca_ligacao_resistente_nahuatl": {
  "pt": "Colar Resistente de Nahuatl",
  "en": "Nahuatl Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_nahuatl"
 },
 "cl:peca_ligacao_resistente_obsidiana": {
  "pt": "Colar Resistente de Obsidiana",
  "en": "Obsidian Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_obsidiana"
 },
 "cl:peca_ligacao_resistente_osmio": {
  "pt": "Colar Resistente de Ósmio",
  "en": "Osmium Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_osmio"
 },
 "cl:peca_ligacao_resistente_osso": {
  "pt": "Colar Resistente de Osso",
  "en": "Bone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_osso"
 },
 "cl:peca_ligacao_resistente_osso_blaze": {
  "pt": "Colar Resistente de Osso de Blaze",
  "en": "Blazing Bone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_osso_blaze"
 },
 "cl:peca_ligacao_resistente_osso_necrotico": {
  "pt": "Colar Resistente de Osso Necrótico",
  "en": "Necrotic Bone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_osso_necrotico"
 },
 "cl:peca_ligacao_resistente_osso_venenoso": {
  "pt": "Colar Resistente de Osso Venenoso",
  "en": "Venombone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_osso_venenoso"
 },
 "cl:peca_ligacao_resistente_ouro_rosa": {
  "pt": "Colar Resistente de Ouro Rosa",
  "en": "Rose Gold Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_ouro_rosa"
 },
 "cl:peca_ligacao_resistente_pedra": {
  "pt": "Colar Resistente de Pedra",
  "en": "Stone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_pedra"
 },
 "cl:peca_ligacao_resistente_pedra_branca": {
  "pt": "Colar Resistente de Pedra Branca",
  "en": "Whitestone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_pedra_branca"
 },
 "cl:peca_ligacao_resistente_pedra_chamuscada": {
  "pt": "Colar Resistente de Pedra Chamuscada",
  "en": "Scorched Stone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_pedra_chamuscada"
 },
 "cl:peca_ligacao_resistente_pedra_refrataria": {
  "pt": "Colar Resistente de Pedra Carbonizada",
  "en": "Seared Stone Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_pedra_refrataria"
 },
 "cl:peca_ligacao_resistente_silex": {
  "pt": "Colar Resistente de Sílex",
  "en": "Flint Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_silex"
 },
 "cl:peca_ligacao_resistente_slime_brasa": {
  "pt": "Colar Resistente de Slime de Brasa",
  "en": "Cinderslime Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_slime_brasa"
 },
 "cl:peca_ligacao_resistente_slime_cavaleiro": {
  "pt": "Colar Resistente de Slime-Cavaleiro",
  "en": "Knightslime Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_slime_cavaleiro"
 },
 "cl:peca_ligacao_resistente_slime_rainha": {
  "pt": "Colar Resistente de Slime da Rainha",
  "en": "Queen's Slime Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_slime_rainha"
 },
 "cl:peca_ligacao_resistente_trepadeira": {
  "pt": "Colar Resistente de Trepadeira",
  "en": "Vine Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_trepadeira"
 },
 "cl:peca_ligacao_resistente_trepadeira_chorona": {
  "pt": "Colar Resistente de Trepadeira Chorona",
  "en": "Weeping Vine Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_trepadeira_chorona"
 },
 "cl:peca_ligacao_resistente_trepadeira_retorcida": {
  "pt": "Colar Resistente de Trepadeira Retorcida",
  "en": "Twisting Vine Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_trepadeira_retorcida"
 },
 "cl:peca_ligacao_resistente_trepadeira_slime_ceu": {
  "pt": "Colar Resistente de Trepadeira de Slime-do-Céu",
  "en": "Slimy Vine Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_trepadeira_slime_ceu"
 },
 "cl:peca_ligacao_resistente_trepadeira_slime_ender": {
  "pt": "Colar Resistente de Trepadeira de Slime-do-Ender",
  "en": "Slimy Vine Tough Collar",
  "icone": "textures/items/cl/arte/peca_ligacao_resistente_trepadeira_slime_ender"
 },
 "cl:peca_ligacao_silex": {
  "pt": "Ligamento de Ferramenta de Sílex",
  "en": "Flint Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_silex"
 },
 "cl:peca_ligacao_slime_brasa": {
  "pt": "Ligamento de Ferramenta de Slime de Brasa",
  "en": "Cinderslime Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_slime_brasa"
 },
 "cl:peca_ligacao_slime_cavaleiro": {
  "pt": "Ligamento de Ferramenta de Slime-Cavaleiro",
  "en": "Knightslime Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_slime_cavaleiro"
 },
 "cl:peca_ligacao_slime_rainha": {
  "pt": "Ligamento de Ferramenta de Slime da Rainha",
  "en": "Queen's Slime Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_slime_rainha"
 },
 "cl:peca_ligacao_trepadeira": {
  "pt": "Ligamento de Ferramenta de Trepadeira",
  "en": "Vine Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_trepadeira"
 },
 "cl:peca_ligacao_trepadeira_chorona": {
  "pt": "Ligamento de Ferramenta de Trepadeira Chorona",
  "en": "Weeping Vine Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_trepadeira_chorona"
 },
 "cl:peca_ligacao_trepadeira_retorcida": {
  "pt": "Ligamento de Ferramenta de Trepadeira Retorcida",
  "en": "Twisting Vine Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_trepadeira_retorcida"
 },
 "cl:peca_ligacao_trepadeira_slime_ceu": {
  "pt": "Ligamento de Ferramenta de Trepadeira de Slime-do-Céu",
  "en": "Slimy Vine Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_trepadeira_slime_ceu"
 },
 "cl:peca_ligacao_trepadeira_slime_ender": {
  "pt": "Ligamento de Ferramenta de Trepadeira de Slime-do-Ender",
  "en": "Slimy Vine Tool Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_trepadeira_slime_ender"
 },
 "cl:peca_placa_grande_aco": {
  "pt": "Placa Grande de Aço",
  "en": "Steel Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_aco"
 },
 "cl:peca_placa_grande_aco_slime": {
  "pt": "Placa Grande de Aço de Slime",
  "en": "Slimesteel Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_aco_slime"
 },
 "cl:peca_placa_grande_bronze": {
  "pt": "Placa Grande de Bronze",
  "en": "Bronze Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_bronze"
 },
 "cl:peca_placa_grande_bronze_ametista": {
  "pt": "Placa Grande de Bronze de Ametista",
  "en": "Amethyst Bronze Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_bronze_ametista"
 },
 "cl:peca_placa_grande_cacto": {
  "pt": "Placa Grande de Cacto",
  "en": "Cactus Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_cacto"
 },
 "cl:peca_placa_grande_cobalto": {
  "pt": "Placa Grande de Cobalto",
  "en": "Cobalt Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_cobalto"
 },
 "cl:peca_placa_grande_cobre": {
  "pt": "Placa Grande de Cobre",
  "en": "Copper Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_cobre"
 },
 "cl:peca_placa_grande_coro": {
  "pt": "Placa Grande de Chorus",
  "en": "Chorus Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_coro"
 },
 "cl:peca_placa_grande_ferro": {
  "pt": "Placa Grande de Ferro",
  "en": "Iron Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_ferro"
 },
 "cl:peca_placa_grande_ferro_porco": {
  "pt": "Placa Grande de Ferro-Porco",
  "en": "Pig Iron Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_ferro_porco"
 },
 "cl:peca_placa_grande_hepatizon": {
  "pt": "Placa Grande de Hepatizão",
  "en": "Hepatizon Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_hepatizon"
 },
 "cl:peca_placa_grande_madeira": {
  "pt": "Placa Grande de Madeira",
  "en": "Wood Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_madeira"
 },
 "cl:peca_placa_grande_madeira_slime": {
  "pt": "Placa Grande de Madeira de Slime",
  "en": "Slimewood Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_madeira_slime"
 },
 "cl:peca_placa_grande_madeira_slime_revestida": {
  "pt": "Placa Grande de Madeira de Slime Revestida",
  "en": "Plated Slimewood Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_madeira_slime_revestida"
 },
 "cl:peca_placa_grande_madeira_tratada": {
  "pt": "Placa Grande de Madeira Tratada",
  "en": "Treated Wood Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_madeira_tratada"
 },
 "cl:peca_placa_grande_manyullyn": {
  "pt": "Placa Grande de Manyullyn",
  "en": "Manyullyn Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_manyullyn"
 },
 "cl:peca_placa_grande_nahuatl": {
  "pt": "Placa Grande de Nahuatl",
  "en": "Nahuatl Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_nahuatl"
 },
 "cl:peca_placa_grande_obsidiana": {
  "pt": "Placa Grande de Obsidiana",
  "en": "Obsidian Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_obsidiana"
 },
 "cl:peca_placa_grande_osmio": {
  "pt": "Placa Grande de Ósmio",
  "en": "Osmium Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_osmio"
 },
 "cl:peca_placa_grande_osso": {
  "pt": "Placa Grande de Osso",
  "en": "Bone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_osso"
 },
 "cl:peca_placa_grande_osso_blaze": {
  "pt": "Placa Grande de Osso de Blaze",
  "en": "Blazing Bone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_osso_blaze"
 },
 "cl:peca_placa_grande_osso_necrotico": {
  "pt": "Placa Grande de Osso Necrótico",
  "en": "Necrotic Bone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_osso_necrotico"
 },
 "cl:peca_placa_grande_osso_venenoso": {
  "pt": "Placa Grande de Osso Venenoso",
  "en": "Venombone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_osso_venenoso"
 },
 "cl:peca_placa_grande_ouro_rosa": {
  "pt": "Placa Grande de Ouro Rosa",
  "en": "Rose Gold Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_ouro_rosa"
 },
 "cl:peca_placa_grande_pedra": {
  "pt": "Placa Grande de Pedra",
  "en": "Stone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_pedra"
 },
 "cl:peca_placa_grande_pedra_branca": {
  "pt": "Placa Grande de Pedra Branca",
  "en": "Whitestone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_pedra_branca"
 },
 "cl:peca_placa_grande_pedra_chamuscada": {
  "pt": "Placa Grande de Pedra Chamuscada",
  "en": "Scorched Stone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_pedra_chamuscada"
 },
 "cl:peca_placa_grande_pedra_refrataria": {
  "pt": "Placa Grande de Pedra Carbonizada",
  "en": "Seared Stone Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_pedra_refrataria"
 },
 "cl:peca_placa_grande_silex": {
  "pt": "Placa Grande de Sílex",
  "en": "Flint Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_silex"
 },
 "cl:peca_placa_grande_slime_brasa": {
  "pt": "Placa Grande de Slime de Brasa",
  "en": "Cinderslime Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_slime_brasa"
 },
 "cl:peca_placa_grande_slime_cavaleiro": {
  "pt": "Placa Grande de Slime-Cavaleiro",
  "en": "Knightslime Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_slime_cavaleiro"
 },
 "cl:peca_placa_grande_slime_rainha": {
  "pt": "Placa Grande de Slime da Rainha",
  "en": "Queen's Slime Large Plate",
  "icone": "textures/items/cl/arte/peca_placa_grande_slime_rainha"
 },
 "cl:peca_travessa_aco": {
  "pt": "Travessa de Aço",
  "en": "Steel Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_aco"
 },
 "cl:peca_travessa_bronze": {
  "pt": "Travessa de Bronze",
  "en": "Bronze Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_bronze"
 },
 "cl:peca_travessa_bronze_ametista": {
  "pt": "Travessa de Bronze de Ametista",
  "en": "Amethyst Bronze Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_bronze_ametista"
 },
 "cl:peca_travessa_cacto": {
  "pt": "Travessa de Cacto",
  "en": "Cactus Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_cacto"
 },
 "cl:peca_travessa_cobre": {
  "pt": "Travessa de Cobre",
  "en": "Copper Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_cobre"
 },
 "cl:peca_travessa_ferro": {
  "pt": "Travessa de Ferro",
  "en": "Iron Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_ferro"
 },
 "cl:peca_travessa_madeira": {
  "pt": "Travessa de Madeira",
  "en": "Wood Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_madeira"
 },
 "cl:peca_travessa_obsidiana": {
  "pt": "Travessa de Obsidiana",
  "en": "Obsidian Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_obsidiana"
 },
 "cl:peca_travessa_osso": {
  "pt": "Travessa de Osso",
  "en": "Bone Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_osso"
 },
 "cl:peca_travessa_ouro_rosa": {
  "pt": "Travessa de Ouro Rosa",
  "en": "Rose Gold Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_ouro_rosa"
 },
 "cl:peca_travessa_pedra": {
  "pt": "Travessa de Pedra",
  "en": "Stone Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_pedra"
 },
 "cl:peca_travessa_silex": {
  "pt": "Travessa de Sílex",
  "en": "Flint Crossbar",
  "icone": "textures/items/cl/arte/peca_travessa_silex"
 },
 "cl:pedacos_frango": {
  "pt": "Pedaços de Frango",
  "en": "Chicken Cuts",
  "icone": "textures/items/cl/arte/pedacos_frango"
 },
 "cl:pedacos_frango_cozidos": {
  "pt": "Pedaços de Frango Cozidos",
  "en": "Cooked Chicken Cuts",
  "icone": "textures/items/cl/arte/pedacos_frango_cozidos"
 },
 "cl:pedra_caminho": {
  "pt": "Pedra do Caminho",
  "en": "Waystone",
  "icone": "textures/items/cl/blocos/pedra_caminho"
 },
 "cl:pedra_ceu_lisa": {
  "pt": "Pedra do Céu Lisa",
  "en": "Sky Stone Block",
  "icone": "textures/blocks/cl/arte/pedra_ceu_lisa"
 },
 "cl:pedra_chamuscada_bloco": {
  "pt": "Pedra Chamuscada",
  "en": "Scorched Stone",
  "icone": "textures/blocks/cl/arte/pedra_chamuscada_bloco_topo"
 },
 "cl:pedra_chamuscada_entalhada": {
  "pt": "Pedra Chamuscada Entalhada",
  "en": "Chiseled Scorched Stone",
  "icone": "textures/blocks/cl/arte/pedra_chamuscada_entalhada"
 },
 "cl:pedra_chamuscada_polida": {
  "pt": "Pedra Chamuscada Polida",
  "en": "Polished Scorched Stone",
  "icone": "textures/blocks/cl/arte/pedra_chamuscada_polida_topo"
 },
 "cl:pedra_entalhado": {
  "pt": "Pedra Entalhado",
  "en": "Carved Stone",
  "icone": "textures/items/cl/blocos/pedra_entalhado"
 },
 "cl:pedra_ladrilho": {
  "pt": "Pedra Ladrilho",
  "en": "Tiles Stone",
  "icone": "textures/items/cl/blocos/pedra_ladrilho"
 },
 "cl:pedra_liso": {
  "pt": "Pedra Liso",
  "en": "Smooth Stone",
  "icone": "textures/items/cl/blocos/pedra_liso"
 },
 "cl:pedra_mosaico": {
  "pt": "Pedra Mosaico",
  "en": "Mosaic Stone",
  "icone": "textures/items/cl/blocos/pedra_mosaico"
 },
 "cl:pedra_pilar": {
  "pt": "Pedra Pilar",
  "en": "Pillar Stone",
  "icone": "textures/items/cl/blocos/pedra_pilar"
 },
 "cl:pedra_polido": {
  "pt": "Pedra Polido",
  "en": "Polished Stone",
  "icone": "textures/items/cl/blocos/pedra_polido"
 },
 "cl:pedra_refrataria_bloco": {
  "pt": "Pedra Refratária",
  "en": "Seared Stone",
  "icone": "textures/blocks/cl/arte/pedra_refrataria_bloco"
 },
 "cl:pedra_tijolos": {
  "pt": "Pedra Tijolos",
  "en": "Bricks Stone",
  "icone": "textures/items/cl/blocos/pedra_tijolos"
 },
 "cl:pedra_tijolos_pequenos": {
  "pt": "Pedra Tijolinhos",
  "en": "Small Bricks Stone",
  "icone": "textures/items/cl/blocos/pedra_tijolos_pequenos"
 },
 "cl:pedra_viagem": {
  "pt": "Pedra de Viagem",
  "en": "Warp Stone",
  "icone": "textures/items/cl/arte/pedra_viagem"
 },
 "cl:pedregulho_comprimido_1": {
  "pt": "Pedregulho Comprimido (1x)",
  "en": "Compressed Cobblestone (1x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_1"
 },
 "cl:pedregulho_comprimido_2": {
  "pt": "Pedregulho Comprimido (2x)",
  "en": "Compressed Cobblestone (2x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_2"
 },
 "cl:pedregulho_comprimido_3": {
  "pt": "Pedregulho Comprimido (3x)",
  "en": "Compressed Cobblestone (3x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_3"
 },
 "cl:pedregulho_comprimido_4": {
  "pt": "Pedregulho Comprimido (4x)",
  "en": "Compressed Cobblestone (4x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_4"
 },
 "cl:pedregulho_comprimido_5": {
  "pt": "Pedregulho Comprimido (5x)",
  "en": "Compressed Cobblestone (5x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_5"
 },
 "cl:pedregulho_comprimido_6": {
  "pt": "Pedregulho Comprimido (6x)",
  "en": "Compressed Cobblestone (6x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_6"
 },
 "cl:pedregulho_comprimido_7": {
  "pt": "Pedregulho Comprimido (7x)",
  "en": "Compressed Cobblestone (7x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_7"
 },
 "cl:pedregulho_comprimido_8": {
  "pt": "Pedregulho Comprimido (8x)",
  "en": "Compressed Cobblestone (8x)",
  "icone": "textures/items/cl/blocos/pedregulho_comprimido_8"
 },
 "cl:pedregulho_refratario": {
  "pt": "Pedregulho Refratário",
  "en": "Seared Cobblestone",
  "icone": "textures/blocks/cl/arte/pedregulho_refratario"
 },
 "cl:pedreira": {
  "pt": "Pedreira",
  "en": "Quarry",
  "icone": "textures/items/cl/arte/blocos/pedreira"
 },
 "cl:pedrinha": {
  "pt": "Pedrinha",
  "en": "Pebble",
  "icone": "textures/items/cl/arte/pedrinha"
 },
 "cl:peitoral_placa_aco": {
  "pt": "Peitoral de Placa de Aço",
  "en": "Steel Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_aco"
 },
 "cl:peitoral_placa_aco_slime": {
  "pt": "Peitoral de Placa de Aço de Slime",
  "en": "Slimesteel Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_aco_slime"
 },
 "cl:peitoral_placa_aluminio": {
  "pt": "Peitoral de Placa de Alumínio",
  "en": "Aluminum Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_aluminio"
 },
 "cl:peitoral_placa_bronze": {
  "pt": "Peitoral de Placa de Bronze",
  "en": "Bronze Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_bronze"
 },
 "cl:peitoral_placa_bronze_ametista": {
  "pt": "Peitoral de Placa de Bronze de Ametista",
  "en": "Amethyst Bronze Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_bronze_ametista"
 },
 "cl:peitoral_placa_cobalto": {
  "pt": "Peitoral de Placa de Cobalto",
  "en": "Cobalt Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_cobalto"
 },
 "cl:peitoral_placa_cobre": {
  "pt": "Peitoral de Placa de Cobre",
  "en": "Copper Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_cobre"
 },
 "cl:peitoral_placa_ferro": {
  "pt": "Peitoral de Placa de Ferro",
  "en": "Iron Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_ferro"
 },
 "cl:peitoral_placa_ferro_porco": {
  "pt": "Peitoral de Placa de Ferro-Porco",
  "en": "Pig Iron Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_ferro_porco"
 },
 "cl:peitoral_placa_hepatizon": {
  "pt": "Peitoral de Placa de Hepatizão",
  "en": "Hepatizon Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_hepatizon"
 },
 "cl:peitoral_placa_manyullyn": {
  "pt": "Peitoral de Placa de Manyullyn",
  "en": "Manyullyn Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_manyullyn"
 },
 "cl:peitoral_placa_obsidiana": {
  "pt": "Peitoral de Placa de Obsidiana",
  "en": "Obsidian Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_obsidiana"
 },
 "cl:peitoral_placa_osmio": {
  "pt": "Peitoral de Placa de Ósmio",
  "en": "Osmium Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_osmio"
 },
 "cl:peitoral_placa_ouro": {
  "pt": "Peitoral de Placa de Ouro",
  "en": "Gold Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_ouro"
 },
 "cl:peitoral_placa_ouro_rosa": {
  "pt": "Peitoral de Placa de Ouro Rosa",
  "en": "Rose Gold Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_ouro_rosa"
 },
 "cl:peitoral_placa_pedra_chamuscada": {
  "pt": "Peitoral de Placa de Pedra Chamuscada",
  "en": "Scorched Stone Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_pedra_chamuscada"
 },
 "cl:peitoral_placa_pedra_refrataria": {
  "pt": "Peitoral de Placa de Pedra Carbonizada",
  "en": "Seared Stone Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_pedra_refrataria"
 },
 "cl:peitoral_placa_slime_brasa": {
  "pt": "Peitoral de Placa de Slime de Brasa",
  "en": "Cinderslime Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_slime_brasa"
 },
 "cl:peitoral_placa_slime_cavaleiro": {
  "pt": "Peitoral de Placa de Slime-Cavaleiro",
  "en": "Knightslime Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_slime_cavaleiro"
 },
 "cl:peitoral_placa_slime_rainha": {
  "pt": "Peitoral de Placa de Slime da Rainha",
  "en": "Queen's Slime Plate Chestplate",
  "icone": "textures/items/cl/arte/peitoral_placa_slime_rainha"
 },
 "cl:peitoral_slime": {
  "pt": "Peitoral de Slime",
  "en": "Slimesuit Chestplate",
  "icone": "textures/items/cl/arte/peitoral_slime"
 },
 "cl:peitoral_viajante": {
  "pt": "Colete de Viajante",
  "en": "Traveler's Vest",
  "icone": "textures/items/cl/arte/peitoral_viajante"
 },
 "cl:pemmican": {
  "pt": "Pemmican",
  "en": "Pemmican",
  "icone": "textures/items/cl/arte/pemmican"
 },
 "cl:peneira": {
  "pt": "Peneira",
  "en": "Sieve",
  "icone": "textures/items/cl/arte/blocos/peneira"
 },
 "cl:peneira_automatica": {
  "pt": "Peneira Automática",
  "en": "Automatic Sieve",
  "icone": "textures/items/cl/arte/blocos/peneira_automatica"
 },
 "cl:pepita_aco_end": {
  "pt": "Pepita de Aço do End",
  "en": "End Steel Nugget",
  "icone": "textures/items/cl/arte/pepita_aco_end"
 },
 "cl:pepita_aco_negro": {
  "pt": "Pepita de Aço Sombrio",
  "en": "Dark Steel Nugget",
  "icone": "textures/items/cl/arte/pepita_aco_negro"
 },
 "cl:pepita_almario": {
  "pt": "Pepita de Almário",
  "en": "Soularium Nugget",
  "icone": "textures/items/cl/arte/pepita_almario"
 },
 "cl:pepita_cobalto": {
  "pt": "Pepita de Cobalto",
  "en": "Cobalt Nugget",
  "icone": "textures/items/cl/arte/pepita_cobalto"
 },
 "cl:pepita_experiencia": {
  "pt": "Pepita de Experiência",
  "en": "Nugget of Experience",
  "icone": "textures/items/cl/c/pepita_experiencia"
 },
 "cl:pepita_ferro_condutor": {
  "pt": "Pepita de Liga Condutiva",
  "en": "Conductive Alloy Nugget",
  "icone": "textures/items/cl/arte/pepita_ferro_condutor"
 },
 "cl:pepita_ferro_pulsante": {
  "pt": "Pepita de Liga Pulsante",
  "en": "Pulsating Alloy Nugget",
  "icone": "textures/items/cl/arte/pepita_ferro_pulsante"
 },
 "cl:pepita_liga_energetica": {
  "pt": "Pepita de Liga Energética",
  "en": "Energetic Alloy Nugget",
  "icone": "textures/items/cl/arte/pepita_liga_energetica"
 },
 "cl:pepita_liga_redstone": {
  "pt": "Pepita de Liga de Redstone",
  "en": "Redstone Alloy Nugget",
  "icone": "textures/items/cl/arte/pepita_liga_redstone"
 },
 "cl:pepita_liga_vibrante": {
  "pt": "Pepita de Liga Vibrante",
  "en": "Vibrant Alloy Nugget",
  "icone": "textures/items/cl/arte/pepita_liga_vibrante"
 },
 "cl:pergaminho_retorno": {
  "pt": "Pergaminho de Retorno",
  "en": "Return Scroll",
  "icone": "textures/items/cl/arte/pergaminho_retorno"
 },
 "cl:pergaminho_viagem": {
  "pt": "Pergaminho de Viagem",
  "en": "Warp Scroll",
  "icone": "textures/items/cl/arte/pergaminho_viagem"
 },
 "cl:perola_aerea": {
  "pt": "Pérola Aérea",
  "en": "Aerial Pearl",
  "icone": "textures/items/cl/arte/perola_aerea"
 },
 "cl:perola_aerea_jogador": {
  "pt": "Pérola Aérea do Jogador",
  "en": "Player Aerial Pearl",
  "icone": "textures/items/cl/arte/perola_aerea_jogador"
 },
 "cl:perola_fluix": {
  "pt": "Pérola de Fluix",
  "en": "Fluix Pearl",
  "icone": "textures/items/cl/arte/perola_fluix"
 },
 "cl:petroleo": {
  "pt": "Petróleo",
  "en": "Oil",
  "icone": "textures/items/cl/blocos/petroleo"
 },
 "cl:picarango": {
  "pt": "Picarango",
  "en": "Pickarang",
  "icone": "textures/items/cl/arte/picarango"
 },
 "cl:picarenxo_aco": {
  "pt": "Picarenxó de Aço",
  "en": "Steel Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_aco"
 },
 "cl:picarenxo_aco_slime": {
  "pt": "Picarenxó de Aço de Slime",
  "en": "Slimesteel Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_aco_slime"
 },
 "cl:picarenxo_bronze": {
  "pt": "Picarenxó de Bronze",
  "en": "Bronze Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_bronze"
 },
 "cl:picarenxo_bronze_ametista": {
  "pt": "Picarenxó de Bronze de Ametista",
  "en": "Amethyst Bronze Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_bronze_ametista"
 },
 "cl:picarenxo_cobalto": {
  "pt": "Picarenxó de Cobalto",
  "en": "Cobalt Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_cobalto"
 },
 "cl:picarenxo_cobre": {
  "pt": "Picarenxó de Cobre",
  "en": "Copper Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_cobre"
 },
 "cl:picarenxo_coro": {
  "pt": "Picarenxó de Chorus",
  "en": "Chorus Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_coro"
 },
 "cl:picarenxo_ferro": {
  "pt": "Picarenxó de Ferro",
  "en": "Iron Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_ferro"
 },
 "cl:picarenxo_ferro_porco": {
  "pt": "Picarenxó de Ferro-Porco",
  "en": "Pig Iron Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_ferro_porco"
 },
 "cl:picarenxo_hepatizon": {
  "pt": "Picarenxó de Hepatizão",
  "en": "Hepatizon Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_hepatizon"
 },
 "cl:picarenxo_madeira": {
  "pt": "Picarenxó de Madeira",
  "en": "Wood Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_madeira"
 },
 "cl:picarenxo_madeira_slime": {
  "pt": "Picarenxó de Madeira de Slime",
  "en": "Slimewood Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_madeira_slime"
 },
 "cl:picarenxo_madeira_slime_revestida": {
  "pt": "Picarenxó de Madeira de Slime Revestida",
  "en": "Plated Slimewood Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_madeira_slime_revestida"
 },
 "cl:picarenxo_madeira_tratada": {
  "pt": "Picarenxó de Madeira Tratada",
  "en": "Treated Wood Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_madeira_tratada"
 },
 "cl:picarenxo_manyullyn": {
  "pt": "Picarenxó de Manyullyn",
  "en": "Manyullyn Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_manyullyn"
 },
 "cl:picarenxo_nahuatl": {
  "pt": "Picarenxó de Nahuatl",
  "en": "Nahuatl Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_nahuatl"
 },
 "cl:picarenxo_osmio": {
  "pt": "Picarenxó de Ósmio",
  "en": "Osmium Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_osmio"
 },
 "cl:picarenxo_osso": {
  "pt": "Picarenxó de Osso",
  "en": "Bone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_osso"
 },
 "cl:picarenxo_osso_blaze": {
  "pt": "Picarenxó de Osso de Blaze",
  "en": "Blazing Bone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_osso_blaze"
 },
 "cl:picarenxo_osso_necrotico": {
  "pt": "Picarenxó de Osso Necrótico",
  "en": "Necrotic Bone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_osso_necrotico"
 },
 "cl:picarenxo_osso_venenoso": {
  "pt": "Picarenxó de Osso Venenoso",
  "en": "Venombone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_osso_venenoso"
 },
 "cl:picarenxo_ouro_rosa": {
  "pt": "Picarenxó de Ouro Rosa",
  "en": "Rose Gold Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_ouro_rosa"
 },
 "cl:picarenxo_pedra": {
  "pt": "Picarenxó de Pedra",
  "en": "Stone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_pedra"
 },
 "cl:picarenxo_pedra_branca": {
  "pt": "Picarenxó de Pedra Branca",
  "en": "Whitestone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_pedra_branca"
 },
 "cl:picarenxo_pedra_chamuscada": {
  "pt": "Picarenxó de Pedra Chamuscada",
  "en": "Scorched Stone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_pedra_chamuscada"
 },
 "cl:picarenxo_pedra_refrataria": {
  "pt": "Picarenxó de Pedra Carbonizada",
  "en": "Seared Stone Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_pedra_refrataria"
 },
 "cl:picarenxo_silex": {
  "pt": "Picarenxó de Sílex",
  "en": "Flint Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_silex"
 },
 "cl:picarenxo_slime_brasa": {
  "pt": "Picarenxó de Slime de Brasa",
  "en": "Cinderslime Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_slime_brasa"
 },
 "cl:picarenxo_slime_cavaleiro": {
  "pt": "Picarenxó de Slime-Cavaleiro",
  "en": "Knightslime Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_slime_cavaleiro"
 },
 "cl:picarenxo_slime_rainha": {
  "pt": "Picarenxó de Slime da Rainha",
  "en": "Queen's Slime Pickadze",
  "icone": "textures/items/cl/arte/picarenxo_slime_rainha"
 },
 "cl:picareta_aco": {
  "pt": "Picareta de Aço",
  "en": "Steel Pickaxe",
  "icone": "textures/items/cl/arte/picareta_aco"
 },
 "cl:picareta_aco_slime": {
  "pt": "Picareta de Aço de Slime",
  "en": "Slimesteel Pickaxe",
  "icone": "textures/items/cl/arte/picareta_aco_slime"
 },
 "cl:picareta_bronze": {
  "pt": "Picareta de Bronze",
  "en": "Bronze Pickaxe",
  "icone": "textures/items/cl/arte/picareta_bronze"
 },
 "cl:picareta_bronze_ametista": {
  "pt": "Picareta de Bronze de Ametista",
  "en": "Amethyst Bronze Pickaxe",
  "icone": "textures/items/cl/arte/picareta_bronze_ametista"
 },
 "cl:picareta_cacto": {
  "pt": "Picareta de Cacto",
  "en": "Cactus Pickaxe",
  "icone": "textures/items/cl/arte/picareta_cacto"
 },
 "cl:picareta_cobalto": {
  "pt": "Picareta de Cobalto",
  "en": "Cobalt Pickaxe",
  "icone": "textures/items/cl/arte/picareta_cobalto"
 },
 "cl:picareta_cobre": {
  "pt": "Picareta de Cobre",
  "en": "Copper Pickaxe",
  "icone": "textures/items/cl/arte/picareta_cobre"
 },
 "cl:picareta_coro": {
  "pt": "Picareta de Chorus",
  "en": "Chorus Pickaxe",
  "icone": "textures/items/cl/arte/picareta_coro"
 },
 "cl:picareta_ferro": {
  "pt": "Picareta de Ferro",
  "en": "Iron Pickaxe",
  "icone": "textures/items/cl/arte/picareta_ferro"
 },
 "cl:picareta_ferro_porco": {
  "pt": "Picareta de Ferro-Porco",
  "en": "Pig Iron Pickaxe",
  "icone": "textures/items/cl/arte/picareta_ferro_porco"
 },
 "cl:picareta_hepatizon": {
  "pt": "Picareta de Hepatizão",
  "en": "Hepatizon Pickaxe",
  "icone": "textures/items/cl/arte/picareta_hepatizon"
 },
 "cl:picareta_madeira": {
  "pt": "Picareta de Madeira",
  "en": "Wood Pickaxe",
  "icone": "textures/items/cl/arte/picareta_madeira"
 },
 "cl:picareta_madeira_slime": {
  "pt": "Picareta de Madeira de Slime",
  "en": "Slimewood Pickaxe",
  "icone": "textures/items/cl/arte/picareta_madeira_slime"
 },
 "cl:picareta_madeira_slime_revestida": {
  "pt": "Picareta de Madeira de Slime Revestida",
  "en": "Plated Slimewood Pickaxe",
  "icone": "textures/items/cl/arte/picareta_madeira_slime_revestida"
 },
 "cl:picareta_madeira_tratada": {
  "pt": "Picareta de Madeira Tratada",
  "en": "Treated Wood Pickaxe",
  "icone": "textures/items/cl/arte/picareta_madeira_tratada"
 },
 "cl:picareta_manyullyn": {
  "pt": "Picareta de Manyullyn",
  "en": "Manyullyn Pickaxe",
  "icone": "textures/items/cl/arte/picareta_manyullyn"
 },
 "cl:picareta_nahuatl": {
  "pt": "Picareta de Nahuatl",
  "en": "Nahuatl Pickaxe",
  "icone": "textures/items/cl/arte/picareta_nahuatl"
 },
 "cl:picareta_obsidiana": {
  "pt": "Picareta de Obsidiana",
  "en": "Obsidian Pickaxe",
  "icone": "textures/items/cl/arte/picareta_obsidiana"
 },
 "cl:picareta_osmio": {
  "pt": "Picareta de Ósmio",
  "en": "Osmium Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osmio"
 },
 "cl:picareta_osso": {
  "pt": "Picareta de Osso",
  "en": "Bone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osso"
 },
 "cl:picareta_osso_blaze": {
  "pt": "Picareta de Osso de Blaze",
  "en": "Blazing Bone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osso_blaze"
 },
 "cl:picareta_osso_necrotico": {
  "pt": "Picareta de Osso Necrótico",
  "en": "Necrotic Bone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osso_necrotico"
 },
 "cl:picareta_osso_venenoso": {
  "pt": "Picareta de Osso Venenoso",
  "en": "Venombone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osso_venenoso"
 },
 "cl:picareta_ouro_rosa": {
  "pt": "Picareta de Ouro Rosa",
  "en": "Rose Gold Pickaxe",
  "icone": "textures/items/cl/arte/picareta_ouro_rosa"
 },
 "cl:picareta_pedra": {
  "pt": "Picareta de Pedra",
  "en": "Stone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_pedra"
 },
 "cl:picareta_pedra_branca": {
  "pt": "Picareta de Pedra Branca",
  "en": "Whitestone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_pedra_branca"
 },
 "cl:picareta_pedra_chamuscada": {
  "pt": "Picareta de Pedra Chamuscada",
  "en": "Scorched Stone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_pedra_chamuscada"
 },
 "cl:picareta_pedra_refrataria": {
  "pt": "Picareta de Pedra Carbonizada",
  "en": "Seared Stone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_pedra_refrataria"
 },
 "cl:picareta_silex": {
  "pt": "Picareta de Sílex",
  "en": "Flint Pickaxe",
  "icone": "textures/items/cl/arte/picareta_silex"
 },
 "cl:picareta_slime_brasa": {
  "pt": "Picareta de Slime de Brasa",
  "en": "Cinderslime Pickaxe",
  "icone": "textures/items/cl/arte/picareta_slime_brasa"
 },
 "cl:picareta_slime_cavaleiro": {
  "pt": "Picareta de Slime-Cavaleiro",
  "en": "Knightslime Pickaxe",
  "icone": "textures/items/cl/arte/picareta_slime_cavaleiro"
 },
 "cl:picareta_slime_rainha": {
  "pt": "Picareta de Slime da Rainha",
  "en": "Queen's Slime Pickaxe",
  "icone": "textures/items/cl/arte/picareta_slime_rainha"
 },
 "cl:pilao": {
  "pt": "Pilão",
  "en": "Mortar and Pestle",
  "icone": "textures/items/cl/arte/blocos/pilao"
 },
 "cl:pimenta": {
  "pt": "Pimenta",
  "en": "Chili Pepper",
  "icone": "textures/items/cl/arte/pimenta"
 },
 "cl:pimentao": {
  "pt": "Pimentão",
  "en": "Bell Pepper",
  "icone": "textures/items/cl/arte/pimentao"
 },
 "cl:pimentao_recheado": {
  "pt": "Pimentão Recheado",
  "en": "Stuffed Pepper",
  "icone": "textures/items/cl/arte/pimentao_recheado"
 },
 "cl:pipoca": {
  "pt": "Pipoca",
  "en": "Popcorn",
  "icone": "textures/items/cl/arte/pipoca"
 },
 "cl:placa_aco": {
  "pt": "Placa Comprimida de Aço",
  "en": "Compressed Steel",
  "icone": "textures/items/cl/c/placa_aco"
 },
 "cl:placa_aluminio": {
  "pt": "Placa Comprimida de Alumínio",
  "en": "Compressed Aluminum",
  "icone": "textures/items/cl/c/placa_aluminio"
 },
 "cl:placa_bronze": {
  "pt": "Placa Comprimida de Bronze",
  "en": "Compressed Bronze",
  "icone": "textures/items/cl/c/placa_bronze"
 },
 "cl:placa_casco": {
  "pt": "Placa de Casco",
  "en": "Hull Plate",
  "icone": "textures/items/cl/arte/placa_casco"
 },
 "cl:placa_circuito_vazia": {
  "pt": "Placa de Circuito Vazia",
  "en": "Empty PCB",
  "icone": "textures/items/cl/arte/placa_circuito_vazia"
 },
 "cl:placa_cobre": {
  "pt": "Placa Comprimida de Cobre",
  "en": "Compressed Copper",
  "icone": "textures/items/cl/c/placa_cobre"
 },
 "cl:placa_estanho": {
  "pt": "Placa Comprimida de Estanho",
  "en": "Compressed Tin",
  "icone": "textures/items/cl/c/placa_estanho"
 },
 "cl:placa_ferro": {
  "pt": "Placa Comprimida de Ferro",
  "en": "Compressed Iron",
  "icone": "textures/items/cl/c/placa_ferro"
 },
 "cl:placa_fotovoltaica": {
  "pt": "Chapa Fotovoltaica",
  "en": "Photovoltaic Plate",
  "icone": "textures/items/cl/arte/placa_fotovoltaica"
 },
 "cl:placa_reforcada": {
  "pt": "Placa Reforçada",
  "en": "Heavy Duty Plate",
  "icone": "textures/items/cl/c/placa_reforcada"
 },
 "cl:placa_termoeletrica": {
  "pt": "Placa Termoelétrica",
  "en": "Thermoelectric Plate",
  "icone": "textures/items/cl/arte/placa_termoeletrica"
 },
 "cl:planador": {
  "pt": "Planador",
  "en": "Glider",
  "icone": "textures/items/cl/arte/planador"
 },
 "cl:planta_alho": {
  "pt": "Plantação de Alho",
  "en": "Garlic Crop",
  "icone": "textures/blocks/cl/arte/planta_alho_0"
 },
 "cl:planta_amendoim": {
  "pt": "Plantação de Amendoim",
  "en": "Peanut Crop",
  "icone": "textures/blocks/cl/arte/planta_amendoim_0"
 },
 "cl:planta_arroz": {
  "pt": "Plantação de Arroz",
  "en": "Rice Crop",
  "icone": "textures/blocks/cl/arte/planta_arroz_0"
 },
 "cl:planta_canhamo": {
  "pt": "Plantação de Cânhamo Industrial",
  "en": "Industrial Hemp Crop",
  "icone": "textures/blocks/cl/hc/canhamo_0"
 },
 "cl:planta_cebola": {
  "pt": "Plantação de Cebola",
  "en": "Onion Crop",
  "icone": "textures/blocks/cl/arte/planta_cebola_0"
 },
 "cl:planta_feijao": {
  "pt": "Plantação de Feijão",
  "en": "Beans Crop",
  "icone": "textures/blocks/cl/arte/planta_feijao_0"
 },
 "cl:planta_fruta_cacto": {
  "pt": "Plantação de Fruta do Cacto",
  "en": "Cactus Fruit Crop",
  "icone": "textures/blocks/cl/arte/planta_fruta_cacto_0"
 },
 "cl:planta_milho": {
  "pt": "Plantação de Milho",
  "en": "Corn Crop",
  "icone": "textures/blocks/cl/arte/planta_milho_0"
 },
 "cl:planta_pimenta": {
  "pt": "Plantação de Pimenta",
  "en": "Chili Pepper Crop",
  "icone": "textures/blocks/cl/arte/planta_pimenta_0"
 },
 "cl:planta_pimentao": {
  "pt": "Plantação de Pimentão",
  "en": "Bell Pepper Crop",
  "icone": "textures/blocks/cl/arte/planta_pimentao_0"
 },
 "cl:planta_repolho": {
  "pt": "Plantação de Repolho",
  "en": "Cabbage Crop",
  "icone": "textures/blocks/cl/arte/planta_repolho_0"
 },
 "cl:planta_tomate": {
  "pt": "Plantação de Tomate",
  "en": "Tomato Crop",
  "icone": "textures/blocks/cl/arte/planta_tomate_0"
 },
 "cl:plantadeira": {
  "pt": "Plantadeira",
  "en": "Planter",
  "icone": "textures/items/cl/arte/blocos/plantadeira"
 },
 "cl:plastico_amarelo": {
  "pt": "Plástico Amarelo",
  "en": "Yellow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_amarelo"
 },
 "cl:plastico_azul": {
  "pt": "Plástico Azul",
  "en": "Blue Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_azul"
 },
 "cl:plastico_azul_claro": {
  "pt": "Plástico Azul-Claro",
  "en": "Light Blue Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_azul_claro"
 },
 "cl:plastico_branco": {
  "pt": "Plástico Branco",
  "en": "White Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_branco"
 },
 "cl:plastico_brilhante_amarelo": {
  "pt": "Plástico Brilhante Amarelo",
  "en": "Yellow Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_amarelo"
 },
 "cl:plastico_brilhante_azul": {
  "pt": "Plástico Brilhante Azul",
  "en": "Blue Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_azul"
 },
 "cl:plastico_brilhante_azul_claro": {
  "pt": "Plástico Brilhante Azul-Claro",
  "en": "Light Blue Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_azul_claro"
 },
 "cl:plastico_brilhante_branco": {
  "pt": "Plástico Brilhante Branco",
  "en": "White Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_branco"
 },
 "cl:plastico_brilhante_ciano": {
  "pt": "Plástico Brilhante Ciano",
  "en": "Cyan Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_ciano"
 },
 "cl:plastico_brilhante_cinza": {
  "pt": "Plástico Brilhante Cinza",
  "en": "Gray Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_cinza"
 },
 "cl:plastico_brilhante_cinza_claro": {
  "pt": "Plástico Brilhante Cinza-Claro",
  "en": "Light Gray Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_cinza_claro"
 },
 "cl:plastico_brilhante_laranja": {
  "pt": "Plástico Brilhante Laranja",
  "en": "Orange Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_laranja"
 },
 "cl:plastico_brilhante_lima": {
  "pt": "Plástico Brilhante Lima",
  "en": "Lime Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_lima"
 },
 "cl:plastico_brilhante_magenta": {
  "pt": "Plástico Brilhante Magenta",
  "en": "Magenta Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_magenta"
 },
 "cl:plastico_brilhante_marrom": {
  "pt": "Plástico Brilhante Marrom",
  "en": "Brown Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_marrom"
 },
 "cl:plastico_brilhante_preto": {
  "pt": "Plástico Brilhante Preto",
  "en": "Black Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_preto"
 },
 "cl:plastico_brilhante_rosa": {
  "pt": "Plástico Brilhante Rosa",
  "en": "Pink Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_rosa"
 },
 "cl:plastico_brilhante_roxo": {
  "pt": "Plástico Brilhante Roxo",
  "en": "Purple Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_roxo"
 },
 "cl:plastico_brilhante_verde": {
  "pt": "Plástico Brilhante Verde",
  "en": "Green Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_verde"
 },
 "cl:plastico_brilhante_vermelho": {
  "pt": "Plástico Brilhante Vermelho",
  "en": "Red Glow Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_brilhante_vermelho"
 },
 "cl:plastico_ciano": {
  "pt": "Plástico Ciano",
  "en": "Cyan Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_ciano"
 },
 "cl:plastico_cinza": {
  "pt": "Plástico Cinza",
  "en": "Gray Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_cinza"
 },
 "cl:plastico_cinza_claro": {
  "pt": "Plástico Cinza-Claro",
  "en": "Light Gray Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_cinza_claro"
 },
 "cl:plastico_cru": {
  "pt": "Plástico Cru",
  "en": "Raw Plastic",
  "icone": "textures/items/cl/arte/plastico_cru"
 },
 "cl:plastico_laranja": {
  "pt": "Plástico Laranja",
  "en": "Orange Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_laranja"
 },
 "cl:plastico_lima": {
  "pt": "Plástico Lima",
  "en": "Lime Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_lima"
 },
 "cl:plastico_liso_amarelo": {
  "pt": "Plástico Liso Amarelo",
  "en": "Yellow Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_amarelo"
 },
 "cl:plastico_liso_azul": {
  "pt": "Plástico Liso Azul",
  "en": "Blue Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_azul"
 },
 "cl:plastico_liso_azul_claro": {
  "pt": "Plástico Liso Azul-Claro",
  "en": "Light Blue Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_azul_claro"
 },
 "cl:plastico_liso_branco": {
  "pt": "Plástico Liso Branco",
  "en": "White Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_branco"
 },
 "cl:plastico_liso_ciano": {
  "pt": "Plástico Liso Ciano",
  "en": "Cyan Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_ciano"
 },
 "cl:plastico_liso_cinza": {
  "pt": "Plástico Liso Cinza",
  "en": "Gray Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_cinza"
 },
 "cl:plastico_liso_cinza_claro": {
  "pt": "Plástico Liso Cinza-Claro",
  "en": "Light Gray Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_cinza_claro"
 },
 "cl:plastico_liso_laranja": {
  "pt": "Plástico Liso Laranja",
  "en": "Orange Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_laranja"
 },
 "cl:plastico_liso_lima": {
  "pt": "Plástico Liso Lima",
  "en": "Lime Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_lima"
 },
 "cl:plastico_liso_magenta": {
  "pt": "Plástico Liso Magenta",
  "en": "Magenta Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_magenta"
 },
 "cl:plastico_liso_marrom": {
  "pt": "Plástico Liso Marrom",
  "en": "Brown Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_marrom"
 },
 "cl:plastico_liso_preto": {
  "pt": "Plástico Liso Preto",
  "en": "Black Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_preto"
 },
 "cl:plastico_liso_rosa": {
  "pt": "Plástico Liso Rosa",
  "en": "Pink Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_rosa"
 },
 "cl:plastico_liso_roxo": {
  "pt": "Plástico Liso Roxo",
  "en": "Purple Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_roxo"
 },
 "cl:plastico_liso_verde": {
  "pt": "Plástico Liso Verde",
  "en": "Green Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_verde"
 },
 "cl:plastico_liso_vermelho": {
  "pt": "Plástico Liso Vermelho",
  "en": "Red Slick Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_liso_vermelho"
 },
 "cl:plastico_magenta": {
  "pt": "Plástico Magenta",
  "en": "Magenta Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_magenta"
 },
 "cl:plastico_marrom": {
  "pt": "Plástico Marrom",
  "en": "Brown Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_marrom"
 },
 "cl:plastico_preto": {
  "pt": "Plástico Preto",
  "en": "Black Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_preto"
 },
 "cl:plastico_reforcado_amarelo": {
  "pt": "Plástico Reforçado Amarelo",
  "en": "Yellow Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_amarelo"
 },
 "cl:plastico_reforcado_azul": {
  "pt": "Plástico Reforçado Azul",
  "en": "Blue Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_azul"
 },
 "cl:plastico_reforcado_azul_claro": {
  "pt": "Plástico Reforçado Azul-Claro",
  "en": "Light Blue Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_azul_claro"
 },
 "cl:plastico_reforcado_branco": {
  "pt": "Plástico Reforçado Branco",
  "en": "White Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_branco"
 },
 "cl:plastico_reforcado_ciano": {
  "pt": "Plástico Reforçado Ciano",
  "en": "Cyan Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_ciano"
 },
 "cl:plastico_reforcado_cinza": {
  "pt": "Plástico Reforçado Cinza",
  "en": "Gray Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_cinza"
 },
 "cl:plastico_reforcado_cinza_claro": {
  "pt": "Plástico Reforçado Cinza-Claro",
  "en": "Light Gray Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_cinza_claro"
 },
 "cl:plastico_reforcado_laranja": {
  "pt": "Plástico Reforçado Laranja",
  "en": "Orange Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_laranja"
 },
 "cl:plastico_reforcado_lima": {
  "pt": "Plástico Reforçado Lima",
  "en": "Lime Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_lima"
 },
 "cl:plastico_reforcado_magenta": {
  "pt": "Plástico Reforçado Magenta",
  "en": "Magenta Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_magenta"
 },
 "cl:plastico_reforcado_marrom": {
  "pt": "Plástico Reforçado Marrom",
  "en": "Brown Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_marrom"
 },
 "cl:plastico_reforcado_preto": {
  "pt": "Plástico Reforçado Preto",
  "en": "Black Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_preto"
 },
 "cl:plastico_reforcado_rosa": {
  "pt": "Plástico Reforçado Rosa",
  "en": "Pink Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_rosa"
 },
 "cl:plastico_reforcado_roxo": {
  "pt": "Plástico Reforçado Roxo",
  "en": "Purple Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_roxo"
 },
 "cl:plastico_reforcado_verde": {
  "pt": "Plástico Reforçado Verde",
  "en": "Green Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_verde"
 },
 "cl:plastico_reforcado_vermelho": {
  "pt": "Plástico Reforçado Vermelho",
  "en": "Red Reinforced Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_reforcado_vermelho"
 },
 "cl:plastico_rosa": {
  "pt": "Plástico Rosa",
  "en": "Pink Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_rosa"
 },
 "cl:plastico_roxo": {
  "pt": "Plástico Roxo",
  "en": "Purple Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_roxo"
 },
 "cl:plastico_verde": {
  "pt": "Plástico Verde",
  "en": "Green Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_verde"
 },
 "cl:plastico_vermelho": {
  "pt": "Plástico Vermelho",
  "en": "Red Plastic Block",
  "icone": "textures/items/cl/blocos/plastico_vermelho"
 },
 "cl:plataforma_lancamento": {
  "pt": "Plataforma de Lançamento",
  "en": "Rocket Launch Pad",
  "icone": "textures/items/cl/blocos/plataforma_lancamento"
 },
 "cl:po_aco": {
  "pt": "Pó de Aço",
  "en": "Steel Dust",
  "icone": "textures/items/cl/arte/po_aco"
 },
 "cl:po_carvao": {
  "pt": "Pó de Carvão",
  "en": "Powdered Coal",
  "icone": "textures/items/cl/arte/po_carvao"
 },
 "cl:po_certus": {
  "pt": "Pó de Quartzo Certus",
  "en": "Certus Quartz Dust",
  "icone": "textures/items/cl/arte/po_certus"
 },
 "cl:po_cobre": {
  "pt": "Pó de Cobre",
  "en": "Pulverized Copper",
  "icone": "textures/items/cl/arte/po_cobre"
 },
 "cl:po_diamante": {
  "pt": "Pó de Diamante",
  "en": "Diamond Dust",
  "icone": "textures/items/cl/arte/po_diamante"
 },
 "cl:po_estanho": {
  "pt": "Pó de Estanho",
  "en": "Pulverized Tin",
  "icone": "textures/items/cl/arte/po_estanho"
 },
 "cl:po_ferro": {
  "pt": "Pó de Ferro",
  "en": "Pulverized Iron",
  "icone": "textures/items/cl/arte/po_ferro"
 },
 "cl:po_fluix": {
  "pt": "Pó de Fluix",
  "en": "Fluix Dust",
  "icone": "textures/items/cl/arte/po_fluix"
 },
 "cl:po_lapis": {
  "pt": "Pó de Lápis-lazúli",
  "en": "Powdered Lapis Lazuli",
  "icone": "textures/items/cl/arte/po_lapis"
 },
 "cl:po_litio": {
  "pt": "Pó de Lítio",
  "en": "Lithium Dust",
  "icone": "textures/items/cl/arte/po_litio"
 },
 "cl:po_obsidiana": {
  "pt": "Pó de Obsidiana",
  "en": "Powdered Obsidian",
  "icone": "textures/items/cl/arte/po_obsidiana"
 },
 "cl:po_obsidiana_refinada": {
  "pt": "Pó de Obsidiana Refinada",
  "en": "Refined Obsidian Dust",
  "icone": "textures/items/cl/arte/po_obsidiana_refinada"
 },
 "cl:po_osmio": {
  "pt": "Pó de Ósmio",
  "en": "Osmium Dust",
  "icone": "textures/items/cl/arte/po_osmio"
 },
 "cl:po_ouro": {
  "pt": "Pó de Ouro",
  "en": "Pulverized Gold",
  "icone": "textures/items/cl/arte/po_ouro"
 },
 "cl:po_pedra_ceu": {
  "pt": "Pó de Pedra do Céu",
  "en": "Sky Stone Dust",
  "icone": "textures/items/cl/arte/po_pedra_ceu"
 },
 "cl:po_perola_ender": {
  "pt": "Pó de Pérola do Ender",
  "en": "Powdered Ender Pearl",
  "icone": "textures/items/cl/arte/po_perola_ender"
 },
 "cl:po_quartzo": {
  "pt": "Pó de Quartzo",
  "en": "Powdered Quartz",
  "icone": "textures/items/cl/arte/po_quartzo"
 },
 "cl:po_sujo_cobre": {
  "pt": "Pó de Cobre Sujo",
  "en": "Dirty Copper Dust",
  "icone": "textures/items/cl/arte/po_sujo_cobre"
 },
 "cl:po_sujo_estanho": {
  "pt": "Pó de Estanho Sujo",
  "en": "Dirty Tin Dust",
  "icone": "textures/items/cl/arte/po_sujo_estanho"
 },
 "cl:po_sujo_ferro": {
  "pt": "Pó de Ferro Sujo",
  "en": "Dirty Iron Dust",
  "icone": "textures/items/cl/arte/po_sujo_ferro"
 },
 "cl:po_sujo_osmio": {
  "pt": "Pó de Ósmio Sujo",
  "en": "Dirty Osmium Dust",
  "icone": "textures/items/cl/arte/po_sujo_osmio"
 },
 "cl:po_sujo_ouro": {
  "pt": "Pó de Ouro Sujo",
  "en": "Dirty Gold Dust",
  "icone": "textures/items/cl/arte/po_sujo_ouro"
 },
 "cl:po_yellorium": {
  "pt": "Pó de Yellorium",
  "en": "Yellorium Dust",
  "icone": "textures/items/cl/arte/po_yellorium"
 },
 "cl:poeira": {
  "pt": "Poeira",
  "en": "Dust",
  "icone": "textures/items/cl/arte/blocos/poeira"
 },
 "cl:ponto_acesso": {
  "pt": "Ponto de Acesso Sem Fio",
  "en": "ME Wireless Access Point",
  "icone": "textures/items/cl/arte/blocos/ponto_acesso"
 },
 "cl:porcelana": {
  "pt": "Porcelana",
  "en": "Porcelain",
  "icone": "textures/items/cl/arte/porcelana"
 },
 "cl:porta_acesso_reator": {
  "pt": "Porta de Acesso",
  "en": "Reactor Access Port",
  "icone": "textures/items/cl/blocos/porta_acesso_reator"
 },
 "cl:porta_refrigeracao": {
  "pt": "Porta de Refrigeração",
  "en": "Reactor Coolant Port",
  "icone": "textures/items/cl/blocos/porta_refrigeracao"
 },
 "cl:portao_ender_ardente": {
  "pt": "Portão Ender Ardente",
  "en": "Blazing Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_ardente"
 },
 "cl:portao_ender_basico": {
  "pt": "Portão Ender Básico",
  "en": "Basic Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_basico"
 },
 "cl:portao_ender_endurecido": {
  "pt": "Portão Ender Endurecido",
  "en": "Hardened Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_endurecido"
 },
 "cl:portao_ender_espiritual": {
  "pt": "Portão Ender Espiritual",
  "en": "Spirited Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_espiritual"
 },
 "cl:portao_ender_inicial": {
  "pt": "Portão Ender Inicial",
  "en": "Starter Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_inicial"
 },
 "cl:portao_ender_niotico": {
  "pt": "Portão Ender Niótico",
  "en": "Niotic Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_niotico"
 },
 "cl:portao_ender_nitro": {
  "pt": "Portão Ender Nitro",
  "en": "Nitro Ender Gate",
  "icone": "textures/items/cl/blocos/portao_ender_nitro"
 },
 "cl:prateleira": {
  "pt": "Prateleira",
  "en": "Shelf",
  "icone": "textures/items/cl/arte/blocos/prateleira"
 },
 "cl:precipitador_glacial": {
  "pt": "Precipitador Glacial",
  "en": "Glacial Precipitator",
  "icone": "textures/items/cl/arte/blocos/precipitador_glacial"
 },
 "cl:prensa_calculo": {
  "pt": "Prensa Inscritora de Cálculo",
  "en": "Inscriber Calculation Press",
  "icone": "textures/items/cl/arte/prensa_calculo"
 },
 "cl:prensa_engenharia": {
  "pt": "Prensa Inscritora de Engenharia",
  "en": "Inscriber Engineering Press",
  "icone": "textures/items/cl/arte/prensa_engenharia"
 },
 "cl:prensa_logica": {
  "pt": "Prensa Inscritora Lógica",
  "en": "Inscriber Logic Press",
  "icone": "textures/items/cl/arte/prensa_logica"
 },
 "cl:prensa_mecanica": {
  "pt": "Prensa Mecânica",
  "en": "Mechanical Press",
  "icone": "textures/items/cl/blocos/prensa_mecanica"
 },
 "cl:prensa_silicio": {
  "pt": "Prensa Inscritora de Silício",
  "en": "Inscriber Silicon Press",
  "icone": "textures/items/cl/arte/prensa_silicio"
 },
 "cl:processador_avancado": {
  "pt": "Processador de Engenharia",
  "en": "Engineering Processor",
  "icone": "textures/items/cl/arte/processador_avancado"
 },
 "cl:processador_basico": {
  "pt": "Processador Lógico",
  "en": "Logic Processor",
  "icone": "textures/items/cl/arte/processador_basico"
 },
 "cl:processador_calculo": {
  "pt": "Processador de Cálculo",
  "en": "Calculation Processor",
  "icone": "textures/items/cl/arte/processador_calculo"
 },
 "cl:pulverizador": {
  "pt": "Pulverizador",
  "en": "Pulverizer",
  "icone": "textures/items/cl/arte/blocos/pulverizador"
 },
 "cl:quadricoptero": {
  "pt": "Quadricóptero",
  "en": "Quadrocopter",
  "icone": "textures/items/cl/arte/quadricoptero"
 },
 "cl:quartzo_fundido": {
  "pt": "Quartzo Fundido",
  "en": "Fused Quartz",
  "icone": "textures/items/cl/blocos/quartzo_fundido"
 },
 "cl:quartzo_fundido_escuro": {
  "pt": "Quartzo Fundido Escuro",
  "en": "Dark Fused Quartz",
  "icone": "textures/items/cl/blocos/quartzo_fundido_escuro"
 },
 "cl:quartzo_fundido_iluminado": {
  "pt": "Quartzo Fundido Iluminado",
  "en": "Enlightened Fused Quartz",
  "icone": "textures/items/cl/blocos/quartzo_fundido_iluminado"
 },
 "cl:quebrador_blocos": {
  "pt": "Quebrador de Blocos",
  "en": "Block Breaker",
  "icone": "textures/items/cl/arte/blocos/quebrador_blocos"
 },
 "cl:queijo": {
  "pt": "Queijo",
  "en": "Cheese",
  "icone": "textures/items/cl/arte/queijo"
 },
 "cl:rancheiro": {
  "pt": "Rancheiro",
  "en": "Rancher",
  "icone": "textures/items/cl/arte/blocos/rancheiro"
 },
 "cl:ratatouille": {
  "pt": "Ratatouille",
  "en": "Ratatouille",
  "icone": "textures/items/cl/arte/ratatouille"
 },
 "cl:reator_ardente": {
  "pt": "Reator Ardente",
  "en": "Blazing Reactor",
  "icone": "textures/items/cl/blocos/reator_ardente"
 },
 "cl:reator_basico": {
  "pt": "Reator Básico",
  "en": "Basic Reactor",
  "icone": "textures/items/cl/blocos/reator_basico"
 },
 "cl:reator_endurecido": {
  "pt": "Reator Endurecido",
  "en": "Hardened Reactor",
  "icone": "textures/items/cl/blocos/reator_endurecido"
 },
 "cl:reator_espiritual": {
  "pt": "Reator Espiritual",
  "en": "Spirited Reactor",
  "icone": "textures/items/cl/blocos/reator_espiritual"
 },
 "cl:reator_inicial": {
  "pt": "Reator Inicial",
  "en": "Starter Reactor",
  "icone": "textures/items/cl/blocos/reator_inicial"
 },
 "cl:reator_niotico": {
  "pt": "Reator Niótico",
  "en": "Niotic Reactor",
  "icone": "textures/items/cl/blocos/reator_niotico"
 },
 "cl:reator_nitro": {
  "pt": "Reator Nitro",
  "en": "Nitro Reactor",
  "icone": "textures/items/cl/blocos/reator_nitro"
 },
 "cl:receptor_sem_fio": {
  "pt": "Receptor Sem Fio",
  "en": "Wireless Receiver",
  "icone": "textures/items/cl/arte/receptor_sem_fio"
 },
 "cl:redstone_enriquecida": {
  "pt": "Redstone Enriquecida",
  "en": "Enriched Redstone",
  "icone": "textures/items/cl/arte/redstone_enriquecida"
 },
 "cl:refinaria": {
  "pt": "Refinaria",
  "en": "Refinery",
  "icone": "textures/items/cl/arte/blocos/refinaria"
 },
 "cl:regador": {
  "pt": "Regador",
  "en": "Watering Can",
  "icone": "textures/items/cl/arte/regador"
 },
 "cl:repolho": {
  "pt": "Repolho",
  "en": "Cabbage",
  "icone": "textures/items/cl/arte/repolho"
 },
 "cl:reprocessador_cianita": {
  "pt": "Reprocessador de Cianita",
  "en": "Cyanite Reprocessor",
  "icone": "textures/items/cl/blocos/reprocessador_cianita"
 },
 "cl:resina": {
  "pt": "Resina",
  "en": "Sap",
  "icone": "textures/items/cl/arte/resina"
 },
 "cl:respiro_oxigenio": {
  "pt": "Respiro de Oxigênio",
  "en": "Oxygen Vent",
  "icone": "textures/items/cl/c/respiro_oxigenio"
 },
 "cl:ressonador_ender": {
  "pt": "Ressonador do Ender",
  "en": "Ender Resonator",
  "icone": "textures/items/cl/arte/ressonador_ender"
 },
 "cl:revestimento_aco": {
  "pt": "Revestimento de aço",
  "en": "Steel Casing",
  "icone": "textures/items/cl/blocos/revestimento_aco"
 },
 "cl:revestimento_andesita": {
  "pt": "Revestimento de Andesita",
  "en": "Andesite Casing",
  "icone": "textures/items/cl/blocos/revestimento_andesita"
 },
 "cl:robo_minerador": {
  "pt": "Robô Minerador",
  "en": "Mining Turtle",
  "icone": "textures/items/cl/arte/robo_minerador"
 },
 "cl:rocha_lunar": {
  "pt": "Rocha Lunar",
  "en": "Moon Rock",
  "icone": "textures/items/cl/blocos/rocha_lunar"
 },
 "cl:roda_dagua": {
  "pt": "Roda d'Água",
  "en": "Water Wheel",
  "icone": "textures/items/cl/blocos/roda_dagua"
 },
 "cl:roda_hidraulica": {
  "pt": "Roda d'Água",
  "en": "Water Wheel",
  "icone": "textures/items/cl/blocos/roda_hidraulica"
 },
 "cl:rodas_trituradoras": {
  "pt": "Rodas Trituradoras",
  "en": "Crushing Wheels",
  "icone": "textures/items/cl/blocos/rodas_trituradoras"
 },
 "cl:rolamento_moinho": {
  "pt": "Rolamento de Moinho",
  "en": "Windmill Bearing",
  "icone": "textures/items/cl/blocos/rolamento_moinho"
 },
 "cl:rolinhos_repolho": {
  "pt": "Rolinhos de Repolho",
  "en": "Cabbage Rolls",
  "icone": "textures/items/cl/arte/rolinhos_repolho"
 },
 "cl:saco_arroz": {
  "pt": "Saco de Arroz",
  "en": "Rice Bag",
  "icone": "textures/items/cl/blocos/saco_arroz"
 },
 "cl:saco_bagas": {
  "pt": "Saco de Bagas",
  "en": "Berry Sack",
  "icone": "textures/items/cl/blocos/saco_bagas"
 },
 "cl:saco_cacau": {
  "pt": "Saco de Cacau",
  "en": "Cocoa Beans Sack",
  "icone": "textures/items/cl/blocos/saco_cacau"
 },
 "cl:saco_dormir": {
  "pt": "Saco de Dormir",
  "en": "Sleeping Bag",
  "icone": "textures/items/cl/arte/saco_dormir"
 },
 "cl:saco_polvora": {
  "pt": "Saco de Pólvora",
  "en": "Gunpowder Sack",
  "icone": "textures/items/cl/blocos/saco_polvora"
 },
 "cl:sacola_boa": {
  "pt": "Sacola Boa",
  "en": "Good Bag",
  "icone": "textures/items/cl/arte/sacola_boa"
 },
 "cl:sacola_comum": {
  "pt": "Sacola Comum",
  "en": "Basic Bag",
  "icone": "textures/items/cl/arte/sacola_comum"
 },
 "cl:sacola_epica": {
  "pt": "Sacola Épica",
  "en": "Epic Bag",
  "icone": "textures/items/cl/arte/sacola_epica"
 },
 "cl:sacola_lendaria": {
  "pt": "Sacola Lendária",
  "en": "Legendary Bag",
  "icone": "textures/items/cl/arte/sacola_lendaria"
 },
 "cl:sacola_otima": {
  "pt": "Sacola Ótima",
  "en": "Greater Bag",
  "icone": "textures/items/cl/arte/sacola_otima"
 },
 "cl:sal": {
  "pt": "Sal",
  "en": "Salt",
  "icone": "textures/items/cl/arte/sal"
 },
 "cl:salada_frutas": {
  "pt": "Salada de Frutas",
  "en": "Fruit Salad",
  "icone": "textures/items/cl/arte/salada_frutas"
 },
 "cl:salada_mista": {
  "pt": "Salada Mista",
  "en": "Mixed Salad",
  "icone": "textures/items/cl/arte/salada_mista"
 },
 "cl:salmao_grelhado": {
  "pt": "Salmão Grelhado",
  "en": "Grilled Salmon",
  "icone": "textures/items/cl/arte/salmao_grelhado"
 },
 "cl:sanduiche_bacon": {
  "pt": "Sanduíche de Bacon",
  "en": "Bacon Sandwich",
  "icone": "textures/items/cl/arte/sanduiche_bacon"
 },
 "cl:sanduiche_frango": {
  "pt": "Sanduíche de Frango",
  "en": "Chicken Sandwich",
  "icone": "textures/items/cl/arte/sanduiche_frango"
 },
 "cl:sanduiche_ovo": {
  "pt": "Sanduíche de Ovo",
  "en": "Egg Sandwich",
  "icone": "textures/items/cl/arte/sanduiche_ovo"
 },
 "cl:segmento_roda": {
  "pt": "Segmento de Roda d'Água",
  "en": "Waterwheel Segment",
  "icone": "textures/items/cl/c/segmento_roda"
 },
 "cl:semente_alho": {
  "pt": "Sementes de Alho",
  "en": "Garlic Seeds",
  "icone": "textures/items/cl/arte/semente_alho"
 },
 "cl:semente_amendoim": {
  "pt": "Sementes de Amendoim",
  "en": "Peanut Seeds",
  "icone": "textures/items/cl/arte/semente_amendoim"
 },
 "cl:semente_arroz": {
  "pt": "Sementes de Arroz",
  "en": "Rice Seeds",
  "icone": "textures/items/cl/arte/semente_arroz"
 },
 "cl:semente_canhamo": {
  "pt": "Sementes de Cânhamo Industrial",
  "en": "Industrial Hemp Seeds",
  "icone": "textures/items/cl/hc/semente_canhamo"
 },
 "cl:semente_cebola": {
  "pt": "Sementes de Cebola",
  "en": "Onion Seeds",
  "icone": "textures/items/cl/arte/semente_cebola"
 },
 "cl:semente_feijao": {
  "pt": "Sementes de Feijão",
  "en": "Beans Seeds",
  "icone": "textures/items/cl/arte/semente_feijao"
 },
 "cl:semente_fruta_cacto": {
  "pt": "Sementes de Fruta do Cacto",
  "en": "Cactus Fruit Seeds",
  "icone": "textures/items/cl/arte/semente_fruta_cacto"
 },
 "cl:semente_milho": {
  "pt": "Sementes de Milho",
  "en": "Corn Seeds",
  "icone": "textures/items/cl/arte/semente_milho"
 },
 "cl:semente_pimenta": {
  "pt": "Sementes de Pimenta",
  "en": "Chili Pepper Seeds",
  "icone": "textures/items/cl/arte/semente_pimenta"
 },
 "cl:semente_pimentao": {
  "pt": "Sementes de Pimentão",
  "en": "Bell Pepper Seeds",
  "icone": "textures/items/cl/arte/semente_pimentao"
 },
 "cl:semente_repolho": {
  "pt": "Sementes de Repolho",
  "en": "Cabbage Seeds",
  "icone": "textures/items/cl/arte/semente_repolho"
 },
 "cl:semente_suspeita": {
  "pt": "Semente Suspeita",
  "en": "Suspicious Seed",
  "icone": "textures/items/cl/arte/semente_suspeita"
 },
 "cl:semente_tomate": {
  "pt": "Sementes de Tomate",
  "en": "Tomato Seeds",
  "icone": "textures/items/cl/arte/semente_tomate"
 },
 "cl:separador_eletrolitico": {
  "pt": "Separador Eletrolítico",
  "en": "Electrolytic Separator",
  "icone": "textures/items/cl/arte/blocos/separador_eletrolitico"
 },
 "cl:serragem": {
  "pt": "Serragem",
  "en": "Sawdust",
  "icone": "textures/items/cl/arte/serragem"
 },
 "cl:serraria": {
  "pt": "Serraria",
  "en": "Sawmill",
  "icone": "textures/items/cl/arte/blocos/serraria"
 },
 "cl:serraria_precisao": {
  "pt": "Serraria de Precisão",
  "en": "Precision Sawmill",
  "icone": "textures/blocks/cl/arte/serraria_precisao_topo"
 },
 "cl:shuriken_cobalto": {
  "pt": "Shuriken de Cobalto",
  "en": "Cobalt Shuriken",
  "icone": "textures/items/cl/arte/shuriken_cobalto"
 },
 "cl:shuriken_ferro": {
  "pt": "Shuriken de Ferro",
  "en": "Iron Shuriken",
  "icone": "textures/items/cl/arte/shuriken_ferro"
 },
 "cl:shuriken_manyullyn": {
  "pt": "Shuriken de Manyullyn",
  "en": "Manyullyn Shuriken",
  "icone": "textures/items/cl/arte/shuriken_manyullyn"
 },
 "cl:shuriken_silex": {
  "pt": "Shuriken de Sílex",
  "en": "Flint Shuriken",
  "icone": "textures/items/cl/arte/shuriken_silex"
 },
 "cl:silicio": {
  "pt": "Silício",
  "en": "Silicon",
  "icone": "textures/items/cl/arte/silicio"
 },
 "cl:silicio_impresso": {
  "pt": "Circuito Impresso de Silício",
  "en": "Printed Silicon",
  "icone": "textures/items/cl/arte/silicio_impresso"
 },
 "cl:simbolo_animal": {
  "pt": "Símbolo de Animal",
  "en": "Animal Token",
  "icone": "textures/items/cl/arte/simbolo_animal"
 },
 "cl:simbolo_jogador": {
  "pt": "Símbolo de Jogador",
  "en": "Player Token",
  "icone": "textures/items/cl/arte/simbolo_jogador"
 },
 "cl:simbolo_monstro": {
  "pt": "Símbolo de Monstro",
  "en": "Monster Token",
  "icone": "textures/items/cl/arte/simbolo_monstro"
 },
 "cl:slime_congelado_ceu": {
  "pt": "Slime-do-Céu Congelado",
  "en": "Congealed Skyslime",
  "icone": "textures/blocks/cl/arte/slime_congelado_ceu"
 },
 "cl:slime_congelado_ender": {
  "pt": "Slime-do-Ender Congelado",
  "en": "Congealed Enderslime",
  "icone": "textures/blocks/cl/arte/slime_congelado_ender"
 },
 "cl:slime_congelado_icor": {
  "pt": "Icor Congelado",
  "en": "Congealed Ichor",
  "icone": "textures/blocks/cl/arte/slime_congelado_icor"
 },
 "cl:slime_congelado_sangue": {
  "pt": "Sangue Congelado",
  "en": "Congealed Blood",
  "icone": "textures/blocks/cl/arte/slime_congelado_sangue"
 },
 "cl:slime_congelado_terra": {
  "pt": "Slime-da-Terra Congelado",
  "en": "Congealed Earthslime",
  "icone": "textures/blocks/cl/arte/slime_congelado_terra"
 },
 "cl:slimelitros": {
  "pt": "Slimélitros",
  "en": "Slimelytra",
  "icone": "textures/items/cl/arte/slimelitros"
 },
 "cl:solo_lunar": {
  "pt": "Solo Lunar",
  "en": "Moon Turf",
  "icone": "textures/items/cl/blocos/solo_lunar"
 },
 "cl:sopa_abobora": {
  "pt": "Sopa de Abóbora",
  "en": "Pumpkin Soup",
  "icone": "textures/items/cl/arte/sopa_abobora"
 },
 "cl:sopa_arroz": {
  "pt": "Sopa de Arroz",
  "en": "Rice Soup",
  "icone": "textures/items/cl/arte/sopa_arroz"
 },
 "cl:sopa_cacto": {
  "pt": "Sopa de Cacto",
  "en": "Cactus Soup",
  "icone": "textures/items/cl/arte/sopa_cacto"
 },
 "cl:sopa_cebola": {
  "pt": "Sopa de Cebola",
  "en": "Onion Soup",
  "icone": "textures/items/cl/arte/sopa_cebola"
 },
 "cl:sopa_frango": {
  "pt": "Sopa de Frango",
  "en": "Chicken Soup",
  "icone": "textures/items/cl/arte/sopa_frango"
 },
 "cl:sopa_legumes": {
  "pt": "Sopa de Legumes",
  "en": "Vegetable Soup",
  "icone": "textures/items/cl/arte/sopa_legumes"
 },
 "cl:sopa_macarrao": {
  "pt": "Sopa de Macarrão",
  "en": "Noodle Soup",
  "icone": "textures/items/cl/arte/sopa_macarrao"
 },
 "cl:sopa_tomate": {
  "pt": "Sopa de Tomate",
  "en": "Tomato Soup",
  "icone": "textures/items/cl/arte/sopa_tomate"
 },
 "cl:suco_cacto": {
  "pt": "Suco de Fruta do Cacto",
  "en": "Cactus Fruit Juice",
  "icone": "textures/items/cl/arte/suco_cacto"
 },
 "cl:super_varinha_construtor": {
  "pt": "Super Varinha do Construtor",
  "en": "Super Builder's Wand",
  "icone": "textures/items/cl/c/super_varinha_construtor"
 },
 "cl:suporte_ferramentas": {
  "pt": "Suporte de Ferramentas",
  "en": "Tool Rack",
  "icone": "textures/items/cl/arte/blocos/suporte_ferramentas"
 },
 "cl:tablet_energia": {
  "pt": "Tablete de Energia",
  "en": "Energy Tablet",
  "icone": "textures/items/cl/arte/tablet_energia"
 },
 "cl:tabua_cortar": {
  "pt": "Tábua de Cortar",
  "en": "Cutting Board",
  "icone": "textures/items/cl/blocos/tabua_cortar"
 },
 "cl:tabua_corte": {
  "pt": "Tábua de Corte",
  "en": "Cutting Board",
  "icone": "textures/items/cl/arte/blocos/tabua_corte"
 },
 "cl:tabuas_cascaender": {
  "pt": "Tábuas de Casca-Ender",
  "en": "Enderbark Planks",
  "icone": "textures/blocks/cl/arte/tabuas_cascaender"
 },
 "cl:tabuas_cogusangue": {
  "pt": "Tábuas de Cogumelo Sangrento",
  "en": "Bloodshroom Planks",
  "icone": "textures/blocks/cl/arte/tabuas_cogusangue"
 },
 "cl:tabuas_raizceu": {
  "pt": "Tábuas de Raízes-do-Céu",
  "en": "Skyroot Planks",
  "icone": "textures/blocks/cl/arte/tabuas_raizceu"
 },
 "cl:tabuas_tratadas": {
  "pt": "Tábuas Tratadas",
  "en": "Treated Wood",
  "icone": "textures/items/cl/blocos/tabuas_tratadas"
 },
 "cl:tabuas_verdecoracao": {
  "pt": "Tábuas de Coração-Verde",
  "en": "Greenheart Planks",
  "icone": "textures/blocks/cl/arte/tabuas_verdecoracao"
 },
 "cl:taco": {
  "pt": "Taco",
  "en": "Taco",
  "icone": "textures/items/cl/arte/taco"
 },
 "cl:tamara": {
  "pt": "Tâmara",
  "en": "Date",
  "icone": "textures/items/cl/arte/tamara"
 },
 "cl:tanque_chamuscado": {
  "pt": "Tanque Chamuscado",
  "en": "Scorched Tank",
  "icone": "textures/blocks/cl/arte/tanque_chamuscado"
 },
 "cl:tanque_fluido": {
  "pt": "Tanque de Fluido",
  "en": "Fluid Tank",
  "icone": "textures/items/cl/blocos/tanque_fluido"
 },
 "cl:tanque_fluido_pressurizado": {
  "pt": "Tanque de Fluido Pressurizado",
  "en": "Pressurized Fluid Tank",
  "icone": "textures/items/cl/blocos/tanque_fluido_pressurizado"
 },
 "cl:tanque_oxigenio_leve": {
  "pt": "Tanque de Oxigênio Leve",
  "en": "Light Oxygen Tank",
  "icone": "textures/items/cl/arte/tanque_oxigenio_leve"
 },
 "cl:tanque_oxigenio_medio": {
  "pt": "Tanque de Oxigênio Médio",
  "en": "Medium Oxygen Tank",
  "icone": "textures/items/cl/arte/tanque_oxigenio_medio"
 },
 "cl:tanque_oxigenio_pesado": {
  "pt": "Tanque de Oxigênio Pesado",
  "en": "Heavy Oxygen Tank",
  "icone": "textures/items/cl/arte/tanque_oxigenio_pesado"
 },
 "cl:tanque_refratario": {
  "pt": "Tanque Refratário",
  "en": "Seared Tank",
  "icone": "textures/items/cl/blocos/tanque_refratario"
 },
 "cl:tecido_canhamo": {
  "pt": "Tecido de Cânhamo",
  "en": "Hemp Fabric",
  "icone": "textures/items/cl/c/tecido_canhamo"
 },
 "cl:terminal": {
  "pt": "Terminal de Armazenamento",
  "en": "Storage Terminal",
  "icone": "textures/items/cl/arte/blocos/terminal"
 },
 "cl:terminal_sem_fio": {
  "pt": "Terminal Sem Fio",
  "en": "Wireless Terminal",
  "icone": "textures/items/cl/arte/terminal_sem_fio"
 },
 "cl:termogerador_ardente": {
  "pt": "Termogerador Ardente",
  "en": "Blazing Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_ardente"
 },
 "cl:termogerador_basico": {
  "pt": "Termogerador Básico",
  "en": "Basic Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_basico"
 },
 "cl:termogerador_endurecido": {
  "pt": "Termogerador Endurecido",
  "en": "Hardened Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_endurecido"
 },
 "cl:termogerador_espiritual": {
  "pt": "Termogerador Espiritual",
  "en": "Spirited Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_espiritual"
 },
 "cl:termogerador_inicial": {
  "pt": "Termogerador Inicial",
  "en": "Starter Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_inicial"
 },
 "cl:termogerador_niotico": {
  "pt": "Termogerador Niótico",
  "en": "Niotic Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_niotico"
 },
 "cl:termogerador_nitro": {
  "pt": "Termogerador Nitro",
  "en": "Nitro Thermo Generator",
  "icone": "textures/items/cl/blocos/termogerador_nitro"
 },
 "cl:terra_lunar": {
  "pt": "Terra Lunar",
  "en": "Moon Dirt",
  "icone": "textures/items/cl/blocos/terra_lunar"
 },
 "cl:terra_slime_ceu": {
  "pt": "Terra de Slime-do-Céu",
  "en": "Skyslime Dirt",
  "icone": "textures/blocks/cl/arte/terra_slime_ceu"
 },
 "cl:terra_slime_ender": {
  "pt": "Terra de Slime-do-Ender",
  "en": "Enderslime Dirt",
  "icone": "textures/blocks/cl/arte/terra_slime_ender"
 },
 "cl:terra_slime_icor": {
  "pt": "Terra de Icor",
  "en": "Ichor Dirt",
  "icone": "textures/blocks/cl/arte/terra_slime_icor"
 },
 "cl:terra_slime_terra": {
  "pt": "Terra de Slime-da-Terra",
  "en": "Earthslime Dirt",
  "icone": "textures/blocks/cl/arte/terra_slime_terra"
 },
 "cl:tesseract": {
  "pt": "Tesseract",
  "en": "Tesseract",
  "icone": "textures/items/cl/arte/blocos/tesseract"
 },
 "cl:tigela_mistura": {
  "pt": "Tigela de Mistura",
  "en": "Mixing Bowl",
  "icone": "textures/items/cl/arte/blocos/tigela_mistura"
 },
 "cl:tijolo_alto_forno": {
  "pt": "Tijolo de Alto-Forno",
  "en": "Blast Brick",
  "icone": "textures/items/cl/blocos/tijolo_alto_forno"
 },
 "cl:tijolo_chamuscado": {
  "pt": "Tijolo Chamuscado",
  "en": "Scorched Brick",
  "icone": "textures/items/cl/arte/tijolo_chamuscado"
 },
 "cl:tijolo_coque": {
  "pt": "Tijolo de Coque",
  "en": "Coke Brick",
  "icone": "textures/items/cl/blocos/tijolo_coque"
 },
 "cl:tijolo_lunar": {
  "pt": "Tijolo da Masmorra Lunar",
  "en": "Moon Dungeon Brick",
  "icone": "textures/items/cl/blocos/tijolo_lunar"
 },
 "cl:tijolo_refratario": {
  "pt": "Tijolo Refratário",
  "en": "Seared Brick",
  "icone": "textures/items/cl/arte/tijolo_refratario"
 },
 "cl:tijolos_chamuscados": {
  "pt": "Tijolos Chamuscados",
  "en": "Scorched Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_chamuscados"
 },
 "cl:tijolos_refratarios": {
  "pt": "Tijolos Refratários",
  "en": "Seared Bricks",
  "icone": "textures/items/cl/blocos/tijolos_refratarios"
 },
 "cl:tijolos_refratarios_creeper": {
  "pt": "Tijolos Refratários de Creeper",
  "en": "Creeper Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios_creeper"
 },
 "cl:tijolos_refratarios_finos": {
  "pt": "Tijolos Refratários Finos",
  "en": "Fancy Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios_finos"
 },
 "cl:tijolos_refratarios_pequenos": {
  "pt": "Tijolos Refratários Pequenos",
  "en": "Small Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios_pequenos"
 },
 "cl:tijolos_refratarios_rachados": {
  "pt": "Tijolos Refratários Rachados",
  "en": "Cracked Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios_rachados"
 },
 "cl:tijolos_refratarios_triangulo": {
  "pt": "Tijolos Refratários Triangulares",
  "en": "Triangle Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios_triangulo"
 },
 "cl:tnt_obsidiana": {
  "pt": "TNT de Obsidiana",
  "en": "Obsidian TNT",
  "icone": "textures/items/cl/blocos/tnt_obsidiana"
 },
 "cl:tomada_energia": {
  "pt": "Tomada de Energia",
  "en": "Reactor Power Tap",
  "icone": "textures/items/cl/blocos/tomada_energia"
 },
 "cl:tomate": {
  "pt": "Tomate",
  "en": "Tomato",
  "icone": "textures/items/cl/arte/tomate"
 },
 "cl:torneira": {
  "pt": "Torneira",
  "en": "Faucet",
  "icone": "textures/items/cl/blocos/torneira"
 },
 "cl:torrada": {
  "pt": "Torrada",
  "en": "Toast",
  "icone": "textures/items/cl/arte/torrada"
 },
 "cl:torrao_cobre": {
  "pt": "Aglomerado de Cobre",
  "en": "Copper Clump",
  "icone": "textures/items/cl/arte/torrao_cobre"
 },
 "cl:torrao_estanho": {
  "pt": "Aglomerado de Estanho",
  "en": "Tin Clump",
  "icone": "textures/items/cl/arte/torrao_estanho"
 },
 "cl:torrao_ferro": {
  "pt": "Aglomerado de Ferro",
  "en": "Iron Clump",
  "icone": "textures/items/cl/arte/torrao_ferro"
 },
 "cl:torrao_osmio": {
  "pt": "Aglomerado de Ósmio",
  "en": "Osmium Clump",
  "icone": "textures/items/cl/arte/torrao_osmio"
 },
 "cl:torrao_ouro": {
  "pt": "Aglomerado de Ouro",
  "en": "Gold Clump",
  "icone": "textures/items/cl/arte/torrao_ouro"
 },
 "cl:torre_defesa": {
  "pt": "Torre de Defesa",
  "en": "Defense Turret",
  "icone": "textures/items/cl/arte/blocos/torre_defesa"
 },
 "cl:tortilha": {
  "pt": "Tortilha",
  "en": "Tortilla",
  "icone": "textures/items/cl/arte/tortilha"
 },
 "cl:transistor": {
  "pt": "Transistor",
  "en": "Transistor",
  "icone": "textures/items/cl/arte/transistor"
 },
 "cl:transmissor_ardente": {
  "pt": "Transmissor de Jogador Ardente",
  "en": "Blazing Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_ardente"
 },
 "cl:transmissor_basico": {
  "pt": "Transmissor de Jogador Básico",
  "en": "Basic Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_basico"
 },
 "cl:transmissor_endurecido": {
  "pt": "Transmissor de Jogador Endurecido",
  "en": "Hardened Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_endurecido"
 },
 "cl:transmissor_espiritual": {
  "pt": "Transmissor de Jogador Espiritual",
  "en": "Spirited Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_espiritual"
 },
 "cl:transmissor_inicial": {
  "pt": "Transmissor de Jogador Inicial",
  "en": "Starter Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_inicial"
 },
 "cl:transmissor_niotico": {
  "pt": "Transmissor de Jogador Niótico",
  "en": "Niotic Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_niotico"
 },
 "cl:transmissor_nitro": {
  "pt": "Transmissor de Jogador Nitro",
  "en": "Nitro Player Transmitter",
  "icone": "textures/items/cl/blocos/transmissor_nitro"
 },
 "cl:trepadeira_slime_ceu": {
  "pt": "Trepadeira de Slime-do-Céu",
  "en": "Skyslime Vine",
  "icone": "textures/blocks/cl/arte/trepadeira_slime_ceu"
 },
 "cl:trepadeira_slime_ender": {
  "pt": "Trepadeira de Slime-do-Ender",
  "en": "Enderslime Vine",
  "icone": "textures/blocks/cl/arte/trepadeira_slime_ender"
 },
 "cl:triturado_cobre": {
  "pt": "Cobre Bruto Triturado",
  "en": "Crushed Raw Copper",
  "icone": "textures/items/cl/c/triturado_cobre"
 },
 "cl:triturado_ferro": {
  "pt": "Ferro Bruto Triturado",
  "en": "Crushed Raw Iron",
  "icone": "textures/items/cl/c/triturado_ferro"
 },
 "cl:triturado_ouro": {
  "pt": "Ouro Bruto Triturado",
  "en": "Crushed Raw Gold",
  "icone": "textures/items/cl/c/triturado_ouro"
 },
 "cl:triturado_zinco": {
  "pt": "Zinco Bruto Triturado",
  "en": "Crushed Raw Zinc",
  "icone": "textures/items/cl/c/triturado_zinco"
 },
 "cl:triturador_mk": {
  "pt": "Triturador",
  "en": "Crusher",
  "icone": "textures/items/cl/blocos/triturador_mk"
 },
 "cl:triturador_monstros": {
  "pt": "Triturador de Monstros",
  "en": "Mob Grinder",
  "icone": "textures/items/cl/arte/blocos/triturador_monstros"
 },
 "cl:tronco_cascaender": {
  "pt": "Tronco de Casca-Ender",
  "en": "Enderbark Log",
  "icone": "textures/blocks/cl/arte/tronco_cascaender_topo"
 },
 "cl:tronco_cogusangue": {
  "pt": "Tronco de Cogumelo Sangrento",
  "en": "Bloodshroom Log",
  "icone": "textures/blocks/cl/arte/tronco_cogusangue_topo"
 },
 "cl:tronco_raizceu": {
  "pt": "Tronco de Raízes-do-Céu",
  "en": "Skyroot Log",
  "icone": "textures/blocks/cl/arte/tronco_raizceu_topo"
 },
 "cl:tronco_verdecoracao": {
  "pt": "Tronco de Coração-Verde",
  "en": "Greenheart Log",
  "icone": "textures/blocks/cl/arte/tronco_verdecoracao_topo"
 },
 "cl:tubo_pressao": {
  "pt": "Tubo de Pressão",
  "en": "Pressure Tube",
  "icone": "textures/items/cl/arte/blocos/tubo_pressao"
 },
 "cl:tubo_pressao_avancado": {
  "pt": "Tubo de Pressão Avançado",
  "en": "Advanced Pressure Tube",
  "icone": "textures/items/cl/arte/blocos/tubo_pressao_avancado"
 },
 "cl:tumulo": {
  "pt": "Túmulo",
  "en": "Grave",
  "icone": "textures/items/cl/blocos/tumulo"
 },
 "cl:upgrade_alcance_1": {
  "pt": "Upgrade de Alcance +1",
  "en": "Range Upgrade +1",
  "icone": "textures/items/cl/arte/upgrade_alcance_1"
 },
 "cl:upgrade_alcance_2": {
  "pt": "Upgrade de Alcance +2",
  "en": "Range Upgrade +2",
  "icone": "textures/items/cl/arte/upgrade_alcance_2"
 },
 "cl:upgrade_alcance_3": {
  "pt": "Upgrade de Alcance +3",
  "en": "Range Upgrade +3",
  "icone": "textures/items/cl/arte/upgrade_alcance_3"
 },
 "cl:upgrade_alcance_4": {
  "pt": "Upgrade de Alcance +4",
  "en": "Range Upgrade +4",
  "icone": "textures/items/cl/arte/upgrade_alcance_4"
 },
 "cl:upgrade_alcance_5": {
  "pt": "Upgrade de Alcance +5",
  "en": "Range Upgrade +5",
  "icone": "textures/items/cl/arte/upgrade_alcance_5"
 },
 "cl:upgrade_armazenamento": {
  "pt": "Upgrade de Armazenamento",
  "en": "Storage Upgrade",
  "icone": "textures/items/cl/arte/upgrade_armazenamento"
 },
 "cl:upgrade_estrutural_1": {
  "pt": "Upgrade Estrutural MK I",
  "en": "Structural Upgrade MK I",
  "icone": "textures/items/cl/arte/upgrade_estrutural_1"
 },
 "cl:upgrade_estrutural_2": {
  "pt": "Upgrade Estrutural MK II",
  "en": "Structural Upgrade MK II",
  "icone": "textures/items/cl/arte/upgrade_estrutural_2"
 },
 "cl:upgrade_estrutural_3": {
  "pt": "Upgrade Estrutural MK III",
  "en": "Structural Upgrade MK III",
  "icone": "textures/items/cl/arte/upgrade_estrutural_3"
 },
 "cl:upgrade_estrutural_4": {
  "pt": "Upgrade Estrutural MK IV",
  "en": "Structural Upgrade MK IV",
  "icone": "textures/items/cl/arte/upgrade_estrutural_4"
 },
 "cl:upgrade_estrutural_5": {
  "pt": "Upgrade Estrutural MK V",
  "en": "Structural Upgrade MK V",
  "icone": "textures/items/cl/arte/upgrade_estrutural_5"
 },
 "cl:upgrade_estrutural_6": {
  "pt": "Upgrade Estrutural MK VI",
  "en": "Structural Upgrade MK VI",
  "icone": "textures/items/cl/arte/upgrade_estrutural_6"
 },
 "cl:upgrade_estrutural_7": {
  "pt": "Upgrade Estrutural MK VII",
  "en": "Structural Upgrade MK VII",
  "icone": "textures/items/cl/arte/upgrade_estrutural_7"
 },
 "cl:uraninita": {
  "pt": "Uraninita",
  "en": "Uraninite",
  "icone": "textures/items/cl/arte/uraninita"
 },
 "cl:uraninita_bruta": {
  "pt": "Uraninita Bruta",
  "en": "Raw Uraninite",
  "icone": "textures/items/cl/arte/uraninita_bruta"
 },
 "cl:uraninita_bruta_densa": {
  "pt": "Uraninita Bruta Densa",
  "en": "Dense Raw Uraninite",
  "icone": "textures/items/cl/arte/uraninita_bruta_densa"
 },
 "cl:uraninita_bruta_pobre": {
  "pt": "Uraninita Bruta Pobre",
  "en": "Poor Raw Uraninite",
  "icone": "textures/items/cl/arte/uraninita_bruta_pobre"
 },
 "cl:vacuo_xp": {
  "pt": "Vácuo de XP",
  "en": "XP Vacuum",
  "icone": "textures/items/cl/blocos/vacuo_xp"
 },
 "cl:valvula_camara": {
  "pt": "Válvula da Câmara",
  "en": "Pressure Chamber Valve",
  "icone": "textures/items/cl/blocos/valvula_camara"
 },
 "cl:vara_experiencia": {
  "pt": "Vara de Experiência",
  "en": "Experience Rod",
  "icone": "textures/items/cl/arte/vara_experiencia"
 },
 "cl:vara_infinito": {
  "pt": "Vara do Infinito",
  "en": "Infinity Rod",
  "icone": "textures/items/cl/arte/vara_infinito"
 },
 "cl:varal": {
  "pt": "Varal",
  "en": "Drying Rack",
  "icone": "textures/items/cl/blocos/varal"
 },
 "cl:varinha_construtor": {
  "pt": "Varinha do Construtor",
  "en": "Builder's Wand",
  "icone": "textures/items/cl/c/varinha_construtor"
 },
 "cl:vela_aeronave": {
  "pt": "Vela",
  "en": "Sail",
  "icone": "textures/items/cl/arte/vela_aeronave"
 },
 "cl:vela_lona": {
  "pt": "Vela de Moinho",
  "en": "Windmill Sail",
  "icone": "textures/items/cl/c/vela_lona"
 },
 "cl:vela_moinho": {
  "pt": "Vela de Moinho",
  "en": "Sail",
  "icone": "textures/items/cl/blocos/vela_moinho"
 },
 "cl:ventilador": {
  "pt": "Ventilador Revestido",
  "en": "Encased Fan",
  "icone": "textures/items/cl/blocos/ventilador"
 },
 "cl:ventilador_oxigenio": {
  "pt": "Ventilador de Oxigênio",
  "en": "Oxygen Fan",
  "icone": "textures/items/cl/c/ventilador_oxigenio"
 },
 "cl:vidro_alma_refratario": {
  "pt": "Vidro de Alma Refratário",
  "en": "Seared Soul Glass",
  "icone": "textures/blocks/cl/arte/vidro_alma_refratario"
 },
 "cl:vidro_camara": {
  "pt": "Vidro da Câmara de Pressão",
  "en": "Pressure Chamber Glass",
  "icone": "textures/items/cl/blocos/vidro_camara"
 },
 "cl:vidro_chamuscado": {
  "pt": "Vidro Chamuscado",
  "en": "Scorched Glass",
  "icone": "textures/blocks/cl/arte/vidro_chamuscado"
 },
 "cl:vidro_emoldurado": {
  "pt": "Vidro Emoldurado",
  "en": "Framed Glass",
  "icone": "textures/items/cl/blocos/vidro_emoldurado"
 },
 "cl:vidro_entalhado": {
  "pt": "Vidro Entalhado",
  "en": "Carved Glass",
  "icone": "textures/items/cl/blocos/vidro_entalhado"
 },
 "cl:vidro_fume_refratario": {
  "pt": "Vidro Fumê Refratário",
  "en": "Seared Tinted Glass",
  "icone": "textures/blocks/cl/arte/vidro_fume_refratario"
 },
 "cl:vidro_ladrilho": {
  "pt": "Vidro Ladrilho",
  "en": "Tiles Glass",
  "icone": "textures/items/cl/blocos/vidro_ladrilho"
 },
 "cl:vidro_liso": {
  "pt": "Vidro Liso",
  "en": "Smooth Glass",
  "icone": "textures/items/cl/blocos/vidro_liso"
 },
 "cl:vidro_mosaico": {
  "pt": "Vidro Mosaico",
  "en": "Mosaic Glass",
  "icone": "textures/items/cl/blocos/vidro_mosaico"
 },
 "cl:vidro_pilar": {
  "pt": "Vidro Pilar",
  "en": "Pillar Glass",
  "icone": "textures/items/cl/blocos/vidro_pilar"
 },
 "cl:vidro_polido": {
  "pt": "Vidro Polido",
  "en": "Polished Glass",
  "icone": "textures/items/cl/blocos/vidro_polido"
 },
 "cl:vidro_quartzo": {
  "pt": "Vidro de Quartzo",
  "en": "Quartz Glass",
  "icone": "textures/blocks/cl/c/vidro_quartzo"
 },
 "cl:vidro_reator": {
  "pt": "Vidro do Reator",
  "en": "Reactor Glass",
  "icone": "textures/items/cl/blocos/vidro_reator"
 },
 "cl:vidro_refratario": {
  "pt": "Vidro Refratário",
  "en": "Seared Glass",
  "icone": "textures/items/cl/blocos/vidro_refratario"
 },
 "cl:vidro_tijolos": {
  "pt": "Vidro Tijolos",
  "en": "Bricks Glass",
  "icone": "textures/items/cl/blocos/vidro_tijolos"
 },
 "cl:vidro_tijolos_pequenos": {
  "pt": "Vidro Tijolinhos",
  "en": "Small Bricks Glass",
  "icone": "textures/items/cl/blocos/vidro_tijolos_pequenos"
 },
 "cl:vidro_transparente": {
  "pt": "Vidro Transparente",
  "en": "Clear Glass",
  "icone": "textures/items/cl/blocos/vidro_transparente"
 },
 "cl:vidro_transparente_escuro": {
  "pt": "Vidro Transparente Escuro",
  "en": "Dark Clear Glass",
  "icone": "textures/items/cl/blocos/vidro_transparente_escuro"
 },
 "cl:vidro_transparente_iluminado": {
  "pt": "Vidro Transparente Iluminado",
  "en": "Enlightened Clear Glass",
  "icone": "textures/items/cl/blocos/vidro_transparente_iluminado"
 },
 "cl:vinculador_almas": {
  "pt": "Vinculador de Almas",
  "en": "Soul Binder",
  "icone": "textures/items/cl/blocos/vinculador_almas"
 },
 "cl:wafer_avancado": {
  "pt": "Wafer Avançado",
  "en": "Advanced Wafer",
  "icone": "textures/items/cl/c/wafer_avancado"
 },
 "cl:wafer_basico": {
  "pt": "Wafer Básico",
  "en": "Basic Wafer",
  "icone": "textures/items/cl/c/wafer_basico"
 },
 "cl:wrap_carneiro": {
  "pt": "Wrap de Carneiro",
  "en": "Mutton Wrap",
  "icone": "textures/items/cl/arte/wrap_carneiro"
 },
 "cl:xisto": {
  "pt": "Xisto",
  "en": "Shale",
  "icone": "textures/items/cl/blocos/xisto"
 },
 "cl:xisto_entalhado": {
  "pt": "Xisto Entalhado",
  "en": "Chiseled Shale",
  "icone": "textures/items/cl/blocos/xisto_entalhado"
 },
 "cl:xisto_pilar": {
  "pt": "Xisto (Pilar)",
  "en": "Shale Pillar",
  "icone": "textures/items/cl/blocos/xisto_pilar"
 },
 "cl:xisto_polido": {
  "pt": "Xisto Polido",
  "en": "Polished Shale",
  "icone": "textures/items/cl/blocos/xisto_polido"
 },
 "cl:xisto_tijolos": {
  "pt": "Xisto (Tijolos)",
  "en": "Shale Bricks",
  "icone": "textures/items/cl/blocos/xisto_tijolos"
 },
 "cl:zinco_po": {
  "pt": "Pó de Minério de Zinco",
  "en": "Powdered Zinc Ore",
  "icone": "textures/items/cl/c/zinco_po"
 },
 "cl:zinco_quebrado": {
  "pt": "Pedaço Quebrado de Zinco",
  "en": "Broken Zinc Ore",
  "icone": "textures/items/cl/c/zinco_quebrado"
 },
 "cl:zinco_triturado": {
  "pt": "Pedaço Triturado de Zinco",
  "en": "Crushed Zinc Ore Piece",
  "icone": "textures/items/cl/c/zinco_triturado"
 },
 "minecraft:acacia_leaves": {
  "pt": "Folhas de Acácia",
  "en": "Acacia Leaves",
  "icone": "textures/blocks/leaves_acacia_carried"
 },
 "minecraft:acacia_log": {
  "pt": "Tronco de Acácia",
  "en": "Acacia Log",
  "icone": "textures/blocks/log_acacia"
 },
 "minecraft:acacia_planks": {
  "pt": "Tábuas de Acácia",
  "en": "Acacia Planks",
  "icone": "textures/blocks/planks_acacia"
 },
 "minecraft:acacia_sapling": {
  "pt": "Muda de Acácia",
  "en": "Acacia Sapling",
  "icone": "textures/blocks/sapling_acacia"
 },
 "minecraft:acacia_slab": {
  "pt": "Laje de Acácia",
  "en": "Acacia Slab",
  "icone": "textures/blocks/planks_acacia"
 },
 "minecraft:amethyst_block": {
  "pt": "Bloco de Ametista",
  "en": "Block of Amethyst",
  "icone": "textures/blocks/amethyst_block"
 },
 "minecraft:amethyst_shard": {
  "pt": "Fragmento de Ametista",
  "en": "Amethyst Shard",
  "icone": "textures/items/amethyst_shard"
 },
 "minecraft:andesite": {
  "pt": "Andesito",
  "en": "Andesite",
  "icone": "textures/blocks/stone_andesite"
 },
 "minecraft:anvil": {
  "pt": "Bigorna",
  "en": "Anvil",
  "icone": "textures/blocks/anvil_base"
 },
 "minecraft:apple": {
  "pt": "Maçã",
  "en": "Apple",
  "icone": "textures/items/apple"
 },
 "minecraft:arrow": {
  "pt": "Flecha",
  "en": "Arrow",
  "icone": "textures/items/arrow"
 },
 "minecraft:baked_potato": {
  "pt": "Batata Assada",
  "en": "Baked Potato",
  "icone": "textures/items/potato_baked"
 },
 "minecraft:bamboo": {
  "pt": "Bambu",
  "en": "Bamboo",
  "icone": "textures/blocks/bamboo_stem"
 },
 "minecraft:barrel": {
  "pt": "Barril",
  "en": "Barrel",
  "icone": "textures/blocks/barrel_side"
 },
 "minecraft:basalt": {
  "pt": "Basalto",
  "en": "Basalt",
  "icone": "textures/blocks/basalt_side"
 },
 "minecraft:beef": {
  "pt": "Bife Cru",
  "en": "Raw Beef",
  "icone": "textures/items/beef_raw"
 },
 "minecraft:beetroot": {
  "pt": "Beterraba",
  "en": "Beetroot",
  "icone": "textures/items/beetroot"
 },
 "minecraft:beetroot_seeds": {
  "pt": "Sementes de Beterraba",
  "en": "Beetroot Seeds",
  "icone": "textures/items/seeds_beetroot"
 },
 "minecraft:beetroot_soup": {
  "pt": "Sopa de Beterraba",
  "en": "Beetroot Soup",
  "icone": "textures/items/beetroot_soup"
 },
 "minecraft:birch_leaves": {
  "pt": "Folhas de Bétula",
  "en": "Birch Leaves",
  "icone": "textures/blocks/leaves_birch_carried"
 },
 "minecraft:birch_log": {
  "pt": "Tronco de Bétula",
  "en": "Birch Log",
  "icone": "textures/blocks/log_birch"
 },
 "minecraft:birch_planks": {
  "pt": "Tábuas de Bétula",
  "en": "Birch Planks",
  "icone": "textures/blocks/planks_birch"
 },
 "minecraft:birch_sapling": {
  "pt": "Muda de Bétula",
  "en": "Birch Sapling",
  "icone": "textures/blocks/sapling_birch"
 },
 "minecraft:birch_slab": {
  "pt": "Laje de Bétula",
  "en": "Birch Slab",
  "icone": "textures/blocks/planks_birch"
 },
 "minecraft:black_dye": {
  "pt": "black_dye",
  "en": "black_dye"
 },
 "minecraft:blackstone": {
  "pt": "Pedra-Negra",
  "en": "Blackstone",
  "icone": "textures/blocks/blackstone"
 },
 "minecraft:blast_furnace": {
  "pt": "Fornalha Potente",
  "en": "Blast Furnace",
  "icone": "textures/blocks/blast_furnace_side"
 },
 "minecraft:blaze_powder": {
  "pt": "Pó de Chamas",
  "en": "Blaze Powder",
  "icone": "textures/items/blaze_powder"
 },
 "minecraft:blaze_rod": {
  "pt": "Vara Incandescente",
  "en": "Blaze Rod",
  "icone": "textures/items/blaze_rod"
 },
 "minecraft:blue_dye": {
  "pt": "Corante Azul",
  "en": "Blue Dye",
  "icone": "textures/items/dye_powder_blue_new"
 },
 "minecraft:bone": {
  "pt": "Osso",
  "en": "Bone",
  "icone": "textures/items/bone"
 },
 "minecraft:bone_block": {
  "pt": "Bloco de Ossos",
  "en": "Bone Block",
  "icone": "textures/blocks/bone_block_side"
 },
 "minecraft:bone_meal": {
  "pt": "Farinha de Osso",
  "en": "Bone Meal",
  "icone": "textures/items/dye_powder_white"
 },
 "minecraft:book": {
  "pt": "Livro",
  "en": "Book",
  "icone": "textures/items/book_normal"
 },
 "minecraft:bowl": {
  "pt": "Tigela",
  "en": "Bowl",
  "icone": "textures/items/bowl"
 },
 "minecraft:bread": {
  "pt": "Pão",
  "en": "Bread",
  "icone": "textures/items/bread"
 },
 "minecraft:brick": {
  "pt": "Tijolo",
  "en": "Brick",
  "icone": "textures/items/brick"
 },
 "minecraft:brick_block": {
  "pt": "Tijolos",
  "en": "Bricks",
  "icone": "textures/blocks/brick"
 },
 "minecraft:brown_carpet": {
  "pt": "Carpete Marrom",
  "en": "Brown Carpet",
  "icone": "textures/blocks/wool_colored_brown"
 },
 "minecraft:brown_dye": {
  "pt": "brown_dye",
  "en": "brown_dye"
 },
 "minecraft:brown_mushroom": {
  "pt": "Cogumelo Marrom",
  "en": "Brown Mushroom",
  "icone": "textures/blocks/mushroom_brown"
 },
 "minecraft:bucket": {
  "pt": "Balde",
  "en": "Bucket",
  "icone": "textures/items/bucket_empty"
 },
 "minecraft:cactus": {
  "pt": "Cacto",
  "en": "Cactus",
  "icone": "textures/blocks/cactus_side"
 },
 "minecraft:calcite": {
  "pt": "Calcita",
  "en": "Calcite",
  "icone": "textures/blocks/calcite"
 },
 "minecraft:campfire": {
  "pt": "Fogueira",
  "en": "Campfire",
  "icone": "textures/items/campfire"
 },
 "minecraft:carrot": {
  "pt": "Cenoura",
  "en": "Carrot",
  "icone": "textures/items/carrot"
 },
 "minecraft:carrots": {
  "pt": "Cenouras",
  "en": "Carrots",
  "icone": "textures/blocks/carrots_stage_0"
 },
 "minecraft:chain": {
  "pt": "Corrente",
  "en": "Chain",
  "icone": "textures/items/chain"
 },
 "minecraft:charcoal": {
  "pt": "Carvão Vegetal",
  "en": "Charcoal",
  "icone": "textures/items/charcoal"
 },
 "minecraft:cherry_log": {
  "pt": "Tora de Cerejeira",
  "en": "Cherry Log",
  "icone": "textures/blocks/cherry_log_side"
 },
 "minecraft:cherry_planks": {
  "pt": "Tábuas de Cerejeira",
  "en": "Cherry Planks",
  "icone": "textures/blocks/cherry_planks"
 },
 "minecraft:chest": {
  "pt": "Baú",
  "en": "Chest",
  "icone": "textures/blocks/chest_front"
 },
 "minecraft:chicken": {
  "pt": "Frango Cru",
  "en": "Raw Chicken",
  "icone": "textures/items/chicken_raw"
 },
 "minecraft:chiseled_sandstone": {
  "pt": "Arenito Cinzelado",
  "en": "Chiseled Sandstone",
  "icone": "textures/blocks/sandstone_carved"
 },
 "minecraft:clay": {
  "pt": "Argila",
  "en": "Clay",
  "icone": "textures/blocks/clay"
 },
 "minecraft:clay_ball": {
  "pt": "Bola de Barro",
  "en": "Clay Ball",
  "icone": "textures/items/clay_ball"
 },
 "minecraft:clock": {
  "pt": "Relógio",
  "en": "Clock",
  "icone": "textures/items/clock_item"
 },
 "minecraft:coal": {
  "pt": "Carvão",
  "en": "Coal",
  "icone": "textures/items/coal"
 },
 "minecraft:coal_block": {
  "pt": "Bloco de Carvão",
  "en": "Block of Coal",
  "icone": "textures/blocks/coal_block"
 },
 "minecraft:coal_ore": {
  "pt": "Minério de Carvão",
  "en": "Coal Ore",
  "icone": "textures/blocks/coal_ore"
 },
 "minecraft:cobbled_deepslate": {
  "pt": "Pedregulho de Ardosiabissal",
  "en": "Cobbled Deepslate",
  "icone": "textures/blocks/deepslate/cobbled_deepslate"
 },
 "minecraft:cobblestone": {
  "pt": "Pedregulho",
  "en": "Cobblestone",
  "icone": "textures/blocks/cobblestone"
 },
 "minecraft:cocoa_beans": {
  "pt": "Sementes de Cacau",
  "en": "Cocoa Beans",
  "icone": "textures/items/dye_powder_brown"
 },
 "minecraft:compass": {
  "pt": "Bússola",
  "en": "Compass",
  "icone": "textures/items/compass_item"
 },
 "minecraft:composter": {
  "pt": "Composteira",
  "en": "Composter",
  "icone": "textures/blocks/composter_side"
 },
 "minecraft:cooked_beef": {
  "pt": "Bife",
  "en": "Steak",
  "icone": "textures/items/beef_cooked"
 },
 "minecraft:cooked_chicken": {
  "pt": "Frango Assado",
  "en": "Cooked Chicken",
  "icone": "textures/items/chicken_cooked"
 },
 "minecraft:cooked_cod": {
  "pt": "Bacalhau Assado",
  "en": "Cooked Cod",
  "icone": "textures/items/fish_cooked"
 },
 "minecraft:cooked_mutton": {
  "pt": "Carneiro Assado",
  "en": "Cooked Mutton",
  "icone": "textures/items/mutton_cooked"
 },
 "minecraft:cooked_porkchop": {
  "pt": "Costeleta de Porco Assada",
  "en": "Cooked Porkchop",
  "icone": "textures/items/porkchop_cooked"
 },
 "minecraft:cooked_rabbit": {
  "pt": "Coelho Assado",
  "en": "Cooked Rabbit",
  "icone": "textures/items/rabbit_cooked"
 },
 "minecraft:cooked_salmon": {
  "pt": "Salmão Assado",
  "en": "Cooked Salmon",
  "icone": "textures/items/fish_salmon_cooked"
 },
 "minecraft:cookie": {
  "pt": "Biscoito",
  "en": "Cookie",
  "icone": "textures/items/cookie"
 },
 "minecraft:copper_block": {
  "pt": "Bloco de Cobre",
  "en": "Block of Copper",
  "icone": "textures/blocks/copper_block"
 },
 "minecraft:copper_ingot": {
  "pt": "Barra de Cobre",
  "en": "Copper Ingot",
  "icone": "textures/items/copper_ingot"
 },
 "minecraft:copper_ore": {
  "pt": "Minério de Cobre",
  "en": "Copper Ore",
  "icone": "textures/blocks/copper_ore"
 },
 "minecraft:cracked_stone_bricks": {
  "pt": "Tijolos de Pedra Rachados",
  "en": "Cracked Stone Bricks",
  "icone": "textures/blocks/stonebrick_cracked"
 },
 "minecraft:crafting_table": {
  "pt": "Bancada de Trabalho",
  "en": "Crafting Table",
  "icone": "textures/blocks/crafting_table_front"
 },
 "minecraft:cut_sandstone": {
  "pt": "Arenito Lapidado",
  "en": "Cut Sandstone",
  "icone": "textures/blocks/sandstone_smooth"
 },
 "minecraft:cyan_dye": {
  "pt": "Corante Ciano",
  "en": "Cyan Dye",
  "icone": "textures/items/dye_powder_cyan"
 },
 "minecraft:dark_oak_log": {
  "pt": "Tora de Carvalho Escuro",
  "en": "Dark Oak Log",
  "icone": "textures/blocks/log_big_oak"
 },
 "minecraft:dark_oak_planks": {
  "pt": "Tábuas de Carvalho Escuro",
  "en": "Dark Oak Planks",
  "icone": "textures/blocks/planks_big_oak"
 },
 "minecraft:deadbush": {
  "pt": "Arbusto Morto",
  "en": "Dead Bush",
  "icone": "textures/blocks/deadbush"
 },
 "minecraft:deepslate": {
  "pt": "Ardosiabissal",
  "en": "Deepslate",
  "icone": "textures/blocks/deepslate/deepslate"
 },
 "minecraft:deepslate_coal_ore": {
  "pt": "Minério de Carvão de Ardosiabissal",
  "en": "Deepslate Coal Ore",
  "icone": "textures/blocks/deepslate/deepslate_coal_ore"
 },
 "minecraft:deepslate_copper_ore": {
  "pt": "Minério de Cobre de Ardosiabissal",
  "en": "Deepslate Copper Ore",
  "icone": "textures/blocks/deepslate/deepslate_copper_ore"
 },
 "minecraft:deepslate_diamond_ore": {
  "pt": "Minério de Diamante de Ardosiabissal",
  "en": "Deepslate Diamond Ore",
  "icone": "textures/blocks/deepslate/deepslate_diamond_ore"
 },
 "minecraft:deepslate_emerald_ore": {
  "pt": "Minério de Esmeralda de Ardosiabissal",
  "en": "Deepslate Emerald Ore",
  "icone": "textures/blocks/deepslate/deepslate_emerald_ore"
 },
 "minecraft:deepslate_gold_ore": {
  "pt": "Minério de Ouro de Ardosiabissal",
  "en": "Deepslate Gold Ore",
  "icone": "textures/blocks/deepslate/deepslate_gold_ore"
 },
 "minecraft:deepslate_iron_ore": {
  "pt": "Minério de Ferro de Ardosiabissal",
  "en": "Deepslate Iron Ore",
  "icone": "textures/blocks/deepslate/deepslate_iron_ore"
 },
 "minecraft:deepslate_lapis_ore": {
  "pt": "Minério de Lápis-Lazúli de Ardosiabissal",
  "en": "Deepslate Lapis Lazuli Ore",
  "icone": "textures/blocks/deepslate/deepslate_lapis_ore"
 },
 "minecraft:deepslate_redstone_ore": {
  "pt": "Minério de Redstone de Ardosiabissal",
  "en": "Deepslate Redstone Ore",
  "icone": "textures/blocks/deepslate/deepslate_redstone_ore"
 },
 "minecraft:diamond": {
  "pt": "Diamante",
  "en": "Diamond",
  "icone": "textures/items/diamond"
 },
 "minecraft:diamond_axe": {
  "pt": "Machado de Diamante",
  "en": "Diamond Axe",
  "icone": "textures/items/diamond_axe"
 },
 "minecraft:diamond_block": {
  "pt": "Bloco de Diamante",
  "en": "Block of Diamond",
  "icone": "textures/blocks/diamond_block"
 },
 "minecraft:diamond_ore": {
  "pt": "Minério de Diamante",
  "en": "Diamond Ore",
  "icone": "textures/blocks/diamond_ore"
 },
 "minecraft:diamond_pickaxe": {
  "pt": "Picareta de Diamante",
  "en": "Diamond Pickaxe",
  "icone": "textures/items/diamond_pickaxe"
 },
 "minecraft:diamond_shovel": {
  "pt": "Pá de Diamante",
  "en": "Diamond Shovel",
  "icone": "textures/items/diamond_shovel"
 },
 "minecraft:diorite": {
  "pt": "diorite",
  "en": "diorite",
  "icone": "textures/blocks/stone_diorite"
 },
 "minecraft:dirt": {
  "pt": "Terra",
  "en": "Dirt",
  "icone": "textures/blocks/dirt"
 },
 "minecraft:dispenser": {
  "pt": "Ejetor",
  "en": "Dispenser",
  "icone": "textures/blocks/furnace_side"
 },
 "minecraft:dried_kelp": {
  "pt": "Algas Secas",
  "en": "Dried Kelp",
  "icone": "textures/items/dried_kelp"
 },
 "minecraft:dried_kelp_block": {
  "pt": "Bloco de Algas Secas",
  "en": "Dried Kelp Block",
  "icone": "textures/blocks/dried_kelp_side_a"
 },
 "minecraft:egg": {
  "pt": "Ovo",
  "en": "Egg",
  "icone": "textures/items/egg"
 },
 "minecraft:emerald": {
  "pt": "Esmeralda",
  "en": "Emerald",
  "icone": "textures/items/emerald"
 },
 "minecraft:emerald_block": {
  "pt": "Bloco de Esmeraldas",
  "en": "Block of Emerald",
  "icone": "textures/blocks/emerald_block"
 },
 "minecraft:emerald_ore": {
  "pt": "Minério de Esmeralda",
  "en": "Emerald Ore",
  "icone": "textures/blocks/emerald_ore"
 },
 "minecraft:enchanted_golden_apple": {
  "pt": "Maçã Dourada Encantada",
  "en": "Enchanted Golden Apple",
  "icone": "textures/items/apple_golden"
 },
 "minecraft:enchanting_table": {
  "pt": "Mesa de Encantamentos",
  "en": "Enchanting Table",
  "icone": "textures/blocks/enchanting_table_side"
 },
 "minecraft:end_stone": {
  "pt": "Pedra do End",
  "en": "End Stone",
  "icone": "textures/blocks/end_stone"
 },
 "minecraft:ender_pearl": {
  "pt": "Pérola de Ender",
  "en": "Ender Pearl",
  "icone": "textures/items/ender_pearl"
 },
 "minecraft:experience_bottle": {
  "pt": "Frasco de Experiência",
  "en": "Bottle o' Enchanting",
  "icone": "textures/items/experience_bottle"
 },
 "minecraft:feather": {
  "pt": "Pena",
  "en": "Feather",
  "icone": "textures/items/feather"
 },
 "minecraft:fermented_spider_eye": {
  "pt": "Olho de Aranha Fermentado",
  "en": "Fermented Spider Eye",
  "icone": "textures/items/spider_eye_fermented"
 },
 "minecraft:fire": {
  "pt": "Fogo",
  "en": "Fire",
  "icone": "textures/blocks/fire_0"
 },
 "minecraft:flint": {
  "pt": "Sílex",
  "en": "Flint",
  "icone": "textures/items/flint"
 },
 "minecraft:flint_and_steel": {
  "pt": "Pederneira",
  "en": "Flint and Steel",
  "icone": "textures/items/flint_and_steel"
 },
 "minecraft:flower_pot": {
  "pt": "Vaso de Flor",
  "en": "Flower Pot",
  "icone": "textures/items/flower_pot"
 },
 "minecraft:furnace": {
  "pt": "Fornalha",
  "en": "Furnace",
  "icone": "textures/blocks/furnace_front_off"
 },
 "minecraft:glass": {
  "pt": "Vidro",
  "en": "Glass",
  "icone": "textures/blocks/glass"
 },
 "minecraft:glass_bottle": {
  "pt": "Frasco de Vidro",
  "en": "Glass Bottle",
  "icone": "textures/items/potion_bottle_empty"
 },
 "minecraft:glass_pane": {
  "pt": "Painel de Vidro",
  "en": "Glass Pane",
  "icone": "textures/blocks/glass"
 },
 "minecraft:glistering_melon_slice": {
  "pt": "glistering_melon_slice",
  "en": "glistering_melon_slice"
 },
 "minecraft:glowstone": {
  "pt": "Pedra Luminosa",
  "en": "Glowstone",
  "icone": "textures/blocks/glowstone"
 },
 "minecraft:glowstone_dust": {
  "pt": "Pó de Pedra Luminosa",
  "en": "Glowstone Dust",
  "icone": "textures/items/glowstone_dust"
 },
 "minecraft:gold_block": {
  "pt": "Bloco de Ouro",
  "en": "Block of Gold",
  "icone": "textures/blocks/gold_block"
 },
 "minecraft:gold_ingot": {
  "pt": "Barra de Ouro",
  "en": "Gold Ingot",
  "icone": "textures/items/gold_ingot"
 },
 "minecraft:gold_nugget": {
  "pt": "Pepita de Ouro",
  "en": "Gold Nugget",
  "icone": "textures/items/gold_nugget"
 },
 "minecraft:gold_ore": {
  "pt": "Minério de Ouro",
  "en": "Gold Ore",
  "icone": "textures/blocks/gold_ore"
 },
 "minecraft:golden_apple": {
  "pt": "Maçã Dourada",
  "en": "Golden Apple",
  "icone": "textures/items/apple_golden"
 },
 "minecraft:golden_axe": {
  "pt": "Machado de Ouro",
  "en": "Golden Axe",
  "icone": "textures/items/gold_axe"
 },
 "minecraft:golden_carrot": {
  "pt": "Cenoura Dourada",
  "en": "Golden Carrot",
  "icone": "textures/items/carrot_golden"
 },
 "minecraft:golden_hoe": {
  "pt": "Enxada de Ouro",
  "en": "Golden Hoe",
  "icone": "textures/items/gold_hoe"
 },
 "minecraft:golden_pickaxe": {
  "pt": "Picareta de Ouro",
  "en": "Golden Pickaxe",
  "icone": "textures/items/gold_pickaxe"
 },
 "minecraft:golden_shovel": {
  "pt": "Pá de Ouro",
  "en": "Golden Shovel",
  "icone": "textures/items/gold_shovel"
 },
 "minecraft:granite": {
  "pt": "granite",
  "en": "granite",
  "icone": "textures/blocks/stone_granite"
 },
 "minecraft:gravel": {
  "pt": "Cascalho",
  "en": "Gravel",
  "icone": "textures/blocks/gravel"
 },
 "minecraft:gray_carpet": {
  "pt": "Carpete Cinza",
  "en": "Gray Carpet",
  "icone": "textures/blocks/wool_colored_gray"
 },
 "minecraft:gray_dye": {
  "pt": "gray_dye",
  "en": "gray_dye"
 },
 "minecraft:green_dye": {
  "pt": "Corante Verde",
  "en": "Green Dye",
  "icone": "textures/items/dye_powder_green_new"
 },
 "minecraft:gunpowder": {
  "pt": "Pólvora",
  "en": "Gunpowder",
  "icone": "textures/items/gunpowder"
 },
 "minecraft:hardened_clay": {
  "pt": "Terracota",
  "en": "Terracotta",
  "icone": "textures/blocks/hardened_clay"
 },
 "minecraft:hay_block": {
  "pt": "Fardo de Feno",
  "en": "Hay Bale",
  "icone": "textures/blocks/hay_block_side"
 },
 "minecraft:honey_bottle": {
  "pt": "Frasco de Mel",
  "en": "Honey Bottle",
  "icone": "textures/items/honey_bottle"
 },
 "minecraft:hopper": {
  "pt": "Funil",
  "en": "Hopper",
  "icone": "textures/items/hopper"
 },
 "minecraft:ice": {
  "pt": "Gelo",
  "en": "Ice",
  "icone": "textures/blocks/ice"
 },
 "minecraft:iron_axe": {
  "pt": "Machado de Ferro",
  "en": "Iron Axe",
  "icone": "textures/items/iron_axe"
 },
 "minecraft:iron_bars": {
  "pt": "Grade de Ferro",
  "en": "Iron Bars",
  "icone": "textures/blocks/iron_bars"
 },
 "minecraft:iron_block": {
  "pt": "Bloco de Ferro",
  "en": "Block of Iron",
  "icone": "textures/blocks/iron_block"
 },
 "minecraft:iron_chestplate": {
  "pt": "Peitoral de Ferro",
  "en": "Iron Chestplate",
  "icone": "textures/items/iron_chestplate"
 },
 "minecraft:iron_helmet": {
  "pt": "Capacete de Ferro",
  "en": "Iron Helmet",
  "icone": "textures/items/iron_helmet"
 },
 "minecraft:iron_ingot": {
  "pt": "Barra de Ferro",
  "en": "Iron Ingot",
  "icone": "textures/items/iron_ingot"
 },
 "minecraft:iron_nugget": {
  "pt": "Pepita de Ferro",
  "en": "Iron Nugget",
  "icone": "textures/items/iron_nugget"
 },
 "minecraft:iron_ore": {
  "pt": "Minério de Ferro",
  "en": "Iron Ore",
  "icone": "textures/blocks/iron_ore"
 },
 "minecraft:iron_pickaxe": {
  "pt": "Picareta de Ferro",
  "en": "Iron Pickaxe",
  "icone": "textures/items/iron_pickaxe"
 },
 "minecraft:iron_shovel": {
  "pt": "Pá de Ferro",
  "en": "Iron Shovel",
  "icone": "textures/items/iron_shovel"
 },
 "minecraft:iron_sword": {
  "pt": "Espada de Ferro",
  "en": "Iron Sword",
  "icone": "textures/items/iron_sword"
 },
 "minecraft:jungle_leaves": {
  "pt": "Folhas da Selva",
  "en": "Jungle Leaves",
  "icone": "textures/blocks/leaves_jungle_carried"
 },
 "minecraft:jungle_log": {
  "pt": "Tora da Selva",
  "en": "Jungle Log",
  "icone": "textures/blocks/log_jungle"
 },
 "minecraft:jungle_planks": {
  "pt": "Tábuas da Selva",
  "en": "Jungle Planks",
  "icone": "textures/blocks/planks_jungle"
 },
 "minecraft:jungle_sapling": {
  "pt": "Muda de Árvore da Selva",
  "en": "Jungle Sapling",
  "icone": "textures/blocks/sapling_jungle"
 },
 "minecraft:jungle_slab": {
  "pt": "Laje da Selva",
  "en": "Jungle Slab",
  "icone": "textures/blocks/planks_jungle"
 },
 "minecraft:kelp": {
  "pt": "Alga",
  "en": "Kelp",
  "icone": "textures/items/kelp"
 },
 "minecraft:lapis_block": {
  "pt": "Bloco de Lápis-Lazúli",
  "en": "Block of Lapis Lazuli",
  "icone": "textures/blocks/lapis_block"
 },
 "minecraft:lapis_lazuli": {
  "pt": "Lápis-Lazúli",
  "en": "Lapis Lazuli",
  "icone": "textures/items/dye_powder_blue_new"
 },
 "minecraft:lapis_ore": {
  "pt": "Minério de Lápis-Lazúli",
  "en": "Lapis Lazuli Ore",
  "icone": "textures/blocks/lapis_ore"
 },
 "minecraft:lava_bucket": {
  "pt": "Balde de Lava",
  "en": "Lava Bucket",
  "icone": "textures/items/bucket_lava"
 },
 "minecraft:lead": {
  "pt": "Laço",
  "en": "Lead",
  "icone": "textures/items/lead"
 },
 "minecraft:leather": {
  "pt": "Couro",
  "en": "Leather",
  "icone": "textures/items/leather"
 },
 "minecraft:leather_helmet": {
  "pt": "Capuz de Couro",
  "en": "Leather Cap",
  "icone": "textures/items/leather_helmet"
 },
 "minecraft:lever": {
  "pt": "Alavanca",
  "en": "Lever",
  "icone": "textures/items/lever"
 },
 "minecraft:light_blue_dye": {
  "pt": "light_blue_dye",
  "en": "light_blue_dye"
 },
 "minecraft:light_gray_carpet": {
  "pt": "Carpete Cinza-claro",
  "en": "Light Gray Carpet",
  "icone": "textures/blocks/wool_colored_silver"
 },
 "minecraft:light_gray_dye": {
  "pt": "light_gray_dye",
  "en": "light_gray_dye"
 },
 "minecraft:lime_dye": {
  "pt": "Corante Verde Limão",
  "en": "Lime Dye",
  "icone": "textures/items/dye_powder_lime"
 },
 "minecraft:lime_wool": {
  "pt": "Lã Verde-limão",
  "en": "Lime Wool",
  "icone": "textures/blocks/wool_colored_lime"
 },
 "minecraft:lit_blast_furnace": {
  "pt": "Fornalha Potente Acesa",
  "en": "Lit Blast Furnace",
  "icone": "textures/blocks/blast_furnace_side"
 },
 "minecraft:lit_furnace": {
  "pt": "Fornalha Acesa",
  "en": "Lit Furnace",
  "icone": "textures/blocks/furnace_side"
 },
 "minecraft:lit_redstone_ore": {
  "pt": "Minério de Redstone Aceso",
  "en": "Lit Redstone Ore",
  "icone": "textures/blocks/redstone_ore"
 },
 "minecraft:lit_smoker": {
  "pt": "Defumador Aceso",
  "en": "Lit Smoker",
  "icone": "textures/blocks/smoker_side"
 },
 "minecraft:magenta_dye": {
  "pt": "magenta_dye",
  "en": "magenta_dye"
 },
 "minecraft:magma": {
  "pt": "Bloco de Magma",
  "en": "Magma Block",
  "icone": "textures/blocks/magma"
 },
 "minecraft:magma_cream": {
  "pt": "Creme de Magma",
  "en": "Magma Cream",
  "icone": "textures/items/magma_cream"
 },
 "minecraft:mangrove_log": {
  "pt": "Tora de Mangue",
  "en": "Mangrove Log",
  "icone": "textures/blocks/mangrove_log_side"
 },
 "minecraft:mangrove_planks": {
  "pt": "Tábuas de Mangue",
  "en": "Mangrove Planks",
  "icone": "textures/blocks/mangrove_planks"
 },
 "minecraft:melon_block": {
  "pt": "Melancia",
  "en": "Melon",
  "icone": "textures/blocks/melon_side"
 },
 "minecraft:melon_seeds": {
  "pt": "Sementes de Melancia",
  "en": "Melon Seeds",
  "icone": "textures/items/seeds_melon"
 },
 "minecraft:melon_slice": {
  "pt": "Fatia de Melancia",
  "en": "Melon Slice",
  "icone": "textures/items/melon"
 },
 "minecraft:melon_stem": {
  "pt": "Caule de Melancia",
  "en": "Melon Stem",
  "icone": "textures/blocks/melon_stem_disconnected"
 },
 "minecraft:milk_bucket": {
  "pt": "Balde de Leite",
  "en": "Milk Bucket",
  "icone": "textures/items/bucket_milk"
 },
 "minecraft:mossy_cobblestone": {
  "pt": "Pedregulho com Musgo",
  "en": "Mossy Cobblestone",
  "icone": "textures/blocks/cobblestone_mossy"
 },
 "minecraft:mossy_stone_bricks": {
  "pt": "Tijolos de Pedra com Musgo",
  "en": "Mossy Stone Bricks",
  "icone": "textures/blocks/stonebrick_mossy"
 },
 "minecraft:mushroom_stew": {
  "pt": "Ensopado de Cogumelos",
  "en": "Mushroom Stew",
  "icone": "textures/items/mushroom_stew"
 },
 "minecraft:mutton": {
  "pt": "Carneiro Cru",
  "en": "Raw Mutton",
  "icone": "textures/items/mutton_raw"
 },
 "minecraft:name_tag": {
  "pt": "Etiqueta",
  "en": "Name Tag",
  "icone": "textures/items/name_tag"
 },
 "minecraft:nether_wart": {
  "pt": "Fungo do Nether",
  "en": "Nether Wart",
  "icone": "textures/items/nether_wart"
 },
 "minecraft:netherbrick": {
  "pt": "Tijolo do Nether",
  "en": "Nether Brick",
  "icone": "textures/items/netherbrick"
 },
 "minecraft:netherite_scrap": {
  "pt": "Fragmentos de Netherita",
  "en": "Netherite Scrap",
  "icone": "textures/items/netherite_scrap"
 },
 "minecraft:netherrack": {
  "pt": "Netherrack",
  "en": "Netherrack",
  "icone": "textures/blocks/netherrack"
 },
 "minecraft:oak_leaves": {
  "pt": "Folhas de Carvalho",
  "en": "Oak Leaves",
  "icone": "textures/blocks/leaves_oak_carried"
 },
 "minecraft:oak_log": {
  "pt": "Tora de Carvalho",
  "en": "Oak Log",
  "icone": "textures/blocks/log_oak"
 },
 "minecraft:oak_planks": {
  "pt": "Tábuas de Carvalho",
  "en": "Oak Planks",
  "icone": "textures/blocks/planks_oak"
 },
 "minecraft:oak_sapling": {
  "pt": "Muda de Carvalho",
  "en": "Oak Sapling",
  "icone": "textures/blocks/sapling_oak"
 },
 "minecraft:oak_slab": {
  "pt": "Laje de Carvalho",
  "en": "Oak Slab",
  "icone": "textures/blocks/planks_oak"
 },
 "minecraft:obsidian": {
  "pt": "Obsidiana",
  "en": "Obsidian",
  "icone": "textures/blocks/obsidian"
 },
 "minecraft:orange_dye": {
  "pt": "Corante Laranja",
  "en": "Orange Dye",
  "icone": "textures/items/dye_powder_orange"
 },
 "minecraft:orange_wool": {
  "pt": "Lã Laranja",
  "en": "Orange Wool",
  "icone": "textures/blocks/wool_colored_orange"
 },
 "minecraft:packed_ice": {
  "pt": "Gelo Compactado",
  "en": "Packed Ice",
  "icone": "textures/blocks/ice_packed"
 },
 "minecraft:paper": {
  "pt": "Papel",
  "en": "Paper",
  "icone": "textures/items/paper"
 },
 "minecraft:phantom_membrane": {
  "pt": "Membrana de Fantasma",
  "en": "Phantom Membrane",
  "icone": "textures/items/phantom_membrane"
 },
 "minecraft:pink_dye": {
  "pt": "Corante Rosa",
  "en": "Pink Dye",
  "icone": "textures/items/dye_powder_pink"
 },
 "minecraft:piston": {
  "pt": "Pistão",
  "en": "Piston",
  "icone": "textures/blocks/piston_side"
 },
 "minecraft:poisonous_potato": {
  "pt": "Batata Venenosa",
  "en": "Poisonous Potato",
  "icone": "textures/items/potato_poisonous"
 },
 "minecraft:polished_andesite": {
  "pt": "Andesito Polido",
  "en": "Polished Andesite",
  "icone": "textures/blocks/stone_andesite_smooth"
 },
 "minecraft:popped_chorus_fruit": {
  "pt": "popped_chorus_fruit",
  "en": "popped_chorus_fruit"
 },
 "minecraft:porkchop": {
  "pt": "Carne de Porco Crua",
  "en": "Raw Porkchop",
  "icone": "textures/items/porkchop_raw"
 },
 "minecraft:potato": {
  "pt": "Batata",
  "en": "Potato",
  "icone": "textures/items/potato"
 },
 "minecraft:potatoes": {
  "pt": "Batatas",
  "en": "Potatoes",
  "icone": "textures/blocks/potatoes_stage_0"
 },
 "minecraft:potion": {
  "pt": "Frasco de Água",
  "en": "Water Bottle",
  "icone": "textures/items/potion_bottle_drinkable"
 },
 "minecraft:prismarine": {
  "pt": "prismarine",
  "en": "prismarine",
  "icone": "textures/blocks/prismarine_rough"
 },
 "minecraft:pumpkin": {
  "pt": "Abóbora",
  "en": "Pumpkin",
  "icone": "textures/blocks/pumpkin_side"
 },
 "minecraft:pumpkin_pie": {
  "pt": "Torta de Abóbora",
  "en": "Pumpkin Pie",
  "icone": "textures/items/pumpkin_pie"
 },
 "minecraft:pumpkin_seeds": {
  "pt": "Sementes de Abóbora",
  "en": "Pumpkin Seeds",
  "icone": "textures/items/seeds_pumpkin"
 },
 "minecraft:pumpkin_stem": {
  "pt": "Broto de Abóbora",
  "en": "Pumpkin Stem",
  "icone": "textures/blocks/pumpkin_stem_disconnected"
 },
 "minecraft:purple_dye": {
  "pt": "Corante Roxo",
  "en": "Purple Dye",
  "icone": "textures/items/dye_powder_purple"
 },
 "minecraft:quartz": {
  "pt": "Quartzo do Nether",
  "en": "Nether Quartz",
  "icone": "textures/items/quartz"
 },
 "minecraft:quartz_block": {
  "pt": "Bloco de Quartzo",
  "en": "Block of Quartz",
  "icone": "textures/blocks/quartz_block_side"
 },
 "minecraft:rabbit": {
  "pt": "Coelho Cru",
  "en": "Raw Rabbit",
  "icone": "textures/items/rabbit_raw"
 },
 "minecraft:rabbit_hide": {
  "pt": "Pele de Coelho",
  "en": "Rabbit Hide",
  "icone": "textures/items/rabbit_hide"
 },
 "minecraft:rabbit_stew": {
  "pt": "Ensopado de Coelho",
  "en": "Rabbit Stew",
  "icone": "textures/items/rabbit_stew"
 },
 "minecraft:raw_copper": {
  "pt": "Cobre Bruto",
  "en": "Raw Copper",
  "icone": "textures/items/raw_copper"
 },
 "minecraft:raw_copper_block": {
  "pt": "Bloco de Cobre Bruto",
  "en": "Block of Raw Copper",
  "icone": "textures/blocks/raw_copper_block"
 },
 "minecraft:raw_gold": {
  "pt": "Ouro Bruto",
  "en": "Raw Gold",
  "icone": "textures/items/raw_gold"
 },
 "minecraft:raw_gold_block": {
  "pt": "Bloco de Ouro Bruto",
  "en": "Block of Raw Gold",
  "icone": "textures/blocks/raw_gold_block"
 },
 "minecraft:raw_iron": {
  "pt": "Ferro Bruto",
  "en": "Raw Iron",
  "icone": "textures/items/raw_iron"
 },
 "minecraft:raw_iron_block": {
  "pt": "Bloco de Ferro Bruto",
  "en": "Block of Raw Iron",
  "icone": "textures/blocks/raw_iron_block"
 },
 "minecraft:red_carpet": {
  "pt": "Carpete Vermelho",
  "en": "Red Carpet",
  "icone": "textures/blocks/wool_colored_red"
 },
 "minecraft:red_dye": {
  "pt": "Corante Vermelho",
  "en": "Red Dye",
  "icone": "textures/items/dye_powder_red"
 },
 "minecraft:red_sand": {
  "pt": "Areia Vermelha",
  "en": "Red Sand",
  "icone": "textures/blocks/red_sand"
 },
 "minecraft:red_wool": {
  "pt": "Lã Vermelha",
  "en": "Red Wool",
  "icone": "textures/blocks/wool_colored_red"
 },
 "minecraft:redstone": {
  "pt": "Pó de Redstone",
  "en": "Redstone Dust",
  "icone": "textures/items/redstone_dust"
 },
 "minecraft:redstone_block": {
  "pt": "Bloco de Redstone",
  "en": "Block of Redstone",
  "icone": "textures/blocks/redstone_block"
 },
 "minecraft:redstone_ore": {
  "pt": "Minério de Redstone",
  "en": "Redstone Ore",
  "icone": "textures/blocks/redstone_ore"
 },
 "minecraft:redstone_torch": {
  "pt": "Tocha de Redstone",
  "en": "Redstone Torch",
  "icone": "textures/blocks/redstone_torch_on"
 },
 "minecraft:reinforced_deepslate": {
  "pt": "Ardosiabissal Reforçada",
  "en": "Reinforced Deepslate",
  "icone": "textures/blocks/reinforced_deepslate_side"
 },
 "minecraft:rotten_flesh": {
  "pt": "Carne Podre",
  "en": "Rotten Flesh",
  "icone": "textures/items/rotten_flesh"
 },
 "minecraft:saddle": {
  "pt": "Sela",
  "en": "Saddle",
  "icone": "textures/items/saddle"
 },
 "minecraft:salmon": {
  "pt": "Salmão Cru",
  "en": "Raw Salmon",
  "icone": "textures/items/fish_salmon_raw"
 },
 "minecraft:sand": {
  "pt": "Areia",
  "en": "Sand",
  "icone": "textures/blocks/sand"
 },
 "minecraft:sandstone": {
  "pt": "Arenito",
  "en": "Sandstone",
  "icone": "textures/blocks/sandstone_normal"
 },
 "minecraft:shears": {
  "pt": "Tesoura",
  "en": "Shears",
  "icone": "textures/items/shears"
 },
 "minecraft:short_grass": {
  "pt": "Grama Baixa",
  "en": "Short Grass",
  "icone": "textures/blocks/tallgrass_carried"
 },
 "minecraft:skeleton_skull": {
  "pt": "skeleton_skull",
  "en": "skeleton_skull",
  "icone": "textures/blocks/soul_sand"
 },
 "minecraft:slime": {
  "pt": "Bloco de Slime",
  "en": "Slime Block",
  "icone": "textures/blocks/slime"
 },
 "minecraft:slime_ball": {
  "pt": "Gosma de Slime",
  "en": "Slimeball",
  "icone": "textures/items/slimeball"
 },
 "minecraft:smooth_sandstone": {
  "pt": "Arenito Liso",
  "en": "Smooth Sandstone",
  "icone": "textures/blocks/sandstone_top"
 },
 "minecraft:smooth_stone": {
  "pt": "Pedra Lisa",
  "en": "Smooth Stone",
  "icone": "textures/blocks/stone_slab_top"
 },
 "minecraft:smooth_stone_slab": {
  "pt": "Laje de Pedra Lisa",
  "en": "Smooth Stone Slab",
  "icone": "textures/blocks/stone_slab_top"
 },
 "minecraft:snow": {
  "pt": "Bloco de Neve",
  "en": "Snow Block",
  "icone": "textures/blocks/snow"
 },
 "minecraft:snowball": {
  "pt": "Bola de Neve",
  "en": "Snowball",
  "icone": "textures/items/snowball"
 },
 "minecraft:soul_campfire": {
  "pt": "Fogueira das Almas",
  "en": "Soul Campfire",
  "icone": "textures/items/soul_campfire"
 },
 "minecraft:soul_fire": {
  "pt": "Fogo das Almas",
  "en": "Soul Fire",
  "icone": "textures/blocks/soul_fire_0"
 },
 "minecraft:soul_sand": {
  "pt": "Areia das Almas",
  "en": "Soul Sand",
  "icone": "textures/blocks/soul_sand"
 },
 "minecraft:spider_eye": {
  "pt": "Olho de Aranha",
  "en": "Spider Eye",
  "icone": "textures/items/spider_eye"
 },
 "minecraft:spruce_leaves": {
  "pt": "Folhas de Pinheiro",
  "en": "Spruce Leaves",
  "icone": "textures/blocks/leaves_spruce_carried"
 },
 "minecraft:spruce_log": {
  "pt": "Tora de Pinheiro",
  "en": "Spruce Log",
  "icone": "textures/blocks/log_spruce"
 },
 "minecraft:spruce_planks": {
  "pt": "Tábuas de Pinheiro",
  "en": "Spruce Planks",
  "icone": "textures/blocks/planks_spruce"
 },
 "minecraft:spruce_sapling": {
  "pt": "Muda de Pinheiro",
  "en": "Spruce Sapling",
  "icone": "textures/blocks/sapling_spruce"
 },
 "minecraft:spruce_slab": {
  "pt": "Laje de Pinheiro",
  "en": "Spruce Slab",
  "icone": "textures/blocks/planks_spruce"
 },
 "minecraft:stick": {
  "pt": "Graveto",
  "en": "Stick",
  "icone": "textures/items/stick"
 },
 "minecraft:sticky_piston": {
  "pt": "Pistão Grudento",
  "en": "Sticky Piston",
  "icone": "textures/blocks/piston_side"
 },
 "minecraft:stone": {
  "pt": "Pedra",
  "en": "Stone",
  "icone": "textures/blocks/stone"
 },
 "minecraft:stone_axe": {
  "pt": "Machado de Pedra",
  "en": "Stone Axe",
  "icone": "textures/items/stone_axe"
 },
 "minecraft:stone_brick_slab": {
  "pt": "Laje de Tijolos",
  "en": "Brick Slab",
  "icone": "textures/blocks/stonebrick"
 },
 "minecraft:stone_bricks": {
  "pt": "Tijolos de Pedra",
  "en": "Stone Bricks",
  "icone": "textures/blocks/stonebrick"
 },
 "minecraft:stone_button": {
  "pt": "Botão de Pedra",
  "en": "Stone Button",
  "icone": "textures/blocks/stone"
 },
 "minecraft:stone_pickaxe": {
  "pt": "Picareta de Pedra",
  "en": "Stone Pickaxe",
  "icone": "textures/items/stone_pickaxe"
 },
 "minecraft:stone_pressure_plate": {
  "pt": "Placa de Pressão de Pedra",
  "en": "Stone Pressure Plate",
  "icone": "textures/blocks/stone"
 },
 "minecraft:stone_shovel": {
  "pt": "Pá de Pedra",
  "en": "Stone Shovel",
  "icone": "textures/items/stone_shovel"
 },
 "minecraft:string": {
  "pt": "Linha",
  "en": "String",
  "icone": "textures/items/string"
 },
 "minecraft:stripped_acacia_log": {
  "pt": "Tronco de Acácia Descascado",
  "en": "Stripped Acacia Log",
  "icone": "textures/blocks/stripped_acacia_log"
 },
 "minecraft:stripped_birch_log": {
  "pt": "Tronco de Bétula Descascado",
  "en": "Stripped Birch Log",
  "icone": "textures/blocks/stripped_birch_log"
 },
 "minecraft:stripped_cherry_log": {
  "pt": "Tora de Cerejeira Descascada",
  "en": "Stripped Cherry Log",
  "icone": "textures/blocks/stripped_cherry_log_side"
 },
 "minecraft:stripped_dark_oak_log": {
  "pt": "Tora de Carvalho Escuro Descascada",
  "en": "Stripped Dark Oak Log",
  "icone": "textures/blocks/stripped_dark_oak_log"
 },
 "minecraft:stripped_jungle_log": {
  "pt": "Tora da Selva Descascada",
  "en": "Stripped Jungle Log",
  "icone": "textures/blocks/stripped_jungle_log"
 },
 "minecraft:stripped_mangrove_log": {
  "pt": "Tora de Mangue Descascada",
  "en": "Stripped Mangrove Log",
  "icone": "textures/blocks/stripped_mangrove_log_side"
 },
 "minecraft:stripped_oak_log": {
  "pt": "Tora de Carvalho Descascada",
  "en": "Stripped Oak Log",
  "icone": "textures/blocks/stripped_oak_log"
 },
 "minecraft:stripped_spruce_log": {
  "pt": "Tora de Pinheiro Descascada",
  "en": "Stripped Spruce Log",
  "icone": "textures/blocks/stripped_spruce_log"
 },
 "minecraft:sugar": {
  "pt": "Açúcar",
  "en": "Sugar",
  "icone": "textures/items/sugar"
 },
 "minecraft:sugar_cane": {
  "pt": "Cana-de-açúcar",
  "en": "Sugar Cane",
  "icone": "textures/items/reeds"
 },
 "minecraft:sweet_berries": {
  "pt": "Bagas Doces",
  "en": "Sweet Berries",
  "icone": "textures/items/sweet_berries"
 },
 "minecraft:tinted_glass": {
  "pt": "Vidro Fumê",
  "en": "Tinted Glass",
  "icone": "textures/blocks/tinted_glass"
 },
 "minecraft:tnt": {
  "pt": "Dinamite",
  "en": "TNT",
  "icone": "textures/blocks/tnt_side"
 },
 "minecraft:torch": {
  "pt": "Tocha",
  "en": "Torch",
  "icone": "textures/blocks/torch_on"
 },
 "minecraft:totem_of_undying": {
  "pt": "Totem da Imortalidade",
  "en": "Totem of Undying",
  "icone": "textures/items/totem"
 },
 "minecraft:trapped_chest": {
  "pt": "Baú com Armadilha",
  "en": "Trapped Chest",
  "icone": "textures/blocks/chest_front"
 },
 "minecraft:tripwire_hook": {
  "pt": "Gancho Disparador",
  "en": "Tripwire Hook",
  "icone": "textures/blocks/trip_wire_source"
 },
 "minecraft:twisting_vines": {
  "pt": "Trepadeiras Retorcidas",
  "en": "Twisting Vines",
  "icone": "textures/blocks/twisting_vines_base"
 },
 "minecraft:vine": {
  "pt": "Trepadeiras",
  "en": "Vines",
  "icone": "textures/blocks/vine"
 },
 "minecraft:water_bucket": {
  "pt": "Balde de Água",
  "en": "Water Bucket",
  "icone": "textures/items/bucket_water"
 },
 "minecraft:weeping_vines": {
  "pt": "Trepadeiras Choronas",
  "en": "Weeping Vines",
  "icone": "textures/blocks/weeping_vines_base"
 },
 "minecraft:wheat": {
  "pt": "Trigo",
  "en": "Wheat",
  "icone": "textures/items/wheat"
 },
 "minecraft:wheat_seeds": {
  "pt": "Sementes de Trigo",
  "en": "Wheat Seeds",
  "icone": "textures/items/seeds_wheat"
 },
 "minecraft:white_carpet": {
  "pt": "Carpete Branco",
  "en": "White Carpet",
  "icone": "textures/blocks/wool_colored_white"
 },
 "minecraft:white_dye": {
  "pt": "white_dye",
  "en": "white_dye"
 },
 "minecraft:white_wool": {
  "pt": "Lã Branca",
  "en": "White Wool",
  "icone": "textures/blocks/wool_colored_white"
 },
 "minecraft:wooden_axe": {
  "pt": "Machado de Madeira",
  "en": "Wooden Axe",
  "icone": "textures/items/wood_axe"
 },
 "minecraft:wooden_pickaxe": {
  "pt": "Picareta de Madeira",
  "en": "Wooden Pickaxe",
  "icone": "textures/items/wood_pickaxe"
 },
 "minecraft:wooden_shovel": {
  "pt": "Pá de Madeira",
  "en": "Wooden Shovel",
  "icone": "textures/items/wood_shovel"
 },
 "minecraft:yellow_dye": {
  "pt": "Corante Amarelo",
  "en": "Yellow Dye",
  "icone": "textures/items/dye_powder_yellow"
 }
};
export const RECEITAS_JSON: ReadonlyArray<ReceitaJson> = [
 {
  "tipo": "sem_forma",
  "id": "cl:agua_de_cacto",
  "resultado": "cl:agua_suja",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "minecraft:cactus",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:agua_de_cactos",
  "resultado": "cl:agua_boa",
  "qtd": 1,
  "grade": [
   "CCC",
   "CBC",
   "CCC"
  ],
  "chaves": {
   "C": "minecraft:cactus",
   "B": "minecraft:glass_bottle"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:agua_filtrada",
  "resultado": "cl:agua_excelente",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_boa",
    "qtd": 1
   },
   {
    "item": "minecraft:charcoal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:agua_fria",
  "resultado": "cl:agua_excelente",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_boa",
    "qtd": 1
   },
   {
    "item": "minecraft:snowball",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:agua_salgada_de_areia",
  "resultado": "cl:agua_impropria",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_boa",
    "qtd": 1
   },
   {
    "item": "minecraft:sand",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:agua_suja_de_garrafa",
  "resultado": "cl:agua_suja",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:glass_bottle",
    "qtd": 1
   },
   {
    "item": "minecraft:dirt",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:agua_suja_de_terra",
  "resultado": "cl:agua_suja",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_boa",
    "qtd": 1
   },
   {
    "item": "minecraft:dirt",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_madeira_acacia",
  "resultado": "cl:barril_madeira",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TLT"
  ],
  "chaves": {
   "T": "#minecraft:planks",
   "L": "minecraft:acacia_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_madeira_birch",
  "resultado": "cl:barril_madeira",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TLT"
  ],
  "chaves": {
   "T": "#minecraft:planks",
   "L": "minecraft:birch_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_madeira_jungle",
  "resultado": "cl:barril_madeira",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TLT"
  ],
  "chaves": {
   "T": "#minecraft:planks",
   "L": "minecraft:jungle_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_madeira_oak",
  "resultado": "cl:barril_madeira",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TLT"
  ],
  "chaves": {
   "T": "#minecraft:planks",
   "L": "minecraft:oak_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_madeira_spruce",
  "resultado": "cl:barril_madeira",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TLT"
  ],
  "chaves": {
   "T": "#minecraft:planks",
   "L": "minecraft:spruce_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:barril_pedra",
  "resultado": "cl:barril_pedra",
  "qtd": 1,
  "grade": [
   "P P",
   "P P",
   "PLP"
  ],
  "chaves": {
   "P": "minecraft:stone",
   "L": "minecraft:smooth_stone_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:bateria",
  "resultado": "cl:bateria",
  "qtd": 1,
  "grade": [
   "CRC",
   "CIC",
   "CRC"
  ],
  "chaves": {
   "C": "minecraft:copper_ingot",
   "R": "minecraft:redstone",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:bicho_seda_cozido",
  "resultado": "cl:bicho_seda_cozido",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bicho_seda",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_decorative_fluix_block",
  "resultado": "cl:bloco_fluix",
  "qtd": 1,
  "grade": [
   "aa",
   "aa"
  ],
  "chaves": {
   "a": "cl:cristal_fluix"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_decorative_quartz_glass",
  "resultado": "cl:vidro_quartzo",
  "qtd": 4,
  "grade": [
   "aba",
   "bab",
   "aba"
  ],
  "chaves": {
   "a": "cl:po_certus",
   "b": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_materials_annihilationcore",
  "resultado": "cl:nucleo_aniquilacao",
  "qtd": 2,
  "grade": [
   "abc"
  ],
  "chaves": {
   "a": "minecraft:quartz",
   "b": "cl:po_fluix",
   "c": "cl:processador_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_materials_formationcore",
  "resultado": "cl:nucleo_formacao",
  "qtd": 2,
  "grade": [
   "abc"
  ],
  "chaves": {
   "a": "cl:cristal_certus",
   "b": "cl:po_fluix",
   "c": "cl:processador_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_misc_deconstruction_fluix_block",
  "resultado": "cl:cristal_fluix",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:bloco_fluix",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_misc_fluixpearl",
  "resultado": "cl:perola_fluix",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "aba"
  ],
  "chaves": {
   "a": "cl:po_fluix",
   "b": "cl:cristal_fluix",
   "c": "minecraft:ender_pearl"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_controller",
  "resultado": "cl:controlador_me",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "aba"
  ],
  "chaves": {
   "a": "cl:pedra_ceu_lisa",
   "b": "cl:cristal_fluix",
   "c": "cl:processador_avancado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_crystal_processing_charger",
  "resultado": "cl:carregador_ae",
  "qtd": 1,
  "grade": [
   "aba",
   "a  ",
   "aba"
  ],
  "chaves": {
   "a": "minecraft:iron_ingot",
   "b": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_energy_dense_energy_cell",
  "resultado": "cl:celula_energia_ae_densa",
  "qtd": 1,
  "grade": [
   "aaa",
   "aba",
   "aaa"
  ],
  "chaves": {
   "a": "cl:celula_energia_ae",
   "b": "cl:processador_calculo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_energy_energy_cell",
  "resultado": "cl:celula_energia_ae",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "aba"
  ],
  "chaves": {
   "a": "cl:cristal_certus",
   "b": "cl:po_fluix",
   "c": "cl:vidro_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_inscribers",
  "resultado": "cl:inscritor",
  "qtd": 1,
  "grade": [
   "aba",
   "c a",
   "aba"
  ],
  "chaves": {
   "a": "minecraft:iron_ingot",
   "b": "minecraft:piston",
   "c": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_storage_chest",
  "resultado": "cl:bau_me",
  "qtd": 1,
  "grade": [
   "aba",
   "c c",
   "ded"
  ],
  "chaves": {
   "a": "minecraft:glass",
   "b": "cl:terminal",
   "c": "cl:cabo_me_fluix",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_blocks_storage_drive",
  "resultado": "cl:drive_me",
  "qtd": 1,
  "grade": [
   "aba",
   "c c",
   "aba"
  ],
  "chaves": {
   "a": "minecraft:iron_ingot",
   "b": "cl:processador_avancado",
   "c": "cl:cabo_me_fluix"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cables_glass_fluix",
  "resultado": "cl:cabo_me_fluix",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:fibra_quartzo",
    "qtd": 1
   },
   {
    "item": "cl:cristal_fluix",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_cell_housing",
  "resultado": "cl:involucro_celula_me",
  "qtd": 1,
  "grade": [
   "aba",
   "b b",
   "cdc"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "minecraft:iron_ingot",
   "d": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_cell_16k",
  "resultado": "cl:celula_me_16k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "cl:componente_me_16k",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cells_item_storage_cell_16k_storage",
  "resultado": "cl:celula_me_16k",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:componente_me_16k",
    "qtd": 1
   },
   {
    "item": "cl:involucro_celula_me",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_cell_1k",
  "resultado": "cl:celula_me_1k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "cl:componente_me_1k",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cells_item_storage_cell_1k_storage",
  "resultado": "cl:celula_me_1k",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:involucro_celula_me",
    "qtd": 1
   },
   {
    "item": "cl:componente_me_1k",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_cell_256k",
  "resultado": "cl:celula_me_256k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "cl:componente_me_256k",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cells_item_storage_cell_256k_storage",
  "resultado": "cl:celula_me_256k",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:involucro_celula_me",
    "qtd": 1
   },
   {
    "item": "cl:componente_me_256k",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_cell_4k",
  "resultado": "cl:celula_me_4k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "cl:componente_me_4k",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cells_item_storage_cell_4k_storage",
  "resultado": "cl:celula_me_4k",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:involucro_celula_me",
    "qtd": 1
   },
   {
    "item": "cl:componente_me_4k",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_cell_64k",
  "resultado": "cl:celula_me_64k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:redstone",
   "c": "cl:componente_me_64k",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_ae2_network_cells_item_storage_cell_64k_storage",
  "resultado": "cl:celula_me_64k",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:involucro_celula_me",
    "qtd": 1
   },
   {
    "item": "cl:componente_me_64k",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_components_cell_16k_part",
  "resultado": "cl:componente_me_16k",
  "qtd": 1,
  "grade": [
   "aba",
   "cdc",
   "aca"
  ],
  "chaves": {
   "a": "minecraft:glowstone_dust",
   "b": "cl:processador_calculo",
   "c": "cl:componente_me_4k",
   "d": "cl:vidro_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_components_cell_1k_part",
  "resultado": "cl:componente_me_1k",
  "qtd": 1,
  "grade": [
   "aba",
   "bcb",
   "aba"
  ],
  "chaves": {
   "a": "minecraft:redstone",
   "b": "cl:cristal_certus",
   "c": "cl:processador_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_components_cell_256k_part",
  "resultado": "cl:componente_me_256k",
  "qtd": 1,
  "grade": [
   "aba",
   "cdc",
   "aca"
  ],
  "chaves": {
   "a": "cl:po_pedra_ceu",
   "b": "cl:processador_calculo",
   "c": "cl:componente_me_64k",
   "d": "cl:vidro_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_components_cell_4k_part",
  "resultado": "cl:componente_me_4k",
  "qtd": 1,
  "grade": [
   "aba",
   "cdc",
   "aca"
  ],
  "chaves": {
   "a": "minecraft:redstone",
   "b": "cl:processador_calculo",
   "c": "cl:componente_me_1k",
   "d": "cl:vidro_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_cells_item_storage_components_cell_64k_part",
  "resultado": "cl:componente_me_64k",
  "qtd": 1,
  "grade": [
   "aba",
   "cdc",
   "aca"
  ],
  "chaves": {
   "a": "minecraft:glowstone_dust",
   "b": "cl:processador_calculo",
   "c": "cl:componente_me_16k",
   "d": "cl:vidro_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_crafting_molecular_assembler",
  "resultado": "cl:montador_molecular",
  "qtd": 1,
  "grade": [
   "aba",
   "cde",
   "aba"
  ],
  "chaves": {
   "a": "minecraft:iron_ingot",
   "b": "cl:vidro_quartzo",
   "c": "cl:nucleo_aniquilacao",
   "d": "minecraft:crafting_table",
   "e": "cl:nucleo_formacao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_crafting_patterns_blank",
  "resultado": "cl:padrao_me_vazio",
  "qtd": 2,
  "grade": [
   "aba",
   "bcb",
   "ded"
  ],
  "chaves": {
   "a": "cl:vidro_quartzo",
   "b": "minecraft:glowstone_dust",
   "c": "cl:cristal_certus",
   "d": "minecraft:iron_ingot",
   "e": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_parts_quartz_fiber_part",
  "resultado": "cl:fibra_quartzo",
  "qtd": 3,
  "grade": [
   "aaa",
   "bbb",
   "aaa"
  ],
  "chaves": {
   "a": "minecraft:glass",
   "b": "cl:po_certus"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_wireless_access_point",
  "resultado": "cl:ponto_acesso",
  "qtd": 1,
  "grade": [
   "a",
   "b",
   "c"
  ],
  "chaves": {
   "a": "cl:receptor_sem_fio",
   "b": "cl:processador_calculo",
   "c": "cl:cabo_me_fluix"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_wireless_part",
  "resultado": "cl:receptor_sem_fio",
  "qtd": 1,
  "grade": [
   " a ",
   "bcb",
   " b "
  ],
  "chaves": {
   "a": "cl:perola_fluix",
   "b": "minecraft:iron_ingot",
   "c": "cl:fibra_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_network_wireless_terminal",
  "resultado": "cl:terminal_sem_fio",
  "qtd": 1,
  "grade": [
   "a",
   "b",
   "c"
  ],
  "chaves": {
   "a": "cl:receptor_sem_fio",
   "b": "cl:terminal",
   "c": "cl:celula_energia_ae_densa"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_ae2_smelting_smooth_sky_stone_block",
  "resultado": "cl:pedra_ceu_lisa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:meteorito",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ae2_tools_certus_quartz_cutting_knife",
  "resultado": "cl:faca_corte",
  "qtd": 1,
  "grade": [
   "  a",
   "ba ",
   "cc "
  ],
  "chaves": {
   "a": "minecraft:stick",
   "b": "minecraft:iron_ingot",
   "c": "cl:cristal_certus"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_aleta_foguete",
  "resultado": "cl:aleta_foguete",
  "qtd": 1,
  "grade": [
   " Y ",
   "XYX",
   "X X"
  ],
  "chaves": {
   "X": "cl:placa_reforcada",
   "Y": "cl:placa_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_aluminio_de_po",
  "resultado": "cl:lingote_aluminio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:aluminio_po",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_aluminio_de_quebrado",
  "resultado": "cl:lingote_aluminio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:aluminio_quebrado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_aluminio_de_triturado",
  "resultado": "cl:lingote_aluminio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:aluminio_triturado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_aquecedor",
  "resultado": "cl:aquecedor",
  "qtd": 1,
  "grade": [
   "TTT",
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_aco",
  "resultado": "cl:arco_longo_aco",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_aco_slime",
  "resultado": "cl:arco_longo_aco_slime",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_aluminio",
  "resultado": "cl:arco_longo_aluminio",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_bronze",
  "resultado": "cl:arco_longo_bronze",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_bronze_ametista",
  "resultado": "cl:arco_longo_bronze_ametista",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_cacto",
  "resultado": "cl:arco_longo_cacto",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "minecraft:cactus",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_cobalto",
  "resultado": "cl:arco_longo_cobalto",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_cobre",
  "resultado": "cl:arco_longo_cobre",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_coro",
  "resultado": "cl:arco_longo_coro",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "minecraft:popped_chorus_fruit",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_ferro",
  "resultado": "cl:arco_longo_ferro",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_ferro_porco",
  "resultado": "cl:arco_longo_ferro_porco",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_hepatizon",
  "resultado": "cl:arco_longo_hepatizon",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_madeira",
  "resultado": "cl:arco_longo_madeira",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "#minecraft:planks",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_madeira_slime",
  "resultado": "cl:arco_longo_madeira_slime",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:tabuas_verdecoracao",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_madeira_slime_revestida",
  "resultado": "cl:arco_longo_madeira_slime_revestida",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_latao",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_madeira_tratada",
  "resultado": "cl:arco_longo_madeira_tratada",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:tabuas_tratadas",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_manyullyn",
  "resultado": "cl:arco_longo_manyullyn",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_nahuatl",
  "resultado": "cl:arco_longo_nahuatl",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:nahuatl",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_osso",
  "resultado": "cl:arco_longo_osso",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "minecraft:bone",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_osso_blaze",
  "resultado": "cl:arco_longo_osso_blaze",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:osso_blaze",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_osso_necrotico",
  "resultado": "cl:arco_longo_osso_necrotico",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:osso_necrotico",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_osso_venenoso",
  "resultado": "cl:arco_longo_osso_venenoso",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:osso_venenoso",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_ouro_rosa",
  "resultado": "cl:arco_longo_ouro_rosa",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_slime_brasa",
  "resultado": "cl:arco_longo_slime_brasa",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_slime_cavaleiro",
  "resultado": "cl:arco_longo_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arco_longo_slime_rainha",
  "resultado": "cl:arco_longo_slime_rainha",
  "qtd": 1,
  "grade": [
   " MS",
   "G S",
   " MS"
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "S": "minecraft:string",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_arenito_liso",
  "resultado": "cl:arenito_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "minecraft:sandstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_argamassa",
  "resultado": "cl:argamassa",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:clay_ball",
    "qtd": 1
   },
   {
    "item": "minecraft:sand",
    "qtd": 1
   },
   {
    "item": "minecraft:gravel",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_argamassa_nether",
  "resultado": "cl:argamassa_nether",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:soul_sand",
    "qtd": 1
   },
   {
    "item": "minecraft:magma_cream",
    "qtd": 1
   },
   {
    "item": "minecraft:gravel",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_armazem_corpos",
  "resultado": "cl:armazem_corpos",
  "qtd": 1,
  "grade": [
   "VNV",
   "V V",
   "FCF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "N": "cl:nucleo_sync",
   "F": "cl:lingote_ferro_comprimido",
   "C": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_asa_delta",
  "resultado": "cl:asa_delta",
  "qtd": 1,
  "grade": [
   "SLS",
   "LLL",
   " S "
  ],
  "chaves": {
   "S": "minecraft:stick",
   "L": "minecraft:leather"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bacia_fundicao",
  "resultado": "cl:bacia_fundicao",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bacia_fundicao_chamuscada",
  "resultado": "cl:bacia_fundicao_chamuscada",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bacon_ovos",
  "resultado": "cl:bacon_ovos",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bacon_cozido",
    "qtd": 2
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "cl:ovo_frito",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_amarelo",
  "resultado": "cl:balao_amarelo",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:yellow_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_azul",
  "resultado": "cl:balao_azul",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:blue_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_azul_claro",
  "resultado": "cl:balao_azul_claro",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:light_blue_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_branco",
  "resultado": "cl:balao_branco",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:white_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_ciano",
  "resultado": "cl:balao_ciano",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:cyan_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_cinza",
  "resultado": "cl:balao_cinza",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:gray_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_cinza_claro",
  "resultado": "cl:balao_cinza_claro",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:light_gray_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_laranja",
  "resultado": "cl:balao_laranja",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:orange_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_lima",
  "resultado": "cl:balao_lima",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:lime_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_magenta",
  "resultado": "cl:balao_magenta",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:magenta_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_marrom",
  "resultado": "cl:balao_marrom",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:brown_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_preto",
  "resultado": "cl:balao_preto",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:black_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_rosa",
  "resultado": "cl:balao_rosa",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:pink_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_roxo",
  "resultado": "cl:balao_roxo",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:purple_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_verde",
  "resultado": "cl:balao_verde",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:green_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_balao_vermelho",
  "resultado": "cl:balao_vermelho",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:leather",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   },
   {
    "item": "minecraft:red_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bancada_nasa",
  "resultado": "cl:bancada_nasa",
  "qtd": 1,
  "grade": [
   "XZX",
   "UWU",
   "YVY"
  ],
  "chaves": {
   "U": "minecraft:lever",
   "V": "minecraft:redstone_torch",
   "W": "cl:wafer_avancado",
   "X": "cl:placa_aco",
   "Y": "cl:placa_aco",
   "Z": "minecraft:crafting_table"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_banco_capacitores_basico",
  "resultado": "cl:banco_capacitores_basico",
  "qtd": 1,
  "grade": [
   "ICI",
   "CRC",
   "ICI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "C": "cl:capacitor_basico",
   "R": "minecraft:redstone_block"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_barra_borracha",
  "resultado": "cl:barra_borracha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:resina",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_barra_combustivel",
  "resultado": "cl:barra_combustivel",
  "qtd": 1,
  "grade": [
   "FGF",
   "FYF",
   "FGF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "G": "cl:barra_grafite",
   "Y": "cl:lingote_yellorium"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_barra_controle",
  "resultado": "cl:barra_controle",
  "qtd": 1,
  "grade": [
   "CRC",
   "CGC",
   "CRC"
  ],
  "chaves": {
   "C": "cl:carcaca_reator",
   "R": "minecraft:redstone",
   "G": "cl:barra_grafite"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_barra_grafite",
  "resultado": "cl:barra_grafite",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:coal",
    "qtd": 1
   },
   {
    "item": "minecraft:gravel",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_barra_grafite_carvao_vegetal",
  "resultado": "cl:barra_grafite",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:charcoal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_barra_grafite_de_bloco",
  "resultado": "cl:barra_grafite",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_grafite",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_barril_armazenamento",
  "resultado": "cl:barril_armazenamento",
  "qtd": 1,
  "grade": [
   "PIP",
   "P P",
   "PPP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_batata_recheada",
  "resultado": "cl:batata_recheada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:baked_potato",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_beef",
    "qtd": 1
   },
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_aco",
  "resultado": "cl:besta_aco",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_aco_slime",
  "resultado": "cl:besta_aco_slime",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_aluminio",
  "resultado": "cl:besta_aluminio",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_bronze",
  "resultado": "cl:besta_bronze",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_bronze_ametista",
  "resultado": "cl:besta_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_cacto",
  "resultado": "cl:besta_cacto",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "minecraft:cactus",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_cobalto",
  "resultado": "cl:besta_cobalto",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_cobre",
  "resultado": "cl:besta_cobre",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_coro",
  "resultado": "cl:besta_coro",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "minecraft:popped_chorus_fruit",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_ferro",
  "resultado": "cl:besta_ferro",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_ferro_porco",
  "resultado": "cl:besta_ferro_porco",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_hepatizon",
  "resultado": "cl:besta_hepatizon",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_madeira",
  "resultado": "cl:besta_madeira",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "#minecraft:planks",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_madeira_slime",
  "resultado": "cl:besta_madeira_slime",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:tabuas_verdecoracao",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_madeira_slime_revestida",
  "resultado": "cl:besta_madeira_slime_revestida",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_latao",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_madeira_tratada",
  "resultado": "cl:besta_madeira_tratada",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:tabuas_tratadas",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_manyullyn",
  "resultado": "cl:besta_manyullyn",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_nahuatl",
  "resultado": "cl:besta_nahuatl",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:nahuatl",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_osso",
  "resultado": "cl:besta_osso",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "minecraft:bone",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_osso_blaze",
  "resultado": "cl:besta_osso_blaze",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:osso_blaze",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_osso_necrotico",
  "resultado": "cl:besta_osso_necrotico",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:osso_necrotico",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_osso_venenoso",
  "resultado": "cl:besta_osso_venenoso",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:osso_venenoso",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_ouro_rosa",
  "resultado": "cl:besta_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_slime_brasa",
  "resultado": "cl:besta_slime_brasa",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_slime_cavaleiro",
  "resultado": "cl:besta_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_besta_slime_rainha",
  "resultado": "cl:besta_slime_rainha",
  "qtd": 1,
  "grade": [
   "MSM",
   "STS",
   " G "
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "S": "minecraft:string",
   "T": "minecraft:tripwire_hook",
   "G": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bico_foguete",
  "resultado": "cl:bico_foguete",
  "qtd": 1,
  "grade": [
   " Y ",
   " X ",
   "X X"
  ],
  "chaves": {
   "X": "cl:placa_reforcada",
   "Y": "minecraft:redstone_torch"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bife_batatas",
  "resultado": "cl:bife_batatas",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:baked_potato",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_beef",
    "qtd": 1
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   },
   {
    "item": "cl:arroz_cozido",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_biplano",
  "resultado": "cl:biplano",
  "qtd": 1,
  "grade": [
   " H ",
   "HEP",
   " H "
  ],
  "chaves": {
   "H": "cl:casco_aeronave",
   "E": "cl:motor_aeronave",
   "P": "cl:helice_aviao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_aco",
  "resultado": "cl:bloco_aco",
  "qtd": 1,
  "grade": [
   "LLL",
   "LLL",
   "LLL"
  ],
  "chaves": {
   "L": "cl:lingote_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_aco_slime",
  "resultado": "cl:bloco_aco_slime",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_aco_slime",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_angelical",
  "resultado": "cl:bloco_angelical",
  "qtd": 1,
  "grade": [
   " G ",
   "FOF"
  ],
  "chaves": {
   "G": "minecraft:gold_ingot",
   "F": "minecraft:feather",
   "O": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_bronze",
  "resultado": "cl:bloco_bronze",
  "qtd": 1,
  "grade": [
   "LLL",
   "LLL",
   "LLL"
  ],
  "chaves": {
   "L": "cl:lingote_bronze"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_bronze_ametista",
  "resultado": "cl:bloco_bronze_ametista",
  "qtd": 1,
  "grade": [
   "LLL",
   "LLL",
   "LLL"
  ],
  "chaves": {
   "L": "cl:lingote_bronze_ametista"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cacto",
  "resultado": "cl:bloco_cacto",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:cactus"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_cacto_desfazer",
  "resultado": "minecraft:cactus",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cacto",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cana",
  "resultado": "cl:bloco_cana",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:sugar_cane"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_cana_desfazer",
  "resultado": "minecraft:sugar_cane",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cana",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_carvao_vegetal",
  "resultado": "cl:bloco_carvao_vegetal",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:charcoal"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_carvao_vegetal_desfazer",
  "resultado": "minecraft:charcoal",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_carvao_vegetal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_cobalto",
  "resultado": "cl:bloco_cobalto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_cobalto",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_cobalto_bruto",
  "resultado": "cl:bloco_cobalto_bruto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cobalto_bruto",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_coque",
  "resultado": "cl:bloco_coque",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:coque"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_coque_desfazer",
  "resultado": "cl:coque",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_coque",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cristal_slime_ceu",
  "resultado": "cl:bloco_cristal_slime_ceu",
  "qtd": 1,
  "grade": [
   "CC",
   "CC"
  ],
  "chaves": {
   "C": "cl:cristal_slime_ceu"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cristal_slime_ender",
  "resultado": "cl:bloco_cristal_slime_ender",
  "qtd": 1,
  "grade": [
   "CC",
   "CC"
  ],
  "chaves": {
   "C": "cl:cristal_slime_ender"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cristal_slime_icor",
  "resultado": "cl:bloco_cristal_slime_icor",
  "qtd": 1,
  "grade": [
   "CC",
   "CC"
  ],
  "chaves": {
   "C": "cl:cristal_slime_icor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_cristal_slime_terra",
  "resultado": "cl:bloco_cristal_slime_terra",
  "qtd": 1,
  "grade": [
   "CC",
   "CC"
  ],
  "chaves": {
   "C": "cl:cristal_slime_terra"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_estanho",
  "resultado": "cl:bloco_estanho",
  "qtd": 1,
  "grade": [
   "LLL",
   "LLL",
   "LLL"
  ],
  "chaves": {
   "L": "cl:lingote_estanho"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_ferro_comprimido",
  "resultado": "cl:bloco_ferro_comprimido",
  "qtd": 1,
  "grade": [
   "FFF",
   "FFF",
   "FFF"
  ],
  "chaves": {
   "F": "cl:lingote_ferro_comprimido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_ferro_porco",
  "resultado": "cl:bloco_ferro_porco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_ferro_porco",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_grafite",
  "resultado": "cl:bloco_grafite",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:barra_grafite"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_gravetos",
  "resultado": "cl:bloco_gravetos",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_gravetos_desfazer",
  "resultado": "minecraft:stick",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_gravetos",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_hepatizon",
  "resultado": "cl:bloco_hepatizon",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_hepatizon",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_manyullyn",
  "resultado": "cl:bloco_manyullyn",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_manyullyn",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_maquina",
  "resultado": "cl:bloco_maquina",
  "qtd": 1,
  "grade": [
   "FFF",
   "GSG"
  ],
  "chaves": {
   "F": "cl:folha_plastico",
   "G": "minecraft:glass",
   "S": "minecraft:smooth_stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_ouro_rosa",
  "resultado": "cl:bloco_ouro_rosa",
  "qtd": 1,
  "grade": [
   "LLL",
   "LLL",
   "LLL"
  ],
  "chaves": {
   "L": "cl:lingote_ouro_rosa"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_placa_ferro",
  "resultado": "cl:bloco_placa_ferro",
  "qtd": 8,
  "grade": [
   "I",
   "I",
   "I"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_placa_ferro_enferrujada",
  "resultado": "cl:bloco_placa_ferro_enferrujada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bloco_placa_ferro",
    "qtd": 1
   },
   {
    "item": "minecraft:water_bucket",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_brasa",
  "resultado": "cl:bloco_slime_brasa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_slime_brasa",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_cavaleiro",
  "resultado": "cl:bloco_slime_cavaleiro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_slime_cavaleiro",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_ceu",
  "resultado": "cl:bloco_slime_ceu",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bola_slime_ceu",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_ender",
  "resultado": "cl:bloco_slime_ender",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bola_slime_ender",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_icor",
  "resultado": "cl:bloco_slime_icor",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bola_slime_icor",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_rainha",
  "resultado": "cl:bloco_slime_rainha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_slime_rainha",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bloco_slime_sangue",
  "resultado": "cl:bloco_slime_sangue",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bola_slime_sangue",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bloco_yellorium",
  "resultado": "cl:bloco_yellorium",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:lingote_yellorium"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bobina_bt",
  "resultado": "cl:bobina_bt",
  "qtd": 1,
  "grade": [
   "www",
   "wiw",
   "www"
  ],
  "chaves": {
   "w": "cl:bobina_fio_cobre",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bobina_fio_cobre",
  "resultado": "cl:bobina_fio_cobre",
  "qtd": 4,
  "grade": [
   " w ",
   "wsw",
   " w "
  ],
  "chaves": {
   "w": "minecraft:copper_ingot",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bola_musgo",
  "resultado": "cl:bola_musgo",
  "qtd": 1,
  "grade": [
   "MMM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:mossy_cobblestone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bolas_slime_ceu",
  "resultado": "cl:bola_slime_ceu",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_ceu",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bolas_slime_ender",
  "resultado": "cl:bola_slime_ender",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_ender",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bolas_slime_icor",
  "resultado": "cl:bola_slime_icor",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_icor",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_bolas_slime_sangue",
  "resultado": "cl:bola_slime_sangue",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_sangue",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bomba",
  "resultado": "cl:bomba",
  "qtd": 1,
  "grade": [
   "FGF",
   "FEF",
   "FBF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "G": "cl:engrenagem_ferro",
   "E": "cl:estrutura_maquina",
   "B": "minecraft:bucket"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_aco",
  "resultado": "cl:botas_placa_aco",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_aco_slime",
  "resultado": "cl:botas_placa_aco_slime",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_aluminio",
  "resultado": "cl:botas_placa_aluminio",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_bronze",
  "resultado": "cl:botas_placa_bronze",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_bronze_ametista",
  "resultado": "cl:botas_placa_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_cobalto",
  "resultado": "cl:botas_placa_cobalto",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_cobre",
  "resultado": "cl:botas_placa_cobre",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_ferro",
  "resultado": "cl:botas_placa_ferro",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_ferro_porco",
  "resultado": "cl:botas_placa_ferro_porco",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_hepatizon",
  "resultado": "cl:botas_placa_hepatizon",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_manyullyn",
  "resultado": "cl:botas_placa_manyullyn",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_obsidiana",
  "resultado": "cl:botas_placa_obsidiana",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_osmio",
  "resultado": "cl:botas_placa_osmio",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_osmio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_ouro",
  "resultado": "cl:botas_placa_ouro",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_ouro_rosa",
  "resultado": "cl:botas_placa_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_pedra_chamuscada",
  "resultado": "cl:botas_placa_pedra_chamuscada",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:tijolo_chamuscado",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_pedra_refrataria",
  "resultado": "cl:botas_placa_pedra_refrataria",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:tijolo_refratario",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_slime_brasa",
  "resultado": "cl:botas_placa_slime_brasa",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_slime_cavaleiro",
  "resultado": "cl:botas_placa_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_placa_slime_rainha",
  "resultado": "cl:botas_placa_slime_rainha",
  "qtd": 1,
  "grade": [
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_slime",
  "resultado": "cl:botas_slime",
  "qtd": 1,
  "grade": [
   "S S",
   "S S"
  ],
  "chaves": {
   "S": "cl:slime_congelado_ceu"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_botas_viajante",
  "resultado": "cl:botas_viajante",
  "qtd": 1,
  "grade": [
   "L L",
   "C C"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bussola_aviao",
  "resultado": "cl:bussola_aviao",
  "qtd": 1,
  "grade": [
   " P ",
   "PBP",
   " P "
  ],
  "chaves": {
   "P": "cl:placa_casco",
   "B": "minecraft:compass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cabide_armadura",
  "resultado": "cl:cabide_armadura",
  "qtd": 1,
  "grade": [
   " S ",
   " S ",
   "PPP"
  ],
  "chaves": {
   "S": "minecraft:stick",
   "P": "minecraft:oak_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixa_entrega",
  "resultado": "cl:caixa_entrega",
  "qtd": 1,
  "grade": [
   "III",
   "ICI",
   "IRI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "C": "minecraft:chest",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_batata",
  "resultado": "cl:caixote_batata",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:potato"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_batata_desfazer",
  "resultado": "minecraft:potato",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_batata",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_beterraba",
  "resultado": "cl:caixote_beterraba",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:beetroot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_beterraba_desfazer",
  "resultado": "minecraft:beetroot",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_beterraba",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_cebola",
  "resultado": "cl:caixote_cebola",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:cebola"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_cebola_desfazer",
  "resultado": "cl:cebola",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_cenoura",
  "resultado": "cl:caixote_cenoura",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:carrot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_cenoura_desfazer",
  "resultado": "minecraft:carrot",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_cenoura",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_maca",
  "resultado": "cl:caixote_maca",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:apple"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_maca_desfazer",
  "resultado": "minecraft:apple",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_maca",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_repolho",
  "resultado": "cl:caixote_repolho",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:repolho"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_repolho_desfazer",
  "resultado": "cl:repolho",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_repolho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caixote_tomate",
  "resultado": "cl:caixote_tomate",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:tomate"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_caixote_tomate_desfazer",
  "resultado": "cl:tomate",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:caixote_tomate",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cajado_osso",
  "resultado": "cl:cajado_osso",
  "qtd": 1,
  "grade": [
   "OO",
   " O",
   " O"
  ],
  "chaves": {
   "O": "minecraft:bone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cajado_ouro",
  "resultado": "cl:cajado_ouro",
  "qtd": 1,
  "grade": [
   "GG",
   " G",
   " G"
  ],
  "chaves": {
   "G": "minecraft:gold_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcario_liso",
  "resultado": "cl:calcario_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "cl:calcario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_aco",
  "resultado": "cl:calcas_placa_aco",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_aco_slime",
  "resultado": "cl:calcas_placa_aco_slime",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_aluminio",
  "resultado": "cl:calcas_placa_aluminio",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_bronze",
  "resultado": "cl:calcas_placa_bronze",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_bronze_ametista",
  "resultado": "cl:calcas_placa_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_cobalto",
  "resultado": "cl:calcas_placa_cobalto",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_cobre",
  "resultado": "cl:calcas_placa_cobre",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_ferro",
  "resultado": "cl:calcas_placa_ferro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_ferro_porco",
  "resultado": "cl:calcas_placa_ferro_porco",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_hepatizon",
  "resultado": "cl:calcas_placa_hepatizon",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_manyullyn",
  "resultado": "cl:calcas_placa_manyullyn",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_obsidiana",
  "resultado": "cl:calcas_placa_obsidiana",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_osmio",
  "resultado": "cl:calcas_placa_osmio",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_osmio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_ouro",
  "resultado": "cl:calcas_placa_ouro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_ouro_rosa",
  "resultado": "cl:calcas_placa_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_pedra_chamuscada",
  "resultado": "cl:calcas_placa_pedra_chamuscada",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:tijolo_chamuscado",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_pedra_refrataria",
  "resultado": "cl:calcas_placa_pedra_refrataria",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:tijolo_refratario",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_slime_brasa",
  "resultado": "cl:calcas_placa_slime_brasa",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_slime_cavaleiro",
  "resultado": "cl:calcas_placa_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_placa_slime_rainha",
  "resultado": "cl:calcas_placa_slime_rainha",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM",
   "M M"
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_slime",
  "resultado": "cl:calcas_slime",
  "qtd": 1,
  "grade": [
   "SSS",
   "S S",
   "S S"
  ],
  "chaves": {
   "S": "cl:slime_congelado_ceu"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calcas_viajante",
  "resultado": "cl:calcas_viajante",
  "qtd": 1,
  "grade": [
   "LCL",
   "L L",
   "L L"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_caldeira",
  "resultado": "cl:caldeira",
  "qtd": 1,
  "grade": [
   "CCC",
   "C C",
   "CFC"
  ],
  "chaves": {
   "C": "minecraft:copper_ingot",
   "F": "minecraft:furnace"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calha_chamuscada",
  "resultado": "cl:calha_chamuscada",
  "qtd": 1,
  "grade": [
   "T T",
   " T ",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_calha_refrataria",
  "resultado": "cl:calha_refrataria",
  "qtd": 1,
  "grade": [
   "T T",
   " T ",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_canal",
  "resultado": "cl:canal",
  "qtd": 3,
  "grade": [
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cano_oxigenio",
  "resultado": "cl:cano_oxigenio",
  "qtd": 6,
  "grade": [
   "XXX",
   "   ",
   "XXX"
  ],
  "chaves": {
   "X": "minecraft:glass_pane"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_aco",
  "resultado": "cl:capacete_placa_aco",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_aco_slime",
  "resultado": "cl:capacete_placa_aco_slime",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_aluminio",
  "resultado": "cl:capacete_placa_aluminio",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_bronze",
  "resultado": "cl:capacete_placa_bronze",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_bronze_ametista",
  "resultado": "cl:capacete_placa_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_cobalto",
  "resultado": "cl:capacete_placa_cobalto",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_cobre",
  "resultado": "cl:capacete_placa_cobre",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_ferro",
  "resultado": "cl:capacete_placa_ferro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_ferro_porco",
  "resultado": "cl:capacete_placa_ferro_porco",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_hepatizon",
  "resultado": "cl:capacete_placa_hepatizon",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_manyullyn",
  "resultado": "cl:capacete_placa_manyullyn",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_obsidiana",
  "resultado": "cl:capacete_placa_obsidiana",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_osmio",
  "resultado": "cl:capacete_placa_osmio",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_osmio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_ouro",
  "resultado": "cl:capacete_placa_ouro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_ouro_rosa",
  "resultado": "cl:capacete_placa_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_pedra_chamuscada",
  "resultado": "cl:capacete_placa_pedra_chamuscada",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:tijolo_chamuscado",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_pedra_refrataria",
  "resultado": "cl:capacete_placa_pedra_refrataria",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:tijolo_refratario",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_slime_brasa",
  "resultado": "cl:capacete_placa_slime_brasa",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_slime_cavaleiro",
  "resultado": "cl:capacete_placa_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_placa_slime_rainha",
  "resultado": "cl:capacete_placa_slime_rainha",
  "qtd": 1,
  "grade": [
   "MMM",
   "MLM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_slime",
  "resultado": "cl:capacete_slime",
  "qtd": 1,
  "grade": [
   "SSS",
   "SBS"
  ],
  "chaves": {
   "S": "cl:slime_congelado_ceu",
   "B": "minecraft:bone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacete_viajante",
  "resultado": "cl:capacete_viajante",
  "qtd": 1,
  "grade": [
   "LCL",
   "G G"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "C": "minecraft:copper_ingot",
   "G": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carcaca_reator",
  "resultado": "cl:carcaca_reator",
  "qtd": 4,
  "grade": [
   "FGF",
   "GYG",
   "FGF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "G": "cl:barra_grafite",
   "Y": "cl:lingote_yellorium"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carregador_chunks",
  "resultado": "cl:carregador_chunks",
  "qtd": 1,
  "grade": [
   " P ",
   "OEO",
   "OCO"
  ],
  "chaves": {
   "P": "minecraft:ender_pearl",
   "O": "minecraft:gold_ingot",
   "E": "minecraft:enchanting_table",
   "C": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carregador_combustivel",
  "resultado": "cl:carregador_combustivel",
  "qtd": 1,
  "grade": [
   "XXX",
   "XZX",
   "WYW"
  ],
  "chaves": {
   "W": "cl:placa_aluminio",
   "X": "cl:placa_aco",
   "Y": "cl:wafer_basico",
   "Z": "cl:lata_estanho"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carregador_pontual",
  "resultado": "cl:carregador_pontual",
  "qtd": 10,
  "grade": [
   "PPP",
   "PCP",
   "PPP"
  ],
  "chaves": {
   "P": "minecraft:ender_pearl",
   "C": "cl:carregador_chunks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carrinho",
  "resultado": "cl:carrinho",
  "qtd": 1,
  "grade": [
   "S  ",
   "S  ",
   "FFF"
  ],
  "chaves": {
   "S": "minecraft:stick",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_carrinho_diamante",
  "resultado": "cl:carrinho_diamante",
  "qtd": 1,
  "grade": [
   "DCD"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "C": "cl:carrinho"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_casco_aeronave",
  "resultado": "cl:casco_aeronave",
  "qtd": 1,
  "grade": [
   "LLL",
   "III",
   "LLL"
  ],
  "chaves": {
   "L": "#minecraft:logs",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_casco_nave_liso",
  "resultado": "cl:casco_nave_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "cl:placa_casco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_agua",
  "resultado": "cl:celula_agua",
  "qtd": 1,
  "grade": [
   "VRV",
   "RBR",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "R": "minecraft:redstone",
   "B": "minecraft:bucket",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_energia_basica",
  "resultado": "cl:celula_energia_basica",
  "qtd": 1,
  "grade": [
   "RCR",
   "CEC",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_energia_redstone",
  "resultado": "cl:celula_energia_redstone",
  "qtd": 1,
  "grade": [
   "RVR",
   "VCV",
   "RVR"
  ],
  "chaves": {
   "R": "minecraft:redstone_block",
   "V": "minecraft:glass",
   "C": "cl:celula_energia_reforcada"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_energia_reforcada",
  "resultado": "cl:celula_energia_reforcada",
  "qtd": 1,
  "grade": [
   "RAR",
   "ACA",
   "RAR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "A": "cl:lingote_aco",
   "C": "cl:celula_energia_basica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_energia_ressonante",
  "resultado": "cl:celula_energia_ressonante",
  "qtd": 1,
  "grade": [
   "DED",
   "ECE",
   "DED"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "E": "minecraft:emerald",
   "C": "cl:celula_energia_redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_chave_barril",
  "resultado": "cl:chave_barril",
  "qtd": 1,
  "grade": [
   "F F",
   " S ",
   " S "
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cilindro_vazio",
  "resultado": "cl:cilindro_vazio",
  "qtd": 4,
  "grade": [
   " F ",
   "FVF",
   " F "
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "V": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cinzel",
  "resultado": "cl:cinzel",
  "qtd": 1,
  "grade": [
   " F",
   "S "
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_cobalto_bruto_do_bloco",
  "resultado": "cl:cobalto_bruto",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cobalto_bruto",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_cobre_lunar",
  "resultado": "minecraft:copper_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:minerio_cobre_lunar",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_coletor_oxigenio",
  "resultado": "cl:coletor_oxigenio",
  "qtd": 1,
  "grade": [
   "WWW",
   "YXZ",
   "UVU"
  ],
  "chaves": {
   "U": "cl:placa_aluminio",
   "V": "cl:concentrador_oxigenio",
   "W": "cl:placa_aco",
   "X": "cl:lata_estanho",
   "Y": "cl:ventilador_oxigenio",
   "Z": "cl:respiro_oxigenio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_colheitadeira",
  "resultado": "cl:colheitadeira",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:golden_hoe",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_colocador_blocos",
  "resultado": "cl:colocador_blocos",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:dispenser",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_componente_ferro",
  "resultado": "cl:componente_ferro",
  "qtd": 1,
  "grade": [
   "i i",
   " c ",
   "i i"
  ],
  "chaves": {
   "i": "cl:placa_ferro",
   "c": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_compostadora",
  "resultado": "cl:compostadora",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:composter",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_compressor",
  "resultado": "cl:compressor",
  "qtd": 1,
  "grade": [
   "WXW",
   "WYW",
   "WZW"
  ],
  "chaves": {
   "W": "cl:lingote_aluminio",
   "X": "minecraft:anvil",
   "Y": "minecraft:copper_ingot",
   "Z": "cl:wafer_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_compressor_ar",
  "resultado": "cl:compressor_ar",
  "qtd": 1,
  "grade": [
   "FFF",
   "FCF",
   "FTF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "C": "minecraft:furnace",
   "T": "cl:tubo_pressao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_compressor_eletrico",
  "resultado": "cl:compressor_eletrico",
  "qtd": 1,
  "grade": [
   "WXW",
   "WYW",
   "VZV"
  ],
  "chaves": {
   "V": "cl:cabo",
   "W": "cl:placa_aco",
   "X": "minecraft:anvil",
   "Y": "cl:placa_bronze",
   "Z": "cl:wafer_avancado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_compressor_oxigenio",
  "resultado": "cl:compressor_oxigenio",
  "qtd": 1,
  "grade": [
   "XWX",
   "WZW",
   "XYX"
  ],
  "chaves": {
   "W": "cl:placa_aluminio",
   "X": "cl:placa_aco",
   "Y": "cl:placa_bronze",
   "Z": "cl:concentrador_oxigenio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_computador",
  "resultado": "cl:computador",
  "qtd": 1,
  "grade": [
   "PPP",
   "PRP",
   "PVP"
  ],
  "chaves": {
   "P": "minecraft:stone",
   "R": "minecraft:redstone",
   "V": "minecraft:glass_pane"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_concentrador_oxigenio",
  "resultado": "cl:concentrador_oxigenio",
  "qtd": 1,
  "grade": [
   "ZWZ",
   "WYW",
   "ZXZ"
  ],
  "chaves": {
   "W": "cl:placa_estanho",
   "X": "cl:respiro_oxigenio",
   "Y": "cl:lata_estanho",
   "Z": "cl:placa_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_construtor_corpos",
  "resultado": "cl:construtor_corpos",
  "qtd": 1,
  "grade": [
   "VNV",
   "TBT",
   "FCF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "N": "cl:nucleo_sync",
   "T": "cl:transistor",
   "B": "cl:bloco_maquina",
   "F": "cl:lingote_ferro_comprimido",
   "C": "cl:capacitor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_construtor_pecas",
  "resultado": "cl:construtor_pecas",
  "qtd": 1,
  "grade": [
   "B",
   "L"
  ],
  "chaves": {
   "B": "cl:padrao_branco",
   "L": "#minecraft:logs"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_controlador_fundicao",
  "resultado": "cl:controlador_fundicao",
  "qtd": 1,
  "grade": [
   "TTT",
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_controlador_fundicao_fantastica",
  "resultado": "cl:controlador_fundicao_fantastica",
  "qtd": 1,
  "grade": [
   "TTT",
   "TOT",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado",
   "O": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_controlador_velocidade",
  "resultado": "cl:controlador_velocidade",
  "qtd": 1,
  "grade": [
   " L ",
   "ERE"
  ],
  "chaves": {
   "L": "cl:chapa_latao",
   "E": "cl:engrenagem",
   "R": "cl:revestimento_andesita"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_corda",
  "resultado": "cl:corda",
  "qtd": 4,
  "grade": [
   "s",
   "s"
  ],
  "chaves": {
   "s": "cl:palha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_estrada_chamuscada",
  "resultado": "cl:estrada_chamuscada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_chamuscados",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_estrada_refrataria",
  "resultado": "cl:estrada_refrataria",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_ladrilho_refratario",
  "resultado": "cl:ladrilho_refratario",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_lanterna_chamuscada",
  "resultado": "cl:lanterna_chamuscada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_chamuscados",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_lanterna_refrataria",
  "resultado": "cl:lanterna_refrataria",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pavimento_refratario",
  "resultado": "cl:pavimento_refratario",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pedra_chamuscada_bloco",
  "resultado": "cl:pedra_chamuscada_bloco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_chamuscados",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pedra_chamuscada_entalhada",
  "resultado": "cl:pedra_chamuscada_entalhada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_chamuscados",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pedra_chamuscada_polida",
  "resultado": "cl:pedra_chamuscada_polida",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_chamuscados",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pedra_refrataria_bloco",
  "resultado": "cl:pedra_refrataria_bloco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_pedregulho_refratario",
  "resultado": "cl:pedregulho_refratario",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_tijolos_refratarios_creeper",
  "resultado": "cl:tijolos_refratarios_creeper",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_tijolos_refratarios_finos",
  "resultado": "cl:tijolos_refratarios_finos",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_tijolos_refratarios_pequenos",
  "resultado": "cl:tijolos_refratarios_pequenos",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_tijolos_refratarios_rachados",
  "resultado": "cl:tijolos_refratarios_rachados",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_corte_tijolos_refratarios_triangulo",
  "resultado": "cl:tijolos_refratarios_triangulo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tijolos_refratarios",
    "qtd": 1
   }
  ],
  "estacoes": [
   "stonecutter"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_costeletas_assadas",
  "resultado": "cl:costeletas_assadas",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:costeleta_carneiro_cozida",
    "qtd": 1
   },
   {
    "item": "minecraft:beetroot",
    "qtd": 1
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "cl:arroz_cozido",
    "qtd": 1
   },
   {
    "item": "cl:tomate",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_andesite_alloy",
  "resultado": "cl:liga_andesita",
  "qtd": 1,
  "grade": [
   "BA",
   "AB"
  ],
  "chaves": {
   "A": "minecraft:andesite",
   "B": "minecraft:iron_nugget"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_cr6_cogwheel",
  "resultado": "cl:engrenagem",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:eixo",
    "qtd": 1
   },
   {
    "item": "#minecraft:planks",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_encased_fan",
  "resultado": "cl:ventilador",
  "qtd": 1,
  "grade": [
   "S",
   "A",
   "P"
  ],
  "chaves": {
   "A": "cl:revestimento_andesita",
   "P": "cl:helice",
   "S": "cl:eixo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_gearbox",
  "resultado": "cl:caixa_engrenagens",
  "qtd": 1,
  "grade": [
   " C ",
   "CBC",
   " C "
  ],
  "chaves": {
   "B": "cl:revestimento_andesita",
   "C": "cl:engrenagem"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_hand_crank",
  "resultado": "cl:manivela",
  "qtd": 1,
  "grade": [
   "CCC",
   "  A"
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "C": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_cr6_large_cogwheel",
  "resultado": "cl:engrenagem_grande",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:eixo",
    "qtd": 1
   },
   {
    "item": "#minecraft:planks",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_mechanical_drill",
  "resultado": "cl:furadeira",
  "qtd": 1,
  "grade": [
   " A ",
   "AIA",
   " C "
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "C": "cl:revestimento_andesita",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_mechanical_mixer",
  "resultado": "cl:misturador_mecanico",
  "qtd": 1,
  "grade": [
   "S",
   "C",
   "I"
  ],
  "chaves": {
   "C": "cl:revestimento_andesita",
   "I": "cl:batedor",
   "S": "cl:engrenagem"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_millstone",
  "resultado": "cl:mo",
  "qtd": 1,
  "grade": [
   "C",
   "S",
   "I"
  ],
  "chaves": {
   "C": "cl:engrenagem",
   "I": "minecraft:stone",
   "S": "cl:revestimento_andesita"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_propeller",
  "resultado": "cl:helice",
  "qtd": 1,
  "grade": [
   " S ",
   "SCS",
   " S "
  ],
  "chaves": {
   "C": "cl:liga_andesita",
   "S": "cl:chapa_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_shaft",
  "resultado": "cl:eixo",
  "qtd": 8,
  "grade": [
   "A",
   "A"
  ],
  "chaves": {
   "A": "cl:liga_andesita"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_water_wheel",
  "resultado": "cl:roda_dagua",
  "qtd": 1,
  "grade": [
   "SSS",
   "SCS",
   "SSS"
  ],
  "chaves": {
   "C": "cl:eixo",
   "S": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_whisk",
  "resultado": "cl:batedor",
  "qtd": 1,
  "grade": [
   " C ",
   "SCS",
   "SSS"
  ],
  "chaves": {
   "C": "cl:liga_andesita",
   "S": "cl:chapa_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_white_sail",
  "resultado": "cl:vela_moinho",
  "qtd": 2,
  "grade": [
   "WS",
   "SA"
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "S": "minecraft:stick",
   "W": "minecraft:white_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cr6_windmill_bearing",
  "resultado": "cl:rolamento_moinho",
  "qtd": 1,
  "grade": [
   "B",
   "C",
   "I"
  ],
  "chaves": {
   "B": "minecraft:oak_slab",
   "C": "minecraft:stone",
   "I": "cl:eixo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_dardo_cobalto",
  "resultado": "cl:dardo_cobalto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_cobalto",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 2
   },
   {
    "item": "minecraft:feather",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_dardo_ferro",
  "resultado": "cl:dardo_ferro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:iron_ingot",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 2
   },
   {
    "item": "minecraft:feather",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_dardo_manyullyn",
  "resultado": "cl:dardo_manyullyn",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_manyullyn",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 2
   },
   {
    "item": "minecraft:feather",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_dardo_silex",
  "resultado": "cl:dardo_silex",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:flint",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 2
   },
   {
    "item": "minecraft:feather",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_1",
  "resultado": "minecraft:cobblestone",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_1",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_2",
  "resultado": "cl:pedregulho_comprimido_1",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_2",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_3",
  "resultado": "cl:pedregulho_comprimido_2",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_3",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_4",
  "resultado": "cl:pedregulho_comprimido_3",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_4",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_5",
  "resultado": "cl:pedregulho_comprimido_4",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_5",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_6",
  "resultado": "cl:pedregulho_comprimido_5",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_6",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_7",
  "resultado": "cl:pedregulho_comprimido_6",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_7",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_descomprimir_8",
  "resultado": "cl:pedregulho_comprimido_7",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:pedregulho_comprimido_8",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_diamante_meteorito",
  "resultado": "minecraft:diamond",
  "qtd": 1,
  "grade": [
   "FFF",
   "FFF",
   "FFF"
  ],
  "chaves": {
   "F": "cl:fragmento_meteorito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_dinamo_cinetico",
  "resultado": "cl:dinamo_cinetico",
  "qtd": 1,
  "grade": [
   "rcr",
   "ili"
  ],
  "chaves": {
   "r": "minecraft:redstone",
   "c": "cl:componente_ferro",
   "i": "minecraft:iron_ingot",
   "l": "cl:bobina_bt"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_dinamo_redstone",
  "resultado": "cl:dinamo_redstone",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:redstone_block",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_dirigivel",
  "resultado": "cl:dirigivel",
  "qtd": 1,
  "grade": [
   "SSS",
   "SSS",
   "HHE"
  ],
  "chaves": {
   "S": "cl:vela_aeronave",
   "H": "cl:casco_aeronave",
   "E": "cl:motor_aeronave"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_distribuidor_oxigenio",
  "resultado": "cl:distribuidor_oxigenio",
  "qtd": 1,
  "grade": [
   "WXW",
   "YZY",
   "WXW"
  ],
  "chaves": {
   "W": "cl:placa_aco",
   "X": "cl:ventilador_oxigenio",
   "Y": "cl:respiro_oxigenio",
   "Z": "cl:placa_aluminio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_dreno_chamuscado",
  "resultado": "cl:dreno_chamuscado",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_dreno_fundicao",
  "resultado": "cl:dreno_fundicao",
  "qtd": 1,
  "grade": [
   "T T",
   "T T",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_advanced_capacitor_bank",
  "resultado": "cl:banco_capacitores",
  "qtd": 1,
  "grade": [
   "ACA",
   "CRC",
   "ACA"
  ],
  "chaves": {
   "A": "cl:ferro_condutor",
   "C": "cl:capacitor_duplo",
   "R": "minecraft:redstone_block"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_eio_aglutinante",
  "resultado": "cl:aglutinante_conduite",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:composto_aglutinante",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_alloy_smelter",
  "resultado": "cl:fundidora_ligas",
  "qtd": 1,
  "grade": [
   "GFG",
   "FVF",
   "IOI"
  ],
  "chaves": {
   "F": "minecraft:furnace",
   "G": "cl:engrenagem_ferro",
   "I": "minecraft:iron_ingot",
   "O": "minecraft:obsidian",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_attractor_obelisk",
  "resultado": "cl:obelisco_atracao",
  "qtd": 1,
  "grade": [
   " M ",
   "EGE",
   "ICI"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "E": "cl:liga_energetica",
   "G": "cl:engrenagem_energizada",
   "I": "cl:almario",
   "M": "cl:cristal_sedutor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_aversion_obelisk",
  "resultado": "cl:obelisco_aversao",
  "qtd": 1,
  "grade": [
   " H ",
   "EIE",
   "ICI"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "E": "cl:liga_energetica",
   "H": "cl:cabeca_enderman",
   "I": "cl:almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_basic_capacitor",
  "resultado": "cl:capacitor_basico",
  "qtd": 1,
  "grade": [
   " NG",
   "NIN",
   "GN "
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "I": "minecraft:copper_ingot",
   "N": "minecraft:gold_nugget"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_botas_aco_negro",
  "resultado": "cl:eio_botas_aco_negro",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_calcas_aco_negro",
  "resultado": "cl:eio_calcas_aco_negro",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_capacete_aco_negro",
  "resultado": "cl:eio_capacete_aco_negro",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_conductive_alloy_block",
  "resultado": "cl:bloco_ferro_condutor",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:ferro_condutor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_conductive_alloy_grinding_ball",
  "resultado": "cl:esfera_ferro_condutor",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:ferro_condutor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_conductive_alloy_ingot",
  "resultado": "cl:ferro_condutor",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_ferro_condutor",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_conductive_alloy_nugget",
  "resultado": "cl:pepita_ferro_condutor",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:ferro_condutor",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_conductive_alloy_nugget_to_ingot",
  "resultado": "cl:ferro_condutor",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_ferro_condutor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_conduit_binder_composite",
  "resultado": "cl:composto_aglutinante",
  "qtd": 8,
  "grade": [
   "GCG",
   "SGS",
   "GCG"
  ],
  "chaves": {
   "C": "minecraft:clay_ball",
   "G": "minecraft:gravel",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_bimetal_gear",
  "resultado": "cl:engrenagem_aco_negro",
  "qtd": 1,
  "grade": [
   "NIN",
   "IGI",
   "NIN"
  ],
  "chaves": {
   "G": "cl:engrenagem_ferro",
   "I": "cl:aco_negro",
   "N": "cl:pepita_aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_steel_bars",
  "resultado": "cl:barras_aco_negro",
  "qtd": 16,
  "grade": [
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_steel_block",
  "resultado": "cl:bloco_aco_negro",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_steel_grinding_ball",
  "resultado": "cl:esfera_aco_negro",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_dark_steel_ingot",
  "resultado": "cl:aco_negro",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_aco_negro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_dark_steel_nugget",
  "resultado": "cl:pepita_aco_negro",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:aco_negro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_steel_nugget_to_ingot",
  "resultado": "cl:aco_negro",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_dark_steel_sword",
  "resultado": "cl:eio_espada_aco_negro",
  "qtd": 1,
  "grade": [
   " I ",
   " I ",
   " S "
  ],
  "chaves": {
   "I": "cl:aco_negro",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_double_layer_capacitor",
  "resultado": "cl:capacitor_duplo",
  "qtd": 1,
  "grade": [
   " I ",
   "CDC",
   " I "
  ],
  "chaves": {
   "C": "cl:capacitor_basico",
   "D": "cl:po_carvao",
   "I": "cl:liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_drain",
  "resultado": "cl:dreno",
  "qtd": 1,
  "grade": [
   "ICI",
   "IVI",
   "GBG"
  ],
  "chaves": {
   "B": "minecraft:bucket",
   "C": "cl:vidro_transparente",
   "G": "cl:engrenagem_ferro",
   "I": "cl:ferro_condutor",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_electromagnet",
  "resultado": "cl:eletroima",
  "qtd": 1,
  "grade": [
   "EVE",
   "E E",
   "C C"
  ],
  "chaves": {
   "C": "cl:ferro_condutor",
   "E": "cl:liga_energetica",
   "V": "cl:cristal_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_end_steel_bars",
  "resultado": "cl:barras_aco_end",
  "qtd": 12,
  "grade": [
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:aco_end"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_end_steel_block",
  "resultado": "cl:bloco_aco_end",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:aco_end"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_end_steel_grinding_ball",
  "resultado": "cl:esfera_aco_end",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:aco_end"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_end_steel_ingot",
  "resultado": "cl:aco_end",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_aco_end",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_end_steel_nugget",
  "resultado": "cl:pepita_aco_end",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:aco_end",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_end_steel_nugget_to_ingot",
  "resultado": "cl:aco_end",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_aco_end"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_ender_energy_conduit",
  "resultado": "cl:conduto_energia_ender",
  "qtd": 8,
  "grade": [
   "BBB",
   "III",
   "BBB"
  ],
  "chaves": {
   "B": "cl:aglutinante_conduite",
   "I": "cl:liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_enderios",
  "resultado": "cl:enderios",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   },
   {
    "item": "minecraft:wheat",
    "qtd": 1
   },
   {
    "item": "cl:po_perola_ender",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energetic_alloy_block",
  "resultado": "cl:bloco_liga_energetica",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energetic_alloy_grinding_ball",
  "resultado": "cl:esfera_liga_energetica",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_energetic_alloy_ingot",
  "resultado": "cl:liga_energetica",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_liga_energetica",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_energetic_alloy_nugget",
  "resultado": "cl:pepita_liga_energetica",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:liga_energetica",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energetic_alloy_nugget_to_ingot",
  "resultado": "cl:liga_energetica",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energetic_photovoltaic_module",
  "resultado": "cl:painel_fotovoltaico",
  "qtd": 1,
  "grade": [
   "EFE",
   "PPP",
   "CDC"
  ],
  "chaves": {
   "C": "cl:capacitor_basico",
   "D": "minecraft:redstone",
   "E": "minecraft:gold_ingot",
   "F": "minecraft:glass",
   "P": "cl:placa_fotovoltaica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energized_gear",
  "resultado": "cl:engrenagem_energizada",
  "qtd": 1,
  "grade": [
   "NIN",
   "IGI",
   "NIN"
  ],
  "chaves": {
   "G": "cl:engrenagem_ferro",
   "I": "cl:liga_energetica",
   "N": "cl:pepita_liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_energy_conduit",
  "resultado": "cl:conduto_energia",
  "qtd": 8,
  "grade": [
   "BBB",
   "III",
   "BBB"
  ],
  "chaves": {
   "B": "cl:aglutinante_conduite",
   "I": "cl:ferro_condutor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_enhanced_energy_conduit",
  "resultado": "cl:conduto_energia_aprimorado",
  "qtd": 8,
  "grade": [
   "BBB",
   "III",
   "BBB"
  ],
  "chaves": {
   "B": "cl:aglutinante_conduite",
   "I": "cl:liga_energetica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_ensouled_chassis",
  "resultado": "cl:chassi_almas",
  "qtd": 1,
  "grade": [
   "CIC",
   "IQI",
   "CIC"
  ],
  "chaves": {
   "C": "cl:corrente_almas",
   "I": "cl:almario",
   "Q": "minecraft:quartz"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_experience_rod",
  "resultado": "cl:vara_experiencia",
  "qtd": 1,
  "grade": [
   "  S",
   "VE ",
   "SV "
  ],
  "chaves": {
   "E": "cl:liga_vibrante",
   "S": "cl:almario",
   "V": "cl:semente_suspeita"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_farming_station",
  "resultado": "cl:estacao_agricola",
  "qtd": 1,
  "grade": [
   "EGE",
   "SCS",
   "DZD"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "D": "cl:aco_negro",
   "E": "cl:engrenagem_energizada",
   "G": "cl:cristal_pulsante",
   "S": "cl:almario",
   "Z": "cl:controlador_logico_z"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_fluid_tank",
  "resultado": "cl:tanque_fluido",
  "qtd": 1,
  "grade": [
   "IBI",
   "BGB",
   "IBI"
  ],
  "chaves": {
   "B": "minecraft:iron_bars",
   "G": "minecraft:glass",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_glider",
  "resultado": "cl:planador",
  "qtd": 1,
  "grade": [
   " D ",
   "WDW"
  ],
  "chaves": {
   "D": "cl:aco_negro",
   "W": "cl:asa_planador"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_glider_wing",
  "resultado": "cl:asa_planador",
  "qtd": 1,
  "grade": [
   "  D",
   " DL",
   "DLL"
  ],
  "chaves": {
   "D": "cl:aco_negro",
   "L": "minecraft:leather"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_impulse_hopper",
  "resultado": "cl:funil_impulso",
  "qtd": 1,
  "grade": [
   "IHI",
   "GCG",
   "IRI"
  ],
  "chaves": {
   "C": "cl:chassi_maquina",
   "G": "cl:engrenagem_ferro",
   "H": "minecraft:hopper",
   "I": "cl:ferro_condutor",
   "R": "cl:liga_redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_infinity_rod",
  "resultado": "cl:vara_infinito",
  "qtd": 1,
  "grade": [
   " NG",
   "NSN",
   "GN "
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "N": "cl:pepita_aco_negro",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_inhibitor_obelisk",
  "resultado": "cl:obelisco_inibicao",
  "qtd": 1,
  "grade": [
   " M ",
   "EGE",
   "ICI"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "E": "cl:liga_energetica",
   "G": "cl:engrenagem_ferro",
   "I": "cl:almario",
   "M": "cl:cristal_ender"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_iron_gear",
  "resultado": "cl:engrenagem_ferro",
  "qtd": 1,
  "grade": [
   "NIN",
   "IGI",
   "NIN"
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "I": "minecraft:iron_ingot",
   "N": "minecraft:iron_nugget"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_item_conduit",
  "resultado": "cl:conduto_item",
  "qtd": 8,
  "grade": [
   "BBB",
   "CIC",
   "BBB"
  ],
  "chaves": {
   "B": "cl:aglutinante_conduite",
   "C": "cl:ferro_condutor",
   "I": "cl:ferro_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_machado_aco_negro",
  "resultado": "cl:eio_machado_aco_negro",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_octadic_capacitor",
  "resultado": "cl:capacitor_octadico",
  "qtd": 1,
  "grade": [
   " I ",
   "CGC",
   " I "
  ],
  "chaves": {
   "C": "cl:capacitor_duplo",
   "G": "minecraft:glowstone",
   "I": "cl:liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_peitoral_aco_negro",
  "resultado": "cl:eio_peitoral_aco_negro",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_photovoltaic_composite",
  "resultado": "cl:composto_fotovoltaico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_lapis",
    "qtd": 1
   },
   {
    "item": "cl:po_carvao",
    "qtd": 1
   },
   {
    "item": "cl:silicio",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_picareta_aco_negro",
  "resultado": "cl:eio_picareta_aco_negro",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pressurized_fluid_tank",
  "resultado": "cl:tanque_fluido_pressurizado",
  "qtd": 1,
  "grade": [
   "IBI",
   "BGB",
   "IBI"
  ],
  "chaves": {
   "B": "cl:barras_aco_negro",
   "G": "cl:quartzo_fundido",
   "I": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pulsating_alloy_block",
  "resultado": "cl:bloco_ferro_pulsante",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:ferro_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pulsating_alloy_grinding_ball",
  "resultado": "cl:esfera_ferro_pulsante",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:ferro_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_pulsating_alloy_ingot",
  "resultado": "cl:ferro_pulsante",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_ferro_pulsante",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_pulsating_alloy_nugget",
  "resultado": "cl:pepita_ferro_pulsante",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:ferro_pulsante",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pulsating_alloy_nugget_to_ingot",
  "resultado": "cl:ferro_pulsante",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_ferro_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pulsating_crystal",
  "resultado": "cl:cristal_pulsante",
  "qtd": 1,
  "grade": [
   "PPP",
   "PDP",
   "PPP"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "P": "cl:pepita_ferro_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_pulsating_photovoltaic_module",
  "resultado": "cl:painel_fotovoltaico_avancado",
  "qtd": 1,
  "grade": [
   "IFI",
   "PDP",
   "CSC"
  ],
  "chaves": {
   "C": "cl:capacitor_duplo",
   "D": "cl:po_carvao",
   "F": "cl:quartzo_fundido_iluminado",
   "I": "cl:ferro_pulsante",
   "P": "cl:placa_fotovoltaica",
   "S": "cl:painel_fotovoltaico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_redstone_alloy_block",
  "resultado": "cl:bloco_liga_redstone",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:liga_redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_redstone_alloy_grinding_ball",
  "resultado": "cl:esfera_liga_redstone",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:liga_redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_redstone_alloy_ingot",
  "resultado": "cl:liga_redstone",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_liga_redstone",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_redstone_alloy_nugget",
  "resultado": "cl:pepita_liga_redstone",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:liga_redstone",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_redstone_alloy_nugget_to_ingot",
  "resultado": "cl:liga_redstone",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_liga_redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_reinforced_obsidian_block",
  "resultado": "cl:obsidiana_reforcada",
  "qtd": 1,
  "grade": [
   "GBG",
   "BOB",
   "GBG"
  ],
  "chaves": {
   "B": "cl:barras_aco_negro",
   "G": "cl:graos_infinito",
   "O": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_relocator_obelisk",
  "resultado": "cl:obelisco_relocacao",
  "qtd": 1,
  "grade": [
   "P",
   "A"
  ],
  "chaves": {
   "A": "cl:obelisco_aversao",
   "P": "minecraft:prismarine"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_sag_mill",
  "resultado": "cl:moinho_sag",
  "qtd": 1,
  "grade": [
   "GFG",
   "IVI",
   "OPO"
  ],
  "chaves": {
   "F": "minecraft:flint",
   "G": "cl:engrenagem_ferro",
   "I": "minecraft:iron_ingot",
   "O": "minecraft:obsidian",
   "P": "minecraft:piston",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_slice_and_splice",
  "resultado": "cl:fatiar_emendar",
  "qtd": 1,
  "grade": [
   "IHI",
   "ICI",
   "GBG"
  ],
  "chaves": {
   "B": "minecraft:iron_bars",
   "C": "cl:chassi_almas",
   "G": "cl:engrenagem_energizada",
   "H": "minecraft:skeleton_skull",
   "I": "cl:almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soul_binder",
  "resultado": "cl:vinculador_almas",
  "qtd": 1,
  "grade": [
   "IVI",
   "GCG",
   "IZI"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "G": "cl:engrenagem_energizada",
   "I": "cl:almario",
   "V": "cl:frasco_alma",
   "Z": "cl:controlador_logico_z"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soul_chain",
  "resultado": "cl:corrente_almas",
  "qtd": 2,
  "grade": [
   " N ",
   "QIQ",
   " N "
  ],
  "chaves": {
   "I": "cl:almario",
   "N": "cl:pepita_almario",
   "Q": "cl:po_quartzo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soul_engine",
  "resultado": "cl:motor_almas",
  "qtd": 1,
  "grade": [
   "IGI",
   "BCB",
   "IZI"
  ],
  "chaves": {
   "B": "minecraft:bucket",
   "C": "cl:chassi_almas",
   "G": "cl:quartzo_fundido",
   "I": "cl:almario",
   "Z": "cl:eletrodo_zumbi"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soul_vial",
  "resultado": "cl:frasco_alma",
  "qtd": 1,
  "grade": [
   " S ",
   "Q Q",
   " Q "
  ],
  "chaves": {
   "Q": "cl:quartzo_fundido",
   "S": "cl:almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soularium_block",
  "resultado": "cl:bloco_almario",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soularium_grinding_ball",
  "resultado": "cl:esfera_almario",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_soularium_ingot",
  "resultado": "cl:almario",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_almario",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_soularium_nugget",
  "resultado": "cl:pepita_almario",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:almario",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_soularium_nugget_to_ingot",
  "resultado": "cl:almario",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_almario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_staff_of_levity",
  "resultado": "cl:cajado_levitacao",
  "qtd": 1,
  "grade": [
   "  C",
   " R ",
   "R  "
  ],
  "chaves": {
   "C": "cl:cristal_presciencia",
   "R": "cl:vara_infinito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_staff_of_travelling",
  "resultado": "cl:cajado_viagem",
  "qtd": 1,
  "grade": [
   "  C",
   " I ",
   "I  "
  ],
  "chaves": {
   "C": "cl:cristal_ender",
   "I": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_stirling_generator",
  "resultado": "cl:gerador_stirling",
  "qtd": 1,
  "grade": [
   "GFG",
   "IVI",
   "ODO"
  ],
  "chaves": {
   "D": "minecraft:deepslate",
   "F": "minecraft:furnace",
   "G": "cl:engrenagem_ferro",
   "I": "minecraft:iron_ingot",
   "O": "minecraft:obsidian",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_travel_anchor",
  "resultado": "cl:ancora_viagem",
  "qtd": 1,
  "grade": [
   "IBI",
   "BCB",
   "IBI"
  ],
  "chaves": {
   "B": "cl:aglutinante_conduite",
   "C": "cl:cristal_pulsante",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vacuum_chest",
  "resultado": "cl:bau_vacuo",
  "qtd": 1,
  "grade": [
   "III",
   "ICI",
   "IPI"
  ],
  "chaves": {
   "C": "minecraft:chest",
   "I": "minecraft:iron_ingot",
   "P": "cl:cristal_pulsante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vat",
  "resultado": "cl:crisol_fermentacao",
  "qtd": 1,
  "grade": [
   "SBS",
   "ACA",
   "MRM"
  ],
  "chaves": {
   "A": "cl:ferro_condutor",
   "B": "minecraft:barrel",
   "C": "cl:chassi_maquina",
   "M": "cl:engrenagem_ferro",
   "R": "cl:liga_redstone",
   "S": "cl:aco_negro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_alloy_block",
  "resultado": "cl:bloco_liga_vibrante",
  "qtd": 1,
  "grade": [
   "III",
   "III",
   "III"
  ],
  "chaves": {
   "I": "cl:liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_alloy_grinding_ball",
  "resultado": "cl:esfera_liga_vibrante",
  "qtd": 24,
  "grade": [
   " I ",
   "III",
   " I "
  ],
  "chaves": {
   "I": "cl:liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_vibrant_alloy_ingot",
  "resultado": "cl:liga_vibrante",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_liga_vibrante",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_eio_vibrant_alloy_nugget",
  "resultado": "cl:pepita_liga_vibrante",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:liga_vibrante",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_alloy_nugget_to_ingot",
  "resultado": "cl:liga_vibrante",
  "qtd": 1,
  "grade": [
   "NNN",
   "NNN",
   "NNN"
  ],
  "chaves": {
   "N": "cl:pepita_liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_capacitor_bank",
  "resultado": "cl:banco_capacitores_vibrante",
  "qtd": 1,
  "grade": [
   "VOV",
   "BCB",
   "VOV"
  ],
  "chaves": {
   "B": "cl:banco_capacitores",
   "C": "cl:cristal_vibrante",
   "O": "cl:capacitor_octadico",
   "V": "cl:liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_crystal",
  "resultado": "cl:cristal_vibrante",
  "qtd": 1,
  "grade": [
   "PPP",
   "PDP",
   "PPP"
  ],
  "chaves": {
   "D": "minecraft:emerald",
   "P": "cl:pepita_liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_gear",
  "resultado": "cl:engrenagem_vibrante",
  "qtd": 1,
  "grade": [
   "NIN",
   "IGI",
   "NIN"
  ],
  "chaves": {
   "G": "cl:engrenagem_energizada",
   "I": "cl:liga_vibrante",
   "N": "cl:pepita_liga_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_vibrant_photovoltaic_module",
  "resultado": "cl:painel_fotovoltaico_vibrante",
  "qtd": 1,
  "grade": [
   "IFI",
   "PGP",
   "CSC"
  ],
  "chaves": {
   "C": "cl:capacitor_octadico",
   "F": "cl:quartzo_fundido_escuro",
   "G": "minecraft:glowstone",
   "I": "cl:liga_vibrante",
   "P": "cl:placa_fotovoltaica",
   "S": "cl:painel_fotovoltaico_avancado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_void_chassis",
  "resultado": "cl:chassi_maquina",
  "qtd": 1,
  "grade": [
   "IGI",
   "G G",
   "IGI"
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_void_vial",
  "resultado": "cl:frasco_vazio",
  "qtd": 1,
  "grade": [
   " S ",
   "QVQ",
   "GQG"
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "Q": "cl:quartzo_fundido",
   "S": "cl:almario",
   "V": "cl:semente_suspeita"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_weather_crystal",
  "resultado": "cl:cristal_climatico",
  "qtd": 1,
  "grade": [
   " P ",
   "VEV",
   " P "
  ],
  "chaves": {
   "E": "cl:cristal_ender",
   "P": "cl:cristal_pulsante",
   "V": "cl:cristal_vibrante"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_weather_obelisk",
  "resultado": "cl:obelisco_climatico",
  "qtd": 1,
  "grade": [
   " W ",
   "ESE",
   "SCS"
  ],
  "chaves": {
   "C": "cl:chassi_maquina",
   "E": "cl:liga_energetica",
   "S": "cl:almario",
   "W": "cl:cristal_climatico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_wired_charger",
  "resultado": "cl:carregador_fio",
  "qtd": 1,
  "grade": [
   "CCC",
   "CVC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:ferro_condutor",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_wireless_charger",
  "resultado": "cl:carregador_sem_fio",
  "qtd": 1,
  "grade": [
   "CCC",
   "CVC",
   "CEC"
  ],
  "chaves": {
   "C": "cl:ferro_condutor",
   "E": "cl:ressonador_ender",
   "V": "cl:chassi_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_xp_obelisk",
  "resultado": "cl:obelisco_xp",
  "qtd": 1,
  "grade": [
   " R ",
   " I ",
   "ICI"
  ],
  "chaves": {
   "C": "cl:chassi_almas",
   "I": "cl:almario",
   "R": "cl:vara_experiencia"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_xp_vacuum",
  "resultado": "cl:vacuo_xp",
  "qtd": 1,
  "grade": [
   "III",
   "IRI",
   "IPI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "P": "cl:cristal_pulsante",
   "R": "cl:frasco_vazio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_eio_yeta_wrench",
  "resultado": "cl:chave_yeta",
  "qtd": 1,
  "grade": [
   "I I",
   " G ",
   " I "
  ],
  "chaves": {
   "G": "cl:graos_infinito",
   "I": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_elevador",
  "resultado": "cl:elevador",
  "qtd": 2,
  "grade": [
   "CCC",
   "CPC",
   "CCC"
  ],
  "chaves": {
   "C": "minecraft:smooth_sandstone",
   "P": "minecraft:ender_pearl"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_empacotador",
  "resultado": "cl:empacotador",
  "qtd": 1,
  "grade": [
   "FPF",
   "PBP",
   "FCF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "P": "minecraft:piston",
   "B": "minecraft:crafting_table",
   "C": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_engrenagem_diamante",
  "resultado": "cl:engrenagem_diamante",
  "qtd": 1,
  "grade": [
   " M ",
   "MGM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:diamond",
   "G": "cl:engrenagem_ouro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_engrenagem_ferro",
  "resultado": "cl:engrenagem_ferro",
  "qtd": 1,
  "grade": [
   " M ",
   "MGM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "G": "cl:engrenagem_pedra"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_engrenagem_madeira",
  "resultado": "cl:engrenagem_madeira",
  "qtd": 1,
  "grade": [
   " S ",
   "S S",
   " S "
  ],
  "chaves": {
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_engrenagem_ouro",
  "resultado": "cl:engrenagem_ouro",
  "qtd": 1,
  "grade": [
   " M ",
   "MGM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "G": "cl:engrenagem_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_engrenagem_pedra",
  "resultado": "cl:engrenagem_pedra",
  "qtd": 1,
  "grade": [
   " M ",
   "MGM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:cobblestone",
   "G": "cl:engrenagem_madeira"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_equipamento_oxigenio",
  "resultado": "cl:equipamento_oxigenio",
  "qtd": 1,
  "grade": [
   " Y ",
   "YXY",
   "Y Y"
  ],
  "chaves": {
   "X": "cl:concentrador_oxigenio",
   "Y": "cl:cano_oxigenio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_aco",
  "resultado": "cl:escudo_placa_aco",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_aco_slime",
  "resultado": "cl:escudo_placa_aco_slime",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_aluminio",
  "resultado": "cl:escudo_placa_aluminio",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_bronze",
  "resultado": "cl:escudo_placa_bronze",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_bronze_ametista",
  "resultado": "cl:escudo_placa_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_cobalto",
  "resultado": "cl:escudo_placa_cobalto",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_cobre",
  "resultado": "cl:escudo_placa_cobre",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_ferro",
  "resultado": "cl:escudo_placa_ferro",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_ferro_porco",
  "resultado": "cl:escudo_placa_ferro_porco",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_hepatizon",
  "resultado": "cl:escudo_placa_hepatizon",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_manyullyn",
  "resultado": "cl:escudo_placa_manyullyn",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_obsidiana",
  "resultado": "cl:escudo_placa_obsidiana",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_osmio",
  "resultado": "cl:escudo_placa_osmio",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_osmio",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_ouro",
  "resultado": "cl:escudo_placa_ouro",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_ouro_rosa",
  "resultado": "cl:escudo_placa_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_pedra_chamuscada",
  "resultado": "cl:escudo_placa_pedra_chamuscada",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:tijolo_chamuscado",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_pedra_refrataria",
  "resultado": "cl:escudo_placa_pedra_refrataria",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:tijolo_refratario",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_slime_brasa",
  "resultado": "cl:escudo_placa_slime_brasa",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_slime_cavaleiro",
  "resultado": "cl:escudo_placa_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_placa_slime_rainha",
  "resultado": "cl:escudo_placa_slime_rainha",
  "qtd": 1,
  "grade": [
   "MPM",
   "MPM",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_escudo_viajante",
  "resultado": "cl:escudo_viajante",
  "qtd": 1,
  "grade": [
   "LCL",
   "PPP",
   " P "
  ],
  "chaves": {
   "L": "minecraft:leather",
   "C": "minecraft:copper_ingot",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_esgoto",
  "resultado": "cl:esgoto",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:bucket",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_espetinho",
  "resultado": "cl:espetinho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tomate",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_beef",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estacao_ferramentas",
  "resultado": "cl:estacao_ferramentas",
  "qtd": 1,
  "grade": [
   "B",
   "C"
  ],
  "chaves": {
   "B": "cl:padrao_branco",
   "C": "minecraft:crafting_table"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_estanho_de_po",
  "resultado": "cl:lingote_estanho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:estanho_po",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_estanho_de_quebrado",
  "resultado": "cl:lingote_estanho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:estanho_quebrado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_estanho_de_triturado",
  "resultado": "cl:lingote_estanho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:estanho_triturado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_estanho_lunar",
  "resultado": "cl:lingote_estanho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:minerio_estanho_lunar",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estante",
  "resultado": "cl:estante",
  "qtd": 1,
  "grade": [
   "PSP",
   "P P",
   "PSP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "S": "minecraft:oak_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_esteira",
  "resultado": "cl:esteira",
  "qtd": 16,
  "grade": [
   "RRR",
   "FDF"
  ],
  "chaves": {
   "R": "cl:barra_borracha",
   "F": "minecraft:iron_ingot",
   "D": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_esteira_animal",
  "resultado": "cl:esteira_animal",
  "qtd": 1,
  "grade": [
   "  E",
   "RRR",
   "FFF"
  ],
  "chaves": {
   "E": "cl:esteira",
   "R": "cl:barra_borracha",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_amarelo",
  "resultado": "cl:estrada_plastico_amarelo",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_amarelo",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_azul",
  "resultado": "cl:estrada_plastico_azul",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_azul",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_azul_claro",
  "resultado": "cl:estrada_plastico_azul_claro",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_azul_claro",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_branco",
  "resultado": "cl:estrada_plastico_branco",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_branco",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_ciano",
  "resultado": "cl:estrada_plastico_ciano",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_ciano",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_cinza",
  "resultado": "cl:estrada_plastico_cinza",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_cinza",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_cinza_claro",
  "resultado": "cl:estrada_plastico_cinza_claro",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_cinza_claro",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_laranja",
  "resultado": "cl:estrada_plastico_laranja",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_laranja",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_lima",
  "resultado": "cl:estrada_plastico_lima",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_lima",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_magenta",
  "resultado": "cl:estrada_plastico_magenta",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_magenta",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_marrom",
  "resultado": "cl:estrada_plastico_marrom",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_marrom",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_preto",
  "resultado": "cl:estrada_plastico_preto",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_preto",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_rosa",
  "resultado": "cl:estrada_plastico_rosa",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_rosa",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_roxo",
  "resultado": "cl:estrada_plastico_roxo",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_roxo",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_verde",
  "resultado": "cl:estrada_plastico_verde",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_verde",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrada_plastico_vermelho",
  "resultado": "cl:estrada_plastico_vermelho",
  "qtd": 3,
  "grade": [
   "SSS",
   "###",
   "SSS"
  ],
  "chaves": {
   "#": "cl:plastico_liso_vermelho",
   "S": "minecraft:sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_estrutura_maquina",
  "resultado": "cl:estrutura_maquina",
  "qtd": 1,
  "grade": [
   "FVF",
   "VOV",
   "FVF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "V": "minecraft:glass",
   "O": "minecraft:gold_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_evaporador",
  "resultado": "cl:evaporador",
  "qtd": 1,
  "grade": [
   "VVV",
   "CEC",
   "AAA"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "A": "cl:lingote_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_expositor",
  "resultado": "cl:expositor",
  "qtd": 1,
  "grade": [
   "VVV",
   "V V",
   "PPP"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_extrusora_ignea",
  "resultado": "cl:extrusora_ignea",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:cobblestone",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fabricador_circuitos",
  "resultado": "cl:fabricador_circuitos",
  "qtd": 1,
  "grade": [
   "WXW",
   "UYU",
   "VZV"
  ],
  "chaves": {
   "U": "minecraft:stone_button",
   "V": "cl:cabo",
   "W": "cl:lingote_aluminio",
   "X": "minecraft:lever",
   "Y": "minecraft:furnace",
   "Z": "minecraft:redstone_torch"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_faca_diamante",
  "resultado": "cl:faca_diamante",
  "qtd": 1,
  "grade": [
   "m",
   "s"
  ],
  "chaves": {
   "m": "minecraft:diamond",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_faca_ferro",
  "resultado": "cl:faca_ferro",
  "qtd": 1,
  "grade": [
   "m",
   "s"
  ],
  "chaves": {
   "m": "minecraft:iron_ingot",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_faca_ouro",
  "resultado": "cl:faca_ouro",
  "qtd": 1,
  "grade": [
   "m",
   "s"
  ],
  "chaves": {
   "m": "minecraft:gold_ingot",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_faca_silex",
  "resultado": "cl:faca_silex",
  "qtd": 1,
  "grade": [
   "m",
   "s"
  ],
  "chaves": {
   "m": "minecraft:flint",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fardo_palha",
  "resultado": "cl:fardo_palha",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:palha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_fardo_palha_desfazer",
  "resultado": "cl:palha",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:fardo_palha",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fertilizadora",
  "resultado": "cl:fertilizadora",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:bone_block",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fogao",
  "resultado": "cl:fogao",
  "qtd": 1,
  "grade": [
   "iii",
   "B B",
   "BCB"
  ],
  "chaves": {
   "B": "minecraft:brick_block",
   "C": "minecraft:campfire",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_folha_plastico",
  "resultado": "cl:folha_plastico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:plastico_cru",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fornalha_redstone",
  "resultado": "cl:fornalha_redstone",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:furnace",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_bacon_cozido",
  "resultado": "cl:bacon_cozido",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:bacon",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_costeleta_carneiro_cozida",
  "resultado": "cl:costeleta_carneiro_cozida",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:costeleta_carneiro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_fatia_bacalhau_cozida",
  "resultado": "cl:fatia_bacalhau_cozida",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fatia_bacalhau",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_fatia_salmao_cozida",
  "resultado": "cl:fatia_salmao_cozida",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fatia_salmao",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_hamburguer_carne",
  "resultado": "cl:hamburguer_carne",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:carne_moida",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_forno_pedacos_frango_cozidos",
  "resultado": "cl:pedacos_frango_cozidos",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pedacos_frango",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fundidora_inducao",
  "resultado": "cl:fundidora_inducao",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:bucket",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_fusor",
  "resultado": "cl:fusor",
  "qtd": 1,
  "grade": [
   "TGT",
   "T T",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario",
   "G": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_bio",
  "resultado": "cl:gerador_bio",
  "qtd": 1,
  "grade": [
   "RER",
   "BCB",
   "NEN"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "E": "cl:liga_enriquecida",
   "B": "cl:biocombustivel",
   "C": "cl:circuito_controle_basico",
   "N": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_calor",
  "resultado": "cl:gerador_calor",
  "qtd": 1,
  "grade": [
   "III",
   "WOW",
   "CFC"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "W": "minecraft:oak_planks",
   "O": "cl:lingote_osmio",
   "C": "minecraft:copper_ingot",
   "F": "minecraft:furnace"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_eolico",
  "resultado": "cl:gerador_eolico",
  "qtd": 1,
  "grade": [
   " O ",
   "OAO",
   "ECE"
  ],
  "chaves": {
   "O": "cl:lingote_osmio",
   "A": "cl:liga_enriquecida",
   "E": "cl:tablet_energia",
   "C": "cl:circuito_controle_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_gas",
  "resultado": "cl:gerador_gas",
  "qtd": 1,
  "grade": [
   "PEP",
   "ICI",
   "PEP"
  ],
  "chaves": {
   "P": "cl:lingote_osmio",
   "E": "cl:liga_enriquecida",
   "I": "cl:revestimento_aco",
   "C": "cl:nucleo_eletrolitico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_solar_avancado",
  "resultado": "cl:gerador_solar_avancado",
  "qtd": 1,
  "grade": [
   "SES",
   "SES",
   "III"
  ],
  "chaves": {
   "S": "cl:gerador_solar_mk",
   "E": "cl:liga_enriquecida",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_gerador_solar_mk",
  "resultado": "cl:gerador_solar_mk",
  "qtd": 1,
  "grade": [
   "SSS",
   "AIA",
   "PEP"
  ],
  "chaves": {
   "S": "cl:painel_solar_mk",
   "A": "cl:liga_enriquecida",
   "I": "minecraft:iron_ingot",
   "P": "cl:po_osmio",
   "E": "cl:tablet_energia"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_girocoptero",
  "resultado": "cl:girocoptero",
  "qtd": 1,
  "grade": [
   " S ",
   "HPH",
   " S "
  ],
  "chaves": {
   "S": "cl:vela_aeronave",
   "H": "cl:casco_aeronave",
   "P": "cl:helice_aviao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_grade",
  "resultado": "cl:grade",
  "qtd": 1,
  "grade": [
   "II",
   "II"
  ],
  "chaves": {
   "I": "minecraft:iron_bars"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_graveto_tratado",
  "resultado": "cl:graveto_tratado",
  "qtd": 4,
  "grade": [
   "w",
   "w"
  ],
  "chaves": {
   "w": "cl:tabuas_tratadas"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_helice_aviao",
  "resultado": "cl:helice_aviao",
  "qtd": 1,
  "grade": [
   "II ",
   " I ",
   " II"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_infusor_quimico",
  "resultado": "cl:infusor_quimico",
  "qtd": 1,
  "grade": [
   "CLC",
   "AEA",
   "CLC"
  ],
  "chaves": {
   "C": "cl:cilindro_vazio",
   "L": "cl:liga_enriquecida",
   "A": "cl:lingote_aco",
   "E": "cl:estrutura_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_interface_camara",
  "resultado": "cl:interface_camara",
  "qtd": 1,
  "grade": [
   "P",
   "H"
  ],
  "chaves": {
   "P": "cl:parede_camara",
   "H": "minecraft:hopper"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jaspe",
  "resultado": "cl:jaspe",
  "qtd": 8,
  "grade": [
   "###",
   "#D#",
   "###"
  ],
  "chaves": {
   "#": "minecraft:cobblestone",
   "D": "minecraft:red_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jaspe_entalhado",
  "resultado": "cl:jaspe_entalhado",
  "qtd": 1,
  "grade": [
   "#",
   "#"
  ],
  "chaves": {
   "#": "cl:jaspe_tijolos"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jaspe_pilar",
  "resultado": "cl:jaspe_pilar",
  "qtd": 2,
  "grade": [
   "#",
   "#"
  ],
  "chaves": {
   "#": "cl:jaspe_polido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jaspe_polido",
  "resultado": "cl:jaspe_polido",
  "qtd": 4,
  "grade": [
   "##",
   "##"
  ],
  "chaves": {
   "#": "cl:jaspe"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jaspe_tijolos",
  "resultado": "cl:jaspe_tijolos",
  "qtd": 4,
  "grade": [
   "##",
   "##"
  ],
  "chaves": {
   "#": "cl:jaspe_polido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_jetpack",
  "resultado": "cl:jetpack",
  "qtd": 1,
  "grade": [
   "AHA",
   "LCL",
   "A A"
  ],
  "chaves": {
   "A": "cl:lingote_aco",
   "H": "cl:cilindro_hidrogenio",
   "L": "cl:liga_enriquecida",
   "C": "minecraft:iron_chestplate"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lampada",
  "resultado": "cl:lampada",
  "qtd": 1,
  "grade": [
   "VVV",
   "VGV",
   " F "
  ],
  "chaves": {
   "V": "minecraft:glass",
   "G": "minecraft:glowstone",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_amarela",
  "resultado": "cl:lampada_amarela",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:yellow_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_azul",
  "resultado": "cl:lampada_azul",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:blue_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_ciano",
  "resultado": "cl:lampada_ciano",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:cyan_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_laranja",
  "resultado": "cl:lampada_laranja",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:orange_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lampada_pedra",
  "resultado": "cl:lampada_pedra",
  "qtd": 4,
  "grade": [
   "SSS",
   "SCS",
   "SSS"
  ],
  "chaves": {
   "S": "minecraft:stone",
   "C": "minecraft:coal"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_rosa",
  "resultado": "cl:lampada_rosa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:pink_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_roxa",
  "resultado": "cl:lampada_roxa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:purple_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_verde",
  "resultado": "cl:lampada_verde",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:lime_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lampada_vermelha",
  "resultado": "cl:lampada_vermelha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lampada",
    "qtd": 1
   },
   {
    "item": "minecraft:red_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lanterna",
  "resultado": "cl:lanterna",
  "qtd": 1,
  "grade": [
   "FFF",
   "VTV",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:iron_nugget",
   "V": "minecraft:glass",
   "T": "minecraft:torch"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lanterna_papel",
  "resultado": "cl:lanterna_papel",
  "qtd": 1,
  "grade": [
   "PPP",
   "PTP",
   "PPP"
  ],
  "chaves": {
   "P": "minecraft:paper",
   "T": "minecraft:torch"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lata_cobre",
  "resultado": "cl:lata_cobre",
  "qtd": 2,
  "grade": [
   "X X",
   "X X",
   "XXX"
  ],
  "chaves": {
   "X": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lata_estanho",
  "resultado": "cl:lata_estanho",
  "qtd": 2,
  "grade": [
   "X X",
   "X X",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_estanho"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ligador",
  "resultado": "cl:ligador",
  "qtd": 1,
  "grade": [
   "TGT",
   "TMT",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado",
   "G": "minecraft:glass",
   "M": "cl:fusor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_aco_slime_do_bloco",
  "resultado": "cl:lingote_aco_slime",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_aco_slime",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_lingote_aluminio_po",
  "resultado": "cl:lingote_aluminio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:aluminio_po",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_cobalto_do_bloco",
  "resultado": "cl:lingote_cobalto",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cobalto",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_cobalto_pepitas",
  "resultado": "cl:lingote_cobalto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pepita_cobalto",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_ferro_porco_do_bloco",
  "resultado": "cl:lingote_ferro_porco",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_ferro_porco",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_hepatizon_do_bloco",
  "resultado": "cl:lingote_hepatizon",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_hepatizon",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_manyullyn_do_bloco",
  "resultado": "cl:lingote_manyullyn",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_manyullyn",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_slime_brasa_do_bloco",
  "resultado": "cl:lingote_slime_brasa",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_brasa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_slime_cavaleiro_do_bloco",
  "resultado": "cl:lingote_slime_cavaleiro",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_cavaleiro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_slime_rainha_do_bloco",
  "resultado": "cl:lingote_slime_rainha",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_slime_rainha",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_lingote_yellorium",
  "resultado": "cl:lingote_yellorium",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_yellorium",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingote_yellorium_de_bloco",
  "resultado": "cl:lingote_yellorium",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_yellorium",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_aco",
  "resultado": "cl:lingote_aco",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_aco",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_bronze",
  "resultado": "cl:lingote_bronze",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_bronze",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_bronze_ametista",
  "resultado": "cl:lingote_bronze_ametista",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_bronze_ametista",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_estanho",
  "resultado": "cl:lingote_estanho",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_estanho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_ferro_comprimido",
  "resultado": "cl:lingote_ferro_comprimido",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_ferro_comprimido",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_lingotes_ouro_rosa",
  "resultado": "cl:lingote_ouro_rosa",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_ouro_rosa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lixeira",
  "resultado": "cl:lixeira",
  "qtd": 1,
  "grade": [
   "SSS",
   "CBC",
   "CCC"
  ],
  "chaves": {
   "S": "minecraft:stone",
   "C": "minecraft:cobblestone",
   "B": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_lona",
  "resultado": "cl:lona",
  "qtd": 1,
  "grade": [
   "##",
   "##"
  ],
  "chaves": {
   "#": "cl:palha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_machado_arremesso_cobalto",
  "resultado": "cl:machado_arremesso_cobalto",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:lingote_cobalto",
    "qtd": 2
   },
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_machado_arremesso_ferro",
  "resultado": "cl:machado_arremesso_ferro",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:iron_ingot",
    "qtd": 2
   },
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_machado_arremesso_manyullyn",
  "resultado": "cl:machado_arremesso_manyullyn",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:lingote_manyullyn",
    "qtd": 2
   },
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_machado_arremesso_silex",
  "resultado": "cl:machado_arremesso_silex",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:flint",
    "qtd": 2
   },
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:string",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_malha",
  "resultado": "cl:malha",
  "qtd": 1,
  "grade": [
   " C ",
   "C C",
   " C "
  ],
  "chaves": {
   "C": "minecraft:chain"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_manometro",
  "resultado": "cl:manometro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:lingote_ferro_comprimido",
    "qtd": 1
   },
   {
    "item": "minecraft:clock",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_marmore_liso",
  "resultado": "cl:marmore_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "cl:marmore"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_martelo_engenheiro",
  "resultado": "cl:martelo_engenheiro",
  "qtd": 1,
  "grade": [
   " if",
   " si",
   "s  "
  ],
  "chaves": {
   "f": "minecraft:string",
   "i": "minecraft:iron_ingot",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mascara_oxigenio",
  "resultado": "cl:mascara_oxigenio",
  "qtd": 1,
  "grade": [
   "XXX",
   "XYX",
   "XXX"
  ],
  "chaves": {
   "X": "minecraft:glass_pane",
   "Y": "minecraft:iron_helmet"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_matriz_conversao",
  "resultado": "cl:matriz_conversao",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:faca_corte",
    "qtd": 1
   },
   {
    "item": "cl:cristal_fluix",
    "qtd": 1
   },
   {
    "item": "minecraft:glass",
    "qtd": 1
   },
   {
    "item": "cl:processador_basico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_alimentacao",
  "resultado": "cl:melhoria_alimentacao",
  "qtd": 1,
  "grade": [
   " C ",
   "ABM",
   " E "
  ],
  "chaves": {
   "C": "minecraft:golden_carrot",
   "A": "minecraft:golden_apple",
   "B": "cl:melhoria_base",
   "M": "minecraft:glistering_melon_slice",
   "E": "minecraft:ender_pearl"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_alimentacao_avancada",
  "resultado": "cl:melhoria_alimentacao_avancada",
  "qtd": 1,
  "grade": [
   " D ",
   "GVG",
   "RRR"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "G": "minecraft:gold_ingot",
   "V": "cl:melhoria_alimentacao",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_base",
  "resultado": "cl:melhoria_base",
  "qtd": 1,
  "grade": [
   "SIS",
   "ILI",
   "SIS"
  ],
  "chaves": {
   "S": "minecraft:string",
   "I": "minecraft:iron_ingot",
   "L": "minecraft:leather"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_coleta",
  "resultado": "cl:melhoria_coleta",
  "qtd": 1,
  "grade": [
   " P ",
   "SBS",
   "RRR"
  ],
  "chaves": {
   "P": "minecraft:sticky_piston",
   "S": "minecraft:string",
   "B": "cl:melhoria_base",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_compactacao",
  "resultado": "cl:melhoria_compactacao",
  "qtd": 1,
  "grade": [
   "IPI",
   "PBP",
   "RPR"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "P": "minecraft:piston",
   "B": "cl:melhoria_base",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_compactacao_avancada",
  "resultado": "cl:melhoria_compactacao_avancada",
  "qtd": 1,
  "grade": [
   " D ",
   "GCG",
   "RRR"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "G": "minecraft:gold_ingot",
   "C": "cl:melhoria_compactacao",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_deposito",
  "resultado": "cl:melhoria_deposito",
  "qtd": 1,
  "grade": [
   " P ",
   "IBI",
   "RCR"
  ],
  "chaves": {
   "P": "minecraft:piston",
   "I": "minecraft:iron_ingot",
   "B": "cl:melhoria_base",
   "R": "minecraft:redstone",
   "C": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_fornalha",
  "resultado": "cl:melhoria_fornalha",
  "qtd": 1,
  "grade": [
   "RIR",
   "IBI",
   "RFR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "I": "minecraft:iron_ingot",
   "B": "cl:melhoria_base",
   "F": "minecraft:furnace"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_fundicao_auto",
  "resultado": "cl:melhoria_fundicao_auto",
  "qtd": 1,
  "grade": [
   "DHD",
   "RSH",
   "GHG"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "H": "minecraft:hopper",
   "R": "minecraft:redstone",
   "S": "cl:melhoria_fornalha",
   "G": "minecraft:gold_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_ima",
  "resultado": "cl:melhoria_ima",
  "qtd": 1,
  "grade": [
   "EIE",
   "IPI",
   "R L"
  ],
  "chaves": {
   "E": "minecraft:ender_pearl",
   "I": "minecraft:iron_ingot",
   "P": "cl:melhoria_coleta",
   "R": "minecraft:redstone",
   "L": "minecraft:lapis_lazuli"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_ima_avancada",
  "resultado": "cl:melhoria_ima_avancada",
  "qtd": 1,
  "grade": [
   " D ",
   "GMG",
   "RRR"
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "G": "minecraft:gold_ingot",
   "M": "cl:melhoria_ima",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_reabastecer",
  "resultado": "cl:melhoria_reabastecer",
  "qtd": 1,
  "grade": [
   " P ",
   "IBI",
   "RCR"
  ],
  "chaves": {
   "P": "minecraft:sticky_piston",
   "I": "minecraft:iron_ingot",
   "B": "cl:melhoria_base",
   "R": "minecraft:redstone",
   "C": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_melhoria_recarga",
  "resultado": "cl:melhoria_recarga",
  "qtd": 1,
  "grade": [
   " E ",
   "IBI",
   "RCR"
  ],
  "chaves": {
   "E": "minecraft:ender_pearl",
   "I": "minecraft:iron_ingot",
   "B": "cl:melhoria_base",
   "R": "minecraft:redstone",
   "C": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mesa_fundicao",
  "resultado": "cl:mesa_fundicao",
  "qtd": 1,
  "grade": [
   "TTT",
   "T T",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mesa_fundicao_chamuscada",
  "resultado": "cl:mesa_fundicao_chamuscada",
  "qtd": 1,
  "grade": [
   "TTT",
   "T T",
   "T T"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mesa_moldes",
  "resultado": "cl:mesa_moldes",
  "qtd": 1,
  "grade": [
   "B",
   "P"
  ],
  "chaves": {
   "B": "cl:padrao_branco",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_chemical_injection_chamber",
  "resultado": "cl:camara_injecao",
  "qtd": 1,
  "grade": [
   "ACA",
   "I#I",
   "ACA"
  ],
  "chaves": {
   "#": "cl:camara_purificacao",
   "A": "cl:liga_reforcada",
   "C": "cl:circuito_controle_elite",
   "I": "minecraft:gold_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_control_circuit_advanced",
  "resultado": "cl:circuito_controle_avancado",
  "qtd": 1,
  "grade": [
   "ACA"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "C": "cl:circuito_controle_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_control_circuit_elite",
  "resultado": "cl:circuito_controle_elite",
  "qtd": 1,
  "grade": [
   "ACA"
  ],
  "chaves": {
   "A": "cl:liga_reforcada",
   "C": "cl:circuito_controle_avancado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_control_circuit_ultimate",
  "resultado": "cl:circuito_controle_supremo",
  "qtd": 1,
  "grade": [
   "ACA"
  ],
  "chaves": {
   "A": "cl:liga_atomica",
   "C": "cl:circuito_controle_elite"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_electrolytic_core",
  "resultado": "cl:nucleo_eletrolitico",
  "qtd": 1,
  "grade": [
   "AOA",
   "IA#",
   "AOA"
  ],
  "chaves": {
   "#": "cl:po_ouro",
   "A": "cl:liga_enriquecida",
   "I": "cl:po_ferro",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_electrolytic_separator",
  "resultado": "cl:separador_eletrolitico",
  "qtd": 1,
  "grade": [
   "IRI",
   "A#A",
   "IRI"
  ],
  "chaves": {
   "#": "cl:nucleo_eletrolitico",
   "A": "cl:liga_enriquecida",
   "I": "minecraft:iron_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_energy_cube_advanced",
  "resultado": "cl:cubo_energia_avancado",
  "qtd": 1,
  "grade": [
   "AEA",
   "IPI",
   "AEA"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "E": "cl:tablet_energia",
   "I": "cl:lingote_osmio",
   "P": "cl:cubo_energia_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_energy_cube_basic",
  "resultado": "cl:cubo_energia_basico",
  "qtd": 1,
  "grade": [
   "AEA",
   "IPI",
   "AEA"
  ],
  "chaves": {
   "A": "minecraft:redstone",
   "E": "cl:tablet_energia",
   "I": "minecraft:iron_ingot",
   "P": "cl:revestimento_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_energy_cube_elite",
  "resultado": "cl:cubo_energia_elite",
  "qtd": 1,
  "grade": [
   "AEA",
   "IPI",
   "AEA"
  ],
  "chaves": {
   "A": "cl:liga_reforcada",
   "E": "cl:tablet_energia",
   "I": "minecraft:gold_ingot",
   "P": "cl:cubo_energia_avancado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_energy_cube_ultimate",
  "resultado": "cl:cubo_energia_definitivo",
  "qtd": 1,
  "grade": [
   "AEA",
   "IPI",
   "AEA"
  ],
  "chaves": {
   "A": "cl:liga_atomica",
   "E": "cl:tablet_energia",
   "I": "minecraft:diamond",
   "P": "cl:cubo_energia_elite"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_energy_tablet",
  "resultado": "cl:tablet_energia",
  "qtd": 1,
  "grade": [
   "RIR",
   "AIA",
   "RIR"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "I": "minecraft:gold_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_enrichment_chamber",
  "resultado": "cl:camara_enriquecimento",
  "qtd": 1,
  "grade": [
   "ACA",
   "IXI",
   "ACA"
  ],
  "chaves": {
   "A": "minecraft:redstone",
   "C": "cl:circuito_controle_basico",
   "I": "minecraft:iron_ingot",
   "X": "cl:revestimento_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_metallurgic_infuser",
  "resultado": "cl:infusor_metalurgico",
  "qtd": 1,
  "grade": [
   "I#I",
   "ROR",
   "I#I"
  ],
  "chaves": {
   "#": "minecraft:furnace",
   "I": "minecraft:iron_ingot",
   "O": "cl:lingote_osmio",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_osmium_compressor",
  "resultado": "cl:compressor_osmio",
  "qtd": 1,
  "grade": [
   "ACA",
   "BXB",
   "ACA"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "B": "minecraft:bucket",
   "C": "cl:circuito_controle_avancado",
   "X": "cl:revestimento_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_precision_sawmill",
  "resultado": "cl:serraria_precisao",
  "qtd": 1,
  "grade": [
   "ICI",
   "AXA",
   "ICI"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "C": "cl:circuito_controle_basico",
   "I": "minecraft:iron_ingot",
   "X": "cl:revestimento_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk10_purification_chamber",
  "resultado": "cl:camara_purificacao",
  "qtd": 1,
  "grade": [
   "ACA",
   "OPO",
   "ACA"
  ],
  "chaves": {
   "A": "cl:liga_enriquecida",
   "C": "cl:circuito_controle_avancado",
   "O": "cl:lingote_osmio",
   "P": "cl:camara_enriquecimento"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_aco",
  "resultado": "cl:mk_botas_aco",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_bronze",
  "resultado": "cl:mk_botas_bronze",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_glowstone",
  "resultado": "cl:mk_botas_glowstone",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_lapis",
  "resultado": "cl:mk_botas_lapis",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_obsidiana",
  "resultado": "cl:mk_botas_obsidiana",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_botas_osmio",
  "resultado": "cl:mk_botas_osmio",
  "qtd": 1,
  "grade": [
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_aco",
  "resultado": "cl:mk_calcas_aco",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_bronze",
  "resultado": "cl:mk_calcas_bronze",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_glowstone",
  "resultado": "cl:mk_calcas_glowstone",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_lapis",
  "resultado": "cl:mk_calcas_lapis",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_obsidiana",
  "resultado": "cl:mk_calcas_obsidiana",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_calcas_osmio",
  "resultado": "cl:mk_calcas_osmio",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_aco",
  "resultado": "cl:mk_capacete_aco",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_bronze",
  "resultado": "cl:mk_capacete_bronze",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_glowstone",
  "resultado": "cl:mk_capacete_glowstone",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_lapis",
  "resultado": "cl:mk_capacete_lapis",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_obsidiana",
  "resultado": "cl:mk_capacete_obsidiana",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_capacete_osmio",
  "resultado": "cl:mk_capacete_osmio",
  "qtd": 1,
  "grade": [
   "XXX",
   "X X"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_aco",
  "resultado": "cl:mk_enxada_aco",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_bronze",
  "resultado": "cl:mk_enxada_bronze",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_glowstone",
  "resultado": "cl:mk_enxada_glowstone",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_lapis",
  "resultado": "cl:mk_enxada_lapis",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_obsidiana",
  "resultado": "cl:mk_enxada_obsidiana",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_enxada_osmio",
  "resultado": "cl:mk_enxada_osmio",
  "qtd": 1,
  "grade": [
   "XX",
   " T",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_aco",
  "resultado": "cl:mk_espada_aco",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_bronze",
  "resultado": "cl:mk_espada_bronze",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_glowstone",
  "resultado": "cl:mk_espada_glowstone",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_lapis",
  "resultado": "cl:mk_espada_lapis",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_obsidiana",
  "resultado": "cl:mk_espada_obsidiana",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_espada_osmio",
  "resultado": "cl:mk_espada_osmio",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_aco",
  "resultado": "cl:mk_machado_aco",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_bronze",
  "resultado": "cl:mk_machado_bronze",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_glowstone",
  "resultado": "cl:mk_machado_glowstone",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_lapis",
  "resultado": "cl:mk_machado_lapis",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_obsidiana",
  "resultado": "cl:mk_machado_obsidiana",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_machado_osmio",
  "resultado": "cl:mk_machado_osmio",
  "qtd": 1,
  "grade": [
   "XX",
   "XT",
   " T"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_aco",
  "resultado": "cl:mk_pa_aco",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_bronze",
  "resultado": "cl:mk_pa_bronze",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_glowstone",
  "resultado": "cl:mk_pa_glowstone",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_lapis",
  "resultado": "cl:mk_pa_lapis",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_obsidiana",
  "resultado": "cl:mk_pa_obsidiana",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_pa_osmio",
  "resultado": "cl:mk_pa_osmio",
  "qtd": 1,
  "grade": [
   "X",
   "T",
   "T"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_aco",
  "resultado": "cl:mk_paxel_aco",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_aco",
   "F": "cl:mk_picareta_aco",
   "P": "cl:mk_pa_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_bronze",
  "resultado": "cl:mk_paxel_bronze",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_bronze",
   "F": "cl:mk_picareta_bronze",
   "P": "cl:mk_pa_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_diamante",
  "resultado": "cl:mk_paxel_diamante",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "minecraft:diamond_axe",
   "F": "minecraft:diamond_pickaxe",
   "P": "minecraft:diamond_shovel",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_ferro",
  "resultado": "cl:mk_paxel_ferro",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "minecraft:iron_axe",
   "F": "minecraft:iron_pickaxe",
   "P": "minecraft:iron_shovel",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_glowstone",
  "resultado": "cl:mk_paxel_glowstone",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_glowstone",
   "F": "cl:mk_picareta_glowstone",
   "P": "cl:mk_pa_glowstone",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_lapis",
  "resultado": "cl:mk_paxel_lapis",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_lapis",
   "F": "cl:mk_picareta_lapis",
   "P": "cl:mk_pa_lapis",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_madeira",
  "resultado": "cl:mk_paxel_madeira",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "minecraft:wooden_axe",
   "F": "minecraft:wooden_pickaxe",
   "P": "minecraft:wooden_shovel",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_obsidiana",
  "resultado": "cl:mk_paxel_obsidiana",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_obsidiana",
   "F": "cl:mk_picareta_obsidiana",
   "P": "cl:mk_pa_obsidiana",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_osmio",
  "resultado": "cl:mk_paxel_osmio",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "cl:mk_machado_osmio",
   "F": "cl:mk_picareta_osmio",
   "P": "cl:mk_pa_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_ouro",
  "resultado": "cl:mk_paxel_ouro",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "minecraft:golden_axe",
   "F": "minecraft:golden_pickaxe",
   "P": "minecraft:golden_shovel",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_paxel_pedra",
  "resultado": "cl:mk_paxel_pedra",
  "qtd": 1,
  "grade": [
   "AFP",
   " T ",
   " T "
  ],
  "chaves": {
   "A": "minecraft:stone_axe",
   "F": "minecraft:stone_pickaxe",
   "P": "minecraft:stone_shovel",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_aco",
  "resultado": "cl:mk_peitoral_aco",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_bronze",
  "resultado": "cl:mk_peitoral_bronze",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_glowstone",
  "resultado": "cl:mk_peitoral_glowstone",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_lapis",
  "resultado": "cl:mk_peitoral_lapis",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_obsidiana",
  "resultado": "cl:mk_peitoral_obsidiana",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_peitoral_osmio",
  "resultado": "cl:mk_peitoral_osmio",
  "qtd": 1,
  "grade": [
   "X X",
   "XXX",
   "XXX"
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_aco",
  "resultado": "cl:mk_picareta_aco",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:lingote_aco",
   "T": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_bronze",
  "resultado": "cl:mk_picareta_bronze",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:lingote_bronze",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_glowstone",
  "resultado": "cl:mk_picareta_glowstone",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:lingote_glowstone_refinado",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_lapis",
  "resultado": "cl:mk_picareta_lapis",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "minecraft:lapis_lazuli",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_obsidiana",
  "resultado": "cl:mk_picareta_obsidiana",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:lingote_obsidiana_refinada",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mk_picareta_osmio",
  "resultado": "cl:mk_picareta_osmio",
  "qtd": 1,
  "grade": [
   "XXX",
   " T ",
   " T "
  ],
  "chaves": {
   "X": "cl:lingote_osmio",
   "T": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_mochila",
  "resultado": "cl:mochila",
  "qtd": 1,
  "grade": [
   "LLL",
   "LWL",
   "LLL"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "W": "minecraft:white_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_moinho_vento",
  "resultado": "cl:moinho_vento",
  "qtd": 1,
  "grade": [
   "ppp",
   "pip",
   "ppp"
  ],
  "chaves": {
   "p": "cl:pa_moinho",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_motor_aeronave",
  "resultado": "cl:motor_aeronave",
  "qtd": 1,
  "grade": [
   " C ",
   "PFP",
   "CIC"
  ],
  "chaves": {
   "F": "minecraft:blast_furnace",
   "C": "minecraft:cobblestone",
   "I": "cl:caldeira",
   "P": "minecraft:piston"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_motor_combustao",
  "resultado": "cl:motor_combustao",
  "qtd": 1,
  "grade": [
   "AAA",
   " V ",
   "GPG"
  ],
  "chaves": {
   "A": "cl:lingote_aco",
   "V": "minecraft:glass",
   "G": "cl:engrenagem_ferro",
   "P": "minecraft:piston"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_motor_foguete",
  "resultado": "cl:motor_foguete",
  "qtd": 1,
  "grade": [
   " YV",
   "XWX",
   "XZX"
  ],
  "chaves": {
   "V": "minecraft:stone_button",
   "W": "cl:lata_estanho",
   "X": "cl:placa_reforcada",
   "Y": "minecraft:flint_and_steel",
   "Z": "cl:respiro_oxigenio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_nucleo_funil",
  "resultado": "cl:nucleo_funil",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:hopper",
    "qtd": 1
   },
   {
    "item": "minecraft:redstone",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_nucleo_sync",
  "resultado": "cl:nucleo_sync",
  "qtd": 1,
  "grade": [
   "GDG",
   "DCD",
   "GDG"
  ],
  "chaves": {
   "G": "minecraft:gold_ingot",
   "D": "minecraft:diamond",
   "C": "cl:coracao_farao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_osmio_de_po",
  "resultado": "cl:lingote_osmio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:osmio_po",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_osmio_de_quebrado",
  "resultado": "cl:lingote_osmio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:osmio_quebrado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_osmio_de_triturado",
  "resultado": "cl:lingote_osmio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:osmio_triturado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_osmio_po",
  "resultado": "cl:lingote_osmio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_osmio",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pa_moinho",
  "resultado": "cl:pa_moinho",
  "qtd": 1,
  "grade": [
   "bb ",
   "ssb",
   "ss "
  ],
  "chaves": {
   "b": "cl:tabuas_tratadas",
   "s": "cl:graveto_tratado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_padrao_branco",
  "resultado": "cl:padrao_branco",
  "qtd": 4,
  "grade": [
   "PS",
   "SP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_amarelo",
  "resultado": "cl:painel_brilhante_amarelo",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:yellow_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_azul",
  "resultado": "cl:painel_brilhante_azul",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:blue_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_azul_claro",
  "resultado": "cl:painel_brilhante_azul_claro",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:light_blue_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_branco",
  "resultado": "cl:painel_brilhante_branco",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:white_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_ciano",
  "resultado": "cl:painel_brilhante_ciano",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:cyan_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_cinza",
  "resultado": "cl:painel_brilhante_cinza",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:gray_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_cinza_claro",
  "resultado": "cl:painel_brilhante_cinza_claro",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:light_gray_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_laranja",
  "resultado": "cl:painel_brilhante_laranja",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:orange_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_lima",
  "resultado": "cl:painel_brilhante_lima",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:lime_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_magenta",
  "resultado": "cl:painel_brilhante_magenta",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:magenta_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_marrom",
  "resultado": "cl:painel_brilhante_marrom",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:brown_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_preto",
  "resultado": "cl:painel_brilhante_preto",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:black_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_rosa",
  "resultado": "cl:painel_brilhante_rosa",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:pink_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_roxo",
  "resultado": "cl:painel_brilhante_roxo",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:purple_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_verde",
  "resultado": "cl:painel_brilhante_verde",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:green_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_brilhante_vermelho",
  "resultado": "cl:painel_brilhante_vermelho",
  "qtd": 2,
  "grade": [
   "PHP",
   "HDH",
   "GHG"
  ],
  "chaves": {
   "P": "minecraft:glass_pane",
   "H": "cl:folha_plastico",
   "D": "minecraft:red_dye",
   "G": "minecraft:glowstone_dust"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_solar_mk",
  "resultado": "cl:painel_solar_mk",
  "qtd": 1,
  "grade": [
   "GGG",
   "RAR",
   "PPP"
  ],
  "chaves": {
   "G": "minecraft:glass_pane",
   "R": "minecraft:redstone",
   "A": "cl:liga_enriquecida",
   "P": "cl:lingote_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_palha_trancada",
  "resultado": "cl:palha_trancada",
  "qtd": 1,
  "grade": [
   "WW",
   "WW"
  ],
  "chaves": {
   "W": "minecraft:wheat"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_panela_cozinha",
  "resultado": "cl:panela_cozinha",
  "qtd": 1,
  "grade": [
   "bSb",
   "iWi",
   "iii"
  ],
  "chaves": {
   "S": "minecraft:wooden_shovel",
   "W": "minecraft:water_bucket",
   "b": "minecraft:brick",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_parede_camara",
  "resultado": "cl:parede_camara",
  "qtd": 4,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedra_caminho",
  "resultado": "cl:pedra_caminho",
  "qtd": 1,
  "grade": [
   " T ",
   "TWT",
   "OOO"
  ],
  "chaves": {
   "T": "minecraft:stone_bricks",
   "W": "cl:pedra_viagem",
   "O": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedra_liso",
  "resultado": "cl:pedra_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "minecraft:stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedra_viagem",
  "resultado": "cl:pedra_viagem",
  "qtd": 1,
  "grade": [
   " D ",
   "EPE",
   " D "
  ],
  "chaves": {
   "D": "minecraft:purple_dye",
   "E": "minecraft:emerald",
   "P": "minecraft:ender_pearl"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_1",
  "resultado": "cl:pedregulho_comprimido_1",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "minecraft:cobblestone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_2",
  "resultado": "cl:pedregulho_comprimido_2",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_1"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_3",
  "resultado": "cl:pedregulho_comprimido_3",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_2"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_4",
  "resultado": "cl:pedregulho_comprimido_4",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_3"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_5",
  "resultado": "cl:pedregulho_comprimido_5",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_4"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_6",
  "resultado": "cl:pedregulho_comprimido_6",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_5"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_7",
  "resultado": "cl:pedregulho_comprimido_7",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_6"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedregulho_comprimido_8",
  "resultado": "cl:pedregulho_comprimido_8",
  "qtd": 1,
  "grade": [
   "CCC",
   "CCC",
   "CCC"
  ],
  "chaves": {
   "C": "cl:pedregulho_comprimido_7"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pedreira",
  "resultado": "cl:pedreira",
  "qtd": 1,
  "grade": [
   "FRF",
   "GDG",
   "DPD"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "R": "minecraft:redstone",
   "G": "cl:engrenagem_ouro",
   "D": "cl:engrenagem_diamante",
   "P": "minecraft:diamond_pickaxe"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_aco",
  "resultado": "cl:peitoral_placa_aco",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_aco_slime",
  "resultado": "cl:peitoral_placa_aco_slime",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_aco_slime",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_aluminio",
  "resultado": "cl:peitoral_placa_aluminio",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_aluminio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_bronze",
  "resultado": "cl:peitoral_placa_bronze",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_bronze_ametista",
  "resultado": "cl:peitoral_placa_bronze_ametista",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_bronze_ametista",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_cobalto",
  "resultado": "cl:peitoral_placa_cobalto",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_cobalto",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_cobre",
  "resultado": "cl:peitoral_placa_cobre",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_ferro",
  "resultado": "cl:peitoral_placa_ferro",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_ferro_porco",
  "resultado": "cl:peitoral_placa_ferro_porco",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_ferro_porco",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_hepatizon",
  "resultado": "cl:peitoral_placa_hepatizon",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_hepatizon",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_manyullyn",
  "resultado": "cl:peitoral_placa_manyullyn",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_obsidiana",
  "resultado": "cl:peitoral_placa_obsidiana",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_osmio",
  "resultado": "cl:peitoral_placa_osmio",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_osmio",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_ouro",
  "resultado": "cl:peitoral_placa_ouro",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_ouro_rosa",
  "resultado": "cl:peitoral_placa_ouro_rosa",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_ouro_rosa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_pedra_chamuscada",
  "resultado": "cl:peitoral_placa_pedra_chamuscada",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:tijolo_chamuscado",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_pedra_refrataria",
  "resultado": "cl:peitoral_placa_pedra_refrataria",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:tijolo_refratario",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_slime_brasa",
  "resultado": "cl:peitoral_placa_slime_brasa",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_brasa",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_slime_cavaleiro",
  "resultado": "cl:peitoral_placa_slime_cavaleiro",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_cavaleiro",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_placa_slime_rainha",
  "resultado": "cl:peitoral_placa_slime_rainha",
  "qtd": 1,
  "grade": [
   "MLM",
   "MMM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_slime_rainha",
   "L": "cl:malha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_slime",
  "resultado": "cl:peitoral_slime",
  "qtd": 1,
  "grade": [
   "S S",
   "SSS",
   "SSS"
  ],
  "chaves": {
   "S": "cl:slime_congelado_ceu"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_peitoral_viajante",
  "resultado": "cl:peitoral_viajante",
  "qtd": 1,
  "grade": [
   "L L",
   "LCL",
   "LLL"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pepitas_cobalto",
  "resultado": "cl:pepita_cobalto",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:lingote_cobalto",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pergaminho_retorno",
  "resultado": "cl:pergaminho_retorno",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:paper",
    "qtd": 1
   },
   {
    "item": "minecraft:ender_pearl",
    "qtd": 1
   },
   {
    "item": "minecraft:gold_nugget",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pergaminho_viagem",
  "resultado": "cl:pergaminho_viagem",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:paper",
    "qtd": 1
   },
   {
    "item": "minecraft:ender_pearl",
    "qtd": 1
   },
   {
    "item": "minecraft:purple_dye",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_picarango",
  "resultado": "cl:picarango",
  "qtd": 1,
  "grade": [
   " DI",
   "D D",
   "ID "
  ],
  "chaves": {
   "D": "minecraft:diamond",
   "I": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plantadeira",
  "resultado": "cl:plantadeira",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:flower_pot",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_amarelo",
  "resultado": "cl:plastico_amarelo",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:yellow_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_azul",
  "resultado": "cl:plastico_azul",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:blue_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_azul_claro",
  "resultado": "cl:plastico_azul_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:light_blue_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_branco",
  "resultado": "cl:plastico_branco",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:white_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_amarelo",
  "resultado": "cl:plastico_brilhante_amarelo",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_amarelo",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_azul",
  "resultado": "cl:plastico_brilhante_azul",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_azul",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_azul_claro",
  "resultado": "cl:plastico_brilhante_azul_claro",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_azul_claro",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_branco",
  "resultado": "cl:plastico_brilhante_branco",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_branco",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_ciano",
  "resultado": "cl:plastico_brilhante_ciano",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_ciano",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_cinza",
  "resultado": "cl:plastico_brilhante_cinza",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_cinza",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_cinza_claro",
  "resultado": "cl:plastico_brilhante_cinza_claro",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_cinza_claro",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_laranja",
  "resultado": "cl:plastico_brilhante_laranja",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_laranja",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_lima",
  "resultado": "cl:plastico_brilhante_lima",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_lima",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_magenta",
  "resultado": "cl:plastico_brilhante_magenta",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_magenta",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_marrom",
  "resultado": "cl:plastico_brilhante_marrom",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_marrom",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_preto",
  "resultado": "cl:plastico_brilhante_preto",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_preto",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_rosa",
  "resultado": "cl:plastico_brilhante_rosa",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_rosa",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_roxo",
  "resultado": "cl:plastico_brilhante_roxo",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_roxo",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_verde",
  "resultado": "cl:plastico_brilhante_verde",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_verde",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_brilhante_vermelho",
  "resultado": "cl:plastico_brilhante_vermelho",
  "qtd": 3,
  "ingredientes": [
   {
    "item": "cl:plastico_vermelho",
    "qtd": 3
   },
   {
    "item": "minecraft:glowstone_dust",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_ciano",
  "resultado": "cl:plastico_ciano",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:cyan_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_cinza",
  "resultado": "cl:plastico_cinza",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:gray_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_cinza_claro",
  "resultado": "cl:plastico_cinza_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:light_gray_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_cru",
  "resultado": "cl:plastico_cru",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:barra_borracha",
    "qtd": 2
   },
   {
    "item": "minecraft:coal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_plastico_cru_carvao_vegetal",
  "resultado": "cl:plastico_cru",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:barra_borracha",
    "qtd": 2
   },
   {
    "item": "minecraft:charcoal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_laranja",
  "resultado": "cl:plastico_laranja",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:orange_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_lima",
  "resultado": "cl:plastico_lima",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:lime_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_amarelo",
  "resultado": "cl:plastico_liso_amarelo",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_amarelo",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_azul",
  "resultado": "cl:plastico_liso_azul",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_azul",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_azul_claro",
  "resultado": "cl:plastico_liso_azul_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_azul_claro",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_branco",
  "resultado": "cl:plastico_liso_branco",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_branco",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_ciano",
  "resultado": "cl:plastico_liso_ciano",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_ciano",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_cinza",
  "resultado": "cl:plastico_liso_cinza",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_cinza",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_cinza_claro",
  "resultado": "cl:plastico_liso_cinza_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_cinza_claro",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_laranja",
  "resultado": "cl:plastico_liso_laranja",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_laranja",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_lima",
  "resultado": "cl:plastico_liso_lima",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_lima",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_magenta",
  "resultado": "cl:plastico_liso_magenta",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_magenta",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_marrom",
  "resultado": "cl:plastico_liso_marrom",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_marrom",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_preto",
  "resultado": "cl:plastico_liso_preto",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_preto",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_rosa",
  "resultado": "cl:plastico_liso_rosa",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_rosa",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_roxo",
  "resultado": "cl:plastico_liso_roxo",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_roxo",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_verde",
  "resultado": "cl:plastico_liso_verde",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_verde",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_liso_vermelho",
  "resultado": "cl:plastico_liso_vermelho",
  "qtd": 4,
  "grade": [
   " # ",
   "#S#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_vermelho",
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_magenta",
  "resultado": "cl:plastico_magenta",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:magenta_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_marrom",
  "resultado": "cl:plastico_marrom",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:brown_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_preto",
  "resultado": "cl:plastico_preto",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:black_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_amarelo",
  "resultado": "cl:plastico_reforcado_amarelo",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_amarelo",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_azul",
  "resultado": "cl:plastico_reforcado_azul",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_azul",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_azul_claro",
  "resultado": "cl:plastico_reforcado_azul_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_azul_claro",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_branco",
  "resultado": "cl:plastico_reforcado_branco",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_branco",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_ciano",
  "resultado": "cl:plastico_reforcado_ciano",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_ciano",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_cinza",
  "resultado": "cl:plastico_reforcado_cinza",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_cinza",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_cinza_claro",
  "resultado": "cl:plastico_reforcado_cinza_claro",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_cinza_claro",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_laranja",
  "resultado": "cl:plastico_reforcado_laranja",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_laranja",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_lima",
  "resultado": "cl:plastico_reforcado_lima",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_lima",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_magenta",
  "resultado": "cl:plastico_reforcado_magenta",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_magenta",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_marrom",
  "resultado": "cl:plastico_reforcado_marrom",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_marrom",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_preto",
  "resultado": "cl:plastico_reforcado_preto",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_preto",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_rosa",
  "resultado": "cl:plastico_reforcado_rosa",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_rosa",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_roxo",
  "resultado": "cl:plastico_reforcado_roxo",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_roxo",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_verde",
  "resultado": "cl:plastico_reforcado_verde",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_verde",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_reforcado_vermelho",
  "resultado": "cl:plastico_reforcado_vermelho",
  "qtd": 4,
  "grade": [
   " # ",
   "#O#",
   " # "
  ],
  "chaves": {
   "#": "cl:plastico_vermelho",
   "O": "cl:po_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_rosa",
  "resultado": "cl:plastico_rosa",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:pink_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_roxo",
  "resultado": "cl:plastico_roxo",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:purple_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_verde",
  "resultado": "cl:plastico_verde",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:green_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plastico_vermelho",
  "resultado": "cl:plastico_vermelho",
  "qtd": 4,
  "grade": [
   " # ",
   "#D#",
   " # "
  ],
  "chaves": {
   "#": "cl:folha_plastico",
   "D": "minecraft:red_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_plataforma_lancamento",
  "resultado": "cl:plataforma_lancamento",
  "qtd": 9,
  "grade": [
   "YYY",
   "XXX"
  ],
  "chaves": {
   "X": "minecraft:iron_block",
   "Y": "cl:placa_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_po_cobre",
  "resultado": "minecraft:copper_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_cobre",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_po_estanho",
  "resultado": "cl:lingote_estanho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_estanho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_po_ferro",
  "resultado": "minecraft:iron_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_ferro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_po_ouro",
  "resultado": "minecraft:gold_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_ouro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_porta_acesso_reator",
  "resultado": "cl:porta_acesso_reator",
  "qtd": 1,
  "grade": [
   "C",
   "H",
   "C"
  ],
  "chaves": {
   "C": "cl:carcaca_reator",
   "H": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_porta_refrigeracao",
  "resultado": "cl:porta_refrigeracao",
  "qtd": 1,
  "grade": [
   "C",
   "B",
   "C"
  ],
  "chaves": {
   "C": "cl:carcaca_reator",
   "B": "minecraft:bucket"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_prateleira",
  "resultado": "cl:prateleira",
  "qtd": 1,
  "grade": [
   "SSS",
   "P P",
   "SSS"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "S": "minecraft:oak_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_precipitador_glacial",
  "resultado": "cl:precipitador_glacial",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:packed_ice",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_prensa_mecanica",
  "resultado": "cl:prensa_mecanica",
  "qtd": 1,
  "grade": [
   "E",
   "R",
   "I"
  ],
  "chaves": {
   "E": "cl:eixo",
   "R": "cl:revestimento_andesita",
   "I": "minecraft:iron_block"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pulverizador",
  "resultado": "cl:pulverizador",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:piston",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_aerial_pearl",
  "resultado": "cl:perola_aerea",
  "qtd": 1,
  "grade": [
   "pbp",
   "beb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "e": "minecraft:ender_pearl",
   "b": "minecraft:iron_bars"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_basic",
  "resultado": "cl:bateria_pw_basico",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_inicial",
   "i": "cl:capacitor_pw_grande",
   "o": "cl:pasta_dieletrica",
   "k": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_blazing",
  "resultado": "cl:bateria_pw_ardente",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_endurecido",
   "i": "cl:capacitor_pw_ardente",
   "o": "cl:pasta_dieletrica",
   "k": "cl:cristal_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_hardened",
  "resultado": "cl:bateria_pw_endurecido",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_basico",
   "i": "cl:capacitor_pw_endurecido",
   "o": "cl:pasta_dieletrica",
   "k": "cl:aco_energizado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_niotic",
  "resultado": "cl:bateria_pw_niotico",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_ardente",
   "i": "cl:capacitor_pw_niotico",
   "o": "cl:pasta_dieletrica",
   "k": "cl:cristal_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_nitro",
  "resultado": "cl:bateria_pw_nitro",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_espiritual",
   "i": "cl:capacitor_pw_nitro",
   "o": "cl:pasta_dieletrica",
   "k": "cl:cristal_nitro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_spirited",
  "resultado": "cl:bateria_pw_espiritual",
  "qtd": 1,
  "grade": [
   "oko",
   "iri",
   "oco"
  ],
  "chaves": {
   "r": "minecraft:redstone_block",
   "c": "cl:bateria_pw_niotico",
   "i": "cl:capacitor_pw_espiritual",
   "o": "cl:pasta_dieletrica",
   "k": "cl:cristal_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_battery_starter",
  "resultado": "cl:bateria_pw_inicial",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "minecraft:redstone_block",
   "i": "cl:capacitor_pw_basico",
   "o": "cl:pasta_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_binding_card",
  "resultado": "cl:cartao_vinculo",
  "qtd": 1,
  "grade": [
   "br",
   "rf"
  ],
  "chaves": {
   "b": "cl:cartao_branco",
   "r": "minecraft:redstone",
   "f": "minecraft:rotten_flesh"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_blank_card",
  "resultado": "cl:cartao_branco",
  "qtd": 1,
  "grade": [
   "p",
   "p"
  ],
  "chaves": {
   "p": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_blank_card_2",
  "resultado": "cl:cartao_branco",
  "qtd": 1,
  "grade": [
   "pp"
  ],
  "chaves": {
   "p": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_blazing_crystal_block",
  "resultado": "cl:bloco_cristal_ardente",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cristal_ardente",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_basic",
  "resultado": "cl:cabo_powah_basico",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_basico",
   "t": "cl:cabo_powah_inicial"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_basic_2",
  "resultado": "cl:cabo_powah_basico",
  "qtd": 12,
  "grade": [
   "ddd",
   "ici",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_basico",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_blazing",
  "resultado": "cl:cabo_powah_ardente",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_ardente",
   "t": "cl:cabo_powah_endurecido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_blazing_2",
  "resultado": "cl:cabo_powah_ardente",
  "qtd": 12,
  "grade": [
   "ddd",
   "kck",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_ardente",
   "k": "cl:cristal_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_hardened",
  "resultado": "cl:cabo_powah_endurecido",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_endurecido",
   "t": "cl:cabo_powah_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_hardened_2",
  "resultado": "cl:cabo_powah_endurecido",
  "qtd": 12,
  "grade": [
   "ddd",
   "kck",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_endurecido",
   "k": "cl:aco_energizado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_niotic",
  "resultado": "cl:cabo_powah_niotico",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_niotico",
   "t": "cl:cabo_powah_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_niotic_2",
  "resultado": "cl:cabo_powah_niotico",
  "qtd": 12,
  "grade": [
   "ddd",
   "kck",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_niotico",
   "k": "cl:cristal_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_nitro",
  "resultado": "cl:cabo_powah_nitro",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_nitro",
   "t": "cl:cabo_powah_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_nitro_2",
  "resultado": "cl:cabo_powah_nitro",
  "qtd": 12,
  "grade": [
   "ddd",
   "kck",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_nitro",
   "k": "cl:cristal_nitro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_spirited",
  "resultado": "cl:cabo_powah_espiritual",
  "qtd": 6,
  "grade": [
   "ddd",
   "tct",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_espiritual",
   "t": "cl:cabo_powah_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_spirited_2",
  "resultado": "cl:cabo_powah_espiritual",
  "qtd": 12,
  "grade": [
   "ddd",
   "kck",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "c": "cl:capacitor_pw_espiritual",
   "k": "cl:cristal_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_cable_starter",
  "resultado": "cl:cabo_powah_inicial",
  "qtd": 12,
  "grade": [
   "ddd",
   "iti",
   "ddd"
  ],
  "chaves": {
   "d": "cl:haste_dieletrica",
   "i": "minecraft:iron_nugget",
   "t": "cl:capacitor_pw_minusculo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_basic",
  "resultado": "cl:capacitor_pw_basico",
  "qtd": 4,
  "grade": [
   " ip",
   "iri",
   "pi "
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "i": "minecraft:iron_ingot",
   "r": "minecraft:redstone_block"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_capacitor_basic_large",
  "resultado": "cl:capacitor_pw_grande",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:capacitor_pw_basico",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_capacitor_basic_tiny",
  "resultado": "cl:capacitor_pw_minusculo",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:capacitor_pw_basico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_blazing",
  "resultado": "cl:capacitor_pw_ardente",
  "qtd": 2,
  "grade": [
   "pbp",
   "bcb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "c": "cl:capacitor_pw_grande",
   "b": "cl:cristal_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_hardened",
  "resultado": "cl:capacitor_pw_endurecido",
  "qtd": 2,
  "grade": [
   "pbp",
   "bcb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "c": "cl:capacitor_pw_grande",
   "b": "cl:aco_energizado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_niotic",
  "resultado": "cl:capacitor_pw_niotico",
  "qtd": 1,
  "grade": [
   "pbp",
   "bcb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "c": "cl:capacitor_pw_grande",
   "b": "cl:cristal_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_nitro",
  "resultado": "cl:capacitor_pw_nitro",
  "qtd": 1,
  "grade": [
   "pbp",
   "bcb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "c": "cl:capacitor_pw_grande",
   "b": "cl:cristal_nitro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_capacitor_spirited",
  "resultado": "cl:capacitor_pw_espiritual",
  "qtd": 1,
  "grade": [
   "pbp",
   "bcb",
   "pbp"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "c": "cl:capacitor_pw_grande",
   "b": "cl:cristal_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_crystal_blazing",
  "resultado": "cl:cristal_ardente",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cristal_ardente",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_crystal_niotic",
  "resultado": "cl:cristal_niotico",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cristal_niotico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_crystal_nitro",
  "resultado": "cl:cristal_nitro",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cristal_nitro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_crystal_spirited",
  "resultado": "cl:cristal_espiritual",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_cristal_espiritual",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_dielectric_casing",
  "resultado": "cl:involucro_dieletrico",
  "qtd": 1,
  "grade": [
   "ihi",
   "v v",
   "ihi"
  ],
  "chaves": {
   "v": "cl:haste_dieletrica",
   "h": "cl:haste_dieletrica",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_dielectric_paste",
  "resultado": "cl:pasta_dieletrica",
  "qtd": 24,
  "ingredientes": [
   {
    "item": "#minecraft:coals",
    "qtd": 3
   },
   {
    "item": "minecraft:clay_ball",
    "qtd": 2
   },
   {
    "item": "minecraft:lava_bucket",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_dielectric_paste_2",
  "resultado": "cl:pasta_dieletrica",
  "qtd": 16,
  "ingredientes": [
   {
    "item": "#minecraft:coals",
    "qtd": 2
   },
   {
    "item": "minecraft:clay_ball",
    "qtd": 1
   },
   {
    "item": "minecraft:blaze_powder",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_dielectric_rod",
  "resultado": "cl:haste_dieletrica",
  "qtd": 8,
  "grade": [
   "pip",
   "pip",
   "pip"
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "i": "minecraft:iron_bars"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_dielectric_rod_2",
  "resultado": "cl:haste_dieletrica",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:haste_dieletrica",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_basic",
  "resultado": "cl:celula_ender_basico",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "minecraft:iron_ingot",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_basic_2",
  "resultado": "cl:celula_ender_basico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_basico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_blazing",
  "resultado": "cl:celula_ender_ardente",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cristal_ardente",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_blazing_2",
  "resultado": "cl:celula_ender_ardente",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_ardente",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_hardened",
  "resultado": "cl:celula_ender_endurecido",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:aco_energizado",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_hardened_2",
  "resultado": "cl:celula_ender_endurecido",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_endurecido",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_niotic",
  "resultado": "cl:celula_ender_niotico",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cristal_niotico",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_niotic_2",
  "resultado": "cl:celula_ender_niotico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_niotico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_nitro",
  "resultado": "cl:celula_ender_nitro",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cristal_nitro",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_nitro_2",
  "resultado": "cl:celula_ender_nitro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_nitro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_spirited",
  "resultado": "cl:celula_ender_espiritual",
  "qtd": 1,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cristal_espiritual",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_spirited_2",
  "resultado": "cl:celula_ender_espiritual",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_espiritual",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_cell_starter",
  "resultado": "cl:celula_ender_inicial",
  "qtd": 2,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "minecraft:iron_nugget",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_cell_starter_2",
  "resultado": "cl:celula_ender_inicial",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:celula_ender_inicial",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_basic",
  "resultado": "cl:portao_ender_basico",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_basico",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_basic_2",
  "resultado": "cl:portao_ender_basico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_basico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_blazing",
  "resultado": "cl:portao_ender_ardente",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_ardente",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_blazing_2",
  "resultado": "cl:portao_ender_ardente",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_ardente",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_hardened",
  "resultado": "cl:portao_ender_endurecido",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_endurecido",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_hardened_2",
  "resultado": "cl:portao_ender_endurecido",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_endurecido",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_niotic",
  "resultado": "cl:portao_ender_niotico",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_niotico",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_niotic_2",
  "resultado": "cl:portao_ender_niotico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_niotico",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_nitro",
  "resultado": "cl:portao_ender_nitro",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_nitro",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_nitro_2",
  "resultado": "cl:portao_ender_nitro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_nitro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_spirited",
  "resultado": "cl:portao_ender_espiritual",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_espiritual",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_spirited_2",
  "resultado": "cl:portao_ender_espiritual",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_espiritual",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_ender_gate_starter",
  "resultado": "cl:portao_ender_inicial",
  "qtd": 4,
  "grade": [
   "oio",
   "ici",
   "oio"
  ],
  "chaves": {
   "c": "cl:nucleo_ender",
   "i": "cl:cabo_powah_inicial",
   "o": "minecraft:obsidian"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_ender_gate_starter_2",
  "resultado": "cl:portao_ender_inicial",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:portao_ender_inicial",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_energized_steel_block",
  "resultado": "cl:bloco_aco_energizado",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:aco_energizado",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_orb",
  "resultado": "cl:orbe_energizador",
  "qtd": 1,
  "grade": [
   "ggg",
   "gcg",
   "rrr"
  ],
  "chaves": {
   "r": "cl:haste_dieletrica",
   "g": "minecraft:glass",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_basic",
  "resultado": "cl:haste_energizadora_basico",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "h": "cl:haste_energizadora_inicial",
   "b": "cl:capacitor_pw_basico",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_blazing",
  "resultado": "cl:haste_energizadora_ardente",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "h": "cl:haste_energizadora_endurecido",
   "b": "cl:capacitor_pw_ardente",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_hardened",
  "resultado": "cl:haste_energizadora_endurecido",
  "qtd": 1,
  "grade": [
   " q ",
   "hch",
   " e "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "e": "cl:haste_energizadora_basico",
   "h": "cl:capacitor_pw_endurecido",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_niotic",
  "resultado": "cl:haste_energizadora_niotico",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "h": "cl:haste_energizadora_ardente",
   "b": "cl:capacitor_pw_niotico",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_nitro",
  "resultado": "cl:haste_energizadora_nitro",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "h": "cl:haste_energizadora_espiritual",
   "b": "cl:capacitor_pw_nitro",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_spirited",
  "resultado": "cl:haste_energizadora_espiritual",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz_block",
   "h": "cl:haste_energizadora_niotico",
   "b": "cl:capacitor_pw_espiritual",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energizing_rod_starter",
  "resultado": "cl:haste_energizadora_inicial",
  "qtd": 1,
  "grade": [
   " q ",
   "bcb",
   " h "
  ],
  "chaves": {
   "q": "minecraft:quartz",
   "h": "cl:haste_dieletrica",
   "b": "cl:capacitor_pw_minusculo",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_basic",
  "resultado": "cl:celula_powah_basico",
  "qtd": 1,
  "grade": [
   "ici",
   "cdc",
   "ici"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "i": "minecraft:iron_ingot",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_basic_2",
  "resultado": "cl:celula_powah_basico",
  "qtd": 1,
  "grade": [
   "iii",
   "cdc",
   "iii"
  ],
  "chaves": {
   "c": "cl:celula_powah_inicial",
   "i": "minecraft:iron_ingot",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_blazing",
  "resultado": "cl:celula_powah_ardente",
  "qtd": 1,
  "grade": [
   "bgb",
   "cdc",
   "bgb"
  ],
  "chaves": {
   "c": "cl:celula_powah_endurecido",
   "g": "cl:capacitor_pw_ardente",
   "b": "cl:cristal_ardente",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_hardened",
  "resultado": "cl:celula_powah_endurecido",
  "qtd": 1,
  "grade": [
   "ghg",
   "cdc",
   "ghg"
  ],
  "chaves": {
   "h": "cl:capacitor_pw_endurecido",
   "c": "cl:celula_powah_basico",
   "g": "cl:aco_energizado",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_niotic",
  "resultado": "cl:celula_powah_niotico",
  "qtd": 1,
  "grade": [
   "bnb",
   "cdc",
   "bnb"
  ],
  "chaves": {
   "c": "cl:celula_powah_ardente",
   "n": "cl:capacitor_pw_niotico",
   "b": "cl:cristal_niotico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_nitro",
  "resultado": "cl:celula_powah_nitro",
  "qtd": 1,
  "grade": [
   "bnb",
   "cdc",
   "bnb"
  ],
  "chaves": {
   "c": "cl:celula_powah_espiritual",
   "n": "cl:capacitor_pw_nitro",
   "b": "cl:cristal_nitro",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_spirited",
  "resultado": "cl:celula_powah_espiritual",
  "qtd": 1,
  "grade": [
   "bnb",
   "cdc",
   "bnb"
  ],
  "chaves": {
   "c": "cl:celula_powah_niotico",
   "n": "cl:capacitor_pw_espiritual",
   "b": "cl:cristal_espiritual",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_cell_starter",
  "resultado": "cl:celula_powah_inicial",
  "qtd": 1,
  "grade": [
   "ici",
   "cdc",
   "ici"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "i": "minecraft:iron_ingot",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_basic",
  "resultado": "cl:descarregador_basico",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_blazing",
  "resultado": "cl:descarregador_ardente",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_hardened",
  "resultado": "cl:descarregador_endurecido",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_niotic",
  "resultado": "cl:descarregador_niotico",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_nitro",
  "resultado": "cl:descarregador_nitro",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_spirited",
  "resultado": "cl:descarregador_espiritual",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_discharger_starter",
  "resultado": "cl:descarregador_inicial",
  "qtd": 1,
  "grade": [
   "pcp",
   "pdp",
   "pcp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_basic",
  "resultado": "cl:funil_energia_basico",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_inicial"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_blazing",
  "resultado": "cl:funil_energia_ardente",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_endurecido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_hardened",
  "resultado": "cl:funil_energia_endurecido",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_niotic",
  "resultado": "cl:funil_energia_niotico",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_nitro",
  "resultado": "cl:funil_energia_nitro",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_spirited",
  "resultado": "cl:funil_energia_espiritual",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "cl:funil_energia_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_energy_hopper_starter",
  "resultado": "cl:funil_energia_inicial",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "php"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "p": "cl:pasta_dieletrica",
   "d": "cl:involucro_dieletrico",
   "h": "minecraft:hopper"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_basic",
  "resultado": "cl:furnator_basico",
  "qtd": 1,
  "grade": [
   "iii",
   "cdc",
   "ifi"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "i": "minecraft:iron_ingot",
   "f": "cl:furnator_inicial",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_blazing",
  "resultado": "cl:furnator_ardente",
  "qtd": 1,
  "grade": [
   "bbb",
   "cdc",
   "bfb"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "b": "cl:cristal_ardente",
   "f": "cl:furnator_endurecido",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_hardened",
  "resultado": "cl:furnator_endurecido",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "g": "cl:aco_energizado",
   "f": "cl:furnator_basico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_niotic",
  "resultado": "cl:furnator_niotico",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "g": "cl:cristal_niotico",
   "f": "cl:furnator_ardente",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_nitro",
  "resultado": "cl:furnator_nitro",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "g": "cl:cristal_nitro",
   "f": "cl:furnator_espiritual",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_spirited",
  "resultado": "cl:furnator_espiritual",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "g": "cl:cristal_espiritual",
   "f": "cl:furnator_niotico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_furnator_starter",
  "resultado": "cl:furnator_inicial",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "g": "cl:pasta_dieletrica",
   "f": "minecraft:furnace",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_basic",
  "resultado": "cl:magmator_basico",
  "qtd": 1,
  "grade": [
   "iii",
   "cdc",
   "ifi"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "i": "minecraft:iron_ingot",
   "f": "cl:magmator_inicial",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_blazing",
  "resultado": "cl:magmator_ardente",
  "qtd": 1,
  "grade": [
   "bbb",
   "cdc",
   "bfb"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "b": "cl:cristal_ardente",
   "f": "cl:magmator_endurecido",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_hardened",
  "resultado": "cl:magmator_endurecido",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "g": "cl:aco_energizado",
   "f": "cl:magmator_basico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_niotic",
  "resultado": "cl:magmator_niotico",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "g": "cl:cristal_niotico",
   "f": "cl:magmator_ardente",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_nitro",
  "resultado": "cl:magmator_nitro",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "g": "cl:cristal_nitro",
   "f": "cl:magmator_espiritual",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_spirited",
  "resultado": "cl:magmator_espiritual",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "g": "cl:cristal_espiritual",
   "f": "cl:magmator_niotico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_magmator_starter",
  "resultado": "cl:magmator_inicial",
  "qtd": 1,
  "grade": [
   "ggg",
   "cdc",
   "gfg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "g": "cl:pasta_dieletrica",
   "f": "minecraft:bucket",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_manual",
  "resultado": "cl:livro_powah",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pasta_dieletrica",
    "qtd": 1
   },
   {
    "item": "minecraft:book",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_niotic_crystal_block",
  "resultado": "cl:bloco_cristal_niotico",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cristal_niotico",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_nitro_crystal_block",
  "resultado": "cl:bloco_cristal_nitro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cristal_nitro",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_photoelectric_pane",
  "resultado": "cl:painel_fotoeletrico",
  "qtd": 1,
  "grade": [
   "dld",
   "lpl",
   "dld"
  ],
  "chaves": {
   "p": "minecraft:glass_pane",
   "l": "minecraft:lapis_lazuli",
   "d": "cl:pasta_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_basic",
  "resultado": "cl:transmissor_basico",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_inicial",
   "i": "cl:capacitor_pw_basico",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_blazing",
  "resultado": "cl:transmissor_ardente",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_endurecido",
   "i": "cl:capacitor_pw_ardente",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_hardened",
  "resultado": "cl:transmissor_endurecido",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_basico",
   "i": "cl:capacitor_pw_endurecido",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_niotic",
  "resultado": "cl:transmissor_niotico",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_ardente",
   "i": "cl:capacitor_pw_niotico",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_nitro",
  "resultado": "cl:transmissor_nitro",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_espiritual",
   "i": "cl:capacitor_pw_nitro",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_spirited",
  "resultado": "cl:transmissor_espiritual",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:transmissor_niotico",
   "i": "cl:capacitor_pw_espiritual",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_player_tranmitter_starter",
  "resultado": "cl:transmissor_inicial",
  "qtd": 1,
  "grade": [
   " p ",
   "ici",
   " r "
  ],
  "chaves": {
   "p": "cl:perola_aerea_jogador",
   "i": "cl:capacitor_pw_minusculo",
   "c": "cl:involucro_dieletrico",
   "r": "cl:haste_dieletrica"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_basic",
  "resultado": "cl:reator_basico",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_grande",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_blazing",
  "resultado": "cl:reator_ardente",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_ardente",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_hardened",
  "resultado": "cl:reator_endurecido",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_endurecido",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_niotic",
  "resultado": "cl:reator_niotico",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_niotico",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_nitro",
  "resultado": "cl:reator_nitro",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_nitro",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_spirited",
  "resultado": "cl:reator_espiritual",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_espiritual",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_reactor_starter",
  "resultado": "cl:reator_inicial",
  "qtd": 4,
  "grade": [
   "ulu",
   "lcl",
   "ulu"
  ],
  "chaves": {
   "u": "cl:uraninita",
   "l": "cl:capacitor_pw_minusculo",
   "c": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_basic",
  "resultado": "cl:painel_solar_basico",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "iii"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "i": "minecraft:iron_ingot",
   "p": "cl:painel_solar_inicial",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_blazing",
  "resultado": "cl:painel_solar_ardente",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "bbb"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "b": "cl:cristal_ardente",
   "p": "cl:painel_solar_endurecido",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_hardened",
  "resultado": "cl:painel_solar_endurecido",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "ggg"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "g": "cl:aco_energizado",
   "p": "cl:painel_solar_basico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_niotic",
  "resultado": "cl:painel_solar_niotico",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "bbb"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "b": "cl:cristal_niotico",
   "p": "cl:painel_solar_ardente",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_nitro",
  "resultado": "cl:painel_solar_nitro",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "eee"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "e": "cl:cristal_nitro",
   "p": "cl:painel_solar_espiritual",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_spirited",
  "resultado": "cl:painel_solar_espiritual",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "eee"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "e": "cl:cristal_espiritual",
   "p": "cl:painel_solar_niotico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_solar_panel_starter",
  "resultado": "cl:painel_solar_inicial",
  "qtd": 1,
  "grade": [
   "ppp",
   "cdc",
   "eee"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "e": "cl:pasta_dieletrica",
   "p": "cl:painel_fotoeletrico",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_spirited_crystal_block",
  "resultado": "cl:bloco_cristal_espiritual",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cristal_espiritual",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_steel_energized",
  "resultado": "cl:aco_energizado",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_aco_energizado",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_basic",
  "resultado": "cl:termogerador_basico",
  "qtd": 1,
  "grade": [
   "eie",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_basico",
   "e": "cl:pasta_dieletrica",
   "i": "minecraft:iron_ingot",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_inicial"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_blazing",
  "resultado": "cl:termogerador_ardente",
  "qtd": 1,
  "grade": [
   "igi",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_ardente",
   "i": "cl:pasta_dieletrica",
   "g": "cl:cristal_ardente",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_endurecido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_hardened",
  "resultado": "cl:termogerador_endurecido",
  "qtd": 1,
  "grade": [
   "igi",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_endurecido",
   "i": "cl:pasta_dieletrica",
   "g": "cl:aco_energizado",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_niotic",
  "resultado": "cl:termogerador_niotico",
  "qtd": 1,
  "grade": [
   "igi",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_niotico",
   "i": "cl:pasta_dieletrica",
   "g": "cl:cristal_niotico",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_ardente"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_nitro",
  "resultado": "cl:termogerador_nitro",
  "qtd": 1,
  "grade": [
   "igi",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_nitro",
   "i": "cl:pasta_dieletrica",
   "g": "cl:cristal_nitro",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_espiritual"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_spirited",
  "resultado": "cl:termogerador_espiritual",
  "qtd": 1,
  "grade": [
   "igi",
   "cdc",
   "ptp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_espiritual",
   "i": "cl:pasta_dieletrica",
   "g": "cl:cristal_espiritual",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico",
   "t": "cl:termogerador_niotico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermo_generator_starter",
  "resultado": "cl:termogerador_inicial",
  "qtd": 1,
  "grade": [
   "iii",
   "cdc",
   "ppp"
  ],
  "chaves": {
   "c": "cl:capacitor_pw_minusculo",
   "i": "cl:pasta_dieletrica",
   "p": "cl:placa_termoeletrica",
   "d": "cl:involucro_dieletrico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_thermoelectric_plate",
  "resultado": "cl:placa_termoeletrica",
  "qtd": 1,
  "grade": [
   "brb",
   "rtr",
   "brb"
  ],
  "chaves": {
   "b": "minecraft:blaze_powder",
   "r": "minecraft:redstone",
   "t": "cl:capacitor_pw_minusculo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_pw_uraninita_forno",
  "resultado": "cl:uraninita",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite",
  "resultado": "cl:uraninita",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:bloco_uraninita",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_block",
  "resultado": "cl:bloco_uraninita",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:uraninita",
    "qtd": 9
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_dense_from_poor",
  "resultado": "cl:uraninita_bruta_densa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta_pobre",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_dense_from_raw",
  "resultado": "cl:uraninita_bruta_densa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_dense_to_poor",
  "resultado": "cl:uraninita_bruta_pobre",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta_densa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_from_dense",
  "resultado": "cl:uraninita_bruta",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta_densa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_from_poor",
  "resultado": "cl:uraninita_bruta",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta_pobre",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_pw_uraninite_raw_to_poor",
  "resultado": "cl:uraninita_bruta_pobre",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:uraninita_bruta",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_pw_wrench",
  "resultado": "cl:chave_powah",
  "qtd": 1,
  "grade": [
   " ip",
   " pi",
   "p  "
  ],
  "chaves": {
   "p": "cl:pasta_dieletrica",
   "i": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_quadricoptero",
  "resultado": "cl:quadricoptero",
  "qtd": 1,
  "grade": [
   "PBP",
   "BEB",
   "PBP"
  ],
  "chaves": {
   "E": "cl:motor_aeronave",
   "B": "minecraft:bamboo",
   "P": "cl:helice_aviao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_quebrador_blocos",
  "resultado": "cl:quebrador_blocos",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:iron_pickaxe",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_queijo_lunar",
  "resultado": "cl:coalhada_queijo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:minerio_queijo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_rancheiro",
  "resultado": "cl:rancheiro",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:shears",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_refinaria",
  "resultado": "cl:refinaria",
  "qtd": 1,
  "grade": [
   "VGV",
   "CEC",
   "VGV"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "G": "cl:engrenagem_ouro",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_regador",
  "resultado": "cl:regador",
  "qtd": 1,
  "grade": [
   "S  ",
   "SBS",
   " S "
  ],
  "chaves": {
   "S": "minecraft:stone",
   "B": "minecraft:bowl"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_repolho_de_folhas",
  "resultado": "cl:repolho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:folha_repolho",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_reprocessador_cianita",
  "resultado": "cl:reprocessador_cianita",
  "qtd": 1,
  "grade": [
   " B ",
   "KEK",
   " R "
  ],
  "chaves": {
   "B": "minecraft:bucket",
   "K": "cl:capacitor",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_respiro_oxigenio",
  "resultado": "cl:respiro_oxigenio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:placa_estanho",
    "qtd": 3
   },
   {
    "item": "cl:placa_aco",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_revestimento_aco",
  "resultado": "cl:revestimento_aco",
  "qtd": 1,
  "grade": [
   "SGS",
   "GPG",
   "SGS"
  ],
  "chaves": {
   "S": "cl:lingote_aco",
   "G": "minecraft:glass",
   "P": "cl:lingote_osmio"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_revestimento_andesita",
  "resultado": "cl:revestimento_andesita",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:liga_andesita",
    "qtd": 1
   },
   {
    "item": "#minecraft:logs",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_robo_minerador",
  "resultado": "cl:robo_minerador",
  "qtd": 1,
  "grade": [
   "FPF",
   "FCF",
   "FBF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "P": "minecraft:diamond_pickaxe",
   "C": "cl:computador",
   "B": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_roda_hidraulica",
  "resultado": "cl:roda_hidraulica",
  "qtd": 1,
  "grade": [
   " p ",
   "pip",
   " p "
  ],
  "chaves": {
   "p": "cl:segmento_roda",
   "i": "cl:lingote_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_rodas_trituradoras",
  "resultado": "cl:rodas_trituradoras",
  "qtd": 1,
  "grade": [
   " A ",
   "ASA",
   " A "
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "S": "minecraft:stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_saco_arroz",
  "resultado": "cl:saco_arroz",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "cl:arroz"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_saco_arroz_desfazer",
  "resultado": "cl:arroz",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:saco_arroz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_saco_bagas",
  "resultado": "cl:saco_bagas",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:sweet_berries"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_saco_bagas_desfazer",
  "resultado": "minecraft:sweet_berries",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:saco_bagas",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_saco_cacau",
  "resultado": "cl:saco_cacau",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:cocoa_beans"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_saco_cacau_desfazer",
  "resultado": "minecraft:cocoa_beans",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:saco_cacau",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_saco_dormir",
  "resultado": "cl:saco_dormir",
  "qtd": 1,
  "grade": [
   "CCC",
   "LLL"
  ],
  "chaves": {
   "C": "minecraft:leather",
   "L": "minecraft:string"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_saco_polvora",
  "resultado": "cl:saco_polvora",
  "qtd": 1,
  "grade": [
   "###",
   "###",
   "###"
  ],
  "chaves": {
   "#": "minecraft:gunpowder"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_saco_polvora_desfazer",
  "resultado": "minecraft:gunpowder",
  "qtd": 9,
  "ingredientes": [
   {
    "item": "cl:saco_polvora",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_salada_frutas",
  "resultado": "cl:salada_frutas",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:apple",
    "qtd": 1
   },
   {
    "item": "minecraft:melon_slice",
    "qtd": 2
   },
   {
    "item": "minecraft:sweet_berries",
    "qtd": 2
   },
   {
    "item": "cl:fatia_abobora",
    "qtd": 1
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_salada_mista",
  "resultado": "cl:salada_mista",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:repolho",
    "qtd": 1
   },
   {
    "item": "cl:tomate",
    "qtd": 1
   },
   {
    "item": "minecraft:beetroot",
    "qtd": 1
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_salmao_grelhado",
  "resultado": "cl:salmao_grelhado",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:cooked_salmon",
    "qtd": 1
   },
   {
    "item": "minecraft:sweet_berries",
    "qtd": 1
   },
   {
    "item": "minecraft:bowl",
    "qtd": 1
   },
   {
    "item": "cl:repolho",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_sanduiche_bacon",
  "resultado": "cl:sanduiche_bacon",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bread",
    "qtd": 1
   },
   {
    "item": "cl:bacon_cozido",
    "qtd": 1
   },
   {
    "item": "cl:repolho",
    "qtd": 1
   },
   {
    "item": "cl:tomate",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_sanduiche_frango",
  "resultado": "cl:sanduiche_frango",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bread",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_chicken",
    "qtd": 1
   },
   {
    "item": "cl:repolho",
    "qtd": 1
   },
   {
    "item": "minecraft:carrot",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_sanduiche_ovo",
  "resultado": "cl:sanduiche_ovo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bread",
    "qtd": 1
   },
   {
    "item": "cl:ovo_frito",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_segmento_roda",
  "resultado": "cl:segmento_roda",
  "qtd": 1,
  "grade": [
   " s ",
   "sbs",
   "bsb"
  ],
  "chaves": {
   "b": "cl:tabuas_tratadas",
   "s": "cl:graveto_tratado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_serraria",
  "resultado": "cl:serraria",
  "qtd": 1,
  "grade": [
   " S ",
   "CEC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:iron_axe",
   "C": "minecraft:copper_ingot",
   "E": "cl:estrutura_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_shuriken_cobalto",
  "resultado": "cl:shuriken_cobalto",
  "qtd": 4,
  "grade": [
   " M ",
   "M M",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_cobalto"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_shuriken_ferro",
  "resultado": "cl:shuriken_ferro",
  "qtd": 4,
  "grade": [
   " M ",
   "M M",
   " M "
  ],
  "chaves": {
   "M": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_shuriken_manyullyn",
  "resultado": "cl:shuriken_manyullyn",
  "qtd": 4,
  "grade": [
   " M ",
   "M M",
   " M "
  ],
  "chaves": {
   "M": "cl:lingote_manyullyn"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_shuriken_silex",
  "resultado": "cl:shuriken_silex",
  "qtd": 4,
  "grade": [
   " M ",
   "M M",
   " M "
  ],
  "chaves": {
   "M": "minecraft:flint"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_silex_de_cascalho",
  "resultado": "minecraft:flint",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:gravel",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_silicio",
  "resultado": "cl:silicio",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:po_certus",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slime_congelado_ceu",
  "resultado": "cl:slime_congelado_ceu",
  "qtd": 1,
  "grade": [
   "SS",
   "SS"
  ],
  "chaves": {
   "S": "cl:bola_slime_ceu"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slime_congelado_ender",
  "resultado": "cl:slime_congelado_ender",
  "qtd": 1,
  "grade": [
   "SS",
   "SS"
  ],
  "chaves": {
   "S": "cl:bola_slime_ender"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slime_congelado_icor",
  "resultado": "cl:slime_congelado_icor",
  "qtd": 1,
  "grade": [
   "SS",
   "SS"
  ],
  "chaves": {
   "S": "cl:bola_slime_icor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slime_congelado_sangue",
  "resultado": "cl:slime_congelado_sangue",
  "qtd": 1,
  "grade": [
   "SS",
   "SS"
  ],
  "chaves": {
   "S": "cl:bola_slime_sangue"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slime_congelado_terra",
  "resultado": "cl:slime_congelado_terra",
  "qtd": 1,
  "grade": [
   "SS",
   "SS"
  ],
  "chaves": {
   "S": "minecraft:slime_ball"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_slimelitros",
  "resultado": "cl:slimelitros",
  "qtd": 1,
  "grade": [
   "SMS",
   "S S"
  ],
  "chaves": {
   "S": "cl:slime_congelado_ender",
   "M": "minecraft:phantom_membrane"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_super_varinha_construtor",
  "resultado": "cl:super_varinha_construtor",
  "qtd": 1,
  "grade": [
   "D",
   "V"
  ],
  "chaves": {
   "D": "minecraft:diamond_block",
   "V": "cl:varinha_construtor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_suporte_ferramentas",
  "resultado": "cl:suporte_ferramentas",
  "qtd": 1,
  "grade": [
   "SSS",
   "SFS",
   "SSS"
  ],
  "chaves": {
   "S": "minecraft:oak_slab",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tabua_cortar",
  "resultado": "cl:tabua_cortar",
  "qtd": 1,
  "grade": [
   "/##",
   "/##"
  ],
  "chaves": {
   "#": "#minecraft:planks",
   "/": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_tabuas_cascaender",
  "resultado": "cl:tabuas_cascaender",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:tronco_cascaender",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_tabuas_cogusangue",
  "resultado": "cl:tabuas_cogusangue",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:tronco_cogusangue",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_tabuas_raizceu",
  "resultado": "cl:tabuas_raizceu",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:tronco_raizceu",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tabuas_tratadas",
  "resultado": "?",
  "qtd": 1,
  "grade": [
   "www",
   "wbw",
   "www"
  ],
  "chaves": {
   "w": "#minecraft:planks",
   "b": "cl:balde_creosoto"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_tabuas_verdecoracao",
  "resultado": "cl:tabuas_verdecoracao",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "cl:tronco_verdecoracao",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tanque_chamuscado",
  "resultado": "cl:tanque_chamuscado",
  "qtd": 1,
  "grade": [
   "TTT",
   "TGT",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado",
   "G": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tanque_oxigenio_leve",
  "resultado": "cl:tanque_oxigenio_leve",
  "qtd": 1,
  "grade": [
   "Z",
   "X",
   "Y"
  ],
  "chaves": {
   "X": "cl:lata_estanho",
   "Y": "cl:placa_cobre",
   "Z": "minecraft:lime_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tanque_oxigenio_medio",
  "resultado": "cl:tanque_oxigenio_medio",
  "qtd": 1,
  "grade": [
   "ZZ",
   "XX",
   "YY"
  ],
  "chaves": {
   "X": "cl:lata_estanho",
   "Y": "cl:placa_estanho",
   "Z": "minecraft:orange_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tanque_oxigenio_pesado",
  "resultado": "cl:tanque_oxigenio_pesado",
  "qtd": 1,
  "grade": [
   "ZZZ",
   "XXX",
   "YYY"
  ],
  "chaves": {
   "X": "cl:lata_estanho",
   "Y": "cl:placa_aco",
   "Z": "minecraft:red_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tanque_refratario",
  "resultado": "cl:tanque_refratario",
  "qtd": 1,
  "grade": [
   "TTT",
   "TVT",
   "TTT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario",
   "V": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tecido_canhamo",
  "resultado": "cl:tecido_canhamo",
  "qtd": 1,
  "grade": [
   "fff",
   "fsf",
   "fff"
  ],
  "chaves": {
   "f": "cl:fibra_canhamo",
   "s": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tesseract",
  "resultado": "cl:tesseract",
  "qtd": 1,
  "grade": [
   "OPO",
   "PEP",
   "ODO"
  ],
  "chaves": {
   "O": "minecraft:gold_ingot",
   "P": "minecraft:ender_pearl",
   "E": "cl:estrutura_maquina",
   "D": "minecraft:diamond"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tijolo_alto_forno",
  "resultado": "cl:tijolo_alto_forno",
  "qtd": 3,
  "grade": [
   "csc",
   "sms",
   "csc"
  ],
  "chaves": {
   "c": "minecraft:netherbrick",
   "s": "minecraft:brick",
   "m": "minecraft:magma"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_tijolo_chamuscado",
  "resultado": "cl:tijolo_chamuscado",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:argamassa_nether",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tijolo_coque",
  "resultado": "cl:tijolo_coque",
  "qtd": 3,
  "grade": [
   "csc",
   "sms",
   "csc"
  ],
  "chaves": {
   "c": "minecraft:clay_ball",
   "s": "minecraft:brick",
   "m": "minecraft:sandstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tijolo_lunar",
  "resultado": "cl:tijolo_lunar",
  "qtd": 4,
  "grade": [
   "XX",
   "XX"
  ],
  "chaves": {
   "X": "cl:rocha_lunar"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_tijolo_refratario",
  "resultado": "cl:tijolo_refratario",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:argamassa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tijolos_chamuscados",
  "resultado": "cl:tijolos_chamuscados",
  "qtd": 1,
  "grade": [
   "TT",
   "TT"
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tijolos_refratarios",
  "resultado": "cl:tijolos_refratarios",
  "qtd": 1,
  "grade": [
   "TT",
   "TT"
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tnt_obsidiana",
  "resultado": "cl:tnt_obsidiana",
  "qtd": 1,
  "grade": [
   "OOO",
   "TTT",
   "OOO"
  ],
  "chaves": {
   "O": "minecraft:obsidian",
   "T": "minecraft:tnt"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_torneira",
  "resultado": "cl:torneira",
  "qtd": 1,
  "grade": [
   "T T",
   " T "
  ],
  "chaves": {
   "T": "cl:tijolo_refratario"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_torre_defesa",
  "resultado": "cl:torre_defesa",
  "qtd": 1,
  "grade": [
   "ADA",
   "CEC",
   "AKA"
  ],
  "chaves": {
   "A": "cl:lingote_aco",
   "D": "minecraft:dispenser",
   "C": "cl:circuito",
   "E": "cl:estrutura_maquina",
   "K": "cl:capacitor"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_triturado_cobre",
  "resultado": "minecraft:copper_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:triturado_cobre",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_triturado_ferro",
  "resultado": "minecraft:iron_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:triturado_ferro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_triturado_ouro",
  "resultado": "minecraft:gold_ingot",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:triturado_ouro",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:c_triturado_zinco",
  "resultado": "cl:lingote_zinco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:triturado_zinco",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_triturador_mk",
  "resultado": "cl:triturador_mk",
  "qtd": 1,
  "grade": [
   "RCR",
   "LIL",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "L": "minecraft:lava_bucket",
   "C": "cl:circuito_controle_basico",
   "I": "cl:revestimento_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_triturador_monstros",
  "resultado": "cl:triturador_monstros",
  "qtd": 1,
  "grade": [
   " S ",
   "CBC",
   " R "
  ],
  "chaves": {
   "S": "minecraft:iron_sword",
   "C": "minecraft:copper_ingot",
   "B": "cl:bloco_maquina",
   "R": "cl:circuito"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tubo_pressao",
  "resultado": "cl:tubo_pressao",
  "qtd": 8,
  "grade": [
   "FVF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "V": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_tubo_pressao_avancado",
  "resultado": "cl:tubo_pressao_avancado",
  "qtd": 1,
  "grade": [
   "C",
   "T",
   "C"
  ],
  "chaves": {
   "C": "cl:lingote_ferro_comprimido",
   "T": "cl:tubo_pressao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_alcance_1",
  "resultado": "cl:upgrade_alcance_1",
  "qtd": 1,
  "grade": [
   "MMM",
   "PRP",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:lapis_lazuli",
   "P": "cl:plastico_cru",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_alcance_2",
  "resultado": "cl:upgrade_alcance_2",
  "qtd": 1,
  "grade": [
   "MMM",
   "PRP",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "P": "cl:plastico_cru",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_alcance_3",
  "resultado": "cl:upgrade_alcance_3",
  "qtd": 1,
  "grade": [
   "MMM",
   "PRP",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_estanho",
   "P": "cl:plastico_cru",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_alcance_4",
  "resultado": "cl:upgrade_alcance_4",
  "qtd": 1,
  "grade": [
   "MMM",
   "PRP",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "P": "cl:plastico_cru",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_alcance_5",
  "resultado": "cl:upgrade_alcance_5",
  "qtd": 1,
  "grade": [
   "MMM",
   "PRP",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_bronze",
   "P": "cl:plastico_cru",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_armazenamento",
  "resultado": "cl:upgrade_armazenamento",
  "qtd": 1,
  "grade": [
   "PPP",
   "PCP",
   "PPP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "C": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_1",
  "resultado": "cl:upgrade_estrutural_1",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "#minecraft:planks",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_2",
  "resultado": "cl:upgrade_estrutural_2",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_3",
  "resultado": "cl:upgrade_estrutural_3",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_4",
  "resultado": "cl:upgrade_estrutural_4",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:diamond",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_5",
  "resultado": "cl:upgrade_estrutural_5",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:obsidian",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_6",
  "resultado": "cl:upgrade_estrutural_6",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "cl:lingote_aco",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_upgrade_estrutural_7",
  "resultado": "cl:upgrade_estrutural_7",
  "qtd": 1,
  "grade": [
   "MMM",
   "MSM",
   "MMM"
  ],
  "chaves": {
   "M": "minecraft:emerald",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_valvula_camara",
  "resultado": "cl:valvula_camara",
  "qtd": 1,
  "grade": [
   "P",
   "T"
  ],
  "chaves": {
   "P": "cl:parede_camara",
   "T": "cl:tubo_pressao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_varal",
  "resultado": "cl:varal",
  "qtd": 1,
  "grade": [
   "SSS"
  ],
  "chaves": {
   "S": "minecraft:oak_slab"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_varinha_construtor",
  "resultado": "cl:varinha_construtor",
  "qtd": 1,
  "grade": [
   "O",
   "S"
  ],
  "chaves": {
   "O": "minecraft:obsidian",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vela_aeronave",
  "resultado": "cl:vela_aeronave",
  "qtd": 1,
  "grade": [
   "CCS",
   "CCS",
   "CCS"
  ],
  "chaves": {
   "S": "minecraft:string",
   "C": "minecraft:white_carpet"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vela_lona",
  "resultado": "cl:vela_lona",
  "qtd": 1,
  "grade": [
   " cc",
   "ccc",
   " c "
  ],
  "chaves": {
   "c": "cl:tecido_canhamo"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ventilador_oxigenio",
  "resultado": "cl:ventilador_oxigenio",
  "qtd": 1,
  "grade": [
   "Z Z",
   " Y ",
   "ZXZ"
  ],
  "chaves": {
   "X": "minecraft:redstone",
   "Y": "cl:wafer_basico",
   "Z": "cl:placa_aco"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_alma_refratario",
  "resultado": "cl:vidro_alma_refratario",
  "qtd": 1,
  "grade": [
   " T ",
   "TST",
   " T "
  ],
  "chaves": {
   "T": "cl:tijolo_refratario",
   "S": "minecraft:soul_sand"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_vidro_camara",
  "resultado": "cl:vidro_camara",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:parede_camara",
    "qtd": 1
   },
   {
    "item": "minecraft:glass",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_chamuscado",
  "resultado": "cl:vidro_chamuscado",
  "qtd": 1,
  "grade": [
   " T ",
   "TGT",
   " T "
  ],
  "chaves": {
   "T": "cl:tijolo_chamuscado",
   "G": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_emoldurado",
  "resultado": "cl:vidro_emoldurado",
  "qtd": 4,
  "grade": [
   "IGI",
   "GIG",
   "IGI"
  ],
  "chaves": {
   "I": "minecraft:iron_nugget",
   "G": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_fume_refratario",
  "resultado": "cl:vidro_fume_refratario",
  "qtd": 1,
  "grade": [
   " T ",
   "TGT",
   " T "
  ],
  "chaves": {
   "T": "cl:tijolo_refratario",
   "G": "minecraft:tinted_glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_liso",
  "resultado": "cl:vidro_liso",
  "qtd": 4,
  "grade": [
   "BB",
   "BB"
  ],
  "chaves": {
   "B": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_vidro_reator",
  "resultado": "cl:vidro_reator",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:carcaca_reator",
    "qtd": 1
   },
   {
    "item": "minecraft:glass",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_vidro_refratario",
  "resultado": "cl:vidro_refratario",
  "qtd": 1,
  "grade": [
   " T ",
   "TVT",
   " T "
  ],
  "chaves": {
   "T": "cl:tijolo_refratario",
   "V": "minecraft:glass"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_wrap_carneiro",
  "resultado": "cl:wrap_carneiro",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bread",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_mutton",
    "qtd": 1
   },
   {
    "item": "cl:repolho",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_xisto",
  "resultado": "cl:xisto",
  "qtd": 8,
  "grade": [
   "###",
   "#D#",
   "###"
  ],
  "chaves": {
   "#": "minecraft:cobblestone",
   "D": "minecraft:gray_dye"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_xisto_entalhado",
  "resultado": "cl:xisto_entalhado",
  "qtd": 1,
  "grade": [
   "#",
   "#"
  ],
  "chaves": {
   "#": "cl:xisto_tijolos"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_xisto_pilar",
  "resultado": "cl:xisto_pilar",
  "qtd": 2,
  "grade": [
   "#",
   "#"
  ],
  "chaves": {
   "#": "cl:xisto_polido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_xisto_polido",
  "resultado": "cl:xisto_polido",
  "qtd": 4,
  "grade": [
   "##",
   "##"
  ],
  "chaves": {
   "#": "cl:xisto"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_xisto_tijolos",
  "resultado": "cl:xisto_tijolos",
  "qtd": 4,
  "grade": [
   "##",
   "##"
  ],
  "chaves": {
   "#": "cl:xisto_polido"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_zinco_de_po",
  "resultado": "cl:lingote_zinco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:zinco_po",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_zinco_de_quebrado",
  "resultado": "cl:lingote_zinco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:zinco_quebrado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_zinco_de_triturado",
  "resultado": "cl:lingote_zinco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:zinco_triturado",
    "qtd": 4
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cabo",
  "resultado": "cl:cabo",
  "qtd": 4,
  "grade": [
   "C",
   "R",
   "C"
  ],
  "chaves": {
   "C": "minecraft:copper_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:cadinho",
  "resultado": "cl:cadinho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cadinho_cru",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cadinho_cru",
  "resultado": "cl:cadinho_cru",
  "qtd": 1,
  "grade": [
   "P P",
   "P P",
   "PPP"
  ],
  "chaves": {
   "P": "cl:porcelana"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cajado",
  "resultado": "cl:cajado",
  "qtd": 1,
  "grade": [
   "SS ",
   " S ",
   " S "
  ],
  "chaves": {
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:camel_pack",
  "resultado": "cl:camel_pack",
  "qtd": 1,
  "grade": [
   "LLL",
   "LBL",
   "LLL"
  ],
  "chaves": {
   "L": "minecraft:leather",
   "B": "minecraft:glass_bottle"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:catalogo",
  "resultado": "cl:catalogo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:sand",
    "qtd": 1
   },
   {
    "item": "minecraft:paper",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cobre_bruto_de_po",
  "resultado": "minecraft:raw_copper",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:cobre_po"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cobre_bruto_de_quebrado",
  "resultado": "minecraft:raw_copper",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:cobre_quebrado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:cobre_bruto_de_triturado",
  "resultado": "minecraft:raw_copper",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:cobre_triturado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:compostor",
  "resultado": "cl:compostor",
  "qtd": 1,
  "grade": [
   "P P",
   "PDP",
   "PPP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "D": "minecraft:dirt"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:condensador_agua",
  "resultado": "cl:condensador_agua",
  "qtd": 1,
  "grade": [
   "IGI",
   "IBI",
   "SSS"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "G": "minecraft:glass",
   "B": "minecraft:bucket",
   "S": "#minecraft:stone_crafting_materials"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:condensador_avancado",
  "resultado": "cl:condensador_avancado",
  "qtd": 1,
  "grade": [
   "CGC",
   "GXG",
   "CGC"
  ],
  "chaves": {
   "C": "minecraft:copper_ingot",
   "G": "minecraft:glass",
   "X": "cl:condensador_agua"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:diario_bordo",
  "resultado": "cl:diario_bordo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:sand",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:estufa",
  "resultado": "cl:estufa",
  "qtd": 1,
  "grade": [
   "GGG",
   "GXG",
   "CCC"
  ],
  "chaves": {
   "G": "minecraft:glass",
   "X": "cl:condensador_agua",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ferro_bruto_de_po",
  "resultado": "minecraft:raw_iron",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ferro_po"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ferro_bruto_de_quebrado",
  "resultado": "minecraft:raw_iron",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ferro_quebrado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ferro_bruto_de_triturado",
  "resultado": "minecraft:raw_iron",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ferro_triturado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:ferver_agua_impropria",
  "resultado": "cl:agua_boa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_impropria",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace",
   "campfire",
   "soul_campfire"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:ferver_agua_muito_suja",
  "resultado": "cl:agua_boa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_muito_suja",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace",
   "campfire",
   "soul_campfire"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:ferver_agua_suja",
  "resultado": "cl:agua_boa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_suja",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace",
   "campfire",
   "soul_campfire"
  ]
 },
 {
  "tipo": "fornalha",
  "id": "cl:ferver_garrafa_de_agua",
  "resultado": "cl:agua_boa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:potion",
    "qtd": 1
   }
  ],
  "estacoes": [
   "furnace",
   "campfire",
   "soul_campfire"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:filtro_la",
  "resultado": "cl:filtro",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "minecraft:iron_ingot",
    "qtd": 1
   },
   {
    "item": "minecraft:white_wool",
    "qtd": 1
   },
   {
    "item": "minecraft:charcoal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:filtro_papel",
  "resultado": "cl:filtro",
  "qtd": 4,
  "ingredientes": [
   {
    "item": "minecraft:iron_ingot",
    "qtd": 1
   },
   {
    "item": "minecraft:paper",
    "qtd": 1
   },
   {
    "item": "minecraft:charcoal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:gerador",
  "resultado": "cl:gerador",
  "qtd": 1,
  "grade": [
   "III",
   "IFI",
   "CRC"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "F": "minecraft:furnace",
   "C": "minecraft:copper_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_arroz_frito",
  "resultado": "cl:arroz_frito",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:arroz",
    "qtd": 1
   },
   {
    "item": "minecraft:carrot",
    "qtd": 1
   },
   {
    "item": "minecraft:egg",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_assadeira",
  "resultado": "cl:assadeira",
  "qtd": 1,
  "grade": [
   "BBB",
   "B B",
   "BBB"
  ],
  "chaves": {
   "B": "minecraft:brick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_bolinho_arroz",
  "resultado": "cl:bolinho_arroz",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:arroz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_broa_milho",
  "resultado": "cl:broa_milho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fuba",
    "qtd": 1
   },
   {
    "item": "minecraft:egg",
    "qtd": 1
   },
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_burrito",
  "resultado": "cl:burrito",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:feijao",
    "qtd": 1
   },
   {
    "item": "cl:tortilha",
    "qtd": 1
   },
   {
    "item": "cl:arroz",
    "qtd": 1
   },
   {
    "item": "cl:queijo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_cacarola",
  "resultado": "cl:cacarola",
  "qtd": 1,
  "grade": [
   "B",
   "S"
  ],
  "chaves": {
   "B": "minecraft:brick",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_caldo",
  "resultado": "cl:caldo",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "minecraft:bone",
    "qtd": 1
   },
   {
    "item": "cl:agua_boa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_charque",
  "resultado": "cl:charque",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:beef",
    "qtd": 1
   },
   {
    "item": "cl:sal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_chili_poppers",
  "resultado": "cl:chili_poppers",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pimenta",
    "qtd": 1
   },
   {
    "item": "cl:massa_liquida",
    "qtd": 1
   },
   {
    "item": "cl:queijo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_espremedor",
  "resultado": "cl:espremedor",
  "qtd": 1,
  "grade": [
   "L",
   "P"
  ],
  "chaves": {
   "L": "minecraft:stone_pressure_plate",
   "P": "minecraft:stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_farinha",
  "resultado": "cl:farinha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:wheat",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_pilao"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_farinha_arroz",
  "resultado": "cl:farinha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:arroz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_pilao"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_feijao_assado",
  "resultado": "cl:feijao_assado",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:feijao",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_porkchop",
    "qtd": 1
   },
   {
    "item": "minecraft:sugar",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_frigideira",
  "resultado": "cl:frigideira",
  "qtd": 1,
  "grade": [
   "B  ",
   " B ",
   "  S"
  ],
  "chaves": {
   "B": "minecraft:brick",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_fuba",
  "resultado": "cl:fuba",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:milho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_pilao"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_hamburguer",
  "resultado": "cl:hamburguer",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:beef",
    "qtd": 1
   },
   {
    "item": "cl:torrada",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_maionese",
  "resultado": "cl:maionese",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:egg",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_espremedor"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_manteiga",
  "resultado": "cl:manteiga",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   },
   {
    "item": "cl:sal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_cacarola"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_massa",
  "resultado": "cl:massa",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_boa",
    "qtd": 1
   },
   {
    "item": "cl:farinha",
    "qtd": 1
   },
   {
    "item": "cl:sal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_tigela_mistura"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_massa_liquida",
  "resultado": "cl:massa_liquida",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:farinha",
    "qtd": 1
   },
   {
    "item": "minecraft:egg",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_tigela_mistura"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_milho_espiga",
  "resultado": "cl:milho_espiga",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:milho",
    "qtd": 1
   },
   {
    "item": "cl:manteiga",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_omelete",
  "resultado": "cl:omelete",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:egg",
    "qtd": 1
   },
   {
    "item": "cl:pimentao",
    "qtd": 1
   },
   {
    "item": "cl:cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_ovo_cozido",
  "resultado": "cl:ovo_cozido",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:egg",
    "qtd": 1
   },
   {
    "item": "cl:agua_boa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_ovo_frito",
  "resultado": "cl:ovo_frito",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:egg",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_panela",
  "resultado": "cl:panela",
  "qtd": 1,
  "grade": [
   "S  ",
   "BB ",
   "BB "
  ],
  "chaves": {
   "B": "minecraft:brick",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_panquecas",
  "resultado": "cl:panquecas",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:massa_liquida",
    "qtd": 1
   },
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_pao_massa",
  "resultado": "minecraft:bread",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:massa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_pemmican",
  "resultado": "cl:pemmican",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:amendoim",
    "qtd": 1
   },
   {
    "item": "cl:fruta_cacto",
    "qtd": 1
   },
   {
    "item": "minecraft:cooked_beef",
    "qtd": 1
   },
   {
    "item": "minecraft:honey_bottle",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_pilao",
  "resultado": "cl:pilao",
  "qtd": 1,
  "grade": [
   "  S",
   "P P",
   " P "
  ],
  "chaves": {
   "S": "minecraft:stick",
   "P": "minecraft:stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_pimentao_recheado",
  "resultado": "cl:pimentao_recheado",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pimentao",
    "qtd": 1
   },
   {
    "item": "cl:tomate",
    "qtd": 1
   },
   {
    "item": "cl:arroz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_pipoca",
  "resultado": "cl:pipoca",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:milho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_queijo",
  "resultado": "cl:queijo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:milk_bucket",
    "qtd": 1
   },
   {
    "item": "cl:sal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_sal",
  "resultado": "cl:sal",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:agua_impropria",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_alho",
  "resultado": "cl:semente_alho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:alho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_amendoim",
  "resultado": "cl:semente_amendoim",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:amendoim",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_arroz",
  "resultado": "cl:semente_arroz",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:arroz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_canhamo",
  "resultado": "cl:semente_canhamo",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fibra_canhamo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_cebola",
  "resultado": "cl:semente_cebola",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:cebola",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_feijao",
  "resultado": "cl:semente_feijao",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:feijao",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_fruta_cacto",
  "resultado": "cl:semente_fruta_cacto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fruta_cacto",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_milho",
  "resultado": "cl:semente_milho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:milho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_pimenta",
  "resultado": "cl:semente_pimenta",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pimenta",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_pimentao",
  "resultado": "cl:semente_pimentao",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:pimentao",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_repolho",
  "resultado": "cl:semente_repolho",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:repolho",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_semente_tomate",
  "resultado": "cl:semente_tomate",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tomate",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_sopa_arroz",
  "resultado": "cl:sopa_arroz",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:arroz",
    "qtd": 1
   },
   {
    "item": "cl:caldo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_sopa_cacto",
  "resultado": "cl:sopa_cacto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:cactus",
    "qtd": 1
   },
   {
    "item": "cl:caldo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_sopa_legumes",
  "resultado": "cl:sopa_legumes",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:potato",
    "qtd": 1
   },
   {
    "item": "minecraft:carrot",
    "qtd": 1
   },
   {
    "item": "minecraft:brown_mushroom",
    "qtd": 1
   },
   {
    "item": "cl:caldo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_sopa_tomate",
  "resultado": "cl:sopa_tomate",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:tomate",
    "qtd": 1
   },
   {
    "item": "cl:caldo",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_panela"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_suco_cacto",
  "resultado": "cl:suco_cacto",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fruta_cacto",
    "qtd": 2
   }
  ],
  "estacoes": [
   "cl_espremedor"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_tabua_corte",
  "resultado": "cl:tabua_corte",
  "qtd": 1,
  "grade": [
   "B  ",
   " S ",
   "  P"
  ],
  "chaves": {
   "B": "minecraft:brick",
   "S": "minecraft:stick",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_taco",
  "resultado": "cl:taco",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:cooked_beef",
    "qtd": 1
   },
   {
    "item": "cl:tomate",
    "qtd": 1
   },
   {
    "item": "cl:queijo",
    "qtd": 1
   },
   {
    "item": "cl:tortilha",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_tabua_corte"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:hc_tigela_mistura",
  "resultado": "cl:tigela_mistura",
  "qtd": 1,
  "grade": [
   "S  ",
   "P P",
   " P "
  ],
  "chaves": {
   "S": "minecraft:stick",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_torrada",
  "resultado": "cl:torrada",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:bread",
    "qtd": 1
   },
   {
    "item": "cl:manteiga",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_assadeira"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:hc_tortilha",
  "resultado": "cl:tortilha",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "cl:fuba",
    "qtd": 1
   },
   {
    "item": "cl:agua_boa",
    "qtd": 1
   }
  ],
  "estacoes": [
   "cl_frigideira"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:idolo_amaldicoado",
  "resultado": "cl:idolo_amaldicoado",
  "qtd": 1,
  "grade": [
   "GFG",
   "FCF",
   "GFG"
  ],
  "chaves": {
   "G": "minecraft:gold_ingot",
   "F": "cl:faixa_mumia",
   "C": "minecraft:chiseled_sandstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_cobre",
  "resultado": "cl:martelo_cobre",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "minecraft:copper_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_diamante",
  "resultado": "cl:martelo_diamante",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "minecraft:diamond",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_ferro",
  "resultado": "cl:martelo_ferro",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "minecraft:iron_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_madeira",
  "resultado": "cl:martelo_madeira",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "#minecraft:planks",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_ouro",
  "resultado": "cl:martelo_ouro",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "minecraft:gold_ingot",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:martelo_pedra",
  "resultado": "cl:martelo_pedra",
  "qtd": 1,
  "grade": [
   " M ",
   " SM",
   "S  "
  ],
  "chaves": {
   "M": "#minecraft:stone_crafting_materials",
   "S": "minecraft:stick"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:mascara",
  "resultado": "cl:mascara",
  "qtd": 1,
  "grade": [
   "IVI",
   "FIF",
   "I I"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "V": "minecraft:glass",
   "F": "cl:filtro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:moinho",
  "resultado": "cl:moinho",
  "qtd": 1,
  "grade": [
   "SPS",
   "PIP",
   "SRS"
  ],
  "chaves": {
   "S": "minecraft:stick",
   "P": "#minecraft:planks",
   "I": "minecraft:iron_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:montadora",
  "resultado": "cl:montadora",
  "qtd": 1,
  "grade": [
   "IPI",
   "RTR",
   "III"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "P": "minecraft:piston",
   "R": "minecraft:redstone",
   "T": "minecraft:crafting_table"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:organizador",
  "resultado": "cl:organizador",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:chest",
    "qtd": 1
   },
   {
    "item": "minecraft:stick",
    "qtd": 2
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ouro_bruto_de_po",
  "resultado": "minecraft:raw_gold",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ouro_po"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ouro_bruto_de_quebrado",
  "resultado": "minecraft:raw_gold",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ouro_quebrado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:ouro_bruto_de_triturado",
  "resultado": "minecraft:raw_gold",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:ouro_triturado"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:painel_nave",
  "resultado": "cl:painel_nave",
  "qtd": 1,
  "grade": [
   "IGI",
   "RRR",
   "III"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "G": "minecraft:glass",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:painel_solar",
  "resultado": "cl:painel_solar",
  "qtd": 1,
  "grade": [
   "VVV",
   "LRL",
   "CCC"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "L": "minecraft:lapis_lazuli",
   "R": "minecraft:redstone",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:pedregulho_de_pedrinhas",
  "resultado": "minecraft:cobblestone",
  "qtd": 1,
  "grade": [
   "PP",
   "PP"
  ],
  "chaves": {
   "P": "cl:pedrinha"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:peneira",
  "resultado": "cl:peneira",
  "qtd": 1,
  "grade": [
   "S S",
   "SLS",
   "P P"
  ],
  "chaves": {
   "S": "minecraft:stick",
   "L": "minecraft:string",
   "P": "#minecraft:planks"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:peneira_automatica",
  "resultado": "cl:peneira_automatica",
  "qtd": 1,
  "grade": [
   "IHI",
   "RPR",
   "ICI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "H": "minecraft:hopper",
   "R": "minecraft:redstone",
   "P": "cl:peneira",
   "C": "minecraft:copper_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:porcelana",
  "resultado": "cl:porcelana",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:clay_ball",
    "qtd": 1
   },
   {
    "item": "minecraft:bone_meal",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terminal",
  "resultado": "cl:terminal",
  "qtd": 1,
  "grade": [
   "IGI",
   "RCR",
   "III"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "G": "minecraft:glass",
   "R": "minecraft:redstone",
   "C": "minecraft:chest"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terra_de_folhas_acacia",
  "resultado": "minecraft:dirt",
  "qtd": 1,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:acacia_leaves"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terra_de_folhas_birch",
  "resultado": "minecraft:dirt",
  "qtd": 1,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:birch_leaves"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terra_de_folhas_jungle",
  "resultado": "minecraft:dirt",
  "qtd": 1,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:jungle_leaves"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terra_de_folhas_oak",
  "resultado": "minecraft:dirt",
  "qtd": 1,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:oak_leaves"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:terra_de_folhas_spruce",
  "resultado": "minecraft:dirt",
  "qtd": 1,
  "grade": [
   "FFF",
   "F F",
   "FFF"
  ],
  "chaves": {
   "F": "minecraft:spruce_leaves"
  },
  "estacoes": [
   "crafting_table"
  ]
 }
];
export const DROPS: ReadonlyArray<{ fonte: string; item: string; min: number; max: number; chance: number }> = [
 {
  "fonte": "cl:escorpiao",
  "item": "minecraft:string",
  "min": 0,
  "max": 2,
  "chance": 1
 },
 {
  "fonte": "cl:escorpiao",
  "item": "minecraft:spider_eye",
  "min": 1,
  "max": 1,
  "chance": 0.4
 },
 {
  "fonte": "cl:esqueleto_chefe",
  "item": "minecraft:bone",
  "min": 3,
  "max": 6,
  "chance": 1
 },
 {
  "fonte": "cl:esqueleto_chefe",
  "item": "minecraft:arrow",
  "min": 4,
  "max": 10,
  "chance": 1
 },
 {
  "fonte": "cl:farao",
  "item": "cl:coracao_farao",
  "min": 1,
  "max": 1,
  "chance": 1
 },
 {
  "fonte": "cl:farao",
  "item": "minecraft:gold_ingot",
  "min": 8,
  "max": 16,
  "chance": 1
 },
 {
  "fonte": "cl:farao",
  "item": "minecraft:diamond",
  "min": 2,
  "max": 4,
  "chance": 1
 },
 {
  "fonte": "cl:farao",
  "item": "cl:faixa_mumia",
  "min": 4,
  "max": 8,
  "chance": 1
 },
 {
  "fonte": "cl:farao",
  "item": "minecraft:golden_apple",
  "min": 1,
  "max": 2,
  "chance": 1
 },
 {
  "fonte": "cl:golem_areia",
  "item": "minecraft:sand",
  "min": 3,
  "max": 8,
  "chance": 1
 },
 {
  "fonte": "cl:golem_areia",
  "item": "minecraft:sandstone",
  "min": 1,
  "max": 3,
  "chance": 0.5
 },
 {
  "fonte": "cl:golem_areia",
  "item": "minecraft:glass",
  "min": 1,
  "max": 2,
  "chance": 0.2
 },
 {
  "fonte": "cl:minerio_cobalto",
  "item": "cl:cobalto_bruto",
  "min": 1,
  "max": 1,
  "chance": 1
 },
 {
  "fonte": "cl:minerio_queijo",
  "item": "cl:coalhada_queijo",
  "min": 1,
  "max": 1,
  "chance": 1
 },
 {
  "fonte": "cl:mumia",
  "item": "minecraft:rotten_flesh",
  "min": 0,
  "max": 2,
  "chance": 1
 },
 {
  "fonte": "cl:mumia",
  "item": "cl:faixa_mumia",
  "min": 1,
  "max": 2,
  "chance": 0.55
 },
 {
  "fonte": "cl:mumia",
  "item": "minecraft:bone",
  "min": 1,
  "max": 1,
  "chance": 0.3
 },
 {
  "fonte": "cl:mumia",
  "item": "minecraft:gold_nugget",
  "min": 1,
  "max": 3,
  "chance": 0.1
 }
];

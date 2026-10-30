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
  "icone": "textures/items/cl/c/aco_eletrico"
 },
 "cl:aco_negro": {
  "pt": "Lingote de Aço Negro",
  "en": "Dark Steel Ingot",
  "icone": "textures/items/cl/c/aco_negro"
 },
 "cl:aglutinante_conduite": {
  "pt": "Aglutinante de Conduíte",
  "en": "Conduit Binder",
  "icone": "textures/items/cl/c/aglutinante_conduite"
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
  "icone": "textures/items/cl/c/aleta_foguete"
 },
 "cl:alho": {
  "pt": "Alho",
  "en": "Garlic",
  "icone": "textures/items/cl/arte/alho"
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
  "icone": "textures/blocks/cl/c/ancora_viagem_topo"
 },
 "cl:arenito_entalhado": {
  "pt": "Arenito Entalhado",
  "en": "Carved Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_entalhado"
 },
 "cl:arenito_ladrilho": {
  "pt": "Arenito Ladrilho",
  "en": "Tiles Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_ladrilho"
 },
 "cl:arenito_liso": {
  "pt": "Arenito Liso",
  "en": "Smooth Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_liso"
 },
 "cl:arenito_mosaico": {
  "pt": "Arenito Mosaico",
  "en": "Mosaic Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_mosaico"
 },
 "cl:arenito_pilar": {
  "pt": "Arenito Pilar",
  "en": "Pillar Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_pilar"
 },
 "cl:arenito_polido": {
  "pt": "Arenito Polido",
  "en": "Polished Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_polido"
 },
 "cl:arenito_tijolos": {
  "pt": "Arenito Tijolos",
  "en": "Bricks Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_tijolos"
 },
 "cl:arenito_tijolos_pequenos": {
  "pt": "Arenito Tijolinhos",
  "en": "Small Bricks Sandstone",
  "icone": "textures/blocks/cl/arte/arenito_tijolos_pequenos"
 },
 "cl:argamassa": {
  "pt": "Argamassa",
  "en": "Grout",
  "icone": "textures/items/cl/arte/argamassa"
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
 "cl:assadeira": {
  "pt": "Assadeira",
  "en": "Bakeware",
  "icone": "textures/items/cl/arte/blocos/assadeira"
 },
 "cl:bacia_fundicao": {
  "pt": "Bacia de Fundição",
  "en": "Casting Basin",
  "icone": "textures/items/cl/arte/blocos/bacia_fundicao"
 },
 "cl:balde_combustivel": {
  "pt": "Balde de Combustível",
  "en": "Fuel Bucket",
  "icone": "textures/items/cl/arte/balde_combustivel"
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
 "cl:bancada_nasa": {
  "pt": "Bancada da NASA",
  "en": "NASA Workbench",
  "icone": "textures/blocks/cl/c/bancada_nasa_topo"
 },
 "cl:banco_capacitores": {
  "pt": "Banco de Capacitores",
  "en": "Capacitor Bank",
  "icone": "textures/blocks/cl/c/banco_capacitores_topo"
 },
 "cl:banco_capacitores_basico": {
  "pt": "Banco de Capacitores Básico",
  "en": "Basic Capacitor Bank",
  "icone": "textures/blocks/cl/c/banco_capacitores_basico_topo"
 },
 "cl:banco_capacitores_vibrante": {
  "pt": "Banco de Capacitores Vibrante",
  "en": "Vibrant Capacitor Bank",
  "icone": "textures/blocks/cl/c/banco_capacitores_vibrante_topo"
 },
 "cl:barra_borracha": {
  "pt": "Barra de Borracha",
  "en": "Rubber Bar",
  "icone": "textures/items/cl/arte/barra_borracha"
 },
 "cl:barra_combustivel": {
  "pt": "Barra de Combustível",
  "en": "Yellorium Fuel Rod",
  "icone": "textures/items/cl/arte/blocos/barra_combustivel"
 },
 "cl:barra_controle": {
  "pt": "Barra de Controle",
  "en": "Reactor Control Rod",
  "icone": "textures/items/cl/arte/blocos/barra_controle"
 },
 "cl:barra_grafite": {
  "pt": "Barra de Grafite",
  "en": "Graphite Bar",
  "icone": "textures/items/cl/arte/barra_grafite"
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
 "cl:batedor": {
  "pt": "Batedor",
  "en": "Whisk",
  "icone": "textures/items/cl/c/batedor"
 },
 "cl:bateria": {
  "pt": "Bateria",
  "en": "Battery",
  "icone": "textures/items/cl/arte/blocos/bateria"
 },
 "cl:bau_me": {
  "pt": "Baú ME",
  "en": "ME Chest",
  "icone": "textures/items/cl/arte/blocos/bau_me"
 },
 "cl:bau_tesouro": {
  "pt": "Baú do Tesouro",
  "en": "Treasure Chest",
  "icone": "textures/blocks/cl/c/bau_tesouro_topo"
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
  "icone": "textures/items/cl/c/bico_foguete"
 },
 "cl:biocombustivel": {
  "pt": "Biocombustível",
  "en": "Bio Fuel",
  "icone": "textures/items/cl/c/biocombustivel"
 },
 "cl:bloco_aco": {
  "pt": "Bloco de Aço",
  "en": "Block of Steel",
  "icone": "textures/blocks/cl/arte/bloco_aco"
 },
 "cl:bloco_bronze": {
  "pt": "Bloco de Bronze",
  "en": "Block of Bronze",
  "icone": "textures/blocks/cl/arte/bloco_bronze"
 },
 "cl:bloco_estanho": {
  "pt": "Bloco de Estanho",
  "en": "Block of Tin",
  "icone": "textures/blocks/cl/arte/bloco_estanho"
 },
 "cl:bloco_ferro_comprimido": {
  "pt": "Bloco de Ferro Comprimido",
  "en": "Compressed Iron Block",
  "icone": "textures/blocks/cl/arte/bloco_ferro_comprimido"
 },
 "cl:bloco_grafite": {
  "pt": "Bloco de Grafite",
  "en": "Graphite Block",
  "icone": "textures/blocks/cl/arte/bloco_grafite"
 },
 "cl:bloco_maquina": {
  "pt": "Bloco de Máquina",
  "en": "Machine Block",
  "icone": "textures/items/cl/arte/blocos/bloco_maquina"
 },
 "cl:bloco_yellorium": {
  "pt": "Bloco de Yellorium",
  "en": "Yellorium Block",
  "icone": "textures/blocks/cl/arte/bloco_yellorium"
 },
 "cl:bola_musgo": {
  "pt": "Bola de Musgo",
  "en": "Ball of Moss",
  "icone": "textures/items/cl/arte/bola_musgo"
 },
 "cl:bolinho_arroz": {
  "pt": "Bolinho de Arroz",
  "en": "Rice Cake",
  "icone": "textures/items/cl/arte/bolinho_arroz"
 },
 "cl:bomba": {
  "pt": "Bomba",
  "en": "Pump",
  "icone": "textures/items/cl/arte/blocos/bomba"
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
 "cl:cacarola": {
  "pt": "Caçarola",
  "en": "Saucepan",
  "icone": "textures/items/cl/arte/blocos/cacarola"
 },
 "cl:cacho_tamaras": {
  "pt": "Cacho de Tâmaras",
  "en": "Date Bunch",
  "icone": "textures/blocks/cl/arte/cacho_tamaras"
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
  "icone": "textures/blocks/cl/c/caixa_engrenagens"
 },
 "cl:caixa_entrega": {
  "pt": "Caixa de Entrega",
  "en": "Quest Delivery System",
  "icone": "textures/items/cl/arte/blocos/caixa_entrega"
 },
 "cl:cajado": {
  "pt": "Cajado",
  "en": "Crook",
  "icone": "textures/items/cl/arte/cajado"
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
 "cl:calcario": {
  "pt": "Calcário",
  "en": "Limestone",
  "icone": "textures/blocks/cl/arte/calcario"
 },
 "cl:calcario_entalhado": {
  "pt": "Calcário Entalhado",
  "en": "Carved Limestone",
  "icone": "textures/blocks/cl/arte/calcario_entalhado"
 },
 "cl:calcario_ladrilho": {
  "pt": "Calcário Ladrilho",
  "en": "Tiles Limestone",
  "icone": "textures/blocks/cl/arte/calcario_ladrilho"
 },
 "cl:calcario_liso": {
  "pt": "Calcário Liso",
  "en": "Smooth Limestone",
  "icone": "textures/blocks/cl/arte/calcario_liso"
 },
 "cl:calcario_mosaico": {
  "pt": "Calcário Mosaico",
  "en": "Mosaic Limestone",
  "icone": "textures/blocks/cl/arte/calcario_mosaico"
 },
 "cl:calcario_pilar": {
  "pt": "Calcário Pilar",
  "en": "Pillar Limestone",
  "icone": "textures/blocks/cl/arte/calcario_pilar"
 },
 "cl:calcario_polido": {
  "pt": "Calcário Polido",
  "en": "Polished Limestone",
  "icone": "textures/blocks/cl/arte/calcario_polido"
 },
 "cl:calcario_tijolos": {
  "pt": "Calcário Tijolos",
  "en": "Bricks Limestone",
  "icone": "textures/blocks/cl/arte/calcario_tijolos"
 },
 "cl:calcario_tijolos_pequenos": {
  "pt": "Calcário Tijolinhos",
  "en": "Small Bricks Limestone",
  "icone": "textures/blocks/cl/arte/calcario_tijolos_pequenos"
 },
 "cl:caldo": {
  "pt": "Caldo",
  "en": "Stock",
  "icone": "textures/items/cl/arte/caldo"
 },
 "cl:camara_injecao": {
  "pt": "Câmara de Injeção Química",
  "en": "Chemical Injection Chamber",
  "icone": "textures/items/cl/arte/blocos/camara_injecao"
 },
 "cl:camara_purificacao": {
  "pt": "Câmara de Purificação",
  "en": "Purification Chamber",
  "icone": "textures/items/cl/arte/blocos/camara_purificacao"
 },
 "cl:camel_pack": {
  "pt": "Camel Pack",
  "en": "Camel Pack",
  "icone": "textures/items/cl/arte/camel_pack"
 },
 "cl:cano_oxigenio": {
  "pt": "Cano de Oxigênio",
  "en": "Oxygen Pipe",
  "icone": "textures/items/cl/c/cano_oxigenio"
 },
 "cl:capacitor": {
  "pt": "Capacitor",
  "en": "Capacitor",
  "icone": "textures/items/cl/arte/capacitor"
 },
 "cl:capacitor_basico": {
  "pt": "Capacitor Básico",
  "en": "Basic Capacitor",
  "icone": "textures/items/cl/c/capacitor_basico"
 },
 "cl:capacitor_duplo": {
  "pt": "Capacitor de Camada Dupla",
  "en": "Double-Layer Capacitor",
  "icone": "textures/items/cl/c/capacitor_duplo"
 },
 "cl:capacitor_octadico": {
  "pt": "Capacitor Octádico",
  "en": "Octadic Capacitor",
  "icone": "textures/items/cl/c/capacitor_octadico"
 },
 "cl:carcaca_reator": {
  "pt": "Carcaça do Reator",
  "en": "Reactor Casing",
  "icone": "textures/blocks/cl/arte/carcaca_reator"
 },
 "cl:carregador_chunks": {
  "pt": "Carregador de Chunks",
  "en": "Chunk Loader",
  "icone": "textures/items/cl/arte/blocos/carregador_chunks"
 },
 "cl:carregador_combustivel": {
  "pt": "Carregador de Combustível",
  "en": "Fuel Loader",
  "icone": "textures/blocks/cl/c/carregador_combustivel_topo"
 },
 "cl:carregador_pontual": {
  "pt": "Carregador Pontual",
  "en": "Spot Loader",
  "icone": "textures/items/cl/arte/blocos/carregador_pontual"
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
 "cl:cascalho_nether": {
  "pt": "Cascalho do Nether",
  "en": "Nether Gravel",
  "icone": "textures/blocks/cl/arte/cascalho_nether"
 },
 "cl:casco_nave_entalhado": {
  "pt": "Casco da Nave Entalhado",
  "en": "Carved Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_entalhado"
 },
 "cl:casco_nave_ladrilho": {
  "pt": "Casco da Nave Ladrilho",
  "en": "Tiles Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_ladrilho"
 },
 "cl:casco_nave_liso": {
  "pt": "Casco da Nave Liso",
  "en": "Smooth Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_liso"
 },
 "cl:casco_nave_mosaico": {
  "pt": "Casco da Nave Mosaico",
  "en": "Mosaic Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_mosaico"
 },
 "cl:casco_nave_pilar": {
  "pt": "Casco da Nave Pilar",
  "en": "Pillar Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_pilar"
 },
 "cl:casco_nave_polido": {
  "pt": "Casco da Nave Polido",
  "en": "Polished Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_polido"
 },
 "cl:casco_nave_tijolos": {
  "pt": "Casco da Nave Tijolos",
  "en": "Bricks Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_tijolos"
 },
 "cl:casco_nave_tijolos_pequenos": {
  "pt": "Casco da Nave Tijolinhos",
  "en": "Small Bricks Hull",
  "icone": "textures/blocks/cl/arte/casco_nave_tijolos_pequenos"
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
  "pt": "Célula ME 16k",
  "en": "16k ME Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_16k"
 },
 "cl:celula_me_1k": {
  "pt": "Célula ME 1k",
  "en": "1k ME Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_1k"
 },
 "cl:celula_me_4k": {
  "pt": "Célula ME 4k",
  "en": "4k ME Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_4k"
 },
 "cl:celula_me_64k": {
  "pt": "Célula ME 64k",
  "en": "64k ME Storage Cell",
  "icone": "textures/items/cl/arte/celula_me_64k"
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
 "cl:chassi_maquina": {
  "pt": "Chassi de Máquina",
  "en": "Machine Chassis",
  "icone": "textures/blocks/cl/c/chassi_maquina_topo"
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
 "cl:circuito_controle_avancado": {
  "pt": "Circuito de Controle Avançado",
  "en": "Advanced Control Circuit",
  "icone": "textures/items/cl/c/circuito_controle_avancado"
 },
 "cl:circuito_controle_basico": {
  "pt": "Circuito de Controle Básico",
  "en": "Basic Control Circuit",
  "icone": "textures/items/cl/c/circuito_controle_basico"
 },
 "cl:coalhada_queijo": {
  "pt": "Coalhada de Queijo",
  "en": "Cheese Curd",
  "icone": "textures/items/cl/c/coalhada_queijo"
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
  "icone": "textures/blocks/cl/c/coletor_oxigenio_topo"
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
 "cl:componente_me_16k": {
  "pt": "Componente ME 16k",
  "en": "16k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_16k"
 },
 "cl:componente_me_1k": {
  "pt": "Componente ME 1k",
  "en": "1k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_1k"
 },
 "cl:componente_me_4k": {
  "pt": "Componente ME 4k",
  "en": "4k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_4k"
 },
 "cl:componente_me_64k": {
  "pt": "Componente ME 64k",
  "en": "64k ME Storage Component",
  "icone": "textures/items/cl/arte/componente_me_64k"
 },
 "cl:compostadora": {
  "pt": "Compostadora",
  "en": "Composter",
  "icone": "textures/items/cl/arte/blocos/compostadora"
 },
 "cl:composto_aglutinante": {
  "pt": "Composto Aglutinante",
  "en": "Binder Composite",
  "icone": "textures/items/cl/c/composto_aglutinante"
 },
 "cl:compostor": {
  "pt": "Compostor de Terra",
  "en": "Dirt Composter",
  "icone": "textures/items/cl/arte/blocos/compostor"
 },
 "cl:compressor": {
  "pt": "Compressor",
  "en": "Compressor",
  "icone": "textures/blocks/cl/c/compressor_topo"
 },
 "cl:compressor_ar": {
  "pt": "Compressor de Ar",
  "en": "Air Compressor",
  "icone": "textures/items/cl/arte/blocos/compressor_ar"
 },
 "cl:compressor_eletrico": {
  "pt": "Compressor Elétrico",
  "en": "Electric Compressor",
  "icone": "textures/blocks/cl/c/compressor_eletrico_topo"
 },
 "cl:compressor_oxigenio": {
  "pt": "Compressor de Oxigênio",
  "en": "Oxygen Compressor",
  "icone": "textures/blocks/cl/c/compressor_oxigenio_topo"
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
 "cl:construtor_corpos": {
  "pt": "Construtor de Corpos",
  "en": "Shell Constructor",
  "icone": "textures/items/cl/arte/blocos/construtor_corpos"
 },
 "cl:construtor_pecas": {
  "pt": "Construtor de Peças",
  "en": "Part Builder",
  "icone": "textures/items/cl/arte/blocos/construtor_pecas"
 },
 "cl:controlador_fundicao": {
  "pt": "Controlador da Fundição",
  "en": "Smeltery Controller",
  "icone": "textures/items/cl/arte/blocos/controlador_fundicao"
 },
 "cl:controlador_me": {
  "pt": "Controlador ME",
  "en": "ME Controller",
  "icone": "textures/items/cl/arte/blocos/controlador_me"
 },
 "cl:controlador_reator": {
  "pt": "Controlador do Reator",
  "en": "Reactor Controller",
  "icone": "textures/items/cl/arte/blocos/controlador_reator"
 },
 "cl:controlador_velocidade": {
  "pt": "Controlador de Velocidade",
  "en": "Rotation Speed Controller",
  "icone": "textures/blocks/cl/c/controlador_velocidade_topo"
 },
 "cl:coracao_farao": {
  "pt": "Coração do Faraó",
  "en": "Pharaoh's Heart",
  "icone": "textures/items/cl/arte/coracao_farao"
 },
 "cl:cristal_certus": {
  "pt": "Cristal de Certus",
  "en": "Certus Quartz Crystal",
  "icone": "textures/items/cl/arte/cristal_certus"
 },
 "cl:cristal_fluix": {
  "pt": "Cristal Fluix",
  "en": "Fluix Crystal",
  "icone": "textures/items/cl/arte/cristal_fluix"
 },
 "cl:cristal_pulsante": {
  "pt": "Cristal Pulsante",
  "en": "Pulsating Crystal",
  "icone": "textures/items/cl/c/cristal_pulsante"
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
  "pt": "Cubo de Energia Definitivo",
  "en": "Ultimate Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_definitivo"
 },
 "cl:cubo_energia_elite": {
  "pt": "Cubo de Energia de Elite",
  "en": "Elite Energy Cube",
  "icone": "textures/items/cl/arte/blocos/cubo_energia_elite"
 },
 "cl:diario_bordo": {
  "pt": "Diário de Bordo",
  "en": "Logbook",
  "icone": "textures/items/cl/arte/diario_bordo"
 },
 "cl:dinamo_redstone": {
  "pt": "Dínamo de Redstone",
  "en": "Enervation Dynamo",
  "icone": "textures/items/cl/arte/blocos/dinamo_redstone"
 },
 "cl:distribuidor_oxigenio": {
  "pt": "Distribuidor de Bolha de Oxigênio",
  "en": "Oxygen Bubble Distributor",
  "icone": "textures/blocks/cl/c/distribuidor_oxigenio_topo"
 },
 "cl:dreno_fundicao": {
  "pt": "Dreno",
  "en": "Smeltery Drain",
  "icone": "textures/items/cl/arte/blocos/dreno_fundicao"
 },
 "cl:drive_me": {
  "pt": "Drive ME",
  "en": "ME Drive",
  "icone": "textures/items/cl/arte/blocos/drive_me"
 },
 "cl:eio_botas_aco_negro": {
  "pt": "Botas de Aço Negro",
  "en": "Dark Steel Boots",
  "icone": "textures/items/cl/c/eio_botas_aco_negro"
 },
 "cl:eio_calcas_aco_negro": {
  "pt": "Calças de Aço Negro",
  "en": "Dark Steel Leggings",
  "icone": "textures/items/cl/c/eio_calcas_aco_negro"
 },
 "cl:eio_capacete_aco_negro": {
  "pt": "Capacete de Aço Negro",
  "en": "Dark Steel Helmet",
  "icone": "textures/items/cl/c/eio_capacete_aco_negro"
 },
 "cl:eio_espada_aco_negro": {
  "pt": "Espada de Aço Negro",
  "en": "Dark Steel Sword",
  "icone": "textures/items/cl/c/eio_espada_aco_negro"
 },
 "cl:eio_machado_aco_negro": {
  "pt": "Machado de Aço Negro",
  "en": "Dark Steel Axe",
  "icone": "textures/items/cl/c/eio_machado_aco_negro"
 },
 "cl:eio_peitoral_aco_negro": {
  "pt": "Peitoral de Aço Negro",
  "en": "Dark Steel Chestplate",
  "icone": "textures/items/cl/c/eio_peitoral_aco_negro"
 },
 "cl:eio_picareta_aco_negro": {
  "pt": "Picareta de Aço Negro",
  "en": "Dark Steel Pickaxe",
  "icone": "textures/items/cl/c/eio_picareta_aco_negro"
 },
 "cl:eixo": {
  "pt": "Eixo",
  "en": "Shaft",
  "icone": "textures/blocks/cl/c/eixo"
 },
 "cl:elevador": {
  "pt": "Elevador",
  "en": "Elevator",
  "icone": "textures/blocks/cl/arte/elevador_topo"
 },
 "cl:empacotador": {
  "pt": "Empacotador Automático",
  "en": "AutoPackager",
  "icone": "textures/items/cl/arte/blocos/empacotador"
 },
 "cl:engrenagem": {
  "pt": "Engrenagem",
  "en": "Cogwheel",
  "icone": "textures/blocks/cl/c/engrenagem"
 },
 "cl:engrenagem_aco_negro": {
  "pt": "Engrenagem de Aço Negro",
  "en": "Dark Bimetal Gear",
  "icone": "textures/items/cl/c/engrenagem_aco_negro"
 },
 "cl:engrenagem_diamante": {
  "pt": "Engrenagem de Diamante",
  "en": "Diamond Gear",
  "icone": "textures/items/cl/arte/engrenagem_diamante"
 },
 "cl:engrenagem_ferro": {
  "pt": "Engrenagem de Ferro",
  "en": "Iron Gear",
  "icone": "textures/items/cl/arte/engrenagem_ferro"
 },
 "cl:engrenagem_grande": {
  "pt": "Engrenagem Grande",
  "en": "Large Cogwheel",
  "icone": "textures/blocks/cl/c/engrenagem_grande"
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
 "cl:equipamento_oxigenio": {
  "pt": "Equipamento de Oxigênio",
  "en": "Oxygen Gear",
  "icone": "textures/items/cl/c/equipamento_oxigenio"
 },
 "cl:esgoto": {
  "pt": "Esgoto",
  "en": "Sewer",
  "icone": "textures/items/cl/arte/blocos/esgoto"
 },
 "cl:espada_larga_aco": {
  "pt": "Espada Larga de Aço",
  "en": "Steel Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_aco"
 },
 "cl:espada_larga_bronze": {
  "pt": "Espada Larga de Bronze",
  "en": "Bronze Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_bronze"
 },
 "cl:espada_larga_cacto": {
  "pt": "Espada Larga de Cacto",
  "en": "Cactus Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_cacto"
 },
 "cl:espada_larga_cobre": {
  "pt": "Espada Larga de Cobre",
  "en": "Copper Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_cobre"
 },
 "cl:espada_larga_ferro": {
  "pt": "Espada Larga de Ferro",
  "en": "Iron Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_ferro"
 },
 "cl:espada_larga_madeira": {
  "pt": "Espada Larga de Madeira",
  "en": "Wood Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_madeira"
 },
 "cl:espada_larga_obsidiana": {
  "pt": "Espada Larga de Obsidiana",
  "en": "Obsidian Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_obsidiana"
 },
 "cl:espada_larga_osso": {
  "pt": "Espada Larga de Osso",
  "en": "Bone Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_osso"
 },
 "cl:espada_larga_pedra": {
  "pt": "Espada Larga de Pedra",
  "en": "Stone Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_pedra"
 },
 "cl:espada_larga_silex": {
  "pt": "Espada Larga de Sílex",
  "en": "Flint Broadsword",
  "icone": "textures/items/cl/arte/espada_larga_silex"
 },
 "cl:espremedor": {
  "pt": "Espremedor",
  "en": "Juicer",
  "icone": "textures/items/cl/arte/blocos/espremedor"
 },
 "cl:estacao_ferramentas": {
  "pt": "Estação de Ferramentas",
  "en": "Tool Station",
  "icone": "textures/items/cl/arte/blocos/estacao_ferramentas"
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
  "icone": "textures/items/cl/arte/blocos/evaporador"
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
  "icone": "textures/blocks/cl/c/fabricador_circuitos_topo"
 },
 "cl:faca_corte": {
  "pt": "Faca de Corte",
  "en": "Quartz Cutting Knife",
  "icone": "textures/items/cl/arte/faca_corte"
 },
 "cl:faixa_mumia": {
  "pt": "Faixa de Múmia",
  "en": "Mummy Wrap",
  "icone": "textures/items/cl/arte/faixa_mumia"
 },
 "cl:farinha": {
  "pt": "Farinha",
  "en": "Flour",
  "icone": "textures/items/cl/arte/farinha"
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
  "pt": "Lingote de Ferro Condutor",
  "en": "Conductive Iron Ingot",
  "icone": "textures/items/cl/c/ferro_condutor"
 },
 "cl:ferro_po": {
  "pt": "Pó de Minério de Ferro",
  "en": "Powdered Iron Ore",
  "icone": "textures/items/cl/arte/ferro_po"
 },
 "cl:ferro_pulsante": {
  "pt": "Lingote de Ferro Pulsante",
  "en": "Pulsating Iron Ingot",
  "icone": "textures/items/cl/c/ferro_pulsante"
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
 "cl:filtro": {
  "pt": "Filtro de Ar",
  "en": "Air Filter",
  "icone": "textures/items/cl/arte/filtro"
 },
 "cl:foguete_t1": {
  "pt": "Foguete Tier 1",
  "en": "Tier 1 Rocket",
  "icone": "textures/items/cl/c/foguete_t1"
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
 "cl:fornalha_redstone": {
  "pt": "Fornalha de Redstone",
  "en": "Redstone Furnace",
  "icone": "textures/items/cl/arte/blocos/fornalha_redstone"
 },
 "cl:fragmento_meteorito": {
  "pt": "Fragmento de Meteorito",
  "en": "Meteorite Fragment",
  "icone": "textures/items/cl/arte/fragmento_meteorito"
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
 "cl:fundidora_inducao": {
  "pt": "Fundidora de Indução",
  "en": "Induction Smelter",
  "icone": "textures/items/cl/arte/blocos/fundidora_inducao"
 },
 "cl:fundidora_ligas": {
  "pt": "Fundidora de Ligas",
  "en": "Alloy Smelter",
  "icone": "textures/blocks/cl/c/fundidora_ligas_topo"
 },
 "cl:furadeira": {
  "pt": "Furadeira Mecânica",
  "en": "Mechanical Drill",
  "icone": "textures/blocks/cl/c/furadeira_topo"
 },
 "cl:gerador": {
  "pt": "Gerador a Carvão",
  "en": "Coal Generator",
  "icone": "textures/items/cl/arte/blocos/gerador"
 },
 "cl:gerador_bio": {
  "pt": "Biogerador",
  "en": "Bio-Generator",
  "icone": "textures/blocks/cl/c/gerador_bio_topo"
 },
 "cl:gerador_blaze": {
  "pt": "Gerador de Blazes",
  "en": "Blaze Spawner",
  "icone": "textures/items/cl/arte/blocos/gerador_blaze"
 },
 "cl:gerador_calor": {
  "pt": "Gerador a Calor",
  "en": "Heat Generator",
  "icone": "textures/blocks/cl/c/gerador_calor_topo"
 },
 "cl:gerador_eolico": {
  "pt": "Turbina Eólica",
  "en": "Wind Generator",
  "icone": "textures/blocks/cl/c/gerador_eolico_topo"
 },
 "cl:gerador_gas": {
  "pt": "Gerador a Gás",
  "en": "Gas-Burning Generator",
  "icone": "textures/blocks/cl/c/gerador_gas_topo"
 },
 "cl:gerador_monstros": {
  "pt": "Gerador de Monstros",
  "en": "Monster Generator",
  "icone": "textures/items/cl/arte/blocos/gerador_monstros"
 },
 "cl:gerador_solar_avancado": {
  "pt": "Gerador Solar Avançado",
  "en": "Advanced Solar Generator",
  "icone": "textures/blocks/cl/c/gerador_solar_avancado_topo"
 },
 "cl:gerador_solar_mk": {
  "pt": "Gerador Solar",
  "en": "Solar Generator",
  "icone": "textures/blocks/cl/c/gerador_solar_mk_topo"
 },
 "cl:gerador_stirling": {
  "pt": "Gerador Stirling",
  "en": "Stirling Generator",
  "icone": "textures/blocks/cl/c/gerador_stirling_topo"
 },
 "cl:hamburguer": {
  "pt": "Hambúrguer",
  "en": "Hamburger",
  "icone": "textures/items/cl/arte/hamburguer"
 },
 "cl:helice": {
  "pt": "Hélice",
  "en": "Propeller",
  "icone": "textures/items/cl/c/helice"
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
 "cl:interface_camara": {
  "pt": "Interface da Câmara",
  "en": "Pressure Chamber Interface",
  "icone": "textures/items/cl/arte/blocos/interface_camara"
 },
 "cl:jetpack": {
  "pt": "Jetpack",
  "en": "Jetpack",
  "icone": "textures/items/cl/arte/jetpack"
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
  "icone": "textures/items/cl/c/liga_energetica"
 },
 "cl:liga_enriquecida": {
  "pt": "Liga Enriquecida",
  "en": "Enriched Alloy",
  "icone": "textures/items/cl/arte/liga_enriquecida"
 },
 "cl:liga_redstone": {
  "pt": "Lingote de Liga de Redstone",
  "en": "Redstone Alloy Ingot",
  "icone": "textures/items/cl/c/liga_redstone"
 },
 "cl:liga_reforcada": {
  "pt": "Liga Reforçada",
  "en": "Reinforced Alloy",
  "icone": "textures/items/cl/arte/liga_reforcada"
 },
 "cl:liga_vibrante": {
  "pt": "Lingote de Liga Vibrante",
  "en": "Vibrant Alloy Ingot",
  "icone": "textures/items/cl/c/liga_vibrante"
 },
 "cl:lingote_aco": {
  "pt": "Lingote de Aço",
  "en": "Steel Ingot",
  "icone": "textures/items/cl/arte/lingote_aco"
 },
 "cl:lingote_aluminio": {
  "pt": "Lingote de Alumínio",
  "en": "Aluminum Ingot",
  "icone": "textures/items/cl/c/lingote_aluminio"
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
 "cl:lingote_cianita": {
  "pt": "Lingote de Cianita",
  "en": "Cyanite Ingot",
  "icone": "textures/items/cl/arte/lingote_cianita"
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
 "cl:lingote_glowstone_refinado": {
  "pt": "Lingote de Glowstone Refinada",
  "en": "Refined Glowstone Ingot",
  "icone": "textures/items/cl/c/lingote_glowstone_refinado"
 },
 "cl:lingote_latao": {
  "pt": "Lingote de Latão",
  "en": "Brass Ingot",
  "icone": "textures/items/cl/c/lingote_latao"
 },
 "cl:lingote_obsidiana_refinada": {
  "pt": "Lingote de Obsidiana Refinada",
  "en": "Refined Obsidian Ingot",
  "icone": "textures/items/cl/c/lingote_obsidiana_refinada"
 },
 "cl:lingote_osmio": {
  "pt": "Lingote de Ósmio",
  "en": "Osmium Ingot",
  "icone": "textures/items/cl/c/lingote_osmio"
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
 "cl:machadinha_aco": {
  "pt": "Machadinha de Aço",
  "en": "Steel Hatchet",
  "icone": "textures/items/cl/arte/machadinha_aco"
 },
 "cl:machadinha_bronze": {
  "pt": "Machadinha de Bronze",
  "en": "Bronze Hatchet",
  "icone": "textures/items/cl/arte/machadinha_bronze"
 },
 "cl:machadinha_cacto": {
  "pt": "Machadinha de Cacto",
  "en": "Cactus Hatchet",
  "icone": "textures/items/cl/arte/machadinha_cacto"
 },
 "cl:machadinha_cobre": {
  "pt": "Machadinha de Cobre",
  "en": "Copper Hatchet",
  "icone": "textures/items/cl/arte/machadinha_cobre"
 },
 "cl:machadinha_ferro": {
  "pt": "Machadinha de Ferro",
  "en": "Iron Hatchet",
  "icone": "textures/items/cl/arte/machadinha_ferro"
 },
 "cl:machadinha_madeira": {
  "pt": "Machadinha de Madeira",
  "en": "Wood Hatchet",
  "icone": "textures/items/cl/arte/machadinha_madeira"
 },
 "cl:machadinha_obsidiana": {
  "pt": "Machadinha de Obsidiana",
  "en": "Obsidian Hatchet",
  "icone": "textures/items/cl/arte/machadinha_obsidiana"
 },
 "cl:machadinha_osso": {
  "pt": "Machadinha de Osso",
  "en": "Bone Hatchet",
  "icone": "textures/items/cl/arte/machadinha_osso"
 },
 "cl:machadinha_pedra": {
  "pt": "Machadinha de Pedra",
  "en": "Stone Hatchet",
  "icone": "textures/items/cl/arte/machadinha_pedra"
 },
 "cl:machadinha_silex": {
  "pt": "Machadinha de Sílex",
  "en": "Flint Hatchet",
  "icone": "textures/items/cl/arte/machadinha_silex"
 },
 "cl:maionese": {
  "pt": "Maionese",
  "en": "Mayonnaise",
  "icone": "textures/items/cl/arte/maionese"
 },
 "cl:manivela": {
  "pt": "Manivela",
  "en": "Hand Crank",
  "icone": "textures/blocks/cl/c/manivela_topo"
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
 "cl:marmore": {
  "pt": "Mármore",
  "en": "Marble",
  "icone": "textures/blocks/cl/arte/marmore"
 },
 "cl:marmore_entalhado": {
  "pt": "Mármore Entalhado",
  "en": "Carved Marble",
  "icone": "textures/blocks/cl/arte/marmore_entalhado"
 },
 "cl:marmore_ladrilho": {
  "pt": "Mármore Ladrilho",
  "en": "Tiles Marble",
  "icone": "textures/blocks/cl/arte/marmore_ladrilho"
 },
 "cl:marmore_liso": {
  "pt": "Mármore Liso",
  "en": "Smooth Marble",
  "icone": "textures/blocks/cl/arte/marmore_liso"
 },
 "cl:marmore_mosaico": {
  "pt": "Mármore Mosaico",
  "en": "Mosaic Marble",
  "icone": "textures/blocks/cl/arte/marmore_mosaico"
 },
 "cl:marmore_pilar": {
  "pt": "Mármore Pilar",
  "en": "Pillar Marble",
  "icone": "textures/blocks/cl/arte/marmore_pilar"
 },
 "cl:marmore_polido": {
  "pt": "Mármore Polido",
  "en": "Polished Marble",
  "icone": "textures/blocks/cl/arte/marmore_polido"
 },
 "cl:marmore_tijolos": {
  "pt": "Mármore Tijolos",
  "en": "Bricks Marble",
  "icone": "textures/blocks/cl/arte/marmore_tijolos"
 },
 "cl:marmore_tijolos_pequenos": {
  "pt": "Mármore Tijolinhos",
  "en": "Small Bricks Marble",
  "icone": "textures/blocks/cl/arte/marmore_tijolos_pequenos"
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
 "cl:mascara": {
  "pt": "Máscara de Gás",
  "en": "Gas Mask",
  "icone": "textures/items/cl/arte/mascara"
 },
 "cl:mascara_oxigenio": {
  "pt": "Máscara de Oxigênio",
  "en": "Oxygen Mask",
  "icone": "textures/items/cl/c/mascara_oxigenio"
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
 "cl:matriz_conversao": {
  "pt": "Matriz de Conversão",
  "en": "Conversion Matrix",
  "icone": "textures/items/cl/arte/matriz_conversao"
 },
 "cl:mesa_fundicao": {
  "pt": "Mesa de Fundição",
  "en": "Casting Table",
  "icone": "textures/items/cl/arte/blocos/mesa_fundicao"
 },
 "cl:mesa_moldes": {
  "pt": "Mesa de Moldes",
  "en": "Stencil Table",
  "icone": "textures/items/cl/arte/blocos/mesa_moldes"
 },
 "cl:meteorito": {
  "pt": "Rocha de Meteorito",
  "en": "Meteorite Rock",
  "icone": "textures/blocks/cl/arte/meteorito"
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
 "cl:minerio_cobre_lunar": {
  "pt": "Minério de Cobre Lunar",
  "en": "Moon Copper Ore",
  "icone": "textures/blocks/cl/c/minerio_cobre_lunar"
 },
 "cl:minerio_estanho_lunar": {
  "pt": "Minério de Estanho Lunar",
  "en": "Moon Tin Ore",
  "icone": "textures/blocks/cl/c/minerio_estanho_lunar"
 },
 "cl:minerio_queijo": {
  "pt": "Minério de Queijo",
  "en": "Cheese Ore",
  "icone": "textures/blocks/cl/c/minerio_queijo"
 },
 "cl:misturador_mecanico": {
  "pt": "Misturador Mecânico",
  "en": "Mechanical Mixer",
  "icone": "textures/blocks/cl/c/misturador_mecanico_topo"
 },
 "cl:mk_botas_aco": {
  "pt": "Botas de Aço",
  "en": "Steel Boots",
  "icone": "textures/items/cl/c/mk_botas_aco"
 },
 "cl:mk_botas_bronze": {
  "pt": "Botas de Bronze",
  "en": "Bronze Boots",
  "icone": "textures/items/cl/c/mk_botas_bronze"
 },
 "cl:mk_botas_glowstone": {
  "pt": "Botas de Glowstone Refinada",
  "en": "Refined Glowstone Boots",
  "icone": "textures/items/cl/c/mk_botas_glowstone"
 },
 "cl:mk_botas_lapis": {
  "pt": "Botas de Lápis-Lazúli",
  "en": "Lapis Lazuli Boots",
  "icone": "textures/items/cl/c/mk_botas_lapis"
 },
 "cl:mk_botas_obsidiana": {
  "pt": "Botas de Obsidiana Refinada",
  "en": "Refined Obsidian Boots",
  "icone": "textures/items/cl/c/mk_botas_obsidiana"
 },
 "cl:mk_botas_osmio": {
  "pt": "Botas de Ósmio",
  "en": "Osmium Boots",
  "icone": "textures/items/cl/c/mk_botas_osmio"
 },
 "cl:mk_calcas_aco": {
  "pt": "Calças de Aço",
  "en": "Steel Leggings",
  "icone": "textures/items/cl/c/mk_calcas_aco"
 },
 "cl:mk_calcas_bronze": {
  "pt": "Calças de Bronze",
  "en": "Bronze Leggings",
  "icone": "textures/items/cl/c/mk_calcas_bronze"
 },
 "cl:mk_calcas_glowstone": {
  "pt": "Calças de Glowstone Refinada",
  "en": "Refined Glowstone Leggings",
  "icone": "textures/items/cl/c/mk_calcas_glowstone"
 },
 "cl:mk_calcas_lapis": {
  "pt": "Calças de Lápis-Lazúli",
  "en": "Lapis Lazuli Leggings",
  "icone": "textures/items/cl/c/mk_calcas_lapis"
 },
 "cl:mk_calcas_obsidiana": {
  "pt": "Calças de Obsidiana Refinada",
  "en": "Refined Obsidian Leggings",
  "icone": "textures/items/cl/c/mk_calcas_obsidiana"
 },
 "cl:mk_calcas_osmio": {
  "pt": "Calças de Ósmio",
  "en": "Osmium Leggings",
  "icone": "textures/items/cl/c/mk_calcas_osmio"
 },
 "cl:mk_capacete_aco": {
  "pt": "Capacete de Aço",
  "en": "Steel Helmet",
  "icone": "textures/items/cl/c/mk_capacete_aco"
 },
 "cl:mk_capacete_bronze": {
  "pt": "Capacete de Bronze",
  "en": "Bronze Helmet",
  "icone": "textures/items/cl/c/mk_capacete_bronze"
 },
 "cl:mk_capacete_glowstone": {
  "pt": "Capacete de Glowstone Refinada",
  "en": "Refined Glowstone Helmet",
  "icone": "textures/items/cl/c/mk_capacete_glowstone"
 },
 "cl:mk_capacete_lapis": {
  "pt": "Capacete de Lápis-Lazúli",
  "en": "Lapis Lazuli Helmet",
  "icone": "textures/items/cl/c/mk_capacete_lapis"
 },
 "cl:mk_capacete_obsidiana": {
  "pt": "Capacete de Obsidiana Refinada",
  "en": "Refined Obsidian Helmet",
  "icone": "textures/items/cl/c/mk_capacete_obsidiana"
 },
 "cl:mk_capacete_osmio": {
  "pt": "Capacete de Ósmio",
  "en": "Osmium Helmet",
  "icone": "textures/items/cl/c/mk_capacete_osmio"
 },
 "cl:mk_enxada_aco": {
  "pt": "Enxada de Aço",
  "en": "Steel Hoe",
  "icone": "textures/items/cl/c/mk_enxada_aco"
 },
 "cl:mk_enxada_bronze": {
  "pt": "Enxada de Bronze",
  "en": "Bronze Hoe",
  "icone": "textures/items/cl/c/mk_enxada_bronze"
 },
 "cl:mk_enxada_glowstone": {
  "pt": "Enxada de Glowstone Refinada",
  "en": "Refined Glowstone Hoe",
  "icone": "textures/items/cl/c/mk_enxada_glowstone"
 },
 "cl:mk_enxada_lapis": {
  "pt": "Enxada de Lápis-Lazúli",
  "en": "Lapis Lazuli Hoe",
  "icone": "textures/items/cl/c/mk_enxada_lapis"
 },
 "cl:mk_enxada_obsidiana": {
  "pt": "Enxada de Obsidiana Refinada",
  "en": "Refined Obsidian Hoe",
  "icone": "textures/items/cl/c/mk_enxada_obsidiana"
 },
 "cl:mk_enxada_osmio": {
  "pt": "Enxada de Ósmio",
  "en": "Osmium Hoe",
  "icone": "textures/items/cl/c/mk_enxada_osmio"
 },
 "cl:mk_espada_aco": {
  "pt": "Espada de Aço",
  "en": "Steel Sword",
  "icone": "textures/items/cl/c/mk_espada_aco"
 },
 "cl:mk_espada_bronze": {
  "pt": "Espada de Bronze",
  "en": "Bronze Sword",
  "icone": "textures/items/cl/c/mk_espada_bronze"
 },
 "cl:mk_espada_glowstone": {
  "pt": "Espada de Glowstone Refinada",
  "en": "Refined Glowstone Sword",
  "icone": "textures/items/cl/c/mk_espada_glowstone"
 },
 "cl:mk_espada_lapis": {
  "pt": "Espada de Lápis-Lazúli",
  "en": "Lapis Lazuli Sword",
  "icone": "textures/items/cl/c/mk_espada_lapis"
 },
 "cl:mk_espada_obsidiana": {
  "pt": "Espada de Obsidiana Refinada",
  "en": "Refined Obsidian Sword",
  "icone": "textures/items/cl/c/mk_espada_obsidiana"
 },
 "cl:mk_espada_osmio": {
  "pt": "Espada de Ósmio",
  "en": "Osmium Sword",
  "icone": "textures/items/cl/c/mk_espada_osmio"
 },
 "cl:mk_machado_aco": {
  "pt": "Machado de Aço",
  "en": "Steel Axe",
  "icone": "textures/items/cl/c/mk_machado_aco"
 },
 "cl:mk_machado_bronze": {
  "pt": "Machado de Bronze",
  "en": "Bronze Axe",
  "icone": "textures/items/cl/c/mk_machado_bronze"
 },
 "cl:mk_machado_glowstone": {
  "pt": "Machado de Glowstone Refinada",
  "en": "Refined Glowstone Axe",
  "icone": "textures/items/cl/c/mk_machado_glowstone"
 },
 "cl:mk_machado_lapis": {
  "pt": "Machado de Lápis-Lazúli",
  "en": "Lapis Lazuli Axe",
  "icone": "textures/items/cl/c/mk_machado_lapis"
 },
 "cl:mk_machado_obsidiana": {
  "pt": "Machado de Obsidiana Refinada",
  "en": "Refined Obsidian Axe",
  "icone": "textures/items/cl/c/mk_machado_obsidiana"
 },
 "cl:mk_machado_osmio": {
  "pt": "Machado de Ósmio",
  "en": "Osmium Axe",
  "icone": "textures/items/cl/c/mk_machado_osmio"
 },
 "cl:mk_pa_aco": {
  "pt": "Pá de Aço",
  "en": "Steel Shovel",
  "icone": "textures/items/cl/c/mk_pa_aco"
 },
 "cl:mk_pa_bronze": {
  "pt": "Pá de Bronze",
  "en": "Bronze Shovel",
  "icone": "textures/items/cl/c/mk_pa_bronze"
 },
 "cl:mk_pa_glowstone": {
  "pt": "Pá de Glowstone Refinada",
  "en": "Refined Glowstone Shovel",
  "icone": "textures/items/cl/c/mk_pa_glowstone"
 },
 "cl:mk_pa_lapis": {
  "pt": "Pá de Lápis-Lazúli",
  "en": "Lapis Lazuli Shovel",
  "icone": "textures/items/cl/c/mk_pa_lapis"
 },
 "cl:mk_pa_obsidiana": {
  "pt": "Pá de Obsidiana Refinada",
  "en": "Refined Obsidian Shovel",
  "icone": "textures/items/cl/c/mk_pa_obsidiana"
 },
 "cl:mk_pa_osmio": {
  "pt": "Pá de Ósmio",
  "en": "Osmium Shovel",
  "icone": "textures/items/cl/c/mk_pa_osmio"
 },
 "cl:mk_paxel_aco": {
  "pt": "Paxel de Aço",
  "en": "Steel Paxel",
  "icone": "textures/items/cl/c/mk_paxel_aco"
 },
 "cl:mk_paxel_bronze": {
  "pt": "Paxel de Bronze",
  "en": "Bronze Paxel",
  "icone": "textures/items/cl/c/mk_paxel_bronze"
 },
 "cl:mk_paxel_diamante": {
  "pt": "Paxel de Diamante",
  "en": "Diamond Paxel",
  "icone": "textures/items/cl/c/mk_paxel_diamante"
 },
 "cl:mk_paxel_ferro": {
  "pt": "Paxel de Ferro",
  "en": "Iron Paxel",
  "icone": "textures/items/cl/c/mk_paxel_ferro"
 },
 "cl:mk_paxel_glowstone": {
  "pt": "Paxel de Glowstone Refinada",
  "en": "Refined Glowstone Paxel",
  "icone": "textures/items/cl/c/mk_paxel_glowstone"
 },
 "cl:mk_paxel_lapis": {
  "pt": "Paxel de Lápis-Lazúli",
  "en": "Lapis Lazuli Paxel",
  "icone": "textures/items/cl/c/mk_paxel_lapis"
 },
 "cl:mk_paxel_madeira": {
  "pt": "Paxel de Madeira",
  "en": "Wooden Paxel",
  "icone": "textures/items/cl/c/mk_paxel_madeira"
 },
 "cl:mk_paxel_obsidiana": {
  "pt": "Paxel de Obsidiana Refinada",
  "en": "Refined Obsidian Paxel",
  "icone": "textures/items/cl/c/mk_paxel_obsidiana"
 },
 "cl:mk_paxel_osmio": {
  "pt": "Paxel de Ósmio",
  "en": "Osmium Paxel",
  "icone": "textures/items/cl/c/mk_paxel_osmio"
 },
 "cl:mk_paxel_ouro": {
  "pt": "Paxel de Ouro",
  "en": "Golden Paxel",
  "icone": "textures/items/cl/c/mk_paxel_ouro"
 },
 "cl:mk_paxel_pedra": {
  "pt": "Paxel de Pedra",
  "en": "Stone Paxel",
  "icone": "textures/items/cl/c/mk_paxel_pedra"
 },
 "cl:mk_peitoral_aco": {
  "pt": "Peitoral de Aço",
  "en": "Steel Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_aco"
 },
 "cl:mk_peitoral_bronze": {
  "pt": "Peitoral de Bronze",
  "en": "Bronze Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_bronze"
 },
 "cl:mk_peitoral_glowstone": {
  "pt": "Peitoral de Glowstone Refinada",
  "en": "Refined Glowstone Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_glowstone"
 },
 "cl:mk_peitoral_lapis": {
  "pt": "Peitoral de Lápis-Lazúli",
  "en": "Lapis Lazuli Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_lapis"
 },
 "cl:mk_peitoral_obsidiana": {
  "pt": "Peitoral de Obsidiana Refinada",
  "en": "Refined Obsidian Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_obsidiana"
 },
 "cl:mk_peitoral_osmio": {
  "pt": "Peitoral de Ósmio",
  "en": "Osmium Chestplate",
  "icone": "textures/items/cl/c/mk_peitoral_osmio"
 },
 "cl:mk_picareta_aco": {
  "pt": "Picareta de Aço",
  "en": "Steel Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_aco"
 },
 "cl:mk_picareta_bronze": {
  "pt": "Picareta de Bronze",
  "en": "Bronze Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_bronze"
 },
 "cl:mk_picareta_glowstone": {
  "pt": "Picareta de Glowstone Refinada",
  "en": "Refined Glowstone Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_glowstone"
 },
 "cl:mk_picareta_lapis": {
  "pt": "Picareta de Lápis-Lazúli",
  "en": "Lapis Lazuli Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_lapis"
 },
 "cl:mk_picareta_obsidiana": {
  "pt": "Picareta de Obsidiana Refinada",
  "en": "Refined Obsidian Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_obsidiana"
 },
 "cl:mk_picareta_osmio": {
  "pt": "Picareta de Ósmio",
  "en": "Osmium Pickaxe",
  "icone": "textures/items/cl/c/mk_picareta_osmio"
 },
 "cl:mo": {
  "pt": "Mó",
  "en": "Millstone",
  "icone": "textures/blocks/cl/c/mo_topo"
 },
 "cl:moinho": {
  "pt": "Moinho de Vento",
  "en": "Windmill",
  "icone": "textures/items/cl/arte/blocos/moinho"
 },
 "cl:moinho_sag": {
  "pt": "Moinho SAG",
  "en": "SAG Mill",
  "icone": "textures/blocks/cl/c/moinho_sag_topo"
 },
 "cl:molde_cabeca_machado": {
  "pt": "Molde: Cabeça de Machado",
  "en": "Hatchet Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_machado"
 },
 "cl:molde_cabeca_pa": {
  "pt": "Molde: Cabeça de Pá",
  "en": "Shovel Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_pa"
 },
 "cl:molde_cabeca_picareta": {
  "pt": "Molde: Cabeça de Picareta",
  "en": "Pickaxe Head Cast",
  "icone": "textures/items/cl/arte/molde_cabeca_picareta"
 },
 "cl:molde_cabo": {
  "pt": "Molde: Cabo",
  "en": "Tool Rod Cast",
  "icone": "textures/items/cl/arte/molde_cabo"
 },
 "cl:molde_guarda_larga": {
  "pt": "Molde: Guarda Larga",
  "en": "Wide Guard Cast",
  "icone": "textures/items/cl/arte/molde_guarda_larga"
 },
 "cl:molde_lamina_espada": {
  "pt": "Molde: Lâmina de Espada",
  "en": "Sword Blade Cast",
  "icone": "textures/items/cl/arte/molde_lamina_espada"
 },
 "cl:molde_ligacao": {
  "pt": "Molde: Ligação",
  "en": "Binding Cast",
  "icone": "textures/items/cl/arte/molde_ligacao"
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
 "cl:molde_travessa": {
  "pt": "Molde: Travessa",
  "en": "Crossbar Cast",
  "icone": "textures/items/cl/arte/molde_travessa"
 },
 "cl:montador_molecular": {
  "pt": "Montador Molecular",
  "en": "Molecular Assembler",
  "icone": "textures/items/cl/arte/blocos/montador_molecular"
 },
 "cl:montadora": {
  "pt": "Montadora",
  "en": "Assembler",
  "icone": "textures/items/cl/arte/blocos/montadora"
 },
 "cl:motor_combustao": {
  "pt": "Motor a Combustão",
  "en": "Combustion Engine",
  "icone": "textures/items/cl/arte/blocos/motor_combustao"
 },
 "cl:motor_foguete": {
  "pt": "Motor do Foguete Tier 1",
  "en": "Tier 1 Rocket Engine",
  "icone": "textures/items/cl/c/motor_foguete"
 },
 "cl:motor_nave": {
  "pt": "Motor da Nave",
  "en": "Ship Engine",
  "icone": "textures/items/cl/arte/motor_nave"
 },
 "cl:muda_tamareira": {
  "pt": "Muda de Tamareira",
  "en": "Date Palm Sapling",
  "icone": "textures/blocks/cl/arte/muda_tamareira"
 },
 "cl:nucleo_eletrolitico": {
  "pt": "Núcleo Eletrolítico",
  "en": "Electrolytic Core",
  "icone": "textures/items/cl/c/nucleo_eletrolitico"
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
 "cl:omelete": {
  "pt": "Omelete",
  "en": "Omelet",
  "icone": "textures/items/cl/arte/omelete"
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
 "cl:padrao_cabeca_machado": {
  "pt": "Padrão: Cabeça de Machado",
  "en": "Hatchet Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_machado"
 },
 "cl:padrao_cabeca_pa": {
  "pt": "Padrão: Cabeça de Pá",
  "en": "Shovel Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_pa"
 },
 "cl:padrao_cabeca_picareta": {
  "pt": "Padrão: Cabeça de Picareta",
  "en": "Pickaxe Head Pattern",
  "icone": "textures/items/cl/arte/padrao_cabeca_picareta"
 },
 "cl:padrao_cabo": {
  "pt": "Padrão: Cabo",
  "en": "Tool Rod Pattern",
  "icone": "textures/items/cl/arte/padrao_cabo"
 },
 "cl:padrao_guarda_larga": {
  "pt": "Padrão: Guarda Larga",
  "en": "Wide Guard Pattern",
  "icone": "textures/items/cl/arte/padrao_guarda_larga"
 },
 "cl:padrao_lamina_espada": {
  "pt": "Padrão: Lâmina de Espada",
  "en": "Sword Blade Pattern",
  "icone": "textures/items/cl/arte/padrao_lamina_espada"
 },
 "cl:padrao_ligacao": {
  "pt": "Padrão: Ligação",
  "en": "Binding Pattern",
  "icone": "textures/items/cl/arte/padrao_ligacao"
 },
 "cl:padrao_me_vazio": {
  "pt": "Padrão ME em Branco",
  "en": "Blank Pattern",
  "icone": "textures/items/cl/arte/padrao_me_vazio"
 },
 "cl:padrao_travessa": {
  "pt": "Padrão: Travessa",
  "en": "Crossbar Pattern",
  "icone": "textures/items/cl/arte/padrao_travessa"
 },
 "cl:painel_fotovoltaico": {
  "pt": "Painel Fotovoltaico",
  "en": "Photovoltaic Cell",
  "icone": "textures/blocks/cl/c/painel_fotovoltaico_topo"
 },
 "cl:painel_fotovoltaico_avancado": {
  "pt": "Painel Fotovoltaico Avançado",
  "en": "Advanced Photovoltaic Cell",
  "icone": "textures/blocks/cl/c/painel_fotovoltaico_avancado_topo"
 },
 "cl:painel_fotovoltaico_vibrante": {
  "pt": "Painel Fotovoltaico Vibrante",
  "en": "Vibrant Photovoltaic Cell",
  "icone": "textures/blocks/cl/c/painel_fotovoltaico_vibrante_topo"
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
 "cl:painel_solar_mk": {
  "pt": "Painel Solar (Mekanism)",
  "en": "Solar Panel",
  "icone": "textures/items/cl/c/painel_solar_mk"
 },
 "cl:panela": {
  "pt": "Panela",
  "en": "Pot",
  "icone": "textures/items/cl/arte/blocos/panela"
 },
 "cl:panquecas": {
  "pt": "Panquecas",
  "en": "Pancakes",
  "icone": "textures/items/cl/arte/panquecas"
 },
 "cl:parede_camara": {
  "pt": "Parede da Câmara de Pressão",
  "en": "Pressure Chamber Wall",
  "icone": "textures/blocks/cl/arte/parede_camara"
 },
 "cl:peca_cabeca_machado_aco": {
  "pt": "Cabeça de Machado de Aço",
  "en": "Steel Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_aco"
 },
 "cl:peca_cabeca_machado_bronze": {
  "pt": "Cabeça de Machado de Bronze",
  "en": "Bronze Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_bronze"
 },
 "cl:peca_cabeca_machado_cacto": {
  "pt": "Cabeça de Machado de Cacto",
  "en": "Cactus Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_cacto"
 },
 "cl:peca_cabeca_machado_cobre": {
  "pt": "Cabeça de Machado de Cobre",
  "en": "Copper Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_cobre"
 },
 "cl:peca_cabeca_machado_ferro": {
  "pt": "Cabeça de Machado de Ferro",
  "en": "Iron Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_ferro"
 },
 "cl:peca_cabeca_machado_madeira": {
  "pt": "Cabeça de Machado de Madeira",
  "en": "Wood Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_madeira"
 },
 "cl:peca_cabeca_machado_obsidiana": {
  "pt": "Cabeça de Machado de Obsidiana",
  "en": "Obsidian Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_obsidiana"
 },
 "cl:peca_cabeca_machado_osso": {
  "pt": "Cabeça de Machado de Osso",
  "en": "Bone Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_osso"
 },
 "cl:peca_cabeca_machado_pedra": {
  "pt": "Cabeça de Machado de Pedra",
  "en": "Stone Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_pedra"
 },
 "cl:peca_cabeca_machado_silex": {
  "pt": "Cabeça de Machado de Sílex",
  "en": "Flint Hatchet Head",
  "icone": "textures/items/cl/arte/peca_cabeca_machado_silex"
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
  "en": "Steel Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_aco"
 },
 "cl:peca_cabeca_picareta_bronze": {
  "pt": "Cabeça de Picareta de Bronze",
  "en": "Bronze Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_bronze"
 },
 "cl:peca_cabeca_picareta_cacto": {
  "pt": "Cabeça de Picareta de Cacto",
  "en": "Cactus Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_cacto"
 },
 "cl:peca_cabeca_picareta_cobre": {
  "pt": "Cabeça de Picareta de Cobre",
  "en": "Copper Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_cobre"
 },
 "cl:peca_cabeca_picareta_ferro": {
  "pt": "Cabeça de Picareta de Ferro",
  "en": "Iron Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_ferro"
 },
 "cl:peca_cabeca_picareta_madeira": {
  "pt": "Cabeça de Picareta de Madeira",
  "en": "Wood Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_madeira"
 },
 "cl:peca_cabeca_picareta_obsidiana": {
  "pt": "Cabeça de Picareta de Obsidiana",
  "en": "Obsidian Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_obsidiana"
 },
 "cl:peca_cabeca_picareta_osso": {
  "pt": "Cabeça de Picareta de Osso",
  "en": "Bone Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_osso"
 },
 "cl:peca_cabeca_picareta_pedra": {
  "pt": "Cabeça de Picareta de Pedra",
  "en": "Stone Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_pedra"
 },
 "cl:peca_cabeca_picareta_silex": {
  "pt": "Cabeça de Picareta de Sílex",
  "en": "Flint Pickaxe Head",
  "icone": "textures/items/cl/arte/peca_cabeca_picareta_silex"
 },
 "cl:peca_cabo_aco": {
  "pt": "Cabo de Aço",
  "en": "Steel Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_aco"
 },
 "cl:peca_cabo_bronze": {
  "pt": "Cabo de Bronze",
  "en": "Bronze Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_bronze"
 },
 "cl:peca_cabo_cacto": {
  "pt": "Cabo de Cacto",
  "en": "Cactus Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_cacto"
 },
 "cl:peca_cabo_cobre": {
  "pt": "Cabo de Cobre",
  "en": "Copper Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_cobre"
 },
 "cl:peca_cabo_ferro": {
  "pt": "Cabo de Ferro",
  "en": "Iron Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_ferro"
 },
 "cl:peca_cabo_madeira": {
  "pt": "Cabo de Madeira",
  "en": "Wood Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_madeira"
 },
 "cl:peca_cabo_obsidiana": {
  "pt": "Cabo de Obsidiana",
  "en": "Obsidian Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_obsidiana"
 },
 "cl:peca_cabo_osso": {
  "pt": "Cabo de Osso",
  "en": "Bone Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_osso"
 },
 "cl:peca_cabo_pedra": {
  "pt": "Cabo de Pedra",
  "en": "Stone Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_pedra"
 },
 "cl:peca_cabo_silex": {
  "pt": "Cabo de Sílex",
  "en": "Flint Tool Rod",
  "icone": "textures/items/cl/arte/peca_cabo_silex"
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
  "pt": "Lâmina de Espada de Aço",
  "en": "Steel Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_aco"
 },
 "cl:peca_lamina_espada_bronze": {
  "pt": "Lâmina de Espada de Bronze",
  "en": "Bronze Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_bronze"
 },
 "cl:peca_lamina_espada_cacto": {
  "pt": "Lâmina de Espada de Cacto",
  "en": "Cactus Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_cacto"
 },
 "cl:peca_lamina_espada_cobre": {
  "pt": "Lâmina de Espada de Cobre",
  "en": "Copper Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_cobre"
 },
 "cl:peca_lamina_espada_ferro": {
  "pt": "Lâmina de Espada de Ferro",
  "en": "Iron Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_ferro"
 },
 "cl:peca_lamina_espada_madeira": {
  "pt": "Lâmina de Espada de Madeira",
  "en": "Wood Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_madeira"
 },
 "cl:peca_lamina_espada_obsidiana": {
  "pt": "Lâmina de Espada de Obsidiana",
  "en": "Obsidian Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_obsidiana"
 },
 "cl:peca_lamina_espada_osso": {
  "pt": "Lâmina de Espada de Osso",
  "en": "Bone Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_osso"
 },
 "cl:peca_lamina_espada_pedra": {
  "pt": "Lâmina de Espada de Pedra",
  "en": "Stone Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_pedra"
 },
 "cl:peca_lamina_espada_silex": {
  "pt": "Lâmina de Espada de Sílex",
  "en": "Flint Sword Blade",
  "icone": "textures/items/cl/arte/peca_lamina_espada_silex"
 },
 "cl:peca_ligacao_aco": {
  "pt": "Ligação de Aço",
  "en": "Steel Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_aco"
 },
 "cl:peca_ligacao_bronze": {
  "pt": "Ligação de Bronze",
  "en": "Bronze Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_bronze"
 },
 "cl:peca_ligacao_cacto": {
  "pt": "Ligação de Cacto",
  "en": "Cactus Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_cacto"
 },
 "cl:peca_ligacao_cobre": {
  "pt": "Ligação de Cobre",
  "en": "Copper Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_cobre"
 },
 "cl:peca_ligacao_ferro": {
  "pt": "Ligação de Ferro",
  "en": "Iron Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_ferro"
 },
 "cl:peca_ligacao_madeira": {
  "pt": "Ligação de Madeira",
  "en": "Wood Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_madeira"
 },
 "cl:peca_ligacao_obsidiana": {
  "pt": "Ligação de Obsidiana",
  "en": "Obsidian Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_obsidiana"
 },
 "cl:peca_ligacao_osso": {
  "pt": "Ligação de Osso",
  "en": "Bone Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_osso"
 },
 "cl:peca_ligacao_pedra": {
  "pt": "Ligação de Pedra",
  "en": "Stone Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_pedra"
 },
 "cl:peca_ligacao_silex": {
  "pt": "Ligação de Sílex",
  "en": "Flint Binding",
  "icone": "textures/items/cl/arte/peca_ligacao_silex"
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
 "cl:pedra_entalhado": {
  "pt": "Pedra Entalhado",
  "en": "Carved Stone",
  "icone": "textures/blocks/cl/arte/pedra_entalhado"
 },
 "cl:pedra_ladrilho": {
  "pt": "Pedra Ladrilho",
  "en": "Tiles Stone",
  "icone": "textures/blocks/cl/arte/pedra_ladrilho"
 },
 "cl:pedra_liso": {
  "pt": "Pedra Liso",
  "en": "Smooth Stone",
  "icone": "textures/blocks/cl/arte/pedra_liso"
 },
 "cl:pedra_mosaico": {
  "pt": "Pedra Mosaico",
  "en": "Mosaic Stone",
  "icone": "textures/blocks/cl/arte/pedra_mosaico"
 },
 "cl:pedra_pilar": {
  "pt": "Pedra Pilar",
  "en": "Pillar Stone",
  "icone": "textures/blocks/cl/arte/pedra_pilar"
 },
 "cl:pedra_polido": {
  "pt": "Pedra Polido",
  "en": "Polished Stone",
  "icone": "textures/blocks/cl/arte/pedra_polido"
 },
 "cl:pedra_tijolos": {
  "pt": "Pedra Tijolos",
  "en": "Bricks Stone",
  "icone": "textures/blocks/cl/arte/pedra_tijolos"
 },
 "cl:pedra_tijolos_pequenos": {
  "pt": "Pedra Tijolinhos",
  "en": "Small Bricks Stone",
  "icone": "textures/blocks/cl/arte/pedra_tijolos_pequenos"
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
 "cl:petroleo": {
  "pt": "Petróleo",
  "en": "Oil",
  "icone": "textures/blocks/cl/v/petroleo"
 },
 "cl:picareta_aco": {
  "pt": "Picareta de Aço",
  "en": "Steel Pickaxe",
  "icone": "textures/items/cl/arte/picareta_aco"
 },
 "cl:picareta_bronze": {
  "pt": "Picareta de Bronze",
  "en": "Bronze Pickaxe",
  "icone": "textures/items/cl/arte/picareta_bronze"
 },
 "cl:picareta_cacto": {
  "pt": "Picareta de Cacto",
  "en": "Cactus Pickaxe",
  "icone": "textures/items/cl/arte/picareta_cacto"
 },
 "cl:picareta_cobre": {
  "pt": "Picareta de Cobre",
  "en": "Copper Pickaxe",
  "icone": "textures/items/cl/arte/picareta_cobre"
 },
 "cl:picareta_ferro": {
  "pt": "Picareta de Ferro",
  "en": "Iron Pickaxe",
  "icone": "textures/items/cl/arte/picareta_ferro"
 },
 "cl:picareta_madeira": {
  "pt": "Picareta de Madeira",
  "en": "Wood Pickaxe",
  "icone": "textures/items/cl/arte/picareta_madeira"
 },
 "cl:picareta_obsidiana": {
  "pt": "Picareta de Obsidiana",
  "en": "Obsidian Pickaxe",
  "icone": "textures/items/cl/arte/picareta_obsidiana"
 },
 "cl:picareta_osso": {
  "pt": "Picareta de Osso",
  "en": "Bone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_osso"
 },
 "cl:picareta_pedra": {
  "pt": "Picareta de Pedra",
  "en": "Stone Pickaxe",
  "icone": "textures/items/cl/arte/picareta_pedra"
 },
 "cl:picareta_silex": {
  "pt": "Picareta de Sílex",
  "en": "Flint Pickaxe",
  "icone": "textures/items/cl/arte/picareta_silex"
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
  "pt": "Placa Fotovoltaica",
  "en": "Photovoltaic Plate",
  "icone": "textures/items/cl/c/placa_fotovoltaica"
 },
 "cl:placa_reforcada": {
  "pt": "Placa Reforçada",
  "en": "Heavy Duty Plate",
  "icone": "textures/items/cl/c/placa_reforcada"
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
 "cl:plastico_cru": {
  "pt": "Plástico Cru",
  "en": "Raw Plastic",
  "icone": "textures/items/cl/arte/plastico_cru"
 },
 "cl:plataforma_lancamento": {
  "pt": "Plataforma de Lançamento",
  "en": "Rocket Launch Pad",
  "icone": "textures/blocks/cl/c/plataforma_lancamento"
 },
 "cl:po_carvao": {
  "pt": "Carvão Pulverizado",
  "en": "Pulverized Coal",
  "icone": "textures/items/cl/c/po_carvao"
 },
 "cl:po_certus": {
  "pt": "Pó de Certus",
  "en": "Certus Quartz Dust",
  "icone": "textures/items/cl/arte/po_certus"
 },
 "cl:po_cobre": {
  "pt": "Pó de Cobre",
  "en": "Pulverized Copper",
  "icone": "textures/items/cl/arte/po_cobre"
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
  "pt": "Pó Fluix",
  "en": "Fluix Dust",
  "icone": "textures/items/cl/arte/po_fluix"
 },
 "cl:po_litio": {
  "pt": "Pó de Lítio",
  "en": "Lithium Dust",
  "icone": "textures/items/cl/arte/po_litio"
 },
 "cl:po_osmio": {
  "pt": "Pó de Ósmio",
  "en": "Osmium Dust",
  "icone": "textures/items/cl/c/po_osmio"
 },
 "cl:po_ouro": {
  "pt": "Pó de Ouro",
  "en": "Pulverized Gold",
  "icone": "textures/items/cl/arte/po_ouro"
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
  "pt": "Ponto de Acesso sem Fio",
  "en": "Wireless Access Point",
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
  "icone": "textures/items/cl/arte/blocos/porta_acesso_reator"
 },
 "cl:porta_refrigeracao": {
  "pt": "Porta de Refrigeração",
  "en": "Reactor Coolant Port",
  "icone": "textures/items/cl/arte/blocos/porta_refrigeracao"
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
 "cl:prensa_mecanica": {
  "pt": "Prensa Mecânica",
  "en": "Mechanical Press",
  "icone": "textures/blocks/cl/c/prensa_mecanica_topo"
 },
 "cl:processador_avancado": {
  "pt": "Processador Avançado",
  "en": "Advanced Processor",
  "icone": "textures/items/cl/arte/processador_avancado"
 },
 "cl:processador_basico": {
  "pt": "Processador Básico",
  "en": "Basic Processor",
  "icone": "textures/items/cl/arte/processador_basico"
 },
 "cl:pulverizador": {
  "pt": "Pulverizador",
  "en": "Pulverizer",
  "icone": "textures/items/cl/arte/blocos/pulverizador"
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
 "cl:refinaria": {
  "pt": "Refinaria",
  "en": "Refinery",
  "icone": "textures/items/cl/arte/blocos/refinaria"
 },
 "cl:reprocessador_cianita": {
  "pt": "Reprocessador de Cianita",
  "en": "Cyanite Reprocessor",
  "icone": "textures/items/cl/arte/blocos/reprocessador_cianita"
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
 "cl:revestimento_aco": {
  "pt": "Revestimento de Aço",
  "en": "Steel Casing",
  "icone": "textures/blocks/cl/c/revestimento_aco"
 },
 "cl:revestimento_andesita": {
  "pt": "Revestimento de Andesita",
  "en": "Andesite Casing",
  "icone": "textures/blocks/cl/c/revestimento_andesita"
 },
 "cl:rocha_lunar": {
  "pt": "Rocha Lunar",
  "en": "Moon Rock",
  "icone": "textures/blocks/cl/c/rocha_lunar"
 },
 "cl:roda_dagua": {
  "pt": "Roda d'Água",
  "en": "Water Wheel",
  "icone": "textures/blocks/cl/c/roda_dagua_topo"
 },
 "cl:rodas_trituradoras": {
  "pt": "Rodas Trituradoras",
  "en": "Crushing Wheels",
  "icone": "textures/blocks/cl/c/rodas_trituradoras_topo"
 },
 "cl:rolamento_moinho": {
  "pt": "Rolamento de Moinho",
  "en": "Windmill Bearing",
  "icone": "textures/blocks/cl/c/rolamento_moinho_topo"
 },
 "cl:saco_dormir": {
  "pt": "Saco de Dormir",
  "en": "Sleeping Bag",
  "icone": "textures/items/cl/arte/saco_dormir"
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
 "cl:silicio": {
  "pt": "Silício",
  "en": "Silicon",
  "icone": "textures/items/cl/arte/silicio"
 },
 "cl:solo_lunar": {
  "pt": "Solo Lunar",
  "en": "Moon Turf",
  "icone": "textures/blocks/cl/c/solo_lunar"
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
 "cl:sopa_legumes": {
  "pt": "Sopa de Legumes",
  "en": "Vegetable Soup",
  "icone": "textures/items/cl/arte/sopa_legumes"
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
 "cl:suporte_ferramentas": {
  "pt": "Suporte de Ferramentas",
  "en": "Tool Rack",
  "icone": "textures/items/cl/arte/blocos/suporte_ferramentas"
 },
 "cl:tablet_energia": {
  "pt": "Tablet de Energia",
  "en": "Energy Tablet",
  "icone": "textures/items/cl/c/tablet_energia"
 },
 "cl:tabua_corte": {
  "pt": "Tábua de Corte",
  "en": "Cutting Board",
  "icone": "textures/items/cl/arte/blocos/tabua_corte"
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
 "cl:tanque_oxigenio_leve": {
  "pt": "Tanque de Oxigênio Leve",
  "en": "Light Oxygen Tank",
  "icone": "textures/items/cl/c/tanque_oxigenio_leve"
 },
 "cl:tanque_oxigenio_medio": {
  "pt": "Tanque de Oxigênio Médio",
  "en": "Medium Oxygen Tank",
  "icone": "textures/items/cl/c/tanque_oxigenio_medio"
 },
 "cl:tanque_oxigenio_pesado": {
  "pt": "Tanque de Oxigênio Pesado",
  "en": "Heavy Oxygen Tank",
  "icone": "textures/items/cl/c/tanque_oxigenio_pesado"
 },
 "cl:tanque_refratario": {
  "pt": "Tanque Refratário",
  "en": "Seared Tank",
  "icone": "textures/items/cl/arte/blocos/tanque_refratario"
 },
 "cl:terminal": {
  "pt": "Terminal de Armazenamento",
  "en": "Storage Terminal",
  "icone": "textures/items/cl/arte/blocos/terminal"
 },
 "cl:terminal_sem_fio": {
  "pt": "Terminal sem Fio",
  "en": "Wireless Terminal",
  "icone": "textures/items/cl/arte/terminal_sem_fio"
 },
 "cl:terra_lunar": {
  "pt": "Terra Lunar",
  "en": "Moon Dirt",
  "icone": "textures/blocks/cl/c/terra_lunar"
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
 "cl:tijolo_lunar": {
  "pt": "Tijolo da Masmorra Lunar",
  "en": "Moon Dungeon Brick",
  "icone": "textures/blocks/cl/c/tijolo_lunar"
 },
 "cl:tijolo_refratario": {
  "pt": "Tijolo Refratário",
  "en": "Seared Brick",
  "icone": "textures/items/cl/arte/tijolo_refratario"
 },
 "cl:tijolos_refratarios": {
  "pt": "Tijolos Refratários",
  "en": "Seared Bricks",
  "icone": "textures/blocks/cl/arte/tijolos_refratarios"
 },
 "cl:tomada_energia": {
  "pt": "Tomada de Energia",
  "en": "Reactor Power Tap",
  "icone": "textures/items/cl/arte/blocos/tomada_energia"
 },
 "cl:tomate": {
  "pt": "Tomate",
  "en": "Tomato",
  "icone": "textures/items/cl/arte/tomate"
 },
 "cl:torneira": {
  "pt": "Torneira",
  "en": "Faucet",
  "icone": "textures/items/cl/arte/blocos/torneira"
 },
 "cl:torrada": {
  "pt": "Torrada",
  "en": "Toast",
  "icone": "textures/items/cl/arte/torrada"
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
  "icone": "textures/blocks/cl/c/triturador_mk_topo"
 },
 "cl:triturador_monstros": {
  "pt": "Triturador de Monstros",
  "en": "Mob Grinder",
  "icone": "textures/items/cl/arte/blocos/triturador_monstros"
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
  "icone": "textures/blocks/cl/arte/tumulo"
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
 "cl:valvula_camara": {
  "pt": "Válvula da Câmara",
  "en": "Pressure Chamber Valve",
  "icone": "textures/items/cl/arte/blocos/valvula_camara"
 },
 "cl:varal": {
  "pt": "Varal",
  "en": "Drying Rack",
  "icone": "textures/blocks/cl/arte/varal"
 },
 "cl:vela_moinho": {
  "pt": "Vela de Moinho",
  "en": "Sail",
  "icone": "textures/blocks/cl/c/vela_moinho"
 },
 "cl:ventilador": {
  "pt": "Ventilador Revestido",
  "en": "Encased Fan",
  "icone": "textures/blocks/cl/c/ventilador_topo"
 },
 "cl:ventilador_oxigenio": {
  "pt": "Ventilador de Oxigênio",
  "en": "Oxygen Fan",
  "icone": "textures/items/cl/c/ventilador_oxigenio"
 },
 "cl:vidro_camara": {
  "pt": "Vidro da Câmara de Pressão",
  "en": "Pressure Chamber Glass",
  "icone": "textures/blocks/cl/arte/vidro_camara"
 },
 "cl:vidro_entalhado": {
  "pt": "Vidro Entalhado",
  "en": "Carved Glass",
  "icone": "textures/blocks/cl/arte/vidro_entalhado"
 },
 "cl:vidro_ladrilho": {
  "pt": "Vidro Ladrilho",
  "en": "Tiles Glass",
  "icone": "textures/blocks/cl/arte/vidro_ladrilho"
 },
 "cl:vidro_liso": {
  "pt": "Vidro Liso",
  "en": "Smooth Glass",
  "icone": "textures/blocks/cl/arte/vidro_liso"
 },
 "cl:vidro_mosaico": {
  "pt": "Vidro Mosaico",
  "en": "Mosaic Glass",
  "icone": "textures/blocks/cl/arte/vidro_mosaico"
 },
 "cl:vidro_pilar": {
  "pt": "Vidro Pilar",
  "en": "Pillar Glass",
  "icone": "textures/blocks/cl/arte/vidro_pilar"
 },
 "cl:vidro_polido": {
  "pt": "Vidro Polido",
  "en": "Polished Glass",
  "icone": "textures/blocks/cl/arte/vidro_polido"
 },
 "cl:vidro_reator": {
  "pt": "Vidro do Reator",
  "en": "Reactor Glass",
  "icone": "textures/blocks/cl/arte/vidro_reator"
 },
 "cl:vidro_refratario": {
  "pt": "Vidro Refratário",
  "en": "Seared Glass",
  "icone": "textures/blocks/cl/arte/vidro_refratario"
 },
 "cl:vidro_tijolos": {
  "pt": "Vidro Tijolos",
  "en": "Bricks Glass",
  "icone": "textures/blocks/cl/arte/vidro_tijolos"
 },
 "cl:vidro_tijolos_pequenos": {
  "pt": "Vidro Tijolinhos",
  "en": "Small Bricks Glass",
  "icone": "textures/blocks/cl/arte/vidro_tijolos_pequenos"
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
 "minecraft:barrel": {
  "pt": "Barril",
  "en": "Barrel",
  "icone": "textures/blocks/barrel_side"
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
 "minecraft:cauldron": {
  "pt": "Caldeirão",
  "en": "Cauldron",
  "icone": "textures/items/cauldron"
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
 "minecraft:daylight_detector": {
  "pt": "Detector de Luz Solar",
  "en": "Daylight Detector",
  "icone": "textures/blocks/daylight_detector_side"
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
 "minecraft:light_gray_carpet": {
  "pt": "Carpete Cinza-claro",
  "en": "Light Gray Carpet",
  "icone": "textures/blocks/wool_colored_silver"
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
 "minecraft:magma": {
  "pt": "Bloco de Magma",
  "en": "Magma Block",
  "icone": "textures/blocks/magma"
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
 "minecraft:water_bucket": {
  "pt": "Balde de Água",
  "en": "Water Bucket",
  "icone": "textures/items/bucket_water"
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
  "tipo": "fornalha",
  "id": "cl:c_aglutinante_conduite",
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
  "id": "cl:c_ancora_viagem",
  "resultado": "cl:ancora_viagem",
  "qtd": 1,
  "grade": [
   "IBI",
   "BCB",
   "IBI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "B": "cl:aglutinante_conduite",
   "C": "cl:cristal_pulsante"
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
  "id": "cl:c_banco_capacitores",
  "resultado": "cl:banco_capacitores",
  "qtd": 1,
  "grade": [
   "ICI",
   "CBC",
   "ICI"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "C": "cl:capacitor_duplo",
   "B": "cl:banco_capacitores_basico"
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
  "tipo": "bancada",
  "id": "cl:c_banco_capacitores_vibrante",
  "resultado": "cl:banco_capacitores_vibrante",
  "qtd": 1,
  "grade": [
   "VCV",
   "CBC",
   "VCV"
  ],
  "chaves": {
   "V": "cl:liga_vibrante",
   "C": "cl:capacitor_octadico",
   "B": "cl:banco_capacitores"
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
  "tipo": "bancada",
  "id": "cl:c_batedor",
  "resultado": "cl:batedor",
  "qtd": 1,
  "grade": [
   " A ",
   "CAC",
   "CCC"
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "C": "cl:chapa_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_bau_me",
  "resultado": "cl:bau_me",
  "qtd": 1,
  "grade": [
   "VMV",
   "FBF",
   "FPF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "M": "cl:matriz_conversao",
   "F": "minecraft:iron_ingot",
   "B": "minecraft:chest",
   "P": "cl:processador_basico"
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
  "id": "cl:c_caixa_engrenagens",
  "resultado": "cl:caixa_engrenagens",
  "qtd": 1,
  "grade": [
   " E ",
   "ERE",
   " E "
  ],
  "chaves": {
   "E": "cl:engrenagem",
   "R": "cl:revestimento_andesita"
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
  "id": "cl:c_camara_injecao",
  "resultado": "cl:camara_injecao",
  "qtd": 1,
  "grade": [
   "RCR",
   "OEO",
   "RCR"
  ],
  "chaves": {
   "R": "cl:liga_reforcada",
   "C": "cl:cilindro_vazio",
   "O": "minecraft:gold_ingot",
   "E": "cl:camara_purificacao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_camara_purificacao",
  "resultado": "cl:camara_purificacao",
  "qtd": 1,
  "grade": [
   "LCL",
   "OEO",
   "LCL"
  ],
  "chaves": {
   "L": "cl:liga_enriquecida",
   "C": "cl:cilindro_vazio",
   "O": "minecraft:gold_ingot",
   "E": "cl:pulverizador"
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
  "id": "cl:c_capacitor_basico",
  "resultado": "cl:capacitor_basico",
  "qtd": 1,
  "grade": [
   " N ",
   "NCN",
   "R R"
  ],
  "chaves": {
   "N": "minecraft:gold_nugget",
   "C": "minecraft:copper_ingot",
   "R": "minecraft:redstone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacitor_duplo",
  "resultado": "cl:capacitor_duplo",
  "qtd": 1,
  "grade": [
   " E ",
   "CPC",
   " E "
  ],
  "chaves": {
   "E": "cl:liga_energetica",
   "C": "cl:capacitor_basico",
   "P": "cl:po_carvao"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_capacitor_octadico",
  "resultado": "cl:capacitor_octadico",
  "qtd": 1,
  "grade": [
   " V ",
   "CGC",
   " V "
  ],
  "chaves": {
   "V": "cl:liga_vibrante",
   "C": "cl:capacitor_duplo",
   "G": "minecraft:glowstone"
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
  "id": "cl:c_celula_me_16k",
  "resultado": "cl:celula_me_16k",
  "qtd": 1,
  "grade": [
   "VRV",
   "RCR",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "R": "minecraft:redstone",
   "C": "cl:componente_me_16k",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_me_1k",
  "resultado": "cl:celula_me_1k",
  "qtd": 1,
  "grade": [
   "VRV",
   "RCR",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "R": "minecraft:redstone",
   "C": "cl:componente_me_1k",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_me_4k",
  "resultado": "cl:celula_me_4k",
  "qtd": 1,
  "grade": [
   "VRV",
   "RCR",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "R": "minecraft:redstone",
   "C": "cl:componente_me_4k",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_celula_me_64k",
  "resultado": "cl:celula_me_64k",
  "qtd": 1,
  "grade": [
   "VRV",
   "RCR",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "R": "minecraft:redstone",
   "C": "cl:componente_me_64k",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_chassi_maquina",
  "resultado": "cl:chassi_maquina",
  "qtd": 1,
  "grade": [
   "BIB",
   "ICI",
   "BIB"
  ],
  "chaves": {
   "B": "minecraft:iron_bars",
   "I": "minecraft:iron_ingot",
   "C": "cl:capacitor_basico"
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
  "tipo": "bancada",
  "id": "cl:c_circuito_controle_avancado",
  "resultado": "cl:circuito_controle_avancado",
  "qtd": 1,
  "grade": [
   "ECE"
  ],
  "chaves": {
   "E": "cl:liga_enriquecida",
   "C": "cl:circuito_controle_basico"
  },
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
  "id": "cl:c_componente_me_16k",
  "resultado": "cl:componente_me_16k",
  "qtd": 1,
  "grade": [
   "RPR",
   "CFC",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "P": "cl:processador_avancado",
   "C": "cl:componente_me_4k",
   "F": "cl:cristal_fluix"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_componente_me_1k",
  "resultado": "cl:componente_me_1k",
  "qtd": 1,
  "grade": [
   "RCR",
   "CPC",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "C": "cl:cristal_certus",
   "P": "cl:processador_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_componente_me_4k",
  "resultado": "cl:componente_me_4k",
  "qtd": 1,
  "grade": [
   "RPR",
   "CFC",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "P": "cl:processador_basico",
   "C": "cl:componente_me_1k",
   "F": "cl:cristal_fluix"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_componente_me_64k",
  "resultado": "cl:componente_me_64k",
  "qtd": 1,
  "grade": [
   "RPR",
   "CFC",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "P": "cl:processador_avancado",
   "C": "cl:componente_me_16k",
   "F": "cl:cristal_fluix"
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
  "id": "cl:c_composto_aglutinante",
  "resultado": "cl:composto_aglutinante",
  "qtd": 8,
  "grade": [
   "GCG",
   "SGS",
   "GCG"
  ],
  "chaves": {
   "G": "minecraft:gravel",
   "C": "minecraft:clay_ball",
   "S": "minecraft:sand"
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
  "id": "cl:c_controlador_me",
  "resultado": "cl:controlador_me",
  "qtd": 1,
  "grade": [
   "FCF",
   "CPC",
   "FCF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "C": "cl:cristal_fluix",
   "P": "cl:processador_avancado"
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
  "tipo": "sem_forma",
  "id": "cl:c_cristal_fluix",
  "resultado": "cl:cristal_fluix",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:cristal_certus",
    "qtd": 1
   },
   {
    "item": "minecraft:redstone",
    "qtd": 1
   },
   {
    "item": "minecraft:lapis_lazuli",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "sem_forma",
  "id": "cl:c_cristal_fluix_quartzo",
  "resultado": "cl:cristal_fluix",
  "qtd": 2,
  "ingredientes": [
   {
    "item": "cl:cristal_certus",
    "qtd": 1
   },
   {
    "item": "minecraft:redstone",
    "qtd": 1
   },
   {
    "item": "minecraft:quartz",
    "qtd": 1
   }
  ],
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cristal_pulsante",
  "resultado": "cl:cristal_pulsante",
  "qtd": 1,
  "grade": [
   " P ",
   "PDP",
   " P "
  ],
  "chaves": {
   "P": "cl:ferro_pulsante",
   "D": "minecraft:diamond"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cubo_energia_avancado",
  "resultado": "cl:cubo_energia_avancado",
  "qtd": 1,
  "grade": [
   "LAL",
   "ACA",
   "LAL"
  ],
  "chaves": {
   "L": "cl:liga_enriquecida",
   "A": "cl:lingote_aco",
   "C": "cl:cubo_energia_basico"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cubo_energia_basico",
  "resultado": "cl:cubo_energia_basico",
  "qtd": 1,
  "grade": [
   "RAR",
   "CEC",
   "RAR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "A": "cl:lingote_aco",
   "C": "cl:bateria",
   "E": "cl:estrutura_maquina"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cubo_energia_definitivo",
  "resultado": "cl:cubo_energia_definitivo",
  "qtd": 1,
  "grade": [
   "LAL",
   "ACA",
   "LAL"
  ],
  "chaves": {
   "L": "cl:liga_atomica",
   "A": "cl:lingote_aco",
   "C": "cl:cubo_energia_elite"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_cubo_energia_elite",
  "resultado": "cl:cubo_energia_elite",
  "qtd": 1,
  "grade": [
   "LAL",
   "ACA",
   "LAL"
  ],
  "chaves": {
   "L": "cl:liga_reforcada",
   "A": "cl:lingote_aco",
   "C": "cl:cubo_energia_avancado"
  },
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
  "id": "cl:c_drive_me",
  "resultado": "cl:drive_me",
  "qtd": 1,
  "grade": [
   "FPF",
   "CBC",
   "FPF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "P": "cl:processador_basico",
   "C": "cl:cristal_fluix",
   "B": "minecraft:chest"
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
  "id": "cl:c_eio_espada_aco_negro",
  "resultado": "cl:eio_espada_aco_negro",
  "qtd": 1,
  "grade": [
   "X",
   "X",
   "T"
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
  "id": "cl:c_eixo",
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
  "tipo": "sem_forma",
  "id": "cl:c_engrenagem",
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
  "id": "cl:c_engrenagem_aco_negro",
  "resultado": "cl:engrenagem_aco_negro",
  "qtd": 1,
  "grade": [
   " X ",
   "XIX",
   " X "
  ],
  "chaves": {
   "X": "cl:aco_negro",
   "I": "cl:engrenagem_ferro"
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
  "tipo": "sem_forma",
  "id": "cl:c_engrenagem_grande",
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
  "tipo": "sem_forma",
  "id": "cl:c_faca_corte",
  "resultado": "cl:faca_corte",
  "qtd": 1,
  "ingredientes": [
   {
    "item": "minecraft:stick",
    "qtd": 1
   },
   {
    "item": "minecraft:iron_ingot",
    "qtd": 1
   },
   {
    "item": "cl:cristal_certus",
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
  "id": "cl:c_fundidora_ligas",
  "resultado": "cl:fundidora_ligas",
  "qtd": 1,
  "grade": [
   "IFI",
   "FCF",
   "GKG"
  ],
  "chaves": {
   "I": "minecraft:iron_ingot",
   "F": "minecraft:furnace",
   "C": "cl:chassi_maquina",
   "G": "cl:engrenagem_pedra",
   "K": "minecraft:cauldron"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_furadeira",
  "resultado": "cl:furadeira",
  "qtd": 1,
  "grade": [
   " A ",
   "AIA",
   " R "
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "I": "minecraft:iron_ingot",
   "R": "cl:revestimento_andesita"
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
  "id": "cl:c_gerador_stirling",
  "resultado": "cl:gerador_stirling",
  "qtd": 1,
  "grade": [
   "SFS",
   "DCD",
   "GPG"
  ],
  "chaves": {
   "S": "minecraft:stone_bricks",
   "F": "minecraft:furnace",
   "D": "cl:aco_negro",
   "C": "cl:chassi_maquina",
   "G": "cl:engrenagem_aco_negro",
   "P": "minecraft:piston"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_helice",
  "resultado": "cl:helice",
  "qtd": 1,
  "grade": [
   " C ",
   "CAC",
   " C "
  ],
  "chaves": {
   "A": "cl:liga_andesita",
   "C": "cl:chapa_ferro"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_infusor_metalurgico",
  "resultado": "cl:infusor_metalurgico",
  "qtd": 1,
  "grade": [
   "AFA",
   "RER",
   "AFA"
  ],
  "chaves": {
   "A": "cl:lingote_aco",
   "F": "minecraft:furnace",
   "R": "minecraft:redstone",
   "E": "cl:estrutura_maquina"
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
  "id": "cl:c_liga_andesita",
  "resultado": "cl:liga_andesita",
  "qtd": 1,
  "grade": [
   "AN",
   "NA"
  ],
  "chaves": {
   "A": "minecraft:andesite",
   "N": "minecraft:iron_nugget"
  },
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
  "tipo": "bancada",
  "id": "cl:c_manivela",
  "resultado": "cl:manivela",
  "qtd": 1,
  "grade": [
   "PPP",
   "  A"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "A": "cl:liga_andesita"
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
  "id": "cl:c_misturador_mecanico",
  "resultado": "cl:misturador_mecanico",
  "qtd": 1,
  "grade": [
   "E",
   "R",
   "B"
  ],
  "chaves": {
   "E": "cl:engrenagem",
   "R": "cl:revestimento_andesita",
   "B": "cl:batedor"
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
  "id": "cl:c_mo",
  "resultado": "cl:mo",
  "qtd": 1,
  "grade": [
   "E",
   "R",
   "S"
  ],
  "chaves": {
   "E": "cl:engrenagem",
   "R": "cl:revestimento_andesita",
   "S": "minecraft:stone"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_moinho_sag",
  "resultado": "cl:moinho_sag",
  "qtd": 1,
  "grade": [
   "FFF",
   "ICI",
   "GPG"
  ],
  "chaves": {
   "F": "minecraft:flint",
   "I": "minecraft:iron_ingot",
   "C": "cl:chassi_maquina",
   "G": "cl:engrenagem_pedra",
   "P": "minecraft:piston"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_montador_molecular",
  "resultado": "cl:montador_molecular",
  "qtd": 1,
  "grade": [
   "FVF",
   "AMA",
   "FVF"
  ],
  "chaves": {
   "F": "minecraft:iron_ingot",
   "V": "minecraft:glass",
   "A": "cl:processador_avancado",
   "M": "minecraft:crafting_table"
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
  "tipo": "bancada",
  "id": "cl:c_nucleo_eletrolitico",
  "resultado": "cl:nucleo_eletrolitico",
  "qtd": 1,
  "grade": [
   "EPE",
   "IEG",
   "EPE"
  ],
  "chaves": {
   "E": "cl:liga_enriquecida",
   "P": "cl:po_osmio",
   "I": "cl:po_ferro",
   "G": "cl:po_ouro"
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
  "id": "cl:c_padrao_me_vazio",
  "resultado": "cl:padrao_me_vazio",
  "qtd": 2,
  "grade": [
   "VCV",
   "CRC",
   "FFF"
  ],
  "chaves": {
   "V": "minecraft:glass",
   "C": "cl:cristal_certus",
   "R": "minecraft:redstone",
   "F": "minecraft:iron_ingot"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_fotovoltaico",
  "resultado": "cl:painel_fotovoltaico",
  "qtd": 1,
  "grade": [
   "EGE",
   "PPP",
   "CDC"
  ],
  "chaves": {
   "E": "cl:aco_eletrico",
   "G": "minecraft:glass",
   "P": "cl:placa_fotovoltaica",
   "C": "cl:capacitor_basico",
   "D": "minecraft:daylight_detector"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_fotovoltaico_avancado",
  "resultado": "cl:painel_fotovoltaico_avancado",
  "qtd": 1,
  "grade": [
   "EQE",
   "PSP",
   "CDC"
  ],
  "chaves": {
   "E": "cl:liga_energetica",
   "Q": "minecraft:quartz_block",
   "P": "cl:placa_fotovoltaica",
   "S": "cl:painel_fotovoltaico",
   "C": "cl:capacitor_duplo",
   "D": "minecraft:daylight_detector"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_painel_fotovoltaico_vibrante",
  "resultado": "cl:painel_fotovoltaico_vibrante",
  "qtd": 1,
  "grade": [
   "VQV",
   "PSP",
   "CDC"
  ],
  "chaves": {
   "V": "cl:liga_vibrante",
   "Q": "minecraft:glowstone",
   "P": "cl:placa_fotovoltaica",
   "S": "cl:painel_fotovoltaico_avancado",
   "C": "cl:capacitor_octadico",
   "D": "minecraft:daylight_detector"
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
  "id": "cl:c_ponto_acesso",
  "resultado": "cl:ponto_acesso",
  "qtd": 1,
  "grade": [
   " C ",
   "FPF"
  ],
  "chaves": {
   "C": "cl:cristal_fluix",
   "F": "minecraft:iron_ingot",
   "P": "cl:processador_basico"
  },
  "estacoes": [
   "crafting_table"
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
  "id": "cl:c_roda_dagua",
  "resultado": "cl:roda_dagua",
  "qtd": 1,
  "grade": [
   "PPP",
   "PEP",
   "PPP"
  ],
  "chaves": {
   "P": "#minecraft:planks",
   "E": "cl:eixo"
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
  "id": "cl:c_rolamento_moinho",
  "resultado": "cl:rolamento_moinho",
  "qtd": 1,
  "grade": [
   "S",
   "R",
   "E"
  ],
  "chaves": {
   "S": "minecraft:oak_slab",
   "R": "cl:revestimento_andesita",
   "E": "cl:eixo"
  },
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
  "id": "cl:c_separador_eletrolitico",
  "resultado": "cl:separador_eletrolitico",
  "qtd": 1,
  "grade": [
   "RFR",
   "CEC",
   "RFR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "F": "minecraft:iron_ingot",
   "C": "cl:cilindro_vazio",
   "E": "cl:estrutura_maquina"
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
  "id": "cl:c_tablet_energia",
  "resultado": "cl:tablet_energia",
  "qtd": 1,
  "grade": [
   "RCR",
   "ECE",
   "RCR"
  ],
  "chaves": {
   "R": "minecraft:redstone",
   "C": "minecraft:gold_ingot",
   "E": "cl:liga_enriquecida"
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
  "id": "cl:c_terminal_sem_fio",
  "resultado": "cl:terminal_sem_fio",
  "qtd": 1,
  "grade": [
   "C",
   "T",
   "B"
  ],
  "chaves": {
   "C": "cl:cristal_fluix",
   "T": "cl:terminal",
   "B": "cl:bateria"
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
  "id": "cl:c_vela_moinho",
  "resultado": "cl:vela_moinho",
  "qtd": 4,
  "grade": [
   "T T",
   "AWA",
   "T T"
  ],
  "chaves": {
   "T": "minecraft:stick",
   "A": "cl:liga_andesita",
   "W": "minecraft:white_wool"
  },
  "estacoes": [
   "crafting_table"
  ]
 },
 {
  "tipo": "bancada",
  "id": "cl:c_ventilador",
  "resultado": "cl:ventilador",
  "qtd": 1,
  "grade": [
   "E",
   "R",
   "H"
  ],
  "chaves": {
   "E": "cl:eixo",
   "R": "cl:revestimento_andesita",
   "H": "cl:helice"
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

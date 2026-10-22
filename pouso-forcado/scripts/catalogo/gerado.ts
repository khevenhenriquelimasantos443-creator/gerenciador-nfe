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
 "cl:alho": {
  "pt": "Alho",
  "en": "Garlic",
  "icone": "textures/items/cl/arte/alho"
 },
 "cl:amendoim": {
  "pt": "Amendoim",
  "en": "Peanut",
  "icone": "textures/items/cl/arte/amendoim"
 },
 "cl:argamassa": {
  "pt": "Argamassa",
  "en": "Grout",
  "icone": "textures/items/cl/c/argamassa"
 },
 "cl:armazem_corpos": {
  "pt": "Armazém de Corpos",
  "en": "Shell Storage",
  "icone": "textures/blocks/cl/c/armazem_corpos_topo"
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
 "cl:assadeira": {
  "pt": "Assadeira",
  "en": "Bakeware",
  "icone": "textures/items/cl/blocos/assadeira"
 },
 "cl:bacia_fundicao": {
  "pt": "Bacia de Fundição",
  "en": "Casting Basin",
  "icone": "textures/blocks/cl/c/bacia_fundicao_topo"
 },
 "cl:barra_borracha": {
  "pt": "Barra de Borracha",
  "en": "Rubber Bar",
  "icone": "textures/items/cl/c/barra_borracha"
 },
 "cl:barra_combustivel": {
  "pt": "Barra de Combustível",
  "en": "Yellorium Fuel Rod",
  "icone": "textures/blocks/cl/c/barra_combustivel"
 },
 "cl:barra_controle": {
  "pt": "Barra de Controle",
  "en": "Reactor Control Rod",
  "icone": "textures/blocks/cl/c/barra_controle"
 },
 "cl:barra_grafite": {
  "pt": "Barra de Grafite",
  "en": "Graphite Bar",
  "icone": "textures/items/cl/c/barra_grafite"
 },
 "cl:barril_armazenamento": {
  "pt": "Barril de Armazenamento",
  "en": "Storage Barrel",
  "icone": "textures/blocks/cl/c/barril_armazenamento_topo"
 },
 "cl:barril_madeira": {
  "pt": "Barril de Madeira",
  "en": "Wooden Barrel",
  "icone": "textures/items/cl/blocos/barril_madeira"
 },
 "cl:barril_pedra": {
  "pt": "Barril de Pedra",
  "en": "Stone Barrel",
  "icone": "textures/items/cl/blocos/barril_pedra"
 },
 "cl:bateria": {
  "pt": "Bateria",
  "en": "Battery",
  "icone": "textures/items/cl/arte/blocos/bateria"
 },
 "cl:bau_me": {
  "pt": "Baú ME",
  "en": "ME Chest",
  "icone": "textures/blocks/cl/c/bau_me_topo"
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
 "cl:bloco_aco": {
  "pt": "Bloco de Aço",
  "en": "Block of Steel",
  "icone": "textures/blocks/cl/c/bloco_aco"
 },
 "cl:bloco_bronze": {
  "pt": "Bloco de Bronze",
  "en": "Block of Bronze",
  "icone": "textures/blocks/cl/c/bloco_bronze"
 },
 "cl:bloco_estanho": {
  "pt": "Bloco de Estanho",
  "en": "Block of Tin",
  "icone": "textures/blocks/cl/c/bloco_estanho"
 },
 "cl:bloco_ferro_comprimido": {
  "pt": "Bloco de Ferro Comprimido",
  "en": "Compressed Iron Block",
  "icone": "textures/blocks/cl/c/bloco_ferro_comprimido"
 },
 "cl:bloco_grafite": {
  "pt": "Bloco de Grafite",
  "en": "Graphite Block",
  "icone": "textures/blocks/cl/c/bloco_grafite"
 },
 "cl:bloco_maquina": {
  "pt": "Bloco de Máquina",
  "en": "Machine Block",
  "icone": "textures/blocks/cl/c/bloco_maquina_topo"
 },
 "cl:bloco_yellorium": {
  "pt": "Bloco de Yellorium",
  "en": "Yellorium Block",
  "icone": "textures/blocks/cl/c/bloco_yellorium"
 },
 "cl:bola_musgo": {
  "pt": "Bola de Musgo",
  "en": "Ball of Moss",
  "icone": "textures/items/cl/c/bola_musgo"
 },
 "cl:bolinho_arroz": {
  "pt": "Bolinho de Arroz",
  "en": "Rice Cake",
  "icone": "textures/items/cl/arte/bolinho_arroz"
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
 "cl:cabo": {
  "pt": "Cabo de Cobre",
  "en": "Copper Cable",
  "icone": "textures/items/cl/arte/blocos/cabo"
 },
 "cl:cacarola": {
  "pt": "Caçarola",
  "en": "Saucepan",
  "icone": "textures/items/cl/blocos/cacarola"
 },
 "cl:cadinho": {
  "pt": "Cadinho",
  "en": "Crucible",
  "icone": "textures/items/cl/blocos/cadinho"
 },
 "cl:cadinho_cru": {
  "pt": "Cadinho Cru",
  "en": "Unfired Crucible",
  "icone": "textures/items/cl/arte/cadinho_cru"
 },
 "cl:cajado": {
  "pt": "Cajado",
  "en": "Crook",
  "icone": "textures/items/cl/arte/cajado"
 },
 "cl:caldo": {
  "pt": "Caldo",
  "en": "Stock",
  "icone": "textures/items/cl/arte/caldo"
 },
 "cl:camel_pack": {
  "pt": "Camel Pack",
  "en": "Camel Pack",
  "icone": "textures/items/cl/arte/camel_pack"
 },
 "cl:capacitor": {
  "pt": "Capacitor",
  "en": "Capacitor",
  "icone": "textures/items/cl/c/capacitor"
 },
 "cl:carcaca_reator": {
  "pt": "Carcaça do Reator",
  "en": "Reactor Casing",
  "icone": "textures/blocks/cl/c/carcaca_reator"
 },
 "cl:carrinho": {
  "pt": "Carrinho",
  "en": "Dolly",
  "icone": "textures/items/cl/c/carrinho"
 },
 "cl:carrinho_diamante": {
  "pt": "Carrinho de Diamante",
  "en": "Diamond Dolly",
  "icone": "textures/items/cl/c/carrinho_diamante"
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
  "icone": "textures/items/cl/c/celula_agua"
 },
 "cl:celula_combustivel": {
  "pt": "Célula de Combustível",
  "en": "Fuel Cell",
  "icone": "textures/items/cl/arte/celula_combustivel"
 },
 "cl:celula_energia_basica": {
  "pt": "Célula de Energia Básica",
  "en": "Leadstone Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_basica_topo"
 },
 "cl:celula_energia_redstone": {
  "pt": "Célula de Energia Redstone",
  "en": "Redstone Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_redstone_topo"
 },
 "cl:celula_energia_reforcada": {
  "pt": "Célula de Energia Reforçada",
  "en": "Hardened Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_reforcada_topo"
 },
 "cl:celula_energia_ressonante": {
  "pt": "Célula de Energia Ressonante",
  "en": "Resonant Energy Cell",
  "icone": "textures/blocks/cl/c/celula_energia_ressonante_topo"
 },
 "cl:celula_me_16k": {
  "pt": "Célula ME 16k",
  "en": "16k ME Storage Cell",
  "icone": "textures/items/cl/c/celula_me_16k"
 },
 "cl:celula_me_1k": {
  "pt": "Célula ME 1k",
  "en": "1k ME Storage Cell",
  "icone": "textures/items/cl/c/celula_me_1k"
 },
 "cl:celula_me_4k": {
  "pt": "Célula ME 4k",
  "en": "4k ME Storage Cell",
  "icone": "textures/items/cl/c/celula_me_4k"
 },
 "cl:celula_me_64k": {
  "pt": "Célula ME 64k",
  "en": "64k ME Storage Cell",
  "icone": "textures/items/cl/c/celula_me_64k"
 },
 "cl:charque": {
  "pt": "Charque",
  "en": "Beef Jerky",
  "icone": "textures/items/cl/arte/charque"
 },
 "cl:chave_barril": {
  "pt": "Chave de Barril",
  "en": "Barrel Hammer",
  "icone": "textures/items/cl/c/chave_barril"
 },
 "cl:chili_poppers": {
  "pt": "Pimentas Empanadas",
  "en": "Chili Poppers",
  "icone": "textures/items/cl/arte/chili_poppers"
 },
 "cl:circuito": {
  "pt": "Circuito",
  "en": "Circuit",
  "icone": "textures/items/cl/arte/circuito"
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
 "cl:colheitadeira": {
  "pt": "Colheitadeira",
  "en": "Harvester",
  "icone": "textures/blocks/cl/c/colheitadeira_topo"
 },
 "cl:colocador_blocos": {
  "pt": "Colocador de Blocos",
  "en": "Block Placer",
  "icone": "textures/blocks/cl/c/colocador_blocos_topo"
 },
 "cl:componente_me_16k": {
  "pt": "Componente ME 16k",
  "en": "16k ME Storage Component",
  "icone": "textures/items/cl/c/componente_me_16k"
 },
 "cl:componente_me_1k": {
  "pt": "Componente ME 1k",
  "en": "1k ME Storage Component",
  "icone": "textures/items/cl/c/componente_me_1k"
 },
 "cl:componente_me_4k": {
  "pt": "Componente ME 4k",
  "en": "4k ME Storage Component",
  "icone": "textures/items/cl/c/componente_me_4k"
 },
 "cl:componente_me_64k": {
  "pt": "Componente ME 64k",
  "en": "64k ME Storage Component",
  "icone": "textures/items/cl/c/componente_me_64k"
 },
 "cl:compostadora": {
  "pt": "Compostadora",
  "en": "Composter",
  "icone": "textures/blocks/cl/c/compostadora_topo"
 },
 "cl:compostor": {
  "pt": "Compostor de Terra",
  "en": "Dirt Composter",
  "icone": "textures/items/cl/arte/blocos/compostor"
 },
 "cl:compressor_ar": {
  "pt": "Compressor de Ar",
  "en": "Air Compressor",
  "icone": "textures/blocks/cl/c/compressor_ar_topo"
 },
 "cl:computador_bordo": {
  "pt": "Computador de Bordo",
  "en": "Flight Computer",
  "icone": "textures/items/cl/arte/computador_bordo"
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
  "icone": "textures/blocks/cl/c/construtor_corpos_topo"
 },
 "cl:construtor_pecas": {
  "pt": "Construtor de Peças",
  "en": "Part Builder",
  "icone": "textures/blocks/cl/c/construtor_pecas_topo"
 },
 "cl:controlador_fundicao": {
  "pt": "Controlador da Fundição",
  "en": "Smeltery Controller",
  "icone": "textures/blocks/cl/c/controlador_fundicao_topo"
 },
 "cl:controlador_me": {
  "pt": "Controlador ME",
  "en": "ME Controller",
  "icone": "textures/blocks/cl/c/controlador_me_topo"
 },
 "cl:controlador_reator": {
  "pt": "Controlador do Reator",
  "en": "Reactor Controller",
  "icone": "textures/blocks/cl/c/controlador_reator_topo"
 },
 "cl:coracao_farao": {
  "pt": "Coração do Faraó",
  "en": "Pharaoh's Heart",
  "icone": "textures/items/cl/arte/coracao_farao"
 },
 "cl:cristal_certus": {
  "pt": "Cristal de Certus",
  "en": "Certus Quartz Crystal",
  "icone": "textures/items/cl/c/cristal_certus"
 },
 "cl:cristal_fluix": {
  "pt": "Cristal Fluix",
  "en": "Fluix Crystal",
  "icone": "textures/items/cl/c/cristal_fluix"
 },
 "cl:diario_bordo": {
  "pt": "Diário de Bordo",
  "en": "Logbook",
  "icone": "textures/items/cl/arte/diario_bordo"
 },
 "cl:dinamo_redstone": {
  "pt": "Dínamo de Redstone",
  "en": "Enervation Dynamo",
  "icone": "textures/blocks/cl/c/dinamo_redstone_topo"
 },
 "cl:dreno_fundicao": {
  "pt": "Dreno",
  "en": "Smeltery Drain",
  "icone": "textures/blocks/cl/c/dreno_fundicao"
 },
 "cl:drive_me": {
  "pt": "Drive ME",
  "en": "ME Drive",
  "icone": "textures/blocks/cl/c/drive_me_topo"
 },
 "cl:empacotador": {
  "pt": "Empacotador Automático",
  "en": "AutoPackager",
  "icone": "textures/blocks/cl/c/empacotador_topo"
 },
 "cl:esgoto": {
  "pt": "Esgoto",
  "en": "Sewer",
  "icone": "textures/blocks/cl/c/esgoto_topo"
 },
 "cl:espada_larga_aco": {
  "pt": "Espada Larga de Aço",
  "en": "Steel Broadsword",
  "icone": "textures/items/cl/c/espada_larga_aco"
 },
 "cl:espada_larga_bronze": {
  "pt": "Espada Larga de Bronze",
  "en": "Bronze Broadsword",
  "icone": "textures/items/cl/c/espada_larga_bronze"
 },
 "cl:espada_larga_cacto": {
  "pt": "Espada Larga de Cacto",
  "en": "Cactus Broadsword",
  "icone": "textures/items/cl/c/espada_larga_cacto"
 },
 "cl:espada_larga_cobre": {
  "pt": "Espada Larga de Cobre",
  "en": "Copper Broadsword",
  "icone": "textures/items/cl/c/espada_larga_cobre"
 },
 "cl:espada_larga_ferro": {
  "pt": "Espada Larga de Ferro",
  "en": "Iron Broadsword",
  "icone": "textures/items/cl/c/espada_larga_ferro"
 },
 "cl:espada_larga_madeira": {
  "pt": "Espada Larga de Madeira",
  "en": "Wood Broadsword",
  "icone": "textures/items/cl/c/espada_larga_madeira"
 },
 "cl:espada_larga_obsidiana": {
  "pt": "Espada Larga de Obsidiana",
  "en": "Obsidian Broadsword",
  "icone": "textures/items/cl/c/espada_larga_obsidiana"
 },
 "cl:espada_larga_osso": {
  "pt": "Espada Larga de Osso",
  "en": "Bone Broadsword",
  "icone": "textures/items/cl/c/espada_larga_osso"
 },
 "cl:espada_larga_pedra": {
  "pt": "Espada Larga de Pedra",
  "en": "Stone Broadsword",
  "icone": "textures/items/cl/c/espada_larga_pedra"
 },
 "cl:espada_larga_silex": {
  "pt": "Espada Larga de Sílex",
  "en": "Flint Broadsword",
  "icone": "textures/items/cl/c/espada_larga_silex"
 },
 "cl:espremedor": {
  "pt": "Espremedor",
  "en": "Juicer",
  "icone": "textures/items/cl/blocos/espremedor"
 },
 "cl:estacao_ferramentas": {
  "pt": "Estação de Ferramentas",
  "en": "Tool Station",
  "icone": "textures/blocks/cl/c/estacao_ferramentas_topo"
 },
 "cl:estanho_po": {
  "pt": "Pó de Minério de Estanho",
  "en": "Powdered Tin Ore",
  "icone": "textures/items/cl/c/estanho_po"
 },
 "cl:estanho_quebrado": {
  "pt": "Pedaço Quebrado de Estanho",
  "en": "Broken Tin Ore",
  "icone": "textures/items/cl/c/estanho_quebrado"
 },
 "cl:estanho_triturado": {
  "pt": "Pedaço Triturado de Estanho",
  "en": "Crushed Tin Ore",
  "icone": "textures/items/cl/c/estanho_triturado"
 },
 "cl:esteira": {
  "pt": "Esteira",
  "en": "Conveyor Belt",
  "icone": "textures/blocks/cl/c/esteira_topo"
 },
 "cl:esteira_animal": {
  "pt": "Esteira de Animal",
  "en": "Treadmill",
  "icone": "textures/blocks/cl/c/esteira_animal_topo"
 },
 "cl:estrutura_maquina": {
  "pt": "Estrutura de Máquina",
  "en": "Machine Frame",
  "icone": "textures/blocks/cl/c/estrutura_maquina_topo"
 },
 "cl:estufa": {
  "pt": "Estufa",
  "en": "Greenhouse",
  "icone": "textures/items/cl/arte/blocos/estufa"
 },
 "cl:extrusora_ignea": {
  "pt": "Extrusora Ígnea",
  "en": "Igneous Extruder",
  "icone": "textures/blocks/cl/c/extrusora_ignea_topo"
 },
 "cl:faca_corte": {
  "pt": "Faca de Corte",
  "en": "Quartz Cutting Knife",
  "icone": "textures/items/cl/c/faca_corte"
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
 "cl:ferro_po": {
  "pt": "Pó de Minério de Ferro",
  "en": "Powdered Iron Ore",
  "icone": "textures/items/cl/arte/ferro_po"
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
  "icone": "textures/blocks/cl/c/fertilizadora_topo"
 },
 "cl:fertilizante": {
  "pt": "Fertilizante",
  "en": "Fertilizer",
  "icone": "textures/items/cl/c/fertilizante"
 },
 "cl:filtro": {
  "pt": "Filtro de Ar",
  "en": "Air Filter",
  "icone": "textures/items/cl/arte/filtro"
 },
 "cl:folha_infestada": {
  "pt": "Folha Infestada",
  "en": "Infested Leaves",
  "icone": "textures/items/cl/blocos/folha_infestada"
 },
 "cl:folha_plastico": {
  "pt": "Folha de Plástico",
  "en": "Plastic Sheet",
  "icone": "textures/items/cl/c/folha_plastico"
 },
 "cl:fornalha_redstone": {
  "pt": "Fornalha de Redstone",
  "en": "Redstone Furnace",
  "icone": "textures/blocks/cl/c/fornalha_redstone_topo"
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
  "icone": "textures/blocks/cl/c/fundidora_inducao_topo"
 },
 "cl:gerador": {
  "pt": "Gerador a Carvão",
  "en": "Coal Generator",
  "icone": "textures/items/cl/arte/blocos/gerador"
 },
 "cl:gerador_monstros": {
  "pt": "Gerador de Monstros",
  "en": "Monster Generator",
  "icone": "textures/items/cl/arte/blocos/gerador_monstros"
 },
 "cl:hamburguer": {
  "pt": "Hambúrguer",
  "en": "Hamburger",
  "icone": "textures/items/cl/arte/hamburguer"
 },
 "cl:idolo_amaldicoado": {
  "pt": "Ídolo Amaldiçoado",
  "en": "Cursed Idol",
  "icone": "textures/items/cl/arte/blocos/idolo_amaldicoado"
 },
 "cl:interface_camara": {
  "pt": "Interface da Câmara",
  "en": "Pressure Chamber Interface",
  "icone": "textures/blocks/cl/c/interface_camara"
 },
 "cl:lingote_aco": {
  "pt": "Lingote de Aço",
  "en": "Steel Ingot",
  "icone": "textures/items/cl/c/lingote_aco"
 },
 "cl:lingote_blutonio": {
  "pt": "Lingote de Blutônio",
  "en": "Blutonium Ingot",
  "icone": "textures/items/cl/c/lingote_blutonio"
 },
 "cl:lingote_bronze": {
  "pt": "Lingote de Bronze",
  "en": "Bronze Ingot",
  "icone": "textures/items/cl/c/lingote_bronze"
 },
 "cl:lingote_cianita": {
  "pt": "Lingote de Cianita",
  "en": "Cyanite Ingot",
  "icone": "textures/items/cl/c/lingote_cianita"
 },
 "cl:lingote_estanho": {
  "pt": "Lingote de Estanho",
  "en": "Tin Ingot",
  "icone": "textures/items/cl/c/lingote_estanho"
 },
 "cl:lingote_ferro_comprimido": {
  "pt": "Lingote de Ferro Comprimido",
  "en": "Compressed Iron Ingot",
  "icone": "textures/items/cl/c/lingote_ferro_comprimido"
 },
 "cl:lingote_yellorium": {
  "pt": "Lingote de Yellorium",
  "en": "Yellorium Ingot",
  "icone": "textures/items/cl/c/lingote_yellorium"
 },
 "cl:machadinha_aco": {
  "pt": "Machadinha de Aço",
  "en": "Steel Hatchet",
  "icone": "textures/items/cl/c/machadinha_aco"
 },
 "cl:machadinha_bronze": {
  "pt": "Machadinha de Bronze",
  "en": "Bronze Hatchet",
  "icone": "textures/items/cl/c/machadinha_bronze"
 },
 "cl:machadinha_cacto": {
  "pt": "Machadinha de Cacto",
  "en": "Cactus Hatchet",
  "icone": "textures/items/cl/c/machadinha_cacto"
 },
 "cl:machadinha_cobre": {
  "pt": "Machadinha de Cobre",
  "en": "Copper Hatchet",
  "icone": "textures/items/cl/c/machadinha_cobre"
 },
 "cl:machadinha_ferro": {
  "pt": "Machadinha de Ferro",
  "en": "Iron Hatchet",
  "icone": "textures/items/cl/c/machadinha_ferro"
 },
 "cl:machadinha_madeira": {
  "pt": "Machadinha de Madeira",
  "en": "Wood Hatchet",
  "icone": "textures/items/cl/c/machadinha_madeira"
 },
 "cl:machadinha_obsidiana": {
  "pt": "Machadinha de Obsidiana",
  "en": "Obsidian Hatchet",
  "icone": "textures/items/cl/c/machadinha_obsidiana"
 },
 "cl:machadinha_osso": {
  "pt": "Machadinha de Osso",
  "en": "Bone Hatchet",
  "icone": "textures/items/cl/c/machadinha_osso"
 },
 "cl:machadinha_pedra": {
  "pt": "Machadinha de Pedra",
  "en": "Stone Hatchet",
  "icone": "textures/items/cl/c/machadinha_pedra"
 },
 "cl:machadinha_silex": {
  "pt": "Machadinha de Sílex",
  "en": "Flint Hatchet",
  "icone": "textures/items/cl/c/machadinha_silex"
 },
 "cl:maionese": {
  "pt": "Maionese",
  "en": "Mayonnaise",
  "icone": "textures/items/cl/arte/maionese"
 },
 "cl:manometro": {
  "pt": "Manômetro",
  "en": "Pressure Gauge",
  "icone": "textures/items/cl/c/manometro"
 },
 "cl:manteiga": {
  "pt": "Manteiga",
  "en": "Butter",
  "icone": "textures/items/cl/arte/manteiga"
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
  "icone": "textures/items/cl/c/matriz_conversao"
 },
 "cl:mesa_fundicao": {
  "pt": "Mesa de Fundição",
  "en": "Casting Table",
  "icone": "textures/blocks/cl/c/mesa_fundicao_topo"
 },
 "cl:mesa_moldes": {
  "pt": "Mesa de Moldes",
  "en": "Stencil Table",
  "icone": "textures/blocks/cl/c/mesa_moldes_topo"
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
 "cl:moinho": {
  "pt": "Moinho de Vento",
  "en": "Windmill",
  "icone": "textures/items/cl/arte/blocos/moinho"
 },
 "cl:molde_cabeca_machado": {
  "pt": "Molde: Cabeça de Machado",
  "en": "Hatchet Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_machado"
 },
 "cl:molde_cabeca_pa": {
  "pt": "Molde: Cabeça de Pá",
  "en": "Shovel Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_pa"
 },
 "cl:molde_cabeca_picareta": {
  "pt": "Molde: Cabeça de Picareta",
  "en": "Pickaxe Head Cast",
  "icone": "textures/items/cl/c/molde_cabeca_picareta"
 },
 "cl:molde_cabo": {
  "pt": "Molde: Cabo",
  "en": "Tool Rod Cast",
  "icone": "textures/items/cl/c/molde_cabo"
 },
 "cl:molde_guarda_larga": {
  "pt": "Molde: Guarda Larga",
  "en": "Wide Guard Cast",
  "icone": "textures/items/cl/c/molde_guarda_larga"
 },
 "cl:molde_lamina_espada": {
  "pt": "Molde: Lâmina de Espada",
  "en": "Sword Blade Cast",
  "icone": "textures/items/cl/c/molde_lamina_espada"
 },
 "cl:molde_ligacao": {
  "pt": "Molde: Ligação",
  "en": "Binding Cast",
  "icone": "textures/items/cl/c/molde_ligacao"
 },
 "cl:molde_lingote": {
  "pt": "Molde de Lingote",
  "en": "Ingot Cast",
  "icone": "textures/items/cl/c/molde_lingote"
 },
 "cl:molde_pepita": {
  "pt": "Molde de Pepita",
  "en": "Nugget Cast",
  "icone": "textures/items/cl/c/molde_pepita"
 },
 "cl:molde_travessa": {
  "pt": "Molde: Travessa",
  "en": "Crossbar Cast",
  "icone": "textures/items/cl/c/molde_travessa"
 },
 "cl:montadora": {
  "pt": "Montadora",
  "en": "Assembler",
  "icone": "textures/items/cl/arte/blocos/montadora"
 },
 "cl:motor_nave": {
  "pt": "Motor da Nave",
  "en": "Ship Engine",
  "icone": "textures/items/cl/arte/motor_nave"
 },
 "cl:nucleo_funil": {
  "pt": "Núcleo de Funil",
  "en": "Hopper Core",
  "icone": "textures/items/cl/c/nucleo_funil"
 },
 "cl:nucleo_sync": {
  "pt": "Núcleo Sync",
  "en": "Sync Core",
  "icone": "textures/items/cl/c/nucleo_sync"
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
  "icone": "textures/items/cl/c/pa_aco"
 },
 "cl:pa_bronze": {
  "pt": "Pá de Bronze",
  "en": "Bronze Shovel",
  "icone": "textures/items/cl/c/pa_bronze"
 },
 "cl:pa_cacto": {
  "pt": "Pá de Cacto",
  "en": "Cactus Shovel",
  "icone": "textures/items/cl/c/pa_cacto"
 },
 "cl:pa_cobre": {
  "pt": "Pá de Cobre",
  "en": "Copper Shovel",
  "icone": "textures/items/cl/c/pa_cobre"
 },
 "cl:pa_ferro": {
  "pt": "Pá de Ferro",
  "en": "Iron Shovel",
  "icone": "textures/items/cl/c/pa_ferro"
 },
 "cl:pa_madeira": {
  "pt": "Pá de Madeira",
  "en": "Wood Shovel",
  "icone": "textures/items/cl/c/pa_madeira"
 },
 "cl:pa_obsidiana": {
  "pt": "Pá de Obsidiana",
  "en": "Obsidian Shovel",
  "icone": "textures/items/cl/c/pa_obsidiana"
 },
 "cl:pa_osso": {
  "pt": "Pá de Osso",
  "en": "Bone Shovel",
  "icone": "textures/items/cl/c/pa_osso"
 },
 "cl:pa_pedra": {
  "pt": "Pá de Pedra",
  "en": "Stone Shovel",
  "icone": "textures/items/cl/c/pa_pedra"
 },
 "cl:pa_silex": {
  "pt": "Pá de Sílex",
  "en": "Flint Shovel",
  "icone": "textures/items/cl/c/pa_silex"
 },
 "cl:padrao_branco": {
  "pt": "Padrão em Branco",
  "en": "Blank Pattern",
  "icone": "textures/items/cl/c/padrao_branco"
 },
 "cl:padrao_cabeca_machado": {
  "pt": "Padrão: Cabeça de Machado",
  "en": "Hatchet Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_machado"
 },
 "cl:padrao_cabeca_pa": {
  "pt": "Padrão: Cabeça de Pá",
  "en": "Shovel Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_pa"
 },
 "cl:padrao_cabeca_picareta": {
  "pt": "Padrão: Cabeça de Picareta",
  "en": "Pickaxe Head Pattern",
  "icone": "textures/items/cl/c/padrao_cabeca_picareta"
 },
 "cl:padrao_cabo": {
  "pt": "Padrão: Cabo",
  "en": "Tool Rod Pattern",
  "icone": "textures/items/cl/c/padrao_cabo"
 },
 "cl:padrao_guarda_larga": {
  "pt": "Padrão: Guarda Larga",
  "en": "Wide Guard Pattern",
  "icone": "textures/items/cl/c/padrao_guarda_larga"
 },
 "cl:padrao_lamina_espada": {
  "pt": "Padrão: Lâmina de Espada",
  "en": "Sword Blade Pattern",
  "icone": "textures/items/cl/c/padrao_lamina_espada"
 },
 "cl:padrao_ligacao": {
  "pt": "Padrão: Ligação",
  "en": "Binding Pattern",
  "icone": "textures/items/cl/c/padrao_ligacao"
 },
 "cl:padrao_travessa": {
  "pt": "Padrão: Travessa",
  "en": "Crossbar Pattern",
  "icone": "textures/items/cl/c/padrao_travessa"
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
  "icone": "textures/blocks/cl/c/parede_camara"
 },
 "cl:peca_cabeca_machado_aco": {
  "pt": "Cabeça de Machado de Aço",
  "en": "Steel Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_aco"
 },
 "cl:peca_cabeca_machado_bronze": {
  "pt": "Cabeça de Machado de Bronze",
  "en": "Bronze Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_bronze"
 },
 "cl:peca_cabeca_machado_cacto": {
  "pt": "Cabeça de Machado de Cacto",
  "en": "Cactus Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_cacto"
 },
 "cl:peca_cabeca_machado_cobre": {
  "pt": "Cabeça de Machado de Cobre",
  "en": "Copper Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_cobre"
 },
 "cl:peca_cabeca_machado_ferro": {
  "pt": "Cabeça de Machado de Ferro",
  "en": "Iron Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_ferro"
 },
 "cl:peca_cabeca_machado_madeira": {
  "pt": "Cabeça de Machado de Madeira",
  "en": "Wood Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_madeira"
 },
 "cl:peca_cabeca_machado_obsidiana": {
  "pt": "Cabeça de Machado de Obsidiana",
  "en": "Obsidian Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_obsidiana"
 },
 "cl:peca_cabeca_machado_osso": {
  "pt": "Cabeça de Machado de Osso",
  "en": "Bone Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_osso"
 },
 "cl:peca_cabeca_machado_pedra": {
  "pt": "Cabeça de Machado de Pedra",
  "en": "Stone Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_pedra"
 },
 "cl:peca_cabeca_machado_silex": {
  "pt": "Cabeça de Machado de Sílex",
  "en": "Flint Hatchet Head",
  "icone": "textures/items/cl/c/peca_cabeca_machado_silex"
 },
 "cl:peca_cabeca_pa_aco": {
  "pt": "Cabeça de Pá de Aço",
  "en": "Steel Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_aco"
 },
 "cl:peca_cabeca_pa_bronze": {
  "pt": "Cabeça de Pá de Bronze",
  "en": "Bronze Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_bronze"
 },
 "cl:peca_cabeca_pa_cacto": {
  "pt": "Cabeça de Pá de Cacto",
  "en": "Cactus Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_cacto"
 },
 "cl:peca_cabeca_pa_cobre": {
  "pt": "Cabeça de Pá de Cobre",
  "en": "Copper Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_cobre"
 },
 "cl:peca_cabeca_pa_ferro": {
  "pt": "Cabeça de Pá de Ferro",
  "en": "Iron Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_ferro"
 },
 "cl:peca_cabeca_pa_madeira": {
  "pt": "Cabeça de Pá de Madeira",
  "en": "Wood Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_madeira"
 },
 "cl:peca_cabeca_pa_obsidiana": {
  "pt": "Cabeça de Pá de Obsidiana",
  "en": "Obsidian Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_obsidiana"
 },
 "cl:peca_cabeca_pa_osso": {
  "pt": "Cabeça de Pá de Osso",
  "en": "Bone Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_osso"
 },
 "cl:peca_cabeca_pa_pedra": {
  "pt": "Cabeça de Pá de Pedra",
  "en": "Stone Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_pedra"
 },
 "cl:peca_cabeca_pa_silex": {
  "pt": "Cabeça de Pá de Sílex",
  "en": "Flint Shovel Head",
  "icone": "textures/items/cl/c/peca_cabeca_pa_silex"
 },
 "cl:peca_cabeca_picareta_aco": {
  "pt": "Cabeça de Picareta de Aço",
  "en": "Steel Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_aco"
 },
 "cl:peca_cabeca_picareta_bronze": {
  "pt": "Cabeça de Picareta de Bronze",
  "en": "Bronze Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_bronze"
 },
 "cl:peca_cabeca_picareta_cacto": {
  "pt": "Cabeça de Picareta de Cacto",
  "en": "Cactus Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_cacto"
 },
 "cl:peca_cabeca_picareta_cobre": {
  "pt": "Cabeça de Picareta de Cobre",
  "en": "Copper Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_cobre"
 },
 "cl:peca_cabeca_picareta_ferro": {
  "pt": "Cabeça de Picareta de Ferro",
  "en": "Iron Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_ferro"
 },
 "cl:peca_cabeca_picareta_madeira": {
  "pt": "Cabeça de Picareta de Madeira",
  "en": "Wood Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_madeira"
 },
 "cl:peca_cabeca_picareta_obsidiana": {
  "pt": "Cabeça de Picareta de Obsidiana",
  "en": "Obsidian Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_obsidiana"
 },
 "cl:peca_cabeca_picareta_osso": {
  "pt": "Cabeça de Picareta de Osso",
  "en": "Bone Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_osso"
 },
 "cl:peca_cabeca_picareta_pedra": {
  "pt": "Cabeça de Picareta de Pedra",
  "en": "Stone Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_pedra"
 },
 "cl:peca_cabeca_picareta_silex": {
  "pt": "Cabeça de Picareta de Sílex",
  "en": "Flint Pickaxe Head",
  "icone": "textures/items/cl/c/peca_cabeca_picareta_silex"
 },
 "cl:peca_cabo_aco": {
  "pt": "Cabo de Aço",
  "en": "Steel Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_aco"
 },
 "cl:peca_cabo_bronze": {
  "pt": "Cabo de Bronze",
  "en": "Bronze Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_bronze"
 },
 "cl:peca_cabo_cacto": {
  "pt": "Cabo de Cacto",
  "en": "Cactus Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_cacto"
 },
 "cl:peca_cabo_cobre": {
  "pt": "Cabo de Cobre",
  "en": "Copper Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_cobre"
 },
 "cl:peca_cabo_ferro": {
  "pt": "Cabo de Ferro",
  "en": "Iron Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_ferro"
 },
 "cl:peca_cabo_madeira": {
  "pt": "Cabo de Madeira",
  "en": "Wood Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_madeira"
 },
 "cl:peca_cabo_obsidiana": {
  "pt": "Cabo de Obsidiana",
  "en": "Obsidian Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_obsidiana"
 },
 "cl:peca_cabo_osso": {
  "pt": "Cabo de Osso",
  "en": "Bone Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_osso"
 },
 "cl:peca_cabo_pedra": {
  "pt": "Cabo de Pedra",
  "en": "Stone Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_pedra"
 },
 "cl:peca_cabo_silex": {
  "pt": "Cabo de Sílex",
  "en": "Flint Tool Rod",
  "icone": "textures/items/cl/c/peca_cabo_silex"
 },
 "cl:peca_guarda_larga_aco": {
  "pt": "Guarda Larga de Aço",
  "en": "Steel Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_aco"
 },
 "cl:peca_guarda_larga_bronze": {
  "pt": "Guarda Larga de Bronze",
  "en": "Bronze Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_bronze"
 },
 "cl:peca_guarda_larga_cacto": {
  "pt": "Guarda Larga de Cacto",
  "en": "Cactus Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_cacto"
 },
 "cl:peca_guarda_larga_cobre": {
  "pt": "Guarda Larga de Cobre",
  "en": "Copper Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_cobre"
 },
 "cl:peca_guarda_larga_ferro": {
  "pt": "Guarda Larga de Ferro",
  "en": "Iron Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_ferro"
 },
 "cl:peca_guarda_larga_madeira": {
  "pt": "Guarda Larga de Madeira",
  "en": "Wood Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_madeira"
 },
 "cl:peca_guarda_larga_obsidiana": {
  "pt": "Guarda Larga de Obsidiana",
  "en": "Obsidian Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_obsidiana"
 },
 "cl:peca_guarda_larga_osso": {
  "pt": "Guarda Larga de Osso",
  "en": "Bone Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_osso"
 },
 "cl:peca_guarda_larga_pedra": {
  "pt": "Guarda Larga de Pedra",
  "en": "Stone Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_pedra"
 },
 "cl:peca_guarda_larga_silex": {
  "pt": "Guarda Larga de Sílex",
  "en": "Flint Wide Guard",
  "icone": "textures/items/cl/c/peca_guarda_larga_silex"
 },
 "cl:peca_lamina_espada_aco": {
  "pt": "Lâmina de Espada de Aço",
  "en": "Steel Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_aco"
 },
 "cl:peca_lamina_espada_bronze": {
  "pt": "Lâmina de Espada de Bronze",
  "en": "Bronze Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_bronze"
 },
 "cl:peca_lamina_espada_cacto": {
  "pt": "Lâmina de Espada de Cacto",
  "en": "Cactus Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_cacto"
 },
 "cl:peca_lamina_espada_cobre": {
  "pt": "Lâmina de Espada de Cobre",
  "en": "Copper Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_cobre"
 },
 "cl:peca_lamina_espada_ferro": {
  "pt": "Lâmina de Espada de Ferro",
  "en": "Iron Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_ferro"
 },
 "cl:peca_lamina_espada_madeira": {
  "pt": "Lâmina de Espada de Madeira",
  "en": "Wood Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_madeira"
 },
 "cl:peca_lamina_espada_obsidiana": {
  "pt": "Lâmina de Espada de Obsidiana",
  "en": "Obsidian Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_obsidiana"
 },
 "cl:peca_lamina_espada_osso": {
  "pt": "Lâmina de Espada de Osso",
  "en": "Bone Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_osso"
 },
 "cl:peca_lamina_espada_pedra": {
  "pt": "Lâmina de Espada de Pedra",
  "en": "Stone Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_pedra"
 },
 "cl:peca_lamina_espada_silex": {
  "pt": "Lâmina de Espada de Sílex",
  "en": "Flint Sword Blade",
  "icone": "textures/items/cl/c/peca_lamina_espada_silex"
 },
 "cl:peca_ligacao_aco": {
  "pt": "Ligação de Aço",
  "en": "Steel Binding",
  "icone": "textures/items/cl/c/peca_ligacao_aco"
 },
 "cl:peca_ligacao_bronze": {
  "pt": "Ligação de Bronze",
  "en": "Bronze Binding",
  "icone": "textures/items/cl/c/peca_ligacao_bronze"
 },
 "cl:peca_ligacao_cacto": {
  "pt": "Ligação de Cacto",
  "en": "Cactus Binding",
  "icone": "textures/items/cl/c/peca_ligacao_cacto"
 },
 "cl:peca_ligacao_cobre": {
  "pt": "Ligação de Cobre",
  "en": "Copper Binding",
  "icone": "textures/items/cl/c/peca_ligacao_cobre"
 },
 "cl:peca_ligacao_ferro": {
  "pt": "Ligação de Ferro",
  "en": "Iron Binding",
  "icone": "textures/items/cl/c/peca_ligacao_ferro"
 },
 "cl:peca_ligacao_madeira": {
  "pt": "Ligação de Madeira",
  "en": "Wood Binding",
  "icone": "textures/items/cl/c/peca_ligacao_madeira"
 },
 "cl:peca_ligacao_obsidiana": {
  "pt": "Ligação de Obsidiana",
  "en": "Obsidian Binding",
  "icone": "textures/items/cl/c/peca_ligacao_obsidiana"
 },
 "cl:peca_ligacao_osso": {
  "pt": "Ligação de Osso",
  "en": "Bone Binding",
  "icone": "textures/items/cl/c/peca_ligacao_osso"
 },
 "cl:peca_ligacao_pedra": {
  "pt": "Ligação de Pedra",
  "en": "Stone Binding",
  "icone": "textures/items/cl/c/peca_ligacao_pedra"
 },
 "cl:peca_ligacao_silex": {
  "pt": "Ligação de Sílex",
  "en": "Flint Binding",
  "icone": "textures/items/cl/c/peca_ligacao_silex"
 },
 "cl:peca_travessa_aco": {
  "pt": "Travessa de Aço",
  "en": "Steel Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_aco"
 },
 "cl:peca_travessa_bronze": {
  "pt": "Travessa de Bronze",
  "en": "Bronze Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_bronze"
 },
 "cl:peca_travessa_cacto": {
  "pt": "Travessa de Cacto",
  "en": "Cactus Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_cacto"
 },
 "cl:peca_travessa_cobre": {
  "pt": "Travessa de Cobre",
  "en": "Copper Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_cobre"
 },
 "cl:peca_travessa_ferro": {
  "pt": "Travessa de Ferro",
  "en": "Iron Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_ferro"
 },
 "cl:peca_travessa_madeira": {
  "pt": "Travessa de Madeira",
  "en": "Wood Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_madeira"
 },
 "cl:peca_travessa_obsidiana": {
  "pt": "Travessa de Obsidiana",
  "en": "Obsidian Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_obsidiana"
 },
 "cl:peca_travessa_osso": {
  "pt": "Travessa de Osso",
  "en": "Bone Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_osso"
 },
 "cl:peca_travessa_pedra": {
  "pt": "Travessa de Pedra",
  "en": "Stone Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_pedra"
 },
 "cl:peca_travessa_silex": {
  "pt": "Travessa de Sílex",
  "en": "Flint Crossbar",
  "icone": "textures/items/cl/c/peca_travessa_silex"
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
 "cl:picareta_aco": {
  "pt": "Picareta de Aço",
  "en": "Steel Pickaxe",
  "icone": "textures/items/cl/c/picareta_aco"
 },
 "cl:picareta_bronze": {
  "pt": "Picareta de Bronze",
  "en": "Bronze Pickaxe",
  "icone": "textures/items/cl/c/picareta_bronze"
 },
 "cl:picareta_cacto": {
  "pt": "Picareta de Cacto",
  "en": "Cactus Pickaxe",
  "icone": "textures/items/cl/c/picareta_cacto"
 },
 "cl:picareta_cobre": {
  "pt": "Picareta de Cobre",
  "en": "Copper Pickaxe",
  "icone": "textures/items/cl/c/picareta_cobre"
 },
 "cl:picareta_ferro": {
  "pt": "Picareta de Ferro",
  "en": "Iron Pickaxe",
  "icone": "textures/items/cl/c/picareta_ferro"
 },
 "cl:picareta_madeira": {
  "pt": "Picareta de Madeira",
  "en": "Wood Pickaxe",
  "icone": "textures/items/cl/c/picareta_madeira"
 },
 "cl:picareta_obsidiana": {
  "pt": "Picareta de Obsidiana",
  "en": "Obsidian Pickaxe",
  "icone": "textures/items/cl/c/picareta_obsidiana"
 },
 "cl:picareta_osso": {
  "pt": "Picareta de Osso",
  "en": "Bone Pickaxe",
  "icone": "textures/items/cl/c/picareta_osso"
 },
 "cl:picareta_pedra": {
  "pt": "Picareta de Pedra",
  "en": "Stone Pickaxe",
  "icone": "textures/items/cl/c/picareta_pedra"
 },
 "cl:picareta_silex": {
  "pt": "Picareta de Sílex",
  "en": "Flint Pickaxe",
  "icone": "textures/items/cl/c/picareta_silex"
 },
 "cl:pilao": {
  "pt": "Pilão",
  "en": "Mortar and Pestle",
  "icone": "textures/items/cl/blocos/pilao"
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
 "cl:placa_casco": {
  "pt": "Placa de Casco",
  "en": "Hull Plate",
  "icone": "textures/items/cl/arte/placa_casco"
 },
 "cl:placa_circuito_vazia": {
  "pt": "Placa de Circuito Vazia",
  "en": "Empty PCB",
  "icone": "textures/items/cl/c/placa_circuito_vazia"
 },
 "cl:planta_alho": {
  "pt": "Plantação de Alho",
  "en": "Garlic Crop",
  "icone": "textures/blocks/cl/hc/alho_0"
 },
 "cl:planta_amendoim": {
  "pt": "Plantação de Amendoim",
  "en": "Peanut Crop",
  "icone": "textures/blocks/cl/hc/amendoim_0"
 },
 "cl:planta_arroz": {
  "pt": "Plantação de Arroz",
  "en": "Rice Crop",
  "icone": "textures/blocks/cl/hc/arroz_0"
 },
 "cl:planta_cebola": {
  "pt": "Plantação de Cebola",
  "en": "Onion Crop",
  "icone": "textures/blocks/cl/hc/cebola_0"
 },
 "cl:planta_feijao": {
  "pt": "Plantação de Feijão",
  "en": "Beans Crop",
  "icone": "textures/blocks/cl/hc/feijao_0"
 },
 "cl:planta_fruta_cacto": {
  "pt": "Plantação de Fruta do Cacto",
  "en": "Cactus Fruit Crop",
  "icone": "textures/blocks/cl/hc/fruta_cacto_0"
 },
 "cl:planta_milho": {
  "pt": "Plantação de Milho",
  "en": "Corn Crop",
  "icone": "textures/blocks/cl/hc/milho_0"
 },
 "cl:planta_pimenta": {
  "pt": "Plantação de Pimenta",
  "en": "Chili Pepper Crop",
  "icone": "textures/blocks/cl/hc/pimenta_0"
 },
 "cl:planta_pimentao": {
  "pt": "Plantação de Pimentão",
  "en": "Bell Pepper Crop",
  "icone": "textures/blocks/cl/hc/pimentao_0"
 },
 "cl:planta_tomate": {
  "pt": "Plantação de Tomate",
  "en": "Tomato Crop",
  "icone": "textures/blocks/cl/hc/tomate_0"
 },
 "cl:plantadeira": {
  "pt": "Plantadeira",
  "en": "Planter",
  "icone": "textures/blocks/cl/c/plantadeira_topo"
 },
 "cl:plastico_cru": {
  "pt": "Plástico Cru",
  "en": "Raw Plastic",
  "icone": "textures/items/cl/c/plastico_cru"
 },
 "cl:po_certus": {
  "pt": "Pó de Certus",
  "en": "Certus Quartz Dust",
  "icone": "textures/items/cl/c/po_certus"
 },
 "cl:po_cobre": {
  "pt": "Pó de Cobre",
  "en": "Pulverized Copper",
  "icone": "textures/items/cl/c/po_cobre"
 },
 "cl:po_estanho": {
  "pt": "Pó de Estanho",
  "en": "Pulverized Tin",
  "icone": "textures/items/cl/c/po_estanho"
 },
 "cl:po_ferro": {
  "pt": "Pó de Ferro",
  "en": "Pulverized Iron",
  "icone": "textures/items/cl/c/po_ferro"
 },
 "cl:po_fluix": {
  "pt": "Pó Fluix",
  "en": "Fluix Dust",
  "icone": "textures/items/cl/c/po_fluix"
 },
 "cl:po_ouro": {
  "pt": "Pó de Ouro",
  "en": "Pulverized Gold",
  "icone": "textures/items/cl/c/po_ouro"
 },
 "cl:po_yellorium": {
  "pt": "Pó de Yellorium",
  "en": "Yellorium Dust",
  "icone": "textures/items/cl/c/po_yellorium"
 },
 "cl:poeira": {
  "pt": "Poeira",
  "en": "Dust",
  "icone": "textures/items/cl/blocos/poeira"
 },
 "cl:ponto_acesso": {
  "pt": "Ponto de Acesso sem Fio",
  "en": "Wireless Access Point",
  "icone": "textures/blocks/cl/c/ponto_acesso_topo"
 },
 "cl:porcelana": {
  "pt": "Porcelana",
  "en": "Porcelain",
  "icone": "textures/items/cl/arte/porcelana"
 },
 "cl:porta_acesso_reator": {
  "pt": "Porta de Acesso",
  "en": "Reactor Access Port",
  "icone": "textures/blocks/cl/c/porta_acesso_reator_topo"
 },
 "cl:porta_refrigeracao": {
  "pt": "Porta de Refrigeração",
  "en": "Reactor Coolant Port",
  "icone": "textures/blocks/cl/c/porta_refrigeracao_topo"
 },
 "cl:precipitador_glacial": {
  "pt": "Precipitador Glacial",
  "en": "Glacial Precipitator",
  "icone": "textures/blocks/cl/c/precipitador_glacial_topo"
 },
 "cl:processador_avancado": {
  "pt": "Processador Avançado",
  "en": "Advanced Processor",
  "icone": "textures/items/cl/c/processador_avancado"
 },
 "cl:processador_basico": {
  "pt": "Processador Básico",
  "en": "Basic Processor",
  "icone": "textures/items/cl/c/processador_basico"
 },
 "cl:pulverizador": {
  "pt": "Pulverizador",
  "en": "Pulverizer",
  "icone": "textures/blocks/cl/c/pulverizador_topo"
 },
 "cl:quebrador_blocos": {
  "pt": "Quebrador de Blocos",
  "en": "Block Breaker",
  "icone": "textures/blocks/cl/c/quebrador_blocos_topo"
 },
 "cl:queijo": {
  "pt": "Queijo",
  "en": "Cheese",
  "icone": "textures/items/cl/arte/queijo"
 },
 "cl:rancheiro": {
  "pt": "Rancheiro",
  "en": "Rancher",
  "icone": "textures/blocks/cl/c/rancheiro_topo"
 },
 "cl:reprocessador_cianita": {
  "pt": "Reprocessador de Cianita",
  "en": "Cyanite Reprocessor",
  "icone": "textures/blocks/cl/c/reprocessador_cianita_topo"
 },
 "cl:resina": {
  "pt": "Resina",
  "en": "Sap",
  "icone": "textures/items/cl/c/resina"
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
 "cl:serragem": {
  "pt": "Serragem",
  "en": "Sawdust",
  "icone": "textures/items/cl/c/serragem"
 },
 "cl:serraria": {
  "pt": "Serraria",
  "en": "Sawmill",
  "icone": "textures/blocks/cl/c/serraria_topo"
 },
 "cl:silicio": {
  "pt": "Silício",
  "en": "Silicon",
  "icone": "textures/items/cl/c/silicio"
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
 "cl:tabua_corte": {
  "pt": "Tábua de Corte",
  "en": "Cutting Board",
  "icone": "textures/items/cl/blocos/tabua_corte"
 },
 "cl:taco": {
  "pt": "Taco",
  "en": "Taco",
  "icone": "textures/items/cl/arte/taco"
 },
 "cl:tanque_refratario": {
  "pt": "Tanque Refratário",
  "en": "Seared Tank",
  "icone": "textures/blocks/cl/c/tanque_refratario"
 },
 "cl:terminal": {
  "pt": "Terminal de Armazenamento",
  "en": "Storage Terminal",
  "icone": "textures/items/cl/arte/blocos/terminal"
 },
 "cl:terminal_sem_fio": {
  "pt": "Terminal sem Fio",
  "en": "Wireless Terminal",
  "icone": "textures/items/cl/c/terminal_sem_fio"
 },
 "cl:tigela_mistura": {
  "pt": "Tigela de Mistura",
  "en": "Mixing Bowl",
  "icone": "textures/items/cl/arte/blocos/tigela_mistura"
 },
 "cl:tijolo_refratario": {
  "pt": "Tijolo Refratário",
  "en": "Seared Brick",
  "icone": "textures/items/cl/c/tijolo_refratario"
 },
 "cl:tijolos_refratarios": {
  "pt": "Tijolos Refratários",
  "en": "Seared Bricks",
  "icone": "textures/blocks/cl/c/tijolos_refratarios"
 },
 "cl:tomada_energia": {
  "pt": "Tomada de Energia",
  "en": "Reactor Power Tap",
  "icone": "textures/blocks/cl/c/tomada_energia_topo"
 },
 "cl:tomate": {
  "pt": "Tomate",
  "en": "Tomato",
  "icone": "textures/items/cl/arte/tomate"
 },
 "cl:torneira": {
  "pt": "Torneira",
  "en": "Faucet",
  "icone": "textures/blocks/cl/c/torneira"
 },
 "cl:torrada": {
  "pt": "Torrada",
  "en": "Toast",
  "icone": "textures/items/cl/arte/torrada"
 },
 "cl:tortilha": {
  "pt": "Tortilha",
  "en": "Tortilla",
  "icone": "textures/items/cl/arte/tortilha"
 },
 "cl:transistor": {
  "pt": "Transistor",
  "en": "Transistor",
  "icone": "textures/items/cl/c/transistor"
 },
 "cl:triturador_monstros": {
  "pt": "Triturador de Monstros",
  "en": "Mob Grinder",
  "icone": "textures/blocks/cl/c/triturador_monstros_topo"
 },
 "cl:tubo_pressao": {
  "pt": "Tubo de Pressão",
  "en": "Pressure Tube",
  "icone": "textures/blocks/cl/c/tubo_pressao"
 },
 "cl:tubo_pressao_avancado": {
  "pt": "Tubo de Pressão Avançado",
  "en": "Advanced Pressure Tube",
  "icone": "textures/blocks/cl/c/tubo_pressao_avancado"
 },
 "cl:upgrade_alcance_1": {
  "pt": "Upgrade de Alcance +1",
  "en": "Range Upgrade +1",
  "icone": "textures/items/cl/c/upgrade_alcance_1"
 },
 "cl:upgrade_alcance_2": {
  "pt": "Upgrade de Alcance +2",
  "en": "Range Upgrade +2",
  "icone": "textures/items/cl/c/upgrade_alcance_2"
 },
 "cl:upgrade_alcance_3": {
  "pt": "Upgrade de Alcance +3",
  "en": "Range Upgrade +3",
  "icone": "textures/items/cl/c/upgrade_alcance_3"
 },
 "cl:upgrade_alcance_4": {
  "pt": "Upgrade de Alcance +4",
  "en": "Range Upgrade +4",
  "icone": "textures/items/cl/c/upgrade_alcance_4"
 },
 "cl:upgrade_alcance_5": {
  "pt": "Upgrade de Alcance +5",
  "en": "Range Upgrade +5",
  "icone": "textures/items/cl/c/upgrade_alcance_5"
 },
 "cl:upgrade_armazenamento": {
  "pt": "Upgrade de Armazenamento",
  "en": "Storage Upgrade",
  "icone": "textures/items/cl/c/upgrade_armazenamento"
 },
 "cl:upgrade_estrutural_1": {
  "pt": "Upgrade Estrutural MK I",
  "en": "Structural Upgrade MK I",
  "icone": "textures/items/cl/c/upgrade_estrutural_1"
 },
 "cl:upgrade_estrutural_2": {
  "pt": "Upgrade Estrutural MK II",
  "en": "Structural Upgrade MK II",
  "icone": "textures/items/cl/c/upgrade_estrutural_2"
 },
 "cl:upgrade_estrutural_3": {
  "pt": "Upgrade Estrutural MK III",
  "en": "Structural Upgrade MK III",
  "icone": "textures/items/cl/c/upgrade_estrutural_3"
 },
 "cl:upgrade_estrutural_4": {
  "pt": "Upgrade Estrutural MK IV",
  "en": "Structural Upgrade MK IV",
  "icone": "textures/items/cl/c/upgrade_estrutural_4"
 },
 "cl:upgrade_estrutural_5": {
  "pt": "Upgrade Estrutural MK V",
  "en": "Structural Upgrade MK V",
  "icone": "textures/items/cl/c/upgrade_estrutural_5"
 },
 "cl:upgrade_estrutural_6": {
  "pt": "Upgrade Estrutural MK VI",
  "en": "Structural Upgrade MK VI",
  "icone": "textures/items/cl/c/upgrade_estrutural_6"
 },
 "cl:upgrade_estrutural_7": {
  "pt": "Upgrade Estrutural MK VII",
  "en": "Structural Upgrade MK VII",
  "icone": "textures/items/cl/c/upgrade_estrutural_7"
 },
 "cl:valvula_camara": {
  "pt": "Válvula da Câmara",
  "en": "Pressure Chamber Valve",
  "icone": "textures/blocks/cl/c/valvula_camara"
 },
 "cl:vidro_camara": {
  "pt": "Vidro da Câmara de Pressão",
  "en": "Pressure Chamber Glass",
  "icone": "textures/blocks/cl/c/vidro_camara"
 },
 "cl:vidro_reator": {
  "pt": "Vidro do Reator",
  "en": "Reactor Glass",
  "icone": "textures/blocks/cl/c/vidro_reator"
 },
 "cl:vidro_refratario": {
  "pt": "Vidro Refratário",
  "en": "Seared Glass",
  "icone": "textures/blocks/cl/c/vidro_refratario"
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
 "minecraft:air": {
  "pt": "Ar",
  "en": "Air"
 },
 "minecraft:andesite": {
  "pt": "Andesito",
  "en": "Andesite",
  "icone": "textures/blocks/stone_andesite"
 },
 "minecraft:apple": {
  "pt": "Maçã",
  "en": "Apple",
  "icone": "textures/items/apple"
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
 "minecraft:deepslate_copper_ore": {
  "pt": "Minério de Cobre de Ardosiabissal",
  "en": "Deepslate Copper Ore",
  "icone": "textures/blocks/deepslate/deepslate_copper_ore"
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
 "minecraft:diamond": {
  "pt": "Diamante",
  "en": "Diamond",
  "icone": "textures/items/diamond"
 },
 "minecraft:diamond_block": {
  "pt": "Bloco de Diamante",
  "en": "Block of Diamond",
  "icone": "textures/blocks/diamond_block"
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
 "minecraft:enchanted_golden_apple": {
  "pt": "Maçã Dourada Encantada",
  "en": "Enchanted Golden Apple",
  "icone": "textures/items/apple_golden"
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
 "minecraft:flower_pot": {
  "pt": "Vaso de Flor",
  "en": "Flower Pot",
  "icone": "textures/items/flower_pot"
 },
 "minecraft:flowing_lava": {
  "pt": "Lava",
  "en": "Lava",
  "icone": "textures/blocks/lava_flow"
 },
 "minecraft:flowing_water": {
  "pt": "Água",
  "en": "Water",
  "icone": "textures/blocks/water_flow_grey"
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
 "minecraft:iron_block": {
  "pt": "Bloco de Ferro",
  "en": "Block of Iron",
  "icone": "textures/blocks/iron_block"
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
 "minecraft:lava": {
  "pt": "Lava",
  "en": "Lava",
  "icone": "textures/blocks/lava_flow"
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
 "minecraft:light_gray_carpet": {
  "pt": "Carpete Cinza-claro",
  "en": "Light Gray Carpet",
  "icone": "textures/blocks/wool_colored_silver"
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
 "minecraft:red_sand": {
  "pt": "Areia Vermelha",
  "en": "Red Sand",
  "icone": "textures/blocks/red_sand"
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
 "minecraft:trapped_chest": {
  "pt": "Baú com Armadilha",
  "en": "Trapped Chest",
  "icone": "textures/blocks/chest_front"
 },
 "minecraft:water": {
  "pt": "Água",
  "en": "Water",
  "icone": "textures/blocks/water_flow_grey"
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
  "id": "cl:c_chave_barril",
  "resultado": "cl:chave_barril",
  "qtd": 1,
  "grade": [
   "FF",
   "FS",
   " S"
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

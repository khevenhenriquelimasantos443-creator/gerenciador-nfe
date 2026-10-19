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
  "icone": "textures/items/cl/agua_boa"
 },
 "cl:agua_excelente": {
  "pt": "Água Excelente",
  "en": "Excellent Water",
  "icone": "textures/items/cl/agua_excelente"
 },
 "cl:agua_impropria": {
  "pt": "Água Salgada",
  "en": "Salt Water",
  "icone": "textures/items/cl/agua_impropria"
 },
 "cl:agua_muito_suja": {
  "pt": "Água Muito Suja",
  "en": "Very Dirty Water",
  "icone": "textures/items/cl/agua_muito_suja"
 },
 "cl:agua_suja": {
  "pt": "Água Suja",
  "en": "Dirty Water",
  "icone": "textures/items/cl/agua_suja"
 },
 "cl:alho": {
  "pt": "Alho",
  "en": "Garlic",
  "icone": "textures/items/cl/hc/alho"
 },
 "cl:amendoim": {
  "pt": "Amendoim",
  "en": "Peanut",
  "icone": "textures/items/cl/hc/amendoim"
 },
 "cl:arroz": {
  "pt": "Arroz",
  "en": "Rice",
  "icone": "textures/items/cl/hc/arroz"
 },
 "cl:arroz_frito": {
  "pt": "Arroz Frito",
  "en": "Fried Rice",
  "icone": "textures/items/cl/hc/arroz_frito"
 },
 "cl:assadeira": {
  "pt": "Assadeira",
  "en": "Bakeware",
  "icone": "textures/items/cl/blocos/assadeira"
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
  "icone": "textures/items/cl/blocos/bateria"
 },
 "cl:bicho_seda": {
  "pt": "Bicho-da-seda",
  "en": "Silkworm",
  "icone": "textures/items/cl/v/bicho_seda"
 },
 "cl:bicho_seda_cozido": {
  "pt": "Bicho-da-seda Cozido",
  "en": "Cooked Silkworm",
  "icone": "textures/items/cl/v/bicho_seda_cozido"
 },
 "cl:bolinho_arroz": {
  "pt": "Bolinho de Arroz",
  "en": "Rice Cake",
  "icone": "textures/items/cl/hc/bolinho_arroz"
 },
 "cl:broa_milho": {
  "pt": "Broa de Milho",
  "en": "Cornbread",
  "icone": "textures/items/cl/hc/broa_milho"
 },
 "cl:burrito": {
  "pt": "Burrito de Feijão",
  "en": "Bean Burrito",
  "icone": "textures/items/cl/hc/burrito"
 },
 "cl:cabo": {
  "pt": "Cabo de Cobre",
  "en": "Copper Cable",
  "icone": "textures/items/cl/blocos/cabo"
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
  "icone": "textures/items/cl/v/cadinho_cru"
 },
 "cl:cajado": {
  "pt": "Cajado",
  "en": "Crook",
  "icone": "textures/items/cl/v/cajado"
 },
 "cl:caldo": {
  "pt": "Caldo",
  "en": "Stock",
  "icone": "textures/items/cl/hc/caldo"
 },
 "cl:camel_pack": {
  "pt": "Camel Pack",
  "en": "Camel Pack",
  "icone": "textures/items/cl/v/camel_pack"
 },
 "cl:catalogo": {
  "pt": "Catálogo",
  "en": "Catalog",
  "icone": "textures/items/cl/v/catalogo"
 },
 "cl:cebola": {
  "pt": "Cebola",
  "en": "Onion",
  "icone": "textures/items/cl/hc/cebola"
 },
 "cl:celula_combustivel": {
  "pt": "Célula de Combustível",
  "en": "Fuel Cell",
  "icone": "textures/items/cl/v/celula_combustivel"
 },
 "cl:charque": {
  "pt": "Charque",
  "en": "Beef Jerky",
  "icone": "textures/items/cl/hc/charque"
 },
 "cl:chili_poppers": {
  "pt": "Pimentas Empanadas",
  "en": "Chili Poppers",
  "icone": "textures/items/cl/hc/chili_poppers"
 },
 "cl:circuito": {
  "pt": "Circuito",
  "en": "Circuit",
  "icone": "textures/items/cl/v/circuito"
 },
 "cl:cobre_po": {
  "pt": "Pó de Minério de Cobre",
  "en": "Powdered Copper Ore",
  "icone": "textures/items/cl/v/cobre_po"
 },
 "cl:cobre_quebrado": {
  "pt": "Pedaço Quebrado de Cobre",
  "en": "Broken Copper Ore",
  "icone": "textures/items/cl/v/cobre_quebrado"
 },
 "cl:cobre_triturado": {
  "pt": "Pedaço Triturado de Cobre",
  "en": "Crushed Copper Ore",
  "icone": "textures/items/cl/v/cobre_triturado"
 },
 "cl:compostor": {
  "pt": "Compostor de Terra",
  "en": "Dirt Composter",
  "icone": "textures/items/cl/blocos/compostor"
 },
 "cl:computador_bordo": {
  "pt": "Computador de Bordo",
  "en": "Flight Computer",
  "icone": "textures/items/cl/v/computador_bordo"
 },
 "cl:condensador_agua": {
  "pt": "Condensador de Água",
  "en": "Water Condenser",
  "icone": "textures/items/cl/blocos/condensador_agua"
 },
 "cl:condensador_avancado": {
  "pt": "Condensador Avançado",
  "en": "Advanced Condenser",
  "icone": "textures/items/cl/blocos/condensador_avancado"
 },
 "cl:coracao_farao": {
  "pt": "Coração do Faraó",
  "en": "Pharaoh's Heart",
  "icone": "textures/items/cl/v/coracao_farao"
 },
 "cl:diario_bordo": {
  "pt": "Diário de Bordo",
  "en": "Logbook",
  "icone": "textures/items/cl/v/diario_bordo"
 },
 "cl:espremedor": {
  "pt": "Espremedor",
  "en": "Juicer",
  "icone": "textures/items/cl/blocos/espremedor"
 },
 "cl:estufa": {
  "pt": "Estufa",
  "en": "Greenhouse",
  "icone": "textures/items/cl/blocos/estufa"
 },
 "cl:faixa_mumia": {
  "pt": "Faixa de Múmia",
  "en": "Mummy Wrap",
  "icone": "textures/items/cl/faixa_mumia"
 },
 "cl:farinha": {
  "pt": "Farinha",
  "en": "Flour",
  "icone": "textures/items/cl/hc/farinha"
 },
 "cl:feijao": {
  "pt": "Feijão",
  "en": "Beans",
  "icone": "textures/items/cl/hc/feijao"
 },
 "cl:feijao_assado": {
  "pt": "Feijão Assado",
  "en": "Baked Beans",
  "icone": "textures/items/cl/hc/feijao_assado"
 },
 "cl:ferro_po": {
  "pt": "Pó de Minério de Ferro",
  "en": "Powdered Iron Ore",
  "icone": "textures/items/cl/v/ferro_po"
 },
 "cl:ferro_quebrado": {
  "pt": "Pedaço Quebrado de Ferro",
  "en": "Broken Iron Ore",
  "icone": "textures/items/cl/v/ferro_quebrado"
 },
 "cl:ferro_triturado": {
  "pt": "Pedaço Triturado de Ferro",
  "en": "Crushed Iron Ore",
  "icone": "textures/items/cl/v/ferro_triturado"
 },
 "cl:filtro": {
  "pt": "Filtro de Ar",
  "en": "Air Filter",
  "icone": "textures/items/cl/v/filtro"
 },
 "cl:folha_infestada": {
  "pt": "Folha Infestada",
  "en": "Infested Leaves",
  "icone": "textures/items/cl/blocos/folha_infestada"
 },
 "cl:frigideira": {
  "pt": "Frigideira",
  "en": "Skillet",
  "icone": "textures/items/cl/blocos/frigideira"
 },
 "cl:fruta_cacto": {
  "pt": "Fruta do Cacto",
  "en": "Cactus Fruit",
  "icone": "textures/items/cl/fruta_cacto"
 },
 "cl:fuba": {
  "pt": "Fubá",
  "en": "Cornmeal",
  "icone": "textures/items/cl/hc/fuba"
 },
 "cl:gerador": {
  "pt": "Gerador a Carvão",
  "en": "Coal Generator",
  "icone": "textures/items/cl/blocos/gerador"
 },
 "cl:gerador_monstros": {
  "pt": "Gerador de Monstros",
  "en": "Monster Generator",
  "icone": "textures/items/cl/blocos/gerador_monstros"
 },
 "cl:hamburguer": {
  "pt": "Hambúrguer",
  "en": "Hamburger",
  "icone": "textures/items/cl/hc/hamburguer"
 },
 "cl:idolo_amaldicoado": {
  "pt": "Ídolo Amaldiçoado",
  "en": "Cursed Idol",
  "icone": "textures/items/cl/blocos/idolo_amaldicoado"
 },
 "cl:maionese": {
  "pt": "Maionese",
  "en": "Mayonnaise",
  "icone": "textures/items/cl/hc/maionese"
 },
 "cl:manteiga": {
  "pt": "Manteiga",
  "en": "Butter",
  "icone": "textures/items/cl/hc/manteiga"
 },
 "cl:martelo_cobre": {
  "pt": "Martelo de Cobre",
  "en": "Copper Hammer",
  "icone": "textures/items/cl/v/martelo_cobre"
 },
 "cl:martelo_diamante": {
  "pt": "Martelo de Diamante",
  "en": "Diamond Hammer",
  "icone": "textures/items/cl/v/martelo_diamante"
 },
 "cl:martelo_ferro": {
  "pt": "Martelo de Ferro",
  "en": "Iron Hammer",
  "icone": "textures/items/cl/v/martelo_ferro"
 },
 "cl:martelo_madeira": {
  "pt": "Martelo de Madeira",
  "en": "Wooden Hammer",
  "icone": "textures/items/cl/v/martelo_madeira"
 },
 "cl:martelo_ouro": {
  "pt": "Martelo de Ouro",
  "en": "Golden Hammer",
  "icone": "textures/items/cl/v/martelo_ouro"
 },
 "cl:martelo_pedra": {
  "pt": "Martelo de Pedra",
  "en": "Stone Hammer",
  "icone": "textures/items/cl/v/martelo_pedra"
 },
 "cl:mascara": {
  "pt": "Máscara de Gás",
  "en": "Gas Mask",
  "icone": "textures/items/cl/v/mascara"
 },
 "cl:massa": {
  "pt": "Massa",
  "en": "Dough",
  "icone": "textures/items/cl/hc/massa"
 },
 "cl:massa_liquida": {
  "pt": "Massa Líquida",
  "en": "Batter",
  "icone": "textures/items/cl/hc/massa_liquida"
 },
 "cl:milho": {
  "pt": "Milho",
  "en": "Corn",
  "icone": "textures/items/cl/hc/milho"
 },
 "cl:milho_espiga": {
  "pt": "Milho na Espiga",
  "en": "Corn on the Cob",
  "icone": "textures/items/cl/hc/milho_espiga"
 },
 "cl:moinho": {
  "pt": "Moinho de Vento",
  "en": "Windmill",
  "icone": "textures/items/cl/blocos/moinho"
 },
 "cl:montadora": {
  "pt": "Montadora",
  "en": "Assembler",
  "icone": "textures/items/cl/blocos/montadora"
 },
 "cl:motor_nave": {
  "pt": "Motor da Nave",
  "en": "Ship Engine",
  "icone": "textures/items/cl/v/motor_nave"
 },
 "cl:omelete": {
  "pt": "Omelete",
  "en": "Omelet",
  "icone": "textures/items/cl/hc/omelete"
 },
 "cl:organizador": {
  "pt": "Organizador",
  "en": "Organizer",
  "icone": "textures/items/cl/v/organizador"
 },
 "cl:ouro_po": {
  "pt": "Pó de Minério de Ouro",
  "en": "Powdered Gold Ore",
  "icone": "textures/items/cl/v/ouro_po"
 },
 "cl:ouro_quebrado": {
  "pt": "Pedaço Quebrado de Ouro",
  "en": "Broken Gold Ore",
  "icone": "textures/items/cl/v/ouro_quebrado"
 },
 "cl:ouro_triturado": {
  "pt": "Pedaço Triturado de Ouro",
  "en": "Crushed Gold Ore",
  "icone": "textures/items/cl/v/ouro_triturado"
 },
 "cl:ovo_cozido": {
  "pt": "Ovo Cozido",
  "en": "Boiled Egg",
  "icone": "textures/items/cl/hc/ovo_cozido"
 },
 "cl:ovo_frito": {
  "pt": "Ovo Frito",
  "en": "Fried Egg",
  "icone": "textures/items/cl/hc/ovo_frito"
 },
 "cl:painel_nave": {
  "pt": "Painel da Nave",
  "en": "Ship Console",
  "icone": "textures/items/cl/blocos/painel_nave"
 },
 "cl:painel_solar": {
  "pt": "Painel Solar",
  "en": "Solar Panel",
  "icone": "textures/items/cl/blocos/painel_solar"
 },
 "cl:panela": {
  "pt": "Panela",
  "en": "Pot",
  "icone": "textures/items/cl/blocos/panela"
 },
 "cl:panquecas": {
  "pt": "Panquecas",
  "en": "Pancakes",
  "icone": "textures/items/cl/hc/panquecas"
 },
 "cl:pedrinha": {
  "pt": "Pedrinha",
  "en": "Pebble",
  "icone": "textures/items/cl/v/pedrinha"
 },
 "cl:pemmican": {
  "pt": "Pemmican",
  "en": "Pemmican",
  "icone": "textures/items/cl/hc/pemmican"
 },
 "cl:peneira": {
  "pt": "Peneira",
  "en": "Sieve",
  "icone": "textures/items/cl/blocos/peneira"
 },
 "cl:peneira_automatica": {
  "pt": "Peneira Automática",
  "en": "Automatic Sieve",
  "icone": "textures/items/cl/blocos/peneira_automatica"
 },
 "cl:pilao": {
  "pt": "Pilão",
  "en": "Mortar and Pestle",
  "icone": "textures/items/cl/blocos/pilao"
 },
 "cl:pimenta": {
  "pt": "Pimenta",
  "en": "Chili Pepper",
  "icone": "textures/items/cl/hc/pimenta"
 },
 "cl:pimentao": {
  "pt": "Pimentão",
  "en": "Bell Pepper",
  "icone": "textures/items/cl/hc/pimentao"
 },
 "cl:pimentao_recheado": {
  "pt": "Pimentão Recheado",
  "en": "Stuffed Pepper",
  "icone": "textures/items/cl/hc/pimentao_recheado"
 },
 "cl:pipoca": {
  "pt": "Pipoca",
  "en": "Popcorn",
  "icone": "textures/items/cl/hc/pipoca"
 },
 "cl:placa_casco": {
  "pt": "Placa de Casco",
  "en": "Hull Plate",
  "icone": "textures/items/cl/v/placa_casco"
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
 "cl:poeira": {
  "pt": "Poeira",
  "en": "Dust",
  "icone": "textures/items/cl/blocos/poeira"
 },
 "cl:porcelana": {
  "pt": "Porcelana",
  "en": "Porcelain",
  "icone": "textures/items/cl/v/porcelana"
 },
 "cl:queijo": {
  "pt": "Queijo",
  "en": "Cheese",
  "icone": "textures/items/cl/hc/queijo"
 },
 "cl:sacola_boa": {
  "pt": "Sacola Boa",
  "en": "Good Bag",
  "icone": "textures/items/cl/v/sacola_boa"
 },
 "cl:sacola_comum": {
  "pt": "Sacola Comum",
  "en": "Basic Bag",
  "icone": "textures/items/cl/v/sacola_comum"
 },
 "cl:sacola_epica": {
  "pt": "Sacola Épica",
  "en": "Epic Bag",
  "icone": "textures/items/cl/v/sacola_epica"
 },
 "cl:sacola_lendaria": {
  "pt": "Sacola Lendária",
  "en": "Legendary Bag",
  "icone": "textures/items/cl/v/sacola_lendaria"
 },
 "cl:sacola_otima": {
  "pt": "Sacola Ótima",
  "en": "Greater Bag",
  "icone": "textures/items/cl/v/sacola_otima"
 },
 "cl:sal": {
  "pt": "Sal",
  "en": "Salt",
  "icone": "textures/items/cl/hc/sal"
 },
 "cl:semente_alho": {
  "pt": "Sementes de Alho",
  "en": "Garlic Seeds",
  "icone": "textures/items/cl/hc/semente_alho"
 },
 "cl:semente_amendoim": {
  "pt": "Sementes de Amendoim",
  "en": "Peanut Seeds",
  "icone": "textures/items/cl/hc/semente_amendoim"
 },
 "cl:semente_arroz": {
  "pt": "Sementes de Arroz",
  "en": "Rice Seeds",
  "icone": "textures/items/cl/hc/semente_arroz"
 },
 "cl:semente_cebola": {
  "pt": "Sementes de Cebola",
  "en": "Onion Seeds",
  "icone": "textures/items/cl/hc/semente_cebola"
 },
 "cl:semente_feijao": {
  "pt": "Sementes de Feijão",
  "en": "Beans Seeds",
  "icone": "textures/items/cl/hc/semente_feijao"
 },
 "cl:semente_fruta_cacto": {
  "pt": "Sementes de Fruta do Cacto",
  "en": "Cactus Fruit Seeds",
  "icone": "textures/items/cl/hc/semente_fruta_cacto"
 },
 "cl:semente_milho": {
  "pt": "Sementes de Milho",
  "en": "Corn Seeds",
  "icone": "textures/items/cl/hc/semente_milho"
 },
 "cl:semente_pimenta": {
  "pt": "Sementes de Pimenta",
  "en": "Chili Pepper Seeds",
  "icone": "textures/items/cl/hc/semente_pimenta"
 },
 "cl:semente_pimentao": {
  "pt": "Sementes de Pimentão",
  "en": "Bell Pepper Seeds",
  "icone": "textures/items/cl/hc/semente_pimentao"
 },
 "cl:semente_tomate": {
  "pt": "Sementes de Tomate",
  "en": "Tomato Seeds",
  "icone": "textures/items/cl/hc/semente_tomate"
 },
 "cl:sopa_arroz": {
  "pt": "Sopa de Arroz",
  "en": "Rice Soup",
  "icone": "textures/items/cl/hc/sopa_arroz"
 },
 "cl:sopa_cacto": {
  "pt": "Sopa de Cacto",
  "en": "Cactus Soup",
  "icone": "textures/items/cl/hc/sopa_cacto"
 },
 "cl:sopa_legumes": {
  "pt": "Sopa de Legumes",
  "en": "Vegetable Soup",
  "icone": "textures/items/cl/hc/sopa_legumes"
 },
 "cl:sopa_tomate": {
  "pt": "Sopa de Tomate",
  "en": "Tomato Soup",
  "icone": "textures/items/cl/hc/sopa_tomate"
 },
 "cl:suco_cacto": {
  "pt": "Suco de Fruta do Cacto",
  "en": "Cactus Fruit Juice",
  "icone": "textures/items/cl/hc/suco_cacto"
 },
 "cl:tabua_corte": {
  "pt": "Tábua de Corte",
  "en": "Cutting Board",
  "icone": "textures/items/cl/blocos/tabua_corte"
 },
 "cl:taco": {
  "pt": "Taco",
  "en": "Taco",
  "icone": "textures/items/cl/hc/taco"
 },
 "cl:terminal": {
  "pt": "Terminal de Armazenamento",
  "en": "Storage Terminal",
  "icone": "textures/items/cl/blocos/terminal"
 },
 "cl:tigela_mistura": {
  "pt": "Tigela de Mistura",
  "en": "Mixing Bowl",
  "icone": "textures/items/cl/blocos/tigela_mistura"
 },
 "cl:tomate": {
  "pt": "Tomate",
  "en": "Tomato",
  "icone": "textures/items/cl/hc/tomate"
 },
 "cl:torrada": {
  "pt": "Torrada",
  "en": "Toast",
  "icone": "textures/items/cl/hc/torrada"
 },
 "cl:tortilha": {
  "pt": "Tortilha",
  "en": "Tortilla",
  "icone": "textures/items/cl/hc/tortilha"
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
 "minecraft:bone": {
  "pt": "Osso",
  "en": "Bone",
  "icone": "textures/items/bone"
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
 "minecraft:charcoal": {
  "pt": "Carvão Vegetal",
  "en": "Charcoal",
  "icone": "textures/items/charcoal"
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
 "minecraft:copper_ingot": {
  "pt": "Barra de Cobre",
  "en": "Copper Ingot",
  "icone": "textures/items/copper_ingot"
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
 "minecraft:diamond": {
  "pt": "Diamante",
  "en": "Diamond",
  "icone": "textures/items/diamond"
 },
 "minecraft:dirt": {
  "pt": "Terra",
  "en": "Dirt",
  "icone": "textures/blocks/dirt"
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
 "minecraft:glowstone_dust": {
  "pt": "Pó de Pedra Luminosa",
  "en": "Glowstone Dust",
  "icone": "textures/items/glowstone_dust"
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
 "minecraft:gunpowder": {
  "pt": "Pólvora",
  "en": "Gunpowder",
  "icone": "textures/items/gunpowder"
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
 "minecraft:iron_pickaxe": {
  "pt": "Picareta de Ferro",
  "en": "Iron Pickaxe",
  "icone": "textures/items/iron_pickaxe"
 },
 "minecraft:jungle_leaves": {
  "pt": "Folhas da Selva",
  "en": "Jungle Leaves",
  "icone": "textures/blocks/leaves_jungle_carried"
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
 "minecraft:milk_bucket": {
  "pt": "Balde de Leite",
  "en": "Milk Bucket",
  "icone": "textures/items/bucket_milk"
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
 "minecraft:raw_gold": {
  "pt": "Ouro Bruto",
  "en": "Raw Gold",
  "icone": "textures/items/raw_gold"
 },
 "minecraft:raw_iron": {
  "pt": "Ferro Bruto",
  "en": "Raw Iron",
  "icone": "textures/items/raw_iron"
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
 "minecraft:short_grass": {
  "pt": "Grama Baixa",
  "en": "Short Grass",
  "icone": "textures/blocks/tallgrass_carried"
 },
 "minecraft:smooth_sandstone": {
  "pt": "Arenito Liso",
  "en": "Smooth Sandstone",
  "icone": "textures/blocks/sandstone_top"
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

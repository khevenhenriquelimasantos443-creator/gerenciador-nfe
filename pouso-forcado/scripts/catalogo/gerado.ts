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
  "pt": "Água Imprópria",
  "en": "Undrinkable Water",
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
 "cl:bateria": {
  "pt": "Bateria",
  "en": "Battery",
  "icone": "textures/items/cl/blocos/bateria"
 },
 "cl:cabo": {
  "pt": "Cabo de Cobre",
  "en": "Copper Cable",
  "icone": "textures/items/cl/blocos/cabo"
 },
 "cl:catalogo": {
  "pt": "Catálogo",
  "en": "Catalog",
  "icone": "textures/items/cl/v/catalogo"
 },
 "cl:celula_combustivel": {
  "pt": "Célula de Combustível",
  "en": "Fuel Cell",
  "icone": "textures/items/cl/v/celula_combustivel"
 },
 "cl:circuito": {
  "pt": "Circuito",
  "en": "Circuit",
  "icone": "textures/items/cl/v/circuito"
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
 "cl:fruta_cacto": {
  "pt": "Fruta do Cacto",
  "en": "Cactus Fruit",
  "icone": "textures/items/cl/fruta_cacto"
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
 "cl:idolo_amaldicoado": {
  "pt": "Ídolo Amaldiçoado",
  "en": "Cursed Idol",
  "icone": "textures/items/cl/blocos/idolo_amaldicoado"
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
 "cl:organizador": {
  "pt": "Organizador",
  "en": "Organizer",
  "icone": "textures/items/cl/v/organizador"
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
 "cl:placa_casco": {
  "pt": "Placa de Casco",
  "en": "Hull Plate",
  "icone": "textures/items/cl/v/placa_casco"
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
 "cl:terminal": {
  "pt": "Terminal de Armazenamento",
  "en": "Storage Terminal",
  "icone": "textures/items/cl/blocos/terminal"
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
 "minecraft:barrel": {
  "pt": "Barril",
  "en": "Barrel",
  "icone": "textures/blocks/barrel_side"
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
 "minecraft:brown_carpet": {
  "pt": "Carpete Marrom",
  "en": "Brown Carpet",
  "icone": "textures/blocks/wool_colored_brown"
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
 "minecraft:flint": {
  "pt": "Sílex",
  "en": "Flint",
  "icone": "textures/items/flint"
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
 "minecraft:lapis_lazuli": {
  "pt": "Lápis-Lazúli",
  "en": "Lapis Lazuli",
  "icone": "textures/items/dye_powder_blue_new"
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
 "minecraft:name_tag": {
  "pt": "Etiqueta",
  "en": "Name Tag",
  "icone": "textures/items/name_tag"
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
 "minecraft:polished_andesite": {
  "pt": "Andesito Polido",
  "en": "Polished Andesite",
  "icone": "textures/blocks/stone_andesite_smooth"
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
 "minecraft:pumpkin_seeds": {
  "pt": "Sementes de Abóbora",
  "en": "Pumpkin Seeds",
  "icone": "textures/items/seeds_pumpkin"
 },
 "minecraft:raw_copper": {
  "pt": "Cobre Bruto",
  "en": "Raw Copper",
  "icone": "textures/items/raw_copper"
 },
 "minecraft:red_carpet": {
  "pt": "Carpete Vermelho",
  "en": "Red Carpet",
  "icone": "textures/blocks/wool_colored_red"
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
 "minecraft:smooth_sandstone": {
  "pt": "Arenito Liso",
  "en": "Smooth Sandstone",
  "icone": "textures/blocks/sandstone_top"
 },
 "minecraft:spider_eye": {
  "pt": "Olho de Aranha",
  "en": "Spider Eye",
  "icone": "textures/items/spider_eye"
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
 "minecraft:string": {
  "pt": "Linha",
  "en": "String",
  "icone": "textures/items/string"
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
  "tipo": "fornalha",
  "id": "cl:ferver_agua_impropria",
  "resultado": "cl:agua_muito_suja",
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
  "resultado": "cl:agua_suja",
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

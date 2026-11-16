// Fase 71 (1.55.0): a Vila Lunar, as Ruínas Lunares e as masmorras da Lua do Galacticraft 5 (Team Galacticraft,
// licença MIT, inclusive a arte). As peças da vila e das ruínas são as do mod (tools/gerar-vila-lunar.py); a vila é
// feita de Decoração de Estanho e tem os Aldeões Lunares (cl:aldeao_lunar), que trocam safira lunar por coisas do
// Galacticraft. Tudo aparece na Lua por scripts/galacticraft/vila.ts e masmorras.ts.
const GC = { mod: "Galacticraft" };

export default {
  fase: 71,
  mod: "Galacticraft",
  itens: [],
  blocos: [
    { id: "decoracao_estanho", pt: "Decoração de Estanho", en: "Tin Decoration", tipo: "cubo", cor: "#9aa6b8", padrao: "liso", dureza: 2, girar: false, ...GC },
    { id: "decoracao_estanho_detalhada", pt: "Decoração de Estanho Detalhada", en: "Detailed Tin Decoration", tipo: "cubo", cor: "#8a96aa", padrao: "liso", dureza: 2, girar: false, ...GC },
  ],
  receitas: [
    // Os números do Galacticraft 5 (data/galacticraft/recipe/tin_decoration.json e detailed_tin_decoration.json).
    { id: "decoracao_estanho", tipo: "shaped", padrao: ["## ", "##X"], chave: { "#": "minecraft:stone", X: "cl:placa_estanho" }, resultado: "cl:decoracao_estanho", qtd: 4 },
    { id: "decoracao_estanho_detalhada", tipo: "shaped", padrao: ["##", "##", " X"], chave: { "#": "minecraft:stone", X: "cl:placa_estanho" }, resultado: "cl:decoracao_estanho_detalhada", qtd: 4 },
  ],
  textos: {
    "entity.cl:aldeao_lunar.name": ["Aldeão Lunar", "Moon Villager"],
    "item.spawn_egg.entity.cl:aldeao_lunar.name": ["Gerar Aldeão Lunar", "Spawn Moon Villager"],
    "cl.gc.bau_extra": ["O Baú do Tesouro abriu:", "The Treasure Chest opened:"],
    "cl.gc.bau_extra_2": ["o saque da masmorra!", "the dungeon loot!"],
    "cl.gc.vila_sinal": ["§b[Rádio]§r Luzes de uma Vila Lunar: X %s, Z %s (a %s m).", "§b[Radio]§r Lights of a Moon Village: X %s, Z %s (%s m away)."],
    "cl.gc.vila_chegou": ["Vila Lunar: os aldeões trocam safira lunar por coisas do Galacticraft.", "Moon Village: the villagers trade lunar sapphire for Galacticraft gear."],
    "cl.gc.ruina_sinal": ["§7[Rádio]§r Ruínas Lunares: X %s, Z %s (a %s m).", "§7[Radio]§r Moon Ruins: X %s, Z %s (%s m away)."],
    "cl.gc.masmorra_sinal": ["§c[Rádio]§r Outra masmorra lunar: X %s, Z %s (a %s m). Um chefe guarda o tesouro.", "§c[Radio]§r Another moon dungeon: X %s, Z %s (%s m away). A boss guards the treasure."],
    "cl.missao.gc_vila.titulo": ["Vila Lunar", "Moon Village"],
    "cl.missao.gc_vila.desc": ["Ache uma Vila Lunar na Lua.", "Find a Moon Village on the Moon."],
    "cl.missao.gc_aldeao.titulo": ["Vizinhos de Outro Mundo", "Neighbors From Another World"],
    "cl.missao.gc_aldeao.desc": ["Fale com um Aldeão Lunar (ele troca safira lunar por máscara, tanque, wafer...).", "Talk to a Moon Villager (he trades lunar sapphire for masks, tanks, wafers...)."],
    "cl.missao.gc_ruinas.titulo": ["Ruínas Lunares", "Moon Ruins"],
    "cl.missao.gc_ruinas.desc": ["Ache Ruínas Lunares (os baús delas têm saque do Galacticraft).", "Find Moon Ruins (their chests hold Galacticraft loot)."],
    "cl.missao.gc_chefes.titulo": ["Caçador de Chefes", "Boss Hunter"],
    "cl.missao.gc_chefes.desc": ["Derrote 3 Esqueletos Evoluídos Gigantes nas masmorras da Lua.", "Defeat 3 Evolved Skeleton Bosses in the Moon dungeons."],
    "cl.missao.gc_estanho.titulo": ["Decoração de Estanho", "Tin Decoration"],
    "cl.missao.gc_estanho.desc": ["Construa com 16 blocos de Decoração de Estanho, como os da vila.", "Build with 16 Tin Decoration blocks, like the village ones."],
    // A tela da máquina (scripts/maquinas/tela.ts).
    "cl.tela.trabalhando": ["§aTrabalhando", "§aWorking"],
    "cl.tela.parada": ["§eParada (sem o que fazer)", "§eIdle (nothing to do)"],
    "cl.tela.sem_energia": ["§cSem energia", "§cNo energy"],
    "cl.tela.energia": ["Energia na rede: §b%s§r de %s", "Network energy: §b%s§r of %s"],
    "cl.tela.sem_rede": ["§7Nenhuma bateria ligada (use cabos)", "§7No battery connected (use cables)"],
    "cl.tela.entrada": ["Entrada (baú em cima)", "Input (chest on top)"],
    "cl.tela.saida": ["Saída (baú embaixo)", "Output (chest below)"],
    "cl.tela.vazio": ["vazio", "empty"],
    "cl.tela.sem_entrada": ["ponha um baú em cima", "put a chest on top"],
    "cl.tela.sem_saida": ["ponha um baú embaixo (sem ele, sai ao lado)", "put a chest below (without it, it drops beside)"],
    "cl.tela.por": ["Pôr itens na entrada", "Put items in the input"],
    "cl.tela.pegar": ["Pegar a saída", "Take the output"],
    "cl.tela.catalogo": ["Ver no Catálogo", "Open in the Catalog"],
    "cl.tela.escolher": ["Escolha o que vai para a entrada (a pilha inteira).", "Choose what goes into the input (the whole stack)."],
    // A Masmorra dos Esqueletos do YUNG's (scripts/mundo/masmorra_yung.ts).
    "cl.yung.masmorra_aviso": ["§7Um ar frio sobe do chão: uma §fMasmorra dos Esqueletos§7 embaixo de X %s, Z %s (uns %s blocos para baixo).", "§7Cold air rises from the ground: a §fSkeleton Dungeon§7 below X %s, Z %s (about %s blocks down)."],
    "cl.missao.yung_masmorra.titulo": ["Ossos no Escuro", "Bones in the Dark"],
    "cl.missao.yung_masmorra.desc": ["Ache uma Masmorra dos Esqueletos no subsolo (ela fica entre y -50 e -30).", "Find a Skeleton Dungeon underground (between y -50 and -30)."],
    "cl.missao.ad_tela.titulo": ["Painel da Máquina", "Machine Panel"],
    "cl.missao.ad_tela.desc": ["Toque numa máquina com a mão vazia para abrir a tela dela.", "Tap a machine with an empty hand to open its screen."],
  },
};

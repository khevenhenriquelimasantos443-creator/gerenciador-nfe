// Fase 49 (1.30.0): Tinkers' Construct 3 completo, parte 5 (SlimeKnights, MIT, inclusive a arte, copiada por
// tools/importar-tinkers3-extras.py). Bigorna do Tinker (e a chamuscada): monta as ferramentas de 4 peças e aplica os
// modificadores de mais de 3 itens; Mesa de Modificadores (tira um modificador com uma esponja molhada); Estação de
// Criação (bancada de 3×3); baús de Peças, de Moldes e do Tinker; os 6 livros do mod; as ferramentas antigas (achadas
// na pirâmide); os cajados de slime; geringonças (EFLN, Bola Brilhante, Estilingue de Slime, Estacas Punji) e o Pano
// Sedoso. Os modificadores (números do TC3) estão em scripts/config.ts; os scripts em scripts/tinkers/extras_tc.ts.
const TC = { mod: "Tinkers' Construct" };
const mesa = (id, pt, en, cor, comp, extra = {}) => ({ id, pt, en, tipo: "cubo", cor, padrao: "pilar", dureza: 2.5, ...(comp ? { comp } : {}), ...TC, ...extra });
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });
const LIVROS = [
  ["livro_materiais", "Materiais e Você", "Materials and You", "cl:padrao_branco"],
  ["livro_fundicao_pequena", "Fundição Pequena", "Puny Smelting", "cl:tijolo_refratario"],
  ["livro_fundicao_poderosa", "Fundição Poderosa", "Mighty Smelting", "cl:tijolos_refratarios"],
  ["livro_geringoncas", "Geringonças do Tinker", "Tinkers' Gadgetry", "minecraft:slime_ball"],
  ["livro_fundicao_fantastica", "Fundição Fantástica", "Fantastic Foundry", "cl:tijolo_chamuscado"],
];
const ANTIGAS = [
  ["picareta_guerra", "Picareta de Guerra", "War Pick", { "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: { tags: "q.any_tag('minecraft:is_pickaxe_item_destructible')" }, speed: 7 }] }, "minecraft:damage": 5 }, "pickaxe"],
  ["placa_batalha", "Placa de Batalha", "Battlesign", { "minecraft:damage": 4, "minecraft:allow_off_hand": true }, "sword"],
  ["lavador", "Lavador", "Swasher", { "minecraft:damage": 6, "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: "minecraft:web", speed: 15 }] } }, "sword"],
  ["machado_minotauro", "Machado do Minotauro", "Minotaur Axe", { "minecraft:damage": 8, "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: { tags: "q.any_tag('minecraft:is_axe_item_destructible')" }, speed: 7 }] } }, "axe"],
  ["panela_fusao", "Panela de Fusão", "Melting Pan", { "minecraft:damage": 3, "minecraft:allow_off_hand": true, "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: { tags: "q.any_tag('minecraft:is_shovel_item_destructible')" }, speed: 6 }] } }, "shovel"],
];
const CAJADOS = [
  ["cajado_ceu", "Cajado de Slime-do-Céu", "Skyslime Staff", 500, "cl:cristal_slime_ceu", "cl:tronco_raizceu"],
  ["cajado_terra", "Cajado de Slime-da-Terra", "Earthslime Staff", 800, "cl:cristal_slime_terra", "cl:tronco_verdecoracao"],
  ["cajado_icor", "Cajado de Icor", "Ichor Staff", 1225, "cl:cristal_slime_icor", "cl:tronco_cogusangue"],
  ["cajado_ender", "Cajado de Slime-do-Ender", "Enderslime Staff", 1520, "cl:cristal_slime_ender", "cl:tronco_cascaender"],
];
const pagina = (id, n, pt, en) => ({ [`cl.livro.${id}.${n}`]: [pt, en] });

export default {
  fase: 49,
  mod: "Tinkers' Construct",
  itens: [
    ...LIVROS.map(([id, pt, en]) => ({ id, pt, en, icone: "bola:#8b5a2b", pilha: 1, ...TC })),
    { id: "livro_enciclopedia", pt: "Enciclopédia do Tinker", en: "Encyclopedia of Tinkering", icone: "bola:#5a3a8b", pilha: 1, ...TC },
    ...ANTIGAS.map(([id, pt, en, comp, slot]) => ({
      id, pt, en, icone: "bola:#7a5a4a", pilha: 1, cat: "equipment", ...TC,
      comp: { "minecraft:hand_equipped": true, "minecraft:durability": { max_durability: 1490 }, "minecraft:enchantable": { slot, value: 15 }, "minecraft:tags": { tags: ["cl:tc_antiga"] }, ...comp },
    })),
    ...CAJADOS.map(([id, pt, en, dur]) => ({ id, pt, en, icone: "bola:#00f4da", pilha: 1, cat: "equipment", ...TC, comp: { "minecraft:hand_equipped": true, "minecraft:durability": { max_durability: dur }, "minecraft:tags": { tags: ["cl:tc_cajado"] } } })),
    { id: "efln", pt: "EFLN", en: "EFLN", icone: "bola:#8a4a2a", pilha: 16, ...TC, comp: { "minecraft:throwable": { do_swing_animation: true, launch_power_scale: 1.0, max_launch_power: 1.3 }, "minecraft:projectile": { projectile_entity: "cl:efln_proj", minimum_critical_power: 1.0 } } },
    { id: "bola_brilhante", pt: "Bola Brilhante", en: "Glow Ball", icone: "bola:#f2e080", pilha: 16, ...TC, comp: { "minecraft:throwable": { do_swing_animation: true, launch_power_scale: 1.0, max_launch_power: 1.3 }, "minecraft:projectile": { projectile_entity: "cl:bola_brilhante_proj", minimum_critical_power: 1.0 } } },
    { id: "estilingue_slime", pt: "Estilingue de Slime", en: "Slime Sling", icone: "bola:#8cd782", pilha: 1, ...TC, comp: { "minecraft:durability": { max_durability: 250 } } },
    { id: "pano_sedoso", pt: "Pano Sedoso", en: "Silky Cloth", icone: "bola:#f0e8c8", ...TC },
    { id: "mochila_porco", pt: "Mochila de Porco", en: "Piggybackpack", icone: "bola:#f0a8a4", pilha: 1, ...TC },
  ],
  blocos: [
    mesa("bigorna", "Bigorna do Tinker", "Tinker's Anvil", "#6a6a70", "cl:bigorna", { dureza: 5 }),
    mesa("bigorna_chamuscada", "Bigorna Chamuscada", "Scorched Anvil", "#4a3a30", "cl:bigorna", { dureza: 5 }),
    mesa("mesa_modificadores", "Mesa de Modificadores", "Modifier Worktable", "#555a63", "cl:mesa_modificadores"),
    mesa("estacao_criacao", "Estação de Criação", "Crafting Station", "#8a6a3e", undefined, { extra: { "minecraft:crafting_table": { table_name: "Estação de Criação", crafting_tags: ["crafting_table"] } } }),
    mesa("bau_pecas", "Baú de Peças", "Part Chest", "#8a6a3e", "cl:bau_tc"),
    mesa("bau_moldes", "Baú de Moldes", "Cast Chest", "#c8a03a", "cl:bau_tc"),
    mesa("bau_tinker", "Baú do Tinker", "Tinkers' Chest", "#8a6a3e", "cl:bau_tc"),
    {
      id: "estacas_punji", pt: "Estacas Punji", en: "Punji Sticks", tipo: "cubo", cor: "#c8b070", dureza: 0.5, comp: "cl:punji", tick: [10, 10], ...TC,
      extra: {
        "minecraft:geometry": "geometry.cl.planta",
        "minecraft:material_instances": { "*": { texture: "clc_estacas_punji", render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } },
        "minecraft:collision_box": false, "minecraft:selection_box": { origin: [-7, 0, -7], size: [14, 10, 14] }, "minecraft:light_dampening": 0,
      },
    },
  ],
  receitas: [
    { id: "bigorna", tipo: "shaped", padrao: ["BBB", " I ", "III"], chave: { B: "minecraft:iron_block", I: "minecraft:iron_ingot" }, resultado: "cl:bigorna" },
    { id: "bigorna_chamuscada", tipo: "shaped", padrao: ["BBB", " T ", "TTT"], chave: { B: "minecraft:iron_block", T: "cl:tijolo_chamuscado" }, resultado: "cl:bigorna_chamuscada" },
    { id: "mesa_modificadores", tipo: "shaped", padrao: ["TTT", "B B", "B B"], chave: { T: "cl:tijolos_refratarios", B: "cl:tijolo_refratario" }, resultado: "cl:mesa_modificadores" },
    { id: "estacao_criacao", tipo: "shapeless", ingredientes: ["minecraft:crafting_table", "cl:padrao_branco"], resultado: "cl:estacao_criacao" },
    { id: "bau_pecas", tipo: "shaped", padrao: [" P ", "PCP", " P "], chave: { P: "cl:padrao_branco", C: "minecraft:chest" }, resultado: "cl:bau_pecas" },
    { id: "bau_moldes", tipo: "shaped", padrao: [" G ", "GCG", " G "], chave: { G: "minecraft:gold_ingot", C: "minecraft:chest" }, resultado: "cl:bau_moldes" },
    { id: "bau_tinker", tipo: "shaped", padrao: [" P ", "LCL", " P "], chave: { P: "cl:padrao_branco", L: "#minecraft:logs", C: "minecraft:chest" }, resultado: "cl:bau_tinker" },
    ...LIVROS.map(([id, , , extra]) => ({ id, tipo: "shapeless", ingredientes: ["minecraft:book", extra], resultado: `cl:${id}` })),
    { id: "livro_enciclopedia", tipo: "shapeless", ingredientes: LIVROS.map(([id]) => `cl:${id}`), resultado: "cl:livro_enciclopedia" },
    ...CAJADOS.map(([id, , , , cristal, tronco]) => ({ id, tipo: "shaped", padrao: ["  C", " T ", "T  "], chave: { C: cristal, T: tronco }, resultado: `cl:${id}` })),
    { id: "efln", tipo: "shapeless", ingredientes: ["minecraft:gunpowder", "minecraft:flint"], resultado: "cl:efln" },
    { id: "bola_brilhante", tipo: "shaped", padrao: ["SSS", "SGS", "SSS"], chave: { S: "minecraft:snowball", G: "minecraft:glowstone_dust" }, resultado: "cl:bola_brilhante", qtd: 8 },
    { id: "estilingue_slime", tipo: "shaped", padrao: ["SLS", " T ", " T "], chave: { S: "minecraft:string", L: "minecraft:slime_ball", T: "minecraft:stick" }, resultado: "cl:estilingue_slime" },
    { id: "estacas_punji", tipo: "shaped", padrao: ["S S", " S ", "S S"], chave: { S: "minecraft:sugar_cane" }, resultado: "cl:estacas_punji", qtd: 3 },
    // TC3: sela como molde + 1000 mB de slime-do-céu na mesa de fundição (aqui: 4 bolas, 250 mB cada).
    { id: "mochila_porco", tipo: "shapeless", ingredientes: ["minecraft:saddle", "cl:bola_slime_ceu", "cl:bola_slime_ceu", "cl:bola_slime_ceu", "cl:bola_slime_ceu"], resultado: "cl:mochila_porco" },
    { id: "pano_sedoso", tipo: "shaped", padrao: ["SSS", "SGS", "SSS"], chave: { S: "minecraft:string", G: "minecraft:gold_ingot" }, resultado: "cl:pano_sedoso" },
  ],
  textos: {
    "entity.cl:efln_proj.name": ["EFLN", "EFLN"], "entity.cl:bola_brilhante_proj.name": ["Bola Brilhante", "Glow Ball"],
    "cl.tc.mod.netherita": ["Netherita (mais durabilidade, nível 4)", "Netherite"], "cl.tc.mod.golpeada": ["Golpeada (mortos-vivos)", "Smite"],
    "cl.tc.mod.antiaquatico": ["Antiaquático", "Antiaquatic"], "cl.tc.mod.magnetico": ["Magnético", "Magnetic"], "cl.tc.mod.decapitacao": ["Decapitação", "Severing"],
    "cl.tc.mod.alma": ["Vinculada à Alma (fica com você ao morrer)", "Soulbound"], "cl.tc.mod.slime": ["Slime extra (+25 por bola)", "Overslime"],
    "cl.tc.mod.autofundir": ["Autofundir (o que quebra sai fundido)", "Autosmelt"], "cl.tc.mod.seda": ["Toque Sedoso", "Silky"], "cl.tc.mod.expandido": ["Expandido (área maior)", "Expanded"],
    "cl.tc.mod.derreter": ["Derreter (fundido e fogo no golpe)", "Melting"], "cl.tc.mod.inquebravel": ["Inquebrável", "Unbreakable"], "cl.tc.mod.brilho": ["Brilho (toque para pôr luz)", "Glowing"],
    "cl.tc.mod_habilidade": ["§6Habilidade", "§6Ability"], "cl.tc.mod_bigorna": ["§7(só na Bigorna)", "§7(anvil only)"],
    "cl.tc.habilidades": ["§7Espaços de habilidade: %s", "§7Ability slots: %s"], "cl.tc.mod_sem_habilidade": ["Sem espaço de habilidade.", "No free ability slot."],
    "cl.tc.precisa_bigorna": ["Isso precisa da Bigorna do Tinker (mais de 3 peças ou itens).", "This needs the Tinker's Anvil (more than 3 parts or items)."],
    "cl.tc.remover": ["Mesa de Modificadores: escolha o modificador para tirar (gasta 1 esponja molhada; o espaço volta).", "Modifier Worktable: choose the modifier to remove (uses 1 wet sponge; the slot comes back)."],
    "cl.tc.removeu": ["Tirou: %s", "Removed: %s"], "cl.tc.sem_esponja": ["Precisa de 1 esponja molhada.", "You need 1 wet sponge."],
    "cl.tc.bigorna_titulo": ["Bigorna do Tinker", "Tinker's Anvil"], "cl.tc.consertar_estacao": ["Consertar", "Repair"],
    "cl.tc.sem_ferramenta": ["Segure uma ferramenta do Tinker.", "Hold a Tinker tool."],
    "cl.tc.sem_modificadores": ["Essa ferramenta não tem modificadores.", "This tool has no modifiers."],
    "cl.tc.bau_corpo": ["%s guardados. Toque com um item para guardar; escolha para tirar.", "%s stored. Tap with an item to store; choose to take."],
    "cl.tc.bau_nao_aceita": ["Este baú não guarda isso.", "This chest doesn't hold that."], "cl.tc.bau_cheio": ["O baú está cheio (54 pilhas).", "The chest is full (54 stacks)."],
    "cl.livro.linha_material": ["§7Durab. %s · Veloc. %s · Dano %s · Nível %s", "§7Dur. %s · Speed %s · Dmg %s · Tier %s"],
    "cl.tc.porco_pegou": ["Animal na mochila: %s. Use de novo para soltar.", "Animal in the backpack: %s. Use again to release."],
    "cl.tc.porco_nada": ["Olhe para um animal perto (até 4 blocos).", "Look at a nearby animal (up to 4 blocks)."],
    "cl.tc.cajado_espera": ["Cajado carregando...", "Staff recharging..."],
    "cl.tc.livro_prox": ["Próxima ›", "Next ›"], "cl.tc.livro_ant": ["‹ Anterior", "‹ Previous"], "cl.tc.livro_fechar": ["Fechar", "Close"],
    // Páginas dos livros (texto próprio, com o que o pack faz).
    ...pagina("livro_materiais", 1, "Materiais e Você.\n\nToda ferramenta do Tinker é feita de peças, e cada peça de um material. A cabeça (a primeira peça) decide a velocidade, o dano e o nível de mineração; o cabo multiplica a durabilidade; a ligação (e os materiais) dão traços.\n\nComece pela Mesa de Moldes (padrões), o Construtor de Peças (peças de madeira, pedra, sílex, osso...) e a Estação de Ferramentas.", "Materials and You.\n\nEvery Tinker tool is made of parts, each part of a material. The head (first part) sets speed, damage and mining level; the handle multiplies durability; the binding (and the materials) give traits.\n\nStart with the Stencil Table (patterns), the Part Builder (wood, stone, flint, bone parts...) and the Tool Station."),
    ...pagina("livro_materiais", 2, "As ferramentas grandes (Marreta, Martelo de Mineração, Escavadeira, Machado Grande, Foice, Espadão) têm 4 peças e precisam da Bigorna do Tinker (3 blocos de ferro e 4 lingotes).\n\nNas próximas páginas, cada material: durabilidade, velocidade, dano, nível e traço.", "Large tools (Sledge Hammer, Vein Hammer, Excavator, Broad Axe, Scythe, Cleaver) have 4 parts and need the Tinker's Anvil (3 iron blocks and 4 ingots).\n\nNext pages: each material's durability, speed, damage, level and trait."),
    ...pagina("livro_fundicao_pequena", 1, "Fundição Pequena.\n\nO Fusor Refratário em cima de um Aquecedor derrete um item por vez: combustível no Aquecedor (carvão, bloco de carvão, vara de blaze, balde de lava), itens no baú em cima do Fusor ou tocando nele.\n\nA Torneira do lado do Fusor derrama na Mesa de Fundição (com molde) ou na Bacia (bloco).", "Puny Smelting.\n\nThe Seared Melter on top of a Heater melts one item at a time: fuel in the Heater (coal, coal block, blaze rod, lava bucket), items in the chest above the Melter or by tapping it.\n\nThe Faucet beside the Melter pours into the Casting Table (with a cast) or the Basin (block)."),
    ...pagina("livro_fundicao_pequena", 2, "Moldes: derrame ouro sobre uma peça, lingote ou pepita na Mesa. Molde de areia: areia na Mesa e toque com a peça (serve uma vez).\n\nTijolo Refratário: argamassa (argila, areia e cascalho) na fornalha.\n\nNo Fusor, minério não dobra: para dobrar, use a Fundição.", "Casts: pour gold over a part, ingot or nugget on the Table. Sand cast: sand on the Table and tap with the part (single use).\n\nSeared Brick: grout (clay, sand and gravel) in a furnace.\n\nIn the Melter ore doesn't double: use the Smeltery for that."),
    ...pagina("livro_fundicao_poderosa", 1, "Fundição Poderosa.\n\nPiso 3×3 de Tijolos Refratários, interior 3×3 vazio e paredes de blocos refratários (tijolos, vidro, tanque, dreno, calha, o controlador), até 4 camadas. Pelo menos um Tanque com lava (toque com balde de lava).\n\nToque no Controlador para montar. Jogue os itens dentro: minério dobra.", "Mighty Smelting.\n\n3×3 floor of Seared Bricks, empty 3×3 inside and walls of seared blocks (bricks, glass, tank, drain, chute, the controller), up to 4 layers. At least one Tank with lava (tap with a lava bucket).\n\nTap the Controller to form it. Throw items inside: ore doubles."),
    ...pagina("livro_fundicao_poderosa", 2, "Ligas: os líquidos se juntam sozinhos. Bronze (3 cobre + 1 estanho), Ouro Rosa, Bronze de Ametista, Ferro-Porco (ferro + sopa de carne de animais dentro da fundição + mel), Hepatizão, Manyullyn (3 cobalto + 1 detrito), Slime da Rainha, Aço de Slime, Slime de Brasa, Slime-Cavaleiro, obsidiana (água + lava).\n\nCalha: o baú encostado alimenta. Canal: a torneira enche várias mesas.\n\nMaterial composto: peça na Mesa + líquido = outro material.", "Alloys: fluids combine by themselves. Bronze (3 copper + 1 tin), Rose Gold, Amethyst Bronze, Pig Iron (iron + meat soup from animals inside + honey), Hepatizon, Manyullyn (3 cobalt + 1 debris), Queen's Slime, Slimesteel, Cinderslime, Knightslime, obsidian (water + lava).\n\nChute: the touching chest feeds it. Channel: the faucet fills several tables.\n\nComposite: part on the Table + fluid = another material."),
    ...pagina("livro_geringoncas", 1, "Geringonças do Tinker.\n\nEFLN (pólvora + sílex): explode onde cai. Bola Brilhante (8 bolas de neve + pó de glowstone): luz onde cai. Estilingue de Slime: lança você para o lado contrário de onde olha (mire no chão para subir). Estacas Punji (cana-de-açúcar): ferem quem pisa. Mochila de Porco (sela + slime-do-céu): leva um animal com você.\n\nCajados de slime (cristal + tronco de slime): Céu (salto), Terra (onda de choque), Icor (bola de fogo), Ender (teleporte).", "Tinkers' Gadgetry.\n\nEFLN (gunpowder + flint): explodes where it lands. Glow Ball (8 snowballs + glowstone dust): light where it lands. Slime Sling: launches you opposite to where you look (aim at the ground to go up). Punji Sticks (sugar cane): hurt whoever steps on them. Piggybackpack (saddle + sky slime): carry an animal with you.\n\nSlime staffs (crystal + slime log): Sky (leap), Earth (shockwave), Ichor (fireball), Ender (teleport)."),
    ...pagina("livro_geringoncas", 2, "Armaduras: Placa (o material e a Malha de correntes), Viajante (couro e cobre), Traje de Slime (as botas quicam, as Slimélitros planam). Escudos na mão secundária: agache para segurar.\n\nArco Longo, Besta, Shuriken, Machado de Arremesso e Dardo.\n\nFerramentas antigas (Picareta de Guerra, Placa de Batalha, Lavador, Machado do Minotauro, Panela de Fusão): nos baús da pirâmide.", "Armor: Plate (the material and the Maille from chains), Traveler's (leather and copper), Slimesuit (boots bounce, Slimelytra glide). Shields in the offhand: sneak to block.\n\nLongbow, Crossbow, Shuriken, Throwing Axe and Javelin.\n\nAncient tools (War Pick, Battlesign, Swasher, Minotaur Axe, Melting Pan): in the pyramid chests."),
    ...pagina("livro_fundicao_fantastica", 1, "Fundição Fantástica.\n\nComo a Fundição, mas de blocos chamuscados (tijolo chamuscado: argamassa do Nether — areia das almas, creme de magma e cascalho — na fornalha) e com o Controlador da Fundição Fantástica.\n\nNão faz liga, mas os minérios dão subproduto: ferro dá aço, ouro dá cobalto, cobre dá ouro, ósmio dá ferro.\n\nLigador Chamuscado: junta os líquidos dos Fusores encostados e faz as ligas.", "Fantastic Foundry.\n\nLike the Smeltery, but of scorched blocks (scorched brick: nether grout — soul sand, magma cream and gravel — in a furnace) with the Foundry Controller.\n\nNo alloys, but ores give byproducts: iron gives steel, gold gives cobalt, copper gives gold, osmium gives iron.\n\nScorched Alloyer: joins the fluids of adjacent Melters and makes alloys."),
    ...missao("tc3_bigorna", "Bigorna do Tinker", "Tinker's Anvil", "Faça a Bigorna do Tinker: ferramentas de 4 peças e modificadores grandes.", "Make the Tinker's Anvil: 4-part tools and big modifiers."),
    ...missao("tc3_habilidade", "Habilidade", "Ability", "Ponha uma habilidade numa ferramenta (Autofundir, Toque Sedoso, Expandido...) na Bigorna.", "Put an ability on a tool (Autosmelt, Silky, Expanded...) at the Anvil."),
    ...missao("tc3_enciclopedia", "Enciclopédia", "Encyclopedia", "Junte os 5 livros na Enciclopédia do Tinker.", "Combine the 5 books into the Encyclopedia of Tinkering."),
    ...missao("tc3_antiga", "Ferramenta antiga", "Ancient tool", "Ache uma ferramenta antiga nos baús da pirâmide do deserto.", "Find an ancient tool in the desert pyramid chests."),
  },
  dados: {
    livros: Object.fromEntries([...LIVROS.map(([id]) => id), "livro_enciclopedia"].map((id) => [id, id === "livro_enciclopedia" ? 0 : 2])),
  },
};

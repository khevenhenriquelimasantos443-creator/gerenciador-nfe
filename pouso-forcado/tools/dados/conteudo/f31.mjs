// Fase 31 (1.10.0): utilidades de outros mods da época.
// - Waystones (BlayTheNinth): Pedra do Caminho, Pedra de Viagem (300 s de espera) e os pergaminhos.
// - Backpacks (Eydamos): a Mochila de 27 espaços (vira um baú no chão para abrir; guarda tudo no item).
// - ComputerCraft (dan200): o Robô Minerador (Mining Turtle), com os programas "tunnel" e "excavate".
// - Extra Utilities (RWTema): Lixeira, Regador, Bloco Angelical, Varinhas do Construtor (9 e 49 blocos) e o
//   Pedregulho Comprimido (1x a 8x).
// - Weather2 (Corosauce): os redemoinhos de poeira do deserto (só script, em scripts/mundo/redemoinho.ts).
// Scripts em scripts/utilidades/.
const caixa = (o, t) => ({ "minecraft:collision_box": { origin: o, size: t }, "minecraft:selection_box": { origin: o, size: t } });
const NIVEIS = [1, 2, 3, 4, 5, 6, 7, 8];
const tom = (n) => {
  const v = Math.round(0x8c - (n - 1) * 11);
  return `#${[v, v, v + 4].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
};
const comprimido = (n) => `cl:pedregulho_comprimido_${n}`;

export default {
  fase: 31,
  mod: "Extra Utilities",
  itens: [
    { id: "pedra_viagem", pt: "Pedra de Viagem", en: "Warp Stone", icone: "cristal:#b072ff", pilha: 1, mod: "Waystones" },
    { id: "pergaminho_retorno", pt: "Pergaminho de Retorno", en: "Return Scroll", icone: "placa:#e9dfc0", pilha: 16, mod: "Waystones" },
    { id: "pergaminho_viagem", pt: "Pergaminho de Viagem", en: "Warp Scroll", icone: "placa:#c9a8f0", pilha: 16, mod: "Waystones" },
    { id: "mochila", pt: "Mochila", en: "Backpack", icone: "saco:#8b5a2b", pilha: 1, mod: "Backpacks" },
    { id: "computador", pt: "Computador", en: "Computer", icone: "chip:#c8ccd0", mod: "ComputerCraft" },
    { id: "robo_minerador", pt: "Robô Minerador", en: "Mining Turtle", icone: "bloco:#d9c37a", pilha: 1, mod: "ComputerCraft" },
    { id: "regador", pt: "Regador", en: "Watering Can", icone: "garrafa:#7a8a99", pilha: 1 },
    { id: "varinha_construtor", pt: "Varinha do Construtor", en: "Builder's Wand", icone: "barra:#3d2c5e", pilha: 1 },
    { id: "super_varinha_construtor", pt: "Super Varinha do Construtor", en: "Super Builder's Wand", icone: "barra:#5ff3ff", pilha: 1 },
  ],
  blocos: [
    {
      id: "pedra_caminho", pt: "Pedra do Caminho", en: "Waystone", tipo: "cubo", cor: "#8a8a92", padrao: "entalhado", dureza: 5, girar: false,
      luzEmite: 5, comp: "cl:pedra_caminho", mod: "Waystones",
      geometria: { ossos: { base: [[[-7, 0, -7], [14, 3, 14]]], coluna: [[[-5, 3, -5], [10, 11, 10]]], topo: [[[-6, 14, -6], [12, 2, 12]]] } },
    },
    {
      id: "lixeira", pt: "Lixeira", en: "Trash Can", tipo: "cubo", cor: "#6f7780", padrao: "metal", dureza: 2, girar: false, comp: "cl:lixeira", tick: 20,
      geometria: { ossos: { lata: [[[-6, 0, -6], [12, 13, 12]]], tampa: [[[-7, 13, -7], [14, 2, 14]], [[-2, 15, -1], [4, 1, 2]]] } },
      extra: caixa([-7, 0, -7], [14, 16, 14]),
    },
    { id: "bloco_angelical", pt: "Bloco Angelical", en: "Angel Block", tipo: "cubo", cor: "#f2e6b0", padrao: "polido", dureza: 0.05, girar: false },
    ...NIVEIS.map((n) => ({
      id: `pedregulho_comprimido_${n}`, pt: `Pedregulho Comprimido (${n}x)`, en: `Compressed Cobblestone (${n}x)`,
      tipo: "cubo", cor: tom(n), padrao: "rachado", dureza: 2 + n, girar: false,
    })),
  ],
  receitas: [
    { id: "pedra_caminho", tipo: "shaped", padrao: [" T ", "TWT", "OOO"], chave: { T: "minecraft:stone_bricks", W: "cl:pedra_viagem", O: "minecraft:obsidian" }, resultado: "cl:pedra_caminho" },
    { id: "pedra_viagem", tipo: "shaped", padrao: [" D ", "EPE", " D "], chave: { D: "minecraft:purple_dye", E: "minecraft:emerald", P: "minecraft:ender_pearl" }, resultado: "cl:pedra_viagem" },
    { id: "pergaminho_retorno", tipo: "shapeless", ingredientes: ["minecraft:paper", "minecraft:ender_pearl", "minecraft:gold_nugget", "minecraft:gold_nugget"], resultado: "cl:pergaminho_retorno" },
    { id: "pergaminho_viagem", tipo: "shapeless", ingredientes: ["minecraft:paper", "minecraft:ender_pearl", "minecraft:purple_dye"], resultado: "cl:pergaminho_viagem" },
    { id: "mochila", tipo: "shaped", padrao: ["LLL", "LWL", "LLL"], chave: { L: "minecraft:leather", W: "minecraft:white_wool" }, resultado: "cl:mochila" },
    { id: "computador", tipo: "shaped", padrao: ["PPP", "PRP", "PVP"], chave: { P: "minecraft:stone", R: "minecraft:redstone", V: "minecraft:glass_pane" }, resultado: "cl:computador" },
    { id: "robo_minerador", tipo: "shaped", padrao: ["FPF", "FCF", "FBF"], chave: { F: "minecraft:iron_ingot", P: "minecraft:diamond_pickaxe", C: "cl:computador", B: "minecraft:chest" }, resultado: "cl:robo_minerador" },
    { id: "regador", tipo: "shaped", padrao: ["S  ", "SBS", " S "], chave: { S: "minecraft:stone", B: "minecraft:bowl" }, resultado: "cl:regador" },
    { id: "varinha_construtor", tipo: "shaped", padrao: ["O", "S"], chave: { O: "minecraft:obsidian", S: "minecraft:stick" }, resultado: "cl:varinha_construtor" },
    { id: "super_varinha_construtor", tipo: "shaped", padrao: ["D", "V"], chave: { D: "minecraft:diamond_block", V: "cl:varinha_construtor" }, resultado: "cl:super_varinha_construtor" },
    { id: "lixeira", tipo: "shaped", padrao: ["SSS", "CBC", "CCC"], chave: { S: "minecraft:stone", C: "minecraft:cobblestone", B: "minecraft:chest" }, resultado: "cl:lixeira" },
    { id: "bloco_angelical", tipo: "shaped", padrao: [" G ", "FOF"], chave: { G: "minecraft:gold_ingot", F: "minecraft:feather", O: "minecraft:obsidian" }, resultado: "cl:bloco_angelical" },
    ...NIVEIS.flatMap((n) => {
      const de = n === 1 ? "minecraft:cobblestone" : comprimido(n - 1);
      return [
        { id: `pedregulho_comprimido_${n}`, tipo: "shaped", padrao: ["CCC", "CCC", "CCC"], chave: { C: de }, resultado: comprimido(n) },
        { id: `descomprimir_${n}`, tipo: "shapeless", ingredientes: [comprimido(n)], resultado: de, qtd: 9 },
      ];
    }),
  ],
  textos: {
    "entity.cl:mochila.name": ["Mochila", "Backpack"],
    "entity.cl:robo_minerador.name": ["Robô Minerador", "Mining Turtle"],
    "cl.wy.ativada": ["§dPedra do Caminho ativada: %s.", "§dWaystone activated: %s."],
    "cl.wy.titulo": ["Pedras do Caminho", "Waystones"],
    "cl.wy.corpo": ["Para onde? (só as que você já ativou, nesta dimensão)", "Where to? (only the ones you activated, in this dimension)"],
    "cl.wy.item": ["%s\n§8%s blocos", "%s\n§8%s blocks"],
    "cl.wy.renomear": ["Renomear esta pedra", "Rename this waystone"],
    "cl.wy.nome": ["Nome da Pedra do Caminho", "Waystone name"],
    "cl.wy.nenhuma": ["Nenhuma outra Pedra do Caminho ativada nesta dimensão.", "No other activated Waystone in this dimension."],
    "cl.wy.espera": ["A Pedra de Viagem ainda está carregando: %s s.", "The Warp Stone is still charging: %s s."],
    "cl.wy.sem_retorno": ["Ative uma Pedra do Caminho nesta dimensão primeiro.", "Activate a Waystone in this dimension first."],
    "cl.wy.sumiu": ["Essa Pedra do Caminho foi quebrada.", "That Waystone was broken."],
    "cl.mochila.dica": ["Mochila no chão: use o botão Abrir para mexer nela e bata nela para guardar de volta.", "Backpack on the ground: use the Open button to use it and hit it to pick it back up."],
    "cl.robo.tocar": ["Programar", "Program"],
    "cl.robo.titulo": ["Robô Minerador", "Mining Turtle"],
    "cl.robo.corpo": ["Combustível: %s (carvão = 80)\nItens: %s de 16 espaços\n%s\n\nToque no robô com combustível na mão para abastecer. Os itens vão para um baú atrás do ponto de partida.", "Fuel: %s (coal = 80)\nItems: %s of 16 slots\n%s\n\nTap the turtle with fuel in hand to refuel. Items go into a chest behind the starting point."],
    "cl.robo.parado": ["Parado.", "Idle."],
    "cl.robo.trabalhando": ["Trabalhando: %s (%s blocos).", "Working: %s (%s blocks)."],
    "cl.robo.tunel": ["Túnel de %s (3 de largura, 2 de altura)", "Tunnel of %s (3 wide, 2 high)"],
    "cl.robo.escavar": ["Escavar %s×%s até o fundo", "Excavate %s×%s to the bottom"],
    "cl.robo.parar": ["Parar e voltar", "Stop and come back"],
    "cl.robo.esvaziar": ["Soltar os itens aqui", "Drop the items here"],
    "cl.robo.guardar": ["Guardar o robô", "Pick up the turtle"],
    "cl.robo.abasteceu": ["Robô abastecido: %s de combustível.", "Turtle refueled: %s fuel."],
    "cl.robo.sem_combustivel": ["§eO Robô Minerador está sem combustível e voltou.", "§eThe Mining Turtle ran out of fuel and came back."],
    "cl.robo.terminou": ["§aO Robô Minerador terminou: %s blocos.", "§aThe Mining Turtle finished: %s blocks."],
    "cl.robo.pouco": ["Combustível de menos para esse trabalho (precisa de %s).", "Not enough fuel for that job (needs %s)."],
    "cl.xu.lixeira.dica": ["Jogue itens na Lixeira ou toque nela com o item na mão para apagá-lo.", "Throw items into the Trash Can or tap it with the item in hand to delete it."],
    "cl.xu.lixeira.titulo": ["Lixeira", "Trash Can"],
    "cl.xu.lixeira.pergunta": ["Apagar %s× %s para sempre?", "Delete %s× %s forever?"],
    "cl.xu.sim": ["Apagar", "Delete"],
    "cl.xu.nao": ["Cancelar", "Cancel"],
    "cl.xu.varinha.falta": ["Sem %s na mochila.", "No %s in your inventory."],
    "cl.redemoinho.pego": ["§6Um redemoinho de poeira te pegou!", "§6A dust devil caught you!"],
    "cl.capitulo.utilidades.nome": ["Utilidades", "Utilities"],
    "cl.capitulo.utilidades.curto": ["Utilidades", "Utilities"],
    "cl.capitulo.utilidades.desc": ["Waystones, Mochila, Robô Minerador (ComputerCraft), Extra Utilities e os redemoinhos do Weather2.", "Waystones, Backpack, Mining Turtle (ComputerCraft), Extra Utilities and the Weather2 dust devils."],
    "cl.missao.ut_pedra.titulo": ["Pedra do Caminho", "Waystone"], "cl.missao.ut_pedra.desc": ["Coloque uma Pedra do Caminho.", "Place a Waystone."],
    "cl.missao.ut_viajar.titulo": ["De pedra em pedra", "Stone to stone"], "cl.missao.ut_viajar.desc": ["Viaje até outra Pedra do Caminho.", "Travel to another Waystone."],
    "cl.missao.ut_mochila.titulo": ["Mochila", "Backpack"], "cl.missao.ut_mochila.desc": ["Faça uma Mochila.", "Make a Backpack."],
    "cl.missao.ut_robo.titulo": ["Robô Minerador", "Mining Turtle"], "cl.missao.ut_robo.desc": ["Faça um Robô Minerador.", "Make a Mining Turtle."],
    "cl.missao.ut_tunel.titulo": ["Programa terminado", "Program done"], "cl.missao.ut_tunel.desc": ["Deixe o robô terminar um túnel ou uma escavação.", "Let the turtle finish a tunnel or an excavation."],
    "cl.missao.ut_lixeira.titulo": ["Lixeira", "Trash Can"], "cl.missao.ut_lixeira.desc": ["Coloque uma Lixeira.", "Place a Trash Can."],
    "cl.missao.ut_varinha.titulo": ["Construtor", "Builder"], "cl.missao.ut_varinha.desc": ["Use a Varinha do Construtor.", "Use the Builder's Wand."],
    "cl.missao.ut_comprimido.titulo": ["Compressão", "Compression"], "cl.missao.ut_comprimido.desc": ["Faça um Pedregulho Comprimido (3x).", "Make a Compressed Cobblestone (3x)."],
    "cl.missao.ut_redemoinho.titulo": ["Redemoinho", "Dust devil"], "cl.missao.ut_redemoinho.desc": ["Seja pego por um redemoinho de poeira no deserto.", "Get caught by a dust devil in the desert."],
  },
};

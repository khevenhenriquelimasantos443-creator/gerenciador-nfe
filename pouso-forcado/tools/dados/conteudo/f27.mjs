// Fase 27 (1.6.1): a Lua de verdade e o final novo. Base de pesquisa lunar com masmorra (tijolo lunar, salas de
// monstros, sala de baús e a sala do chefe), o Esqueleto Evoluído Gigante (150 de vida) que guarda a Chave da
// Masmorra, o Baú do Tesouro com o Núcleo de Salto, o Distribuidor de Bolha de Oxigênio (bolha de até 10 blocos,
// 8 de oxigênio por tick) e meteoros. Scripts em scripts/galacticraft/base.ts, oxigenio.ts e lua.ts.
const MOBS = [
  ["zumbi_evoluido", "Zumbi Evoluído", "Evolved Zombie"],
  ["esqueleto_evoluido", "Esqueleto Evoluído", "Evolved Skeleton"],
  ["aranha_evoluida", "Aranha Evoluída", "Evolved Spider"],
  ["creeper_evoluido", "Creeper Evoluído", "Evolved Creeper"],
  ["esqueleto_chefe", "Esqueleto Evoluído Gigante", "Evolved Skeleton Boss"],
];

export default {
  fase: 27,
  mod: "Galacticraft",
  itens: [
    { id: "nucleo_salto", pt: "Núcleo de Salto", en: "Jump Core", icone: "nucleo:#c08cff", pilha: 1, mod: "Pouso Forçado" },
    { id: "chave_masmorra", pt: "Chave da Masmorra Tier 1", en: "Tier 1 Dungeon Key", icone: "chave:#f2c94c", pilha: 1 },
  ],
  blocos: [
    { id: "tijolo_lunar", pt: "Tijolo da Masmorra Lunar", en: "Moon Dungeon Brick", tipo: "cubo", cor: "#5c6066", padrao: "tijolos", dureza: 4, resistencia: 40 },
    {
      id: "bau_tesouro", pt: "Baú do Tesouro", en: "Treasure Chest", tipo: "maquina", luz: "amarelo", glifo: "caixa", comp: "cl:bau_tesouro", dureza: 30, resistencia: 1200,
      estados: { "cl:aberto": [false, true] }, loot: "loot_tables/cl/vazio.json",
    },
    {
      id: "distribuidor_oxigenio", pt: "Distribuidor de Bolha de Oxigênio", en: "Oxygen Bubble Distributor", tipo: "maquina", luz: "ciano", glifo: "circulo",
      comp: "cl:distribuidor_oxigenio", tick: 20,
    },
  ],
  receitas: [
    { id: "distribuidor_oxigenio", tipo: "shaped", padrao: ["WXW", "YZY", "WXW"], chave: { W: "cl:placa_aco", X: "cl:ventilador_oxigenio", Y: "cl:respiro_oxigenio", Z: "cl:placa_aluminio" }, resultado: "cl:distribuidor_oxigenio" },
    { id: "tijolo_lunar", tipo: "shaped", padrao: ["XX", "XX"], chave: { X: "cl:rocha_lunar" }, resultado: "cl:tijolo_lunar", qtd: 4 },
  ],
  textos: {
    ...Object.fromEntries(MOBS.flatMap(([id, pt, en]) => [[`entity.cl:${id}.name`, [pt, en]], [`item.spawn_egg.entity.cl:${id}.name`, [`Gerar ${pt}`, `Spawn ${en}`]]])),
    "cl.gc.distribuidor": ["Distribuidor de Bolha: %s/6000 de oxigênio, bolha de %s blocos. Encoste num Coletor (ou ponha tanques e cilindros no baú de cima); gasta 8 por tick e energia.", "Bubble Distributor: %s/6000 oxygen, bubble of %s blocks. Place it touching a Collector (or put oxygen tanks and Mekanism oxygen tanks in the chest above); uses 8 per tick and power."],
    "cl.gc.na_bolha": ["Dentro da bolha de oxigênio.", "Inside the oxygen bubble."],
    "cl.gc.meteoro": ["§cMeteoro!", "§cMeteor!"],
    "cl.gc.sinal": ["§6[Rádio]§r Sinal da base de pesquisa lunar: X %s, Z %s (a %s m). A Bússola do Avião aponta para ela aqui na Lua.", "§6[Radio]§r Signal from the lunar research base: X %s, Z %s (%s m away). The Plane Compass points to it here on the Moon."],
    "cl.gc.base_rumo": ["Base lunar: %s, %s m", "Lunar base: %s, %s m"],
    "cl.gc.base_chegou": ["Você está na base lunar.", "You are at the lunar base."],
    "cl.gc.base_entrada": ["§7Base de Pesquisa Lunar§r: a escada desce para a masmorra.", "§7Lunar Research Base§r: the ladder goes down to the dungeon."],
    "cl.gc.chefe_acordou": ["§cO Esqueleto Evoluído Gigante guarda a sala!", "§cThe Evolved Skeleton Boss guards the room!"],
    "cl.gc.chefe_morto": ["§6[Diário de Bordo]§r O guardião caiu. A Chave da Masmorra abre o Baú do Tesouro.", "§6[Logbook]§r The guardian fell. The Dungeon Key opens the Treasure Chest."],
    "cl.gc.bau_trancado": ["Trancado. A Chave da Masmorra está com o guardião desta sala.", "Locked. The guardian of this room holds the Dungeon Key."],
    "cl.gc.bau_aberto": ["O Baú do Tesouro se abriu: o Núcleo de Salto!", "The Treasure Chest opened: the Jump Core!"],
    "cl.gc.bau_vazio": ["O Baú do Tesouro já foi aberto.", "The Treasure Chest has already been opened."],
    "cl.gc.arremessado": ["O guardião te agarrou e te jogou longe!", "The guardian grabbed you and threw you away!"],
    "cl.nave.sistema.salto": ["Bobina de Salto", "Jump Coil"],
    "cl.nave.salto_queimada": ["§c[--] §rBobina de Salto: queimou na queda. Sem ela a nave sobe, mas não salta para casa. O rádio pega um sinal na Lua: uma base de pesquisa com um Núcleo de Salto (capítulo Galacticraft do Diário).", "§c[--] §rJump Coil: burned in the crash. Without it the ship lifts off but cannot jump home. The radio picks up a signal on the Moon: a research base with a Jump Core (Galacticraft chapter in the Logbook)."],
    "cl.nave.salto_ok": ["§a[OK] §rBobina de Salto (Núcleo de Salto instalado)", "§a[OK] §rJump Coil (Jump Core installed)"],
    "cl.nave.instalar_nucleo": ["Instalar o Núcleo de Salto", "Install the Jump Core"],
    "cl.nave.nucleo_instalado": ["Núcleo de Salto instalado. A nave está pronta para saltar para casa.", "Jump Core installed. The ship is ready to jump home."],
    "cl.missao.gc_bolha.titulo": ["Bolha de ar", "Air bubble"], "cl.missao.gc_bolha.desc": ["Coloque um Distribuidor de Bolha de Oxigênio.", "Place an Oxygen Bubble Distributor."],
    "cl.missao.gc_evoluidos.titulo": ["Evoluídos", "Evolved"], "cl.missao.gc_evoluidos.desc": ["Derrote 10 monstros evoluídos na Lua.", "Defeat 10 evolved monsters on the Moon."],
    "cl.missao.gc_base.titulo": ["O sinal", "The signal"], "cl.missao.gc_base.desc": ["Ache a Base de Pesquisa Lunar (a Bússola do Avião aponta para ela na Lua).", "Find the Lunar Research Base (the Plane Compass points to it on the Moon)."],
    "cl.missao.gc_chefe.titulo": ["O guardião", "The guardian"], "cl.missao.gc_chefe.desc": ["Derrote o Esqueleto Evoluído Gigante na sala do fundo da masmorra.", "Defeat the Evolved Skeleton Boss in the dungeon's back room."],
    "cl.missao.gc_nucleo.titulo": ["Núcleo de Salto", "Jump Core"], "cl.missao.gc_nucleo.desc": ["Abra o Baú do Tesouro com a chave e pegue o Núcleo de Salto.", "Open the Treasure Chest with the key and take the Jump Core."],
    "cl.missao.gc_instalar.titulo": ["Bobina nova", "New coil"], "cl.missao.gc_instalar.desc": ["Instale o Núcleo de Salto no Painel da Nave. Depois é decolar.", "Install the Jump Core in the Ship Console. Then take off."],
  },
};

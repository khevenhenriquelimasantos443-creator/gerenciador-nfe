// Testes com jogador simulado (GameTest) para o servidor Bedrock. Não vão no add-on.
// Rodar no console do servidor (tools/testar-servidor.mjs explica):
//   execute positioned <x> 46 <z> run gametest run pouso:<nome>
// Cada teste usa a estrutura pouso:vazio (8x6x8, chão de pedra em y 0). Coordenadas relativas a ela.
import { BlockPermutation, BlockVolume, Direction, GameMode, ItemStack, system, world } from "@minecraft/server";
import { register } from "@minecraft/server-gametest";

const log = (m) => console.warn(`[TESTE] ${m}`);
const quantos = (j, id) => {
  const inv = j.getComponent("minecraft:inventory").container;
  let n = 0;
  for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === id) n += inv.getItem(s).amount;
  return n;
};
function teste(nome, ticks, fn) {
  register("pouso", nome, (t) => {
    try {
      fn(t);
    } catch (e) {
      t.fail(`${e}`);
    }
  })
    .structureName("pouso:vazio")
    .maxTicks(ticks);
}
const robo = (t, pos = { x: 1, y: 1, z: 1 }) => t.spawnSimulatedPlayer(pos, "Robo", GameMode.Survival);

// O avião aparece com o primeiro jogador: procura o painel, o baú e as portas em volta.
teste("aviao", 1200, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const p0 = { x: Math.floor(j.location.x), y: Math.floor(j.location.y), z: Math.floor(j.location.z) };
  t.runAfterDelay(400, () => {
    const dim = world.getDimension("overworld");
    const achados = { painel: [], bau: [], portas: 0, lanternas: 0 };
    for (let x = p0.x - 95; x <= p0.x + 10; x++)
      for (let z = p0.z - 5; z <= p0.z + 60; z++)
        for (let y = p0.y - 2; y <= p0.y + 6; y++) {
          const b = dim.getBlock({ x, y, z });
          if (!b) continue;
          if (b.typeId === "cl:painel_nave") achados.painel.push(`${x - p0.x},${y - p0.y},${z - p0.z} ${b.permutation.getState("minecraft:cardinal_direction")}`);
          if (b.typeId === "minecraft:chest") achados.bau.push(`${x - p0.x},${y - p0.y},${z - p0.z} vazios=${b.getComponent("inventory").container.emptySlotsCount}`);
          if (b.typeId === "minecraft:spruce_door") achados.portas++;
        }
    log(`avião: ${JSON.stringify(achados)}`);
    t.assert(achados.painel.length === 1, "painel da nave");
    t.assert(achados.bau.length === 1, "baú de suprimentos");
    t.assert(achados.portas === 6, `portas: ${achados.portas} metades (esperava 6)`);
    t.succeed();
  });
});

teste("varal", 200, (t) => {
  const j = robo(t);
  t.setBlockType("cl:varal", { x: 3, y: 1, z: 1 });
  j.giveItem(new ItemStack("minecraft:rotten_flesh", 3), true);
  t.runAfterDelay(10, () => {
    j.lookAtBlock({ x: 3, y: 1, z: 1 });
    j.interactWithBlock({ x: 3, y: 1, z: 1 }, Direction.North);
    j.interactWithBlock({ x: 3, y: 1, z: 1 }, Direction.North);
    t.runAfterDelay(10, () => {
      const n = t.getBlock({ x: 3, y: 1, z: 1 }).permutation.getState("cl:pendurado");
      log(`varal: pendurado=${n}, carne na mão=${quantos(j, "minecraft:rotten_flesh")}`);
      t.assert(n === 2, `esperava 2 pendurados, veio ${n}`);
      t.succeed();
    });
  });
});

teste("cinzel", 200, (t) => {
  const j = robo(t);
  t.setBlockType("cl:marmore", { x: 3, y: 1, z: 1 });
  j.giveItem(new ItemStack("cl:cinzel", 1), true);
  t.runAfterDelay(10, () => {
    j.useItemInSlotOnBlock(j.selectedSlotIndex, { x: 3, y: 1, z: 1 }, Direction.North);
    t.runAfterDelay(10, () => {
      const id = t.getBlock({ x: 3, y: 1, z: 1 }).typeId;
      log(`cinzel: ${id}`);
      t.assert(id === "cl:marmore_liso", `virou ${id}`);
      t.succeed();
    });
  });
});

teste("caldeirao", 200, (t) => {
  const j = robo(t);
  t.setBlockType("minecraft:magma", { x: 3, y: 1, z: 1 });
  t.setBlockPermutation(BlockPermutation.resolve("minecraft:cauldron", { fill_level: 6, cauldron_liquid: "water" }), { x: 3, y: 2, z: 1 });
  j.giveItem(new ItemStack("minecraft:glass_bottle", 2), true);
  t.runAfterDelay(10, () => {
    j.useItemInSlotOnBlock(j.selectedSlotIndex, { x: 3, y: 2, z: 1 }, Direction.Up);
    t.runAfterDelay(10, () => {
      const boa = quantos(j, "cl:agua_boa"), salgada = quantos(j, "minecraft:potion");
      log(`caldeirão: água boa=${boa}, garrafa do jogo=${salgada}, nível=${t.getBlock({ x: 3, y: 2, z: 1 }).permutation.getState("fill_level")}`);
      t.assert(boa === 1, "não deu água boa");
      t.succeed();
    });
  });
});

teste("nether", 200, (t) => {
  const j = robo(t);
  t.setBlockType("minecraft:obsidian", { x: 3, y: 1, z: 1 });
  j.giveItem(new ItemStack("minecraft:flint_and_steel", 1), true);
  t.runAfterDelay(10, () => {
    j.useItemInSlotOnBlock(j.selectedSlotIndex, { x: 3, y: 1, z: 1 }, Direction.Up);
    t.runAfterDelay(10, () => {
      const cima = t.getBlock({ x: 3, y: 2, z: 1 }).typeId;
      log(`nether: em cima da obsidiana = ${cima}`);
      t.assert(cima === "minecraft:air", `acendeu: ${cima}`);
      t.succeed();
    });
  });
});

teste("estante", 200, (t) => {
  const j = robo(t);
  t.setBlockType("cl:estante", { x: 3, y: 1, z: 1 });
  j.giveItem(new ItemStack("minecraft:book", 3), true);
  t.runAfterDelay(10, () => {
    j.interactWithBlock({ x: 3, y: 1, z: 1 }, Direction.North);
    t.runAfterDelay(10, () => {
      const n = quantos(j, "minecraft:book");
      log(`estante: livros na mão = ${n}`);
      t.assert(n === 2, `esperava 2 livros, ficou ${n}`);
      t.succeed();
    });
  });
});

teste("lampada", 200, (t) => {
  const j = robo(t);
  t.setBlockType("cl:lampada_azul", { x: 3, y: 1, z: 1 });
  t.runAfterDelay(10, () => {
    j.interactWithBlock({ x: 3, y: 1, z: 1 }, Direction.North);
    t.runAfterDelay(10, () => {
      const aceso = t.getBlock({ x: 3, y: 1, z: 1 }).permutation.getState("cl:aceso");
      log(`lâmpada azul: aceso=${aceso}`);
      t.assert(aceso === true, "não acendeu");
      t.succeed();
    });
  });
});

teste("torre", 400, (t) => {
  world.setTimeOfDay(18000);
  t.setBlockPermutation(BlockPermutation.resolve("cl:bateria", { "cl:carga": 15 }), { x: 1, y: 1, z: 1 });
  t.setBlockType("cl:torre_defesa", { x: 2, y: 1, z: 1 });
  const z = t.spawn("minecraft:husk", { x: 6, y: 1, z: 6 });
  const vida0 = z.getComponent("health").currentValue;
  t.runAfterDelay(100, () => {
    const viva = z.isValid;
    const vida = viva ? z.getComponent("health").currentValue : 0;
    log(`torre: husk ${vida0} -> ${vida} (vivo: ${viva}); carga da bateria = ${t.getBlock({ x: 1, y: 1, z: 1 }).permutation.getState("cl:carga")}`);
    world.setTimeOfDay(6000);
    t.assert(vida < vida0, "a torre não atirou");
    t.succeed();
  });
});

teste("saco", 300, (t) => {
  world.setTimeOfDay(15000);
  for (const m of world.getDimension("overworld").getEntities({ families: ["monster"] })) m.remove();
  const j = robo(t);
  t.runAfterDelay(10, () => {
    j.useItem(new ItemStack("cl:saco_dormir", 1));
    t.runAfterDelay(60, () => {
      const hora = world.getTimeOfDay();
      log(`saco de dormir: hora = ${hora}`);
      t.assert(hora < 2000, `não pulou a noite (${hora})`);
      t.succeed();
    });
  });
});

teste("celula", 400, (t) => {
  const j = robo(t);
  t.setBlockType("cl:celula_energia_basica", { x: 3, y: 1, z: 1 });
  t.runAfterDelay(10, () => {
    j.breakBlock({ x: 3, y: 1, z: 1 }, Direction.North);
    t.runAfterDelay(240, () => {
      log(`célula: o bloco agora é ${t.getBlock({ x: 3, y: 1, z: 1 }).typeId}`);
      const n = world.getDimension("overworld").getEntities({ type: "minecraft:item", location: t.worldBlockLocation({ x: 3, y: 1, z: 1 }), maxDistance: 4 })
        .filter((e) => e.getComponent("item").itemStack.typeId === "cl:celula_energia_basica").length;
      const mochila = quantos(j, "cl:celula_energia_basica");
      log(`célula quebrada: ${n} no chão, ${mochila} na mochila do robô`);
      t.assert(n + mochila === 1, `esperava 1 célula, veio ${n + mochila}`);
      t.succeed();
    });
  });
});

teste("ferro_comprimido", 300, (t) => {
  t.spawnItem(new ItemStack("minecraft:iron_ingot", 10), { x: 4, y: 1.5, z: 4 });
  t.runAfterDelay(20, () => {
    t.spawn("minecraft:tnt", { x: 4, y: 1, z: 4 });
    t.runAfterDelay(120, () => {
      const itens = world.getDimension("overworld").getEntities({ type: "minecraft:item", location: t.worldBlockLocation({ x: 4, y: 1, z: 4 }), maxDistance: 10 }).map((e) => e.getComponent("item").itemStack);
      log(`depois da explosão: ${itens.map((i) => `${i.typeId} x${i.amount}`).join(", ") || "nada"}`);
      t.assert(itens.some((i) => i.typeId === "cl:lingote_ferro_comprimido"), "não virou ferro comprimido");
      t.succeed();
    });
  });
});

// 1.3.0 ---------------------------------------------------------------
const bau = (t, pos) => t.getBlock(pos).getComponent("inventory").container;
const noBau = (c, id) => {
  let n = 0;
  for (let s = 0; s < c.size; s++) if (c.getItem(s)?.typeId === id) n += c.getItem(s).amount;
  return n;
};

teste("refinaria", 400, (t) => {
  t.setBlockPermutation(BlockPermutation.resolve("cl:bateria", { "cl:carga": 15 }), { x: 1, y: 2, z: 1 });
  t.setBlockType("minecraft:chest", { x: 2, y: 1, z: 1 });
  t.setBlockType("cl:refinaria", { x: 2, y: 2, z: 1 });
  t.setBlockType("minecraft:chest", { x: 2, y: 3, z: 1 });
  bau(t, { x: 2, y: 3, z: 1 }).addItem(new ItemStack("cl:balde_petroleo", 1));
  t.runAfterDelay(250, () => {
    const n = noBau(bau(t, { x: 2, y: 1, z: 1 }), "cl:balde_combustivel");
    log(`refinaria: combustível no baú de baixo = ${n}`);
    t.assert(n === 1, "não refinou");
    t.succeed();
  });
});

teste("pedreira", 400, (t) => {
  t.setBlockPermutation(BlockPermutation.resolve("cl:bateria", { "cl:carga": 15 }), { x: 2, y: 1, z: 0 });
  t.setBlockPermutation(BlockPermutation.resolve("cl:pedreira", { "minecraft:cardinal_direction": "north" }), { x: 3, y: 1, z: 0 });
  t.setBlockType("minecraft:chest", { x: 3, y: 2, z: 0 });
  t.setBlockType("minecraft:cobblestone", { x: 3, y: 1, z: 2 });
  t.setBlockType("minecraft:iron_ore", { x: 4, y: 1, z: 3 });
  t.runAfterDelay(250, () => {
    const c = bau(t, { x: 3, y: 2, z: 0 });
    const pedra = noBau(c, "minecraft:cobblestone"), ferro = noBau(c, "minecraft:raw_iron");
    const pb = t.getBlock({ x: 3, y: 1, z: 0 });
    log(`pedreira: pedra=${pedra} ferro bruto=${ferro}; bloco em (3,1,2) = ${t.getBlock({ x: 3, y: 1, z: 2 }).typeId}; virada=${pb.permutation.getState("minecraft:cardinal_direction")} em ${pb.x},${pb.y},${pb.z}; (3,1,2) mundo=${JSON.stringify(t.worldBlockLocation({ x: 3, y: 1, z: 2 }))}`);
    t.assert(pedra + ferro >= 4, "a pedreira não cavou");
    t.succeed();
  });
});

teste("elevador", 200, (t) => {
  t.setBlockType("cl:elevador", { x: 2, y: 1, z: 2 });
  t.setBlockType("cl:elevador", { x: 2, y: 4, z: 2 });
  const j = robo(t, { x: 2.5, y: 2, z: 2.5 });
  t.runAfterDelay(20, () => {
    const y0 = j.location.y;
    const em = world.getDimension("overworld").getBlock({ x: Math.floor(j.location.x), y: Math.floor(j.location.y - 0.1), z: Math.floor(j.location.z) });
    log(`elevador: em cima de ${em?.typeId}, no chão=${j.isOnGround}`);
    let pulou = 0;
    const id = system.runInterval(() => { if (j.isJumping) pulou++; }, 1);
    t.runAfterDelay(15, () => system.clearRun(id));
    j.jump();
    t.runAfterDelay(16, () => log(`elevador: isJumping visto em ${pulou} ticks`));
    t.runAfterDelay(20, () => {
      log(`elevador: y ${y0.toFixed(1)} -> ${j.location.y.toFixed(1)}`);
      t.assert(j.location.y - y0 > 2.5, "não subiu");
      t.succeed();
    });
  });
});

teste("tumulo", 200, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  t.runAfterDelay(10, () => {
    j.giveItem(new ItemStack("minecraft:diamond", 5), false);
    j.giveItem(new ItemStack("minecraft:iron_ingot", 7), false);
    const onde = { x: Math.floor(j.location.x), y: Math.floor(j.location.y), z: Math.floor(j.location.z) };
    j.kill();
    t.runAfterDelay(20, () => {
      const b = world.getDimension("overworld").getBlock(onde);
      log(`túmulo: bloco onde morreu = ${b?.typeId}`);
      t.assert(b?.typeId === "cl:tumulo", "não fez túmulo");
      t.succeed();
    });
  });
});

// 1.3.2: o petróleo é "líquido": sem colisão, pega com balde e despeja com o balde cheio.
teste("petroleo", 300, (t) => {
  t.setBlockType("cl:petroleo", { x: 3, y: 1, z: 3 });
  t.setBlockType("cl:petroleo", { x: 3, y: 2, z: 3 });
  t.setBlockType("cl:petroleo", { x: 5, y: 1, z: 1 });
  const caiu = robo(t, { x: 3, y: 4, z: 3 });
  const j = robo(t, { x: 1, y: 1, z: 1 });
  j.giveItem(new ItemStack("minecraft:bucket", 1), true);
  t.runAfterDelay(40, () => {
    const y = caiu.location.y - t.worldBlockLocation({ x: 0, y: 0, z: 0 }).y;
    log(`petróleo: robô que caiu em cima está em y ${y.toFixed(2)} (em cima do petróleo ficaria em 3)`);
    j.lookAtBlock({ x: 5, y: 1, z: 1 });
    j.useItemInSlotOnBlock(j.selectedSlotIndex, { x: 5, y: 1, z: 1 }, Direction.West);
    t.runAfterDelay(10, () => {
      const pegou = quantos(j, "cl:balde_petroleo"), bloco = t.getBlock({ x: 5, y: 1, z: 1 }).typeId;
      log(`petróleo: balde cheio=${pegou}, bloco agora=${bloco}`);
      // Nesta área de teste a altura 1 é o chão de pedra: despeja em cima dele, na altura 2.
      j.lookAtBlock({ x: 5, y: 1, z: 2 });
      j.useItemInSlotOnBlock(j.selectedSlotIndex, { x: 5, y: 1, z: 2 }, Direction.Up);
      t.runAfterDelay(10, () => {
        const despejou = t.getBlock({ x: 5, y: 2, z: 2 }).typeId;
        log(`petróleo: despejou=${despejou}, balde vazio=${quantos(j, "minecraft:bucket")}`);
        t.assert(y < 2.5, `não afundou no petróleo (y ${y})`);
        t.assert(pegou === 1 && bloco === "minecraft:air", "o balde não pegou o petróleo");
        t.assert(despejou === "cl:petroleo", "o balde não despejou");
        t.succeed();
      });
    });
  });
});

// 1.3.7: de dia nada nasce na superfície (só o que o add-on põe); o camelo-zumbi some sempre.
teste("dia", 200, (t) => {
  world.setTimeOfDay(6000);
  const solto = t.spawn("minecraft:husk", { x: 2, y: 2, z: 2 });
  const doAddon = t.spawn("minecraft:husk", { x: 5, y: 2, z: 5 });
  doAddon.addTag("cl:do_addon");
  const camelo = t.spawn("minecraft:camel_husk", { x: 4, y: 2, z: 2 });
  const coelho = t.spawn("minecraft:rabbit", { x: 2, y: 2, z: 5 });
  t.runAfterDelay(20, () => {
    log(`dia: husk solto=${solto.isValid} husk do add-on=${doAddon.isValid} camelo-zumbi=${camelo.isValid} coelho=${coelho.isValid}`);
    t.assert(!solto.isValid, "o husk que nasceu de dia ficou");
    t.assert(doAddon.isValid, "sumiu o husk posto pelo add-on");
    t.assert(!camelo.isValid, "o camelo-zumbi ficou");
    t.succeed();
  });
});

// 1.6.0: a Lua (terreno gerado por script) e o oxigênio. O jogador simulado não carrega chunks na dimensão nova,
// então o teste abre uma ticking area lá. Sem oxigênio no tanque (dados de item são de cada pacote, o teste não
// consegue encher), quem está de máscara e equipamento sufoca: 2 de dano a cada 5 s.
teste("lua", 600, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const eq = j.getComponent("minecraft:equippable");
  eq.setEquipment("Head", new ItemStack("cl:mascara_oxigenio", 1));
  eq.setEquipment("Chest", new ItemStack("cl:equipamento_oxigenio", 1));
  j.getComponent("minecraft:inventory").container.setItem(9, new ItemStack("cl:tanque_oxigenio_leve", 1));
  const lua = world.getDimension("cl:lua");
  try { lua.runCommand("tickingarea add -16 0 -16 31 0 31 lua_teste true"); } catch (e) { log(`tickingarea: ${e}`); }
  j.teleport({ x: 8.5, y: 120, z: 8.5 }, { dimension: lua });
  const vida0 = j.getComponent("health").currentValue;
  let sufocou = 0;
  const ouvinte = world.afterEvents.entityHurt.subscribe((ev) => {
    if (ev.hurtEntity.id === j.id && (ev.damageSource.cause === "suffocation" || ev.damageSource.cause === "drowning")) sufocou += ev.damage;
  });
  t.runAfterDelay(300, () => {
    world.afterEvents.entityHurt.unsubscribe(ouvinte);
    const carregado = lua.isChunkLoaded({ x: 8, y: 0, z: 8 });
    const topo = carregado ? lua.getTopmostBlock({ x: 8, z: 8 }) : undefined;
    const fundo = carregado ? lua.getBlock({ x: 0, y: 0, z: 0 })?.typeId : undefined;
    let minerios = 0;
    if (carregado) for (let y = 1; y < 60; y++) for (let x = 0; x < 16; x++) { const b = lua.getBlock({ x, y, z: 4 })?.typeId ?? ""; if (b.startsWith("cl:minerio")) minerios++; }
    const vida = j.getComponent("health").currentValue;
    log(`lua: carregado=${carregado} topo=${topo?.typeId}@${topo?.y} fundo=${fundo} vida ${vida0}->${vida} sufocou=${sufocou} pos y=${j.location.y.toFixed(1)} minérios numa fatia=${minerios} pulo=${!!j.getEffect("jump_boost")} queda lenta=${!!j.getEffect("slow_falling")}`);
    t.assert(topo && topo.y > 40 && topo.y < 100, "sem chão na Lua");
    t.assert(fundo === "minecraft:bedrock", "chunk sem a rocha matriz");
    t.assert(sufocou >= 4, "sem oxigênio e não sufocou");
    try { lua.runCommand("tickingarea remove lua_teste"); } catch {}
    j.teleport({ x: 3, y: 47, z: 3 }, { dimension: world.getDimension("overworld") });
    t.succeed();
  });
});

// 1.6.0: o Compressor faz placa comprimida com carvão; o foguete fica de pé no meio da plataforma 3×3.
teste("compressor", 400, (t) => {
  t.setBlockType("cl:compressor", { x: 1, y: 2, z: 1 });
  t.setBlockType("minecraft:chest", { x: 1, y: 3, z: 1 });
  t.setBlockType("minecraft:chest", { x: 1, y: 1, z: 1 });
  const cima = t.getBlock({ x: 1, y: 3, z: 1 }).getComponent("inventory").container;
  cima.addItem(new ItemStack("minecraft:coal", 1));
  cima.addItem(new ItemStack("minecraft:iron_ingot", 2));
  for (let x = 4; x <= 6; x++) for (let z = 4; z <= 6; z++) t.setBlockType("cl:plataforma_lancamento", { x, y: 1, z });
  const j = robo(t, { x: 2, y: 2, z: 5 });
  j.getComponent("minecraft:inventory").container.setItem(0, new ItemStack("cl:foguete_t1", 1));
  j.selectedSlotIndex = 0;
  t.runAfterDelay(20, () => j.useItemInSlotOnBlock(0, { x: 4, y: 1, z: 4 }, Direction.Up));
  t.runAfterDelay(260, () => {
    const baixo = t.getBlock({ x: 1, y: 1, z: 1 }).getComponent("inventory").container;
    let placa = 0;
    for (let s = 0; s < baixo.size; s++) if (baixo.getItem(s)?.typeId === "cl:placa_ferro") placa += baixo.getItem(s).amount;
    const centro = t.worldLocation({ x: 5.5, y: 1.2, z: 5.5 });
    const f = j.dimension.getEntities({ type: "cl:foguete", location: centro, maxDistance: 1 })[0];
    log(`compressor: placas=${placa}; foguete=${!!f} item na mão=${quantos(j, "cl:foguete_t1")}`);
    t.assert(placa === 1, "o compressor não fez a placa");
    t.assert(f && quantos(j, "cl:foguete_t1") === 0, "o foguete não ficou no meio da plataforma");
    f?.remove();
    t.succeed();
  });
});

// 1.6.0: a viagem de foguete: lança da plataforma (pelo comando de teste), vai para a Lua, pousa e volta.
teste("viagem", 2400, (t) => {
  for (let x = 2; x <= 4; x++) for (let z = 2; z <= 4; z++) t.setBlockType("cl:plataforma_lancamento", { x, y: 1, z });
  const j = robo(t, { x: 6, y: 2, z: 3 });
  j.getComponent("minecraft:inventory").container.setItem(0, new ItemStack("cl:foguete_t1", 1));
  try { world.getDimension("cl:lua").runCommand("tickingarea add 400 0 60 480 0 100 lua_viagem true"); } catch (e) { log(`tickingarea: ${e}`); }
  t.runAfterDelay(20, () => j.useItemInSlotOnBlock(0, { x: 3, y: 1, z: 3 }, Direction.Up));
  t.runAfterDelay(40, () => {
    const n = j.dimension.getEntities({ type: "cl:foguete", location: j.location, maxDistance: 8 }).length;
    log(`viagem: foguetes perto=${n}`);
    j.runCommand("scriptevent cl:teste_foguete");
  });
  t.runAfterDelay(800, () => {
    const lua = world.getDimension("cl:lua");
    const fl = lua.getEntities({ type: "cl:foguete" });
    log(`viagem: depois de 760 ticks dim=${j.dimension.id} y=${j.location.y.toFixed(1)} foguetes na Lua=${fl.length} ${fl.map((f) => f.location.y.toFixed(1))}`);
    t.assert(j.dimension.id === "cl:lua", "não chegou na Lua");
    t.assert(fl.length === 1, "o foguete não pousou na Lua");
    j.runCommand("scriptevent cl:teste_foguete");
  });
  t.runAfterDelay(1600, () => {
    log(`viagem: volta dim=${j.dimension.id} y=${j.location.y.toFixed(1)} foguetes no planeta=${world.getDimension("overworld").getEntities({ type: "cl:foguete" }).length}`);
    t.assert(j.dimension.id === "minecraft:overworld", "não voltou ao planeta");
    for (const f of world.getDimension("overworld").getEntities({ type: "cl:foguete" })) f.remove();
    try { world.getDimension("cl:lua").runCommand("tickingarea remove lua_viagem"); } catch {}
    t.succeed();
  });
});

// 1.6.1: a base lunar (posta ao lado pelo comando de teste), o chefe, a chave e o Baú do Tesouro; e o zumbi comum
// que nasce na Lua vira o evoluído.
teste("base", 1400, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const lua = world.getDimension("cl:lua");
  try { lua.runCommand("tickingarea add 940 0 -60 1060 0 80 lua_base true"); } catch (e) { log(`tickingarea: ${e}`); }
  j.teleport({ x: 1000.5, y: 120, z: 0.5 }, { dimension: lua });
  t.runAfterDelay(200, () => {
    j.runCommand("scriptevent cl:teste_base");
    const z = lua.spawnEntity("minecraft:zombie", { x: 1000.5, y: 100, z: 5.5 });
    t.runAfterDelay(5, () => log(`base: zumbi comum ainda existe=${z.isValid}; evoluídos perto=${lua.getEntities({ type: "cl:zumbi_evoluido", location: { x: 1000.5, y: 100, z: 5.5 }, maxDistance: 6 }).length}`));
  });
  t.runAfterDelay(500, () => {
    const cx = 1006, cz = 0;
    const tij = lua.getBlock({ x: cx + 5, y: 26, z: cz })?.typeId, escada = lua.getBlock({ x: cx, y: 30, z: cz })?.typeId, bau = lua.getBlock({ x: cx, y: 27, z: cz + 41 })?.typeId;
    const baus = [lua.getBlock({ x: cx - 31, y: 27, z: cz - 3 })?.typeId, lua.getBlock({ x: cx - 31, y: 27, z: cz + 3 })?.typeId];
    log(`base: parede=${tij} escada=${escada} tesouro=${bau} baús=${baus}`);
    t.assert(tij === "cl:tijolo_lunar", "a masmorra não foi construída");
    t.assert(bau === "cl:bau_tesouro", "sem o Baú do Tesouro");
    j.teleport({ x: cx + 0.5, y: 27, z: cz + 34.5 }, { dimension: lua });
  });
  t.runAfterDelay(560, () => {
    const chefes = lua.getEntities({ type: "cl:esqueleto_chefe" });
    log(`base: chefes=${chefes.length} vida=${chefes[0]?.getComponent("health")?.currentValue}`);
    t.assert(chefes.length === 1, "o chefe não acordou");
    const morreu = chefes[0].kill();
    log(`base: kill()=${morreu}`);
  });
  t.runAfterDelay(620, () => {
    const itens = lua.getEntities({ type: "minecraft:item" });
    const chaves = itens.filter((e) => e.getComponent("item")?.itemStack.typeId === "cl:chave_masmorra");
    const naMao = quantos(j, "cl:chave_masmorra");
    log(`base: chave no chão=${chaves.length} no inventário=${naMao}; areia solta na Lua=${itens.filter((e) => e.getComponent("item")?.itemStack.typeId === "minecraft:sand").length}`);
    t.assert(chaves.length + naMao === 1, "o chefe não deixou a chave");
    if (!naMao) j.getComponent("minecraft:inventory").container.setItem(1, new ItemStack("cl:chave_masmorra", 1));
    j.teleport({ x: 1006.5, y: 27, z: 39.5 }, { dimension: lua, facingLocation: { x: 1006.5, y: 27.5, z: 41.5 } });
  });
  t.runAfterDelay(640, () => j.interactWithBlock(t.relativeBlockLocation({ x: 1006, y: 27, z: 41 }), Direction.North));
  t.runAfterDelay(680, () => {
    log(`base: núcleo=${quantos(j, "cl:nucleo_salto")} chave=${quantos(j, "cl:chave_masmorra")}`);
    t.assert(quantos(j, "cl:nucleo_salto") === 1, "o baú não deu o Núcleo de Salto");
    try { lua.runCommand("tickingarea remove lua_base"); } catch {}
    j.teleport({ x: 3, y: 47, z: 3 }, { dimension: world.getDimension("overworld") });
    t.succeed();
  });
});

// 1.7.0: Gerador a Calor carregando a bateria, Triturador fazendo biocombustível e o desgaste da picareta de ósmio.
teste("mekanism", 500, (t) => {
  const pos0 = t.setBlockType;
  t.setBlockType = (tipo, p) => { try { pos0.call(t, tipo, p); } catch (e) { log(`não pôs ${tipo} em ${JSON.stringify(p)}: ${e}`); throw e; } };
  const bat = (pos, carga) => {
    t.setBlockType("cl:bateria", pos);
    const b = t.getBlock(pos);
    b.setPermutation(b.permutation.withState("cl:carga", carga));
  };
  bat({ x: 1, y: 1, z: 1 }, 0);
  t.setBlockType("cl:gerador_calor", { x: 2, y: 1, z: 1 });
  t.setBlockType("minecraft:chest", { x: 2, y: 2, z: 1 });
  t.getBlock({ x: 2, y: 2, z: 1 }).getComponent("inventory").container.addItem(new ItemStack("minecraft:coal", 2));
  t.setBlockType("minecraft:chest", { x: 5, y: 1, z: 2 });
  t.setBlockType("cl:triturador_mk", { x: 5, y: 2, z: 2 });
  t.setBlockType("minecraft:chest", { x: 5, y: 3, z: 2 });
  t.getBlock({ x: 5, y: 3, z: 2 }).getComponent("inventory").container.addItem(new ItemStack("minecraft:wheat", 2));
  bat({ x: 6, y: 2, z: 2 }, 15);
  t.setBlockType("minecraft:cobblestone", { x: 3, y: 1, z: 5 });
  const j = robo(t, { x: 3, y: 1, z: 6 });
  j.getComponent("minecraft:inventory").container.setItem(0, new ItemStack("cl:mk_picareta_osmio", 1));
  j.selectedSlotIndex = 0;
  t.runAfterDelay(20, () => j.breakBlock({ x: 3, y: 1, z: 5 }));
  t.runAfterDelay(460, () => {
    const carga = t.getBlock({ x: 1, y: 1, z: 1 }).permutation.getState("cl:carga");
    const baixo = t.getBlock({ x: 5, y: 1, z: 2 }).getComponent("inventory").container;
    let bio = 0;
    for (let s = 0; s < baixo.size; s++) if (baixo.getItem(s)?.typeId === "cl:biocombustivel") bio += baixo.getItem(s).amount;
    const pic = j.getComponent("minecraft:inventory").container.getItem(0);
    const dano = pic?.getComponent("durability")?.damage;
    log(`mekanism: bateria do gerador a calor=${carga} biocombustível=${bio} picareta=${pic?.typeId} desgaste=${dano} pedra=${t.getBlock({ x: 3, y: 1, z: 5 }).typeId}`);
    t.assert(carga >= 2, "o Gerador a Calor não carregou a bateria");
    t.assert(bio >= 4, "o Triturador não fez biocombustível");
    t.assert(dano === 1, `a picareta gastou ${dano} (esperava 1)`);
    t.succeed();
  });
});

// 1.8.0: Fundidora de Ligas (Aço Elétrico), Moinho SAG (carvão pulverizado) e Gerador Stirling carregando a bateria.
teste("enderio", 400, (t) => {
  const bat = (pos, carga) => {
    t.setBlockType("cl:bateria", pos);
    const b = t.getBlock(pos);
    b.setPermutation(b.permutation.withState("cl:carga", carga));
  };
  const maquina = (x, z, id, itens) => {
    t.setBlockType("minecraft:chest", { x, y: 1, z });
    t.setBlockType(id, { x, y: 2, z });
    t.setBlockType("minecraft:chest", { x, y: 3, z });
    for (const [i, n] of itens) t.getBlock({ x, y: 3, z }).getComponent("inventory").container.addItem(new ItemStack(i, n));
  };
  maquina(1, 1, "cl:fundidora_ligas", [["minecraft:iron_ingot", 1], ["cl:po_carvao", 1], ["cl:silicio", 1]]);
  bat({ x: 2, y: 2, z: 1 }, 15);
  maquina(5, 1, "cl:moinho_sag", [["minecraft:coal", 1]]);
  bat({ x: 6, y: 2, z: 1 }, 15);
  maquina(3, 5, "cl:gerador_stirling", [["minecraft:coal", 1]]);
  bat({ x: 4, y: 2, z: 5 }, 0);
  const conta = (x, z, id) => {
    const c = t.getBlock({ x, y: 1, z }).getComponent("inventory").container;
    let n = 0;
    for (let s = 0; s < c.size; s++) if (c.getItem(s)?.typeId === id) n += c.getItem(s).amount;
    return n;
  };
  t.runAfterDelay(380, () => {
    const aco = conta(1, 1, "cl:aco_eletrico"), po = conta(5, 1, "cl:po_carvao"), carga = t.getBlock({ x: 4, y: 2, z: 5 }).permutation.getState("cl:carga");
    log(`enderio: aço elétrico=${aco} carvão pulverizado=${po} bateria do Stirling=${carga}`);
    t.assert(aco === 1, "a Fundidora de Ligas não fez o Aço Elétrico");
    t.assert(po >= 1, "o Moinho SAG não moeu o carvão");
    t.assert(carga >= 1, "o Gerador Stirling não carregou a bateria");
    t.succeed();
  });
});

// 1.9.0: Create. Roda d'Água com água encostada gira o eixo e a Mó (trigo → farinha); a Manivela tocada pelo robô
// gira a Prensa (ferro → chapa); sobrecarga: Rodas Trituradoras (8 SU/RPM) numa Roda d'Água sozinha (32 SU/RPM) não param.
teste("create", 700, (t) => {
  const maquina = (x, z, id, itens) => {
    t.setBlockType("minecraft:chest", { x, y: 1, z });
    t.setBlockType(id, { x, y: 2, z });
    t.setBlockType("minecraft:chest", { x, y: 3, z });
    for (const [i, n] of itens) t.getBlock({ x, y: 3, z }).getComponent("inventory").container.addItem(new ItemStack(i, n));
  };
  for (let x = 1; x <= 3; x++) t.setBlockType("minecraft:cobblestone", { x, y: 1, z: 1 });
  for (const p of [{ x: 0, y: 2, z: 1 }, { x: 1, y: 2, z: 0 }, { x: 1, y: 2, z: 2 }]) t.setBlockType("minecraft:cobblestone", p); // a água fica presa
  t.setBlockType("minecraft:water", { x: 1, y: 2, z: 1 });
  t.setBlockType("cl:roda_dagua", { x: 2, y: 2, z: 1 });
  t.setBlockType("cl:eixo", { x: 3, y: 2, z: 1 });
  maquina(4, 1, "cl:mo", [["minecraft:wheat", 8]]);
  t.setBlockType("cl:manivela", { x: 2, y: 2, z: 5 });
  maquina(3, 5, "cl:prensa_mecanica", [["minecraft:iron_ingot", 8]]);
  const j = robo(t, { x: 1, y: 1, z: 6 });
  let toques = 0;
  const id = system.runInterval(() => {
    try {
      j.lookAtBlock({ x: 2, y: 2, z: 5 });
      j.interactWithBlock({ x: 2, y: 2, z: 5 }, Direction.West);
      toques++;
    } catch {}
  }, 30);
  const conta = (x, z, item) => {
    const c = t.getBlock({ x, y: 1, z }).getComponent("inventory").container;
    let n = 0;
    for (let s = 0; s < c.size; s++) if (c.getItem(s)?.typeId === item) n += c.getItem(s).amount;
    return n;
  };
  t.runAfterDelay(200, () => log(`create: eixo girando=${t.getBlock({ x: 3, y: 2, z: 1 }).permutation.getState("cl:girando")}`));
  t.runAfterDelay(660, () => {
    system.clearRun(id);
    const farinha = conta(4, 1, "cl:farinha"), chapas = conta(3, 5, "cl:chapa_ferro"), gira = t.getBlock({ x: 3, y: 2, z: 1 }).permutation.getState("cl:girando");
    log(`create: farinha=${farinha} chapas=${chapas} eixo girando=${gira} toques=${toques}`);
    t.assert(gira === true, "o eixo não ficou girando");
    t.assert(farinha >= 1, "a Mó não fez farinha");
    t.assert(chapas >= 1, "a Prensa não fez chapa com a Manivela");
    t.succeed();
  });
});

// 1.10.0: Pedras do Caminho (ativar duas e voltar à última com o Pergaminho de Retorno).
teste("waystone", 300, (t) => {
  t.setBlockType("cl:pedra_caminho", { x: 1, y: 1, z: 1 });
  t.setBlockType("cl:pedra_caminho", { x: 6, y: 1, z: 6 });
  const j = robo(t, { x: 1, y: 1, z: 2 });
  t.runAfterDelay(20, () => j.interactWithBlock({ x: 1, y: 1, z: 1 }, Direction.South));
  t.runAfterDelay(40, () => j.teleport(t.worldLocation({ x: 6.5, y: 1, z: 5.5 })));
  t.runAfterDelay(60, () => j.interactWithBlock({ x: 6, y: 1, z: 6 }, Direction.North));
  t.runAfterDelay(80, () => j.teleport(t.worldLocation({ x: 1.5, y: 1, z: 4.5 })));
  t.runAfterDelay(100, () => {
    j.setItem(new ItemStack("cl:pergaminho_retorno", 1), 0, true);
    j.useItemInSlot(0);
  });
  t.runAfterDelay(140, () => {
    const p = t.relativeLocation(j.location);
    log(`waystone: robô em ${p.x.toFixed(1)},${p.y.toFixed(1)},${p.z.toFixed(1)} pergaminhos=${quantos(j, "cl:pergaminho_retorno")}`);
    t.assert(Math.hypot(p.x - 6.5, p.z - 6.5) < 2.5, "o Pergaminho de Retorno não levou à última pedra ativada");
    t.assert(quantos(j, "cl:pergaminho_retorno") === 0, "o pergaminho não foi gasto");
    t.succeed();
  });
});

// 1.10.0: Robô Minerador: pôr com o item, abastecer com carvão e fazer um túnel de 4 numa parede de pedregulho.
teste("robo", 600, (t) => {
  // Nesta área o chão de pedra fica na altura 1: o robô anda na altura 2.
  for (let x = 2; x <= 4; x++) for (let z = 2; z <= 5; z++) for (let y = 2; y <= 3; y++) t.setBlockType("minecraft:cobblestone", { x, y, z });
  const j = robo(t, { x: 3, y: 2, z: 0 });
  t.runAfterDelay(10, () => {
    j.setItem(new ItemStack("cl:robo_minerador", 1), 0, true);
    j.lookAtBlock({ x: 3, y: 1, z: 1 });
    j.useItemInSlotOnBlock(0, { x: 3, y: 1, z: 1 }, Direction.Up);
  });
  t.runAfterDelay(30, () => {
    j.teleport(t.worldLocation({ x: 6.5, y: 2, z: 1.5 }));
    t.setBlockType("minecraft:chest", { x: 3, y: 2, z: 0 });
    const r = t.getDimension().getEntities({ type: "cl:robo_minerador", location: t.worldLocation({ x: 3.5, y: 2, z: 1.5 }), maxDistance: 3 })[0];
    if (!r) return t.fail("o robô não apareceu");
  });
  // O jogador simulado não dispara o toque em entidade (abastecer): o comando de teste põe 160 (2 carvões).
  t.runAfterDelay(50, () => j.runCommand("scriptevent cl:teste_robo tunel 4 160"));
  t.runAfterDelay(560, () => {
    let ar = 0;
    for (let x = 2; x <= 4; x++) for (let z = 2; z <= 5; z++) for (let y = 2; y <= 3; y++) if (t.getBlock({ x, y, z }).isAir) ar++;
    const c = t.getBlock({ x: 3, y: 2, z: 0 }).getComponent("inventory").container;
    let pedras = 0;
    for (let s = 0; s < c.size; s++) if (c.getItem(s)?.typeId === "minecraft:cobblestone") pedras += c.getItem(s).amount;
    const r = t.getDimension().getEntities({ type: "cl:robo_minerador", location: t.worldLocation({ x: 3.5, y: 2, z: 1.5 }), maxDistance: 2 }).length;
    log(`robo: blocos cavados=${ar}/24 pedregulho no baú=${pedras} robô de volta=${r}`);
    t.assert(ar === 24, "o túnel não ficou aberto");
    t.assert(pedras >= 20, "o robô não despejou o pedregulho no baú de trás");
    t.assert(r === 1, "o robô não voltou ao ponto de partida");
    t.succeed();
  });
});

// 1.10.0: Mochila: usar o item põe a mochila no chão; bater nela guarda tudo de volta no item (e usar de novo devolve).
teste("mochila", 300, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const achar = () => t.getDimension().getEntities({ type: "cl:mochila", location: j.location, maxDistance: 4 })[0];
  t.runAfterDelay(10, () => {
    j.setItem(new ItemStack("cl:mochila", 1), 0, true);
    j.useItemInSlot(0);
  });
  t.runAfterDelay(30, () => {
    const m = achar();
    if (!m) return t.fail("a mochila não apareceu no chão");
    m.getComponent("inventory").container.setItem(4, new ItemStack("minecraft:diamond", 5));
    j.attackEntity(m);
  });
  t.runAfterDelay(60, () => {
    const inv = j.getComponent("inventory").container;
    let lore = "";
    for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === "cl:mochila") lore = inv.getItem(s).getLore().join("|");
    log(`mochila: guardada=${quantos(j, "cl:mochila")} lore=${lore} no chão=${!!achar()}`);
    t.assert(quantos(j, "cl:mochila") === 1 && !achar(), "bater não guardou a mochila");
    j.selectedSlotIndex = 0;
    for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === "cl:mochila" && s !== 0) inv.moveItem(s, 0, inv);
    j.useItemInSlot(0);
  });
  t.runAfterDelay(90, () => {
    const m = achar();
    const d = m?.getComponent("inventory").container.getItem(4);
    log(`mochila: de novo no chão=${!!m} diamantes=${d?.amount ?? 0}`);
    t.assert(d?.typeId === "minecraft:diamond" && d.amount === 5, "o que estava na mochila se perdeu");
    t.succeed();
  });
});

// 1.10.0: Extra Utilities: Lixeira apaga itens jogados, Varinha copia a camada, Regador molha a terra, Bloco Angelical no ar.
teste("extrautils", 300, (t) => {
  t.setBlockType("cl:lixeira", { x: 1, y: 1, z: 1 });
  t.spawnItem(new ItemStack("minecraft:dirt", 8), { x: 1.5, y: 2.2, z: 1.5 });
  for (let x = 3; x <= 5; x++) t.setBlockType("minecraft:cobblestone", { x, y: 1, z: 1 });
  t.setBlockType("minecraft:farmland", { x: 3, y: 1, z: 5 });
  t.setBlockType("minecraft:wheat", { x: 3, y: 2, z: 5 });
  const j = robo(t, { x: 4, y: 1, z: 3 });
  t.runAfterDelay(10, () => {
    j.setItem(new ItemStack("minecraft:cobblestone", 9), 1, false);
    j.setItem(new ItemStack("cl:varinha_construtor", 1), 0, true);
    j.lookAtBlock({ x: 4, y: 1, z: 1 });
    j.useItemInSlotOnBlock(0, { x: 4, y: 1, z: 1 }, Direction.Up);
  });
  t.runAfterDelay(30, () => {
    j.setItem(new ItemStack("cl:regador", 1), 0, true);
    j.lookAtBlock({ x: 3, y: 2, z: 5 });
    j.useItemInSlotOnBlock(0, { x: 3, y: 2, z: 5 }, Direction.Up);
  });
  t.runAfterDelay(50, () => {
    j.setItem(new ItemStack("cl:bloco_angelical", 1), 0, true);
    j.lookAtLocation(t.worldLocation({ x: 4, y: 4, z: 6 }));
    log(`extrautils: usou o bloco angelical=${j.useItemInSlot(0)}`);
  });
  t.runAfterDelay(80, () => {
    let cima = 0;
    for (let x = 3; x <= 5; x++) if (t.getBlock({ x, y: 2, z: 1 }).typeId === "minecraft:cobblestone") cima++;
    const terra = t.getBlock({ x: 3, y: 1, z: 5 }).permutation.getState("moisturized_amount");
    const itens = t.getDimension().getEntities({ type: "minecraft:item", location: t.worldLocation({ x: 1.5, y: 2, z: 1.5 }), maxDistance: 2 }).length;
    const anjos = t.getDimension().getBlocks(new BlockVolume(t.worldBlockLocation({ x: 0, y: 1, z: 0 }), t.worldBlockLocation({ x: 7, y: 5, z: 7 })), { includeTypes: ["cl:bloco_angelical"] }, true).getCapacity();
    log(`extrautils: varinha=${cima}/3 pedregulho sobrando=${quantos(j, "minecraft:cobblestone")} terra molhada=${terra} itens na lixeira=${itens} bloco angelical=${anjos}`);
    t.assert(cima === 3, "a Varinha do Construtor não copiou a camada");
    t.assert(quantos(j, "minecraft:cobblestone") === 6, "a Varinha não gastou os blocos");
    t.assert(terra === 7, "o Regador não molhou a terra");
    t.assert(itens === 0, "a Lixeira não apagou o item");
    t.assert(anjos === 1, "o Bloco Angelical não ficou no ar");
    t.succeed();
  });
});

// 1.10.0: redemoinho de poeira (Weather2) em cima do robô: ele é jogado para o alto.
teste("redemoinho", 200, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  let y0 = 0, maior = 0;
  t.runAfterDelay(10, () => {
    y0 = j.location.y;
    j.runCommand("scriptevent cl:teste_redemoinho");
  });
  const id = system.runInterval(() => { if (y0) maior = Math.max(maior, j.location.y - y0); }, 1);
  t.runAfterDelay(120, () => {
    system.clearRun(id);
    log(`redemoinho: subiu ${maior.toFixed(2)} blocos`);
    t.assert(maior > 0.5, "o redemoinho não levantou o robô");
    t.succeed();
  });
});

// 1.11.0: Conduto de Itens (tocar põe no modo "tira"; leva do baú A ao baú B) e Balão (cai devagar).
teste("additions", 200, (t) => {
  t.setBlockType("minecraft:chest", { x: 1, y: 2, z: 1 });
  t.setBlockType("cl:conduto_item", { x: 2, y: 2, z: 1 });
  t.setBlockType("cl:conduto_item", { x: 3, y: 2, z: 1 });
  t.setBlockType("minecraft:chest", { x: 4, y: 2, z: 1 });
  t.setBlockType("cl:plastico_vermelho", { x: 1, y: 2, z: 4 });
  t.getBlock({ x: 1, y: 2, z: 1 }).getComponent("inventory").container.addItem(new ItemStack("minecraft:cobblestone", 8));
  const j = robo(t, { x: 2, y: 2, z: 3 });
  t.runAfterDelay(10, () => j.interactWithBlock({ x: 2, y: 2, z: 1 }, Direction.South));
  t.runAfterDelay(20, () => {
    j.setItem(new ItemStack("cl:balao_azul", 1), 0, true);
    j.useItemInSlot(0);
  });
  t.runAfterDelay(120, () => {
    const c = t.getBlock({ x: 4, y: 2, z: 1 }).getComponent("inventory").container;
    let n = 0;
    for (let s = 0; s < c.size; s++) if (c.getItem(s)?.typeId === "minecraft:cobblestone") n += c.getItem(s).amount;
    const balao = t.getDimension().getEntities({ type: "cl:balao", location: j.location, maxDistance: 4 }).length;
    const cai = !!j.getEffect("slow_falling");
    log(`additions: itens movidos=${n} extrai=${t.getBlock({ x: 2, y: 2, z: 1 }).permutation.getState("cl:extrai")} balão=${balao} queda lenta=${cai} plástico=${t.getBlock({ x: 1, y: 2, z: 4 }).typeId}`);
    t.assert(n >= 4, "o Conduto de Itens não levou os itens");
    t.assert(balao === 1 && cai, "o balão não ficou preso no robô");
    t.succeed();
  });
});

// 1.12.0: Panela (2 tomates no magma = molho), Tábua (repolho + faca), colheita com toque e Picarango.
teste("farmers", 400, (t) => {
  t.setBlockType("minecraft:magma", { x: 2, y: 1, z: 2 });
  t.setBlockType("cl:panela_cozinha", { x: 2, y: 2, z: 2 });
  t.setBlockType("cl:tabua_cortar", { x: 5, y: 2, z: 2 });
  t.setBlockType("minecraft:farmland", { x: 2, y: 1, z: 5 });
  t.setBlockPermutation(BlockPermutation.resolve("minecraft:wheat", { growth: 7 }), { x: 2, y: 2, z: 5 });
  t.setBlockType("minecraft:cobblestone", { x: 6, y: 3, z: 6 });
  const j = robo(t, { x: 3, y: 2, z: 3 });
  const usar = (item, n, pos, face) => {
    j.setItem(new ItemStack(item, n), 0, true);
    j.interactWithBlock(pos, face);
  };
  t.runAfterDelay(10, () => usar("cl:tomate", 1, { x: 2, y: 2, z: 2 }, Direction.Up));
  t.runAfterDelay(20, () => usar("cl:tomate", 1, { x: 2, y: 2, z: 2 }, Direction.Up));
  t.runAfterDelay(30, () => usar("cl:repolho", 1, { x: 5, y: 2, z: 2 }, Direction.Up));
  t.runAfterDelay(40, () => usar("cl:faca_ferro", 1, { x: 5, y: 2, z: 2 }, Direction.Up));
  t.runAfterDelay(50, () => {
    j.setItem(new ItemStack("minecraft:wheat_seeds", 1), 0, true);
    j.lookAtBlock({ x: 2, y: 2, z: 5 });
    j.useItemInSlotOnBlock(0, { x: 2, y: 2, z: 5 }, Direction.Up);
  });
  t.runAfterDelay(70, () => {
    j.setItem(new ItemStack("cl:picarango", 1), 1, true);
    j.lookAtBlock({ x: 6, y: 3, z: 6 });
  });
  t.runAfterDelay(75, () => j.useItemInSlot(1));
  t.runAfterDelay(200, () => usar("minecraft:bowl", 1, { x: 2, y: 2, z: 2 }, Direction.Up));
  t.runAfterDelay(240, () => {
    const folhas = t.getDimension().getEntities({ type: "minecraft:item", location: t.worldLocation({ x: 5.5, y: 2.5, z: 2.5 }), maxDistance: 3 }).filter((e) => e.getComponent("item").itemStack.typeId === "cl:folha_repolho").length + quantos(j, "cl:folha_repolho");
    const trigo = t.getBlock({ x: 2, y: 2, z: 5 });
    log(`farmers: molho=${quantos(j, "cl:molho_tomate")} folhas=${folhas} trigo=${trigo.typeId} crescimento=${trigo.permutation.getState("growth")} pedra=${t.getBlock({ x: 6, y: 3, z: 6 }).typeId} picarango=${quantos(j, "cl:picarango")}`);
    t.assert(quantos(j, "cl:molho_tomate") === 1, "a Panela não fez o molho de tomate");
    t.assert(folhas >= 1, "a Tábua não cortou o repolho");
    t.assert(trigo.typeId === "minecraft:wheat" && trigo.permutation.getState("growth") === 0, "a colheita com toque não replantou");
    t.assert(t.getBlock({ x: 6, y: 3, z: 6 }).isAir && quantos(j, "cl:picarango") === 1, "o Picarango não quebrou o bloco ou não voltou");
    t.succeed();
  });
});

// Quais causas de dano o jogo aplica de verdade num jogador fora de bloco/água.
teste("danos", 100, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const r = {};
  for (const c of ["suffocation", "drowning", "temperature", "freezing", "starve", "fire", "magic"]) r[c] = j.applyDamage(1, { cause: c });
  log(`danos: ${JSON.stringify(r)}`);
  t.succeed();
});

// Depuração: o que chega dos eventos de interação e de quebra.
world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`tocou na entidade: ${ev.target.typeId} com ${ev.itemStack?.typeId ?? "mão"}`);
});
world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`tocou (depois) na entidade: ${ev.target.typeId} com ${ev.itemStack?.typeId ?? "mão"}`);
});
world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.source.name === "Robo") log(`usou: ${ev.itemStack.typeId}`);
});
world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`interagiu: ${ev.itemStack?.typeId ?? "mão"} em ${ev.block.typeId} primeiro=${ev.isFirstEvent}`);
});
world.afterEvents.entityDie.subscribe((ev) => { if (ev.deadEntity.typeId === "cl:esqueleto_chefe") log(`morreu: ${ev.deadEntity.typeId} causa=${ev.damageSource.cause}`); });
world.afterEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`quebrou: ${ev.brokenBlockPermutation.type.id} modo=${ev.player.getGameMode()}`);
});
system.run(() => log("pacote de testes carregado"));

// 1.13.0: Forno de Coque montado com o Martelo, Moinho de Vento num Dínamo e as aeronaves (o voo é pelo scriptevent,
// porque o jogador simulado não monta).
teste("immersive", 2200, (t) => {
  let giroPas = 0;
  for (let x = 1; x <= 3; x++) for (let y = 1; y <= 3; y++) for (let z = 1; z <= 3; z++) t.setBlockType("cl:tijolo_coque", { x, y, z });
  t.setBlockType("cl:dinamo_cinetico", { x: 6, y: 6, z: 7 });
  t.setBlockType("cl:moinho_vento", { x: 6, y: 6, z: 6 });
  const j = robo(t, { x: 5, y: 1, z: 2 });
  const usar = (item, n, pos, face) => {
    j.setItem(new ItemStack(item, n), 0, true);
    j.interactWithBlock(pos, face);
  };
  t.runAfterDelay(5, () => {
    j.setItem(new ItemStack("cl:martelo_engenheiro", 1), 0, true);
    j.lookAtBlock({ x: 3, y: 2, z: 2 });
  });
  t.runAfterDelay(12, () => j.useItemInSlotOnBlock(0, { x: 3, y: 2, z: 2 }, Direction.East));
  t.runAfterDelay(20, () => {
    log(`immersive: boca=${t.getBlock({ x: 3, y: 2, z: 2 }).typeId}`);
    usar("minecraft:coal", 1, { x: 3, y: 2, z: 2 }, Direction.East);
  });
  t.runAfterDelay(30, () => {
    log(`immersive: carvão na mão depois de pôr=${quantos(j, "minecraft:coal")}`);
    j.setItem(new ItemStack("cl:girocoptero", 1), 1, true);
    j.setItem(new ItemStack("cl:quadricoptero", 1), 2, true);
    j.lookAtBlock({ x: 5, y: 0, z: 5 });
  });
  t.runAfterDelay(40, () => j.useItemInSlotOnBlock(1, { x: 5, y: 0, z: 5 }, Direction.Up));
  t.runAfterDelay(45, () => j.lookAtBlock({ x: 1, y: 0, z: 6 }));
  t.runAfterDelay(55, () => j.useItemInSlotOnBlock(2, { x: 1, y: 0, z: 6 }, Direction.Up));
  t.runAfterDelay(60, () => {
    const n = t.getDimension().getEntities({ families: ["aeronave"], location: j.location, maxDistance: 10 }).length;
    log(`immersive: aeronaves postas=${n}`);
    j.runCommand("scriptevent cl:teste_aeronave girocoptero 200");
  });
  t.runAfterDelay(280, () => j.runCommand("scriptevent cl:teste_aeronave quadricoptero 120 8"));
  t.runAfterDelay(250, () => {
    const pas = t.getDimension().getEntities({ type: "cl:pas_moinho", location: t.worldLocation({ x: 6.5, y: 6.5, z: 6.5 }), maxDistance: 2 })[0];
    const ocupados = [];
    for (let h = -4; h <= 4; h++) for (let w = -4; w <= 4; w++) {
      const b = t.getBlock({ x: 6 + w, y: 6 + h, z: 6 });
      if ((h || w) && b && !b.isAir) ocupados.push(`${w},${h}:${b.typeId}`);
    }
    giroPas = pas?.getProperty("cl:giro") ?? 0;
    log(`immersive: pás=${!!pas} giro=${pas?.getProperty("cl:giro")} disco=${ocupados.slice(0, 8).join(" ")}`);
  });
  t.runAfterDelay(1960, () => j.getComponent("inventory").container.setItem(0, undefined));
  t.runAfterDelay(1970, () => j.interactWithBlock({ x: 3, y: 2, z: 2 }, Direction.East));
  t.runAfterDelay(1990, () => {
    log(`immersive: coque=${quantos(j, "cl:coque")}`);
    t.assert(t.getBlock({ x: 3, y: 2, z: 2 }).typeId === "cl:forno_coque", "o Martelo não montou o Forno de Coque");
    t.assert(quantos(j, "cl:coque") === 1, "o Forno de Coque não fez coque");
    t.assert(giroPas > 0, "o Moinho de Vento não girou");
    t.succeed();
  });
});

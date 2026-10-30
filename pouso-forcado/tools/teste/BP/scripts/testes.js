// Testes com jogador simulado (GameTest) para o servidor Bedrock. Não vão no add-on.
// Rodar no console do servidor (tools/testar-servidor.mjs explica):
//   execute positioned <x> 46 <z> run gametest run pouso:<nome>
// Cada teste usa a estrutura pouso:vazio (8x6x8, chão de pedra em y 0). Coordenadas relativas a ela.
import { BlockPermutation, Direction, GameMode, ItemStack, system, world } from "@minecraft/server";
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

// Quais causas de dano o jogo aplica de verdade num jogador fora de bloco/água.
teste("danos", 100, (t) => {
  const j = robo(t, { x: 3, y: 1, z: 3 });
  const r = {};
  for (const c of ["suffocation", "drowning", "temperature", "freezing", "starve", "fire", "magic"]) r[c] = j.applyDamage(1, { cause: c });
  log(`danos: ${JSON.stringify(r)}`);
  t.succeed();
});

// Depuração: o que chega dos eventos de interação e de quebra.
world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`interagiu: ${ev.itemStack?.typeId ?? "mão"} em ${ev.block.typeId} primeiro=${ev.isFirstEvent}`);
});
world.afterEvents.entityDie.subscribe((ev) => { if (ev.deadEntity.typeId === "cl:esqueleto_chefe") log(`morreu: ${ev.deadEntity.typeId} causa=${ev.damageSource.cause}`); });
world.afterEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`quebrou: ${ev.brokenBlockPermutation.type.id} modo=${ev.player.getGameMode()}`);
});
system.run(() => log("pacote de testes carregado"));

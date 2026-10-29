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

// Depuração: o que chega dos eventos de interação e de quebra.
world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`interagiu: ${ev.itemStack?.typeId ?? "mão"} em ${ev.block.typeId} primeiro=${ev.isFirstEvent}`);
});
world.afterEvents.playerBreakBlock.subscribe((ev) => {
  if (ev.player.name === "Robo") log(`quebrou: ${ev.brokenBlockPermutation.type.id} modo=${ev.player.getGameMode()}`);
});
system.run(() => log("pacote de testes carregado"));

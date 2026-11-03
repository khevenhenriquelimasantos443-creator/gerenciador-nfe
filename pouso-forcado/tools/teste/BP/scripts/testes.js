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
          if (b.typeId === "minecraft:chest") {
            const c = b.getComponent("inventory").container;
            const itens = [];
            for (let k = 0; k < c.size; k++) if (c.getItem(k)) itens.push(`${c.getItem(k).typeId.replace("minecraft:", "")}×${c.getItem(k).amount}`);
            achados.bau.push(`${x - p0.x},${y - p0.y},${z - p0.z} ${itens.join(" ")}`);
          }
          if (b.typeId === "minecraft:spruce_door") achados.portas++;
        }
    log(`avião: ${JSON.stringify(achados)}`);
    t.assert(achados.painel.length === 1, "painel da nave");
    t.assert(achados.bau.length === 1, "baú de suprimentos");
    t.assert(achados.portas === 6, `portas: ${achados.portas} metades (esperava 6)`);
    t.succeed();
  });
});

// 1.16.0: ferramenta do Minecraft na mão dá Cansaço e cada bloco gasta 8; o subsolo do mundo plano novo é arenito.
teste("vanilla", 400, (t) => {
  const j = robo(t, { x: 1.5, y: 1, z: 1.5 });
  j.getComponent("minecraft:inventory").container.setItem(0, new ItemStack("minecraft:iron_pickaxe", 1));
  j.selectedSlotIndex = 0;
  t.setBlockType("minecraft:sandstone", { x: 3, y: 1, z: 1 });
  const dim = world.getDimension("overworld");
  const p = t.worldBlockLocation({ x: 0, y: 0, z: 0 });
  const camadas = [-60, -20, 0, 20, 39, 40, 44].map((y) => `${y}:${dim.getBlock({ x: p.x - 20, y, z: p.z - 20 })?.typeId.replace("minecraft:", "")}`);
  log(`vanilla: camadas ${camadas.join(" ")}`);
  t.runAfterDelay(30, () => {
    const ef = j.getEffect("mining_fatigue");
    log(`vanilla: cansaço=${ef ? `${ef.amplifier}/${ef.duration}` : "nenhum"}`);
    t.assert(!!ef, "sem cansaço com a picareta de ferro");
    j.lookAtBlock({ x: 3, y: 1, z: 1 });
    j.breakBlock({ x: 3, y: 1, z: 1 }, Direction.North);
  });
  t.runAfterDelay(300, () => {
    const i = j.getComponent("minecraft:inventory").container.getItem(0);
    const d = i?.getComponent("minecraft:durability");
    log(`vanilla: bloco=${t.getBlock({ x: 3, y: 1, z: 1 }).typeId} dano=${d?.damage}/${d?.maxDurability}`);
    t.assert(t.getBlock({ x: 3, y: 1, z: 1 }).isAir, "não quebrou o arenito");
    t.assert(d && d.damage >= 8, "não gastou 8");
    t.succeed();
  });
});

// Medição de desempenho: 3 jogadores parados por ~6 min; o relatório sai com /scriptevent cl:teste_perfil.
teste("perfil", 7400, (t) => {
  const js = [robo(t, { x: 1.5, y: 1, z: 1.5 }), robo(t, { x: 5.5, y: 1, z: 1.5 }), robo(t, { x: 3.5, y: 1, z: 5.5 })];
  t.runAfterDelay(7300, () => {
    log(`perfil: ${js.length} jogadores`);
    t.succeed();
  });
});

// 1.17.0: testado que a geração natural (feature rules) não roda na dimensão da Lua (gerador vazio, bioma ocean).

// 1.18.0: Powah! — Furnator queima carvão do baú, a energia vai pelo cabo para a célula, e a haste leva para o Orbe,
// que faz Aço Energizado de ferro e ouro.
teste("powah", 700, (t) => {
  const j = robo(t, { x: 4.5, y: 1, z: 5.5 });
  t.setBlockType("cl:furnator_nitro", { x: 1, y: 1, z: 1 });
  t.setBlockType("minecraft:chest", { x: 1, y: 2, z: 1 });
  t.getBlock({ x: 1, y: 2, z: 1 }).getComponent("inventory").container.addItem(new ItemStack("minecraft:coal", 16));
  t.setBlockType("cl:cabo_powah_nitro", { x: 2, y: 1, z: 1 });
  t.setBlockType("cl:celula_powah_basico", { x: 3, y: 1, z: 1 });
  t.setBlockType("cl:cabo_powah_nitro", { x: 4, y: 1, z: 1 });
  t.setBlockType("cl:haste_energizadora_basico", { x: 4, y: 1, z: 2 });
  t.setBlockType("cl:orbe_energizador", { x: 4, y: 1, z: 4 });
  const inv = j.getComponent("minecraft:inventory").container;
  ["minecraft:iron_ingot", "minecraft:gold_ingot"].forEach((id, k) => {
    t.runAfterDelay(10 + k * 10, () => {
      inv.setItem(0, new ItemStack(id, 1));
      j.selectedSlotIndex = 0;
      j.lookAtBlock({ x: 4, y: 1, z: 4 });
      log(`powah: tocou o orbe com ${id}: ${j.interactWithBlock({ x: 4, y: 1, z: 4 }, Direction.North)}`);
    });
  });
  t.runAfterDelay(600, () => {
    const carvao = noBau(bau(t, { x: 1, y: 2, z: 1 }), "minecraft:coal");
    inv.setItem(0, undefined);
    j.lookAtBlock({ x: 4, y: 1, z: 4 });
    log(`powah: tocou o orbe de mão vazia: ${j.interactWithBlock({ x: 4, y: 1, z: 4 }, Direction.North)}`);
    t.runAfterDelay(5, () => {
      const aco = quantos(j, "cl:aco_energizado");
      log(`powah: carvão no baú=${carvao}/16 aço energizado=${aco}`);
      t.assert(carvao < 16, "o Furnator não queimou");
      t.assert(aco === 2, "o Orbe não fez o aço");
      t.succeed();
    });
  });
});

// 1.19.0: Reator do Powah! montado pelo robô (36 blocos), com uraninita e água; o Funil carrega uma bateria na rede.
teste("powah_reator", 700, (t) => {
  const j = robo(t, { x: 2.5, y: 2, z: 5.5 });
  const inv = j.getComponent("minecraft:inventory").container;
  t.setBlockType("cl:cabo_powah_basico", { x: 4, y: 2, z: 2 });
  t.setBlockType("cl:celula_powah_basico", { x: 5, y: 2, z: 2 });
  t.setBlockType("cl:cabo_powah_basico", { x: 5, y: 3, z: 2 });
  t.setBlockType("cl:funil_energia_basico", { x: 6, y: 3, z: 2 });
  t.setBlockType("minecraft:chest", { x: 6, y: 2, z: 2 });
  bau(t, { x: 6, y: 2, z: 2 }).addItem(new ItemStack("cl:bateria_pw_inicial", 1));
  // O núcleo posto direto; tocar nele com 35 Reatores no inventário monta o resto (como pôr o bloco à mão).
  t.setBlockType("cl:reator_basico", { x: 2, y: 2, z: 2 });
  t.runAfterDelay(5, () => {
    inv.setItem(1, new ItemStack("cl:reator_basico", 35));
    inv.setItem(0, undefined);
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 2, y: 2, z: 2 });
    j.interactWithBlock({ x: 2, y: 2, z: 2 }, Direction.North);
  });
  ["cl:uraninita", "cl:uraninita", "cl:uraninita", "cl:uraninita", "minecraft:water_bucket"].forEach((id, k) => t.runAfterDelay(20 + k * 5, () => {
    inv.setItem(0, new ItemStack(id, 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 2, y: 2, z: 2 });
    j.interactWithBlock({ x: 2, y: 2, z: 2 }, Direction.North);
  }));
  t.runAfterDelay(650, () => {
    let partes = 0;
    for (let x = 1; x <= 3; x++) for (let y = 2; y <= 5; y++) for (let z = 1; z <= 3; z++) if (t.getBlock({ x, y, z }).typeId === "cl:reator_basico") partes++;
    const c = bau(t, { x: 6, y: 2, z: 2 });
    let b;
    for (let k = 0; k < c.size; k++) if (c.getItem(k)) b = c.getItem(k);
    log(`powah_reator: baú ${t.getBlock({ x: 6, y: 2, z: 2 }).typeId} funil ${t.getBlock({ x: 6, y: 3, z: 2 }).typeId} item ${b?.typeId}`);
    log(`powah_reator: blocos do reator=${partes} sobraram no inventário=${quantos(j, "cl:reator_basico")} bateria=${JSON.stringify(b?.getLore())}`);
    t.assert(partes === 36, "o reator não montou");
    t.assert(!!(b && b.getLore()[0] && !b.getLore()[0].startsWith("§70 RF")), "a bateria não carregou");
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
    // 1.17.0: o céu com os planetas acompanha o jogador; os evoluídos novos nascem na Lua.
    const ceu = lua.getEntities({ type: "cl:ceu_lua" });
    const novos = ["cl:enderman_evoluido", "cl:bruxa_evoluida"].map((id) => {
      try {
        const e = lua.spawnEntity(id, { x: j.location.x + 3, y: j.location.y + 1, z: j.location.z });
        return `${id}=${e.isValid}`;
      } catch (err) {
        return `${id}=erro ${err}`;
      }
    });
    log(`lua: céu=${ceu.length} a ${ceu[0] ? Math.hypot(ceu[0].location.x - j.location.x, ceu[0].location.z - j.location.z).toFixed(1) : "-"} blocos; novos: ${novos.join(" ")}`);
    t.assert(ceu.length === 1, "sem o céu da Lua");
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

// 1.20.0: Ender IO 9. Fundição (Almário), Triturador com esfera, Fatiar e Emendar, Crisol (Hootch), Frasco de Alma
// num zumbi, Motor de Almas com a alma do zumbi, Tanque, Estação Agrícola e o fogo na rocha matriz (Grãos do Infinito).
teste("enderio9", 760, (t) => {
  const j = robo(t, { x: 3.5, y: 1, z: 2.5 });
  const inv = j.getComponent("minecraft:inventory").container;
  const bat = (pos, carga) => {
    t.setBlockType("cl:bateria", pos);
    const b = t.getBlock(pos);
    b.setPermutation(b.permutation.withState("cl:carga", carga));
  };
  const maquina = (x, z, id, itens) => {
    t.setBlockType("minecraft:chest", { x, y: 1, z });
    t.setBlockType(id, { x, y: 2, z });
    t.setBlockType("minecraft:chest", { x, y: 3, z });
    for (const [i, n] of itens) bau(t, { x, y: 3, z }).addItem(new ItemStack(i, n));
  };
  maquina(1, 1, "cl:fundidora_ligas", [["minecraft:soul_sand", 1], ["minecraft:gold_ingot", 1]]);
  maquina(3, 1, "cl:moinho_sag", [["minecraft:iron_ore", 1], ["cl:esfera_aco_negro", 1]]);
  maquina(5, 1, "cl:fatiar_emendar", [["cl:almario", 2], ["minecraft:zombie_head", 1], ["cl:silicio", 2], ["minecraft:redstone", 1]]);
  bat({ x: 2, y: 2, z: 1 }, 15);
  bat({ x: 4, y: 2, z: 1 }, 15);
  // Balde não empilha: 4 baldes de água em 4 entradas.
  maquina(1, 4, "cl:crisol_fermentacao", [["minecraft:water_bucket", 1], ["minecraft:water_bucket", 1], ["minecraft:water_bucket", 1], ["minecraft:water_bucket", 1],
    ["minecraft:wheat_seeds", 4], ["minecraft:wheat", 4], ["minecraft:bucket", 1]]);
  maquina(3, 4, "cl:motor_almas", [["cl:balde_destilado_nutrientes", 1]]);
  bat({ x: 4, y: 2, z: 4 }, 0);
  t.setBlockType("cl:tanque_fluido", { x: 5, y: 1, z: 3 });
  // Estação Agrícola: trigo maduro em terra arada do lado, no mesmo nível.
  maquina(6, 6, "cl:estacao_agricola", []);
  bat({ x: 7, y: 2, z: 6 }, 15);
  t.setBlockType("minecraft:farmland", { x: 5, y: 1, z: 6 });
  t.setBlockPermutation(BlockPermutation.resolve("minecraft:wheat", { growth: 7 }), { x: 5, y: 2, z: 6 });
  // Fogo em rocha matriz: 80% de chance de 1 a 3 grãos em cada uma.
  const rochas = [{ x: 1, y: 1, z: 6 }, { x: 2, y: 1, z: 6 }, { x: 3, y: 1, z: 6 }];
  for (const r of rochas) t.setBlockType("minecraft:bedrock", r);
  rochas.forEach((r, k) => t.runAfterDelay([5, 70, 90][k], () => {
    inv.setItem(0, new ItemStack("minecraft:flint_and_steel", 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock(r);
    log(`enderio9: fogo na rocha ${k}: ${j.useItemInSlotOnBlock(0, r, Direction.Up)}`);
  }));
  // Frasco de Alma num zumbi; depois a alma vai para o Motor de Almas. De noite: o pack tira os monstros que nascem de dia.
  world.getDimension("overworld").runCommand("time set 18000");
  const zumbi = t.spawn("minecraft:zombie", { x: 6, y: 1, z: 2 });
  t.runAfterDelay(20, () => {
    inv.setItem(0, new ItemStack("cl:frasco_alma", 1));
    j.selectedSlotIndex = 0;
    j.lookAtEntity(zumbi);
    // No celular, tocar num monstro bate nele: o frasco pega a alma com a batida.
    log(`enderio9: frasco no zumbi: ${j.attackEntity(zumbi)}`);
  });
  t.runAfterDelay(30, () => {
    let slot = -1;
    for (let s = 0; s < inv.size; s++) if (inv.getItem(s)?.typeId === "cl:frasco_alma_cheio") slot = s;
    log(`enderio9: frasco cheio no slot ${slot}`);
    if (slot < 0) return;
    inv.swapItems(slot, 0, inv);
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 3, y: 2, z: 4 });
    log(`enderio9: frasco no motor: ${j.interactWithBlock({ x: 3, y: 2, z: 4 }, Direction.North)}`);
  });
  // Tanque: balde de água entra, balde vazio tira de volta.
  t.runAfterDelay(40, () => {
    inv.setItem(0, new ItemStack("minecraft:water_bucket", 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 5, y: 1, z: 3 });
    j.interactWithBlock({ x: 5, y: 1, z: 3 }, Direction.North);
  });
  t.runAfterDelay(50, () => {
    const vazio = quantos(j, "minecraft:bucket");
    inv.setItem(0, new ItemStack("minecraft:bucket", 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 5, y: 1, z: 3 });
    j.interactWithBlock({ x: 5, y: 1, z: 3 }, Direction.North);
    log(`enderio9: baldes vazios depois de pôr a água no tanque: ${vazio}`);
  });
  let aguaDeVolta = 0;
  t.runAfterDelay(60, () => (aguaDeVolta = quantos(j, "minecraft:water_bucket")));
  t.runAfterDelay(720, () => {
    const dim = t.getDimension();
    const graos = dim.getEntities({ type: "minecraft:item", location: t.worldLocation({ x: 2, y: 2, z: 6 }), maxDistance: 4 })
      .map((e) => e.getComponent("minecraft:item").itemStack).filter((p) => p.typeId === "cl:graos_infinito").reduce((n, p) => n + p.amount, 0);
    const r = {
      almario: noBau(bau(t, { x: 1, y: 1, z: 1 }), "cl:almario"),
      ferroBruto: noBau(bau(t, { x: 3, y: 1, z: 1 }), "minecraft:raw_iron"),
      zLogic: noBau(bau(t, { x: 5, y: 1, z: 1 }), "cl:controlador_logico_z"),
      hootch: noBau(bau(t, { x: 1, y: 1, z: 4 }), "cl:balde_hootch"),
      motor: t.getBlock({ x: 4, y: 2, z: 4 }).permutation.getState("cl:carga"),
      aguaDeVolta,
      trigo: noBau(bau(t, { x: 6, y: 1, z: 6 }), "minecraft:wheat"),
      graos: graos + quantos(j, "cl:graos_infinito") + noBau(bau(t, { x: 6, y: 1, z: 6 }), "cl:graos_infinito"),
      rochas: rochas.map((r) => t.getBlock(r).typeId + "/" + t.getBlock({ ...r, y: 2 }).typeId).join(" "),
      zumbiSumiu: !zumbi.isValid,
    };
    log(`enderio9: ${JSON.stringify(r)}`);
    t.assert(r.almario >= 1, "a Fundição não fez Almário");
    t.assert(r.ferroBruto >= 1, "o Triturador SAG não moeu o minério");
    t.assert(r.zLogic === 1, "o Fatiar e Emendar não fez o Controlador Lógico Z");
    t.assert(r.hootch >= 1, "o Crisol não fez Hootch");
    t.assert(r.zumbiSumiu, "o Frasco de Alma não pegou o zumbi");
    t.assert(r.motor >= 1, "o Motor de Almas não gerou");
    t.assert(r.aguaDeVolta === 1, "o Tanque não guardou e devolveu a água");
    t.assert(r.trigo >= 1, "a Estação Agrícola não colheu");
    t.assert(r.graos >= 1, "o fogo na rocha matriz não deu Grãos do Infinito");
    t.succeed();
  });
});

// 1.21.0: Mekanism 10. Enriquecimento (minério ×2), Purificação com cilindro de oxigênio (×3 em aglomerados),
// Injeção com cilindro de ácido (×4 em estilhaços), Triturador (aglomerado → pó sujo), Serraria (tora → 6 tábuas),
// Infusor (ósmio + 2 redstone → circuito) e Compressor de Ósmio (glowstone + lingote de ósmio → refinado).
teste("mekanism10", 500, (t) => {
  const bat = (pos) => {
    t.setBlockType("cl:bateria", pos);
    const b = t.getBlock(pos);
    b.setPermutation(b.permutation.withState("cl:carga", 15));
  };
  const maquina = (x, z, id, itens) => {
    t.setBlockType("minecraft:chest", { x, y: 1, z });
    t.setBlockType(id, { x, y: 2, z });
    t.setBlockType("minecraft:chest", { x, y: 3, z });
    for (const [i, n] of itens) bau(t, { x, y: 3, z }).addItem(new ItemStack(i, n));
  };
  maquina(1, 1, "cl:camara_enriquecimento", [["minecraft:iron_ore", 1]]);
  maquina(3, 1, "cl:camara_purificacao", [["minecraft:iron_ore", 1], ["cl:cilindro_oxigenio", 1]]);
  maquina(5, 1, "cl:camara_injecao", [["minecraft:iron_ore", 1], ["cl:cilindro_acido", 1]]);
  bat({ x: 2, y: 2, z: 1 });
  bat({ x: 4, y: 2, z: 1 });
  bat({ x: 6, y: 2, z: 1 });
  maquina(1, 4, "cl:triturador_mk", [["cl:torrao_ferro", 1]]);
  maquina(3, 4, "cl:serraria_precisao", [["minecraft:oak_log", 1]]);
  maquina(5, 4, "cl:infusor_metalurgico", [["cl:lingote_osmio", 1], ["minecraft:redstone", 2]]);
  bat({ x: 2, y: 2, z: 4 });
  bat({ x: 4, y: 2, z: 4 });
  bat({ x: 6, y: 2, z: 4 });
  maquina(1, 6, "cl:compressor_osmio", [["minecraft:glowstone_dust", 1], ["cl:lingote_osmio", 1]]);
  bat({ x: 2, y: 2, z: 6 });
  t.runAfterDelay(460, () => {
    const r = {
      po: noBau(bau(t, { x: 1, y: 1, z: 1 }), "cl:po_ferro"),
      aglomerado: noBau(bau(t, { x: 3, y: 1, z: 1 }), "cl:torrao_ferro"),
      estilhaco: noBau(bau(t, { x: 5, y: 1, z: 1 }), "cl:fragmento_ferro"),
      poSujo: noBau(bau(t, { x: 1, y: 1, z: 4 }), "cl:po_sujo_ferro"),
      tabuas: noBau(bau(t, { x: 3, y: 1, z: 4 }), "minecraft:oak_planks"),
      circuito: noBau(bau(t, { x: 5, y: 1, z: 4 }), "cl:circuito_controle_basico"),
      refinado: noBau(bau(t, { x: 1, y: 1, z: 6 }), "cl:lingote_glowstone_refinado"),
    };
    log(`mekanism10: ${JSON.stringify(r)}`);
    t.assert(r.po === 2, "a Câmara de Enriquecimento não dobrou o minério");
    t.assert(r.aglomerado === 3, "a Purificação não fez 3 aglomerados");
    t.assert(r.estilhaco === 4, "a Injeção não fez 4 estilhaços");
    t.assert(r.poSujo === 1, "o Triturador não fez o pó sujo");
    t.assert(r.tabuas === 6, "a Serraria não fez 6 tábuas");
    t.assert(r.circuito === 1, "o Infusor não fez o circuito");
    t.assert(r.refinado === 1, "o Compressor de Ósmio não fez o lingote refinado");
    t.succeed();
  });
});

// 1.22.0: AE2 de hoje. Inscritor (prensa + ouro = circuito lógico; circuito + redstone + silício impresso = Processador
// Lógico; prensa + bloco de ferro = cópia), Carregador (certus → carregado) e Fluix na água.
teste("ae2", 500, (t) => {
  const bat = (pos) => {
    t.setBlockType("cl:bateria", pos);
    const b = t.getBlock(pos);
    b.setPermutation(b.permutation.withState("cl:carga", 15));
  };
  const maquina = (x, z, id, itens) => {
    t.setBlockType("minecraft:chest", { x, y: 1, z });
    t.setBlockType(id, { x, y: 2, z });
    t.setBlockType("minecraft:chest", { x, y: 3, z });
    for (const [i, n] of itens) bau(t, { x, y: 3, z }).addItem(new ItemStack(i, n));
  };
  maquina(1, 1, "cl:inscritor", [["cl:prensa_logica", 1], ["minecraft:gold_ingot", 1]]);
  maquina(3, 1, "cl:inscritor", [["cl:circuito_logico_impresso", 1], ["minecraft:redstone", 1], ["cl:silicio_impresso", 1]]);
  maquina(5, 1, "cl:inscritor", [["cl:prensa_calculo", 1], ["minecraft:iron_block", 1]]);
  bat({ x: 2, y: 2, z: 1 });
  bat({ x: 4, y: 2, z: 1 });
  bat({ x: 6, y: 2, z: 1 });
  maquina(1, 4, "cl:carregador_ae", [["cl:cristal_certus", 1]]);
  bat({ x: 2, y: 2, z: 4 });
  // Água presa num buraco: os três itens caem nela.
  t.setBlockType("minecraft:water", { x: 5, y: 1, z: 5 });
  t.runAfterDelay(20, () => {
    for (const id of ["cl:cristal_certus_carregado", "minecraft:redstone", "minecraft:quartz"]) t.spawnItem(new ItemStack(id, 1), { x: 5.5, y: 1.5, z: 5.5 });
  });
  t.runAfterDelay(460, () => {
    const fluix = t.getDimension().getEntities({ type: "minecraft:item", location: t.worldLocation({ x: 5.5, y: 1.5, z: 5.5 }), maxDistance: 3 })
      .map((e) => e.getComponent("minecraft:item").itemStack).filter((p) => p.typeId === "cl:cristal_fluix").reduce((n, p) => n + p.amount, 0);
    const r = {
      circuito: noBau(bau(t, { x: 1, y: 1, z: 1 }), "cl:circuito_logico_impresso"),
      prensaFicou: noBau(bau(t, { x: 1, y: 3, z: 1 }), "cl:prensa_logica"),
      processador: noBau(bau(t, { x: 3, y: 1, z: 1 }), "cl:processador_basico"),
      copia: noBau(bau(t, { x: 5, y: 1, z: 1 }), "cl:prensa_calculo"),
      carregado: noBau(bau(t, { x: 1, y: 1, z: 4 }), "cl:cristal_certus_carregado"),
      fluix,
    };
    log(`ae2: ${JSON.stringify(r)}`);
    t.assert(r.circuito === 1 && r.prensaFicou === 1, "o Inscritor não imprimiu o circuito (ou gastou a prensa)");
    t.assert(r.processador === 1, "o Inscritor não fez o Processador Lógico");
    t.assert(r.copia === 1, "o Inscritor não copiou a prensa");
    t.assert(r.carregado === 1, "o Carregador não carregou o certus");
    t.assert(r.fluix === 2, "não virou Fluix na água");
    t.succeed();
  });
});

// 1.24.0: Tinkers 3. A Marreta quebra 3×3 na face mirada; o Machado Largo derruba a árvore inteira.
teste("tinkers3", 200, (t) => {
  const j = robo(t, { x: 4.5, y: 1, z: 1.5 });
  const inv = j.getComponent("minecraft:inventory").container;
  for (let x = 3; x <= 5; x++) for (let y = 2; y <= 4; y++) t.setBlockType("minecraft:stone", { x, y, z: 4 });
  for (let y = 1; y <= 4; y++) t.setBlockType("minecraft:oak_log", { x: 1, y, z: 2 });
  t.runAfterDelay(10, () => {
    inv.setItem(0, new ItemStack("cl:marreta_ferro", 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 4, y: 3, z: 4 });
    log(`tinkers3: marreta: ${j.breakBlock({ x: 4, y: 3, z: 4 }, Direction.North)}`);
  });
  t.runAfterDelay(60, () => {
    inv.setItem(0, new ItemStack("cl:machado_largo_ferro", 1));
    j.selectedSlotIndex = 0;
    j.lookAtBlock({ x: 1, y: 1, z: 2 });
    log(`tinkers3: machado largo: ${j.breakBlock({ x: 1, y: 1, z: 2 }, Direction.East)}`);
  });
  t.runAfterDelay(160, () => {
    let pedra = 0, toras = 0;
    for (let x = 3; x <= 5; x++) for (let y = 2; y <= 4; y++) if (t.getBlock({ x, y, z: 4 }).typeId === "minecraft:stone") pedra++;
    for (let y = 1; y <= 4; y++) if (t.getBlock({ x: 1, y, z: 2 }).typeId === "minecraft:oak_log") toras++;
    log(`tinkers3: pedra que sobrou=${pedra}/9 toras que sobraram=${toras}/4`);
    t.assert(pedra === 0, "a Marreta não quebrou 3×3");
    t.assert(toras === 0, "o Machado Largo não derrubou a árvore");
    t.succeed();
  });
});

world.afterEvents.entityDie.subscribe(({ deadEntity: e, damageSource: d }) => {
  if (e.typeId === "minecraft:player") log(`morreu: ${d.cause} por ${d.damagingEntity?.typeId ?? "-"} em ${Math.round(e.location.x)},${Math.round(e.location.y)},${Math.round(e.location.z)}`);
});
// 1.25.0: Sophisticated Backpacks 3.26 (o toque vai por scriptevent: o jogador simulado não dispara o evento de tocar
// numa entidade). Mochila no chão: tocar com 8 lingotes de cobre sobe para a de Cobre (45);
// agachado e tocando vai para a página 2; o que passa do espaço 45 cai no chão; bater guarda tudo na Mochila de Cobre.
teste("mochila_niveis", 160, (t) => {
  const j = robo(t, { x: 2, y: 1, z: 2 });
  const inv = j.getComponent("inventory").container;
  let m;
  t.runAfterDelay(5, () => {
    inv.setItem(0, new ItemStack("cl:mochila", 1));
    j.selectedSlotIndex = 0;
    j.useItemInSlot(0);
  });
  t.runAfterDelay(20, () => {
    m = t.getDimension().getEntities({ type: "cl:mochila", location: j.location, maxDistance: 4 })[0];
    t.assert(!!m, "a mochila não foi para o chão");
    const c = m.getComponent("inventory").container;
    for (let k = 0; k < 27; k++) c.setItem(k, new ItemStack("minecraft:dirt", 1));
    inv.setItem(1, new ItemStack("minecraft:copper_ingot", 8));
    j.selectedSlotIndex = 1;
    j.runCommand("scriptevent cl:teste_mochila_tocar");
  });
  t.runAfterDelay(35, () => {
    log(`mochila_niveis: cobre que sobrou=${quantos(j, "minecraft:copper_ingot")}`);
    j.selectedSlotIndex = 2;
    j.isSneaking = true;
    j.runCommand("scriptevent cl:teste_mochila_tocar");
  });
  t.runAfterDelay(50, () => {
    j.isSneaking = false;
    const c = m.getComponent("inventory").container;
    let n = 0;
    for (let k = 0; k < c.size; k++) if (c.getItem(k)) n++;
    log(`mochila_niveis: página 2 com ${n} itens`);
    t.assert(n === 0, "não trocou de página");
    c.setItem(5, new ItemStack("minecraft:diamond", 1));
    c.setItem(20, new ItemStack("minecraft:emerald", 1)); // espaço 48 de 45: cai no chão
  });
  t.runAfterDelay(60, () => j.attackEntity(m));
  t.runAfterDelay(80, () => {
    let lore = "nada";
    for (let k = 0; k < inv.size; k++) if (inv.getItem(k)?.typeId === "cl:mochila_cobre") lore = JSON.stringify(inv.getItem(k).getLore());
    const esmeralda = t.getDimension().getEntities({ type: "minecraft:item", location: j.location, maxDistance: 6 }).some((e) => e.getComponent("item")?.itemStack.typeId === "minecraft:emerald");
    log(`mochila_niveis: mochila de cobre ${lore}, esmeralda no chão=${esmeralda || quantos(j, "minecraft:emerald") > 0}`);
    t.assert(quantos(j, "minecraft:copper_ingot") === 0, "não gastou o cobre");
    t.assert(lore.includes("28/45"), "a Mochila de Cobre não guardou as 2 páginas");
    t.assert(esmeralda || quantos(j, "minecraft:emerald") > 0, "o que passou do espaço sumiu");
    t.succeed();
  });
});

// 1.25.0: Mochila de Ferro (2 melhorias) com Fornalha e Reposição: a barra é completada da mochila e o minério bruto vira
// lingote com o carvão de dentro (10 s por item).
teste("mochila_fornalha", 600, (t) => {
  const j = robo(t, { x: 2, y: 1, z: 2 });
  const inv = j.getComponent("inventory").container;
  const lore = () => JSON.stringify(inv.getItem(8)?.getLore() ?? []);
  t.runAfterDelay(3, () => inv.setItem(0, new ItemStack("minecraft:cobblestone", 10)));
  t.runAfterDelay(5, () => j.runCommand("scriptevent cl:teste_mochila fornalha,recarga cl:mochila_ferro"));
  t.runAfterDelay(60, () => log(`mochila_fornalha: depois da reposição pedregulho=${inv.getItem(0)?.amount} mochila=${lore()}`));
  t.runAfterDelay(520, () => {
    log(`mochila_fornalha: mochila=${lore()} pedregulho na barra=${inv.getItem(0)?.amount} vivo=${j.isValid && j.getComponent("health")?.currentValue}`);
    t.assert(inv.getItem(8)?.typeId === "cl:mochila_ferro", "sumiu a mochila");
    t.assert(inv.getItem(0)?.amount === 15, "a Reposição não completou a barra");
    // 2 melhorias + ferro + pão (o pedregulho foi para a barra, o carvão queimou e o minério virou lingote).
    t.assert(lore().includes("4/54"), "a Fornalha não fundiu os 2 minérios");
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

// 1.14.0: o pedaço do templo do YUNG's carrega e só tem blocos conhecidos.
teste("yung", 600, (t) => {
  const dim = t.getDimension();
  const o = { x: 400, y: 10, z: 104 };
  t.runAfterDelay(5, () => {
    world.structureManager.place("cl:templo_yung_0_0_0", dim, o);
    const conta = {};
    for (let x = 0; x < 64; x++) for (let y = 0; y < 63; y++) for (let z = 0; z < 64; z++) {
      const b = dim.getBlock({ x: o.x + x, y: o.y + y, z: o.z + z });
      if (b) conta[b.typeId] = (conta[b.typeId] ?? 0) + 1;
    }
    const top = Object.entries(conta).sort((a, b) => b[1] - a[1]);
    log(`yung: ${top.length} tipos: ${top.slice(0, 40).map(([k, v]) => `${k.replace("minecraft:", "")}=${v}`).join(" ")}`);
    const ruins = top.filter(([k]) => /unknown|info_update|reserved|structure_void/.test(k));
    t.assert(ruins.length === 0, `blocos desconhecidos: ${JSON.stringify(ruins)}`);
    t.succeed();
  });
});

// 1.14.0: melhorias da mochila (compactação avançada, ímã e depósito).
teste("mochila_sb", 400, (t) => {
  const j = robo(t, { x: 2, y: 1, z: 2 });
  const inv = () => j.getComponent("inventory").container;
  const conteudo = () => {
    const i = inv().getItem(8);
    return i ? JSON.stringify(i.getLore()) : "sem mochila";
  };
  t.runAfterDelay(5, () => j.runCommand("scriptevent cl:teste_mochila compactacao_avancada"));
  t.runAfterDelay(50, () => {
    log(`mochila_sb: compactação lore=${conteudo()}`);
    j.runCommand("clear @s cl:mochila");
    j.runCommand("scriptevent cl:teste_mochila ima");
    t.spawnItem(new ItemStack("minecraft:diamond", 3), { x: 4.5, y: 2, z: 2.5 });
  });
  t.runAfterDelay(100, () => {
    log(`mochila_sb: ímã diamantes=${quantos(j, "minecraft:diamond")}`);
    j.runCommand("clear @s cl:mochila");
    j.runCommand("scriptevent cl:teste_mochila deposito");
    t.setBlockType("minecraft:chest", { x: 2, y: 1, z: 4 });
  });
  t.runAfterDelay(110, () => {
    j.selectedSlotIndex = 8;
    j.isSneaking = true;
    j.lookAtBlock({ x: 2, y: 1, z: 4 });
  });
  t.runAfterDelay(120, () => j.useItemInSlotOnBlock(8, { x: 2, y: 1, z: 4 }, Direction.North));
  t.runAfterDelay(140, () => {
    const bau = t.getBlock({ x: 2, y: 1, z: 4 }).getComponent("inventory").container;
    let n = 0;
    for (let s = 0; s < bau.size; s++) n += bau.getItem(s)?.amount ?? 0;
    log(`mochila_sb: baú=${n} mochila=${conteudo()}`);
    t.assert(quantos(j, "minecraft:diamond") === 3, "o ímã não puxou os diamantes");
    t.assert(n >= 18, "o depósito não guardou no baú");
    t.succeed();
  });
});

// 1.15.0: no mundo normal, o jogo põe as raras nos cantos da grade (NATIVO em config.ts) com baú de saque.
teste("nativo", 400, (t) => {
  t.runAfterDelay(200, () => {
    const dim = t.getDimension();
    const r = {};
    for (const [nome, ox, oz, lado] of [["templo", 592, 336, 16], ["destrocos", 1120, 928, 18], ["piramide", 960, 2400, 84], ["brilho", 576, 320, 48]]) {
      const c = {};
      for (let x = ox - 2; x < ox + lado + 2; x += nome === "piramide" ? 3 : 1)
        for (let z = oz - 2; z < oz + lado + 2; z += nome === "piramide" ? 3 : 1) {
          const topo = dim.getTopmostBlock({ x, z });
          if (!topo) { c.descarregado = (c.descarregado ?? 0) + 1; continue; }
          for (let y = topo.y - 50; y <= topo.y; y++) {
            const b = dim.getBlock({ x, y, z });
            if (b && /chest|terracotta|concrete|cut_sandstone|marco|gerador|glowstone/.test(b.typeId)) c[b.typeId.replace("minecraft:", "")] = (c[b.typeId.replace("minecraft:", "")] ?? 0) + 1;
          }
        }
      r[nome] = c;
    }
    log(`nativo: ${JSON.stringify(r)}`);
    t.succeed();
  });
});

// 1.15.0: no mundo normal, o script põe a pirâmide quando alguém chega perto.
teste("piramide_normal", 1400, (t) => {
  const j = robo(t, { x: 2, y: 2, z: 2 });
  t.runAfterDelay(20, () => j.teleport({ x: 1001, y: 120, z: 2441 }));
  t.runAfterDelay(1300, () => {
    const dim = t.getDimension();
    const c = {};
    for (let x = 960; x < 1043; x += 2) for (let z = 2400; z < 2483; z += 2) {
      const topo = dim.getTopmostBlock({ x, z });
      if (!topo) { c.descarregado = (c.descarregado ?? 0) + 1; continue; }
      for (let y = topo.y - 60; y <= topo.y; y++) {
        const b = dim.getBlock({ x, y, z });
        if (b && /chest|terracotta|cut_sandstone|mob_spawner/.test(b.typeId)) c[b.typeId.replace("minecraft:", "")] = (c[b.typeId.replace("minecraft:", "")] ?? 0) + 1;
      }
    }
    const farao = dim.getEntities({ type: "cl:farao", location: { x: 1001, y: 60, z: 2441 }, maxDistance: 80 }).length;
    log(`piramide_normal: ${JSON.stringify(c)} farao=${farao}`);
    t.assert((c.blue_terracotta ?? 0) > 50, "a pirâmide não foi posta");
    t.succeed();
  });
});

// Custo do relevo do mundo plano: o jogador anda por chunks novos e o relatório de perfil sai no log.
teste("perfil_relevo", 1300, (t) => {
  const j = robo(t, { x: 2, y: 2, z: 2 });
  const passos = [[2000, 2000], [2100, 2000], [2200, 2000], [2300, 2000], [2400, 2000]];
  passos.forEach(([x, z], k) => t.runAfterDelay(20 + k * 220, () => j.teleport({ x, y: 50, z })));
  t.runAfterDelay(1150, () => j.runCommand("scriptevent cl:teste_perfil"));
  t.runAfterDelay(1180, () => t.succeed());
});

// 1.15.1: o spawner do Minecraft com o mob escolhido (cidades e masmorras).
teste("spawner", 700, (t) => {
  const j = robo(t, { x: 1, y: 2, z: 1 });
  j.setGameMode(GameMode.Creative);
  t.runAfterDelay(5, () => world.structureManager.place("cl:spawner_minecraft_husk", t.getDimension(), t.worldLocation({ x: 5, y: 2, z: 5 })));
  t.runAfterDelay(600, () => {
    const b = t.getBlock({ x: 5, y: 2, z: 5 });
    const n = t.getDimension().getEntities({ type: "minecraft:husk", location: t.worldLocation({ x: 5, y: 2, z: 5 }), maxDistance: 8 }).length;
    log(`spawner: bloco=${b.typeId} husks=${n}`);
    t.assert(b.typeId === "minecraft:mob_spawner", "não pôs o spawner");
    t.succeed();
  });
});

teste("bau_saque", 200, (t) => {
  const j = robo(t, { x: 2, y: 1, z: 2 });
  t.runAfterDelay(5, () => world.structureManager.place("cl:teste_bau", t.getDimension(), t.worldLocation({ x: 4, y: 1, z: 2 })));
  t.runAfterDelay(10, () => {
    const c = t.getBlock({ x: 4, y: 1, z: 2 }).getComponent("inventory").container;
    log(`bau_saque: antes de abrir vazios=${c.emptySlotsCount}`);
    j.interactWithBlock({ x: 4, y: 1, z: 2 }, Direction.West);
  });
  t.runAfterDelay(30, () => {
    const c = t.getBlock({ x: 4, y: 1, z: 2 }).getComponent("inventory").container;
    log(`bau_saque: depois de abrir vazios=${c.emptySlotsCount}`);
    t.succeed();
  });
});

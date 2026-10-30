// As dicas da tela de carregamento (o texto que troca embaixo da barra de "Carregando..."). O jogo sorteia
// entre as chaves beginnerTips.1-12, midgameTips.1-69 e lategameTips.1-27 do idioma: aqui todas viram dicas
// do Pouso Forçado (as de começo nas de iniciante; as outras se repetem em roda). Escreve a seção
// "## Dicas da tela de carregamento" no fim de RP/texts/pt_BR.lang e en_US.lang, e os .lang do pacote do menu
// (RP_menu/texts/, só com as dicas). Só aparecem com um pacote ativo na hora de carregar: o do menu fica em
// Recursos Globais (ver "Menu e tela de carregamento" no README).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

// [pt, en]. As 12 primeiras são do começo do jogo.
const COMECO = [
  ["Sua nave caiu, mas o casco virou abrigo: à noite, fique dentro do avião ou num lugar com luz.", "Your ship crashed, but the hull is a shelter: at night, stay inside the plane or somewhere lit."],
  ["Abra o Diário de Bordo: cada missão ensina o próximo passo e dá recompensa.", "Open the Logbook: each quest teaches the next step and gives a reward."],
  ["O Condensador de Água, no baú do avião, tira água do ar. Ponha no chão logo no primeiro dia.", "The Water Condenser in the plane's chest pulls water from the air. Place it on day one."],
  ["Quase não há minério à vista: com o martelo, pedra vira cascalho, cascalho vira areia e areia vira poeira.", "There is almost no ore in sight: with a hammer, stone becomes gravel, gravel becomes sand and sand becomes dust."],
  ["Na Peneira, cascalho, areia e poeira soltam minério, sementes e outras coisas.", "In the Sieve, gravel, sand and dust drop ores, seeds and more."],
  ["Ao sol do meio-dia o corpo esquenta: fique na sombra e beba água.", "Under the midday sun your body heats up: stay in the shade and drink water."],
  ["Água salgada ou suja não se bebe direto: ferva na fornalha, na fogueira ou no caldeirão em cima do fogo.", "Salt or dirty water is not safe to drink: boil it in a furnace, on a campfire or in a cauldron over fire."],
  ["De dia os monstros se enterram na areia. À noite eles voltam.", "By day monsters bury themselves in the sand. At night they come back."],
  ["Animais não vivem aqui: eles chegam nas cápsulas de carga que caem do céu.", "No animals live here: they arrive in the cargo capsules that fall from the sky."],
  ["O Catálogo mostra como fazer qualquer item e onde ele é usado.", "The Catalog shows how to make any item and where it is used."],
  ["Todas as receitas de bancada aparecem no livro de receitas do inventário.", "Every crafting recipe shows up in the inventory recipe book."],
  ["Perdido? A Bússola do Avião mostra para que lado e a quantos metros está o Painel da Nave.", "Lost? The Plane Compass shows which way and how far the Ship Console is."],
];
const MEIO = [
  ["A cada 10 noites vem uma horda, com aviso no fim da tarde. Prepare as defesas.", "Every 10 nights a horde comes, with a warning at dusk. Get your defenses ready."],
  ["Tempestades de areia trazem o Golem de Areia.", "Sandstorms bring the Sand Golem."],
  ["Quando estiver seguro, o Saco de Dormir pula a noite.", "When you are safe, the Sleeping Bag skips the night."],
  ["O Camel Pack leva água com você nas viagens longas.", "The Camel Pack carries water with you on long trips."],
  ["Comida repetida enjoa: o jogo lembra as últimas 12 comidas. Varie o cardápio.", "Eating the same thing gets old: the game remembers your last 12 meals. Vary your diet."],
  ["A muda de tamareira sai da peneira de areia e dá cachos de tâmara.", "Date palm saplings come from sifting sand, and they grow bunches of dates."],
  ["O Varal seca carne crua e faz Charque.", "The Drying Rack dries raw meat into Beef Jerky."],
  ["Cidades abandonadas têm sinal de rádio: lá estão peças que não se fabricam.", "Abandoned cities have a radio signal: they hold parts that cannot be crafted."],
  ["Viu um meteoro cair? As coordenadas vêm no chat. A rocha de meteorito solta minérios e às vezes diamante.", "Saw a meteor fall? The coordinates show in chat. Meteorite rock drops ores and sometimes diamond."],
  ["Energia primeiro: gerador, painel solar, baterias e cabos abrem caminho para as máquinas.", "Power first: a generator, solar panels, batteries and cables open the way to machines."],
  ["Máquinas multiplicam minério: um minério pode render mais de um lingote.", "Machines multiply ores: one ore can yield more than one ingot."],
  ["Ferramentas do Tinkers se consertam e ganham modificadores na Estação de Ferramentas.", "Tinkers' tools can be repaired and gain modifiers at the Tool Station."],
  ["O petróleo fica bem fundo, abaixo da areia. A Bomba tira e a Refinaria faz combustível.", "Oil lies deep below the sand. The Pump extracts it and the Refinery makes fuel."],
  ["Segure a Asa-Delta enquanto cai para planar para a frente. Agache para fechar.", "Hold the Hang Glider while falling to glide forward. Sneak to close it."],
  ["Dois Elevadores, um acima do outro: pule para subir e agache para descer.", "Two Elevators, one above the other: jump to go up, sneak to go down."],
  ["Ao morrer, seus itens vão para um Túmulo no lugar, com as coordenadas no chat.", "When you die, your items go into a Grave on the spot, with the coordinates in chat."],
  ["Barris de Armazenamento guardam muito de um item só.", "Storage Barrels hold a lot of a single item."],
  ["Numa rede do AE, todos os itens ficam juntos e o terminal acha qualquer um.", "In an AE network all items are stored together and the terminal finds any of them."],
  ["Na Lua não há ar: vista a Máscara e o Equipamento de Oxigênio e leve tanques cheios. Um tanque leve dura quase 7 minutos.", "There is no air on the Moon: wear the Oxygen Mask and Oxygen Gear and carry full tanks. A light tank lasts almost 7 minutes."],
  ["O foguete pousa na Lua, mas só decola de uma plataforma 3×3: leve 9 plataformas, um carregador de combustível e energia.", "The rocket lands on the Moon, but only lifts off from a 3×3 pad: bring 9 pads, a fuel loader and power."],
  ["O paxel do Mekanism é picareta, machado e pá numa ferramenta só.", "The Mekanism paxel is a pickaxe, an axe and a shovel in one tool."],
  ["A Turbina Eólica do Mekanism rende mais quanto mais alto estiver.", "The Mekanism Wind Generator makes more power the higher it is."],
  ["Duas Âncoras de Viagem do Ender IO a até 96 blocos: toque numa para ir até a outra.", "Two Ender IO Travel Anchors within 96 blocks: tap one to travel to the other."],
  ["Aqui o portal do Nether não acende: o martelo faz Cascalho do Nether com netherrack, e a peneira tira quartzo e até netherite.", "The Nether portal won't light here: a hammer turns netherrack into Nether Gravel, and sifting it gives quartz and even netherite."],
];
const FIM = [
  ["Quatro sistemas queimaram na queda: casco, computador de bordo, combustível e motor.", "Four systems burned in the crash: hull, flight computer, fuel and engine."],
  ["O Painel da Nave, na cabine do avião, conserta cada sistema quando você tem as peças.", "The Ship Console in the plane's cockpit repairs each system once you have the parts."],
  ["Com os quatro sistemas consertados, falta a Bobina de Salto: o Núcleo de Salto está na base de pesquisa da Lua.", "With all four systems repaired, the Jump Coil is still missing: the Jump Core is in the lunar research base."],
  ["Na Lua, a Bússola do Avião aponta para o sinal da base de pesquisa.", "On the Moon, the Plane Compass points to the research base signal."],
  ["Ninguém vem buscar você. O único jeito de sair daqui é consertar a nave e decolar.", "No one is coming for you. The only way out is to repair the ship and take off."],
  ["Cada mod tem um capítulo no Diário de Bordo. Siga até o fim para voltar para casa.", "Each mod has a chapter in the Logbook. Follow it to the end to go home."],
];

const CHAVES = [
  ["beginnerTips", 12, COMECO],
  ["midgameTips", 69, [...COMECO, ...MEIO, ...FIM]],
  ["lategameTips", 27, [...MEIO, ...FIM]],
];
for (const [arq, i] of [["RP/texts/pt_BR.lang", 0], ["RP/texts/en_US.lang", 1]]) {
  const INI = "## Dicas da tela de carregamento (gerado por tools/gerar-dicas.mjs)", FIM_SECAO = "## fim Dicas";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const p = texto.indexOf(INI);
  if (p >= 0) texto = texto.slice(0, p) + texto.slice(texto.indexOf(FIM_SECAO) + FIM_SECAO.length + 1);
  const linhas = CHAVES.flatMap(([chave, n, lista]) => Array.from({ length: n }, (_, k) => `${chave}.${k + 1}=${lista[k % lista.length][i]}`));
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${linhas.join("\n")}\n${FIM_SECAO}\n`);
  mkdirSync(join(RAIZ, "RP_menu/texts"), { recursive: true });
  writeFileSync(join(RAIZ, "RP_menu/texts", arq.split("/").pop()), `## Dicas da tela de carregamento (gerado por tools/gerar-dicas.mjs)\n${linhas.join("\n")}\n`);
}
writeFileSync(join(RAIZ, "RP_menu/texts/languages.json"), `${JSON.stringify(["en_US", "pt_BR"])}\n`);
console.log(`dicas: ${COMECO.length + MEIO.length + FIM.length} (12 + 69 + 27 chaves)`);

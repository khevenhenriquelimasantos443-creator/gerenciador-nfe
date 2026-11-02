// Fase 39 (1.18.0): Powah! (owmii, LGPL-3.0; github.com/owmii/Powah). Geradores, células e cabos em 7 níveis
// (Inicial, Básico, Endurecido, Ardente, Niótico, Espiritual e Nitro) e o Orbe Energizador, que transforma itens com
// energia das Hastes Energizadoras em volta (aço energizado e os cristais dos níveis altos).
// Receitas e números: tools/dados/conteudo/powah.json, lido do código do mod por tools/importar-powah.py, que também
// copia a arte original (a licença deixa). Scripts em scripts/maquinas/powah.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const P = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "powah.json"), "utf8"));
const PW = { mod: "Powah!" };
const NIVEIS = P.niveis; // [id, pt, en]
// Cor de cada nível (Tier.java do mod), para os desenhos gerados quando não há arte.
const COR = ["#a7a7a7", "#a3ab9f", "#bba993", "#e4b040", "#13eed2", "#afe241", "#d7746c"];
const N = P.numeros;
const E = (fe) => fe / 4000; // 1 E do pack = 4.000 RF (= FE)

// Cabos: o mesmo modelo dos condutos (miolo e braços que aparecem conforme os estados de ligação).
const LIGACOES = { norte: "cl:n", sul: "cl:s", leste: "cl:l", oeste: "cl:o", cima: "cl:cima", baixo: "cl:baixo" };
const CABO = {
  centro: [[[-3, 5, -3], [6, 6, 6]]], norte: [[[-2, 6, -8], [4, 4, 5]]], sul: [[[-2, 6, 3], [4, 4, 5]]], leste: [[[3, 6, -2], [5, 4, 4]]],
  oeste: [[[-8, 6, -2], [5, 4, 4]]], cima: [[[-2, 11, -2], [4, 5, 4]]], baixo: [[[-2, 0, -2], [4, 5, 4]]],
};
const caixa = ([o, t]) => ({ "minecraft:collision_box": { origin: o, size: t }, "minecraft:selection_box": { origin: o, size: t } });

const maquina = (tipo, comp, pt, en, luz, glifo) =>
  NIVEIS.map(([n, npt, nen], k) => ({ id: `${tipo}_${n}`, pt: `${pt} ${npt}`, en: `${nen} ${en}`, tipo: "maquina", luz, glifo, comp, tick: 100, ...PW, nivel: k }));

export default {
  fase: 39,
  mod: "Powah!",
  itens: [
    { id: "pasta_dieletrica", pt: "Pasta Dielétrica", en: "Dielectric Paste", icone: "gota:#3a3f4a", ...PW },
    { id: "haste_dieletrica", pt: "Haste Dielétrica", en: "Dielectric Rod", icone: "barra:#3a3f4a", ...PW },
    { id: "involucro_dieletrico", pt: "Invólucro Dielétrico", en: "Dielectric Casing", icone: "placa:#3a3f4a", ...PW },
    { id: "capacitor_pw_minusculo", pt: "Capacitor Minúsculo", en: "Tiny Capacitor", icone: "celula:#a7a7a7", ...PW },
    { id: "capacitor_pw_basico", pt: "Capacitor Básico (Powah)", en: "Basic Capacitor (Powah)", icone: "celula:#a3ab9f", ...PW },
    { id: "capacitor_pw_grande", pt: "Capacitor Grande", en: "Large Basic Capacitor", icone: "celula:#a3ab9f", ...PW },
    ...NIVEIS.slice(2).map(([n, npt, nen], k) => ({ id: `capacitor_pw_${n}`, pt: `Capacitor ${npt}`, en: `${nen} Capacitor`, icone: `celula:${COR[k + 2]}`, ...PW })),
    { id: "aco_energizado", pt: "Aço Energizado", en: "Energized Steel", icone: "barra:#d8c79a", ...PW },
    ...NIVEIS.slice(3).map(([n, npt, nen], k) => ({ id: `cristal_${n}`, pt: `Cristal ${npt}`, en: `${nen} Crystal`, icone: `cristal:${COR[k + 3]}`, ...PW })),
    { id: "painel_fotoeletrico", pt: "Painel Fotoelétrico", en: "Photoelectric Pane", icone: "placa:#3b5ea8", ...PW },
    { id: "placa_termoeletrica", pt: "Placa Termoelétrica", en: "Thermoelectric Plate", icone: "placa:#c86a2a", ...PW },
    // 1.19.0: o resto do mod.
    { id: "uraninita_bruta_pobre", pt: "Uraninita Bruta Pobre", en: "Poor Raw Uraninite", icone: "pepita:#5e8a3a", ...PW },
    { id: "uraninita_bruta", pt: "Uraninita Bruta", en: "Raw Uraninite", icone: "pepita:#6aa83e", ...PW },
    { id: "uraninita_bruta_densa", pt: "Uraninita Bruta Densa", en: "Dense Raw Uraninite", icone: "pepita:#7fd04a", ...PW },
    { id: "uraninita", pt: "Uraninita", en: "Uraninite", icone: "cristal:#8ee05a", ...PW },
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `bateria_pw_${n}`, pt: `Bateria ${npt}`, en: `${nen} Battery`, icone: `celula:${COR[k]}`, pilha: 1, ...PW })),
    { id: "nucleo_ender", pt: "Núcleo Ender", en: "Ender Core", icone: "nucleo:#1f8a6e", ...PW },
    { id: "lente_ender", pt: "Lente do Ender", en: "Lens of Ender", icone: "bola:#1f8a6e", ...PW },
    { id: "perola_aerea", pt: "Pérola Aérea", en: "Aerial Pearl", icone: "bola:#9fd8e8", ...PW },
    { id: "perola_aerea_jogador", pt: "Pérola Aérea do Jogador", en: "Player Aerial Pearl", icone: "bola:#d89f9f", ...PW },
    { id: "cartao_branco", pt: "Cartão Branco", en: "Blank Card", icone: "placa:#e8e8e8", ...PW },
    { id: "cartao_vinculo", pt: "Cartão de Vínculo", en: "Binding Card", icone: "placa:#c84a4a", pilha: 1, ...PW },
    { id: "cartao_vinculo_dimensional", pt: "Cartão de Vínculo Dimensional", en: "Dimensional Binding Card", icone: "placa:#8a4ac8", pilha: 1, ...PW },
    { id: "chave_powah", pt: "Chave (Powah)", en: "Wrench (Powah)", icone: "chave:#3a3f4a", pilha: 1, ...PW },
    { id: "bola_neve_carregada", pt: "Bola de Neve Carregada", en: "Charged Snowball", icone: "bola:#9fe0ff", pilha: 16, ...PW },
    { id: "livro_powah", pt: "Livro do Powah", en: "Powah Book", icone: "placa:#3a6aa8", pilha: 1, ...PW },
  ],
  blocos: [
    ...maquina("furnator", "cl:pw_furnator", "Furnator", "Furnator", "laranja", "chama"),
    ...maquina("magmator", "cl:pw_magmator", "Magmator", "Magmator", "vermelho", "chama"),
    ...maquina("termogerador", "cl:pw_termogerador", "Termogerador", "Thermo Generator", "laranja", "raio"),
    ...maquina("painel_solar", "cl:pw_solar", "Painel Solar", "Solar Panel", "amarelo", "circulo"),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `celula_powah_${n}`, pt: `Célula de Energia ${npt} (Powah)`, en: `${nen} Energy Cell (Powah)`, tipo: "cubo", cor: COR[k], padrao: "rebitado", dureza: 2, girar: false, ...PW })),
    ...NIVEIS.map(([n, npt, nen], k) => ({
      id: `cabo_powah_${n}`, pt: `Cabo de Energia ${npt}`, en: `${nen} Energy Cable`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 0.5, girar: false, ...PW,
      estados: Object.fromEntries(Object.values(LIGACOES).map((e) => [e, [false, true]])),
      geometria: { ossos: CABO, visivel: Object.fromEntries(Object.entries(LIGACOES).map(([o, e]) => [o, `q.block_state('${e}')`])) },
      extra: caixa([[-3, 5, -3], [6, 6, 6]]),
    })),
    ...NIVEIS.map(([n, npt, nen], k) => ({
      id: `haste_energizadora_${n}`, pt: `Haste Energizadora ${npt}`, en: `${nen} Energizing Rod`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 1, girar: false, ...PW,
      geometria: { ossos: { base: [[[-4, 0, -4], [8, 2, 8]]], haste: [[[-1.5, 2, -1.5], [3, 10, 3]]], gema: [[[-2.5, 11, -2.5], [5, 5, 5]]] } },
      extra: caixa([[-4, 0, -4], [8, 16, 8]]),
    })),
    {
      id: "orbe_energizador", pt: "Orbe Energizador", en: "Energizing Orb", tipo: "cubo", cor: "#9fd8e8", padrao: "liso", dureza: 1, girar: false, comp: "cl:pw_orbe", tick: 20, luzEmite: 7, ...PW,
      geometria: { ossos: { base: [[[-6, 0, -6], [12, 3, 12]]], orbe: [[[-4, 3, -4], [8, 8, 8]]] } },
      extra: caixa([[-6, 0, -6], [12, 11, 12]]),
    },
    // 1.19.0
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `reator_${n}`, pt: `Reator ${npt}`, en: `${nen} Reactor`, tipo: "cubo", cor: COR[k], padrao: "rebitado", dureza: 3, girar: false, comp: "cl:pw_reator", tick: 20, ...PW,
      estados: { "cl:parte": [false, true] }, loot: "loot_tables/empty.json" })),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `celula_ender_${n}`, pt: `Célula Ender ${npt}`, en: `${nen} Ender Cell`, tipo: "cubo", cor: COR[k], padrao: "rebitado", dureza: 2, girar: false, comp: "cl:pw_ender", ...PW })),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `portao_ender_${n}`, pt: `Portão Ender ${npt}`, en: `${nen} Ender Gate`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 2, girar: false, comp: "cl:pw_ender", ...PW })),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `descarregador_${n}`, pt: `Descarregador ${npt}`, en: `${nen} Energy Discharger`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 2, girar: false, comp: "cl:pw_descarregador", tick: 20, ...PW })),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `funil_energia_${n}`, pt: `Funil de Energia ${npt}`, en: `${nen} Energy Hopper`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 2, girar: false, comp: "cl:pw_funil", tick: 20, ...PW })),
    ...NIVEIS.map(([n, npt, nen], k) => ({ id: `transmissor_${n}`, pt: `Transmissor de Jogador ${npt}`, en: `${nen} Player Transmitter`, tipo: "cubo", cor: COR[k], padrao: "metal", dureza: 2, girar: false, comp: "cl:pw_transmissor", tick: 20, ...PW,
      geometria: { ossos: { base: [[[-6, 0, -6], [12, 2, 12]]], haste: [[[-1, 2, -1], [2, 8, 2]]], topo: [[[-3, 10, -3], [6, 4, 6]]] } }, extra: caixa([[-6, 0, -6], [12, 14, 12]]) })),
    { id: "gelo_seco", pt: "Gelo Seco", en: "Dry Ice", tipo: "cubo", cor: "#dfe8ee", padrao: "liso", dureza: 1, girar: false, ...PW },
    { id: "bloco_uraninita", pt: "Bloco de Uraninita", en: "Uraninite Block", tipo: "cubo", cor: "#6aa83e", padrao: "liso", dureza: 3, girar: false, luzEmite: 4, ...PW },
    { id: "bloco_aco_energizado", pt: "Bloco de Aço Energizado", en: "Energized Steel Block", tipo: "cubo", cor: "#d8c79a", padrao: "rebitado", dureza: 3, girar: false, ...PW },
    ...NIVEIS.slice(3).map(([n, npt, nen], k) => ({ id: `bloco_cristal_${n}`, pt: `Bloco de Cristal ${npt}`, en: `${nen} Crystal Block`, tipo: "cubo", cor: COR[k + 3], padrao: "liso", dureza: 3, girar: false, luzEmite: 5, ...PW })),
  ],
  receitas: P.receitas,
  dados: {
    niveis: NIVEIS.map(([n]) => n),
    // Por nível, em E do pack por ciclo de 5 s (100 ticks): FE/t × 100 / 4.000.
    furnator: N.furnator.geracao.map((g) => E(g * 100)),
    magmator: N.magmator.geracao.map((g) => E(g * 100)),
    termogerador: N.termogerador.geracao.map((g) => E(g * 100)),
    solar: N.painel_solar.geracao.map((g) => E(g * 100)),
    // Hastes: E por segundo (o Orbe roda a cada 20 ticks).
    hastes: N.haste_energizadora.transferencia.map((t) => E(t * 20)),
    // Combustível do Furnator: ticks de queima de fornalha × 30 FE (carvão = 48.000 FE = 12 E).
    porTickQueima: E(N.combustivelPorTick),
    queima: {
      "minecraft:coal": 1600, "minecraft:charcoal": 1600, "minecraft:coal_block": 16000, "minecraft:blaze_rod": 2400, "minecraft:dried_kelp_block": 4000,
      "minecraft:stick": 100, "#planks": 300, "#logs": 300, "cl:coque": 3200, "cl:bloco_coque": 32000, "cl:bloco_carvao_vegetal": 16000,
    },
    lavaPorBalde: E(N.lavaPorBalde),
    calor: N.calor,
    alcanceOrbe: N.alcanceOrbe,
    // Orbe: entradas (sem ordem), E e o resultado.
    energizar: P.energizar.map((r) => ({ entradas: r.entradas, e: E(r.rf), resultado: r.resultado, qtd: r.qtd })),
    celulas: Object.fromEntries(NIVEIS.map(([n], k) => [`cl:celula_powah_${n}`, E(N.celula_powah.capacidade[k])])),
    // 1.19.0
    reator: N.reator.geracao, // FE/t (o reator calcula por tick, como no mod)
    reatorCapacidade: N.reator.capacidade.map(E),
    bateria: N.bateria.capacidade.map(E),
    bateriaPorSegundo: N.bateria.transferencia.map((t) => E(t * 20)),
    enderCanais: N.ender.canais,
    funilPorSegundo: N.funil.transferencia.map((t) => E(t * 20)),
    descarregadorPorSegundo: N.descarregador.transferencia.map((t) => E(t * 20)),
    transmissorPorSegundo: N.transmissor.transferencia.map((t) => E(t * 20)),
    resfriadores: N.resfriadores,
  },
  textos: {
    "cl.pw.furnator": ["Furnator %s: %s. Queima o combustível do baú em cima, ou toque com ele na mão. Guardado: %s.", "%s Furnator: %s. Burns fuel from the chest on top, or tap it with fuel in hand. Stored: %s."],
    "cl.pw.magmator": ["Magmator %s: %s. Lava do baú em cima ou toque com um balde de lava (100.000 RF cada). Guardado: %s.", "%s Magmator: %s. Lava from the chest on top or tap with a lava bucket (100,000 RF each). Stored: %s."],
    "cl.pw.termo": ["Termogerador %s: %s. Precisa de calor embaixo (lava, magma, bloco de cristal ardente) e água (balde ou fonte do lado). Água: %s mB.", "%s Thermo Generator: %s. Needs heat below (lava, magma, blazing crystal block) and water (bucket or a source next to it). Water: %s mB."],
    "cl.pw.solar": ["Painel Solar %s: %s. Gera de dia, com céu aberto em cima.", "%s Solar Panel: %s. Generates by day under open sky."],
    "cl.pw.parado": ["parado", "idle"],
    "cl.pw.gerando": ["Gerando: %s", "Generating: %s"],
    ...Object.fromEntries(NIVEIS.map(([n, npt, nen]) => [`cl.pw.nivel.${n}`, [npt, nen]])),
    "cl.pw.orbe": ["Orbe Energizador: %s. %s de %s. Hastes em volta: %s (até 4 blocos, ligadas à energia).", "Energizing Orb: %s. %s of %s. Rods around: %s (up to 4 blocks away, powered)."],
    "cl.pw.orbe_vazio": ["vazio: toque com os itens da receita (até 6)", "empty: tap with the recipe items (up to 6)"],
    "cl.pw.orbe_sem_receita": ["Nada no Orbe faz uma receita. Toque com a mão vazia para tirar.", "Nothing in the Orb makes a recipe. Tap empty-handed to take it out."],
    "cl.pw.orbe_pronto": ["§aPronto!§r Toque com a mão vazia para pegar.", "§aDone!§r Tap empty-handed to collect."],
    // 1.19.0
    "cl.pw.reator": ["Reator %s: %s. Uraninita %s/1000, temperatura %s°, carbono %s, redstone %s, frio %s, água %s. Toque com uraninita, carvão, redstone, gelo/neve ou balde de água (ou ponha num baú embaixo do núcleo).", "%s Reactor: %s. Uraninite %s/1000, temperature %s°, carbon %s, redstone %s, cooling %s, water %s. Tap with uraninite, coal, redstone, ice/snow or a water bucket (or put them in a chest under the core)."],
    "cl.pw.reator_montar": ["O Reator precisa de 3×3×4 livre (o bloco é o meio de baixo) e de mais 35 Reatores %s no inventário.", "The Reactor needs a free 3×3×4 space (this block is the bottom middle) and 35 more %s Reactors in your inventory."],
    "cl.pw.reator_montado": ["§aReator montado!", "§aReactor built!"],
    "cl.pw.ender": ["%s — canal %s de %s. Energia do canal: %s de %s. Toque de mão vazia para trocar o canal; com uma Célula de Energia (Powah) para aumentar a capacidade.", "%s — channel %s of %s. Channel energy: %s of %s. Tap empty-handed to change the channel; with an Energy Cell (Powah) to raise the capacity."],
    "cl.pw.descarregador": ["Descarregador: passa a energia das baterias do baú em cima para a rede (%s/s).", "Energy Discharger: moves energy from batteries in the chest on top into the network (%s/s)."],
    "cl.pw.funil": ["Funil de Energia: carrega as baterias do baú embaixo com a energia da rede (%s/s).", "Energy Hopper: charges batteries in the chest below with network energy (%s/s)."],
    "cl.pw.transmissor": ["Transmissor: carrega as baterias de %s (%s/s). Toque com um Cartão de Vínculo para trocar.", "Transmitter: charges %s's batteries (%s/s). Tap with a Binding Card to change it."],
    "cl.pw.transmissor_vazio": ["ninguém (toque com um Cartão de Vínculo)", "no one (tap with a Binding Card)"],
    "cl.pw.cartao_vinculado": ["Cartão vinculado a %s.", "Card bound to %s."],
    "cl.pw.bateria": ["Bateria: %s de %s", "Battery: %s of %s"],
    "cl.pw.livro": ["Powah!: geradores (Furnator, Magmator, Termogerador, Painel Solar, Reator), Células e Cabos em 7 níveis. O Orbe Energizador com Hastes em volta faz Aço Energizado e cristais. Baterias carregam no Funil (baú embaixo) e no Transmissor (vinculado com o Cartão); o Descarregador devolve a energia à rede. A Célula Ender e o Portão Ender ligam redes longe pelo mesmo canal (do mesmo dono). Pérola Aérea num zumbi vira Pérola Aérea do Jogador; Painel Fotoelétrico num enderman vira Lente do Ender; Cartão de Vínculo num enderman vira dimensional.", "Powah!: generators (Furnator, Magmator, Thermo Generator, Solar Panel, Reactor), Cells and Cables in 7 tiers. The Energizing Orb with Rods around makes Energized Steel and crystals. Batteries charge in the Hopper (chest below) and the Transmitter (bound with the Card); the Discharger puts energy back in the network. Ender Cells and Gates link far networks on the same channel (same owner). An Aerial Pearl on a zombie becomes a Player Aerial Pearl; a Photoelectric Pane on an enderman becomes a Lens of Ender; a Binding Card on an enderman becomes dimensional."],
    "cl.missao.pw_uraninita.titulo": ["Uraninita", "Uraninite"], "cl.missao.pw_uraninita.desc": ["Peneire cascalho atrás de Uraninita Bruta e derreta na fornalha.", "Sieve gravel for Raw Uraninite and smelt it."],
    "cl.missao.pw_reator.titulo": ["Fissão", "Fission"], "cl.missao.pw_reator.desc": ["Monte um Reator (36 blocos) e gere energia com uraninita.", "Build a Reactor (36 blocks) and generate power with uraninite."],
    "cl.missao.pw_ender.titulo": ["Energia sem fio", "Wireless power"], "cl.missao.pw_ender.desc": ["Coloque uma Célula Ender e um Portão Ender no mesmo canal.", "Place an Ender Cell and an Ender Gate on the same channel."],
    "cl.missao.pw_bateria.titulo": ["Bateria cheia", "Full battery"], "cl.missao.pw_bateria.desc": ["Carregue uma bateria no Funil de Energia ou no Transmissor.", "Charge a battery in the Energy Hopper or the Transmitter."],
    "cl.missao.pw_raio.titulo": ["Raio na mão", "Lightning in hand"], "cl.missao.pw_raio.desc": ["Jogue uma Bola de Neve Carregada (o Orbe faz de uma bola de neve).", "Throw a Charged Snowball (the Orb makes it from a snowball)."],
    "cl.capitulo.powah.nome": ["Powah!", "Powah!"],
    "cl.capitulo.powah.curto": ["Powah!", "Powah!"],
    "cl.capitulo.powah.desc": ["Geradores, células e cabos de energia em 7 níveis, e o Orbe Energizador que cria aço e cristais.", "Generators, energy cells and cables in 7 tiers, and the Energizing Orb that makes steel and crystals."],
    "cl.missao.pw_pasta.titulo": ["Pasta Dielétrica", "Dielectric Paste"], "cl.missao.pw_pasta.desc": ["Faça 16 de Pasta Dielétrica (carvão, argila e pó de blaze ou um balde de lava).", "Make 16 Dielectric Paste (coal, clay and blaze powder or a lava bucket)."],
    "cl.missao.pw_furnator.titulo": ["Fogo que vira energia", "Fire into power"], "cl.missao.pw_furnator.desc": ["Coloque um Furnator Inicial e uma célula ou bateria ligada a ele.", "Place a Starter Furnator with a cell or battery connected to it."],
    "cl.missao.pw_celula.titulo": ["Guardar energia", "Storing power"], "cl.missao.pw_celula.desc": ["Coloque uma Célula de Energia Inicial (Powah).", "Place a Starter Energy Cell (Powah)."],
    "cl.missao.pw_cabo.titulo": ["Cabos", "Cables"], "cl.missao.pw_cabo.desc": ["Faça 12 Cabos de Energia Iniciais: eles ligam geradores, células e máquinas.", "Make 12 Starter Energy Cables: they link generators, cells and machines."],
    "cl.missao.pw_orbe.titulo": ["Energizar", "Energize"], "cl.missao.pw_orbe.desc": ["Ponha ferro e ouro no Orbe Energizador com Hastes Energizadoras ligadas em volta e faça Aço Energizado.", "Put iron and gold in the Energizing Orb with powered Energizing Rods around it and make Energized Steel."],
    "cl.missao.pw_termo.titulo": ["Calor da terra", "Earth's heat"], "cl.missao.pw_termo.desc": ["Gere energia com um Termogerador (lava ou magma embaixo e água).", "Generate power with a Thermo Generator (lava or magma below and water)."],
    "cl.missao.pw_solar.titulo": ["Sol do deserto", "Desert sun"], "cl.missao.pw_solar.desc": ["Coloque um Painel Solar Básico (Powah).", "Place a Basic Solar Panel (Powah)."],
    "cl.missao.pw_ardente.titulo": ["Cristal Ardente", "Blazing Crystal"], "cl.missao.pw_ardente.desc": ["Faça um Cristal Ardente no Orbe (vara de blaze ou 4 pós de blaze).", "Make a Blazing Crystal in the Orb (a blaze rod or 4 blaze powder)."],
  },
};

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

// Fase 69 (1.52.0): Mekanism completo, parte 4: urânio, química nuclear, multiblocos e reatores (Mekanism 10.7.19 e
// Mekanism Generators, MIT; tools/importar-mekanism-completo.py grava mekanism_p4.json com os modelos 3D, a arte e as receitas).
// - Minérios de urânio, ósmio e estanho (com os números do mod), pepitas, pós e blocos que faltavam.
// - Química nuclear: bolo amarelo → óxido de urânio + ácido fluorídrico → hexafluoreto → (Centrífuga Isotópica) combustível
//   físsil → Reator de Fissão → vapor + resíduo nuclear → (Centrífuga) plutônio / (Ativador de Nêutrons Solar) polônio →
//   pastilhas → SPS → antimatéria → Nucleossintetizador. Água pesada (Bomba com Filtro) → deutério; lítio → trítio; D-T.
// - Multiblocos: Tanque Dinâmico, Planta de Evaporação Térmica, Matriz de Indução, Caldeira Térmica, SPS, Reator de
//   Fissão, Turbina Industrial e Reator de Fusão. Radiação (dosímetro, contador Geiger, roupa Hazmat).
// Scripts em scripts/maquinas/mekanism_multiblocos.ts, mekanism_nuclear.ts e mekanism_radiacao.ts.
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("mekanism_p4.json", import.meta.url), "utf8"));
const MK = { mod: "Mekanism" };
const mat = (tex) => ({ texture: tex, render_method: "alpha_test" });
const modelo = (m) => ({
  "minecraft:geometry": m.geometria,
  "minecraft:material_instances": { "*": mat(Object.values(m.materiais)[0]), ...Object.fromEntries(Object.entries(m.materiais).map(([k, v]) => [k, mat(v)])) },
  "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0,
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });
const LIGA = { "cl:n": "norte", "cl:s": "sul", "cl:l": "leste", "cl:o": "oeste", "cl:cima": "cima", "cl:baixo": "baixo" };
const HAZMAT = { mascara_hazmat: ["slot.armor.head", "armor_head"], jaleco_hazmat: ["slot.armor.chest", "armor_torso"], calca_hazmat: ["slot.armor.legs", "armor_legs"],
  botas_hazmat: ["slot.armor.feet", "armor_feet"] };
const LOOT = { minerio_uranio: "uranio", minerio_uranio_profundo: "uranio", minerio_osmio: "osmio", minerio_osmio_profundo: "osmio", minerio_estanho: "estanho",
  minerio_estanho_profundo: "estanho" };
const QUIMICA = new Set(["centrifuga_isotopica", "ativador_neutrons_solar", "nucleossintetizador", "liquidificador_nutricional"]);
const TICK = { aquecedor_resistivo: 20, aquecedor_lenha: 20, laser_mk: 20, amplificador_laser: 20, feixe_trator_laser: 20, estabilizador_dimensional: 100,
  barril_residuos_radioativos: 20 };
const LUZ = { centrifuga_isotopica: "verde", ativador_neutrons_solar: "amarelo", nucleossintetizador: "violeta", liquidificador_nutricional: "laranja",
  aquecedor_resistivo: "vermelho", aquecedor_lenha: "laranja", laser_mk: "vermelho", amplificador_laser: "vermelho", feixe_trator_laser: "vermelho",
  estabilizador_dimensional: "violeta", barril_residuos_radioativos: "verde" };
const PT = { lingote_uranio: "Lingote de Urânio", uranio_bruto: "Urânio Bruto", minerio_uranio: "Minério de Urânio", minerio_uranio_profundo: "Minério de Urânio Profundo",
  minerio_osmio: "Minério de Ósmio", minerio_osmio_profundo: "Minério de Ósmio Profundo", osmio_bruto: "Ósmio Bruto", minerio_estanho: "Minério de Estanho",
  minerio_estanho_profundo: "Minério de Estanho Profundo", estanho_bruto: "Estanho Bruto", vidro_reator_mk: "Vidro de Reator (Mekanism)",
  revestimento_turbina_mk: "Revestimento da Turbina", valvula_turbina_mk: "Válvula da Turbina", pa_turbina_mk: "Pá da Turbina", laser_mk: "Laser" };
const condutor = (t) => ({
  id: t.id, pt: t.pt, en: t.en, tipo: "cubo", cor: "#8a4a2a", dureza: 1, girar: false, ...MK,
  estados: Object.fromEntries(Object.keys(LIGA).map((e) => [e, [false, true]])),
  extra: {
    "minecraft:geometry": { identifier: "geometry.cl.mk_transmissor_pequeno", bone_visibility: Object.fromEntries(Object.entries(LIGA).map(([e, o]) => [o, `q.block_state('${e}')`])) },
    "minecraft:material_instances": { "*": mat(`clc_mkt_${t.id}_lado`), lado: mat(`clc_mkt_${t.id}_lado`), centro: mat(`clc_mkt_${t.id}_centro`) },
    "minecraft:collision_box": t.caixa, "minecraft:selection_box": t.caixa, "minecraft:light_dampening": 0,
  },
});

export default {
  fase: 69,
  mod: "Mekanism",
  itens: [
    ...D.itens.map((i) => ({
      id: i.id, pt: PT[i.id] ?? i.pt, en: i.en, icone: "chip:#46664f", ...MK,
      ...(HAZMAT[i.id] ? { pilha: 1, cat: "equipment", comp: { "minecraft:wearable": { slot: HAZMAT[i.id][0], protection: 1 },
        "minecraft:enchantable": { slot: HAZMAT[i.id][1], value: 5 }, "minecraft:tags": { tags: ["minecraft:is_armor", "cl:hazmat"] } } } : {}),
      ...(["dosimetro", "contador_geiger", "hohlraum"].includes(i.id) ? { pilha: 1 } : {}),
    })),
    ...D.liquidos.map((l) => ({ id: l.id, pt: l.pt, en: l.en, icone: "garrafa:#3a6ad0", pilha: 1, ...MK })),
  ],
  blocos: [
    ...D.cubos.map((c) => ({
      id: c.id, pt: PT[c.id] ?? c.pt, en: c.en, tipo: c.vidro ? "vidro" : "cubo", cor: c.id.startsWith("minerio_") ? "#7a7a80" : "#5a6470", dureza: c.id.startsWith("minerio_") ? 3 : 3.5,
      girar: false, ...MK, ...(LOOT[c.id] ? { loot: `loot_tables/cl/mk/minerio_${LOOT[c.id]}.json` } : {}),
      ...(c.id.startsWith("celula_inducao") || c.id.startsWith("provedor_inducao") ? { luzEmite: 6 } : {}),
    })),
    ...D.modelos.map((m) => ({ id: m.id, pt: m.pt, en: m.en, tipo: "cubo", cor: "#5a6470", dureza: 3.5, girar: false, ...MK, extra: modelo(m.modelo) })),
    ...D.maquinas.map((m) => ({
      id: m.id, pt: PT[m.id] ?? m.pt, en: m.en, tipo: "maquina", luz: LUZ[m.id], glifo: "engrenagem", ...MK,
      ...(QUIMICA.has(m.id) ? { comp: "cl:mk_quimica", tick: 100 } : { comp: "cl:mk_nuclear", tick: TICK[m.id] ?? 20 }),
      ...(m.modelo ? { extra: modelo(m.modelo) } : {}),
    })),
    ...D.condutores.map(condutor),
  ],
  receitas: [
    ...D.receitas,
    ...Object.entries(D.fornalha).map(([de, para], k) => ({ id: `mk_p4_forno_${k}`, tipo: "furnace", entrada: de, resultado: para })),
  ],
  textos: {
    "cl.mkq.q.heavy_water": ["Água Pesada", "Heavy Water"], "cl.mkq.q.nutritional_paste": ["Pasta Nutritiva", "Nutritional Paste"],
    // Multiblocos
    "cl.mkn.forma_ok": ["%s formado (%s × %s × %s).", "%s formed (%s × %s × %s)."],
    "cl.mkn.forma_erro": ["%s incompleto: %s", "%s incomplete: %s"],
    "cl.mkn.erro.tamanho": ["tamanho fora do limite do mod.", "size outside the mod's limits."],
    "cl.mkn.erro.parede": ["falta bloco na parede (ou tem bloco errado).", "a wall block is missing (or wrong)."],
    "cl.mkn.erro.dentro": ["tem bloco que não pode ficar dentro.", "there is a block that cannot be inside."],
    "cl.mkn.erro.controlador": ["precisa de exatamente 1 controlador.", "needs exactly 1 controller."],
    "cl.mkn.erro.dispersor": ["os Dispersores de Pressão têm de fechar uma camada inteira.", "the Pressure Dispersers must fill a whole layer."],
    "cl.mkn.erro.rotor": ["os Rotores têm de subir do centro do chão até o Complexo Rotacional.", "the Rotors must go up from the floor center to the Rotational Complex."],
    "cl.mkn.erro.combustivel": ["precisa de Conjuntos de Combustível com uma Barra de Controle em cima.", "needs Fuel Assemblies topped by a Control Rod."],
    "cl.mkn.titulo": ["%s", "%s"],
    "cl.mkn.tanque": ["Tanque Dinâmico: %s de %s mB.\nGuarda um fluido ou um químico (350.000 mB de fluido ou 16.000.000 mB de químico por bloco de dentro). Toque a válvula com balde ou cilindro para pôr ou tirar; Canos e Tubos ligam nela.", "Dynamic Tank: %s of %s mB.\nHolds one fluid or chemical (350,000 mB of fluid or 16,000,000 mB of chemical per inside block). Tap the valve with a bucket or tank to put in or take out; Pipes and Tubes connect to it."],
    "cl.mkn.evaporacao": ["Planta de Evaporação Térmica (altura %s): entrada %s, saída %s. Ritmo agora: %s mB/t (sol no topo aberto e calor dos aquecedores).\nÁgua vira salmoura (10 → 1) e salmoura vira lítio (10 → 1).", "Thermal Evaporation Plant (height %s): input %s, output %s. Rate now: %s mB/t (sun on the open top and heat from heaters).\nWater becomes brine (10 → 1) and brine becomes lithium (10 → 1)."],
    "cl.mkn.inducao": ["Matriz de Indução: %s de %s.\nEntrada/saída até %s/t (provedores). Liga na rede como uma bateria pelas Portas.", "Induction Matrix: %s of %s.\nInput/output up to %s/t (providers). Connects to the grid like a battery through the Ports."],
    "cl.mkn.caldeira": ["Caldeira Térmica: água %s mB, vapor %s mB, calor %s J/t (até %s J/t pelos Elementos de Superaquecimento). Vapor agora: %s mB/t.\nO calor vem dos Aquecedores encostados ou pelos Condutores Termodinâmicos.", "Thermoelectric Boiler: water %s mB, steam %s mB, heat %s J/t (up to %s J/t from the Superheating Elements). Steam now: %s mB/t.\nHeat comes from touching Heaters or through Thermodynamic Conductors."],
    "cl.mkn.sps": ["SPS: polônio %s mB, antimatéria %s mB. 1.000 mB de polônio + 1.000.000 J por mB = 1 mB de antimatéria. A energia entra pelas Bobinas Supercarregadas nas Portas.", "SPS: polonium %s mB, antimatter %s mB. 1,000 mB of polonium + 1,000,000 J per mB = 1 mB of antimatter. Energy comes in through Supercharged Coils on the Ports."],
    "cl.mkn.fissao": ["Reator de Fissão (%s conjuntos): %s. Queima %s mB/t (máx. %s).\nCombustível %s, água %s, vapor %s, resíduo %s. Dano %s%%.\nSem água bastante o reator esquenta e se danifica; com 100%% de dano, ele derrete (explosão e radiação).", "Fission Reactor (%s assemblies): %s. Burns %s mB/t (max %s).\nFuel %s, water %s, steam %s, waste %s. Damage %s%%.\nWithout enough water the reactor heats up and gets damaged; at 100%% damage it melts down (explosion and radiation)."],
    "cl.mkn.fissao.ligar": ["Ligado", "Active"],
    "cl.mkn.fissao.taxa": ["Queima (mB/t)", "Burn rate (mB/t)"],
    "cl.mkn.fissao.scram": ["Desligar sozinho com 80% de dano (Adaptador Lógico)", "Shut down at 80% damage (Logic Adapter)"],
    "cl.mkn.ligado": ["ligado", "active"], "cl.mkn.desligado": ["desligado", "off"],
    "cl.mkn.derreteu": ["O Reator de Fissão derreteu!", "The Fission Reactor melted down!"],
    "cl.mkn.turbina": ["Turbina Industrial: vapor %s mB, fluxo %s mB/t, gerando %s/t.\nPás %s, bobinas %s, dispersores %s, ventilações %s, condensadores %s. Toque um Rotor com Pás da Turbina para pôr (2 por rotor).", "Industrial Turbine: steam %s mB, flow %s mB/t, making %s/t.\nBlades %s, coils %s, dispersers %s, vents %s, condensers %s. Tap a Rotor with Turbine Blades to add them (2 per rotor)."],
    "cl.mkn.pa": ["Pás neste rotor: %s/2.", "Blades on this rotor: %s/2."],
    "cl.mkn.fusao": ["Reator de Fusão: %s. Injeção %s mB/t, gerando %s/t.\nDeutério %s, trítio %s, D-T %s, água %s, vapor %s.\nPara acender: toque o Controlador com um Hohlraum e mire um Amplificador de Laser com 400 MJ na Matriz de Foco.", "Fusion Reactor: %s. Injection %s mB/t, making %s/t.\nDeuterium %s, tritium %s, D-T %s, water %s, steam %s.\nTo ignite: tap the Controller with a Hohlraum and aim a Laser Amplifier with 400 MJ at the Focus Matrix."],
    "cl.mkn.fusao.injecao": ["Injeção (mB/t)", "Injection rate (mB/t)"],
    "cl.mkn.aceso": ["aceso", "ignited"], "cl.mkn.apagado": ["apagado", "not ignited"],
    "cl.mkn.hohlraum": ["Hohlraum colocado: agora mire um Amplificador de Laser com 400 MJ na Matriz de Foco.", "Hohlraum inserted: now aim a Laser Amplifier with 400 MJ at the Focus Matrix."],
    "cl.mkn.acendeu": ["O Reator de Fusão acendeu!", "The Fusion Reactor ignited!"],
    // Máquinas
    "cl.mkn.aquecedor": ["Aquecedor Resistivo: %s J/t de calor (gasta a mesma energia). Toque agachado para mudar.", "Resistive Heater: %s J/t of heat (uses the same energy). Sneak-tap to change."],
    "cl.mkn.aquecedor.titulo": ["Aquecedor Resistivo", "Resistive Heater"],
    "cl.mkn.aquecedor.taxa": ["Calor (J/t)", "Heat (J/t)"],
    "cl.mkn.lenha": ["Aquecedor a Lenha: combustível de fornalha no baú de cima, 400 J/t de calor enquanto queima. Agora: %s.", "Fuelwood Heater: furnace fuel in the chest above, 400 J/t of heat while burning. Now: %s."],
    "cl.mkn.laser": ["Laser: 10.000 J/t, para a frente até 64 blocos. Quebra blocos (100.000 J por dureza), fere quem estiver no caminho e carrega Amplificadores.", "Laser: 10,000 J/t, forward up to 64 blocks. Breaks blocks (100,000 J per hardness), hurts anyone in the way and charges Amplifiers."],
    "cl.mkn.amplificador": ["Amplificador de Laser: %s guardados. Dispara tudo quando passa de %s (toque agachado para mudar).", "Laser Amplifier: %s stored. Fires everything when above %s (sneak-tap to change)."],
    "cl.mkn.amplificador.limite": ["Disparar ao passar de (MJ)", "Fire above (MJ)"],
    "cl.mkn.estabilizador": ["Estabilizador Dimensional: mantém este chunk carregado gastando 5.000 J/t (o Bedrock deixa 10 áreas no mundo). Agora: %s.", "Dimensional Stabilizer: keeps this chunk loaded using 5,000 J/t (Bedrock allows 10 areas per world). Now: %s."],
    "cl.mkn.barril": ["Barril de Resíduos Radioativos: %s. Guarda um químico radioativo (até 512.000 mB) e ele decai devagar.", "Radioactive Waste Barrel: %s. Holds one radioactive chemical (up to 512,000 mB) and it slowly decays."],
    "cl.mkn.liquidificador": ["Liquidificador Nutricional: comida no baú de cima vira Pasta Nutritiva (50 mB por ponto de fome). Baldes vazios no baú de cima saem cheios.", "Nutritional Liquifier: food in the chest above becomes Nutritional Paste (50 mB per hunger point). Empty buckets in the chest above come out full."],
    // Radiação
    "cl.mkn.geiger": ["Contador Geiger: %s aqui.", "Geiger Counter: %s here."],
    "cl.mkn.dosimetro": ["Dosímetro: você recebeu %s.", "Dosimeter: you have received %s."],
    "cl.mkn.radiacao.alta": ["Radiação alta! Saia daqui ou vista a roupa Hazmat.", "High radiation! Leave or wear the Hazmat suit."],
    "cl.mkn.radiacao.doente": ["Você está doente de radiação (%s).", "You have radiation sickness (%s)."],
    // Missões
    ...missao("mk_uranio", "Urânio", "Uranium", "Junte 8 Lingotes de Urânio (o minério fica no fundo do mundo).", "Collect 8 Uranium Ingots (the ore is near the bottom of the world)."),
    ...missao("mk_fissil", "Combustível Físsil", "Fissile Fuel", "Faça Combustível Físsil na Centrífuga Isotópica (hexafluoreto de urânio).", "Make Fissile Fuel in the Isotopic Centrifuge (uranium hexafluoride)."),
    ...missao("mk_multibloco", "Multibloco", "Multiblock", "Forme um multibloco do Mekanism (o Tanque Dinâmico é o mais simples: 3×3×3 oco).", "Form a Mekanism multiblock (the Dynamic Tank is the simplest: a hollow 3×3×3)."),
    ...missao("mk_inducao", "Matriz de Indução", "Induction Matrix", "Forme uma Matriz de Indução com uma Célula e um Provedor dentro.", "Form an Induction Matrix with a Cell and a Provider inside."),
    ...missao("mk_fissao", "Reator de Fissão", "Fission Reactor", "Ligue um Reator de Fissão com água e combustível físsil.", "Run a Fission Reactor with water and fissile fuel."),
    ...missao("mk_turbina", "Turbina Industrial", "Industrial Turbine", "Gere energia numa Turbina Industrial com o vapor do reator (ou da caldeira).", "Generate power in an Industrial Turbine with steam from the reactor (or boiler)."),
    ...missao("mk_antimateria", "Antimatéria", "Antimatter", "Faça uma Pastilha de Antimatéria (polônio no SPS, depois o Cristalizador).", "Make an Antimatter Pellet (polonium in the SPS, then the Crystallizer)."),
    ...missao("mk_fusao", "Fusão", "Fusion", "Acenda um Reator de Fusão.", "Ignite a Fusion Reactor."),
    ...missao("mk_hazmat", "Proteção", "Protection", "Vista a roupa Hazmat completa.", "Wear the full Hazmat suit."),
  },
  dados: {
    liquidos: Object.fromEntries(D.liquidos.map((l) => [l.q, `cl:${l.id}`])),
    celulas: Object.fromEntries(Object.entries(D.celulas).map(([t, j]) => [`cl:celula_inducao_${{ basic: "basico", advanced: "avancado", elite: "elite", ultimate: "definitivo" }[t]}`, j])),
    provedores: Object.fromEntries(Object.entries(D.provedores).map(([t, j]) => [`cl:provedor_inducao_${{ basic: "basico", advanced: "avancado", elite: "elite", ultimate: "definitivo" }[t]}`, j])),
    condutores: Object.fromEntries(D.condutores.map((c) => [`cl:${c.id}`, c.conducao])),
    energia: D.energia,
  },
};

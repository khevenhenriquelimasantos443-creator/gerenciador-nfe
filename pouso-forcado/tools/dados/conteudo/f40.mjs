// Fase 40 (1.20.0): Ender IO 9, a versão mais nova (Team Ender IO, ramo 26.3; CC0/Unlicense). Tudo o que o mod tem
// hoje e o pack ainda não tinha: Aço do End, Almário, pepitas e blocos das ligas, esferas de trituração, cristais e
// grãos, quartzo fundido e vidro transparente, as máquinas de almas (Fatiar e Emendar, Vinculador de Almas, Motor de
// Almas, Gerador de Monstros Energizado), o Crisol de Fermentação e os fluidos (em baldes), carregadores, obeliscos,
// Baú e Vácuo de XP, Dreno, tanques, a Estação Agrícola, os cajados, o Planador, o Eletroímã e mais condutos de
// energia. Os add-ons de antes (Endergy, Zoo, Machines) já vêm dentro do Ender IO 9.
// Itens, nomes (o pt_br do próprio mod), receitas e números: tools/dados/conteudo/enderio.json, lido do código do mod
// por tools/importar-enderio.py, que também copia a arte original. Scripts em scripts/maquinas/enderio9.ts.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const D = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "enderio.json"), "utf8"));
const N = D.numeros;
const EIO = { mod: "Ender IO" };
const E = (rf) => rf / 4000; // 1 E = 4.000 RF (µI do Ender IO = RF)

// Desenho gerado (só aparece se faltar a arte do mod).
const COR = { aco_negro: "#3c3f44", aco_end: "#e8e6b8", liga_energetica: "#f0a23a", liga_vibrante: "#a8e04a", liga_redstone: "#c43a3a",
  ferro_condutor: "#d9a0a0", ferro_pulsante: "#6fd6a8", almario: "#7a5a3a" };
function icone(id) {
  const cor = Object.entries(COR).find(([k]) => id.endsWith(k))?.[1] ?? "#8a8f99";
  if (id.startsWith("pepita_")) return `pepita:${cor}`;
  if (id.startsWith("esfera_")) return `bola:${cor}`;
  if (id.startsWith("po_") || id.startsWith("graos_")) return "po:#b0b4c0";
  if (id.startsWith("cristal_")) return "cristal:#7fd0c8";
  if (id.startsWith("engrenagem_")) return "engrenagem:#c08a3a";
  if (id.startsWith("balde_")) return "gota:#c8a040";
  if (id === "aco_end" || id === "almario") return `lingote:${cor}`;
  return "placa:#6a7080";
}
const UM = new Set(["frasco_alma", "gerador_quebrado", "cajado_viagem", "cajado_levitacao", "planador", "eletroima", "chave_yeta", "vara_experiencia",
  "simbolo_animal", "simbolo_monstro", "simbolo_jogador"]);
const BALDES = new Set(D.itens.filter((i) => i.balde).map((i) => i.id));
const COMP = {
  enderios: { "minecraft:food": { nutrition: 10, saturation_modifier: 0.8, can_always_eat: true, using_converts_to: "minecraft:bowl" },
    "minecraft:use_animation": "eat", "minecraft:use_modifiers": { use_duration: 1.6, movement_modifier: 0.35 } },
  cajado_viagem: { "minecraft:hand_equipped": true }, cajado_levitacao: { "minecraft:hand_equipped": true }, chave_yeta: { "minecraft:hand_equipped": true },
};

const caixa = ([o, t]) => ({ "minecraft:collision_box": { origin: o, size: t }, "minecraft:selection_box": { origin: o, size: t } });
// Obeliscos: base e pilar (o modelo do mod é um obelisco de 2 blocos de altura num bloco só).
const OBELISCO = { ossos: { base: [[[-6, 0, -6], [12, 4, 12]]], pilar: [[[-3, 4, -3], [6, 9, 6]]], ponta: [[[-2, 13, -2], [4, 3, 4]]] } };
// Barras: a cruz no meio (como as barras de ferro sem vizinhos).
const BARRAS = { ossos: { ns: [[[-1, 0, -8], [2, 16, 16]]], lo: [[[-8, 0, -1], [16, 16, 2]]] } };
const TIPO_MAQ = {
  obelisco_xp: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
  obelisco_inibicao: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
  obelisco_aversao: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
  obelisco_atracao: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
  obelisco_relocacao: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
  obelisco_climatico: { geometria: OBELISCO, extra: caixa([[-6, 0, -6], [12, 16, 12]]) },
};
const TICK = { obelisco_xp: 0, bau_vacuo: 20, vacuo_xp: 20, tanque_fluido: 100, tanque_fluido_pressurizado: 100, obelisco_climatico: 100 };
const LUZ = { motor_almas: "verde", gerador_energizado: "violeta", vinculador_almas: "violeta", fatiar_emendar: "vermelho", crisol_fermentacao: "verde",
  estacao_agricola: "verde", carregador_fio: "amarelo", carregador_sem_fio: "amarelo" };

// Condutos de energia novos: o mesmo modelo do Conduto de Energia (f32).
const LIGACOES = { norte: "cl:n", sul: "cl:s", leste: "cl:l", oeste: "cl:o", cima: "cl:cima", baixo: "cl:baixo" };
const CONDUTO = {
  centro: [[[-3, 5, -3], [6, 6, 6]]], norte: [[[-2, 6, -8], [4, 4, 5]]], sul: [[[-2, 6, 3], [4, 4, 5]]], leste: [[[3, 6, -2], [5, 4, 4]]],
  oeste: [[[-8, 6, -2], [5, 4, 4]]], cima: [[[-2, 11, -2], [4, 5, 4]]], baixo: [[[-2, 0, -2], [4, 5, 4]]],
};
const conduto = (id, pt, en, cor) => ({
  id, pt, en, tipo: "cubo", cor, padrao: "metal", dureza: 0.5, girar: false, ...EIO,
  estados: Object.fromEntries(Object.values(LIGACOES).map((e) => [e, [false, true]])),
  geometria: { ossos: CONDUTO, visivel: Object.fromEntries(Object.entries(LIGACOES).map(([o, e]) => [o, `q.block_state('${e}')`])) },
  extra: caixa([[-3, 5, -3], [6, 6, 6]]),
});

const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });

export default {
  fase: 40,
  mod: "Ender IO",
  itens: [
    ...D.itens.map((i) => ({ id: i.id, pt: i.pt, en: i.en, icone: icone(i.id), ...EIO, ...(UM.has(i.id) || BALDES.has(i.id) ? { pilha: 1 } : {}),
      ...(COMP[i.id] ? { comp: COMP[i.id] } : {}), ...(["cajado_viagem", "cajado_levitacao", "eletroima", "planador"].includes(i.id) ? { cat: "equipment" } : {}) })),
    { id: "frasco_alma_cheio", pt: "Frasco de Alma (com alma)", en: "Soul Vial (filled)", icone: "garrafa:#9fd8e8", pilha: 1, ...EIO },
  ],
  blocos: [
    ...D.blocos.map((b) => {
      const vidro = /quartzo_fundido|vidro_transparente/.test(b.id);
      const base = { id: b.id, pt: b.pt, en: b.en, tipo: vidro ? "vidro" : "cubo", cor: vidro ? "#e8f0f4" : "#5a5e66", padrao: "metal", dureza: 3, girar: false, ...EIO };
      if (b.id.endsWith("_iluminado")) base.luzEmite = 15;
      if (b.id === "obsidiana_reforcada") Object.assign(base, { dureza: 50, extra: { "minecraft:destructible_by_explosion": false } });
      if (b.id === "isolamento_industrial") Object.assign(base, { padrao: "liso", dureza: 1 });
      if (b.id === "chassi_almas") Object.assign(base, { tipo: "maquina", luz: "violeta", glifo: "grade" });
      if (b.id.startsWith("barras_")) Object.assign(base, { geometria: BARRAS, extra: caixa([[-8, 0, -1], [16, 16, 2]]), dureza: 5 });
      return base;
    }),
    ...D.maquinas.map((m) => ({
      id: m.id, pt: m.pt, en: m.en, tipo: "maquina", luz: LUZ[m.id] ?? "violeta", glifo: "engrenagem", ...EIO,
      ...(TICK[m.id] === 0 ? {} : { comp: `cl:eio_${m.id}`, tick: TICK[m.id] ?? 100 }),
      ...(TICK[m.id] === 0 ? { comp: `cl:eio_${m.id}` } : {}),
      ...(TIPO_MAQ[m.id] ? { ...TIPO_MAQ[m.id], girar: false } : {}),
    })),
    conduto("conduto_energia_aprimorado", "Condutor de Energia Aprimorado", "Enhanced Energy Conduit", "#f0a23a"),
    conduto("conduto_energia_ender", "Condutor de Energia do Ender", "Ender Energy Conduit", "#a8e04a"),
  ],
  receitas: D.receitas,
  dados: {
    ligas: D.ligas.map((l) => ({ entra: l.entra, sai: l.sai, ce: Math.round(l.rf / 40) })),
    moagem: D.moagem.map((m) => ({ entra: m.entra, sai: m.sai, ce: Math.round(m.rf / 40), bonus: m.bonus !== "none" })),
    fatiar: D.fatiar.map((f) => ({ entra: f.entra, sai: f.sai, ce: Math.round(f.rf / 40) })),
    almas: D.almas.map((a) => ({ entra: a.entra, alma: a.alma, sai: a.sai, ce: Math.round(a.rf / 40), xp: a.xp })),
    cuba: D.cuba,
    tanque: D.tanque,
    fogo: D.fogo,
    clima: D.clima,
    esferas: N.esferas,
    motor: N.motor,
    gerador: N.gerador,
    obeliscos: N.obeliscos,
    viagem: N.viagem,
    levitacao: N.levitacao,
    eletroima: N.eletroima,
    enderios: N.enderios,
    graoFogo: N.graoFogo,
    cabecaChance: N.cabecaChance,
    // Gerador Stirling: µI/t, a queima vale 37,5% do tempo de fornalha × 80% de eficiência (capacitor básico).
    stirling: { porTick: N.stirling.geracao, fator: N.stirling.queima * (N.stirling.eficiencia / 100) },
    // Por ciclo de 5 s (100 ticks), em E.
    paineis: Object.fromEntries(Object.entries(N.solar).map(([id, rft]) => [`cl:${id}`, rft])),
    bancos: Object.fromEntries(Object.entries(N.bancos).map(([id, rf]) => [`cl:${id}`, E(rf)])),
    usoCE: Object.fromEntries(Object.entries(N.uso).map(([k, rft]) => [k, Math.round((rft * 100) / 40)])),
    carregador: { fioPorCiclo: E(N.carregadorFio * 100), semFioPorCiclo: E(N.carregadorSemFio.porTick * 100), alcance: N.carregadorSemFio.alcance },
    renomear: D.renomear,
  },
  textos: {
    "cl.eio9.fatiar": ["Fatiar e Emendar: os 6 itens da receita no baú de cima; o resultado vai para o baú de baixo. %s por peça.", "Slice'N'Splice: the 6 recipe items in the chest above; the result goes to the chest below. %s per piece."],
    "cl.eio9.vinculador": ["Vinculador de Almas: um Frasco de Alma com alma e o item no baú de cima. Tira os níveis de XP de quem estiver perto (até 5 blocos).", "Soul Binder: a filled Soul Vial and the item in the chest above. Takes XP levels from whoever is nearby (up to 5 blocks)."],
    "cl.eio9.vinculador_xp": ["Vinculador de Almas: falta XP (%s níveis). Fique perto da máquina.", "Soul Binder: not enough XP (%s levels). Stay near the machine."],
    "cl.eio9.crisol": ["Crisol: %s mB de %s, saída %s mB de %s. Baldes e os 2 reagentes no baú de cima; baldes vazios para a saída.", "VAT: %s mB of %s, output %s mB of %s. Buckets and the 2 reagents in the chest above; empty buckets for the output."],
    "cl.eio9.crisol_vazio": ["Crisol de Fermentação: ponha baldes (água, Hootch...) e os reagentes no baú de cima.", "VAT: put buckets (water, Hootch...) and the reagents in the chest above."],
    "cl.eio9.motor": ["Motor de Almas (%s): %s. Fluido: %s mB. Baldes de %s no baú de cima.", "Soul Engine (%s): %s. Fluid: %s mB. Buckets of %s in the chest above."],
    "cl.eio9.motor_sem_alma": ["Motor de Almas sem alma: toque com um Frasco de Alma com zumbi, creeper, enderman ou blaze.", "Soul Engine without a soul: tap it with a Soul Vial holding a zombie, creeper, enderman or blaze."],
    "cl.eio9.gerador": ["Gerador Energizado (%s): %s de %s para os próximos %s.", "Powered Spawner (%s): %s of %s for the next %s."],
    "cl.eio9.gerador_sem_alma": ["Gerador Energizado sem alma: toque com um Frasco de Alma com o monstro que ele vai criar.", "Powered Spawner without a soul: tap it with a Soul Vial holding the mob it should spawn."],
    "cl.eio9.alma_posta": ["Alma posta: %s.", "Soul bound: %s."],
    "cl.eio9.alma_ruim": ["Essa alma não serve aqui.", "That soul doesn't work here."],
    "cl.eio9.frasco_pegou": ["Alma guardada: %s.", "Soul captured: %s."],
    "cl.eio9.frasco_nao": ["Essa criatura não cabe no frasco.", "That creature doesn't fit in the vial."],
    "cl.eio9.funil": ["Funil de Impulso: passa o que está no baú de cima para o de baixo (16 RF por item).", "Impulse Hopper: moves what is in the chest above to the one below (16 RF per item)."],
    "cl.eio9.carregador": ["Carregador com Fio: carrega cajados, Eletroímã e baterias do baú de cima e passa para o de baixo.", "Wired Charger: charges staffs, the Electromagnet and batteries from the chest above and moves them below."],
    "cl.eio9.carregador_sem_fio": ["Carregador Sem Fio: carrega os itens de energia de quem estiver a até %s blocos.", "Wireless Charger: charges the energy items of anyone within %s blocks."],
    "cl.eio9.obelisco_xp.titulo": ["Obelisco de XP", "XP Obelisk"],
    "cl.eio9.obelisco_xp.corpo": ["Guardado: %s pontos de XP (%s níveis). Você: nível %s.", "Stored: %s XP points (%s levels). You: level %s."],
    "cl.eio9.xp_guardar1": ["Guardar 1 nível", "Store 1 level"], "cl.eio9.xp_guardar10": ["Guardar 10 níveis", "Store 10 levels"],
    "cl.eio9.xp_guardar_tudo": ["Guardar tudo", "Store all"], "cl.eio9.xp_tirar1": ["Pegar 1 nível", "Take 1 level"],
    "cl.eio9.xp_tirar10": ["Pegar 10 níveis", "Take 10 levels"], "cl.eio9.xp_tirar_tudo": ["Pegar tudo", "Take all"],
    "cl.eio9.vacuo_xp": ["Vácuo de XP: puxa as bolinhas de XP a até 8 blocos para cima dele.", "XP Vacuum: pulls XP orbs within 8 blocks on top of it."],
    "cl.eio9.bau_vacuo": ["Baú de Vácuo: puxa os itens soltos a até 6 blocos para o baú embaixo dele.", "Vacuum Chest: pulls loose items within 6 blocks into the chest below it."],
    "cl.eio9.obelisco": ["%s: %s. Alcance %s blocos. Gasta 20 RF/t da rede.", "%s: %s. Range %s blocks. Uses 20 RF/t from the network."],
    "cl.eio9.ligado": ["ligado", "on"], "cl.eio9.desligou": ["desligado", "off"], "cl.eio9.desligado": ["sem energia", "no power"],
    "cl.eio9.clima": ["Obelisco Climático: toque com (ou ponha no baú de cima) Luz Solar Líquida (tempo bom), Semente de Nuvem (chuva) ou Semente de Nuvem Concentrada (tempestade).", "Weather Obelisk: tap with (or put in the chest above) Liquid Sunshine (clear), Cloud Seed (rain) or Concentrated Cloud Seed (thunder)."],
    "cl.eio9.clima_feito": ["O tempo vai mudar.", "The weather is changing."],
    "cl.eio9.dreno": ["Dreno: %s mB de %s. Puxa água ou lava a até 5 blocos; baldes vazios no baú de cima saem cheios.", "Drain: %s mB of %s. Pulls water or lava within 5 blocks; empty buckets in the chest above come out full."],
    "cl.eio9.tanque": ["Tanque: %s mB de %s (até %s mB). Toque com um balde para pôr ou tirar. Baú em cima: enche itens (pó de concreto, graveto, garrafa de XP).", "Tank: %s mB of %s (up to %s mB). Tap with a bucket to fill or drain. Chest above: fills items (concrete powder, stick, XP bottle)."],
    "cl.eio9.vazio": ["vazio", "empty"],
    "cl.eio9.estacao": ["Estação Agrícola: planta, aduba (farinha de osso ou Graveto Nutritivo) e colhe em 11×11 em volta, no mesmo nível. Sementes no baú de cima; a colheita vai para o de baixo.", "Farming Station: plants, fertilizes (bone meal or Nutritious Stick) and harvests 11×11 around it, on the same level. Seeds in the chest above; the harvest goes to the chest below."],
    "cl.eio9.energia_item": ["%s de %s", "%s of %s"],
    "cl.eio9.cajado_sem": ["Cajado sem energia: carregue no Carregador com Fio.", "Staff out of energy: charge it in the Wired Charger."],
    "cl.eio9.eletroima": ["Eletroímã: %s.", "Electromagnet: %s."],
    "cl.eio9.graos": ["O fogo deixou %s.", "The fire left %s."],
    "cl.eio9.livro": ["Ender IO 9: ponha fogo em pedra do abismo ou rocha matriz e espere para ganhar Grãos do Infinito. Capture almas com o Frasco de Alma. A espada O Ender às vezes corta a cabeça do monstro (7%).", "Ender IO 9: set fire on deepslate or bedrock and wait to get Grains of Infinity. Capture souls with the Soul Vial. The Ender sword sometimes takes the mob's head (7%)."],
    ...missao("eio_graos", "Grãos do Infinito", "Grains of Infinity", "Ponha fogo em pedra do abismo (ou rocha matriz) e junte 4 Grãos do Infinito.", "Set fire on deepslate (or bedrock) and collect 4 Grains of Infinity."),
    ...missao("eio_almario", "Almário", "Soularium", "Faça 4 Lingotes de Almário (areia das almas e ouro) na Fundição de Ligas.", "Make 4 Soularium Ingots (soul sand and gold) in the Alloy Smelter."),
    ...missao("eio_frasco", "Alma no frasco", "Soul in a vial", "Capture uma criatura: bata nela com o Frasco de Alma na mão.", "Capture a creature: hit it with the Soul Vial in hand."),
    ...missao("eio_cabeca", "O Ender", "The Ender", "Corte a cabeça de um monstro com a espada O Ender.", "Take a mob's head with The Ender sword."),
    ...missao("eio_fatiar", "Fatiar e Emendar", "Slice'N'Splice", "Faça um Controlador Lógico Z ou um Eletrodo Zumbi.", "Make a Z-Logic Controller or a Zombie Electrode."),
    ...missao("eio_vinculador", "Vincular almas", "Binding souls", "Use o Vinculador de Almas (Cristal Sedutor, Cristal do Ender, Frank'N'Zumbi...).", "Use the Soul Binder (Enticing Crystal, Ender Crystal, Frank'N'Zombie...)."),
    ...missao("eio_crisol", "Hootch", "Hootch", "Faça um Balde de Hootch no Crisol de Fermentação (água, sementes e colheitas).", "Make a Hootch Bucket in the VAT (water, seeds and crops)."),
    ...missao("eio_motor", "Motor de Almas", "Soul Engine", "Ponha uma alma num Motor de Almas e gere energia.", "Bind a soul to a Soul Engine and generate power."),
    ...missao("eio_gerador", "Criadouro", "Spawner", "Ponha uma alma num Gerador de Monstros Energizado.", "Bind a soul to a Powered Spawner."),
    ...missao("eio_xp", "Guardar XP", "Storing XP", "Guarde níveis de XP num Obelisco de XP.", "Store XP levels in an XP Obelisk."),
    ...missao("eio_cajado", "Cajado de Viagem", "Staff of Travelling", "Viaje com o Cajado de Viagem.", "Travel with the Staff of Travelling."),
    ...missao("eio_estacao", "Fazenda automática", "Automatic farm", "Coloque uma Estação Agrícola.", "Place a Farming Station."),
  },
};

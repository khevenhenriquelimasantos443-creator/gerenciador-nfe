// Fase 70 (1.53.0): Mekanism completo, parte 5: equipamentos (Meka-Tool, MekaSuit e os 33 módulos, Desintegrador Atômico,
// Arco Elétrico, Lança-Chamas, Corredores, Jetpack Blindado, Mergulho, Configurador, Leitor de Rede, Dicionário, Conta-Gotas,
// Cantil, Caixa de Papelão), a QIO (matriz de discos, painel, importador, exportador) e o Robit (Mekanism 10.7.19, MIT;
// tools/importar-mekanism-completo.py grava mekanism_p5.json com a arte, os modelos e as receitas do mod).
// Scripts em scripts/maquinas/mekanism_equipamentos.ts, mekanism_qio.ts e mekanism_robit.ts.
import { readFileSync } from "node:fs";

const D = JSON.parse(readFileSync(new URL("mekanism_p5.json", import.meta.url), "utf8"));
const MK = { mod: "Mekanism" };
const mat = (tex) => ({ texture: tex, render_method: "alpha_test" });
const modelo = (m) => ({
  "minecraft:geometry": m.geometria,
  "minecraft:material_instances": { "*": mat(Object.values(m.materiais)[0]), ...Object.fromEntries(Object.entries(m.materiais).map(([k, v]) => [k, mat(v)])) },
  "minecraft:collision_box": m.caixa, "minecraft:selection_box": m.caixa, "minecraft:light_dampening": 0,
});
const missao = (id, pt, en, dpt, den) => ({ [`cl.missao.${id}.titulo`]: [pt, en], [`cl.missao.${id}.desc`]: [dpt, den] });
const BLOCOS_DE = "'stone', 'metal', 'rail', 'minecraft:is_pickaxe_item_destructible', 'wood', 'log', 'pumpkin', 'plant', 'minecraft:is_axe_item_destructible', " +
  "'dirt', 'sand', 'gravel', 'grass', 'snow', 'minecraft:is_shovel_item_destructible', 'minecraft:is_hoe_item_destructible', 'crop'";
const ferramenta = (vel, dano) => ({
  pilha: 1, cat: "equipment",
  comp: {
    "minecraft:hand_equipped": true,
    "minecraft:damage": { value: dano },
    "minecraft:digger": { use_efficiency: true, destroy_speeds: [{ block: { tags: `query.any_tag(${BLOCOS_DE})` }, speed: vel }] },
    "minecraft:enchantable": { slot: "pickaxe", value: 0 },
    "minecraft:tags": { tags: ["minecraft:is_pickaxe", "minecraft:is_axe", "minecraft:is_shovel", "minecraft:is_tool", "minecraft:netherite_tier", "cl:mk_ferramenta"] },
  },
});
const armadura = (slot, ench, prot, extra = {}) => ({
  pilha: 1, cat: "equipment",
  comp: { "minecraft:wearable": { slot, protection: prot }, "minecraft:enchantable": { slot: ench, value: 10 }, "minecraft:tags": { tags: ["minecraft:is_armor", ...(extra.tags ?? [])] } },
});
const ESPECIAL = {
  ferramenta_meka: ferramenta(16, 4),
  desmontador_atomico: ferramenta(12, 4),
  capacete_mekasuit: armadura("slot.armor.head", "armor_head", 3, { tags: ["cl:mekasuit"] }),
  peitoral_mekasuit: armadura("slot.armor.chest", "armor_torso", 8, { tags: ["cl:mekasuit"] }),
  calcas_mekasuit: armadura("slot.armor.legs", "armor_legs", 6, { tags: ["cl:mekasuit"] }),
  botas_mekasuit: armadura("slot.armor.feet", "armor_feet", 3, { tags: ["cl:mekasuit"] }),
  corredores_livres: armadura("slot.armor.feet", "armor_feet", 0),
  corredores_livres_blindados: armadura("slot.armor.feet", "armor_feet", 3),
  jetpack_blindado: armadura("slot.armor.chest", "armor_torso", 8),
  mascara_mergulho: armadura("slot.armor.head", "armor_head", 0),
  tanque_mergulho: armadura("slot.armor.chest", "armor_torso", 0),
};
const ICONE = { ferramenta_meka: "ferramenta:paxel:#3fd0ff", desmontador_atomico: "ferramenta:paxel:#9aa3ab", lanca_chamas: "manometro:#ff8a3a", corredores_livres: "botas:#4a8a3a",
  corredores_livres_blindados: "botas:#2f5a28", jetpack_blindado: "peitoral:#6a6f78", mascara_mergulho: "capacete:#d8b23a", tanque_mergulho: "garrafa:#d8b23a" };
const PT = { modulo_tosquia: "Unidade de Tosquia", modulo_fortuna: "Unidade de Fortuna", ferramenta_meka: "Meka-Tool", desmontador_atomico: "Desintegrador Atômico",
  corredores_livres: "Corredores Livres", corredores_livres_blindados: "Corredores Livres Blindados", unidade_qio_base: "Disco da QIO",
  unidade_qio_hiperdensa: "Disco Hiperdenso da QIO", unidade_qio_dilatacao: "Disco Dilatador do Tempo da QIO", unidade_qio_supermassiva: "Disco Supermassivo da QIO",
  painel_qio_portatil: "Painel Portátil da QIO" };
const UMA = new Set(["arco_eletrico", "lanca_chamas", "configurador", "leitor_rede", "dicionario", "conta_gotas", "cantil", "cartao_configuracao", "painel_qio_portatil",
  "elitro_pead"]);
const COMP_BLOCO = { estacao_modificacao: "cl:mk_equip", matriz_unidades_qio: "cl:mk_qio", painel_qio: "cl:mk_qio", importador_qio: "cl:mk_qio", exportador_qio: "cl:mk_qio",
  adaptador_redstone_qio: "cl:mk_qio" };

export default {
  fase: 70,
  mod: "Mekanism",
  itens: D.itens.map((i) => ({
    id: i.id, pt: PT[i.id] ?? i.pt, en: i.en, icone: ICONE[i.id] ?? (i.modulo ? "chip:#3fd0ff" : "tablet:#9aa3ab"), ...MK,
    ...(ESPECIAL[i.id] ?? (UMA.has(i.id) ? { pilha: 1 } : {})),
  })),
  blocos: D.blocos.map((b) => ({
    id: b.id, pt: b.pt, en: b.en, tipo: COMP_BLOCO[b.id] ? "maquina" : "cubo", cor: "#5a6470", dureza: 3, luz: "ciano", glifo: "engrenagem", ...MK,
    ...(COMP_BLOCO[b.id] ? { comp: COMP_BLOCO[b.id], tick: b.id === "importador_qio" || b.id === "exportador_qio" ? 10 : 20 } : {}),
    ...(b.id === "bau_pessoal" ? { comp: "cl:bau_grande" } : {}),
    ...(b.modelo ? { extra: modelo(b.modelo) } : {}),
  })),
  receitas: D.receitas,
  textos: {
    "entity.cl:robit.name": ["Robit", "Robit"],
    // Energia e módulos
    "cl.mke.sem_energia": ["%s sem energia (carregue num carregador).", "%s out of energy (charge it in a charger)."],
    "cl.mke.estacao": ["Estação de Modificação", "Modification Station"],
    "cl.mke.estacao.corpo": ["%s · %s\n\nMódulos instalados: %s\n\nToque um módulo da sua mochila para instalar (gasta o item) ou um instalado para tirar.", "%s · %s\n\nInstalled modules: %s\n\nTap a module from your inventory to install it (uses the item) or an installed one to remove it."],
    "cl.mke.estacao.mao": ["Segure a Meka-Tool ou uma peça da MekaSuit e toque a Estação.", "Hold the Meka-Tool or a MekaSuit piece and tap the Station."],
    "cl.mke.instalar": ["Instalar: %s (%s/%s)", "Install: %s (%s/%s)"],
    "cl.mke.tirar": ["Tirar: %s (%s)", "Remove: %s (%s)"],
    "cl.mke.nenhum": ["nenhum", "none"],
    "cl.mke.modo": ["%s: modo %s.", "%s: %s mode."],
    "cl.mke.modo.normal": ["normal", "normal"], "cl.mke.modo.veio": ["veio (minérios e toras ligados)", "vein (connected ores and logs)"],
    "cl.mke.modo.veio_estendido": ["veio estendido (qualquer bloco igual ligado)", "extended vein (any connected matching block)"],
    "cl.mke.modo.fogo": ["flechas de fogo", "flame arrows"], "cl.mke.modo.combate": ["combate", "combat"], "cl.mke.modo.calor": ["calor (funde o que atinge)", "heat (smelts what it hits)"],
    "cl.mke.modo.inferno": ["inferno (põe fogo)", "inferno (sets fire)"],
    "cl.mke.hidrogenio": ["Lança-Chamas: %s mB de hidrogênio (use um Cilindro de Hidrogênio agachado para encher).", "Flamethrower: %s mB of hydrogen (sneak-use a Hydrogen Tank to fill)."],
    "cl.mke.oxigenio": ["Tanque de Mergulho: %s mB de oxigênio (use um Cilindro de Oxigênio agachado para encher).", "Scuba Tank: %s mB of oxygen (sneak-use an Oxygen Tank to fill)."],
    "cl.mke.cantil": ["Cantil: %s mB de pasta nutritiva (use agachado com Baldes de Pasta Nutritiva na mochila para encher).", "Canteen: %s mB of nutritional paste (sneak-use with Nutritional Paste Buckets in your inventory to fill)."],
    "cl.mke.rede": ["Rede: %s blocos de energia, %s baterias/células, %s guardados.", "Network: %s energy blocks, %s batteries/cells, %s stored."],
    "cl.mke.tags": ["%s: %s", "%s: %s"],
    "cl.mke.sem_tags": ["sem etiquetas", "no tags"],
    "cl.mke.conta_gotas": ["%s (agachado: esvazia)", "%s (sneak: empties)"],
    "cl.mke.esvaziou": ["Esvaziado.", "Emptied."],
    "cl.mke.configurador": ["Girou.", "Rotated."],
    "cl.mke.caixa_cheia": ["Caixa de Papelão com %s. Ponha no chão para tirar.", "Cardboard Box with %s. Place it to unpack."],
    "cl.mke.caixa_nao": ["Esse bloco não cabe na caixa.", "That block does not fit in the box."],
    "cl.mke.teleporte_longe": ["Longe demais (até 100 blocos).", "Too far (up to 100 blocks)."],
    // QIO
    "cl.mkqio.titulo": ["QIO · %s", "QIO · %s"],
    "cl.mkqio.corpo": ["%s itens de %s · %s tipos de %s", "%s items of %s · %s types of %s"],
    "cl.mkqio.guardar": ["Guardar tudo da mochila", "Store the whole inventory"],
    "cl.mkqio.procurar": ["Procurar...", "Search..."],
    "cl.mkqio.busca": ["Nome ou id do item", "Item name or id"],
    "cl.mkqio.guardou": ["Guardou %s itens.", "Stored %s items."],
    "cl.mkqio.cheia": ["A QIO está cheia (ponha mais discos nas Matrizes).", "The QIO is full (put more drives in the Drive Arrays)."],
    "cl.mkqio.sem_freq": ["Sem frequência: toque agachado para escolher uma.", "No frequency: sneak-tap to choose one."],
    "cl.mkqio.matriz": ["Matriz de Discos: %s/12 discos. Toque com um disco para pôr; agachado tira o último.", "Drive Array: %s/12 drives. Tap with a drive to insert; sneak removes the last one."],
    "cl.mkqio.filtro": ["Itens (ids separados por vírgula; vazio = todos)", "Items (ids separated by commas; empty = all)"],
    "cl.mkqio.importador": ["Importador: puxa do inventário de trás para a QIO.", "Importer: pulls from the inventory behind into the QIO."],
    "cl.mkqio.exportador": ["Exportador: põe os itens do filtro no inventário de trás.", "Exporter: puts the filtered items into the inventory behind."],
    "cl.mkqio.redstone": ["Adaptador de Redstone: o Bedrock não deixa blocos de add-on emitirem redstone; ele mostra a contagem do item escolhido.", "Redstone Adapter: Bedrock does not let add-on blocks emit redstone; it shows the count of the chosen item."],
    // Robit
    "cl.mkr.titulo": ["Robit · %s", "Robit · %s"],
    "cl.mkr.corpo": ["Energia: %s / 100 kJ (recarrega no Carregador de Chão).\nItens: %s", "Energy: %s / 100 kJ (recharges on a Chargepad).\nItems: %s"],
    "cl.mkr.seguir": ["Seguir", "Follow"], "cl.mkr.parar": ["Ficar parado", "Stay"],
    "cl.mkr.pegar_on": ["Pegar itens do chão: ligado", "Pick up items: on"], "cl.mkr.pegar_off": ["Pegar itens do chão: desligado", "Pick up items: off"],
    "cl.mkr.fundir": ["Fundir o que dá (fornalha)", "Smelt what it can (furnace)"],
    "cl.mkr.casa": ["Voltar para o Carregador", "Go back to the Chargepad"],
    "cl.mkr.entregar": ["Me dar os itens", "Give me the items"],
    "cl.mkr.so_carregador": ["Ponha o Robit em cima de um Carregador de Chão.", "Place the Robit on top of a Chargepad."],
    "cl.mkr.sem_energia": ["O Robit ficou sem energia e parou.", "The Robit ran out of energy and stopped."],
    "cl.mkr.nao_dono": ["Esse Robit é de outro jogador.", "This Robit belongs to another player."],
    // Missões
    ...missao("mk_meka", "Meka-Tool", "Meka-Tool", "Faça a Meka-Tool (a evolução do Desintegrador Atômico).", "Make the Meka-Tool (the evolution of the Atomic Disassembler)."),
    ...missao("mk_modulo", "Módulos", "Modules", "Instale um módulo na Estação de Modificação.", "Install a module at the Modification Station."),
    ...missao("mk_mekasuit", "MekaSuit", "MekaSuit", "Vista a MekaSuit completa.", "Wear the full MekaSuit."),
    ...missao("mk_qio", "QIO", "QIO", "Guarde itens na QIO pelo Painel.", "Store items in the QIO through the Dashboard."),
    ...missao("mk_robit", "Robit", "Robit", "Ponha um Robit para andar com você.", "Get a Robit following you."),
  },
  dados: {
    qio: D.qio,
    gear: D.gear,
    baus: { bau_pessoal: 54 },
  },
};

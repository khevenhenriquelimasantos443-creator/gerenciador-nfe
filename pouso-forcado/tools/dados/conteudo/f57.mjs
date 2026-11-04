// Fase 57 (1.38.0): Immersive Engineering 12.4 (o mais novo, 1.21.1; BluSunrize e equipe, código GPLv3; a arte pede
// permissão, então é própria). Receitas e números por tools/importar-ie12.py (tools/dados/ie12.json); scripts em
// scripts/maquinas/immersive12.ts. No mod são multiblocos; aqui cada máquina é um bloco só, com o baú de entrada em cima
// e o de saída embaixo (como as outras máquinas do pack), energia da rede e os mesmos RF por operação do mod.
// - Prensa de Metal com moldes (chapa, engrenagem, haste e desembalar): chapas e engrenagens dos metais do pack, haste
//   de blaze com 5 pós de blaze.
// - Triturador (minério → 2 pós; arenito → areia + 50% de salitre), Serraria (tora → 6 tábuas + serragem).
// - Óleo e diesel: Espremedor (sementes → óleo vegetal), Fermentador (cana, batata, maçã... → etanol), Refinaria (óleo +
//   etanol, com salitre de catalisador → biodiesel) e Gerador a Diesel (4.096 RF/t; balde de biodiesel dura 250 ticks,
//   o de creosoto 20).
// - Gerador Termelétrico: quente de um lado e frio do outro (lava/magma 1.300 K, água 300 K, gelo 260 K, gelo compacto
//   240, gelo azul 200, neve 273): √(diferença)/2 RF/t por eixo.
// - Campânula de Jardim: semente + solo no baú de cima, colhe sozinha (8 RF/t, o tempo de cada planta do mod).
import { readFileSync } from "node:fs";

const IE = { mod: "Immersive Engineering" };
const D = JSON.parse(readFileSync(new URL("../ie12.json", import.meta.url), "utf8"));
const maq = (id, pt, en, luz, glifo, extra = {}) => ({ id, pt, en, tipo: "maquina", luz, glifo, comp: `cl:${id}`, tick: 20, ...IE, ...extra });
const molde = (id, pt, en) => ({ id, pt, en, icone: "placa:#6c7378", pilha: 1, ...IE });

export default {
  fase: 57,
  mod: "Immersive Engineering",
  itens: [
    molde("molde_chapa", "Molde de Chapa", "Metal Press Mold: Plate"),
    molde("molde_engrenagem", "Molde de Engrenagem", "Metal Press Mold: Gear"),
    molde("molde_haste", "Molde de Haste", "Metal Press Mold: Rod"),
    molde("molde_desembalar", "Molde de Desembalar", "Metal Press Mold: Unpacking"),
    { id: "po_salitre", pt: "Pó de Salitre", en: "Saltpeter Dust", icone: "po:#efe9dc", ...IE },
    { id: "balde_oleo_vegetal", pt: "Balde de Óleo Vegetal", en: "Plant Oil Bucket", icone: "gota:#c8b04a", pilha: 1, ...IE },
    { id: "balde_etanol", pt: "Balde de Etanol", en: "Ethanol Bucket", icone: "gota:#d8c8a8", pilha: 1, ...IE },
    { id: "balde_biodiesel", pt: "Balde de Biodiesel", en: "Biodiesel Bucket", icone: "gota:#c8962a", pilha: 1, ...IE },
  ],
  blocos: [
    maq("prensa_metal", "Prensa de Metal", "Metal Press", "laranja", "caixa"),
    maq("triturador_ie", "Triturador", "Crusher", "laranja", "engrenagem"),
    maq("serraria_ie", "Serraria", "Sawmill", "laranja", "serra"),
    maq("espremedor_ie", "Espremedor", "Squeezer", "amarelo", "gota"),
    maq("fermentador", "Fermentador", "Fermenter", "amarelo", "folha"),
    maq("refinaria_ie", "Refinaria", "Refinery", "amarelo", "gota"),
    maq("gerador_diesel", "Gerador a Diesel", "Diesel Generator", "vermelho", "chama"),
    maq("gerador_termeletrico", "Gerador Termelétrico", "Thermoelectric Generator", "vermelho", "raio"),
    maq("campanula", "Campânula de Jardim", "Garden Cloche", "verde", "folha"),
  ],
  receitas: [
    { id: "molde_chapa", tipo: "shaped", padrao: [" S ", "S S", " S "], chave: { S: "cl:placa_aco" }, resultado: "cl:molde_chapa" },
    { id: "molde_engrenagem", tipo: "shaped", padrao: ["S S", " S ", "S S"], chave: { S: "cl:placa_aco" }, resultado: "cl:molde_engrenagem" },
    { id: "molde_haste", tipo: "shaped", padrao: ["S  ", " S ", "  S"], chave: { S: "cl:placa_aco" }, resultado: "cl:molde_haste" },
    { id: "molde_desembalar", tipo: "shaped", padrao: ["SSS", "S S", "SSS"], chave: { S: "cl:placa_aco" }, resultado: "cl:molde_desembalar" },
    { id: "prensa_metal", tipo: "shaped", padrao: [" P ", "CBC", "SSS"], chave: { P: "minecraft:piston", C: "cl:componente_ferro", B: "cl:bobina_bt", S: "cl:placa_aco" }, resultado: "cl:prensa_metal" },
    { id: "triturador_ie", tipo: "shaped", padrao: ["HHH", "CFC", "SSS"], chave: { H: "minecraft:hopper", C: "cl:componente_ferro", F: "minecraft:flint", S: "cl:placa_aco" }, resultado: "cl:triturador_ie" },
    { id: "serraria_ie", tipo: "shaped", padrao: [" X ", "CBC", "WWW"], chave: { X: "minecraft:stonecutter_block", C: "cl:componente_ferro", B: "cl:bobina_bt", W: "cl:tabuas_tratadas" }, resultado: "cl:serraria_ie" },
    { id: "espremedor_ie", tipo: "shaped", padrao: ["PBP", "CWC", "SSS"], chave: { P: "minecraft:piston", B: "minecraft:bucket", C: "cl:componente_ferro", W: "cl:tabuas_tratadas", S: "cl:placa_ferro" }, resultado: "cl:espremedor_ie" },
    { id: "fermentador", tipo: "shaped", padrao: ["GBG", "CTC", "SSS"], chave: { G: "minecraft:glass", B: "minecraft:bucket", C: "cl:componente_ferro", T: "minecraft:cauldron", S: "cl:placa_ferro" }, resultado: "cl:fermentador" },
    { id: "refinaria_ie", tipo: "shaped", padrao: ["BGB", "CTC", "SSS"], chave: { B: "minecraft:bucket", G: "minecraft:glass", C: "cl:componente_ferro", T: "minecraft:cauldron", S: "cl:placa_aco" }, resultado: "cl:refinaria_ie" },
    { id: "gerador_diesel", tipo: "shaped", padrao: ["FBF", "CMC", "SSS"], chave: { F: "minecraft:furnace", B: "minecraft:bucket", C: "cl:componente_ferro", M: "cl:bobina_bt", S: "cl:placa_aco" }, resultado: "cl:gerador_diesel" },
    { id: "gerador_termeletrico", tipo: "shaped", padrao: ["SSS", "CRC", "CRC"], chave: { S: "cl:placa_ferro", C: "cl:placa_cobre", R: "minecraft:redstone" }, resultado: "cl:gerador_termeletrico" },
    { id: "campanula", tipo: "shaped", padrao: ["GGG", "G G", "WBW"], chave: { G: "minecraft:glass", W: "cl:tabuas_tratadas", B: "cl:bobina_bt" }, resultado: "cl:campanula" },
  ],
  textos: {
    "cl.ie12.tanque": ["%s: %s mB (ponha baldes vazios no baú de cima)", "%s: %s mB (put empty buckets in the chest above)"],
    "cl.ie12.oleo": ["Óleo vegetal", "Plant oil"], "cl.ie12.etanol": ["Etanol", "Ethanol"],
    "cl.ie12.diesel": ["Gerador a Diesel: %s ticks de queima (4.096 RF/t)", "Diesel Generator: %s burn ticks (4,096 RF/t)"],
    "cl.ie12.termo": ["Gerador Termelétrico: %s RF/t", "Thermoelectric Generator: %s RF/t"],
    "cl.ie12.progresso": ["%s%%", "%s%%"],
    "cl.capitulo.ie12.nome": ["Immersive Engineering 12", "Immersive Engineering 12"],
    "cl.capitulo.ie12.curto": ["IE 12", "IE 12"],
    "cl.capitulo.ie12.desc": ["As máquinas do IE mais novo: Prensa de Metal, Triturador, Serraria, a linha do biodiesel (Espremedor, Fermentador, Refinaria e Gerador a Diesel), o Gerador Termelétrico e a Campânula de Jardim.", "The machines of the latest IE: Metal Press, Crusher, Sawmill, the biodiesel line (Squeezer, Fermenter, Refinery and Diesel Generator), the Thermoelectric Generator and the Garden Cloche."],
    "cl.missao.ie12_prensa.titulo": ["Prensa de Metal", "Metal Press"], "cl.missao.ie12_prensa.desc": ["Faça uma chapa ou engrenagem na Prensa de Metal.", "Make a plate or gear in the Metal Press."],
    "cl.missao.ie12_salitre.titulo": ["Salitre do deserto", "Desert saltpeter"], "cl.missao.ie12_salitre.desc": ["Triture arenito até sair Pó de Salitre.", "Crush sandstone until Saltpeter Dust comes out."],
    "cl.missao.ie12_biodiesel.titulo": ["Biodiesel", "Biodiesel"], "cl.missao.ie12_biodiesel.desc": ["Tenha um Balde de Biodiesel.", "Have a Biodiesel Bucket."],
    "cl.missao.ie12_diesel.titulo": ["Gerador a Diesel", "Diesel Generator"], "cl.missao.ie12_diesel.desc": ["Ligue um Gerador a Diesel com biodiesel.", "Run a Diesel Generator on biodiesel."],
    "cl.missao.ie12_termo.titulo": ["Quente e frio", "Hot and cold"], "cl.missao.ie12_termo.desc": ["Faça um Gerador Termelétrico gerar (lava de um lado, gelo do outro).", "Make a Thermoelectric Generator produce power (lava on one side, ice on the other)."],
    "cl.missao.ie12_campanula.titulo": ["Campânula de Jardim", "Garden Cloche"], "cl.missao.ie12_campanula.desc": ["Colha uma planta numa Campânula de Jardim.", "Harvest a plant in a Garden Cloche."],
  },
  dados: D,
};

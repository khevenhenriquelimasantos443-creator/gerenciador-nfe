// Fase 72 (1.56.0): as mesas do Tinkers' Construct com tela de espaços, como no Java (scripts/tinkers/telas_tc.ts).
// Os itens gui_* só existem dentro dessas telas (enfeite, setas e rótulos): não aparecem no inventário criativo nem no
// Catálogo e somem se saírem da tela. A arte deles fica em RP/textures/items/cl/arte/gui_*.png (tools/desenhar-gui-tc.py).
const TC = { mod: "Tinkers' Construct", cat: "none", pilha: 1 };

export default {
  fase: 72,
  mod: "Tinkers' Construct",
  itens: [
    { id: "gui_vazio", pt: "§8·", en: "§8·", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_seta", pt: "Pegue o resultado →", en: "Take the result →", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_padrao", pt: "↓ Padrão em Branco", en: "↓ Blank Pattern", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_material", pt: "↓ Material (tábuas, pedregulho, sílex, osso, linha...)", en: "↓ Material (planks, cobblestone, flint, bone, string...)", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_ferramenta", pt: "↓ Ferramenta (para consertar ou modificar)", en: "↓ Tool (to repair or modify)", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_pecas", pt: "↓ Peças, ou material de conserto, ou itens do modificador", en: "↓ Parts, or repair material, or modifier items", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_ajuda_pecas", pt: "Padrão em Branco + material à esquerda; toque na peça que quiser à direita. Metal: só na Fundição.", en: "Blank Pattern + material on the left; tap the part you want on the right. Metal: Smeltery only.", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_ajuda_estacao", pt: "Montar: peças no meio. Consertar ou modificar: ferramenta à esquerda + material no meio. Agachado + tocar: traços.", en: "Build: parts in the middle. Repair or modify: tool on the left + material in the middle. Sneak + tap: traits.", icone: "placa:#2b2b2b", ...TC },
    // 1.57.0: a tela de espaços das máquinas (scripts/maquinas/espacos.ts).
    { id: "gui_entrada", pt: "← Entrada (ponha aqui o que a máquina usa)", en: "← Input (put what the machine uses here)", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_saida", pt: "← Saída (pegue aqui o que a máquina fez)", en: "← Output (take what the machine made here)", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_status", pt: "Estado da máquina", en: "Machine status", icone: "placa:#2b2b2b", ...TC },
    { id: "gui_ajuda_maquina", pt: "Agachado + tocar: detalhes e Catálogo. Com item na mão, o toque vai para a máquina (balde, melhoria...). Baú em cima/embaixo também vale.", en: "Sneak + tap: details and Catalog. Holding an item, the tap goes to the machine (bucket, upgrade...). A chest above/below also works.", icone: "placa:#2b2b2b", ...TC },
  ],
  blocos: [],
  receitas: [],
  textos: {
    "entity.cl:mesa_tc_pecas.name": ["Construtor de Peças", "Part Builder"],
    "entity.cl:mesa_tc_estacao.name": ["Estação de Ferramentas", "Tool Station"],
    "entity.cl:mesa_tc_bigorna.name": ["Bigorna do Tinker", "Tinker's Anvil"],
    "cl.tct.dica_pecas": ["Construtor de Peças: toque para abrir. Padrão em Branco + material à esquerda; pegue a peça à direita.", "Part Builder: tap to open. Blank Pattern + material on the left; take the part on the right."],
    "cl.tct.dica_estacao": ["Toque para abrir. Ponha as peças no meio e pegue a ferramenta à direita. Agachado + tocar: traços.", "Tap to open. Put the parts in the middle and take the tool on the right. Sneak + tap: traits."],
    "cl.tct.agachado": ["Traços", "Traits"],
    "entity.cl:maquina_tela.name": ["Máquina", "Machine"],
    "cl.esp.agachado": ["Detalhes", "Details"],
    "cl.esp.pronta": ["Esta máquina agora tem espaços, como no Java: toque de novo com a mão vazia para abrir.", "This machine now has slots, like on Java: tap again with an empty hand to open."],
    "cl.esp.dica": ["Toque com a mão vazia para abrir os espaços da máquina (entrada à esquerda, saída à direita).", "Tap with an empty hand to open the machine slots (input on the left, output on the right)."],
    "cl.missao.esp_maquina.titulo": ["Como no Java", "Like on Java"],
    "cl.missao.esp_maquina.desc": ["Ponha algo nos espaços de entrada de uma máquina (toque com a mão vazia) e pegue o que ela fizer na saída.", "Put something in a machine's input slots (tap with an empty hand) and take what it makes from the output."],
    "cl.tct.abra":["Toque de novo para abrir a tela.", "Tap again to open the screen."],
    "cl.tct.sem_peca": ["Esse material não faz peça com esse padrão, ou falta material (a peça custa mais).", "This material makes no part with this pattern, or there is not enough of it (the part costs more)."],
    "cl.tct.nao_material": ["Isso não é material de peça (tábuas, pedregulho, sílex, osso, cacto, obsidiana, linha, couro...).", "That is not a part material (planks, cobblestone, flint, bone, cactus, obsidian, string, leather...)."],
    "cl.tct.sem_receita": ["Essas peças não formam ferramenta. Picareta: cabeça de picareta + cabo + ligamento; Espada: lâmina + 2 cabos; Pá: cabeça de pá + cabo.", "These parts make no tool. Pickaxe: pickaxe head + handle + binding; Sword: blade + 2 handles; Shovel: shovel head + handle."],
    "cl.tct.cheia": ["A ferramenta já está inteira.", "The tool is already fully repaired."],
  },
};

// Armaduras do Mekanism Tools (1.7.0) e do Aço Negro do Ender IO (1.8.0): a textura da armadura de ferro do jogo (referencias/vanilla/armaduras/, dos
// exemplos oficiais Mojang/bedrock-samples) tingida com a cor de cada material, e os "attachables" que põem a peça
// no corpo do jogador (os modelos são os do próprio jogo). Roda à mão (os arquivos gerados vão no repositório):
//   node tools/gerar-armaduras.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gerarPng, lerPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const { MATERIAIS: MEK } = await import(pathToFileURL(join(RAIZ, "tools/dados/conteudo/f28.mjs")).href);
// [prefixo do id, material, cor]: os 6 do Mekanism Tools e o Aço Negro do Ender IO (1.8.0).
const MATERIAIS = [...MEK.map(([m, , , , cor]) => ["mk", m, cor]), ["eio", "aco_negro", "#3c3f44"]];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const PECAS = [
  ["capacete", "helmet", "helmet_layer_visible", 1],
  ["peitoral", "chestplate", "chest_layer_visible", 1],
  ["calcas", "leggings", "leg_layer_visible", 2],
  ["botas", "boots", "boot_layer_visible", 1],
];

// Materiais com a textura original do mod (tools/importar-originais.py, 1.10.1): não pinta por cima.
const USADOS = join(RAIZ, "docs/licencas/usados.json");
const originais = new Set(existsSync(USADOS) ? Object.values(JSON.parse(readFileSync(USADOS, "utf8"))).flat() : []);
mkdirSync(join(RAIZ, "RP/textures/models/armor/cl"), { recursive: true });
mkdirSync(join(RAIZ, "RP/attachables"), { recursive: true });
for (const camada of [1, 2]) {
  const { w, h, rgba } = lerPng(join(RAIZ, `referencias/vanilla/armaduras/iron_${camada}.png`));
  for (const [, m, cor] of MATERIAIS) {
    if (originais.has(`armadura ${m}_${camada}`)) continue;
    const c = hex(cor);
    const png = gerarPng(w, h, (x, y) => {
      const i = (y * w + x) * 4;
      const a = rgba[i + 3];
      if (!a) return [0, 0, 0, 0];
      // Brilho do ferro (cinza) vira tom do material: claro → cor clareada, escuro → cor escurecida.
      const l = (rgba[i] * 0.3 + rgba[i + 1] * 0.59 + rgba[i + 2] * 0.11) / 255;
      const k = 0.35 + l * 0.95;
      return [...c.map((v) => Math.max(0, Math.min(255, Math.round(v * k + (l > 0.85 ? (l - 0.85) * 400 : 0))))), a];
    });
    writeFileSync(join(RAIZ, `RP/textures/models/armor/cl/${m}_${camada}.png`), png);
  }
}
let n = 0;
for (const [pre, m] of MATERIAIS) {
  for (const [p, geo, variavel, camada] of PECAS) {
    const id = `cl:${pre}_${p}_${m}`;
    const att = {
      format_version: "1.10.0",
      "minecraft:attachable": {
        description: {
          identifier: id,
          materials: { default: "armor", enchanted: "armor_enchanted" },
          textures: { default: `textures/models/armor/cl/${m}_${camada}`, enchanted: "textures/misc/enchanted_item_glint" },
          geometry: { default: `geometry.player.armor.${geo}` },
          scripts: { parent_setup: `variable.${variavel} = 0.0;` },
          render_controllers: ["controller.render.armor"],
        },
      },
    };
    writeFileSync(join(RAIZ, `RP/attachables/${pre}_${p}_${m}.json`), JSON.stringify(att, null, 2) + "\n");
    n++;
  }
}
console.log(`armaduras: ${MATERIAIS.length} materiais, ${n} attachables`);

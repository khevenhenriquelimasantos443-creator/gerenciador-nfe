// Fase 14 (Pam's HarvestCraft): gera, a partir de tools/dados/harvestcraft.json,
// - BP: sementes, colheitas, comidas e intermediários (itens), plantações e utensílios (blocos), receitas;
// - RP: ícones (32×32), texturas das plantações (3 estágios), modelos dos utensílios, textos pt/en;
// - scripts/harvest/gerado.ts: listas e valores que os scripts usam (plantação, fome, sede).
// Roda no build antes do Catálogo e do tsc. Texturas e modelos são próprios (as do HarvestCraft
// não podem ser usadas: ver CREDITOS.md).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

// Toda receita aparece no livro de receitas desde o começo (1.3.2): o livro vira o "JEI" do inventário.
const SEMPRE = { context: "AlwaysUnlocked" };

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const D = JSON.parse(readFileSync(join(RAIZ, "tools/dados/harvestcraft.json"), "utf8"));
const T = 32;
const pasta = (rel) => (mkdirSync(join(RAIZ, rel), { recursive: true }), join(RAIZ, rel));
const json = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8"));

// ---------- pintura ----------
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const mul = (c, f) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
const ruido = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const elipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const borda = (dentro, x, y) => dentro(x, y) && (!dentro(x - 1, y) || !dentro(x + 1, y) || !dentro(x, y - 1) || !dentro(x, y + 1));
const png = (pintar) => gerarPng(T, T, (x, y) => {
  const p = pintar(x, y);
  return !p ? [0, 0, 0, 0] : p.length === 4 ? p : [...p, 255];
});
const VERDE = hex("#4f9a3a"), VERDE_ESC = hex("#2f6b25"), BRANCO = hex("#f4f1e8"), CERAMICA = hex("#e9e2d2");

/** Pinta uma forma cheia com contorno escuro e sombreado. */
function solido(dentro, cor, x, y, luz = 0.25) {
  if (!dentro(x, y)) return null;
  if (borda(dentro, x, y)) return mul(cor, 0.55);
  return mix(cor, [255, 255, 255], Math.max(0, luz - (x + y) / 80)) ;
}

// Colheitas (forma por cultura)
const COLHEITA = {
  milho: (c) => (x, y) => {
    const folha = (Math.abs(x - 8 - (y - 6) * 0.35) < 1.5 && y > 6 && y < 26) || (Math.abs(x - 24 + (y - 6) * 0.35) < 1.5 && y > 6 && y < 26);
    if (folha) return VERDE;
    const espiga = (a, b) => elipse(a, b, 16, 15, 5.5, 12);
    if (!espiga(x, y)) return null;
    if (borda(espiga, x, y)) return mul(c, 0.55);
    return (x + (y % 2)) % 2 ? c : mul(c, 0.85);
  },
  redondo: (c) => (x, y) => {
    if (y < 9 && Math.abs(x - 16) < 4 - Math.abs(y - 7)) return VERDE;
    return solido((a, b) => elipse(a, b, 16, 18, 11, 10), c, x, y, 0.35);
  },
  cebola: (c) => (x, y) => {
    if (y < 10 && Math.abs(x - 16) <= 1) return y < 6 ? VERDE : mul(c, 0.7);
    const bulbo = (a, b) => elipse(a, b, 16, 19, 10, 9) || (b < 14 && b > 8 && Math.abs(a - 16) < (b - 8) * 1.2);
    const p = solido(bulbo, c, x, y, 0.3);
    if (p && !borda(bulbo, x, y) && (x - 16) % 4 === 0) return mul(c, 0.8);
    return p;
  },
  graos: (c) => (x, y) => {
    const graos = [[10, 12], [17, 10], [22, 15], [13, 19], [20, 21], [9, 24], [24, 24], [16, 26]];
    for (const [gx, gy] of graos) if (elipse(x, y, gx, gy, 3.5, 2.5)) return solido((a, b) => elipse(a, b, gx, gy, 3.5, 2.5), c, x, y, 0.4);
    return null;
  },
  pimenta: (c) => (x, y) => {
    if (y < 8 && Math.abs(x - 10 - (8 - y) * 0.3) < 1.3) return VERDE;
    const d = (a, b) => b >= 7 && b <= 27 && Math.abs(a - (10 + (b - 7) * 0.6)) < 4 - (b - 7) * 0.17;
    return solido(d, c, x, y, 0.4);
  },
  pimentao: (c) => (x, y) => {
    if (y < 9 && Math.abs(x - 16) <= 1.5) return VERDE_ESC;
    const d = (a, b) => elipse(a, b, 12, 19, 7, 9.5) || elipse(a, b, 20, 19, 7, 9.5);
    const p = solido(d, c, x, y, 0.35);
    if (p && Math.abs(x - 16) < 0.6 && y > 12 && !borda(d, x, y)) return mul(c, 0.75);
    return p;
  },
  amendoim: (c) => (x, y) => {
    const d = (a, b) => elipse(a, b, 12, 13, 6, 6.5) || elipse(a, b, 20, 21, 6, 6.5) || (Math.abs(a - b + 1) < 4 && a > 11 && a < 21);
    const p = solido(d, c, x, y, 0.2);
    if (p && !borda(d, x, y) && ruido(x, y, 3) < 0.15) return mul(c, 0.8);
    return p;
  },
};

// Comidas e intermediários: "forma:cor"
const ICONE = {
  po: (c) => (x, y) => {
    const h = 26 - 9 * Math.max(0, 1 - ((x - 16) / 12) ** 2);
    if (y < h || y > 26 || x < 4 || x > 28) return null;
    return y < h + 1 ? mul(c, 0.85) : mix(c, mul(c, 0.88), ruido(x, y, 7));
  },
  bola: (c) => (x, y) => solido((a, b) => elipse(a, b, 16, 18, 10, 9), c, x, y, 0.35),
  tigela: (c) => (x, y) => {
    const tigela = (a, b) => b >= 15 && b <= 26 && elipse(a, b, 16, 15, 13, 11);
    if (y >= 12 && y <= 16 && elipse(x, y, 16, 14, 12, 3)) return mix(c, [255, 255, 255], ruido(x, y, 8) * 0.15);
    if (!tigela(x, y)) return null;
    return borda(tigela, x, y) ? mul(CERAMICA, 0.6) : mix(CERAMICA, mul(CERAMICA, 0.8), (y - 15) / 12);
  },
  prato: (c) => (x, y) => {
    if (elipse(x, y, 16, 18, 8, 6)) return solido((a, b) => elipse(a, b, 16, 18, 8, 6), c, x, y, 0.4);
    const prato = (a, b) => elipse(a, b, 16, 21, 14, 7);
    if (!prato(x, y)) return null;
    return borda(prato, x, y) ? mul(BRANCO, 0.6) : BRANCO;
  },
  copo: (c) => (x, y) => {
    const copo = (a, b) => b >= 6 && b <= 27 && Math.abs(a - 16) <= 7 - (b - 6) * 0.08;
    if (!copo(x, y)) return x === 21 && y >= 2 && y <= 12 ? hex("#ffffff") : null; // canudo
    if (borda(copo, x, y)) return hex("#9fb8c4");
    if (y < 9) return hex("#dcecf2");
    return mix(c, [255, 255, 255], (x === 11 ? 0.35 : 0) + 0.05);
  },
  bloco: (c) => (x, y) => {
    const topo = (a, b) => b >= 10 && b <= 15 && a >= 6 + (15 - b) && a <= 26 - (15 - b) * 0 ;
    const corpo = (a, b) => (b >= 13 && b <= 24 && a >= 6 && a <= 26) || topo(a, b);
    const p = solido(corpo, c, x, y, 0.3);
    if (p && y < 14 && !borda(corpo, x, y)) return mix(c, [255, 255, 255], 0.25);
    return p;
  },
  queijo: (c) => (x, y) => {
    const fatia = (a, b) => b >= 9 && b <= 24 && a >= 5 && a <= 27 && b >= 24 - (a - 5) * 0.7;
    const p = solido(fatia, c, x, y, 0.2);
    if (p && !borda(fatia, x, y) && (elipse(x, y, 20, 19, 2, 2) || elipse(x, y, 13, 21, 1.5, 1.5))) return mul(c, 0.75);
    return p;
  },
  pote: (c) => (x, y) => {
    if (y >= 5 && y <= 8 && Math.abs(x - 16) <= 6) return y === 5 || Math.abs(x - 16) === 6 ? hex("#6a6a6a") : hex("#9a9a9a");
    const pote = (a, b) => b >= 9 && b <= 27 && Math.abs(a - 16) <= 8;
    if (!pote(x, y)) return null;
    return borda(pote, x, y) ? hex("#9fb8c4") : mix(c, mul(c, 0.9), (x - 8) / 16);
  },
  ovo: () => (x, y) => {
    const clara = (a, b) => elipse(a, b, 16, 17, 12, 10) && ruido(a >> 2, b >> 2, 9) < 0.95;
    if (elipse(x, y, 15, 16, 4.5, 4)) return solido((a, b) => elipse(a, b, 15, 16, 4.5, 4), hex("#f6b21a"), x, y, 0.4);
    return solido(clara, BRANCO, x, y, 0.1);
  },
  pao: (c) => (x, y) => {
    const pao = (a, b) => elipse(a, b, 16, 18, 13, 8) && b > 12;
    const p = solido(pao, c, x, y, 0.35);
    if (p && !borda(pao, x, y) && (x - y + 40) % 7 === 0 && y < 18) return mul(c, 0.8);
    return p;
  },
  sanduiche: (c) => (x, y) => {
    const pao = hex("#d39a4a");
    if (elipse(x, y, 16, 11, 12, 5) && y <= 12) return solido((a, b) => elipse(a, b, 16, 11, 12, 5) && b <= 12, pao, x, y, 0.4);
    if (y >= 13 && y <= 15 && Math.abs(x - 16) <= 13) return y === 13 ? VERDE : c;
    if (y >= 16 && y <= 21 && Math.abs(x - 16) <= 12) return y === 21 || Math.abs(x - 16) === 12 ? mul(pao, 0.6) : mul(pao, 0.9);
    return null;
  },
  disco: (c) => (x, y) => solido((a, b) => elipse(a, b, 16, 17, 13, 9), c, x, y, 0.3),
  tira: (c) => (x, y) => {
    const tira = (a, b) => Math.abs(a - b) < 4 && a > 5 && a < 27;
    const p = solido(tira, c, x, y, 0.15);
    if (p && !borda(tira, x, y) && ruido(x, y, 4) < 0.2) return mul(c, 1.2);
    return p;
  },
  pipoca: () => (x, y) => {
    const balde = (a, b) => b >= 13 && b <= 28 && Math.abs(a - 16) <= 9 - (28 - b) * 0.05;
    if (y < 15 && elipse(x, y, 16, 12, 10, 6) && ruido(x >> 1, y >> 1, 5) < 0.9) return mix(hex("#fff6d8"), hex("#f2d06b"), ruido(x, y, 6) * 0.5);
    if (!balde(x, y)) return null;
    return Math.floor((x - 7) / 3) % 2 ? hex("#d62d20") : BRANCO;
  },
  espiga: () => (x, y) => {
    const e = (a, b) => elipse(a, b, 16, 16, 12, 5.5);
    if (!e(x, y)) return null;
    if (borda(e, x, y)) return hex("#9a7a20");
    if (y < 14 && x > 10 && x < 22) return hex("#fff1a8"); // manteiga derretendo
    return (x + (y % 2)) % 2 ? hex("#f2c94c") : hex("#e0b43a");
  },
  pilha: (c) => (x, y) => {
    for (const cy of [21, 17, 13]) {
      const d = (a, b) => elipse(a, b, 16, cy, 12, 4);
      if (d(x, y)) return solido(d, c, x, y, 0.2);
    }
    if (elipse(x, y, 16, 10, 4, 2)) return hex("#f7e27a");
    return null;
  },
};

// Semente: saquinho com a cor da cultura.
const SEMENTE = (c) => (x, y) => {
  const saco = (a, b) => b >= 7 && b <= 27 && a >= 8 && a <= 24;
  if (y >= 4 && y <= 7 && x >= 10 && x <= 22) return y === 4 ? hex("#7a5a35") : hex("#a07a4a");
  if (!saco(x, y)) return null;
  if (borda(saco, x, y)) return hex("#6b4a2b");
  if (elipse(x, y, 16, 17, 5, 5)) return solido((a, b) => elipse(a, b, 16, 17, 5, 5), c, x, y, 0.4);
  return mix(hex("#d8c08a"), hex("#c9ad74"), ruido(x, y, 10));
};

// Plantação: 3 estágios (broto, planta, madura com a colheita).
function estagio(cultura, k) {
  const c = hex(cultura.cor);
  if (cultura.deserto) {
    // Cacto baixo com frutas rosadas.
    return png((x, y) => {
      const alto = [10, 18, 24][k];
      const corpo = (a, b) => b >= 31 - alto && Math.abs(a - 16) <= 4;
      const braco = k > 0 && ((x >= 8 && x <= 11 && y >= 31 - alto + 6 && y <= 31 - alto + 12) || (x >= 21 && x <= 24 && y >= 31 - alto + 3 && y <= 31 - alto + 9));
      if (k === 2 && (elipse(x, y, 16, 31 - alto, 2.5, 2.5) || elipse(x, y, 9.5, 31 - alto + 5, 2, 2) || elipse(x, y, 22.5, 31 - alto + 2, 2, 2))) return c;
      if (corpo(x, y) || braco) return (x + y) % 5 === 0 ? hex("#cfe8a0") : mix(hex("#3f7a2a"), hex("#5a9a3a"), ruido(x, y, 11) * 0.5);
      return null;
    });
  }
  return png((x, y) => {
    const alto = [9, 18, 27][k];
    const caule = Math.abs(x - 16) <= 0.6 && y >= 31 - alto;
    if (caule) return VERDE_ESC;
    // Folhas alternadas ao longo do caule.
    for (let i = 0; i < k + 2; i++) {
      const fy = 31 - (i + 1) * (alto / (k + 2.5));
      const lado = i % 2 ? 1 : -1;
      if (elipse(x, y, 16 + lado * 5, fy, 5, 1.8)) return mix(VERDE_ESC, VERDE, 0.5 + ruido(x, y, 12) * 0.4);
    }
    if (k === 2) {
      const frutos = [[11, 10], [21, 14], [13, 18], [20, 7]];
      for (const [fx, fy] of frutos) if (elipse(x, y, fx, fy, 2.6, 2.6)) return mix(c, [255, 255, 255], (x + y) % 5 === 0 ? 0.25 : 0);
    }
    return null;
  });
}

// ---------- modelos dos utensílios (pixels de 0 a 16, como em gerar-visual.mjs) ----------
const cubo = (x0, y0, z0, x1, y1, z1, m) => ({ a: [x0, y0, z0], b: [x1, y1, z1], m });
const MODELOS = {
  tabua_corte: [cubo(2, 0, 4, 14, 1, 12, "madeira"), cubo(9, 1, 6, 13, 1.5, 7, "metal")],
  panela: [cubo(3, 0, 3, 13, 7, 13, "metal"), cubo(1, 5, 7, 3, 6, 9, "metal"), cubo(13, 5, 7, 15, 6, 9, "metal"), cubo(4, 7, 4, 12, 7.5, 12, "tampa")],
  frigideira: [cubo(2, 0, 2, 12, 2, 12, "metal"), cubo(12, 1, 6.5, 16, 2, 9.5, "madeira")],
  cacarola: [cubo(4, 0, 4, 11, 6, 11, "metal"), cubo(11, 4, 7, 16, 5, 8, "madeira")],
  assadeira: [cubo(1, 0, 2, 15, 2, 14, "metal")],
  pilao: [cubo(3, 0, 3, 13, 5, 13, "pedra"), cubo(8, 3, 8, 10, 11, 10, "madeira")],
  tigela_mistura: [cubo(2, 0, 2, 14, 5, 14, "madeira")],
  espremedor: [cubo(4, 0, 4, 12, 2, 12, "pedra"), cubo(6, 2, 6, 10, 6, 10, "pedra"), cubo(7, 6, 7, 9, 8, 9, "pedra")],
};
const TEX_UTENSILIO = { madeira: "textures/blocks/planks_oak", metal: "textures/blocks/iron_block", pedra: "textures/blocks/stone", tampa: "textures/blocks/iron_block" };
const FACES = ["north", "south", "east", "west", "up", "down"];
function uvDe(face, [x0, y0, z0], [x1, y1, z1]) {
  return { north: [16 - x1, 16 - y1, x1 - x0, y1 - y0], south: [x0, 16 - y1, x1 - x0, y1 - y0], east: [16 - z1, 16 - y1, z1 - z0, y1 - y0], west: [z0, 16 - y1, z1 - z0, y1 - y0], up: [x0, z0, x1 - x0, z1 - z0], down: [x0, 16 - z1, x1 - x0, z1 - z0] }[face];
}
function geometria(id, cubos) {
  return {
    format_version: "1.12.0",
    "minecraft:geometry": [{
      description: { identifier: `geometry.cl.${id}`, texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2, visible_bounds_offset: [0, 0.5, 0] },
      bones: [{ name: "corpo", pivot: [0, 0, 0], cubes: cubos.map((c) => ({
        origin: [c.a[0] - 8, c.a[1], c.a[2] - 8], size: [c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]],
        uv: Object.fromEntries(FACES.map((f) => { const [u, v, du, dv] = uvDe(f, c.a, c.b); return [f, { uv: [u, v], uv_size: [du || 0.01, dv || 0.01], material_instance: c.m }]; })),
      })) }],
    }],
  };
}
// Plantação: dois planos cruzados.
const GEO_PLANTA = {
  format_version: "1.12.0",
  "minecraft:geometry": [{
    description: { identifier: "geometry.cl.planta", texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2, visible_bounds_offset: [0, 0.5, 0] },
    bones: [{ name: "corpo", pivot: [0, 0, 0], cubes: [45, -45].map((r) => ({
      origin: [-8, 0, 0], size: [16, 16, 0], pivot: [0, 8, 0], rotation: [0, r, 0],
      uv: { north: { uv: [0, 0], uv_size: [16, 16] }, south: { uv: [16, 0], uv_size: [-16, 16] } },
    })) }],
  }],
};

// ---------- saída ----------
const itemTex = lerJson("RP/textures/item_texture.json");
const terreno = lerJson("RP/textures/terrain_texture.json");
const dirIcone = pasta("RP/textures/items/cl/hc");
const dirBloco = pasta("RP/textures/blocks/cl/hc");
pasta("RP/models/blocks");
pasta("BP/loot_tables/cl/hc");
const nomes = { pt: {}, en: {} };
const icone = (id, pintor) => {
  writeFileSync(join(dirIcone, `${id}.png`), png(pintor));
  itemTex.texture_data[`clhc_${id}`] = { textures: `textures/items/cl/hc/${id}` };
};
function item(id, comps, categoria = "items", stack = 64) {
  json(`BP/items/${id}.json`, {
    format_version: "1.21.60",
    "minecraft:item": {
      description: { identifier: `cl:${id}`, menu_category: { category: categoria } },
      components: { "minecraft:icon": `clhc_${id}`, "minecraft:display_name": { value: `item.cl:${id}.name` }, "minecraft:max_stack_size": stack, ...comps },
    },
  });
}
// Hunger Overhaul: pilha de 16 até 2 de fome; tempo de comer = fome × 8 + 8 ticks.
const comida = (fome, bebida = false) => ({
  "minecraft:use_animation": bebida ? "drink" : "eat",
  "minecraft:use_modifiers": { use_duration: (fome * 8 + 8) / 20, movement_modifier: 0.35 },
  "minecraft:food": { nutrition: fome, saturation_modifier: 0.1 },
});
const pilhaHO = (fome) => (fome <= 2 ? 16 : fome <= 5 ? 8 : 4);
const receita = (nome, corpo) => json(`BP/recipes/hc_${nome}.json`, { format_version: "1.20.10", ...corpo });
const ingrediente = (i) => (i.startsWith("#") ? { tag: i.slice(1) } : { item: i });

const valores = {}; // id -> [fome, sat] (para o Hunger Overhaul do script)
const bebidas = {}, temperaturas = {}, origem = [];

for (const c of D.culturas) {
  const semente = `semente_${c.id}`, planta = `planta_${c.id}`, produto = c.produto ?? `cl:${c.id}`;
  icone(semente, SEMENTE(hex(c.cor)));
  item(semente, { "minecraft:block_placer": { block: `cl:${planta}`, use_on: ["minecraft:farmland"] } }, "nature");
  if (!c.produto) {
    icone(c.id, COLHEITA[c.forma](hex(c.cor)));
    item(c.id, comida(1), "nature", 16);
    valores[`cl:${c.id}`] = [1, 0.1];
  }
  for (let k = 0; k < 3; k++) {
    writeFileSync(join(dirBloco, `${c.id}_${k}.png`), estagio(c, k));
    terreno.texture_data[`clhc_${c.id}_${k}`] = { textures: `textures/blocks/cl/hc/${c.id}_${k}` };
  }
  const material = (k) => ({ "*": { texture: `clhc_${c.id}_${k}`, render_method: "alpha_test", ambient_occlusion: 0, face_dimming: false } });
  json(`BP/blocks/${planta}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${planta}`, menu_category: { category: "none" }, states: { "cl:estagio": { values: { min: 0, max: 2 } } } },
      components: {
        "minecraft:geometry": "geometry.cl.planta",
        "minecraft:material_instances": material(0),
        "minecraft:collision_box": false,
        "minecraft:selection_box": { origin: [-6, 0, -6], size: [12, 8, 12] },
        "minecraft:destructible_by_mining": { seconds_to_destroy: 0 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 0 },
        "minecraft:light_dampening": 0,
        "minecraft:map_color": c.cor,
        "minecraft:loot": `loot_tables/cl/hc/${planta}.json`,
        "minecraft:placement_filter": { conditions: [{ allowed_faces: ["up"], block_filter: ["minecraft:farmland"] }] },
        "minecraft:tick": { interval_range: [600, 1200], looping: true },
        "cl:planta": {},
      },
      permutations: [1, 2].map((k) => ({ condition: `q.block_state('cl:estagio') == ${k}`, components: { "minecraft:material_instances": material(k) } })),
    },
  });
  // Quebrar: sempre 1 semente (a colheita da planta madura sai pelo script).
  json(`BP/loot_tables/cl/hc/${planta}.json`, { pools: [{ rolls: 1, entries: [{ type: "item", name: `cl:${semente}`, weight: 1 }] }] });
  receita(`semente_${c.id}`, {
    "minecraft:recipe_shapeless": { description: { identifier: `cl:hc_semente_${c.id}` }, tags: ["crafting_table"], ingredients: [{ item: produto }], unlock: SEMPRE, result: { item: `cl:${semente}` } },
  });
  nomes.pt[`item.cl:${semente}.name`] = `Sementes de ${c.pt}`;
  nomes.en[`item.cl:${semente}.name`] = `${c.en} Seeds`;
  nomes.pt[`tile.cl:${planta}.name`] = `Plantação de ${c.pt}`;
  nomes.en[`tile.cl:${planta}.name`] = `${c.en} Crop`;
  if (!c.produto) {
    nomes.pt[`item.cl:${c.id}.name`] = c.pt;
    nomes.en[`item.cl:${c.id}.name`] = c.en;
    origem.push(`cl:${c.id}`);
  }
  origem.push(`cl:${semente}`, `cl:${planta}`);
}
json("RP/models/blocks/cl_planta.geo.json", GEO_PLANTA);

for (const u of D.utensilios) {
  json(`RP/models/blocks/cl_${u.id}.geo.json`, geometria(u.id, MODELOS[u.id]));
  const usados = [...new Set(MODELOS[u.id].map((c) => c.m))];
  const mats = Object.fromEntries(usados.map((m) => [m, { texture: `clhc_u_${m}`, render_method: "opaque" }]));
  mats["*"] = mats[usados[0]];
  const caixa = MODELOS[u.id].reduce((b, c) => ({ min: c.a.map((v, i) => Math.min(b.min[i], v)), max: c.b.map((v, i) => Math.max(b.max[i], v)) }), { min: [16, 16, 16], max: [0, 0, 0] });
  const box = { origin: [caixa.min[0] - 8, caixa.min[1], caixa.min[2] - 8], size: caixa.max.map((v, i) => Math.max(1, Math.ceil(v - caixa.min[i]))) };
  json(`BP/blocks/${u.id}.json`, {
    format_version: "1.26.30",
    "minecraft:block": {
      description: { identifier: `cl:${u.id}`, menu_category: { category: "items" } },
      components: {
        "minecraft:geometry": `geometry.cl.${u.id}`,
        "minecraft:material_instances": mats,
        "minecraft:crafting_table": { crafting_tags: [`cl_${u.id}`], table_name: `tile.cl:${u.id}.name` },
        "minecraft:collision_box": box,
        "minecraft:selection_box": box,
        "minecraft:destructible_by_mining": { seconds_to_destroy: 0.6 },
        "minecraft:destructible_by_explosion": { explosion_resistance: 3 },
        "minecraft:light_dampening": 0,
        "minecraft:map_color": "#9a9a9a",
      },
    },
  });
  receita(u.id, {
    "minecraft:recipe_shaped": {
      description: { identifier: `cl:hc_${u.id}` }, tags: ["crafting_table"], pattern: u.padrao,
      key: Object.fromEntries(Object.entries(u.chave).map(([k, v]) => [k, ingrediente(v)])),
      unlock: SEMPRE, result: { item: `cl:${u.id}` },
    },
  });
  nomes.pt[`tile.cl:${u.id}.name`] = u.pt;
  nomes.en[`tile.cl:${u.id}.name`] = u.en;
  origem.push(`cl:${u.id}`);
}
for (const [m, caminho] of Object.entries(TEX_UTENSILIO)) terreno.texture_data[`clhc_u_${m}`] = { textures: caminho };

for (const f of D.comidas) {
  const id = f.mesmo ?? f.id;
  const resultado = f.resultado ?? `cl:${id}`;
  if (!f.mesmo && !f.resultado) {
    const [forma, cor] = f.icone.split(":");
    icone(f.id, ICONE[forma](cor ? hex(cor) : undefined));
    item(f.id, f.fome ? comida(f.fome, f.bebida) : {}, f.fome ? "nature" : "items", f.fome ? pilhaHO(f.fome) : 64);
    nomes.pt[`item.cl:${f.id}.name`] = f.pt;
    nomes.en[`item.cl:${f.id}.name`] = f.en;
    origem.push(`cl:${f.id}`);
    if (f.fome) valores[`cl:${f.id}`] = [f.fome, 0.1];
    if (f.agua) bebidas[`cl:${f.id}`] = f.agua;
    if (f.temp) temperaturas[`cl:${f.id}`] = f.temp;
  }
  receita(f.id, {
    "minecraft:recipe_shapeless": {
      description: { identifier: `cl:hc_${f.id}` }, tags: [f.em ? `cl_${f.em}` : "crafting_table"],
      ingredients: f.ingredientes.map(ingrediente), unlock: SEMPRE,
      result: f.qtd ? { item: resultado, count: f.qtd } : { item: resultado },
    },
  });
}
json("RP/textures/item_texture.json", itemTex);
json("RP/textures/terrain_texture.json", terreno);

// Textos: o trecho entre as marcas é refeito a cada build.
for (const [arq, lingua] of [["RP/texts/pt_BR.lang", "pt"], ["RP/texts/en_US.lang", "en"]]) {
  const INI = "## HarvestCraft (gerado por tools/gerar-harvestcraft.mjs)", FIM = "## fim HarvestCraft";
  let texto = readFileSync(join(RAIZ, arq), "utf8");
  const i = texto.indexOf(INI);
  if (i >= 0) texto = texto.slice(0, i) + texto.slice(texto.indexOf(FIM) + FIM.length + 1);
  const linhas = Object.entries(nomes[lingua]).map(([k, v]) => `${k}=${v}`);
  writeFileSync(join(RAIZ, arq), `${texto.trimEnd()}\n${INI}\n${linhas.join("\n")}\n${FIM}\n`);
}

pasta("scripts/harvest");
writeFileSync(join(RAIZ, "scripts/harvest/gerado.ts"), `// Gerado por tools/gerar-harvestcraft.mjs a partir de tools/dados/harvestcraft.json. Não edite à mão.
export const CULTURAS: ReadonlyArray<{ id: string; planta: string; semente: string; produto: string; deserto: boolean }> = ${JSON.stringify(
  D.culturas.map((c) => ({ id: c.id, planta: `cl:planta_${c.id}`, semente: `cl:semente_${c.id}`, produto: c.produto ?? `cl:${c.id}`, deserto: !!c.deserto })),
)};
export const UTENSILIOS: ReadonlyArray<string> = ${JSON.stringify(D.utensilios.map((u) => `cl:${u.id}`))};
// Fome e modificador de saturação das comidas do HarvestCraft (regra do Hunger Overhaul).
export const COMIDAS_HC: Readonly<Record<string, readonly [number, number]>> = ${JSON.stringify(valores)};
export const BEBIDAS_HC: Readonly<Record<string, number>> = ${JSON.stringify(bebidas)};
export const TEMPERATURA_HC: Readonly<Record<string, number>> = ${JSON.stringify(temperaturas)};
export const ITENS_HC: ReadonlyArray<string> = ${JSON.stringify(origem)};
`);
console.log(`harvestcraft: ${D.culturas.length} plantações, ${D.utensilios.length} utensílios, ${D.comidas.length} receitas de cozinha`);

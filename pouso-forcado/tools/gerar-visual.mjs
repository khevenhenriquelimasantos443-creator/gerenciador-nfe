// Visual das máquinas (Fase 9): estilo futurista e minimalista.
// Gera, sempre (não é placeholder):
//   RP/textures/blocks/cl/v/*.png        texturas 32x32 (as animadas são tiras verticais de quadros)
//   RP/textures/flipbook_textures.json   quais texturas são animadas
//   RP/models/blocks/cl_*.geo.json       modelos 3D de cada máquina
//   e atualiza RP/textures/terrain_texture.json e, em BP/blocks/*.json, só os componentes de
//   aparência (geometry, material_instances, caixas de colisão/seleção, luz e as permutações de textura).
// Paleta: corpo branco-gelo, base grafite e uma faixa de luz da cor da função
// (ciano = energia, laranja = calor, azul = água, verde = vida, violeta = armazenamento).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = 32; // lado das texturas

// ---------- cores e pintura ----------
const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const mul = (c, f) => c.map((v) => Math.max(0, Math.min(255, Math.round(v * f))));
const C = {
  branco: hex("#eef1f4"), branco2: hex("#d9dfe4"), costura: hex("#b9c2ca"), cinza: hex("#8e98a2"),
  grafite: hex("#2b3138"), grafite2: hex("#1d2228"), grafiteLuz: hex("#3c444d"),
  ciano: hex("#5ff3ff"), cianoEsc: hex("#1592b0"), laranja: hex("#ffa142"), laranjaEsc: hex("#c4521a"),
  azul: hex("#58b4ff"), azulEsc: hex("#1d4f9c"), verde: hex("#7dffa8"), verdeEsc: hex("#1f9c58"),
  violeta: hex("#c08cff"), violetaEsc: hex("#5b34a8"), tela: hex("#0d141b"), vidro: hex("#cfe9f2"),
};
const ruido = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

/** Textura de `quadros` quadros de T x T. pintar(x, y, quadro) -> [r,g,b] ou [r,g,b,a]. */
function textura(pintar, quadros = 1) {
  return gerarPng(T, T * quadros, (x, y) => {
    const p = pintar(x, y % T, Math.floor(y / T));
    return p.length === 4 ? p : [...p, 255];
  });
}

const borda = (x, y, n = 1) => x < n || y < n || x >= T - n || y >= T - n;

// Painel branco: leve degradê, costura de 1 px na borda (vira a junta entre peças) e brilho em cima.
const corpo = () =>
  textura((x, y) => {
    if (borda(x, y)) return C.costura;
    if (y === 1) return mix(C.branco, [255, 255, 255], 0.6);
    return mul(mix(C.branco, C.branco2, y / T), 0.985 + ruido(x, y, 1) * 0.03);
  });
// Painel com um friso no meio (variação para faces grandes).
const corpoFriso = () =>
  textura((x, y) => {
    if (borda(x, y)) return C.costura;
    if (y === 15 || y === 16) return C.costura;
    if (y === 17) return [255, 255, 255];
    return mul(mix(C.branco, C.branco2, y / T), 0.985 + ruido(x, y, 2) * 0.03);
  });
const grafite = () =>
  textura((x, y) => {
    if (borda(x, y)) return C.grafiteLuz;
    if (x % 8 === 0 || y % 8 === 0) return mix(C.grafite, C.grafiteLuz, 0.35);
    return mul(C.grafite, 0.95 + ruido(x, y, 3) * 0.1);
  });
// Faixa de luz: núcleo claro, borda na cor escura.
const luz = (cor, esc) =>
  textura((x, y) => {
    const d = Math.min(x, y, T - 1 - x, T - 1 - y) / (T / 2);
    return mix(esc, mix(cor, [255, 255, 255], 0.35), Math.min(1, d * 2.2));
  });
// Água: azul com ondas que andam (8 quadros).
const agua = () =>
  textura((x, y, q) => {
    const o = Math.sin((x + q * 4) / 4) + Math.cos((y - q * 2) / 5);
    return mix(C.azulEsc, C.azul, 0.45 + o * 0.18 + (ruido(x, y, q) < 0.03 ? 0.4 : 0));
  }, 8);
const vazio = () =>
  textura((x, y) => {
    if (borda(x, y)) return C.grafiteLuz;
    if (Math.abs(x - y - 6) < 2) return mix(C.tela, C.vidro, 0.15);
    return C.tela;
  });
// Tela do terminal: cabeçalho, linhas de itens e uma linha destacada que desce (8 quadros).
const telaTerminal = () =>
  textura((x, y, q) => {
    if (borda(x, y)) return C.grafite;
    if (y >= 2 && y <= 5) return x >= 3 && x <= 28 ? mix(C.violetaEsc, C.violeta, 0.6) : C.tela;
    const linha = Math.floor((y - 8) / 4);
    if (y >= 8 && y < 28 && (y - 8) % 4 !== 3) {
      const ativa = linha === q % 5;
      const largura = 10 + ((linha * 7) % 14);
      if (x >= 3 && x < 3 + largura) return ativa ? C.ciano : mix(C.tela, C.cianoEsc, 0.55);
      if (ativa && x >= 3 && x <= 28) return mix(C.tela, C.cianoEsc, 0.35);
    }
    if (y === 29 && x >= 24 && x <= 27 && q % 2 === 0) return C.ciano; // cursor piscando
    return C.tela;
  }, 8);
// Tela da nave: radar com varredura girando (16 quadros).
const telaNave = () =>
  textura((x, y, q) => {
    if (borda(x, y)) return C.grafite;
    const dx = x - 15.5, dy = y - 15.5, r = Math.hypot(dx, dy);
    if (r > 13.5) return C.tela;
    const ang = (Math.atan2(dy, dx) + Math.PI * 2) % (Math.PI * 2);
    const varre = (q / 16) * Math.PI * 2;
    const atras = (varre - ang + Math.PI * 2) % (Math.PI * 2);
    let c = C.tela;
    if (Math.abs(r - 13) < 0.6 || Math.abs(r - 8.5) < 0.5 || Math.abs(r - 4) < 0.5) c = mix(C.tela, C.cianoEsc, 0.7);
    if (Math.abs(dx) < 0.5 || Math.abs(dy) < 0.5) c = mix(C.tela, C.cianoEsc, 0.5);
    if (atras < 1.2) c = mix(c, C.ciano, (1.2 - atras) / 1.2 * 0.8);
    if (Math.hypot(x - 21, y - 10) < 1.2 && atras < 2.5) c = C.laranja; // um "sinal" no radar
    return c;
  }, 16);
// Células solares: azul-noite com grade fina e um brilho diagonal que passa (8 quadros).
const solar = () =>
  textura((x, y, q) => {
    if (borda(x, y)) return C.branco;
    if (x % 8 === 0 || y % 8 === 0) return mix(C.azulEsc, C.cianoEsc, 0.5);
    const brilho = Math.abs(((x + y) - q * 8 + 64) % 64 - 8) < 3 ? 0.35 : 0;
    return mix(hex("#122a52"), C.azul, 0.12 + brilho + ruido(x, y, 5) * 0.06);
  }, 8);
// Rotor do moinho: 3 pás brancas girando (8 quadros; 120°/8 por quadro). Transparente em volta.
const rotor = () =>
  textura((x, y, q) => {
    const dx = x - 15.5, dy = y - 15.5, r = Math.hypot(dx, dy);
    if (r < 2.6) return r < 1.4 ? [...C.ciano, 255] : [...C.grafite, 255];
    if (r > 15.5) return [0, 0, 0, 0];
    const ang = Math.atan2(dy, dx) + (q / 8) * ((Math.PI * 2) / 3);
    for (let k = 0; k < 3; k++) {
      let a = (ang - (k * Math.PI * 2) / 3) % (Math.PI * 2);
      if (a < 0) a += Math.PI * 2;
      const largura = 0.32 - r * 0.012;
      if (a < largura || a > Math.PI * 2 - 0.05) return [...mix(C.branco, C.branco2, r / 16), 255];
    }
    return [0, 0, 0, 0];
  }, 8);
// Respiros do gerador: grade escura; aceso = brasa laranja tremulando (8 quadros).
const brasa = (aceso) =>
  textura((x, y, q) => {
    if (borda(x, y, 2)) return C.grafite;
    if (y % 6 < 2) return C.grafite2;
    if (!aceso) return mix(C.grafite2, C.grafiteLuz, 0.4);
    const f = 0.55 + 0.45 * Math.sin(x / 3 + q * 0.9 + ruido(x, Math.floor(y / 6), q) * 2);
    return mix(C.laranjaEsc, mix(C.laranja, [255, 230, 160], 0.4), f);
  }, aceso ? 8 : 1);
// Janela de carga da bateria: barras ciano de baixo para cima.
const carga = (nivel) =>
  textura((x, y) => {
    if (borda(x, y, 2)) return C.grafite;
    const barra = Math.floor((T - 3 - y) / 5); // 0 em baixo
    if ((T - 3 - y) % 5 === 4) return C.tela;
    return barra < nivel ? mix(C.cianoEsc, C.ciano, 0.5 + barra * 0.08) : mix(C.tela, C.grafiteLuz, 0.4);
  });
// Malha da peneira (transparente nos furos).
const malha = () =>
  textura((x, y) => (x % 4 === 0 || y % 4 === 0 || borda(x, y, 2) ? [...C.grafiteLuz, 255] : [0, 0, 0, 0]));
// Vidro da estufa: só a moldura e uns reflexos (o resto transparente; a estufa usa alpha_test).
const vidro = () =>
  textura((x, y) => {
    if (borda(x, y, 1)) return [...C.branco, 255];
    if ((x + y === 20 || x + y === 22 || x + y === 44) && x > 3 && y > 3) return [...mix(C.vidro, [255, 255, 255], 0.5), 255];
    return [0, 0, 0, 0];
  });
// Muda dentro da estufa (planos cruzados).
const planta = () =>
  textura((x, y) => {
    const caule = Math.abs(x - 15.5) < 1 && y > 10;
    const folha = (cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;
    if (folha(10, 12, 6, 3) || folha(22, 9, 6, 3) || folha(16, 5, 3, 4) || folha(9, 20, 5, 2.5) || folha(23, 18, 5, 2.5))
      return [...mix(C.verdeEsc, C.verde, 0.3 + ruido(x, y, 7) * 0.4), 255];
    if (caule) return [...C.verdeEsc, 255];
    return [0, 0, 0, 0];
  });
// Conteúdo do compostor: vazio, cheio (verde) e pronto (terra).
const composto = (tipo) =>
  textura((x, y) => {
    const r = ruido(x, y, 8);
    if (tipo === "vazio") return mix(C.grafite2, C.grafite, r * 0.5);
    if (tipo === "cheio") return mix(hex("#2f6b2a"), hex("#6fae3a"), r);
    return mix(hex("#3b2817"), hex("#6b4a2b"), r);
  });
// Mesa da montadora: grade com um brilho laranja pulsando (8 quadros).
const forja = () =>
  textura((x, y, q) => {
    if (borda(x, y, 1)) return C.grafite;
    const d = Math.hypot(x - 15.5, y - 15.5) / 16;
    const pulso = 0.5 + 0.5 * Math.sin((q / 8) * Math.PI * 2);
    if ((x + y) % 8 === 0) return mix(C.grafite2, C.laranjaEsc, 0.3 * pulso);
    return mix(C.grafite2, C.laranja, Math.max(0, 0.75 - d) * (0.4 + 0.6 * pulso));
  }, 8);

const TEXTURAS = {
  corpo, corpo_friso: corpoFriso, grafite,
  luz_ciano: () => luz(C.ciano, C.cianoEsc), luz_laranja: () => luz(C.laranja, C.laranjaEsc),
  luz_azul: () => luz(C.azul, C.azulEsc), luz_verde: () => luz(C.verde, C.verdeEsc), luz_violeta: () => luz(C.violeta, C.violetaEsc),
  agua, vazio, tela_terminal: telaTerminal, tela_nave: telaNave, solar, rotor,
  brasa_on: () => brasa(true), brasa_off: () => brasa(false),
  carga_0: () => carga(0), carga_1: () => carga(3), carga_2: () => carga(6),
  malha, vidro, planta,
  composto_vazio: () => composto("vazio"), composto_cheio: () => composto("cheio"), composto_pronto: () => composto("pronto"),
  forja,
};
// Animadas: [quadros, ticks por quadro]
const ANIMADAS = { agua: 4, tela_terminal: 6, tela_nave: 3, solar: 5, rotor: 2, brasa_on: 3, forja: 3 };
const ACESAS = new Set(["luz_ciano", "luz_laranja", "luz_azul", "luz_verde", "luz_violeta", "agua", "tela_terminal", "tela_nave", "brasa_on", "forja", "carga_0", "carga_1", "carga_2", "solar"]);

// ---------- modelos ----------
// Cubos em pixels de 0 a 16 (como no editor); f = material de todas as faces ou { up, down, north, south, east, west, lados }.
// Faces marcadas com "!" (ex.: "tela!") usam a textura inteira em vez da projeção do mundo.
function cubo(x0, y0, z0, x1, y1, z1, f, extra = {}) {
  return { a: [x0, y0, z0], b: [x1, y1, z1], f, ...extra };
}
const FACES = ["north", "south", "east", "west", "up", "down"];
function faceMat(f, face) {
  if (typeof f === "string") return f;
  if (f[face] !== undefined) return f[face];
  if (f.lados && !["up", "down"].includes(face)) return f.lados;
  return f.resto;
}
function uvDe(face, [x0, y0, z0], [x1, y1, z1]) {
  const w = { north: [16 - x1, 16 - y1, x1 - x0, y1 - y0], south: [x0, 16 - y1, x1 - x0, y1 - y0], east: [16 - z1, 16 - y1, z1 - z0, y1 - y0], west: [z0, 16 - y1, z1 - z0, y1 - y0], up: [x0, z0, x1 - x0, z1 - z0], down: [x0, 16 - z1, x1 - x0, z1 - z0] }[face];
  // Partes acima de 16 px (rotor, cano) voltam para dentro do quadro da textura.
  return [((w[0] % 16) + 16) % 16, ((w[1] % 16) + 16) % 16, w[2], w[3]];
}
function geometria(id, ossos) {
  const bones = Object.entries(ossos).map(([nome, cubos]) => ({
    name: nome,
    pivot: [0, 0, 0],
    cubes: cubos.map((c) => {
      const uv = {};
      for (const face of FACES) {
        let m = faceMat(c.f, face);
        if (!m) continue;
        const inteira = m.endsWith("!");
        m = m.replace("!", "");
        const [u, v, du, dv] = inteira ? [0, 0, 16, 16] : uvDe(face, c.a, c.b);
        uv[face] = { uv: [u, v], uv_size: [du || 0.01, dv || 0.01], material_instance: m };
      }
      const cube = { origin: [c.a[0] - 8, c.a[1], c.a[2] - 8], size: [c.b[0] - c.a[0], c.b[1] - c.a[1], c.b[2] - c.a[2]], uv };
      if (c.rot) {
        cube.rotation = c.rot;
        cube.pivot = c.pivo.map((v, i) => (i === 1 ? v : v - 8));
      }
      return cube;
    }),
  }));
  return {
    format_version: "1.12.0",
    "minecraft:geometry": [{ description: { identifier: `geometry.cl.${id}`, texture_width: 16, texture_height: 16, visible_bounds_width: 2, visible_bounds_height: 2.5, visible_bounds_offset: [0, 0.75, 0] }, bones }],
  };
}

// Peças que se repetem
const base = (h = 2) => cubo(0, 0, 0, 16, h, 16, { lados: "grafite", up: "grafite", down: "grafite" });
const faixa = (y, cor, inset = 0.5) => cubo(inset, y, inset, 16 - inset, y + 1, 16 - inset, { lados: cor, up: cor, down: cor });

const MODELOS = {
  condensador_agua: {
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 9, 15, { lados: "corpo", up: "corpo", down: "grafite" }), faixa(9, "luz_azul", 1.5), cubo(1, 10, 1, 15, 12, 15, "corpo"),
        cubo(3, 12, 3, 13, 15, 13, { lados: "grafite", up: "liquido", down: "grafite" }), cubo(2, 15, 2, 14, 16, 4, "corpo"), cubo(2, 15, 12, 14, 16, 14, "corpo"), cubo(2, 15, 4, 4, 16, 12, "corpo"), cubo(12, 15, 4, 14, 16, 12, "corpo")],
    },
    texturas: { corpo: "corpo", grafite: "grafite", luz_azul: "luz_azul", liquido: "vazio" },
    estados: [{ cond: "q.block_state('cl:cheio')", troca: { liquido: "agua" } }],
  },
  condensador_avancado: {
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 7, 15, "corpo"), faixa(7, "luz_ciano", 1.5), cubo(1, 8, 1, 15, 10, 15, "corpo"), faixa(10, "luz_azul", 1.5), cubo(1, 11, 1, 15, 13, 15, "corpo"),
        cubo(4, 13, 4, 12, 16, 12, { lados: "grafite", up: "liquido", down: "grafite" }), cubo(1, 13, 1, 3, 16, 3, "grafite"), cubo(13, 13, 1, 15, 16, 3, "grafite"), cubo(1, 13, 13, 3, 16, 15, "grafite"), cubo(13, 13, 13, 15, 16, 15, "grafite")],
    },
    texturas: { corpo: "corpo", grafite: "grafite", luz_ciano: "luz_ciano", luz_azul: "luz_azul", liquido: "vazio" },
    estados: [{ cond: "q.block_state('cl:nivel') >= 1", troca: { liquido: "agua" } }],
  },
  peneira: {
    render: "alpha_test",
    ossos: {
      corpo: [cubo(0, 0, 0, 2, 12, 2, "grafite"), cubo(14, 0, 0, 16, 12, 2, "grafite"), cubo(0, 0, 14, 2, 12, 16, "grafite"), cubo(14, 0, 14, 16, 12, 16, "grafite"),
        cubo(0, 12, 0, 16, 16, 2, "corpo"), cubo(0, 12, 14, 16, 16, 16, "corpo"), cubo(0, 12, 2, 2, 16, 14, "corpo"), cubo(14, 12, 2, 16, 16, 14, "corpo"),
        faixa(11, "luz_laranja", 2.5), cubo(2, 13, 2, 14, 13.5, 14, { up: "malha!", down: "malha!" })],
    },
    texturas: { corpo: "corpo", grafite: "grafite", luz_laranja: "luz_laranja", malha: "malha" },
  },
  peneira_automatica: {
    render: "alpha_test",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 11, 15, { lados: "corpo_friso", up: "corpo", down: "grafite" }), faixa(11, "luz_ciano", 1.5),
        cubo(0, 12, 0, 16, 16, 2, "corpo"), cubo(0, 12, 14, 16, 16, 16, "corpo"), cubo(0, 12, 2, 2, 16, 14, "corpo"), cubo(14, 12, 2, 16, 16, 14, "corpo"),
        cubo(2, 14, 2, 14, 14.5, 14, { up: "malha!", down: "malha!" })],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_ciano: "luz_ciano", malha: "malha" },
  },
  compostor: {
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 15, 2, "corpo_friso"), cubo(1, 2, 14, 15, 15, 15, "corpo_friso"), cubo(1, 2, 2, 2, 15, 14, "corpo_friso"), cubo(14, 2, 2, 15, 15, 14, "corpo_friso"),
        cubo(2, 2, 2, 14, 13, 14, { up: "conteudo", lados: "grafite", down: "grafite" }),
        cubo(1, 15, 1, 15, 16, 2, "luz_verde"), cubo(1, 15, 14, 15, 16, 15, "luz_verde"), cubo(1, 15, 2, 2, 16, 14, "luz_verde"), cubo(14, 15, 2, 15, 16, 14, "luz_verde")],
    },
    texturas: { corpo_friso: "corpo_friso", grafite: "grafite", luz_verde: "luz_verde", conteudo: "composto_vazio" },
    estados: [
      { cond: "q.block_state('cl:nivel') >= 1 && !q.block_state('cl:pronto')", troca: { conteudo: "composto_cheio" } },
      { cond: "q.block_state('cl:pronto')", troca: { conteudo: "composto_pronto" } },
    ],
  },
  estufa: {
    render: "alpha_test",
    ossos: {
      corpo: [base(), faixa(2, "luz_verde", 0.5), cubo(0, 3, 0, 16, 16, 16, { lados: "vidro!", up: "vidro!" }), cubo(3, 3, 3, 13, 4, 13, { up: "conteudo", lados: "grafite" }),
        cubo(3, 4, 8, 13, 14, 8, { north: "planta!", south: "planta!" }), cubo(8, 4, 3, 8, 14, 13, { east: "planta!", west: "planta!" })],
    },
    texturas: { grafite: "grafite", luz_verde: "luz_verde", vidro: "vidro", planta: "planta", conteudo: "composto_cheio" },
  },
  painel_solar: {
    render: "opaque",
    colisao: { origin: [-8, 0, -8], size: [16, 8, 16] },
    ossos: {
      corpo: [cubo(3, 0, 3, 13, 1, 13, "grafite"), cubo(6.5, 1, 6.5, 9.5, 5, 9.5, "corpo"), faixa(5, "luz_ciano", 6),
        cubo(0, 5.5, 0, 16, 6.5, 16, { up: "solar!", down: "grafite", lados: "corpo" }, { rot: [-22.5, 0, 0], pivo: [8, 6, 8] })],
    },
    texturas: { corpo: "corpo", grafite: "grafite", luz_ciano: "luz_ciano", solar: "solar" },
  },
  gerador: {
    frente: true,
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 14, 15, { lados: "corpo", up: "corpo", down: "grafite" }), cubo(3, 4, 0.5, 13, 12, 1, { north: "respiro!" }), cubo(3, 4, 15, 13, 12, 15.5, { south: "respiro!" }),
        faixa(14, "luz_laranja", 1.5), cubo(1, 15, 1, 15, 16, 15, "grafite"), cubo(10, 16, 10, 13, 21, 13, { lados: "grafite", up: "grafite" }), cubo(9.5, 21, 9.5, 13.5, 22, 13.5, "luz_laranja")],
    },
    texturas: { corpo: "corpo", grafite: "grafite", luz_laranja: "luz_laranja", respiro: "brasa_off" },
    estados: [{ cond: "q.block_state('cl:combustivel') >= 1", troca: { respiro: "brasa_on" } }],
  },
  bateria: {
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(2, 2, 2, 14, 14, 14, { lados: "corpo_friso", up: "corpo", down: "grafite" }), cubo(5, 3, 1.5, 11, 13, 2, { north: "carga!" }), cubo(5, 3, 14, 11, 13, 14.5, { south: "carga!" }),
        cubo(1, 14, 1, 15, 16, 15, { lados: "grafite", up: "grafite", down: "grafite" }), cubo(6, 16, 6, 10, 17, 10, "luz_ciano")],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_ciano: "luz_ciano", carga: "carga_0" },
    estados: [
      { cond: "q.block_state('cl:carga') >= 1 && q.block_state('cl:carga') <= 7", troca: { carga: "carga_1" } },
      { cond: "q.block_state('cl:carga') >= 8", troca: { carga: "carga_2" } },
    ],
  },
  cabo: {
    render: "opaque",
    colisao: { origin: [-3, 5, -3], size: [6, 6, 6] },
    selecao: { origin: [-3, 5, -3], size: [6, 6, 6] },
    ossos: {
      nucleo: [cubo(5.5, 5.5, 5.5, 10.5, 10.5, 10.5, "grafite"), cubo(6.5, 6.5, 5, 9.5, 9.5, 11, "luz_ciano"), cubo(5, 6.5, 6.5, 11, 9.5, 9.5, "luz_ciano"), cubo(6.5, 5, 6.5, 9.5, 11, 9.5, "luz_ciano")],
      norte: [cubo(6.5, 6.5, 0, 9.5, 9.5, 5.5, "grafite")],
      sul: [cubo(6.5, 6.5, 10.5, 9.5, 9.5, 16, "grafite")],
      leste: [cubo(10.5, 6.5, 6.5, 16, 9.5, 9.5, "grafite")],
      oeste: [cubo(0, 6.5, 6.5, 5.5, 9.5, 9.5, "grafite")],
      cima: [cubo(6.5, 10.5, 6.5, 9.5, 16, 9.5, "grafite")],
      baixo: [cubo(6.5, 0, 6.5, 9.5, 5.5, 9.5, "grafite")],
    },
    visibilidade: { norte: "q.block_state('cl:n')", sul: "q.block_state('cl:s')", leste: "q.block_state('cl:l')", oeste: "q.block_state('cl:o')", cima: "q.block_state('cl:cima')", baixo: "q.block_state('cl:baixo')" },
    texturas: { grafite: "grafite", luz_ciano: "luz_ciano" },
  },
  moinho: {
    frente: true,
    render: "alpha_test",
    ossos: {
      corpo: [base(), cubo(2, 2, 2, 14, 10, 14, { lados: "corpo_friso", up: "corpo", down: "grafite" }), faixa(10, "luz_ciano", 2.5), cubo(5, 11, 5, 11, 15, 11, "corpo"),
        cubo(6, 15, 4, 10, 18, 12, { lados: "corpo", up: "corpo", down: "corpo" }), cubo(7, 16, 3, 9, 17, 4, "grafite"),
        cubo(-3, 8, 2.5, 19, 30, 3, { north: "rotor!", south: "rotor!" })],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_ciano: "luz_ciano", rotor: "rotor" },
  },
  montadora: {
    frente: true,
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 1, 15, 11, 15, { lados: "corpo_friso", up: "corpo", down: "grafite" }), faixa(11, "luz_laranja", 1.5), cubo(1, 12, 1, 15, 13, 15, { lados: "grafite", up: "mesa!" }),
        cubo(12, 13, 12, 14.5, 20, 14.5, "corpo"), cubo(5, 18, 12, 14.5, 20, 14.5, "corpo"), cubo(5.5, 15, 12.5, 7.5, 18, 14, "grafite"), cubo(6, 14, 13, 7, 15, 13.5, "luz_laranja")],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_laranja: "luz_laranja", mesa: "forja" },
  },
  terminal: {
    frente: true,
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(2, 2, 3, 14, 9, 13, { lados: "corpo_friso", up: "corpo", down: "grafite" }), faixa(9, "luz_violeta", 3), cubo(6, 10, 7, 10, 12, 10, "grafite"),
        cubo(1, 11, 4, 15, 21, 5.5, { north: "tela!", south: "corpo", lados: "corpo", up: "corpo", down: "corpo" }, { rot: [22.5, 0, 0], pivo: [8, 11, 5] })],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_violeta: "luz_violeta", tela: "tela_terminal" },
  },
  painel_nave: {
    frente: true,
    render: "opaque",
    ossos: {
      corpo: [base(), cubo(1, 2, 2, 15, 10, 15, { lados: "corpo_friso", up: "corpo", down: "grafite" }), faixa(10, "luz_laranja", 1.5),
        cubo(0, 10, 1, 16, 12, 15, { lados: "corpo", up: "grafite", down: "grafite" }),
        cubo(1, 12, 3, 15, 22, 4.5, { north: "tela!", south: "corpo", lados: "corpo", up: "corpo", down: "corpo" }, { rot: [22.5, 0, 0], pivo: [8, 12, 4] }),
        cubo(2, 12, 10, 6, 13, 13, "luz_ciano"), cubo(10, 12, 10, 14, 13, 13, "luz_laranja")],
    },
    texturas: { corpo: "corpo", corpo_friso: "corpo_friso", grafite: "grafite", luz_laranja: "luz_laranja", luz_ciano: "luz_ciano", tela: "tela_nave" },
  },
};

// ---------- saída ----------
const pasta = (...p) => {
  const d = join(RAIZ, ...p);
  mkdirSync(d, { recursive: true });
  return d;
};
const jsonEm = (rel, obj) => writeFileSync(join(RAIZ, rel), JSON.stringify(obj, null, 2) + "\n");
const lerJson = (rel) => JSON.parse(readFileSync(join(RAIZ, rel), "utf8"));

const dirTex = pasta("RP/textures/blocks/cl/v");
for (const [nome, gerar] of Object.entries(TEXTURAS)) writeFileSync(join(dirTex, `${nome}.png`), gerar());

const terreno = lerJson("RP/textures/terrain_texture.json");
for (const nome of Object.keys(TEXTURAS)) terreno.texture_data[`clv_${nome}`] = { textures: `textures/blocks/cl/v/${nome}` };
jsonEm("RP/textures/terrain_texture.json", terreno);

jsonEm(
  "RP/textures/flipbook_textures.json",
  Object.entries(ANIMADAS).map(([nome, ticks]) => ({ flipbook_texture: `textures/blocks/cl/v/${nome}`, atlas_tile: `clv_${nome}`, ticks_per_frame: ticks })),
);

pasta("RP/models/blocks");
const material = (tex, render) => {
  const m = { texture: `clv_${tex}`, render_method: render };
  if (ACESAS.has(tex)) Object.assign(m, { face_dimming: false, ambient_occlusion: 0 });
  return m;
};
const instancias = (mod, troca = {}) => {
  const r = {};
  for (const [inst, tex] of Object.entries({ ...mod.texturas, ...troca })) r[inst] = material(tex, mod.render);
  r["*"] = material(mod.texturas.corpo ?? mod.texturas.grafite, mod.render);
  return r;
};
for (const [id, mod] of Object.entries(MODELOS)) {
  jsonEm(`RP/models/blocks/cl_${id}.geo.json`, geometria(id, mod.ossos));
  const arq = `BP/blocks/${id}.json`;
  const bloco = lerJson(arq);
  const c = bloco["minecraft:block"].components;
  c["minecraft:geometry"] = mod.visibilidade ? { identifier: `geometry.cl.${id}`, bone_visibility: mod.visibilidade } : `geometry.cl.${id}`;
  c["minecraft:material_instances"] = instancias(mod);
  if (mod.colisao) c["minecraft:collision_box"] = mod.colisao;
  if (mod.selecao ?? mod.colisao) c["minecraft:selection_box"] = mod.selecao ?? mod.colisao;
  c["minecraft:light_dampening"] = 0;
  const perms = (bloco["minecraft:block"].permutations ?? []).filter((p) => !p.components["minecraft:material_instances"] || Object.keys(p.components).length > 1);
  for (const p of perms) delete p.components["minecraft:material_instances"];
  for (const e of mod.estados ?? []) {
    const p = perms.find((q) => q.condition === e.cond);
    if (p) p.components["minecraft:material_instances"] = instancias(mod, e.troca);
    else perms.push({ condition: e.cond, components: { "minecraft:material_instances": instancias(mod, e.troca) } });
  }
  // Virado para quem coloca: a frente do modelo é o norte; o jogo gira conforme cardinal_direction.
  const desc = bloco["minecraft:block"].description;
  const girosAntigos = perms.filter((p) => p.components["minecraft:transformation"]);
  for (const p of girosAntigos) perms.splice(perms.indexOf(p), 1);
  if (mod.frente) {
    desc.traits = { "minecraft:placement_direction": { enabled_states: ["minecraft:cardinal_direction"], y_rotation_offset: 180 } };
    for (const [dir, giro] of [["north", 0], ["west", 90], ["south", 180], ["east", -90]])
      perms.push({ condition: `q.block_state('minecraft:cardinal_direction') == '${dir}'`, components: { "minecraft:transformation": { rotation: [0, giro, 0] } } });
  } else delete desc.traits;
  if (perms.length > 0) bloco["minecraft:block"].permutations = perms;
  else delete bloco["minecraft:block"].permutations;
  jsonEm(arq, bloco);
}

// Estados de conexão do cabo (6 lados), usados pelo bone_visibility acima.
{
  const arq = "BP/blocks/cabo.json";
  const bloco = lerJson(arq);
  const estados = {};
  for (const s of ["cl:n", "cl:s", "cl:l", "cl:o", "cl:cima", "cl:baixo"]) estados[s] = [false, true];
  bloco["minecraft:block"].description.states = estados;
  jsonEm(arq, bloco);
}
// ---------- ícones dos itens (32x32, fundo transparente) ----------
const V = [0, 0, 0, 0];
const dentroRet = (x, y, x0, y0, x1, y1, r = 0) => {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false;
  const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
  return Math.hypot(x - cx, y - cy) <= r + 0.01;
};
const contorno = (dentro, x, y) => dentro(x, y) && (!dentro(x - 1, y) || !dentro(x + 1, y) || !dentro(x, y - 1) || !dentro(x, y + 1));
const icone = (pintar) => gerarPng(T, T, (x, y) => {
  const p = pintar(x, y);
  return !p ? V : p.length === 4 ? p : [...p, 255];
});
const ICONES = {
  placa_casco: () => icone((x, y) => {
    const d = (a, b) => dentroRet(a, b, 3, 5, 28, 26, 3);
    if (!d(x, y)) return null;
    if (contorno(d, x, y)) return C.cinza;
    if ([[7, 9], [24, 9], [7, 22], [24, 22]].some(([a, b]) => Math.hypot(x - a, y - b) < 1.6)) return C.costura;
    if (y >= 15 && y <= 16) return C.laranja;
    return mix(C.branco, C.branco2, (x + y) / 64);
  }),
  circuito: () => icone((x, y) => {
    const d = (a, b) => dentroRet(a, b, 3, 6, 28, 25, 2);
    if (!d(x, y)) return null;
    if (contorno(d, x, y)) return hex("#0e3a1e");
    if (dentroRet(x, y, 12, 11, 19, 20, 1)) return dentroRet(x, y, 13, 12, 18, 19) ? C.grafite2 : C.grafite;
    if ((y === 9 || y === 22) && x > 5 && x < 26) return hex("#d4af37");
    if ((x === 8 || x === 23) && y > 9 && y < 22) return hex("#d4af37");
    if (Math.hypot(x - 25, y - 9) < 1.5) return C.ciano;
    return mix(hex("#1f6b3a"), hex("#2a8a4c"), ruido(x, y, 9) * 0.4);
  }),
  celula_combustivel: () => icone((x, y) => {
    if (dentroRet(x, y, 11, 3, 20, 6, 1) || dentroRet(x, y, 11, 25, 20, 28, 1)) return C.grafite;
    const tubo = (a, b) => dentroRet(a, b, 10, 6, 21, 25, 2);
    if (!tubo(x, y)) return null;
    if (contorno(tubo, x, y)) return C.branco;
    if (y < 10) return mix(C.tela, C.vidro, 0.2);
    return mix(C.verdeEsc, C.verde, 0.4 + 0.5 * Math.sin(y / 2) * 0.3 + (x === 13 ? 0.3 : 0));
  }),
  motor_nave: () => icone((x, y) => {
    const corpo = (a, b) => dentroRet(a, b, 4, 9, 21, 22, 3);
    const bocal = (a, b) => a >= 21 && a <= 28 && b >= 12 - (a - 21) * 0.75 && b <= 19 + (a - 21) * 0.75;
    if (bocal(x, y)) return x >= 27 ? mix(C.laranja, [255, 230, 170], 0.4) : contorno(bocal, x, y) ? C.grafite2 : mix(C.grafite, C.grafiteLuz, (x - 21) / 8);
    if (!corpo(x, y)) return null;
    if (contorno(corpo, x, y)) return C.cinza;
    if (x % 5 === 0) return C.laranjaEsc;
    return mix(C.branco, C.branco2, y / 32);
  }),
  computador_bordo: () => icone((x, y) => {
    const d = (a, b) => dentroRet(a, b, 3, 6, 28, 25, 2);
    if (!d(x, y)) return null;
    if (contorno(d, x, y) || !dentroRet(x, y, 6, 9, 25, 22)) return C.branco;
    if (y === 12 && x < 20) return C.ciano;
    if ((y === 15 || y === 18) && x < 16 + (y % 4)) return C.cianoEsc;
    if (Math.hypot(x - 21, y - 18) < 2) return C.laranja;
    return C.tela;
  }),
  coracao_farao: () => icone((x, y) => {
    const dx = Math.abs(x - 15.5), dy = Math.abs(y - 15.5);
    const hexa = dx * 0.87 + dy * 0.5 <= 11 && dy <= 11;
    if (!hexa) return null;
    const r = Math.hypot(x - 15.5, y - 15.5);
    if (dx * 0.87 + dy * 0.5 > 9.8 || dy > 10) return hex("#8a6a10");
    if (r < 4) return mix([255, 240, 200], C.laranja, r / 4);
    if (r < 7) return mix(C.laranja, hex("#d4af37"), (r - 4) / 3);
    return mix(hex("#d4af37"), hex("#f2d675"), (x + y < 28 ? 0.6 : 0));
  }),
  diario_bordo: () => icone((x, y) => {
    const d = (a, b) => dentroRet(a, b, 6, 3, 25, 28, 3);
    if (!d(x, y)) return null;
    if (contorno(d, x, y) || !dentroRet(x, y, 9, 7, 22, 22)) return y > 24 && Math.abs(x - 15.5) < 2 ? C.grafiteLuz : C.branco;
    if (y === 9) return C.laranja;
    if ((y === 12 || y === 15 || y === 18) && x < 13 + ((y * 3) % 8)) return C.ciano;
    return C.tela;
  }),
};
const dirIcones = pasta("RP/textures/items/cl/v");
const itens = lerJson("RP/textures/item_texture.json");
for (const [nome, gerar] of Object.entries(ICONES)) {
  writeFileSync(join(dirIcones, `${nome}.png`), gerar());
  itens.texture_data[`cl_${nome}`] = { textures: `textures/items/cl/v/${nome}` };
}
jsonEm("RP/textures/item_texture.json", itens);

console.log(`visual: ${Object.keys(TEXTURAS).length} texturas, ${Object.keys(MODELOS).length} modelos, ${Object.keys(ICONES).length} ícones`);

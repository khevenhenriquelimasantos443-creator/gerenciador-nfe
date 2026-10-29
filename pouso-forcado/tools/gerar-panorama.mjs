// O fundo do menu e da tela de carregamento: o "panorama" (RP_menu/textures/ui/panorama_0..5.png, as 6 faces de
// um cubo em volta da câmera, que gira devagar atrás do logo) e a imagem da troca de dimensão
// (RP/textures/ui/cl/fundo_carregamento.png, usada por RP/ui/progress_screen.json). É o avião caído do começo
// do jogo (a grade final de tools/gerar-aviao.mjs) no deserto, no fim da tarde, desenhado bloco a bloco com as
// texturas do próprio jogo (um traçador de raios em blocos, com sombra do sol, nuvens e névoa de calor).
// Roda à mão (uns 2 minutos) e o resultado fica no git. Precisa das texturas do jogo: a pasta resource_pack do
// github.com/Mojang/bedrock-samples.
//   node tools/gerar-panorama.mjs <bedrock-samples>/resource_pack [--previa] [--saida=<pasta>]
// --previa: faces de 256 px, para conferir o enquadramento depressa.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { gerarPng } from "./png.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const VANILLA = process.argv[2];
if (!VANILLA || !existsSync(join(VANILLA, "textures/blocks"))) {
  console.error("uso: node tools/gerar-panorama.mjs <bedrock-samples>/resource_pack [--previa] [--saida=<pasta>]");
  process.exit(1);
}
const PREVIA = process.argv.includes("--previa");
const SAIDA = process.argv.find((a) => a.startsWith("--saida="))?.slice(8);
const FACE = PREVIA ? 256 : 1024;
const FUNDO = PREVIA ? [640, 300] : [1280, 600];

// ---------- leitura das texturas do jogo (PNG e TGA) ----------
function lerPng(arq) {
  const d = readFileSync(arq);
  let o = 8, w = 0, h = 0, bits = 8, tipo = 6, pal = null, trns = null;
  const idat = [];
  while (o < d.length) {
    const n = d.readUInt32BE(o), t = d.toString("latin1", o + 4, o + 8), c = d.subarray(o + 8, o + 8 + n);
    if (t === "IHDR") {
      [w, h, bits, tipo] = [c.readUInt32BE(0), c.readUInt32BE(4), c[8], c[9]];
      if (c[12]) throw new Error(`${arq}: PNG entrelaçado`);
    } else if (t === "PLTE") pal = c;
    else if (t === "tRNS") trns = c;
    else if (t === "IDAT") idat.push(c);
    o += 12 + n;
  }
  const canais = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[tipo];
  const bpp = Math.max(1, (canais * bits) >> 3), L = Math.ceil((w * canais * bits) / 8);
  const cru = inflateSync(Buffer.concat(idat)), px = Buffer.alloc(L * h);
  for (let y = 0; y < h; y++) {
    const f = cru[y * (L + 1)], de = y * (L + 1) + 1, para = y * L;
    for (let i = 0; i < L; i++) {
      const a = i >= bpp ? px[para + i - bpp] : 0, b = y ? px[para - L + i] : 0, c = y && i >= bpp ? px[para - L + i - bpp] : 0;
      let v = cru[de + i];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      px[para + i] = v & 255;
    }
  }
  const amostra = (y, i) => {
    if (bits >= 8) return px[y * L + i * (bits >> 3)];
    const porByte = 8 / bits, byte = px[y * L + Math.floor(i / porByte)];
    return (byte >> (8 - bits * ((i % porByte) + 1))) & ((1 << bits) - 1);
  };
  const rgba = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let r, g, b, a = 255;
      if (tipo === 3) {
        const k = amostra(y, x);
        [r, g, b] = [pal[k * 3], pal[k * 3 + 1], pal[k * 3 + 2]];
        if (trns && k < trns.length) a = trns[k];
      } else if (tipo === 0 || tipo === 4) {
        r = g = b = Math.round(amostra(y, x * canais) * (bits < 8 ? 255 / ((1 << bits) - 1) : 1));
        if (tipo === 4) a = amostra(y, x * 2 + 1);
      } else {
        [r, g, b] = [amostra(y, x * canais), amostra(y, x * canais + 1), amostra(y, x * canais + 2)];
        if (tipo === 6) a = amostra(y, x * 4 + 3);
      }
      rgba.set([r, g, b, a], (y * w + x) * 4);
    }
  return { w, h, rgba };
}

function lerTga(arq) {
  const d = readFileSync(arq);
  const tipo = d[2], w = d.readUInt16LE(12), h = d.readUInt16LE(14), bpp = d[16] >> 3, deCima = d[17] & 0x20;
  if ((tipo !== 2 && tipo !== 10) || bpp < 3) throw new Error(`${arq}: TGA de tipo ${tipo}/${bpp * 8} bits`);
  const px = Buffer.alloc(w * h * bpp);
  let o = 18 + d[0];
  if (tipo === 2) d.copy(px, 0, o, o + px.length);
  else
    for (let p = 0; p < px.length; ) {
      const c = d[o++], n = (c & 127) + 1;
      if (c & 128) {
        for (let i = 0; i < n; i++, p += bpp) d.copy(px, p, o, o + bpp);
        o += bpp;
      } else {
        d.copy(px, p, o, o + n * bpp);
        o += n * bpp;
        p += n * bpp;
      }
    }
  const rgba = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const s = ((deCima ? y : h - 1 - y) * w + x) * bpp;
      rgba.set([px[s + 2], px[s + 1], px[s], bpp === 4 ? px[s + 3] : 255], (y * w + x) * 4);
    }
  return { w, h, rgba };
}

const texturas = new Map();
function textura(nome) {
  if (texturas.has(nome)) return texturas.get(nome);
  const base = join(VANILLA, "textures/blocks", nome);
  const t = existsSync(`${base}.png`) ? lerPng(`${base}.png`) : lerTga(`${base}.tga`);
  // Texturas animadas são tiras: vale o primeiro quadro (o de cima).
  const n = t.w, soma = [0, 0, 0];
  let peso = 0;
  for (let i = 0; i < n * n; i++) {
    const a = t.rgba[i * 4 + 3] / 255;
    for (let c = 0; c < 3; c++) soma[c] += t.rgba[i * 4 + c] * a;
    peso += a;
  }
  const tex = { n, rgba: t.rgba, media: soma.map((v) => v / Math.max(peso, 1e-6)) };
  texturas.set(nome, tex);
  return tex;
}

// ---------- os blocos ----------
// Faces: uma textura só, ou { lado, topo, baixo }. vidro: deixa ver através (com a cor da textura).
const DEF = {
  "minecraft:sand": "sand",
  "minecraft:sandstone": { lado: "sandstone_normal", topo: "sandstone_top", baixo: "sandstone_bottom" },
  "minecraft:smooth_sandstone": "sandstone_top",
  "minecraft:smooth_quartz": "quartz_block_bottom",
  "minecraft:light_gray_concrete": "concrete_silver",
  "minecraft:gray_concrete": "concrete_gray",
  "minecraft:orange_concrete": "concrete_orange",
  "minecraft:white_concrete": "concrete_white",
  "minecraft:black_concrete": "concrete_black",
  "minecraft:cyan_concrete": "concrete_cyan",
  "minecraft:coarse_dirt": "coarse_dirt",
  "minecraft:gray_stained_glass": { todas: "glass_gray", vidro: true },
  "minecraft:blackstone": { lado: "blackstone", topo: "blackstone_top", baixo: "blackstone_top" },
  "minecraft:barrel": { lado: "barrel_side", topo: "barrel_top", baixo: "barrel_bottom" },
  "minecraft:sea_lantern": "sea_lantern",
  "minecraft:orange_terracotta": "hardened_clay_stained_orange",
  "minecraft:white_terracotta": "hardened_clay_stained_white",
  "minecraft:terracotta": "hardened_clay",
  "minecraft:netherrack": "netherrack",
  "minecraft:iron_block": "iron_block",
  "minecraft:cactus": { lado: "cactus_side", topo: "cactus_top", baixo: "cactus_bottom" },
};
const BLOCOS = [null, null]; // 0 = nada (segue o terreno), 1 = ar do avião (tapa o terreno)
const ID = new Map();
function id(nome) {
  if (nome === "minecraft:air") return 1;
  if (nome === "minecraft:fire") return 0;
  if (ID.has(nome)) return ID.get(nome);
  const d = DEF[nome];
  if (!d) throw new Error(`gerar-panorama: falta a textura de ${nome} em DEF`);
  const f = typeof d === "string" ? { todas: d } : d;
  const lado = textura(f.lado ?? f.todas);
  BLOCOS.push({ lado, topo: f.topo || f.todas ? textura(f.topo ?? f.todas) : lado, baixo: f.baixo || f.todas ? textura(f.baixo ?? f.todas) : lado, vidro: !!f.vidro });
  ID.set(nome, BLOCOS.length - 1);
  return BLOCOS.length - 1;
}
const AREIA = id("minecraft:sand"), ARENITO = id("minecraft:sandstone"), CACTO = id("minecraft:cactus");
const FAIXAS = [id("minecraft:orange_terracotta"), id("minecraft:terracotta"), id("minecraft:white_terracotta")];

// ---------- a cena ----------
// Avião: a grade final de tools/gerar-aviao.mjs (x, h, z, bloco; h = 0 é o bloco de cima do chão).
const tmp = mkdtempSync(join(tmpdir(), "panorama-"));
execFileSync(process.execPath, [join(RAIZ, "tools/gerar-aviao.mjs")], { env: { ...process.env, AVIAO_DUMP: join(tmp, "aviao.json") }, stdio: ["ignore", "ignore", "inherit"] });
const lista = JSON.parse(readFileSync(join(tmp, "aviao.json"), "utf8"));
rmSync(tmp, { recursive: true });
const A = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity, z0: Infinity, z1: -Infinity };
for (const [x, y, z] of lista) {
  A.x0 = Math.min(A.x0, x); A.x1 = Math.max(A.x1, x);
  A.y0 = Math.min(A.y0, y); A.y1 = Math.max(A.y1, y);
  A.z0 = Math.min(A.z0, z); A.z1 = Math.max(A.z1, z);
}
const AY = A.y1 - A.y0 + 1, AZ = A.z1 - A.z0 + 1;
const aviao = new Uint8Array((A.x1 - A.x0 + 1) * AY * AZ);
for (const [x, y, z, b] of lista) aviao[((x - A.x0) * AY + (y - A.y0)) * AZ + (z - A.z0)] = id(b);

// Terreno: areia plana (o mundo é plano) com dunas baixas, mesas de arenito ao longe e cactos.
const R = 768, HN = R * 2;
const alt = new Int16Array(HN * HN), tipo = new Uint8Array(HN * HN), cacto = new Uint8Array(HN * HN);
let semente = 20260; // sorteio fixo: o mesmo panorama a cada vez
const sorte = () => ((semente = (Math.imul(semente, 1103515245) + 12345) >>> 0) / 4294967296);
const hash = (x, z, s) => {
  let h = (x * 374761393 + z * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
// A câmera fica um pouco atrás de onde o jogador nasce (8 à frente do nariz e 30 ao lado, em
// tools/gerar-aviao.mjs) e um pouco acima, olhando o avião de três quartos.
const CAMERA = [-4.5, 5.2, -31.5];
const ALVO = [-22, 3, 0];
// A imagem parada (troca de dimensão) é vista de mais longe, para caber o avião inteiro.
const CAMERA_FUNDO = [17.5, 6.5, -47.5];
let olho = CAMERA;
const longeDoAviao = (x, z, folga) => x < A.x0 - folga || x > A.x1 + folga || z < A.z0 - folga || z > A.z1 + folga;
const morros = [];
for (let i = 0; i < 260; i++) {
  const cx = (sorte() * 2 - 1) * 600, cz = (sorte() * 2 - 1) * 600, rx = 7 + sorte() * 18, rz = 6 + sorte() * 14;
  const h = 2 + Math.floor(sorte() ** 1.6 * 7);
  if (!longeDoAviao(cx, cz, Math.max(rx, rz) + 14) || Math.hypot(cx - CAMERA[0], cz - CAMERA[2]) < Math.max(rx, rz) + 10) continue;
  morros.push({ cx, cz, rx, rz, h, giro: sorte() * Math.PI });
}
const mesas = [
  { cx: -150, cz: 175, r: 46, h: 26 },
  { cx: -265, cz: 60, r: 30, h: 19 },
  { cx: 205, cz: 130, r: 38, h: 23 },
  { cx: -70, cz: -330, r: 52, h: 30 },
  { cx: 260, cz: -210, r: 28, h: 17 },
];
// Cada morro e cada mesa só mexe no quadrado em volta dele.
const caixa = (cx, cz, r, pintar) => {
  for (let z = Math.max(-R, Math.floor(cz - r)); z <= Math.min(R - 1, Math.ceil(cz + r)); z++)
    for (let x = Math.max(-R, Math.floor(cx - r)); x <= Math.min(R - 1, Math.ceil(cx + r)); x++) pintar(x, z, (z + R) * HN + x + R);
};
for (const m of morros) {
  const c = Math.cos(m.giro), s = Math.sin(m.giro);
  caixa(m.cx, m.cz, Math.max(m.rx, m.rz), (x, z, k) => {
    const dx = x - m.cx, dz = z - m.cz, d2 = ((dx * c - dz * s) / m.rx) ** 2 + ((dx * s + dz * c) / m.rz) ** 2;
    if (d2 < 1) alt[k] = Math.max(alt[k], Math.round(m.h * (1 - d2) ** 1.3));
  });
}
for (const m of mesas)
  caixa(m.cx, m.cz, m.r * 1.25, (x, z, k) => {
    const ang = Math.atan2(z - m.cz, x - m.cx);
    const borda = m.r * (1 + 0.13 * Math.sin(ang * 3 + m.cx) + 0.07 * Math.sin(ang * 7 + m.cz));
    const d = Math.hypot(x - m.cx, z - m.cz);
    if (d >= borda) return;
    // Paredes retas com um degrau na beirada (como as mesas do relevo do jogo).
    const hm = d < borda - 4 ? m.h : Math.round(m.h * 0.78);
    if (hm > alt[k]) [alt[k], tipo[k]] = [hm, 1];
  });
for (let j = 1; j < HN - 1; j++)
  for (let i = 1; i < HN - 1; i++) {
    const k = j * HN + i, x = i - R, z = j - R;
    if (tipo[k] || !longeDoAviao(x, z, 10) || Math.hypot(x - CAMERA[0], z - CAMERA[2]) < 9 || hash(x, z, 3) > 0.0011) continue;
    if (alt[k - 1] !== alt[k] || alt[k + 1] !== alt[k] || alt[k - HN] !== alt[k] || alt[k + HN] !== alt[k]) continue;
    cacto[k] = 1 + Math.floor(hash(x, z, 4) * 3);
  }
// Uns cactos perto da câmera, fora da frente do avião, para dar primeiro plano.
for (const [x, z, h] of [[24, -33, 3], [-6, -44, 2], [27, -12, 2]]) cacto[(z + R) * HN + (x + R)] = h;

// Ruído suave (valor interpolado), para as nuvens saírem em blocos grandes e não em chuvisco.
function suave(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = hash(xi, zi, 9), b = hash(xi + 1, zi, 9), c = hash(xi, zi + 1, 9), d = hash(xi + 1, zi + 1, 9);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

const YMAX = 40;
function blocoEm(x, y, z) {
  if (x >= A.x0 && x <= A.x1 && z >= A.z0 && z <= A.z1 && y >= A.y0 && y <= A.y1) {
    const v = aviao[((x - A.x0) * AY + (y - A.y0)) * AZ + (z - A.z0)];
    if (v === 1) return 0;
    if (v) return v;
  }
  const i = x + R, j = z + R;
  if (i < 0 || j < 0 || i >= HN || j >= HN) return y <= 0 ? AREIA : 0;
  const k = j * HN + i, h = alt[k];
  if (y <= h) {
    if (tipo[k] === 1) return y === h ? ARENITO : y % 6 === 2 ? FAIXAS[(y >> 3) % 3] : ARENITO;
    return y > h - 3 ? AREIA : ARENITO;
  }
  if (cacto[k] && y <= h + cacto[k]) return CACTO;
  return 0;
}

// ---------- luz, céu e névoa ----------
const norm = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const escalar = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const F = norm([ALVO[0] - CAMERA[0], 0, ALVO[2] - CAMERA[2]]), U = [0, 1, 0], D = cruz(F, U); // frente, cima, direita
// Sol do fim da tarde, atrás e à direita de quem olha o avião: o casco do lado da câmera fica iluminado e a
// sombra cai para trás, na areia.
const SOL = norm([F[0] * -0.35 + D[0] * 0.75, 0.42, F[2] * -0.35 + D[2] * 0.75]);
const S1 = norm(cruz(SOL, U)), S2 = cruz(S1, SOL);
const COR_SOL = [1.0, 0.84, 0.62], COR_AMB = [0.56, 0.6, 0.7];
const ZENITE = [64, 122, 204], MEIO = [128, 178, 226], HORIZONTE = [236, 214, 176];

function ceu(dx, dy, dz) {
  const e = Math.max(0, dy);
  let c = e < 0.18 ? mix(HORIZONTE, MEIO, (e / 0.18) ** 0.8) : mix(MEIO, ZENITE, Math.min(1, (e - 0.18) / 0.6) ** 0.8);
  const cs = dx * SOL[0] + dy * SOL[1] + dz * SOL[2];
  if (cs > 0) {
    const brilho = cs ** 6 * 0.45 + cs ** 48 * 0.5;
    c = mix(c, [255, 214, 150], Math.min(1, brilho));
    // O sol quadrado do Minecraft, com um halo também quadrado.
    if (cs > 0.9) {
      const u = Math.abs((dx * S1[0] + dy * S1[1] + dz * S1[2]) / cs), v = Math.abs((dx * S2[0] + dy * S2[1] + dz * S2[2]) / cs);
      const m = Math.max(u, v);
      if (m < 0.05) return [255, 248, 222];
      if (m < 0.085) c = mix(c, [255, 236, 184], 0.55);
    }
  }
  // Nuvens do Minecraft (placas quadradas), poucas: é deserto.
  if (dy > 0.03) {
    const t = (128 - olho[1]) / dy, X = olho[0] + dx * t, Z = olho[2] + dz * t;
    const cx = Math.floor(X / 12), cz = Math.floor(Z / 12);
    if (suave(cx / 6, cz / 6) + hash(cx, cz, 8) * 0.12 > 0.74) {
      const a = 0.85 * Math.max(0, 1 - t / 2200);
      c = mix(c, mix([255, 252, 246], [255, 226, 190], Math.max(0, cs) ** 3 * 0.6), a);
    }
  }
  return c;
}

let hB = 0, hEixo = 0, hT = 0, hSinal = 0, vT = 1;
const vCor = [0, 0, 0];
// Anda bloco a bloco pelo raio (Amanatides-Woo) até bater num bloco. O vidro mistura a cor e deixa passar.
function tracar(ox, oy, oz, dx, dy, dz, maxT, sombra) {
  let x = Math.floor(ox), y = Math.floor(oy), z = Math.floor(oz);
  const sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1, sz = dz > 0 ? 1 : -1;
  const tdx = dx ? Math.abs(1 / dx) : Infinity, tdy = dy ? Math.abs(1 / dy) : Infinity, tdz = dz ? Math.abs(1 / dz) : Infinity;
  let tmx = dx ? (dx > 0 ? x + 1 - ox : ox - x) * tdx : Infinity;
  let tmy = dy ? (dy > 0 ? y + 1 - oy : oy - y) * tdy : Infinity;
  let tmz = dz ? (dz > 0 ? z + 1 - oz : oz - z) * tdz : Infinity;
  let t = 0, eixo = 0, antes = 0;
  vT = 1; vCor[0] = vCor[1] = vCor[2] = 0;
  while (t < maxT) {
    if (tmx < tmy && tmx < tmz) { x += sx; t = tmx; tmx += tdx; eixo = 0; }
    else if (tmy < tmz) { y += sy; t = tmy; tmy += tdy; eixo = 1; }
    else { z += sz; t = tmz; tmz += tdz; eixo = 2; }
    if (y > YMAX && dy >= 0) return false;
    const b = blocoEm(x, y, z);
    if (!b) { antes = 0; continue; }
    if (BLOCOS[b].vidro) {
      if (!sombra && antes !== b) {
        hB = b; hEixo = eixo; hT = t; hSinal = eixo === 0 ? sx : eixo === 1 ? sy : sz;
        const [r, g, bl, a] = texel(ox + dx * t, oy + dy * t, oz + dz * t, t);
        const k = vT * a * 0.6;
        vCor[0] += r * k; vCor[1] += g * k; vCor[2] += bl * k;
        vT *= 1 - a * 0.6;
      }
      antes = b;
      continue;
    }
    hB = b; hEixo = eixo; hT = t; hSinal = eixo === 0 ? sx : eixo === 1 ? sy : sz;
    return true;
  }
  return false;
}

// Cor da textura no ponto onde o raio bateu (a face é a do último passo). Longe, vai para a cor média da
// textura (como o mipmap do jogo), para a areia não virar chuvisco.
function texel(px, py, pz, t) {
  const b = BLOCOS[hB];
  const fr = (v) => v - Math.floor(v);
  let tex, u, v;
  if (hEixo === 1) {
    tex = hSinal < 0 ? b.topo : b.baixo;
    u = fr(px); v = fr(pz);
  } else {
    tex = b.lado;
    u = hEixo === 0 ? (hSinal > 0 ? fr(pz) : 1 - fr(pz)) : hSinal > 0 ? 1 - fr(px) : fr(px);
    v = 1 - fr(py);
  }
  const n = tex.n, i = ((Math.min(n - 1, Math.floor(v * n)) * n + Math.min(n - 1, Math.floor(u * n))) * 4);
  const longe = Math.min(1, Math.max(0, (t - 18) / 70));
  const r = tex.rgba[i] + (tex.media[0] - tex.rgba[i]) * longe;
  const g = tex.rgba[i + 1] + (tex.media[1] - tex.rgba[i + 1]) * longe;
  const bl = tex.rgba[i + 2] + (tex.media[2] - tex.rgba[i + 2]) * longe;
  return [r, g, bl, tex.rgba[i + 3] / 255];
}

function pixel(dx, dy, dz) {
  const l = Math.hypot(dx, dy, dz);
  dx /= l; dy /= l; dz /= l;
  const fundo = ceu(dx, dy, dz);
  const bateu = tracar(olho[0], olho[1], olho[2], dx, dy, dz, 700, false);
  const vidroT = vT, vidroCor = [...vCor];
  let cor;
  const horizonte = ceu(dx, Math.max(0.0, dy * 0.15), dz);
  if (!bateu) {
    // Céu, ou a areia tão longe que só se vê a névoa de calor.
    cor = dy >= 0 ? fundo : mix(horizonte, [214, 190, 150], Math.min(1, -dy * 4));
  } else {
    const t = hT, px = olho[0] + dx * t, py = olho[1] + dy * t, pz = olho[2] + dz * t;
    const [r, g, b] = texel(px, py, pz, t);
    const nx = hEixo === 0 ? -hSinal : 0, ny = hEixo === 1 ? -hSinal : 0, nz = hEixo === 2 ? -hSinal : 0;
    // Luz: ambiente com o sombreado de face do jogo (cima claro, baixo escuro) + sol, se a face o vê.
    const face = ny > 0 ? 1 : ny < 0 ? 0.5 : nx ? 0.72 : 0.86;
    const ns = nx * SOL[0] + ny * SOL[1] + nz * SOL[2];
    let sol = 0;
    if (ns > 0 && !tracar(px + nx * 1e-3, py + ny * 1e-3, pz + nz * 1e-3, SOL[0], SOL[1], SOL[2], 220, true)) sol = ns;
    const luz = COR_AMB.map((a, i) => a * face + COR_SOL[i] * sol * 0.95);
    cor = [r * luz[0], g * luz[1], b * luz[2]];
    // Névoa de calor ao longe.
    const n = Math.min(0.9, Math.max(0, (t - 50) / 520) ** 1.15);
    cor = mix(cor, horizonte, n);
  }
  if (vidroT < 1) cor = cor.map((c, i) => c * vidroT + vidroCor[i] * COR_AMB[i] * 1.1);
  return cor;
}

// Leve granulado ordenado (Bayer 4x4), para o degradê do céu não fazer faixas.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const pronto = (c, x, y) => {
  const d = (BAYER[(y & 3) * 4 + (x & 3)] / 16 - 0.5) * 2;
  return [...c.map((v) => Math.max(0, Math.min(255, Math.round(v + d)))), 255];
};

function imagem(w, h, raio) {
  const px = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) px.set(pronto(raio(x, y), x, y), (y * w + x) * 4);
  return gerarPng(w, h, (x, y) => px.subarray((y * w + x) * 4, (y * w + x) * 4 + 4), true);
}

// Faces do panorama, na ordem do jogo (conferida no panorama original): 0 frente, 1 direita, 2 trás,
// 3 esquerda (girando para a direita), 4 cima (a borda de baixo encosta na frente), 5 baixo (a de cima encosta).
const menos = (v) => v.map((c) => -c);
const FACES = [
  [F, D, U], [D, menos(F), U], [menos(F), menos(D), U], [menos(D), F, U], [U, D, menos(F)], [menos(U), D, F],
];
const pasta = SAIDA ?? join(RAIZ, "RP_menu/textures/ui"), pastaFundo = SAIDA ? join(SAIDA, "cl") : join(RAIZ, "RP/textures/ui/cl");
mkdirSync(pasta, { recursive: true });
mkdirSync(pastaFundo, { recursive: true });
const inicio = Date.now();
FACES.forEach(([f, d, u], n) => {
  const png = imagem(FACE, FACE, (x, y) => {
    const a = (2 * (x + 0.5)) / FACE - 1, b = (2 * (y + 0.5)) / FACE - 1;
    return pixel(f[0] + a * d[0] - b * u[0], f[1] + a * d[1] - b * u[1], f[2] + a * d[2] - b * u[2]);
  });
  writeFileSync(join(pasta, `panorama_${n}.png`), png);
  console.log(`panorama_${n}.png: ${(png.length / 1024).toFixed(0)} KB`);
});
// Foto em perspectiva da câmera de longe, olhando de leve para baixo (campo de visão na horizontal, em graus).
function foto(w, h, campo, alvo = ALVO) {
  olho = CAMERA_FUNDO;
  const meio = Math.tan((campo / 2) * (Math.PI / 180));
  const f = norm([alvo[0] - olho[0], 0, alvo[2] - olho[2]]), d = cruz(f, U);
  const baixo = norm([f[0], -0.07, f[2]]), cima = cruz(d, baixo);
  return imagem(w, h, (x, y) => {
    const a = ((2 * (x + 0.5)) / w - 1) * meio, b = ((2 * (y + 0.5)) / h - 1) * meio * (h / w);
    return pixel(baixo[0] + a * d[0] - b * cima[0], baixo[1] + a * d[1] - b * cima[1], baixo[2] + a * d[2] - b * cima[2]);
  });
}
// Fundo da troca de dimensão: o avião inteiro. Ícone do pacote do menu: a cauda do avião, de perto.
for (const [arq, png] of [
  [join(pastaFundo, "fundo_carregamento.png"), foto(...FUNDO, 84)],
  [SAIDA ? join(SAIDA, "pack_icon.png") : join(RAIZ, "RP_menu/pack_icon.png"), foto(256, 256, 30, [-30, 7, 0])],
]) {
  writeFileSync(arq, png);
  console.log(`${arq.split("/").slice(-1)[0]}: ${(png.length / 1024).toFixed(0)} KB`);
}
console.log(`panorama pronto em ${((Date.now() - inicio) / 1000).toFixed(0)} s`);

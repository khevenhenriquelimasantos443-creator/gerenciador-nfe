// Gera TODA a arte da campanha do Instagram a partir de finn-social/copy.cjs:
// um post de feed (1080x1350, 4:5) e um story (1080x1920) por entrada do roteiro,
// mais as capas de reel. A quantidade sai do roteiro, não daqui.
//
// Por que existe: os cartões entraram no repositório como imagem pronta, sem
// fonte. Corrigir uma vírgula exigia refazer a arte na mão — e foi assim que
// "pra o que importa" ficou publicado. Agora o texto mora em copy.cjs, que o
// build.js também lê pras legendas, então arte e legenda não podem divergir.
//
// As medidas abaixo não foram inventadas: saíram de medir os PNG/JPG antigos
// pixel a pixel (caixa de cada bloco, cores exatas, largura de texto pra
// calibrar o corpo da fonte), pra que a identidade visual continue a mesma e
// só o texto mude.
//
// Uso:  node finn-social/gera-cards.mjs [n...]     (sem argumento = todos)
import { chromium } from 'playwright';
import fs from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const { POSTS, REELS, STORY_PILL } = createRequire(import.meta.url)('./copy.cjs');

/* ── paleta medida nos originais ───────────────────────────────────────── */
const CREME = '#F8F7F4';
const NAVY = '#0F172A';        // fundo dos layouts 'hero'
const NAVY_CLARO = '#1E293B';  // fundo dos layouts 'tiles' sem brilho
const LARANJA = '#F97316';
const CINZA_CLARO = '#64748B'; // corpo sobre creme
const CINZA_ESCURO = '#94A3B8';// corpo sobre navy
const BORDA = '#E2E8F0';
const CHIP_TXT = '#1E293B';
const FONTE = "Arial, 'Liberation Sans', Helvetica, sans-serif";

// O post de feed nasceu quadrado (1080x1080, 1:1) porque era o padrão do
// Instagram quando os cartões foram desenhados. O feed do app passou a
// priorizar 4:5 (retrato) pra ocupar mais tela — postar quadrado hoje faz o
// Instagram mostrar o cartão pequeno dentro de um quadro maior, pedindo
// "Ajustar"/"Plano de fundo" pra preencher a sobra (foi exatamente o que
// apareceu numa prévia: post inteiro visível, mas encolhido e sobrando faixa
// preta em cima/embaixo). POST_H sobe pra 1350 (4:5); a marca, o selo e o
// título ficam ONDE JÁ ESTAVAM (perto do topo — é o que mais precisa
// sobreviver a qualquer corte de grade) e só o que vem depois (corpo,
// tiles/chips/botão, rodapé) desce pro espaço novo, com mais respiro.
const POST_W = 1080, POST_H = 1350;
const RODAPE_POST_TOP = 1250;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// |trecho| vira <i>, que o CSS pinta de laranja.
const titulo = (h) => esc(h).replace(/\|([^|]+)\|/g, '<i>$1</i>');

const base = (w, h, bg, corpo, extraCss = '') => `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;background:${bg};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  .marca{position:absolute;display:flex;align-items:center;gap:15px}
  .quad{border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:700}
  .nome i{font-style:normal;color:${LARANJA}}
  h1{font-weight:700;letter-spacing:-.02em}
  h1 i{font-style:normal;color:${LARANJA}}
  .rodape{position:absolute;font-weight:700}
  ${extraCss}
</style>${corpo}`;

/* ── cabeçalho da marca ────────────────────────────────────────────────── */
// claro=true  -> quadrado navy com F laranja (fundo creme)
// claro=false -> quadrado laranja com F branco (fundo escuro)
// pontoLaranja=false deixa o ponto do "Finn." na cor do nome — é o que o
// fundo laranja pede, porque ponto laranja sobre laranja simplesmente some.
function marca({ claro, x = 96, y = 64, tam = 56, fonte = 25, centro = false, pontoLaranja = true }) {
  const pos = centro
    ? `left:0;top:${y}px;width:100%;justify-content:center`
    : `left:${x}px;top:${y}px`;
  const quad = claro
    ? `background:${NAVY};color:${LARANJA}`
    : `background:${LARANJA};color:#fff`;
  const nome = claro ? NAVY : '#fff';
  return `<div class="marca" style="${pos}">
    <div class="quad" style="width:${tam}px;height:${tam}px;${quad};font-size:${Math.round(tam * 0.54)}px;border-radius:${Math.round(tam / 4)}px">F</div>
    <div class="nome" style="font-size:${fonte}px;font-weight:700;color:${nome}">Finn<i${pontoLaranja ? '' : ' style="color:inherit"'}>.</i></div>
  </div>`;
}

const brilho = (lado = 'direita') => `<div style="position:absolute;${lado === 'direita' ? 'right:-180px;top:-220px' : 'left:50%;margin-left:-450px;top:-260px'};
  width:900px;height:900px;border-radius:50%;
  background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 68%)"></div>`;

/* ── blocos reutilizáveis do post ──────────────────────────────────────── */
const pillClara = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:54px;display:inline-flex;
  align-items:center;gap:9px;padding:0 28px;border:1px solid ${BORDA};border-radius:27px;background:#fff;
  font-size:20px;font-weight:700;letter-spacing:.06em;color:#334155">${esc(txt)}</div>` : '';

const pillContorno = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:54px;display:inline-flex;
  align-items:center;gap:9px;padding:0 26px;border:2px solid ${LARANJA};border-radius:27px;
  font-size:20px;font-weight:700;letter-spacing:.06em;color:${LARANJA}">${esc(txt)}</div>` : '';

const pillLaranja = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:52px;display:inline-flex;
  align-items:center;gap:9px;padding:0 24px;border-radius:26px;background:rgba(15,23,42,.15);
  font-size:20px;font-weight:700;letter-spacing:.06em;color:#fff">${esc(txt)}</div>` : '';

const h1Post = (h, cor) => `<h1 style="position:absolute;left:96px;top:320px;width:900px;
  font-size:92px;line-height:1.055;color:${cor}">${titulo(h)}</h1>`;

const corpoPost = (txt, top, cor, extra = '') => `<p style="position:absolute;left:96px;top:${top}px;width:830px;
  font-size:32px;line-height:1.5;color:${cor};${extra}">${esc(txt)}</p>`;

// top=994 era o certo pro post quadrado (1080x1080); o feed do Instagram
// passou a priorizar 4:5 (1080x1350) — ver comentário em RODAPE_POST_TOP.
const rodapePost = (txt, cor, top = RODAPE_POST_TOP) => `<div class="rodape" style="left:96px;top:${top}px;font-size:22px;color:${cor}">${esc(txt)}</div>`;

// Chips de texto puro (nomes de banco, categorias) ou [emoji, rótulo].
function chips(itens, { escuro = false, top = 800, centro = false } = {}) {
  const estilo = escuro
    ? `background:#1D2436;border:1px solid rgba(255,255,255,.10);color:#fff`
    : `background:#fff;border:1px solid ${BORDA};color:${CHIP_TXT}`;
  const um = (it) => {
    const [e, rot] = Array.isArray(it) ? it : [null, it];
    return `<div style="height:76px;display:inline-flex;align-items:center;gap:12px;padding:0 26px;
      border-radius:14px;font-size:28px;font-weight:700;${estilo}">${e ? esc(e) + ' ' : ''}${esc(rot)}</div>`;
  };
  return `<div style="position:absolute;left:96px;top:${top}px;width:900px;display:flex;flex-wrap:wrap;gap:17px;
    ${centro ? 'left:0;width:100%;padding:0 96px;justify-content:center' : ''}">${itens.map(um).join('')}</div>`;
}

// Três tiles com emoji grande em cima do rótulo.
const tiles = (itens, { escuro = true, top = 825 } = {}) => `<div style="position:absolute;left:96px;top:${top}px;width:888px;
  display:grid;grid-template-columns:repeat(3,1fr);gap:21px">${itens.map(([e, rot]) => `
  <div style="height:133px;border-radius:14px;background:${escuro ? '#2B3546' : '#fff'};
       border:1px solid ${escuro ? '#444D5C' : BORDA};display:flex;flex-direction:column;
       align-items:center;justify-content:center;gap:10px">
    <div style="font-size:44px;line-height:1">${esc(e)}</div>
    <div style="font-size:22px;font-weight:700;color:${escuro ? '#fff' : CHIP_TXT}">${esc(rot)}</div>
  </div>`).join('')}</div>`;

const bullets = (itens, top = 812) => `<div style="position:absolute;left:96px;top:${top}px;width:900px">${itens.map((t) => `
  <div style="display:flex;align-items:center;gap:20px;height:52px;font-size:30px;font-weight:700;color:${NAVY}">
    <span style="font-size:20px;line-height:1">●</span><span>${esc(t)}</span></div>`).join('')}</div>`;

const botao = (txt, top = 825) => `<div style="position:absolute;left:96px;top:${top}px;height:88px;display:inline-flex;
  align-items:center;padding:0 40px;border-radius:14px;background:${LARANJA};
  font-size:32px;font-weight:700;color:#fff">${esc(txt)}</div>`;

/* ── os cinco layouts de post ──────────────────────────────────────────── */
// Marca/selo/título ficam nas MESMAS posições de quando o post era quadrado
// (perto do topo, onde sobrevivem a qualquer corte de grade). Só o que vem
// depois — corpo, tiles/chips/bullets/botão, rodapé — desce pro espaço extra
// dos 270px a mais de POST_H, com mais respiro entre os blocos.
function post(p) {
  const L = p.layout;

  if (L === 'cream') {
    return base(POST_W, POST_H, CREME,
      marca({ claro: true }) + pillClara(p.pill) + h1Post(p.h, NAVY) +
      corpoPost(p.body, 790, CINZA_CLARO) + chips(p.itens, { top: 1000 }) + rodapePost(p.rodape, '#94A3B8'));
  }

  if (L === 'centro') {
    return base(POST_W, POST_H, CREME,
      marca({ claro: true, centro: true }) +
      `<h1 style="position:absolute;left:0;top:296px;width:100%;padding:0 96px;text-align:center;
        font-size:92px;line-height:1.055;color:${NAVY}">${titulo(p.h)}</h1>` +
      `<p style="position:absolute;left:0;top:600px;width:100%;padding:0 140px;text-align:center;
        font-size:30px;font-weight:700;line-height:1.32;color:#334155">${esc(p.body)}</p>` +
      chips(p.itens, { top: 850, centro: true }) +
      `<div class="rodape" style="left:0;top:${RODAPE_POST_TOP}px;width:100%;text-align:center;font-size:22px;color:#94A3B8">${esc(p.rodape)}</div>`);
  }

  if (L === 'laranja') {
    // O círculo mais claro é decorativo — estava nos originais, em posições
    // que variam. Fica fixo aqui: o que importa é o texto, não a posição
    // exata de um enfeite.
    return base(POST_W, POST_H, LARANJA,
      `<div style="position:absolute;left:-120px;top:-140px;width:560px;height:560px;border-radius:50%;
        background:rgba(255,255,255,.045)"></div>` +
      marca({ claro: true, pontoLaranja: false }) + pillLaranja(p.pill) + h1Post(p.h, NAVY) +
      corpoPost(p.body, 806, 'rgba(15,23,42,.75)', 'font-weight:700;font-size:34px;line-height:1.5') +
      bullets(p.itens, 942) + rodapePost(p.rodape, 'rgba(15,23,42,.58)'));
  }

  if (L === 'tiles') {
    const comBrilho = !!p.glow;
    return base(POST_W, POST_H, comBrilho ? NAVY : NAVY_CLARO,
      (comBrilho ? brilho() : '') + marca({ claro: false }) +
      (comBrilho ? pillContorno(p.pill) : pillClara(p.pill)) +
      h1Post(p.h, '#fff') + corpoPost(p.body, 820, CINZA_ESCURO) +
      tiles(p.itens, { top: 1025 }) + rodapePost(p.rodape, CINZA_ESCURO));
  }

  // 'hero': fundo escuro com brilho; leva botão de ação OU chips escuros.
  return base(POST_W, POST_H, NAVY,
    brilho() + marca({ claro: false }) + pillContorno(p.pill) + h1Post(p.h, '#fff') +
    corpoPost(p.body, 790, CINZA_ESCURO) +
    // Quem manda é ter ou não um botão declarado no roteiro: um post que
    // define `btn` ganha o botão, o resto mostra chips. Antes isso dependia
    // de uma flag separada, e esquecê-la imprimia "undefined" no cartão.
    (p.btn ? botao(p.btn, 1020) : chips(p.itens, { escuro: true, top: 1020 })) +
    rodapePost(p.rodape, CINZA_CLARO));
}

/* ── story: layout único pra todos ─────────────────────────────────────── */
function story(p) {
  return base(1080, 1920, NAVY,
    brilho() + marca({ claro: false, y: 250, tam: 84, fonte: 44 }) +
    `<div style="position:absolute;left:96px;top:444px;height:67px;display:inline-flex;align-items:center;gap:11px;
      padding:0 28px;border:2px solid ${LARANJA};border-radius:34px;font-size:26.5px;font-weight:700;
      letter-spacing:.06em;color:${LARANJA}">${esc(STORY_PILL)}</div>` +
    `<h1 style="position:absolute;left:96px;top:566px;width:900px;font-size:94px;line-height:1.085;
      color:#fff">${titulo(p.h)}</h1>` +
    `<p style="position:absolute;left:96px;top:900px;width:890px;font-size:38px;line-height:1.47;
      color:${CINZA_ESCURO}">${esc(p.body)}</p>` +
    `<div style="position:absolute;left:96px;top:1477px;width:888px;height:123px;border-radius:18px;
      background:${LARANJA};color:#fff;font-size:36px;font-weight:700;display:flex;align-items:center;
      justify-content:center">finn.dev.br</div>` +
    `<div style="position:absolute;left:0;top:1640px;width:100%;text-align:center;font-size:23px;
      font-weight:700;letter-spacing:.10em;color:${CINZA_CLARO}">LINK NA BIO</div>`);
}

/* ── capa de reel ──────────────────────────────────────────────────────── */
function reel(r) {
  return base(1080, 1920, NAVY,
    brilho('centro') + marca({ claro: false, y: 113, tam: 60, fonte: 30, centro: true }) +
    `<h1 style="position:absolute;left:0;top:790px;width:100%;padding:0 90px;text-align:center;
      font-size:76px;line-height:1.32;color:#fff">${titulo(r.h)}</h1>` +
    `<div style="position:absolute;left:0;top:1706px;width:100%;display:flex;justify-content:center">
      <div style="height:78px;display:inline-flex;align-items:center;padding:0 44px;border-radius:39px;
        background:${LARANJA};font-size:30px;font-weight:700;color:rgba(15,23,42,.88)">${esc(r.btn)}</div>
    </div>`);
}

/* ── render ────────────────────────────────────────────────────────────── */
const so = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
const quer = (n) => so.length === 0 || so.includes(n);

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
// Os PNG do feed viajam embutidos no Worker, que tem teto de 3 MiB comprimido.
// Sem quantizar, os 20 cartões sozinhos comem quase 500 KB de margem à toa.
const pngGerados = [];
// Título comprido empurra o texto pra cima do bloco de baixo. A margem do
// cartão continua limpa, então nenhum teste de imagem acusa — só a leitura a
// olho, e foi assim que um cartão com o corpo atropelado quase foi publicado.
// Aqui o navegador mede: qualquer par de blocos que se sobreponha derruba a
// geração na hora, com o nome do arquivo e quantos pixels invadiu.
async function colisoes(p) {
  return p.evaluate(() => {
    const alvos = [...document.querySelectorAll('h1, p, .rodape, [data-bloco]')]
      .map((el) => ({ nome: el.tagName.toLowerCase() + (el.className ? '.' + el.className : ''), r: el.getBoundingClientRect() }))
      .filter((x) => x.r.height > 0);
    const ruins = [];
    for (let i = 0; i < alvos.length; i++) {
      for (let j = i + 1; j < alvos.length; j++) {
        const a = alvos[i].r, c = alvos[j].r;
        const dx = Math.min(a.right, c.right) - Math.max(a.left, c.left);
        const dy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
        if (dx > 2 && dy > 2) ruins.push(`${alvos[i].nome} x ${alvos[j].nome} (${Math.round(dy)}px)`);
      }
    }
    return ruins;
  });
}

async function render(html, w, h, saida, opts) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const ruins = await colisoes(p);
  if (ruins.length) {
    await p.close();
    throw new Error(`${path.basename(saida)}: blocos sobrepostos — ${ruins.join('; ')}. Encurte o título ou o corpo em copy.cjs.`);
  }
  await p.screenshot({ path: saida, ...opts });
  await p.close();
}

for (const p of POSTS) {
  if (!quer(p.n)) continue;
  const png = path.join(DIR, `../finn-serve/social/ig_post_${p.n}.png`);
  await render(post(p), POST_W, POST_H, png, { type: 'png' });
  pngGerados.push(png);
  await render(story(p), 1080, 1920, path.join(DIR, `../finn-worker/social/ig_story_${p.n}.jpg`), { type: 'jpeg', quality: 92 });
  console.log(`post + story ${p.n}`);
}
// finn-worker/index.js serve os stories em /social/story-N.jpg lendo este
// arquivo, porque a API do Instagram só aceita image_url pública. Ele era
// "gerado automaticamente" por um script que nunca entrou no repositório —
// então a regeração ficava dependendo de alguém lembrar como. Agora sai daqui.
async function regeraStoriesEmbutidos() {
  const dir = path.join(DIR, '../finn-worker/social');
  const nomes = POSTS.map((p) => `ig_story_${p.n}.jpg`);
  const b64 = nomes.map((n) => fs.readFileSync(path.join(dir, n)).toString('base64'));
  const cab = fs.readFileSync(path.join(DIR, '../finn-worker/social-stories.js'), 'utf8')
    .split('export const IG_STORIES')[0];
  fs.writeFileSync(
    path.join(DIR, '../finn-worker/social-stories.js'),
    cab + 'export const IG_STORIES = [\n' + b64.map((b) => '  "' + b + '",').join('\n') + '\n];\n'
  );
  console.log(`social-stories.js regerado (${nomes.length} stories)`);
}

for (const r of REELS) {
  if (so.length && !quer(100 + r.n)) continue;
  await render(reel(r), 1080, 1920, path.join(DIR, `../finn-serve/social/reel${r.n}_cover.jpg`), { type: 'jpeg', quality: 92 });
  console.log(`capa de reel ${r.n}`);
}
await b.close();

if (pngGerados.length) {
  console.log(execFileSync('python3', [path.join(DIR, 'otimiza-png.py'), ...pngGerados]).toString().trim());
}

// Só vale regerar o embutido quando todos os stories estão em dia.
if (so.length === 0) await regeraStoriesEmbutidos();

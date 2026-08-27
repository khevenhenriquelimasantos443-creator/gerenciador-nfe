// Imagem do primeiro post no X (Twitter) — formato paisagem (1200x675, 16:9),
// que é o que o X mostra em tamanho grande no feed (imagem quadrada ou
// vertical aparece cortada). Mesma identidade visual dos outros anúncios.
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, colisoes } from './_shared.mjs';

const W = 1200, H = 675;

const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  h1{font-weight:800;letter-spacing:-.02em}
  h1 i{font-style:normal;color:${LARANJA}}
  .glow{position:absolute;right:-220px;top:-260px;width:820px;height:820px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.32) 0%,rgba(249,115,22,0) 68%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.45;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:26px 26px}
</style>
<div class="glow"></div>
<div class="dots"></div>

${marca({ x: 64, y: 52, tam: 60, fonte: 27 })}

<div style="position:absolute;left:64px;top:158px;height:46px;display:inline-flex;align-items:center;gap:8px;
  padding:0 24px;border:2px solid ${LARANJA};border-radius:23px;font-size:18px;font-weight:700;
  letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">🎉 CHEGAMOS</div>

<h1 style="position:absolute;left:64px;top:230px;width:760px;font-size:64px;line-height:1.1;color:#fff">${titulo('O Finn chegou ao |X|.')}</h1>

<p style="position:absolute;left:64px;top:410px;width:680px;font-size:25px;line-height:1.5;color:${CINZA_ESCURO}">Dicas práticas de finanças, direto por aqui — sem enrolação.</p>

<div style="position:absolute;left:64px;top:562px;font-size:19px;font-weight:700;color:${CINZA_CLARO}">finn.dev.br</div>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
const ruins = await colisoes(p);
console.log(ruins.length ? 'COLISÕES: ' + ruins.join(' | ') : 'sem colisões');
const saida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'anuncio-x-chegamos.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);

// Post especial para investimento em ads (Meta Ads) — não entra na fila
// automática de publicação orgânica (finn-serve/social/ig_post_N.png), só
// nesse script isolado, pra não ser varrido pelo loop de auto-descoberta do
// build.js. Reaproveita a MESMA identidade visual medida em finn-social/
// gera-cards.mjs (cores, fonte, glow) e a logo real do app (finn-icon/icon.svg,
// via _shared.mjs) pra ficar 100% na cara do Finn, mas com uma composição
// própria: título + corpo + chips (mostrando a abrangência do produto) +
// botão de CTA, o que o layout 'hero' padrão não suporta junto (lá é chips
// OU botão, nunca os dois).
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, chipsHtml, colisoes } from './_shared.mjs';

const W = 1080, H = 1350;

const pill = '🔥 TUDO NUM SÓ LUGAR';
const headline = 'Toda a sua vida financeira, |num só lugar|.';
const corpo = 'Lança pelo WhatsApp, acompanha no site e sincroniza com a Planilha Finn — tudo junto, sem complicação.';
const itens = [
  ['💬', 'WhatsApp'], ['📗', 'Planilha'], ['🎯', 'Metas'],
  ['📉', 'Dívidas'], ['🧠', 'IA'], ['📚', 'Aprender'],
];
const btnTxt = 'Começa de graça  →  finn.dev.br';
const rodapeTxt = 'Grátis pra começar. Sem cartão de crédito.';

const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  h1{font-weight:700;letter-spacing:-.02em}
  h1 i{font-style:normal;color:${LARANJA}}
  .glowA{position:absolute;right:-200px;top:-260px;width:980px;height:980px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.34) 0%,rgba(249,115,22,0) 68%)}
  .glowB{position:absolute;left:-260px;bottom:-320px;width:820px;height:820px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.16) 0%,rgba(249,115,22,0) 70%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.5;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:28px 28px}
</style>
<div class="glowA"></div>
<div class="glowB"></div>
<div class="dots"></div>

${marca({ x: 96, y: 64, tam: 72, fonte: 30 })}

<div style="position:absolute;left:96px;top:220px;height:56px;display:inline-flex;align-items:center;gap:9px;
  padding:0 28px;border:2px solid ${LARANJA};border-radius:28px;font-size:20px;font-weight:700;
  letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">${esc(pill)}</div>

<h1 style="position:absolute;left:96px;top:322px;width:920px;font-size:88px;line-height:1.08;color:#fff">${titulo(headline)}</h1>

<p style="position:absolute;left:96px;top:706px;width:850px;font-size:33px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(corpo)}</p>

<div style="position:absolute;left:96px;top:876px;width:900px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center">${chipsHtml(itens)}</div>

<div style="position:absolute;left:96px;top:1090px;height:96px;display:inline-flex;align-items:center;
  padding:0 44px;border-radius:16px;background:${LARANJA};font-size:33px;font-weight:700;color:#fff;
  box-shadow:0 14px 30px rgba(249,115,22,.35)">${esc(btnTxt)}</div>

<div style="position:absolute;left:96px;top:1234px;font-size:23px;font-weight:700;color:${CINZA_CLARO}">${esc(rodapeTxt)}</div>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);

const ruins = await colisoes(p);
if (ruins.length) console.log('COLISÕES:', ruins.join(' | '));
else console.log('sem colisões');

const saida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'anuncio-tudo-num-so-lugar.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);

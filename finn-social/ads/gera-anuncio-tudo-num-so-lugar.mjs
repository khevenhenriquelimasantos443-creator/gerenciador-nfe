// Post especial para investimento em ads (Meta Ads) — não entra na fila
// automática de publicação orgânica (finn-serve/social/ig_post_N.png), só
// nesse script isolado, pra não ser varrido pelo loop de auto-descoberta do
// build.js. Reaproveita a MESMA identidade visual medida em finn-social/
// gera-cards.mjs (cores, fonte, marca, pill, glow) pra ficar 100% na cara do
// Finn, mas com uma composição própria: título + corpo + chips (mostrando a
// abrangência do produto) + botão de CTA, o que o layout 'hero' padrão não
// suporta junto (lá é chips OU botão, nunca os dois).
import { chromium } from 'playwright';
import path from 'path';

const W = 1080, H = 1350;

const CREME = '#F8F7F4';
const NAVY = '#0F172A';
const LARANJA = '#F97316';
const CINZA_CLARO = '#64748B';
const CINZA_ESCURO = '#94A3B8';
const FONTE = "Arial, 'Liberation Sans', Helvetica, sans-serif";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titulo = (h) => esc(h).replace(/\|([^|]+)\|/g, '<i>$1</i>');

const pill = '🔥 TUDO NUM SÓ LUGAR';
const headline = 'Toda a sua vida financeira, |num só lugar|.';
const corpo = 'Lança pelo WhatsApp, acompanha no site e sincroniza com a Planilha Finn — tudo junto, sem complicação.';
const chipsItens = [
  ['💬', 'WhatsApp'], ['📗', 'Planilha'], ['🎯', 'Metas'],
  ['📉', 'Dívidas'], ['🧠', 'IA'], ['📚', 'Aprender'],
];
const btnTxt = 'Começa de graça  →  finn.dev.br';
const rodapeTxt = 'Grátis pra começar. Sem cartão de crédito.';

const chipsHtml = chipsItens.map(([e, rot]) => `<div style="height:78px;display:inline-flex;align-items:center;gap:12px;
  padding:0 28px;border-radius:15px;background:#1D2436;border:1px solid rgba(255,255,255,.12);
  font-size:29px;font-weight:700;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.18)">${esc(e)} ${esc(rot)}</div>`).join('');

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

<div style="position:absolute;left:96px;top:64px;display:flex;align-items:center;gap:15px">
  <div style="width:56px;height:56px;border-radius:14px;background:${LARANJA};color:#fff;
    display:flex;align-items:center;justify-content:center;font-weight:700;font-size:30px">F</div>
  <div style="font-size:25px;font-weight:700;color:#fff">Finn<span style="color:${LARANJA}">.</span></div>
</div>

<div style="position:absolute;left:96px;top:220px;height:56px;display:inline-flex;align-items:center;gap:9px;
  padding:0 28px;border:2px solid ${LARANJA};border-radius:28px;font-size:20px;font-weight:700;
  letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">${esc(pill)}</div>

<h1 style="position:absolute;left:96px;top:322px;width:920px;font-size:88px;line-height:1.08;color:#fff">${titulo(headline)}</h1>

<p style="position:absolute;left:96px;top:706px;width:850px;font-size:33px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(corpo)}</p>

<div style="position:absolute;left:96px;top:862px;width:1px;height:1px"></div>
<div style="position:absolute;left:96px;top:876px;width:900px;display:flex;flex-wrap:wrap;gap:16px;justify-content:center">${chipsHtml}</div>

<div style="position:absolute;left:96px;top:1090px;height:96px;display:inline-flex;align-items:center;
  padding:0 44px;border-radius:16px;background:${LARANJA};font-size:33px;font-weight:700;color:#fff;
  box-shadow:0 14px 30px rgba(249,115,22,.35)">${esc(btnTxt)}</div>

<div style="position:absolute;left:96px;top:1234px;font-size:23px;font-weight:700;color:${CINZA_CLARO}">${esc(rodapeTxt)}</div>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);

// mesmo checador de colisão do gera-cards.mjs — evita bloco pisando em bloco.
const ruins = await p.evaluate(() => {
  const alvos = [...document.querySelectorAll('h1, p, div')]
    .filter((el) => el.children.length === 0 && (el.textContent || '').trim())
    .map((el) => ({ nome: el.tagName.toLowerCase() + ':' + (el.textContent || '').slice(0, 18), r: el.getBoundingClientRect() }))
    .filter((x) => x.r.height > 0);
  const out = [];
  for (let i = 0; i < alvos.length; i++) for (let j = i + 1; j < alvos.length; j++) {
    const a = alvos[i].r, c = alvos[j].r;
    const dx = Math.min(a.right, c.right) - Math.max(a.left, c.left);
    const dy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
    if (dx > 2 && dy > 2) out.push(`${alvos[i].nome} x ${alvos[j].nome} (${Math.round(dy)}px)`);
  }
  return out;
});
if (ruins.length) console.log('COLISÕES:', ruins.join(' | '));
else console.log('sem colisões');

const saida = path.join(path.dirname(new URL(import.meta.url).pathname), 'anuncio-tudo-num-so-lugar.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);

// Versão em Stories/Reels (1080x1920, 9:16) do mesmo anúncio pago do feed
// (anuncio-tudo-num-so-lugar.png) — mesma mensagem e mesma logo real do
// Finn, só reposicionada pro formato vertical. Também não entra na fila
// automática de publicação orgânica — ver o comentário no script do feed.
//
// Margem de segurança: Stories cobre ~250px no topo (nome/perfil) e ~250px
// embaixo (barra de resposta) com a interface do Instagram. Todo o conteúdo
// fica entre y=250 e y=1700, do jeito que finn-social/gera-cards.mjs já faz
// pro story() orgânico.
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, chipsHtml, colisoes } from './_shared.mjs';

const W = 1080, H = 1920;

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
  .glowA{position:absolute;left:50%;margin-left:-540px;top:-320px;width:1080px;height:1080px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 68%)}
  .glowB{position:absolute;left:-280px;bottom:-360px;width:900px;height:900px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.14) 0%,rgba(249,115,22,0) 70%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.5;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:28px 28px}
</style>
<div class="glowA"></div>
<div class="glowB"></div>
<div class="dots"></div>

${marca({ x: 96, y: 250, tam: 88, fonte: 42 })}

<div style="position:absolute;left:96px;top:460px;height:62px;display:inline-flex;align-items:center;gap:9px;
  padding:0 30px;border:2px solid ${LARANJA};border-radius:31px;font-size:23px;font-weight:700;
  letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">${esc(pill)}</div>

<h1 style="position:absolute;left:96px;top:582px;width:900px;font-size:92px;line-height:1.1;color:#fff">${titulo(headline)}</h1>

<p style="position:absolute;left:96px;top:966px;width:880px;font-size:38px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(corpo)}</p>

<div style="position:absolute;left:96px;top:1156px;width:900px;display:flex;flex-wrap:wrap;gap:18px;justify-content:center">${chipsHtml(itens, { fonte: 32, altura: 84 })}</div>

<div style="position:absolute;left:96px;top:1430px;height:106px;width:888px;display:flex;align-items:center;justify-content:center;
  border-radius:18px;background:${LARANJA};font-size:36px;font-weight:700;color:#fff;
  box-shadow:0 14px 30px rgba(249,115,22,.35)">${esc(btnTxt)}</div>

<div style="position:absolute;left:0;top:1580px;width:100%;text-align:center;font-size:25px;font-weight:700;color:${CINZA_CLARO}">${esc(rodapeTxt)}</div>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);

const ruins = await colisoes(p);
if (ruins.length) console.log('COLISÕES:', ruins.join(' | '));
else console.log('sem colisões');

const saida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'anuncio-stories-tudo-num-so-lugar.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);

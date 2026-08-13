// Regera os cartões do post 15 ("Junta dinheiro pro que importa").
//
// Os 20 cartões da campanha entraram no repositório como PNG/JPG prontos, sem
// fonte nenhuma — então corrigir um errinho de texto exigia refazer a arte na
// mão. Este arquivo é a fonte do 15, reconstruída a partir do original: cada
// medida abaixo saiu de medir o PNG/JPG antigo pixel a pixel — caixa de cada
// bloco, cores exatas, e a largura do texto pra calibrar o corpo da fonte —
// até o resultado bater com o original em tudo menos o título, que é o que
// mudou. Fora do título, os blocos ficaram a 0–4px de onde estavam.
//
// Uso: node finn-social/gera-card-15.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CREME = '#F8F7F4', NAVY = '#0F172A', LARANJA = '#F97316';
const CINZA = '#64748B', BORDA = '#E2E8F0', CHIP_TXT = '#1E293B', RODAPE = '#94A3B8';
const FONTE = "Arial, 'Liberation Sans', Helvetica, sans-serif";

// "pra o" não existe: para + o = pro. O original dizia "pra o que importa".
const TITULO_1 = 'Junta dinheiro ', TITULO_2 = 'pro que importa';
const CORPO = 'Cria uma meta, define o valor e acompanha o progresso — viagem, reserva de emergência, o que for.';

const post = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1080px;background:${CREME};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;padding:64px 96px;position:relative}
  .marca{display:flex;align-items:center;gap:15px;height:56px}
  .quad{width:56px;height:56px;border-radius:14px;background:${NAVY};color:${LARANJA};
        font-size:30px;font-weight:700;display:flex;align-items:center;justify-content:center}
  .nome{font-size:25px;font-weight:700;color:${NAVY}}
  .nome i{color:${LARANJA};font-style:normal}
  .pill{position:absolute;left:96px;top:220px;height:54px;display:inline-flex;align-items:center;
        gap:9px;padding:0 28px;border:1px solid ${BORDA};border-radius:27px;background:#fff;
        font-size:20px;font-weight:700;letter-spacing:.06em;color:#334155}
  h1{position:absolute;left:96px;top:320px;width:900px;font-size:92px;font-weight:700;
     line-height:1.055;letter-spacing:-.02em;color:${NAVY}}
  h1 i{color:${LARANJA};font-style:normal}
  p.corpo{position:absolute;left:96px;top:660px;width:830px;font-size:32px;line-height:1.5;color:${CINZA}}
  .chips{position:absolute;left:96px;top:800px;width:900px;display:flex;flex-wrap:wrap;gap:17px}
  .chip{height:76px;display:inline-flex;align-items:center;gap:12px;padding:0 26px;background:#fff;
        border:1px solid ${BORDA};border-radius:14px;font-size:28px;font-weight:700;color:${CHIP_TXT}}
  .rodape{position:absolute;left:96px;top:994px;font-size:22px;font-weight:700;color:${RODAPE}}
</style>
<div class="marca"><div class="quad">F</div><div class="nome">Finn<i>.</i></div></div>
<div class="pill">🎯 METAS</div>
<h1>${TITULO_1}<i>${TITULO_2}</i>.</h1>
<p class="corpo">${CORPO}</p>
<div class="chips">
  <div class="chip">🏖️ Viagem</div><div class="chip">🛟 Reserva de emergência</div>
  <div class="chip">🎁 O que você quiser</div>
</div>
<div class="rodape">finn.dev.br</div>`;

const story = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  .brilho{position:absolute;right:-180px;top:-220px;width:900px;height:900px;border-radius:50%;
          background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 68%)}
  .marca{position:absolute;left:96px;top:250px;display:flex;align-items:center;gap:22px}
  .quad{width:84px;height:84px;border-radius:21px;background:${LARANJA};color:#fff;
        font-size:46px;font-weight:700;display:flex;align-items:center;justify-content:center}
  .nome{font-size:44px;font-weight:700;color:#fff}
  .nome i{color:${LARANJA};font-style:normal}
  .pill{position:absolute;left:96px;top:444px;height:67px;display:inline-flex;align-items:center;
        gap:11px;padding:0 28px;border:2px solid ${LARANJA};border-radius:34px;
        font-size:26.5px;font-weight:700;letter-spacing:.06em;color:${LARANJA}}
  h1{position:absolute;left:96px;top:566px;width:900px;font-size:94px;font-weight:700;
     line-height:1.085;letter-spacing:-.02em;color:#fff}
  h1 i{color:${LARANJA};font-style:normal}
  p.corpo{position:absolute;left:96px;top:822px;width:890px;font-size:38px;line-height:1.47;color:#94A3B8}
  .btn{position:absolute;left:96px;top:1477px;width:888px;height:123px;border-radius:18px;
       background:${LARANJA};color:#fff;font-size:36px;font-weight:700;
       display:flex;align-items:center;justify-content:center}
  .bio{position:absolute;left:0;top:1640px;width:1080px;text-align:center;
       font-size:23px;font-weight:700;letter-spacing:.10em;color:#64748B}
</style>
<div class="brilho"></div>
<div class="marca"><div class="quad">F</div><div class="nome">Finn<i>.</i></div></div>
<div class="pill">✦ APP FINANCEIRO 100% GRÁTIS</div>
<h1>${TITULO_1}<i>${TITULO_2}</i></h1>
<p class="corpo">${CORPO}</p>
<div class="btn">finn.dev.br</div>
<div class="bio">LINK NA BIO</div>`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const [html, w, h, saida, opts] of [
  [post, 1080, 1080, path.join(DIR, '../finn-serve/social/ig_post_15.png'), { type: 'png' }],
  [story, 1080, 1920, path.join(DIR, '../finn-worker/social/ig_story_15.jpg'), { type: 'jpeg', quality: 92 }],
]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: saida, ...opts });
  console.log('gerado', path.basename(saida));
  await p.close();
}
await b.close();

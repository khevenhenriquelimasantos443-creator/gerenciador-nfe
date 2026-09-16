// Vídeo de ANÚNCIO pago pro TikTok (9:16), pra impulsionar com Ads — não
// entra na fila automática de propósito (mesmo motivo do
// gera-anuncio-premium.mjs: peça isolada, feita pra ser escolhida à mão na
// hora de criar a campanha, não publicada organicamente pela fila).
//
// Reaproveita o mockup do app (cartão de saldo + gráfico + meta) já usado no
// anúncio estático gera-anuncio-premium.mjs — mesma identidade visual, agora
// animada — e o timing de gancho rápido validado nos vídeos orgânicos (ver
// gera-videos-dicas.mjs): o headline principal aparece quase no frame 1,
// porque ads em vídeo perdem espectador no scroll tão rápido quanto orgânico.
//
// Duração maior que os vídeos orgânicos (9,5s em vez de 7,2s) porque um
// anúncio pra tráfego frio precisa deixar claro O QUE é o produto (não só um
// gancho de curiosidade) antes do CTA — cabe hook + prova visual + 3
// benefícios + CTA com folga de leitura no final.
//
// Números do mockup são ILUSTRATIVOS (prática padrão em anúncio de app
// financeiro, mesmo aviso do gera-anuncio-premium.mjs).
//
// Uso:  node finn-social/ads/gera-video-anuncio-tiktok.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, colisoes } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 9.5;

const pill = '✦ APP BRASILEIRO, GRÁTIS PRA TESTAR';
const h1 = 'O app que organiza sua grana |sozinho|.';
const sub = 'Importa o extrato, categoriza cada gasto e avisa antes de uma conta vencer.';
const chips = ['📷 Extrato automático', '🎯 Metas e dívidas', '💬 Lança pelo WhatsApp'];
const rodapeTxt = 'Sem cartão de crédito. Plano grátis de verdade.';
const ctaTxt = 'Testa grátis  →  finn.dev.br';

const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  h1{font-weight:800;letter-spacing:-.025em;color:#fff;line-height:1.08}
  h1 i{font-style:normal;color:${LARANJA}}
  .glowA{position:absolute;left:50%;margin-left:-620px;top:-380px;width:1240px;height:1240px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.32) 0%,rgba(249,115,22,0) 62%);
    animation:pulse 3s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:.75}50%{opacity:1}}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.45;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:26px 26px}

  .beat{position:absolute;left:96px;width:888px;opacity:0}
  .fadeUp{animation:fadeUp .6s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  .pop{animation:pop .7s cubic-bezier(.34,1.56,.64,1) forwards}
  @keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}

  .chipsRow{position:absolute;left:96px;top:800px;width:888px;display:flex;flex-wrap:wrap;gap:14px}
  .chip{opacity:0;height:66px;display:inline-flex;align-items:center;padding:0 26px;border-radius:16px;
    background:#1D2436;border:1px solid rgba(255,255,255,.12);font-size:26px;font-weight:700;color:#fff}

  /* ── mockup do app (mesmo visual de gera-anuncio-premium.mjs) ── */
  .mock{position:absolute;left:114px;top:960px;width:852px;height:404px;opacity:0;
    background:#141B2E;border:1px solid rgba(255,255,255,.08);border-radius:28px;
    box-shadow:0 40px 90px rgba(0,0,0,.55),0 10px 26px rgba(0,0,0,.35);
    transform:rotate(-2.2deg) scale(.9);padding:34px 38px}
  .mock-label{font-size:19px;color:${CINZA_ESCURO};font-weight:700;letter-spacing:.04em;text-transform:uppercase}
  .mock-saldo-row{display:flex;align-items:center;gap:16px;margin-top:6px}
  .mock-saldo{font-size:52px;font-weight:800;color:#fff}
  .mock-tag{height:36px;display:inline-flex;align-items:center;gap:6px;padding:0 16px;border-radius:18px;
    background:rgba(34,197,94,.14);color:#4ADE80;font-size:17px;font-weight:700;white-space:nowrap}
  .mock-bars{display:flex;align-items:flex-end;gap:14px;height:96px;margin-top:26px}
  .mock-bar{flex:1;border-radius:8px 8px 0 0;background:linear-gradient(180deg,${LARANJA},rgba(249,115,22,.35));
    height:0;animation:growBar .8s cubic-bezier(.2,.8,.2,1) forwards}
  .mock-cats{display:flex;gap:12px;margin-top:26px}
  .mock-chip{height:46px;display:inline-flex;align-items:center;gap:8px;padding:0 20px;border-radius:12px;
    background:#1D2436;border:1px solid rgba(255,255,255,.10);font-size:18px;font-weight:700;color:#fff}

  .meta{position:absolute;left:824px;top:906px;width:242px;opacity:0;background:#fff;border-radius:20px;
    padding:20px 22px;box-shadow:0 24px 50px rgba(0,0,0,.4);transform:rotate(3deg)}
  .meta-label{font-size:15px;font-weight:700;color:#64748B;letter-spacing:.03em;text-transform:uppercase}
  .meta-nome{font-size:20px;font-weight:800;color:#0F172A;margin-top:4px}
  .meta-track{margin-top:12px;height:10px;border-radius:6px;background:#E2E8F0;overflow:hidden}
  .meta-fill{height:100%;width:0;border-radius:6px;background:${LARANJA};animation:growFill 1s ease-out forwards}
  .meta-pct{margin-top:8px;font-size:14px;font-weight:700;color:${LARANJA}}
  @keyframes growFill{from{width:0}to{width:64%}}

  .cta{position:absolute;left:96px;top:1500px;width:888px;opacity:0;display:flex;justify-content:center}
  .cta-btn{height:112px;display:inline-flex;align-items:center;padding:0 52px;border-radius:20px;
    background:${LARANJA};font-size:38px;font-weight:700;color:#fff;box-shadow:0 16px 34px rgba(249,115,22,.4)}
  .rodape{position:absolute;left:96px;top:1650px;width:888px;text-align:center;opacity:0;
    font-size:26px;font-weight:700;color:${CINZA_CLARO}}
</style>
<div class="glowA"></div>
<div class="dots"></div>

${marca({ x: 96, y: 96, tam: 84, fonte: 40 })}

<!-- Gancho quase instantâneo (badge + h1), mesmo timing validado nos vídeos
     orgânicos depois da métrica de 2,67s de visualização média no TikTok. -->
<div class="beat fadeUp" style="top:280px;height:58px;display:inline-flex;align-items:center;gap:9px;
  padding:0 30px;border:2px solid ${LARANJA};border-radius:29px;font-size:24px;font-weight:700;
  letter-spacing:.05em;color:${LARANJA};background:rgba(249,115,22,.08);width:auto;animation-delay:0s">${esc(pill)}</div>

<div class="beat fadeUp" style="top:380px;animation-delay:.05s">
  <h1 style="font-size:78px">${titulo(h1)}</h1>
</div>

<div class="beat fadeUp" style="top:620px;animation-delay:1s">
  <p style="font-size:38px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(sub)}</p>
</div>

<div class="chipsRow">
  ${chips.map((c, i) => `<div class="chip fadeUp" style="animation-delay:${(1.8 + i * 0.15).toFixed(2)}s">${esc(c)}</div>`).join('')}
</div>

<div class="mock pop" style="animation-delay:2.6s">
  <div class="mock-label">Saldo do mês</div>
  <div class="mock-saldo-row">
    <div class="mock-saldo">R$ 3.240,00</div>
    <div class="mock-tag">▲ 12% a mais</div>
  </div>
  <div class="mock-bars">
    <div class="mock-bar" style="height:38%;animation-delay:3.1s"></div>
    <div class="mock-bar" style="height:62%;animation-delay:3.15s"></div>
    <div class="mock-bar" style="height:48%;animation-delay:3.2s"></div>
    <div class="mock-bar" style="height:100%;animation-delay:3.25s"></div>
    <div class="mock-bar" style="height:70%;animation-delay:3.3s"></div>
    <div class="mock-bar" style="height:55%;animation-delay:3.35s"></div>
    <div class="mock-bar" style="height:82%;animation-delay:3.4s"></div>
  </div>
  <div class="mock-cats">
    <div class="mock-chip">🛒 Mercado</div>
    <div class="mock-chip">🚗 Transporte</div>
    <div class="mock-chip">🏠 Casa</div>
  </div>
</div>

<div class="meta pop" style="animation-delay:2.9s">
  <div class="meta-label">Meta</div>
  <div class="meta-nome">🏖️ Viagem</div>
  <div class="meta-track"><div class="meta-fill" style="animation-delay:3.2s"></div></div>
  <div class="meta-pct">64% guardado</div>
</div>

<div class="cta pop" style="animation-delay:5s">
  <div class="cta-btn">${esc(ctaTxt)}</div>
</div>
<div class="rodape fadeUp" style="animation-delay:5.2s">${esc(rodapeTxt)}</div>
`;

const DIR = path.dirname(fileURLToPath(import.meta.url));
const videosDir = path.join(DIR, '_tmp_video');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({
  viewport: { width: W, height: H },
  recordVideo: { dir: videosDir, size: { width: W, height: H } },
});
const p = await ctx.newPage();
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);

const ruins = await colisoes(p);
if (ruins.length) console.log('COLISÕES:', ruins.join(' | '));
else console.log('sem colisões');

await p.waitForTimeout(DURACAO * 1000);
const video = p.video();
await p.close();
const webm = await video.path();
await ctx.close();
await b.close();

const saida = path.join(DIR, 'anuncio-video-tiktok.mp4');
// '-ss 0.15' pula o frame em branco inicial do Playwright (mesmo motivo dos
// vídeos orgânicos — ver comentário em gera-videos-dicas.mjs).
execFileSync('ffmpeg', ['-y', '-ss', '0.15', '-i', webm, '-t', String(DURACAO - 0.15), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
console.log('gerado:', saida);

// Anúncio pago (Meta Ads) — peça nova, mais premium que anuncio-tudo-num-
// so-lugar.png: em vez de só chips de texto, mostra um mockup estilizado do
// app (cartão de saldo + gráfico + meta), pra parecer produto de verdade em
// vez de só tipografia. Os números do mockup são ILUSTRATIVOS (prática
// padrão em anúncio de app financeiro — não é print real nem promessa de
// resultado), deixado claro no código pra não virar reivindicação por engano.
//
// Não entra na fila automática (mesmo motivo do anuncio-tudo-num-so-lugar.mjs
// — script isolado, o build.js só varre finn-serve/social/ig_post_N.png em
// sequência a partir de 1).
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, colisoes } from './_shared.mjs';

const W = 1080, H = 1350;

const pill = '✦ APP BRASILEIRO, COM PLANO GRÁTIS';
const headline = 'O app que organiza sua grana |sozinho|.';
const corpo = 'Importa o extrato, categoriza cada gasto e avisa antes de uma conta vencer. Você só acompanha.';
const btnTxt = 'Testa grátis  →  finn.dev.br';
const rodapeTxt = 'Sem cartão de crédito. Plano grátis de verdade.';

const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  h1{font-weight:800;letter-spacing:-.025em}
  h1 i{font-style:normal;color:${LARANJA}}
  .glowA{position:absolute;left:50%;margin-left:-620px;top:-380px;width:1240px;height:1240px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 62%)}
  .glowB{position:absolute;right:-260px;bottom:-260px;width:760px;height:760px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.14) 0%,rgba(249,115,22,0) 70%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.45;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:26px 26px}

  /* ── mockup do app: cartão flutuante, inclinado, com sombra funda ── */
  .mock{position:absolute;left:114px;top:824px;width:852px;height:404px;
    background:#141B2E;border:1px solid rgba(255,255,255,.08);border-radius:28px;
    box-shadow:0 40px 90px rgba(0,0,0,.55),0 10px 26px rgba(0,0,0,.35);
    transform:rotate(-2.2deg);padding:34px 38px}
  .mock-label{font-size:19px;color:${CINZA_ESCURO};font-weight:700;letter-spacing:.04em;text-transform:uppercase}
  .mock-saldo-row{display:flex;align-items:center;gap:16px;margin-top:6px}
  .mock-saldo{font-size:52px;font-weight:800;color:#fff}
  .mock-tag{height:36px;display:inline-flex;align-items:center;gap:6px;padding:0 16px;border-radius:18px;
    background:rgba(34,197,94,.14);color:#4ADE80;font-size:17px;font-weight:700;white-space:nowrap}
  .mock-bars{display:flex;align-items:flex-end;gap:14px;height:96px;margin-top:26px}
  .mock-bar{flex:1;border-radius:8px 8px 0 0;background:linear-gradient(180deg,${LARANJA},rgba(249,115,22,.35))}
  .mock-cats{display:flex;gap:12px;margin-top:26px}
  .mock-chip{height:46px;display:inline-flex;align-items:center;gap:8px;padding:0 20px;border-radius:12px;
    background:#1D2436;border:1px solid rgba(255,255,255,.10);font-size:18px;font-weight:700;color:#fff}

  /* selo "meta" sobreposto, quebrando o retângulo do cartão principal */
  .meta{position:absolute;left:824px;top:770px;width:242px;background:#fff;border-radius:20px;
    padding:20px 22px;box-shadow:0 24px 50px rgba(0,0,0,.4);transform:rotate(3deg)}
  .meta-label{font-size:15px;font-weight:700;color:#64748B;letter-spacing:.03em;text-transform:uppercase}
  .meta-nome{font-size:20px;font-weight:800;color:#0F172A;margin-top:4px}
  .meta-track{margin-top:12px;height:10px;border-radius:6px;background:#E2E8F0;overflow:hidden}
  .meta-fill{height:100%;width:64%;border-radius:6px;background:${LARANJA}}
  .meta-pct{margin-top:8px;font-size:14px;font-weight:700;color:${LARANJA}}
</style>
<div class="glowA"></div>
<div class="glowB"></div>
<div class="dots"></div>

${marca({ x: 96, y: 72, tam: 76, fonte: 34 })}

<div style="position:absolute;left:96px;top:210px;height:58px;display:inline-flex;align-items:center;gap:9px;
  padding:0 30px;border:2px solid ${LARANJA};border-radius:29px;font-size:21px;font-weight:700;
  letter-spacing:.05em;color:${LARANJA};background:rgba(249,115,22,.08)">${esc(pill)}</div>

<h1 style="position:absolute;left:96px;top:308px;width:900px;font-size:82px;line-height:1.1;color:#fff">${titulo(headline)}</h1>

<p style="position:absolute;left:96px;top:598px;width:790px;font-size:32px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(corpo)}</p>

<div class="mock">
  <div class="mock-label">Saldo do mês</div>
  <div class="mock-saldo-row">
    <div class="mock-saldo">R$ 3.240,00</div>
    <div class="mock-tag">▲ 12% a mais</div>
  </div>
  <div class="mock-bars">
    <div class="mock-bar" style="height:38%"></div>
    <div class="mock-bar" style="height:62%"></div>
    <div class="mock-bar" style="height:48%"></div>
    <div class="mock-bar" style="height:100%"></div>
    <div class="mock-bar" style="height:70%"></div>
    <div class="mock-bar" style="height:55%"></div>
    <div class="mock-bar" style="height:82%"></div>
  </div>
  <div class="mock-cats">
    <div class="mock-chip">🛒 Mercado</div>
    <div class="mock-chip">🚗 Transporte</div>
    <div class="mock-chip">🏠 Casa</div>
  </div>
</div>

<div class="meta">
  <div class="meta-label">Meta</div>
  <div class="meta-nome">🏖️ Viagem</div>
  <div class="meta-track"><div class="meta-fill"></div></div>
  <div class="meta-pct">64% guardado</div>
</div>

<div style="position:absolute;left:96px;top:1256px;font-size:22px;font-weight:700;color:${CINZA_CLARO};z-index:2">${esc(rodapeTxt)}</div>
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);

const ruins = await colisoes(p);
if (ruins.length) console.log('COLISÕES:', ruins.join(' | '));
else console.log('sem colisões');

const saida = path.join(path.dirname(fileURLToPath(import.meta.url)), 'anuncio-premium.png');
await p.screenshot({ path: saida });
await b.close();
console.log('gerado:', saida);

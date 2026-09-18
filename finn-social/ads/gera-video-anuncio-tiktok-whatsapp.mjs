// Segundo criativo de anúncio pro TikTok Ads (Tráfego/Conversão) — ângulo
// DIFERENTE do anúncio "Você sabe pra onde vai o seu dinheiro?"
// (gera-video-anuncio-tiktok-trafego.mjs): em vez do mockup de saldo/
// gráfico, mostra a conversa acontecendo de verdade no WhatsApp — recurso
// bem diferenciado (poucos apps financeiros deixam lançar por mensagem) e
// ainda não usado em nenhum anúncio. Pedido explícito do Kheven depois de
// ver que reciclar o mesmo criativo da campanha já promovida não ajuda a
// testar o que funciona melhor.
//
// Mesmas lições da campanha anterior aplicadas aqui:
//   - Zona segura do TikTok: nada abaixo de ~1600px (de 1920) — ver
//     gera-video-anuncio-tiktok-trafego.mjs pra explicação completa.
//   - CTA cedo (a partir de ~5,5s): retenção real caiu muito entre 2-6s.
//   - Texto sem "sozinho"/"sem fazer nada" (rejeição por Financial
//     Misrepresentation na campanha anterior) — aqui a prova já é visual
//     (a mensagem chega, o Finn categoriza na tela), então nem precisa da
//     palavra "automático" carregando sozinha o peso da alegação.
//
// Uso:  node finn-social/ads/gera-video-anuncio-tiktok-whatsapp.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, marca, colisoes } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 9.5;

const pill = '🪄 SEM ABRIR O APP';
const h1 = 'Manda o gasto no |WhatsApp|. Só isso.';
const sub = 'O Finn recebe a mensagem e categoriza o gasto na hora.';
const chips = ['🎯 Metas e dívidas', '🏆 Conquistas do app'];
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
  .pop{animation:pop .5s cubic-bezier(.34,1.56,.64,1) forwards}
  @keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}

  .chipsRow{position:absolute;left:96px;top:1250px;width:888px;display:flex;flex-wrap:wrap;gap:14px}
  .chip{opacity:0;height:66px;display:inline-flex;align-items:center;padding:0 26px;border-radius:16px;
    background:#1D2436;border:1px solid rgba(255,255,255,.12);font-size:26px;font-weight:700;color:#fff}

  /* ── demonstração real: conversa no WhatsApp, não um mockup de painel ── */
  .chat{position:absolute;left:96px;top:790px;width:888px;height:440px;opacity:0;
    background:#141B2E;border:1px solid rgba(255,255,255,.08);border-radius:28px;
    box-shadow:0 40px 90px rgba(0,0,0,.55),0 10px 26px rgba(0,0,0,.35);padding:32px 36px}
  .chat-label{font-size:19px;color:${CINZA_ESCURO};font-weight:700;letter-spacing:.04em;text-transform:uppercase}
  .bubble-row{display:flex;margin-top:20px}
  .bubble-row.right{justify-content:flex-end}
  .bubble{opacity:0;font-size:30px;font-weight:700;padding:16px 30px;border-radius:22px}
  .bubble-user{background:#2B3546;color:#fff;border-radius:22px 22px 4px 22px}
  .bubble-finn{background:rgba(34,197,94,.14);color:#4ADE80;border:1px solid rgba(74,222,128,.3);
    border-radius:22px 22px 22px 4px;font-size:26px}

  .cta{position:absolute;left:96px;top:1420px;width:888px;opacity:0;display:flex;justify-content:center}
  .cta-btn{height:112px;display:inline-flex;align-items:center;padding:0 52px;border-radius:20px;
    background:${LARANJA};font-size:38px;font-weight:700;color:#fff;box-shadow:0 16px 34px rgba(249,115,22,.4)}
  .rodape{position:absolute;left:96px;top:1560px;width:888px;text-align:center;opacity:0;
    font-size:26px;font-weight:700;color:${CINZA_CLARO}}
</style>
<div class="glowA"></div>
<div class="dots"></div>

${marca({ x: 96, y: 96, tam: 84, fonte: 40 })}

<div class="beat fadeUp" style="top:260px;height:58px;display:inline-flex;align-items:center;gap:9px;
  padding:0 30px;border:2px solid ${LARANJA};border-radius:29px;font-size:24px;font-weight:700;
  letter-spacing:.05em;color:${LARANJA};background:rgba(249,115,22,.08);width:auto;animation-delay:0s">${esc(pill)}</div>

<div class="beat fadeUp" style="top:360px;animation-delay:.05s">
  <h1 style="font-size:78px">${titulo(h1)}</h1>
</div>

<div class="beat fadeUp" style="top:590px;animation-delay:1s">
  <p style="font-size:38px;line-height:1.5;font-weight:400;color:${CINZA_ESCURO}">${esc(sub)}</p>
</div>

<div class="chat pop" style="animation-delay:1.8s">
  <div class="chat-label">💬 WhatsApp</div>
  <div class="bubble-row right"><div class="bubble bubble-user pop" style="animation-delay:2.2s">Uber 32</div></div>
  <div class="bubble-row"><div class="bubble bubble-finn pop" style="animation-delay:2.9s">✅ Transporte · R$ 32,00</div></div>
  <div class="bubble-row right"><div class="bubble bubble-user pop" style="animation-delay:3.6s">Mercado 87</div></div>
  <div class="bubble-row"><div class="bubble bubble-finn pop" style="animation-delay:4.3s">✅ Alimentação · R$ 87,00</div></div>
</div>

<div class="chipsRow">
  ${chips.map((c, i) => `<div class="chip fadeUp" style="animation-delay:${(5.2 + i * 0.15).toFixed(2)}s">${esc(c)}</div>`).join('')}
</div>

<div class="cta pop" style="animation-delay:5.9s">
  <div class="cta-btn">${esc(ctaTxt)}</div>
</div>
<div class="rodape fadeUp" style="animation-delay:6.1s">${esc(rodapeTxt)}</div>
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

const saida = path.join(DIR, 'anuncio-video-tiktok-whatsapp.mp4');
execFileSync('ffmpeg', ['-y', '-ss', '0.15', '-i', webm, '-t', String(DURACAO - 0.15), '-vf', 'scale=2160:3840:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '16', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
console.log('gerado:', saida);

// Segundo lote de vídeos curtos (9:16, silenciosos) pra Reels/TikTok — mesmo
// gerador e identidade visual de gera-videos-dicas.mjs. Temas novos, ainda
// não usados em vídeo: alerta de gasto fora do padrão, resumo semanal por
// notificação, reserva de emergência e simulação de quitação de dívida —
// recursos reais, já auditados (ver finn-social/fila/manifest.json e o
// carrossel "5 coisas que o Finn faz sozinho" pros mesmos temas em outro
// formato).
//
// Uso:  node finn-social/ads/gera-videos-dicas2.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca, titulo } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 7.2;

const DICAS = [
  {
    slug: 'gasto-fora-padrao',
    badge: '🚨 OLHO VIVO',
    h1a: 'Esse Uber ficou',
    h1b: '|mais caro| que o normal?',
    sub: 'O Finn compara com o que você costuma pagar e avisa na hora — antes de você nem notar.',
    cta: 'Testa grátis',
  },
  {
    slug: 'resumo-semanal',
    badge: '📬 TODA SEMANA',
    h1a: 'Sexta-feira e já',
    h1b: '|sabe quanto gastou|?',
    sub: 'O Finn manda uma notificação toda semana — e se foi mais ou menos que a anterior.',
    cta: 'Testa grátis',
  },
  {
    slug: 'reserva-emergencia',
    badge: '🛟 PRA IMPREVISTO',
    h1a: 'Pneu furou. Vira',
    h1b: '|dívida no cartão|?',
    sub: 'Sem reserva, todo imprevisto vira parcelamento. Tem uma trilha inteira sobre isso, de graça, no Finn.',
    cta: 'Aprende grátis',
  },
  {
    slug: 'quita-divida',
    badge: '📉 SAIR DO VERMELHO',
    h1a: 'Quanto falta pra você',
    h1b: 'sair da |dívida|?',
    sub: 'O Finn simula a quitação com os juros de verdade — e mostra quanto muda se você pagar um pouco a mais.',
    cta: 'Testa grátis',
  },
];

function html(d) {
  return `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  .glow{position:absolute;left:50%;margin-left:-540px;top:-320px;width:1080px;height:1080px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.34) 0%,rgba(249,115,22,0) 68%);
    animation:pulse 3s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.5;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:28px 28px}
  .beat{position:absolute;left:96px;width:888px;opacity:0}
  .fadeUp{animation:fadeUp .6s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  .pop{animation:pop .7s cubic-bezier(.34,1.56,.64,1) forwards}
  @keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
  h1{font-weight:800;letter-spacing:-.02em;color:#fff;line-height:1.06}
  h1 i{font-style:normal;color:${LARANJA}}
</style>
<div class="glow"></div>
<div class="dots"></div>

${marca({ x: 96, y: 96, tam: 84, fonte: 40 })}

<div class="beat fadeUp" style="top:560px;animation-delay:0s">
  <div style="display:inline-flex;align-items:center;gap:9px;height:60px;padding:0 30px;
    border:2px solid ${LARANJA};border-radius:30px;font-size:24px;font-weight:700;
    letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">${d.badge}</div>
</div>

<div class="beat fadeUp" style="top:680px;animation-delay:.5s">
  <h1 style="font-size:80px">${titulo(d.h1a)}</h1>
</div>
<div class="beat fadeUp" style="top:800px;animation-delay:1s">
  <h1 style="font-size:80px">${titulo(d.h1b)}</h1>
</div>

<div class="beat fadeUp" style="top:1000px;animation-delay:2s">
  <p style="font-size:44px;line-height:1.45;color:${CINZA_ESCURO};font-weight:400">${d.sub}</p>
</div>

<div class="beat pop" style="top:1420px;animation-delay:4.2s;display:flex;justify-content:center;width:888px">
  <div style="height:104px;display:inline-flex;align-items:center;padding:0 48px;border-radius:18px;
    background:${LARANJA};font-size:36px;font-weight:700;color:#fff;
    box-shadow:0 14px 30px rgba(249,115,22,.35)">${d.cta}</div>
</div>
`;
}

const DIR = path.dirname(fileURLToPath(import.meta.url));

for (const d of DICAS) {
  const videosDir = path.join(DIR, '_tmp_video');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({
    viewport: { width: W, height: H },
    recordVideo: { dir: videosDir, size: { width: W, height: H } },
  });
  const p = await ctx.newPage();
  await p.setContent(html(d), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(DURACAO * 1000);
  const video = p.video();
  await p.close();
  const webm = await video.path();
  await ctx.close();
  await b.close();

  const saida = path.join(DIR, `dica-${d.slug}.mp4`);
  // '-ss 0.15' ANTES do -i: pula os primeiros ~150ms do que o Playwright
  // gravou. O primeiro frame às vezes sai em branco (a página ainda não
  // tinha pintado quando a gravação começou) — sem cortar isso, a
  // plataforma pode escolher esse frame como capa (foi exatamente o que
  // aconteceu: "Chega de planilha" saiu com capa toda branca no Instagram).
  execFileSync('ffmpeg', ['-y', '-ss', '0.15', '-i', webm, '-t', String(DURACAO - 0.15), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
  console.log('gerado:', saida);
}

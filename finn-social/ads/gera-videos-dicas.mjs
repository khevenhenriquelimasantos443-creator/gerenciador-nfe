// Vídeos curtos (9:16, silenciosos) pra TikTok/Reels, mesma identidade visual
// do anúncio "chegamos no TikTok" (gera-video-chegada-tiktok.mjs). Sem
// narração: o HIggsfield (TTS/geração de vídeo) está indisponível nesta
// sessão — ver finn-social/ads/_voz_padrao.md pra narrar quando ele voltar
// (fica só regravar o áudio e remuxar com ffmpeg, igual foi feito lá).
//
// O texto de cada vídeo é o MESMO já auditado dos cartões do Instagram
// (finn-social/copy.cjs POSTS #2, #3 e #4) — não é conteúdo novo, é o
// roteiro existente em formato animado.
//
// Uso:  node finn-social/ads/gera-videos-dicas.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca, titulo } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 7.2;

const DICAS = [
  {
    slug: 'importa-extrato',
    badge: '📊 AUTOMÁTICO',
    h1a: 'Chega de',
    h1b: '|planilha|.',
    sub: 'Importa o extrato do banco e o Finn organiza tudo sozinho — receitas, despesas e categorias.',
    cta: 'Testa grátis',
  },
  {
    slug: 'ia-gastos',
    badge: '🤖 IA FINANCEIRA',
    h1a: 'Uma IA que lê',
    h1b: '|seus gastos|.',
    sub: 'Analisa o seu mês e devolve o que dá para cortar, em português claro.',
    cta: 'Testa grátis',
  },
  {
    slug: 'metas-limites-dividas',
    badge: '🎯 TUDO NUM LUGAR',
    h1a: 'Metas, limites e',
    h1b: '|dívidas|.',
    sub: 'Define quanto quer gastar por categoria, junta dinheiro pra um objetivo e simula a quitação de uma dívida.',
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
  <h1 style="font-size:92px">${titulo(d.h1a)}</h1>
</div>
<div class="beat fadeUp" style="top:800px;animation-delay:1s">
  <h1 style="font-size:92px">${titulo(d.h1b)}</h1>
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
  execFileSync('ffmpeg', ['-y', '-i', webm, '-t', String(DURACAO), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
  console.log('gerado:', saida);
}

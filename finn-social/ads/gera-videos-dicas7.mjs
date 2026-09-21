// Sétimo lote de vídeos curtos (9:16, silenciosos) pra Reels/TikTok — mesmo
// gerador e identidade visual dos lotes anteriores. Terceira parte do
// reabastecimento de 30 vídeos (ver gera-videos-dicas5.mjs pro contexto
// completo): educação financeira, curiosidade e as conquistas secretas que
// ainda não tinham virado vídeo (sextou, coruja, tesoura — ver
// CONQUISTAS_DEFS em finn/index.html).
//
// Uso:  node finn-social/ads/gera-videos-dicas7.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca, titulo } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 7.2;

const DICAS = [
  {
    slug: 'trilhas-aprender',
    badge: '📚 DE GRAÇA',
    h1a: '40 lições sobre',
    h1b: '|dinheiro|, de graça.',
    sub: 'Ninguém te ensinou isso na escola. O Finn ensina agora.',
    cta: 'Aprende grátis',
  },
  {
    slug: 'mito-planilha-video',
    badge: '❌ MITO',
    h1a: 'Organizar as finanças',
    h1b: 'exige |planilha|?',
    sub: 'Importa o extrato, e o Finn já organiza tudo por categoria.',
    cta: 'Testa grátis',
  },
  {
    slug: 'verdade-anotar-video',
    badge: '✅ VERDADE',
    h1a: 'Só de ver pra onde',
    h1b: 'vai, |você já muda|.',
    sub: 'Anotar o gasto muda a forma como você decide gastar.',
    cta: 'Testa grátis',
  },
  {
    slug: 'perfil-gastador-video',
    badge: '🎭 SEM JULGAMENTO',
    h1a: 'Qual desses 4',
    h1b: 'perfis é |você|?',
    sub: 'Descobre no gráfico por categoria do Finn.',
    cta: 'Testa grátis',
  },
  {
    slug: 'sextou-conquista',
    badge: '🍻 CONQUISTA SECRETA',
    h1a: 'Sextou e não estourou',
    h1b: 'o |limite|?',
    sub: 'Isso também desbloqueia uma conquista escondida no Finn.',
    cta: 'Descobre a sua',
  },
  {
    slug: 'coruja-financeira',
    badge: '🦉 CONQUISTA SECRETA',
    h1a: 'Lançou um gasto de',
    h1b: '|madrugada|?',
    sub: 'Tem uma conquista escondida só pra essa hora no Finn.',
    cta: 'Descobre a sua',
  },
  {
    slug: 'tesoura-conquista',
    badge: '✂️ CONQUISTA SECRETA',
    h1a: 'Cortou gasto de',
    h1b: '|verdade|?',
    sub: 'Excluir despesa ou reduzir limite também vira conquista.',
    cta: 'Descobre a sua',
  },
  {
    slug: 'financas-sem-vergonha',
    badge: '💬 SEM JULGAMENTO',
    h1a: 'Não entender de',
    h1b: '|dinheiro| não é falha.',
    sub: 'Ninguém te ensinou isso — o Finn explica do zero.',
    cta: 'Aprende grátis',
  },
  {
    slug: 'dashboard-mensal',
    badge: '📊 VISÃO GERAL',
    h1a: 'Receita, despesa e',
    h1b: '|saldo|, num olhar.',
    sub: 'O resumo do mês inteiro, sem abrir planilha nenhuma.',
    cta: 'Testa grátis',
  },
  {
    slug: 'conta-fixa-lembra',
    badge: '🔔 A GENTE LEMBRA',
    h1a: 'Conta fixa vencendo?',
    h1b: '|O Finn lembra|.',
    sub: 'Cadastra uma vez, recebe o aviso antes de vencer.',
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

<div class="beat fadeUp" style="top:680px;animation-delay:.05s">
  <h1 style="font-size:80px">${titulo(d.h1a)}</h1>
</div>
<div class="beat fadeUp" style="top:800px;animation-delay:.25s">
  <h1 style="font-size:80px">${titulo(d.h1b)}</h1>
</div>

<div class="beat fadeUp" style="top:1000px;animation-delay:1.1s">
  <p style="font-size:44px;line-height:1.45;color:${CINZA_ESCURO};font-weight:400">${d.sub}</p>
</div>

<div class="beat pop" style="top:1420px;animation-delay:3.3s;display:flex;justify-content:center;width:888px">
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
  execFileSync('ffmpeg', ['-y', '-ss', '0.15', '-i', webm, '-t', String(DURACAO - 0.15), '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '16', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
  console.log('gerado:', saida);
}

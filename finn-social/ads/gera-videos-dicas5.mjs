// Quinto lote de vídeos curtos (9:16, silenciosos) pra Reels/TikTok — mesmo
// gerador e identidade visual de gera-videos-dicas.mjs/2.mjs/3.mjs. A fila
// do TikTok secou de novo (2 dias sem nada saindo), então este lote foca em
// recursos reais ainda sem vídeo: categoria personalizada, modo escuro,
// Racha sem precisar instalar, gráfico por categoria, meta com prazo,
// lançamento manual sem banco, editar lançamento antigo, Open Finance
// multibanco, teste grátis sem pegadinha, instalar sem loja de app — todos
// já auditados e usados em posts de feed (ver finn-social/gera-fila2.mjs).
//
// Texto revisado pra não usar "sozinho"/"sem fazer nada" (rejeição do
// TikTok Ads por Financial Misrepresentation num anúncio pago — ver
// gera-video-anuncio-tiktok-trafego.mjs — mesmo cuidado vale pro orgânico,
// caso algum destes vídeos vire anúncio no futuro).
//
// Uso:  node finn-social/ads/gera-videos-dicas5.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca, titulo } from './_shared.mjs';

const W = 1080, H = 1920;
const DURACAO = 7.2;

const DICAS = [
  {
    slug: 'categoria-personalizada',
    badge: '🏷️ DO SEU JEITO',
    h1a: 'As categorias prontas',
    h1b: 'não bastam? |Cria a sua|.',
    sub: 'Além das categorias padrão, você cria as suas próprias no Finn.',
    cta: 'Testa grátis',
  },
  {
    slug: 'modo-escuro',
    badge: '🌙 NO SEU RITMO',
    h1a: 'Prefere modo',
    h1b: '|escuro|?',
    sub: 'Troca direto nas configurações — o Finn se ajusta na hora.',
    cta: 'Testa grátis',
  },
  {
    slug: 'racha-sem-instalar',
    badge: '🤝 SEM COMPLICAÇÃO',
    h1a: 'Todo mundo tem que',
    h1b: '|instalar o app|?',
    sub: 'Não — no Racha, cada participante entra só com o nome.',
    cta: 'Testa grátis',
  },
  {
    slug: 'grafico-categoria',
    badge: '🍩 VISUAL',
    h1a: 'Pra onde vai',
    h1b: '|seu dinheiro|?',
    sub: 'Um gráfico simples por categoria mostra de bandeja.',
    cta: 'Testa grátis',
  },
  {
    slug: 'meta-prazo',
    badge: '🎯 NO SEU RITMO',
    h1a: 'No ritmo de hoje,',
    h1b: 'quando você |chega lá|?',
    sub: 'Define valor e prazo da meta, o Finn calcula a data.',
    cta: 'Testa grátis',
  },
  {
    slug: 'lancamento-manual',
    badge: '✋ DO JEITO QUE PREFERIR',
    h1a: 'Não quer conectar',
    h1b: 'o |banco|?',
    sub: 'Dá pra usar o Finn 100% manual, lançando cada gasto.',
    cta: 'Testa grátis',
  },
  {
    slug: 'edita-lancamento',
    badge: '✏️ NUNCA É TARDE',
    h1a: 'Achou um erro do',
    h1b: '|mês passado|?',
    sub: 'Edita valor, data ou categoria a qualquer momento.',
    cta: 'Testa grátis',
  },
  {
    slug: 'pluggy-multibanco',
    badge: '🏦 TUDO JUNTO',
    h1a: 'Mais de um',
    h1b: '|banco|?',
    sub: 'O Finn conecta todos via Open Finance, num só lugar.',
    cta: 'Testa grátis',
  },
  {
    slug: 'teste-gratis-sem-pegadinha',
    badge: '🆓 SEM PEGADINHA',
    h1a: 'Tem alguma',
    h1b: '|pegadinha| no teste grátis?',
    sub: 'Não. Sem cartão de crédito, sem cobrança escondida depois.',
    cta: 'Testa grátis',
  },
  {
    slug: 'instala-sem-loja',
    badge: '📲 SEM LOJA DE APP',
    h1a: 'Precisa baixar',
    h1b: 'na |loja de app|?',
    sub: 'Não — o Finn abre no navegador e instala na tela inicial.',
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
  // '-ss 0.15' pula o frame em branco inicial do Playwright (ver
  // gera-videos-dicas.mjs). '-crf 16 -preset slow -tune animation': ver
  // comentário completo em gera-video-anuncio-tiktok-15s.mjs.
  // '-vf scale=2160:3840:flags=lanczos': exporta em 4K vertical, mesmo
  // tratamento dos anúncios pagos (ver gera-video-anuncio-tiktok-15s.mjs) —
  // gravar direto em 4K quebra a gravação do Playwright (bug real,
  // documentado naquele arquivo), então a gravação continua em 1080x1920 e
  // sobe de resolução só na exportação.
  execFileSync('ffmpeg', ['-y', '-ss', '0.15', '-i', webm, '-t', String(DURACAO - 0.15), '-vf', 'scale=2160:3840:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '16', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });
  console.log('gerado:', saida);
}

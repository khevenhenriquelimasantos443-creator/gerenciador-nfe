// Vídeo de anúncio "chegamos no TikTok" — mesma identidade visual dos
// outros anúncios (finn-social/ads/_shared.mjs), agora animado e com
// narração. A narração (voz aprovada, ver _voz_padrao.md) é gerada à parte
// — este script só produz a parte VISUAL, silenciosa; a junção com o áudio
// acontece depois (ver README no fim deste arquivo), porque este sandbox
// não tem acesso de rede pra baixar o .mp3 gerado pela HIggsfield.
//
// Uso:  node finn-social/ads/gera-video-chegada-tiktok.mjs [duracaoSegundos]
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca } from './_shared.mjs';

const W = 1080, H = 1920;
// Duração EXATA do áudio narrado aprovado (job d19ef31f..., ElevenLabs, voz
// Helena): 6.4s. Passar um argumento na linha de comando pra recalcular se
// o áudio mudar.
const DURACAO = Number(process.argv[2]) || 6.4;

const html = `<!doctype html><meta charset="utf-8"><style>
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

<div class="beat fadeUp" style="top:520px;animation-delay:.2s">
  <div style="display:inline-flex;align-items:center;gap:9px;height:60px;padding:0 30px;
    border:2px solid ${LARANJA};border-radius:30px;font-size:24px;font-weight:700;
    letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08)">🎉 CHEGAMOS</div>
</div>

<div class="beat fadeUp" style="top:640px;animation-delay:.9s">
  <h1 style="font-size:88px">O Finn chegou ao</h1>
</div>
<div class="beat pop" style="top:800px;animation-delay:1.7s">
  <h1 style="font-size:126px"><i>TikTok!</i></h1>
</div>

<div class="beat fadeUp" style="top:1080px;animation-delay:3.0s">
  <p style="font-size:42px;line-height:1.4;color:${CINZA_ESCURO};font-weight:400">
    Dicas práticas para organizar suas finanças, direto por aqui.</p>
</div>

<div class="beat pop" style="top:1500px;animation-delay:4.6s;display:flex;justify-content:center;width:888px">
  <div style="height:104px;display:inline-flex;align-items:center;padding:0 48px;border-radius:18px;
    background:${LARANJA};font-size:36px;font-weight:700;color:#fff;
    box-shadow:0 14px 30px rgba(249,115,22,.35)">Siga o nosso perfil</div>
</div>
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
await p.waitForTimeout(DURACAO * 1000);
const video = p.video();
await p.close();
const webm = await video.path();
await ctx.close();
await b.close();

const saida = path.join(DIR, 'video-chegada-tiktok-silencioso.mp4');

// Converte pra mp4 (H.264) e corta pro tempo exato do áudio — o Playwright
// às vezes grava alguns frames a mais no fim.
execFileSync('ffmpeg', ['-y', '-i', webm, '-t', String(DURACAO), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-an', saida], { stdio: 'inherit' });

console.log('gerado (silencioso):', saida);
console.log('duração alvo:', DURACAO + 's');

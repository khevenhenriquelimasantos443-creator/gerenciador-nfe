// Stories do Instagram (1080x1920, imagem estática) — a fila (kind='story')
// zerou em 26/08/2026 e ninguém percebeu por quase um mês, porque o Reels
// saía pelo mesmo gatilho de cron e mascarava o problema (_publishNextInstagramStory
// cai pra fora sem erro quando não tem nada, "os stories embutidos já foram
// publicados"). Reaproveita ganchos já validados nos vídeos curtos — é uma
// tela diferente (Stories some em 24h), então repetir a mensagem não é
// redundante, é só mais um ponto de contato.
//
// Diferente dos vídeos, aqui não precisa de Playwright recordVideo nem
// ffmpeg — é só um screenshot com tudo já "assentado" (sem animação).
//
// Uso:  node finn-social/ads/gera-stories.mjs
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { NAVY, LARANJA, CINZA_ESCURO, FONTE, marca, titulo } from './_shared.mjs';

const W = 1080, H = 1920;

const STORIES = [
  { slug: 'sabe-pra-onde-vai', badge: '✦ APP BRASILEIRO, GRÁTIS PRA TESTAR', h1a: 'Você sabe pra onde vai', h1b: '|o seu dinheiro|?', sub: 'O Finn categoriza os gastos automaticamente, a partir do extrato do banco.', cta: 'Testa grátis' },
  { slug: 'conquista-escondida', badge: '🤫 CONQUISTA SECRETA', h1a: 'Tem uma conquista', h1b: '|escondida| no Finn.', sub: 'Ela só aparece depois que você desbloqueia sem querer.', cta: 'Descobre a sua' },
  { slug: 'fatura-agora', badge: '💳 SEM SUSTO', h1a: 'Sabe quanto vai fechar', h1b: 'sua |fatura| agora?', sub: 'O Finn calcula automaticamente, a partir do dia de fechamento do seu cartão.', cta: 'Testa grátis' },
  { slug: 'whatsapp-so-isso', badge: '🪄 SEM ABRIR O APP', h1a: 'Manda o gasto no', h1b: '|WhatsApp|. Só isso.', sub: 'O Finn recebe a mensagem e categoriza o gasto na hora.', cta: 'Testa grátis' },
  { slug: 'dias-seguidos', badge: '🔥 SEQUÊNCIA', h1a: 'Quantos dias seguidos', h1b: 'você |aguenta|?', sub: '7 dias seguidos lançando gasto já desbloqueia uma conquista no Finn.', cta: 'Testa grátis' },
  { slug: 'investidor-blindado', badge: '🏆 CONQUISTAS', h1a: 'De Aprendiz a', h1b: '|Investidor Blindado|.', sub: 'Seu título evolui automaticamente conforme você organiza as finanças no Finn.', cta: 'Testa grátis' },
  { slug: 'sobrado-grana', badge: '😬 CHOQUE DE REALIDADE', h1a: 'Jurava que tinha', h1b: '|sobrado grana|?', sub: 'O Finn avisa quando o limite de uma categoria estoura — antes de piorar.', cta: 'Testa grátis' },
  { slug: 'perfil-gastador', badge: '🎭 SEM JULGAMENTO', h1a: 'Qual desses 4', h1b: 'perfis é |você|?', sub: 'Descobre no gráfico por categoria do Finn.', cta: 'Testa grátis' },
  { slug: 'racha-instalar', badge: '🤝 SEM COMPLICAÇÃO', h1a: 'Todo mundo tem que', h1b: '|instalar o app|?', sub: 'Não — no Racha, cada participante entra só com o nome.', cta: 'Testa grátis' },
  { slug: 'pegadinha-teste-gratis', badge: '🆓 SEM PEGADINHA', h1a: 'Tem alguma', h1b: '|pegadinha| no teste grátis?', sub: 'Não. Sem cartão de crédito, sem cobrança escondida depois.', cta: 'Testa grátis' },
  { slug: 'senha-nova', badge: '🔑 ENTRADA RÁPIDA', h1a: 'Precisa criar', h1b: '|senha nova|?', sub: 'Não — entra com o Google, um toque, e pronto.', cta: 'Testa grátis' },
  { slug: 'alguem-ve-dados', badge: '🔒 SÓ SEUS DADOS', h1a: 'Alguém mais pode', h1b: 'ver |seus dados|?', sub: 'No Finn, cada conta só enxerga os próprios dados.', cta: 'Testa grátis' },
  { slug: 'dados-fora-finn', badge: '📤 SEUS DADOS, SUA CÓPIA', h1a: 'E se você quiser', h1b: 'seus dados |fora do Finn|?', sub: 'Exporta tudo em CSV, quando quiser.', cta: 'Testa grátis' },
  { slug: 'resumo-mes', badge: '📊 VISÃO GERAL', h1a: 'Onde fica o resumo', h1b: 'do seu |mês|?', sub: 'Receita, despesa e saldo, tudo num lugar só no Finn.', cta: 'Testa grátis' },
  { slug: 'nao-entende-dinheiro', badge: '💬 SEM JULGAMENTO', h1a: 'Não entende nada', h1b: 'de |dinheiro|?', sub: 'Não é falha sua — ninguém te ensinou. O Finn explica do zero.', cta: 'Aprende grátis' },
];

function html(d) {
  return `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${NAVY};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  .glow{position:absolute;left:50%;margin-left:-540px;top:-320px;width:1080px;height:1080px;border-radius:50%;
    background:radial-gradient(circle,rgba(249,115,22,.34) 0%,rgba(249,115,22,0) 68%)}
  .dots{position:absolute;left:0;top:0;width:100%;height:100%;opacity:.5;
    background-image:radial-gradient(rgba(255,255,255,.06) 1.6px, transparent 1.6px);
    background-size:28px 28px}
  h1{font-weight:800;letter-spacing:-.02em;color:#fff;line-height:1.06}
  h1 i{font-style:normal;color:${LARANJA}}
</style>
<div class="glow"></div>
<div class="dots"></div>

${marca({ x: 96, y: 96, tam: 84, fonte: 40 })}

<div style="position:absolute;left:96px;top:560px;height:60px;display:inline-flex;align-items:center;gap:9px;
  padding:0 30px;border:2px solid ${LARANJA};border-radius:30px;font-size:24px;font-weight:700;
  letter-spacing:.06em;color:${LARANJA};background:rgba(249,115,22,.08);width:auto">${d.badge}</div>

<div style="position:absolute;left:96px;top:680px;width:888px">
  <h1 style="font-size:80px">${titulo(d.h1a)}</h1>
</div>
<div style="position:absolute;left:96px;top:800px;width:888px">
  <h1 style="font-size:80px">${titulo(d.h1b)}</h1>
</div>

<div style="position:absolute;left:96px;top:1000px;width:888px">
  <p style="font-size:44px;line-height:1.45;color:${CINZA_ESCURO};font-weight:400">${d.sub}</p>
</div>

<div style="position:absolute;left:96px;top:1420px;display:flex;justify-content:center;width:888px">
  <div style="height:104px;display:inline-flex;align-items:center;padding:0 48px;border-radius:18px;
    background:${LARANJA};font-size:36px;font-weight:700;color:#fff;
    box-shadow:0 14px 30px rgba(249,115,22,.35)">${d.cta}</div>
</div>

<div style="position:absolute;left:0;top:1700px;width:100%;text-align:center;font-size:28px;font-weight:700;color:${CINZA_ESCURO}">
  Arrasta pra cima 👆
</div>
`;
}

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SAIDA_DIR = path.join(DIR, '..', 'fila');

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const s of STORIES) {
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await p.setContent(html(s), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const saida = path.join(SAIDA_DIR, `story-${s.slug}.png`);
  await p.screenshot({ path: saida });
  await p.close();
  console.log('gerado:', saida);
}
await b.close();

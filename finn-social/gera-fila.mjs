// Gera a arte de posts que vão DIRETO pra fila do Supabase (social_posts),
// não pra campanha embutida no Worker — por isso não escreve em
// finn-serve/social/ (o build.js varre esse diretório em sequência a partir
// de ig_post_1.png e embute tudo o que achar; o worker do bot já está perto
// do teto de 3 MiB só com os stories da campanha original, ver commit
// "novo post embutido #29"). A saída fica em finn-social/fila/, e de lá é
// subida pro bucket 'social' do Supabase Storage e inserida na fila.
//
// Reaproveita a MESMA identidade visual e os MESMOS 5 layouts de
// finn-social/gera-cards.mjs (não importa de lá porque aquele arquivo é um
// script de topo, não um módulo — duplicar os helpers aqui evita mexer no
// gerador da campanha oficial).
//
// Uso:  node finn-social/gera-fila.mjs
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { NAVY, LARANJA, CINZA_CLARO, CINZA_ESCURO, FONTE, esc, titulo, colisoes } from './ads/_shared.mjs';

const CREME = '#F8F7F4';
const NAVY_CLARO = '#1E293B';
const BORDA = '#E2E8F0';
const CHIP_TXT = '#1E293B';
const RODAPE = 'finn.dev.br';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SAIDA_DIR = path.join(DIR, 'fila');
fs.mkdirSync(SAIDA_DIR, { recursive: true });

/* ── marca, com variante clara/escura (igual gera-cards.mjs) ────────────── */
function marca({ claro, x = 96, y = 64, tam = 56, fonte = 25, centro = false, pontoLaranja = true }) {
  const pos = centro ? `left:0;top:${y}px;width:100%;justify-content:center` : `left:${x}px;top:${y}px`;
  const quad = claro ? `background:${NAVY};color:${LARANJA}` : `background:${LARANJA};color:#fff`;
  const nome = claro ? NAVY : '#fff';
  return `<div class="marca" style="position:absolute;display:flex;align-items:center;gap:15px;${pos}">
    <div style="width:${tam}px;height:${tam}px;${quad};font-size:${Math.round(tam * 0.54)}px;border-radius:${Math.round(tam / 4)}px;display:flex;align-items:center;justify-content:center;font-weight:700">F</div>
    <div style="font-size:${fonte}px;font-weight:700;color:${nome}">Finn<i${pontoLaranja ? '' : ' style="color:inherit"'} style="font-style:normal;color:${pontoLaranja ? LARANJA : 'inherit'}">.</i></div>
  </div>`;
}

const brilho = (lado = 'direita') => `<div style="position:absolute;${lado === 'direita' ? 'right:-180px;top:-220px' : 'left:50%;margin-left:-450px;top:-260px'};
  width:900px;height:900px;border-radius:50%;
  background:radial-gradient(circle,rgba(249,115,22,.30) 0%,rgba(249,115,22,0) 68%)"></div>`;

const base = (w, h, bg, corpo) => `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${w}px;height:${h}px;background:${bg};font-family:${FONTE};
       -webkit-font-smoothing:antialiased;position:relative;overflow:hidden}
  h1{font-weight:700;letter-spacing:-.02em}
  h1 i{font-style:normal;color:${LARANJA}}
  .rodape{position:absolute;font-weight:700}
</style>${corpo}`;

const pillClara = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:54px;display:inline-flex;
  align-items:center;gap:9px;padding:0 28px;border:1px solid ${BORDA};border-radius:27px;background:#fff;
  font-size:20px;font-weight:700;letter-spacing:.06em;color:#334155">${esc(txt)}</div>` : '';

const pillContorno = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:54px;display:inline-flex;
  align-items:center;gap:9px;padding:0 26px;border:2px solid ${LARANJA};border-radius:27px;
  font-size:20px;font-weight:700;letter-spacing:.06em;color:${LARANJA}">${esc(txt)}</div>` : '';

const pillLaranja = (txt) => txt ? `<div style="position:absolute;left:96px;top:220px;height:52px;display:inline-flex;
  align-items:center;gap:9px;padding:0 24px;border-radius:26px;background:rgba(15,23,42,.15);
  font-size:20px;font-weight:700;letter-spacing:.06em;color:#fff">${esc(txt)}</div>` : '';

const h1Post = (h, cor) => `<h1 style="position:absolute;left:96px;top:320px;width:900px;
  font-size:92px;line-height:1.055;color:${cor}">${titulo(h)}</h1>`;

const corpoPost = (txt, top, cor, extra = '') => `<p style="position:absolute;left:96px;top:${top}px;width:830px;
  font-size:32px;line-height:1.5;color:${cor};${extra}">${esc(txt)}</p>`;

const RODAPE_POST_TOP = 1250;
const rodapePost = (txt, cor, top = RODAPE_POST_TOP) => `<div class="rodape" style="left:96px;top:${top}px;font-size:22px;color:${cor}">${esc(txt)}</div>`;

function chips(itens, { escuro = false, top = 800, centro = false } = {}) {
  const estilo = escuro
    ? `background:#1D2436;border:1px solid rgba(255,255,255,.10);color:#fff`
    : `background:#fff;border:1px solid ${BORDA};color:${CHIP_TXT}`;
  const um = (it) => {
    const [e, rot] = Array.isArray(it) ? it : [null, it];
    return `<div style="height:76px;display:inline-flex;align-items:center;gap:12px;padding:0 26px;
      border-radius:14px;font-size:28px;font-weight:700;${estilo}">${e ? esc(e) + ' ' : ''}${esc(rot)}</div>`;
  };
  return `<div style="position:absolute;left:96px;top:${top}px;width:900px;display:flex;flex-wrap:wrap;gap:17px;
    ${centro ? 'left:0;width:100%;padding:0 96px;justify-content:center' : ''}">${itens.map(um).join('')}</div>`;
}

const tiles = (itens, { escuro = true, top = 825 } = {}) => `<div style="position:absolute;left:96px;top:${top}px;width:888px;
  display:grid;grid-template-columns:repeat(3,1fr);gap:21px">${itens.map(([e, rot]) => `
  <div style="height:133px;border-radius:14px;background:${escuro ? '#2B3546' : '#fff'};
       border:1px solid ${escuro ? '#444D5C' : BORDA};display:flex;flex-direction:column;
       align-items:center;justify-content:center;gap:10px">
    <div style="font-size:44px;line-height:1">${esc(e)}</div>
    <div style="font-size:22px;font-weight:700;color:${escuro ? '#fff' : CHIP_TXT}">${esc(rot)}</div>
  </div>`).join('')}</div>`;

const bullets = (itens, top = 812) => `<div style="position:absolute;left:96px;top:${top}px;width:900px">${itens.map((t) => `
  <div style="display:flex;align-items:center;gap:20px;height:52px;font-size:30px;font-weight:700;color:${NAVY}">
    <span style="font-size:20px;line-height:1">●</span><span>${esc(t)}</span></div>`).join('')}</div>`;

const POST_W = 1080, POST_H = 1350;

function post(p) {
  const L = p.layout;
  if (L === 'cream') {
    return base(POST_W, POST_H, CREME,
      marca({ claro: true }) + pillClara(p.pill) + h1Post(p.h, NAVY) +
      corpoPost(p.body, 790, CINZA_CLARO) + chips(p.itens, { top: 1000 }) + rodapePost(p.rodape, '#94A3B8'));
  }
  if (L === 'centro') {
    return base(POST_W, POST_H, CREME,
      marca({ claro: true, centro: true }) +
      `<h1 style="position:absolute;left:0;top:296px;width:100%;padding:0 96px;text-align:center;
        font-size:92px;line-height:1.055;color:${NAVY}">${titulo(p.h)}</h1>` +
      `<p style="position:absolute;left:0;top:600px;width:100%;padding:0 140px;text-align:center;
        font-size:30px;font-weight:700;line-height:1.32;color:#334155">${esc(p.body)}</p>` +
      chips(p.itens, { top: 850, centro: true }) +
      `<div class="rodape" style="left:0;top:${RODAPE_POST_TOP}px;width:100%;text-align:center;font-size:22px;color:#94A3B8">${esc(p.rodape)}</div>`);
  }
  if (L === 'laranja') {
    return base(POST_W, POST_H, LARANJA,
      `<div style="position:absolute;left:-120px;top:-140px;width:560px;height:560px;border-radius:50%;
        background:rgba(255,255,255,.045)"></div>` +
      marca({ claro: true, pontoLaranja: false }) + pillLaranja(p.pill) + h1Post(p.h, NAVY) +
      corpoPost(p.body, 806, 'rgba(15,23,42,.75)', 'font-weight:700;font-size:34px;line-height:1.5') +
      bullets(p.itens, 942) + rodapePost(p.rodape, 'rgba(15,23,42,.58)'));
  }
  if (L === 'tiles') {
    const comBrilho = !!p.glow;
    return base(POST_W, POST_H, comBrilho ? NAVY : NAVY_CLARO,
      (comBrilho ? brilho() : '') + marca({ claro: false }) +
      (comBrilho ? pillContorno(p.pill) : pillClara(p.pill)) +
      h1Post(p.h, '#fff') + corpoPost(p.body, 820, CINZA_ESCURO) +
      tiles(p.itens, { top: 1025 }) + rodapePost(p.rodape, CINZA_ESCURO));
  }
  // hero
  return base(POST_W, POST_H, NAVY,
    brilho() + marca({ claro: false }) + pillContorno(p.pill) + h1Post(p.h, '#fff') +
    corpoPost(p.body, 790, CINZA_ESCURO) +
    chips(p.itens, { escuro: true, top: 1020 }) +
    rodapePost(p.rodape, CINZA_CLARO));
}

/* ── slide de carrossel: mesma marca visual, layout mais simples pro swipe ── */
function slide(s, { index, total }) {
  const badge = `<div style="position:absolute;right:96px;top:96px;height:48px;display:inline-flex;align-items:center;
    padding:0 22px;border-radius:24px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);
    font-size:20px;font-weight:700;color:${CINZA_ESCURO}">${index}/${total}</div>`;
  return base(POST_W, POST_H, NAVY,
    brilho() + marca({ claro: false }) + badge +
    (s.emoji ? `<div style="position:absolute;left:96px;top:420px;font-size:96px;line-height:1">${esc(s.emoji)}</div>` : '') +
    `<h1 style="position:absolute;left:96px;top:${s.emoji ? 560 : 420}px;width:880px;font-size:76px;line-height:1.1;color:#fff">${titulo(s.h)}</h1>` +
    `<p style="position:absolute;left:96px;top:${s.emoji ? 800 : 660}px;width:840px;font-size:34px;line-height:1.55;color:${CINZA_ESCURO}">${esc(s.body)}</p>` +
    (s.cta
      ? `<div style="position:absolute;left:96px;top:1180px;height:92px;display:inline-flex;align-items:center;
          padding:0 40px;border-radius:14px;background:${LARANJA};font-size:30px;font-weight:700;color:#fff">${esc(s.cta)}</div>`
      : `<div class="rodape" style="left:96px;top:1256px;font-size:22px;color:${CINZA_CLARO}">${esc(RODAPE)}</div>`));
}

/* ═══════════════════════ 20 POSTS DE FEED ═══════════════════════ */
const FEED = [
  { slug: 'lista-do-seu-jeito', layout: 'hero', pill: '🔍 SUA LISTA, SEU CONTROLE',
    h: 'Sua lista de lançamentos, |do seu jeito|.',
    body: 'Filtra por mês, por categoria ou busca pelo nome — e edita ou apaga um lançamento quando precisar.',
    itens: [['🔎', 'Busca por texto'], ['📅', 'Filtro por mês'], ['🏷️', 'Filtro por categoria']],
    rodape: RODAPE, emoji: '🔎',
    legenda: 'Filtra por mês, por categoria ou busca pelo nome — e edita ou apaga um lançamento quando precisar, direto na lista.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'guarda-comprovante', layout: 'cream', pill: '🧾 TUDO NUM SÓ LUGAR',
    h: 'Guarda o comprovante |junto do lançamento|.',
    body: 'Anexa a foto do cupom ou da nota direto no lançamento — fica salvo junto, pra consultar quando precisar.',
    itens: ['Nota fiscal', 'Cupom fiscal', 'Recibo'],
    rodape: RODAPE, emoji: '🧾',
    legenda: 'Anexa a foto do cupom, da nota ou do recibo direto no lançamento — fica guardado junto, sem precisar procurar depois.',
    tags: '#organizacaofinanceira #financaspessoais #appfinanceiro' },

  { slug: 'exporta-csv', layout: 'laranja', pill: '📤 SEUS DADOS, SUA CÓPIA',
    h: 'Seus lançamentos, em uma planilha CSV.',
    body: 'Exporta os lançamentos filtrados ou o histórico inteiro, quando quiser conferir fora do Finn.',
    itens: ['Exporta o filtro atual', 'Ou exporta tudo de uma vez', 'Formato CSV, abre em qualquer planilha'],
    rodape: RODAPE, emoji: '📤',
    legenda: 'Exporta os lançamentos filtrados ou o histórico inteiro em CSV — seus dados sempre disponíveis pra você, fora do Finn também.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'foge-do-padrao', layout: 'tiles', glow: true, pill: '🔍 OLHO NO PADRÃO',
    h: 'O Finn percebe quando |um gasto foge do padrão|.',
    body: 'Se um gasto ficou bem mais caro que o de sempre, o Finn avisa antes de você nem notar.',
    itens: [['📈', 'Compara com a média'], ['⚠️', 'Avisa na hora'], ['👀', 'Você decide']],
    rodape: RODAPE, emoji: '⚠️',
    legenda: 'Se um gasto ficou bem mais caro que o de sempre (mesma descrição, valor bem acima da média), o Finn avisa na hora — antes de você nem notar.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro' },

  { slug: 'virou-conta-fixa', layout: 'centro', pill: null,
    h: 'Isso parece uma |conta fixa|?',
    body: 'O Finn percebe quando um gasto virou rotina e sugere transformar em conta fixa, com aviso de vencimento.',
    itens: [['🔁', 'Detecta sozinho'], ['🔔', 'Sugere o aviso'], ['✅', 'Você confirma']],
    rodape: RODAPE, emoji: '🔁',
    legenda: 'O Finn percebe quando um gasto se repete todo mês e sugere transformar em conta fixa, já com aviso antes de vencer.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'categoriza-todos', layout: 'hero', pill: '🏷️ MENOS TRABALHO',
    h: 'Categoriza um, |categoriza todos|.',
    body: 'Corrigiu a categoria de um gasto? O Finn oferece aplicar a mesma categoria nos outros parecidos.',
    itens: [['🏷️', 'Categoriza um'], ['⚡', 'Aplica nos parecidos'], ['✋', 'Só se você quiser']],
    rodape: RODAPE, emoji: '🏷️',
    legenda: 'Corrigiu a categoria de um gasto? O Finn oferece aplicar a mesma categoria em outros lançamentos com a mesma descrição — só se você quiser.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'dois-toques', layout: 'cream', pill: '⚡ RÁPIDO ASSIM',
    h: 'Lança um gasto |em 2 toques|.',
    body: 'Segura o ícone do Finn na tela inicial e cai direto na tela de lançar — sem precisar abrir o app primeiro.',
    itens: [['📲', 'Direto da tela inicial'], ['⚡', 'Sem abrir o app'], ['✍️', 'Lança na hora']],
    rodape: RODAPE, emoji: '📲',
    legenda: 'Segura o ícone do Finn instalado na tela inicial e cai direto na tela de lançar — quase tão rápido quanto mandar mensagem.',
    tags: '#appfinanceiro #financaspessoais #tecnologia' },

  { slug: 'apaga-tudo', layout: 'laranja', pill: '🗑️ VOCÊ NO CONTROLE',
    h: 'Você pode apagar tudo, quando quiser.',
    body: 'Seus dados são seus. Exclui só os lançamentos ou apaga tudo — direto no app, sem precisar pedir.',
    itens: ['Direto em Configurações', 'Sem aprovação nem justificativa', 'Ou por e-mail, se preferir'],
    rodape: RODAPE, emoji: '🗑️',
    legenda: 'Seus dados são seus: exclui direto em Configurações, sem precisar de aprovação nem justificativa. Prefere por e-mail? Também dá.',
    tags: '#privacidade #seguranca #financaspessoais' },

  { slug: 'entra-google', layout: 'tiles', glow: false, pill: '🔑 ENTRADA RÁPIDA',
    h: 'Entra com o Google. |Sem senha nova|.',
    body: 'Uma conta, um toque — sem precisar decorar mais uma senha só pro Finn.',
    itens: [['🔑', 'Login com Google'], ['🚫', 'Sem senha nova'], ['⚡', 'Entra na hora']],
    rodape: RODAPE, emoji: '🔑',
    legenda: 'Entra com a sua conta Google — um toque, sem precisar criar nem decorar mais uma senha só pro Finn.',
    tags: '#appfinanceiro #financaspessoais #tecnologia' },

  { slug: 'investimento-a-parte', layout: 'centro', pill: null,
    h: 'Investimento não |bagunça seu resumo|.',
    body: 'O Finn já separa o que é investimento do resto — sem contar isso como gasto nem como receita no seu mês.',
    itens: [['📈', 'Investimento à parte'], ['💰', 'Resumo mais limpo'], ['🔄', 'Corrige o que ficou torto']],
    rodape: RODAPE, emoji: '📈',
    legenda: 'O Finn separa o que é investimento do resto — sem contar como gasto nem como receita no resumo do seu mês. E dá pra corrigir lançamentos antigos que ficaram na categoria errada.',
    tags: '#financaspessoais #appfinanceiro #investimentos' },

  { slug: 'explicacao-nao-indicacao', layout: 'hero', pill: '📚 TRANSPARÊNCIA',
    h: 'Isso não é indicação de investimento. |É explicação.|',
    body: 'A trilha de Investimentos explica como cada coisa funciona, pra você decidir sozinho — nunca qual produto escolher.',
    itens: [['📚', 'Só explicação'], ['🚫', 'Nunca indicação'], ['🧠', 'Você decide']],
    rodape: RODAPE, emoji: '📚',
    legenda: 'A trilha de Investimentos, na aba Aprender, explica como cada coisa funciona — nunca qual produto escolher ou se o mercado vai subir. Educação financeira de verdade, não recomendação disfarçada.',
    tags: '#educacaofinanceira #investimentos #financaspessoais' },

  { slug: 'open-finance', layout: 'cream', pill: '🔎 CURIOSIDADE',
    h: 'Como funciona o Open Finance, |sem enrolação|.',
    body: 'Você autoriza, e quem cuida da conexão com o seu banco é a Pluggy, provedora de Open Finance — a sua senha nunca passa pelo Finn.',
    itens: [['🔐', 'Pluggy conecta'], ['🙈', 'Finn nunca vê a senha'], ['✅', 'Você autoriza']],
    rodape: RODAPE, emoji: '🔐',
    legenda: 'Você autoriza a conexão, e quem cuida dela é a Pluggy, provedora de Open Finance regulada pelo Banco Central — a sua senha do banco nunca passa pelo Finn.',
    tags: '#privacidade #seguranca #openfinance #financaspessoais' },

  { slug: 'mito-reserva', layout: 'laranja', pill: '❌ MITO',
    h: 'Mito: só quem ganha muito consegue ter reserva.',
    body: 'Reserva de emergência não é sobre quanto você ganha — é sobre guardar um pouco, sempre.',
    itens: ['Quanto guardar', 'Onde deixar', 'Quando usar'],
    rodape: RODAPE, emoji: '🛟',
    legenda: 'Mito: reserva de emergência é coisa de quem ganha muito. Verdade: é sobre guardar um pouco, sempre — tem uma trilha inteira sobre isso, de graça, na aba Aprender.',
    tags: '#reservadeemergencia #educacaofinanceira #financaspessoais' },

  { slug: 'verdade-anotar', layout: 'tiles', glow: true, pill: '✅ VERDADE',
    h: 'Só de anotar os gastos, |muita gente já gasta diferente|.',
    body: 'Ver pra onde o dinheiro vai muda a forma como você decide gastar — nem precisa de nada além disso pra começar.',
    itens: [['👀', 'Ver muda a decisão'], ['📊', 'Gráfico simples'], ['🎯', 'Primeiro passo']],
    rodape: RODAPE, emoji: '👀',
    legenda: 'Verdade: só de ver pra onde o dinheiro vai, muita gente já gasta diferente. É o primeiro passo — e é basicamente o que o Finn faz por você, sozinho.',
    tags: '#educacaofinanceira #financaspessoais #controlefinanceiro' },

  { slug: 'receita-com-aviso', layout: 'centro', pill: null,
    h: 'Receita chegando |também tem aviso|.',
    body: 'Cadastrou um salário ou outra entrada fixa? O Finn avisa quando ela está a caminho, do mesmo jeito que avisa uma conta pra pagar.',
    itens: [['💰', 'Receita fixa'], ['🔔', 'Aviso também'], ['📅', 'Antes de cair na conta']],
    rodape: RODAPE, emoji: '💰',
    legenda: 'Cadastrou um salário ou outra entrada fixa? O Finn avisa quando ela está a caminho, do mesmo jeito que avisa uma conta fixa pra pagar.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'extrato-suspeito', layout: 'hero', pill: '🧐 CONFERÊNCIA EXTRA',
    h: 'O extrato mentindo pra você? |A gente percebe.|',
    body: 'Se a importação do extrato vier com algo estranho — tudo marcado como receita, por exemplo — o Finn avisa antes de salvar.',
    itens: [['🧐', 'Confere antes de salvar'], ['⚠️', 'Avisa se tiver estranho'], ['✅', 'Você confirma']],
    rodape: RODAPE, emoji: '🧐',
    legenda: 'Se a importação do extrato vier com algo estranho — tudo marcado como receita, por exemplo — o Finn avisa antes de salvar, pra você conferir.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro' },

  { slug: 'um-olhar', layout: 'cream', pill: '👁️ RÁPIDO ASSIM',
    h: 'Um olhar. Só isso, |pra saber como o mês está indo|.',
    body: 'Abre o Finn, vê o saldo e os gráficos do mês, fecha. Não precisa de mais que isso.',
    itens: [['👁️', 'Uma olhada'], ['📊', 'Saldo e gráficos'], ['⏱️', 'Sem enrolação']],
    rodape: RODAPE, emoji: '👁️',
    legenda: 'Abre o Finn, vê o saldo e os gráficos do mês, fecha. Não precisa de mais que isso pra saber como está indo.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro' },

  { slug: 'dois-niveis-exclusao', layout: 'laranja', pill: '🗑️ DOIS NÍVEIS',
    h: 'Duas formas de apagar seus dados.',
    body: 'Excluir os lançamentos mantém metas e limites. Apagar tudo leva o resto junto.',
    itens: ['Excluir lançamentos: mantém o resto', 'Apagar tudo: some com tudo', 'A decisão é sempre sua'],
    rodape: RODAPE, emoji: '🗑️',
    legenda: 'Excluir os lançamentos mantém metas, limites e contas fixas. Apagar todos os dados leva o resto junto também. As duas opções ficam em Configurações — você escolhe.',
    tags: '#privacidade #seguranca #financaspessoais' },

  { slug: 'finn-lembra', layout: 'tiles', glow: true, pill: '🔔 A GENTE LEMBRA',
    h: 'Você não precisa lembrar de nada. |O Finn lembra por você.|',
    body: 'Conta fixa vencendo, gasto que virou rotina, resumo da semana — os avisos chegam sozinhos.',
    itens: [['🔔', 'Conta a vencer'], ['🔁', 'Gasto que virou rotina'], ['📬', 'Resumo da semana']],
    rodape: RODAPE, emoji: '🔔',
    legenda: 'Conta fixa vencendo, gasto que virou rotina, resumo da semana — os avisos chegam sozinhos. Você só decide o que fazer com eles.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'mito-planilha', layout: 'centro', pill: null,
    h: 'Mito: organizar as finanças |exige planilha complicada|.',
    body: 'Não exige. Importa o extrato, o Finn organiza sozinho — e se você AINDA quiser planilha, a gente fez uma que presta.',
    itens: [['❌', 'MITO'], ['📲', 'App organiza sozinho'], ['📗', 'Planilha é opcional']],
    rodape: RODAPE, emoji: '❌',
    legenda: 'Mito: organizar as finanças exige planilha complicada. Verdade: importa o extrato e o Finn organiza sozinho — e se você AINDA quiser planilha, a gente fez uma que presta (R$ 36,90, compra única).',
    tags: '#financaspessoais #appfinanceiro #planilhafinanceira' },
];

/* ═══════════════════════ 5 CARROSSÉIS ═══════════════════════ */
const CAROUSELS = [
  { slug: 'como-funciona-5-passos',
    caption: 'Como o Finn organiza seu dinheiro, em 5 passos 🧭\n\nDo extrato importado até o resumo semanal — sem você precisar ficar calculando nada na mão.\n\n#financaspessoais #appfinanceiro #organizacaofinanceira #controlefinanceiro',
    slides: [
      { h: 'Como o Finn organiza |seu dinheiro|.', body: '5 passos, do jeito mais simples possível.', emoji: '🧭' },
      { h: 'Conecta o banco', body: 'Importa o extrato e o Finn organiza sozinho — receitas, despesas e categorias.', emoji: '🏦' },
      { h: 'Categoriza sozinho', body: 'Cada gasto cai na categoria certa, sem você mexer em nada.', emoji: '🤖' },
      { h: 'Mostra pra onde vai', body: 'Gráficos simples do seu mês, sem termo complicado.', emoji: '📊' },
      { h: 'Você define os limites', body: 'Metas, limite por categoria e o plano pra sair de uma dívida.', emoji: '🎯' },
      { h: 'Te avisa toda semana', body: 'Uma notificação com quanto você gastou e como foi comparado à semana anterior.', emoji: '🔔', cta: 'Testa grátis → finn.dev.br' },
    ] },

  { slug: 'aprender-3-areas',
    caption: 'O que você aprende de graça no Finn 📚\n\n3 áreas, 10 trilhas, 40 lições — em qualquer plano, inclusive no grátis. Não é indicação de investimento, é explicação, pra você decidir sozinho.\n\n#educacaofinanceira #investimentos #financaspessoais #appfinanceiro',
    slides: [
      { h: 'O que você aprende |de graça| no Finn.', body: '3 áreas, 10 trilhas, 40 lições — sem pagar nada.', emoji: '📚' },
      { h: 'Finanças pessoais 💰', body: 'O básico que ninguém ensinou · Saindo do vermelho · Hábitos que sustentam · Finanças avançadas.' },
      { h: 'Reservas 🛡️', body: 'Sua primeira reserva · Reservas por objetivo · Reserva sob pressão.' },
      { h: 'Investimentos 📈', body: 'Antes de investir · Como cada coisa funciona · Decidindo melhor. Não é indicação — é explicação.', cta: 'Aprende de graça → finn.dev.br' },
    ] },

  { slug: '5-coisas-sozinho',
    caption: '5 coisas que o Finn faz sozinho, sem você mexer 🤖\n\nCategoriza, percebe padrão, sugere e avisa — no piloto automático.\n\n#financaspessoais #appfinanceiro #automacao #organizacaofinanceira',
    slides: [
      { h: '5 coisas que o Finn |faz sozinho|.', body: 'Sem você precisar mexer em nada.', emoji: '🤖' },
      { h: 'Categoriza o gasto certo', body: 'Importou o extrato? Cada lançamento já cai na categoria certa.', emoji: '🏷️' },
      { h: 'Reconhece o que se repete', body: 'Identifica um gasto que virou rotina e sugere transformar em conta fixa.', emoji: '🔁' },
      { h: 'Percebe o que fugiu do padrão', body: 'Avisa quando um gasto ficou bem acima do que você costuma pagar.', emoji: '🚨' },
      { h: 'Aprende com sua categorização', body: 'Categorizou um? O Finn oferece aplicar a mesma categoria nos parecidos.', emoji: '✅' },
      { h: 'Manda o resumo da semana', body: 'Uma notificação, sem você precisar abrir o app.', emoji: '🔔', cta: 'Testa grátis → finn.dev.br' },
    ] },

  { slug: 'reserva-4-passos',
    caption: 'Reserva de emergência, em 4 passos 🛟\n\nPra imprevisto não virar dívida. Conteúdo grátis, direto na aba Aprender do Finn.\n\n#reservadeemergencia #educacaofinanceira #financaspessoais',
    slides: [
      { h: 'Reserva de emergência, |em 4 passos|.', body: 'Pra imprevisto não virar dívida.', emoji: '🛟' },
      { h: '1. Por que ter', body: 'Pneu furado, dente quebrado, celular no chão — sem reserva, tudo isso vira cartão de crédito.' },
      { h: '2. Quanto guardar', body: 'Tem uma trilha inteira sobre isso na aba Aprender, de graça.' },
      { h: '3. Onde deixar', body: 'Explicado sem indicar produto — a decisão continua sua.' },
      { h: '4. Quando usar', body: 'Só pro imprevisto real, não pra qualquer vontade do mês.', cta: 'Aprende mais → finn.dev.br' },
    ] },

  { slug: 'perfil-gastador',
    caption: 'Qual desses 4 perfis de gastador é você? 🎭\n\nSem julgamento — só um espelho. Descobre o seu de verdade nos gráficos por categoria do Finn.\n\n#financaspessoais #appfinanceiro #educacaofinanceira',
    slides: [
      { h: 'Qual desses 4 perfis |é você|?', body: 'Sem julgamento — só um espelho.', emoji: '🎭' },
      { h: 'O impulsivo', body: 'Decide no calor da hora e só entende o estrago no fim do mês.', emoji: '🛍️' },
      { h: 'O planejador', body: 'Tem meta pra tudo, mas às vezes esquece de aproveitar o presente.', emoji: '📋' },
      { h: 'O avestruz', body: 'Prefere nem olhar o extrato — o que os olhos não veem…', emoji: '🙈' },
      { h: 'O equilibrado', body: 'Gasta com consciência, guarda sem sofrer.', emoji: '⚖️', cta: 'Descobre o seu → finn.dev.br' },
    ] },
];

/* ── render ────────────────────────────────────────────────────────────── */
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const pngGerados = [];

async function render(html, w, h, saida) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const ruins = await colisoes(p);
  if (ruins.length) console.log(`  ⚠ ${path.basename(saida)}: ${ruins.join(' | ')}`);
  await p.screenshot({ path: saida, type: 'png' });
  await p.close();
  pngGerados.push(saida);
}

const manifest = { feed: [], carousels: [] };

for (const f of FEED) {
  const saida = path.join(SAIDA_DIR, `feed-${f.slug}.png`);
  await render(post(f), POST_W, POST_H, saida);
  manifest.feed.push({ arquivo: path.basename(saida), caption: f.legenda + '\n\n' + f.tags });
  console.log('feed:', f.slug);
}

for (const c of CAROUSELS) {
  const arquivos = [];
  for (let i = 0; i < c.slides.length; i++) {
    const saida = path.join(SAIDA_DIR, `carousel-${c.slug}-${i + 1}.png`);
    await render(slide(c.slides[i], { index: i + 1, total: c.slides.length }), POST_W, POST_H, saida);
    arquivos.push(path.basename(saida));
  }
  manifest.carousels.push({ arquivos, caption: c.caption });
  console.log('carousel:', c.slug, `(${c.slides.length} slides)`);
}

await b.close();

console.log(execFileSync('python3', [path.join(DIR, 'otimiza-png.py'), ...pngGerados]).toString().trim());

fs.writeFileSync(path.join(SAIDA_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('\nmanifest.json gerado com', manifest.feed.length, 'posts de feed e', manifest.carousels.length, 'carrosséis.');

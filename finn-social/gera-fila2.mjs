// Segundo lote de posts pra fila do Instagram (social_posts) — mesma ideia
// de finn-social/gera-fila.mjs (que já publicou os 20 feed + 5 carrosséis
// originais). Gerado em 14/09/2026 porque a fila secou (feed/carousel
// zerados, nada saindo há dias). Duplica os helpers em vez de importar
// gera-fila.mjs, seguindo a mesma convenção documentada lá.
//
// Uso:  node finn-social/gera-fila2.mjs
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
  return base(POST_W, POST_H, NAVY,
    brilho() + marca({ claro: false }) + pillContorno(p.pill) + h1Post(p.h, '#fff') +
    corpoPost(p.body, 790, CINZA_ESCURO) +
    chips(p.itens, { escuro: true, top: 1020 }) +
    rodapePost(p.rodape, CINZA_CLARO));
}

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

/* ═══════════════════════ 20 POSTS DE FEED (lote 2) ═══════════════════════ */
const FEED = [
  { slug: 'titulo-evolucao', layout: 'hero', pill: '🏆 CONQUISTAS',
    h: 'Todo mês organizado |vira um título novo|.',
    body: 'De Aprendiz das Finanças a Investidor Blindado — o Finn acompanha seu progresso e evolui seu título sozinho.',
    itens: [['🌱', 'Aprendiz das Finanças'], ['🎖️', 'Organizador Oficial'], ['🛡️', 'Investidor Blindado']],
    rodape: RODAPE, emoji: '🏆',
    legenda: 'De Aprendiz das Finanças a Investidor Blindado: o Finn acompanha suas conquistas e evolui seu título sozinho, sem você precisar fazer nada além de usar o app.',
    tags: '#gamificacao #financaspessoais #appfinanceiro' },

  { slug: 'streak-fogo', layout: 'cream', pill: '🔥 SEQUÊNCIA',
    h: 'Quantos dias seguidos |você consegue manter|?',
    body: 'Lança algo por 7 dias seguidos e desbloqueia uma conquista. Chega a 30 e vira hábito de verdade.',
    itens: ['7 dias: primeira conquista', '30 dias: virou hábito', 'O Finn conta sozinho'],
    rodape: RODAPE, emoji: '🔥',
    legenda: 'Lançou algo por 7 dias seguidos? Conquista desbloqueada. Chegou a 30? Virou hábito de verdade — e o Finn conta tudo sozinho.',
    tags: '#gamificacao #habitos #financaspessoais' },

  { slug: 'conquistas-secretas', layout: 'laranja', pill: '🤫 SEGREDO',
    h: 'Tem conquista escondida |no Finn|.',
    body: 'Algumas só aparecem depois de desbloqueadas — nem o nome nem a dica a gente conta antes. O jeito é usar e descobrir.',
    itens: ['Não aparecem na lista', 'Só revelam quando você desbloqueia', 'O fator surpresa é o ponto'],
    rodape: RODAPE, emoji: '🤫',
    legenda: 'Tem conquista escondida no Finn — nem o nome nem a dica a gente revela antes de você desbloquear. O jeito é usar o app e descobrir sozinho.',
    tags: '#gamificacao #financaspessoais #appfinanceiro' },

  { slug: 'compartilha-conquista', layout: 'tiles', glow: false, pill: '📸 MOSTRA PRO MUNDO',
    h: 'Desbloqueou uma conquista? |Compartilha|.',
    body: 'Baixa a conquista como imagem e posta nos stories — não precisa de print feio de tela.',
    itens: [['🏆', 'Conquista desbloqueada'], ['📥', 'Baixa a imagem'], ['📤', 'Posta onde quiser']],
    rodape: RODAPE, emoji: '📸',
    legenda: 'Desbloqueou uma conquista? Baixa como imagem prontinha pra postar nos stories — sem print feio de tela.',
    tags: '#gamificacao #financaspessoais #appfinanceiro' },

  { slug: 'cartao-fechamento', layout: 'centro', pill: null,
    h: 'Fatura calculada |no seu dia de fechamento|.',
    body: 'Configura o dia de fechamento e vencimento de cada cartão, e o Finn calcula o total da fatura atual sozinho.',
    itens: [['📅', 'Dia de fechamento'], ['🔔', 'Dia de vencimento'], ['🧮', 'Total calculado sozinho']],
    rodape: RODAPE, emoji: '💳',
    legenda: 'Configura o dia de fechamento e vencimento de cada cartão, e o Finn calcula o total da fatura atual automaticamente — sem você somar nada na mão.',
    tags: '#cartaodecredito #financaspessoais #controlefinanceiro' },

  { slug: 'categoria-sua-cara', layout: 'hero', pill: '🏷️ DO SEU JEITO',
    h: 'As categorias padrão não bastam? |Cria a sua|.',
    body: 'Além das categorias prontas, você cria as suas próprias — do jeito que fizer sentido pra sua vida.',
    itens: [['➕', 'Cria quantas quiser'], ['🎨', 'Do seu jeito'], ['🗑️', 'Apaga quando quiser']],
    rodape: RODAPE, emoji: '🏷️',
    legenda: 'As categorias padrão não bastam pra sua vida? Cria as suas próprias, do jeito que fizer sentido — e apaga quando quiser.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'modo-escuro', layout: 'cream', pill: '🌙 NO SEU RITMO',
    h: 'Modo escuro, |pra quem prefere|.',
    body: 'Troca entre claro e escuro direto nas configurações — o app se ajusta na hora.',
    itens: ['Um toque pra trocar', 'Fica salvo pra próxima vez', 'Sem reiniciar o app'],
    rodape: RODAPE, emoji: '🌙',
    legenda: 'Prefere modo escuro? Troca direto nas configurações, um toque — o Finn se ajusta na hora e lembra da sua escolha da próxima vez.',
    tags: '#appfinanceiro #financaspessoais #tecnologia' },

  { slug: 'racha-sem-instalar', layout: 'laranja', pill: '🤝 SEM COMPLICAÇÃO',
    h: 'A galera não precisa |instalar nada|.',
    body: 'No Racha, cada participante entra só com o nome. Ninguém mais precisa baixar o Finn pra você saber quem deve o quê.',
    itens: ['Só o nome da pessoa', 'Ninguém mais instala nada', 'Você controla quem já pagou'],
    rodape: RODAPE, emoji: '🤝',
    legenda: 'No Racha, cada participante entra só com o nome — ninguém mais precisa instalar o Finn pra você saber exatamente quem já pagou e quem ainda deve.',
    tags: '#dividirdespesas #financaspessoais #appfinanceiro' },

  { slug: 'divida-juros-reais', layout: 'tiles', glow: true, pill: '💳 SEM SUSTO',
    h: 'Quanto uma dívida custa |de verdade|?',
    body: 'Antes de pagar só o mínimo do cartão, simula com os juros reais — o Finn mostra o custo de verdade, não uma estimativa solta.',
    itens: [['🧮', 'Juros reais'], ['📉', 'Plano pra quitar'], ['😮', 'Sem surpresa depois']],
    rodape: RODAPE, emoji: '🧮',
    legenda: 'Antes de decidir pagar só o mínimo do cartão, simula com os juros reais — o Finn calcula o custo de verdade da dívida, não uma estimativa solta.',
    tags: '#cartaodecredito #educacaofinanceira #financaspessoais' },

  { slug: 'grafico-por-categoria', layout: 'centro', pill: null,
    h: 'Pra onde seu dinheiro |realmente| vai?',
    body: 'Um gráfico simples, por categoria, mostra de bandeja onde está indo cada real do seu mês.',
    itens: [['🍩', 'Gráfico por categoria'], ['👀', 'Visual, sem tabela'], ['📊', 'Atualiza sozinho']],
    rodape: RODAPE, emoji: '🍩',
    legenda: 'Pra onde seu dinheiro realmente vai? Um gráfico simples, por categoria, mostra de bandeja — sem precisar ler tabela nenhuma.',
    tags: '#financaspessoais #appfinanceiro #controlefinanceiro' },

  { slug: 'whatsapp-lanca-por-mensagem', layout: 'hero', pill: '💬 SEM ABRIR O APP',
    h: 'Manda "Uber 32" no WhatsApp. |Só isso.|',
    body: 'Conecta seu WhatsApp ao Finn e lança um gasto batendo um papo — ele categoriza sozinho, sem abrir o app.',
    itens: [['💬', 'Manda a mensagem'], ['🤖', 'Categoriza sozinho'], ['📲', 'Sem abrir o app']],
    rodape: RODAPE, emoji: '💬',
    legenda: 'Conecta seu WhatsApp ao Finn e lança um gasto batendo um papo — tipo "Uber 32" — e ele categoriza sozinho, sem precisar abrir o app.',
    tags: '#whatsapp #financaspessoais #automacao' },

  { slug: 'meta-com-prazo', layout: 'cream', pill: '🎯 NO SEU RITMO',
    h: 'No ritmo de hoje, |quando você chega lá|?',
    body: 'Define o valor e o prazo da meta, e o Finn calcula quando você bate ela guardando o que está guardando agora.',
    itens: ['Valor e prazo da meta', 'Cálculo automático', 'Ajusta se o ritmo mudar'],
    rodape: RODAPE, emoji: '🎯',
    legenda: 'Define o valor e o prazo da meta, e o Finn calcula quando você chega lá no ritmo que está guardando hoje — e recalcula se o ritmo mudar.',
    tags: '#metasfinanceiras #financaspessoais #appfinanceiro' },

  { slug: 'lancamento-manual-sem-banco', layout: 'laranja', pill: '✋ DO JEITO QUE PREFERIR',
    h: 'Não quer conectar o banco? |Não precisa.|',
    body: 'Dá pra usar o Finn 100% manual, lançando cada gasto na mão — a organização funciona do mesmo jeito.',
    itens: ['Sem conectar banco', 'Lançamento manual', 'Mesma organização de sempre'],
    rodape: RODAPE, emoji: '✋',
    legenda: 'Não quer conectar o banco? Não precisa — dá pra usar o Finn 100% manual, lançando cada gasto na mão, e a organização funciona do mesmo jeito.',
    tags: '#financaspessoais #appfinanceiro #privacidade' },

  { slug: 'edita-lancamento-antigo', layout: 'tiles', glow: false, pill: '✏️ NUNCA É TARDE',
    h: 'Achou um lançamento errado |do mês passado|? Corrige.',
    body: 'Edita valor, data ou categoria de qualquer lançamento antigo — na hora que perceber o erro.',
    itens: [['🔍', 'Encontra na lista'], ['✏️', 'Edita o que for'], ['✅', 'Corrigido na hora']],
    rodape: RODAPE, emoji: '✏️',
    legenda: 'Achou um lançamento errado do mês passado? Edita valor, data ou categoria a qualquer momento — nunca é tarde pra corrigir.',
    tags: '#financaspessoais #appfinanceiro #organizacaofinanceira' },

  { slug: 'pluggy-varios-bancos', layout: 'centro', pill: null,
    h: 'Mais de um banco? |Conecta todos.|',
    body: 'O Finn junta o extrato de vários bancos num só lugar, via Open Finance — sem precisar abrir um app pra cada.',
    itens: [['🏦', 'Vários bancos'], ['🔗', 'Tudo num só lugar'], ['🔐', 'Via Open Finance']],
    rodape: RODAPE, emoji: '🏦',
    legenda: 'Tem conta em mais de um banco? O Finn conecta todos via Open Finance e junta o extrato num só lugar — sem precisar abrir um app pra cada.',
    tags: '#openfinance #financaspessoais #appfinanceiro' },

  { slug: 'sem-pegadinha-teste-gratis', layout: 'hero', pill: '🆓 SEM PEGADINHA',
    h: 'Testa grátis. |Sem cartão, sem pegadinha.|',
    body: 'Não pede cartão de crédito pra testar, não cobra sozinho depois — é grátis de verdade pra começar.',
    itens: [['🚫', 'Sem cartão'], ['🚫', 'Sem cobrança escondida'], ['✅', 'Grátis de verdade']],
    rodape: RODAPE, emoji: '🆓',
    legenda: 'Testa grátis, sem cartão de crédito e sem cobrança escondida depois. Se fizer sentido pra você, o resto está lá quando quiser.',
    tags: '#appfinanceiro #financaspessoais' },

  { slug: 'primeiro-lancamento-conquista', layout: 'cream', pill: '🌱 O COMEÇO',
    h: 'O primeiro lançamento |já é uma conquista|.',
    body: 'Registrou seu primeiro gasto ou receita? Isso já desbloqueia a primeira conquista do Finn.',
    itens: ['Primeiro gasto ou receita', 'Conquista desbloqueada', 'O resto vem depois'],
    rodape: RODAPE, emoji: '🌱',
    legenda: 'Registrou seu primeiro gasto ou receita no Finn? Isso já desbloqueia a primeira conquista — o resto do progresso vem no seu ritmo.',
    tags: '#gamificacao #financaspessoais #appfinanceiro' },

  { slug: 'instala-sem-loja', layout: 'laranja', pill: '📲 SEM LOJA DE APP',
    h: 'Instala o Finn |sem passar pela loja de app|.',
    body: 'É um app web instalável: abre no navegador, adiciona à tela inicial, e usa como qualquer outro app — sem ocupar espaço de atualização.',
    itens: ['Direto do navegador', 'Sem loja de app', 'Atualiza sozinho'],
    rodape: RODAPE, emoji: '📲',
    legenda: 'O Finn é um app web instalável: abre no navegador, adiciona à tela inicial e usa como qualquer outro app — sem passar pela loja e sem ocupar espaço com atualização.',
    tags: '#appfinanceiro #tecnologia #financaspessoais' },

  { slug: 'dados-isolados-rls', layout: 'tiles', glow: true, pill: '🔒 SÓ SEUS DADOS',
    h: 'Seus dados só aparecem |pra você|.',
    body: 'No banco do Finn, cada conta só enxerga os próprios dados — nem por engano um usuário vê o lançamento de outro.',
    itens: [['🔒', 'Isolamento por conta'], ['🙈', 'Ninguém vê o de outro'], ['✅', 'Regra no próprio banco']],
    rodape: RODAPE, emoji: '🔒',
    legenda: 'No banco de dados do Finn, cada conta só enxerga os próprios dados — a regra fica no próprio banco, não só na tela, então nem por engano um usuário vê o lançamento de outro.',
    tags: '#privacidade #seguranca #financaspessoais' },

  { slug: 'mito-cartao-vilao', layout: 'centro', pill: null,
    h: 'Mito: cartão de crédito |é sempre vilão|.',
    body: 'O problema nunca foi o cartão — é não saber quanto vai fechar a fatura. Com isso claro, ele volta a ser só uma ferramenta.',
    itens: [['❌', 'MITO'], ['🧮', 'O problema é não saber o valor'], ['💳', 'Cartão é só ferramenta']],
    rodape: RODAPE, emoji: '💳',
    legenda: 'Mito: cartão de crédito é sempre vilão. Verdade: o problema nunca foi o cartão — é não saber quanto vai fechar a fatura. Com isso claro, ele volta a ser só uma ferramenta.',
    tags: '#cartaodecredito #educacaofinanceira #financaspessoais' },
];

/* ═══════════════════════ 5 CARROSSÉIS (lote 2) ═══════════════════════ */
const CAROUSELS = [
  { slug: 'conquistas-no-finn',
    caption: 'Tem toda uma camada de jogo escondida no Finn 🏆\n\nTítulos que evoluem, sequência de dias, conquistas secretas — quanto mais você organiza a vida financeira, mais desbloqueia. Vai começar por onde?\n\n#gamificacao #financaspessoais #appfinanceiro #metasfinanceiras',
    slides: [
      { h: 'Tem um jogo |escondido| no Finn.', body: 'Quanto mais você organiza, mais desbloqueia.', emoji: '🏆' },
      { h: 'Seu título evolui sozinho', body: 'De Aprendiz das Finanças até Investidor Blindado, conforme você desbloqueia conquistas.', emoji: '🎖️' },
      { h: 'Sequência de dias', body: '7 dias seguidos lançando algo já desbloqueia uma conquista. 30 dias vira hábito.', emoji: '🔥' },
      { h: 'Conquistas secretas', body: 'Algumas nem aparecem na lista até você desbloquear sem querer. O mistério é o ponto.', emoji: '🤫' },
      { h: 'Compartilha quando quiser', body: 'Baixa a conquista como imagem e posta nos stories.', emoji: '📸' },
      { h: 'Cada ação conta', body: 'Meta batida, dívida quitada, racha dividido — tudo isso soma pro seu progresso.', emoji: '✅', cta: 'Desbloqueia a sua → finn.dev.br' },
    ] },

  { slug: 'cartao-sem-susto',
    caption: 'Cartão de crédito sem sustos, em 4 recursos 💳\n\nFechamento, vencimento, fatura em tempo real e simulação de dívida com juros reais — tudo no mesmo lugar.\n\n#cartaodecredito #financaspessoais #controlefinanceiro #appfinanceiro',
    slides: [
      { h: 'Cartão de crédito, |sem sustos|.', body: '4 recursos que mudam a relação com a fatura.', emoji: '💳' },
      { h: '1. Seu dia de fechamento', body: 'Configura o dia de fechamento e vencimento de cada cartão que você usa.' },
      { h: '2. Fatura em tempo real', body: 'O Finn calcula o total da fatura atual sozinho, sem você somar nada.' },
      { h: '3. Parcelas futuras', body: 'Acompanha o que ainda vai chegar nas próximas faturas, não só a de agora.' },
      { h: '4. Juros reais na simulação', body: 'Antes de pagar só o mínimo, simula quanto a dívida custa de verdade.', cta: 'Organiza seu cartão → finn.dev.br' },
    ] },

  { slug: '5-mitos-financas',
    caption: '5 mitos sobre dinheiro que a gente ainda acredita 🙃\n\nSpoiler: nenhum deles é verdade.\n\n#educacaofinanceira #mitosfinanceiros #financaspessoais #appfinanceiro',
    slides: [
      { h: '5 mitos sobre dinheiro |que a gente ainda acredita|.', body: 'Spoiler: nenhum é verdade.', emoji: '🙃' },
      { h: '"Só rico consegue guardar dinheiro"', body: 'Reserva não é sobre quanto você ganha — é sobre guardar um pouco, sempre.' },
      { h: '"Cartão de crédito é vilão"', body: 'O problema nunca foi o cartão — é não saber quanto vai fechar a fatura.' },
      { h: '"Organizar as finanças exige planilha"', body: 'Importa o extrato e o app organiza sozinho. Planilha virou opcional.' },
      { h: '"Investir é só pra quem entende de mercado"', body: 'Dá pra aprender o básico de graça, sem indicação de produto — só explicação.', cta: 'Aprende de graça → finn.dev.br' },
    ] },

  { slug: 'seguranca-explicada',
    caption: 'Como o Finn cuida dos seus dados, sem enrolação 🔒\n\nA gente já auditou isso de verdade — não é só discurso.\n\n#privacidade #seguranca #financaspessoais #appfinanceiro',
    slides: [
      { h: 'Como o Finn cuida |dos seus dados|.', body: 'Sem enrolação — e sem só discurso.', emoji: '🔒' },
      { h: 'Login com Google', body: 'Sem senha nova pra decorar nem pra guardar em lugar nenhum.' },
      { h: 'Sua senha do banco nunca passa pelo Finn', body: 'Quem cuida da conexão é a Pluggy, provedora de Open Finance regulada pelo Banco Central.' },
      { h: 'Isolamento por conta, no próprio banco', body: 'A regra de "cada um só vê o seu" fica no banco de dados, não só na tela.' },
      { h: 'Você pode apagar tudo quando quiser', body: 'Direto em Configurações, sem pedir aprovação nem justificativa.', cta: 'finn.dev.br' },
    ] },

  { slug: 'um-dia-com-finn',
    caption: 'Um dia normal, com o Finn rodando por trás 🌤️\n\nNada dramático — só automação silenciosa, o dia inteiro.\n\n#financaspessoais #appfinanceiro #organizacaofinanceira',
    slides: [
      { h: 'Um dia normal, |com o Finn rodando por trás|.', body: 'Nada dramático. Só automação silenciosa.', emoji: '🌤️' },
      { h: '08h — café e um Pix', body: 'Comprou o pão, pagou com Pix. O extrato chega categorizado sozinho depois.', emoji: '☕' },
      { h: '13h — "Uber 24" no WhatsApp', body: 'Manda a mensagem, o gasto já está lançado. Sem abrir o app.', emoji: '💬' },
      { h: '18h — aviso de conta fixa', body: 'Notificação: a internet vence em 3 dias. Você nem precisou lembrar.', emoji: '🔔' },
      { h: '22h — uma olhada rápida', body: 'Abre o Finn, vê o saldo do dia, fecha. Trinta segundos, no máximo.', emoji: '👁️', cta: 'Testa grátis → finn.dev.br' },
    ] },
];

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
  const saida = path.join(SAIDA_DIR, `feed2-${f.slug}.png`);
  await render(post(f), POST_W, POST_H, saida);
  manifest.feed.push({ arquivo: path.basename(saida), caption: f.legenda + '\n\n' + f.tags });
  console.log('feed:', f.slug);
}

for (const c of CAROUSELS) {
  const arquivos = [];
  for (let i = 0; i < c.slides.length; i++) {
    const saida = path.join(SAIDA_DIR, `carousel2-${c.slug}-${i + 1}.png`);
    await render(slide(c.slides[i], { index: i + 1, total: c.slides.length }), POST_W, POST_H, saida);
    arquivos.push(path.basename(saida));
  }
  manifest.carousels.push({ arquivos, caption: c.caption });
  console.log('carousel:', c.slug, `(${c.slides.length} slides)`);
}

await b.close();

console.log(execFileSync('python3', [path.join(DIR, 'otimiza-png.py'), ...pngGerados]).toString().trim());

fs.writeFileSync(path.join(SAIDA_DIR, 'manifest2.json'), JSON.stringify(manifest, null, 2));
console.log('\nmanifest2.json gerado com', manifest.feed.length, 'posts de feed e', manifest.carousels.length, 'carrosséis.');

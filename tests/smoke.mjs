// Smoke de regressão do app: abre TODAS as telas, confere que renderizam sem
// erro de JS, e valida as features desta sessão (streak, comparação mensal,
// conquistas visíveis e secretas, título, modo admin, export CSV).
//
// Recriado do zero: o scratchpad é efêmero e some quando o container
// reinicia, levando junto a suíte inteira.
import { chromium } from 'playwright';
import fs from 'fs'; import http from 'http';

const html = fs.readFileSync(new URL('../finn/index.html', import.meta.url), 'utf8');
const srv = http.createServer((q, r) => { r.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); r.end(html); }).listen(8995);

let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };

const hoje = new Date();
const d = (n) => { const x = new Date(hoje); x.setDate(x.getDate() - n); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
const ym = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0');
const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 5);
const ymAnt = mesPassado.getFullYear() + '-' + String(mesPassado.getMonth() + 1).padStart(2, '0');

// 8 dias seguidos + receita alta + gasto grande no mês passado (gera streak,
// mês no azul e comparação)
const TXS = [];
for (let i = 0; i < 8; i++) TXS.push({ id: 's' + i, user_id: 'u1', type: 'despesa', category: 'Transporte', description: 'Dia ' + i, value: 10, date: d(i), created_at: d(i) + 'T12:00:00Z' });
TXS.push({ id: 'r1', user_id: 'u1', type: 'receita', category: 'Salário', description: 'Salário', value: 5000, date: ym + '-02', created_at: ym + '-02T12:00:00Z' });
TXS.push({ id: 'a1', user_id: 'u1', type: 'despesa', category: 'Lazer', description: 'Mês passado', value: 900, date: ymAnt + '-05', created_at: ymAnt + '-05T12:00:00Z' });

const DADOS = {
  transactions: TXS,
  goals: [{ id: 'g1', user_id: 'u1', name: 'Viagem', target: 1000, saved: 1000 }],
  spending_limits: [{ id: 'l1', user_id: 'u1', category: 'Transporte', monthly_limit: 500 }],
  splits: [{ id: 'sp1', user_id: 'u1', title: 'Churrasco', total_value: 100 }],
};

const ANALYTICS = {
  ok: true, truncado: false, limite_lancamentos: 200000,
  totals: { users: 12, transactions: 340, returned: 7, returned_pct: 58 },
  conquistas: {
    base: 11, media_por_usuario: 3.4,
    itens: [
      { id: 'primeiro', nome: 'Primeiro lançamento', icone: '🌱', secreta: false, derivavel: true, usuarios: 11, pct: 100 },
      { id: 'streak7', nome: '7 dias seguidos', icone: '🔥', secreta: false, derivavel: true, usuarios: 4, pct: 36 },
      { id: 'tesoura', nome: 'Mãos de tesoura', icone: '✂️', secreta: true, derivavel: false, usuarios: null, pct: null },
    ],
    titulos: [{ titulo: 'Aprendiz das Finanças', usuarios: 5 }, { titulo: 'Organizador Oficial', usuarios: 4 }, { titulo: 'Mestre do Orçamento', usuarios: 2 }, { titulo: 'Investidor Blindado', usuarios: 0 }],
  },
  signups_by_week: [{ week: '2026-08-03', count: 5 }],
  active_days: [{ day: d(0), count: 12 }],
  feature_adoption: [{ table: 'goals', users: 6, pct: 50 }],
  users: [{ id: 'u1', email: 'a@x.com', name: 'Ana', plan: 'pro', internal: false, tx_count: 40, active_days: 12, returned: true, has_whatsapp: true, has_telegram: false, ai_usage_count: 2, created_at: '2026-07-01T10:00:00Z', last_sign_in_at: d(0) + 'T10:00:00Z' }],
};
const INTRUSOES = {
  ok: true, ultimas24: 41, ultimos7d: 175, mediaDiaria7d: 14.3, pico: false, totalHoje: 41, lidos: 201, totalRegistrado: 201, truncado: false,
  porTipo: [{ nome: 'caminho_desconhecido', total: 128 }],
  topCaminhos: [{ nome: '/.env', total: 8 }],
  origens: [{ regiao: '209.99.x.x', pais: 'CH', total: 33, caminhosDistintos: 22, ultimaEm: d(1) + 'T03:22:00Z' }],
};

let ULTIMA_CHAMADA_TEMPLATES = null;
let ULTIMO_TESTE_TEMPLATE = null;
let ULTIMA_PLANILHA = null;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });

async function abrir(email) {
  const p = await b.newPage({ viewport: { width: 1180, height: 1400 } });
  const erros = [];
  p.on('pageerror', e => erros.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|MIME|Failed to load resource/i.test(m.text())) erros.push(m.text().slice(0, 160)); });
  await p.addInitScript((mail) => {
    localStorage.setItem('finn_supa_session', JSON.stringify({
      access_token: 't', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 7200,
      user: { id: 'u1', email: mail, user_metadata: { full_name: 'Teste', whatsapp_verified: true } }
    }));
  }, email);
  await p.route('**/*', async route => {
    const u = route.request().url();
    const m = route.request().method();
    const J = (o) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
    if (u.includes('/admin/analytics')) return J(ANALYTICS);
    if (u.includes('/admin/intrusions')) return J(INTRUSOES);
    if (u.includes('bot-stats')) return J({ ok: true, whatsappTx: 25, telegramTx: 40, dailyDashboardOptIn: 3 });
    if (u.includes('supabase.co/rest/v1/') && (m === 'DELETE' || m === 'PATCH' || m === 'POST')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    if (u.includes('supabase.co/rest/v1/social_posts')) return J([
      { id: 'q1', kind: 'feed', image_path: 'feed-1.png', caption: 'Post na fila', posicao: 1, published_at: null, erro: null },
      { id: 'q2', kind: 'story', image_path: 'story-1.jpg', caption: null, posicao: 2, published_at: null, erro: null },
    ]);
    if (u.includes('supabase.co/rest/v1/')) { const t = u.split('/rest/v1/')[1].split('?')[0]; return J(DADOS[t] || []); }
    if (u.includes('supabase.co/auth/v1/user')) return J({ id: 'u1', email, user_metadata: {} });
    if (u.includes('/admin')) return J({ ok: true });
    if (u.includes('/sheets/token')) {
      ULTIMA_PLANILHA = { metodo: route.request().method(), corpo: route.request().postData() };
      return J({ ok: true, token: 'fsh_' + 'a'.repeat(64) });
    }
    if (u.includes('/whatsapp/entregas')) {
      return J({ ok: true, veredito: 'A Meta FALHOU na entrega — veja explicacao.',
        entregas: [{ em: '2026-08-11T23:10:00Z', status: 'failed', codigo: 131049, explicacao: 'A Meta ENGOLIU a mensagem de propósito.' }] });
    }
    if (u.includes('/whatsapp/test-daily-template')) {
      const h = route.request().headers();
      ULTIMO_TESTE_TEMPLATE = { corpo: route.request().postData(), auth: h['authorization'] || '', senha: h['x-admin-password'] || '' };
      return J({ ok: true, http: 200, veredito: 'ENVIADO. Confira o WhatsApp desse número.' });
    }
    if (u.includes('/whatsapp/templates')) {
      // Guarda o que o botão MANDOU: o ponto do teste é provar que ele
      // autentica sozinho (sessão + senha master), sem token pra colar.
      const h = route.request().headers();
      ULTIMA_CHAMADA_TEMPLATES = { url: u, auth: h['authorization'] || '', senha: h['x-admin-password'] || '' };
      return J({ ok: true, http: 200, veredito: 'AINDA EM ANÁLISE na Meta. Nada a fazer além de esperar.',
        resumo_diario_finn: [{ nome: 'resumo_diario_finn', status: 'PENDING' }] });
    }
    if (u.includes('workers.dev') || u.includes('/beta')) return J({ ok: true, txs: [] });
    return route.continue();
  });
  await p.goto('http://localhost:8995/');
  await p.waitForTimeout(2000);
  return { p, erros };
}

console.log('=== todas as telas renderizam sem erro ===');
{
  const { p, erros } = await abrir('user@x.com');
  const abas = ['dashboard', 'adicionar', 'analises', 'lancamentos', 'limites', 'metas', 'fixas', 'cartoes', 'dividas', 'racha', 'ia'];
  for (const aba of abas) {
    const r = await p.evaluate(async (a) => {
      const btn = [...document.querySelectorAll('.tab-btn')].find(x => x.dataset.tab === a);
      if (!btn) return { erro: 'aba inexistente' };
      btn.click();
      await new Promise(r => setTimeout(r, 350));
      const c = document.getElementById('content');
      return { chars: c.innerHTML.length, vazio: c.innerText.trim().length < 5 };
    }, aba);
    ok(!r.erro && r.chars > 200 && !r.vazio, 'aba "' + aba + '" renderiza', r.erro || (r.chars + ' chars'));
  }
  // config por último (não é .tab-btn)
  const cfg = await p.evaluate(async () => {
    document.getElementById('btnConfigNav').click();
    await new Promise(r => setTimeout(r, 400));
    return document.getElementById('content').innerHTML.length;
  });
  ok(cfg > 200, 'aba "config" renderiza', cfg + ' chars');
  ok(erros.length === 0, 'nenhum erro de JS em nenhuma tela', erros.join(' | '));
  await p.close();
}

console.log('\n=== features de engajamento no Dashboard ===');
{
  const { p, erros } = await abrir('user@x.com');
  const t = await p.evaluate(() => document.getElementById('content').innerText);
  // >= 8 e nao "exatamente 8": o lancamento de salario do fixture cai no dia 2
  // do mes e, dependendo de que dia e hoje, fica ADJACENTE aos 8 dias
  // semeados — esticando a sequencia legitimamente. O que importa aqui e que
  // a sequencia e contada e passa do limiar de 7 (que libera o compartilhar).
  const nStreak = Number((t.match(/(\d+) dias seguidos/) || [])[1] || 0);
  ok(nStreak >= 8, 'streak de pelo menos 8 dias aparece', (t.match(/\d+ dias seguidos/) || [])[0]);
  ok(/a menos que em|a mais que em/.test(t), 'comparação com o mês anterior aparece', (t.match(/Você gastou[^\n]*/) || [])[0]);
  ok(/(até agora)/.test(t) || Number(d(0).slice(8, 10)) >= 28, 'comparação parcial marcada como "(até agora)" quando é cedo no mês', (t.match(/Você gastou[^\n]*/) || [])[0]);
  ok(/conquistas/i.test(t), 'card de conquistas aparece');
  ok(/Aprendiz|Organizador|Mestre|Investidor/.test(t), 'título de evolução aparece', (t.match(/Aprendiz[^\n]*|Organizador[^\n]*|Mestre[^\n]*|Investidor[^\n]*/) || [])[0]);
  const temShare = await p.evaluate(() => !!document.getElementById('btnShareStreak'));
  ok(temShare, 'botão de compartilhar aparece com streak >= 7');

  // compartilhar sem Web Share API -> baixa a imagem (não manda só texto)
  const baixou = await p.evaluate(async () => {
    delete navigator.share; delete navigator.canShare;
    let baixou = false;
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (this.download) baixou = true; else orig.call(this); };
    document.getElementById('btnShareStreak').click();
    await new Promise(r => setTimeout(r, 400));
    HTMLAnchorElement.prototype.click = orig;
    return baixou;
  });
  ok(baixou, 'sem Web Share API, compartilhar BAIXA a imagem (não manda só texto)');
  ok(erros.length === 0, 'sem erro de JS', erros.join(' | '));
  await p.close();
}

console.log('\n=== modo admin ===');
{
  const { p, erros } = await abrir('finn.controle01@gmail.com');
  await p.evaluate(async () => {
    document.getElementById('btnConfigNav').click();
    await new Promise(r => setTimeout(r, 500));
    const i = document.getElementById('adminPasswordInput');
    if (i) { i.value = 'x'; i.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('btnAdminUnlock').click(); }
  });
  await p.waitForTimeout(1600);

  const est = await p.evaluate(() => ({
    abas: [...document.querySelectorAll('.nav-menu .tab-btn')].filter(x => getComputedStyle(x).display !== 'none').length,
    home: getComputedStyle(document.getElementById('btnAdminHomeNav')).display,
    txt: document.getElementById('content').innerText,
  }));
  ok(est.abas === 0, 'abas normais do Finn somem no modo admin', est.abas);
  ok(est.home !== 'none', 'navegação de admin aparece');
  ok(/12/.test(est.txt) && /340/.test(est.txt), 'números principais aparecem');
  ok(/conquistas/i.test(est.txt), 'bloco de conquistas aparece');
  ok(/Mãos de tesoura/.test(est.txt) && /não dá pra medir/i.test(est.txt), 'explica honestamente a conquista não-mensurável');

  // export CSV
  await p.evaluate(() => { const b = document.getElementById('btnLoadIntrusionsHome'); if (b) b.click(); });
  await p.waitForTimeout(900);
  const csv = await p.evaluate(async () => {
    let blob = null;
    const oc = URL.createObjectURL; URL.createObjectURL = (b) => { blob = b; return 'blob:x'; };
    const orig = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (!this.download) orig.call(this); };
    const btn = document.getElementById('btnExportIntrusionsHome');
    if (btn) btn.click();
    await new Promise(r => setTimeout(r, 300));
    HTMLAnchorElement.prototype.click = orig; URL.createObjectURL = oc;
    if (!blob) return null;
    const bytes = new Uint8Array(await blob.arrayBuffer()).slice(0, 3);
    return { bom: [...bytes], texto: await blob.text() };
  });
  ok(!!csv, 'exportar gera arquivo');
  if (csv) {
    ok(csv.bom[0] === 0xEF && csv.bom[1] === 0xBB && csv.bom[2] === 0xBF, 'CSV com BOM UTF-8 (Excel lê acento certo)', JSON.stringify(csv.bom));
    ok(csv.texto.includes(';'), 'usa ponto e vírgula (separador do Excel pt-BR)');
    ok(/175/.test(csv.texto), 'traz os dados');
  }

  // Situação do template do WhatsApp: um clique, sem token pra copiar.
  ULTIMA_CHAMADA_TEMPLATES = null;
  const temBotao = await p.evaluate(() => !!document.getElementById('btnTemplateStatus'));
  ok(temBotao, 'botão "Ver situação do template" aparece no admin');
  await p.evaluate(() => { const t = document.getElementById('btnTemplateStatus'); if (t) t.click(); });
  await p.waitForTimeout(900);
  const tpl = await p.evaluate(() => document.getElementById('content').innerText);
  ok(!!ULTIMA_CHAMADA_TEMPLATES, 'o botão chama o worker do bot');
  if (ULTIMA_CHAMADA_TEMPLATES) {
    ok(/workers\.dev\/whatsapp\/templates$/.test(ULTIMA_CHAMADA_TEMPLATES.url), 'chama a rota certa', ULTIMA_CHAMADA_TEMPLATES.url);
    ok(ULTIMA_CHAMADA_TEMPLATES.auth.startsWith('Bearer '), 'manda a sessão do Supabase', ULTIMA_CHAMADA_TEMPLATES.auth);
    ok(ULTIMA_CHAMADA_TEMPLATES.senha === 'x', 'manda a senha master digitada', ULTIMA_CHAMADA_TEMPLATES.senha);
  }
  ok(/EM ANÁLISE/i.test(tpl), 'o veredito da Meta aparece na tela', (tpl.match(/[^\n]*ANÁLISE[^\n]*/) || [])[0]);

  // Envio de teste: sem número, não pode disparar nada.
  ULTIMO_TESTE_TEMPLATE = null;
  await p.evaluate(() => { const t = document.getElementById('btnTemplateTeste'); if (t) t.click(); });
  await p.waitForTimeout(500);
  ok(ULTIMO_TESTE_TEMPLATE === null, 'sem telefone, o teste não chama o worker');
  const semTel = await p.evaluate(() => document.getElementById('content').innerText);
  ok(/Digite o telefone/i.test(semTel), 'e avisa que falta o telefone');

  await p.evaluate(() => {
    const i = document.getElementById('templateTestePhone');
    i.value = '55 11 99999-9999';
    i.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('btnTemplateTeste').click();
  });
  await p.waitForTimeout(900);
  ok(!!ULTIMO_TESTE_TEMPLATE, 'com telefone, chama o worker');
  if (ULTIMO_TESTE_TEMPLATE) {
    // O worker normaliza, mas mandar já limpo evita depender disso.
    ok(/"phone":"5511999999999"/.test(ULTIMO_TESTE_TEMPLATE.corpo || ''), 'manda o telefone só com dígitos', ULTIMO_TESTE_TEMPLATE.corpo);
    ok(ULTIMO_TESTE_TEMPLATE.senha === 'x', 'autentica com a senha master', ULTIMO_TESTE_TEMPLATE.senha);
  }
  const depois = await p.evaluate(() => ({
    txt: document.getElementById('content').innerText,
    campo: document.getElementById('templateTestePhone').value,
  }));
  ok(/ENVIADO/i.test(depois.txt), 'mostra o resultado do envio', (depois.txt.match(/[^\n]*ENVIADO[^\n]*/) || [])[0]);
  // O render() do resultado recria o campo; sem guardar o valor no state, o
  // número digitado sumia bem na hora de tentar de novo.
  ok(depois.campo === '5511999999999', 'o telefone digitado sobrevive ao re-render', depois.campo);

  await p.evaluate(() => { const t = document.getElementById('btnEntregas'); if (t) t.click(); });
  await p.waitForTimeout(900);
  const ent = await p.evaluate(() => document.getElementById('content').innerText);
  ok(/FALHOU/i.test(ent), 'entregas: mostra o veredito', (ent.match(/[^\n]*FALHOU[^\n]*/) || [])[0]);
  ok(/131049/.test(ent), 'e o código da Meta', (ent.match(/[^\n]*131049[^\n]*/) || [])[0]);

  // tela de Conteudo
  await p.evaluate(async () => {
    document.getElementById('btnConteudoNav').click();
    await new Promise(r => setTimeout(r, 900));
  });
  const cont = await p.evaluate(() => document.getElementById('content').innerText);
  ok(/conte[úu]do do instagram/i.test(cont), 'tela de Conteudo abre', (cont.match(/CONTE[ÚU]DO[^\n]*/i) || [])[0]);
  ok(/na fila/i.test(cont), 'mostra a fila');
  ok(/10h e 18h/.test(cont), 'explica quando publica');
  const campos = await p.evaluate(() => ({
    kind: !!document.getElementById('conteudoKind'),
    arq: !!document.getElementById('conteudoArquivo'),
    leg: !!document.getElementById('conteudoLegenda'),
    btn: !!document.getElementById('btnConteudoEnviar'),
  }));
  ok(campos.kind && campos.arq && campos.leg && campos.btn, 'formulario completo (tipo, imagem, legenda, botao)', JSON.stringify(campos));
  // trocar pra story esconde a legenda (o Instagram ignora caption em story)
  await p.evaluate(async () => {
    const sel = document.getElementById('conteudoKind');
    sel.value = 'story'; sel.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise(r => setTimeout(r, 400));
  });
  const semLeg = await p.evaluate(() => !document.getElementById('conteudoLegenda'));
  const aviso = await p.evaluate(() => document.getElementById('content').innerText);
  ok(semLeg, 'story esconde o campo de legenda');
  ok(/ignora legenda/i.test(aviso), 'e explica por que', (aviso.match(/[^\n]*ignora legenda[^\n]*/i) || [])[0]);

  // voltar pro Finn normal
  await p.evaluate(async () => { document.getElementById('btnAdminHomeNav').click(); await new Promise(r => setTimeout(r, 500)); });
  await p.evaluate(() => document.getElementById('btnToggleAdminMode').click());
  await p.waitForTimeout(600);
  const volta = await p.evaluate(() => [...document.querySelectorAll('.nav-menu .tab-btn')].filter(x => getComputedStyle(x).display !== 'none').length);
  ok(volta > 5, 'voltar traz as abas normais de volta', volta);
  ok(erros.length === 0, 'sem erro de JS', erros.join(' | '));
  await p.close();
}

console.log('\n=== cartão da Planilha Finn (Configurações) ===');
{
  const { p, erros } = await abrir('user@x.com');
  await p.evaluate(async () => {
    document.getElementById('btnConfigNav').click();
    await new Promise(r => setTimeout(r, 500));
  });
  const tem = await p.evaluate(() => !!document.getElementById('btnPlanilhaGerar'));
  ok(tem, 'usuário comum vê o cartão da planilha (não é recurso de admin)');

  ULTIMA_PLANILHA = null;
  await p.evaluate(() => document.getElementById('btnPlanilhaGerar').click());
  await p.waitForTimeout(800);
  ok(!!ULTIMA_PLANILHA && ULTIMA_PLANILHA.metodo === 'POST', 'gerar chama POST /sheets/token', ULTIMA_PLANILHA && ULTIMA_PLANILHA.metodo);
  ok(/access_token/.test((ULTIMA_PLANILHA && ULTIMA_PLANILHA.corpo) || ''), 'manda a sessão do Supabase');

  const est = await p.evaluate(() => ({
    txt: document.getElementById('content').innerText,
    temTrocar: !!document.getElementById('btnPlanilhaTrocar'),
    temRevogar: !!document.getElementById('btnPlanilhaRevogar'),
  }));
  ok(/fsh_a{10}/.test(est.txt), 'o token aparece na tela pra copiar');
  ok(est.temTrocar && est.temRevogar, 'aparecem os botões de trocar e desconectar');
  // Sem este aviso, a pessoa não tem como saber que o token dá acesso à conta.
  ok(/ler e gravar/i.test(est.txt), 'avisa o que o token permite', (est.txt.match(/[^\n]*ler e gravar[^\n]*/) || [])[0]);

  ULTIMA_PLANILHA = null;
  await p.evaluate(() => document.getElementById('btnPlanilhaRevogar').click());
  await p.waitForTimeout(800);
  ok(ULTIMA_PLANILHA && ULTIMA_PLANILHA.metodo === 'DELETE', 'desconectar chama DELETE', ULTIMA_PLANILHA && ULTIMA_PLANILHA.metodo);
  const depois = await p.evaluate(() => document.getElementById('content').innerText);
  ok(/desconectada/i.test(depois), 'e confirma na tela');
  ok(erros.length === 0, 'sem erro de JS', erros.join(' | '));
  await p.close();
}

console.log('\n=== usuário comum não vê nada de admin ===');
{
  const { p, erros } = await abrir('comum@x.com');
  const vis = await p.evaluate(() => {
    const dd = (id) => { const e = document.getElementById(id); return e ? getComputedStyle(e).display : 'ausente'; };
    return { home: dd('btnAdminHomeNav'), toggle: dd('btnToggleAdminMode'), analytics: dd('btnAdminAnalyticsNav') };
  });
  ok(vis.home === 'none' && vis.toggle === 'none' && vis.analytics === 'none', 'nenhum item de admin visível', JSON.stringify(vis));
  ok(erros.length === 0, 'sem erro de JS', erros.join(' | '));
  await p.close();
}

await b.close(); srv.close();
console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
process.exit(falhas ? 1 : 0);

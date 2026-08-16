// Sincronização da Planilha Finn <-> app.
//
// O que importa aqui não é "a rota responde 200". É que um token de planilha
// NÃO alcança a conta de outra pessoa, não vira sessão, e não aceita user_id
// vindo do cliente. O resto (formato, validação) vem depois disso.
import serve from '../finn-serve/index.js';

let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };
const realFetch = global.fetch;
const ctx = { waitUntil: (p) => p };

function novoKV(inicial) {
  const store = new Map(Object.entries(inicial || {}));
  return {
    _store: store,
    async get(k) { return store.has(k) ? store.get(k) : null; },
    async put(k, v) { store.set(k, v); },
    async delete(k) { store.delete(k); },
    async list({ prefix }) {
      return { keys: [...store.keys()].filter(k => k.startsWith(prefix || '')).map(name => ({ name })), list_complete: true };
    }
  };
}

const ENV = () => ({ FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'service-key' });

// Guarda o que foi PARA o Supabase, que é onde mora o risco de vazamento.
let ultimaChamada = null;
function mockSupabase({
  user = { id: 'u1', email: 'a@x.com' }, linhas = [], falhaRest = false,
  limites = [], contasFixas = [], dividas = [], splits = [], splitParticipants = []
} = {}) {
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) {
      // Só aceita o que parece sessão do Supabase. Aceitar qualquer string
      // faria o mock esconder justamente o que o teste quer provar: que um
      // token de planilha não vale como sessão.
      const enviado = ((opts && opts.headers && opts.headers.Authorization) || '').replace(/^Bearer\s+/i, '');
      const ehSessao = enviado.startsWith('sessao');
      return (user && ehSessao) ? new Response(JSON.stringify(user), { status: 200 })
                                : new Response('{}', { status: 401 });
    }
    if (u.includes('/rest/v1/transactions')) {
      ultimaChamada = { url: u, method: (opts && opts.method) || 'GET', body: opts && opts.body ? JSON.parse(opts.body) : null };
      if (falhaRest) return new Response('erro', { status: 500 });
      if ((opts && opts.method) === 'POST') {
        const enviados = JSON.parse(opts.body);
        return new Response(JSON.stringify(enviados.map((_, i) => ({ id: 'novo-' + (i + 1) }))), { status: 201 });
      }
      return new Response(JSON.stringify(linhas), { status: 200 });
    }
    // As quatro tabelas de configuração (Limites, Contas fixas, Dívidas,
    // Racha) que o pull junta com os lançamentos. Sem interceptar aqui, essas
    // chamadas cairiam no fetch de verdade — rede real, lenta e não
    // determinística — porque o resto do mock só conhece "transactions".
    if (u.includes('/rest/v1/spending_limits')) return new Response(JSON.stringify(limites), { status: 200 });
    if (u.includes('/rest/v1/fixed_accounts')) return new Response(JSON.stringify(contasFixas), { status: 200 });
    if (u.includes('/rest/v1/debts')) return new Response(JSON.stringify(dividas), { status: 200 });
    if (u.includes('/rest/v1/split_participants')) return new Response(JSON.stringify(splitParticipants), { status: 200 });
    if (u.includes('/rest/v1/splits')) return new Response(JSON.stringify(splits), { status: 200 });
    return realFetch(url, opts);
  };
}

const req = (caminho, opts = {}) => new Request('https://finn.dev.br' + caminho, opts);

// ══════════════════════════════════════════════════════════════════════
console.log('=== 1. criar e revogar o token da planilha ===');
let TOKEN = null;
{
  const env = ENV();
  mockSupabase();

  const semSessao = await serve.fetch(req('/sheets/token', { method: 'POST', body: '{}' }), { ...env }, ctx);
  ok(semSessao.status === 401, 'sem sessão do Supabase -> 401', semSessao.status);

  const r = await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-valida' })
  }), env, ctx);
  const j = await r.json();
  TOKEN = j.token;
  ok(r.status === 200 && !!TOKEN, 'com sessão -> devolve token');
  ok(/^fsh_[a-f0-9]{64}$/.test(TOKEN || ''), 'token tem formato próprio e 256 bits de aleatório', (TOKEN || '').slice(0, 12) + '…');

  // Trocar tem que MATAR o anterior — é o botão de "perdi minha planilha".
  const r2 = await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-valida' })
  }), env, ctx);
  const novo = (await r2.json()).token;
  ok(novo !== TOKEN, 'gerar de novo produz token diferente');
  const antigoAindaVale = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': TOKEN } }), env, ctx);
  ok(antigoAindaVale.status === 401, 'o token ANTIGO deixa de funcionar', antigoAindaVale.status);
  TOKEN = novo;

  const rev = await serve.fetch(req('/sheets/token', {
    method: 'DELETE', body: JSON.stringify({ access_token: 'sessao-valida' })
  }), env, ctx);
  ok(rev.status === 200, 'revogar -> 200');
  const depois = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': TOKEN } }), env, ctx);
  ok(depois.status === 401, 'depois de revogar, o token não abre mais nada', depois.status);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 2. o token da planilha NÃO é uma sessão ===');
{
  const env = ENV();
  mockSupabase();
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-valida' })
  }), env, ctx)).json()).token;

  // Se um token de planilha abrisse rota de admin, um vazamento da planilha
  // viraria vazamento do painel inteiro.
  const admin = await serve.fetch(req('/admin/analytics', { headers: { 'X-Sheet-Token': t, Authorization: 'Bearer ' + t } }), env, ctx);
  ok(admin.status !== 200, 'não abre /admin/analytics', admin.status);

  const comoSessao = await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: t })
  }), env, ctx);
  ok(comoSessao.status === 401, 'não vale como access_token do Supabase', comoSessao.status);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 3. token lixo / forjado ===');
{
  const env = ENV();
  mockSupabase();
  for (const [nome, valor] of [
    ['vazio', ''],
    ['sem prefixo', 'a'.repeat(64)],
    ['prefixo certo, hex curto', 'fsh_abc'],
    ['prefixo certo, tamanho certo, inexistente', 'fsh_' + 'a'.repeat(64)],
    ['com caractere fora do hex', 'fsh_' + 'z'.repeat(64)],
  ]) {
    const r = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': valor } }), env, ctx);
    ok(r.status === 401, nome + ' -> 401', r.status);
  }
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4. pull traz só o dono do token ===');
{
  const env = ENV();
  mockSupabase({ user: { id: 'u-ana' }, linhas: [{ id: 't1', date: '2026-08-01', type: 'despesa', category: 'Lazer', description: 'x', value: 10 }] });
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env, ctx)).json()).token;

  ultimaChamada = null;
  const r = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': t } }), env, ctx);
  const j = await r.json();
  ok(r.status === 200 && j.total === 1, 'pull -> 200 com os lançamentos', j.total);
  ok(/user_id=eq\.u-ana/.test(ultimaChamada.url), 'filtra pelo dono do TOKEN', ultimaChamada.url.split('?')[1].slice(0, 40));

  // ?desde só entra na consulta se for data de verdade — senão vira injeção
  // de filtro no PostgREST.
  ultimaChamada = null;
  await serve.fetch(req('/sheets/pull?desde=2026-01-01', { headers: { 'X-Sheet-Token': t } }), env, ctx);
  ok(/date=gte\.2026-01-01/.test(ultimaChamada.url), 'desde válido entra no filtro');

  ultimaChamada = null;
  await serve.fetch(req('/sheets/pull?desde=' + encodeURIComponent('2026-01-01&user_id=neq.x'), { headers: { 'X-Sheet-Token': t } }), env, ctx);
  ok(!/neq/.test(ultimaChamada.url), 'desde malformado é DESCARTADO, não repassado', ultimaChamada.url.split('?')[1].slice(0, 60));
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4b. pull também traz Limites, Contas fixas, Dívidas e Racha ===');
{
  const env = ENV();
  mockSupabase({
    user: { id: 'u-ana' },
    linhas: [],
    limites: [{ category: 'Lazer', monthly_limit: 300 }],
    contasFixas: [{ type: 'despesa', description: 'Netflix', category: 'Lazer', value: 39.9, day_of_month: 10 }],
    dividas: [{ name: 'Cartão', category: 'Outros', total_value: 3000, remaining_value: 2200, interest_rate: 2.5, monthly_payment: 400 }],
    splits: [{ id: 's1', description: 'Churrasco', category: 'Lazer', total_value: 240, date: '2026-08-09' }],
    splitParticipants: [
      { split_id: 's1', name: 'Ana', paid: true },
      { split_id: 's1', name: 'Bruno', paid: false },
      { split_id: 'outro-split-que-nao-veio', name: 'Fantasma', paid: false },
    ]
  });
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env, ctx)).json()).token;

  const j = await (await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': t } }), env, ctx)).json();
  ok(j.limites && j.limites.length === 1 && j.limites[0].category === 'Lazer' && j.limites[0].monthly_limit === 300,
     'traz os limites por categoria', JSON.stringify(j.limites));
  ok(j.contasFixas && j.contasFixas.length === 1 && j.contasFixas[0].description === 'Netflix',
     'traz as contas fixas', JSON.stringify(j.contasFixas));
  ok(j.dividas && j.dividas.length === 1 && j.dividas[0].name === 'Cartão' && j.dividas[0].remaining_value === 2200,
     'traz as dívidas', JSON.stringify(j.dividas));
  ok(j.racha && j.racha.length === 1 && j.racha[0].description === 'Churrasco',
     'traz a racha', JSON.stringify(j.racha));
  ok(j.racha[0].participantes.length === 2 &&
     j.racha[0].participantes.some(p => p.name === 'Ana' && p.paid === true) &&
     j.racha[0].participantes.some(p => p.name === 'Bruno' && p.paid === false),
     'agrupa os participantes certos dentro do split certo, com quem já pagou', JSON.stringify(j.racha[0].participantes));

  // Falha numa tabela de configuração não pode derrubar o pull inteiro: os
  // lançamentos continuam sendo a parte essencial da sincronização.
  const env2 = ENV();
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'u-ana' }), { status: 200 });
    if (u.includes('/rest/v1/transactions')) {
      return new Response(JSON.stringify([{ id: 't1', date: '2026-08-01', type: 'despesa', category: 'Lazer', description: 'x', value: 10 }]), { status: 200 });
    }
    if (u.includes('/rest/v1/spending_limits')) return new Response('erro', { status: 500 });
    return new Response('[]', { status: 200 });
  };
  const t2 = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env2, ctx)).json()).token;
  const r2 = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': t2 } }), env2, ctx);
  const j2 = await r2.json();
  ok(r2.status === 200 && j2.total === 1, 'limites fora do ar não derruba o pull dos lançamentos', r2.status);
  ok(Array.isArray(j2.limites) && j2.limites.length === 0, 'e devolve limites vazio nesse caso, não erro');
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 5. push grava na conta do token, nunca na do corpo ===');
{
  const env = ENV();
  mockSupabase({ user: { id: 'u-ana' } });
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env, ctx)).json()).token;

  ultimaChamada = null;
  const r = await serve.fetch(req('/sheets/push', {
    method: 'POST', headers: { 'X-Sheet-Token': t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lancamentos: [
      // user_id do OUTRO no corpo: o servidor tem que ignorar
      { user_id: 'u-vitima', date: '2026-08-10', type: 'despesa', category: 'Lazer', description: 'Cinema', value: 42.5 },
      { date: '2026-08-11', type: 'receita', category: 'Salário', description: 'Salário', value: 4200 },
    ] })
  }), env, ctx);
  const j = await r.json();
  ok(r.status === 200 && j.gravados === 2, 'grava as 2 linhas', j.gravados);
  ok(j.ids.length === 2 && j.ids[0] === 'novo-1', 'devolve os ids na ordem recebida', JSON.stringify(j.ids));
  ok(ultimaChamada.body.every(l => l.user_id === 'u-ana'), 'TODAS as linhas gravadas com o dono do token');
  ok(!JSON.stringify(ultimaChamada.body).includes('u-vitima'), 'o user_id que veio no corpo foi ignorado');
  ok(ultimaChamada.body[0].value === 42.5, 'valor preservado', ultimaChamada.body[0].value);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 6. push recusa linha inválida antes de gravar qualquer coisa ===');
{
  const env = ENV();
  mockSupabase({ user: { id: 'u-ana' } });
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env, ctx)).json()).token;

  const casos = [
    ['data em branco', { date: '', type: 'despesa', value: 10 }, /data/i],
    ['data fora do formato', { date: '10/08/2026', type: 'despesa', value: 10 }, /data/i],
    ['tipo inventado', { date: '2026-08-10', type: 'transferencia', value: 10 }, /tipo/i],
    ['valor negativo', { date: '2026-08-10', type: 'despesa', value: -5 }, /valor/i],
    ['valor não numérico', { date: '2026-08-10', type: 'despesa', value: 'abc' }, /valor/i],
  ];
  for (const [nome, linha, esperado] of casos) {
    ultimaChamada = null;
    const r = await serve.fetch(req('/sheets/push', {
      method: 'POST', headers: { 'X-Sheet-Token': t, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lancamentos: [linha] })
    }), env, ctx);
    const j = await r.json();
    ok(r.status === 400 && esperado.test(j.error || ''), nome + ' -> 400 explicando', j.error);
    ok(ultimaChamada === null, '  e nada foi gravado');
  }

  // Uma linha ruim no meio invalida o lote inteiro — gravar metade deixaria a
  // planilha e o app divergentes, que é o pior estado possível aqui.
  ultimaChamada = null;
  const r = await serve.fetch(req('/sheets/push', {
    method: 'POST', headers: { 'X-Sheet-Token': t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lancamentos: [
      { date: '2026-08-10', type: 'despesa', category: 'Lazer', value: 10 },
      { date: 'xx', type: 'despesa', value: 10 },
    ] })
  }), env, ctx);
  ok(r.status === 400, 'lote com uma linha ruim -> 400', r.status);
  ok(ultimaChamada === null, 'e NENHUMA linha do lote foi gravada (tudo ou nada)');
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 7. limites de tamanho e de frequência ===');
{
  const env = ENV();
  mockSupabase({ user: { id: 'u-ana' } });
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao-ana' })
  }), env, ctx)).json()).token;

  const muitas = Array.from({ length: 501 }, () => ({ date: '2026-08-10', type: 'despesa', category: 'Lazer', value: 1 }));
  const r = await serve.fetch(req('/sheets/push', {
    method: 'POST', headers: { 'X-Sheet-Token': t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lancamentos: muitas })
  }), env, ctx);
  ok(r.status === 400, '501 linhas de uma vez -> 400', r.status);

  const vazio = await serve.fetch(req('/sheets/push', {
    method: 'POST', headers: { 'X-Sheet-Token': t, 'Content-Type': 'application/json' },
    body: JSON.stringify({ lancamentos: [] })
  }), env, ctx);
  const jv = await vazio.json();
  ok(vazio.status === 200 && jv.gravados === 0, 'lote vazio -> 200 sem gravar nada');

  // 120 chamadas/hora por conta: sincronizar de 5 em 5 min cabe folgado,
  // varredura automatizada não.
  let bateu = false;
  for (let i = 0; i < 130; i++) {
    const rr = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': t } }), env, ctx);
    if (rr.status === 429) { bateu = true; break; }
  }
  ok(bateu, 'excesso de sincronização -> 429');
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 8. CORS: o Apps Script chama de fora ===');
{
  const env = ENV();
  const pre = await serve.fetch(req('/sheets/push', { method: 'OPTIONS' }), env, ctx);
  const h = (pre.headers.get('Access-Control-Allow-Headers') || '').toLowerCase();
  ok(pre.status === 204, 'preflight -> 204', pre.status);
  ok(pre.headers.get('Access-Control-Allow-Origin') === '*', 'Allow-Origin liberado');
  ok(h.includes('x-sheet-token'), 'X-Sheet-Token liberado no preflight', h);
}


// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 9. plano avulso da Planilha ===');
{
  let planoAtual = 'free';
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) {
      const t = ((opts && opts.headers && opts.headers.Authorization) || '').replace(/^Bearer\s+/i, '');
      return t.startsWith('sessao') ? new Response(JSON.stringify({ id: 'u1', email: 'a@x.com' }), { status: 200 })
                                    : new Response('{}', { status: 401 });
    }
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([{ plan: planoAtual, status: 'active' }]), { status: 200 });
    if (u.includes('/rest/v1/transactions')) return new Response('[]', { status: 200 });
    if (u.includes('api.mercadopago.com/preapproval')) return new Response(JSON.stringify({ init_point: 'https://mp/x' }), { status: 200 });
    return realFetch(url, opts);
  };
  // MP configurado de proposito: sem isso o handler para no "pagamentos nao
  // configurados" antes de validar o plano, e o teste nao provaria nada.
  const env = { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'sk', MP_ACCESS_TOKEN: 'mp' };
  // 'planilha' saiu da lista de PLANOS: virou compra única, com rota própria.
  for (const [plano, aceito] of [['plus', true], ['pro', true], ['planilha', false], ['ouro', false]]) {
    const r = await serve.fetch(req('/billing/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: 'sessao', plan: plano })
    }), env, ctx);
    const j = await r.json().catch(() => ({}));
    const reconhecido = !/inv[aá]lido/i.test(j.error || '');
    ok(reconhecido === aceito, `plano "${plano}" ${aceito ? 'é aceito' : 'é recusado'}`, j.error || r.status);
  }

  // Durante o beta todo mundo sincroniza — mesmo comportamento da IA.
  const t = (await (await serve.fetch(req('/sheets/token', {
    method: 'POST', body: JSON.stringify({ access_token: 'sessao' })
  }), env, ctx)).json()).token;
  const r = await serve.fetch(req('/sheets/pull', { headers: { 'X-Sheet-Token': t } }), env, ctx);
  ok(r.status === 200, 'durante o beta, plano free ainda sincroniza', r.status);
  global.fetch = realFetch;
}


// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 10. download da planilha é o produto pago ===');
{
  let comprou = false;
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) {
      const t = ((opts && opts.headers && opts.headers.Authorization) || '').replace(/^Bearer\s+/i, '');
      return t.startsWith('sessao') ? new Response(JSON.stringify({ id: 'u1', email: 'a@x.com' }), { status: 200 })
                                    : new Response('{}', { status: 401 });
    }
    if (u.includes('spreadsheet_purchases')) return new Response(JSON.stringify(comprou ? [{ user_id: 'u1' }] : []), { status: 200 });
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([{ plan: 'free', status: 'active' }]), { status: 200 });
    return realFetch(url, opts);
  };
  const env = { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'sk', PLANILHA_COPY_URL: 'https://docs.google.com/spreadsheets/d/XYZ/copy' };

  // Sem sessão não baixa: a rota É o produto.
  const semSessao = await serve.fetch(req('/planilha/baixar'), env, ctx);
  ok(semSessao.status === 401, 'sem sessão -> 401', semSessao.status);

  const r = await serve.fetch(req('/planilha/baixar?access_token=sessao'), env, ctx);
  ok(r.status === 200, 'com sessão válida -> 200 (beta libera)', r.status);
  ok((r.headers.get('Content-Type') || '').includes('spreadsheetml'), 'devolve um .xlsx de verdade', r.headers.get('Content-Type'));
  ok(/attachment; filename="Planilha-Finn\.xlsx"/.test(r.headers.get('Content-Disposition') || ''), 'força download com nome certo');
  ok(/no-store/.test(r.headers.get('Cache-Control') || ''), 'produto pago não fica em cache', r.headers.get('Cache-Control'));
  const bytes = new Uint8Array(await r.arrayBuffer());
  // PK = assinatura de zip, que é o que um xlsx é por dentro.
  ok(bytes[0] === 0x50 && bytes[1] === 0x4B, 'o corpo é mesmo um arquivo xlsx', bytes.slice(0, 2).join(','));
  ok(bytes.length > 40000, 'e tem o tamanho da planilha inteira', bytes.length);

  // Status: o link de cópia só aparece pra quem tem direito.
  const st = await (await serve.fetch(req('/billing/planilha-status?access_token=sessao'), env, ctx)).json();
  ok(st.preco === 36.9, 'preço é R$ 36,90', st.preco);
  ok(st.copia === 'https://docs.google.com/spreadsheets/d/XYZ/copy', 'devolve o link de cópia do Google Sheets', st.copia);
  ok(st.comprou === false, 'e diz que ainda não comprou', st.comprou);

  comprou = true;
  const st2 = await (await serve.fetch(req('/billing/planilha-status?access_token=sessao'), env, ctx)).json();
  ok(st2.comprou === true, 'depois da compra, comprou=true');

  // Comprar de novo não cobra de novo.
  const dupla = await serve.fetch(req('/billing/comprar-planilha', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: 'sessao' })
  }), { ...env, MP_ACCESS_TOKEN: 'mp' }, ctx);
  ok(dupla.status === 409, 'quem já comprou recebe 409, não uma segunda cobrança', dupla.status);
  global.fetch = realFetch;
}


// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 11. o link da planilha se configura pelo painel, sem terminal ===');
{
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) {
      const t = ((opts && opts.headers && opts.headers.Authorization) || '').replace(/^Bearer\s+/i, '');
      if (t === 'master') return new Response(JSON.stringify({ id: 'm1', email: 'finn.controle01@gmail.com' }), { status: 200 });
      if (t === 'zé') return new Response(JSON.stringify({ id: 'u9', email: 'ze@x.com' }), { status: 200 });
      return new Response('{}', { status: 401 });
    }
    if (u.includes('spreadsheet_purchases')) return new Response(JSON.stringify([{ user_id: 'u1' }]), { status: 200 });
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([{ plan: 'free', status: 'active' }]), { status: 200 });
    return realFetch(url, opts);
  };
  const env = { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'sk', MASTER_ADMIN_PASSWORD: 'senha-master' };
  const comoMaster = (extra) => ({ 'Authorization': 'Bearer master', 'X-Admin-Password': 'senha-master', ...(extra || {}) });
  const salvar = (link, headers) => serve.fetch(req('/admin/planilha-link', {
    method: 'POST', headers: headers || comoMaster({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ url: link })
  }), env, ctx);

  // A rota escreve o que o produto entrega — precisa do mesmo gate do resto.
  const anon = await serve.fetch(req('/admin/planilha-link'), env, ctx);
  ok(anon.status === 403, 'sem credencial -> 403', anon.status);
  const outro = await salvar('https://docs.google.com/spreadsheets/d/ABCDEFGHIJKLMNOPQRSTU/edit',
    { 'Authorization': 'Bearer zé', 'X-Admin-Password': 'senha-master', 'Content-Type': 'application/json' });
  ok(outro.status === 403, 'usuário comum não configura o link -> 403', outro.status);

  // O ponto do recurso: o link que o celular copia termina em
  // /edit?usp=drivesdk. Entregar ESSE link ao comprador dá a ele acesso de
  // leitura à planilha-mestre em vez de uma cópia. O servidor conserta.
  const doCelular = 'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/edit?usp=drivesdk&ouid=114155652725311049065';
  const j1 = await (await salvar(doCelular)).json();
  ok(j1.ok === true, 'aceita o link do "Compartilhar" do celular', j1.error);
  ok(j1.url === 'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/copy',
     'e converte pra /copy sozinho', j1.url);
  ok(/compartilhad/i.test(j1.aviso || ''), 'lembra do passo que o código não faz (compartilhar)', j1.aviso);

  // Já em /copy, ou com /edit no meio do caminho: mesmo resultado.
  for (const variante of [
    'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/copy',
    'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/edit#gid=0',
    '  https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/edit  ',
  ]) {
    const jv = await (await salvar(variante)).json();
    ok(jv.url === 'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/copy',
       'normaliza tambem: ' + variante.trim().slice(0, 58), jv.url);
  }

  // Link errado tem que ser recusado NA HORA. Se passasse, o erro só
  // apareceria quando um comprador clicasse e não abrisse nada.
  for (const ruim of ['https://drive.google.com/file/d/ABCDEFGHIJKLMNOPQRSTU/view', 'sei lá', 'https://docs.google.com/document/d/ABCDEFGHIJKLMNOPQRSTU/edit']) {
    const rr = await salvar(ruim);
    const jr = await rr.json();
    ok(rr.status === 400 && !!jr.error, 'recusa link que não é planilha: ' + ruim.slice(0, 40), jr.error && jr.error.slice(0, 40));
  }

  // Configurado pelo painel, o link tem que chegar ao comprador.
  const st = await (await serve.fetch(req('/billing/planilha-status?access_token=master'), env, ctx)).json();
  ok(st.copia === 'https://docs.google.com/spreadsheets/d/1hYpQDNKVr3QnT-r8jFDG3V/copy',
     'o comprador recebe o link salvo no painel', st.copia);

  // O painel ganha da secret: é ele que dá pra corrigir pelo celular.
  const comSecret = { ...env, PLANILHA_COPY_URL: 'https://docs.google.com/spreadsheets/d/VELHOVELHOVELHOVELHO/copy' };
  const st2 = await (await serve.fetch(req('/billing/planilha-status?access_token=master'), comSecret, ctx)).json();
  ok(/1hYpQDNKVr3QnT-r8jFDG3V/.test(st2.copia || ''), 'painel vence a secret antiga', st2.copia);

  // Apagar volta pra secret — senão não haveria como desfazer sem terminal.
  const jz = await (await salvar('')).json();
  ok(jz.ok === true, 'campo vazio apaga o link do painel', jz.error);
  const st3 = await (await serve.fetch(req('/billing/planilha-status?access_token=master'), comSecret, ctx)).json();
  ok(st3.copia === 'https://docs.google.com/spreadsheets/d/VELHOVELHOVELHOVELHO/copy',
     'e a secret volta a valer', st3.copia);
  const st4 = await (await serve.fetch(req('/billing/planilha-status?access_token=master'), env, ctx)).json();
  ok(st4.copia === null, 'sem painel e sem secret, copia=null (só o .xlsx)', st4.copia);
  global.fetch = realFetch;
}

console.log('\n' + (falhas === 0 ? '✅ tudo passou' : `❌ ${falhas} falha(s)`));
process.exit(falhas === 0 ? 0 : 1);

// Cobre os 5 achados da varredura que faltavam:
//  1. leitura dupla no /sync perdendo lançamento do bot
//  2. chat id negativo (grupo do Telegram) nunca sincronizava
//  3. categoria DIGITADA em vez de tocada na lista
//  4. /admin/analytics sem teto (+ aviso de truncamento)
//  5. vazamentos de mensagem de erro
import bot from '../finn-worker/index.js';
import serve from '../finn-serve/index.js';

let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };
const realFetch = global.fetch;

function novoKV(inicial) {
  const store = new Map(Object.entries(inicial || {}));
  return {
    _store: store,
    async get(k) { return store.has(k) ? store.get(k) : null; },
    async put(k, v) { store.set(k, v); },
    async delete(k) { store.delete(k); },
    async list({ prefix }) {
      const all = [...store.keys()].filter(k => k.startsWith(prefix || ''));
      return { keys: all.map(name => ({ name })), list_complete: true, cursor: undefined };
    }
  };
}
const ctx = { waitUntil: (p) => p };

// ══════════════════════════════════════════════════════════════════════
console.log('=== 1. /sync não pode perder lançamento gravado pelo bot no meio ===');
{
  // KV começa com 1 tx do bot. O app manda uma foto ANTIGA (sem ela).
  // Antes: saveUserData relia o KV e o {...existing,...data} devolvia a foto
  // antiga por cima — a tx do bot sumia.
  const txBot = { id: 'bot-1', val: -50, desc: 'Lançado pelo WhatsApp', cat: 'Outros', date: '2026-08-09' };
  const txApp = { id: 'app-1', val: -20, desc: 'Do app', cat: 'Outros', date: '2026-08-09' };
  const kv = novoKV({
    'data_5511999999999': JSON.stringify({ phone: '5511999999999', txs: [txBot], limits: {}, goals: [] }),
    'wa_owner_5511999999999': 'u1',
  });
  const env = { FINN_KV: kv };
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'u1', email: 'a@x.com', user_metadata: { whatsapp: '5511999999999', daily_dashboard_optin: false } }), { status: 200 });
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([]), { status: 200 });
    return realFetch(url, opts);
  };
  const r = await bot.fetch(new Request('https://x/sync', {
    method: 'POST',
    body: JSON.stringify({ phone: '5511999999999', access_token: 'tok', data: { txs: [txApp], limits: {}, goals: [] } })
  }), env, ctx);
  ok(r.status === 200, '/sync -> 200', r.status);
  const salvo = JSON.parse(kv._store.get('data_5511999999999'));
  const ids = (salvo.txs || []).map(t => t.id).sort();
  ok(ids.includes('bot-1'), 'o lançamento do BOT sobreviveu ao sync do app', JSON.stringify(ids));
  ok(ids.includes('app-1'), 'o lançamento do APP também está lá', JSON.stringify(ids));
  ok(ids.length === 2, 'exatamente os 2, sem duplicar', ids.length);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 2. chat id negativo (grupo do Telegram) ===');
{
  const CHAT = '-1001234567890';
  const kv = novoKV({
    ['tgchat_' + CHAT]: JSON.stringify({ email: 'a@x.com', uid: 'u1', linkedAt: 1 }),
    ['data_tg:' + CHAT]: JSON.stringify({ phone: 'tg:' + CHAT, txs: [], limits: {}, goals: [] }),
  });
  const env = { FINN_KV: kv };
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'u1', email: 'a@x.com', user_metadata: { telegram_chat_id: CHAT } }), { status: 200 });
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([]), { status: 200 });
    return realFetch(url, opts);
  };
  const r = await bot.fetch(new Request('https://x/sync', {
    method: 'POST',
    body: JSON.stringify({ telegram_chat_id: CHAT, access_token: 'tok', data: { txs: [{ id: 'g1', val: -10, desc: 'x', cat: 'Outros', date: '2026-08-09' }], limits: {}, goals: [] } })
  }), env, ctx);
  ok(r.status === 200, 'grupo (id negativo) consegue sincronizar', r.status + ' ' + (r.status !== 200 ? await r.text() : ''));
  ok(kv._store.has('data_tg:' + CHAT), 'gravou na chave com o sinal preservado');

  // e continua rejeitando quem não é dono
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'INTRUSO', email: 'b@x.com', user_metadata: { telegram_chat_id: CHAT } }), { status: 200 });
    if (u.includes('/rest/v1/subscriptions')) return new Response(JSON.stringify([]), { status: 200 });
    return realFetch(url, opts);
  };
  const r2 = await bot.fetch(new Request('https://x/sync', {
    method: 'POST',
    body: JSON.stringify({ telegram_chat_id: CHAT, access_token: 'tok', data: { txs: [], limits: {}, goals: [] } })
  }), env, ctx);
  ok(r2.status === 403, 'intruso apontando o metadata pro mesmo grupo continua barrado (IDOR fechado)', r2.status);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 3. categoria DIGITADA em vez de tocada ===');
{
  const enviados = [];
  const kv = novoKV({
    'data_5511888888888': JSON.stringify({ phone: '5511888888888', txs: [], limits: {}, goals: [] }),
    'state_5511888888888': JSON.stringify({ state: 'awaiting_cat_despesa', pending: { val: -45.9 } }),
    // O processMessage exige numero JA VINCULADO (portao contra uso anonimo do
    // bot). Sem semear o registro de posse, toda mensagem para em "conecte
    // este numero" e o fluxo nunca e exercitado.
    'wa_owner_5511888888888': 'u1',
  });
  // O webhook exige assinatura HMAC valida (X-Hub-Signature-256) — sem ela o
  // handler devolve 403 e nada roda. Assina de verdade em vez de furar o gate.
  const APP_SECRET = 'segredo-de-teste';
  const env = { FINN_KV: kv, WHATSAPP_PHONE_NUMBER_ID: 'p', WHATSAPP_ACCESS_TOKEN: 't', META_APP_SECRET: APP_SECRET };
  async function assina(corpo) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(APP_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(corpo));
    return 'sha256=' + [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  async function manda(txt) {
    const corpo = JSON.stringify(payload(txt));
    return bot.fetch(new Request('https://x/webhook', {
      method: 'POST', body: corpo, headers: { 'X-Hub-Signature-256': await assina(corpo) }
    }), env, ctx);
  }
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('graph.facebook.com')) { enviados.push(JSON.parse(opts.body)); return new Response(JSON.stringify({ messages: [{ id: 'w' }] }), { status: 200 }); }
    return realFetch(url, opts);
  };
  const payload = (txt) => ({ object: 'whatsapp_business_account', entry: [{ changes: [{ field: 'messages', value: { messages: [{ id: 'm' + Date.now() + Math.random(), from: '5511888888888', type: 'text', text: { body: txt } }] } }] }] });

  await manda('Alimentação');
  const st = JSON.parse(kv._store.get('state_5511888888888') || '{}');
  ok(st.state === 'awaiting_desc_despesa', 'digitar "Alimentação" avança pro passo da descrição', st.state);
  ok(st.pending && st.pending.cat === 'Alimentação', 'categoria foi gravada', st.pending && st.pending.cat);
  ok(st.pending && Number(st.pending.val) === -45.9, 'o VALOR já informado não se perdeu', st.pending && st.pending.val);
  ok(!JSON.stringify(enviados).includes('Algo deu errado'), 'não mostra "Algo deu errado"');

  // sem acento e em caixa baixa também casa
  kv._store.set('state_5511888888888', JSON.stringify({ state: 'awaiting_cat_despesa', pending: { val: -10 } }));
  enviados.length = 0;
  await manda('alimentacao');
  const st2 = JSON.parse(kv._store.get('state_5511888888888') || '{}');
  ok(st2.state === 'awaiting_desc_despesa', '"alimentacao" (sem acento, minúsculo) também casa', st2.state);

  // categoria inexistente: repete a lista SEM perder o valor
  kv._store.set('state_5511888888888', JSON.stringify({ state: 'awaiting_cat_despesa', pending: { val: -77 } }));
  enviados.length = 0;
  await manda('categoria que nao existe');
  const st3 = JSON.parse(kv._store.get('state_5511888888888') || '{}');
  ok(st3.state === 'awaiting_cat_despesa', 'categoria desconhecida mantém o passo (não reinicia)', st3.state);
  ok(st3.pending && Number(st3.pending.val) === -77, 'e mantém o valor informado', st3.pending && st3.pending.val);
  ok(JSON.stringify(enviados).includes('Não reconheci'), 'avisa que não reconheceu e repete a lista');
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4. /admin/analytics: teto e aviso de truncamento ===');
{
  let urlTx = null;
  global.fetch = async (url, opts) => {
    const u = String(url);
    const J = (o) => new Response(JSON.stringify(o), { status: 200 });
    if (u.includes('/auth/v1/user')) return J({ id: 'u3', email: 'finn.controle01@gmail.com', user_metadata: {} });
    if (u.includes('/auth/v1/admin/users')) return J({ users: [{ id: 'u1', email: 'a@x.com', created_at: '2026-07-01T10:00:00Z', user_metadata: {} }] });
    if (u.includes('/rest/v1/transactions')) { urlTx = u; return J([]); }
    if (u.includes('/rest/v1/')) return J([]);
    return realFetch(url, opts);
  };
  const r = await serve.fetch(new Request('https://finn.dev.br/admin/analytics', {
    headers: { Authorization: 'Bearer tok', 'X-Admin-Password': 'senha' }
  }), { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'k', MASTER_ADMIN_PASSWORD: 'senha' }, ctx);
  const body = await r.json();
  ok(r.status === 200 && body.ok, 'responde 200', r.status);
  ok(urlTx && /limit=\d+/.test(urlTx), 'consulta de transações agora tem limite explícito', urlTx);
  ok(body.truncado === false, 'com poucos dados, truncado=false', body.truncado);
  ok(typeof body.limite_lancamentos === 'number', 'informa qual é o limite aplicado', body.limite_lancamentos);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4b. /admin/ai-usage: agregação por modelo e "saldo" honesto ===');
{
  const logRows = [
    { user_id: 'u1', model: 'claude-haiku-4-5-20251001', input_tokens: 1000, output_tokens: 200, cost_estimate: 0.002, created_at: '2026-08-15T10:00:00Z' },
    { user_id: 'u1', model: 'claude-haiku-4-5-20251001', input_tokens: 500, output_tokens: 100, cost_estimate: 0.001, created_at: '2026-08-16T10:00:00Z' },
    { user_id: 'u2', model: 'claude-3-5-haiku-20241022', input_tokens: 2000, output_tokens: 400, cost_estimate: 0.0032, created_at: '2026-08-16T11:00:00Z' },
  ];
  global.fetch = async (url, opts) => {
    const u = String(url);
    const J = (o) => new Response(JSON.stringify(o), { status: 200 });
    if (u.includes('/auth/v1/user')) return J({ id: 'u3', email: 'finn.controle01@gmail.com', user_metadata: {} });
    if (u.includes('/rest/v1/ai_usage_log')) return J(logRows);
    return realFetch(url, opts);
  };
  // Sem credencial nenhuma -> 403, nunca vaza dado de custo por chamada.
  const semAuth = await serve.fetch(new Request('https://finn.dev.br/admin/ai-usage'), { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'k', MASTER_ADMIN_PASSWORD: 'senha' }, ctx);
  ok(semAuth.status === 403, 'sem credencial de admin -> 403', semAuth.status);

  const r = await serve.fetch(new Request('https://finn.dev.br/admin/ai-usage', {
    headers: { Authorization: 'Bearer tok', 'X-Admin-Password': 'senha' }
  }), { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'k', MASTER_ADMIN_PASSWORD: 'senha' }, ctx);
  const body = await r.json();
  ok(r.status === 200 && body.ok, 'com credencial certa -> 200', r.status);
  ok(body.total_chamadas === 3, 'conta as 3 chamadas do log', body.total_chamadas);
  ok(Math.abs(body.custo_total_estimado - 0.0062) < 1e-9, 'soma o custo estimado das 3 linhas', body.custo_total_estimado);
  ok(Math.abs(body.custo_medio_por_chamada - 0.0062 / 3) < 1e-9, 'custo médio = total / chamadas', body.custo_medio_por_chamada);
  ok(body.por_modelo['claude-haiku-4-5-20251001'].chamadas === 2, 'agrupa por modelo (2 chamadas do haiku 4.5)', body.por_modelo['claude-haiku-4-5-20251001']);
  ok(body.por_modelo['claude-3-5-haiku-20241022'].chamadas === 1, 'e 1 chamada do haiku 3.5', body.por_modelo['claude-3-5-haiku-20241022']);
  ok(body.saldo_disponivel === false, 'nunca finge saber o saldo da conta Anthropic', body.saldo_disponivel);
  ok(typeof body.saldo_nota === 'string' && body.saldo_nota.length > 0, 'explica por que o saldo não aparece', body.saldo_nota);
  ok(Array.isArray(body.recentes) && body.recentes.length === 3, 'devolve as chamadas recentes pra auditoria', body.recentes.length);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4c. /ai grava o log de uso (base do painel de admin) ===');
{
  // waitUntil precisa ser capturado e aguardado: o log é escrito depois da
  // resposta sair (ver comentário "fora do caminho crítico" no /ai), então
  // sem isso o teste checaria o mock antes da escrita acontecer.
  let logBody = null;
  const localCtx = { waitUntil: (p) => { localCtx._p = p; } };
  global.fetch = async (url, opts) => {
    const u = String(url);
    const J = (o) => new Response(JSON.stringify(o), { status: 200 });
    if (u.includes('/auth/v1/user')) return J({ id: 'u1', email: 'a@x.com' });
    if (u.includes('/rest/v1/subscriptions')) return J([{ plan: 'pro', status: 'active' }]);
    if (u.includes('api.anthropic.com')) {
      return J({ id: 'msg_1', content: [{ type: 'text', text: 'oi' }], usage: { input_tokens: 300, output_tokens: 50 } });
    }
    if (u.includes('/rest/v1/ai_usage_log') && opts && opts.method === 'POST') {
      logBody = JSON.parse(opts.body);
      return J(logBody);
    }
    return realFetch(url, opts);
  };
  const env = { FINN_KV: novoKV(), SUPABASE_SERVICE_KEY: 'k', ANTHROPIC_API_KEY: 'ak' };
  const r = await serve.fetch(new Request('https://finn.dev.br/ai', {
    method: 'POST', headers: { Origin: 'https://finn.dev.br', 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: 'tok', model: 'claude-haiku-4-5-20251001', messages: [{ role: 'user', content: 'oi' }] })
  }), env, localCtx);
  ok(r.status === 200, '/ai responde 200 pro pedido normal', r.status);
  if (localCtx._p) await localCtx._p;
  ok(logBody !== null, 'chamada bem-sucedida grava uma linha em ai_usage_log', logBody);
  if (logBody) {
    const linha = logBody[0];
    ok(linha.input_tokens === 300 && linha.output_tokens === 50, 'tokens gravados batem com o usage devolvido pela Anthropic', JSON.stringify(linha));
    ok(linha.cost_estimate > 0, 'custo estimado é calculado (não fica zerado)', linha.cost_estimate);
    ok(linha.user_id === 'u1', 'log amarrado ao usuário que pediu', linha.user_id);
  }
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 5. mensagens de erro não vazam detalhe interno ===');
{
  // /push/subscribe com corpo quebrado -> 400 e mensagem genérica
  const r = await serve.fetch(new Request('https://finn.dev.br/push/subscribe', { method: 'POST', body: '{' }), { FINN_KV: novoKV() }, ctx);
  const b = await r.json();
  ok(r.status === 400, 'corpo inválido -> 400 (era 500)', r.status);
  ok(!/JSON|Unexpected|token/i.test(JSON.stringify(b)), 'não devolve a mensagem interna do parser', JSON.stringify(b));

  // /pluggy/token sem secrets -> 503 sem dizer QUAL falta
  const r2 = await serve.fetch(new Request('https://finn.dev.br/pluggy/token', { method: 'POST', body: '{}' }), { FINN_KV: novoKV() }, ctx);
  const b2 = await r2.json();
  ok(!/PLUGGY_CLIENT_ID|PLUGGY_CLIENT_SECRET|MISSING/.test(JSON.stringify(b2)), 'não revela qual secret está faltando', JSON.stringify(b2));
}

global.fetch = realFetch;
console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
process.exit(falhas ? 1 : 0);

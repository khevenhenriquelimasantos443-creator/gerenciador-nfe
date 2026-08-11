// Cobre a publicação no Instagram: agendamento 2x/dia, guard de idempotência
// por slot, avanço da fila só em caso de sucesso, e o Story (media_type
// STORIES, sem caption, best-effort).
import serve from '../finn-serve/index.js';

let falhas = 0;
const ok = (c, n, e) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + n + (e !== undefined ? '  — ' + e : '')); if (!c) falhas++; };
const realFetch = global.fetch;

function novoKV(inicial) {
  const store = new Map(Object.entries(inicial || {}));
  return { _store: store,
    async get(k) { return store.has(k) ? store.get(k) : null; },
    async put(k, v) { store.set(k, v); },
    async delete(k) { store.delete(k); },
    async list({ prefix }) { const a = [...store.keys()].filter(k => k.startsWith(prefix || '')); return { keys: a.map(name => ({ name })), list_complete: true }; } };
}
function novoCtx() { const p = []; return { waitUntil: (x) => { p.push(x); return x; }, async fim() { await Promise.all(p); } }; }

// Mock da Graph API do Instagram: registra cada chamada e responde sucesso.
function mockIG() {
  const chamadas = [];
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('graph.instagram.com')) {
      const corpo = opts && opts.body ? JSON.parse(opts.body) : null;
      chamadas.push({ url: u, corpo });
      if (u.includes('/media_publish')) return new Response(JSON.stringify({ id: 'pub_' + chamadas.length }), { status: 200 });
      if (u.includes('status_code')) return new Response(JSON.stringify({ status_code: 'FINISHED' }), { status: 200 });
      return new Response(JSON.stringify({ id: 'container_' + chamadas.length }), { status: 200 });
    }
    return realFetch(url, opts);
  };
  return chamadas;
}

const ENV = () => ({ FINN_KV: novoKV({ ig_post_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123' });

console.log('=== cron das 10h publica feed + story ===');
{
  const env = ENV(); const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx);
  await ctx.fim();
  await new Promise(r => setTimeout(r, 300)); // story é disparado sem await

  const feeds = chamadas.filter(c => c.corpo && c.corpo.caption !== undefined);
  const stories = chamadas.filter(c => c.corpo && c.corpo.media_type === 'STORIES');
  ok(feeds.length === 1, 'criou 1 container de FEED (com caption)', feeds.length);
  ok(stories.length === 1, 'criou 1 container de STORY (media_type STORIES)', stories.length);
  ok(feeds[0] && /post-3\.png/.test(feeds[0].corpo.image_url), 'usou a imagem do índice atual da fila (3)', feeds[0] && feeds[0].corpo.image_url);
  ok(stories[0] && stories[0].corpo.caption === undefined, 'story NÃO manda caption (a Meta ignora)', stories[0] && JSON.stringify(stories[0].corpo).slice(0, 80));
  ok(env.FINN_KV._store.get('ig_post_next_index') === '4', 'fila avançou pra 4', env.FINN_KV._store.get('ig_post_next_index'));
  global.fetch = realFetch;
}

console.log('\n=== reexecução do MESMO slot não consome outro post ===');
{
  const env = ENV(); mockIG();
  const c1 = novoCtx(); await serve.scheduled({ cron: '0 13,21 * * *' }, env, c1); await c1.fim();
  const depois1 = env.FINN_KV._store.get('ig_post_next_index');
  const c2 = novoCtx(); await serve.scheduled({ cron: '0 13,21 * * *' }, env, c2); await c2.fim();
  const depois2 = env.FINN_KV._store.get('ig_post_next_index');
  ok(depois1 === '4' && depois2 === '4', 'segunda execução no mesmo slot é ignorada (fila não anda)', depois1 + ' -> ' + depois2);
  global.fetch = realFetch;
}

console.log('\n=== falha ao publicar NÃO avança a fila ===');
{
  const env = ENV();
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes('graph.instagram.com')) return new Response(JSON.stringify({ error: { message: 'token vencido' } }), { status: 401 });
    return realFetch(url);
  };
  const ctx = novoCtx(); await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  ok(env.FINN_KV._store.get('ig_post_next_index') === '3', 'índice continua em 3 — o mesmo post é retentado depois', env.FINN_KV._store.get('ig_post_next_index'));
  global.fetch = realFetch;
}

console.log('\n=== fila esgotada não quebra o cron ===');
{
  const env = { FINN_KV: novoKV({ ig_post_next_index: '999' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123' };
  const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  ok(chamadas.length === 0, 'não chama a API quando acabaram os posts', chamadas.length);
  global.fetch = realFetch;
}

console.log('\n=== sem credenciais, não tenta nada ===');
{
  const env = { FINN_KV: novoKV({ ig_post_next_index: '1' }) };
  const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  ok(chamadas.length === 0, 'sem IG_ACCESS_TOKEN/IG_BUSINESS_ACCOUNT_ID não chama a API', chamadas.length);
  global.fetch = realFetch;
}

console.log('\n=== outros crons não publicam no Instagram ===');
{
  const env = ENV(); const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 12 * * *' }, env, ctx);
  try { await ctx.fim(); } catch (e) { /* handlers de conta fixa dependem de rede */ }
  const igs = chamadas.filter(c => c.url.includes('graph.instagram.com'));
  ok(igs.length === 0, 'cron diário de contas fixas não publica no Instagram', igs.length);
  ok(env.FINN_KV._store.get('ig_post_next_index') === '3', 'fila intacta', env.FINN_KV._store.get('ig_post_next_index'));
  global.fetch = realFetch;
}

global.fetch = realFetch;
console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
process.exit(falhas ? 1 : 0);

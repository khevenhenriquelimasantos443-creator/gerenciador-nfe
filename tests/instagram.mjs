// Cobre a publicação no Instagram: agendamento 2x/dia, guard de idempotência
// por slot, avanço da fila só em caso de sucesso, e o Story (media_type
// STORIES, sem caption, best-effort).
import serve from '../finn-serve/index.js';
import bot from '../finn-worker/index.js';

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

console.log('\n=== imagens de story sao servidas em 9:16 (pelo worker do bot) ===');
{
  const ctx = novoCtx();
  // Servidas pelo finn-worker, nao pelo finn-serve: embutidas no finn-serve
  // elas estouravam o teto de 3 MiB do plano free (erro 10027 da Cloudflare).
  const r = await bot.fetch(new Request('https://bot.workers.dev/social/story-1.jpg'), { FINN_KV: novoKV() }, ctx);
  ok(r.status === 200, '/social/story-1.jpg responde 200', r.status);
  ok((r.headers.get('Content-Type') || '') === 'image/jpeg', 'Content-Type e image/jpeg', r.headers.get('Content-Type'));
  const buf = new Uint8Array(await r.arrayBuffer());
  ok(buf[0] === 0xFF && buf[1] === 0xD8, 'e um JPEG de verdade (magic FFD8)', buf.slice(0, 2).join(','));
  ok(buf.length > 20000, 'tem conteudo (nao e placeholder vazio)', Math.round(buf.length / 1024) + ' KB');

  // dimensoes 1080x1920 lidas do proprio JPEG (marcador SOF0/SOF2)
  let w = 0, h = 0;
  for (let i = 2; i < buf.length - 9; i++) {
    if (buf[i] === 0xFF && (buf[i + 1] === 0xC0 || buf[i + 1] === 0xC2)) {
      h = (buf[i + 5] << 8) | buf[i + 6];
      w = (buf[i + 7] << 8) | buf[i + 8];
      break;
    }
  }
  ok(w === 1080 && h === 1920, 'dimensoes 1080x1920 (formato nativo do Stories)', w + 'x' + h);

  const r20 = await bot.fetch(new Request('https://bot.workers.dev/social/story-20.jpg'), { FINN_KV: novoKV() }, ctx);
  ok(r20.status === 200, 'a 20a story tambem existe', r20.status);
  const r21 = await bot.fetch(new Request('https://bot.workers.dev/social/story-21.jpg'), { FINN_KV: novoKV() }, ctx);
  ok(r21.status !== 200, 'indice inexistente nao devolve imagem', r21.status);
}

console.log('\n=== o story publicado usa a imagem 9:16, nao a quadrada ===');
{
  const env = ENV(); const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx);
  await ctx.fim();
  await new Promise(r => setTimeout(r, 300));
  const story = chamadas.find(c => c.corpo && c.corpo.media_type === 'STORIES');
  ok(story && /workers\.dev\/social\/story-3\.jpg/.test(story.corpo.image_url), 'story aponta pro worker do bot', story && story.corpo.image_url);
  const feed = chamadas.find(c => c.corpo && c.corpo.caption !== undefined);
  ok(feed && /post-3\.png/.test(feed.corpo.image_url), 'feed continua na imagem quadrada', feed && feed.corpo.image_url);
  global.fetch = realFetch;
}


// ══════════════════════════════════════════════════════════════════════
// FILA DE CONTEUDO NO SUPABASE (tela "Conteudo" do admin alimenta esta fila)
// ══════════════════════════════════════════════════════════════════════

// Mock do PostgREST + Graph API juntos. `fila` e o que a consulta devolve.
function mockFilaEIG(fila) {
  const chamadas = { ig: [], patch: [] };
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/rest/v1/social_posts')) {
      if (opts && opts.method === 'PATCH') {
        chamadas.patch.push({ url: u, corpo: JSON.parse(opts.body) });
        return new Response('', { status: 204 });
      }
      return new Response(JSON.stringify(fila), { status: 200 });
    }
    if (u.includes('graph.instagram.com')) {
      const corpo = opts && opts.body ? JSON.parse(opts.body) : null;
      chamadas.ig.push({ url: u, corpo });
      if (u.includes('/media_publish')) return new Response(JSON.stringify({ id: 'pub_1' }), { status: 200 });
      if (u.includes('status_code')) return new Response(JSON.stringify({ status_code: 'FINISHED' }), { status: 200 });
      return new Response(JSON.stringify({ id: 'cont_1' }), { status: 200 });
    }
    return realFetch(url, opts);
  };
  return chamadas;
}
const ENV_FILA = () => ({
  FINN_KV: novoKV({ ig_post_next_index: '3' }),
  IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123',
  SUPABASE_SERVICE_KEY: 'svc',
});

console.log('\n=== fila do Supabase tem prioridade sobre a lista embutida ===');
{
  const env = ENV_FILA();
  const c = mockFilaEIG([{ id: 'f1', kind: 'feed', image_path: 'feed-9.png', caption: 'Legenda da fila', posicao: 1 }]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();

  const criado = c.ig.find(x => x.corpo && x.corpo.image_url);
  ok(criado && /storage\/v1\/object\/public\/social\/feed-9\.png/.test(criado.corpo.image_url), 'usou a imagem do Storage, nao a embutida', criado && criado.corpo.image_url);
  ok(criado && criado.corpo.caption === 'Legenda da fila', 'usou a legenda da fila', criado && criado.corpo.caption);
  ok(env.FINN_KV._store.get('ig_post_next_index') === '3', 'NAO consumiu a campanha embutida (indice intacto)', env.FINN_KV._store.get('ig_post_next_index'));
  const marcado = c.patch.find(x => x.corpo && x.corpo.published_at);
  ok(!!marcado, 'marcou published_at na linha da fila');
  ok(marcado && marcado.corpo.ig_media_id === 'pub_1', 'guardou o id devolvido pela Meta', marcado && marcado.corpo.ig_media_id);
  ok(marcado && /id=eq\.f1/.test(marcado.url), 'marcou a linha CERTA', marcado && marcado.url);
  global.fetch = realFetch;
}

console.log('\n=== story vindo da fila: media_type STORIES e sem caption ===');
{
  const env = ENV_FILA();
  const c = mockFilaEIG([{ id: 's1', kind: 'story', image_path: 'story-9.jpg', caption: null, posicao: 1 }]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  await new Promise(r => setTimeout(r, 200));

  const criado = c.ig.find(x => x.corpo && x.corpo.image_url);
  ok(criado && criado.corpo.media_type === 'STORIES', 'container criado como STORIES', criado && criado.corpo.media_type);
  ok(criado && criado.corpo.caption === undefined, 'story nao manda caption', criado && JSON.stringify(criado.corpo).slice(0, 90));
  // So um container: story da fila nao dispara story automatico de brinde
  const containers = c.ig.filter(x => x.corpo && x.corpo.image_url);
  ok(containers.length === 1, 'publicou UM item, sem duplicar com story automatico', containers.length);
  global.fetch = realFetch;
}

console.log('\n=== fila vazia: cai na campanha embutida ===');
{
  const env = ENV_FILA();
  const c = mockFilaEIG([]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();

  const criado = c.ig.find(x => x.corpo && x.corpo.image_url);
  ok(criado && /finn\.dev\.br\/social\/post-3\.png/.test(criado.corpo.image_url), 'voltou pra imagem embutida', criado && criado.corpo.image_url);
  ok(env.FINN_KV._store.get('ig_post_next_index') === '4', 'a campanha embutida avancou', env.FINN_KV._store.get('ig_post_next_index'));
  ok(c.patch.length === 0, 'nao tentou marcar linha nenhuma no banco', c.patch.length);
  global.fetch = realFetch;
}

console.log('\n=== falha ao publicar item da fila registra o erro na linha ===');
{
  const env = ENV_FILA();
  const patches = [];
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('/rest/v1/social_posts')) {
      if (opts && opts.method === 'PATCH') { patches.push(JSON.parse(opts.body)); return new Response('', { status: 204 }); }
      return new Response(JSON.stringify([{ id: 'f1', kind: 'feed', image_path: 'x.png', caption: 'c', posicao: 1 }]), { status: 200 });
    }
    if (u.includes('graph.instagram.com')) return new Response(JSON.stringify({ error: { message: 'token vencido' } }), { status: 401 });
    return realFetch(url, opts);
  };
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  const err = patches.find(x => x.erro);
  ok(!!err, 'gravou o erro na linha da fila (aparece na tela)', JSON.stringify(patches));
  ok(!patches.some(x => x.published_at), 'NAO marcou como publicado', JSON.stringify(patches));
  global.fetch = realFetch;
}

console.log('\n=== sem service key, nao quebra: usa a campanha embutida ===');
{
  const env = { FINN_KV: novoKV({ ig_post_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123' };
  const c = mockFilaEIG([{ id: 'f1', kind: 'feed', image_path: 'nao-deve-usar.png', caption: 'x', posicao: 1 }]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  const criado = c.ig.find(x => x.corpo && x.corpo.image_url);
  ok(criado && /finn\.dev\.br\/social\/post-3\.png/.test(criado.corpo.image_url), 'sem service key nao consulta a fila, usa a embutida', criado && criado.corpo.image_url);
  global.fetch = realFetch;
}

global.fetch = realFetch;
console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
process.exit(falhas ? 1 : 0);

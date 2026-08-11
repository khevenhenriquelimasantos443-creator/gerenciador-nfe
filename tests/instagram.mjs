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

console.log('=== cron das 10h publica SO o feed (story tem cron proprio) ===');
{
  const env = ENV(); const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx);
  await ctx.fim();
  await new Promise(r => setTimeout(r, 300)); // story é disparado sem await

  const feeds = chamadas.filter(c => c.corpo && c.corpo.caption !== undefined);
  const stories = chamadas.filter(c => c.corpo && c.corpo.media_type === 'STORIES');
  ok(feeds.length === 1, 'criou 1 container de FEED (com caption)', feeds.length);
  // O story saiu daqui de proposito: pendurado no fluxo do post ele era uma
  // promise solta, e o Cloudflare encerra o isolate assim que o post termina
  // — matava o story no meio. Agora tem cron proprio, 25 min depois.
  ok(stories.length === 0, 'NAO dispara story junto com o post', stories.length);
  ok(feeds[0] && /post-3\.png/.test(feeds[0].corpo.image_url), 'usou a imagem do índice atual da fila (3)', feeds[0] && feeds[0].corpo.image_url);
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

console.log('\n=== o story usa a imagem 9:16, o feed a quadrada ===');
{
  // post 3 ja publicado (next=4), story pendente no 3
  const env = { FINN_KV: novoKV({ ig_post_next_index: '4', ig_story_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123' };
  const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx);
  await ctx.fim();
  const story = chamadas.find(c => c.corpo && c.corpo.media_type === 'STORIES');
  ok(story && /workers\.dev\/social\/story-3\.jpg/.test(story.corpo.image_url), 'story aponta pro worker do bot (9:16)', story && story.corpo.image_url);
  ok(story && story.corpo.caption === undefined, 'story nao manda caption', story && JSON.stringify(story.corpo).slice(0, 90));
  global.fetch = realFetch;
}

console.log('\n=== o feed continua usando a imagem quadrada ===');
{
  const env = ENV(); const chamadas = mockIG(); const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
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
      // Respeita o filtro kind=eq.X, como o PostgREST faria. Sem isso o mock
      // devolveria um story pra consulta de feed e o teste passaria/falharia
      // por motivo errado.
      const m = u.match(/kind=eq\.(\w+)/);
      const filtrada = m ? fila.filter(i => i.kind === m[1]) : fila;
      return new Response(JSON.stringify(filtrada), { status: 200 });
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
  // Cron das :25 — story tem horario proprio agora, 25 min depois do post.
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx); await ctx.fim();

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


// ══════════════════════════════════════════════════════════════════════
// STORY EM CRON PROPRIO, 25 MIN DEPOIS DO POST
// ══════════════════════════════════════════════════════════════════════
console.log('\n=== post NAO publica story junto (story tem cron proprio) ===');
{
  const env = ENV_FILA();
  const c = mockFilaEIG([]);  // fila vazia -> campanha embutida
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  await new Promise(r => setTimeout(r, 300));
  const stories = c.ig.filter(x => x.corpo && x.corpo.media_type === 'STORIES');
  ok(stories.length === 0, 'cron do POST nao dispara story (era promise solta, morria no isolate)', stories.length);
  const feeds = c.ig.filter(x => x.corpo && x.corpo.caption !== undefined);
  ok(feeds.length === 1, 'o post do feed sai normalmente', feeds.length);
  global.fetch = realFetch;
}

console.log('\n=== cron das :25 publica o story do post que JA saiu ===');
{
  // post 3 ja publicado (next_index=4), story ainda no 3
  const env = { FINN_KV: novoKV({ ig_post_next_index: '4', ig_story_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123', SUPABASE_SERVICE_KEY: 'svc' };
  const c = mockFilaEIG([]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx); await ctx.fim();

  const st = c.ig.find(x => x.corpo && x.corpo.media_type === 'STORIES');
  ok(!!st, 'publicou um story');
  ok(st && /story-3\.jpg/.test(st.corpo.image_url), 'usou a arte 9:16 do post 3', st && st.corpo.image_url);
  ok(st && st.corpo.caption === undefined, 'sem caption (a Meta ignora em story)');
  ok(env.FINN_KV._store.get('ig_story_next_index') === '4', 'avancou o indice do story', env.FINN_KV._store.get('ig_story_next_index'));
  ok(env.FINN_KV._store.get('ig_post_next_index') === '4', 'nao mexeu no indice do post', env.FINN_KV._store.get('ig_post_next_index'));
  global.fetch = realFetch;
}

console.log('\n=== story NAO sai antes do post que ele acompanha ===');
{
  // post e story no mesmo indice = o post 3 ainda nao saiu
  const env = { FINN_KV: novoKV({ ig_post_next_index: '3', ig_story_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123', SUPABASE_SERVICE_KEY: 'svc' };
  const c = mockFilaEIG([]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx); await ctx.fim();
  ok(c.ig.length === 0, 'nao publica story de post que ainda nao foi', c.ig.length);
  global.fetch = realFetch;
}

console.log('\n=== story da FILA tem prioridade sobre a arte embutida ===');
{
  const env = { FINN_KV: novoKV({ ig_post_next_index: '4', ig_story_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123', SUPABASE_SERVICE_KEY: 'svc' };
  const c = mockFilaEIG([{ id: 'st1', kind: 'story', image_path: 'meu-story.jpg', caption: null, posicao: 1 }]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx); await ctx.fim();

  const st = c.ig.find(x => x.corpo && x.corpo.media_type === 'STORIES');
  ok(st && /public\/social\/meu-story\.jpg/.test(st.corpo.image_url), 'usou o story da fila', st && st.corpo.image_url);
  ok(env.FINN_KV._store.get('ig_story_next_index') === '3', 'nao consumiu a arte embutida', env.FINN_KV._store.get('ig_story_next_index'));
  const marcado = c.patch.find(x => x.corpo && x.corpo.published_at);
  ok(!!marcado && /id=eq\.st1/.test(marcado.url), 'marcou a linha do story na fila', marcado && marcado.url);
  global.fetch = realFetch;
}

console.log('\n=== item de STORY na fila nao sai como post no horario do feed ===');
{
  const env = ENV_FILA();
  const c = mockFilaEIG([{ id: 'st9', kind: 'story', image_path: 's.jpg', caption: null, posicao: 1 }]);
  const ctx = novoCtx();
  await serve.scheduled({ cron: '0 13,21 * * *' }, env, ctx); await ctx.fim();
  const comCaption = c.ig.filter(x => x.corpo && x.corpo.caption !== undefined);
  ok(comCaption.length === 1 && /post-3\.png/.test(comCaption[0].corpo.image_url), 'cron do feed ignorou o story e usou a campanha embutida', comCaption[0] && comCaption[0].corpo.image_url);
  ok(c.patch.length === 0, 'nao marcou o story como publicado', c.patch.length);
  global.fetch = realFetch;
}

console.log('\n=== falha no story nao avanca o indice ===');
{
  const env = { FINN_KV: novoKV({ ig_post_next_index: '4', ig_story_next_index: '3' }), IG_ACCESS_TOKEN: 'tok', IG_BUSINESS_ACCOUNT_ID: '123' };
  global.fetch = async (url) => {
    if (String(url).includes('graph.instagram.com')) return new Response(JSON.stringify({ error: { message: 'sem permissao' } }), { status: 403 });
    return realFetch(url);
  };
  const ctx = novoCtx();
  await serve.scheduled({ cron: '25 13,21 * * *' }, env, ctx); await ctx.fim();
  ok(env.FINN_KV._store.get('ig_story_next_index') === '3', 'indice do story intacto — tenta o mesmo depois', env.FINN_KV._store.get('ig_story_next_index'));
  global.fetch = realFetch;
}

global.fetch = realFetch;
console.log('\n' + (falhas ? `❌ ${falhas} falha(s)` : '✅ tudo passou'));
process.exit(falhas ? 1 : 0);

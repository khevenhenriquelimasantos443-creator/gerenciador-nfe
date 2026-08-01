// =============================================================================
// MeliVista — Cloudflare Worker (cofre de tokens + proxy somente leitura)
// =============================================================================
// Este Worker é o ÚNICO lugar do sistema que enxerga client_secret e tokens.
// O navegador nunca recebe access_token nem refresh_token — recebe apenas um
// cookie de sessão opaco (HttpOnly), e todo dado do Mercado Livre / Mercado Pago
// passa por aqui.
//
// Controles implementados (ver CONFIGURAR.md):
//   1. Escopo mínimo    — só pede `offline_access read` na autorização
//   2. Allowlist de rota— só GET, e só nos caminhos explicitamente liberados
//   3. Cofre de tokens  — AES-GCM no KV, chave em secret (nunca no repositório)
//   4. Sessão opaca     — cookie HttpOnly/Secure/SameSite=Lax assinado por HMAC
//   5. CORS restrito    — allowlist de origem, sem curinga, com credenciais
//   6. Anti-CSRF        — state assinado no OAuth + header obrigatório na API
//   7. Rate limit       — janela deslizante por sessão e por IP
//   8. Auditoria        — data, endpoint, conta e status de toda chamada
//
// Secrets obrigatórios (wrangler secret put ...):
//   ML_CLIENT_ID, ML_CLIENT_SECRET
//   MP_CLIENT_ID, MP_CLIENT_SECRET
//   SESSION_SECRET  — string aleatória longa (assina sessão e state)
//   TOKEN_KEY       — 32 bytes aleatórios em base64 (criptografa tokens no KV)
// Vars (wrangler.toml): APP_URL, ALLOWED_ORIGINS
// KV binding: MV_KV
// =============================================================================

const ML_AUTH_HOST = 'https://auth.mercadolivre.com.br';
const ML_API = 'https://api.mercadolibre.com';
const MP_AUTH_URL = 'https://auth.mercadopago.com.br/authorization';
const MP_API = 'https://api.mercadopago.com';

// Escopo mínimo por design: leitura e renovação. Nunca `write`, nunca `offline`
// de escrita. Se um dia alguém adicionar escrita aqui, o diff aparece no review.
const SCOPES = 'offline_access read';

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 dias
const STATE_TTL = 60 * 10; // 10 minutos
const AUDIT_KEEP = 300; // últimas N chamadas mantidas por sessão

// ─────────────────────────────────────────────────────────────────────────────
// ALLOWLIST DE ENDPOINTS — o coração do "somente leitura"
// Mesmo que o front-end seja comprometido, ou que alguém roube o cookie de
// sessão, só é possível chamar exatamente estes caminhos, e só com GET.
// ─────────────────────────────────────────────────────────────────────────────
const ML_ALLOWED = [
  /^\/users\/\d+$/, // reputação de envio (seller_reputation.metrics)
  /^\/users\/me$/,
  /^\/shipments\/\d+$/, // status, dimensions, date_created
  /^\/shipments\/\d+\/items$/, // quantidade e descrição
  /^\/shipments\/\d+\/carrier$/, // transportadora
  /^\/shipments\/\d+\/history$/, // dia do envio / etapas
  /^\/shipments\/\d+\/costs$/,
  /^\/orders\/\d+$/,
  /^\/orders\/search$/, // reconciliação de vendas
  /^\/sites\/[A-Z]{3}\/listing_prices$/, // comissão de categoria
];

const MP_ALLOWED = [
  /^\/users\/me$/,
  /^\/v1\/account\/release_report\/list$/, // Relatório de Liberações
  /^\/v1\/account\/release_report\/[\w.-]+$/,
  /^\/v1\/account\/settlement_report\/list$/,
  /^\/v1\/payments\/search$/,
  /^\/v1\/payments\/\d+$/,
];

// =============================================================================
// ROTEADOR
// =============================================================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return withCors(new Response(null, { status: 204 }), origin, env);
    }

    try {
      const route = `${request.method} ${url.pathname}`;

      // Callback do OAuth é navegação do usuário (sem CORS, sem header custom).
      if (url.pathname === '/auth/callback' && request.method === 'GET') {
        return await handleCallback(request, env, url);
      }

      // Todo o resto é XHR do app: exige origem conhecida.
      if (!isAllowedOrigin(origin, env)) {
        return withCors(json({ error: 'origin_not_allowed' }, 403), origin, env);
      }

      switch (true) {
        case route === 'GET /health':
          return withCors(json({ ok: true, mode: 'read-only' }), origin, env);

        case route === 'POST /auth/start':
          return withCors(await handleAuthStart(request, env), origin, env);

        case route === 'GET /accounts':
          return withCors(await handleAccounts(request, env), origin, env);

        case route === 'POST /accounts/disconnect':
          return withCors(await handleDisconnect(request, env), origin, env);

        case route === 'GET /audit':
          return withCors(await handleAudit(request, env), origin, env);

        case route === 'POST /session/reset':
          return withCors(await handleSessionReset(request, env), origin, env);

        case request.method === 'GET' && url.pathname.startsWith('/api/'):
          return withCors(await handleProxy(request, env, url, ctx), origin, env);

        default:
          return withCors(json({ error: 'not_found' }, 404), origin, env);
      }
    } catch (err) {
      // Nunca devolve stack nem valor de secret para o cliente.
      console.error('worker_error', err && err.message);
      return withCors(json({ error: 'internal_error' }, 500), origin, env);
    }
  },
};

// =============================================================================
// CORS — allowlist estrita, sem curinga (precisa aceitar credenciais)
// =============================================================================
function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin, env) {
  if (!origin) return false;
  return allowedOrigins(env).includes(origin);
}

function withCors(response, origin, env) {
  const headers = new Headers(response.headers);
  if (isAllowedOrigin(origin, env)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
    headers.set('Vary', 'Origin');
  }
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, X-MV-Request');
  headers.set('Access-Control-Max-Age', '86400');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'no-referrer');
  headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, headers });
}

function json(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

// =============================================================================
// CRIPTOGRAFIA — tokens em repouso (AES-GCM) e assinatura (HMAC-SHA256)
// =============================================================================
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64u(bytes) {
  let s = '';
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64u(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function randomB64u(bytes = 32) {
  return b64u(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function hmac(env, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(requireSecret(env, 'SESSION_SECRET')),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return b64u(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// Comparação em tempo constante: evita distinguir assinaturas por timing.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function requireSecret(env, name) {
  const v = env[name];
  if (!v) throw new Error(`missing_secret:${name}`);
  return v;
}

async function aesKey(env) {
  const raw = unb64u(requireSecret(env, 'TOKEN_KEY'));
  if (raw.length !== 32) throw new Error('TOKEN_KEY deve ter 32 bytes em base64url');
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function sealTokens(env, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await aesKey(env);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(obj)));
  return { iv: b64u(iv), ct: b64u(ct) };
}

async function openTokens(env, sealed) {
  const key = await aesKey(env);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64u(sealed.iv) },
    key,
    unb64u(sealed.ct),
  );
  return JSON.parse(dec.decode(pt));
}

// =============================================================================
// SESSÃO — cookie opaco assinado, HttpOnly. Não carrega dado nenhum.
// =============================================================================
function readCookie(request, name) {
  const raw = request.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

async function getSession(request, env) {
  const cookie = readCookie(request, 'mv_sid');
  if (!cookie) return null;
  const [sid, sig] = cookie.split('.');
  if (!sid || !sig) return null;
  if (!safeEqual(sig, await hmac(env, sid))) return null;
  const stored = await env.MV_KV.get(`sess:${sid}`, 'json');
  if (!stored) return null;
  return { sid, data: stored };
}

async function createSession(env) {
  const sid = randomB64u(24);
  const data = { created_at: new Date().toISOString(), accounts: {} };
  await env.MV_KV.put(`sess:${sid}`, JSON.stringify(data), { expirationTtl: SESSION_TTL });
  const sig = await hmac(env, sid);
  return { sid, data, cookie: sessionCookie(`${sid}.${sig}`, SESSION_TTL) };
}

function sessionCookie(value, maxAge) {
  // SameSite=None é necessário porque o app (github.io) e o Worker (workers.dev)
  // são domínios diferentes: com Lax, o navegador nunca envia o cookie nas
  // chamadas fetch entre eles. Secure+HttpOnly seguem obrigatórios com None.
  return `mv_sid=${value}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAge}`;
}

async function saveSession(env, sid, data) {
  await env.MV_KV.put(`sess:${sid}`, JSON.stringify(data), { expirationTtl: SESSION_TTL });
}

// Header custom obrigatório: um formulário HTML de outro site não consegue
// enviá-lo sem passar por preflight CORS, que a allowlist bloqueia.
function requireXhrHeader(request) {
  return request.headers.get('X-MV-Request') === '1';
}

// =============================================================================
// RATE LIMIT — janela deslizante simples em KV (por sessão e por IP)
// =============================================================================
async function rateLimit(env, key, limit, windowSec) {
  const bucket = `rl:${key}:${Math.floor(Date.now() / 1000 / windowSec)}`;
  const current = parseInt((await env.MV_KV.get(bucket)) || '0', 10);
  if (current >= limit) return false;
  await env.MV_KV.put(bucket, String(current + 1), { expirationTtl: windowSec * 2 });
  return true;
}

function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

// =============================================================================
// AUDITORIA — rastreabilidade de toda chamada feita em nome de uma conta
// =============================================================================
async function audit(env, sid, entry) {
  const key = `audit:${sid}`;
  const list = (await env.MV_KV.get(key, 'json')) || [];
  list.unshift({ at: new Date().toISOString(), ...entry });
  await env.MV_KV.put(key, JSON.stringify(list.slice(0, AUDIT_KEEP)), {
    expirationTtl: SESSION_TTL,
  });
}

// =============================================================================
// OAUTH — início (PKCE S256 + state assinado)
// =============================================================================
async function handleAuthStart(request, env) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);

  const body = await request.json().catch(() => ({}));
  const provider = body.provider === 'mp' ? 'mp' : 'ml';

  let session = await getSession(request, env);
  let setCookie = null;
  if (!session) {
    const created = await createSession(env);
    session = { sid: created.sid, data: created.data };
    setCookie = created.cookie;
  }

  if (!(await rateLimit(env, `auth:${clientIp(request)}`, 10, 300))) {
    return json({ error: 'rate_limited' }, 429);
  }

  const verifier = randomB64u(48);
  const challenge = b64u(await crypto.subtle.digest('SHA-256', enc.encode(verifier)));
  const nonce = randomB64u(18);
  const state = `${nonce}.${await hmac(env, `${nonce}:${session.sid}:${provider}`)}`;

  await env.MV_KV.put(
    `state:${nonce}`,
    JSON.stringify({ sid: session.sid, provider, verifier }),
    { expirationTtl: STATE_TTL },
  );

  const redirectUri = `${new URL(request.url).origin}/auth/callback`;
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: requireSecret(env, provider === 'mp' ? 'MP_CLIENT_ID' : 'ML_CLIENT_ID'),
    redirect_uri: redirectUri,
    state,
    scope: SCOPES,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  });
  // O Mercado Pago exige esse parâmetro na URL de autorização; sem ele a tela
  // de login deles recusa com "não foi possível conectar o aplicativo".
  if (provider === 'mp') params.set('platform_id', 'mp');

  const authorizeUrl =
    provider === 'mp'
      ? `${MP_AUTH_URL}?${params}`
      : `${ML_AUTH_HOST}/authorization?${params}`;

  const headers = setCookie ? { 'Set-Cookie': setCookie } : {};
  return json({ url: authorizeUrl, provider, scopes: SCOPES }, 200, headers);
}

// =============================================================================
// OAUTH — callback (troca do code pelo token, sempre no servidor)
// =============================================================================
async function handleCallback(request, env, url) {
  const appUrl = env.APP_URL || '/';
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state') || '';
  const [nonce, sig] = state.split('.');

  const fail = (reason) => Response.redirect(`${appUrl}#auth=erro&motivo=${reason}`, 302);

  if (!code || !nonce || !sig) return fail('parametros');

  const pending = await env.MV_KV.get(`state:${nonce}`, 'json');
  if (!pending) return fail('state_expirado');
  await env.MV_KV.delete(`state:${nonce}`); // state é de uso único

  const expected = await hmac(env, `${nonce}:${pending.sid}:${pending.provider}`);
  if (!safeEqual(sig, expected)) return fail('state_invalido');

  const session = await getSession(request, env);
  if (!session || session.sid !== pending.sid) return fail('sessao');

  const provider = pending.provider;
  const tokenUrl = provider === 'mp' ? `${MP_API}/oauth/token` : `${ML_API}/oauth/token`;

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: requireSecret(env, provider === 'mp' ? 'MP_CLIENT_ID' : 'ML_CLIENT_ID'),
      client_secret: requireSecret(env, provider === 'mp' ? 'MP_CLIENT_SECRET' : 'ML_CLIENT_SECRET'),
      code,
      redirect_uri: `${url.origin}/auth/callback`,
      code_verifier: pending.verifier,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data.access_token) {
    await audit(env, session.sid, {
      provider,
      endpoint: '/oauth/token',
      status: resp.status,
      result: 'falha',
    });
    return fail('token');
  }

  const accountId = String(data.user_id || data.id || 'desconhecida');
  const key = `${provider}:${accountId}`;

  await env.MV_KV.put(
    `tok:${session.sid}:${key}`,
    JSON.stringify(
      await sealTokens(env, {
        access_token: data.access_token,
        refresh_token: data.refresh_token || null,
      }),
    ),
    { expirationTtl: SESSION_TTL },
  );

  session.data.accounts[key] = {
    provider,
    account_id: accountId,
    scope: data.scope || SCOPES,
    connected_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + (data.expires_in || 21600) * 1000).toISOString(),
    nickname: null,
  };
  await saveSession(env, session.sid, session.data);
  await audit(env, session.sid, {
    provider,
    account: accountId,
    endpoint: '/oauth/token',
    status: 200,
    result: 'conta conectada',
  });

  return Response.redirect(`${appUrl}#auth=ok&conta=${encodeURIComponent(key)}`, 302);
}

// =============================================================================
// CONTAS — o front nunca vê token, só metadado
// =============================================================================
async function handleAccounts(request, env) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);
  const session = await getSession(request, env);
  if (!session) return json({ accounts: [] });
  return json({
    accounts: Object.entries(session.data.accounts).map(([key, meta]) => ({ key, ...meta })),
  });
}

async function handleDisconnect(request, env) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);
  const session = await getSession(request, env);
  if (!session) return json({ error: 'no_session' }, 401);

  const { key } = await request.json().catch(() => ({}));
  if (!key || !session.data.accounts[key]) return json({ error: 'not_found' }, 404);

  await env.MV_KV.delete(`tok:${session.sid}:${key}`);
  delete session.data.accounts[key];
  await saveSession(env, session.sid, session.data);
  await audit(env, session.sid, { endpoint: '/accounts/disconnect', status: 200, result: key });

  // Apagar o token aqui só encerra o acesso deste app. Para revogar de verdade,
  // o usuário usa "Administrar Permissões" na conta — o app avisa isso na tela.
  return json({ ok: true, lembrete: 'revogue também em Administrar Permissões' });
}

async function handleSessionReset(request, env) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);
  const session = await getSession(request, env);
  if (session) {
    for (const key of Object.keys(session.data.accounts)) {
      await env.MV_KV.delete(`tok:${session.sid}:${key}`);
    }
    await env.MV_KV.delete(`sess:${session.sid}`);
    await env.MV_KV.delete(`audit:${session.sid}`);
  }
  return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('', 0) });
}

async function handleAudit(request, env) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);
  const session = await getSession(request, env);
  if (!session) return json({ entries: [] });
  return json({ entries: (await env.MV_KV.get(`audit:${session.sid}`, 'json')) || [] });
}

// =============================================================================
// RENOVAÇÃO DE TOKEN — refresh_token, sem interação do usuário
// =============================================================================
async function accessTokenFor(env, session, key) {
  const meta = session.data.accounts[key];
  if (!meta) return null;

  const sealed = await env.MV_KV.get(`tok:${session.sid}:${key}`, 'json');
  if (!sealed) return null;
  const tokens = await openTokens(env, sealed);

  const expiresAt = Date.parse(meta.expires_at || 0);
  if (Number.isFinite(expiresAt) && expiresAt - Date.now() > 60_000) {
    return tokens.access_token;
  }
  if (!tokens.refresh_token) return tokens.access_token;

  const provider = meta.provider;
  const resp = await fetch(provider === 'mp' ? `${MP_API}/oauth/token` : `${ML_API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: requireSecret(env, provider === 'mp' ? 'MP_CLIENT_ID' : 'ML_CLIENT_ID'),
      client_secret: requireSecret(env, provider === 'mp' ? 'MP_CLIENT_SECRET' : 'ML_CLIENT_SECRET'),
      refresh_token: tokens.refresh_token,
    }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data.access_token) return null;

  await env.MV_KV.put(
    `tok:${session.sid}:${key}`,
    JSON.stringify(
      await sealTokens(env, {
        access_token: data.access_token,
        refresh_token: data.refresh_token || tokens.refresh_token,
      }),
    ),
    { expirationTtl: SESSION_TTL },
  );
  meta.expires_at = new Date(Date.now() + (data.expires_in || 21600) * 1000).toISOString();
  await saveSession(env, session.sid, session.data);
  return data.access_token;
}

// =============================================================================
// PROXY SOMENTE LEITURA — /api/ml/... e /api/mp/...
// =============================================================================
function matchAllowlist(provider, path) {
  const list = provider === 'mp' ? MP_ALLOWED : ML_ALLOWED;
  return list.some((re) => re.test(path));
}

async function handleProxy(request, env, url, ctx) {
  if (!requireXhrHeader(request)) return json({ error: 'missing_header' }, 400);

  const session = await getSession(request, env);
  if (!session) return json({ error: 'no_session' }, 401);

  if (!(await rateLimit(env, `api:${session.sid}`, 120, 60))) {
    return json({ error: 'rate_limited' }, 429);
  }

  const segments = url.pathname.replace(/^\/api\//, '').split('/');
  const provider = segments.shift();
  if (provider !== 'ml' && provider !== 'mp') return json({ error: 'provider_invalido' }, 400);

  const accountKey = url.searchParams.get('conta');
  if (!accountKey || !session.data.accounts[accountKey]) {
    return json({ error: 'conta_nao_conectada' }, 400);
  }
  if (session.data.accounts[accountKey].provider !== provider) {
    return json({ error: 'conta_de_outro_provedor' }, 400);
  }

  const path = '/' + segments.join('/');
  if (!matchAllowlist(provider, path)) {
    await audit(env, session.sid, {
      provider,
      account: accountKey,
      endpoint: path,
      status: 403,
      result: 'bloqueado pela allowlist',
    });
    return json({ error: 'endpoint_nao_permitido', path }, 403);
  }

  const token = await accessTokenFor(env, session, accountKey);
  if (!token) return json({ error: 'token_indisponivel' }, 401);

  const query = new URLSearchParams(url.searchParams);
  query.delete('conta');
  const base = provider === 'mp' ? MP_API : ML_API;
  const target = `${base}${path}${query.toString() ? `?${query}` : ''}`;

  const upstream = await fetch(target, {
    method: 'GET', // travado: nunca repassa o método do cliente
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });

  const payload = await upstream.text();
  ctx.waitUntil(
    audit(env, session.sid, {
      provider,
      account: accountKey,
      endpoint: path,
      status: upstream.status,
      result: upstream.ok ? 'ok' : 'erro',
    }),
  );

  return new Response(payload, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

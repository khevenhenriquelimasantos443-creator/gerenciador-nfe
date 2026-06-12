// ═══════════════════════════════════════════════════════════
// ML ENVIOS — Cloudflare Worker v2.0
// OAuth proxy para troca segura do código ML por access_token
//
// Deploy: dash.cloudflare.com → Workers & Pages → Create Worker
//
// Variáveis de ambiente necessárias (Settings → Variables):
//   ML_SECRET     = sua Client Secret do Mercado Livre
//   ALLOWED_ORIGIN = sua URL do GitHub Pages (ex: https://user.github.io)
// ═══════════════════════════════════════════════════════════

const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token';
const RATE_LIMIT_WINDOW = 60_000;  // 1 minuto
const RATE_LIMIT_MAX    = 10;      // máx 10 requisições por IP por minuto

// Rate limiter em memória (reseta ao reiniciar o worker)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
    entry.count = 0; entry.windowStart = now;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

function corsHeaders(env, origin) {
  const allowed = env.ALLOWED_ORIGIN || '*';
  const allowOrigin = allowed === '*' ? '*' :
    (origin && origin.startsWith(allowed)) ? origin : allowed;
  return {
    'Access-Control-Allow-Origin':  allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(env, origin);

    // Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Apenas POST
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    // Rate limiting por IP
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!checkRateLimit(ip)) {
      return json({ error: 'rate_limit_exceeded', message: 'Muitas requisições. Aguarde 1 minuto.' }, 429, cors);
    }

    // Validar secret configurado
    if (!env.ML_SECRET) {
      return json({ error: 'server_misconfigured', message: 'ML_SECRET não configurado no Worker.' }, 500, cors);
    }

    // Parse do body com validação
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }

    const { code, clientId, redirectUri } = body;

    if (!code || typeof code !== 'string' || code.length > 512) {
      return json({ error: 'invalid_code' }, 400, cors);
    }
    if (!clientId || typeof clientId !== 'string' || !/^\d+$/.test(clientId)) {
      return json({ error: 'invalid_client_id' }, 400, cors);
    }
    if (!redirectUri || typeof redirectUri !== 'string' || !redirectUri.startsWith('https://')) {
      return json({ error: 'invalid_redirect_uri' }, 400, cors);
    }

    // Troca do código pelo token via API do ML
    try {
      const resp = await fetch(ML_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type:    'authorization_code',
          client_id:     clientId,
          client_secret: env.ML_SECRET,
          code,
          redirect_uri:  redirectUri,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // Repassa o erro do ML sem expor o client_secret
        return json({
          error:             data.error             || 'token_error',
          error_description: data.error_description || 'Erro ao trocar o código',
        }, resp.status, cors);
      }

      // Retorna apenas o necessário — nunca o client_secret
      return json({
        access_token:  data.access_token,
        token_type:    data.token_type,
        expires_in:    data.expires_in,
        scope:         data.scope,
        user_id:       data.user_id,
        // refresh_token omitido intencionalmente (não necessário para esta app)
      }, 200, cors);

    } catch (e) {
      return json({ error: 'upstream_error', message: e.message }, 502, cors);
    }
  },
};

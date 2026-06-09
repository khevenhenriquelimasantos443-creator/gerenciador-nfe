// Cloudflare Worker — ML OAuth Proxy
// Deploy em: dash.cloudflare.com → Workers & Pages → Create Worker
// Variável de ambiente necessária: ML_SECRET = sua Chave Secreta do ML

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('Not found', { status: 404 });
    }

    try {
      const { code, clientId, redirectUri } = await request.json();

      const resp = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: env.ML_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      const data = await resp.json();
      return new Response(JSON.stringify(data), {
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }
  },
};

// =============================================================================
// Painel de Anúncios Shopee — Cloudflare Worker
// =============================================================================
// Este Worker é o SITE e o BANCO DE DADOS do painel ao mesmo tempo:
//   GET  /            → serve a página do painel
//   GET  /dados       → devolve a última varredura (requer token)
//   POST /dados       → recebe a varredura enviada pela extensão (requer token)
//   GET  /historico   → resumos das últimas varreduras (requer token)
//
// Configuração necessária (veja CONFIGURAR.md):
//   - KV namespace vinculado como: SHOPEE_KV
//   - Variável secreta: SYNC_TOKEN (a "senha" que a extensão e o site usam)
//
// ⚠️ Este arquivo é gerado por build.py — edite worker-logic.js e rode o build.
// =============================================================================

const SITE_HTML = __SITE_HTML__;

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '')
      || url.searchParams.get('token') || '';
    const authed = !!env.SYNC_TOKEN && token === env.SYNC_TOKEN;

    // O site em si (não expõe dado nenhum — os dados exigem token)
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(SITE_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
      });
    }

    if (url.pathname === '/dados') {
      if (!authed) return json({ ok: false, erro: 'token inválido' }, 401, cors);

      if (request.method === 'GET') {
        const data = await env.SHOPEE_KV.get('ultima_varredura');
        if (!data) return json({ ok: false, erro: 'nenhuma varredura recebida ainda' }, 404, cors);
        return new Response(data, { headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });
      }

      if (request.method === 'POST') {
        let parsed;
        try { parsed = await request.json(); }
        catch (e) { return json({ ok: false, erro: 'JSON inválido' }, 400, cors); }
        if (!parsed || !Array.isArray(parsed.rows) || !parsed.rows.length) {
          return json({ ok: false, erro: 'formato inválido (esperado {rows:[...]})' }, 400, cors);
        }
        parsed.recebidoEm = new Date().toISOString();
        await env.SHOPEE_KV.put('ultima_varredura', JSON.stringify(parsed));

        // histórico de resumos (leve — para acompanhar a evolução da loja)
        try {
          const hist = JSON.parse((await env.SHOPEE_KV.get('historico')) || '[]');
          const s = parsed.summary || {};
          hist.push({
            em: parsed.recebidoEm,
            total: s.total ?? parsed.rows.length,
            comPromo: s.comPromo ?? null,
            estoqueZero: s.estoqueZero ?? null,
            comEan: s.comEan ?? null
          });
          while (hist.length > 120) hist.shift();
          await env.SHOPEE_KV.put('historico', JSON.stringify(hist));
        } catch (e) { /* histórico é opcional */ }

        return json({ ok: true, total: parsed.rows.length }, 200, cors);
      }
    }

    if (url.pathname === '/historico' && request.method === 'GET') {
      if (!authed) return json({ ok: false, erro: 'token inválido' }, 401, cors);
      const hist = (await env.SHOPEE_KV.get('historico')) || '[]';
      return new Response(hist, { headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });
    }

    return json({ ok: false, erro: 'rota não encontrada' }, 404, cors);
  }
};

// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const html    = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw      = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');

// ETag baseado no conteúdo — muda só quando o HTML muda
const etag = '"' + crypto.createHash('md5').update(html).digest('hex').slice(0,12) + '"';

// ── Funções auxiliares Pluggy (embutidas no Worker como módulo) ──────────────
const pluggyFns = `
// Categoria Pluggy → categoria Finn
function _pluggyCat(pluggyCat) {
  var c = (pluggyCat || '').toLowerCase();
  if (/food|restaurant|alimenta|mercado|supermercado|padaria|lanche|fast food|delivery/i.test(c)) return 'Alimentação';
  if (/transport|uber|99|taxi|combustivel|gasolina|estacionamento|pedagio|metro|onibus|trem/i.test(c)) return 'Transporte';
  if (/moradia|aluguel|condominio|iptu|agua|energia|luz|gas|internet|telefone|casa/i.test(c)) return 'Moradia';
  if (/saude|health|medic|farmacia|hospital|consulta|exame|plano/i.test(c)) return 'Saúde';
  if (/educa|escola|facul|curso|livro|mensalidade/i.test(c)) return 'Educação';
  if (/lazer|entertain|cinema|teatro|viagem|hotel|streaming|netflix|spotify|jogo/i.test(c)) return 'Lazer';
  if (/salario|salary|pagamento|renda|receita/i.test(c)) return 'Salário';
  if (/invest|poupanca|aplicacao|fundo|acoes|tesouro/i.test(c)) return 'Investimento';
  return 'Outros';
}

// Autentica na Pluggy e retorna apiKey
async function _pluggyApiKey(env) {
  var r = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: env.PLUGGY_CLIENT_ID, clientSecret: env.PLUGGY_CLIENT_SECRET })
  });
  if (!r.ok) {
    var errBody = '';
    try { errBody = await r.text(); } catch(e2) {}
    throw new Error('Pluggy auth failed: ' + r.status + ' — ' + errBody.slice(0, 200));
  }
  var j = await r.json();
  return j.apiKey;
}

// POST /pluggy/token — retorna { accessToken }
async function _pluggyToken(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.PLUGGY_CLIENT_ID || !env.PLUGGY_CLIENT_SECRET) {
      return new Response(JSON.stringify({ error: 'Secrets não configurados: PLUGGY_CLIENT_ID=' + (env.PLUGGY_CLIENT_ID ? 'ok' : 'MISSING') + ' PLUGGY_CLIENT_SECRET=' + (env.PLUGGY_CLIENT_SECRET ? 'ok' : 'MISSING') }), { status: 500, headers: cors });
    }
    var apiKey = await _pluggyApiKey(env);
    var r = await fetch('https://api.pluggy.ai/connect_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      body: JSON.stringify({ clientUserId: 'finn-user' })
    });
    if (!r.ok) {
      var errBody = ''; try { errBody = await r.text(); } catch(e2) {}
      throw new Error('connect_token failed: ' + r.status + ' — ' + errBody.slice(0,200));
    }
    var j = await r.json();
    return new Response(JSON.stringify({ accessToken: j.accessToken }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// GET /pluggy/transactions?itemId=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD
async function _pluggyTx(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var itemId = url.searchParams.get('itemId');
    var from   = url.searchParams.get('from') || new Date(Date.now() - 90*24*3600*1000).toISOString().slice(0,10);
    var to     = url.searchParams.get('to')   || new Date().toISOString().slice(0,10);
    if (!itemId) return new Response(JSON.stringify({ error: 'itemId required' }), { status: 400, headers: cors });

    var apiKey = await _pluggyApiKey(env);
    var hdrs = { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' };

    // Busca contas do item
    var ar = await fetch('https://api.pluggy.ai/accounts?itemId=' + itemId, { headers: hdrs });
    if (!ar.ok) throw new Error('accounts failed: ' + ar.status);
    var accounts = (await ar.json()).results || [];

    var allTxs = [];
    for (var ai = 0; ai < accounts.length; ai++) {
      var acc = accounts[ai];
      var page = 1, hasMore = true;
      while (hasMore) {
        var tr = await fetch(
          'https://api.pluggy.ai/transactions?accountId=' + acc.id +
          '&from=' + from + '&to=' + to + '&pageSize=500&page=' + page,
          { headers: hdrs }
        );
        if (!tr.ok) break;
        var data = await tr.json();
        var results = data.results || [];
        results.forEach(function(tx) {
          allTxs.push({
            id: 'pluggy_' + tx.id,
            date: (tx.date || '').slice(0, 10),
            description: tx.description || tx.name || 'Transação',
            amount: Math.abs(tx.amount),
            type: tx.type === 'CREDIT' ? 'receita' : 'despesa',
            category: _pluggyCat(tx.category),
            bank: acc.name || 'Banco',
            source: 'pluggy'
          });
        });
        var total = data.total || results.length;
        hasMore = page * 500 < total && results.length === 500;
        page++;
      }
    }

    return new Response(JSON.stringify({ transactions: allTxs, count: allTxs.length }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}
`;

const worker = `${pluggyFns}
export default {
  async fetch(request, env) {
    var url = new URL(request.url);

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // ── Pluggy: token ──
    if (url.pathname === '/pluggy/token' && request.method === 'POST') {
      return _pluggyToken(request, env);
    }

    // ── Pluggy: transactions ──
    if (url.pathname === '/pluggy/transactions' && request.method === 'GET') {
      return _pluggyTx(request, env);
    }

    // ── Service Worker ──
    if (url.pathname === '/sw.js') {
      return new Response(${JSON.stringify(sw)}, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Service-Worker-Allowed': '/',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ── Landing page ──
    if (url.pathname === '/landing' || url.pathname === '/landing.html') {
      return new Response(${JSON.stringify(landing)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      });
    }

    // ── Main app ──
    var ETAG = ${JSON.stringify(etag)};

    // 304 Not Modified — evita re-download quando nada mudou
    var ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch === ETAG) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': ETAG,
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      });
    }

    return new Response(${JSON.stringify(html)}, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'ETag': ETAG,
        'X-Finn-Version': '2.1.0',
      },
    });
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB) | ETag: ' + etag);

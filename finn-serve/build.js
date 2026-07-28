// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const html      = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing   = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw        = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');
const pitchInv  = fs.readFileSync(path.join(__dirname,'../finn/pitch-investidores.html'), 'utf8');
const pitchUsr  = fs.readFileSync(path.join(__dirname,'../finn/pitch-usuarios.html'), 'utf8');
const guia      = fs.readFileSync(path.join(__dirname,'../finn/guia.html'), 'utf8');
const beta      = fs.readFileSync(path.join(__dirname,'../finn/beta.html'), 'utf8');

// Ícones do PWA — mesmo desenho do "F" usado no favicon do app, embutidos
// como base64 direto dos PNGs (evita depender de SVG em manifest, que
// vários navegadores/iOS não renderizam direito como ícone instalado).
const icon192      = fs.readFileSync(path.join(__dirname,'icons/icon-192.png')).toString('base64');
const icon512       = fs.readFileSync(path.join(__dirname,'icons/icon-512.png')).toString('base64');
const appleTouchIcon = fs.readFileSync(path.join(__dirname,'icons/apple-touch-icon.png')).toString('base64');

// Posts do Instagram (campanha de divulgação do beta) — servidos publicamente
// em /social/post-N.png porque a API do Instagram só aceita image_url (não
// tem upload direto), então a imagem precisa estar hospedada num link fixo.
const socialPosts = [1,2,3,4,5].map(function(n){
  return fs.readFileSync(path.join(__dirname,'social/ig_post_' + n + '.png')).toString('base64');
});

// ETag baseado no conteúdo — muda só quando o HTML muda
const etag = '"' + crypto.createHash('md5').update(html).digest('hex').slice(0,12) + '"';

// O nome do cache dentro do sw.js era fixo (hardcoded, tipo "finn-v2-8"),
// então um deploy que só mudava finn/index.html nunca mudava os bytes do
// próprio sw.js — e o navegador só percebe "tem Service Worker novo" quando
// o ARQUIVO do SW muda byte a byte, não quando o conteúdo que ele serve
// muda. Resultado: quem fechava e abria o app de novo nunca via o aviso de
// "SW_UPDATED"/banner de atualização, porque o SW nunca era considerado
// "novo" pelo navegador em nenhum desses deploys. Gera o nome do cache a
// partir do mesmo hash do HTML, pra todo deploy virar um sw.js diferente.
const swCacheVersion = crypto.createHash('md5').update(html).digest('hex').slice(0,10);
const swVersioned = sw.replace(/const CACHE = '[^']*';/, "const CACHE = 'finn-" + swCacheVersion + "';");

// URL/chave pública do Supabase — usadas para validar o access_token de quem
// chama endpoints server-side que precisam saber "quem está autenticado"
// (push/subscribe, pluggy).
const SUPA_URL_SERVER = 'https://zblkznobqcztvznycyyo.supabase.co';
const SUPA_ANON_KEY_SERVER = 'sb_publishable_Zf-YkojOUHWDtuP_0B6BAA_dvbJguJb';

// Conta master do Finn — só esse email pode chamar as rotas /admin/*.
const MASTER_EMAIL = 'finn.controle01@gmail.com';

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

// Valida um access_token Supabase e retorna o usuário autenticado (ou null)
async function _supaAuth(token) {
  if (!token) return null;
  try {
    var r = await fetch('${SUPA_URL_SERVER}/auth/v1/user', {
      headers: { apikey: '${SUPA_ANON_KEY_SERVER}', Authorization: 'Bearer ' + token }
    });
    if (!r.ok) return null;
    var user = await r.json();
    return user && user.id ? user : null;
  } catch (e) {
    return null;
  }
}

// POST /pluggy/token — retorna { accessToken }
async function _pluggyToken(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    if (!env.PLUGGY_CLIENT_ID || !env.PLUGGY_CLIENT_SECRET) {
      return new Response(JSON.stringify({ error: 'Secrets não configurados: PLUGGY_CLIENT_ID=' + (env.PLUGGY_CLIENT_ID ? 'ok' : 'MISSING') + ' PLUGGY_CLIENT_SECRET=' + (env.PLUGGY_CLIENT_SECRET ? 'ok' : 'MISSING') }), { status: 500, headers: cors });
    }
    var apiKey = await _pluggyApiKey(env);
    var r = await fetch('https://api.pluggy.ai/connect_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
      body: JSON.stringify({ clientUserId: authUser.id })
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

// POST /pluggy/link — registra no KV que este itemId (conexão bancária)
// pertence ao usuário autenticado. O front precisa chamar isso logo depois
// que o widget de Connect do Pluggy retorna um itemId, ANTES de tentar ler
// as transações — sem esse registro, /pluggy/transactions não sabe de quem
// é o item e recusa (fail-closed).
async function _pluggyLink(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    if (!body.itemId) return new Response(JSON.stringify({ error: 'itemId required' }), { status: 400, headers: cors });
    if (env.FINN_KV) await env.FINN_KV.put('pluggy_owner_' + body.itemId, authUser.id);
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// GET /pluggy/transactions?itemId=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD&access_token=xxx
async function _pluggyTx(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    var itemId = url.searchParams.get('itemId');
    if (!itemId) return new Response(JSON.stringify({ error: 'itemId required' }), { status: 400, headers: cors });
    // O itemId é um identificador da Pluggy, não do Finn — sem checar dono,
    // qualquer usuário autenticado podia ler o extrato bancário de qualquer
    // outra pessoa só adivinhando/observando o itemId dela.
    var owner = env.FINN_KV ? await env.FINN_KV.get('pluggy_owner_' + itemId) : null;
    if (owner !== authUser.id) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
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

// ── Web Push (RFC 8030/8291) — VAPID + aes128gcm, sem libs externas ─────────
const pushFns = `
// Hash do endpoint inteiro (não só um prefixo) — endpoints de push do mesmo
// navegador/serviço (ex.: todo usuário Chrome começa com
// "https://fcm.googleapis.com/fcm/send/...") compartilhavam os mesmos 24
// bytes iniciais, colidindo na mesma chave do KV e fazendo cada nova
// inscrição sobrescrever a anterior — só o último usuário recebia push.
async function _pushKey(endpoint) {
  var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint));
  var hex = Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  return 'push_sub_' + hex;
}

function _b64urlEncode(buf) {
  var bin = '';
  for (var i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}

function _b64urlDecode(str) {
  var s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  var bin = atob(s);
  var buf = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

function _concatBytes(arrs) {
  var len = 0;
  for (var i = 0; i < arrs.length; i++) len += arrs[i].length;
  var out = new Uint8Array(len);
  var off = 0;
  for (var i = 0; i < arrs.length; i++) { out.set(arrs[i], off); off += arrs[i].length; }
  return out;
}

async function _hkdf(salt, ikm, info, len) {
  var key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  var bits = await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: salt, info: info }, key, len * 8);
  return new Uint8Array(bits);
}

async function _vapidJWT(audience, env) {
  var header = { typ: 'JWT', alg: 'ES256' };
  var payload = { aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'mailto:Finn.controle01@gmail.com' };
  var enc = new TextEncoder();
  var headerB64 = _b64urlEncode(enc.encode(JSON.stringify(header)));
  var payloadB64 = _b64urlEncode(enc.encode(JSON.stringify(payload)));
  var unsigned = headerB64 + '.' + payloadB64;
  var pubRaw = _b64urlDecode(env.VAPID_PUBLIC_KEY);
  var x = pubRaw.slice(1, 33), y = pubRaw.slice(33, 65);
  var d = _b64urlDecode(env.VAPID_PRIVATE_KEY);
  var jwk = { kty: 'EC', crv: 'P-256', x: _b64urlEncode(x), y: _b64urlEncode(y), d: _b64urlEncode(d), ext: true };
  var key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  var sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(unsigned));
  return unsigned + '.' + _b64urlEncode(new Uint8Array(sig));
}

async function _encryptPush(payloadStr, p256dhB64, authB64, env) {
  var enc = new TextEncoder();
  var plaintext = enc.encode(payloadStr);
  var userPublicRaw = _b64urlDecode(p256dhB64);
  var authSecret = _b64urlDecode(authB64);

  var serverKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  var serverPublicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeyPair.publicKey));
  var userPublicKey = await crypto.subtle.importKey('raw', userPublicRaw, { name: 'ECDH', namedCurve: 'P-256' }, [], []);
  var sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: userPublicKey }, serverKeyPair.privateKey, 256));

  var prkInfo = _concatBytes([enc.encode('WebPush: info\\0'), userPublicRaw, serverPublicRaw]);
  var prk = await _hkdf(authSecret, sharedSecret, prkInfo, 32);

  var salt = crypto.getRandomValues(new Uint8Array(16));
  var cek = await _hkdf(salt, prk, enc.encode('Content-Encoding: aes128gcm\\0'), 16);
  var nonce = await _hkdf(salt, prk, enc.encode('Content-Encoding: nonce\\0'), 12);

  var padded = _concatBytes([plaintext, new Uint8Array([2])]);
  var cekKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  var ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, cekKey, padded));

  var rsVal = 4096;
  var rs = new Uint8Array([(rsVal >>> 24) & 0xff, (rsVal >>> 16) & 0xff, (rsVal >>> 8) & 0xff, rsVal & 0xff]);
  var header = _concatBytes([salt, rs, new Uint8Array([serverPublicRaw.length]), serverPublicRaw]);
  return _concatBytes([header, ciphertext]);
}

async function _sendPush(sub, payloadObj, env) {
  var audience = new URL(sub.endpoint).origin;
  var jwt = await _vapidJWT(audience, env);
  var body = await _encryptPush(JSON.stringify(payloadObj), sub.keys.p256dh, sub.keys.auth, env);
  return fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
      'Authorization': 'vapid t=' + jwt + ', k=' + env.VAPID_PUBLIC_KEY
    },
    body: body
  });
}

function _fixedDueSoon(fixed) {
  var now = new Date();
  var ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  var todayDay = now.getDate();
  return fixed.filter(function(f) {
    var launched = (f.launched_months || []).indexOf(ym) !== -1;
    if (launched) return false;
    var diff = Number(f.day_of_month) - todayDay;
    return diff <= 5 && diff >= -5;
  });
}

async function checkFixedDueAndNotify(env) {
  if (!env.FINN_KV || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.SUPABASE_SERVICE_KEY) return;
  var list = await env.FINN_KV.list({ prefix: 'push_sub_' });
  for (var i = 0; i < list.keys.length; i++) {
    try {
      var raw = await env.FINN_KV.get(list.keys[i].name);
      if (!raw) continue;
      var sub = JSON.parse(raw);
      if (!sub.user_id || !sub.endpoint || !sub.keys) continue;

      var r = await fetch('${SUPA_URL_SERVER}/rest/v1/fixed_accounts?user_id=eq.' + sub.user_id, {
        headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
      });
      if (!r.ok) continue;
      var fixed = await r.json();
      var due = _fixedDueSoon(fixed);
      if (!due.length) continue;

      var despesas = due.filter(function(f) { return f.type !== 'receita'; });
      var receitas = due.filter(function(f) { return f.type === 'receita'; });

      if (despesas.length) {
        var body = despesas.length === 1
          ? despesas[0].description + ' — R$ ' + Number(despesas[0].value).toFixed(2)
          : despesas.length + ' contas fixas perto do vencimento';
        await _sendPush(sub, { title: 'Finn · Contas fixas', body: body, url: '/' }, env);
      }
      if (receitas.length) {
        var rbody = receitas.length === 1
          ? receitas[0].description + ' — R$ ' + Number(receitas[0].value).toFixed(2)
          : receitas.length + ' receitas fixas a caminho';
        await _sendPush(sub, { title: 'Finn · Receita a caminho', body: rbody, url: '/' }, env);
      }
    } catch (e) { /* uma falha numa inscrição não deve interromper as outras */ }
  }
}

function _weeklyBounds() {
  var now = new Date();
  var today = now.toISOString().slice(0, 10);
  var d7 = new Date(now); d7.setDate(d7.getDate() - 7);
  var d14 = new Date(now); d14.setDate(d14.getDate() - 14);
  return { today: today, d7: d7.toISOString().slice(0, 10), d14: d14.toISOString().slice(0, 10) };
}

async function sendWeeklySummary(env) {
  if (!env.FINN_KV || !env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.SUPABASE_SERVICE_KEY) return;
  var b = _weeklyBounds();
  var list = await env.FINN_KV.list({ prefix: 'push_sub_' });
  for (var i = 0; i < list.keys.length; i++) {
    try {
      var raw = await env.FINN_KV.get(list.keys[i].name);
      if (!raw) continue;
      var sub = JSON.parse(raw);
      if (!sub.user_id || !sub.endpoint || !sub.keys) continue;

      var r = await fetch('${SUPA_URL_SERVER}/rest/v1/transactions?user_id=eq.' + sub.user_id + '&date=gte.' + b.d14 + '&select=date,value,type', {
        headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
      });
      if (!r.ok) continue;
      var txs = await r.json();
      if (!txs.length) continue;

      var curTotal = 0, prevTotal = 0;
      txs.forEach(function (t) {
        if (t.type === 'receita') return;
        var v = Number(t.value);
        if (t.date > b.d7 && t.date <= b.today) curTotal += v;
        else if (t.date > b.d14 && t.date <= b.d7) prevTotal += v;
      });
      if (curTotal <= 0) continue;

      var body;
      if (prevTotal > 0) {
        var pct = Math.round(((curTotal - prevTotal) / prevTotal) * 100);
        var cmp = pct > 0 ? (pct + '% acima da semana anterior') : (pct < 0 ? (Math.abs(pct) + '% abaixo da semana anterior') : 'igual à semana anterior');
        body = 'Você gastou R$ ' + curTotal.toFixed(2) + ' essa semana — ' + cmp + '.';
      } else {
        body = 'Você gastou R$ ' + curTotal.toFixed(2) + ' essa semana.';
      }
      await _sendPush(sub, { title: 'Finn · Resumo da semana', body: body, url: '/' }, env);
    } catch (e) { /* uma falha numa inscrição não deve interromper as outras */ }
  }
}
`;

// ── Assinaturas (Mercado Pago) — planos Free/Plus/Pro ───────────────────────
const billingFns = `
function _planPrice(plan) {
  if (plan === 'plus') return 19.90;
  if (plan === 'pro') return 29.90;
  return null;
}

// x-signature: "ts=<ms>,v1=<hmac hex>" — valida que a notificação veio
// mesmo do Mercado Pago antes de confiar no data.id pra buscar o recurso.
async function _mpVerifySignature(request, dataId, secret) {
  var sigHeader = request.headers.get('x-signature') || '';
  var reqId = request.headers.get('x-request-id') || '';
  if (!sigHeader || !dataId) return false;
  var ts = '', v1 = '';
  sigHeader.split(',').forEach(function(part) {
    var idx = part.indexOf('=');
    if (idx === -1) return;
    var k = part.slice(0, idx).trim(), v = part.slice(idx + 1).trim();
    if (k === 'ts') ts = v;
    if (k === 'v1') v1 = v;
  });
  if (!ts || !v1) return false;
  var manifest = 'id:' + String(dataId).toLowerCase() + ';request-id:' + reqId + ';ts:' + ts + ';';
  var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  var hex = Array.from(new Uint8Array(sig)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  if (hex.length !== v1.length) return false;
  var diff = 0; // comparação em tempo constante
  for (var i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}

// Upsert por user_id (on_conflict) — cria a linha na primeira cobrança de
// alguém, atualiza nas seguintes. Só o Worker (service key) escreve aqui.
async function _subaUpsertSubscription(userId, fields, env) {
  if (!env.SUPABASE_SERVICE_KEY) return;
  var payload = Object.assign({ user_id: userId, updated_at: new Date().toISOString() }, fields);
  await fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?on_conflict=user_id', {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_KEY,
      Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(payload)
  });
}

// Lê o plano/uso de IA do usuário. Sem linha na tabela = free (nunca
// assinou nada ainda) — não é erro, é o estado inicial de todo mundo.
async function _subaGetSubscription(userId, env) {
  if (!env.SUPABASE_SERVICE_KEY) return { plan: 'free', status: 'active', ai_usage_count: 0, ai_usage_month: null };
  try {
    var r = await fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?user_id=eq.' + userId + '&select=*', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    if (!r.ok) return { plan: 'free', status: 'active', ai_usage_count: 0, ai_usage_month: null };
    var rows = await r.json();
    return rows[0] || { plan: 'free', status: 'active', ai_usage_count: 0, ai_usage_month: null };
  } catch (e) {
    return { plan: 'free', status: 'active', ai_usage_count: 0, ai_usage_month: null };
  }
}

async function _subaIncrementAiUsage(userId, currentSub, env) {
  var thisMonth = new Date().toISOString().slice(0, 7);
  var sameMonth = currentSub && currentSub.ai_usage_month === thisMonth;
  var newCount = (sameMonth ? (currentSub.ai_usage_count || 0) : 0) + 1;
  await _subaUpsertSubscription(userId, { ai_usage_count: newCount, ai_usage_month: thisMonth }, env);
}

// POST /billing/checkout — cria uma assinatura recorrente (preapproval) no
// Mercado Pago pro plano escolhido e devolve a URL de pagamento.
async function _billingCheckout(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.MP_ACCESS_TOKEN) return new Response(JSON.stringify({ error: 'Pagamentos ainda não configurados' }), { status: 500, headers: cors });
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    var price = _planPrice(body.plan);
    if (!price) return new Response(JSON.stringify({ error: 'plano inválido' }), { status: 400, headers: cors });

    var origin = new URL(request.url).origin;
    var r = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.MP_ACCESS_TOKEN },
      body: JSON.stringify({
        reason: 'Finn ' + (body.plan === 'pro' ? 'Pro' : 'Plus') + ' — assinatura mensal',
        // user_id + plano juntos no external_reference: assim o webhook
        // sabe pra quem e qual plano liberar sem precisar de outra tabela.
        external_reference: authUser.id + '|' + body.plan,
        payer_email: authUser.email,
        back_url: origin + '/?billing=return',
        auto_recurring: { frequency: 1, frequency_type: 'months', transaction_amount: price, currency_id: 'BRL' }
      })
    });
    var j = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: (j && j.message) || 'Falha ao criar assinatura' }), { status: 502, headers: cors });
    return new Response(JSON.stringify({ url: j.init_point }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// POST /billing/webhook — notificações do Mercado Pago (pagamento aprovado,
// assinatura autorizada/pausada/cancelada).
async function _billingWebhook(request, env) {
  var rawBody = await request.text();
  var url = new URL(request.url);
  var body = {};
  try { body = JSON.parse(rawBody); } catch (e0) {}
  var topic = body.type || body.topic || url.searchParams.get('type') || url.searchParams.get('topic') || '';
  var dataId = (body.data && body.data.id) || url.searchParams.get('data.id') || url.searchParams.get('id') || '';

  if (env.MP_WEBHOOK_SECRET) {
    var valid = await _mpVerifySignature(request, dataId, env.MP_WEBHOOK_SECRET);
    if (!valid) return new Response('Forbidden', { status: 403 });
  }

  try {
    if (topic === 'payment' && dataId && env.MP_ACCESS_TOKEN) {
      var pr = await fetch('https://api.mercadopago.com/v1/payments/' + dataId, {
        headers: { 'Authorization': 'Bearer ' + env.MP_ACCESS_TOKEN }
      });
      if (pr.ok) {
        var payment = await pr.json();
        var parts = (payment.external_reference || '').split('|');
        var userId = parts[0], plan = parts[1];
        if (userId && plan && payment.status === 'approved') {
          var periodEnd = new Date(); periodEnd.setMonth(periodEnd.getMonth() + 1);
          await _subaUpsertSubscription(userId, {
            plan: plan, status: 'active',
            mp_payment_id: String(payment.id),
            current_period_end: periodEnd.toISOString()
          }, env);
        }
      }
    } else if ((topic === 'preapproval' || topic === 'subscription_preapproval') && dataId && env.MP_ACCESS_TOKEN) {
      var sr = await fetch('https://api.mercadopago.com/preapproval/' + dataId, {
        headers: { 'Authorization': 'Bearer ' + env.MP_ACCESS_TOKEN }
      });
      if (sr.ok) {
        var sub = await sr.json();
        var sparts = (sub.external_reference || '').split('|');
        var suserId = sparts[0], splan = sparts[1];
        if (suserId && splan) {
          if (sub.status === 'authorized') {
            var pe = new Date(); pe.setMonth(pe.getMonth() + 1);
            await _subaUpsertSubscription(suserId, {
              plan: splan, status: 'active', mp_subscription_id: String(dataId),
              current_period_end: pe.toISOString()
            }, env);
          } else {
            // Pausada/cancelada: não revoga na hora — o período já pago
            // continua valendo até current_period_end vencer. Quem faz a
            // baixa de verdade é o cron de assinaturas vencidas.
            await _subaUpsertSubscription(suserId, {
              status: sub.status === 'cancelled' ? 'cancelled' : 'past_due',
              mp_subscription_id: String(dataId)
            }, env);
          }
        }
      }
    } else if (topic === 'subscription_authorized_payment' && dataId && env.MP_ACCESS_TOKEN) {
      // Cobrança recorrente de um mês já em andamento (não a primeira) — sem
      // isso, current_period_end só era estendido na assinatura inicial e o
      // cron derrubava o acesso do assinante ativo no mês seguinte.
      var apr = await fetch('https://api.mercadopago.com/authorized_payments/' + dataId, {
        headers: { 'Authorization': 'Bearer ' + env.MP_ACCESS_TOKEN }
      });
      if (apr.ok) {
        var apPayment = await apr.json();
        var apParts = (apPayment.external_reference || '').split('|');
        var apUserId = apParts[0], apPlan = apParts[1];
        if (apUserId && apPlan && apPayment.status === 'approved') {
          var apPeriodEnd = new Date(); apPeriodEnd.setMonth(apPeriodEnd.getMonth() + 1);
          await _subaUpsertSubscription(apUserId, {
            plan: apPlan, status: 'active',
            mp_subscription_id: apPayment.preapproval_id ? String(apPayment.preapproval_id) : undefined,
            current_period_end: apPeriodEnd.toISOString()
          }, env);
        }
      }
    }
  } catch (e) {
    // Nunca devolve 500 aqui — a Mercado Pago reenviaria pra sempre. Pior
    // caso é a assinatura só atualizar no próximo evento.
  }
  return new Response('OK', { status: 200 });
}

// Cron diário: rede de segurança pro caso de algum webhook ter falhado —
// qualquer plano pago com current_period_end vencido perde o acesso.
async function checkExpiredSubscriptions(env) {
  if (!env.SUPABASE_SERVICE_KEY) return;
  var nowIso = new Date().toISOString();
  var r = await fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?plan=neq.free&current_period_end=lt.' + encodeURIComponent(nowIso), {
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
  });
  if (!r.ok) return;
  var expired = await r.json();
  for (var i = 0; i < expired.length; i++) {
    try {
      await fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?user_id=eq.' + expired[i].user_id, {
        method: 'PATCH',
        headers: {
          apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: 'free', status: 'past_due', updated_at: new Date().toISOString() })
      });
    } catch (e) { /* uma falha não deve travar as outras */ }
  }
}

var MASTER_EMAIL = '${MASTER_EMAIL}';
function _isMasterUser(authUser) {
  return !!(authUser && authUser.email && authUser.email.toLowerCase() === MASTER_EMAIL.toLowerCase());
}

// Segunda trava além do login do Google/Supabase: mesmo sendo o email
// master, só libera Pro/admin com essa senha (wrangler secret
// MASTER_ADMIN_PASSWORD) — sem ela configurada, ninguém passa.
function _masterPasswordOk(env, password) {
  return !!(env.MASTER_ADMIN_PASSWORD && password && password === env.MASTER_ADMIN_PASSWORD);
}

// POST /admin/login — { access_token, password } — o app chama isso uma vez
// pra "destravar" a sessão de admin; as rotas /admin/* e o bypass do /ai
// conferem a senha de novo a cada chamada, isso aqui só valida antes de
// mostrar o painel.
async function _adminLogin(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, body.password)) return new Response(JSON.stringify({ error: 'senha incorreta' }), { status: 403, headers: cors });
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// Busca um usuário do Supabase Auth pelo email via Admin API (exige service
// role) — usado só pelas rotas /admin/* pra achar o user_id de quem a conta
// master quer consultar/alterar.
async function _adminFindUserByEmail(email, env) {
  if (!env.SUPABASE_SERVICE_KEY || !email) return null;
  var r = await fetch('${SUPA_URL_SERVER}/auth/v1/admin/users?email=' + encodeURIComponent(email), {
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
  });
  if (!r.ok) return null;
  var j = await r.json();
  var users = j.users || j || [];
  return users[0] || null;
}

// GET /admin/subscriptions?access_token=... — lista todo mundo que já tem
// linha na tabela subscriptions, com o email de cada um (só a conta master).
async function _adminListSubscriptions(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, url.searchParams.get('admin_password'))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'Supabase service key não configurada' }), { status: 500, headers: cors });

    var subsR = await fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?select=*&order=updated_at.desc', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    var subs = subsR.ok ? await subsR.json() : [];

    // Mapeia user_id -> email via Admin API (paginado, até 5 páginas = 1000 usuários)
    var emailById = {};
    for (var page = 1; page <= 5; page++) {
      var ur = await fetch('${SUPA_URL_SERVER}/auth/v1/admin/users?page=' + page + '&per_page=200', {
        headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
      });
      if (!ur.ok) break;
      var uj = await ur.json();
      var list = uj.users || [];
      if (!list.length) break;
      for (var i = 0; i < list.length; i++) emailById[list[i].id] = list[i].email;
      if (list.length < 200) break;
    }

    var out = subs.map(function(s) {
      return {
        user_id: s.user_id, email: emailById[s.user_id] || '(desconhecido)',
        plan: s.plan, status: s.status, current_period_end: s.current_period_end,
        ai_usage_count: s.ai_usage_count, ai_usage_month: s.ai_usage_month
      };
    });
    return new Response(JSON.stringify({ subscriptions: out }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// POST /admin/subscriptions/set — { access_token, target_email, plan } — só a
// conta master pode chamar. Troca o plano de qualquer usuário na mão (ex:
// liberar Pro pra um amigo testando, sem precisar passar pelo Mercado Pago).
async function _adminSetSubscription(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, body.admin_password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (['free', 'plus', 'pro'].indexOf(body.plan) === -1) return new Response(JSON.stringify({ error: 'plano inválido' }), { status: 400, headers: cors });
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'Supabase service key não configurada' }), { status: 500, headers: cors });

    var target = await _adminFindUserByEmail(body.target_email, env);
    if (!target) return new Response(JSON.stringify({ error: 'usuário não encontrado' }), { status: 404, headers: cors });

    var fields = { plan: body.plan, status: 'active' };
    if (body.plan !== 'free') {
      var far = new Date(); far.setFullYear(far.getFullYear() + 50);
      fields.current_period_end = far.toISOString();
    }
    await _subaUpsertSubscription(target.id, fields, env);
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// Busca todos os usuários via Admin API, paginado (até 10 páginas = 2000
// contas — sobra folga por um bom tempo). Mesmo helper de paginação que
// _adminListSubscriptions já usa, só que devolvendo o objeto inteiro (não só
// o email) já que o painel de uso precisa de created_at/last_sign_in_at/metadata.
async function _adminListAllUsers(env) {
  var all = [];
  for (var page = 1; page <= 10; page++) {
    var r = await fetch('${SUPA_URL_SERVER}/auth/v1/admin/users?page=' + page + '&per_page=200', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    if (!r.ok) break;
    var j = await r.json();
    var list = j.users || [];
    if (!list.length) break;
    all = all.concat(list);
    if (list.length < 200) break;
  }
  return all;
}

// Conta quantos user_id DISTINTOS têm pelo menos uma linha numa tabela —
// PostgREST não tem "count distinct" pronto via header, então busca só a
// coluna user_id (tabelas pequenas, não pesa) e deduplica aqui.
async function _distinctUserCount(table, env) {
  var r = await fetch('${SUPA_URL_SERVER}/rest/v1/' + table + '?select=user_id', {
    headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
  });
  if (!r.ok) return 0;
  var rows = await r.json();
  var set = {};
  for (var i = 0; i < rows.length; i++) set[rows[i].user_id] = true;
  return Object.keys(set).length;
}

// GET /admin/analytics?access_token=...&admin_password=... — painel de uso
// (só a conta master). Tudo lido ao vivo do Supabase via SUPABASE_SERVICE_KEY
// (contorna RLS de propósito, só pra essa rota admin) — sem cache, cada
// carregamento reflete o estado atual do banco.
async function _adminAnalytics(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, url.searchParams.get('admin_password'))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'Supabase service key não configurada' }), { status: 500, headers: cors });

    var svcHeaders = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY };

    var usersP = _adminListAllUsers(env);
    var txP = fetch('${SUPA_URL_SERVER}/rest/v1/transactions?select=user_id,value,type,created_at', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var subsP = fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?select=user_id,plan,status,ai_usage_count', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var featureTables = ['spending_limits', 'goals', 'fixed_accounts', 'splits', 'debts', 'credit_cards', 'categories'];
    var featureP = Promise.all(featureTables.map(function(t) { return _distinctUserCount(t, env); }));

    var users = await usersP;
    var txs = await txP;
    var subs = await subsP;
    var featureCounts = await featureP;

    var totalUsers = users.length;

    // agregados por usuário (lançamentos + primeiro/último dia de atividade)
    var txByUser = {};
    var txByDay = {};
    txs.forEach(function(t) {
      if (!txByUser[t.user_id]) txByUser[t.user_id] = { count: 0, days: {} };
      txByUser[t.user_id].count++;
      var day = (t.created_at || '').slice(0, 10);
      if (day) {
        txByUser[t.user_id].days[day] = true;
        txByDay[day] = (txByDay[day] || 0) + 1;
      }
    });

    var subByUser = {};
    subs.forEach(function(s) { subByUser[s.user_id] = s; });

    // cadastros por semana (segunda-feira como início, igual ao date_trunc('week') do Postgres)
    function weekStart(iso) {
      var d = new Date(iso + 'T00:00:00Z');
      var day = d.getUTCDay(); // 0=domingo
      var diff = (day === 0 ? -6 : 1) - day;
      d.setUTCDate(d.getUTCDate() + diff);
      return d.toISOString().slice(0, 10);
    }
    var signupsByWeek = {};
    users.forEach(function(u) {
      var wk = weekStart((u.created_at || '').slice(0, 10));
      signupsByWeek[wk] = (signupsByWeek[wk] || 0) + 1;
    });

    var usersOut = users.map(function(u) {
      var meta = u.user_metadata || u.raw_user_meta_data || {};
      var tx = txByUser[u.id] || { count: 0, days: {} };
      var sub = subByUser[u.id];
      var returned = !!(u.last_sign_in_at && u.created_at && (new Date(u.last_sign_in_at) - new Date(u.created_at)) > 5 * 60 * 1000);
      return {
        id: u.id,
        email: u.email,
        name: meta.full_name || meta.name || (u.email || '').split('@')[0],
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
        returned: returned,
        internal: !!(u.email && u.email.toLowerCase() === MASTER_EMAIL.toLowerCase()),
        has_whatsapp: !!meta.whatsapp,
        has_telegram: !!meta.telegram_chat_id,
        plan: (sub && sub.plan) || 'free',
        ai_usage_count: (sub && sub.ai_usage_count) || 0,
        tx_count: tx.count,
        active_days: Object.keys(tx.days).length
      };
    }).sort(function(a, b) { return b.tx_count - a.tx_count; });

    var returnedCount = usersOut.filter(function(u) { return u.returned; }).length;

    var out = {
      ok: true,
      generated_at: new Date().toISOString(),
      totals: {
        users: totalUsers,
        transactions: txs.length,
        returned: returnedCount,
        returned_pct: totalUsers ? Math.round(returnedCount / totalUsers * 100) : 0
      },
      signups_by_week: Object.keys(signupsByWeek).sort().map(function(wk) { return { week: wk, count: signupsByWeek[wk] }; }),
      active_days: Object.keys(txByDay).sort().map(function(d) { return { day: d, count: txByDay[d] }; }),
      feature_adoption: featureTables.map(function(t, i) {
        return { table: t, users: featureCounts[i], pct: totalUsers ? Math.round(featureCounts[i] / totalUsers * 100) : 0 };
      }).concat([
        { table: 'transactions', users: Object.keys(txByUser).length, pct: totalUsers ? Math.round(Object.keys(txByUser).length / totalUsers * 100) : 0 },
        { table: 'whatsapp', users: usersOut.filter(function(u) { return u.has_whatsapp; }).length, pct: totalUsers ? Math.round(usersOut.filter(function(u) { return u.has_whatsapp; }).length / totalUsers * 100) : 0 },
        { table: 'telegram', users: usersOut.filter(function(u) { return u.has_telegram; }).length, pct: totalUsers ? Math.round(usersOut.filter(function(u) { return u.has_telegram; }).length / totalUsers * 100) : 0 }
      ]),
      users: usersOut
    };
    return new Response(JSON.stringify(out), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// POST /beta/signup — { name, email, contact, website } — endpoint público
// (sem autenticação; é a própria página de inscrição de testers, /beta).
// Não existe controle de acesso ao Finn hoje (qualquer login do Google já
// entra), então essa rota é só captação + e-mail de boas-vindas com contato
// direto — grava no KV (sem precisar de tabela nova no Supabase) e manda o
// e-mail via Resend, se a chave estiver configurada.
async function _betaSignup(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var name = (body.name || '').trim().slice(0, 120);
    var email = (body.email || '').trim().slice(0, 200);
    var contact = (body.contact || '').trim().slice(0, 120);

    // honeypot: campo escondido no form que só um bot preencheria. Finge
    // sucesso (não dá dica pro bot de que foi bloqueado) mas não grava nem manda e-mail.
    if (body.website) return new Response(JSON.stringify({ ok: true }), { headers: cors });

    if (!name || !email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Nome e e-mail válido são obrigatórios.' }), { status: 400, headers: cors });
    }

    // Guarda o resultado do envio do e-mail JUNTO com a inscrição — sem isso,
    // um erro do Resend (chave errada, domínio não verificado, etc.) sumia
    // sem deixar rastro nenhum: a inscrição aparecia como sucesso do mesmo
    // jeito (de propósito, pra nunca travar por causa do e-mail), mas
    // ninguém — nem eu — conseguia saber se o e-mail realmente saiu.
    var emailStatus = { attempted: false };
    if (env.RESEND_API_KEY) {
      emailStatus.attempted = true;
      try {
        var resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Finn <contato@finn.dev.br>',
            to: [email],
            reply_to: 'Finn.controle01@gmail.com',
            subject: 'Bem-vindo(a) ao grupo de testers do Finn! 🎉',
            html: _betaWelcomeEmailHtml(name)
          })
        });
        var resendText = await resendResp.text();
        emailStatus.ok = resendResp.ok;
        emailStatus.status = resendResp.status;
        emailStatus.response = resendText.slice(0, 500);
      } catch (eMail) {
        emailStatus.ok = false;
        emailStatus.error = String(eMail && eMail.message || eMail);
      }
    }

    if (env.FINN_KV) {
      var signupId = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      await env.FINN_KV.put('beta_signup_' + signupId, JSON.stringify({
        name: name, email: email, contact: contact, created_at: new Date().toISOString(), email_status: emailStatus
      }));
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// GET /admin/beta-signups?access_token=...&admin_password=... — lista as
// inscrições recentes do /beta com o status do envio do e-mail (só a
// conta master) — único jeito de ver se o Resend está funcionando de verdade.
async function _adminBetaSignups(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, url.searchParams.get('admin_password'))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.FINN_KV) return new Response(JSON.stringify({ signups: [] }), { headers: cors });

    var keys = [];
    var cursor;
    do {
      var page = await env.FINN_KV.list({ prefix: 'beta_signup_', cursor: cursor });
      keys = keys.concat(page.keys);
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    keys.sort(function(a, b) { return b.name.localeCompare(a.name); });

    var signups = (await Promise.all(keys.slice(0, 100).map(function(k) { return env.FINN_KV.get(k.name); })))
      .filter(Boolean).map(function(raw) { return JSON.parse(raw); });
    return new Response(JSON.stringify({ signups: signups }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

function _betaWelcomeEmailHtml(name) {
  var safeName = String(name || 'tudo bem').replace(/[<>&]/g, function(c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; });
  // Gmail (e outros) reescrevem cores automaticamente no "modo escuro" —
  // <div style="background:..."> costuma ser convertido/removido, deixando
  // a marca "F" flutuando sem o quadrado por trás (foi exatamente o que
  // aconteceu). Duas correções: força modo claro via meta tag (respeitada
  // pelo Gmail/Apple Mail) e troca a marca por uma <table>/<td bgcolor="…">
  // com o atributo bgcolor de verdade, que sobrevive à reescrita bem melhor
  // do que background-color via CSS inline num <div>.
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">' +
    '<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">' +
    '</head>' +
    '<body style="margin:0;padding:0;background:#F8F7F4;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#F8F7F4" style="background:#F8F7F4;padding:32px 16px">' +
    '<tr><td align="center">' +
    '<table role="presentation" width="100%" bgcolor="#ffffff" style="max-width:480px;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden">' +
    '<tr><td style="padding:28px 28px 0">' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
      '<td width="32" height="32" bgcolor="#1E293B" style="background:#1E293B;border-radius:9px;text-align:center;vertical-align:middle;color:#F97316;font-weight:800;font-size:15px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif">F</td>' +
      '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding:20px 28px 8px">' +
      '<h1 style="margin:0;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.02em">Bem-vindo(a), ' + safeName + '! 🎉</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 20px">' +
      '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.6;color:#334155">Você agora faz parte do grupo de testers do <b>Finn.</b> — obrigado por topar experimentar em primeira mão!</p>' +
      '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.6;color:#334155">O app já está pronto pra usar, é 100% grátis, e você pode entrar agora mesmo com sua conta Google:</p>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 24px">' +
      '<a href="https://finn.dev.br" style="display:block;text-align:center;background:#F97316;color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;border-radius:10px;padding:14px">Abrir o Finn →</a>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 8px">' +
      '<p style="margin:0 0 12px;font-size:13.5px;line-height:1.6;color:#64748B">Como é uma fase de testes, é bem provável que você encontre algum bug ou algo que ainda não funcione direito — <b style="color:#1E293B">isso é super esperado</b>, e é exatamente pra isso que estou aqui. Qualquer coisa, me chama direto:</p>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 28px">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>WhatsApp:</b> <a href="https://wa.me/5513992102413" style="color:#F97316;text-decoration:none">(13) 99210-2413</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>Instagram:</b> <a href="https://www.instagram.com/finn.finnance" style="color:#F97316;text-decoration:none">@finn.finnance</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>E-mail:</b> <a href="mailto:Finn.controle01@gmail.com" style="color:#F97316;text-decoration:none">Finn.controle01@gmail.com</a></td>' +
      '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px;border-top:1px solid #E2E8F0" bgcolor="#F8F7F4">' +
      '<p style="margin:0;font-size:11.5px;color:#94A3B8;line-height:1.5">Você recebeu esse e-mail porque se inscreveu no grupo de testers em finn.dev.br/beta. Não é uma lista de e-mail marketing — é só isso mesmo, um "oi, bem-vindo(a)".</p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';
}

// =============================================================================
// INSTAGRAM — publicação automática dos 5 posts da campanha do beta, 1 por dia
// =============================================================================
// Required secrets (configurados via wrangler secret / dashboard):
//   IG_ACCESS_TOKEN        — token de longa duração gerado pela "API do
//                             Instagram com login do Instagram" (fluxo novo,
//                             sem Página do Facebook), com as permissões
//                             instagram_business_basic +
//                             instagram_business_content_publish. Esse token
//                             SÓ funciona em graph.instagram.com — não em
//                             graph.facebook.com (formato de token diferente).
//   IG_BUSINESS_ACCOUNT_ID — ID numérico da conta do Instagram (mostrado na
//                             própria tela de "Gerar tokens de acesso").
// Sem os dois configurados, a publicação automática só faz log e não tenta
// nada — nunca falha travando o cron nem quebra outra coisa no worker.
const IG_API_VERSION = 'v21.0';
const IG_CAPTIONS = [
  'Testa o Finn antes de todo mundo 🚀\\n\\nAbri um grupo de testers com vagas limitadas — você me ajuda a melhorar o app e eu dou boas-vindas pessoalmente, com suporte direto por WhatsApp, Instagram ou e-mail.\\n\\nLink na bio pra se inscrever 👆\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  'Chega de planilha 📊\\n\\nImporta o extrato do seu banco (Nubank, Itaú, Bradesco, BB, Inter, C6 Bank e mais) e o Finn organiza tudo sozinho — receitas, despesas e categorias, sem digitar nada na mão.\\n\\n#educacaofinanceira #financaspessoais #organizacaofinanceira',
  'IA financeira. De graça. 🤖\\n\\nAnálise dos seus gastos, sugestões de economia e previsão de saldo do mês — tudo incluso, sem plano pago e sem letra miúda.\\n\\n#inteligenciaartificial #financaspessoais #appfinanceiro',
  'Metas, limites e dívidas — tudo num só lugar 🎯\\n\\nDefina quanto quer gastar por categoria, junte dinheiro pra um objetivo e simule a quitação de uma dívida com juros de verdade.\\n\\n#planejamentofinanceiro #financaspessoais #metas',
  '100% grátis. Sem pegadinha. 🇧🇷\\n\\nSem cartão de crédito pra começar, sem letra miúda — feito pro jeito que o brasileiro realmente vive. Link na bio.\\n\\n#appbrasileiro #financaspessoais #controlefinanceiro'
];

// Publica o próximo post da sequência (1 a 5) — chamado pelo cron diário e
// também pelo endpoint de disparo manual /admin/instagram-publish-next.
async function _publishNextInstagramPost(env) {
  if (!env.IG_ACCESS_TOKEN || !env.IG_BUSINESS_ACCOUNT_ID) {
    return { ok: false, skipped: true, reason: 'IG_ACCESS_TOKEN ou IG_BUSINESS_ACCOUNT_ID não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  var nextIndex = Number((await env.FINN_KV.get('ig_post_next_index')) || '1');
  if (nextIndex > 5) return { ok: false, done: true, reason: 'os 5 posts já foram publicados' };

  var imageUrl = 'https://finn.dev.br/social/post-' + nextIndex + '.png';
  var caption = IG_CAPTIONS[nextIndex - 1];
  var log = { index: nextIndex, image_url: imageUrl, started_at: new Date().toISOString() };

  try {
    // Passo 1: cria o "container" de mídia (a Meta busca a imagem pela URL —
    // não existe upload direto de arquivo nessa API).
    var createResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl, caption: caption, access_token: env.IG_ACCESS_TOKEN })
    });
    var createBody = await createResp.json();
    log.create_status = createResp.status;
    log.create_response = createBody;
    if (!createResp.ok || !createBody.id) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      return { ok: false, step: 'media', body: createBody };
    }

    // Passo 1.5: espera o container terminar de processar. A Meta baixa a
    // imagem da URL de forma assíncrona — publicar cedo demais dá "Media ID
    // is not available" (code 9007, subcode 2207027). Espera até uns 20s.
    var containerReady = false;
    for (var i = 0; i < 10; i++) {
      var statusResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + createBody.id + '?fields=status_code&access_token=' + encodeURIComponent(env.IG_ACCESS_TOKEN));
      var statusBody = await statusResp.json();
      log.container_status = statusBody.status_code || statusBody;
      if (statusBody.status_code === 'FINISHED') { containerReady = true; break; }
      if (statusBody.status_code === 'ERROR') break;
      await new Promise(function (resolve) { setTimeout(resolve, 2000); });
    }
    if (!containerReady) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      return { ok: false, step: 'container_not_ready', body: log.container_status };
    }

    // Passo 2: publica o container criado.
    var publishResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: createBody.id, access_token: env.IG_ACCESS_TOKEN })
    });
    var publishBody = await publishResp.json();
    log.publish_status = publishResp.status;
    log.publish_response = publishBody;

    if (!publishResp.ok || !publishBody.id) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      return { ok: false, step: 'media_publish', body: publishBody };
    }

    log.ok = true;
    log.finished_at = new Date().toISOString();
    await _logInstagramAttempt(env, log);
    // Só avança o índice em caso de sucesso — uma falha (token vencido,
    // rate limit, etc.) tenta o MESMO post de novo no próximo cron, em vez
    // de pular pra frente e nunca publicar o que falhou.
    await env.FINN_KV.put('ig_post_next_index', String(nextIndex + 1));
    return { ok: true, index: nextIndex, media_id: publishBody.id };
  } catch (e) {
    log.ok = false;
    log.error = String(e && e.message || e);
    await _logInstagramAttempt(env, log);
    return { ok: false, error: log.error };
  }
}

async function _logInstagramAttempt(env, log) {
  try {
    var id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    await env.FINN_KV.put('ig_publish_log_' + id, JSON.stringify(log), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch (e) { /* log é best-effort, nunca deve derrubar a publicação */ }
}

// GET /admin/instagram-status?access_token=...&admin_password=... — mostra
// quantos posts já foram (ou faltam) publicar, e o histórico de tentativas.
async function _adminInstagramStatus(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, url.searchParams.get('admin_password'))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var nextIndex = Number((env.FINN_KV ? await env.FINN_KV.get('ig_post_next_index') : null) || '1');
    var logs = [];
    if (env.FINN_KV) {
      var keys = [];
      var cursor;
      do {
        var page = await env.FINN_KV.list({ prefix: 'ig_publish_log_', cursor: cursor });
        keys = keys.concat(page.keys);
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
      keys.sort(function(a, b) { return b.name.localeCompare(a.name); });
      logs = (await Promise.all(keys.slice(0, 20).map(function(k) { return env.FINN_KV.get(k.name); })))
        .filter(Boolean).map(function(raw) { return JSON.parse(raw); });
    }
    return new Response(JSON.stringify({
      configured: !!(env.IG_ACCESS_TOKEN && env.IG_BUSINESS_ACCOUNT_ID),
      next_index: nextIndex,
      done: nextIndex > 5,
      recent_attempts: logs
    }), { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}

// POST /admin/instagram-publish-next — dispara a publicação do próximo post
// AGORA (só a conta master) — pra testar a integração sem esperar o cron.
async function _adminInstagramPublishNext(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, body.admin_password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var result = await _publishNextInstagramPost(env);
    return new Response(JSON.stringify(result), { status: result.ok ? 200 : 502, headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
  }
}
`;

const worker = `${pluggyFns}
${pushFns}
${billingFns}
// Estrutura de planos já está pronta, mas a cobrança só começa mês que
// vem — enquanto isso, ninguém é bloqueado. Vira true quando for a hora.
var PREMIUM_ENFORCEMENT_ENABLED = false;

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

    // ── Legal pages ──
    const legalShell = (slug, title, eyebrow, bodyHtml) => \`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>\${title} — Finn.</title>
<meta name="theme-color" content="#F97316">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#F8F7F4;color:#1E293B;line-height:1.7;-webkit-font-smoothing:antialiased}
.top{position:sticky;top:0;background:rgba(248,247,244,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid #E2E8F0;z-index:10}
.top-inner{max-width:880px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#0F172A}
.brand-mark{width:36px;height:36px;background:#1E293B;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;color:#F97316;font-size:17px;letter-spacing:-.02em}
.brand-name{font-size:18px;font-weight:900;letter-spacing:-.02em}
.brand-name em{font-style:normal;color:#F97316}
.top-nav{display:flex;gap:22px;font-size:13px;font-weight:700}
.top-nav a{color:#475569;text-decoration:none;transition:color .15s}
.top-nav a:hover{color:#F97316}
.hero{max-width:880px;margin:56px auto 8px;padding:0 24px}
.eyebrow{display:inline-flex;align-items:center;gap:8px;background:#FFF7ED;border:1px solid #FED7AA;color:#C2410C;border-radius:99px;padding:6px 14px;font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px}
h1{font-size:clamp(32px,5vw,46px);font-weight:900;letter-spacing:-.03em;line-height:1.08;margin-bottom:12px;color:#0F172A}
h1 em{font-style:normal;color:#F97316}
.meta{color:#64748B;font-size:14px;font-weight:600}
.card{max-width:880px;margin:32px auto;padding:40px 44px;background:#fff;border:1px solid #E2E8F0;border-radius:20px;box-shadow:0 1px 2px rgba(15,23,42,.04),0 8px 24px -8px rgba(15,23,42,.06)}
.card h2{font-size:19px;font-weight:900;letter-spacing:-.01em;color:#0F172A;margin:34px 0 10px;display:flex;align-items:baseline;gap:10px}
.card h2:first-child{margin-top:0}
.card h2 .num{color:#F97316;font-size:14px;font-weight:900;letter-spacing:.04em}
.card p{color:#334155;margin-bottom:0;font-size:15.5px}
.card p + p{margin-top:14px}
.card a{color:#F97316;font-weight:700;text-decoration:none;border-bottom:1px solid rgba(249,115,22,.35);transition:border-color .15s}
.card a:hover{border-bottom-color:#F97316}
.notice{background:linear-gradient(135deg,#FFF7ED 0%,#FFEDD5 100%);border:1px solid #FED7AA;border-radius:16px;padding:26px 28px;margin:18px 0}
.notice strong{color:#9A3412;font-weight:900}
.opt{display:flex;gap:16px;padding:18px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;margin-bottom:14px}
.opt-ic{width:44px;height:44px;background:#F97316;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.opt-t{font-weight:900;color:#0F172A;font-size:15.5px;margin-bottom:4px}
.opt-d{color:#475569;font-size:14px;line-height:1.55}
.warn{color:#991B1B;font-size:13.5px;font-weight:700;background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px 16px;margin-top:18px}
.footer{max-width:880px;margin:24px auto 64px;padding:24px;display:flex;flex-wrap:wrap;gap:18px;justify-content:space-between;align-items:center;color:#94A3B8;font-size:13px;border-top:1px solid #E2E8F0}
.footer-brand{display:flex;align-items:center;gap:10px;color:#64748B;font-weight:700}
.footer-brand .brand-mark{width:28px;height:28px;font-size:13px;border-radius:8px}
.footer-links{display:flex;gap:20px;font-weight:700;flex-wrap:wrap}
.footer-links a{color:#475569;text-decoration:none}
.footer-links a:hover{color:#F97316}
.active-link{color:#F97316!important}
@media(max-width:600px){.top-nav{gap:14px}.top-nav a:not(.cta){display:none}.card{padding:28px 22px;border-radius:16px}.hero{margin-top:36px}.footer{flex-direction:column;text-align:center}}
</style></head><body>
<header class="top"><div class="top-inner">
  <a href="/landing" class="brand"><div class="brand-mark">F</div><span class="brand-name">Finn<em>.</em></span></a>
  <nav class="top-nav">
    <a href="/landing">Sobre</a>
    <a href="/privacidade"\${slug==='privacidade'?' class="active-link"':''}>Privacidade</a>
    <a href="/termos"\${slug==='termos'?' class="active-link"':''}>Termos</a>
    <a href="/" class="cta" style="color:#F97316">Entrar →</a>
  </nav>
</div></header>
<section class="hero">
  <div class="eyebrow">\${eyebrow}</div>
  <h1>\${title}</h1>
  <div class="meta">Última atualização: Junho de 2026</div>
</section>
\${bodyHtml}
<footer class="footer">
  <div class="footer-brand"><div class="brand-mark">F</div>© 2026 Finn. — Controle financeiro inteligente.</div>
  <div class="footer-links">
    <a href="/privacidade">Privacidade</a>
    <a href="/termos">Termos</a>
    <a href="/deletar-dados">Excluir dados</a>
    <a href="mailto:Finn.controle01@gmail.com">Contato</a>
  </div>
</footer>
</body></html>\`;

    if (url.pathname === '/privacidade') {
      const body = \`<article class="card">
<h2><span class="num">01</span> Dados coletados</h2>
<p>O Finn coleta apenas os dados que você fornece diretamente: e-mail para autenticação, transações financeiras que você registra (valores, datas, descrições e categorias), metas financeiras e limites de gastos configurados por você.</p>

<h2><span class="num">02</span> Como usamos seus dados</h2>
<p>Seus dados são usados <strong>exclusivamente</strong> para oferecer as funcionalidades do app: exibição de extratos, análises financeiras com IA, metas e alertas de limite. <strong>Não vendemos, compartilhamos ou comercializamos seus dados</strong> com terceiros.</p>

<h2><span class="num">03</span> Armazenamento</h2>
<p>Seus dados financeiros são armazenados de forma segura no <strong>Supabase</strong> (infraestrutura em nuvem com criptografia em repouso e em trânsito). O acesso é protegido por autenticação via e-mail ou Google.</p>

<h2><span class="num">04</span> IA e análises</h2>
<p>Ao usar a função <strong>"Finn IA"</strong>, um resumo anônimo das suas transações (sem dados de identificação pessoal) é enviado à API da Anthropic para gerar análises financeiras. Nenhum dado é armazenado pela Anthropic após o processamento.</p>

<h2><span class="num">05</span> WhatsApp Bot</h2>
<p>Se você utilizar o bot do WhatsApp, seu número de telefone é associado às suas transações registradas pelo bot, armazenadas no Cloudflare KV. Esses dados são acessíveis apenas por você através do app Finn.</p>

<h2><span class="num">06</span> Seus direitos</h2>
<div class="notice"><strong>Você está no controle.</strong><br>Pode solicitar a exclusão de todos os seus dados a qualquer momento em <a href="/deletar-dados">finn.dev.br/deletar-dados</a> — sem perguntas, sem retenção.</div>

<h2><span class="num">07</span> Contato</h2>
<p>Dúvidas sobre privacidade? Escreva para <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a> e respondemos em até 48h.</p>
</article>\`;
      return new Response(legalShell('privacidade', 'Política de Privacidade', '🔒 Documento legal', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (url.pathname === '/termos') {
      const body = \`<article class="card">
<h2><span class="num">01</span> Aceitação</h2>
<p>Ao usar o Finn, você concorda com estes Termos. Se não concordar, não utilize o serviço.</p>

<h2><span class="num">02</span> O serviço</h2>
<p>O Finn é um aplicativo de <strong>controle financeiro pessoal oferecido gratuitamente</strong>. Reservamo-nos o direito de modificar ou encerrar o serviço a qualquer momento, com aviso prévio razoável.</p>

<h2><span class="num">03</span> Responsabilidade dos dados</h2>
<p>Você é responsável pela precisão dos dados que insere no app. O Finn não se responsabiliza por decisões financeiras tomadas com base nas análises do aplicativo.</p>
<p>As análises com IA são <strong>informativas</strong> e não constituem aconselhamento financeiro profissional.</p>

<h2><span class="num">04</span> Uso adequado</h2>
<p>É proibido usar o Finn para fins ilegais, tentativas de acesso não autorizado à plataforma ou uso que prejudique outros usuários.</p>

<h2><span class="num">05</span> Disponibilidade</h2>
<p>O Finn é fornecido <strong>"como está"</strong>, sem garantias de disponibilidade ininterrupta. Fazemos o melhor para manter o serviço estável, mas não garantimos 100% de uptime.</p>

<h2><span class="num">06</span> Contato</h2>
<p>Dúvidas, sugestões ou reclamações: <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a></p>
</article>\`;
      return new Response(legalShell('termos', 'Termos de Serviço', '📜 Documento legal', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (url.pathname === '/deletar-dados') {
      const body = \`<article class="card">
<h2 style="margin-top:0">Como excluir seus dados</h2>
<p style="margin-bottom:22px">Você pode excluir <strong>todos os seus dados</strong> do Finn a qualquer momento, sem precisar de aprovação ou justificativa.</p>

<div class="opt">
  <div class="opt-ic">⚡</div>
  <div><div class="opt-t">Opção 1 — Pelo app (recomendado)</div>
  <div class="opt-d">Abra o Finn → Menu → Configurações → Dados → <strong>"Excluir todos os dados"</strong>. A exclusão é imediata.</div></div>
</div>

<div class="opt">
  <div class="opt-ic">✉️</div>
  <div><div class="opt-t">Opção 2 — Por e-mail</div>
  <div class="opt-d">Envie um e-mail para <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a> com o assunto <strong>"Exclusão de dados"</strong> e seu e-mail cadastrado. Excluiremos tudo em até 7 dias úteis.</div></div>
</div>

<div class="warn">⚠️ Ao excluir, <strong>todas as suas transações, metas, limites e configurações</strong> serão permanentemente removidos. Esta ação é irreversível.</div>
</article>\`;
      return new Response(legalShell('deletar-dados', 'Excluir meus dados', '🗑️ Direito do titular', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    // ── AI proxy (Anthropic Claude) ──
    if (url.pathname === '/ai' && request.method === 'POST') {
      if (!env.ANTHROPIC_API_KEY) {
        return new Response(JSON.stringify({ error: { type: 'not_configured', message: 'IA não configurada no servidor' } }), {
          status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
      // Only allow calls coming from our own origin (blocks browser-based abuse from other sites).
      // Origin ausente (curl/script direto, sem navegador) também é bloqueado —
      // antes só rejeitava Origin PRESENTE e diferente, deixando passar quem
      // simplesmente omitia o header.
      var aiOrigin = request.headers.get('Origin');
      if (!aiOrigin || aiOrigin !== url.origin) {
        return new Response(JSON.stringify({ error: { type: 'forbidden', message: 'origin não permitido' } }), {
          status: 403, headers: { 'Content-Type': 'application/json' }
        });
      }
      // Limite simples por IP — sem isso, sem exigir sessão nem limitar volume,
      // alguém podia esgotar a cota da chave da Anthropic num loop.
      if (env.FINN_KV) {
        var aiIp = request.headers.get('CF-Connecting-IP') || 'unknown';
        var aiRlKey = 'ai_rl_' + aiIp + '_' + Math.floor(Date.now() / 60000);
        var aiCount = parseInt((await env.FINN_KV.get(aiRlKey)) || '0', 10);
        if (aiCount >= 20) {
          return new Response(JSON.stringify({ error: { type: 'rate_limited', message: 'muitas requisições — tente de novo em instantes' } }), {
            status: 429, headers: { 'Content-Type': 'application/json' }
          });
        }
        await env.FINN_KV.put(aiRlKey, String(aiCount + 1), { expirationTtl: 120 });
      }
      try {
        var aiPayload = {};
        try { aiPayload = JSON.parse(await request.text()); } catch (pe) { aiPayload = {}; }

        // Finn IA é premium — free não usa, Plus tem cota mensal, Pro ilimitado.
        var aiUser = await _supaAuth(aiPayload.access_token);
        if (!aiUser) {
          return new Response(JSON.stringify({ error: { type: 'unauthorized', message: 'faça login pra usar a Finn IA' } }), {
            status: 401, headers: { 'Content-Type': 'application/json' }
          });
        }
        var aiSub = await _subaGetSubscription(aiUser.id, env);
        var aiPlan = PREMIUM_ENFORCEMENT_ENABLED ? ((aiSub && aiSub.plan) || 'free') : 'pro';
        if (_isMasterUser(aiUser) && _masterPasswordOk(env, aiPayload.admin_password)) aiPlan = 'pro';
        if (aiPlan === 'free') {
          return new Response(JSON.stringify({ error: { type: 'premium_required', message: 'Finn IA é um recurso Plus/Pro — assine pra usar.' } }), {
            status: 402, headers: { 'Content-Type': 'application/json' }
          });
        }
        var AI_PLUS_MONTHLY_LIMIT = 10;
        if (aiPlan === 'plus') {
          var aiThisMonth = new Date().toISOString().slice(0, 7);
          var aiUsedThisMonth = (aiSub.ai_usage_month === aiThisMonth) ? (aiSub.ai_usage_count || 0) : 0;
          if (aiUsedThisMonth >= AI_PLUS_MONTHLY_LIMIT) {
            return new Response(JSON.stringify({ error: { type: 'quota_exceeded', message: 'Você já usou as ' + AI_PLUS_MONTHLY_LIMIT + ' análises do mês no Plus. Assine o Pro pra IA ilimitada.' } }), {
              status: 402, headers: { 'Content-Type': 'application/json' }
            });
          }
        }

        // Clamp cost: cap output tokens and force a known, inexpensive model so the proxy can't be
        // abused to run the most expensive model with huge max_tokens on our server key.
        var ALLOWED_MODELS = ['claude-haiku-4-5-20251001', 'claude-3-5-haiku-20241022'];
        if (ALLOWED_MODELS.indexOf(aiPayload.model) === -1) aiPayload.model = ALLOWED_MODELS[0];
        if (!aiPayload.max_tokens || aiPayload.max_tokens > 2048) aiPayload.max_tokens = 2048;
        var aiApiBody = { model: aiPayload.model, max_tokens: aiPayload.max_tokens, system: aiPayload.system, messages: aiPayload.messages };
        var aiResp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify(aiApiBody),
        });
        var aiText = await aiResp.text();
        if (aiResp.ok && aiPlan === 'plus') await _subaIncrementAiUsage(aiUser.id, aiSub, env);
        return new Response(aiText, { status: aiResp.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': url.origin } });
      } catch (aiErr) {
        return new Response(JSON.stringify({ error: { type: 'proxy_error', message: 'falha ao contatar a IA' } }), {
          status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': url.origin }
        });
      }
    }

    // ── Pluggy: token ──
    if (url.pathname === '/pluggy/token' && request.method === 'POST') {
      return _pluggyToken(request, env);
    }

    // ── Pluggy: registra dono do item (chamar logo após o Connect widget) ──
    if (url.pathname === '/pluggy/link' && request.method === 'POST') {
      return _pluggyLink(request, env);
    }

    // ── Pluggy: transactions ──
    if (url.pathname === '/pluggy/transactions' && request.method === 'GET') {
      return _pluggyTx(request, env);
    }

    // ── Assinaturas: checkout e webhook ──
    if (url.pathname === '/billing/checkout' && request.method === 'POST') {
      return _billingCheckout(request, env);
    }
    if (url.pathname === '/billing/webhook' && request.method === 'POST') {
      return _billingWebhook(request, env);
    }

    // ── Admin: só a conta master (ver/gerenciar assinatura de qualquer usuário) ──
    if (url.pathname === '/admin/login' && request.method === 'POST') {
      return _adminLogin(request, env);
    }
    if (url.pathname === '/admin/subscriptions' && request.method === 'GET') {
      return _adminListSubscriptions(request, env);
    }
    if (url.pathname === '/admin/subscriptions/set' && request.method === 'POST') {
      return _adminSetSubscription(request, env);
    }
    if (url.pathname === '/admin/analytics' && request.method === 'GET') {
      return _adminAnalytics(request, env);
    }

    // ── PWA Manifest ──
    if (url.pathname === '/manifest.json') {
      var manifest = {
        name: 'Finn — Controle Financeiro',
        short_name: 'Finn.',
        description: 'Controle financeiro inteligente para o brasileiro',
        start_url: '/',
        display: 'standalone',
        background_color: '#1E293B',
        theme_color: '#F97316',
        orientation: 'portrait-primary',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ],
        // Segurar o ícone instalado abre direto na aba "Adicionar" — dá pra
        // lançar uma transação quase tão rápido quanto mandar mensagem pro
        // bot do WhatsApp, sem depender da liberação da API da Meta.
        shortcuts: [
          {
            name: 'Novo lançamento',
            short_name: 'Lançar',
            description: 'Adicionar uma transação rapidamente',
            url: '/?atalho=adicionar',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      };
      return new Response(JSON.stringify(manifest), {
        headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // ── Icons (PNG — SVG em manifest não é bem suportado em vários navegadores/iOS) ──
    if (url.pathname === '/icon-192.png' || url.pathname === '/icon-512.png' || url.pathname === '/apple-touch-icon.png') {
      var iconB64 = url.pathname === '/icon-192.png' ? ${JSON.stringify(icon192)}
        : url.pathname === '/icon-512.png' ? ${JSON.stringify(icon512)}
        : ${JSON.stringify(appleTouchIcon)};
      var iconBytes = Uint8Array.from(atob(iconB64), function(c){ return c.charCodeAt(0); });
      return new Response(iconBytes, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' }
      });
    }

    // ── Posts do Instagram (URL pública fixa — a Graph API busca a imagem
    // por essa URL, não aceita upload direto) ──
    var socialMatch = url.pathname.match(/^\\/social\\/post-([1-5])\\.png$/);
    if (socialMatch) {
      var socialB64 = ${JSON.stringify(socialPosts)}[Number(socialMatch[1]) - 1];
      var socialBytes = Uint8Array.from(atob(socialB64), function(c){ return c.charCodeAt(0); });
      return new Response(socialBytes, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' }
      });
    }

    // ── Push: subscribe ──
    if (url.pathname === '/push/subscribe' && request.method === 'POST') {
      var cors2 = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
      try {
        var sub = JSON.parse(await request.text());
        if (!sub.endpoint || !sub.keys || !sub.access_token) return new Response(JSON.stringify({error:'invalid'}),{status:400,headers:cors2});
        // Sem isso, qualquer um autenticado podia cadastrar um endpoint
        // arbitrário e o cron de notificações ficava fazendo fetch() nele
        // periodicamente — restringe aos serviços de push reais conhecidos.
        var pushUrl = null;
        try { pushUrl = new URL(sub.endpoint); } catch(eUrl) {}
        var allowedPushOrigins = [
          'https://fcm.googleapis.com',
          'https://updates.push.services.mozilla.com',
          'https://web.push.apple.com'
        ];
        var pushOriginOk = !!pushUrl && pushUrl.protocol === 'https:' &&
          (allowedPushOrigins.indexOf(pushUrl.origin) !== -1 || /(^|\.)notify\.windows\.com$/.test(pushUrl.hostname));
        if (!pushOriginOk) return new Response(JSON.stringify({error:'endpoint de push nao reconhecido'}),{status:400,headers:cors2});
        var authResp = await fetch('${SUPA_URL_SERVER}/auth/v1/user', {
          headers: { apikey: '${SUPA_ANON_KEY_SERVER}', Authorization: 'Bearer ' + sub.access_token }
        });
        if (!authResp.ok) return new Response(JSON.stringify({error:'unauthorized'}),{status:401,headers:cors2});
        var authUser = await authResp.json();
        if (!authUser.id) return new Response(JSON.stringify({error:'unauthorized'}),{status:401,headers:cors2});
        var key = await _pushKey(sub.endpoint);
        var record = { endpoint: sub.endpoint, keys: sub.keys, user_id: authUser.id };
        if (env.FINN_KV) await env.FINN_KV.put(key, JSON.stringify(record), {expirationTtl: 60*60*24*365});
        return new Response(JSON.stringify({ok:true}), {headers:cors2});
      } catch(e) {
        return new Response(JSON.stringify({error:e.message}),{status:500,headers:cors2});
      }
    }

    // ── Service Worker ──
    if (url.pathname === '/sw.js') {
      return new Response(${JSON.stringify(swVersioned)}, {
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
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ── Guia de uso ──
    if (url.pathname === '/guia' || url.pathname === '/guia.html') {
      return new Response(${JSON.stringify(guia)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ── Beta: inscrição de novos testers ──
    if (url.pathname === '/beta' || url.pathname === '/beta.html') {
      return new Response(${JSON.stringify(beta)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    }
    if (url.pathname === '/beta/signup' && request.method === 'POST') {
      return _betaSignup(request, env);
    }
    if (url.pathname === '/admin/beta-signups' && request.method === 'GET') {
      return _adminBetaSignups(request, env);
    }
    if (url.pathname === '/admin/instagram-status' && request.method === 'GET') {
      return _adminInstagramStatus(request, env);
    }
    if (url.pathname === '/admin/instagram-publish-next' && request.method === 'POST') {
      return _adminInstagramPublishNext(request, env);
    }

    // ── Pitch decks ──
    if (url.pathname === '/investidores') {
      return new Response(${JSON.stringify(pitchInv)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }
    if (url.pathname === '/usuarios') {
      return new Response(${JSON.stringify(pitchUsr)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
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
          'Cache-Control': 'no-cache',
        },
      });
    }

    return new Response(${JSON.stringify(html)}, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'ETag': ETAG,
        'X-Finn-Version': '2.1.0',
      },
    });
  },

  async scheduled(event, env, ctx) {
    if (event.cron === '0 23 * * 1') {
      ctx.waitUntil(sendWeeklySummary(env));
    } else if (event.cron === '0 13 * * *') {
      ctx.waitUntil(checkExpiredSubscriptions(env));
    } else if (event.cron === '0 15 * * *') {
      ctx.waitUntil(_publishNextInstagramPost(env));
    } else {
      ctx.waitUntil(checkFixedDueAndNotify(env));
    }
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB) | ETag: ' + etag);

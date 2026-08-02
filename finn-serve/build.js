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

// Capa estática dos Reels — o usuário baixa direto do navegador do celular
// (toque-e-segure), porque anexo de chat não deu opção de salvar no cliente
// dele. JPEG em vez de PNG pra ficar bem menor (o worker já está perto do
// limite de 3MB do plano free do Cloudflare com os 20 posts do Instagram).
const reel1Cover = fs.readFileSync(path.join(__dirname, 'social/reel1_cover.jpg')).toString('base64');
const reel2Cover = fs.readFileSync(path.join(__dirname, 'social/reel2_cover.jpg')).toString('base64');
const reel3Cover = fs.readFileSync(path.join(__dirname, 'social/reel3_cover.jpg')).toString('base64');

// Posts do Instagram (campanha de divulgação do beta) — servidos publicamente
// em /social/post-N.png porque a API do Instagram só aceita image_url (não
// tem upload direto), então a imagem precisa estar hospedada num link fixo.
const socialPosts = [];
for (let n = 1; fs.existsSync(path.join(__dirname, 'social/ig_post_' + n + '.png')); n++) {
  socialPosts.push(fs.readFileSync(path.join(__dirname, 'social/ig_post_' + n + '.png')).toString('base64'));
}

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

// Validadores de formato — tudo que entra do cliente e vai concatenado numa URL
// da API da Pluggy passa por aqui antes (ver _pluggyLink/_pluggyTx).
function _isUuid(v) {
  return typeof v === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);
}
function _isYmd(v) {
  return typeof v === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(v);
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
    return _serverError(cors, e, '_pluggyToken');
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
    // O itemId da Pluggy é um UUID. Aceitar string livre aqui deixava registrar
    // um "itemId" tipo "x&itemId=<item-da-vitima>", que passava na checagem de
    // dono (a chave do KV batia com a do próprio atacante) mas ia concatenado
    // na URL da API da Pluggy lá em _pluggyTx, duplicando o parâmetro e
    // trazendo o extrato de outra pessoa.
    if (!_isUuid(body.itemId)) return new Response(JSON.stringify({ error: 'invalid itemId' }), { status: 400, headers: cors });
    if (env.FINN_KV) {
      // Não deixa "roubar" um item já registrado: sem isso, quem descobrisse o
      // itemId de alguém (log, print, suporte) reivindicava a conta bancária
      // dela pra si só chamando esse endpoint de novo.
      var current = await env.FINN_KV.get('pluggy_owner_' + body.itemId);
      if (current && current !== authUser.id) {
        return new Response(JSON.stringify({ error: 'item already linked to another account' }), { status: 409, headers: cors });
      }
      await env.FINN_KV.put('pluggy_owner_' + body.itemId, authUser.id);
    }
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_pluggyLink');
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
    if (!_isUuid(itemId)) return new Response(JSON.stringify({ error: 'invalid itemId' }), { status: 400, headers: cors });
    // O itemId é um identificador da Pluggy, não do Finn — sem checar dono,
    // qualquer usuário autenticado podia ler o extrato bancário de qualquer
    // outra pessoa só adivinhando/observando o itemId dela.
    var owner = env.FINN_KV ? await env.FINN_KV.get('pluggy_owner_' + itemId) : null;
    if (owner !== authUser.id) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    var from   = url.searchParams.get('from') || new Date(Date.now() - 90*24*3600*1000).toISOString().slice(0,10);
    var to     = url.searchParams.get('to')   || new Date().toISOString().slice(0,10);
    // Datas também vão concatenadas na URL da Pluggy — restringe ao formato
    // YYYY-MM-DD pra não virar outro ponto de injeção de parâmetro.
    if (!_isYmd(from) || !_isYmd(to)) return new Response(JSON.stringify({ error: 'invalid date range' }), { status: 400, headers: cors });

    var apiKey = await _pluggyApiKey(env);
    var hdrs = { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' };

    // Busca contas do item
    var ar = await fetch('https://api.pluggy.ai/accounts?itemId=' + encodeURIComponent(itemId), { headers: hdrs });
    if (!ar.ok) throw new Error('accounts failed: ' + ar.status);
    var accounts = (await ar.json()).results || [];

    var allTxs = [];
    for (var ai = 0; ai < accounts.length; ai++) {
      var acc = accounts[ai];
      var page = 1, hasMore = true;
      while (hasMore) {
        var tr = await fetch(
          'https://api.pluggy.ai/transactions?accountId=' + encodeURIComponent(acc.id) +
          '&from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to) +
          '&pageSize=500&page=' + encodeURIComponent(page),
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
    return _serverError(cors, e, '_pluggyTx');
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
    return _serverError(cors, e, '_billingCheckout');
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

  // Falha FECHADA: sem o segredo configurado, não dá pra provar que o POST veio
  // mesmo do Mercado Pago. Antes o bloco inteiro era pulado nesse caso — uma
  // janela aberta em toda rotação de secret ou deploy com a env faltando.
  // (O estrago era limitado porque o handler abaixo rebusca o pagamento na API
  // do MP com o nosso próprio token, em vez de confiar no corpo do POST — mas
  // "só não é grave por causa de outra defesa" não é motivo pra deixar aberto.)
  if (!env.MP_WEBHOOK_SECRET) return new Response('Forbidden', { status: 403 });
  var valid = await _mpVerifySignature(request, dataId, env.MP_WEBHOOK_SECRET);
  if (!valid) return new Response('Forbidden', { status: 403 });

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
  if (!env.MASTER_ADMIN_PASSWORD || !password) return false;
  return _timingSafeEqual(String(password), String(env.MASTER_ADMIN_PASSWORD));
}

// Comparação de tempo constante: '===' em string sai no primeiro byte que
// diverge, então o tempo de resposta vaza quantos caracteres do prefixo já
// estão certos. Pela internet o jitter esconde isso na prática, mas a
// verificação da assinatura do Mercado Pago aqui do lado já faz certo — não
// custa nada ser consistente.
function _timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Contador simples de tentativas em KV, com janela deslizante grosseira (a
// chave carrega o número da janela, então ela expira sozinha). Devolve
// { ok, remaining, retryAfter }.
//
// Não é à prova de corrida — duas requisições simultâneas podem ler o mesmo
// valor e gravar o mesmo +1. Pra travar força bruta isso não importa: o
// atacante precisa de milhares de tentativas, e perder uma ou outra contagem
// no meio não muda o resultado.
async function _rateLimit(env, bucket, id, limit, windowSec) {
  if (!env.FINN_KV) return { ok: true, remaining: limit, retryAfter: 0 };
  var win = Math.floor(Date.now() / (windowSec * 1000));
  var key = 'rl_' + bucket + '_' + id + '_' + win;
  var used = parseInt((await env.FINN_KV.get(key)) || '0', 10) || 0;
  if (used >= limit) {
    var elapsed = (Date.now() / 1000) % windowSec;
    return { ok: false, remaining: 0, retryAfter: Math.ceil(windowSec - elapsed) };
  }
  await env.FINN_KV.put(key, String(used + 1), { expirationTtl: Math.max(60, windowSec * 2) });
  return { ok: true, remaining: limit - used - 1, retryAfter: 0 };
}

function _clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'sem-ip';
}

// Erro 500 sem contar a vida ao cliente. Os catch genéricos devolviam
// e.message direto, e várias dessas mensagens carregam trecho da resposta do
// fornecedor (Pluggy, Mercado Pago, Resend) — status interno, formato de erro,
// às vezes nome de campo. Nada disso ajuda quem está usando o app, e ajuda
// quem está sondando. O detalhe continua indo pro log do Worker (visível com
// "wrangler tail"), só não volta na resposta.
function _serverError(cors, e, contexto) {
  console.error('[' + (contexto || 'erro') + ']', e && e.stack || e);
  return new Response(JSON.stringify({ error: 'Algo deu errado aqui do nosso lado. Tenta de novo em instantes.' }), { status: 500, headers: cors });
}

function _tooManyRequests(cors, retryAfter, msg) {
  var h = Object.assign({}, cors, { 'Retry-After': String(retryAfter || 60) });
  return new Response(JSON.stringify({ error: msg || 'muitas tentativas, tente mais tarde' }), { status: 429, headers: h });
}

// Credenciais de admin saem de HEADER, não de query string. Numa URL elas vão
// parar no log de acesso da Cloudflare, no histórico do navegador e podem
// vazar no Referer — e essas duas juntas (JWT da master + senha) são acesso
// admin completo. As rotas POST já mandavam no corpo; estas eram as GET.
function _adminCreds(request) {
  var auth = request.headers.get('Authorization') || '';
  return {
    accessToken: auth.indexOf('Bearer ') === 0 ? auth.slice(7) : null,
    password: request.headers.get('X-Admin-Password'),
  };
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
    // Trava de força bruta: sem isso, quem conseguisse um JWT da conta master
    // (sessão roubada, máquina emprestada) podia chutar MASTER_ADMIN_PASSWORD
    // infinitas vezes, sem nenhum atraso nem bloqueio. 5 tentativas a cada 15
    // min, contando por IP e por conta — bloqueia os dois vetores.
    var rlIp = await _rateLimit(env, 'adminpw', _clientIp(request), 5, 900);
    if (!rlIp.ok) {
      await _securityLog(env, request, 'rate_limit_senha_admin', 'IP travado por excesso de tentativas');
      return _tooManyRequests(cors, rlIp.retryAfter, 'muitas tentativas de senha, espere alguns minutos');
    }
    var rlUser = await _rateLimit(env, 'adminpw', authUser.id, 10, 900);
    if (!rlUser.ok) {
      await _securityLog(env, request, 'rate_limit_senha_admin', 'conta travada por excesso de tentativas');
      return _tooManyRequests(cors, rlUser.retryAfter, 'muitas tentativas de senha, espere alguns minutos');
    }
    if (!_masterPasswordOk(env, body.password)) {
      // Senha errada na conta master é sempre suspeito: só existe uma pessoa
      // que deveria estar digitando isso.
      await _securityLog(env, request, 'senha_admin_incorreta', authUser.email);
      return new Response(JSON.stringify({ error: 'senha incorreta' }), { status: 403, headers: cors });
    }
    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminLogin');
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
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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
    return _serverError(cors, e, '_adminListSubscriptions');
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
    return _serverError(cors, e, '_adminSetSubscription');
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

// GET /admin/analytics — painel de uso. Credenciais em header:
//   Authorization: Bearer <access_token>  +  X-Admin-Password: <senha>
// (só a conta master). Tudo lido ao vivo do Supabase via SUPABASE_SERVICE_KEY
// (contorna RLS de propósito, só pra essa rota admin) — sem cache, cada
// carregamento reflete o estado atual do banco.
async function _adminAnalytics(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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
    return _serverError(cors, e, '_adminAnalytics');
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

    // Rota pública que dispara e-mail de verdade (Resend) pro endereço que
    // vier no corpo — sem limite, dava pra usar o Finn como arma pra encher a
    // caixa de entrada de qualquer pessoa, e de quebra torrar a cota do
    // Resend. O honeypot acima só pega bot burro; qualquer script que não
    // preencha o campo escondido passava direto.
    //
    // Dois limites: por IP (impede o disparo em massa) e por e-mail de destino
    // (impede bombardear uma vítima só, mesmo trocando de IP).
    var rlIp = await _rateLimit(env, 'beta_ip', _clientIp(request), 5, 3600);
    if (!rlIp.ok) return _tooManyRequests(cors, rlIp.retryAfter, 'muitas inscrições seguidas, tente mais tarde');
    var rlEmail = await _rateLimit(env, 'beta_mail', email.toLowerCase(), 3, 86400);
    if (!rlEmail.ok) return _tooManyRequests(cors, rlEmail.retryAfter, 'já enviamos o e-mail de confirmação — confira sua caixa de entrada e o spam');

    // Confirmação em duas etapas: a vaga só é confirmada de fato quando a
    // pessoa clica no link do e-mail (token aleatório, checado em
    // /beta/confirm) — não é uma espera artificial, é uma verificação real
    // que também reduz e-mail inválido/digitado errado.
    var signupId = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    var confirmToken = crypto.randomUUID();
    var confirmUrl = 'https://finn.dev.br/beta/confirm?id=' + encodeURIComponent(signupId) + '&token=' + encodeURIComponent(confirmToken);

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
            subject: 'Confirme seu cadastro no grupo de testers do Finn',
            html: _betaConfirmEmailHtml(name, confirmUrl)
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
      await env.FINN_KV.put('beta_signup_' + signupId, JSON.stringify({
        name: name, email: email, contact: contact, created_at: new Date().toISOString(),
        confirmed: false, confirm_token: confirmToken, email_status: emailStatus
      }));
    }

    return new Response(JSON.stringify({ ok: true, pending: true }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_betaSignup');
  }
}

// GET /admin/beta-signups — credenciais em header (Authorization: Bearer
// <access_token> + X-Admin-Password: <senha>). Lista as
// inscrições recentes do /beta com o status do envio do e-mail (só a
// conta master) — único jeito de ver se o Resend está funcionando de verdade.
async function _adminBetaSignups(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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
    return _serverError(cors, e, '_adminBetaSignups');
  }
}

function _escapeBetaHtml(s) {
  return String(s || '').replace(/[<>&]/g, function(c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; });
}

// GET /admin/intrusions — resumo das tentativas registradas por _securityLog.
// Devolve agregados, não a lista crua: 500 linhas de log não dizem nada, mas
// "3 origens somaram 240 tentativas em /.env nas últimas 24h" diz tudo.
async function _adminIntrusions(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.FINN_KV) return new Response(JSON.stringify({ ok: true, vazio: true }), { headers: cors });

    var keys = [];
    var cursor;
    do {
      var page = await env.FINN_KV.list({ prefix: 'seclog_', cursor: cursor });
      keys = keys.concat(page.keys);
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    // A chave carrega o timestamp, então ordenar por nome já é ordenar por
    // data — sem precisar ler o conteúdo de todas antes.
    keys.sort(function(a, b) { return b.name.localeCompare(a.name); });

    var TETO_LEITURA = 600;
    var eventos = (await Promise.all(keys.slice(0, TETO_LEITURA).map(function(k) { return env.FINN_KV.get(k.name); })))
      .filter(Boolean)
      .map(function(raw) { try { return JSON.parse(raw); } catch (e) { return null; } })
      .filter(Boolean);

    var agora = Date.now();
    var h24 = agora - 24 * 3600 * 1000;
    var d7 = agora - 7 * 24 * 3600 * 1000;
    var ultimas24 = 0, ultimos7d = 0;
    var porTipo = {}, porCaminho = {}, porOrigem = {}, porPais = {};

    eventos.forEach(function(e) {
      var t = Date.parse(e.at) || 0;
      if (t >= h24) ultimas24++;
      if (t >= d7) ultimos7d++;
      porTipo[e.kind] = (porTipo[e.kind] || 0) + 1;
      porCaminho[e.path] = (porCaminho[e.path] || 0) + 1;
      porPais[e.pais || '?'] = (porPais[e.pais || '?'] || 0) + 1;
      var chaveOrigem = e.ipId || 'sem-id';
      if (!porOrigem[chaveOrigem]) {
        porOrigem[chaveOrigem] = { id: chaveOrigem, regiao: e.ipRegiao || '?', pais: e.pais || '?', ua: e.ua || '', total: 0, ultimaEm: e.at, caminhos: {} };
      }
      var o = porOrigem[chaveOrigem];
      o.total++;
      o.caminhos[e.path] = true;
      if (e.at > o.ultimaEm) o.ultimaEm = e.at;
    });

    function topN(obj, n) {
      return Object.keys(obj).map(function(k) { return { nome: k, total: obj[k] }; })
        .sort(function(a, b) { return b.total - a.total; }).slice(0, n);
    }

    var origens = Object.keys(porOrigem).map(function(k) {
      var o = porOrigem[k];
      return { id: o.id, regiao: o.regiao, pais: o.pais, ua: o.ua, total: o.total,
               caminhosDistintos: Object.keys(o.caminhos).length, ultimaEm: o.ultimaEm };
    }).sort(function(a, b) { return b.total - a.total; }).slice(0, 15);

    // Média diária dos 7 dias anteriores (sem contar hoje) — é contra ela que
    // se compara o dia atual pra decidir se há pico.
    var hoje = new Date().toISOString().slice(0, 10);
    var contagens = [];
    for (var i = 1; i <= 7; i++) {
      var d = new Date(agora - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
      contagens.push(parseInt((await env.FINN_KV.get('seccount_' + d)) || '0', 10) || 0);
    }
    var totalHoje = parseInt((await env.FINN_KV.get('seccount_' + hoje)) || '0', 10) || 0;
    var media = contagens.reduce(function(a, b) { return a + b; }, 0) / 7;
    // Pico = 3x a média e pelo menos 20 eventos, pra um dia de movimento zero
    // não virar alarme com 3 tentativas.
    var pico = totalHoje >= 20 && media > 0 && totalHoje > media * 3;

    return new Response(JSON.stringify({
      ok: true,
      totalRegistrado: keys.length,
      lidos: eventos.length,
      truncado: keys.length > TETO_LEITURA,
      ultimas24: ultimas24,
      ultimos7d: ultimos7d,
      totalHoje: totalHoje,
      mediaDiaria7d: Math.round(media * 10) / 10,
      pico: pico,
      porTipo: topN(porTipo, 8),
      topCaminhos: topN(porCaminho, 10),
      topPaises: topN(porPais, 6),
      origens: origens,
      recentes: eventos.slice(0, 20)
    }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminIntrusions');
  }
}

// E-mail enviado assim que alguém preenche o /beta — pede a confirmação
// (clique no link) antes de considerar a vaga garantida. Não é um atraso
// artificial: é uma verificação real, que também reduz e-mail digitado
// errado ou inválido indo pra lista.
function _betaConfirmEmailHtml(name, confirmUrl) {
  var safeName = _escapeBetaHtml(name || 'tudo bem');
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
      '<h1 style="margin:0;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.02em">Confirme seu e-mail, ' + safeName + '.</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 20px">' +
      '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.6;color:#334155">Falta só um passo pra garantir sua vaga no grupo de testers do <b>Finn.</b> — clica no botão abaixo pra confirmar sua inscrição.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 24px">' +
      '<a href="' + confirmUrl + '" style="display:block;text-align:center;background:#F97316;color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;border-radius:10px;padding:14px">Confirmar inscrição →</a>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 8px">' +
      '<p style="margin:0 0 12px;font-size:13.5px;line-height:1.6;color:#64748B">Dúvidas antes mesmo de confirmar? Me chama direto:</p>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 28px">' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>WhatsApp:</b> <a href="https://wa.me/5513982020928" style="color:#F97316;text-decoration:none">(13) 98202-0928</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>Instagram:</b> <a href="https://www.instagram.com/finn.finnance" style="color:#F97316;text-decoration:none">@finn.finnance</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>E-mail:</b> <a href="mailto:Finn.controle01@gmail.com" style="color:#F97316;text-decoration:none">Finn.controle01@gmail.com</a></td>' +
      '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px;border-top:1px solid #E2E8F0" bgcolor="#F8F7F4">' +
      '<p style="margin:0;font-size:11.5px;color:#94A3B8;line-height:1.5">Se você não pediu esse cadastro, pode ignorar este e-mail — nenhuma vaga é confirmada sem esse clique.</p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';
}

// Página mostrada quando a pessoa clica no link do e-mail (GET /beta/confirm).
// Sucesso: mostra os contatos e o link pra abrir o app. Falha: mensagem
// simples explicando o motivo (link inválido/expirado).
function _betaConfirmPageHtml(name, ok, errorMessage) {
  var safeName = _escapeBetaHtml(name || '');
  var body = ok
    ? (
      '<div class="mark">✓</div>' +
      '<h1>Inscrição confirmada' + (safeName ? ', ' + safeName : '') + '.</h1>' +
      '<p>Você já faz parte do grupo de testers do Finn. Pode abrir o app agora mesmo com sua conta Google — e qualquer dúvida ou problema, fala direto comigo:</p>' +
      '<a href="https://finn.dev.br" class="btn">Abrir o Finn →</a>' +
      '<div class="contacts">' +
        '<div class="c"><b>WhatsApp:</b> <a href="https://wa.me/5513982020928">(13) 98202-0928</a></div>' +
        '<div class="c"><b>Instagram:</b> <a href="https://www.instagram.com/finn.finnance">@finn.finnance</a></div>' +
        '<div class="c"><b>E-mail:</b> <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a></div>' +
      '</div>'
    ) : (
      '<div class="mark bad">✕</div>' +
      '<h1>Não foi dessa vez.</h1>' +
      '<p>' + _escapeBetaHtml(errorMessage || 'Esse link de confirmação não é válido.') + ' Se o problema continuar, me chama direto:</p>' +
      '<a href="https://wa.me/5513982020928" class="btn">Falar no WhatsApp →</a>'
    );
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Finn. — Confirmação de inscrição</title>' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'body{font-family:"Plus Jakarta Sans",sans-serif;background:#F8F7F4;color:#1E293B;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}' +
    'a{color:inherit}' +
    '.card{max-width:440px;width:100%;background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:36px 28px;text-align:center}' +
    '.mark{width:52px;height:52px;border-radius:50%;background:#ECFDF5;border:1px solid #A7F3D0;color:#059669;font-size:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-weight:800}' +
    '.mark.bad{background:#FEF2F2;border-color:#FECACA;color:#DC2626}' +
    'h1{font-size:19px;font-weight:800;color:#0F172A;margin-bottom:10px}' +
    'p{font-size:13.5px;color:#64748B;line-height:1.6;margin-bottom:22px}' +
    '.btn{display:block;text-align:center;background:#F97316;color:#fff!important;text-decoration:none;font-weight:800;font-size:14.5px;border-radius:10px;padding:13px}' +
    '.contacts{display:flex;flex-direction:column;gap:10px;text-align:left;margin-top:22px}' +
    '.c{border:1px solid #E2E8F0;border-radius:12px;padding:12px 14px;font-size:13px}' +
    '.c a{color:#F97316;text-decoration:none;font-weight:700}' +
    '</style></head><body><div class="card">' + body + '</div></body></html>';
}

// E-mail de boas-vindas de verdade — mandado só depois que a inscrição é
// confirmada (GET /beta/confirm), não no momento do cadastro.
function _betaWelcomeEmailHtml(name) {
  var safeName = _escapeBetaHtml(name || 'tudo bem');
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
      '<h1 style="margin:0;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-.02em">Bem-vindo(a), ' + safeName + '.</h1>' +
    '</td></tr>' +
    '<tr><td style="padding:0 28px 20px">' +
      '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.6;color:#334155">Sua inscrição no grupo de testers do <b>Finn.</b> está confirmada — obrigado por topar experimentar em primeira mão!</p>' +
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
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>WhatsApp:</b> <a href="https://wa.me/5513982020928" style="color:#F97316;text-decoration:none">(13) 98202-0928</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>Instagram:</b> <a href="https://www.instagram.com/finn.finnance" style="color:#F97316;text-decoration:none">@finn.finnance</a></td>' +
      '</tr><tr>' +
      '<td style="padding:10px 0;border-top:1px solid #E2E8F0;font-size:13.5px;color:#1E293B"><b>E-mail:</b> <a href="mailto:Finn.controle01@gmail.com" style="color:#F97316;text-decoration:none">Finn.controle01@gmail.com</a></td>' +
      '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px;border-top:1px solid #E2E8F0" bgcolor="#F8F7F4">' +
      '<p style="margin:0;font-size:11.5px;color:#94A3B8;line-height:1.5">Você recebeu esse e-mail porque confirmou sua inscrição no grupo de testers em finn.dev.br/beta. Não é uma lista de e-mail marketing — é só isso mesmo, um "oi, bem-vindo(a)".</p>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';
}

// GET /beta/confirm?id=...&token=... — clicado a partir do e-mail de
// confirmação. Só marca confirmed:true se o token bater com o que foi
// gravado no signup — sem isso, qualquer um adivinhando um id confirmaria
// a inscrição de outra pessoa.
async function _betaConfirm(request, env) {
  var htmlHeaders = Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY_HEADERS);
  try {
    var url = new URL(request.url);
    var id = url.searchParams.get('id') || '';
    var token = url.searchParams.get('token') || '';
    if (!env.FINN_KV || !id || !token) {
      return new Response(_betaConfirmPageHtml(null, false, 'Esse link de confirmação está incompleto.'), { status: 400, headers: htmlHeaders });
    }
    var raw = await env.FINN_KV.get('beta_signup_' + id);
    if (!raw) {
      return new Response(_betaConfirmPageHtml(null, false, 'Não encontrei essa inscrição — o link pode ter expirado.'), { status: 404, headers: htmlHeaders });
    }
    var signup = JSON.parse(raw);
    if (signup.confirm_token !== token) {
      return new Response(_betaConfirmPageHtml(null, false, 'Esse link de confirmação não é válido.'), { status: 403, headers: htmlHeaders });
    }
    if (!signup.confirmed) {
      signup.confirmed = true;
      signup.confirmed_at = new Date().toISOString();
      // Manda o e-mail de boas-vindas só na primeira confirmação — clicar
      // de novo no mesmo link (ex: abriu duas abas) não deve mandar outro.
      if (env.RESEND_API_KEY) {
        signup.welcome_email_status = { attempted: true };
        try {
          var welcomeResp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Finn <contato@finn.dev.br>',
              to: [signup.email],
              reply_to: 'Finn.controle01@gmail.com',
              subject: 'Bem-vindo(a) ao grupo de testers do Finn',
              html: _betaWelcomeEmailHtml(signup.name)
            })
          });
          var welcomeText = await welcomeResp.text();
          signup.welcome_email_status.ok = welcomeResp.ok;
          signup.welcome_email_status.status = welcomeResp.status;
          signup.welcome_email_status.response = welcomeText.slice(0, 500);
        } catch (eWelcome) {
          signup.welcome_email_status.ok = false;
          signup.welcome_email_status.error = String(eWelcome && eWelcome.message || eWelcome);
        }
      } else {
        signup.welcome_email_status = { attempted: false };
      }
      await env.FINN_KV.put('beta_signup_' + id, JSON.stringify(signup));
    }
    return new Response(_betaConfirmPageHtml(signup.name, true), { headers: htmlHeaders });
  } catch (e) {
    return new Response(_betaConfirmPageHtml(null, false, 'Algo deu errado ao confirmar.'), { status: 500, headers: htmlHeaders });
  }
}

// =============================================================================
// INSTAGRAM — publicação automática dos posts da campanha do beta, 1 por dia
// (quantidade = IG_CAPTIONS.length, cresce conforme mais posts são adicionados)
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
  '100% grátis. Sem pegadinha. 🇧🇷\\n\\nSem cartão de crédito pra começar, sem letra miúda — feito pro jeito que o brasileiro realmente vive. Link na bio.\\n\\n#appbrasileiro #financaspessoais #controlefinanceiro',
  'Divide a conta sem treta 🤝\\n\\nAluguel, mercado, jantar com os amigos — registra uma vez e o Finn calcula quanto cada um deve, sem planilha e sem constrangimento.\\n\\n#financaspessoais #dividirdespesas #appfinanceiro #educacaofinanceira',
  'Fatura do cartão sob controle 💳\\n\\nAcompanha os gastos do cartão em tempo real, parcelas futuras e o valor que vai fechar na fatura — sem surpresa no fim do mês.\\n\\n#cartaodecredito #financaspessoais #controlefinanceiro #appfinanceiro',
  'Nunca mais esquece uma conta 🔔\\n\\nCadastra suas contas fixas — aluguel, internet, streaming — e recebe um aviso antes do vencimento, sem precisar lembrar sozinho.\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro #lembretes',
  'Seus dados são só seus 🔒\\n\\nA conexão com o banco é feita direto no seu dispositivo — a gente nunca guarda sua senha nem vê seu extrato num servidor.\\n\\n#privacidade #seguranca #financaspessoais #appfinanceiro',
  'Você no controle da sua grana 📊\\n\\nGráficos claros de pra onde o dinheiro vai, mês a mês — sem termos complicados, só o que importa pra decidir melhor.\\n\\nLink na bio pra testar de graça.\\n\\n#financaspessoais #controlefinanceiro #educacaofinanceira #appfinanceiro',
  'Visão geral do mês, num só lugar 📊\\n\\nSaldo, receitas e despesas — tudo num painel simples, sem precisar somar nada na mão.\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira',
  'O Finn categoriza sozinho 🤖\\n\\nImportou o extrato? Cada gasto já cai na categoria certa, sem você mexer em nada.\\n\\n#financaspessoais #appfinanceiro #organizacaofinanceira #educacaofinanceira',
  'Modo claro ou modo escuro — do seu jeito 🌙\\n\\nEscolhe o visual que combina com você e muda a qualquer momento, direto nas configurações.\\n\\n#appfinanceiro #financaspessoais',
  'Instala como app, sem precisar de loja 📲\\n\\nAdiciona o Finn na tela inicial do seu celular em segundos — abre rápido, sem ocupar espaço.\\n\\n#appfinanceiro #financaspessoais #tecnologia',
  'Junta dinheiro pra o que importa 🎯\\n\\nCria uma meta, define o valor e acompanha o progresso — viagem, reserva de emergência, o que for.\\n\\n#metasfinanceiras #financaspessoais #appfinanceiro #educacaofinanceira',
  'Todas as contas, um só lugar 🏦\\n\\nConecta quantos bancos usar e vê o saldo geral, sem abrir um app por vez.\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro',
  'Veja se está gastando menos 📈\\n\\nCompara mês a mês e entende se seus hábitos estão melhorando de verdade — com dado, não com achismo.\\n\\n#financaspessoais #appfinanceiro #educacaofinanceira',
  'Começa a usar em minutos ⏱️\\n\\nSem burocracia, sem cartão de crédito pra testar — cria a conta e já importa seu extrato.\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro',
  'Sem anúncio chato atrapalhando 🚫\\n\\nInterface limpa, focada no que interessa: entender e controlar seu dinheiro.\\n\\n#financaspessoais #appfinanceiro',
  'Bora organizar sua grana hoje? 🚀\\n\\nGrupo de testers com vagas limitadas — boas-vindas pessoais e suporte direto por WhatsApp, Instagram ou e-mail.\\n\\nLink na bio pra se inscrever.\\n\\n#financaspessoais #appfinanceiro #controlefinanceiro #educacaofinanceira'
];

// Publica o próximo post da sequência (1 a IG_CAPTIONS.length) — chamado
// pelo cron diário e também pelo endpoint de disparo manual
// /admin/instagram-publish-next.
async function _publishNextInstagramPost(env) {
  if (!env.IG_ACCESS_TOKEN || !env.IG_BUSINESS_ACCOUNT_ID) {
    return { ok: false, skipped: true, reason: 'IG_ACCESS_TOKEN ou IG_BUSINESS_ACCOUNT_ID não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  var nextIndex = Number((await env.FINN_KV.get('ig_post_next_index')) || '1');
  if (nextIndex > IG_CAPTIONS.length) return { ok: false, done: true, reason: 'os ' + IG_CAPTIONS.length + ' posts já foram publicados' };

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

// GET /admin/instagram-status — credenciais em header (Authorization:
// Bearer <access_token> + X-Admin-Password: <senha>). Mostra
// quantos posts já foram (ou faltam) publicar, e o histórico de tentativas.
async function _adminInstagramStatus(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

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
      total: IG_CAPTIONS.length,
      done: nextIndex > IG_CAPTIONS.length,
      recent_attempts: logs
    }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminInstagramStatus');
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
    return _serverError(cors, e, '_adminInstagramPublishNext');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  SCREENER DE AÇÕES — GET /api/stocks/:ticker
// ═══════════════════════════════════════════════════════════════════════════
// Dados PÚBLICOS de mercado (cotação e indicadores de empresas listadas na
// B3), buscados na brapi.dev. Nada aqui encosta em conta bancária, Open
// Finance ou Pluggy — e a resposta diz isso explicitamente no campo "aviso",
// porque num app de finanças pessoais o usuário precisa conseguir distinguir,
// olhando a tela, o que é dinheiro dele do que é cotação de mercado.
//
// Por que a chamada sai do Worker e não do navegador:
//   1. o token da brapi é secret — no frontend ele seria público, já que
//      finn/index.html é servido a qualquer um, sem autenticação;
//   2. a CSP do app libera connect-src só pra 'self', Supabase e jsdelivr,
//      então o browser nem conseguiria falar com brapi.dev.
//
// A rota devolve JSON puro: nenhuma string vira HTML aqui no servidor. Quem
// monta a tela (finn/index.html) tem que passar TODO texto vindo daqui por
// escapeHtml() — nome de empresa e logo vêm de terceiro, e o app guarda
// access_token E refresh_token do Supabase no localStorage.

// Universo fechado do screener. Isto é uma ALLOWLIST DE SEGURANÇA antes de
// ser escolha de produto: o ticker vai parar dentro de uma URL que o Worker
// busca, e aceitar entrada arbitrária transformaria a rota num proxy aberto
// (SSRF). A URL final é montada com o elemento DESTA lista, nunca com a
// string que chegou do cliente — assim nem um bug de normalização consegue
// injetar caractere estranho lá.
// Exatamente os 15 papéis pedidos, nesta ordem. A lista já esteve maior aqui
// e foi cortada de volta de propósito: cada papel a mais é uma chamada a mais
// por atualização (o plano grátis da brapi é contado), e a lista é decisão de
// produto de quem pediu a feature, não do código. Mexer aqui é mexer no
// escopo — e a mesma lista precisa existir igual no finn/index.html.
var SCREENER_TICKERS = [
  'ITUB4', 'BBAS3', 'BBDC4', 'PETR4', 'VALE3',
  'TAEE11', 'ELET3', 'MGLU3', 'LREN3', 'WEGE3',
  'RDOR3', 'HAPV3', 'MXRF11', 'HGLG11', 'RENT3'
];

// Terminar em 11 NÃO classifica FII: TAEE11 é unit da Taesa, empresa
// operacional com fundamentos normais (e DY alto, que é justamente o que
// confunde). Por isso a lista de fundos é explícita, e não uma regra de
// sufixo — errar aqui não dá erro nenhum, só entrega nota errada.
var SCREENER_FIIS = ['MXRF11', 'HGLG11'];

// Units — ordinária + preferenciais no mesmo papel. Seguem a trilha normal de
// ação; a lista existe pra deixar registrado que o sufixo 11 delas é esperado.
var SCREENER_UNITS = ['TAEE11', 'SANB11', 'KLBN11', 'ENGI11', 'ALUP11', 'BPAC11'];

// Banco, seguradora e bolsa: dívida é matéria-prima do negócio e EBITDA não é
// métrica usada no setor. Calcular Dívida/EBITDA aqui dá um número enorme e
// derruba a nota injustamente — o espelho exato do problema do FII, que ganha
// nota 5 de graça no mesmo indicador. Nos dois casos o certo é N/A.
var SCREENER_FINANCEIRAS = ['ITUB4', 'BBAS3', 'BBDC4', 'BBSE3', 'PSSA3', 'B3SA3', 'SANB11', 'BPAC11'];

// Janela em que o dado é considerado FRESCO. Fundamento muda por trimestre,
// preço muda o tempo todo; 20 min é o meio-termo que segura a tela inteira
// sendo recarregada várias vezes sem estourar a cota da brapi.
var SCREENER_CACHE_TTL_SEG = 20 * 60;

// O registro fica guardado bem mais tempo do que é considerado fresco.
// Passados os 20 min ele vira reserva ("stale") e só é usado quando a brapi
// falha (429, 5xx, timeout): número de duas horas atrás com a idade estampada
// é muito melhor que tela vazia.
var SCREENER_CACHE_STALE_TTL_SEG = 6 * 60 * 60;

// Uma chamada pendurada consome o tempo de CPU do request inteiro no Worker.
var SCREENER_TIMEOUT_MS = 8000;

// Teto por conta e por janela, contando SÓ as chamadas que realmente saem pra
// brapi (ver _screenerAcao). A lista acima inteira, com cache frio, cabe numa
// janela; um refresh em loop, não.
var SCREENER_RL_LIMITE = 40;
var SCREENER_RL_JANELA_SEG = 300;

// Aviso que acompanha TODA resposta do screener, inclusive as de erro. Existe
// por dois motivos, os dois de produto: (1) o Finn puxa extrato bancário por
// Open Finance, e misturar visualmente "seu saldo" com "cotação da Petrobras"
// é o tipo de confusão que faz o usuário achar que o app está lendo a
// corretora dele; (2) indicador de mercado não é recomendação de
// investimento, e dizer isso é obrigação nossa.
var SCREENER_AVISO = 'Dados públicos de mercado, informados por um provedor externo de cotações da B3. Não têm nenhuma relação com sua conta bancária, com o Open Finance nem com seus dados no Finn — nada aqui é lido da sua conta. Também não é recomendação de compra ou venda.';

// ── Normalização de valores ────────────────────────────────────────────────

// Converte o que vier da API em número. A brapi (que espelha o quoteSummary
// do Yahoo) já devolveu, em momentos diferentes, número puro, string com
// vírgula decimal, string com "%" ou "R$", e objeto { raw, fmt }. Aceitar os
// quatro custa dez linhas e evita o parser inteiro virar NaN numa mudança
// silenciosa do fornecedor.
function _screenerNum(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'boolean') return null;
  if (typeof v === 'object') {
    if (Array.isArray(v)) return null;
    // O Yahoo aninha o valor em .raw; a brapi às vezes achata, às vezes não.
    if (v.raw !== undefined) return _screenerNum(v.raw);
    if (v.value !== undefined) return _screenerNum(v.value);
    if (v.fmt !== undefined) return _screenerNum(v.fmt);
    return null;
  }
  if (typeof v === 'string') {
    var s = v.replace(/[R$\\s%]/g, '').trim();
    if (!s) return null;
    // "1.234,56" (pt-BR) vs "1234.56" (en-US): só trata como pt-BR quando há
    // vírgula, senão "38.42" viraria 3842.
    if (s.indexOf(',') >= 0) s = s.replace(/\\./g, '').replace(',', '.');
    v = parseFloat(s);
  }
  if (typeof v !== 'number' || !isFinite(v)) return null;
  return v;
}

// Decide se um número veio em FRAÇÃO (0,285) ou em PERCENTUAL (28,5). É o
// ponto mais perigoso do parser: errar aqui não gera erro nenhum, só entrega
// uma nota errada com cara de certa.
//
// "teto" é o maior valor plausível na escala de fração para AQUELE indicador.
// "referencia" é o mesmo indicador calculado por um caminho independente
// (ROE = P/VP ÷ P/L, por exemplo) — quando existe, é ela que resolve a zona
// ambígua sem adivinhação.
// Distância em RAZÃO (log), não em diferença. Com diferença absoluta uma
// referência pequena puxa a decisão pro lado errado: ROE 0,25 (fração certa,
// 25%) contra referência 0,12 dá |0,25−0,12| = 0,13 pra fração e
// |0,0025−0,12| = 0,1175 pro percentual — o percentual "ganha" por um fio e o
// ROE de 25% vira 0,25%, caindo de 5 pontos pra 1. Em razão: 0,25/0,12 = 2,1x
// contra 0,0025/0,12 = 48x, e a fração ganha com folga, que é o correto.
// Escala é uma grandeza multiplicativa; comparar por subtração era o erro.
function _screenerDistRazao(a, b) {
  if (!isFinite(a) || !isFinite(b) || a === 0 || b === 0) return Math.abs(a - b);
  return Math.abs(Math.log(Math.abs(a) / Math.abs(b)));
}

function _screenerNormPct(v, teto, referencia, escalaLote) {
  if (v === null || v === undefined) return { valor: null, confianca: 'ausente', escala: null };
  var comoFracao = v;
  var comoPct = v / 100;
  // A REFERÊNCIA DECIDE ANTES DO TETO. Ela é evidência do próprio papel; o
  // teto é só heurística. Um ROE real de 214% (patrimônio líquido pequeno)
  // chega como 2,14 e o teto sozinho o rebaixaria pra 2,1% — mas o
  // P/VP ÷ P/L confirma os 214%, e é nele que se deve acreditar.
  if (referencia !== null && referencia !== undefined && isFinite(referencia)) {
    var ehFracao = _screenerDistRazao(comoFracao, referencia) <= _screenerDistRazao(comoPct, referencia);
    return { valor: ehFracao ? comoFracao : comoPct, confianca: 'alta', escala: ehFracao ? 'fracao' : 'percentual' };
  }
  // Acima do teto só a leitura percentual explica o número.
  if (Math.abs(v) > teto) return { valor: comoPct, confianca: 'alta', escala: 'percentual' };
  // Sem segunda fonte no próprio papel, mas com o veredito do LOTE: um valor
  // sozinho é ambíguo, quinze não são (ver _screenerEscalaLote). É este o
  // caminho que salva o caso comum — resposta em fração e sem P/VP, sem
  // lucro/receita e sem histórico de proventos pra desempatar.
  if (escalaLote === 'percentual') return { valor: comoPct, confianca: 'media', escala: 'percentual', porLote: true };
  if (escalaLote === 'fracao') return { valor: comoFracao, confianca: 'media', escala: 'fracao', porLote: true };
  // Zona ambígua sem segunda fonte: 0,9 tanto pode ser 90% quanto 0,9%.
  if (Math.abs(v) >= 0.005) return { valor: comoFracao, confianca: 'baixa', escala: 'fracao' };
  // Perto de zero as duas leituras dão praticamente no mesmo.
  return { valor: comoFracao, confianca: 'alta', escala: 'fracao' };
}

// ── Calibração de escala pelo LOTE ─────────────────────────────────────────
// O descarte por escala ambígua é a regra certa (errar pra cima num app de
// investimento é bem pior que perder um indicador), mas sozinho ele deixa a
// feature sem nota nenhuma justamente no caso mais provável: resposta em
// fração e sem nenhuma fonte de desempate. Daí este plano B.
//
// A ideia: um valor isolado de ROE = 0,285 é ambíguo (28,5% ou 0,285%?), mas
// quinze papéis não são. Se o campo vier em percentual, a lista inteira fica
// em 20, 28, 31; se vier em fração, fica em 0,20, 0,28, 0,31. A MEDIANA
// separa os dois mundos com folga e não se deixa levar por um outlier.
//
// Exige amostra mínima de propósito: com 1 ou 2 papéis a mediana não decide
// nada, e nesse caso devolve null — ou seja, cai de volta no descarte
// conservador, que é o comportamento seguro.
var SCREENER_ESCALA_MIN_AMOSTRA = 4;

function _screenerEscalaLote(valores, teto) {
  var limpos = [];
  for (var i = 0; i < (valores || []).length; i++) {
    var n = _screenerNum(valores[i]);
    // Zero e negativo não ajudam a distinguir escala (0 é 0 nas duas leituras,
    // e prejuízo distorce a mediana), então ficam de fora da amostra.
    if (n !== null && isFinite(n) && n > 0) limpos.push(Math.abs(n));
  }
  if (limpos.length < SCREENER_ESCALA_MIN_AMOSTRA) return null;
  limpos.sort(function (a, b) { return a - b; });
  var meio = Math.floor(limpos.length / 2);
  var mediana = limpos.length % 2 ? limpos[meio] : (limpos[meio - 1] + limpos[meio]) / 2;
  return mediana > teto ? 'percentual' : 'fracao';
}

// Tetos por campo — os mesmos usados na normalização individual, num lugar só
// pra lote e papel isolado nunca divergirem.
var SCREENER_TETO = { roe: 1.5, margem: 1.5, dy: 0.40 };

// Varre as respostas cruas do lote e devolve { roe, dy, margem } com o
// veredito de escala de cada campo (ou null quando não deu pra decidir).
function _screenerEscalasDoLote(crus) {
  var brutos = { roe: [], dy: [], margem: [] };
  for (var i = 0; i < (crus || []).length; i++) {
    var cru = crus[i];
    if (!cru) continue;
    brutos.roe.push(_brapiPega(cru, ['financialData', 'defaultKeyStatistics', null], ['returnOnEquity', 'roe']).valor);
    brutos.dy.push(_brapiPega(cru, [null, 'summaryDetail', 'defaultKeyStatistics'], ['dividendYield', 'trailingAnnualDividendYield', 'yield']).valor);
    brutos.margem.push(_brapiPega(cru, ['financialData', 'defaultKeyStatistics', null], ['profitMargins', 'netMargin']).valor);
  }
  return {
    roe: _screenerEscalaLote(brutos.roe, SCREENER_TETO.roe),
    dy: _screenerEscalaLote(brutos.dy, SCREENER_TETO.dy),
    margem: _screenerEscalaLote(brutos.margem, SCREENER_TETO.margem),
    amostra: brutos.roe.length
  };
}

// Varre módulo × nome procurando o primeiro campo que existe e é numérico. A
// brapi põe returnOnEquity em defaultKeyStatistics, o Yahoo põe em
// financialData, e nada garante que continue assim na próxima versão — então
// em vez de fixar um caminho, procura em todos. Módulo null = raiz do result.
// O "origem" volta na resposta de propósito: quando a nota parecer errada, é
// ele que diz de onde o número saiu.
function _brapiPega(result, modulos, nomes) {
  if (!result || typeof result !== 'object') return { valor: null, origem: null };
  for (var m = 0; m < modulos.length; m++) {
    var alvo = modulos[m] === null ? result : result[modulos[m]];
    if (!alvo || typeof alvo !== 'object') continue;
    for (var n = 0; n < nomes.length; n++) {
      var num = _screenerNum(alvo[nomes[n]]);
      if (num === null) continue;
      return { valor: num, origem: (modulos[m] === null ? 'topo' : modulos[m]) + '.' + nomes[n] };
    }
  }
  return { valor: null, origem: null };
}

// Nomes possíveis do histórico de proventos. Esta é a parte do payload em que
// eu tenho MENOS certeza (a brapi está bloqueada no sandbox e não deu pra
// conferir), por isso a busca aceita vários nomes em cada posição.
var SCREENER_MODULOS_DIV = ['dividendsData', 'dividends', 'dividendsHistory'];
var SCREENER_LISTAS_DIV = ['cashDividends', 'cash_dividends', 'cash', 'dividends'];
var SCREENER_CAMPOS_VALOR_DIV = ['rate', 'value', 'amount', 'paymentValue'];
var SCREENER_CAMPOS_DATA_DIV = ['paymentDate', 'date', 'lastDatePrior', 'approvedOn'];

// DY derivado: proventos EM DINHEIRO dos últimos 12 meses ÷ preço. É o
// caminho mais confiável e às vezes o único (campo pronto de dividend yield
// pode simplesmente não vir no plano contratado), e serve de referência de
// escala pro campo pronto quando os dois existem.
//
// Bonificação em ações e subscrição ficam de fora de propósito: não são
// dinheiro no bolso, não entram em yield.
function _screenerDividendos12m(result, preco, agoraMs) {
  if (!result || preco === null || preco <= 0) return { valor: null, origem: null, total: null };
  var lista = null;
  for (var m = 0; m < SCREENER_MODULOS_DIV.length && !lista; m++) {
    var mod = result[SCREENER_MODULOS_DIV[m]];
    if (!mod || typeof mod !== 'object') continue;
    if (Array.isArray(mod)) { lista = mod; break; }
    for (var l = 0; l < SCREENER_LISTAS_DIV.length; l++) {
      if (Array.isArray(mod[SCREENER_LISTAS_DIV[l]])) { lista = mod[SCREENER_LISTAS_DIV[l]]; break; }
    }
  }
  if (!Array.isArray(lista) || !lista.length) return { valor: null, origem: null, total: null };

  var inicio = agoraMs - 365 * 24 * 60 * 60 * 1000;
  var futuroLimite = agoraMs + 90 * 24 * 60 * 60 * 1000;
  var soma = 0, usados = 0;
  for (var i = 0; i < lista.length; i++) {
    var item = lista[i];
    if (!item || typeof item !== 'object') continue;
    var valor = null;
    for (var v = 0; v < SCREENER_CAMPOS_VALOR_DIV.length && valor === null; v++) {
      valor = _screenerNum(item[SCREENER_CAMPOS_VALOR_DIV[v]]);
    }
    if (valor === null || valor <= 0) continue;
    var quando = null;
    for (var d = 0; d < SCREENER_CAMPOS_DATA_DIV.length && quando === null; d++) {
      var bruta = item[SCREENER_CAMPOS_DATA_DIV[d]];
      if (!bruta) continue;
      var t = Date.parse(String(bruta));
      if (!isNaN(t)) quando = t;
    }
    // Sem data confiável não dá pra saber se o provento é dos últimos 12
    // meses — e somar tudo que veio infla o yield de quem tem histórico longo
    // na resposta. Fora. O mesmo vale pra data absurdamente no futuro.
    if (quando === null || quando < inicio || quando > futuroLimite) continue;
    soma += valor;
    usados++;
  }
  if (!usados) return { valor: null, origem: null, total: null };
  return { valor: soma / preco, origem: 'derivado(proventos 12m: ' + usados + ' pagamentos)', total: soma };
}

// ── Faixas de pontuação (0 a 5 por indicador) ──────────────────────────────
// Cada função devolve { pontos, faixa, flag } — ou null quando o valor é
// implausível. null aqui significa "dado podre, vira N/A e sai do
// denominador", nunca "nota 0": dado ruim não é empresa ruim.
//
// As faixas são calibradas pra bolsa brasileira, não pra americana: a média
// histórica do Ibovespa gira em torno de P/L 10-12, então 15 aqui já é caro.

function _notaPL(v) {
  if (v === null || v === undefined) return null;
  // Extremo NÃO vira N/A: vira a PIOR faixa. N/A sai do denominador e a nota
  // é normalizada pelo que sobrou — então o papel absurdo acabava PREMIADO,
  // ficando acima de um papel apenas ruim que tinha o dado. Só ausência de
  // verdade (o campo não veio) pode sair do denominador.
  if (v > 200 || v < -500) return { pontos: 0, faixa: 'fora de qualquer faixa plausível — número não confiável', flag: 'extremo' };
  if (v <= 0) return { pontos: 0, faixa: 'prejuízo nos últimos 12 meses' };
  // Abaixo de 1 quase nunca é barganha: é lucro não recorrente ou LPA
  // defasado. Não premiar como se fosse.
  if (v < 1) return { pontos: 2, faixa: 'abaixo de 1 — provável lucro não recorrente', flag: 'suspeito' };
  if (v <= 6) return { pontos: 5, faixa: 'até 6 — muito barato' };
  if (v <= 10) return { pontos: 4, faixa: '6 a 10 — barato' };
  if (v <= 15) return { pontos: 3, faixa: '10 a 15 — preço justo' };
  if (v <= 22) return { pontos: 2, faixa: '15 a 22 — caro' };
  if (v <= 35) return { pontos: 1, faixa: '22 a 35 — muito caro' };
  return { pontos: 0, faixa: 'acima de 35 — muita expectativa embutida' };
}

// Recebe FRAÇÃO (0.081 = 8,1% ao ano).
function _notaDY(v) {
  if (v === null || v === undefined) return null;
  // Acima de 40% é erro de escala ou dado podre, não pagadora generosa.
  // Nota 0 e não N/A: ver o comentário em _notaPL — N/A premiaria o absurdo.
  if (v < 0 || v > 0.40) return { pontos: 0, faixa: 'fora de qualquer faixa plausível — número não confiável', flag: 'extremo' };
  if (v === 0) return { pontos: 0, faixa: 'não distribui proventos' };
  if (v <= 0.02) return { pontos: 1, faixa: 'até 2% ao ano' };
  if (v <= 0.04) return { pontos: 2, faixa: '2% a 4% ao ano' };
  if (v <= 0.06) return { pontos: 3, faixa: '4% a 6% ao ano' };
  if (v <= 0.09) return { pontos: 4, faixa: '6% a 9% ao ano' };
  if (v <= 0.20) return { pontos: 5, faixa: '9% a 20% ao ano' };
  // Acima de 20% quase sempre é provento extraordinário ou preço desabando —
  // a armadilha de yield. Premiar isso seria mandar o usuário pro buraco.
  return { pontos: 2, faixa: 'acima de 20% — possível armadilha de yield', flag: 'armadilha' };
}

// Recebe FRAÇÃO (0.285 = 28,5%).
function _notaROE(v) {
  if (v === null || v === undefined) return null;
  if (v <= 0) return { pontos: 0, faixa: 'zero ou negativo — destrói valor do acionista' };
  if (v <= 0.05) return { pontos: 1, faixa: 'até 5%' };
  if (v <= 0.10) return { pontos: 2, faixa: '5% a 10%' };
  if (v <= 0.15) return { pontos: 3, faixa: '10% a 15%' };
  if (v <= 0.20) return { pontos: 4, faixa: '15% a 20%' };
  if (v <= 1.00) return { pontos: 5, faixa: '20% a 100% — rentabilidade alta' };
  // Acima de 100% o patrimônio líquido está perto de zero e infla o índice.
  // É característica de balanço, não qualidade.
  return { pontos: 3, faixa: 'acima de 100% — patrimônio pequeno infla o índice', flag: 'inflado' };
}

// Múltiplo (x). Negativo é LEGÍTIMO: significa caixa maior que dívida.
function _notaDivEbitda(v) {
  if (v === null || v === undefined) return null;
  // Acima de 30x o EBITDA está quase zerado. Nota 0, não N/A: com N/A o
  // indicador saía do denominador e a empresa praticamente insolvente
  // terminava com nota MAIOR que a de uma alavancada comum — que leva 0.
  if (v > 30) return { pontos: 0, faixa: 'acima de 30x — dívida impagável com a geração de caixa atual', flag: 'extremo' };
  if (v < 0) return { pontos: 5, faixa: 'caixa líquido — caixa maior que a dívida' };
  if (v <= 1) return { pontos: 5, faixa: 'até 1x' };
  if (v <= 2) return { pontos: 4, faixa: '1x a 2x' };
  if (v <= 3) return { pontos: 3, faixa: '2x a 3x' };
  if (v <= 3.5) return { pontos: 2, faixa: '3x a 3,5x — perto do covenant típico' };
  if (v <= 4.5) return { pontos: 1, faixa: '3,5x a 4,5x — alavancagem alta' };
  return { pontos: 0, faixa: 'acima de 4,5x — risco de refinanciamento' };
}

// Recebe FRAÇÃO (0.213 = 21,3%).
function _notaMargem(v) {
  if (v === null || v === undefined) return null;
  // Idem: extremo é a pior faixa, não ausência (ver _notaPL).
  if (v > 1.5 || v < -5) return { pontos: 0, faixa: 'fora de qualquer faixa plausível — número não confiável', flag: 'extremo' };
  if (v <= 0) return { pontos: 0, faixa: 'negativa — vende e perde dinheiro' };
  if (v <= 0.05) return { pontos: 1, faixa: 'até 5%' };
  if (v <= 0.10) return { pontos: 2, faixa: '5% a 10%' };
  if (v <= 0.15) return { pontos: 3, faixa: '10% a 15%' };
  if (v <= 0.25) return { pontos: 4, faixa: '15% a 25%' };
  if (v <= 0.90) return { pontos: 5, faixa: '25% a 90% — margem excepcional' };
  // Acima de 90% é holding, equivalência patrimonial ou fundo classificado
  // errado. Não é qualidade operacional.
  return { pontos: 3, faixa: 'acima de 90% — resultado não operacional', flag: 'nao_operacional' };
}

// Pesos por indicador, ISOLADOS aqui de propósito: assim viram configuração
// (por perfil de investidor, por exemplo) sem ninguém precisar entrar no
// cálculo. Hoje todos valem 1 — sem histórico de qual indicador prevê melhor,
// peso igual é a hipótese mais honesta, e peso arbitrário só esconderia
// opinião dentro de um número.
var SCORE_PESOS = { pl: 1, dy: 1, roe: 1, dividaEbitda: 1, margem: 1 };

// Cada indicador vale de 0 a 5; com os pesos atuais o total fecha em 25.
var SCORE_NOTA_MAX = 5;

// Abaixo disso a nota não é exibida. Uma nota calculada sobre 1 ou 2
// indicadores é ruído com aparência de precisão.
var SCORE_MIN_INDICADORES = 3;

// Metadados dos 5 indicadores — a ordem aqui é a ordem do detalhe na resposta.
var SCREENER_INDICADORES = [
  { chave: 'pl',           rotulo: 'P/L',                escala: 'numero',  nota: _notaPL },
  { chave: 'dy',           rotulo: 'Dividend Yield',     escala: 'fracao',  nota: _notaDY },
  { chave: 'roe',          rotulo: 'ROE',                escala: 'fracao',  nota: _notaROE },
  { chave: 'dividaEbitda', rotulo: 'Dívida líq./EBITDA', escala: 'numero',  nota: _notaDivEbitda },
  { chave: 'margem',       rotulo: 'Margem líquida',     escala: 'fracao',  nota: _notaMargem }
];

// FUNÇÃO PURA de score. Não lê env, não chama fetch, não olha o relógio, não
// toca no KV: dá pra copiar pro node e testar com um objeto literal, que é
// exatamente o ponto.
//
// Entrada: indicadores JÁ NORMALIZADOS — pl e dividaEbitda em número puro,
// dy/roe/margem em FRAÇÃO (0.285 = 28,5%); ausente é null. O campo extra
// ind.ebitdaNaoPositivo === true diz "EBITDA zero ou negativo", que NÃO é
// dado faltando: é a empresa sem geração de caixa, e isso é nota 0 de verdade.
// "motivos" (opcional) explica por que cada ausente está ausente, pra UI
// conseguir dizer "N/A porque o setor é financeiro" em vez de só "—".
//
// ── DECISÃO: INDICADOR AUSENTE SAI DO DENOMINADOR ──
// Não vira 0 e não vira 5. É a decisão mais importante desta função.
// Contar ausente como 0 pune buraco de DADO como se fosse fundamento ruim:
// MXRF11 não tem ROE porque é fundo imobiliário e ITUB4 não tem
// Dívida/EBITDA porque é banco — nos dois casos zerar jogaria a nota pro
// fundo e o ranking mentiria. Contar como 5 é pior: premiaria justamente quem
// tem menos dado, e um papel sem nenhum indicador viraria o melhor da lista.
// Normalizar pelo que existe mantém a nota comparável, DESDE QUE a cobertura
// apareça junto — por isso "cobertura" volta na resposta e a nota só é dada
// com pelo menos SCORE_MIN_INDICADORES indicadores.
function _screenerScore(ind, motivos) {
  ind = ind || {};
  motivos = motivos || {};
  var detalhes = [];
  var pontosBrutos = 0;
  var pontosMaximos = 0;
  var pesoTotal = 0;
  var cobertura = 0;

  for (var i = 0; i < SCREENER_INDICADORES.length; i++) {
    var meta = SCREENER_INDICADORES[i];
    var peso = SCORE_PESOS[meta.chave];
    if (peso === undefined || peso === null) peso = 1;
    pesoTotal += peso;

    var valor = ind[meta.chave];
    if (valor === undefined) valor = null;
    // Infinity/NaN vindo de divisão por zero é ausência disfarçada, não valor.
    if (typeof valor === 'number' && !isFinite(valor)) valor = null;
    if (valor !== null && typeof valor !== 'number') valor = _screenerNum(valor);

    var nota = null;
    if (meta.chave === 'dividaEbitda' && ind.ebitdaNaoPositivo === true) {
      nota = { pontos: 0, faixa: 'EBITDA zero ou negativo — não gera caixa pra pagar dívida nenhuma' };
      valor = null;
    } else if (valor !== null) {
      nota = meta.nota(valor);
    }

    if (nota === null) {
      detalhes.push({
        chave: meta.chave, rotulo: meta.rotulo, escala: meta.escala, peso: peso,
        disponivel: false, valor: null, pontos: null, pontosMaximos: null,
        faixa: 'sem dado', flag: null,
        motivo: motivos[meta.chave] || (valor === null ? 'não veio na resposta da fonte' : 'valor fora de faixa plausível — descartado de propósito')
      });
      continue;
    }

    cobertura++;
    var ganhos = nota.pontos * peso;
    var maximo = SCORE_NOTA_MAX * peso;
    pontosBrutos += ganhos;
    pontosMaximos += maximo;
    detalhes.push({
      chave: meta.chave, rotulo: meta.rotulo, escala: meta.escala, peso: peso,
      disponivel: true, valor: valor, pontos: ganhos, pontosMaximos: maximo,
      faixa: nota.faixa, flag: nota.flag || null, motivo: null
    });
  }

  var escalaMaxima = SCORE_NOTA_MAX * pesoTotal; // 25 com os pesos atuais
  var suficiente = cobertura >= SCORE_MIN_INDICADORES;
  // Regra de três sobre o que existe, trazida de volta pra escala cheia.
  // Arredonda em uma casa: precisão maior aqui seria falsa, os dados de
  // entrada não sustentam.
  var total = pontosMaximos > 0 ? Math.round((pontosBrutos / pontosMaximos) * escalaMaxima * 10) / 10 : null;

  return {
    total: suficiente ? total : null,
    escalaMaxima: escalaMaxima,
    pontosBrutos: pontosBrutos,
    pontosMaximos: pontosMaximos,
    cobertura: cobertura,
    totalIndicadores: SCREENER_INDICADORES.length,
    minimoIndicadores: SCORE_MIN_INDICADORES,
    suficiente: suficiente,
    motivo: suficiente ? null : ('nota não calculada: só ' + cobertura + ' de ' + SCREENER_INDICADORES.length + ' indicadores disponíveis (mínimo ' + SCORE_MIN_INDICADORES + ')'),
    pesos: SCORE_PESOS,
    detalhes: detalhes
  };
}

// Ajuste de trilha — também PURO. O score de 5 indicadores é de AÇÃO. Rodar
// ele num FII não dá erro: dá nota ALTA errada, que é bem pior. Fundo
// imobiliário não tem custo de produção (margem perto de 100% por construção)
// e costuma ser desalavancado (dívida quase zero), então ganharia dois
// indicadores de graça e bateria quase toda ação boa da lista. Até existir
// trilha própria (P/VP, DY, vacância, liquidez), o honesto é mostrar os
// números e NÃO dar nota.
function _screenerNotaFinal(score, classe) {
  if (classe !== 'fii') return Object.assign({ aplicavel: true }, score);
  return Object.assign({}, score, {
    aplicavel: false,
    total: null,
    suficiente: false,
    motivo: 'fundo imobiliário — o Finn ainda não pontua fundos. O score de 5 indicadores é de ação e daria nota inflada aqui (margem perto de 100% e dívida quase zero por construção). Compare por P/VP e DY.'
  });
}

// ── Classificação do papel ─────────────────────────────────────────────────

function _screenerSetor(result) {
  var perfil = (result && result.summaryProfile) || null;
  return String((perfil && perfil.sector) || (result && result.sector) || '').toUpperCase();
}

function _screenerClasse(ticker, result) {
  if (SCREENER_FIIS.indexOf(ticker) !== -1) return 'fii';
  // Rede de segurança pra quando alguém acrescentar um papel em
  // SCREENER_TICKERS e esquecer de classificar: nome e setor denunciam o
  // fundo. Só vale pra sufixo 11, pra não confundir com construtora.
  var nome = String((result && (result.longName || result.shortName)) || '').toUpperCase();
  var setor = _screenerSetor(result);
  if (/11$/.test(ticker) && (nome.indexOf('FII') !== -1 || nome.indexOf('IMOB') !== -1 || setor.indexOf('REAL ESTATE') !== -1)) return 'fii';
  if (SCREENER_UNITS.indexOf(ticker) !== -1) return 'unit';
  return 'acao';
}

function _screenerEhFinanceira(ticker, result) {
  if (SCREENER_FINANCEIRAS.indexOf(ticker) !== -1) return true;
  return _screenerSetor(result).indexOf('FINANCIAL') !== -1;
}

// ── Extração e normalização dos indicadores ────────────────────────────────
// Todo campo é procurado por cadeia de fallback (módulo × nome × derivação),
// porque não dá pra assumir onde a brapi põe cada coisa nem em que escala —
// e um campo que sumir numa versão nova não pode derrubar os outros quatro.
function _screenerIndicadores(ticker, result, classe, ehFinanceira, agoraMs, escalasLote) {
  var motivos = {};
  var origens = {};
  var escalaDuvidosa = [];
  var escalaPorLote = [];
  escalasLote = escalasLote || {};

  var precoRef = _brapiPega(result, [null, 'price'], ['regularMarketPrice', 'price', 'regularMarketPreviousClose', 'close']);
  var preco = precoRef.valor;

  // ── P/L ──
  var pl = _brapiPega(result, [null, 'defaultKeyStatistics', 'summaryDetail'], ['priceEarnings', 'trailingPE', 'priceToEarnings']);
  if (pl.valor === null && preco !== null) {
    // Derivação: preço ÷ lucro por ação. Denominador conferido ANTES — LPA
    // zerado daria Infinity, que é ausência disfarçada de número.
    var lpa = _brapiPega(result, [null, 'defaultKeyStatistics'], ['earningsPerShare', 'trailingEps', 'epsTrailingTwelveMonths']);
    if (lpa.valor !== null && lpa.valor !== 0) pl = { valor: preco / lpa.valor, origem: 'derivado(preço ÷ ' + lpa.origem + ')' };
  }
  if (pl.valor === null) motivos.pl = 'P/L não veio e não deu pra derivar de preço ÷ LPA';
  origens.pl = pl.origem;

  // ── P/VP ── não pontua, mas faz dois trabalhos: é O múltiplo de FII, e é o
  // desempatador de escala do ROE (P/VP ÷ P/L = LPA/VPA = ROE, identidade
  // contábil exata, com os dois insumos em número puro e sem ambiguidade).
  var pvp = _brapiPega(result, [null, 'defaultKeyStatistics', 'summaryDetail'], ['priceToBook', 'priceToBookRatio', 'pvp']);
  if (pvp.valor === null && preco !== null) {
    var vpa = _brapiPega(result, [null, 'defaultKeyStatistics'], ['bookValue', 'bookValuePerShare']);
    if (vpa.valor !== null && vpa.valor !== 0) pvp = { valor: preco / vpa.valor, origem: 'derivado(preço ÷ ' + vpa.origem + ')' };
  }
  origens.pvp = pvp.origem;
  // Só vale como referência com lucro positivo — com P/L negativo a razão
  // troca de sinal e deixaria de casar com o ROE.
  var roeReferencia = (pvp.valor !== null && pl.valor !== null && pl.valor > 0) ? (pvp.valor / pl.valor) : null;

  // ── ROE ──
  var roeBruto = _brapiPega(result, ['financialData', 'defaultKeyStatistics', null], ['returnOnEquity', 'roe']);
  if (roeBruto.valor === null && roeReferencia !== null) {
    roeBruto = { valor: roeReferencia, origem: 'derivado(P/VP ÷ P/L)' };
  }
  var roeNorm = _screenerNormPct(roeBruto.valor, SCREENER_TETO.roe, roeReferencia, escalasLote.roe);
  if (roeNorm.porLote) escalaPorLote.push('roe');
  var roe = roeNorm.valor;
  var roeOrigem = roeBruto.origem;
  if (roeBruto.valor === null) {
    motivos.roe = 'ROE não veio em nenhum módulo e não deu pra derivar de P/VP ÷ P/L';
  } else if (roeNorm.confianca === 'baixa') {
    // Regra dura, e a mais importante deste arquivo: escala duvidosa vira
    // N/A. Um ROE real de 0,9% lido como 90% ganharia nota 5 — perder um
    // indicador é infinitamente mais barato que dar nota máxima pra empresa
    // ruim num app de investimento em beta, que o usuário vai conferir em
    // outro site no primeiro papel.
    escalaDuvidosa.push('roe');
    motivos.roe = 'escala ambígua (fração ou percentual) e sem segunda fonte pra desempatar — descartado de propósito';
    roe = null;
    roeOrigem = null;
  }
  origens.roe = roeOrigem;

  // ── DY ── o mais provável de faltar: o campo pronto depende do plano.
  var divs = _screenerDividendos12m(result, preco, agoraMs);
  var dyBruto = _brapiPega(result, [null, 'summaryDetail', 'defaultKeyStatistics'], ['dividendYield', 'trailingAnnualDividendYield', 'yield']);
  var dyNorm = _screenerNormPct(dyBruto.valor, SCREENER_TETO.dy, divs.valor, escalasLote.dy);
  if (dyNorm.porLote) escalaPorLote.push('dy');
  var dy = null, dyOrigem = null;
  if (dyBruto.valor !== null && dyNorm.confianca !== 'baixa') {
    dy = dyNorm.valor;
    dyOrigem = dyBruto.origem + (dyNorm.escala === 'percentual' ? ' (lido como percentual)' : '');
  } else if (divs.valor !== null) {
    dy = divs.valor;
    dyOrigem = divs.origem;
  } else if (dyBruto.valor !== null) {
    escalaDuvidosa.push('dy');
    motivos.dy = 'escala ambígua (fração ou percentual) e sem histórico de proventos pra desempatar — descartado de propósito';
  } else {
    motivos.dy = 'nem campo pronto de dividend yield nem histórico de proventos vieram na resposta';
  }
  origens.dy = dyOrigem;

  // ── Margem líquida ──
  // NUNCA cair em grossMargins/operatingMargins/ebitdaMargins como
  // substituto: medem outra coisa, são sistematicamente maiores e inflariam a
  // nota sem ninguém perceber.
  var receita = _brapiPega(result, ['financialData', 'incomeStatement', null], ['totalRevenue', 'revenue']);
  var lucro = _brapiPega(result, ['defaultKeyStatistics', 'financialData', null], ['netIncomeToCommon', 'netIncome']);
  var margemReferencia = (receita.valor !== null && receita.valor !== 0 && lucro.valor !== null) ? (lucro.valor / receita.valor) : null;
  var margemBruta = _brapiPega(result, ['financialData', 'defaultKeyStatistics', null], ['profitMargins', 'netMargin']);
  var margemNorm = _screenerNormPct(margemBruta.valor, SCREENER_TETO.margem, margemReferencia, escalasLote.margem);
  if (margemNorm.porLote) escalaPorLote.push('margem');
  var margem = null, margemOrigem = null;
  if (margemBruta.valor !== null && margemNorm.confianca !== 'baixa') {
    margem = margemNorm.valor;
    margemOrigem = margemBruta.origem + (margemNorm.escala === 'percentual' ? ' (lido como percentual)' : '');
  } else if (margemReferencia !== null) {
    margem = margemReferencia;
    margemOrigem = 'derivado(lucro líquido ÷ receita)';
  } else if (margemBruta.valor !== null) {
    escalaDuvidosa.push('margem');
    motivos.margem = 'escala ambígua (fração ou percentual) e sem lucro/receita pra desempatar — descartado de propósito';
  } else {
    motivos.margem = 'margem líquida não veio e não deu pra derivar de lucro ÷ receita';
  }
  origens.margem = margemOrigem;

  // ── Dívida líquida / EBITDA ──
  // Não existe pronto em lugar nenhum (nem Yahoo nem brapi têm debtToEbitda):
  // é sempre derivado. E debtToEquity NÃO serve de substituto — mede
  // alavancagem sobre patrimônio, não sobre geração de caixa, e a conversão
  // entre os dois simplesmente não existe.
  var dividaEbitda = null, dividaOrigem = null, ebitdaNaoPositivo = false;
  if (classe === 'fii') {
    motivos.dividaEbitda = 'fundo imobiliário — o indicador não se aplica (a maioria é desalavancada e ganharia nota 5 de graça)';
  } else if (ehFinanceira) {
    motivos.dividaEbitda = 'banco, seguradora ou bolsa — dívida é matéria-prima do negócio e EBITDA não é métrica do setor';
  } else {
    var divida = _brapiPega(result, ['financialData', 'balanceSheet', null], ['totalDebt']);
    var caixa = _brapiPega(result, ['financialData', 'balanceSheet', null], ['totalCash', 'cash']);
    var ebitda = _brapiPega(result, ['financialData', 'defaultKeyStatistics', null], ['ebitda', 'EBITDA']);
    var ev = _brapiPega(result, ['defaultKeyStatistics', null], ['enterpriseValue']);
    var evEbitda = _brapiPega(result, ['defaultKeyStatistics', null], ['enterpriseToEbitda']);
    var valorMercado = _brapiPega(result, [null, 'defaultKeyStatistics', 'price'], ['marketCap', 'marketCapitalization']);

    // Caminho alternativo via Enterprise Value: EBITDA = EV ÷ (EV/EBITDA).
    // É álgebra exata, e salva quando financialData não vem no plano.
    if (ebitda.valor === null && ev.valor !== null && evEbitda.valor !== null && evEbitda.valor !== 0) {
      ebitda = { valor: ev.valor / evEbitda.valor, origem: 'derivado(EV ÷ EV/EBITDA)' };
    }

    if (ebitda.valor !== null && ebitda.valor <= 0) {
      // Isso não é dado faltando: é a empresa sem geração de caixa nenhuma.
      // Sinalizado à parte pro score dar nota 0 em vez de N/A.
      ebitdaNaoPositivo = true;
      dividaOrigem = ebitda.origem;
    } else if (ebitda.valor !== null && divida.valor !== null) {
      var liquida = caixa.valor !== null ? (divida.valor - caixa.valor) : divida.valor;
      dividaEbitda = liquida / ebitda.valor;
      // Sem totalCash sobra a dívida BRUTA: pontua igual, mas é conservador
      // (subestima quem tem caixa grande) — por isso fica escrito na origem,
      // pra tela poder avisar.
      dividaOrigem = (caixa.valor !== null ? 'dívida líquida' : 'dívida BRUTA, sem totalCash') + ' ÷ ' + ebitda.origem;
    } else if (ebitda.valor !== null && ev.valor !== null && valorMercado.valor !== null) {
      // Dívida líquida ≈ EV − valor de mercado (aproxima: ignora minoritários).
      dividaEbitda = (ev.valor - valorMercado.valor) / ebitda.valor;
      dividaOrigem = 'derivado((EV − valor de mercado) ÷ EBITDA)';
    } else {
      motivos.dividaEbitda = 'dívida e/ou EBITDA não vieram e não deu pra derivar por Enterprise Value';
    }
  }
  origens.dividaEbitda = dividaOrigem;

  // FII não tem ROE nem margem no sentido de empresa: o "patrimônio" é a
  // carteira de imóveis e não há custo de produção, então a margem fica perto
  // de 100% por construção. São números que existem matematicamente e não
  // significam nada — N/A explícito é mais honesto.
  if (classe === 'fii') {
    roe = null;
    origens.roe = null;
    motivos.roe = 'fundo imobiliário — ROE de empresa não se aplica';
    margem = null;
    origens.margem = null;
    motivos.margem = 'fundo imobiliário — margem fica perto de 100% por construção, não mede qualidade';
  }

  return {
    preco: preco,
    pvp: pvp.valor,
    proventos12m: divs.total,
    valores: {
      pl: pl.valor, dy: dy, roe: roe, dividaEbitda: dividaEbitda, margem: margem,
      ebitdaNaoPositivo: ebitdaNaoPositivo
    },
    motivos: motivos,
    origens: origens,
    escalaDuvidosa: escalaDuvidosa,
    // Quais indicadores só têm valor porque o LOTE decidiu a escala. Vai pra
    // resposta e daí pra tela: a nota é confiável, mas o usuário merece saber
    // que a escala foi inferida do conjunto e não confirmada no próprio papel.
    escalaPorLote: escalaPorLote
  };
}

// ── Chamada à brapi ────────────────────────────────────────────────────────

// O token NUNCA pode sair daqui — nem pro cliente, nem pro log do Worker.
// Mensagem de erro de API costuma ecoar a URL chamada, e a URL da segunda
// tentativa carrega ?token=. "wrangler tail" é lido em tela compartilhada.
function _screenerRedige(texto, token) {
  var t = String(texto || '');
  if (token) t = t.split(String(token)).join('***');
  // Rede final: qualquer coisa com cara de token na query, mesmo que o valor
  // não seja exatamente o secret (truncado no meio da mensagem, por exemplo).
  return t.replace(/([?&](?:token|api_?key)=)[^&\\s"']+/gi, '$1***');
}

// Chamada única à brapi, com TODO modo de falha traduzido pra um formato
// interno { ok, motivo, status, result }. Quem chama nunca vê status nem
// corpo do fornecedor: o repo já segue isso (ver _serverError) porque
// mensagem de terceiro carrega formato interno e nome de campo — não ajuda o
// usuário e ajuda quem está sondando.
async function _brapiBusca(env, ticker) {
  // encodeURIComponent aqui é redundante (o ticker já saiu da allowlist), mas
  // é a mesma disciplina de _pluggyTx: validar o formato e ainda assim
  // codificar antes de concatenar em URL de terceiro.
  var url = 'https://brapi.dev/api/quote/' + encodeURIComponent(ticker) +
    '?modules=defaultKeyStatistics,financialData,summaryProfile&fundamental=true&dividends=true';

  // O token vai no HEADER, não na query: assim ele não entra na URL, o que
  // remove a principal via de vazamento (provedor que ecoa a URL chamada na
  // mensagem de erro). A brapi também aceita ?token=, e é pra isso que existe
  // a segunda tentativa — se o header for recusado, repete uma vez com a
  // query, e aí a redação acima entra em ação.
  var tentativas = [
    { url: url, headers: { Authorization: 'Bearer ' + env.BRAPI_TOKEN, Accept: 'application/json' } },
    { url: url + '&token=' + encodeURIComponent(env.BRAPI_TOKEN), headers: { Accept: 'application/json' } }
  ];

  var ultimoStatus = 0;
  for (var t = 0; t < tentativas.length; t++) {
    var resp;
    try {
      var opcoes = { headers: tentativas[t].headers };
      // AbortSignal.timeout pode não existir em runtime antigo — se faltar, a
      // rota continua funcionando, só sem o corte de 8s.
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) opcoes.signal = AbortSignal.timeout(SCREENER_TIMEOUT_MS);
      resp = await fetch(tentativas[t].url, opcoes);
    } catch (e) {
      console.error('[screener] falha de rede na brapi:', _screenerRedige(String((e && e.message) || e), env.BRAPI_TOKEN));
      return { ok: false, motivo: 'rede', status: 0 };
    }
    ultimoStatus = resp.status;

    var texto = '';
    try { texto = await resp.text(); } catch (e2) { texto = ''; }
    // A brapi fica atrás de CDN: em incidente vem página HTML de erro, e aí
    // resp.json() lançaria. Ler texto e tentar o parse é o que evita isso.
    var corpo = null;
    try { corpo = JSON.parse(texto); } catch (e3) { corpo = null; }

    if (resp.status === 401 || resp.status === 403) {
      // Primeira recusa pode ser só "esta versão não aceita o header" — tenta
      // a forma de query antes de desistir. A segunda é token errado mesmo.
      if (t === 0) continue;
      console.error('[screener] brapi recusou o token:', resp.status, _screenerRedige(texto.slice(0, 200), env.BRAPI_TOKEN));
      return { ok: false, motivo: 'token_recusado', status: resp.status };
    }
    if (resp.status === 429) {
      var retry = parseInt(resp.headers.get('Retry-After') || '0', 10) || 60;
      return { ok: false, motivo: 'rate_limit_fornecedor', status: 429, retryAfter: retry };
    }
    if (resp.status === 402) return { ok: false, motivo: 'plano', status: 402 };
    if (resp.status === 404) return { ok: false, motivo: 'nao_encontrado', status: 404 };
    if (!resp.ok || corpo === null || typeof corpo !== 'object') {
      console.error('[screener] resposta inesperada da brapi:', resp.status, _screenerRedige(texto.slice(0, 200), env.BRAPI_TOKEN));
      return { ok: false, motivo: 'fornecedor', status: resp.status };
    }
    // 200 com corpo de erro também acontece — plano/limite costumam vir assim.
    if (corpo.error) {
      var msgErro = String(corpo.message || corpo.error || '').toLowerCase();
      console.error('[screener] brapi devolveu erro no corpo:', _screenerRedige(msgErro.slice(0, 200), env.BRAPI_TOKEN));
      if (msgErro.indexOf('token') !== -1) return { ok: false, motivo: 'token_recusado', status: resp.status };
      if (msgErro.indexOf('plan') !== -1 || msgErro.indexOf('plano') !== -1) return { ok: false, motivo: 'plano', status: resp.status };
      if (msgErro.indexOf('limit') !== -1 || msgErro.indexOf('rate') !== -1) return { ok: false, motivo: 'rate_limit_fornecedor', status: resp.status, retryAfter: 60 };
      return { ok: false, motivo: 'nao_encontrado', status: resp.status };
    }
    if (!Array.isArray(corpo.results) || !corpo.results.length) {
      return { ok: false, motivo: 'nao_encontrado', status: resp.status };
    }
    // Casar por symbol, NUNCA por índice: se a API devolver a lista fora de
    // ordem ou sem um dos papéis pedidos, o índice desalinha e PETR4
    // receberia os fundamentos da VALE3 — o pior bug possível num app de
    // investimento, e um que ninguém percebe olhando a tela.
    var achado = null;
    for (var r = 0; r < corpo.results.length; r++) {
      var it = corpo.results[r];
      if (it && String(it.symbol || '').toUpperCase() === ticker) { achado = it; break; }
    }
    if (!achado) return { ok: false, motivo: 'nao_encontrado', status: resp.status };
    return { ok: true, result: achado, status: resp.status };
  }
  return { ok: false, motivo: 'fornecedor', status: ultimoStatus };
}

// ── Cache: Cache API, não KV ───────────────────────────────────────────────
// Escolha deliberada, e as duas serviriam. O que decidiu:
//   * KV tem cota de ESCRITA (1.000/dia no plano free) e este projeto JÁ
//     esbarra nela — SEC_LOG_MAX_DIA existe exatamente por isso. Cachear
//     cotação no KV somaria uma escrita por papel a cada 20 min, competindo
//     pela mesma cota com o log de segurança, as inscrições de push, o índice
//     do Instagram e o próprio rate limit.
//   * A Cache API não consome cota nenhuma e o TTL sai de graça no
//     Cache-Control.
// O preço é que a Cache API é POR DATA CENTER: acesso vindo de outro ponto do
// país erra o cache e chama a brapi de novo. Pra um screener admin-only, com
// universo fechado de papéis, isso é irrelevante perto de brigar pela cota do
// KV — que é o recurso escasso aqui.
//
// A chave é POR TICKER (nunca por usuário nem por requisição), então o custo
// total é limitado pelo tamanho de SCREENER_TICKERS, não pelo tráfego.

// A Cache API do Worker é escopada na zona, então a chave usa o host da
// própria requisição. O caminho /__cache/ não é rota do Worker: uma
// requisição real a ele cai no 404 de caminho desconhecido lá embaixo, então
// nada do que está guardado aqui fica acessível pela web.
function _screenerCacheKey(request, ticker) {
  var u = new URL(request.url);
  return new Request(u.origin + '/__cache/screener/' + ticker, { method: 'GET' });
}

async function _screenerCacheLe(request, ticker) {
  try {
    if (typeof caches === 'undefined' || !caches.default) return null;
    var hit = await caches.default.match(_screenerCacheKey(request, ticker));
    if (!hit) return null;
    var guardado = await hit.json();
    if (!guardado || !guardado.obtidoEm || !guardado.cru) return null;
    return guardado;
  } catch (e) {
    // Cache é otimização: falhar aqui nunca pode derrubar a rota.
    return null;
  }
}

// Guarda o JSON CRU da brapi, não o normalizado. Assim, quando a heurística
// de escala ou a tabela de pontuação mudar, o cache não precisa ser
// invalidado — a normalização acontece toda vez, na leitura.
function _screenerCacheGrava(request, ticker, cru, ctx) {
  try {
    if (typeof caches === 'undefined' || !caches.default) return;
    var corpo = JSON.stringify({ obtidoEm: new Date().toISOString(), cru: cru });
    var resp = new Response(corpo, {
      headers: {
        'Content-Type': 'application/json',
        // O registro VIVE bem mais que a janela de frescor: dentro dos 20 min
        // é servido normalmente, depois disso vira reserva pra quando a brapi
        // falhar. Quem decide se está fresco é o obtidoEm gravado no corpo.
        'Cache-Control': 'public, max-age=' + SCREENER_CACHE_STALE_TTL_SEG
      }
    });
    var p = caches.default.put(_screenerCacheKey(request, ticker), resp);
    if (ctx && ctx.waitUntil) ctx.waitUntil(p);
    else p.catch(function () {});
  } catch (e) { /* idem: cache nunca derruba a rota */ }
}

// ── Respostas ──────────────────────────────────────────────────────────────

// Traduz a falha da brapi em algo que dá pra mostrar na tela, sem contar nada
// da arquitetura. "token recusado" vira mensagem genérica de propósito: não é
// problema de quem está usando o app, e a informação só serve pra quem sonda.
function _screenerErro(cors, ticker, busca) {
  var mapa = {
    nao_encontrado: { status: 404, tipo: 'nao_encontrado', msg: 'Não achamos o papel ' + ticker + ' na B3 agora.' },
    plano: { status: 503, tipo: 'fonte_limitada', msg: 'Os indicadores completos precisam de um plano de dados que ainda não temos.' },
    rate_limit_fornecedor: { status: 429, tipo: 'muitas_consultas', msg: 'Muita consulta de mercado agora. Tente de novo em instantes.' },
    token_recusado: { status: 503, tipo: 'indisponivel', msg: 'O screener está indisponível no momento.' },
    rede: { status: 504, tipo: 'indisponivel', msg: 'Não conseguimos falar com a fonte de cotações agora.' }
  };
  var e = mapa[busca.motivo] || { status: 502, tipo: 'indisponivel', msg: 'Não conseguimos carregar as cotações agora.' };
  var h = e.status === 429 ? Object.assign({}, cors, { 'Retry-After': String(busca.retryAfter || 60) }) : cors;
  return new Response(JSON.stringify({
    ok: false, ticker: ticker,
    erro: { tipo: e.tipo, mensagem: e.msg },
    aviso: SCREENER_AVISO, natureza: 'dados_publicos_mercado'
  }), { status: e.status, headers: h });
}

function _screenerResposta(cors, ticker, cru, cache, agoraMs, escalasLote) {
  return new Response(JSON.stringify(_screenerPayload(ticker, cru, cache, agoraMs, escalasLote)), { headers: cors });
}

// Monta o objeto de um papel. Separado da Response porque a rota de lote
// (GET /api/stocks) precisa do OBJETO de 15 papéis pra pôr num array só.
function _screenerPayload(ticker, cru, cache, agoraMs, escalasLote) {
  var classe = _screenerClasse(ticker, cru);
  var financeira = _screenerEhFinanceira(ticker, cru);
  var ind = _screenerIndicadores(ticker, cru, classe, financeira, agoraMs, escalasLote);
  var nota = _screenerNotaFinal(_screenerScore(ind.valores, ind.motivos), classe);

  // Distinguir "o plano não libera o módulo" de "a empresa não tem o dado"
  // muda a mensagem inteira da tela — um é problema nosso, o outro não.
  var modulosAusentes = [];
  if (!cru || !cru.defaultKeyStatistics) modulosAusentes.push('defaultKeyStatistics');
  if (!cru || !cru.financialData) modulosAusentes.push('financialData');
  if (!cru || !cru.summaryProfile) modulosAusentes.push('summaryProfile');

  // Único monitor automático contra "a brapi mudou a escala numa versão
  // nova": aparece no wrangler tail e no painel de logs.
  if (ind.escalaDuvidosa.length) {
    console.error('[screener] escala ambígua em ' + ticker + ': ' + ind.escalaDuvidosa.join(', ') + ' — indicadores descartados');
  }

  // logourl vira src="" lá no app. Atributo escapado NÃO basta se o esquema
  // for javascript: — por isso só passa https.
  var logo = String((cru && cru.logourl) || '');
  if (logo.slice(0, 8) !== 'https://') logo = null;

  // Nome vem de terceiro e vai pro innerHTML do app depois de escapeHtml():
  // o corte de tamanho aqui é só pra um campo absurdo não virar payload.
  var nome = String((cru && (cru.longName || cru.shortName)) || ticker).slice(0, 120);

  return {
    ok: true,
    ticker: ticker,
    classe: classe,
    setorFinanceiro: financeira,
    nome: nome,
    nomeCurto: cru && cru.shortName ? String(cru.shortName).slice(0, 60) : null,
    moeda: cru && cru.currency ? String(cru.currency).slice(0, 8) : 'BRL',
    logo: logo,
    preco: ind.preco,
    variacaoPercent: _screenerNum(cru && (cru.regularMarketChangePercent !== undefined ? cru.regularMarketChangePercent : cru.changePercent)),
    precoAtualizadoEm: (cru && (cru.regularMarketTime || cru.updatedAt)) || null,
    pvp: ind.pvp,
    proventos12m: ind.proventos12m,
    // Valores já normalizados. A escala vai escrita junto de propósito: sem
    // isso o frontend teria que adivinhar se multiplica por 100 ou não — e
    // adivinhar escala é exatamente o bug que este parser existe pra evitar.
    indicadores: {
      pl: ind.valores.pl,
      dy: ind.valores.dy,
      roe: ind.valores.roe,
      dividaEbitda: ind.valores.dividaEbitda,
      margem: ind.valores.margem,
      escala: 'dy, roe e margem em FRAÇÃO (0.285 = 28,5%); pl e dividaEbitda em número puro'
    },
    // De onde saiu cada número. Quando a nota parecer errada, é por aqui que
    // se descobre o porquê sem precisar reproduzir a chamada.
    origens: ind.origens,
    nota: nota,
    cache: {
      hit: !!cache.hit,
      idadeSegundos: cache.idadeSegundos === null || cache.idadeSegundos === undefined ? 0 : cache.idadeSegundos,
      ttlSegundos: SCREENER_CACHE_TTL_SEG,
      stale: !!cache.stale,
      motivo: cache.motivo || null,
      fonte: cache.hit ? 'cache' : 'brapi'
    },
    diagnostico: {
      modulosAusentes: modulosAusentes,
      escalaDuvidosa: ind.escalaDuvidosa,
      escalaPorLote: ind.escalaPorLote,
      ebitdaNaoPositivo: ind.valores.ebitdaNaoPositivo
    },
    aviso: SCREENER_AVISO,
    natureza: 'dados_publicos_mercado',
    naoERecomendacao: true
  };
}

// GET /api/stocks — a lista inteira de uma vez.
//
// Existe por um motivo de CORREÇÃO, não de desempenho: a escala fração vs
// percentual não tem como ser resolvida com um papel só na mão. Com os 15 na
// mesma resposta, a mediana de cada campo decide a escala sem chute (ver
// _screenerEscalaLote), e aí os indicadores que seriam descartados por
// ambiguidade voltam a valer. De quebra, a tela faz 1 requisição em vez de 15.
//
// Reaproveita o MESMO cache por ticker da rota individual: papel já guardado
// não vira chamada externa aqui.
async function _screenerLote(request, env, ctx) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'método não permitido — use GET' }), {
        status: 405, headers: Object.assign({}, cors, { Allow: 'GET, OPTIONS' })
      });
    }

    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    if (!env.BRAPI_TOKEN) {
      return new Response(JSON.stringify({
        ok: false, configurado: false, skipped: true,
        erro: { tipo: 'nao_configurado', mensagem: 'O screener ainda não está ligado neste ambiente.' },
        motivo: 'BRAPI_TOKEN não configurado — ver o bloco [vars] do wrangler.toml',
        aviso: SCREENER_AVISO, natureza: 'dados_publicos_mercado'
      }), { status: 503, headers: cors });
    }

    var agora = Date.now();

    // ── Passo 1: junta o dado cru de todos os papéis ──
    // Cache primeiro; só quem faltar sai pra rede, e cada saída dessas passa
    // pelo rate limit. Sem Promise.all de 15: um papel que falha não pode
    // derrubar a lista inteira, e serial mantém o teto de concorrência que a
    // brapi (e a cota do plano grátis) aguenta.
    var itens = [];
    var limiteAtingido = false;
    for (var i = 0; i < SCREENER_TICKERS.length; i++) {
      var ticker = SCREENER_TICKERS[i];
      var guardado = await _screenerCacheLe(request, ticker);
      var idade = null;
      if (guardado) {
        var nasceu = Date.parse(guardado.obtidoEm);
        idade = isFinite(nasceu) ? Math.max(0, Math.round((agora - nasceu) / 1000)) : null;
      }
      if (guardado && idade !== null && idade <= SCREENER_CACHE_TTL_SEG) {
        itens.push({ ticker: ticker, cru: guardado.cru, cache: { hit: true, idadeSegundos: idade, stale: false } });
        continue;
      }
      if (limiteAtingido) {
        // Estourou o teto no meio da lista: o resto vem do guardado (mesmo
        // vencido) ou entra como erro. Nunca fura o limite.
        if (guardado) itens.push({ ticker: ticker, cru: guardado.cru, cache: { hit: true, idadeSegundos: idade, stale: true, motivo: 'limite de consultas atingido — mostrando o último dado guardado' } });
        else itens.push({ ticker: ticker, cru: null, erro: { tipo: 'rate_limit', mensagem: 'limite de consultas atingido antes de chegar neste papel' } });
        continue;
      }
      var rl = await _rateLimit(env, 'screener', authUser.id, SCREENER_RL_LIMITE, SCREENER_RL_JANELA_SEG);
      if (!rl.ok) {
        limiteAtingido = true;
        if (guardado) itens.push({ ticker: ticker, cru: guardado.cru, cache: { hit: true, idadeSegundos: idade, stale: true, motivo: 'limite de consultas atingido — mostrando o último dado guardado' } });
        else itens.push({ ticker: ticker, cru: null, erro: { tipo: 'rate_limit', mensagem: 'limite de consultas atingido antes de chegar neste papel' } });
        continue;
      }
      var busca = await _brapiBusca(env, ticker);
      if (!busca.ok) {
        if (guardado) itens.push({ ticker: ticker, cru: guardado.cru, cache: { hit: true, idadeSegundos: idade, stale: true, motivo: 'fonte indisponível agora — mostrando o último dado guardado' } });
        else itens.push({ ticker: ticker, cru: null, erro: { tipo: busca.tipo || 'falha_fonte', mensagem: 'não deu pra buscar este papel agora' } });
        continue;
      }
      _screenerCacheGrava(request, ticker, busca.result, ctx);
      itens.push({ ticker: ticker, cru: busca.result, cache: { hit: false, idadeSegundos: 0, stale: false } });
    }

    // ── Passo 2: com a lista na mão, decide a escala de cada campo ──
    var escalas = _screenerEscalasDoLote(itens.map(function (it) { return it.cru; }));

    // ── Passo 3: pontua todo mundo já com a escala resolvida ──
    var papeis = itens.map(function (it) {
      if (!it.cru) {
        return { ok: false, ticker: it.ticker, erro: it.erro || { tipo: 'sem_dado', mensagem: 'sem dado para este papel' },
                 aviso: SCREENER_AVISO, natureza: 'dados_publicos_mercado' };
      }
      return _screenerPayload(it.ticker, it.cru, it.cache, agora, escalas);
    });

    return new Response(JSON.stringify({
      ok: true,
      total: papeis.length,
      papeis: papeis,
      // Fica na resposta de propósito: se um dia a nota parecer errada em
      // bloco, é aqui que se vê se a escala foi lida errada.
      escalas: escalas,
      aviso: SCREENER_AVISO,
      natureza: 'dados_publicos_mercado',
      naoERecomendacao: true
    }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_screenerLote');
  }
}

// GET /api/stocks/:ticker — credenciais em HEADER, igual às outras rotas
// admin GET (Authorization: Bearer <access_token> + X-Admin-Password).
// Fica restrito à conta master enquanto o screener é experimento: cada
// chamada consome cota da brapi, e liberar pra todo mundo em beta antes de
// saber o custo real é como o teto do log de segurança já ensinou.
async function _screenerAcao(request, env, ctx, tickerBruto) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    // O método é conferido AQUI, e não no if de registro da rota, de
    // propósito: se o if exigisse GET, um POST cairia no 404 de caminho
    // desconhecido lá embaixo — resposta enganosa pra quem chama e, pior,
    // duas escritas no KV por tentativa no log de intrusão.
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'método não permitido — use GET' }), {
        status: 405, headers: Object.assign({}, cors, { Allow: 'GET, OPTIONS' })
      });
    }

    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!_masterPasswordOk(env, creds.password)) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    // Allowlist em dois passos: formato primeiro, pertencimento depois. E
    // daqui pra frente usa o elemento DA LISTA — a URL da brapi só pode ser
    // montada com constante nossa, nunca com a string que veio do cliente.
    var candidato = String(tickerBruto || '').toUpperCase();
    if (!/^[A-Z0-9]{4,6}$/.test(candidato)) {
      return new Response(JSON.stringify({ error: 'ticker inválido' }), { status: 400, headers: cors });
    }
    var idx = SCREENER_TICKERS.indexOf(candidato);
    if (idx === -1) {
      return new Response(JSON.stringify({
        error: 'ticker fora da lista do screener',
        ticker: candidato,
        disponiveis: SCREENER_TICKERS
      }), { status: 400, headers: cors });
    }
    var ticker = SCREENER_TICKERS[idx];

    if (!env.BRAPI_TOKEN) {
      // Mesmo espírito do IG_ACCESS_TOKEN: sem a secret o recurso não tenta
      // nada e diz claramente o que falta, em vez de estourar. 503 (e não
      // 200) porque o app precisa distinguir "não configurado" de "papel sem
      // dado" — é o mesmo status que a rota /ai usa pra ANTHROPIC_API_KEY.
      return new Response(JSON.stringify({
        ok: false, configurado: false, skipped: true, ticker: ticker,
        erro: { tipo: 'nao_configurado', mensagem: 'O screener ainda não está ligado neste ambiente.' },
        motivo: 'BRAPI_TOKEN não configurado — ver o bloco [vars] do wrangler.toml',
        aviso: SCREENER_AVISO, natureza: 'dados_publicos_mercado'
      }), { status: 503, headers: cors });
    }

    var agora = Date.now();
    var guardado = await _screenerCacheLe(request, ticker);
    var idade = null;
    if (guardado) {
      var nasceu = Date.parse(guardado.obtidoEm);
      idade = isFinite(nasceu) ? Math.max(0, Math.round((agora - nasceu) / 1000)) : null;
    }
    if (guardado && idade !== null && idade <= SCREENER_CACHE_TTL_SEG) {
      return _screenerResposta(cors, ticker, guardado.cru, { hit: true, idadeSegundos: idade, stale: false }, agora);
    }

    // Rate limit SÓ antes de sair pra rede. O que precisa de teto é a chamada
    // externa (cota da brapi, latência, tempo de CPU), não a leitura do
    // cache — e contar cache hit custaria uma escrita no KV POR REQUISIÇÃO,
    // justamente o recurso que este projeto economiza. Com isso, uma tela que
    // carrega a lista inteira fria cabe na janela, e um refresh em loop bate
    // no teto sem gerar 30 chamadas externas a cada vez.
    var rl = await _rateLimit(env, 'screener', authUser.id, SCREENER_RL_LIMITE, SCREENER_RL_JANELA_SEG);
    if (!rl.ok) {
      // Com registro vencido na mão, servir o velho com a idade estampada é
      // melhor que devolver 429 seco e deixar a tela vazia.
      if (guardado) return _screenerResposta(cors, ticker, guardado.cru, { hit: true, idadeSegundos: idade, stale: true, motivo: 'limite de consultas atingido — mostrando o último dado guardado' }, agora);
      return _tooManyRequests(cors, rl.retryAfter, 'muitas consultas de mercado seguidas, espere um pouco');
    }

    var busca = await _brapiBusca(env, ticker);
    if (!busca.ok) {
      // Stale-while-error: 429/5xx/timeout do fornecedor não precisa virar
      // tela vazia se existe dado guardado, mesmo vencido.
      if (guardado) return _screenerResposta(cors, ticker, guardado.cru, { hit: true, idadeSegundos: idade, stale: true, motivo: 'fonte indisponível agora — mostrando o último dado guardado' }, agora);
      return _screenerErro(cors, ticker, busca);
    }

    _screenerCacheGrava(request, ticker, busca.result, ctx);
    return _screenerResposta(cors, ticker, busca.result, { hit: false, idadeSegundos: 0, stale: false }, agora);
  } catch (e) {
    return _serverError(cors, e, '_screenerAcao');
  }
}
`;

const worker = `${pluggyFns}
${pushFns}
${billingFns}
// Estrutura de planos já está pronta, mas a cobrança só começa mês que
// vem — enquanto isso, ninguém é bloqueado. Vira true quando for a hora.
var PREMIUM_ENFORCEMENT_ENABLED = false;

// ═══════════════════════════════════════════════════════════════════════════
//  DETECÇÃO DE INTRUSÃO
// ═══════════════════════════════════════════════════════════════════════════
// Isto é ALARME, não tranca. Quem impede o acesso é a autorização de cada
// rota; isto aqui só registra quem está tentando, pra dar visibilidade.
//
// Duas fontes de sinal:
//  1. ISCAS — caminhos que nenhum cliente legítimo do Finn chama nunca. Robô
//     de varredura pede /.env e /wp-login.php o tempo todo; e HONEY_PATH é um
//     endpoint falso plantado no HTML, então quem bate nele necessariamente
//     leu o código-fonte e resolveu testar. Zero falso positivo por definição.
//  2. EVENTOS REAIS — falha de senha de admin, estouro de rate limit, token
//     inválido em rota autenticada.
//
// LGPD: IP é dado pessoal. Guardamos só os dois primeiros octetos (13.75.x.x)
// pra dar noção de origem, mais um hash com sal pra conseguir contar "quantas
// tentativas do mesmo lugar" sem armazenar o endereço inteiro. Retenção de 30
// dias, automática via TTL do KV.
var SEC_LOG_TTL = 60 * 60 * 24 * 30;

// Endpoint-isca. Ele aparece no HTML do app como LEGACY_EXPORT_ENDPOINT, com
// cara de rota antiga de exportação — e nenhuma linha do Finn o chama. Quem
// bater aqui necessariamente abriu o código-fonte da página e resolveu testar.
//
// Limite conhecido: este repositório é público, então quem ler o build.js no
// GitHub descobre que é armadilha. Pega o curioso que dá "ver código-fonte" no
// site, não quem audita o repositório — e é justamente o primeiro grupo que a
// gente quer enxergar.
var HONEY_PATH = '/admin/v1/export-all';

// Caminhos que scanner automatizado tenta em qualquer site do mundo.
var SCANNER_PATHS = [
  '/.env', '/.env.local', '/.git/config', '/.git/HEAD',
  '/wp-login.php', '/wp-admin', '/xmlrpc.php', '/wordpress',
  '/phpmyadmin', '/pma', '/adminer.php',
  '/config.json', '/credentials', '/backup.sql', '/dump.sql',
  '/.aws/credentials', '/.ssh/id_rsa', '/server-status',
  '/actuator/env', '/api/v1/secrets', '/vendor/phpunit'
];

async function _anonIp(request, env) {
  var ip = request.headers.get('CF-Connecting-IP') || '';
  var partes = ip.split('.');
  var truncado = partes.length === 4 ? (partes[0] + '.' + partes[1] + '.x.x') : (ip ? 'ipv6' : 'desconhecido');
  // Hash com sal pra correlacionar tentativas sem guardar o IP: sem o sal
  // (secret do Worker), a lista de IPs possíveis é pequena o bastante pra
  // alguém reverter o hash por força bruta.
  var sal = (env && env.SEC_LOG_SALT) || 'finn-sal-padrao';
  var digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(sal + '|' + ip));
  var hex = [...new Uint8Array(digest)].map(function(b){ return b.toString(16).padStart(2, '0'); }).join('');
  return { regiao: truncado, id: hex.slice(0, 12) };
}

// Teto de registros detalhados por dia. Existe porque o próprio registro
// escreve no KV: sem teto, quem descobrisse uma isca (o repositório é
// público) esvaziaria a cota diária de escrita só pedindo /.env em loop — e
// aí quebrariam as inscrições de push, o índice do Instagram e o controle de
// limite, que gravam no mesmo KV. Passado o teto, o contador do dia continua
// subindo (o painel mostra o volume real), só o detalhe é que para.
var SEC_LOG_MAX_DIA = 500;

async function _securityLog(env, request, kind, detalhe) {
  if (!env.FINN_KV) return;
  try {
    var url = new URL(request.url);
    var diaAtual = new Date().toISOString().slice(0, 10);
    var chaveContador = 'seccount_' + diaAtual;
    var jaHoje = parseInt((await env.FINN_KV.get(chaveContador)) || '0', 10) || 0;

    // Acima do teto, grava só o contador; e bem acima, para de gravar de vez,
    // pra uma enxurrada não conseguir consumir escrita nenhuma.
    if (jaHoje >= SEC_LOG_MAX_DIA) {
      if (jaHoje < SEC_LOG_MAX_DIA * 10) {
        await env.FINN_KV.put(chaveContador, String(jaHoje + 1), { expirationTtl: SEC_LOG_TTL });
      }
      return;
    }

    var origem = await _anonIp(request, env);
    var registro = {
      at: new Date().toISOString(),
      kind: kind,
      path: url.pathname.slice(0, 120),
      method: request.method,
      ipRegiao: origem.regiao,
      ipId: origem.id,
      ua: (request.headers.get('User-Agent') || '').slice(0, 160),
      pais: request.headers.get('CF-IPCountry') || '?',
      ref: (request.headers.get('Referer') || '').slice(0, 120),
      detalhe: detalhe ? String(detalhe).slice(0, 160) : undefined
    };
    // Chave com timestamp na frente pra listar em ordem sem precisar ordenar
    // o conteúdo depois.
    var chave = 'seclog_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    await env.FINN_KV.put(chave, JSON.stringify(registro), { expirationTtl: SEC_LOG_TTL });

    // Contador por dia — é o que o painel usa pra detectar pico sem varrer
    // todas as chaves. Reaproveita a leitura feita lá em cima pro teto, em
    // vez de ler de novo.
    await env.FINN_KV.put(chaveContador, String(jaHoje + 1), { expirationTtl: SEC_LOG_TTL });
  } catch (e) {
    // Registrar nunca pode derrubar a requisição.
    console.error('[securityLog]', e && e.message);
  }
}

// Resposta das iscas: 404 comum, igualzinho ao de um caminho inexistente.
// Nada de "acesso negado" nem página de bloqueio — se o atacante perceber que
// foi detectado, ele muda de técnica e a isca perde o valor.
function _honeyResponse() {
  return new Response('Not Found', {
    status: 404,
    headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8' }, SECURITY_HEADERS)
  });
}

function _isScannerPath(pathname) {
  var p = pathname.toLowerCase().replace(/\\/+$/, '');
  if (SCANNER_PATHS.indexOf(p) !== -1) return true;
  // Extensões que este site nunca serve — sinal claro de varredura.
  return /\\.(php|asp|aspx|jsp|cgi|env|sql|bak|old|swp)$/.test(p);
}

// Headers de segurança do HTML — o worker não mandava nenhum, então não havia
// nada contendo um XSS caso algum dia apareça (o app guarda access_token E
// refresh_token do Supabase no localStorage, ou seja, um XSS = conta tomada
// de forma permanente).
//
// O 'unsafe-inline' em script-src é inevitável hoje: o app inteiro é um
// <script> inline dentro do HTML. Mesmo assim a CSP entrega o que mais
// importa aqui: connect-src fecha pra onde dá pra MANDAR dados (bloqueia a
// exfiltração do token pra um servidor do atacante), script-src vira uma
// allowlist de origem (um &lt;script src&gt; injetado pra outro domínio não roda),
// object-src/base-uri fecham dois desvios clássicos, e frame-ancestors impede
// clickjacking.
var CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://zblkznobqcztvznycyyo.supabase.co https://*.workers.dev https://cdn.jsdelivr.net",
  "worker-src 'self' blob: https://cdn.jsdelivr.net",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

var SECURITY_HEADERS = {
  'Content-Security-Policy': CSP,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export default {
  async fetch(request, env, ctx) {
    var url = new URL(request.url);

    // ── Iscas: antes de qualquer rota real ──
    // Responde 404 comum (ver _honeyResponse) e registra em segundo plano.
    // waitUntil pra não somar latência à resposta — e pra não dar ao atacante
    // um tempo de resposta diferente do 404 normal, que denunciaria a isca.
    if (url.pathname === HONEY_PATH || url.pathname.indexOf(HONEY_PATH + '/') === 0) {
      ctx.waitUntil(_securityLog(env, request, 'isca_honeytoken', 'endpoint falso plantado no HTML'));
      return _honeyResponse();
    }
    if (_isScannerPath(url.pathname)) {
      ctx.waitUntil(_securityLog(env, request, 'isca_scanner', url.pathname));
      return _honeyResponse();
    }

    // ── CORS preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password',
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

<h2><span class="num">06</span> Registros de segurança</h2>
<p>Para proteger as contas, registramos tentativas de acesso suspeitas — como varredura automatizada por endereços que não existem no site, ou repetidas senhas incorretas na área administrativa. Guardamos o horário, o caminho acessado, o navegador informado, o país e uma <strong>versão parcial do endereço de IP</strong> (por exemplo <em>189.45.x.x</em>), nunca o endereço completo.</p>
<p>Esses registros existem apenas para detectar abuso, não são usados para perfilar pessoas nem cruzados com sua conta, e são <strong>apagados automaticamente após 30 dias</strong>.</p>

<h2><span class="num">07</span> Seus direitos</h2>
<div class="notice"><strong>Você está no controle.</strong><br>Pode solicitar a exclusão de todos os seus dados a qualquer momento em <a href="/deletar-dados">finn.dev.br/deletar-dados</a> — sem perguntas, sem retenção.</div>

<h2><span class="num">08</span> Contato</h2>
<p>Dúvidas sobre privacidade? Escreva para <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a> e respondemos em até 48h.</p>
</article>\`;
      return new Response(legalShell('privacidade', 'Política de Privacidade', 'Documento legal', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
      return new Response(legalShell('termos', 'Termos de Serviço', 'Documento legal', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    if (url.pathname === '/deletar-dados') {
      const body = \`<article class="card">
<h2 style="margin-top:0">Como excluir seus dados</h2>
<p style="margin-bottom:22px">Você pode excluir <strong>todos os seus dados</strong> do Finn a qualquer momento, sem precisar de aprovação ou justificativa.</p>

<div class="opt">
  <div class="opt-ic" style="color:#fff;font-weight:800">1</div>
  <div><div class="opt-t">Opção 1 — Pelo app (recomendado)</div>
  <div class="opt-d">Abra o Finn → Menu → Configurações → Dados → <strong>"Excluir todos os dados"</strong>. A exclusão é imediata.</div></div>
</div>

<div class="opt">
  <div class="opt-ic" style="color:#fff;font-weight:800">2</div>
  <div><div class="opt-t">Opção 2 — Por e-mail</div>
  <div class="opt-d">Envie um e-mail para <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a> com o assunto <strong>"Exclusão de dados"</strong> e seu e-mail cadastrado. Excluiremos tudo em até 7 dias úteis.</div></div>
</div>

<div class="warn">Ao excluir, <strong>todas as suas transações, metas, limites e configurações</strong> serão permanentemente removidos. Esta ação é irreversível.</div>
</article>\`;
      return new Response(legalShell('deletar-dados', 'Excluir meus dados', 'Direito do titular', body), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
        // Teto diário POR CONTA, além do limite por IP. Enquanto
        // PREMIUM_ENFORCEMENT_ENABLED for false, todo mundo entra como 'pro' e
        // a cota mensal do Plus não vale — então o único freio era 20/min por
        // IP, que um script contorna sozinho trocando de rede ou só sendo
        // paciente (28 mil chamadas/dia na nossa conta da Anthropic).
        // Este teto é por usuário autenticado, então trocar de IP não ajuda:
        // pra multiplicar o gasto o atacante precisa criar conta atrás de conta.
        var AI_DAILY_PER_USER = 60;
        if (env.FINN_KV && !_isMasterUser(aiUser)) {
          var aiDia = new Date().toISOString().slice(0, 10);
          var aiUserKey = 'ai_day_' + aiUser.id + '_' + aiDia;
          var aiUserCount = parseInt((await env.FINN_KV.get(aiUserKey)) || '0', 10) || 0;
          if (aiUserCount >= AI_DAILY_PER_USER) {
            await _securityLog(env, request, 'ai_teto_diario', 'conta atingiu ' + AI_DAILY_PER_USER + ' chamadas no dia');
            return new Response(JSON.stringify({ error: { type: 'rate_limited', message: 'Você atingiu o limite de análises de hoje. Tenta de novo amanhã.' } }), {
              status: 429, headers: { 'Content-Type': 'application/json' }
            });
          }
          await env.FINN_KV.put(aiUserKey, String(aiUserCount + 1), { expirationTtl: 172800 });
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

    // ── Screener de ações (dados públicos de mercado) — só a conta master ──
    // Casa por regex porque o ticker vem no caminho. Duas coisas de propósito:
    //  1. o método NÃO é conferido aqui — se fosse, um POST não daria 405, ele
    //     cairia no 404 de caminho desconhecido lá embaixo e ainda geraria
    //     evento no log de intrusão (2 escritas no KV por tentativa). Quem
    //     responde 405 é o próprio _screenerAcao;
    //  2. este if PRECISA continuar acima do 404 de caminho desconhecido —
    //     registrado depois dele, a rota simplesmente nunca é alcançada.
    if (url.pathname === '/api/stocks') {
      return _screenerLote(request, env, ctx);
    }
    var screenerMatch = url.pathname.match(/^\\/api\\/stocks\\/([A-Za-z0-9]{4,6})$/);
    if (screenerMatch) {
      return _screenerAcao(request, env, ctx, screenerMatch[1]);
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

    // ── Capas dos Reels (link direto pra baixar do navegador do celular) ──
    var reelCoverMatch = url.pathname.match(/^\\/social\\/reel(\\d+)-cover\\.jpg$/);
    if (reelCoverMatch) {
      var reelCoverArr = [${JSON.stringify(reel1Cover)}, ${JSON.stringify(reel2Cover)}, ${JSON.stringify(reel3Cover)}];
      var reelCoverB64 = reelCoverArr[Number(reelCoverMatch[1]) - 1];
      if (reelCoverB64) {
        var reelCoverBytes = Uint8Array.from(atob(reelCoverB64), function(c){ return c.charCodeAt(0); });
        return new Response(reelCoverBytes, {
          headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' }
        });
      }
    }

    // ── Posts do Instagram (URL pública fixa — a Graph API busca a imagem
    // por essa URL, não aceita upload direto) ──
    var socialMatch = url.pathname.match(/^\\/social\\/post-(\\d+)\\.png$/);
    if (socialMatch) {
      var socialArr = ${JSON.stringify(socialPosts)};
      var socialB64 = socialArr[Number(socialMatch[1]) - 1];
      if (socialB64) {
        var socialBytes = Uint8Array.from(atob(socialB64), function(c){ return c.charCodeAt(0); });
        return new Response(socialBytes, {
          headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' }
        });
      }
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
    if (url.pathname === '/beta/confirm' && request.method === 'GET') {
      return _betaConfirm(request, env);
    }
    if (url.pathname === '/admin/beta-signups' && request.method === 'GET') {
      return _adminBetaSignups(request, env);
    }
    if (url.pathname === '/admin/intrusions' && request.method === 'GET') {
      return _adminIntrusions(request, env);
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

    // ── Caminho desconhecido: 404, não o app ──
    // Até aqui, qualquer rota que não casou com nenhuma das de cima caía no
    // app e recebia 200 com os ~276 KB do HTML inteiro. Duas consequências
    // ruins, as duas vistas na prática num scanner que varreu o site:
    //   1. custo — uma varredura de mil caminhos servia ~276 MB à toa;
    //   2. cegueira — só os caminhos da SCANNER_PATHS entravam no painel, e
    //      um /config/database.yml ou /.svn/entries passava sem registro.
    // O app não usa rota por caminho (a navegação é por state.tab, e o
    // replaceState do login só tira a query preservando o pathname), então
    // '/' e '/index.html' são as únicas entradas legítimas do HTML.
    if (url.pathname !== '/' && url.pathname !== '/index.html') {
      ctx.waitUntil(_securityLog(env, request, 'caminho_desconhecido', url.pathname));
      return _honeyResponse();
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
      headers: Object.assign({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'ETag': ETAG,
        'X-Finn-Version': '2.1.0',
      }, SECURITY_HEADERS),
    });
  },

  async scheduled(event, env, ctx) {
    if (event.cron === '0 13 2 8 *') {
      // Post único agendado para 02/08 às 10:00 BRT (13:00 UTC — o Brasil não
      // tem mais horário de verão desde 2019, então é sempre UTC-3).
      //
      // O cron da Cloudflare é sempre recorrente: este dispararia de novo todo
      // 2 de agosto. O guard de ano deixa ele valer só em 2026, e o guard de
      // KV impede publicar duas vezes se a Cloudflare reexecutar o evento.
      ctx.waitUntil((async () => {
        if (new Date().getUTCFullYear() !== 2026) return;
        if (env.FINN_KV) {
          var jaFoi = await env.FINN_KV.get('ig_agendado_2026-08-02');
          if (jaFoi) return;
          await env.FINN_KV.put('ig_agendado_2026-08-02', new Date().toISOString(), { expirationTtl: 60 * 60 * 24 * 90 });
        }
        await _publishNextInstagramPost(env);
      })());
    } else if (event.cron === '0 23 * * 1') {
      ctx.waitUntil(sendWeeklySummary(env));
    } else {
      // "0 12 * * *" (09:00 BRT). A publicação automática no Instagram saiu
      // daqui: 230 visualizações em 30 dias, quase todo post abaixo de 12 — o
      // alcance orgânico não pagava o custo de manter a automação rodando, e o
      // plano virou anúncio pago. Os crons das 15:00 e 21:00 UTC existiam SÓ
      // pros posts, então foram removidos do wrangler.toml (o limite de 5 cron
      // triggers é da conta inteira, então isso devolveu 2 slots — 1 deles foi
      // reusado pelo agendamento pontual de 02/08 no primeiro if daqui).
      //
      // Nada foi apagado: _publishNextInstagramPost continua no código e a rota
      // /admin/instagram-publish-next segue funcionando pra publicar na mão.
      // Pra religar o automático, recoloque os 2 crons no wrangler.toml e o
      // ctx.waitUntil(_publishNextInstagramPost(env)) aqui.
      ctx.waitUntil(checkFixedDueAndNotify(env));
      ctx.waitUntil(checkExpiredSubscriptions(env));
    }
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB) | ETag: ' + etag);

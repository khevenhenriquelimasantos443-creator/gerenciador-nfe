// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const COPY   = require('../finn-social/copy.cjs');

const html      = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing   = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw        = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');
const pitchInv  = fs.readFileSync(path.join(__dirname,'../finn/pitch-investidores.html'), 'utf8');
const pitchUsr  = fs.readFileSync(path.join(__dirname,'../finn/pitch-usuarios.html'), 'utf8');
const guia      = fs.readFileSync(path.join(__dirname,'../finn/guia.html'), 'utf8');
// A planilha entra embutida (53 KB) pra ser entregue por download direto a
// quem comprou. Não vai pra um bucket público de propósito: é produto pago,
// e link público de bucket é link que vaza.
const planilhaXlsx = fs.readFileSync(path.join(__dirname,'../finn-planilha/Planilha-Finn-v1.xlsx')).toString('base64');
const beta      = fs.readFileSync(path.join(__dirname,'../finn/beta.html'), 'utf8');
const betaQuestionario = fs.readFileSync(path.join(__dirname,'../finn/beta-questionario.html'), 'utf8');

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
      // Detalhe de configuracao vai pro log, nao pra resposta: dizer ao
      // cliente QUAL secret esta faltando entrega topologia do servidor a
      // qualquer usuario logado, sem beneficio pra ele.
      console.error('[pluggy/token] secrets ausentes:', 'CLIENT_ID=' + (env.PLUGGY_CLIENT_ID ? 'ok' : 'MISSING'), 'CLIENT_SECRET=' + (env.PLUGGY_CLIENT_SECRET ? 'ok' : 'MISSING'));
      return new Response(JSON.stringify({ error: 'integração bancária indisponível no momento' }), { status: 503, headers: cors });
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
    // Token no HEADER, nao na query string. O JWT do Supabase e a credencial
    // completa da conta (da acesso a todos os dados financeiros via RLS), e
    // query string vai parar no log de acesso da Cloudflare, no historico do
    // navegador e no Referer. As rotas admin GET ja tinham sido migradas por
    // esse motivo; esta ficou pra tras.
    //
    // A query e aceita como fallback pra nao quebrar chamada antiga em
    // circulacao, mas o app nao usa nenhuma das rotas Pluggy hoje (nao ha
    // cliente no repositorio), entao na pratica so o header e exercitado.
    var pluggyAuthHeader = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    var authUser = await _supaAuth(pluggyAuthHeader || url.searchParams.get('access_token'));
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

// A Planilha Finn é COMPRA ÚNICA, não assinatura. O motivo é prático: quem
// compra faz uma cópia do Google Sheets, e essa cópia é dela pra sempre —
// não há como revogar. Cobrar mensalidade por um arquivo que o cliente já
// tem seria vender algo que não dá pra tirar de volta.
//
// O que continua sendo assinatura é a SINCRONIZAÇÃO, que faz parte do Pro.
var PRECO_PLANILHA = 36.90;

// A sincronização é exclusiva do Pro. A compra única dá o arquivo, não o sync.
function _planoTemSync(plan) {
  return plan === 'pro';
}

// O plano que o webhook grava vem do external_reference que nós mesmos
// montamos, e a assinatura do Mercado Pago é conferida antes — então não é
// brecha. Ainda assim, validar impede que uma referência malformada escreva
// uma string qualquer na coluna de plano e deixe a conta num estado que
// nenhuma checagem reconhece.
var PLANOS_VALIDOS = ['free', 'plus', 'pro'];
function _planoValido(plan) {
  return PLANOS_VALIDOS.indexOf(plan) !== -1;
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
    // Mensagem do fornecedor fica no log, nao na resposta: o texto de erro do
    // Mercado Pago traz formato interno e nome de campo deles, e nao ajuda em
    // nada quem esta na tela de assinatura.
    if (!r.ok) {
      console.error('[billing/checkout] MP', r.status, (j && j.message) || '');
      return new Response(JSON.stringify({ error: 'Falha ao criar assinatura' }), { status: 502, headers: cors });
    }
    return new Response(JSON.stringify({ url: j.init_point }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_billingCheckout');
  }
}

// POST /billing/comprar-planilha — pagamento ÚNICO da Planilha Finn.
// Usa /checkout/preferences (pagamento avulso), não /preapproval (assinatura).
async function _comprarPlanilha(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.MP_ACCESS_TOKEN) return new Response(JSON.stringify({ error: 'Pagamentos ainda não configurados' }), { status: 500, headers: cors });
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

    // Já comprou: não deixa pagar de novo por engano.
    if (await _jaComprouPlanilha(authUser.id, env)) {
      return new Response(JSON.stringify({ error: 'Você já tem a Planilha Finn.' }), { status: 409, headers: cors });
    }

    var origin = new URL(request.url).origin;
    var r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + env.MP_ACCESS_TOKEN },
      body: JSON.stringify({
        items: [{
          title: 'Planilha Finn — controle financeiro no Google Sheets',
          quantity: 1, currency_id: 'BRL', unit_price: PRECO_PLANILHA
        }],
        // O sufixo distingue compra única de assinatura no webhook, que
        // atende os dois pelo mesmo tópico 'payment'.
        external_reference: authUser.id + '|planilha_unica',
        payer: { email: authUser.email },
        back_urls: { success: origin + '/?compra=planilha', pending: origin + '/?compra=pendente', failure: origin + '/?compra=falhou' },
        auto_return: 'approved'
      })
    });
    var j = await r.json();
    if (!r.ok) {
      console.error('[billing/comprar-planilha] MP', r.status, (j && j.message) || '');
      return new Response(JSON.stringify({ error: 'Não consegui abrir o pagamento agora.' }), { status: 502, headers: cors });
    }
    return new Response(JSON.stringify({ ok: true, url: j.init_point || j.sandbox_init_point }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_comprarPlanilha');
  }
}

async function _jaComprouPlanilha(userId, env) {
  if (!env.SUPABASE_SERVICE_KEY) return false;
  try {
    var r = await fetch('${SUPA_URL_SERVER}/rest/v1/spreadsheet_purchases?user_id=eq.' + userId + '&select=user_id', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    if (!r.ok) return false;
    var linhas = await r.json();
    return Array.isArray(linhas) && linhas.length > 0;
  } catch (e) { return false; }
}

// GET /planilha/baixar?access_token=... — entrega o arquivo a quem comprou.
//
// Gate no servidor porque esta rota É o produto: sem ele, qualquer pessoa
// baixa de graça o que outra pagou. E o token vai na querystring, não em
// header, porque isto é um download aberto pelo navegador — <a href> não
// manda header.
async function _baixarPlanilha(request, env) {
  var url = new URL(request.url);
  var authUser = await _supaAuth(url.searchParams.get('access_token'));
  if (!authUser) return new Response('Não autorizado', { status: 401 });

  var comprou = await _jaComprouPlanilha(authUser.id, env);
  if (!comprou && PREMIUM_ENFORCEMENT_ENABLED) {
    var sub = await _subaGetSubscription(authUser.id, env);
    if (!_planoTemSync((sub && sub.plan) || 'free')) {
      return new Response('A Planilha Finn é um produto à parte. Compre nas Configurações do app.', { status: 402 });
    }
  }

  var bytes = Uint8Array.from(atob(${JSON.stringify(planilhaXlsx)}), function (c) { return c.charCodeAt(0); });
  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="Planilha-Finn.xlsx"',
      // Produto pago: nunca em cache compartilhado.
      'Cache-Control': 'private, no-store'
    }
  });
}

// O link de cópia da planilha pode vir de dois lugares: o painel de admin
// (gravado no KV) ou a secret PLANILHA_COPY_URL. O KV ganha, e é de propósito:
// trocar a planilha-mestre pelo celular, sem terminal e sem redeploy, é o
// caminho que de fato vai ser usado. A secret continua valendo como fallback
// pra não quebrar nada que já esteja configurado.
async function _planilhaCopyUrl(env) {
  if (env.FINN_KV) {
    try {
      var salvo = await env.FINN_KV.get('planilha_copy_url');
      if (salvo) return salvo;
    } catch (e) { /* KV fora do ar não pode derrubar a entrega — cai na secret */ }
  }
  return env.PLANILHA_COPY_URL || null;
}

// Aceita QUALQUER forma do link do Google Sheets e devolve sempre a forma
// /copy. Existe porque o link que o celular copia no "Compartilhar" termina em
// /edit?usp=drivesdk, e quem entrega esse link pro comprador dá acesso de
// leitura à planilha-mestre em vez de uma cópia — o erro silencioso mais caro
// possível aqui. Em vez de pedir pra editar a URL na mão, o servidor edita.
function _normalizaLinkCopia(bruto) {
  var texto = String(bruto == null ? '' : bruto).trim();
  if (!texto) return { erro: 'Cole o link da planilha.' };
  var m = texto.match(/^https:\\/\\/docs\\.google\\.com\\/spreadsheets\\/d\\/([a-zA-Z0-9_-]{20,})/);
  if (!m) {
    return { erro: 'Isso não parece o link de uma planilha do Google Sheets. O certo começa com https://docs.google.com/spreadsheets/d/ — abra a planilha, toque em Compartilhar, "Copiar link", e cole aqui do jeito que vier.' };
  }
  return { url: 'https://docs.google.com/spreadsheets/d/' + m[1] + '/copy' };
}

// GET/POST /admin/planilha-link — lê e grava o link de cópia sem terminal.
//
// A alternativa era "wrangler secret put PLANILHA_COPY_URL": exige notebook,
// acertar o nome da secret e um redeploy. Aqui é colar e salvar, com o
// servidor consertando o formato do link.
async function _adminPlanilhaLink(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    if (request.method === 'POST') {
      if (!env.FINN_KV) return new Response(JSON.stringify({ error: 'KV não está configurado neste ambiente' }), { status: 500, headers: cors });
      var corpo;
      try { corpo = await request.json(); } catch (e) { return new Response(JSON.stringify({ error: 'corpo invalido' }), { status: 400, headers: cors }); }
      var bruto = corpo && corpo.url;
      // Campo vazio = "apaga o que eu salvei", não "salva vazio". Sem isso não
      // haveria como desfazer um link errado pelo painel.
      if (!String(bruto == null ? '' : bruto).trim()) {
        await env.FINN_KV.delete('planilha_copy_url');
        var apósApagar = await _planilhaCopyUrl(env);
        return new Response(JSON.stringify({
          ok: true, url: apósApagar, origem: apósApagar ? 'secret' : null,
          aviso: apósApagar ? 'Link do painel apagado. Voltou a valer o da secret PLANILHA_COPY_URL.' : 'Link apagado. O botão "Abrir no Google Sheets" some do app; o download do .xlsx continua.'
        }), { status: 200, headers: cors });
      }
      var norm = _normalizaLinkCopia(bruto);
      if (norm.erro) return new Response(JSON.stringify({ error: norm.erro }), { status: 400, headers: cors });
      await env.FINN_KV.put('planilha_copy_url', norm.url);
      return new Response(JSON.stringify({
        ok: true, url: norm.url, origem: 'painel',
        aviso: 'Salvo. Confira agora se a planilha está compartilhada como "Qualquer pessoa com o link → Leitor" — sem isso o comprador abre o link e leva "acesso negado".'
      }), { status: 200, headers: cors });
    }

    var atual = await _planilhaCopyUrl(env);
    var doPainel = null;
    if (env.FINN_KV) { try { doPainel = await env.FINN_KV.get('planilha_copy_url'); } catch (e) {} }
    return new Response(JSON.stringify({
      ok: true, url: atual,
      origem: doPainel ? 'painel' : (env.PLANILHA_COPY_URL ? 'secret' : null)
    }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminPlanilhaLink');
  }
}

// GET /billing/planilha-status — a tela precisa saber se já comprou.
async function _statusPlanilha(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var url = new URL(request.url);
    var authUser = await _supaAuth(url.searchParams.get('access_token'));
    if (!authUser) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    var comprou = await _jaComprouPlanilha(authUser.id, env);
    var sub = await _subaGetSubscription(authUser.id, env);
    var plano = (sub && sub.plan) || 'free';
    return new Response(JSON.stringify({
      ok: true, comprou: comprou, preco: PRECO_PLANILHA,
      // Durante o beta o sync fica liberado, igual ao resto.
      sync: !PREMIUM_ENFORCEMENT_ENABLED || _planoTemSync(plano),
      // Link de cópia do Google Sheets (termina em /copy). É o caminho bom:
      // um clique e a pessoa já tem a planilha ONLINE na conta dela, com o
      // script de sincronização junto. Só aparece pra quem comprou.
      copia: (comprou || !PREMIUM_ENFORCEMENT_ENABLED || _planoTemSync(plano)) ? (await _planilhaCopyUrl(env)) : null
    }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_statusPlanilha');
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
        // Compra única da planilha: grava a compra, não mexe em assinatura.
        if (userId && plan === 'planilha_unica' && payment.status === 'approved') {
          await fetch('${SUPA_URL_SERVER}/rest/v1/spreadsheet_purchases?on_conflict=user_id', {
            method: 'POST',
            headers: {
              apikey: env.SUPABASE_SERVICE_KEY,
              Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
              user_id: userId, mp_payment_id: String(payment.id),
              amount: payment.transaction_amount || PRECO_PLANILHA
            })
          });
        } else if (userId && _planoValido(plan) && payment.status === 'approved') {
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
        if (suserId && _planoValido(splan)) {
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

// Trava de forca bruta pra senha de admin em TODAS as rotas, nao so em
// /admin/login. Antes, so o /admin/login contava tentativa: quem tivesse um
// JWT da master (o modelo de ameaca declarado neste arquivo - o token vive no
// localStorage do navegador) podia varrer a senha a vontade contra
// /admin/subscriptions, /admin/analytics e companhia, sem teto nenhum e sem
// gerar UM evento no painel de intrusoes. O cabecalho do bloco de deteccao
// promete registrar "falha de senha de admin"; fora do /admin/login isso nao
// estava acontecendo.
//
// Conta so ERRO, nunca acerto. O painel de admin dispara varias rotas por
// carregamento, entao um teto por requisicao bem-sucedida trancaria o dono do
// app pra fora do proprio painel.
var ADMIN_PW_MAX_ERROS = 10;
var ADMIN_PW_JANELA_SEG = 900;

async function _masterPasswordGate(request, env, password) {
  var chave = 'adminpw_' + _clientIp(request);
  var erros = 0;
  if (env.FINN_KV) {
    erros = parseInt((await env.FINN_KV.get(chave)) || '0', 10) || 0;
    // Estourou o teto: recusa mesmo que a senha esteja certa, ate a janela
    // expirar. Quem e dono de verdade espera 15 minutos; quem esta varrendo
    // perde o canal.
    if (erros >= ADMIN_PW_MAX_ERROS) return false;
  }
  if (_masterPasswordOk(env, password)) return true;
  if (env.FINN_KV) {
    await env.FINN_KV.put(chave, String(erros + 1), { expirationTtl: ADMIN_PW_JANELA_SEG });
  }
  await _securityLog(env, request, 'senha_admin_incorreta', 'rota admin');
  return false;
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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
    if (!(await _masterPasswordGate(request, env, body.admin_password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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

// ── Conquistas: quem desbloqueou o quê ──────────────────────────────────────
// Ponto importante de privacidade: NADA disto é rastreamento novo. As
// conquistas no app são calculadas na hora, no navegador, e não gravam nada
// em lugar nenhum. Aqui elas são RECALCULADAS no servidor a partir de dados
// que o usuário já sincroniza de qualquer forma (lançamentos, metas,
// limites, rachas, e o metadata que diz se ele ligou o bot). Ou seja: dá pra
// saber quantas pessoas desbloquearam cada selo sem instalar telemetria,
// sem pedir consentimento novo e sem guardar um byte a mais.
//
// A única que NÃO dá pra derivar é "Mãos de tesoura" (contador de exclusões
// que vive só no localStorage do aparelho) — ela é devolvida com
// derivavel:false em vez de um número inventado.
//
// A lógica abaixo espelha CONQUISTAS_DEFS do finn/index.html de propósito.
// Se as regras mudarem lá, mudam aqui — senão o painel mostra um número
// diferente do que o usuário vê na tela dele.
//
// UMA divergência conhecida e proposital: o app exclui do "Mês no azul" as
// movimentações de investimento (BB Rende Fácil, Tesouro etc.), e pra isso
// ele lê a DESCRIÇÃO de cada lançamento. Aqui não lemos descrição — puxar o
// texto livre de tudo que todo mundo comprou, só pra refinar uma estatística
// agregada, é dado pessoal demais pra pouco ganho. Efeito prático: pra quem
// tem varredura automática de saldo importada do banco, o "Mês no azul"
// pode contar um mês que o app dele não contaria. Some no painel.

// Mesma regra do computeStreak() do app: dias com pelo menos 1 lançamento,
// contando de hoje pra trás, e se hoje ainda não tem nada, começa de ontem.
function _streakSrv(datas) {
  var dias = {};
  datas.forEach(function (d) { if (d) dias[d.slice(0, 10)] = true; });
  // Fuso do usuário é o Brasil (UTC-3 fixo desde 2019) — usar UTC aqui
  // faria a sequência "quebrar" pra quem lança entre 21h e meia-noite.
  var cursor = new Date(Date.now() - 3 * 3600 * 1000);
  function iso(d) { return d.toISOString().slice(0, 10); }
  if (!dias[iso(cursor)]) cursor.setDate(cursor.getDate() - 1);
  var streak = 0;
  while (streak < 3660) {
    if (!dias[iso(cursor)]) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

var _CONQUISTAS_META = [
  { id: 'primeiro', icone: '🌱', nome: 'Primeiro lançamento', secreta: false },
  { id: 'streak7', icone: '🔥', nome: '7 dias seguidos', secreta: false },
  { id: 'streak30', icone: '💪', nome: '30 dias seguidos', secreta: false },
  { id: 'mesAzul', icone: '📈', nome: 'Mês no azul', secreta: false },
  { id: 'meta', icone: '🎯', nome: 'Meta batida', secreta: false },
  { id: 'limite', icone: '🛡️', nome: 'Dentro do limite', secreta: false },
  { id: 'racha', icone: '🤝', nome: 'Dividiu uma conta', secreta: false },
  { id: 'bot', icone: '🔗', nome: 'Conectou o bot', secreta: false },
  { id: 'coruja', icone: '🦉', nome: 'Coruja financeira', secreta: true },
  { id: 'tesoura', icone: '✂️', nome: 'Mãos de tesoura', secreta: true, derivavel: false },
  { id: 'sextou', icone: '🍻', nome: 'Sextou com consciência', secreta: true },
  { id: 'futuro', icone: '🕰️', nome: 'De volta pro futuro', secreta: true },
];

function _conquistasDoUsuario(txs, goals, limits, temSplit, temBot) {
  var mesAtual = new Date(Date.now() - 3 * 3600 * 1000).toISOString().slice(0, 7);
  var streak = _streakSrv(txs.map(function (t) { return t.date; }));

  // Mês no azul: algum mês fechado com receita > despesa.
  var porMes = {};
  txs.forEach(function (t) {
    var ym = (t.date || '').slice(0, 7);
    if (!ym) return;
    if (!porMes[ym]) porMes[ym] = { r: 0, d: 0 };
    if (t.type === 'receita') porMes[ym].r += Number(t.value) || 0;
    else porMes[ym].d += Number(t.value) || 0;
  });
  var mesAzul = Object.keys(porMes).some(function (ym) { return porMes[ym].d > 0 && porMes[ym].r > porMes[ym].d; });

  // Dentro do limite: gasto do mês corrente <= limite, em TODAS as
  // categorias configuradas (e precisa ter pelo menos uma configurada —
  // senão a conquista viria de graça pra quem nunca usou limites).
  var gastoMesPorCat = {};
  txs.forEach(function (t) {
    if (t.type !== 'despesa' || (t.date || '').slice(0, 7) !== mesAtual) return;
    gastoMesPorCat[t.category] = (gastoMesPorCat[t.category] || 0) + (Number(t.value) || 0);
  });
  var dentroLimite = limits.length > 0 && limits.every(function (l) {
    return (gastoMesPorCat[l.category] || 0) <= (Number(l.monthly_limit) || 0);
  });

  var coruja = txs.some(function (t) {
    if (!t.created_at) return false;
    var h = new Date(new Date(t.created_at).getTime() - 3 * 3600 * 1000).getUTCHours();
    return h >= 1 && h < 5;
  });

  var limiteLazer = limits.filter(function (l) { return l.category === 'Lazer'; })[0];
  var sextou = !!limiteLazer
    && (gastoMesPorCat['Lazer'] || 0) <= (Number(limiteLazer.monthly_limit) || 0)
    && txs.some(function (t) {
      return t.type === 'despesa' && t.category === 'Lazer' && t.date
        && new Date(t.date + 'T12:00:00Z').getUTCDay() === 5;
    });

  var futuro = txs.some(function (t) {
    if (t.type !== 'despesa' || !t.date || !t.created_at) return false;
    // -03:00 e não 'Z': o app faz esta conta com meio-dia LOCAL, e o usuário
    // está no Brasil. Com 'Z' o servidor ficava 3h à frente do cliente e, pra
    // quem tem entre 15d0h e 15d3h de atraso, o painel contava a conquista
    // como desbloqueada enquanto a pessoa não via o selo na tela dela.
    return (new Date(t.created_at) - new Date(t.date + 'T12:00:00-03:00')) / 86400000 > 15;
  });

  return {
    primeiro: txs.length >= 1,
    streak7: streak >= 7,
    streak30: streak >= 30,
    mesAzul: mesAzul,
    meta: goals.some(function (g) { return Number(g.target) > 0 && Number(g.saved) >= Number(g.target); }),
    limite: dentroLimite,
    racha: temSplit,
    bot: temBot,
    coruja: coruja,
    tesoura: false, // só localStorage — ver comentário do bloco
    sextou: sextou,
    futuro: futuro,
  };
}

// Preço por token dos modelos liberados no proxy /ai (ALLOWED_MODELS), em
// dólar por MILHÃO de tokens — igual à unidade da tabela de preços da
// Anthropic (anthropic.com/pricing). NÃO vem de nenhuma API: a Anthropic não
// expõe preço nem saldo de conta por API pra uma chave normal, só o Console
// mostra isso. Se o preço mudar lá, precisa atualizar aqui à mão — por isso
// todo custo calculado com esta tabela é rotulado "estimado" no painel, nunca
// como cobrança confirmada.
var AI_PRECOS_POR_MILHAO = {
  'claude-haiku-4-5-20251001': { input: 1.00, output: 5.00 },
  'claude-3-5-haiku-20241022': { input: 0.80, output: 4.00 }
};
function _aiCustoEstimado(model, inputTokens, outputTokens) {
  var p = AI_PRECOS_POR_MILHAO[model] || AI_PRECOS_POR_MILHAO['claude-haiku-4-5-20251001'];
  return (inputTokens / 1e6) * p.input + (outputTokens / 1e6) * p.output;
}

// Grava uma linha em ai_usage_log por chamada bem-sucedida ao /ai. Chamado
// via ctx.waitUntil (ver rota /ai) — nunca deve atrasar nem derrubar a
// resposta de quem pediu a análise.
async function _logAiUsage(env, userId, model, respostaBrutaTexto) {
  try {
    if (!env.SUPABASE_SERVICE_KEY) return;
    var usage = {};
    try { usage = (JSON.parse(respostaBrutaTexto) || {}).usage || {}; } catch (e0) { return; }
    var inputTokens = Number(usage.input_tokens) || 0;
    var outputTokens = Number(usage.output_tokens) || 0;
    var custo = _aiCustoEstimado(model, inputTokens, outputTokens);
    await fetch('${SUPA_URL_SERVER}/rest/v1/ai_usage_log', {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        user_id: userId, model: model,
        input_tokens: inputTokens, output_tokens: outputTokens, cost_estimate: custo
      }])
    });
  } catch (e) {
    // Best-effort: uma falha aqui não pode virar erro pra quem pediu a análise.
  }
}

// GET /admin/ai-usage — painel de uso da Finn IA (quantidade de chamadas e
// custo estimado por chamada). Mesmas credenciais do /admin/analytics.
//
// "Saldo" da conta Anthropic NÃO está aqui de propósito: nenhuma API com uma
// chave normal expõe crédito restante, só o Console
// (console.anthropic.com/settings/billing) mostra isso. O painel devolve
// saldo_disponivel:false com uma nota, em vez de inventar um número — melhor
// avisar que falta do que mostrar um "saldo" que não é de verdade.
async function _adminAiUsage(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'Supabase service key não configurada' }), { status: 500, headers: cors });

    var svcHeaders = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY };
    // Teto explícito pelo mesmo motivo do /admin/analytics: o volume aqui é
    // baixo (rate limit já capa em 60 chamadas/dia por conta), mas um número
    // fixo e conhecido é sempre melhor que confiar no default do PostgREST.
    var LOG_MAX = 20000;
    var r = await fetch(
      '${SUPA_URL_SERVER}/rest/v1/ai_usage_log?select=user_id,model,input_tokens,output_tokens,cost_estimate,created_at&order=created_at.desc&limit=' + LOG_MAX,
      { headers: svcHeaders }
    );
    if (!r.ok) return new Response(JSON.stringify({ error: 'falha ao ler o log de uso' }), { status: 502, headers: cors });
    var linhas = await r.json();

    var totalChamadas = linhas.length;
    var custoTotal = 0, porModelo = {}, porDia = {};
    linhas.forEach(function (l) {
      var custo = Number(l.cost_estimate) || 0;
      custoTotal += custo;
      var m = porModelo[l.model] || (porModelo[l.model] = { chamadas: 0, custo: 0 });
      m.chamadas++; m.custo += custo;
      var dia = (l.created_at || '').slice(0, 10);
      if (dia) {
        var d = porDia[dia] || (porDia[dia] = { chamadas: 0, custo: 0 });
        d.chamadas++; d.custo += custo;
      }
    });
    var porDiaLista = Object.keys(porDia).sort().slice(-30).map(function (dia) {
      return { dia: dia, chamadas: porDia[dia].chamadas, custo: porDia[dia].custo };
    });

    return new Response(JSON.stringify({
      ok: true,
      truncado: totalChamadas >= LOG_MAX,
      limite_aplicado: LOG_MAX,
      total_chamadas: totalChamadas,
      custo_total_estimado: custoTotal,
      custo_medio_por_chamada: totalChamadas ? custoTotal / totalChamadas : 0,
      por_modelo: porModelo,
      por_dia: porDiaLista,
      recentes: linhas.slice(0, 50),
      saldo_disponivel: false,
      saldo_nota: 'A API da Anthropic não expõe saldo de crédito restante — confira em console.anthropic.com/settings/billing.'
    }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, 'admin_ai_usage');
  }
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'Supabase service key não configurada' }), { status: 500, headers: cors });

    var svcHeaders = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY };

    var usersP = _adminListAllUsers(env);
    // date e category entraram junto com o painel de conquistas — são o
    // mínimo pra recalcular sequência/mês no azul/limite sem precisar da
    // descrição (ver o bloco de conquistas acima).
    // Teto explicito + deteccao de truncamento. Antes a consulta vinha sem
    // limite nenhum, com dois problemas conforme a base cresce:
    //   1. memoria — txs + txByUser[].rows + usersOut vivem ao mesmo tempo no
    //      isolate, que tem 128 MB. Com algumas centenas de milhares de
    //      lancamentos o painel simplesmente parava de abrir, sem meio-termo.
    //   2. mentira silenciosa — se o max-rows do PostgREST estiver ligado no
    //      projeto (o default do Supabase e 1.000), a resposta ja vinha
    //      cortada e o painel exibia numeros errados sem avisar ninguem.
    // Agora o corte e nosso, conhecido, e sinalizado na resposta.
    var TX_MAX = 200000;
    var txP = fetch('${SUPA_URL_SERVER}/rest/v1/transactions?select=user_id,value,type,created_at,date,category&limit=' + TX_MAX, { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var subsP = fetch('${SUPA_URL_SERVER}/rest/v1/subscriptions?select=user_id,plan,status,ai_usage_count', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var goalsP = fetch('${SUPA_URL_SERVER}/rest/v1/goals?select=user_id,target,saved', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var limitsP = fetch('${SUPA_URL_SERVER}/rest/v1/spending_limits?select=user_id,category,monthly_limit', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var splitsP = fetch('${SUPA_URL_SERVER}/rest/v1/splits?select=user_id', { headers: svcHeaders })
      .then(function(r) { return r.ok ? r.json() : []; });
    var featureTables = ['spending_limits', 'goals', 'fixed_accounts', 'splits', 'debts', 'credit_cards', 'categories'];
    var featureP = Promise.all(featureTables.map(function(t) { return _distinctUserCount(t, env); }));

    var users = await usersP;
    var txs = await txP;
    var subs = await subsP;
    var goalsAll = await goalsP;
    var limitsAll = await limitsP;
    var splitsAll = await splitsP;
    var featureCounts = await featureP;

    var totalUsers = users.length;

    // agregados por usuário (lançamentos + primeiro/último dia de atividade)
    var txByUser = {};
    var txByDay = {};
    txs.forEach(function(t) {
      if (!txByUser[t.user_id]) txByUser[t.user_id] = { count: 0, days: {}, rows: [] };
      txByUser[t.user_id].count++;
      txByUser[t.user_id].rows.push(t);
      var day = (t.created_at || '').slice(0, 10);
      if (day) {
        txByUser[t.user_id].days[day] = true;
        txByDay[day] = (txByDay[day] || 0) + 1;
      }
    });

    // Índices por usuário pro cálculo de conquistas.
    var goalsByUser = {}, limitsByUser = {}, splitUsers = {};
    goalsAll.forEach(function(g) { (goalsByUser[g.user_id] = goalsByUser[g.user_id] || []).push(g); });
    limitsAll.forEach(function(l) { (limitsByUser[l.user_id] = limitsByUser[l.user_id] || []).push(l); });
    splitsAll.forEach(function(s) { splitUsers[s.user_id] = true; });

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
      var conq = _conquistasDoUsuario(
        tx.rows || [],
        goalsByUser[u.id] || [],
        limitsByUser[u.id] || [],
        !!splitUsers[u.id],
        !!(meta.whatsapp_verified || meta.telegram_chat_id)
      );
      var conqFeitas = _CONQUISTAS_META.filter(function(c) { return c.derivavel !== false && conq[c.id]; }).length;
      return {
        conquistas: conq,
        conquistas_total: conqFeitas,
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

    // Agregado das conquistas. A conta master é excluída da base — senão o
    // painel fica medindo o próprio dono testando o app.
    var usuariosReais = usersOut.filter(function(u) { return !u.internal; });
    var baseConq = usuariosReais.length;
    var conquistasOut = _CONQUISTAS_META.map(function(c) {
      if (c.derivavel === false) {
        return { id: c.id, nome: c.nome, icone: c.icone, secreta: c.secreta, derivavel: false, usuarios: null, pct: null };
      }
      var n = usuariosReais.filter(function(u) { return u.conquistas[c.id]; }).length;
      return { id: c.id, nome: c.nome, icone: c.icone, secreta: c.secreta, derivavel: true, usuarios: n, pct: baseConq ? Math.round(n / baseConq * 100) : 0 };
    });
    // Mesma escada de renderTituloBadge() no app.
    // O topo da escada compara com o total DERIVAVEL, nao com o tamanho da
    // lista: 'tesoura' tem derivavel:false e nunca entra em conquistas_total,
    // entao comparar com _CONQUISTAS_META.length (12) deixava 'Investidor
    // Blindado' impossivel de alcancar aqui — quem tivesse tudo desbloqueado
    // via o titulo no proprio app e aparecia como 'Mestre do Orcamento' no
    // painel, com a linha do topo travada em 0 usuarios pra sempre.
    var _TOTAL_DERIVAVEL = _CONQUISTAS_META.filter(function(c) { return c.derivavel !== false; }).length;
    function _tituloDe(n) {
      if (n >= _TOTAL_DERIVAVEL) return 'Investidor Blindado';
      if (n >= 8) return 'Mestre do Orçamento';
      if (n >= 4) return 'Organizador Oficial';
      return 'Aprendiz das Finanças';
    }
    var titulos = {};
    usuariosReais.forEach(function(u) {
      var t = _tituloDe(u.conquistas_total);
      titulos[t] = (titulos[t] || 0) + 1;
    });

    var out = {
      ok: true,
      generated_at: new Date().toISOString(),
      // truncado=true significa que os numeros abaixo sao um PISO, nao o total.
      // Melhor mostrar "pelo menos N" do que um numero errado com cara de exato.
      truncado: txs.length >= TX_MAX,
      limite_lancamentos: TX_MAX,
      totals: {
        users: totalUsers,
        transactions: txs.length,
        returned: returnedCount,
        returned_pct: totalUsers ? Math.round(returnedCount / totalUsers * 100) : 0
      },
      conquistas: {
        base: baseConq,
        itens: conquistasOut,
        titulos: ['Aprendiz das Finanças', 'Organizador Oficial', 'Mestre do Orçamento', 'Investidor Blindado']
          .map(function(t) { return { titulo: t, usuarios: titulos[t] || 0 }; }),
        media_por_usuario: baseConq
          ? Math.round(usuariosReais.reduce(function(s, u) { return s + u.conquistas_total; }, 0) / baseConq * 10) / 10
          : 0
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

// ═══════════════════════════════════════════════════════════════════
//  SINCRONIZAÇÃO COM A PLANILHA (Google Sheets)
//
//  A planilha roda dentro do Google, num Apps Script que não tem como
//  guardar sessão do Supabase — o token de sessão expira em 1h e ninguém
//  vai colar um novo toda hora. Então existe um token próprio da planilha:
//  longo, aleatório, revogável, e que só abre estas duas rotas.
//
//  Ele NÃO é uma sessão: não serve pra nenhuma outra rota do Finn, não dá
//  acesso ao admin, e some quando a pessoa clica em desconectar. O escopo é
//  de propósito o menor possível — ler e gravar lançamento, mais nada.
// ═══════════════════════════════════════════════════════════════════
const SHEET_TOKEN_PREFIX = 'sheettok_';
const SHEET_USER_PREFIX = 'sheetuser_';
const SHEET_MAX_LINHAS = 500;
// Limites, contas fixas, dívidas e racha são configuração, não histórico —
// ninguém tem centenas de dívidas cadastradas. O teto é só uma rede de
// segurança contra payload gigante, não um limite pensado pra ser atingido.
const SHEET_MAX_OUTRAS = 200;

function _novoTokenPlanilha() {
  var bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return 'fsh_' + hex;
}

// Resolve o token da planilha -> dono. Devolve null pra qualquer coisa
// suspeita, sem dizer o motivo (token inexistente e token expirado dão a
// mesma resposta de propósito).
async function _donoDoToken(env, token) {
  if (!env.FINN_KV || !token || typeof token !== 'string') return null;
  if (!/^fsh_[a-f0-9]{64}$/.test(token)) return null;
  var raw = await env.FINN_KV.get(SHEET_TOKEN_PREFIX + token);
  if (!raw) return null;
  try {
    var reg = JSON.parse(raw);
    return reg && reg.uid ? reg : null;
  } catch (e) { return null; }
}

// A sincronização é do plano Planilha ou do Pro. Fica no SERVIDOR e não só
// na tela: a planilha chama estas rotas direto, sem passar pelo app, então
// gate só no frontend não seria gate nenhum.
//
// Respeita a mesma flag de beta do resto — enquanto a cobrança não começou,
// todo mundo passa, igual à IA.
async function _podeSincronizarPlanilha(uid, env) {
  if (!PREMIUM_ENFORCEMENT_ENABLED) return true;
  var sub = await _subaGetSubscription(uid, env);
  var plano = (sub && sub.plan) || 'free';
  return _planoTemSync(plano);
}

// POST /sheets/token { access_token } — cria (ou troca) o token da planilha.
// Trocar invalida o anterior: é o botão de "perdi minha planilha".
async function _sheetsToken(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.FINN_KV) return new Response(JSON.stringify({ error: 'indisponível' }), { status: 503, headers: cors });
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var user = await _supaAuth(body.access_token);
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

    var rl = await _rateLimit(env, 'sheettok', user.id, 10, 3600);
    if (!rl.ok) return _tooManyRequests(cors, rl.retryAfter, 'muitas trocas de token, tente mais tarde');

    var anterior = await env.FINN_KV.get(SHEET_USER_PREFIX + user.id);
    if (anterior) await env.FINN_KV.delete(SHEET_TOKEN_PREFIX + anterior);

    var token = _novoTokenPlanilha();
    await env.FINN_KV.put(SHEET_TOKEN_PREFIX + token, JSON.stringify({
      uid: user.id, criado_em: new Date().toISOString()
    }));
    await env.FINN_KV.put(SHEET_USER_PREFIX + user.id, token);
    return new Response(JSON.stringify({ ok: true, token: token }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, 'sheets_token');
  }
}

// DELETE /sheets/token { access_token } — desconecta a planilha.
async function _sheetsTokenRevogar(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.FINN_KV) return new Response(JSON.stringify({ error: 'indisponível' }), { status: 503, headers: cors });
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var user = await _supaAuth(body.access_token);
    if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
    var atual = await env.FINN_KV.get(SHEET_USER_PREFIX + user.id);
    if (atual) await env.FINN_KV.delete(SHEET_TOKEN_PREFIX + atual);
    await env.FINN_KV.delete(SHEET_USER_PREFIX + user.id);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, 'sheets_token_revogar');
  }
}

// GET /sheets/pull — devolve os lançamentos do dono do token, e junto o
// retrato atual de Limites, Contas fixas, Dívidas e Racha — essas quatro
// abas não têm outro jeito de saber o que existe no app: são configuração
// que o app deixa a pessoa editar em qualquer momento (marcar parcela como
// paga, mudar teto de categoria), não um log que só cresce como Lançamentos.
// A planilha manda os ids que já tem, pra não rebaixar linha por linha.
async function _sheetsPull(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'indisponível' }), { status: 503, headers: cors });
    var reg = await _donoDoToken(env, request.headers.get('X-Sheet-Token'));
    if (!reg) return new Response(JSON.stringify({ error: 'token inválido' }), { status: 401, headers: cors });
    if (!(await _podeSincronizarPlanilha(reg.uid, env))) {
      return new Response(JSON.stringify({ error: 'a sincronização da planilha faz parte do plano Planilha ou Pro' }), { status: 402, headers: cors });
    }

    var rl = await _rateLimit(env, 'sheetpull', reg.uid, 120, 3600);
    if (!rl.ok) return _tooManyRequests(cors, rl.retryAfter, 'muitas sincronizações, tente mais tarde');

    var url = new URL(request.url);
    var desde = url.searchParams.get('desde') || '';
    var ate = url.searchParams.get('ate') || '';
    var dataValida = /^\\d{4}-\\d{2}-\\d{2}$/;
    var filtroTx = 'user_id=eq.' + encodeURIComponent(reg.uid) + '&select=id,date,type,category,description,value' +
                 '&order=date.desc&limit=' + SHEET_MAX_LINHAS;
    // "desde" corta pela data do lançamento, não pelo created_at: é a data
    // que a planilha mostra, e é por ela que a pessoa raciocina.
    if (dataValida.test(desde)) filtroTx += '&date=gte.' + desde;
    // "ate" existe pra paginar histórico pra trás. Sem isso o limit acima
    // travava a sincronização sempre nos SHEET_MAX_LINHAS lançamentos mais
    // RECENTES — sincronizar de novo trazia a mesma janela, nunca o resto.
    // Foi exatamente o caso real de 1651 lançamentos no banco contra só 501
    // na planilha. A planilha manda a data mais antiga que já tem e busca o
    // próximo lote mais antigo que isso (ver finnPuxar no Apps Script).
    if (dataValida.test(ate)) filtroTx += '&date=lte.' + ate;

    var svcHeaders = { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY };
    // count=exact devolve o total real (sem o limit) no header Content-Range
    // — é o que permite a planilha saber quanto falta puxar e avisar quando
    // não coube tudo, em vez de silenciosamente mostrar uma fração como se
    // fosse o total.
    var svcHeadersTx = Object.assign({ Prefer: 'count=exact' }, svcHeaders);
    var base = '${SUPA_URL_SERVER}/rest/v1/';
    var uidFiltro = 'user_id=eq.' + encodeURIComponent(reg.uid) + '&limit=' + SHEET_MAX_OUTRAS;

    var respostas = await Promise.all([
      fetch(base + 'transactions?' + filtroTx, { headers: svcHeadersTx }),
      fetch(base + 'spending_limits?' + uidFiltro + '&select=category,monthly_limit&order=category.asc', { headers: svcHeaders }),
      fetch(base + 'fixed_accounts?' + uidFiltro + '&select=type,description,category,value,day_of_month&order=day_of_month.asc', { headers: svcHeaders }),
      fetch(base + 'debts?' + uidFiltro + '&select=name,category,total_value,remaining_value,interest_rate,monthly_payment&order=created_at.asc', { headers: svcHeaders }),
      fetch(base + 'goals?' + uidFiltro + '&select=name,target,saved,deadline&order=created_at.asc', { headers: svcHeaders }),
      fetch(base + 'splits?' + uidFiltro + '&select=id,description,category,total_value,date&order=date.desc', { headers: svcHeaders }),
      // Sem limite próprio: participantes pertencem aos splits já limitados
      // acima, então o teto dos splits já limita o total de participantes
      // (na prática, poucos por split).
      fetch(base + 'split_participants?user_id=eq.' + encodeURIComponent(reg.uid) + '&select=split_id,name,paid', { headers: svcHeaders })
    ]);
    // Índices: 0=transactions 1=spending_limits 2=fixed_accounts 3=debts
    // 4=goals 5=splits 6=split_participants.
    var rTx = respostas[0];
    if (!rTx.ok) return new Response(JSON.stringify({ error: 'falha ao ler os lançamentos' }), { status: 502, headers: cors });
    // Content-Range vem "0-499/1651" (count=exact acima). O total real é a
    // parte depois da barra — sem o limit, é quantos lançamentos existem de
    // verdade pra esse filtro, não só quantos vieram nesta página.
    var totalGeral = null;
    var contentRange = rTx.headers.get('content-range');
    if (contentRange) {
      var totalStr = contentRange.split('/')[1];
      var totalNum = parseInt(totalStr, 10);
      if (!isNaN(totalNum)) totalGeral = totalNum;
    }
    var linhas = await rTx.json();
    // Cada uma das outras quatro é best-effort: se uma falhar, a planilha
    // ainda sincroniza os lançamentos normalmente — melhor mostrar Limites
    // vazio do que travar a sincronização inteira por causa de uma tabela.
    var limites = respostas[1].ok ? await respostas[1].json() : [];
    var contasFixas = respostas[2].ok ? await respostas[2].json() : [];
    var dividas = respostas[3].ok ? await respostas[3].json() : [];
    var metas = respostas[4].ok ? await respostas[4].json() : [];
    var splits = respostas[5].ok ? await respostas[5].json() : [];
    var participantes = respostas[6].ok ? await respostas[6].json() : [];

    var porSplit = {};
    for (var i = 0; i < participantes.length; i++) {
      var p = participantes[i];
      (porSplit[p.split_id] = porSplit[p.split_id] || []).push({ name: p.name, paid: !!p.paid });
    }
    var racha = splits.map(function (s) {
      return {
        date: s.date, description: s.description, category: s.category,
        total_value: s.total_value, participantes: porSplit[s.id] || []
      };
    });

    return new Response(JSON.stringify({
      ok: true, total: linhas.length, total_geral: totalGeral, lancamentos: linhas,
      limites: limites, contasFixas: contasFixas, dividas: dividas, metas: metas, racha: racha
    }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, 'sheets_pull');
  }
}

// POST /sheets/push { lancamentos: [...] } — grava no Finn o que foi digitado
// na planilha. Devolve os ids na MESMA ordem que recebeu, porque é assim que
// a planilha sabe qual id escrever em qual linha.
async function _sheetsPush(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    if (!env.SUPABASE_SERVICE_KEY) return new Response(JSON.stringify({ error: 'indisponível' }), { status: 503, headers: cors });
    var reg = await _donoDoToken(env, request.headers.get('X-Sheet-Token'));
    if (!reg) return new Response(JSON.stringify({ error: 'token inválido' }), { status: 401, headers: cors });

    var rl = await _rateLimit(env, 'sheetpush', reg.uid, 120, 3600);
    if (!rl.ok) return _tooManyRequests(cors, rl.retryAfter, 'muitas sincronizações, tente mais tarde');

    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var entrada = Array.isArray(body.lancamentos) ? body.lancamentos : [];
    if (!entrada.length) return new Response(JSON.stringify({ ok: true, gravados: 0, ids: [] }), { status: 200, headers: cors });
    if (entrada.length > SHEET_MAX_LINHAS) {
      return new Response(JSON.stringify({ error: 'no máximo ' + SHEET_MAX_LINHAS + ' linhas por vez' }), { status: 400, headers: cors });
    }

    // Validação linha a linha. O user_id vem SEMPRE do token, nunca do corpo:
    // aceitar user_id do cliente aqui seria deixar qualquer planilha gravar na
    // conta de qualquer pessoa.
    var payload = [];
    for (var i = 0; i < entrada.length; i++) {
      var l = entrada[i] || {};
      var data = String(l.date || '').slice(0, 10);
      if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(data)) {
        return new Response(JSON.stringify({ error: 'linha ' + (i + 1) + ': data inválida' }), { status: 400, headers: cors });
      }
      var tipo = l.type === 'receita' ? 'receita' : (l.type === 'despesa' ? 'despesa' : null);
      if (!tipo) return new Response(JSON.stringify({ error: 'linha ' + (i + 1) + ': tipo tem que ser despesa ou receita' }), { status: 400, headers: cors });
      var valor = Number(l.value);
      if (!isFinite(valor) || valor <= 0) {
        return new Response(JSON.stringify({ error: 'linha ' + (i + 1) + ': valor inválido' }), { status: 400, headers: cors });
      }
      payload.push({
        user_id: reg.uid,
        date: data,
        type: tipo,
        category: String(l.category || 'Outros').slice(0, 60),
        description: String(l.description || '').slice(0, 200),
        value: Math.round(valor * 100) / 100
      });
    }

    var r = await fetch('${SUPA_URL_SERVER}/rest/v1/transactions', {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    if (!r.ok) return new Response(JSON.stringify({ error: 'falha ao gravar' }), { status: 502, headers: cors });
    var criados = await r.json();
    return new Response(JSON.stringify({
      ok: true, gravados: criados.length, ids: criados.map(function (t) { return t.id; })
    }), { status: 200, headers: cors });
  } catch (e) {
    return _serverError(cors, e, 'sheets_push');
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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

// ── Questionário antes do link do beta ──────────────────────────────────────
// Pedido pra rodar antes da inscrição de verdade (/beta): dá pra saber quem
// está entrando (banco que usa, o que mais pesa hoje) antes de mandar o
// link. Como a liberação é automática pra todo mundo — não existe reprovação
// aqui — este endpoint só GRAVA a resposta; quem decide se inscrever de
// verdade é a pessoa, clicando no botão que a página mostra depois.
var BETAQ_CAMPOS = ['organiza', 'banco', 'dor', 'tempo', 'canal', 'dispositivo', 'followup'];
// Teto de respostas gravadas por dia — mesmo raciocínio do SEC_LOG_MAX_DIA:
// este endpoint é público e sem autenticação (tem que ser, é o primeiro
// contato de alguém que nunca usou o Finn), então escreve no KV por conta de
// qualquer requisição que passe do honeypot. Sem teto, uma enxurrada
// consumiria a cota de escrita compartilhada com push, screener e log de
// segurança. Bem folgado pro volume esperado (dezenas de pessoas, não
// milhares) — se um dia isso disparar de verdade, é sinal bom, não bug.
var BETAQ_MAX_DIA = 300;

async function _betaQuestionario(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}

    // Mesmo honeypot do /beta/signup: campo escondido que só um bot preenche.
    // Finge sucesso pra não dar dica de que foi bloqueado.
    if (body.website) return new Response(JSON.stringify({ ok: true }), { headers: cors });

    var name = String(body.name || '').trim().slice(0, 120);
    var email = String(body.email || '').trim().slice(0, 200);
    if (!name || !email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Nome e e-mail válido são obrigatórios.' }), { status: 400, headers: cors });
    }

    // Os campos de múltipla escolha (organiza/tempo/canal/dispositivo/
    // followup) NÃO são validados contra uma lista fixa aqui: quem manda o
    // POST não precisa ser o &lt;select&gt; da página (dá pra chamar a rota
    // direto), então tratar como texto livre e cortar tamanho é mais robusto
    // que rejeitar por não bater com um enum — o pior caso é um valor
    // inesperado aparecendo na tela do admin, e ali ele sai sempre escapado.
    var respostas = {};
    for (var i = 0; i < BETAQ_CAMPOS.length; i++) {
      var chave = BETAQ_CAMPOS[i];
      respostas[chave] = String(body[chave] || '').trim().slice(0, 400);
    }

    var rlIp = await _rateLimit(env, 'betaq_ip', _clientIp(request), 5, 3600);
    if (!rlIp.ok) return _tooManyRequests(cors, rlIp.retryAfter, 'muitas respostas seguidas, tente mais tarde');

    if (env.FINN_KV) {
      var hoje = new Date().toISOString().slice(0, 10);
      var chaveContador = 'betaqcount_' + hoje;
      var jaHoje = parseInt((await env.FINN_KV.get(chaveContador)) || '0', 10) || 0;
      if (jaHoje >= BETAQ_MAX_DIA) {
        // Finge sucesso — a pessoa não fez nada de errado, quem estourou o
        // teto foi outra coisa (ou volume real, que é bom sinal). Mesmo
        // espírito do honeypot: nunca devolver erro que pareça culpa dela.
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      }
      await env.FINN_KV.put(chaveContador, String(jaHoje + 1), { expirationTtl: 60 * 60 * 24 * 30 });

      var id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      await env.FINN_KV.put('betaq_' + id, JSON.stringify(Object.assign({
        name: name, email: email, created_at: new Date().toISOString()
      }, respostas)), { expirationTtl: 60 * 60 * 24 * 180 });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_betaQuestionario');
  }
}

// GET /admin/beta-questionario — mesmo padrão de credencial das outras rotas
// admin (Authorization: Bearer + X-Admin-Password). Lista bruta, sem
// agregação: são dezenas de respostas, não milhares — dá pra ler direto.
async function _adminBetaQuestionario(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.FINN_KV) return new Response(JSON.stringify({ respostas: [] }), { headers: cors });

    var keys = [];
    var cursor;
    do {
      var page = await env.FINN_KV.list({ prefix: 'betaq_', cursor: cursor });
      keys = keys.concat(page.keys);
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    keys.sort(function (a, b) { return b.name.localeCompare(a.name); });

    var respostas = (await Promise.all(keys.slice(0, 300).map(function (k) { return env.FINN_KV.get(k.name); })))
      .filter(Boolean).map(function (raw) { try { return JSON.parse(raw); } catch (e) { return null; } }).filter(Boolean);
    return new Response(JSON.stringify({ respostas: respostas }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminBetaQuestionario');
  }
}

// ── Painel de anúncios (Meta Marketing API) ──────────────────────────────────
// Só LEITURA de propósito: campanha, gasto, impressões, cliques, CTR, CPC dos
// últimos 30 dias. Criar/editar campanha é decisão que gasta dinheiro de
// verdade e sai daqui — fica pra quando o usuário pedir explicitamente essa
// capacidade, com um fluxo de "preparar e mostrar antes de executar".
//
// A rede deste sandbox bloqueia graph.facebook.com (mesmo bloqueio que já
// existia pra brapi.dev), então os nomes de campo abaixo NÃO foram
// confirmados contra uma resposta real — são os documentados publicamente
// pela Marketing API (spend/impressions/clicks/ctr/cpc/reach nesse formato
// são estáveis há anos, mas o formato exato do envelope {data:[...]} e como
// erros vêm no corpo eu só vou confirmar com o primeiro uso real.
var META_ADS_API_VERSION = 'v19.0';
var META_ADS_DATE_PRESET = 'last_30d';
var META_ADS_CACHE_TTL_SEG = 300; // 5 min — a Marketing API tem teto de chamadas por conta, e "Atualizar agora" clicado em sequência não pode furar isso.

// Mesmo raciocínio do _screenerRedige: o token nunca pode voltar pro
// cliente, nem em mensagem de erro que ecoe a URL chamada.
function _metaAdsRedige(texto, token) {
  if (!token) return texto;
  return String(texto || '').split(token).join('[TOKEN OCULTO]');
}

async function _metaAdsBusca(env, caminho, params) {
  var url = 'https://graph.facebook.com/' + META_ADS_API_VERSION + '/' + caminho +
    (params ? '?' + params : '');
  var resp;
  try {
    var opcoes = { headers: { Authorization: 'Bearer ' + env.META_ADS_TOKEN, Accept: 'application/json' } };
    if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) opcoes.signal = AbortSignal.timeout(10000);
    resp = await fetch(url, opcoes);
  } catch (e) {
    console.error('[metaAds] falha de rede:', _metaAdsRedige(String((e && e.message) || e), env.META_ADS_TOKEN));
    return { ok: false, motivo: 'rede' };
  }
  var texto = '';
  try { texto = await resp.text(); } catch (e2) { texto = ''; }
  var corpo = null;
  try { corpo = JSON.parse(texto); } catch (e3) { corpo = null; }

  if (!resp.ok || corpo === null) {
    // Erro do Meta costuma vir como {error:{message,type,code}} mesmo em 200
    // às vezes — mas o status não-ok já é sinal suficiente de problema.
    var msgErro = (corpo && corpo.error && corpo.error.message) || ('status ' + resp.status);
    console.error('[metaAds] resposta de erro em ' + caminho + ':', _metaAdsRedige(String(msgErro).slice(0, 300), env.META_ADS_TOKEN));
    var tipo = 'fornecedor';
    if (resp.status === 401 || resp.status === 403) tipo = 'token_recusado';
    else if (resp.status === 429) tipo = 'rate_limit_fornecedor';
    return { ok: false, motivo: tipo, status: resp.status, mensagemFornecedor: String(msgErro).slice(0, 200) };
  }
  return { ok: true, corpo: corpo };
}

function _metaAdsCacheKey(request) {
  var u = new URL(request.url);
  return new Request(u.origin + '/__cache/meta-ads', { method: 'GET' });
}

// GET /admin/meta-ads — mesmo padrão de credencial admin das outras rotas.
async function _adminMetaAds(request, env, ctx) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    if (!env.META_ADS_TOKEN || !env.META_AD_ACCOUNT_ID) {
      return new Response(JSON.stringify({
        ok: false, configurado: false,
        erro: { tipo: 'nao_configurado', mensagem: 'O painel de anúncios ainda não está ligado neste ambiente.' },
        motivo: 'META_ADS_TOKEN e/ou META_AD_ACCOUNT_ID não configurados — ver o bloco [vars] do wrangler.toml'
      }), { status: 503, headers: cors });
    }

    var cacheKey = _metaAdsCacheKey(request);
    if (typeof caches !== 'undefined' && caches.default) {
      var guardado = await caches.default.match(cacheKey);
      if (guardado) {
        var corpoCache = await guardado.json();
        corpoCache.cache = { hit: true, ttlSegundos: META_ADS_CACHE_TTL_SEG };
        return new Response(JSON.stringify(corpoCache), { headers: cors });
      }
    }

    var idConta = env.META_AD_ACCOUNT_ID.indexOf('act_') === 0 ? env.META_AD_ACCOUNT_ID : ('act_' + env.META_AD_ACCOUNT_ID);

    // Duas chamadas em paralelo: uma pega status/objetivo/orçamento de cada
    // campanha (a Insights API não devolve isso), a outra pega gasto/
    // impressões/cliques/CTR/CPC por campanha no período. Casadas por
    // campaign_id depois — é o mesmo padrão de "duas fontes, um id em
    // comum" que o screener usa pra casar indicador com preço.
    var resultados = await Promise.all([
      _metaAdsBusca(env, idConta + '/campaigns', 'fields=id,name,status,objective,daily_budget,lifetime_budget,created_time&limit=100'),
      _metaAdsBusca(env, idConta + '/insights', 'level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,reach,frequency&date_preset=' + META_ADS_DATE_PRESET + '&limit=100'),
      _metaAdsBusca(env, idConta + '/insights', 'fields=spend,impressions,clicks,ctr,cpc,reach&date_preset=' + META_ADS_DATE_PRESET),
    ]);
    var campanhasResp = resultados[0], insightsResp = resultados[1], totalResp = resultados[2];

    if (!campanhasResp.ok) {
      var infoErro = { tipo: campanhasResp.motivo, mensagem:
        campanhasResp.motivo === 'token_recusado' ? 'O Meta recusou o token — confira se ele ainda é válido e tem o escopo ads_read.' :
        campanhasResp.motivo === 'rate_limit_fornecedor' ? 'O Meta limitou as consultas agora. Tenta de novo em alguns minutos.' :
        campanhasResp.motivo === 'rede' ? 'Não consegui falar com o Meta agora.' :
        'Não consegui carregar os anúncios agora.'
      };
      var statusErro = campanhasResp.motivo === 'token_recusado' ? 503 : (campanhasResp.motivo === 'rate_limit_fornecedor' ? 429 : 502);
      return new Response(JSON.stringify({ ok: false, erro: infoErro }), { status: statusErro, headers: cors });
    }

    var campanhasCru = (campanhasResp.corpo && campanhasResp.corpo.data) || [];
    var insightsCru = (insightsResp.ok && insightsResp.corpo && insightsResp.corpo.data) || [];
    var totalCru = (totalResp.ok && totalResp.corpo && totalResp.corpo.data && totalResp.corpo.data[0]) || null;

    var insightsPorId = {};
    insightsCru.forEach(function (i) { if (i.campaign_id) insightsPorId[i.campaign_id] = i; });

    var campanhas = campanhasCru.map(function (c) {
      var ins = insightsPorId[c.id] || {};
      return {
        id: String(c.id || ''),
        nome: String(c.name || '').slice(0, 200),
        status: String(c.status || '').toLowerCase(),
        objetivo: String(c.objective || '').slice(0, 80),
        orcamentoDiario: c.daily_budget ? Number(c.daily_budget) / 100 : null, // Meta manda centavos
        orcamentoTotal: c.lifetime_budget ? Number(c.lifetime_budget) / 100 : null,
        gasto: ins.spend !== undefined ? Number(ins.spend) : null,
        impressoes: ins.impressions !== undefined ? Number(ins.impressions) : null,
        cliques: ins.clicks !== undefined ? Number(ins.clicks) : null,
        ctr: ins.ctr !== undefined ? Number(ins.ctr) : null,
        cpc: ins.cpc !== undefined ? Number(ins.cpc) : null,
        alcance: ins.reach !== undefined ? Number(ins.reach) : null,
      };
    });

    var resposta = {
      ok: true, configurado: true,
      periodo: META_ADS_DATE_PRESET,
      totais: totalCru ? {
        gasto: Number(totalCru.spend || 0), impressoes: Number(totalCru.impressions || 0),
        cliques: Number(totalCru.clicks || 0), ctr: Number(totalCru.ctr || 0),
        cpc: Number(totalCru.cpc || 0), alcance: Number(totalCru.reach || 0),
      } : null,
      campanhas: campanhas,
      insightsIndisponivel: !insightsResp.ok, // campanhas aparecem mesmo sem métrica, avisado à parte
      cache: { hit: false, ttlSegundos: META_ADS_CACHE_TTL_SEG },
    };

    if (typeof caches !== 'undefined' && caches.default && ctx) {
      var paraGuardar = new Response(JSON.stringify(resposta), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=' + META_ADS_CACHE_TTL_SEG } });
      ctx.waitUntil(caches.default.put(cacheKey, paraGuardar));
    }

    return new Response(JSON.stringify(resposta), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminMetaAds');
  }
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
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
// Onde as imagens 9:16 de story estao hospedadas. Aponta pro OUTRO worker de
// proposito — ver o comentario em finn-worker/social-stories.js.
const IG_STORY_BASE = 'https://wild-sun-742ffinn-whatsapp-worker.khevenhenriquelimasantos443.workers.dev';
// As legendas saem do MESMO roteiro que gera a arte (finn-social/copy.cjs).
// Antes eram uma segunda cópia do texto aqui dentro, e legenda e imagem podiam
// divergir sem ninguém notar. O JSON.stringify roda no BUILD, não no worker:
// aqui dentro estamos num template literal, então o que sobra no index.js é a
// lista pronta, sem dependência de arquivo em tempo de execução.
const IG_CAPTIONS = ${JSON.stringify(COPY.POSTS.map(COPY.legendaDe))};

// Publica o próximo post da sequência (1 a IG_CAPTIONS.length) — chamado
// pelo cron diário e também pelo endpoint de disparo manual
// /admin/instagram-publish-next.
// URL pública de um arquivo do bucket 'social'. Tem que ser pública porque a
// API do Instagram não aceita upload de arquivo — só image_url que os
// servidores da Meta baixam sozinhos, sem token.
// A fila normalmente guarda só o NOME do arquivo no bucket. Uma URL absoluta
// passa direto: é assim que dá pra reenfileirar um post da campanha embutida,
// cuja arte já é servida pelo próprio worker, sem copiar a imagem pro bucket.
function _socialPublicUrl(caminho) {
  // Comparar prefixo em vez de usar expressão regular é de propósito: este
  // arquivo inteiro vive dentro de um template literal, que engole a barra
  // invertida, e uma regex com escape chega quebrada no worker. Já aconteceu
  // duas vezes neste repositório.
  var pre = String(caminho || '').slice(0, 8).toLowerCase();
  if (pre.indexOf('https://') === 0 || pre.indexOf('http://') === 0) return caminho;
  return '${SUPA_URL_SERVER}/storage/v1/object/public/social/' + caminho;
}

// Próximo item da fila que a tela de Conteúdo alimenta. Usa a service key: a
// RLS da social_posts é por e-mail da conta master, e o Worker não tem sessão
// de usuário nenhuma.
// Quantas artes 9:16 embutidas existem (moram no worker do bot).
const IG_STORY_COUNT = ${COPY.POSTS.length};  // um story por post, vindo do roteiro

// Próximo item da fila de um tipo específico ('feed' ou 'story').
async function _proximoDaFilaPorTipo(env, tipo) {
  if (!env.SUPABASE_SERVICE_KEY) return null;
  try {
    var r = await fetch('${SUPA_URL_SERVER}/rest/v1/social_posts?published_at=is.null&kind=eq.' + tipo + '&order=posicao.asc,created_at.asc&limit=1', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    if (!r.ok) return null;
    var linhas = await r.json();
    return (linhas && linhas[0]) || null;
  } catch (e) { return null; }
}

// Só itens de FEED: story tem cron próprio, 25 min depois. Sem esse filtro, um
// story da fila sairia no horário do post — e publicado como post.
async function _proximoDaFila(env) {
  if (!env.SUPABASE_SERVICE_KEY) return null;
  try {
    var r = await fetch('${SUPA_URL_SERVER}/rest/v1/social_posts?published_at=is.null&kind=eq.feed&order=posicao.asc,created_at.asc&limit=1', {
      headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
    });
    if (!r.ok) return null;
    var linhas = await r.json();
    return (linhas && linhas[0]) || null;
  } catch (e) { return null; }
}

async function _marcaPublicado(env, id, campos) {
  if (!env.SUPABASE_SERVICE_KEY) return;
  try {
    await fetch('${SUPA_URL_SERVER}/rest/v1/social_posts?id=eq.' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(campos)
    });
  } catch (e) { /* best-effort: não pode derrubar o que já foi publicado */ }
}

async function _publishNextInstagramPost(env) {
  if (!env.IG_ACCESS_TOKEN || !env.IG_BUSINESS_ACCOUNT_ID) {
    return { ok: false, skipped: true, reason: 'IG_ACCESS_TOKEN ou IG_BUSINESS_ACCOUNT_ID não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  // A fila do Supabase tem PRIORIDADE sobre a lista embutida no código.
  //
  // É questão de previsibilidade: o que aparece na tela de Conteúdo é o que
  // vai sair. Se a lista antiga viesse primeiro, o dono subiria um post hoje e
  // ele só sairia dias depois, atrás de conteúdo que ele nem enxerga. A lista
  // embutida vira reserva, pra campanha antiga escoar enquanto a fila nova
  // estiver vazia.
  var daFila = await _proximoDaFila(env);

  var nextIndex = null, imageUrl, caption, filaId = null, ehStory = false;
  if (daFila) {
    filaId = daFila.id;
    ehStory = daFila.kind === 'story';
    imageUrl = _socialPublicUrl(daFila.image_path);
    caption = daFila.caption || '';
  } else {
    nextIndex = Number((await env.FINN_KV.get('ig_post_next_index')) || '1');
    if (nextIndex > IG_CAPTIONS.length) return { ok: false, done: true, reason: 'fila vazia e os ' + IG_CAPTIONS.length + ' posts embutidos já foram publicados' };
    imageUrl = 'https://finn.dev.br/social/post-' + nextIndex + '.png';
    caption = IG_CAPTIONS[nextIndex - 1];
  }

  var log = { index: nextIndex, fila_id: filaId, origem: daFila ? 'fila' : 'embutido', kind: ehStory ? 'story' : 'feed', image_url: imageUrl, started_at: new Date().toISOString() };

  try {
    // Passo 1: cria o "container" de mídia (a Meta busca a imagem pela URL —
    // não existe upload direto de arquivo nessa API).
    var createResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Story não leva caption (a Meta ignora) e exige media_type.
      body: JSON.stringify(ehStory
        ? { image_url: imageUrl, media_type: 'STORIES', access_token: env.IG_ACCESS_TOKEN }
        : { image_url: imageUrl, caption: caption, access_token: env.IG_ACCESS_TOKEN })
    });
    var createBody = await createResp.json();
    log.create_status = createResp.status;
    log.create_response = createBody;
    if (!createResp.ok || !createBody.id) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'falha em media' });
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
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'falha em container_not_ready' });
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
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'falha em media_publish' });
      return { ok: false, step: 'media_publish', body: publishBody };
    }

    log.ok = true;
    log.finished_at = new Date().toISOString();
    await _logInstagramAttempt(env, log);
    // Só avança o índice em caso de sucesso — uma falha (token vencido,
    // rate limit, etc.) tenta o MESMO post de novo no próximo cron, em vez
    // de pular pra frente e nunca publicar o que falhou.
    if (daFila) {
      await _marcaPublicado(env, filaId, { published_at: new Date().toISOString(), ig_media_id: String(publishBody.id), erro: null });
    } else {
      await env.FINN_KV.put('ig_post_next_index', String(nextIndex + 1));
    }

    return { ok: true, index: nextIndex, fila_id: filaId || null, media_id: publishBody.id };
  } catch (e) {
    log.ok = false;
    log.error = String(e && e.message || e);
    await _logInstagramAttempt(env, log);
    return { ok: false, error: log.error };
  }
}

// Publica o próximo Story.
//
// Roda no PRÓPRIO cron (25 min depois do post), não pendurado no fluxo do
// feed como antes. O jeito antigo — disparar uma promise solta, sem await e
// sem ctx.waitUntil — não funciona no Cloudflare: assim que o post do feed
// termina, o runtime pode encerrar o isolate e mata o story no meio. E o
// story demora: cria o container e fica até 20s esperando a Meta baixar a
// imagem. Era exatamente por isso que o post saía e o story não.
async function _publishNextInstagramStory(env) {
  if (!env.IG_ACCESS_TOKEN || !env.IG_BUSINESS_ACCOUNT_ID) {
    return { ok: false, skipped: true, reason: 'IG_ACCESS_TOKEN ou IG_BUSINESS_ACCOUNT_ID não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  var daFila = await _proximoDaFilaPorTipo(env, 'story');
  var imageUrl, filaId = null, storyIndex = null;

  if (daFila) {
    filaId = daFila.id;
    imageUrl = _socialPublicUrl(daFila.image_path);
  } else {
    // Campanha embutida: o story é DERIVADO do post, não tem contador próprio.
    //
    // Com dois contadores independentes eles andavam em ritmos diferentes e o
    // story ia ficando para trás — o story do dia era a arte de um post
    // publicado dias antes. Aqui o alvo é sempre a arte do ÚLTIMO post que
    // saiu (ig_post_next_index aponta pro próximo, então o último é ele menos
    // 1), e ig_story_last só marca o que já foi pra não repetir. Assim não tem
    // como dessincronizar de novo.
    var postIndex = Number((await env.FINN_KV.get('ig_post_next_index')) || '1');
    var alvo = postIndex - 1;
    var ultimoStory = Number((await env.FINN_KV.get('ig_story_last')) || '0');
    if (alvo < 1) return { ok: false, skipped: true, reason: 'nenhum post publicado ainda' };
    if (alvo <= ultimoStory) return { ok: false, skipped: true, reason: 'o story deste post já saiu' };
    if (alvo > IG_STORY_COUNT) return { ok: false, done: true, reason: 'os stories embutidos já foram publicados' };
    storyIndex = alvo;
    imageUrl = IG_STORY_BASE + '/social/story-' + storyIndex + '.jpg';
  }

  var log = { tipo: 'story', index: storyIndex, fila_id: filaId, origem: daFila ? 'fila' : 'embutido', image_url: imageUrl, started_at: new Date().toISOString() };
  try {
    var createResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Story não leva caption — a Meta ignora.
      body: JSON.stringify({ image_url: imageUrl, media_type: 'STORIES', access_token: env.IG_ACCESS_TOKEN })
    });
    var createBody = await createResp.json();
    log.create_status = createResp.status;
    log.create_response = createBody;
    if (!createResp.ok || !createBody.id) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'story: falha ao criar container' });
      return { ok: false, step: 'media', body: createBody };
    }

    var pronto = false;
    for (var i = 0; i < 10; i++) {
      var st = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + createBody.id + '?fields=status_code&access_token=' + encodeURIComponent(env.IG_ACCESS_TOKEN));
      var stBody = await st.json();
      log.container_status = stBody.status_code || stBody;
      if (stBody.status_code === 'FINISHED') { pronto = true; break; }
      if (stBody.status_code === 'ERROR') break;
      await new Promise(function (r) { setTimeout(r, 2000); });
    }
    if (!pronto) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'story: container não ficou pronto' });
      return { ok: false, step: 'container_not_ready', body: log.container_status };
    }

    var pubResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: createBody.id, access_token: env.IG_ACCESS_TOKEN })
    });
    var pubBody = await pubResp.json();
    log.publish_status = pubResp.status;
    log.publish_response = pubBody;
    log.ok = !!(pubResp.ok && pubBody.id);
    log.finished_at = new Date().toISOString();
    await _logInstagramAttempt(env, log);

    if (!log.ok) {
      if (daFila) await _marcaPublicado(env, filaId, { erro: 'story: falha ao publicar' });
      return { ok: false, step: 'media_publish', body: pubBody };
    }

    // Só avança em caso de sucesso — falha tenta o MESMO story no próximo cron.
    if (daFila) await _marcaPublicado(env, filaId, { published_at: new Date().toISOString(), ig_media_id: String(pubBody.id), erro: null });
    else await env.FINN_KV.put('ig_story_last', String(storyIndex));

    return { ok: true, index: storyIndex, fila_id: filaId, media_id: pubBody.id };
  } catch (e) {
    log.ok = false;
    log.error = String(e && e.message || e);
    await _logInstagramAttempt(env, log);
    if (daFila) await _marcaPublicado(env, filaId, { erro: 'story: ' + log.error });
    return { ok: false, error: log.error };
  }
}

// Publica o próximo Reel. Roda no MESMO cron do story (25 min depois do
// post) em vez de ganhar um horário próprio — a conta inteira só tem 5 slots
// de cron trigger no plano gratuito, e os 4 que o finn-app já usa (post,
// story, resumo semanal, contas fixas) mais o 1 do finn-worker do bot já
// fecham a conta. Sem slot novo, o jeito é encostar no que já dispara.
//
// Vídeo demora mais que imagem pra Meta processar, por isso o poll aqui é
// mais longo (até ~40s) que o do story/post (~20s). Isso não estoura o
// limite de CPU do Worker porque a espera é por I/O (setTimeout/fetch), que
// não conta como tempo de CPU — só tempo de parede, que o waitUntil cobre.
async function _publishNextInstagramReel(env) {
  if (!env.IG_ACCESS_TOKEN || !env.IG_BUSINESS_ACCOUNT_ID) {
    return { ok: false, skipped: true, reason: 'IG_ACCESS_TOKEN ou IG_BUSINESS_ACCOUNT_ID não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  var daFila = await _proximoDaFilaPorTipo(env, 'reels');
  if (!daFila) return { ok: false, skipped: true, reason: 'nenhum reel na fila' };

  var filaId = daFila.id;
  var videoUrl = _socialPublicUrl(daFila.image_path);
  var coverUrl = daFila.cover_path ? _socialPublicUrl(daFila.cover_path) : null;
  var caption = daFila.caption || '';

  var log = { tipo: 'reel', fila_id: filaId, video_url: videoUrl, started_at: new Date().toISOString() };
  try {
    var criarPayload = { media_type: 'REELS', video_url: videoUrl, caption: caption, access_token: env.IG_ACCESS_TOKEN };
    if (coverUrl) criarPayload.cover_url = coverUrl;
    var createResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(criarPayload)
    });
    var createBody = await createResp.json();
    log.create_status = createResp.status;
    log.create_response = createBody;
    if (!createResp.ok || !createBody.id) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      await _marcaPublicado(env, filaId, { erro: 'reel: falha ao criar container' });
      return { ok: false, step: 'media', body: createBody };
    }

    var pronto = false;
    for (var i = 0; i < 20; i++) {
      var st = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + createBody.id + '?fields=status_code&access_token=' + encodeURIComponent(env.IG_ACCESS_TOKEN));
      var stBody = await st.json();
      log.container_status = stBody.status_code || stBody;
      if (stBody.status_code === 'FINISHED') { pronto = true; break; }
      if (stBody.status_code === 'ERROR') break;
      await new Promise(function (r) { setTimeout(r, 2000); });
    }
    if (!pronto) {
      log.ok = false;
      await _logInstagramAttempt(env, log);
      await _marcaPublicado(env, filaId, { erro: 'reel: container não ficou pronto' });
      return { ok: false, step: 'container_not_ready', body: log.container_status };
    }

    var pubResp = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + env.IG_BUSINESS_ACCOUNT_ID + '/media_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: createBody.id, access_token: env.IG_ACCESS_TOKEN })
    });
    var pubBody = await pubResp.json();
    log.publish_status = pubResp.status;
    log.publish_response = pubBody;
    log.ok = !!(pubResp.ok && pubBody.id);
    log.finished_at = new Date().toISOString();
    await _logInstagramAttempt(env, log);

    if (!log.ok) {
      await _marcaPublicado(env, filaId, { erro: 'reel: falha ao publicar' });
      return { ok: false, step: 'media_publish', body: pubBody };
    }

    await _marcaPublicado(env, filaId, { published_at: new Date().toISOString(), ig_media_id: String(pubBody.id), erro: null });
    return { ok: true, fila_id: filaId, media_id: pubBody.id };
  } catch (e) {
    log.ok = false;
    log.error = String(e && e.message || e);
    await _logInstagramAttempt(env, log);
    await _marcaPublicado(env, filaId, { erro: 'reel: ' + log.error });
    return { ok: false, error: log.error };
  }
}

async function _logInstagramAttempt(env, log) {
  try {
    var id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    await env.FINN_KV.put('ig_publish_log_' + id, JSON.stringify(log), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch (e) { /* log é best-effort, nunca deve derrubar a publicação */ }
}

// =============================================================================
// TIKTOK — publicação automática via Content Posting API (Direct Post)
// =============================================================================
// Required secrets (wrangler secret put, nunca em [vars]):
//   TT_CLIENT_KEY / TT_CLIENT_SECRET — do app criado em developers.tiktok.com
//     (produtos "Login Kit" + "Content Posting API").
// Diferente do Instagram, o token de acesso do TikTok NÃO é um secret fixo:
// expira em 24h. Depois que o admin autoriza uma vez (/admin/tiktok-connect-url
// -> tela do TikTok -> /tiktok/callback), o access_token e o refresh_token
// ficam guardados no FINN_KV (chave 'tiktok_tokens') e se renovam sozinhos —
// ver _tiktokAccessToken.
const TT_API_BASE = 'https://open.tiktokapis.com/v2';
const TT_REDIRECT_URI = 'https://finn.dev.br/tiktok/callback';

async function _tiktokSalvarTokens(env, dados) {
  if (!env.FINN_KV) return;
  await env.FINN_KV.put('tiktok_tokens', JSON.stringify({
    access_token: dados.access_token,
    refresh_token: dados.refresh_token,
    open_id: dados.open_id,
    expires_at: Date.now() + (Number(dados.expires_in) || 0) * 1000,
    refresh_expires_at: Date.now() + (Number(dados.refresh_expires_in) || 0) * 1000
  }));
}

// Devolve um access_token válido, renovando sozinho quando falta pouco pra
// expirar. Sem token salvo (admin nunca autorizou) ou refresh_token vencido
// (365 dias sem uso), devolve null — quem chama trata como "não conectado".
async function _tiktokAccessToken(env) {
  if (!env.FINN_KV || !env.TT_CLIENT_KEY || !env.TT_CLIENT_SECRET) return null;
  var raw = await env.FINN_KV.get('tiktok_tokens');
  if (!raw) return null;
  var t;
  try { t = JSON.parse(raw); } catch (e) { return null; }
  if (!t.access_token) return null;
  if (Date.now() < t.expires_at - 5 * 60 * 1000) return t.access_token; // 5 min de folga
  if (!t.refresh_token || Date.now() > t.refresh_expires_at) return null;
  try {
    var r = await fetch(TT_API_BASE + '/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'client_key=' + encodeURIComponent(env.TT_CLIENT_KEY) +
        '&client_secret=' + encodeURIComponent(env.TT_CLIENT_SECRET) +
        '&grant_type=refresh_token&refresh_token=' + encodeURIComponent(t.refresh_token)
    });
    var body = await r.json();
    if (!r.ok || !body.access_token) return null;
    await _tiktokSalvarTokens(env, body);
    return body.access_token;
  } catch (e) { return null; }
}

// Publica o próximo vídeo da fila (kind='tiktok'), mesmo padrão do reel do
// Instagram: PULL_FROM_URL (o TikTok baixa sozinho do bucket 'social', sem a
// gente subir o arquivo) -> init -> poll de status -> pronto.
// privacy_level vem de TT_PRIVACY_LEVEL ([vars] no wrangler.toml): apps sem
// auditoria do TikTok só podem postar como SELF_ONLY (só o próprio criador
// vê); depois que a auditoria aprovar, troca a var pra PUBLIC_TO_EVERYONE e
// faz deploy — não precisa mudar código nenhum.
async function _publishNextTikTokVideo(env) {
  var accessToken = await _tiktokAccessToken(env);
  if (!accessToken) {
    return { ok: false, skipped: true, reason: 'TikTok não conectado — autorize em /admin/tiktok-connect-url, ou TT_CLIENT_KEY/TT_CLIENT_SECRET não configurados' };
  }
  if (!env.FINN_KV) return { ok: false, reason: 'FINN_KV não configurado' };

  var daFila = await _proximoDaFilaPorTipo(env, 'tiktok');
  if (!daFila) return { ok: false, skipped: true, reason: 'nenhum vídeo de TikTok na fila' };

  var filaId = daFila.id;
  var videoUrl = _socialPublicUrl(daFila.image_path);
  var caption = daFila.caption || '';
  var privacidade = env.TT_PRIVACY_LEVEL || 'SELF_ONLY';

  var log = { tipo: 'tiktok', fila_id: filaId, video_url: videoUrl, started_at: new Date().toISOString() };
  try {
    var initResp = await fetch(TT_API_BASE + '/post/publish/video/init/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken },
      body: JSON.stringify({
        post_info: { title: caption, privacy_level: privacidade, disable_duet: false, disable_comment: false, disable_stitch: false },
        source_info: { source: 'PULL_FROM_URL', video_url: videoUrl }
      })
    });
    var initBody = await initResp.json();
    log.init_status = initResp.status;
    log.init_response = initBody;
    var publishId = initBody && initBody.data && initBody.data.publish_id;
    if (!initResp.ok || !publishId) {
      log.ok = false;
      await _logTikTokAttempt(env, log);
      await _marcaPublicado(env, filaId, { erro: 'tiktok: falha ao iniciar publicação' });
      return { ok: false, step: 'init', body: initBody };
    }

    var pronto = false, falhou = false, statusBody = null;
    for (var i = 0; i < 20; i++) {
      var stResp = await fetch(TT_API_BASE + '/post/publish/status/fetch/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken },
        body: JSON.stringify({ publish_id: publishId })
      });
      statusBody = await stResp.json();
      var status = statusBody && statusBody.data && statusBody.data.status;
      log.publish_status_check = status;
      if (status === 'PUBLISH_COMPLETE') { pronto = true; break; }
      if (status === 'FAILED') { falhou = true; break; }
      await new Promise(function (r) { setTimeout(r, 2000); });
    }
    log.finished_at = new Date().toISOString();
    log.ok = pronto;
    await _logTikTokAttempt(env, log);

    if (!pronto) {
      await _marcaPublicado(env, filaId, { erro: falhou ? 'tiktok: publicação falhou' : 'tiktok: não confirmou a tempo' });
      return { ok: false, step: 'status', body: statusBody };
    }

    await _marcaPublicado(env, filaId, { published_at: new Date().toISOString(), tiktok_publish_id: publishId, erro: null });
    return { ok: true, fila_id: filaId, publish_id: publishId };
  } catch (e) {
    log.ok = false;
    log.error = String(e && e.message || e);
    await _logTikTokAttempt(env, log);
    await _marcaPublicado(env, filaId, { erro: 'tiktok: ' + log.error });
    return { ok: false, error: log.error };
  }
}

async function _logTikTokAttempt(env, log) {
  try {
    var id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    await env.FINN_KV.put('tiktok_publish_log_' + id, JSON.stringify(log), { expirationTtl: 60 * 60 * 24 * 90 });
  } catch (e) { /* log é best-effort */ }
}

// Busca alcance/curtidas/etc de UMA mídia já publicada, direto na API do
// Instagram. Nunca lança — devolve { erro } quando a Meta recusa (comum em
// stories: a métrica só existe enquanto o story está ativo, 24h; passado
// isso a chamada falha e não tem jeito de recuperar).
async function _igMediaInsights(mediaId, accessToken) {
  var infoR = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + mediaId + '?fields=media_type,media_product_type,timestamp,permalink,caption&access_token=' + encodeURIComponent(accessToken));
  var info = await infoR.json();
  if (!infoR.ok) return { id: mediaId, erro: (info && info.error && info.error.message) || 'falha ao buscar a mídia' };

  var tipo = info.media_product_type || 'FEED';
  // Conjunto conservador por tipo — a Meta recusa a chamada INTEIRA se uma
  // métrica não existir pra aquele media_product_type/versão da API.
  var metricas = tipo === 'REELS' ? 'reach,likes,comments,saved,shares,plays,total_interactions'
    : tipo === 'STORY' ? 'reach,replies'
    : 'reach,likes,comments,saved,shares,total_interactions';

  var insR = await fetch('https://graph.instagram.com/' + IG_API_VERSION + '/' + mediaId + '/insights?metric=' + metricas + '&access_token=' + encodeURIComponent(accessToken));
  var insBody = await insR.json();
  var base = { id: mediaId, tipo: tipo, timestamp: info.timestamp, permalink: info.permalink, caption: (info.caption || '').slice(0, 90) };
  if (!insR.ok) {
    base.erro = (insBody && insBody.error && insBody.error.message) || 'sem métricas (story expirado?)';
    return base;
  }
  var valores = {};
  (insBody.data || []).forEach(function (m) { valores[m.name] = (m.values && m.values[0] && m.values[0].value) || 0; });
  base.metricas = valores;
  return base;
}

// GET /admin/instagram-metrics — desempenho REAL (alcance, curtidas,
// comentários, salvamentos, plays de reel), puxado direto da API do
// Instagram por mídia publicada. Diferente de /admin/instagram-status, que
// só guarda log técnico de sucesso/falha de publicação — isso aqui é o que
// diz se o conteúdo está dando retorno.
//
// Duas fontes de ig_media_id: (1) itens publicados pela fila do Supabase,
// que já gravam o id certinho; (2) a campanha embutida, que não tem linha no
// Supabase — o id mora só no log do KV (ig_publish_log_*), best-effort e com
// TTL de 90 dias.
async function _adminInstagramMetrics(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.IG_ACCESS_TOKEN) return new Response(JSON.stringify({ error: 'IG_ACCESS_TOKEN não configurado' }), { status: 500, headers: cors });

    var idsUnicos = {};

    if (env.SUPABASE_SERVICE_KEY) {
      var filaR = await fetch('${SUPA_URL_SERVER}/rest/v1/social_posts?published_at=not.is.null&ig_media_id=not.is.null&select=ig_media_id&order=published_at.desc&limit=25', {
        headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: 'Bearer ' + env.SUPABASE_SERVICE_KEY }
      });
      if (filaR.ok) (await filaR.json()).forEach(function (i) { idsUnicos[i.ig_media_id] = true; });
    }

    if (env.FINN_KV) {
      var keys = [], cursor;
      do {
        var page = await env.FINN_KV.list({ prefix: 'ig_publish_log_', cursor: cursor });
        keys = keys.concat(page.keys);
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
      keys.sort(function (a, b) { return b.name.localeCompare(a.name); });
      var logs = (await Promise.all(keys.slice(0, 25).map(function (k) { return env.FINN_KV.get(k.name); })))
        .filter(Boolean).map(function (raw) { try { return JSON.parse(raw); } catch (e) { return null; } }).filter(Boolean);
      logs.forEach(function (l) {
        if (l.ok && l.origem === 'embutido' && l.publish_response && l.publish_response.id) idsUnicos[l.publish_response.id] = true;
      });
    }

    var todosIds = Object.keys(idsUnicos).slice(0, 30);
    var resultados = await Promise.all(todosIds.map(function (id) { return _igMediaInsights(id, env.IG_ACCESS_TOKEN); }));
    // Mais recente primeiro — quem não tem timestamp (erro logo na 1ª chamada) vai pro fim.
    resultados.sort(function (a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });

    return new Response(JSON.stringify({ ok: true, total: resultados.length, itens: resultados }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminInstagramMetrics');
  }
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

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

// GET /admin/instagram-embutidos — a campanha embutida, do jeito que o painel
// precisa pra oferecer "publicar de novo": número, arte, legenda e o que já
// saiu. Existe porque o app não tem a lista de legendas (ela vive no worker), e
// duplicá-la no front seria repetir o erro que este trabalho todo veio
// consertar — texto em dois lugares que podem divergir.
async function _adminInstagramEmbutidos(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var proximo = env.FINN_KV ? Number((await env.FINN_KV.get('ig_post_next_index')) || '1') : 1;
    var itens = IG_CAPTIONS.map(function (legenda, i) {
      var n = i + 1;
      return {
        n: n,
        titulo: legenda.split('\\n')[0],
        legenda: legenda,
        post_url: 'https://finn.dev.br/social/post-' + n + '.png',
        // IG_STORY_BASE é const do WORKER, não do build. Interpolar aqui faria o
        // Node procurar a variável no build e quebrar. Referência direta.
        // (o comentário também não pode citar a sintaxe de interpolação: este
        //  arquivo inteiro está dentro de um template literal)
        story_url: IG_STORY_BASE + '/social/story-' + n + '.jpg',
        ja_publicado: n < proximo
      };
    });
    return new Response(JSON.stringify({ ok: true, proximo_index: proximo, itens: itens }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminInstagramEmbutidos');
  }
}

// POST /admin/instagram-publish-next — dispara a publicação do próximo post
// AGORA (só a conta master) — pra testar a integração sem esperar o cron.
// POST /admin/instagram-publish-story-next — dispara UM story na hora e
// devolve a resposta CRUA da Meta.
//
// Existe pra diagnóstico: o cron roda em horário fixo e só deixa rastro no
// log, então descobrir por que um story não sai virava ciclo de esperar,
// olhar log, tentar de novo. Aqui a resposta da Graph API volta inteira no
// corpo — código de erro, subcódigo e mensagem — o que basta pra separar
// "falta permissão no token" de "conta é Creator, não Business" de "a Meta
// não conseguiu baixar a imagem".
async function _adminInstagramPublishStoryNext(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, body.admin_password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var result = await _publishNextInstagramStory(env);
    return new Response(JSON.stringify(result, null, 2), { status: result.ok ? 200 : 502, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminInstagramPublishStoryNext');
  }
}

async function _adminInstagramPublishNext(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, body.admin_password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var result = await _publishNextInstagramPost(env);
    return new Response(JSON.stringify(result), { status: result.ok ? 200 : 502, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminInstagramPublishNext');
  }
}

// GET /admin/tiktok-status — se tem app configurado, se já autorizou (tem
// refresh_token válido) e o histórico recente de publicação.
async function _adminTikTokStatus(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var conectado = false, openId = null;
    if (env.FINN_KV) {
      var raw = await env.FINN_KV.get('tiktok_tokens');
      if (raw) {
        try {
          var t = JSON.parse(raw);
          conectado = !!t.refresh_token && Date.now() < t.refresh_expires_at;
          openId = t.open_id || null;
        } catch (e) {}
      }
    }
    var logs = [];
    if (env.FINN_KV) {
      var keys = [], cursor;
      do {
        var page = await env.FINN_KV.list({ prefix: 'tiktok_publish_log_', cursor: cursor });
        keys = keys.concat(page.keys);
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
      keys.sort(function (a, b) { return b.name.localeCompare(a.name); });
      logs = (await Promise.all(keys.slice(0, 20).map(function (k) { return env.FINN_KV.get(k.name); })))
        .filter(Boolean).map(function (raw) { return JSON.parse(raw); });
    }
    return new Response(JSON.stringify({
      configured: !!(env.TT_CLIENT_KEY && env.TT_CLIENT_SECRET),
      connected: conectado,
      open_id: openId,
      privacy_level: env.TT_PRIVACY_LEVEL || 'SELF_ONLY',
      recent_attempts: logs
    }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminTikTokStatus');
  }
}

// GET /admin/tiktok-connect-url — devolve a URL de autorização do TikTok,
// com um "state" de uso único guardado no KV (10 min) pra /tiktok/callback
// conferir depois — proteção contra CSRF, já que o callback em si não tem
// como levar header de admin (é navegação de página, não fetch).
async function _adminTikTokConnectUrl(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var creds = _adminCreds(request);
    var authUser = await _supaAuth(creds.accessToken);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });
    if (!env.TT_CLIENT_KEY) return new Response(JSON.stringify({ error: 'TT_CLIENT_KEY não configurado' }), { status: 500, headers: cors });
    if (!env.FINN_KV) return new Response(JSON.stringify({ error: 'FINN_KV não configurado' }), { status: 500, headers: cors });

    var state = crypto.randomUUID();
    await env.FINN_KV.put('tiktok_oauth_state_' + state, '1', { expirationTtl: 600 });
    var authUrl = 'https://www.tiktok.com/v2/auth/authorize/?client_key=' + encodeURIComponent(env.TT_CLIENT_KEY) +
      '&scope=' + encodeURIComponent('user.info.basic,video.publish') +
      '&response_type=code&redirect_uri=' + encodeURIComponent(TT_REDIRECT_URI) +
      '&state=' + state;
    return new Response(JSON.stringify({ ok: true, url: authUrl }), { headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminTikTokConnectUrl');
  }
}

// POST /admin/tiktok-publish-next — dispara a publicação do próximo vídeo da
// fila AGORA, pra testar sem esperar o cron. Mesmo padrão do disparo manual
// do Instagram.
async function _adminTikTokPublishNext(request, env) {
  var cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
  try {
    var body = {};
    try { body = JSON.parse(await request.text()); } catch (e0) {}
    var authUser = await _supaAuth(body.access_token);
    if (!authUser || !_isMasterUser(authUser)) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 403, headers: cors });
    if (!(await _masterPasswordGate(request, env, body.admin_password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

    var result = await _publishNextTikTokVideo(env);
    return new Response(JSON.stringify(result), { status: result.ok ? 200 : 502, headers: cors });
  } catch (e) {
    return _serverError(cors, e, '_adminTikTokPublishNext');
  }
}

// GET /tiktok/callback — o TikTok manda o navegador de volta pra cá depois
// que o admin autoriza. SEM header de autenticação (é navegação de página,
// não fetch) — a proteção é o "state" de uso único checado contra o KV.
async function _tiktokOAuthCallback(request, env) {
  var url = new URL(request.url);
  var code = url.searchParams.get('code');
  var state = url.searchParams.get('state');
  var erro = url.searchParams.get('error');
  var pagina = function (titulo, corpo) {
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>' + titulo + '</title>' +
      '<body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#1E293B">' +
      '<h1 style="font-size:20px">' + titulo + '</h1><p>' + corpo + '</p></body>',
      { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY_HEADERS) }
    );
  };
  if (erro) return pagina('Não deu certo', 'O TikTok recusou a autorização (' + erro + '). Pode fechar essa aba e tentar de novo pelo admin do Finn.');
  if (!code || !state) return pagina('Faltou informação', 'O TikTok não mandou o código esperado. Pode fechar essa aba e tentar de novo.');
  if (!env.FINN_KV) return pagina('Erro', 'FINN_KV não configurado.');

  var estadoValido = await env.FINN_KV.get('tiktok_oauth_state_' + state);
  if (!estadoValido) return pagina('Link expirado', 'Esse link de autorização já expirou ou já foi usado. Volta no admin do Finn e clica em "Conectar" de novo.');
  await env.FINN_KV.delete('tiktok_oauth_state_' + state);

  if (!env.TT_CLIENT_KEY || !env.TT_CLIENT_SECRET) return pagina('Erro', 'TT_CLIENT_KEY/TT_CLIENT_SECRET não configurados no worker.');

  try {
    var r = await fetch(TT_API_BASE + '/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'client_key=' + encodeURIComponent(env.TT_CLIENT_KEY) +
        '&client_secret=' + encodeURIComponent(env.TT_CLIENT_SECRET) +
        '&code=' + encodeURIComponent(code) +
        '&grant_type=authorization_code' +
        '&redirect_uri=' + encodeURIComponent(TT_REDIRECT_URI)
    });
    var body = await r.json();
    if (!r.ok || !body.access_token) return pagina('Não deu certo', 'O TikTok recusou trocar o código (' + (body.error_description || body.error || 'erro desconhecido') + ').');
    await _tiktokSalvarTokens(env, body);
    return pagina('Conectado!', 'A conta do TikTok foi conectada ao Finn. Pode fechar essa aba e voltar pro admin.');
  } catch (e) {
    return pagina('Erro', 'Falha de conexão com o TikTok: ' + String(e && e.message || e));
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
// Pausa entre chamadas sucessivas à brapi dentro de UM carregamento de lote.
// Sem isso, 15 requisições disparadas de fio a pinho tropeçam no rate limit
// do PRÓPRIO fornecedor — visto na prática: de 15 papéis, só 4 vieram na
// primeira versão sem pausa. 350ms × 14 intervalos soma ~5s no pior caso, que
// é aceitável pra uma tela que já mostra progresso.
var SCREENER_ESPACO_MS = 350;
// Teto da espera de retry em cima do Retry-After que o fornecedor manda —
// existe pra um Retry-After abusivo (ou mal formatado) não travar o request
// inteiro esperando.
var SCREENER_RETRY_MAX_MS = 4000;

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
// Le palavras-chave no corpo de erro da brapi e devolve o motivo real, ou
// null se o corpo não ajudar a decidir (nesse caso quem chamou cai no
// default de cada situação). Existia só dentro do ramo "200 com erro"; agora
// também roda no 401/403, porque a brapi usa ESSES status tanto pra "token
// mesmo errado" quanto pra "token válido, mas este ticker não está no seu
// plano" — sem ler o corpo, os dois casos ficavam indistinguíveis e o
// segundo (o mais comum na prática) virava "screener indisponível", uma
// mensagem que soa a app quebrado quando o problema é o plano de dados.
function _screenerClassificaCorpo(corpo, status) {
  if (!corpo || typeof corpo !== 'object') return null;
  var msg = String(corpo.message || corpo.error || '').toLowerCase();
  if (!msg) return null;
  // Palavras plausíveis pra "este dado é de plano pago", em pt e en — a
  // brapi.dev está bloqueada nesta rede, então não dá pra confirmar a
  // mensagem exata que ela usa. Lista ampla de propósito, e o texto cru vai
  // pro console.error de qualquer forma: se nenhuma palavra bater, quem olhar
  // o log (wrangler tail) vê a frase real e dá pra ajustar aqui depois.
  var indicaPlano = ['plan', 'plano', 'free', 'gratuit', 'upgrade', 'pro ', 'subscri', 'assinatura', 'restri'];
  for (var i = 0; i < indicaPlano.length; i++) { if (msg.indexOf(indicaPlano[i]) !== -1) return { ok: false, motivo: 'plano', status: status }; }
  if (msg.indexOf('limit') !== -1 || msg.indexOf('rate') !== -1) return { ok: false, motivo: 'rate_limit_fornecedor', status: status, retryAfter: 60 };
  if (msg.indexOf('token') !== -1) return { ok: false, motivo: 'token_recusado', status: status };
  return null;
}

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
      // a forma de query antes de desistir.
      if (t === 0) continue;
      // A segunda recusa NÃO é automaticamente "token errado": a brapi devolve
      // 401/403 (não 402) também quando o TOKEN É VÁLIDO mas o TICKER está
      // fora do que o plano libera — visto na prática, com o mesmo token
      // aceitando alguns papéis e recusando outros sempre. Sem checar o
      // corpo aqui, isso virava "screener indisponível" pros 11 de 15 que
      // caem nesse caso, uma mensagem que soa a app quebrado quando o
      // problema é o plano de dados, não o código.
      var classificado = _screenerClassificaCorpo(corpo, resp.status);
      if (classificado) {
        console.error('[screener] brapi recusou (' + resp.status + ', classificado como ' + classificado.motivo + '):', _screenerRedige(texto.slice(0, 200), env.BRAPI_TOKEN));
        return classificado;
      }
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
      var classificadoOk = _screenerClassificaCorpo(corpo, resp.status);
      console.error('[screener] brapi devolveu erro no corpo:', _screenerRedige(String(corpo.message || corpo.error || '').slice(0, 200), env.BRAPI_TOKEN));
      return classificadoOk || { ok: false, motivo: 'nao_encontrado', status: resp.status };
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
// Mapa único de motivo -> mensagem. Existia só dentro de _screenerErro (rota
// individual) e a rota de lote (_screenerLote) NÃO usava: todo papel que
// falhava recebia a mesma frase genérica ("não deu pra buscar este papel
// agora"), não importa se foi 404, timeout ou rate limit do FORNECEDOR — três
// causas que pedem ação diferente do usuário. Extraído pra ser a fonte única
// dos dois caminhos.
function _screenerMotivoInfo(ticker, busca) {
  var mapa = {
    nao_encontrado: { status: 404, tipo: 'nao_encontrado', msg: 'Não achamos o papel ' + ticker + ' na B3 agora.' },
    plano: { status: 503, tipo: 'fonte_limitada', msg: 'Os indicadores completos precisam de um plano de dados que ainda não temos.' },
    rate_limit_fornecedor: { status: 429, tipo: 'muitas_consultas', msg: 'O provedor de cotações limitou as consultas agora. Tente de novo em instantes.' },
    // "Indisponível" some por padrão parecer pane geral; se o token estivesse
    // mesmo errado, os 15 papéis falhariam igual — quando só alguns falham
    // sempre e outros sempre passam, é mais provável ser plano (ver
    // _screenerClassificaCorpo) do que token. Esta mensagem só aparece quando
    // o corpo do erro não deu pista nenhuma pra classificar melhor.
    token_recusado: { status: 503, tipo: 'indisponivel', msg: 'O provedor recusou a consulta deste papel — pode ser token inválido ou este papel específico fora do que o plano de dados libera.' },
    rede: { status: 504, tipo: 'indisponivel', msg: 'Não conseguimos falar com a fonte de cotações agora — pode ter sido lentidão ou fora do ar.' }
  };
  return mapa[busca.motivo] || { status: 502, tipo: 'indisponivel', msg: 'Não conseguimos carregar as cotações agora.' };
}

function _screenerErro(cors, ticker, busca) {
  var e = _screenerMotivoInfo(ticker, busca);
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

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
      // Espaçamento ANTES de cada chamada externa (menos a primeira). 15
      // requisições em sequência sem pausa nenhuma é o padrão clássico que
      // dispara o rate limit do PRÓPRIO FORNECEDOR (não o nosso — o nosso é o
      // _rateLimit logo acima, e 40/5min não bloquearia isso). Fica FORA do
      // teto de tempo do request: é espera, não CPU, e o Worker não cobra por
      // isso — só soma no tempo de resposta, que aceitamos em troca de não
      // perder metade da lista por 429 do provedor.
      if (i > 0) await new Promise(function (r) { setTimeout(r, SCREENER_ESPACO_MS); });

      var busca = await _brapiBusca(env, ticker);
      // Uma segunda tentativa, só quando o motivo é EXPLICITAMENTE rate limit
      // do fornecedor: espera o Retry-After (limitado, pra não estourar o
      // tempo do request) e tenta de novo uma vez. Os outros motivos (404,
      // token, plano) não se resolvem repetindo.
      if (!busca.ok && busca.motivo === 'rate_limit_fornecedor') {
        var espera = Math.min((busca.retryAfter || 2) * 1000, SCREENER_RETRY_MAX_MS);
        await new Promise(function (r) { setTimeout(r, espera); });
        busca = await _brapiBusca(env, ticker);
      }
      if (!busca.ok) {
        if (guardado) itens.push({ ticker: ticker, cru: guardado.cru, cache: { hit: true, idadeSegundos: idade, stale: true, motivo: 'fonte indisponível agora — mostrando o último dado guardado' } });
        else {
          var infoErro = _screenerMotivoInfo(ticker, busca);
          itens.push({ ticker: ticker, cru: null, erro: { tipo: infoErro.tipo, mensagem: infoErro.msg } });
        }
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
    if (!(await _masterPasswordGate(request, env, creds.password))) return new Response(JSON.stringify({ error: 'senha de admin incorreta' }), { status: 403, headers: cors });

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
    // Passado o teto, o contador sobe mais um pouco (pro painel mostrar que
    // houve enxurrada) e para. O limite antigo de MAX_DIA*10 ainda deixava
    // 500x2 + 4.500 = 5.500 escritas por dia — 5,5x a cota gratis do KV, ou
    // seja, um scanner pedindo caminhos aleatorios ainda conseguia queimar a
    // cota inteira em minutos, que e exatamente o que este teto existe pra
    // impedir. O corte agora e logo acima do teto de detalhe.
    if (jaHoje >= SEC_LOG_MAX_DIA) {
      if (jaHoje < SEC_LOG_MAX_DIA + 100) {
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
    // Um handler só, bem no começo: preflight que cai aqui nunca chega nas
    // rotas, então liberar header por rota mais abaixo não funciona — foi
    // assim que o X-Sheet-Token da planilha ficou de fora na primeira versão.
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Password, X-Sheet-Token',
          'Access-Control-Max-Age': '86400',
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

<h2><span class="num">06</span> Planilha Finn (Google Sheets)</h2>
<p>Se você conectar a Planilha Finn, é gerado um <strong>token</strong> que autoriza somente duas coisas: ler os seus lançamentos e gravar novos lançamentos na sua conta. Ele não dá acesso a configurações, a dados de outras pessoas nem à área administrativa.</p>
<p>Guardamos apenas o token e a identificação da sua conta, para saber a quem ele pertence. <strong>Não temos acesso à sua planilha</strong> nem ao seu Google Drive — quem lê e escreve é um script que roda dentro da sua própria conta do Google.</p>
<p>Você revoga o token quando quiser, em Configurações → Planilha Finn → Desconectar. A revogação vale na hora.</p>

<h2><span class="num">07</span> Aba Aprender</h2>
<p>O conteúdo educativo é o mesmo para todo mundo e <strong>não é personalizado com base em perfil</strong>. As caixas "No seu Finn" fazem os cálculos no seu próprio dispositivo, com os dados que já estão na sua conta; nada é enviado para lugar nenhum por causa disso.</p>
<p>O progresso das lições fica salvo <strong>no seu navegador</strong>, não no servidor.</p>

<h2><span class="num">08</span> Registros de segurança</h2>
<p>Para proteger as contas, registramos tentativas de acesso suspeitas — como varredura automatizada por endereços que não existem no site, ou repetidas senhas incorretas na área administrativa. Guardamos o horário, o caminho acessado, o navegador informado, o país e uma <strong>versão parcial do endereço de IP</strong> (por exemplo <em>189.45.x.x</em>), nunca o endereço completo.</p>
<p>Esses registros existem apenas para detectar abuso, não são usados para perfilar pessoas nem cruzados com sua conta, e são <strong>apagados automaticamente após 30 dias</strong>.</p>

<h2><span class="num">09</span> Seus direitos</h2>
<div class="notice"><strong>Você está no controle.</strong><br>Pode solicitar a exclusão de todos os seus dados a qualquer momento em <a href="/deletar-dados">finn.dev.br/deletar-dados</a> — sem perguntas, sem retenção.</div>

<h2><span class="num">10</span> Contato</h2>
<p>Dúvidas sobre privacidade? Escreva para <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a> e respondemos em até 48h.</p>
</article>\`;
      return new Response(legalShell('privacidade', 'Política de Privacidade', 'Documento legal', body), { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY_HEADERS) });
    }

    if (url.pathname === '/termos') {
      const body = \`<article class="card">
<h2><span class="num">01</span> Aceitação</h2>
<p>Ao usar o Finn, você concorda com estes Termos. Se não concordar, não utilize o serviço.</p>

<h2><span class="num">02</span> O serviço</h2>
<p>O Finn é um aplicativo de <strong>controle financeiro pessoal</strong>. Existe um plano gratuito e planos pagos (Plus e Pro), com recursos diferentes em cada um. Reservamo-nos o direito de modificar ou encerrar o serviço a qualquer momento, com aviso prévio razoável.</p>
<p>Durante o período de testes, todos os recursos podem estar liberados em qualquer plano. Quando a cobrança começar, você será avisado antes, e os limites de cada plano passam a valer.</p>

<h2><span class="num">03</span> Planos e pagamento</h2>
<p>Os planos pagos são cobrados mensalmente. Você pode cancelar quando quiser, e o acesso continua até o fim do período já pago — não há multa nem fidelidade.</p>
<p>O <strong>plano gratuito não tem prazo para acabar</strong>. A aba <strong>Aprender</strong>, com o conteúdo de educação financeira, é gratuita em todos os planos.</p>

<h2><span class="num">04</span> Conteúdo educativo</h2>
<p>O Finn oferece material de <strong>educação financeira</strong> com finalidade informativa: explicar como conceitos funcionam para que você decida melhor.</p>
<p>Esse conteúdo <strong>não é recomendação de investimento, consultoria ou análise de valores mobiliários</strong>, atividades reguladas pela CVM (Resoluções CVM 19 e 20, de 2021). O Finn não indica produto financeiro, corretora ou instituição, não sugere momento de compra ou venda, não promete rentabilidade e não recebe comissão de nenhuma delas.</p>
<p>O material inclui explicações sobre instrumentos de investimento, tributação e proteção ao investidor. A finalidade é <strong>descrever como esses mecanismos funcionam</strong>, para que você avalie as ofertas que receber. Nenhuma parte dele é dirigida ao seu caso particular.</p>
<p>Regras tributárias, limites de isenção e coberturas de garantia mudam com frequência. Os valores citados servem de exemplo; confirme a norma vigente na fonte oficial antes de decidir.</p>
<p>Valores, taxas e exemplos citados servem para ilustrar mecanismos e mudam com o tempo. Confira sempre as condições reais antes de decidir.</p>

<h2><span class="num">05</span> Responsabilidade dos dados</h2>
<p>Você é responsável pela precisão dos dados que insere no app. O Finn não se responsabiliza por decisões financeiras tomadas com base nas análises do aplicativo.</p>
<p>As análises com IA são <strong>informativas</strong> e não constituem aconselhamento financeiro profissional.</p>

<h2><span class="num">06</span> Planilha Finn e integrações</h2>
<p>A Planilha Finn é um arquivo do Google Sheets fornecido como parte do plano Pro. Ela funciona de forma independente do aplicativo; a sincronização é opcional.</p>
<p>Ao conectar a planilha, é gerado um <strong>token de acesso</strong> que permite ler e gravar lançamentos na sua conta — e nada além disso. Você pode revogá-lo a qualquer momento nas Configurações. <strong>Guardar esse token em segurança é responsabilidade sua</strong>; quem tiver o token consegue ver e criar lançamentos na sua conta.</p>
<p>O mesmo vale para a vinculação com WhatsApp e Telegram: são canais opcionais, que você conecta e desconecta quando quiser.</p>

<h2><span class="num">07</span> Uso adequado</h2>
<p>É proibido usar o Finn para fins ilegais, tentativas de acesso não autorizado à plataforma ou uso que prejudique outros usuários.</p>

<h2><span class="num">08</span> Disponibilidade</h2>
<p>O Finn é fornecido <strong>"como está"</strong>, sem garantias de disponibilidade ininterrupta. Fazemos o melhor para manter o serviço estável, mas não garantimos 100% de uptime.</p>

<h2><span class="num">09</span> Contato</h2>
<p>Dúvidas, sugestões ou reclamações: <a href="mailto:Finn.controle01@gmail.com">Finn.controle01@gmail.com</a></p>
</article>\`;
      return new Response(legalShell('termos', 'Termos de Serviço', 'Documento legal', body), { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY_HEADERS) });
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
      return new Response(legalShell('deletar-dados', 'Excluir meus dados', 'Direito do titular', body), { headers: Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY_HEADERS) });
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
        // Teto de rajada por IP. Ficava ANTES da autenticacao, e por isso
        // gravava no KV a cada requisicao — bastava um curl em loop com o
        // header Origin certo (Origin e so um header, nao prova nada fora do
        // navegador) pra queimar a cota gratis de escrita do KV em menos de
        // uma hora, derrubando junto push, log de seguranca, indice do
        // Instagram e os proprios rate limits, que gravam no mesmo lugar.
        // Agora so usuario autenticado chega aqui, entao ninguem sem login
        // consegue gastar escrita.
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
        // Log de uso pro painel de admin (saldo/quantidade/custo por chamada).
        // Fora do caminho crítico de propósito: se o Supabase estiver fora do
        // ar, quem pediu a análise não pode ficar sem resposta por causa de
        // uma escrita de auditoria que não afeta o resultado dela.
        if (aiResp.ok && ctx && ctx.waitUntil) {
          ctx.waitUntil(_logAiUsage(env, aiUser.id, aiPayload.model, aiText));
        }
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
    if (url.pathname === '/admin/ai-usage' && request.method === 'GET') {
      return _adminAiUsage(request, env);
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
        // Era o unico ponto do arquivo que devolvia e.message cru, furando a
        // politica do _serverError: falha do KV ou do fetch pro Supabase saia
        // com o texto interno pro cliente. JSON malformado tambem virava 500
        // (deveria ser 400), o que confunde diagnostico.
        console.error('[push/subscribe]', e && e.message);
        var ehJson = e instanceof SyntaxError;
        return new Response(JSON.stringify({ error: ehJson ? 'corpo invalido' : 'nao consegui registrar a inscricao' }),
          { status: ehJson ? 400 : 500, headers: cors2 });
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
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        }, SECURITY_HEADERS),
      });
    }

    // ── Guia de uso ──
    if (url.pathname === '/guia' || url.pathname === '/guia.html') {
      return new Response(${JSON.stringify(guia)}, {
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        }, SECURITY_HEADERS),
      });
    }

    // ── Beta: inscrição de novos testers ──
    if (url.pathname === '/beta' || url.pathname === '/beta.html') {
      return new Response(${JSON.stringify(beta)}, {
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        }, SECURITY_HEADERS),
      });
    }
    // Planilha do Finn (Google Sheets). O preflight destas rotas é atendido
    // pelo handler de OPTIONS lá em cima, que já libera X-Sheet-Token.
    if (url.pathname === '/billing/comprar-planilha' && request.method === 'POST') {
      return _comprarPlanilha(request, env);
    }
    if (url.pathname === '/planilha/baixar' && request.method === 'GET') {
      return _baixarPlanilha(request, env);
    }
    if (url.pathname === '/billing/planilha-status' && request.method === 'GET') {
      return _statusPlanilha(request, env);
    }

    if (url.pathname === '/sheets/token' && request.method === 'POST') {
      return _sheetsToken(request, env);
    }
    if (url.pathname === '/sheets/token' && request.method === 'DELETE') {
      return _sheetsTokenRevogar(request, env);
    }
    if (url.pathname === '/sheets/pull' && request.method === 'GET') {
      return _sheetsPull(request, env);
    }
    if (url.pathname === '/sheets/push' && request.method === 'POST') {
      return _sheetsPush(request, env);
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
    // ── Questionário antes do link do beta ──
    if (url.pathname === '/beta-questionario' || url.pathname === '/beta-questionario.html') {
      return new Response(${JSON.stringify(betaQuestionario)}, {
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        }, SECURITY_HEADERS),
      });
    }
    if (url.pathname === '/beta-questionario/enviar' && request.method === 'POST') {
      return _betaQuestionario(request, env);
    }
    if (url.pathname === '/admin/beta-questionario' && request.method === 'GET') {
      return _adminBetaQuestionario(request, env);
    }
    if (url.pathname === '/admin/meta-ads' && request.method === 'GET') {
      return _adminMetaAds(request, env, ctx);
    }
    if (url.pathname === '/admin/intrusions' && request.method === 'GET') {
      return _adminIntrusions(request, env);
    }
    if (url.pathname === '/admin/planilha-link' && (request.method === 'GET' || request.method === 'POST')) {
      return _adminPlanilhaLink(request, env);
    }
    if (url.pathname === '/admin/instagram-status' && request.method === 'GET') {
      return _adminInstagramStatus(request, env);
    }
    if (url.pathname === '/admin/instagram-metrics' && request.method === 'GET') {
      return _adminInstagramMetrics(request, env);
    }
    if (url.pathname === '/admin/instagram-embutidos' && request.method === 'GET') {
      return _adminInstagramEmbutidos(request, env);
    }
    if (url.pathname === '/admin/instagram-publish-next' && request.method === 'POST') {
      return _adminInstagramPublishNext(request, env);
    }

    if (url.pathname === '/admin/instagram-publish-story-next' && request.method === 'POST') {
      return _adminInstagramPublishStoryNext(request, env);
    }

    if (url.pathname === '/admin/tiktok-status' && request.method === 'GET') {
      return _adminTikTokStatus(request, env);
    }
    if (url.pathname === '/admin/tiktok-connect-url' && request.method === 'GET') {
      return _adminTikTokConnectUrl(request, env);
    }
    if (url.pathname === '/admin/tiktok-publish-next' && request.method === 'POST') {
      return _adminTikTokPublishNext(request, env);
    }
    // Rota pública — o TikTok redireciona o navegador do admin pra cá depois
    // da autorização, sem nenhum header nosso (ver comentário na função).
    if (url.pathname === '/tiktok/callback') {
      return _tiktokOAuthCallback(request, env);
    }

    // ── Pitch decks ──
    if (url.pathname === '/investidores') {
      return new Response(${JSON.stringify(pitchInv)}, {
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
        }, SECURITY_HEADERS),
      });
    }
    if (url.pathname === '/usuarios') {
      return new Response(${JSON.stringify(pitchUsr)}, {
        headers: Object.assign({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
          'X-Robots-Tag': 'noindex, nofollow',
        }, SECURITY_HEADERS),
      });
    }

    // ── /favicon.ico e /.well-known/assetlinks.json: pedido automático, não ataque ──
    // Os dois caíam no catch-all e entravam no painel como "tentativa de
    // acesso". Não são:
    //
    //   /favicon.ico — o HTML já declara o ícone como data: URI inline, mas
    //   navegador (e crawler, e prévia de link) pede /favicon.ico por padrão
    //   de qualquer jeito. 13 registros em 7 dias vinham só disso.
    //
    //   /.well-known/assetlinks.json — Digital Asset Links, o arquivo que o
    //   Android/Chrome busca pra verificar associação entre site e app ao
    //   instalar um PWA. Sozinho eram 58 registros em 7 dias, e os endereços
    //   66.102.x.x / 74.125.x.x que apareciam no topo do painel com "1
    //   caminho" cada são faixas da Google — ou seja, o próprio Android
    //   conferindo o PWA, contado como invasor. O Finn não tem app Android
    //   publicado, então a resposta correta é uma lista vazia (que é resposta
    //   VÁLIDA do padrão, significando "nenhum app associado") com cache
    //   longo, em vez de 404 sem cache que faz o Android insistir pra sempre.
    if (url.pathname === '/favicon.ico') {
      var favBytes = Uint8Array.from(atob(${JSON.stringify(icon192)}), function(c){ return c.charCodeAt(0); });
      return new Response(favBytes, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=604800' }
      });
    }
    if (url.pathname === '/.well-known/assetlinks.json') {
      return new Response('[]', {
        headers: Object.assign({ 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400' }, SECURITY_HEADERS),
      });
    }

    // ── /robots.txt e /.well-known/security.txt: convenção da web, não ataque ──
    // O catch-all logo abaixo trata qualquer caminho fora de '/' e
    // '/index.html' como tentativa de intrusão — certo pra scanner, errado
    // pra estes dois: todo crawler de verdade (Google, Bing, prévia de link)
    // pede /robots.txt, e /.well-known/security.txt é o padrão RFC 9116 pelo
    // qual um PESQUISADOR DE SEGURANÇA DE BOA-FÉ acha como reportar uma falha
    // com responsabilidade. Contar isso como "tentativa de acesso" inflava o
    // painel com ruído (visto na prática: 9 → 13 em 24h só com esses dois) e,
    // pra security.txt, é irônico — um app que se gaba de detectar intrusão
    // tratando como ataque o canal formal de quem quer AVISAR sobre uma.
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\\nAllow: /\\n', {
        headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }, SECURITY_HEADERS),
      });
    }
    if (url.pathname === '/.well-known/security.txt') {
      // Expires é campo obrigatório do RFC 9116. Calculado NA REQUISIÇÃO (o
      // Worker chama Date normalmente em runtime, sem a restrição que existe
      // só no sandbox de orquestração) — assim fica sempre 1 ano à frente de
      // agora, em vez de congelado na data do último deploy.
      var expira = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
      return new Response(
        'Contact: mailto:contato@finn.dev.br\\n' +
        'Expires: ' + expira + '\\n' +
        'Preferred-Languages: pt-BR, en\\n',
        { headers: Object.assign({ 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }, SECURITY_HEADERS) }
      );
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
    if (event.cron === '0 13,21 * * *') {
      // Instagram, 2 posts por dia: 10:00 e 18:00 BRT (13:00 e 21:00 UTC).
      //
      // Guard de idempotência por SLOT (dia + hora), não só por dia: a
      // Cloudflare pode reexecutar um evento de cron, e sem isso uma
      // reexecução às 13:00 consumiria o post das 18:00 — a fila andaria
      // sozinha e o feed ficaria com dois posts na mesma hora.
      ctx.waitUntil((async () => {
        var agora = new Date();
        var slot = agora.toISOString().slice(0, 10) + '_' + String(agora.getUTCHours()).padStart(2, '0');
        if (env.FINN_KV) {
          var jaFoi = await env.FINN_KV.get('ig_slot_' + slot);
          if (jaFoi) return;
          await env.FINN_KV.put('ig_slot_' + slot, agora.toISOString(), { expirationTtl: 60 * 60 * 24 * 7 });
        }
        await _publishNextInstagramPost(env);
      })());
    } else if (event.cron === '25 13,21 * * *') {
      // Stories, 25 min depois do post. Mesmo guard por slot (dia + hora) do
      // feed: a Cloudflare pode reexecutar um evento, e sem isso uma
      // reexecução consumiria o story seguinte.
      ctx.waitUntil((async () => {
        var agora = new Date();
        var slot = agora.toISOString().slice(0, 10) + '_' + String(agora.getUTCHours()).padStart(2, '0');
        if (env.FINN_KV) {
          var jaFoi = await env.FINN_KV.get('ig_story_slot_' + slot);
          if (jaFoi) return;
          await env.FINN_KV.put('ig_story_slot_' + slot, agora.toISOString(), { expirationTtl: 60 * 60 * 24 * 7 });
        }
        await _publishNextInstagramStory(env);
        // Reel não tem cron próprio (ver comentário em _publishNextInstagramReel)
        // — encosta neste mesmo disparo, depois do story. TikTok também não
        // tem slot livre (5 crons é o limite da conta) — encosta aqui também.
        await _publishNextInstagramReel(env);
        await _publishNextTikTokVideo(env);
      })());
    } else if (event.cron === '0 23 * * 1') {
      ctx.waitUntil(sendWeeklySummary(env));
    } else {
      // "0 12 * * *" (09:00 BRT) — contas fixas e assinaturas vencidas.
      //
      // Histórico da automação do Instagram: ela já foi desligada uma vez,
      // porque 30 dias rodando deram 230 visualizações no total, com quase
      // todo post abaixo de 12. Foi RELIGADA a pedido, agora 2x por dia (ver
      // o primeiro ramo). Se o alcance continuar nesse patamar, o gargalo não
      // é frequência de publicação — é distribuição, e mais post não resolve.
      ctx.waitUntil(checkFixedDueAndNotify(env));
      ctx.waitUntil(checkExpiredSubscriptions(env));
    }
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB) | ETag: ' + etag);

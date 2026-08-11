// GET /whatsapp/templates — a rota que diz se o Message Template do resumo
// diário já foi aprovado pela Meta. Como graph.facebook.com não é alcançável
// daqui, o teste mocka a resposta da Meta e verifica o que de fato depende de
// nós: o gate de admin, o veredito certo pra cada status, e o fato de a
// resposta crua nunca ser engolida quando a chamada falha.
import bot from '../finn-worker/index.js';

let falhas = 0;
const ok = (c, nome, extra) => { console.log((c ? '  ok   ' : '  FALHA') + ' ' + nome + (extra !== undefined ? '  — ' + extra : '')); if (!c) falhas++; };
const realFetch = global.fetch;
const ctx = { waitUntil: (p) => p };

const ENV_BASE = {
  ADMIN_TOKEN: 'token-secreto',
  WHATSAPP_WABA_ID: '123456',
  WHATSAPP_ACCESS_TOKEN: 'meta-token',
  MASTER_ADMIN_PASSWORD: 'senha-master',
};

// Finge a Graph API devolvendo a lista de templates que o teste quiser.
function mockMeta(templates, { status = 200, corpo } = {}) {
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('graph.facebook.com') && u.includes('message_templates')) {
      return new Response(JSON.stringify(corpo || { data: templates }), { status });
    }
    if (u.includes('/auth/v1/user')) {
      return new Response(JSON.stringify({ id: 'u1', email: 'finn.controle01@gmail.com' }), { status: 200 });
    }
    return realFetch(url, opts);
  };
}

const chamar = (env, headers) => bot.fetch(
  new Request('https://x/whatsapp/templates', { method: 'GET', headers: headers || { 'X-Admin-Token': 'token-secreto' } }),
  env, ctx
);

// ══════════════════════════════════════════════════════════════════════
console.log('=== 1. a rota é fechada ===');
{
  mockMeta([]);
  const semNada = await chamar(ENV_BASE, {});
  ok(semNada.status === 401, 'sem credencial -> 401', semNada.status);

  const tokenErrado = await chamar(ENV_BASE, { 'X-Admin-Token': 'chute' });
  ok(tokenErrado.status === 401, 'token errado -> 401', tokenErrado.status);

  const comToken = await chamar(ENV_BASE);
  ok(comToken.status === 200, 'X-Admin-Token certo -> 200', comToken.status);

  // O caminho que o botão do app usa: sessão do Supabase + senha master.
  const comSessao = await chamar(ENV_BASE, {
    'Authorization': 'Bearer tok-supabase',
    'X-Admin-Password': 'senha-master',
  });
  ok(comSessao.status === 200, 'sessão do master + senha master -> 200 (é o que o botão manda)', comSessao.status);

  const senhaErrada = await chamar(ENV_BASE, {
    'Authorization': 'Bearer tok-supabase',
    'X-Admin-Password': 'senha-chutada',
  });
  ok(senhaErrada.status === 401, 'senha master errada -> 401', senhaErrada.status);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 2. cada status vira um veredito que decide alguma coisa ===');
{
  const casos = [
    {
      nome: 'PENDING',
      templates: [{ name: 'resumo_diario_finn', status: 'PENDING', language: 'pt_BR', category: 'UTILITY' }],
      env: ENV_BASE,
      espera: /ANÁLISE/i,
    },
    {
      nome: 'APPROVED sem a secret ligada',
      templates: [{ name: 'resumo_diario_finn', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY' }],
      env: ENV_BASE,
      // Aprovado não é o fim: sem a secret o resumo continua só no Telegram.
      espera: /NÃO LIGADO/i,
    },
    {
      nome: 'APPROVED com a secret ligada',
      templates: [{ name: 'resumo_diario_finn', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY' }],
      env: { ...ENV_BASE, DAILY_DASHBOARD_TEMPLATE_NAME: 'resumo_diario_finn' },
      espera: /JÁ LIGADO/i,
    },
    {
      nome: 'REJECTED',
      templates: [{ name: 'resumo_diario_finn', status: 'REJECTED', language: 'pt_BR', category: 'UTILITY', rejected_reason: 'INVALID_FORMAT' }],
      env: ENV_BASE,
      espera: /REJEITADO/i,
    },
    {
      nome: 'template nem existe',
      templates: [{ name: 'outra_coisa', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY' }],
      env: ENV_BASE,
      espera: /NÃO EXISTE/i,
    },
  ];

  for (const caso of casos) {
    mockMeta(caso.templates);
    const r = await chamar(caso.env);
    const j = await r.json();
    ok(caso.espera.test(j.veredito || ''), caso.nome + ' -> veredito certo', JSON.stringify(j.veredito));
  }
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 3. o motivo da rejeição aparece (é o que o Manager esconde) ===');
{
  mockMeta([{ name: 'resumo_diario_finn', status: 'REJECTED', language: 'pt_BR', category: 'UTILITY', rejected_reason: 'PROMOTIONAL' }]);
  const j = await (await chamar(ENV_BASE)).json();
  ok(j.resumo_diario_finn[0].motivo_rejeicao === 'PROMOTIONAL', 'motivo_rejeicao vem preenchido', JSON.stringify(j.resumo_diario_finn));
  global.fetch = realFetch;

  // NONE é o valor que a Meta manda pra template não rejeitado; virar campo
  // no JSON só faria parecer que existe um motivo onde não existe.
  mockMeta([{ name: 'resumo_diario_finn', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY', rejected_reason: 'NONE' }]);
  const j2 = await (await chamar(ENV_BASE)).json();
  ok(j2.resumo_diario_finn[0].motivo_rejeicao === undefined, 'rejected_reason=NONE não vira motivo', JSON.stringify(j2.resumo_diario_finn));
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 4. quando a Meta recusa, a resposta crua tem que vir junto ===');
{
  mockMeta(null, { status: 400, corpo: { error: { message: '(#200) Permissions error', code: 200 } } });
  const r = await chamar(ENV_BASE);
  const j = await r.json();
  ok(r.status === 200, 'a rota responde 200 (o erro está no corpo, não no status)', r.status);
  ok(j.ok === false, 'ok=false', j.ok);
  ok(j.http === 400, 'http da Meta preservado', j.http);
  ok(/NÃO CONSEGUI CONSULTAR/i.test(j.veredito || ''), 'veredito diz que não deu pra consultar', j.veredito);
  ok(JSON.stringify(j.meta_response || '').includes('Permissions error'), 'mensagem crua da Meta preservada', JSON.stringify(j.meta_response));
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 5. sem WABA_ID configurado a rota não finge que consultou ===');
{
  mockMeta([]);
  const r = await chamar({ ...ENV_BASE, WHATSAPP_WABA_ID: undefined });
  ok(r.status === 500, 'sem WHATSAPP_WABA_ID -> 500', r.status);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 6. CORS: o botão do app chama de outra origem ===');
{
  mockMeta([{ name: 'resumo_diario_finn', status: 'PENDING', language: 'pt_BR', category: 'UTILITY' }]);
  const r = await chamar(ENV_BASE);
  const permitidos = (r.headers.get('Access-Control-Allow-Headers') || '').toLowerCase();
  ok(r.headers.get('Access-Control-Allow-Origin') === '*', 'Allow-Origin presente');
  // Sem estes dois no preflight, o navegador barra a chamada do botão antes
  // mesmo de o worker ver a requisição.
  ok(permitidos.includes('authorization'), 'Authorization liberado no preflight', permitidos);
  ok(permitidos.includes('x-admin-password'), 'X-Admin-Password liberado no preflight', permitidos);
  global.fetch = realFetch;
}

console.log('\n' + (falhas === 0 ? 'TUDO PASSOU' : falhas + ' FALHA(S)'));
process.exit(falhas === 0 ? 0 : 1);

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
      // O resumo automático no WhatsApp está desligado (a Meta cobra por
      // mensagem iniciada pelo bot). Enquanto estiver, o veredito NÃO pode
      // dizer que basta a secret — a secret virou irrelevante, e mandar o
      // admin atrás dela seria mandá-lo consertar o trinco errado.
      nome: 'APPROVED sem a secret ligada',
      templates: [{ name: 'resumo_diario_finn', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY' }],
      env: ENV_BASE,
      espera: /DESLIGADO no WhatsApp/i,
    },
    {
      // Nem com a secret configurada o painel pode dizer "sai no WhatsApp":
      // quem manda hoje é RESUMO_DIARIO_WHATSAPP_ATIVO.
      nome: 'APPROVED com a secret ligada',
      templates: [{ name: 'resumo_diario_finn', status: 'APPROVED', language: 'pt_BR', category: 'UTILITY' }],
      env: { ...ENV_BASE, DAILY_DASHBOARD_TEMPLATE_NAME: 'resumo_diario_finn' },
      espera: /DESLIGADO no WhatsApp/i,
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

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 7. POST /whatsapp/test-daily-template manda o resumo na hora ===');
{
  const novoKV = (inicial) => {
    const store = new Map(Object.entries(inicial || {}));
    return { _store: store, async get(k) { return store.has(k) ? store.get(k) : null; }, async put(k, v) { store.set(k, v); }, async delete(k) { store.delete(k); },
      async list({ prefix }) { return { keys: [...store.keys()].filter(k => k.startsWith(prefix || '')).map(name => ({ name })), list_complete: true }; } };
  };
  const DADOS = JSON.stringify({ phone: '5511999999999', txs: [
    { id: 't1', val: -30, desc: 'Café', cat: 'Alimentação', date: '2026-08-11' },
    { id: 't2', val: 2000, desc: 'Salário', cat: 'Salário', date: '2026-08-01' },
  ] });

  // Captura o payload que sai pra Meta — é o ponto do teste: o corpo do
  // template precisa levar exatamente 4 parâmetros, nenhum vazio.
  let enviado = null;
  const mockEnvio = (respostaMeta, status = 200) => {
    global.fetch = async (url, opts) => {
      const u = String(url);
      if (u.includes('graph.facebook.com') && u.includes('/messages')) {
        enviado = JSON.parse(opts.body);
        return new Response(JSON.stringify(respostaMeta), { status });
      }
      if (u.includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'u1', email: 'finn.controle01@gmail.com' }), { status: 200 });
      return realFetch(url, opts);
    };
  };
  const testar = (env, corpo) => bot.fetch(new Request('https://x/whatsapp/test-daily-template', {
    method: 'POST', headers: { 'X-Admin-Token': 'token-secreto', 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo)
  }), env, ctx);

  const envKV = () => ({ ...ENV_BASE, WHATSAPP_PHONE_NUMBER_ID: '999', FINN_KV: novoKV({ 'data_5511999999999': DADOS }) });

  // A rota é fechada igual à outra.
  mockEnvio({ messages: [{ id: 'wamid.1' }] });
  const semAuth = await bot.fetch(new Request('https://x/whatsapp/test-daily-template', { method: 'POST', body: '{}' }), envKV(), ctx);
  ok(semAuth.status === 401, 'sem credencial -> 401', semAuth.status);

  // Número que não existe no Finn não vira rota de envio pra qualquer um.
  enviado = null;
  const desconhecido = await testar(envKV(), { phone: '5511000000000' });
  ok(desconhecido.status === 404, 'número sem dados no Finn -> 404', desconhecido.status);
  ok(enviado === null, 'e nada foi enviado pra Meta');

  // Caminho feliz.
  enviado = null;
  const r = await testar(envKV(), { phone: '55 11 99999-9999' });
  const j = await r.json();
  ok(r.status === 200 && j.ok === true, 'envio aceito pela Meta -> ok=true', j.veredito);
  ok(!!enviado && enviado.type === 'template', 'saiu como template (não texto livre)', enviado && enviado.type);
  ok(enviado && enviado.template.name === 'resumo_diario_finn', 'usou o template certo', enviado && enviado.template.name);
  ok(enviado && enviado.template.language.code === 'pt_BR', 'idioma pt_BR', enviado && enviado.template.language.code);
  const params = (enviado && enviado.template.components[0].parameters) || [];
  // 4 é o número de {{n}} do template aprovado. Divergir aqui é o erro
  // 132000 da Meta, que só apareceria às 22h do dia seguinte.
  ok(params.length === 4, 'manda exatamente 4 parâmetros (igual ao template aprovado)', params.length);
  ok(params.every(p => p.text && p.text.trim().length > 0), 'nenhum parâmetro vazio (a Meta rejeita)', JSON.stringify(params.map(p => p.text)));

  // Este endpoint é teste MANUAL. Ele passar não pode ser lido como "o
  // automático voltou" — o automático está desligado, e um veredito animado
  // aqui faria o admin parar de procurar o problema real (o faturamento).
  ok(/DESLIGADO/i.test(j.veredito) && /Telegram/i.test(j.veredito),
     'teste manual avisa que o automático continua desligado', j.veredito);

  const comSecret = await testar({ ...envKV(), DAILY_DASHBOARD_TEMPLATE_NAME: 'resumo_diario_finn' }, { phone: '5511999999999' });
  const j2 = await comSecret.json();
  ok(/DESLIGADO/i.test(j2.veredito), 'nem com a secret ele promete o envio das 22h', j2.veredito);

  // Descasamento de variáveis tem nome próprio no veredito.
  mockEnvio({ error: { code: 132000, message: 'number of parameters does not match' } }, 400);
  const ruim = await testar(envKV(), { phone: '5511999999999' });
  const j3 = await ruim.json();
  ok(j3.ok === false, 'recusa da Meta -> ok=false');
  ok(/variáveis do template não bate/i.test(j3.veredito), 'erro 132000 vira explicação, não código cru', j3.veredito);
  ok(JSON.stringify(j3.meta_response).includes('132000'), 'resposta crua da Meta preservada');

  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 8. o resumo automático saiu do WhatsApp e continua no Telegram ===');
{
  // O nome forçado é privilégio do teste manual. Se vazasse pro caminho
  // automático, o fail-safe que impede mensagem proativa errada sumiria.
  const novoKV = (inicial) => {
    const store = new Map(Object.entries(inicial || {}));
    return { async get(k) { return store.has(k) ? store.get(k) : null; }, async put(k, v) { store.set(k, v); }, async delete(k) { store.delete(k); },
      async list({ prefix }) { return { keys: [...store.keys()].filter(k => k.startsWith(prefix || '')).map(name => ({ name })), list_complete: true }; } };
  };
  let enviouWpp = 0, enviouTg = 0;
  global.fetch = async (url, opts) => {
    const u = String(url);
    if (u.includes('api.telegram.org')) { enviouTg++; return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), { status: 200 }); }
    if (u.includes('/messages')) { enviouWpp++; return new Response(JSON.stringify({ messages: [{ id: 'x' }] }), { status: 200 }); }
    return realFetch(url, opts);
  };
  // Dois assinantes com tudo em ordem (Pro + opt-in + lançamentos): um no
  // WhatsApp, um no Telegram. A única diferença entre eles é o canal.
  const txs = [{ id: 't1', val: -30, desc: 'x', cat: 'Outros', date: '2026-08-11' }];
  const dados = { plan: 'pro', dailyDashboardOptIn: true, txs };
  const kvDupla = () => novoKV({
    'data_5511999999999': JSON.stringify({ ...dados, phone: '5511999999999' }),
    'data_tg:12345':      JSON.stringify({ ...dados, phone: 'tg:12345' }),
  });

  await bot.scheduled({ cron: '0 1 * * *' }, { ...ENV_BASE, WHATSAPP_PHONE_NUMBER_ID: '999', TELEGRAM_BOT_TOKEN: 'tg-token', FINN_KV: kvDupla() }, ctx);
  ok(enviouWpp === 0, 'cron não manda nada pro WhatsApp', enviouWpp);
  ok(enviouTg === 1, 'e continua mandando pro Telegram', enviouTg);

  // O ponto que mais importa: nem com a secret do template configurada o
  // WhatsApp volta a receber. Quem manda é RESUMO_DIARIO_WHATSAPP_ATIVO — se
  // alguém religar por engano mexendo só na secret, este teste quebra.
  enviouWpp = 0; enviouTg = 0;
  await bot.scheduled({ cron: '0 1 * * *' }, {
    ...ENV_BASE, WHATSAPP_PHONE_NUMBER_ID: '999', TELEGRAM_BOT_TOKEN: 'tg-token',
    DAILY_DASHBOARD_TEMPLATE_NAME: 'resumo_diario_finn', FINN_KV: kvDupla(),
  }, ctx);
  ok(enviouWpp === 0, 'mesmo com a secret ligada, o WhatsApp segue mudo', enviouWpp);
  ok(enviouTg === 1, 'e o Telegram segue recebendo', enviouTg);
  global.fetch = realFetch;
}

// ══════════════════════════════════════════════════════════════════════
console.log('\n=== 9. GET /whatsapp/entregas explica o que houve depois do "accepted" ===');
{
  const kvCom = (eventos) => {
    const store = new Map();
    eventos.forEach((e, i) => store.set('debug_evt_' + (1000 + i) + '_aaa', JSON.stringify(e)));
    return { async get(k) { return store.has(k) ? store.get(k) : null; }, async put(k, v) { store.set(k, v); },
      async list({ prefix }) { return { keys: [...store.keys()].filter(k => k.startsWith(prefix || '')).map(name => ({ name })), list_complete: true }; } };
  };
  const pedir = (eventos) => bot.fetch(
    new Request('https://x/whatsapp/entregas', { method: 'GET', headers: { 'X-Admin-Token': 'token-secreto' } }),
    { ...ENV_BASE, FINN_KV: kvCom(eventos) }, ctx
  );

  global.fetch = async (url, opts) => {
    if (String(url).includes('/auth/v1/user')) return new Response(JSON.stringify({ id: 'u1', email: 'finn.controle01@gmail.com' }), { status: 200 });
    return realFetch(url, opts);
  };

  const semAuth = await bot.fetch(new Request('https://x/whatsapp/entregas', { method: 'GET' }), { ...ENV_BASE, FINN_KV: kvCom([]) }, ctx);
  ok(semAuth.status === 401, 'sem credencial -> 401', semAuth.status);

  // Silêncio total: quase sempre é o webhook não inscrito. Dizer "não houve
  // falha" aqui seria mentira — não houve INFORMAÇÃO.
  const vazio = await (await pedir([])).json();
  ok(/NENHUM status/i.test(vazio.veredito), 'sem eventos, não finge que deu certo', vazio.veredito);
  ok(/webhook/i.test(vazio.veredito) && /subscribe/i.test(vazio.veredito), 'e aponta a causa mais provável + o conserto');

  // O caso do usuário: aceito pela Meta e engolido depois.
  const engolido = await (await pedir([
    { at: '2026-08-11T23:10:00Z', kind: 'status', status: 'failed', recipient: '5513982020928',
      errors: [{ code: 131049, title: 'This message was not delivered to maintain healthy ecosystem engagement.' }] },
  ])).json();
  ok(/FALHOU/i.test(engolido.veredito), 'falha de entrega vira veredito de falha', engolido.veredito);
  ok(engolido.entregas[0].codigo === 131049, 'código preservado', engolido.entregas[0].codigo);
  ok(/janela de 24h|conversou/i.test(engolido.entregas[0].explicacao || ''), '131049 vem com o conserto explicado', engolido.entregas[0].explicacao);

  // 131042 e' erro de CONTA: atinge todo mundo, nao so' aquele numero. O
  // veredito tem que dizer isso, senao o dono vai procurar problema no
  // destinatario errado.
  const pagamento = await (await pedir([
    { at: '2026-08-13T01:00:43Z', kind: 'status', status: 'failed', recipient: '5513982020928',
      errors: [{ code: 131042, title: 'Business eligibility payment issue' }] },
  ])).json();
  ok(/PAGAMENTO NA CONTA/i.test(pagamento.veredito), '131042 vira veredito de problema de conta', pagamento.veredito.slice(0, 60));
  ok(/TODOS os usu/i.test(pagamento.veredito), 'e avisa que atinge todos os usuários');
  ok(/faturamento|Business Manager/i.test(pagamento.entregas[0].explicacao || ''), 'a explicação diz onde resolver');
  ok(/24h/.test(pagamento.entregas[0].explicacao || ''), 'e explica por que o teste manual funcionava');

  const entregue = await (await pedir([
    { at: '2026-08-11T23:10:00Z', kind: 'status', status: 'delivered', recipient: '5513982020928' },
  ])).json();
  ok(/ENTREGUE/i.test(entregue.veredito), 'entrega confirmada é dita como tal', entregue.veredito);

  // "sent" sozinho não é entrega — não pode virar veredito otimista.
  const soEnviado = await (await pedir([
    { at: '2026-08-11T23:10:00Z', kind: 'status', status: 'sent', recipient: '5513982020928' },
  ])).json();
  ok(/não entregue|ainda não confirmou/i.test(soEnviado.veredito), '"sent" sozinho não é tratado como entregue', soEnviado.veredito);

  // Log maior que a varredura: "não achei" não pode virar "não houve".
  const muitos = [];
  for (let i = 0; i < 450; i++) muitos.push({ at: '2026-08-11T20:00:00Z', kind: 'webhook_no_messages', raw: 'x' });
  const truncado = await (await pedir(muitos)).json();
  ok(truncado.varredura_completa === false, 'avisa que a varredura foi truncada', truncado.varredura_completa);
  ok(!/NENHUM status/i.test(truncado.veredito), 'e NÃO acusa o webhook de estar mudo', truncado.veredito);
  ok(/não é prova/i.test(truncado.veredito), 'diz explicitamente que não prova nada', truncado.veredito);

  // Recusa no próprio envio aparece separada da recusa na entrega.
  const recusa = await (await pedir([
    { at: '2026-08-11T23:09:00Z', kind: 'meta_send_error', status: 400, body: '{"error":{"code":132015}}' },
  ])).json();
  ok(recusa.recusas_no_envio.length === 1, 'erro no envio listado à parte', JSON.stringify(recusa.recusas_no_envio));

  global.fetch = realFetch;
}

console.log('\n' + (falhas === 0 ? 'TUDO PASSOU' : falhas + ' FALHA(S)'));
process.exit(falhas === 0 ? 0 : 1);

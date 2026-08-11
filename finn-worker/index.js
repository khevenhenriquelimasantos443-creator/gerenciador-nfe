import { IG_STORIES } from "./social-stories.js";
// =============================================================================
// Finn. WhatsApp Bot — Cloudflare Worker (Meta WhatsApp Cloud API)
// =============================================================================
// Required env vars:
//   WHATSAPP_PHONE_NUMBER_ID  — Phone Number ID from Meta Developer Portal
//   WHATSAPP_ACCESS_TOKEN     — Access token from Meta
//   WHATSAPP_VERIFY_TOKEN     — Any string you choose (ex: finn_verify_2024)
//   FINN_URL                  — Public URL of the Finn app
//   ADMIN_TOKEN               — Any random string; protects /keys, /debug,
//                               /subscribe (wrangler secret put ADMIN_TOKEN)
//   META_APP_SECRET           — App Secret from Meta Developer Portal → App
//                               Settings → Basic. Validates incoming
//                               webhooks (optional but strongly recommended)
// KV namespace binding: FINN_KV
// =============================================================================

const META_API_VERSION = "v19.0";

// Estrutura de planos já está pronta, mas a cobrança só começa mês que
// vem — enquanto isso, ninguém é bloqueado no bot. Vira true quando for a hora.
const PREMIUM_ENFORCEMENT_ENABLED = false;

// Conta master do Finn — além do ADMIN_TOKEN secreto, quem estiver logado
// no Supabase com esse email TAMBÉM precisa da senha extra (wrangler secret
// MASTER_ADMIN_PASSWORD) pra passar em requireAdminToken() — o login do
// Google/Supabase sozinho não é suficiente.
const MASTER_EMAIL = "finn.controle01@gmail.com";

// Número pra onde o bot manda quem pede atendimento humano — o número do
// WhatsApp na Cloud API não tem como ser respondido na mão sem Coexistência
// (que exige verificação de empresa/CNPJ, ainda não temos). Esse aqui é
// pessoal por enquanto, só até ter um número dedicado — por isso o rótulo é
// "Gerência Finn.", não o nome de ninguém.
const SUPPORT_CONTACT_PHONE = "5513982020928";
const SUPPORT_CONTACT_LABEL = "Gerência Finn.";

// Bot do Telegram é novo — fica restrito a essas duas contas por enquanto
// (mesma lógica de "novo recurso só pra admin primeiro" usada pro WhatsApp),
// até validar que o fluxo de vínculo e as respostas funcionam de verdade.
const TELEGRAM_ALLOWED_EMAILS = ["finn.controle01@gmail.com", "khevenhenriquelimasantos443@gmail.com"];
function telegramAllowedEmail(email) {
  return !!email && TELEGRAM_ALLOWED_EMAILS.includes(String(email).toLowerCase());
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return corsResponse(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/webhook") {
      if (request.method === "GET") return handleWebhookVerification(request, env);
      if (request.method === "POST") return handleWebhook(request, env);
    }

    if (url.pathname === "/sync") {
      if (request.method === "GET")  return handleSyncGet(request, env);
      if (request.method === "POST") return handleSync(request, env);
      if (request.method === "DELETE") return handleSyncDelete(request, env);
    }

    // Endpoints de administração/diagnóstico — nunca chamados pelo app público,
    // só por quem sabe o token. Sem isso, /keys expunha todos os telefones
    // cadastrados e /debug expunha telefone+texto das últimas mensagens.
    if (url.pathname === "/keys" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      const list = await listAllKeys(env, "data_");
      const keys = list.map(k => k.name.replace("data_", ""));
      return corsResponse(new Response(JSON.stringify({ ok: true, numeros: keys }, null, 2), { status: 200, headers: { "Content-Type": "application/json" } }));
    }

    if (url.pathname === "/status" && request.method === "GET") {
      // Era o único diagnóstico sem autenticação: cada acesso disparava uma
      // chamada à Graph API com o token do bot e devolvia trecho do erro da
      // Meta — amplificação barata pra qualquer um, e detalhe operacional de
      // graça. Agora segue a mesma regra dos outros (/keys, /debug, /health).
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleStatus(env);
    }

    // Raio-X da conexão com o WhatsApp (conta, número, webhook, token) —
    // admin-gated como os outros endpoints de diagnóstico, já que devolve
    // detalhes da conta business.
    if (url.pathname === "/whatsapp/health" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppHealth(env);
    }

    if (url.pathname === "/debug" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleDebug(env);
    }

    if (url.pathname === "/subscribe" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleSubscribeWaba(env);
    }

    // Chama o /register da Cloud API direto, pulando a tela do Meta Developer
    // (que só devolve "Falha na inscrição" genérico) — devolve a resposta
    // crua da Graph API, com o código/mensagem de erro reais.
    if (url.pathname === "/whatsapp/register-number" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppRegisterNumber(request, env);
    }

    // Situação dos Message Templates na Meta (aprovado, em análise, rejeitado).
    // Sem isso, a única forma de saber era abrir o WhatsApp Manager na mão.
    if (url.pathname === "/whatsapp/templates" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppTemplates(env);
    }

    // Dispara o resumo diário na hora, pra não precisar esperar as 22h só pra
    // descobrir se o template aprovado funciona de verdade.
    if (url.pathname === "/whatsapp/test-daily-template" && request.method === "POST") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppTestDailyTemplate(request, env);
    }

    // O que a Meta reportou DEPOIS do "accepted" — sem isso, mensagem aceita
    // e nunca entregue fica indistinguível de mensagem entregue.
    if (url.pathname === "/whatsapp/entregas" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppEntregas(env);
    }

    // Cria o rascunho do Message Template do resumo diário direto pela API,
    // sem precisar clicar no WhatsApp Manager. A Meta ainda revisa e aprova
    // por fora — isso a API não pula, só a criação do rascunho é automática.
    if (url.pathname === "/whatsapp/create-daily-template" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppCreateDailyTemplate(env);
    }

    // Resumo de uso do bot (WhatsApp + Telegram) pro painel de uso do app —
    // requireAdminToken já aceita access_token+admin_password da conta
    // master, então o app consegue chamar isso direto (mesmo esquema do
    // /telegram/set-webhook, só que sem token de admin fixo).
    if (url.pathname === "/admin/bot-stats" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleBotStats(env);
    }

    // ── Vínculo verificado do número de WhatsApp (ver whatsappOwnershipOk) ──
    if (url.pathname === "/whatsapp/link" && request.method === "POST") {
      return handleWhatsAppLinkStart(request, env);
    }
    // Libera um número (trocou de chip, vinculou errado). Só admin — se a
    // própria conta pudesse liberar, o registro de posse não valeria nada.
    if (url.pathname === "/whatsapp/unlink" && request.method === "POST") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleWhatsAppUnlink(request, env);
    }
    if (url.pathname === "/whatsapp/link-status" && request.method === "GET") {
      return handleWhatsAppLinkStatus(request, env);
    }

    // ── Telegram (novo canal — restrito às contas em TELEGRAM_ALLOWED_EMAILS) ──
    if (url.pathname === "/telegram/webhook" && request.method === "POST") {
      return handleTelegramWebhook(request, env);
    }
    if (url.pathname === "/telegram/link" && request.method === "POST") {
      return handleTelegramLinkStart(request, env);
    }
    if (url.pathname === "/telegram/link-status" && request.method === "GET") {
      return handleTelegramLinkStatus(request, env);
    }
    if (url.pathname === "/telegram/set-webhook" && request.method === "GET") {
      if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
      return handleTelegramSetWebhook(env);
    }

    // ── Lançamentos criados pelo bot (WhatsApp ou Telegram) que ainda não
    // foram puxados pro Supabase — ver handleBotTxsGet/handleBotTxsAck. ──
    if (url.pathname === "/bot-txs" && request.method === "GET") {
      return handleBotTxsGet(request, env);
    }
    if (url.pathname === "/bot-txs/ack" && request.method === "POST") {
      return handleBotTxsAck(request, env);
    }

    // ── Imagens de Story do Instagram ────────────────────────────────────
    // Publicas de proposito: a API do Instagram nao aceita upload direto, so
    // image_url, entao a Meta precisa conseguir baixar a imagem sozinha.
    // Ficam neste worker (e nao no finn-serve) porque la o script ja bateu no
    // teto de 3 MiB do plano free; aqui sobra espaco. Ver social-stories.js.
    const storyMatch = url.pathname.match(/^\/social\/story-(\d+)\.jpg$/);
    if (storyMatch && request.method === "GET") {
      const b64 = IG_STORIES[Number(storyMatch[1]) - 1];
      if (!b64) return new Response("Not Found", { status: 404 });
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      return new Response(bytes, {
        headers: {
          "Content-Type": "image/jpeg",
          // Imutavel: o conteudo de cada indice nunca muda depois de publicado.
          "Cache-Control": "public, max-age=31536000, immutable"
        }
      });
    }

    return new Response("Finn WhatsApp Worker", { status: 200 });
  },

  async scheduled(_event, env, _ctx) {
    await sendDailyDashboards(env);
  },
};

function corsResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  // X-Admin-Password entrou aqui junto com a remoção das credenciais da query
  // string: header customizado entre origens só passa se estiver nesta lista.
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token, X-Admin-Password");
  return new Response(response.body, { status: response.status, headers });
}

// Data/hora de "agora" no fuso do Brasil, não em UTC — o Worker roda em UTC
// e, entre 21h e 00h no horário de Brasília, os getters (getFullYear/
// getMonth/getDate) já apontavam pro dia seguinte. Usa o deslocamento fixo
// de -3h (Brasil não tem mais horário de verão desde 2019). Sempre que uma
// função precisar de "que dia é hoje pro usuário", usa nowBR() no lugar de
// `new Date()` — os getters passam a refletir o calendário certo.
function nowBR() {
  return new Date(Date.now() - 3 * 3600 * 1000);
}

function todayBR() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

// KV.list() só devolve até 1000 chaves por chamada — sem paginar pelo
// cursor, usuários além do primeiro milhar somem do /keys e nunca recebem
// o dashboard diário, sem nenhum erro visível.
async function listAllKeys(env, prefix) {
  let keys = [];
  let cursor;
  do {
    const page = await env.FINN_KV.list({ prefix, cursor });
    keys = keys.concat(page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

// Comparação de tempo constante — '===' em string sai no primeiro byte que
// diverge, então o tempo gasto conta quantos caracteres do prefixo estão
// certos. A assinatura da Meta aqui do lado já faz assim; ficou inconsistente.
// Token de sessão vem do header Authorization, e só dele. Query string vaza em
// log de acesso, histórico do navegador e no Referer — e um access_token é a
// conta inteira, porque é o mesmo JWT que a RLS do Supabase usa.
//
// Existiu aqui um fallback pro parâmetro ?access_token= como transição, pra não
// derrubar quem estivesse com a versão anterior do app presa no cache do
// Service Worker. Já passou tempo suficiente desde aquele deploy; a transição
// terminou e o fallback saiu.
function bearerToken(request) {
  const auth = request.headers.get("Authorization") || "";
  return /^Bearer\s+/i.test(auth) ? auth.replace(/^Bearer\s+/i, "") : null;
}

// Erro 500 genérico pro cliente, detalhe só no log do Worker. Devolver
// e.message direto entregava status e formato de erro dos fornecedores
// (Meta, Telegram, Supabase) pra quem estivesse sondando os endpoints.
function serverError(e, contexto) {
  console.error("[" + (contexto || "erro") + "]", (e && e.stack) || e);
  return corsResponse(new Response(JSON.stringify({ error: "Algo deu errado aqui do nosso lado. Tenta de novo em instantes." }), {
    status: 500, headers: { "Content-Type": "application/json" }
  }));
}

function timingSafeEqual(a, b) {
  const sa = String(a == null ? "" : a);
  const sb = String(b == null ? "" : b);
  if (sa.length !== sb.length) return false;
  let diff = 0;
  for (let i = 0; i < sa.length; i++) diff |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
  return diff === 0;
}

// Endpoints de diagnóstico (/keys, /debug, /subscribe) — nunca usados pelo
// app público. Aceita o token secreto (X-Admin-Token, definido via wrangler
// secret ADMIN_TOKEN) OU a conta master logada de verdade no Supabase
// (Authorization: Bearer <access_token> + X-Admin-Password).
//
// Só HEADER: os fallbacks por query string (?token=, ?access_token=,
// ?admin_password=) foram removidos porque URL vai parar no log de acesso da
// Cloudflare, no histórico do navegador e pode vazar no Referer pros domínios
// externos que o app linka (wa.me, t.me). Pra chamar na mão:
//   curl -H "X-Admin-Token: <ADMIN_TOKEN>" https://<worker>/debug
async function requireAdminToken(request, env) {
  const token = request.headers.get("X-Admin-Token");
  if (env.ADMIN_TOKEN && token && timingSafeEqual(token, env.ADMIN_TOKEN)) return true;

  const authHeader = request.headers.get("Authorization") || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "");
  const adminPassword = request.headers.get("X-Admin-Password");
  if (accessToken && env.MASTER_ADMIN_PASSWORD && adminPassword && timingSafeEqual(adminPassword, env.MASTER_ADMIN_PASSWORD)) {
    const user = await verifySupabaseUser(accessToken);
    if (user && user.email && user.email.toLowerCase() === MASTER_EMAIL.toLowerCase()) return true;
  }
  return false;
}

function unauthorizedResponse() {
  return corsResponse(new Response(JSON.stringify({ error: "unauthorized" }), {
    status: 401, headers: { "Content-Type": "application/json" }
  }));
}

// Confirma que quem está chamando /sync é dono de verdade do número — via
// sessão do Supabase (o app já autentica assim). Sem isso, /sync?phone=X
// devolvia o extrato financeiro de qualquer pessoa pra quem soubesse o
// telefone dela.
const SUPA_URL_CHECK = "https://zblkznobqcztvznycyyo.supabase.co";
const SUPA_ANON_KEY_CHECK = "sb_publishable_Zf-YkojOUHWDtuP_0B6BAA_dvbJguJb";

async function verifySupabaseUser(accessToken) {
  if (!accessToken) return null;
  try {
    const r = await fetch(SUPA_URL_CHECK + "/auth/v1/user", {
      headers: { apikey: SUPA_ANON_KEY_CHECK, Authorization: "Bearer " + accessToken }
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function phonesMatch(a, b) {
  if (!a || !b) return false;
  const variantsA = new Set(phoneVariants(a));
  return phoneVariants(b).some(v => variantsA.has(v));
}

// Um número de telefone é SÓ dígitos. Sem essa validação na entrada, dava pra
// mandar phone="tg:123456789": phonesMatch() compara apenas os dígitos (então
// batia com um metadata "123456789" que a própria pessoa escolheu), mas o
// worker usava a string CRUA como chave do KV — e "data_tg:123456789" é a
// chave de um usuário do Telegram. Ou seja, dava pra ler e sobrescrever os
// lançamentos de qualquer conta do Telegram passando por cima de todo o
// cerimonial de vínculo. Toda entrada de telefone passa por aqui, e a chave
// usada depois vem SEMPRE de normalizePhone(), nunca do valor do cliente.
function normalizePhone(phone) {
  const digits = String(phone == null ? "" : phone).replace(/\D/g, "");
  return /^\d{10,15}$/.test(digits) ? digits : null;
}

// Confere a assinatura X-Hub-Signature-256 que a Meta manda em todo webhook,
// calculada com o App Secret. Sem isso, qualquer um podia forjar um POST
// /webhook fingindo ser uma mensagem de qualquer telefone, fazendo o bot
// gravar transações falsas ou responder (gastando a cota de mensagens do
// número, que já foi banido uma vez). Se META_APP_SECRET ainda não foi
// configurado, deixa passar (mas registra em /debug) pra não travar quem
// ainda está no meio da configuração.
async function verifyMetaSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expectedHex = signatureHeader.slice(7).toLowerCase();
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const hex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
  if (hex.length !== expectedHex.length) return false;
  let diff = 0; // comparação em tempo constante, evita timing attack
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ expectedHex.charCodeAt(i);
  return diff === 0;
}

// =============================================================================
// DEBUG LOG — registro dos últimos eventos, pra diagnosticar sem precisar
// de acesso ao painel da Cloudflare. Guarda no KV, mostra em GET /debug.
// =============================================================================
const DEBUG_PREFIX = "debug_evt_";
const DEBUG_MAX = 25;

// Uma chave por evento (com TTL de 24h) em vez de read-modify-write numa
// chave única: o KV aceita só ~1 escrita/segundo por chave, então uma
// rajada de mensagens perdia eventos silenciosamente quando todos
// disputavam a mesma chave "__debug_log__".
// Mascara o número: guarda só o suficiente pra casar dois eventos do mesmo
// remetente ao investigar um problema, sem deixar o telefone inteiro em claro
// no KV. "5513992102413" vira "55******2413".
function maskPhone(v) {
  const s = String(v == null ? "" : v);
  if (s.startsWith("tg:")) return "tg:***" + s.slice(-4);
  const d = s.replace(/\D/g, "");
  if (d.length < 6) return "***";
  return d.slice(0, 2) + "*".repeat(Math.max(0, d.length - 6)) + d.slice(-4);
}

// Campos que não podem ir pro log de debug em claro. Antes o log guardava o
// telefone completo e o TEXTO INTEGRAL da mensagem por 24h — ou seja, dados
// financeiros da pessoa em repouso, sem necessidade nenhuma pra diagnóstico.
// O /debug é protegido por token de admin, mas o certo é o dado nem estar lá.
function sanitizeDebugEntry(entry) {
  const out = { ...entry };
  if (out.from) out.from = maskPhone(out.from);
  if (out.phone) out.phone = maskPhone(out.phone);
  if (out.uid) out.uid = maskPhone(out.uid);
  if (out.email) out.email = String(out.email).replace(/^(.).*(@.*)$/, "$1***$2");
  // O conteúdo da mensagem some; sobra só o tamanho, que já ajuda a
  // diferenciar "chegou vazio" de "chegou truncado".
  if ("text" in out) { out.textLen = out.text ? String(out.text).length : 0; delete out.text; }
  return out;
}

async function debugLog(env, entry) {
  try {
    const key = DEBUG_PREFIX + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    await env.FINN_KV.put(key, JSON.stringify({ at: new Date().toISOString(), ...sanitizeDebugEntry(entry) }), { expirationTtl: 86400 });
  } catch (err) {
    console.error("debugLog error:", err);
  }
}

async function handleDebug(env) {
  try {
    const keys = await listAllKeys(env, DEBUG_PREFIX);
    keys.sort((a, b) => b.name.localeCompare(a.name));
    const recent = keys.slice(0, DEBUG_MAX);
    const events = (await Promise.all(recent.map(k => env.FINN_KV.get(k.name))))
      .filter(Boolean).map(raw => JSON.parse(raw));
    return corsResponse(new Response(JSON.stringify({ ok: true, count: events.length, events }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }));
  } catch (e) {
    return serverError(e, "handleDebug");
  }
}

// Único lugar onde dá pra ver uso do bot (WhatsApp + Telegram) — essa parte
// nunca aparece no Supabase, já que os lançamentos feitos na conversa e o
// vínculo por telefone/chat vivem só no KV deste worker. Pro painel de uso
// do app conseguir mostrar isso, precisa desse resumo agregado aqui.
async function handleBotStats(env) {
  try {
    const list = await listAllKeys(env, "data_");
    let whatsappLinked = 0, telegramLinked = 0, whatsappTx = 0, telegramTx = 0, dailyDashboardOptIn = 0;
    for (const key of list) {
      const id = key.name.replace("data_", "");
      if (!id) continue;
      const data = await getUserData(id, env);
      const txs = data.txs || [];
      if (isTelegramId(id)) {
        telegramLinked++;
        telegramTx += txs.filter(t => t.source === "telegram").length;
      } else {
        whatsappLinked++;
        whatsappTx += txs.filter(t => t.source === "whatsapp").length;
      }
      if (data.dailyDashboardOptIn) dailyDashboardOptIn++;
    }
    return corsResponse(new Response(JSON.stringify({
      ok: true, whatsappLinked, telegramLinked, whatsappTx, telegramTx, dailyDashboardOptIn,
      totalIdentities: list.length
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
  } catch (e) {
    return serverError(e, "handleBotStats");
  }
}

// =============================================================================
// WEBHOOK VERIFICATION (GET) — required by Meta
// =============================================================================
async function handleWebhookVerification(request, env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    await debugLog(env, { kind: "webhook_verified" });
    return new Response(challenge, { status: 200 });
  }
  await debugLog(env, { kind: "webhook_verify_failed", mode, tokenMatch: token === env.WHATSAPP_VERIFY_TOKEN });
  return new Response("Forbidden", { status: 403 });
}

// =============================================================================
// WEBHOOK HANDLER (POST)
// =============================================================================
async function handleWebhook(request, env) {
  const rawBody = await request.text();

  // Falha FECHADA: sem o segredo configurado não dá pra provar que o POST veio
  // mesmo da Meta, e qualquer um que descubra a URL do worker poderia forjar
  // mensagens de qualquer número. Antes isso só era registrado no log e o
  // webhook seguia processando — uma janela aberta em toda troca/rotação de
  // secret ou deploy novo.
  if (!env.META_APP_SECRET) {
    await debugLog(env, { kind: "webhook_signature_not_configured" });
    return new Response("Forbidden", { status: 403 });
  }
  const sigHeader = request.headers.get("X-Hub-Signature-256");
  const valid = await verifyMetaSignature(rawBody, sigHeader, env.META_APP_SECRET);
  if (!valid) {
    await debugLog(env, { kind: "webhook_signature_invalid" });
    return new Response("Forbidden", { status: 403 });
  }

  let body;
  try { body = JSON.parse(rawBody); } catch { return new Response("Bad Request", { status: 400 }); }

  if (body.object !== "whatsapp_business_account") {
    await debugLog(env, { kind: "webhook_ignored", reason: "object != whatsapp_business_account", object: body.object });
    return new Response("OK", { status: 200 });
  }

  let sawMessage = false;
  for (const entry of (body.entry || [])) {
    for (const change of (entry.changes || [])) {
      if (change.field !== "messages") continue;
      for (const msg of (change.value?.messages || [])) {
        sawMessage = true;
        // A Meta reenvia o mesmo webhook se demorar pra confirmar (ou por
        // instabilidade do lado dela) — sem isso, cada reenvio criava uma
        // transação duplicada, já que addTransaction sempre gera um id novo.
        // Marca ANTES de processar (não depois): preferível perder uma
        // mensagem rara por erro transitório a duplicar um lançamento real.
        if (msg.id) {
          const dup = await env.FINN_KV.get(`msgid_${msg.id}`);
          if (dup) {
            await debugLog(env, { kind: "message_duplicate_skipped", from: msg.from, id: msg.id });
            continue;
          }
          await env.FINN_KV.put(`msgid_${msg.id}`, "1", { expirationTtl: 172800 });
        }
        await debugLog(env, { kind: "message_received", from: msg.from, type: msg.type, text: msg.text?.body });
        try {
          await processMessage(msg, env);
        } catch (err) {
          console.error("processMessage error:", err);
          await debugLog(env, { kind: "process_error", from: msg.from, error: String(err && err.stack || err) });
        }
      }
      // Statuses (delivered/read/failed) também chegam nesse campo — úteis pra
      // ver se a Meta está reportando falha de entrega de algo que enviamos.
      for (const st of (change.value?.statuses || [])) {
        await debugLog(env, { kind: "status", status: st.status, recipient: st.recipient_id, errors: st.errors });
      }
    }
  }
  if (!sawMessage) {
    await debugLog(env, { kind: "webhook_no_messages", raw: JSON.stringify(body).slice(0, 500) });
  }

  return new Response("OK", { status: 200 });
}

// Free lança gasto por mensagem (menu de texto, sem custo de IA); Plus tem
// resumos/consultas básicas; Pro tem tudo, incluindo o que gasta IA de
// verdade (áudio, foto de recibo) ou é diferencial de marketing (score).
const BOT_PLAN_RANK = { free: 0, plus: 1, pro: 2 };
const BOT_FEATURE_MIN_PLAN = {
  resumo_mes: "plus", alertas_limite: "plus", status_metas: "plus",
  contas_fixas: "plus", previsao_saldo: "plus", sinc_finn: "plus",
  modo_panico: "pro", analise_extrato: "pro", score_financeiro: "pro",
  dashboard_completo: "pro", audio_transcricao: "pro", imagem_recibo: "pro"
};

function botPlanAllows(plan, feature) {
  if (!PREMIUM_ENFORCEMENT_ENABLED) return true;
  const required = BOT_FEATURE_MIN_PLAN[feature];
  if (!required) return true; // não listado = sempre liberado (ex: lançar gasto)
  return (BOT_PLAN_RANK[plan] || 0) >= BOT_PLAN_RANK[required];
}

// Teto diário por número. Mídia (áudio/imagem) custa muito mais que texto —
// cada uma chama um modelo de IA — então tem cota própria e menor.
const BOT_DAILY_LIMIT_TEXT = 120;
const BOT_DAILY_LIMIT_MEDIA = 30;
async function botRateLimitOk(phone, msgType, env) {
  if (!env.FINN_KV) return true;
  const isMedia = msgType === "audio" || msgType === "image" || msgType === "document";
  const day = new Date().toISOString().slice(0, 10);
  const key = `rate_${isMedia ? "media" : "text"}_${String(phone).replace(/\D/g, "")}_${day}`;
  const used = parseInt((await env.FINN_KV.get(key)) || "0", 10) || 0;
  const limit = isMedia ? BOT_DAILY_LIMIT_MEDIA : BOT_DAILY_LIMIT_TEXT;
  if (used >= limit) return false;
  // TTL de 48h cobre qualquer fuso — a chave já é por dia UTC.
  await env.FINN_KV.put(key, String(used + 1), { expirationTtl: 172800 });
  return true;
}

async function sendUpgradeNudge(phone, feature, env) {
  const required = BOT_FEATURE_MIN_PLAN[feature] === "pro" ? "Pro" : "Plus";
  await sendText(phone, `🔒 Esse recurso é do plano *${required}*. Assine no app pra desbloquear: ${env.FINN_URL || ""}`, env);
}

async function processMessage(msg, env) {
  const phone = msg.from;
  if (!phone) return;

  // Antes de tudo: a mensagem pode ser só o código de vínculo gerado no app.
  // É assim que a pessoa prova que controla esse número (ver whatsappOwnershipOk).
  if (msg.type === "text" && await tryWhatsAppLinkConfirm(phone, msg.text?.body, env)) return;

  // Daqui pra frente, só número já vinculado a uma conta Finn. Sem esse portão,
  // qualquer pessoa que soubesse o número do bot (que é divulgado na landing)
  // tinha transcrição de áudio, leitura de imagem e LLM ilimitados de graça,
  // na conta de Workers AI do dono — e cada mensagem ainda consome conversa da
  // Cloud API e derruba o quality rating do número na Meta.
  if (!(await whatsappOwnerOf(phone, env))) {
    await sendText(phone, "👋 Oi! Pra usar o Finn por aqui, primeiro conecte este número: entre no app, vá em *Configurações → Conectar WhatsApp*, e me mande o código que aparecer.\n\n" + (env.FINN_URL || ""), env);
    return;
  }

  // Teto diário por número — mesmo já vinculado, uma conta só não pode torrar
  // a cota de IA de todo mundo (nem por abuso, nem por script com defeito).
  if (!(await botRateLimitOk(phone, msg.type, env))) {
    await sendText(phone, "⏳ Você atingiu o limite de mensagens de hoje. Tente de novo amanhã — ou use o app, que não tem limite.", env);
    return;
  }

  const stateData = await getState(phone, env);
  const state = stateData.state || "idle";
  const userData = await getUserData(phone, env);
  const plan = userData.plan || "free";

  if (msg.type === "interactive") {
    const interactive = msg.interactive;
    if (interactive.type === "list_reply") {
      return handleListReply(phone, interactive.list_reply.id, stateData, env, plan);
    }
    if (interactive.type === "button_reply") {
      return handleButtonReply(phone, interactive.button_reply.id, stateData, env);
    }
  }

  if (msg.type === "audio") {
    if (!botPlanAllows(plan, "audio_transcricao")) return sendUpgradeNudge(phone, "audio_transcricao", env);
    return handleAudioMessage(phone, msg, env);
  }

  if (msg.type === "image") {
    if (!botPlanAllows(plan, "imagem_recibo")) return sendUpgradeNudge(phone, "imagem_recibo", env);
    return handleImageMessage(phone, msg, env);
  }

  if (msg.type === "document") {
    return handleDocumentMessage(phone, msg, env);
  }

  if (msg.type === "text") {
    const text = (msg.text?.body || "").trim();
    if (!text) return;

    if (state !== "idle") return continueFlow(phone, text, stateData, env);

    const lower = text.toLowerCase();
    if (["menu","oi","olá","ola","finn","ajuda","help","inicio","início","oii"].includes(lower) || lower.startsWith("oi")) {
      return sendMainMenu(phone, env);
    }
    if (["sair","tchau","até logo","ate logo","falou","flw"].includes(lower)) {
      return sendText(phone, "Até mais! Digite *menu* quando quiser voltar.", env);
    }
    if (["sync","sinc","sincronizar","extrato"].includes(lower)) {
      if (!botPlanAllows(plan, "sinc_finn")) return sendUpgradeNudge(phone, "sinc_finn", env);
      return handleSincronizarFinn(phone, env);
    }
    if (["analise","análise"].includes(lower)) {
      if (!botPlanAllows(plan, "analise_extrato")) return sendUpgradeNudge(phone, "analise_extrato", env);
      return handleAnaliseExtratoPrompt(phone, env);
    }
    if (["score","pontuação","saúde"].includes(lower)) {
      if (!botPlanAllows(plan, "score_financeiro")) return sendUpgradeNudge(phone, "score_financeiro", env);
      return handleScoreFinanceiro(phone, env);
    }
    if (["dashboard","graficos","gráficos"].includes(lower)) {
      if (!botPlanAllows(plan, "dashboard_completo")) return sendUpgradeNudge(phone, "dashboard_completo", env);
      return handleDashboardCompleto(phone, env);
    }
    if (["panico","pânico","modo panico","modo pânico"].includes(lower)) {
      if (!botPlanAllows(plan, "modo_panico")) return sendUpgradeNudge(phone, "modo_panico", env);
      return handleModoPanico(phone, env);
    }
    // Opt-in/opt-out do resumo diário automático (Message Template) — "parar"
    // é a palavra prometida no próprio template, tem que funcionar de verdade.
    // dailyDashboardOptOutChat e um campo SEPARADO do dailyDashboardOptIn de
    // proposito. O optIn e reescrito a cada /sync a partir do metadata do
    // Supabase (o checkbox em Configuracoes e a fonte de consentimento), entao
    // gravar o "parar" so ali fazia o opt-out se desfazer sozinho: bastava a
    // pessoa abrir o app - que sincroniza em todo carregamento - pro template
    // voltar a sair no dia seguinte. "Parar" e a palavra prometida DENTRO do
    // template aprovado; se ela nao funciona de verdade, e motivo pra Meta
    // derrubar a conta. Este campo o /sync nao toca, e so "ativar resumo" limpa.
    if (lower === "parar") {
      await saveUserData(phone, { dailyDashboardOptIn: false, dailyDashboardOptOutChat: true }, env);
      return sendText(phone, "Combinado — você não recebe mais o resumo diário automático. Pra ativar de novo, é só mandar *ativar resumo*.", env);
    }
    if (["ativar resumo", "ativar resumo diário", "resumo diário", "quero o resumo diário"].includes(lower)) {
      await saveUserData(phone, { dailyDashboardOptIn: true, dailyDashboardOptOutChat: false }, env);
      return sendText(phone, "Pronto! A partir de hoje você recebe um resumo automático todo dia às 22h. Pra parar, é só responder *parar*.", env);
    }
    // Pedido de atendimento humano — o número do bot está na Cloud API e não
    // dá pra responder na mão nele sem Coexistência (que exige verificação de
    // empresa, ainda pendente). Enquanto isso, manda pra um número separado.
    // Checa a PALAVRA em qualquer lugar da frase (não frase exata) — "falar
    // com atendimento humano" tem que bater mesmo não estando na lista literal.
    const ATENDIMENTO_KEYWORDS = ["atendimento","atendente","suporte","humano","falar com alguem","falar com alguém"];
    if (ATENDIMENTO_KEYWORDS.some(k => lower.includes(k))) {
      return sendText(phone, `Entendido! Fala com a gente por aqui: https://wa.me/${SUPPORT_CONTACT_PHONE} (${SUPPORT_CONTACT_LABEL})`, env);
    }

    await sendText(phone, "Não entendi esse comando. Digite *menu* para ver as opções, ou mande um áudio/foto pra lançar direto.\n\nTambém aceito: *analise*, *score*, *dashboard*.", env);
  }
}

// =============================================================================
// LIST / BUTTON REPLY HANDLERS
// =============================================================================
async function handleListReply(phone, rowId, stateData, env, plan) {
  // Categoria com valor embutido no ID (à prova de lag do KV): "c|d|35.1|Transporte"
  if (rowId.startsWith("c|")) {
    const parts = rowId.split("|");
    const tipo = parts[1];            // "d" despesa | "r" receita
    const absVal = parseFloat(parts[2]);
    const cat = parts[3] || "Outros";
    if (!isNaN(absVal) && absVal > 0) {
      const val = tipo === "r" ? Math.abs(absVal) : -Math.abs(absVal);
      const nextState = tipo === "r" ? "awaiting_desc_receita" : "awaiting_desc_despesa";
      await setState(phone, { state: nextState, pending: { val, cat } }, env);
      await sendText(phone, "📝 Descrição? _(ex: Almoço, iFood, mercado, salário...)_", env);
      return;
    }
  }

  const catMap = {
    cat_alimentacao:"Alimentação", cat_transporte:"Transporte", cat_lazer:"Lazer",
    cat_saude:"Saúde", cat_educacao:"Educação", cat_moradia:"Moradia",
    cat_vestuario:"Vestuário", cat_investimento:"Investimento", cat_outros:"Outros",
    cat_salario:"Salário", cat_freelance:"Freelance", cat_aluguel:"Aluguel",
    cat_venda:"Venda", cat_bonus:"Bônus",
  };
  if (catMap[rowId]) return handleCategorySelected(phone, catMap[rowId], stateData, env);

  switch (rowId) {
    case "lancar_despesa":
      await setState(phone, { state: "awaiting_valor_despesa", pending: {} }, env);
      await sendText(phone, "💸 *Lançar despesa!*\n\nQual o valor? (Ex: 45,90)", env);
      break;
    case "lancar_receita":
      await setState(phone, { state: "awaiting_valor_receita", pending: {} }, env);
      await sendText(phone, "💰 *Lançar receita!*\n\nQual o valor recebido? (Ex: 3200,00)", env);
      break;
    case "resumo_mes":
      if (!botPlanAllows(plan, "resumo_mes")) { await sendUpgradeNudge(phone, "resumo_mes", env); break; }
      await handleResumoMes(phone, env); break;
    case "alertas_limite":
      if (!botPlanAllows(plan, "alertas_limite")) { await sendUpgradeNudge(phone, "alertas_limite", env); break; }
      await handleAlertasLimite(phone, env); break;
    case "status_metas":
      if (!botPlanAllows(plan, "status_metas")) { await sendUpgradeNudge(phone, "status_metas", env); break; }
      await handleStatusMetas(phone, env); break;
    case "contas_fixas":
      if (!botPlanAllows(plan, "contas_fixas")) { await sendUpgradeNudge(phone, "contas_fixas", env); break; }
      await handleContasFixas(phone, env); break;
    case "previsao_saldo":
      if (!botPlanAllows(plan, "previsao_saldo")) { await sendUpgradeNudge(phone, "previsao_saldo", env); break; }
      await handlePrevisaoSaldo(phone, env); break;
    case "modo_panico":
      if (!botPlanAllows(plan, "modo_panico")) { await sendUpgradeNudge(phone, "modo_panico", env); break; }
      await handleModoPanico(phone, env); break;
    case "analise_extrato":
      if (!botPlanAllows(plan, "analise_extrato")) { await sendUpgradeNudge(phone, "analise_extrato", env); break; }
      await handleAnaliseExtratoPrompt(phone, env); break;
    case "score_financeiro":
      if (!botPlanAllows(plan, "score_financeiro")) { await sendUpgradeNudge(phone, "score_financeiro", env); break; }
      await handleScoreFinanceiro(phone, env); break;
    case "sinc_finn":
      if (!botPlanAllows(plan, "sinc_finn")) { await sendUpgradeNudge(phone, "sinc_finn", env); break; }
      await handleSincronizarFinn(phone, env); break;
    case "abrir_finn":       await handleAbrirFinn(phone, env); break;
    default: await sendText(phone, "❓ Opção não reconhecida. Digite *menu* para tentar novamente.", env);
  }
}

async function handleButtonReply(phone, selectedId, stateData, env) {
  const catMap = {
    btn_alimentacao:"Alimentação", btn_transporte:"Transporte", btn_lazer:"Lazer",
    btn_saude:"Saúde", btn_educacao:"Educação", btn_moradia:"Moradia",
    btn_vestuario:"Vestuário", btn_investimento:"Investimento", btn_outros:"Outros",
  };
  if (catMap[selectedId]) return handleCategorySelected(phone, catMap[selectedId], stateData, env);

  switch (selectedId) {
    case "confirm_tx":    return handleConfirmTx(phone, stateData, env);
    case "cancel_tx":     return handleCancelTx(phone, env);
    case "edit_tx_desc":  return handleEditTxDesc(phone, stateData, env);
  }

  await sendText(phone, "❓ Não entendi. Digite *menu* para voltar.", env);
}

async function handleCategorySelected(phone, cat, stateData, env) {
  const state = stateData.state || "idle";
  if (state !== "awaiting_cat_despesa" && state !== "awaiting_cat_receita") {
    await sendText(phone, "❓ Não entendi. Digite *menu* para voltar.", env);
    return;
  }
  const pending = { ...(stateData.pending || {}), cat };
  const nextState = state === "awaiting_cat_despesa" ? "awaiting_desc_despesa" : "awaiting_desc_receita";
  await setState(phone, { state: nextState, pending }, env);
  await sendText(phone, "📝 Descrição? _(ex: Almoço, iFood, mercado, salário...)_", env);
}

// =============================================================================
// FLOW CONTINUATION
// =============================================================================
async function continueFlow(phone, text, stateData, env) {
  const { state, pending } = stateData;

  const lower = text.toLowerCase().trim();
  if (["menu","cancelar","cancel","sair","voltar"].includes(lower)) {
    await clearState(phone, env);
    await sendMainMenu(phone, env);
    return;
  }

  if (state === "awaiting_valor_despesa") {
    const val = parseMonetaryValue(text);
    if (val === null) {
      await clearState(phone, env);
      await sendText(phone, "⚠️ Não entendi o valor — o fluxo foi reiniciado.\n\nDigite *menu* para começar de novo.", env);
      return;
    }
    await setState(phone, { state: "awaiting_cat_despesa", pending: { ...pending, val: -Math.abs(val) } }, env);
    await sendCategoryList(phone, Math.abs(val), env);
    return;
  }

  if (state === "awaiting_valor_receita") {
    const val = parseMonetaryValue(text);
    if (val === null) {
      await clearState(phone, env);
      await sendText(phone, "⚠️ Não entendi o valor — o fluxo foi reiniciado.\n\nDigite *menu* para começar de novo.", env);
      return;
    }
    await setState(phone, { state: "awaiting_cat_receita", pending: { ...pending, val: Math.abs(val) } }, env);
    await sendCategoryListReceita(phone, Math.abs(val), env);
    return;
  }

  // Categoria DIGITADA em vez de tocada na lista. Sem estes dois ramos, quem
  // respondia "Alimentacao" no teclado (em vez de tocar no botao) caia no
  // fallback la embaixo: o estado era limpo, o valor ja informado se perdia e
  // a pessoa via "Algo deu errado" — como se fosse falha do sistema, quando
  // ela so tinha digitado. Acontece direto em lista longa no WhatsApp, onde o
  // seletor exige abrir um menu.
  if (state === "awaiting_cat_despesa" || state === "awaiting_cat_receita") {
    const lista = state === "awaiting_cat_despesa" ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA;
    const alvo = normalizaCategoriaTexto(text);
    // Casa pelo nome da categoria OU pelo rotulo mostrado (ex.: "Freelance/
    // Servicos"), ignorando acento, caixa e emoji.
    const achou = lista.find(function ([cat, emoji, label]) {
      return normalizaCategoriaTexto(cat) === alvo
        || (label && normalizaCategoriaTexto(label) === alvo);
    });
    if (achou) {
      await handleCategorySelected(phone, achou[0], stateData, env);
      return;
    }
    // Nao reconheceu: repete a lista SEM perder o valor ja informado.
    await sendText(phone, "❓ Não reconheci essa categoria. Escolhe uma da lista abaixo (ou digita o nome exato):", env);
    const v = Math.abs(Number((pending && pending.val) || 0));
    if (state === "awaiting_cat_despesa") await sendCategoryList(phone, v, env);
    else await sendCategoryListReceita(phone, v, env);
    return;
  }

  if (state === "awaiting_desc_despesa") {
    const tx = buildTransaction({ ...pending, desc: text }, phone);
    await addTransaction(phone, tx, env);
    await clearState(phone, env);
    await sendText(phone, `✅ *Despesa registrada!*\n\n💸 R$ ${formatBRL(Math.abs(tx.val))} — ${catToEmoji(tx.cat)} ${tx.cat}\n📝 ${tx.desc}\n📅 ${formatDateBR(tx.date)}\n\n_Abra o Finn_ 👉 ${env.FINN_URL || ""}`, env);
    return;
  }

  if (state === "awaiting_desc_receita") {
    const tx = buildTransaction({ ...pending, desc: text }, phone);
    await addTransaction(phone, tx, env);
    await clearState(phone, env);
    await sendText(phone, `✅ *Receita registrada!*\n\n💰 R$ ${formatBRL(Math.abs(tx.val))} — ${catToEmoji(tx.cat)} ${tx.cat}\n📝 ${tx.desc}\n📅 ${formatDateBR(tx.date)}\n\n_Abra o Finn_ 👉 ${env.FINN_URL || ""}`, env);
    return;
  }

  if (state === "awaiting_confirm_tx") {
    const lower = text.toLowerCase();
    if (["sim","s","ok","yes","confirmar"].includes(lower)) return handleConfirmTx(phone, stateData, env);
    if (["não","nao","n","no","cancelar"].includes(lower)) return handleCancelTx(phone, env);
    const updated = { ...(pending || {}), desc: text };
    await setState(phone, { state: "awaiting_confirm_tx", pending: updated }, env);
    await sendConfirmTransaction(phone, updated, "✏️ Atualizado:", env);
    return;
  }

  if (state === "awaiting_edit_tx_desc") {
    const updated = { ...(pending || {}), desc: text };
    await setState(phone, { state: "awaiting_confirm_tx", pending: updated }, env);
    await sendConfirmTransaction(phone, updated, "✏️ Corrigido:", env);
    return;
  }

  await clearState(phone, env);
  await sendText(phone, "❓ Algo deu errado. Digite *menu* para começar de novo.", env);
}

// =============================================================================
// CONSULTATION HANDLERS
// =============================================================================
async function handleResumoMes(phone, env) {
  const data = await getUserData(phone, env);
  const now = nowBR();
  const year = now.getFullYear(), month = now.getMonth();
  const monthTxs = (data.txs||[]).filter(tx => { const d=new Date(tx.date); return d.getFullYear()===year&&d.getMonth()===month; });
  const receitas = monthTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const despesas = monthTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const saldo = receitas - despesas;
  const byCat = {};
  monthTxs.filter(t=>t.val<0&&isFlowTx(t)).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});
  const catLines = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([cat,val])=>`  ${catToEmoji(cat)} ${cat}: R$ ${formatBRL(val)}`).join("\n");
  const monthName = now.toLocaleString("pt-BR",{month:"long"});
  await sendText(phone,
    `📊 *Resumo de ${capitalizeFirst(monthName)}*\n━━━━━━━━━━━━━━━\n` +
    `💰 Receitas:  R$ ${formatBRL(receitas)}\n💸 Despesas: R$ ${formatBRL(despesas)}\n` +
    `${saldo>=0?"📈":"📉"} Saldo:      R$ ${formatBRL(saldo)}\n━━━━━━━━━━━━━━━\n` +
    (catLines?`*Top categorias:*\n${catLines}\n\n`:"")+`_${monthTxs.length} lançamento(s) no mês_`, env);
}

async function handleAlertasLimite(phone, env) {
  const data = await getUserData(phone, env);
  const limits = data.limits||{};
  const now = nowBR();
  const monthTxs = (data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&tx.val<0&&isFlowTx(tx);});
  const byCat = {};
  monthTxs.forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});
  if (!Object.keys(limits).length) { await sendText(phone,"⚠️ Sem limites configurados.\n\nAbra o Finn! 👉 "+(env.FINN_URL||""),env); return; }
  const alerts = [];
  for (const [cat,limit] of Object.entries(limits)) {
    if (!limit||limit<=0) continue;
    const pct=((byCat[cat]||0)/limit)*100;
    if(pct>=100) alerts.push(`🔴 *${cat}*: ${Math.round(pct)}% — ESTOURADO`);
    else if(pct>=80) alerts.push(`🟡 *${cat}*: ${Math.round(pct)}% — Atenção`);
  }
  if (!alerts.length) await sendText(phone,"✅ *Todos os limites sob controle!* 💪",env);
  else await sendText(phone,`🚨 *Alertas de Limite*\n━━━━━━━━━━━━━━━\n${alerts.join("\n")}\n\n👉 ${env.FINN_URL||""}`,env);
}

async function handleStatusMetas(phone, env) {
  const data = await getUserData(phone, env);
  const goals = data.goals||[];
  if (!goals.length) { await sendText(phone,"🎯 Sem metas cadastradas.\n\nAbra o Finn! 👉 "+(env.FINN_URL||""),env); return; }
  const lines = goals.map(g=>{
    const pct=Math.min(100,Math.round(((g.saved||0)/(g.target||1))*100));
    const emoji=pct>=100?"🏆":pct>=75?"🚀":pct>=50?"💪":pct>=25?"📈":"🌱";
    return `${emoji} *${g.name}*\n   ${progressBar(pct)} ${pct}%\n   R$ ${formatBRL(g.saved||0)} / R$ ${formatBRL(g.target||0)}`;
  });
  await sendText(phone,`🎯 *Status das Metas*\n━━━━━━━━━━━━━━━\n${lines.join("\n\n")}\n\n👉 ${env.FINN_URL||""}`,env);
}

async function handleContasFixas(phone, env) {
  const fixed = await getFixedBills(phone, env);
  if (!fixed||!fixed.length) { await sendText(phone,"📋 Sem contas fixas.\n\nAbra o Finn! 👉 "+(env.FINN_URL||""),env); return; }
  const now = nowBR();
  const ym = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const pend = fixed.filter(b=>!(b.paid||[]).includes(ym));
  const paid = fixed.filter(b=>(b.paid||[]).includes(ym));
  let msg = `📋 *Contas Fixas — ${now.toLocaleString("pt-BR",{month:"long",year:"numeric"})}*\n━━━━━━━━━━━━━━━\n`;
  if (pend.length) msg+=`*A pagar (R$ ${formatBRL(pend.reduce((s,b)=>s+Math.abs(b.val),0))}):*\n${pend.sort((a,b)=>(a.dueDay||0)-(b.dueDay||0)).map(b=>`  ⏳ ${b.desc} — R$ ${formatBRL(Math.abs(b.val))} (dia ${b.dueDay||"??"})`).join("\n")}\n\n`;
  if (paid.length) msg+=`*Pagas (R$ ${formatBRL(paid.reduce((s,b)=>s+Math.abs(b.val),0))}):*\n${paid.map(b=>`  ✅ ${b.desc} — R$ ${formatBRL(Math.abs(b.val))}`).join("\n")}\n\n`;
  msg+=`👉 ${env.FINN_URL||""}`;
  await sendText(phone,msg,env);
}

async function handlePrevisaoSaldo(phone, env) {
  const data = await getUserData(phone, env);
  const fixed = await getFixedBills(phone, env);
  const now = nowBR();
  const year=now.getFullYear(), month=now.getMonth();
  const ym=`${year}-${String(month+1).padStart(2,"0")}`;
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===year&&d.getMonth()===month;});
  const receitas=monthTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const despesas=monthTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const pendFixed=(fixed||[]).filter(b=>!(b.paid||[]).includes(ym)).reduce((s,b)=>s+Math.abs(b.val),0);
  const saldoAtual=receitas-despesas;
  const daysLeft=new Date(year,month+1,0).getDate()-now.getDate();
  const dailyAvg=despesas/(now.getDate()||1);
  const previsao=saldoAtual-pendFixed-(dailyAvg*daysLeft);
  await sendText(phone,
    `🔮 *Previsão de Saldo*\n━━━━━━━━━━━━━━━\n` +
    `💰 Saldo atual: R$ ${formatBRL(saldoAtual)}\n📋 Fixas pendentes: R$ ${formatBRL(pendFixed)}\n` +
    `📊 Gasto médio/dia: R$ ${formatBRL(dailyAvg)}\n📅 Dias restantes: ${daysLeft}\n━━━━━━━━━━━━━━━\n` +
    `🎯 *Previsão fim do mês:* R$ ${formatBRL(previsao)}\n\n_Baseado no seu ritmo atual_`,env);
}

async function handleModoPanico(phone, env) {
  const data = await getUserData(phone, env);
  const now = nowBR();
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&tx.val<0&&isFlowTx(tx);});
  const top3=[...monthTxs].sort((a,b)=>Math.abs(b.val)-Math.abs(a.val)).slice(0,3);
  const despesas=monthTxs.reduce((s,t)=>s+Math.abs(t.val),0);
  await sendText(phone,
    `🚨 *MODO PÂNICO ATIVADO* 🚨\n━━━━━━━━━━━━━━━\n` +
    `Total gasto: *R$ ${formatBRL(despesas)}*\n\n` +
    `💣 *Maiores despesas:*\n${top3.map((t,i)=>`  ${i+1}. ${t.desc} — R$ ${formatBRL(Math.abs(t.val))} (${t.cat})`).join("\n")}\n\n` +
    `💡 *Dicas:*\n  • Cancele assinaturas que não usa\n  • Evite delivery por 7 dias\n  • Revise gastos recorrentes\n\n` +
    `_Respira fundo. Você tem isso. 💪_\n👉 ${env.FINN_URL||""}`,env);
}

async function handleAbrirFinn(phone, env) {
  await sendText(phone,`📱 *Abrir Finn*\n\n👉 ${env.FINN_URL||""}\n\n_Adicione à tela inicial para acesso rápido!_`,env);
}

async function handleSincronizarFinn(phone, env) {
  const data = await getUserData(phone, env);
  const txs = data.txs || [];
  const botTxs = txs.filter(t => t.source === "whatsapp" || t.source === "telegram");

  if (!botTxs.length) {
    await sendText(phone,
      `📭 *Sem lançamentos do bot ainda.*\n\nUse o menu para registrar uma despesa ou receita e eles aparecerão no Finn automaticamente.\n\n👉 ${env.FINN_URL||""}`, env);
    return;
  }

  const now = nowBR();
  const monthBotTxs = botTxs.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const receitas = monthBotTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const despesas = monthBotTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);

  const last5 = [...botTxs].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  const lines = last5.map(t=>`  ${t.val>0?"💰":"💸"} ${t.desc} — R$ ${formatBRL(Math.abs(t.val))} _(${formatDateBR(t.date)})_`).join("\n");

  await sendText(phone,
    `🔄 *Extrato do Bot — Finn*\n━━━━━━━━━━━━━━━\n` +
    `📦 Total salvo: *${botTxs.length} lançamento(s)*\n` +
    `📅 Neste mês:\n` +
    `  💰 Receitas: R$ ${formatBRL(receitas)}\n` +
    `  💸 Despesas: R$ ${formatBRL(despesas)}\n\n` +
    `*Últimos lançamentos:*\n${lines}\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `✅ *Dados prontos para o Finn!*\nAbra o app e tudo será sincronizado automaticamente:\n\n👉 ${env.FINN_URL||""}`, env);
}

// =============================================================================
// ANÁLISE DE EXTRATO — VIA ARQUIVO
// =============================================================================
async function handleAnaliseExtratoPrompt(phone, env) {
  await sendText(phone,
    `📂 *Análise de Extrato Bancário*\n━━━━━━━━━━━━━━━\n\n` +
    `Envie o arquivo do seu extrato aqui no chat:\n\n` +
    `✅ *Formatos aceitos:* CSV ou TXT\n` +
    `❌ *Não suportado:* XLSX e PDF — use o Finn:\n👉 ${env.FINN_URL||""}\n\n` +
    `_Exporte o extrato do app do seu banco como CSV e envie aqui._`, env);
}

async function handleDocumentMessage(phone, msg, env) {
  const doc = msg.document;
  if (!doc) return;
  const filename = (doc.filename || '').toLowerCase();
  const mime = (doc.mime_type || '').toLowerCase();
  const isTextFile = mime.includes('csv') || mime.includes('plain') || mime.includes('text') ||
                     filename.endsWith('.csv') || filename.endsWith('.txt');
  if (!isTextFile) {
    await sendText(phone,
      `📂 Formato não suportado pelo bot.\n\n✅ Envie um arquivo *CSV* ou *TXT*.\n\nPara XLSX e PDF, use o Finn:\n👉 ${env.FINN_URL||""}`, env);
    return;
  }
  await sendText(phone, "📂 _Analisando extrato..._", env);
  try {
    const buffer = await downloadMedia(phone, doc.id, env);
    if (!buffer) throw new Error("download failed");
    const text = new TextDecoder('latin1').decode(buffer);
    const txs = parseBankCSVBot(text);
    if (!txs.length) {
      await sendText(phone,
        `⚠️ Não encontrei transações no arquivo.\n\nVerifique se é um extrato bancário em CSV com colunas de data, descrição e valor.`, env);
      return;
    }
    const analysis = analyzeBotCSV(txs);
    await sendText(phone, formatBotAnalysis(analysis, env), env);
  } catch(err) {
    console.error("handleDocumentMessage:", err);
    await sendText(phone, `⚠️ Erro ao processar arquivo. Tente novamente ou use o Finn:\n👉 ${env.FINN_URL||""}`, env);
  }
}

// =============================================================================
// SCORE FINANCEIRO
// =============================================================================
async function handleScoreFinanceiro(phone, env) {
  const data = await getUserData(phone, env);
  const now = nowBR();
  const monthTxs = (data.txs||[]).filter(tx => {
    const d = new Date(tx.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const receitas = monthTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const despesas = monthTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const saldo = receitas - despesas;
  const goals = data.goals || [];
  const limits = data.limits || {};
  const byCat = {};
  monthTxs.filter(t=>t.val<0&&isFlowTx(t)).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});

  // Scoring (0–100)
  let score = 50;
  let details = [];

  // Saldo positivo (+20 / -20)
  if (saldo > 0) { score += 20; details.push("✅ Saldo positivo no mês"); }
  else if (saldo < 0) { score -= 20; details.push("❌ Saldo negativo no mês"); }

  // Taxa de economia (+15 se >20% de poupança)
  if (receitas > 0) {
    const savingRate = saldo / receitas;
    if (savingRate >= 0.2) { score += 15; details.push("✅ Poupando +20% da receita"); }
    else if (savingRate >= 0.05) { score += 5; details.push("⚠️ Poupança abaixo de 20%"); }
    else if (savingRate < 0) { score -= 10; details.push("❌ Gastando mais do que recebe"); }
  }

  // Metas (+10 se tem metas)
  if (goals.length > 0) {
    score += 10;
    const done = goals.filter(g => (g.saved||0) >= (g.target||1)).length;
    details.push(`✅ ${goals.length} meta(s) ativa(s)${done ? ` • ${done} concluída(s)` : ""}`);
  } else {
    details.push("⚠️ Nenhuma meta cadastrada");
  }

  // Limites (+10 se tem limites configurados)
  if (Object.keys(limits).length > 0) {
    const busted = Object.entries(limits).filter(([cat,lim]) => (byCat[cat]||0) > lim).length;
    if (busted === 0) { score += 10; details.push("✅ Todos os limites respeitados"); }
    else { score -= 5; details.push(`❌ ${busted} limite(s) estourado(s)`); }
  } else {
    details.push("⚠️ Sem limites de gastos configurados");
  }

  // Lançamentos regulares (+5)
  if (monthTxs.length >= 10) { score += 5; details.push("✅ Controle regular de lançamentos"); }

  score = Math.max(0, Math.min(100, score));
  const emoji = score >= 80 ? "🏆" : score >= 60 ? "🚀" : score >= 40 ? "💪" : score >= 20 ? "⚠️" : "🚨";
  const label = score >= 80 ? "Excelente" : score >= 60 ? "Bom" : score >= 40 ? "Regular" : score >= 20 ? "Atenção" : "Crítico";

  await sendText(phone,
    `🏆 *SCORE FINANCEIRO*\n━━━━━━━━━━━━━━━\n\n` +
    `${emoji} *${score}/100 — ${label}*\n` +
    `${progressBar(score, 10)}\n\n` +
    `*Detalhes:*\n${details.map(d => `  ${d}`).join("\n")}\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `_Melhore seu score: configure metas e limites no Finn_\n👉 ${env.FINN_URL||""}`, env);
}

// =============================================================================
// DASHBOARD COMPLETO
// =============================================================================
async function handleDashboardCompleto(phone, env) {
  const data = await getUserData(phone, env);
  const now = nowBR();
  const year = now.getFullYear(), cm = now.getMonth();

  // 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, cm - i, 1);
    const mm = d.getMonth(), my = d.getFullYear();
    const mt = (data.txs||[]).filter(tx => {
      const td = new Date(tx.date); return td.getMonth()===mm && td.getFullYear()===my;
    });
    const r = mt.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
    const e = mt.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
    months.push({ lbl: d.toLocaleDateString('pt-BR',{month:'short'}), r, e, n: r-e });
  }

  const cur = months[months.length-1];
  const catMap = {};
  (data.txs||[]).filter(tx => {
    const d = new Date(tx.date); return d.getMonth()===cm && d.getFullYear()===year && tx.val<0 && isFlowTx(tx);
  }).forEach(t => { catMap[t.cat]=(catMap[t.cat]||0)+Math.abs(t.val); });
  const topCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,4);

  let msg = `📊 *DASHBOARD COMPLETO*\n━━━━━━━━━━━━━━━\n\n`;
  msg += `*Mês atual:*\n💰 Receita: R$ ${formatBRL(cur.r)}\n💸 Despesa: R$ ${formatBRL(cur.e)}\n${cur.n>=0?"📈":"📉"} Saldo:   R$ ${formatBRL(Math.abs(cur.n))} ${cur.n<0?"(neg)":""}\n\n`;

  if (topCats.length) {
    msg += `*Top categorias:*\n`;
    topCats.forEach(([cat,val]) => {
      msg += `  ${catToEmoji(cat)} ${cat}: R$ ${formatBRL(val)}\n`;
    });
    msg += "\n";
  }

  msg += `*Tendência 6 meses:*\n`;
  months.forEach(m => {
    const bar = progressBar(m.r > 0 ? Math.min(100, Math.round(m.n/Math.max(m.r,1)*100)+50) : 0, 6);
    msg += `${m.lbl.padEnd(4)} ${bar} ${m.n>=0?"+":"-"}R$${formatBRL(Math.abs(m.n))}\n`;
  });

  const goals = data.goals || [];
  if (goals.length) {
    msg += `\n*Metas:*\n`;
    goals.slice(0,3).forEach(g => {
      const pct = Math.min(100, Math.round(((g.saved||0)/(g.target||1))*100));
      msg += `  ${pct>=100?"🏆":"📈"} ${g.name}: ${progressBar(pct,5)} ${pct}%\n`;
    });
  }

  msg += `\n━━━━━━━━━━━━━━━\n👉 ${env.FINN_URL||""}`;
  await sendText(phone, msg, env);
}

// =============================================================================
// ÁUDIO E IMAGEM — LANÇAMENTO COM IA
// =============================================================================
async function handleAudioMessage(phone, msg, env) {
  if (!env.AI) {
    await sendText(phone, "⚠️ IA não configurada. Use o menu para lançar manualmente.", env);
    return;
  }
  await sendText(phone, "🎙️ _Transcrevendo áudio..._", env);
  try {
    const audioId = msg.audio?.id;
    if (!audioId) throw new Error("no audio id");
    const buffer = await downloadMedia(phone, audioId, env);
    if (!buffer) throw new Error("download failed");
    const whisperResult = await env.AI.run("@cf/openai/whisper", { audio: [...new Uint8Array(buffer)] });
    const transcribed = (whisperResult?.text || "").trim();
    if (!transcribed) {
      await sendText(phone, "⚠️ Não consegui entender o áudio. Fale mais claramente ou use o menu.", env);
      return;
    }
    await sendText(phone, `🎙️ _Ouvi: "${transcribed}"_\n⏳ _Analisando..._`, env);
    const tx = await extractTransactionAI(transcribed, env);
    if (!tx) {
      await sendText(phone, `🎙️ Ouvi: _"${transcribed}"_\n\n⚠️ Não identifiquei valor/descrição. Use o menu para lançar manualmente.`, env);
      return;
    }
    await setState(phone, { state: "awaiting_confirm_tx", pending: tx }, env);
    await sendConfirmTransaction(phone, tx, "🎙️ Do áudio:", env);
  } catch(err) {
    console.error("handleAudioMessage:", err);
    await sendText(phone, "⚠️ Erro ao processar áudio. Use o menu para lançar manualmente.", env);
  }
}

async function handleImageMessage(phone, msg, env) {
  if (!env.AI) {
    await sendText(phone, "⚠️ IA não configurada. Use o menu para lançar manualmente.", env);
    return;
  }
  await sendText(phone, "🖼️ _Analisando imagem..._", env);
  try {
    const imageId = msg.image?.id;
    if (!imageId) throw new Error("no image id");
    const buffer = await downloadMedia(phone, imageId, env);
    if (!buffer) throw new Error("download failed");
    const uint8 = [...new Uint8Array(buffer)];
    const visionResult = await env.AI.run("@cf/llava-hf/llava-1.5-7b-hf", {
      image: uint8,
      prompt: "Analise esta imagem. É um comprovante, recibo ou nota fiscal? Extraia o valor em reais, descrição do estabelecimento e se é despesa ou receita. Responda APENAS em JSON sem explicações: {\"val\":0,\"desc\":\"\",\"tipo\":\"despesa\"}",
      max_tokens: 200
    });
    const visionText = visionResult?.response || "";
    const tx = parseAIResponse(visionText) || await extractTransactionAI(visionText, env);
    if (!tx) {
      await sendText(phone, "🖼️ Não identifiquei uma transação nesta imagem.\n\nEnvie um comprovante legível ou use o menu para lançar manualmente.", env);
      return;
    }
    await setState(phone, { state: "awaiting_confirm_tx", pending: tx }, env);
    await sendConfirmTransaction(phone, tx, "🖼️ Da imagem:", env);
  } catch(err) {
    console.error("handleImageMessage:", err);
    await sendText(phone, "⚠️ Erro ao processar imagem. Use o menu para lançar manualmente.", env);
  }
}

// Hosts de onde a Meta serve mídia. O token do WhatsApp vai no Authorization
// da segunda requisição, então mandá-la pra um host que não seja da Meta
// entregaria o token pra quem controlasse aquele endereço.
//
// fbsbx.com é obrigatório: a Cloud API devolve as mídias do WhatsApp em
// lookaside.fbsbx.com. Sem ele na lista, áudio e foto param de funcionar.
// O (^|\.) na frente impede sufixo forjado tipo "fbcdn.net.atacante.com".
const META_MEDIA_HOSTS = /(^|\.)(fbcdn\.net|fbsbx\.com|facebook\.com|whatsapp\.net)$/i;

async function downloadMetaMedia(mediaId, env) {
  // O id da mídia é numérico e vem do webhook da Meta. Com a assinatura agora
  // fail-closed não achei caminho pra ele chegar adulterado — mas ele entra
  // concatenado numa URL, e validar custa uma linha.
  if (!/^\d{1,32}$/.test(String(mediaId || ""))) {
    console.error("Media id inválido:", mediaId);
    return null;
  }
  const urlResp = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${mediaId}`, {
    headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }
  });
  if (!urlResp.ok) { console.error("Media URL fetch error:", urlResp.status); return null; }
  const { url } = await urlResp.json();
  if (!url) return null;
  // A URL vem da resposta da Meta, mas é ela que decide o host — confere antes
  // de mandar o token junto.
  let mediaHost = "";
  try { mediaHost = new URL(url).hostname; } catch { return null; }
  if (!META_MEDIA_HOSTS.test(mediaHost)) {
    console.error("Host de mídia recusado:", mediaHost);
    return null;
  }
  const fileResp = await fetch(url, { headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` } });
  if (!fileResp.ok) { console.error("Media download error:", fileResp.status); return null; }
  return fileResp.arrayBuffer();
}

async function extractTransactionAI(text, env) {
  if (!env.AI) return null;
  let raw = "";
  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: 'Você extrai transações financeiras de texto em português. Responda APENAS com JSON válido, sem texto extra: {"val":0,"desc":"","tipo":"despesa","cat":"Outros"}. val é o valor positivo em reais, só número (sem "R$", sem separador de milhar). tipo é "despesa" ou "receita". cat: Alimentacao, Transporte, Lazer, Saude, Educacao, Moradia, Vestuario, Investimento, Salario, Freelance, Outros.' },
        { role: "user", content: text }
      ],
      max_tokens: 150
    });
    raw = result?.response || "";
    const parsed = parseAIResponse(raw);
    if (!parsed) await debugLog(env, { kind: "extract_ai_failed", input: text, raw: raw.slice(0, 300) });
    return parsed;
  } catch(e) {
    console.error("extractTransactionAI:", e);
    await debugLog(env, { kind: "extract_ai_error", input: text, raw: raw.slice(0, 300), error: String(e && e.message || e) });
    return null;
  }
}

// O modelo (8B, pequeno) às vezes foge um pouco do schema pedido — usa chave
// em português ("valor"/"descricao"), embute "R$" dentro do número, ou envolve
// o JSON em ```. Normaliza tudo isso em vez de exigir o formato perfeito.
function parseAIResponse(text) {
  if (!text) return null;
  try {
    const cleaned = text.replace(/```json|```/gi, "");
    const match = cleaned.match(/\{[\s\S]*?\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    const rawVal = obj.val ?? obj.valor ?? obj.value;
    // Reaproveita parseMonetaryValue em vez de um replace ingenuo: o
    // ".replace(',', '.')" sozinho nao trata ponto de MILHAR, entao "1.200,00"
    // virava "1.200.00" e parseFloat lia 1.2 — o card de confirmacao mostrava
    // "R$ 1,20" e gravava isso. O modelo devolve numero em formato brasileiro
    // com frequencia justamente porque a conversa e em portugues.
    const valNum = parseMonetaryValue(String(rawVal ?? ""));
    const valStr = valNum === null ? "" : String(valNum);
    const val = parseFloat(valStr);
    const desc = obj.desc ?? obj.descricao ?? obj.description;
    if (isNaN(val) || val <= 0 || !desc) return null;
    const tipoRaw = String(obj.tipo ?? obj.type ?? "").toLowerCase();
    const isReceita = tipoRaw === "receita";
    return {
      val: isReceita ? Math.abs(val) : -Math.abs(val),
      desc: String(desc).trim(),
      cat: obj.cat ?? obj.categoria ?? obj.category ?? "Outros",
    };
  } catch(e) { return null; }
}

async function sendConfirmTransaction(phone, tx, label, env) {
  const tipo = tx.val > 0 ? "💰 Receita" : "💸 Despesa";
  const text = `${label}\n\n${tipo}: *R$ ${formatBRL(Math.abs(tx.val))}*\n📝 ${tx.desc}\n📂 ${tx.cat}\n\nConfirmar lançamento?`;
  if (isTelegramId(phone)) {
    return telegramSendMessage(phone, text, env, {
      reply_markup: { inline_keyboard: [[
        {text:"✅ Confirmar", callback_data:"confirm_tx"},
        {text:"✏️ Corrigir", callback_data:"edit_tx_desc"},
        {text:"❌ Cancelar", callback_data:"cancel_tx"}
      ]]}
    });
  }
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"button",
      body:{text},
      action:{buttons:[
        {type:"reply",reply:{id:"confirm_tx",title:"✅ Confirmar"}},
        {type:"reply",reply:{id:"edit_tx_desc",title:"✏️ Corrigir"}},
        {type:"reply",reply:{id:"cancel_tx",title:"❌ Cancelar"}}
      ]}
    }
  },env);
}

async function handleConfirmTx(phone, stateData, env) {
  const tx = stateData.pending;
  if (!tx || tx.val === undefined) {
    await clearState(phone, env);
    await sendText(phone, "❓ Algo deu errado. Digite *menu* para recomeçar.", env);
    return;
  }
  const saved = buildTransaction(tx, phone);
  await addTransaction(phone, saved, env);
  await clearState(phone, env);
  const tipo = saved.val > 0 ? "Receita" : "Despesa";
  await sendText(phone,
    `✅ *${tipo} registrada!*\n\n${saved.val>0?"💰":"💸"} R$ ${formatBRL(Math.abs(saved.val))} — ${catToEmoji(saved.cat)} ${saved.cat}\n📝 ${saved.desc}\n📅 ${formatDateBR(saved.date)}\n\n_Abra o Finn_ 👉 ${env.FINN_URL||""}`, env);
}

async function handleCancelTx(phone, env) {
  await clearState(phone, env);
  await sendText(phone, "❌ Lançamento cancelado. Digite *menu* para começar de novo.", env);
}

async function handleEditTxDesc(phone, stateData, env) {
  await setState(phone, { state: "awaiting_edit_tx_desc", pending: stateData.pending }, env);
  await sendText(phone, "✏️ Qual a descrição correta? _(ex: Almoço, salário, farmácia...)_", env);
}

// =============================================================================
// SYNC ENDPOINTS
// =============================================================================
// Gera variações de número BR (com e sem o 9º dígito) para casar a chave do KV
function phoneVariants(phone) {
  const digits = String(phone).replace(/\D/g, "");
  const set = new Set([digits]);
  // Formato BR: 55 + DDD(2) + numero
  if (digits.startsWith("55")) {
    const ddd = digits.slice(2, 4);
    const rest = digits.slice(4);
    if (rest.length === 9 && rest.startsWith("9")) {
      set.add("55" + ddd + rest.slice(1));        // remove o 9
    } else if (rest.length === 8) {
      set.add("55" + ddd + "9" + rest);           // adiciona o 9
    }
  }
  return [...set];
}

// =============================================================================
// POSSE VERIFICADA DO NÚMERO DE WHATSAPP
// =============================================================================
// O metadata "whatsapp" do perfil é AUTO-DECLARADO: a pessoa digita um número
// em Configurações e o app gravava. Como /sync e /bot-txs autorizavam só
// comparando o número enviado com esse metadata, bastava digitar o número de
// outra pessoa pra ler os lançamentos que ela fez pelo bot, injetar lançamentos
// falsos na conta dela e marcar os reais como "já sincronizados" (fazendo eles
// nunca chegarem no app dela). Nenhum segredo era necessário — só o número,
// que não é secreto.
//
// A correção: o dono de um número passa a ser registrado no KV do servidor
// (wa_owner_<numero> -> user id), e só UMA conta pode ter cada número.
// Reivindicar exige provar posse: a pessoa gera um código no app e manda ele
// pro bot pelo próprio WhatsApp (ver handleWhatsAppLinkStart e
// tryWhatsAppLinkConfirm) — quem não controla o número não consegue mandar.
async function whatsappOwnerOf(phone, env) {
  for (const cand of phoneVariants(phone)) {
    const owner = await env.FINN_KV.get(`wa_owner_${cand}`);
    if (owner) return { owner, phone: cand };
  }
  return null;
}

async function claimWhatsappOwner(phone, uid, env) {
  // Grava em todas as variações (com/sem o 9º dígito) porque o resto do worker
  // trata elas como o mesmo número — se registrasse só uma, a outra ficaria
  // livre pra ser reivindicada por outra conta.
  for (const cand of phoneVariants(phone)) {
    await env.FINN_KV.put(`wa_owner_${cand}`, uid);
  }
}

// Decide se `user` pode agir sobre `phone`: só se o número estiver registrado
// pra ele, e o registro só nasce em tryWhatsAppLinkConfirm (ou seja, depois de
// a pessoa mandar o código pelo WhatsApp dela).
//
// Não existe atalho de "primeiro que chegar leva": com ele, bastava um GET em
// /bot-txs com o número de outra pessoa pra registrar o número alheio em nome
// do atacante — travando a vítima para sempre (o vínculo dela passaria a ser
// recusado) e entregando pro atacante tudo que ela lançasse depois.
async function whatsappOwnershipOk(phone, user, env) {
  const reg = await whatsappOwnerOf(phone, env);
  return !!reg && reg.owner === user.id;
}

// Mesma ideia do whatsappOwnershipOk, pro Telegram — e pelo mesmo motivo.
// O vínculo do Telegram já gravava `tgchat_<chatId>` em
// handleTelegramLinkConfirm (só depois de a pessoa mandar o código pelo
// Telegram dela, ou seja, prova de posse de verdade), mas NINGUÉM lia esse
// registro na hora de autorizar: /sync e /bot-txs conferiam apenas
// user_metadata.telegram_chat_id.
//
// Esse metadata é auto-declarado: qualquer usuário logado pode gravar o que
// quiser nele com um PUT /auth/v1/user no Supabase (o próprio app faz isso
// em Auth.updateMetadata). Ou seja, bastava apontar o metadata pro chat de
// outra pessoa pra ler os lançamentos dela pelo /bot-txs e sobrescrever
// limites, metas e plano dela pelo /sync. O lado do WhatsApp já estava
// fechado assim desde antes; o do Telegram tinha ficado para trás.
async function telegramOwnershipOk(chatId, user, env) {
  if (!env.FINN_KV) return false;
  const raw = await env.FINN_KV.get(`tgchat_${chatId}`);
  if (!raw) return false;
  try {
    const reg = JSON.parse(raw);
    return !!reg && reg.uid === user.id;
  } catch { return false; }
}

// POST /whatsapp/link {access_token} -> { code }
// A pessoa manda esse código pro bot pelo WhatsApp dela; tryWhatsAppLinkConfirm
// (chamado no processMessage) fecha o vínculo com o número que enviou.
async function handleWhatsAppLinkStart(request, env) {
  let body;
  try { body = await request.json(); } catch { return corsResponse(new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })); }
  const user = await verifySupabaseUser(body.access_token);
  if (!user) return unauthorizedResponse();
  // Teto na geração também: sem isso, uma conta autenticada podia encher o KV
  // de códigos válidos e aumentar a chance de alguém acertar um no chute.
  if (!(await linkAttemptOk("gen:" + user.id, env))) {
    return corsResponse(new Response(JSON.stringify({ error: "muitas tentativas, espere alguns minutos" }), { status: 429, headers: { "Content-Type": "application/json" } }));
  }
  const code = randomLinkCode(8);
  await env.FINN_KV.put(`walink_${code}`, JSON.stringify({ uid: user.id, email: user.email, linked: false }), { expirationTtl: 600 });
  return corsResponse(new Response(JSON.stringify({ ok: true, code }), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
}

// POST /whatsapp/unlink { phone } — só admin (ver rota). Sem isso, um número
// registrado ficava preso pra sempre: quem trocasse de chip, ou vinculasse o
// número errado, não tinha como se desvincular nem transferir, e o suporte não
// tinha ferramenta nenhuma além de mexer no KV na unha.
async function handleWhatsAppUnlink(request, env) {
  let body;
  try { body = await request.json(); } catch { return corsResponse(new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })); }
  const phone = normalizePhone(body.phone);
  if (!phone) return corsResponse(new Response(JSON.stringify({ error: "invalid phone" }), { status: 400, headers: { "Content-Type": "application/json" } }));
  const removed = [];
  for (const cand of phoneVariants(phone)) {
    if (await env.FINN_KV.get(`wa_owner_${cand}`)) {
      await env.FINN_KV.delete(`wa_owner_${cand}`);
      removed.push(cand);
    }
  }
  await debugLog(env, { kind: "wa_unlink", phone, removed: removed.length });
  return corsResponse(new Response(JSON.stringify({ ok: true, removed: removed.length }), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
}

// GET /whatsapp/link-status?code=&access_token=
async function handleWhatsAppLinkStatus(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return corsResponse(new Response(JSON.stringify({ error: "code required" }), { status: 400, headers: { "Content-Type": "application/json" } }));
  const user = await verifySupabaseUser(bearerToken(request));
  if (!user) return unauthorizedResponse();
  const raw = await env.FINN_KV.get(`walink_${code}`);
  if (!raw) return corsResponse(new Response(JSON.stringify({ linked: false, expired: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
  const info = JSON.parse(raw);
  if (info.uid !== user.id) return unauthorizedResponse();
  return corsResponse(new Response(JSON.stringify({ linked: !!info.linked, phone: info.phone || null }), { status: 200, headers: { "Content-Type": "application/json" } }));
}

// Chamado no começo do processMessage: se a mensagem for só um código de
// vínculo pendente, fecha o vínculo e devolve true (não segue pro fluxo normal
// do bot). Devolve false pra qualquer outra mensagem.
async function tryWhatsAppLinkConfirm(phone, text, env) {
  const code = String(text || "").trim().toUpperCase();
  if (!/^[A-Z0-9]{8}$/.test(code)) return false;
  if (!(await linkAttemptOk(phone, env))) {
    await sendText(phone, "⏳ Muitas tentativas de código. Espere alguns minutos e gere um novo no app.", env);
    return true;
  }
  const raw = await env.FINN_KV.get(`walink_${code}`);
  if (!raw) return false;
  const info = JSON.parse(raw);
  if (info.linked) {
    await sendText(phone, "⚠️ Esse código já foi usado. Gere um novo em Configurações no Finn.", env);
    return true;
  }
  // Se o número já pertence a outra conta, não transfere: quem perdeu acesso
  // tem que resolver pelo suporte, senão isso viraria a própria brecha de novo.
  const reg = await whatsappOwnerOf(phone, env);
  if (reg && reg.owner !== info.uid) {
    await sendText(phone, "⚠️ Esse número já está vinculado a outra conta Finn. Fale com o suporte se precisar transferir.", env);
    return true;
  }
  info.linked = true;
  info.phone = String(phone).replace(/\D/g, "");
  await env.FINN_KV.put(`walink_${code}`, JSON.stringify(info), { expirationTtl: 600 });
  await claimWhatsappOwner(phone, info.uid, env);
  await sendText(phone, "✅ *Número confirmado!* Volte pro app Finn — já pode lançar gastos por aqui.\n\nDigite *menu* pra começar.", env);
  return true;
}

async function handleSyncGet(request, env) {
  // Nunca usado pelo app público (só POST /sync é) — tranca atrás do token
  // de admin. Sem isso, qualquer um que soubesse um telefone lia o extrato
  // financeiro completo da pessoa.
  if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  if (!phone) return corsResponse(new Response(JSON.stringify({error:"phone required"}),{status:400,headers:{"Content-Type":"application/json"}}));

  try {
    let data = { phone, txs: [], limits: {}, goals: [] };
    let fixed = [];
    let matched = null;
    for (const cand of phoneVariants(phone)) {
      const d = await getUserData(cand, env);
      if (d && (d.txs?.length || Object.keys(d.limits || {}).length || d.goals?.length)) {
        data = d; fixed = await getFixedBills(cand, env); matched = cand; break;
      }
    }
    return corsResponse(new Response(JSON.stringify({ok:true, data, fixed, matched, tried: phoneVariants(phone)}),{status:200,headers:{"Content-Type":"application/json"}}));
  } catch (e) {
    return serverError(e, "handleSyncGet");
  }
}

async function handleSyncDelete(request, env) {
  // Apaga os dados sincronizados de um telefone (data_<phone> e fixed_<phone>,
  // nas duas variantes com/sem o 9) — usado quando alguém quer remover os
  // próprios dados do KV do bot sem esperar o bot voltar do banimento.
  if (!(await requireAdminToken(request, env))) return unauthorizedResponse();
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  if (!phone) return corsResponse(new Response(JSON.stringify({error:"phone required"}),{status:400,headers:{"Content-Type":"application/json"}}));

  try {
    const variants = phoneVariants(phone);
    for (const cand of variants) {
      await env.FINN_KV.delete(`data_${cand}`);
      await env.FINN_KV.delete(`fixed_${cand}`);
    }
    return corsResponse(new Response(JSON.stringify({ok:true, deleted: variants}),{status:200,headers:{"Content-Type":"application/json"}}));
  } catch (e) {
    return serverError(e, "handleSyncDelete");
  }
}

// Plano de quem chamou, direto da tabela subscriptions — usando o próprio
// access_token do usuário (a RLS "select own" já restringe à linha dele
// mesmo sem filtrar por user_id), nunca confiando num plano vindo do cliente.
async function fetchUserPlan(accessToken, env) {
  if (!accessToken) return "free";
  try {
    const r = await fetch(SUPA_URL_CHECK + "/rest/v1/subscriptions?select=plan", {
      headers: { apikey: SUPA_ANON_KEY_CHECK, Authorization: "Bearer " + accessToken }
    });
    if (!r.ok) return "free";
    const rows = await r.json();
    return (rows[0] && rows[0].plan) || "free";
  } catch (e) {
    return "free";
  }
}

async function handleSync(request, env) {
  let body;
  try { body=await request.json(); } catch { return corsResponse(new Response(JSON.stringify({error:"Invalid JSON"}),{status:400})); }
  const {phone,telegram_chat_id,data,fixed,access_token,admin_password}=body;
  // Canal Telegram usa "tg:<chatId>" como identificador — mesma chave de KV
  // que o resto do bot já trata como um "phone" genérico.
  const isTelegram = !!telegram_chat_id;
  // O identificador que vira chave de KV NUNCA sai cru do cliente: telefone só
  // dígitos (normalizePhone) e chat do Telegram só o número do chat.
  const normPhone = isTelegram ? null : normalizePhone(phone);
  const normChat = isTelegram ? normTelegramChatId(telegram_chat_id) : null;
  if (!isTelegram && !normPhone) {
    return corsResponse(new Response(JSON.stringify({error:"invalid phone"}),{status:400,headers:{"Content-Type":"application/json"}}));
  }
  if (isTelegram && !normChat) {
    return corsResponse(new Response(JSON.stringify({error:"invalid telegram_chat_id"}),{status:400,headers:{"Content-Type":"application/json"}}));
  }
  const uid = isTelegram ? ("tg:" + normChat) : normPhone;
  if (!uid) return corsResponse(new Response(JSON.stringify({error:"phone or telegram_chat_id required"}),{status:400}));

  // Só deixa sincronizar o telefone/chat que a PRÓPRIA conta logada vinculou
  // ao perfil — sem isso, POST /sync com qualquer identificador lia ou
  // sobrescrevia os dados financeiros de qualquer pessoa, sem autenticação.
  const user = await verifySupabaseUser(access_token);
  if (!user) {
    await debugLog(env, { kind: "sync_unauthorized", isTelegram, uid, hasAccessToken: !!access_token });
    return unauthorizedResponse();
  }
  if (isTelegram) {
    const ownChatId = user.user_metadata && String(user.user_metadata.telegram_chat_id || "");
    if (!ownChatId || ownChatId !== normChat) {
      await debugLog(env, { kind: "sync_telegram_mismatch", sentChatId: String(telegram_chat_id), ownChatIdOnAccount: ownChatId || null, email: user.email });
      return corsResponse(new Response(JSON.stringify({ error: "telegram_chat_id does not match authenticated account" }), {
        status: 403, headers: { "Content-Type": "application/json" }
      }));
    }
    // O metadata acima é auto-declarado — não prova nada sozinho. Quem manda
    // é o registro de posse gravado quando a pessoa mandou o código pelo
    // Telegram dela (mesma regra do WhatsApp logo abaixo).
    if (!(await telegramOwnershipOk(normChat, user, env))) {
      await debugLog(env, { kind: "sync_tg_owner_mismatch", chatId: normChat, email: user.email });
      return corsResponse(new Response(JSON.stringify({ error: "telegram_not_verified" }), {
        status: 403, headers: { "Content-Type": "application/json" }
      }));
    }
    await debugLog(env, { kind: "sync_telegram_ok", uid, email: user.email, txCount: (data && data.txs && data.txs.length) || 0 });
  } else {
    const ownWhatsapp = user.user_metadata && user.user_metadata.whatsapp;
    if (!phonesMatch(normPhone, ownWhatsapp)) {
      return corsResponse(new Response(JSON.stringify({ error: "phone does not match authenticated account" }), {
        status: 403, headers: { "Content-Type": "application/json" }
      }));
    }
    // O metadata acima é auto-declarado — não prova nada sozinho. Quem manda é
    // o registro de posse verificado no servidor (ver whatsappOwnershipOk).
    if (!(await whatsappOwnershipOk(normPhone, user, env))) {
      await debugLog(env, { kind: "sync_wa_owner_mismatch", phone: normPhone, email: user.email });
      return corsResponse(new Response(JSON.stringify({ error: "phone_not_verified" }), {
        status: 403, headers: { "Content-Type": "application/json" }
      }));
    }
  }
  const isMaster = user.email && user.email.toLowerCase() === MASTER_EMAIL.toLowerCase()
    && env.MASTER_ADMIN_PASSWORD && admin_password === env.MASTER_ADMIN_PASSWORD;
  const plan = isMaster ? "pro" : await fetchUserPlan(access_token, env);
  // Consentimento pro resumo diário automático vem sempre do metadata
  // verificado no Supabase (nunca do body do cliente) — mesmo tratamento
  // de confiança que já existe pro plano. Sem opt-in explícito, o cron de
  // resumo diário (sendDailyDashboards) nunca manda nada pra esse telefone.
  const dailyDashboardOptIn = !!(user.user_metadata && user.user_metadata.daily_dashboard_optin);

  try {
    // Se o número já tem dados salvos numa variação (com/sem o 9º dígito —
    // ex.: quem conversou pelo bot antes de cadastrar o número no site), grava
    // nessa mesma chave. Senão a sincronização do site e a conversa ao vivo
    // ficam em duas chaves diferentes e nunca se encontram. Telegram não tem
    // esse problema de variação — o chatId é sempre um valor único.
    let targetPhone = uid;
    let existingData = null;
    if (isTelegram) {
      existingData = await getUserData(uid, env);
    } else {
      for (const cand of phoneVariants(normPhone)) {
        const existing = await getUserData(cand, env);
        if (existing && (existing.txs?.length || Object.keys(existing.limits || {}).length || existing.goals?.length)) {
          targetPhone = cand;
          existingData = existing;
          break;
        }
      }
    }

    if (data) {
      // Funde por id em vez de substituir a lista inteira: um lançamento feito
      // pelo bot entre o último carregamento do site e este sync não pode
      // sumir só porque o site mandou uma foto antiga dos próprios dados.
      //
      // A leitura é feita AQUI, coladinha na escrita, e a escrita é direta no
      // KV — não via saveUserData. Antes o merge usava `existingData`, lido lá
      // no começo do handler, e o saveUserData fazia um SEGUNDO read por
      // baixo: o `{...existing, ...data}` dele devolvia o array fundido com a
      // foto ANTIGA por cima do que estava no KV agora. Ou seja, o merge
      // existia mas era desfeito na hora de gravar. Cenário real: a pessoa
      // toca "✅ Confirmar" no WhatsApp enquanto o app carrega — o bot
      // responde "Despesa registrada!" e o lançamento some.
      //
      // Isso ESTREITA a janela de corrida (de "toda a duração do handler" pra
      // "entre estas duas linhas"), não a elimina: o KV não tem
      // read-modify-write atômico. Fechar de vez exigiria uma chave por
      // transação, como o log de debug já faz.
      const atual = await getUserData(targetPhone, env);
      if (data.txs && atual && atual.txs) {
        const byId = new Map(data.txs.map(t => [t.id, t]));
        atual.txs.forEach(t => { if (!byId.has(t.id)) byId.set(t.id, t); });
        data.txs = [...byId.values()];
      }
      data.plan = plan; // sempre o plano atual, direto da fonte, nunca do cliente
      data.dailyDashboardOptIn = dailyDashboardOptIn;
      await env.FINN_KV.put(`data_${targetPhone}`, JSON.stringify({ ...atual, ...data, phone: targetPhone }));
    } else {
      await saveUserData(targetPhone, { plan, dailyDashboardOptIn }, env);
    }
    if (fixed) await env.FINN_KV.put(`fixed_${targetPhone}`,JSON.stringify(fixed));
    return corsResponse(new Response(JSON.stringify({ok:true,phone:targetPhone}),{status:200,headers:{"Content-Type":"application/json"}}));
  } catch (e) {
    return serverError(e, "handleSync");
  }
}

// =============================================================================
// LANÇAMENTOS DO BOT — pull-back pro Supabase (GET /bot-txs + POST /bot-txs/ack)
// =============================================================================
// O /sync acima só manda dados do app PRO bot (uma via). Um lançamento
// criado na conversa (WhatsApp ou Telegram) ficava só no KV do bot pra
// sempre — a mensagem de "sincronizar" prometia "abra o app e sincroniza
// automático", mas isso nunca foi implementado de verdade. Esses dois
// endpoints fecham o ciclo: o app busca os lançamentos do bot ainda não
// puxados, insere no Supabase, e confirma (ack) quais IDs já foram — sem
// isso, cada carregamento reimportaria os mesmos lançamentos de novo.
//
// Mesma regra de autenticação do /sync (dono verificado via Supabase),
// fatorada aqui pra não duplicar em três lugares.
async function resolveBotIdentity(phone, telegramChatId, accessToken, env) {
  const isTelegram = !!telegramChatId;
  const user = await verifySupabaseUser(accessToken);
  if (!user) return { error: "unauthorized" };
  if (isTelegram) {
    // Validado, nao mutilado: "tg:" + valor cru do cliente montava chave de KV
    // arbitraria, e o strip de nao-digitos quebrava grupo (id negativo).
    const normChat = normTelegramChatId(telegramChatId);
    if (!normChat) return { error: "forbidden" };
    const ownChatId = user.user_metadata && String(user.user_metadata.telegram_chat_id || "");
    if (!ownChatId || ownChatId !== normChat) return { error: "forbidden" };
    // Mesma checagem do /sync: metadata auto-declarado não autoriza sozinho.
    if (!(await telegramOwnershipOk(normChat, user, env))) return { error: "forbidden" };
    return { uid: "tg:" + normChat };
  }
  const normPhone = normalizePhone(phone);
  if (!normPhone) return { error: "forbidden" };
  const ownWhatsapp = user.user_metadata && user.user_metadata.whatsapp;
  if (!phonesMatch(normPhone, ownWhatsapp)) return { error: "forbidden" };
  // Mesma checagem do /sync: metadata auto-declarado não autoriza sozinho.
  if (!(await whatsappOwnershipOk(normPhone, user, env))) return { error: "forbidden" };
  let uid = normPhone;
  for (const cand of phoneVariants(normPhone)) {
    const existing = await getUserData(cand, env);
    if (existing && (existing.txs?.length || Object.keys(existing.limits || {}).length || existing.goals?.length)) {
      uid = cand;
      break;
    }
  }
  return { uid };
}

async function handleBotTxsGet(request, env) {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  const telegramChatId = url.searchParams.get("telegram_chat_id");
  const accessToken = bearerToken(request);
  if (!phone && !telegramChatId) {
    return corsResponse(new Response(JSON.stringify({ error: "phone or telegram_chat_id required" }), { status: 400, headers: { "Content-Type": "application/json" } }));
  }
  const identity = await resolveBotIdentity(phone, telegramChatId, accessToken, env);
  if (identity.error === "unauthorized") return unauthorizedResponse();
  if (identity.error === "forbidden") {
    return corsResponse(new Response(JSON.stringify({ error: "not authorized for this identity" }), { status: 403, headers: { "Content-Type": "application/json" } }));
  }
  const data = await getUserData(identity.uid, env);
  const txs = (data.txs || []).filter(t => (t.source === "whatsapp" || t.source === "telegram") && !t.claimed);
  return corsResponse(new Response(JSON.stringify({ ok: true, txs }), { status: 200, headers: { "Content-Type": "application/json" } }));
}

async function handleBotTxsAck(request, env) {
  let body;
  try { body = await request.json(); } catch { return corsResponse(new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })); }
  const { phone, telegram_chat_id, access_token, ids } = body;
  if ((!phone && !telegram_chat_id) || !Array.isArray(ids)) {
    return corsResponse(new Response(JSON.stringify({ error: "invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } }));
  }
  const identity = await resolveBotIdentity(phone, telegram_chat_id, access_token, env);
  if (identity.error === "unauthorized") return unauthorizedResponse();
  if (identity.error === "forbidden") {
    return corsResponse(new Response(JSON.stringify({ error: "not authorized for this identity" }), { status: 403, headers: { "Content-Type": "application/json" } }));
  }
  const data = await getUserData(identity.uid, env);
  const idSet = new Set(ids);
  data.txs = (data.txs || []).map(t => idSet.has(t.id) ? { ...t, claimed: true } : t);
  await env.FINN_KV.put(`data_${identity.uid}`, JSON.stringify(data));
  return corsResponse(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
}

// =============================================================================
// DAILY DASHBOARD (cron 01:00 UTC = 22:00 BRT)
// =============================================================================
async function sendDailyDashboards(env) {
  // Mensagem proativa (a conta iniciada pelo bot, não pelo usuário) é
  // diferencial do Pro — free/plus só recebem quando eles mesmos chamam.
  //
  // Isso só pode sair como Message Template aprovado pela Meta: texto
  // livre (type "text") fora da janela de 24h de atendimento é proibido
  // pela política do WhatsApp Business e foi o que derrubou a conta antes
  // (mensagem automática todo dia, sem o usuário ter chamado primeiro).
  // Também exige opt-in explícito — sem os dois (template + consentimento
  // registrado), não manda nada.
  const list = await listAllKeys(env, "data_");
  for (const key of list) {
    const phone=key.name.replace("data_","");
    if (!phone) continue;
    try {
      const data=await getUserData(phone,env);
      if (!data?.txs?.length) continue;
      if (!data.dailyDashboardOptIn) continue;
      // Opt-out feito pelo chat ("parar") vence o checkbox do app. O /sync
      // reescreve dailyDashboardOptIn a partir do metadata a cada carregamento
      // do app, entao sem esta linha o "parar" durava ate a proxima vez que a
      // pessoa abrisse o Finn.
      if (data.dailyDashboardOptOutChat) continue;
      if (PREMIUM_ENFORCEMENT_ENABLED && (data.plan || "free") !== "pro") continue;
      // O Telegram não tem a janela de 24h de atendimento da política do
      // WhatsApp Business — texto livre iniciado pelo bot é permitido lá,
      // sem precisar de Message Template aprovado pela Meta.
      if (isTelegramId(phone)) await sendText(phone, buildDashboardMessage(data, env), env);
      else await sendDailyDashboardTemplate(phone,data,env);
    } catch(err) { console.error(`Dashboard error for ${phone}:`,err); }
  }
}

const MESES_EXTENSO_BOT = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

// Mesma regra de sequência do app (finn/index.html: computeStreak) — dias
// com pelo menos 1 lançamento, contando de hoje pra trás. Se hoje ainda não
// tem nada, conta a partir de ontem em vez de zerar na hora (o resumo das
// 22h é justamente o empurrão pra não deixar a sequência morrer).
function computeStreakBot(txs) {
  const dias = {};
  (txs || []).forEach(t => { if (t.date) dias[t.date.slice(0, 10)] = true; });
  const cursor = nowBR();
  const hojeStr = cursor.toISOString().slice(0, 10);
  if (!dias[hojeStr]) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (streak < 3660) {
    if (!dias[cursor.toISOString().slice(0, 10)]) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function despesaDoMesBot(txs, year, month) {
  return (txs || [])
    .filter(t => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month && t.val < 0 && isFlowTx(t); })
    .reduce((s, t) => s + Math.abs(t.val), 0);
}

// Mesma regra do app (comparacaoDespesaMesAnterior): null quando não há
// base de comparação (mês anterior sem despesa) ou a diferença é
// desprezível (<1%) — melhor não falar nada do que exibir "∞% a mais".
function comparacaoMesAnteriorBot(txs, year, month, despesaAtual) {
  const anteriorDate = new Date(year, month - 1, 1);
  const despesaAnterior = despesaDoMesBot(txs, anteriorDate.getFullYear(), anteriorDate.getMonth());
  if (despesaAnterior <= 0) return null;
  const pct = ((despesaAtual - despesaAnterior) / despesaAnterior) * 100;
  if (Math.abs(pct) < 1) return null;
  const nomeMesAnterior = MESES_EXTENSO_BOT[anteriorDate.getMonth()];
  return pct < 0
    ? `${Math.round(Math.abs(pct))}% a menos que em ${nomeMesAnterior} 🎉`
    : `${Math.round(pct)}% a mais que em ${nomeMesAnterior}`;
}

function buildDashboardMessage(data, env) {
  const now=nowBR();
  const year=now.getFullYear(),month=now.getMonth();
  const finnUrl=env.FINN_URL||"";
  const todayStr=now.toISOString().slice(0,10);
  const todayTxs=(data.txs||[]).filter(tx=>tx.date?.slice(0,10)===todayStr);
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===year&&d.getMonth()===month;});
  const tR=todayTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const tD=todayTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const mR=monthTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const mD=monthTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const mS=mR-mD;
  const limits=data.limits||{};
  const byCat={};
  monthTxs.filter(t=>t.val<0&&isFlowTx(t)).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});
  const catAlerts=Object.entries(byCat).filter(([cat])=>limits[cat]).map(([cat,spent])=>{
    const pct=(spent/limits[cat])*100;
    if(pct>=100) return `  🔴 ${catToEmoji(cat)} ${cat}: ${Math.round(pct)}%`;
    if(pct>=80) return `  🟡 ${catToEmoji(cat)} ${cat}: ${Math.round(pct)}%`;
    return null;
  }).filter(Boolean);
  const dateStr=now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
  const closing=getMotivationalLine(mD,mR,mS);
  const streak=computeStreakBot(data.txs);
  const comparacao=comparacaoMesAnteriorBot(data.txs, year, month, mD);
  let msg=`📊 *FINN. — DASHBOARD DAS 22H*\n━━━━━━━━━━━━━━━\n📅 ${capitalizeFirst(dateStr)}\n\n`;
  if(todayTxs.length) msg+=`*Hoje:*\n  💰 R$ ${formatBRL(tR)}  💸 R$ ${formatBRL(tD)}\n\n`;
  else msg+=`_Nenhum lançamento hoje._\n\n`;
  msg+=`*Mês:*\n  💰 Receitas: R$ ${formatBRL(mR)}\n  💸 Despesas: R$ ${formatBRL(mD)}\n  ${mS>=0?"📈":"📉"} Saldo: R$ ${formatBRL(mS)}\n`;
  // comparacao ja termina com " 🎉" quando gastou menos — usar 🎉 tambem como
  // prefixo deixava "🎉 Você gastou 23% a menos que em julho 🎉".
  if(comparacao) msg+=`  ${comparacao.includes("a menos")?"✅":"📊"} Você gastou ${comparacao}\n`;
  if(catAlerts.length) msg+=`\n*Limites:*\n${catAlerts.join("\n")}\n`;
  if(streak>=2) msg+=`\n🔥 *${streak} dias seguidos* registrando no Finn!\n`;
  msg+=`\n━━━━━━━━━━━━━━━\n_${closing}_\n\n👉 ${finnUrl}`;
  return msg;
}

// Envia o resumo diário como Message Template aprovado pela Meta — única
// forma permitida de mensagem iniciada pelo bot fora da janela de 24h de
// atendimento. O template (nome em env.DAILY_DASHBOARD_TEMPLATE_NAME) tem
// que estar cadastrado e aprovado no WhatsApp Manager antes de configurar
// essa variável; sem ela, a função não manda nada (fail-safe, nunca cai
// pra texto livre por engano).
//
// O template tem 4 variáveis no corpo — {{3}} e {{4}} nunca podem vir vazias
// (a Meta rejeita parâmetro de texto vazio), por isso sempre têm um texto de
// fallback quando não há sequência ativa ou base de comparação.
// nomeForcado existe só pro teste manual do admin: permite provar que o
// template funciona ANTES de a secret estar configurada. O envio automático
// das 22h nunca passa esse argumento — continua dependendo da secret, que é
// o fail-safe contra mandar mensagem proativa sem o template certo.
async function sendDailyDashboardTemplate(phone, data, env, nomeForcado) {
  const templateName = nomeForcado || env.DAILY_DASHBOARD_TEMPLATE_NAME;
  if (!templateName) return;
  const now=nowBR();
  const year=now.getFullYear(),month=now.getMonth();
  const todayStr=now.toISOString().slice(0,10);
  const todayTxs=(data.txs||[]).filter(tx=>tx.date?.slice(0,10)===todayStr);
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===year&&d.getMonth()===month;});
  const tR=todayTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const tD=todayTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const mR=monthTxs.filter(t=>t.val>0&&isFlowTx(t)).reduce((s,t)=>s+t.val,0);
  const mD=monthTxs.filter(t=>t.val<0&&isFlowTx(t)).reduce((s,t)=>s+Math.abs(t.val),0);
  const mS=mR-mD;
  const hojeResumo = todayTxs.length
    ? `recebeu R$ ${formatBRL(tR)} e gastou R$ ${formatBRL(tD)}`
    : "não teve nenhum lançamento";
  const saldoMes = `R$ ${formatBRL(mS)}`;
  const streak=computeStreakBot(data.txs);
  const streakTexto = streak>=2 ? `🔥 ${streak} dias seguidos` : "Comece uma sequência hoje 💪";
  const comparacao=comparacaoMesAnteriorBot(data.txs, year, month, mD);
  const comparacaoTexto = comparacao ? `Você gastou ${comparacao}` : "Continue registrando pra ver comparações 📊";
  return metaPost({
    messaging_product: "whatsapp",
    to: phone,
    type: "template",
    template: {
      name: templateName,
      language: { code: "pt_BR" },
      components: [{
        type: "body",
        parameters: [
          { type: "text", text: hojeResumo },
          { type: "text", text: saldoMes },
          { type: "text", text: streakTexto },
          { type: "text", text: comparacaoTexto }
        ]
      }]
    }
  }, env);
}

function getMotivationalLine(despesas, receitas, saldo) {
  if(saldo<0) return ["O saldo foi negativo, mas amanhã é nova chance. 💪","Ajusta o rumo amanhã!","A consciência financeira fica. Continua firme!"][Math.floor(Math.random()*3)];
  if(despesas>receitas*0.9) return ["No limite, mas no controle. 🏄","Quase estourou, mas não estourou. Isso conta! 😄"][Math.floor(Math.random()*2)];
  if(saldo>receitas*0.3) return ["Você está indo muito bem! 🎉","Saldo positivo e mindset de crescimento! 🚀"][Math.floor(Math.random()*2)];
  return ["Mais um dia rumo à liberdade financeira.","Consciência financeira é superpoder. 🦸","Cada lançamento registrado é uma vitória! ✅"][Math.floor(Math.random()*3)];
}

// =============================================================================
// STATUS ENDPOINT — verifica se o token Meta ainda é válido
// =============================================================================
async function handleStatus(env) {
  const checks = { token: false, kv: false, phoneNumberId: !!env.WHATSAPP_PHONE_NUMBER_ID, errors: [] };
  try {
    const r = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}`, {
      headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }
    });
    checks.token = r.ok;
    if (!r.ok) {
      const body = await r.text();
      checks.errors.push(`Meta API ${r.status}: ${body.slice(0, 200)}`);
    }
  } catch(e) { checks.errors.push(`Meta fetch error: ${e.message}`); }
  try {
    await env.FINN_KV.get("__healthcheck__");
    checks.kv = true;
  } catch(e) { checks.errors.push(`KV error: ${e.message}`); }
  const ok = checks.token && checks.kv && checks.phoneNumberId;
  return corsResponse(new Response(JSON.stringify({ ok, checks }, null, 2), {
    status: ok ? 200 : 503,
    headers: { "Content-Type": "application/json" }
  }));
}

// =============================================================================
// REGISTER NUMBER — chama o /register da Cloud API direto, com o PIN de
// verificação em duas etapas. A tela do Meta Developer só devolve "Falha na
// inscrição" genérico quando isso dá errado (PIN antigo diferente, número
// ainda preso a um vínculo anterior, etc.) — aqui a resposta crua da Graph
// API tem o código e a mensagem reais, então dá pra saber a causa de fato
// em vez de adivinhar pela UI.
// =============================================================================
async function handleWhatsAppRegisterNumber(request, env) {
  const url = new URL(request.url);
  const pin = url.searchParams.get("pin");
  if (!pin || !/^\d{6}$/.test(pin)) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro: "Passe ?pin=XXXXXX (6 dígitos) na URL." }, null, 2), {
      status: 400, headers: { "Content-Type": "application/json" }
    }));
  }
  if (!env.WHATSAPP_PHONE_NUMBER_ID) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro: "WHATSAPP_PHONE_NUMBER_ID não configurado." }, null, 2), {
      status: 400, headers: { "Content-Type": "application/json" }
    }));
  }
  let body;
  try {
    const r = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/register`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", pin })
    });
    body = await r.json();
    return corsResponse(new Response(JSON.stringify({ ok: r.ok, http: r.status, resposta_da_meta: body }, null, 2), {
      status: 200, headers: { "Content-Type": "application/json" }
    }));
  } catch (e) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro: String(e) }, null, 2), {
      status: 500, headers: { "Content-Type": "application/json" }
    }));
  }
}

// =============================================================================
// HEALTH — raio-X completo da conexão com o WhatsApp, numa chamada só.
// O /status acima só diz "o token responde ou não"; quando a conta esteve
// desabilitada, isso não bastava pra saber SE dava pra voltar e O QUE
// faltava. Aqui pergunta pra própria Meta, em 4 frentes:
//   1. a conta (WABA) está aprovada ou ainda em análise/restrita?
//   2. o número está conectado, verificado e com que nota de qualidade?
//   3. este app está inscrito nos eventos (senão o webhook nunca chega)?
//   4. o token é válido (o /status já cobre, repetido aqui pro relatório
//      ficar completo num lugar só).
// Cada bloco falha isolado — um erro em um não impede os outros de
// responderem, senão o diagnóstico ficaria cego justo quando mais importa.
// =============================================================================
async function handleWhatsAppHealth(env) {
  const out = { checked_at: new Date().toISOString(), veredito: "", conta: {}, numero: {}, webhook: {}, token: {} };

  // Pista segura sobre o WHATSAPP_VERIFY_TOKEN — nunca o valor em si, só
  // tamanho e os 2 últimos caracteres. Serve pra confirmar, de fora do
  // painel confuso do Cloudflare, se o valor editado realmente chegou no
  // worker publicado (edições de secret às vezes ficam num rascunho não
  // publicado, e o "Forbidden" do /webhook não diz isso).
  const vt = env.WHATSAPP_VERIFY_TOKEN || "";
  out.verify_token_pista = { existe: !!env.WHATSAPP_VERIFY_TOKEN, tamanho: vt.length, ultimos_2: vt.slice(-2) };

  // Mesma pista, agora pro META_APP_SECRET — usado quando o /webhook (POST)
  // fica rejeitando tudo com "assinatura inválida" mesmo depois de trocar o
  // secret. App Secret da Meta tem 32 caracteres hex; se o tamanho vier
  // diferente disso, é sinal de cola errada (aspas, quebra de linha, campo
  // trocado) em vez do secret em si estar desatualizado.
  const as = env.META_APP_SECRET || "";
  out.app_secret_pista = { existe: !!env.META_APP_SECRET, tamanho: as.length, ultimos_2: as.slice(-2) };

  async function metaGet(path) {
    const r = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${path}`, {
      headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }
    });
    let body;
    try { body = await r.json(); } catch (e) { body = { parse_error: String(e) }; }
    return { ok: r.ok, status: r.status, body };
  }

  // 1. Token — testado contra /me, que responde pra QUALQUER token válido.
  //    Testar contra o phone_number_id (como o /status fazia) confunde dois
  //    problemas bem diferentes: token morto e número inacessível. Os dois
  //    davam "token: false", escondendo que a conta é que estava restrita.
  try {
    const me = await metaGet(`me?fields=id,name`);
    out.token = { valido: me.ok, http: me.status };
    if (me.ok) out.token.dono = me.body && (me.body.name || me.body.id);
    else out.token.erro = me.body && me.body.error;
  } catch (e) { out.token = { valido: false, erro: String(e) }; }

  // 1a. QUAIS contas esse token enxerga? Quando todo ID dá "does not exist"
  //     mas o token é válido, o problema é permissão — e a única forma de
  //     confirmar (em vez de adivinhar) é perguntar à Meta o que esse
  //     usuário do sistema tem atribuído. Se vier vazio, falta conceder
  //     acesso; se vier com um ID diferente do configurado, é só corrigir.
  try {
    const mine = await metaGet(`me/assigned_whatsapp_business_accounts?fields=id,name,account_review_status`);
    out.contas_visiveis_pelo_token = mine.ok
      ? (mine.body.data || []).map(w => ({ id: w.id, nome: w.name, review: w.account_review_status }))
      : { erro: mine.body && mine.body.error, http: mine.status };
  } catch (e) { out.contas_visiveis_pelo_token = { erro: String(e) }; }

  // 1b. O número configurado responde? Separado do token de propósito —
  //     é essa diferença que diz se o problema é credencial ou permissão.
  try {
    const pn = await metaGet(`${env.WHATSAPP_PHONE_NUMBER_ID}?fields=id,display_phone_number,verified_name,quality_rating`);
    out.numero_configurado = pn.ok
      ? { acessivel: true, id: pn.body.id, numero: pn.body.display_phone_number, nome: pn.body.verified_name }
      : { acessivel: false, http: pn.status, erro: pn.body && pn.body.error };
  } catch (e) { out.numero_configurado = { acessivel: false, erro: String(e) }; }

  // 2. Conta (WABA) — account_review_status é o campo que diz se a Meta
  //    liberou a conta ("APPROVED") ou não.
  try {
    const waba = await metaGet(`${env.WHATSAPP_WABA_ID}?fields=id,name,account_review_status,timezone_id,message_template_namespace`);
    out.conta = waba.ok
      ? { id: waba.body.id, nome: waba.body.name, review: waba.body.account_review_status }
      : { erro: waba.body && waba.body.error, http: waba.status };
  } catch (e) { out.conta = { erro: String(e) }; }

  // 3. Número — status CONNECTED + verificação + nota de qualidade.
  try {
    const nums = await metaGet(`${env.WHATSAPP_WABA_ID}/phone_numbers?fields=id,display_phone_number,verified_name,status,quality_rating,code_verification_status`);
    out.numero = nums.ok
      ? { lista: (nums.body.data || []).map(n => ({
          id: n.id,
          numero: n.display_phone_number,
          nome: n.verified_name,
          status: n.status,
          qualidade: n.quality_rating,
          verificacao: n.code_verification_status,
          e_o_configurado: String(n.id) === String(env.WHATSAPP_PHONE_NUMBER_ID)
        })) }
      : { erro: nums.body && nums.body.error, http: nums.status };
  } catch (e) { out.numero = { erro: String(e) }; }

  // 4. Webhook — app inscrito nos eventos da WABA. Sem isso a Meta aceita
  //    tudo mas nunca entrega mensagem nenhuma no worker.
  try {
    const subs = await metaGet(`${env.WHATSAPP_WABA_ID}/subscribed_apps`);
    out.webhook = subs.ok
      ? { inscrito: Array.isArray(subs.body.data) && subs.body.data.length > 0, apps: subs.body.data }
      : { erro: subs.body && subs.body.error, http: subs.status };
  } catch (e) { out.webhook = { erro: String(e) }; }

  // Veredito em português — o objetivo é responder "dá pra usar?" sem
  // precisar interpretar JSON da Meta.
  //
  // A ORDEM aqui é o que importa: o diagnóstico tem que apontar a causa
  // RAIZ, não o primeiro sintoma. Uma conta REJECTED sem número nenhum
  // mostra os dois problemas ao mesmo tempo, mas trocar o ID do número não
  // resolve nada enquanto a conta estiver rejeitada — por isso o status da
  // conta é avaliado antes de qualquer coisa sobre número.
  const listaNumeros = Array.isArray(out.numero.lista) ? out.numero.lista : null;
  const semNenhumNumero = listaNumeros && listaNumeros.length === 0;
  const numeroOk = listaNumeros && listaNumeros.some(n => n.e_o_configurado && n.status === "CONNECTED");
  const numeroConfigInacessivel = out.numero_configurado && out.numero_configurado.acessivel === false;
  const contaReprovada = out.conta.review && out.conta.review !== "APPROVED";

  // Lista de contas que o token realmente enxerga — decide entre "falta
  // permissão" e "o ID configurado está errado", que dão o mesmo erro na
  // Graph API mas exigem consertos completamente diferentes.
  //
  // MAS: só serve como diagnóstico quando a consulta DIRETA à conta (por
  // ID conhecido) falha. /me/assigned_whatsapp_business_accounts já se
  // mostrou um sinal não-confiável (voltou vazio com um token que, na
  // prática, tinha acesso completo e comprovado à conta/número/webhook
  // certos) — então uma consulta direta bem-sucedida sempre vale mais
  // que essa lista, nunca o contrário.
  const contaAcessoDireto = !out.conta.erro && !!out.conta.id;
  const visiveis = Array.isArray(out.contas_visiveis_pelo_token) ? out.contas_visiveis_pelo_token : null;
  const contaConfigVisivel = visiveis && visiveis.some(w => String(w.id) === String(env.WHATSAPP_WABA_ID));

  if (!out.token.valido) {
    out.veredito = "TOKEN INVÁLIDO OU VENCIDO — gere um novo no Meta Developer e rode: wrangler secret put WHATSAPP_ACCESS_TOKEN";
  } else if (!contaAcessoDireto && visiveis && visiveis.length === 0) {
    out.veredito = "O TOKEN É VÁLIDO MAS NÃO TEM NENHUMA CONTA DO WHATSAPP ATRIBUÍDA — no Business Manager: Configurações do negócio → Usuários → Usuários do sistema → (o usuário) → Adicionar ativos → Contas do WhatsApp → marque a conta e dê controle total. Depois gere um token novo.";
  } else if (!contaAcessoDireto && visiveis && !contaConfigVisivel) {
    out.veredito = `O TOKEN ENXERGA OUTRA(S) CONTA(S), NÃO A CONFIGURADA (${env.WHATSAPP_WABA_ID}) — veja 'contas_visiveis_pelo_token' e use o ID de lá no WHATSAPP_WABA_ID.`;
  } else if (contaReprovada && semNenhumNumero) {
    out.veredito = `A CONTA ESTÁ COM ANÁLISE "${out.conta.review}" E NÃO TEM NENHUM NÚMERO — nenhum ajuste no worker resolve enquanto isso não mudar na Meta. É preciso descobrir o motivo da reprovação (Business Manager → Central de Contas/Qualidade) e resolver por lá antes de adicionar número de novo.`;
  } else if (contaReprovada) {
    out.veredito = `CONTA REPROVADA/NÃO APROVADA (status: ${out.conta.review}) — precisa resolver isso na Meta antes de religar o bot. Trocar token ou ID de número não contorna isso.`;
  } else if (out.conta.erro && numeroConfigInacessivel) {
    // Token vivo mas nem conta nem número respondem: o app perdeu acesso
    // à conta inteira (restrição da Meta, ou o app foi desvinculado dela).
    out.veredito = "TOKEN VÁLIDO, MAS ESTE APP NÃO ENXERGA MAIS A CONTA NEM O NÚMERO — a conta business provavelmente segue restrita na Meta, ou o app foi desvinculado dela.";
  } else if (semNenhumNumero) {
    out.veredito = "CONTA APROVADA, MAS SEM NENHUM NÚMERO CADASTRADO — adicione e verifique um número no painel do WhatsApp, depois atualize: wrangler secret put WHATSAPP_PHONE_NUMBER_ID";
  } else if (numeroConfigInacessivel) {
    // Conta responde mas o número específico não: o ID guardado está
    // desatualizado (número recriado costuma ganhar ID novo).
    out.veredito = "CONTA RESPONDE, MAS O ID DO NÚMERO GUARDADO NÃO EXISTE MAIS — veja em 'numero.lista' o ID atual e atualize com: wrangler secret put WHATSAPP_PHONE_NUMBER_ID";
  } else if (out.conta.erro || out.numero.erro) {
    out.veredito = "TOKEN OK, MAS A CONTA/NÚMERO NÃO RESPONDEM — provável que a conta ainda esteja restrita na Meta.";
  } else if (!numeroOk) {
    out.veredito = "CONTA OK, MAS O NÚMERO NÃO ESTÁ CONECTADO — confira o status do número no painel do WhatsApp.";
  } else if (!out.webhook.inscrito) {
    out.veredito = "QUASE LÁ: conta e número OK, só falta inscrever o app nos eventos — chame /subscribe com o token de admin.";
  } else {
    out.veredito = "TUDO CERTO — conta aprovada, número conectado e webhook inscrito. O bot pode voltar a funcionar.";
  }

  return corsResponse(new Response(JSON.stringify(out, null, 2), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
}

// =============================================================================
// SUBSCRIBE — inscreve este app nos eventos da conta do WhatsApp Business.
// Marcar o campo "messages" no painel do Meta NÃO basta: o app também
// precisa estar "subscribed_apps" na WABA, senão a Meta nunca chama o
// webhook, mesmo com tudo mais configurado certo. Passo fácil de pular
// no assistente guiado do Meta Developer — por isso o bot resolve sozinho.
// =============================================================================
async function handleSubscribeWaba(env) {
  const result = { ok: false, steps: [] };
  try {
    const wabaId = env.WHATSAPP_WABA_ID;
    if (!wabaId) {
      result.error = "WHATSAPP_WABA_ID não configurado (veja wrangler.toml).";
      return corsResponse(new Response(JSON.stringify(result, null, 2), { status: 500, headers: { "Content-Type": "application/json" } }));
    }

    const subResp = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${wabaId}/subscribed_apps`,
      { method: "POST", headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` } }
    );
    const subBody = await subResp.json();
    result.steps.push({ step: "subscribe_app", ok: subResp.ok, body: subBody });
    result.ok = subResp.ok;
    await debugLog(env, { kind: "subscribe_waba", ok: result.ok, wabaId, subBody });
  } catch (err) {
    result.error = String(err && err.stack || err);
  }
  return corsResponse(new Response(JSON.stringify(result, null, 2), {
    status: result.ok ? 200 : 502,
    headers: { "Content-Type": "application/json" }
  }));
}

// =============================================================================
// TELEGRAM BOT — canal novo, sem a política de janela de 24h nem verificação
// de empresa que travou o WhatsApp. Reaproveita toda a lógica de conversa
// (processMessage, categorização, resumo, score, etc.) já escrita pro
// WhatsApp: os identificadores de chat do Telegram são tratados como um
// "phone" genérico (prefixo "tg:"), já que getState/getUserData/etc. só
// usam esse valor como chave de KV, nunca validam formato de telefone.
//
// Required env vars:
//   TELEGRAM_BOT_TOKEN     — token do @BotFather
//   TELEGRAM_WEBHOOK_SECRET — string aleatória; confirmada no header
//                             X-Telegram-Bot-Api-Secret-Token de cada webhook
//   TELEGRAM_BOT_USERNAME  — @username do bot (sem @), só pra montar o link
// =============================================================================

function isTelegramId(id) {
  return typeof id === "string" && id.startsWith("tg:");
}

// Chat id do Telegram: digitos com sinal de menos OPCIONAL na frente.
//
// O replace(/\D/g,"") que existia aqui era seguro pra chave de KV, mas comia
// o sinal — e chat de GRUPO no Telegram tem id negativo (-1001234567890).
// O vinculo gravava tgchat_-100... e o metadata guardava "-100...", mas o
// /sync normalizava pra "100..." e nunca batia: 403 permanente, engolido pelo
// .catch do app. Na pratica o bot conversava no grupo e os dados do app nunca
// chegavam la, sem nenhuma mensagem de erro.
//
// Valida em vez de mutilar: string que nao for um inteiro inteiro (com ou sem
// sinal) e rejeitada, o que protege a chave de KV melhor do que remover
// caracteres em silencio.
function normTelegramChatId(v) {
  const t = String(v == null ? "" : v).trim();
  return /^-?\d+$/.test(t) ? t : "";
}

function telegramChatIdOf(phone) {
  return phone.slice(3);
}

async function telegramPost(method, payload, env) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    await debugLog(env, { kind: "telegram_not_configured", method });
    return null;
  }
  const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const bodyText = await resp.clone().text().catch(() => "");
    console.error(`Telegram API error ${resp.status} (${method}):`, bodyText);
    await debugLog(env, { kind: "telegram_send_error", method, status: resp.status, body: bodyText.slice(0, 500) });
  }
  return resp;
}

// Markdown legado do Telegram (*negrito*, _itálico_) é compatível com a
// formatação que o resto do bot já usa pro WhatsApp — mas o parser dele é
// rígido (quebra se sobrar um "*" ou "_" desemparelhado). Se der erro de
// parse, reenvia sem formatação em vez de simplesmente falhar a mensagem.
async function telegramSendMessage(phone, text, env, extra) {
  const chatId = telegramChatIdOf(phone);
  const base = { chat_id: chatId, text, parse_mode: "Markdown", ...(extra || {}) };
  let resp = await telegramPost("sendMessage", base, env);
  if (resp && resp.status === 400) {
    resp = await telegramPost("sendMessage", { chat_id: chatId, text, ...(extra || {}) }, env);
  }
  return resp;
}

async function downloadTelegramFile(fileId, env) {
  if (!env.TELEGRAM_BOT_TOKEN) return null;
  const infoResp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/getFile?file_id=${encodeURIComponent(fileId)}`);
  if (!infoResp.ok) { console.error("Telegram getFile error:", infoResp.status); return null; }
  const infoJson = await infoResp.json();
  const filePath = infoJson.result && infoJson.result.file_path;
  if (!filePath) return null;
  const fileResp = await fetch(`https://api.telegram.org/file/bot${env.TELEGRAM_BOT_TOKEN}/${filePath}`);
  if (!fileResp.ok) { console.error("Telegram file download error:", fileResp.status); return null; }
  return fileResp.arrayBuffer();
}

// Ponto único de download de mídia (áudio/imagem/documento) — despacha pro
// jeito certo de baixar conforme o canal do remetente.
async function downloadMedia(phone, mediaId, env) {
  if (isTelegramId(phone)) return downloadTelegramFile(mediaId, env);
  return downloadMetaMedia(mediaId, env);
}

// Registra o webhook do bot na Telegram — chamado uma vez (admin), depois
// que TELEGRAM_BOT_TOKEN e TELEGRAM_WEBHOOK_SECRET já estiverem configurados
// como secret no wrangler. Espelha o /subscribe do WhatsApp (WABA).
async function handleTelegramSetWebhook(env) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    return corsResponse(new Response(JSON.stringify({ error: "TELEGRAM_BOT_TOKEN não configurado" }), { status: 500, headers: { "Content-Type": "application/json" } }));
  }
  const webhookUrl = (env.FINN_WORKER_URL || "").replace(/\/$/, "") + "/telegram/webhook";
  const resp = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, secret_token: env.TELEGRAM_WEBHOOK_SECRET || undefined })
  });
  const body = await resp.json().catch(() => ({}));
  await debugLog(env, { kind: "telegram_set_webhook", ok: resp.ok, webhookUrl, body });
  return corsResponse(new Response(JSON.stringify({ ok: resp.ok, webhookUrl, body }, null, 2), {
    status: resp.ok ? 200 : 502, headers: { "Content-Type": "application/json" }
  }));
}

// Alfabeto sem 0/O/1/I/L — o código é lido e digitado por gente, e confundir
// esses caracteres queimaria uma tentativa à toa (ver linkAttemptOk).
const LINK_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
// Teto de tentativas de resgate de código, por remetente. Com 31^8 combinações
// e TTL de 10 min a força bruta já era impraticável, mas isso fecha a porta de
// vez e evita que alguém fique martelando o bot de graça.
async function linkAttemptOk(sender, env) {
  if (!env.FINN_KV) return true;
  const win = Math.floor(Date.now() / (900 * 1000)); // janela de 15 min
  const key = `linktry_${String(sender).replace(/[^a-zA-Z0-9:]/g, "")}_${win}`;
  const used = parseInt((await env.FINN_KV.get(key)) || "0", 10) || 0;
  if (used >= 10) return false;
  await env.FINN_KV.put(key, String(used + 1), { expirationTtl: 1800 });
  return true;
}

function randomLinkCode(len) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) out += LINK_CODE_ALPHABET[bytes[i] % LINK_CODE_ALPHABET.length];
  return out;
}

// Gera um código de vínculo pra conta logada — só pra quem está em
// TELEGRAM_ALLOWED_EMAILS, enquanto o canal estiver em teste fechado.
async function handleTelegramLinkStart(request, env) {
  let body;
  try { body = await request.json(); } catch { return corsResponse(new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })); }
  const user = await verifySupabaseUser(body.access_token);
  if (!user) return unauthorizedResponse();
  if (!telegramAllowedEmail(user.email)) {
    return corsResponse(new Response(JSON.stringify({ error: "not_allowed" }), { status: 403, headers: { "Content-Type": "application/json" } }));
  }
  if (!(await linkAttemptOk("gen:" + user.id, env))) {
    return corsResponse(new Response(JSON.stringify({ error: "muitas tentativas, espere alguns minutos" }), { status: 429, headers: { "Content-Type": "application/json" } }));
  }
  // Math.random() não é criptográfico: o gerador do V8 é previsível a partir de
  // algumas saídas observadas, então dava pra prever o código de vínculo de
  // outra pessoa e sequestrar o link. getRandomValues usa a fonte segura.
  const code = randomLinkCode(8);
  await env.FINN_KV.put(`tglink_${code}`, JSON.stringify({ uid: user.id, email: user.email, linked: false }), { expirationTtl: 600 });
  return corsResponse(new Response(JSON.stringify({ ok: true, code, botUsername: env.TELEGRAM_BOT_USERNAME || "" }), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
}

// O app faz polling nisso depois de abrir o link do bot, até receber
// linked:true — é quando o webhook (handleTelegramLinkConfirm) já recebeu
// o /start <code> do lado do Telegram e gravou o chatId.
async function handleTelegramLinkStatus(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return corsResponse(new Response(JSON.stringify({ error: "code required" }), { status: 400, headers: { "Content-Type": "application/json" } }));
  // Exige a sessão de quem gerou o código: antes, qualquer um com o código na
  // mão lia o chatId vinculado sem se autenticar.
  const user = await verifySupabaseUser(bearerToken(request));
  if (!user) return unauthorizedResponse();
  const raw = await env.FINN_KV.get(`tglink_${code}`);
  if (!raw) return corsResponse(new Response(JSON.stringify({ linked: false, expired: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
  const info = JSON.parse(raw);
  if (info.uid !== user.id) return unauthorizedResponse();
  return corsResponse(new Response(JSON.stringify({ linked: !!info.linked, chatId: info.chatId || null }), { status: 200, headers: { "Content-Type": "application/json" } }));
}

async function handleTelegramWebhook(request, env) {
  // Mesma regra do webhook do WhatsApp: sem segredo configurado, recusa em vez
  // de confiar. Com o webhook aberto, um POST forjado consegue se passar por
  // qualquer chat_id já vinculado e escrever na conta da pessoa.
  if (!env.TELEGRAM_WEBHOOK_SECRET) {
    await debugLog(env, { kind: "telegram_webhook_secret_not_configured" });
    return new Response("Forbidden", { status: 403 });
  }
  const secretHeader = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (secretHeader !== env.TELEGRAM_WEBHOOK_SECRET) {
    await debugLog(env, { kind: "telegram_webhook_secret_invalid" });
    return new Response("Forbidden", { status: 403 });
  }

  let update;
  try { update = await request.json(); } catch { return new Response("Bad Request", { status: 400 }); }

  try {
    if (update.callback_query) await processTelegramCallback(update.callback_query, env);
    else if (update.message) await processTelegramMessage(update.message, env);
  } catch (err) {
    console.error("telegram webhook error:", err);
    await debugLog(env, { kind: "telegram_process_error", error: String(err && err.stack || err) });
  }
  return new Response("OK", { status: 200 });
}

// Concretiza o vínculo: o código só existe se alguém de TELEGRAM_ALLOWED_EMAILS
// gerou ele em handleTelegramLinkStart — não precisa checar o email de novo aqui.
async function handleTelegramLinkConfirm(phone, code, env) {
  if (!code) {
    await telegramSendMessage(phone, "👋 Olá! Pra conectar sua conta, gere um código em Configurações no app Finn e mande /start <código> aqui.", env);
    return;
  }
  if (!(await linkAttemptOk(phone, env))) {
    await telegramSendMessage(phone, "⏳ Muitas tentativas de código. Espere alguns minutos e gere um novo no app.", env);
    return;
  }
  const raw = await env.FINN_KV.get(`tglink_${code}`);
  if (!raw) {
    await telegramSendMessage(phone, "⚠️ Código inválido ou expirado. Gere um novo em Configurações no Finn.", env);
    return;
  }
  const info = JSON.parse(raw);
  // Uso único: sem isso, um segundo /start com o mesmo código (dentro dos 10
  // min) sobrescrevia o chatId vinculado — quem mandasse por último ficava com
  // a conta da pessoa.
  if (info.linked) {
    await telegramSendMessage(phone, "⚠️ Esse código já foi usado. Gere um novo em Configurações no Finn.", env);
    return;
  }
  const chatId = telegramChatIdOf(phone);
  info.linked = true;
  info.chatId = chatId;
  await env.FINN_KV.put(`tglink_${code}`, JSON.stringify(info), { expirationTtl: 600 });
  await env.FINN_KV.put(`tgchat_${chatId}`, JSON.stringify({ email: info.email, uid: info.uid, linkedAt: Date.now() }), { expirationTtl: 60 * 60 * 24 * 365 });
  await telegramSendMessage(phone, "✅ *Conta conectada!* Volte pro app Finn — seus lançamentos já vão aparecer por aqui.\n\nDigite *menu* pra começar.", env);
}

async function processTelegramMessage(msg, env) {
  const chatId = msg.chat && msg.chat.id;
  if (chatId === undefined || chatId === null) return;
  const phone = "tg:" + chatId;

  const text = (msg.text || "").trim();
  if (text.startsWith("/start")) {
    const code = text.replace("/start", "").trim();
    return handleTelegramLinkConfirm(phone, code, env);
  }

  // Bot em teste fechado: só responde de verdade pra chat já vinculado a
  // uma das contas em TELEGRAM_ALLOWED_EMAILS (ver handleTelegramLinkConfirm).
  const linkInfo = await env.FINN_KV.get(`tgchat_${chatId}`);
  if (!linkInfo) {
    await telegramSendMessage(phone, "🚧 O Finn no Telegram ainda está em testes fechados. Em breve libero pra todo mundo!", env);
    return;
  }

  let normalized;
  if (msg.voice) normalized = { from: phone, type: "audio", audio: { id: msg.voice.file_id } };
  else if (msg.photo && msg.photo.length) normalized = { from: phone, type: "image", image: { id: msg.photo[msg.photo.length - 1].file_id } };
  else if (msg.document) normalized = { from: phone, type: "document", document: { id: msg.document.file_id, filename: msg.document.file_name, mime_type: msg.document.mime_type } };
  else if (text) normalized = { from: phone, type: "text", text: { body: text } };
  else return;

  await processMessage(normalized, env);
}

async function processTelegramCallback(cq, env) {
  const chatId = cq.message && cq.message.chat && cq.message.chat.id;
  if (chatId === undefined || chatId === null) return;
  const phone = "tg:" + chatId;

  // Responde o callback rápido pra tirar o "carregando" do botão no
  // Telegram, mesmo que o processamento abaixo demore ou falhe.
  await telegramPost("answerCallbackQuery", { callback_query_id: cq.id }, env).catch(() => {});

  const linkInfo = await env.FINN_KV.get(`tgchat_${chatId}`);
  if (!linkInfo) {
    await telegramSendMessage(phone, "🚧 O Finn no Telegram ainda está em testes fechados.", env);
    return;
  }

  const data = cq.data || "";
  const isButtonReply = ["confirm_tx", "cancel_tx", "edit_tx_desc"].includes(data);
  const normalized = {
    from: phone, type: "interactive",
    interactive: isButtonReply
      ? { type: "button_reply", button_reply: { id: data } }
      : { type: "list_reply", list_reply: { id: data } }
  };
  await processMessage(normalized, env);
}

// A Meta responde "accepted" só pra dizer que aceitou a mensagem na fila.
// Se ela some depois, o motivo chega por webhook de status — e o código
// numerico sozinho nao ajuda ninguem. Este mapa traduz os que de fato
// aparecem quando um template aprovado nao chega.
const MOTIVOS_ENTREGA = {
  131049: "A Meta ENGOLIU a mensagem de propósito (\"healthy ecosystem engagement\"). Acontece com template UTILITY/MARKETING mandado pra quem nunca conversou com o número do bot, ou conversou há muito tempo. Solução: mande qualquer mensagem do SEU WhatsApp pro número do bot primeiro — isso abre a janela de 24h e marca engajamento.",
  131026: "Mensagem indeliverável: o número não recebe do seu WhatsApp Business. Causas: número não tem WhatsApp, bloqueou o bot, ou o app ainda está em modo Desenvolvimento na Meta (nesse modo só numeros cadastrados como testador recebem).",
  131047: "Janela de 24h expirada — só se aplica a mensagem de texto livre. Se apareceu num template, o template não foi aceito como tal.",
  132015: "Template PAUSADO pela Meta por qualidade ruim. Fica aprovado mas não entrega.",
  132000: "Número de variáveis do template não bate com o que o bot manda.",
  133010: "Número do bot não está registrado na Cloud API.",
  130472: "O número do destinatário está num experimento da Meta e não recebe mensagens de negócio.",
};

// GET /whatsapp/entregas — o que a Meta reportou DEPOIS do "accepted".
// Sem isso, uma mensagem aceita e nunca entregue é indistinguível de uma
// entregue, que era exatamente o beco sem saída aqui.
async function handleWhatsAppEntregas(env) {
  const cors = { "Content-Type": "application/json" };
  if (!env.FINN_KV) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro: "KV não configurado" }), { status: 500, headers: cors }));
  }
  const keys = await listAllKeys(env, DEBUG_PREFIX);
  keys.sort((a, b) => b.name.localeCompare(a.name));
  const eventos = (await Promise.all(keys.slice(0, 60).map(k => env.FINN_KV.get(k.name))))
    .filter(Boolean)
    .map(raw => { try { return JSON.parse(raw); } catch (e) { return null; } })
    .filter(Boolean);

  const entregas = eventos.filter(e => e.kind === "status").map(e => {
    const erro = (e.errors && e.errors[0]) || null;
    const codigo = erro && (erro.code || (erro.error_data && erro.error_data.code));
    return {
      em: e.at, status: e.status, destinatario: e.recipient,
      codigo: codigo || undefined,
      mensagem_meta: erro ? (erro.title || erro.message) : undefined,
      explicacao: codigo && MOTIVOS_ENTREGA[codigo] ? MOTIVOS_ENTREGA[codigo] : undefined,
    };
  });
  const recusas = eventos.filter(e => e.kind === "meta_send_error")
    .map(e => ({ em: e.at, http: e.status, corpo: e.body }));

  let veredito;
  if (!entregas.length && !recusas.length) {
    // Silêncio total aqui quase sempre é webhook não assinado — a Meta manda
    // os status pra um endpoint que ninguém está ouvindo.
    veredito = "NENHUM status recebido nas últimas 24h. Ou nada foi enviado, ou o webhook não está inscrito no campo 'messages' da WABA (é ele que traz delivered/failed). Chame GET /subscribe pra inscrever e teste de novo.";
  } else if (entregas.some(e => e.status === "delivered" || e.status === "read")) {
    veredito = "Teve mensagem ENTREGUE. Se você não viu, confira o número (DDI/DDD) e se o bot não está silenciado ou arquivado no seu WhatsApp.";
  } else if (entregas.some(e => e.status === "failed")) {
    veredito = "A Meta FALHOU na entrega — veja 'explicacao' do evento mais recente.";
  } else {
    veredito = "Só há status intermediário (sent/accepted): a Meta pegou a mensagem mas ainda não confirmou entrega. Se ficar assim por minutos, trate como não entregue.";
  }

  return corsResponse(new Response(JSON.stringify({
    ok: true, veredito, entregas: entregas.slice(0, 20), recusas_no_envio: recusas.slice(0, 10)
  }, null, 2), { status: 200, headers: cors }));
}

// POST /whatsapp/test-daily-template { phone } — manda o resumo diário AGORA,
// pro número indicado, sem esperar as 22h. Existe porque o modo de falha aqui
// é silencioso: se o número de variáveis do template não bater com o que o
// código manda, a Meta recusa e só se descobre no dia seguinte, sem mensagem
// nenhuma. Aqui a resposta da Meta volta na hora.
async function handleWhatsAppTestDailyTemplate(request, env) {
  const cors = { "Content-Type": "application/json" };
  const erro = (msg, status) => corsResponse(new Response(JSON.stringify({ ok: false, erro: msg }, null, 2), { status, headers: cors }));

  let corpo;
  try { corpo = await request.json(); } catch (e) { return erro("corpo invalido", 400); }
  const phone = normalizePhone(corpo && corpo.phone);
  if (!phone) return erro("informe o telefone (ex: 5511999999999)", 400);

  // Só manda pra quem já existe no KV: um teste de admin não é motivo pra
  // virar rota de envio pra número arbitrário. A checagem é na chave crua
  // porque getUserData devolve um objeto vazio pra número inexistente — daria
  // 200 pra qualquer telefone digitado.
  if (!env.FINN_KV) return erro("KV não configurado", 500);
  const bruto = await env.FINN_KV.get(`data_${phone}`);
  if (!bruto) return erro("esse número não tem dados no Finn — confira o número (com DDI 55)", 404);
  const data = await getUserData(phone, env);

  const nome = env.DAILY_DASHBOARD_TEMPLATE_NAME || "resumo_diario_finn";
  let resp, body;
  try {
    resp = await sendDailyDashboardTemplate(phone, data, env, nome);
  } catch (e) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro_rede: String((e && e.message) || e) }, null, 2), { status: 502, headers: cors }));
  }
  if (!resp) return erro("nada foi enviado (template sem nome)", 500);
  try { body = await resp.json(); } catch (e) { body = { parse_error: String(e) }; }

  let veredito;
  if (resp.ok) {
    veredito = env.DAILY_DASHBOARD_TEMPLATE_NAME
      ? "ENVIADO. Confira o WhatsApp desse número. Como a secret já está configurada, o resumo automático das 22h também vai sair."
      : "ENVIADO — o template funciona. Mas a secret DAILY_DASHBOARD_TEMPLATE_NAME ainda NÃO está configurada, então o resumo automático das 22h continua só no Telegram. Este teste usou o nome fixo.";
  } else {
    // 132000 é justamente o descasamento de variáveis — vale nomear, porque
    // o texto cru da Meta não explica o que fazer.
    const codigo = body && body.error && body.error.code;
    veredito = codigo === 132000
      ? "A META RECUSOU: o número de variáveis do template não bate com o que o bot manda (4). Veja meta_response."
      : "A META RECUSOU o envio — veja meta_response abaixo.";
  }

  return corsResponse(new Response(JSON.stringify({
    ok: resp.ok, http: resp.status, veredito,
    template_usado: nome,
    secret_daily_dashboard_template_name: env.DAILY_DASHBOARD_TEMPLATE_NAME || null,
    meta_response: body
  }, null, 2), { status: 200, headers: cors }));
}

// GET /whatsapp/templates — lista os Message Templates da conta com o status
// de aprovação. Devolve também o motivo da rejeição quando existe, que é o
// que o WhatsApp Manager mostra numa tela separada e fácil de não achar.
async function handleWhatsAppTemplates(env) {
  const cors = { "Content-Type": "application/json" };
  if (!env.WHATSAPP_WABA_ID) {
    return corsResponse(new Response(JSON.stringify({ error: "WHATSAPP_WABA_ID não configurado" }), { status: 500, headers: cors }));
  }
  let resp, body;
  try {
    resp = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_WABA_ID}/message_templates?fields=name,status,category,language,rejected_reason,quality_score&limit=50`, {
      headers: { Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }
    });
  } catch (e) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro_rede: String(e && e.message || e) }, null, 2), { status: 502, headers: cors }));
  }
  try { body = await resp.json(); } catch (e) { body = { parse_error: String(e) }; }

  // Resumo pronto pra ler, com a resposta crua junto pra diagnóstico.
  const lista = (body && body.data) || [];
  const resumo = lista.map(t => ({
    nome: t.name,
    status: t.status,
    idioma: t.language,
    categoria: t.category,
    motivo_rejeicao: t.rejected_reason && t.rejected_reason !== "NONE" ? t.rejected_reason : undefined
  }));
  const alvo = resumo.filter(t => t.nome === "resumo_diario_finn");
  // Aprovado na Meta e ligado no Finn são duas coisas diferentes: sem o
  // secret, o resumo das 22h continua saindo só no Telegram mesmo com o
  // template aprovado. O veredito precisa dizer QUAL das duas está faltando.
  const jaLigado = env.DAILY_DASHBOARD_TEMPLATE_NAME === "resumo_diario_finn";
  let veredito;
  if (!resp.ok) veredito = "NÃO CONSEGUI CONSULTAR — veja meta_response abaixo (token sem permissão whatsapp_business_management é a causa mais comum).";
  else if (!alvo.length) veredito = "O template 'resumo_diario_finn' NÃO EXISTE nesta conta. Crie com POST /whatsapp/create-daily-template.";
  else if (alvo.some(t => t.status === "APPROVED")) {
    veredito = jaLigado
      ? "APROVADO e JÁ LIGADO no Finn — o resumo das 22h sai no WhatsApp. Nada a fazer."
      : "APROVADO na Meta, mas AINDA NÃO LIGADO no Finn: falta a secret DAILY_DASHBOARD_TEMPLATE_NAME=resumo_diario_finn no worker do bot. Enquanto ela não existir, o resumo das 22h continua só no Telegram.";
  }
  else if (alvo.some(t => t.status === "PENDING" || t.status === "IN_APPEAL")) veredito = "AINDA EM ANÁLISE na Meta. Nada a fazer além de esperar.";
  else if (alvo.some(t => t.status === "REJECTED")) veredito = "REJEITADO — veja motivo_rejeicao. Dá pra ajustar o texto e submeter de novo.";
  else veredito = "Status inesperado — veja a lista abaixo.";

  return corsResponse(new Response(JSON.stringify({
    ok: resp.ok, http: resp.status, veredito,
    secret_daily_dashboard_template_name: env.DAILY_DASHBOARD_TEMPLATE_NAME || null,
    resumo_diario_finn: alvo, todos: resumo, meta_response: resp.ok ? undefined : body
  }, null, 2), { status: 200, headers: cors }));
}

// Cria (uma vez) o Message Template do resumo diário direto pela API da
// Meta — evita ter que clicar no WhatsApp Manager. Não é idempotente do
// lado do Finn: se rodar de novo com um template do mesmo nome+idioma já
// existente, quem decide o que fazer é a resposta crua da Meta (devolvida
// sem tratamento nenhum aqui de propósito, pra nunca esconder o motivo
// real de uma rejeição). A aprovação em si a API não pula — isso a Meta
// sempre revisa manualmente, só a CRIAÇÃO do rascunho é que fica automática.
async function handleWhatsAppCreateDailyTemplate(env) {
  if (!env.WHATSAPP_WABA_ID) {
    return corsResponse(new Response(JSON.stringify({ error: "WHATSAPP_WABA_ID não configurado" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    }));
  }
  const payload = {
    name: "resumo_diario_finn",
    category: "UTILITY",
    language: "pt_BR",
    components: [{
      type: "BODY",
      text: "📊 *Finn — Resumo das 22h*\n\nHoje você {{1}}.\nSaldo do mês: {{2}}.\n{{3}}\n{{4}}\n\nContinue assim! 💪",
      example: {
        body_text: [[
          "recebeu R$ 150,00 e gastou R$ 80,00",
          "R$ 1.200,00",
          "🔥 5 dias seguidos",
          "23% a menos que em julho 🎉"
        ]]
      }
    }]
  };
  // try/catch em volta do fetch: sem ele, uma falha de rede/DNS escapava do
  // handler, o Cloudflare devolvia a pagina de erro 1101 sem cabecalho de CORS
  // e quem chamou via so "Failed to fetch", sem a causa.
  let resp, body;
  try {
    resp = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_WABA_ID}/message_templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    return corsResponse(new Response(JSON.stringify({ ok: false, erro_rede: String(e && e.message || e) }, null, 2), {
      status: 502, headers: { "Content-Type": "application/json" }
    }));
  }
  try { body = await resp.json(); } catch (e) { body = { parse_error: String(e) }; }
  return corsResponse(new Response(JSON.stringify({ ok: resp.ok, status: resp.status, meta_response: body }, null, 2), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
}

// =============================================================================
// META API HELPERS
// =============================================================================
async function metaPost(payload, env) {
  const url=`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const resp=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.WHATSAPP_ACCESS_TOKEN}`},
    body:JSON.stringify(payload)
  });
  if(!resp.ok) {
    // clone() porque o corpo só pode ser lido uma vez: sem isso, quem chama
    // metaPost e tenta ler a resposta de erro recebe um stream já consumido —
    // e a mensagem da Meta, que é justamente o diagnóstico, se perde.
    const body = await resp.clone().text();
    console.error(`Meta API error ${resp.status}:`, body);
    await debugLog(env, { kind: "meta_send_error", to: payload.to, status: resp.status, body: body.slice(0, 500) });
    // Token expirado (401) ou sem permissão (403)
    if (resp.status === 401 || resp.status === 403) {
      console.error("⚠️  TOKEN EXPIRADO ou INVÁLIDO — acesse o Meta Developer Portal e gere um novo token, depois atualize com: wrangler secret put WHATSAPP_ACCESS_TOKEN");
    }
  }
  return resp;
}

async function sendText(phone, message, env) {
  if (isTelegramId(phone)) return telegramSendMessage(phone, message, env);
  return metaPost({messaging_product:"whatsapp",to:phone,type:"text",text:{body:message,preview_url:false}},env);
}

async function sendMainMenu(phone, env) {
  if (isTelegramId(phone)) {
    return telegramSendMessage(phone, "👋 *Finn.*\nEscolha uma opção:", env, {
      reply_markup: { inline_keyboard: [
        [{text:"💸 Lançar Despesa", callback_data:"lancar_despesa"}, {text:"💰 Lançar Receita", callback_data:"lancar_receita"}],
        [{text:"📊 Resumo do Mês", callback_data:"resumo_mes"}, {text:"🚨 Alertas de Limite", callback_data:"alertas_limite"}],
        [{text:"🎯 Status das Metas", callback_data:"status_metas"}, {text:"📋 Contas Fixas", callback_data:"contas_fixas"}],
        [{text:"🔮 Previsão de Saldo", callback_data:"previsao_saldo"}, {text:"📂 Análise de Extrato", callback_data:"analise_extrato"}],
        [{text:"🔄 Sincronizar com Finn", callback_data:"sinc_finn"}, {text:"🏆 Score Financeiro", callback_data:"score_financeiro"}],
      ]}
    });
  }
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      header:{type:"text",text:"Finn. 🦊"},
      body:{text:"👋 Olá! Escolha uma opção:"},
      footer:{text:"Finn. • Seu dinheiro, no controle."},
      action:{
        button:"Ver opções",
        sections:[
          {title:"💰 Lançamentos",rows:[
            {id:"lancar_despesa",title:"Lançar Despesa",description:"Registre um gasto rapidinho"},
            {id:"lancar_receita",title:"Lançar Receita",description:"Registre uma receita"}
          ]},
          {title:"📊 Consultas",rows:[
            {id:"resumo_mes",title:"Resumo do Mês",description:"Receitas, despesas e saldo"},
            {id:"alertas_limite",title:"Alertas de Limite",description:"Categorias próximas do limite"},
            {id:"status_metas",title:"Status das Metas",description:"Progresso das suas metas"},
            {id:"contas_fixas",title:"Contas Fixas",description:"Pagas e pendentes do mês"}
          ]},
          {title:"🛠️ Ferramentas",rows:[
            {id:"previsao_saldo",title:"Previsão de Saldo",description:"Projeção até fim do mês"},
            {id:"analise_extrato",title:"Análise de Extrato 📂",description:"Envie CSV/TXT do seu banco"},
            {id:"sinc_finn",title:"Sincronizar com Finn 🔄",description:"Enviar lançamentos pro app"},
            {id:"score_financeiro",title:"Score Financeiro 🏆",description:"Pontuação de saúde financeira"}
          ]}
        ]
      }
    }
  },env);
}

// [cat (vai no id, é o valor gravado na transação), emoji, label de exibição (opcional, default = cat)]
// Compara categoria digitada com a da lista ignorando acento, caixa, emoji e
// espaco extra — "alimentacao", "Alimentação" e "ALIMENTAÇÃO " sao a mesma.
function normalizaCategoriaTexto(t) {
  return String(t == null ? "" : t)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\/ ]/g, "")
    .trim().toLowerCase();
}

const CATEGORIAS_DESPESA = [["Alimentação","🍔"],["Transporte","🚗"],["Lazer","🎮"],["Saúde","🏥"],["Educação","📚"],["Moradia","🏠"],["Vestuário","👕"],["Investimento","📈"],["Outros","📦"]];
const CATEGORIAS_RECEITA = [["Salário","💼"],["Freelance","💻","Freelance/Serviços"],["Investimento","📈","Investimentos"],["Aluguel","🏠"],["Venda","🛍️"],["Bônus","🎁","Bônus/Presente"],["Outros","📦"]];

async function sendCategoryList(phone, val, env) {
  const v = Math.abs(val);
  if (isTelegramId(phone)) {
    return telegramSendMessage(phone, `Despesa de R$ ${formatBRL(v)}.\nQual a categoria?`, env, {
      reply_markup: { inline_keyboard: CATEGORIAS_DESPESA.map(([cat,emoji,label]) => [{text:`${emoji} ${label||cat}`, callback_data:`c|d|${v}|${cat}`}]) }
    });
  }
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:`Despesa de R$ ${formatBRL(v)}.\nQual a categoria?`},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Despesa",rows: CATEGORIAS_DESPESA.map(([cat,emoji,label]) => ({id:`c|d|${v}|${cat}`,title:`${emoji} ${label||cat}`}))}]
      }
    }
  },env);
}

async function sendCategoryListReceita(phone, val, env) {
  const v = Math.abs(val);
  if (isTelegramId(phone)) {
    return telegramSendMessage(phone, `Receita de R$ ${formatBRL(v)}.\nQual a categoria?`, env, {
      reply_markup: { inline_keyboard: CATEGORIAS_RECEITA.map(([cat,emoji,label]) => [{text:`${emoji} ${label||cat}`, callback_data:`c|r|${v}|${cat}`}]) }
    });
  }
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:`Receita de R$ ${formatBRL(v)}.\nQual a categoria?`},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Receita",rows: CATEGORIAS_RECEITA.map(([cat,emoji,label]) => ({id:`c|r|${v}|${cat}`,title:`${emoji} ${label||cat}`}))}]
      }
    }
  },env);
}

// =============================================================================
// KV DATA FUNCTIONS
// =============================================================================
async function getState(phone, env) {
  const raw=await env.FINN_KV.get(`state_${phone}`);
  if(!raw) return {state:"idle",pending:{}};
  try{return JSON.parse(raw);}catch{return {state:"idle",pending:{}};}
}

async function setState(phone, data, env) {
  await env.FINN_KV.put(`state_${phone}`,JSON.stringify({...data,updatedAt:Date.now()}),{expirationTtl:1800});
}

async function clearState(phone, env) {
  await env.FINN_KV.delete(`state_${phone}`);
}

async function getUserData(phone, env) {
  const raw=await env.FINN_KV.get(`data_${phone}`);
  if(!raw) return {phone,txs:[],limits:{},goals:[]};
  try{return JSON.parse(raw);}catch{return {phone,txs:[],limits:{},goals:[]};}
}

async function saveUserData(phone, data, env) {
  const existing=await getUserData(phone,env);
  await env.FINN_KV.put(`data_${phone}`,JSON.stringify({...existing,...data,phone}));
}

// KV não tem read-modify-write atômico — duas chamadas concorrentes (ex.:
// duplo toque num botão de confirmar, ou dois webhooks quase simultâneos
// pro mesmo telefone) ainda podem se sobrescrever. Isso aqui só evita fazer
// DOIS reads em vez de um só (addTransaction lia, e saveUserData lia de
// novo por baixo), o que alargava a janela da corrida sem necessidade. Uma
// solução completa (uma chave por transação, como o log de debug) exige
// migrar todo código que lê data.txs como array pronto — deixado pra quando
// o bot voltar a ter tráfego real.
async function addTransaction(phone, tx, env) {
  const data = await getUserData(phone, env);
  data.txs = [...(data.txs || []), tx];
  data.phone = phone;
  await env.FINN_KV.put(`data_${phone}`, JSON.stringify(data));
  await env.FINN_KV.delete(`pending_${phone}`);
}

async function getFixedBills(phone, env) {
  const raw=await env.FINN_KV.get(`fixed_${phone}`);
  if(!raw) return [];
  try{return JSON.parse(raw);}catch{return [];}
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
// Interpreta valor digitado em formato brasileiro. Se tem vírgula, ela é o
// separador decimal e qualquer ponto antes é separador de milhar (remove).
// Sem vírgula, um ponto seguido de 1-2 dígitos no final é decimal (ex.:
// "45.90"); qualquer outro ponto é separador de milhar — sem essa distinção,
// "1.000" (mil reais) virava R$1,00 e "2.500" virava R$2,50.
function parseMonetaryValue(text) {
  let clean = text.replace(/R\$\s*/gi, "").trim();
  if (!clean) return null;
  if (clean.indexOf(",") !== -1) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  } else {
    const isDecimalDot = clean.split(".").length === 2 && /\.\d{1,2}$/.test(clean);
    if (!isDecimalDot) clean = clean.replace(/\./g, "");
  }
  const val = parseFloat(clean);
  if (isNaN(val) || val <= 0) return null;
  return val;
}

function buildTransaction({val,cat,desc}, phone) {
  const channel = isTelegramId(phone) ? "telegram" : "whatsapp";
  return {
    id:`${channel==="telegram"?"tg":"wa"}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    date:todayBR(),
    desc:desc||"Sem descrição", val:val||0, cat:cat||"Outros", source:channel,
  };
}

// Mesma regra do site (finn/index.html): a varredura automática do banco
// (Rende Fácil, aplicação/resgate/poupança automática) não conta como
// receita/despesa real. Investimento comprado de propósito continua no
// fluxo. Sem isso os totais do bot batiam a mais que o site.
const INVEST_RE = /rende f[aá]cil|\bbb\s+a[cç][õo]es\b|\bbb\s+mm\b|\bbb\s+rf\b|tesouro direto|previd[eê]ncia privada|aplica[cç][aã]o autom|resgate autom|poupan[cç]a autom|rendimento autom/i;
function isFlowTx(t) {
  return !INVEST_RE.test(t.desc || "");
}

function formatBRL(value) {
  return Math.abs(value).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
}

function formatDateBR(dateStr) {
  if(!dateStr) return "hoje";
  const [y,m,d]=dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function capitalizeFirst(str) {
  return str?str.charAt(0).toUpperCase()+str.slice(1):str;
}

function catToEmoji(cat) {
  const map={Alimentacao:"🍔",Alimentação:"🍔",Transporte:"🚗",Saude:"🏥",Saúde:"🏥",Lazer:"🎮",Educacao:"📚",Educação:"📚",Moradia:"🏠",Vestuario:"👕",Vestuário:"👕",Investimento:"📈",Outros:"📦",Salario:"💼",Salário:"💼",Freelance:"💻",Aluguel:"🏠",Venda:"🛍️",Bonus:"🎁",Bônus:"🎁"};
  return map[cat]||"💰";
}

function progressBar(pct, length=8) {
  const filled=Math.round((pct/100)*length);
  return "█".repeat(filled)+"░".repeat(length-filled);
}

// =============================================================================
// CSV/TXT BANK STATEMENT PARSER (for WhatsApp document uploads)
// =============================================================================
function parseBankCSVBot(text) {
  text = text.replace(/^﻿/, '').replace(/^﻿/, '');
  const lines = text.split(/\r?\n/);
  const txs = [];
  let headerSkipped = false;
  const sample = lines[0] || '';
  const tabs = (sample.match(/\t/g)||[]).length;
  const semis = (sample.match(/;/g)||[]).length;
  const commas = (sample.match(/,/g)||[]).length;
  let delim = ',';
  if (tabs >= commas && tabs >= semis && tabs > 0) delim = '\t';
  else if (semis > commas) delim = ';';

  for (const line of lines) {
    if (!headerSkipped) { headerSkipped = true; continue; }
    if (!line.trim()) continue;
    const fields = splitBotFields(line, delim);
    if (fields.length < 3) continue;

    let date = '', desc = '', val = 0, tipo = '';

    for (const f of fields) {
      const clean = f.replace(/"/g,'').trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean) && !clean.startsWith('00')) { date = clean; break; }
      if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
        const [y,m,d] = clean.split('-'); date = `${d}/${m}/${y}`; break;
      }
    }
    if (!date) continue;

    const upper = fields.join(' ').toUpperCase();
    if (/SALDO ANTERIOR|SALDO DO DIA|SALDO FINAL/.test(upper)) continue;

    for (const f of fields) {
      const fl = f.toLowerCase().trim().replace(/"/g,'');
      if (['entrada','crédito','credito','credit'].includes(fl)) { tipo = 'Entrada'; break; }
      if (['saída','saida','débito','debito','debit'].includes(fl)) { tipo = 'Saída'; break; }
    }

    for (let j = fields.length - 1; j >= 0; j--) {
      const n = parseBRNum(fields[j]);
      if (n && Math.abs(n) > 0) { val = n; break; }
    }
    if (!val) continue;
    if (!tipo) tipo = val > 0 ? 'Entrada' : 'Saída';

    let maxLen = 0;
    for (const f of fields) {
      const clean = f.replace(/"/g,'').trim();
      const tl = clean.replace(/[R$\s.,0-9()-]/g,'').length;
      if (tl > maxLen) { maxLen = tl; desc = clean; }
    }

    let cat = 'Outros';
    const dl = desc.toLowerCase();
    if (/cart[aã]o|compra/i.test(dl)) cat = 'Cartão';
    else if (/pix/i.test(dl)) cat = 'PIX';
    else if (/dep[^a]|dinheiro|atm/i.test(dl)) cat = 'Depósito';
    else if (/juros/i.test(dl)) cat = 'Juros';
    else if (/iof/i.test(dl)) cat = 'IOF';

    txs.push({ date, desc: desc.slice(0,28), val: Math.abs(val), tipo, cat });
  }
  return txs;
}

function splitBotFields(line, delim) {
  const fields = []; let cur = '', inQ = false;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '"') inQ = !inQ;
    else if (line[j] === delim && !inQ) { fields.push(cur.trim()); cur = ''; }
    else cur += line[j];
  }
  fields.push(cur.trim());
  return fields;
}

// Extratos de banco variam o separador decimal: a maioria usa vírgula
// ("27,90"), mas o CSV do Nubank usa ponto ("-27.90"). Tratar "." sempre
// como milhar (como antes) fazia "-27.90" virar -2790 — 100x maior.
function parseBRNum(s) {
  if (!s) return 0;
  let c = String(s).replace(/"/g,'').replace(/[R$\s]/g,'').trim();
  if (!c) return 0;
  const neg = /^-/.test(c) || /^\(.*\)$/.test(c);
  c = c.replace(/^[-(]|[)]$/g, '');
  let n;
  if (c.indexOf(',') !== -1 && c.indexOf('.') !== -1) {
    // tem os dois separadores: o que aparece por último é o decimal
    n = c.lastIndexOf(',') > c.lastIndexOf('.')
      ? parseFloat(c.replace(/\./g, '').replace(',', '.'))   // BR: "1.234,56"
      : parseFloat(c.replace(/,/g, ''));                      // EN: "1,234.56"
  } else if (c.indexOf(',') !== -1) {
    n = parseFloat(c.replace(/\./g, '').replace(',', '.'));   // "27,90"
  } else if (c.indexOf('.') !== -1) {
    const isDecimalDot = c.split('.').length === 2 && /\.\d{1,2}$/.test(c);
    n = parseFloat(isDecimalDot ? c : c.replace(/\./g, ''));  // "-27.90" vs "1.000"
  } else {
    n = parseFloat(c);
  }
  if (isNaN(n)) return 0;
  return neg ? -Math.abs(n) : n;
}

function analyzeBotCSV(txs) {
  const entries = txs.filter(t => t.tipo === 'Entrada');
  const exits   = txs.filter(t => t.tipo === 'Saída');
  const tIn  = entries.reduce((s,t) => s + t.val, 0);
  const tOut = exits.reduce((s,t)   => s + t.val, 0);
  const catMap = {};
  exits.forEach(t => { catMap[t.cat] = (catMap[t.cat]||0) + t.val; });
  const topCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topExp  = [...exits].sort((a,b) => b.val-a.val).slice(0,3);
  // t.date é "DD/MM/YYYY" — .sort() puro compara como texto e embaralha a
  // ordem sempre que o extrato cruza mês/ano (ex.: "05/01" vinha antes de
  // "28/12" só porque "0" < "2"). Ordena convertendo pra YYYY-MM-DD antes.
  const dateKey = (d) => { const [dd,mm,yyyy]=d.split('/'); return `${yyyy}${mm}${dd}`; };
  const dates   = txs.map(t => t.date).sort((a,b) => dateKey(a).localeCompare(dateKey(b)));
  return { count: txs.length, tIn, tOut, net: tIn-tOut, topCats, topExp, dates };
}

function formatBotAnalysis(d, env) {
  const period = d.dates.length ? `${d.dates[0]} a ${d.dates[d.dates.length-1]}` : '';
  let msg = `📂 *ANÁLISE DE EXTRATO*\n━━━━━━━━━━━━━━━\n`;
  if (period) msg += `📅 ${period} · ${d.count} transações\n\n`;
  msg += `💰 *Entradas:* R$ ${formatBRL(d.tIn)}\n`;
  msg += `💸 *Saídas:*   R$ ${formatBRL(d.tOut)}\n`;
  msg += `${d.net>=0?"📈":"📉"} *Saldo:*    R$ ${formatBRL(Math.abs(d.net))}${d.net<0?" ⚠️ NEGATIVO":""}\n\n`;

  if (d.topCats.length) {
    msg += `*Gastos por tipo:*\n`;
    d.topCats.forEach(([cat,val]) => {
      const pct = d.tOut > 0 ? Math.round(val/d.tOut*100) : 0;
      msg += `  ${catToEmoji(cat)} ${cat}: R$ ${formatBRL(val)} (${pct}%)\n`;
    });
    msg += '\n';
  }

  if (d.topExp.length) {
    msg += `*3 maiores saídas:*\n`;
    d.topExp.forEach((t,i) => { msg += `  ${i+1}. ${t.desc} — R$ ${formatBRL(t.val)}\n`; });
    msg += '\n';
  }

  if (d.net < 0) {
    msg += `🚨 Gastos superam entradas em *R$ ${formatBRL(Math.abs(d.net))}*\n`;
    msg += `   Reduza despesas ou aumente receita!\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━\n_Importe no Finn para gráficos e metas:_\n👉 ${env?.FINN_URL||""}`;
  return msg;
}

// =============================================================================
// Finn. WhatsApp Bot — Cloudflare Worker (Z-API)
// =============================================================================
//
// Required env vars (set via wrangler secret / dashboard):
//   ZAPI_INSTANCE_ID      — Z-API instance ID (from z-api.io dashboard)
//   ZAPI_TOKEN            — Z-API instance token
//   ZAPI_SECURITY_TOKEN   — Security token for webhook verification (X-Security-Token header)
//   FINN_URL              — Public URL of the Finn app  (e.g. https://yoursite.pages.dev/finn/)
//
// KV namespace binding:  FINN_KV  (see wrangler.toml)
//
// KV key schema:
//   state_{phone}         → JSON: { state, pending, updatedAt }
//   data_{phone}          → JSON: { phone, txs:[], limits:{}, goals:[] }
//   fixed_{phone}         → JSON: [ { id, desc, val, dueDay, cat, paid:[] } ]
// =============================================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsResponse(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      return handleWebhook(request, env);
    }

    if (url.pathname === "/sync" && request.method === "POST") {
      return handleSync(request, env);
    }

    return new Response("Finn WhatsApp Worker", { status: 200 });
  },

  async scheduled(_event, env, _ctx) {
    await sendDailyDashboards(env);
  },
};

// =============================================================================
// CORS helper
// =============================================================================
function corsResponse(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, { status: response.status, headers });
}

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================
async function handleWebhook(request, env) {
  // Optional security token verification
  const secToken = request.headers.get("X-Security-Token");
  if (env.ZAPI_SECURITY_TOKEN && secToken !== env.ZAPI_SECURITY_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  // Z-API sends different event types; we only care about messages
  if (!body || body.type !== "ReceivedCallback") {
    return new Response("OK", { status: 200 });
  }

  const phone = normalizePhone(body.phone || body.from || "");
  if (!phone) return new Response("OK", { status: 200 });

  // Ignore messages sent by the bot itself
  if (body.fromMe) return new Response("OK", { status: 200 });

  const msgType = body.type === "ReceivedCallback" ? detectMessageType(body) : null;

  try {
    await routeMessage(phone, body, msgType, env);
  } catch (err) {
    console.error("routeMessage error:", err);
  }

  return new Response("OK", { status: 200 });
}

function detectMessageType(body) {
  if (body.listResponseMessage) return "list_reply";
  if (body.buttonsResponseMessage) return "button_reply";
  if (body.text?.message) return "text";
  if (body.message) return "text";
  return "unknown";
}

// =============================================================================
// MESSAGE ROUTER
// =============================================================================
async function routeMessage(phone, body, msgType, env) {
  const stateData = await getState(phone, env);
  const state = stateData.state || "idle";

  // ---------- List reply from the main menu ----------
  if (msgType === "list_reply") {
    const rowId = body.listResponseMessage?.rowId || "";
    return handleListReply(phone, rowId, env);
  }

  // ---------- Button reply (category selection, etc.) ----------
  if (msgType === "button_reply") {
    const selectedId = body.buttonsResponseMessage?.selectedButtonId || "";
    return handleButtonReply(phone, selectedId, stateData, env);
  }

  // ---------- Text message ----------
  const text = (body.text?.message || body.message || "").trim();

  if (!text) return;

  // If user is mid-flow, continue the state machine
  if (state !== "idle") {
    return continueFlow(phone, text, stateData, env);
  }

  // Trigger words to open main menu
  const lower = text.toLowerCase();
  if (
    lower === "menu" ||
    lower === "oi" ||
    lower === "olá" ||
    lower === "ola" ||
    lower === "finn" ||
    lower === "ajuda" ||
    lower === "help" ||
    lower === "inicio" ||
    lower === "início"
  ) {
    return sendListMessage(phone, env);
  }

  // Unknown message in idle state
  await sendText(
    phone,
    `👋 Olá! Digite *menu* para ver as opções do Finn. 🦊`,
    env
  );
}

// =============================================================================
// LIST REPLY HANDLER (main menu selections)
// =============================================================================
async function handleListReply(phone, rowId, env) {
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
      await handleResumoMes(phone, env);
      break;

    case "alertas_limite":
      await handleAlertasLimite(phone, env);
      break;

    case "status_metas":
      await handleStatusMetas(phone, env);
      break;

    case "contas_fixas":
      await handleContasFixas(phone, env);
      break;

    case "previsao_saldo":
      await handlePrevisaoSaldo(phone, env);
      break;

    case "modo_panico":
      await handleModoPanico(phone, env);
      break;

    case "abrir_finn":
      await handleAbrirFinn(phone, env);
      break;

    default:
      await sendText(phone, "❓ Opção não reconhecida. Digite *menu* para tentar novamente.", env);
  }
}

// =============================================================================
// BUTTON REPLY HANDLER (category selection mid-flow)
// =============================================================================
async function handleButtonReply(phone, selectedId, stateData, env) {
  const state = stateData.state || "idle";

  if (state === "awaiting_cat_despesa" || state === "awaiting_cat_receita") {
    const catMap = {
      btn_alimentacao: "Alimentacao",
      btn_transporte: "Transporte",
      btn_lazer: "Lazer",
      btn_saude: "Saude",
      btn_educacao: "Educacao",
      btn_moradia: "Moradia",
      btn_vestuario: "Vestuario",
      btn_investimento: "Investimento",
      btn_outros: "Outros",
    };

    const cat = catMap[selectedId];
    if (!cat) {
      await sendText(phone, "❓ Categoria inválida. Tente novamente.", env);
      return;
    }

    const pending = { ...(stateData.pending || {}), cat };
    const nextState =
      state === "awaiting_cat_despesa"
        ? "awaiting_desc_despesa"
        : "awaiting_desc_receita";

    await setState(phone, { state: nextState, pending }, env);
    await sendText(
      phone,
      "📝 Descrição? _(ex: Almoço, iFood, mercado, salário...)_",
      env
    );
  } else {
    await sendText(phone, "❓ Não entendi. Digite *menu* para voltar.", env);
  }
}

// =============================================================================
// FLOW CONTINUATION — state machine for ongoing conversations
// =============================================================================
async function continueFlow(phone, text, stateData, env) {
  const { state, pending } = stateData;

  // ---- Awaiting monetary value (despesa) ----
  if (state === "awaiting_valor_despesa") {
    const val = parseMonetaryValue(text);
    if (val === null) {
      await sendText(
        phone,
        "⚠️ Não entendi o valor. Tente assim: *45,90* ou *45.90*",
        env
      );
      return;
    }

    const newPending = { ...pending, val: -Math.abs(val) };
    await setState(phone, { state: "awaiting_cat_despesa", pending: newPending }, env);
    await sendCategoryButtons(phone, env);
    return;
  }

  // ---- Awaiting monetary value (receita) ----
  if (state === "awaiting_valor_receita") {
    const val = parseMonetaryValue(text);
    if (val === null) {
      await sendText(
        phone,
        "⚠️ Não entendi o valor. Tente assim: *3200,00*",
        env
      );
      return;
    }

    const newPending = { ...pending, val: Math.abs(val) };
    await setState(phone, { state: "awaiting_cat_receita", pending: newPending }, env);
    await sendCategoryButtons(phone, env);
    return;
  }

  // ---- Awaiting description (despesa) ----
  if (state === "awaiting_desc_despesa") {
    const tx = buildTransaction({ ...pending, desc: text });
    await addTransaction(phone, tx, env);
    await clearState(phone, env);

    const valFmt = formatBRL(Math.abs(tx.val));
    const catEmoji = catToEmoji(tx.cat);
    const finnUrl = env.FINN_URL || "https://finn.app";

    await sendText(
      phone,
      `✅ *Despesa registrada!*\n\n💸 R$ ${valFmt} — ${catEmoji} ${tx.cat}\n📝 ${tx.desc}\n📅 ${formatDateBR(tx.date)}\n\n_Abra o Finn para ver no extrato_ 👉 ${finnUrl}`,
      env
    );
    return;
  }

  // ---- Awaiting description (receita) ----
  if (state === "awaiting_desc_receita") {
    const tx = buildTransaction({ ...pending, desc: text });
    await addTransaction(phone, tx, env);
    await clearState(phone, env);

    const valFmt = formatBRL(Math.abs(tx.val));
    const catEmoji = catToEmoji(tx.cat);
    const finnUrl = env.FINN_URL || "https://finn.app";

    await sendText(
      phone,
      `✅ *Receita registrada!*\n\n💰 R$ ${valFmt} — ${catEmoji} ${tx.cat}\n📝 ${tx.desc}\n📅 ${formatDateBR(tx.date)}\n\n_Abra o Finn para ver no extrato_ 👉 ${finnUrl}`,
      env
    );
    return;
  }

  // Unknown state — reset
  await clearState(phone, env);
  await sendText(phone, "❓ Algo deu errado. Digite *menu* para começar de novo.", env);
}

// =============================================================================
// CONSULTATION HANDLERS
// =============================================================================
async function handleResumoMes(phone, env) {
  const data = await getUserData(phone, env);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthTxs = (data.txs || []).filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const receitas = monthTxs.filter((t) => t.val > 0).reduce((s, t) => s + t.val, 0);
  const despesas = monthTxs.filter((t) => t.val < 0).reduce((s, t) => s + Math.abs(t.val), 0);
  const saldo = receitas - despesas;

  // Group by category
  const byCat = {};
  monthTxs
    .filter((t) => t.val < 0)
    .forEach((t) => {
      byCat[t.cat] = (byCat[t.cat] || 0) + Math.abs(t.val);
    });

  const catLines = Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, val]) => `  ${catToEmoji(cat)} ${cat}: R$ ${formatBRL(val)}`)
    .join("\n");

  const monthName = now.toLocaleString("pt-BR", { month: "long" });
  const saldoEmoji = saldo >= 0 ? "📈" : "📉";

  const msg =
    `📊 *Resumo de ${capitalizeFirst(monthName)}*\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💰 Receitas:  R$ ${formatBRL(receitas)}\n` +
    `💸 Despesas: R$ ${formatBRL(despesas)}\n` +
    `${saldoEmoji} Saldo:      R$ ${formatBRL(saldo)}\n` +
    `━━━━━━━━━━━━━━━\n` +
    (catLines ? `*Top categorias:*\n${catLines}\n\n` : "") +
    `_${monthTxs.length} lançamento(s) no mês_`;

  await sendText(phone, msg, env);
}

async function handleAlertasLimite(phone, env) {
  const data = await getUserData(phone, env);
  const limits = data.limits || {};
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthTxs = (data.txs || []).filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month && tx.val < 0;
  });

  const byCat = {};
  monthTxs.forEach((t) => {
    byCat[t.cat] = (byCat[t.cat] || 0) + Math.abs(t.val);
  });

  if (Object.keys(limits).length === 0) {
    await sendText(
      phone,
      "⚠️ Você ainda não configurou limites por categoria.\n\nAbra o Finn para definir seus limites mensais! 👉 " +
        (env.FINN_URL || "https://finn.app"),
      env
    );
    return;
  }

  const alerts = [];
  for (const [cat, limit] of Object.entries(limits)) {
    if (!limit || limit <= 0) continue;
    const spent = byCat[cat] || 0;
    const pct = (spent / limit) * 100;

    if (pct >= 100) {
      alerts.push(`🔴 *${cat}*: R$ ${formatBRL(spent)} / R$ ${formatBRL(limit)} (${Math.round(pct)}%) — LIMITE ESTOURADO`);
    } else if (pct >= 80) {
      alerts.push(`🟡 *${cat}*: R$ ${formatBRL(spent)} / R$ ${formatBRL(limit)} (${Math.round(pct)}%) — Atenção`);
    }
  }

  if (alerts.length === 0) {
    await sendText(
      phone,
      "✅ *Todos os limites sob controle!*\n\nNenhuma categoria atingiu 80% do limite este mês. Continue assim! 💪",
      env
    );
  } else {
    await sendText(
      phone,
      `🚨 *Alertas de Limite — ${now.toLocaleString("pt-BR", { month: "long" })}*\n━━━━━━━━━━━━━━━\n${alerts.join("\n")}\n\n_Abra o Finn para ajustar seus limites_ 👉 ${env.FINN_URL || "https://finn.app"}`,
      env
    );
  }
}

async function handleStatusMetas(phone, env) {
  const data = await getUserData(phone, env);
  const goals = data.goals || [];

  if (goals.length === 0) {
    await sendText(
      phone,
      "🎯 Você ainda não tem metas cadastradas.\n\nAbra o Finn para criar suas metas financeiras! 👉 " +
        (env.FINN_URL || "https://finn.app"),
      env
    );
    return;
  }

  const lines = goals.map((g) => {
    const pct = Math.min(100, Math.round(((g.saved || 0) / (g.target || 1)) * 100));
    const bar = progressBar(pct);
    const emoji = pct >= 100 ? "🏆" : pct >= 75 ? "🚀" : pct >= 50 ? "💪" : pct >= 25 ? "📈" : "🌱";
    return `${emoji} *${g.name}*\n   ${bar} ${pct}%\n   R$ ${formatBRL(g.saved || 0)} / R$ ${formatBRL(g.target || 0)}`;
  });

  await sendText(
    phone,
    `🎯 *Status das Metas*\n━━━━━━━━━━━━━━━\n${lines.join("\n\n")}\n\n_Abra o Finn para aportar_ 👉 ${env.FINN_URL || "https://finn.app"}`,
    env
  );
}

async function handleContasFixas(phone, env) {
  const fixed = await getFixedBills(phone, env);

  if (!fixed || fixed.length === 0) {
    await sendText(
      phone,
      "📋 Você ainda não tem contas fixas cadastradas.\n\nAbra o Finn para adicionar suas contas recorrentes! 👉 " +
        (env.FINN_URL || "https://finn.app"),
      env
    );
    return;
  }

  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const pending = fixed.filter((b) => !(b.paid || []).includes(yearMonth));
  const paid = fixed.filter((b) => (b.paid || []).includes(yearMonth));

  const totalPending = pending.reduce((s, b) => s + Math.abs(b.val), 0);
  const totalPaid = paid.reduce((s, b) => s + Math.abs(b.val), 0);

  const pendingLines = pending
    .sort((a, b) => (a.dueDay || 0) - (b.dueDay || 0))
    .map((b) => `  ⏳ ${b.desc} — R$ ${formatBRL(Math.abs(b.val))} (dia ${b.dueDay || "??"})`)
    .join("\n");

  const paidLines = paid
    .map((b) => `  ✅ ${b.desc} — R$ ${formatBRL(Math.abs(b.val))}`)
    .join("\n");

  let msg = `📋 *Contas Fixas — ${now.toLocaleString("pt-BR", { month: "long", year: "numeric" })}*\n━━━━━━━━━━━━━━━\n`;

  if (pendingLines) {
    msg += `*A pagar (R$ ${formatBRL(totalPending)}):*\n${pendingLines}\n\n`;
  }
  if (paidLines) {
    msg += `*Pagas (R$ ${formatBRL(totalPaid)}):*\n${paidLines}\n\n`;
  }

  msg += `_Abra o Finn para marcar como pagas_ 👉 ${env.FINN_URL || "https://finn.app"}`;

  await sendText(phone, msg, env);
}

async function handlePrevisaoSaldo(phone, env) {
  const data = await getUserData(phone, env);
  const fixed = await getFixedBills(phone, env);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;

  const monthTxs = (data.txs || []).filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const receitas = monthTxs.filter((t) => t.val > 0).reduce((s, t) => s + t.val, 0);
  const despesas = monthTxs.filter((t) => t.val < 0).reduce((s, t) => s + Math.abs(t.val), 0);

  // Pending fixed bills this month
  const pendingFixed = (fixed || [])
    .filter((b) => !(b.paid || []).includes(yearMonth))
    .reduce((s, b) => s + Math.abs(b.val), 0);

  const saldoAtual = receitas - despesas;
  const previsao = saldoAtual - pendingFixed;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const daysLeft = daysInMonth - today;
  const dailyAvg = despesas / today;
  const projectedExtra = dailyAvg * daysLeft;
  const previsaoFinal = saldoAtual - pendingFixed - projectedExtra;

  await sendText(
    phone,
    `🔮 *Previsão de Saldo*\n━━━━━━━━━━━━━━━\n` +
      `💰 Saldo atual: R$ ${formatBRL(saldoAtual)}\n` +
      `📋 Fixas pendentes: R$ ${formatBRL(pendingFixed)}\n` +
      `📊 Gasto médio/dia: R$ ${formatBRL(dailyAvg)}\n` +
      `📅 Dias restantes: ${daysLeft}\n` +
      `━━━━━━━━━━━━━━━\n` +
      `🎯 *Previsão fim do mês:*\n` +
      `   R$ ${formatBRL(previsaoFinal)}\n\n` +
      `_Baseado no seu ritmo atual de gastos_`,
    env
  );
}

async function handleModoPanico(phone, env) {
  const data = await getUserData(phone, env);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const monthTxs = (data.txs || []).filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month && tx.val < 0;
  });

  // Top 3 biggest expenses this month
  const top3 = [...monthTxs]
    .sort((a, b) => Math.abs(b.val) - Math.abs(a.val))
    .slice(0, 3);

  const despesas = monthTxs.reduce((s, t) => s + Math.abs(t.val), 0);

  const top3Lines = top3
    .map((t, i) => `  ${i + 1}. ${t.desc} — R$ ${formatBRL(Math.abs(t.val))} (${t.cat})`)
    .join("\n");

  await sendText(
    phone,
    `🚨 *MODO PÂNICO ATIVADO* 🚨\n━━━━━━━━━━━━━━━\n` +
      `Total gasto no mês: *R$ ${formatBRL(despesas)}*\n\n` +
      `💣 *Maiores despesas:*\n${top3Lines}\n\n` +
      `💡 *Dicas de emergência:*\n` +
      `  • Cancele assinaturas que não usa\n` +
      `  • Evite delivery por 7 dias\n` +
      `  • Revise gastos recorrentes\n` +
      `  • Considere vender algo que não usa\n\n` +
      `_Respira fundo. Você tem isso. 💪_\n` +
      `Abra o Finn para um plano detalhado 👉 ${env.FINN_URL || "https://finn.app"}`,
    env
  );
}

async function handleAbrirFinn(phone, env) {
  const finnUrl = env.FINN_URL || "https://finn.app";
  await sendText(
    phone,
    `📱 *Abrir Finn*\n\nToque no link para abrir o app:\n👉 ${finnUrl}\n\n_Adicione à tela inicial para acesso rápido!_`,
    env
  );
}

// =============================================================================
// SYNC ENDPOINT — receives data from the Finn app
// =============================================================================
async function handleSync(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return corsResponse(new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }));
  }

  const { phone, data, fixed } = body;
  if (!phone) {
    return corsResponse(new Response(JSON.stringify({ error: "phone required" }), { status: 400 }));
  }

  const normalizedPhone = normalizePhone(phone);

  if (data) {
    await saveUserData(normalizedPhone, data, env);
  }

  if (fixed) {
    await env.FINN_KV.put(`fixed_${normalizedPhone}`, JSON.stringify(fixed));
  }

  return corsResponse(
    new Response(JSON.stringify({ ok: true, phone: normalizedPhone }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );
}

// =============================================================================
// DAILY DASHBOARD — triggered by cron at 01:00 UTC (22:00 BRT)
// =============================================================================
async function sendDailyDashboards(env) {
  // List all data keys
  const list = await env.FINN_KV.list({ prefix: "data_" });

  for (const key of list.keys) {
    const phone = key.name.replace("data_", "");
    if (!phone) continue;

    try {
      const data = await getUserData(phone, env);
      if (!data || !data.txs || data.txs.length === 0) continue;

      const msg = buildDashboardMessage(data, phone, env);
      await sendText(phone, msg, env);
    } catch (err) {
      console.error(`Dashboard error for ${phone}:`, err);
    }
  }
}

function buildDashboardMessage(data, _phone, env) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const finnUrl = env.FINN_URL || "https://finn.app";

  const todayStr = now.toISOString().slice(0, 10);

  const todayTxs = (data.txs || []).filter((tx) => tx.date && tx.date.slice(0, 10) === todayStr);
  const monthTxs = (data.txs || []).filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const todayReceitas = todayTxs.filter((t) => t.val > 0).reduce((s, t) => s + t.val, 0);
  const todayDespesas = todayTxs.filter((t) => t.val < 0).reduce((s, t) => s + Math.abs(t.val), 0);

  const monthReceitas = monthTxs.filter((t) => t.val > 0).reduce((s, t) => s + t.val, 0);
  const monthDespesas = monthTxs.filter((t) => t.val < 0).reduce((s, t) => s + Math.abs(t.val), 0);
  const monthSaldo = monthReceitas - monthDespesas;

  // Category spending vs limits
  const limits = data.limits || {};
  const byCat = {};
  monthTxs.filter((t) => t.val < 0).forEach((t) => {
    byCat[t.cat] = (byCat[t.cat] || 0) + Math.abs(t.val);
  });

  const catAlerts = [];
  for (const [cat, spent] of Object.entries(byCat)) {
    const limit = limits[cat];
    if (!limit) continue;
    const pct = (spent / limit) * 100;
    let indicator;
    if (pct >= 100) indicator = "🔴";
    else if (pct >= 80) indicator = "🟡";
    else if (pct >= 60) indicator = "🟢";
    else continue; // only show noteworthy ones
    catAlerts.push(`  ${indicator} ${catToEmoji(cat)} ${cat}: ${Math.round(pct)}%`);
  }

  // Best goal progress
  const goals = data.goals || [];
  let goalLine = "";
  if (goals.length > 0) {
    const best = goals
      .filter((g) => g.target > 0)
      .sort((a, b) => (b.saved / b.target) - (a.saved / a.target))[0];
    if (best) {
      const pct = Math.min(100, Math.round((best.saved / best.target) * 100));
      goalLine = `\n🎯 *Meta mais próxima:* ${best.name} — ${pct}% (R$ ${formatBRL(best.saved)} / R$ ${formatBRL(best.target)})`;
    }
  }

  // Motivational closing line based on spending
  const closing = getMotivationalLine(monthDespesas, monthReceitas, monthSaldo);

  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

  let msg =
    `📊 *FINN. — DASHBOARD DAS 22H*\n` +
    `━━━━━━━━━━━━━━━\n` +
    `📅 ${capitalizeFirst(dateStr)}\n\n`;

  if (todayTxs.length > 0) {
    msg +=
      `*Hoje:*\n` +
      `  💰 Receitas: R$ ${formatBRL(todayReceitas)}\n` +
      `  💸 Despesas: R$ ${formatBRL(todayDespesas)}\n` +
      `  ${monthSaldo >= 0 ? "📈" : "📉"} Saldo do dia: R$ ${formatBRL(todayReceitas - todayDespesas)}\n\n`;
  } else {
    msg += `_Nenhum lançamento hoje._\n\n`;
  }

  msg +=
    `*Mês a mês:*\n` +
    `  💰 Receitas: R$ ${formatBRL(monthReceitas)}\n` +
    `  💸 Despesas: R$ ${formatBRL(monthDespesas)}\n` +
    `  ${monthSaldo >= 0 ? "📈" : "📉"} Saldo: R$ ${formatBRL(monthSaldo)}\n`;

  if (catAlerts.length > 0) {
    msg += `\n*Limites por categoria:*\n${catAlerts.join("\n")}\n`;
  }

  if (goalLine) {
    msg += goalLine + "\n";
  }

  msg +=
    `\n━━━━━━━━━━━━━━━\n` +
    `_${closing}_\n\n` +
    `👉 ${finnUrl}`;

  return msg;
}

function getMotivationalLine(despesas, receitas, saldo) {
  if (saldo < 0) {
    const lines = [
      "O saldo foi negativo hoje, mas amanhã é uma nova chance. 💪",
      "Todo mestre já foi um desastre. Ajusta o rumo amanhã!",
      "Até o Nubank teve prejuízo no começo. Você vai recuperar! 😅",
      "Dinheiro vai e vem. A consciência financeira fica. Continua firme!",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  if (despesas > receitas * 0.9) {
    const lines = [
      "No limite, mas no controle. Segura a onda! 🏄",
      "Quase estourou, mas não estourou. Isso conta! 😄",
      "Vivendo no fio da navalha financeira — mas com estilo.",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  if (saldo > receitas * 0.3) {
    const lines = [
      "Você está indo muito bem! A carteira agradece. 🎉",
      "Saldo positivo e mindset de crescimento. Combinação perfeita! 🚀",
      "Se o dinheiro pudesse falar, diria obrigado pelo cuidado! 💚",
    ];
    return lines[Math.floor(Math.random() * lines.length)];
  }

  const lines = [
    "Mais um dia, mais um passo rumo à liberdade financeira.",
    "Consciência financeira é superpoder. Você tem o seu. 🦸",
    "Hoje foi bom. Amanhã pode ser ainda melhor!",
    "Cada lançamento registrado é uma vitória. Continue! ✅",
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// =============================================================================
// Z-API HELPER FUNCTIONS
// =============================================================================

function zapiBaseUrl(env) {
  return `https://api.z-api.io/instances/${env.ZAPI_INSTANCE_ID}/token/${env.ZAPI_TOKEN}`;
}

async function sendText(phone, message, env) {
  const url = `${zapiBaseUrl(env)}/send-text`;
  const payload = {
    phone,
    message,
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": env.ZAPI_SECURITY_TOKEN || "",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`Z-API sendText error ${resp.status}:`, errText);
  }

  return resp;
}

async function sendListMessage(phone, env) {
  const url = `${zapiBaseUrl(env)}/send-list-message`;

  const payload = {
    phone,
    message: "👋 Olá! Sou o Finn., seu assistente financeiro no WhatsApp.\n\nEscolha uma opção:",
    buttonText: "Ver opções",
    title: "Finn. — Controle Financeiro",
    footerText: "Finn. • Seu dinheiro, no controle.",
    sections: [
      {
        title: "💰 Lançamentos",
        rows: [
          {
            id: "lancar_despesa",
            title: "Lançar Despesa",
            description: "Registre um gasto rapidinho",
          },
          {
            id: "lancar_receita",
            title: "Lançar Receita",
            description: "Registre uma entrada de dinheiro",
          },
        ],
      },
      {
        title: "📊 Consultas",
        rows: [
          {
            id: "resumo_mes",
            title: "Resumo do Mês",
            description: "Receitas, despesas e saldo atual",
          },
          {
            id: "alertas_limite",
            title: "Alertas de Limite",
            description: "Categorias próximas ou acima do limite",
          },
          {
            id: "status_metas",
            title: "Status das Metas",
            description: "Progresso de todas as suas metas",
          },
          {
            id: "contas_fixas",
            title: "Contas Fixas",
            description: "Pagas e pendentes do mês",
          },
        ],
      },
      {
        title: "🛠️ Ferramentas",
        rows: [
          {
            id: "previsao_saldo",
            title: "Previsão de Saldo",
            description: "Projeção do saldo até o fim do mês",
          },
          {
            id: "modo_panico",
            title: "Modo Pânico 🚨",
            description: "Análise de emergência dos gastos",
          },
          {
            id: "abrir_finn",
            title: "Abrir Finn",
            description: "Link direto para o app completo",
          },
        ],
      },
    ],
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Token": env.ZAPI_SECURITY_TOKEN || "",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error(`Z-API sendListMessage error ${resp.status}:`, errText);
    // Fallback to plain text
    await sendText(
      phone,
      "📋 *Menu Finn.*\n\nDigite:\n1 - Lançar Despesa\n2 - Lançar Receita\n3 - Resumo do Mês\n4 - Alertas\n5 - Metas\n6 - Contas Fixas",
      env
    );
  }

  return resp;
}

async function sendButtonList(phone, message, buttons, env) {
  // Z-API button list — max 3 buttons per message
  const url = `${zapiBaseUrl(env)}/send-button-list`;

  // Chunk into groups of 3
  const chunks = [];
  for (let i = 0; i < buttons.length; i += 3) {
    chunks.push(buttons.slice(i, i + 3));
  }

  for (let ci = 0; ci < chunks.length; ci++) {
    const payload = {
      phone,
      message: ci === 0 ? message : "Mais opções:",
      buttonList: {
        buttons: chunks[ci].map((b) => ({
          buttonId: b.id,
          buttonText: { displayText: b.label },
          type: 1,
        })),
      },
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Token": env.ZAPI_SECURITY_TOKEN || "",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error(`Z-API sendButtonList error ${resp.status}`);
    }

    // Small delay between chunks
    if (ci < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
}

async function sendCategoryButtons(phone, env) {
  const categories = [
    { id: "btn_alimentacao", label: "🍔 Alimentação" },
    { id: "btn_transporte", label: "🚗 Transporte" },
    { id: "btn_lazer", label: "🎮 Lazer" },
    { id: "btn_saude", label: "🏥 Saúde" },
    { id: "btn_educacao", label: "📚 Educação" },
    { id: "btn_moradia", label: "🏠 Moradia" },
    { id: "btn_vestuario", label: "👕 Vestuário" },
    { id: "btn_investimento", label: "📈 Investimento" },
    { id: "btn_outros", label: "📦 Outros" },
  ];

  await sendButtonList(phone, "Qual a categoria?", categories, env);
}

// =============================================================================
// KV DATA FUNCTIONS
// =============================================================================

async function getState(phone, env) {
  const raw = await env.FINN_KV.get(`state_${phone}`);
  if (!raw) return { state: "idle", pending: {} };
  try {
    return JSON.parse(raw);
  } catch {
    return { state: "idle", pending: {} };
  }
}

async function setState(phone, data, env) {
  const payload = { ...data, updatedAt: Date.now() };
  // State expires after 30 minutes of inactivity
  await env.FINN_KV.put(`state_${phone}`, JSON.stringify(payload), {
    expirationTtl: 1800,
  });
}

async function clearState(phone, env) {
  await env.FINN_KV.delete(`state_${phone}`);
}

async function getUserData(phone, env) {
  const raw = await env.FINN_KV.get(`data_${phone}`);
  if (!raw) return { phone, txs: [], limits: {}, goals: [] };
  try {
    return JSON.parse(raw);
  } catch {
    return { phone, txs: [], limits: {}, goals: [] };
  }
}

async function saveUserData(phone, data, env) {
  const existing = await getUserData(phone, env);
  const merged = { ...existing, ...data, phone };
  await env.FINN_KV.put(`data_${phone}`, JSON.stringify(merged));
}

async function savePendingTx(phone, tx, env) {
  await env.FINN_KV.put(`pending_${phone}`, JSON.stringify(tx), {
    expirationTtl: 1800,
  });
}

async function addTransaction(phone, tx, env) {
  const data = await getUserData(phone, env);
  const txs = data.txs || [];
  txs.push(tx);
  await saveUserData(phone, { ...data, txs }, env);
  // Clean up pending
  await env.FINN_KV.delete(`pending_${phone}`);
}

async function getFixedBills(phone, env) {
  const raw = await env.FINN_KV.get(`fixed_${phone}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function normalizePhone(phone) {
  // Remove all non-digit characters, keep country code
  return phone.replace(/\D/g, "");
}

function parseMonetaryValue(text) {
  // Accepts: 45,90 | 45.90 | R$ 45,90 | 45 | 1.200,00
  const clean = text
    .replace(/R\$\s*/g, "")
    .trim()
    // Handle Brazilian format: 1.200,00 → 1200.00
    .replace(/\.(\d{3}),/g, "$1.")
    .replace(",", ".");

  const val = parseFloat(clean);
  if (isNaN(val) || val <= 0) return null;
  return val;
}

function buildTransaction({ val, cat, desc }) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const id = `wa_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return {
    id,
    date,
    desc: desc || "Sem descrição",
    val: val || 0,
    cat: cat || "Outros",
    source: "whatsapp",
  };
}

function formatBRL(value) {
  return Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDateBR(dateStr) {
  if (!dateStr) return "hoje";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function catToEmoji(cat) {
  const map = {
    Alimentacao: "🍔",
    Alimentação: "🍔",
    Transporte: "🚗",
    Saude: "🏥",
    Saúde: "🏥",
    Lazer: "🎮",
    Educacao: "📚",
    Educação: "📚",
    Moradia: "🏠",
    Vestuario: "👕",
    Vestuário: "👕",
    Investimento: "📈",
    Outros: "📦",
  };
  return map[cat] || "💰";
}

function progressBar(pct, length = 8) {
  const filled = Math.round((pct / 100) * length);
  return "█".repeat(filled) + "░".repeat(length - filled);
}

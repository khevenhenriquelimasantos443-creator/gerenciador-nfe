// =============================================================================
// Finn. WhatsApp Bot — Cloudflare Worker (Meta WhatsApp Cloud API)
// =============================================================================
// Required env vars:
//   WHATSAPP_PHONE_NUMBER_ID  — Phone Number ID from Meta Developer Portal
//   WHATSAPP_ACCESS_TOKEN     — Access token from Meta
//   WHATSAPP_VERIFY_TOKEN     — Any string you choose (ex: finn_verify_2024)
//   FINN_URL                  — Public URL of the Finn app
// KV namespace binding: FINN_KV
// =============================================================================

const META_API_VERSION = "v19.0";

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
    }

    if (url.pathname === "/keys" && request.method === "GET") {
      const list = await env.FINN_KV.list({ prefix: "data_" });
      const keys = list.keys.map(k => k.name.replace("data_", ""));
      return corsResponse(new Response(JSON.stringify({ ok: true, numeros: keys }, null, 2), { status: 200, headers: { "Content-Type": "application/json" } }));
    }

    if (url.pathname === "/status" && request.method === "GET") {
      return handleStatus(env);
    }

    if (url.pathname === "/debug" && request.method === "GET") {
      return handleDebug(env);
    }

    if (url.pathname === "/subscribe" && request.method === "GET") {
      return handleSubscribeWaba(env);
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
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, { status: response.status, headers });
}

// =============================================================================
// DEBUG LOG — registro dos últimos eventos, pra diagnosticar sem precisar
// de acesso ao painel da Cloudflare. Guarda no KV, mostra em GET /debug.
// =============================================================================
const DEBUG_KEY = "__debug_log__";
const DEBUG_MAX = 25;

async function debugLog(env, entry) {
  try {
    const raw = await env.FINN_KV.get(DEBUG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ at: new Date().toISOString(), ...entry });
    await env.FINN_KV.put(DEBUG_KEY, JSON.stringify(list.slice(0, DEBUG_MAX)));
  } catch (err) {
    console.error("debugLog error:", err);
  }
}

async function handleDebug(env) {
  const raw = await env.FINN_KV.get(DEBUG_KEY);
  const list = raw ? JSON.parse(raw) : [];
  return corsResponse(new Response(JSON.stringify({ ok: true, count: list.length, events: list }, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  }));
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
  let body;
  try { body = await request.json(); } catch { return new Response("Bad Request", { status: 400 }); }

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

async function processMessage(msg, env) {
  const phone = msg.from;
  if (!phone) return;

  const stateData = await getState(phone, env);
  const state = stateData.state || "idle";

  if (msg.type === "interactive") {
    const interactive = msg.interactive;
    if (interactive.type === "list_reply") {
      return handleListReply(phone, interactive.list_reply.id, stateData, env);
    }
    if (interactive.type === "button_reply") {
      return handleButtonReply(phone, interactive.button_reply.id, stateData, env);
    }
  }

  if (msg.type === "audio") {
    return handleAudioMessage(phone, msg, env);
  }

  if (msg.type === "image") {
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
    if (["sync","sinc","sincronizar","extrato"].includes(lower)) {
      return handleSincronizarFinn(phone, env);
    }
    if (["analise","análise"].includes(lower)) {
      return handleAnaliseExtratoPrompt(phone, env);
    }
    if (["score","pontuação","saúde"].includes(lower)) {
      return handleScoreFinanceiro(phone, env);
    }
    if (["dashboard","graficos","gráficos"].includes(lower)) {
      return handleDashboardCompleto(phone, env);
    }
    if (["panico","pânico","modo panico","modo pânico"].includes(lower)) {
      return handleModoPanico(phone, env);
    }

    await sendText(phone, "👋 Olá! Digite *menu* ou envie um 🎙️ áudio/_foto de comprovante_ para lançar.\n\nOutros comandos: *analise* · *score* · *dashboard* 🦊", env);
  }
}

// =============================================================================
// LIST / BUTTON REPLY HANDLERS
// =============================================================================
async function handleListReply(phone, rowId, stateData, env) {
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
    cat_alimentacao:"Alimentacao", cat_transporte:"Transporte", cat_lazer:"Lazer",
    cat_saude:"Saude", cat_educacao:"Educacao", cat_moradia:"Moradia",
    cat_vestuario:"Vestuario", cat_investimento:"Investimento", cat_outros:"Outros",
    cat_salario:"Salario", cat_freelance:"Freelance", cat_aluguel:"Aluguel",
    cat_venda:"Venda", cat_bonus:"Bonus",
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
    case "resumo_mes":    await handleResumoMes(phone, env); break;
    case "alertas_limite": await handleAlertasLimite(phone, env); break;
    case "status_metas":  await handleStatusMetas(phone, env); break;
    case "contas_fixas":  await handleContasFixas(phone, env); break;
    case "previsao_saldo":   await handlePrevisaoSaldo(phone, env); break;
    case "modo_panico":      await handleModoPanico(phone, env); break;
    case "analise_extrato":   await handleAnaliseExtratoPrompt(phone, env); break;
    case "score_financeiro":  await handleScoreFinanceiro(phone, env); break;
    case "sinc_finn":        await handleSincronizarFinn(phone, env); break;
    case "abrir_finn":       await handleAbrirFinn(phone, env); break;
    default: await sendText(phone, "❓ Opção não reconhecida. Digite *menu* para tentar novamente.", env);
  }
}

async function handleButtonReply(phone, selectedId, stateData, env) {
  const catMap = {
    btn_alimentacao:"Alimentacao", btn_transporte:"Transporte", btn_lazer:"Lazer",
    btn_saude:"Saude", btn_educacao:"Educacao", btn_moradia:"Moradia",
    btn_vestuario:"Vestuario", btn_investimento:"Investimento", btn_outros:"Outros",
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

  if (state === "awaiting_desc_despesa") {
    const tx = buildTransaction({ ...pending, desc: text });
    await addTransaction(phone, tx, env);
    await clearState(phone, env);
    await sendText(phone, `✅ *Despesa registrada!*\n\n💸 R$ ${formatBRL(Math.abs(tx.val))} — ${catToEmoji(tx.cat)} ${tx.cat}\n📝 ${tx.desc}\n📅 ${formatDateBR(tx.date)}\n\n_Abra o Finn_ 👉 ${env.FINN_URL || ""}`, env);
    return;
  }

  if (state === "awaiting_desc_receita") {
    const tx = buildTransaction({ ...pending, desc: text });
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
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const monthTxs = (data.txs||[]).filter(tx => { const d=new Date(tx.date); return d.getFullYear()===year&&d.getMonth()===month; });
  const receitas = monthTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const despesas = monthTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
  const saldo = receitas - despesas;
  const byCat = {};
  monthTxs.filter(t=>t.val<0).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});
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
  const now = new Date();
  const monthTxs = (data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&tx.val<0;});
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
  const now = new Date();
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
  const now = new Date();
  const year=now.getFullYear(), month=now.getMonth();
  const ym=`${year}-${String(month+1).padStart(2,"0")}`;
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===year&&d.getMonth()===month;});
  const receitas=monthTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const despesas=monthTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
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
  const now = new Date();
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&tx.val<0;});
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
  const botTxs = txs.filter(t => t.source === "whatsapp");

  if (!botTxs.length) {
    await sendText(phone,
      `📭 *Sem lançamentos do bot ainda.*\n\nUse o menu para registrar uma despesa ou receita e eles aparecerão no Finn automaticamente.\n\n👉 ${env.FINN_URL||""}`, env);
    return;
  }

  const now = new Date();
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
    `Envie o arquivo do seu extrato aqui no WhatsApp:\n\n` +
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
    const buffer = await downloadMetaMedia(doc.id, env);
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
  const now = new Date();
  const monthTxs = (data.txs||[]).filter(tx => {
    const d = new Date(tx.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const receitas = monthTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const despesas = monthTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
  const saldo = receitas - despesas;
  const goals = data.goals || [];
  const limits = data.limits || {};
  const byCat = {};
  monthTxs.filter(t=>t.val<0).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});

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
  const now = new Date();
  const year = now.getFullYear(), cm = now.getMonth();

  // 6 months data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, cm - i, 1);
    const mm = d.getMonth(), my = d.getFullYear();
    const mt = (data.txs||[]).filter(tx => {
      const td = new Date(tx.date); return td.getMonth()===mm && td.getFullYear()===my;
    });
    const r = mt.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
    const e = mt.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
    months.push({ lbl: d.toLocaleDateString('pt-BR',{month:'short'}), r, e, n: r-e });
  }

  const cur = months[months.length-1];
  const catMap = {};
  (data.txs||[]).filter(tx => {
    const d = new Date(tx.date); return d.getMonth()===cm && d.getFullYear()===year && tx.val<0;
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
    const buffer = await downloadMetaMedia(audioId, env);
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
    const buffer = await downloadMetaMedia(imageId, env);
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

async function downloadMetaMedia(mediaId, env) {
  const urlResp = await fetch(`https://graph.facebook.com/${META_API_VERSION}/${mediaId}`, {
    headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` }
  });
  if (!urlResp.ok) { console.error("Media URL fetch error:", urlResp.status); return null; }
  const { url } = await urlResp.json();
  if (!url) return null;
  const fileResp = await fetch(url, { headers: { "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}` } });
  if (!fileResp.ok) { console.error("Media download error:", fileResp.status); return null; }
  return fileResp.arrayBuffer();
}

async function extractTransactionAI(text, env) {
  if (!env.AI) return null;
  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        { role: "system", content: 'Você extrai transações financeiras de texto em português. Responda APENAS com JSON válido, sem texto extra: {"val":0,"desc":"","tipo":"despesa","cat":"Outros"}. val é o valor positivo em reais. tipo é "despesa" ou "receita". cat: Alimentacao, Transporte, Lazer, Saude, Educacao, Moradia, Vestuario, Investimento, Salario, Freelance, Outros.' },
        { role: "user", content: text }
      ],
      max_tokens: 150
    });
    return parseAIResponse(result?.response || "");
  } catch(e) { console.error("extractTransactionAI:", e); return null; }
}

function parseAIResponse(text) {
  if (!text) return null;
  try {
    const match = text.match(/\{[^}]+\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    const val = parseFloat(obj.val);
    if (isNaN(val) || val <= 0 || !obj.desc) return null;
    const isReceita = (obj.tipo || "").toLowerCase() === "receita";
    return {
      val: isReceita ? Math.abs(val) : -Math.abs(val),
      desc: String(obj.desc).trim(),
      cat: obj.cat || "Outros",
    };
  } catch(e) { return null; }
}

async function sendConfirmTransaction(phone, tx, label, env) {
  const tipo = tx.val > 0 ? "💰 Receita" : "💸 Despesa";
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"button",
      body:{text:`${label}\n\n${tipo}: *R$ ${formatBRL(Math.abs(tx.val))}*\n📝 ${tx.desc}\n📂 ${tx.cat}\n\nConfirmar lançamento?`},
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
  const saved = buildTransaction(tx);
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

async function handleSyncGet(request, env) {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  if (!phone) return corsResponse(new Response(JSON.stringify({error:"phone required"}),{status:400,headers:{"Content-Type":"application/json"}}));

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
}

async function handleSync(request, env) {
  let body;
  try { body=await request.json(); } catch { return corsResponse(new Response(JSON.stringify({error:"Invalid JSON"}),{status:400})); }
  const {phone,data,fixed}=body;
  if (!phone) return corsResponse(new Response(JSON.stringify({error:"phone required"}),{status:400}));
  if (data) await saveUserData(phone,data,env);
  if (fixed) await env.FINN_KV.put(`fixed_${phone}`,JSON.stringify(fixed));
  return corsResponse(new Response(JSON.stringify({ok:true,phone}),{status:200,headers:{"Content-Type":"application/json"}}));
}

// =============================================================================
// DAILY DASHBOARD (cron 01:00 UTC = 22:00 BRT)
// =============================================================================
async function sendDailyDashboards(env) {
  const list = await env.FINN_KV.list({prefix:"data_"});
  for (const key of list.keys) {
    const phone=key.name.replace("data_","");
    if (!phone) continue;
    try {
      const data=await getUserData(phone,env);
      if (!data?.txs?.length) continue;
      await sendText(phone,buildDashboardMessage(data,env),env);
    } catch(err) { console.error(`Dashboard error for ${phone}:`,err); }
  }
}

function buildDashboardMessage(data, env) {
  const now=new Date();
  const year=now.getFullYear(),month=now.getMonth();
  const finnUrl=env.FINN_URL||"";
  const todayStr=now.toISOString().slice(0,10);
  const todayTxs=(data.txs||[]).filter(tx=>tx.date?.slice(0,10)===todayStr);
  const monthTxs=(data.txs||[]).filter(tx=>{const d=new Date(tx.date);return d.getFullYear()===year&&d.getMonth()===month;});
  const tR=todayTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const tD=todayTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
  const mR=monthTxs.filter(t=>t.val>0).reduce((s,t)=>s+t.val,0);
  const mD=monthTxs.filter(t=>t.val<0).reduce((s,t)=>s+Math.abs(t.val),0);
  const mS=mR-mD;
  const limits=data.limits||{};
  const byCat={};
  monthTxs.filter(t=>t.val<0).forEach(t=>{byCat[t.cat]=(byCat[t.cat]||0)+Math.abs(t.val);});
  const catAlerts=Object.entries(byCat).filter(([cat])=>limits[cat]).map(([cat,spent])=>{
    const pct=(spent/limits[cat])*100;
    if(pct>=100) return `  🔴 ${catToEmoji(cat)} ${cat}: ${Math.round(pct)}%`;
    if(pct>=80) return `  🟡 ${catToEmoji(cat)} ${cat}: ${Math.round(pct)}%`;
    return null;
  }).filter(Boolean);
  const dateStr=now.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});
  const closing=getMotivationalLine(mD,mR,mS);
  let msg=`📊 *FINN. — DASHBOARD DAS 22H*\n━━━━━━━━━━━━━━━\n📅 ${capitalizeFirst(dateStr)}\n\n`;
  if(todayTxs.length) msg+=`*Hoje:*\n  💰 R$ ${formatBRL(tR)}  💸 R$ ${formatBRL(tD)}\n\n`;
  else msg+=`_Nenhum lançamento hoje._\n\n`;
  msg+=`*Mês:*\n  💰 Receitas: R$ ${formatBRL(mR)}\n  💸 Despesas: R$ ${formatBRL(mD)}\n  ${mS>=0?"📈":"📉"} Saldo: R$ ${formatBRL(mS)}\n`;
  if(catAlerts.length) msg+=`\n*Limites:*\n${catAlerts.join("\n")}\n`;
  msg+=`\n━━━━━━━━━━━━━━━\n_${closing}_\n\n👉 ${finnUrl}`;
  return msg;
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
    const body = await resp.text();
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
  return metaPost({messaging_product:"whatsapp",to:phone,type:"text",text:{body:message,preview_url:false}},env);
}

async function sendMainMenu(phone, env) {
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      header:{type:"text",text:"Finn. 🦊"},
      body:{text:"👋 Olá! Sou o Finn., seu assistente financeiro.\n\nEscolha uma opção:"},
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

async function sendCategoryList(phone, val, env) {
  const v = Math.abs(val);
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:`Despesa de R$ ${formatBRL(v)}.\nQual a categoria?`},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Despesa",rows:[
          {id:`c|d|${v}|Alimentacao`,title:"🍔 Alimentação"},
          {id:`c|d|${v}|Transporte`,title:"🚗 Transporte"},
          {id:`c|d|${v}|Lazer`,title:"🎮 Lazer"},
          {id:`c|d|${v}|Saude`,title:"🏥 Saúde"},
          {id:`c|d|${v}|Educacao`,title:"📚 Educação"},
          {id:`c|d|${v}|Moradia`,title:"🏠 Moradia"},
          {id:`c|d|${v}|Vestuario`,title:"👕 Vestuário"},
          {id:`c|d|${v}|Investimento`,title:"📈 Investimento"},
          {id:`c|d|${v}|Outros`,title:"📦 Outros"}
        ]}]
      }
    }
  },env);
}

async function sendCategoryListReceita(phone, val, env) {
  const v = Math.abs(val);
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:`Receita de R$ ${formatBRL(v)}.\nQual a categoria?`},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Receita",rows:[
          {id:`c|r|${v}|Salario`,title:"💼 Salário"},
          {id:`c|r|${v}|Freelance`,title:"💻 Freelance/Serviços"},
          {id:`c|r|${v}|Investimento`,title:"📈 Investimentos"},
          {id:`c|r|${v}|Aluguel`,title:"🏠 Aluguel"},
          {id:`c|r|${v}|Venda`,title:"🛍️ Venda"},
          {id:`c|r|${v}|Bonus`,title:"🎁 Bônus/Presente"},
          {id:`c|r|${v}|Outros`,title:"📦 Outros"}
        ]}]
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

async function addTransaction(phone, tx, env) {
  const data=await getUserData(phone,env);
  await saveUserData(phone,{...data,txs:[...(data.txs||[]),tx]},env);
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
function parseMonetaryValue(text) {
  const clean=text.replace(/R\$\s*/g,"").trim().replace(/\.(\d{3}),/g,"$1.").replace(",",".");
  const val=parseFloat(clean);
  if(isNaN(val)||val<=0) return null;
  return val;
}

function buildTransaction({val,cat,desc}) {
  return {
    id:`wa_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
    date:new Date().toISOString().slice(0,10),
    desc:desc||"Sem descrição", val:val||0, cat:cat||"Outros", source:"whatsapp",
  };
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
  const map={Alimentacao:"🍔",Alimentação:"🍔",Transporte:"🚗",Saude:"🏥",Saúde:"🏥",Lazer:"🎮",Educacao:"📚",Educação:"📚",Moradia:"🏠",Vestuario:"👕",Vestuário:"👕",Investimento:"📈",Outros:"📦"};
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

function parseBRNum(s) {
  if (!s) return 0;
  const c = s.replace(/"/g,'').replace(/[R$\s]/g,'').trim();
  if (!c) return 0;
  const n = parseFloat(c.replace(/\./g,'').replace(',','.'));
  return isNaN(n) ? (parseFloat(c.replace(/,/g,'')) || 0) : n;
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
  const dates   = txs.map(t => t.date).sort();
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

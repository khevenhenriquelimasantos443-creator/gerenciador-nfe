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
// WEBHOOK VERIFICATION (GET) — required by Meta
// =============================================================================
function handleWebhookVerification(request, env) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// =============================================================================
// WEBHOOK HANDLER (POST)
// =============================================================================
async function handleWebhook(request, env) {
  let body;
  try { body = await request.json(); } catch { return new Response("Bad Request", { status: 400 }); }

  if (body.object !== "whatsapp_business_account") {
    return new Response("OK", { status: 200 });
  }

  for (const entry of (body.entry || [])) {
    for (const change of (entry.changes || [])) {
      if (change.field !== "messages") continue;
      for (const msg of (change.value?.messages || [])) {
        try { await processMessage(msg, env); } catch (err) { console.error("processMessage error:", err); }
      }
    }
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

    await sendText(phone, "👋 Olá! Digite *menu* para ver as opções do Finn. 🦊", env);
  }
}

// =============================================================================
// LIST / BUTTON REPLY HANDLERS
// =============================================================================
async function handleListReply(phone, rowId, stateData, env) {
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

  if (state === "awaiting_valor_despesa") {
    const val = parseMonetaryValue(text);
    if (val === null) { await sendText(phone, "⚠️ Não entendi o valor. Tente assim: *45,90* ou *45.90*", env); return; }
    await setState(phone, { state: "awaiting_cat_despesa", pending: { ...pending, val: -Math.abs(val) } }, env);
    await sendCategoryList(phone, env);
    return;
  }

  if (state === "awaiting_valor_receita") {
    const val = parseMonetaryValue(text);
    if (val === null) { await sendText(phone, "⚠️ Não entendi o valor. Tente assim: *3200,00*", env); return; }
    await setState(phone, { state: "awaiting_cat_receita", pending: { ...pending, val: Math.abs(val) } }, env);
    await sendCategoryListReceita(phone, env);
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
// SYNC ENDPOINTS
// =============================================================================
async function handleSyncGet(request, env) {
  const url = new URL(request.url);
  const phone = url.searchParams.get("phone");
  if (!phone) return corsResponse(new Response(JSON.stringify({error:"phone required"}),{status:400,headers:{"Content-Type":"application/json"}}));
  const data = await getUserData(phone, env);
  const fixed = await getFixedBills(phone, env);
  return corsResponse(new Response(JSON.stringify({ok:true, data, fixed}),{status:200,headers:{"Content-Type":"application/json"}}));
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
// META API HELPERS
// =============================================================================
async function metaPost(payload, env) {
  const url=`https://graph.facebook.com/${META_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const resp=await fetch(url,{
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":`Bearer ${env.WHATSAPP_ACCESS_TOKEN}`},
    body:JSON.stringify(payload)
  });
  if(!resp.ok) console.error(`Meta API error ${resp.status}:`,await resp.text());
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
            {id:"modo_panico",title:"Modo Pânico 🚨",description:"Análise de emergência"},
            {id:"sinc_finn",title:"Sincronizar com Finn 🔄",description:"Enviar extrato pro app"},
            {id:"abrir_finn",title:"Abrir Finn",description:"Link direto para o app"}
          ]}
        ]
      }
    }
  },env);
}

async function sendCategoryList(phone, env) {
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:"Qual a categoria da despesa?"},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Despesa",rows:[
          {id:"cat_alimentacao",title:"🍔 Alimentação"},
          {id:"cat_transporte",title:"🚗 Transporte"},
          {id:"cat_lazer",title:"🎮 Lazer"},
          {id:"cat_saude",title:"🏥 Saúde"},
          {id:"cat_educacao",title:"📚 Educação"},
          {id:"cat_moradia",title:"🏠 Moradia"},
          {id:"cat_vestuario",title:"👕 Vestuário"},
          {id:"cat_investimento",title:"📈 Investimento"},
          {id:"cat_outros",title:"📦 Outros"}
        ]}]
      }
    }
  },env);
}

async function sendCategoryListReceita(phone, env) {
  return metaPost({
    messaging_product:"whatsapp", to:phone, type:"interactive",
    interactive:{
      type:"list",
      body:{text:"Qual a categoria da receita?"},
      action:{
        button:"Escolher categoria",
        sections:[{title:"Categorias de Receita",rows:[
          {id:"cat_salario",title:"💼 Salário"},
          {id:"cat_freelance",title:"💻 Freelance/Serviços"},
          {id:"cat_investimento",title:"📈 Investimentos"},
          {id:"cat_aluguel",title:"🏠 Aluguel"},
          {id:"cat_venda",title:"🛍️ Venda"},
          {id:"cat_bonus",title:"🎁 Bônus/Presente"},
          {id:"cat_outros",title:"📦 Outros"}
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

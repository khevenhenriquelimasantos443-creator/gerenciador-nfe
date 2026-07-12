/* Popup — interface do Verificador de Anúncios Shopee */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const views = ['wrongsite', 'reload', 'ready', 'progress', 'error', 'result'];
  function show(view) {
    for (const v of views) $('view-' + v).classList.toggle('hidden', v !== view);
  }

  const SELLER_URL = 'https://seller.shopee.com.br/portal/product/list/all';
  let currentTabId = null;
  let lastResult = null; // { rows, summary, debug }

  // ---------------------------------------------------------- formatação
  const fmtMoney = (v) => (v === null || v === undefined) ? '—'
    : 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtNum = (v) => (v === null || v === undefined) ? '—' : Number(v).toLocaleString('pt-BR');

  // ---------------------------------------------------------- inicialização
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    $('btn-open-seller').addEventListener('click', () => chrome.tabs.create({ url: SELLER_URL }));
    $('btn-reload').addEventListener('click', async () => {
      if (currentTabId) await chrome.tabs.reload(currentTabId);
      window.close();
    });
    $('btn-scan').addEventListener('click', startScan);
    $('btn-retry').addEventListener('click', startScan);
    $('btn-rescan').addEventListener('click', startScan);
    $('btn-dash').addEventListener('click', () => chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') }));
    $('btn-csv').addEventListener('click', downloadCsv);
    $('btn-copy').addEventListener('click', copyTsv);
    $('filter').addEventListener('input', renderTable);
    $('only-promo').addEventListener('change', renderTable);
    $('only-nostock').addEventListener('change', renderTable);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabId = tab && tab.id;
    const onSeller = tab && tab.url && /^https:\/\/seller\.shopee\.(com\.br|com)\//.test(tab.url);

    // resultado salvo da última varredura
    const stored = await chrome.storage.local.get('spx_last_result');
    if (stored && stored.spx_last_result) lastResult = stored.spx_last_result;

    if (!onSeller) {
      if (lastResult) { renderResult(); } else { show('wrongsite'); }
      return;
    }

    // content script está vivo?
    let alive = false;
    try {
      const resp = await chrome.tabs.sendMessage(currentTabId, { type: 'ping' });
      alive = !!(resp && resp.ok);
    } catch (e) { alive = false; }

    if (!alive) { show('reload'); return; }
    if (lastResult) { renderResult(); } else { show('ready'); }
  }

  // ---------------------------------------------------------- varredura
  function startScan() {
    if (!currentTabId) return;
    show('progress');
    $('progress-text').textContent = 'Conectando...';
    $('bar-fill').style.width = '5%';

    let port;
    try {
      port = chrome.tabs.connect(currentTabId, { name: 'spx-scan' });
    } catch (e) {
      showError('Não consegui conectar à página. Recarregue o Seller Center (F5) e tente de novo.', '');
      return;
    }

    port.onDisconnect.addListener(() => {
      if (!$('view-progress').classList.contains('hidden')) {
        showError('A conexão com a página caiu. Recarregue o Seller Center (F5) e tente de novo.', '');
      }
    });

    port.onMessage.addListener(async (msg) => {
      if (!msg) return;
      if (msg.type === 'status' || msg.type === 'progress') {
        $('progress-text').textContent = msg.text || '...';
        if (msg.pct) $('bar-fill').style.width = msg.pct + '%';
      } else if (msg.type === 'done') {
        lastResult = { rows: msg.rows, summary: msg.summary, debug: msg.debug };
        await chrome.storage.local.set({ spx_last_result: lastResult });
        renderResult();
        port.disconnect();
      } else if (msg.type === 'error') {
        showError(msg.message, (msg.debug || []).join('\n'));
        port.disconnect();
      }
    });

    port.postMessage({ type: 'scan' });
  }

  function showError(message, debug) {
    $('error-text').textContent = message;
    $('error-debug').textContent = debug || '(sem detalhes)';
    show('error');
  }

  // ---------------------------------------------------------- resultado
  function renderResult() {
    const { rows, summary } = lastResult;

    const cards = [
      { n: summary.total, t: 'anúncios', cls: '' },
      { n: summary.comPromo, t: 'com promoção', cls: 'destaque' },
      { n: summary.semPromo, t: 'sem promoção', cls: '' },
      { n: summary.estoqueZero, t: 'estoque zerado', cls: summary.estoqueZero ? 'alerta' : 'ok' },
      summary.temVendas30
        ? { n: fmtNum(summary.vendas30), t: 'vendas (30 dias)', cls: 'ok' }
        : { n: fmtNum(rows.reduce((a, r) => a + (r.vendasTotal || 0), 0)), t: 'vendas (total)', cls: 'ok' }
    ];
    $('cards').innerHTML = cards.map(c =>
      `<div class="card ${c.cls}"><b>${c.n}</b><span>${c.t}</span></div>`).join('');

    $('result-ts').textContent = 'Verificado em: ' + (summary.geradoEm || '—');
    renderTable();
    show('result');
  }

  function filteredRows() {
    const q = $('filter').value.trim().toLowerCase();
    const onlyPromo = $('only-promo').checked;
    const onlyNoStock = $('only-nostock').checked;
    return lastResult.rows.filter(r => {
      if (onlyPromo && !r.emPromocao) return false;
      if (onlyNoStock && r.estoque !== 0) return false;
      if (q && !(r.nome.toLowerCase().includes(q) || r.id.includes(q))) return false;
      return true;
    });
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  function renderTable() {
    if (!lastResult) return;
    const rows = filteredRows();
    const MAX = 300;
    const html = rows.slice(0, MAX).map(r => {
      const estoque = r.estoque === null ? '—'
        : (r.estoque === 0 ? '<span class="zero">0</span>' : fmtNum(r.estoque));
      const preco = r.emPromocao && r.precoOriginal && r.precoPromocional
        ? `${fmtMoney(r.precoPromocional)}<span class="riscado">${fmtMoney(r.precoOriginal)}</span>`
        : fmtMoney(r.precoAtual);
      const promo = r.emPromocao
        ? `<span class="tag sim">SIM${r.descontoPct ? ' -' + String(r.descontoPct).replace('.', ',') + '%' : ''}</span>` +
          (r.promoNome ? `<span class="promoname">${esc(r.promoNome)}</span>` : '')
        : '<span class="tag nao">não</span>';
      const vendas = r.vendas30 !== null ? fmtNum(r.vendas30) + ' <small>(30d)</small>'
        : (r.vendasTotal !== null ? fmtNum(r.vendasTotal) + ' <small>(total)</small>' : '—');
      return `<tr>
        <td class="nome"><a href="${esc(r.link)}" target="_blank" title="${esc(r.nome)}">${esc(r.nome.length > 60 ? r.nome.slice(0, 60) + '…' : r.nome)}</a><span class="pid">ID ${esc(r.id)} · ${esc(r.status)}</span></td>
        <td>${estoque}</td>
        <td>${preco}</td>
        <td>${promo}</td>
        <td>${vendas}</td>
      </tr>`;
    }).join('');
    $('tbody').innerHTML = html || '<tr><td colspan="5" style="text-align:center;color:#999;padding:20px">Nenhum anúncio com esses filtros</td></tr>';
    $('table-note').textContent = rows.length > MAX
      ? `Mostrando ${MAX} de ${rows.length} — a planilha exportada traz todos.`
      : `${rows.length} anúncio(s) na lista. A planilha exportada traz todas as colunas.`;
  }

  // ---------------------------------------------------------- exportação
  const COLS = [
    ['ID do anúncio', r => r.id],
    ['Nome do produto', r => r.nome],
    ['Status', r => r.status],
    ['Estoque atual', r => r.estoque],
    ['Preço original (R$)', r => r.precoOriginal],
    ['Preço atual (R$)', r => r.precoAtual],
    ['Em promoção?', r => r.emPromocao ? 'Sim' : 'Não'],
    ['Preço promocional (R$)', r => r.precoPromocional],
    ['Desconto (%)', r => r.descontoPct],
    ['Nome da promoção', r => r.promoNome],
    ['Tipo de promoção', r => r.promoTipo],
    ['Vendas (30 dias)', r => r.vendas30],
    ['Vendas (total)', r => r.vendasTotal],
    ['Link no Seller Center', r => r.link]
  ];

  function cellCsv(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'number') return String(v).replace('.', ','); // Excel BR
    const s = String(v);
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function buildCsv() {
    const rows = filteredRows();
    const lines = [COLS.map(c => c[0]).join(';')];
    for (const r of rows) lines.push(COLS.map(c => cellCsv(c[1](r))).join(';'));
    return '\uFEFF' + lines.join('\r\n'); // BOM p/ acentos no Excel
  }

  function downloadCsv() {
    const blob = new Blob([buildCsv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    const d = new Date();
    const stamp = d.toISOString().slice(0, 10) + '_' + String(d.getHours()).padStart(2, '0') + 'h' + String(d.getMinutes()).padStart(2, '0');
    a.href = URL.createObjectURL(blob);
    a.download = 'anuncios_shopee_' + stamp + '.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function copyTsv() {
    const rows = filteredRows();
    const cellTsv = (v) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'number') return String(v).replace('.', ',');
      return String(v).replace(/[\t\n]/g, ' ');
    };
    const lines = [COLS.map(c => c[0]).join('\t')];
    for (const r of rows) lines.push(COLS.map(c => cellTsv(c[1](r))).join('\t'));
    await navigator.clipboard.writeText(lines.join('\n'));
    const btn = $('btn-copy');
    const old = btn.textContent;
    btn.textContent = '✅ Copiado!';
    setTimeout(() => { btn.textContent = old; }, 1800);
  }
})();

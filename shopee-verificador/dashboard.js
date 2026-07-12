/* Painel de Anúncios Shopee
   Fonte de dados: window.SPX_DATA (versão web, dados embutidos) ou
   chrome.storage.local 'spx_last_result' (versão extensão, última varredura). */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // ------------------------------------------------------------ formatação
  const fmtInt = (v) => Number(v).toLocaleString('pt-BR');
  const fmtMoney = (v) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function fmtCompact(v) {
    v = Number(v);
    if (v >= 1000000) return (v / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
    if (v >= 10000) return (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
    return fmtInt(v);
  }
  const pct = (part, whole) => whole ? Math.round((part / whole) * 100) + '%' : '—';

  // ------------------------------------------------------------ dados
  let ALL = [];          // linhas normalizadas
  let META = {};
  let salesMode = 'total'; // 'v30' quando a maioria tem vendas de 30 dias

  function normalizeRow(r) {
    const num = (x) => (x === null || x === undefined || x === '' || isNaN(x)) ? null : Number(x);
    return {
      id: String(r.id ?? ''),
      nome: String(r.nome ?? ''),
      sku: r.sku ? String(r.sku) : null,
      skuVar: r.skuVar ? String(r.skuVar) : null,
      ean: r.ean ? String(r.ean) : null,
      status: String(r.status ?? ''),
      estoque: num(r.estoque),
      preco: num(r.precoAtual ?? r.preco),
      precoOriginal: num(r.precoOriginal),
      promo: !!(r.emPromocao ?? r.promo),
      promoNome: r.promoNome || null,
      descontoPct: num(r.descontoPct),
      v30: num(r.vendas30 ?? r.v30),
      vTotal: num(r.vendasTotal ?? r.vTotal),
      link: r.link || (r.id ? 'https://seller.shopee.com.br/portal/product/' + r.id : null)
    };
  }

  let booted = false;

  function ingest(rows, meta) {
    ALL = rows.map(normalizeRow).filter(r => r.id);
    META = meta || {};
    const com30 = ALL.filter(r => r.v30 !== null).length;
    salesMode = (com30 >= ALL.length * 0.3) ? 'v30' : 'total';
    // status corrigido: anúncio "Ativo" com estoque 0 é, na prática, esgotado
    for (const r of ALL) {
      if (r.estoque === 0 && r.status === 'Ativo') r.status = 'Esgotado';
    }
    if (!booted) { booted = true; boot(); }
    else renderAll(); // atualização silenciosa: mantém filtros e ordenação
    $('meta').textContent = (META.geradoEm ? 'Varredura de ' + META.geradoEm + ' · ' : '') +
      fmtInt(ALL.length) + ' anúncios · vendas exibidas: ' + vendasLabel();
  }

  const vendasDe = (r) => salesMode === 'v30' ? (r.v30 ?? 0) : (r.vTotal ?? 0);
  const vendasLabel = () => salesMode === 'v30' ? 'vendas (30 dias)' : 'vendas (total)';

  // ---------------------------------------------------- modo site (Worker)
  function siteLoad() {
    let token = null;
    const m = location.hash.match(/[#&]t=([^&]+)/);
    if (m) {
      token = decodeURIComponent(m[1]);
      try { localStorage.setItem('spx_site_token', token); } catch (e) { /* privado */ }
      try { history.replaceState(null, '', location.pathname); } catch (e) { /* ok */ }
    } else {
      try { token = localStorage.getItem('spx_site_token'); } catch (e) { /* privado */ }
    }
    if (!token) { showTokenForm(''); return; }
    fetchSite(token, true);
    if (!window.__spxPoll) {
      window.__spxPoll = setInterval(() => fetchSite(token, false), 5 * 60 * 1000);
    }
  }

  function fetchSite(token, firstLoad) {
    fetch('dados?token=' + encodeURIComponent(token))
      .then(async (res) => {
        if (res.status === 401) { showTokenForm('Token inválido — confira o SYNC_TOKEN do Worker e cole de novo.'); return; }
        if (res.status === 404) { if (firstLoad) showEmptyState(); return; }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const d = await res.json();
        if (d && d.rows) {
          ingest(d.rows, { geradoEm: (d.summary && d.summary.geradoEm) || d.recebidoEm || '' });
        }
      })
      .catch((e) => { if (firstLoad) siteMessage('Não consegui carregar os dados (' + e.message + '). Recarregue a página.'); });
  }

  function siteMessage(text) {
    document.querySelector('.wrap').innerHTML =
      '<div class="card"><p class="empty"></p></div>';
    document.querySelector('.empty').textContent = text;
  }

  function showTokenForm(msg) {
    const wrap = document.querySelector('.wrap');
    wrap.textContent = '';
    const card = document.createElement('div');
    card.className = 'card tokencard';
    const h = document.createElement('h2');
    h.textContent = 'Conectar ao seu painel';
    const p = document.createElement('p');
    p.className = 'desc';
    p.textContent = msg || 'Cole o token do seu Worker (o mesmo SYNC_TOKEN configurado no Cloudflare). Você só faz isso uma vez neste aparelho.';
    const input = document.createElement('input');
    input.type = 'password';
    input.className = 'search';
    input.placeholder = 'Token de acesso';
    input.style.margin = '10px 0';
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = 'Entrar';
    const go = () => {
      const t = input.value.trim();
      if (!t) return;
      try { localStorage.setItem('spx_site_token', t); } catch (e) { /* privado */ }
      location.reload();
    };
    btn.addEventListener('click', go);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    card.appendChild(h); card.appendChild(p); card.appendChild(input); card.appendChild(btn);
    wrap.appendChild(card);
    input.focus();
  }

  function loadData() {
    if (window.SPX_DATA) {
      const d = window.SPX_DATA;
      if (d.cols && Array.isArray(d.rows)) {
        const idx = {};
        d.cols.forEach((c, i) => { idx[c] = i; });
        const rows = d.rows.map(a => {
          const o = {};
          for (const c of d.cols) o[c] = a[idx[c]];
          return o;
        });
        ingest(rows, d.meta);
      } else {
        ingest(d.rows || [], d.meta);
      }
      return;
    }
    if (window.SPX_SITE) { siteLoad(); return; }
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get('spx_last_result', (st) => {
        const res = st && st.spx_last_result;
        if (res && res.rows && res.rows.length) {
          ingest(res.rows, { geradoEm: res.summary && res.summary.geradoEm });
        } else {
          showEmptyState();
        }
      });
      return;
    }
    showEmptyState();
  }

  function showEmptyState() {
    const texto = window.SPX_SITE
      ? 'A extensão ainda não enviou nenhuma varredura para este site.<br>No Seller Center, abra a extensão, configure o site em "🌐 Enviar para meu site" e clique em Verificar.'
      : 'Nenhuma varredura encontrada.<br>Abra o Seller Center, clique na extensão e em "Verificar todos os anúncios" — depois volte aqui.';
    document.querySelector('.wrap').innerHTML =
      '<div class="card"><p class="empty">' + texto + '</p></div>';
  }

  // ------------------------------------------------------------ filtros
  let chip = 'todos';
  let query = '';
  let sortKey = 'vendas';
  let sortDir = -1;
  let visible = 250;

  function filtered() {
    const q = query.trim().toLowerCase();
    return ALL.filter(r => {
      if (chip === 'promo' && !r.promo) return false;
      if (chip === 'semPromo' && r.promo) return false;
      if (chip === 'esgotado' && r.estoque !== 0) return false;
      if (chip === 'baixo' && !(r.estoque !== null && r.estoque >= 1 && r.estoque <= 5)) return false;
      if (chip === 'comEstoque' && !(r.estoque !== null && r.estoque > 0)) return false;
      if (q && !(r.nome.toLowerCase().includes(q) || r.id.includes(q) ||
        (r.sku && r.sku.toLowerCase().includes(q)) || (r.skuVar && r.skuVar.toLowerCase().includes(q)) ||
        (r.ean && r.ean.includes(q)))) return false;
      return true;
    });
  }

  // ------------------------------------------------------------ tooltip
  const tip = () => $('tooltip');
  function tipShow(evt, title, rows) {
    const t = tip();
    t.textContent = '';
    const h = document.createElement('div');
    h.className = 'tt-title';
    h.textContent = title;
    t.appendChild(h);
    for (const [label, value] of rows) {
      const row = document.createElement('div');
      row.className = 'tt-row';
      const s = document.createElement('span');
      s.textContent = label;
      const b = document.createElement('b');
      b.textContent = value;
      row.appendChild(s); row.appendChild(b);
      t.appendChild(row);
    }
    t.classList.add('show');
    tipMove(evt);
  }
  function tipMove(evt) {
    const t = tip();
    const pad = 14;
    let x = evt.clientX + pad, y = evt.clientY + pad;
    const r = t.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - pad;
    if (y + r.height > window.innerHeight - 8) y = evt.clientY - r.height - pad;
    t.style.left = x + 'px';
    t.style.top = y + 'px';
  }
  function tipHide() { tip().classList.remove('show'); }
  function bindTip(el, title, rowsFn) {
    el.addEventListener('pointerenter', (e) => tipShow(e, title, rowsFn()));
    el.addEventListener('pointermove', tipMove);
    el.addEventListener('pointerleave', tipHide);
    el.addEventListener('focus', (e) => {
      const r = el.getBoundingClientRect();
      tipShow({ clientX: r.left + r.width / 2, clientY: r.top }, title, rowsFn());
    });
    el.addEventListener('blur', tipHide);
  }

  // ------------------------------------------------------------ KPIs
  function renderKpis(rows) {
    const total = rows.length;
    const promo = rows.filter(r => r.promo).length;
    const esgotados = rows.filter(r => r.estoque === 0).length;
    const unidades = rows.reduce((a, r) => a + (r.estoque || 0), 0);
    const vendas = rows.reduce((a, r) => a + vendasDe(r), 0);

    const tiles = [
      { label: 'Anúncios', value: fmtInt(total), sub: chip === 'todos' && !query ? 'no catálogo' : 'no filtro atual' },
      { label: 'Em promoção', value: fmtInt(promo), sub: pct(promo, total) + ' do conjunto' },
      { label: 'Esgotados', value: fmtInt(esgotados), sub: pct(esgotados, total) + ' sem estoque', critical: esgotados > 0 },
      { label: 'Unidades em estoque', value: fmtCompact(unidades), sub: 'somando variações' },
      { label: 'Vendas', value: fmtCompact(vendas), sub: vendasLabel() }
    ];
    const box = $('kpis');
    box.textContent = '';
    for (const t of tiles) {
      const d = document.createElement('div');
      d.className = 'tile' + (t.critical ? ' critical' : '');
      const l = document.createElement('div'); l.className = 'label'; l.textContent = t.label;
      const v = document.createElement('div'); v.className = 'value'; v.textContent = t.value;
      const s = document.createElement('div'); s.className = 'sub'; s.textContent = t.sub;
      d.appendChild(l); d.appendChild(v); d.appendChild(s);
      box.appendChild(d);
    }
  }

  // ------------------------------------------------------------ campeões de venda
  function renderTop(rows) {
    const top = rows.slice().sort((a, b) => vendasDe(b) - vendasDe(a)).slice(0, 12);
    const box = $('topbars');
    box.textContent = '';
    const esgotadosNoTop = top.filter(r => r.estoque === 0).length;
    $('top-desc').textContent = 'Os 12 anúncios com mais ' + vendasLabel() +
      (esgotadosNoTop ? ' — ' + esgotadosNoTop + ' deles estão esgotados agora' : '');

    const max = Math.max(1, ...top.map(vendasDe));
    const css = getComputedStyle(document.documentElement);
    const cBlue = css.getPropertyValue('--series-1').trim();
    const cCrit = css.getPropertyValue('--critical').trim();

    for (const r of top) {
      const row = document.createElement('div');
      row.className = 'hrow';
      row.tabIndex = 0;

      const name = document.createElement('div');
      name.className = 'hname';
      name.title = r.nome;
      if (r.estoque === 0) {
        const flag = document.createElement('span');
        flag.className = 'flag';
        flag.textContent = '⛔ ';
        name.appendChild(flag);
      }
      name.appendChild(document.createTextNode(r.nome));

      const track = document.createElement('div');
      track.className = 'htrack';
      const bar = document.createElement('div');
      bar.className = 'hbar';
      bar.style.width = Math.max(1, (vendasDe(r) / max) * 100 * 0.82) + '%';
      bar.style.background = r.estoque === 0 ? cCrit : cBlue;
      const val = document.createElement('span');
      val.className = 'hval';
      val.textContent = fmtCompact(vendasDe(r));
      track.appendChild(bar);
      track.appendChild(val);

      row.appendChild(name);
      row.appendChild(track);
      bindTip(row, r.nome, () => [
        ['Vendas', fmtInt(vendasDe(r))],
        ['Estoque', r.estoque === null ? '—' : fmtInt(r.estoque)],
        ['Preço', r.preco === null ? '—' : fmtMoney(r.preco)],
        ['Promoção', r.promo ? 'Sim' : 'Não']
      ]);
      box.appendChild(row);
    }
    if (!top.length) {
      box.innerHTML = '<p class="empty">Nenhum anúncio nesse filtro</p>';
    }

    const leg = $('top-legend');
    leg.textContent = '';
    for (const [color, label] of [[cBlue, 'Com estoque'], [cCrit, 'Esgotado (⛔)']]) {
      const k = document.createElement('span');
      k.className = 'key';
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = color;
      k.appendChild(sw);
      k.appendChild(document.createTextNode(label));
      leg.appendChild(k);
    }
  }

  // ------------------------------------------------------------ colunas SVG
  function columnChart(container, bins, colorFor) {
    const box = $(container);
    box.textContent = '';
    const W = Math.max(320, Math.min(box.clientWidth || 520, 560));
    const H = 190, padB = 26, padT = 18, padX = 8;
    const plotH = H - padB - padT;
    const max = Math.max(1, ...bins.map(b => b.n));
    const n = bins.length;
    const band = (W - padX * 2) / n;
    const barW = Math.min(24, band * 0.55);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    svg.setAttribute('role', 'img');

    // linha de base (hairline recessiva)
    const base = document.createElementNS(svg.namespaceURI, 'line');
    base.setAttribute('x1', padX); base.setAttribute('x2', W - padX);
    base.setAttribute('y1', H - padB + 0.5); base.setAttribute('y2', H - padB + 0.5);
    base.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--baseline').trim());
    base.setAttribute('stroke-width', '1');
    svg.appendChild(base);

    const inkSec = getComputedStyle(document.documentElement).getPropertyValue('--ink-2').trim();
    const muted = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim();

    bins.forEach((b, i) => {
      const cx = padX + band * i + band / 2;
      const h = Math.max(b.n > 0 ? 3 : 0, (b.n / max) * plotH);
      const x = cx - barW / 2;
      const y = H - padB - h;
      const rr = Math.min(4, h);
      // topo arredondado 4px, base reta
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d',
        `M ${x} ${H - padB} V ${y + rr} Q ${x} ${y} ${x + rr} ${y} H ${x + barW - rr} Q ${x + barW} ${y} ${x + barW} ${y + rr} V ${H - padB} Z`);
      path.setAttribute('fill', colorFor(i));
      svg.appendChild(path);

      // rótulo direto no topo (contagem)
      const val = document.createElementNS(svg.namespaceURI, 'text');
      val.setAttribute('x', cx); val.setAttribute('y', y - 5);
      val.setAttribute('text-anchor', 'middle');
      val.setAttribute('font-size', '11');
      val.setAttribute('fill', inkSec);
      val.textContent = fmtCompact(b.n);
      svg.appendChild(val);

      // rótulo da faixa
      const lab = document.createElementNS(svg.namespaceURI, 'text');
      lab.setAttribute('x', cx); lab.setAttribute('y', H - padB + 16);
      lab.setAttribute('text-anchor', 'middle');
      lab.setAttribute('font-size', '11');
      lab.setAttribute('fill', muted);
      lab.textContent = b.label;
      svg.appendChild(lab);

      // alvo de hover maior que a marca
      const hit = document.createElementNS(svg.namespaceURI, 'rect');
      hit.setAttribute('x', padX + band * i); hit.setAttribute('y', padT);
      hit.setAttribute('width', band); hit.setAttribute('height', H - padB - padT);
      hit.setAttribute('fill', 'transparent');
      hit.setAttribute('tabindex', '0');
      bindTip(hit, b.tipTitle || b.label, () => b.tipRows);
      svg.appendChild(hit);
    });

    box.appendChild(svg);
  }

  function renderStock(rows) {
    const bins = [
      { label: '0', test: (e) => e === 0 },
      { label: '1–5', test: (e) => e >= 1 && e <= 5 },
      { label: '6–20', test: (e) => e >= 6 && e <= 20 },
      { label: '21–50', test: (e) => e >= 21 && e <= 50 },
      { label: '50+', test: (e) => e > 50 }
    ].map(b => {
      const items = rows.filter(r => r.estoque !== null && b.test(r.estoque));
      return {
        label: b.label,
        n: items.length,
        tipTitle: 'Estoque ' + b.label,
        tipRows: [
          ['Anúncios', fmtInt(items.length)],
          ['Vendas do grupo', fmtCompact(items.reduce((a, r) => a + vendasDe(r), 0))]
        ]
      };
    });
    const ramp = ['--ramp-1', '--ramp-2', '--ramp-3', '--ramp-4', '--ramp-5']
      .map(v => getComputedStyle(document.documentElement).getPropertyValue(v).trim());
    columnChart('chart-stock', bins, (i) => ramp[i]);
  }

  function renderPrice(rows) {
    const edges = [
      { label: 'até 25', test: (p) => p < 25 },
      { label: '25–50', test: (p) => p >= 25 && p < 50 },
      { label: '50–100', test: (p) => p >= 50 && p < 100 },
      { label: '100–150', test: (p) => p >= 100 && p < 150 },
      { label: '150–200', test: (p) => p >= 150 && p < 200 },
      { label: '200+', test: (p) => p >= 200 }
    ];
    const bins = edges.map(b => {
      const items = rows.filter(r => r.preco !== null && b.test(r.preco));
      return {
        label: b.label,
        n: items.length,
        tipTitle: 'Preço ' + b.label,
        tipRows: [
          ['Anúncios', fmtInt(items.length)],
          ['Em promoção', fmtInt(items.filter(r => r.promo).length)]
        ]
      };
    });
    const aqua = getComputedStyle(document.documentElement).getPropertyValue('--series-2').trim();
    columnChart('chart-price', bins, () => aqua);
  }

  // ------------------------------------------------------------ promoções
  function renderPromo(rows) {
    const total = rows.length;
    const sim = rows.filter(r => r.promo).length;
    const nao = total - sim;
    $('promo-desc').textContent = 'Participação dos anúncios em promoções no conjunto filtrado';

    const stack = $('promo-stack');
    stack.textContent = '';
    const css = getComputedStyle(document.documentElement);
    const segs = [
      { n: sim, color: css.getPropertyValue('--series-1').trim(), label: 'Em promoção' },
      { n: nao, color: css.getPropertyValue('--deemph').trim(), label: 'Sem promoção' }
    ];
    for (const s of segs) {
      if (!s.n) continue;
      const d = document.createElement('div');
      d.className = 'seg';
      d.style.background = s.color;
      d.style.width = (s.n / Math.max(1, total)) * 100 + '%';
      d.tabIndex = 0;
      bindTip(d, s.label, () => [['Anúncios', fmtInt(s.n)], ['Participação', pct(s.n, total)]]);
      stack.appendChild(d);
    }

    const labels = $('promo-labels');
    labels.textContent = '';
    const mk = (color, txt) => {
      const sp = document.createElement('span');
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.cssText = 'display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:baseline;background:' + color;
      sp.appendChild(sw);
      const b = document.createElement('b');
      b.textContent = txt;
      sp.appendChild(b);
      return sp;
    };
    labels.appendChild(mk(segs[0].color, `Em promoção · ${fmtInt(sim)} (${pct(sim, total)})`));
    labels.appendChild(mk(segs[1].color, `Sem promoção · ${fmtInt(nao)} (${pct(nao, total)})`));

    // maiores vendedores sem promoção — onde uma promoção pode render mais
    const mini = $('promo-mini');
    mini.textContent = '';
    const semPromoTop = rows.filter(r => !r.promo && r.estoque > 0)
      .sort((a, b) => vendasDe(b) - vendasDe(a)).slice(0, 8);
    if (semPromoTop.length) {
      const h3 = document.createElement('h3');
      h3.textContent = 'Mais vendidos SEM promoção (e com estoque) — candidatos a campanha';
      mini.appendChild(h3);
      const wrap = document.createElement('div');
      wrap.className = 'hbars';
      const max = Math.max(1, ...semPromoTop.map(vendasDe));
      const gray = css.getPropertyValue('--deemph').trim();
      for (const r of semPromoTop) {
        const row = document.createElement('div');
        row.className = 'hrow';
        row.tabIndex = 0;
        const name = document.createElement('div');
        name.className = 'hname';
        name.title = r.nome;
        name.textContent = r.nome;
        const track = document.createElement('div');
        track.className = 'htrack';
        const bar = document.createElement('div');
        bar.className = 'hbar';
        bar.style.width = Math.max(1, (vendasDe(r) / max) * 100 * 0.82) + '%';
        bar.style.background = gray;
        const val = document.createElement('span');
        val.className = 'hval';
        val.textContent = fmtCompact(vendasDe(r));
        track.appendChild(bar); track.appendChild(val);
        row.appendChild(name); row.appendChild(track);
        bindTip(row, r.nome, () => [
          ['Vendas', fmtInt(vendasDe(r))],
          ['Estoque', fmtInt(r.estoque)],
          ['Preço', r.preco === null ? '—' : fmtMoney(r.preco)]
        ]);
        wrap.appendChild(row);
      }
      mini.appendChild(wrap);
    }
  }

  // ------------------------------------------------------------ tabela
  const sorters = {
    nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
    sku: (a, b) => (a.sku || a.skuVar || '').localeCompare(b.sku || b.skuVar || '', 'pt-BR'),
    status: (a, b) => a.status.localeCompare(b.status, 'pt-BR'),
    estoque: (a, b) => (a.estoque ?? -1) - (b.estoque ?? -1),
    preco: (a, b) => (a.preco ?? -1) - (b.preco ?? -1),
    promo: (a, b) => (a.promo ? 1 : 0) - (b.promo ? 1 : 0),
    vendas: (a, b) => vendasDe(a) - vendasDe(b)
  };

  function renderTable(rows) {
    const sorted = rows.slice().sort((a, b) => sorters[sortKey](a, b) * sortDir);
    $('table-title').textContent = fmtInt(sorted.length) + ' anúncio(s)';

    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.querySelector('.arrow').textContent =
        th.dataset.sort === sortKey ? (sortDir === 1 ? '▲' : '▼') : '';
    });

    const tbody = $('tbody');
    tbody.textContent = '';
    const slice = sorted.slice(0, visible);
    const frag = document.createDocumentFragment();
    for (const r of slice) {
      const tr = document.createElement('tr');

      const tdNome = document.createElement('td');
      const dv = document.createElement('div');
      dv.className = 'prodname';
      dv.title = r.nome;
      if (r.link) {
        const a = document.createElement('a');
        a.href = r.link;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = r.nome;
        dv.appendChild(a);
      } else {
        dv.textContent = r.nome;
      }
      tdNome.appendChild(dv);

      const tdSku = document.createElement('td');
      tdSku.className = 'skucell';
      if (r.sku || r.skuVar || r.ean) {
        if (r.sku) {
          const s1 = document.createElement('div');
          s1.textContent = r.sku;
          s1.title = 'SKU principal: ' + r.sku;
          tdSku.appendChild(s1);
        }
        if (r.skuVar) {
          const sv = document.createElement('div');
          sv.className = 'varline';
          sv.textContent = r.skuVar;
          sv.title = 'SKUs das variações: ' + r.skuVar;
          tdSku.appendChild(sv);
        }
        if (r.ean) {
          const s2 = document.createElement('div');
          s2.className = 'eanline';
          s2.textContent = r.ean;
          s2.title = 'EAN: ' + r.ean;
          tdSku.appendChild(s2);
        }
      } else {
        tdSku.textContent = '—';
        tdSku.style.color = 'var(--muted)';
      }

      const tdStatus = document.createElement('td');
      const pill = document.createElement('span');
      pill.className = 'pill ' + (r.status === 'Esgotado' ? 'bad' : (r.status === 'Ativo' ? 'ok' : 'mid'));
      pill.textContent = r.status || '—';
      tdStatus.appendChild(pill);

      const tdEst = document.createElement('td');
      tdEst.className = 'num';
      tdEst.textContent = r.estoque === null ? '—' : fmtInt(r.estoque);
      if (r.estoque === 0) tdEst.style.color = 'var(--critical)';

      const tdPreco = document.createElement('td');
      tdPreco.className = 'num';
      tdPreco.textContent = r.preco === null ? '—' : fmtMoney(r.preco);

      const tdPromo = document.createElement('td');
      tdPromo.className = 'promocell';
      if (r.promo) {
        const b = document.createElement('b');
        b.textContent = 'Sim' + (r.descontoPct ? ' · −' + String(r.descontoPct).replace('.', ',') + '%' : '');
        tdPromo.appendChild(b);
        if (r.promoNome) {
          const s = document.createElement('span');
          s.className = 'pname';
          s.title = r.promoNome;
          s.textContent = r.promoNome;
          tdPromo.appendChild(s);
        }
      } else {
        tdPromo.textContent = 'Não';
        tdPromo.style.color = 'var(--muted)';
      }

      const tdVendas = document.createElement('td');
      tdVendas.className = 'num';
      tdVendas.textContent = fmtInt(vendasDe(r));

      tr.appendChild(tdNome); tr.appendChild(tdSku); tr.appendChild(tdStatus); tr.appendChild(tdEst);
      tr.appendChild(tdPreco); tr.appendChild(tdPromo); tr.appendChild(tdVendas);
      frag.appendChild(tr);
    }
    tbody.appendChild(frag);

    if (!slice.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty">Nenhum anúncio com esses filtros</td></tr>';
    }
    $('btn-more').style.display = sorted.length > visible ? '' : 'none';
    $('btn-more').textContent = 'Mostrar mais (' + fmtInt(Math.min(250, sorted.length - visible)) + ' de ' + fmtInt(sorted.length - visible) + ' restantes)';
  }

  // ------------------------------------------------------------ exportação
  function exportCsv(rows) {
    const cols = [
      ['ID do anúncio', r => r.id],
      ['Nome do produto', r => r.nome],
      ['SKU principal', r => r.sku],
      ['SKUs variações', r => r.skuVar],
      ['EAN/GTIN', r => r.ean],
      ['Status', r => r.status],
      ['Estoque atual', r => r.estoque],
      ['Preço original (R$)', r => r.precoOriginal],
      ['Preço atual (R$)', r => r.preco],
      ['Em promoção?', r => r.promo ? 'Sim' : 'Não'],
      ['Desconto (%)', r => r.descontoPct],
      ['Nome da promoção', r => r.promoNome],
      ['Vendas (30 dias)', r => r.v30],
      ['Vendas (total)', r => r.vTotal],
      ['Link', r => r.link]
    ];
    const cell = (v) => {
      if (v === null || v === undefined) return '';
      if (typeof v === 'number') return String(v).replace('.', ',');
      const s = String(v);
      if (/^\d{8,16}$/.test(s)) return '"=""' + s + '"""'; // EAN como texto no Excel
      return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const lines = [cols.map(c => c[0]).join(';')];
    for (const r of rows) lines.push(cols.map(c => cell(c[1](r))).join(';'));
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'anuncios_shopee_painel.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ------------------------------------------------------------ render geral
  function renderAll() {
    const rows = filtered();
    renderKpis(rows);
    renderTop(rows);
    renderStock(rows);
    renderPrice(rows);
    renderPromo(rows);
    renderTable(rows);
  }

  function boot() {
    if (window.SPX_SITE) {
      // botão de atualização manual no topo (o site também atualiza sozinho a cada 5 min)
      const bar = document.querySelector('.topbar');
      const btn = document.createElement('button');
      btn.className = 'chip';
      btn.textContent = '↻ Atualizar';
      btn.addEventListener('click', () => {
        btn.textContent = '… atualizando';
        try { fetchSite(localStorage.getItem('spx_site_token'), false); } catch (e) { /* ok */ }
        setTimeout(() => { btn.textContent = '↻ Atualizar'; }, 1500);
      });
      bar.appendChild(btn);
    }

    document.querySelectorAll('.chip').forEach(btn => {
      if (!btn.dataset.chip) return; // só os chips de filtro
      btn.addEventListener('click', () => {
        chip = btn.dataset.chip;
        visible = 250;
        document.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        renderAll();
      });
    });
    $('search').addEventListener('input', (e) => {
      query = e.target.value;
      visible = 250;
      renderAll();
    });
    document.querySelectorAll('th[data-sort]').forEach(th => {
      const act = () => {
        const k = th.dataset.sort;
        if (sortKey === k) sortDir = -sortDir;
        else { sortKey = k; sortDir = k === 'nome' || k === 'status' ? 1 : -1; }
        renderTable(filtered());
      };
      th.addEventListener('click', act);
      th.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
    });
    $('btn-more').addEventListener('click', () => { visible += 250; renderTable(filtered()); });
    $('btn-export').addEventListener('click', () => exportCsv(filtered()));

    let rzTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(rzTimer);
      rzTimer = setTimeout(() => { renderStock(filtered()); renderPrice(filtered()); }, 200);
    });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();

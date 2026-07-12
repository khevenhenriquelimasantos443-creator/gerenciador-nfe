/**
 * Content script — roda em https://seller.shopee.com.br
 *
 * Faz a varredura em massa de TODOS os anúncios usando a sessão já logada
 * do vendedor (as chamadas são feitas pelo próprio navegador, como se fosse
 * a página do Seller Center; nada sai do seu computador).
 *
 * Estratégia em camadas, porque os endpoints internos da Shopee mudam:
 *   1. Usa a URL que o próprio Seller Center chamou (capturada pelo injected.js);
 *   2. Se não tiver, tenta uma lista de endpoints conhecidos;
 *   3. Extrai os campos de forma defensiva (procura as chaves em vários formatos).
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------- captura
  const captured = { productList: null, productDetail: null, promoList: null, promoItems: null, stats: null };

  window.addEventListener('message', (ev) => {
    if (ev.source !== window) return;
    const d = ev.data;
    if (!d || !d.source) return;
    if (d.source === 'SPX_CAPTURED_URL' && d.kind && typeof d.url === 'string' && d.url.startsWith(location.origin)) {
      if (captured[d.kind] !== undefined || d.kind === 'marketing') captured[d.kind] = d.url;
      return;
    }
    if (d.source === 'SPX_CAPTURED_BODY' && typeof d.body === 'string') {
      try {
        const json = JSON.parse(d.body);
        mineProducts(json);
        mineCampaigns(json, d.url || '');
        scheduleEnrichSave();
      } catch (e) { /* corpo não é JSON válido — ignora */ }
    }
  });

  // ------------------------------------------------- enriquecimento passivo
  // Dados que a API de listagem não entrega (preço original, vendas 30 dias,
  // nome da promoção) são minerados das respostas que o próprio Seller Center
  // recebe enquanto você navega. Ficam salvos localmente e completam a
  // próxima varredura.
  const enrich = Object.create(null);       // itemId -> {po, pp, v30, pn, pt}
  const campaignNames = Object.create(null); // campanhaId -> nome
  let enrichDirty = false;
  let enrichSaveTimer = null;

  chrome.storage.local.get('spx_enrich', (st) => {
    const saved = st && st.spx_enrich;
    if (saved && saved.map) {
      for (const k of Object.keys(saved.map)) {
        if (!enrich[k]) enrich[k] = saved.map[k];
      }
    }
  });

  function scheduleEnrichSave() {
    if (!enrichDirty || enrichSaveTimer) return;
    enrichSaveTimer = setTimeout(() => {
      enrichSaveTimer = null;
      enrichDirty = false;
      if (Object.keys(enrich).length > 30000) return; // trava de segurança
      try { chrome.storage.local.set({ spx_enrich: { ts: Date.now(), map: enrich } }); } catch (e) { /* contexto invalidado */ }
    }, 1500);
  }

  // ------------------------------------------------------------- SKU / EAN
  const GTIN_KEY = /^(gtin|gtin_code|ean|ean_code|barcode|bar_code|global_barcode|upc)$/i;
  const SKU_MODEL_KEY = /^(sku|seller_sku|model_sku)$/i;
  const SKU_PARENT_KEY = /^(parent_sku|item_sku|product_sku)$/i;

  // coleta todos os valores de chaves que casem com o regex (varre fundo)
  function collectByKey(obj, keyRe, maxDepth = 6) {
    const out = [];
    (function walk(node, depth) {
      if (!node || depth > maxDepth) return;
      if (Array.isArray(node)) {
        for (const it of node.slice(0, 80)) walk(it, depth + 1);
        return;
      }
      if (typeof node !== 'object') return;
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (keyRe.test(k) && (typeof v === 'string' || typeof v === 'number')) out.push(String(v));
        else walk(v, depth + 1);
      }
    })(obj, 0);
    return out;
  }

  function cleanCodes(vals) {
    const seen = new Set();
    const out = [];
    for (let v of vals) {
      v = String(v).trim();
      if (!v || v === '0' || v === 'null' || v === 'undefined' || /^0+$/.test(v)) continue;
      if (!seen.has(v)) { seen.add(v); out.push(v); }
    }
    return out;
  }

  // extrai SKU principal, SKUs das variações e EAN de uma resposta de detalhe
  function mineDetailJson(json) {
    const eans = cleanCodes(collectByKey(json, GTIN_KEY));
    const parents = cleanCodes(collectByKey(json, SKU_PARENT_KEY));
    const modelSkus = cleanCodes(collectByKey(json, SKU_MODEL_KEY));
    return {
      sku: parents.length ? parents[0] : null,
      skuVar: modelSkus.length ? modelSkus.slice(0, 20).join(' | ') : null,
      ean: eans.length ? eans.slice(0, 20).join(' / ') : null
    };
  }

  function firstString(obj, keyRe, maxDepth) {
    let found;
    (function walk(node, depth) {
      if (found !== undefined || !node || depth > maxDepth || typeof node !== 'object') return;
      if (Array.isArray(node)) return; // nomes de campanha ficam fora das listas de itens
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (keyRe.test(k) && typeof v === 'string' && v.trim()) { found = v.trim(); return; }
      }
      for (const k of Object.keys(node)) walk(node[k], depth + 1);
    })(obj, 0);
    return found;
  }

  function mineProducts(json) {
    const arr = findObjectArray(json, o =>
      o.id !== undefined || o.product_id !== undefined || o.item_id !== undefined || o.itemid !== undefined);
    if (!arr) return;
    for (const p of arr.slice(0, 500)) {
      if (!p || typeof p !== 'object') continue;
      const id = pick(p, ['id', 'product_id', 'item_id', 'itemid']);
      if (id === undefined) continue;
      const key = String(id);
      const e = enrich[key] || (enrich[key] = {});
      const orig = normPrice(pick(p, [
        'price_detail.origin_price_min', 'origin_price', 'original_price',
        'price_before_discount', 'input_normal_price', 'normal_price'
      ]));
      if (orig !== null && orig !== undefined) { e.po = orig; enrichDirty = true; }
      const v30 = deepFindNumber(p, /(30|thirty)[a-z_]*(sold|sale|order)|(sold|sale|order)[a-z_]*(30|thirty)/i, 4);
      if (v30 !== undefined && isFinite(v30)) { e.v30 = v30; enrichDirty = true; }
      const mined = mineDetailJson(p);
      if (mined.sku) { e.sku = mined.sku; enrichDirty = true; }
      if (mined.skuVar) { e.skuVar = mined.skuVar; enrichDirty = true; }
      if (mined.ean) { e.ean = mined.ean; enrichDirty = true; }
    }
  }

  function mineCampaigns(json, url) {
    const camps = findObjectArray(json, o =>
      (o.discount_id !== undefined || o.promotion_id !== undefined || o.activity_id !== undefined || o.id !== undefined) &&
      (o.title !== undefined || o.name !== undefined || o.discount_name !== undefined || o.activity_name !== undefined));
    if (camps) {
      for (const c of camps.slice(0, 200)) {
        const cid = pick(c, ['discount_id', 'promotion_id', 'activity_id', 'id']);
        const cname = pick(c, ['title', 'name', 'discount_name', 'activity_name']);
        if (cid !== undefined && cname) campaignNames[String(cid)] = String(cname).slice(0, 80);
      }
    }
    const items = findObjectArray(json, o =>
      (o.item_id !== undefined || o.product_id !== undefined || o.itemid !== undefined) &&
      (o.promotion_price !== undefined || o.discount_price !== undefined ||
       o.promo_price !== undefined || o.promotion_price_min !== undefined));
    if (!items) return;
    let cname = null;
    const m = String(url).match(/(?:discount_id|promotion_id|activity_id)=(\d+)/);
    if (m && campaignNames[m[1]]) cname = campaignNames[m[1]];
    if (!cname) cname = firstString(json, /^(title|name|discount_name|activity_name)$/, 3) || null;
    for (const it of items.slice(0, 500)) {
      const iid = pick(it, ['item_id', 'product_id', 'itemid']);
      if (iid === undefined) continue;
      const key = String(iid);
      const e = enrich[key] || (enrich[key] = {});
      const pp = normPrice(pick(it, ['promotion_price', 'discount_price', 'promo_price', 'promotion_price_min']));
      if (pp !== null && pp !== undefined) e.pp = pp;
      if (cname) { e.pn = cname; e.pt = 'Campanha/Desconto'; }
      enrichDirty = true;
    }
  }

  // ---------------------------------------------------------------- helpers
  const debugLog = [];
  function dbg(msg) {
    debugLog.push(new Date().toISOString().slice(11, 19) + ' ' + msg);
    if (debugLog.length > 400) debugLog.shift();
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function getCds() {
    const m = document.cookie.match(/(?:^|;\s*)SPC_CDS=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  async function apiGet(url) {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'accept': 'application/json' }
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.json();
    // Padrão Shopee: code/errcode 0 = ok
    const code = json.code !== undefined ? json.code : json.errcode;
    if (code !== undefined && code !== 0) {
      throw new Error('API code ' + code + (json.message ? ' (' + json.message + ')' : ''));
    }
    return json;
  }

  function setPageParam(url, page, size) {
    const u = new URL(url, location.origin);
    let found = false;
    for (const k of ['page_number', 'page_no', 'pageNumber', 'pageNo', 'page']) {
      if (u.searchParams.has(k)) { u.searchParams.set(k, String(page)); found = true; }
    }
    if (!found) u.searchParams.set('page_number', String(page));
    for (const k of ['page_size', 'pageSize', 'limit']) {
      if (u.searchParams.has(k)) u.searchParams.set(k, String(size));
    }
    return u.toString();
  }

  // Busca em profundidade por um array de objetos que "parecem produtos"
  function findObjectArray(root, looksLike, maxDepth = 7) {
    let best = null;
    (function walk(node, depth) {
      if (!node || depth > maxDepth) return;
      if (Array.isArray(node)) {
        if (node.length && typeof node[0] === 'object' && node[0] && looksLike(node[0])) {
          if (!best || node.length > best.length) best = node;
        }
        for (const item of node.slice(0, 3)) walk(item, depth + 1);
        return;
      }
      if (typeof node === 'object') {
        for (const k of Object.keys(node)) walk(node[k], depth + 1);
      }
    })(root, 0);
    return best;
  }

  function looksLikeProduct(o) {
    const hasId = o.id !== undefined || o.product_id !== undefined || o.item_id !== undefined || o.itemid !== undefined;
    const hasName = o.name !== undefined || o.product_name !== undefined || o.title !== undefined || o.item_name !== undefined;
    return hasId && hasName;
  }

  // Procura o primeiro valor definido em uma lista de "caminhos" (a.b.c)
  function pick(obj, paths) {
    for (const path of paths) {
      let cur = obj;
      let ok = true;
      for (const part of path.split('.')) {
        if (cur && typeof cur === 'object' && part in cur) cur = cur[part];
        else { ok = false; break; }
      }
      if (ok && cur !== undefined && cur !== null && cur !== '') return cur;
    }
    return undefined;
  }

  // Busca profunda por chave que case com regex e valor numérico
  function deepFindNumber(obj, keyRe, maxDepth = 5) {
    let found;
    (function walk(node, depth) {
      if (found !== undefined || !node || depth > maxDepth || typeof node !== 'object') return;
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (keyRe.test(k) && (typeof v === 'number' || (typeof v === 'string' && v !== '' && !isNaN(v)))) {
          found = Number(v);
          return;
        }
      }
      for (const k of Object.keys(node)) walk(node[k], depth + 1);
    })(obj, 0);
    return found;
  }

  // A API pública da Shopee usa preço x100000; as do Seller Center normalmente não.
  function normPrice(v) {
    if (v === undefined || v === null || v === '') return null;
    let n = Number(v);
    if (!isFinite(n) || n < 0) return null;
    if (n >= 100000 && n % 100000 === 0) n = n / 100000;
    return n;
  }

  function minMax(list) {
    const nums = list.filter(n => n !== null && n !== undefined && isFinite(n));
    if (!nums.length) return null;
    const mn = Math.min(...nums), mx = Math.max(...nums);
    return { min: mn, max: mx };
  }

  const STATUS_MAP = {
    1: 'Ativo', 2: 'Esgotado', 3: 'Desativado', 4: 'Excluído',
    5: 'Banido', 6: 'Em análise', 'live': 'Ativo', 'sold_out': 'Esgotado',
    'normal': 'Ativo', 'delisted': 'Desativado', 'banned': 'Banido', 'reviewing': 'Em análise'
  };

  // ------------------------------------------------------- lista de produtos
  function productListCandidates(cds, page, size, listType) {
    const c = [];
    if (captured.productList) c.push(setPageParam(captured.productList, page, size));
    c.push(
      `${location.origin}/api/v3/mpsku/list/v2/get_product_list?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_number=${page}&page_size=${size}&list_type=${listType}&need_brief_sku_info=true`,
      `${location.origin}/api/v3/product/page_product_list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_number=${page}&page_size=${size}&list_type=${listType}&need_ads=true`,
      `${location.origin}/api/v3/product/page_product_list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_number=${page}&page_size=${size}&list_type=all`
    );
    return c;
  }

  async function fetchAllProducts(cds, listType, progress) {
    const SIZE = 48;
    let workingUrl = null;
    let firstJson = null;

    for (const cand of productListCandidates(cds, 1, SIZE, listType)) {
      try {
        dbg('Tentando lista de produtos: ' + cand.split('?')[0]);
        const json = await apiGet(cand);
        const arr = findObjectArray(json, looksLikeProduct);
        if (arr) { workingUrl = cand; firstJson = json; break; }
        dbg('Endpoint respondeu mas sem array de produtos.');
      } catch (e) {
        dbg('Falhou: ' + e.message);
      }
    }
    if (!workingUrl) return null;

    const total = deepFindNumber(firstJson, /^(total|total_count|item_total)$/i) || null;
    const all = [];
    let page = 1;
    let json = firstJson;

    while (true) {
      const arr = findObjectArray(json, looksLikeProduct) || [];
      all.push(...arr);
      progress(all.length, total, listType);
      const acabou = arr.length === 0 || (total ? all.length >= total : arr.length < SIZE);
      if (acabou || page >= 200) break;
      page++;
      await sleep(350); // gentil com o servidor
      try {
        json = await apiGet(setPageParam(workingUrl, page, SIZE));
      } catch (e) {
        dbg('Página ' + page + ' falhou: ' + e.message);
        break;
      }
    }
    return all;
  }

  // ----------------------------------------------------------- extração
  function extractProduct(p, listType) {
    const id = pick(p, ['id', 'product_id', 'item_id', 'itemid']);
    const name = pick(p, ['name', 'product_name', 'title', 'item_name']);
    const rawStatus = pick(p, ['status', 'product_status', 'item_status']);
    let status = STATUS_MAP[rawStatus] !== undefined ? STATUS_MAP[rawStatus]
      : (rawStatus !== undefined ? String(rawStatus) : (listType === 'sold_out' ? 'Esgotado' : 'Ativo'));

    // ---- estoque
    let stock = pick(p, [
      'stock_detail.total_available_stock',
      'stock_detail.sellable_stock',
      'stock_detail.total_seller_stock',
      'stock_detail.normal_stock',
      'stock', 'total_stock', 'normal_stock'
    ]);
    const models = pick(p, ['model_list', 'models', 'sku_list']) || [];
    if ((stock === undefined || stock === null) && Array.isArray(models) && models.length) {
      let sum = 0, got = false;
      for (const m of models) {
        const s = pick(m, [
          'stock_detail.total_available_stock', 'stock_detail.sellable_stock',
          'stock_detail.normal_stock', 'stock', 'normal_stock'
        ]);
        if (s !== undefined && s !== null && isFinite(Number(s))) { sum += Number(s); got = true; }
      }
      if (got) stock = sum;
    }
    if (stock !== undefined && stock !== null) stock = Number(stock);
    // A API costuma devolver status "Ativo" mesmo com estoque zerado —
    // para o vendedor o que importa é que o anúncio não está vendendo.
    if (stock === 0 && status === 'Ativo') status = 'Esgotado';

    // ---- preços (atual x original)
    const curPrices = [];
    const origPrices = [];
    curPrices.push(
      normPrice(pick(p, ['price_detail.price_min'])),
      normPrice(pick(p, ['price_detail.price_max'])),
      normPrice(pick(p, ['price', 'price_min', 'promotion_price', 'current_price']))
    );
    origPrices.push(
      normPrice(pick(p, ['price_detail.origin_price_min'])),
      normPrice(pick(p, ['price_detail.origin_price_max'])),
      normPrice(pick(p, ['origin_price', 'original_price', 'input_normal_price', 'normal_price']))
    );
    if (Array.isArray(models)) {
      for (const m of models) {
        curPrices.push(
          normPrice(pick(m, ['price_detail.price_min', 'price_detail.price', 'price', 'promotion_price', 'current_price']))
        );
        origPrices.push(
          normPrice(pick(m, ['price_detail.origin_price_min', 'origin_price', 'original_price', 'input_normal_price', 'normal_price']))
        );
      }
    }
    const cur = minMax(curPrices);
    const orig = minMax(origPrices);

    // ---- promoção
    const promoIdRaw = pick(p, ['promotion_id', 'promotionid', 'promotion_detail.promotion_id']);
    const hasDiscountFlag = pick(p, ['price_detail.has_discount', 'has_discount', 'has_promotion']);
    let modelPromo = false;
    if (Array.isArray(models)) {
      for (const m of models) {
        const pid = pick(m, ['promotion_id', 'promotionid']);
        if (pid !== undefined && Number(pid) > 0) { modelPromo = true; break; }
      }
    }
    const priceSaysPromo = !!(cur && orig && orig.min > 0 && cur.min < orig.min - 0.009);
    const emPromocao = !!(hasDiscountFlag === true || (promoIdRaw !== undefined && Number(promoIdRaw) > 0) || modelPromo || priceSaysPromo);

    let descontoPct = null;
    if (cur && orig && orig.min > 0 && cur.min < orig.min) {
      descontoPct = Math.round((1 - cur.min / orig.min) * 1000) / 10;
    }

    // ---- SKU principal + SKUs das variações (o resto vem do detalhe)
    const parentSku = pick(p, ['parent_sku', 'item_sku', 'product_sku']);
    const sku = parentSku && String(parentSku).trim() ? String(parentSku).trim() : null;
    let skuVar = null;
    if (Array.isArray(models) && models.length) {
      const modelSkus = cleanCodes(models.map(m => pick(m, ['sku', 'seller_sku', 'model_sku'])).filter(Boolean));
      if (modelSkus.length) skuVar = modelSkus.slice(0, 20).join(' | ');
    }
    const listEans = cleanCodes(collectByKey(p, GTIN_KEY, 4));
    const ean = listEans.length ? listEans.slice(0, 20).join(' / ') : null;

    // ---- vendas
    let vendas30 = deepFindNumber(p, /(30|thirty)[a-z_]*(sold|sale)|(sold|sale)[a-z_]*(30|thirty)/i);
    let vendasTotal = pick(p, ['statistics.sold_count', 'sold_count', 'historical_sold', 'sold', 'sales']);
    if (vendasTotal === undefined) vendasTotal = deepFindNumber(p, /^(sold_count|historical_sold|sold|sale_count|order_count)$/i);
    if (vendasTotal !== undefined && vendasTotal !== null) vendasTotal = Number(vendasTotal);
    if (vendas30 !== undefined && vendas30 !== null) vendas30 = Number(vendas30);

    return {
      id: id !== undefined ? String(id) : '',
      nome: name !== undefined ? String(name) : '',
      sku: sku || null,
      skuVar: skuVar || null,
      ean: ean || null,
      status,
      estoque: (stock !== undefined && stock !== null && isFinite(stock)) ? stock : null,
      precoOriginal: orig ? orig.min : null,
      precoAtual: cur ? cur.min : null,
      precoAtualMax: cur ? cur.max : null,
      emPromocao,
      precoPromocional: emPromocao && cur ? cur.min : null,
      descontoPct,
      promoNome: null,   // preenchido depois via APIs de marketing
      promoTipo: null,
      vendas30: (vendas30 !== undefined && isFinite(vendas30)) ? vendas30 : null,
      vendasTotal: (vendasTotal !== undefined && isFinite(vendasTotal)) ? vendasTotal : null,
      link: `${location.origin}/portal/product/${id}`
    };
  }

  // ------------------------------------------------- promoções (marketing)
  async function fetchPromotionMap(cds, progress) {
    const map = {}; // itemId -> { nome, tipo, preco }

    // 1) Descontos da loja ("Minhas promoções > Desconto")
    const listCandidates = [];
    if (captured.promoList) listCandidates.push(captured.promoList);
    listCandidates.push(
      `${location.origin}/api/marketing/v3/discount/list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_no=1&page_size=100&discount_status=ongoing`,
      `${location.origin}/api/marketing/v3/discount/list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_no=1&page_size=100&status=ongoing`,
      `${location.origin}/api/marketing/v3/discount/list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&page_no=1&page_size=100`
    );

    let discounts = null;
    for (const cand of listCandidates) {
      try {
        dbg('Tentando lista de promoções: ' + cand.split('?')[0]);
        const json = await apiGet(cand);
        const arr = findObjectArray(json, o =>
          (o.discount_id !== undefined || o.id !== undefined || o.promotion_id !== undefined) &&
          (o.title !== undefined || o.name !== undefined || o.discount_name !== undefined));
        if (arr) { discounts = arr; break; }
      } catch (e) { dbg('Falhou: ' + e.message); }
    }

    if (discounts) {
      progress('Encontradas ' + discounts.length + ' promoções. Lendo itens de cada uma...');
      let n = 0;
      for (const d of discounts.slice(0, 30)) {
        n++;
        const did = pick(d, ['discount_id', 'id', 'promotion_id']);
        const dname = pick(d, ['title', 'name', 'discount_name']) || ('Desconto #' + did);
        const statusRaw = pick(d, ['status', 'discount_status']);
        // pula promoções claramente encerradas quando o status vier como texto
        if (typeof statusRaw === 'string' && /expired|ended|finish/i.test(statusRaw)) continue;

        const itemCandidates = [
          `${location.origin}/api/marketing/v3/discount/get_discount_item_list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&discount_id=${did}&page_no=1&page_size=100`,
          `${location.origin}/api/marketing/v3/discount/item_list/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&discount_id=${did}&page_no=1&page_size=100`
        ];
        for (const cand of itemCandidates) {
          try {
            const json = await apiGet(cand);
            const items = findObjectArray(json, o =>
              o.item_id !== undefined || o.product_id !== undefined || o.itemid !== undefined);
            if (!items) continue;
            for (const it of items) {
              const iid = String(pick(it, ['item_id', 'product_id', 'itemid']));
              const pPrice = normPrice(pick(it, ['promotion_price', 'discount_price', 'price', 'promo_price']) ||
                deepFindNumber(it, /promo.*price|discount.*price/i));
              if (!map[iid]) map[iid] = { nome: String(dname), tipo: 'Desconto da loja', preco: pPrice };
            }
            break;
          } catch (e) { dbg('Itens da promoção ' + did + ' falharam: ' + e.message); }
        }
        progress('Promoções lidas: ' + n + '/' + Math.min(discounts.length, 30));
        await sleep(300);
      }
    } else {
      dbg('Nenhum endpoint de promoções respondeu — usaremos só a detecção por preço.');
    }

    return map;
  }

  // ------------------------------------------- SKU/EAN dentro de cada anúncio
  function setIdParam(url, id) {
    const u = new URL(url, location.origin);
    let done = false;
    for (const k of ['product_id', 'item_id', 'id']) {
      if (u.searchParams.has(k)) { u.searchParams.set(k, String(id)); done = true; }
    }
    if (!done) u.searchParams.set('product_id', String(id));
    return u.toString();
  }

  function detailCandidates(cds, id) {
    const c = [];
    if (captured.productDetail) c.push(setIdParam(captured.productDetail, id));
    c.push(
      `${location.origin}/api/v3/product/get_product_detail/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&product_id=${id}`,
      `${location.origin}/api/v3/mpsku/product/get_product_detail?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&product_id=${id}`,
      `${location.origin}/api/v3/product/get_product_info/?SPC_CDS=${encodeURIComponent(cds)}&SPC_CDS_VER=2&product_id=${id}`
    );
    return c;
  }

  const storageGet = (key) => new Promise(res => chrome.storage.local.get(key, st => res(st && st[key])));

  async function fetchDetailsPhase(cds, rows, post, fetchEan) {
    // 1) cache de varreduras anteriores (EAN quase nunca muda) + enriquecimento
    const CACHE_TTL = 30 * 24 * 3600 * 1000;
    // _v2: passou a guardar também os SKUs das variações
    const rawCache = (await storageGet('spx_ean_cache_v2')) || {};
    const cache = {};
    const now = Date.now();
    for (const k of Object.keys(rawCache)) {
      if (rawCache[k] && now - (rawCache[k].ts || 0) < CACHE_TTL) cache[k] = rawCache[k];
    }
    for (const r of rows) {
      const c = cache[r.id];
      if (c) {
        if (!r.sku && c.sku) r.sku = c.sku;
        if (!r.skuVar && c.skuVar) r.skuVar = c.skuVar;
        if (!r.ean && c.ean) r.ean = c.ean;
      }
      const e = enrich[r.id];
      if (e) {
        if (!r.sku && e.sku) r.sku = e.sku;
        if (!r.skuVar && e.skuVar) r.skuVar = e.skuVar;
        if (!r.ean && e.ean) r.ean = e.ean;
      }
    }
    if (!fetchEan) return;

    // não revisita anúncio já checado há menos de 30 dias (mesmo sem EAN cadastrado);
    // se você cadastrar um EAN novo, basta abrir o anúncio no Seller Center que o
    // enriquecimento passivo captura na hora
    const pending = rows.filter(r => !r.ean && !(cache[r.id] && cache[r.id].ean === null));
    if (!pending.length) return;

    const saveCache = () => {
      try { chrome.storage.local.set({ spx_ean_cache_v2: cache }); } catch (e) { /* contexto invalidado */ }
    };

    // 2) descobre qual endpoint de detalhe funciona nesta conta
    let workingIdx = -1;
    for (const probe of pending.slice(0, 3)) {
      const cands = detailCandidates(cds, probe.id);
      for (let i = 0; i < cands.length; i++) {
        try {
          const json = await apiGet(cands[i]);
          const nome = firstString(json, /^(name|product_name|item_name)$/i, 6);
          const mined = mineDetailJson(json);
          if (nome || mined.sku || mined.skuVar || mined.ean) {
            workingIdx = i;
            if (mined.sku && !probe.sku) probe.sku = mined.sku;
            if (mined.skuVar && !probe.skuVar) probe.skuVar = mined.skuVar;
            if (mined.ean) probe.ean = mined.ean;
            cache[probe.id] = { sku: probe.sku || null, skuVar: probe.skuVar || null, ean: probe.ean || null, ts: Date.now() };
            break;
          }
        } catch (e) { dbg('detalhe candidato falhou: ' + e.message); }
      }
      if (workingIdx >= 0) break;
    }
    if (workingIdx < 0) {
      dbg('Nenhum endpoint de detalhe respondeu — SKU/EAN ficam com o que a listagem/navegação trouxe.');
      post({ type: 'status', text: 'Não consegui abrir os anúncios para buscar EAN (abra um anúncio no Seller Center e verifique de novo).', pct: 88 });
      return;
    }

    // 3) varre os anúncios pendentes com concorrência baixa
    const queue = pending.filter(r => !r.ean);
    const total = queue.length;
    let done = 0;
    post({ type: 'progress', text: 'Buscando SKU/EAN dentro dos anúncios: 0 de ' + total, pct: 52 });

    async function worker() {
      while (queue.length) {
        const r = queue.shift();
        if (!r) break;
        const url = detailCandidates(cds, r.id)[workingIdx];
        try {
          const json = await apiGet(url);
          const m = mineDetailJson(json);
          if (m.sku && !r.sku) r.sku = m.sku;
          if (m.skuVar && !r.skuVar) r.skuVar = m.skuVar;
          if (m.ean) r.ean = m.ean;
          cache[r.id] = { sku: r.sku || null, skuVar: r.skuVar || null, ean: r.ean || null, ts: Date.now() };
        } catch (e) {
          if (/429/.test(e.message) && (r.__retry || 0) < 2) {
            r.__retry = (r.__retry || 0) + 1;
            queue.push(r);
            await sleep(3000); // limite de requisições — espera antes de seguir
          } else {
            dbg('detalhe ' + r.id + ': ' + e.message);
          }
        }
        done++;
        if (done % 10 === 0 || done >= total) {
          post({
            type: 'progress',
            text: 'Buscando SKU/EAN dentro dos anúncios: ' + Math.min(done, total) + ' de ' + total,
            pct: 52 + Math.round(Math.min(done, total) / total * 36)
          });
        }
        if (done % 100 === 0) saveCache();
        await sleep(280);
      }
    }
    await Promise.all([worker(), worker(), worker()]);
    for (const r of rows) delete r.__retry;
    saveCache();
  }

  // ------------------------------------------------------------- varredura
  async function runScan(post, fetchEan) {
    debugLog.length = 0;
    const cds = getCds();
    if (!cds) {
      throw new Error('Não encontrei sua sessão do Seller Center. Confira se você está LOGADO em ' + location.origin + ' e recarregue a página (F5).');
    }

    post({ type: 'status', text: 'Sessão encontrada. Buscando seus anúncios...' });

    const rows = [];
    const seen = new Set();
    let anyList = false;

    for (const listType of ['live_all', 'sold_out']) {
      const products = await fetchAllProducts(cds, listType, (done, total) => {
        post({
          type: 'progress',
          text: (listType === 'live_all' ? 'Anúncios ativos: ' : 'Anúncios esgotados: ') + done + (total ? ' de ' + total : ''),
          pct: total ? Math.min(50, 5 + Math.round((done / total) * 45)) : null
        });
      });
      if (products === null) {
        if (listType === 'live_all') {
          throw new Error('Não consegui acessar a lista de produtos. Abra a página "Meus Produtos" no Seller Center, espere carregar, e clique em Verificar de novo (a extensão aprende a URL certa automaticamente).');
        }
        continue;
      }
      anyList = true;
      for (const p of products) {
        const row = extractProduct(p, listType);
        if (row.id && !seen.has(row.id)) { seen.add(row.id); rows.push(row); }
      }
    }

    if (!anyList || !rows.length) {
      throw new Error('Nenhum anúncio encontrado. Confira se esta é a conta certa e se há produtos publicados.');
    }

    post({ type: 'status', text: rows.length + ' anúncios coletados. Buscando SKU e EAN...', pct: 50 });

    try {
      await fetchDetailsPhase(cds, rows, post, fetchEan);
    } catch (e) {
      dbg('fetchDetailsPhase: ' + e.message);
    }

    post({ type: 'status', text: 'Verificando promoções...', pct: 90 });

    let promoMap = {};
    try {
      promoMap = await fetchPromotionMap(cds, (text) => post({ type: 'status', text, pct: 94 }));
    } catch (e) {
      dbg('fetchPromotionMap: ' + e.message);
    }

    // completa cada linha com o que foi aprendido navegando (enriquecimento)
    for (const r of rows) {
      const e = enrich[r.id];
      if (!e) continue;
      if (r.precoOriginal === null && e.po !== undefined) r.precoOriginal = e.po;
      if (r.vendas30 === null && e.v30 !== undefined) r.vendas30 = e.v30;
      if (e.pn && (!r.promoNome || /não identificado/.test(r.promoNome))) {
        r.promoNome = e.pn;
        r.promoTipo = e.pt || r.promoTipo;
      }
      if (r.emPromocao && r.precoPromocional === null && e.pp !== undefined) r.precoPromocional = e.pp;
      if (r.precoOriginal !== null && r.precoAtual !== null && r.precoOriginal > r.precoAtual + 0.009) {
        r.emPromocao = true;
        if (r.precoPromocional === null) r.precoPromocional = r.precoAtual;
      }
      if (r.descontoPct === null && r.precoOriginal > 0) {
        const pAtual = r.precoPromocional !== null ? r.precoPromocional : r.precoAtual;
        if (pAtual !== null && pAtual < r.precoOriginal) {
          r.descontoPct = Math.round((1 - pAtual / r.precoOriginal) * 1000) / 10;
        }
      }
    }

    for (const r of rows) {
      const pm = promoMap[r.id];
      if (pm) {
        r.emPromocao = true;
        r.promoNome = pm.nome;
        r.promoTipo = pm.tipo;
        if (pm.preco !== null && pm.preco !== undefined) r.precoPromocional = pm.preco;
        if (r.precoOriginal && r.precoPromocional && r.precoOriginal > 0) {
          r.descontoPct = Math.round((1 - r.precoPromocional / r.precoOriginal) * 1000) / 10;
        }
      } else if (r.emPromocao && !r.promoNome) {
        r.promoNome = 'Promoção ativa (nome não identificado)';
        r.promoTipo = 'Detectada pelo preço';
      }
    }

    // envia para o site do vendedor (Cloudflare Worker), se configurado
    async function syncToSite(rows, summary) {
      const cfg = await storageGet('spx_sync');
      if (!cfg || !cfg.enabled || !cfg.url || !cfg.token) return null;
      try {
        const res = await fetch(cfg.url.replace(/\/+$/, '') + '/dados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cfg.token
          },
          body: JSON.stringify({ rows, summary })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        dbg('Site atualizado.');
        return 'ok';
      } catch (e) {
        dbg('Falha ao atualizar o site: ' + e.message);
        return 'erro: ' + e.message;
      }
    }

    const summary = {
      total: rows.length,
      comPromo: rows.filter(r => r.emPromocao).length,
      semPromo: rows.filter(r => !r.emPromocao).length,
      estoqueZero: rows.filter(r => r.estoque === 0).length,
      estoqueBaixo: rows.filter(r => r.estoque !== null && r.estoque > 0 && r.estoque <= 5).length,
      vendas30: rows.reduce((acc, r) => acc + (r.vendas30 || 0), 0) || null,
      temVendas30: rows.some(r => r.vendas30 !== null),
      comEan: rows.filter(r => r.ean).length,
      comSku: rows.filter(r => r.sku || r.skuVar).length,
      geradoEm: new Date().toLocaleString('pt-BR')
    };

    post({ type: 'status', text: 'Atualizando seu site...', pct: 98 });
    summary.sync = await syncToSite(rows, summary);

    // salva aqui também: se o popup fechar no meio, o resultado não se perde
    try {
      chrome.storage.local.set({ spx_last_result: { rows, summary, debug: debugLog.slice() } });
    } catch (e) { /* contexto invalidado */ }

    post({ type: 'done', rows, summary, debug: debugLog.slice() });
  }

  // --------------------------------------------------------- comunicação
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.type === 'ping') {
      sendResponse({ ok: true, loggedIn: !!getCds(), origin: location.origin, captured: { productList: !!captured.productList } });
    }
    return false;
  });

  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'spx-scan') return;
    port.onMessage.addListener(async (msg) => {
      if (!msg || msg.type !== 'scan') return;
      const post = (m) => { try { port.postMessage(m); } catch (e) { /* popup fechado */ } };
      try {
        await runScan(post, msg.fetchEan !== false);
      } catch (e) {
        post({ type: 'error', message: e.message || String(e), debug: debugLog.slice() });
      }
    });
  });
})();

/**
 * Roda no "mundo" da própria página do Seller Center (world: MAIN).
 *
 * Função: observar as chamadas de API que o PRÓPRIO Seller Center faz
 * (lista de produtos, promoções, estatísticas) e avisar o content script
 * qual é a URL exata que funciona. Assim, mesmo que a Shopee mude os
 * endpoints internos, a extensão "aprende" a URL correta só de você
 * navegar até a página "Meus Produtos".
 *
 * Nenhum dado é enviado para fora do seu navegador.
 */
(function () {
  if (window.__spxCaptureInstalled) return;
  window.__spxCaptureInstalled = true;

  var PATTERNS = [
    { kind: 'productList', re: /\/api\/.*(mpsku\/list|page_product_list|product_list)/i },
    { kind: 'promoList',   re: /\/api\/marketing\/.*(discount|promotion|flash_sale).*(list|query)/i },
    { kind: 'promoItems',  re: /\/api\/marketing\/.*(discount|promotion|flash_sale).*(item|detail)/i },
    { kind: 'stats',       re: /\/api\/.*(statistic|biz_data|sold|performance)/i }
  ];

  function classify(url) {
    if (typeof url !== 'string') return null;
    if (url.indexOf('/api/') === -1) return null;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i].re.test(url)) return PATTERNS[i].kind;
    }
    return null;
  }

  function report(url) {
    try {
      var kind = classify(url);
      if (!kind) return;
      var abs = new URL(url, location.origin).toString();
      window.postMessage({ source: 'SPX_CAPTURED_URL', kind: kind, url: abs }, location.origin);
    } catch (e) { /* ignora */ }
  }

  // Intercepta fetch()
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      var url = typeof input === 'string' ? input : (input && input.url);
      report(url);
    } catch (e) { /* ignora */ }
    return origFetch.apply(this, arguments);
  };

  // Intercepta XMLHttpRequest
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    try { report(url); } catch (e) { /* ignora */ }
    return origOpen.apply(this, arguments);
  };
})();

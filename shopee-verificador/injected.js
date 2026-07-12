/**
 * Roda no "mundo" da própria página do Seller Center (world: MAIN).
 *
 * Função: observar as chamadas de API que o PRÓPRIO Seller Center faz
 * (lista de produtos, promoções, estatísticas) e repassar ao content script:
 *   1. a URL exata que funciona (para a varredura em massa reaproveitar);
 *   2. o CONTEÚDO das respostas relevantes — assim, dados que a API de
 *      listagem não entrega (preço original, nome da promoção, vendas por
 *      período) são "aprendidos" enquanto você navega normalmente pelo
 *      Seller Center e enriquecem a próxima varredura.
 *
 * Nenhum dado é enviado para fora do seu navegador.
 */
(function () {
  if (window.__spxCaptureInstalled) return;
  window.__spxCaptureInstalled = true;

  var MAX_BODY = 3000000; // 3 MB — não processa respostas gigantes

  var PATTERNS = [
    { kind: 'productList', re: /\/api\/.*(mpsku\/list|page_product_list|product_list)/i },
    { kind: 'promoList',   re: /\/api\/marketing\/.*(discount|promotion|flash_sale).*(list|query)/i },
    { kind: 'promoItems',  re: /\/api\/marketing\/.*(discount|promotion|flash_sale).*(item|detail)/i },
    { kind: 'marketing',   re: /\/api\/marketing\//i },
    { kind: 'stats',       re: /\/api\/.*(statistic|biz_data|sold|performance|overview)/i }
  ];

  function classify(url) {
    if (typeof url !== 'string') return null;
    if (url.indexOf('/api/') === -1) return null;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i].re.test(url)) return PATTERNS[i].kind;
    }
    return null;
  }

  function reportUrl(kind, url) {
    try {
      var abs = new URL(url, location.origin).toString();
      window.postMessage({ source: 'SPX_CAPTURED_URL', kind: kind, url: abs }, location.origin);
    } catch (e) { /* ignora */ }
  }

  function reportBody(kind, url, text) {
    try {
      if (!text || text.length > MAX_BODY) return;
      if (text.charAt(0) !== '{' && text.charAt(0) !== '[') return;
      window.postMessage({ source: 'SPX_CAPTURED_BODY', kind: kind, url: String(url), body: text }, location.origin);
    } catch (e) { /* ignora */ }
  }

  // Intercepta fetch()
  var origFetch = window.fetch;
  window.fetch = function (input, init) {
    var url = null, kind = null;
    try {
      url = typeof input === 'string' ? input : (input && input.url);
      kind = classify(url);
      if (kind) reportUrl(kind, url);
    } catch (e) { /* ignora */ }
    var p = origFetch.apply(this, arguments);
    if (kind) {
      p = p.then(function (res) {
        try {
          res.clone().text().then(function (t) { reportBody(kind, url, t); }).catch(function () {});
        } catch (e) { /* ignora */ }
        return res;
      });
    }
    return p;
  };

  // Intercepta XMLHttpRequest
  var origOpen = XMLHttpRequest.prototype.open;
  var origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__spxUrl = url;
    this.__spxKind = classify(typeof url === 'string' ? url : String(url));
    if (this.__spxKind) reportUrl(this.__spxKind, url);
    return origOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    var xhr = this;
    if (xhr.__spxKind) {
      xhr.addEventListener('load', function () {
        try {
          if (xhr.responseType === '' || xhr.responseType === 'text') {
            reportBody(xhr.__spxKind, xhr.__spxUrl, xhr.responseText);
          }
        } catch (e) { /* ignora */ }
      });
    }
    return origSend.apply(this, arguments);
  };
})();

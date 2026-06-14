// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const html    = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw      = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');

// ETag baseado no conteúdo — muda só quando o HTML muda
const etag = '"' + crypto.createHash('md5').update(html).digest('hex').slice(0,12) + '"';

const worker = `export default {
  async fetch(request) {
    const url = new URL(request.url);

    // ── Service Worker ──
    if (url.pathname === '/sw.js') {
      return new Response(${JSON.stringify(sw)}, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Service-Worker-Allowed': '/',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // ── Landing page ──
    if (url.pathname === '/landing' || url.pathname === '/landing.html') {
      return new Response(${JSON.stringify(landing)}, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=300, must-revalidate',
        },
      });
    }

    // ── Main app ──
    const ETAG = ${JSON.stringify(etag)};

    // 304 Not Modified — evita re-download quando nada mudou
    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch === ETAG) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': ETAG,
          'Cache-Control': 'public, max-age=300, must-revalidate',
        },
      });
    }

    return new Response(${JSON.stringify(html)}, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        // Browser caches por 5 min; depois faz GET condicional com ETag
        // Se nada mudou → 304 Not Modified (resposta minúscula, sem re-download)
        'Cache-Control': 'public, max-age=300, must-revalidate',
        'ETag': ETAG,
        'X-Finn-Version': '2.1.0',
      },
    });
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB) | ETag: ' + etag);

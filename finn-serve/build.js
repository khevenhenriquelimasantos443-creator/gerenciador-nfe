// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const zlib   = require('zlib');

const html    = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw      = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');

// ETag baseado no conteúdo — muda só quando o HTML muda
const etag = '"' + crypto.createHash('md5').update(html).digest('hex').slice(0,12) + '"';

// Pré-comprimir com gzip (nível máximo) em build time — Worker só serve bytes
function gzipB64(str) {
  const buf = zlib.gzipSync(Buffer.from(str, 'utf8'), { level: 9 });
  return buf.toString('base64');
}

const htmlGzB64    = gzipB64(html);
const landingGzB64 = gzipB64(landing);

const htmlKB    = Math.round(Buffer.byteLength(html, 'utf8')    / 1024);
const landingKB = Math.round(Buffer.byteLength(landing, 'utf8') / 1024);
const htmlGzKB  = Math.round(htmlGzB64.length * 3 / 4 / 1024);

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

    // Decodifica base64 → Uint8Array de bytes gzip
    function b64ToBytes(b64) {
      const bin = atob(b64);
      const u8  = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      return u8;
    }

    const acceptEncoding = request.headers.get('Accept-Encoding') || '';
    const supportsGzip   = acceptEncoding.includes('gzip');

    // ── Landing page ──
    if (url.pathname === '/landing' || url.pathname === '/landing.html') {
      if (supportsGzip) {
        return new Response(b64ToBytes(${JSON.stringify(landingGzB64)}), {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Encoding': 'gzip',
            'Cache-Control': 'public, max-age=300, must-revalidate',
          },
        });
      }
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
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      });
    }

    if (supportsGzip) {
      return new Response(b64ToBytes(${JSON.stringify(htmlGzB64)}), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Encoding': 'gzip',
          'Cache-Control': 'public, max-age=3600, must-revalidate',
          'ETag': ETAG,
          'X-Finn-Version': '2.1.0',
        },
      });
    }

    return new Response(${JSON.stringify(html)}, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'ETag': ETAG,
        'X-Finn-Version': '2.1.0',
      },
    });
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log(`✅ finn-serve/index.js gerado | ETag: ${etag}`);
console.log(`   HTML: ${htmlKB} KB → gzip: ${htmlGzKB} KB (${Math.round((1-htmlGzKB/htmlKB)*100)}% menor)`);
console.log(`   Landing: ${landingKB} KB → gzip: ${Math.round(landingGzB64.length*3/4/1024)} KB`);
console.log(`   Worker total: ${Math.round(worker.length/1024)} KB`);

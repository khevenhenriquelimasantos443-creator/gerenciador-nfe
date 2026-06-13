// build.js — gera finn-serve/index.js embedando os arquivos HTML e SW
const fs = require('fs');
const path = require('path');

const html     = fs.readFileSync(path.join(__dirname,'../finn/index.html'), 'utf8');
const landing  = fs.readFileSync(path.join(__dirname,'../finn/landing.html'), 'utf8');
const sw       = fs.readFileSync(path.join(__dirname,'sw.js'), 'utf8');

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
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
      });
    }

    // ── Main app (all other routes) ──
    return new Response(${JSON.stringify(html)}, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Finn-Version': '2.1.0',
      },
    });
  },
};
`;

fs.writeFileSync(path.join(__dirname,'index.js'), worker);
console.log('✅ finn-serve/index.js gerado (' + Math.round(worker.length/1024) + ' KB)');

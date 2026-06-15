// Finn Service Worker v2.3
const CACHE = 'finn-v2-3';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c) {
      return c.add('/').catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    }).then(function() {
      return self.clients.matchAll({type:'window'}).then(function(clients) {
        clients.forEach(function(c) {
          c.postMessage({type:'SW_UPDATED', version:'2.3.0'});
        });
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Stale-while-revalidate para navegação: mostra cache imediatamente, atualiza em segundo plano
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          var fetchPromise = fetch(e.request).then(function(res) {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(function() { return null; });

          // Se tem cache: retorna imediatamente e atualiza em background
          if (cached) {
            fetchPromise.then(function(fresh) {
              if (fresh) {
                // Notifica clientes que há nova versão disponível
                self.clients.matchAll({type:'window'}).then(function(clients) {
                  clients.forEach(function(c) { c.postMessage({type:'SW_UPDATED', version:'2.3.0'}); });
                });
              }
            });
            return cached;
          }
          // Sem cache: espera a rede
          return fetchPromise.then(function(res) { return res || new Response('Offline', {status:503}); });
        });
      })
    );
    return;
  }
  // Cache-first para outros assets
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request).then(function(res) {
        if (res.ok && e.request.method === 'GET') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      });
    })
  );
});

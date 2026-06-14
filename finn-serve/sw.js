// Finn Service Worker v2.1
const CACHE = 'finn-v2-1';

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
      // Notify all open clients that SW updated
      return self.clients.matchAll({type:'window'}).then(function(clients) {
        clients.forEach(function(c) {
          c.postMessage({type:'SW_UPDATED', version:'2.1.0'});
        });
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Network-first for navigation (always serve latest HTML)
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return res;
      }).catch(function() {
        return caches.match(e.request).then(function(r) {
          return r || caches.match('/');
        });
      })
    );
    return;
  }
  // Cache-first for other assets
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

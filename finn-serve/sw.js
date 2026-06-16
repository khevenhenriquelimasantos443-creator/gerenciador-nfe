// Finn Service Worker v2.5
const CACHE = 'finn-v2-5';

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
          c.postMessage({type:'SW_UPDATED', version:'2.5.0'});
        });
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.open(CACHE).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          var fetchPromise = fetch(e.request).then(function(res) {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(function() { return null; });
          if (cached) {
            fetchPromise.then(function(fresh) {
              if (fresh) {
                self.clients.matchAll({type:'window'}).then(function(clients) {
                  clients.forEach(function(c) { c.postMessage({type:'SW_UPDATED', version:'2.5.0'}); });
                });
              }
            });
            return cached;
          }
          return fetchPromise.then(function(res) { return res || new Response('Offline', {status:503}); });
        });
      })
    );
    return;
  }
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

// ── Push Notifications ──
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}
  var title = data.title || 'Finn.';
  var opts = {
    body: data.body || '',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    tag: data.tag || 'finn-notification',
    renotify: true
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes(self.location.origin) && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

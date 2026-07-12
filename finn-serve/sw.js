// Finn Service Worker v2.7
const CACHE = 'finn-v2-7';

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
          c.postMessage({type:'SW_UPDATED', version:'2.7.0'});
        });
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;

  // Never intervene on non-GET (POST/PUT/DELETE to Supabase, /ai, etc.) — straight to network.
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch(err) { return; }

  // Never cache cross-origin requests (Supabase REST, Anthropic, bank logos...).
  // Caching these froze cloud data in the cache and resurrected deleted rows on reload.
  if (url.origin !== self.location.origin) return;

  // Never cache same-origin API endpoints.
  if (url.pathname.indexOf('/ai') === 0 || url.pathname.indexOf('/pluggy') === 0) return;

  // App shell + navigations: NETWORK-FIRST so new deploys appear immediately.
  // Cache is only an offline fallback.
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname === '') {
    e.respondWith(
      fetch(req).then(function(res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put('/', clone); });
        }
        return res;
      }).catch(function() {
        return caches.open(CACHE).then(function(c) {
          return c.match('/').then(function(m) {
            return m || new Response('Offline', {status:503});
          });
        });
      })
    );
    return;
  }

  // Other same-origin static assets (icons, manifest): cache-first, refresh in background.
  e.respondWith(
    caches.match(req).then(function(cached) {
      var net = fetch(req).then(function(res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, clone); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || net;
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
    icon: '/icon-192.png',
    badge: '/icon-192.png',
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

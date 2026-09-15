/* Service worker Nota & Faktur.
   Naikkan VERSI setiap kali index.html berubah agar perangkat menarik versi baru. */
var VERSI = "v1";
var CACHE_APP = "nota-faktur-" + VERSI;
var CACHE_FONT = "nota-faktur-font";
var ASET = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icon.svg", "./icon-192.png", "./icon-512.png",
  "./icon-maskable-512.png", "./apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE_APP)
      .then(function(c){ return c.addAll(ASET); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(nama){
      return Promise.all(nama.map(function(n){
        if(n !== CACHE_APP && n !== CACHE_FONT) return caches.delete(n);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  var url = new URL(req.url);

  /* Font Google: pakai salinan lama dulu, perbarui diam-diam di latar. */
  if(url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"){
    e.respondWith(caches.open(CACHE_FONT).then(function(c){
      return c.match(req).then(function(simpan){
        var jaringan = fetch(req).then(function(res){
          if(res && (res.ok || res.type === "opaque")) c.put(req, res.clone());
          return res;
        }).catch(function(){ return simpan; });
        return simpan || jaringan;
      });
    }));
    return;
  }

  if(url.origin !== self.location.origin) return;

  /* Halaman: coba jaringan agar selalu terbaru, jatuh ke salinan bila offline. */
  if(req.mode === "navigate"){
    e.respondWith(
      fetch(req).then(function(res){
        var salin = res.clone();
        caches.open(CACHE_APP).then(function(c){ c.put("./index.html", salin); });
        return res;
      }).catch(function(){
        return caches.match("./index.html").then(function(r){ return r || caches.match("./"); });
      })
    );
    return;
  }

  /* Aset: salinan dulu, ambil jaringan bila belum ada. */
  e.respondWith(caches.match(req).then(function(simpan){
    return simpan || fetch(req).then(function(res){
      if(res && res.ok){
        var salin = res.clone();
        caches.open(CACHE_APP).then(function(c){ c.put(req, salin); });
      }
      return res;
    });
  }));
});

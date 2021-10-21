const CACHE_NAME = "v1_cache_contador_app_vue";
const urlsToCache = [
  "./",
  "./img/favicon.png",
  "./img/icon32.png",
  "./img/icon64.png",
  "./img/icon128.png",
  "./img/icon256.png",
  "./img/icon512.png",
  "./img/icon1024.png",
  "./js/main.js",
  "https://unpkg.com/vue@next",
  "./js/mountApp.js",
  "./css/style.css",
  "https://necolas.github.io/normalize.css/8.0.1/normalize.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(      //Escucha y ejecuta  
    caches.open(CACHE_NAME).then((cache) =>
      cache
        .addAll(urlsToCache)
        .then(() => self.skipWaiting()) //Espera q todo este cacheando
        .catch((err) => console.log(err))
    )
  );
});

self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];

  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) //En caso de q sea alterado, va a actualizarse la cache
  );
});

self.addEventListener("fetch", (e) => { //hacer peticiones o descargar la cache
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res; //caso q hay actualizacion
      }

      return fetch(e.request);
    })
  );
});

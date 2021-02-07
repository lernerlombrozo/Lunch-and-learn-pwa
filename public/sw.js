const VERSION = 3
const CACHE_STATIC_NAME = `static-v${VERSION}`;
const CACHE_DYNAMIC_NAME = `dynamic-v${VERSION}`;

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', event);
  precache(event);
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ....', event);
  clearCache(event);
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetching ...', event);
  cache(event);
});


function precache(event){
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          '/',
          '/index.html',
          '/offline.html',
          '/app.js',
          '/css/normalize.css',
          '/css/skeleton.css',
          '/images/icon-chan.png',
          'https://fonts.googleapis.com/css?family=Raleway:400,300,600',
        ]);
      })
  )
}

function cache(event){
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then((res) => {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then((cache) => {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch((err) => {
              return caches.open(CACHE_STATIC_NAME).then((cache)=>{
                return cache.match('/offline.html')
              })
            });
        }
      })
  );
}

function clearCache(event){
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key)=> {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
}

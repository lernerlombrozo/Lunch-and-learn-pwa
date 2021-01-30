self.addEventListener('install', (event)=>{
  console.log('[Service Worker] installing service worker ...', event);
})

self.addEventListener('activate', (event)=>{
  console.log('[Service Worker] activating service worker ...', event);
  return self.clientInformation.claim();
})

self.addEventListener('fetch', (event)=>{
  console.log('[Service Worker] Fetching ...', event);
  // event.respondWith(null)
  event.respondWith(fetch(event.request));
})
const VERSION = 2
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

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = notification.action;
  console.log(  '[Service Worker] Notification clicked ...', notification);
  switch(action) {
    case 'confirm':
      notification.close();
      break;
    case 'cancel':
      notification.close();
      break;
    default:
      notification.close();
  }
});

self.addEventListener('notificationclose', (event) => {
  // can be used for analytics
  console.log(  '[Service Worker] Notification closed ...', event);
});

self.addEventListener('push', (event) => {
  // can be used for analytics
  console.log(  '[Service Worker] push ...', event);
  let data = {title: 'New message!', content: 'You received a message'}
  if(event.data){
    data = JSON.parse(event.data.text())
  }
  showNotification(event, data.title, data.content)
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

const showNotification = (event, title, body) => {
  const options = {
    body,
    icon: '/images/icon-chan96x96.png',
    image: '/images/washroom.jpeg',
    dir: 'ltr',
    lang: 'en-US',
    vibrate: [1000, 1000, 3000],
    badge: '/images/icon-chan96x96.png',
    //tag: tag notifications will stack instead of showing additional notification,
    //renotify: if set to true when there's a tag, will vibrate again
    actions: [
      {
        action: 'confirm', 
        title: 'OK', 
        icon: '/images/icon-chan96x96.png'
      },
      {
        action: 'cancel', 
        title: 'Cancel', 
        icon: '/images/icon-chan96x96.png'
      }
    ]
  }
  event.waitUntil(self.registration.showNotification(title, options))
}


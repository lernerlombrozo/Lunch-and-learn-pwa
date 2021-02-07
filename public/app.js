if('serviceWorker' in navigator){
  navigator.serviceWorker
    .register('/sw.js')
    .then(()=>{
      console.log('[app.js] service worker registered!');
    })
}

window.addEventListener('beforeinstallprompt',() => {
  console.log('[app.js] before install prompt fired');
})

const displayConfirmNotification = () => {
  const options = {
    body: 'Thanks for subscribing to my notifications!',
    icon: '/images/android/android-launchericon-96-96.png',
    image: '/images/not-stephen.png',
    dir: 'ltr',
    lang: 'en-US',
    vibrate: [1000, 1000, 3000],
    badge: '/images/android/android-launchericon-96-96.png'
  }
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then((serviceWorkerRegistration)=>{
      serviceWorkerRegistration.showNotification('Good job!', options)
    })
  }
}

const askForNotificationPermission = () => {
  console.log('asking for permission')
  if(!'Notification' in window){
    alert('Please use a real browser');
    return
  }
  Notification.requestPermission((result)=>{
    if(result !== 'granted'){
      alert('Do it manually')
    } else {
      displayConfirmNotification()
    }
  })
}
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

const displayConfirmNotification = (swreg) => {
  const options = {
    body: 'Thanks for subscribing to my notifications!',
    icon: '/images/android/android-launchericon-96-96.png',
    image: '/images/not-stephen.png',
    dir: 'ltr',
    lang: 'en-US',
    vibrate: [1000, 1000, 3000],
    badge: '/images/android/android-launchericon-96-96.png',
    //tag: tag notifications will stack instead of showing additional notification,
    //renotify: if set to true when there's a tag, will vibrate again
    actions: [
      {
        action: 'confirm', 
        title: 'OK', 
        icon: '/images/android/android-launchericon-96-96.png'
      },
      {
        action: 'cancel', 
        title: 'Cancel', 
        icon: '/images/android/android-launchericon-96-96.png'
      }
    ]
  }
  swreg.showNotification('Good job!', options)
}

const configurePushSubscription = () => {
  if(!'serviceWorker' in navigator){
    return;
  }
  let reg;
  navigator.serviceWorker.ready.then((swreg)=>{
    reg = swreg;
    return swreg.pushManager.getSubscription()
  }).then((sub) => {
    if(sub === null){
      // create subscription
      const vapidPublicKey = 'BJo1FQHmZHC9hLs5nSyNU0skCgzOPPboHOFgKg5usJTUHAIlJX69ccM7WIv4P5fqebZrCJb7F4mvLHLklmZ5ws0';
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey)
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      })
    } else{
      // there's a subscription
      console.log('sub exists')
    }
  }).then((newSub)=>{
    return addToFirebase('subscriptions', newSub)
  }).then((res)=>{
    if(res.ok){
      displayConfirmNotification(reg);
    }
  })
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
      configurePushSubscription()
    }
  })
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendMessage(message){
  this.addToFirebase('messages', message)
}

function addToFirebase(db, body){
  return fetch(`https://lunch-n-learn-pwa-default-rtdb.firebaseio.com/${db}.json`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
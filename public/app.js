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
    image: '/images/washroom.jpeg',
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
      const vapidPublicKey = 'BJrQ6jC__eOJssMnePIGg6UrAMpJUvAze0AXF6Olhsw7VUZ4VVpyP76Q59_WjshVPIbo-fzCwjXjH0HF2y3NQNY';
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
    return post('subscriptions', newSub)
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
  this.post('messages', {message})
}

function post(db, body){
  return fetch(`https://blooming-headland-12022.herokuapp.com/${db}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
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
const resultElement = document.querySelector('.result');
const errorElement = document.querySelector('.error');

const share = async () => {
  const shareData = {
    title: 'Lunch-n-Learn PWA',
    text: 'By David Lerner!',
    url: 'https://lunch-n-learn-pwa.web.app',
  }
  if(!navigator.share){
    return;
  }

  try {
    await navigator.share(shareData)
    resultElement.textContent = 'PWA shared successfully'
  } catch(err) {
    errorElement.textContent = 'Error: ' + err
  }
};
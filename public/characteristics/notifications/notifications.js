const createMessage = () => {
  const message = document.getElementById('message-input').value;
  sendMessage(message);
  document.getElementById('message-input').value = ''}
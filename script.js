async function sendMessage(msg) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  alert(data.reply);
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    let reply = "I don't understand";

    if (message.toLowerCase().includes("hello")) {
      reply = "Hi! 👋";
    }

    res.status(200).json({ reply });
  } else {
    res.status(200).send("API working");
  }
}

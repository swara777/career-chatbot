const axios = require('axios');

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;

    const prompt = `You are PathBot, a friendly career counselor AI for the PathFinder app.
${context}

Respond helpfully and personalized. Keep responses concise (2-3 sentences). Focus on career guidance.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error('PathBot error:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
};
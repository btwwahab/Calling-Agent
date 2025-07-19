export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not set' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI voice assistant. Reply in a friendly, natural, and conversational way, as if you are speaking. Keep your answers brief and to the point, like real spoken conversation. Avoid long or overly detailed responses."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
      }),
    });

    const data = await groqRes.json();
    if (!data.choices || !data.choices[0]) {
      throw new Error('No response from Groq');
    }
    res.status(200).json({ content: data.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Groq API error' });
  }
}
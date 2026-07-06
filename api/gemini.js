module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { messages, systemPrompt, geminiApiKey, geminiModel } = req.body;
  
  // Use key from request body, fallback to env variable
  const keyToUse = geminiApiKey || process.env.GEMINI_API_KEY;
  // Use model from request body, fallback to hardcoded default
  const modelToUse = geminiModel || 'gemini-3.1-flash-lite';
  if (!keyToUse) {
    return res.status(400).json({ error: 'API key is missing.' });
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${keyToUse}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: messages
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
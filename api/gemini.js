const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, systemPrompt } = req.body;

  try {
    // Fetch settings from Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data: settings } = await supabase
      .from('app_settings')
      .select('key, value');

    const map = Object.fromEntries((settings || []).map(s => [s.key, s.value]));
    const GEMINI_API_KEY = map.gemini_api_key || process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = map.gemini_model || 'gemini-3.1-flash-lite';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
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
    res.status(200).json({ reply: text,model: GEMINI_MODEL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
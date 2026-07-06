module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { password } = req.body;
  const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'myscheduler123';
  if (password !== OWNER_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(200).json({
    gemini_api_key: process.env.GEMINI_API_KEY || ''
  });
};
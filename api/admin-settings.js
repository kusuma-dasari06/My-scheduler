const { createClient } = require('@supabase/supabase-js');  
  
module.exports = async function handler(req, res) {  
  const password = req.headers['x-owner-password'] || req.body?.password;  
  if (password !== process.env.OWNER_PASSWORD) {  
    return res.status(401).json({ error: 'Unauthorized' });  
  }  
  
  const supabase = createClient(  
    process.env.SUPABASE_URL,  
    process.env.SUPABASE_SERVICE_ROLE_KEY  
  );  
  
  if (req.method === 'GET') {  
    const { data, error } = await supabase.from('app_settings').select('key, value');  
    if (error) return res.status(500).json({ error: error.message });  
    const map = Object.fromEntries(data.map(s => [s.key, s.value]));  
    // API key ni mask cheyyadam (security)  
    if (map.gemini_api_key) {  
      map.gemini_api_key_masked = '••••' + map.gemini_api_key.slice(-4);  
      delete map.gemini_api_key;  
    }  
    return res.status(200).json(map);  
  }  
  
  if (req.method === 'POST') {  
    const { gemini_api_key, gemini_model } = req.body || {};  
    const updates = [];  
    if (gemini_api_key && gemini_api_key.trim()) {  
      updates.push({ key: 'gemini_api_key', value: gemini_api_key.trim() });  
    }  
    if (gemini_model && gemini_model.trim()) {  
      updates.push({ key: 'gemini_model', value: gemini_model.trim() });  
    }  
    if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });  
  
    for (const u of updates) {  
      const { error } = await supabase  
        .from('app_settings')  
        .upsert({ ...u, updated_at: new Date().toISOString() });  
      if (error) return res.status(500).json({ error: error.message });  
    }  
    return res.status(200).json({ success: true });  
  }  
  
  return res.status(405).json({ error: 'Method not allowed' });  
};
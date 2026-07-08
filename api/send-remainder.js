export default async function handler(req, res) {
  const SUPABASE_URL = 'https://xkxlzffwmzxbuiyglnvz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreGx6ZmZ3bXp4YnVpeWdsbnZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTE4ODAsImV4cCI6MjA5NjcyNzg4MH0.o055hpZ23PVUGezvB3sXwWQhj4BsAXi7QoJhrdcG20o';
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  async function supabaseFetch(path, method = 'GET', body = null) {
    const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': method === 'PATCH' ? 'return=minimal' : ''
      },
      body: body ? JSON.stringify(body) : null
    });
    const text = await r.text();
    return text ? JSON.parse(text) : {};
  }

  async function sendEmail(to, subject, message) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MyScheduler <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        text: message
      })
    });
  }

  try {
    const nowIST = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000);
    const todayStr = nowIST.toISOString().split('T')[0];

    // Only fetch today's and tomorrow's upcoming meetings with a visitor email
    const slots = await supabaseFetch(
      'schedules?status=eq.upcoming&visitor_email=not.is.null&date=gte.' + todayStr
    );

    let sentCount = 0;

    for (const slot of slots) {
      const meetingDateTime = new Date(slot.date + 'T' + slot.start_time + '+05:30');
      const diffMinutes = (meetingDateTime.getTime() - nowIST.getTime() + (5.5 * 60 * 60 * 1000) - (5.5 * 60 * 60 * 1000)) / 60000;
      const diffMs = meetingDateTime.getTime() - new Date(new Date().getTime()).getTime();
      const diffMin = diffMs / 60000;

      // 1 day reminder (window: 1440 min to 1425 min before)
      if (!slot.reminder_1day_sent && diffMin <= 1440 && diffMin > 1425) {
        await sendEmail(slot.visitor_email, 'Meeting Reminder - Tomorrow',
          `Hi ${slot.visitor_name || 'there'}, this is a reminder that your meeting "${slot.title}" is scheduled for ${slot.date} at ${slot.start_time.slice(0,5)}.`);
        await supabaseFetch('schedules?id=eq.' + slot.id, 'PATCH', { reminder_1day_sent: true });
        sentCount++;
      }
      // 1 hour reminder (window: 60 min to 45 min before)
      else if (!slot.reminder_1hr_sent && diffMin <= 60 && diffMin > 45) {
        await sendEmail(slot.visitor_email, 'Meeting Reminder - 1 Hour',
          `Hi ${slot.visitor_name || 'there'}, your meeting "${slot.title}" starts in about 1 hour, at ${slot.start_time.slice(0,5)} today.`);
        await supabaseFetch('schedules?id=eq.' + slot.id, 'PATCH', { reminder_1hr_sent: true });
        sentCount++;
      }
      // 30 min reminder (window: 30 min to 15 min before)
      else if (!slot.reminder_30min_sent && diffMin <= 30 && diffMin > 15) {
        await sendEmail(slot.visitor_email, 'Meeting Reminder - 30 Minutes',
          `Hi ${slot.visitor_name || 'there'}, your meeting "${slot.title}" starts in about 30 minutes, at ${slot.start_time.slice(0,5)} today.`);
        await supabaseFetch('schedules?id=eq.' + slot.id, 'PATCH', { reminder_30min_sent: true });
        sentCount++;
      }
    }

    res.status(200).json({ success: true, checked: slots.length, sent: sentCount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
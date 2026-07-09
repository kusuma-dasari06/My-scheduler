# 📅 MyScheduler

A personal scheduling assistant with an AI-powered chatbot, public visitor booking, email reminders, and a full owner approval workflow.

🔗 **Live Demo:** [https://my-scheduler-ruddy.vercel.app](https://my-scheduler-ruddy.vercel.app)

---

## ✨ Features

- **Owner Dashboard** (`/owner`) — Calendar and slot management: Add, Complete, Edit, Reschedule, Cancel
- **Visitor Booking Page** (`/book`) — Public availability timeline with booking requests
- **Approval Workflow** — Accept, Accept with Remarks, Request Reschedule, or Decline requests
- **AI Chatbot (Gemini)** — Full schedule management via chat for the owner; availability check and booking for visitors (private details hidden)
- **Chat History** — Owner can view past AI conversations by date
- **Registered Visitors** — View all registered visitors from the dashboard or via chatbot
- **Email Notifications** — EmailJS for booking requests/decisions; Resend for automated reminders
- **Admin Settings Panel** — Manage Gemini API key and model without redeploying
- **Voice Support** — Voice input and Minutes-of-Meeting (MoM) voice features

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini (default: `gemini-3.1-flash-lite`) |
| Emails | EmailJS (notifications) + Resend (reminders) |
| Serverless API | Vercel Functions (`/api`) |
| Hosting | Vercel |

---

## 📂 Project Structure

```
My-scheduler/
├── index.html            # Landing page
├── book/index.html       # Visitor booking page
├── owner/index.html      # Owner dashboard
├── api/
│   ├── gemini.js         # AI chat proxy (keeps Gemini key server-side)
│   ├── get-config.js     # Password-gated config endpoint
│   ├── admin-settings.js # Admin panel: manage API key & model in Supabase
│   └── send-reminders.js # Cron endpoint: emails reminders via Resend
├── vercel.json           # Clean-URL rewrites for /book and /owner
└── package.json
```

---

## 🚀 Setup & Deployment

### 1. Clone the repository

```bash
git clone https://github.com/kusuma-dasari06/My-scheduler.git
cd My-scheduler
npm install
```

### 2. Supabase setup

Create a Supabase project and add these tables:

- `schedules` — owner's schedule slots
- `booking_requests` — visitor booking requests
- `chat_history` — AI chat conversations
- `app_settings` — key/value store for admin settings (`key`, `value`, `updated_at`)

> ⚠️ RLS is disabled for personal use. Enable Row Level Security before using this in production or with multiple users.

### 3. Vercel Environment Variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Gemini API key from [Google AI Studio](https://aistudio.google.com) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin settings API) |
| `OWNER_PASSWORD` | Password protecting the owner dashboard |
| `RESEND_API_KEY` | Resend API key for reminder emails |

### 4. EmailJS setup

Sign up at [emailjs.com](https://www.emailjs.com) and create **two templates**:

1. **Owner notification** — To Email: your own email (used in `book/index.html`)
2. **Visitor notification** — To Email: `{{visitor_email}}` (used in `owner/index.html`)

Update `EMAILJS_SERVICE`, `EMAILJS_PUBLIC`, and the template IDs in those two files.

### 5. Deploy

Push to GitHub and import the repo in [Vercel](https://vercel.com). The `vercel.json` rewrites make `/book` and `/owner` work as clean URLs, and everything in `/api` deploys as serverless functions automatically.

---

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/gemini` | POST | Proxies chat requests to Gemini (key stays server-side) |
| `/api/get-config` | POST | Returns config after owner password check |
| `/api/admin-settings` | GET / POST | Read (masked) or update Gemini key & model |
| `/api/send-reminders` | GET | Sends upcoming-appointment reminder emails |

---

## 🔮 Roadmap / Improvements

- [ ] Proper authentication (Supabase Auth) instead of a shared password
- [ ] Move EmailJS keys to environment variables
- [ ] Remove hardcoded Supabase credentials from `send-reminders.js`
- [ ] Enable RLS policies on all tables
- [ ] Automated tests for booking-conflict edge cases

---

## 👩‍💻 Author

**Kusuma Dasari** — [GitHub](https://github.com/kusuma-dasari06)

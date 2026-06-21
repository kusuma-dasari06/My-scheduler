# MyScheduler

A personal scheduling assistant with AI-powered chat, public booking, and full approval workflow.

## Live URL
https://my-scheduler-ruddy.vercel.app

## Tech Stack
- HTML, CSS, JavaScript
- Supabase (Database)
- EmailJS (Email Notifications)
- Gemini 3.1 Flash-Lite (AI Chatbot)
- Vercel (Hosting)

## Setup Instructions

### 1. config.js
Create a `config.js` file in the root folder with the following fields:

```
const config = {
  SUPABASE_URL: "your-supabase-project-url",
  SUPABASE_ANON_KEY: "your-supabase-anon-key",
  OWNER_PASSWORD: "your-chosen-owner-password"
};
module.exports = config;
```

### 2. Vercel Environment Variables
In your Vercel project settings, add these as Environment Variables (NOT in config.js, for security):
- `GEMINI_API_KEY` — your Gemini API key from Google AI Studio
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `OWNER_PASSWORD`

### 3. EmailJS Setup
Sign up at emailjs.com and create TWO templates:
1. **Owner notification template** — To Email: your owner email (hardcoded)
2. **Visitor notification template** — To Email: `{{visitor_email}}`

Update these values directly in `owner/index.html` and `book/index.html`:
- `EMAILJS_SERVICE`
- `EMAILJS_PUBLIC`
- Template ID for owner notifications (used in book/index.html)
- Template ID for visitor notifications (used in owner/index.html)

### 4. Supabase Tables
Create two tables: `schedules` and `booking_requests`. Disable Row Level Security (RLS) on both, as this is a personal-use tool.

## Features
- Owner dashboard with calendar and slot management (Add, Complete, Edit, Reschedule, Cancel)
- Visitor booking page with availability timeline
- Email notifications for booking requests and owner decisions
- Approval workflow with Accept, Accept with Remarks, Request Reschedule, Decline
- AI chatbot for both owner (full schedule management via chat) and visitor (availability check, booking, with private details hidden)

## What I'd Improve With More Time
- Add proper authentication instead of a single shared password
- Move EmailJS keys to environment variables as well
- Add automated tests for booking conflict edge cases

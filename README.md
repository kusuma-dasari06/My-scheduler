# MyScheduler

A personal scheduling assistant with AI-powered chat, public booking, and full approval workflow.

## Live URL
https://my-scheduler-ruddy.vercel.app

## Tech Stack
- HTML, CSS, JavaScript
- Supabase (Database)
- EmailJS (Email Notifications)
- Gemini 3.1 Flash (AI Chatbot)
- Vercel (Hosting)

## Config Setup
Create a `config.js` file with the following fields:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- OWNER_PASSWORD
- EMAILJS_SERVICE_ID
- EMAILJS_TEMPLATE_ID
- EMAILJS_PUBLIC_KEY

## Features
- Owner dashboard with calendar and slot management
- Visitor booking page with availability timeline
- Email notifications for booking requests
- Approval workflow with Accept, Decline, Reschedule
- AI chatbot for both owner and visitor

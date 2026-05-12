# 🏥 Health Assistant — AI-Powered Health Chatbot

A full-stack AI health chatbot built with **Next.js 14** (App Router + TypeScript + Tailwind) on the frontend and **Express.js + Node.js** on the backend, powered by **Google Gemini**.

> ⚠️ **Disclaimer:** This app provides general health guidance only. It is NOT a medical diagnosis tool. Always consult a qualified healthcare professional for medical decisions.

---

## Project Structure

```
Nana/
├── frontend/   → Next.js 14 app (deploy to Vercel)
└── backend/    → Express.js API (deploy to Render)
```

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install

# Copy and fill in your API key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=AIzaSy...

npm run dev   # starts on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install

# Copy env file
cp .env.local.example .env.local
# .env.local already points to http://localhost:4000

npm run dev   # starts on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSy...` |
| `PORT` | Server port | `4000` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,https://your-app.vercel.app` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:4000` |

---

## API Reference

### `POST /api/chat`
Request:
```json
{
  "userMessage": "I have a headache and fever",
  "messages": []
}
```
Success response (`200`):
```json
{ "reply": "I'm sorry to hear you're not feeling well..." }
```
Error response:
```json
{ "error": "Message cannot be empty" }
```

Rate limit: **20 requests/minute per IP** → returns `429`.

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
```
Set `NEXT_PUBLIC_API_URL` in Vercel project settings.

### Backend → Render
1. Connect your repo to [Render](https://render.com)
2. Set `Root Directory` to `backend`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Add environment variables in the Render dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js, TypeScript |
| AI | Google Gemini (`gemini-1.5-flash`) |
| Validation | Zod |
| Rate Limiting | express-rate-limit |
| Security | Helmet, CORS |
# Nana-Ai
# Nana-Ai

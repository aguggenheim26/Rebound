# 🌸 Rebound — Setup Guide

A warm dating app for people ready for their next chapter.

## Stack
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Backend/Auth/DB**: Supabase (Postgres + Realtime + Storage)
- **Deployment**: Vercel (from GitHub)
- **Animations**: Framer Motion

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and open your project
2. Navigate to **SQL Editor**
3. Paste the entire contents of `supabase/migrations/001_initial_schema.sql` and run it
4. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. (Optional) Enable Google OAuth:
   - Go to **Authentication → Providers → Google**
   - Add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)

---

## 2. Local Development

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/rebound.git
cd rebound

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 3. GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: Rebound app"
git remote add origin https://github.com/YOUR_USERNAME/rebound.git
git push -u origin main
```

---

## 4. Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Set **Framework Preset** to `Next.js`
4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
   ```
5. Click **Deploy** 🚀

### After deploy:
- In Supabase → **Authentication → URL Configuration**, add your Vercel URL to:
  - **Site URL**: `https://your-project.vercel.app`
  - **Redirect URLs**: `https://your-project.vercel.app/auth/callback`

---

## App Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── login/page.tsx    # Login
│   │   ├── signup/page.tsx   # Sign up
│   │   └── callback/route.ts # OAuth callback
│   └── (app)/                # Authenticated routes
│       ├── feed/page.tsx     # Swipe feed
│       ├── matches/page.tsx  # Matches list
│       ├── chat/
│       │   ├── page.tsx      # Chat list
│       │   └── [matchId]/    # Individual chat
│       └── profile/
│           ├── page.tsx      # View profile
│           └── edit/page.tsx # Edit profile
├── components/
│   ├── layout/BottomNav.tsx  # Navigation
│   ├── feed/SwipeDeck.tsx    # Swipe cards
│   ├── chat/ChatRoom.tsx     # Real-time chat
│   └── profile/              # Profile components
└── lib/
    ├── supabase/client.ts    # Browser client
    ├── supabase/server.ts    # Server client
    └── utils.ts              # Helpers
```

---

## Features
- ✅ Email/password + Google OAuth
- ✅ Profile creation with photos, bio, interests
- ✅ Swipe feed (like / pass)
- ✅ Mutual match detection
- ✅ Real-time chat via Supabase Realtime
- ✅ Warm, hopeful design system
- ✅ Mobile-first responsive layout
- ✅ Row Level Security on all tables

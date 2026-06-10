# RoundOne — AI Mock Interview Platform

> Practice interviews with AI. Get scored, get feedback, get hired.

**[getroundone.vercel.app](https://getroundone.vercel.app)** · Built by [Anas Alam](https://github.com/anasalam-xyz)

---

## Screenshots

---

## What is RoundOne?

RoundOne is an AI-powered mock interview platform that simulates a real interview experience. You pick your role, experience level, and interview type — Gemini asks you questions one at a time, adapts based on your answers, then evaluates everything and gives you a detailed score, per-answer feedback, strengths, and weaknesses.

Not a quiz. Not a question bank. An actual conversation.

---

## Features

- **Conversational AI** — questions follow naturally from your previous answers via Gemini
- **Any role** — type in any role, not just a fixed list
- **Per-answer scoring** — every answer gets its own score and feedback
- **Overall evaluation** — score out of 100, verdict, 3 strengths, 3 weaknesses
- **Voice mode** — speak your answers via Web Speech API (Chrome only)
- **Session history** — all past interviews saved with full Q&A review
- **Score trend** — track improvement over time on the dashboard
- **Shareable results** — make any result public and share the link
- **Auth** — email/password, Google OAuth, GitHub OAuth via Supabase Auth

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Voice | Web Speech API |
| Deployment | Vercel |

---

## Running Locally

**Prerequisites:** Node.js 18+, a Supabase project, a Gemini API key

**1. Clone the repo**
```bash
git clone https://github.com/anasalam-xyz/RoundOne.git
cd RoundOne
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_url
GEMINI_API_KEY_1=your_gemini_key_1
GEMINI_API_KEY_2=your_gemini_key_2
```

**4. Set up the database**

Run the following SQL in your Supabase SQL Editor:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL,
  level TEXT NOT NULL,
  type TEXT NOT NULL,
  question_count INTEGER NOT NULL,
  mode TEXT DEFAULT 'text',
  score INTEGER,
  verdict TEXT,
  strengths TEXT[],
  weaknesses TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  answer_text TEXT,
  score INTEGER,
  feedback TEXT,
  order_num INTEGER NOT NULL,
  time_to_first_key INTEGER,
  answer_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

Then enable RLS and add policies.

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Sessions
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON sessions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public sessions are viewable by anyone" ON sessions FOR SELECT USING (is_public = true);

-- Questions
CREATE POLICY "Users can view own questions" ON questions FOR SELECT USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = questions.session_id));
CREATE POLICY "Users can create own questions" ON questions FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM sessions WHERE id = questions.session_id));
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = (SELECT user_id FROM sessions WHERE id = questions.session_id));
CREATE POLICY "Questions of public sessions viewable by anyone" ON questions FOR SELECT USING (EXISTS (SELECT 1 FROM sessions WHERE sessions.id = questions.session_id AND sessions.is_public = true));

**5. Run the dev server**
```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  (public)/
    page.tsx              # Landing page
    about/page.tsx        # How it works
    auth/page.tsx         # Login / signup
    auth/callback/        # OAuth + email verification callback
  dashboard/
    page.tsx              # Overview
    history/              # Session history
    settings/             # Profile, password, danger zone
    layout.tsx            # Sidebar + topbar shell
  interview/
    setup/page.tsx        # Configure interview
    [id]/page.tsx         # Live interview session
  results/
    [id]/page.tsx         # Evaluation results + share
  api/
    sessions/             # Create session, fetch session config
    interview/            # Question generation, evaluation
    account/              # Delete account

lib/
  supabase/               # Client, server, middleware clients
  ai/gemini.ts            # Gemini clients (split across 2 API keys)

components/
  dashboard/              # Sidebar, Topbar
  auth/                   # AuthForm
  results/                # ShareButton
```

---

## How It Works

1. User configures interview — role (free text), level, type, question count, text/voice
2. Session created in Supabase
3. Gemini generates first question based on config
4. User answers — time-to-first-keystroke and answer duration tracked silently
5. Gemini reads the answer, generates a follow-up question (last 2 exchanges sent for context to save tokens)
6. After final answer, all Q&A + timing data sent to Gemini for evaluation
7. Gemini returns structured JSON — overall score, per-answer score/feedback, strengths, weaknesses, verdict
8. Results saved to DB, user redirected to results page

---

## Known Limitations

- **Voice mode is Chrome-only** — Web Speech API has limited cross-browser support
- **Gemini free tier** — rate limits apply; two API keys used to double the quota
- **No real-time updates** — dashboard data cached for 60s; refresh after completing an interview

---

## Built by

**Anas Alam** — 1st year BCA student who decided that building a full-stack AI SaaS was a totally normal way to learn Next.js for the first time. Spoiler: it worked. Somehow.

Previously knew: React, Node.js, MongoDB.
Now also knows: Next.js App Router, TypeScript, PostgreSQL, Supabase, Gemini API, and why `params` needs to be awaited in Next.js 15.

[github.com/anasalam-xyz](https://github.com/anasalam-xyz) · [getroundone.vercel.app](https://getroundone.vercel.app)

---

## License

MIT — do whatever you want with it, just don't claim you built it from scratch in your own portfolio 😄

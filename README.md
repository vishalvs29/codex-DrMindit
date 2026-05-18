# DrMindit

DrMindit is a production-oriented AI mental wellness SaaS built with Next.js 15, Clerk, Prisma, PostgreSQL, TailwindCSS, Framer Motion, and the OpenAI API.

## Core Modules

- Premium marketing site with school, corporate, and military sub-landing pages
- Clerk authentication with sign in, sign up, social auth, password recovery, and protected app routes
- AI chat with OpenAI streaming, persistent sessions, session memory, and recent mood context
- Dashboard with mood score, daily plan, emotional analytics, and recommendations
- Mood tracking with journaling and persisted mood entries
- Audio therapy library for sleep, anxiety, PTSD support, focus, and meditation
- Guided programs including 7-day reset, 21-day anxiety reduction, sleep, focus, and stress plans
- Emergency support screen with crisis resources and grounding tools
- Institutional portal with privacy-first aggregate wellness analytics
- Profile and insights area with preferences, anonymous mode, and progress tracking

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn-style local UI primitives
- Framer Motion
- Lucide Icons
- Clerk Auth
- Prisma ORM
- PostgreSQL via Supabase or Neon
- OpenAI streaming chat
- Vercel deployment

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

3. Configure required environment variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/drmindit?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
UPSTASH_REDIS_REST_URL="https://us1-xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="01234567-89ab-cdef-0123-456789abcdef"
RATE_LIMITER_BACKEND="redis"
```

6. Run stability checks:

```bash
npm run test:stability
```

7. Generate Prisma client and migrate:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start development:

```bash
npm run dev
```

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project settings. Use Neon or Supabase for PostgreSQL. Run Prisma migrations during your deployment workflow or from a trusted CI step.

## Safety Note

DrMindit is a supportive wellness application, not a replacement for emergency care or licensed clinical treatment. The AI route includes crisis-aware instructions, and the product includes an emergency support flow.

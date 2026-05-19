# DrMindit

DrMindit is a premium AI-powered mental wellness platform built with Next.js 15, Clerk, Prisma, Neon PostgreSQL, and OpenAI.

## Overview

DrMindit combines supportive AI chat, mood tracking, guided sessions, guided programs, and a polished dashboard into a single startup-ready wellness experience.

- AI chat with session memory and safety-aware responses
- Mood journaling, stress tracking, and analytics
- Guided sessions and guided programs for sleep, focus, and recovery
- Premium billing and subscription gating with Stripe
- Production-safe deployment with rate limiting and server-side auth

## Features

- Authenticated user experiences via Clerk
- AI-supported conversations with streaming OpenAI output
- Mood check-ins, journal persistence, and insight generation
- Program progress tracking and session history
- Premium feature gating with subscription status
- Emergency support and crisis escalation guidance
- Explicit route protection and server-side middleware

## Tech Stack

- Next.js 15 App Router
- React 19, TypeScript, TailwindCSS
- Clerk authentication
- Prisma ORM
- Neon PostgreSQL
- OpenAI API
- Stripe billing
- Upstash Redis rate limiting
- Vitest + Testing Library for integration checks

## Architecture

Frontend
↓
API Routes
↓
Service Layer
↓
Prisma ORM
↓
Neon PostgreSQL
↓
OpenAI API

### Diagram

```text
Frontend
↓
API Routes
↓
Service Layer
↓
Prisma ORM
↓
Neon PostgreSQL
↓
OpenAI API
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Start the app:

```bash
npm run dev
```

## Environment Variables

Configure these values in `.env.local`:

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
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID="price_..."
STRIPE_SUCCESS_URL="https://your-app.vercel.app/success"
STRIPE_CANCEL_URL="https://your-app.vercel.app/cancel"
AUDIO_ASSET_HOST="https://cdn.example.com"
```

## Development

- Run locally:

```bash
npm run dev
```

- Run stability checks:

```bash
npm run test:stability
```

- Run lint checks:

```bash
npm run lint
```

### Local development workflow

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Populate `.env.local` with your Neon, Clerk, OpenAI, Upstash, and Stripe values.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Start the app:

```bash
npm run dev
```

6. Validate stability and access:

```bash
npm run test:stability
```

## Platform Setup

### Neon

- Create a Neon Postgres project.
- Set `DATABASE_URL` from Neon in `.env.local`.
- Use Neon for serverless-friendly database access.

### Clerk

- Create a Clerk application.
- Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
- Configure sign-in/sign-up URLs and redirect URIs.

### OpenAI

- Create an OpenAI API key.
- Set `OPENAI_API_KEY` and choose a model with `OPENAI_MODEL`.
- The app uses streaming chat for real-time responses.

### Upstash Redis

- Provision a Redis REST instance on Upstash.
- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- Use `RATE_LIMITER_BACKEND="redis"` for production rate limiting.

### Vercel

- Connect the repository and configure environment variables.
- Set the build command to `npm run build`.
- Enable `NODE_ENV=production` in the Vercel project settings.

## Scripts

- `npm run dev` — start development server
- `npm run build` — generate Prisma client and build production assets
- `npm run start` — run the production server
- `npm run lint` — run ESLint checks
- `npm run test:stability` — run lightweight stability tests
- `npm run prisma:generate` — regenerate Prisma client
- `npm run prisma:migrate` — run Prisma migrations
- `npm run prisma:seed` — seed the catalog data
- `npm run prisma:studio` — launch Prisma Studio

## Stability & Security

- Rate limiting uses Upstash Redis with a memory fallback for resilience.
- Runtime seeding is removed from request flow; catalog data is seeded via Prisma scripts.
- Prisma uses a singleton client pattern for serverless-safe connection management.
- The data layer is designed for Neon-safe deployment and transaction reliability.
- `proxy.ts` and `middleware.ts` manage route protection and server-side auth logic.

## Troubleshooting

- If the app fails to start, verify `.env.local` is present and complete.
- Run `npm run prisma:generate` after schema changes.
- If Stripe checkout fails, confirm `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price IDs.
- If OpenAI streaming hangs, verify `OPENAI_API_KEY` and model settings.
- If rate limiting behaves unexpectedly, ensure Upstash Redis credentials are correct.

## Production Readiness

- Clerk auth secures app routes and user identity.
- Redis-based rate limiting protects API endpoints from abuse.
- Prisma migrations and singleton client usage support Neon-compatible deployments.
- OpenAI streaming is capped and timed to prevent hung responses.

## Database

- Prisma models represent users, sessions, mood entries, session progress, and subscriptions.
- Use Prisma migrations to evolve schema safely:

```bash
npm run prisma:migrate
```

- Seed the wellness catalog via Prisma seed logic instead of runtime initialization.

## Deployment

Deploy to Vercel with the same environment variables. Recommended production setup:

- Neon PostgreSQL for serverless database compatibility
- Upstash Redis for shared rate limiting state
- Clerk for auth and session management
- Stripe for subscription billing
- OpenAI for chat experience

## Roadmap

-- Replace session placeholders with licensed production assets
- Add native billing flows and Stripe customer lifecycle management
- Expand accessibility compliance and WCAG 2.1 AA coverage
- Harden monitoring, logging, and observability for production use
- Add comprehensive integration tests for chat and mood persistence

## Safety Disclaimer

DrMindit is a wellness support tool, not a medical or emergency service. It is not a substitute for professional mental health care. Users should contact local emergency services if they are in immediate danger.

## Notes

- `proxy.ts` and `middleware.ts` are part of server-side auth and route protection.
-- The sessions library currently uses sample placeholder tracks and requires licensed content for production.
- Billing is wired through Stripe; complete checkout UI and subscription UX should be implemented alongside payment flow testing.

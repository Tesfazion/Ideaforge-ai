# IdeaForge

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC)

**IdeaForge** is an AI-powered business idea validation platform. It delivers a comprehensive 9-dimension analysis of any business concept in seconds — covering market sizing, SWOT, competitive landscape, risk assessment, and a 7-day action plan.

---

## Features

### Core Analysis
- **9-Dimension Viability Index** — Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, Scalability
- **SWOT Analysis** — Auto-generated Strengths, Weaknesses, Opportunities, and Threats
- **Competitive Landscape** — Direct & indirect competitors, market gaps, differentiation strategy
- **Market Timing Score** — Trend analysis, window of opportunity, market signals
- **Skeptic Mode** — Brutal adversarial stress-test for execution, regulatory, timing, and structural risks
- **TAM / SAM / SOM Market Sizing** — Data-driven market size estimation

### Action & Insights
- **GTM Experiments** — 4 auto-generated experiments with 5-item action checklist
- **7-Day Action Plan** — Daily themed tasks with templates and expected outcomes
- **Pivot Assistant** — 3 pivot suggestions + AI chat for personalized advice
- **Value Hypothesis & Riskiest Assumption** — Core testing framework
- **Live Source Citations** — Verifiable URLs for every claim
- **PDF Export** — Multi-page A4 reports with charts
- **Side-by-Side Comparison** — Radar charts for two validated ideas
- **AI Idea Generator** — Generate startup ideas from a prompt
- **Instant Preview Score** — No-signup quick viability check

### Platform
- **Dark/Light Theme** — Persisted to localStorage
- **Credit System** — Free (1/mo), Pro ($19/mo), Enterprise
- **Authentication** — JWT-based login/register with rate limiting
- **Route Protection** — Server-side proxy for dashboard and API routes

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 + React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL + Prisma 6 |
| **AI** | OpenAI-compatible API (OpenRouter) |
| **Web Search** | Exa AI |
| **Auth** | bcryptjs + jsonwebtoken |
| **Charts** | Recharts |
| **PDF** | jsPDF + html2canvas |
| **Animations** | Framer Motion |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** database (local or cloud: Neon, Supabase, Vercel Postgres, Prisma Postgres)

---

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Push schema to database
npx prisma db push
npx prisma generate

# Start development server
npm run dev
```

Open **http://localhost:1212**

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# PostgreSQL Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:8869/postgres?connect_timeout=10&sslmode=prefer"

# JWT Secret (generate a strong random string for production)
JWT_SECRET="your-strong-random-secret"

# AI Provider
AI_API_KEY="your-openrouter-or-openai-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="openai/gpt-4o"

# Optional Services
ABSTRACT_EMAIL_API_KEY=""
EXA_API_KEY=""

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:1212"
```

### Production Deployment

For production, update `NEXT_PUBLIC_APP_URL` to your live domain and use a production-grade `DATABASE_URL` from your PostgreSQL provider.

---

## Database Schema

Prisma models are defined in `prisma/schema.prisma`. The schema includes:

- **User** — accounts, plans, token quotas
- **Idea** — submitted business ideas with status tracking
- **Report** — full validation reports with 9-dimension scores, SWOT, market sizing, GTM experiments, action plan, and more

### Local Development with PostgreSQL

If you have PostgreSQL running locally:

```bash
# Create the database (if needed)
createdb ideaforge

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/ideaforge"

# Push schema and generate client
npx prisma db push
npx prisma generate

# Seed test data (optional)
npx tsx prisma/seed.ts
```

### Prisma Postgres Cloud

You can also deploy a managed PostgreSQL database using Prisma Postgres:

```bash
bunx @prisma/cli@latest app deploy --project cmrml73ax18wox4dtp8ts751j --branch main
```

This command provisions a managed Postgres instance on Prisma Postgres and outputs a `DATABASE_URL` you can paste into `.env.local`.

---

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/health` | GET | No | Health check |
| `/api/preview` | POST | No | Instant idea preview score |
| `/api/auth/register` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/check-email` | POST | No | Email validation |
| `/api/auth/me` | GET | Yes | Current user profile |
| `/api/auth/upgrade` | POST | Yes | Upgrade plan |
| `/api/ideas` | GET | Yes | List user ideas |
| `/api/ideas` | POST | Yes | Submit new idea |
| `/api/ideas/:id` | GET | Yes | Idea details |
| `/api/ideas/:id` | DELETE | Yes | Delete idea |
| `/api/ideas/:id/validate-stream` | POST | Yes | SSE: run AI validation |
| `/api/ideas/:id/retry` | POST | Yes | Retry failed validation |
| `/api/ideas/:id/pivot-suggestions` | POST | Yes | SSE: generate pivot ideas |
| `/api/ideas/:id/pivot-chat` | POST | Yes | AI pivot chat |
| `/api/ideas/generate-ideas` | POST | Yes | SSE: generate new ideas |
| `/api/reports/:id` | GET | Yes | Full validation report |

All authenticated endpoints require a Bearer token in the `Authorization` header.

---

## Project Structure

```
ideaforge-ai/
├── app/
│   ├── api/                  # Next.js API routes
│   │   ├── auth/             # register, login, me, upgrade, check-email
│   │   ├── ideas/            # CRUD + validation streams
│   │   ├── reports/          # Report retrieval
│   │   ├── preview/          # Quick preview scoring
│   │   └── health/           # Health check
│   ├── dashboard/            # Authenticated dashboard
│   │   ├── page.tsx          # Main dashboard
│   │   ├── new/              # Submit new idea
│   │   ├── generate/         # AI idea generator
│   │   ├── compare/          # Compare validated ideas
│   │   ├── insights/         # Analytics & insights
│   │   ├── upgrade/          # Pricing & upgrade
│   │   ├── payment/          # Payment flow
│   │   └── idea/[id]/        # Idea detail & full report
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles + Tailwind
│   └── page.tsx              # Landing page
├── components/               # Reusable UI components
├── lib/                      # Utilities and AI engine
│   ├── ai.ts                 # Validation engine, web search, prompts
│   ├── api.ts                # Frontend API client + TypeScript types
│   ├── auth.tsx              # Auth context and provider
│   ├── jwt.ts                # JWT sign/verify
│   ├── prisma.ts             # Prisma client singleton
│   └── rate-limit.ts         # In-memory rate limiter
├── prisma/
│   └── schema.prisma         # PostgreSQL schema
├── proxy.ts                  # Auth proxy (Next.js 16)
├── next.config.ts            # Next.js configuration
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment template
└── package.json              # Dependencies and scripts
```

---

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add a PostgreSQL database (Vercel Postgres, Neon, Supabase, or Prisma Postgres)
4. Set environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `AI_API_KEY`
   - `AI_BASE_URL`
   - `AI_MODEL`
   - `EXA_API_KEY`
   - `ABSTRACT_EMAIL_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
5. Deploy — Vercel runs `prisma generate` automatically via the `postinstall` script

### Database Migrations

Before first deploy, apply the schema to your production database:

```bash
# Set DATABASE_URL to your production database
npx prisma migrate deploy
```

If you are using Prisma Postgres Cloud, the schema is managed via:

```bash
bunx @prisma/cli@latest app deploy --project cmrml73ax18wox4dtp8ts751j --branch main
```

### Other Platforms

Any platform supporting Next.js and PostgreSQL works:
- **Railway** — Add PostgreSQL addon
- **Render** — Use managed PostgreSQL
- **Fly.io** — Use Fly Postgres

---

## Development Notes

- The AI validation engine uses streaming responses for real-time progress updates
- Web search is powered by Exa AI (`EXA_API_KEY`)
- PDF export uses jsPDF + html2canvas
- Authentication uses JWT tokens stored in localStorage and cookies
- Rate limiting is in-memory; for multi-instance deployments, use Redis

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 1212 |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Run production migrations |
| `npm run db:studio` | Open Prisma Studio |

---

## License

MIT

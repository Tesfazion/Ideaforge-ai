# IdeaForge AI

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

**AI-powered business idea validation platform** — Get instant, comprehensive analyses of your business ideas with 9-dimension scoring, SWOT analysis, competitive landscape mapping, market timing, and actionable GTM experiments.

## Features

- **9-Dimension Viability Index** — Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, Scalability
- **SWOT Analysis** — Auto-generated Strengths, Weaknesses, Opportunities, and Threats
- **Competitive Landscape Map** — Direct & indirect competitors, market gaps, differentiation strategy
- **Market Timing Score** — Is now the right time? Trend signals, window of opportunity
- **Skeptic Mode** — Brutal adversarial stress-test with execution/regulatory/timing/structural risk analysis
- **TAM / SAM / SOM Market Sizing** — Data-driven market size estimation
- **GTM Experiments** — 4 auto-generated experiments + 5-item action checklist + ICP + landing page copy
- **7-Day Action Plan** — Step-by-step daily tasks with themes and expected outcomes
- **Pivot Assistant** — 3 pivot suggestions per idea + live AI chat for personalized advice
- **Value Hypothesis & Riskiest Assumption** — Core value proposition testing
- **Live Source Citations** — Verifiable URLs backing every claim in each report
- **PDF Export** — Multi-page A4 PDF reports with charts
- **Side-by-Side Comparison** — Radar charts comparing two validated ideas
- **AI Idea Generator** — Generate startup ideas from a prompt
- **Score Visualization** — Radar, bar, and pie charts across all dimensions
- **Dark/Light Theme** — Persisted to localStorage
- **Credit System** — 3-tier pricing: Free (1/mo), Pro ($19/mo unlimited), Enterprise ($49/mo)
- **Authentication** — JWT-based login/register with rate limiting
- **Auth Proxy** — Server-side route protection for dashboard and API routes

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16.2.10 + React 19 |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL via Prisma 6 |
| **API** | Next.js API Routes (serverless) |
| **AI** | IdeaForge AI Engine (multi-model) |
| **Auth** | bcryptjs + jsonwebtoken + proxy |
| **Charts** | Recharts (lazy-loaded) |
| **PDF** | jsPDF + html2canvas |
| **Security** | Rate limiting, auth proxy, input validation |

## Getting Started

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** database (local or cloud like Neon/Supabase/Vercel Postgres)

### Installation

```bash
git clone https://github.com/Tesfazion/Ideaforge-ai.git
cd ideaforge-ai
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ideaforge"
JWT_SECRET="your-strong-random-secret"
AI_API_KEY="your-openai-compatible-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="your-model-name"
NEXT_PUBLIC_APP_URL="http://localhost:1212"
```

### Run locally

```bash
# Push schema to database and generate Prisma client
npx prisma db push
npx prisma generate

# Start dev server
npm run dev
```

Open **http://localhost:1212**

## API Overview

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | No | Health check |
| `/api/preview` | POST | No | Quick idea preview score |
| `/api/auth/register` | POST | No | Create account |
| `/api/auth/login` | POST | No | Login |
| `/api/auth/check-email` | POST | No | Email validation |
| `/api/auth/me` | GET | Yes | Current user |
| `/api/auth/upgrade` | POST | Yes | Upgrade to Pro |
| `/api/ideas` | GET | Yes | List user ideas |
| `/api/ideas` | POST | Yes | Submit new idea |
| `/api/ideas/:id` | GET | Yes | Idea details |
| `/api/ideas/:id` | DELETE | Yes | Delete idea |
| `/api/ideas/:id/validate-stream` | POST | Yes | SSE: run AI validation |
| `/api/ideas/:id/retry` | POST | Yes | Retry failed idea |
| `/api/ideas/:id/pivot-suggestions` | POST | Yes | SSE: generate pivots |
| `/api/ideas/:id/pivot-chat` | POST | Yes | AI pivot chat |
| `/api/ideas/generate-ideas` | POST | Yes | SSE: AI idea generator |
| `/api/reports/:id` | GET | Yes | Full validation report |

## Project Structure

```
ideaforge-ai/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (all serverless)
│   │   ├── auth/             # register, login, me, upgrade, check-email
│   │   ├── ideas/            # CRUD + validation streams
│   │   ├── reports/          # Report retrieval
│   │   ├── preview/          # Quick preview scoring
│   │   └── health/           # Health check
│   ├── dashboard/            # Dashboard pages
│   │   ├── page.tsx          # Main dashboard
│   │   ├── new/              # Submit new idea
│   │   ├── generate/         # AI idea generator
│   │   ├── compare/          # Compare validated ideas
│   │   ├── upgrade/          # Pricing & upgrade
│   │   └── idea/[id]/        # Idea detail & full report
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── layout.tsx            # Root layout with AuthProvider
│   ├── globals.css           # Tailwind + custom styles
│   └── page.tsx              # Landing page
├── components/               # UI components
├── lib/                      # Shared utilities
│   ├── ai.ts                 # AI engine (validation, SWOT, competitive, timing)
│   ├── api.ts                # Frontend API client + types
│   ├── auth.tsx              # Auth context & provider
│   ├── jwt.ts                # JWT sign/verify
│   ├── prisma.ts             # Prisma client singleton
│   └── rate-limit.ts         # In-memory rate limiter
├── prisma/                   # Database schema & migrations
│   ├── schema.prisma         # PostgreSQL schema
│   └── migrations/           # Migration history
├── proxy.ts                  # Auth & route protection (Next.js 16 proxy)
├── next.config.ts            # Next.js configuration
├── vercel.json               # Vercel deployment config
├── .env.example              # Environment variable template
└── package.json              # Dependencies & scripts
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add a PostgreSQL database (Vercel Postgres, Neon, or Supabase)
4. Set environment variables in Vercel dashboard
5. Deploy — Vercel auto-runs `prisma generate` via the `postinstall` script

### Other Platforms

Any platform that supports Next.js works:
- **Railway** — Add PostgreSQL addon
- **Render** — Use managed PostgreSQL
- **Fly.io** — Use Fly Postgres

## License

MIT

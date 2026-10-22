# IdeaForge AI

**AI-Powered Business Idea Validation Platform**

> Validate any startup idea in 30–60 seconds with GPT-4o. Get a 9-dimension viability index, verified market sources, GTM experiments, pivot suggestions, TAM/SAM/SOM market sizing, skeptic-mode adversarial stress-test, and an investor-ready PDF report.

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)
![OpenAI](https://img.shields.io/badge/GPT--4o-OpenRouter-412991?logo=openai)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Core Validation](#core-validation)
  - [Actionable Output](#actionable-output)
  - [Pivot & Iterate](#pivot--iterate)
  - [Dashboard & Analytics](#dashboard--analytics)
  - [Compare](#compare)
  - [Professional Export](#professional-export)
  - [AI Idea Generator](#ai-idea-generator)
  - [Platform & Security](#platform--security)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Database](#database)
- [Running](#running)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Pages & Routes](#pages--routes)
- [Pricing Model](#pricing-model)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

IdeaForge AI is a full-stack Next.js application that lets founders, builders, and innovators validate business ideas before writing a single line of code. Submit an idea and the platform streams an AI-powered analysis in real time via Server-Sent Events (SSE), producing a comprehensive report with a 9-dimension viability index, SWOT, competitive landscape, market sizing, GTM experiments, a 7-day action plan, and more.

The app ships with authentication, a credit/quota system, a pricing & upgrade flow (Stripe), a dashboard with charts and analytics, an idea comparison tool, an AI idea generator, PDF export, and a polished marketing landing page.

---

## Features

### Core Validation
- **9-Dimension Viability Index** — Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, Scalability
- **Execution Complexity Score** — Know if your idea ships in a weekend or requires regulatory approval
- **Live Streaming AI Analysis** — Watch the AI analyze your idea step-by-step in real time via Server-Sent Events
- **Verified Source Citations** — Clickable links to market data, competitor pages, and trend reports that support the analysis

### Actionable Output
- **Auto-Generated GTM Experiments** — 4 low-cost/no-cost experiments with step-by-step instructions, costs, timeframes, and success metrics
- **Specific ICP Definition** — Not "tech professionals" but "Junior Python developers in their first job at startups with 10–50 employees"
- **Landing Page Hook & Sub-headline** — Ready-to-use copy for your Framer/Webflow waitlist page
- **Action Checklist** — Day-by-day validation roadmap with deadlines and reasoning
- **Value Hypothesis** — Structured hypothesis template for investor conversations
- **Riskiest Assumption** — Identified and explained for focused testing

### Pivot & Iterate
- **AI Pivot Assistant** — Multi-turn chat for personalized pivot advice
- **3 Pivot Suggestions** — Alternative business directions with viability estimates
- **One-Click Pivot Validation** — Re-validate a pivot suggestion with a single click

### Dashboard & Analytics
- **Score Distribution Charts** — Pie charts and bar graphs across all your ideas
- **Industry Breakdown** — Visual breakdown by market vertical with average scores
- **Score Trend Over Time** — Track your validation performance across recent ideas
- **Streak Counter** — Gamified daily validation streak tracking
- **Insights Panel** — AI-generated actionable tips based on your validation history
- **Grid/List View** — Toggle between card grid and compact list views
- **Search & Filter** — Filter by status (validated, pending, failed), sort by score or date
- **Quick Delete** — Hover-to-delete with confirmation
- **Failed State Recovery** — Retry button on failed validations with automatic credit refund
- **Keyboard Shortcuts** — Press `Ctrl+K` to open shortcuts modal
- **Analytics Page** — Deep-dive analytics including industry performance, execution complexity distribution, and market scope success rates

### Compare
- **Side-by-Side Radar** — Visual radar chart comparing two validated ideas
- **Bar Comparison** — Side-by-side bar chart for quick metric comparison
- **Win/Loss Table** — Detailed metric-by-metric breakdown with winner highlighting
- **Automatic Leader Badge** — Shows which idea is performing better

### Professional Export
- **Investor-Ready PDF** — Multi-page, styled PDF export of your full validation report
- **Email Report Delivery** — Founder Pro and Enterprise users can email the full report to their account as CSV or a Word-compatible document (requires Resend configuration)
- **Night Theme** - Dark interface with glass-style panels and translucent surfaces.

### AI Idea Generator
- **Prompt-Based Generation** — Describe your interests and get 3–5 tailored business ideas
- **Pre-Scored Ideas** — Each generated idea comes with an initial viability estimate
- **One-Click Validate** — Save any generated idea directly to your dashboard for full validation
- **Streaming Progress** — Watch the AI brainstorm in real time

### Platform & Security
- **JWT Authentication** — 7-day tokens with bcryptjs password hashing
- **Credit/Quota System** — Explorer (5/month), Founder Pro (unlimited), Enterprise (unlimited + API access) — credits are only consumed on successful validation and refunded on failures
- **Rate Limiting** — In-memory rate limiting on auth, validation, and contact endpoints
- **Route Protection** — Next.js middleware proxy guarding `/dashboard` and authenticated `/api` routes
- **Newsletter Subscription** — Email capture with a working `/api/newsletter` endpoint
- **Contact Inquiries** — Sales/contact form persisted to the database via `/api/contact`
- **Public Pages** — About, Blog, Careers, Contact, Status, Changelog, Privacy Policy, Terms of Service, Cookie Policy, and GDPR pages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5.8 |
| **Styling** | Tailwind CSS 4.0 |
| **Charts** | Recharts (Radar, Bar, Pie, Line) — lazy-loaded |
| **Backend** | Next.js Route Handlers (API routes) |
| **Database** | PostgreSQL + Prisma 6.19 ORM |
| **AI** | OpenAI GPT-4o via OpenRouter (streaming via SSE) |
| **Web Search** | Exa AI (optional, for verified sources) |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Payments** | Stripe (checkout sessions + webhooks) |
| **Export** | jsPDF + html2canvas |
| **Animations** | Framer Motion |
| **Bundler** | Turbopack (dev) / Webpack (production build) |

---

## Architecture

IdeaForge is a single Next.js application — there is **no separate backend server**. The frontend and API live together in the same codebase using the App Router.

```
┌──────────────────────────────────────────────────────┐
│                   Next.js App (port 1212)             │
│                                                       │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  App Router  │   │  API Routes   │   │  Proxy MW │  │
│  │  (Pages)     │   │  (/api/*)     │   │ (proxy.ts)│  │
│  └──────┬───────┘   └──────┬───────┘   └─────┬─────┘  │
│         │                  │                  │        │
│         └──────────┬───────┴──────────┬───────┘        │
│                    │                  │                │
│              ┌─────┴─────┐    ┌───────┴───────┐       │
│              │  Prisma   │    │  OpenRouter    │       │
│              │  Client   │    │  (GPT-4o SSE)  │       │
│              └─────┬─────┘    └───────────────┘       │
│                    │                                   │
│              ┌─────┴─────┐                             │
│              │ PostgreSQL│                             │
│              │ (port 8869)│                            │
│              └───────────┘                             │
└──────────────────────────────────────────────────────┘
```

- **proxy.ts** — Next.js middleware that protects `/dashboard` (redirects to `/login` if no token) and guards `/api/*` routes (requires `Bearer` token) unless the path is in the public list.
- **lib/ai.ts** — The validation engine: builds prompts, streams GPT-4o responses, parses structured JSON reports, and optionally enriches with Exa web search.
- **lib/auth.tsx** — Client-side auth context (React provider) wrapping the app.
- **lib/tokens.ts** — Credit/quota management with monthly refill logic.

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+
- **PostgreSQL** database (local, Neon, Supabase, Vercel Postgres, or Prisma Postgres)
- **OpenRouter API key** (for GPT-4o access)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Tesfazion/Ideaforge-ai.git
cd Ideaforge-ai

# 2. Install dependencies (postinstall auto-runs prisma generate)
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your database URL and API keys (see Configuration)

# 4. Set up the database
npm run db:push

# 5. (Optional) Seed test data
npm run db:seed

# 6. Start the development server
npm run dev
```

Open **[http://localhost:1212](http://localhost:1212)** in your browser.

---

## Configuration

Create a `.env.local` file in the project root (`ideaforge-ai/`):

```env
# PostgreSQL Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:8869/ideaforge?connect_timeout=10&sslmode=prefer"

# JWT Secret (generate a strong random string for production)
JWT_SECRET="your-strong-random-secret"

# AI Provider (OpenRouter or OpenAI)
AI_API_KEY="your-openrouter-or-openai-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="openai/gpt-4o"

# Optional: Email validation (Abstract API)
ABSTRACT_EMAIL_API_KEY=""

# Report delivery by email (Resend)
RESEND_API_KEY=""
RESEND_FROM_EMAIL="IdeaForge <reports@your-verified-domain.com>"

# Optional: Web search (Exa API)
EXA_API_KEY=""

# Optional: Stripe Payments (leave empty for dev-mode mock)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRO_PRICE_ID=""
STRIPE_ENTERPRISE_PRICE_ID=""

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:1212"
```

> **Company:** IdeaForge is made by [Sunshine Tech Solution](https://sunshinetechsolution.vercel.app/).

---

## Database

The Prisma schema (`prisma/schema.prisma`) uses PostgreSQL and defines four models:

| Model | Description |
|-------|-------------|
| **User** | Accounts, plan tier, token quota, monthly refill |
| **Idea** | Submitted business ideas with status tracking (pending / validated / failed) |
| **Report** | Full validation reports — 9-dimension scores, SWOT, market sizing, GTM experiments, action plan, sources |
| **ContactInquiry** | Contact form submissions (email, company, team size, message) |

### Local PostgreSQL Setup

If you have PostgreSQL running locally:

```bash
# Create the database (if needed)
createdb ideaforge

# Update DATABASE_URL in .env.local, then:
npm run db:push      # Push schema to database (dev)
npm run db:generate  # Generate Prisma Client (auto on postinstall)
npm run db:seed      # Optional: seed test data
npm run db:studio    # Optional: open Prisma Studio GUI
```

For production migrations:

```bash
npm run db:migrate   # Runs prisma migrate deploy
```

---

## Running

### Development

```bash
npm run dev
```

Starts the Next.js dev server with **Turbopack** on **port 1212**. The first visit to each route compiles on demand (~1–12s), after which it's cached and loads in <0.5s.

### Production

```bash
npm run build    # prisma generate + next build (webpack)
npm run start    # next start (serves the production build)
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
ideaforge-ai/
├── app/
│   ├── api/                          # Next.js Route Handlers (backend)
│   │   ├── auth/                     # register, login, me, upgrade, check-email, create-checkout-session
│   │   ├── ideas/                    # CRUD + validate-stream, retry, pivot-suggestions, pivot-chat, generate-ideas
│   │   ├── reports/[id]/             # Report retrieval
│   │   ├── preview/                  # No-auth instant idea preview score
│   │   ├── health/                   # Health check
│   │   ├── newsletter/              # Email subscription capture
│   │   ├── contact/                  # Contact form submission
│   │   └── webhooks/stripe/         # Stripe webhook handler
│   ├── dashboard/                    # Authenticated dashboard
│   │   ├── page.tsx                  # Main dashboard (charts & idea grid)
│   │   ├── layout.tsx               # Sidebar + header + theme toggle
│   │   ├── new/page.tsx             # Submit new idea form
│   │   ├── generate/page.tsx        # AI idea generator
│   │   ├── compare/page.tsx         # Compare validated ideas
│   │   ├── insights/page.tsx       # Analytics & trends
│   │   ├── upgrade/page.tsx         # Pricing & credit system
│   │   ├── payment/success/page.tsx # Payment success
│   │   └── idea/[id]/page.tsx       # Report detail (9-dim, GTM, pivot)
│   ├── about/                        # Company about page
│   ├── blog/                         # Blog (coming soon)
│   ├── careers/                      # Careers
│   ├── contact/                      # Contact form (posts to /api/contact)
│   ├── status/                       # System status
│   ├── changelog/                    # Release history
│   ├── privacy-policy/              # Privacy policy
│   ├── terms-of-service/            # Terms of service
│   ├── cookie-policy/              # Cookie policy
│   ├── gdpr/                         # GDPR compliance
│   ├── login/page.tsx               # Login
│   ├── register/page.tsx            # Register
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout (providers, metadata, schema)
│   └── globals.css                  # Tailwind + theme + animations
├── components/                       # Reusable UI components
│   ├── Navbar.tsx, Footer.tsx, Newsletter.tsx
│   ├── Hero.tsx, Features.tsx, HowItWorks.tsx
│   ├── Pricing.tsx, FAQ.tsx, CTA.tsx
│   ├── ProcessingOverlay.tsx        # Live AI streaming progress
│   ├── DashboardWidgets.tsx, LazyCharts.tsx
│   ├── ThemeProvider.tsx, SectionNav.tsx, BackToTop.tsx
│   └── ...
├── lib/                              # Core utilities
│   ├── ai.ts                        # GPT-4o validation engine, web search, prompts
│   ├── api.ts                        # Frontend API client + TypeScript types
│   ├── auth.tsx                      # Auth context & provider
│   ├── jwt.ts                        # JWT sign/verify
│   ├── prisma.ts                    # Prisma client singleton
│   ├── rate-limit.ts                # In-memory rate limiter
│   ├── tokens.ts                     # Credit/quota management
│   └── stripe.ts                    # Stripe client
├── prisma/
│   ├── schema.prisma                # PostgreSQL schema (User, Idea, Report, ContactInquiry)
│   └── seed.ts                       # Test data seeding
├── public/
│   └── logo.png                      # IdeaForge logo
├── proxy.ts                          # Auth middleware (route protection)
├── next.config.ts                    # Next.js config (standalone output, images)
├── vercel.json                       # Vercel deployment config
├── .env.example                      # Environment template
├── .env.local                        # Your local environment (not committed)
└── package.json                      # Dependencies and scripts
```

---

## API Reference

All authenticated endpoints require a `Bearer` token in the `Authorization` header (issued at login/register).

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| GET | `/api/auth/me` | Yes | Get current user profile |
| POST | `/api/auth/upgrade` | Yes | Upgrade plan |
| POST | `/api/auth/check-email` | No | Email validation check |
| POST | `/api/auth/create-checkout-session` | Yes | Create Stripe checkout session |

### Ideas
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/ideas` | Yes | List all user ideas |
| POST | `/api/ideas` | Yes | Create new idea |
| GET | `/api/ideas/:id` | Yes | Get idea with report |
| PUT | `/api/ideas/:id` | Yes | Update idea |
| DELETE | `/api/ideas/:id` | Yes | Delete idea |
| POST | `/api/ideas/:id/validate-stream` | Yes | SSE streaming AI validation |
| POST | `/api/ideas/:id/retry` | Yes | Retry failed validation |
| POST | `/api/ideas/:id/pivot-suggestions` | Yes | SSE: generate pivot ideas |
| POST | `/api/ideas/:id/pivot-chat` | Yes | Multi-turn pivot chat |
| POST | `/api/ideas/generate-ideas` | Yes | SSE: AI idea generation |

### Reports
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/reports/:id` | Yes | Get full validation report |

### Public
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/preview` | No | Instant idea preview score (no signup) |
| POST | `/api/newsletter` | No | Email newsletter subscription |
| POST | `/api/contact` | No | Contact form submission |
| POST | `/api/webhooks/stripe` | No | Stripe webhook receiver |

---

## Pages & Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, features, pricing, testimonials, FAQ) |
| `/login` | Sign in |
| `/register` | Create account |
| `/about` | Company mission and story |
| `/blog` | Blog (coming soon) |
| `/careers` | Open roles & how to apply |
| `/contact` | Contact form |
| `/status` | System status dashboard |
| `/changelog` | Release history |
| `/privacy-policy` | Privacy policy |
| `/terms-of-service` | Terms of service |
| `/cookie-policy` | Cookie policy |
| `/gdpr` | GDPR compliance info |

### Dashboard (auth required)
| Route | Description |
|-------|-------------|
| `/dashboard` | Idea grid, charts, streak, insights |
| `/dashboard/new` | Submit a new idea for validation |
| `/dashboard/generate` | AI idea generator |
| `/dashboard/compare` | Compare two validated ideas |
| `/dashboard/insights` | Analytics & trends |
| `/dashboard/upgrade` | Pricing & plan upgrade |
| `/dashboard/idea/[id]` | Full report (9-dim, GTM, pivot, PDF export) |
| `/dashboard/payment/success` | Payment confirmation |

---

## Pricing Model

| Plan | Price | Validations | Features |
|------|-------|-------------|----------|
| **Explorer** (Free) | $0/mo | 5/month | Full report in the workspace, preview score, PDF export |
| **Founder Pro** | $19/mo | Unlimited | Full analysis, pivot tools, PDF export, email reports as CSV or Word |
| **Enterprise** | $49/mo | Unlimited | Everything in Founder Pro + REST API access and up to 10 active API keys |

### Credit Safeties
- Credits only consumed on **successful** validation
- **Auto-refund** on 5xx errors or AI failures
- **Retry** failed validations at no cost
- Monthly token refill for all users

---

## Deployment

### Vercel (Recommended)

The Next.js app lives in the ideaforge-ai/ subdirectory of this GitHub repository. Use a single Vercel project for this app (recommended name: ideaforge-ai) and set its **Root Directory** to ideaforge-ai in Project Settings > Build and Development Settings.

1. Connect the Tesfazion/Ideaforge-ai GitHub repository to the Vercel project.
2. Configure a PostgreSQL database and the required environment variables in Vercel Project Settings > Environment Variables: DATABASE_URL, JWT_SECRET, AI_API_KEY, AI_BASE_URL, AI_MODEL, and NEXT_PUBLIC_APP_URL.
3. Add optional integration values only when those features are enabled: EXA_API_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, and the STRIPE_* values. Keep secrets in Vercel, never in Git.
4. Deploy. Vercel installs dependencies, generates Prisma Client through postinstall, and runs the Next.js production build.

#### If GitHub reports "Vercel - Deployment was blocked"

The GitHub check label alone does not include Vercel's detailed reason. Open the deployment details first. If they say the commit author lacks access, this is an authorization block before the build, separate from GitHub Actions. Follow the [Vercel project collaboration guide](https://vercel.com/docs/deployments/troubleshoot-project-collaboration):

1. In Vercel Account Settings > Authentication, connect the GitHub account that owns this repository to the Vercel account that owns the project.
2. Check that Vercel recognizes the GitHub account that authored the commit. For a Hobby project, that author must map to the project owner's GitHub account; for a Pro team, the author must be a team member.
3. In each intended Vercel project, open Settings > Git and verify the connected repository and production branch. Several projects connected to the same repository each create their own Vercel status check; keep only the intended project connected if the others are obsolete.
4. After correcting account access or project settings, trigger a new deployment or push a new commit. Editing application code cannot resolve an access block.

If Vercel reports a build failure instead, inspect that deployment's Build Logs for the specific error.

### Netlify

The repository includes a root `netlify.toml` that sets the app's base directory to `ideaforge-ai`, runs `npm run build`, and publishes `.next`. The app's `.nvmrc` pins the build to Node.js 20, matching the GitHub Actions build. The configuration explicitly enables `@netlify/plugin-nextjs`, installed in the app's development dependencies, to generate the server functions, public assets, and routing needed to serve Next.js. Publishing the raw `.next` directory without this runtime produces a Netlify 404 even when the build succeeds.

Connect the `main` branch in Netlify. The values in `netlify.toml` supply the base directory, build command, and publish directory; leave the Functions directory empty. Add the production environment variables listed in [Configuration](#configuration), including `DATABASE_URL`, `JWT_SECRET`, `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, and `NEXT_PUBLIC_APP_URL`. Add optional integration keys only when using those services. See [Netlify's Next.js guide](https://docs.netlify.com/frameworks/next-js/).

### Database Migrations (Production)

```bash
# Set DATABASE_URL to your production database
npm run db:migrate
```

### Other Platforms

Any platform supporting Next.js and PostgreSQL works:
- **Railway** — Add PostgreSQL addon
- **Render** — Use managed PostgreSQL
- **Fly.io** — Use Fly Postgres

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) on port 1212 |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Run production migrations |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:seed` | Seed test data |

---

## License

MIT

---

Built with [IdeaForge AI](https://github.com/Tesfazion/Ideaforge-ai) — Turn your ideas into validated businesses.

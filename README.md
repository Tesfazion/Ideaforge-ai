# IdeaForge AI

**AI-Powered Business Idea Validation Platform**

> Validate any startup idea in 30–60 seconds with GPT-4o. Get a 9-dimension viability index, verified market sources, GTM experiments, pivot suggestions, TAM/SAM/SOM market sizing, skeptic-mode adversarial stress-test, and an investor-ready PDF report.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
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
- [Production Hardening](#production-hardening)
- [Roadmap](#roadmap)
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
- **Dark Theme Support** — Full dark/light mode with persistent preference

### AI Idea Generator
- **Prompt-Based Generation** — Describe your interests and get 3–5 tailored business ideas
- **Pre-Scored Ideas** — Each generated idea comes with an initial viability estimate
- **One-Click Validate** — Save any generated idea directly to your dashboard for full validation
- **Streaming Progress** — Watch the AI brainstorm in real time

### Platform & Security
- **JWT Authentication** — 7-day tokens with bcryptjs password hashing; secret required in production
- **Input Validation** — Zod schema validation on all auth, contact, and newsletter API routes
- **Credit/Quota System** — Free (1/mo), Pro (unlimited), Enterprise — credits only consumed on successful validation with auto-refund on failures
- **Rate Limiting** — In-memory rate limiting on auth, validation, contact, and newsletter endpoints
- **Route Protection** — Next.js middleware proxy guarding `/dashboard` and authenticated `/api` routes
- **Newsletter Subscription** — Email capture persisted to database via `/api/newsletter` (dedup with upsert)
- **Contact Inquiries** — Sales/contact form persisted to the database via `/api/contact`
- **Loading & Error Boundaries** — `loading.tsx`, `error.tsx`, and `not-found.tsx` route boundaries for graceful UX
- **SEO & PWA** — `robots.txt`, `sitemap.xml`, and `manifest.json` for search engines and installable PWA
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
| **Validation** | Zod (API input validation) |
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
- **lib/jwt.ts** — JWT sign/verify with production secret enforcement.
- **lib/rate-limit.ts** — In-memory rate limiter with IP extraction.

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
cd ideaforge-ai
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

Create a `.env.local` file in the `ideaforge-ai/` directory:

```env
# PostgreSQL Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:8869/ideaforge?connect_timeout=10&sslmode=prefer"

# JWT Secret (generate a strong random string for production)
# Required in production — app will throw if missing
JWT_SECRET="your-strong-random-secret-min-16-chars"

# AI Provider (OpenRouter or OpenAI)
AI_API_KEY="your-openrouter-or-openai-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="openai/gpt-4o"

# Optional: Email validation (Abstract API)
ABSTRACT_EMAIL_API_KEY=""

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

> **Company email:** Contact, careers, and privacy inquiries route to `tesfazion428@gmail.com`.

> **Security:** `.env.local` and `.env` are in `.gitignore` and never committed. Only `.env.example` is tracked.

---

## Database

The Prisma schema (`ideaforge-ai/prisma/schema.prisma`) uses PostgreSQL and defines five models:

| Model | Description |
|-------|-------------|
| **User** | Accounts, plan tier, token quota, monthly refill |
| **Idea** | Submitted business ideas with status tracking (pending / validated / failed) |
| **Report** | Full validation reports — 9-dimension scores, SWOT, market sizing, GTM experiments, action plan, sources |
| **ContactInquiry** | Contact form submissions (email, company, team size, message) |
| **Subscriber** | Newsletter email subscriptions (deduplicated via unique constraint) |

### Local PostgreSQL Setup

If you have PostgreSQL running locally:

```bash
cd ideaforge-ai

# Create the database (if needed)
createdb ideaforge

# Update DATABASE_URL in .env.local, then:
npm run db:push      # Push schema to database (dev)
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
cd ideaforge-ai
npm run dev
```

Starts the Next.js dev server with **Turbopack** on **port 1212**. The first visit to each route compiles on demand (~1–12s), after which it's cached and loads in <0.5s.

### Production

```bash
cd ideaforge-ai
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
Ideaforge-ai/
├── README.md                         # This file (repo root)
└── ideaforge-ai/
    ├── app/
    │   ├── api/                          # Next.js Route Handlers (backend)
    │   │   ├── auth/                     # register, login, me, upgrade, check-email, create-checkout-session
    │   │   ├── ideas/                    # CRUD + validate-stream, retry, pivot-suggestions, pivot-chat, generate-ideas
    │   │   ├── reports/[id]/             # Report retrieval
    │   │   ├── preview/                  # No-auth instant idea preview score
    │   │   ├── health/                   # Health check
    │   │   ├── newsletter/              # Email subscription (DB-persisted)
    │   │   ├── contact/                  # Contact form submission (DB-persisted)
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
    │   │   └── idea/[id]/page.tsx       # Report detail (9-dim, GTM, pivot, PDF export)
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
    │   ├── loading.tsx                  # Global loading boundary (spinner)
    │   ├── error.tsx                    # Global error boundary (retry + home)
    │   ├── not-found.tsx               # Styled 404 page
    │   ├── robots.ts                    # robots.txt route
    │   ├── sitemap.ts                   # sitemap.xml route
    │   ├── layout.tsx                   # Root layout (providers, metadata, schema, manifest)
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
    │   ├── jwt.ts                        # JWT sign/verify (production secret enforcement)
    │   ├── prisma.ts                    # Prisma client singleton
    │   ├── rate-limit.ts                # In-memory rate limiter
    │   ├── tokens.ts                     # Credit/quota management
    │   └── stripe.ts                    # Stripe client
    ├── prisma/
    │   ├── schema.prisma                # PostgreSQL schema (User, Idea, Report, ContactInquiry, Subscriber)
    │   └── seed.ts                       # Test data seeding
    ├── public/
    │   ├── logo.png                      # IdeaForge logo
    │   └── manifest.json                # PWA manifest
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
| POST | `/api/auth/register` | No | Create account (Zod-validated) |
| POST | `/api/auth/login` | No | Sign in (Zod-validated) |
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
| POST | `/api/newsletter` | No | Email newsletter subscription (DB-persisted, rate-limited) |
| POST | `/api/contact` | No | Contact form submission (DB-persisted, rate-limited) |
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
| **Explorer** (Free) | $0/mo | 1/month | Basic 5-dimension scoring, standard report, 1 idea generation |
| **Founder** (Pro) | $19/mo | Unlimited | Full 9-dimension index, GTM experiments, pivot assistant, verified sources, priority processing, PDF export, unlimited idea generation |
| **Enterprise** | $49/mo | Unlimited | Everything in Pro + 5 team members, shared workspace, API access |

### Credit Safeties
- Credits only consumed on **successful** validation
- **Auto-refund** on 5xx errors or AI failures
- **Retry** failed validations at no cost
- Monthly token refill for all users

---

## Deployment

### Vercel (Recommended)

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set the **Root Directory** to `ideaforge-ai` in Vercel project settings
4. Add a PostgreSQL database (Vercel Postgres, Neon, Supabase, or Prisma Postgres)
5. Set environment variables in the Vercel dashboard (see [Configuration](#configuration))
6. Deploy — Vercel runs `prisma generate` automatically via the `postinstall` script

### Database Migrations (Production)

```bash
cd ideaforge-ai
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

All commands run from the `ideaforge-ai/` directory:

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

## Production Hardening

The following security and reliability improvements have been implemented:

| Feature | Status | Details |
|---------|--------|---------|
| JWT secret enforcement | ✅ Done | App throws in production if `JWT_SECRET` is missing or <16 chars |
| Zod input validation | ✅ Done | All auth, contact, and newsletter routes validated |
| Newsletter DB persistence | ✅ Done | `Subscriber` model, upsert dedup, rate-limited |
| Contact form DB persistence | ✅ Done | `ContactInquiry` model, rate-limited |
| Rate limiting | ✅ Done | In-memory on auth, validation, contact, newsletter |
| Route protection | ✅ Done | Middleware proxy guards `/dashboard` and `/api/*` |
| Loading/Error boundaries | ✅ Done | `loading.tsx`, `error.tsx`, `not-found.tsx` |
| SEO files | ✅ Done | `robots.txt`, `sitemap.xml`, `manifest.json` |
| Secret management | ✅ Done | `.env.local` in `.gitignore`, never committed |

### Remaining (optional, for scale):

| Item | Priority | Notes |
|------|----------|-------|
| Redis-backed rate limiting | Medium | Replace in-memory with Upstash Redis for multi-instance |
| Structured logging (pino) | Medium | For observability in production |
| Error tracking (Sentry) | Medium | Catch runtime errors before users report |
| CSRF protection | Medium | On mutation endpoints |
| E2E tests (Playwright) | Medium | Confidence on deploys |
| Unit tests (vitest) | Medium | Core logic coverage |
| Stripe live keys + webhook | High (deploy) | Set in Vercel env vars + Stripe dashboard |
| HTTPS / secure cookies | Auto | Automatic on Vercel |

---

## Roadmap

### Competitive Differentiators

| Feature | Impact |
|---------|--------|
| Shareable public report links (`/r/[id]`) | Viral growth loop, backlinks |
| Real competitor data via live web search | Most tools use stale LLM knowledge |
| Team workspaces (Enterprise) | B2B upsell, sticky retention |
| Webhook/API for programmatic validation | Devs & agencies integrate you |
| Multi-idea comparison matrix | Most tools only do 1:1 |
| Historical trend tracking | Shows value over time |
| Mobile app or PWA with offline drafts | Capture ideas on the go |
| Benchmark database | Social proof ("better than 73% of SaaS ideas") |
| Notion/Obsidian export | Fits founder workflows |
| Embeddable free "idea score" widget | Lead generation channel |
| Real blog content (CMS-backed) | SEO traffic + authority |
| Social media profile links | Credibility (currently placeholders) |

---

## License

MIT

---

Built with [IdeaForge AI](https://github.com/Tesfazion/Ideaforge-ai) — Turn your ideas into validated businesses.

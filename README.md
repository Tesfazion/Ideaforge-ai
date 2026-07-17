# IdeaForge AI

**AI-Powered Business Idea Validation Platform**

> Validate your startup idea in 30-60 seconds with GPT-4o. Get a 9-dimension viability score, verified market sources, GTM experiments, pivot suggestions, TAM/SAM/SOM market sizing, skeptic mode adversarial stress-test, and an investor-ready PDF report.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/GPT--4o-OpenRouter-412991?logo=openai)
![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748?logo=prisma)

---

## Features

### Core Validation
- **9-Dimension Viability Index** -- Problem Severity, Market Urgency, Market Size, Competitive Moat, Ease of Replica, Revenue Potential, Founder-Idea Fit, Time to Market, Scalability
- **Execution Complexity Score** -- Know if your idea ships in a weekend or requires regulatory approval
- **Live Streaming AI Analysis** -- Watch the AI analyze your idea step-by-step in real-time via Server-Sent Events
- **Verified Source Citations** -- Clickable links to market data, competitor pages, and trend reports that support the analysis

### Actionable Output
- **Auto-Generated GTM Experiments** -- 4 low-cost/no-cost experiments with step-by-step instructions, costs, timeframes, and success metrics
- **Specific ICP Definition** -- Not "tech professionals" but "Junior Python developers in their first job at startups with 10-50 employees"
- **Landing Page Hook & Sub-headline** -- Ready-to-use copy for your Framer/Webflow waitlist page
- **Action Checklist** -- Day-by-day validation roadmap with deadlines and reasoning
- **Value Hypothesis** -- Structured hypothesis template for investor conversations
- **Riskiest Assumption** -- Identified and explained for focused testing

### Pivot & Iterate
- **AI Pivot Assistant** -- Multi-turn chat for personalized pivot advice
- **3 Pivot Suggestions** -- Alternative business directions with viability estimates
- **One-Click Pivot Validation** -- Re-validate a pivot suggestion with a single click

### Dashboard & Analytics
- **Score Distribution Charts** -- Pie charts and bar graphs across all your ideas
- **Industry Breakdown** -- Visual breakdown by market vertical with average scores
- **Score Trend Over Time** -- Track your validation performance across recent ideas
- **Streak Counter** -- Gamified daily validation streak tracking
- **Insights Panel** -- AI-generated actionable tips based on your validation history
- **Grid/List View** -- Toggle between card grid and compact list views
- **Search & Filter** -- Filter by status (validated, pending, failed), sort by score or date
- **Quick Delete** -- Hover-to-delete with confirmation
- **Failed State Recovery** -- Retry button on failed validations with automatic credit refund
- **Keyboard Shortcuts** -- Press `Ctrl+K` to open shortcuts modal
- **Analytics Page** -- Deep-dive analytics including industry performance, execution complexity distribution, and market scope success rates

### Compare
- **Side-by-Side Radar** -- Visual radar chart comparing two validated ideas
- **Bar Comparison** -- Side-by-side bar chart for quick metric comparison
- **Win/Loss Table** -- Detailed metric-by-metric breakdown with winner highlighting
- **Automatic Leader Badge** -- Shows which idea is performing better

### Professional Export
- **Investor-Ready PDF** -- Multi-page, styled PDF export of your full validation report
- **Dark Theme Support** -- Full dark/light mode with persistent preference

### AI Idea Generator
- **Prompt-Based Generation** -- Describe your interests and get 3-5 tailored business ideas
- **Pre-Scored Ideas** -- Each generated idea comes with an initial viability estimate
- **One-Click Validate** -- Save any generated idea directly to your dashboard for full validation
- **Streaming Progress** -- Watch the AI brainstorm in real-time

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5.8, Tailwind CSS 4.0 |
| Charts | Recharts (Radar, Bar, Pie, Line) |
| Backend | Express 4.21, Prisma 6.18, SQLite |
| AI | OpenAI GPT-4o via OpenRouter |
| Auth | JWT (7-day tokens), bcryptjs |
| Export | jsPDF + html2canvas |
| Streaming | Server-Sent Events (SSE) |
| Animations | Framer Motion |

---

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn
- OpenRouter API key (for GPT-4o access)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tesfazion/Ideaforge-ai.git
cd Ideaforge-ai

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Configuration

Create `server/.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
AI_API_KEY="your-openrouter-api-key"
AI_BASE_URL="https://openrouter.ai/api/v1"
AI_MODEL="openai/gpt-4o"
PORT=4000
CORS_ORIGIN="http://localhost:1212"
```

### Running

```bash
# Terminal 1: Start backend
cd server
npx prisma db push
npx prisma generate
npx tsc
node dist/index.js

# Terminal 2: Start frontend
npm run dev
```

Open [http://localhost:1212](http://localhost:1212) in your browser.

---

## Project Structure

```
ideaforge-ai/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard with charts & idea grid
│   │   ├── layout.tsx            # Sidebar + header + theme toggle
│   │   ├── new/page.tsx          # Submit new idea form with AI suggestions
│   │   ├── generate/page.tsx     # AI idea generator
│   │   ├── compare/page.tsx      # Compare validated ideas (radar + bar charts)
│   │   ├── insights/page.tsx     # Analytics & trends
│   │   ├── upgrade/page.tsx      # Pricing & credit system
│   │   └── idea/[id]/page.tsx    # Report detail with 9-dim, GTM, pivot
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Theme, animations, utilities
├── components/
│   ├── ProcessingOverlay.tsx     # Live AI streaming progress
│   ├── Hero.tsx, Features.tsx    # Landing page sections
│   ├── Pricing.tsx, FAQ.tsx
│   └── ...
├── lib/
│   ├── api.ts                    # API client, SSE streaming, types
│   └── auth.tsx                  # Auth context & provider
├── server/
│   ├── src/
│   │   ├── index.ts              # Express app setup
│   │   ├── routes/
│   │   │   ├── auth.ts           # Register, login, me, upgrade
│   │   │   ├── ideas.ts          # CRUD, validate-stream, pivot
│   │   │   └── reports.ts        # Report retrieval
│   │   ├── services/
│   │   │   ├── ai.ts             # GPT-4o validation, generation, pivot
│   │   │   └── email.ts          # Email verification
│   │   └── middleware/auth.ts    # JWT auth middleware
│   ├── prisma/
│   │   └── schema.prisma         # User, Idea, Report models
│   └── dist/                     # Compiled output
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/upgrade` | Upgrade to Pro |

### Ideas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ideas` | List all ideas |
| GET | `/api/ideas/:id` | Get idea with report |
| POST | `/api/ideas` | Create new idea |
| POST | `/api/ideas/:id/validate-stream` | SSE streaming validation |
| POST | `/api/ideas/:id/retry` | Retry failed validation |
| POST | `/api/ideas/:id/pivot-suggestions` | SSE pivot generation |
| POST | `/api/ideas/:id/pivot-chat` | Multi-turn pivot chat |
| POST | `/api/ideas/generate-ideas` | SSE AI idea generation |
| DELETE | `/api/ideas/:id` | Delete idea |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/:ideaId` | Get validation report |

---

## Pricing Model

| Plan | Price | Validations | Features |
|------|-------|-------------|----------|
| **Explorer** (Free) | $0/mo | 1/month | Basic 5-dimension scoring, standard report, 1 idea generation |
| **Founder** (Pro) | $19/mo | Unlimited | Full 9-dimension index, GTM experiments, pivot assistant, verified sources, priority processing, PDF export, unlimited idea generation |
| **Enterprise** | $49/mo | Unlimited | Everything in Pro + 5 team members, shared workspace, API access |

### Credit Safeties
- Credits only consumed on successful validation
- Auto-refund on 5xx errors or AI failures
- Retry failed validations at no cost

---

## License

MIT

---

Built with [IdeaForge AI](https://github.com/Tesfazion/Ideaforge-ai) -- Turn your ideas into validated businesses.

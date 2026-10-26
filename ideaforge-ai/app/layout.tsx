import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

/* Sunshine Tech Solution typography: Montserrat headings, Poppins body. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "IdeaForge - Validate Your Business Idea with AI in 30 Seconds",
  description: "Get a comprehensive 9-dimension AI analysis of your business idea in 30 seconds. Market research, SWOT, competitor mapping, risk assessment, and a 7-day action plan. Free to start.",
  keywords: ["business idea validation", "AI startup analysis", "market research tool", "SWOT analysis", "idea validation", "startup tool", "business plan validator"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IdeaForge",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "IdeaForge - Validate Your Business Idea with AI",
    description: "Get a 9-dimension AI analysis of any business idea in 30 seconds. Market research, SWOT, competitor mapping, and more.",
    url: "https://ideaforge.ai",
    siteName: "IdeaForge",
    images: [
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format&q=80",
        width: 1200,
        height: 630,
        alt: "IdeaForge - AI Business Idea Validation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaForge - Validate Your Business Idea with AI",
    description: "Get a 9-dimension AI analysis of any business idea in 30 seconds.",
    images: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop&auto=format&q=80"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How accurate is the AI validation?", acceptedAnswer: { "@type": "Answer", text: "IdeaForge achieves a 94% accuracy rate based on user feedback and follow-up validations, using a multi-layered analysis engine with real-time market data." } },
    { "@type": "Question", name: "How long does a validation take?", acceptedAnswer: { "@type": "Answer", text: "Most validations complete in 15-30 seconds. Complex ideas may take up to 60 seconds." } },
    { "@type": "Question", name: "Can I validate any type of business idea?", acceptedAnswer: { "@type": "Answer", text: "Yes! IdeaForge works across all industries and business models — from SaaS and e-commerce to brick-and-mortar businesses." } },
    { "@type": "Question", name: "Is my idea data secure?", acceptedAnswer: { "@type": "Answer", text: "Your ideas are encrypted at rest and in transit. We never share your data with third parties or use it for training." } },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IdeaForge",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "AI-powered business idea validation tool with 9-dimension analysis, SWOT, competitor mapping, and 7-day action plans.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "79",
    priceCurrency: "USD",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "2400",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${montserrat.variable} ${poppins.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="1024x1024" type="image/png" />
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `try { const theme = localStorage.getItem("ideaforge-theme") === "dark" ? "dark" : "light"; document.documentElement.classList.toggle("light", theme === "light"); document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.dataset.theme = theme; } catch {}` }} />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col theme-transition">
        <AuthProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-600 focus:text-white focus:outline-none">
            Skip to content
          </a>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

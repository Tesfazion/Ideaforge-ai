import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#060a13",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" data-scroll-behavior="smooth" className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />`n        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />`n        <link rel="icon" href="/favicon.png" sizes="1024x1024" type="image/png" />`n        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col theme-transition">
        <AuthProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:outline-none">
            Skip to content
          </a>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

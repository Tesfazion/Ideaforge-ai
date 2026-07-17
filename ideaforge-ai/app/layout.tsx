import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
   title: "IdeaForge - Validate Your Business Idea with AI",
  description: "Get AI-powered validation feedback on your business ideas including market potential, competitor analysis, monetization suggestions, and risk assessment.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&auto=format&q=80" as="image" type="image/jpeg" />
      </head>
      <body className="min-h-full flex flex-col theme-transition" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

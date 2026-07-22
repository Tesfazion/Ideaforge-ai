import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoBar from "@/components/LogoBar";
import SocialProofTicker from "@/components/SocialProofTicker";
import Stats from "@/components/Stats";
import ActivityFeed from "@/components/ActivityFeed";
import BeforeAfter from "@/components/BeforeAfter";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Integrations from "@/components/Integrations";
import ComparisonTable from "@/components/ComparisonTable";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import TrustBadges from "@/components/TrustBadges";
import CTA from "@/components/CTA";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";
import BackToTop from "@/components/BackToTop";
import MobileCTA from "@/components/MobileCTA";
import PreviewScore from "@/components/PreviewScore";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section id="hero">
          <Hero />
        </section>
        <SocialProofTicker />
        <LogoBar />
        <Stats />
        <ActivityFeed />
        <BeforeAfter />
        <PreviewScore />
        <Features />
        <HowItWorks />
        <Integrations />
        <ComparisonTable />
        <Pricing />
        <Testimonials />
        <FAQ />
        <TrustBadges />
        <CTA />
        <Newsletter />
      </main>
      <Footer />
      <SectionNav />
      <BackToTop />
      <MobileCTA />
    </>
  );
}

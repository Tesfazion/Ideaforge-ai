import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProofTicker from "@/components/SocialProofTicker";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PreviewScore from "@/components/PreviewScore";
import ComparisonTable from "@/components/ComparisonTable";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import SectionNav from "@/components/SectionNav";
import BackToTop from "@/components/BackToTop";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section id="hero">
          <Hero />
        </section>
        <SocialProofTicker />
        <Features />
        <HowItWorks />
        <PreviewScore />
        <ComparisonTable />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <SectionNav />
      <BackToTop />
      <MobileCTA />
    </>
  );
}

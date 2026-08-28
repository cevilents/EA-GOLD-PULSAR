import ClaimFlow from "@/components/ClaimFlow";
import EaCollection from "@/components/EaCollection";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { LanguageProvider } from "@/components/LanguageProvider";
import Navbar from "@/components/Navbar";
import PerformanceHighlights from "@/components/PerformanceHighlights";
import ProfitShowcase from "@/components/ProfitShowcase";
import StatsBar from "@/components/StatsBar";
import Testimonials from "@/components/Testimonials";
import TutorialSteps from "@/components/TutorialSteps";
import WhyGoldPulsar from "@/components/WhyGoldPulsar";

export default function Home() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <PerformanceHighlights />
        <EaCollection />
        <Testimonials />
        <ProfitShowcase />
        <WhyGoldPulsar />
        <TutorialSteps />
        <ClaimFlow />
        <Faq />
      </main>
      <Footer />
    </LanguageProvider>
  );
}

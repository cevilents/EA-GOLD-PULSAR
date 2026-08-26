import ClaimFlow from "@/components/ClaimFlow";
import EaCollection from "@/components/EaCollection";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import StatsBar from "@/components/StatsBar";
import TutorialSteps from "@/components/TutorialSteps";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <EaCollection />
        <TutorialSteps />
        <ClaimFlow />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

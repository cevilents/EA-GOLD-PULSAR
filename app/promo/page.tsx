import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import SignalNav from "@/components/signal/SignalNav";
import SignalHero from "@/components/signal/SignalHero";
import SignalTrustBar from "@/components/signal/SignalTrustBar";
import SignalProblem from "@/components/signal/SignalProblem";
import SignalAnatomy from "@/components/signal/SignalAnatomy";
import SignalHowTo from "@/components/signal/SignalHowTo";
import SignalFeatures from "@/components/signal/SignalFeatures";
import SignalProof from "@/components/signal/SignalProof";
import SignalWhyFree from "@/components/signal/SignalWhyFree";
import SignalTestimonials from "@/components/signal/SignalTestimonials";
import SignalFaq from "@/components/signal/SignalFaq";
import SignalCTA from "@/components/signal/SignalCTA";
import SignalStickyCta from "@/components/signal/SignalStickyCta";
import SignalFooter from "@/components/signal/SignalFooter";
import { signalCopies } from "@/data/signal";

const TITLE = "Sinyal XAUUSD Gratis Langsung ke HP Kamu — GoldPulsar";
const DESCRIPTION =
  "Sinyal gold lengkap dengan entry, stop loss, dan target, dikirim sebagai notifikasi ke aplikasi. Gratis tanpa syarat, tanpa kartu kredit. Klaim lisensimu lewat Telegram.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/promo" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "id_ID",
    siteName: "GoldPulsar"
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION
  }
};

/** Structured data FAQ — memperbesar peluang tampil sebagai rich result di pencarian. */
function FaqJsonLd() {
  const faq = signalCopies.id.faq.items;
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}

export default function SignalLandingPage() {
  return (
    <LanguageProvider gate={false} defaultLocale="id">
      <FaqJsonLd />
      <SignalNav />
      <main>
        <SignalHero />
        <SignalTrustBar />
        <SignalProblem />
        <SignalAnatomy />
        <SignalHowTo />
        <SignalFeatures />
        <SignalProof />
        <SignalWhyFree />
        <SignalTestimonials />
        <SignalFaq />
        <SignalCTA />
      </main>
      <SignalStickyCta />
      <SignalFooter />
    </LanguageProvider>
  );
}

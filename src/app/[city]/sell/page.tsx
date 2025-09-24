import { Metadata } from "next";
import { Assessment } from "@/components/Assessment";
import { Footer } from "@/components/Footer";

interface PageProps {
  params: { city: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = params.city.replace(/-/g, " ");
  const cityTitle = city.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return {
    title: `Sell My Business in ${cityTitle} | DealSprints`,
    description: `Confidential, fast deal intake for ${cityTitle} business owners. Book a 15-minute strategy call.`,
    alternates: { 
      canonical: `https://dealsprints.com/${params.city}/sell` 
    },
    openGraph: {
      title: `Sell My Business in ${cityTitle}`,
      description: `Confidential valuation & buyer matchmaking. 15-minute call.`,
      url: `https://dealsprints.com/${params.city}/sell`,
      siteName: "DealSprints",
      locale: "en_US",
      type: "website",
    },
  };
}

export default function CitySellPage({ params }: PageProps) {
  const city = params.city.replace(/-/g, " ");
  const cityTitle = city.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: "radial-gradient(800px 400px at 70% -10%, #6A7CFF22, transparent)" 
          }} 
        />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="font-display text-5xl leading-tight tracking-[-0.02em]">
            Sell my business in{" "}
            <span className="bg-gradient-to-r from-brand to-deal bg-clip-text text-transparent">
              {cityTitle}
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-mute">
            Confidential, fast deal intake for {cityTitle} business owners. 
            Professional valuation and buyer matchmaking in your local market.
          </p>
          <div className="mt-8 flex gap-4">
            <a 
              href="#assessment" 
              className="rounded-xl2 bg-brand px-6 py-3 font-medium text-ink shadow-soft hover:opacity-90 transition-opacity"
            >
              Get my {cityTitle} valuation
            </a>
            <a 
              href="/" 
              className="rounded-xl2 border border-line px-6 py-3 text-mute hover:border-brand transition-colors"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>
      
      <Assessment />
      <Footer />
    </main>
  );
}


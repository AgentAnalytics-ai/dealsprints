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
    title: `Buy a Business in ${cityTitle} | DealSprints`,
    description: `Curated business opportunities in ${cityTitle}. Pre-vetted acquisitions with funding fit.`,
    alternates: { 
      canonical: `https://dealsprints.com/${params.city}/buy` 
    },
    openGraph: {
      title: `Buy a Business in ${cityTitle}`,
      description: `Curated business opportunities in ${cityTitle}. Pre-vetted acquisitions with funding fit.`,
      url: `https://dealsprints.com/${params.city}/buy`,
      siteName: "DealSprints",
      locale: "en_US",
      type: "website",
    },
  };
}

export default function CityBuyPage({ params }: { params: { city: string } }) {
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
            background: "radial-gradient(800px 400px at 70% -10%, #10B98122, transparent)" 
          }} 
        />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="font-display text-5xl leading-tight tracking-[-0.02em]">
            Buy a business in{" "}
            <span className="bg-gradient-to-r from-deal to-brand bg-clip-text text-transparent">
              {cityTitle}
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-mute">
            Curated opportunities in {cityTitle}. Pre-vetted businesses, 
            ready for due diligence and funding.
          </p>
          <div className="mt-8 flex gap-4">
            <a 
              href="#assessment" 
              className="rounded-xl2 bg-deal px-6 py-3 font-medium text-ink shadow-soft hover:opacity-90 transition-opacity"
            >
              Find {cityTitle} opportunities
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


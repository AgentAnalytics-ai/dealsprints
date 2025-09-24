import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About DealSprints | Modern Deal Funnel Platform",
  description: "Learn about DealSprints - the modern deal funnel platform that helps businesses sell and buy faster with confidential, conversion-ready processes.",
  alternates: { 
    canonical: "https://dealsprints.com/about" 
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-medium mb-8">About DealSprints</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-mute mb-6">
              DealSprints is a modern deal funnel platform designed to help businesses sell and buy faster. 
              We believe deals should be done in sprints, not months.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Our Mission</h2>
            <p className="text-mute mb-6">
              To eliminate the friction in business transactions by providing confidential, 
              conversion-ready deal funnels that work in hours, not weeks.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">What We Do</h2>
            <ul className="text-mute mb-6 space-y-2">
              <li>• Confidential business valuations</li>
              <li>• Buyer matchmaking and seller connections</li>
              <li>• Professional PDF summaries</li>
              <li>• White-label deal funnel solutions</li>
              <li>• Edge-rendered performance optimization</li>
            </ul>
            
            <h2 className="font-display text-2xl font-medium mb-4">Why DealSprints</h2>
            <p className="text-mute mb-6">
              Traditional business brokerage is slow, expensive, and opaque. We've built a modern platform 
              that delivers results in 60 days or less, with transparent processes and professional outcomes.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

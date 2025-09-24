"use client";

import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { Process } from "@/components/Process";
import { Assessment } from "@/components/Assessment";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Removed Header component */}
      <Hero />
      <StatsBand />
      <Process />
      <Assessment />
      <CtaSection />
      <Footer />
    </main>
  );
}

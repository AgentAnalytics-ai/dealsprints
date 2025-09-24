"use client";

import { Hero } from "@/components/Hero";
import { Assessment } from "@/components/Assessment";
import { StatsBand } from "@/components/StatsBand";
import { Process } from "@/components/Process";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Assessment />
      <StatsBand />
      <Process />
      <CtaSection />
      <Footer />
    </main>
  );
}

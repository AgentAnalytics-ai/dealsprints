"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          background: "radial-gradient(800px 400px at 70% -10%, #6A7CFF22, transparent)" 
        }} 
      />
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* MASSIVE Professional Logo */}
          <div className="mb-20">
            <Logo size="massive" showText={false} className="justify-center" />
          </div>

          <h1 className="font-display text-6xl leading-tight tracking-[-0.02em] mb-8">
            Professional{" "}
            <span className="bg-gradient-to-r from-brand to-deal bg-clip-text text-transparent">
              Business Valuation
            </span>
            <br />& M&A Advisory
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-mute mb-12">
            Get your business valued by certified professionals. Confidential process, 
            pre-qualified acquirers, 60-day close guarantee.
          </p>
          
          <div className="flex justify-center gap-4">
            <a 
              href="#assessment" 
              className="rounded-xl bg-brand px-10 py-4 font-semibold text-white shadow-lg hover:opacity-90 transition-opacity text-lg"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Professional Valuation
            </a>
            <a 
              href="#process" 
              className="rounded-xl border border-white/30 px-10 py-4 text-white hover:border-brand transition-colors text-lg"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See Our Process
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

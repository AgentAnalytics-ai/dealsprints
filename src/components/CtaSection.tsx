"use client";

import { motion } from "framer-motion";

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand to-deal p-12 text-center"
        >
          <h2 className="font-display text-3xl font-medium text-ink">
            Ready for Professional Valuation?
          </h2>
          <p className="mt-4 text-ink/80">
            Get your comprehensive business assessment and connect with pre-vetted M&A professionals.
          </p>
          <a 
            href="#assessment"
            className="mt-6 inline-block rounded-xl2 bg-ink px-8 py-3 font-medium text-brand shadow-soft hover:opacity-90 transition-opacity"
          >
            Start Professional Assessment
          </a>
        </motion.div>
      </div>
    </section>
  );
}

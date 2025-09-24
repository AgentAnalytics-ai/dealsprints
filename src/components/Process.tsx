"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Assessment",
    description: "Professional business valuation and strategic analysis"
  },
  {
    title: "Matching", 
    description: "Pre-qualified M&A advisors with proven track records"
  },
  {
    title: "Negotiation",
    description: "Confidential process with pre-screened acquirers"
  },
  {
    title: "Close",
    description: "60-day guaranteed timeline with professional representation"
  }
];

export function Process() {
  return (
    <section id="process" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-medium mb-4">How It Works</h2>
          <p className="text-lg text-mute">Simple, professional process</p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-brand to-deal text-white font-bold text-xl">
                {index + 1}
              </div>
              <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-mute">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
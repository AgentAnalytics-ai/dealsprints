"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Users, Shield, Award } from "lucide-react";

const steps = [
  {
    title: "Instant Assessment",
    description: "Get your business valuation in 60 seconds",
    icon: Clock,
    highlight: "FREE"
  },
  {
    title: "Expert Matching", 
    description: "Connect with certified M&A professionals",
    icon: Users,
    highlight: "24 HOURS"
  },
  {
    title: "Confidential Process",
    description: "Secure negotiations with pre-qualified buyers",
    icon: Shield,
    highlight: "100% PRIVATE"
  },
  {
    title: "Guaranteed Close",
    description: "60-day close guarantee with professional support",
    icon: Award,
    highlight: "60 DAYS"
  }
];

export function Process() {
  return (
    <section id="process" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Simple, professional process that gets results
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-brand to-deal rounded-2xl flex items-center justify-center mx-auto">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {step.highlight}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-center mt-12"
        >
          <a 
            href="#assessment"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg"
          >
            <Clock className="w-5 h-5" />
            Start My Free Assessment
          </a>
        </motion.div>
      </div>
    </section>
  );
}
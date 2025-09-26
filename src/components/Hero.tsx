"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { TrendingUp, Clock, Shield, Users, ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800">
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          background: "radial-gradient(800px 400px at 70% -10%, #6A7CFF22, transparent)" 
        }} 
      />
      
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Professional Logo */}
          <div className="mb-12">
            <Logo size="massive" showText={false} className="justify-center" />
          </div>

          {/* Psychology-Optimized Headline */}
          <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-[-0.02em] mb-6">
            Get Your Free{" "}
            <span className="bg-gradient-to-r from-brand to-deal bg-clip-text text-transparent">
              Business Ranking
            </span>
            <br />& Market Analysis
          </h1>
          
          {/* Value Proposition */}
          <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-8">
            See how your business compares to the market and get a detailed PDF report with 
            location-based insights, growth recommendations, and competitive analysis.
          </p>
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex flex-col items-center text-gray-400">
              <span className="text-sm mb-2">Explore our platform</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>
          </motion.div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>500+ Businesses Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>2-Minute Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>100% Free & Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span>PDF Report Included</span>
            </div>
          </div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mb-8"
          >
            <a 
              href="#evaluation" 
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand to-deal px-12 py-5 font-bold text-white text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                // Scroll to evaluation tab
                const evaluationTab = document.querySelector('[data-tab="evaluation"]');
                if (evaluationTab) {
                  evaluationTab.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <TrendingUp className="w-6 h-6" />
              Get My Free Business Ranking
            </a>
          </motion.div>

          {/* Urgency/Scarcity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <p className="text-sm text-gray-400 mb-2">
              ⚡ Limited spots available this month
            </p>
            <p className="text-xs text-gray-500">
              Normally $5,000 • Free PDF report with market analysis
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

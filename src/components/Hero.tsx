"use client";

import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { TrendingUp, Clock, Shield, Users } from "lucide-react";

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

          {/* 3-Second Headline */}
          <h1 className="font-display text-5xl md:text-6xl leading-tight tracking-[-0.02em] mb-6">
            Discover Your Business's{" "}
            <span className="bg-gradient-to-r from-brand to-deal bg-clip-text text-transparent">
              Hidden Value
            </span>
            <br />in 60 Seconds
          </h1>
          
          {/* Value Proposition */}
          <p className="max-w-3xl mx-auto text-xl text-gray-300 mb-8">
            Get your professional valuation report instantly. See how you compare to industry leaders 
            and discover your business's true market value.
          </p>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>500+ Businesses Sold</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>60-Day Close Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
              <span>Free Valuation Report</span>
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
              href="#assessment" 
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand to-deal px-12 py-5 font-bold text-white text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <TrendingUp className="w-6 h-6" />
              Get My Free Valuation Report
            </a>
          </motion.div>

          {/* Urgency/Scarcity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-gray-400 mb-2">
              ⚡ Limited spots available this month
            </p>
            <p className="text-xs text-gray-500">
              Normally $5,000 • Free for qualified business owners
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

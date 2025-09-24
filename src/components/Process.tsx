"use client";

import { motion } from "framer-motion";
import { CheckCircle, Shield, Clock, Users, TrendingUp, Award } from "lucide-react";

const steps = [
  {
    title: "Professional Assessment",
    description: "Comprehensive business valuation using industry-standard methodologies",
    details: [
      "Financial analysis & market positioning",
      "Asset valuation & growth potential", 
      "Risk assessment & competitive analysis",
      "Professional valuation report"
    ],
    icon: TrendingUp,
    timeline: "1-3 days"
  },
  {
    title: "Advisor Matching", 
    description: "Connect with pre-vetted M&A professionals in your industry",
    details: [
      "Certified business brokers",
      "Industry-specific expertise",
      "Proven track record verification",
      "Personalized advisor selection"
    ],
    icon: Users,
    timeline: "24-48 hours"
  },
  {
    title: "Confidential Negotiation",
    description: "Secure process with pre-qualified acquirers and investors",
    details: [
      "NDA-protected discussions",
      "Pre-screened buyer database",
      "Strategic negotiation support",
      "Confidentiality guaranteed"
    ],
    icon: Shield,
    timeline: "2-4 weeks"
  },
  {
    title: "Guaranteed Close",
    description: "60-day close guarantee with professional representation",
    details: [
      "Legal documentation support",
      "Due diligence coordination",
      "Transaction management",
      "60-day close guarantee"
    ],
    icon: Award,
    timeline: "60 days max"
  }
];

const benefits = [
  { icon: CheckCircle, text: "No upfront fees - pay only on successful close" },
  { icon: CheckCircle, text: "100% confidential process" },
  { icon: CheckCircle, text: "Pre-qualified acquirers only" },
  { icon: CheckCircle, text: "Professional representation throughout" }
];

export function Process() {
  return (
    <section id="process" className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl font-bold mb-4 text-gray-900">
            Our Professional M&A Process
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From initial business valuation to successful close, we provide end-to-end M&A advisory 
            with certified professionals and guaranteed results.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-brand to-deal rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {step.timeline}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 text-lg">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-r from-brand to-deal rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Why Choose DealSprints?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-3 text-white">
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
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
            Start Your Professional Assessment
          </a>
          <p className="text-gray-600 mt-3 text-sm">
            Get your business valued by certified professionals in minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
}
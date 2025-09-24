"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "500+", label: "Businesses Sold" },
  { number: "60", label: "Day Average Close" },
  { number: "100%", label: "Confidential" },
  { number: "$0", label: "Upfront Fees" }
];

export function StatsBand() {
  return (
    <section className="py-16 bg-gray-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

// Simple icon components
const ClockIcon = () => (
  <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileTextIcon = () => (
  <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const stats = [
  { icon: ClockIcon, text: "60-day close", description: "Guaranteed timeline" },
  { icon: FileTextIcon, text: "Professional valuation", description: "Certified analysis" },
  { icon: ShieldIcon, text: "100% confidential", description: "Protected process" },
  { icon: UsersIcon, text: "Pre-vetted brokers", description: "Qualified professionals" },
];

export function ProofBand() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="rounded-2xl bg-surface-50/60 p-6 ring-1 ring-line/50"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl2 bg-brand/15">
                <stat.icon />
              </div>
              <h3 className="font-medium text-lg">{stat.text}</h3>
              <p className="mt-1 text-sm text-mute">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}




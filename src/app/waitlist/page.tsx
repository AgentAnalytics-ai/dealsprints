"use client";

import { useState } from 'react';
import { Sparkles, CheckCircle, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    interest: 'network', // 'network', 'feed-tip', 'sponsor'
    plan: 'verified', // 'free', 'verified', 'pro'
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          goal: formData.interest === 'network' ? 'Join OKC Network' : formData.interest === 'sponsor' ? 'Become a Sponsor' : 'Submit Feed Tip',
          timeline: 'Immediately (within 3 months)',
          industry: formData.category,
          revenue: 'Not specified',
          employees: 'Not specified',
          years: 'Not specified',
          location: 'Oklahoma City, OK',
          growth: 'Not specified',
          customers: 'Not specified',
          management: 'Not specified',
          advantage: 'Not specified',
          bestTime: 'Any time',
          title: 'Owner/Founder',
          reason: `OKC Pulse Waitlist - ${formData.interest}`,
          marketInsights: {},
          leadScore: { total: 75, category: 'OKC Pulse', value: 'Network Member' },
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('There was an error submitting your request. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're on the list!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thanks for joining the OKC Pulse waitlist. We'll be in touch soon with next steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/okc/feed"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Browse the Feed
              </Link>
              <Link
                href="/okc/members"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                View Members
              </Link>
            </div>
          </div>
        </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-brand" />
            <span className="inline-block px-3 py-1 bg-brand/10 text-brand text-sm font-semibold rounded-full">
              Limited Spots Available
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join the DealSprints OKC Waitlist
          </h1>
          <p className="text-xl text-gray-600">
            Be among the first to join Oklahoma City's network of verified business owners, 
            get featured in the feed, and connect with your local community.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="space-y-6">
            {/* Interest Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                I'm interested in:
              </label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="network">Joining the OKC Network</option>
                <option value="feed-tip">Submitting a Feed Tip</option>
                <option value="sponsor">Becoming a Sponsor</option>
              </select>
            </div>

            {formData.interest === 'network' && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Membership Plan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'free', label: 'Free', price: '$0', features: 'Basic listing' },
                    { value: 'verified', label: 'Verified', price: '$9/mo', features: 'Badge + profile' },
                    { value: 'pro', label: 'Pro', price: '$29/mo', features: 'Featured + events' },
                  ].map((plan) => (
                    <label
                      key={plan.value}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        formData.plan === plan.value
                          ? 'border-brand bg-brand/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.value}
                        checked={formData.plan === plan.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="font-semibold text-gray-900 mb-1">{plan.label}</div>
                      <div className="text-sm text-gray-600 mb-2">{plan.price}</div>
                      <div className="text-xs text-gray-500">{plan.features}</div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="(405) 555-0123"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
                Industry/Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Select a category</option>
                <option value="Wellness & Healthcare">Wellness & Healthcare</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Retail & Food">Retail & Food</option>
                <option value="Technology">Technology</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Construction & Trades">Construction & Trades</option>
                <option value="Marketing & Media">Marketing & Media</option>
                <option value="Arts & Entertainment">Arts & Entertainment</option>
                <option value="Wellness & Fitness">Wellness & Fitness</option>
                <option value="Professional Services">Professional Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-2">
                Message (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="Tell us more about your business or what you're looking for..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Join the Waitlist
                </>
              )}
            </button>

            <p className="text-sm text-gray-600 text-center">
              We'll review your submission and be in touch within 24-48 hours.
            </p>
          </div>
        </form>
      </div>
    </main>
    <Footer />
    </>
  );
}


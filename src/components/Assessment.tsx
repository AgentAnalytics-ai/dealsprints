"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target, Building2, BarChart3, Clock, MapPin, Briefcase, Award } from "lucide-react";

// Enhanced type definitions
interface FormData {
  [key: string]: string;
}

interface MarketInsights {
  industry?: {
    totalCompanies: number;
    avgRevenue: string;
    growthRate: string;
    marketSize: string;
    premium: string;
    avgMultiplier: string;
  };
  revenue?: {
    percentile: number;
    description: string;
    valuation: string;
    tier: string;
  };
  growth?: {
    trajectory: string;
    marketPosition: string;
    opportunity: string;
  };
  leadScore?: {
    total: number;
    category: string;
    value: string;
  };
}

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

interface FormStep {
  title: string;
  fields: FormField[];
}

export function Assessment() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [marketInsights, setMarketInsights] = useState<MarketInsights>({});

  // Enhanced form steps with expert questions
  const steps: FormStep[] = [
    {
      title: "Business Overview",
      fields: [
        { name: "company", label: "Company Name", type: "text", required: true },
        { name: "industry", label: "Industry", type: "select", options: [
          "Technology", "Manufacturing", "Healthcare", "Professional Services", 
          "Retail/E-commerce", "Construction", "Food & Beverage", "Transportation",
          "Real Estate", "Financial Services", "Education", "Media/Entertainment",
          "Energy/Utilities", "Agriculture", "Other"
        ]},
        { name: "revenue", label: "Annual Revenue", type: "select", options: [
          "Under $500K", "$500K-$1M", "$1M-$5M", "$5M-$20M", "$20M+"
        ]},
        { name: "employees", label: "Number of Employees", type: "select", options: [
          "1-5", "6-20", "21-50", "51-100", "100+"
        ]},
        { name: "years", label: "Years in Business", type: "select", options: [
          "Less than 2 years", "2-5 years", "5-10 years", "10-20 years", "20+ years"
        ]},
        { name: "location", label: "Business Location", type: "text", required: true }
      ]
    },
    {
      title: "Transaction Intent",
      fields: [
        { name: "goal", label: "What is your primary goal?", type: "select", options: [
          "Sell my business", "Buy a business", "Seek investment/partnership", "Just exploring options"
        ]},
        { name: "timeline", label: "What's your timeline?", type: "select", options: [
          "Immediately (within 3 months)", "3-6 months", "6-12 months", "1-2 years", "Just exploring"
        ]},
        { name: "reason", label: "Reason for transaction", type: "select", options: [
          "Retirement", "Growth capital needed", "New business opportunity", "Health/family reasons", 
          "Market conditions", "Partnership issues", "Other"
        ]}
      ]
    },
    {
      title: "Business Details",
      fields: [
        { name: "growth", label: "Revenue growth (last 3 years)", type: "select", options: [
          "Declining", "Flat (0-5%)", "Moderate (5-15%)", "Strong (15-30%)", "Exceptional (30%+)"
        ]},
        { name: "customers", label: "Customer concentration", type: "select", options: [
          "Very concentrated (top 3 = 80%+)", "Somewhat concentrated (top 3 = 50-80%)", 
          "Diversified (top 3 = 20-50%)", "Very diversified (top 3 = <20%)"
        ]},
        { name: "management", label: "Owner involvement level", type: "select", options: [
          "Owner does everything", "Owner manages key functions", "Owner oversees operations", "Owner is hands-off"
        ]},
        { name: "advantage", label: "Competitive advantage", type: "select", options: [
          "Technology/IP", "Customer relationships", "Operational efficiency", "Market position", 
          "Brand recognition", "Regulatory barriers", "Other"
        ]}
      ]
    },
    {
      title: "Contact Information", 
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "title", label: "Title/Position", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "bestTime", label: "Best time to contact", type: "select", options: [
          "Morning (9AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-8PM)", "Weekends", "Any time"
        ]}
      ]
    }
  ];

  // Enhanced market insights generation
  const generateMarketInsights = (data: FormData): MarketInsights => {
    const insights: MarketInsights = {};
    
    // Industry insights
    if (data.industry) {
      const industryData: any = {
        Technology: { totalCompanies: 2847, avgRevenue: "$2.3M", growthRate: "12.5%", marketSize: "$847B", premium: "High-growth sector", avgMultiplier: "8-12x" },
        Manufacturing: { totalCompanies: 1923, avgRevenue: "$4.1M", growthRate: "8.2%", marketSize: "$2.1T", premium: "Stable, capital-intensive", avgMultiplier: "4-6x" },
        Healthcare: { totalCompanies: 1567, avgRevenue: "$3.7M", growthRate: "9.1%", marketSize: "$4.1T", premium: "Regulated, high-value", avgMultiplier: "6-10x" },
        "Professional Services": { totalCompanies: 4521, avgRevenue: "$1.8M", growthRate: "6.8%", marketSize: "$1.3T", premium: "Service-driven economy", avgMultiplier: "3-5x" },
        "Retail/E-commerce": { totalCompanies: 3245, avgRevenue: "$2.9M", growthRate: "4.3%", marketSize: "$5.2T", premium: "Consumer-focused", avgMultiplier: "2-4x" }
      };
      insights.industry = industryData[data.industry] || industryData["Professional Services"];
    }
    
    // Revenue insights
    if (data.revenue) {
      const revenueRanks: any = {
        "Under $500K": { percentile: 25, description: "Early stage", valuation: "$250K - $1M", tier: "Startup" },
        "$500K-$1M": { percentile: 40, description: "Emerging business", valuation: "$1M - $2M", tier: "Growth Stage" },
        "$1M-$5M": { percentile: 65, description: "Established business", valuation: "$2M - $8M", tier: "Expansion Phase" },
        "$5M-$20M": { percentile: 85, description: "Market leader", valuation: "$8M - $25M", tier: "Mature Company" },
        "$20M+": { percentile: 95, description: "Industry powerhouse", valuation: "$25M+", tier: "Enterprise Level" }
      };
      insights.revenue = revenueRanks[data.revenue];
    }

    // Growth insights
    if (data.growth) {
      const growthData: any = {
        "Declining": { trajectory: "Downward trend", marketPosition: "Challenging", opportunity: "Turnaround potential" },
        "Flat (0-5%)": { trajectory: "Stable", marketPosition: "Maintaining", opportunity: "Growth acceleration" },
        "Moderate (5-15%)": { trajectory: "Steady growth", marketPosition: "Competitive", opportunity: "Market expansion" },
        "Strong (15-30%)": { trajectory: "High growth", marketPosition: "Leading", opportunity: "Scale operations" },
        "Exceptional (30%+)": { trajectory: "Explosive growth", marketPosition: "Dominant", opportunity: "Premium valuation" }
      };
      insights.growth = growthData[data.growth];
    }

    // Lead scoring
    let score = 0;
    let category = "Standard";
    let value = "$500-$1,000";

    // Revenue scoring
    if (data.revenue === "$20M+") score += 100;
    else if (data.revenue === "$5M-$20M") score += 75;
    else if (data.revenue === "$1M-$5M") score += 50;
    else if (data.revenue === "$500K-$1M") score += 25;

    // Timeline scoring
    if (data.timeline === "Immediately (within 3 months)") score += 40;
    else if (data.timeline === "3-6 months") score += 30;
    else if (data.timeline === "6-12 months") score += 20;

    // Growth scoring
    if (data.growth === "Exceptional (30%+)") score += 30;
    else if (data.growth === "Strong (15-30%)") score += 20;
    else if (data.growth === "Moderate (5-15%)") score += 10;

    // Industry scoring
    if (data.industry === "Technology") score += 25;
    else if (data.industry === "Healthcare") score += 20;
    else if (data.industry === "Manufacturing") score += 15;

    // Determine category and value
    if (score >= 90) { category = "Premium"; value = "$2,000-$5,000"; }
    else if (score >= 70) { category = "High-Value"; value = "$1,000-$2,000"; }
    else if (score >= 50) { category = "Quality"; value = "$500-$1,000"; }
    else if (score >= 30) { category = "Standard"; value = "$200-$500"; }

    insights.leadScore = { total: score, category, value };
    
    return insights;
  };

  useEffect(() => {
    const insights = generateMarketInsights(formData);
    setMarketInsights(insights);
  }, [formData]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate final lead score
    const insights = generateMarketInsights(formData);
    
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          marketInsights: insights,
          leadScore: insights.leadScore,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert('Thank you! Your assessment has been submitted.');
        // Reset form or redirect
        setStep(0);
        setFormData({});
      } else {
        alert('There was an error submitting your assessment. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your assessment. Please try again.');
    }
  };

  return (
    <section id="assessment" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-brand to-deal text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Limited spots available this month
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">Get Your Business Assessment</h2>
          <p className="text-xl text-gray-300">Professional analysis in minutes</p>
          <p className="text-sm text-gray-400 mt-2">Normally $5,000 - Free for qualified business owners</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
          {/* Assessment Form */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{steps[step].title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">Step {step + 1} of {steps.length}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {steps[step].fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-800">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select 
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none text-gray-900"
                          required={field.required}
                        >
                          <option value="" className="text-gray-500">Select {field.label}</option>
                          {field.options?.map((option, i) => (
                            <option key={i} value={option} className="text-gray-900">{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input 
                          name={field.name}
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-500"
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
                  >
                    Previous
                  </button>
                  
                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Enhanced Live Market Intelligence */}
          <div className="xl:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3 text-white">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                Live Market Intelligence
              </h3>
              
              <div className="space-y-6">
                {/* Industry Insights */}
                {marketInsights.industry && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/20"
                  >
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                      <Building2 className="h-5 w-5 text-blue-400" />
                      Industry Position
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Sector:</span>
                        <span className="font-semibold text-blue-400">{formData.industry}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Market size:</span>
                        <span className="font-semibold text-white">{marketInsights.industry.marketSize}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Companies:</span>
                        <span className="font-semibold text-white">{marketInsights.industry.totalCompanies.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Growth rate:</span>
                        <span className="font-semibold text-green-400">{marketInsights.industry.growthRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Avg. multiplier:</span>
                        <span className="font-semibold text-yellow-400">{marketInsights.industry.avgMultiplier}</span>
                      </div>
                      <div className="bg-blue-500/20 rounded-lg p-3 mt-3">
                        <p className="text-xs text-blue-300 font-medium">{marketInsights.industry.premium}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Revenue Insights */}
                {marketInsights.revenue && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-green-900/30 rounded-xl p-4 border border-green-500/20"
                  >
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      Revenue Ranking
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Market position:</span>
                        <span className="font-semibold text-green-400">Top {100 - marketInsights.revenue.percentile}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${marketInsights.revenue.percentile}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Classification:</span>
                        <span className="font-semibold text-white">{marketInsights.revenue.tier}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Est. value:</span>
                        <span className="font-semibold text-green-400">{marketInsights.revenue.valuation}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Growth Insights */}
                {marketInsights.growth && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-purple-900/30 rounded-xl p-4 border border-purple-500/20"
                  >
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      Growth Analysis
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Trajectory:</span>
                        <span className="font-semibold text-purple-400">{marketInsights.growth.trajectory}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Market position:</span>
                        <span className="font-semibold text-white">{marketInsights.growth.marketPosition}</span>
                      </div>
                      <div className="bg-purple-500/20 rounded-lg p-3 mt-3">
                        <p className="text-xs text-purple-300 font-medium">{marketInsights.growth.opportunity}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Lead Score */}
                {marketInsights.leadScore && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-500/20"
                  >
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-white">
                      <Award className="h-5 w-5 text-yellow-400" />
                      Lead Quality Score
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Score:</span>
                        <span className="font-semibold text-yellow-400">{marketInsights.leadScore.total}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                          style={{ width: `${marketInsights.leadScore.total}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Category:</span>
                        <span className="font-semibold text-white">{marketInsights.leadScore.category}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Est. value:</span>
                        <span className="font-semibold text-yellow-400">{marketInsights.leadScore.value}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Placeholder when no data */}
                {Object.keys(marketInsights).length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Complete the form to unlock real-time market intelligence</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
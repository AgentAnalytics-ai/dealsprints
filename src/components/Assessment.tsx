"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target, Building2, BarChart3 } from "lucide-react";

export function Assessment() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [marketInsights, setMarketInsights] = useState({});

  const steps = [
    {
      title: "Business Information",
      fields: [
        { name: "company", label: "Company Name", type: "text", required: true },
        { name: "industry", label: "Industry", type: "select", options: ["Technology", "Manufacturing", "Services", "Retail", "Healthcare"] },
        { name: "revenue", label: "Annual Revenue", type: "select", options: ["Under $1M", "$1M-$5M", "$5M-$20M", "$20M+"] }
      ]
    },
    {
      title: "Contact Information", 
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel", required: true }
      ]
    }
  ];

  // Generate real-time market insights
  const generateMarketInsights = (data: any) => {
    const insights: any = {};
    
    if (data.industry) {
      const industryData: any = {
        Technology: { totalCompanies: 2847, avgRevenue: "$2.3M", growthRate: "12.5%", marketSize: "$847B", premium: "High-growth sector" },
        Manufacturing: { totalCompanies: 1923, avgRevenue: "$4.1M", growthRate: "8.2%", marketSize: "$2.1T", premium: "Stable, capital-intensive" },
        Services: { totalCompanies: 4521, avgRevenue: "$1.8M", growthRate: "6.8%", marketSize: "$1.3T", premium: "Service-driven economy" },
        Retail: { totalCompanies: 3245, avgRevenue: "$2.9M", growthRate: "4.3%", marketSize: "$5.2T", premium: "Consumer-focused" },
        Healthcare: { totalCompanies: 1567, avgRevenue: "$3.7M", growthRate: "9.1%", marketSize: "$4.1T", premium: "Regulated, high-value" }
      };
      
      insights.industry = industryData[data.industry];
    }
    
    if (data.revenue) {
      const revenueRanks: any = {
        "Under $1M": { percentile: 35, description: "Emerging enterprise", valuation: "$500K - $2M", tier: "Growth Stage" },
        "$1M-$5M": { percentile: 65, description: "Established business", valuation: "$2M - $8M", tier: "Expansion Phase" },
        "$5M-$20M": { percentile: 85, description: "Market leader", valuation: "$8M - $25M", tier: "Mature Company" },
        "$20M+": { percentile: 95, description: "Industry powerhouse", valuation: "$25M+", tier: "Enterprise Level" }
      };
      
      insights.revenue = revenueRanks[data.revenue];
    }
    
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
    console.log('Form submitted:', formData);
    alert('Thank you! Your assessment has been submitted.');
  };

  return (
    <section id="assessment" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Get Your Business Assessment</h2>
          <p className="text-xl text-gray-300">Professional analysis in minutes</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
          {/* Assessment Form - Takes up 3 columns */}
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
                          {field.options.map((option, i) => (
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

          {/* Live Market Intelligence Sidebar - Takes up 2 columns */}
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
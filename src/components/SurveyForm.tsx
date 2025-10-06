/**
 * DealSprints Enhanced Survey Form
 * 2026 AI-Powered Business Assessment Integration
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  Mail,
  Phone,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Star,
  Target,
  Briefcase
} from 'lucide-react';

interface SurveyData {
  business_name: string;
  industry: string;
  location: string;
  years_in_business: number;
  annual_revenue: string;
  employee_count: string;
  business_type: 'sole_proprietorship' | 'llc' | 'corporation' | 'partnership' | 'franchise';
  reason_for_selling: string;
  timeline: string;
  key_assets: string[];
  challenges: string[];
  growth_opportunities: string[];
  contact_email: string;
  contact_phone: string;
  additional_info: string;
}

export default function SurveyForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SurveyData>({
    business_name: '',
    industry: '',
    location: '',
    years_in_business: 0,
    annual_revenue: '',
    employee_count: '',
    business_type: 'llc',
    reason_for_selling: '',
    timeline: '',
    key_assets: [],
    challenges: [],
    growth_opportunities: [],
    contact_email: '',
    contact_phone: '',
    additional_info: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const steps = [
    { id: 'business-info', title: 'Business Information', icon: Building },
    { id: 'financial-info', title: 'Financial Details', icon: DollarSign },
    { id: 'operational-info', title: 'Operations & Assets', icon: Briefcase },
    { id: 'selling-info', title: 'Selling Details', icon: Target },
    { id: 'contact-info', title: 'Contact Information', icon: Mail }
  ];

  const industries = [
    'Restaurant & Food Service',
    'Retail & E-commerce',
    'Professional Services',
    'Healthcare & Medical',
    'Technology & Software',
    'Manufacturing',
    'Construction & Real Estate',
    'Automotive',
    'Beauty & Wellness',
    'Education & Training',
    'Financial Services',
    'Other'
  ];

  const businessTypes = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'llc', label: 'LLC' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'franchise', label: 'Franchise' }
  ];

  const revenueRanges = [
    '$0 - $50,000',
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1,000,000',
    '$1,000,000+'
  ];

  const employeeCounts = [
    '1 (Just me)',
    '2-5 employees',
    '6-10 employees',
    '11-25 employees',
    '26-50 employees',
    '50+ employees'
  ];

  const timelines = [
    'Immediately (0-3 months)',
    'Short term (3-6 months)',
    'Medium term (6-12 months)',
    'Long term (1-2 years)',
    'Just exploring options'
  ];

  const reasonsForSelling = [
    'Retirement',
    'Health reasons',
    'Want to pursue other opportunities',
    'Business has grown beyond capacity',
    'Market conditions',
    'Partnership dissolution',
    'Relocation',
    'Other personal reasons'
  ];

  const assetOptions = [
    'Real estate/property',
    'Equipment & machinery',
    'Inventory',
    'Intellectual property',
    'Customer database',
    'Brand & reputation',
    'Licenses & permits',
    'Technology systems',
    'Staff & management team',
    'Supplier relationships'
  ];

  const challengeOptions = [
    'Competition',
    'Economic conditions',
    'Staffing issues',
    'Technology needs',
    'Marketing & customer acquisition',
    'Cash flow',
    'Regulatory compliance',
    'Supply chain issues',
    'Location challenges',
    'Growth capital'
  ];

  const opportunityOptions = [
    'Market expansion',
    'New product/service lines',
    'Technology upgrades',
    'Digital transformation',
    'Franchise opportunities',
    'Acquisition opportunities',
    'Partnership potential',
    'E-commerce growth',
    'International expansion',
    'Operational efficiency'
  ];

  const handleInputChange = (field: keyof SurveyData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'key_assets' | 'challenges' | 'growth_opportunities', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Assessment generated:', result);
        setSubmissionStatus('success');
      } else {
        const errorData = await response.json();
        console.error('Submission failed:', errorData);
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Business Information
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (City, State) *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="e.g., Oklahoma City, OK"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business *
                </label>
                <input
                  type="number"
                  value={formData.years_in_business}
                  onChange={(e) => handleInputChange('years_in_business', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  value={formData.business_type}
                  onChange={(e) => handleInputChange('business_type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  {businessTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 1: // Financial Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue *
              </label>
              <select
                value={formData.annual_revenue}
                onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select revenue range</option>
                {revenueRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Employees *
              </label>
              <select
                value={formData.employee_count}
                onChange={(e) => handleInputChange('employee_count', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select employee count</option>
                {employeeCounts.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2: // Operations & Assets
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Assets (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assetOptions.map(asset => (
                  <label key={asset} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.key_assets.includes(asset)}
                      onChange={() => handleArrayChange('key_assets', asset)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{asset}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Challenges (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {challengeOptions.map(challenge => (
                  <label key={challenge} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.challenges.includes(challenge)}
                      onChange={() => handleArrayChange('challenges', challenge)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{challenge}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Growth Opportunities (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {opportunityOptions.map(opportunity => (
                  <label key={opportunity} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.growth_opportunities.includes(opportunity)}
                      onChange={() => handleArrayChange('growth_opportunities', opportunity)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opportunity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Selling Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Selling *
              </label>
              <select
                value={formData.reason_for_selling}
                onChange={(e) => handleInputChange('reason_for_selling', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select reason for selling</option>
                {reasonsForSelling.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeline for Sale *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              >
                <option value="">Select timeline</option>
                {timelines.map(timeline => (
                  <option key={timeline} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                value={formData.additional_info}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Tell us anything else that might be relevant for your business assessment..."
              />
            </div>
          </div>
        );

      case 4: // Contact Information
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                  <p className="text-sm text-blue-800">
                    Our AI will analyze your business data and generate a comprehensive assessment including market analysis, valuation estimates, and strategic recommendations. You'll receive your personalized report within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submissionStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-8"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-900 mb-2">Assessment Request Submitted!</h2>
          <p className="text-green-800 mb-6">
            Thank you for your submission. Our AI is analyzing your business data and will generate a comprehensive assessment. You'll receive your personalized report within 24 hours.
          </p>
          <div className="space-y-2 text-sm text-green-700">
            <p>✓ Business analysis in progress</p>
            <p>✓ Market research being conducted</p>
            <p>✓ Valuation calculations underway</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (submissionStatus === 'error') {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-8"
        >
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-900 mb-2">Submission Failed</h2>
          <p className="text-red-900 mb-6">
            There was an error processing your assessment request. Please try again or contact support.
          </p>
          <button
            onClick={() => setSubmissionStatus('idle')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Business Assessment Request</h1>
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'bg-blue-600 border-blue-600 text-white' :
                  isCompleted ? 'bg-green-600 border-green-600 text-white' :
                  'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-gray-900">{steps[currentStep].title}</h2>
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-white rounded-lg shadow-sm border p-8 mb-6"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            currentStep === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Next
            <TrendingUp className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Generating Assessment...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Assessment Request
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

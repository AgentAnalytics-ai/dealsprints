/**
 * DealSprints Business Intelligence Report Component
 * 2025-2026 Architecture: Lightweight, SEO-Optimized, Real-time
 */

'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  MapPin, 
  Star, 
  Globe, 
  Users, 
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface BusinessIntelligenceReportProps {
  placeId: string;
  businessName?: string;
  initialData?: any;
}

export function BusinessIntelligenceReport({ 
  placeId, 
  businessName, 
  initialData 
}: BusinessIntelligenceReportProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/business/analyze',
    body: { placeId, stream: true },
    onFinish: () => {
      setAnalysisComplete(true);
      setIsStreaming(false);
    },
    onError: (error) => {
      console.error('Analysis error:', error);
      setIsStreaming(false);
    }
  });

  const analysisSteps = [
    { name: 'Collecting Data', icon: Globe, description: 'Gathering public business information' },
    { name: 'AI Analysis', icon: TrendingUp, description: 'Generating business intelligence' },
    { name: 'Market Research', icon: MapPin, description: 'Analyzing competitive landscape' },
    { name: 'Valuation Estimate', icon: DollarSign, description: 'Calculating business value' },
    { name: 'Actionable Insights', icon: CheckCircle, description: 'Creating next steps' }
  ];

  const startAnalysis = async () => {
    setIsStreaming(true);
    setCurrentStep(0);
    
    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    handleSubmit(new Event('submit') as any);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Business Intelligence Report
        </h1>
        {businessName && (
          <p className="text-lg text-gray-600">{businessName}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-500">
            Powered by legal, public data sources only
          </span>
        </div>
      </div>

      {/* Analysis Controls */}
      {!isStreaming && !analysisComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Generate Comprehensive Business Analysis
              </h3>
              <p className="text-gray-600 mb-4">
                Get AI-powered insights on business health, market position, and valuation estimates using only legally compliant public data.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Legal Compliance
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  <Clock className="w-3 h-3" />
                  ~30 seconds
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  AI-Powered
                </span>
              </div>
            </div>
            <button
              onClick={startAnalysis}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Analysis
            </button>
          </div>
        </motion.div>
      )}

      {/* Analysis Progress */}
      <AnimatePresence>
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Analyzing Business Data...
              </h3>
              <div className="space-y-4">
                {analysisSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  
                  return (
                    <motion.div
                      key={step.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-100 border border-blue-200' : 
                        isCompleted ? 'bg-green-50' : 'bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-500 text-white animate-pulse' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          isActive ? 'text-blue-900' : 
                          isCompleted ? 'text-green-900' : 
                          'text-gray-600'
                        }`}>
                          {step.name}
                        </h4>
                        <p className={`text-sm ${
                          isActive ? 'text-blue-700' : 
                          isCompleted ? 'text-green-700' : 
                          'text-gray-500'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisComplete && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Mock analysis results - in production this would come from the API */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Health Score</h3>
                    <p className="text-sm text-gray-600">Overall business health</p>
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(78)}`}>
                  78
                </div>
                <p className="text-sm text-gray-600">
                  {getScoreLabel(78)} - Strong customer satisfaction and digital presence
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Estimated Value</h3>
                    <p className="text-sm text-gray-600">Non-binding estimate</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  $150K - $275K
                </div>
                <p className="text-sm text-gray-600">
                  Based on revenue multiples and market comparables
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Market Position</h3>
                    <p className="text-sm text-gray-600">Competitive analysis</p>
                  </div>
                </div>
                <div className="text-lg font-semibold text-purple-600 mb-2">
                  Strong
                </div>
                <p className="text-sm text-gray-600">
                  Above-average ratings and customer engagement
                </p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Business Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
                      <p className="text-sm text-gray-600">4.2/5 star rating with consistent recent reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Digital Presence</h4>
                      <p className="text-sm text-gray-600">Active website and social media engagement</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Growth Opportunity</h4>
                      <p className="text-sm text-gray-600">Online presence could be expanded further</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Market Position</h4>
                      <p className="text-sm text-gray-600">Strong competitive position in local market</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Sources & Legal Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Google Places API</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Public Website Analysis</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">Social Media APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">News & Press Mentions</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                All data collected from legally compliant, publicly available sources only. 
                No private information or proprietary data is accessed or stored.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * DealSprints Assessment Dashboard
 * 2026 AI-Powered Business Intelligence Management
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Download, 
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Building,
  Users,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface AssessmentRecord {
  id: string;
  survey_data: {
    business_name: string;
    industry: string;
    location: string;
    annual_revenue: string;
    contact_email: string;
    contact_phone: string;
    timeline: string;
    reason_for_selling: string;
  };
  assessment: {
    executive_summary: {
      valuation_range: string;
      key_recommendations: string[];
    };
    valuation_estimate: {
      estimated_value_range: {
        realistic: number;
      };
      confidence_level: string;
    };
    financial_assessment: {
      financial_health_score: number;
    };
  };
  email_content: string;
  generated_at: string;
  processing_time: number;
  status: 'pending' | 'reviewed' | 'sent';
}

export default function AssessmentDashboard() {
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'sent'>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - in production, this would come from your database
  useEffect(() => {
    const mockAssessments: AssessmentRecord[] = [
      {
        id: 'assessment_001',
        survey_data: {
          business_name: 'Downtown Coffee Co.',
          industry: 'Food & Beverage',
          location: 'Oklahoma City, OK',
          annual_revenue: '$150,000 - $200,000',
          contact_email: 'owner@downtowncoffee.com',
          contact_phone: '(405) 555-0123',
          timeline: '6-12 months',
          reason_for_selling: 'Retirement planning'
        },
        assessment: {
          executive_summary: {
            valuation_range: '$180,000 - $250,000',
            key_recommendations: ['Optimize inventory management', 'Improve digital presence', 'Document operational procedures']
          },
          valuation_estimate: {
            estimated_value_range: {
              realistic: 215000
            },
            confidence_level: 'high'
          },
          financial_assessment: {
            financial_health_score: 78
          }
        },
        email_content: 'Professional assessment email content...',
        generated_at: '2024-01-15T10:30:00Z',
        processing_time: 45000,
        status: 'pending'
      }
    ];

    setAssessments(mockAssessments);
    setFilteredAssessments(mockAssessments);
    setIsLoading(false);
  }, []);

  // Filter assessments
  useEffect(() => {
    let filtered = assessments;

    if (searchTerm) {
      filtered = filtered.filter(assessment => 
        assessment.survey_data.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.survey_data.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.survey_data.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assessment => assessment.status === statusFilter);
    }

    setFilteredAssessments(filtered);
  }, [assessments, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'reviewed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'sent': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'reviewed': return <Eye className="w-4 h-4" />;
      case 'sent': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Assessment Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage and review AI-generated business assessments
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search businesses, industries, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="reviewed">Reviewed</option>
                <option value="sent">Sent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAssessments.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedAssessment(assessment)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {assessment.survey_data.business_name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {assessment.survey_data.industry}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                      {getStatusIcon(assessment.status)}
                      {assessment.status}
                    </span>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{assessment.survey_data.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Est. Value: {assessment.assessment.valuation_estimate.estimated_value_range.realistic.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Health Score: {assessment.assessment.financial_assessment.financial_health_score}/100</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{new Date(assessment.generated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Confidence Level */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(assessment.assessment.valuation_estimate.confidence_level)}`}>
                      {assessment.assessment.valuation_estimate.confidence_level}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Mail className="w-4 h-4" />
                      <span>{assessment.survey_data.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{assessment.survey_data.contact_phone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssessment(assessment);
                      }}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle send action
                      }}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Assessment Detail Modal */}
      <AnimatePresence>
        {selectedAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAssessment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedAssessment.survey_data.business_name} - Assessment Review
                  </h2>
                  <button
                    onClick={() => setSelectedAssessment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Executive Summary */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Executive Summary</h3>
                    <p className="text-blue-800 mb-3">{selectedAssessment.assessment.executive_summary.valuation_range}</p>
                    <div className="space-y-1">
                      {selectedAssessment.assessment.executive_summary.key_recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-blue-700">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email Content Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Content</h3>
                    <div className="bg-white rounded border p-4 text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedAssessment.email_content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Assessment
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors">
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

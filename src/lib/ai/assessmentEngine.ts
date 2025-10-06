/**
 * DealSprints AI Assessment Engine
 * 2026 Revolutionary Business Intelligence System
 * 
 * This engine provides comprehensive business assessments based on survey data
 * using cutting-edge AI analysis and market intelligence.
 */

import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

// Survey response schema
export const SurveyResponseSchema = z.object({
  business_name: z.string(),
  industry: z.string(),
  location: z.string(),
  years_in_business: z.number(),
  annual_revenue: z.string(),
  employee_count: z.string(),
  business_type: z.enum(['sole_proprietorship', 'llc', 'corporation', 'partnership', 'franchise']),
  reason_for_selling: z.string(),
  timeline: z.string(),
  key_assets: z.array(z.string()),
  challenges: z.array(z.string()),
  growth_opportunities: z.array(z.string()),
  contact_email: z.string().email(),
  contact_phone: z.string(),
  additional_info: z.string().optional()
});

// Comprehensive assessment schema
export const BusinessAssessmentSchema = z.object({
  executive_summary: z.object({
    business_overview: z.string(),
    market_position: z.string(),
    valuation_range: z.string(),
    key_recommendations: z.array(z.string())
  }),
  
  market_analysis: z.object({
    industry_outlook: z.string(),
    local_market_conditions: z.string(),
    competitive_landscape: z.string(),
    market_opportunities: z.array(z.string()),
    market_challenges: z.array(z.string())
  }),
  
  financial_assessment: z.object({
    revenue_analysis: z.string(),
    profitability_indicators: z.string(),
    cash_flow_assessment: z.string(),
    asset_valuation: z.string(),
    financial_health_score: z.number().min(0).max(100)
  }),
  
  operational_analysis: z.object({
    business_model_strength: z.string(),
    operational_efficiency: z.string(),
    scalability_potential: z.string(),
    key_operational_risks: z.array(z.string()),
    operational_opportunities: z.array(z.string())
  }),
  
  valuation_estimate: z.object({
    estimated_value_range: z.object({
      conservative: z.number(),
      realistic: z.number(),
      optimistic: z.number()
    }),
    valuation_methodology: z.array(z.string()),
    key_value_drivers: z.array(z.string()),
    risk_factors: z.array(z.string()),
    confidence_level: z.enum(['high', 'medium', 'low'])
  }),
  
  buyer_profile: z.object({
    ideal_buyer_type: z.string(),
    buyer_motivations: z.array(z.string()),
    acquisition_timeline: z.string(),
    negotiation_leverage: z.string(),
    deal_structure_recommendations: z.array(z.string())
  }),
  
  action_plan: z.object({
    immediate_steps: z.array(z.string()),
    pre_sale_optimization: z.array(z.string()),
    marketing_strategy: z.array(z.string()),
    timeline_recommendations: z.array(z.string()),
    success_probability: z.string()
  }),
  
  market_comparables: z.object({
    similar_businesses_sold: z.array(z.object({
      business_type: z.string(),
      location: z.string(),
      sale_price: z.string(),
      sale_date: z.string(),
      key_factors: z.array(z.string())
    })),
    market_trends: z.array(z.string()),
    pricing_benchmarks: z.string()
  })
});

/**
 * Generate comprehensive business assessment from survey data
 */
export async function generateBusinessAssessment(surveyData: z.infer<typeof SurveyResponseSchema>) {
  const assessment = await generateObject({
    model: openai('gpt-4o'),
    schema: BusinessAssessmentSchema,
    messages: [
      {
        role: 'system',
        content: `You are DealSprints AI Assessment Engine - the most advanced business valuation and market intelligence system of 2026.

Your mission: Generate a comprehensive, actionable business assessment that provides maximum value to business owners looking to sell.

EXPERTISE AREAS:
- Business valuation using multiple methodologies
- Market analysis and competitive intelligence  
- Financial modeling and cash flow analysis
- Operational efficiency assessment
- Buyer psychology and market positioning
- Deal structuring and negotiation strategy

ANALYSIS FRAMEWORK:
1. Executive Summary - High-level overview with key insights
2. Market Analysis - Industry trends, local conditions, competitive landscape
3. Financial Assessment - Revenue analysis, profitability, cash flow, asset valuation
4. Operational Analysis - Business model strength, efficiency, scalability
5. Valuation Estimate - Multi-methodology approach with confidence levels
6. Buyer Profile - Ideal buyer identification and motivations
7. Action Plan - Strategic recommendations and timeline
8. Market Comparables - Similar transactions and market benchmarks

DELIVERABLES:
- Actionable insights that drive business decisions
- Data-driven recommendations with clear rationale
- Market intelligence that positions the business optimally
- Valuation methodology that builds confidence
- Strategic roadmap for successful sale

Focus on providing maximum value while maintaining professional standards and accuracy.`
      },
      {
        role: 'user',
        content: `Generate a comprehensive business assessment for:

Business Name: ${surveyData.business_name}
Industry: ${surveyData.industry}
Location: ${surveyData.location}
Years in Business: ${surveyData.years_in_business}
Annual Revenue: ${surveyData.annual_revenue}
Employee Count: ${surveyData.employee_count}
Business Type: ${surveyData.business_type}
Reason for Selling: ${surveyData.reason_for_selling}
Timeline: ${surveyData.timeline}
Key Assets: ${surveyData.key_assets.join(', ')}
Challenges: ${surveyData.challenges.join(', ')}
Growth Opportunities: ${surveyData.growth_opportunities.join(', ')}
Additional Info: ${surveyData.additional_info || 'None provided'}

Provide a comprehensive assessment that will help this business owner understand their market position, valuation, and optimal selling strategy.`
      }
    ]
  });

  return assessment.object;
}

/**
 * Generate personalized email content for assessment delivery
 */
export async function generateAssessmentEmail(
  assessment: z.infer<typeof BusinessAssessmentSchema>,
  surveyData: z.infer<typeof SurveyResponseSchema>
) {
  const emailContent = await generateText({
    model: openai('gpt-4o'),
    messages: [
      {
        role: 'system',
        content: `You are DealSprints Business Intelligence Expert writing a personalized email to deliver a comprehensive business assessment.

TONE: Professional, consultative, and value-focused
PURPOSE: Deliver assessment results while building trust and demonstrating expertise
STRUCTURE: Clear, actionable, and personalized

INCLUDE:
- Personalized greeting using business name
- Brief overview of assessment scope
- Key highlights from the assessment
- Clear next steps and recommendations
- Professional closing with contact information
- Call-to-action for next steps

LENGTH: Professional but concise (2-3 paragraphs)
STYLE: Consultative and expert-level`
      },
      {
        role: 'user',
        content: `Write a personalized email to deliver the business assessment for ${surveyData.business_name}.

Key Assessment Highlights:
- Valuation Range: ${assessment.valuation_estimate.estimated_value_range.realistic.toLocaleString()}
- Market Position: ${assessment.market_analysis.competitive_landscape}
- Financial Health Score: ${assessment.financial_assessment.financial_health_score}/100
- Top Recommendations: ${assessment.executive_summary.key_recommendations.slice(0, 3).join(', ')}

Write a professional email that delivers these results while building trust and encouraging next steps.`
      }
    ]
  });

  return emailContent.text;
}

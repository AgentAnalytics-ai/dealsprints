/**
 * DealSprints Assessment Generation API
 * 2026 AI-Powered Business Intelligence
 */

import { NextRequest } from 'next/server';
import { generateBusinessAssessment, generateAssessmentEmail, SurveyResponseSchema } from '@/lib/ai/assessmentEngine';
import { headers } from 'next/headers';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // 5 assessments per hour
const RATE_LIMIT_WINDOW = 3600000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    
    // Validate survey data
    const surveyData = SurveyResponseSchema.parse(body);

    // Log the assessment request
    console.log(`Assessment requested for: ${surveyData.business_name}, Email: ${surveyData.contact_email}, IP: ${ip}`);

    // Generate comprehensive assessment
    const startTime = Date.now();
    const assessment = await generateBusinessAssessment(surveyData);
    const emailContent = await generateAssessmentEmail(assessment, surveyData);
    const processingTime = Date.now() - startTime;

    // Create assessment record
    const assessmentRecord = {
      id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      survey_data: surveyData,
      assessment: assessment,
      email_content: emailContent,
      generated_at: new Date().toISOString(),
      processing_time: processingTime,
      ip_address: ip
    };

    // TODO: Save to database (Redis/PostgreSQL)
    // await saveAssessment(assessmentRecord);

    // Log success
    console.log(`Assessment generated successfully for ${surveyData.business_name} in ${processingTime}ms`);

    return Response.json({
      success: true,
      assessment_id: assessmentRecord.id,
      assessment: assessment,
      email_content: emailContent,
      processing_time: processingTime,
      generated_at: assessmentRecord.generated_at
    });

  } catch (error) {
    console.error('Assessment generation error:', error);
    
    return Response.json(
      { 
        error: 'Assessment generation failed. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

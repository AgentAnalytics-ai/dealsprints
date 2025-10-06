/**
 * DealSprints Assessment Generation API
 * 2026 AI-Powered Business Intelligence
 */

import { NextRequest } from 'next/server';
import { generateBusinessAssessment, generateAssessmentEmail, SurveyResponseSchema } from '@/lib/ai/assessmentEngine';
import { saveAssessment } from '@/lib/database/assessments';
import { Resend } from 'resend';
import { headers } from 'next/headers';

// Initialize Resend (same setup as lead route)
const resend = process.env.dealsprints_resend ? new Resend(process.env.dealsprints_resend) : null;

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
      ip_address: ip,
      status: 'pending' as const
    };

    // Save to database
    await saveAssessment(assessmentRecord);

    // Send email to admin (same as lead route)
    if (resend) {
      try {
        const subject = `NEW ASSESSMENT REQUEST: ${surveyData.business_name} - ${surveyData.industry}`;
        
        // Create detailed email content for admin
        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              NEW BUSINESS ASSESSMENT REQUEST
            </h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Assessment Details</h3>
              <p style="margin: 5px 0;"><strong>Business:</strong> ${surveyData.business_name}</p>
              <p style="margin: 5px 0;"><strong>Industry:</strong> ${surveyData.industry}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${surveyData.location}</p>
              <p style="margin: 5px 0;"><strong>Revenue:</strong> ${surveyData.annual_revenue}</p>
              <p style="margin: 5px 0;"><strong>Employees:</strong> ${surveyData.employee_count}</p>
              <p style="margin: 5px 0;"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Processing Time:</strong> ${processingTime}ms</p>
            </div>

            <h3 style="color: #1e40af;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${surveyData.contact_email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${surveyData.contact_phone}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Timeline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${surveyData.timeline}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Reason for Selling:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${surveyData.reason_for_selling}</td></tr>
            </table>

            <h3 style="color: #1e40af;">AI Assessment Summary</h3>
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Valuation Range:</strong> ${assessment.valuation_estimate.estimated_value_range.realistic.toLocaleString()}</p>
              <p><strong>Financial Health Score:</strong> ${assessment.financial_assessment.financial_health_score}/100</p>
              <p><strong>Confidence Level:</strong> ${assessment.valuation_estimate.confidence_level}</p>
            </div>

            <h3 style="color: #1e40af;">Key Recommendations</h3>
            <ul>
              ${assessment.executive_summary.key_recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>

            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h4 style="color: #166534; margin-top: 0;">Next Steps:</h4>
              <ul style="color: #166534;">
                <li>Review assessment in admin dashboard</li>
                <li>Send assessment email to ${surveyData.contact_email}</li>
                <li>Follow up within 24 hours</li>
                <li>Assessment ID: ${assessmentRecord.id}</li>
              </ul>
            </div>

            <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
              This assessment was generated automatically. Review the full details in your admin dashboard.
            </p>
          </div>
        `;

        const { data, error } = await resend.emails.send({
          from: 'DealSprints <noreply@agentanalyticsai.com>',
          to: [process.env.ADMIN_EMAIL || 'admin@dealsprints.com'],
          subject: subject,
          html: adminEmailContent,
        });

        if (error) {
          console.error('Resend error:', error);
        } else {
          console.log('Assessment notification email sent to admin');
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the assessment if email fails
      }
    }

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

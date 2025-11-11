/**
 * Contact Form API
 * Sends support/billing inquiries to admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.dealsprints_resend);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, type = 'support' } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email to admin
    await resend.emails.send({
      from: 'DealSprints OKC <noreply@dealsprints.com>',
      to: process.env.ADMIN_EMAIL || 'grant@agentanalyticsai.com',
      subject: `[${type.toUpperCase()}] ${subject || 'Contact Form Submission'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 10px;">
            DealSprints OKC - ${type === 'billing' ? 'Billing' : 'Support'} Inquiry
          </h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${email}</p>
            ${subject ? `<p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${subject}</p>` : ''}
            <p style="margin: 0;"><strong>Type:</strong> ${type}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Quick Reply:</strong> Reply directly to ${email} to respond to this inquiry.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}


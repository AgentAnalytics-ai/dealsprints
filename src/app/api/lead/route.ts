import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.dealsprints_resend ? new Resend(process.env.dealsprints_resend) : null;

export async function POST(request: Request) {
  try {
    const { 
      name, email, phone, title, company, industry, revenue, employees, years, location,
      goal, timeline, reason, growth, customers, management, advantage, bestTime,
      marketInsights, leadScore, timestamp 
    } = await request.json();

    // Check if Resend is available
    if (!resend) {
      console.error('dealsprints_resend API key not configured');
      return Response.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Determine lead category and priority
    const category = leadScore?.category || 'Standard';
    const priority = leadScore?.total >= 70 ? 'HIGH' : leadScore?.total >= 50 ? 'MEDIUM' : 'LOW';
    
    // Create subject line based on lead quality
    const subject = `${priority} PRIORITY ${category.toUpperCase()} LEAD: ${company} - ${industry} (Score: ${leadScore?.total}/100)`;

    // Create detailed email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          ${priority} PRIORITY LEAD - ${category.toUpperCase()} QUALITY
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Lead Score: ${leadScore?.total}/100</h3>
          <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
          <p style="margin: 5px 0;"><strong>Estimated Value:</strong> ${leadScore?.value}</p>
          <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>

        <h3 style="color: #1e40af;">Business Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${company}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Industry:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${industry}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Revenue:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${revenue}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Employees:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${employees}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Years in Business:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${years}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${location}</td></tr>
        </table>

        <h3 style="color: #1e40af;">Transaction Intent</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Primary Goal:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${goal}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Timeline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${timeline}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Reason:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${reason}</td></tr>
        </table>

        <h3 style="color: #1e40af;">Business Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Growth Rate:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${growth}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Customer Concentration:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${customers}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Management:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${management}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Competitive Advantage:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${advantage}</td></tr>
        </table>

        <h3 style="color: #1e40af;">Contact Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Title:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${title}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${phone}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Best Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${bestTime}</td></tr>
        </table>

        <h3 style="color: #1e40af;">Market Intelligence</h3>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <pre style="font-size: 12px; color: #1e40af;">${JSON.stringify(marketInsights, null, 2)}</pre>
        </div>

        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h4 style="color: #166534; margin-top: 0;">Next Steps:</h4>
          <ul style="color: #166534;">
            <li>Contact within 24 hours for ${priority} priority leads</li>
            <li>Reference lead score: ${leadScore?.total}/100</li>
            <li>Estimated lead value: ${leadScore?.value}</li>
            <li>Best contact time: ${bestTime}</li>
          </ul>
        </div>
      </div>
    `;

    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: 'DealSprints <noreply@agentanalyticsai.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@dealsprints.com'],
      subject: subject,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      data: { 
        company, industry, revenue, employees, name, email, phone, title,
        leadScore, category, priority, timestamp
      }
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return Response.json({ error: 'Lead submission failed' }, { status: 500 });
  }
}
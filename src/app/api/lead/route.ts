import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, industry, revenue, employees, title, marketInsights } = await request.json();
    
    // Check if Resend is available
    if (!resend) {
      console.error('Resend API key not configured');
      return Response.json({ error: 'Email service not configured' }, { status: 500 });
    }
    
    // Send email to admin
    const { data, error } = await resend.emails.send({
      from: 'DealSprints <noreply@dealsprints.com>',
      to: [process.env.ADMIN_EMAIL || 'admin@dealsprints.com'],
      subject: `New Lead: ${company} - ${industry}`,
      html: `
        <h2>New Business Lead</h2>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Revenue:</strong> ${revenue}</p>
        <p><strong>Employees:</strong> ${employees}</p>
        <p><strong>Contact:</strong> ${name} (${title})</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <h3>Market Insights:</h3>
        <pre>${JSON.stringify(marketInsights, null, 2)}</pre>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Lead submitted successfully',
      data: { company, industry, revenue, employees, name, email, phone, title }
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return Response.json({ error: 'Lead submission failed' }, { status: 500 });
  }
}
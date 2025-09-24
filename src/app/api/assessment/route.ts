export async function POST(request: Request) {
  try {
    const { company, industry, revenue, employees, name, email, phone, title, marketInsights } = await request.json();
    
    // Simple response without AI dependencies
    console.log('Assessment completed for:', { name, email, company });

    return Response.json({ 
      success: true, 
      message: 'Assessment received successfully',
      data: { company, industry, revenue, employees, name, email, phone, title }
    });
  } catch (error) {
    console.error('Assessment error:', error);
    return Response.json({ error: 'Assessment failed' }, { status: 500 });
  }
}

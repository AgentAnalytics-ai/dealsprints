/**
 * DealSprints Assessment Preview API
 * Returns fast, lightweight live insights from partial survey data
 */

import { NextRequest } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const PreviewInputSchema = z.object({
  business_name: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  annual_revenue: z.string().optional(),
  employee_count: z.string().optional(),
});

const LiveInsightSchema = z.object({
  headline: z.string(),
  summary: z.string(),
  quick_score: z.number().min(0).max(100),
  recommendations: z.array(z.string()).max(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = PreviewInputSchema.parse(body);

    // Short-circuit if nothing meaningful provided
    if (!input.industry && !input.annual_revenue && !input.location) {
      return Response.json({
        insight: {
          headline: 'Provide a few details to see live insights',
          summary: 'Select an industry, revenue range, and location to preview market context and suggested actions.',
          quick_score: 50,
          recommendations: ['Choose an industry', 'Select revenue range', 'Enter city & state']
        }
      });
    }

    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: LiveInsightSchema,
      messages: [
        {
          role: 'system',
          content: `You are DealSprints Live Insight Assistant. Produce a concise preview based ONLY on the provided fields.
- Keep it fast and lightweight.
- No hallucinations; if missing data, say so.
- Max 1 sentence headline, 2 sentence summary, 3 short recommendations.
- quick_score is a rough 0-100 indicator (not a valuation).`
        },
        {
          role: 'user',
          content: `Generate a live insight for:\nIndustry: ${input.industry || 'Unknown'}\nRevenue: ${input.annual_revenue || 'Unknown'}\nEmployees: ${input.employee_count || 'Unknown'}\nLocation: ${input.location || 'Unknown'}\nBusiness: ${input.business_name || 'Unknown'}`
        }
      ]
    });

    return Response.json({ insight: result.object });
  } catch (error) {
    return Response.json({ error: 'Preview failed' }, { status: 400 });
  }
}

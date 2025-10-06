/**
 * DealSprints Assessments API
 * Fetch assessments for admin dashboard
 */

import { NextRequest } from 'next/server';
import { getAssessments, updateAssessmentStatus } from '@/lib/database/assessments';

export async function GET(req: NextRequest) {
  try {
    const assessments = await getAssessments();
    return Response.json({ assessments });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return Response.json(
      { error: 'Failed to fetch assessments' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return Response.json(
        { error: 'Missing id or status' },
        { status: 400 }
      );
    }

    await updateAssessmentStatus(id, status);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating assessment:', error);
    return Response.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  }
}

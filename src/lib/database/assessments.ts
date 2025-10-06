/**
 * DealSprints Assessment Database
 * Simple in-memory storage for now (can be upgraded to Redis/PostgreSQL later)
 */

interface AssessmentRecord {
  id: string;
  survey_data: any;
  assessment?: any;
  email_content?: string;
  generated_at: string;
  processing_time?: number;
  ip_address?: string;
  status: 'pending' | 'reviewed' | 'sent';
}

// In-memory storage (in production, use Redis or PostgreSQL)
let assessments: AssessmentRecord[] = [];

export async function saveAssessment(assessment: AssessmentRecord): Promise<void> {
  assessments.push(assessment);
  console.log(`Assessment saved: ${assessment.id} for ${assessment.survey_data.business_name}`);
}

export async function getAssessments(): Promise<AssessmentRecord[]> {
  return assessments.sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime());
}

export async function getAssessmentById(id: string): Promise<AssessmentRecord | null> {
  return assessments.find(a => a.id === id) || null;
}

export async function updateAssessmentStatus(id: string, status: AssessmentRecord['status']): Promise<void> {
  const assessment = assessments.find(a => a.id === id);
  if (assessment) {
    assessment.status = status;
  }
}

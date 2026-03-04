export type AssignmentType =
  | 'Extended Essay'
  | 'TOK Essay'
  | 'TOK Exhibition'
  | 'English IA'
  | 'History IA'
  | 'Science IA'
  | 'Economics IA'
  | 'Psychology IA'
  | 'Math IA'
  | 'Business Management IA'
  | 'Geography IA'
  | 'Global Politics IA'
  | 'Language B IA'
  | 'Visual Arts'
  | 'Computer Science IA'
  | 'Philosophy Essay'
  | 'Unknown';

export interface ExcludedItem {
  label: string;
  reason: string;
  content: string; // verbatim extracted text — used for local word counting
}

export interface AnalysisResult {
  assignmentType: AssignmentType;
  subject: string;
  wordLimit: number | null;
  excludedItems: ExcludedItem[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
}

export interface AnalyzeRequest {
  text: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  wordCount: number;    // originalCount - excludedCount, computed locally
  originalCount: number;
  excludedCount: number;
}

export interface ApiError {
  error: string;
}

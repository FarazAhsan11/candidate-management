export interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  institute: string;
  educationLevel: 'Bachelor' | 'Master' | 'PhD' | 'Other';
  graduationYear: number;
  currentPosition: string;
  currentCompany: string;
  experienceYears: number;
  noticePeriod: string;
  reasonToSwitch: string;
  currentSalary: number;
  expectedSalary: number;
  expectedSalaryPartTime?: number;
  appliedPosition: string;
  resumeFile?: string;
  resumeFileName?: string;
  resumeFileType?: 'pdf' | 'docx';
  loomLink?: string;
  hrRemarks?: string;
  interviewerRemarks?: string;
  status: 'New' | 'Screening' | 'Interviewed' | 'Pass' | 'Fail' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}

export type CandidateAction =
  | { type: 'SET_CANDIDATES'; payload: Candidate[] }
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'REMOVE_CANDIDATE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export interface CandidateState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
}

export type InputType = 'video' | 'photo' | 'voice' | 'document' | 'text';

export type IssueCategory = 
  | 'Road Infrastructure'
  | 'Water Supply'
  | 'Electricity & Streetlights'
  | 'Sanitation & Waste'
  | 'Healthcare'
  | 'Education'
  | 'Agriculture'
  | 'Public Safety'
  | 'Environment'
  | 'Other';

export type ReportStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'NEEDS_INFORMATION';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface LocationInfo {
  village: string;
  block: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  addressDetails?: string;
}

export interface TimelineEntry {
  id: string;
  status: ReportStatus;
  title: string;
  description: string;
  timestamp: string;
  updatedBy: string;
  role: string;
  department?: string;
}

export interface Report {
  id: string;
  citizenName: string;
  citizenPhone: string;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType?: InputType;
  inputType: InputType;
  category: IssueCategory;
  location: LocationInfo;
  language: string;
  aiClassification: {
    suggestedCategory: IssueCategory;
    confidence: number;
    extractedKeywords: string[];
    sentimentScore: string;
    isDuplicateDetected: boolean;
    duplicateOfId?: string;
  };
  priority: PriorityLevel;
  status: ReportStatus;
  assignedAuthority?: {
    department: string;
    officerName: string;
    contactPhone: string;
  };
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  upvotes: number;
  isChallenge: boolean;
}

export interface Challenge {
  id: string;
  reportId: string;
  title: string;
  category: IssueCategory;
  district: string;
  description: string;
  impactScore: string;
  affectedPopulationEstimate: number;
  solutionsSubmittedCount: number;
  createdAt: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'PILOT_TESTING' | 'SOLVED';
}

export interface SolutionSubmission {
  id: string;
  challengeId: string;
  contributorName: string;
  organizationType: 'University' | 'Student Team' | 'NGO' | 'Startup' | 'Research Body';
  organizationName: string;
  title: string;
  proposalSummary: string;
  estimatedCost: string;
  timelineDays: number;
  submittedAt: string;
  status: 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
}

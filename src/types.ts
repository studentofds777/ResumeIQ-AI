export type TargetRole = string;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  targetRole?: TargetRole | string;
  experienceLevel?: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Executive';
  industry?: string;
  createdAt: string;
}

export interface ScoreCategory {
  category: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface SkillGap {
  category: 'Technical' | 'Soft Skills' | 'Tools & Platforms' | 'Certifications';
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface SectionSuggestion {
  section: 'Contact & Header' | 'Summary' | 'Experience' | 'Education' | 'Skills' | 'Projects';
  status: 'excellent' | 'warning' | 'critical';
  title: string;
  currentText?: string;
  suggestedText?: string;
  issue: string;
  recommendation: string;
}

export interface JobMatchResult {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  roleFitSummary: string;
  tailoringAdvice: string[];
}

export interface AnalysisResult {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  atsScore: number;
  targetRole?: string;
  detectedTargetRole?: string;
  scoreBreakdown: {
    formatting: number;
    keywords: number;
    impactResults: number;
    actionVerbs: number;
    completeness: number;
  };
  keyStrengths: string[];
  criticalRedFlags: string[];
  skillGaps: SkillGap[];
  jobMatch?: JobMatchResult;
  suggestions: SectionSuggestion[];
  extractedText: string;
  jobDescriptionText?: string;
  fileName: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
  relevantCoursework?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export type ResumeTemplateId = 
  | 'modern'
  | 'executive'
  | 'minimal'
  | 'creative'
  | 'corporate'
  | 'elegant'
  | 'classic'
  | 'student';

export interface ResumeDesignSettings {
  fontFamily: 'inter' | 'serif' | 'playfair' | 'mono' | 'jakarta';
  fontSize: 'compact' | 'normal' | 'spacious';
  primaryColor: string;
  accentColor: string;
  sectionSpacing: 'compact' | 'standard' | 'relaxed';
  pageMargins: 'compact' | 'standard' | 'wide';
  layoutStyle: 'one-column' | 'two-column';
  showProfilePhoto: boolean;
  photoUrl?: string;
  headerStyle: 'left' | 'centered' | 'banner' | 'minimal';
  iconStyle: 'none' | 'minimal' | 'rounded-solid';
}

export interface ResumeData {
  id: string;
  userId: string;
  title: string;
  template: ResumeTemplateId;
  design?: ResumeDesignSettings;
  updatedAt: string;
  personalInfo: {
    fullName: string;
    jobTitle?: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github?: string;
    website?: string;
    summary: string;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: Project[];
  certifications: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Situational' | 'Resume Deep-Dive';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  interviewerIntent: string;
  sampleAnswer: string;
  keyTalkingPoints: string[];
}

export interface InterviewFeedback {
  score: number; // 0-100
  strengths: string[];
  improvements: string[];
  revisedAnswer: string;
}

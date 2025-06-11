import { supabase } from '@/integrations/supabase/client';

// Training and Development Types
export interface TrainingRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  trainingType: 'internal' | 'external' | 'online' | 'certification' | 'mandatory';
  trainingTitle: string;
  trainingProvider: string;
  description: string;
  category: 'compliance' | 'technical' | 'leadership' | 'banking-operations' | 'customer-service' | 'risk-management' | 'aml-cft' | 'ethics' | 'soft-skills' | 'professional-development';
  startDate: string;
  endDate: string;
  duration: number; // hours
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  completionDate?: string;
  score?: number;
  passingGrade: number;
  passed: boolean;
  certificateUrl?: string;
  cost: number;
  currency: string;
  trainer: string;
  location: string;
  attendanceRequired: boolean;
  isMandatory: boolean;
  expiryDate?: string;
  reminderSent: boolean;
  feedback?: TrainingFeedback;
  auditTrail: AuditEntry[];
}

export interface Certification {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  certificationName: string;
  issuingOrganization: string;
  certificationNumber: string;
  category: 'banking' | 'compliance' | 'risk-management' | 'aml-cft' | 'technical' | 'leadership' | 'professional';
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending-renewal' | 'revoked';
  documentUrl: string;
  verificationUrl?: string;
  isMandatory: boolean;
  renewalRequired: boolean;
  renewalNotificationDays: number;
  cost: number;
  currency: string;
  cpdPoints?: number; // Continuing Professional Development points
  notes?: string;
  auditTrail: AuditEntry[];
}

export interface MandatoryTraining {
  id: string;
  trainingName: string;
  description: string;
  category: 'compliance' | 'aml-cft' | 'ethics' | 'risk-management' | 'data-protection' | 'cyber-security' | 'banking-regulations';
  frequency: 'annual' | 'biannual' | 'quarterly' | 'monthly' | 'one-time' | 'on-boarding';
  targetAudience: 'all-staff' | 'management' | 'front-office' | 'back-office' | 'specific-roles';
  targetDepartments: string[];
  targetRoles: string[];
  duration: number; // hours
  format: 'classroom' | 'online' | 'blended' | 'self-study' | 'workshop';
  provider: string;
  passingGrade: number;
  maxAttempts: number;
  validityPeriod: number; // months
  deadlineFromHiring: number; // days
  reminderDays: number[];
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  lastUpdated: string;
  auditTrail: AuditEntry[];
}

export interface TrainingNeedsAssessment {
  id: string;
  department: string;
  assessmentYear: number;
  assessmentQuarter: number;
  conductedBy: string;
  assessmentDate: string;
  participantCount: number;
  skillGaps: SkillGap[];
  priorityTrainings: PriorityTraining[];
  budgetRequirement: number;
  currency: string;
  timeline: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  implementationPlan: ImplementationPlan[];
  progressTracking: ProgressTracking[];
  auditTrail: AuditEntry[];
}

export interface SkillGap {
  skillArea: string;
  currentLevel: number; // 1-5 scale
  requiredLevel: number; // 1-5 scale
  gapLevel: number; // calculated difference
  priority: 'critical' | 'high' | 'medium' | 'low';
  affectedEmployees: number;
  businessImpact: string;
  recommendedTraining: string[];
}

export interface PriorityTraining {
  trainingName: string;
  description: string;
  justification: string;
  targetAudience: string;
  estimatedCost: number;
  duration: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  expectedOutcome: string;
  successMetrics: string[];
}

export interface ImplementationPlan {
  phase: number;
  trainingName: string;
  startDate: string;
  endDate: string;
  targetParticipants: number;
  budget: number;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'cancelled';
  actualStartDate?: string;
  actualEndDate?: string;
  actualParticipants?: number;
  actualCost?: number;
}

export interface ProgressTracking {
  metric: string;
  baseline: number;
  target: number;
  current: number;
  measurementDate: string;
  notes: string;
}

export interface IndividualDevelopmentPlan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  reportingManager: string;
  planYear: number;
  planPeriod: 'annual' | 'quarterly' | 'half-yearly';
  careerGoals: CareerGoal[];
  developmentObjectives: DevelopmentObjective[];
  skillAssessment: SkillAssessment[];
  trainingPlan: TrainingPlanItem[];
  mentoringPlan?: MentoringPlan;
  rotationPlan?: RotationPlan[];
  performanceTargets: PerformanceTarget[];
  reviewSchedule: ReviewSchedule[];
  budget: number;
  currency: string;
  status: 'draft' | 'submitted' | 'manager-approved' | 'hr-approved' | 'active' | 'completed' | 'cancelled';
  createdDate: string;
  lastReviewDate?: string;
  nextReviewDate: string;
  completionRate: number;
  overallProgress: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'poor';
  auditTrail: AuditEntry[];
}

export interface CareerGoal {
  id: string;
  goalType: 'promotion' | 'lateral-move' | 'skill-development' | 'leadership' | 'specialization';
  description: string;
  targetPosition?: string;
  targetDepartment?: string;
  timeframe: string;
  requiredSkills: string[];
  requiredTraining: string[];
  requiredExperience: string[];
  milestones: Milestone[];
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'achieved' | 'modified' | 'cancelled';
}

export interface DevelopmentObjective {
  id: string;
  objective: string;
  description: string;
  category: 'technical' | 'leadership' | 'communication' | 'banking-knowledge' | 'compliance' | 'customer-service';
  successCriteria: string[];
  targetDate: string;
  progress: number; // 0-100%
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  activities: Activity[];
  resources: string[];
  managerSupport: string;
}

export interface SkillAssessment {
  skillCategory: string;
  skillName: string;
  currentLevel: number; // 1-5 scale
  targetLevel: number; // 1-5 scale
  assessmentDate: string;
  assessor: string;
  assessmentMethod: 'self-assessment' | 'manager-review' | 'peer-review' | '360-feedback' | 'test' | 'practical';
  evidence: string[];
  improvementAreas: string[];
  strengths: string[];
}

export interface TrainingPlanItem {
  id: string;
  trainingName: string;
  trainingType: 'internal' | 'external' | 'online' | 'certification' | 'conference' | 'workshop';
  description: string;
  provider: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedCost: number;
  priority: 'high' | 'medium' | 'low';
  linkedObjectives: string[];
  approvalRequired: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  actualStartDate?: string;
  actualEndDate?: string;
  actualCost?: number;
  completionStatus: 'planned' | 'enrolled' | 'in-progress' | 'completed' | 'cancelled';
  outcomes: string[];
  feedback?: string;
}

export interface MentoringPlan {
  mentorId: string;
  mentorName: string;
  mentorDepartment: string;
  mentoringType: 'formal' | 'informal' | 'reverse' | 'group';
  startDate: string;
  endDate: string;
  meetingFrequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  focusAreas: string[];
  goals: string[];
  meetings: MentoringMeeting[];
}

export interface MentoringMeeting {
  date: string;
  duration: number;
  topics: string[];
  outcomes: string[];
  nextSteps: string[];
  menteePreparation: string;
  mentorFeedback: string;
}

export interface RotationPlan {
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  duration: number; // months
  supervisor: string;
  objectives: string[];
  keyLearnings: string[];
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  feedback?: string;
}

export interface PerformanceTarget {
  id: string;
  targetArea: string;
  description: string;
  measurementCriteria: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  weight: number; // percentage of overall performance
  status: 'not-started' | 'in-progress' | 'achieved' | 'exceeded' | 'missed';
  linkedTraining: string[];
}

export interface ReviewSchedule {
  reviewType: 'informal-checkin' | 'formal-review' | 'mid-year' | 'annual';
  scheduledDate: string;
  actualDate?: string;
  participants: string[];
  agenda: string[];
  outcomes?: string[];
  actionItems?: string[];
  nextReviewDate: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
}

export interface Milestone {
  description: string;
  targetDate: string;
  status: 'pending' | 'in-progress' | 'achieved' | 'missed';
  completionDate?: string;
}

export interface Activity {
  description: string;
  type: 'training' | 'project' | 'mentoring' | 'reading' | 'practice' | 'networking';
  startDate: string;
  endDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  outcome?: string;
}

export interface TrainingFeedback {
  overallRating: number; // 1-5 scale
  contentRelevance: number;
  instructorEffectiveness: number;
  materialQuality: number;
  facilityRating: number;
  recommendToOthers: boolean;
  mostValuable: string;
  leastValuable: string;
  improvementSuggestions: string;
  applicationPlan: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: Record<string, any>;
  ipAddress?: string;
}

// Banking-specific mandatory training categories
export const BANKING_MANDATORY_TRAININGS = {
  'aml-cft': {
    name: 'Anti-Money Laundering & Counter Financing of Terrorism',
    frequency: 'annual',
    validityMonths: 12,
    passingGrade: 80,
    reminderDays: [90, 60, 30, 7]
  },
  'compliance': {
    name: 'Banking Compliance & Regulatory Requirements',
    frequency: 'annual',
    validityMonths: 12,
    passingGrade: 85,
    reminderDays: [90, 60, 30, 7]
  },
  'ethics': {
    name: 'Banking Ethics & Code of Conduct',
    frequency: 'biannual',
    validityMonths: 6,
    passingGrade: 85,
    reminderDays: [60, 30, 14, 3]
  },
  'risk-management': {
    name: 'Banking Risk Management',
    frequency: 'annual',
    validityMonths: 12,
    passingGrade: 80,
    reminderDays: [90, 60, 30, 7]
  },
  'data-protection': {
    name: 'Data Protection & Customer Privacy',
    frequency: 'annual',
    validityMonths: 12,
    passingGrade: 80,
    reminderDays: [90, 60, 30, 7]
  },
  'cyber-security': {
    name: 'Cyber Security Awareness',
    frequency: 'quarterly',
    validityMonths: 3,
    passingGrade: 75,
    reminderDays: [30, 14, 7, 1]
  }
};

// Department-specific skill categories
export const DEPARTMENT_SKILL_CATEGORIES = {
  'personal-banking': [
    'Customer Service Excellence',
    'Banking Products Knowledge',
    'Sales & Cross-selling',
    'Digital Banking Platforms',
    'KYC Procedures',
    'Complaint Handling'
  ],
  'corporate-banking': [
    'Corporate Finance',
    'Credit Analysis',
    'Relationship Management',
    'Treasury Services',
    'Trade Finance',
    'Risk Assessment'
  ],
  'trade-finance': [
    'Letters of Credit',
    'Documentary Collections',
    'Trade Documentation',
    'Export-Import Procedures',
    'SWIFT Operations',
    'International Regulations'
  ],
  'operations': [
    'Core Banking Systems',
    'Payment Processing',
    'Reconciliation',
    'Process Optimization',
    'Quality Control',
    'SLA Management'
  ],
  'risk-management': [
    'Credit Risk Analysis',
    'Market Risk Management',
    'Operational Risk',
    'Basel Compliance',
    'Risk Modeling',
    'Stress Testing'
  ],
  'compliance': [
    'Regulatory Reporting',
    'AML/CFT Procedures',
    'Internal Audit',
    'Policy Development',
    'Investigation Techniques',
    'Regulatory Updates'
  ]
};

// Training effectiveness metrics
export const TRAINING_METRICS = {
  'kirkpatrick-level-1': 'Reaction - Participant satisfaction',
  'kirkpatrick-level-2': 'Learning - Knowledge and skills acquired',
  'kirkpatrick-level-3': 'Behavior - Application on the job',
  'kirkpatrick-level-4': 'Results - Business impact and ROI'
};

// Utility Functions
export const calculateCertificationExpiryDays = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getCertificationStatus = (certification: Certification): string => {
  const daysToExpiry = calculateCertificationExpiryDays(certification.expiryDate);
  
  if (daysToExpiry < 0) return 'expired';
  if (daysToExpiry <= 30) return 'expiring-soon';
  if (daysToExpiry <= 90) return 'renewal-due';
  return 'active';
};

export const getTrainingComplianceRate = (employeeTrainings: TrainingRecord[]): number => {
  const mandatoryTrainings = employeeTrainings.filter(t => t.isMandatory);
  const completedMandatory = mandatoryTrainings.filter(t => t.status === 'completed' && t.passed);
  
  return mandatoryTrainings.length > 0 ? (completedMandatory.length / mandatoryTrainings.length) * 100 : 100;
};

export const calculateIDPProgress = (idp: IndividualDevelopmentPlan): number => {
  const totalObjectives = idp.developmentObjectives.length;
  const completedObjectives = idp.developmentObjectives.filter(obj => obj.status === 'completed').length;
  
  const totalTrainings = idp.trainingPlan.length;
  const completedTrainings = idp.trainingPlan.filter(training => training.completionStatus === 'completed').length;
  
  const objectiveProgress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 50 : 50;
  const trainingProgress = totalTrainings > 0 ? (completedTrainings / totalTrainings) * 50 : 50;
  
  return Math.round(objectiveProgress + trainingProgress);
};

export const getDepartmentTrainingNeeds = (department: string, allAssessments: TrainingNeedsAssessment[]): TrainingNeedsAssessment | null => {
  return allAssessments
    .filter(tna => tna.department === department)
    .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())[0] || null;
};

export const getUpcomingTrainingReminders = (trainings: TrainingRecord[]): TrainingRecord[] => {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  
  return trainings.filter(training => {
    const startDate = new Date(training.startDate);
    return startDate >= today && startDate <= thirtyDaysFromNow && training.status === 'scheduled';
  });
};

export const getExpiringCertifications = (certifications: Certification[], days: number = 90): Certification[] => {
  return certifications.filter(cert => {
    const daysToExpiry = calculateCertificationExpiryDays(cert.expiryDate);
    return daysToExpiry > 0 && daysToExpiry <= days;
  });
};

export const generateTrainingReport = (
  employeeId: string,
  trainings: TrainingRecord[],
  certifications: Certification[],
  idp?: IndividualDevelopmentPlan
) => {
  const employeeTrainings = trainings.filter(t => t.employeeId === employeeId);
  const employeeCertifications = certifications.filter(c => c.employeeId === employeeId);
  
  const totalTrainingHours = employeeTrainings.reduce((sum, t) => sum + t.duration, 0);
  const completedTrainings = employeeTrainings.filter(t => t.status === 'completed');
  const passedTrainings = completedTrainings.filter(t => t.passed);
  
  const activeCertifications = employeeCertifications.filter(c => c.status === 'active');
  const expiringCertifications = getExpiringCertifications(employeeCertifications, 90);
  
  const complianceRate = getTrainingComplianceRate(employeeTrainings);
  const idpProgress = idp ? calculateIDPProgress(idp) : 0;
  
  return {
    totalTrainingHours,
    completedTrainings: completedTrainings.length,
    passedTrainings: passedTrainings.length,
    activeCertifications: activeCertifications.length,
    expiringCertifications: expiringCertifications.length,
    complianceRate,
    idpProgress,
    lastTrainingDate: completedTrainings.length > 0 ? 
      Math.max(...completedTrainings.map(t => new Date(t.completionDate || t.endDate).getTime())) : null
  };
};

export const createAuditEntry = (
  action: string,
  performedBy: string,
  details: Record<string, any>,
  ipAddress?: string
): AuditEntry => {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    action,
    performedBy,
    performedAt: new Date().toISOString(),
    details,
    ipAddress
  };
};

// TNA Analysis Functions
export const analyzeSkillGaps = (skillAssessments: SkillAssessment[]): SkillGap[] => {
  const skillGaps: Record<string, SkillGap> = {};
  
  skillAssessments.forEach(assessment => {
    const gapLevel = assessment.targetLevel - assessment.currentLevel;
    if (gapLevel > 0) {
      const key = assessment.skillName;
      if (!skillGaps[key]) {
        skillGaps[key] = {
          skillArea: assessment.skillName,
          currentLevel: assessment.currentLevel,
          requiredLevel: assessment.targetLevel,
          gapLevel: gapLevel,
          priority: gapLevel >= 3 ? 'critical' : gapLevel >= 2 ? 'high' : gapLevel >= 1 ? 'medium' : 'low',
          affectedEmployees: 1,
          businessImpact: '',
          recommendedTraining: []
        };
      } else {
        skillGaps[key].affectedEmployees++;
        skillGaps[key].gapLevel = Math.max(skillGaps[key].gapLevel, gapLevel);
      }
    }
  });
  
  return Object.values(skillGaps);
};

export const generateTrainingRecommendations = (skillGaps: SkillGap[]): PriorityTraining[] => {
  return skillGaps
    .filter(gap => gap.priority === 'critical' || gap.priority === 'high')
    .map(gap => ({
      trainingName: `${gap.skillArea} Development Program`,
      description: `Comprehensive training to address skill gaps in ${gap.skillArea}`,
      justification: `Critical skill gap affecting ${gap.affectedEmployees} employees`,
      targetAudience: `Employees with ${gap.skillArea} skill gaps`,
      estimatedCost: gap.affectedEmployees * 500, // $500 per person estimate
      duration: gap.gapLevel * 8, // 8 hours per gap level
      priority: gap.priority === 'critical' ? 'urgent' : 'high',
      expectedOutcome: `Improve ${gap.skillArea} competency levels`,
      successMetrics: [`Increase average skill level to ${gap.requiredLevel}`, 'Improve performance ratings', 'Reduce errors']
    }));
};

export { }; 
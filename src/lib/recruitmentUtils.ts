import { supabase } from '@/integrations/supabase/client';

// Types for recruitment system
export interface JobRequisition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'executive';
  urgent: boolean;
  requestedBy: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  budgetCode: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  headcount: number;
  startDate: string;
  requirements: {
    education: string;
    experience: string;
    skills: string[];
    certifications?: string[];
  };
  responsibilities: string[];
  benefits: string[];
  eeoCompliance: {
    equalOpportunityStatement: boolean;
    diversityRequirements: string[];
    accommodationPolicy: boolean;
  };
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditEntry[];
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  source: 'website' | 'referral' | 'linkedin' | 'recruitment-agency' | 'job-board' | 'walk-in';
  appliedDate: string;
  status: 'new' | 'screening' | 'interview' | 'assessment' | 'reference-check' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  stage: string;
  scores: {
    resume: number;
    interview: number;
    assessment: number;
    overall: number;
  };
  demographics?: {
    gender?: string;
    ethnicity?: string;
    age?: number;
    disability?: boolean;
    veteran?: boolean;
  };
  eeoData?: {
    selfReported: boolean;
    voluntaryDisclosure: boolean;
  };
  auditTrail: AuditEntry[];
}

export interface Interview {
  id: string;
  candidateId: string;
  type: 'phone' | 'video' | 'in-person' | 'panel' | 'technical';
  scheduledDate: string;
  duration: number;
  interviewers: string[];
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'no-show';
  scoringRubric: ScoringRubric;
  overallScore?: number;
  recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend' | 'strongly-not-recommend';
  notes: string;
  auditTrail: AuditEntry[];
}

export interface ScoringRubric {
  categories: {
    name: string;
    weight: number;
    criteria: {
      name: string;
      description: string;
      maxScore: number;
    }[];
  }[];
}

export interface Offer {
  id: string;
  candidateId: string;
  jobId: string;
  type: 'conditional' | 'final';
  salary: number;
  benefits: string[];
  startDate: string;
  conditions?: string[];
  expiryDate: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
  sentDate?: string;
  responseDate?: string;
  generatedBy: string;
  approvedBy?: string;
  digitalSignature?: {
    signed: boolean;
    signedDate?: string;
    ipAddress?: string;
  };
  auditTrail: AuditEntry[];
}

export interface OnboardingChecklist {
  id: string;
  candidateId: string;
  employeeId?: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  tasks: OnboardingTask[];
  assignedTo: string;
  auditTrail: AuditEntry[];
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'briefing' | 'training' | 'system-access' | 'id-issuance' | 'compliance';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  completedBy?: string;
  completedDate?: string;
  notes?: string;
  dependencies?: string[];
}

export interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: Record<string, any>;
  ipAddress?: string;
}

// Equal Opportunity & Fair Labor Standards Compliance
const EEO_COMPLIANCE_STANDARDS = {
  equalOpportunityStatement: `Horizon Bank is an equal opportunity employer committed to providing employment opportunities to all qualified applicants without regard to race, color, religion, sex, national origin, age, disability, or veteran status. We foster an inclusive environment that values diversity and ensures fair treatment for all employees and applicants.`,
  
  diversityRequirements: [
    'Diverse candidate sourcing strategies',
    'Inclusive interview panels',
    'Bias-free job descriptions',
    'Accessible recruitment processes',
    'Equal compensation standards'
  ],
  
  accommodationPolicy: `We are committed to providing reasonable accommodations to qualified individuals with disabilities throughout the recruitment and employment process. Please contact HR if you need any accommodations during the application or interview process.`,
  
  fairLaborStandards: {
    minimumWage: 'Comply with South Sudan minimum wage requirements',
    overtimePolicy: 'Fair overtime compensation as per labor laws',
    workingHours: 'Standard 40-hour work week with flexible arrangements',
    benefits: 'Comprehensive benefits package for all eligible employees'
  }
};

// Digital Scoring Rubrics for Different Interview Types
const SCORING_RUBRICS = {
  technical: {
    categories: [
      {
        name: 'Technical Expertise',
        weight: 40,
        criteria: [
          { name: 'Domain Knowledge', description: 'Understanding of banking/financial concepts', maxScore: 10 },
          { name: 'Problem Solving', description: 'Ability to analyze and solve complex problems', maxScore: 10 },
          { name: 'Technical Skills', description: 'Proficiency in required technical skills', maxScore: 10 }
        ]
      },
      {
        name: 'Communication',
        weight: 25,
        criteria: [
          { name: 'Clarity', description: 'Clear and articulate communication', maxScore: 10 },
          { name: 'Listening Skills', description: 'Active listening and comprehension', maxScore: 10 }
        ]
      },
      {
        name: 'Cultural Fit',
        weight: 20,
        criteria: [
          { name: 'Values Alignment', description: 'Alignment with company values', maxScore: 10 },
          { name: 'Team Collaboration', description: 'Ability to work effectively in teams', maxScore: 10 }
        ]
      },
      {
        name: 'Experience & Background',
        weight: 15,
        criteria: [
          { name: 'Relevant Experience', description: 'Applicable work experience', maxScore: 10 },
          { name: 'Career Progression', description: 'Professional growth and development', maxScore: 10 }
        ]
      }
    ]
  },
  
  behavioral: {
    categories: [
      {
        name: 'Leadership & Initiative',
        weight: 30,
        criteria: [
          { name: 'Leadership Examples', description: 'Demonstrated leadership capabilities', maxScore: 10 },
          { name: 'Initiative Taking', description: 'Proactive approach to challenges', maxScore: 10 }
        ]
      },
      {
        name: 'Interpersonal Skills',
        weight: 25,
        criteria: [
          { name: 'Customer Service', description: 'Customer-focused mindset', maxScore: 10 },
          { name: 'Conflict Resolution', description: 'Ability to handle difficult situations', maxScore: 10 }
        ]
      },
      {
        name: 'Adaptability',
        weight: 25,
        criteria: [
          { name: 'Change Management', description: 'Comfort with organizational change', maxScore: 10 },
          { name: 'Learning Agility', description: 'Ability to learn new concepts quickly', maxScore: 10 }
        ]
      },
      {
        name: 'Integrity & Ethics',
        weight: 20,
        criteria: [
          { name: 'Ethical Decision Making', description: 'Demonstrates strong ethical standards', maxScore: 10 },
          { name: 'Reliability', description: 'Consistent and dependable behavior', maxScore: 10 }
        ]
      }
    ]
  }
};

// Standard Onboarding Checklists by Role Type
const ONBOARDING_TEMPLATES = {
  bankingOperations: [
    {
      category: 'documentation' as const,
      title: 'Employment Contract Signing',
      description: 'Complete and sign official employment contract',
      priority: 'high' as const,
      daysFromStart: 0
    },
    {
      category: 'documentation' as const,
      title: 'Tax and Benefits Forms',
      description: 'Complete tax documentation and benefits enrollment',
      priority: 'high' as const,
      daysFromStart: 1
    },
    {
      category: 'id-issuance' as const,
      title: 'Employee ID Card Generation',
      description: 'Process employee ID card with photo and access permissions',
      priority: 'high' as const,
      daysFromStart: 2
    },
    {
      category: 'system-access' as const,
      title: 'Banking System Access Setup',
      description: 'Configure access to core banking systems and applications',
      priority: 'high' as const,
      daysFromStart: 3
    },
    {
      category: 'briefing' as const,
      title: 'Company Orientation',
      description: 'Comprehensive overview of company history, values, and policies',
      priority: 'medium' as const,
      daysFromStart: 1
    },
    {
      category: 'briefing' as const,
      title: 'Department-Specific Briefing',
      description: 'Introduction to department processes and team members',
      priority: 'medium' as const,
      daysFromStart: 2
    },
    {
      category: 'training' as const,
      title: 'Banking Regulations Training',
      description: 'Complete mandatory training on banking regulations and compliance',
      priority: 'high' as const,
      daysFromStart: 5
    },
    {
      category: 'training' as const,
      title: 'AML/KYC Training',
      description: 'Anti-Money Laundering and Know Your Customer procedures',
      priority: 'high' as const,
      daysFromStart: 7
    },
    {
      category: 'compliance' as const,
      title: 'Security Clearance Verification',
      description: 'Complete background check and security clearance process',
      priority: 'high' as const,
      daysFromStart: 0
    },
    {
      category: 'compliance' as const,
      title: 'Health and Safety Briefing',
      description: 'Workplace safety protocols and emergency procedures',
      priority: 'medium' as const,
      daysFromStart: 3
    }
  ],
  
  customerService: [
    {
      category: 'documentation' as const,
      title: 'Employment Contract Signing',
      description: 'Complete and sign official employment contract',
      priority: 'high' as const,
      daysFromStart: 0
    },
    {
      category: 'id-issuance' as const,
      title: 'Employee ID and Access Card',
      description: 'Generate employee ID and access cards',
      priority: 'high' as const,
      daysFromStart: 1
    },
    {
      category: 'system-access' as const,
      title: 'Customer Service Systems Access',
      description: 'Setup access to CRM and customer service platforms',
      priority: 'high' as const,
      daysFromStart: 2
    },
    {
      category: 'training' as const,
      title: 'Customer Service Excellence Training',
      description: 'Comprehensive customer service skills and procedures',
      priority: 'high' as const,
      daysFromStart: 3
    },
    {
      category: 'training' as const,
      title: 'Product Knowledge Training',
      description: 'Detailed training on all banking products and services',
      priority: 'high' as const,
      daysFromStart: 5
    },
    {
      category: 'briefing' as const,
      title: 'Communication Standards Briefing',
      description: 'Professional communication standards and protocols',
      priority: 'medium' as const,
      daysFromStart: 2
    }
  ]
};

// Audit Trail Functions
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

// Validation Functions
export const validateJobRequisition = (requisition: Partial<JobRequisition>) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!requisition.title) errors.push('Job title is required');
  if (!requisition.department) errors.push('Department is required');
  if (!requisition.budgetCode) errors.push('Budget code is required');
  if (!requisition.salaryRange?.min || !requisition.salaryRange?.max) {
    errors.push('Salary range is required');
  }

  // EEO Compliance validation
  if (!requisition.eeoCompliance?.equalOpportunityStatement) {
    errors.push('Equal Opportunity Statement must be acknowledged');
  }
  if (!requisition.eeoCompliance?.accommodationPolicy) {
    warnings.push('Accommodation policy should be included for ADA compliance');
  }

  // Business logic validation
  if (requisition.salaryRange?.min && requisition.salaryRange?.max) {
    if (requisition.salaryRange.min >= requisition.salaryRange.max) {
      errors.push('Minimum salary must be less than maximum salary');
    }
  }

  if (requisition.startDate) {
    const startDate = new Date(requisition.startDate);
    const today = new Date();
    if (startDate < today) {
      warnings.push('Start date is in the past');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateCandidateApplication = (candidate: Partial<Candidate>) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!candidate.firstName) errors.push('First name is required');
  if (!candidate.lastName) errors.push('Last name is required');
  if (!candidate.email) errors.push('Email is required');
  if (!candidate.phone) errors.push('Phone number is required');

  // Email validation
  if (candidate.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
    errors.push('Valid email address is required');
  }

  // Phone validation
  if (candidate.phone && !/^\+?[\d\s\-\(\)]+$/.test(candidate.phone)) {
    errors.push('Valid phone number is required');
  }

  // EEO compliance check
  if (candidate.eeoData && !candidate.eeoData.voluntaryDisclosure) {
    warnings.push('Voluntary EEO disclosure not provided (optional but recommended for compliance tracking)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Interview Scheduling Functions
export const calculateInterviewScore = (feedback: any[], rubric: ScoringRubric): number => {
  let totalScore = 0;
  let totalWeight = 0;

  rubric.categories.forEach(category => {
    const categoryScore = category.criteria.reduce((sum, criterion) => {
      const feedbackScore = feedback.find(f => f.criterion === criterion.name)?.score || 0;
      return sum + (feedbackScore * criterion.maxScore / 10); // Normalize to maxScore
    }, 0);

    totalScore += categoryScore * category.weight / 100;
    totalWeight += category.weight;
  });

  return Math.round((totalScore / totalWeight) * 100) / 100;
};

// Offer Generation Functions
export const generateOfferLetter = (candidate: Candidate, offer: Offer, jobDetails: any) => {
  const offerTemplate = `
    EMPLOYMENT OFFER LETTER
    
    Dear ${candidate.firstName} ${candidate.lastName},
    
    We are pleased to offer you the position of ${jobDetails.title} at Horizon Bank South Sudan.
    
    Position Details:
    - Title: ${jobDetails.title}
    - Department: ${jobDetails.department}
    - Start Date: ${new Date(offer.startDate).toLocaleDateString()}
    - Salary: ${offer.salary} ${jobDetails.currency || 'USD'} annually
    
    Benefits Package:
    ${offer.benefits.map(benefit => `- ${benefit}`).join('\n')}
    
    This offer is contingent upon:
    ${offer.conditions?.map(condition => `- ${condition}`).join('\n') || '- Background check verification\n- Reference verification'}
    
    Please confirm your acceptance by ${new Date(offer.expiryDate).toLocaleDateString()}.
    
    We look forward to welcoming you to our team.
    
    Sincerely,
    Horizon Bank HR Department
  `;

  return offerTemplate;
};

// Onboarding Functions
export const generateOnboardingChecklist = (
  candidateId: string,
  jobType: keyof typeof ONBOARDING_TEMPLATES,
  startDate: string
): OnboardingChecklist => {
  const template = ONBOARDING_TEMPLATES[jobType] || ONBOARDING_TEMPLATES.bankingOperations;
  const start = new Date(startDate);

  const tasks: OnboardingTask[] = template.map((taskTemplate, index) => {
    const dueDate = new Date(start);
    dueDate.setDate(dueDate.getDate() + taskTemplate.daysFromStart);

    return {
      id: `task-${Date.now()}-${index}`,
      title: taskTemplate.title,
      description: taskTemplate.description,
      category: taskTemplate.category,
      priority: taskTemplate.priority,
      dueDate: dueDate.toISOString(),
      status: 'pending',
      assignedTo: 'hr@horizonbank.com' // Default assignment
    };
  });

  const expectedCompletion = new Date(start);
  expectedCompletion.setDate(expectedCompletion.getDate() + 14); // 2 weeks

  return {
    id: `onboard-${Date.now()}`,
    candidateId,
    status: 'pending',
    startDate: start.toISOString(),
    expectedCompletionDate: expectedCompletion.toISOString(),
    tasks,
    assignedTo: 'hr@horizonbank.com',
    auditTrail: [
      createAuditEntry(
        'Onboarding Checklist Created',
        'system',
        { candidateId, tasksCount: tasks.length }
      )
    ]
  };
};

// Diversity and Inclusion Analytics
export const calculateDiversityMetrics = (candidates: Candidate[]) => {
  const total = candidates.length;
  if (total === 0) return null;

  const demographics = candidates.reduce((acc, candidate) => {
    if (candidate.demographics?.gender) {
      acc.gender[candidate.demographics.gender] = (acc.gender[candidate.demographics.gender] || 0) + 1;
    }
    if (candidate.demographics?.ethnicity) {
      acc.ethnicity[candidate.demographics.ethnicity] = (acc.ethnicity[candidate.demographics.ethnicity] || 0) + 1;
    }
    if (candidate.demographics?.disability) {
      acc.disability.yes += 1;
    } else {
      acc.disability.no += 1;
    }
    if (candidate.demographics?.veteran) {
      acc.veteran.yes += 1;
    } else {
      acc.veteran.no += 1;
    }
    return acc;
  }, {
    gender: {} as Record<string, number>,
    ethnicity: {} as Record<string, number>,
    disability: { yes: 0, no: 0 },
    veteran: { yes: 0, no: 0 }
  });

  return {
    total,
    genderDistribution: Object.entries(demographics.gender).map(([key, value]) => ({
      category: key,
      count: value,
      percentage: Math.round((value / total) * 100)
    })),
    ethnicityDistribution: Object.entries(demographics.ethnicity).map(([key, value]) => ({
      category: key,
      count: value,
      percentage: Math.round((value / total) * 100)
    })),
    disabilityInclusion: {
      percentage: Math.round((demographics.disability.yes / total) * 100),
      count: demographics.disability.yes
    },
    veteranInclusion: {
      percentage: Math.round((demographics.veteran.yes / total) * 100),
      count: demographics.veteran.yes
    }
  };
};

// Compliance Reporting
export const generateComplianceReport = (
  requisitions: JobRequisition[],
  candidates: Candidate[],
  interviews: Interview[],
  offers: Offer[]
) => {
  const diversityMetrics = calculateDiversityMetrics(candidates);
  
  const eeoCompliance = {
    requisitionsWithEEOStatement: requisitions.filter(r => r.eeoCompliance.equalOpportunityStatement).length,
    totalRequisitions: requisitions.length,
    complianceRate: Math.round((requisitions.filter(r => r.eeoCompliance.equalOpportunityStatement).length / requisitions.length) * 100)
  };

  const interviewProcess = {
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter(i => i.status === 'completed').length,
    avgInterviewScore: interviews
      .filter(i => i.overallScore)
      .reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.filter(i => i.overallScore).length,
    scoredWithRubric: interviews.filter(i => i.scoringRubric).length
  };

  const offerProcess = {
    totalOffers: offers.length,
    acceptedOffers: offers.filter(o => o.status === 'accepted').length,
    acceptanceRate: Math.round((offers.filter(o => o.status === 'accepted').length / offers.length) * 100),
    digitallySignedOffers: offers.filter(o => o.digitalSignature?.signed).length
  };

  return {
    generatedAt: new Date().toISOString(),
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      end: new Date().toISOString()
    },
    diversityMetrics,
    eeoCompliance,
    interviewProcess,
    offerProcess,
    recommendations: [
      eeoCompliance.complianceRate < 100 ? 'Ensure all job requisitions include EEO statements' : null,
      diversityMetrics?.genderDistribution.find(g => g.category === 'female')?.percentage < 40 ? 'Consider targeted diversity sourcing' : null,
      interviewProcess.scoredWithRubric / interviewProcess.totalInterviews < 0.9 ? 'Standardize interview scoring with rubrics' : null,
      offerProcess.digitallySignedOffers / offerProcess.totalOffers < 0.8 ? 'Increase digital signature adoption' : null
    ].filter(Boolean)
  };
};

// Export utility functions
export {
  EEO_COMPLIANCE_STANDARDS,
  SCORING_RUBRICS,
  ONBOARDING_TEMPLATES
}; 
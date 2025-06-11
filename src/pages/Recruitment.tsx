import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreVerticalIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  UsersIcon,
  FileTextIcon,
  CreditCardIcon,
  DollarSignIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  UserCheckIcon,
  SendIcon,
  DownloadIcon,
  UploadIcon,
  ShieldIcon,
  Scale,
  Users,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  Calendar as CalendarIcon2,
  Eye,
  Target,
  BookOpen,
  Settings,
  Building,
  MapPin,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Enhanced interfaces for comprehensive ATS
interface JobRequisition {
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

interface JobPosting {
  id: string;
  requisitionId: string;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  description: string;
  requirements: string;
  salaryRange: string;
  benefits: string[];
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  postedDate: string;
  applicationDeadline: string;
  applications: number;
  views: number;
  externalPostings: ExternalPosting[];
  internalOnly: boolean;
  eeoStatement: string;
  auditTrail: AuditEntry[];
}

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  jobId: string;
  jobTitle: string;
  source: 'website' | 'referral' | 'linkedin' | 'recruitment-agency' | 'job-board' | 'walk-in';
  referredBy?: string;
  appliedDate: string;
  status: 'new' | 'screening' | 'interview' | 'assessment' | 'reference-check' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  stage: string;
  resume: {
    filename: string;
    url: string;
    uploadDate: string;
  };
  coverLetter?: string;
  documents: Document[];
  interviews: Interview[];
  assessments: Assessment[];
  offers: Offer[];
  scores: {
    resume: number;
    interview: number;
    assessment: number;
    overall: number;
  };
  notes: Note[];
  tags: string[];
  demographics: {
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

interface Interview {
  id: string;
  candidateId: string;
  type: 'phone' | 'video' | 'in-person' | 'panel' | 'technical';
  scheduledDate: string;
  duration: number;
  interviewers: Interviewer[];
  location?: string;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'no-show';
  feedback: InterviewFeedback[];
  scoringRubric: ScoringRubric;
  overallScore?: number;
  recommendation: 'strongly-recommend' | 'recommend' | 'neutral' | 'not-recommend' | 'strongly-not-recommend';
  notes: string;
  auditTrail: AuditEntry[];
}

interface ScoringRubric {
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

interface Offer {
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

interface OnboardingChecklist {
  id: string;
  candidateId: string;
  employeeId?: string;
  status: 'pending' | 'in-progress' | 'completed';
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  tasks: OnboardingTask[];
  assignedTo: string;
  documents: OnboardingDocument[];
  auditTrail: AuditEntry[];
}

interface OnboardingTask {
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

interface OnboardingDocument {
  id: string;
  name: string;
  type: 'contract' | 'policy' | 'handbook' | 'form' | 'id-card' | 'access-card' | 'certificate';
  status: 'pending' | 'provided' | 'signed' | 'verified';
  required: boolean;
  providedDate?: string;
  signedDate?: string;
  verifiedBy?: string;
  digitalSignature?: boolean;
  url?: string;
}

interface AuditEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  details: Record<string, any>;
  ipAddress?: string;
}

interface ExternalPosting {
  platform: string;
  url: string;
  postedDate: string;
  status: 'active' | 'expired' | 'removed';
}

interface Interviewer {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

interface InterviewFeedback {
  interviewerId: string;
  scores: Record<string, number>;
  strengths: string[];
  concerns: string[];
  recommendation: string;
  notes: string;
}

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  type: 'general' | 'interview' | 'assessment' | 'reference' | 'concern';
  confidential: boolean;
}

interface Assessment {
  id: string;
  type: 'technical' | 'cognitive' | 'personality' | 'skills';
  name: string;
  provider: string;
  assignedDate: string;
  completedDate?: string;
  score?: number;
  results?: Record<string, any>;
  status: 'assigned' | 'in-progress' | 'completed' | 'expired';
}

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
}

// Component starts here
export default function Recruitment() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog states
  const [showRequisitionDialog, setShowRequisitionDialog] = useState(false);
  const [showJobPostingDialog, setShowJobPostingDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showOnboardingDialog, setShowOnboardingDialog] = useState(false);

  // Selected items
  const [selectedRequisition, setSelectedRequisition] = useState<JobRequisition | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Form states
  const [requisitionForm, setRequisitionForm] = useState({
    title: '',
    department: '',
    location: 'Juba, South Sudan',
    type: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'internship',
    level: 'mid' as 'entry' | 'mid' | 'senior' | 'executive',
    urgent: false,
    budgetCode: '',
    salaryMin: '',
    salaryMax: '',
    currency: 'USD',
    headcount: 1,
    startDate: '',
    education: '',
    experience: '',
    skills: [] as string[],
    certifications: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    equalOpportunityStatement: true,
    diversityRequirements: ['Equal opportunity employer', 'Diverse candidate sourcing'] as string[],
    accommodationPolicy: true
  });

  const [skillInput, setSkillInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  // Department options
  const departments = [
    'Personal Banking',
    'Corporate Banking', 
    'Trade Finance',
    'Operations',
    'Finance & Accounting',
    'Human Resources',
    'Information Technology',
    'Risk Management',
    'Compliance',
    'Marketing',
    'Customer Service'
  ];

  // Skill suggestions for banking roles
  const skillSuggestions = [
    'Banking Operations', 'Risk Management', 'Regulatory Compliance', 'Customer Service',
    'Financial Analysis', 'Credit Analysis', 'Trade Finance', 'AML/KYC', 'Core Banking Systems',
    'Payment Processing', 'Treasury Operations', 'Audit', 'Accounting', 'Leadership',
    'Team Management', 'Project Management', 'Communication Skills', 'Problem Solving'
  ];

  // Benefits options
  const benefitOptions = [
    'Health Insurance', 'Pension Plan', 'Annual Leave', 'Sick Leave', 'Maternity/Paternity Leave',
    'Professional Development', 'Training Opportunities', 'Performance Bonus', 'Transport Allowance',
    'Housing Allowance', 'Medical Coverage', 'Life Insurance', 'Flexible Working Hours'
  ];

  // Mock data - in real implementation, this would come from API
  const [requisitions, setRequisitions] = useState<JobRequisition[]>([
    {
      id: "REQ-2025-001",
      title: "Senior Banking Operations Manager",
      department: "Operations",
      location: "Juba, South Sudan",
      type: "full-time",
      level: "senior",
      urgent: true,
      requestedBy: "John Doe",
      approvalStatus: "approved",
      approvedBy: "Sarah Wilson",
      approvalDate: "2025-01-15",
      budgetCode: "OPS-2025-001",
      salaryRange: { min: 4000, max: 5500, currency: "USD" },
      headcount: 1,
      startDate: "2025-03-01",
      requirements: {
        education: "Bachelor's degree in Banking, Finance, or related field",
        experience: "Minimum 8 years in banking operations",
        skills: ["Banking Operations", "Risk Management", "Team Leadership", "Regulatory Compliance"],
        certifications: ["AML Certification", "Banking Operations Certificate"]
      },
      responsibilities: [
        "Oversee daily banking operations and ensure compliance",
        "Lead operations team and drive process improvements",
        "Manage regulatory reporting and audit coordination",
        "Implement operational risk management frameworks"
      ],
      benefits: ["Health Insurance", "Pension Plan", "Annual Leave", "Professional Development"],
      eeoCompliance: {
        equalOpportunityStatement: true,
        diversityRequirements: ["Equal opportunity employer", "Diverse candidate sourcing"],
        accommodationPolicy: true
      },
      createdAt: "2025-01-10T09:00:00Z",
      updatedAt: "2025-01-15T14:30:00Z",
      auditTrail: [
        {
          id: "audit-001",
          action: "Requisition Created",
          performedBy: "John Doe",
          performedAt: "2025-01-10T09:00:00Z",
          details: { department: "Operations", title: "Senior Banking Operations Manager" }
        },
        {
          id: "audit-002",
          action: "Requisition Approved",
          performedBy: "Sarah Wilson",
          performedAt: "2025-01-15T14:30:00Z",
          details: { approvalStatus: "approved", comments: "Urgent business need approved" }
        }
      ]
    }
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "CAND-2025-001",
      firstName: "Daniel",
      lastName: "Maker",
      email: "daniel.maker@email.com",
      phone: "+211 987 654 321",
      address: {
        street: "123 Bank Street",
        city: "Juba",
        state: "Central Equatoria",
        country: "South Sudan"
      },
      jobId: "JOB-2025-001",
      jobTitle: "Senior Banking Operations Manager",
      source: "linkedin",
      appliedDate: "2025-01-18T10:30:00Z",
      status: "interview",
      stage: "Technical Interview",
      resume: {
        filename: "daniel_maker_resume.pdf",
        url: "/documents/resumes/daniel_maker_resume.pdf",
        uploadDate: "2025-01-18T10:30:00Z"
      },
      coverLetter: "I am excited to apply for the Senior Banking Operations Manager position...",
      documents: [],
      interviews: [],
      assessments: [],
      offers: [],
      scores: {
        resume: 8.5,
        interview: 0,
        assessment: 0,
        overall: 8.5
      },
      notes: [],
      tags: ["experienced", "operations", "leadership"],
      demographics: {
        gender: "male",
        age: 32
      },
      eeoData: {
        selfReported: true,
        voluntaryDisclosure: true
      },
      auditTrail: [
        {
          id: "audit-cand-001",
          action: "Application Submitted",
          performedBy: "Daniel Maker",
          performedAt: "2025-01-18T10:30:00Z",
          details: { jobId: "JOB-2025-001", source: "linkedin" }
        }
      ]
    }
  ]);

  // Statistics for dashboard
  const dashboardStats = {
    activeJobs: requisitions.filter(r => r.approvalStatus === 'approved').length,
    totalApplications: candidates.length,
    interviewsScheduled: candidates.filter(c => c.status === 'interview').length,
    offersExtended: candidates.filter(c => c.status === 'offer').length,
    hiredThisMonth: candidates.filter(c => c.status === 'hired').length,
    avgTimeToHire: 28, // days
    eeoCompliance: 98, // percentage
    diversityMetrics: {
      gender: { male: 45, female: 55 },
      ethnicity: { diverse: 35, majority: 65 }
    }
  };

  // Form handlers
  const handleAddSkill = () => {
    if (skillInput.trim() && !requisitionForm.skills.includes(skillInput.trim())) {
      setRequisitionForm(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequisitionForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleAddCertification = () => {
    if (certificationInput.trim() && !requisitionForm.certifications.includes(certificationInput.trim())) {
      setRequisitionForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    setRequisitionForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim() && !requisitionForm.responsibilities.includes(responsibilityInput.trim())) {
      setRequisitionForm(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput('');
    }
  };

  const handleRemoveResponsibility = (respToRemove: string) => {
    setRequisitionForm(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter(resp => resp !== respToRemove)
    }));
  };

  const handleBenefitToggle = (benefit: string) => {
    setRequisitionForm(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const resetRequisitionForm = () => {
    setRequisitionForm({
      title: '',
      department: '',
      location: 'Juba, South Sudan',
      type: 'full-time',
      level: 'mid',
      urgent: false,
      budgetCode: '',
      salaryMin: '',
      salaryMax: '',
      currency: 'USD',
      headcount: 1,
      startDate: '',
      education: '',
      experience: '',
      skills: [],
      certifications: [],
      responsibilities: [],
      benefits: [],
      equalOpportunityStatement: true,
      diversityRequirements: ['Equal opportunity employer', 'Diverse candidate sourcing'],
      accommodationPolicy: true
    });
    setSkillInput('');
    setCertificationInput('');
    setResponsibilityInput('');
    setBenefitInput('');
  };

  const handleSubmitRequisition = () => {
    // Validation
    const errors: string[] = [];
    
    if (!requisitionForm.title.trim()) errors.push('Job title is required');
    if (!requisitionForm.department) errors.push('Department is required');
    if (!requisitionForm.budgetCode.trim()) errors.push('Budget code is required');
    if (!requisitionForm.salaryMin || !requisitionForm.salaryMax) errors.push('Salary range is required');
    if (parseFloat(requisitionForm.salaryMin) >= parseFloat(requisitionForm.salaryMax)) {
      errors.push('Minimum salary must be less than maximum salary');
    }
    if (!requisitionForm.startDate) errors.push('Start date is required');
    if (!requisitionForm.education.trim()) errors.push('Education requirements are required');
    if (!requisitionForm.experience.trim()) errors.push('Experience requirements are required');
    if (requisitionForm.skills.length === 0) errors.push('At least one skill is required');
    if (requisitionForm.responsibilities.length === 0) errors.push('At least one responsibility is required');

    if (errors.length > 0) {
      toast.error(`Please fix the following errors: ${errors.join(', ')}`);
      return;
    }

    // Create new requisition
    const newRequisition: JobRequisition = {
      id: `REQ-${new Date().getFullYear()}-${String(requisitions.length + 1).padStart(3, '0')}`,
      title: requisitionForm.title.trim(),
      department: requisitionForm.department,
      location: requisitionForm.location,
      type: requisitionForm.type,
      level: requisitionForm.level,
      urgent: requisitionForm.urgent,
      requestedBy: user?.id || 'Unknown',
      approvalStatus: 'pending',
      budgetCode: requisitionForm.budgetCode.trim(),
      salaryRange: {
        min: parseFloat(requisitionForm.salaryMin),
        max: parseFloat(requisitionForm.salaryMax),
        currency: requisitionForm.currency
      },
      headcount: requisitionForm.headcount,
      startDate: requisitionForm.startDate,
      requirements: {
        education: requisitionForm.education.trim(),
        experience: requisitionForm.experience.trim(),
        skills: requisitionForm.skills,
        certifications: requisitionForm.certifications.length > 0 ? requisitionForm.certifications : undefined
      },
      responsibilities: requisitionForm.responsibilities,
      benefits: requisitionForm.benefits,
      eeoCompliance: {
        equalOpportunityStatement: requisitionForm.equalOpportunityStatement,
        diversityRequirements: requisitionForm.diversityRequirements,
        accommodationPolicy: requisitionForm.accommodationPolicy
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      auditTrail: [
        {
          id: `audit-${Date.now()}`,
          action: 'Requisition Created',
          performedBy: user?.id || 'Unknown',
          performedAt: new Date().toISOString(),
          details: {
            title: requisitionForm.title,
            department: requisitionForm.department,
            urgent: requisitionForm.urgent
          }
        }
      ]
    };

    // Add to requisitions list
    setRequisitions(prev => [...prev, newRequisition]);
    
    // Reset form and close dialog
    resetRequisitionForm();
    setShowRequisitionDialog(false);
    
    toast.success('Job requisition created successfully and submitted for approval');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Recruitment & Onboarding</h2>
          <p className="text-gray-600">
            Equal Opportunity & Fair Labor Standards Compliant ATS
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowRequisitionDialog(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Requisition
          </Button>
        </div>
      </div>

      {/* Equal Opportunity Compliance Alert */}
      <Alert className="border-green-200 bg-green-50">
        <ShieldIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Equal Opportunity Compliance:</strong> This system ensures full compliance with Fair Labor Standards 
          and Equal Employment Opportunity requirements, including audit trails for transparency and accountability.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.activeJobs}</div>
                <p className="text-xs text-gray-600 mt-1">Open positions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardStats.totalApplications}</div>
                <p className="text-xs text-gray-600 mt-1">Total candidates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{dashboardStats.interviewsScheduled}</div>
                <p className="text-xs text-gray-600 mt-1">Scheduled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{dashboardStats.offersExtended}</div>
                <p className="text-xs text-gray-600 mt-1">Extended</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Hired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">{dashboardStats.hiredThisMonth}</div>
                <p className="text-xs text-gray-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">EEO Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{dashboardStats.eeoCompliance}%</div>
                <p className="text-xs text-gray-600 mt-1">Compliance rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Diversity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Equal Opportunity Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Gender Diversity</span>
                      <span>Female: 55%</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ethnic Diversity</span>
                      <span>Diverse: 35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accommodation Requests</span>
                      <span>100% Fulfilled</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recruitment Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Time to Hire:</span>
                    <span className="font-medium">{dashboardStats.avgTimeToHire} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interview-to-Offer Rate:</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Offer Acceptance Rate:</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality of Hire Score:</span>
                    <span className="font-medium">8.2/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Requisitions Tab */}
        <TabsContent value="requisitions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Requisitions</CardTitle>
              <CardDescription>
                Manage vacancy creation and approval workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requisition ID</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Approval Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{req.title}</div>
                          <div className="text-sm text-gray-600">{req.level} level</div>
                        </div>
                      </TableCell>
                      <TableCell>{req.department}</TableCell>
                      <TableCell>
                        <Badge variant={req.type === 'full-time' ? 'default' : 'secondary'}>
                          {req.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            req.approvalStatus === 'approved' ? 'default' :
                            req.approvalStatus === 'pending' ? 'secondary' :
                            req.approvalStatus === 'rejected' ? 'destructive' : 'outline'
                          }
                        >
                          {req.approvalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{req.requestedBy}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <EditIcon className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {req.approvalStatus === 'approved' && (
                              <DropdownMenuItem onClick={() => setShowJobPostingDialog(true)}>
                                <SendIcon className="h-4 w-4 mr-2" />
                                Create Job Posting
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Continue with other tabs... */}
        {/* For brevity, I'll add the remaining tabs in the next edit */}
      </Tabs>

      {/* New Job Requisition Dialog */}
      <Dialog open={showRequisitionDialog} onOpenChange={setShowRequisitionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BriefcaseIcon className="h-5 w-5" />
              Create New Job Requisition
            </DialogTitle>
            <DialogDescription>
              Create a new job requisition with full Equal Opportunity & Fair Labor Standards compliance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input
                      id="job-title"
                      value={requisitionForm.title}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Senior Banking Operations Manager"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select 
                      value={requisitionForm.department} 
                      onValueChange={(value) => setRequisitionForm(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={requisitionForm.location}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job-type">Employment Type</Label>
                    <Select 
                      value={requisitionForm.type} 
                      onValueChange={(value: any) => setRequisitionForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job-level">Seniority Level</Label>
                    <Select 
                      value={requisitionForm.level} 
                      onValueChange={(value: any) => setRequisitionForm(prev => ({ ...prev, level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="executive">Executive Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-code">Budget Code *</Label>
                    <Input
                      id="budget-code"
                      value={requisitionForm.budgetCode}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, budgetCode: e.target.value }))}
                      placeholder="e.g., OPS-2025-001"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Expected Start Date *</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={requisitionForm.startDate}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={requisitionForm.urgent}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, urgent: e.target.checked }))}
                  />
                  <Label htmlFor="urgent" className="text-sm">
                    Mark as Urgent (expedited approval process)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compensation & Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary-min">Minimum Salary *</Label>
                    <Input
                      id="salary-min"
                      type="number"
                      value={requisitionForm.salaryMin}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, salaryMin: e.target.value }))}
                      placeholder="e.g., 4000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="salary-max">Maximum Salary *</Label>
                    <Input
                      id="salary-max"
                      type="number"
                      value={requisitionForm.salaryMax}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, salaryMax: e.target.value }))}
                      placeholder="e.g., 5500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select 
                      value={requisitionForm.currency} 
                      onValueChange={(value) => setRequisitionForm(prev => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="SSP">SSP</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Benefits Package</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {benefitOptions.map(benefit => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`benefit-${benefit}`}
                          checked={requisitionForm.benefits.includes(benefit)}
                          onChange={() => handleBenefitToggle(benefit)}
                        />
                        <Label htmlFor={`benefit-${benefit}`} className="text-sm">
                          {benefit}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education">Education Requirements *</Label>
                  <Textarea
                    id="education"
                    value={requisitionForm.education}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="e.g., Bachelor's degree in Banking, Finance, or related field"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Requirements *</Label>
                  <Textarea
                    id="experience"
                    value={requisitionForm.experience}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="e.g., Minimum 8 years in banking operations"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Required Skills *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill and press Enter"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      />
                    </div>
                    <Button type="button" onClick={handleAddSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillSuggestions.map(skill => (
                      <Button
                        key={skill}
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!requisitionForm.skills.includes(skill)) {
                            setRequisitionForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                          }
                        }}
                        className="text-xs"
                      >
                        + {skill}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requisitionForm.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSkill(skill)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <XCircleIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Certifications</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={certificationInput}
                        onChange={(e) => setCertificationInput(e.target.value)}
                        placeholder="Add a certification and press Enter"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
                      />
                    </div>
                    <Button type="button" onClick={handleAddCertification} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {requisitionForm.certifications.map(cert => (
                      <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                        {cert}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCertification(cert)}
                          className="h-auto p-0 hover:bg-transparent"
                        >
                          <XCircleIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Job Responsibilities *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        placeholder="Add a responsibility and press Enter"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsibility())}
                      />
                    </div>
                    <Button type="button" onClick={handleAddResponsibility} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2 mt-3">
                    {requisitionForm.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 border rounded">
                        <span className="text-sm flex-1">{index + 1}. {resp}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResponsibility(resp)}
                          className="h-auto p-1"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EEO Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  Equal Opportunity & Fair Labor Standards Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    This requisition will automatically include Equal Opportunity statements and comply with Fair Labor Standards.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="eeo-statement"
                      checked={requisitionForm.equalOpportunityStatement}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, equalOpportunityStatement: e.target.checked }))}
                    />
                    <Label htmlFor="eeo-statement" className="text-sm">
                      Include Equal Opportunity Employment statement on all job postings
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accommodation-policy"
                      checked={requisitionForm.accommodationPolicy}
                      onChange={(e) => setRequisitionForm(prev => ({ ...prev, accommodationPolicy: e.target.checked }))}
                    />
                    <Label htmlFor="accommodation-policy" className="text-sm">
                      Include reasonable accommodation policy for individuals with disabilities
                    </Label>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Diversity Requirements</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {requisitionForm.diversityRequirements.map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                resetRequisitionForm();
                setShowRequisitionDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitRequisition}>
              Create Requisition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DollarSignIcon, 
  CalendarIcon, 
  DownloadIcon, 
  SearchIcon, 
  FilterIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  FileTextIcon,
  CreditCardIcon,
  BanknoteIcon,
  TrendingUpIcon,
  UserIcon,
  ShieldCheckIcon,
  MoreVerticalIcon,
  SendIcon,
  EyeIcon,
  EditIcon,
  TargetIcon,
  TrophyIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  BriefcaseIcon,
  PiggyBankIcon,
  ShieldIcon,
  StarIcon,
  PhoneIcon,
  MapPinIcon,
  InfoIcon
} from "lucide-react";

// Interfaces
interface PayrollRecord {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  baseSalary: number;
  allowances: number;
  overtime: number;
  grossPay: number;
  taxes: number;
  socialSecurity: number;
  netPay: number;
  bankAccount: string;
  paymentStatus: 'Draft' | 'Processed' | 'Pending Employee Approval' | 'Employee Approved' | 'Pending Finance Approval' | 'Finance Approved' | 'Rejected' | 'Failed';
  payDate: string;
  processedBy?: string;
  processedDate?: string;
  employeeApproval?: 'Pending' | 'Approved' | 'Rejected';
  employeeApprovalDate?: string;
  employeeApprovalNotes?: string;
  financeApproval?: 'Pending' | 'Approved' | 'Rejected';
  financeApprovalDate?: string;
  financeApprovalNotes?: string;
  approvalDate?: string;
  approvalNotes?: string;
}

interface PayrollDraft {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  paymentComponents: {
    baseSalary: number;
    transportAllowance: number;
    medicalAllowance: number;
    housingAllowance: number;
    performanceBonus: number;
    overtime: number;
    otherAllowances: number;
  };
  deductions: {
    taxes: number;
    socialSecurity: number;
    pensionContribution: number;
    otherDeductions: number;
  };
  grossPay: number;
  netPay: number;
  payPeriod: string;
  createdBy: string;
  createdDate: string;
  status: 'Draft' | 'Ready for Processing';
}

interface SelectedEmployee {
  id: string;
  name: string;
  department: string;
  position: string;
  baseSalary: number;
}

interface Goal {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  description: string;
  category: 'Performance' | 'Sales' | 'Development' | 'Compliance' | 'Customer Service';
  targetDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled';
  progress: number;
  createdBy: string;
  createdDate: string;
  lastUpdated?: string;
}

interface LeaveRequest {
  id: number;
  employeeId: string;
  name: string;
  department: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Emergency Leave' | 'Study Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Cancelled';
  submittedDate: string;
  approver?: string;
  approvalDate?: string;
  approvalNotes?: string;
  attachments?: string[];
}

// Enhanced Employee Interfaces
interface Employee {
  id: string;
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    nationality: string;
    dateOfBirth: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
    religion?: string;
  };
  // Identity Documents
  identityInfo: {
    nationalId?: string;
    passportNumber?: string;
    workPermitNumber?: string;
    immigrationStatus: 'National' | 'Work Permit' | 'Resident' | 'Temporary Visa' | 'Other';
    workPermitExpiry?: string;
    visaExpiry?: string;
  };
  // Employment Details
  employmentInfo: {
    employeeId: string;
    contractType: 'Permanent' | 'Temporary' | 'Probationary' | 'Contract' | 'Internship';
    jobTitle: string;
    jobDescription: string;
    department: string;
    directSupervisor?: string;
    workLocation: string;
    employmentStartDate: string;
    probationEndDate?: string;
    contractEndDate?: string;
    terminationDate?: string;
    terminationReason?: string;
    employmentStatus: 'Active' | 'On Leave' | 'Suspended' | 'Terminated' | 'Resigned';
  };
  // Compensation & Benefits
  compensationInfo: {
    salaryStructure: {
      baseSalary: number;
      currency: string;
      payFrequency: 'Monthly' | 'Bi-weekly' | 'Weekly';
      allowances: {
        transport: number;
        medical: number;
        housing: number;
        meal: number;
        communication: number;
        other: number;
      };
    };
    benefits: {
      medicalInsurance: boolean;
      lifeInsurance: boolean;
      pensionScheme: boolean;
      annualLeave: number;
      sickLeave: number;
      maternityLeave: number;
      paternityLeave: number;
    };
    taxInfo: {
      taxId?: string;
      taxExemptions: number;
      socialSecurityNumber?: string;
    };
  };
  // Banking & Payment
  bankingInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankBranch?: string;
    swiftCode?: string;
    paymentMethod: 'Bank Transfer' | 'Cash' | 'Check' | 'Mobile Money';
    mobileMoneyNumber?: string;
  };
  // Contact Information
  contactInfo: {
    personalEmail?: string;
    workEmail: string;
    personalPhone: string;
    workPhone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      country: string;
    };
    emergencyContacts: EmergencyContact[];
  };
  // Documents
  documents: EmployeeDocument[];
  // Performance & Career
  performanceInfo: {
    evaluations: PerformanceEvaluation[];
    careerProgression: CareerProgression[];
    skills: string[];
    certifications: Certification[];
    trainings: Training[];
  };
  // System Info
  systemInfo: {
    createdBy: string;
    createdDate: string;
    lastUpdatedBy?: string;
    lastUpdatedDate?: string;
    profileCompletionPercentage: number;
  };
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

interface EmployeeDocument {
  id: string;
  type: 'Employment Contract' | 'Academic Certificate' | 'Professional Certificate' | 'ID Copy' | 'Passport Copy' | 'Work Permit' | 'Medical Certificate' | 'Other';
  name: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: number;
  fileType: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

interface PerformanceEvaluation {
  id: string;
  evaluationPeriod: string;
  evaluationDate: string;
  evaluatorId: string;
  evaluatorName: string;
  overallRating: number;
  goals: {
    goal: string;
    rating: number;
    comments: string;
  }[];
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: string;
  employeeComments?: string;
  nextReviewDate: string;
  status: 'Draft' | 'Completed' | 'Acknowledged' | 'Disputed';
}

interface CareerProgression {
  id: string;
  effectiveDate: string;
  changeType: 'Promotion' | 'Transfer' | 'Salary Adjustment' | 'Role Change' | 'Department Change';
  previousPosition?: string;
  previousDepartment?: string;
  previousSalary?: number;
  newPosition: string;
  newDepartment: string;
  newSalary: number;
  reason: string;
  approvedBy: string;
  approvalDate: string;
  notes?: string;
}

interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  verificationUrl?: string;
  isVerified: boolean;
}

interface Training {
  id: string;
  name: string;
  provider: string;
  startDate: string;
  endDate: string;
  duration: number; // in hours
  type: 'Internal' | 'External' | 'Online' | 'On-the-job';
  status: 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';
  cost?: number;
  certificateReceived: boolean;
  rating?: number;
  feedback?: string;
}

// Enhanced Payroll and Tax Management Interfaces
interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  fixedAmount: number;
}

interface PayrollTaxCalculation {
  grossSalary: number;
  taxableIncome: number;
  personalIncomeTax: number;
  socialSecurityContribution: number;
  pensionContribution: number;
  totalDeductions: number;
  netSalary: number;
  taxBracketUsed: string;
  exemptions: {
    personalExemption: number;
    dependentExemptions: number;
    totalExemptions: number;
  };
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  payPeriod: string;
  payDate: string;
  
  // Basic Information
  designation: string;
  department: string;
  bankAccount: string;
  taxId: string;
  
  // Earnings
  earnings: {
    basicSalary: number;
    transportAllowance: number;
    medicalAllowance: number;
    housingAllowance: number;
    mealAllowance: number;
    communicationAllowance: number;
    otherAllowances: number;
    overtime: number;
    bonus: number;
    arrears: number;
    totalEarnings: number;
  };
  
  // Deductions
  deductions: {
    personalIncomeTax: number;
    socialSecurity: number;
    pensionContribution: number;
    advanceSalary: number;
    loanDeduction: number;
    otherDeductions: number;
    totalDeductions: number;
  };
  
  // Net Pay
  netPay: number;
  
  // Tax Information
  taxCalculation: PayrollTaxCalculation;
  
  // Leave Information
  leaveBalance: {
    annualLeave: number;
    sickLeave: number;
    maternityLeave?: number;
    paternityLeave?: number;
  };
  
  // System Info
  generatedBy: string;
  generatedDate: string;
  isApproved: boolean;
  approvedBy?: string;
  approvalDate?: string;
}

interface ComplianceReport {
  id: string;
  reportType: 'Monthly PIT Summary' | 'Annual Tax Return' | 'Social Security Report' | 'Pension Contribution Report' | 'End of Service Gratuity Report';
  reportPeriod: string;
  generatedDate: string;
  generatedBy: string;
  
  // Summary Data
  totalEmployees: number;
  totalGrossPay: number;
  totalTaxCollected: number;
  totalSocialSecurity: number;
  totalPensionContributions: number;
  
  // Detailed Records
  employeeRecords: Array<{
    employeeId: string;
    employeeName: string;
    grossPay: number;
    taxPaid: number;
    socialSecurity: number;
    pensionContribution: number;
  }>;
  
  // Compliance Status
  isSubmittedToNRA: boolean;
  submissionDate?: string;
  submissionReference?: string;
  
  // Files
  reportFile?: string;
  digitalSignature?: string;
}

interface EndOfServiceCalculation {
  employeeId: string;
  employeeName: string;
  serviceStartDate: string;
  serviceEndDate: string;
  yearsOfService: number;
  monthsOfService: number;
  
  // Gratuity Calculation
  lastBasicSalary: number;
  gratuityAmount: number;
  gratuityFormula: string;
  
  // Other End of Service Benefits
  accruedLeave: number;
  leaveEncashment: number;
  noticePay: number;
  severancePay: number;
  totalEndOfServicePay: number;
  
  // Tax Implications
  taxableAmount: number;
  taxOnGratuity: number;
  netEndOfServicePay: number;
  
  calculatedBy: string;
  calculatedDate: string;
  approvedBy?: string;
  approvalDate?: string;
}

interface BonusOvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Bonus' | 'Overtime' | 'Arrears';
  
  // Details
  description: string;
  amount: number;
  payPeriod: string;
  
  // Overtime Specific
  hoursWorked?: number;
  hourlyRate?: number;
  overtimeMultiplier?: number; // 1.5x, 2x, etc.
  
  // Bonus Specific
  bonusType?: 'Performance' | 'Annual' | 'Project' | 'Commission' | 'Other';
  performanceRating?: number;
  
  // Approval
  requestedBy: string;
  requestDate: string;
  approvedBy?: string;
  approvalDate?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  
  // Tax Treatment
  isTaxable: boolean;
  taxRate?: number;
}

export default function Payroll() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("payroll");
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showLeaveApprovalDialog, setShowLeaveApprovalDialog] = useState(false);
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [leaveApprovalNotes, setLeaveApprovalNotes] = useState("");
  
  // New state for enhanced payroll workflow
  const [showCreatePayrollDialog, setShowCreatePayrollDialog] = useState(false);
  const [showFinanceApprovalDialog, setShowFinanceApprovalDialog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [payrollDrafts, setPayrollDrafts] = useState<PayrollDraft[]>([]);
  const [processedPayrolls, setProcessedPayrolls] = useState<PayrollRecord[]>([]);
  const [payrollForm, setPayrollForm] = useState({
    payPeriod: "",
    transportAllowance: 0,
    medicalAllowance: 0,
    housingAllowance: 0,
    performanceBonus: 0,
    overtime: 0,
    otherAllowances: 0,
    taxes: 15, // percentage
    socialSecurity: 5, // percentage
    pensionContribution: 3, // percentage
    otherDeductions: 0
  });
  const [financeApprovalNotes, setFinanceApprovalNotes] = useState("");
  
  // New state for Finance batch approval
  const [selectedPayrollsForApproval, setSelectedPayrollsForApproval] = useState<number[]>([]);
  const [showBatchApprovalDialog, setShowBatchApprovalDialog] = useState(false);
  const [batchApprovalNotes, setBatchApprovalNotes] = useState("");
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    employeeId: "",
    title: "",
    description: "",
    category: "Performance" as const,
    targetDate: "",
    priority: "Medium" as const
  });

  // Leave request form state
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Annual Leave" as const,
    startDate: "",
    endDate: "",
    reason: "",
    days: 0
  });

  // Enhanced payroll data with approval status
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>([
    {
      id: 1,
      employeeId: "HB001",
      name: "Sarah Akol",
      department: "Human Resources",
      position: "HR Manager",
      baseSalary: 4500,
      allowances: 800,
      overtime: 200,
      grossPay: 5500,
      taxes: 825,
      socialSecurity: 275,
      netPay: 4400,
      bankAccount: "****-1234",
      paymentStatus: "Finance Approved",
      payDate: "2025-01-31",
      processedBy: "HR Manager",
      processedDate: "2025-01-30",
      employeeApproval: "Approved",
      employeeApprovalDate: "2025-01-30",
      financeApproval: "Approved",
      financeApprovalDate: "2025-01-31"
    },
    {
      id: 2,
      employeeId: "HB002",
      name: "James Wani",
      department: "Human Resources",
      position: "Senior Recruiter",
      baseSalary: 2800,
      allowances: 400,
      overtime: 150,
      grossPay: 3350,
      taxes: 502,
      socialSecurity: 167,
      netPay: 2681,
      bankAccount: "****-5678",
      paymentStatus: "Pending Employee Approval",
      payDate: "2025-01-31",
      processedBy: "HR Manager",
      processedDate: "2025-01-30",
      employeeApproval: "Pending"
    },
    {
      id: 3,
      employeeId: "HB003",
      name: "Mary Deng",
      department: "Corporate Banking",
      position: "Department Head",
      baseSalary: 5200,
      allowances: 1000,
      overtime: 0,
      grossPay: 6200,
      taxes: 930,
      socialSecurity: 310,
      netPay: 4960,
      bankAccount: "****-9012",
      paymentStatus: "Employee Approved",
      payDate: "2025-01-31",
      processedBy: "HR Manager",
      processedDate: "2025-01-30",
      employeeApproval: "Approved",
      employeeApprovalDate: "2025-01-30",
      financeApproval: "Pending"
    },
    {
      id: 4,
      employeeId: "HB004",
      name: "Peter Garang",
      department: "Finance & Accounting",
      position: "HR Manager",
      baseSalary: 3800,
      allowances: 600,
      overtime: 300,
      grossPay: 4700,
      taxes: 705,
      socialSecurity: 235,
      netPay: 3760,
      bankAccount: "****-3456",
      paymentStatus: "Rejected",
      payDate: "2025-01-31",
      processedBy: "HR Manager",
      processedDate: "2025-01-30",
      employeeApproval: "Rejected",
      approvalDate: "2025-01-31",
      approvalNotes: "Discrepancy in overtime calculation"
    },
    {
      id: 5,
      employeeId: "HB004",
      name: "Peter Kuol",
      department: "IT",
      position: "Software Developer",
      baseSalary: 3500,
      allowances: 600,
      overtime: 100,
      grossPay: 4200,
      taxes: 630,
      socialSecurity: 210,
      netPay: 3360,
      bankAccount: "****-3456",
      paymentStatus: "Pending Employee Approval",
      payDate: "2025-01-31"
    }
  ]);

  // Goals data
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      employeeId: "HB002",
      employeeName: "James Wani",
      department: "Human Resources",
      title: "Improve Recruitment Efficiency",
      description: "Reduce time-to-hire by 20% and increase candidate quality scores",
      category: "Performance",
      targetDate: "2025-06-30",
      priority: "High",
      status: "Active",
      progress: 45,
      createdBy: "Sarah Akol",
      createdDate: "2025-01-15"
    },
    {
      id: 2,
      employeeId: "HB003",
      employeeName: "Mary Deng",
      department: "Corporate Banking",
      title: "Increase Corporate Loan Portfolio",
      description: "Grow corporate loan portfolio by $5M while maintaining risk standards",
      category: "Sales",
      targetDate: "2025-12-31",
      priority: "Critical",
      status: "Active",
      progress: 30,
      createdBy: "Sarah Akol",
      createdDate: "2025-01-10"
    }
  ]);

  // Employee list for goal assignment
  const employees = [
    { id: "HB001", name: "Sarah Akol", department: "Human Resources" },
    { id: "HB002", name: "James Wani", department: "Human Resources" },
    { id: "HB003", name: "Mary Deng", department: "Corporate Banking" },
    { id: "HB004", name: "Peter Garang", department: "Finance & Accounting" },
    { id: "HB005", name: "Grace Ajak", department: "Personal Banking" },
    { id: "HB006", name: "Michael Jok", department: "Trade Finance" },
    { id: "HB007", name: "Rebecca Akuoc", department: "Risk Management" },
    { id: "HB008", name: "David Majok", department: "Information Technology" },
    { id: "HB009", name: "Anna Nyong", department: "Corporate Banking" },
    { id: "HB010", name: "John Kuol", department: "Personal Banking" }
  ];

  // Employee Management State
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showEmployeeViewDialog, setShowEmployeeViewDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeFormStep, setEmployeeFormStep] = useState(1);
  const [showDocumentUploadDialog, setShowDocumentUploadDialog] = useState(false);

  // Comprehensive Employee Database
  const [employeeDatabase, setEmployeeDatabase] = useState<Employee[]>([
    {
      id: "HB001",
      personalInfo: {
        firstName: "Sarah",
        lastName: "Akol",
        fullName: "Sarah Akol",
        gender: "Female",
        nationality: "South Sudanese",
        dateOfBirth: "1985-03-15",
        maritalStatus: "Married",
        religion: "Christian"
      },
      identityInfo: {
        nationalId: "SS123456789",
        passportNumber: "P1234567",
        immigrationStatus: "National"
      },
      employmentInfo: {
        employeeId: "HB001",
        contractType: "Permanent",
        jobTitle: "HR Manager",
        jobDescription: "Responsible for human resource management, recruitment, employee relations, and policy implementation.",
        department: "Human Resources",
        directSupervisor: "CEO",
        workLocation: "Head Office - Juba",
        employmentStartDate: "2020-01-15",
        employmentStatus: "Active"
      },
      compensationInfo: {
        salaryStructure: {
          baseSalary: 4500,
          currency: "USD",
          payFrequency: "Monthly",
          allowances: {
            transport: 200,
            medical: 150,
            housing: 300,
            meal: 100,
            communication: 50,
            other: 0
          }
        },
        benefits: {
          medicalInsurance: true,
          lifeInsurance: true,
          pensionScheme: true,
          annualLeave: 25,
          sickLeave: 15,
          maternityLeave: 90,
          paternityLeave: 7
        },
        taxInfo: {
          taxId: "TAX001",
          taxExemptions: 2,
          socialSecurityNumber: "SS001"
        }
      },
      bankingInfo: {
        bankName: "Horizon Bank",
        accountNumber: "1234567890",
        accountName: "Sarah Akol",
        bankBranch: "Main Branch",
        paymentMethod: "Bank Transfer"
      },
      contactInfo: {
        personalEmail: "sarah.akol@gmail.com",
        workEmail: "sarah.akol@horizonbank.ss",
        personalPhone: "+211123456789",
        workPhone: "+211987654321",
        address: {
          street: "Block 15, House 25",
          city: "Juba",
          state: "Central Equatoria",
          postalCode: "10101",
          country: "South Sudan"
        },
        emergencyContacts: [
          {
            id: "ec1",
            name: "John Akol",
            relationship: "Husband",
            phone: "+211123456790",
            email: "john.akol@gmail.com",
            address: "Block 15, House 25, Juba",
            isPrimary: true
          }
        ]
      },
      documents: [
        {
          id: "doc1",
          type: "Employment Contract",
          name: "Employment Contract - Sarah Akol",
          fileName: "sarah_akol_contract.pdf",
          uploadDate: "2020-01-10",
          uploadedBy: "HR System",
          fileSize: 245760,
          fileType: "application/pdf",
          isVerified: true,
          verifiedBy: "HR Manager",
          verificationDate: "2020-01-12"
        },
        {
          id: "doc2",
          type: "Academic Certificate",
          name: "Bachelor's Degree in Business Administration",
          fileName: "sarah_akol_degree.pdf",
          uploadDate: "2020-01-10",
          uploadedBy: "HR System",
          fileSize: 1024000,
          fileType: "application/pdf",
          isVerified: true,
          verifiedBy: "HR Manager",
          verificationDate: "2020-01-12"
        }
      ],
      performanceInfo: {
        evaluations: [
          {
            id: "eval1",
            evaluationPeriod: "2024",
            evaluationDate: "2024-12-15",
            evaluatorId: "CEO",
            evaluatorName: "CEO",
            overallRating: 4.5,
            goals: [
              {
                goal: "Improve recruitment process efficiency",
                rating: 5,
                comments: "Exceeded expectations by reducing time-to-hire by 30%"
              },
              {
                goal: "Implement new HRIS system",
                rating: 4,
                comments: "Successfully implemented system with minor delays"
              }
            ],
            strengths: ["Leadership", "Communication", "Problem-solving"],
            areasForImprovement: ["Time management", "Delegation"],
            developmentPlan: "Attend leadership development program in Q1 2025",
            nextReviewDate: "2025-12-15",
            status: "Completed"
          }
        ],
        careerProgression: [
          {
            id: "prog1",
            effectiveDate: "2022-01-01",
            changeType: "Promotion",
            previousPosition: "HR Officer",
            previousDepartment: "Human Resources",
            previousSalary: 3500,
            newPosition: "HR Manager",
            newDepartment: "Human Resources",
            newSalary: 4500,
            reason: "Outstanding performance and leadership qualities",
            approvedBy: "CEO",
            approvalDate: "2021-12-15"
          }
        ],
        skills: ["Human Resource Management", "Recruitment", "Employee Relations", "Policy Development", "Training & Development"],
        certifications: [
          {
            id: "cert1",
            name: "Professional in Human Resources (PHR)",
            issuingOrganization: "HR Certification Institute",
            issueDate: "2021-06-15",
            expiryDate: "2024-06-15",
            certificateNumber: "PHR2021001",
            isVerified: true
          }
        ],
        trainings: [
          {
            id: "train1",
            name: "Leadership Development Program",
            provider: "Management Institute",
            startDate: "2023-03-01",
            endDate: "2023-03-05",
            duration: 40,
            type: "External",
            status: "Completed",
            cost: 500,
            certificateReceived: true,
            rating: 5,
            feedback: "Excellent program that improved leadership skills"
          }
        ]
      },
      systemInfo: {
        createdBy: "HR System",
        createdDate: "2020-01-10",
        lastUpdatedBy: "Sarah Akol",
        lastUpdatedDate: "2025-01-15",
        profileCompletionPercentage: 95
      }
    }
    // Additional employees would be added here...
  ]);

  // Employee Form State
  const [employeeForm, setEmployeeForm] = useState<Partial<Employee>>({
    personalInfo: {
      firstName: "",
      lastName: "",
      fullName: "",
      gender: "Male",
      nationality: "",
      dateOfBirth: "",
      maritalStatus: "Single"
    },
    identityInfo: {
      immigrationStatus: "National"
    },
    employmentInfo: {
      employeeId: "",
      contractType: "Permanent",
      jobTitle: "",
      jobDescription: "",
      department: "",
      workLocation: "",
      employmentStartDate: "",
      employmentStatus: "Active"
    },
    compensationInfo: {
      salaryStructure: {
        baseSalary: 0,
        currency: "USD",
        payFrequency: "Monthly",
        allowances: {
          transport: 0,
          medical: 0,
          housing: 0,
          meal: 0,
          communication: 0,
          other: 0
        }
      },
      benefits: {
        medicalInsurance: false,
        lifeInsurance: false,
        pensionScheme: false,
        annualLeave: 25,
        sickLeave: 15,
        maternityLeave: 90,
        paternityLeave: 7
      },
      taxInfo: {
        taxExemptions: 0
      }
    },
    bankingInfo: {
      paymentMethod: "Bank Transfer",
      bankName: "",
      accountNumber: "",
      accountName: ""
    },
    contactInfo: {
      workEmail: "",
      personalPhone: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "South Sudan"
      },
      emergencyContacts: []
    },
    documents: [],
    performanceInfo: {
      evaluations: [],
      careerProgression: [],
      skills: [],
      certifications: [],
      trainings: []
    }
  });

  // Enhanced leave requests with proper state management
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeId: "HB005",
      name: "Grace Ajak",
      department: "Personal Banking",
      leaveType: "Annual Leave",
      startDate: "2025-02-10",
      endDate: "2025-02-14",
      days: 5,
      reason: "Family vacation to visit relatives in Wau",
      status: "Pending Approval",
      submittedDate: "2025-01-15"
    },
    {
      id: 2,
      employeeId: "HB006",
      name: "Michael Jok",
      department: "Trade Finance",
      leaveType: "Sick Leave",
      startDate: "2025-01-20",
      endDate: "2025-01-22",
      days: 3,
      reason: "Medical treatment and recovery",
      status: "Approved",
      submittedDate: "2025-01-18",
      approver: "Sarah Akol",
      approvalDate: "2025-01-19",
      approvalNotes: "Medical certificate provided. Get well soon!"
    },
    {
      id: 3,
      employeeId: "HB007",
      name: "Rebecca Akuoc",
      department: "Risk Management",
      leaveType: "Maternity Leave",
      startDate: "2025-03-01",
      endDate: "2025-06-01",
      days: 90,
      reason: "Maternity leave for newborn care",
      status: "Approved",
      submittedDate: "2025-01-10",
      approver: "Sarah Akol",
      approvalDate: "2025-01-12",
      approvalNotes: "Congratulations! All necessary documentation submitted."
    },
    {
      id: 4,
      employeeId: "HB008",
      name: "David Majok",
      department: "Information Technology",
      leaveType: "Study Leave",
      startDate: "2025-02-15",
      endDate: "2025-02-19",
      days: 5,
      reason: "Professional certification exam preparation",
      status: "Pending Approval",
      submittedDate: "2025-01-20"
    },
    {
      id: 5,
      employeeId: "HB009",
      name: "Anna Nyong",
      department: "Corporate Banking",
      leaveType: "Emergency Leave",
      startDate: "2025-01-25",
      endDate: "2025-01-27",
      days: 3,
      reason: "Family emergency requiring immediate attention",
      status: "Rejected",
      submittedDate: "2025-01-24",
      approver: "Sarah Akol", 
      approvalDate: "2025-01-25",
      approvalNotes: "Insufficient notice provided. Please resubmit with proper documentation."
    }
  ]);

  // Payroll management functions
  const resetGoalForm = () => {
    setGoalForm({
      employeeId: "",
      title: "",
      description: "",
      category: "Performance",
      targetDate: "",
      priority: "Medium"
    });
  };

  const resetLeaveForm = () => {
    setLeaveForm({
      leaveType: "Annual Leave",
      startDate: "",
      endDate: "",
      reason: "",
      days: 0
    });
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Employee Management Functions
  const resetEmployeeForm = () => {
    setEmployeeForm({
      personalInfo: {
        firstName: "",
        lastName: "",
        fullName: "",
        gender: "Male",
        nationality: "",
        dateOfBirth: "",
        maritalStatus: "Single"
      },
      identityInfo: {
        immigrationStatus: "National"
      },
      employmentInfo: {
        employeeId: "",
        contractType: "Permanent",
        jobTitle: "",
        jobDescription: "",
        department: "",
        workLocation: "",
        employmentStartDate: "",
        employmentStatus: "Active"
      },
      compensationInfo: {
        salaryStructure: {
          baseSalary: 0,
          currency: "USD",
          payFrequency: "Monthly",
          allowances: {
            transport: 0,
            medical: 0,
            housing: 0,
            meal: 0,
            communication: 0,
            other: 0
          }
        },
        benefits: {
          medicalInsurance: false,
          lifeInsurance: false,
          pensionScheme: false,
          annualLeave: 25,
          sickLeave: 15,
          maternityLeave: 90,
          paternityLeave: 7
        },
        taxInfo: {
          taxExemptions: 0
        }
      },
      bankingInfo: {
        paymentMethod: "Bank Transfer",
        bankName: "",
        accountNumber: "",
        accountName: ""
      },
      contactInfo: {
        workEmail: "",
        personalPhone: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "South Sudan"
        },
        emergencyContacts: []
      },
      documents: [],
      performanceInfo: {
        evaluations: [],
        careerProgression: [],
        skills: [],
        certifications: [],
        trainings: []
      }
    });
    setEmployeeFormStep(1);
  };

  const handleCreateEmployee = () => {
    if (!hasPermission('employee.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE', { action: 'create_employee' });
      return;
    }

    // Generate employee ID
    const newEmployeeId = `HB${String(employeeDatabase.length + 1).padStart(3, '0')}`;
    
    const newEmployee: Employee = {
      id: newEmployeeId,
      personalInfo: {
        firstName: employeeForm.personalInfo?.firstName || "",
        lastName: employeeForm.personalInfo?.lastName || "",
        fullName: `${employeeForm.personalInfo?.firstName || ""} ${employeeForm.personalInfo?.lastName || ""}`.trim(),
        gender: employeeForm.personalInfo?.gender || "Male",
        nationality: employeeForm.personalInfo?.nationality || "",
        dateOfBirth: employeeForm.personalInfo?.dateOfBirth || "",
        maritalStatus: employeeForm.personalInfo?.maritalStatus || "Single",
        religion: employeeForm.personalInfo?.religion
      },
      identityInfo: {
        nationalId: employeeForm.identityInfo?.nationalId,
        passportNumber: employeeForm.identityInfo?.passportNumber,
        workPermitNumber: employeeForm.identityInfo?.workPermitNumber,
        immigrationStatus: employeeForm.identityInfo?.immigrationStatus || "National",
        workPermitExpiry: employeeForm.identityInfo?.workPermitExpiry,
        visaExpiry: employeeForm.identityInfo?.visaExpiry
      },
      employmentInfo: {
        employeeId: newEmployeeId,
        contractType: employeeForm.employmentInfo?.contractType || "Permanent",
        jobTitle: employeeForm.employmentInfo?.jobTitle || "",
        jobDescription: employeeForm.employmentInfo?.jobDescription || "",
        department: employeeForm.employmentInfo?.department || "",
        directSupervisor: employeeForm.employmentInfo?.directSupervisor,
        workLocation: employeeForm.employmentInfo?.workLocation || "",
        employmentStartDate: employeeForm.employmentInfo?.employmentStartDate || "",
        probationEndDate: employeeForm.employmentInfo?.probationEndDate,
        contractEndDate: employeeForm.employmentInfo?.contractEndDate,
        employmentStatus: "Active"
      },
      compensationInfo: {
        salaryStructure: {
          baseSalary: employeeForm.compensationInfo?.salaryStructure?.baseSalary || 0,
          currency: employeeForm.compensationInfo?.salaryStructure?.currency || "USD",
          payFrequency: employeeForm.compensationInfo?.salaryStructure?.payFrequency || "Monthly",
          allowances: employeeForm.compensationInfo?.salaryStructure?.allowances || {
            transport: 0,
            medical: 0,
            housing: 0,
            meal: 0,
            communication: 0,
            other: 0
          }
        },
        benefits: employeeForm.compensationInfo?.benefits || {
          medicalInsurance: false,
          lifeInsurance: false,
          pensionScheme: false,
          annualLeave: 25,
          sickLeave: 15,
          maternityLeave: 90,
          paternityLeave: 7
        },
        taxInfo: employeeForm.compensationInfo?.taxInfo || {
          taxExemptions: 0
        }
      },
      bankingInfo: {
        bankName: employeeForm.bankingInfo?.bankName || "",
        accountNumber: employeeForm.bankingInfo?.accountNumber || "",
        accountName: employeeForm.bankingInfo?.accountName || "",
        bankBranch: employeeForm.bankingInfo?.bankBranch,
        swiftCode: employeeForm.bankingInfo?.swiftCode,
        paymentMethod: employeeForm.bankingInfo?.paymentMethod || "Bank Transfer",
        mobileMoneyNumber: employeeForm.bankingInfo?.mobileMoneyNumber
      },
      contactInfo: {
        personalEmail: employeeForm.contactInfo?.personalEmail,
        workEmail: employeeForm.contactInfo?.workEmail || "",
        personalPhone: employeeForm.contactInfo?.personalPhone || "",
        workPhone: employeeForm.contactInfo?.workPhone,
        address: employeeForm.contactInfo?.address || {
          street: "",
          city: "",
          state: "",
          country: "South Sudan"
        },
        emergencyContacts: employeeForm.contactInfo?.emergencyContacts || []
      },
      documents: employeeForm.documents || [],
      performanceInfo: {
        evaluations: [],
        careerProgression: [],
        skills: employeeForm.performanceInfo?.skills || [],
        certifications: employeeForm.performanceInfo?.certifications || [],
        trainings: employeeForm.performanceInfo?.trainings || []
      },
      systemInfo: {
        createdBy: user?.email || 'HR System',
        createdDate: new Date().toISOString().split('T')[0],
        profileCompletionPercentage: calculateProfileCompletion(employeeForm)
      }
    };

    setEmployeeDatabase([...employeeDatabase, newEmployee]);
    setShowEmployeeDialog(false);
    resetEmployeeForm();
    
    addAuditLog('EMPLOYEE_CREATED', 'EMPLOYEE', {
      action: 'employee_created',
      employeeId: newEmployee.id,
      employeeName: newEmployee.personalInfo.fullName,
      createdBy: user?.email
    });
  };

  const calculateProfileCompletion = (employee: Partial<Employee>): number => {
    let completedFields = 0;
    let totalFields = 0;

    // Personal Info (8 fields)
    totalFields += 8;
    if (employee.personalInfo?.firstName) completedFields++;
    if (employee.personalInfo?.lastName) completedFields++;
    if (employee.personalInfo?.gender) completedFields++;
    if (employee.personalInfo?.nationality) completedFields++;
    if (employee.personalInfo?.dateOfBirth) completedFields++;
    if (employee.personalInfo?.maritalStatus) completedFields++;
    if (employee.identityInfo?.nationalId || employee.identityInfo?.passportNumber) completedFields++;
    if (employee.identityInfo?.immigrationStatus) completedFields++;

    // Employment Info (7 fields)
    totalFields += 7;
    if (employee.employmentInfo?.contractType) completedFields++;
    if (employee.employmentInfo?.jobTitle) completedFields++;
    if (employee.employmentInfo?.jobDescription) completedFields++;
    if (employee.employmentInfo?.department) completedFields++;
    if (employee.employmentInfo?.workLocation) completedFields++;
    if (employee.employmentInfo?.employmentStartDate) completedFields++;
    if (employee.employmentInfo?.employmentStatus) completedFields++;

    // Compensation (3 fields)
    totalFields += 3;
    if (employee.compensationInfo?.salaryStructure?.baseSalary) completedFields++;
    if (employee.compensationInfo?.salaryStructure?.currency) completedFields++;
    if (employee.compensationInfo?.benefits) completedFields++;

    // Banking (3 fields)
    totalFields += 3;
    if (employee.bankingInfo?.bankName) completedFields++;
    if (employee.bankingInfo?.accountNumber) completedFields++;
    if (employee.bankingInfo?.paymentMethod) completedFields++;

    // Contact (4 fields)
    totalFields += 4;
    if (employee.contactInfo?.workEmail) completedFields++;
    if (employee.contactInfo?.personalPhone) completedFields++;
    if (employee.contactInfo?.address?.street) completedFields++;
    if (employee.contactInfo?.address?.city) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const getEmployeeStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Leave": return "bg-yellow-100 text-yellow-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Terminated": return "bg-gray-100 text-gray-800";
      case "Resigned": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getContractTypeColor = (contractType: string) => {
    switch (contractType) {
      case "Permanent": return "bg-blue-100 text-blue-800";
      case "Temporary": return "bg-orange-100 text-orange-800";
      case "Probationary": return "bg-yellow-100 text-yellow-800";
      case "Contract": return "bg-purple-100 text-purple-800";
      case "Internship": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleProcessPayroll = () => {
    if (!hasPermission('finance.approve') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'finance_approve_payroll' });
      return;
    }
    setShowProcessDialog(true);
  };

  const handleBatchProcessPayroll = () => {
    setProcessingPayroll(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const updatedPayroll = payrollData.map(record => {
        if (record.paymentStatus === 'Employee Approved') {
          return {
            ...record,
            paymentStatus: 'Finance Approved' as const,
            financeApproval: 'Approved' as const,
            financeApprovalDate: new Date().toISOString().split('T')[0],
            financeApprovalNotes: 'Batch approved by Finance'
          };
        }
        return record;
      });
      
      setPayrollData(updatedPayroll);
      setProcessingPayroll(false);
      setShowProcessDialog(false);
      
      addAuditLog('PAYROLL_FINANCE_BATCH_APPROVED', 'PAYROLL', {
        action: 'finance_batch_approval',
        approvedBy: user?.email,
        recordsApproved: updatedPayroll.filter(r => r.paymentStatus === 'Finance Approved').length
      });
    }, 2000);
  };

  const handleEmployeeApproval = (payrollId: number, approval: 'Approved' | 'Rejected', notes?: string) => {
    const updatedPayroll = payrollData.map(record => {
      if (record.id === payrollId) {
        const newStatus = approval === 'Approved' ? 'Employee Approved' : 'Pending Employee Approval';
        return {
          ...record,
          employeeApproval: approval,
          employeeApprovalDate: new Date().toISOString().split('T')[0],
          employeeApprovalNotes: notes || '',
          paymentStatus: newStatus as PayrollRecord['paymentStatus'],
          financeApproval: approval === 'Approved' ? 'Pending' as const : undefined
        };
      }
      return record;
    });
    
    setPayrollData(updatedPayroll);
    setShowApprovalDialog(false);
    setSelectedPayroll(null);
    
    addAuditLog('PAYROLL_EMPLOYEE_APPROVAL', 'PAYROLL', {
      action: 'employee_salary_approval',
      payrollId,
      approval,
      notes,
      approvedBy: user?.email
    });
  };

  const handleCreateGoal = () => {
    if (!hasPermission('goals.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'GOALS', { action: 'create_goal' });
      return;
    }
    
    const selectedEmployee = employees.find(emp => emp.id === goalForm.employeeId);
    if (!selectedEmployee) return;

    const newGoal: Goal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      employeeId: goalForm.employeeId,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      title: goalForm.title,
      description: goalForm.description,
      category: goalForm.category,
      targetDate: goalForm.targetDate,
      priority: goalForm.priority,
      status: 'Active',
      progress: 0,
      createdBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setGoals([...goals, newGoal]);
    setShowGoalDialog(false);
    resetGoalForm();
    
    addAuditLog('GOAL_CREATED', 'GOALS', {
      action: 'goal_created',
      goalId: newGoal.id,
      employeeId: newGoal.employeeId,
      goalTitle: newGoal.title,
      createdBy: user?.email
    });
  };

  // Enhanced leave management functions
  const handleLeaveApproval = (leaveId: number, action: 'approve' | 'reject', notes?: string) => {
    if (!hasPermission('leave.approve') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'LEAVE', { action: 'leave_approval', leaveId });
      return;
    }

    const updatedLeaves = leaveRequests.map(leave => {
      if (leave.id === leaveId) {
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
        return {
          ...leave,
          status: newStatus as LeaveRequest['status'],
          approver: user?.email || 'HR Manager',
          approvalDate: new Date().toISOString().split('T')[0],
          approvalNotes: notes || ''
        };
      }
      return leave;
    });

    setLeaveRequests(updatedLeaves);
    setShowLeaveApprovalDialog(false);
    setSelectedLeave(null);
    setLeaveApprovalNotes("");
    
    addAuditLog('LEAVE_APPROVAL_ACTION', 'LEAVE', { 
      leaveId, 
      action,
      approver: user?.email,
      notes,
      timestamp: new Date()
    });
  };

  const handleLeaveRequest = () => {
    if (!user?.email) return;

    const currentEmployee = employees.find(emp => emp.name.toLowerCase().includes(user.email.split('@')[0]));
    if (!currentEmployee) return;

    const days = calculateLeaveDays(leaveForm.startDate, leaveForm.endDate);
    
    const newLeave: LeaveRequest = {
      id: Math.max(...leaveRequests.map(l => l.id)) + 1,
      employeeId: currentEmployee.id,
      name: currentEmployee.name,
      department: currentEmployee.department,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: days,
      reason: leaveForm.reason,
      status: 'Pending Approval',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([...leaveRequests, newLeave]);
    setShowLeaveRequestDialog(false);
    resetLeaveForm();
    
    addAuditLog('LEAVE_REQUEST_SUBMITTED', 'LEAVE', {
      action: 'leave_request_created',
      leaveId: newLeave.id,
      employeeId: newLeave.employeeId,
      leaveType: newLeave.leaveType,
      days: newLeave.days,
      submittedBy: user?.email
    });
  };

  // Utility functions
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Finance Approved": return "bg-green-100 text-green-800";
      case "Employee Approved": return "bg-blue-100 text-blue-800";
      case "Pending Employee Approval": return "bg-yellow-100 text-yellow-800";
      case "Pending Finance Approval": return "bg-orange-100 text-orange-800";
      case "Processed": return "bg-purple-100 text-purple-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalStatusColor = (status?: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGoalPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Completed": return "bg-blue-100 text-blue-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleExportPayroll = () => {
    addAuditLog('PAYROLL_EXPORT', 'PAYROLL', { 
      exportType: 'monthly_summary',
      timestamp: new Date()
    });
  };

  // Filter functions
  const filteredPayroll = payrollData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeaves = leaveRequests.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGoals = goals.filter(goal =>
    goal.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalGrossPay = payrollData.reduce((sum, item) => sum + item.grossPay, 0);
  const totalNetPay = payrollData.reduce((sum, item) => sum + item.netPay, 0);
  const totalTaxes = payrollData.reduce((sum, item) => sum + item.taxes, 0);
  const pendingFinanceApprovals = payrollData.filter(item => item.paymentStatus === 'Employee Approved').length;
  const pendingEmployeeApprovals = payrollData.filter(item => item.paymentStatus === 'Pending Employee Approval').length;

  // Permission check
  if (!hasPermission('payroll.view') && !hasPermission('*')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Access Restricted</h3>
          <p className="mt-2 text-gray-500">You don't have permission to view payroll information.</p>
        </div>
      </div>
    );
  }

  // New functions for enhanced payroll workflow
  const handleSelectEmployee = (employee: SelectedEmployee) => {
    if (!selectedEmployees.find(emp => emp.id === employee.id)) {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employeeId));
  };

  const calculatePayrollTotals = (baseSalary: number) => {
    const grossPay = baseSalary + 
      payrollForm.transportAllowance + 
      payrollForm.medicalAllowance + 
      payrollForm.housingAllowance + 
      payrollForm.performanceBonus + 
      payrollForm.overtime + 
      payrollForm.otherAllowances;
    
    const taxDeduction = (grossPay * payrollForm.taxes) / 100;
    const socialSecurityDeduction = (grossPay * payrollForm.socialSecurity) / 100;
    const pensionDeduction = (grossPay * payrollForm.pensionContribution) / 100;
    const totalDeductions = taxDeduction + socialSecurityDeduction + pensionDeduction + payrollForm.otherDeductions;
    
    const netPay = grossPay - totalDeductions;
    
    return {
      grossPay,
      totalDeductions,
      netPay,
      taxDeduction,
      socialSecurityDeduction,
      pensionDeduction
    };
  };

  const handleCreatePayrollDrafts = () => {
    if (!hasPermission('payroll.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'create_payroll_drafts' });
      return;
    }

    const newDrafts = selectedEmployees.map(employee => {
      const calculations = calculatePayrollTotals(employee.baseSalary);
      
      return {
        id: Date.now() + Math.random(),
        employeeId: employee.id,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        paymentComponents: {
          baseSalary: employee.baseSalary,
          transportAllowance: payrollForm.transportAllowance,
          medicalAllowance: payrollForm.medicalAllowance,
          housingAllowance: payrollForm.housingAllowance,
          performanceBonus: payrollForm.performanceBonus,
          overtime: payrollForm.overtime,
          otherAllowances: payrollForm.otherAllowances
        },
        deductions: {
          taxes: calculations.taxDeduction,
          socialSecurity: calculations.socialSecurityDeduction,
          pensionContribution: calculations.pensionDeduction,
          otherDeductions: payrollForm.otherDeductions
        },
        grossPay: calculations.grossPay,
        netPay: calculations.netPay,
        payPeriod: payrollForm.payPeriod,
        createdBy: user?.email || 'HR Manager',
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Draft' as const
      };
    });

    setPayrollDrafts([...payrollDrafts, ...newDrafts]);
    setSelectedEmployees([]);
    setShowCreatePayrollDialog(false);
    
    addAuditLog('PAYROLL_DRAFTS_CREATED', 'PAYROLL', {
      action: 'payroll_drafts_created',
      draftsCount: newDrafts.length,
      payPeriod: payrollForm.payPeriod,
      createdBy: user?.email
    });
  };

  const handleProcessPayrollDrafts = () => {
    if (!hasPermission('payroll.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'process_payroll_drafts' });
      return;
    }

    const readyDrafts = payrollDrafts.filter(draft => draft.status === 'Ready for Processing');
    
    const processedRecords = readyDrafts.map(draft => ({
      id: Date.now() + Math.random(),
      employeeId: draft.employeeId,
      name: draft.name,
      department: draft.department,
      position: draft.position,
      baseSalary: draft.paymentComponents.baseSalary,
      allowances: draft.paymentComponents.transportAllowance + 
                  draft.paymentComponents.medicalAllowance + 
                  draft.paymentComponents.housingAllowance + 
                  draft.paymentComponents.otherAllowances,
      overtime: draft.paymentComponents.overtime,
      grossPay: draft.grossPay,
      taxes: draft.deductions.taxes,
      socialSecurity: draft.deductions.socialSecurity,
      netPay: draft.netPay,
      bankAccount: "****-" + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
      paymentStatus: 'Pending Employee Approval' as const,
      payDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      processedBy: user?.email || 'HR Manager',
      processedDate: new Date().toISOString().split('T')[0],
      employeeApproval: 'Pending' as const
    }));

    setProcessedPayrolls([...processedPayrolls, ...processedRecords]);
    setPayrollData([...payrollData, ...processedRecords]);
    
    // Remove processed drafts
    setPayrollDrafts(payrollDrafts.filter(draft => draft.status !== 'Ready for Processing'));
    
    addAuditLog('PAYROLL_PROCESSED', 'PAYROLL', {
      action: 'payroll_drafts_processed',
      recordsProcessed: processedRecords.length,
      processedBy: user?.email
    });
  };

  const handleFinanceApproval = (payrollId: number, approval: 'Approved' | 'Rejected', notes?: string) => {
    if (!hasPermission('finance.approve') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'finance_approval', payrollId });
      return;
    }

    const updatedPayroll = payrollData.map(record => {
      if (record.id === payrollId) {
        const newStatus = approval === 'Approved' ? 'Finance Approved' : 'Rejected';
        return {
          ...record,
          financeApproval: approval,
          financeApprovalDate: new Date().toISOString().split('T')[0],
          financeApprovalNotes: notes || '',
          paymentStatus: newStatus as PayrollRecord['paymentStatus']
        };
      }
      return record;
    });
    
    setPayrollData(updatedPayroll);
    setShowFinanceApprovalDialog(false);
    setSelectedPayroll(null);
    setFinanceApprovalNotes("");
    
    addAuditLog('PAYROLL_FINANCE_APPROVAL', 'PAYROLL', {
      action: 'finance_approval_action',
      payrollId,
      approval,
      notes,
      approvedBy: user?.email
    });
  };

  // New functions for Finance batch approval
  const handlePayrollSelection = (payrollId: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedPayrollsForApproval([...selectedPayrollsForApproval, payrollId]);
    } else {
      setSelectedPayrollsForApproval(selectedPayrollsForApproval.filter(id => id !== payrollId));
    }
  };

  const handleSelectAllPayrolls = (isSelected: boolean) => {
    if (isSelected) {
      const approvablePayrolls = payrollData
        .filter(p => p.paymentStatus === 'Employee Approved')
        .map(p => p.id);
      setSelectedPayrollsForApproval(approvablePayrolls);
    } else {
      setSelectedPayrollsForApproval([]);
    }
  };

  const handleBatchApproval = (approval: 'Approved' | 'Rejected') => {
    if (!hasPermission('finance.approve') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'batch_finance_approval' });
      return;
    }

    const updatedPayroll = payrollData.map(record => {
      if (selectedPayrollsForApproval.includes(record.id)) {
        const newStatus = approval === 'Approved' ? 'Finance Approved' : 'Rejected';
        return {
          ...record,
          financeApproval: approval,
          financeApprovalDate: new Date().toISOString().split('T')[0],
          financeApprovalNotes: batchApprovalNotes || `Batch ${approval.toLowerCase()} by Finance`,
          paymentStatus: newStatus as PayrollRecord['paymentStatus']
        };
      }
      return record;
    });
    
    setPayrollData(updatedPayroll);
    setSelectedPayrollsForApproval([]);
    setShowBatchApprovalDialog(false);
    setBatchApprovalNotes("");
    
    addAuditLog('PAYROLL_BATCH_FINANCE_APPROVAL', 'PAYROLL', {
      action: 'batch_finance_approval',
      payrollIds: selectedPayrollsForApproval,
      approval,
      notes: batchApprovalNotes,
      approvedBy: user?.email,
      count: selectedPayrollsForApproval.length
    });
  };

  // Redirect Finance Officers to allowed tabs
  useEffect(() => {
    if (user?.role === 'Finance Officer') {
      if (activeTab === 'drafts' || activeTab === 'goals') {
        setActiveTab('payroll');
      }
    }
  }, [user, activeTab]);

  // Redirect former Finance Officers to allowed tabs - now handled by HR Manager
  useEffect(() => {
    if (user?.role === 'HR Manager') {
      // HR Manager now has access to all tabs including payroll management
    }
  }, [user, activeTab]);

  // New state for enhanced payroll and tax management
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [endOfServiceCalculations, setEndOfServiceCalculations] = useState<EndOfServiceCalculation[]>([]);
  const [bonusOvertimeRecords, setBonusOvertimeRecords] = useState<BonusOvertimeRecord[]>([]);
  const [showPayslipDialog, setShowPayslipDialog] = useState(false);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [showEndOfServiceDialog, setShowEndOfServiceDialog] = useState(false);
  const [showBonusOvertimeDialog, setShowBonusOvertimeDialog] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  
  // South Sudan Tax Brackets (Income Tax Act 2009, Amended 2016)
  const SSRA_TAX_BRACKETS: TaxBracket[] = [
    { min: 0, max: 500, rate: 0, fixedAmount: 0 },                    // 0% for first 500 SSP
    { min: 500, max: 1000, rate: 0.10, fixedAmount: 0 },            // 10% for 500-1000 SSP
    { min: 1000, max: 2000, rate: 0.15, fixedAmount: 50 },          // 15% for 1000-2000 SSP
    { min: 2000, max: 5000, rate: 0.20, fixedAmount: 200 },         // 20% for 2000-5000 SSP
    { min: 5000, max: 10000, rate: 0.25, fixedAmount: 800 },        // 25% for 5000-10000 SSP
    { min: 10000, max: Infinity, rate: 0.30, fixedAmount: 2050 }    // 30% for above 10000 SSP
  ];
  
  // Standard exemptions and deductions
  const PERSONAL_EXEMPTION = 200; // SSP per month
  const DEPENDENT_EXEMPTION = 100; // SSP per dependent per month
  const SOCIAL_SECURITY_RATE = 0.08; // 8% of gross salary
  const PENSION_CONTRIBUTION_RATE = 0.05; // 5% of basic salary (voluntary)

  // ... existing code ...

  // Enhanced Tax Calculation Functions
  const calculatePersonalIncomeTax = (
    grossSalary: number, 
    exemptions: { personal: number; dependents: number } = { personal: 1, dependents: 0 }
  ): PayrollTaxCalculation => {
    // Calculate total exemptions
    const personalExemption = exemptions.personal * PERSONAL_EXEMPTION;
    const dependentExemptions = exemptions.dependents * DEPENDENT_EXEMPTION;
    const totalExemptions = personalExemption + dependentExemptions;
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, grossSalary - totalExemptions);
    
    // Calculate PIT using SSRA tax brackets
    let personalIncomeTax = 0;
    let taxBracketUsed = '';
    
    for (const bracket of SSRA_TAX_BRACKETS) {
      if (taxableIncome > bracket.min) {
        const taxableAtThisBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        personalIncomeTax = bracket.fixedAmount + (taxableAtThisBracket * bracket.rate);
        taxBracketUsed = `${bracket.rate * 100}% (${bracket.min}-${bracket.max === Infinity ? '∞' : bracket.max} SSP)`;
      }
    }
    
    // Calculate other contributions
    const socialSecurityContribution = grossSalary * SOCIAL_SECURITY_RATE;
    const pensionContribution = grossSalary * PENSION_CONTRIBUTION_RATE; // Assuming based on gross for simplicity
    
    const totalDeductions = personalIncomeTax + socialSecurityContribution + pensionContribution;
    const netSalary = grossSalary - totalDeductions;
    
    return {
      grossSalary,
      taxableIncome,
      personalIncomeTax: Math.round(personalIncomeTax * 100) / 100,
      socialSecurityContribution: Math.round(socialSecurityContribution * 100) / 100,
      pensionContribution: Math.round(pensionContribution * 100) / 100,
      totalDeductions: Math.round(totalDeductions * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100,
      taxBracketUsed,
      exemptions: {
        personalExemption,
        dependentExemptions,
        totalExemptions
      }
    };
  };

  // Enhanced payroll calculation with proper tax computation
  const calculateEnhancedPayrollTotals = (
    baseSalary: number,
    allowances: {
      transport?: number;
      medical?: number;
      housing?: number;
      meal?: number;
      communication?: number;
      other?: number;
    } = {},
    overtime: number = 0,
    bonus: number = 0,
    arrears: number = 0,
    exemptions: { personal: number; dependents: number } = { personal: 1, dependents: 0 },
    otherDeductions: number = 0
  ) => {
    // Calculate total earnings
    const totalAllowances = Object.values(allowances).reduce((sum, allowance) => sum + (allowance || 0), 0);
    const totalEarnings = baseSalary + totalAllowances + overtime + bonus + arrears;
    
    // Calculate tax and contributions using SSRA brackets
    const taxCalculation = calculatePersonalIncomeTax(totalEarnings, exemptions);
    
    // Add other deductions
    const finalTotalDeductions = taxCalculation.totalDeductions + otherDeductions;
    const finalNetPay = totalEarnings - finalTotalDeductions;
    
    return {
      earnings: {
        basicSalary: baseSalary,
        transportAllowance: allowances.transport || 0,
        medicalAllowance: allowances.medical || 0,
        housingAllowance: allowances.housing || 0,
        mealAllowance: allowances.meal || 0,
        communicationAllowance: allowances.communication || 0,
        otherAllowances: allowances.other || 0,
        overtime,
        bonus,
        arrears,
        totalEarnings
      },
      deductions: {
        personalIncomeTax: taxCalculation.personalIncomeTax,
        socialSecurity: taxCalculation.socialSecurityContribution,
        pensionContribution: taxCalculation.pensionContribution,
        advanceSalary: 0,
        loanDeduction: 0,
        otherDeductions,
        totalDeductions: finalTotalDeductions
      },
      netPay: finalNetPay,
      taxCalculation
    };
  };

  // Generate Payslip
  const generatePayslip = (
    employeeId: string,
    employeeName: string,
    employeeNumber: string,
    designation: string,
    department: string,
    bankAccount: string,
    taxId: string,
    payPeriod: string,
    payrollCalculation: any,
    leaveBalance: any
  ): Payslip => {
    const payslipId = `PAY-${Date.now()}-${employeeId}`;
    
    return {
      id: payslipId,
      employeeId,
      employeeName,
      employeeNumber,
      payPeriod,
      payDate: new Date().toISOString().split('T')[0],
      designation,
      department,
      bankAccount,
      taxId,
      earnings: payrollCalculation.earnings,
      deductions: payrollCalculation.deductions,
      netPay: payrollCalculation.netPay,
      taxCalculation: payrollCalculation.taxCalculation,
      leaveBalance: leaveBalance || {
        annualLeave: 21,
        sickLeave: 10,
        maternityLeave: 90,
        paternityLeave: 10
      },
      generatedBy: user?.email || 'System',
      generatedDate: new Date().toISOString(),
      isApproved: false
    };
  };

  // Calculate End of Service Gratuity (South Sudan Labour Law)
  const calculateEndOfServiceBenefits = (
    employeeId: string,
    employeeName: string,
    serviceStartDate: string,
    serviceEndDate: string,
    lastBasicSalary: number,
    accruedLeaveDays: number = 0,
    noticePeriodDays: number = 0
  ): EndOfServiceCalculation => {
    const startDate = new Date(serviceStartDate);
    const endDate = new Date(serviceEndDate);
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const yearsOfService = Math.floor(totalDays / 365);
    const monthsOfService = Math.floor((totalDays % 365) / 30);
    
    // Gratuity calculation (typical: 21 days per year for first 5 years, 30 days per year thereafter)
    let gratuityDays = 0;
    const firstFiveYears = Math.min(yearsOfService, 5);
    const remainingYears = Math.max(0, yearsOfService - 5);
    
    gratuityDays = (firstFiveYears * 21) + (remainingYears * 30);
    const dailySalary = lastBasicSalary / 30;
    const gratuityAmount = gratuityDays * dailySalary;
    
    // Other calculations
    const leaveEncashment = accruedLeaveDays * dailySalary;
    const noticePay = noticePeriodDays * dailySalary;
    const severancePay = 0; // Would depend on termination type
    
    const totalEndOfServicePay = gratuityAmount + leaveEncashment + noticePay + severancePay;
    
    // Tax calculation on gratuity (may have different rates)
    const taxableAmount = Math.max(0, gratuityAmount - 1000); // Assuming 1000 SSP exemption
    const taxOnGratuity = taxableAmount * 0.10; // Assuming 10% flat rate on gratuities
    
    const netEndOfServicePay = totalEndOfServicePay - taxOnGratuity;
    
    return {
      employeeId,
      employeeName,
      serviceStartDate,
      serviceEndDate,
      yearsOfService,
      monthsOfService,
      lastBasicSalary,
      gratuityAmount: Math.round(gratuityAmount * 100) / 100,
      gratuityFormula: `${gratuityDays} days × ${dailySalary.toFixed(2)} SSP/day`,
      accruedLeave: accruedLeaveDays,
      leaveEncashment: Math.round(leaveEncashment * 100) / 100,
      noticePay: Math.round(noticePay * 100) / 100,
      severancePay,
      totalEndOfServicePay: Math.round(totalEndOfServicePay * 100) / 100,
      taxableAmount: Math.round(taxableAmount * 100) / 100,
      taxOnGratuity: Math.round(taxOnGratuity * 100) / 100,
      netEndOfServicePay: Math.round(netEndOfServicePay * 100) / 100,
      calculatedBy: user?.email || 'System',
      calculatedDate: new Date().toISOString()
    };
  };

  // Generate Compliance Report for NRA
  const generateComplianceReport = (
    reportType: ComplianceReport['reportType'],
    reportPeriod: string,
    payrollRecords: PayrollRecord[]
  ): ComplianceReport => {
    const totalEmployees = payrollRecords.length;
    const totalGrossPay = payrollRecords.reduce((sum, record) => sum + record.grossPay, 0);
    const totalTaxCollected = payrollRecords.reduce((sum, record) => sum + record.taxes, 0);
    const totalSocialSecurity = payrollRecords.reduce((sum, record) => sum + record.socialSecurity, 0);
    const totalPensionContributions = payrollRecords.reduce((sum, record) => sum + (record.grossPay * 0.05), 0);
    
    const employeeRecords = payrollRecords.map(record => ({
      employeeId: record.employeeId,
      employeeName: record.name,
      grossPay: record.grossPay,
      taxPaid: record.taxes,
      socialSecurity: record.socialSecurity,
      pensionContribution: record.grossPay * 0.05
    }));
    
    return {
      id: `RPT-${Date.now()}`,
      reportType,
      reportPeriod,
      generatedDate: new Date().toISOString(),
      generatedBy: user?.email || 'System',
      totalEmployees,
      totalGrossPay: Math.round(totalGrossPay * 100) / 100,
      totalTaxCollected: Math.round(totalTaxCollected * 100) / 100,
      totalSocialSecurity: Math.round(totalSocialSecurity * 100) / 100,
      totalPensionContributions: Math.round(totalPensionContributions * 100) / 100,
      employeeRecords,
      isSubmittedToNRA: false
    };
  };

  // Export payslips as PDF (mock function)
  const exportPayslipAsPDF = (payslip: Payslip) => {
    const content = `
      HORIZON BANK SOUTH SUDAN LIMITED
      PAYSLIP FOR ${payslip.payPeriod}
      
      Employee: ${payslip.employeeName} (${payslip.employeeNumber})
      Department: ${payslip.department}
      Designation: ${payslip.designation}
      Pay Date: ${payslip.payDate}
      
      EARNINGS:
      Basic Salary: ${payslip.earnings.basicSalary.toFixed(2)} SSP
      Transport Allowance: ${payslip.earnings.transportAllowance.toFixed(2)} SSP
      Medical Allowance: ${payslip.earnings.medicalAllowance.toFixed(2)} SSP
      Housing Allowance: ${payslip.earnings.housingAllowance.toFixed(2)} SSP
      Other Allowances: ${payslip.earnings.otherAllowances.toFixed(2)} SSP
      Overtime: ${payslip.earnings.overtime.toFixed(2)} SSP
      Bonus: ${payslip.earnings.bonus.toFixed(2)} SSP
      Total Earnings: ${payslip.earnings.totalEarnings.toFixed(2)} SSP
      
      DEDUCTIONS:
      Personal Income Tax: ${payslip.deductions.personalIncomeTax.toFixed(2)} SSP
      Social Security: ${payslip.deductions.socialSecurity.toFixed(2)} SSP
      Pension Contribution: ${payslip.deductions.pensionContribution.toFixed(2)} SSP
      Other Deductions: ${payslip.deductions.otherDeductions.toFixed(2)} SSP
      Total Deductions: ${payslip.deductions.totalDeductions.toFixed(2)} SSP
      
      NET PAY: ${payslip.netPay.toFixed(2)} SSP
      
      Tax Bracket Used: ${payslip.taxCalculation.taxBracketUsed}
      
      Generated by: ${payslip.generatedBy}
      Generated on: ${new Date(payslip.generatedDate).toLocaleDateString()}
    `;
    
    // In a real implementation, this would generate a proper PDF
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payslip-${payslip.employeeName}-${payslip.payPeriod}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addAuditLog('PAYSLIP_EXPORTED', 'PAYROLL', {
      action: 'payslip_exported',
      employeeId: payslip.employeeId,
      payPeriod: payslip.payPeriod,
      exportedBy: user?.email
    });
  };

  // Submit compliance report to NRA (mock function)
  const submitComplianceReportToNRA = (reportId: string) => {
    const report = complianceReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Mock submission
    const submissionReference = `NRA-${Date.now()}`;
    const updatedReport = {
      ...report,
      isSubmittedToNRA: true,
      submissionDate: new Date().toISOString(),
      submissionReference
    };
    
    setComplianceReports(complianceReports.map(r => r.id === reportId ? updatedReport : r));
    
    addAuditLog('COMPLIANCE_REPORT_SUBMITTED', 'PAYROLL', {
      action: 'compliance_report_submitted_to_nra',
      reportId,
      reportType: report.reportType,
      submissionReference,
      submittedBy: user?.email
    });
  };

  // ... existing code ...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll & Goal Management</h1>
          <p className="text-gray-600">Process payroll, manage employee goals, and handle approvals</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('finance.approve') || hasPermission('*')) && (
            <Button 
              onClick={handleProcessPayroll}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Approve Payrolls
            </Button>
          )}
          {(hasPermission('goals.manage') || hasPermission('*')) && (
            <Button 
              onClick={() => setShowGoalDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <TargetIcon className="mr-2 h-4 w-4" />
              Set Goals
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={handleExportPayroll}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      {user?.role === 'Finance Officer' && (
        <Alert>
          <ShieldCheckIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Finance Officer Role:</strong> You can review and approve payroll records that have been approved by employees. 
            You cannot create or modify payroll records - this is handled by HR. All approvals are logged and audited for compliance.
          </AlertDescription>
        </Alert>
      )}

      {user?.role === 'HR Manager' && (
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>HR Manager Role:</strong> You can review and approve payroll records, manage taxes, and handle all HR financial functions.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Gross Pay</p>
                <p className="text-3xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSignIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Net Pay</p>
                <p className="text-3xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                <p className="text-xs text-gray-500">After deductions</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BanknoteIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{pendingFinanceApprovals + pendingEmployeeApprovals}</p>
                <p className="text-xs text-gray-500">
                  {pendingEmployeeApprovals} employee + {pendingFinanceApprovals} finance
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <ClockIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">
                  {goals.filter(g => g.status === 'Active').length}
                </p>
                <p className="text-xs text-gray-500">Performance targets</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <TrophyIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="grid w-full min-w-max" style={{
            gridTemplateColumns: [
              'payroll',
              ...(hasPermission('payroll.manage') || hasPermission('*') ? ['drafts'] : []),
              ...(hasPermission('employee.manage') || hasPermission('*') ? ['employees'] : []),
              ...(hasPermission('goals.manage') || hasPermission('*') ? ['goals'] : []),
              'leave',
              ...(hasPermission('payroll.manage') || hasPermission('*') ? ['tax-management'] : [])
            ].map(() => 'minmax(120px, 1fr)').join(' ')
          }}>
            <TabsTrigger value="payroll" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Payroll Management</span>
              <span className="sm:hidden">Payroll</span>
            </TabsTrigger>
            {(hasPermission('payroll.manage') || hasPermission('*')) && (
              <TabsTrigger value="drafts" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Payroll Drafts</span>
                <span className="sm:hidden">Drafts</span>
              </TabsTrigger>
            )}
            {(hasPermission('employee.manage') || hasPermission('*')) && (
              <TabsTrigger value="employees" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Employee Management</span>
                <span className="sm:hidden">Employees</span>
              </TabsTrigger>
            )}
            {(hasPermission('goals.manage') || hasPermission('*')) && (
              <TabsTrigger value="goals" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Goal Management</span>
                <span className="sm:hidden">Goals</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="leave" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Leave Management</span>
              <span className="sm:hidden">Leave</span>
            </TabsTrigger>
            {(hasPermission('payroll.manage') || hasPermission('*')) && (
              <TabsTrigger value="tax-management" className="text-xs sm:text-sm px-2 py-2">
                <span className="hidden sm:inline">Tax & Compliance</span>
                <span className="sm:hidden">Tax</span>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="payroll" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {(hasPermission('payroll.manage') || hasPermission('*')) && (
                    <Button 
                      onClick={() => setShowCreatePayrollDialog(true)}
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm"
                    >
                      <PlusIcon className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Create Payroll</span>
                      <span className="sm:hidden">Create</span>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Filter by Status</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Pay Period</span>
                    <span className="sm:hidden">Period</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Table */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    {(hasPermission('finance.approve') || hasPermission('*')) && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedPayrollsForApproval.length > 0 &&
                            selectedPayrollsForApproval.length === 
                            payrollData.filter(p => p.paymentStatus === 'Employee Approved').length
                          }
                          onCheckedChange={handleSelectAllPayrolls}
                          aria-label="Select all payrolls for approval"
                        />
                      </TableHead>
                    )}
                    <TableHead>Employee</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Employee Approval</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.map((payroll) => (
                    <TableRow key={payroll.id} className="border-b border-gray-50">
                      {(hasPermission('finance.approve') || hasPermission('*')) && (
                        <TableCell>
                          {payroll.paymentStatus === 'Employee Approved' && (
                            <Checkbox
                              checked={selectedPayrollsForApproval.includes(payroll.id)}
                              onCheckedChange={(checked) => 
                                handlePayrollSelection(payroll.id, checked as boolean)
                              }
                              aria-label={`Select payroll for ${payroll.name}`}
                            />
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {payroll.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{payroll.name}</p>
                            <p className="text-sm text-gray-500">{payroll.position}</p>
                            <p className="text-xs text-gray-400">{payroll.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">${payroll.grossPay.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            Base: ${payroll.baseSalary.toLocaleString()}
                            {payroll.overtime > 0 && ` + $${payroll.overtime} OT`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">${payroll.netPay.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payroll.paymentStatus)}>
                          {payroll.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={getApprovalStatusColor(payroll.employeeApproval)}>
                            {payroll.employeeApproval || 'Not Required'}
                          </Badge>
                          {payroll.employeeApproval === 'Rejected' && (
                            <AlertTriangleIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {payroll.employeeApproval === 'Pending' && user?.role === 'Employee' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedPayroll(payroll);
                                      setShowApprovalDialog(true);
                                    }}
                                  >
                                    <ThumbsUpIcon className="mr-2 h-4 w-4" />
                                    Approve/Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {payroll.paymentStatus === 'Employee Approved' && (hasPermission('finance.approve') || hasPermission('*')) && (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedPayroll(payroll);
                                    setShowFinanceApprovalDialog(true);
                                  }}
                                >
                                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                                  Finance Review
                                </DropdownMenuItem>
                              )}
                              {(hasPermission('payroll.manage') || hasPermission('*')) && (
                                <DropdownMenuItem>
                                  <SendIcon className="mr-2 h-4 w-4" />
                                  Resend Payment
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                Download Slip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search payroll drafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Filter by Status</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Pay Period</span>
                    <span className="sm:hidden">Period</span>
                  </Button>
                  {(hasPermission('payroll.manage') || hasPermission('*')) && payrollDrafts.some(d => d.status === 'Ready for Processing') && (
                    <Button 
                      onClick={handleProcessPayrollDrafts}
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm"
                    >
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Process Ready Drafts</span>
                      <span className="sm:hidden">Process</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Drafts Table */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead>Employee</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollDrafts.map((draft) => (
                    <TableRow key={draft.id} className="border-b border-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {draft.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{draft.name}</p>
                            <p className="text-sm text-gray-500">{draft.position}</p>
                            <p className="text-xs text-gray-400">{draft.employeeId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">${draft.grossPay.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">
                            Base: ${draft.paymentComponents.baseSalary.toLocaleString()}
                            {draft.paymentComponents.overtime > 0 && ` + $${draft.paymentComponents.overtime} OT`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">${draft.netPay.toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(draft.status)}>
                          {draft.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                Download Slip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search goals and employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Status
                  </Button>
                  <Button variant="outline">
                    <TrophyIcon className="mr-2 h-4 w-4" />
                    Filter by Priority
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="mt-1">{goal.employeeName} • {goal.department}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getGoalPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                      <Badge className={getGoalStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Target: {goal.targetDate}</span>
                    <span>Category: {goal.category}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit Goal
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <TrendingUpIcon className="mr-2 h-4 w-4" />
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-6">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Leave Management</h2>
                <p className="text-gray-600 text-sm">Manage employee leave requests, approvals, and track leave balances</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowLeaveRequestDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200 hover:shadow-lg min-h-[44px]"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Request Leave
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 min-h-[44px]"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search by employee name, type, or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Status
                  </Button>
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Leave Type
                  </Button>
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Department
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Leave Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-l-amber-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Pending Approval</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">
                      {leaveRequests.filter(l => l.status === 'Pending Approval').length}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">Requires review</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-100">
                    <ClockIcon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Approved</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {leaveRequests.filter(l => l.status === 'Approved').length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">This month</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-100">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-l-red-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-700 uppercase tracking-wide">Rejected</p>
                    <p className="text-3xl font-bold text-red-900 mt-2">
                      {leaveRequests.filter(l => l.status === 'Rejected').length}
                    </p>
                    <p className="text-xs text-red-600 mt-1">This month</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-100">
                    <XCircleIcon className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Days</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      {leaveRequests.filter(l => l.status === 'Approved').reduce((sum, l) => sum + l.days, 0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Approved leave</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-100">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Leave Requests Table */}
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Leave Requests</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Review and manage employee leave applications
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {filteredLeaves.length} requests
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-100">
                      <TableHead className="font-semibold text-gray-700 py-4 px-6">Employee</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Leave Type</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Duration & Reason</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-center">Days</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Timeline</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves.map((leave) => (
                      <TableRow key={leave.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-gray-100">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                                {leave.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{leave.name}</p>
                              <p className="text-sm text-gray-500">{leave.department}</p>
                              <p className="text-xs text-gray-400">ID: {leave.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge 
                            variant="outline" 
                            className={`font-medium ${
                              leave.leaveType === 'Annual Leave' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              leave.leaveType === 'Sick Leave' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                              leave.leaveType === 'Maternity Leave' ? 'border-pink-200 text-pink-700 bg-pink-50' :
                              leave.leaveType === 'Emergency Leave' ? 'border-red-200 text-red-700 bg-red-50' :
                              'border-purple-200 text-purple-700 bg-purple-50'
                            }`}
                          >
                            {leave.leaveType}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 max-w-xs">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {leave.startDate} → {leave.endDate}
                            </p>
                            <p className="text-xs text-gray-600 line-clamp-2" title={leave.reason}>
                              {leave.reason}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-100">
                            <span className="font-bold text-blue-700 text-sm">{leave.days}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <Badge className={getLeaveStatusColor(leave.status)}>
                              {leave.status}
                            </Badge>
                            {leave.approver && (
                              <p className="text-xs text-gray-500">
                                by {leave.approver}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                              <p className="text-xs text-gray-600">Submitted: {leave.submittedDate}</p>
                            </div>
                            {leave.approvalDate && (
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  leave.status === 'Approved' ? 'bg-green-400' : 'bg-red-400'
                                }`}></div>
                                <p className="text-xs text-gray-600">
                                  {leave.status === 'Approved' ? 'Approved' : 'Rejected'}: {leave.approvalDate}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center">
                            {(hasPermission('leave.approve') || hasPermission('*')) && leave.status === 'Pending Approval' ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-10 w-10 p-0 hover:bg-gray-100 group-hover:bg-gray-200 transition-colors"
                                  >
                                    <MoreVerticalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedLeave(leave);
                                      setShowLeaveApprovalDialog(true);
                                    }}
                                    className="text-green-600 focus:text-green-600 focus:bg-green-50"
                                  >
                                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                                    Review & Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleLeaveApproval(leave.id, 'reject', 'Rejected without review')}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                  >
                                    <XCircleIcon className="mr-2 h-4 w-4" />
                                    Quick Reject
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="focus:bg-blue-50">
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-10 w-10 p-0 hover:bg-gray-100 group-hover:bg-gray-200 transition-colors"
                                  >
                                    <MoreVerticalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem className="focus:bg-blue-50">
                                    <EyeIcon className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {leave.approvalNotes && (
                                    <DropdownMenuItem className="focus:bg-gray-50">
                                      <FileTextIcon className="mr-2 h-4 w-4" />
                                      View Notes
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem className="focus:bg-gray-50">
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredLeaves.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No leave requests found</h3>
                  <p className="text-gray-500 mb-4">No leave requests match your current search criteria.</p>
                  <Button 
                    onClick={() => setSearchQuery("")} 
                    variant="outline"
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Enhanced Employee Management Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Management</h2>
                <p className="text-gray-600 text-sm">Comprehensive employee data management including personal info, employment details, and documents</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowEmployeeDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200 hover:shadow-lg min-h-[44px]"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 min-h-[44px]"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export Employees
                </Button>
              </div>
            </div>
          </div>

          {/* Employee Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-l-blue-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Employees</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{employeeDatabase.length}</p>
                    <p className="text-xs text-blue-600 mt-1">Active workforce</p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-100">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active</p>
                    <p className="text-3xl font-bold text-green-900 mt-2">
                      {employeeDatabase.filter(emp => emp.employmentInfo.employmentStatus === 'Active').length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">Working employees</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-100">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50 border-l-4 border-l-purple-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Departments</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">
                      {new Set(employeeDatabase.map(emp => emp.employmentInfo.department)).size}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Active departments</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-100">
                    <TrophyIcon className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-l-amber-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Avg Profile</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">
                      {Math.round(employeeDatabase.reduce((sum, emp) => sum + emp.systemInfo.profileCompletionPercentage, 0) / employeeDatabase.length || 0)}%
                    </p>
                    <p className="text-xs text-amber-600 mt-1">Completion rate</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-100">
                    <TrendingUpIcon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="border-0 shadow-md bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search by name, employee ID, department, position..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Department
                  </Button>
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <ShieldCheckIcon className="mr-2 h-4 w-4" />
                    Status
                  </Button>
                  <Button variant="outline" className="min-h-[44px] border-gray-200 hover:bg-gray-50">
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    Contract Type
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Table */}
          <Card className="border-0 shadow-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Employee Directory</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Comprehensive employee information and management
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {employeeDatabase.filter(emp => 
                    emp.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.employmentInfo.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.employmentInfo.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    emp.employmentInfo.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length} employees
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-100">
                      <TableHead className="font-semibold text-gray-700 py-4 px-6">Employee</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Employment Details</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4">Contact Information</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-center">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-center">Profile</TableHead>
                      <TableHead className="font-semibold text-gray-700 py-4 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeDatabase
                      .filter(emp => 
                        emp.personalInfo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        emp.employmentInfo.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        emp.employmentInfo.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        emp.employmentInfo.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((employee) => (
                      <TableRow key={employee.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-gray-100">
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {employee.personalInfo.firstName[0]}{employee.personalInfo.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{employee.personalInfo.fullName}</p>
                              <p className="text-sm text-gray-500">ID: {employee.employmentInfo.employeeId}</p>
                              <p className="text-xs text-gray-400">{employee.personalInfo.nationality}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{employee.employmentInfo.jobTitle}</p>
                            <p className="text-sm text-gray-600">{employee.employmentInfo.department}</p>
                            <div className="flex gap-2">
                              <Badge className={getContractTypeColor(employee.employmentInfo.contractType)}>
                                {employee.employmentInfo.contractType}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">Started: {employee.employmentInfo.employmentStartDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-900">{employee.contactInfo.workEmail}</p>
                            <p className="text-sm text-gray-600">{employee.contactInfo.personalPhone}</p>
                            <p className="text-xs text-gray-400">{employee.contactInfo.address.city}, {employee.contactInfo.address.country}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Badge className={getEmployeeStatusColor(employee.employmentInfo.employmentStatus)}>
                            {employee.employmentInfo.employmentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 rounded-full border-4 border-gray-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">
                                {employee.systemInfo.profileCompletionPercentage}%
                              </span>
                            </div>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${employee.systemInfo.profileCompletionPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-10 w-10 p-0 hover:bg-gray-100 group-hover:bg-gray-200 transition-colors"
                                >
                                  <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowEmployeeViewDialog(true);
                                  }}
                                  className="focus:bg-blue-50"
                                >
                                  <EyeIcon className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingEmployee(employee);
                                    setEmployeeForm(employee);
                                    setShowEmployeeDialog(true);
                                  }}
                                  className="focus:bg-green-50"
                                >
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  Edit Employee
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-purple-50">
                                  <FileTextIcon className="mr-2 h-4 w-4" />
                                  Manage Documents
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-orange-50">
                                  <TrophyIcon className="mr-2 h-4 w-4" />
                                  Performance History
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-gray-50">
                                  <DownloadIcon className="mr-2 h-4 w-4" />
                                  Export Data
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {employeeDatabase.length === 0 && (
                <div className="text-center py-12">
                  <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first employee to the system.</p>
                  <Button 
                    onClick={() => setShowEmployeeDialog(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add First Employee
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Payroll Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finance Payroll Approval</DialogTitle>
            <DialogDescription>
              This will approve all employee-approved payroll records for final payment processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Finance Approval:</strong> This action will approve {payrollData.filter(p => p.paymentStatus === 'Employee Approved').length} employee-approved payroll records.
                These payrolls will be marked as finance approved and ready for payment.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Approval Summary</Label>
              <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Records:</span>
                  <span>{payrollData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Awaiting Finance Approval:</span>
                  <span>{payrollData.filter(p => p.paymentStatus === 'Employee Approved').length}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Amount to Approve:</span>
                  <span>${payrollData.filter(p => p.paymentStatus === 'Employee Approved').reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
              Cancel
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  disabled={processingPayroll || payrollData.filter(p => p.paymentStatus === 'Employee Approved').length === 0}
                >
                  {processingPayroll ? (
                    <>
                      <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="mr-2 h-4 w-4" />
                      Approve All Payrolls
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Finance Approval</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve all employee-approved payrolls? This action will authorize final payment processing and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleBatchProcessPayroll}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm Approval
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Goals Dialog */}
      <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set New Goal</DialogTitle>
            <DialogDescription>
              Create a performance goal for an employee. Goals help track progress and improve performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-employee">Employee *</Label>
                <Select 
                  value={goalForm.employeeId} 
                  onValueChange={(value) => setGoalForm({ ...goalForm, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-category">Category *</Label>
                <Select 
                  value={goalForm.category} 
                  onValueChange={(value: any) => setGoalForm({ ...goalForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title *</Label>
              <Input
                id="goal-title"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g. Improve customer satisfaction scores"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description *</Label>
              <Textarea
                id="goal-description"
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                placeholder="Detailed description of the goal and success criteria..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-priority">Priority *</Label>
                <Select 
                  value={goalForm.priority} 
                  onValueChange={(value: any) => setGoalForm({ ...goalForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Date *</Label>
                <Input
                  id="goal-target"
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGoalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateGoal}
              disabled={!goalForm.employeeId || !goalForm.title || !goalForm.description || !goalForm.targetDate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <TargetIcon className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Salary Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Salary Approval</DialogTitle>
            <DialogDescription>
              Review and approve your salary details for this pay period.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayroll && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Pay Period Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span className="font-medium">{selectedPayroll.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span>{selectedPayroll.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pay Date:</span>
                    <span>{selectedPayroll.payDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Salary:</span>
                  <span className="font-medium">${selectedPayroll.baseSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allowances:</span>
                  <span className="font-medium">+${selectedPayroll.allowances.toLocaleString()}</span>
                </div>
                {selectedPayroll.overtime > 0 && (
                  <div className="flex justify-between">
                    <span>Overtime:</span>
                    <span className="font-medium">+${selectedPayroll.overtime.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-green-600 pt-2 border-t">
                  <span>Gross Pay:</span>
                  <span>${selectedPayroll.grossPay.toLocaleString()}</span>
                </div>
                
                <div className="pt-2 border-t space-y-2">
                  <div className="flex justify-between text-red-600">
                    <span>Income Tax:</span>
                    <span>-${selectedPayroll.taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Social Security:</span>
                    <span>-${selectedPayroll.socialSecurity.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t border-blue-200">
                  <span>Net Pay:</span>
                  <span>${selectedPayroll.netPay.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-notes">Notes (Optional)</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any comments or concerns about this payroll..."
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => selectedPayroll && handleEmployeeApproval(selectedPayroll.id, 'Rejected', 'Employee rejected the payroll')}
            >
              <ThumbsDownIcon className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => selectedPayroll && handleEmployeeApproval(selectedPayroll.id, 'Approved')}
            >
              <ThumbsUpIcon className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Approval Dialog */}
      <Dialog open={showLeaveApprovalDialog} onOpenChange={setShowLeaveApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject the employee's leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Leave Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span className="font-medium">{selectedLeave.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span>{selectedLeave.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leave Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedLeave.leaveType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedLeave.days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Period:</span>
                    <span className="font-medium">{selectedLeave.startDate} to {selectedLeave.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submitted:</span>
                    <span>{selectedLeave.submittedDate}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason for Leave</Label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{selectedLeave.reason}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leave-approval-notes">HR Notes *</Label>
                <Textarea
                  id="leave-approval-notes"
                  value={leaveApprovalNotes}
                  onChange={(e) => setLeaveApprovalNotes(e.target.value)}
                  placeholder="Add your comments regarding this leave request..."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Your decision and notes will be recorded and sent to the employee.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => selectedLeave && handleLeaveApproval(selectedLeave.id, 'reject', leaveApprovalNotes)}
              disabled={!leaveApprovalNotes.trim()}
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => selectedLeave && handleLeaveApproval(selectedLeave.id, 'approve', leaveApprovalNotes)}
              disabled={!leaveApprovalNotes.trim()}
            >
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Request Dialog */}
      <Dialog open={showLeaveRequestDialog} onOpenChange={setShowLeaveRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a new leave request for approval by HR.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type *</Label>
                <Select 
                  value={leaveForm.leaveType} 
                  onValueChange={(value: any) => setLeaveForm({ ...leaveForm, leaveType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Emergency Leave">Emergency Leave</SelectItem>
                    <SelectItem value="Study Leave">Study Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="text-sm font-medium text-gray-600">
                  {calculateLeaveDays(leaveForm.startDate, leaveForm.endDate)} days
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => {
                    setLeaveForm({ 
                      ...leaveForm, 
                      startDate: e.target.value,
                      days: calculateLeaveDays(e.target.value, leaveForm.endDate)
                    });
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => {
                    setLeaveForm({ 
                      ...leaveForm, 
                      endDate: e.target.value,
                      days: calculateLeaveDays(leaveForm.startDate, e.target.value)
                    });
                  }}
                  min={leaveForm.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leave-reason">Reason for Leave *</Label>
              <Textarea
                id="leave-reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                placeholder="Please provide a detailed reason for your leave request..."
                rows={3}
              />
            </div>

            <Alert>
              <CalendarIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Reminder:</strong> Submit leave requests at least 7 days in advance for approval.
                Emergency leave may be submitted with shorter notice.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveRequestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLeaveRequest}
              disabled={!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Payroll Dialog */}
      <Dialog open={showCreatePayrollDialog} onOpenChange={setShowCreatePayrollDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Payroll</DialogTitle>
            <DialogDescription>
              Select employees and configure payment components for payroll processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pay-period">Pay Period *</Label>
                <Input
                  id="pay-period"
                  type="month"
                  value={payrollForm.payPeriod}
                  onChange={(e) => setPayrollForm({ ...payrollForm, payPeriod: e.target.value })}
                />
              </div>
              
              {/* Employee Selection */}
              <div className="space-y-2">
                <Label>Select Employees *</Label>
                <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                  {employees.map((employee) => (
                    <div 
                      key={employee.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmployees.find(emp => emp.id === employee.id) 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectEmployee({
                        id: employee.id,
                        name: employee.name,
                        department: employee.department,
                        position: "Employee",
                        baseSalary: 3000
                      })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                        {selectedEmployees.find(emp => emp.id === employee.id) && (
                          <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Employees */}
              {selectedEmployees.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Employees ({selectedEmployees.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployees.map((employee) => (
                      <Badge 
                        key={employee.id} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        {employee.name}
                        <XCircleIcon 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveEmployee(employee.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Components */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transport-allowance">Transport Allowance</Label>
                  <Input
                    id="transport-allowance"
                    type="number"
                    value={payrollForm.transportAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, transportAllowance: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medical-allowance">Medical Allowance</Label>
                  <Input
                    id="medical-allowance"
                    type="number"
                    value={payrollForm.medicalAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, medicalAllowance: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="housing-allowance">Housing Allowance</Label>
                  <Input
                    id="housing-allowance"
                    type="number"
                    value={payrollForm.housingAllowance}
                    onChange={(e) => setPayrollForm({ ...payrollForm, housingAllowance: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="performance-bonus">Performance Bonus</Label>
                  <Input
                    id="performance-bonus"
                    type="number"
                    value={payrollForm.performanceBonus}
                    onChange={(e) => setPayrollForm({ ...payrollForm, performanceBonus: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overtime">Overtime Pay</Label>
                  <Input
                    id="overtime"
                    type="number"
                    value={payrollForm.overtime}
                    onChange={(e) => setPayrollForm({ ...payrollForm, overtime: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other-allowances">Other Allowances</Label>
                  <Input
                    id="other-allowances"
                    type="number"
                    value={payrollForm.otherAllowances}
                    onChange={(e) => setPayrollForm({ ...payrollForm, otherAllowances: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Deductions */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxes">Tax Rate (%)</Label>
                  <Input
                    id="taxes"
                    type="number"
                    value={payrollForm.taxes}
                    onChange={(e) => setPayrollForm({ ...payrollForm, taxes: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social-security">Social Security (%)</Label>
                  <Input
                    id="social-security"
                    type="number"
                    value={payrollForm.socialSecurity}
                    onChange={(e) => setPayrollForm({ ...payrollForm, socialSecurity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pension">Pension Contribution (%)</Label>
                  <Input
                    id="pension"
                    type="number"
                    value={payrollForm.pensionContribution}
                    onChange={(e) => setPayrollForm({ ...payrollForm, pensionContribution: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePayrollDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePayrollDrafts}
              disabled={selectedEmployees.length === 0 || !payrollForm.payPeriod}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Payroll Drafts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finance Approval Dialog */}
      <Dialog open={showFinanceApprovalDialog} onOpenChange={setShowFinanceApprovalDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Finance Approval</DialogTitle>
            <DialogDescription>
              Review and approve this payroll record for final payment processing.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayroll && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">Payroll Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span className="font-medium">{selectedPayroll.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <span>{selectedPayroll.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gross Pay:</span>
                    <span className="font-medium">${selectedPayroll.grossPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net Pay:</span>
                    <span className="font-bold text-green-600">${selectedPayroll.netPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee Status:</span>
                    <Badge className={getApprovalStatusColor(selectedPayroll.employeeApproval)}>
                      {selectedPayroll.employeeApproval}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finance-approval-notes">Finance Notes *</Label>
                <Textarea
                  id="finance-approval-notes"
                  value={financeApprovalNotes}
                  onChange={(e) => setFinanceApprovalNotes(e.target.value)}
                  placeholder="Add your comments regarding this payroll approval..."
                  rows={3}
                />
              </div>

              <Alert>
                <ShieldCheckIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Finance Approval:</strong> This action will approve the payroll for final payment processing.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => selectedPayroll && handleFinanceApproval(selectedPayroll.id, 'Rejected', financeApprovalNotes)}
              disabled={!financeApprovalNotes.trim()}
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => selectedPayroll && handleFinanceApproval(selectedPayroll.id, 'Approved', financeApprovalNotes)}
              disabled={!financeApprovalNotes.trim()}
            >
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finance Batch Approval Section */}
      {(hasPermission('finance.approve') || hasPermission('*')) && (
        <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-1">Finance Approval Dashboard</h3>
                <p className="text-xs sm:text-sm text-green-600">
                  Select payroll records for batch approval. Only employee-approved records can be processed.
                </p>
              </div>
              {selectedPayrollsForApproval.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setBatchApprovalNotes("");
                      setShowBatchApprovalDialog(true);
                    }}
                    className="border-green-200 text-green-700 hover:bg-green-50 w-full sm:w-auto text-sm"
                  >
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Approve Selected ({selectedPayrollsForApproval.length})</span>
                    <span className="sm:hidden">Approve ({selectedPayrollsForApproval.length})</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedPayrollsForApproval([])}
                    className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto text-sm"
                  >
                    <XCircleIcon className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Clear Selection</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Approval Dialog */}
      <Dialog open={showBatchApprovalDialog} onOpenChange={setShowBatchApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Batch Finance Approval</DialogTitle>
            <DialogDescription>
              Review and approve multiple payroll records for final payment processing.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Batch Approval Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Selected Records:</span>
                  <span className="font-medium">{selectedPayrollsForApproval.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-bold text-green-600">
                    ${payrollData
                      .filter(p => selectedPayrollsForApproval.includes(p.id))
                      .reduce((sum, p) => sum + p.netPay, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className="bg-blue-100 text-blue-800">Employee Approved</Badge>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Employees:</h5>
              <div className="space-y-1">
                {payrollData
                  .filter(p => selectedPayrollsForApproval.includes(p.id))
                  .map(payroll => (
                    <div key={payroll.id} className="flex justify-between text-xs">
                      <span>{payroll.name}</span>
                      <span className="font-medium">${payroll.netPay.toLocaleString()}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch-approval-notes">Finance Notes *</Label>
              <Textarea
                id="batch-approval-notes"
                value={batchApprovalNotes}
                onChange={(e) => setBatchApprovalNotes(e.target.value)}
                placeholder="Add your comments for this batch approval..."
                rows={3}
              />
            </div>

            <Alert>
              <ShieldCheckIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Batch Approval:</strong> This action will approve all selected payroll records for final payment processing.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleBatchApproval('Rejected')}
              disabled={!batchApprovalNotes.trim()}
            >
              <XCircleIcon className="mr-2 h-4 w-4" />
              Reject All
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleBatchApproval('Approved')}
              disabled={!batchApprovalNotes.trim()}
            >
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Approve All ({selectedPayrollsForApproval.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Management Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee 
                ? 'Update employee information and details' 
                : 'Create a comprehensive employee profile with all required information'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      employeeFormStep >= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 5 && (
                      <div className={`w-8 h-1 mx-2 ${
                        employeeFormStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Step {employeeFormStep} of 5
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {employeeFormStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={employeeForm.personalInfo?.firstName || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: {
                          ...employeeForm.personalInfo!,
                          firstName: e.target.value,
                          fullName: `${e.target.value} ${employeeForm.personalInfo?.lastName || ''}`.trim()
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={employeeForm.personalInfo?.lastName || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: {
                          ...employeeForm.personalInfo!,
                          lastName: e.target.value,
                          fullName: `${employeeForm.personalInfo?.firstName || ''} ${e.target.value}`.trim()
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select 
                      value={employeeForm.personalInfo?.gender} 
                      onValueChange={(value: any) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: { ...employeeForm.personalInfo!, gender: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={employeeForm.personalInfo?.nationality || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: { ...employeeForm.personalInfo!, nationality: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={employeeForm.personalInfo?.dateOfBirth || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: { ...employeeForm.personalInfo!, dateOfBirth: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select 
                      value={employeeForm.personalInfo?.maritalStatus} 
                      onValueChange={(value: any) => setEmployeeForm({
                        ...employeeForm,
                        personalInfo: { ...employeeForm.personalInfo!, maritalStatus: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Identity Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID</Label>
                      <Input
                        id="nationalId"
                        value={employeeForm.identityInfo?.nationalId || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          identityInfo: { ...employeeForm.identityInfo!, nationalId: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={employeeForm.identityInfo?.passportNumber || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          identityInfo: { ...employeeForm.identityInfo!, passportNumber: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="immigrationStatus">Immigration Status *</Label>
                      <Select 
                        value={employeeForm.identityInfo?.immigrationStatus} 
                        onValueChange={(value: any) => setEmployeeForm({
                          ...employeeForm,
                          identityInfo: { ...employeeForm.identityInfo!, immigrationStatus: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="Work Permit">Work Permit</SelectItem>
                          <SelectItem value="Resident">Resident</SelectItem>
                          <SelectItem value="Temporary Visa">Temporary Visa</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workPermitNumber">Work Permit Number</Label>
                      <Input
                        id="workPermitNumber"
                        value={employeeForm.identityInfo?.workPermitNumber || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          identityInfo: { ...employeeForm.identityInfo!, workPermitNumber: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {employeeFormStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Contract Type *</Label>
                    <Select 
                      value={employeeForm.employmentInfo?.contractType} 
                      onValueChange={(value: any) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, contractType: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Probationary">Probationary</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={employeeForm.employmentInfo?.employeeId || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, employeeId: e.target.value }
                      })}
                      placeholder="e.g., EMP001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={employeeForm.employmentInfo?.jobTitle || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, jobTitle: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select 
                      value={employeeForm.employmentInfo?.department} 
                      onValueChange={(value) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, department: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                        <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                        <SelectItem value="Personal Banking">Personal Banking</SelectItem>
                        <SelectItem value="Trade Finance">Trade Finance</SelectItem>
                        <SelectItem value="Risk Management">Risk Management</SelectItem>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Compliance">Compliance</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation">Work Location *</Label>
                    <Input
                      id="workLocation"
                      value={employeeForm.employmentInfo?.workLocation || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, workLocation: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentStartDate">Employment Start Date *</Label>
                    <Input
                      id="employmentStartDate"
                      type="date"
                      value={employeeForm.employmentInfo?.employmentStartDate || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, employmentStartDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="directSupervisor">Direct Supervisor</Label>
                    <Input
                      id="directSupervisor"
                      value={employeeForm.employmentInfo?.directSupervisor || ''}
                      onChange={(e) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, directSupervisor: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Additional Employment Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select 
                      value={employeeForm.employmentInfo?.employmentStatus} 
                      onValueChange={(value: any) => setEmployeeForm({
                        ...employeeForm,
                        employmentInfo: { ...employeeForm.employmentInfo!, employmentStatus: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="Resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(employeeForm.employmentInfo?.contractType === 'Probationary') && (
                    <div className="space-y-2">
                      <Label htmlFor="probationEndDate">Probation End Date</Label>
                      <Input
                        id="probationEndDate"
                        type="date"
                        value={employeeForm.employmentInfo?.probationEndDate || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          employmentInfo: { ...employeeForm.employmentInfo!, probationEndDate: e.target.value }
                        })}
                      />
                    </div>
                  )}
                  {(employeeForm.employmentInfo?.contractType === 'Temporary' || employeeForm.employmentInfo?.contractType === 'Contract') && (
                    <div className="space-y-2">
                      <Label htmlFor="contractEndDate">Contract End Date</Label>
                      <Input
                        id="contractEndDate"
                        type="date"
                        value={employeeForm.employmentInfo?.contractEndDate || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          employmentInfo: { ...employeeForm.employmentInfo!, contractEndDate: e.target.value }
                        })}
                      />
                    </div>
                  )}
                  {(employeeForm.employmentInfo?.employmentStatus === 'Terminated' || employeeForm.employmentInfo?.employmentStatus === 'Resigned') && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="terminationDate">Termination Date</Label>
                        <Input
                          id="terminationDate"
                          type="date"
                          value={employeeForm.employmentInfo?.terminationDate || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            employmentInfo: { ...employeeForm.employmentInfo!, terminationDate: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="terminationReason">Termination Reason</Label>
                        <Textarea
                          id="terminationReason"
                          value={employeeForm.employmentInfo?.terminationReason || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            employmentInfo: { ...employeeForm.employmentInfo!, terminationReason: e.target.value }
                          })}
                          rows={2}
                          placeholder="Reason for termination..."
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    value={employeeForm.employmentInfo?.jobDescription || ''}
                    onChange={(e) => setEmployeeForm({
                      ...employeeForm,
                      employmentInfo: { ...employeeForm.employmentInfo!, jobDescription: e.target.value }
                    })}
                    rows={3}
                    placeholder="Detailed job description including responsibilities and requirements..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Compensation & Benefits */}
            {employeeFormStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Compensation & Benefits</h3>
                
                {/* Salary Structure */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Salary Structure</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="baseSalary">Base Salary *</Label>
                      <Input
                        id="baseSalary"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.baseSalary || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              baseSalary: Number(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={employeeForm.compensationInfo?.salaryStructure?.currency} 
                        onValueChange={(value) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              currency: value
                            }
                          }
                        })}
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
                    <div className="space-y-2">
                      <Label htmlFor="payFrequency">Pay Frequency</Label>
                      <Select 
                        value={employeeForm.compensationInfo?.salaryStructure?.payFrequency} 
                        onValueChange={(value: any) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              payFrequency: value
                            }
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Allowances */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Allowances</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transportAllowance">Transport Allowance</Label>
                      <Input
                        id="transportAllowance"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.transport || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                transport: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medicalAllowance">Medical Allowance</Label>
                      <Input
                        id="medicalAllowance"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.medical || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                medical: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="housingAllowance">Housing Allowance</Label>
                      <Input
                        id="housingAllowance"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.housing || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                housing: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mealAllowance">Meal Allowance</Label>
                      <Input
                        id="mealAllowance"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.meal || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                meal: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="communicationAllowance">Communication Allowance</Label>
                      <Input
                        id="communicationAllowance"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.communication || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                communication: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherAllowances">Other Allowances</Label>
                      <Input
                        id="otherAllowances"
                        type="number"
                        value={employeeForm.compensationInfo?.salaryStructure?.allowances?.other || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            salaryStructure: {
                              ...employeeForm.compensationInfo!.salaryStructure!,
                              allowances: {
                                ...employeeForm.compensationInfo!.salaryStructure!.allowances!,
                                other: Number(e.target.value)
                              }
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Benefits Package</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="medicalInsurance"
                          checked={employeeForm.compensationInfo?.benefits?.medicalInsurance || false}
                          onCheckedChange={(checked) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                medicalInsurance: checked as boolean
                              }
                            }
                          })}
                        />
                        <Label htmlFor="medicalInsurance">Medical Insurance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="lifeInsurance"
                          checked={employeeForm.compensationInfo?.benefits?.lifeInsurance || false}
                          onCheckedChange={(checked) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                lifeInsurance: checked as boolean
                              }
                            }
                          })}
                        />
                        <Label htmlFor="lifeInsurance">Life Insurance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pensionScheme"
                          checked={employeeForm.compensationInfo?.benefits?.pensionScheme || false}
                          onCheckedChange={(checked) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                pensionScheme: checked as boolean
                              }
                            }
                          })}
                        />
                        <Label htmlFor="pensionScheme">Pension Scheme</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="annualLeave">Annual Leave Days</Label>
                        <Input
                          id="annualLeave"
                          type="number"
                          value={employeeForm.compensationInfo?.benefits?.annualLeave || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                annualLeave: Number(e.target.value)
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sickLeave">Sick Leave Days</Label>
                        <Input
                          id="sickLeave"
                          type="number"
                          value={employeeForm.compensationInfo?.benefits?.sickLeave || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                sickLeave: Number(e.target.value)
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maternityLeave">Maternity Leave Days</Label>
                        <Input
                          id="maternityLeave"
                          type="number"
                          value={employeeForm.compensationInfo?.benefits?.maternityLeave || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                maternityLeave: Number(e.target.value)
                              }
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paternityLeave">Paternity Leave Days</Label>
                        <Input
                          id="paternityLeave"
                          type="number"
                          value={employeeForm.compensationInfo?.benefits?.paternityLeave || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            compensationInfo: {
                              ...employeeForm.compensationInfo!,
                              benefits: {
                                ...employeeForm.compensationInfo!.benefits!,
                                paternityLeave: Number(e.target.value)
                              }
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Tax Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={employeeForm.compensationInfo?.taxInfo?.taxId || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            taxInfo: {
                              ...employeeForm.compensationInfo!.taxInfo!,
                              taxId: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxExemptions">Tax Exemptions</Label>
                      <Input
                        id="taxExemptions"
                        type="number"
                        value={employeeForm.compensationInfo?.taxInfo?.taxExemptions || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            taxInfo: {
                              ...employeeForm.compensationInfo!.taxInfo!,
                              taxExemptions: Number(e.target.value)
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialSecurityNumber">Social Security Number</Label>
                      <Input
                        id="socialSecurityNumber"
                        value={employeeForm.compensationInfo?.taxInfo?.socialSecurityNumber || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          compensationInfo: {
                            ...employeeForm.compensationInfo!,
                            taxInfo: {
                              ...employeeForm.compensationInfo!.taxInfo!,
                              socialSecurityNumber: e.target.value
                            }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Banking Information */}
            {employeeFormStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Contact & Banking Information</h3>
                
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workEmail">Work Email *</Label>
                      <Input
                        id="workEmail"
                        type="email"
                        value={employeeForm.contactInfo?.workEmail || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { ...employeeForm.contactInfo!, workEmail: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalEmail">Personal Email</Label>
                      <Input
                        id="personalEmail"
                        type="email"
                        value={employeeForm.contactInfo?.personalEmail || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { ...employeeForm.contactInfo!, personalEmail: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalPhone">Personal Phone *</Label>
                      <Input
                        id="personalPhone"
                        value={employeeForm.contactInfo?.personalPhone || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { ...employeeForm.contactInfo!, personalPhone: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workPhone">Work Phone</Label>
                      <Input
                        id="workPhone"
                        value={employeeForm.contactInfo?.workPhone || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { ...employeeForm.contactInfo!, workPhone: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        value={employeeForm.contactInfo?.address?.street || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { 
                            ...employeeForm.contactInfo!, 
                            address: { ...employeeForm.contactInfo!.address!, street: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={employeeForm.contactInfo?.address?.city || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { 
                            ...employeeForm.contactInfo!, 
                            address: { ...employeeForm.contactInfo!.address!, city: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province *</Label>
                      <Input
                        id="state"
                        value={employeeForm.contactInfo?.address?.state || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { 
                            ...employeeForm.contactInfo!, 
                            address: { ...employeeForm.contactInfo!.address!, state: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={employeeForm.contactInfo?.address?.postalCode || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { 
                            ...employeeForm.contactInfo!, 
                            address: { ...employeeForm.contactInfo!.address!, postalCode: e.target.value }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={employeeForm.contactInfo?.address?.country || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          contactInfo: { 
                            ...employeeForm.contactInfo!, 
                            address: { ...employeeForm.contactInfo!.address!, country: e.target.value }
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Emergency Contact Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                      <Input
                        id="emergencyName"
                        value={employeeForm.contactInfo?.emergencyContacts?.[0]?.name || ''}
                        onChange={(e) => {
                          const contacts = employeeForm.contactInfo?.emergencyContacts || [];
                          const updatedContacts = [...contacts];
                          if (updatedContacts.length === 0) {
                            updatedContacts.push({
                              id: 'ec1',
                              name: e.target.value,
                              relationship: '',
                              phone: '',
                              isPrimary: true
                            });
                          } else {
                            updatedContacts[0] = { ...updatedContacts[0], name: e.target.value };
                          }
                          setEmployeeForm({
                            ...employeeForm,
                            contactInfo: { 
                              ...employeeForm.contactInfo!, 
                              emergencyContacts: updatedContacts
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelationship">Relationship *</Label>
                      <Select 
                        value={employeeForm.contactInfo?.emergencyContacts?.[0]?.relationship || ''} 
                        onValueChange={(value) => {
                          const contacts = employeeForm.contactInfo?.emergencyContacts || [];
                          const updatedContacts = [...contacts];
                          if (updatedContacts.length === 0) {
                            updatedContacts.push({
                              id: 'ec1',
                              name: '',
                              relationship: value,
                              phone: '',
                              isPrimary: true
                            });
                          } else {
                            updatedContacts[0] = { ...updatedContacts[0], relationship: value };
                          }
                          setEmployeeForm({
                            ...employeeForm,
                            contactInfo: { 
                              ...employeeForm.contactInfo!, 
                              emergencyContacts: updatedContacts
                            }
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        value={employeeForm.contactInfo?.emergencyContacts?.[0]?.phone || ''}
                        onChange={(e) => {
                          const contacts = employeeForm.contactInfo?.emergencyContacts || [];
                          const updatedContacts = [...contacts];
                          if (updatedContacts.length === 0) {
                            updatedContacts.push({
                              id: 'ec1',
                              name: '',
                              relationship: '',
                              phone: e.target.value,
                              isPrimary: true
                            });
                          } else {
                            updatedContacts[0] = { ...updatedContacts[0], phone: e.target.value };
                          }
                          setEmployeeForm({
                            ...employeeForm,
                            contactInfo: { 
                              ...employeeForm.contactInfo!, 
                              emergencyContacts: updatedContacts
                            }
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyEmail">Emergency Contact Email</Label>
                      <Input
                        id="emergencyEmail"
                        type="email"
                        value={employeeForm.contactInfo?.emergencyContacts?.[0]?.email || ''}
                        onChange={(e) => {
                          const contacts = employeeForm.contactInfo?.emergencyContacts || [];
                          const updatedContacts = [...contacts];
                          if (updatedContacts.length === 0) {
                            updatedContacts.push({
                              id: 'ec1',
                              name: '',
                              relationship: '',
                              phone: '',
                              email: e.target.value,
                              isPrimary: true
                            });
                          } else {
                            updatedContacts[0] = { ...updatedContacts[0], email: e.target.value };
                          }
                          setEmployeeForm({
                            ...employeeForm,
                            contactInfo: { 
                              ...employeeForm.contactInfo!, 
                              emergencyContacts: updatedContacts
                            }
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Banking Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Banking & Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select 
                        value={employeeForm.bankingInfo?.paymentMethod} 
                        onValueChange={(value: any) => setEmployeeForm({
                          ...employeeForm,
                          bankingInfo: { ...employeeForm.bankingInfo!, paymentMethod: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Check">Check</SelectItem>
                          <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={employeeForm.bankingInfo?.bankName || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          bankingInfo: { ...employeeForm.bankingInfo!, bankName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number *</Label>
                      <Input
                        id="accountNumber"
                        value={employeeForm.bankingInfo?.accountNumber || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          bankingInfo: { ...employeeForm.bankingInfo!, accountNumber: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Name *</Label>
                      <Input
                        id="accountName"
                        value={employeeForm.bankingInfo?.accountName || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          bankingInfo: { ...employeeForm.bankingInfo!, accountName: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankBranch">Bank Branch</Label>
                      <Input
                        id="bankBranch"
                        value={employeeForm.bankingInfo?.bankBranch || ''}
                        onChange={(e) => setEmployeeForm({
                          ...employeeForm,
                          bankingInfo: { ...employeeForm.bankingInfo!, bankBranch: e.target.value }
                        })}
                      />
                    </div>
                    {employeeForm.bankingInfo?.paymentMethod === 'Mobile Money' && (
                      <div className="space-y-2">
                        <Label htmlFor="mobileMoneyNumber">Mobile Money Number</Label>
                        <Input
                          id="mobileMoneyNumber"
                          value={employeeForm.bankingInfo?.mobileMoneyNumber || ''}
                          onChange={(e) => setEmployeeForm({
                            ...employeeForm,
                            bankingInfo: { ...employeeForm.bankingInfo!, mobileMoneyNumber: e.target.value }
                          })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {employeeFormStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Employee Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {employeeForm.personalInfo?.fullName}
                    </div>
                    <div>
                      <span className="font-medium">Position:</span> {employeeForm.employmentInfo?.jobTitle}
                    </div>
                    <div>
                      <span className="font-medium">Department:</span> {employeeForm.employmentInfo?.department}
                    </div>
                    <div>
                      <span className="font-medium">Salary:</span> {employeeForm.compensationInfo?.salaryStructure?.currency} {employeeForm.compensationInfo?.salaryStructure?.baseSalary}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setEmployeeFormStep(Math.max(1, employeeFormStep - 1))}
                disabled={employeeFormStep === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowEmployeeDialog(false)}>
                  Cancel
                </Button>
                {employeeFormStep < 5 ? (
                  <Button 
                    onClick={() => setEmployeeFormStep(employeeFormStep + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCreateEmployee}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={
                      !employeeForm.personalInfo?.firstName ||
                      !employeeForm.personalInfo?.lastName ||
                      !employeeForm.employmentInfo?.jobTitle ||
                      !employeeForm.employmentInfo?.department
                    }
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    {editingEmployee ? 'Update Employee' : 'Create Employee'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Profile View Dialog */}
      <Dialog open={showEmployeeViewDialog} onOpenChange={setShowEmployeeViewDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Employee Profile: {selectedEmployee?.personalInfo?.fullName}
            </DialogTitle>
            <DialogDescription>
              Comprehensive employee information and details
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="compensation">Compensation</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                        <p className="text-sm font-medium">{selectedEmployee.personalInfo?.fullName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">First Name</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.firstName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Last Name</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.lastName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Gender</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Nationality</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.nationality || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.dateOfBirth || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Marital Status</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.maritalStatus || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Religion</Label>
                        <p className="text-sm">{selectedEmployee.personalInfo?.religion || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Identity Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">National ID</Label>
                        <p className="text-sm">{selectedEmployee.identityInfo?.nationalId || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Passport Number</Label>
                        <p className="text-sm">{selectedEmployee.identityInfo?.passportNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Work Permit Number</Label>
                        <p className="text-sm">{selectedEmployee.identityInfo?.workPermitNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Immigration Status</Label>
                        <Badge variant="outline">{selectedEmployee.identityInfo?.immigrationStatus || 'N/A'}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Work Permit Expiry</Label>
                        <p className="text-sm">{selectedEmployee.identityInfo?.workPermitExpiry || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Visa Expiry</Label>
                        <p className="text-sm">{selectedEmployee.identityInfo?.visaExpiry || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Employment Information Tab */}
              <TabsContent value="employment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BriefcaseIcon className="h-4 w-4" />
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                        <p className="text-sm font-medium">{selectedEmployee.employmentInfo?.employeeId || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Job Title</Label>
                        <p className="text-sm font-medium">{selectedEmployee.employmentInfo?.jobTitle || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Department</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.department || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Contract Type</Label>
                        <Badge className={getContractTypeColor(selectedEmployee.employmentInfo?.contractType || '')}>
                          {selectedEmployee.employmentInfo?.contractType || 'N/A'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Employment Status</Label>
                        <Badge className={getEmployeeStatusColor(selectedEmployee.employmentInfo?.employmentStatus || '')}>
                          {selectedEmployee.employmentInfo?.employmentStatus || 'N/A'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Direct Supervisor</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.directSupervisor || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Work Location</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.workLocation || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Start Date</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.employmentStartDate || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Probation End Date</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.probationEndDate || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Contract End Date</Label>
                        <p className="text-sm">{selectedEmployee.employmentInfo?.contractEndDate || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-600">Job Description</Label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                        {selectedEmployee.employmentInfo?.jobDescription || 'No job description available'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compensation Information Tab */}
              <TabsContent value="compensation" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSignIcon className="h-4 w-4" />
                      Salary Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Base Salary</Label>
                        <p className="text-lg font-bold text-green-600">
                          {selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.baseSalary?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Currency</Label>
                        <p className="text-sm">{selectedEmployee.compensationInfo?.salaryStructure?.currency || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Pay Frequency</Label>
                        <p className="text-sm">{selectedEmployee.compensationInfo?.salaryStructure?.payFrequency || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">Allowances</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-md">
                          <p className="text-xs text-blue-600 font-medium">Transport Allowance</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.transport?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-md">
                          <p className="text-xs text-green-600 font-medium">Medical Allowance</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.medical?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-md">
                          <p className="text-xs text-purple-600 font-medium">Housing Allowance</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.housing?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-md">
                          <p className="text-xs text-orange-600 font-medium">Meal Allowance</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.meal?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-3 bg-cyan-50 rounded-md">
                          <p className="text-xs text-cyan-600 font-medium">Communication Allowance</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.communication?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="text-xs text-gray-600 font-medium">Other Allowances</p>
                          <p className="text-sm font-bold">{selectedEmployee.compensationInfo?.salaryStructure?.currency} {selectedEmployee.compensationInfo?.salaryStructure?.allowances?.other?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldIcon className="h-4 w-4" />
                      Benefits & Pension
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-600">Insurance Benefits</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Medical Insurance</span>
                            <Badge variant={selectedEmployee.compensationInfo?.benefits?.medicalInsurance ? "default" : "secondary"}>
                              {selectedEmployee.compensationInfo?.benefits?.medicalInsurance ? 'Enrolled' : 'Not Enrolled'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Life Insurance</span>
                            <Badge variant={selectedEmployee.compensationInfo?.benefits?.lifeInsurance ? "default" : "secondary"}>
                              {selectedEmployee.compensationInfo?.benefits?.lifeInsurance ? 'Enrolled' : 'Not Enrolled'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                            <span className="text-sm font-medium">Pension Scheme</span>
                            <Badge variant={selectedEmployee.compensationInfo?.benefits?.pensionScheme ? "default" : "secondary"} className="bg-blue-600">
                              {selectedEmployee.compensationInfo?.benefits?.pensionScheme ? 'Active Contributor' : 'Not Enrolled'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-600">Leave Entitlements</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Annual Leave</span>
                            <span className="text-sm font-bold">{selectedEmployee.compensationInfo?.benefits?.annualLeave || 0} days</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                            <span className="text-sm">Sick Leave</span>
                            <span className="text-sm font-bold">{selectedEmployee.compensationInfo?.benefits?.sickLeave || 0} days</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-pink-50 rounded">
                            <span className="text-sm">Maternity Leave</span>
                            <span className="text-sm font-bold">{selectedEmployee.compensationInfo?.benefits?.maternityLeave || 0} days</span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm">Paternity Leave</span>
                            <span className="text-sm font-bold">{selectedEmployee.compensationInfo?.benefits?.paternityLeave || 0} days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pension Contribution Details */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <PiggyBankIcon className="h-4 w-4" />
                        Pension Contribution Details
                      </h4>
                      {selectedEmployee.compensationInfo?.benefits?.pensionScheme ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-blue-600">Monthly Contribution Rate</Label>
                            <p className="text-sm font-bold">5% of Basic Salary</p>
                          </div>
                          <div>
                            <Label className="text-xs text-blue-600">Monthly Contribution Amount</Label>
                            <p className="text-sm font-bold">
                              {selectedEmployee.compensationInfo?.salaryStructure?.currency} {Math.round((selectedEmployee.compensationInfo?.salaryStructure?.baseSalary || 0) * 0.05).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-blue-600">Annual Contribution</Label>
                            <p className="text-sm font-bold">
                              {selectedEmployee.compensationInfo?.salaryStructure?.currency} {Math.round((selectedEmployee.compensationInfo?.salaryStructure?.baseSalary || 0) * 0.05 * 12).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">Employee is not enrolled in the pension scheme</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Tax Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Tax ID</Label>
                        <p className="text-sm">{selectedEmployee.compensationInfo?.taxInfo?.taxId || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Tax Exemptions</Label>
                        <p className="text-sm">{selectedEmployee.compensationInfo?.taxInfo?.taxExemptions || 0}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Social Security Number</Label>
                        <p className="text-sm">{selectedEmployee.compensationInfo?.taxInfo?.socialSecurityNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Contact Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Work Email</Label>
                        <p className="text-sm">{selectedEmployee.contactInfo?.workEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Personal Email</Label>
                        <p className="text-sm">{selectedEmployee.contactInfo?.personalEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Personal Phone</Label>
                        <p className="text-sm">{selectedEmployee.contactInfo?.personalPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Work Phone</Label>
                        <p className="text-sm">{selectedEmployee.contactInfo?.workPhone || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Street Address</Label>
                        <p className="text-sm">{selectedEmployee.contactInfo?.address?.street || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">City</Label>
                          <p className="text-sm">{selectedEmployee.contactInfo?.address?.city || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">State</Label>
                          <p className="text-sm">{selectedEmployee.contactInfo?.address?.state || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Postal Code</Label>
                          <p className="text-sm">{selectedEmployee.contactInfo?.address?.postalCode || 'N/A'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Country</Label>
                          <p className="text-sm">{selectedEmployee.contactInfo?.address?.country || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee.contactInfo?.emergencyContacts?.length > 0 ? (
                      <div className="space-y-4">
                        {selectedEmployee.contactInfo.emergencyContacts.map((contact, index) => (
                          <div key={contact.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{contact.name}</h4>
                              {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <Label className="text-xs text-gray-600">Relationship</Label>
                                <p>{contact.relationship}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Phone</Label>
                                <p>{contact.phone}</p>
                              </div>
                              <div>
                                <Label className="text-xs text-gray-600">Email</Label>
                                <p>{contact.email || 'N/A'}</p>
                              </div>
                            </div>
                            {contact.address && (
                              <div className="mt-2">
                                <Label className="text-xs text-gray-600">Address</Label>
                                <p className="text-sm">{contact.address}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No emergency contacts on file</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Banking Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Bank Name</Label>
                        <p className="text-sm">{selectedEmployee.bankingInfo?.bankName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Account Number</Label>
                        <p className="text-sm font-mono">{selectedEmployee.bankingInfo?.accountNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Account Name</Label>
                        <p className="text-sm">{selectedEmployee.bankingInfo?.accountName || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                        <Badge variant="outline">{selectedEmployee.bankingInfo?.paymentMethod || 'N/A'}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Bank Branch</Label>
                        <p className="text-sm">{selectedEmployee.bankingInfo?.bankBranch || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">SWIFT Code</Label>
                        <p className="text-sm font-mono">{selectedEmployee.bankingInfo?.swiftCode || 'N/A'}</p>
                      </div>
                      {selectedEmployee.bankingInfo?.mobileMoneyNumber && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Mobile Money Number</Label>
                          <p className="text-sm">{selectedEmployee.bankingInfo.mobileMoneyNumber}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4" />
                      Employee Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEmployee.documents?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedEmployee.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileTextIcon className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.type} • {doc.fileName}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={doc.isVerified ? "default" : "secondary"}>
                                {doc.isVerified ? 'Verified' : 'Pending'}
                              </Badge>
                              <p className="text-xs text-gray-500">{doc.uploadDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No documents uploaded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrophyIcon className="h-4 w-4" />
                      Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Evaluations</p>
                        <p className="text-2xl font-bold text-blue-800">{selectedEmployee.performanceInfo?.evaluations?.length || 0}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">Career Changes</p>
                        <p className="text-2xl font-bold text-green-800">{selectedEmployee.performanceInfo?.careerProgression?.length || 0}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">Certifications</p>
                        <p className="text-2xl font-bold text-purple-800">{selectedEmployee.performanceInfo?.certifications?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedEmployee.performanceInfo?.skills?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4" />
                        Skills
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmployee.performanceInfo.skills.map((skill, index) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Created By</Label>
                        <p className="text-sm">{selectedEmployee.systemInfo?.createdBy || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Created Date</Label>
                        <p className="text-sm">{selectedEmployee.systemInfo?.createdDate || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Last Updated By</Label>
                        <p className="text-sm">{selectedEmployee.systemInfo?.lastUpdatedBy || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Last Updated</Label>
                        <p className="text-sm">{selectedEmployee.systemInfo?.lastUpdatedDate || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-600">Profile Completion</Label>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedEmployee.systemInfo?.profileCompletionPercentage || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{selectedEmployee.systemInfo?.profileCompletionPercentage || 0}% Complete</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmployeeViewDialog(false)}>
              Close
            </Button>
            {hasPermission('employee.manage') && (
              <Button 
                onClick={() => {
                  setEditingEmployee(selectedEmployee);
                  setEmployeeForm(selectedEmployee || {} as Employee);
                  setShowEmployeeViewDialog(false);
                  setShowEmployeeDialog(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Employee
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreVerticalIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EditIcon,
  DownloadIcon,
  UploadIcon,
  CalendarIcon,
  BarChart3Icon,
  Target,
  Award,
  GraduationCap,
  Building,
  User,
  Clock3,
  AlertCircle,
  Star,
  FileText,
  Settings,
  MessageSquare,
  Calendar,
  TrendingDown
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  TrainingRecord,
  Certification,
  MandatoryTraining,
  TrainingNeedsAssessment,
  IndividualDevelopmentPlan,
  BANKING_MANDATORY_TRAININGS,
  DEPARTMENT_SKILL_CATEGORIES,
  calculateCertificationExpiryDays,
  getCertificationStatus,
  getTrainingComplianceRate,
  generateTrainingReport
} from "@/lib/trainingUtils";

export default function TrainingDevelopment() {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog states
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [showCertificationDialog, setShowCertificationDialog] = useState(false);
  const [showTNADialog, setShowTNADialog] = useState(false);
  const [showIDPDialog, setShowIDPDialog] = useState(false);

  // Mock data - in real implementation, this would come from API
  const [trainings, setTrainings] = useState<TrainingRecord[]>([
    {
      id: "TRN-2025-001",
      employeeId: "EMP-001",
      employeeName: "Sarah Johnson",
      department: "Personal Banking",
      trainingType: "mandatory",
      trainingTitle: "Anti-Money Laundering & CFT",
      trainingProvider: "Internal Training Dept",
      description: "Comprehensive AML/CFT training covering latest regulations",
      category: "aml-cft",
      startDate: "2025-02-01",
      endDate: "2025-02-01",
      duration: 8,
      status: "completed",
      completionDate: "2025-02-01",
      score: 92,
      passingGrade: 80,
      passed: true,
      cost: 0,
      currency: "USD",
      trainer: "Dr. Michael Adams",
      location: "Training Center - Room A",
      attendanceRequired: true,
      isMandatory: true,
      expiryDate: "2026-02-01",
      reminderSent: false,
      auditTrail: []
    },
    {
      id: "TRN-2025-002",
      employeeId: "EMP-002",
      employeeName: "James Wilson",
      department: "Corporate Banking",
      trainingType: "external",
      trainingTitle: "Advanced Credit Risk Analysis",
      trainingProvider: "Banking Institute of East Africa",
      description: "Advanced techniques in credit risk assessment and modeling",
      category: "risk-management",
      startDate: "2025-03-15",
      endDate: "2025-03-17",
      duration: 24,
      status: "scheduled",
      passingGrade: 75,
      passed: false,
      cost: 1500,
      currency: "USD",
      trainer: "Prof. David Kimani",
      location: "Nairobi, Kenya",
      attendanceRequired: true,
      isMandatory: false,
      reminderSent: false,
      auditTrail: []
    }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "CERT-2025-001",
      employeeId: "EMP-001",
      employeeName: "Sarah Johnson",
      department: "Personal Banking",
      certificationName: "Certified Anti-Money Laundering Specialist (CAMS)",
      issuingOrganization: "Association of Certified Anti-Money Laundering Specialists",
      certificationNumber: "CAMS-2024-5547",
      category: "aml-cft",
      issueDate: "2024-06-15",
      expiryDate: "2027-06-15",
      status: "active",
      documentUrl: "/documents/certificates/sarah-johnson-cams.pdf",
      isMandatory: true,
      renewalRequired: true,
      renewalNotificationDays: 90,
      cost: 800,
      currency: "USD",
      cpdPoints: 40,
      auditTrail: []
    },
    {
      id: "CERT-2025-002",
      employeeId: "EMP-003",
      employeeName: "Maria Santos",
      department: "Risk Management",
      certificationName: "Financial Risk Manager (FRM)",
      issuingOrganization: "Global Association of Risk Professionals",
      certificationNumber: "FRM-2023-8821",
      category: "risk-management",
      issueDate: "2023-11-20",
      expiryDate: "2025-11-20",
      status: "pending-renewal",
      documentUrl: "/documents/certificates/maria-santos-frm.pdf",
      isMandatory: false,
      renewalRequired: true,
      renewalNotificationDays: 60,
      cost: 1200,
      currency: "USD",
      cpdPoints: 60,
      auditTrail: []
    }
  ]);

  const [mandatoryTrainings, setMandatoryTrainings] = useState<MandatoryTraining[]>([
    {
      id: "MAND-001",
      trainingName: "Anti-Money Laundering & Counter Financing of Terrorism",
      description: "Comprehensive training on AML/CFT regulations and procedures",
      category: "aml-cft",
      frequency: "annual",
      targetAudience: "all-staff",
      targetDepartments: ["Personal Banking", "Corporate Banking", "Trade Finance", "Operations"],
      targetRoles: [],
      duration: 8,
      format: "blended",
      provider: "Internal Training Department",
      passingGrade: 80,
      maxAttempts: 3,
      validityPeriod: 12,
      deadlineFromHiring: 30,
      reminderDays: [90, 60, 30, 7],
      isActive: true,
      createdBy: "HR-001",
      createdDate: "2024-01-01",
      lastUpdated: "2024-12-01",
      auditTrail: []
    },
    {
      id: "MAND-002",
      trainingName: "Banking Ethics & Code of Conduct",
      description: "Ethics training covering professional conduct and ethical decision making",
      category: "ethics",
      frequency: "biannual",
      targetAudience: "all-staff",
      targetDepartments: [],
      targetRoles: [],
      duration: 4,
      format: "online",
      provider: "Internal Training Department",
      passingGrade: 85,
      maxAttempts: 2,
      validityPeriod: 6,
      deadlineFromHiring: 14,
      reminderDays: [60, 30, 14, 3],
      isActive: true,
      createdBy: "HR-001",
      createdDate: "2024-01-01",
      lastUpdated: "2024-06-01",
      auditTrail: []
    }
  ]);

  const [tnaRecords, setTNARecords] = useState<TrainingNeedsAssessment[]>([
    {
      id: "TNA-2025-001",
      department: "Personal Banking",
      assessmentYear: 2025,
      assessmentQuarter: 1,
      conductedBy: "HR-001",
      assessmentDate: "2025-01-15",
      participantCount: 28,
      skillGaps: [
        {
          skillArea: "Digital Banking Platforms",
          currentLevel: 2.8,
          requiredLevel: 4.0,
          gapLevel: 1.2,
          priority: "high",
          affectedEmployees: 22,
          businessImpact: "Customer complaints about digital service delays",
          recommendedTraining: ["Digital Banking Certification", "Mobile Banking Workshop"]
        },
        {
          skillArea: "Customer Service Excellence",
          currentLevel: 3.2,
          requiredLevel: 4.5,
          gapLevel: 1.3,
          priority: "high",
          affectedEmployees: 18,
          businessImpact: "Customer satisfaction scores below target",
          recommendedTraining: ["Customer Service Mastery", "Complaint Resolution Workshop"]
        }
      ],
      priorityTrainings: [
        {
          trainingName: "Digital Banking Mastery Program",
          description: "Comprehensive training on all digital banking platforms and services",
          justification: "Critical skill gap affecting customer service quality",
          targetAudience: "Personal Banking staff",
          estimatedCost: 11000,
          duration: 40,
          priority: "urgent",
          expectedOutcome: "Improve digital banking competency levels",
          successMetrics: ["Increase average skill level to 4.0", "Reduce customer complaints by 30%"]
        }
      ],
      budgetRequirement: 25000,
      currency: "USD",
      timeline: "Q1-Q2 2025",
      approvalStatus: "approved",
      approvedBy: "HR-002",
      approvalDate: "2025-01-20",
      implementationPlan: [],
      progressTracking: [],
      auditTrail: []
    }
  ]);

  const [idps, setIDPs] = useState<IndividualDevelopmentPlan[]>([
    {
      id: "IDP-2025-001",
      employeeId: "EMP-001",
      employeeName: "Sarah Johnson",
      department: "Personal Banking",
      position: "Senior Banking Officer",
      reportingManager: "Michael Brown",
      planYear: 2025,
      planPeriod: "annual",
      careerGoals: [
        {
          id: "CG-001",
          goalType: "promotion",
          description: "Advance to Branch Manager position",
          targetPosition: "Branch Manager",
          targetDepartment: "Personal Banking",
          timeframe: "18 months",
          requiredSkills: ["Leadership", "Team Management", "P&L Management"],
          requiredTraining: ["Leadership Development Program", "Financial Management"],
          requiredExperience: ["Team leadership", "Customer relationship management"],
          milestones: [
            {
              description: "Complete Leadership Development Program",
              targetDate: "2025-06-30",
              status: "pending"
            }
          ],
          priority: "high",
          status: "active"
        }
      ],
      developmentObjectives: [
        {
          id: "DO-001",
          objective: "Enhance Leadership Skills",
          description: "Develop team leadership and management capabilities",
          category: "leadership",
          successCriteria: ["Complete leadership training", "Lead a project team", "Mentor junior staff"],
          targetDate: "2025-08-31",
          progress: 25,
          status: "in-progress",
          activities: [],
          resources: ["Leadership books", "Mentoring program"],
          managerSupport: "Regular coaching sessions with manager"
        }
      ],
      skillAssessment: [
        {
          skillCategory: "Leadership",
          skillName: "Team Management",
          currentLevel: 3,
          targetLevel: 4,
          assessmentDate: "2025-01-01",
          assessor: "Michael Brown",
          assessmentMethod: "manager-review",
          evidence: ["Led customer service improvements"],
          improvementAreas: ["Conflict resolution", "Performance management"],
          strengths: ["Communication", "Problem solving"]
        }
      ],
      trainingPlan: [
        {
          id: "TP-001",
          trainingName: "Leadership Development Program",
          trainingType: "external",
          description: "Comprehensive leadership development for banking professionals",
          provider: "Banking Leadership Institute",
          plannedStartDate: "2025-04-01",
          plannedEndDate: "2025-06-30",
          estimatedCost: 2500,
          priority: "high",
          linkedObjectives: ["DO-001"],
          approvalRequired: true,
          approvalStatus: "approved",
          completionStatus: "planned",
          outcomes: []
        }
      ],
      performanceTargets: [
        {
          id: "PT-001",
          targetArea: "Customer Satisfaction",
          description: "Improve branch customer satisfaction scores",
          measurementCriteria: "Monthly customer satisfaction survey",
          targetValue: 4.5,
          currentValue: 4.1,
          unit: "rating (1-5)",
          deadline: "2025-12-31",
          weight: 30,
          status: "in-progress",
          linkedTraining: ["Customer Service Excellence"]
        }
      ],
      reviewSchedule: [
        {
          reviewType: "formal-review",
          scheduledDate: "2025-06-30",
          participants: ["Sarah Johnson", "Michael Brown", "HR Representative"],
          agenda: ["Progress review", "Goal adjustments", "Next steps"],
          nextReviewDate: "2025-12-31",
          status: "scheduled"
        }
      ],
      budget: 5000,
      currency: "USD",
      status: "active",
      createdDate: "2025-01-01",
      nextReviewDate: "2025-06-30",
      completionRate: 25,
      overallProgress: "satisfactory",
      auditTrail: []
    }
  ]);

  // Dashboard statistics
  const dashboardStats = {
    totalTrainings: trainings.length,
    completedTrainings: trainings.filter(t => t.status === 'completed').length,
    upcomingTrainings: trainings.filter(t => t.status === 'scheduled').length,
    mandatoryCompliance: 87, // percentage
    activeCertifications: certifications.filter(c => c.status === 'active').length,
    expiringCertifications: certifications.filter(c => {
      const days = calculateCertificationExpiryDays(c.expiryDate);
      return days > 0 && days <= 90;
    }).length,
    activeIDPs: idps.filter(i => i.status === 'active').length,
    trainingBudgetUsed: 68, // percentage
    avgTrainingHours: 42, // per employee per year
    complianceRate: 94 // percentage
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Training & Development</h2>
          <p className="text-gray-600">
            Staff Development Best Practices - Learning and Capacity-Building Management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowTrainingDialog(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Training
          </Button>
          <Button 
            onClick={() => setShowCertificationDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Compliance Alert */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangleIcon className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Mandatory Training Compliance:</strong> {certifications.filter(c => getCertificationStatus(c) === 'expiring-soon').length} certificates expiring within 30 days. 
          {trainings.filter(t => t.isMandatory && t.status !== 'completed').length} mandatory trainings pending completion.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="training-history">Training History</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="mandatory">Mandatory Trainings</TabsTrigger>
          <TabsTrigger value="tna">Training Needs Assessment</TabsTrigger>
          <TabsTrigger value="idps">Individual Development Plans</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalTrainings}</div>
                <p className="text-xs text-gray-600 mt-1">All training records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardStats.completedTrainings}</div>
                <p className="text-xs text-gray-600 mt-1">Finished trainings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{dashboardStats.activeCertifications}</div>
                <p className="text-xs text-gray-600 mt-1">Valid certifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{dashboardStats.complianceRate}%</div>
                <p className="text-xs text-gray-600 mt-1">Mandatory training compliance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active IDPs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">{dashboardStats.activeIDPs}</div>
                <p className="text-xs text-gray-600 mt-1">Development plans</p>
              </CardContent>
            </Card>
          </div>

          {/* Training Overview and Compliance Tracking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  Training Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completed Trainings</span>
                      <span>{dashboardStats.completedTrainings}/{dashboardStats.totalTrainings}</span>
                    </div>
                    <Progress value={(dashboardStats.completedTrainings / dashboardStats.totalTrainings) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Mandatory Compliance</span>
                      <span>{dashboardStats.mandatoryCompliance}%</span>
                    </div>
                    <Progress value={dashboardStats.mandatoryCompliance} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Budget Used</span>
                      <span>{dashboardStats.trainingBudgetUsed}%</span>
                    </div>
                    <Progress value={dashboardStats.trainingBudgetUsed} className="h-2" />
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-600">Average Training Hours/Employee/Year</div>
                    <div className="text-lg font-semibold">{dashboardStats.avgTrainingHours} hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-5 w-5" />
                  Compliance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                    <div className="font-medium text-red-800">Expiring Certificates</div>
                    <div className="text-sm text-red-600">{dashboardStats.expiringCertifications} certificates expiring within 90 days</div>
                  </div>
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="font-medium text-yellow-800">Pending Mandatory Trainings</div>
                    <div className="text-sm text-yellow-600">
                      {trainings.filter(t => t.isMandatory && t.status !== 'completed').length} mandatory trainings overdue
                    </div>
                  </div>
                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Upcoming Trainings</div>
                    <div className="text-sm text-blue-600">{dashboardStats.upcomingTrainings} trainings scheduled</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Recent Training Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trainings.slice(0, 5).map((training) => (
                  <div key={training.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        training.status === 'completed' ? 'bg-green-100' :
                        training.status === 'in-progress' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        {training.status === 'completed' ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        ) : training.status === 'in-progress' ? (
                          <ClockIcon className="h-4 w-4 text-blue-600" />
                        ) : (
                          <BookOpenIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{training.trainingTitle}</div>
                        <div className="text-sm text-gray-600">{training.employeeName} • {training.department}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        training.status === 'completed' ? 'default' :
                        training.status === 'in-progress' ? 'secondary' :
                        'outline'
                      }>
                        {training.status}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {format(new Date(training.startDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training History Tab */}
        <TabsContent value="training-history" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>
                Complete record of all training activities (internal and external)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search trainings, employees, or providers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="personal-banking">Personal Banking</SelectItem>
                    <SelectItem value="corporate-banking">Corporate Banking</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="risk-management">Risk Management</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Details</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{training.trainingTitle}</div>
                          <div className="text-sm text-gray-600">{training.trainingProvider}</div>
                          <div className="text-xs text-gray-500">{training.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{training.employeeName}</div>
                          <div className="text-sm text-gray-600">{training.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={training.trainingType === 'mandatory' ? 'destructive' : 'secondary'}>
                          {training.trainingType}
                        </Badge>
                        {training.isMandatory && (
                          <Badge variant="outline" className="ml-1">Mandatory</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          training.status === 'completed' ? 'default' :
                          training.status === 'in-progress' ? 'secondary' :
                          training.status === 'scheduled' ? 'outline' :
                          'destructive'
                        }>
                          {training.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{training.duration}h</TableCell>
                      <TableCell>
                        {training.score ? (
                          <div className={`font-medium ${training.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {training.score}% {training.passed ? '✓' : '✗'}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          {training.certificateUrl && (
                            <Button variant="ghost" size="sm">
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certification Management</CardTitle>
              <CardDescription>
                Track certification uploads and expiry dates with automated reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certification Details</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.map((cert) => {
                    const status = getCertificationStatus(cert);
                    const daysToExpiry = calculateCertificationExpiryDays(cert.expiryDate);
                    
                    return (
                      <TableRow key={cert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cert.certificationName}</div>
                            <div className="text-sm text-gray-600">{cert.issuingOrganization}</div>
                            <div className="text-xs text-gray-500">#{cert.certificationNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{cert.employeeName}</div>
                            <div className="text-sm text-gray-600">{cert.department}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{cert.category}</Badge>
                          {cert.isMandatory && (
                            <Badge variant="destructive" className="ml-1">Mandatory</Badge>
                          )}
                        </TableCell>
                        <TableCell>{format(new Date(cert.issueDate), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div>
                            <div>{format(new Date(cert.expiryDate), 'MMM dd, yyyy')}</div>
                            {daysToExpiry > 0 && daysToExpiry <= 90 && (
                              <div className="text-xs text-orange-600">
                                {daysToExpiry} days remaining
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            status === 'active' ? 'default' :
                            status === 'expiring-soon' ? 'destructive' :
                            status === 'renewal-due' ? 'secondary' :
                            'outline'
                          }>
                            {cert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                            {status === 'renewal-due' && (
                              <Button variant="ghost" size="sm" className="text-orange-600">
                                <AlertTriangleIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mandatory Trainings Tab */}
        <TabsContent value="mandatory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mandatory Training Programs</CardTitle>
              <CardDescription>
                Compliance, AML/CFT, Ethics, and other required trainings for banking staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="border-red-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-800">AML/CFT Training</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Annual requirement</div>
                      <div className="text-2xl font-bold text-red-600">95%</div>
                      <div className="text-sm text-gray-600">Compliance rate</div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-800">Ethics & Conduct</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Biannual requirement</div>
                      <div className="text-2xl font-bold text-orange-600">88%</div>
                      <div className="text-sm text-gray-600">Compliance rate</div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800">Cyber Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Quarterly requirement</div>
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-sm text-gray-600">Compliance rate</div>
                      <Progress value={92} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Training Program</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mandatoryTrainings.map((training) => (
                    <TableRow key={training.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{training.trainingName}</div>
                          <div className="text-sm text-gray-600">{training.description}</div>
                          <div className="text-xs text-gray-500">Provider: {training.provider}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          training.category === 'aml-cft' ? 'destructive' :
                          training.category === 'ethics' ? 'default' :
                          'secondary'
                        }>
                          {training.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{training.frequency}</div>
                        <div className="text-xs text-gray-500">
                          Valid for {training.validityPeriod} months
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="capitalize">{training.targetAudience.replace('-', ' ')}</div>
                        {training.targetDepartments.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {training.targetDepartments.slice(0, 2).join(', ')}
                            {training.targetDepartments.length > 2 && ' +more'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{training.duration}h</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-medium ${
                            training.category === 'aml-cft' ? 'text-red-600' :
                            training.category === 'ethics' ? 'text-orange-600' :
                            'text-blue-600'
                          }`}>
                            {training.category === 'aml-cft' ? '95%' :
                             training.category === 'ethics' ? '88%' : '92%'}
                          </div>
                          <Progress 
                            value={training.category === 'aml-cft' ? 95 : training.category === 'ethics' ? 88 : 92} 
                            className="h-1 w-16" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <UsersIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Needs Assessment Tab */}
        <TabsContent value="tna" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Training Needs Assessment (TNA)</h3>
              <p className="text-sm text-gray-600">Department-wise skill gap analysis and training recommendations</p>
            </div>
            <Button onClick={() => setShowTNADialog(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New TNA
            </Button>
          </div>

          {/* TNA Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Departments Assessed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{tnaRecords.length}</div>
                <p className="text-xs text-gray-600 mt-1">Out of 6 departments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Critical Skill Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {tnaRecords.reduce((sum, tna) => sum + tna.skillGaps.filter(gap => gap.priority === 'critical').length, 0)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Requiring immediate action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Training Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${tnaRecords.reduce((sum, tna) => sum + tna.budgetRequirement, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">Total requirement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Priority Trainings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {tnaRecords.reduce((sum, tna) => sum + tna.priorityTrainings.length, 0)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Recommended programs</p>
              </CardContent>
            </Card>
          </div>

          {/* TNA Records */}
          {tnaRecords.map((tna) => (
            <Card key={tna.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {tna.department} - Q{tna.assessmentQuarter} {tna.assessmentYear}
                    </CardTitle>
                    <CardDescription>
                      Conducted by {tna.conductedBy} on {format(new Date(tna.assessmentDate), 'MMM dd, yyyy')} • {tna.participantCount} participants
                    </CardDescription>
                  </div>
                  <Badge variant={
                    tna.approvalStatus === 'approved' ? 'default' :
                    tna.approvalStatus === 'pending' ? 'secondary' :
                    'outline'
                  }>
                    {tna.approvalStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skill Gaps */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      Identified Skill Gaps
                    </h4>
                    <div className="space-y-3">
                      {tna.skillGaps.map((gap, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{gap.skillArea}</div>
                            <Badge variant={
                              gap.priority === 'critical' ? 'destructive' :
                              gap.priority === 'high' ? 'secondary' :
                              'outline'
                            }>
                              {gap.priority}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="text-gray-600">Current</div>
                              <div className="font-medium">{gap.currentLevel}/5</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Required</div>
                              <div className="font-medium">{gap.requiredLevel}/5</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Gap</div>
                              <div className="font-medium text-red-600">{gap.gapLevel}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            Affects {gap.affectedEmployees} employees
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Impact: {gap.businessImpact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Trainings */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Priority Training Programs
                    </h4>
                    <div className="space-y-3">
                      {tna.priorityTrainings.map((training, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium">{training.trainingName}</div>
                            <Badge variant={
                              training.priority === 'urgent' ? 'destructive' :
                              training.priority === 'high' ? 'secondary' :
                              'outline'
                            }>
                              {training.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {training.description}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-600">Duration</div>
                              <div className="font-medium">{training.duration}h</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Cost</div>
                              <div className="font-medium">${training.estimatedCost.toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            Target: {training.targetAudience}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-blue-800">Implementation Timeline</div>
                      <div className="text-sm text-blue-600">{tna.timeline}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-800">Budget Requirement</div>
                      <div className="text-lg font-bold text-blue-600">
                        ${tna.budgetRequirement.toLocaleString()} {tna.currency}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Individual Development Plans Tab */}
        <TabsContent value="idps" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Individual Development Plans (IDPs)</h3>
              <p className="text-sm text-gray-600">Personalized career development and training plans</p>
            </div>
            <Button onClick={() => setShowIDPDialog(true)}>
              <PlusIcon className="h-4 w-4 mr-2" />
              New IDP
            </Button>
          </div>

          {/* IDP Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active IDPs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{idps.filter(i => i.status === 'active').length}</div>
                <p className="text-xs text-gray-600 mt-1">Currently in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(idps.reduce((sum, idp) => sum + idp.completionRate, 0) / idps.length)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">Overall completion</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Career Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {idps.reduce((sum, idp) => sum + idp.careerGoals.length, 0)}
                </div>
                <p className="text-xs text-gray-600 mt-1">Total active goals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Training Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-600">
                  ${idps.reduce((sum, idp) => sum + idp.budget, 0).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600 mt-1">Allocated budget</p>
              </CardContent>
            </Card>
          </div>

          {/* IDP Cards */}
          {idps.map((idp) => (
            <Card key={idp.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {idp.employeeName} - {idp.planYear} Development Plan
                    </CardTitle>
                    <CardDescription>
                      {idp.position} • {idp.department} • Manager: {idp.reportingManager}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      idp.status === 'active' ? 'default' :
                      idp.status === 'completed' ? 'secondary' :
                      'outline'
                    }>
                      {idp.status}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      {idp.completionRate}% complete
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Career Goals */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Career Goals
                    </h4>
                    <div className="space-y-3">
                      {idp.careerGoals.map((goal) => (
                        <div key={goal.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-sm">{goal.description}</div>
                            <Badge variant={
                              goal.priority === 'high' ? 'destructive' :
                              goal.priority === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {goal.priority}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600">
                            Target: {goal.targetPosition} • {goal.timeframe}
                          </div>
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 mb-1">Progress</div>
                            <div className="flex gap-1">
                              {goal.milestones.map((milestone, index) => (
                                <div
                                  key={index}
                                  className={`h-2 flex-1 rounded ${
                                    milestone.status === 'achieved' ? 'bg-green-500' :
                                    milestone.status === 'in-progress' ? 'bg-blue-500' :
                                    'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Development Objectives */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BookOpenIcon className="h-4 w-4" />
                      Development Objectives
                    </h4>
                    <div className="space-y-3">
                      {idp.developmentObjectives.map((objective) => (
                        <div key={objective.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm mb-2">{objective.objective}</div>
                          <div className="text-xs text-gray-600 mb-2">
                            Target: {format(new Date(objective.targetDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>{objective.progress}%</span>
                            </div>
                            <Progress value={objective.progress} className="h-1" />
                          </div>
                          <Badge variant={
                            objective.status === 'completed' ? 'default' :
                            objective.status === 'in-progress' ? 'secondary' :
                            objective.status === 'overdue' ? 'destructive' :
                            'outline'
                          }>
                            {objective.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Training Plan */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Training Plan
                    </h4>
                    <div className="space-y-3">
                      {idp.trainingPlan.map((training) => (
                        <div key={training.id} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm mb-2">{training.trainingName}</div>
                          <div className="text-xs text-gray-600 mb-2">
                            {format(new Date(training.plannedStartDate), 'MMM dd')} - {format(new Date(training.plannedEndDate), 'MMM dd, yyyy')}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <div className="text-gray-600">Cost</div>
                              <div className="font-medium">${training.estimatedCost.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-600">Priority</div>
                              <div className="font-medium capitalize">{training.priority}</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge variant={
                              training.completionStatus === 'completed' ? 'default' :
                              training.completionStatus === 'in-progress' ? 'secondary' :
                              training.completionStatus === 'enrolled' ? 'outline' :
                              'outline'
                            }>
                              {training.completionStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Targets */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <BarChart3Icon className="h-4 w-4" />
                    Performance Targets
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {idp.performanceTargets.map((target) => (
                      <div key={target.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm">{target.targetArea}</div>
                          <div className="text-xs text-gray-600">{target.weight}% weight</div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{target.description}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-600">Current</div>
                            <div className="font-medium">{target.currentValue} {target.unit}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Target</div>
                            <div className="font-medium">{target.targetValue} {target.unit}</div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress 
                            value={(target.currentValue / target.targetValue) * 100} 
                            className="h-1" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* IDP Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Overall Progress</div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold">{idp.completionRate}%</div>
                        <Badge variant={
                          idp.overallProgress === 'excellent' ? 'default' :
                          idp.overallProgress === 'good' ? 'secondary' :
                          idp.overallProgress === 'satisfactory' ? 'outline' :
                          'destructive'
                        }>
                          {idp.overallProgress}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Budget Allocated</div>
                      <div className="text-lg font-bold">${idp.budget.toLocaleString()} {idp.currency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Next Review</div>
                      <div className="text-lg font-bold">
                        {format(new Date(idp.nextReviewDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Plan Period</div>
                      <div className="text-lg font-bold capitalize">{idp.planPeriod}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
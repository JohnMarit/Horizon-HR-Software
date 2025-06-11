import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangleIcon, 
  FileTextIcon, 
  UserIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ShieldCheckIcon,
  MessageSquareIcon,
  GavelIcon,
  AlertCircleIcon,
  PlusIcon,
  EyeIcon,
  EditIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DisciplinaryCase {
  id: number;
  caseNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  issueType: 'Attendance' | 'Performance' | 'Conduct' | 'Policy Violation' | 'Insubordination' | 'Other';
  severity: 'Minor' | 'Major' | 'Gross Misconduct';
  description: string;
  incidentDate: string;
  reportedBy: string;
  reportedDate: string;
  status: 'Reported' | 'Under Investigation' | 'Hearing Scheduled' | 'Decision Made' | 'Appeal Filed' | 'Closed';
  actions: DisciplinaryAction[];
  witnesses: string[];
  evidence: string[];
  appealStatus?: 'None' | 'Filed' | 'Under Review' | 'Decided';
  finalOutcome?: string;
  closureDate?: string;
  complianceNotes?: string;
}

interface DisciplinaryAction {
  id: number;
  type: 'Verbal Warning' | 'Written Warning' | 'Final Warning' | 'Suspension' | 'Demotion' | 'Termination' | 'Training Required';
  date: string;
  issuedBy: string;
  description: string;
  durationDays?: number;
  acknowledgmentRequired: boolean;
  employeeAcknowledged: boolean;
  acknowledgmentDate?: string;
  expiryDate?: string;
}

interface GrievanceCase {
  id: number;
  grievanceNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: 'Workplace Harassment' | 'Discrimination' | 'Unfair Treatment' | 'Working Conditions' | 'Pay & Benefits' | 'Management Issues' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  submittedDate: string;
  status: 'Submitted' | 'Acknowledged' | 'Under Investigation' | 'Resolution Proposed' | 'Resolved' | 'Escalated' | 'Closed';
  assignedInvestigator?: string;
  targetResolutionDate: string;
  actualResolutionDate?: string;
  resolutionDetails?: string;
  satisfactionRating?: number;
  escalationLevel: number;
  isAnonymous: boolean;
  supportingDocuments: string[];
}

export const DisciplinaryManagement: React.FC = () => {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('disciplinary');
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [showNewGrievanceDialog, setShowNewGrievanceDialog] = useState(false);
  const [showCaseDetailDialog, setShowCaseDetailDialog] = useState(false);
  const [showGrievanceDetailDialog, setShowGrievanceDetailDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase | null>(null);
  const [selectedGrievance, setSelectedGrievanceCase] = useState<GrievanceCase | null>(null);

  // Form states
  const [disciplinaryForm, setDisciplinaryForm] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    position: '',
    issueType: 'Performance' as const,
    severity: 'Minor' as const,
    description: '',
    incidentDate: '',
    witnesses: '',
    evidence: ''
  });

  const [grievanceForm, setGrievanceForm] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    category: 'Unfair Treatment' as const,
    priority: 'Medium' as const,
    description: '',
    isAnonymous: false,
    targetResolutionDate: ''
  });

  // Mock data for disciplinary cases
  const [disciplinaryCases, setDisciplinaryCases] = useState<DisciplinaryCase[]>([
    {
      id: 1,
      caseNumber: 'DISC-2025-001',
      employeeId: 'HB008',
      employeeName: 'David Majok',
      department: 'Information Technology',
      position: 'IT Systems Manager',
      issueType: 'Attendance',
      severity: 'Minor',
      description: 'Repeated late arrivals without proper notification to supervisor',
      incidentDate: '2025-01-15',
      reportedBy: 'IT Director',
      reportedDate: '2025-01-16',
      status: 'Decision Made',
      actions: [
        {
          id: 1,
          type: 'Verbal Warning',
          date: '2025-01-18',
          issuedBy: 'Sarah Akol',
          description: 'Formal verbal warning for attendance issues with improvement plan',
          acknowledgmentRequired: true,
          employeeAcknowledged: true,
          acknowledgmentDate: '2025-01-18',
          expiryDate: '2025-07-18'
        }
      ],
      witnesses: ['Security Guard - James', 'Reception - Mary'],
      evidence: ['Time logs', 'Security camera footage'],
      appealStatus: 'None',
      finalOutcome: 'Verbal warning issued, improvement plan in place',
      complianceNotes: 'Compliant with South Sudan Labour Act 2017 - progressive discipline'
    },
    {
      id: 2,
      caseNumber: 'DISC-2025-002',
      employeeId: 'HB010',
      employeeName: 'John Kuol',
      department: 'Personal Banking',
      position: 'Branch Operations Supervisor',
      issueType: 'Policy Violation',
      severity: 'Major',
      description: 'Violation of customer data privacy policy - unauthorized access to customer accounts',
      incidentDate: '2025-01-20',
      reportedBy: 'Compliance Officer',
      reportedDate: '2025-01-21',
      status: 'Hearing Scheduled',
      actions: [],
      witnesses: ['IT Security Team', 'Branch Manager'],
      evidence: ['System audit logs', 'CCTV footage', 'Customer complaint'],
      appealStatus: 'None'
    }
  ]);

  // Mock data for grievance cases
  const [grievanceCases, setGrievanceCases] = useState<GrievanceCase[]>([
    {
      id: 1,
      grievanceNumber: 'GRIEV-2025-001',
      employeeId: 'HB005',
      employeeName: 'Grace Ajak',
      department: 'Personal Banking',
      category: 'Discrimination',
      priority: 'High',
      description: 'Alleges gender discrimination in promotion decisions within Personal Banking department',
      submittedDate: '2025-01-10',
      status: 'Under Investigation',
      assignedInvestigator: 'Sarah Akol',
      targetResolutionDate: '2025-02-10',
      escalationLevel: 1,
      isAnonymous: false,
      supportingDocuments: ['Promotion criteria document', 'Email communications']
    },
    {
      id: 2,
      grievanceNumber: 'GRIEV-2025-002',
      employeeId: 'ANON-001',
      employeeName: 'Anonymous Employee',
      department: 'Corporate Banking',
      category: 'Workplace Harassment',
      priority: 'Critical',
      description: 'Reports workplace harassment by supervisor including verbal abuse and intimidation',
      submittedDate: '2025-01-18',
      status: 'Resolution Proposed',
      assignedInvestigator: 'Sarah Akol',
      targetResolutionDate: '2025-02-18',
      escalationLevel: 2,
      isAnonymous: true,
      supportingDocuments: ['Witness statements', 'HR observations']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported':
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation':
      case 'Acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'Hearing Scheduled': return 'bg-orange-100 text-orange-800';
      case 'Decision Made':
      case 'Resolution Proposed': return 'bg-purple-100 text-purple-800';
      case 'Resolved':
      case 'Closed': return 'bg-green-100 text-green-800';
      case 'Appeal Filed':
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'bg-green-100 text-green-800';
      case 'Major': return 'bg-orange-100 text-orange-800';
      case 'Gross Misconduct': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const generateCaseNumber = (type: 'disciplinary' | 'grievance') => {
    const prefix = type === 'disciplinary' ? 'DISC' : 'GRIEV';
    const year = new Date().getFullYear();
    const existingCases = type === 'disciplinary' ? disciplinaryCases : grievanceCases;
    const nextNumber = existingCases.length + 1;
    return `${prefix}-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleCreateDisciplinaryCase = () => {
    if (!hasPermission('compliance.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'DISCIPLINARY', { action: 'create_case' });
      return;
    }

    const newCase: DisciplinaryCase = {
      id: Math.max(...disciplinaryCases.map(c => c.id)) + 1,
      caseNumber: generateCaseNumber('disciplinary'),
      employeeId: disciplinaryForm.employeeId,
      employeeName: disciplinaryForm.employeeName,
      department: disciplinaryForm.department,
      position: disciplinaryForm.position,
      issueType: disciplinaryForm.issueType,
      severity: disciplinaryForm.severity,
      description: disciplinaryForm.description,
      incidentDate: disciplinaryForm.incidentDate,
      reportedBy: user?.name || 'HR Manager',
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Reported',
      actions: [],
      witnesses: disciplinaryForm.witnesses.split(',').map(w => w.trim()).filter(w => w),
      evidence: disciplinaryForm.evidence.split(',').map(e => e.trim()).filter(e => e),
      appealStatus: 'None'
    };

    setDisciplinaryCases([...disciplinaryCases, newCase]);
    setShowNewCaseDialog(false);
    resetDisciplinaryForm();

    addAuditLog('DISCIPLINARY_CASE_CREATED', 'DISCIPLINARY', {
      caseId: newCase.id,
      caseNumber: newCase.caseNumber,
      employeeId: newCase.employeeId,
      issueType: newCase.issueType,
      severity: newCase.severity
    });
  };

  const handleCreateGrievance = () => {
    const newGrievance: GrievanceCase = {
      id: Math.max(...grievanceCases.map(g => g.id)) + 1,
      grievanceNumber: generateCaseNumber('grievance'),
      employeeId: grievanceForm.isAnonymous ? `ANON-${Date.now()}` : grievanceForm.employeeId,
      employeeName: grievanceForm.isAnonymous ? 'Anonymous Employee' : grievanceForm.employeeName,
      department: grievanceForm.department,
      category: grievanceForm.category,
      priority: grievanceForm.priority,
      description: grievanceForm.description,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      targetResolutionDate: grievanceForm.targetResolutionDate,
      escalationLevel: 1,
      isAnonymous: grievanceForm.isAnonymous,
      supportingDocuments: []
    };

    setGrievanceCases([...grievanceCases, newGrievance]);
    setShowNewGrievanceDialog(false);
    resetGrievanceForm();

    addAuditLog('GRIEVANCE_SUBMITTED', 'GRIEVANCE', {
      grievanceId: newGrievance.id,
      grievanceNumber: newGrievance.grievanceNumber,
      category: newGrievance.category,
      priority: newGrievance.priority,
      isAnonymous: newGrievance.isAnonymous
    });
  };

  const resetDisciplinaryForm = () => {
    setDisciplinaryForm({
      employeeId: '',
      employeeName: '',
      department: '',
      position: '',
      issueType: 'Performance',
      severity: 'Minor',
      description: '',
      incidentDate: '',
      witnesses: '',
      evidence: ''
    });
  };

  const resetGrievanceForm = () => {
    setGrievanceForm({
      employeeId: '',
      employeeName: '',
      department: '',
      category: 'Unfair Treatment',
      priority: 'Medium',
      description: '',
      isAnonymous: false,
      targetResolutionDate: ''
    });
  };

  // Permission check
  if (!hasPermission('compliance.view') && !hasPermission('*')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Access Restricted</h3>
          <p className="mt-2 text-gray-500">You don't have permission to view disciplinary and grievance information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disciplinary & Grievance Management</h1>
          <p className="text-gray-600">Manage disciplinary actions and grievance procedures in compliance with South Sudan Labour Act 2017</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('compliance.manage') || hasPermission('*')) && (
            <>
              <Button 
                onClick={() => setShowNewCaseDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangleIcon className="mr-2 h-4 w-4" />
                New Disciplinary Case
              </Button>
              <Button 
                onClick={() => setShowNewGrievanceDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <MessageSquareIcon className="mr-2 h-4 w-4" />
                New Grievance
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Legal Compliance Alert */}
      <Alert className="border-yellow-200 bg-yellow-50">
        <ShieldCheckIcon className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Legal Compliance:</strong> All disciplinary and grievance procedures follow South Sudan Labour Act 2017 requirements including Part VI (Disciplinary Procedures) and Part IX (Grievance Handling).
        </AlertDescription>
      </Alert>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Disciplinary Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {disciplinaryCases.filter(c => !['Closed', 'Decision Made'].includes(c.status)).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open Grievances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {grievanceCases.filter(g => !['Resolved', 'Closed'].includes(g.status)).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Pending resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cases This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {disciplinaryCases.filter(c => new Date(c.reportedDate).getMonth() === new Date().getMonth()).length + 
               grievanceCases.filter(g => new Date(g.submittedDate).getMonth() === new Date().getMonth()).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">New cases reported</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Appeals Filed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {disciplinaryCases.filter(c => c.appealStatus === 'Filed' || c.appealStatus === 'Under Review').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Under review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="disciplinary" className="flex items-center gap-2">
            <GavelIcon className="h-4 w-4" />
            Disciplinary Cases
          </TabsTrigger>
          <TabsTrigger value="grievances" className="flex items-center gap-2">
            <MessageSquareIcon className="h-4 w-4" />
            Grievances
          </TabsTrigger>
        </TabsList>

        {/* Disciplinary Cases Tab */}
        <TabsContent value="disciplinary">
          <Card>
            <CardHeader>
              <CardTitle>Disciplinary Cases</CardTitle>
              <CardDescription>Track and manage disciplinary actions in compliance with labour law</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case Number</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Issue Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinaryCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell className="font-medium">{case_.caseNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{case_.employeeName}</div>
                          <div className="text-sm text-gray-500">{case_.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{case_.issueType}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(case_.severity)}>
                          {case_.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>
                          {case_.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(case_.reportedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCase(case_);
                              setShowCaseDetailDialog(true);
                            }}
                          >
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                          {(hasPermission('compliance.manage') || hasPermission('*')) && (
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <EditIcon className="h-3 w-3" />
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

        {/* Grievances Tab */}
        <TabsContent value="grievances">
          <Card>
            <CardHeader>
              <CardTitle>Grievance Cases</CardTitle>
              <CardDescription>Manage employee grievances and ensure fair resolution processes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grievance Number</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Target Resolution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grievanceCases.map((grievance) => (
                    <TableRow key={grievance.id}>
                      <TableCell className="font-medium">{grievance.grievanceNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grievance.employeeName}</div>
                          <div className="text-sm text-gray-500">{grievance.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{grievance.category}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(grievance.priority)}>
                          {grievance.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(grievance.status)}>
                          {grievance.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(grievance.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(grievance.targetResolutionDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGrievanceCase(grievance);
                              setShowGrievanceDetailDialog(true);
                            }}
                          >
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                          {(hasPermission('compliance.manage') || hasPermission('*')) && (
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <EditIcon className="h-3 w-3" />
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
      </Tabs>

      {/* New Disciplinary Case Dialog */}
      <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Disciplinary Case</DialogTitle>
            <DialogDescription>
              Record a new disciplinary matter in compliance with South Sudan Labour Act 2017
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee-id">Employee ID</Label>
                <Input
                  id="employee-id"
                  value={disciplinaryForm.employeeId}
                  onChange={(e) => setDisciplinaryForm({...disciplinaryForm, employeeId: e.target.value})}
                  placeholder="e.g. HB001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee-name">Employee Name</Label>
                <Input
                  id="employee-name"
                  value={disciplinaryForm.employeeName}
                  onChange={(e) => setDisciplinaryForm({...disciplinaryForm, employeeName: e.target.value})}
                  placeholder="Full name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={disciplinaryForm.department}
                  onChange={(e) => setDisciplinaryForm({...disciplinaryForm, department: e.target.value})}
                  placeholder="Employee's department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={disciplinaryForm.position}
                  onChange={(e) => setDisciplinaryForm({...disciplinaryForm, position: e.target.value})}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue-type">Issue Type</Label>
                <Select 
                  value={disciplinaryForm.issueType} 
                  onValueChange={(value: any) => setDisciplinaryForm({...disciplinaryForm, issueType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                    <SelectItem value="Conduct">Conduct</SelectItem>
                    <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                    <SelectItem value="Insubordination">Insubordination</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={disciplinaryForm.severity} 
                  onValueChange={(value: any) => setDisciplinaryForm({...disciplinaryForm, severity: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Gross Misconduct">Gross Misconduct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident-date">Incident Date</Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={disciplinaryForm.incidentDate}
                  onChange={(e) => setDisciplinaryForm({...disciplinaryForm, incidentDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Issue</Label>
              <Textarea
                id="description"
                value={disciplinaryForm.description}
                onChange={(e) => setDisciplinaryForm({...disciplinaryForm, description: e.target.value})}
                placeholder="Detailed description of the disciplinary issue..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="witnesses">Witnesses</Label>
              <Input
                id="witnesses"
                value={disciplinaryForm.witnesses}
                onChange={(e) => setDisciplinaryForm({...disciplinaryForm, witnesses: e.target.value})}
                placeholder="Comma-separated list of witnesses"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidence">Evidence/Documentation</Label>
              <Input
                id="evidence"
                value={disciplinaryForm.evidence}
                onChange={(e) => setDisciplinaryForm({...disciplinaryForm, evidence: e.target.value})}
                placeholder="Comma-separated list of evidence items"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewCaseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDisciplinaryCase} className="bg-red-600 hover:bg-red-700">
              Create Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Grievance Dialog */}
      <Dialog open={showNewGrievanceDialog} onOpenChange={setShowNewGrievanceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Grievance</DialogTitle>
            <DialogDescription>
              Submit a grievance for investigation and resolution
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={grievanceForm.isAnonymous}
                onChange={(e) => setGrievanceForm({...grievanceForm, isAnonymous: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="anonymous">Submit anonymously</Label>
            </div>

            {!grievanceForm.isAnonymous && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="griev-employee-id">Employee ID</Label>
                  <Input
                    id="griev-employee-id"
                    value={grievanceForm.employeeId}
                    onChange={(e) => setGrievanceForm({...grievanceForm, employeeId: e.target.value})}
                    placeholder="e.g. HB001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="griev-employee-name">Employee Name</Label>
                  <Input
                    id="griev-employee-name"
                    value={grievanceForm.employeeName}
                    onChange={(e) => setGrievanceForm({...grievanceForm, employeeName: e.target.value})}
                    placeholder="Full name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="griev-department">Department</Label>
              <Input
                id="griev-department"
                value={grievanceForm.department}
                onChange={(e) => setGrievanceForm({...grievanceForm, department: e.target.value})}
                placeholder="Department name"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="griev-category">Category</Label>
                <Select 
                  value={grievanceForm.category} 
                  onValueChange={(value: any) => setGrievanceForm({...grievanceForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workplace Harassment">Workplace Harassment</SelectItem>
                    <SelectItem value="Discrimination">Discrimination</SelectItem>
                    <SelectItem value="Unfair Treatment">Unfair Treatment</SelectItem>
                    <SelectItem value="Working Conditions">Working Conditions</SelectItem>
                    <SelectItem value="Pay & Benefits">Pay & Benefits</SelectItem>
                    <SelectItem value="Management Issues">Management Issues</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="griev-priority">Priority</Label>
                <Select 
                  value={grievanceForm.priority} 
                  onValueChange={(value: any) => setGrievanceForm({...grievanceForm, priority: value})}
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
                <Label htmlFor="griev-target-date">Target Resolution Date</Label>
                <Input
                  id="griev-target-date"
                  type="date"
                  value={grievanceForm.targetResolutionDate}
                  onChange={(e) => setGrievanceForm({...grievanceForm, targetResolutionDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="griev-description">Grievance Description</Label>
              <Textarea
                id="griev-description"
                value={grievanceForm.description}
                onChange={(e) => setGrievanceForm({...grievanceForm, description: e.target.value})}
                placeholder="Detailed description of the grievance..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGrievanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateGrievance} className="bg-blue-600 hover:bg-blue-700">
              Submit Grievance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DisciplinaryManagement; 
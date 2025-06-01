import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PlayIcon, 
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
  PlusIcon,
  EditIcon,
  EyeIcon,
  ArrowRightIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  GraduationCapIcon,
  BellIcon,
  SettingsIcon,
  ZapIcon,
  TimerIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'system_action' | 'condition' | 'delay';
  approver?: string;
  role?: string;
  condition?: string;
  action?: string;
  delay?: number; // hours
  isCompleted: boolean;
  completedAt?: Date;
  comments?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'leave_management' | 'recruitment' | 'performance' | 'compliance' | 'onboarding' | 'payroll';
  priority: 'low' | 'medium' | 'high' | 'critical';
  steps: WorkflowStep[];
  estimatedDuration: number; // hours
  complianceRequired: boolean;
  isActive: boolean;
}

interface WorkflowInstance {
  id: string;
  templateId: string;
  templateName: string;
  initiatedBy: string;
  initiatedAt: Date;
  currentStep: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
  subject: string;
  data: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  steps: WorkflowStep[];
}

export default function Workflows() {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('instances');
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock workflow templates for banking HR
  useEffect(() => {
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Employee Leave Request',
        description: 'Standard leave approval process with manager and HR review',
        category: 'leave_management',
        priority: 'medium',
        estimatedDuration: 24,
        complianceRequired: false,
        isActive: true,
        steps: [
          { id: '1', name: 'Manager Approval', type: 'approval', role: 'Department Head', isCompleted: false },
          { id: '2', name: 'HR Review', type: 'approval', role: 'HR Manager', isCompleted: false },
          { id: '3', name: 'System Update', type: 'system_action', action: 'update_leave_balance', isCompleted: false },
          { id: '4', name: 'Employee Notification', type: 'notification', isCompleted: false }
        ]
      },
      {
        id: '2',
        name: 'Banking License Renewal',
        description: 'Critical compliance workflow for banking license renewals',
        category: 'compliance',
        priority: 'critical',
        estimatedDuration: 72,
        complianceRequired: true,
        isActive: true,
        steps: [
          { id: '1', name: 'Document Verification', type: 'approval', role: 'Compliance Officer', isCompleted: false },
          { id: '2', name: 'Central Bank Submission', type: 'system_action', action: 'submit_to_central_bank', isCompleted: false },
          { id: '3', name: 'Wait for Approval', type: 'delay', delay: 48, isCompleted: false },
          { id: '4', name: 'Finance Review', type: 'approval', role: 'Finance Officer', isCompleted: false },
          { id: '5', name: 'Final Documentation', type: 'system_action', action: 'generate_certificate', isCompleted: false }
        ]
      },
      {
        id: '3',
        name: 'New Employee Onboarding',
        description: 'Comprehensive onboarding process for banking staff',
        category: 'onboarding',
        priority: 'high',
        estimatedDuration: 168, // 1 week
        complianceRequired: true,
        isActive: true,
        steps: [
          { id: '1', name: 'Document Collection', type: 'approval', role: 'HR Manager', isCompleted: false },
          { id: '2', name: 'Background Check', type: 'system_action', action: 'initiate_background_check', isCompleted: false },
          { id: '3', name: 'Security Clearance', type: 'approval', role: 'Security Officer', isCompleted: false },
          { id: '4', name: 'System Access Setup', type: 'system_action', action: 'create_user_accounts', isCompleted: false },
          { id: '5', name: 'Banking Training Assignment', type: 'system_action', action: 'assign_mandatory_training', isCompleted: false },
          { id: '6', name: 'Department Introduction', type: 'approval', role: 'Department Head', isCompleted: false }
        ]
      },
      {
        id: '4',
        name: 'Performance Review Cycle',
        description: 'Annual performance evaluation process',
        category: 'performance',
        priority: 'medium',
        estimatedDuration: 48,
        complianceRequired: false,
        isActive: true,
        steps: [
          { id: '1', name: 'Self Assessment', type: 'system_action', action: 'send_self_assessment', isCompleted: false },
          { id: '2', name: 'Manager Review', type: 'approval', role: 'Department Head', isCompleted: false },
          { id: '3', name: 'HR Validation', type: 'approval', role: 'HR Manager', isCompleted: false },
          { id: '4', name: 'Goal Setting', type: 'approval', role: 'Department Head', isCompleted: false },
          { id: '5', name: 'Final Documentation', type: 'system_action', action: 'generate_performance_report', isCompleted: false }
        ]
      },
      {
        id: '5',
        name: 'AML Certification Renewal',
        description: 'Anti-Money Laundering certification renewal process',
        category: 'compliance',
        priority: 'critical',
        estimatedDuration: 120,
        complianceRequired: true,
        isActive: true,
        steps: [
          { id: '1', name: 'Certification Check', type: 'system_action', action: 'verify_current_certification', isCompleted: false },
          { id: '2', name: 'Training Assignment', type: 'system_action', action: 'assign_aml_training', isCompleted: false },
          { id: '3', name: 'Training Completion', type: 'condition', condition: 'training_completed', isCompleted: false },
          { id: '4', name: 'Exam Scheduling', type: 'system_action', action: 'schedule_certification_exam', isCompleted: false },
          { id: '5', name: 'Compliance Verification', type: 'approval', role: 'Compliance Officer', isCompleted: false },
          { id: '6', name: 'Central Bank Notification', type: 'system_action', action: 'notify_central_bank', isCompleted: false }
        ]
      }
    ];

    const mockInstances: WorkflowInstance[] = [
      {
        id: '1',
        templateId: '1',
        templateName: 'Employee Leave Request',
        initiatedBy: 'Grace Ajak',
        initiatedAt: new Date('2024-01-15T10:00:00'),
        currentStep: 1,
        status: 'in_progress',
        subject: 'Annual Leave - Grace Ajak (5 days)',
        data: { employeeId: '5', leaveDays: 5, leaveType: 'annual', startDate: '2024-02-01' },
        priority: 'medium',
        dueDate: new Date('2024-01-16T10:00:00'),
        steps: mockTemplates[0].steps
      },
      {
        id: '2',
        templateId: '2',
        templateName: 'Banking License Renewal',
        initiatedBy: 'Sarah Akol',
        initiatedAt: new Date('2024-01-10T09:00:00'),
        currentStep: 2,
        status: 'in_progress',
        subject: 'Central Bank License Renewal - 2024',
        data: { licenseType: 'commercial_banking', expiryDate: '2024-03-15' },
        priority: 'critical',
        dueDate: new Date('2024-01-17T17:00:00'),
        steps: mockTemplates[1].steps
      },
      {
        id: '3',
        templateId: '3',
        templateName: 'New Employee Onboarding',
        initiatedBy: 'James Wani',
        initiatedAt: new Date('2024-01-12T14:00:00'),
        currentStep: 3,
        status: 'in_progress',
        subject: 'Onboarding - Ahmed Hassan (Corporate Banking)',
        data: { employeeName: 'Ahmed Hassan', position: 'Relationship Manager', department: 'Corporate Banking' },
        priority: 'high',
        dueDate: new Date('2024-01-19T17:00:00'),
        steps: mockTemplates[2].steps
      },
      {
        id: '4',
        templateId: '4',
        templateName: 'Performance Review Cycle',
        initiatedBy: 'Mary Deng',
        initiatedAt: new Date('2024-01-08T11:00:00'),
        currentStep: 4,
        status: 'completed',
        subject: 'Q4 2023 Performance Review - Personal Banking Team',
        data: { reviewPeriod: 'Q4 2023', department: 'Personal Banking' },
        priority: 'medium',
        dueDate: new Date('2024-01-10T17:00:00'),
        steps: mockTemplates[3].steps.map(step => ({ ...step, isCompleted: true, completedAt: new Date() }))
      },
      {
        id: '5',
        templateId: '5',
        templateName: 'AML Certification Renewal',
        initiatedBy: 'Peter Garang',
        initiatedAt: new Date('2024-01-14T16:00:00'),
        currentStep: 0,
        status: 'pending',
        subject: 'AML Certification Renewal - Finance Team',
        data: { department: 'Finance & Accounting', certificationBody: 'International AML Institute' },
        priority: 'critical',
        dueDate: new Date('2024-01-21T17:00:00'),
        steps: mockTemplates[4].steps
      }
    ];

    setTemplates(mockTemplates);
    setInstances(mockInstances);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'leave_management': return <CalendarIcon className="h-4 w-4" />;
      case 'recruitment': return <UsersIcon className="h-4 w-4" />;
      case 'performance': return <FileTextIcon className="h-4 w-4" />;
      case 'compliance': return <ShieldCheckIcon className="h-4 w-4" />;
      case 'onboarding': return <GraduationCapIcon className="h-4 w-4" />;
      case 'payroll': return <DollarSignIcon className="h-4 w-4" />;
      default: return <FileTextIcon className="h-4 w-4" />;
    }
  };

  const getStepIcon = (type: string, isCompleted: boolean) => {
    if (isCompleted) {
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    }
    
    switch (type) {
      case 'approval': return <UsersIcon className="h-4 w-4 text-blue-600" />;
      case 'notification': return <BellIcon className="h-4 w-4 text-yellow-600" />;
      case 'system_action': return <SettingsIcon className="h-4 w-4 text-purple-600" />;
      case 'condition': return <AlertTriangleIcon className="h-4 w-4 text-orange-600" />;
      case 'delay': return <TimerIcon className="h-4 w-4 text-gray-600" />;
      default: return <FileTextIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleApproveStep = (instanceId: string, stepId: string) => {
    setInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        const updatedSteps = instance.steps.map(step => {
          if (step.id === stepId) {
            return { ...step, isCompleted: true, completedAt: new Date() };
          }
          return step;
        });
        
        const nextStepIndex = instance.currentStep + 1;
        const isLastStep = nextStepIndex >= updatedSteps.length;
        
        return {
          ...instance,
          steps: updatedSteps,
          currentStep: nextStepIndex,
          status: isLastStep ? 'completed' : 'in_progress'
        };
      }
      return instance;
    }));

    addAuditLog('WORKFLOW_STEP_APPROVED', 'WORKFLOWS', { instanceId, stepId });
  };

  const handleRejectStep = (instanceId: string, stepId: string) => {
    setInstances(prev => prev.map(instance => {
      if (instance.id === instanceId) {
        return { ...instance, status: 'rejected' };
      }
      return instance;
    }));

    addAuditLog('WORKFLOW_STEP_REJECTED', 'WORKFLOWS', { instanceId, stepId });
  };

  const filteredInstances = instances.filter(instance => {
    return filterStatus === 'all' || instance.status === filterStatus;
  });

  const pendingApprovals = instances.filter(instance => 
    instance.status === 'in_progress' && 
    instance.steps[instance.currentStep]?.type === 'approval'
  ).length;

  const criticalWorkflows = instances.filter(instance => 
    instance.priority === 'critical' && 
    instance.status === 'in_progress'
  ).length;

  const overdueWorkflows = instances.filter(instance => 
    instance.status === 'in_progress' && 
    new Date() > instance.dueDate
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="text-gray-600 mt-1">Streamline HR processes with automated approval workflows</p>
        </div>
        {hasPermission('*') && (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Workflows</p>
                <p className="text-2xl font-bold text-red-600">{criticalWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-yellow-600">{overdueWorkflows}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalWorkflows > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangleIcon className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalWorkflows} critical workflows</strong> require immediate attention. 
            These include banking compliance and security-related processes.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="instances">Active Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="instances" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Workflow Instances */}
          <div className="space-y-4">
            {filteredInstances.map((instance) => (
              <Card key={instance.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{instance.subject}</h3>
                        <Badge variant="outline" className={getStatusColor(instance.status)}>
                          {instance.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(instance.priority)}>
                          {instance.priority}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Initiated by:</span> {instance.initiatedBy}
                        </div>
                        <div>
                          <span className="font-medium">Started:</span> {instance.initiatedAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span> 
                          <span className={new Date() > instance.dueDate ? 'text-red-600 font-medium' : ''}>
                            {instance.dueDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span> {instance.currentStep + 1}/{instance.steps.length}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {hasPermission('*') && (
                        <Button variant="ghost" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Workflow Steps</h4>
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {instance.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2 min-w-max">
                          <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                            step.isCompleted 
                              ? 'bg-green-50 border-green-200' 
                              : index === instance.currentStep 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-gray-50 border-gray-200'
                          }`}>
                            {getStepIcon(step.type, step.isCompleted)}
                            <div>
                              <p className="text-sm font-medium">{step.name}</p>
                              {step.role && (
                                <p className="text-xs text-gray-500">{step.role}</p>
                              )}
                            </div>
                          </div>
                          {index < instance.steps.length - 1 && (
                            <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Current Step Actions */}
                    {instance.status === 'in_progress' && 
                     instance.steps[instance.currentStep]?.type === 'approval' && 
                     hasPermission('*') && (
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveStep(instance.id, instance.steps[instance.currentStep].id)}
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleRejectStep(instance.id, instance.steps[instance.currentStep].id)}
                        >
                          <XIcon className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getCategoryIcon(template.category)}
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <Badge variant="outline" className={getPriorityColor(template.priority)}>
                          {template.priority}
                        </Badge>
                        {template.complianceRequired && (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            Compliance Required
                          </Badge>
                        )}
                        <Badge variant={template.isActive ? "default" : "secondary"}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{template.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Steps:</span> {template.steps.length}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Est. Duration:</span> {template.estimatedDuration}h
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Category:</span> {template.category.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <PlayIcon className="h-4 w-4" />
                      </Button>
                      {hasPermission('*') && (
                        <Button variant="ghost" size="sm">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Average completion times by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Leave Management</span>
                      <span>18h avg</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Compliance</span>
                      <span>45h avg</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Onboarding</span>
                      <span>120h avg</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span>36h avg</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Impact</CardTitle>
                <CardDescription>Time saved through automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">142 hours</div>
                  <p className="text-sm text-gray-600">Time saved this month</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold text-blue-600">89%</div>
                    <p className="text-xs text-gray-600">Automation Rate</p>
                  </div>
                  <div>
                    <div className="text-xl font-semibold text-purple-600">96%</div>
                    <p className="text-xs text-gray-600">On-time Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
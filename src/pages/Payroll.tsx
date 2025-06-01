import { useState } from "react";
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
  ThumbsDownIcon
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
  paymentStatus: 'Processed' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Failed';
  payDate: string;
  processedBy?: string;
  processedDate?: string;
  employeeApproval?: 'Pending' | 'Approved' | 'Rejected';
  approvalDate?: string;
  approvalNotes?: string;
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
      paymentStatus: "Approved",
      payDate: "2025-01-31",
      processedBy: "Finance Officer",
      processedDate: "2025-01-30",
      employeeApproval: "Approved",
      approvalDate: "2025-01-31"
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
      paymentStatus: "Pending Approval",
      payDate: "2025-01-31",
      processedBy: "Finance Officer",
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
      paymentStatus: "Processed",
      payDate: "2025-01-31",
      processedBy: "Finance Officer",
      processedDate: "2025-01-30",
      employeeApproval: "Approved",
      approvalDate: "2025-01-31"
    },
    {
      id: 4,
      employeeId: "HB004",
      name: "Peter Garang",
      department: "Finance & Accounting",
      position: "Finance Officer",
      baseSalary: 3800,
      allowances: 600,
      overtime: 300,
      grossPay: 4700,
      taxes: 705,
      socialSecurity: 235,
      netPay: 3760,
      bankAccount: "****-3456",
      paymentStatus: "Pending Approval",
      payDate: "2025-01-31",
      processedBy: "Finance Officer",
      processedDate: "2025-01-30",
      employeeApproval: "Rejected",
      approvalDate: "2025-01-31",
      approvalNotes: "Discrepancy in overtime calculation"
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

  const handleProcessPayroll = () => {
    if (!hasPermission('payroll.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PAYROLL', { action: 'process_payroll' });
      return;
    }
    setShowProcessDialog(true);
  };

  const handleBatchProcessPayroll = () => {
    setProcessingPayroll(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const updatedPayroll = payrollData.map(record => {
        if (record.paymentStatus === 'Pending Approval') {
          return {
            ...record,
            paymentStatus: 'Pending Approval' as const,
            processedBy: user?.email || 'System',
            processedDate: new Date().toISOString().split('T')[0],
            employeeApproval: 'Pending' as const
          };
        }
        return record;
      });
      
      setPayrollData(updatedPayroll);
      setProcessingPayroll(false);
      setShowProcessDialog(false);
      
      addAuditLog('PAYROLL_BATCH_PROCESSED', 'PAYROLL', {
        action: 'batch_payroll_processing',
        processedBy: user?.email,
        recordsProcessed: updatedPayroll.filter(r => r.paymentStatus === 'Pending Approval').length
      });
    }, 2000);
  };

  const handleEmployeeApproval = (payrollId: number, approval: 'Approved' | 'Rejected', notes?: string) => {
    const updatedPayroll = payrollData.map(record => {
      if (record.id === payrollId) {
        const newStatus = approval === 'Approved' ? 'Processed' : 'Pending Approval';
        return {
          ...record,
          employeeApproval: approval,
          approvalDate: new Date().toISOString().split('T')[0],
          approvalNotes: notes || '',
          paymentStatus: newStatus as PayrollRecord['paymentStatus']
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
      case "Processed": return "bg-green-100 text-green-800";
      case "Approved": return "bg-blue-100 text-blue-800";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
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
  const pendingApprovals = payrollData.filter(item => item.employeeApproval === 'Pending').length;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll & Goal Management</h1>
          <p className="text-gray-600">Process payroll, manage employee goals, and handle approvals</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('payroll.manage') || hasPermission('*')) && (
            <Button 
              onClick={handleProcessPayroll}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Process Payroll
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
            <strong>Security Notice:</strong> All payroll actions are logged and audited. 
            Ensure compliance with banking regulations and internal policies.
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
                <p className="text-3xl font-bold text-gray-900">{pendingApprovals}</p>
                <p className="text-xs text-gray-500">Employee approvals needed</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payroll">Payroll Management</TabsTrigger>
          <TabsTrigger value="goals">Goal Management</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search employees..."
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
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Pay Period
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

        <TabsContent value="goals" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
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
      </Tabs>

      {/* Process Payroll Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Monthly Payroll</DialogTitle>
            <DialogDescription>
              This will process payroll for all employees and send them for approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> This action will process {payrollData.filter(p => p.paymentStatus === 'Pending Approval').length} pending payroll records.
                Employees will need to approve their salary before payment is released.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Processing Summary</Label>
              <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Employees:</span>
                  <span>{payrollData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Processing:</span>
                  <span>{payrollData.filter(p => p.paymentStatus === 'Pending Approval').length}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>${totalNetPay.toLocaleString()}</span>
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
                  disabled={processingPayroll}
                >
                  {processingPayroll ? (
                    <>
                      <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      Process Payroll
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Payroll Processing</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to process the monthly payroll? This action will send payroll records to employees for approval and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleBatchProcessPayroll}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Confirm Processing
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
                    <span>{selectedLeave.startDate} to {selectedLeave.endDate}</span>
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
    </div>
  );
} 
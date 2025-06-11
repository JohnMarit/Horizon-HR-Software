import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Filter, 
  Download, 
  Search,
  User,
  AlertTriangle,
  FileText,
  Calculator,
  Bell,
  Settings,
  Users,
  TrendingUp,
  Eye,
  MoreVertical,
  Shield,
  Info,
  X,
  Check
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LEAVE_TYPES, 
  validateLeaveRequest, 
  calculateLeaveEntitlement,
  calculateLeaveAccrual,
  PUBLIC_HOLIDAYS_2025,
  getPublicHolidaysInRange,
  calculateWorkingDays,
  generateComplianceReport
} from '@/lib/leaveUtils';
import PublicHolidayManagement from '@/components/PublicHolidayManagement';

// Map comprehensive leave types to database enum values
type DbLeaveType = Database['public']['Enums']['leave_type'];

// Comprehensive Leave Types Configuration with database mapping
const LEAVE_TYPES_CONFIG = {
  annual: { 
    name: 'Annual Leave', 
    color: 'bg-blue-100 text-blue-800',
    defaultEntitlement: 21,
    icon: '🌴',
    dbValue: 'annual' as DbLeaveType
  },
  sick: { 
    name: 'Sick Leave', 
    color: 'bg-orange-100 text-orange-800',
    defaultEntitlement: 10,
    icon: '🏥',
    dbValue: 'sick' as DbLeaveType
  },
  maternity: { 
    name: 'Maternity Leave', 
    color: 'bg-pink-100 text-pink-800',
    defaultEntitlement: 90,
    icon: '👶',
    dbValue: 'maternity' as DbLeaveType
  },
  paternity: { 
    name: 'Paternity Leave', 
    color: 'bg-purple-100 text-purple-800',
    defaultEntitlement: 14,
    icon: '👨‍👶',
    dbValue: 'paternity' as DbLeaveType
  },
  parental: { 
    name: 'Parental Leave', 
    color: 'bg-green-100 text-green-800',
    defaultEntitlement: 30,
    icon: '👨‍👩‍👧‍👦',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  },
  compassionate: { 
    name: 'Compassionate (Bereavement) Leave', 
    color: 'bg-gray-100 text-gray-800',
    defaultEntitlement: 5,
    icon: '🕊️',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  },
  unpaid: { 
    name: 'Unpaid Leave', 
    color: 'bg-slate-100 text-slate-800',
    defaultEntitlement: 0,
    icon: '⏸️',
    dbValue: 'unpaid' as DbLeaveType
  },
  public_holiday: { 
    name: 'Public Holiday Leave', 
    color: 'bg-red-100 text-red-800',
    defaultEntitlement: 12,
    icon: '🎉',
    dbValue: 'annual' as DbLeaveType // Map to annual for now
  },
  study: { 
    name: 'Study or Educational Leave', 
    color: 'bg-yellow-100 text-yellow-800',
    defaultEntitlement: 5,
    icon: '📚',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  },
  official_duty: { 
    name: 'Official Duty or Secondment Leave', 
    color: 'bg-indigo-100 text-indigo-800',
    defaultEntitlement: 0,
    icon: '🏢',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  },
  religious: { 
    name: 'Religious Leave', 
    color: 'bg-amber-100 text-amber-800',
    defaultEntitlement: 3,
    icon: '🕌',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  },
  administrative: { 
    name: 'Administrative Leave', 
    color: 'bg-cyan-100 text-cyan-800',
    defaultEntitlement: 0,
    icon: '📋',
    dbValue: 'emergency' as DbLeaveType // Map to emergency for now
  }
};

interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type: DbLeaveType;
  total_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
  accrued_days?: number;
  carry_over_days?: number;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: DbLeaveType;
  start_date: string;
  end_date: string;
  days_requested: number;
  working_days_requested?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  approved_by?: string;
  approved_date?: string;
  comments?: string;
  attachment_url?: string;
  public_holidays_in_period?: string[];
  employee?: {
    first_name: string;
    last_name: string;
    employee_id: string;
    position: string;
    department_id: string;
    hire_date?: string;
    contract_type?: 'permanent' | 'temporary' | 'contract' | 'probation';
  };
  approver?: {
    first_name: string;
    last_name: string;
  };
}

const LeaveManagement = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showComplianceDialog, setShowComplianceDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [requestForm, setRequestForm] = useState({
    employee_id: user?.id || '',
    leave_type: 'annual' as keyof typeof LEAVE_TYPES,
    start_date: '',
    end_date: '',
    reason: '',
    days_requested: 0,
    attachment: null as File | null
  });

  const queryClient = useQueryClient();

  // Fetch leave requests with enhanced data
  const { data: leaveRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:profiles!employee_id(
            first_name, 
            last_name, 
            employee_id, 
            position, 
            department_id,
            hire_date,
            contract_type
          ),
          approver:profiles!approved_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Enhance requests with working days calculation and holiday information
      const enhancedRequests = data?.map(request => {
        const workingDays = calculateWorkingDays(request.start_date, request.end_date);
        const holidaysInPeriod = getPublicHolidaysInRange(request.start_date, request.end_date);
        
        return {
          ...request,
          working_days_requested: workingDays,
          public_holidays_in_period: holidaysInPeriod.map(h => h.name)
        };
      });

      return enhancedRequests as LeaveRequest[];
    }
  });

  // Fetch leave balances with accrual information
  const { data: leaveBalances, isLoading: balancesLoading } = useQuery({
    queryKey: ['leave-balances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('year', new Date().getFullYear());
      
      if (error) throw error;
      
      // Enhance balances with accrual information
      const enhancedBalances = data?.map(balance => {
        const employee = leaveRequests?.find(r => r.employee_id === balance.employee_id)?.employee;
        if (employee?.hire_date) {
          const entitlement = calculateLeaveEntitlement(
            balance.leave_type as keyof typeof LEAVE_TYPES,
            employee.contract_type || 'permanent',
            employee.hire_date
          );
          
          const accrualInfo = calculateLeaveAccrual(
            balance.leave_type as keyof typeof LEAVE_TYPES,
            entitlement,
            employee.hire_date
          );
          
          return {
            ...balance,
            accrued_days: accrualInfo.accruedToDate,
            total_days: accrualInfo.totalEntitlement
          };
        }
        return balance;
      });

      return enhancedBalances as LeaveBalance[];
    },
    enabled: !!leaveRequests
  });

  // Enhanced leave request submission with validation
  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const employee = leaveRequests?.find(r => r.employee_id === requestData.employee_id)?.employee;
      const currentBalance = leaveBalances?.find(
        b => b.employee_id === requestData.employee_id && 
             b.leave_type === LEAVE_TYPES[requestData.leave_type].dbValue
      );

      // Enhanced validation
      const validation = validateLeaveRequest(
        requestData.leave_type,
        requestData.start_date,
        requestData.end_date,
        currentBalance,
        {
          contractType: employee?.contract_type || 'permanent',
          hireDate: employee?.hire_date || new Date().toISOString()
        }
      );

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Show warnings to user
      if (validation.warnings && validation.warnings.length > 0) {
        toast.warning(`Warnings: ${validation.warnings.join(', ')}`);
      }

      const workingDays = calculateWorkingDays(requestData.start_date, requestData.end_date);
      
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          employee_id: requestData.employee_id,
          leave_type: LEAVE_TYPES[requestData.leave_type].dbValue,
          start_date: requestData.start_date,
          end_date: requestData.end_date,
          days_requested: validation.requestedDays,
          reason: requestData.reason,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      setShowRequestDialog(false);
      resetRequestForm();
      toast.success('Leave request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to submit request: ${error.message}`);
    }
  });

  // Approve/Reject leave request
  const approveRequestMutation = useMutation({
    mutationFn: async ({ requestId, status, comments }: { 
      requestId: string; 
      status: 'approved' | 'rejected'; 
      comments: string 
    }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status,
          approved_by: user?.id,
          approved_date: new Date().toISOString(),
          comments
        })
        .eq('id', requestId)
        .select()
        .single();
      
      if (error) throw error;

      // If approved, update leave balances
      if (status === 'approved') {
        const request = leaveRequests?.find(r => r.id === requestId);
        if (request) {
          // First, get current balance
          const { data: currentBalance, error: fetchError } = await supabase
          .from('leave_balances')
          .select('used_days, remaining_days')
            .eq('employee_id', request.employee_id)
            .eq('leave_type', request.leave_type)
          .eq('year', new Date().getFullYear())
          .single();

          if (fetchError) throw fetchError;

          // Update with calculated values
        const { error: balanceError } = await supabase
          .from('leave_balances')
          .update({
              used_days: (currentBalance.used_days || 0) + request.days_requested,
              remaining_days: (currentBalance.remaining_days || 0) - request.days_requested
          })
            .eq('employee_id', request.employee_id)
            .eq('leave_type', request.leave_type)
          .eq('year', new Date().getFullYear());
        
          if (balanceError) throw balanceError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      setShowApprovalDialog(false);
      setSelectedRequest(null);
      setApprovalNotes('');
      toast.success('Leave request processed successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to process leave request');
      console.error(error);
    }
  });

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const resetRequestForm = () => {
    setRequestForm({
      employee_id: user?.id || '',
      leave_type: 'annual',
      start_date: '',
      end_date: '',
      reason: '',
      days_requested: 0,
      attachment: null
    });
  };

  const getLeaveTypeBadge = (dbType: DbLeaveType, customType?: keyof typeof LEAVE_TYPES) => {
    const leaveTypeEntry = customType ? 
      LEAVE_TYPES[customType] : 
      Object.values(LEAVE_TYPES).find(config => config.dbValue === dbType);
    
    if (!leaveTypeEntry) {
      return (
        <Badge className="bg-gray-100 text-gray-800">
          {dbType}
        </Badge>
      );
    }

    return (
      <Badge className={leaveTypeEntry.color}>
        {leaveTypeEntry.icon} {leaveTypeEntry.name}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (request: LeaveRequest) => {
    const leaveConfig = Object.values(LEAVE_TYPES).find(
      config => config.dbValue === request.leave_type
    );
    
    const isUrgent = leaveConfig?.name === 'Sick Leave' || 
                    leaveConfig?.name === 'Compassionate (Bereavement) Leave' ||
                    leaveConfig?.name === 'Maternity Leave';
    
    if (isUrgent) {
      return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
    }
    
    return null;
  };

  // Filter requests based on search and filters
  const filteredRequests = leaveRequests?.filter(request => {
    const employee = request.employee;
    const matchesSearch = employee ? 
      `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = leaveTypeFilter === 'all' || request.leave_type === leaveTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate dashboard statistics
  const dashboardStats = {
    totalRequests: leaveRequests?.length || 0,
    pendingRequests: leaveRequests?.filter(r => r.status === 'pending').length || 0,
    approvedRequests: leaveRequests?.filter(r => r.status === 'approved').length || 0,
    rejectedRequests: leaveRequests?.filter(r => r.status === 'rejected').length || 0,
    urgentRequests: leaveRequests?.filter(r => {
      const leaveConfig = Object.values(LEAVE_TYPES).find(config => config.dbValue === r.leave_type);
      return (leaveConfig?.name === 'Sick Leave' || leaveConfig?.name === 'Compassionate (Bereavement) Leave') 
             && r.status === 'pending';
    }).length || 0
  };

  const generateComplianceReportData = () => {
    const report = generateComplianceReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leave-compliance-report.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Compliance report generated successfully');
  };

  if (requestsLoading || balancesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leave management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">
            Labour Act 2017 compliant leave management system
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowComplianceDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Compliance Report
          </Button>
          <Button 
            onClick={generateComplianceReportData}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button 
            onClick={() => setShowRequestDialog(true)}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Request Leave
        </Button>
        </div>
      </div>

      {/* Labour Act Compliance Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Labour Act 2017 Compliance:</strong> This system ensures full compliance with South Sudan Labour Act 2017 
          including minimum leave entitlements (21 days annual, 90 days maternity), public holiday integration, 
          and proper working hours calculation.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="holidays">Public Holidays</TabsTrigger>
          <TabsTrigger value="policies">Policies & Settings</TabsTrigger>
          </TabsList>
          
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.totalRequests}</div>
                <p className="text-xs text-gray-600 mt-1">This year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{dashboardStats.pendingRequests}</div>
                <p className="text-xs text-gray-600 mt-1">Awaiting decision</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardStats.approvedRequests}</div>
                <p className="text-xs text-gray-600 mt-1">Successfully approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardStats.rejectedRequests}</div>
                <p className="text-xs text-gray-600 mt-1">Not approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{dashboardStats.urgentRequests}</div>
                <p className="text-xs text-gray-600 mt-1">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
              <CardDescription>
                Latest leave requests across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaveRequests && leaveRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                      <div>
                      <div className="font-medium">
                          {request.employee?.first_name} {request.employee?.last_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {request.employee?.employee_id} • {request.employee?.position}
                    </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLeaveTypeBadge(request.leave_type)}
                      {getStatusBadge(request.status)}
                    {getPriorityBadge(request)}
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Input
                  placeholder="Search employees, ID, or reason..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                    />
                
                <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Leave Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                    <SelectItem value="emergency">Emergency Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                All leave requests with enhanced Labour Act 2017 compliance tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Working Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                          <div>
                          <div className="font-medium">
                              {request.employee?.first_name} {request.employee?.last_name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {request.employee?.employee_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getLeaveTypeBadge(request.leave_type)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(request.start_date).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(request.end_date).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{request.days_requested}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-600">
                          {request.working_days_requested || calculateWorkingDays(request.start_date, request.end_date)}
                        </div>
                        {request.public_holidays_in_period && request.public_holidays_in_period.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Includes holidays
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(request)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                              <Button
                                size="sm"
                            variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                              // Show details dialog
                                }}
                              >
                            <Eye className="h-4 w-4" />
                              </Button>
                          {hasPermission('leave.approve') && request.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApprovalDialog(true);
                            }}
                          >
                              Review
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

        {/* Leave Balances Tab */}
        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances</CardTitle>
              <CardDescription>
                Current leave balances with accrual tracking per Labour Act 2017
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Total Entitlement</TableHead>
                    <TableHead>Accrued</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveBalances?.map((balance) => {
                    const employee = leaveRequests?.find(r => r.employee_id === balance.employee_id)?.employee;
                    const leaveConfig = Object.values(LEAVE_TYPES).find(config => config.dbValue === balance.leave_type);
                    const progressPercentage = (balance.used_days / balance.total_days) * 100;
                  
                  return (
                      <TableRow key={balance.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {employee?.first_name} {employee?.last_name}
                          </div>
                            <div className="text-sm text-gray-600">
                              {employee?.employee_id}
                        </div>
                      </div>
                        </TableCell>
                        <TableCell>
                          {getLeaveTypeBadge(balance.leave_type)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{balance.total_days} days</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-blue-600 font-medium">
                            {balance.accrued_days || balance.total_days} days
                              </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-red-600 font-medium">{balance.used_days} days</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-green-600 font-medium">{balance.remaining_days} days</div>
                        </TableCell>
                        <TableCell>
                          <div className="w-20">
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(progressPercentage)}% used
                            </div>
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

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>
                Visual overview of approved leaves and public holidays
              </CardDescription>
              </CardHeader>
              <CardContent>
              {/* Calendar component would go here */}
              <div className="text-center py-8 text-gray-500">
                Calendar view is being developed with public holiday integration
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        {/* Public Holidays Tab */}
        <TabsContent value="holidays" className="space-y-6">
          <PublicHolidayManagement />
        </TabsContent>

        {/* Policies & Settings Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Policies & Configuration</CardTitle>
              <CardDescription>
                Configure leave types and entitlements according to Labour Act 2017
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(LEAVE_TYPES).map(([key, type]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{type.icon} {type.name}</p>
                      <p className="text-sm text-gray-500">
                        Default entitlement: {type.defaultEntitlement} days • DB Type: {type.dbValue}
                      </p>
                      <p className="text-xs text-gray-400">
                        {type.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        Advance notice: {type.advanceNoticeRequired || 0} days
                      </div>
                      <div className="text-sm text-gray-600">
                        Carry over: {type.carryOverLimit || 0} days
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Leave Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
            <DialogDescription>
              Request time off according to Labour Act 2017 regulations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type *</Label>
                <Select 
                  value={requestForm.leave_type} 
                  onValueChange={(value: any) => setRequestForm({ ...requestForm, leave_type: value })}
                >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAVE_TYPES).map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      {type.icon} {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                <p className="text-xs text-gray-500">
                  {LEAVE_TYPES[requestForm.leave_type]?.description}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Total Days</Label>
                <div className="text-lg font-semibold text-blue-600">
                  {calculateDays(requestForm.start_date, requestForm.end_date)} calendar days
                </div>
                <div className="text-sm text-gray-600">
                  {requestForm.start_date && requestForm.end_date && (
                    <>Working days: {calculateWorkingDays(requestForm.start_date, requestForm.end_date)}</>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={requestForm.start_date}
                  onChange={(e) => setRequestForm({ ...requestForm, start_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={requestForm.end_date}
                  onChange={(e) => setRequestForm({ ...requestForm, end_date: e.target.value })}
                />
              </div>
            </div>

            {/* Show public holidays in selected period */}
            {requestForm.start_date && requestForm.end_date && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {(() => {
                    const holidays = getPublicHolidaysInRange(requestForm.start_date, requestForm.end_date);
                    if (holidays.length > 0) {
                      return `Public holidays in this period: ${holidays.map(h => h.name).join(', ')}`;
                    }
                    return 'No public holidays in the selected period.';
                  })()}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                value={requestForm.reason}
                onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                placeholder="Please provide a reason for your leave request..."
                className="min-h-[100px]"
              />
          </div>

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowRequestDialog(false)}
              >
              Cancel
            </Button>
            <Button 
              onClick={() => submitRequestMutation.mutate(requestForm)}
                disabled={submitRequestMutation.isPending}
            >
              {submitRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>
              Approve or reject this leave request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">Request Details</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <div><strong>Employee:</strong> {selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}</div>
                  <div><strong>Leave Type:</strong> {Object.values(LEAVE_TYPES).find(t => t.dbValue === selectedRequest.leave_type)?.name}</div>
                  <div><strong>Dates:</strong> {new Date(selectedRequest.start_date).toLocaleDateString()} - {new Date(selectedRequest.end_date).toLocaleDateString()}</div>
                  <div><strong>Days:</strong> {selectedRequest.days_requested} calendar days ({selectedRequest.working_days_requested || calculateWorkingDays(selectedRequest.start_date, selectedRequest.end_date)} working days)</div>
                  <div><strong>Reason:</strong> {selectedRequest.reason}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-notes">Comments</Label>
                <Textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add comments about this decision..."
                />
              </div>

              <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
                  onClick={() => setShowApprovalDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => approveRequestMutation.mutate({ 
                    requestId: selectedRequest.id, 
                    status: 'rejected', 
                    comments: approvalNotes 
                  })}
                  disabled={approveRequestMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
                  onClick={() => approveRequestMutation.mutate({ 
                    requestId: selectedRequest.id, 
                    status: 'approved', 
                    comments: approvalNotes 
                  })}
                  disabled={approveRequestMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement; 
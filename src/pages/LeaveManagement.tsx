import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  MoreVertical
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

// Map comprehensive leave types to database enum values
type DbLeaveType = Database['public']['Enums']['leave_type'];

// Comprehensive Leave Types Configuration with database mapping
const LEAVE_TYPES = {
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
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: DbLeaveType;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  approved_by?: string;
  approved_date?: string;
  comments?: string;
  employee?: {
    first_name: string;
    last_name: string;
    employee_id: string;
    position: string;
    department_id: string;
  };
  approver?: {
    first_name: string;
    last_name: string;
  };
}

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showEntitlementDialog, setShowEntitlementDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  const [requestForm, setRequestForm] = useState({
    employee_id: '',
    leave_type: 'annual' as keyof typeof LEAVE_TYPES,
    start_date: '',
    end_date: '',
    reason: '',
    days_requested: 0
  });

  const queryClient = useQueryClient();

  // Fetch leave requests
  const { data: leaveRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:profiles!employee_id(first_name, last_name, employee_id, position, department_id),
          approver:profiles!approved_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LeaveRequest[];
    }
  });

  // Fetch leave balances
  const { data: leaveBalances, isLoading: balancesLoading } = useQuery({
    queryKey: ['leave-balances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('year', new Date().getFullYear());
      
      if (error) throw error;
      return data as LeaveBalance[];
    }
  });

  // Fetch employees
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, employee_id, position, department_id')
        .eq('role', 'employee');
      
      if (error) throw error;
      return data;
    }
  });

  // Submit leave request mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (request: typeof requestForm) => {
      const selectedLeaveType = LEAVE_TYPES[request.leave_type];
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([{
          employee_id: request.employee_id,
          leave_type: selectedLeaveType.dbValue,
          start_date: request.start_date,
          end_date: request.end_date,
          days_requested: request.days_requested,
          reason: request.reason,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request submitted successfully');
      setShowRequestDialog(false);
      resetRequestForm();
    },
    onError: (error) => {
      toast.error('Failed to submit leave request');
      console.error(error);
    }
  });

  // Approve/Reject leave request mutation
  const approveRequestMutation = useMutation({
    mutationFn: async ({ id, action, notes }: { id: string; action: 'approve' | 'reject'; notes: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          approved_date: new Date().toISOString(),
          comments: notes
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;

      // Update leave balance if approved
      if (action === 'approve' && selectedRequest) {
        // First get current balance
        const { data: currentBalance } = await supabase
          .from('leave_balances')
          .select('used_days, remaining_days')
          .eq('employee_id', selectedRequest.employee_id)
          .eq('leave_type', selectedRequest.leave_type)
          .eq('year', new Date().getFullYear())
          .single();

        const { error: balanceError } = await supabase
          .from('leave_balances')
          .update({
            used_days: (currentBalance?.used_days || 0) + selectedRequest.days_requested,
            remaining_days: (currentBalance?.remaining_days || 0) - selectedRequest.days_requested
          })
          .eq('employee_id', selectedRequest.employee_id)
          .eq('leave_type', selectedRequest.leave_type)
          .eq('year', new Date().getFullYear());
        
        if (balanceError) console.error('Error updating balance:', balanceError);
      }

      return data;
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] });
      toast.success(`Leave request ${action}d successfully`);
      setShowApprovalDialog(false);
      setSelectedRequest(null);
      setApprovalNotes('');
    },
    onError: (error) => {
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
      employee_id: '',
      leave_type: 'annual',
      start_date: '',
      end_date: '',
      reason: '',
      days_requested: 0
    });
  };

  const getLeaveTypeBadge = (dbType: DbLeaveType, customType?: keyof typeof LEAVE_TYPES) => {
    // Find the leave type config by database value or custom type
    const leaveTypeEntry = customType ? 
      LEAVE_TYPES[customType] : 
      Object.values(LEAVE_TYPES).find(config => config.dbValue === dbType);
    
    if (!leaveTypeEntry) {
      // Fallback for unknown types
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

  // Filter leave requests
  const filteredRequests = leaveRequests?.filter(request => {
    const matchesSearch = 
      request.employee?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employee?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employee?.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesType = leaveTypeFilter === 'all' || request.leave_type === leaveTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate dashboard statistics
  const stats = {
    pendingRequests: leaveRequests?.filter(r => r.status === 'pending').length || 0,
    approvedToday: leaveRequests?.filter(r => 
      r.status === 'approved' && 
      new Date(r.approved_date || '').toDateString() === new Date().toDateString()
    ).length || 0,
    onLeaveToday: leaveRequests?.filter(r => {
      const today = new Date().toISOString().split('T')[0];
      return r.status === 'approved' && r.start_date <= today && r.end_date >= today;
    }).length || 0,
    rejectedThisMonth: leaveRequests?.filter(r => 
      r.status === 'rejected' &&
      new Date(r.created_at).getMonth() === new Date().getMonth()
    ).length || 0
  };

  useEffect(() => {
    if (requestForm.start_date && requestForm.end_date) {
      const days = calculateDays(requestForm.start_date, requestForm.end_date);
      setRequestForm(prev => ({ ...prev, days_requested: days }));
    }
  }, [requestForm.start_date, requestForm.end_date]);

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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management System</h1>
          <p className="text-gray-600">Comprehensive leave management with entitlement tracking and approval workflows</p>
        </div>
        <Button onClick={() => setShowRequestDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Leave Request
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Dashboard Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-yellow-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
                <p className="text-xs text-muted-foreground">Today's approvals</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.onLeaveToday}</div>
                <p className="text-xs text-muted-foreground">Currently on leave</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected This Month</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejectedThisMonth}</div>
                <p className="text-xs text-muted-foreground">Rejected requests</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests?.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {request.employee?.first_name[0]}{request.employee?.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {request.employee?.first_name} {request.employee?.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getLeaveTypeBadge(request.leave_type)} • {request.days_requested} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(request.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApprovalDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests ({filteredRequests?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests?.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {request.employee?.first_name[0]}{request.employee?.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {request.employee?.first_name} {request.employee?.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{request.employee?.employee_id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getLeaveTypeBadge(request.leave_type)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{request.start_date}</div>
                          <div className="text-gray-500">to {request.end_date}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{request.days_requested}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowApprovalDialog(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowApprovalDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Leave Balances ({new Date().getFullYear()})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {employees?.map((employee) => {
                  const employeeBalances = leaveBalances?.filter(b => b.employee_id === employee.id) || [];
                  
                  return (
                    <Card key={employee.id} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {employee.first_name[0]}{employee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{employee.first_name} {employee.last_name}</p>
                            <p className="text-sm text-gray-500">{employee.employee_id} • {employee.position}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Adjust
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(LEAVE_TYPES).map(([key, type]) => {
                          const balance = employeeBalances.find(b => b.leave_type === type.dbValue);
                          const remaining = balance?.remaining_days || type.defaultEntitlement;
                          const used = balance?.used_days || 0;
                          const total = balance?.total_days || type.defaultEntitlement;
                          const percentage = total > 0 ? (used / total) * 100 : 0;
                          
                          return (
                            <div key={key} className="border rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium">{type.icon} {type.name}</p>
                                <span className="text-sm text-gray-500">{remaining}/{total}</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">
                                {used} days used • {remaining} remaining
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Type Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(LEAVE_TYPES).map(([key, type]) => {
                    const usage = leaveRequests?.filter(r => r.leave_type === type.dbValue && r.status === 'approved').length || 0;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">{type.icon} {type.name}</span>
                        <span className="font-semibold">{usage}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Monthly trend charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Leave Summary Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Employee Balance Report
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Monthly Usage Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Policies</CardTitle>
              <p className="text-sm text-gray-600">
                Configure leave types and entitlements. Note: Some leave types are mapped to existing database categories for compatibility.
              </p>
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
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Leave Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
            <DialogDescription>
              Request leave by providing the necessary details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select value={requestForm.employee_id} onValueChange={(value) => setRequestForm(prev => ({ ...prev, employee_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.first_name} {employee.last_name} ({employee.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select value={requestForm.leave_type} onValueChange={(value: keyof typeof LEAVE_TYPES) => setRequestForm(prev => ({ ...prev, leave_type: value }))}>
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={requestForm.start_date}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, start_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={requestForm.end_date}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, end_date: e.target.value }))}
                  min={requestForm.start_date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {requestForm.start_date && requestForm.end_date && (
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  Total leave days: <strong>{requestForm.days_requested}</strong>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={requestForm.reason}
                onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for this leave request..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => submitRequestMutation.mutate(requestForm)}
              disabled={!requestForm.employee_id || !requestForm.start_date || !requestForm.end_date || !requestForm.reason || submitRequestMutation.isPending}
            >
              {submitRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Leave Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject this leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Request Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Employee:</span>
                    <p className="font-medium">{selectedRequest.employee?.first_name} {selectedRequest.employee?.last_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Employee ID:</span>
                    <p className="font-medium">{selectedRequest.employee?.employee_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Leave Type:</span>
                    <p>{getLeaveTypeBadge(selectedRequest.leave_type)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{selectedRequest.days_requested} days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <p className="font-medium">{selectedRequest.start_date}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium">{selectedRequest.end_date}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reason for Leave</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">{selectedRequest.reason}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-notes">Approval Notes</Label>
                <Textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add your comments..."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your decision will be recorded and the employee will be notified.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => selectedRequest && approveRequestMutation.mutate({ 
                id: selectedRequest.id, 
                action: 'reject', 
                notes: approvalNotes 
              })}
              disabled={!approvalNotes.trim() || approveRequestMutation.isPending}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => selectedRequest && approveRequestMutation.mutate({ 
                id: selectedRequest.id, 
                action: 'approve', 
                notes: approvalNotes 
              })}
              disabled={!approvalNotes.trim() || approveRequestMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement; 
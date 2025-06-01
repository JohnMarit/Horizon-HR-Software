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
import { useAuth } from '@/contexts/AuthContext';
import { 
  DollarSignIcon, 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ThumbsUpIcon, 
  ThumbsDownIcon,
  PlusIcon,
  FileTextIcon,
  AlertTriangleIcon,
  DownloadIcon,
  HistoryIcon,
  UserIcon
} from 'lucide-react';

// Types
interface PaymentApproval {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
  dueDate: string;
  payslipUrl?: string;
}

interface LeaveRequest {
  id: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Maternity Leave' | 'Emergency Leave' | 'Study Leave';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Cancelled';
  submittedDate: string;
  approver?: string;
  approvalDate?: string;
  comments?: string;
}

interface LeaveBalance {
  leaveType: string;
  entitled: number;
  used: number;
  remaining: number;
}

export default function EmployeeDashboard() {
  const { user, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showLeaveRequestDialog, setShowLeaveRequestDialog] = useState(false);
  const [showPaymentApprovalDialog, setShowPaymentApprovalDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentApproval | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Leave request form
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Annual Leave' as const,
    startDate: '',
    endDate: '',
    reason: '',
    days: 0
  });

  // Mock data - In real app, this would come from API
  const [pendingPayments] = useState<PaymentApproval[]>([
    {
      id: 'PAY001',
      employeeId: user?.id || 'HB005',
      employeeName: user?.name || 'Grace Ajak',
      period: 'January 2025',
      basicSalary: 12000,
      allowances: 2000,
      deductions: 1400,
      netPay: 12600,
      status: 'Pending',
      submittedDate: '2025-01-25',
      dueDate: '2025-01-30',
      payslipUrl: '#'
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'LR001',
      leaveType: 'Annual Leave',
      startDate: '2025-02-10',
      endDate: '2025-02-14',
      days: 5,
      reason: 'Family vacation to visit relatives in Wau',
      status: 'Pending Approval',
      submittedDate: '2025-01-15'
    },
    {
      id: 'LR002',
      leaveType: 'Sick Leave',
      startDate: '2025-01-05',
      endDate: '2025-01-07',
      days: 3,
      reason: 'Medical treatment and recovery',
      status: 'Approved',
      submittedDate: '2025-01-03',
      approver: 'Sarah Akol',
      approvalDate: '2025-01-04',
      comments: 'Medical certificate provided. Get well soon!'
    }
  ]);

  const [leaveBalances] = useState<LeaveBalance[]>([
    { leaveType: 'Annual Leave', entitled: 21, used: 8, remaining: 13 },
    { leaveType: 'Sick Leave', entitled: 10, used: 3, remaining: 7 },
    { leaveType: 'Emergency Leave', entitled: 5, used: 0, remaining: 5 },
    { leaveType: 'Study Leave', entitled: 5, used: 0, remaining: 5 }
  ]);

  // Functions
  const calculateLeaveDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  React.useEffect(() => {
    if (leaveForm.startDate && leaveForm.endDate) {
      const days = calculateLeaveDays(leaveForm.startDate, leaveForm.endDate);
      setLeaveForm(prev => ({ ...prev, days }));
    }
  }, [leaveForm.startDate, leaveForm.endDate]);

  const handlePaymentApproval = (action: 'approve' | 'reject') => {
    if (!selectedPayment) return;

    addAuditLog('PAYMENT_APPROVAL_ACTION', 'PAYROLL', {
      paymentId: selectedPayment.id,
      action,
      employeeId: user?.id,
      notes: approvalNotes
    });

    setShowPaymentApprovalDialog(false);
    setSelectedPayment(null);
    setApprovalNotes('');
  };

  const handleLeaveRequest = () => {
    const newRequest: LeaveRequest = {
      id: `LR${String(leaveRequests.length + 1).padStart(3, '0')}`,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: leaveForm.days,
      reason: leaveForm.reason,
      status: 'Pending Approval',
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setShowLeaveRequestDialog(false);
    setLeaveForm({
      leaveType: 'Annual Leave',
      startDate: '',
      endDate: '',
      reason: '',
      days: 0
    });

    addAuditLog('LEAVE_REQUEST_SUBMITTED', 'LEAVE', {
      leaveId: newRequest.id,
      leaveType: newRequest.leaveType,
      days: newRequest.days,
      employeeId: user?.id
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Pending':
      case 'Pending Approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Annual Leave':
        return 'bg-blue-100 text-blue-800';
      case 'Sick Leave':
        return 'bg-orange-100 text-orange-800';
      case 'Maternity Leave':
        return 'bg-pink-100 text-pink-800';
      case 'Emergency Leave':
        return 'bg-red-100 text-red-800';
      case 'Study Leave':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Only allow employees to access this dashboard
  if (user?.role !== 'Employee') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Employee Access Only</h3>
          <p className="mt-2 text-gray-500">This dashboard is only accessible to employees.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowLeaveRequestDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment Approvals</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-amber-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingPayments.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting your approval</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {leaveRequests.filter(r => r.status === 'Pending Approval').length}
                </div>
                <p className="text-xs text-muted-foreground">Pending approval</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {leaveBalances.find(b => b.leaveType === 'Annual Leave')?.remaining || 0}
                </div>
                <p className="text-xs text-muted-foreground">Annual leave days</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {leaveRequests.filter(r => new Date(r.submittedDate).getMonth() === new Date().getMonth()).length}
                </div>
                <p className="text-xs text-muted-foreground">Leave requests submitted</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Payment Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5" />
                  Pending Payment Approvals
                </CardTitle>
                <CardDescription>
                  Payments requiring your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingPayments.length > 0 ? (
                  <div className="space-y-4">
                    {pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{payment.period} Payroll</h4>
                          <p className="text-sm text-gray-500">Net Pay: SSP {payment.netPay.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Due: {payment.dueDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(payment.status)}
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowPaymentApprovalDialog(true);
                            }}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSignIcon className="mx-auto h-8 w-8 mb-2" />
                    <p>No pending payment approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Recent Leave Requests
                </CardTitle>
                <CardDescription>
                  Your latest leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{request.leaveType}</h4>
                        <p className="text-sm text-gray-500">{request.days} days • {request.startDate}</p>
                        <p className="text-xs text-gray-400">Submitted: {request.submittedDate}</p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payment Approvals Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Approvals</CardTitle>
              <CardDescription>
                Review and approve your payroll payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Allowances</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.period}</TableCell>
                        <TableCell>SSP {payment.basicSalary.toLocaleString()}</TableCell>
                        <TableCell>SSP {payment.allowances.toLocaleString()}</TableCell>
                        <TableCell>SSP {payment.deductions.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">SSP {payment.netPay.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{payment.dueDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowPaymentApprovalDialog(true);
                              }}
                            >
                              Review
                            </Button>
                            {payment.payslipUrl && (
                              <Button size="sm" variant="outline">
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <DollarSignIcon className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Payment Approvals</h3>
                  <p>All your payments have been processed or approved.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Management Tab */}
        <TabsContent value="leave" className="space-y-6">
          {/* Leave Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaveBalances.map((balance) => (
              <Card key={balance.leaveType}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{balance.leaveType}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">{balance.remaining}</span>
                    <span className="text-sm text-gray-500">of {balance.entitled}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(balance.remaining / balance.entitled) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{balance.used} used</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Leave Requests</CardTitle>
                  <CardDescription>Track your submitted leave applications</CardDescription>
                </div>
                <Button onClick={() => setShowLeaveRequestDialog(true)}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{request.startDate}</div>
                          <div className="text-gray-500">to {request.endDate}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{request.days}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{request.submittedDate}</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Activity History
              </CardTitle>
              <CardDescription>
                Your recent payment and leave activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be populated with actual activity data */}
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Leave request approved</h4>
                    <p className="text-sm text-gray-500">3-day sick leave approved by Sarah Akol</p>
                    <p className="text-xs text-gray-400">January 4, 2025</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <DollarSignIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Payment approved</h4>
                    <p className="text-sm text-gray-500">December 2024 payroll processed</p>
                    <p className="text-xs text-gray-400">December 30, 2024</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <ClockIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Leave request submitted</h4>
                    <p className="text-sm text-gray-500">5-day annual leave for family vacation</p>
                    <p className="text-xs text-gray-400">January 15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Approval Dialog */}
      <Dialog open={showPaymentApprovalDialog} onOpenChange={setShowPaymentApprovalDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Payment</DialogTitle>
            <DialogDescription>
              Review your payment details and approve or reject.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-3">Payment Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Period:</span>
                    <p className="font-medium">{selectedPayment.period}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Basic Salary:</span>
                    <p className="font-medium">SSP {selectedPayment.basicSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Allowances:</span>
                    <p className="font-medium">SSP {selectedPayment.allowances.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Deductions:</span>
                    <p className="font-medium">SSP {selectedPayment.deductions.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t">
                    <span className="text-gray-600">Net Pay:</span>
                    <p className="text-lg font-bold text-green-600">SSP {selectedPayment.netPay.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approval-notes">Notes (Optional)</Label>
                <Textarea
                  id="approval-notes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any comments or concerns..."
                  rows={3}
                />
              </div>

              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  By approving, you confirm that the payment details are correct and authorize the payment processing.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handlePaymentApproval('reject')}
            >
              <ThumbsDownIcon className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handlePaymentApproval('approve')}
            >
              <ThumbsUpIcon className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Request Dialog */}
      <Dialog open={showLeaveRequestDialog} onOpenChange={setShowLeaveRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Submit a new leave request for approval.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <Select value={leaveForm.leaveType} onValueChange={(value: any) => setLeaveForm(prev => ({ ...prev, leaveType: value }))}>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {leaveForm.days > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Duration:</strong> {leaveForm.days} working days
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea
                id="reason"
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for your leave request..."
                rows={3}
              />
            </div>

            {/* Leave balance check */}
            {leaveForm.leaveType && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Available {leaveForm.leaveType}:</span>
                  <span className="font-medium">
                    {leaveBalances.find(b => b.leaveType === leaveForm.leaveType)?.remaining || 0} days
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLeaveRequestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLeaveRequest}
              disabled={!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
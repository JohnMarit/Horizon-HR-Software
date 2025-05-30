
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const LeaveManagement = () => {
  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employee:profiles!employee_id(first_name, last_name, employee_id),
          approver:profiles!approved_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  const getLeaveTypeBadge = (type: string) => {
    const variants = {
      annual: 'bg-blue-100 text-blue-800',
      sick: 'bg-orange-100 text-orange-800',
      maternity: 'bg-pink-100 text-pink-800',
      paternity: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      unpaid: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[type as keyof typeof variants] || variants.annual}>
        {type}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading leave requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Manage employee leave requests and balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests?.filter(req => req.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests?.filter(req => 
                req.status === 'approved' && 
                new Date(req.approved_date || '').toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests?.filter(req => {
                const today = new Date().toISOString().split('T')[0];
                return req.status === 'approved' && 
                       req.start_date <= today && 
                       req.end_date >= today;
              }).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected This Month</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests?.filter(req => 
                req.status === 'rejected' &&
                new Date(req.created_at || '').getMonth() === new Date().getMonth()
              ).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
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
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {request.employee ? 
                          `${request.employee.first_name} ${request.employee.last_name}` : 
                          'Unknown Employee'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.employee?.employee_id}
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
                  <TableCell>{request.days_requested}</TableCell>
                  <TableCell>{getStatusBadge(request.status || 'pending')}</TableCell>
                  <TableCell>
                    {new Date(request.created_at || '').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;
